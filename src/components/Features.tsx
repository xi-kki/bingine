'use client'

import { Brain, ChefHat, Bell, Lock, TrendingUp, TreePine } from 'lucide-react'

const features = [
  {
    icon: <Brain className="w-10 h-10 text-bingine-green" />,
    title: 'Smart Expiry Tracking',
    description: 'Bingine remembers every ingredient, its expiry date, and storage location. No more forgotten items in the back of your fridge.',
  },
  {
    icon: <ChefHat className="w-10 h-10 text-bingine-green" />,
    title: 'Recipe Suggestions',
    description: 'Get recipe ideas based on what\'s about to expire. Use it before you lose it.',
  },
  {
    icon: <Bell className="w-10 h-10 text-bingine-green" />,
    title: 'Instant Alerts',
    description: 'Get notified via Telegram, WhatsApp, or SMS when items are expiring. Never miss a beat.',
  },
  {
    icon: <Lock className="w-10 h-10 text-bingine-green" />,
    title: '100% Offline',
    description: 'Your data stays on your device. No cloud, no tracking, no privacy concerns. Your kitchen, your data.',
  },
  {
    icon: <TrendingUp className="w-10 h-10 text-bingine-green" />,
    title: 'Waste Analytics',
    description: 'Track your waste reduction over time. See how much you\'ve saved and where you can improve.',
  },
  {
    icon: <TreePine className="w-10 h-10 text-bingine-green" />,
    title: 'Donate & Compost',
    description: 'Route near-expiry items to local food banks or composting. Reduce waste, help the community.',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Everything you need to stop food waste
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Bingine combines smart tracking, AI-powered suggestions, and real-time alerts 
            to help you use every ingredient before it goes bad.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl border border-gray-100 hover:border-bingine-fresh/30 hover:shadow-lg transition-all group"
            >
              <div className="mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
