<?php
/*
 * It will be customzed for OpenSea
 *  All undefined vars comes from 'render_settings_page' method
 *  */

$personal_token_url = 'https://www.instagram.com/oauth/authorize?app_id=2250628018456167&redirect_uri=https://api.embedpress.com/instagram.php&response_type=code&scope=user_profile,user_media&state=' . admin_url('admin.php');

$business_token_url = 'https://www.facebook.com/dialog/oauth?client_id=928673724899905&redirect_uri=https://api.embedpress.com/facebook.php&response_type=code&scope=pages_show_list,instagram_basic,instagram_manage_comments,instagram_manage_insights,pages_read_engagement&state=' . admin_url('admin.php') . '&user_id=5511';

$personal_data = !empty(get_option('instagram_account_data')) ? get_option('instagram_account_data') : [];

$business_data = !empty(get_option('instagram_account_data')) ? get_option('instagram_account_data') : [];;

$get_data = $personal_data;

$is_connected = false;


?>

<div class="embedpress__settings background__white radius-25 p40">
    <h3><?php esc_html_e("Instagram Settings", "embedpress"); ?></h3>
    <div class="embedpress__settings__form">
        <div class="account-section">
            <div class="account-wrap full-width-layout">
                <p>
                    <a href="<?php echo esc_url($personal_token_url); ?>" class="account-button personal-account" target="_self" title="Add Personal Account">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/></svg>
                    <?php echo esc_html__( 'Connect with Instagram', 'embedpress' ); ?>
                </a>

                <form class="shortcode__form form__inline" id="instagram-form"  action="" method="POST">
                    <div class="form__group">
                        <select name="account-option" id="account-option">
                            <option value="personal"  class="form__control" selected>Personal</option>
                            <option value="business"  class="form__control">Business</option>
                        </select>
                    </div>
                    <div class="form__group">
                        <input type="text" name="instagram-access-token" id="instagram-access-token" class="instagram-access-token form__control" required>
                    </div>
                    <button class="button button__themeColor copy__button" type="submit"><span>Submit</span></button>
                </form>

                </p>
                <table class="emebedpress">
                    <thead>
                        <tr>
                            <th><?php echo esc_html__('Image', 'embedpress'); ?></th>
                            <th><?php echo esc_html__('Username', 'embedpress'); ?></th>
                            <th><?php echo esc_html__('Account', 'embedpress'); ?></th>
                            <th><?php echo esc_html__('Access Token', 'embedpress'); ?></th>
                            <th><?php echo esc_html__('Type', 'embedpress'); ?></th>
                            <th><?php echo esc_html__('Connect business', 'embedpress');?></th>
                            <th><?php echo esc_html__('Action', 'embedpress'); ?></th>
                        </tr>
                    </thead>
                    <tbody>

                        <?php if (is_array($get_data) && count($get_data) > 0) : ?>
                            <?php
                                $avater_url = 'http://2.gravatar.com/avatar/b642b4217b34b1e8d3bd915fc65c4452?s=150&d=mm&r=g';
                                if (!empty($get_data['account_type']) && (strtolower($get_data['account_type'])  === 'business')) {
                                    $avater_url = '';
                                }
                                ?>
                            <?php foreach ($get_data as $data) : ?>
                                <tr data-userid="<?php echo esc_attr($data['user_id']); ?>" data-accounttype="<?php echo esc_attr($data['account_type']); ?>">
                                    <td>
                                        <div class="user-image"><img class="user-avatar" src="<?php echo esc_url($avater_url); ?>"></div>
                                    </td>
                                    <td><?php echo esc_html($data['username']) ?></td>
                                    <td><?php echo esc_html($data['user_id']) ?></td>
                                    <?php
                                            if (!empty($data['user_id'])) {
                                                $is_connected = true;
                                            }
                                            ?>
                                    <td style="width: 300px;">
                                        <input type="text" readonly="" value="<?php echo esc_attr($data['access_token']); ?>" maxlength="20" pattern="">
                                        <span>...</span>
                                        <!-- <button class="button button-primary"><i class="dashicons dashicons-admin-page"></i></button> -->
                                    </td>
                                    <td style="text-transform: uppercase;"><?php echo esc_attr($data['account_type']); ?></td>

                                    <td>
                                        <div class="user-image">
                                            <?php
                                                    if (strtolower($data['account_type']) !== 'business') {
                                                        if (!empty($is_connected)) {
                                                            echo '<a href="' . esc_url('https://www.facebook.com/dialog/oauth?client_id=1280977446114033&redirect_uri=https://api.embedpress.com/facebook.php&response_type=code&scope=pages_show_list,instagram_basic,instagram_manage_comments,instagram_manage_insights,pages_read_engagement&state=' . admin_url('admin.php') . '?user_id=' . $data['user_id'] . '') . ',username=' . $data['username'] . '" target="_self" title="Add Business Account"><i class="dashicons dashicons-plus"></i></a>';
                                                        }
                                                    } else {
                                                        echo '<i class="dashicons dashicons-saved"></i>';
                                                    }

                                                    ?>
                                        </div>
                                    </td>

                                    <td>
                                        <button class="button button-secondary account-delete-button"><i class="dashicons dashicons-trash"></i></button>
                                    </td>
                                </tr>
                            <?php endforeach; ?>

                        <?php endif; ?>


                    </tbody>

                </table>
            </div>
        </div>

    </div>
</div>