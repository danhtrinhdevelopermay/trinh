# Educational Presentation Application

## Overview
This project is a modern web application for creating and displaying educational presentations. Its core purpose is to provide an interactive and engaging platform focused on the theme "Làm thế nào để con người vượt lên số phận của chính mình trong cuộc sống" (How can humans overcome their own destiny in life). The application offers a full-stack solution including presentation management, slide creation, an interactive viewer with audio controls, and smooth, cinematic animations. It aims to deliver a compelling visual and auditory experience, leveraging 3D graphics and sophisticated transitions to convey its message effectively.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture
### Frontend Architecture
- **Framework**: React 18 with TypeScript, built using Vite.
- **UI Components**: Radix UI primitives integrated with shadcn/ui for a consistent design system.
- **Styling**: Tailwind CSS with a custom design system tailored for educational presentations.
- **State Management**: TanStack Query for server state; React hooks for local state.
- **Routing**: Wouter for lightweight client-side routing.
- **Animations**: Framer Motion for complex slide transitions, element animations, and 3D model interactions, including morphing between elements with matching IDs. Features 8 diverse transition effects (fade, zoom, slide, flip, rotate, blurSlide, scaleFade, perspectiveSlide) with professional easing curves and direction-aware animations.
- **3D Graphics**: Three.js, React Three Fiber, and React Three Drei for immersive 3D backgrounds (Vietnamese village scene) and interactive 3D models. Features a dual rendering system (WebGL vs. CSS 3D Transforms) with automatic detection for universal compatibility.

### Backend Architecture
- **Runtime**: Node.js with Express.js.
- **Language**: TypeScript with ES modules.
- **API**: RESTful API for managing presentations and slides.
- **Session Management**: Express sessions with PostgreSQL storage (`connect-pg-simple`) for production and in-memory fallback for development.
- **Validation**: Zod schemas for robust runtime validation.

### Data Storage
- **Database**: PostgreSQL, managed with Drizzle ORM for type-safe operations.
- **Dual Driver Support**: Automatic detection and use of `neon-http` for Neon serverless PostgreSQL and `node-postgres` for standard PostgreSQL instances.
- **Schema**: Supports users, presentations, and slides with defined relationships.
- **Development**: In-memory storage fallback when no database is configured.

### Authentication & Authorization
- **Security**: bcrypt for password hashing.
- **Method**: Session-based, utilizing server-side sessions stored in PostgreSQL.
- **Features**: Basic user registration and login functionality.

### Design System
- **Color Palette**: Educational theme with a deep navy primary, soft blue secondary, and appropriate accent colors. Includes modern gradients (modern-gradient-1 to 5) and geometric patterns for diverse slide backgrounds.
- **Typography**: Inter (UI), Source Serif Pro (content).
- **Responsiveness**: Mobile-first design with a consistent spacing system. Optimized for landscape and 16:9 aspect ratio screens with specific media queries for presentations. Supports ultra-wide (1920px+) and 4K+ displays with adaptive padding and typography scaling.
- **Accessibility**: Emphasis on keyboard navigation and screen reader compatibility; animations simplify for reduced motion preferences.
- **Slide Layouts**: Five diverse layout options for varied visual presentations:
  - **Centered**: Traditional center-aligned content with backdrop blur and decorative elements
  - **Split-Left/Right**: Content on one side with large decorative icon on the other, optimized for landscape screens
  - **Full-Width**: Wide-screen layout with content aligned to the left, maximizing horizontal space
  - **Corner-Accent**: Content positioned in corners with decorative accents for dynamic compositions

### Audio System
- **Implementation**: Web Audio API for programmatic background music and sound effects.
- **Management**: React context for global audio state.
- **Compatibility**: Graceful degradation when Web Audio API is unavailable.

### Deployment & Performance
- **Anti-Spindown**: Automatic self-ping mechanism in production to prevent Render free-tier service from sleeping.
- **Optimizations**: Efficient rendering for 3D graphics, staggered entrance animations, and smart retry logic for API calls.

## External Dependencies
### Core Framework & Build
- **React Ecosystem**: React 18, React DOM, React Hook Form.
- **Build Tools**: Vite (with TypeScript), PostCSS, Autoprefixer, ESBuild.
- **Routing**: Wouter.

### UI & Styling
- **Components**: Radix UI, shadcn/ui.
- **Styling**: Tailwind CSS, class-variance-authority.
- **Icons**: Lucide React.
- **Animations**: Framer Motion.
- **3D Libraries**: Three.js, React Three Fiber, React Three Drei.

### Backend Infrastructure
- **Server**: Express.js, tsx.
- **Database**: Drizzle ORM, `drizzle-kit`, `pg`, `neon-http`, `connect-pg-simple`.
- **Validation**: Zod.

### Third-party Services
- **Database Hosting**: Neon PostgreSQL.
- **Fonts**: Google Fonts (Inter, Source Serif Pro, JetBrains Mono).
- **Audio Assets**: Royalty-free audio files for presentation enhancement.