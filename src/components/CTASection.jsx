import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * CTA Section
 * Final conversion section with:
 * - Strong call to action
 * - Contact information
 * - Multiple CTAs (trial, demo, call)
 * - Gradient background with animation
 */

const CTASection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate content
      gsap.from('.cta-content', {
        opacity: 0,
        y: 80,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      // Animate CTA cards
      gsap.from('.cta-card', {
        opacity: 0,
        y: 60,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.cta-cards',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative section-padding bg-gradient-to-b from-deep-navy/40 via-charcoal/40 to-deep-navy/40 overflow-hidden"
    >
      {/* Animated background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-electric-blue/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-subtle-violet/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>
      <div className="absolute inset-0 noise-overlay pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Main CTA */}
        <div className="cta-content text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Start Learning Smarter</span>
            <br />
            <span className="text-white">with AI Mentorship</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Join students achieving better results through personalized AI-powered learning.
            <br />
            Experience adaptive guidance built on educational research.
          </p>
        </div>

        {/* CTA Cards */}
        <div className="cta-cards grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Call CTA */}
          <div className="cta-card glass-card-hover p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-electric-blue/20 to-soft-cyan/20 border border-electric-blue/30 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
              📞
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Talk to Our Team</h3>
            <p className="text-gray-400 text-sm mb-4">Get guidance from education specialists</p>
            <a
              href="tel:+918447934906"
              className="text-electric-blue font-semibold hover:underline"
            >
              +91 84479 34906
            </a>
          </div>

          {/* Demo CTA */}
          <div className="cta-card glass-card-hover p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-electric-blue/20 to-soft-cyan/20 border border-electric-blue/30 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
              🎥
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Request Demo</h3>
            <p className="text-gray-400 text-sm mb-4">See Dextora in action</p>
            <a
              href="/admission"
              className="text-electric-blue font-semibold hover:underline"
            >
              Book a Session
            </a>
          </div>

          {/* Trial CTA */}
          <div className="cta-card glass-card-hover p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-electric-blue/20 to-soft-cyan/20 border border-electric-blue/30 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
              🚀
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Start Free</h3>
            <p className="text-gray-400 text-sm mb-4">7 days, no payment required</p>
            <a
              href="/admission"
              className="text-electric-blue font-semibold hover:underline"
            >
              Begin Now
            </a>
          </div>
        </div>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a
            href="/admission"
            className="btn-primary inline-block text-lg px-12 py-5"
          >
            Begin Your Trial
          </a>
          <a
            href="tel:+918447934906"
            className="btn-outline inline-block text-lg px-12 py-5"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
