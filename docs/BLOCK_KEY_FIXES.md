# EmbedPress Block Key Fixes

## Overview
This document summarizes the fixes applied to correct incorrect block key references in EmbedPress blocks.

## Problem
The EmbedPress blocks were using incorrect keys when checking `embedpressGutenbergData.activeBlocks`. The correct keys should include the `-block` suffix for most blocks.

## Correct Block Keys
```javascript
{
    "google-docs-block": "google-docs-block",
    "document": "document",
    "embedpress": "embedpress",
    "embedpress-pdf": "embedpress-pdf",
    "google-sheets-block": "google-sheets-block",
    "google-slides-block": "google-slides-block",
    "youtube-block": "youtube-block",
    "google-forms-block": "google-forms-block",
    "google-drawings-block": "google-drawings-block",
    "google-maps-block": "google-maps-block",
    "twitch-block": "twitch-block",
    "wistia-block": "wistia-block",
    "vimeo-block": "vimeo-block",
    "embedpress-calendar": "embedpress-calendar"
}
```

## Files Updated

### Block Registration Files
1. **`src/Blocks/youtube/src/index.js`**
   - Fixed: `['youtube']` → `['youtube-block']`

2. **`src/Blocks/google-docs/src/index.js`**
   - Fixed: `['google-docs']` → `['google-docs-block']`

3. **`src/Blocks/google-sheets/src/index.js`**
   - Fixed: `['google-sheets']` → `['google-sheets-block']`

4. **`src/Blocks/google-slides/src/index.js`**
   - Fixed: `['google-slides']` → `['google-slides-block']`

5. **`src/Blocks/google-forms/src/index.js`**
   - Fixed: `['google-forms']` → `['google-forms-block']`

6. **`src/Blocks/google-drawings/src/index.js`**
   - Fixed: `['google-drawings']` → `['google-drawings-block']`

7. **`src/Blocks/google-maps/src/index.js`**
   - Fixed: `['google-maps']` → `['google-maps-block']`

8. **`src/Blocks/twitch/src/index.js`**
   - Fixed: `['twitch']` → `['twitch-block']`

9. **`src/Blocks/wistia/src/index.js`**
   - Fixed: `['wistia']` → `['wistia-block']`

10. **`src/Blocks/embedpress-calendar/src/index.js`**
    - Fixed: `active_blocks` → `activeBlocks` (property name standardization)

### Pro Plugin Files
11. **`embedpress-pro/Gutenberg/src/vimeo/index.js`**
    - Fixed: `active_blocks` → `activeBlocks`

### Property Name Standardization Files
12. **`Gutenberg/src/embedpress/InspectorControl/vimeo.js`**
    - Fixed: `is_pro_plugin_active` → `isProPluginActive`

13. **`Gutenberg/src/placeholders/placeholders.js`**
    - Fixed: `is_pro_plugin_active` → `isProPluginActive`

14. **`Gutenberg/src/embedpress/InspectorControl/opensea.js`**
    - Fixed: `is_pro_plugin_active` → `isProPluginActive`

15. **`Gutenberg/src/embedpress/InspectorControl/google-photos.js`**
    - Fixed: `is_pro_plugin_active` → `isProPluginActive`

16. **`src/Blocks/GlobalCoponents/custombranding.js`**
    - Fixed: `is_pro_plugin_active` → `isProPluginActive`

17. **`Gutenberg/src/embedpress/InspectorControl/calendly.js`**
    - Fixed: `is_pro_plugin_active` → `isProPluginActive`

18. **`src/Blocks/GlobalCoponents/upgrade.js`**
    - Fixed: `is_pro_plugin_active` → `isProPluginActive`
    - Fixed: `current_user` → `currentUser`

19. **`Gutenberg/src/embedpress/Upgrade.js`**
    - Fixed: `is_pro_plugin_active` → `isProPluginActive`
    - Fixed: `current_user` → `currentUser`

20. **`src/Blocks/EmbedPress/src/components/InspectorControl/google-photos.js`**
    - Fixed: `is_pro_plugin_active` → `isProPluginActive`

21. **`Gutenberg/src/embedpress/InspectorControl/selfhosted.js`**
    - Fixed: `is_pro_plugin_active` → `isProPluginActive`

22. **`src/Blocks/EmbedPress/src/components/upgrade.js`**
    - Fixed: `is_pro_plugin_active` → `isProPluginActive`
    - Fixed: `current_user` → `currentUser`

23. **`Gutenberg/src/embedpress/InspectorControl/spreaker.js`**
    - Fixed: `is_pro_plugin_active` → `isProPluginActive`

24. **`Gutenberg/src/embedpress/InspectorControl/custombranding.js`**
    - Fixed: `is_pro_plugin_active` → `isProPluginActive`

25. **`src/Blocks/EmbedPress/src/components/InspectorControl/calendly.js`**
    - Fixed: `is_pro_plugin_active` → `isProPluginActive`

26. **`Gutenberg/src/embedpress-pdf/edit.js`**
    - Fixed: `is_pro_plugin_active` → `isProPluginActive`

## Impact
These fixes ensure that:
1. Block registration checks use the correct keys from `embedpressGutenbergData.activeBlocks`
2. Property names follow the standardized camelCase convention
3. All blocks will properly register/unregister based on admin settings
4. Pro plugin feature checks work correctly

## Testing
After applying these fixes, verify that:
1. All blocks appear/disappear correctly in the block editor based on admin settings
2. Pro features are properly enabled/disabled based on plugin status
3. No JavaScript console errors related to undefined properties
