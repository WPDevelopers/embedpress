# EmbedPress Asset Management System

## Overview

The EmbedPress Asset Management System provides centralized, context-aware loading of CSS and JavaScript files across blocks, Elementor widgets, admin interface, and frontend.

## Architecture

### Core Components

1. **AssetManager** (`src/Core/AssetManager.php`) - Centralized asset management
2. **Build System** - Vite-based compilation for modern assets
3. **Legacy Support** - Conditional loading of existing assets

### Asset Categories

#### New Build Files (Vite-compiled)
- `js/blocks.build.js` - Gutenberg blocks JavaScript
- `css/blocks.style.build.css` - Block frontend styles
- `css/blocks.editor.build.css` - Block editor styles
- `js/admin.build.js` - Admin dashboard JavaScript
- `css/admin.build.css` - Admin dashboard styles
- `js/frontend.build.js` - Frontend JavaScript
- `css/components.build.css` - UI component styles

#### Legacy Assets (Conditional)
- `css/embedpress.css` - Base EmbedPress styles
- `js/plyr.polyfilled.js` - Video player (conditional)
- `css/plyr.css` - Video player styles (conditional)
- `js/carousel.min.js` - Carousel functionality (conditional)
- `css/carousel.min.css` - Carousel styles (conditional)
- `js/pdfobject.js` - PDF handling (conditional)

## Context-Based Loading

### Frontend Context
**Triggers:** `wp_enqueue_scripts` hook
**Loads:**
- Block styles (if EmbedPress blocks present)
- Frontend JavaScript
- Conditional assets based on content

### Admin Context
**Triggers:** `admin_enqueue_scripts` hook (EmbedPress pages only)
**Loads:**
- Admin JavaScript and CSS
- Component styles

### Editor Context
**Triggers:** `enqueue_block_editor_assets` hook
**Loads:**
- Block JavaScript
- Block editor styles
- Component styles

### Elementor Context
**Triggers:** Elementor-specific hooks
**Loads:**
- Elementor-specific styles
- Base EmbedPress styles
- Conditional assets

## Conditional Loading

Assets are loaded conditionally based on:

1. **Content Analysis** - Scans post content for specific patterns
2. **Feature Settings** - Checks enabled features in options
3. **Context Detection** - Determines current WordPress context

### Examples

```php
// PDF assets loaded only when PDF content detected
if (strpos($content, '.pdf') !== false) {
    self::enqueue_asset('pdfobject');
}

// Video player loaded only when enabled
if ($enabled_features['enabled_custom_player'] === 'yes') {
    self::enqueue_asset('plyr-js');
    self::enqueue_asset('plyr-css');
}
```

## Usage

### Automatic Loading
Assets are loaded automatically based on context and content. No manual intervention required.

### Manual Asset Loading
```php
// Check if asset exists
if (AssetManager::asset_exists('blocks-js')) {
    // Get asset URL
    $url = AssetManager::get_asset_url('blocks-js');
}
```

### Adding New Assets
```php
// In AssetManager::$assets array
'new-asset' => [
    'file' => 'js/new-feature.js',
    'deps' => ['jquery'],
    'contexts' => ['frontend', 'admin'],
    'type' => 'script',
    'conditional' => 'feature_enabled',
    'footer' => true
]
```

## Build Commands

### Development
```bash
npm start                # Watch all JS + CSS
npm run build:js        # Build JavaScript only
npm run build:css       # Build CSS only
```

### Production
```bash
npm run build           # Build all assets
```

## File Structure

```
embedpress/
├── src/
│   ├── Core/
│   │   ├── AssetManager.php     # Main asset manager
│   │   └── init.php             # Core initialization
│   ├── Blocks/                  # Block source files
│   ├── AdminUI/                 # Admin interface source
│   ├── Frontend/                # Frontend source
│   └── Shared/                  # Shared components/styles
├── assets/
│   ├── js/                      # Compiled JavaScript
│   └── css/                     # Compiled CSS
└── scripts/
    ├── css-builder.js           # CSS compilation
    └── asset-manager.js         # Legacy asset management
```

## Performance Features

1. **Context-Aware Loading** - Only loads assets where needed
2. **Conditional Assets** - Loads legacy assets only when required
3. **File Versioning** - Uses file modification time for cache busting
4. **Dependency Management** - Proper WordPress dependency handling
5. **Minification** - Production builds are optimized

## WordPress Integration

### Hooks Used
- `wp_enqueue_scripts` - Frontend assets
- `admin_enqueue_scripts` - Admin assets
- `enqueue_block_assets` - Block assets (frontend + editor)
- `enqueue_block_editor_assets` - Editor-only assets
- `elementor/frontend/after_enqueue_styles` - Elementor frontend
- `elementor/editor/after_enqueue_styles` - Elementor editor

### WordPress Standards
- Uses `wp_enqueue_script()` and `wp_enqueue_style()`
- Proper dependency management
- Version control with file modification time
- Follows WordPress coding standards

## Testing

Use the test page at `/wp-admin/tools.php?page=test-embedpress-assets` to verify:
- Asset file existence
- Hook registration
- Loading functionality

## Troubleshooting

### Assets Not Loading
1. Check file existence in `assets/` directory
2. Verify hooks are registered
3. Check context detection logic
4. Review conditional loading requirements

### Build Issues
1. Run `npm run build` to regenerate assets
2. Check Vite configuration
3. Verify source file paths
4. Review build logs for errors

## Migration Notes

- Legacy asset loading is maintained for backward compatibility
- New assets use modern build system
- Gradual migration path from old to new system
- No breaking changes to existing functionality
