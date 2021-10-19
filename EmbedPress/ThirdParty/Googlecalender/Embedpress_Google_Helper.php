<?php

require_once 'GoogleClient.php';
if ( !defined( 'EP_GC_NOTICES_VERIFY_SUCCESS') ) {
	define('EP_GC_NOTICES_VERIFY_SUCCESS', __('Verify OK!', 'embedpress'));
	define('EP_GC_NOTICES_REVOKE_SUCCESS', __('Access revoked. This plugin does not have access to your calendars anymore.', 'embedpress'));
	define('EP_GC_NOTICES_REMOVE_SUCCESS', sprintf(__('Plugin data removed. Make sure to also manually revoke access to your calendars in the Google <a target="__blank" href="%s">Permissions</a> page!', 'embedpress'), 'https://myaccount.google.com/permissions'));
	define('EP_GC_NOTICES_CALENDARLIST_UPDATE_SUCCESS', __('Calendars updated.', 'embedpress'));
	define('EP_GC_NOTICES_COLORLIST_UPDATE_SUCCESS', __('Colors updated.', 'embedpress'));
	define('EP_GC_NOTICES_CACHE_DELETED', __('Cache deleted.', 'embedpress'));

	define('EP_GC_ERRORS_CLIENT_SECRET_MISSING', __('No client secret.', 'embedpress'));
	define('EP_GC_ERRORS_CLIENT_SECRET_INVALID', __('Invalid client secret.', 'embedpress'));
	define('EP_GC_ERRORS_ACCESS_TOKEN_MISSING', __('No access token.', 'embedpress'));
	define('EP_GC_ERRORS_REFRESH_TOKEN_MISSING', sprintf(__('Your refresh token is missing!<br><br>This can only be solved by manually revoking this plugin&#39;s access in the Google <a target="__blank" href="%s">Permissions</a> page and remove all plugin data.', 'embedpress'), 'https://myaccount.google.com/permissions'));
	define('EP_GC_ERRORS_ACCESS_REFRESH_TOKEN_MISSING', __('No access and refresh tokens.', 'embedpress'));
	define('EP_GC_ERRORS_REDIRECT_URI_MISSING', __('URI <code>%s</code> missing in the client secret file. Adjust your Google project and upload the new client secret file.', 'embedpress'));
	define('EP_GC_ERRORS_INVALID_FORMAT', __('Invalid format', 'embedpress'));
	define('EP_GC_ERRORS_NO_CALENDARS', __('No calendars', 'embedpress'));
	define('EP_GC_ERRORS_NO_SELECTED_CALENDARS',  __('No selected calendars', 'embedpress'));
	define('EP_GC_ERRORS_TOKEN_AND_API_KEY_MISSING',  __('Access token and API key are missing.', 'embedpress'));
}


class Embedpress_Google_Helper {

	public static function pgc_settings_selected_calendar_ids_json_cb() {
		$calendarList = static::getDecoded( 'pgc_calendarlist' );
		if ( ! empty( $calendarList ) ) {
			$selectedCalendarIds = get_option( 'pgc_selected_calendar_ids' ); // array
			if ( empty( $selectedCalendarIds ) ) {
				$selectedCalendarIds = [];
			}
			?>
			<?php foreach ( $calendarList as $calendar ) { ?>
				<?php
				$calendarId = $calendar['id'];
				$htmlId     = md5( $calendarId );
				?>
                <p class="pgc-calendar-filter">
                    <input id="<?php echo $htmlId; ?>" type="checkbox" name="pgc_selected_calendar_ids[]"
						<?php if ( in_array( $calendarId, $selectedCalendarIds ) ) {
							echo ' checked ';
						} ?>
                           value="<?php echo esc_attr( $calendarId ); ?>"/>
                    <label for="<?php echo $htmlId; ?>">
                        <span class="pgc-calendar-color" style="background-color:<?php echo esc_attr( $calendar['backgroundColor'] ); ?>"></span>
						<?php echo esc_html( $calendar['summary'] ); ?><?php if ( ! empty( $calendar['primary'] ) ) {
							echo ' (primary)';
						} ?>
                    </label>
                    <br>ID: <?php echo esc_html( $calendarId ); ?>
                </p>
			<?php } ?>
            </ul>
			<?php
			$refreshToken = get_option( "pgc_refresh_token" );
			if ( empty( $refreshToken ) ) {
				static::pgc_show_notice( EP_GC_ERRORS_REFRESH_TOKEN_MISSING, 'error', false );
			}
		} else {
			?>
            <p><?php _e( 'No calendars found.', 'embedpress' ); ?></p>
			<?php
		}
	}

	/**
	 * Helper function to return array from option (that should be a JSON string).
	 * @return array or $default = null
	 */
	public static function getDecoded($optionName, $default = null) {
		$item = get_option($optionName);
		// $item should be a JSON string.
		if (!empty($item)) {
			return json_decode($item, true);
		}
		return $default;
	}


	public static function pgc_show_notice($notice, $type, $dismissable) {
		?>
        <div class="notice notice-<?php echo esc_attr($type);  echo $dismissable ? ' is-dismissible' : ''; ?>">
            <p><?php echo $notice; ?></p>
        </div>
		<?php
	}

	public static function pgc_ajax_get_calendar() {

		check_ajax_referer('pgc_nonce');

		try {

			if (empty($_POST['start']) || empty($_POST['end'])) {
				throw new Exception(PGC_ERRORS_INVALID_FORMAT);
			}

			// Start and end are in ISO8601 string format with timezone offset (e.g. 2018-09-01T12:30:00-05:00)
			$start = $_POST['start'];
			$end = $_POST['end'];

			$thisCalendarids = [];
			$postedCalendarIds = [];
			if (array_key_exists('thisCalendarids', $_POST) && !empty($_POST['thisCalendarids'])) {
				$postedCalendarIds = array_map('trim', explode(',', $_POST['thisCalendarids']));
			}
			$privateSettingsCalendarListIds = array_map(function($item) {
				return $item['id'];
			}, static::getDecoded('pgc_calendarlist', []));
			if (!empty($privateSettingsCalendarListIds)) {
				$privateSettingsSelectedCalendarListIds = get_option('pgc_selected_calendar_ids');
				// if (empty($postedCalendarIds)) {
				//   // If we have private selected calendars in settings and we get NO selected calendars from widget, shortcode, Gutenberg block, this means
				//   // ALL private calendars will be used.
				//   $postedCalendarIds = $privateSettingsSelectedCalendarListIds;
				// }
				foreach ($postedCalendarIds as $calId) {
					if (!in_array($calId, $privateSettingsCalendarListIds) || in_array($calId, $privateSettingsSelectedCalendarListIds)) {
						$thisCalendarids[] = $calId;
					}
				}
			} else {
				$thisCalendarids = $postedCalendarIds;
			}

			$cacheTime = get_option('pgc_cache_time'); // empty == no cache!

			// We can have mutiple calendars with different calendar selections,
			// so key should be including calendar selection.
			$transientKey = PGC_TRANSIENT_PREFIX . $start . $end . md5(implode('-', $thisCalendarids));

			$transientItems = !empty($cacheTime) ? get_transient($transientKey) : false;

			$calendarListByKey = pgc_get_calendars_by_key($thisCalendarids);

			if ($transientItems !== false) {
				wp_send_json(['items' => $transientItems, 'calendars' => $calendarListByKey]);
				wp_die();
			}

			$colorList = false; // false means not queried yet / otherwise [] or filled []

			$results = [];

			$optParams = array(
				'maxResults' => PGC_EVENTS_MAX_RESULTS,
				'orderBy' => 'startTime',
				'singleEvents' => 'true',
				'timeMin' => $start,
				'timeMax' => $end,
			);
			if (!empty($_POST['timeZone'])) {
				$optParams['timeZone'] = $_POST['timeZone'];
			}

			$hasAccessToken = get_option('pgc_access_token');

			if (!empty($hasAccessToken)) {

				$client = getGoogleClient(true);
				if ($client->isAccessTokenExpired()) {
					if (!$client->getRefreshTOken()) {
						throw new Exception(PGC_ERRORS_REFRESH_TOKEN_MISSING);
					}
					$client->refreshAccessToken();
				}
				$service = new EmbedPress_GoogleCalendarClient($client);

				foreach ($thisCalendarids as $calendarId) {
					$results[$calendarId] = $service->getEvents($calendarId, $optParams);
				}

			} elseif (!empty(get_option('pgc_api_key'))) {

				$referer = !empty($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : null;
				$apiKey = get_option('pgc_api_key');
				$service = new EmbedPress_GoogleCalendarClient(null);
				foreach ($thisCalendarids as $calendarId) {
					$results[$calendarId] = $service->getEventsPublic($calendarId, $optParams, $apiKey, $referer);
				}

			} else {
				// No API key and no OAuth2 token
				throw new Exception(PGC_ERRORS_TOKEN_AND_API_KEY_MISSING);
			}

			$items = [];
			foreach ($results as $calendarId => $events) {
				foreach ($events as $item) {
					$newItem = [
						'title' => empty($item['summary']) ? PGC_EVENTS_DEFAULT_TITLE : $item['summary'],
						'htmlLink' => $item['htmlLink'],
						'description' => !empty($item['description']) ? $item['description'] : '',
						'calId' => $calendarId,
						'creator' => !empty($item['creator']) ? $item['creator'] : [],
						'attendees' => !empty($item['attendees']) ? $item['attendees'] : [],
						'attachments' => !empty($item['attachments']) ? $item['attachments'] : [],
						'location' => !empty($item['location']) ? $item['location'] : ''
					];
					if (!empty($item['start']['date'])) {
						$newItem['allDay'] = true;
						$newItem['start'] = $item['start']['date'];
						$newItem['end'] = $item['end']['date'];
						// $newItem['timeZone'] = $item['start']['timeZone']; // TODO? end timezone also exists...
					} else {
						$newItem['start'] = $item['start']['dateTime'];
						$newItem['end'] = $item['end']['dateTime'];
						// $newItem['timeZone'] = $item['start']['timeZone']; // TODO? end timezone also exists...
					}
					if (!empty($item['colorId'])) {
						if ($colorList === false) {
							$colorList = static::getDecoded('pgc_colorlist', []);
						}
						if (array_key_exists('event', $colorList) && array_key_exists($item['colorId'], $colorList['event'])) {
							$newItem['bColor'] = $colorList['event'][$item['colorId']]['background'];
							$newItem['fColor'] = $colorList['event'][$item['colorId']]['foreground'];
						}
					}

					$items[] = $newItem;
				}
			}

			if (!empty($cacheTime)) {
				set_transient($transientKey, $items, $cacheTime * MINUTE_IN_SECONDS);
			}

			wp_send_json(['items' => $items, 'calendars' => $calendarListByKey]);
			wp_die();
		} catch (EmbedPress_GoogleClient_RequestException $ex) {
			wp_send_json([
				'error' => $ex->getMessage(),
				'errorCode' => $ex->getCode(),
				'errorDescription' => $ex->getDescription()]);
			wp_die();
		} catch (Exception $ex) {
			wp_send_json([
				'error' => $ex->getMessage(),
				'errorCode' => $ex->getCode()]);
			wp_die();
		}
	}

	public static function pgc_get_calendars_by_key($calendarIds) {

		$publicCalendarList = get_option('pgc_public_calendarlist');
		if (empty($publicCalendarList)) {
			$publicCalendarList = [];
		}
		$privateCalendarList = static::getDecoded('pgc_calendarlist', []);
		if (empty($privateCalendarList)) {
			$privateCalendarList = [];
		}
		$calendarList = $publicCalendarList + $privateCalendarList;
		$keyedCalendarList = [];
		foreach ($calendarList as $cal) {
			$keyedCalendarList[$cal['id']] = $cal;
		}

		$calendarListByKey = [];
		foreach ($calendarIds as $calId) {
			$cal = array_key_exists($calId, $keyedCalendarList) ? $keyedCalendarList[$calId] : [
				'summary' => $calId,
				'backgroundColor' => 'rgb(121, 134, 203)'
			];
			$calendarListByKey[$calId] = [
				'summary' => $cal['summary'],
				'backgroundColor' => $cal['backgroundColor']
			];
		}

		return $calendarListByKey;
	}

	/**
	 * Get a valid formatted client secret.
	 * @return array|false Secret Array, false if no exists, Exception for invalid one
	 **/
	public static function pgc_get_valid_client_secret(&$error = '') {
		$clientSecret = get_option('pgc_client_secret');
		if (empty($clientSecret)) {
			return false;
		}
		$clientSecret = static::getDecoded('pgc_client_secret');
		if (empty($clientSecret)
		    || empty($clientSecret['web'])
		    || empty($clientSecret['web']['client_secret'])
		    || empty($clientSecret['web']['client_id']))
		{
			$error = PGC_ERRORS_CLIENT_SECRET_INVALID;
		} elseif (!pgc_check_redirect_uri($clientSecret))
		{
			$error = sprintf(PGC_ERRORS_REDIRECT_URI_MISSING, admin_url('options-general.php?page=pgc'));
		}
		return $clientSecret;
	}

}
/**
 * Add 'pgcnotice' to the removable_query_args filter, so we can set this and
 * WP will remove it for us. We use this for our custom admin notices. This way
 * you can add parameters to the URL and check for them, but we won't see them
 * in the URL.
 */
add_filter('removable_query_args', 'ep_gc_removable_query_args');
function ep_gc_removable_query_args($removable_query_args) {
	$removable_query_args[] = 'pgcnotice';
	return $removable_query_args;
}

/**
 * Check for 'pgcnotice' parameter and show admin notice if we have a option.
 */
add_action('admin_init', 'ep_gc_notices_init');
function ep_gc_notices_init() {
	if (!empty($_GET['pgcnotice'])) {
		$pgcnotices = get_option('pgc_notices_' . get_current_user_id());
		if (empty($pgcnotices)) {
			return;
		}
		delete_option('pgc_notices_' . get_current_user_id());
		add_action('admin_notices', function() use ($pgcnotices) {
			foreach ($pgcnotices as $notice) {
				?>
                <div class="notice notice-<?php echo esc_attr($notice['type']); ?> is-dismissible">
                    <p><?php echo $notice['content']; ?></p>
                </div>
				<?php
			}
		});
	}
}

/**
 * Helper function to add notice messages.
 * @param bool $redirect Redirect if true.
 */
function ep_gc_add_notice($content, $type = 'success', $redirect = false) {
	$pgcnotices = get_option('pgc_notices_' . get_current_user_id());
	if (empty($pgcnotices)) {
		$pgcnotices = [];
	}
	$pgcnotices[] = [
		'content' => $content,
		'type' => $type
	];
	update_option('pgc_notices_' . get_current_user_id(), $pgcnotices, false);
	if ($redirect) {
		wp_redirect(admin_url("options-general.php?page=pgc&pgcnotice=true"));
	}
}

/**
 * Helper function to show a notice. WP will move this message to the correct place.
 */
function ep_gc_show_notice($notice, $type, $dismissable) {
	?>
    <div class="notice notice-<?php echo esc_attr($type); ?> <?php echo $dismissable ? 'is-dismissible' : ''; ?>">
        <p><?php echo $notice; ?></p>
    </div>
	<?php
}
