import { useRef } from 'react';
import { Bot, Eye, Users, Target } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import ScrollRevealHeading from './ScrollRevealHeading';

const services = [
  {
    title: 'Adaptive AI Tutoring',
    subtitle: 'Personalized Learning Pathways',
    description: 'AI mentors that analyze your learning patterns and adapt content delivery to optimize comprehension and retention.',
    icon: <Bot className="w-10 h-10 text-cyan" />,
    color: 'from-cyan to-blue-500',
  },
  {
    title: 'Vision Intelligence',
    subtitle: 'Posture & Note Digitization',
    description: 'Computer vision technology monitors study posture and automatically digitizes handwritten notes for better organization.',
    icon: <Eye className="w-10 h-10 text-cyan" />,
    color: 'from-blue-400 to-indigo-500',
  },
  {
    title: 'Multiple AI Mentors',
    subtitle: 'Diverse Teaching Styles',
    description: 'Access different AI mentor personalities—from structured guides to exploratory coaches—tailored to your learning preferences.',
    icon: <Users className="w-10 h-10 text-violet" />,
    color: 'from-violet to-fuchsia-500',
  },
  {
    title: 'Intelligent Workflow',
    subtitle: '7-Step Learning Framework',
    description: 'Follow a research-backed process that transforms passive study into active knowledge building and long-term retention.',
    icon: <Target className="w-10 h-10 text-cyan" />,
    color: 'from-fuchsia-500 to-cyan',
  },
];

const ServiceCard = ({ service, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative h-full"
    >
      {/* Main Card Container */}
      <div className="relative h-full bg-[#0d1219] border border-white/5 rounded-2xl p-8 hover:border-cyan/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">

        {/* Tech Corner Accents - decorative bits that appear on hover */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-tl-2xl" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-br-2xl" />

        {/* Icon Container - Clean & Sharp */}
        <div className="mb-6 relative inline-block">
          <div className={`absolute inset-0 bg-gradient-to-r ${service.color} blur-xl opacity-20`} />
          <div className="relative w-14 h-14 bg-charcoal border border-white/10 rounded-xl flex items-center justify-center group-hover:border-white/30 transition-colors">
            {service.icon}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan transition-colors font-display">
            {service.title}
          </h3>
          <p className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest mb-4 group-hover:text-gray-400 transition-colors">
            {service.subtitle}
          </p>
          <p className="text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
            {service.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const ServicesSection = () => {
  return (
    <section id="services" className="relative pt-64 pb-32 bg-charcoal overflow-hidden">
      {/* Background Grids */}
      <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none" />

      {/* Main Content Area - constrained to left side on large screens */}
      <div className="relative z-10 w-full lg:max-w-[75%] px-6 md:px-12 lg:pl-24">
        <div className="text-center lg:text-left mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan/30 bg-cyan/5 mb-6 backdrop-blur-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
            <span className="text-xs font-mono text-cyan uppercase tracking-widest">Core Capabilities</span>
          </motion.div>

          <ScrollRevealHeading
            text="AI-Powered Ecosystem"
            className="text-4xl md:text-6xl font-display font-bold mb-6 origin-center lg:origin-left"
            textClassName="gradient-text"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>


      </div>
    </section>
  );
};


export default ServicesSection;
