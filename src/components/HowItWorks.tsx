'use client'

import { Plus, Brain, Bell, TrendingUp } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: <Plus className="w-8 h-8 text-white" />,
    title: 'Add your ingredients',
    description: 'Tell Bingine what you have — via voice, text, or photo. It remembers everything.',
    example: '"5kg chicken breast, expires July 28"',
  },
  {
    number: '02',
    icon: <Brain className="w-8 h-8 text-white" />,
    title: 'Bingine tracks & remembers',
    description: 'Our AI builds a knowledge graph of your kitchen. Every item, every expiry date, every recipe.',
    example: 'Chicken → expires July 28 → use in stir-fry or Caesar salad',
  },
  {
    number: '03',
    icon: <Bell className="w-8 h-8 text-white" />,
    title: 'Get smart alerts',
    description: 'When something is about to expire, Bingine notifies you with recipe ideas and action options.',
    example: '<SmartPhone /> "Chicken expires tomorrow! Try this 15-min stir-fry recipe"',
  },
  {
    number: '04',
    icon: <TrendingUp className="w-8 h-8 text-white" />,
    title: 'Reduce waste, save money',
    description: 'Track your progress over time. See how much food and money you\'ve saved.',
    example: '<ChartBar /> "This month: 34% less waste, $420 saved"',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-white to-bingine-green/5">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How Bingine works
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Four simple steps to zero food waste. No complicated setup, no cloud required.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row items-start gap-8 p-8 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Step number with icon */}
              <div className="flex-shrink-0 w-16 h-16 bg-bingine-green text-white rounded-2xl flex items-center justify-center">
                {step.icon}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-lg mb-4">
                  {step.description}
                </p>
                <div className="inline-block px-4 py-2 bg-bingine-green/5 text-bingine-green rounded-lg font-mono text-sm">
                  {step.example}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
