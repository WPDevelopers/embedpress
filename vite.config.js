// vite.config.js
const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');
const path = require('path');

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

module.exports = defineConfig(({ command, mode }) => {
    const isProduction = mode === 'production';

    return {
        plugins: [
            react({
                jsxRuntime: 'automatic',
            }),
        ],
        root: 'src',
        base: './',
        build: {
            outDir: '../assets',
            emptyOutDir: true,
            sourcemap: !isProduction,
            cssCodeSplit: false, // Don't split CSS into separate chunks
            watch: command === 'build' && process.argv.includes('--watch') ? {
                // Watch options for faster rebuilds
                include: 'src/**',
                exclude: ['node_modules/**', 'public/**', 'assets/**']
            } : null,
            rollupOptions: {
                input: path.resolve(__dirname, 'src/Blocks/index.js'), // Only build blocks for now
                output: {
                    format: 'iife', // Use IIFE format for WordPress compatibility
                    entryFileNames: 'js/blocks.build.js',
                    assetFileNames: (assetInfo) => {
                        const ext = path.extname(assetInfo.names?.[0] || '');
                        if (ext === '.css') {
                            return 'css/blocks.style.build.css';
                        }
                        return 'assets/[name]-[hash].[ext]';
                    },
                    globals: wordpressExternals,
                    name: 'EmbedPressBlocks', // Global variable name for IIFE
                    inlineDynamicImports: true, // Inline all imports into single file
                },
                external: Object.keys(wordpressExternals).concat([
                    // Additional externals
                    'elementor',
                    'elementorFrontend',
                    'elementorModules',
                ])
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
        preprocessorOptions: {
            scss: {
                additionalData: `@import "@/Shared/styles/variables.scss";`
            }
        }
    },
    server: {
        port: 3000,
        host: true,
        hmr: {
            port: 3001
        }
    },
        define: {
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            '__DEV__': process.env.NODE_ENV === 'development',
        }
    };
});
