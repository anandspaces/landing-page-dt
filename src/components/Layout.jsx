// src/components/Layout.jsx
import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Bot } from 'lucide-react';
import Navigation from './Navigation';
import ThreeScene from './ThreeScene';
import AvatarWidget from './AvatarWidget';
import Footer from './Footer';

function Layout() {
  const [showAvatar, setShowAvatar] = useState(true);
  const [forceHidden, setForceHidden] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAvatarToggle = (e) => {
      if (typeof e.detail.visible === 'boolean') {
        // If visible is false, we are forcing it hidden
        setForceHidden(!e.detail.visible);
        // Also update the immediate state
        setShowAvatar(e.detail.visible);
      }
    };

    window.addEventListener('toggle-avatar', handleAvatarToggle);

    const handleScroll = () => {
      // If forcefully hidden by a page component, ignore scroll logic to "show" it
      if (forceHidden) {
        setShowAvatar(false);
        return;
      }

      // Calculate how far down the page we are
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      // Calculate the distance from the bottom to hide near footer
      const distanceFromBottom = fullHeight - (scrollY + windowHeight);

      if (distanceFromBottom < 400) {
        setShowAvatar(false);
      } else {
        setShowAvatar(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('toggle-avatar', handleAvatarToggle);
    };
  }, [forceHidden]); // Re-bind scroll handler when forceHidden changes

  const getVisualType = (pathname) => {
    if (pathname.includes('/student')) return 'student';
    if (pathname.includes('/parent')) return 'parent';
    if (pathname.includes('/school')) return 'school';
    if (pathname.includes('/teacher')) return 'teacher';
    return 'default';
  };

  const visualType = getVisualType(location.pathname);

  return (
    <div className="bg-gradient-to-b from-charcoal-light to-charcoal text-offwhite min-h-screen relative overflow-x-hidden">
      <div className="fixed inset-0 z-10 pointer-events-none">
        <ThreeScene visualType={visualType} />
      </div>

      <div className="relative z-[60]">
        <Navigation />
      </div>


      <main className="relative z-50 transition-all duration-300">
        <Outlet />
      </main>

      {/* Persistent Chat Icon */}
      <button
        onClick={() => navigate('/chat')}
        className="fixed bottom-6 right-6 z-[100] group"
        aria-label="Chat with Dextora"
        style={{ pointerEvents: 'auto' }}
      >
        {/* Pulse effect */}
        <div className="absolute inset-0 bg-cyan rounded-full animate-ping opacity-20 group-hover:opacity-40 duration-1000" />

        {/* Icon Container */}
        <div className="relative bg-charcoal border border-cyan/50 p-4 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.4)] group-hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] group-hover:scale-110 transition-all duration-300">
          <Bot className="w-8 h-8 text-cyan group-hover:text-white transition-colors duration-300" />
        </div>

        {/* Simple tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          <span className="text-cyan text-xs font-mono tracking-widest bg-charcoal/90 px-2 py-1 rounded border border-cyan/20">CHAT</span>
        </div>
      </button>

      {/* Avatar Widget */}
      <div
        className={`fixed top-1/2 right-0 -translate-y-1/2 z-[70] hidden lg:block transition-all duration-700 ease-in-out pointer-events-none ${showAvatar && !['/chat', '/contact'].includes(location.pathname)
          ? 'opacity-100 translate-x-0'
          : 'opacity-0 translate-x-40'
          }`}
      >
        <div className="pointer-events-auto">
          <AvatarWidget />
        </div>
      </div>

      <div className="relative z-50">
        <Footer />
      </div>
    </div>
  );
}

export default Layout;