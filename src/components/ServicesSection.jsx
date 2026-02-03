import { useRef } from 'react';
import { Bot, Eye, Users, Target } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

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
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative h-full"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-cyan/20 to-violet/20 rounded-xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />

      <div className="relative h-full glass-card p-8 border border-white/5 hover:border-cyan/30 transition-colors duration-300 overflow-hidden">
        {/* Holographic overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300" />

        {/* Icon */}
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-lg bg-charcoal border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-cyan/50 transition-all duration-300 shadow-lg group-hover:shadow-glow-cyan">
            {service.icon}
          </div>
          <div className={`absolute -inset-2 bg-gradient-to-r ${service.color} opacity-20 blur-lg rounded-full`} />
        </div>

        {/* Content */}
        <h3 className="text-2xl font-display font-bold text-white mb-2 group-hover:text-cyan transition-colors">
          {service.title}
        </h3>
        <p className="text-sm font-mono text-cyan/80 mb-4 tracking-wide text-xs uppercase">
          {service.subtitle}
        </p>
        <p className="text-gray-400 leading-relaxed text-sm">
          {service.description}
        </p>

        {/* Tech Corner Accents */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-hover:border-cyan transition-colors" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-hover:border-cyan transition-colors" />
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

          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-display font-bold mb-6 origin-center lg:origin-left"
          >
            <span className="gradient-text">AI-Powered Ecosystem</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 text-center md:text-left"
        >
          <a href="/admission" className="btn-outline">
            Explore All Features
          </a>
        </motion.div>
      </div>
    </section>
  );
};


export default ServicesSection;
