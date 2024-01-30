<?php

function get_remove_page_info_url($id)
{
    $nonce = wp_create_nonce('remove_fb_page_info_nonce');

    $remove_page_info_url = add_query_arg(
        array(
            'page' => 'embedpress',
            'page_type' => 'facebook',
            'remove_fb_page_info' => $id,
            '_nonce' => $nonce,
        ),
        admin_url('admin.php')
    );

    return $remove_page_info_url;
}


function is_fb_access_token_expired($id) {
    $data = get_option('fb_page_' . $id);
    if (isset($data['access_token']) && isset($data['expires_in'])) {
        $currentTime = time();
        $expirationTime = $currentTime + intval($data['expires_in']);
        return ($expirationTime > $currentTime);
    }

    return false;
}

// echo isAccessTokenExpired(('111570723812466'));
// die;

$facebookAppId = '1872535063163422';
$redirectUri = 'https://api.embedpress.com/facebook-feed.php';
$state = admin_url('admin.php');

$scope = [
    'pages_read_engagement,',
    'pages_read_user_content',
    'business_management',
    'pages_show_list',
    // 'public_profile'
];

$params = [
    'client_id' => $facebookAppId,
    'redirect_uri' => $redirectUri,
    'auth_type' => 'rerequest',
    'scope' => implode(',', $scope),
    'response_type' => 'token',
    'type' => 'fb_page',
    'state' => $state,
];


https://www.facebook.com/dialog/oauth?client_id=1332798716823516

$oauthDialogUrl = 'https://www.facebook.com/v18.0/dialog/oauth?' . http_build_query($params);
$page_infos = get_option('facebook_page_info');

?>

<div class="embedpress_calendly_settings  background__white radius-25 p40">
    <h3 class="facebook-settings-title"><?php esc_html_e("Calendly Settings", "embedpress"); ?></h3>
    <div class="facebook-embedpress-authorize-button">

        <div class="facebook-connector-container">
            <div class="account-wrap full-width-layout">

                <a href="<?php echo esc_url($oauthDialogUrl); ?>" class="facebook-connect-button" target="_self" title="Connect with Calendly">
                    <span class="embedpress-facebook-icon dashicons dashicons-facebook"></span>
                    <?php echo esc_html__('Connect with User', 'embedpress'); ?>
                </a>

                <a href="<?php echo esc_url($oauthDialogUrl); ?>" class="facebook-connect-button" target="_self" title="Connect with Calendly">
                    <span class="embedpress-facebook-icon dashicons dashicons-facebook"></span>
                    <?php echo esc_html__('Connect with Page', 'embedpress'); ?>
                </a>

                <a href="<?php echo esc_url($oauthDialogUrl); ?>" class="facebook-connect-button" target="_self" title="Connect with Calendly">
                    <span class="embedpress-facebook-icon dashicons dashicons-facebook"></span>
                    <?php echo esc_html__('Connect with Group', 'embedpress'); ?>
                </a>
            </div>
        </div>
    </div>
    <div class="tab-content active" id="scheduled-events">

        <div class="calendly-day-list">
            <div class="calendly-data">
                <table class="rwd-table" cellspacing="0">
                    <tbody>
                        <tr>
                            <th>Page Info</th>
                            <th>Page URL</th>
                            <!-- <th>Access Token</th>
                            <th>Token Status</th> -->
                            <th>Sync</th>
                            <th></th>
                        </tr>
                        <?php
                        if (is_array($page_infos)) {
                            foreach ($page_infos as $info) :

                                $token_info = get_option('fb_page_' . $info['id']);
                                if (!empty(is_fb_access_token_expired($info['id']))) {
                                    $urlParams = [
                                        'access_token' => $token_info['access_token'],
                                        'page_id' => $token_info['page_id'],
                                        'fb_sync' => 'true',
                                    ];
                                    $synOauthDialogUrl = $state . '?' . http_build_query($urlParams);
                                } else {
                                    $params['state'] = $state . '?fb_sync=true';
                                    $synOauthDialogUrl = 'https://www.facebook.com/v18.0/dialog/oauth?' . http_build_query($params);
                                }
                                ?>
                                <tr>
                                    <td class="fb-page-info">
                                        <div class="info-item">
                                            <a href="<?php echo esc_url($info['link']); ?>" target="_blank">
                                                <img src="<?php echo esc_url($info['picture']['data']['url']); ?>" alt="" class="circle">
                                            </a>
                                            <div class="esf-bio-wrap">

                                                <span class="title"><?php echo esc_html($info['name']); ?></span>

                                                <p>
                                                    <?php echo esc_html($info['category']); ?> <br>
                                                    ID: <?php echo esc_html($info['id']); ?>
                                                </p>

                                            </div>

                                        </div>
                                    </td>
                                    <td class="fb-page-link" id=fbPageLink>
                                        <span class="link"><?php echo esc_url($info['link']); ?></span>
                                        <span class="dashicons dashicons-admin-page copy-button" data-fb-page-url="<?php echo esc_attr($info['link']); ?>">
                                            <span class="toast" id="toast"><?php echo esc_html__('Copied to clipboard!', 'embedpress'); ?></span>
                                        </span>


                                    </td>
                                    <!-- <td class="attendee">
                                    Park jou un </td>
                                <td class="event-action">
                                    Past </td> -->
                                    <td class="facebook-data-sync">
                                        <a href="<?php echo esc_url($synOauthDialogUrl); ?>" class="facebook-sync-button" target="_self" title="<?php echo esc_attr__('Sync new data', 'embedpress'); ?>">
                                            <span class="dashicons dashicons-update-alt emcs-dashicon"></span>
                                        </a>
                                    </td>
                                    <td class="facebook-data-sync">
                                        <a href="<?php echo esc_url(get_remove_page_info_url($info['id'])); ?>" class="facebook-sync-button" target="_self" title="<?php echo esc_attr__('delete_data', 'embedpress'); ?>">
                                            <span class="dashicons dashicons-trash emcs-dashicon"></span>
                                        </a>
                                    </td>
                                </tr>
                        <?php endforeach;
                        } ?>

                    </tbody>
                </table>


            </div>
        </div>
    </div>




</div>