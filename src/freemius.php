<?php
defined('ABSPATH') or die("No direct script access allowed.");

/**
 * @package     EmbedPress
 * @author      PressShack <help@pressshack.com>
 * @copyright   Copyright (C) 2017 Open Source Training, LLC. All rights reserved.
 * @license     GPLv2 or later
 * @since       1.7.0
 */

// Create a helper function for easy SDK access.
function ep_fs() {
    global $ep_fs;

    if ( ! isset( $ep_fs ) ) {
        // Include Freemius SDK.
        require_once dirname(__FILE__) . '/freemius/start.php';

        $ep_fs = fs_dynamic_init( array(
            'id'                  => '949',
            'slug'                => 'embedpress',
            'type'                => 'plugin',
            'public_key'          => 'pk_238342b79c9d480864db8f8a5c54b',
            'is_premium'          => false,
            'has_addons'          => false,
            'has_paid_plans'      => false,
            'menu'                => array(
                'slug'           => 'embedpress',
                'account'        => false,
                'support'        => false,
            ),
        ) );
    }

    return $ep_fs;
}

// Init Freemius.
ep_fs();
// Signal that SDK was initiated.
do_action( 'ep_fs_loaded' );