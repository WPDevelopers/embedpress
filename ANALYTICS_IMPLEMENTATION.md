# EmbedPress Analytics Implementation

## Overview

This document outlines the comprehensive analytics system implemented for the EmbedPress plugin. The system tracks embedded content usage across Elementor, Gutenberg, and Shortcodes, providing detailed analytics and milestone notifications.

## Features Implemented

### 1. Database Schema
- **Tables Created Automatically**: Database tables are created when the plugin is used, not just during activation
- **Four Main Tables**:
  - `embedpress_analytics_content`: Tracks embedded content by type
  - `embedpress_analytics_views`: Tracks individual interactions (views, clicks, impressions)
  - `embedpress_analytics_browser_info`: Stores browser and device information
  - `embedpress_analytics_milestones`: Tracks milestone achievements

### 2. Content Tracking
- **Elementor Widget Tracking**: Automatically tracks when content is embedded via Elementor
- **Gutenberg Block Tracking**: Tracks Gutenberg block usage
- **Shortcode Tracking**: Monitors shortcode-based embeds
- **Provider Detection**: Automatically detects content providers (YouTube, Vimeo, etc.)

### 3. Analytics Data Collection
- **Total Embedded Content**: Count by type (Elementor/Gutenberg/Shortcode)
- **Views Analytics**: Individual content views with time-based graphs
- **Browser Analytics**: Browser, OS, and device type distribution
- **Engagement Metrics**: Impressions, clicks, views tracking
- **Performance Data**: Comprehensive analytics dashboard

### 4. Milestone System
- **Achievement Tracking**: Monitors total views, embeds, daily/monthly metrics
- **Notification System**: Congratulates users on milestones (upsell feature)
- **Progress Tracking**: Shows progress toward next milestones
- **Configurable Thresholds**: Predefined milestone values

### 5. Frontend Tracking
- **JavaScript Tracker**: Comprehensive frontend tracking script
- **Intersection Observer**: Tracks when content becomes visible
- **Interaction Events**: Monitors clicks, plays, pauses, completions
- **Session Management**: Tracks user sessions and behavior
- **Browser Detection**: Collects detailed browser information

### 6. Admin Dashboard
- **Analytics Page**: Comprehensive dashboard with charts and graphs
- **Overview Cards**: Total embeds, views, clicks, impressions
- **Interactive Charts**: Time-based analytics with Chart.js
- **Top Content**: Performance rankings
- **Browser Analytics**: Distribution charts with tabs
- **Milestone Progress**: Visual progress bars
- **Export Options**: CSV export (PDF export in Pro)

### 7. REST API
- **Public Tracking Endpoint**: `/wp-json/embedpress/v1/analytics/track`
- **Admin Data Endpoints**: Various endpoints for dashboard data
- **Secure Access**: Proper permission checks and nonce verification
- **Error Handling**: Comprehensive error handling and retries

## File Structure

### Core Analytics Classes
```
EmbedPress/Includes/Classes/Analytics/
├── Analytics_Manager.php       # Main analytics coordinator
├── Data_Collector.php         # Data collection and storage
├── Milestone_Manager.php      # Milestone tracking and notifications
├── Browser_Detector.php       # Browser and device detection
└── REST_API.php               # REST API endpoints
```

### Database Schema
```
EmbedPress/Includes/Classes/Database/
└── Analytics_Schema.php       # Database table creation and management
```

### Admin Dashboard
```
EmbedPress/Ends/Back/Settings/
├── templates/analytics.php    # Dashboard HTML template
├── assets/js/analytics.js     # Dashboard JavaScript
└── assets/css/analytics.css   # Dashboard styles
```

### Frontend Tracking
```
assets/js/
└── analytics-tracker.js       # Frontend tracking script
```

## Integration Points

### 1. Main Plugin Initialization
- `embedpress.php`: Analytics Manager initialization
- Automatic table creation on plugin use

### 2. Content Tracking Integration
- **Shortcode**: `EmbedPress/Shortcode.php` - Added tracking in `parseContent()`
- **Gutenberg**: `Gutenberg/block-backend/block-embedpress.php` - Added tracking in render function
- **Elementor**: `EmbedPress/Elementor/Widgets/Embedpress_Elementor.php` - Added tracking in render method

### 3. Frontend Integration
- Analytics tracker script enqueued on pages with embedded content
- Data attributes added to embedded content for tracking
- Session management and interaction monitoring

## Key Features

### Automatic Database Creation
- Tables are created when analytics is first used
- No manual activation required
- Version-controlled schema updates

### Comprehensive Tracking
- **Content Creation**: Tracks when content is embedded
- **User Interactions**: Views, clicks, impressions, media events
- **Browser Analytics**: Detailed browser and device information
- **Performance Metrics**: Load times, engagement duration

### Milestone Notifications
- **Achievement Types**: Total views, embeds, daily/monthly metrics
- **Notification System**: WordPress transients for admin notifications
- **Upsell Integration**: Milestone achievements promote Pro features
- **Progress Tracking**: Visual progress toward next milestones

### Modern Dashboard
- **Responsive Design**: Mobile-friendly analytics dashboard
- **Interactive Charts**: Chart.js integration for data visualization
- **Real-time Updates**: AJAX-powered data refresh
- **Export Functionality**: CSV export with Pro upgrade prompts

## Usage

### For Developers
1. Analytics are automatically initialized when the plugin loads
2. Content tracking happens automatically for all embed methods
3. Frontend tracking requires no additional setup
4. Dashboard is accessible via WordPress admin menu

### For Users
1. **View Analytics**: Navigate to EmbedPress > Analytics in WordPress admin
2. **Track Performance**: Monitor embed performance and user engagement
3. **Milestone Notifications**: Receive congratulations on achievements
4. **Export Data**: Download analytics data for external analysis

### Testing
- Test file included: `test-analytics.php`
- Accessible via admin menu: EmbedPress > Analytics Test
- Comprehensive system validation

## Security Considerations

- **Nonce Verification**: All AJAX requests use WordPress nonces
- **Permission Checks**: Admin-only access to sensitive data
- **Data Sanitization**: All input data is properly sanitized
- **SQL Injection Prevention**: Prepared statements throughout

## Performance Optimizations

- **Efficient Queries**: Optimized database queries with proper indexing
- **Caching**: Transient caching for milestone notifications
- **Lazy Loading**: Frontend tracking only loads on pages with embeds
- **Debounced Events**: Prevents excessive tracking calls

## Future Enhancements

- **Pro Features**: Advanced analytics, detailed reports, custom date ranges
- **Export Options**: PDF reports, scheduled exports
- **Advanced Filtering**: Content type, date range, provider filtering
- **Real-time Analytics**: Live visitor tracking and real-time updates
- **Integration APIs**: Third-party analytics service integration

## Conclusion

The EmbedPress Analytics system provides comprehensive tracking and reporting for embedded content across all supported platforms. The implementation follows WordPress best practices and provides a solid foundation for future enhancements and Pro features.
