import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface CSS3DVietnamVillageProps {
  slideIndex: number;
  totalSlides: number;
}

export default function CSS3DVietnamVillage({ slideIndex, totalSlides }: CSS3DVietnamVillageProps) {
  const cameraProgress = (slideIndex / Math.max(totalSlides - 1, 1)) * 100;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        background: 'linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 40%, #C8E6C9 100%)',
        overflow: 'hidden',
        perspective: '1200px',
        perspectiveOrigin: '50% 50%',
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
        }}
        animate={{
          rotateY: -cameraProgress * 0.5,
          translateZ: -cameraProgress * 3,
        }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      >
        <Sky />
        <Sun slideIndex={slideIndex} />
        <Clouds />
        <Ground />
        
        <TraditionalHouse position={{ x: -150, z: -200 }} rotation={20} />
        <TraditionalHouse position={{ x: 100, z: -250 }} rotation={-30} />
        <TraditionalHouse position={{ x: -250, z: -350 }} rotation={15} />
        <TraditionalHouse position={{ x: 200, z: -400 }} rotation={-20} />
        <TraditionalHouse position={{ x: 0, z: -500 }} rotation={0} />
        
        <BambooTree position={{ x: -300, z: -100 }} />
        <BambooTree position={{ x: -350, z: -300 }} />
        <BambooTree position={{ x: 250, z: -200 }} />
        <BambooTree position={{ x: 300, z: -380 }} />
        <BambooTree position={{ x: -100, z: 50 }} />
        
        <PalmTree position={{ x: -200, z: 80 }} />
        <PalmTree position={{ x: 180, z: 30 }} />
        <PalmTree position={{ x: -400, z: -400 }} />
        <PalmTree position={{ x: 380, z: -550 }} />
        
        <WaterBuffalo position={{ x: 60, z: 150 }} />
        <WaterBuffalo position={{ x: -120, z: 100 }} />
        
        <RiceField position={{ x: -300, z: 250 }} width={200} height={200} />
        <RiceField position={{ x: 250, z: 200 }} width={160} height={240} />
        <RiceField position={{ x: 0, z: -650 }} width={300} height={160} />
        
        <AnimatedPerson position={{ x: -50, z: -80 }} delay={0} />
        <AnimatedPerson position={{ x: 120, z: -300 }} delay={1} />
        <AnimatedPerson position={{ x: -180, z: -420 }} delay={2} />
      </motion.div>
    </div>
  );
}

function Sky() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(ellipse at top, #87CEEB 0%, #B0E0E6 100%)',
        transform: 'translateZ(-1000px)',
      }}
    />
  );
}

function Sun({ slideIndex }: { slideIndex: number }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        top: '15%',
        right: '20%',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, #FFD700 0%, #FFA500 100%)',
        boxShadow: '0 0 60px #FFD700, 0 0 120px #FFA500',
        transform: 'translateZ(-800px)',
      }}
      animate={{
        scale: [1, 1.1, 1],
        rotate: slideIndex * 45,
      }}
      transition={{
        scale: { duration: 3, repeat: Infinity },
        rotate: { duration: 1, ease: 'easeInOut' },
      }}
    />
  );
}

function Clouds() {
  return (
    <>
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            top: `${15 + i * 8}%`,
            left: `${10 + i * 15}%`,
            width: `${120 + i * 20}px`,
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.7)',
            transform: `translateZ(-${700 + i * 50}px)`,
            filter: 'blur(2px)',
          }}
          animate={{
            x: [0, 30, 0],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </>
  );
}

function Ground() {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: '50%',
        width: '2000px',
        height: '2000px',
        marginLeft: '-1000px',
        background: 'linear-gradient(to bottom, #A1887F 0%, #8D6E63 100%)',
        transform: 'rotateX(90deg) translateZ(-100px)',
        transformOrigin: 'center center',
        boxShadow: 'inset 0 0 100px rgba(0,0,0,0.3)',
      }}
    />
  );
}

function TraditionalHouse({ position, rotation }: { position: { x: number; z: number }; rotation: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        bottom: '30%',
        transform: `translateX(${position.x}px) translateZ(${position.z}px) rotateY(${rotation}deg)`,
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        style={{
          width: '120px',
          height: '80px',
          background: '#D4A574',
          position: 'relative',
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            left: '-20px',
            width: '0',
            height: '0',
            borderLeft: '80px solid transparent',
            borderRight: '80px solid transparent',
            borderBottom: '60px solid #8B4513',
          }}
        />
        
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            left: '50%',
            marginLeft: '-20px',
            width: '40px',
            height: '45px',
            background: '#654321',
          }}
        />
        
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '15px',
            width: '25px',
            height: '30px',
            background: 'rgba(135, 206, 235, 0.6)',
            border: '2px solid #654321',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '20px',
            right: '15px',
            width: '25px',
            height: '30px',
            background: 'rgba(135, 206, 235, 0.6)',
            border: '2px solid #654321',
          }}
        />
      </div>
    </div>
  );
}

function BambooTree({ position }: { position: { x: number; z: number } }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: '50%',
        bottom: '30%',
        transform: `translateX(${position.x}px) translateZ(${position.z}px)`,
        transformStyle: 'preserve-3d',
      }}
      animate={{
        rotateZ: [-2, 2, -2],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <div
        style={{
          width: '8px',
          height: '180px',
          background: 'linear-gradient(to bottom, #7CB342 0%, #558B2F 100%)',
          borderRadius: '4px',
          position: 'relative',
        }}
      >
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: `${20 + i * 30}px`,
              left: i % 2 === 0 ? '-20px' : '8px',
              width: '30px',
              height: '40px',
              background: '#558B2F',
              borderRadius: '50% 0 50% 0',
              transform: `rotateZ(${i % 2 === 0 ? -30 : 30}deg)`,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function PalmTree({ position }: { position: { x: number; z: number } }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: '50%',
        bottom: '30%',
        transform: `translateX(${position.x}px) translateZ(${position.z}px)`,
        transformStyle: 'preserve-3d',
      }}
      animate={{
        rotateZ: [-3, 3, -3],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <div
        style={{
          width: '12px',
          height: '200px',
          background: 'linear-gradient(to bottom, #8B6F47 0%, #654321 100%)',
          borderRadius: '6px',
          position: 'relative',
        }}
      >
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * 360;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: '-10px',
                left: '6px',
                width: '60px',
                height: '8px',
                background: '#2E7D32',
                borderRadius: '4px',
                transformOrigin: 'left center',
                transform: `rotateZ(${angle}deg) rotateX(-30deg)`,
              }}
            />
          );
        })}
      </div>
    </motion.div>
  );
}

function WaterBuffalo({ position }: { position: { x: number; z: number } }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: '50%',
        bottom: '30%',
        transform: `translateX(${position.x}px) translateZ(${position.z}px)`,
      }}
      animate={{
        y: [0, -3, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <div
        style={{
          width: '50px',
          height: '35px',
          background: '#4A4A4A',
          borderRadius: '8px',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-8px',
            left: '10px',
            width: '30px',
            height: '25px',
            background: '#4A4A4A',
            borderRadius: '6px',
          }}
        />
        
        <div
          style={{
            position: 'absolute',
            top: '-15px',
            left: '8px',
            width: '3px',
            height: '12px',
            background: '#3A3A3A',
            borderRadius: '2px',
            transform: 'rotateZ(-20deg)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '-15px',
            left: '20px',
            width: '3px',
            height: '12px',
            background: '#3A3A3A',
            borderRadius: '2px',
            transform: 'rotateZ(20deg)',
          }}
        />
        
        {[0, 15, 25, 40].map((left, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              bottom: '-12px',
              left: `${left}px`,
              width: '5px',
              height: '12px',
              background: '#3A3A3A',
              borderRadius: '2px',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function RiceField({ position, width, height }: { position: { x: number; z: number }; width: number; height: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        bottom: '30%',
        transform: `translateX(${position.x}px) translateZ(${position.z}px) rotateX(90deg)`,
        width: `${width}px`,
        height: `${height}px`,
        background: '#9CCC65',
        borderRadius: '8px',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)',
      }}
    >
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: `${Math.random() * 90}%`,
            top: `${Math.random() * 90}%`,
            width: '3px',
            height: '15px',
            background: '#7CB342',
            borderRadius: '2px',
            transform: 'rotateX(-90deg)',
          }}
          animate={{
            rotateZ: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
}

function AnimatedPerson({ position, delay }: { position: { x: number; z: number }; delay: number }) {
  const pathRadius = 100;
  
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: '50%',
        bottom: '30%',
        transformStyle: 'preserve-3d',
      }}
      animate={{
        x: [
          position.x,
          position.x + pathRadius,
          position.x,
          position.x - pathRadius,
          position.x,
        ],
        z: [
          position.z,
          position.z - pathRadius,
          position.z,
          position.z + pathRadius,
          position.z,
        ],
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: 'linear',
        delay: delay * 3,
      }}
    >
      <div
        style={{
          width: '12px',
          height: '40px',
          background: '#FF6B9D',
          borderRadius: '6px',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-15px',
            left: '-3px',
            width: '18px',
            height: '18px',
            background: '#FFE0B2',
            borderRadius: '50%',
          }}
        />
        
        <div
          style={{
            position: 'absolute',
            top: '-20px',
            left: '3px',
            width: '12px',
            height: '8px',
            background: '#8B4513',
            borderRadius: '50% 50% 0 0',
          }}
        />
        
        <motion.div
          style={{
            position: 'absolute',
            top: '12px',
            left: '-8px',
            width: '5px',
            height: '20px',
            background: '#FFE0B2',
            borderRadius: '3px',
          }}
          animate={{
            rotateZ: [-20, 20, -20],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          style={{
            position: 'absolute',
            top: '12px',
            right: '-8px',
            width: '5px',
            height: '20px',
            background: '#FFE0B2',
            borderRadius: '3px',
          }}
          animate={{
            rotateZ: [20, -20, 20],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        <motion.div
          style={{
            position: 'absolute',
            bottom: '-20px',
            left: '-3px',
            width: '5px',
            height: '20px',
            background: '#FFE0B2',
            borderRadius: '3px',
          }}
          animate={{
            rotateZ: [-15, 15, -15],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          style={{
            position: 'absolute',
            bottom: '-20px',
            right: '-3px',
            width: '5px',
            height: '20px',
            background: '#FFE0B2',
            borderRadius: '3px',
          }}
          animate={{
            rotateZ: [15, -15, 15],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    </motion.div>
  );
}
