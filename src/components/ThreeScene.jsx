import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float, Html } from '@react-three/drei';

// ==========================================
// 1. STUDENT: ATOM MODEL (Science, Knowledge)
// ==========================================
function AtomModel({ scroll }) {
  const groupRef = useRef();

  // Create 3 rings for electrons
  const ringGeo = useMemo(() => new THREE.TorusGeometry(3.5, 0.05, 16, 100), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.2;
      groupRef.current.rotation.z = t * 0.1;
    }
  });

  return (
    <group ref={groupRef} scale={0.7}>
      {/* Nucleus */}
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial
          color="#00f3ff"
          emissive="#00f3ff"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>

      {/* Electron Rings */}
      <group rotation={[Math.PI / 3, 0, 0]}>
        <mesh geometry={ringGeo}>
          <meshBasicMaterial color="#00f3ff" transparent opacity={0.3} />
        </mesh>
        <mesh position={[3.5, 0, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial color="#00f3ff" />
        </mesh>
      </group>

      <group rotation={[Math.PI * 2 / 3, 0, 0]}>
        <mesh geometry={ringGeo}>
          <meshBasicMaterial color="#bd00ff" transparent opacity={0.3} />
        </mesh>
        <mesh position={[3.5, 0, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial color="#bd00ff" />
        </mesh>
      </group>

      <group rotation={[0, Math.PI / 4, 0]}>
        <mesh geometry={ringGeo}>
          <meshBasicMaterial color="#ff00aa" transparent opacity={0.3} />
        </mesh>
        <mesh position={[3.5, 0, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial color="#ff00aa" />
        </mesh>
      </group>
    </group>
  );
}

// ==========================================
// 2. PARENT: ORBIT MODEL (Guidance & Oversight)
// ==========================================
function ShieldModel({ scroll }) {
  const groupRef = useRef();

  // Concept: "Guidance" - A large sphere (Parent) with a smaller sphere (Child) orbiting it.
  // Represents oversight, connection, and keeping the student in a safe orbit.

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.15;
      groupRef.current.rotation.x = Math.sin(t * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef} scale={1.2}>
      {/* 1. The Parent (Central Sphere) */}
      <mesh>
        <sphereGeometry args={[1.4, 24, 24]} />
        <meshBasicMaterial
          color="#4aaeff" // Trustworthy Blue
          wireframe={true}
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Inner Glow for Parent */}
      <mesh>
        <sphereGeometry args={[1.0, 24, 24]} />
        <meshStandardMaterial
          color="#0044ff"
          emissive="#0066ff"
          emissiveIntensity={1}
          roughness={0.2}
          metalness={0.8}
          transparent opacity={0.5}
        />
      </mesh>

      {/* 2. The Child (Orbiting Sphere) */}
      <group rotation={[Math.PI / 6, 0, 0]}> {/* Tilted Orbit */}
        <group rotation={[0, Date.now() * 0.001, 0]}> {/* Simple dynamic rotation approximation if t isnt avail, but useFrame handles it */}
          {/* Note: The group itself isn't rotated by useFrame logic for the child alone, 
                 so we'll just put the child at a fixed position and let the whole group spin, 
                 OR add a child-specific ref. For simplicity, we let the whole group spin slowly. 
                 To make the child orbit FASTER, we need a nested ref.
             */}
          <mesh position={[2.2, 0, 0]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial
              color="#00f3ff"
              emissive="#ffffff"
              emissiveIntensity={2}
            />
          </mesh>
          {/* Trail/Orbit Line */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[2.2, 0.02, 16, 100]} />
            <meshBasicMaterial color="#4aaeff" transparent opacity={0.3} />
          </mesh>
        </group>
      </group>

      {/* 3. Connection/Field (Subtle Outer Shell) */}
      <mesh>
        <icosahedronGeometry args={[2.5, 0]} />
        <meshBasicMaterial color="#4aaeff" wireframe transparent opacity={0.05} />
      </mesh>
    </group>
  );
}

// ==========================================
// 3. SCHOOL: NETWORK GLOBE (Connectivity)
// ==========================================
function NetworkModel() {
  const groupRef = useRef();

  // Generate random points on a sphere
  const { points, lines } = useMemo(() => {
    const pts = [];
    const numPoints = 20;
    const radius = 3;
    for (let i = 0; i < numPoints; i++) {
      const phi = Math.acos(-1 + (2 * i) / numPoints);
      const theta = Math.sqrt(numPoints * Math.PI) * phi;
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);
      pts.push(new THREE.Vector3(x, y, z));
    }
    return { points: pts };
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
      groupRef.current.rotation.x += 0.001;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Core Sphere Wireframe */}
      <mesh>
        <icosahedronGeometry args={[2.8, 1]} />
        <meshBasicMaterial color="#4aaeff" wireframe transparent opacity={0.15} />
      </mesh>

      {/* Nodes */}
      {points.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#ffffff" : "#4444ff"} emissive={i % 2 === 0 ? "#ffffff" : "#4444ff"} emissiveIntensity={0.8} />
        </mesh>
      ))}

      {/* Connections (simplified merely as a visual wireframe layer for now to save perf) */}
      <mesh>
        <icosahedronGeometry args={[2.8, 0]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.1} />
      </mesh>
    </group>
  );
}

// ==========================================
// 4. TEACHER: DNA HELIX (Growth, Foundation)
// ==========================================
function DNAModel() {
  const groupRef = useRef();

  const particles = useMemo(() => {
    const parts = [];
    const count = 40;
    const height = 8;
    const radius = 1.5;
    const turns = 2;

    for (let i = 0; i < count; i++) {
      const t = i / count;
      const angle = t * Math.PI * 2 * turns;
      const y = (t - 0.5) * height;

      // Strand 1
      parts.push({ x: Math.cos(angle) * radius, y: y, z: Math.sin(angle) * radius, color: '#ffd700' });
      // Strand 2
      parts.push({ x: Math.cos(angle + Math.PI) * radius, y: y, z: Math.sin(angle + Math.PI) * radius, color: '#ff6b00' });
    }
    return parts;
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <group ref={groupRef} rotation={[0, 0, Math.PI / 6]}>
      {particles.map((p, i) => (
        <group key={i}>
          <mesh position={[p.x, p.y, p.z]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color={p.color} emissive={p.color} emissiveIntensity={0.6} />
          </mesh>
          {/* Visual connectors could be added here, but dots look clean */}
        </group>
      ))}
      {/* Central axis hint */}
      <mesh>
        <cylinderGeometry args={[0.05, 0.05, 8, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
      </mesh>
    </group>
  );
}


// ==========================================
// DEFAULT: ABSTRACT GEOMETRY
// ==========================================
function DefaultGeometry({ scroll }) {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.002;
      meshRef.current.rotation.y += 0.003;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2.5, 1]} />
      <meshStandardMaterial
        color="#00f3ff"
        wireframe={true}
        emissive="#bd00ff"
        emissiveIntensity={0.5}
        transparent
        opacity={0.3}
      />
    </mesh>
  )
}


const ThreeScene = ({ visualType = 'default' }) => {
  const canvasContainerRef = useRef(null);

  useEffect(() => {
    if (canvasContainerRef.current) {
      canvasContainerRef.current.style.pointerEvents = 'auto';
    }
  }, []);

  // Select component based on type
  const SceneContent = useMemo(() => {
    switch (visualType) {
      case 'student': return AtomModel;
      case 'parent': return ShieldModel;
      case 'school': return NetworkModel;
      case 'teacher': return DNAModel;
      default: return DefaultGeometry;
    }
  }, [visualType]);

  return (
    <div ref={canvasContainerRef} className="w-full h-full opacity-90 blur-[4px] pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full"
      >
        <color attach="background" args={[0, 0, 0, 0]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <directionalLight position={[-4, -2, -4]} intensity={0.5} />

        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <SceneContent />
        </Float>

      </Canvas>
    </div>
  );
};

export default ThreeScene;
