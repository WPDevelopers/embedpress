<?php
/*
 * It will be customzed for OpenSea
 *  All undefined vars comes from 'render_settings_page' method
 *  */

$opensea_settings = get_option(EMBEDPRESS_PLG_NAME . ':opensea');

$os_api_key = isset($opensea_settings['api_key']) ? $opensea_settings['api_key'] : '';
$limit = isset($opensea_settings['limit']) ? $opensea_settings['limit'] : 9;
$orderby = isset($opensea_settings['orderby']) ? $opensea_settings['orderby'] : 'desc';

?>

<div class="embedpress__settings background__white radius-25 p40">
    <h3><?php esc_html_e("Instagram Settings", "embedpress"); ?></h3>
    <div class="embedpress__settings__form">
        <form action="" method="post" class="embedpress-settings-form">
            <?php
            do_action('embedpress_before_opensea_settings_fields');
            echo  $nonce_field; ?>
            <div class="account-section">
                <div class="account-wrap full-width-layout">
                    <p>
                        <a href="https://www.instagram.com/oauth/authorize?app_id=504270170253170&amp;redirect_uri=https://socialfeed.quadlayers.com/instagram.php&amp;response_type=code&amp;scope=user_profile,user_media&amp;state=http://development.local/wp-admin/admin.php" class="account-button personal-account" target="_self" title="Add Personal Account">Add Personal Account</a>
                        <a href="https://www.facebook.com/dialog/oauth?client_id=834353156975525&amp;redirect_uri=https://socialfeed.quadlayers.com/facebook.php&amp;response_type=code&amp;scope=pages_show_list,instagram_basic,instagram_manage_comments,instagram_manage_insights,pages_read_engagement&amp;state=http://development.local/wp-admin/admin.php" class="account-button business-account" target="_self" title="Add Business Account">Add Business Account</a>
                        <a class="account-link" href="#">Button not working?</a>
                        <span class="premium-field">
                            <span class="description hidden">
                                <small>Multiple user accounts and business accounts are premium features.</small>
                            </span>
                        </span>
                    </p>
                    <table class="form-table widefat striped account-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Username</th>
                                <th>Account</th>
                                <th>Access Token</th>
                                <th>Type</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td width="1%">
                                    <img class="user-avatar" src="https://scontent.fdac24-2.fna.fbcdn.net/v/t51.2885-15/326128178_1158293968205888_957285593711873729_n.jpg?_nc_cat=105&amp;ccb=1-7&amp;_nc_sid=86c713&amp;_nc_ohc=UhmSz3hSWI0AX_A01FU&amp;_nc_ht=scontent.fdac24-2.fna&amp;edm=AL-3X8kEAAAA&amp;oh=00_AfCcklPe9J7M5sMxP2rbozlhootFAeNw5cQuTm1qI0JeGQ&amp;oe=64BE6794">
                                </td>
                                <td>me_tester23</td>
                                <td>17841451532462963</td>
                                <td style="width: 300px;">
                                    <input type="text" readonly="" value="EAAL21vuJ66UBABlz1aMCiTw09HuOYs0abrFc8TJNBgZClMyUlawrXYZA0NY0jiy8VUZCa5JzguobLVrBNXapizVfRnb9IetGa8FC5R5ZAypGpo1x1GCFC4g9c1FTLJwEkc5MH5bCATZBNB2u1WjJen1cD8tx5aFfdj0i2ZBqUDJc7EDOwZAYaop">
                                    <button class="button button-primary"><i class="dashicons dashicons-admin-page"></i></button>
                                </td>
                                <td>BUSINESS</td>
                                <td>15-09-2023 - 09:09</td>
                                <td>
                                    <button class="button button-secondary"><i class="dashicons dashicons-trash"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>


            <?php do_action('embedpress_after_opensea_settings_fields'); ?>
            <button class="button button__themeColor radius-10 embedpress-submit-btn" name="submit" value="opensea"><?php esc_html_e('Save Changes', 'embedpress'); ?></button>
        </form>
    </div>
</div>