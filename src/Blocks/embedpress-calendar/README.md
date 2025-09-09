# Google Calendar Block

This block allows users to embed Google Calendar in their WordPress posts and pages.

## Features

- Support for public Google Calendar embedding
- Private calendar support (requires EmbedPress Pro)
- Customizable width and height
- Responsive design
- Powered by branding option
- Alignment support (left, center, right)

## Block Structure

```
embedpress-calendar/
├── block.json          # Block configuration
├── README.md          # This file
└── src/
    ├── components/
    │   ├── attributes.js    # Block attributes definition
    │   ├── edit.js         # Editor component
    │   └── save.js         # Save component (returns null - uses render callback)
    ├── editor.scss        # Editor-only styles
    ├── style.scss         # Frontend and editor styles
    ├── icon.svg           # Block icon
    ├── example.js         # Block example
    └── index.js           # Main block registration
```

## Usage

1. Add the Google Calendar block to your post/page
2. Enter a public Google Calendar embed URL
3. Configure the width, height, and other options
4. Choose between public and private calendar options

## Calendar Types

- **Public Calendar**: Can be embedded without API key, shows immediately in editor
- **Private Calendar**: Requires EmbedPress Pro, shows only on frontend

## Supported URL Format

The block accepts Google Calendar embed URLs in this format:
```
https://calendar.google.com/calendar/embed?src=...
```

## Migration

This block has been migrated from the old Gutenberg structure (`/Gutenberg/src/embedpress-calendar`) to the new structure (`/src/Blocks/embedpress-calendar`) while maintaining all existing functionality and backward compatibility.
