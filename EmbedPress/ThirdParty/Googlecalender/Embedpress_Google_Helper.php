<?php

require_once 'GoogleClient.php';
if ( !defined( 'EPGC_NOTICES_VERIFY_SUCCESS') ) {
	define('EPGC_NOTICES_VERIFY_SUCCESS', __('Verify OK!', 'embedpress'));
	define('EPGC_NOTICES_REVOKE_SUCCESS', __('Access revoked. This plugin does not have access to your calendars anymore.', 'embedpress'));
	define('EPGC_NOTICES_REMOVE_SUCCESS', sprintf(__('Plugin data removed. Make sure to also manually revoke access to your calendars in the Google <a target="__blank" href="%s">Permissions</a> page!', 'embedpress'), 'https://myaccount.google.com/permissions'));
	define('EPGC_NOTICES_CALENDARLIST_UPDATE_SUCCESS', __('Calendars updated.', 'embedpress'));
	define('EPGC_NOTICES_COLORLIST_UPDATE_SUCCESS', __('Colors updated.', 'embedpress'));
	define('EPGC_NOTICES_CACHE_DELETED', __('Cache deleted.', 'embedpress'));

	define('EPGC_ERRORS_CLIENT_SECRET_MISSING', __('No client secret.', 'embedpress'));
	define('EPGC_ERRORS_CLIENT_SECRET_INVALID', __('Invalid client secret.', 'embedpress'));
	define('EPGC_ERRORS_ACCESS_TOKEN_MISSING', __('No access token.', 'embedpress'));
	define('EPGC_ERRORS_REFRESH_TOKEN_MISSING', sprintf(__('Your refresh token is missing!<br><br>This can only be solved by manually revoking this plugin&#39;s access in the Google <a target="__blank" href="%s">Permissions</a> page and remove all plugin data.', 'embedpress'), 'https://myaccount.google.com/permissions'));
	define('EPGC_ERRORS_ACCESS_REFRESH_TOKEN_MISSING', __('No access and refresh tokens.', 'embedpress'));
	define('EPGC_ERRORS_REDIRECT_URI_MISSING', __('URI <code>%s</code> missing in the client secret file. Adjust your Google project and upload the new client secret file.', 'embedpress'));
	define('EPGC_ERRORS_INVALID_FORMAT', __('Invalid format', 'embedpress'));
	define('EPGC_ERRORS_NO_CALENDARS', __('No calendars', 'embedpress'));
	define('EPGC_ERRORS_NO_SELECTED_CALENDARS',  __('No selected calendars', 'embedpress'));
	define('EPGC_ERRORS_TOKEN_AND_API_KEY_MISSING',  __('Access token and API key are missing.', 'embedpress'));
	define('PGC_TRANSIENT_PREFIX', 'pgc_ev_');
	define('EPGC_ENQUEUE_ACTION_PRIORITY', 11);
}
if (!defined('EPGC_EVENTS_MAX_RESULTS')) {
	define('EPGC_EVENTS_MAX_RESULTS', 250);
}

if (!defined('EPGC_EVENTS_DEFAULT_TITLE')) {
	define('EPGC_EVENTS_DEFAULT_TITLE', '');
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
            <ul>
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
				static::show_notice( EPGC_ERRORS_REFRESH_TOKEN_MISSING, 'error', false );
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


	public static function show_notice($notice, $type, $dismissable) {
		?>
        <div class="notice notice-<?php echo esc_attr($type);  echo $dismissable ? ' is-dismissible' : ''; ?>">
            <p><?php echo $notice; ?></p>
        </div>
		<?php
	}

	public static function ajax_get_calendar() {

		check_ajax_referer('epgc_nonce');

		try {

			if (empty($_POST['start']) || empty($_POST['end'])) {
				throw new Exception(EPGC_ERRORS_INVALID_FORMAT);
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

			$cacheTime = get_option('epgc_cache_time'); // empty == no cache!

			// We can have mutiple calendars with different calendar selections,
			// so key should be including calendar selection.
			$transientKey = EPGC_TRANSIENT_PREFIX . $start . $end . md5(implode('-', $thisCalendarids));

			$transientItems = !empty($cacheTime) ? get_transient($transientKey) : false;

			$calendarListByKey = static::get_calendars_by_key($thisCalendarids);

			if ($transientItems !== false) {
				wp_send_json(['items' => $transientItems, 'calendars' => $calendarListByKey]);
				wp_die();
			}

			$colorList = false; // false means not queried yet / otherwise [] or filled []

			$results = [];

			$optParams = array(
				'maxResults' => EPGC_EVENTS_MAX_RESULTS,
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
						throw new Exception(EPGC_ERRORS_REFRESH_TOKEN_MISSING);
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
				throw new Exception(EPGC_ERRORS_TOKEN_AND_API_KEY_MISSING);
			}

			$items = [];
			foreach ($results as $calendarId => $events) {
				foreach ($events as $item) {
					$newItem = [
						'title' => empty($item['summary']) ? EPGC_EVENTS_DEFAULT_TITLE : $item['summary'],
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

	public static function get_calendars_by_key($calendarIds) {

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
	public static function get_valid_client_secret(&$error = '') {
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
			$error = EPGC_ERRORS_CLIENT_SECRET_INVALID;
		} elseif (!pgc_check_redirect_uri($clientSecret))
		{
			$error = sprintf(EPGC_ERRORS_REDIRECT_URI_MISSING, admin_url('options-general.php?page=pgc'));
		}
		return $clientSecret;
	}

    public static function delete_calendar_cache() {
	    global $wpdb;
	    $wpdb->query("DELETE FROM " . $wpdb->options
	                 . " WHERE option_name LIKE '_transient_timeout_" . EPGC_TRANSIENT_PREFIX . "%' OR option_name LIKE '_transient_" . EPGC_TRANSIENT_PREFIX . "%'");
    }

	/**
	 * Helper function to delete all plugin options.
	 */
	public static function delete_options($which) { // which = all, public, private
		if ($which === 'all' || $which === 'private') {
			delete_option('epgc_access_token');
			delete_option('epgc_refresh_token');
			delete_option('epgc_selected_calendar_ids');
			delete_option('epgc_calendarlist');
			delete_option('epgc_client_secret');
		}
		if ($which === 'all' || $which === 'public') {
			delete_option('pgc_api_key');
		}
		if ($which === 'all') {
			delete_option('epgc_cache_time');
		}
	}

	public static function uninstall() {
		try {
			$client = getGoogleClient();
			$accessToken = getDecoded('epgc_access_token');
			if (!empty($accessToken)) {
				$client->setAccessTokenInfo($accessToken);
			}
			$refreshToken = get_option("epgc_refresh_token");
			if (!empty($refreshToken)) {
				$client->setRefreshToken($refreshToken);
			}
			if (empty($accessToken) && empty($refreshToken)) {
				throw new Exception(EPGC_ERRORS_ACCESS_REFRESH_TOKEN_MISSING);
			}
			$client->revoke();
		} catch (Exception $ex) {
			// Too bad...
		} finally {
			// Clear all plugin data
			static::delete_plugin_data();
		}
	}

	/**
	 * Helper function to delete all plugin data.
	 */
	public static function delete_plugin_data($which = 'all') {
		self::delete_calendar_cache();
		self::delete_options($which);
	}
	public static function removable_query_args($removable_query_args) {
		$removable_query_args[] = 'pgcnotice';
		return $removable_query_args;
	}

	public static function notices_init() {
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
	public static function add_notice($content, $type = 'success', $redirect = false) {
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

	public static function admin_post_calendarlist() {
		try {
			$client = getGoogleClient(true);
			if ($client->isAccessTokenExpired()) {
				if (!$client->getRefreshToken()) {
					throw new Exception(EPGC_ERRORS_REFRESH_TOKEN_MISSING);
				}
				$client->refreshAccessToken();
			}
			$service = new Embedpress_GoogleCalendarClient($client);
			$items = $service->getCalendarList();

			self::sort_calendars($items);

			update_option('epgc_calendarlist', self::getPrettyJSONString($items), false);
			self::add_notice(PGC_NOTICES_CALENDARLIST_UPDATE_SUCCESS, 'success', true);
			exit;
		} catch (Exception $ex) {
			self::die($ex);
		}
	}

	/**
	 * Helper function die die with different kind of errors.
	 */
	public static function die($error = null) {
		$backLink = '<br><br><a href="' . admin_url('admin.php?page=embedpress&page_type=google-calendar') . '">' . __('Back', 'embedpress') . '</a>';
		if (empty($error)) {
			wp_die(__('Unknown error', 'embedpress') . $backLink);
		}
		if ($error instanceof Exception) {
			$s = [];
			if ($error->getCode()) {
				$x[] = $error->getCode();
			}
			$s[] = $error->getMessage();
			if ($error instanceof Embedpress_GoogleClient_RequestException) {
				if ($error->getDescription()) {
					$s[] = $error->getDescription();
				}
			}
			wp_die(implode("<br>", $s) . $backLink);
		} elseif (is_array($error)) {
			wp_die(implode("<br>", $error) . $backLink);
		} elseif (is_string($error)) {
			wp_die($error . $backLink);
		} else {
			wp_die(__('Unknown error format', 'embedpress') . $backLink);
		}
	}

	/**
	 * Helper function to return pretty printed JSON string.
	 * @return string
	 */
	public static function getPrettyJSONString($jsonObject) {
		return str_replace("    ", "  ", json_encode($jsonObject, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
	}

    public static function sort_calendars(&$items) {
	    // Set locale to UTF-8 variant if this is not the case.
	    if (strpos(setlocale(LC_COLLATE, 0), '.UTF-8') === false) {
		    // If we set this to a non existing locale it will be the default locale after this call.
		    setlocale(LC_COLLATE, get_locale() . '.UTF-8');
	    }
	    usort($items, function($a, $b) {
		    return strcoll($a['summary'], $b['summary']);
	    });
    }
	function shortcode($atts = [], $content = null, $tag) {

		// When we have no attributes, $atts is an empty string
		if (!is_array($atts)) {
			$atts = [];
		}

		$defaultConfig = [
			'header' => [
				'left' => 'prev,next today',
				'center' => 'title',
				'right' => 'dayGridMonth,timeGridWeek,listWeek'
			]
		];
		$userConfig = $defaultConfig; // copy
		$userFilter = 'top';
		$userEventPopup = 'true';
		$userEventLink = 'false';
		$userHidePassed = 'false';
		$userHideFuture = 'false';
		$userEventDescription = 'false';
		$userEventLocation = 'false';
		$userEventAttendees = 'false';
		$userEventAttachments = 'false';
		$userEventCreator = 'false';
		$userEventCalendarname = 'false';
		$calendarIds = '';
		$uncheckedCalendarIds = ''; // in filter
		// Get all non-fullcalendar known properties
		foreach ($atts as $key => $value) {
			if ($key === 'public') {
				// This existsed in old versions, but we don't want it in our shortcode output, so skip it.
				continue;
			}
			if ($key === 'filter') {
				$userFilter = $value === 'true' ? 'top' : $value;
				continue;
			}
			if ($key === 'eventpopup') {
				$userEventPopup = $value;
				continue;
			}
			if ($key === 'eventlink') {
				$userEventLink = $value;
				continue;
			}
			if ($key === 'hidepassed') {
				$userHidePassed = $value;
				continue;
			}
			if ($key === 'hidefuture') {
				$userHideFuture = $value;
				continue;
			}
			if ($key === 'eventdescription') {
				$userEventDescription = $value;
				continue;
			}
			if ($key === 'eventattachments') {
				$userEventAttachments = $value;
				continue;
			}
			if ($key === 'eventattendees') {
				$userEventAttendees = $value;
				continue;
			}
			if ($key === 'eventlocation') {
				$userEventLocation = $value;
				continue;
			}
			if ($key === 'eventcreator') {
				$userEventCreator = $value;
				continue;
			}
			if ($key === 'eventcalendarname') {
				$userEventCalendarname = $value;
				continue;
			}
			if ($key === 'uncheckedcalendarids' && !empty($value)) {
				$uncheckedCalendarIds = $value; // comma separated string
				continue;
			}

			if ($key === 'calendarids') {
				if (!empty($value)) {
					$calendarIds = $value; // comma separated string
				}
				continue;
			}
			if ($key === 'fullcalendarconfig') {
				// A JSON string that we can directly send to FullCalendar
				$userConfig = json_decode($value, true);
			} else {
				// Fullcalendar properties that get passed to fullCalendar instance.
				$parts = explode('-', $key);
				$partsCount = count($parts);
				if ($partsCount > 1) {
					$currentUserConfigLayer = &$userConfig;
					for ($i = 0; $i < $partsCount; $i++) {
						$part = $parts[$i];
						if ($i + 1 === $partsCount) {
							if ($value === 'true') {
								$value = true;
							} elseif ($value === 'false') {
								$value = $value;
							}
							$currentUserConfigLayer[$part] = $value;
						} else {
							if (!array_key_exists($part, $currentUserConfigLayer)) {
								$currentUserConfigLayer[$part] = [];
							}
							$currentUserConfigLayer = &$currentUserConfigLayer[$part];
						}
					}
				} else {
					$userConfig[$key] = $value;
				}
			}
		}

		$dataCalendarIds = '';
		if (!empty($calendarIds)) {
			$dataCalendarIds = 'data-calendarids=\'' . json_encode(array_map('trim', explode(',', $calendarIds))) . '\'';
		} else {
			$privateSettingsSelectedCalendarListIds = get_option('pgc_selected_calendar_ids', []);
			if (!empty($privateSettingsSelectedCalendarListIds)) {
				$dataCalendarIds = 'data-calendarids=\'' . json_encode($privateSettingsSelectedCalendarListIds) . '\'';
			}
		}

		$dataUnchekedCalendarIds = '';
		if (!empty($uncheckedCalendarIds)) {
			$dataUnchekedCalendarIds = 'data-uncheckedcalendarids=\'' . json_encode(array_map('trim', explode(',', $uncheckedCalendarIds))) . '\'';
		}

		$filterHTML = '<div class="pgc-calendar-filter" ' . $dataUnchekedCalendarIds . '></div>';

		return '<div class="pgc-calendar-wrapper pgc-calendar-page">' . ($userFilter === 'top' ? $filterHTML : '') . '<div '
		       . $dataCalendarIds . ' data-filter=\'' . $userFilter . '\' data-eventpopup=\'' . $userEventPopup . '\' data-eventlink=\''
		       . $userEventLink . '\' data-eventdescription=\'' . $userEventDescription . '\' data-eventlocation=\''
		       . $userEventLocation . '\' data-eventattachments=\'' . $userEventAttachments . '\' data-eventattendees=\''
		       . $userEventAttendees . '\' data-eventcreator=\'' . $userEventCreator . '\' data-eventcalendarname=\''
		       . $userEventCalendarname . '\' data-hidefuture=\'' . $userHideFuture . '\' data-hidepassed=\''
		       . $userHidePassed . '\' data-config=\'' . json_encode($userConfig) . '\' data-locale="'
		       . get_locale() . '" class="pgc-calendar"></div>' . ($userFilter === 'bottom' ? $filterHTML : '') . '</div>';
	}

	function admin_post_colorlist() {
		try {
			$client = getGoogleClient(true);
			if ($client->isAccessTokenExpired()) {
				if (!$client->getRefreshToken()) {
					throw new Exception(PGC_ERRORS_REFRESH_TOKEN_MISSING);
				}
				$client->refreshAccessToken();
			}
			$service = new Embedpress_GoogleCalendarClient($client);
			$items = $service->getColorList();
			update_option('epgc_colorlist', self::getPrettyJSONString($items), false);
			self::add_notice(EPGC_NOTICES_COLORLIST_UPDATE_SUCCESS, 'success', true);
			exit;
		} catch (Exception $ex) {
			self::die($ex);
		}
	}

}
/**
 * Add 'pgcnotice' to the removable_query_args filter, so we can set this and
 * WP will remove it for us. We use this for our custom admin notices. This way
 * you can add parameters to the URL and check for them, but we won't see them
 * in the URL.
 */
add_filter('removable_query_args', [Embedpress_Google_Helper::class, 'removable_query_args']);

/**
 * Check for 'pgcnotice' parameter and show admin notice if we have a option.
 */
add_action('admin_init', [Embedpress_Google_Helper::class,'notices_init']);

/**
 * Handle AJAX request from frontend.
 */
add_action('wp_ajax_epgc_ajax_get_calendar', [Embedpress_Google_Helper::class, 'ajax_get_calendar']);
add_action('wp_ajax_nopriv_epgc_ajax_get_calendar', [Embedpress_Google_Helper::class, 'ajax_get_calendar']);

add_action('admin_post_epgc_calendarlist', [Embedpress_Google_Helper::class,'admin_post_calendarlist']);


add_action('admin_post_epgc_colorlist', [Embedpress_Google_Helper::class, 'admin_post_colorlist']);





