#!/usr/bin/env node

/**
 * EmbedPress Localization Keys Migration Script
 * 
 * This script helps migrate from old localization variable names to new standardized names.
 * It can be used to update custom JavaScript files that use EmbedPress localization variables.
 * 
 * Usage:
 * node migrate-localization-keys.js <file-path>
 * node migrate-localization-keys.js <directory-path> --recursive
 */

const fs = require('fs');
const path = require('path');

// Migration mappings
const VARIABLE_MIGRATIONS = {
    // Old variable name -> New variable name
    '$data': 'embedpressPreviewData',
    'EMBEDPRESS_ADMIN_PARAMS': 'embedpressAdminParams',
    'wpdeveloperLicenseManagerNonce': 'embedpressLicenseData',
    'embedpressObj': 'embedpressGutenbergData', // Context-dependent
    'eplocalize': 'embedpressFrontendData',
    'embedpressBlockData': 'embedpressNewBlocksData',
    'epgc_object': 'embedpressCalendarData'
};

// Property name migrations (camelCase standardization)
const PROPERTY_MIGRATIONS = {
    // Old property -> New property
    'ajax_url': 'ajaxUrl',
    'ajaxurl': 'ajaxUrl',
    'is_pro_plugin_active': 'isProPluginActive',
    'site_url': 'siteUrl',
    'active_blocks': 'activeBlocks',
    'source_nonce': 'sourceNonce',
    'can_upload_media': 'canUploadMedia',
    'EMBEDPRESS_URL_ASSETS': 'assetsUrl',
    'iframe_width': 'iframeWidth',
    'iframe_height': 'iframeHeight',
    'pdf_custom_color': 'pdfCustomColor',
    'youtube_brand_logo_url': 'brandingLogos.youtube',
    'vimeo_brand_logo_url': 'brandingLogos.vimeo',
    'wistia_brand_logo_url': 'brandingLogos.wistia',
    'twitch_brand_logo_url': 'brandingLogos.twitch',
    'dailymotion_brand_logo_url': 'brandingLogos.dailymotion',
    'user_roles': 'userRoles',
    'current_user': 'currentUser',
    'is_embedpress_feedback_submited': 'feedbackSubmitted',
    'turn_off_rating_help': 'ratingHelpDisabled',
    'EMBEDPRESS_SHORTCODE': 'shortcode',
    'wistia_labels': 'wistiaLabels',
    'wisita_options': 'wistiaOptions',
    'embedpress_powered_by': 'poweredBy',
    'embedpress_pro': 'isProVersion',
    'twitch_host': 'twitchHost',
    'document_cta': 'documentCta',
    'pdf_renderer': 'pdfRenderer',
    'rest_url': 'restUrl',
    'plugin_dir_path': 'pluginDirPath',
    'plugin_dir_url': 'pluginDirUrl',
    'all_day': 'allDay',
    'created_by': 'createdBy',
    'go_to_event': 'goToEvent',
    'unknown_error': 'unknownError',
    'request_error': 'requestError',
    'embedpress_lisence_nonce': 'nonce'
};

// Special context-aware migrations
const CONTEXT_MIGRATIONS = {
    // For settings page, embedpressGutenbergData should become embedpressSettingsData
    'ep-settings-script': {
        'embedpressObj': 'embedpressSettingsData'
    }
};

function migrateFileContent(content, filePath) {
    let migratedContent = content;
    let changesMade = [];

    // Migrate variable names
    for (const [oldVar, newVar] of Object.entries(VARIABLE_MIGRATIONS)) {
        const regex = new RegExp(`\\b${escapeRegExp(oldVar)}\\b`, 'g');
        if (regex.test(migratedContent)) {
            migratedContent = migratedContent.replace(regex, newVar);
            changesMade.push(`Variable: ${oldVar} -> ${newVar}`);
        }
    }

    // Migrate property names
    for (const [oldProp, newProp] of Object.entries(PROPERTY_MIGRATIONS)) {
        // Match property access patterns like .old_prop or ['old_prop']
        const dotRegex = new RegExp(`\\.${escapeRegExp(oldProp)}\\b`, 'g');
        const bracketRegex = new RegExp(`\\['${escapeRegExp(oldProp)}'\\]`, 'g');
        const bracketDoubleRegex = new RegExp(`\\["${escapeRegExp(oldProp)}"\\]`, 'g');

        if (dotRegex.test(migratedContent)) {
            migratedContent = migratedContent.replace(dotRegex, `.${newProp}`);
            changesMade.push(`Property: .${oldProp} -> .${newProp}`);
        }

        if (bracketRegex.test(migratedContent)) {
            migratedContent = migratedContent.replace(bracketRegex, `['${newProp}']`);
            changesMade.push(`Property: ['${oldProp}'] -> ['${newProp}']`);
        }

        if (bracketDoubleRegex.test(migratedContent)) {
            migratedContent = migratedContent.replace(bracketDoubleRegex, `["${newProp}"]`);
            changesMade.push(`Property: ["${oldProp}"] -> ["${newProp}"]`);
        }
    }

    // Special case for function parameters that use $data
    const functionParamRegex = /function\s*\([^)]*\$data[^)]*\)/g;
    if (functionParamRegex.test(migratedContent)) {
        migratedContent = migratedContent.replace(/\$data/g, 'embedpressPreviewData');
        changesMade.push('Function parameter: $data -> embedpressPreviewData');
    }

    return {
        content: migratedContent,
        changes: changesMade
    };
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function migrateFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const result = migrateFileContent(content, filePath);

        if (result.changes.length > 0) {
            // Create backup
            const backupPath = filePath + '.backup';
            fs.writeFileSync(backupPath, content);

            // Write migrated content
            fs.writeFileSync(filePath, result.content);

            console.log(`✅ Migrated: ${filePath}`);
            console.log(`   Backup created: ${backupPath}`);
            result.changes.forEach(change => {
                console.log(`   - ${change}`);
            });
            console.log('');

            return true;
        } else {
            console.log(`ℹ️  No changes needed: ${filePath}`);
            return false;
        }
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
        return false;
    }
}

function migrateDirectory(dirPath, recursive = false) {
    const items = fs.readdirSync(dirPath);
    let totalMigrated = 0;

    for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory() && recursive) {
            totalMigrated += migrateDirectory(itemPath, recursive);
        } else if (stat.isFile() && (item.endsWith('.js') || item.endsWith('.jsx'))) {
            if (migrateFile(itemPath)) {
                totalMigrated++;
            }
        }
    }

    return totalMigrated;
}

function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('Usage:');
        console.log('  node migrate-localization-keys.js <file-path>');
        console.log('  node migrate-localization-keys.js <directory-path> --recursive');
        console.log('');
        console.log('Examples:');
        console.log('  node migrate-localization-keys.js custom-script.js');
        console.log('  node migrate-localization-keys.js ./custom-scripts --recursive');
        process.exit(1);
    }

    const targetPath = args[0];
    const recursive = args.includes('--recursive');

    if (!fs.existsSync(targetPath)) {
        console.error(`❌ Path does not exist: ${targetPath}`);
        process.exit(1);
    }

    const stat = fs.statSync(targetPath);
    let totalMigrated = 0;

    console.log('🚀 Starting EmbedPress localization keys migration...\n');

    if (stat.isFile()) {
        if (migrateFile(targetPath)) {
            totalMigrated = 1;
        }
    } else if (stat.isDirectory()) {
        totalMigrated = migrateDirectory(targetPath, recursive);
    }

    console.log(`\n✨ Migration complete! ${totalMigrated} file(s) migrated.`);
    
    if (totalMigrated > 0) {
        console.log('\n📝 Next steps:');
        console.log('1. Test your migrated files thoroughly');
        console.log('2. Update any custom documentation');
        console.log('3. Remove .backup files once you\'re satisfied with the migration');
        console.log('\n📖 See docs/LOCALIZATION_KEYS.md for the complete migration guide');
    }
}

if (require.main === module) {
    main();
}

module.exports = {
    migrateFileContent,
    VARIABLE_MIGRATIONS,
    PROPERTY_MIGRATIONS
};
