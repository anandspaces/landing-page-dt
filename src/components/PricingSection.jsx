import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Pricing Section
 * Features:
 * - Three-tier pricing cards
 * - Middle card highlighted (Most Popular)
 * - Hover effects with 3D transform
 * - Glass morphism design
 * - Scroll-triggered animations
 */

const pricingPlans = [
  {
    name: 'Monthly',
    price: '₹500',
    period: 'per month',
    features: [
      'AI Tutor Access',
      'Vision Engine Basics',
      'Learning Workflow',
      'Email Support',
    ],
    cta: 'Begin Now',
    link: 'https://dextora.org/admission',
    highlighted: false,
  },
  {
    name: 'Half Yearly',
    price: '₹1,800',
    period: 'per half year',
    badge: 'Most Popular',
    features: [
      'Everything in Monthly',
      'Advanced Vision Engine',
      'Multiple AI Mentors',
      'Priority Support',
      'Adaptive Testing',
    ],
    cta: 'Choose Professional',
    link: 'https://dextora.org/admission',
    highlighted: true,
  },
  {
    name: 'Yearly',
    price: '₹2,400',
    period: 'per year',
    features: [
      'Everything in Half Yearly',
      'Dedicated AI Coach',
      'Career Pathways',
      '24/7 Phone Support',
      'Personalized Strategy',
    ],
    cta: 'Unlock Excellence',
    link: 'https://dextora.org/admission',
    highlighted: false,
  },
];

const PricingSection = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate section header
      gsap.from('.pricing-header', {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      // Animate pricing cards
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        gsap.from(card, {
          opacity: 0,
          y: 100,
          rotateX: -20,
          duration: 1,
          delay: index * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="relative section-padding bg-gradient-to-b from-dark-slate/40 via-charcoal/40 to-deep-navy/40 overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 gradient-bg-1 opacity-40 pointer-events-none" />
      <div className="absolute inset-0 noise-overlay pointer-events-none" />

      {/* Floating gradient orbs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-soft-cyan/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="pricing-header text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-electric-blue/10 border border-electric-blue/30 rounded-full mb-6">
            <span className="w-2 h-2 bg-electric-blue rounded-full animate-pulse" />
            <span className="text-sm text-electric-blue font-semibold">Pricing Plans</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Choose Your Plan</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Select the tier that aligns with your academic goals. All plans include AI mentorship and core learning tools.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 perspective-1000 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              className={`group relative preserve-3d pointer-events-auto ${plan.highlighted ? 'md:-translate-y-4' : ''
                }`}
            >
              {/* Badge for highlighted plan */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                  <div className="px-4 py-2 bg-gradient-to-r from-electric-blue to-soft-cyan text-deep-navy text-sm font-bold rounded-full shadow-lg">
                    {plan.badge}
                  </div>
                </div>
              )}

              {/* Card */}
              <div
                className={`glass-card p-8 md:p-10 h-full relative overflow-hidden transform transition-all duration-500 group-hover:scale-[1.02] group-hover:-translate-y-2 pointer-events-auto ${plan.highlighted
                    ? 'border-electric-blue/50 shadow-[0_0_50px_rgba(0,212,255,0.2)]'
                    : ''
                  }`}
              >
                {/* Plan name */}
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl md:text-5xl font-bold gradient-text">
                      {plan.price}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{plan.period}</p>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-electric-blue flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <a
                  href={plan.link}
                  className={`block w-full text-center py-4 rounded-full font-semibold transition-all duration-300 ${plan.highlighted
                      ? 'bg-gradient-to-r from-electric-blue to-soft-cyan text-deep-navy hover:shadow-[0_0_40px_rgba(0,212,255,0.4)] hover:scale-105'
                      : 'border-2 border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-deep-navy'
                    }`}
                >
                  {plan.cta}
                </a>

                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/0 via-electric-blue/5 to-electric-blue/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
              </div>

              {/* 3D depth shadow */}
              <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/10 to-subtle-violet/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 translate-y-4" />
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-12 text-center">
          <p className="text-gray-400">
            All plans include 7-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
