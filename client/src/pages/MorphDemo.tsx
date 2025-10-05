import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SlideCanvas from "@/components/SlideCanvas";
import { demoMorphSlides } from "@/data/demoMorphSlides";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function MorphDemo() {
  const [currentSlide, setCurrentSlide] = useState(0);
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
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
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
      {/* Header - Demo info - moved to bottom left */}
      <div className="absolute bottom-4 left-4 z-50 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-lg text-white">
        <p className="text-xs opacity-90">Slide {currentSlide + 1} / {totalSlides}</p>
      </div>

      {/* Slide Container - persistent to enable element morphing */}
      <div
        className={`absolute inset-0 w-full h-full ${slide.background} ${slide.textColor} flex items-center justify-center overflow-hidden`}
        data-testid={`slide-${currentSlide}`}
      >
        {/* Fixed size canvas scaled to fit viewport */}
        <div 
          className="relative"
          style={{
            width: '1200px',
            height: '675px',
            transform: `scale(${viewportScale}) translateY(20px)`,
            transformOrigin: 'center center'
          }}
        >
          <SlideCanvas elements={slide.elements} />
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-50">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="bg-black/50 backdrop-blur-sm hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed text-white p-4 rounded-full transition-all"
          data-testid="button-prev"
        >
          <ArrowLeft size={24} />
        </button>

        {/* Slide indicators */}
        <div className="flex gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide 
                  ? 'bg-white w-8' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              data-testid={`indicator-${index}`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          disabled={currentSlide === totalSlides - 1}
          className="bg-black/50 backdrop-blur-sm hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed text-white p-4 rounded-full transition-all"
          data-testid="button-next"
        >
          <ArrowRight size={24} />
        </button>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg text-white text-sm z-40">
        <p>Use arrow keys or buttons to navigate • Watch elements morph smoothly between slides</p>
      </div>
    </div>
  );
}
