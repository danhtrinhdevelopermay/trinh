# Design Guidelines: Educational Presentation Application

## Design Approach
**Reference-Based Approach** - Drawing inspiration from modern presentation tools like Canva, Prezi, and Google Slides, with emphasis on educational clarity and professional engagement.

**Key Design Principles:**
- Academic professionalism with modern appeal
- Clear visual hierarchy for educational content
- Minimal distraction to maintain focus on content
- Smooth, purposeful animations that enhance learning

## Core Design Elements

### A. Color Palette
**Primary Colors:**
- Deep Navy: 220 85% 15% (main brand color)
- Soft Blue: 210 50% 65% (secondary elements)

**Background Colors:**
- Light Mode: 0 0% 98% (primary background)
- Dark Mode: 220 15% 8% (primary background)
- Card Background Light: 0 0% 100%
- Card Background Dark: 220 15% 12%

**Accent Colors:**
- Success Green: 145 65% 45% (progress indicators)
- Warm Orange: 25 85% 60% (highlights, sparingly used)

### B. Typography
**Primary Font:** Inter (Google Fonts) - clean, readable for UI elements
**Content Font:** Source Serif Pro (Google Fonts) - elegant serif for slide content
**Mono Font:** JetBrains Mono - for any code or technical content

**Type Scale:**
- Slide Titles: 2.5rem (40px), bold
- Slide Content: 1.25rem (20px), regular
- UI Elements: 0.875rem (14px), medium
- Small Text: 0.75rem (12px), regular

### C. Layout System
**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16
- Small spacing: p-2, m-2
- Medium spacing: p-4, gap-6
- Large spacing: p-8, my-12
- Section spacing: py-16

**Grid System:** 
- Slide area: Full viewport with 4-unit padding
- Controls: Fixed positioning with 4-unit margins
- Sidebar: 16-unit width when expanded

### D. Component Library

**Navigation Controls:**
- Rounded buttons with subtle shadows
- Previous/Next arrows with smooth hover states
- Progress bar with animated fill
- Slide counter with elegant typography

**Slide Container:**
- Subtle border radius (8px)
- Soft drop shadow for depth
- Smooth transition animations (300ms ease-out)
- Full bleed for immersive content

**Audio Controls:**
- Minimal play/pause toggle
- Volume slider with gradient track
- Mute button with visual feedback

**Transition Effects:**
- Slide: Horizontal movement with easing
- Fade: Opacity transitions with slight scale
- Zoom: Scale transforms with fade overlay

### E. Animations
**Slide Transitions:**
- Duration: 500ms for slide changes
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
- Stagger: Content elements fade in 100ms after slide

**Micro-interactions:**
- Button hover: 150ms scale(1.05) with color shift
- Progress bar: Smooth width transitions
- Loading states: Subtle pulse animation

## Images
**Hero Slide Image:** Large, inspirational image related to personal growth/achievement
- Position: Background of opening slide with text overlay
- Treatment: Subtle dark gradient overlay for text readability
- Style: Professional photography or abstract concepts

**Content Slides:** Smaller supporting images as needed
- Icons: Use Heroicons for interface elements
- Illustrations: Simple, flat-style illustrations for concepts
- Charts/Graphs: Clean, minimal data visualization

## Layout Structure
- **Header:** Fixed navigation with progress indicator
- **Main Area:** Full-screen slide content
- **Footer:** Slide controls and audio controls
- **Sidebar:** Optional speaker notes (collapsible)

## Accessibility
- High contrast ratios (4.5:1 minimum)
- Keyboard navigation support
- Screen reader friendly structure
- Focus indicators for all interactive elements
- Audio controls with visual feedback

## Interactive States
- Hover: Subtle elevation and color shifts
- Active: Pressed state with slight scale reduction
- Focus: Clear outline with brand color
- Disabled: Reduced opacity with no interaction

This design system creates a professional, educational presentation environment that balances visual appeal with functional clarity, ensuring users can focus on the important message about overcoming destiny while enjoying a polished, modern interface.