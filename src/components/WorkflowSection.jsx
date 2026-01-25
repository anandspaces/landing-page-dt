import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Workflow Section with Milestone Cards
 * Advanced scrollytelling with:
 * - Milestone cards appearing sequentially on scroll
 */

const workflowSteps = [
  {
    number: '01',
    title: 'Assessment & Onboarding',
    description: 'Comprehensive skill mapping to establish your learning baseline and create an intelligent AI profile.',
    icon: '📝',
  },
  {
    number: '02',
    title: 'Personalized Learning Path',
    description: 'Adaptive curriculum aligned with exam requirements, intelligently paced for optimal retention.',
    icon: '🎯',
  },
  {
    number: '03',
    title: 'AI Tutor & Vision Intelligence',
    description: '24/7 adaptive mentorship with real-time feedback and vision-based posture analysis.',
    icon: '🤖',
  },
  {
    number: '04',
    title: 'Practice & Analytics',
    description: 'Adaptive mock tests with weak-area detection and detailed performance insights.',
    icon: '📊',
  },
  {
    number: '05',
    title: 'Persona Ecosystem',
    description: 'Multiple AI mentors designed to build confidence, maintain motivation, and reduce stress.',
    icon: '👥',
  },
  {
    number: '06',
    title: 'Outcome & Excellence',
    description: 'Complete exam readiness with academic mastery and career clarity for your future.',
    icon: '🎓',
  },
];

const WorkflowSection = () => {
  const cardsContainerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate milestone cards appearing
      const cards = gsap.utils.toArray('.milestone-card');
      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 50,
          },
          {
            opacity: 1,
            y: 0,
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              end: 'top 20%',
              scrub: 1,
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      });
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="workflow"
      className="relative min-h-screen bg-gradient-to-b from-deep-navy/40 via-charcoal/40 to-deep-navy/40 overflow-hidden py-20"
    >
      {/* Background effects */}
      <div className="absolute inset-0 gradient-bg-2 opacity-50 pointer-events-none" />
      <div className="absolute inset-0 noise-overlay pointer-events-none" />

      {/* Cards Container */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          {/* Section Title */}
          <div className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-electric-blue/10 border border-electric-blue/30 rounded-full mb-6">
              <span className="text-sm text-electric-blue font-semibold">Learning Journey</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">Your Path</span>
              <br />
              <span className="text-white">to Success</span>
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
              Follow our proven six-step pathway to academic excellence, guided by AI at every stage.
            </p>
          </div>

          {/* Milestone Cards Grid */}
          <div ref={cardsContainerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {workflowSteps.map((step, index) => (
              <div
                key={index}
                className="milestone-card glass-card p-6 md:p-8 hover:border-electric-blue/50 transition-all duration-300"
              >
                <div className="flex flex-col h-full">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-electric-blue/20 to-subtle-violet/20 border border-electric-blue/30 rounded-xl flex items-center justify-center text-3xl mb-4">
                    {step.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-sm font-mono text-electric-blue font-bold">{step.number}</span>
                      <h3 className="text-lg font-bold text-white">{step.title}</h3>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed mt-3">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;
