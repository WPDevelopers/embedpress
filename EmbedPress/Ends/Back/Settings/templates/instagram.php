<?php
/*
 * It will be customzed for OpenSea
 *  All undefined vars comes from 'render_settings_page' method
 *  */

$personal_token_url = 'https://www.instagram.com/oauth/authorize?app_id=1021573018834002&redirect_uri=https://api.embedpress.com/instagram.php&response_type=code&scope=user_profile,user_media&state=' . admin_url('admin.php');

$account_type = isset($_GET['account_type']) ? $_GET['account_type'] : '';
$access_token = isset($_GET['access_token']) ? $_GET['access_token'] : '';

$get_personal_account = get_option( 'instagram_personal_account_type');

$token_data = [
    [
        'account_type' => $account_type,
        'access_token' => $access_token,
    ]
];

$token_data = [];

if(is_array($get_personal_account) && !empty($get_personal_account)) {
    $token_data = array_unique(array_merge($token_data, $get_personal_account));
}

update_option( 'instagram_personal_account_type', $token_data);

?>

<div class="embedpress__settings background__white radius-25 p40">
    <h3><?php esc_html_e("Instagram Settings", "embedpress"); ?></h3>
    <div class="embedpress__settings__form">
        <div class="account-section">
            <div class="account-wrap full-width-layout">
                <p>
                    <a href="<?php echo esc_url($personal_token_url); ?>" class="account-button personal-account" target="_blank" title="Add Personal Account">Add Personal Account</a>

                    <a href="https://www.facebook.com/dialog/oauth?client_id=834353156975525&redirect_uri=https://socialfeed.quadlayers.com/facebook.php&response_type=code&scope=pages_show_list,instagram_basic,instagram_manage_comments,instagram_manage_insights,pages_read_engagement&state=http://development.local/wp-admin/admin.php" class="account-button business-account" target="_self" title="Add Business Account">Add Business Account</a>
                    <a class="account-link" href="#">Button not working?</a>
                    <span class="premium-field">
                        <span class="description hidden">
                            <small>Multiple user accounts and business accounts are premium features.</small>
                        </span>
                    </span>
                </p>
                <table class="emebedpress">
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
                            <td>
                                <img class="user-avatar" src="https://scontent.fdac24-2.fna.fbcdn.net/v/t51.2885-15/326128178_1158293968205888_957285593711873729_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=86c713&_nc_ohc=UhmSz3hSWI0AX_A01FU&_nc_ht=scontent.fdac24-2.fna&edm=AL-3X8kEAAAA&oh=00_AfCcklPe9J7M5sMxP2rbozlhootFAeNw5cQuTm1qI0JeGQ&oe=64BE6794">
                            </td>
                            <td>me_tester23</td>
                            <td>17841451532462963</td>
                            <td style="width: 300px;">
                                <input type="text" readonly="" value="EAAL21vuJ66UBAAdpPZAXvKEEZAku3TOJSvusdfdsehlC0LvL4EQ8r3PhhG05jXeYxxeRBxJr1hEV3OUIPQCgzZCNZADO9L0Xb5Hv5ZCY2oxOBltsrBkKqsdfsdYKhpL1TKEKTpvZC2JmrYF4kZBHREyLGix0yOsntdwZAFdCyw5BGBvq9ZBhSqxrS1QLSvLT8Hq">
                                <button class="button button-primary"><i class="dashicons dashicons-admin-page"></i></button>
                            </td>
                            <td>BUSINESS</td>
                            <td>15-09-2023 - 09:09</td>
                            <td>
                                <button class="button button-secondary"><i class="dashicons dashicons-trash"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <img class="user-avatar" src="https://scontent.fdac24-2.fna.fbcdn.net/v/t51.2885-15/326128178_1158293968205888_957285593711873729_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=86c713&_nc_ohc=UhmSz3hSWI0AX_A01FU&_nc_ht=scontent.fdac24-2.fna&edm=AL-3X8kEAAAA&oh=00_AfCcklPe9J7M5sMxP2rbozlhootFAeNw5cQuTm1qI0JeGQ&oe=64BE6794">
                            </td>
                            <td>me_tester23</td>
                            <td>17841451532462963</td>
                            <td style="width: 300px;">
                                <input type="text" readonly="" value="EAAL21vuJ66UBAAdpPZAXvKEEZAku3TOJSvusdfdsehlC0LvL4EQ8r3PhhG05jXeYxxeRBxJr1hEV3OUIPQCgzZCNZADO9L0Xb5Hv5ZCY2oxOBltsrBkKqsdfsdYKhpL1TKEKTpvZC2JmrYF4kZBHREyLGix0yOsntdwZAFdCyw5BGBvq9ZBhSqxrS1QLSvLT8Hq">
                                <button class="button button-primary"><i class="dashicons dashicons-admin-page"></i></button>
                            </td>
                            <td>BUSINESS</td>
                            <td>15-09-2023 - 09:09</td>
                            <td>
                                <button class="button button-secondary"><i class="dashicons dashicons-trash"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <img class="user-avatar" src="https://scontent.fdac24-2.fna.fbcdn.net/v/t51.2885-15/326128178_1158293968205888_957285593711873729_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=86c713&_nc_ohc=UhmSz3hSWI0AX_A01FU&_nc_ht=scontent.fdac24-2.fna&edm=AL-3X8kEAAAA&oh=00_AfCcklPe9J7M5sMxP2rbozlhootFAeNw5cQuTm1qI0JeGQ&oe=64BE6794">
                            </td>
                            <td>me_tester23</td>
                            <td>17841451532462963</td>
                            <td style="width: 300px;">
                                <input type="text" readonly="" value="EAAL21vuJ66UBAAdpPZAXvKEEZAku3TOJSvusdfdsehlC0LvL4EQ8r3PhhG05jXeYxxeRBxJr1hEV3OUIPQCgzZCNZADO9L0Xb5Hv5ZCY2oxOBltsrBkKqsdfsdYKhpL1TKEKTpvZC2JmrYF4kZBHREyLGix0yOsntdwZAFdCyw5BGBvq9ZBhSqxrS1QLSvLT8Hq">
                                <button class="button button-primary"><i class="dashicons dashicons-admin-page"></i></button>
                            </td>
                            <td>BUSINESS</td>
                            <td>15-09-2023 - 09:09</td>
                            <td>
                                <button class="button button-secondary"><i class="dashicons dashicons-trash"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <img class="user-avatar" src="https://scontent.fdac24-2.fna.fbcdn.net/v/t51.2885-15/326128178_1158293968205888_957285593711873729_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=86c713&_nc_ohc=UhmSz3hSWI0AX_A01FU&_nc_ht=scontent.fdac24-2.fna&edm=AL-3X8kEAAAA&oh=00_AfCcklPe9J7M5sMxP2rbozlhootFAeNw5cQuTm1qI0JeGQ&oe=64BE6794">
                            </td>
                            <td>me_tester23</td>
                            <td>17841451532462963</td>
                            <td style="width: 300px;">
                                <input type="text" readonly="" value="EAAL21vuJ66UBAAdpPZAXvKEEZAku3TOJSvusdfdsehlC0LvL4EQ8r3PhhG05jXeYxxeRBxJr1hEV3OUIPQCgzZCNZADO9L0Xb5Hv5ZCY2oxOBltsrBkKqsdfsdYKhpL1TKEKTpvZC2JmrYF4kZBHREyLGix0yOsntdwZAFdCyw5BGBvq9ZBhSqxrS1QLSvLT8Hq">
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

    </div>
</div>