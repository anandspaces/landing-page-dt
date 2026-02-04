// src/components/Layout.jsx
import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import ThreeScene from './ThreeScene';
import AvatarWidget from './AvatarWidget';
import Footer from './Footer';

function Layout() {
  const [showAvatar, setShowAvatar] = useState(true);
  const [forceHidden, setForceHidden] = useState(false);
  const location = useLocation();

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

  return (
    <div className="bg-charcoal text-offwhite min-h-screen relative overflow-x-hidden">
      <div className="fixed inset-0 z-10 pointer-events-none">
        <ThreeScene />
      </div>

      <div className="relative z-[60]">
        <Navigation />
      </div>

      <main className="relative z-50 transition-all duration-300">
        <Outlet />
      </main>

      {/* Avatar Widget */}
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

      <div className="relative z-50">
        <Footer />
      </div>
    </div>
  );
}

export default Layout;