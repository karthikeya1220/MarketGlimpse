'use client';

import { motion } from 'framer-motion';
import { UserPlus, Search, Eye, TrendingUp } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    number: '01',
    title: 'Create Your Account',
    description: 'Sign up in seconds with your email. No credit card required for the free trial.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Search,
    number: '02',
    title: 'Search & Discover',
    description: 'Use our powerful search to find stocks, ETFs, and securities from markets worldwide.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Eye,
    number: '03',
    title: 'Build Your Watchlist',
    description: 'Add your favorite stocks to personalized watchlists and get real-time updates.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: TrendingUp,
    number: '04',
    title: 'Get AI Insights',
    description: 'Receive personalized recommendations and market analysis powered by advanced AI.',
    color: 'from-orange-500 to-red-500',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="container relative z-10 px-4 mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            How It{' '}
            <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
              Works
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-400">
            Get started with MarketGlimpse in four simple steps
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute hidden lg:block top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 opacity-20" />

          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Number Badge */}
                  <div className="relative mb-6">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center transform rotate-3 hover:rotate-6 transition-transform`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gray-900 border-2 border-gray-800 flex items-center justify-center">
                      <span className="text-sm font-bold text-white">{step.number}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="mb-3 text-xl font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Decorative Dot */}
                  <div className={`hidden lg:block absolute top-[88px] left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br ${step.color} shadow-lg`} />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-400">
            Ready to get started?{' '}
            <a href="#pricing" className="font-semibold text-blue-400 hover:text-blue-300">
              Choose your plan →
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
