import { ClipboardList, Target, Bot, BarChart, Users, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

const workflowSteps = [
  {
    number: '01',
    title: 'Assessment & Onboarding',
    description: 'Comprehensive skill mapping to establish your learning baseline and create an intelligent AI profile.',
    icon: <ClipboardList className="w-6 h-6 text-cyan" />,
  },
  {
    number: '02',
    title: 'Personalized Learning Path',
    description: 'Adaptive curriculum aligned with exam requirements, intelligently paced for optimal retention.',
    icon: <Target className="w-6 h-6 text-cyan" />,
  },
  {
    number: '03',
    title: 'AI Tutor & Vision Intelligence',
    description: '24/7 adaptive mentorship with real-time feedback and vision-based posture analysis.',
    icon: <Bot className="w-6 h-6 text-cyan" />,
  },
  {
    number: '04',
    title: 'Practice & Analytics',
    description: 'Adaptive mock tests with weak-area detection and detailed performance insights.',
    icon: <BarChart className="w-6 h-6 text-cyan" />,
  },
  {
    number: '05',
    title: 'Persona Ecosystem',
    description: 'Multiple AI mentors designed to build confidence, maintain motivation, and reduce stress.',
    icon: <Users className="w-6 h-6 text-cyan" />,
  },
  {
    number: '06',
    title: 'Outcome & Excellence',
    description: 'Complete exam readiness with academic mastery and career clarity for your future.',
    icon: <GraduationCap className="w-6 h-6 text-cyan" />,
  },
];

const WorkflowSection = () => {
  return (
    <section id="workflow" className="relative py-32 bg-charcoal overflow-hidden">
      {/* Connecting Line for Desktop */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent hidden lg:block" />

      <div className="relative z-10 w-full lg:max-w-[75%] px-6 md:px-12 lg:pl-24">
        <div className="mb-20 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              <span className="gradient-text">Your Path to Success</span>
            </h2>
            <p className="text-gray-400 font-mono text-sm max-w-2xl mx-auto lg:mx-0">
              SYSTEMATIC . ADAPTIVE . INTELLIGENT
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          {workflowSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="glass-panel p-8 h-full rounded-2xl hover:bg-charcoal-light/60 transition-colors border border-white/5 hover:border-cyan/30">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-4xl font-display font-bold text-white/5 group-hover:text-cyan/20 transition-colors">
                    {step.number}
                  </span>
                  <div className="w-12 h-12 rounded-lg bg-charcoal border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    {step.icon}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan transition-colors">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
              </div>

              {/* Decorative connecting dots for desktop */}
              <div className="absolute top-1/2 -right-4 w-2 h-2 bg-cyan rounded-full hidden lg:block opacity-20" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;
