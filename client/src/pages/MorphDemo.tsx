import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SlideCanvas from "@/components/SlideCanvas";
import { demoMorphSlides } from "@/data/demoMorphSlides";
import { ArrowLeft, ArrowRight } from "lucide-react";

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
        <p className="text-xs opacity-90">Slide {currentSlide + 1} / {totalSlides}</p>
      </div>

      {/* Slide Container with AnimatePresence for smooth transitions */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentSlide}
          className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden"
          style={{ background: 'transparent' }}
          data-testid={`slide-${currentSlide}`}
          initial={{
            opacity: 0,
            scale: 0.95,
            x: direction === 'next' ? 100 : -100,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            x: 0,
          }}
          exit={{
            opacity: 0,
            scale: 0.98,
            x: direction === 'next' ? -50 : 50,
          }}
          transition={{
            duration: 0.5,
            ease: [0.32, 0.72, 0, 1],
            opacity: { duration: 0.4 },
          }}
        >
          {/* Fixed size canvas scaled to fit viewport */}
          <motion.div 
            className="relative"
            style={{
              width: '1200px',
              height: '675px',
              transform: `scale(${viewportScale}) translateY(20px)`,
              transformOrigin: 'center center'
            }}
            initial={{ rotateY: direction === 'next' ? 5 : -5 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: direction === 'next' ? -3 : 3 }}
            transition={{
              duration: 0.5,
              ease: [0.32, 0.72, 0, 1],
            }}
          >
            {/* Semi-transparent background for better text readability */}
            <motion.div 
              className="absolute inset-0 rounded-2xl"
              style={{
                background: 'radial-gradient(circle at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)',
                backdropFilter: 'blur(10px)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            
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

      {/* Instructions */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg text-white text-sm z-40">
        <p>Use arrow keys or buttons to navigate • Watch elements morph smoothly between slides</p>
      </div>
    </div>
  );
}
