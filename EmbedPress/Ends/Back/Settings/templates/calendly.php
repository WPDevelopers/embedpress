<?php
/*
 * It will be customzed for OpenSea
 *  All undefined vars comes from 'render_settings_page' method
 *  */

$authorize_url = 'https://auth.calendly.com/oauth/authorize?client_id=RVIzKSKamm_V88B9Z7yB2fr4JBd7Bqbdi_VQ5rlji2I&response_type=code&redirect_uri=https://api.embedpress.com/calendly.php&state=' . admin_url('admin.php');

function getCalendlyUserInfo($access_token)
{
    // Attempt to retrieve the data from the transient
    $user_info = get_transient('calendly_user_info_' . md5($access_token));

    if (false === $user_info) {
        // If the data is not in the transient, fetch it from the API
        $user_endpoint = 'https://api.calendly.com/users/me';

        $headers = array(
            'Authorization' => "Bearer $access_token",
            'Content-Type' => 'application/json',
        );

        $args = array(
            'headers' => $headers,
        );

        $response = wp_remote_get($user_endpoint, $args);

        if (!is_wp_error($response)) {
            $body = wp_remote_retrieve_body($response);
            $data = json_decode($body, true);

            // Store the data in a transient for a specified time (e.g., 1 hour)
            set_transient('calendly_user_info', $data, HOUR_IN_SECONDS);

            return $data;
        }
    }

    return $user_info;
}

function getCalaendlyEventTypes($user_uri, $access_token)
{
    // Attempt to retrieve the data from the transient
    $events_list = get_transient('calendly_events_list_' . md5($access_token));

    if (false === $events_list) {
        // If the data is not in the transient, fetch it from the API
        $events_endpoint = "https://api.calendly.com/event_types?user=$user_uri";

        $headers = array(
            'Authorization' => "Bearer $access_token",
            'Content-Type' => 'application/json',
        );

        $args = array(
            'headers' => $headers,
        );

        $response = wp_remote_get($events_endpoint, $args);

        if (!is_wp_error($response)) {
            $body = wp_remote_retrieve_body($response);
            $events_list = json_decode($body, true);

            // Store the data in a transient for a specified time (e.g., 1 hour)
            set_transient('calendly_events_list', $events_list, HOUR_IN_SECONDS);

            return $events_list;
        }
    }

    return $events_list;
}

function getCalaendlyScheduledEvents($user_uri, $access_token)
{
    // Attempt to retrieve the data from the transient
    $events_list = get_transient('calendly_events_list_' . md5($access_token));

    if (false === $events_list) {
        // If the data is not in the transient, fetch it from the API
        $events_endpoint = "https://api.calendly.com/scheduled_events?user=$user_uri";

        $headers = array(
            'Authorization' => "Bearer $access_token",
            'Content-Type' => 'application/json',
        );

        $args = array(
            'headers' => $headers,
        );

        $response = wp_remote_get($events_endpoint, $args);

        if (!is_wp_error($response)) {
            $body = wp_remote_retrieve_body($response);
            $events_list = json_decode($body, true);

            // Store the data in a transient for a specified time (e.g., 1 hour)
            set_transient('calendly_events_list', $events_list, HOUR_IN_SECONDS);

            return $events_list;
        }
    }

    return $events_list;
}



if (!empty($_GET['access_token'])) {

    $access_tokaen = $_GET['access_token'];

    $user_uri = getCalendlyUserInfo($access_tokaen);

    echo '<pre>';
    print_r($user_uri);
    echo '</pre>';

    $events_list = getCalaendlyEventTypes($user_uri['resource']['uri'], $access_tokaen);

    // echo '<pre>'; print_r($events_list); echo '</pre>';
}


?>

<div class="embedpress_calendly_settings background__white radius-25 p40">
    <h3><?php esc_html_e("Calendly Settings", "embedpress"); ?></h3>
    <div class="embedpress-settings-form">
        <div class="account-section">
            <div class="account-wrap full-width-layout">
                <p>
                    <a href="<?php echo esc_url($authorize_url); ?>" class="calendly-connect-button" target="_self" title="Connect with Calendly">
                        <img class="embedpress-calendly-icon" src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/calendly-white.svg" alt="calendly">
                        <?php echo esc_html__('Connect with Calendly', 'embedpress'); ?>
                    </a>
                </p>
            </div>
        </div>

    </div>

    <div class="event-type-list">
        <div class="event-type-group-list">
            <div class="event-type-group-list-item user-item">
                <div class="list-header">
                    <div>
                        <div>
                            <div data-testid="profile-avatar" aria-hidden="true" class="s1mm25r5">
                                <img src="https://d3v0px0pttie1i.cloudfront.net/uploads/user/avatar/29243744/4b76aa68.jpg" alt="" class="il6wqd3">
                            </div>
                        </div>
                        <div class="user">
                            <div class="KF8rYwhNst0H6JyJ1_kq">
                                <span class="_UeGX8dh81nHkmsXSvAD">
                                    <p style="color: currentcolor;">Akash M</p>
                                </span>
                            </div>
                            <a target="_blank" rel="noopener noreferrer" href="https://calendly.com/akash-mia">
                                <span class="_UeGX8dh81nHkmsXSvAD">https://calendly.com/akash-mia</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="event-type-card-list grid-3 ui-sortable">
                        <div class="grid-3-cell">
                            <div class="event-type-card" data-id="158685224" data-testid="event-type-card-158685224">
                                <button aria-label="Test Event" type="button"></button>
                                <div data-id="event-type-card-cap" style="background-color: rgb(130, 71, 245);"></div>
                                <div class="event-type-card-control-container is-left">
                                    <label aria-label="make changes in bulk">
                                        <div class="b1hdxvdx MhcC23kVmc1ZIa9ssg7t dSDpEZT9bE_o5YbFR5WR">
                                            <input type="checkbox" name="selection" class="bd863z hi4b2p7">
                                            <div class="bjyfins bgyxrme"></div>
                                        </div>
                                    </label>
                                </div>
                                <div data-id="event-type-card-body">
                                    <h2 class="b1hdxvdx tasr2tg tzdibsp t1gpgsti">Test Event</h2>
                                    <p style="color: var(--text-color-level2, rgba(26, 26, 26, 0.61));">30 mins, One-on-One</p>
                                    <a title="View booking page" target="_blank" rel="noopener noreferrer" href="https://calendly.com/akash-mia/test-event">View booking page</a>
                                </div>
                                <div class="event-type-card-foot">
                                    <div class="event-type-card-foot-col1">
                                        <button aria-label="Copy link (Test Event, One-on-One)" aria-disabled="false" type="button">
                                            <div class="t10keekh t1h9gy3z">
                                                <span class="b1hdxvdx b1wd19y1 s1p6ipfe" aria-hidden="true">
                                                    <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" role="img">
                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 5C0 4.44772 0.447715 4 1 4H15C15.5523 4 16 4.44772 16 5V19C16 19.5523 15.5523 20 15 20H1C0.447715 20 0 19.5523 0 19V5ZM2 6V18H14V6H2Z" fill="currentColor"></path>
                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M4.1543 1C4.1543 0.447715 4.60201 0 5.1543 0H17.6163C18.2486 0 18.855 0.251171 19.302 0.698257C19.7491 1.14534 20.0003 1.75172 20.0003 2.384V14.846C20.0003 15.3983 19.5526 15.846 19.0003 15.846C18.448 15.846 18.0003 15.3983 18.0003 14.846V2.384C18.0003 2.28216 17.9598 2.18449 17.8878 2.11247C17.8158 2.04046 17.7181 2 17.6163 2H5.1543C4.60201 2 4.1543 1.55228 4.1543 1Z" fill="currentColor"></path>
                                                    </svg>
                                                </span>
                                                Copy link
                                            </div>
                                        </button>
                                    </div>
                                    <div>
                                        <button aria-label="Share (Test Event, One-on-One)" aria-disabled="false" type="button">
                                            <div class="t10keekh t1h9gy3z">Share</div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="grid-3-cell">
                            <div class="event-type-card" data-id="158685224" data-testid="event-type-card-158685224">
                                <button aria-label="Test Event" type="button"></button>
                                <div data-id="event-type-card-cap" style="background-color: rgb(130, 71, 245);"></div>
                                <div class="event-type-card-control-container is-left">
                                    <label aria-label="make changes in bulk">
                                        <div class="b1hdxvdx MhcC23kVmc1ZIa9ssg7t dSDpEZT9bE_o5YbFR5WR">
                                            <input type="checkbox" name="selection" class="bd863z hi4b2p7">
                                            <div class="bjyfins bgyxrme"></div>
                                        </div>
                                    </label>
                                </div>
                                <div data-id="event-type-card-body">
                                    <h2 class="b1hdxvdx tasr2tg tzdibsp t1gpgsti">Test Event</h2>
                                    <p style="color: var(--text-color-level2, rgba(26, 26, 26, 0.61));">30 mins, One-on-One</p>
                                    <a title="View booking page" target="_blank" rel="noopener noreferrer" href="https://calendly.com/akash-mia/test-event">View booking page</a>
                                </div>
                                <div class="event-type-card-foot">
                                    <div class="event-type-card-foot-col1">
                                        <button aria-label="Copy link (Test Event, One-on-One)" aria-disabled="false" type="button">
                                            <div class="t10keekh t1h9gy3z">
                                                <span class="b1hdxvdx b1wd19y1 s1p6ipfe" aria-hidden="true">
                                                    <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" role="img">
                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 5C0 4.44772 0.447715 4 1 4H15C15.5523 4 16 4.44772 16 5V19C16 19.5523 15.5523 20 15 20H1C0.447715 20 0 19.5523 0 19V5ZM2 6V18H14V6H2Z" fill="currentColor"></path>
                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M4.1543 1C4.1543 0.447715 4.60201 0 5.1543 0H17.6163C18.2486 0 18.855 0.251171 19.302 0.698257C19.7491 1.14534 20.0003 1.75172 20.0003 2.384V14.846C20.0003 15.3983 19.5526 15.846 19.0003 15.846C18.448 15.846 18.0003 15.3983 18.0003 14.846V2.384C18.0003 2.28216 17.9598 2.18449 17.8878 2.11247C17.8158 2.04046 17.7181 2 17.6163 2H5.1543C4.60201 2 4.1543 1.55228 4.1543 1Z" fill="currentColor"></path>
                                                    </svg>
                                                </span>
                                                Copy link
                                            </div>
                                        </button>
                                    </div>
                                    <div>
                                        <button aria-label="Share (Test Event, One-on-One)" aria-disabled="false" type="button">
                                            <div class="t10keekh t1h9gy3z">Share</div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</div>