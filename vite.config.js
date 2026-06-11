import { defineConfig } from 'vite';
import { defaultExclude } from 'vitest/config';
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
    'onboarding': 'src/AdminUI/onboarding-entry.js',
    'custom-player': 'src/AdminUI/custom-player-entry.js',
    'google-reviews': 'src/AdminUI/google-reviews-entry.jsx',
    'analytics': 'src/Analytics/index.js',
    'frontend': 'src/Frontend/index.js'
};

// Rewrite imports of WordPress packages to use the runtime globals (window.wp.*)
// exposed by WordPress, instead of bundling our own copies. Critical for i18n:
// without this, every entry ships its own `@wordpress/i18n` instance whose
// locale data is separate from WordPress's wp.i18n, so wp_set_script_translations
// never reaches the bundle's __() calls.
function wordpressGlobalsPlugin(map) {
    const VIRTUAL = '\0wp-global:';
    return {
        name: 'wordpress-globals',
        enforce: 'pre',
        resolveId(id) {
            if (Object.prototype.hasOwnProperty.call(map, id)) {
                return VIRTUAL + id;
            }
        },
        load(id) {
            if (!id.startsWith(VIRTUAL)) return;
            const orig = id.slice(VIRTUAL.length);
            const global = map[orig];
            // Re-export the named exports of the wp.* runtime. Listing the
            // common surface lets named imports tree-shake; default export
            // covers `import x from 'pkg'`.
            return `const __mod = ${global};
export default __mod;
export const __ = __mod.__;
export const _x = __mod._x;
export const _n = __mod._n;
export const _nx = __mod._nx;
export const sprintf = __mod.sprintf;
export const setLocaleData = __mod.setLocaleData;
export const isRTL = __mod.isRTL;
export const hasTranslation = __mod.hasTranslation;
export const createElement = __mod.createElement;
export const useState = __mod.useState;
export const useEffect = __mod.useEffect;
export const useMemo = __mod.useMemo;
export const useRef = __mod.useRef;
export const useCallback = __mod.useCallback;`;
        }
    };
}

export default defineConfig(({ mode }) => {
    const isDev = mode === 'development';

    return {
        plugins: [
            wordpressGlobalsPlugin({
                '@wordpress/i18n': 'window.wp.i18n',
            }),
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
            emptyOutDir: true,
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
        },
        test: {
            exclude: [...defaultExclude, 'tests/e2e/**'],
        },
    };
});
