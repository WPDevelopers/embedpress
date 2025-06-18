#!/usr/bin/env node

/**
 * CSS Builder Script for EmbedPress
 * 
 * This script compiles SCSS files to CSS without going through Vite
 * to avoid the JavaScript module processing issues.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sass from 'sass';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CSSBuilder {
    constructor() {
        this.srcDir = path.join(__dirname, '../src');
        this.assetsDir = path.join(__dirname, '../assets');
        this.cssOutputDir = path.join(this.assetsDir, 'css');
        this.watchMode = process.argv.includes('--watch');
    }

    /**
     * Build all CSS files
     */
    async buildAll() {
        console.log('🎨 Building CSS files...');
        
        // Ensure output directory exists
        fs.mkdirSync(this.cssOutputDir, { recursive: true });

        // Build individual SCSS files
        await this.buildFile('src/Shared/styles/admin.scss', 'admin.build.css');
        await this.buildFile('src/Blocks/EmbedPress/src/style.scss', 'blocks.style.build.css');
        await this.buildFile('src/Blocks/EmbedPress/src/editor.scss', 'blocks.editor.build.css');

        // Build component styles
        await this.buildComponentStyles();

        console.log('✅ CSS build completed!');
    }

    /**
     * Build a single SCSS file
     */
    async buildFile(inputPath, outputName) {
        const fullInputPath = path.join(__dirname, '..', inputPath);
        const outputPath = path.join(this.cssOutputDir, outputName);

        try {
            if (!fs.existsSync(fullInputPath)) {
                console.warn(`⚠️  SCSS file not found: ${inputPath}`);
                return;
            }

            console.log(`📝 Building: ${inputPath} → ${outputName}`);

            const result = sass.compile(fullInputPath, {
                style: 'expanded',
                sourceMap: true,
                loadPaths: [
                    path.join(__dirname, '../src'),
                    path.join(__dirname, '../src/Shared/styles'),
                    path.join(__dirname, '../node_modules')
                ]
            });

            // Write CSS file
            fs.writeFileSync(outputPath, result.css);
            
            // Write source map
            if (result.sourceMap) {
                fs.writeFileSync(`${outputPath}.map`, JSON.stringify(result.sourceMap));
            }

            console.log(`✅ Built: ${outputName} (${(result.css.length / 1024).toFixed(2)} KB)`);

        } catch (error) {
            console.error(`❌ Error building ${inputPath}:`, error.message);
        }
    }

    /**
     * Build component styles
     */
    async buildComponentStyles() {
        const componentStyles = [
            'src/Shared/components/UI/Button/Button.scss',
            'src/Shared/components/UI/Input/Input.scss',
            'src/Shared/components/UI/Toggle/Toggle.scss'
        ];

        // Create a combined components CSS file
        let combinedCSS = `/**
 * EmbedPress Component Styles
 * Generated on: ${new Date().toISOString()}
 */\n\n`;

        for (const stylePath of componentStyles) {
            const fullPath = path.join(__dirname, '..', stylePath);
            
            if (fs.existsSync(fullPath)) {
                try {
                    const result = sass.compile(fullPath, {
                        style: 'expanded',
                        loadPaths: [
                            path.join(__dirname, '../src'),
                            path.join(__dirname, '../src/Shared/styles')
                        ]
                    });
                    
                    combinedCSS += `/* === ${path.basename(stylePath)} === */\n${result.css}\n\n`;
                } catch (error) {
                    console.warn(`⚠️  Error compiling ${stylePath}:`, error.message);
                }
            }
        }

        const outputPath = path.join(this.cssOutputDir, 'components.build.css');
        fs.writeFileSync(outputPath, combinedCSS);
        
        console.log(`✅ Built: components.build.css (${(combinedCSS.length / 1024).toFixed(2)} KB)`);
    }

    /**
     * Watch for changes and rebuild
     */
    watch() {
        console.log('👀 Watching for CSS changes...');
        
        const watchPaths = [
            path.join(this.srcDir, 'Shared/styles'),
            path.join(this.srcDir, 'Blocks'),
            path.join(this.srcDir, 'Shared/components')
        ];

        watchPaths.forEach(watchPath => {
            if (fs.existsSync(watchPath)) {
                fs.watch(watchPath, { recursive: true }, (eventType, filename) => {
                    if (filename && (filename.endsWith('.scss') || filename.endsWith('.css'))) {
                        console.log(`🔄 File changed: ${filename}`);
                        this.buildAll();
                    }
                });
            }
        });
    }

    /**
     * Run the CSS builder
     */
    async run() {
        console.log('🚀 Starting CSS Builder...');
        
        await this.buildAll();
        
        if (this.watchMode) {
            this.watch();
            
            // Keep the process running
            process.on('SIGINT', () => {
                console.log('\n👋 CSS Builder stopped');
                process.exit(0);
            });
            
            console.log('👀 Watching for changes... (Press Ctrl+C to stop)');
        }
    }
}

// Run the CSS builder
const cssBuilder = new CSSBuilder();
cssBuilder.run().catch(error => {
    console.error('❌ CSS Builder failed:', error);
    process.exit(1);
});
