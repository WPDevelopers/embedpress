// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'node:url';
import autoprefixer from 'autoprefixer';

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
    'react': 'React',
    'react-dom': 'ReactDOM',
    'jquery': 'jQuery',
    'lodash': 'lodash'
};

// Static assets configuration
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
        ]
    },
    // Admin assets
    adminCommon: {
        css: [
            'static/css/admin.css',
            'static/css/admin-notices.css'
        ],
        js: [
            'static/js/admin.js',
            'static/js/license.js',
            'static/js/settings.js'
        ]
    },
    // Block-specific assets
    videoPlayer: {
        css: ['static/css/plyr.css'],
        js: [
            'static/js/plyr.js',
            'static/js/plyr.polyfilled.js',
            'static/js/initplyr.js',
            'static/js/vimeo-player.js',
            'static/js/ytiframeapi.js'
        ]
    },
    carousel: {
        css: [
            'static/css/carousel.min.css',
            'static/css/glider.min.css'
        ],
        js: [
            'static/js/carousel.js',
            'static/js/carousel.min.js',
            'static/js/initCarousel.js',
            'static/js/glider.js',
            'static/js/glider.min.js'
        ]
    },
    gallery: {
        css: [],
        js: [
            'static/js/gallery-justify.js',
            'static/js/instafeed.js'
        ]
    },
    elementor: {
        css: ['static/css/embedpress-elementor.css'],
        js: []
    },
    pdfViewer: {
        css: ['static/css/preview.css'],
        js: [
            'static/js/pdfobject.js',
            'static/js/preview.js'
        ]
    },
    documentViewer: {
        css: [],
        js: ['static/js/documents-viewer-script.js']
    },
    gutenberg: {
        css: [],
        js: ['static/js/gutneberg-script.js']
    },
    embedUI: {
        css: [],
        js: ['static/js/embed-ui.min.js']
    },
    ads: {
        css: [],
        js: ['static/js/ads.js']
    },
    vendor: {
        css: [],
        js: [
            'static/js/vendor/bootstrap/bootstrap.min.js',
            'static/js/vendor/bootbox.min.js',
        ]
    },
    preview: {
        css: [],
        js: ['static/js/preview.js']
    },
};



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
                    'virtual:video-assets': staticAssets.videoPlayer,
                    'virtual:carousel-assets': staticAssets.carousel,
                    'virtual:gallery-assets': staticAssets.gallery,
                    'virtual:elementor-assets': staticAssets.elementor,
                    'virtual:pdf-assets': staticAssets.pdfViewer,
                    'virtual:document-assets': staticAssets.documentViewer,
                    'virtual:gutenberg-assets': staticAssets.gutenberg,
                    'virtual:embed-assets': staticAssets.embedUI,
                    'virtual:ads-assets': staticAssets.ads,
                    'virtual:vendor-assets': staticAssets.vendor,
                    'virtual:preview-assets': staticAssets.preview
                };

                const assets = assetMap[id];
                if (!assets) {
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
    // Gutenberg blocks (editor + frontend)
    blocks: {
        input: 'src/Blocks/index.js',
        output: {
            entryFileNames: 'js/blocks.build.js',
            cssFileName: 'css/blocks.build.css',
            globals: wordpressExternals,
            external: Object.keys(wordpressExternals),
            format: 'iife',
            name: 'EmbedPressBlocks'
        }
    },

    // Admin dashboard (React SPA)
    admin: {
        input: 'src/AdminUI/index.js',
        output: {
            entryFileNames: 'js/admin.build.js',
            cssFileName: 'css/admin.build.css',
            globals: { 'react': 'React', 'react-dom': 'ReactDOM', 'jquery': 'jQuery' },
            external: ['react', 'react-dom', 'jquery'],
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

    // Static assets bundles
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

    'vendor': {
        input: 'virtual:vendor-assets',
        output: {
            entryFileNames: 'js/vendor.build.js',
            cssFileName: 'css/vendor.build.css',
            globals: { 'jquery': 'jQuery' },
            external: ['jquery'],
            format: 'iife',
            name: 'EmbedPressVendor'
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

    'video-player': {
        input: 'virtual:video-assets',
        output: {
            entryFileNames: 'js/video-player.build.js',
            cssFileName: 'css/video-player.build.css',
            globals: { 'jquery': 'jQuery' },
            external: ['jquery'],
            format: 'iife',
            name: 'EmbedPressVideoPlayer'
        }
    },

    'carousel': {
        input: 'virtual:carousel-assets',
        output: {
            entryFileNames: 'js/carousel.build.js',
            cssFileName: 'css/carousel.build.css',
            globals: { 'jquery': 'jQuery' },
            external: ['jquery'],
            format: 'iife',
            name: 'EmbedPressCarousel'
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

    'pdf-viewer': {
        input: 'virtual:pdf-assets',
        output: {
            entryFileNames: 'js/pdf-viewer.build.js',
            cssFileName: 'css/pdf-viewer.build.css',
            globals: { 'jquery': 'jQuery' },
            external: ['jquery'],
            format: 'iife',
            name: 'EmbedPressPDFViewer'
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

    'embed-ui': {
        input: 'virtual:embed-assets',
        output: {
            entryFileNames: 'js/embed-ui.build.js',
            cssFileName: 'css/embed-ui.build.css',
            globals: { 'jquery': 'jQuery' },
            external: ['jquery'],
            format: 'iife',
            name: 'EmbedPressEmbedUI'
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


};

export default defineConfig(({ command, mode }) => {
    const isProduction = mode === 'production';
    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    // Determine which build to run based on environment variable or default to blocks
    const buildTarget = process.env.BUILD_TARGET || 'blocks';
    const config = buildConfigs[buildTarget];

    if (!config) {
        throw new Error(`Unknown build target: ${buildTarget}. Available targets: ${Object.keys(buildConfigs).join(', ')}`);
    }

    return {
        plugins: [
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
                input: path.resolve(__dirname, config.input),
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
                    inlineDynamicImports: true // Single input allows this
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
