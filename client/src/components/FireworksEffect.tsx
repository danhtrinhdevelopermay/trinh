import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

export function FireworksEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 675;

    const particles: Particle[] = [];
    const colors = [
      '#FF6B9D', '#C239B3', '#4D96A9', '#6BCB77', '#FFD93D',
      '#FF6B6B', '#FFA500', '#00D9FF', '#FF1493', '#FFD700',
      '#FF69B4', '#FF4500', '#32CD32', '#FF8C00', '#9370DB'
    ];

    let animationFrameId: number;
    let lastFireworkTime = 0;

    const createFirework = (x: number, y: number) => {
      const particleCount = 60 + Math.random() * 40;
      const baseColor = colors[Math.floor(Math.random() * colors.length)];
      
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const speed = 2 + Math.random() * 4;
        
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          color: Math.random() > 0.3 ? baseColor : colors[Math.floor(Math.random() * colors.length)],
          size: 2 + Math.random() * 3,
        });
      }
    };

    const animate = (timestamp: number) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (timestamp - lastFireworkTime > 800 + Math.random() * 400) {
        const x = 200 + Math.random() * 800;
        const y = 100 + Math.random() * 300;
        createFirework(x, y);
        lastFireworkTime = timestamp;
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.life -= 0.01;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = p.color;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
        
        if (Math.random() > 0.95) {
          ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
        }
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(animate);
    };

    createFirework(600, 200);
    createFirework(400, 250);
    createFirework(800, 180);
    
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
