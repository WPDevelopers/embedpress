# EmbedPress Height Exclusion Feature

This feature allows you to exclude specific embed sources from having height attributes applied to them. This is useful when certain providers need to maintain their original height or use responsive height behavior.

## How to Use

### Method 1: Using WordPress Filter (Recommended)

Add this code to your theme's `functions.php` file or in a custom plugin:

```php
/**
 * Exclude specific sources from height attribute application
 */
function my_embedpress_exclude_height_sources($excluded_sources) {
    // Add provider names that should not have height applied
    $excluded_sources[] = 'twitter';
    $excluded_sources[] = 'instagram';
    $excluded_sources[] = 'facebook';
    $excluded_sources[] = 'tiktok';
    
    return $excluded_sources;
}
add_filter('embedpress_excluded_height_sources', 'my_embedpress_exclude_height_sources');
```

### Method 2: Direct Configuration

You can also modify the default excluded sources directly in the `get_excluded_height_sources()` method in `EmbedPress/Shortcode.php`:

```php
protected static function get_excluded_height_sources()
{
    // Default excluded sources - you can add more here
    $defaultExcluded = [
        'twitter',
        'instagram', 
        'facebook',
        'tiktok',
        // Add more provider names here
    ];
    
    // ... rest of the method
}
```

## Provider Names

The provider names are normalized (lowercase, spaces and commas replaced with hyphens). Common provider names include:

- `twitter` (for Twitter/X embeds)
- `instagram` (for Instagram embeds)
- `facebook` (for Facebook embeds)
- `tiktok` (for TikTok embeds)
- `youtube` (for YouTube embeds)
- `vimeo` (for Vimeo embeds)
- `twitch` (for Twitch embeds)
- `spotify` (for Spotify embeds)

## How It Works

1. When an embed is processed, the system checks if the provider name is in the excluded list
2. If excluded, width attributes are still applied (for responsive behavior) but height attributes are skipped
3. This allows the embed to maintain its original height or use its own responsive height behavior

## Example Usage

```php
// Exclude Twitter and Instagram from height modifications
add_filter('embedpress_excluded_height_sources', function($excluded) {
    return array_merge($excluded, ['twitter', 'instagram']);
});
```

This will ensure that Twitter and Instagram embeds maintain their original height while still allowing width modifications for responsive behavior.
