import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';

const Navigation = () => {
  const navRef = useRef(null);
  const lastScrollY = useRef(0);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    // Initial state (hidden)
    gsap.set(navRef.current, { opacity: 0, y: 0 });

    //  fade-in on load (ONCE)
    gsap.to(navRef.current, {
      opacity: 1,
      duration: 0.9,
      ease: 'power1.out',
      clearProps: 'opacity',
    });

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setScrolled(currentScrollY > 50);

      if (currentScrollY > lastScrollY.current && currentScrollY > 120) {
        // scrolling down → hide nav
        gsap.to(navRef.current, {
          opacity: 0,
          y: -9,
          duration: 0.15,
          ease: 'power1.out',
        });
      } else {
        // scrolling up → show nav
        gsap.to(navRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.25,
          ease: 'power1.out',
        });
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 will-change-transform will-change-opacity
        bg-charcoal/40 backdrop-blur-md
        ${scrolled ? 'bg-charcoal/80 border-b border-white/10' : ''}
      `}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-2.5 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img 
            src="/dextora-logo.webp" 
            alt="Dextora Logo" 
            className="w-8 h-8 object-contain"
          />
          <div>
            <h1 className="logo-text">DEXTORA</h1>
            <p className="text-xs text-gray-400 tracking-wide">
              IIM LUCKNOW IIT KANPUR 
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm text-gray-200 hover:text-cyan transition-colors">
            Home
          </Link>
          <Link to="/about" className="text-sm text-gray-200 hover:text-cyan transition-colors">
            About
          </Link>
          <Link to="/services" className="text-sm text-gray-200 hover:text-cyan transition-colors">
            Services
          </Link>
          <Link to="/contact" className="text-sm text-gray-200 hover:text-cyan transition-colors">
            Contact
          </Link>
          <Link to="/admission" className="text-sm text-gray-200 hover:text-cyan transition-colors">
            Admission
          </Link>
          <div className="relative">
            <button
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
              className="text-sm text-gray-200 hover:text-cyan transition-colors flex items-center gap-1"
            >
              Dextora AI
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {dropdownOpen && (
              <div
                className="absolute top-full left-0 mt-2 w-48 bg-charcoal/90 backdrop-blur-md border border-white/10 rounded-lg shadow-lg py-2 z-50"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <a href="/#platform" className="block px-4 py-2 text-sm text-gray-200 hover:bg-white/10 hover:text-cyan transition-colors">
                  Platform Overview
                </a>
                <a href="/#features" className="block px-4 py-2 text-sm text-gray-200 hover:bg-white/10 hover:text-cyan transition-colors">
                  Features
                </a>
                <a href="/#personas" className="block px-4 py-2 text-sm text-gray-200 hover:bg-white/10 hover:text-cyan transition-colors">
                  AI Personas
                </a>
                <a href="/#pricing" className="block px-4 py-2 text-sm text-gray-200 hover:bg-white/10 hover:text-cyan transition-colors">
                  Pricing
                </a>
                <a href="/#case-studies" className="block px-4 py-2 text-sm text-gray-200 hover:bg-white/10 hover:text-cyan transition-colors">
                  Case Studies
                </a>
                <Link to="/admission" className="block px-4 py-2 text-sm text-gray-200 hover:bg-white/10 hover:text-cyan transition-colors">
                  Start Free Trial
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex items-center gap-4">
          <Link
            to="/admission"
            className="btn-primary text-sm"
          >
            Begin Trial
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
