'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Day Trader',
    company: 'Independent',
    image: '👩‍💼',
    content: 'MarketGlimpse has completely transformed how I track stocks. The real-time data and AI insights are invaluable for making quick trading decisions.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Portfolio Manager',
    company: 'Vertex Capital',
    image: '👨‍💼',
    content: 'The advanced charting tools and watchlist features save me hours every day. This is now an essential part of my investment workflow.',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Financial Analyst',
    company: 'Goldman Sachs',
    image: '👩‍💻',
    content: 'As a professional analyst, I need reliable data and fast insights. MarketGlimpse delivers both with an elegant, intuitive interface.',
    rating: 5,
  },
  {
    name: 'David Park',
    role: 'Investor',
    company: 'Angel Investor',
    image: '👨‍🚀',
    content: 'The AI-powered recommendations have helped me discover investment opportunities I would have missed. Highly recommended!',
    rating: 5,
  },
  {
    name: 'Lisa Williams',
    role: 'Financial Advisor',
    company: 'Wealth Management Inc',
    image: '👩‍⚖️',
    content: 'My clients love the personalized alerts and portfolio tracking. MarketGlimpse helps me provide better service to my clients.',
    rating: 5,
  },
  {
    name: 'James Anderson',
    role: 'Tech Entrepreneur',
    company: 'StartupVentures',
    image: '👨‍💼',
    content: 'Clean interface, powerful features, and excellent performance. Everything you need for modern stock market analysis.',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900" />

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
            Trusted by{' '}
            <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
              Thousands
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-400">
            See what our users have to say about their experience with MarketGlimpse
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative p-6 overflow-hidden border rounded-2xl bg-gray-900/50 border-gray-800 backdrop-blur-sm group hover:border-gray-700"
            >
              {/* Quote Icon */}
              <Quote className="absolute w-24 h-24 opacity-5 -top-4 -right-4 text-blue-500" />

              {/* Rating */}
              <div className="flex mb-4 space-x-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                ))}
              </div>

              {/* Content */}
              <p className="relative mb-6 text-gray-300 leading-relaxed">
                &quot;{testimonial.content}&quot;
              </p>

              {/* Author */}
              <div className="flex items-center">
                <div className="flex items-center justify-center w-12 h-12 mr-4 text-2xl rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                  {testimonial.image}
                </div>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">
                    {testimonial.role} • {testimonial.company}
                  </div>
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="mb-6 text-sm text-gray-500">Trusted by leading financial institutions</p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-50">
            <div className="text-2xl font-bold text-gray-600">Goldman Sachs</div>
            <div className="text-2xl font-bold text-gray-600">JP Morgan</div>
            <div className="text-2xl font-bold text-gray-600">Morgan Stanley</div>
            <div className="text-2xl font-bold text-gray-600">Fidelity</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
