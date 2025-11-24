'use client';

import { motion } from 'framer-motion';
import { Users, TrendingUp, Clock, Award } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: '10K+',
    label: 'Active Users',
    description: 'Trust MarketGlimpse',
  },
  {
    icon: TrendingUp,
    value: '99.9%',
    label: 'Uptime',
    description: 'Reliable service',
  },
  {
    icon: Clock,
    value: '<100ms',
    label: 'Response Time',
    description: 'Lightning fast',
  },
  {
    icon: Award,
    value: '5000+',
    label: 'Stocks Tracked',
    description: 'Comprehensive coverage',
  },
];

export default function StatsSection() {
  return (
    <section className="relative py-16 overflow-hidden border-y border-gray-800/50">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5" />

      <div className="container relative z-10 px-4 mx-auto">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="p-3 mb-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                  <Icon className="w-6 h-6 text-blue-400" />
                </div>
                <div className="mb-1 text-4xl font-bold text-white md:text-5xl">
                  {stat.value}
                </div>
                <div className="mb-1 text-lg font-semibold text-gray-300">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-500">
                  {stat.description}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
