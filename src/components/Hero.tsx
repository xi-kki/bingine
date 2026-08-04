'use client'

import { Leaf, Code2 } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-bingine-green/10 to-white">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-bingine-fresh/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-bingine-warning/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <Leaf className="w-16 h-16 md:w-20 md:h-20 text-bingine-green" strokeWidth={1.5} />
          <h1 className="text-6xl md:text-8xl font-bold text-bingine-green tracking-tight">
            Bingine
          </h1>
        </div>

        {/* Tagline */}
        <p className="text-2xl md:text-3xl text-gray-700 mb-4 font-medium">
          Never let good food go bad.
        </p>

        {/* Description */}
        <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto text-balance">
          Offline AI agent that tracks your ingredients, suggests recipes before expiry, 
          and reduces food waste — all running locally on your device.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/dashboard" className="px-8 py-4 bg-bingine-green text-white rounded-full font-semibold text-lg hover:bg-bingine-green/90 transition-all hover:scale-105 shadow-lg shadow-bingine-green/25 text-center flex items-center justify-center gap-2">
            <Leaf className="w-5 h-5" />
            Get Started Free
          </a>
          <a href="https://github.com/xi-kki/bingine" className="px-8 py-4 border-2 border-bingine-green text-bingine-green rounded-full font-semibold text-lg hover:bg-bingine-green/5 transition-all text-center flex items-center justify-center gap-2">
            <Code2 className="w-5 h-5" />
            View on GitHub
          </a>
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-bingine-fresh rounded-full" />
            100% Offline
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-bingine-fresh rounded-full" />
            Open Source
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-bingine-fresh rounded-full" />
            Privacy First
          </span>
        </div>
      </div>
    </section>
  )
}
