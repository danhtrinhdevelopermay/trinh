# Educational Presentation Application

## Overview

This is a modern web application for creating and displaying educational presentations, specifically designed around the theme "Làm thế nào để con người vượt lên số phận của chính mình trong cuộc sống" (How can humans overcome their own destiny in life). The application provides a full-stack solution with presentation management, slide creation, and an interactive presentation viewer with audio controls and smooth animations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent design
- **Styling**: Tailwind CSS with custom design system based on educational presentation guidelines
- **State Management**: TanStack Query for server state management and React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Animations**: Framer Motion for smooth page transitions and slide animations

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API**: RESTful API design with structured routes for presentations and slides
- **Session Management**: Express sessions with PostgreSQL storage via connect-pg-simple
- **Validation**: Zod schemas for runtime type checking and validation

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Cloud Provider**: Neon serverless PostgreSQL for production deployment
- **Schema**: Three main entities - users, presentations, and slides with proper foreign key relationships
- **Development**: In-memory storage fallback for development environments

### Authentication & Authorization
- **Password Security**: bcrypt for password hashing
- **Session-based**: Traditional server-side sessions stored in PostgreSQL
- **User Management**: Basic user registration and login system

### Design System
- **Color Palette**: Educational-focused with deep navy primary, soft blue secondary, and academic-appropriate accent colors
- **Typography**: Inter for UI elements, Source Serif Pro for presentation content
- **Responsive Design**: Mobile-first approach with consistent spacing system
- **Accessibility**: Focus on keyboard navigation and screen reader compatibility

### Audio System
- **Web Audio API**: Programmatic audio generation for background music and sound effects
- **Context Management**: React context for global audio state management
- **Browser Compatibility**: Graceful fallback when Web Audio API is unavailable

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form for form management
- **Build Tools**: Vite with TypeScript support, PostCSS, Autoprefixer
- **Routing**: Wouter for lightweight client-side routing

### UI & Styling
- **Component Library**: Radix UI primitives for accessible, unstyled components
- **Styling**: Tailwind CSS with class variance authority for component variants
- **Icons**: Lucide React for consistent iconography
- **Animations**: Framer Motion for page transitions and presentation effects

### Backend Infrastructure
- **Server**: Express.js with TypeScript support via tsx
- **Database**: Drizzle ORM with PostgreSQL adapter, Neon serverless database
- **Session Management**: connect-pg-simple for PostgreSQL session storage
- **Validation**: Zod for schema validation and type inference

### Development & Tooling
- **TypeScript**: Full type safety across client and server
- **Hot Reload**: Vite HMR for development, tsx for server-side development
- **Code Quality**: ESBuild for production builds
- **Environment**: Replit-specific plugins for development experience

### Third-party Services
- **Database Hosting**: Neon PostgreSQL for serverless database hosting
- **Font Loading**: Google Fonts for typography (Inter, Source Serif Pro, JetBrains Mono)
- **Audio Assets**: Support for royalty-free audio files for presentation enhancement