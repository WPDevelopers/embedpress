# EmbedPress Migration System

This document explains the comprehensive migration system implemented to handle the transition from the old Gutenberg block structure to the new structure without breaking existing content.

## Overview

The migration system ensures that when users update EmbedPress from a previous version, their existing content continues to work seamlessly. It handles:

- Block structure migration
- Attribute mapping from old to new format
- Content preservation
- Graceful fallbacks for edge cases
- Comprehensive logging and error handling

## Components

### 1. Migration.php
The main migration controller that:
- Detects version changes
- Runs migration scripts automatically
- Updates block content in the database
- Migrates plugin settings
- Provides comprehensive logging

### 2. deprecated.js
Enhanced deprecation support that:
- Handles multiple old block versions
- Provides migration functions for each version
- Ensures backward compatibility
- Maps old attributes to new structure

### 3. FallbackHandler.php
Graceful fallback system that:
- Handles edge cases where migration fails
- Provides content fallbacks for corrupted blocks
- Validates and fixes block attributes
- Generates error messages for invalid content

### 4. MigrationAjaxHandler.php
AJAX functionality for:
- Dismissing migration notices
- Getting migration status
- Viewing migration logs
- Clearing logs
- Force re-running migration

### 5. MigrationAdminPage.php
Admin interface that provides:
- Migration status dashboard
- Migration logs viewer
- Manual migration controls
- Clear documentation for users

## Migration Process

### Automatic Migration
1. **Version Detection**: On plugin update, the system detects version changes
2. **Database Scan**: Finds all posts with old EmbedPress blocks
3. **Content Migration**: Updates block content to new structure
4. **Attribute Mapping**: Maps old attributes to new format
5. **Settings Update**: Updates plugin settings for new system
6. **Logging**: Records all migration activities

### Block Deprecation
1. **Version Identification**: Identifies which old version a block uses
2. **Attribute Migration**: Runs migration function for that version
3. **Content Preservation**: Ensures content remains functional
4. **Progressive Enhancement**: Gradually updates to latest structure

### Fallback Handling
1. **Content Validation**: Checks if block content is valid
2. **Attribute Fixing**: Repairs corrupted or missing attributes
3. **Content Generation**: Generates fallback content when needed
4. **Error Handling**: Provides user-friendly error messages

## Migration Scenarios

### Scenario 1: Standard Update
- User updates plugin from old version
- Migration runs automatically on admin page load
- All content is migrated successfully
- User sees success notice

### Scenario 2: Partial Migration Failure
- Some blocks fail to migrate due to corrupted data
- Fallback handler provides working content
- Migration logs record the issues
- Admin can review and fix manually

### Scenario 3: Complete Migration Failure
- Migration process encounters critical error
- System falls back to old block system
- Error notice shown to admin
- Support information provided

## Configuration

### Migration Settings
```php
// Enable/disable automatic migration
add_filter('embedpress_auto_migration_enabled', '__return_true');

// Set migration batch size
add_filter('embedpress_migration_batch_size', function() {
    return 50; // Process 50 posts at a time
});

// Enable debug logging
add_filter('embedpress_migration_debug_logging', '__return_true');
```

### Fallback Configuration
```php
// Customize fallback behavior
add_filter('embedpress_fallback_enabled', '__return_true');

// Custom error messages
add_filter('embedpress_fallback_error_message', function($message, $url) {
    return "Custom error message for: " . $url;
}, 10, 2);
```

## Monitoring and Debugging

### Migration Logs
- All migration activities are logged
- Logs include timestamps and details
- Accessible via admin interface
- Can be cleared when needed

### Status Monitoring
- Migration status dashboard
- Real-time progress tracking
- Error reporting and resolution
- Performance metrics

### Debug Information
```php
// Enable debug mode
define('EMBEDPRESS_MIGRATION_DEBUG', true);

// View migration status
$migration = Migration::get_instance();
$status = $migration->get_migration_status();

// Check if fallback is needed
$fallback = FallbackHandler::get_instance();
$needs_fallback = $fallback->is_fallback_needed($block);
```

## Best Practices

### For Developers
1. Always test migration with real data
2. Use staging environments for testing
3. Monitor migration logs regularly
4. Provide clear error messages
5. Document any custom migration logic

### For Users
1. Backup your site before updating
2. Test content after migration
3. Review migration logs if issues occur
4. Contact support if problems persist
5. Keep plugin updated for latest fixes

## Troubleshooting

### Common Issues

#### Migration Not Running
- Check if user has admin privileges
- Verify version detection is working
- Look for PHP errors in logs
- Ensure database is accessible

#### Content Not Displaying
- Check fallback handler logs
- Verify block attributes are valid
- Test with simple content first
- Review browser console for errors

#### Performance Issues
- Reduce migration batch size
- Run migration during low traffic
- Monitor server resources
- Consider manual migration for large sites

### Recovery Procedures

#### Force Re-run Migration
```php
// Via admin interface
// Go to EmbedPress > Migration > Force Re-run

// Via code
$migration = Migration::get_instance();
$migration->force_migration();
```

#### Reset Migration State
```php
// Clear migration data
delete_option('embedpress_version');
delete_option('embedpress_migration_completed');
delete_option('embedpress_migration_block_structure_count');
```

## Support

For migration issues:
1. Check migration logs first
2. Review this documentation
3. Search existing support tickets
4. Contact EmbedPress support with:
   - Migration logs
   - Site details
   - Specific error messages
   - Steps to reproduce

## Version History

- **4.2.7**: Initial migration system implementation
- **Future**: Planned enhancements and optimizations

## Related Files

- `/src/Blocks/Migration.php` - Main migration controller
- `/src/Blocks/EmbedPress/src/components/deprecated.js` - Block deprecation
- `/src/Blocks/FallbackHandler.php` - Fallback system
- `/src/Blocks/MigrationAjaxHandler.php` - AJAX functionality
- `/src/Blocks/MigrationAdminPage.php` - Admin interface
- `/src/Blocks/assets/migration-ajax.js` - Client-side scripts
