'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const features = [
  { name: 'Real-time Market Data', free: true, pro: true, enterprise: true },
  { name: 'Basic Watchlists (10 stocks)', free: true, pro: false, enterprise: false },
  { name: 'Unlimited Watchlists', free: false, pro: true, enterprise: true },
  { name: 'Market News Feed', free: true, pro: true, enterprise: true },
  { name: 'AI-Powered Insights', free: false, pro: true, enterprise: true },
  { name: 'Advanced Charting Tools', free: false, pro: true, enterprise: true },
  { name: 'Price Alerts', free: false, pro: true, enterprise: true },
  { name: 'Portfolio Tracking', free: false, pro: true, enterprise: true },
  { name: 'API Access', free: false, pro: true, enterprise: true },
  { name: 'Priority Support', free: false, pro: true, enterprise: true },
  { name: 'Custom Integrations', free: false, pro: false, enterprise: true },
  { name: 'Dedicated Account Manager', free: false, pro: false, enterprise: true },
  { name: 'SLA Guarantee', free: false, pro: false, enterprise: true },
  { name: 'Team Collaboration', free: false, pro: false, enterprise: true },
];

export default function ComparisonSection() {
  return (
    <section className="relative py-20 overflow-hidden">
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
            Compare{' '}
            <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
              Plans
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-400">
            See which plan is right for you
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="overflow-x-auto"
        >
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden border rounded-2xl border-gray-800 bg-gray-900/50">
              <table className="min-w-full divide-y divide-gray-800">
                <thead>
                  <tr className="bg-gray-800/50">
                    <th className="px-6 py-4 text-sm font-semibold text-left text-white">
                      Features
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-center text-white">
                      Free
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-center text-white bg-blue-500/10">
                      Pro
                      <div className="mt-1 text-xs font-normal text-blue-400">Most Popular</div>
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-center text-white">
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {features.map((feature, index) => (
                    <motion.tr
                      key={feature.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.02 }}
                      className="hover:bg-gray-800/30"
                    >
                      <td className="px-6 py-4 text-sm text-gray-300">{feature.name}</td>
                      <td className="px-6 py-4 text-center">
                        {feature.free ? (
                          <Check className="w-5 h-5 mx-auto text-green-500" />
                        ) : (
                          <X className="w-5 h-5 mx-auto text-gray-600" />
                        )}
                      </td>
                      <td className="px-6 py-4 text-center bg-blue-500/5">
                        {feature.pro ? (
                          <Check className="w-5 h-5 mx-auto text-green-500" />
                        ) : (
                          <X className="w-5 h-5 mx-auto text-gray-600" />
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {feature.enterprise ? (
                          <Check className="w-5 h-5 mx-auto text-green-500" />
                        ) : (
                          <X className="w-5 h-5 mx-auto text-gray-600" />
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
