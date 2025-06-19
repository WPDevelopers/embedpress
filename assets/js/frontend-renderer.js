/**
 * EmbedPress Frontend Enhancements
 *
 * Handles enhanced functionality for EmbedPress blocks
 * Content is now saved directly in the database, so no AJAX loading needed
 */

(function($) {
    'use strict';

    /**
     * Initialize frontend enhancements
     */
    function initFrontendEnhancements() {
        // Initialize social sharing functionality
        initSocialSharing();

        // Initialize responsive embeds
        initResponsiveEmbeds();

        // Initialize custom player enhancements
        initCustomPlayerEnhancements();
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
