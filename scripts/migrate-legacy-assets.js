#!/usr/bin/env node

/**
 * EmbedPress Legacy Asset Migration Script
 * 
 * Moves required legacy assets from assets-old/ to assets/ folder
 * while preserving the new build system structure
 */

const fs = require('fs');
const path = require('path');

class LegacyAssetMigrator {
    constructor() {
        this.baseDir = path.join(__dirname, '..');
        this.oldAssetsDir = path.join(this.baseDir, 'assets-old');
        this.newAssetsDir = path.join(this.baseDir, 'assets');
        
        // Assets required by AssetManager
        this.requiredAssets = {
            css: [
                'embedpress.css',
                'plyr.css', 
                'carousel.min.css',
                'embedpress-elementor.css'
            ],
            js: [
                'plyr.polyfilled.js',
                'carousel.min.js',
                'pdfobject.js'
            ],
            folders: [
                'fonts',
                'images'
            ]
        };
        
        // Optional assets that can remain in assets-old
        this.optionalAssets = {
            deprecated: [
                'css/admin.css',
                'css/admin-notices.css', 
                'js/admin.js',
                'js/settings.js',
                'js/front.js',
                'js/gutneberg-script.js'
            ],
            specialized: [
                'pdf-flip-book/',
                'pdf/',
                'js/ads.js',
                'js/gallery-justify.js',
                'js/vendor/',
                'css/vendor/'
            ]
        };
    }

    /**
     * Check if directories exist
     */
    validateDirectories() {
        if (!fs.existsSync(this.oldAssetsDir)) {
            console.error('❌ assets-old directory not found');
            return false;
        }
        
        if (!fs.existsSync(this.newAssetsDir)) {
            console.error('❌ assets directory not found');
            return false;
        }
        
        return true;
    }

    /**
     * Copy a file with error handling
     */
    copyFile(src, dest) {
        try {
            // Ensure destination directory exists
            const destDir = path.dirname(dest);
            if (!fs.existsSync(destDir)) {
                fs.mkdirSync(destDir, { recursive: true });
            }
            
            fs.copyFileSync(src, dest);
            console.log(`✅ Copied: ${path.relative(this.baseDir, src)} → ${path.relative(this.baseDir, dest)}`);
            return true;
        } catch (error) {
            console.error(`❌ Failed to copy ${src}: ${error.message}`);
            return false;
        }
    }

    /**
     * Copy a directory recursively
     */
    copyDirectory(src, dest) {
        try {
            if (!fs.existsSync(src)) {
                console.warn(`⚠️  Source directory not found: ${src}`);
                return false;
            }

            if (!fs.existsSync(dest)) {
                fs.mkdirSync(dest, { recursive: true });
            }

            const items = fs.readdirSync(src);
            let success = true;

            for (const item of items) {
                const srcPath = path.join(src, item);
                const destPath = path.join(dest, item);
                const stat = fs.statSync(srcPath);

                if (stat.isDirectory()) {
                    success = this.copyDirectory(srcPath, destPath) && success;
                } else {
                    success = this.copyFile(srcPath, destPath) && success;
                }
            }

            if (success) {
                console.log(`✅ Copied directory: ${path.relative(this.baseDir, src)} → ${path.relative(this.baseDir, dest)}`);
            }
            
            return success;
        } catch (error) {
            console.error(`❌ Failed to copy directory ${src}: ${error.message}`);
            return false;
        }
    }

    /**
     * Migrate required CSS files
     */
    migrateCSSFiles() {
        console.log('\n📄 Migrating CSS files...');
        let success = true;

        for (const cssFile of this.requiredAssets.css) {
            const src = path.join(this.oldAssetsDir, 'css', cssFile);
            const dest = path.join(this.newAssetsDir, 'css', cssFile);
            
            if (fs.existsSync(src)) {
                success = this.copyFile(src, dest) && success;
            } else {
                console.warn(`⚠️  CSS file not found: ${cssFile}`);
            }
        }

        return success;
    }

    /**
     * Migrate required JS files
     */
    migrateJSFiles() {
        console.log('\n📜 Migrating JavaScript files...');
        let success = true;

        for (const jsFile of this.requiredAssets.js) {
            const src = path.join(this.oldAssetsDir, 'js', jsFile);
            const dest = path.join(this.newAssetsDir, 'js', jsFile);
            
            if (fs.existsSync(src)) {
                success = this.copyFile(src, dest) && success;
            } else {
                console.warn(`⚠️  JS file not found: ${jsFile}`);
            }
        }

        return success;
    }

    /**
     * Migrate asset folders (fonts, images)
     */
    migrateAssetFolders() {
        console.log('\n📁 Migrating asset folders...');
        let success = true;

        for (const folder of this.requiredAssets.folders) {
            const src = path.join(this.oldAssetsDir, folder);
            const dest = path.join(this.newAssetsDir, folder);
            
            success = this.copyDirectory(src, dest) && success;
        }

        return success;
    }

    /**
     * Generate report of what was migrated
     */
    generateReport() {
        console.log('\n📊 Migration Report:');
        console.log('='.repeat(50));
        
        console.log('\n✅ Required assets migrated to /assets/:');
        console.log('CSS Files:', this.requiredAssets.css.join(', '));
        console.log('JS Files:', this.requiredAssets.js.join(', '));
        console.log('Folders:', this.requiredAssets.folders.join(', '));
        
        console.log('\n📦 Optional assets remaining in /assets-old/:');
        console.log('Deprecated:', this.optionalAssets.deprecated.join(', '));
        console.log('Specialized:', this.optionalAssets.specialized.join(', '));
        
        console.log('\n💡 Next steps:');
        console.log('1. Test that all EmbedPress functionality works');
        console.log('2. Consider archiving /assets-old/ if no longer needed');
        console.log('3. Update any hardcoded paths that reference old assets');
    }

    /**
     * Run the migration
     */
    async migrate() {
        console.log('🚀 Starting EmbedPress Legacy Asset Migration...\n');
        
        if (!this.validateDirectories()) {
            process.exit(1);
        }

        let overallSuccess = true;
        
        overallSuccess = this.migrateCSSFiles() && overallSuccess;
        overallSuccess = this.migrateJSFiles() && overallSuccess;
        overallSuccess = this.migrateAssetFolders() && overallSuccess;
        
        this.generateReport();
        
        if (overallSuccess) {
            console.log('\n🎉 Migration completed successfully!');
        } else {
            console.log('\n⚠️  Migration completed with some errors. Please review the output above.');
        }
    }
}

// Run migration if called directly
if (require.main === module) {
    const migrator = new LegacyAssetMigrator();
    migrator.migrate().catch(console.error);
}

module.exports = LegacyAssetMigrator;
