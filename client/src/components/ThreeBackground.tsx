import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeBackgroundProps {
  currentSlide: number;
  totalSlides: number;
}

// Camera positions for each slide
const cameraPositions = [
  { x: 0, y: 0, z: 15, lookAt: { x: 0, y: 0, z: 0 } },
  { x: -10, y: 3, z: 10, lookAt: { x: -8, y: 2, z: -5 } },
  { x: 10, y: -3, z: 12, lookAt: { x: 8, y: -2, z: -8 } },
  { x: 0, y: 8, z: 8, lookAt: { x: 0, y: 5, z: -10 } },
  { x: -8, y: -5, z: 10, lookAt: { x: -5, y: -4, z: -12 } },
  { x: 8, y: 5, z: 12, lookAt: { x: 6, y: 3, z: -15 } },
  { x: 0, y: 0, z: 20, lookAt: { x: 0, y: 0, z: 0 } },
  { x: 12, y: 0, z: 8, lookAt: { x: 0, y: 0, z: -5 } },
  { x: -12, y: 0, z: 8, lookAt: { x: 0, y: 0, z: -5 } },
  { x: 0, y: 12, z: 5, lookAt: { x: 0, y: 0, z: -5 } }
];

export default function ThreeBackground({ currentSlide, totalSlides }: ThreeBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    particles: THREE.Points;
    geometries: THREE.Mesh[];
    animationId: number;
    targetPosition: { x: number; y: number; z: number };
    targetLookAt: THREE.Vector3;
    currentLookAt: THREE.Vector3;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check for WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      console.warn('WebGL not supported, ThreeBackground will not render');
      return;
    }

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.05);
    
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 15);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true 
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      containerRef.current.appendChild(renderer.domElement);
    } catch (error) {
      console.error('Failed to create WebGL renderer:', error);
      return;
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00ff88, 2, 100);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff0088, 2, 100);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0x0088ff, 2, 100);
    pointLight3.position.set(0, 10, -10);
    scene.add(pointLight3);

    // Create geometric objects
    const geometries: THREE.Mesh[] = [];
    
    // Torus
    const torusGeometry = new THREE.TorusGeometry(3, 0.5, 16, 100);
    const torusMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x00ff88,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.set(-8, 2, -5);
    scene.add(torus);
    geometries.push(torus);

    // Icosahedron
    const icosahedronGeometry = new THREE.IcosahedronGeometry(2, 0);
    const icosahedronMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xff0088,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    const icosahedron = new THREE.Mesh(icosahedronGeometry, icosahedronMaterial);
    icosahedron.position.set(8, -2, -8);
    scene.add(icosahedron);
    geometries.push(icosahedron);

    // Octahedron
    const octahedronGeometry = new THREE.OctahedronGeometry(2.5, 0);
    const octahedronMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x0088ff,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    const octahedron = new THREE.Mesh(octahedronGeometry, octahedronMaterial);
    octahedron.position.set(0, 5, -10);
    scene.add(octahedron);
    geometries.push(octahedron);

    // Dodecahedron
    const dodecahedronGeometry = new THREE.DodecahedronGeometry(2, 0);
    const dodecahedronMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffaa00,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    const dodecahedron = new THREE.Mesh(dodecahedronGeometry, dodecahedronMaterial);
    dodecahedron.position.set(-5, -4, -12);
    scene.add(dodecahedron);
    geometries.push(dodecahedron);

    // Torusknot
    const torusknotGeometry = new THREE.TorusKnotGeometry(2, 0.5, 100, 16);
    const torusknotMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xff00ff,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    const torusknot = new THREE.Mesh(torusknotGeometry, torusknotMaterial);
    torusknot.position.set(6, 3, -15);
    scene.add(torusknot);
    geometries.push(torusknot);

    // Create particle system
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 3000;
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 100;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.1,
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Initialize target positions
    const targetPosition = { x: 0, y: 0, z: 15 };
    const targetLookAt = new THREE.Vector3(0, 0, 0);
    const currentLookAt = new THREE.Vector3(0, 0, 0);

    // Animation loop
    const clock = new THREE.Clock();
    
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      if (sceneRef.current) {
        sceneRef.current.animationId = animationId;
      }

      const elapsedTime = clock.getElapsedTime();

      // Rotate geometries
      geometries.forEach((geometry, index) => {
        geometry.rotation.x = elapsedTime * 0.3 * (index % 2 === 0 ? 1 : -1);
        geometry.rotation.y = elapsedTime * 0.2 * (index % 2 === 0 ? -1 : 1);
        geometry.rotation.z = elapsedTime * 0.1;
      });

      // Rotate particles slowly
      particles.rotation.y = elapsedTime * 0.05;

      // Smooth camera movement
      if (sceneRef.current) {
        camera.position.x += (sceneRef.current.targetPosition.x - camera.position.x) * 0.05;
        camera.position.y += (sceneRef.current.targetPosition.y - camera.position.y) * 0.05;
        camera.position.z += (sceneRef.current.targetPosition.z - camera.position.z) * 0.05;

        // Smooth camera look-at
        sceneRef.current.currentLookAt.x += (sceneRef.current.targetLookAt.x - sceneRef.current.currentLookAt.x) * 0.05;
        sceneRef.current.currentLookAt.y += (sceneRef.current.targetLookAt.y - sceneRef.current.currentLookAt.y) * 0.05;
        sceneRef.current.currentLookAt.z += (sceneRef.current.targetLookAt.z - sceneRef.current.currentLookAt.z) * 0.05;
        camera.lookAt(sceneRef.current.currentLookAt);
      }

      // Animate lights
      pointLight1.position.x = Math.sin(elapsedTime) * 10;
      pointLight1.position.z = Math.cos(elapsedTime) * 10;
      
      pointLight2.position.x = Math.cos(elapsedTime * 0.7) * 10;
      pointLight2.position.y = Math.sin(elapsedTime * 0.7) * 10;

      pointLight3.position.y = Math.sin(elapsedTime * 0.5) * 10;
      pointLight3.position.z = Math.cos(elapsedTime * 0.5) * 10;

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    sceneRef.current = {
      scene,
      camera,
      renderer,
      particles,
      geometries,
      animationId: 0,
      targetPosition,
      targetLookAt,
      currentLookAt
    };

    return () => {
      window.removeEventListener('resize', handleResize);
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);
        sceneRef.current.renderer.dispose();
        if (containerRef.current && containerRef.current.contains(sceneRef.current.renderer.domElement)) {
          containerRef.current.removeChild(sceneRef.current.renderer.domElement);
        }
      }
    };
  }, []);

  // Update camera position when slide changes
  useEffect(() => {
    if (!sceneRef.current) return;

    const positionIndex = currentSlide % cameraPositions.length;
    const newPosition = cameraPositions[positionIndex];

    // Update target positions for smooth animation
    sceneRef.current.targetPosition.x = newPosition.x;
    sceneRef.current.targetPosition.y = newPosition.y;
    sceneRef.current.targetPosition.z = newPosition.z;
    
    sceneRef.current.targetLookAt.set(
      newPosition.lookAt.x,
      newPosition.lookAt.y,
      newPosition.lookAt.z
    );
  }, [currentSlide]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0 }}
      data-testid="three-background"
    />
  );
}
