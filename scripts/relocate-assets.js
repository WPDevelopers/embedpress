#!/usr/bin/env node

/**
 * EmbedPress Asset Relocation Script
 * 
 * Moves assets-old/ to static/ folder to separate from build assets
 */

const fs = require('fs');
const path = require('path');

class AssetRelocator {
    constructor() {
        this.baseDir = path.join(__dirname, '..');
        this.oldAssetsDir = path.join(this.baseDir, 'assets-old');
        this.staticDir = path.join(this.baseDir, 'static');
        this.assetsDir = path.join(this.baseDir, 'assets');
    }

    /**
     * Check if directories exist and validate setup
     */
    validateSetup() {
        if (!fs.existsSync(this.oldAssetsDir)) {
            console.error('❌ assets-old directory not found');
            console.log('💡 If you\'ve already moved your assets, this script is not needed.');
            return false;
        }

        return true;
    }

    /**
     * Check if static directory exists and handle overwrite
     */
    async handleExistingStatic() {
        if (fs.existsSync(this.staticDir)) {
            console.log('⚠️  static/ directory already exists.');
            
            // In a real interactive environment, you'd prompt the user
            // For now, we'll just warn and continue
            console.log('🗑️  Removing existing static/ directory...');
            fs.rmSync(this.staticDir, { recursive: true, force: true });
        }
    }

    /**
     * Move assets-old to static
     */
    moveAssets() {
        try {
            console.log('📦 Moving assets-old/ to static/...');
            fs.renameSync(this.oldAssetsDir, this.staticDir);
            console.log('✅ Successfully moved assets-old/ to static/');
            return true;
        } catch (error) {
            console.error('❌ Failed to move assets-old/ to static/:', error.message);
            return false;
        }
    }

    /**
     * Show current directory structure
     */
    showStructure() {
        console.log('\n📁 Current asset structure:');
        console.log('==================================================');
        
        console.log('assets/          # Build files (Vite-compiled)');
        if (fs.existsSync(this.assetsDir)) {
            try {
                const assetItems = fs.readdirSync(this.assetsDir, { withFileTypes: true });
                assetItems
                    .filter(item => item.isDirectory())
                    .forEach(item => console.log(`  ${item.name}/`));
            } catch (error) {
                console.log('  (unable to read directory)');
            }
        }

        console.log('\nstatic/          # Previous assets (relocated)');
        if (fs.existsSync(this.staticDir)) {
            try {
                const staticItems = fs.readdirSync(this.staticDir, { withFileTypes: true });
                staticItems
                    .filter(item => item.isDirectory())
                    .forEach(item => console.log(`  ${item.name}/`));
            } catch (error) {
                console.log('  (unable to read directory)');
            }
        }
    }

    /**
     * Generate relocation report
     */
    generateReport() {
        console.log('\n📊 Relocation Report:');
        console.log('==================================================');

        console.log('\n✅ Assets relocated successfully:');
        console.log('• Previous assets moved from assets-old/ to static/');
        console.log('• AssetManager updated to use static/ for legacy assets');
        console.log('• Build files remain in assets/ folder');

        console.log('\n🔧 AssetManager Configuration:');
        console.log('• Build assets: /assets/ (blocks.build.js, admin.build.css, etc.)');
        console.log('• Static assets: /static/ (embedpress.css, plyr.css, fonts/, images/, etc.)');

        console.log('\n💡 Next steps:');
        console.log('1. Test that all EmbedPress functionality works');
        console.log('2. Verify legacy assets load correctly from /static/');
        console.log('3. Update any hardcoded paths that reference assets-old/');
        console.log('4. Consider updating documentation to reflect new structure');

        console.log('\n🎉 Asset relocation completed successfully!');
        console.log('ℹ️  Your build system can now use /assets/ exclusively for compiled files.');
    }

    /**
     * Run the relocation process
     */
    async relocate() {
        console.log('🚀 Starting EmbedPress Asset Relocation...\n');

        if (!this.validateSetup()) {
            process.exit(1);
        }

        await this.handleExistingStatic();

        if (!this.moveAssets()) {
            process.exit(1);
        }

        this.showStructure();
        this.generateReport();
    }
}

// Run relocation if called directly
if (require.main === module) {
    const relocator = new AssetRelocator();
    relocator.relocate().catch(console.error);
}

module.exports = AssetRelocator;
