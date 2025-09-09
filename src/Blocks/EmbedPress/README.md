# EmbedPress Block - Save Function Implementation

This document explains the new save function implementation for EmbedPress Gutenberg blocks.

## Overview

The EmbedPress block now uses a hybrid approach:
- **Static content** (YouTube, Vimeo, Google Docs, etc.) is saved to the database using the `save` function with the exact same layout and design as the editor
- **Dynamic content** (Google Photos, Instagram feeds, OpenSea) continues to use `render_callback` for real-time data
- **No loading messages** - content appears immediately on the frontend with the same styling as in the editor

## Architecture

### Files Modified

1. **`src/components/save.js`** - Implements the save function logic
2. **`frontend-renderer.php`** - Handles frontend rendering of static content
3. **`render-callbacks.php`** - Modified to only handle dynamic content
4. **`assets/js/frontend-renderer.js`** - Frontend JavaScript for static content
5. **`assets/css/frontend-renderer.css`** - Styling for frontend rendering

### Content Type Detection

The system automatically detects whether content requires dynamic rendering:

```javascript
// Dynamic providers that require real-time data
const dynamicProviders = [
    'photos.app.goo.gl',
    'photos.google.com', 
    'instagram.com',
    'opensea.io'
];
```

### Save Function Logic

```javascript
export default function Save({ attributes }) {
    const { url, embedHTML, contentShare, sharePosition, customlogo, logoX, logoY, logoOpacity } = attributes;

    // Check if this is dynamic content
    const isDynamicContent = isDynamicProvider(url);

    // For dynamic content, return null to use render_callback
    if (isDynamicContent) {
        return null;
    }

    // For static content, save the actual embed HTML with full layout
    const completeHTML = `
        <div class="gutenberg-block-wraper">
            <div class="ep-embed-content-wraper" style="position: relative; display: inline-block; width: 100%;">
                ${embedHTML}
                ${logoHTML}
                ${shareHTML}
            </div>
        </div>
    `;

    return (
        <div className={classes.join(' ')} data-source-id={`source-${clientId}`}>
            <RawHTML>{completeHTML}</RawHTML>
        </div>
    );
}
```

### Frontend Rendering

Static content is now saved directly in the database with the complete layout:

1. **Editor**: When saving, the `embedHTML` from attributes is combined with custom logos and social sharing
2. **Database**: Complete HTML structure is saved with exact same styling as editor
3. **Frontend**: Content appears immediately without any loading states or AJAX requests
4. **Layout**: Maintains exact same design, positioning, and functionality as in the editor

### Render Callback

The render callback now only handles dynamic content:

```php
function embedpress_render_block($attributes, $content = '', $block = null) {
    $url = $attributes['url'] ?? '';
    
    // For static content, return the saved content
    if (!embedpress_is_dynamic_provider($url)) {
        return $content;
    }
    
    // Continue with dynamic content rendering...
}
```

## Benefits

### Performance
- **Instant loading**: Static content appears immediately with no loading states
- **Reduced server load**: No AJAX requests or API calls on page load
- **Better caching**: Static content works perfectly with page caching plugins
- **Faster page loads**: Complete HTML is served directly from database

### SEO
- **Content indexing**: Static content is fully available to search engines
- **No JavaScript dependency**: Content is visible even with JavaScript disabled
- **Better Core Web Vitals**: No layout shifts, instant rendering
- **Faster crawling**: Search engines see content immediately

### User Experience
- **Exact editor layout**: Frontend matches editor design perfectly
- **No loading messages**: Content appears instantly without placeholders
- **Consistent styling**: All customizations (logos, sharing, etc.) preserved
- **Progressive enhancement**: Works even if JavaScript fails

## Dynamic vs Static Content

### Static Content (uses save function)
- YouTube videos
- Vimeo videos
- Google Docs/Sheets/Slides
- PDF documents
- Most oEmbed providers

### Dynamic Content (uses render_callback)
- Google Photos albums (real-time photo updates)
- Instagram feeds (live social media content)
- OpenSea NFT collections (price/availability changes)
- Any content requiring API calls for fresh data

## Backward Compatibility

- Existing blocks continue to work without modification
- Old blocks using render_callback are automatically detected
- No database migration required
- Gradual transition as blocks are re-saved

## Testing

To test the implementation:

1. **Create a YouTube embed**: Should save content to database
2. **Create an Instagram feed**: Should use render_callback
3. **Check page source**: Static content should be visible in HTML
4. **Disable JavaScript**: Static content should still display

## Configuration

### Adding New Dynamic Providers

To add a new provider that requires dynamic rendering:

```php
// In frontend-renderer.php
function embedpress_is_dynamic_provider($url) {
    $dynamic_providers = [
        'photos.app.goo.gl',
        'photos.google.com',
        'instagram.com',
        'opensea.io',
        'new-dynamic-provider.com', // Add here
    ];
    
    foreach ($dynamic_providers as $provider) {
        if (strpos($url, $provider) !== false) {
            return true;
        }
    }
    
    return false;
}
```

### Customizing Static Rendering

Use the filter hook to customize static embed HTML:

```php
add_filter('embedpress_static_embed_html', function($html, $url, $attributes) {
    // Custom processing for specific providers
    return $html;
}, 10, 3);
```

## Troubleshooting

### Static Content Not Loading
1. Check browser console for JavaScript errors
2. Verify AJAX endpoint is accessible
3. Check if content provider is correctly classified

### Dynamic Content Issues
1. Ensure provider is in dynamic providers list
2. Check render_callback function
3. Verify API keys and settings

### Performance Issues
1. Monitor AJAX requests for static content
2. Check database query performance
3. Consider implementing additional caching
