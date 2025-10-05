import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import type { SlideElement, TextElement, ImageElement, ShapeElement, IconElement } from "@shared/schema";
import * as Icons from "lucide-react";

interface SlideCanvasProps {
  elements: SlideElement[];
}

const MORPH_EASE = [0.4, 0, 0.2, 1] as const;
const SPRING_CONFIG = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
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
        scale: 0.95,
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
        scale: 0.98,
      }}
      transition={{
        layout: { duration: 0.6, ease: MORPH_EASE },
        opacity: { delay: index * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
        scale: { delay: index * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
        x: { duration: 0.6, ease: MORPH_EASE },
        y: { duration: 0.6, ease: MORPH_EASE },
        width: { duration: 0.6, ease: MORPH_EASE },
        height: { duration: 0.6, ease: MORPH_EASE },
        color: { duration: 0.6, ease: MORPH_EASE },
        fontSize: { duration: 0.6, ease: MORPH_EASE },
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
        transition={{ duration: 0.5, ease: MORPH_EASE }}
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
        scale: 0.85,
        filter: "blur(10px)",
      }}
      animate={{ 
        opacity: element.opacity,
        scale: 1,
        filter: "blur(0px)",
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
        rotate: element.rotation,
      }}
      exit={{ 
        opacity: 0,
        scale: 0.9,
        filter: "blur(8px)",
      }}
      transition={{
        layout: { duration: 0.6, ease: MORPH_EASE },
        opacity: { delay: index * 0.15, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
        scale: { delay: index * 0.15, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
        filter: { delay: index * 0.15, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
      }}
      style={{
        position: 'absolute',
        objectFit: element.objectFit,
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
        scale: 0.3,
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
        scale: 0.5,
      }}
      transition={{
        layout: { duration: 0.6, ease: MORPH_EASE },
        opacity: { delay: index * 0.08, ...SPRING_CONFIG, stiffness: 250 },
        scale: { delay: index * 0.08, ...SPRING_CONFIG, stiffness: 250 },
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
        rotate: -180,
      }}
      animate={{ 
        opacity: element.opacity,
        scale: 1,
        rotate: element.rotation,
        x: element.x,
        y: element.y,
      }}
      exit={{ 
        opacity: 0,
        scale: 0,
        rotate: 90,
      }}
      transition={{
        layout: { duration: 0.6, ease: MORPH_EASE },
        opacity: { delay: index * 0.12, ...SPRING_CONFIG, stiffness: 400 },
        scale: { delay: index * 0.12, ...SPRING_CONFIG, stiffness: 400 },
        rotate: { delay: index * 0.12, ...SPRING_CONFIG, stiffness: 400 },
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
          default:
            return null;
        }
      })}
    </>
  );
}
