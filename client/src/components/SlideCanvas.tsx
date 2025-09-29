import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import type { SlideElement, TextElement, ImageElement, ShapeElement, IconElement } from "@shared/schema";
import * as Icons from "lucide-react";

interface SlideCanvasProps {
  elements: SlideElement[];
}

const MORPH_EASE = [0.4, 0, 0.2, 1] as const;

function TextElementRenderer({ element }: { element: TextElement }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      layoutId={element.id}
      layout={!shouldReduceMotion}
      initial={{ opacity: 0, color: element.color, fontSize: element.fontSize }}
      animate={{ 
        opacity: element.opacity,
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
        rotate: element.rotation,
        color: element.color,
        fontSize: element.fontSize,
      }}
      exit={{ opacity: 0 }}
      transition={{
        layout: { duration: 0.6, ease: MORPH_EASE },
        opacity: { duration: 0.4, ease: MORPH_EASE },
        color: { duration: 0.6, ease: MORPH_EASE },
        fontSize: { duration: 0.6, ease: MORPH_EASE },
      }}
      style={{
        position: 'absolute',
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

function ImageElementRenderer({ element }: { element: ImageElement }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.img
      layoutId={element.id}
      layout={!shouldReduceMotion}
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
      transition={{
        layout: { duration: 0.6, ease: MORPH_EASE },
        opacity: { duration: 0.4, ease: MORPH_EASE },
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

function ShapeElementRenderer({ element }: { element: ShapeElement }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      layoutId={element.id}
      layout={!shouldReduceMotion}
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
      transition={{
        layout: { duration: 0.6, ease: MORPH_EASE },
        opacity: { duration: 0.4, ease: MORPH_EASE },
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

function IconElementRenderer({ element }: { element: IconElement }) {
  const shouldReduceMotion = useReducedMotion();
  
  // Get icon component from lucide-react
  const IconComponent = (Icons as any)[element.iconName] || Icons.HelpCircle;

  return (
    <motion.div
      layoutId={element.id}
      layout={!shouldReduceMotion}
      initial={{ opacity: 0, scale: 1 }}
      animate={{ 
        opacity: element.opacity,
        x: element.x,
        y: element.y,
        rotate: element.rotation,
        scale: element.width / 64, // Assuming 64 is base icon size
      }}
      exit={{ opacity: 0 }}
      transition={{
        layout: { duration: 0.6, ease: MORPH_EASE },
        opacity: { duration: 0.4, ease: MORPH_EASE },
        scale: { duration: 0.6, ease: MORPH_EASE },
        rotate: { duration: 0.6, ease: MORPH_EASE },
      }}
      style={{
        position: 'absolute',
        zIndex: element.zIndex,
      }}
      data-testid={`icon-element-${element.id}`}
    >
      <motion.div
        animate={{ color: element.color }}
        transition={{ duration: 0.6, ease: MORPH_EASE }}
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
    <AnimatePresence mode="sync">
      {elements.map((element) => {
        switch (element.type) {
          case 'text':
            return <TextElementRenderer key={element.id} element={element} />;
          case 'image':
            return <ImageElementRenderer key={element.id} element={element} />;
          case 'shape':
            return <ShapeElementRenderer key={element.id} element={element} />;
          case 'icon':
            return <IconElementRenderer key={element.id} element={element} />;
          default:
            return null;
        }
      })}
    </AnimatePresence>
  );
}
