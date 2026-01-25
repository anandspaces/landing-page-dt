import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Gentle abstract mesh reacting to scroll
function FloatingForm() {
  const meshRef = useRef();
  const materialRef = useRef();
  const scrollRef = useRef(0);
  const scrollVelocityRef = useRef(0);
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(Date.now());
  const targetScaleRef = useRef(1);
  const currentScaleRef = useRef(1);
  const clickBounceRef = useRef(0);
  const targetPositionRef = useRef({ x: 0, y: 0, z: 0 });
  const isHoveringRef = useRef(false);

  // Wireframe icosahedron - clean geometric aesthetic
  const spikyGeometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(2.5, 1);
    return geo;
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      scrollRef.current = progress;
      
      // Calculate scroll velocity
      const now = Date.now();
      const timeDelta = (now - lastScrollTime.current) / 1000;
      const scrollDelta = Math.abs(window.scrollY - lastScrollY.current);
      scrollVelocityRef.current = timeDelta > 0 ? scrollDelta / timeDelta : 0;
      
      lastScrollY.current = window.scrollY;
      lastScrollTime.current = now;
      
      // Decay velocity over time
      setTimeout(() => {
        scrollVelocityRef.current *= 0.95;
      }, 50);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useFrame(({ clock, camera, mouse }) => {
    const t = clock.getElapsedTime();
    const scroll = scrollRef.current;
    const scrollVelocity = scrollVelocityRef.current;

    // Base rotation + boost from scroll velocity (capped for smoothness)
    const velocityBoost = Math.min(scrollVelocity * 0.002, 2);
    const rotationSpeed = 0.3 + velocityBoost;

    // Decay click bounce effect
    clickBounceRef.current *= 0.92;

    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed * 0.016;
      meshRef.current.rotation.x += rotationSpeed * 0.012;
      meshRef.current.rotation.z += rotationSpeed * 0.008;

      // If hovering, calculate repulsion from mouse
      if (isHoveringRef.current) {
        // Mouse is in normalized device coordinates (-1 to +1)
        // Move object in opposite direction
        const offsetX = -mouse.x * 0.8;
        const offsetY = -mouse.y * 0.8;
        
        targetPositionRef.current = { x: offsetX, y: offsetY, z: 0 };
      } else {
        targetPositionRef.current = { x: 0, y: 0, z: 0 };
      }

      // Smooth position interpolation
      const currentPos = meshRef.current.position;
      currentPos.x += (targetPositionRef.current.x - currentPos.x) * 0.1;
      currentPos.y += (targetPositionRef.current.y - currentPos.y) * 0.1;
      currentPos.z += (targetPositionRef.current.z - currentPos.z) * 0.1;

      // Smooth scale interpolation
      const bounceScale = 1 + clickBounceRef.current;
      const targetScale = targetScaleRef.current * bounceScale;
      currentScaleRef.current += (targetScale - currentScaleRef.current) * 0.1;
      meshRef.current.scale.setScalar(currentScaleRef.current);
    }

    if (materialRef.current) {
      materialRef.current.color.lerpColors(
        new THREE.Color('#4fd1ff'),
        new THREE.Color('#7c7cff'),
        scroll
      );
    }
  });
  
  const handlePointerEnter = (e) => {
    e.stopPropagation();
    isHoveringRef.current = true;
    targetScaleRef.current = 1.15;
    document.body.style.cursor = 'pointer';
  };

  const handlePointerLeave = (e) => {
    e.stopPropagation();
    isHoveringRef.current = false;
    targetScaleRef.current = 1.0;
    document.body.style.cursor = 'default';
  };

  const handleClick = (e) => {
    e.stopPropagation();
    clickBounceRef.current = 0.7;
  };

  return (
    <mesh 
      ref={meshRef} 
      geometry={spikyGeometry} 
      position={[0, 0, 0]}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
    >
      <meshStandardMaterial
        ref={materialRef}
        wireframe={true}
        metalness={0.8}
        roughness={0.2}
        emissiveIntensity={0.6}
        emissive={'#4fd1ff'}
      />
    </mesh>
  );
}

const ThreeScene = () => {
  const canvasContainerRef = useRef(null);

  useEffect(() => {
    // Ensure pointer events work on canvas container
    if (canvasContainerRef.current) {
      canvasContainerRef.current.style.pointerEvents = 'auto';
    }
  }, []);

  return (
    <div ref={canvasContainerRef} className="w-full h-full" style={{ pointerEvents: 'auto' }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full"
        style={{ pointerEvents: 'auto' }}
      >
        <color attach="background" args={[0, 0, 0, 0]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.1} />
        <directionalLight position={[-4, -2, -4]} intensity={0.6} />
        <FloatingForm />
      </Canvas>
    </div>
  );
};

export default ThreeScene;
