// src/components/Layout.jsx
import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import ThreeScene from './ThreeScene';
import AvatarWidget from './AvatarWidget';
import Footer from './Footer';

function Layout() {
  const [showAvatar, setShowAvatar] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      // Calculate how far down the page we are
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      // Calculate the distance from the bottom
      const distanceFromBottom = fullHeight - (scrollY + windowHeight);

      // If we are within 20% of the bottom (or a specific pixel value like 400px), hide it
      // Adjust '400' based on your footer's actual height
      if (distanceFromBottom < 400) {
        setShowAvatar(false);
      } else {
        setShowAvatar(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Run once on load to set initial state
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-charcoal text-offwhite min-h-screen relative overflow-x-hidden">
      <div className="fixed inset-0 z-10 pointer-events-none">
        <ThreeScene />
      </div>

      <div className="relative z-[60]">
        <Navigation />
      </div>

      <main className="relative z-50">
        <Outlet />
      </main>

      {/* Avatar Widget with smooth slide-out logic */}
      <div
        className={`fixed top-1/2 right-0 -translate-y-1/2 z-[70] hidden lg:block transition-all duration-700 ease-in-out pointer-events-none ${showAvatar && location.pathname !== '/chat'
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 translate-x-40'
          }`}
      >
        <div className="pointer-events-auto">
          <AvatarWidget />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Layout;