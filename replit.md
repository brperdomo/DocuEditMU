# PDF Overlay Editor Application

## Overview

This is a comprehensive PDF overlay editor built with React (frontend) and Express.js (backend) that replicates DocuSign's UI/design/feel. The application focuses on PDF overlay functionality where users can drag and drop form fields (signatures, dates, text inputs, etc.) to precise positions on uploaded PDF documents. This creates a layer-based editing system for contract preparation similar to DocuSign's field placement capabilities.

## Recent Changes (August 12, 2025)

- ✅ Successfully resolved PDF.js worker configuration issues with inline blob worker
- ✅ Built complete PDF overlay editor with drag/drop field positioning system  
- ✅ Implemented 8 field types: signature, date, name, initial, text, email, job title, checkbox
- ✅ Added properties panel for field configuration (position, size, assignee, required status)
- ✅ Integrated multi-signer support with color-coded indicators
- ✅ Applied DocuSign Olive design system with authentic 2024 color palette
- ✅ Added export functionality for field configurations
- ✅ Configured for deployment on multiple platforms (Vercel, Render, Docker)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **PDF Processing**: React-PDF with PDF.js for document rendering and interaction
- **Drag/Drop System**: @dnd-kit for precise field positioning with collision detection
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod for validation
- **Design System**: DocuSign Olive design system with authentic 2024 color palette (#0066CC blue, #4B4B4D charcoal)

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
- **PDF Components**: 
  - PDFFieldOverlay: Main PDF viewer with overlay field management
  - DraggableField: Individual form field components with drag functionality
  - PDFFieldPalette: Tool palette with 8 different field types
  - Properties panel: Field configuration interface for position, size, assignee
- **Custom Features**:
  - Real-time coordinate tracking during drag operations
  - Multi-signer support with color-coded field indicators
  - Export functionality for field configuration data
  - Responsive design with toolbar, PDF viewer, and properties panels

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