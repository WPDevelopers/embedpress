<?php
/**
 * Pinterest settings page (shared-app model, fbs-81329).
 *
 * EmbedPress hosts the Pinterest developer app at api.embedpress.com; the
 * customer never sees or manages Client ID / Client Secret. This template
 * has just two states:
 *
 *   - Disconnected: a single "Connect with Pinterest" button that kicks
 *     off the OAuth flow against the shared app.
 *   - Connected: account summary + Refresh / Disconnect actions.
 *
 * The page also handles the toast strip that admin_init's
 * handle_pinterest_proxy_return passes via ?pinterest_status=...
 */

if (!defined('ABSPATH')) {
    exit;
}

use EmbedPress\Includes\Classes\PinterestOAuth;

$account       = PinterestOAuth::getAccountData();
$is_connected  = PinterestOAuth::isConnected();
$authorize_url = $is_connected ? '' : PinterestOAuth::buildAuthorizeUrl();
$refresh_url   = $is_connected ? PinterestOAuth::buildRefreshUrl() : '';
?>

<div class="embedpress__settings background__white radius-25 p40">
    <h3><?php esc_html_e('Pinterest Settings', 'embedpress'); ?></h3>

    <p class="description" style="margin-bottom: 16px;">
        <?php esc_html_e('Connect your Pinterest account to unlock authenticated feeds. Until you connect, EmbedPress fetches public profile and board pins via Pinterest\'s RSS endpoints — connect for advanced filtering, board lookups by name, profile metadata, and higher rate limits.', 'embedpress'); ?>
    </p>

    <div class="embedpress__settings__form" style="max-width: 720px;">

        <?php if (!empty($_GET['pinterest_status'])) :
            $status = sanitize_key($_GET['pinterest_status']);
            $messages = [
                'connected'     => ['success', __('Pinterest connected successfully.', 'embedpress')],
                'disconnected'  => ['success', __('Pinterest disconnected.', 'embedpress')],
                'state_invalid' => ['error',   __('OAuth state mismatch — please try connecting again.', 'embedpress')],
                'token_error'   => ['error',   __('Pinterest declined the connection.', 'embedpress')],
            ];
            if (isset($messages[$status])) :
                $msg = $messages[$status];
        ?>
            <div class="notice notice-<?php echo esc_attr($msg[0]); ?>" style="padding: 10px 14px; margin-bottom: 16px;">
                <p style="margin: 0;"><?php echo esc_html($msg[1]); ?></p>
                <?php if (!empty($_GET['pinterest_error_detail'])) : ?>
                    <p style="margin: 6px 0 0; font-size: 12px; color: #6b7280;">
                        <?php echo esc_html(wp_unslash($_GET['pinterest_error_detail'])); ?>
                    </p>
                <?php endif; ?>
            </div>
        <?php endif; endif; ?>

        <?php if ($is_connected) : ?>

            <div class="account-section" style="padding: 18px; border: 1px solid #e5e7eb; border-radius: 12px; margin-bottom: 24px;">
                <h4 style="margin-top: 0;"><?php esc_html_e('Connected Account', 'embedpress'); ?></h4>

                <table class="form-table" style="margin-top: 0;">
                    <tr>
                        <th style="width: 200px;"><?php esc_html_e('Username', 'embedpress'); ?></th>
                        <td><strong><?php echo esc_html($account['username'] ?: '—'); ?></strong></td>
                    </tr>
                    <tr>
                        <th><?php esc_html_e('Account type', 'embedpress'); ?></th>
                        <td><?php echo esc_html($account['account_type'] ?: '—'); ?></td>
                    </tr>
                    <tr>
                        <th><?php esc_html_e('Connected since', 'embedpress'); ?></th>
                        <td><?php echo esc_html(!empty($account['connected_at']) ? date_i18n(get_option('date_format'), (int) $account['connected_at']) : '—'); ?></td>
                    </tr>
                    <tr>
                        <th><?php esc_html_e('Token expires', 'embedpress'); ?></th>
                        <td>
                            <?php
                            if (!empty($account['expires_at'])) {
                                $expires = (int) $account['expires_at'];
                                $left = $expires - time();
                                echo esc_html(human_time_diff(time(), $expires) . ($left > 0 ? ' ' . __('from now', 'embedpress') : ' ' . __('ago', 'embedpress')));
                            } else {
                                echo '—';
                            }
                            ?>
                        </td>
                    </tr>
                    <tr>
                        <th><?php esc_html_e('Granted scopes', 'embedpress'); ?></th>
                        <td><code style="font-size: 12px;"><?php echo esc_html($account['granted_scopes'] ?? '—'); ?></code></td>
                    </tr>
                </table>

                <?php if ($refresh_url) : ?>
                    <a href="<?php echo esc_url($refresh_url); ?>" class="button" style="margin-right: 8px;">
                        <?php esc_html_e('Refresh token', 'embedpress'); ?>
                    </a>
                <?php endif; ?>

                <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" style="display: inline-block;" onsubmit="return confirm('<?php echo esc_js(__('Disconnect Pinterest? Pinterest Feed will fall back to RSS for non-authenticated requests.', 'embedpress')); ?>');">
                    <?php wp_nonce_field('ep_pinterest_disconnect', 'ep_pinterest_nonce'); ?>
                    <input type="hidden" name="action" value="ep_pinterest_disconnect" />
                    <button type="submit" class="button button-link-delete"><?php esc_html_e('Disconnect', 'embedpress'); ?></button>
                </form>
            </div>

        <?php else : ?>

            <div style="padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; text-align: center; margin-bottom: 24px;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="56" height="56" style="margin-bottom: 12px;">
                    <path fill="#E60023" d="M12 0a12 12 0 0 0-4.37 23.17c-.1-.94-.2-2.38.04-3.4.22-.92 1.4-5.84 1.4-5.84s-.36-.72-.36-1.78c0-1.67.97-2.92 2.18-2.92 1.02 0 1.52.77 1.52 1.69 0 1.03-.66 2.57-1 4-.28 1.2.6 2.18 1.79 2.18 2.15 0 3.8-2.27 3.8-5.55 0-2.9-2.08-4.93-5.06-4.93-3.45 0-5.47 2.58-5.47 5.25 0 1.04.4 2.15.9 2.76.1.12.11.22.08.34l-.33 1.34c-.05.22-.17.27-.4.16-1.5-.7-2.43-2.88-2.43-4.64 0-3.78 2.74-7.25 7.92-7.25 4.16 0 7.4 2.96 7.4 6.93 0 4.13-2.61 7.46-6.24 7.46-1.22 0-2.36-.63-2.76-1.38l-.75 2.86c-.27 1.04-1 2.35-1.49 3.15A12 12 0 1 0 12 0z"/>
                </svg>
                <h4 style="margin: 0 0 12px;"><?php esc_html_e('Not yet connected', 'embedpress'); ?></h4>
                <p style="color: #6b7280; max-width: 480px; margin: 0 auto 18px;">
                    <?php esc_html_e('Click below to authorize EmbedPress to read your pins and boards. You\'ll land on Pinterest, approve the request, and be sent back here automatically.', 'embedpress'); ?>
                </p>
                <a href="<?php echo esc_url($authorize_url); ?>" class="button button-primary" style="background:#e60023; border-color:#cc0011; color:#fff; padding: 8px 24px; height: auto; font-size: 14px;">
                    <?php esc_html_e('Connect with Pinterest', 'embedpress'); ?>
                </a>
            </div>

            <details style="padding: 14px; background: #f9fafb; border-radius: 8px; font-size: 13px;">
                <summary style="cursor: pointer; font-weight: 600;"><?php esc_html_e('What does connecting unlock?', 'embedpress'); ?></summary>
                <ul style="margin: 10px 0 0 18px; list-style: disc;">
                    <li><?php esc_html_e('Filtering by board, hashtag, or pin type (image/video/story)', 'embedpress'); ?></li>
                    <li><?php esc_html_e('Real follower count + profile metadata on the header card', 'embedpress'); ?></li>
                    <li><?php esc_html_e('Higher rate limits than the RSS fallback', 'embedpress'); ?></li>
                    <li><?php esc_html_e('Board pins look up by name instead of slug', 'embedpress'); ?></li>
                </ul>
            </details>

        <?php endif; ?>
    </div>
</div>
