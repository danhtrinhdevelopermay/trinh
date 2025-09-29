import { motion, AnimatePresence, Variants } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
  transitionType?: 'slide' | 'fade' | 'scale' | 'rotate' | 'flip' | 'bounce' | 'elastic';
}

// Định nghĩa các loại hiệu ứng chuyển trang khác nhau
const transitionVariants: Record<string, Variants> = {
  slide: {
    initial: { x: 100, opacity: 0 },
    in: { x: 0, opacity: 1 },
    out: { x: -100, opacity: 0 }
  },
  
  fade: {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 }
  },
  
  scale: {
    initial: { scale: 0.8, opacity: 0 },
    in: { scale: 1, opacity: 1 },
    out: { scale: 1.1, opacity: 0 }
  },
  
  rotate: {
    initial: { rotate: -180, opacity: 0, scale: 0.5 },
    in: { rotate: 0, opacity: 1, scale: 1 },
    out: { rotate: 180, opacity: 0, scale: 0.5 }
  },
  
  flip: {
    initial: { rotateY: 90, opacity: 0 },
    in: { rotateY: 0, opacity: 1 },
    out: { rotateY: -90, opacity: 0 }
  },
  
  bounce: {
    initial: { y: -100, opacity: 0, scale: 0.3 },
    in: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    out: { y: 100, opacity: 0, scale: 0.3 }
  },
  
  elastic: {
    initial: { x: -200, opacity: 0, scale: 0.5 },
    in: { 
      x: 0, 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    },
    out: { x: 200, opacity: 0, scale: 0.5 }
  }
};

// Danh sách các hiệu ứng để random selection
const transitionTypes = ['slide', 'fade', 'scale', 'rotate', 'flip', 'bounce', 'elastic'];

// Hàm để chọn hiệu ứng ngẫu nhiên
export const getRandomTransition = (): string => {
  return transitionTypes[Math.floor(Math.random() * transitionTypes.length)];
};

export default function PageTransition({ 
  children, 
  className = "", 
  transitionType = 'slide' 
}: PageTransitionProps) {
  const variants = transitionVariants[transitionType] || transitionVariants.slide;
  
  return (
    <motion.div
      className={`w-full h-full ${className}`}
      initial="initial"
      animate="in"
      exit="out"
      variants={variants}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

// Component wrapper cho AnimatePresence
interface AnimatedRouteProps {
  children: ReactNode;
  routeKey: string;
  transitionType?: 'slide' | 'fade' | 'scale' | 'rotate' | 'flip' | 'bounce' | 'elastic';
}

export function AnimatedRoute({ children, routeKey, transitionType }: AnimatedRouteProps) {
  return (
    <AnimatePresence mode="wait">
      <PageTransition key={routeKey} transitionType={transitionType}>
        {children}
      </PageTransition>
    </AnimatePresence>
  );
}