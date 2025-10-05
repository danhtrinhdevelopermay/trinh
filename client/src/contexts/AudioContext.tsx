import { createContext, useContext, useEffect, useRef, useState, useCallback, ReactNode } from "react";
import backgroundMusicFile from "@assets/soft-background-music-401914_1759657535406.mp3";
import pageTransitionSound from "@assets/magic-ascend-3-259526_1759659782376.mp3";

interface AudioContextValue {
  // States
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  audioSupported: boolean;
  currentTrack: number;
  
  // Controls
  togglePlayback: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  changeTrack: () => void;
  playTransitionSound: (type?: 'whoosh' | 'swoosh' | 'pop' | 'chime') => void;
  playElementSound: () => void;
  playSpecialEffect: (effect: 'magic' | 'sparkle' | 'ding') => void;
  playPageNavigationSound: () => void;
}

const AudioContextObj = createContext<AudioContextValue | null>(null);

interface AudioProviderProps {
  children: ReactNode;
}

// Background music track
const BACKGROUND_TRACKS = [
  backgroundMusicFile,
];

export function AudioProvider({ children }: AudioProviderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [audioSupported, setAudioSupported] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [audioContextReady, setAudioContextReady] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);
  const hasAudioStartedRef = useRef<boolean>(false);

  // Initialize AudioContext
  useEffect(() => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioContextRef.current = new AudioContextClass();
        masterGainRef.current = audioContextRef.current.createGain();
        masterGainRef.current.connect(audioContextRef.current.destination);
        masterGainRef.current.gain.value = volume / 100;
        setAudioSupported(true);
      }
    } catch (error) {
      console.log('Web Audio API not supported');
      setAudioSupported(false);
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Resume AudioContext on first user interaction
  const resumeAudioContext = useCallback(async () => {
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      try {
        await audioContextRef.current.resume();
        setAudioContextReady(true);
        hasAudioStartedRef.current = true;
      } catch (error) {
        // Silently fail if resume not allowed (e.g., no user gesture yet)
      }
    } else if (audioContextRef.current?.state === 'running') {
      setAudioContextReady(true);
      hasAudioStartedRef.current = true;
    }
  }, []);

  // Update master gain when volume changes
  useEffect(() => {
    if (masterGainRef.current) {
      const gainValue = isMuted ? 0 : volume / 100;
      masterGainRef.current.gain.setTargetAtTime(gainValue, audioContextRef.current?.currentTime || 0, 0.1);
    }
    
    // Also update background audio volume
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.volume = isMuted ? 0 : (volume / 100) * 0.3;
    }
  }, [volume, isMuted]);

  // Initialize background audio
  useEffect(() => {
    if (audioSupported && BACKGROUND_TRACKS[currentTrack]) {
      const audio = new Audio(BACKGROUND_TRACKS[currentTrack]);
      audio.loop = true;
      audio.volume = isMuted ? 0 : (volume / 100) * 0.3;
      backgroundAudioRef.current = audio;
    }
  }, [currentTrack, audioSupported]);

  const togglePlayback = useCallback(async () => {
    await resumeAudioContext();
    
    if (backgroundAudioRef.current) {
      const newPlayState = !isPlaying;
      setIsPlaying(newPlayState);
      
      if (newPlayState) {
        try {
          await backgroundAudioRef.current.play();
        } catch (error) {
          console.log('Background playback failed:', error);
          setIsPlaying(false);
        }
      } else {
        backgroundAudioRef.current.pause();
      }
    }
  }, [isPlaying, resumeAudioContext]);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const changeTrack = useCallback(() => {
    const nextTrack = (currentTrack + 1) % BACKGROUND_TRACKS.length;
    setCurrentTrack(nextTrack);
    
    if (backgroundAudioRef.current) {
      const wasPlaying = !backgroundAudioRef.current.paused;
      backgroundAudioRef.current.pause();
      
      // Load new track
      const newAudio = new Audio(BACKGROUND_TRACKS[nextTrack]);
      newAudio.loop = true;
      newAudio.volume = isMuted ? 0 : (volume / 100) * 0.3;
      backgroundAudioRef.current = newAudio;
      
      if (wasPlaying) {
        newAudio.play().catch(() => {
          console.log('Track change playback failed');
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrack, volume, isMuted]);

  const playTransitionSound = useCallback(async (type: 'whoosh' | 'swoosh' | 'pop' | 'chime' = 'whoosh') => {
    if (!audioContextRef.current || !masterGainRef.current) {
      return;
    }

    await resumeAudioContext();
    
    if (audioContextRef.current.state !== 'running') {
      return;
    }
    
    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(masterGainRef.current);
      
      const now = audioContextRef.current.currentTime;
      
      // Different sound effects for different transitions
      switch (type) {
        case 'whoosh':
          oscillator.frequency.setValueAtTime(800, now);
          oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.2);
          oscillator.type = 'sawtooth';
          gainNode.gain.setValueAtTime(0, now);
          gainNode.gain.linearRampToValueAtTime(0.2, now + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          oscillator.stop(now + 0.2);
          break;
          
        case 'swoosh':
          oscillator.frequency.setValueAtTime(1200, now);
          oscillator.frequency.exponentialRampToValueAtTime(300, now + 0.15);
          oscillator.type = 'triangle';
          gainNode.gain.setValueAtTime(0, now);
          gainNode.gain.linearRampToValueAtTime(0.15, now + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          oscillator.stop(now + 0.15);
          break;
          
        case 'pop':
          oscillator.frequency.setValueAtTime(400, now);
          oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.1);
          oscillator.type = 'square';
          gainNode.gain.setValueAtTime(0.25, now);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          oscillator.stop(now + 0.1);
          break;
          
        case 'chime':
          oscillator.frequency.setValueAtTime(1000, now);
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0, now);
          gainNode.gain.linearRampToValueAtTime(0.2, now + 0.02);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
          oscillator.stop(now + 0.3);
          break;
      }
      
      oscillator.start(now);
    } catch (error) {
      // Silently fail if oscillator creation fails
    }
  }, [resumeAudioContext]);

  const playElementSound = useCallback(async () => {
    if (!audioContextRef.current || !masterGainRef.current) {
      return;
    }

    await resumeAudioContext();
    
    if (audioContextRef.current.state !== 'running') {
      return;
    }
    
    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(masterGainRef.current);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      const now = audioContextRef.current.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.1, now + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      
      oscillator.start(now);
      oscillator.stop(now + 0.08);
    } catch (error) {
      // Silently fail if oscillator creation fails
    }
  }, [resumeAudioContext]);

  const playSpecialEffect = useCallback(async (effect: 'magic' | 'sparkle' | 'ding') => {
    if (!audioContextRef.current || !masterGainRef.current) {
      return;
    }

    await resumeAudioContext();
    
    if (audioContextRef.current.state !== 'running') {
      return;
    }
    
    try {
      const now = audioContextRef.current.currentTime;
      
      switch (effect) {
        case 'magic':
          // Ascending magical sparkle
          for (let i = 0; i < 3; i++) {
            const osc = audioContextRef.current.createOscillator();
            const gain = audioContextRef.current.createGain();
            osc.connect(gain);
            gain.connect(masterGainRef.current);
            
            osc.frequency.value = 800 + (i * 400);
            osc.type = 'sine';
            
            const startTime = now + (i * 0.05);
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.1, startTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);
            
            osc.start(startTime);
            osc.stop(startTime + 0.1);
          }
          break;
          
        case 'sparkle':
          // Quick high-pitched twinkle
          const sparkleOsc = audioContextRef.current.createOscillator();
          const sparkleGain = audioContextRef.current.createGain();
          sparkleOsc.connect(sparkleGain);
          sparkleGain.connect(masterGainRef.current);
          
          sparkleOsc.frequency.value = 1500;
          sparkleOsc.type = 'sine';
          
          sparkleGain.gain.setValueAtTime(0.12, now);
          sparkleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          
          sparkleOsc.start(now);
          sparkleOsc.stop(now + 0.15);
          break;
          
        case 'ding':
          // Pleasant notification ding
          const dingOsc = audioContextRef.current.createOscillator();
          const dingGain = audioContextRef.current.createGain();
          dingOsc.connect(dingGain);
          dingGain.connect(masterGainRef.current);
          
          dingOsc.frequency.value = 1200;
          dingOsc.type = 'sine';
          
          dingGain.gain.setValueAtTime(0, now);
          dingGain.gain.linearRampToValueAtTime(0.15, now + 0.02);
          dingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
          
          dingOsc.start(now);
          dingOsc.stop(now + 0.25);
          break;
      }
    } catch (error) {
      // Silently fail if oscillator creation fails
    }
  }, [resumeAudioContext]);

  const playPageNavigationSound = useCallback(async () => {
    if (isMuted) return;
    
    try {
      await resumeAudioContext();
      
      const audio = new Audio(pageTransitionSound);
      audio.volume = (volume / 100) * 0.6;
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise;
      }
    } catch (error) {
      console.log('Page navigation sound failed:', error);
    }
  }, [resumeAudioContext, volume, isMuted]);

  const value: AudioContextValue = {
    isPlaying,
    volume,
    isMuted,
    audioSupported,
    currentTrack,
    togglePlayback,
    setVolume,
    toggleMute,
    changeTrack,
    playTransitionSound,
    playElementSound,
    playSpecialEffect,
    playPageNavigationSound,
  };

  return (
    <AudioContextObj.Provider value={value}>
      {children}
    </AudioContextObj.Provider>
  );
}

export const useAudio = () => {
  const context = useContext(AudioContextObj);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};