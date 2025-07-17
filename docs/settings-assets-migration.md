# Settings Assets Migration

## Overview

Successfully migrated EmbedPress settings assets from the old plugin structure to the new Vite-based build system.

## What Was Migrated

### Assets Moved
- **CSS Files:**
  - `EmbedPress/Ends/Back/Settings/assets/css/style.css` → `static/css/settings.css`
  - `EmbedPress/Ends/Back/Settings/assets/css/icon/style.css` → `static/css/settings-icons.css`

- **JavaScript Files:**
  - `EmbedPress/Ends/Back/Settings/assets/js/settings.js` → `static/js/settings.js`

- **Font Files:**
  - `EmbedPress/Ends/Back/Settings/assets/css/icon/fonts/*` → `static/fonts/`
  - `EmbedPress/Ends/Back/Settings/assets/css/fonts/*` → `static/css/fonts/`

- **Image Files:**
  - `EmbedPress/Ends/Back/Settings/assets/img/*` → `static/images/`

### Build Configuration Updates

#### Vite Config (`vite.config.js`)
1. **Added settings static assets group:**
   ```javascript
   settings: {
       css: [
           'static/css/settings.css',
           'static/css/settings-icons.css'
       ],
       js: [
           'static/js/settings.js'
       ]
   }
   ```

2. **Added settings build target:**
   ```javascript
   'settings': {
       input: 'virtual:settings-assets',
       output: {
           entryFileNames: 'js/settings.build.js',
           cssFileName: 'css/settings.build.css',
           globals: { 'jquery': 'jQuery' },
           external: ['jquery'],
           format: 'iife',
           name: 'EmbedPressSettings'
       }
   }
   ```

3. **Updated virtual assets plugin** to include `'virtual:settings-assets'`

#### AssetManager (`src/Core/AssetManager.php`)
1. **Added settings assets definitions:**
   ```php
   'settings-js' => [
       'file' => 'js/settings.build.js',
       'deps' => ['jquery', 'wp-color-picker'],
       'contexts' => ['settings'],
       'type' => 'script',
       'footer' => true,
       'handle' => 'ep-settings-script',
       'priority' => 10,
   ],
   'settings-css' => [
       'file' => 'css/settings.build.css',
       'deps' => ['wp-color-picker'],
       'contexts' => ['settings'],
       'type' => 'style',
       'handle' => 'ep-settings-style',
       'priority' => 10,
   ]
   ```

2. **Updated admin asset enqueuing** to load settings assets on EmbedPress pages

#### Package.json
1. **Added build commands:**
   - `"build:settings": "BUILD_TARGET=settings vite build"`
   - `"watch:settings": "BUILD_TARGET=settings vite build --watch --mode development"`

2. **Updated build scripts** to include settings in static build process

## File Structure Changes

### Before (Old Structure)
```
EmbedPress/Ends/Back/Settings/assets/
├── css/
│   ├── style.css
│   ├── fonts/
│   └── icon/
│       ├── style.css
│       └── fonts/
├── js/
│   └── settings.js
└── img/
```

### After (New Structure)
```
static/
├── css/
│   ├── settings.css
│   ├── settings-icons.css
│   └── fonts/
├── js/
│   └── settings.js
├── fonts/
└── images/

assets/ (build output)
├── css/
│   └── settings.build.css
├── js/
│   └── settings.build.js
├── fonts/
└── img/
```

## Asset Loading

### Context-Based Loading
- Settings assets are loaded only in the `'settings'` context
- Automatically enqueued on EmbedPress admin pages (`strpos($hook, 'embedpress') !== false`)
- Includes proper dependencies: `jquery`, `wp-color-picker`

### Build Output
- **CSS:** `assets/css/settings.build.css` (70.34 kB, gzipped: 11.92 kB)
- **JS:** `assets/js/settings.build.js` (12.28 kB, gzipped: 3.86 kB)
- **Fonts:** All icon fonts and DMSans fonts properly included
- **Images:** Settings-related images copied to assets folder

## Next Steps

1. **Test settings page functionality** to ensure all styles and scripts work correctly
2. **Remove old settings asset enqueuing** from legacy code once migration is confirmed
3. **Update any hardcoded asset paths** in PHP templates if needed
4. **Consider migrating settings page to React** for better integration with new admin UI

## Benefits

- ✅ **Unified build system** - All assets now use Vite
- ✅ **Optimized output** - Minified and gzipped assets
- ✅ **Better caching** - Proper versioning and cache busting
- ✅ **Development workflow** - Hot reload and watch mode support
- ✅ **Asset organization** - Clear separation of source and build files
- ✅ **Dependency management** - Proper external dependencies handling
