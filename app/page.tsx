'use client';

import Link from 'next/link';
import { ArrowRight, TrendingUp, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import StatsSection from '@/components/landing/StatsSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import PricingSection from '@/components/landing/PricingSection';
import ComparisonSection from '@/components/landing/ComparisonSection';
import FAQSection from '@/components/landing/FAQSection';
import CTASection from '@/components/landing/CTASection';
import FooterSection from '@/components/landing/FooterSection';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-gray-800/50 bg-black/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto">
          <Link href="/" className="flex items-center space-x-2">
            <TrendingUp className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold text-white">MarketGlimpse</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="items-center hidden space-x-8 md:flex">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm text-gray-300 transition-colors hover:text-white"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="items-center hidden space-x-4 md:flex">
            <Link href="/sign-in">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-300 md:hidden hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t md:hidden border-gray-800/50 bg-black/95 backdrop-blur-xl">
            <div className="container px-4 py-6 mx-auto space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block text-gray-300 transition-colors hover:text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
                    setMobileMenuOpen(false);
                  }}
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-4 space-y-3 border-t border-gray-800">
                <Link href="/sign-in" className="block">
                  <Button variant="ghost" className="w-full text-gray-300 hover:text-white">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up" className="block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* Comparison Section */}
      <ComparisonSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <FooterSection />
    </main>
  );
}
