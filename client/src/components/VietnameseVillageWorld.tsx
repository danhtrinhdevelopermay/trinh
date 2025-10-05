import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Float, Environment } from '@react-three/drei';
import { useRef, useEffect, Suspense } from 'react';
import * as THREE from 'three';
import { ErrorBoundary } from './ErrorBoundary';

function CameraController({ slideIndex, totalSlides }: { slideIndex: number; totalSlides: number }) {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());

  useEffect(() => {
    const journeyPath = [
      { position: new THREE.Vector3(-25, 3, 15), lookAt: new THREE.Vector3(0, 2, 0) },
      { position: new THREE.Vector3(-18, 4, 12), lookAt: new THREE.Vector3(5, 2, -5) },
      { position: new THREE.Vector3(-12, 4, 8), lookAt: new THREE.Vector3(0, 3, -8) },
      { position: new THREE.Vector3(-6, 5, 5), lookAt: new THREE.Vector3(8, 2, -12) },
      { position: new THREE.Vector3(0, 5, 3), lookAt: new THREE.Vector3(12, 3, -15) },
      { position: new THREE.Vector3(6, 6, 0), lookAt: new THREE.Vector3(15, 2, -18) },
      { position: new THREE.Vector3(12, 7, -3), lookAt: new THREE.Vector3(18, 3, -20) },
      { position: new THREE.Vector3(18, 8, -6), lookAt: new THREE.Vector3(20, 4, -25) },
    ];

    const index = Math.min(slideIndex, journeyPath.length - 1);
    const currentPoint = journeyPath[index];
    
    targetPosition.current.copy(currentPoint.position);
    targetLookAt.current.copy(currentPoint.lookAt);
  }, [slideIndex, totalSlides]);

  useFrame((state, delta) => {
    camera.position.lerp(targetPosition.current, delta * 1.2);
    
    const currentLookAt = new THREE.Vector3();
    camera.getWorldDirection(currentLookAt);
    currentLookAt.multiplyScalar(10).add(camera.position);
    currentLookAt.lerp(targetLookAt.current, delta * 1.2);
    camera.lookAt(currentLookAt);
  });

  return null;
}

function TraditionalHouse({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 2, 4]} />
        <meshStandardMaterial color="#D4A574" roughness={0.8} />
      </mesh>
      
      <mesh position={[0, 2.8, 0]} rotation={[0, 0, 0]} castShadow>
        <coneGeometry args={[2.5, 1.5, 4]} />
        <meshStandardMaterial color="#8B4513" roughness={0.7} />
      </mesh>
      
      <mesh position={[0, 0.5, 2.1]} castShadow>
        <boxGeometry args={[1.2, 1, 0.2]} />
        <meshStandardMaterial color="#654321" roughness={0.6} />
      </mesh>
      
      <mesh position={[-0.8, 0.8, 2.05]}>
        <boxGeometry args={[0.6, 0.8, 0.1]} />
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.6} />
      </mesh>
      <mesh position={[0.8, 0.8, 2.05]}>
        <boxGeometry args={[0.6, 0.8, 0.1]} />
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function BambooTree({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          child.rotation.z = Math.sin(state.clock.elapsedTime + i) * 0.05;
        }
      });
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.18, 4, 8]} />
        <meshStandardMaterial color="#7CB342" roughness={0.7} />
      </mesh>
      
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const radius = 0.8;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              3.5 + Math.sin(i) * 0.3,
              Math.sin(angle) * radius
            ]}
            rotation={[Math.PI / 6, angle, 0]}
            castShadow
          >
            <coneGeometry args={[0.3, 1.5, 4]} />
            <meshStandardMaterial color="#558B2F" roughness={0.6} />
          </mesh>
        );
      })}
    </group>
  );
}

function PalmTree({ position }: { position: [number, number, number] }) {
  const leavesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (leavesRef.current) {
      leavesRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 2.5, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.3, 5, 8]} />
        <meshStandardMaterial color="#8B6F47" roughness={0.8} />
      </mesh>
      
      <group ref={leavesRef} position={[0, 5, 0]}>
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[0, 0, 0]}
              rotation={[Math.PI / 3, angle, 0]}
              castShadow
            >
              <boxGeometry args={[0.4, 2, 0.1]} />
              <meshStandardMaterial color="#2E7D32" roughness={0.6} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

function AnimatedPerson({ position, speed = 1 }: { position: [number, number, number]; speed?: number }) {
  const personRef = useRef<THREE.Group>(null);
  const pathProgress = useRef(0);

  useFrame((state, delta) => {
    if (personRef.current) {
      pathProgress.current += delta * speed * 0.1;
      
      const radius = 5;
      const x = position[0] + Math.cos(pathProgress.current) * radius;
      const z = position[2] + Math.sin(pathProgress.current) * radius;
      
      personRef.current.position.set(x, position[1], z);
      personRef.current.rotation.y = pathProgress.current + Math.PI / 2;
      
      personRef.current.children[1].rotation.x = Math.sin(state.clock.elapsedTime * 4 * speed) * 0.5;
      personRef.current.children[2].rotation.x = Math.sin(state.clock.elapsedTime * 4 * speed + Math.PI) * 0.5;
    }
  });

  return (
    <group ref={personRef}>
      <mesh position={[0, 1, 0]} castShadow>
        <capsuleGeometry args={[0.3, 0.8, 8, 16]} />
        <meshStandardMaterial color="#FF6B9D" roughness={0.6} />
      </mesh>
      
      <mesh position={[-0.2, 0.3, 0]} castShadow>
        <capsuleGeometry args={[0.12, 0.5, 6, 12]} />
        <meshStandardMaterial color="#FFE0B2" roughness={0.5} />
      </mesh>
      <mesh position={[0.2, 0.3, 0]} castShadow>
        <capsuleGeometry args={[0.12, 0.5, 6, 12]} />
        <meshStandardMaterial color="#FFE0B2" roughness={0.5} />
      </mesh>
      
      <mesh position={[0, 1.6, 0]} castShadow>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#FFE0B2" roughness={0.5} />
      </mesh>
      
      <mesh position={[0, 2, 0.1]}>
        <torusGeometry args={[0.4, 0.15, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#8B4513" roughness={0.7} />
      </mesh>
    </group>
  );
}

function WaterBuffalo({ position }: { position: [number, number, number] }) {
  const buffaloRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (buffaloRef.current) {
      buffaloRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  return (
    <group ref={buffaloRef} position={position}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[1.2, 0.8, 1.8]} />
        <meshStandardMaterial color="#4A4A4A" roughness={0.9} />
      </mesh>
      
      <mesh position={[0, 1, 0.6]} castShadow>
        <boxGeometry args={[0.8, 0.6, 0.8]} />
        <meshStandardMaterial color="#4A4A4A" roughness={0.9} />
      </mesh>
      
      <mesh position={[-0.3, 1.3, 0.8]} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[0.08, 0.08, 0.8, 8]} />
        <meshStandardMaterial color="#3A3A3A" roughness={0.8} />
      </mesh>
      <mesh position={[0.3, 1.3, 0.8]} rotation={[0, 0, -Math.PI / 6]}>
        <cylinderGeometry args={[0.08, 0.08, 0.8, 8]} />
        <meshStandardMaterial color="#3A3A3A" roughness={0.8} />
      </mesh>
      
      {[[-0.4, 0, 0.5], [0.4, 0, 0.5], [-0.4, 0, -0.5], [0.4, 0, -0.5]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.12, 0.1, 0.6, 8]} />
          <meshStandardMaterial color="#3A3A3A" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function RiceField({ position, size }: { position: [number, number, number]; size: [number, number] }) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={size} />
        <meshStandardMaterial color="#9CCC65" roughness={0.9} />
      </mesh>
      
      {[...Array(50)].map((_, i) => {
        const x = (Math.random() - 0.5) * size[0];
        const z = (Math.random() - 0.5) * size[1];
        return (
          <mesh key={i} position={[x, 0.2, z]}>
            <cylinderGeometry args={[0.02, 0.02, 0.4, 4]} />
            <meshStandardMaterial color="#7CB342" roughness={0.7} />
          </mesh>
        );
      })}
    </group>
  );
}

function VillageGround() {
  return (
    <group>
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#8D6E63" roughness={0.95} />
      </mesh>
      
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#A1887F" roughness={0.9} />
      </mesh>
      
      {[...Array(30)].map((_, i) => {
        const x = (Math.random() - 0.5) * 70;
        const z = (Math.random() - 0.5) * 70;
        return (
          <mesh key={i} position={[x, 0.05, z]} rotation={[-Math.PI / 2, 0, Math.random() * Math.PI]}>
            <circleGeometry args={[Math.random() * 0.3 + 0.2, 8]} />
            <meshStandardMaterial color="#795548" roughness={0.8} />
          </mesh>
        );
      })}
    </group>
  );
}

function SunAndSky() {
  const sunRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (sunRef.current) {
      sunRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group>
      <mesh ref={sunRef} position={[30, 20, -30]}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFA500"
          emissiveIntensity={0.8}
        />
      </mesh>
      
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[
              30 + Math.cos(angle) * 4,
              20 + Math.sin(angle) * 4,
              -30
            ]}
          >
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial
              color="#FFD700"
              emissive="#FFA500"
              emissiveIntensity={0.6}
              transparent
              opacity={0.6}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function FloatingClouds() {
  const cloudsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (cloudsRef.current) {
      cloudsRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.1) * 5;
    }
  });

  return (
    <group ref={cloudsRef}>
      {[...Array(8)].map((_, i) => (
        <Float
          key={i}
          speed={1 + Math.random()}
          rotationIntensity={0.2}
          floatIntensity={0.5}
        >
          <mesh
            position={[
              (Math.random() - 0.5) * 40,
              15 + Math.random() * 5,
              -20 - Math.random() * 20
            ]}
          >
            <sphereGeometry args={[2 + Math.random(), 16, 16]} />
            <meshStandardMaterial
              color="#FFFFFF"
              transparent
              opacity={0.8}
              roughness={1}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

interface VietnameseVillageWorldProps {
  slideIndex: number;
  totalSlides: number;
}

function VillageScene({ slideIndex, totalSlides }: VietnameseVillageWorldProps) {
  return (
    <>
      <CameraController slideIndex={slideIndex} totalSlides={totalSlides} />
      
      <ambientLight intensity={0.6} color="#FFF8DC" />
      <directionalLight
        position={[30, 20, -30]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      <pointLight position={[0, 10, 0]} intensity={0.3} color="#87CEEB" />
      
      <fog attach="fog" args={['#87CEEB', 30, 80]} />
      
      <VillageGround />
      
      <TraditionalHouse position={[-8, 0, -5]} />
      <TraditionalHouse position={[5, 0, -8]} />
      <TraditionalHouse position={[-12, 0, -12]} />
      <TraditionalHouse position={[10, 0, -15]} />
      <TraditionalHouse position={[0, 0, -18]} />
      
      <BambooTree position={[-15, 0, 0]} />
      <BambooTree position={[-18, 0, -8]} />
      <BambooTree position={[12, 0, -5]} />
      <BambooTree position={[15, 0, -12]} />
      <BambooTree position={[-5, 0, 10]} />
      
      <PalmTree position={[-10, 0, 5]} />
      <PalmTree position={[8, 0, 3]} />
      <PalmTree position={[-20, 0, -15]} />
      <PalmTree position={[18, 0, -20]} />
      
      <AnimatedPerson position={[-3, 0, -2]} speed={1} />
      <AnimatedPerson position={[6, 0, -10]} speed={0.8} />
      <AnimatedPerson position={[-8, 0, -15]} speed={1.2} />
      
      <WaterBuffalo position={[3, 0, 8]} />
      <WaterBuffalo position={[-6, 0, 6]} />
      
      <RiceField position={[-15, 0, 15]} size={[10, 10]} />
      <RiceField position={[12, 0, 12]} size={[8, 12]} />
      <RiceField position={[0, 0, -25]} size={[15, 8]} />
      
      <SunAndSky />
      <FloatingClouds />
      
      <Environment preset="sunset" />
    </>
  );
}

export default function VietnameseVillageWorld({ slideIndex, totalSlides }: VietnameseVillageWorldProps) {
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
      <ErrorBoundary fallback={null}>
        <Suspense fallback={
          <div style={{ 
            width: '100%', 
            height: '100%', 
            background: 'linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 50%, #C8E6C9 100%)' 
          }} />
        }>
          <Canvas
            shadows
            gl={{ 
              antialias: true, 
              alpha: true,
              powerPreference: 'high-performance'
            }}
            style={{ background: 'linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 50%, #C8E6C9 100%)' }}
          >
            <PerspectiveCamera makeDefault position={[-25, 3, 15]} fov={75} />
            <VillageScene slideIndex={slideIndex} totalSlides={totalSlides} />
          </Canvas>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
