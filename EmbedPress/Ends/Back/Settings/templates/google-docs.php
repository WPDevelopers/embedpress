<?php
define('GOOGLE_CLIENT_ID', '101957997425-edogk95lmlfeorjuaoh4cs7ae06i22bs.apps.googleusercontent.com');
define('GOOGLE_REDIRECT_URI', 'https://api.embedpress.com/google-docs.php');

// Authorization URL

$authorize_url = esc_url('https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query([
    'client_id' => GOOGLE_CLIENT_ID,
    'response_type' => 'code',
    'redirect_uri' => GOOGLE_REDIRECT_URI,
    'state' => admin_url('admin.php'),
    'scope' => 'https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/documents.readonly https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
    'access_type' => 'offline', // Request offline access for a refresh token
    'prompt' => 'consent', // Ensures a refresh token is returned every time
]));


// Retrieve saved user info
$user_info = get_option('google_user_info', []);
$currentTimestamp = time();

// Disconnect URL
$nonce = wp_create_nonce('google_nonce');
$nonce_param = "&_nonce=$nonce";
$google_connect_url = "{$authorize_url}&google_status=connect$nonce_param";

// Save Google user information
if (isset($_GET['access_token'], $_GET['username'], $_GET['user_id'], $_GET['email'], $_GET['picture'])) {
    $access_token = sanitize_text_field($_GET['access_token']);
    $username = sanitize_text_field($_GET['username']);
    $user_id = sanitize_text_field($_GET['user_id']);
    $email = sanitize_email($_GET['email']);
    $picture = esc_url_raw($_GET['picture']);

    // Save user data by user_id
    $user_info[$user_id] = [
        'access_token' => $access_token,
        'name' => $username,
        'email' => $email,
        'avatar_url' => $picture,
        'created_at' => time(),
    ];

    update_option('google_user_info', $user_info);

    // Save access token separately
    update_option('google_tokens', ['access_token' => $access_token, 'created_at' => time()]);
    update_option('is_google_connected', true);

    wp_redirect(admin_url('admin.php?page=embedpress&page_type=google-docs'));
    exit;
}

// Remove Google account by user_id
if (isset($_GET['google_status']) && $_GET['google_status'] === 'disconnect' && isset($_GET['user_id'])) {
    $user_id_to_remove = sanitize_text_field($_GET['user_id']);

    if (isset($user_info[$user_id_to_remove])) {
        unset($user_info[$user_id_to_remove]);
        update_option('google_user_info', $user_info);
    }

    wp_redirect(admin_url('admin.php?page=embedpress&page_type=google-docs'));
    exit;
}
?>

<div class="embedpress_google_settings background__white radius-25 p40">
    <h3 class="google-settings-title"><?php esc_html_e("Google Docs Settings", "embedpress"); ?></h3>

    <!-- Google Connect Button -->
    <div class="google-embedpress-authorize-button">
        <div class="google-connector-container">
            <div class="account-wrap full-width-layout">
                <a href="<?php echo esc_url($google_connect_url); ?>" class="google-connect-button" target="_self" title="Connect with Google">
                    <img class="embedpress-google-icon" src="<?php echo esc_url(EMBEDPRESS_SETTINGS_ASSETS_URL . 'img/google.svg') ?>" alt="google">
                    <?php echo esc_html__('Connect with Google', 'embedpress'); ?>
                </a>
            </div>
        </div>
    </div>

    <!-- Display Connected Google Accounts -->
    <div class="google-user-info">
        <h3><?php esc_html_e("Connected Google Accounts", "embedpress"); ?></h3>

        <?php if (!empty($user_info)) : ?>
            <div class="google-user-cards">
                <?php
                    $border_colors = ['#4285f4', '#34a853', '#fbbc05', '#ea4335'];

                    foreach ($user_info as $user_id => $account) :
                        $random_border_color = $border_colors[array_rand($border_colors)];
                        ?>
                    <div class="google-user-card" style="border-left: 4px solid <?php echo esc_attr($random_border_color); ?>;">
                        <div class="google-user-card-header">
                            <img src="<?php echo esc_url($account['avatar_url']); ?>" alt="User Avatar" class="google-user-avatar" width="50" height="50">
                            <div class="google-user-details">
                                <h4><?php echo esc_html($account['name']); ?></h4>
                                <p><?php echo esc_html($account['email']); ?></p>
                            </div>
                        </div>
                        <a href="<?php echo esc_url(admin_url('admin.php?page=embedpress&page_type=google-docs&google_status=disconnect&user_id=' . $user_id)); ?>" class="button google-disconnect-btn"><?php esc_html_e('Disconnect', 'embedpress'); ?></a>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php else : ?>
            <p><?php esc_html_e('No Google accounts connected yet.', 'embedpress'); ?></p>
        <?php endif; ?>
    </div>
</div>