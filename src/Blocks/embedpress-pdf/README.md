# EmbedPress PDF Block

A specialized Gutenberg block for embedding PDF documents with advanced customization options.

## Features

- **Multiple Viewer Styles**: Modern and Flip Book viewing modes
- **Theme Customization**: Light, Dark, System Default, and Custom themes
- **Toolbar Controls**: Configurable toolbar with various PDF interaction tools
- **Content Protection**: Password and user role-based access control
- **Social Sharing**: Built-in social media sharing capabilities
- **Ad Management**: Support for overlay advertisements
- **Responsive Design**: Flexible width and height controls
- **Lazy Loading**: Optional lazy loading for better performance

## Block Structure

```
embedpress-pdf/
├── block.json                 # Block metadata and configuration
├── src/
│   ├── index.js              # Main block registration
│   ├── style.scss            # Frontend styles
│   ├── editor.scss           # Editor-specific styles
│   ├── example.js            # Block example for preview
│   ├── icon.svg              # Block icon
│   └── components/
│       ├── attributes.js     # Block attributes definition
│       ├── edit.js           # Edit component (editor view)
│       ├── save.js           # Save component (frontend render)
│       └── inspector.js      # Inspector controls (sidebar)
└── README.md                 # This file
```

## Usage

1. Add the EmbedPress PDF block to your post or page
2. Upload a PDF file or enter a PDF URL
3. Customize the viewer settings in the block inspector
4. Configure content protection if needed
5. Set up social sharing options
6. Publish your content

## Attributes

### Core Attributes
- `href`: PDF file URL
- `fileName`: Name of the PDF file
- `mime`: MIME type (application/pdf)
- `width`/`height`: Dimensions
- `unitoption`: Unit type (% or px)

### Viewer Settings
- `viewerStyle`: modern | flip-book
- `themeMode`: default | light | dark | custom
- `customColor`: Custom theme color
- `toolbar`: Enable/disable toolbar
- `presentation`: Presentation mode
- `lazyLoad`: Lazy loading

### Content Protection
- `lockContent`: Enable content protection
- `protectionType`: password | user-role
- `contentPassword`: Password for access
- `userRole`: Allowed user roles

### Social Sharing
- `contentShare`: Enable social sharing
- `sharePosition`: left | right | top | bottom
- `shareFacebook`/`shareTwitter`/etc.: Individual platform toggles

## Development

This block follows the EmbedPress block structure pattern and integrates with the existing EmbedPress ecosystem, including:

- Global components for shared functionality
- Content protection system
- Social sharing system
- Ad management system
- Analytics tracking

## Compatibility

- WordPress 5.0+
- Gutenberg block editor
- EmbedPress plugin ecosystem
- Modern browsers with PDF support
