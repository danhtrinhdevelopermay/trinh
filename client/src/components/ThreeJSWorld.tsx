import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Stars, Float, MeshDistortMaterial, Environment } from '@react-three/drei';
import { useRef, useEffect, Suspense } from 'react';
import * as THREE from 'three';
import { ErrorBoundary } from './ErrorBoundary';

// Camera controller based on current slide
function CameraController({ slideIndex, totalSlides }: { slideIndex: number; totalSlides: number }) {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());

  useEffect(() => {
    // Define camera positions for different slides (journey through the world)
    const progress = slideIndex / (totalSlides - 1);
    
    // Create a journey path through 3D space
    const journeyPath = [
      // Start: Ground level, looking at the mountain ahead
      { position: new THREE.Vector3(-20, 2, 10), lookAt: new THREE.Vector3(0, 5, 0) },
      // Slide 2: Moving closer, slightly elevated
      { position: new THREE.Vector3(-15, 3, 8), lookAt: new THREE.Vector3(5, 8, -5) },
      // Slide 3: At the base of challenge mountain
      { position: new THREE.Vector3(-10, 4, 5), lookAt: new THREE.Vector3(0, 15, -10) },
      // Slide 4: Starting to climb
      { position: new THREE.Vector3(-5, 8, 3), lookAt: new THREE.Vector3(5, 20, -15) },
      // Slide 5: Mid-climb, looking at education area
      { position: new THREE.Vector3(0, 12, 0), lookAt: new THREE.Vector3(10, 15, -20) },
      // Slide 6: Higher perspective
      { position: new THREE.Vector3(5, 15, -3), lookAt: new THREE.Vector3(15, 18, -25) },
      // Slide 7: Near the peak
      { position: new THREE.Vector3(10, 20, -5), lookAt: new THREE.Vector3(20, 25, -30) },
      // Slide 8+: At the summit, panoramic view
      { position: new THREE.Vector3(15, 25, -8), lookAt: new THREE.Vector3(25, 25, -35) },
    ];

    const index = Math.min(slideIndex, journeyPath.length - 1);
    const currentPoint = journeyPath[index];
    
    targetPosition.current.copy(currentPoint.position);
    targetLookAt.current.copy(currentPoint.lookAt);
  }, [slideIndex, totalSlides]);

  useFrame((state, delta) => {
    // Smooth camera movement
    camera.position.lerp(targetPosition.current, delta * 1.5);
    
    // Smooth look-at transition
    const currentLookAt = new THREE.Vector3();
    camera.getWorldDirection(currentLookAt);
    currentLookAt.multiplyScalar(10).add(camera.position);
    currentLookAt.lerp(targetLookAt.current, delta * 1.5);
    camera.lookAt(currentLookAt);
  });

  return null;
}

// Animated mountain representing challenges to overcome
function ChallengeMountain() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <group>
      {/* Main mountain peak */}
      <mesh ref={meshRef} position={[0, 10, -15]} castShadow receiveShadow>
        <coneGeometry args={[8, 20, 6]} />
        <MeshDistortMaterial
          color="#4D96A9"
          speed={1}
          distort={0.3}
          radius={1}
        />
      </mesh>
      
      {/* Secondary peaks */}
      <mesh position={[-10, 8, -10]} castShadow>
        <coneGeometry args={[5, 15, 6]} />
        <meshStandardMaterial color="#6BCB77" roughness={0.8} metalness={0.2} />
      </mesh>
      
      <mesh position={[10, 7, -12]} castShadow>
        <coneGeometry args={[6, 14, 6]} />
        <meshStandardMaterial color="#5AA5B8" roughness={0.8} metalness={0.2} />
      </mesh>
    </group>
  );
}

// Floating knowledge orbs representing learning
function KnowledgeOrbs() {
  return (
    <group>
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 15 + Math.sin(i) * 3;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = 15 + Math.sin(i * 1.5) * 3;
        const colors = ['#FF6B9D', '#C239B3', '#6BCB77', '#FFD93D', '#4D96A9'];
        
        return (
          <Float
            key={i}
            speed={1 + Math.random() * 2}
            rotationIntensity={0.5}
            floatIntensity={0.5}
          >
            <mesh position={[x, y, z]}>
              <sphereGeometry args={[0.8, 16, 16]} />
              <meshStandardMaterial
                color={colors[i % colors.length]}
                emissive={colors[i % colors.length]}
                emissiveIntensity={0.3}
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
}

// Success platform at the peak
function SuccessPlatform() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group position={[20, 25, -30]}>
      <mesh ref={meshRef}>
        <torusGeometry args={[4, 0.5, 16, 100]} />
        <meshStandardMaterial
          color="#FFD93D"
          emissive="#FFA500"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[3, 3, 1, 32]} />
        <meshStandardMaterial
          color="#FF6B9D"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

// Ground/Path
function WorldGround() {
  return (
    <group>
      {/* Main ground plane */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial
          color="#2C3E50"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      {/* Path tiles */}
      {[...Array(20)].map((_, i) => (
        <mesh
          key={i}
          position={[-20 + i * 2, 0.1, 10 - i * 2]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[1.8, 1.8]} />
          <meshStandardMaterial
            color={i < 10 ? '#34495E' : '#FFD93D'}
            emissive={i < 10 ? '#000000' : '#FFA500'}
            emissiveIntensity={i < 10 ? 0 : 0.2}
            roughness={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

// Particle system for atmosphere
function AtmosphereParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  const particleCount = 1000;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 100;
    positions[i * 3 + 1] = Math.random() * 50;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
  }

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#FFD93D"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

interface ThreeJSWorldProps {
  slideIndex: number;
  totalSlides: number;
}

function WorldScene({ slideIndex, totalSlides }: ThreeJSWorldProps) {
  return (
    <>
      <CameraController slideIndex={slideIndex} totalSlides={totalSlides} />
      
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[20, 25, -30]} intensity={2} color="#FFD93D" distance={20} />
      <pointLight position={[0, 15, -15]} intensity={1.5} color="#FF6B9D" distance={25} />
      
      {/* Environment */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <fog attach="fog" args={['#1a1a2e', 30, 100]} />
      
      {/* World elements */}
      <WorldGround />
      <ChallengeMountain />
      <KnowledgeOrbs />
      <SuccessPlatform />
      <AtmosphereParticles />
    </>
  );
}

export default function ThreeJSWorld({ slideIndex, totalSlides }: ThreeJSWorldProps) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
      }}
    >
      <ErrorBoundary fallback={
        <div style={{ 
          width: '100%', 
          height: '100%', 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
        }} />
      }>
        <Suspense fallback={
          <div style={{ 
            width: '100%', 
            height: '100%', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
          }} />
        }>
          <Canvas
            shadows
            gl={{ 
              antialias: true, 
              alpha: true,
              powerPreference: 'high-performance'
            }}
            style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
          >
            <PerspectiveCamera makeDefault position={[-20, 2, 10]} fov={75} />
            <WorldScene slideIndex={slideIndex} totalSlides={totalSlides} />
          </Canvas>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
