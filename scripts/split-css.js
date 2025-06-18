#!/usr/bin/env node

/**
 * CSS Splitter Script
 * 
 * This script splits the combined CSS file into separate editor and frontend files
 * based on CSS selectors and rules.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the build target from command line arguments (default to 'blocks')
const buildTarget = process.argv[2] || 'blocks';

const cssFile = path.join(__dirname, `../assets/css/${buildTarget}.style.build.css`);
const editorFile = path.join(__dirname, `../assets/css/${buildTarget}.editor.build.css`);
const frontendFile = path.join(__dirname, `../assets/css/${buildTarget}.style.build.css`);

// Read the combined CSS file
if (!fs.existsSync(cssFile)) {
    console.error('CSS file not found:', cssFile);
    process.exit(1);
}

const css = fs.readFileSync(cssFile, 'utf8');

// Define patterns for editor-specific styles
const editorPatterns = [
    /\.editor-styles-wrapper[\s\S]*?(?=\n\s*[.#@]|\n\s*$)/g,
    /\.block-editor[\s\S]*?(?=\n\s*[.#@]|\n\s*$)/g,
    /\.components-[\s\S]*?(?=\n\s*[.#@]|\n\s*$)/g,
    /\.embedpress-provider-info[\s\S]*?(?=\n\s*[.#@]|\n\s*$)/g,
    /\.embedpress-block-controls[\s\S]*?(?=\n\s*[.#@]|\n\s*$)/g,
    /\.embedpress-url-input[\s\S]*?(?=\n\s*[.#@]|\n\s*$)/g,
    /\.embedpress-error[\s\S]*?(?=\n\s*[.#@]|\n\s*$)/g,
    /\.embedpress-preview[\s\S]*?(?=\n\s*[.#@]|\n\s*$)/g,
    /\.embedpress-toolbar-button[\s\S]*?(?=\n\s*[.#@]|\n\s*$)/g,
    /\.embedpress-inspector-controls[\s\S]*?(?=\n\s*[.#@]|\n\s*$)/g,
];

// Extract editor styles
let editorStyles = '';
let remainingCss = css;

editorPatterns.forEach(pattern => {
    const matches = css.match(pattern);
    if (matches) {
        matches.forEach(match => {
            editorStyles += match + '\n\n';
            remainingCss = remainingCss.replace(match, '');
        });
    }
});

// Add CSS variables and animations to both files
const cssVariables = css.match(/:root\s*{[\s\S]*?}/g);
const animations = css.match(/@keyframes[\s\S]*?}/g);

let sharedStyles = '';
if (cssVariables) {
    sharedStyles += cssVariables.join('\n\n') + '\n\n';
}
if (animations) {
    sharedStyles += animations.join('\n\n') + '\n\n';
}

// Clean up remaining CSS (remove variables and animations since they're in shared)
if (cssVariables) {
    cssVariables.forEach(variable => {
        remainingCss = remainingCss.replace(variable, '');
    });
}
if (animations) {
    animations.forEach(animation => {
        remainingCss = remainingCss.replace(animation, '');
    });
}

// Clean up extra whitespace
remainingCss = remainingCss.replace(/\n\s*\n\s*\n/g, '\n\n').trim();
editorStyles = editorStyles.replace(/\n\s*\n\s*\n/g, '\n\n').trim();

// Prepare final CSS content
const finalEditorCss = `/**
 * EmbedPress ${buildTarget.charAt(0).toUpperCase() + buildTarget.slice(1)} Editor Styles
 *
 * Styles specifically for the editor
 */

${sharedStyles}${editorStyles}`;

const finalFrontendCss = `/**
 * EmbedPress ${buildTarget.charAt(0).toUpperCase() + buildTarget.slice(1)} Frontend Styles
 *
 * Styles for both frontend and editor (shared styles)
 */

${sharedStyles}${remainingCss}`;

// Write the files
fs.writeFileSync(editorFile, finalEditorCss);
fs.writeFileSync(frontendFile, finalFrontendCss);

console.log('✅ CSS files split successfully:');
console.log(`📝 Editor CSS: ${editorFile} (${(finalEditorCss.length / 1024).toFixed(2)} KB)`);
console.log(`🎨 Frontend CSS: ${frontendFile} (${(finalFrontendCss.length / 1024).toFixed(2)} KB)`);
