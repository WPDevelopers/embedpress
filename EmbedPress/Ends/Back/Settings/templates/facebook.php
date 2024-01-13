<?php


// https://graph.facebook.com/v18.0/?id=https://www.facebook.com/profile.php?id=100095144835536&access_token=EAAanD4tE8h4BOwXXZAUQpeHnFDV52Rxd56RCaADipi9Fq6oFWYAi7KoQGWbJDP4CTUNOAZAnp8n7hWbY3y14hp9waahijTN8SSaswvOerCV9vvnqRnKFRohnZA0xZB6rCDBVPIXnGZAiJYyOkngE9TwYPoGEtfGN0NhKI7gT1E0KbxtNquCBohwbs9DxstPUhkauFXDmpLmZCjdSQTtcZBj6bvo5izvTah9ZC7vE4FHvzDZAGmZCr2XZAaOcZCopyGzTudnY7vquvwZDZD


$facebookAppId = '1872535063163422';
$redirectUri = 'https://api.embedpress.com/facebook-feed.php';
$state = admin_url('admin.php');

$scope = [
    'pages_read_engagement',
    'pages_read_user_content',
    'business_management',
    'pages_show_list',
    'public_profile'
];

$params = [
    'client_id' => $facebookAppId,
    'redirect_uri' => $redirectUri,
    'auth_type' => 'rerequest',
    'scope' => implode(',', $scope),
    'state' => $state,
    'response_type' => 'token',
    'type' => 'fb_page',
];

$oauthDialogUrl = 'https://www.facebook.com/v18.0/dialog/oauth?' . http_build_query($params);
$remove_page_info_url = admin_url('admin.php') . '?page=embedpress&page_type=facebook&remove_fb_page_info=';

$page_infos = get_option('facebook_page_info');

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



?>

<div class="embedpress_calendly_settings  background__white radius-25 p40">
    <h3 class="facebook-settings-title"><?php esc_html_e("Calendly Settings", "embedpress"); ?></h3>
    <div class="facebook-embedpress-authorize-button">

        <div class="facebook-connector-container">
            <div class="account-wrap full-width-layout">

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
                        <?php foreach ($page_infos as $info) :
                            // echo '<pre>';
                            // print_r($info);
                            // echo '</pre>'; 
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
                                                <span class="dashicons dashicons-admin-page efbl_copy_id tooltipped" data-position="right" data-clipboard-text="<?php echo esc_attr($info['id']); ?>" data-delay="100" data-tooltip="Copy"></span>
                                            </p>

                                        </div>

                                    </div>
                                </td>
                                <td class="fb-page-link"><?php echo esc_url($info['link']); ?> </td>
                                <!-- <td class="attendee">
                                    Park jou un </td>
                                <td class="event-action">
                                    Past </td> -->
                                <td class="facebook-data-sync">
                                    <a href="<?php echo esc_url($oauthDialogUrl); ?>" class="facebook-sync-button" target="_self" title="<?php echo esc_attr__('Sync new data', 'embedpress'); ?>">
                                        <span class="dashicons dashicons-update-alt emcs-dashicon"></span>
                                    </a>
                                </td>
                                <td class="facebook-data-sync">
                                    <a href="<?php echo esc_url(get_remove_page_info_url($info['id'])); ?>" class="facebook-sync-button" target="_self" title="<?php echo esc_attr__('delete_data', 'embedpress'); ?>">
                                        <span class="dashicons dashicons-trash emcs-dashicon"></span>
                                    </a>
                                </td>
                            </tr>
                        <?php endforeach; ?>

                    </tbody>
                </table>


            </div>
        </div>
    </div>




</div>