import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const RoadmapSection = () => {
  const containerRef = useRef(null);
  const orbRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate orb cy attribute from 0 to 500 based on scroll
      gsap.fromTo(
        orbRef.current,
        {
          attr: { cy: 0 },
        },
        {
          attr: { cy: 500 },
          ease: 'none',
          scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            markers: false,
          },
        }
      );
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed left-8 top-0 w-24 h-screen pointer-events-none z-10">
      <svg className="w-full h-full" viewBox="0 0 200 500" preserveAspectRatio="none">
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#00d4ff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#00d4ff" stopOpacity="0.2" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Curved path */}
        <path
          d="M 100 0 Q 140 125 100 250 Q 60 375 100 500"
          stroke="url(#pathGradient)"
          strokeWidth="4"
          fill="none"
          opacity="0.5"
        />
        
        {/* Animated orb */}
        <circle
          ref={orbRef}
          cx="100"
          cy="0"
          r="12"
          fill="#00d4ff"
          filter="url(#glow)"
        >
          <animate
            attributeName="opacity"
            values="0.6;1;0.6"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
};

export default RoadmapSection;
