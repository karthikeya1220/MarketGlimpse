import Link from 'next/link';
import { TrendingUp, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const footerLinks = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Security', href: '#security' },
    { name: 'Roadmap', href: '#roadmap' },
  ],
  company: [
    { name: 'About', href: '#about' },
    { name: 'Blog', href: '#blog' },
    { name: 'Careers', href: '#careers' },
    { name: 'Contact', href: '#contact' },
  ],
  resources: [
    { name: 'Documentation', href: '#docs' },
    { name: 'API Reference', href: '#api' },
    { name: 'Support', href: '#support' },
    { name: 'Status', href: '#status' },
  ],
  legal: [
    { name: 'Privacy', href: '#privacy' },
    { name: 'Terms', href: '#terms' },
    { name: 'Cookie Policy', href: '#cookies' },
    { name: 'Licenses', href: '#licenses' },
  ],
};

const socialLinks = [
  { icon: Github, href: 'https://github.com/karthikeya1220/MarketGlimpse', label: 'GitHub' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:support@marketglimpse.com', label: 'Email' },
];

export default function FooterSection() {
  return (
    <footer className="relative pt-16 pb-8 border-t border-gray-800/50">
      <div className="container px-4 mx-auto">
        {/* Main Footer Content */}
        <div className="grid gap-8 mb-12 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href={"/" as any} className="inline-flex items-center mb-4 space-x-2">
              <TrendingUp className="w-8 h-8 text-blue-500" />
              <span className="text-xl font-bold text-white">MarketGlimpse</span>
            </Link>
            <p className="mb-4 text-sm text-gray-400">
              Your gateway to intelligent stock market insights. Making investment decisions easier with AI-powered
              analytics and real-time data.
            </p>
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 transition-colors border rounded-lg border-gray-800 bg-gray-900/50 hover:bg-gray-800 hover:border-gray-700"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5 text-gray-400" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link href={link.href as any} className="text-sm text-gray-400 transition-colors hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href as any} className="text-sm text-gray-400 transition-colors hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link href={link.href as any} className="text-sm text-gray-400 transition-colors hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href as any} className="text-sm text-gray-400 transition-colors hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800/50">
          <div className="flex flex-col items-center justify-between space-y-4 text-sm text-gray-500 md:flex-row md:space-y-0">
            <div>© 2025 MarketGlimpse. All rights reserved.</div>
            <div className="flex items-center space-x-6">
              <span>Built with ❤️ using Next.js & TypeScript</span>
              <a
                href="https://github.com/karthikeya1220"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
              >
                by Darshan Karthikeya
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
