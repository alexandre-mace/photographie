# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 photography project using React 19, TypeScript, and Tailwind CSS 4. The project uses the App Router architecture and includes shadcn/ui components configuration.

## Development Commands

- **Start development server**: `npm run dev` (uses Turbopack for faster builds)
- **Build for production**: `npm run build`
- **Start production server**: `npm start`
- **Lint code**: `npm run lint`

## Architecture

### Project Structure
- **app/**: Next.js App Router directory containing pages and layouts
  - `layout.tsx`: Root layout with Geist font configuration
  - `page.tsx`: Homepage component
  - `globals.css`: Global styles with Tailwind CSS
- **lib/**: Utility functions
  - `utils.ts`: Contains `cn()` utility for conditional CSS classes using clsx and tailwind-merge
- **public/**: Static assets including SVG icons

### Key Technologies
- **Next.js 15**: React framework with App Router
- **React 19**: Latest React version
- **TypeScript**: Strict type checking enabled
- **Tailwind CSS 4**: Utility-first CSS framework
- **shadcn/ui**: Component library (configured in `components.json`)
  - Uses "new-york" style
  - Components path aliased to `@/components`
  - Utils aliased to `@/lib/utils`
  - Uses Lucide React for icons

### Path Aliases
- `@/*`: Maps to project root
- Components, utils, and lib directories are aliased via shadcn/ui configuration

### Styling
- Uses CSS custom properties for theming
- Dark mode support configured
- Geist Sans and Geist Mono fonts loaded via next/font/google