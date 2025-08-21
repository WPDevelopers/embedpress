// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'node:url';
import autoprefixer from 'autoprefixer';
import fs from 'fs';

// WordPress externals mapping
const wordpressExternals = {
    '@wordpress/blocks': 'wp.blocks',
    '@wordpress/block-editor': 'wp.blockEditor',
    '@wordpress/components': 'wp.components',
    '@wordpress/data': 'wp.data',
    '@wordpress/element': 'wp.element',
    '@wordpress/i18n': 'wp.i18n',
    '@wordpress/compose': 'wp.compose',
    '@wordpress/hooks': 'wp.hooks',
    '@wordpress/api-fetch': 'wp.apiFetch',
    '@wordpress/url': 'wp.url',
    '@wordpress/html-entities': 'wp.htmlEntities',
    '@wordpress/keycodes': 'wp.keycodes',
    '@wordpress/primitives': 'wp.primitives',
    '@wordpress/rich-text': 'wp.richText',
    '@wordpress/server-side-render': 'wp.serverSideRender',
    '@wordpress/viewport': 'wp.viewport',
    '@wordpress/notices': 'wp.notices',
    '@wordpress/plugins': 'wp.plugins',
    '@wordpress/edit-post': 'wp.editPost',
    '@wordpress/core-data': 'wp.coreData',
    '@wordpress/blob': 'wp.blob',
    '@wordpress/media-utils': 'wp.mediaUtils',
    'react': 'React',
    'react-dom': 'ReactDOM',
    'jquery': 'jQuery',
    'lodash': 'lodash'
};

const staticAssets = {
    // Common assets (loaded everywhere)
    common: {
        css: [
            'static/css/embedpress.css',
            'static/css/el-icon.css',
            'static/css/font.css'
        ],
        js: [
            'static/js/front.js'
        ],
        intact: false
    },
    // Admin assets
    adminCommon: {
        css: [
            'static/css/admin.css',
            'static/css/admin-notices.css'
        ],
        js: [
            'static/js/admin.js',
            'static/js/license.js'
        ],
        intact: false
    },
    // Settings assets (migrated from old structure)
    settings: {
        css: [
            'static/css/settings-icons.css',
            'static/css/settings.css',
        ],
        js: [
            'static/js/settings.js'
        ],
        intact: false
    },
    // Block-specific assets
    plyer: {
        css: ['static/css/plyr.css'],
        js: [
            'static/js/vendor/plyr.js',
        ],
        intact: true
    },
    plyerPolyfilled: {
        css: [],
        js: [
            'static/js/vendor/plyr.polyfilled.js',
        ],
        intact: true
    },
    initplyr: {
        css: [],
        js: [
            'static/js/initplyr.js',
        ],
        intact: false
    },
    carousel: {
        css: [
            'static/css/carousel.min.css',
        ],
        js: [
            'static/js/vendor/carousel.min.js',
        ],
        intact: true
    },
    glider: {
        css: [
            'static/css/glider.min.css'
        ],
        js: [
            'static/js/vendor/glider.min.js',
        ],
        intact: true
    },
    gallery: {
        css: [],
        js: [
            'static/js/gallery-justify.js',
            'static/js/instafeed.js'
        ],
        intact: false
    },
    elementor: {
        css: ['static/css/embedpress-elementor.css'],
        js: [],
        intact: false
    },
    pdfViewer: {
        css: [],
        js: [
            'static/js/vendor/pdfobject.js',
        ],
        intact: true
    },
    documentViewer: {
        css: [],
        js: ['static/js/documents-viewer-script.js'],
        intact: false
    },
    gutenberg: {
        css: [],
        js: ['static/js/gutneberg-script.js'],
        intact: false
    },
    embedUI: {
        css: [],
        js: ['static/js/vendor/embed-ui.min.js'],
        intact: true
    },
    ads: {
        css: [],
        js: ['static/js/ads.js'],
        intact: false
    },
    analyticsTracker: {
        css: [],
        js: ['static/js/analytics-tracker.js'],
        intact: false
    },
    vendor: {
        css: [],
        js: [
            'static/js/vendor/bootstrap/bootstrap.min.js',
            'static/js/vendor/bootbox.min.js',
        ],
        intact: true
    },
    preview: {
        css: ['static/css/preview.css'],
        js: ['static/js/preview.js'],
        intact: false
    },
};


// Plugin to copy vendor files and static folders to assets folder
function createVendorCopyPlugin() {
    return {
        name: 'vendor-copy',
        buildStart() {
            // Copy vendor files to assets folder for consistency
            const vendorFiles = [
                // CSS files
                { src: 'static/css/plyr.css', dest: 'assets/css/plyr.css' },
                { src: 'static/css/carousel.min.css', dest: 'assets/css/carousel.min.css' },
                { src: 'static/css/glider.min.css', dest: 'assets/css/glider.min.css' },

                // JS files
                { src: 'static/js/vendor/plyr.js', dest: 'assets/js/plyr.js' },
                { src: 'static/js/vendor/plyr.polyfilled.js', dest: 'assets/js/plyr.polyfilled.js' },
                { src: 'static/js/vendor/carousel.min.js', dest: 'assets/js/carousel.min.js' },
                { src: 'static/js/vendor/glider.min.js', dest: 'assets/js/glider.min.js' },
                { src: 'static/js/vendor/pdfobject.js', dest: 'assets/js/pdfobject.js' },
                { src: 'static/js/vendor/embed-ui.min.js', dest: 'assets/js/embed-ui.min.js' },
                { src: 'static/js/vendor/bootstrap/bootstrap.min.js', dest: 'assets/js/bootstrap.min.js' },
                { src: 'static/js/vendor/bootbox.min.js', dest: 'assets/js/bootbox.min.js' },
            ];

            // Copy static folders to assets folder
            const staticFolders = [
                { src: 'static/images', dest: 'assets/images' },
                { src: 'static/pdf', dest: 'assets/pdf' },
                { src: 'static/pdf-flip-book', dest: 'assets/pdf-flip-book' }
            ];

            // Copy all block.json files to assets folder for distribution compatibility
            const blockJsonFiles = [
                { src: 'src/Blocks/EmbedPress/block.json', dest: 'assets/blocks/EmbedPress/block.json' },
                { src: 'src/Blocks/embedpress-pdf/block.json', dest: 'assets/blocks/embedpress-pdf/block.json' },
                { src: 'src/Blocks/document/block.json', dest: 'assets/blocks/document/block.json' },
                { src: 'src/Blocks/embedpress-calendar/block.json', dest: 'assets/blocks/embedpress-calendar/block.json' },
                { src: 'src/Blocks/google-docs/block.json', dest: 'assets/blocks/google-docs/block.json' },
                { src: 'src/Blocks/google-drawings/block.json', dest: 'assets/blocks/google-drawings/block.json' },
                { src: 'src/Blocks/google-forms/block.json', dest: 'assets/blocks/google-forms/block.json' },
                { src: 'src/Blocks/google-maps/block.json', dest: 'assets/blocks/google-maps/block.json' },
                { src: 'src/Blocks/google-sheets/block.json', dest: 'assets/blocks/google-sheets/block.json' },
                { src: 'src/Blocks/google-slides/block.json', dest: 'assets/blocks/google-slides/block.json' },
                { src: 'src/Blocks/twitch/block.json', dest: 'assets/blocks/twitch/block.json' },
                { src: 'src/Blocks/wistia/block.json', dest: 'assets/blocks/wistia/block.json' },
                { src: 'src/Blocks/youtube/block.json', dest: 'assets/blocks/youtube/block.json' }
            ];

            // Function to recursively copy directories
            function copyDirectory(src, dest) {
                try {
                    if (!fs.existsSync(src)) {
                        console.warn(`Source directory does not exist: ${src}`);
                        return;
                    }

                    // Create destination directory if it doesn't exist
                    if (!fs.existsSync(dest)) {
                        fs.mkdirSync(dest, { recursive: true });
                    }

                    const items = fs.readdirSync(src);

                    items.forEach(item => {
                        const srcPath = path.join(src, item);
                        const destPath = path.join(dest, item);
                        const stat = fs.statSync(srcPath);

                        if (stat.isDirectory()) {
                            copyDirectory(srcPath, destPath);
                        } else {
                            fs.copyFileSync(srcPath, destPath);
                        }
                    });

                    console.log(`Copied directory: ${src} → ${dest}`);
                } catch (error) {
                    console.warn(`Failed to copy directory ${src}: ${error.message}`);
                }
            }

            // Copy individual vendor files
            vendorFiles.forEach(({ src, dest }) => {
                try {
                    const srcPath = path.resolve(process.cwd(), src);
                    const destPath = path.resolve(process.cwd(), dest);

                    // Create destination directory if it doesn't exist
                    const destDir = path.dirname(destPath);
                    if (!fs.existsSync(destDir)) {
                        fs.mkdirSync(destDir, { recursive: true });
                    }

                    // Copy file if source exists
                    if (fs.existsSync(srcPath)) {
                        fs.copyFileSync(srcPath, destPath);
                        console.log(`Copied: ${src} → ${dest}`);
                    }
                } catch (error) {
                    console.warn(`Failed to copy ${src}: ${error.message}`);
                }
            });

            // Copy static folders
            staticFolders.forEach(({ src, dest }) => {
                const srcPath = path.resolve(process.cwd(), src);
                const destPath = path.resolve(process.cwd(), dest);
                copyDirectory(srcPath, destPath);
            });

            // Copy block.json files for distribution compatibility
            blockJsonFiles.forEach(({ src, dest }) => {
                try {
                    const srcPath = path.resolve(process.cwd(), src);
                    const destPath = path.resolve(process.cwd(), dest);

                    // Create destination directory if it doesn't exist
                    const destDir = path.dirname(destPath);
                    if (!fs.existsSync(destDir)) {
                        fs.mkdirSync(destDir, { recursive: true });
                    }

                    // Copy file if source exists
                    if (fs.existsSync(srcPath)) {
                        fs.copyFileSync(srcPath, destPath);
                        console.log(`Copied block.json: ${src} → ${dest}`);
                    }
                } catch (error) {
                    console.warn(`Failed to copy block.json ${src}: ${error.message}`);
                }
            });
        }
    };
}

// Virtual plugin to handle static assets
function createStaticAssetsPlugin() {
    return {
        name: 'static-assets',
        resolveId(id) {
            if (id.startsWith('virtual:') || id.includes('virtual:')) {
                const virtualId = id.includes('virtual:') ? id.substring(id.indexOf('virtual:')) : id;
                return virtualId;
            }
            return null;
        },
        load(id) {
            if (id.startsWith('virtual:')) {
                // Map virtual IDs directly to asset groups
                const assetMap = {
                    'virtual:common-assets': staticAssets.common,
                    'virtual:admin-assets': staticAssets.adminCommon,
                    'virtual:initplyr-assets': staticAssets.initplyr,
                    'virtual:carousel-assets': staticAssets.carousel,
                    'virtual:gallery-assets': staticAssets.gallery,
                    'virtual:elementor-assets': staticAssets.elementor,
                    'virtual:pdf-assets': staticAssets.pdfViewer,
                    'virtual:document-assets': staticAssets.documentViewer,
                    'virtual:gutenberg-assets': staticAssets.gutenberg,
                    'virtual:embed-assets': staticAssets.embedUI,
                    'virtual:ads-assets': staticAssets.ads,
                    'virtual:analytics-tracker-assets': staticAssets.analyticsTracker,
                    'virtual:preview-assets': staticAssets.preview,
                    'virtual:settings-assets': staticAssets.settings
                };

                const assets = assetMap[id];
                if (!assets) {
                    return '';
                }

                // Only process assets that should be built (intact: false)
                // Skip vendor files and other intact assets
                if (assets.intact) {
                    return '';
                }

                const imports = [];
                assets.css.forEach(file => {
                    imports.push(`import '${path.resolve(process.cwd(), file)}';`);
                });
                assets.js.forEach(file => {
                    imports.push(`import '${path.resolve(process.cwd(), file)}';`);
                });

                return imports.join('\n');
            }
        }
    };
}

// Build configurations for different contexts
const buildConfigs = {
    // Gutenberg blocks (editor + frontend) - Multiple entry points for separate files
    blocks: {
        input: {
            // Main blocks entry point for shared components and category registration
            'blocks': 'src/Blocks/index.js',
            // Individual block entry points
            'blocks/embedpress': 'src/Blocks/EmbedPress/src/index.js',
            'blocks/document': 'src/Blocks/document/src/index.js',
            'blocks/embedpress-pdf': 'src/Blocks/embedpress-pdf/src/index.js',
            'blocks/embedpress-calendar': 'src/Blocks/embedpress-calendar/src/index.js',
            'blocks/google-docs': 'src/Blocks/google-docs/src/index.js',
            'blocks/google-slides': 'src/Blocks/google-slides/src/index.js',
            'blocks/google-sheets': 'src/Blocks/google-sheets/src/index.js',
            'blocks/google-forms': 'src/Blocks/google-forms/src/index.js',
            'blocks/google-drawings': 'src/Blocks/google-drawings/src/index.js',
            'blocks/google-maps': 'src/Blocks/google-maps/src/index.js',
            'blocks/twitch': 'src/Blocks/twitch/src/index.js',
            'blocks/wistia': 'src/Blocks/wistia/src/index.js',
            'blocks/youtube': 'src/Blocks/youtube/src/index.js'
        },
        output: {
            entryFileNames: 'js/[name].build.js',
            cssFileName: 'css/[name].build.css',
            globals: wordpressExternals,
            external: Object.keys(wordpressExternals),
            format: 'es', // Use ES modules for code-splitting
            // Explicitly disable inlineDynamicImports for multiple entry points
            inlineDynamicImports: false,
            manualChunks: undefined,
            chunkFileNames: 'js/chunks/[name]-[hash].js'
        }
    },
    analytics: {
        input: 'src/Analytics/index.js',
        output: {
            entryFileNames: 'js/analytics.build.js',
            cssFileName: 'css/analytics.build.css',
            globals: wordpressExternals,
            external: Object.keys(wordpressExternals),
            format: 'iife',
            name: 'EmbedPressAnalytics'
        }
    },

    // Admin (React-based admin interface)
    admin: {
        input: 'src/AdminUI/index.js',
        output: {
            entryFileNames: 'js/admin.build.js',
            cssFileName: 'css/admin.build.css',
            globals: { 'react': 'React', 'react-dom': 'ReactDOM' },
            external: ['react', 'react-dom'],
            format: 'iife',
            name: 'EmbedPressAdmin'
        }
    },

    // Frontend scripts (vanilla JS + analytics)
    frontend: {
        input: 'src/Frontend/index.js',
        output: {
            entryFileNames: 'js/frontend.build.js',
            cssFileName: 'css/frontend.build.css',
            globals: { 'jquery': 'jQuery' },
            external: ['jquery'],
            format: 'iife',
            name: 'EmbedPressFrontend'
        }
    },

    // Static assets bundles (only for assets with intact: false)
    'admin-common': {
        input: 'virtual:admin-assets',
        output: {
            entryFileNames: 'js/admin-common.build.js',
            cssFileName: 'css/admin-common.build.css',
            globals: { 'jquery': 'jQuery' },
            external: ['jquery'],
            format: 'iife',
            name: 'EmbedPressAdminCommon'
        }
    },

    'initplyr': {
        input: 'virtual:initplyr-assets',
        output: {
            entryFileNames: 'js/initplyr.build.js',
            cssFileName: 'css/initplyr.build.css',
            globals: { 'jquery': 'jQuery' },
            external: ['jquery'],
            format: 'iife',
            name: 'EmbedPressInitPlyr'
        }
    },



    // Settings bundle (migrated from old structure)
    'settings': {
        input: 'virtual:settings-assets',
        output: {
            entryFileNames: 'js/settings.build.js',
            cssFileName: 'css/settings.build.css',
            globals: { 'jquery': 'jQuery' },
            external: ['jquery'],
            format: 'iife',
            name: 'EmbedPressSettings'
        }
    },
    'preview': {
        input: 'virtual:preview-assets',
        output: {
            entryFileNames: 'js/preview.build.js',
            cssFileName: 'css/preview.build.css',
            globals: { 'jquery': 'jQuery' },
            external: ['jquery'],
            format: 'iife',
            name: 'EmbedPressPreview'
        }
    },

    'common': {
        input: 'virtual:common-assets',
        output: {
            entryFileNames: 'js/common.build.js',
            cssFileName: 'css/common.build.css',
            globals: { 'jquery': 'jQuery' },
            external: ['jquery'],
            format: 'iife',
            name: 'EmbedPressCommon'
        }
    },



    'gallery': {
        input: 'virtual:gallery-assets',
        output: {
            entryFileNames: 'js/gallery.build.js',
            cssFileName: 'css/gallery.build.css',
            globals: { 'jquery': 'jQuery' },
            external: ['jquery'],
            format: 'iife',
            name: 'EmbedPressGallery'
        }
    },

    'elementor': {
        input: 'virtual:elementor-assets',
        output: {
            entryFileNames: 'js/elementor.build.js',
            cssFileName: 'css/elementor.build.css',
            globals: { 'jquery': 'jQuery' },
            external: ['jquery'],
            format: 'iife',
            name: 'EmbedPressElementor'
        }
    },



    'document-viewer': {
        input: 'virtual:document-assets',
        output: {
            entryFileNames: 'js/document-viewer.build.js',
            cssFileName: 'css/document-viewer.build.css',
            globals: { 'jquery': 'jQuery' },
            external: ['jquery'],
            format: 'iife',
            name: 'EmbedPressDocumentViewer'
        }
    },

    'gutenberg': {
        input: 'virtual:gutenberg-assets',
        output: {
            entryFileNames: 'js/gutenberg.build.js',
            cssFileName: 'css/gutenberg.build.css',
            globals: { 'jquery': 'jQuery' },
            external: ['jquery'],
            format: 'iife',
            name: 'EmbedPressGutenberg'
        }
    },



    'ads': {
        input: 'virtual:ads-assets',
        output: {
            entryFileNames: 'js/ads.build.js',
            cssFileName: 'css/ads.build.css',
            globals: { 'jquery': 'jQuery' },
            external: ['jquery'],
            format: 'iife',
            name: 'EmbedPressAds'
        }
    },

    'analytics-tracker': {
        input: 'virtual:analytics-tracker-assets',
        output: {
            entryFileNames: 'js/analytics-tracker.build.js',
            cssFileName: 'css/analytics-tracker.build.css',
            globals: { 'jquery': 'jQuery' },
            external: ['jquery'],
            format: 'iife',
            name: 'EmbedPressAnalyticsTracker'
        }
    },


};

export default defineConfig(({ mode }) => {
    const isProduction = mode === 'production';
    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    // Determine which build to run based on environment variable or default to blocks
    const buildTarget = process.env.BUILD_TARGET || 'blocks';
    const config = buildConfigs[buildTarget];

    if (!config) {
        throw new Error(`Unknown build target: ${buildTarget}. Available targets: ${Object.keys(buildConfigs).join(', ')}`);
    }

    return {
        base: './', // Use relative base path to preserve relative URLs
        plugins: [
            // Copy vendor files to assets folder for consistency
            createVendorCopyPlugin(),
            // Custom plugin to handle JSX in .js files
            {
                name: 'treat-js-files-as-jsx',
                async transform(code, id) {
                    if (!id.endsWith('.js')) return null;
                    if (id.includes('node_modules')) return null;

                    // Check if the file contains JSX syntax
                    if (code.includes('<') && code.includes('>')) {
                        // Transform using esbuild
                        const esbuild = await import('esbuild');
                        const result = await esbuild.transform(code, {
                            loader: 'jsx',
                            jsx: 'automatic',
                            jsxImportSource: 'react'
                        });
                        return result.code;
                    }
                    return null;
                }
            },
            createStaticAssetsPlugin(),
            react({
                jsxRuntime: 'automatic',
                include: ['**/*.jsx'], // Only process .jsx files with React plugin
            }),
        ],
        build: {
            outDir: 'assets',
            emptyOutDir: false,
            sourcemap: !isProduction,
            cssCodeSplit: false,
            target: 'es2015',
            minify: isProduction,
            rollupOptions: {
                input: typeof config.input === 'string'
                    ? path.resolve(__dirname, config.input)
                    : Object.fromEntries(
                        Object.entries(config.input).map(([key, value]) => [
                            key,
                            path.resolve(__dirname, value)
                        ])
                    ),
                output: {
                    format: config.output.format,
                    entryFileNames: config.output.entryFileNames,
                    assetFileNames: (assetInfo) => {
                        const ext = path.extname(assetInfo.names?.[0] || '');
                        if (ext === '.css') {
                            return config.output.cssFileName;
                        }
                        if (['.png', '.jpg', '.jpeg', '.gif', '.svg'].includes(ext)) {
                            return 'img/[name][extname]';
                        }
                        if (['.woff', '.woff2', '.ttf', '.eot'].includes(ext)) {
                            return 'fonts/[name][extname]';
                        }
                        return 'assets/[name][extname]';
                    },
                    globals: config.output.globals,
                    name: config.output.name,
                    // Use configuration-specific settings from config.output
                    ...(config.output.inlineDynamicImports !== undefined && { inlineDynamicImports: config.output.inlineDynamicImports }),
                    ...(config.output.manualChunks !== undefined && { manualChunks: config.output.manualChunks }),
                    ...(config.output.chunkFileNames && { chunkFileNames: config.output.chunkFileNames })
                },
                external: config.output.external
            }
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
                '@components': path.resolve(__dirname, 'src/Shared/components'),
                '@hooks': path.resolve(__dirname, 'src/Shared/hooks'),
                '@utils': path.resolve(__dirname, 'src/Shared/utils'),
                '@stores': path.resolve(__dirname, 'src/Shared/stores'),
                '@services': path.resolve(__dirname, 'src/Shared/services'),
                '@types': path.resolve(__dirname, 'src/Shared/types'),
                '@assets': path.resolve(__dirname, 'assets'),
                '@blocks': path.resolve(__dirname, 'src/Blocks'),
                '@elementor': path.resolve(__dirname, 'src/Elementor'),
                '@admin': path.resolve(__dirname, 'src/AdminUI'),
                '@shortcodes': path.resolve(__dirname, 'src/Shortcodes'),
                '@frontend': path.resolve(__dirname, 'src/Frontend'),
            }
        },
        css: {
            postcss: {
                plugins: [
                    autoprefixer
                ]
            }
        },

        define: {
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            '__DEV__': process.env.NODE_ENV === 'development',
        }
    };
});
