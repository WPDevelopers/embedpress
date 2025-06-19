/**
 * EmbedPress Frontend Enhancements
 *
 * Handles enhanced functionality for EmbedPress blocks
 * Content is saved directly in the database, with placeholders converted to actual embeds
 */

(function($) {
    'use strict';

    /**
     * Initialize frontend enhancements
     */
    function initFrontendEnhancements() {
        // Process any placeholders that need to be converted to actual embeds
        processEmbedPlaceholders();

        // Initialize social sharing functionality
        initSocialSharing();

        // Initialize responsive embeds
        initResponsiveEmbeds();

        // Initialize custom player enhancements
        initCustomPlayerEnhancements();
    }

    /**
     * Process embed placeholders and convert them to actual embeds
     */
    function processEmbedPlaceholders() {
        $('.embedpress-placeholder[data-url]').each(function() {
            const $placeholder = $(this);
            const url = $placeholder.data('url');
            const width = $placeholder.data('width') || 600;
            const height = $placeholder.data('height') || 400;

            // Generate embed HTML based on URL
            const embedHTML = generateEmbedHTML(url, width, height);

            if (embedHTML) {
                $placeholder.replaceWith(embedHTML);
            }
        });
    }

    /**
     * Generate embed HTML for common providers
     */
    function generateEmbedHTML(url, width, height) {
        // Spotify
        if (url.includes('open.spotify.com')) {
            const embedUrl = url.replace('open.spotify.com', 'open.spotify.com/embed').split('?')[0];
            return `<iframe src="${embedUrl}" width="${width}" height="${height}" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`;
        }

        // YouTube
        const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
        if (youtubeMatch) {
            const videoId = youtubeMatch[1];
            return `<iframe src="https://www.youtube.com/embed/${videoId}" width="${width}" height="${height}" frameborder="0" allowfullscreen></iframe>`;
        }

        // Vimeo
        const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
        if (vimeoMatch) {
            const videoId = vimeoMatch[1];
            return `<iframe src="https://player.vimeo.com/video/${videoId}" width="${width}" height="${height}" frameborder="0" allowfullscreen></iframe>`;
        }

        // For other URLs, return a link as fallback
        return `<div style="padding: 15px; border: 1px solid #ddd; background: #f9f9f9; text-align: center;">
            <p><strong>EmbedPress:</strong> <a href="${url}" target="_blank" rel="noopener">${url}</a></p>
        </div>`;
    }

    /**
     * Initialize social sharing functionality
     */
    function initSocialSharing() {
        $('.wp-block-embedpress-embedpress .ep-social-icon').on('click', function(e) {
            e.preventDefault();

            const $this = $(this);
            const url = window.location.href;
            const title = document.title;

            let shareUrl = '';

            if ($this.hasClass('facebook')) {
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            } else if ($this.hasClass('twitter')) {
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
            } else if ($this.hasClass('pinterest')) {
                shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title)}`;
            } else if ($this.hasClass('linkedin')) {
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            }

            if (shareUrl) {
                window.open(shareUrl, 'share', 'width=600,height=400,scrollbars=yes,resizable=yes');
            }
        });
    }

    /**
     * Initialize responsive embeds
     */
    function initResponsiveEmbeds() {
        // Make iframes responsive
        $('.wp-block-embedpress-embedpress iframe').each(function() {
            const $iframe = $(this);
            const $wrapper = $iframe.closest('.ep-embed-content-wraper');

            if ($wrapper.length && !$wrapper.hasClass('responsive-wrapper')) {
                $wrapper.addClass('responsive-wrapper');
            }
        });
    }

    /**
     * Initialize custom player enhancements
     */
    function initCustomPlayerEnhancements() {
        // Add any custom player functionality here
        $('.wp-block-embedpress-embedpress[data-playerid]').each(function() {
            const $block = $(this);
            const playerId = $block.data('playerid');

            // Trigger custom event for player initialization
            $block.trigger('embedpress:player:init', {
                playerId: playerId
            });
        });
    }

    /**
     * Initialize when DOM is ready
     */
    $(document).ready(function() {
        initFrontendEnhancements();
    });

    // Also initialize for dynamically loaded content
    $(document).on('embedpress:init', function() {
        initFrontendEnhancements();
    });

    // Expose functions for external use
    window.EmbedPress = window.EmbedPress || {};
    window.EmbedPress.initEnhancements = initFrontendEnhancements;

})(jQuery);
