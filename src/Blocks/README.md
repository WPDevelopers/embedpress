# EmbedPress New Block System

This directory contains the new centralized block system for EmbedPress, designed to replace the old Gutenberg implementation with a cleaner, more maintainable structure.

## Architecture

### Directory Structure
```
src/Blocks/
├── README.md                 # This file
├── init.php                  # Block system initialization
├── BlockManager.php          # Main block management class
├── render-callbacks.php      # Render callback functions
└── EmbedPress/              # Individual block folders
    ├── block.json           # Block configuration
    ├── index.js             # Block registration (JS)
    └── src/                 # Block components and assets
        ├── components/      # React components
        ├── style.scss       # Frontend styles
        └── editor.scss      # Editor styles
```

### Key Components

#### 1. BlockManager.php
- **Purpose**: Central management of all EmbedPress blocks
- **Features**:
  - Automatic block registration using `block.json`
  - Asset enqueuing (scripts and styles)
  - Settings integration
  - Extensible architecture for adding new blocks

#### 2. init.php
- **Purpose**: Initialize the block system
- **Features**:
  - Loads render callbacks
  - Initializes BlockManager
  - Registers block categories
  - Provides feature flags for gradual migration

#### 3. render-callbacks.php
- **Purpose**: Include render callback functions
- **Features**:
  - Maintains compatibility with existing render functions
  - Centralized location for all block render logic

## How It Works

### 1. Initialization
The system is initialized in `includes.php`:
```php
// Check if we should use the new block system
if (apply_filters('embedpress_use_new_block_system', true)) {
    require_once __DIR__ . '/src/Blocks/init.php';
} else {
    require_once __DIR__ . '/Gutenberg/plugin.php';
}
```

### 2. Block Registration
Blocks are registered automatically by the BlockManager:
1. Reads `block.json` configuration
2. Registers block with WordPress
3. Adds render callbacks and attributes
4. Enqueues necessary assets

### 3. Asset Management
- **JavaScript**: Built from `src/Blocks/index.js` to `assets/js/blocks.build.js`
- **CSS**: Compiled from SCSS files to `assets/css/blocks.*.css`
- **Build System**: Uses Vite for modern build pipeline

## Benefits

### 1. Separation of Concerns
- Each block has its own directory
- Clear separation between PHP and JavaScript
- Modular architecture

### 2. Modern Development
- Uses `block.json` for configuration
- Compatible with WordPress block standards
- Modern build system with Vite

### 3. Maintainability
- Centralized block management
- Consistent structure across blocks
- Easy to add new blocks

### 4. Performance
- Single consolidated JavaScript file
- Optimized asset loading
- Conditional block loading based on settings

## Migration Strategy

The new system is designed for gradual migration:

1. **Phase 1**: New system runs alongside old system
2. **Phase 2**: Individual blocks migrated one by one
3. **Phase 3**: Old system deprecated and removed

### Feature Flag
Use the filter `embedpress_use_new_block_system` to control which system is active:
```php
// Disable new system (use old Gutenberg system)
add_filter('embedpress_use_new_block_system', '__return_false');
```

## Adding New Blocks

### 1. Create Block Directory
```
src/Blocks/YourBlock/
├── block.json
├── index.js
└── src/
    ├── components/
    ├── style.scss
    └── editor.scss
```

### 2. Configure block.json
```json
{
  "name": "embedpress/your-block",
  "title": "Your Block",
  "category": "embedpress",
  "editorScript": "embedpress-blocks-editor",
  "style": "embedpress-blocks-style"
}
```

### 3. Register in BlockManager
```php
$block_manager->add_block('YourBlock', [
    'name' => 'embedpress/your-block',
    'render_callback' => 'your_block_render_callback',
    'setting_key' => 'your-block'
]);
```

### 4. Add to Build System
Update `src/Blocks/index.js`:
```javascript
import './YourBlock/index.js';
```

## Build System Integration

The new block system integrates with the existing Vite build configuration:

- **Entry Point**: `src/Blocks/index.js`
- **Output**: `assets/js/blocks.build.js`
- **CSS**: `assets/css/blocks.style.build.css`

### Development
```bash
npm run dev    # Watch mode
npm run build  # Production build
```

## Compatibility

### WordPress Requirements
- WordPress 5.0+ (Gutenberg support)
- PHP 7.4+

### EmbedPress Integration
- Fully compatible with existing EmbedPress features
- Uses same render callbacks as old system
- Maintains all block functionality

## Testing

The system includes comprehensive testing:
- PHP syntax validation
- Block registration testing
- Asset loading verification
- Integration testing

Run tests with:
```bash
php -l src/Blocks/*.php  # Syntax check
```

## Future Enhancements

1. **Block Variations**: Support for block variations
2. **Dynamic Blocks**: Enhanced dynamic block support
3. **Block Patterns**: Pre-configured block patterns
4. **Performance**: Further optimization and caching
5. **Developer Tools**: Enhanced debugging and development tools
