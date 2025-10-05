import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw, Expand, Minimize } from "lucide-react";

interface PresentationControlsProps {
  currentSlide: number;
  totalSlides: number;
  isAutoPlaying: boolean;
  isFullscreen?: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onToggleAutoPlay: () => void;
  onReset: () => void;
  onToggleFullscreen: () => void;
  className?: string;
}

export default function PresentationControls({
  currentSlide,
  totalSlides,
  isAutoPlaying,
  isFullscreen = false,
  onPrevious,
  onNext,
  onToggleAutoPlay,
  onReset,
  onToggleFullscreen,
  className = ""
}: PresentationControlsProps) {
  return (
    <div className={`flex items-center gap-2 p-2 rounded-lg bg-background/80 backdrop-blur-sm border ${className}`} data-testid="presentation-controls">
      <Button
        size="sm"
        variant="ghost"
        onClick={onReset}
        data-testid="button-reset"
        className="hover-elevate"
        title="Quay về slide đầu"
      >
        <RotateCcw className="w-4 h-4" />
      </Button>

      <Button
        size="sm"
        variant="ghost"
        onClick={onPrevious}
        disabled={currentSlide === 0}
        data-testid="button-previous"
        className="hover-elevate"
        title="Slide trước"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <div className="flex items-center gap-2 px-3 py-1 bg-card rounded text-sm font-medium min-w-[80px] justify-center" data-testid="slide-counter">
        <span className="text-primary">{currentSlide + 1}</span>
        <span className="text-muted-foreground">/</span>
        <span className="text-muted-foreground">{totalSlides}</span>
      </div>

      <Button
        size="sm"
        variant="ghost"
        onClick={onNext}
        disabled={currentSlide === totalSlides - 1}
        data-testid="button-next"
        className="hover-elevate"
        title="Slide tiếp theo"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>

      <Button
        size="sm"
        variant={isAutoPlaying ? "default" : "ghost"}
        onClick={onToggleAutoPlay}
        data-testid="button-autoplay"
        className="hover-elevate"
        title={isAutoPlaying ? "Tạm dừng tự động chuyển" : "Tự động chuyển slide"}
      >
        {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </Button>

      <div className="h-6 w-px bg-border mx-1"></div>

      <Button
        size="sm"
        variant={isFullscreen ? "default" : "secondary"}
        onClick={onToggleFullscreen}
        data-testid="button-fullscreen"
        className="hover-elevate"
        title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
      >
        {isFullscreen ? <Minimize className="w-4 h-4 mr-1" /> : <Expand className="w-4 h-4 mr-1" />}
        <span className="text-xs font-medium">{isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}</span>
      </Button>
    </div>
  );
}