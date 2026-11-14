/* Bingine service worker — true offline support.
 *
 * Strategy: cache-first with runtime caching.
 * - Precaches the app shell on install (pages, icons, poster).
 * - Every successfully fetched response (including the hero video and
 *   fonts) is cached at runtime, so after ONE visit the whole app —
 *   landing, dashboard, video, icons — works fully offline.
 * - Navigation requests fall back to cached HTML (clean URLs like
 *   /dashboard resolve to their .html file in the cache).
 *
 * Version the cache on every deploy so users get fresh assets.
 */
const CACHE_VERSION = 'bingine-v1.0.1'
const CACHE_NAME = `${CACHE_VERSION}`

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/dashboard',
  '/dashboard.html',
  '/404.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/maskable-192.png',
  '/icons/maskable-512.png',
  '/bingine-poster.jpg',
]

// Install: precache the shell, take control immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  )
})

// Activate: clean up old cache versions, claim clients so the new SW
// is active right away (no double-refresh needed)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME && key.startsWith('bingine-'))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event

  // Only handle GET requests from same-origin or the known CDNs
  const url = new URL(request.url)
  const isSameOrigin = url.origin === self.location.origin
  const isAllowedCdn =
    url.hostname === 'db.onlinewebfonts.com' ||
    url.hostname.endsWith('.cloudfront.net')
  if (request.method !== 'GET' || (!isSameOrigin && !isAllowedCdn)) return

  // Don't cache requests larger than 8MB (the hero video is ~4.5MB, fits)
  const MAX_CACHE_BYTES = 8 * 1024 * 1024

  // Navigation requests: try network first, then cache; if offline and
  // uncached, serve the app shell so the user always lands somewhere.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          return response
        })
        .catch(() =>
          caches
            .match(request)
            .then((cached) =>
              cached ||
              caches.match('/index.html') ||
              caches.match('/dashboard.html')
            )
        )
    )
    return
  }

  // Static assets: cache-first with network fallback, populate cache
  // on first network success.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached

      return fetch(request).then((response) => {
        // Only cache valid, small-enough responses
        if (response.ok && Number(response.headers.get('content-length') || 0) <= MAX_CACHE_BYTES) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
        }
        return response
      })
    })
  )
})
