'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] -top-48 -left-48 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute w-[600px] h-[600px] -bottom-48 -right-48 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container relative z-10 px-4 mx-auto">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center px-4 py-2 mb-8 space-x-2 border rounded-full bg-blue-500/10 border-blue-500/20">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">AI-Powered Market Intelligence</span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-4xl mb-6 text-5xl font-bold leading-tight text-white md:text-6xl lg:text-7xl"
          >
            Your Gateway to{' '}
            <span className="text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text">
              Intelligent
            </span>{' '}
            Stock Market Insights
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mb-10 text-lg text-gray-400 md:text-xl"
          >
            Track real-time market data, manage your watchlists, and get AI-powered insights to make smarter
            investment decisions—all in one beautifully designed platform.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4"
          >
            <Link href="/sign-up">
              <Button size="lg" className="text-white bg-blue-600 hover:bg-blue-700 group">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="#features">
              <Button
                size="lg"
                variant="outline"
                className="border-gray-700 bg-gray-900/50 hover:bg-gray-800 hover:border-gray-600"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                See Features
              </Button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-8 mt-12 text-sm text-gray-500"
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Real-time Data</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              <span>10K+ Users</span>
            </div>
          </motion.div>

          {/* Hero Image/Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-full max-w-5xl mt-16"
          >
            <div className="relative overflow-hidden border shadow-2xl rounded-2xl border-gray-800 bg-gradient-to-b from-gray-900 to-black">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-purple-500/10 to-pink-500/10" />
              <Image
                src="/assets/images/dashboard-preview.png"
                alt="MarketGlimpse Dashboard"
                width={1200}
                height={800}
                className="relative z-10 w-full h-auto"
                priority
              />
              {/* Floating elements */}
              <div className="absolute z-20 px-4 py-2 bg-green-500/90 rounded-lg shadow-lg top-4 right-4 backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-white" />
                  <span className="text-sm font-semibold text-white">+12.5%</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
