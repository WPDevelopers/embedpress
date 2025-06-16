// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath, URL } from 'node:url';

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

export default defineConfig(({ command, mode }) => {
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
            outDir: '../public',
            emptyOutDir: true,
            sourcemap: !isProduction,
            watch: command === 'build' && process.argv.includes('--watch') ? {
                // Watch options for faster rebuilds
                include: 'src/**',
                exclude: ['node_modules/**', 'public/**']
            } : null,
            rollupOptions: {
                input: {
                    // Gutenberg Blocks
                    'blocks': path.resolve(__dirname, 'src/Blocks/index.js'),
                    'embedpress-block': path.resolve(__dirname, 'src/Blocks/EmbedPress/index.jsx'),

                    // Frontend Scripts
                    'frontend': path.resolve(__dirname, 'src/Frontend/index.js'),
                },
                output: {
                    entryFileNames: '[name].js',
                    chunkFileNames: 'chunks/[name]-[hash].js',
                    assetFileNames: 'assets/[name]-[hash].[ext]',
                    globals: wordpressExternals,
                    manualChunks: {
                        'vendor-utils': ['classnames', 'md5', 'date-fns'],
                    }
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
            '@': fileURLToPath(new URL('./src', import.meta.url)),
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
