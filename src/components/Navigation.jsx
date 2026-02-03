import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';

const Navigation = () => {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setScrolled(latest > 50);
  });

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Student', path: '/student' },
    { name: 'Teacher', path: '/teacher' },
    { name: 'Parent', path: '/parent' },
    { name: 'School', path: '/school' },
  ];

  return (
    <motion.nav
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: -100, opacity: 0 },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 z-[100] flex justify-center pt-6 transition-all duration-300 pointer-events-none`}
    >
      <div
        className={`pointer-events-auto relative mx-4 md:mx-auto max-w-7xl w-full flex items-center justify-between px-6 py-3 rounded-full transition-all duration-500
          ${scrolled
            ? 'glass-panel bg-charcoal/90 border-cyan/20 shadow-glow-cyan-subtle backdrop-blur-xl'
            : 'bg-transparent border border-transparent'
          }
        `}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
            <img
              src="/dextora-logo.webp"
              alt="Dextora Logo"
              className="w-10 h-10 object-contain relative z-10"
            />
          </div>
          <div>
            <h1 className="logo-text text-xl tracking-tighter group-hover:text-glow transition-all">DEXTORA</h1>
            <p className="text-[10px] uppercase tracking-widest text-cyan/70 font-mono">
              IIM Lucknow IIT Kanpur
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 p-1 bg-charcoal/30 rounded-full border border-white/5 backdrop-blur-sm">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="relative px-5 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors rounded-full group overflow-hidden"
            >
              <span className="relative z-10 font-display tracking-wide">{link.name}</span>
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-cyan to-violet scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              <span className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="group relative inline-flex items-center justify-center px-6 py-2.5 text-xs font-bold text-white uppercase tracking-widest border border-white/20 rounded-md hover:bg-white/10 hover:border-cyan/50 transition-all duration-300"
          >
            <span className="relative z-10">Log In</span>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
