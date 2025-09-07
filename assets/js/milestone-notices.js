/**
 * EmbedPress Milestone Notices JavaScript
 * 
 * Handles milestone notice interactions and AJAX requests
 */

(function($) {
    'use strict';

    const MilestoneNotices = {
        
        /**
         * Initialize milestone notices functionality
         */
        init: function() {
            this.bindEvents();
            this.addUserFeedback();
        },

        /**
         * Bind event handlers
         */
        bindEvents: function() {
            // Handle notice dismissal
            $(document).on('click', '.embedpress-milestone-notice .notice-dismiss', this.dismissNotice);
            
            // Handle upgrade button clicks
            $(document).on('click', '.embedpress-upgrade-btn', this.trackUpgradeClick);
            
            // Auto-dismiss after 30 seconds if not interacted with
            this.setupAutoDismiss();
        },

        /**
         * Dismiss milestone notice
         */
        dismissNotice: function(e) {
            const $notice = $(this).closest('.embedpress-milestone-notice');
            const timestamp = $notice.data('timestamp');

            // Send AJAX request to dismiss notice
            $.ajax({
                url: embedpressMilestoneNotices.ajax_url,
                type: 'POST',
                data: {
                    action: 'embedpress_dismiss_milestone_notice',
                    timestamp: timestamp,
                    nonce: embedpressMilestoneNotices.nonce
                },
                success: function(response) {
                    if (response.success) {
                        $notice.fadeOut(300, function() {
                            $(this).remove();
                        });
                    }
                },
                error: function() {
                    console.error('Failed to dismiss milestone notice');
                }
            });
        },

        /**
         * Track upgrade button click
         */
        trackUpgradeClick: function(e) {
            const $button = $(this);
            const milestoneType = $button.data('milestone-type');
            const milestoneValue = $button.data('milestone-value');

            // Track the click
            $.ajax({
                url: embedpressMilestoneNotices.ajax_url,
                type: 'POST',
                data: {
                    action: 'embedpress_track_upgrade_click',
                    milestone_type: milestoneType,
                    milestone_value: milestoneValue,
                    nonce: embedpressMilestoneNotices.nonce
                },
                success: function(response) {
                    // Click tracked successfully
                    console.log('Upgrade click tracked');
                },
                error: function() {
                    console.error('Failed to track upgrade click');
                }
            });

            // Don't prevent the default action (opening the upgrade link)
        },

        /**
         * Setup auto-dismiss functionality with smart timing
         */
        setupAutoDismiss: function() {
            $('.embedpress-milestone-notice').each(function() {
                const $notice = $(this);

                // Smart auto-dismiss timing based on user engagement
                let dismissTime = 45000; // Default 45 seconds

                // Extend time if user is actively engaging
                $notice.on('mouseenter', function() {
                    dismissTime += 15000; // Add 15 seconds on hover
                });

                // Reduce time if user seems busy (multiple clicks elsewhere)
                let clickCount = 0;
                $(document).on('click', function(e) {
                    if (!$(e.target).closest('.embedpress-milestone-notice').length) {
                        clickCount++;
                        if (clickCount >= 3) {
                            dismissTime = Math.max(15000, dismissTime - 10000); // Reduce but keep minimum
                        }
                    }
                });

                // Auto-dismiss with smart timing
                setTimeout(function() {
                    if ($notice.is(':visible')) {
                        $notice.find('.notice-dismiss').trigger('click');
                    }
                }, dismissTime);
            });
        },

        /**
         * Show milestone notice with animation
         */
        showNotice: function(noticeHtml) {
            const $notice = $(noticeHtml);
            $notice.hide().prependTo('#wpbody-content .wrap').fadeIn(500);

            // Add entrance animation
            $notice.addClass('embedpress-milestone-notice-enter');

            setTimeout(function() {
                $notice.removeClass('embedpress-milestone-notice-enter');
            }, 500);
        },

        /**
         * Add subtle user feedback for better UX
         */
        addUserFeedback: function() {
            // Add hover effects for better interactivity
            $(document).on('mouseenter', '.embedpress-milestone-notice', function() {
                $(this).addClass('embedpress-notice-hovered');
            }).on('mouseleave', '.embedpress-milestone-notice', function() {
                $(this).removeClass('embedpress-notice-hovered');
            });

            // Add click feedback for upgrade button
            $(document).on('mousedown', '.embedpress-upgrade-btn', function() {
                $(this).addClass('embedpress-btn-clicked');
            }).on('mouseup mouseleave', '.embedpress-upgrade-btn', function() {
                $(this).removeClass('embedpress-btn-clicked');
            });

            // Show subtle progress indicator when dismissing
            $(document).on('click', '.embedpress-milestone-notice .notice-dismiss', function() {
                const $notice = $(this).closest('.embedpress-milestone-notice');
                $notice.addClass('embedpress-notice-dismissing');
            });
        }
    };

    // Initialize when document is ready
    $(document).ready(function() {
        MilestoneNotices.init();
    });

    // Make available globally if needed
    window.EmbedPressMilestoneNotices = MilestoneNotices;

    console.log('EmbedPress Milestone Notices: Loaded');

})(jQuery);
