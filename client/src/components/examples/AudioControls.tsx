import AudioControls from '../AudioControls';

export default function AudioControlsExample() {
  return (
    <div className="p-8 bg-background min-h-screen flex items-center justify-center">
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Audio Controls</h2>
          <p className="text-muted-foreground">Điều khiển âm thanh cho presentation</p>
        </div>
        
        <AudioControls 
          onSoundToggle={(enabled) => console.log('Sound enabled:', enabled)}
        />
      </div>
    </div>
  );
}