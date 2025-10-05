import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const presentations = pgTable("presentations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }), // Owner of the presentation
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const slides = pgTable("slides", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  presentationId: varchar("presentation_id").notNull().references(() => presentations.id, { onDelete: 'cascade' }),
  order: integer("order").notNull(), // Order of the slide in presentation
  type: text("type").notNull(), // 'title', 'content', 'quote'
  title: text("title").notNull(),
  content: text("content").notNull(), // JSON string for complex content
  background: text("background").notNull(), // CSS classes for background
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// User schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Presentation schemas
export const insertPresentationSchema = createInsertSchema(presentations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPresentation = z.infer<typeof insertPresentationSchema>;
export type Presentation = typeof presentations.$inferSelect;

// Slide schemas
export const insertSlideSchema = createInsertSchema(slides).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSlide = z.infer<typeof insertSlideSchema>;
export type Slide = typeof slides.$inferSelect;

// Element types for Morph transitions (PowerPoint-style)
// Base element with common properties
export const baseElementSchema = z.object({
  id: z.string(), // Unique ID for matching across slides
  type: z.enum(['text', 'image', 'shape', 'icon']),
  x: z.number(), // Position from left (percentage or pixels)
  y: z.number(), // Position from top (percentage or pixels)
  width: z.number(), // Width in pixels or percentage
  height: z.number(), // Height in pixels or percentage
  rotation: z.number().optional().default(0), // Rotation in degrees
  opacity: z.number().min(0).max(1).optional().default(1), // 0 to 1
  zIndex: z.number().optional().default(0), // Layer order
});

// Text element
export const textElementSchema = baseElementSchema.extend({
  type: z.literal('text'),
  text: z.string(),
  fontSize: z.number().optional().default(24), // in pixels
  fontWeight: z.string().optional().default('normal'), // 'normal', 'bold', '600', etc
  fontFamily: z.string().optional().default('inherit'),
  color: z.string().optional().default('#000000'), // hex color
  textAlign: z.enum(['left', 'center', 'right', 'justify']).optional().default('left'),
  lineHeight: z.number().optional().default(1.5),
});

// Image element
export const imageElementSchema = baseElementSchema.extend({
  type: z.literal('image'),
  src: z.string(), // Image URL or path
  alt: z.string().optional().default(''),
  objectFit: z.enum(['contain', 'cover', 'fill', 'none', 'scale-down']).optional().default('cover'),
  borderRadius: z.number().optional().default(0), // in pixels
});

// Shape element
export const shapeElementSchema = baseElementSchema.extend({
  type: z.literal('shape'),
  shapeType: z.enum(['rect', 'circle', 'ellipse', 'path']),
  fill: z.string().optional().default('#000000'), // hex color
  stroke: z.string().optional(), // hex color for border
  strokeWidth: z.number().optional().default(0), // border width in pixels
  borderRadius: z.number().optional().default(0), // for rect shapes
  svgPath: z.string().optional(), // for 'path' shapeType - SVG path data
});

// Icon element (special case of shape, but with icon library)
export const iconElementSchema = baseElementSchema.extend({
  type: z.literal('icon'),
  iconName: z.string(), // lucide-react icon name
  color: z.string().optional().default('#000000'),
  strokeWidth: z.number().optional().default(2),
});

// Union of all element types
export const slideElementSchema = z.discriminatedUnion('type', [
  textElementSchema,
  imageElementSchema,
  shapeElementSchema,
  iconElementSchema,
]);

// Slide content structure with elements
export const slideContentSchema = z.object({
  elements: z.array(slideElementSchema),
  background: z.string().default('educational-gradient-1'), // CSS classes
  textColor: z.string().default('text-gray-800'), // Default text color
});

// Export types
export type BaseElement = z.infer<typeof baseElementSchema>;
export type TextElement = z.infer<typeof textElementSchema>;
export type ImageElement = z.infer<typeof imageElementSchema>;
export type ShapeElement = z.infer<typeof shapeElementSchema>;
export type IconElement = z.infer<typeof iconElementSchema>;
export type SlideElement = z.infer<typeof slideElementSchema>;
export type SlideContent = z.infer<typeof slideContentSchema>;

// Frontend slide data type (matches existing mock data structure)
export const slideDataSchema = z.object({
  id: z.union([z.string(), z.number()]),
  type: z.enum(['title', 'content', 'quote', 'image']).optional(),
  title: z.string(),
  content: z.any(), // Can be string or React component
  background: z.string().optional(),
  textColor: z.string().optional(),
});

export type SlideData = z.infer<typeof slideDataSchema>;
