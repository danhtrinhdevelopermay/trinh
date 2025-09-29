import ProgressBar from '../ProgressBar';

export default function ProgressBarExample() {
  return (
    <div className="p-8 bg-background min-h-screen flex items-center justify-center">
      <div className="space-y-8 max-w-md w-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Progress Bar</h2>
          <p className="text-muted-foreground">Thanh tiến độ presentation</p>
        </div>
        
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Slide 1/7</p>
            <ProgressBar currentSlide={0} totalSlides={7} />
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-2">Slide 3/7</p>
            <ProgressBar currentSlide={2} totalSlides={7} />
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-2">Slide 7/7</p>
            <ProgressBar currentSlide={6} totalSlides={7} />
          </div>
        </div>
      </div>
    </div>
  );
}