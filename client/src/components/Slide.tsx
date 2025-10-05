import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";
import { Star, Heart, BookOpen, Lightbulb, Target, Sparkles } from "lucide-react";

export interface SlideData {
  id: number | string;
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

// Hiệu ứng Morph hiện đại với staggered entrance
const slideTransition = {
  enter: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  center: {
    zIndex: 1,
    opacity: 1,
    scale: 1,
    y: 0,
  },
  exit: {
    zIndex: 0,
    opacity: 0,
    scale: 1.02,
    y: -10,
  },
};

// Hiệu ứng icons trang trí với spring bounce
const decorativeIconVariants = {
  initial: { scale: 0, rotate: -180, opacity: 0 },
  animate: { 
    scale: 1, 
    rotate: 0, 
    opacity: 0.6,
    transition: {
      delay: 0.5,
      duration: 0.8,
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  }
};

// Hiệu ứng xuất hiện cho tiêu đề với stagger
const titleVariants = {
  initial: { y: 50, opacity: 0, scale: 0.9 },
  animate: { 
    y: 0, 
    opacity: 1, 
    scale: 1,
    transition: {
      delay: 0.15,
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

// Hiệu ứng xuất hiện cho nội dung với stagger
const contentVariants = {
  initial: { y: 30, opacity: 0 },
  animate: { 
    y: 0, 
    opacity: 1,
    transition: {
      delay: 0.35,
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

// Hiệu ứng sparkles nổi
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

  let shouldReduceMotion = false;
  try {
    shouldReduceMotion = useReducedMotion() || false;
  } catch (e) {
    console.warn('useReducedMotion hook error:', e);
    shouldReduceMotion = false;
  }
  
  const backgroundStyle = slide.background || 'educational-gradient-1';
  const textColorStyle = slide.textColor || 'text-gray-800';
  
  // Map slide type to decorative icon
  const getDecorativeIcon = (type: string, slideId: number | string) => {
    try {
      const icons = {
        title: [Star, Sparkles],
        content: [BookOpen, Lightbulb],
        quote: [Heart, Target]
      };
      const iconSet = icons[type as keyof typeof icons] || icons.content;
      const numericId = typeof slideId === 'string' ? parseInt(slideId, 10) || 0 : slideId;
      return iconSet[numericId % iconSet.length];
    } catch (e) {
      console.error('Error getting decorative icon:', e);
      return Star;
    }
  };
  
  const DecorativeIcon = getDecorativeIcon(slide.type || 'content', slide.id);
  
  // Reduced motion variants
  const reducedSlideVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 }
  };
  
  const getSlideVariants = () => shouldReduceMotion ? reducedSlideVariants : slideTransition;

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
          duration: 0.6,
          ease: [0.4, 0, 0.2, 1],
          opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
          scale: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
          y: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
        }
      }
      className={`absolute inset-0 w-full h-full min-h-screen min-h-dvh flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-16 overflow-hidden`}
      data-testid={`slide-${slide.id}`}
    >
      {slide.type === 'title' ? (
        <div className="text-center space-y-4 sm:space-y-6 md:space-y-8 max-w-sm sm:max-w-2xl md:max-w-4xl relative w-full bg-black/40 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl">
          <motion.div
            variants={shouldReduceMotion ? undefined : decorativeIconVariants}
            initial={shouldReduceMotion ? { opacity: 0.4 } : "initial"}
            animate={shouldReduceMotion ? { opacity: 0.4 } : "animate"}
            className="absolute -top-16 left-1/2 transform -translate-x-1/2"
          >
            <DecorativeIcon className="w-16 h-16 text-white/40" />
          </motion.div>
          <motion.h1 
            variants={shouldReduceMotion ? undefined : titleVariants}
            initial={shouldReduceMotion ? { opacity: 0 } : "initial"}
            animate={shouldReduceMotion ? { opacity: 1, transition: { duration: 0.2 } } : "animate"}
            className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold font-serif leading-tight bounce-in text-white"
          >
            {slide.title}
          </motion.h1>
          <motion.div
            variants={shouldReduceMotion ? undefined : contentVariants}
            initial={shouldReduceMotion ? { opacity: 0 } : "initial"}
            animate={shouldReduceMotion ? { opacity: 1, transition: { duration: 0.2, delay: 0.1 } } : "animate"}
            className="text-base sm:text-lg md:text-xl lg:text-2xl opacity-90 pulse-glow text-white/90"
          >
            {slide.content}
          </motion.div>
        </div>
      ) : slide.type === 'quote' ? (
        <div className="text-center space-y-4 sm:space-y-6 md:space-y-8 max-w-sm sm:max-w-2xl md:max-w-4xl relative w-full bg-black/40 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl">
          <motion.div
            variants={shouldReduceMotion ? undefined : floatingVariants}
            animate={shouldReduceMotion ? undefined : "animate"}
            className="absolute -top-10 -left-10"
          >
            <DecorativeIcon className="w-16 h-16 text-white/20" />
          </motion.div>
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0.85, opacity: 0, y: 30 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { 
              scale: 1, 
              opacity: 1, 
              y: 0,
              transition: {
                delay: 0.2,
                duration: 0.7,
                ease: [0.25, 0.46, 0.45, 0.94]
              }
            }}
            className="text-lg sm:text-2xl md:text-4xl lg:text-5xl font-serif italic leading-relaxed relative text-white"
          >
            <span className="text-6xl text-white/30 absolute -top-4 -left-4">"</span>
            {slide.content}
            <span className="text-6xl text-white/30 absolute -bottom-8 -right-4">"</span>
          </motion.div>
          <motion.h2
            initial={shouldReduceMotion ? { opacity: 0 } : { y: 30, opacity: 0 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { 
              y: 0, 
              opacity: 1,
              transition: {
                delay: 0.4,
                duration: 0.7,
                ease: [0.25, 0.46, 0.45, 0.94]
              }
            }}
            className="text-base sm:text-xl md:text-2xl font-medium opacity-80 bounce-in text-white/80"
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
        <div className="text-center space-y-4 sm:space-y-6 md:space-y-8 max-w-sm sm:max-w-3xl md:max-w-5xl relative w-full bg-black/40 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl">
          <motion.div
            variants={shouldReduceMotion ? undefined : decorativeIconVariants}
            initial={shouldReduceMotion ? { opacity: 0.3 } : "initial"}
            animate={shouldReduceMotion ? { opacity: 0.3 } : "animate"}
            className="absolute -top-8 right-4"
          >
            <DecorativeIcon className="w-16 h-16 text-white/30" />
          </motion.div>
          <motion.h2
            variants={shouldReduceMotion ? undefined : titleVariants}
            initial={shouldReduceMotion ? { opacity: 0 } : "initial"}
            animate={shouldReduceMotion ? { opacity: 1, transition: { duration: 0.2 } } : "animate"}
            className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-bold font-serif mb-4 sm:mb-6 md:mb-8 bounce-in text-white"
          >
            {slide.title}
          </motion.h2>
          <motion.div
            variants={shouldReduceMotion ? undefined : contentVariants}
            initial={shouldReduceMotion ? { opacity: 0 } : "initial"}
            animate={shouldReduceMotion ? { opacity: 1, transition: { duration: 0.2, delay: 0.1 } } : "animate"}
            className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-relaxed space-y-2 sm:space-y-3 md:space-y-4 text-white/90"
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
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ 
              delay: 0.8, 
              duration: 0.8,
              type: "spring",
              stiffness: 300,
              repeat: Infinity, 
              repeatType: "reverse",
              repeatDelay: 2
            }}
            className="absolute top-20 left-20 pointer-events-none"
          >
            <Sparkles className="w-6 h-6 text-white/20" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0, rotate: 180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ 
              delay: 1.0, 
              duration: 0.8,
              type: "spring",
              stiffness: 350,
              repeat: Infinity, 
              repeatType: "reverse",
              repeatDelay: 2.5
            }}
            className="absolute top-32 right-32 pointer-events-none"
          >
            <Star className="w-4 h-4 text-white/15" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ 
              delay: 1.2, 
              duration: 0.8,
              type: "spring",
              stiffness: 320,
              repeat: Infinity, 
              repeatType: "reverse",
              repeatDelay: 3
            }}
            className="absolute bottom-40 left-40 pointer-events-none"
          >
            <Heart className="w-5 h-5 text-white/10" />
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
