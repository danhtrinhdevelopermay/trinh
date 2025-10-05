// Media preloader utility để load tất cả ảnh, video, audio trước khi hiển thị

export interface MediaAsset {
  type: 'image' | 'video' | 'audio';
  url: string;
}

export interface PreloadProgress {
  loaded: number;
  total: number;
  percentage: number;
  currentAsset?: string;
}

/**
 * Preload một image
 */
function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => {
      console.warn(`Failed to preload image: ${url}`);
      resolve(); // Resolve anyway để không block việc load các assets khác
    };
    img.src = url;
  });
}

/**
 * Preload một video - chỉ cần load metadata, không cần load toàn bộ video
 */
function preloadVideo(url: string): Promise<void> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata'; // Chỉ load metadata, không load toàn bộ video
    
    const onLoadedMetadata = () => {
      cleanup();
      resolve();
    };
    
    const onError = () => {
      console.warn(`Failed to preload video metadata: ${url}`);
      cleanup();
      resolve(); // Resolve anyway
    };
    
    const cleanup = () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('error', onError);
      video.src = '';
      video.load();
    };
    
    // Set timeout ngắn hơn vì chỉ load metadata
    const timeout = setTimeout(() => {
      console.warn(`Video metadata preload timeout: ${url}`);
      cleanup();
      resolve();
    }, 5000); // 5 seconds timeout
    
    video.addEventListener('loadedmetadata', () => {
      clearTimeout(timeout);
      onLoadedMetadata();
    });
    video.addEventListener('error', () => {
      clearTimeout(timeout);
      onError();
    });
    
    video.src = url;
    video.load();
  });
}

/**
 * Preload một audio file
 */
function preloadAudio(url: string): Promise<void> {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.preload = 'auto';
    
    const onCanPlay = () => {
      cleanup();
      resolve();
    };
    
    const onError = () => {
      console.warn(`Failed to preload audio: ${url}`);
      cleanup();
      resolve(); // Resolve anyway
    };
    
    const cleanup = () => {
      audio.removeEventListener('canplaythrough', onCanPlay);
      audio.removeEventListener('error', onError);
      audio.src = '';
      audio.load();
    };
    
    const timeout = setTimeout(() => {
      console.warn(`Audio preload timeout: ${url}`);
      cleanup();
      resolve();
    }, 10000); // 10 seconds timeout
    
    audio.addEventListener('canplaythrough', () => {
      clearTimeout(timeout);
      onCanPlay();
    });
    audio.addEventListener('error', () => {
      clearTimeout(timeout);
      onError();
    });
    
    audio.src = url;
    audio.load();
  });
}

/**
 * Extract tất cả media URLs từ slide data
 */
export function extractMediaAssets(slides: any[]): MediaAsset[] {
  const assets: MediaAsset[] = [];
  const uniqueUrls = new Set<string>();
  
  slides.forEach(slide => {
    if (slide.elements) {
      slide.elements.forEach((element: any) => {
        // Images
        if (element.type === 'image' && element.src && !uniqueUrls.has(element.src)) {
          uniqueUrls.add(element.src);
          assets.push({ type: 'image', url: element.src });
        }
        
        // Videos
        if (element.type === 'video' && element.src && !uniqueUrls.has(element.src)) {
          uniqueUrls.add(element.src);
          assets.push({ type: 'video', url: element.src });
        }
        
        // Video posters
        if (element.type === 'video' && element.poster && !uniqueUrls.has(element.poster)) {
          uniqueUrls.add(element.poster);
          assets.push({ type: 'image', url: element.poster });
        }
      });
    }
  });
  
  return assets;
}

/**
 * Preload tất cả media assets với progress tracking
 */
export async function preloadAllMedia(
  assets: MediaAsset[],
  onProgress?: (progress: PreloadProgress) => void
): Promise<void> {
  let loaded = 0;
  const total = assets.length;
  
  if (total === 0) {
    if (onProgress) {
      onProgress({ loaded: 0, total: 0, percentage: 100 });
    }
    return;
  }
  
  // Initial progress
  if (onProgress) {
    onProgress({ loaded: 0, total, percentage: 0 });
  }
  
  // Load assets sequentially để track progress chính xác
  for (const asset of assets) {
    try {
      switch (asset.type) {
        case 'image':
          await preloadImage(asset.url);
          break;
        case 'video':
          await preloadVideo(asset.url);
          break;
        case 'audio':
          await preloadAudio(asset.url);
          break;
      }
    } catch (error) {
      console.warn(`Error preloading ${asset.type}: ${asset.url}`, error);
    }
    
    loaded++;
    if (onProgress) {
      onProgress({
        loaded,
        total,
        percentage: Math.round((loaded / total) * 100),
        currentAsset: asset.url,
      });
    }
  }
}

/**
 * Preload background music và sound effects
 */
export async function preloadAudioAssets(audioUrls: string[]): Promise<void> {
  const assets: MediaAsset[] = audioUrls.map(url => ({ type: 'audio', url }));
  await preloadAllMedia(assets);
}
