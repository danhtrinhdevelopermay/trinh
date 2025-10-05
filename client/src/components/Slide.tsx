import { motion, useReducedMotion } from "framer-motion";
import { ReactNode, useMemo } from "react";
import { Star, Heart, BookOpen, Lightbulb, Target, Sparkles } from "lucide-react";

export interface SlideData {
  id: number | string;
  title: string;
  content: ReactNode;
  background?: string;
  textColor?: string;
  type?: 'title' | 'content' | 'quote' | 'image';
  layout?: 'centered' | 'split-left' | 'split-right' | 'full-width' | 'corner-accent';
}

interface SlideProps {
  slide: SlideData;
  isActive: boolean;
  direction: 'prev' | 'next' | 'none';
  transitionType?: 'morph' | 'slide' | 'zoom' | 'flip' | 'rotate' | 'cube' | 'fade';
}

// Diverse transition effects
const transitionVariants = {
  morph: {
    enter: { opacity: 0, scale: 0.95, y: 20 },
    center: { zIndex: 1, opacity: 1, scale: 1, y: 0 },
    exit: { zIndex: 0, opacity: 0, scale: 1.02, y: -10 },
  },
  slide: (direction: 'prev' | 'next' | 'none') => ({
    enter: { opacity: 0, x: direction === 'next' ? 100 : -100, scale: 0.98 },
    center: { zIndex: 1, opacity: 1, x: 0, scale: 1 },
    exit: { zIndex: 0, opacity: 0, x: direction === 'next' ? -100 : 100, scale: 0.98 },
  }),
  zoom: {
    enter: { opacity: 0, scale: 0.5, rotateZ: -5 },
    center: { zIndex: 1, opacity: 1, scale: 1, rotateZ: 0 },
    exit: { zIndex: 0, opacity: 0, scale: 1.5, rotateZ: 5 },
  },
  flip: (direction: 'prev' | 'next' | 'none') => ({
    enter: { opacity: 0, rotateY: direction === 'next' ? 90 : -90, scale: 0.8 },
    center: { zIndex: 1, opacity: 1, rotateY: 0, scale: 1 },
    exit: { zIndex: 0, opacity: 0, rotateY: direction === 'next' ? -90 : 90, scale: 0.8 },
  }),
  rotate: (direction: 'prev' | 'next' | 'none') => ({
    enter: { opacity: 0, rotateZ: direction === 'next' ? 45 : -45, scale: 0.7 },
    center: { zIndex: 1, opacity: 1, rotateZ: 0, scale: 1 },
    exit: { zIndex: 0, opacity: 0, rotateZ: direction === 'next' ? -45 : 45, scale: 0.7 },
  }),
  cube: (direction: 'prev' | 'next' | 'none') => ({
    enter: { opacity: 0, x: direction === 'next' ? 200 : -200, rotateY: direction === 'next' ? 45 : -45, scale: 0.9 },
    center: { zIndex: 1, opacity: 1, x: 0, rotateY: 0, scale: 1 },
    exit: { zIndex: 0, opacity: 0, x: direction === 'next' ? -200 : 200, rotateY: direction === 'next' ? -45 : 45, scale: 0.9 },
  }),
  fade: {
    enter: { opacity: 0 },
    center: { zIndex: 1, opacity: 1 },
    exit: { zIndex: 0, opacity: 0 },
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

export default function Slide({ slide, isActive, direction, transitionType = 'morph' }: SlideProps) {
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
  const layoutType = slide.layout || 'centered';
  
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
  
  // Get the appropriate transition variant
  const getSlideVariants = useMemo(() => {
    if (shouldReduceMotion) return reducedSlideVariants;
    
    const variant = transitionVariants[transitionType];
    if (typeof variant === 'function') {
      return variant(direction);
    }
    return variant;
  }, [shouldReduceMotion, transitionType, direction]);

  // Layout renderers
  const renderCenteredLayout = () => (
    <>
      {slide.type === 'title' ? (
        <div className="text-center space-y-4 sm:space-y-6 md:space-y-8 max-w-sm sm:max-w-2xl md:max-w-4xl relative mx-auto px-8 md:px-12 lg:px-16 py-8 md:py-12 lg:py-16">
          <motion.div
            variants={shouldReduceMotion ? undefined : decorativeIconVariants}
            initial={shouldReduceMotion ? { opacity: 0.4 } : "initial"}
            animate={shouldReduceMotion ? { opacity: 0.4 } : "animate"}
            className="absolute -top-16 left-1/2 transform -translate-x-1/2"
          >
            <DecorativeIcon className="w-16 h-16 text-gray-700/40" />
          </motion.div>
          <motion.h1 
            variants={shouldReduceMotion ? undefined : titleVariants}
            initial={shouldReduceMotion ? { opacity: 0 } : "initial"}
            animate={shouldReduceMotion ? { opacity: 1, transition: { duration: 0.2 } } : "animate"}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold font-serif leading-tight bounce-in text-white"
          >
            {slide.title}
          </motion.h1>
          <motion.div
            variants={shouldReduceMotion ? undefined : contentVariants}
            initial={shouldReduceMotion ? { opacity: 0 } : "initial"}
            animate={shouldReduceMotion ? { opacity: 1, transition: { duration: 0.2, delay: 0.1 } } : "animate"}
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl opacity-90 pulse-glow text-gray-800/90 mx-auto"
          >
            {slide.content}
          </motion.div>
        </div>
      ) : slide.type === 'quote' ? (
        <div className="text-center space-y-4 sm:space-y-6 md:space-y-8 max-w-sm sm:max-w-3xl md:max-w-5xl relative mx-auto px-8 md:px-12 lg:px-16 py-8 md:py-12 lg:py-16">
          <motion.div
            variants={shouldReduceMotion ? undefined : floatingVariants}
            animate={shouldReduceMotion ? undefined : "animate"}
            className="absolute -top-10 -left-10"
          >
            <DecorativeIcon className="w-16 h-16 text-gray-600/20" />
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
            className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-serif italic leading-relaxed relative text-white mx-auto"
          >
            <span className="text-6xl text-gray-600/30 absolute -top-4 -left-4">"</span>
            {slide.content}
            <span className="text-6xl text-gray-600/30 absolute -bottom-8 -right-4">"</span>
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
            className="text-base sm:text-xl md:text-2xl lg:text-3xl font-medium opacity-80 bounce-in text-gray-700/80"
          >
            — {slide.title}
          </motion.h2>
          <motion.div
            variants={shouldReduceMotion ? undefined : floatingVariants}
            animate={shouldReduceMotion ? undefined : "animate"}
            className="absolute -bottom-20 -right-20"
          >
            <Heart className="w-16 h-16 text-gray-600/20" />
          </motion.div>
        </div>
      ) : (
        <div className="text-center space-y-4 sm:space-y-6 md:space-y-8 max-w-sm sm:max-w-3xl md:max-w-5xl lg:max-w-6xl relative mx-auto px-8 md:px-12 lg:px-16 py-8 md:py-12 lg:py-16">
          <motion.div
            variants={shouldReduceMotion ? undefined : decorativeIconVariants}
            initial={shouldReduceMotion ? { opacity: 0.3 } : "initial"}
            animate={shouldReduceMotion ? { opacity: 0.3 } : "animate"}
            className="absolute -top-8 right-4"
          >
            <DecorativeIcon className="w-16 h-16 text-gray-600/30" />
          </motion.div>
          <motion.h2
            variants={shouldReduceMotion ? undefined : titleVariants}
            initial={shouldReduceMotion ? { opacity: 0 } : "initial"}
            animate={shouldReduceMotion ? { opacity: 1, transition: { duration: 0.2 } } : "animate"}
            className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold font-serif mb-4 sm:mb-6 md:mb-8 bounce-in text-white"
          >
            {slide.title}
          </motion.h2>
          <motion.div
            variants={shouldReduceMotion ? undefined : contentVariants}
            initial={shouldReduceMotion ? { opacity: 0 } : "initial"}
            animate={shouldReduceMotion ? { opacity: 1, transition: { duration: 0.2, delay: 0.1 } } : "animate"}
            className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed space-y-2 sm:space-y-3 md:space-y-4 text-gray-800/90 mx-auto"
          >
            {slide.content}
          </motion.div>
          <motion.div
            variants={shouldReduceMotion ? undefined : floatingVariants}
            animate={shouldReduceMotion ? undefined : "animate"}
            className="absolute -bottom-16 -left-16"
          >
            <Sparkles className="w-12 h-12 text-gray-600/25" />
          </motion.div>
        </div>
      )}
    </>
  );

  const renderSplitLayout = (position: 'left' | 'right') => (
    <div className={`flex ${position === 'left' ? 'flex-row' : 'flex-row-reverse'} items-center justify-between w-full h-full gap-8 lg:gap-16 px-8 lg:px-20`}>
      <motion.div
        variants={shouldReduceMotion ? undefined : titleVariants}
        initial={shouldReduceMotion ? { opacity: 0 } : "initial"}
        animate={shouldReduceMotion ? { opacity: 1, transition: { duration: 0.2 } } : "animate"}
        className="flex-1 space-y-6 md:space-y-8"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-serif text-white leading-tight">
          {slide.title}
        </h2>
        <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-800/90 leading-relaxed">
          {slide.content}
        </div>
      </motion.div>
      <motion.div
        variants={shouldReduceMotion ? undefined : decorativeIconVariants}
        initial={shouldReduceMotion ? { opacity: 0.3 } : "initial"}
        animate={shouldReduceMotion ? { opacity: 0.5 } : "animate"}
        className="hidden md:flex items-center justify-center"
      >
        <DecorativeIcon className="w-32 h-32 lg:w-48 lg:h-48 text-gray-600/30" />
      </motion.div>
    </div>
  );

  const renderFullWidthLayout = () => (
    <div className="w-full h-full flex flex-col items-start justify-center px-8 md:px-16 lg:px-24 xl:px-32 space-y-6 md:space-y-10">
      <motion.h2
        variants={shouldReduceMotion ? undefined : titleVariants}
        initial={shouldReduceMotion ? { opacity: 0 } : "initial"}
        animate={shouldReduceMotion ? { opacity: 1, transition: { duration: 0.2 } } : "animate"}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold font-serif text-white leading-tight max-w-6xl"
      >
        {slide.title}
      </motion.h2>
      <motion.div
        variants={shouldReduceMotion ? undefined : contentVariants}
        initial={shouldReduceMotion ? { opacity: 0 } : "initial"}
        animate={shouldReduceMotion ? { opacity: 1, transition: { duration: 0.2, delay: 0.1 } } : "animate"}
        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-800/90 leading-relaxed max-w-5xl"
      >
        {slide.content}
      </motion.div>
      <motion.div
        variants={shouldReduceMotion ? undefined : decorativeIconVariants}
        initial={shouldReduceMotion ? { opacity: 0.2 } : "initial"}
        animate={shouldReduceMotion ? { opacity: 0.3 } : "animate"}
        className="absolute bottom-8 right-8 lg:bottom-16 lg:right-16"
      >
        <DecorativeIcon className="w-24 h-24 lg:w-32 lg:h-32 text-gray-600/20" />
      </motion.div>
    </div>
  );

  const renderCornerAccentLayout = () => (
    <div className="w-full h-full relative">
      <motion.div
        variants={shouldReduceMotion ? undefined : decorativeIconVariants}
        initial={shouldReduceMotion ? { opacity: 0.2 } : "initial"}
        animate={shouldReduceMotion ? { opacity: 0.4 } : "animate"}
        className="absolute top-8 left-8 lg:top-16 lg:left-16"
      >
        <DecorativeIcon className="w-20 h-20 lg:w-32 lg:h-32 text-gray-600/30" />
      </motion.div>
      
      <div className="absolute bottom-8 right-8 md:bottom-16 md:right-16 lg:bottom-24 lg:right-24 max-w-xl lg:max-w-3xl xl:max-w-4xl text-right">
        <motion.h2
          variants={shouldReduceMotion ? undefined : titleVariants}
          initial={shouldReduceMotion ? { opacity: 0 } : "initial"}
          animate={shouldReduceMotion ? { opacity: 1, transition: { duration: 0.2 } } : "animate"}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-serif text-white leading-tight mb-4 md:mb-6 lg:mb-8"
        >
          {slide.title}
        </motion.h2>
        <motion.div
          variants={shouldReduceMotion ? undefined : contentVariants}
          initial={shouldReduceMotion ? { opacity: 0 } : "initial"}
          animate={shouldReduceMotion ? { opacity: 1, transition: { duration: 0.2, delay: 0.1 } } : "animate"}
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-800/90 leading-relaxed"
        >
          {slide.content}
        </motion.div>
      </div>
      
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10">
        <Sparkles className="w-64 h-64 lg:w-96 lg:h-96 text-white" />
      </div>
    </div>
  );

  return (
    <motion.div
      key={slide.id}
      custom={direction}
      variants={getSlideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={shouldReduceMotion ? 
        { duration: 0.1 } : 
        {
          duration: transitionType === 'flip' || transitionType === 'cube' ? 0.8 : 0.6,
          ease: [0.4, 0, 0.2, 1],
          opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
          scale: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
          y: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
          x: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
          rotateY: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
          rotateZ: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
        }
      }
      style={{ perspective: '1000px' }}
      className={`absolute inset-0 w-full h-full min-h-screen min-h-dvh flex items-center justify-center overflow-hidden ${backgroundStyle}`}
      data-testid={`slide-${slide.id}`}
    >
      {layoutType === 'centered' && renderCenteredLayout()}
      {layoutType === 'split-left' && renderSplitLayout('left')}
      {layoutType === 'split-right' && renderSplitLayout('right')}
      {layoutType === 'full-width' && renderFullWidthLayout()}
      {layoutType === 'corner-accent' && renderCornerAccentLayout()}
      
      {/* Enhanced decorative elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.08 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/10 pointer-events-none"
      />
      
      {/* Floating sparkles - only show without reduced motion */}
      {!shouldReduceMotion && layoutType === 'centered' && (
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
            <Sparkles className="w-6 h-6 text-gray-400/40" />
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
            <Star className="w-4 h-4 text-gray-400/30" />
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
            <Heart className="w-5 h-5 text-gray-600/10" />
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
