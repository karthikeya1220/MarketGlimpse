'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'What is MarketGlimpse?',
    answer: 'MarketGlimpse is a comprehensive stock market intelligence platform that provides real-time market data, AI-powered insights, and advanced tools to help you make smarter investment decisions.',
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes! We offer a 14-day free trial on all paid plans. No credit card required to start your trial. You can cancel anytime before the trial ends.',
  },
  {
    question: 'What data sources do you use?',
    answer: 'We aggregate data from multiple reliable sources including Finnhub API for real-time market data, and use Google Gemini AI for intelligent insights and recommendations.',
  },
  {
    question: 'Can I track international stocks?',
    answer: 'Absolutely! MarketGlimpse supports stocks from major exchanges worldwide including NYSE, NASDAQ, LSE, TSE, and many more.',
  },
  {
    question: 'How accurate are the AI insights?',
    answer: 'Our AI insights are powered by Google Gemini, one of the most advanced AI models available. However, all insights should be used as supplementary information to your own research and not as financial advice.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes, we take security seriously. All data is encrypted with 256-bit SSL, we use Better Auth for authentication, implement rate limiting, and are fully GDPR compliant.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees. Your access will continue until the end of your billing period.',
  },
  {
    question: 'Do you offer API access?',
    answer: 'API access is available on Pro and Enterprise plans. You can integrate MarketGlimpse data and features directly into your own applications.',
  },
];

function FAQItem({ faq, index }: { faq: { question: string; answer: string }; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="border-b border-gray-800"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-6 text-left transition-colors group hover:text-blue-400"
      >
        <span className="pr-4 text-lg font-semibold text-white group-hover:text-blue-400">
          {faq.question}
        </span>
        <ChevronDown
          className={`flex-shrink-0 w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 pb-6' : 'max-h-0'
        }`}
      >
        <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
      </div>
    </motion.div>
  );
}

export default function FAQSection() {
  return (
    <section id="faq" className="relative py-20 overflow-hidden">
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
            Frequently Asked{' '}
            <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
              Questions
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-400">
            Everything you need to know about MarketGlimpse
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="mb-4 text-gray-400">Still have questions?</p>
          <a
            href="#contact"
            className="inline-flex items-center px-6 py-3 font-semibold text-white transition-colors border rounded-lg bg-gray-900/50 border-gray-800 hover:bg-gray-800 hover:border-gray-700"
          >
            Contact Support
          </a>
        </motion.div>
      </div>
    </section>
  );
}
