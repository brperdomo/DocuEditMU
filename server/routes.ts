import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDocumentSchema, insertDocumentPageSchema, insertParagraphSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get sample document (for root path)
  app.get("/api/documents", async (req, res) => {
    try {
      // Get the first document from storage (our sample document)
      const allDocuments = Array.from((storage as any).documents.values());
      const sampleDocument = allDocuments[0];
      if (!sampleDocument) {
        return res.status(404).json({ message: "No documents found" });
      }
      res.json(sampleDocument);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get document by ID
  app.get("/api/documents/:id", async (req, res) => {
    try {
      const document = await storage.getDocument(req.params.id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.json(document);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get document pages
  app.get("/api/documents/:id/pages", async (req, res) => {
    try {
      const pages = await storage.getDocumentPages(req.params.id);
      res.json(pages);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create new page
  app.post("/api/documents/:id/pages", async (req, res) => {
    try {
      const pageData = insertDocumentPageSchema.parse({
        ...req.body,
        documentId: req.params.id
      });
      const page = await storage.createDocumentPage(pageData);
      res.status(201).json(page);
    } catch (error) {
      res.status(400).json({ message: "Invalid page data" });
    }
  });

  // Delete page
  app.delete("/api/documents/:documentId/pages/:pageId", async (req, res) => {
    try {
      const success = await storage.deleteDocumentPage(req.params.pageId);
      if (!success) {
        return res.status(404).json({ message: "Page not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get paragraphs for a document
  app.get("/api/documents/:id/paragraphs", async (req, res) => {
    try {
      const paragraphs = await storage.getParagraphsByDocument(req.params.id);
      res.json(paragraphs);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create new paragraph
  app.post("/api/paragraphs", async (req, res) => {
    try {
      const paragraphData = insertParagraphSchema.parse(req.body);
      const paragraph = await storage.createParagraph(paragraphData);
      res.status(201).json(paragraph);
    } catch (error) {
      res.status(400).json({ message: "Invalid paragraph data" });
    }
  });

  // Update paragraph
  app.patch("/api/paragraphs/:id", async (req, res) => {
    try {
      const updates = req.body;
      const paragraph = await storage.updateParagraph(req.params.id, updates);
      if (!paragraph) {
        return res.status(404).json({ message: "Paragraph not found" });
      }
      res.json(paragraph);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete paragraph
  app.delete("/api/paragraphs/:id", async (req, res) => {
    try {
      const success = await storage.deleteParagraph(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Paragraph not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
