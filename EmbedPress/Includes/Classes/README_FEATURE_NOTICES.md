# Feature Notices - Quick Guide

## 📍 Location

All feature notices are now registered in a **single, dedicated file**:

```
wp-content/plugins/embedpress/EmbedPress/Includes/Classes/FeatureNotices.php
```

## 🚀 How to Add a New Notice

1. Open `FeatureNotices.php`
2. Find the `register_all_notices()` method
3. Add your notice using the `register_notice()` method

### Basic Example

```php
$notice_manager->register_notice('my_unique_notice_id', [
    'title' => 'New Features',
    'icon' => '🎉',
    'message' => '<strong>Exciting Update!</strong> Check out our new features.',
    'button_text' => 'Learn More',
    'button_url' => admin_url('admin.php?page=embedpress'),
    'skip_text' => 'Skip',
]);
```

## 📋 Available Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `title` | string | No | 'New Features' | Notice title |
| `icon` | string | No | '🎉' | Emoji icon |
| `message` | string | Yes | - | Notice message (HTML allowed) |
| `button_text` | string | No | 'Learn More' | Primary button text |
| `button_url` | string | No | '' | Primary button URL |
| `button_target` | string | No | '_self' | Link target (`_self` or `_blank`) |
| `skip_text` | string | No | 'Skip' | Skip button text |
| `screens` | array | No | [] | Show on specific screens (empty = all pages) |
| `capability` | string | No | 'manage_options' | Required user capability |
| `start_date` | string | No | null | Start showing from this date (Y-m-d) |
| `end_date` | string | No | null | Stop showing after this date (Y-m-d) |
| `priority` | int | No | 10 | Display priority (lower = higher priority) |
| `type` | string | No | 'info' | Notice type: `info`, `success`, `warning`, `error` |

## 🎨 Notice Types

- **info** - Blue theme (default)
- **success** - Green theme
- **warning** - Orange/yellow theme
- **error** - Red theme

## 📅 Date-Based Notices

Show notices only during specific time periods:

```php
$notice_manager->register_notice('black_friday_2024', [
    'title' => 'Limited Time Offer',
    'icon' => '🎁',
    'message' => '<strong>Black Friday Sale!</strong> Get 50% off.',
    'button_text' => 'Claim Discount',
    'button_url' => 'https://embedpress.com/pricing',
    'start_date' => '2024-11-25',
    'end_date' => '2024-12-02',
    'priority' => 1,
]);
```

## 🎯 Screen-Specific Notices

Show notices only on specific admin pages:

```php
$notice_manager->register_notice('settings_update', [
    'title' => 'Update Required',
    'message' => 'Please update your settings.',
    'screens' => ['toplevel_page_embedpress'], // Only on EmbedPress main page
]);
```

### Common Screen IDs

- `toplevel_page_embedpress` - EmbedPress main page
- `dashboard` - WordPress dashboard
- `plugins` - Plugins page
- Leave empty `[]` to show on all admin pages

## 🔔 Priority System

Lower numbers = higher priority (shown first):

```php
// High priority (shown first)
$notice_manager->register_notice('urgent_notice', [
    'priority' => 1,
    // ...
]);

// Normal priority
$notice_manager->register_notice('normal_notice', [
    'priority' => 10,
    // ...
]);

// Low priority (shown last)
$notice_manager->register_notice('low_priority', [
    'priority' => 20,
    // ...
]);
```

## 🎭 User Capabilities

Control who can see the notice:

```php
$notice_manager->register_notice('admin_only', [
    'capability' => 'manage_options', // Only admins
    // ...
]);

$notice_manager->register_notice('editor_and_above', [
    'capability' => 'edit_pages', // Editors and admins
    // ...
]);
```

## 💡 Tips

1. **Unique IDs**: Always use unique notice IDs to avoid conflicts
2. **HTML in Messages**: You can use HTML in the message field
3. **External Links**: Set `button_target` to `'_blank'` for external URLs
4. **Testing**: Comment out old notices instead of deleting them
5. **Organization**: Keep active notices at the top, examples at the bottom

## 🔄 User Actions

Users can interact with notices in two ways:

1. **Dismiss** (X button) - Permanently hides the notice
2. **Skip** - Hides for 7 days, then shows again

## 📝 Complete Example

```php
$notice_manager->register_notice('analytics_launch_2024', [
    'title' => 'New Features',
    'icon' => '📊',
    'message' => '<strong>New In EmbedPress:</strong> Introducing Analytics dashboard to track every embed performance; see total counts, views, clicks, geo insights, etc.',
    'button_text' => 'View Analytics',
    'button_url' => admin_url('admin.php?page=embedpress&page_type=analytics'),
    'button_target' => '_self',
    'skip_text' => 'Maybe Later',
    'screens' => [], // Show on all admin pages
    'capability' => 'manage_options',
    'start_date' => '2024-01-01',
    'end_date' => '2025-12-31',
    'priority' => 10,
    'type' => 'info',
]);
```

## 🛠️ Helper Method

Use the built-in helper for EmbedPress URLs:

```php
// Instead of:
'button_url' => admin_url('admin.php?page=embedpress&page_type=analytics'),

// You can use:
'button_url' => $this->get_embedpress_url('analytics'),
```

## 📚 More Information

For detailed documentation, see:
- `docs/README_FEATURE_NOTICES.md` - Full documentation
- `docs/feature-notice-system.md` - System architecture
- `FeatureNoticeManager.php` - Core implementation

---

**Need Help?** Check the commented examples in `FeatureNotices.php` for more use cases!

