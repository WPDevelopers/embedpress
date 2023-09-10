<?php
/*
 * It will be customzed for OpenSea
 *  All undefined vars comes from 'render_settings_page' method
 *  */

$authorize_url = 'https://auth.calendly.com/oauth/authorize?client_id=RVIzKSKamm_V88B9Z7yB2fr4JBd7Bqbdi_VQ5rlji2I&response_type=code&redirect_uri=https://api.embedpress.com/calendly.php&state=' . admin_url('admin.php');


$user_info = !empty(get_option('calendly_user_info')) ? get_option('calendly_user_info') : [];
$event_types = !empty(get_option('calendly_event_types')) ? get_option('calendly_event_types') : [];
$scheduled_events = !empty(get_option('calendly_scheduled_events')) ? get_option('calendly_scheduled_events') : [];
$invtitees_list = !empty(get_option('calendly_invitees_list')) ? get_option('calendly_invitees_list') : [];

$avatarUrl = !empty($user_info['resource']['avatar_url']) ? $user_info['resource']['avatar_url'] : ' ';
$name = !empty($user_info['resource']['name']) ? $user_info['resource']['name'] : ' ';
$schedulingUrl = !empty($user_info['resource']['scheduling_url']) ? $user_info['resource']['scheduling_url'] : ' ';

if (!function_exists('getCalendlyUuid')) {
    function getCalendlyUuid($url)
    {
        $pattern = '/\/([0-9a-fA-F-]+)$/';
        if (preg_match($pattern, $url, $matches)) {
            $uuid = $matches[1];
            return $uuid;
        }
        return '';
    }
}


?>

<div class="embedpress_calendly_settings  background__white radius-25 p40">
    <h3 class="calendly-settings-title"><?php esc_html_e("Calendly Settings", "embedpress"); ?></h3>
    <div class="calendly-embedpress-authorize-button">
        <div class="account-wrap full-width-layout">

            <?php if (is_array($scheduled_events) && count($scheduled_events) > 0) : ?>
                <a href="#" class="calendly-connect-button">
                    <img class="embedpress-calendly-icon" src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/calendly-white.svg" alt="calendly">
                    <?php echo esc_html__('Connected', 'embedpress'); ?>
                </a>
            <?php else : ?>
                <a href="<?php echo esc_url($authorize_url); ?>" class="calendly-connect-button" target="_self" title="Connect with Calendly">
                    <img class="embedpress-calendly-icon" src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/calendly-white.svg" alt="calendly">
                    <?php echo esc_html__('Connect with Calendly', 'embedpress'); ?>
                </a>
            <?php endif; ?>
        </div>

        <?php if (is_array($scheduled_events) && count($scheduled_events) > 0) : ?>
            <div class="calendly-sync-button">
                <a href="<?php echo esc_url($authorize_url); ?>" class="calendly-connect-button" target="_self" title="Connect with Calendly">
                    <span class="dashicons dashicons-update-alt emcs-dashicon"></span><?php echo esc_html__('Sync', 'embedpress'); ?>
                </a>
            </div>
        <?php endif; ?>

    </div>

    <div class="event-type-list">
        <div class="event-type-group-list">
            <div class="event-type-group-list-item user-item">

                <div class="list-header">
                    <div class="calendly-profile-avatar">
                        <img src="<?php echo esc_url($avatarUrl); ?>" alt="<?php echo esc_attr($name); ?>" class="il6wqd3">
                    </div>
                    <div class="calendly-user">
                        <div class="KF8rYwhNst0H6JyJ1_kq">
                            <span>
                                <p style="color: currentcolor;"><?php echo esc_html($name); ?></p>
                            </span>
                        </div>
                        <a target="_blank" rel="noopener noreferrer" href="<?php echo esc_url($schedulingUrl); ?>">
                            <span><?php echo esc_html($schedulingUrl); ?></span>
                        </a>
                    </div>
                </div>

                <div>
                    <div class="event-type-card-list">
                        <?php
                        foreach ($event_types['collection'] as $item) {
                            $status = 'In-active';
                            if (!empty($item['active'])) {
                                $status = 'Active';
                            }
                            ?>
                            <div class="event-type-card-list-item" data-event-status="<?php echo esc_attr($status); ?>" style="color: var(--calendly-card-color); ">
                                <div class="event-type-card">
                                    <div class="event-type-card-top">
                                        <h2><?php echo esc_html($item['name']); ?></h2>
                                        <p>30 mins, One-on-One</p>
                                        <a target="_blank" href="<?php echo esc_url($item['scheduling_url']); ?>"><?php echo esc_html__('View booking page', 'embedpress'); ?></a>
                                    </div>
                                    <div class="event-type-card-bottom">
                                        <div class="calendly-event-copy-link">
                                            <svg width="40" height="40" viewBox="0 0 0.75 0.75" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M0.05 0.476a0.076 0.076 0 0 0 0.076 0.074H0.2V0.5H0.126A0.026 0.026 0 0 1 0.1 0.474V0.124A0.026 0.026 0 0 1 0.126 0.098h0.35a0.026 0.026 0 0 1 0.026 0.026V0.2H0.276A0.076 0.076 0 0 0 0.2 0.276v0.35A0.076 0.076 0 0 0 0.276 0.7h0.35A0.076 0.076 0 0 0 0.702 0.624V0.274A0.076 0.076 0 0 0 0.626 0.2H0.55V0.126A0.076 0.076 0 0 0 0.476 0.05H0.126a0.076 0.076 0 0 0 -0.076 0.076v0.35Zm0.2 -0.2A0.026 0.026 0 0 1 0.276 0.25h0.35a0.026 0.026 0 0 1 0.026 0.026v0.35a0.026 0.026 0 0 1 -0.026 0.026H0.276A0.026 0.026 0 0 1 0.25 0.626V0.276Z" fill="#6633cc" /></svg>
                                            Copy link
                                        </div>
                                        <div class="event-status <?php echo esc_attr($status); ?>">
                                            <?php echo esc_html($status); ?>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        <?php
                        }
                        ?>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <div class="calendly-day-list">

        <table class="rwd-table" cellspacing="0">
            <tbody>
                <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Event</th>
                    <th>Scheduled Events</th>
                </tr>
                <?php
                $index = 0;
                $current_datetime = new DateTime(); // Get the current date and time

                $upcoming_events = [];
                $past_events = [];

                if (is_array($scheduled_events) && count($scheduled_events) > 0) {
                    foreach ($scheduled_events['collection'] as $event) {
                        $uuid = getCalendlyUuid($event['uri']);
                        $name = $invtitees_list[$uuid]['collection'][$index]['name'];

                        // Convert event start and end times to DateTime objects
                        $start_time = new DateTime($event['start_time']);
                        $end_time = new DateTime($event['end_time']);

                        // Check if the event is in the past or upcoming
                        $is_past_event = $end_time < $current_datetime;

                        // Categorize events into upcoming and past
                        if ($is_past_event) {
                            $past_events[] = [
                                'event' => $event,
                                'name' => $name,
                            ];
                        } else {
                            $upcoming_events[] = [
                                'event' => $event,
                                'name' => $name,
                            ];
                        }
                    }
                }

                // Sort upcoming events by start time
                usort($upcoming_events, function ($a, $b) {
                    return strtotime($a['event']['start_time']) - strtotime($b['event']['start_time']);
                });

                // Sort past events by start time in descending order
                usort($past_events, function ($a, $b) {
                    return strtotime($b['event']['start_time']) - strtotime($a['event']['start_time']);
                });

                // Merge upcoming and past events for display
                $sorted_events = array_merge($upcoming_events, $past_events);

                
                if (is_array($sorted_events) && count($sorted_events) > 0) :
                    foreach ($sorted_events as $event_data) :
                        $event = $event_data['event'];
                        $name = $event_data['name'];

                        // Convert event start and end times to DateTime objects
                        $start_time = new DateTime($event['start_time']);
                        $end_time = new DateTime($event['end_time']);

                        // Check if the event is in the past or upcoming
                        $is_past_event = $end_time < $current_datetime;
                        ?>

                        <tr>
                            <td class="event-date"><?php echo esc_html(date('l, j F Y', strtotime($event['start_time']))); ?></td>
                            <td class="event-time"><?php echo esc_html(date('h:ia', strtotime($event['start_time'])) . ' - ' . date('h:ia', strtotime($event['end_time']))); ?></td>
                            <td class="event-info">
                                <strong><?php echo esc_html($name); ?></strong><br>
                                Event type: <strong><?php echo esc_html($event['name']); ?></strong>
                            </td>
                            <td class="event-action">
                                <?php echo $is_past_event ? 'Past' : 'Upcoming'; ?>
                            </td>
                        </tr>

                    <?php endforeach; ?>
                <?php endif; ?>

            </tbody>
        </table>


    </div>

</div>