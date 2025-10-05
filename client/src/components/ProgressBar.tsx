import { motion } from "framer-motion";

interface ProgressBarProps {
  currentSlide: number;
  totalSlides: number;
  onSlideClick?: (index: number) => void;
  className?: string;
  isFullscreen?: boolean;
}

export default function ProgressBar({ currentSlide, totalSlides, onSlideClick, className = "", isFullscreen = false }: ProgressBarProps) {
  const progress = ((currentSlide + 1) / totalSlides) * 100;

  return (
    <div className={`relative w-full h-1 bg-background/30 rounded-full overflow-hidden ${className}`} data-testid="progress-bar">
      <motion.div
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-chart-3 to-chart-4 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{
          duration: 0.5,
          ease: "easeInOut"
        }}
      />
      
      {/* Progress indicator dots - Hidden in fullscreen */}
      {!isFullscreen && (
        <div className="absolute inset-0 flex items-center justify-between px-1">
          {Array.from({ length: totalSlides }, (_, index) => (
            <motion.div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                index <= currentSlide 
                  ? 'bg-primary-foreground shadow-sm' 
                  : 'bg-background/50'
              } ${onSlideClick ? 'cursor-pointer hover:scale-150' : ''}`}
              initial={{ scale: 0.5, opacity: 0.5 }}
              animate={{ 
                scale: index === currentSlide ? 1.2 : 1,
                opacity: index <= currentSlide ? 1 : 0.5
              }}
              transition={{ duration: 0.3 }}
              onClick={() => onSlideClick?.(index)}
              data-testid={`progress-dot-${index}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}