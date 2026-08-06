'use client'

import { Check, Sparkles, Rocket } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Everything you need to stop wasting food.',
    features: [
      'Unlimited food items & categories',
      'Voice, text & photo entry',
      'Expiry alerts & recipe suggestions',
      '100% offline — data stays on your device',
      'Open source & community supported',
    ],
    cta: 'Start Tracking Free',
    href: '/dashboard',
    featured: true,
  },
  {
    name: 'Pro',
    price: 'Soon',
    period: '',
    description: 'For teams and commercial kitchens.',
    features: [
      'Multi-user kitchen workspaces',
      'Advanced waste analytics & reports',
      'Telegram / WhatsApp / SMS alerts',
      'Cloud sync & team sharing',
      'Priority support',
    ],
    cta: 'Join the waitlist',
    href: 'https://github.com/xi-kki/bingine',
    featured: false,
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6 bg-gradient-to-b from-white to-bingine-green/5">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple pricing
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Bingine is free forever and open source. No subscriptions, no surprise fees.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-8 rounded-2xl ${
                plan.featured
                  ? 'bg-white shadow-lg ring-2 ring-bingine-green'
                  : 'bg-white/70 border border-gray-200'
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-8 inline-flex items-center gap-1.5 bg-bingine-green text-white text-xs font-semibold px-3 py-1 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  Most popular
                </span>
              )}

              <h3 className="text-xl font-semibold text-gray-900 mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                {plan.period && <span className="text-gray-500">{plan.period}</span>}
              </div>
              <p className="text-gray-500 mb-6">{plan.description}</p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-gray-700">
                    <Check className="w-5 h-5 text-bingine-green shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href={plan.href}
                className={`block text-center px-8 py-3.5 rounded-full font-semibold transition-all ${
                  plan.featured
                    ? 'bg-bingine-green text-white hover:bg-bingine-green/90 hover:scale-[1.02]'
                    : 'border-2 border-bingine-green text-bingine-green hover:bg-bingine-green/5'
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-400 mt-10 flex items-center justify-center gap-1.5">
          <Rocket className="w-4 h-4" />
          Built in the open — star us on GitHub to follow development
        </p>
      </div>
    </section>
  )
}
