import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import type { SlideElement, TextElement, ImageElement, ShapeElement, IconElement, VideoElement } from "@shared/schema";
import * as Icons from "lucide-react";
import { Rocket3D, Star3D, Book3D, Trophy3D, Heart3D, Target3D } from "./3DElements";
import { ThreeJSModel } from "./ThreeJS3DModels";

interface SlideCanvasProps {
  elements: SlideElement[];
}

const MORPH_EASE = [0.4, 0, 0.2, 1] as const;
const SMOOTH_EASE = [0.25, 0.46, 0.45, 0.94] as const;
const ENTRANCE_EASE = [0.34, 1.56, 0.64, 1] as const;
const SPRING_CONFIG = {
  type: "spring" as const,
  stiffness: 260,
  damping: 26,
};
const SMOOTH_SPRING = {
  type: "spring" as const,
  stiffness: 200,
  damping: 22,
};

function TextElementRenderer({ element, index }: { element: TextElement; index: number }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <motion.div
        layoutId={element.id}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: element.opacity,
          x: element.x,
          y: element.y,
          width: element.width,
          height: element.height,
          rotate: element.rotation,
        }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{
          position: 'absolute',
          color: element.color,
          fontSize: element.fontSize,
          fontWeight: element.fontWeight,
          fontFamily: element.fontFamily,
          textAlign: element.textAlign,
          lineHeight: element.lineHeight,
          zIndex: element.zIndex,
          display: 'flex',
          alignItems: 'center',
          justifyContent: element.textAlign === 'center' ? 'center' : element.textAlign === 'right' ? 'flex-end' : 'flex-start',
        }}
        data-testid={`text-element-${element.id}`}
      >
        {element.text}
      </motion.div>
    );
  }

  return (
    <motion.div
      layoutId={element.id}
      layout
      initial={{ 
        opacity: 0,
        scale: 0.92,
      }}
      animate={{ 
        opacity: element.opacity,
        scale: 1,
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
        rotate: element.rotation,
      }}
      exit={{ 
        opacity: 0,
        scale: 0.96,
      }}
      transition={{
        layout: { duration: 0.7, ease: MORPH_EASE },
        opacity: { delay: index * 0.08, duration: 0.7, ease: SMOOTH_EASE },
        scale: { delay: index * 0.08, duration: 0.7, ease: SMOOTH_EASE },
        x: { duration: 0.7, ease: MORPH_EASE },
        y: { duration: 0.7, ease: MORPH_EASE },
        width: { duration: 0.7, ease: MORPH_EASE },
        height: { duration: 0.7, ease: MORPH_EASE },
        color: { duration: 0.7, ease: MORPH_EASE },
        fontSize: { duration: 0.7, ease: MORPH_EASE },
      }}
      style={{
        position: 'absolute',
        color: element.color,
        fontSize: element.fontSize,
        fontWeight: element.fontWeight,
        fontFamily: element.fontFamily,
        textAlign: element.textAlign,
        lineHeight: element.lineHeight,
        zIndex: element.zIndex,
        display: 'flex',
        alignItems: 'center',
        justifyContent: element.textAlign === 'center' ? 'center' : element.textAlign === 'right' ? 'flex-end' : 'flex-start',
      }}
      data-testid={`text-element-${element.id}`}
    >
      <motion.span
        className="kawaii-text-3d"
        animate={{ 
          color: element.color,
        }}
        transition={{ duration: 0.6, ease: MORPH_EASE }}
      >
        {element.text}
      </motion.span>
    </motion.div>
  );
}

function ImageElementRenderer({ element, index }: { element: ImageElement; index: number }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <motion.img
        layoutId={element.id}
        src={element.src}
        alt={element.alt}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: element.opacity,
          x: element.x,
          y: element.y,
          width: element.width,
          height: element.height,
          rotate: element.rotation,
        }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{
          position: 'absolute',
          objectFit: element.objectFit,
          objectPosition: (element as any).objectPosition || 'center center',
          borderRadius: `${element.borderRadius}px`,
          zIndex: element.zIndex,
        }}
        data-testid={`image-element-${element.id}`}
      />
    );
  }

  return (
    <motion.img
      layoutId={element.id}
      layout
      src={element.src}
      alt={element.alt}
      initial={{ 
        opacity: 0, 
        scale: 0.88,
        filter: "blur(12px)",
        rotateY: -8,
      }}
      animate={{ 
        opacity: element.opacity,
        scale: 1,
        filter: "blur(0px)",
        rotateY: 0,
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
        rotate: element.rotation,
      }}
      exit={{ 
        opacity: 0,
        scale: 0.92,
        filter: "blur(6px)",
        rotateY: 6,
      }}
      transition={{
        layout: { duration: 0.7, ease: MORPH_EASE },
        opacity: { delay: index * 0.12, duration: 0.8, ease: SMOOTH_EASE },
        scale: { delay: index * 0.12, duration: 0.8, ease: SMOOTH_EASE },
        filter: { delay: index * 0.12, duration: 0.8, ease: SMOOTH_EASE },
        rotateY: { delay: index * 0.12, duration: 0.8, ease: ENTRANCE_EASE },
      }}
      style={{
        position: 'absolute',
        objectFit: element.objectFit,
        objectPosition: (element as any).objectPosition || 'center center',
        borderRadius: `${element.borderRadius}px`,
        zIndex: element.zIndex,
      }}
      data-testid={`image-element-${element.id}`}
    />
  );
}

function ShapeElementRenderer({ element, index }: { element: ShapeElement; index: number }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <motion.div
        layoutId={element.id}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: element.opacity,
          x: element.x,
          y: element.y,
          width: element.width,
          height: element.height,
          rotate: element.rotation,
        }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{
          position: 'absolute',
          zIndex: element.zIndex,
        }}
        data-testid={`shape-element-${element.id}`}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: element.fill,
            borderRadius: element.shapeType === 'circle' || element.shapeType === 'ellipse' ? '50%' : `${element.borderRadius}px`,
            border: element.stroke ? `${element.strokeWidth}px solid ${element.stroke}` : undefined,
          }}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      layoutId={element.id}
      layout
      initial={{ 
        opacity: 0, 
        scale: 0.2,
        rotate: -15,
      }}
      animate={{ 
        opacity: element.opacity,
        scale: 1,
        rotate: 0,
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
      }}
      exit={{ 
        opacity: 0,
        scale: 0.4,
        rotate: 10,
      }}
      transition={{
        layout: { duration: 0.7, ease: MORPH_EASE },
        opacity: { delay: index * 0.06, ...SMOOTH_SPRING },
        scale: { delay: index * 0.06, ...SMOOTH_SPRING },
        rotate: { delay: index * 0.06, duration: 0.7, ease: ENTRANCE_EASE },
      }}
      style={{
        position: 'absolute',
        zIndex: element.zIndex,
      }}
      data-testid={`shape-element-${element.id}`}
    >
      {element.shapeType === 'path' && element.svgPath ? (
        <svg width={element.width} height={element.height} viewBox={`0 0 ${element.width} ${element.height}`}>
          <motion.path
            d={element.svgPath}
            fill={element.fill}
            stroke={element.stroke}
            strokeWidth={element.strokeWidth}
            animate={{ d: element.svgPath, fill: element.fill }}
            transition={{ duration: 0.6, ease: MORPH_EASE }}
          />
        </svg>
      ) : (
        <motion.div
          initial={{ 
            borderRadius: element.shapeType === 'circle' || element.shapeType === 'ellipse' ? '50%' : `${element.borderRadius}px`,
            backgroundColor: element.fill 
          }}
          animate={{
            borderRadius: element.shapeType === 'circle' || element.shapeType === 'ellipse' ? '50%' : `${element.borderRadius}px`,
            backgroundColor: element.fill,
          }}
          transition={{ duration: 0.6, ease: MORPH_EASE }}
          style={{
            width: '100%',
            height: '100%',
            border: element.stroke ? `${element.strokeWidth}px solid ${element.stroke}` : undefined,
          }}
        />
      )}
    </motion.div>
  );
}

function IconElementRenderer({ element, index }: { element: IconElement; index: number }) {
  const shouldReduceMotion = useReducedMotion();
  
  // Get icon component from lucide-react
  const IconComponent = (Icons as any)[element.iconName] || Icons.HelpCircle;

  if (shouldReduceMotion) {
    return (
      <motion.div
        layoutId={element.id}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: element.opacity,
          x: element.x,
          y: element.y,
          rotate: element.rotation,
        }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{
          position: 'absolute',
          zIndex: element.zIndex,
          color: element.color,
        }}
        data-testid={`icon-element-${element.id}`}
      >
        <IconComponent 
          size={element.width}
          strokeWidth={element.strokeWidth}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      layoutId={element.id}
      layout
      className="kawaii-sparkle"
      initial={{ 
        opacity: 0, 
        scale: 0,
        rotate: -240,
        y: -30,
      }}
      animate={{ 
        opacity: element.opacity,
        scale: [0, 1.15, 1],
        rotate: element.rotation,
        y: 0,
        x: element.x,
      }}
      exit={{ 
        opacity: 0,
        scale: 0,
        rotate: 120,
        y: 20,
      }}
      transition={{
        layout: { duration: 0.7, ease: MORPH_EASE },
        opacity: { delay: index * 0.1, duration: 0.6, ease: SMOOTH_EASE },
        scale: { 
          delay: index * 0.1, 
          duration: 0.8, 
          ease: ENTRANCE_EASE,
          times: [0, 0.7, 1]
        },
        rotate: { delay: index * 0.1, duration: 0.75, ease: ENTRANCE_EASE },
        y: { delay: index * 0.1, duration: 0.75, ease: ENTRANCE_EASE },
      }}
      style={{
        position: 'absolute',
        zIndex: element.zIndex,
      }}
      data-testid={`icon-element-${element.id}`}
    >
      <motion.div
        animate={{ 
          color: element.color,
          scale: element.width / 64,
        }}
        transition={{ 
          color: { duration: 0.6, ease: MORPH_EASE },
          scale: { duration: 0.6, ease: MORPH_EASE },
        }}
        style={{ color: element.color }}
      >
        <IconComponent 
          size={64}
          strokeWidth={element.strokeWidth}
        />
      </motion.div>
    </motion.div>
  );
}

function VideoElementRenderer({ element, index }: { element: VideoElement; index: number }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <motion.div
        layoutId={element.id}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: element.opacity,
          x: element.x,
          y: element.y,
          width: element.width,
          height: element.height,
          rotate: element.rotation,
        }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{
          position: 'absolute',
          zIndex: element.zIndex,
        }}
        data-testid={`video-element-${element.id}`}
      >
        <video
          src={element.src}
          poster={element.poster}
          autoPlay={element.autoplay}
          loop={element.loop}
          muted={element.muted}
          controls={element.controls}
          preload="auto"
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: element.objectFit,
          }}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      layoutId={element.id}
      layout
      initial={{ 
        opacity: 0, 
        scale: 0.88,
        filter: "blur(12px)",
        rotateY: -8,
      }}
      animate={{ 
        opacity: element.opacity,
        scale: 1,
        filter: "blur(0px)",
        rotateY: 0,
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
        rotate: element.rotation,
      }}
      exit={{ 
        opacity: 0,
        scale: 0.92,
        filter: "blur(6px)",
        rotateY: 6,
      }}
      transition={{
        layout: { duration: 0.7, ease: MORPH_EASE },
        opacity: { delay: index * 0.12, duration: 0.8, ease: SMOOTH_EASE },
        scale: { delay: index * 0.12, duration: 0.8, ease: SMOOTH_EASE },
        filter: { delay: index * 0.12, duration: 0.8, ease: SMOOTH_EASE },
        rotateY: { delay: index * 0.12, duration: 0.8, ease: ENTRANCE_EASE },
      }}
      style={{
        position: 'absolute',
        zIndex: element.zIndex,
      }}
      data-testid={`video-element-${element.id}`}
    >
      <video
        src={element.src}
        poster={element.poster}
        autoPlay={element.autoplay}
        loop={element.loop}
        muted={element.muted}
        controls={element.controls}
        preload="auto"
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: element.objectFit,
        }}
      />
    </motion.div>
  );
}

// 3D Model element renderer
function Model3DRenderer({ element }: { element: any }) {
  const modelType = element.modelType || 'star';
  
  switch (modelType) {
    case 'rocket':
      return <Rocket3D x={element.x} y={element.y} size={element.width} />;
    case 'star':
      return <Star3D x={element.x} y={element.y} size={element.width} />;
    case 'book':
      return <Book3D x={element.x} y={element.y} size={element.width} />;
    case 'trophy':
      return <Trophy3D x={element.x} y={element.y} size={element.width} />;
    case 'heart':
      return <Heart3D x={element.x} y={element.y} size={element.width} />;
    case 'target':
      return <Target3D x={element.x} y={element.y} size={element.width} />;
    case 'mountain':
    case 'brain':
    case 'lightbulb':
    case 'stairs':
    case 'globe':
    case 'path':
      return (
        <ThreeJSModel
          modelType={modelType}
          x={element.x}
          y={element.y}
          width={element.width}
          height={element.height}
          rotation={element.rotation}
        />
      );
    default:
      return <Star3D x={element.x} y={element.y} size={element.width} />;
  }
}

export default function SlideCanvas({ elements }: SlideCanvasProps) {
  return (
    <>
      {elements.map((element, index) => {
        switch (element.type) {
          case 'text':
            return <TextElementRenderer key={element.id} element={element} index={index} />;
          case 'image':
            return <ImageElementRenderer key={element.id} element={element} index={index} />;
          case 'shape':
            return <ShapeElementRenderer key={element.id} element={element} index={index} />;
          case 'icon':
            return <IconElementRenderer key={element.id} element={element} index={index} />;
          case 'video':
            return <VideoElementRenderer key={element.id} element={element} index={index} />;
          case 'model3d' as any:
            return <Model3DRenderer key={element.id} element={element} />;
          default:
            return null;
        }
      })}
    </>
  );
}
