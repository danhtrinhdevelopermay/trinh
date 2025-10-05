import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPresentationSchema, insertSlideSchema, slideDataSchema } from "@shared/schema";
import { z } from "zod";
import { askGemini } from "./gemini";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication is now handled globally in index.ts
  
  // Presentation routes
  
  // GET /api/presentations - Get all presentations for a user
  app.get("/api/presentations", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }
      
      const presentations = await storage.getPresentationsByUserId(userId);
      res.json(presentations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch presentations" });
    }
  });

  // GET /api/presentations/:id - Get a specific presentation
  app.get("/api/presentations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const presentation = await storage.getPresentation(id);
      
      if (!presentation) {
        return res.status(404).json({ error: "Presentation not found" });
      }
      
      res.json(presentation);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch presentation" });
    }
  });

  // POST /api/presentations - Create a new presentation
  app.post("/api/presentations", async (req, res) => {
    try {
      const validatedData = insertPresentationSchema.parse(req.body);
      const presentation = await storage.createPresentation(validatedData);
      res.status(201).json(presentation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create presentation" });
    }
  });

  // PUT /api/presentations/:id - Update a presentation
  app.put("/api/presentations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = insertPresentationSchema.partial().parse(req.body);
      const presentation = await storage.updatePresentation(id, updates);
      
      if (!presentation) {
        return res.status(404).json({ error: "Presentation not found" });
      }
      
      res.json(presentation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update presentation" });
    }
  });

  // DELETE /api/presentations/:id - Delete a presentation
  app.delete("/api/presentations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deletePresentation(id);
      
      if (!success) {
        return res.status(404).json({ error: "Presentation not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete presentation" });
    }
  });

  // Slide routes
  
  // GET /api/presentations/:presentationId/slides - Get all slides for a presentation
  app.get("/api/presentations/:presentationId/slides", async (req, res) => {
    try {
      const { presentationId } = req.params;
      const slides = await storage.getSlidesByPresentationId(presentationId);
      
      // Transform slides to frontend format
      const slideData = slides.map(slide => {
        let content;
        try {
          // Try to parse as JSON array for bullet points
          const parsed = JSON.parse(slide.content);
          if (Array.isArray(parsed)) {
            content = parsed;
          } else {
            content = slide.content;
          }
        } catch {
          content = slide.content;
        }
        
        return {
          id: slide.id,
          type: slide.type,
          title: slide.title,
          content,
          background: slide.background,
        };
      });
      
      res.json(slideData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch slides" });
    }
  });

  // GET /api/slides/:id - Get a specific slide
  app.get("/api/slides/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const slide = await storage.getSlide(id);
      
      if (!slide) {
        return res.status(404).json({ error: "Slide not found" });
      }
      
      res.json(slide);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch slide" });
    }
  });

  // POST /api/presentations/:presentationId/slides - Create a new slide
  app.post("/api/presentations/:presentationId/slides", async (req, res) => {
    try {
      const { presentationId } = req.params;
      
      // Get the next order number
      const existingSlides = await storage.getSlidesByPresentationId(presentationId);
      const nextOrder = Math.max(0, ...existingSlides.map(s => s.order)) + 1;
      
      const slideData = {
        ...req.body,
        presentationId,
        order: nextOrder,
        content: typeof req.body.content === 'object' ? JSON.stringify(req.body.content) : req.body.content
      };
      
      const validatedData = insertSlideSchema.parse(slideData);
      const slide = await storage.createSlide(validatedData);
      res.status(201).json(slide);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create slide" });
    }
  });

  // PUT /api/slides/:id - Update a slide
  app.put("/api/slides/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = {
        ...req.body,
        content: typeof req.body.content === 'object' ? JSON.stringify(req.body.content) : req.body.content
      };
      const validatedUpdates = insertSlideSchema.partial().parse(updates);
      const slide = await storage.updateSlide(id, validatedUpdates);
      
      if (!slide) {
        return res.status(404).json({ error: "Slide not found" });
      }
      
      res.json(slide);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update slide" });
    }
  });

  // DELETE /api/slides/:id - Delete a slide
  app.delete("/api/slides/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteSlide(id);
      
      if (!success) {
        return res.status(404).json({ error: "Slide not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete slide" });
    }
  });

  // PUT /api/presentations/:presentationId/slides/reorder - Reorder slides
  app.put("/api/presentations/:presentationId/slides/reorder", async (req, res) => {
    try {
      const { presentationId } = req.params;
      const slideOrders = z.array(z.object({
        id: z.string(),
        order: z.number()
      })).parse(req.body);
      
      await storage.reorderSlides(presentationId, slideOrders);
      res.status(204).send();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to reorder slides" });
    }
  });

  // Gemini AI Chat route
  app.post("/api/gemini/ask", async (req, res) => {
    try {
      const { question } = req.body;
      
      if (!question || typeof question !== 'string') {
        return res.status(400).json({ error: "Question is required" });
      }
      
      const answer = await askGemini(question);
      res.json({ answer });
    } catch (error) {
      console.error("Gemini API error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to get AI response" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
