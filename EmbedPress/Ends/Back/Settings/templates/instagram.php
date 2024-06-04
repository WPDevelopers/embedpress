<?php
/*
 * It will be customzed for OpenSea
 *  All undefined vars comes from 'render_settings_page' method
 *  */

$personal_token_url = 'https://www.instagram.com/oauth/authorize?app_id=2250628018456167&redirect_uri=https://api.embedpress.com/instagram.php&response_type=code&scope=user_profile,user_media&state=' . admin_url('admin.php');

$business_token_url = 'https://www.facebook.com/dialog/oauth?client_id=928673724899905&redirect_uri=https://api.embedpress.com/facebook.php&response_type=code&scope=pages_show_list,instagram_basic,instagram_manage_comments,instagram_manage_insights,pages_read_engagement&state=' . admin_url('admin.php') . '&user_id=5511';

$personal_data = !empty(get_option('ep_instagram_account_data')) ? get_option('ep_instagram_account_data') : [];

$business_data = !empty(get_option('ep_instagram_account_data')) ? get_option('ep_instagram_account_data') : [];

$feed_data = !empty(get_option('ep_instagram_feed_data')) ? get_option('ep_instagram_feed_data') : [];

$get_data = $personal_data;

// echo '<pre>';
// print_r($feed_data); die;

// $profile_ = $feed_data[]

$is_connected = false;

?>

<div class="embedpress__settings background__white radius-25 p40">
    <h3><?php esc_html_e("Instagram Settings", "embedpress"); ?></h3>
    <div class="embedpress__settings__form">
        <div class="account-section">
            <div class="account-wrap full-width-layout">
                <p>

                    <?php if (is_array($get_data) && count($get_data) > 0) : ?>
                        <button id="open-modal-btn" href="<?php echo esc_url($personal_token_url); ?>" class="account-button personal-account" target="_self" title="Add Personal Account">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path fill="none" d="M0 0h24v24H0z" />
                                <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" /></svg>
                            <?php echo esc_html__('Connect with Instagram', 'embedpress'); ?>
                        </button>
                    <?php endif; ?>

                    <div class="modal-overlay">
                        <div class="modal">
                            <!-- Modal content -->
                            <form class="instagram_account__form form__inline modal-content" action="" method="POST" id="instagram-form">
                                <span class="close-btn">✕</span>
                                <label for="account-option"><?php echo esc_html__('Account Type: '); ?></label>
                                <div class="form-group">
                                    <select name="account-option" id="account-option" class="form__control">
                                        <option value="personal" selected><?php echo esc_html__('Personal', 'embedpress'); ?></option>
                                        <option value="business"><?php echo esc_html__('Business', 'embedpress'); ?></option>
                                    </select>
                                </div>

                                <label for="instagram-access-token"><?php echo esc_html__('Access Token: '); ?></label>
                                <input type="text" name="instagram-access-token" id="instagram-access-token" class="instagram-access-token form__control" placeholder="<?php echo esc_attr__('Enter valid access token.', 'embedpress') ?>" required>

                                <div class="form-footer">
                                    <button class="button button__themeColor copy__button" type="submit"><span><?php echo esc_html__('Connect', 'embedpress'); ?></span></button>

                                    <div>
                                        <a class="for-business hidden" target="_blank" href="<?php echo esc_url('https://embedpress.com/docs/generate-instagram-access-token/'); ?>"><?php echo esc_html__('Get access token', 'embedpress'); ?></a>
                                        <a class="for-personal" target="_blank" href="<?php echo esc_url('https://embedpress.com/docs/generate-instagram-access-token/'); ?>"><?php echo esc_html__('Get access token', 'embedpress'); ?></a>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                </p>
                <table class="emebedpress">
                    <thead>
                        <tr>
                            <th><?php echo esc_html__('Account', 'embedpress'); ?></th>
                            <!-- <th><?php echo esc_html__('Username', 'embedpress'); ?></th> -->
                            <th><?php echo esc_html__('Access Token', 'embedpress'); ?></th>
                            <!-- <th><?php echo esc_html__('Expire Date', 'embedpress'); ?></th> -->
                            <th><?php echo esc_html__('Type', 'embedpress'); ?></th>
                            <th><?php echo esc_html__('Profile Link', 'embedpress'); ?></th>
                            <th><?php echo esc_html__('Sync', 'embedpress'); ?></th>
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

                                <?php if (!empty($feed_data[$data['user_id']]['feed_userinfo']['profile_picture_url'])) :
                                            $avater_url = $feed_data[$data['user_id']]['feed_userinfo']['profile_picture_url'];
                                        else :
                                            $avater_url = 'http://2.gravatar.com/avatar/b642b4217b34b1e8d3bd915fc65c4452?s=150&d=mm&r=g';
                                        endif; ?>

                                <tr data-userid="<?php echo esc_attr($data['user_id']); ?>" data-accounttype="<?php echo esc_attr($data['account_type']); ?>">
                                    <td class="instagram-user-account">
                                        <div class="user-image"><img class="user-avatar" src="<?php echo esc_url($avater_url); ?>"></div>
                                        <div>

                                            <div class="username"><?php echo esc_html($data['username']) ?></div>
                                            <div class="userid"><?php echo esc_html($data['user_id']) ?></div>
                                        </div>
                                    </td>
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
                                    <!-- <td>1312</td> -->
                                    <td style="text-transform: uppercase;"><?php echo esc_attr($data['account_type']); ?></td>

                                    <td><button class="user-profile-link" title="<?php echo esc_attr('https://instagram.com/' . $data['username']) ?>">Copy</button></td>

                                    <td class="instagram-sync-data" data-userid="<?php echo esc_attr($data['user_id'])?>" data-acceess-token="<?php echo esc_attr($data['access_token'])?>" data-account-type="<?php echo esc_attr($data['account_type'])?>">
                                       <i class="dashicons dashicons-update-alt emcs-dashicon"></i>
                                    </td>
                                    <td>
                                        <button class="button button-secondary account-delete-button"><i class="dashicons dashicons-trash"></i></button>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>


                    </tbody>

                </table>

                <?php if (is_array($get_data) && count($get_data) == 0) : ?>
                    <div class="no-account-connected">
                        <button id="open-modal-btn" href="<?php echo esc_url($personal_token_url); ?>" class="account-button personal-account" target="_self" title="Add Personal Account">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path fill="none" d="M0 0h24v24H0z" />
                                <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" /></svg>
                            <?php echo esc_html__('Connect with Instagram', 'embedpress'); ?>
                        </button>
                    </div>
                <?php endif; ?>
            </div>
        </div>

    </div>
</div>