/**
 * EmbedPress Feature Tooltip
 * Handles tooltip/popover display and interactions
 * 
 * @package EmbedPress
 * @since 4.1.0
 */

(function($) {
    'use strict';

    // Wait for DOM ready
    $(document).ready(function() {
        console.log('EmbedPress Feature Tooltip: Initializing...');

        const $tooltip = $('#embedpress-feature-tooltip');
        const $menuItem = $('#toplevel_page_embedpress');
        const $menuBadge = $('.embedpress-menu-badge');

        console.log('Tooltip found:', $tooltip.length);
        console.log('Menu item found:', $menuItem.length);
        console.log('Badge found:', $menuBadge.length);

        if (!$tooltip.length) {
            console.error('EmbedPress Feature Tooltip: Tooltip element not found!');
            return;
        }

        // Position and show tooltip after delay
        setTimeout(function() {
            console.log('Showing tooltip...');
            positionTooltip();
            showTooltip();
        }, 1500);

        // Show tooltip when clicking menu badge
        $menuBadge.on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            showTooltip();
        });

        // Close button
        $tooltip.on('click', '.embedpress-feature-tooltip__close', function(e) {
            e.preventDefault();
            hideTooltip();
        });

        // Skip button
        $tooltip.on('click', '.embedpress-feature-tooltip__skip', function(e) {
            e.preventDefault();
            handleSkip();
        });

        // Dismiss when clicking outside
        $(document).on('click', function(e) {
            if ($tooltip.is(':visible') && 
                !$tooltip.is(e.target) && 
                $tooltip.has(e.target).length === 0 &&
                !$menuBadge.is(e.target)) {
                hideTooltip();
            }
        });

        // Reposition on window resize
        $(window).on('resize', debounce(function() {
            if ($tooltip.is(':visible')) {
                positionTooltip();
            }
        }, 250));

        /**
         * Show tooltip
         */
        function showTooltip() {
            // Change from visibility:hidden to visible and fade in
            $tooltip.css({
                'visibility': 'visible',
                'opacity': '1'
            });
        }

        /**
         * Hide tooltip
         */
        function hideTooltip() {
            $tooltip.addClass('embedpress-feature-tooltip--dismissing');
            setTimeout(function() {
                $tooltip.hide().removeClass('embedpress-feature-tooltip--dismissing');
            }, 300);
        }

        /**
         * Position tooltip (now it's inside menu item, so just adjust vertical alignment)
         */
        function positionTooltip() {
            if (!$menuItem.length) {
                return;
            }

            const menuHeight = $menuItem.outerHeight();
            const windowWidth = $(window).width();

            // Mobile: center on screen
            if (windowWidth <= 782) {
                $tooltip.css({
                    position: 'fixed',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    margin: 0
                });
                return;
            }

            // Desktop: align arrow with menu center
            // Arrow is at 24px from top, so offset tooltip top to align arrow with menu center
            const topOffset = (menuHeight / 2) - 35;

            $tooltip.css({
                top: topOffset + 'px'
            });
        }

        /**
         * Handle skip action
         */
        function handleSkip() {
            const noticeId = $tooltip.data('notice-id');
            
            if (!noticeId) {
                hideTooltip();
                return;
            }

            $.ajax({
                url: embedpressFeatureNotices.ajaxurl,
                type: 'POST',
                data: {
                    action: 'embedpress_skip_feature_notice',
                    notice_id: noticeId,
                    nonce: embedpressFeatureNotices.nonce
                },
                success: function(response) {
                    if (response.success) {
                        hideTooltip();
                        $menuBadge.fadeOut(300);
                    }
                },
                error: function() {
                    hideTooltip();
                }
            });
        }

        /**
         * Handle dismiss action (permanent)
         */
        function handleDismiss() {
            const noticeId = $tooltip.data('notice-id');
            
            if (!noticeId) {
                hideTooltip();
                return;
            }

            $.ajax({
                url: embedpressFeatureNotices.ajaxurl,
                type: 'POST',
                data: {
                    action: 'embedpress_dismiss_feature_notice',
                    notice_id: noticeId,
                    nonce: embedpressFeatureNotices.nonce
                },
                success: function(response) {
                    if (response.success) {
                        hideTooltip();
                        $menuBadge.fadeOut(300);
                    }
                },
                error: function() {
                    hideTooltip();
                }
            });
        }

        /**
         * Debounce function
         */
        function debounce(func, wait) {
            let timeout;
            return function() {
                const context = this;
                const args = arguments;
                clearTimeout(timeout);
                timeout = setTimeout(function() {
                    func.apply(context, args);
                }, wait);
            };
        }
    });

})(jQuery);
