import { useState, useEffect, useCallback, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { Expand, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import Slide, { type SlideData } from "./Slide";
import PresentationControls from "./PresentationControls";
import AudioControls from "./AudioControls";
import ProgressBar from "./ProgressBar";
import { useAudio } from "@/contexts/AudioContext";
import { usePresentationSlides } from "@/hooks/usePresentations";
// Import educational stock images
import successImage1 from "@assets/stock_images/educational_success__583087f4.jpg";
import successImage2 from "@assets/stock_images/educational_success__450426a4.jpg";
import successImage3 from "@assets/stock_images/educational_success__4203c133.jpg";
import inspiringImage from "@assets/stock_images/gentle_inspiring_ins_dc4fa5e2.jpg";

// Mock data for presentation slides about overcoming destiny
const mockSlides: SlideData[] = [
  {
    id: 1,
    type: 'title',
    title: "Vượt Lên Số Phận",
    content: (
      <div className="flex items-center justify-between gap-12 w-full max-w-6xl">
        <div className="flex-1">
          <p className="text-2xl md:text-3xl font-medium leading-relaxed opacity-90">
            Làm thế nào để con người vượt lên số phận của chính mình trong cuộc sống
          </p>
        </div>
        <div className="w-96 h-72 rounded-2xl overflow-hidden shadow-2xl opacity-90">
          <img 
            src={inspiringImage} 
            alt="Inspiring journey to overcome destiny" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    ),
    background: "educational-gradient-1"
  },
  {
    id: 2,
    type: 'content',
    title: "Số Phận Là Gì?",
    content: (
      <div className="flex items-center justify-between gap-12 w-full max-w-6xl">
        <div className="space-y-8 text-left flex-1">
          <div className="flex items-start space-x-4 group">
            <div className="w-3 h-3 bg-white/60 rounded-full mt-3 group-hover:scale-125 transition-transform"></div>
            <p className="text-2xl font-medium leading-relaxed">Những điều kiện ban đầu ta được sinh ra</p>
          </div>
          <div className="flex items-start space-x-4 group">
            <div className="w-3 h-3 bg-white/60 rounded-full mt-3 group-hover:scale-125 transition-transform"></div>
            <p className="text-2xl font-medium leading-relaxed">Hoàn cảnh gia đình và xã hội</p>
          </div>
          <div className="flex items-start space-x-4 group">
            <div className="w-3 h-3 bg-white/60 rounded-full mt-3 group-hover:scale-125 transition-transform"></div>
            <p className="text-2xl font-medium leading-relaxed">Khả năng và hạn chế tự nhiên</p>
          </div>
          <div className="flex items-start space-x-4 group">
            <div className="w-3 h-3 bg-white/60 rounded-full mt-3 group-hover:scale-125 transition-transform"></div>
            <p className="text-2xl font-medium leading-relaxed">Những sự kiện ngoài tầm kiểm soát</p>
          </div>
        </div>
        <div className="w-80 h-60 rounded-2xl overflow-hidden shadow-2xl opacity-80">
          <img 
            src={successImage1} 
            alt="Life circumstances and destiny" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    ),
    background: "educational-gradient-1"
  },
  {
    id: 3,
    type: 'quote',
    title: "Nelson Mandela",
    content: (
      <div className="flex items-center justify-center gap-8 w-full max-w-5xl">
        <div className="w-32 h-32 rounded-full overflow-hidden shadow-xl opacity-80 bg-white/10">
          <img 
            src={successImage2} 
            alt="Nelson Mandela inspiration" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 text-center">
          <p className="text-3xl font-medium leading-relaxed italic">
            "Tôi là chủ nhân của số phận mình, tôi là thuyền trưởng của linh hồn mình"
          </p>
        </div>
      </div>
    ),
    background: "educational-gradient-1"
  },
  {
    id: 4,
    type: 'content',
    title: "Tư Duy Quyết Định Mọi Thứ",
    content: (
      <div className="flex items-center justify-between gap-12 w-full max-w-6xl">
        <div className="space-y-8 text-left flex-1">
          <div className="flex items-start space-x-4 group">
            <div className="w-4 h-4 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full mt-2 group-hover:scale-125 transition-transform shadow-lg"></div>
            <p className="text-2xl font-medium leading-relaxed">Thay đổi cách nhìn nhận về hoàn cảnh</p>
          </div>
          <div className="flex items-start space-x-4 group">
            <div className="w-4 h-4 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full mt-2 group-hover:scale-125 transition-transform shadow-lg"></div>
            <p className="text-2xl font-medium leading-relaxed">Tập trung vào những gì có thể kiểm soát</p>
          </div>
          <div className="flex items-start space-x-4 group">
            <div className="w-4 h-4 bg-gradient-to-r from-green-300 to-teal-300 rounded-full mt-2 group-hover:scale-125 transition-transform shadow-lg"></div>
            <p className="text-2xl font-medium leading-relaxed">Biến thử thách thành cơ hội</p>
          </div>
          <div className="flex items-start space-x-4 group">
            <div className="w-4 h-4 bg-gradient-to-r from-pink-300 to-rose-300 rounded-full mt-2 group-hover:scale-125 transition-transform shadow-lg"></div>
            <p className="text-2xl font-medium leading-relaxed">Học hỏi từ thất bại và khó khăn</p>
          </div>
        </div>
        <div className="w-80 h-60 rounded-2xl overflow-hidden shadow-2xl opacity-80">
          <img 
            src={successImage2} 
            alt="Mindset and thinking" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    ),
    background: "educational-gradient-1"
  },
  {
    id: 5,
    type: 'content',
    title: "Hành Động Tạo Nên Thay Đổi",
    content: (
      <div className="flex items-center justify-between gap-12 w-full max-w-6xl">
        <div className="space-y-8 text-left flex-1">
          <div className="flex items-start space-x-4 group">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full text-white font-bold text-sm group-hover:scale-110 transition-transform shadow-lg">1</div>
            <p className="text-2xl font-medium leading-relaxed">Đặt mục tiêu cụ thể và rõ ràng</p>
          </div>
          <div className="flex items-start space-x-4 group">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full text-white font-bold text-sm group-hover:scale-110 transition-transform shadow-lg">2</div>
            <p className="text-2xl font-medium leading-relaxed">Lập kế hoạch và thực hiện kiên trì</p>
          </div>
          <div className="flex items-start space-x-4 group">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full text-white font-bold text-sm group-hover:scale-110 transition-transform shadow-lg">3</div>
            <p className="text-2xl font-medium leading-relaxed">Không ngừng học hỏi và phát triển</p>
          </div>
          <div className="flex items-start space-x-4 group">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-full text-white font-bold text-sm group-hover:scale-110 transition-transform shadow-lg">4</div>
            <p className="text-2xl font-medium leading-relaxed">Xây dựng mối quan hệ tích cực</p>
          </div>
        </div>
        <div className="w-80 h-60 rounded-2xl overflow-hidden shadow-2xl opacity-80">
          <img 
            src={inspiringImage} 
            alt="Taking action for change" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    ),
    background: "educational-gradient-1"
  },
  {
    id: 6,
    type: 'quote',
    title: "Viktor Frankl",
    content: (
      <div className="flex items-center justify-center gap-8 w-full max-w-5xl">
        <div className="w-32 h-32 rounded-full overflow-hidden shadow-xl opacity-80 bg-white/10">
          <img 
            src={successImage1} 
            alt="Viktor Frankl inspiration" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 text-center">
          <p className="text-3xl font-medium leading-relaxed italic">
            "Giữa kích thích và phản ứng có một khoảng trống. Trong khoảng trống đó là quyền tự do lựa chọn của chúng ta"
          </p>
        </div>
      </div>
    ),
    background: "educational-gradient-1"
  },
  {
    id: 7,
    type: 'content',
    title: "Kết Luận",
    content: (
      <div className="space-y-8 text-center max-w-4xl">
        <div className="flex items-center justify-between gap-8">
          <div className="flex-1">
            <p className="text-3xl font-bold mb-4">Số phận không phải là điểm đến</p>
            <p className="text-2xl mb-4">mà là điểm khởi đầu</p>
            <p className="text-xl opacity-90">Chúng ta có thể thay đổi và tạo ra cuộc sống mà mình mong muốn</p>
          </div>
          <div className="w-80 h-60 rounded-2xl overflow-hidden shadow-2xl opacity-80">
            <img 
              src={successImage3} 
              alt="Success and achievement" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    ),
    background: "educational-gradient-1"
  }
];

interface PresentationContainerProps {
  presentationId?: string;
  slides?: SlideData[]; // Keep for fallback to mock data
  autoPlayInterval?: number;
}

export default function PresentationContainer({ 
  presentationId = 'sample-presentation', // Default to sample presentation
  slides: fallbackSlides = mockSlides, 
  autoPlayInterval = 5000 
}: PresentationContainerProps) {
  // ALL HOOKS MUST BE CALLED FIRST, BEFORE ANY EARLY RETURNS
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [direction, setDirection] = useState<'prev' | 'next' | 'none'>('none');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [transitionType, setTransitionType] = useState<'morph' | 'slide' | 'zoom' | 'flip' | 'rotate' | 'cube' | 'fade'>('morph');
  
  const audioContext = useAudio();
  const { playTransitionSound, playSpecialEffect } = audioContext;
  
  // Fetch slides from API
  const { data: apiSlides, isLoading, error } = usePresentationSlides(presentationId);
  
  // Use API data if available, otherwise use fallback slides
  const slides = useMemo(() => {
    if (apiSlides?.length) {
      return apiSlides.map((slide, index) => {
        // Transform content from API format to component format
        let content = slide.content;
        
        // Handle different content types  
        if (typeof content === 'string') {
          try {
            const parsedContent = JSON.parse(content);
            
            // Handle array content (bullet points)
            if (Array.isArray(parsedContent)) {
              content = (
                <div className="space-y-6 text-left max-w-4xl">
                  {parsedContent.map((item, itemIndex) => (
                    <p key={itemIndex} className="text-2xl">• {item}</p>
                  ))}
                </div>
              );
            }
            // Handle content with images
            else if (parsedContent.type === 'title_with_image') {
              content = (
                <div className="flex items-center justify-between gap-12 w-full max-w-6xl">
                  <div className="flex-1">
                    <p className="text-2xl md:text-3xl font-medium leading-relaxed opacity-90">
                      {parsedContent.text}
                    </p>
                  </div>
                  <div className="w-96 h-72 rounded-2xl overflow-hidden shadow-2xl opacity-90">
                    <img 
                      src={parsedContent.image} 
                      alt="Inspiring journey to overcome destiny" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              );
            }
            else if (parsedContent.type === 'content_with_image') {
              content = (
                <div className="flex items-center justify-between gap-12 w-full max-w-6xl">
                  <div className="space-y-8 text-left flex-1">
                    {parsedContent.items.map((item: string, itemIndex: number) => (
                      <div key={itemIndex} className="flex items-start space-x-4 group">
                        <div className="w-3 h-3 bg-white/60 rounded-full mt-3 group-hover:scale-125 transition-transform"></div>
                        <p className="text-2xl font-medium leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                  <div className="w-80 h-60 rounded-2xl overflow-hidden shadow-2xl opacity-80">
                    <img 
                      src={parsedContent.image} 
                      alt="Content illustration" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              );
            }
            else if (parsedContent.type === 'quote_with_image') {
              content = (
                <div className="flex items-center justify-center gap-8 w-full max-w-5xl">
                  <div className="w-32 h-32 rounded-full overflow-hidden shadow-xl opacity-80 bg-white/10">
                    <img 
                      src={parsedContent.image} 
                      alt="Quote inspiration" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 text-center">
                    <p className="text-3xl font-medium leading-relaxed italic">
                      "{parsedContent.text}"
                    </p>
                  </div>
                </div>
              );
            }
            else if (parsedContent.type === 'story_with_image') {
              content = (
                <div className="flex items-center justify-between gap-12 w-full max-w-6xl">
                  <div className="space-y-6 text-left flex-1">
                    {parsedContent.story.map((item: string, itemIndex: number) => (
                      <div key={itemIndex} className="flex items-start space-x-4 group">
                        <div className="w-4 h-4 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full mt-2 group-hover:scale-125 transition-transform shadow-lg"></div>
                        <p className="text-xl font-medium leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                  <div className="w-80 h-64 rounded-2xl overflow-hidden shadow-2xl opacity-80 border-4 border-white/20">
                    <img 
                      src={parsedContent.image} 
                      alt="Story illustration" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              );
            }
            else if (parsedContent.type === 'conclusion_with_image') {
              content = (
                <div className="space-y-8 text-center max-w-4xl">
                  <div className="flex items-center justify-between gap-8">
                    <div className="flex-1">
                      <p className="text-3xl font-bold mb-4">Số phận không phải là điểm đến</p>
                      <p className="text-2xl mb-4">mà là điểm khởi đầu</p>
                      <p className="text-xl opacity-90">{parsedContent.text}</p>
                    </div>
                    <div className="w-80 h-60 rounded-2xl overflow-hidden shadow-2xl opacity-80">
                      <img 
                        src={parsedContent.image} 
                        alt="Success and achievement" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              );
            }
          } catch {
            // If JSON parsing fails, use content as-is
          }
        }
        
        return {
          id: index + 1, // Convert to number for component compatibility
          type: slide.type as 'title' | 'content' | 'quote',
          title: slide.title,
          content,
          background: slide.background,
        };
      });
    }
    return fallbackSlides;
  }, [apiSlides, fallbackSlides]);

  const goToNext = useCallback(async () => {
    if (currentSlide < slides.length - 1) {
      setDirection('next');
      setCurrentSlide(prev => prev + 1);
      console.log('Next slide:', currentSlide + 1);
      
      // Random transition type for variety
      const transitions: Array<'morph' | 'slide' | 'zoom' | 'flip' | 'rotate' | 'cube' | 'fade'> = ['morph', 'slide', 'zoom', 'flip', 'rotate', 'cube', 'fade'];
      const randomTransition = transitions[Math.floor(Math.random() * transitions.length)];
      setTransitionType(randomTransition);
      
      // Play transition sound effect based on transition type
      if (soundEnabled) {
        switch (randomTransition) {
          case 'zoom':
            await playTransitionSound('whoosh');
            break;
          case 'flip':
          case 'cube':
            await playTransitionSound('swoosh');
            break;
          case 'slide':
            await playTransitionSound('pop');
            break;
          default:
            await playTransitionSound('chime');
        }
        
        // Play special effect after a short delay
        setTimeout(() => {
          playSpecialEffect('sparkle');
        }, 300);
      }
    }
  }, [currentSlide, slides.length, soundEnabled, playTransitionSound, playSpecialEffect]);

  const goToPrevious = useCallback(async () => {
    if (currentSlide > 0) {
      setDirection('prev');
      setCurrentSlide(prev => prev - 1);
      console.log('Previous slide:', currentSlide - 1);
      
      // Random transition type
      const transitions: Array<'morph' | 'slide' | 'zoom' | 'flip' | 'rotate' | 'cube' | 'fade'> = ['morph', 'slide', 'zoom', 'flip', 'rotate', 'cube', 'fade'];
      const randomTransition = transitions[Math.floor(Math.random() * transitions.length)];
      setTransitionType(randomTransition);
      
      if (soundEnabled) {
        await playTransitionSound('pop');
        setTimeout(() => {
          playSpecialEffect('ding');
        }, 200);
      }
    }
  }, [currentSlide, soundEnabled, playTransitionSound, playSpecialEffect]);

  const resetPresentation = useCallback(() => {
    setDirection('prev');
    setCurrentSlide(0);
    setIsAutoPlaying(false);
    console.log('Presentation reset to beginning');
  }, []);

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlaying(!isAutoPlaying);
    console.log('Auto-play toggled:', !isAutoPlaying);
  }, [isAutoPlaying]);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        // Enter fullscreen
        const element = document.documentElement;
        if (element.requestFullscreen) {
          await element.requestFullscreen();
        } else if ((element as any).webkitRequestFullscreen) {
          await (element as any).webkitRequestFullscreen();
        } else if ((element as any).mozRequestFullScreen) {
          await (element as any).mozRequestFullScreen();
        } else if ((element as any).msRequestFullscreen) {
          await (element as any).msRequestFullscreen();
        }
        
        // Try to lock screen orientation to landscape for mobile/tablet
        try {
          if ('screen' in window && 'orientation' in (window.screen as any) && 'lock' in (window.screen as any).orientation) {
            await (window.screen as any).orientation.lock('landscape');
          }
        } catch (orientationError) {
          // Orientation lock not supported or failed, continue anyway
          console.log('Screen orientation lock not supported or failed');
        }
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  }, []);

  const goToSlide = useCallback(async (slideIndex: number) => {
    if (slideIndex >= 0 && slideIndex < slides.length && slideIndex !== currentSlide) {
      setDirection(slideIndex > currentSlide ? 'next' : 'prev');
      setCurrentSlide(slideIndex);
      console.log('Go to slide:', slideIndex);
      
      // Random transition type
      const transitions: Array<'morph' | 'slide' | 'zoom' | 'flip' | 'rotate' | 'cube' | 'fade'> = ['morph', 'slide', 'zoom', 'flip', 'rotate', 'cube', 'fade'];
      const randomTransition = transitions[Math.floor(Math.random() * transitions.length)];
      setTransitionType(randomTransition);
      
      if (soundEnabled) {
        await playTransitionSound('chime');
        setTimeout(() => {
          playSpecialEffect('sparkle');
        }, 200);
      }
    }
  }, [currentSlide, slides.length, soundEnabled, playTransitionSound, playSpecialEffect]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      if (currentSlide < slides.length - 1) {
        goToNext();
      } else {
        setIsAutoPlaying(false);
        console.log('Auto-play stopped at end of presentation');
      }
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isAutoPlaying, currentSlide, slides.length, autoPlayInterval, goToNext]);

  // Fullscreen change detection
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowRight':
        case ' ':
          event.preventDefault();
          goToNext();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          goToPrevious();
          break;
        case 'Home':
          event.preventDefault();
          resetPresentation();
          break;
        case 'Escape':
          if (isFullscreen) {
            event.preventDefault();
            toggleFullscreen();
          } else {
            event.preventDefault();
            setIsAutoPlaying(false);
          }
          break;
        case 'f':
        case 'F':
          event.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [goToNext, goToPrevious, resetPresentation, toggleFullscreen, isFullscreen]);

  // Loading state - only show if no fallback slides available
  if (isLoading && !fallbackSlides.length) {
    return (
      <div className="relative w-full h-screen bg-background overflow-hidden flex items-center justify-center" data-testid="presentation-loading">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-foreground">Đang tải bài thuyết trình...</p>
        </div>
      </div>
    );
  }

  // Error state - but use fallback slides if available (e.g., for demo mode)
  if (error && !fallbackSlides.length) {
    return (
      <div className="relative w-full h-screen bg-background overflow-hidden flex items-center justify-center" data-testid="presentation-error">
        <div className="text-center max-w-md">
          <div className="text-destructive text-6xl mb-4">⚠</div>
          <h2 className="text-2xl font-bold mb-2 text-foreground">Không thể tải bài thuyết trình</h2>
          <p className="text-muted-foreground mb-4">
            Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Tải lại trang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden" data-testid="presentation-container">
      {/* Main slide area */}
      <div className="relative w-full h-full" style={{ zIndex: 1 }}>
        <AnimatePresence mode="wait" custom={direction}>
          {slides.map((slide, index) => (
            index === currentSlide && (
              <Slide
                key={slide.id}
                slide={slide}
                isActive={index === currentSlide}
                direction={direction}
                transitionType={transitionType}
              />
            )
          ))}
        </AnimatePresence>
      </div>

      {/* Top progress bar - Hidden in fullscreen */}
      {!isFullscreen && (
        <div className="absolute top-0 left-0 right-0 z-10">
          <ProgressBar
            currentSlide={currentSlide}
            totalSlides={slides.length}
            onSlideClick={goToSlide}
            className="m-4"
          />
        </div>
      )}

      {/* Bottom controls - Hidden in fullscreen */}
      {!isFullscreen && (
        <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
          <div className="flex items-center justify-between max-w-6xl mx-auto gap-4">
            <AudioControls
              onSoundToggle={setSoundEnabled}
              className="opacity-90"
            />

            <PresentationControls
              currentSlide={currentSlide}
              totalSlides={slides.length}
              isAutoPlaying={isAutoPlaying}
              isFullscreen={isFullscreen}
              onPrevious={goToPrevious}
              onNext={goToNext}
              onToggleAutoPlay={toggleAutoPlay}
              onReset={resetPresentation}
              onToggleFullscreen={toggleFullscreen}
              className="opacity-90"
            />

            <Button
              size="lg"
              onClick={toggleFullscreen}
              data-testid="button-fullscreen-standalone"
              className="shadow-xl bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 font-semibold opacity-90 hover:opacity-100"
              title={isFullscreen ? "Thoát toàn màn hình (Esc)" : "Toàn màn hình (F)"}
            >
              {isFullscreen ? (
                <>
                  <Minimize className="w-5 h-5 mr-2" />
                  <span>Thu nhỏ</span>
                </>
              ) : (
                <>
                  <Expand className="w-5 h-5 mr-2" />
                  <span>Toàn màn hình</span>
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Fullscreen mode - Show minimal exit button on hover */}
      {isFullscreen && (
        <div className="absolute bottom-4 right-4 z-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <Button
            size="lg"
            onClick={toggleFullscreen}
            data-testid="button-fullscreen-exit"
            className="shadow-xl bg-primary/90 text-primary-foreground hover:bg-primary px-4 py-2 font-semibold"
            title="Thoát toàn màn hình (Esc)"
          >
            <Minimize className="w-5 h-5 mr-2" />
            <span>Thoát</span>
          </Button>
        </div>
      )}

      {/* Instructions overlay (shows briefly) - Hidden in fullscreen */}
      {currentSlide === 0 && !isFullscreen && (
        <div className="absolute top-1/2 right-8 transform -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm p-4 rounded-lg border text-sm text-muted-foreground max-w-xs">
          <p className="mb-2 font-medium">Điều khiển:</p>
          <p>• Phím mũi tên ← →: Chuyển slide</p>
          <p>• Phím cách: Slide tiếp theo</p>
          <p>• Home: Về đầu</p>
          <p>• F: Toàn màn hình</p>
          <p>• Esc: Thoát toàn màn hình</p>
          <p>• Click vào chấm slide để nhảy đến slide đó</p>
        </div>
      )}
    </div>
  );
}