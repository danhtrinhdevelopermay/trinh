import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { useRef, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ErrorBoundary } from './ErrorBoundary';

function Mountain3DGeometry() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={[0, -0.5, 0]} castShadow>
        <coneGeometry args={[1.2, 2, 4]} />
        <meshStandardMaterial 
          color="#4D96A9" 
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>
      <mesh position={[-0.8, -0.8, 0.3]} castShadow>
        <coneGeometry args={[0.8, 1.5, 4]} />
        <meshStandardMaterial color="#6BCB77" roughness={0.7} />
      </mesh>
      <mesh position={[0.7, -0.9, 0.2]} castShadow>
        <coneGeometry args={[0.6, 1.2, 4]} />
        <meshStandardMaterial color="#5AA5B8" roughness={0.7} />
      </mesh>
      <pointLight position={[3, 3, 3]} intensity={0.8} color="#FFD93D" />
      <pointLight position={[-2, 2, 2]} intensity={0.5} color="#FF6B9D" />
      <ambientLight intensity={0.6} />
    </group>
  );
}

function Brain3DGeometry() {
  const brainRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (brainRef.current) {
      brainRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      brainRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group ref={brainRef}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial 
          color="#FF6B9D" 
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 0.6;
        const z = Math.sin(angle) * 0.6;
        return (
          <mesh key={i} position={[x, 0, z]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#C239B3" roughness={0.5} />
          </mesh>
        );
      })}
      <pointLight position={[2, 2, 2]} intensity={1} color="#FFD93D" />
      <ambientLight intensity={0.7} />
    </group>
  );
}

function Lightbulb3DGeometry() {
  const bulbRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  
  useFrame((state) => {
    if (bulbRef.current) {
      bulbRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 2 + Math.sin(state.clock.elapsedTime * 3) * 0.5;
    }
  });

  return (
    <group>
      <mesh ref={bulbRef} position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial 
          color="#FFD93D" 
          emissive="#FFA500"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.3, 0.35, 0.6, 16]} />
        <meshStandardMaterial color="#888888" metalness={0.9} roughness={0.2} />
      </mesh>
      <pointLight ref={lightRef} position={[0, 0.3, 0]} intensity={2} color="#FFD93D" distance={4} />
      <ambientLight intensity={0.4} />
    </group>
  );
}

function Stairs3DGeometry() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.3;
    }
  });

  const steps = 5;
  const colors = ['#FF6B9D', '#C239B3', '#6BCB77', '#4D96A9', '#FFD93D'];

  return (
    <group ref={groupRef}>
      {[...Array(steps)].map((_, i) => (
        <mesh 
          key={i} 
          position={[i * 0.35 - 0.7, i * 0.25 - 0.5, 0]}
          castShadow
        >
          <boxGeometry args={[0.4, 0.2, 0.6]} />
          <meshStandardMaterial 
            color={colors[i]} 
            roughness={0.5}
            metalness={0.3}
          />
        </mesh>
      ))}
      <pointLight position={[2, 3, 2]} intensity={1} color="#FFD93D" />
      <ambientLight intensity={0.6} />
    </group>
  );
}

function Globe3DGeometry() {
  const globeRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      globeRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group>
      <mesh ref={globeRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          color="#4D96A9" 
          roughness={0.4}
          metalness={0.6}
          wireframe={false}
        />
      </mesh>
      {[...Array(6)].map((_, i) => {
        const lat = ((i / 6) * Math.PI) - Math.PI / 2;
        return (
          <mesh key={`lat-${i}`} rotation={[lat, 0, 0]}>
            <torusGeometry args={[Math.cos(lat), 0.01, 16, 100]} />
            <meshBasicMaterial color="#6BCB77" />
          </mesh>
        );
      })}
      {[...Array(8)].map((_, i) => {
        const lon = (i / 8) * Math.PI * 2;
        return (
          <mesh key={`lon-${i}`} rotation={[0, lon, 0]}>
            <torusGeometry args={[1, 0.01, 16, 100]} />
            <meshBasicMaterial color="#FF6B9D" />
          </mesh>
        );
      })}
      <pointLight position={[3, 2, 2]} intensity={1.2} color="#FFD93D" />
      <ambientLight intensity={0.5} />
    </group>
  );
}

function Path3DGeometry() {
  const pathRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (pathRef.current) {
      pathRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <group ref={pathRef}>
      {[...Array(10)].map((_, i) => {
        const z = (i - 4.5) * 0.3;
        const y = -0.5 + (i * 0.05);
        const scale = 1 - (i * 0.05);
        return (
          <mesh key={i} position={[0, y, z]} scale={[scale, 0.1, scale]}>
            <boxGeometry args={[0.8, 0.1, 0.2]} />
            <meshStandardMaterial 
              color={i < 5 ? '#6BCB77' : '#FFD93D'} 
              roughness={0.6}
            />
          </mesh>
        );
      })}
      <pointLight position={[0, 2, -2]} intensity={1} color="#FF6B9D" />
      <ambientLight intensity={0.6} />
    </group>
  );
}

function Compass3DGeometry() {
  const compassRef = useRef<THREE.Group>(null);
  const needleRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (compassRef.current) {
      compassRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
    if (needleRef.current) {
      needleRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
  });

  return (
    <group ref={compassRef}>
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1, 1, 0.2, 32]} />
        <meshStandardMaterial 
          color="#4D96A9" 
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>
      <mesh position={[0, 0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.05, 32]} />
        <meshStandardMaterial color="#FFD93D" roughness={0.2} />
      </mesh>
      <mesh ref={needleRef} position={[0, 0.2, 0]} rotation={[0, 0, Math.PI / 4]}>
        <coneGeometry args={[0.1, 0.7, 4]} />
        <meshStandardMaterial color="#FF6B9D" emissive="#FF6B9D" emissiveIntensity={0.5} />
      </mesh>
      <pointLight position={[0, 2, 0]} intensity={1} color="#FFD93D" />
      <ambientLight intensity={0.6} />
    </group>
  );
}

function Shield3DGeometry() {
  const shieldRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (shieldRef.current) {
      shieldRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      shieldRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group>
      <mesh ref={shieldRef} position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 1.5, 0.2]} />
        <meshStandardMaterial 
          color="#6BCB77" 
          roughness={0.4}
          metalness={0.7}
        />
      </mesh>
      <mesh position={[0, 0.3, 0.12]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#FFD93D" roughness={0.3} metalness={0.9} />
      </mesh>
      <mesh position={[0, -0.3, 0.12]}>
        <torusGeometry args={[0.25, 0.08, 8, 16]} />
        <meshStandardMaterial color="#C239B3" roughness={0.4} />
      </mesh>
      <pointLight position={[2, 2, 2]} intensity={1.2} color="#FFD93D" />
      <ambientLight intensity={0.6} />
    </group>
  );
}

function Flag3DGeometry() {
  const flagRef = useRef<THREE.Mesh>(null);
  const poleRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (flagRef.current) {
      const time = state.clock.elapsedTime;
      flagRef.current.rotation.y = Math.sin(time * 2) * 0.1;
      flagRef.current.position.x = Math.sin(time * 3) * 0.05;
    }
    if (poleRef.current) {
      poleRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group>
      <mesh ref={poleRef} position={[-0.6, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 2, 16]} />
        <meshStandardMaterial color="#888888" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh ref={flagRef} position={[0, 0.5, 0]}>
        <planeGeometry args={[1, 0.7]} />
        <meshStandardMaterial 
          color="#FF0000" 
          roughness={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 0.5, 0.02]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#FFD93D" emissive="#FFD93D" emissiveIntensity={0.6} />
      </mesh>
      <pointLight position={[2, 2, 2]} intensity={1} color="#FFD93D" />
      <ambientLight intensity={0.7} />
    </group>
  );
}

function Sun3DGeometry() {
  const sunRef = useRef<THREE.Mesh>(null);
  const raysRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (sunRef.current) {
      sunRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
    if (raysRef.current) {
      raysRef.current.rotation.z = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group>
      <mesh ref={sunRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial 
          color="#FFD93D" 
          emissive="#FFA500"
          emissiveIntensity={0.9}
          roughness={0.2}
        />
      </mesh>
      <group ref={raysRef}>
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const x = Math.cos(angle) * 1;
          const y = Math.sin(angle) * 1;
          return (
            <mesh key={i} position={[x, y, 0]} rotation={[0, 0, angle]}>
              <coneGeometry args={[0.15, 0.4, 4]} />
              <meshStandardMaterial 
                color="#FFD93D" 
                emissive="#FFA500"
                emissiveIntensity={0.7}
              />
            </mesh>
          );
        })}
      </group>
      <pointLight position={[0, 0, 0]} intensity={2} color="#FFD93D" distance={5} />
      <ambientLight intensity={0.5} />
    </group>
  );
}

function Key3DGeometry() {
  const keyRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (keyRef.current) {
      keyRef.current.rotation.y = state.clock.elapsedTime * 0.4;
      keyRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.15;
    }
  });

  return (
    <group ref={keyRef}>
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 1.2, 16]} />
        <meshStandardMaterial 
          color="#C239B3" 
          roughness={0.3}
          metalness={0.9}
        />
      </mesh>
      <mesh position={[-0.6, 0, 0]}>
        <torusGeometry args={[0.3, 0.1, 16, 32]} />
        <meshStandardMaterial color="#C239B3" roughness={0.3} metalness={0.9} />
      </mesh>
      <mesh position={[0.5, 0.2, 0]}>
        <boxGeometry args={[0.25, 0.08, 0.08]} />
        <meshStandardMaterial color="#C239B3" roughness={0.3} metalness={0.9} />
      </mesh>
      <mesh position={[0.5, -0.2, 0]}>
        <boxGeometry args={[0.25, 0.08, 0.08]} />
        <meshStandardMaterial color="#C239B3" roughness={0.3} metalness={0.9} />
      </mesh>
      <pointLight position={[2, 2, 2]} intensity={1} color="#FFD93D" />
      <ambientLight intensity={0.6} />
    </group>
  );
}

function Chain3DGeometry() {
  const chainRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (chainRef.current) {
      chainRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group ref={chainRef}>
      {[...Array(5)].map((_, i) => {
        const y = (i - 2) * 0.35;
        const rotation = i % 2 === 0 ? 0 : Math.PI / 2;
        return (
          <mesh key={i} position={[0, y, 0]} rotation={[0, 0, rotation]}>
            <torusGeometry args={[0.25, 0.08, 8, 16]} />
            <meshStandardMaterial 
              color="#888888" 
              roughness={0.4}
              metalness={0.8}
            />
          </mesh>
        );
      })}
      <pointLight position={[2, 2, 2]} intensity={1} color="#FFD93D" />
      <ambientLight intensity={0.6} />
    </group>
  );
}

interface ThreeJSModelProps {
  modelType: 'mountain' | 'brain' | 'lightbulb' | 'stairs' | 'globe' | 'path' | 'compass' | 'shield' | 'flag' | 'sun' | 'key' | 'chain';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
}

export function ThreeJSModel({ modelType, x, y, width, height, rotation = 0 }: ThreeJSModelProps) {
  const getModelComponent = () => {
    switch (modelType) {
      case 'mountain':
        return <Mountain3DGeometry />;
      case 'brain':
        return <Brain3DGeometry />;
      case 'lightbulb':
        return <Lightbulb3DGeometry />;
      case 'stairs':
        return <Stairs3DGeometry />;
      case 'globe':
        return <Globe3DGeometry />;
      case 'path':
        return <Path3DGeometry />;
      case 'compass':
        return <Compass3DGeometry />;
      case 'shield':
        return <Shield3DGeometry />;
      case 'flag':
        return <Flag3DGeometry />;
      case 'sun':
        return <Sun3DGeometry />;
      case 'key':
        return <Key3DGeometry />;
      case 'chain':
        return <Chain3DGeometry />;
      default:
        return <Mountain3DGeometry />;
    }
  };

  return (
    <ErrorBoundary fallback={<div style={{ width: '100%', height: '100%', background: 'transparent' }} />}>
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width,
          height,
          transform: `rotate(${rotation}deg)`,
        }}
        data-testid={`threejs-model-${modelType}`}
      >
        <Suspense fallback={<div style={{ width: '100%', height: '100%', background: 'transparent' }} />}>
          <Canvas
            shadows
            gl={{ antialias: true, alpha: true }}
            style={{ background: 'transparent' }}
          >
            <PerspectiveCamera makeDefault position={[0, 0, 4]} />
            {getModelComponent()}
          </Canvas>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}

export { Mountain3DGeometry, Brain3DGeometry, Lightbulb3DGeometry, Stairs3DGeometry, Globe3DGeometry, Path3DGeometry, Compass3DGeometry, Shield3DGeometry, Flag3DGeometry, Sun3DGeometry, Key3DGeometry, Chain3DGeometry };
