'use client'

import { useState, useEffect, useRef } from 'react'
import { Copy, Github, BookOpen, MessageCircle } from '@phosphor-icons/react'

// Typewriter hook
function useTypewriter(text: string, speed: number = 38, startDelay: number = 600) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      let i = 0
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1))
          i++
        } else {
          setDone(true)
          clearInterval(interval)
        }
      }, speed)
      return () => clearInterval(interval)
    }, startDelay)
    return () => clearTimeout(timeout)
  }, [text, speed, startDelay])

  return { displayed, done }
}

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showButtons, setShowButtons] = useState(false)
  const { displayed, done } = useTypewriter(
    'Glad you stopped in. Good taste tends to find us. Now, what are we building?'
  )

  // Smooth mouse scrub video with easing
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let currentScrub = 0
    let targetScrub = 0
    let isVideoReady = false
    const SMOOTHING = 0.03 // Lower = smoother (0.03 = buttery smooth)
    const SENSITIVITY = 1.5
    const SCRUB_RANGE = 0.35

    // Wait for video metadata
    const handleLoaded = () => {
      isVideoReady = true
      video.currentTime = video.duration * 0.35
    }

    // Track mouse X position
    const handleMouseMove = (e: MouseEvent) => {
      const normalizedX = e.clientX / window.innerWidth
      targetScrub = (normalizedX - 0.5) * SENSITIVITY
    }

    // Smooth animation loop
    const animate = () => {
      if (isVideoReady && video.duration) {
        // Ease toward target (exponential decay)
        currentScrub += (targetScrub - currentScrub) * SMOOTHING
        
        // Clamp and calculate time
        const clampedScrub = Math.max(-1, Math.min(1, currentScrub))
        const baseTime = video.duration * 0.35
        const offset = clampedScrub * video.duration * SCRUB_RANGE
        const targetTime = Math.max(0, Math.min(video.duration, baseTime + offset))
        
        // Only update if moved enough (reduces micro-jitter)
        if (Math.abs(video.currentTime - targetTime) > 0.015) {
          video.currentTime = targetTime
        }
      }
      requestAnimationFrame(animate)
    }
    
    video.addEventListener('loadedmetadata', handleLoaded)
    window.addEventListener('mousemove', handleMouseMove)
    animate()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      video.removeEventListener('loadedmetadata', handleLoaded)
    }
  }, [])

  // Show buttons after 400ms
  useEffect(() => {
    const timer = setTimeout(() => setShowButtons(true), 400)
    return () => clearTimeout(timer)
  }, [])

  const copyEmail = () => {
    navigator.clipboard.writeText('hello@xpiri.ai')
  }

  return (
    <>
      {/* Background Video */}
      <video
        ref={videoRef}
        className="fixed inset-0 w-full h-full object-cover z-0"
        style={{ objectPosition: '70% center' }}
        muted
        playsInline
        preload="auto"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4"
          type="video/mp4"
        />
      </video>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-10 px-5 sm:px-8 py-4 sm:py-5 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <span
            className="text-[21px] sm:text-[26px] tracking-tight text-black"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Xpiri
          </span>
          <span className="text-[25px] sm:text-[30px] text-black select-none" style={{ letterSpacing: '-0.02em' }}>
            ✳︎
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2 text-[23px] text-black">
          <a href="#features" className="hover:opacity-60 transition-opacity">Features</a>
          <span className="opacity-40">,</span>
          <a href="#how-it-works" className="hover:opacity-60 transition-opacity">How It Works</a>
          <span className="opacity-40">,</span>
          <a href="#pricing" className="hover:opacity-60 transition-opacity">Pricing</a>
          <span className="opacity-40">,</span>
          <a href="https://github.com/xi-kki/xpiri" className="hover:opacity-60 transition-opacity">GitHub</a>
        </div>

        {/* Desktop CTA */}
        <a
          href="/dashboard"
          className="hidden md:block text-[23px] text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
        >
          Get Started
        </a>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`w-6 h-[2px] bg-black transition-all duration-300 ${
              menuOpen ? 'rotate-45 translate-y-[7px]' : ''
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-black transition-all duration-300 ${
              menuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-black transition-all duration-300 ${
              menuOpen ? '-rotate-45 -translate-y-[7px]' : ''
            }`}
          />
        </button>
      </nav>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 z-9 bg-white/95 backdrop-blur-sm flex flex-col items-start justify-center px-8 gap-8 transition-all duration-300 md:hidden ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <a href="#features" className="text-[32px] font-medium text-black" onClick={() => setMenuOpen(false)}>Features</a>
        <a href="#how-it-works" className="text-[32px] font-medium text-black" onClick={() => setMenuOpen(false)}>How It Works</a>
        <a href="#pricing" className="text-[32px] font-medium text-black" onClick={() => setMenuOpen(false)}>Pricing</a>
        <a href="https://github.com/xi-kki/xpiri" className="text-[32px] font-medium text-black" onClick={() => setMenuOpen(false)}>GitHub</a>
        <a href="/dashboard" className="text-[32px] font-medium text-black underline" onClick={() => setMenuOpen(false)}>Get Started</a>
      </div>

      {/* Hero Section */}
      <section className="relative z-1 h-screen flex flex-col justify-end pb-12 md:justify-center md:pb-0 px-5 sm:px-8 md:px-10 overflow-hidden">
        <div className="max-w-xl relative z-10">
          {/* Blurred Intro Label */}
          <div className="pointer-events-none select-none mb-5 sm:mb-6" style={{ filter: 'blur(4px)' }}>
            <p
              className="text-black font-normal"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(18px, 4vw, 26px)',
                lineHeight: 1.3,
              }}
            >
              Hey there, meet Xpiri,<br />
              Your Offline AI for Food Waste Tracking
            </p>
          </div>

          {/* Typewriter Text */}
          <p
            className="text-black mb-5 sm:mb-6 min-h-[54px]"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(18px, 4vw, 26px)',
              lineHeight: 1.35,
              fontWeight: 400,
            }}
          >
            {displayed}
            {!done && (
              <span
                className="inline-block w-[2px] h-[1.1em] bg-black align-middle ml-[2px]"
                style={{ animation: 'blink 1s step-end infinite' }}
              />
            )}
          </p>

          {/* Action Pill Buttons */}
          <div
            className={`flex flex-wrap gap-y-1 transition-all duration-400 ${
              showButtons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
            style={{ transition: 'opacity 0.4s ease, transform 0.4s ease' }}
          >
            {/* Single CTA Button */}
            <a
              href="/dashboard"
              className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Start Tracking Free
            </a>
          </div>
        </div>
      </section>

      {/* Blink Animation */}
      <style jsx global>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </>
  )
}
