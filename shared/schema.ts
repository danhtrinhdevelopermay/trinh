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

// Frontend slide data type (matches existing mock data structure)
export const slideDataSchema = z.object({
  id: z.union([z.string(), z.number()]),
  type: z.enum(['title', 'content', 'quote']),
  title: z.string(),
  content: z.any(), // Can be string or React component
  background: z.string(),
});

export type SlideData = z.infer<typeof slideDataSchema>;
