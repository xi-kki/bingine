'use client'

import { Leaf, Code2, ArrowRight, Star, MessageCircle, AtSign } from 'lucide-react'

export default function CTA() {
  return (
    <section className="py-24 px-6 bg-bingine-green">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to stop wasting food?
        </h2>
        <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
          Join food tech founders who are building sustainable kitchens with Bingine. 
          Open source, free forever, runs offline.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/dashboard" className="px-8 py-4 bg-white text-bingine-green rounded-full font-semibold text-lg hover:bg-white/90 transition-all hover:scale-105 shadow-lg text-center flex items-center justify-center gap-2">
            <Leaf className="w-5 h-5" />
            Start Tracking Now
            <ArrowRight className="w-5 h-5" />
          </a>
          <a href="https://github.com/xi-kki/bingine" className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white/10 transition-all text-center flex items-center justify-center gap-2">
            <Code2 className="w-5 h-5" />
            View on GitHub
          </a>
        </div>

        {/* Social proof */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/60 text-sm">
          <span className="flex items-center gap-2"><Star className="w-4 h-4" /> Star us on GitHub</span>
          <span className="flex items-center gap-2"><MessageCircle className="w-4 h-4" /> Join our Discord</span>
          <span className="flex items-center gap-2"><AtSign className="w-4 h-4" /> Follow @BingineAI</span>
        </div>
      </div>
    </section>
  )
}
