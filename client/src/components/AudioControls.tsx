import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX, SkipForward } from "lucide-react";
import { useAudio } from "@/contexts/AudioContext";

interface AudioControlsProps {
  onSoundToggle?: (enabled: boolean) => void;
  className?: string;
}

export default function AudioControls({ onSoundToggle, className = "" }: AudioControlsProps) {
  const {
    isPlaying,
    volume,
    isMuted,
    audioSupported,
    togglePlayback,
    setVolume,
    toggleMute,
    changeTrack,
  } = useAudio();

  // Notify parent component about sound state changes
  useEffect(() => {
    if (onSoundToggle) {
      onSoundToggle(isPlaying && audioSupported);
    }
  }, [isPlaying, audioSupported, onSoundToggle]);

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume[0]);
  };

  if (!audioSupported) {
    return (
      <div className={`flex items-center gap-2 p-2 rounded-lg bg-background/80 backdrop-blur-sm border opacity-50 ${className}`} data-testid="audio-controls">
        <span className="text-xs text-muted-foreground">Audio not supported</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 p-2 rounded-lg bg-background/80 backdrop-blur-sm border ${className}`} data-testid="audio-controls">
      <Button
        size="sm"
        variant="ghost"
        onClick={togglePlayback}
        data-testid="button-audio-play"
        className="hover-elevate"
        title={isPlaying ? "Pause background music" : "Play background music"}
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </Button>

      <Button
        size="sm"
        variant="ghost"
        onClick={toggleMute}
        data-testid="button-audio-mute"
        className="hover-elevate"
        title={isMuted ? "Unmute audio" : "Mute audio"}
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </Button>

      <Button
        size="sm"
        variant="ghost"
        onClick={changeTrack}
        data-testid="button-change-track"
        className="hover-elevate"
        title="Change background music track"
      >
        <SkipForward className="w-4 h-4" />
      </Button>

      <div className="flex items-center gap-2 min-w-[100px]">
        <Slider
          value={[volume]}
          onValueChange={handleVolumeChange}
          max={100}
          step={1}
          className="flex-1"
          data-testid="slider-volume"
          disabled={isMuted}
        />
        <span className="text-xs text-muted-foreground w-8 text-right">
          {isMuted ? 'OFF' : `${volume}%`}
        </span>
      </div>
    </div>
  );
}