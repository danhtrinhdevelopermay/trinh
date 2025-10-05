import { useState, useEffect } from 'react';
import VietnameseVillageWorld from './VietnameseVillageWorld';
import CSS3DVietnamVillage from './CSS3DVietnamVillage';

interface VillageWorldWrapperProps {
  slideIndex: number;
  totalSlides: number;
}

function detectWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch (e) {
    return false;
  }
}

export default function VillageWorldWrapper({ slideIndex, totalSlides }: VillageWorldWrapperProps) {
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);

  useEffect(() => {
    setHasWebGL(detectWebGLSupport());
  }, []);

  if (hasWebGL === null) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
          background: 'linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 50%, #C8E6C9 100%)',
        }}
      />
    );
  }

  if (hasWebGL) {
    return <VietnameseVillageWorld slideIndex={slideIndex} totalSlides={totalSlides} />;
  }

  return <CSS3DVietnamVillage slideIndex={slideIndex} totalSlides={totalSlides} />;
}
