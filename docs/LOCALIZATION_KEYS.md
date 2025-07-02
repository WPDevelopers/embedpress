# EmbedPress Localization Keys Documentation

This document outlines the standardized localization keys used throughout EmbedPress for JavaScript localization.

## Overview

EmbedPress uses WordPress's `wp_localize_script()` function to pass PHP data to JavaScript. Previously, the plugin used inconsistent variable names that were unclear and potentially conflicting. This has been standardized to use descriptive, consistent naming conventions.

## Standardized Localization Variables

### 1. `embedpressPreviewData` (Preview Script)
**Script Handle:** `embedpress`  
**File:** `static/js/preview.js`  
**Previous Name:** `$data`

```javascript
// Usage in JavaScript
embedpressPreviewData.previewSettings.baseUrl
embedpressPreviewData.shortcode
embedpressPreviewData.assetsUrl
embedpressPreviewData.urlSchemes
```

**Data Structure:**
```php
[
    'previewSettings' => [
        'baseUrl'    => get_site_url() . '/',
        'versionUID' => $version,
        'debug'      => defined('WP_DEBUG') && WP_DEBUG,
    ],
    'shortcode'  => $shortcode,
    'assetsUrl' => $assets_url,
    'urlSchemes' => $url_schemes,
]
```

### 2. `embedpressAdminParams` (Admin Parameters)
**Script Handle:** `embedpress`  
**File:** `static/js/preview.js`  
**Previous Name:** `EMBEDPRESS_ADMIN_PARAMS`

```javascript
// Usage in JavaScript
embedpressAdminParams.ajaxUrl
embedpressAdminParams.nonce
```

**Data Structure:**
```php
[
    'ajaxUrl' => admin_url('admin-ajax.php'),
    'nonce'   => wp_create_nonce('embedpress')
]
```

### 3. `embedpressLicenseData` (License Management)
**Script Handle:** `embedpress-lisence`  
**File:** `static/js/license.js`  
**Previous Name:** `wpdeveloperLicenseManagerNonce`

```javascript
// Usage in JavaScript
embedpressLicenseData.nonce
```

**Data Structure:**
```php
[
    'nonce' => wp_create_nonce('wpdeveloper_sl_' . $item_id . '_nonce')
]
```

### 4. `embedpressGutenbergData` (Gutenberg Blocks)
**Script Handle:** `embedpress_blocks-cgb-block-js`  
**File:** `Gutenberg/src/embedpress/` and `src/Blocks/EmbedPress/src/`  
**Previous Name:** `embedpressObj`

```javascript
// Usage in JavaScript
embedpressGutenbergData.isProPluginActive
embedpressGutenbergData.siteUrl
embedpressGutenbergData.activeBlocks
embedpressGutenbergData.sourceNonce
embedpressGutenbergData.brandingLogos.youtube
```

**Data Structure:**
```php
[
    'wistiaLabels'  => json_encode($wistia_labels),
    'wistiaOptions' => $wistia_options,
    'poweredBy' => apply_filters('embedpress_document_block_powered_by', true),
    'isProVersion' => defined('EMBEDPRESS_PRO_PLUGIN_FILE'),
    'twitchHost' => !empty($pars_url['host']) ? $pars_url['host'] : '',
    'siteUrl' => site_url(),
    'activeBlocks' => $active_blocks,
    'documentCta' => $documents_cta_options,
    'pdfRenderer' => self::get_pdf_renderer(),
    'isProPluginActive' => defined('EMBEDPRESS_SL_ITEM_SLUG'),
    'ajaxUrl' => admin_url('admin-ajax.php'),
    'sourceNonce' => wp_create_nonce('source_nonce_embedpress'),
    'canUploadMedia' => current_user_can('upload_files'),
    'assetsUrl' => $assets_url,
    'iframeWidth' => Helper::get_options_value('enableEmbedResizeWidth', '600'),
    'iframeHeight' => Helper::get_options_value('enableEmbedResizeHeight', '400'),
    'pdfCustomColor' => Helper::get_options_value('custom_color', '#403A81'),
    'brandingLogos' => [
        'youtube' => Helper::get_branding_value('logo_url', 'youtube'),
        'vimeo' => Helper::get_branding_value('logo_url', 'vimeo'),
        'wistia' => Helper::get_branding_value('logo_url', 'wistia'),
        'twitch' => Helper::get_branding_value('logo_url', 'twitch'),
        'dailymotion' => Helper::get_branding_value('logo_url', 'dailymotion'),
    ],
    'userRoles' => Helper::get_user_roles(),
    'currentUser' => $current_user->data,
    'feedbackSubmitted' => get_option('embedpress_feedback_submited'),
    'ratingHelpDisabled' => Helper::get_options_value('turn_off_rating_help', false),
]
```

### 5. `embedpressFrontendData` (Frontend Scripts)
**Script Handle:** `embedpress-front-legacy`  
**File:** `static/js/front.js`, `static/js/ads.js`  
**Previous Name:** `eplocalize`

```javascript
// Usage in JavaScript
embedpressFrontendData.ajaxUrl
embedpressFrontendData.isProPluginActive
embedpressFrontendData.nonce
```

**Data Structure:**
```php
[
    'ajaxUrl' => admin_url('admin-ajax.php'),
    'isProPluginActive' => defined('EMBEDPRESS_SL_ITEM_SLUG'),
    'nonce' => wp_create_nonce('ep_nonce'),
]
```

### 6. `embedpressSettingsData` (Settings Page)
**Script Handle:** `ep-settings-script`  
**File:** Settings page scripts  
**Previous Name:** `embedpressObj`

```javascript
// Usage in JavaScript
embedpressSettingsData.nonce
```

**Data Structure:**
```php
[
    'nonce' => wp_create_nonce('embedpress_elements_action'),
]
```

### 7. `embedpressNewBlocksData` (New Block System)
**Script Handle:** `embedpress_blocks-cgb-block-js`  
**File:** New block system files  
**Previous Name:** `embedpressBlockData`

```javascript
// Usage in JavaScript
embedpressNewBlocksData.pluginDirPath
embedpressNewBlocksData.activeBlocks
embedpressNewBlocksData.ajaxUrl
embedpressNewBlocksData.restUrl
```

**Data Structure:**
```php
[
    'pluginDirPath' => defined('EMBEDPRESS_PATH_BASE') ? EMBEDPRESS_PATH_BASE : '',
    'pluginDirUrl' => defined('EMBEDPRESS_URL_STATIC') ? EMBEDPRESS_URL_STATIC . '../' : '',
    'activeBlocks' => $active_blocks,
    'canUploadMedia' => current_user_can('upload_files'),
    'ajaxUrl' => admin_url('admin-ajax.php'),
    'nonce' => wp_create_nonce('embedpress_nonce'),
    'restUrl' => rest_url('embedpress/v1/'),
    'siteUrl' => site_url(),
]
```

### 8. `embedpressCalendarData` (Google Calendar Widget)
**Script Handle:** `epgc`  
**File:** Calendar widget scripts  
**Previous Name:** `epgc_object`

```javascript
// Usage in JavaScript
embedpressCalendarData.ajaxUrl
embedpressCalendarData.nonce
embedpressCalendarData.translations.allDay
```

**Data Structure:**
```php
[
    'ajaxUrl' => admin_url('admin-ajax.php'),
    'nonce' => $nonce,
    'translations' => [
        'allDay' => __('All day', 'embedpress'),
        'createdBy' => __('Created by', 'embedpress'),
        'goToEvent' => __('Go to event', 'embedpress'),
        'unknownError' => __('Unknown error', 'embedpress'),
        'requestError' => __('Request error', 'embedpress'),
        'loading' => __('Loading', 'embedpress')
    ]
]
```

## Migration Guide

### For Developers

When updating existing code, replace the old variable names with the new standardized names:

```javascript
// OLD
$data.EMBEDPRESS_SHORTCODE
embedpressGutenbergData.is_pro_plugin_active
eplocalize.ajaxurl
epgc_object.ajax_url

// NEW
embedpressPreviewData.shortcode
embedpressGutenbergData.isProPluginActive
embedpressFrontendData.ajaxUrl
embedpressCalendarData.ajaxUrl
```

### Property Name Changes

Key property names have also been standardized to use camelCase:

```javascript
// OLD
embedpressGutenbergData.ajax_url
embedpressGutenbergData.is_pro_plugin_active
embedpressGutenbergData.site_url
embedpressGutenbergData.active_blocks

// NEW
embedpressGutenbergData.ajaxUrl
embedpressGutenbergData.isProPluginActive
embedpressGutenbergData.siteUrl
embedpressGutenbergData.activeBlocks
```

## Benefits of Standardization

1. **Clarity**: Variable names clearly indicate their purpose and scope
2. **Consistency**: All variables follow the same naming convention
3. **No Conflicts**: Avoids potential conflicts with other plugins using generic names like `$data`
4. **Maintainability**: Easier to understand and maintain the codebase
5. **Documentation**: Self-documenting variable names reduce the need for extensive comments

## Debugging

Use the debug endpoint to check localization status:

```javascript
// AJAX call to debug localization
jQuery.post(ajaxurl, {
    action: 'embedpress_debug_localization'
}, function(response) {
    console.log('Localization Status:', response.data);
});
```

This will show which scripts are registered, enqueued, and have localization data attached.
