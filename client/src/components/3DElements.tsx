import { motion } from "framer-motion";

// Rocket 3D - biểu tượng vươn lên
export function Rocket3D({ x, y, size = 120 }: { x: number; y: number; size?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: -30 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        rotateX: 0,
        rotateY: [0, 10, -10, 0],
      }}
      transition={{
        opacity: { duration: 0.8 },
        y: { duration: 0.8 },
        rotateY: { duration: 3, repeat: Infinity, ease: "easeInOut" }
      }}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <defs>
          <linearGradient id="rocketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#FF6B9D', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#C239B3', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        {/* Rocket body */}
        <path d="M50 10 L60 50 L55 80 L45 80 L40 50 Z" fill="url(#rocketGrad)" />
        {/* Rocket nose */}
        <path d="M50 10 L45 20 L55 20 Z" fill="#FFD93D" />
        {/* Window */}
        <circle cx="50" cy="35" r="8" fill="#6BCB77" opacity="0.8" />
        {/* Flames */}
        <motion.path 
          d="M45 80 L40 90 L45 95 Z" 
          fill="#FF6B6B"
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 0.3, repeat: Infinity }}
        />
        <motion.path 
          d="M55 80 L60 90 L55 95 Z" 
          fill="#FFA500"
          animate={{ opacity: [1, 0.8, 1] }}
          transition={{ duration: 0.3, repeat: Infinity }}
        />
      </svg>
    </motion.div>
  );
}

// Star 3D - biểu tượng hy vọng
export function Star3D({ x, y, size = 80 }: { x: number; y: number; size?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotateZ: -180 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        rotateZ: 0,
        rotateY: [0, 360],
      }}
      transition={{
        opacity: { duration: 0.6 },
        scale: { duration: 0.6 },
        rotateZ: { duration: 0.6 },
        rotateY: { duration: 4, repeat: Infinity, ease: "linear" }
      }}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        transformStyle: 'preserve-3d',
      }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <defs>
          <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#FFD93D', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#FFA500', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <path d="M50 10 L61 40 L95 40 L68 60 L79 90 L50 70 L21 90 L32 60 L5 40 L39 40 Z" 
          fill="url(#starGrad)" 
          filter="drop-shadow(0 4px 8px rgba(255, 217, 61, 0.4))"
        />
      </svg>
    </motion.div>
  );
}

// Book 3D - biểu tượng tri thức
export function Book3D({ x, y, size = 100 }: { x: number; y: number; size?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, rotateY: -90 }}
      animate={{ 
        opacity: 1, 
        rotateY: [0, 15, -15, 0],
      }}
      transition={{
        opacity: { duration: 0.8 },
        rotateY: { duration: 4, repeat: Infinity, ease: "easeInOut" }
      }}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        transformStyle: 'preserve-3d',
        perspective: '800px',
      }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <defs>
          <linearGradient id="bookGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#6BCB77', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#4D96A9', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        {/* Book cover */}
        <rect x="20" y="20" width="60" height="60" fill="url(#bookGrad)" rx="3" />
        {/* Pages */}
        <rect x="22" y="22" width="56" height="56" fill="white" opacity="0.9" rx="2" />
        {/* Book spine shadow */}
        <rect x="48" y="20" width="4" height="60" fill="rgba(0,0,0,0.2)" />
        {/* Lines on page */}
        <line x1="30" y1="35" x2="70" y2="35" stroke="#4D96A9" strokeWidth="2" opacity="0.6" />
        <line x1="30" y1="45" x2="70" y2="45" stroke="#4D96A9" strokeWidth="2" opacity="0.6" />
        <line x1="30" y1="55" x2="70" y2="55" stroke="#4D96A9" strokeWidth="2" opacity="0.6" />
      </svg>
    </motion.div>
  );
}

// Trophy 3D - biểu tượng thành công
export function Trophy3D({ x, y, size = 100 }: { x: number; y: number; size?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30, scale: 0.5 }}
      animate={{ 
        opacity: 1, 
        y: [0, -10, 0],
        scale: 1,
        rotateY: [0, 20, -20, 0],
      }}
      transition={{
        opacity: { duration: 0.6 },
        y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        scale: { duration: 0.6 },
        rotateY: { duration: 3, repeat: Infinity, ease: "easeInOut" }
      }}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        transformStyle: 'preserve-3d',
      }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <defs>
          <linearGradient id="trophyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#FFD93D', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#FFA500', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        {/* Trophy cup */}
        <path d="M30 25 L30 40 Q30 55 50 55 Q70 55 70 40 L70 25 Z" fill="url(#trophyGrad)" />
        <rect x="35" y="20" width="30" height="8" fill="url(#trophyGrad)" rx="2" />
        {/* Handles */}
        <path d="M25 30 Q20 30 20 35 Q20 40 25 40" fill="none" stroke="url(#trophyGrad)" strokeWidth="3" />
        <path d="M75 30 Q80 30 80 35 Q80 40 75 40" fill="none" stroke="url(#trophyGrad)" strokeWidth="3" />
        {/* Base */}
        <rect x="40" y="55" width="20" height="8" fill="url(#trophyGrad)" />
        <rect x="35" y="63" width="30" height="10" fill="url(#trophyGrad)" rx="2" />
        {/* Star decoration */}
        <path d="M50 35 L52 40 L57 40 L53 43 L54 48 L50 45 L46 48 L47 43 L43 40 L48 40 Z" fill="#FF6B9D" opacity="0.8" />
      </svg>
    </motion.div>
  );
}

// Heart 3D - biểu tượng tình yêu, động lực
export function Heart3D({ x, y, size = 90 }: { x: number; y: number; size?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: 1, 
        scale: [1, 1.1, 1],
        rotateZ: [0, 5, -5, 0],
      }}
      transition={{
        opacity: { duration: 0.6 },
        scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
        rotateZ: { duration: 2, repeat: Infinity, ease: "easeInOut" }
      }}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        transformStyle: 'preserve-3d',
      }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <defs>
          <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#FF6B9D', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#C239B3', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <path d="M50 85 C20 60, 5 40, 5 28 C5 15, 15 5, 28 5 C35 5, 42 8, 50 20 C58 8, 65 5, 72 5 C85 5, 95 15, 95 28 C95 40, 80 60, 50 85 Z" 
          fill="url(#heartGrad)"
          filter="drop-shadow(0 4px 12px rgba(255, 107, 157, 0.4))"
        />
      </svg>
    </motion.div>
  );
}

// Target 3D - biểu tượng mục tiêu
export function Target3D({ x, y, size = 100 }: { x: number; y: number; size?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotateZ: 180 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        rotateZ: 0,
      }}
      transition={{
        opacity: { duration: 0.6 },
        scale: { duration: 0.8, type: "spring" },
        rotateZ: { duration: 0.8 }
      }}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        transformStyle: 'preserve-3d',
      }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <defs>
          <radialGradient id="targetGrad">
            <stop offset="0%" style={{ stopColor: '#FF6B9D', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#C239B3', stopOpacity: 0.8 }} />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="none" stroke="#4D96A9" strokeWidth="3" opacity="0.6" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="#6BCB77" strokeWidth="3" opacity="0.7" />
        <circle cx="50" cy="50" r="15" fill="url(#targetGrad)" opacity="0.8" />
        <motion.circle 
          cx="50" 
          cy="50" 
          r="5" 
          fill="#FFD93D"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </svg>
    </motion.div>
  );
}
