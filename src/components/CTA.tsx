export default function CTA() {
  return (
    <section className="py-24 px-6 bg-xpiri-green">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to stop wasting food?
        </h2>
        <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
          Join food tech founders who are building sustainable kitchens with Xpiri. 
          Open source, free forever, runs offline.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-white text-xpiri-green rounded-full font-semibold text-lg hover:bg-white/90 transition-all hover:scale-105 shadow-lg">
            Start Tracking Now
          </button>
          <button className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white/10 transition-all">
            View on GitHub
          </button>
        </div>

        {/* Social proof */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/60 text-sm">
          <span>⭐ Star us on GitHub</span>
          <span>💬 Join our Discord</span>
          <span>🐦 Follow @XpiriAI</span>
        </div>
      </div>
    </section>
  )
}
