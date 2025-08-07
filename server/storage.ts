import { type User, type InsertUser, type Document, type InsertDocument, type DocumentPage, type InsertDocumentPage, type Paragraph, type InsertParagraph } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getDocument(id: string): Promise<Document | undefined>;
  getDocumentsByOwner(ownerId: string): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: string, updates: Partial<Document>): Promise<Document | undefined>;
  deleteDocument(id: string): Promise<boolean>;
  
  getDocumentPages(documentId: string): Promise<DocumentPage[]>;
  getDocumentPage(pageId: string): Promise<DocumentPage | undefined>;
  createDocumentPage(page: InsertDocumentPage): Promise<DocumentPage>;
  updateDocumentPage(id: string, updates: Partial<DocumentPage>): Promise<DocumentPage | undefined>;
  deleteDocumentPage(id: string): Promise<boolean>;
  
  getParagraphsByDocument(documentId: string): Promise<Paragraph[]>;
  getParagraphsByPage(pageId: string): Promise<Paragraph[]>;
  getParagraph(id: string): Promise<Paragraph | undefined>;
  createParagraph(paragraph: InsertParagraph): Promise<Paragraph>;
  updateParagraph(id: string, updates: Partial<Paragraph>): Promise<Paragraph | undefined>;
  deleteParagraph(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private documents: Map<string, Document>;
  private documentPages: Map<string, DocumentPage>;
  private paragraphs: Map<string, Paragraph>;

  constructor() {
    this.users = new Map();
    this.documents = new Map();
    this.documentPages = new Map();
    this.paragraphs = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample user
    const userId = randomUUID();
    const user: User = {
      id: userId,
      username: "demo_user",
      password: "password123"
    };
    this.users.set(userId, user);

    // Create sample document
    const documentId = randomUUID();
    const document: Document = {
      id: documentId,
      title: "Service Agreement Contract",
      filename: "Contract_Agreement_v3.pdf",
      ownerId: userId,
      totalPages: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "draft"
    };
    this.documents.set(documentId, document);

    // Create sample pages
    for (let i = 1; i <= 3; i++) {
      const pageId = randomUUID();
      const page: DocumentPage = {
        id: pageId,
        documentId,
        pageNumber: i,
        content: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.documentPages.set(pageId, page);

      // Create sample paragraphs for each page
      const paragraphContents = i === 1 ? [
        "<strong>1. PARTIES</strong><br><br>This Agreement is entered into between the Service Provider and the Client as identified in the signature section below.",
        "<strong>1.1 SERVICE PROVIDER</strong><br><br>The Service Provider agrees to perform the services outlined in this agreement with professional competence and in accordance with the highest standards of the industry."
      ] : i === 2 ? [
        "<strong>2. SCOPE OF SERVICES</strong><br><br>This Agreement outlines the professional services to be provided by the Service Provider to the Client. The services include but are not limited to consulting, implementation, and ongoing support for digital transformation initiatives.",
        "The Service Provider agrees to maintain the highest standards of professional conduct and confidentiality throughout the duration of this agreement. All work performed shall be completed in accordance with industry best practices and applicable regulatory requirements.",
        "<strong>3. PAYMENT TERMS</strong><br><br>Payment for services rendered under this Agreement shall be made according to the schedule outlined in Exhibit B. All invoices are due within thirty (30) days of receipt unless otherwise specified."
      ] : [
        "<strong>4. INTELLECTUAL PROPERTY</strong><br><br>All intellectual property rights in any work product created or developed by the Service Provider in the course of providing services under this Agreement shall remain the exclusive property of the Client, unless otherwise specified in writing.",
        "<strong>5. TERMINATION</strong><br><br>Either party may terminate this Agreement with thirty (30) days written notice to the other party. Upon termination, all work product and materials shall be delivered to the Client."
      ];

      paragraphContents.forEach((content, index) => {
        const paragraphId = randomUUID();
        const paragraph: Paragraph = {
          id: paragraphId,
          pageId,
          content,
          orderIndex: index,
          isEditing: false,
          formatting: null,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        this.paragraphs.set(paragraphId, paragraph);
      });
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getDocument(id: string): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async getDocumentsByOwner(ownerId: string): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(doc => doc.ownerId === ownerId);
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = randomUUID();
    const document: Document = {
      ...insertDocument,
      id,
      totalPages: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "draft"
    };
    this.documents.set(id, document);
    return document;
  }

  async updateDocument(id: string, updates: Partial<Document>): Promise<Document | undefined> {
    const document = this.documents.get(id);
    if (!document) return undefined;
    
    const updatedDocument = { ...document, ...updates, updatedAt: new Date() };
    this.documents.set(id, updatedDocument);
    return updatedDocument;
  }

  async deleteDocument(id: string): Promise<boolean> {
    return this.documents.delete(id);
  }

  async getDocumentPages(documentId: string): Promise<DocumentPage[]> {
    return Array.from(this.documentPages.values())
      .filter(page => page.documentId === documentId)
      .sort((a, b) => a.pageNumber - b.pageNumber);
  }

  async getDocumentPage(pageId: string): Promise<DocumentPage | undefined> {
    return this.documentPages.get(pageId);
  }

  async createDocumentPage(insertPage: InsertDocumentPage): Promise<DocumentPage> {
    const id = randomUUID();
    const page: DocumentPage = {
      ...insertPage,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.documentPages.set(id, page);
    
    // Update document total pages
    const document = this.documents.get(insertPage.documentId);
    if (document) {
      await this.updateDocument(document.id, { 
        totalPages: Math.max(document.totalPages, insertPage.pageNumber) 
      });
    }
    
    return page;
  }

  async updateDocumentPage(id: string, updates: Partial<DocumentPage>): Promise<DocumentPage | undefined> {
    const page = this.documentPages.get(id);
    if (!page) return undefined;
    
    const updatedPage = { ...page, ...updates, updatedAt: new Date() };
    this.documentPages.set(id, updatedPage);
    return updatedPage;
  }

  async deleteDocumentPage(id: string): Promise<boolean> {
    const page = this.documentPages.get(id);
    if (!page) return false;
    
    // Delete associated paragraphs
    const pageParagraphs = Array.from(this.paragraphs.values()).filter(p => p.pageId === id);
    pageParagraphs.forEach(p => this.paragraphs.delete(p.id));
    
    return this.documentPages.delete(id);
  }

  async getParagraphsByDocument(documentId: string): Promise<Paragraph[]> {
    const pages = await this.getDocumentPages(documentId);
    const pageIds = pages.map(p => p.id);
    return Array.from(this.paragraphs.values())
      .filter(paragraph => pageIds.includes(paragraph.pageId))
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }

  async getParagraphsByPage(pageId: string): Promise<Paragraph[]> {
    return Array.from(this.paragraphs.values())
      .filter(paragraph => paragraph.pageId === pageId)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }

  async getParagraph(id: string): Promise<Paragraph | undefined> {
    return this.paragraphs.get(id);
  }

  async createParagraph(insertParagraph: InsertParagraph): Promise<Paragraph> {
    const id = randomUUID();
    const paragraph: Paragraph = {
      ...insertParagraph,
      id,
      isEditing: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.paragraphs.set(id, paragraph);
    return paragraph;
  }

  async updateParagraph(id: string, updates: Partial<Paragraph>): Promise<Paragraph | undefined> {
    const paragraph = this.paragraphs.get(id);
    if (!paragraph) return undefined;
    
    const updatedParagraph = { ...paragraph, ...updates, updatedAt: new Date() };
    this.paragraphs.set(id, updatedParagraph);
    return updatedParagraph;
  }

  async deleteParagraph(id: string): Promise<boolean> {
    return this.paragraphs.delete(id);
  }
}

export const storage = new MemStorage();
