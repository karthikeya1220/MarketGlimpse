'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Shield, Zap, LineChart, Bell, Brain, Lock, Sparkles } from 'lucide-react';

const features = [
  {
    icon: TrendingUp,
    title: 'Real-time Market Data',
    description: 'Access live stock prices, market metrics, and company information with intelligent caching for optimal performance.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Brain,
    title: 'AI-Powered Insights',
    description: 'Leverage Google Gemini AI for personalized investment recommendations and market analysis tailored to your portfolio.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Bell,
    title: 'Smart Watchlists',
    description: 'Create and manage personalized watchlists with real-time updates and instant notifications for your favorite stocks.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: LineChart,
    title: 'Advanced Charting',
    description: 'Interactive TradingView widgets with technical indicators, drawing tools, and multiple timeframes for deep analysis.',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Built with Next.js 16 and React 19 for blazing-fast performance and seamless user experience.',
    gradient: 'from-yellow-500 to-amber-500',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level security with Better Auth, rate limiting, input validation, and encrypted data storage.',
    gradient: 'from-indigo-500 to-blue-500',
  },
  {
    icon: Sparkles,
    title: 'Market News Feed',
    description: 'Stay informed with curated news articles tailored to your watchlist. Never miss important market movements.',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: Lock,
    title: 'Privacy First',
    description: 'Your data is yours. We never sell your information and use industry-standard encryption to protect your privacy.',
    gradient: 'from-teal-500 to-cyan-500',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-20 overflow-hidden">
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
            Everything You Need to{' '}
            <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
              Succeed
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-400">
            Powerful features designed to help you make smarter investment decisions
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="relative p-6 overflow-hidden transition-all border rounded-2xl bg-gray-900/50 border-gray-800 backdrop-blur-sm group hover:border-gray-700"
              >
                {/* Gradient glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className={`relative mb-4 inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="relative mb-2 text-xl font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="relative text-sm leading-relaxed text-gray-400">
                  {feature.description}
                </p>

                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className={`absolute top-0 right-0 w-full h-full bg-gradient-to-bl ${feature.gradient} blur-2xl`} />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
