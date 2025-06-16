#!/usr/bin/env node

/**
 * EmbedPress Migration Script
 * 
 * This script helps migrate from the old scattered setup to the new centralized structure.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🚀 Starting EmbedPress Migration...\n');

// Step 1: Clean old build files
console.log('📁 Cleaning old build files...');
const cleanPaths = [
    'Gutenberg/node_modules',
    'Gutenberg/dist',
    'analytics-dashboard/node_modules',
    'analytics-dashboard/dist',
    'node_modules',
    'public'
];

cleanPaths.forEach(cleanPath => {
    const fullPath = path.join(rootDir, cleanPath);
    if (fs.existsSync(fullPath)) {
        console.log(`   Removing: ${cleanPath}`);
        fs.rmSync(fullPath, { recursive: true, force: true });
    }
});

// Step 2: Install dependencies
console.log('\n📦 Installing new dependencies...');
try {
    execSync('npm install', { cwd: rootDir, stdio: 'inherit' });
    console.log('   ✅ Dependencies installed successfully');
} catch (error) {
    console.error('   ❌ Failed to install dependencies:', error.message);
    process.exit(1);
}

// Step 3: Create missing directories
console.log('\n📂 Creating directory structure...');
const directories = [
    'src/Blocks/EmbedBlock',
    'src/Blocks/PDFBlock',
    'src/Blocks/CalendarBlock',
    'src/Blocks/DocumentBlock',
    'src/Elementor',
    'src/Shortcodes',
    'src/AdminUI/Analytics',
    'src/AdminUI/Settings',
    'src/AdminUI/Onboarding',
    'src/Frontend/SocialShare',
    'src/Frontend/Analytics',
    'src/Shared/components/UI',
    'src/Shared/components/EmbedPress',
    'src/Shared/components/Charts',
    'src/Shared/components/Layout',
    'src/Shared/components/Form',
    'src/Shared/components/Icons',
    'src/Shared/components/ErrorBoundary',
    'src/Shared/components/Loading',
    'src/Shared/hooks',
    'src/Shared/utils',
    'src/Shared/stores',
    'src/Shared/services',
    'src/Shared/types',
    'src/Shared/styles',
    'src/Core',
    'src/Helpers',
    'src/Templates',
    'public'
];

directories.forEach(dir => {
    const fullPath = path.join(rootDir, dir);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`   Created: ${dir}`);
    }
});

// Step 4: Build assets
console.log('\n🔨 Building assets...');
try {
    execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });
    console.log('   ✅ Assets built successfully');
} catch (error) {
    console.error('   ❌ Failed to build assets:', error.message);
    console.log('   💡 You can run "npm run build" manually later');
}

// Step 5: Generate PHP enqueue helper
console.log('\n🔧 Generating PHP helper...');
const phpHelper = `<?php
/**
 * EmbedPress Asset Enqueue Helper
 * 
 * Auto-generated helper for enqueuing the new centralized assets.
 * Generated on: ${new Date().toISOString()}
 */

if (!defined('ABSPATH')) {
    exit;
}

class EmbedPress_Asset_Manager {
    
    private static $assets = [
        'blocks' => 'blocks.js',
        'embedpress-block' => 'embedpress-block.js',
        'pdf-block' => 'pdf-block.js',
        'calendar-block' => 'calendar-block.js',
        'document-block' => 'document-block.js',
        'elementor-widgets' => 'elementor-widgets.js',
        'admin-dashboard' => 'admin-dashboard.js',
        'analytics-dashboard' => 'analytics-dashboard.js',
        'settings-panel' => 'settings-panel.js',
        'onboarding-wizard' => 'onboarding-wizard.js',
        'shortcode-handlers' => 'shortcode-handlers.js',
        'frontend' => 'frontend.js',
        'social-share' => 'social-share.js',
        'analytics-tracker' => 'analytics-tracker.js',
    ];
    
    public static function enqueue_asset($asset_name, $dependencies = [], $in_footer = true) {
        if (!isset(self::$assets[$asset_name])) {
            error_log("EmbedPress: Unknown asset '$asset_name'");
            return false;
        }
        
        $file = self::$assets[$asset_name];
        $url = EMBEDPRESS_URL_ASSETS . '../public/' . $file;
        $path = EMBEDPRESS_PATH_BASE . 'public/' . $file;
        
        if (!file_exists($path)) {
            error_log("EmbedPress: Asset file not found: $path");
            return false;
        }
        
        $version = filemtime($path);
        
        wp_enqueue_script(
            "embedpress-$asset_name",
            $url,
            $dependencies,
            $version,
            $in_footer
        );
        
        return true;
    }
    
    public static function enqueue_gutenberg_blocks() {
        self::enqueue_asset('blocks', ['wp-blocks', 'wp-element', 'wp-editor']);
    }
    
    public static function enqueue_admin_dashboard() {
        self::enqueue_asset('admin-dashboard', ['wp-element']);
    }
    
    public static function enqueue_analytics() {
        self::enqueue_asset('analytics-dashboard', ['wp-element']);
    }
    
    public static function enqueue_frontend() {
        self::enqueue_asset('frontend');
    }
}
`;

fs.writeFileSync(path.join(rootDir, 'includes/AssetManager.php'), phpHelper);
console.log('   ✅ PHP helper generated: includes/AssetManager.php');

// Step 6: Show next steps
console.log('\n🎉 Migration completed successfully!\n');
console.log('📋 Next Steps:');
console.log('   1. Update your PHP files to use the new AssetManager class');
console.log('   2. Replace old enqueue calls with new centralized ones');
console.log('   3. Test all functionality works with new builds');
console.log('   4. Run "npm run dev" for development with hot reload');
console.log('   5. Run "npm run build" for production builds');
console.log('\n📖 See MIGRATION_GUIDE.md for detailed instructions');
console.log('\n✨ Happy coding with the new modern setup!');
