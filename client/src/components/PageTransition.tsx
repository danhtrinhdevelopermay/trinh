import { motion, AnimatePresence, Variants, useReducedMotion } from "framer-motion";
import { ReactNode, useEffect } from "react";
import { useAudio } from "@/contexts/AudioContext";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

// Hiệu ứng Morph giống PowerPoint - mượt mà và chuyên nghiệp
const morphVariants: Variants = {
  initial: { 
    opacity: 0.95, 
    scale: 0.98 
  },
  in: { 
    opacity: 1, 
    scale: 1 
  },
  out: { 
    opacity: 0.95, 
    scale: 1.02 
  }
};

export default function PageTransition({ 
  children, 
  className = "" 
}: PageTransitionProps) {
  const shouldReduceMotion = useReducedMotion();
  
  // Variants cho reduced motion - chỉ dùng opacity
  const reducedMotionVariants: Variants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 }
  };
  
  return (
    <motion.div
      className={`fixed inset-0 w-full h-full bg-background ${className}`}
      initial="initial"
      animate="in"
      exit="out"
      variants={shouldReduceMotion ? reducedMotionVariants : morphVariants}
      transition={shouldReduceMotion ? 
        { duration: 0.2 } :
        { 
          duration: 0.6, 
          ease: [0.4, 0, 0.2, 1],
          opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
          scale: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
        }
      }
    >
      {children}
    </motion.div>
  );
}

// Component wrapper cho AnimatePresence
interface AnimatedRouteProps {
  children: ReactNode;
  routeKey: string;
}

export function AnimatedRoute({ children, routeKey }: AnimatedRouteProps) {
  const { playPageNavigationSound } = useAudio();

  useEffect(() => {
    playPageNavigationSound();
  }, [routeKey, playPageNavigationSound]);

  return (
    <AnimatePresence mode="wait">
      <PageTransition key={routeKey}>
        {children}
      </PageTransition>
    </AnimatePresence>
  );
}