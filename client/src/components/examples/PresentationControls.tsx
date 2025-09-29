import { useState } from 'react';
import PresentationControls from '../PresentationControls';

export default function PresentationControlsExample() {
  const [currentSlide, setCurrentSlide] = useState(2);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const totalSlides = 7;

  return (
    <div className="p-8 bg-background min-h-screen flex items-center justify-center">
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Presentation Controls</h2>
          <p className="text-muted-foreground">Điều khiển navigation cho slides</p>
        </div>
        
        <PresentationControls
          currentSlide={currentSlide}
          totalSlides={totalSlides}
          isAutoPlaying={isAutoPlaying}
          onPrevious={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
          onNext={() => setCurrentSlide(Math.min(totalSlides - 1, currentSlide + 1))}
          onToggleAutoPlay={() => setIsAutoPlaying(!isAutoPlaying)}
          onReset={() => setCurrentSlide(0)}
        />
        
        <div className="text-center text-sm text-muted-foreground mt-4">
          Current slide: {currentSlide + 1} / {totalSlides}
        </div>
      </div>
    </div>
  );
}