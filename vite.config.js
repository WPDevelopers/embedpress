import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// WordPress externals - these are provided by WordPress
const wordpressExternals = {
    '@wordpress/blocks': 'wp.blocks',
    '@wordpress/i18n': 'wp.i18n',
    '@wordpress/element': 'wp.element',
    '@wordpress/components': 'wp.components',
    '@wordpress/block-editor': 'wp.blockEditor',
    '@wordpress/data': 'wp.data',
    '@wordpress/core-data': 'wp.coreData',
    '@wordpress/compose': 'wp.compose',
    '@wordpress/hooks': 'wp.hooks',
    '@wordpress/url': 'wp.url',
    '@wordpress/api-fetch': 'wp.apiFetch',
    '@wordpress/notices': 'wp.notices',
    '@wordpress/editor': 'wp.editor',
    '@wordpress/edit-post': 'wp.editPost',
    '@wordpress/plugins': 'wp.plugins',
    '@wordpress/rich-text': 'wp.richText',
    '@wordpress/server-side-render': 'wp.serverSideRender',
    '@wordpress/viewport': 'wp.viewport',
    '@wordpress/keycodes': 'wp.keycodes',
    '@wordpress/html-entities': 'wp.htmlEntities',
    '@wordpress/primitives': 'wp.primitives',
    'react': 'React',
    'react-dom': 'ReactDOM',
    'jquery': 'jQuery'
};

// Copy static files and vendor files
function copyStaticFiles() {
    return {
        name: 'copy-static-files',
        generateBundle() {
            const staticDir = path.resolve(__dirname, 'static');
            const assetsDir = path.resolve(__dirname, 'assets');

            if (!fs.existsSync(staticDir)) {
                console.warn('Static directory not found:', staticDir);
                return;
            }

            // Ensure assets directory exists
            if (!fs.existsSync(assetsDir)) {
                fs.mkdirSync(assetsDir, { recursive: true });
            }

            // Copy static files
            copyDirectory(staticDir, assetsDir);
            
            // Copy block.json files
            copyBlockJsonFiles();
        }
    };
}

function copyBlockJsonFiles() {
    const srcBlocksDir = path.resolve(__dirname, 'src/Blocks');
    const assetsBlocksDir = path.resolve(__dirname, 'assets/blocks');

    if (!fs.existsSync(srcBlocksDir)) {
        console.warn('Source blocks directory not found:', srcBlocksDir);
        return;
    }

    // Ensure assets/blocks directory exists
    if (!fs.existsSync(assetsBlocksDir)) {
        fs.mkdirSync(assetsBlocksDir, { recursive: true });
    }

    // Find and copy all block.json files
    copyBlockJsonRecursive(srcBlocksDir, assetsBlocksDir);
}

function copyBlockJsonRecursive(srcDir, destDir) {
    const items = fs.readdirSync(srcDir);

    items.forEach(item => {
        const srcPath = path.join(srcDir, item);
        const stat = fs.statSync(srcPath);

        if (stat.isDirectory()) {
            const destPath = path.join(destDir, item);
            if (!fs.existsSync(destPath)) {
                fs.mkdirSync(destPath, { recursive: true });
            }
            copyBlockJsonRecursive(srcPath, destPath);
        } else if (item === 'block.json') {
            const destPath = path.join(destDir, item);
            fs.copyFileSync(srcPath, destPath);
            console.log(`Copied block.json: ${srcPath} → ${destPath}`);
        }
    });
}

function copyDirectory(src, dest) {
    if (!fs.existsSync(src)) {
        return;
    }

    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const items = fs.readdirSync(src);

    items.forEach(item => {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);
        const stat = fs.statSync(srcPath);

        if (stat.isDirectory()) {
            console.log(`Copied directory: ${srcPath} → ${destPath}`);
            copyDirectory(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
            console.log(`Copied: ${srcPath} → ${destPath}`);
        }
    });
}

// Entry points for the build - all files needed
const allEntryPoints = {
    // Blocks file (IIFE with externals)
    'blocks': 'src/Blocks/index.js',
    // Other files (ES modules without externals)
    'admin': 'src/AdminUI/index.js',
    'analytics': 'src/Analytics/index.js',
    'frontend': 'src/Frontend/index.js'
};

export default defineConfig(({ mode }) => {
    const isDev = mode === 'development';

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
            react({
                include: ['**/*.jsx'], // Only process .jsx files with React plugin
                jsxRuntime: 'automatic'
            }),
            copyStaticFiles()
        ],
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@import "${path.resolve(__dirname, 'src/Shared/styles/variables.scss')}";`
                }
            }
        },
        build: {
            outDir: 'assets',
            emptyOutDir: false,
            sourcemap: isDev,
            minify: !isDev,
            rollupOptions: {
                input: Object.fromEntries(
                    Object.entries(allEntryPoints).map(([key, value]) => [
                        key, 
                        path.resolve(__dirname, value)
                    ])
                ),
                output: {
                    format: 'es',
                    entryFileNames: (chunkInfo) => {
                        return `js/${chunkInfo.name}.build.js`;
                    },
                    assetFileNames: (assetInfo) => {
                        const ext = path.extname(assetInfo.names?.[0] || '');
                        if (ext === '.css') {
                            return 'css/[name].build.css';
                        }
                        if (['.png', '.jpg', '.jpeg', '.gif', '.svg'].includes(ext)) {
                            return 'img/[name][extname]';
                        }
                        if (['.woff', '.woff2', '.ttf', '.eot'].includes(ext)) {
                            return 'fonts/[name][extname]';
                        }
                        return 'assets/[name][extname]';
                    },
                    chunkFileNames: 'js/chunks/[name]-[hash].js'
                }
            }
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
                '@shared': path.resolve(__dirname, 'src/Shared'),
                '@utils': path.resolve(__dirname, 'src/utils'),
                '@components': path.resolve(__dirname, 'src/components')
            }
        },
        define: {
            'process.env.NODE_ENV': JSON.stringify(mode)
        }
    };
});
