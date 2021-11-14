<?php

/**
 * Exception with a description field.
 **/
class EmbedPress_GoogleClient_RequestException extends Exception {

	private $description;

	function __construct($message, $code = 0, $description = '') {
		parent::__construct($message, $code );
		$this->description = $description;

	}
	public function getDescription() {
		return $this->description;
	}

}

/**
 * Class that can do an HTTP request.
 **/
class EmbedPress_GoogleClient_Request {

	// See for example: https://developers.google.com/drive/v3/web/handle-errors
	private static $HTTP_CODES = [
		400 => 'Bad request. User error.',
		401 => 'Invalid Credentials. Invalid authorization header. The access token you\'re using is either expired or invalid.',
		403 => 'Rate Limit Exceeded.',
		404 => 'Not found. The specified resource was not found.',
		500 => 'Backend error.'
	];

	/**
	 * Does a HTTP request
	 *
	 * @param string $url URL to request
	 * @param array $params Parameters to add to the URL or request body
	 * @param string $method HTTP method to use
	 * @param array $headers Headers for this request
	 *
	 * @return array JSON result decoded as an array
	 *
	 * @throws EmbedPress_GoogleClient_RequestException
	 **/
	public static function doRequest($url, $params = [], $method = 'GET', $headers = []) {

		$args = [];
		if (!empty($headers)) {
			$args['headers'] = $headers;
		}

		$args['timeout'] = 10; // default is 5 seconds.

		switch ($method) {
			case 'GET':
				if (!empty($params)) {
					$url .= '?' . http_build_query($params); // urlencoded is done for you
					//$url = add_query_arg($params, $url); // wp variant, but I think you still have to urlencoded it
				}
				$result = wp_remote_get($url, $args);
				break;
			case 'POST':
				if (!empty($params)) {
					$args['body'] = $params; // TODO: Do we have to urlencoded these manually?
				}
				$result = wp_remote_post($url, $args);
				break;
			default:
				throw new EmbedPress_GoogleClient_RequestException('Unknown request method.');
		}

		if (empty($result)) {
			throw new EmbedPress_GoogleClient_RequestException('Request failed.');
		}

		if (is_wp_error($result)) {
			throw new EmbedPress_GoogleClient_RequestException($result->get_error_message());
		}

		$decodedResult = json_decode(wp_remote_retrieve_body($result), true);
		if (is_null($decodedResult)) {
			throw new EmbedPress_GoogleClient_RequestException('Response is invalid JSON.', 0, $result);
		}
		if (!empty($decodedResult['error'])) {
			$exCode = 0;
			$exMessage = 'Something went wrong.';
			$exDescription = '';
			if (is_array($decodedResult['error'])) {
				if (!empty($decodedResult['error']['message'])) {
					$exMessage = $decodedResult['error']['message'];
				}
				if (!empty($decodedResult['error']['code']) && preg_match("/^\d+$/", $decodedResult['error']['code'])) {
					$exCode = $decodedResult['error']['code'];
				}
			} else {
				if (!empty($decodedResult['error_description'])) {
					$exMessage = $decodedResult['error_description'];
				}
				if (!empty($decodedResult['code']) && preg_match("/^\d+$/", $decodedResult['code'])) {
					$exCode = $decodedResult['code'];
				}
			}
			if (!empty(self::$HTTP_CODES[$exCode])) {
				$exDescription = self::$HTTP_CODES[$exCode];
			}
			throw new EmbedPress_GoogleClient_RequestException($exMessage, $exCode, $exDescription);
		}
		return $decodedResult;
	}
}

/**
 * The Google OAuth client class.
 **/
class EmbedPress_GoogleClient {

	/**
	 * Array of client_secret that can be downloaded from the Google api console at:
	 * https://console.developers.google.com
	 **/
	private $clientInfo;

	/**
	 * @var array The access token info as an array that is returned by the Google API.
	 **/
	private $accessTokenInfo;

	/**
	 * @var string The refreshed
	 **/
	private $refreshToken;

	private $scope;
	private $redirectUri;

	const GOOGLE_AUTH_URI = 'https://accounts.google.com/o/oauth2/v2/auth';
	const GOOGLE_REFRESH_URI = 'https://www.googleapis.com/oauth2/v4/token';
	const GOOGLE_CODE_URI = 'https://www.googleapis.com/oauth2/v4/token';
	const GOOGLE_REVOKE_URI = 'https://accounts.google.com/o/oauth2/revoke';

	// Gets called whenever we receive a new access and optionally refresh token.
	// So mostly after authorize phase (with refresh token) or after refresh token (only access token).
	private $tokenCallback;
	/**
	 * @var null|mixed
	 */
	private $getAccessTokenInfo;

	function __construct($clientInfo, $accessTokenInfo = null, $refreshToken = null, $tokenCallback = null) {
		$this->clientInfo = $clientInfo;
		$this->getAccessTokenInfo = $accessTokenInfo;
		$this->refreshToken = $refreshToken;
		$this->tokenCallback = $tokenCallback;
		$this->scope = null;
		$this->redirectUri = null;
	}

	public function setAccessTokenInfo($accessTokenInfo) {
		$this->accessTokenInfo = $accessTokenInfo;
	}

	public function getAccessTokenInfo() {
		return $this->accessTokenInfo;
	}

	// Helper
	public function getAccessToken() {
		return $this->accessTokenInfo['access_token'];
	}

	public function setRefreshToken($refreshToken) {
		$this->refreshToken = $refreshToken;
	}

	public function getRefreshToken() {
		return $this->refreshToken;
	}

	public function setTokenCallback($tokenCallback) {
		$this->tokenCallback = $tokenCallback;
	}

	public function setScope($scope) {
		$this->scope = $scope;
	}

	/**
	 * @throws Exception
	 */
	public function setRedirectUri($redirectUri) {
		if (!in_array($redirectUri, $this->clientInfo['web']['redirect_uris'])) {
			throw new Exception('Redirect Uri does not exist in client info. Add it first to the project and download the JSON again.');
		}
		$this->redirectUri = $redirectUri;
	}

	public function isAccessTokenExpired() {
		// Add 30 seconds, so we refresh them on time.
		return $this->accessTokenInfo['expire_time'] + 30 < time();
	}

	private function updateTokens($response) {
		// Compute when access token expires and add it to the info array.
		$response['expire_time'] = time() + $response['expires_in'];
		// Only after authorize we get a refresh token, so make sure to save it!
		// If you loose it, you have to revoke permission and authorize again.
		$this->setAccessTokenInfo($response);
		$refreshToken = !empty($response['refresh_token']) ? $response['refresh_token'] : null;
		if (!empty($refreshToken)) {
			$this->setRefreshToken($refreshToken);
		}
		call_user_func($this->tokenCallback, $response, $refreshToken);
	}

	/**
	 * @throws EmbedPress_GoogleClient_RequestException
	 * @throws Exception
	 */
	public function handleCodeRedirect($state = '') {
		if (!empty($_GET['error'])) {
			throw new Exception($_GET['error']);
		}
		if (empty($_GET['code'])) {
			throw new Exception('Code missing');
		}
		$getState = !empty($_GET['state']) ? $_GET['state'] : '';
		if ($getState !== $state) {
			throw new Exception("State mismatch.");
		}

		$result = EmbedPress_GoogleClient_Request::doRequest(self::GOOGLE_CODE_URI, [
			'code' => $_GET['code'],
			'client_id' => $this->clientInfo['web']['client_id'],
			'client_secret' => $this->clientInfo['web']['client_secret'],
			'redirect_uri' => $this->redirectUri,
			'grant_type' => 'authorization_code'
		], 'POST', [
			'Content-Type' => 'application/x-www-form-urlencoded'
		]);

		$this->updateTokens($result);
	}

	public function authorize($state = '') {
		$params = [
			'client_id' => $this->clientInfo['web']['client_id'],
			'scope' => $this->scope,
			'access_type' => 'offline',
			'include_granted_scopes' => 'true',
			'state' => $state,
			'redirect_uri' => $this->redirectUri,
			'response_type' => 'code'
		];
		$url = self::GOOGLE_AUTH_URI . '?' . http_build_query($params);
		header('Location: ' . $url);
		exit;
	}

	/**
	 * @throws EmbedPress_GoogleClient_RequestException
	 */
	public function refreshAccessToken() {
		$result = EmbedPress_GoogleClient_Request::doRequest(
			self::GOOGLE_REFRESH_URI,
			[
				'client_id' => $this->clientInfo['web']['client_id'],
				'client_secret' => $this->clientInfo['web']['client_secret'],
				'refresh_token' => $this->refreshToken,
				'grant_type' => 'refresh_token'
			],
			'POST',
			[
				'Content-Type' => 'application/x-www-form-urlencoded'
			]
		);
		$this->updateTokens($result);
	}

	/**
	 * @throws EmbedPress_GoogleClient_RequestException
	 * @throws Exception
	 */
	public function revoke() {
		// Can be done with access and refresh token,
		// but as access tokens expire more frequent, first take refresh token.
		// It can take some time before the revoke is processed.
		$token = $this->getRefreshToken();
		if (empty($token)) {
			$token = $this->getAccessToken();
		}
		if (empty($token)) {
			throw new Exception('No access and refresh token.');
		}
		EmbedPress_GoogleClient_Request::doRequest(
			self::GOOGLE_REVOKE_URI, ['token' => $token]);
		// TODO: do we have 200 status code???

	}

}

// https://developers.google.com/google-apps/calendar/v3/reference/events/list
/**
 * Class that can communicate with the Google Calendar API.
 **/
class EmbedPress_GoogleCalendarClient {

	const GOOGLE_CALENDAR_EVENTS_URI = 'https://www.googleapis.com/calendar/v3/calendars/$calendarId/events';
	const GOOGLE_CALENDARLIST_URI = 'https://www.googleapis.com/calendar/v3/users/me/calendarList';
	const GOOGLE_COLORLIST_URI = 'https://www.googleapis.com/calendar/v3/colors';

	private $googleClient;

	function __construct($client) {
		$this->googleClient = $client;
	}

	/**
	 * @throws EmbedPress_GoogleClient_RequestException
	 */
	public function getEvents($calendarId, $params) {
		$url = str_replace('$calendarId', urlencode($calendarId), self::GOOGLE_CALENDAR_EVENTS_URI);
		// https://developers.google.com/google-apps/calendar/performance#partial-response
		$params['fields'] = "items(summary,description,start,end,htmlLink,creator,location,attendees,attachments,colorId)";
		$result = EmbedPress_GoogleClient_Request::doRequest(
			$url,
			$params,
			'GET',
			[
				'Authorization' => 'Bearer ' . $this->googleClient->getAccessToken(),
			]
		);

		return !empty($result['items']) ? $result['items'] : [];
	}

	/**
	 * @throws EmbedPress_GoogleClient_RequestException
	 */
	public function getEventsPublic($calendarId, $params, $apiKey, $referer) {
		$url = str_replace('$calendarId', urlencode($calendarId), self::GOOGLE_CALENDAR_EVENTS_URI);
		// https://developers.google.com/google-apps/calendar/performance#partial-response
		$params['fields'] = "items(summary,description,start,end,htmlLink,creator,location,attendees,attachments,colorId)";
		$params['key'] = $apiKey;
		$result = EmbedPress_GoogleClient_Request::doRequest(
			$url,
			$params,
			'GET',
			[
				'Referer' => $referer
			]
		);

		return !empty($result['items']) ? $result['items'] : [];
	}

	/**
	 * @throws EmbedPress_GoogleClient_RequestException
	 */
	public function getPrimaryEvents($params) {
		return $this->getEvents('primary', $params);
	}

	/**
	 * @return string JSON  with items as key each item is calendarListEntry
	 * calendarListEntry:
	 * 'id' => string 'ehqelgh6hq4juqhjd79g4b5qkk@group.calendar.google.com' ==> use this for event list
	 * 'summary' => string 'Vacationers'
	 * 'description' => string 'Agenda voor de vakantierooster'
	 * 'backgroundColor' => string '#cd74e6'
	 * 'foregroundColor' => string '#000000'
	 * 'selected' => boolean true ==> alleen aanwezig als geselecteerd! Geeft aan of de gebruiker deze calendat in de Google ui aan heeft gezet
	 * 'primary' => boolean true ==> alleen aanwezig bij primary calendar!
	 * 'accessRole' => we can get events only for 'owner' items, so we only query these.
	 * @throws EmbedPress_GoogleClient_RequestException
	 */
	public function getCalendarList() {
		$result = EmbedPress_GoogleClient_Request::doRequest(
			self::GOOGLE_CALENDARLIST_URI,
			[
				'minAccessRole' => 'reader' // if 'owner', then you don't see calendars like national holidays.
			],
			'GET',
			[
				'Authorization' => 'Bearer ' . $this->googleClient->getAccessToken()
			]
		);

		return !empty($result['items']) ? $result['items'] : [];
	}

	/**
	 * @throws EmbedPress_GoogleClient_RequestException
	 */
	public function getColorList() {
		$result = EmbedPress_GoogleClient_Request::doRequest(
			self::GOOGLE_COLORLIST_URI,
			null,
			'GET',
			[
				'Authorization' => 'Bearer ' . $this->googleClient->getAccessToken()
			]
		);
		$calendar = !empty($result['calendar']) ? $result['calendar'] : [];
		$event = !empty($result['event']) ? $result['event'] : [];
		return [
			'calendar' => $calendar,
			'event' => $event
		];
	}

}