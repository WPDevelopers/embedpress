/**
 * Centralized URL configuration for EmbedPress Playwright tests
 * 
 * This file provides a single source of truth for all URLs used in tests.
 * To change the base URL, simply update the BASE_URL constant below.
 */

// Base URL for the EmbedPress test site (configurable via env var)
const BASE_URL = process.env.E2E_BASE_URL || process.env.WP_BASE_URL || 'http://localhost:8080/';

/**
 * URL helper functions
 */
const urls = {
  // Base URL
  base: BASE_URL,

  // WordPress admin URLs
  admin: {
    login: 'wp-login.php',
    dashboard: 'wp-admin/',
    plugins: 'wp-admin/plugins.php?plugin_status=all&paged=1&s',
    embedpress: 'wp-admin/admin.php?page=embedpress',
    embedpressElements: 'wp-admin/admin.php?page=embedpress&page_type=elements',
    embedpressAds: 'wp-admin/admin.php?page=embedpress&page_type=ads',
    postEdit: (postId) => `wp-admin/post.php?post=${postId}&action=edit&classic-editor`,
  },

  // Classic editor test pages
  classic: {
    learningApps: 'playwright-classic-editor/classic-learningapps/',
    circuitlab: 'classic-circuitlab/',
    codepoints: 'playwright-classic-editor/cl-codepoints/',
    ludus: 'classic-ludus/',
    wordpressTv: 'playwright-classic-editor/classic-wordpress-tv/',
    songlink: 'playwright-classic-editor/cl-songlink/',
    gettyImages: 'playwright-classic-editor/classic-getty-images/',
    animoto: 'classic-animoto/',
    videopress: 'playwright-classic-editor/cl-videopress/',
    cloudup: 'playwright-classic-editor/classic-cloudup/',
    documentGoogleViewer: 'playwright-classic-editor/document-google-viewer/',
    geographicUk: 'playwright-gutenberg/gu-geographic-uk/', // Note: This seems to be a URL mismatch in original
    giphy: 'playwright-classic-editor/classic-giphy/',
    googlePhotos: 'playwright-classic-editor/classic-google-photos/',
    youtube: 'playwright-classic-editor/classic-youtube/',
  },

  // Gutenberg test pages
  gutenberg: {
    circuitlab: 'gutenberg-circuitlab/',
    learningApps: 'playwright-gutenberg/gu-learning-apps/',
    wordpressTv: 'gutenberg-wordpress-tv/',
    videopress: 'playwright-gutenberg/gu-videopress/',
    songlink: 'playwright-gutenberg/gu-songlink/',
    cloudup: 'gutenberg-cloudup/',
    codepoints: 'gu-codepoints/',
    geographicUk: 'playwright-classic-editor/cl-geographic-uk/', // Note: This seems to be a URL mismatch in original
    animoto: 'gutenberg-animoto/',
    gettyImages: 'playwright-gutenberg/gutenberg-getty-images/',
    padlet: 'playwright-gutenberg/gutenberg-padlet/',
    ludus: 'gutenberg-ludus/',
    sway: 'playwright-gutenberg/gu-sway/',
    ifixit: 'gu-ifixit/',
    meetup: 'playwright-gutenberg/gutenberg-meetup/',
    overflow: 'gu-overflow/',
    instagramReel: 'gutenberg-instagram-reels-support/',
    documentBlocks: 'gutenberg-document-blocks/',
    giphy: 'playwright-gutenberg/gutenberg-giphy/',
    googlePhotosJustifyLayout: 'gu-google-photos-justify-layout/',
    linkedin: 'playwright-gutenberg/gutenberg-linkedin/',
    github: 'playwright-gutenberg/gutenberg-github-gist/',
    googlePhotos: 'playwright-elementor/gutenberg-google-photos',
  },

  // Elementor test pages
  elementor: {
    learningApps: 'playwright-elementor/el-learningapps/',
    circuitlab: 'elementor-circuitlab/',
    googlePhotosJustifyLayout: 'playwright-elementor/el-google-photos-justify-layout/',
  },
};

/**
 * Helper function to build full URL from relative path
 * @param {string} relativePath - The relative path from the base URL
 * @returns {string} - The complete URL
 */
function buildUrl(relativePath) {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  return BASE_URL + cleanPath;
}

/**
 * Helper function to get URL by category and key
 * @param {string} category - The category (classic, gutenberg, elementor, admin)
 * @param {string} key - The specific page key
 * @returns {string} - The relative path
 */
function getUrl(category, key) {
  if (urls[category] && urls[category][key]) {
    return urls[category][key];
  }
  throw new Error(`URL not found for category: ${category}, key: ${key}`);
}

module.exports = {
  BASE_URL,
  urls,
  buildUrl,
  getUrl,
};
