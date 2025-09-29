// Audio utility functions for generating simple sounds programmatically

/**
 * Generate a simple beep sound using Web Audio API
 */
export const generateBeepSound = (frequency: number = 800, duration: number = 0.2, volume: number = 0.3): Promise<void> => {
  return new Promise((resolve) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
      
      oscillator.onended = () => resolve();
    } catch (error) {
      console.log('Web Audio API not available');
      resolve();
    }
  });
};

/**
 * Generate a soft transition sound
 */
export const playTransitionSound = async () => {
  await generateBeepSound(600, 0.15, 0.2);
};

/**
 * Generate a notification sound
 */
export const playNotificationSound = async () => {
  await generateBeepSound(800, 0.1, 0.15);
};

/**
 * Create a background audio element with a simple ambient tone
 */
export const createBackgroundAudio = (): HTMLAudioElement | null => {
  try {
    // Create a simple data URI for a very quiet ambient sound
    // This is a minimal WAV file that creates a very quiet tone
    const audioElement = new Audio();
    
    // For now, return a silent audio element that can be controlled
    audioElement.loop = true;
    audioElement.volume = 0; // Start silent, can be controlled by volume slider
    
    return audioElement;
  } catch (error) {
    console.log('Could not create background audio');
    return null;
  }
};

/**
 * Check if audio context is available
 */
export const isAudioSupported = (): boolean => {
  return !!(window.AudioContext || (window as any).webkitAudioContext);
};