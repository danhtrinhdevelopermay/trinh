import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Image as ImageIcon, Video as VideoIcon, Music } from "lucide-react";
import { preloadAllMedia, extractMediaAssets, type PreloadProgress } from "@/lib/mediaPreloader";

interface MediaPreloaderProps {
  slides: any[];
  onComplete: () => void;
  audioAssets?: string[];
}

export default function MediaPreloader({ slides, onComplete, audioAssets = [] }: MediaPreloaderProps) {
  const [progress, setProgress] = useState<PreloadProgress>({
    loaded: 0,
    total: 0,
    percentage: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAllAssets = async () => {
      const startTime = Date.now();
      const MINIMUM_DISPLAY_TIME = 1500; // 1.5 giây minimum để user thấy được loading
      
      try {
        // Extract media assets từ slides
        const mediaAssets = extractMediaAssets(slides);
        
        // Thêm audio assets nếu có
        const audioMediaAssets = audioAssets.map(url => ({
          type: 'audio' as const,
          url,
        }));
        
        const allAssets = [...mediaAssets, ...audioMediaAssets];
        
        console.log(`Starting preload of ${allAssets.length} assets...`);
        
        // Preload tất cả với progress tracking
        await preloadAllMedia(allAssets, (prog) => {
          setProgress(prog);
        });
        
        console.log('All assets preloaded successfully!');
        
        // Tính thời gian đã dùng
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, MINIMUM_DISPLAY_TIME - elapsedTime);
        
        // Đợi để đảm bảo user thấy loading screen và 100% progress
        setTimeout(() => {
          setIsLoading(false);
          setTimeout(() => {
            onComplete();
          }, 300); // Fade out animation
        }, remainingTime);
        
      } catch (error) {
        console.error('Error during preload:', error);
        // Vẫn continue nếu có lỗi sau minimum time
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, MINIMUM_DISPLAY_TIME - elapsedTime);
        
        setTimeout(() => {
          setIsLoading(false);
          onComplete();
        }, remainingTime);
      }
    };
    
    loadAllAssets();
  }, [slides, audioAssets, onComplete]);

  if (!isLoading && progress.percentage === 100) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-gradient-to-br from-primary via-primary/95 to-primary/90 backdrop-blur-sm flex items-center justify-center"
      >
        <div className="max-w-md w-full px-8">
          {/* Loading icon và title */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-4"
            >
              <Loader2 className="w-16 h-16 text-white" />
            </motion.div>
            
            <h2 className="text-3xl font-bold text-white mb-2">
              Đang Tải Nội Dung
            </h2>
            <p className="text-white/80 text-lg">
              Vui lòng đợi trong giây lát...
            </p>
          </motion.div>

          {/* Progress bar */}
          <div className="space-y-4">
            {/* Progress percentage */}
            <div className="flex items-center justify-between text-white/90 text-sm font-medium">
              <span>Tiến độ</span>
              <span>{progress.percentage}%</span>
            </div>
            
            {/* Progress bar */}
            <div className="relative h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress.percentage}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-300 via-yellow-200 to-white rounded-full"
              />
              
              {/* Shimmer effect */}
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                style={{ width: '50%' }}
              />
            </div>
            
            {/* Asset count */}
            <div className="flex items-center justify-center gap-6 text-white/70 text-sm">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                <span>Hình ảnh</span>
              </div>
              <div className="flex items-center gap-2">
                <VideoIcon className="w-4 h-4" />
                <span>Video</span>
              </div>
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4" />
                <span>Âm thanh</span>
              </div>
            </div>
            
            <div className="text-center text-white/60 text-xs">
              {progress.loaded} / {progress.total} tài nguyên
            </div>
          </div>

          {/* Decorative elements */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-20 left-20 w-32 h-32 bg-yellow-300/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            className="absolute bottom-20 right-20 w-40 h-40 bg-blue-300/20 rounded-full blur-3xl"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
