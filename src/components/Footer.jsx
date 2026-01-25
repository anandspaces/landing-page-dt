import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Footer Component
 * Features:
 * - Clean, professional layout
 * - Links to all sections
 * - Contact information
 * - Social proof (IIM Lucknow x IIT Kanpur)
 * - Animated background gradient
 * - Legal links
 */

const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    // Subtle fade-in animation
    gsap.from(footerRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: footerRef.current,
        start: 'top 95%',
        toggleActions: 'play none none reverse',
      },
    });
  }, []);

  return (
    <footer
      id="contact"
      className="relative bg-black/90 border-t border-white/10 overflow-hidden"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.90)' }}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-black z-0" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-electric-blue/5 rounded-full blur-3xl z-0" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-subtle-violet/5 rounded-full blur-3xl z-0" />

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-electric-blue to-subtle-violet rounded-xl flex items-center justify-center">
                <span className="text-deep-navy font-bold text-2xl">D</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold gradient-text">Dextora AI</h3>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              An AI-powered learning platform for Class 1–12, IIT-JEE, and NEET. Built with academic rigor aligned with IIM Lucknow and IIT Kanpur methodologies.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-electric-blue/30 rounded-full">
              <span className="text-xs text-gray-400">IIM Lucknow · IIT Kanpur</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-gray-400 hover:text-electric-blue transition-colors text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-400 hover:text-electric-blue transition-colors text-sm">
                  About
                </a>
              </li>
              <li>
                <a href="/services" className="text-gray-400 hover:text-electric-blue transition-colors text-sm">
                  Services
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-electric-blue transition-colors text-sm">
                  Contact
                </a>
              </li>
              <li>
                <a href="/admission" className="text-gray-400 hover:text-electric-blue transition-colors text-sm">
                  Admission
                </a>
              </li>
            </ul>
          </div>

          {/* Learning Paths */}
          <div>
            <h4 className="text-white font-semibold mb-4">Learning Paths</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-electric-blue transition-colors text-sm">
                  Class 1-5 (Foundation)
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-electric-blue transition-colors text-sm">
                  Class 6-12 (Advanced)
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-electric-blue transition-colors text-sm">
                  IIT-JEE Preparation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-electric-blue transition-colors text-sm">
                  NEET Preparation
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-electric-blue mt-1">📞</span>
                <a href="tel:+918447934906" className="text-gray-400 hover:text-electric-blue transition-colors text-sm">
                  +91 84479 34906
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-electric-blue mt-1">✉️</span>
                <a href="mailto:info@dextora.ai" className="text-gray-400 hover:text-electric-blue transition-colors text-sm">
                  info@dextora.ai
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-electric-blue mt-1">📍</span>
                <span className="text-gray-400 text-sm">
                  IIM Lucknow Campus, Lucknow
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-electric-blue mt-1">🕐</span>
                <span className="text-gray-400 text-sm">24/7 Support</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Institutional Partnerships Section */}
        <div className="border-t border-white/10 py-12 mb-4">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-6 text-center">Backed by Leading Institutions</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="text-sm font-semibold text-gray-300 group-hover:text-electric-blue transition-colors">IIM Lucknow</div>
              <div className="h-1 w-12 bg-electric-blue/30 group-hover:bg-electric-blue transition-all"></div>
            </div>
            <div className="text-gray-600">·</div>
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="text-sm font-semibold text-gray-300 group-hover:text-electric-blue transition-colors">IIT Kanpur</div>
              <div className="h-1 w-12 bg-electric-blue/30 group-hover:bg-electric-blue transition-all"></div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mb-8" />

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <div className="text-sm text-gray-400 text-center md:text-left">
            © 2024 Dextora AI. All rights reserved. | Backed by IIM Lucknow & IIT Kanpur
          </div>

          {/* Legal links */}
          <div className="flex items-center gap-6">
            <a
              href="https://dextora.org/terms-conditions"
              className="text-sm text-gray-400 hover:text-electric-blue transition-colors"
            >
              Terms & Conditions
            </a>
            <a
              href="https://dextora.org/privacy-policy"
              className="text-sm text-gray-400 hover:text-electric-blue transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="https://dextora.org/faq"
              className="text-sm text-gray-400 hover:text-electric-blue transition-colors"
            >
              FAQ
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
