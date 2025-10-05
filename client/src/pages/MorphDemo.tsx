import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SlideCanvas from "@/components/SlideCanvas";
import { demoMorphSlides } from "@/data/demoMorphSlides";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Định nghĩa các kiểu transition effects
const transitionVariants = {
  // 1. Fade: Mờ dần đơn giản
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.6, ease: [0.32, 0.72, 0, 1] }
  },
  
  // 2. Slide: Trượt ngang cơ bản
  slide: (direction: 'next' | 'prev') => ({
    initial: { 
      opacity: 0, 
      x: direction === 'next' ? 100 : -100,
      scale: 0.95 
    },
    animate: { 
      opacity: 1, 
      x: 0,
      scale: 1 
    },
    exit: { 
      opacity: 0, 
      x: direction === 'next' ? -50 : 50,
      scale: 0.98 
    },
    transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] }
  }),
  
  // 3. Zoom: Phóng to/thu nhỏ
  zoom: (direction: 'next' | 'prev') => ({
    initial: { 
      opacity: 0, 
      scale: direction === 'next' ? 0.6 : 1.4,
    },
    animate: { 
      opacity: 1, 
      scale: 1,
    },
    exit: { 
      opacity: 0, 
      scale: direction === 'next' ? 1.4 : 0.6,
    },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }),
  
  // 4. Flip: Lật 3D theo trục Y
  flip: (direction: 'next' | 'prev') => ({
    initial: { 
      opacity: 0, 
      rotateY: direction === 'next' ? 90 : -90,
      scale: 0.9
    },
    animate: { 
      opacity: 1, 
      rotateY: 0,
      scale: 1
    },
    exit: { 
      opacity: 0, 
      rotateY: direction === 'next' ? -45 : 45,
      scale: 0.95
    },
    transition: { duration: 0.7, ease: [0.32, 0.72, 0, 1] }
  }),
  
  // 5. Rotate: Xoay tròn
  rotate: (direction: 'next' | 'prev') => ({
    initial: { 
      opacity: 0, 
      rotate: direction === 'next' ? 20 : -20,
      scale: 0.8
    },
    animate: { 
      opacity: 1, 
      rotate: 0,
      scale: 1
    },
    exit: { 
      opacity: 0, 
      rotate: direction === 'next' ? -10 : 10,
      scale: 0.9
    },
    transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }
  }),
  
  // 6. Blur Slide: Trượt với blur
  blurSlide: (direction: 'next' | 'prev') => ({
    initial: { 
      opacity: 0, 
      x: direction === 'next' ? 150 : -150,
      filter: 'blur(10px)'
    },
    animate: { 
      opacity: 1, 
      x: 0,
      filter: 'blur(0px)'
    },
    exit: { 
      opacity: 0, 
      x: direction === 'next' ? -150 : 150,
      filter: 'blur(10px)'
    },
    transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] }
  }),
  
  // 7. Scale Fade: Phóng to với fade
  scaleFade: (direction: 'next' | 'prev') => ({
    initial: { 
      opacity: 0, 
      scale: 0.85,
      y: direction === 'next' ? 50 : -50
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      y: 0
    },
    exit: { 
      opacity: 0, 
      scale: 1.05,
      y: direction === 'next' ? -30 : 30
    },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }),
  
  // 8. Perspective Slide: Trượt với perspective 3D
  perspectiveSlide: (direction: 'next' | 'prev') => ({
    initial: { 
      opacity: 0, 
      x: direction === 'next' ? 200 : -200,
      rotateY: direction === 'next' ? 25 : -25,
      scale: 0.9
    },
    animate: { 
      opacity: 1, 
      x: 0,
      rotateY: 0,
      scale: 1
    },
    exit: { 
      opacity: 0, 
      x: direction === 'next' ? -100 : 100,
      rotateY: direction === 'next' ? -15 : 15,
      scale: 0.95
    },
    transition: { duration: 0.7, ease: [0.32, 0.72, 0, 1] }
  }),
};

// Gán transition cho từng slide (có thể customize theo nhu cầu)
const slideTransitions = [
  'fade',           // Slide 1: Tiêu đề - fade nhẹ nhàng
  'zoom',           // Slide 2: Dẫn nhập - zoom ấn tượng
  'slide',          // Slide 3: Số phận là gì - slide cơ bản
  'flip',           // Slide 4: Vì sao cần vượt - flip động
  'rotate',         // Slide 5: Biểu hiện - rotate sáng tạo
  'perspectiveSlide', // Slide 6: Yếu tố - perspective 3D
  'blurSlide',      // Slide 7: Cách thức - blur slide
  'scaleFade',      // Slide 8: Giáo dục - scale fade
  'zoom',           // Slide 9: Tự tin - zoom
  'flip',           // Slide 10: Nguyễn Ngọc Ký - flip trang trọng
  'fade',           // Slide 11: Trung Thu - fade nhẹ nhàng
  'slide',          // Slide 12: Liên hệ thực tế - slide
  'rotate',         // Slide 13: Lời khuyên - rotate
  'perspectiveSlide', // Slide 14: Bài học - perspective
  'blurSlide',      // Slide 15: Câu hỏi - blur slide
  'scaleFade',      // Slide 16: Kết luận - scale fade
  'zoom',           // Slide 17: Cảm ơn - zoom out ấn tượng
  'fade',           // Slide 18: Dự phòng
];

export default function MorphDemo() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [viewportScale, setViewportScale] = useState(0.5);
  const totalSlides = demoMorphSlides.length;

  // Calculate scale to fit viewport
  useEffect(() => {
    const calculateScale = () => {
      const slideWidth = 1200;
      const slideHeight = 675;
      const scaleX = window.innerWidth / slideWidth;
      const scaleY = (window.innerHeight - 200) / slideHeight; // Reserve 200px for controls
      const scale = Math.min(scaleX, scaleY) * 0.75; // 75% to ensure it fits
      setViewportScale(scale);
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setDirection('next');
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setDirection('prev');
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowRight') nextSlide();
    if (event.key === 'ArrowLeft') prevSlide();
  };

  const slide = demoMorphSlides[currentSlide];
  
  // Lấy transition variant cho slide hiện tại
  const currentTransition = slideTransitions[currentSlide] || 'slide';
  const variant = transitionVariants[currentTransition as keyof typeof transitionVariants];
  
  // Tính toán animation values
  const animationValues = typeof variant === 'function' ? variant(direction) : variant;

  return (
    <div 
      className="relative w-full h-screen overflow-hidden focus:outline-none"
      tabIndex={0}
      onKeyDown={handleKeyPress}
      data-testid="morph-demo-container"
    >
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          backgroundSize: '200% 200%',
        }}
      />
      
      {/* Floating gradient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -80, 0],
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, -120, 0],
          y: [0, 60, 0],
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
      <motion.div
        className="absolute top-1/2 right-1/3 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl"
        animate={{
          x: [0, 80, 0],
          y: [0, -100, 0],
          scale: [1, 1.15, 1],
          opacity: [0.25, 0.45, 0.25],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5
        }}
      />
      
      {/* Header - Demo info - moved to bottom left */}
      <div className="absolute bottom-4 left-4 z-50 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-lg text-white">
        <p className="text-xs opacity-90">
          Slide {currentSlide + 1} / {totalSlides}
          <span className="ml-2 text-purple-300">• {currentTransition}</span>
        </p>
      </div>

      {/* Slide Container with AnimatePresence for smooth transitions */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentSlide}
          className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden"
          style={{ 
            background: 'transparent',
            perspective: '2000px',
          }}
          data-testid={`slide-${currentSlide}`}
          initial={animationValues.initial}
          animate={animationValues.animate}
          exit={animationValues.exit}
          transition={animationValues.transition}
        >
          {/* Fixed size canvas scaled to fit viewport */}
          <motion.div 
            className="relative"
            style={{
              width: '1200px',
              height: '675px',
              transform: `scale(${viewportScale}) translateY(20px)`,
              transformOrigin: 'center center',
              backfaceVisibility: 'hidden',
            }}
          >
            <SlideCanvas elements={slide.elements} />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-50">
        <motion.button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="bg-black/50 backdrop-blur-sm hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed text-white p-4 rounded-full transition-all"
          data-testid="button-prev"
          whileHover={{ scale: currentSlide === 0 ? 1 : 1.1, x: -3 }}
          whileTap={{ scale: currentSlide === 0 ? 1 : 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <ArrowLeft size={24} />
        </motion.button>

        {/* Slide indicators */}
        <div className="flex gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setDirection(index > currentSlide ? 'next' : 'prev');
                setCurrentSlide(index);
              }}
              className={`h-3 rounded-full transition-all ${
                index === currentSlide 
                  ? 'bg-white' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              style={{ width: index === currentSlide ? '32px' : '12px' }}
              data-testid={`indicator-${index}`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              animate={{
                width: index === currentSlide ? '32px' : '12px',
                backgroundColor: index === currentSlide ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.5)'
              }}
            />
          ))}
        </div>

        <motion.button
          onClick={nextSlide}
          disabled={currentSlide === totalSlides - 1}
          className="bg-black/50 backdrop-blur-sm hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed text-white p-4 rounded-full transition-all"
          data-testid="button-next"
          whileHover={{ scale: currentSlide === totalSlides - 1 ? 1 : 1.1, x: 3 }}
          whileTap={{ scale: currentSlide === totalSlides - 1 ? 1 : 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <ArrowRight size={24} />
        </motion.button>
      </div>
    </div>
  );
}
