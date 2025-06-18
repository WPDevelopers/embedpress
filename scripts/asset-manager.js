#!/usr/bin/env node

/**
 * Asset Manager Script for EmbedPress
 *
 * This script handles different types of asset processing:
 * 1. Legacy CSS/JS optimization
 * 2. Third-party package CSS/JS bundling
 * 3. Dynamic CSS/JS imports in JavaScript
 * 4. CSS/JS dependency management
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AssetManager {
    constructor() {
        this.assetsDir = path.join(__dirname, '../assets');
        this.srcDir = path.join(__dirname, '../src');
        this.cssMap = new Map();
        this.jsMap = new Map();
        this.dependencies = new Map();
    }

    /**
     * Scan for CSS and JS files and create dependency map
     */
    scanAssets() {
        console.log('🔍 Scanning CSS and JS files...');

        // Scan assets directory for legacy CSS and JS
        this.scanDirectory(path.join(this.assetsDir, 'css'), 'legacy-css');
        this.scanDirectory(path.join(this.assetsDir, 'js'), 'legacy-js');

        // Scan src directory for component CSS and JS
        this.scanDirectory(this.srcDir, 'component');

        console.log(`📊 Found ${this.cssMap.size} CSS files and ${this.jsMap.size} JS files`);
    }

    /**
     * Scan directory for CSS and JS files
     */
    scanDirectory(dir, type) {
        if (!fs.existsSync(dir)) return;

        const files = fs.readdirSync(dir, { withFileTypes: true });

        files.forEach(file => {
            const fullPath = path.join(dir, file.name);

            if (file.isDirectory()) {
                this.scanDirectory(fullPath, type);
            } else if (file.name.endsWith('.css') || file.name.endsWith('.scss')) {
                this.cssMap.set(file.name, {
                    path: fullPath,
                    type,
                    size: fs.statSync(fullPath).size,
                    dependencies: this.extractDependencies(fullPath)
                });
            } else if (file.name.endsWith('.js') && !file.name.includes('.build.') && !file.name.includes('.min.')) {
                this.jsMap.set(file.name, {
                    path: fullPath,
                    type,
                    size: fs.statSync(fullPath).size,
                    dependencies: this.extractJSDependencies(fullPath)
                });
            }
        });
    }

    /**
     * Extract CSS dependencies (imports, etc.)
     */
    extractDependencies(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const imports = [];

            // Match @import statements
            const importRegex = /@import\s+['"]([^'"]+)['"]/g;
            let match;

            while ((match = importRegex.exec(content)) !== null) {
                imports.push(match[1]);
            }

            return imports;
        } catch (error) {
            console.warn(`⚠️  Could not read ${filePath}:`, error.message);
            return [];
        }
    }

    /**
     * Extract JS dependencies (imports, requires, etc.)
     */
    extractJSDependencies(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const dependencies = [];

            // Match ES6 imports
            const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
            let match;

            while ((match = importRegex.exec(content)) !== null) {
                dependencies.push(match[1]);
            }

            // Match CommonJS requires
            const requireRegex = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
            while ((match = requireRegex.exec(content)) !== null) {
                dependencies.push(match[1]);
            }

            // Match WordPress dependencies (wp.blocks, wp.element, etc.)
            const wpRegex = /wp\.(\w+)/g;
            while ((match = wpRegex.exec(content)) !== null) {
                dependencies.push(`wp.${match[1]}`);
            }

            return [...new Set(dependencies)]; // Remove duplicates
        } catch (error) {
            console.warn(`⚠️  Could not read ${filePath}:`, error.message);
            return [];
        }
    }

    /**
     * Generate CSS import statements for JavaScript
     */
    generateJSImports(cssFiles, outputPath) {
        console.log('📝 Generating JavaScript CSS imports...');
        
        const imports = cssFiles.map(file => {
            const cssInfo = this.cssMap.get(file);
            if (!cssInfo) {
                console.warn(`⚠️  CSS file not found: ${file}`);
                return null;
            }
            
            const relativePath = path.relative(path.dirname(outputPath), cssInfo.path);
            return `import '${relativePath}';`;
        }).filter(Boolean);

        const content = `/**
 * Auto-generated CSS imports for EmbedPress
 * Generated on: ${new Date().toISOString()}
 */

${imports.join('\n')}

export default {
    loaded: ${cssFiles.length},
    files: ${JSON.stringify(cssFiles, null, 2)}
};`;

        fs.writeFileSync(outputPath, content);
        console.log(`✅ Generated CSS imports: ${outputPath}`);
    }

    /**
     * Create CSS and JS bundles for different contexts
     */
    createBundles() {
        console.log('📦 Creating CSS and JS bundles...');

        const cssBundles = {
            // Frontend CSS bundle - commonly used styles
            frontendCSS: [
                'embedpress.css',
                'plyr.css'
            ],

            // Admin CSS bundle - admin-specific styles
            adminCSS: [
                'admin.css',
                'el-icon.css'
            ],

            // Elementor CSS bundle - Elementor-specific styles
            elementorCSS: [
                'embedpress-elementor.css',
                'carousel.min.css'
            ]
        };

        const jsBundles = {
            // Frontend JS bundle - commonly used scripts
            frontendJS: [
                'front.js',
                'pdfobject.js'
            ],

            // Admin JS bundle - admin-specific scripts
            adminJS: [
                'license.js'
            ],

            // Elementor JS bundle - Elementor-specific scripts
            elementorJS: [
                'carousel.min.js',
                'initCarousel.js'
            ],

            // Video player JS bundle - video-related scripts
            videoPlayerJS: [
                'plyr.polyfilled.js',
                'initplyr.js',
                'vimeo-player.js'
            ]
        };

        // Create CSS bundles
        Object.entries(cssBundles).forEach(([bundleName, files]) => {
            this.createCSSBundle(bundleName, files);
        });

        // Create JS bundles
        Object.entries(jsBundles).forEach(([bundleName, files]) => {
            this.createJSBundle(bundleName, files);
        });
    }

    /**
     * Create a single CSS bundle
     */
    createCSSBundle(bundleName, cssFiles) {
        console.log(`📦 Creating ${bundleName} CSS bundle...`);

        let combinedCSS = `/**
 * EmbedPress ${bundleName.charAt(0).toUpperCase() + bundleName.slice(1)} Bundle
 * Generated on: ${new Date().toISOString()}
 * Files included: ${cssFiles.join(', ')}
 */\n\n`;

        cssFiles.forEach(file => {
            const cssInfo = this.cssMap.get(file);
            if (cssInfo) {
                try {
                    const content = fs.readFileSync(cssInfo.path, 'utf8');
                    combinedCSS += `/* === ${file} === */\n${content}\n\n`;
                } catch (error) {
                    console.warn(`⚠️  Could not read ${file}:`, error.message);
                }
            } else {
                console.warn(`⚠️  CSS file not found in map: ${file}`);
            }
        });

        const outputPath = path.join(this.assetsDir, 'css', `${bundleName}.bundle.css`);
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, combinedCSS);

        console.log(`✅ Created CSS bundle: ${outputPath} (${(combinedCSS.length / 1024).toFixed(2)} KB)`);
    }

    /**
     * Create a single JS bundle
     */
    createJSBundle(bundleName, jsFiles) {
        console.log(`📦 Creating ${bundleName} JS bundle...`);

        let combinedJS = `/**
 * EmbedPress ${bundleName.charAt(0).toUpperCase() + bundleName.slice(1)} Bundle
 * Generated on: ${new Date().toISOString()}
 * Files included: ${jsFiles.join(', ')}
 */

(function(window, document, $) {
    'use strict';

`;

        jsFiles.forEach(file => {
            const jsInfo = this.jsMap.get(file);
            if (jsInfo) {
                try {
                    const content = fs.readFileSync(jsInfo.path, 'utf8');
                    combinedJS += `    /* === ${file} === */\n    ${content.split('\n').join('\n    ')}\n\n`;
                } catch (error) {
                    console.warn(`⚠️  Could not read ${file}:`, error.message);
                }
            } else {
                console.warn(`⚠️  JS file not found in map: ${file}`);
            }
        });

        combinedJS += `})(window, document, jQuery);`;

        const outputPath = path.join(this.assetsDir, 'js', `${bundleName}.bundle.js`);
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, combinedJS);

        console.log(`✅ Created JS bundle: ${outputPath} (${(combinedJS.length / 1024).toFixed(2)} KB)`);
    }

    /**
     * Handle third-party package CSS and JS
     */
    handleThirdPartyAssets() {
        console.log('📦 Processing third-party CSS and JS...');

        // Example: Handle third-party packages
        const thirdPartyPackages = [
            // CSS packages
            // {
            //     name: 'optimizely-css',
            //     type: 'css',
            //     source: 'node_modules/@optimizely/optimizely-sdk/dist/optimizely.css',
            //     output: 'vendor/optimizely.css'
            // },

            // JS packages
            // {
            //     name: 'optimizely-js',
            //     type: 'js',
            //     source: 'node_modules/@optimizely/optimizely-sdk/dist/optimizely.js',
            //     output: 'vendor/optimizely.js'
            // },
            // {
            //     name: 'chart-js',
            //     type: 'js',
            //     source: 'node_modules/chart.js/dist/chart.min.js',
            //     output: 'vendor/chart.js'
            // }
        ];

        thirdPartyPackages.forEach(pkg => {
            const sourcePath = path.join(__dirname, '..', pkg.source);
            const outputPath = path.join(this.assetsDir, pkg.type, pkg.output);

            if (fs.existsSync(sourcePath)) {
                fs.mkdirSync(path.dirname(outputPath), { recursive: true });
                fs.copyFileSync(sourcePath, outputPath);
                console.log(`✅ Copied ${pkg.name} (${pkg.type.toUpperCase()}): ${outputPath}`);
            } else {
                console.warn(`⚠️  Third-party ${pkg.type.toUpperCase()} not found: ${sourcePath}`);
            }
        });
    }

    /**
     * Generate CSS and JS dependency report
     */
    generateReport() {
        console.log('📊 Generating asset report...');

        const cssFiles = Array.from(this.cssMap.entries()).map(([name, info]) => ({
            name,
            type: info.type,
            size: info.size,
            dependencies: info.dependencies,
            assetType: 'css'
        }));

        const jsFiles = Array.from(this.jsMap.entries()).map(([name, info]) => ({
            name,
            type: info.type,
            size: info.size,
            dependencies: info.dependencies,
            assetType: 'js'
        }));

        const totalCSSSize = Array.from(this.cssMap.values()).reduce((sum, css) => sum + css.size, 0);
        const totalJSSize = Array.from(this.jsMap.values()).reduce((sum, js) => sum + js.size, 0);

        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalCSSFiles: this.cssMap.size,
                totalJSFiles: this.jsMap.size,
                totalFiles: this.cssMap.size + this.jsMap.size,
                totalCSSSize,
                totalJSSize,
                totalSize: totalCSSSize + totalJSSize
            },
            files: [...cssFiles, ...jsFiles]
        };

        const reportPath = path.join(__dirname, '../asset-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

        console.log(`📊 Asset Report generated: ${reportPath}`);
        console.log(`📈 Total CSS size: ${(totalCSSSize / 1024).toFixed(2)} KB`);
        console.log(`📈 Total JS size: ${(totalJSSize / 1024).toFixed(2)} KB`);
        console.log(`📈 Total asset size: ${(report.summary.totalSize / 1024).toFixed(2)} KB`);
    }

    /**
     * Run the asset management process
     */
    run(command = 'all') {
        console.log('🚀 Starting Asset Manager...');

        switch (command) {
            case 'scan':
                this.scanAssets();
                break;
            case 'bundles':
                this.scanAssets();
                this.createBundles();
                break;
            case 'third-party':
                this.handleThirdPartyAssets();
                break;
            case 'report':
                this.scanAssets();
                this.generateReport();
                break;
            case 'all':
            default:
                this.scanAssets();
                this.createBundles();
                this.handleThirdPartyAssets();
                this.generateReport();
                break;
        }

        console.log('✅ Asset Manager completed!');
    }
}

// Run the asset manager
const command = process.argv[2] || 'all';
const assetManager = new AssetManager();
assetManager.run(command);
