import { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

/**
 * Neural Network Particles - 3D Scene
 * Creates an animated neural network visualization
 * Particles connect and pulse to represent AI learning
 */
const NeuralNetwork = () => {
  const particlesRef = useRef();
  const linesRef = useRef();
  const mousePosition = useRef({ x: 0, y: 0 });

  // Create particle positions in a sphere
  const particleCount = 200;
  const positions = new Float32Array(particleCount * 3);
  const radius = 5;

  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = radius * Math.cbrt(Math.random());

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePosition.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animation loop
  useFrame(({ clock }) => {
    if (particlesRef.current) {
      const time = clock.getElapsedTime();

      // Rotate the entire particle system slowly
      particlesRef.current.rotation.y = time * 0.05;
      particlesRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;

      // Mouse parallax
      particlesRef.current.rotation.y += mousePosition.current.x * 0.001;
      particlesRef.current.rotation.x += mousePosition.current.y * 0.001;

      // Pulse particles
      const positions = particlesRef.current.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        const pulse = Math.sin(time + i) * 0.02;
        positions[i + 2] += pulse;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#00d4ff"
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Rotating rings for depth */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[3, 0.02, 16, 100]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.3} />
        </mesh>
      </Float>

      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
        <mesh rotation={[0, Math.PI / 3, 0]}>
          <torusGeometry args={[4, 0.015, 16, 100]} />
          <meshBasicMaterial color="#a78bfa" transparent opacity={0.2} />
        </mesh>
      </Float>
    </group>
  );
};

/**
 * Hero Section Component
 * Fullscreen hero with:
 * - 3D neural network background
 * - Animated headline text
 * - Scroll-triggered fade transitions
 * - Call to action buttons
 */
const HeroSection = () => {
  const heroRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate headline from depth
      gsap.from('.hero-headline', {
        opacity: 0,
        y: 100,
        scale: 0.9,
        duration: 1.2,
        delay: 0.8,
        ease: 'power3.out',
      });

      // Animate subheadline
      gsap.from('.hero-subheadline', {
        opacity: 0,
        y: 60,
        duration: 1,
        delay: 1.2,
        ease: 'power3.out',
      });

      // Animate tagline
      gsap.from('.hero-tagline', {
        opacity: 0,
        y: 40,
        duration: 1,
        delay: 1.4,
        ease: 'power3.out',
      });

      // Animate buttons
      gsap.from('.hero-buttons', {
        opacity: 0,
        y: 40,
        duration: 1,
        delay: 1.6,
        ease: 'power3.out',
      });

      // Animate stats
      gsap.from('.hero-stat', {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.8,
        delay: 1.8,
        ease: 'power3.out',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent"
    >
      {/* 3D Background Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 75 }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <NeuralNetwork />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </div>

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-deep-navy/50 via-transparent to-deep-navy z-10 pointer-events-none" />
      <div className="absolute inset-0 gradient-bg-1 z-10 pointer-events-none" />

      {/* Content */}
      <div ref={textRef} className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 text-center">
        {/* Badge */}
        <div className="hero-headline inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-electric-blue/30 rounded-full mb-8">
          <span className="w-2 h-2 bg-electric-blue rounded-full animate-pulse" />
          <span className="text-sm text-gray-300">IIM Lucknow · IIT Kanpur</span>
        </div>

        {/* Main Headline */}
        <h1 className="hero-headline text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
          <span className="block gradient-text">DEXTORA AI</span>
        </h1>

        {/* Subheadline */}
        <h2 className="hero-subheadline text-2xl md:text-4xl lg:text-5xl font-semibold text-white/90 mb-6 leading-tight">
          AI-Powered Learning
          <br />
          for Academic Excellence
        </h2>

        {/* Tagline */}
        <p className="hero-tagline text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
          Personalized AI mentorship designed for Class 1–12, IIT-JEE, and NEET.
          <br className="hidden md:block" />
          Built on research-backed methods with 24/7 adaptive guidance.
        </p>

        {/* CTA Buttons */}
        <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
          <a
            href="/admission"
            className="btn-primary inline-block"
          >
            Start Free Trial
          </a>
          <a
            href="#workflow"
            className="btn-outline inline-block"
          >
            See How It Works
          </a>
        </div>

        {/* Hero Stats */}
        <div className="grid grid-cols-3 gap-6 md:gap-12 max-w-4xl mx-auto">
          <div className="hero-stat glass-card p-6 text-center">
            <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">50%</div>
            <div className="text-sm text-gray-400">Faster Learning</div>
          </div>
          <div className="hero-stat glass-card p-6 text-center">
            <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">30%</div>
            <div className="text-sm text-gray-400">Better Performance</div>
          </div>
          <div className="hero-stat glass-card p-6 text-center">
            <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">24/7</div>
            <div className="text-sm text-gray-400">AI Mentorship</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <div className="w-6 h-10 border-2 border-electric-blue/50 rounded-full p-1">
          <div className="w-1 h-3 bg-electric-blue rounded-full mx-auto animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
