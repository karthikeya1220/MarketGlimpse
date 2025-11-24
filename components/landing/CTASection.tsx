'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CTASection() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20" />
        <div className="absolute w-[800px] h-[800px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="container relative z-10 px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl p-8 mx-auto text-center border md:p-12 rounded-3xl bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-800 backdrop-blur-xl"
        >
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 mb-6 space-x-2 border rounded-full bg-blue-500/10 border-blue-500/20">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">Limited Time Offer</span>
          </div>

          {/* Heading */}
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Ready to Transform Your{' '}
            <span className="text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text">
              Investment Journey?
            </span>
          </h2>

          {/* Description */}
          <p className="max-w-2xl mx-auto mb-8 text-lg text-gray-400">
            Join thousands of investors who are already making smarter decisions with MarketGlimpse. 
            Start your free trial today—no credit card required.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Link href="/sign-up">
              <Button size="lg" className="text-white bg-blue-600 hover:bg-blue-700 group">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button
                size="lg"
                variant="outline"
                className="border-gray-700 bg-gray-900/50 hover:bg-gray-800 hover:border-gray-600"
              >
                Sign In
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center mt-8 space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>14-day free trial</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
