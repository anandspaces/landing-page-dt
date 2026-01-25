import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Services Section
 * Features:
 * - Floating 3D glass cards
 * - Parallax depth on scroll
 * - Hover effects with glow and lift
 * - Staggered fade-in animations
 */

const services = [
  {
    title: 'Adaptive AI Tutoring',
    subtitle: 'Personalized Learning Pathways',
    description: 'AI mentors that analyze your learning patterns and adapt content delivery to optimize comprehension and retention.',
    icon: '🤖',
    color: 'from-electric-blue to-soft-cyan',
  },
  {
    title: 'Vision Intelligence',
    subtitle: 'Posture & Note Digitization',
    description: 'Computer vision technology monitors study posture and automatically digitizes handwritten notes for better organization.',
    icon: '👁️',
    color: 'from-soft-cyan to-subtle-violet',
  },
  {
    title: 'Multiple AI Mentors',
    subtitle: 'Diverse Teaching Styles',
    description: 'Access different AI mentor personalities—from structured guides to exploratory coaches—tailored to your learning preferences.',
    icon: '👥',
    color: 'from-subtle-violet to-neon-purple',
  },
  {
    title: 'Intelligent Workflow',
    subtitle: '7-Step Learning Framework',
    description: 'Follow a research-backed process that transforms passive study into active knowledge building and long-term retention.',
    icon: '🎯',
    color: 'from-neon-purple to-electric-blue',
  },
];

const ServicesSection = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate section title
      gsap.from('.services-header', {
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

      // Animate cards with stagger
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        // Initial fade in from depth
        gsap.from(card, {
          opacity: 0,
          y: 100,
          rotateX: -15,
          scale: 0.9,
          duration: 1,
          delay: index * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });

        // Parallax effect on scroll
        gsap.to(card, {
          y: -50,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative section-padding bg-gradient-to-b from-deep-navy/40 via-dark-slate/40 to-charcoal/40 overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 gradient-bg-1 opacity-40 pointer-events-none" />
      <div className="absolute inset-0 noise-overlay pointer-events-none" />

      {/* Floating gradient orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-electric-blue/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-subtle-violet/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="services-header text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-electric-blue/10 border border-electric-blue/30 rounded-full mb-6">
            <span className="w-2 h-2 bg-electric-blue rounded-full animate-pulse" />
            <span className="text-sm text-electric-blue font-semibold">Core Features</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">AI-Powered Learning Tools</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Research-backed technologies designed to enhance learning outcomes and academic performance
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 perspective-1000 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              className="group relative preserve-3d"
            >
              {/* Card */}
              <div className="glass-card-hover p-8 md:p-10 h-full relative overflow-hidden transform transition-all duration-500 group-hover:scale-[1.02] group-hover:-translate-y-2">
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                {/* Icon */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-electric-blue/10 to-subtle-violet/10 border border-electric-blue/30 rounded-2xl flex items-center justify-center text-5xl transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                    {service.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-electric-blue transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-electric-blue font-semibold mb-4">{service.subtitle}</p>
                  <p className="text-gray-400 leading-relaxed">{service.description}</p>
                </div>

                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-electric-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
              </div>

              {/* 3D depth shadow */}
              <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/5 to-subtle-violet/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 translate-y-4" />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <a
            href="/admission"
            className="btn-primary inline-block"
          >
            Start Your Experience
          </a>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
