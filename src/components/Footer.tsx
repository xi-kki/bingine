export default function Footer() {
  return (
    <footer className="py-12 px-6 bg-gray-50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-xpiri-green">Xpiri</span>
            <span className="text-sm text-gray-400">v1.0.0</span>
          </div>

          {/* Links */}
          <div className="flex gap-6 text-gray-500">
            <a href="#" className="hover:text-xpiri-green transition-colors">Docs</a>
            <a href="#" className="hover:text-xpiri-green transition-colors">GitHub</a>
            <a href="#" className="hover:text-xpiri-green transition-colors">Discord</a>
            <a href="#" className="hover:text-xpiri-green transition-colors">Twitter</a>
          </div>

          {/* Tagline */}
          <p className="text-gray-400 text-sm">
            Never let good food go bad.
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-100 text-center text-gray-400 text-sm">
          © 2024 Xpiri. Open source under MIT License.
        </div>
      </div>
    </footer>
  )
}
