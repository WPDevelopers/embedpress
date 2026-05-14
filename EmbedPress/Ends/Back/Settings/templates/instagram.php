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

$ep_is_pro_active = apply_filters('embedpress/is_allow_rander', false);

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
                                <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
                            </svg>
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
                                    <option value="personal"><?php echo esc_html__('Personal', 'embedpress'); ?></option>
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

                                <tr data-userid="<?php echo esc_attr($data['user_id']); ?>" data-username="<?php echo esc_attr($data['username']); ?>" data-accounttype="<?php echo esc_attr($data['account_type']); ?>">
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

                                    <td class="instagram-sync-data" data-userid="<?php echo esc_attr($data['user_id']) ?>" data-acceess-token="<?php echo esc_attr($data['access_token']) ?>" data-account-type="<?php echo esc_attr($data['account_type']) ?>">
                                        <i class="dashicons dashicons-update-alt emcs-dashicon"></i>
                                    </td>
                                    <td>
                                        <button class="button button-secondary ep-ig-sc-trigger" title="<?php esc_attr_e('Generate Shortcode', 'embedpress'); ?>" data-username="<?php echo esc_attr($data['username']); ?>" data-accounttype="<?php echo esc_attr($data['account_type']); ?>"><i class="dashicons dashicons-shortcode"></i></button>
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
                                <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
                            </svg>
                            <?php echo esc_html__('Connect with Instagram', 'embedpress'); ?>
                        </button>
                    </div>
                <?php endif; ?>
            </div>
        </div>

    </div>
</div>

<?php if (is_array($get_data) && count($get_data) > 0) : ?>
    <div class="ep-ig-sc-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="ep-ig-sc-title">
        <div class="ep-ig-sc-modal">
            <div class="ep-ig-sc-header">
                <h3 id="ep-ig-sc-title"><?php esc_html_e('Instagram Shortcode Generator', 'embedpress'); ?></h3>
                <p class="ep-ig-sc-sub">
                    <?php esc_html_e('Configure your Instagram feed and copy the shortcode into any post, page, or widget.', 'embedpress'); ?>
                </p>
                <button type="button" class="ep-ig-sc-close" aria-label="Close">&times;</button>
            </div>

            <div class="ep-ig-sc-body">

                <details class="ep-ig-sc-section" open>
                    <summary><?php esc_html_e('Source', 'embedpress'); ?></summary>
                    <div class="ep-ig-sc-grid">
                        <div>
                            <label for="ep-ig-sc-account"><?php esc_html_e('Account', 'embedpress'); ?></label>
                            <select id="ep-ig-sc-account" class="form__control">
                                <?php foreach ($get_data as $data) : ?>
                                    <option value="<?php echo esc_attr($data['username']); ?>" data-type="<?php echo esc_attr($data['account_type']); ?>">
                                        @<?php echo esc_html($data['username']); ?> (<?php echo esc_html($data['account_type']); ?>)
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div>
                            <label for="ep-ig-sc-feedtype"><?php esc_html_e('Feed Type', 'embedpress'); ?></label>
                            <select id="ep-ig-sc-feedtype" class="form__control">
                                <option value="user_account_type"><?php esc_html_e('User Account', 'embedpress'); ?></option>
                                <option value="hashtag_type"><?php esc_html_e('Hashtag', 'embedpress'); ?></option>
                            </select>
                        </div>
                        <div class="ep-ig-sc-hashtag-row" style="display:none;">
                            <label for="ep-ig-sc-hashtag"><?php esc_html_e('Hashtag (no #)', 'embedpress'); ?></label>
                            <input type="text" id="ep-ig-sc-hashtag" class="form__control" placeholder="travel">
                        </div>
                    </div>
                </details>

                <details class="ep-ig-sc-section" open>
                    <summary><?php esc_html_e('Layout', 'embedpress'); ?></summary>
                    <div class="ep-ig-sc-grid">
                        <div>
                            <label for="ep-ig-sc-layout"><?php esc_html_e('Layout', 'embedpress'); ?></label>
                            <select id="ep-ig-sc-layout" class="form__control">
                                <option value="insta-grid"><?php esc_html_e('Grid', 'embedpress'); ?></option>
                            </select>
                        </div>
                        <div>
                            <label for="ep-ig-sc-cols"><?php esc_html_e('Columns', 'embedpress'); ?></label>
                            <input type="number" id="ep-ig-sc-cols" class="form__control" value="3" min="1" max="6">
                        </div>
                        <div>
                            <label for="ep-ig-sc-gap"><?php esc_html_e('Column Gap (px)', 'embedpress'); ?></label>
                            <input type="number" id="ep-ig-sc-gap" class="form__control" value="10" min="0" max="100">
                        </div>
                        <div>
                            <label for="ep-ig-sc-pcount"><?php esc_html_e('Posts per page', 'embedpress'); ?></label>
                            <input type="number" id="ep-ig-sc-pcount" class="form__control" value="6" min="1" max="50">
                        </div>
                        <div>
                            <label for="ep-ig-sc-width"><?php esc_html_e('Width (px, optional)', 'embedpress'); ?></label>
                            <input type="number" id="ep-ig-sc-width" class="form__control" placeholder="900">
                        </div>
                    </div>
                </details>

                <details class="ep-ig-sc-section">
                    <summary><?php esc_html_e('Profile Header', 'embedpress'); ?></summary>
                    <div class="ep-ig-sc-toggles">
                        <label><input type="checkbox" id="ep-ig-sc-profile" checked> <?php esc_html_e('Profile image', 'embedpress'); ?></label>
                        <label><input type="checkbox" id="ep-ig-sc-accname" checked> <?php esc_html_e('Account name', 'embedpress'); ?></label>
                        <label><input type="checkbox" id="ep-ig-sc-followbtn"> <?php esc_html_e('Follow button', 'embedpress'); ?></label>
                        <label><input type="checkbox" id="ep-ig-sc-followers"> <?php esc_html_e('Followers count', 'embedpress'); ?></label>
                        <label><input type="checkbox" id="ep-ig-sc-posts-count"> <?php esc_html_e('Posts count', 'embedpress'); ?></label>
                    </div>
                    <div class="ep-ig-sc-grid" style="margin-top:14px;">
                        <div>
                            <label for="ep-ig-sc-followbtn-label"><?php esc_html_e('Follow button label', 'embedpress'); ?></label>
                            <input type="text" id="ep-ig-sc-followbtn-label" class="form__control" placeholder="Follow">
                        </div>
                        <div>
                            <label for="ep-ig-sc-followers-text"><?php esc_html_e('Followers text (use {count})', 'embedpress'); ?></label>
                            <input type="text" id="ep-ig-sc-followers-text" class="form__control" placeholder="{count} Followers">
                        </div>
                        <div>
                            <label for="ep-ig-sc-posts-text"><?php esc_html_e('Posts text (use {count})', 'embedpress'); ?></label>
                            <input type="text" id="ep-ig-sc-posts-text" class="form__control" placeholder="{count} Posts">
                        </div>
                    </div>
                </details>

                <details class="ep-ig-sc-section">
                    <summary><?php esc_html_e('Load More', 'embedpress'); ?></summary>
                    <div class="ep-ig-sc-toggles">
                        <label><input type="checkbox" id="ep-ig-sc-loadmore"> <?php esc_html_e('Show load-more button', 'embedpress'); ?></label>
                    </div>
                    <div class="ep-ig-sc-grid" style="margin-top:14px;">
                        <div>
                            <label for="ep-ig-sc-loadmore-label"><?php esc_html_e('Load-more label', 'embedpress'); ?></label>
                            <input type="text" id="ep-ig-sc-loadmore-label" class="form__control" placeholder="Load More">
                        </div>
                    </div>
                </details>

                <details class="ep-ig-sc-section">
                    <summary><?php esc_html_e('Engagement', 'embedpress'); ?><?php if (!$ep_is_pro_active) : ?> <span class="pro-badge">PRO</span><?php endif; ?></summary>
                    <div class="ep-ig-sc-toggles">
                        <label><input type="checkbox" id="ep-ig-sc-likes"> <?php esc_html_e('Likes count', 'embedpress'); ?></label>
                        <label><input type="checkbox" id="ep-ig-sc-comments"> <?php esc_html_e('Comments count', 'embedpress'); ?></label>
                        <label><input type="checkbox" id="ep-ig-sc-popup"> <?php esc_html_e('Open in popup', 'embedpress'); ?></label>
                        <label><input type="checkbox" id="ep-ig-sc-popup-followbtn"> <?php esc_html_e('Follow btn in popup', 'embedpress'); ?></label>
                    </div>
                    <div class="ep-ig-sc-grid" style="margin-top:14px;">
                        <div>
                            <label for="ep-ig-sc-popup-followbtn-label"><?php esc_html_e('Popup follow-btn label', 'embedpress'); ?></label>
                            <input type="text" id="ep-ig-sc-popup-followbtn-label" class="form__control" placeholder="Follow">
                        </div>
                    </div>
                </details>

            </div><!-- /.ep-ig-sc-body -->

            <div class="ep-ig-sc-output-wrap">
                <label for="ep-ig-sc-output"><?php esc_html_e('Generated Shortcode', 'embedpress'); ?></label>
                <textarea id="ep-ig-sc-output" class="form__control" readonly rows="3"></textarea>
                <div class="ep-ig-sc-actions">
                    <button type="button" id="ep-ig-sc-copy" class="button button__themeColor"><?php esc_html_e('Copy Shortcode', 'embedpress'); ?></button>
                    <span id="ep-ig-sc-copy-msg"><?php esc_html_e('Copied!', 'embedpress'); ?></span>
                </div>
            </div>
        </div>
    </div>

    <style>
        /* trigger button in the row */
        .ep-ig-sc-trigger {
            margin-right: 6px;
            background: linear-gradient(135deg, #6354a5 0%, #b04ea3 100%) !important;
            color: #fff !important;
            border: 0 !important;
        }

        .ep-ig-sc-trigger .dashicons {
            color: #fff;
        }

        .ep-ig-sc-trigger:hover {
            filter: brightness(1.05);
        }

        /* overlay */
        .ep-ig-sc-modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(20, 22, 36, 0.7);
            backdrop-filter: blur(2px);
            z-index: 100000;
            display: none;
            align-items: flex-start;
            justify-content: center;
            padding: 40px 16px;
            overflow-y: auto;
            animation: epIgScFadeIn .15s ease-out;
        }

        .ep-ig-sc-modal-overlay.is-open {
            display: flex;
        }

        @keyframes epIgScFadeIn {
            from {
                opacity: 0;
            }

            to {
                opacity: 1;
            }
        }

        /* modal frame */
        .ep-ig-sc-modal {
            background: #fff;
            border-radius: 14px;
            box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
            max-width: 720px;
            width: 100%;
            position: relative;
            font-size: 14px;
            color: #2c3142;
            overflow: hidden;
            clip-path: inset(0 round 14px);
            isolation: isolate;
            animation: epIgScRise .18s ease-out;
        }

        @keyframes epIgScRise {
            from {
                transform: translateY(12px);
                opacity: 0;
            }

            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        /* header */
        .ep-ig-sc-header {
            background: linear-gradient(135deg, #6354a5 0%, #b04ea3 60%, #f08a3c 100%);
            color: #fff;
            padding: 22px 28px;
            border-top-left-radius: 14px;
            border-top-right-radius: 14px;
        }

        .ep-ig-sc-header h3 {
            margin: 0;
            color: #fff;
            font-size: 18px;
            line-height: 1.3;
        }

        .ep-ig-sc-header .ep-ig-sc-sub {
            margin: 6px 0 0;
            color: rgba(255, 255, 255, 0.85);
            font-size: 13px;
        }

        .ep-ig-sc-close {
            position: absolute;
            top: 14px;
            right: 14px;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.22);
            border: 0;
            cursor: pointer;
            font-size: 18px;
            line-height: 1;
            color: #fff;
            transition: background .15s, transform .15s;
        }

        .ep-ig-sc-close:hover {
            background: rgba(255, 255, 255, 0.4);
            transform: rotate(90deg);
        }

        /* body */
        .ep-ig-sc-body {
            padding: 18px 28px 20px;
            max-height: calc(90vh - 240px);
            overflow-y: auto;
        }

        /* fields */
        .ep-ig-sc-modal label {
            font-weight: 600;
            display: block;
            margin-bottom: 6px;
            font-size: 12.5px;
            color: #4a4f63;
            letter-spacing: .01em;
        }

        .ep-ig-sc-modal .form__control {
            width: 100%;
            height: 38px;
            padding: 0 12px;
            border: 1px solid #d8dbe5;
            border-radius: 8px;
            box-sizing: border-box;
            background: #fff;
            font-size: 13px;
            color: #2c3142;
            transition: border-color .15s, box-shadow .15s;
        }

        .ep-ig-sc-modal .form__control:focus {
            outline: none;
            border-color: #6354a5;
            box-shadow: 0 0 0 3px rgba(99, 84, 165, 0.15);
        }

        .ep-ig-sc-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px 16px;
        }

        @media (min-width: 600px) {
            .ep-ig-sc-grid {
                grid-template-columns: repeat(3, minmax(0, 1fr));
            }
        }

        /* sections (collapsible) */
        .ep-ig-sc-section {
            margin-top: 12px;
            border: 1px solid #ecedf3;
            border-radius: 10px;
            background: #fafbfd;
            padding: 0 16px;
            transition: border-color .15s;
        }

        .ep-ig-sc-section[open] {
            background: #fff;
            border-color: #e1e3ed;
        }

        .ep-ig-sc-section summary {
            cursor: pointer;
            padding: 13px 0;
            font-weight: 600;
            color: #2c3142;
            list-style: none;
            user-select: none;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13.5px;
        }

        .ep-ig-sc-section summary::-webkit-details-marker {
            display: none;
        }

        .ep-ig-sc-section summary::before {
            content: "";
            width: 16px;
            height: 16px;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%237c8194'%3E%3Cpath d='M6 4l4 4-4 4'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: center;
            transition: transform .15s;
        }

        .ep-ig-sc-section[open] summary::before {
            transform: rotate(90deg);
        }

        .ep-ig-sc-section>*:not(summary) {
            padding-bottom: 14px;
        }

        .ep-ig-sc-section .pro-badge {
            font-size: 10px;
            padding: 2px 8px;
            border-radius: 999px;
            background: #5B4E96;
            color: #fff;
            font-weight: 700;
            letter-spacing: .05em;
            margin-left: 6px;
        }

        /* toggle chips */
        .ep-ig-sc-toggles {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
        }

        @media (min-width: 600px) {
            .ep-ig-sc-toggles {
                grid-template-columns: repeat(3, 1fr);
            }
        }

        .ep-ig-sc-toggles label {
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 0;
            padding: 8px 10px;
            background: #fff;
            border: 1px solid #ecedf3;
            border-radius: 8px;
            cursor: pointer;
            transition: border-color .15s, background .15s;
            color: #4a4f63;
            font-size: 13px;
        }

        .ep-ig-sc-toggles label:hover {
            border-color: #c9c4e0;
        }

        .ep-ig-sc-toggles input[type="checkbox"] {
            accent-color: #6354a5;
            width: 16px;
            height: 16px;
            margin: 0;
        }

        /* sticky output footer */
        .ep-ig-sc-output-wrap {
            padding: 16px 28px 20px;
            background: #f6f7fb;
            border-top: 1px solid #ecedf3;
        }

        .ep-ig-sc-output-wrap label {
            font-size: 12.5px;
            margin-bottom: 8px;
        }

        .ep-ig-sc-modal textarea.form__control {
            height: auto;
            padding: 12px;
            font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
            font-size: 12.5px;
            line-height: 1.55;
            color: #2c3142;
            background: #fff;
            resize: vertical;
        }

        .ep-ig-sc-actions {
            margin-top: 10px;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .ep-ig-sc-actions .button__themeColor {
            background: linear-gradient(135deg, #6354a5, #b04ea3) !important;
            color: #fff !important;
            border: 0 !important;
            padding: 8px 18px !important;
            height: auto !important;
            border-radius: 8px !important;
            font-weight: 600 !important;
            font-size: 13px !important;
            box-shadow: 0 4px 14px rgba(99, 84, 165, 0.25);
            transition: transform .12s, box-shadow .15s;
        }

        .ep-ig-sc-actions .button__themeColor:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 18px rgba(99, 84, 165, 0.35);
        }

        .ep-ig-sc-actions #ep-ig-sc-copy-msg {
            color: #0a8a3a;
            font-weight: 600;
            font-size: 13px;
            display: none;
            align-items: center;
            gap: 4px;
        }

        .ep-ig-sc-actions #ep-ig-sc-copy-msg.is-visible {
            display: inline-flex;
        }

        .ep-ig-sc-actions #ep-ig-sc-copy-msg::before {
            content: "✓";
            display: inline-block;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #0a8a3a;
            color: #fff;
            text-align: center;
            line-height: 18px;
            font-size: 11px;
        }
    </style>

    <script>
        (function() {
            var overlay = document.querySelector('.ep-ig-sc-modal-overlay');
            if (!overlay) return;

            var $ = function(id) {
                return document.getElementById(id);
            };

            var accountEl = $('ep-ig-sc-account');
            var feedEl = $('ep-ig-sc-feedtype');
            var hashtagRow = overlay.querySelector('.ep-ig-sc-hashtag-row');
            var hashtagEl = $('ep-ig-sc-hashtag');
            var layoutEl = $('ep-ig-sc-layout');
            var colsEl = $('ep-ig-sc-cols');
            var gapEl = $('ep-ig-sc-gap');
            var pcountEl = $('ep-ig-sc-pcount');
            var widthEl = $('ep-ig-sc-width');
            var output = $('ep-ig-sc-output');
            var copyBtn = $('ep-ig-sc-copy');
            var copyMsg = $('ep-ig-sc-copy-msg');
            var closeBtn = overlay.querySelector('.ep-ig-sc-close');

            var bools = {
                'ep-ig-sc-profile': 'instafeedProfileImage',
                'ep-ig-sc-accname': 'instafeedAccName',
                'ep-ig-sc-followbtn': 'instafeedFollowBtn',
                'ep-ig-sc-followers': 'instafeedFollowersCount',
                'ep-ig-sc-posts-count': 'instafeedPostsCount',
                'ep-ig-sc-loadmore': 'instafeedLoadmore',
                'ep-ig-sc-likes': 'instafeedLikesCount',
                'ep-ig-sc-comments': 'instafeedCommentsCount',
                'ep-ig-sc-popup': 'instafeedPopup',
                'ep-ig-sc-popup-followbtn': 'instafeedPopupFollowBtn'
            };
            var texts = {
                'ep-ig-sc-followbtn-label': {
                    attr: 'instafeedFollowBtnLabel',
                    def: 'Follow'
                },
                'ep-ig-sc-followers-text': {
                    attr: 'instafeedFollowersCountText',
                    def: '{count} Followers'
                },
                'ep-ig-sc-posts-text': {
                    attr: 'instafeedPostsCountText',
                    def: '{count} Posts'
                },
                'ep-ig-sc-loadmore-label': {
                    attr: 'instafeedLoadmoreLabel',
                    def: 'Load More'
                },
                'ep-ig-sc-popup-followbtn-label': {
                    attr: 'instafeedPopupFollowBtnLabel',
                    def: 'Follow'
                }
            };

            // WordPress' shortcode parser breaks on `[` `]` inside attr values. We use
            // `{count}` as the placeholder in shortcodes; the InstagramFeed template
            // accepts both `[count]` and `{count}`.
            function safeAttrValue(v) {
                return v.replace(/\[/g, '{').replace(/\]/g, '}').replace(/"/g, '&quot;');
            }

            function gen() {
                if (!accountEl || !accountEl.value) {
                    output.value = '';
                    return;
                }
                var username = accountEl.value;
                var feedType = feedEl.value;
                var url, attrs = [];

                if (feedType === 'hashtag_type') {
                    hashtagRow.style.display = '';
                    var tag = (hashtagEl.value || '').trim().replace(/^#/, '');
                    url = tag ? ('https://instagram.com/explore/tags/' + encodeURIComponent(tag)) : ('https://instagram.com/' + username);
                    attrs.push('instafeedFeedType="hashtag_type"');
                    if (tag) attrs.push('instafeedHashtag="' + tag + '"');
                } else {
                    hashtagRow.style.display = 'none';
                    url = 'https://instagram.com/' + username;
                    attrs.push('instafeedFeedType="user_account_type"');
                }

                attrs.push('instaLayout="' + layoutEl.value + '"');
                attrs.push('instafeedColumns="' + (parseInt(colsEl.value, 10) || 3) + '"');
                attrs.push('instafeedColumnsGap="' + (parseInt(gapEl.value, 10) || 0) + '"');
                attrs.push('instafeedPostsPerPage="' + (parseInt(pcountEl.value, 10) || 6) + '"');

                Object.keys(bools).forEach(function(id) {
                    var el = $(id);
                    if (el) attrs.push(bools[id] + '="' + (el.checked ? 'true' : 'false') + '"');
                });

                Object.keys(texts).forEach(function(id) {
                    var el = $(id);
                    var cfg = texts[id];
                    var val = (el && el.value && el.value.trim() !== '') ? el.value : cfg.def;
                    attrs.push(cfg.attr + '="' + safeAttrValue(val) + '"');
                });

                if (widthEl.value) attrs.push('width="' + (parseInt(widthEl.value, 10) || '') + '"');

                output.value = '[embedpress ' + attrs.join(' ') + ']' + url + '[/embedpress]';
            }

            overlay.querySelectorAll('input, select').forEach(function(el) {
                el.addEventListener('input', gen);
                el.addEventListener('change', gen);
            });

            function openModal(prefillUsername) {
                if (prefillUsername && accountEl) {
                    for (var i = 0; i < accountEl.options.length; i++) {
                        if (accountEl.options[i].value === prefillUsername) {
                            accountEl.selectedIndex = i;
                            break;
                        }
                    }
                }
                gen();
                overlay.classList.add('is-open');
                document.body.style.overflow = 'hidden';
            }

            function closeModal() {
                overlay.classList.remove('is-open');
                document.body.style.overflow = '';
            }

            document.addEventListener('click', function(e) {
                var trigger = e.target.closest('.ep-ig-sc-trigger');
                if (trigger) {
                    e.preventDefault();
                    openModal(trigger.getAttribute('data-username') || '');
                }
            });

            closeBtn.addEventListener('click', closeModal);
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) closeModal();
            });
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeModal();
            });

            copyBtn.addEventListener('click', function(e) {
                e.preventDefault();
                output.select();
                var done = function() {
                    copyMsg.classList.add('is-visible');
                    setTimeout(function() {
                        copyMsg.classList.remove('is-visible');
                    }, 1500);
                };
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(output.value).then(done, function() {
                        try {
                            document.execCommand('copy');
                            done();
                        } catch (err) {}
                    });
                } else {
                    try {
                        document.execCommand('copy');
                        done();
                    } catch (err) {}
                }
            });
        })();
    </script>
<?php endif; ?>