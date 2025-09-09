# EmbedPress Centralized Frontend Architecture

## Overview

This directory contains the new centralized frontend architecture for EmbedPress, built with modern tools and best practices.

## Architecture

### Technology Stack
- **React 18** - Modern React with automatic JSX runtime
- **Vite** - Fast build tool with HMR (Hot Module Replacement)
- **TypeScript** - Type safety and better developer experience
- **SCSS** - Enhanced CSS with variables and mixins
- **ESLint + Prettier** - Code quality and formatting
- **Vitest** - Fast unit testing

### Directory Structure

```
src/
├── Blocks/                    # Gutenberg Blocks
│   ├── index.js              # Main entry point for all blocks
│   ├── EmbedBlock/           # Main embed block
│   ├── PDFBlock/             # PDF-specific block
│   ├── CalendarBlock/        # Calendar embed block
│   └── DocumentBlock/        # Document viewer block
│
├── Elementor/                # Elementor Widgets
│   ├── index.js              # Elementor integration entry
│   └── Widgets/              # Individual widget components
│
├── Shortcodes/               # Shortcode Handlers
│   ├── index.js              # Shortcode registration
│   └── handlers/             # Individual shortcode handlers
│
├── AdminUI/                  # React-based Admin Interfaces
│   ├── index.jsx             # Main admin app entry
│   ├── Dashboard/            # Main dashboard
│   ├── Analytics/            # Analytics dashboard
│   ├── Settings/             # Settings panels
│   └── Onboarding/           # Setup wizard
│
├── Frontend/                 # Frontend Scripts
│   ├── index.js              # Main frontend entry
│   ├── SocialShare/          # Social sharing functionality
│   └── Analytics/            # Frontend analytics tracking
│
├── Shared/                   # Shared Resources
│   ├── components/           # Reusable React components
│   │   ├── UI/              # Generic UI components
│   │   ├── EmbedPress/      # EmbedPress-specific components
│   │   ├── Charts/          # Chart components
│   │   └── Layout/          # Layout components
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   ├── stores/              # State management (Zustand)
│   ├── services/            # API services
│   ├── types/               # TypeScript type definitions
│   └── styles/              # Global SCSS styles
│
├── Core/                     # Core Plugin Logic
│   └── (PHP integration points)
│
├── Helpers/                  # Utility Classes
│   └── (Helper functions)
│
└── Templates/                # HTML/PHP Templates
    └── (Template files)
```

## Key Features

### 1. Shared Component System
All components in `src/Shared/components/` can be used across:
- Gutenberg blocks
- Elementor widgets  
- Admin dashboards
- Frontend scripts

```javascript
// Import shared components anywhere
import { Button, Modal, EmbedPreview } from '@components';
import { useEmbedPreview, useAnalytics } from '@hooks';
import { validateURL, trackEvent } from '@utils';
```

### 2. Modern Build System
- **Vite** for lightning-fast builds and HMR
- **Code splitting** for optimal bundle sizes
- **Tree shaking** to eliminate unused code
- **Modern JavaScript** with ES2020+ features

### 3. Type Safety
- **TypeScript** support for better development experience
- **Type definitions** for WordPress globals
- **IntelliSense** for better code completion

### 4. Developer Experience
- **Hot Module Replacement** for instant updates
- **ESLint** for code quality
- **Prettier** for consistent formatting
- **Vitest** for fast unit testing

## Development Workflow

### Getting Started
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Available Scripts
```bash
npm run dev          # Development with HMR
npm run build        # Production build
npm run build:watch  # Development build with watch
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format with Prettier
npm run test         # Run tests
npm run type-check   # TypeScript checking
```

### Import Aliases
Use clean import paths with configured aliases:

```javascript
// Instead of relative paths
import Button from '../../../components/UI/Button';

// Use aliases
import { Button } from '@components';
import { validateURL } from '@utils';
import { useEmbedPreview } from '@hooks';
```

## Component Guidelines

### Creating Shared Components
1. Place in appropriate `src/Shared/components/` subdirectory
2. Export from `src/Shared/components/index.js`
3. Include TypeScript types
4. Add SCSS styles with BEM methodology
5. Write unit tests

### Example Component Structure
```
src/Shared/components/UI/Button/
├── Button.jsx          # Main component
├── Button.scss         # Styles
├── Button.test.jsx     # Unit tests
├── Button.stories.jsx  # Storybook stories (optional)
└── index.js           # Export
```

### Component Example
```javascript
// Button.jsx
import React from 'react';
import classNames from 'classnames';
import './Button.scss';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  ...props 
}) => {
  const classes = classNames(
    'ep-button',
    `ep-button--${variant}`,
    `ep-button--${size}`
  );

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
```

## Integration with WordPress

### Gutenberg Blocks
```javascript
// Block registration uses shared components
import { EmbedPreview, SocialShareControls } from '@components';

const Edit = ({ attributes, setAttributes }) => (
  <div>
    <EmbedPreview url={attributes.url} />
    <SocialShareControls 
      onChange={(platform, enabled) => {
        setAttributes({ [`share${platform}`]: enabled });
      }}
    />
  </div>
);
```

### Elementor Widgets
```javascript
// Elementor widgets can reuse the same components
import { CustomBrandingControls, AnalyticsCard } from '@components';
```

### Admin Dashboards
```javascript
// Admin interfaces use the same component library
import { LineChart, Button, Modal } from '@components';
```

## Best Practices

### 1. Component Design
- Keep components small and focused
- Use TypeScript for type safety
- Follow BEM methodology for CSS
- Make components reusable across contexts

### 2. State Management
- Use React hooks for local state
- Use Zustand for global state
- Keep state close to where it's used

### 3. Performance
- Use React.memo for expensive components
- Implement code splitting for large features
- Optimize bundle sizes with tree shaking

### 4. Testing
- Write unit tests for components
- Test user interactions
- Mock external dependencies

## Migration from Old Structure

See `MIGRATION_GUIDE.md` for detailed migration instructions from the old scattered setup to this new centralized architecture.

## Benefits

✅ **Single build system** - One Vite config for everything  
✅ **Shared components** - No more code duplication  
✅ **Modern tooling** - Fast builds, HMR, TypeScript  
✅ **Better DX** - Improved developer experience  
✅ **Maintainable** - Clean, organized structure  
✅ **Scalable** - Easy to add new features  
✅ **Type safe** - TypeScript support throughout  
✅ **Fast builds** - Vite is significantly faster than Webpack
