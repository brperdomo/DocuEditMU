# Document Editor - DocuSign Style Interface

A modern web-based document editor with inline text editing capabilities, built with React and TypeScript. Features a DocuSign-inspired interface for creating and editing contract documents with real-time text editing, page management, and professional styling.

## Features

- **DocuSign-Style Interface**: Authentic 2024 DocuSign design with proper colors and layout
- **Inline Text Editing**: Click-to-edit paragraphs with floating toolbars
- **Page Management**: Add new pages, navigate between pages with thumbnails
- **Copy & Paste**: Copy paragraphs between pages
- **Real-time Updates**: Instant saving and synchronization
- **Responsive Design**: Works on desktop and tablet devices

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Build Tool**: Vite
- **UI Components**: shadcn/ui with Radix UI

## Prerequisites

Before you begin, ensure you have the following installed:

### For Mac:
- **Node.js** (version 18 or higher)
  ```bash
  # Install using Homebrew (recommended)
  brew install node
  
  # Or download from https://nodejs.org/
  ```

- **Git**
  ```bash
  # Install using Homebrew
  brew install git
  ```

### For Windows:
- **Node.js** (version 18 or higher)
  - Download and install from [nodejs.org](https://nodejs.org/)
  - Choose the LTS version for stability

- **Git**
  - Download and install from [git-scm.com](https://git-scm.com/)

- **Optional: Windows Terminal**
  - Install from Microsoft Store for better command line experience

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd document-editor
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/document_editor"

# Session Secret
SESSION_SECRET="your-super-secret-session-key-here"

# Development Port (optional)
PORT=3000
```

### 4. Database Setup

#### Option A: Using Local PostgreSQL

**Mac (using Homebrew):**
```bash
# Install PostgreSQL
brew install postgresql
brew services start postgresql

# Create database
createdb document_editor
```

**Windows:**
```bash
# Download PostgreSQL from https://www.postgresql.org/download/windows/
# After installation, use pgAdmin or command line:
createdb document_editor
```

#### Option B: Using Docker (Recommended for development)

```bash
# Run PostgreSQL in Docker
docker run --name document-editor-db \
  -e POSTGRES_DB=document_editor \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15

# Update your .env file:
DATABASE_URL="postgresql://postgres:password@localhost:5432/document_editor"
```

### 5. Database Migration

```bash
# Generate and run database migrations
npm run db:generate
npm run db:migrate
```

## Running the Application

### Development Mode

```bash
npm run dev
```

This will start:
- **Frontend**: http://localhost:3000 (Vite dev server)
- **Backend**: Express server integrated with Vite
- **Hot Reload**: Automatic refresh on code changes

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Project Structure

```
document-editor/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities and configurations
│   └── index.html          # HTML entry point
├── server/                 # Backend Express application
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API routes
│   └── storage.ts          # Database interface
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Database schemas and types
└── package.json            # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production application
- `npm start` - Start production server
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill process using port 3000
# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Database connection errors:**
- Verify PostgreSQL is running
- Check DATABASE_URL in .env file
- Ensure database exists and credentials are correct

**Node modules issues:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors:**
```bash
# Clear TypeScript cache
rm -rf .tsc-cache
npm run dev
```

### Platform-Specific Notes

**Mac:**
- Use Terminal or iTerm2 for command line
- Xcode Command Line Tools may be required: `xcode-select --install`

**Windows:**
- Use PowerShell, Command Prompt, or Windows Terminal
- Consider using WSL2 for better development experience
- Some npm packages may require build tools: `npm install -g windows-build-tools`

## Development Tips

1. **Hot Reload**: The application supports hot reload for both frontend and backend changes
2. **Database Management**: Use `npm run db:studio` to visually manage your database
3. **TypeScript**: All code is fully typed - leverage your IDE's TypeScript support
4. **Styling**: Uses Tailwind CSS with DocuSign color variables defined in `client/src/index.css`

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify all prerequisites are installed correctly
3. Ensure database is running and accessible
4. Check console logs for specific error messages

## License

This project is for demonstration purposes and replicates DocuSign's interface for educational use.