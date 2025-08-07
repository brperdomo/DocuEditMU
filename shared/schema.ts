import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  filename: text("filename").notNull(),
  ownerId: varchar("owner_id").references(() => users.id).notNull(),
  totalPages: integer("total_pages").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  status: text("status").notNull().default("draft"), // draft, published, completed
});

export const documentPages = pgTable("document_pages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  documentId: varchar("document_id").references(() => documents.id).notNull(),
  pageNumber: integer("page_number").notNull(),
  content: jsonb("content").notNull(), // Array of paragraph objects
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const paragraphs = pgTable("paragraphs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pageId: varchar("page_id").references(() => documentPages.id).notNull(),
  content: text("content").notNull(),
  orderIndex: integer("order_index").notNull(),
  isEditing: boolean("is_editing").default(false),
  formatting: jsonb("formatting"), // bold, italic, underline, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertDocumentSchema = createInsertSchema(documents).pick({
  title: true,
  filename: true,
  ownerId: true,
});

export const insertDocumentPageSchema = createInsertSchema(documentPages).pick({
  documentId: true,
  pageNumber: true,
  content: true,
});

export const insertParagraphSchema = createInsertSchema(paragraphs).pick({
  pageId: true,
  content: true,
  orderIndex: true,
  formatting: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertDocumentPage = z.infer<typeof insertDocumentPageSchema>;
export type DocumentPage = typeof documentPages.$inferSelect;
export type InsertParagraph = z.infer<typeof insertParagraphSchema>;
export type Paragraph = typeof paragraphs.$inferSelect;
