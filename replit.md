# Document Editor Application

## Overview

This is a full-stack document editor application built with React (frontend) and Express.js (backend). The application provides a collaborative document editing experience similar to DocuSign, allowing users to create, edit, and manage documents with multiple pages and paragraphs. The interface includes features like page thumbnails, document toolbars, floating edit toolbars, and real-time content editing capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod for validation
- **Design System**: Custom DocuSign-inspired color scheme with Inter font family

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API structure with routes for documents, pages, and paragraphs
- **Storage Layer**: Abstracted storage interface with in-memory implementation (MemStorage class)
- **Development Setup**: Hot reload with Vite integration for seamless development experience
- **Error Handling**: Centralized error handling middleware with structured error responses

### Data Storage Solutions
- **Database**: PostgreSQL configured through Drizzle ORM
- **Schema Design**: 
  - Users table for authentication
  - Documents table for document metadata
  - Document pages table for page-level content
  - Paragraphs table for granular text content with formatting support
- **Connection**: Neon Database serverless PostgreSQL integration
- **Migration Management**: Drizzle Kit for schema migrations

### Authentication and Authorization
- **Session Management**: PostgreSQL session store using connect-pg-simple
- **User Model**: Username/password based authentication system
- **Authorization**: Owner-based document access control

### Component Architecture
- **UI Components**: Comprehensive shadcn/ui component library including dialogs, forms, buttons, etc.
- **Custom Components**: 
  - Document viewer with zoom and navigation controls
  - Editable paragraph components with inline editing
  - Floating toolbars for text formatting
  - Page thumbnail sidebar for navigation
  - Document-specific toolbar with save/publish actions
- **Layout**: Responsive design with sidebar, main content area, and header navigation

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form, React Query
- **UI Framework**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS, Class Variance Authority for component variants
- **Icons**: Font Awesome and Lucide React icons
- **Utilities**: Date-fns for date manipulation, clsx for conditional styling

### Backend Dependencies
- **Server Framework**: Express.js with CORS and body parsing middleware
- **Database**: Drizzle ORM with PostgreSQL dialect, Neon serverless driver
- **Development Tools**: tsx for TypeScript execution, esbuild for production builds
- **Session Management**: Express session with PostgreSQL store

### Development Tools
- **Build System**: Vite with React plugin and runtime error overlay
- **TypeScript**: Full TypeScript support across client, server, and shared code
- **Linting/Formatting**: ESLint and Prettier configurations
- **Database Management**: Drizzle Kit for migrations and schema management
- **Development Tools**: Optimized development environment configuration
- **Deployment**: Multi-platform deployment support (Vercel, Render, Docker)