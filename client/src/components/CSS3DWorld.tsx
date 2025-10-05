import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface CSS3DWorldProps {
  slideIndex: number;
  totalSlides: number;
}

// Define journey stages with visual themes
const journeyStages = [
  { 
    name: 'Start', 
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    perspective: 1000,
    rotateX: 0,
    rotateY: 0,
    translateZ: 0
  },
  { 
    name: 'Awareness', 
    gradient: 'linear-gradient(135deg, #16213e 0%, #0f3460 50%, #1e3a5f 100%)',
    perspective: 1200,
    rotateX: 5,
    rotateY: 10,
    translateZ: -50
  },
  { 
    name: 'Challenge', 
    gradient: 'linear-gradient(135deg, #0f3460 0%, #1e3a5f 50%, #533483 100%)',
    perspective: 1400,
    rotateX: 10,
    rotateY: 20,
    translateZ: -100
  },
  { 
    name: 'Learning', 
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #533483 50%, #7c2d6f 100%)',
    perspective: 1600,
    rotateX: 15,
    rotateY: 30,
    translateZ: -150
  },
  { 
    name: 'Growth', 
    gradient: 'linear-gradient(135deg, #533483 0%, #7c2d6f 50%, #a0295b 100%)',
    perspective: 1800,
    rotateX: 20,
    rotateY: 40,
    translateZ: -200
  },
  { 
    name: 'Mastery', 
    gradient: 'linear-gradient(135deg, #7c2d6f 0%, #a0295b 50%, #c42847 100%)',
    perspective: 2000,
    rotateX: 25,
    rotateY: 50,
    translateZ: -250
  },
  { 
    name: 'Success', 
    gradient: 'linear-gradient(135deg, #a0295b 0%, #c42847 50%, #e63946 100%)',
    perspective: 2200,
    rotateX: 30,
    rotateY: 60,
    translateZ: -300
  },
  { 
    name: 'Victory', 
    gradient: 'linear-gradient(135deg, #c42847 0%, #e63946 50%, #ff6b9d 100%)',
    perspective: 2400,
    rotateX: 35,
    rotateY: 70,
    translateZ: -350
  }
];

// Floating particles
function FloatingParticles({ count = 50, slideIndex }: { count?: number; slideIndex: number }) {
  const [particles] = useState(() => 
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5
    }))
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white/30"
          initial={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

// 3D Mountain shapes
function MountainShapes({ slideIndex }: { slideIndex: number }) {
  const progress = slideIndex / 7;
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary mountain - grows as we progress */}
      <motion.div
        className="absolute bottom-0 left-1/2"
        animate={{
          translateX: '-50%',
          translateY: `${100 - progress * 20}%`,
          scale: 1 + progress * 0.5,
          rotateZ: progress * 10
        }}
        transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
      >
        <div 
          className="w-0 h-0 opacity-20"
          style={{
            borderLeft: '300px solid transparent',
            borderRight: '300px solid transparent',
            borderBottom: '500px solid currentColor',
            filter: 'blur(2px)',
          }}
        />
      </motion.div>

      {/* Secondary peaks */}
      <motion.div
        className="absolute bottom-0 left-1/4"
        animate={{
          translateY: `${120 - progress * 30}%`,
          scale: 0.8 + progress * 0.3,
        }}
        transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
      >
        <div 
          className="w-0 h-0 opacity-15"
          style={{
            borderLeft: '200px solid transparent',
            borderRight: '200px solid transparent',
            borderBottom: '350px solid currentColor',
            filter: 'blur(3px)',
          }}
        />
      </motion.div>

      <motion.div
        className="absolute bottom-0 right-1/4"
        animate={{
          translateY: `${110 - progress * 25}%`,
          scale: 0.7 + progress * 0.4,
        }}
        transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
      >
        <div 
          className="w-0 h-0 opacity-15"
          style={{
            borderLeft: '180px solid transparent',
            borderRight: '180px solid transparent',
            borderBottom: '320px solid currentColor',
            filter: 'blur(3px)',
          }}
        />
      </motion.div>
    </div>
  );
}

// Knowledge orbs floating in space
function KnowledgeOrbs({ slideIndex }: { slideIndex: number }) {
  const orbCount = Math.min(slideIndex + 3, 12);
  const orbs = Array.from({ length: orbCount }, (_, i) => i);
  const colors = ['#FF6B9D', '#C239B3', '#6BCB77', '#FFD93D', '#4D96A9'];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <AnimatePresence>
        {orbs.map((i) => {
          const angle = (i / 12) * Math.PI * 2;
          const radius = 30 + Math.sin(i) * 5;
          const x = 50 + Math.cos(angle) * radius;
          const y = 50 + Math.sin(angle) * radius;

          return (
            <motion.div
              key={i}
              className="absolute rounded-full"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 0.6,
                x: `${x}vw`,
                y: `${y}vh`,
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                duration: 0.8,
                delay: i * 0.1,
              }}
            >
              <motion.div
                className="w-8 h-8 rounded-full"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${colors[i % colors.length]}, ${colors[i % colors.length]}99)`,
                  boxShadow: `0 0 20px ${colors[i % colors.length]}80`,
                }}
                animate={{
                  y: [0, -20, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 2
                }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// Path elements showing progress
function ProgressPath({ slideIndex, totalSlides }: { slideIndex: number; totalSlides: number }) {
  const steps = Array.from({ length: totalSlides }, (_, i) => i);
  
  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-4 pointer-events-none">
      {steps.map((step) => (
        <motion.div
          key={step}
          className="w-3 h-3 rounded-full"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: step <= slideIndex ? 1 : 0.5,
            opacity: step <= slideIndex ? 1 : 0.3,
            backgroundColor: step <= slideIndex ? '#FFD93D' : '#FFFFFF50',
          }}
          transition={{
            duration: 0.5,
            delay: step * 0.05,
          }}
        />
      ))}
    </div>
  );
}

export default function CSS3DWorld({ slideIndex, totalSlides }: CSS3DWorldProps) {
  const stageIndex = Math.min(slideIndex, journeyStages.length - 1);
  const stage = journeyStages[stageIndex];

  return (
    <motion.div
      className="fixed inset-0 overflow-hidden"
      style={{ 
        zIndex: -1,
        perspective: `${stage.perspective}px`,
        background: stage.gradient,
      }}
      animate={{
        background: stage.gradient,
      }}
      transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* 3D transformed world container */}
      <motion.div
        className="absolute inset-0"
        animate={{
          rotateX: stage.rotateX,
          rotateY: stage.rotateY,
          translateZ: stage.translateZ,
        }}
        transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <MountainShapes slideIndex={slideIndex} />
        <FloatingParticles count={40} slideIndex={slideIndex} />
      </motion.div>

      {/* Foreground elements */}
      <KnowledgeOrbs slideIndex={slideIndex} />
      
      {/* Radial glow effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.4) 100%)',
        }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Progress visualization */}
      <ProgressPath slideIndex={slideIndex} totalSlides={totalSlides} />
    </motion.div>
  );
}
