<?php
/*
 * It will be customzed for OpenSea
 *  All undefined vars comes from 'render_settings_page' method
 *  */

$token_url = 'https://auth.calendly.com/oauth/authorize?client_id=RVIzKSKamm_V88B9Z7yB2fr4JBd7Bqbdi_VQ5rlji2I&response_type=code&redirect_uri=https://api.embedpress.com/calendly.php&state=' . admin_url('admin.php');



$personal_data = !empty(get_option('instagram_account_data')) ? get_option('instagram_account_data') : [];

$business_data = !empty(get_option('instagram_account_data')) ? get_option('instagram_account_data') : [];;

$get_data = $personal_data;

$is_connected = false;


// Set your personal access token or OAuth token
// $token = 'C8rDNTxxz7DznsinB2-QE1lpStLAbeyyDV4sqEwUVuk';

// // Set the base URL for the Calendly API
// $base_url = 'https://calendly.com/api/v1/';

// // Set the endpoint for retrieving upcoming events
// $endpoint = 'scheduled_events';

// // Set the headers for the API request
// $headers = [
//     'X-TOKEN: ' . $token,
//     'Content-Type: application/json'
// ];

// // Initialize a cURL session
// $ch = curl_init();

// // Set the cURL options
// curl_setopt($ch, CURLOPT_URL, $base_url . $endpoint);
// curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
// curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// // Execute the cURL request and get the response
// $response = curl_exec($ch);

// // Close the cURL session
// curl_close($ch);

// // Decode the JSON response
// $data = json_decode($response, true);

// print_r($data);

// // Check if there are any upcoming events
// if (isset($data['collection']) && !empty($data['collection'])) {
//     // Loop through each upcoming event
//     foreach ($data['collection'] as $event) {
//         // Get the event details
//         $event_name = $event['event']['name'];
//         $event_start_time = $event['start_time'];
//         $event_end_time = $event['end_time'];

//         // Display the event details
//         echo "Event: " . $event_name . "\n";
//         echo "Start Time: " . $event_start_time . "\n";
//         echo "End Time: " . $event_end_time . "\n\n";
//     }
// } else {
//     // No upcoming events found
//     echo "No upcoming events found.\n";
// }

$url = 'https://api.calendly.com/scheduled_events';
    
    $headers = array(
        'Authorization' => 'eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNjkzMjk5Mjg0LCJqdGkiOiIzM2I2Y2NkYy1mYzk3LTQ3NTItYmNmZi1kMGNhYzU2NmVkYzQiLCJ1c2VyX3V1aWQiOiIzMmI2NjJhZC01MzZjLTRiMjUtODU4ZS00ZmE3YTg2OWU0MjUifQ.TZjVItz4PySnUTQG9m6H0AkQwbCKJjSVefnkfQzHlTKCDlBRJW7iJVM9BhOwhmEMRQjlIf5Nc-5sqZYLe9_43g',
        'Content-Type' => 'application/json',
    );
    
    $args = array(
        'headers' => $headers,
    );
    
    $response = wp_remote_get($url, $args);
    
    if (is_wp_error($response)) {
        return false;
    }
    
    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);

    print_r($data);



?>

<div class="embedpress__settings background__white radius-25 p40">
    <h3><?php esc_html_e("Instagram Settings", "embedpress"); ?></h3>
    <div class="embedpress__settings__form">
        <div class="account-section">
            <div class="account-wrap full-width-layout">
                <p>
                    <a href="<?php echo esc_url($token_url); ?>" class="account-button personal-account" target="_self" title="Connect with Calendly">
                    <img class="embedpress-calendly-icon" src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/calendly.svg" alt="calendly">
                    <?php echo esc_html__( 'Connect with Calendly', 'embedpress' ); ?>
                </a>
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