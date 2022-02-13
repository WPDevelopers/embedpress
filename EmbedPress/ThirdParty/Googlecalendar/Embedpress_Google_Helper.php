<?php

if ( !class_exists( 'EmbedPress_GoogleClient') ) {
	require_once 'GoogleClient.php';
}
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
	define('EPGC_TRANSIENT_PREFIX', 'pgc_ev_');
	define('EPGC_ENQUEUE_ACTION_PRIORITY', 11);
    define( 'EPGC_REDIRECT_URL', admin_url('admin.php?page=embedpress&page_type=google-calendar'));
}
if (!defined('EPGC_EVENTS_MAX_RESULTS')) {
	define('EPGC_EVENTS_MAX_RESULTS', 250);
}

if (!defined('EPGC_EVENTS_DEFAULT_TITLE')) {
	define('EPGC_EVENTS_DEFAULT_TITLE', '');
}


if (!defined('EPGC_ASSET_URL')) {
	define('EPGC_ASSET_URL', plugin_dir_url(__FILE__) .'assets/');
}

class Embedpress_Google_Helper {

	public static function print_calendar_list($calendarList = []) {
		if ( empty( $calendarList) ) {
			$calendarList = static::getDecoded( 'epgc_calendarlist' ); //settings_selected_calendar_ids_json_cb
		}
		if ( ! empty( $calendarList ) ) {
			$selectedCalendarIds = get_option( 'epgc_selected_calendar_ids' ); // array
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
                <p class="epgc-calendar-filter">
                    <input id="<?php echo $htmlId; ?>" type="checkbox" name="epgc_selected_calendar_ids[]"
						<?php if ( in_array( $calendarId, $selectedCalendarIds ) ) {
							echo ' checked ';
						} ?>
                           value="<?php echo esc_attr( $calendarId ); ?>"/>
                    <label for="<?php echo $htmlId; ?>">
                        <span class="epgc-calendar-color" style="background-color:<?php echo esc_attr( $calendar['backgroundColor'] ); ?>"></span>
						<?php echo esc_html( $calendar['summary'] ); ?><?php if ( ! empty( $calendar['primary'] ) ) {
							echo ' (primary)';
						} ?>
                    </label>
                    <br>ID: <?php echo esc_html( $calendarId ); ?>
                </p>
			<?php } ?>
            </ul>
			<?php
			$refreshToken = get_option( "epgc_refresh_token" );
			if ( empty( $refreshToken ) ) {
				static::show_notice( EPGC_ERRORS_REFRESH_TOKEN_MISSING, 'error', false );
			}
		} else {
			?>
            <p><?php _e( 'No calendar was found.', 'embedpress' ); ?></p>
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
			}, static::getDecoded('epgc_calendarlist', []));
			if (!empty($privateSettingsCalendarListIds)) {
				$privateSettingsSelectedCalendarListIds = get_option('epgc_selected_calendar_ids');
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

			$hasAccessToken = get_option('epgc_access_token');

			if (!empty($hasAccessToken)) {

				$client = static::getGoogleClient(true);
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

			} elseif (!empty(get_option('epgc_api_key'))) {

				$referer = !empty($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : null;
				$apiKey = get_option('epgc_api_key');
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
		$privateCalendarList = static::getDecoded('epgc_calendarlist', []);
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
	 * Helper function that returns a valid Google Client.
	 * @return Embedpress_GoogleClient instance
	 * @param bool $withTokens If true, also get tokens.
	 * @throws Exception.
	 */
	public static function getGoogleClient($withTokens = false) {

		$authConfig = get_option('epgc_client_secret');
		if (empty($authConfig)) {
			throw new Exception(EPGC_ERRORS_CLIENT_SECRET_MISSING);
		}
		$authConfig = static::getDecoded('epgc_client_secret');
		if (empty($authConfig)) {
			throw new Exception(EPGC_ERRORS_CLIENT_SECRET_INVALID);
		}

		$c = new Embedpress_GoogleClient($authConfig);
		$c->setScope('https://www.googleapis.com/auth/calendar.readonly');
		if (!self::check_redirect_uri($authConfig)) {
			throw new Exception(sprintf(EPGC_ERRORS_REDIRECT_URI_MISSING, EPGC_REDIRECT_URL));
		}
		$c->setRedirectUri(EPGC_REDIRECT_URL);
		$c->setTokenCallback(function($accessTokenInfo, $refreshToken) {
			update_option('epgc_access_token', json_encode($accessTokenInfo, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES), false);
			if (!empty($refreshToken)) {
				update_option('epgc_refresh_token', $refreshToken, false);
			}
		});

		if ($withTokens) {
			$accessToken = static::getDecoded('epgc_access_token');
			if (empty($accessToken)) {
				throw new Exception(EPGC_ERRORS_ACCESS_TOKEN_MISSING);
			}
			$c->setAccessTokenInfo($accessToken);
			$refreshToken = get_option("epgc_refresh_token");
			if (empty($refreshToken)) {
				throw new Exception(EPGC_ERRORS_REFRESH_TOKEN_MISSING);
			}
			$c->setRefreshToken($refreshToken);
		}

		return $c;

	}

	/**
	 * Helper function to check if we have a valid redirect uri in the client secret.
	 * @return bool
	 */
	public static function check_redirect_uri($decodedClientSecret) {
		return !empty($decodedClientSecret)
		       && !empty($decodedClientSecret['web'])
		       && !empty($decodedClientSecret['web']['redirect_uris'])
		       && in_array(EPGC_REDIRECT_URL, $decodedClientSecret['web']['redirect_uris']);
	}


	/**
	 * Get a valid formatted client secret.
	 * @return array|false Secret Array, false if no exists, Exception for invalid one
	 **/
	public static function get_valid_client_secret(&$error = '') {
		$clientSecret = get_option('epgc_client_secret');
		if (empty($clientSecret)) {
			return false;
		}
		$clientSecret = static::getDecoded('epgc_client_secret');
		if (empty($clientSecret)
		    || empty($clientSecret['web'])
		    || empty($clientSecret['web']['client_secret'])
		    || empty($clientSecret['web']['client_id']))
		{
			$error = EPGC_ERRORS_CLIENT_SECRET_INVALID;
		} elseif (!self::check_redirect_uri($clientSecret))
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
			delete_option('epgc_api_key');
		}
		if ($which === 'all') {
			delete_option('epgc_cache_time');
		}
	}

	public static function uninstall() {
		try {
			$client = static::getGoogleClient();
			$accessToken = static::getDecoded('epgc_access_token');
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
		$removable_query_args[] = 'epgcnotice';
		return $removable_query_args;
	}

	public static function notices_init() {
		if (!empty($_GET['epgcnotice'])) {
			$epgcnotices = get_option('epgc_notices_' . get_current_user_id());
			if (empty($epgcnotices)) {
				return;
			}
			delete_option('epgc_notices_' . get_current_user_id());
			add_action('admin_notices', function() use ($epgcnotices) {
				foreach ($epgcnotices as $notice) {
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
		$epgcnotices = get_option('epgc_notices_' . get_current_user_id());
		if (empty($epgcnotices)) {
			$epgcnotices = [];
		}
		$epgcnotices[] = [
			'content' => $content,
			'type' => $type
		];
		update_option('epgc_notices_' . get_current_user_id(), $epgcnotices, false);
		if ($redirect) {
			wp_redirect(EPGC_REDIRECT_URL ."&epgcnotice=true");
		}
	}

	/**
	 * Helper function die with different kind of errors.
	 */
	public static function embedpress_die($error = null) {
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
	public static function shortcode($atts = [], $content = null) {

		// When we have no attributes, $atts is an empty string
		if (!is_array($atts)) {
			$atts = [];
		}
		wp_enqueue_style('dashicons');
		wp_enqueue_style( 'fullcalendar');
		wp_enqueue_style( 'fullcalendar_daygrid');
		wp_enqueue_style( 'fullcalendar_timegrid');
		wp_enqueue_style( 'fullcalendar_list');
		wp_enqueue_style( 'epgc');
		wp_enqueue_style( 'tippy_light');


		wp_enqueue_script('popper');
		wp_enqueue_script('tippy');
		wp_enqueue_script('my_moment');
		wp_enqueue_script('my_moment_timezone');
		wp_enqueue_script('fullcalendar');
		wp_enqueue_script('fullcalendar_moment');
		wp_enqueue_script('fullcalendar_moment_timezone');
		wp_enqueue_script('fullcalendar_daygrid');
		wp_enqueue_script('fullcalendar_timegrid');
		wp_enqueue_script('fullcalendar_list');
		wp_enqueue_script('fullcalendar_locales');
		wp_enqueue_script('epgc');
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
		$userEventLink = 'true';
		$userHidePassed = 'false';
		$userHideFuture = 'false';
		$userEventDescription = 'true';
		$userEventLocation = 'true';
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
			$privateSettingsSelectedCalendarListIds = get_option('epgc_selected_calendar_ids', []);
			if (!empty($privateSettingsSelectedCalendarListIds)) {
				$dataCalendarIds = 'data-calendarids=\'' . json_encode($privateSettingsSelectedCalendarListIds) . '\'';
			}
		}

		$dataUnchekedCalendarIds = '';
		if (!empty($uncheckedCalendarIds)) {
			$dataUnchekedCalendarIds = 'data-uncheckedcalendarids=\'' . json_encode(array_map('trim', explode(',', $uncheckedCalendarIds))) . '\'';
		}

		$filterHTML = '<div class="epgc-calendar-filter" ' . $dataUnchekedCalendarIds . '></div>';

		return '<div class="epgc-calendar-wrapper epgc-calendar-page">' . ($userFilter === 'top' ? $filterHTML : '') . '<div '
		       . $dataCalendarIds . ' data-filter=\'' . $userFilter . '\' data-eventpopup=\'' . $userEventPopup . '\' data-eventlink=\''
		       . $userEventLink . '\' data-eventdescription=\'' . $userEventDescription . '\' data-eventlocation=\''
		       . $userEventLocation . '\' data-eventattachments=\'' . $userEventAttachments . '\' data-eventattendees=\''
		       . $userEventAttendees . '\' data-eventcreator=\'' . $userEventCreator . '\' data-eventcalendarname=\''
		       . $userEventCalendarname . '\' data-hidefuture=\'' . $userHideFuture . '\' data-hidepassed=\''
		       . $userHidePassed . '\' data-config=\'' . json_encode($userConfig) . '\' data-locale="'
		       . get_locale() . '" class="epgc-calendar"></div>' . ($userFilter === 'bottom' ? $filterHTML : '') . '</div>';
	}

	public static function admin_post_calendarlist() {
		try {
			$client = static::getGoogleClient(true);
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
			self::embedpress_die($ex);
		}
	}
	public static function admin_post_colorlist() {
		try {
			$client = static::getGoogleClient(true);
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
			self::embedpress_die($ex);
		}
	}
	public static function admin_post_deletecache() {
		self::delete_calendar_cache();
		self::add_notice(PGC_NOTICES_CACHE_DELETED, 'success', true);
		exit;
	}
	public static function admin_post_verify() {
		try {
			$client = static::getGoogleClient(true);
			$client->refreshAccessToken();
			self::add_notice(PGC_NOTICES_VERIFY_SUCCESS, 'success', true);
			exit;
		} catch (Exception $ex) {
			self::embedpress_die($ex);
		}
	}
    public static function enqueue_scripts() {
	    wp_enqueue_style('dashicons');
	    wp_register_style('fullcalendar', EPGC_ASSET_URL . 'lib/fullcalendar4/core/main.min.css', null, EMBEDPRESS_VERSION);
	    wp_register_style('fullcalendar_daygrid', EPGC_ASSET_URL . 'lib/fullcalendar4/daygrid/main.min.css', ['fullcalendar'], EMBEDPRESS_VERSION);
	    wp_register_style('fullcalendar_timegrid', EPGC_ASSET_URL . 'lib/fullcalendar4/timegrid/main.min.css', ['fullcalendar_daygrid'], EMBEDPRESS_VERSION);
	    wp_register_style('fullcalendar_list', EPGC_ASSET_URL . 'lib/fullcalendar4/list/main.min.css', ['fullcalendar'], EMBEDPRESS_VERSION);
	    wp_register_style('epgc', EPGC_ASSET_URL . 'css/epgc.css', ['fullcalendar_timegrid'], EMBEDPRESS_VERSION);
	    wp_register_style('tippy_light', EPGC_ASSET_URL . 'lib/tippy/light-border.css', null, EMBEDPRESS_VERSION);

        //wp_enqueue_style( 'fullcalendar');
        //wp_enqueue_style( 'fullcalendar_daygrid');
        //wp_enqueue_style( 'fullcalendar_timegrid');
        //wp_enqueue_style( 'fullcalendar_list');
        //wp_enqueue_style( 'epgc');
        //wp_enqueue_style( 'tippy_light');


	    wp_register_script('popper',EPGC_ASSET_URL . 'lib/popper.min.js', null, EMBEDPRESS_VERSION, true);
	    wp_register_script('tippy',EPGC_ASSET_URL . 'lib/tippy/tippy-bundle.umd.min.js', ['popper'], EMBEDPRESS_VERSION, true);
	    wp_register_script('my_moment',EPGC_ASSET_URL . 'lib/moment/moment-with-locales.min.js', null, EMBEDPRESS_VERSION, true);
	    wp_register_script('my_moment_timezone',EPGC_ASSET_URL . 'lib/moment/moment-timezone-with-data.min.js', ['my_moment'], EMBEDPRESS_VERSION, true);
	    wp_register_script('fullcalendar',EPGC_ASSET_URL . 'lib/fullcalendar4/core/main.min.js', ['my_moment_timezone'], EMBEDPRESS_VERSION, true);
	    wp_register_script('fullcalendar_moment',EPGC_ASSET_URL . 'lib/fullcalendar4/moment/main.min.js', ['fullcalendar'], EMBEDPRESS_VERSION, true);
	    wp_register_script('fullcalendar_moment_timezone',EPGC_ASSET_URL . 'lib/fullcalendar4/moment-timezone/main.min.js', ['fullcalendar_moment'], EMBEDPRESS_VERSION, true);
	    wp_register_script('fullcalendar_daygrid',EPGC_ASSET_URL . 'lib/fullcalendar4/daygrid/main.min.js', ['fullcalendar'], EMBEDPRESS_VERSION, true);
	    wp_register_script('fullcalendar_timegrid',EPGC_ASSET_URL . 'lib/fullcalendar4/timegrid/main.min.js', ['fullcalendar_daygrid'], EMBEDPRESS_VERSION, true);
	    wp_register_script('fullcalendar_list',EPGC_ASSET_URL . 'lib/fullcalendar4/list/main.min.js', ['fullcalendar'], EMBEDPRESS_VERSION, true);
	    wp_register_script('fullcalendar_locales',EPGC_ASSET_URL . 'lib/fullcalendar4/core/locales-all.min.js',['fullcalendar'], EMBEDPRESS_VERSION, true);
	    wp_register_script('epgc', EPGC_ASSET_URL . 'js/main.js',['fullcalendar'], EMBEDPRESS_VERSION, true);

        //wp_enqueue_script('popper');
        //wp_enqueue_script('my_moment');
        //wp_enqueue_script('my_moment_timezone');
        //wp_enqueue_script('fullcalendar');
        //wp_enqueue_script('fullcalendar_moment');
        //wp_enqueue_script('fullcalendar_moment_timezone');
        //wp_enqueue_script('fullcalendar_daygrid');
        //wp_enqueue_script('fullcalendar_timegrid');
        //wp_enqueue_script('fullcalendar_list');
        //wp_enqueue_script('fullcalendar_locales');
        //wp_enqueue_script('epgc');

	    $nonce = wp_create_nonce('epgc_nonce');
	    wp_localize_script('epgc', 'epgc_object', [
		    'ajax_url' => admin_url('admin-ajax.php'),
		    'nonce' => $nonce,
		    'trans' => [
			    'all_day' => __('All day', 'embedpress'),
			    'created_by' => __('Created by', 'embedpress'),
			    'go_to_event' => __('Go to event', 'embedpress'),
			    'unknown_error' => __('Unknown error', 'embedpress'),
			    'request_error' => __('Request error', 'embedpress'),
			    'loading' => __('Loading', 'embedpress')
		    ]
	    ]);

    }

	public static function remove_private_data() {
		self::delete_plugin_data('private');
		self::add_notice(EPGC_NOTICES_REMOVE_SUCCESS, 'success', true);
		exit;
	}

    public static function admin_post_remove() {
	    self::delete_plugin_data();
	    self::add_notice(EPGC_NOTICES_REMOVE_SUCCESS, 'success', true);
	    exit;
    }
    public static function admin_post_revoke() {
	    try {
		    $client = self::getGoogleClient();
		    $accessToken = self::getDecoded('epgc_access_token');
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
		    // Clear access and refresh tokens
		    self::delete_plugin_data('private');
		    self::add_notice(EPGC_NOTICES_REVOKE_SUCCESS, 'success', true);
		    exit;
	    } catch (Exception $ex) {
		    self::embedpress_die($ex);
	    }
    }
    public static function admin_post_authorize() {
	    try {
		    $client = self::getGoogleClient();
		    $client->authorize();
		    exit;
	    } catch (Exception $ex) {
		    self::embedpress_die($ex);
	    }
    }

	public static function fetch_calendar() {
		if ( empty( $_GET['page']) || 'embedpress' !== $_GET['page'] ) {
            return;
        }

		if ( !current_user_can( 'manage_options') ) {
            return;
        }
		if (!empty($_GET['code'])) {
			// Redirect from Google authorize with code that we can use to get access and refresh tokens.
			try {
				$client = self::getGoogleClient();
				// This will also set the access and refresh tokens on the client
				// and call the token callback we have set to save them in the options table.
				$client->handleCodeRedirect();
				$service = new Embedpress_GoogleCalendarClient($client);
				$items = $service->getCalendarList();
				self::sort_calendars($items);

				update_option('epgc_calendarlist', self::getPrettyJSONString($items), false);
				wp_redirect(EPGC_REDIRECT_URL);
				exit;
			} catch (Exception $ex) {
				self::embedpress_die($ex);
			}

		}

		$clientSecretError = '';
		$clientSecret = self::get_valid_client_secret($clientSecretError);

		$accessToken = self::getDecoded('epgc_access_token');

		if (empty($clientSecret) || !empty($clientSecretError)) {
			update_option('epgc_client_secret', '', false);
			update_option('epgc_selected_calendar_ids', [], false);
		}
		if (!empty($accessToken)) {
			// validate_selected_calendar_ids
		}
		if (empty($clientSecret) || !empty($clientSecretError)) {
			// save new data from user input, show them input

		} elseif (self::getDecoded('epgc_calendarlist')) {
            // show calendar list
		}

	}
}






/**
 * Add 'eepgcnotice' to the removable_query_args filter, so we can set this and
 * WP will remove it for us. We use this for our custom admin notices. This way
 * you can add parameters to the URL and check for them, but we won't see them
 * in the URL.
 */
add_filter('removable_query_args', [Embedpress_Google_Helper::class, 'removable_query_args']);

/**
 * Check for 'epgcnotice' parameter and show admin notice if we have a option.
 */
add_action('admin_init', [Embedpress_Google_Helper::class,'notices_init']);

/**
 * Handle AJAX request from frontend.
 */
add_action('wp_ajax_epgc_ajax_get_calendar', [Embedpress_Google_Helper::class, 'ajax_get_calendar']);
add_action('wp_ajax_nopriv_epgc_ajax_get_calendar', [Embedpress_Google_Helper::class, 'ajax_get_calendar']);

add_action('admin_post_epgc_calendarlist', [Embedpress_Google_Helper::class,'admin_post_calendarlist']);


add_action('admin_post_epgc_colorlist', [Embedpress_Google_Helper::class, 'admin_post_colorlist']);
add_action('admin_post_epgc_deletecache', [Embedpress_Google_Helper::class, 'admin_post_deletecache']);
/**
 * Admin post action to verify if we have valid access and refresh token.
 */
add_action('admin_post_epgc_verify', [Embedpress_Google_Helper::class, 'admin_post_verify']);

add_shortcode( 'embedpress_calendar', [Embedpress_Google_Helper::class, 'shortcode']);
add_action('wp_enqueue_scripts', [Embedpress_Google_Helper::class, 'enqueue_scripts'], EPGC_ENQUEUE_ACTION_PRIORITY);

add_action('admin_post_epgc_remove_private', [Embedpress_Google_Helper::class, 'remove_private_data']);
/**
 * Admin post action to delete all plugin data.
 */
add_action('admin_post_epgc_remove', [Embedpress_Google_Helper::class,'admin_post_remove']);


/**
 * Admin post action to authorize access.
 */
add_action('admin_post_epgc_authorize', [Embedpress_Google_Helper::class, 'admin_post_authorize']);

add_action('admin_init', [Embedpress_Google_Helper::class, 'fetch_calendar']);

