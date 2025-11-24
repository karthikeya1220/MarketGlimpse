'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type Plan = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  popular: boolean;
};

const plans: Plan[] = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started with market insights',
    features: [
      'Real-time stock prices',
      'Basic watchlist (10 stocks)',
      'Market news feed',
      'Email notifications',
      'Community support',
    ],
    cta: 'Start Free',
    href: '/sign-up',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: 'per month',
    description: 'Advanced features for serious investors',
    features: [
      'Everything in Free',
      'Unlimited watchlists',
      'AI-powered insights',
      'Advanced charting tools',
      'Price alerts',
      'Portfolio tracking',
      'Priority support',
      'API access',
    ],
    cta: 'Start Free Trial',
    href: '/sign-up',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    description: 'Custom solutions for organizations',
    features: [
      'Everything in Pro',
      'Custom integrations',
      'Dedicated account manager',
      'SLA guarantee',
      'Advanced analytics',
      'Team collaboration',
      'White-label options',
      'Custom API limits',
    ],
    cta: 'Contact Sales',
    href: '#contact',
    popular: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="relative py-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute w-[600px] h-[600px] top-0 right-0 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute w-[600px] h-[600px] bottom-0 left-0 bg-blue-500/10 rounded-full blur-3xl" />
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
            Simple,{' '}
            <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
              Transparent
            </span>{' '}
            Pricing
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-400">
            Choose the perfect plan for your investment journey. All plans include a 14-day free trial.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative p-8 overflow-hidden border rounded-2xl backdrop-blur-sm ${
                plan.popular
                  ? 'border-blue-500/50 bg-gradient-to-br from-blue-500/10 to-purple-500/10'
                  : 'border-gray-800 bg-gray-900/50'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <div className="px-4 py-1 text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-bl-xl rounded-tr-xl">
                    MOST POPULAR
                  </div>
                </div>
              )}

              {/* Plan Name */}
              <div className="mb-6">
                <h3 className="mb-2 text-2xl font-bold text-white">{plan.name}</h3>
                <p className="text-sm text-gray-400">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold text-white">{plan.price}</span>
                  {plan.period !== 'contact us' && (
                    <span className="ml-2 text-gray-400">/{plan.period.split(' ')[1] || 'mo'}</span>
                  )}
                </div>
                {plan.period === 'contact us' && (
                  <p className="mt-1 text-sm text-gray-400">Tailored to your needs</p>
                )}
              </div>

              {/* Features */}
              <ul className="mb-8 space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle2 className="flex-shrink-0 w-5 h-5 mr-3 text-blue-500" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              {plan.href.startsWith('#') ? (
                <a href={plan.href} className="block">
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                        : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
                    }`}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </a>
              ) : (
                <Link href={plan.href as '/sign-up'} className="block">
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                        : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
                    }`}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gray-500">
            All plans include 256-bit SSL encryption and GDPR compliance.{' '}
            <Link href="#" className="text-blue-400 hover:text-blue-300">
              View detailed comparison →
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
