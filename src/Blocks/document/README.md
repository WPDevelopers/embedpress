# Document Block

This block allows users to embed documents like PDF, DOC, PPT, XLS etc. in their WordPress posts and pages.

## Features

- Support for multiple document formats (PDF, DOC, PPT, XLS, etc.)
- Multiple viewer options (Custom, MS Office, Google)
- Customizable theme modes (Default, Dark, Light, Custom)
- Toolbar controls for fullscreen, download, print, draw functionality
- Responsive design
- Custom color schemes
- Powered by branding option

## Block Structure

```
document/
├── block.json          # Block configuration
├── README.md          # This file
└── src/
    ├── components/
    │   ├── attributes.js    # Block attributes definition
    │   ├── edit.js         # Editor component
    │   ├── save.js         # Save component
    │   ├── doc-controls.js # Inspector controls
    │   └── doc-style.js    # Dynamic styling
    ├── editor.scss        # Editor-only styles
    ├── style.scss         # Frontend and editor styles
    ├── icon.svg           # Block icon
    ├── example.js         # Block example
    └── index.js           # Main block registration
```

## Usage

1. Add the Document block to your post/page
2. Upload a document file or enter a document URL
3. Configure the viewer settings and appearance options
4. Customize the toolbar and theme as needed

## Supported File Types

- PDF (application/pdf)
- Word Documents (application/msword, .docx)
- PowerPoint Presentations (application/vnd.ms-powerpoint, .pptx, .ppsx)
- Excel Spreadsheets (application/vnd.ms-excel, .xlsx)

## Migration

This block has been migrated from the old Gutenberg structure (`/Gutenberg/src/document`) to the new structure (`/src/Blocks/document`) while maintaining all existing functionality and backward compatibility.
