import { motion } from "framer-motion";
import { ReactNode, useEffect, useRef } from "react";
import { useAudio } from "@/contexts/AudioContext";

interface AnimatedContentProps {
  children: ReactNode;
  index: number;
  enableSound?: boolean;
}

export function AnimatedContentItem({ children, index, enableSound = false }: AnimatedContentProps) {
  const { playElementSound } = useAudio();
  const hasPlayedSound = useRef(false);

  useEffect(() => {
    if (enableSound && !hasPlayedSound.current) {
      const timeout = setTimeout(() => {
        playElementSound();
        hasPlayedSound.current = true;
      }, 200 + index * 150);

      return () => clearTimeout(timeout);
    }
  }, [enableSound, index, playElementSound]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{
        delay: 0.2 + index * 0.15,
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedListProps {
  items: ReactNode[];
  enableSound?: boolean;
}

export function AnimatedList({ items, enableSound = false }: AnimatedListProps) {
  return (
    <div className="space-y-6 text-left max-w-4xl">
      {items.map((item, index) => (
        <AnimatedContentItem key={index} index={index} enableSound={enableSound}>
          {item}
        </AnimatedContentItem>
      ))}
    </div>
  );
}
