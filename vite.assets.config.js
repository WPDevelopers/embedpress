// vite.assets.config.js
import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Asset Management Configuration for EmbedPress
 *
 * This configuration handles:
 * 1. Legacy CSS/JS files (embedpress.css, front.js, etc.)
 * 2. Third-party package assets (Optimizely, Plyr, etc.)
 * 3. Static assets that need processing
 */

// Define asset groups for different purposes
const assetGroups = {
    // Legacy CSS files that need to be processed/optimized
    legacyCSS: {
        input: {
            'embedpress': 'assets/css/embedpress.css',
            'plyr': 'assets/css/plyr.css',
            'carousel': 'assets/css/carousel.min.css',
            'el-icon': 'assets/css/el-icon.css',
            'embedpress-elementor': 'assets/css/embedpress-elementor.css'
        },
        output: 'css/legacy/'
    },

    // Legacy JS files that need to be processed/optimized
    legacyJS: {
        input: {
            'front': 'assets/js/front.js',
            'plyr-polyfilled': 'assets/js/plyr.polyfilled.js',
            'initplyr': 'assets/js/initplyr.js',
            'vimeo-player': 'assets/js/vimeo-player.js',
            'pdfobject': 'assets/js/pdfobject.js',
            'carousel': 'assets/js/carousel.min.js',
            'initCarousel': 'assets/js/initCarousel.js',
            'ads': 'assets/js/ads.js',
            'license': 'assets/js/license.js'
        },
        output: 'js/legacy/'
    },

    // Third-party packages that need bundling
    vendor: {
        input: {
            // CSS packages
            // 'optimizely-css': 'node_modules/@optimizely/optimizely-sdk/dist/optimizely.css',
            // 'some-package-css': 'node_modules/some-package/dist/styles.css',

            // JS packages
            // 'optimizely-js': 'node_modules/@optimizely/optimizely-sdk/dist/optimizely.js',
            // 'chart-js': 'node_modules/chart.js/dist/chart.min.js',
            // 'moment': 'node_modules/moment/min/moment.min.js'
        },
        output: 'vendor/'
    },

    // Combined bundles for specific contexts
    bundles: {
        // Frontend CSS bundle - combines commonly used styles
        frontendCSS: [
            'assets/css/embedpress.css',
            'assets/css/plyr.css'
        ],

        // Frontend JS bundle - combines commonly used scripts
        frontendJS: [
            'assets/js/front.js',
            'assets/js/pdfobject.js'
        ],

        // Admin CSS bundle - combines admin-specific styles
        adminCSS: [
            'assets/css/admin.css',
            'assets/css/el-icon.css'
        ],

        // Admin JS bundle - combines admin-specific scripts
        adminJS: [
            'assets/js/license.js'
        ],

        // Elementor CSS bundle - combines Elementor-specific styles
        elementorCSS: [
            'assets/css/embedpress-elementor.css',
            'assets/css/carousel.min.css'
        ],

        // Elementor JS bundle - combines Elementor-specific scripts
        elementorJS: [
            'assets/js/carousel.min.js',
            'assets/js/initCarousel.js'
        ],

        // Video player bundle - combines video-related assets
        videoPlayerCSS: [
            'assets/css/plyr.css'
        ],

        videoPlayerJS: [
            'assets/js/plyr.polyfilled.js',
            'assets/js/initplyr.js',
            'assets/js/vimeo-player.js'
        ]
    }
};

export default defineConfig(({ mode }) => {
    const isProduction = mode === 'production';
    const buildType = process.env.ASSET_BUILD_TYPE || 'legacyCSS';

    // Different configurations based on build type
    const configs = {
        // Process legacy CSS files
        legacyCSS: {
            build: {
                lib: {
                    entry: Object.fromEntries(
                        Object.entries(assetGroups.legacyCSS.input).map(([key, value]) => [
                            key,
                            path.resolve(__dirname, value)
                        ])
                    ),
                    formats: ['es']
                },
                outDir: `assets/${assetGroups.legacyCSS.output}`,
                rollupOptions: {
                    output: {
                        assetFileNames: '[name].min.css'
                    }
                }
            }
        },

        // Process legacy JS files
        legacyJS: {
            build: {
                lib: {
                    entry: Object.fromEntries(
                        Object.entries(assetGroups.legacyJS.input).map(([key, value]) => [
                            key,
                            path.resolve(__dirname, value)
                        ])
                    ),
                    formats: ['iife']
                },
                outDir: `assets/${assetGroups.legacyJS.output}`,
                rollupOptions: {
                    output: {
                        entryFileNames: '[name].min.js'
                    }
                }
            }
        },
        
        // Process vendor packages
        vendor: {
            build: {
                lib: {
                    entry: Object.fromEntries(
                        Object.entries(assetGroups.vendor.input).map(([key, value]) => [
                            key,
                            path.resolve(__dirname, value)
                        ])
                    ),
                    formats: ['es']
                },
                outDir: `assets/${assetGroups.vendor.output}`,
                rollupOptions: {
                    output: {
                        assetFileNames: '[name].min.css'
                    }
                }
            }
        },
        
        // Create combined bundles
        bundles: {
            build: {
                rollupOptions: {
                    input: Object.fromEntries(
                        Object.entries(assetGroups.bundles).map(([key]) => [
                            key,
                            // Create virtual entry points for bundles
                            `virtual:${key}-bundle`
                        ])
                    ),
                    output: {
                        dir: 'assets/bundles/',
                        entryFileNames: '[name].bundle.js',
                        assetFileNames: '[name].bundle.css'
                    }
                },
                plugins: [
                    // Virtual module plugin to handle bundle entries
                    {
                        name: 'virtual-bundles',
                        resolveId(id) {
                            if (id.startsWith('virtual:')) {
                                return id;
                            }
                        },
                        load(id) {
                            if (id.startsWith('virtual:')) {
                                const bundleName = id.replace('virtual:', '').replace('-bundle', '');
                                const files = assetGroups.bundles[bundleName] || [];

                                return files.map(file =>
                                    `import '${path.resolve(__dirname, file)}';`
                                ).join('\n');
                            }
                        }
                    }
                ]
            }
        }
    };
    
    return {
        ...configs[buildType],
        css: {
            postcss: {
                plugins: [
                    // Add PostCSS plugins for processing
                    require('autoprefixer'),
                    ...(isProduction ? [require('cssnano')] : [])
                ]
            }
        },
        define: {
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        }
    };
});
