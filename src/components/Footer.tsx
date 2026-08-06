'use client'

import { Leaf, Code2, MessageCircle, AtSign } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="py-12 px-6 bg-gray-50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-bingine-green" />
            <span className="text-2xl font-bold text-bingine-green">Bingine</span>
            <span className="text-sm text-gray-400">v1.0.0</span>
          </div>

          {/* Links — all point to real destinations */}
          <div className="flex gap-6 text-gray-500">
            <a href="https://github.com/xi-kki/bingine#readme" className="hover:text-bingine-green transition-colors">Docs</a>
            <a href="https://github.com/xi-kki/bingine" className="hover:text-bingine-green transition-colors flex items-center gap-1">
              <Code2 className="w-4 h-4" />
              GitHub
            </a>
            <a href="https://github.com/xi-kki/bingine/discussions" className="hover:text-bingine-green transition-colors flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              Discussions
            </a>
            <a href="https://github.com/xi-kki/bingine/issues" className="hover:text-bingine-green transition-colors flex items-center gap-1">
              <AtSign className="w-4 h-4" />
              Issues
            </a>
          </div>

          {/* Tagline */}
          <p className="text-gray-400 text-sm flex items-center gap-1">
            <Leaf className="w-4 h-4" />
            Never let good food go bad.
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-100 text-center text-gray-400 text-sm">
          © 2026 Bingine. Open source under MIT License.
        </div>
      </div>
    </footer>
  )
}
