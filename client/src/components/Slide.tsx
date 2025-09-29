import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";
import { Star, Heart, BookOpen, Lightbulb, Target, Sparkles } from "lucide-react";

export interface SlideData {
  id: number;
  title: string;
  content: ReactNode;
  background?: string;
  textColor?: string;
  type?: 'title' | 'content' | 'quote' | 'image';
}

interface SlideProps {
  slide: SlideData;
  isActive: boolean;
  direction: 'prev' | 'next' | 'none';
}

// Nhiều loại hiệu ứng slide transitions khác nhau
const slideTransitions = {
  slide: {
    enter: (direction: string) => ({
      x: direction === 'next' ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction === 'next' ? 45 : -45,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (direction: string) => ({
      zIndex: 0,
      x: direction === 'next' ? -1000 : 1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction === 'next' ? -45 : 45,
    }),
  },

  fade: {
    enter: { opacity: 0, scale: 0.9 },
    center: { zIndex: 1, opacity: 1, scale: 1 },
    exit: { zIndex: 0, opacity: 0, scale: 1.1 },
  },

  zoom: {
    enter: (direction: string) => ({ scale: 0.3, opacity: 0, rotateZ: direction === 'next' ? 180 : -180 }),
    center: { zIndex: 1, scale: 1, opacity: 1, rotateZ: 0 },
    exit: (direction: string) => ({ zIndex: 0, scale: 3, opacity: 0, rotateZ: direction === 'next' ? -180 : 180 }),
  },

  flip: {
    enter: (direction: string) => ({
      rotateY: direction === 'next' ? 90 : -90,
      opacity: 0,
      scale: 0.8,
    }),
    center: { zIndex: 1, rotateY: 0, opacity: 1, scale: 1 },
    exit: (direction: string) => ({
      zIndex: 0,
      rotateY: direction === 'next' ? -90 : 90,
      opacity: 0,
      scale: 0.8,
    }),
  },

  cube: {
    enter: (direction: string) => ({
      x: direction === 'next' ? 1000 : -1000,
      rotateY: direction === 'next' ? 90 : -90,
      opacity: 0,
    }),
    center: { zIndex: 1, x: 0, rotateY: 0, opacity: 1 },
    exit: (direction: string) => ({
      zIndex: 0,
      x: direction === 'next' ? -1000 : 1000,
      rotateY: direction === 'next' ? -90 : 90,
      opacity: 0,
    }),
  },

  bounce: {
    enter: (direction: string) => ({
      y: direction === 'next' ? 200 : -200,
      opacity: 0,
      scale: 0.5,
      rotateX: direction === 'next' ? 45 : -45,
    }),
    center: { zIndex: 1, y: 0, opacity: 1, scale: 1, rotateX: 0 },
    exit: (direction: string) => ({
      zIndex: 0,
      y: direction === 'next' ? -200 : 200,
      opacity: 0,
      scale: 0.5,
      rotateX: direction === 'next' ? -45 : 45,
    }),
  },

  spiral: {
    enter: (direction: string) => ({
      scale: 0.2,
      rotateZ: direction === 'next' ? 360 : -360,
      x: direction === 'next' ? 500 : -500,
      y: 300,
      opacity: 0,
    }),
    center: { zIndex: 1, scale: 1, rotateZ: 0, x: 0, y: 0, opacity: 1 },
    exit: (direction: string) => ({
      zIndex: 0,
      scale: 0.2,
      rotateZ: direction === 'next' ? -360 : 360,
      x: direction === 'next' ? -500 : 500,
      y: -300,
      opacity: 0,
    }),
  },
};

// Danh sách các loại transition để random
const transitionTypes = ['slide', 'fade', 'zoom', 'flip', 'cube', 'bounce', 'spiral'];

// Hàm chọn transition ngẫu nhiên
const getRandomSlideTransition = () => {
  return transitionTypes[Math.floor(Math.random() * transitionTypes.length)];
};

// Legacy slideVariants để backwards compatibility
const slideVariants = slideTransitions.slide;

const decorativeIconVariants = {
  initial: { scale: 0, rotate: -180, opacity: 0 },
  animate: { 
    scale: 1, 
    rotate: 0, 
    opacity: 0.6,
    transition: {
      delay: 0.8,
      duration: 0.8,
      type: "spring",
      stiffness: 200
    }
  }
};

const floatingVariants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export default function Slide({ slide, isActive, direction }: SlideProps) {
  if (!isActive) return null;

  const shouldReduceMotion = useReducedMotion();
  const backgroundStyle = slide.background || 'educational-gradient-1';
  const textColorStyle = slide.textColor || 'text-gray-800';
  
  // Map slide type to decorative icon
  const getDecorativeIcon = (type: string, slideId: number) => {
    const icons = {
      title: [Star, Sparkles],
      content: [BookOpen, Lightbulb],
      quote: [Heart, Target]
    };
    const iconSet = icons[type as keyof typeof icons] || icons.content;
    return iconSet[slideId % iconSet.length];
  };
  
  const DecorativeIcon = getDecorativeIcon(slide.type || 'content', slide.id);
  
  // Reduced motion variants
  const reducedSlideVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 }
  };
  
  // Chọn transition ngẫu nhiên cho mỗi slide
  const currentTransition = getRandomSlideTransition();
  const getSlideVariants = () => shouldReduceMotion ? reducedSlideVariants : slideTransitions[currentTransition as keyof typeof slideTransitions];

  return (
    <motion.div
      key={slide.id}
      custom={direction}
      variants={getSlideVariants()}
      initial="enter"
      animate="center"
      exit="exit"
      transition={shouldReduceMotion ? 
        { duration: 0.1 } : 
        {
          x: { type: "spring", stiffness: 200, damping: 25 },
          y: { type: "spring", stiffness: 200, damping: 25 },
          opacity: { duration: 0.4 },
          scale: { duration: 0.4 },
          rotateY: { type: "spring", stiffness: 100, damping: 15 },
          rotateX: { type: "spring", stiffness: 100, damping: 15 },
          rotateZ: { type: "spring", stiffness: 150, damping: 20 },
        }
      }
      className={`absolute inset-0 w-full h-full min-h-screen min-h-dvh flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-16 ${backgroundStyle} ${textColorStyle} slide-pattern slide-decoration cute-border overflow-hidden`}
      data-testid={`slide-${slide.id}`}
    >
      {slide.type === 'title' ? (
        <div className="text-center space-y-4 sm:space-y-6 md:space-y-8 max-w-sm sm:max-w-2xl md:max-w-4xl relative w-full">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0, rotate: -180 }}
            animate={shouldReduceMotion ? { opacity: 0.4 } : { scale: 1, rotate: 0 }}
            transition={shouldReduceMotion ? { duration: 0.2 } : { delay: 0.1, duration: 0.8, type: "spring" }}
            className="absolute -top-16 left-1/2 transform -translate-x-1/2"
          >
            <DecorativeIcon className="w-16 h-16 text-white/40" />
          </motion.div>
          <motion.h1 
            initial={shouldReduceMotion ? { opacity: 0 } : { y: 50, opacity: 0, scale: 0.8 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { y: 0, opacity: 1, scale: 1 }}
            transition={shouldReduceMotion ? { duration: 0.2 } : { delay: 0.2, duration: 0.8, type: "spring", stiffness: 120 }}
            className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold font-serif leading-tight bounce-in"
          >
            {slide.title}
          </motion.h1>
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { y: 30, opacity: 0 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
            transition={shouldReduceMotion ? { duration: 0.2, delay: 0.1 } : { delay: 0.4, duration: 0.8, type: "spring" }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl opacity-90 pulse-glow"
          >
            {slide.content}
          </motion.div>
        </div>
      ) : slide.type === 'quote' ? (
        <div className="text-center space-y-4 sm:space-y-6 md:space-y-8 max-w-sm sm:max-w-2xl md:max-w-4xl relative w-full">
          <motion.div
            variants={shouldReduceMotion ? undefined : floatingVariants}
            animate={shouldReduceMotion ? undefined : "animate"}
            className="absolute -top-20 -left-20"
          >
            <DecorativeIcon className="w-24 h-24 text-white/20" />
          </motion.div>
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0.8, opacity: 0, rotateX: 45 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { scale: 1, opacity: 1, rotateX: 0 }}
            transition={shouldReduceMotion ? { duration: 0.2 } : { delay: 0.2, duration: 0.8, type: "spring" }}
            className="text-lg sm:text-2xl md:text-4xl lg:text-5xl font-serif italic leading-relaxed relative"
          >
            <span className="text-6xl text-white/30 absolute -top-4 -left-4">"</span>
            {slide.content}
            <span className="text-6xl text-white/30 absolute -bottom-8 -right-4">"</span>
          </motion.div>
          <motion.h2
            initial={shouldReduceMotion ? { opacity: 0 } : { y: 30, opacity: 0 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
            transition={shouldReduceMotion ? { duration: 0.2, delay: 0.1 } : { delay: 0.4, duration: 0.8, type: "spring" }}
            className="text-base sm:text-xl md:text-2xl font-medium opacity-80 bounce-in"
          >
            — {slide.title}
          </motion.h2>
          <motion.div
            variants={shouldReduceMotion ? undefined : floatingVariants}
            animate={shouldReduceMotion ? undefined : "animate"}
            className="absolute -bottom-20 -right-20"
          >
            <Heart className="w-16 h-16 text-white/20" />
          </motion.div>
        </div>
      ) : (
        <div className="text-center space-y-4 sm:space-y-6 md:space-y-8 max-w-sm sm:max-w-3xl md:max-w-5xl relative w-full">
          <motion.div
            variants={shouldReduceMotion ? undefined : decorativeIconVariants}
            initial={shouldReduceMotion ? { opacity: 0.3 } : "initial"}
            animate={shouldReduceMotion ? { opacity: 0.3 } : "animate"}
            transition={shouldReduceMotion ? { duration: 0 } : undefined}
            className="absolute -top-16 right-0"
          >
            <DecorativeIcon className="w-20 h-20 text-white/30" />
          </motion.div>
          <motion.h2
            initial={shouldReduceMotion ? { opacity: 0 } : { y: 50, opacity: 0, scale: 0.8 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { y: 0, opacity: 1, scale: 1 }}
            transition={shouldReduceMotion ? { duration: 0.2 } : { delay: 0.2, duration: 0.8, type: "spring", stiffness: 120 }}
            className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-bold font-serif mb-4 sm:mb-6 md:mb-8 bounce-in"
          >
            {slide.title}
          </motion.h2>
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { y: 30, opacity: 0 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
            transition={shouldReduceMotion ? { duration: 0.2, delay: 0.1 } : { delay: 0.4, duration: 0.8, type: "spring" }}
            className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-relaxed space-y-2 sm:space-y-3 md:space-y-4"
          >
            {slide.content}
          </motion.div>
          <motion.div
            variants={shouldReduceMotion ? undefined : floatingVariants}
            animate={shouldReduceMotion ? undefined : "animate"}
            className="absolute -bottom-16 -left-16"
          >
            <Sparkles className="w-12 h-12 text-white/25" />
          </motion.div>
        </div>
      )}
      
      {/* Enhanced decorative elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent pointer-events-none"
      />
      
      {/* Floating sparkles - only show without reduced motion */}
      {!shouldReduceMotion && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: "reverse" }}
            className="absolute top-20 left-20 pointer-events-none"
          >
            <Sparkles className="w-6 h-6 text-white/20" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 1, repeat: Infinity, repeatType: "reverse" }}
            className="absolute top-32 right-32 pointer-events-none"
          >
            <Star className="w-4 h-4 text-white/15" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2, duration: 1, repeat: Infinity, repeatType: "reverse" }}
            className="absolute bottom-40 left-40 pointer-events-none"
          >
            <Heart className="w-5 h-5 text-white/10" />
          </motion.div>
        </>
      )}
    </motion.div>
  );
}