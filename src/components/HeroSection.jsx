import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, PerspectiveCamera } from '@react-three/drei';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * Digital Grid Background
 * A moving perspective grid that gives a sense of forward momentum and digital space.
 */
const DigitalGrid = () => {
  const gridRef = useRef();

  useFrame(({ clock }) => {
    if (gridRef.current) {
      gridRef.current.position.z = (clock.getElapsedTime() * 0.5) % 1;
    }
  });

  return (
    <group rotation={[Math.PI / 2.5, 0, 0]} position={[0, -2, -5]}>
      <gridHelper
        ref={gridRef}
        args={[30, 40, 0x38bdf8, 0x1a1d26]}
        position={[0, 0, 0]}
      />
      {/* Second grid for depth illusion */}
      <gridHelper
        args={[30, 10, 0x6366f1, 0x000000]}
        position={[0, -0.1, 0]}
        rotation={[0, 0, 0]}
      />
    </group>
  );
};

const FloatingCode = ({ count = 15 }) => {
  const particles = useRef([]);

  useFrame(({ clock }) => {
    particles.current.forEach((el, i) => {
      if (el) {
        const t = clock.getElapsedTime();
        el.position.y += Math.sin(t + i) * 0.002;
        el.rotation.z += 0.001;
      }
    });
  });

  return (
    <group>
      {[...Array(count)].map((_, i) => (
        <Float key={i} speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh
            ref={el => particles.current[i] = el}
            position={[
              (Math.random() - 0.5) * 15,
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 5
            ]}
          >
            <boxGeometry args={[0.05, 0.05, 0.05]} />
            <meshBasicMaterial color={Math.random() > 0.5 ? "#38bdf8" : "#6366f1"} transparent opacity={0.6} />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

const HeroSection = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, filter: "blur(10px)" },
    visible: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 20
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-charcoal z-20">
      <style>{`
        @keyframes smoothFadeUp {
          from {
            opacity: 0;
            transform: translateY(40px);
            filter: blur(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }
      `}</style>

      {/* 3D Background Canvas */}
      <div className="absolute inset-0 z-0 opacity-60">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <ambientLight intensity={0.5} />
          <DigitalGrid />
          <FloatingCode />
          <fog attach="fog" args={['#05070a', 2, 10]} />
        </Canvas>
      </div>

      {/* Gradient overlays for depth and unification - REDUCED INTENSITY */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/10 via-transparent to-charcoal z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/5 via-charcoal/50 to-charcoal z-10 pointer-events-none" />

      {/* Content */}
      <motion.div
        className="relative z-20 w-full lg:max-w-[75%] px-6 md:px-12 lg:pl-24 text-center lg:text-left pt-32 md:pt-48"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ y: y1 }}
      >
        {/* Main Headline */}
        <div
          className="mb-6 relative inline-block"
        >
          <div className="absolute -inset-1 blur-2xl bg-cyan/20 rounded-full opacity-0 animate-pulse-slow"></div>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold leading-tight tracking-tighter mix-blend-screen px-4 overflow-hidden">
            {/* CSS Animation for main thread resilience */}
            <span className="block drop-shadow-[0_0_15px_rgba(56,189,248,0.2)]">
              {Array.from("DEXTORA").map((char, index) => (
                <span
                  key={index}
                  className="inline-block gradient-text will-change-transform"
                  style={{
                    opacity: 0, // Start hidden
                    animation: `smoothFadeUp 0.8s cubic-bezier(0.2, 0.65, 0.3, 0.9) forwards`,
                    animationDelay: `${1.2 + (index * 0.1)}s` // Delayed start
                  }}
                >
                  {char}
                </span>
              ))}
            </span>
          </h1>
        </div>

        {/* Subheadline */}
        <motion.h2
          variants={itemVariants}
          className="text-2xl md:text-4xl lg:text-5xl font-sans font-medium text-offwhite/90 mb-8 leading-tight tracking-tight lg:max-w-2xl"
        >
          AI-Powered Learning
          <br />
          <span className="text-cyan font-display">for Academic Excellence</span>
        </motion.h2>

        {/* Tagline */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto lg:mx-0 mb-12 font-light leading-relaxed font-mono"
        >
          Personalized AI mentorship for Class 1–12, IIT-JEE, NEET, and UPSC.
          <br className="hidden md:block" />
          <span className="text-cyan">Research-backed. 24/7 Adaptive.</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 mb-20"
        >
          <a
            href="/admission"
            className="group relative inline-flex items-center justify-center px-8 py-4 bg-cyan text-charcoal font-bold uppercase tracking-widest clip-path-slant hover:bg-white transition-all duration-300"
          >
            <span className="relative z-10">Start Free Trial</span>
            <div className="absolute inset-0 bg-white/50 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </a>

          <a
            href="#workflow"
            className="group relative inline-flex items-center justify-center px-8 py-4 border border-cyan/30 text-cyan font-bold uppercase tracking-widest clip-path-slant hover:bg-cyan/10 hover:border-cyan hover:shadow-glow-cyan transition-all duration-300 backdrop-blur-sm"
          >
            <span className="relative z-10">See How It Works</span>
          </a>
        </motion.div>

        {/* Hero Stats */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-3 gap-6 md:gap-12 max-w-4xl mx-auto lg:mx-0 lg:max-w-2xl"
        >
          {[
            { val: "50%", label: "Faster Learning" },
            { val: "30%", label: "Better Grades" },
            { val: "24/7", label: "AI Mentorship" }
          ].map((stat, idx) => (
            <div key={idx} className="glass-card p-6 text-center group hover:bg-charcoal/60 transition-colors">
              <div className="text-3xl md:text-5xl font-display font-bold gradient-text mb-2 drop-shadow-md group-hover:scale-110 transition-transform duration-300">{stat.val}</div>
              <div className="text-xs md:text-sm text-gray-400 font-mono uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <div className="w-[1px] h-20 bg-gradient-to-b from-cyan to-transparent mx-auto relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-white animate-scanline"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
