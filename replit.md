# Educational Presentation Application

## Overview

This is a modern web application for creating and displaying educational presentations, specifically designed around the theme "Làm thế nào để con người vượt lên số phận của chính mình trong cuộc sống" (How can humans overcome their own destiny in life). The application provides a full-stack solution with presentation management, slide creation, and an interactive presentation viewer with audio controls and smooth animations.

## Recent Changes

### October 4, 2025 - Enhanced Animation System with Staggered Entrances
- **Staggered entrance animations**: Each slide element appears sequentially with precise timing for professional flow
  - Slide container: Y-axis movement (20px → 0) with scale (0.95 → 1) on entrance
  - Title elements: Slide from bottom (y: 50 → 0) with scale effect, 0.15s delay
  - Content elements: Slide from bottom (y: 30 → 0) with opacity fade, 0.35s delay  
  - Decorative icons: Rotate in from -180° with spring physics (stiffness 300, damping 25), 0.5s delay
  - Floating sparkles: Scale and rotate entrance with spring motion
- **Spring-based physics**: Natural, bouncy motion using Framer Motion spring configurations
  - Decorative icons use spring animations for lively, controlled entrance
  - Floating elements have infinite spring-based animations with repeat
- **Modern exit animations**: Slides exit with upward movement (y: -10) and slight scale increase (1.02)
- **Accessibility maintained**: Full support for reduced motion preferences - complex animations simplified to opacity-only transitions
- **Demo mode added**: Created `/demo` route for unauthenticated presentation viewing
  - Uses fallback mock slides when API authentication fails
  - Smart retry logic: no retry on 401/403 errors
  - Allows testing animations without login requirement

### September 29, 2025 - PowerPoint-Style Morph Transitions
- **Implemented true Morph transitions**: Element-based morphing system matching PowerPoint's Morph behavior
  - Individual slide elements (text, images, shapes, icons) morph independently between slides
  - Smooth transitions for position, size, color, rotation, and shape properties
  - Elements with matching IDs automatically morph; new elements fade in, removed elements fade out
- **Element-based data model**: New slide content format with typed elements (TextElement, ImageElement, ShapeElement, IconElement)
  - Each element has unique ID, position (x, y), size (width, height), rotation, opacity, and type-specific properties
  - Supports complex morphing: text color/size changes, icon transformations, shape morphing (circle to rectangle)
- **SlideCanvas component**: Built with Framer Motion layoutId system for automatic element correlation and morphing
  - Position and size morph via shared layout animations
  - Properties (color, fontSize, borderRadius, scale) animate explicitly for smooth transitions
  - AnimatePresence handles element enter/exit with fade animations
- **MorphDemo page**: Interactive demo at `/morph-demo` showcasing all morph capabilities (auth bypass for easy testing)
  - Demo includes: text movement/resizing/color changes, icon transformations with rotation, shape morphing
  - Keyboard navigation support with arrow keys
- **Architecture verified by architect**: Implementation confirmed to achieve PowerPoint-style Morph behavior with persistent parent containers, correct AnimatePresence placement, and smooth property/layout animations

### September 29, 2025 - Enhanced Presentation Content
- **Expanded slide count**: Increased from 8 to 12 slides for more comprehensive coverage
- **Added Nguyen Ngoc Ky slides**: Featured the inspiring Vietnamese teacher who writes with his feet
  - Slide 5: "Tấm Gương Nguyễn Ngọc Ký" with detailed biographical information
  - Slide 6: Quote slide featuring his famous words "Tôi viết bằng chân nhưng từ trái tim"
- **Enhanced content structure**: Added emojis, improved phrasing, and better organization
- **Additional role models**: Included Nick Vujicic, Stephen Hawking, Oprah Winfrey, and Michael Jordan
- **New content types**: Implemented `story_with_image` component for biographical presentations
- **Updated both storage systems**: Synchronized MemStorage and DBStorage with new content

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