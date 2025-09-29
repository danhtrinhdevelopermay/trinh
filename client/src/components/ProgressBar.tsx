import { motion } from "framer-motion";

interface ProgressBarProps {
  currentSlide: number;
  totalSlides: number;
  className?: string;
}

export default function ProgressBar({ currentSlide, totalSlides, className = "" }: ProgressBarProps) {
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
      
      {/* Progress indicator dots */}
      <div className="absolute inset-0 flex items-center justify-between px-1">
        {Array.from({ length: totalSlides }, (_, index) => (
          <motion.div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              index <= currentSlide 
                ? 'bg-primary-foreground shadow-sm' 
                : 'bg-background/50'
            }`}
            initial={{ scale: 0.5, opacity: 0.5 }}
            animate={{ 
              scale: index === currentSlide ? 1.2 : 1,
              opacity: index <= currentSlide ? 1 : 0.5
            }}
            transition={{ duration: 0.3 }}
            data-testid={`progress-dot-${index}`}
          />
        ))}
      </div>
    </div>
  );
}