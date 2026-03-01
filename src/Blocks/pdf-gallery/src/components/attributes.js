const attributes = {
    // Core
    clientId: {
        type: 'string',
    },

    // Gallery Items - array of PDF objects
    pdfItems: {
        type: 'array',
        default: [],
        // Each item: { id: number, url: string, fileName: string, customThumbnailId: number, customThumbnailUrl: string }
    },

    // Layout Settings
    layout: {
        type: 'string',
        default: 'grid', // 'grid' | 'masonry' | 'carousel'
    },
    columns: {
        type: 'number',
        default: 3,
    },
    columnsTablet: {
        type: 'number',
        default: 2,
    },
    columnsMobile: {
        type: 'number',
        default: 1,
    },
    gap: {
        type: 'number',
        default: 20,
    },
    thumbnailAspectRatio: {
        type: 'string',
        default: '4:3',
    },
    thumbnailBorderRadius: {
        type: 'number',
        default: 8,
    },

    // Carousel Settings
    carouselAutoplay: {
        type: 'boolean',
        default: false,
    },
    carouselAutoplaySpeed: {
        type: 'number',
        default: 3000,
    },
    carouselLoop: {
        type: 'boolean',
        default: true,
    },
    carouselArrows: {
        type: 'boolean',
        default: true,
    },
    carouselDots: {
        type: 'boolean',
        default: false,
    },
    slidesPerView: {
        type: 'number',
        default: 3,
    },

    // Popup / Viewer Settings
    viewerStyle: {
        type: 'string',
        default: 'modern',
    },
    themeMode: {
        type: 'string',
        default: 'default',
    },
    customColor: {
        type: 'string',
        default: '#403A81',
    },
    toolbar: {
        type: 'boolean',
        default: true,
    },
    position: {
        type: 'string',
        default: 'top',
    },
    flipbook_toolbar_position: {
        type: 'string',
        default: 'bottom',
    },
    presentation: {
        type: 'boolean',
        default: true,
    },
    download: {
        type: 'boolean',
        default: true,
    },
    copy_text: {
        type: 'boolean',
        default: true,
    },
    draw: {
        type: 'boolean',
        default: true,
    },
    add_text: {
        type: 'boolean',
        default: true,
    },
    add_image: {
        type: 'boolean',
        default: true,
    },
    doc_rotation: {
        type: 'boolean',
        default: true,
    },
    doc_details: {
        type: 'boolean',
        default: true,
    },
    zoomIn: {
        type: 'boolean',
        default: true,
    },
    zoomOut: {
        type: 'boolean',
        default: true,
    },
    fitView: {
        type: 'boolean',
        default: true,
    },
    bookmark: {
        type: 'boolean',
        default: true,
    },

    // Watermark
    watermarkText: {
        type: 'string',
        default: '',
    },
    watermarkFontSize: {
        type: 'number',
        default: 48,
    },
    watermarkColor: {
        type: 'string',
        default: '#000000',
    },
    watermarkOpacity: {
        type: 'number',
        default: 15,
    },
    watermarkStyle: {
        type: 'string',
        default: 'center',
    },

    // Powered by
    powered_by: {
        type: 'boolean',
        default: true,
    },
};

export default attributes;
