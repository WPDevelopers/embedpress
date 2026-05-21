<?php

namespace EmbedPress\Includes\Classes;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Pinterest OAuth + API v5 client (shared-app model).
 *
 * EmbedPress hosts a single Pinterest developer app whose Client ID is
 * baked into the constant below. The Client Secret lives only in the
 * proxy at `api.embedpress.com/pinterest.php` — never in the customer's
 * plugin install — mirroring the existing Instagram flow.
 *
 * Connection round-trip:
 *
 *   1. Customer clicks "Connect" → we redirect them to Pinterest's
 *      authorize page, with `redirect_uri = api.embedpress.com/pinterest.php`
 *      and `state = customer admin URL`.
 *   2. Pinterest sends `code` + `state` to the proxy.
 *   3. Proxy POSTs to /v5/oauth/token with the shared secret, gets back
 *      access + refresh tokens, fetches the account username, and
 *      redirects to `state` with the tokens in query args.
 *   4. WP's admin_init listener (handle_pinterest_proxy_return below)
 *      strips the tokens from the URL and stores them in `ep_pinterest_account_data`.
 *
 * Refresh uses the same proxy via `?action=refresh&refresh_token=...`.
 *
 * Stored option `ep_pinterest_account_data` shape:
 *
 *   - access_token   (string)
 *   - refresh_token  (string)
 *   - expires_at     (int unix ts)
 *   - username       (string)
 *   - account_type   (string)
 *   - connected_at   (int unix ts)
 *   - granted_scopes (string)
 *
 * @package EmbedPress\Includes\Classes
 */
class PinterestOAuth
{
    const OPT_TOKEN = 'ep_pinterest_account_data';

    /**
     * Shared EmbedPress Pinterest developer app. Client Secret lives only
     * in api.embedpress.com/pinterest.php — never here.
     */
    const CLIENT_ID    = '1572945';
    const REDIRECT_URI = 'https://api.embedpress.com/pinterest.php';

    const OAUTH_AUTHORIZE = 'https://www.pinterest.com/oauth/';
    const API_BASE        = 'https://api.pinterest.com/v5';
    const DEFAULT_SCOPES  = 'user_accounts:read,pins:read,boards:read';

    public static function getRedirectUri()
    {
        return self::REDIRECT_URI;
    }

    public static function getAccountData()
    {
        $data = get_option(self::OPT_TOKEN, []);
        return is_array($data) ? $data : [];
    }

    public static function isConnected()
    {
        $data = self::getAccountData();
        return !empty($data['access_token']);
    }

    public static function disconnect()
    {
        delete_option(self::OPT_TOKEN);
    }

    /**
     * Build the Pinterest authorize URL the customer is sent to.
     *
     * `state` carries:
     *
     *   <admin_url_b64>.<nonce>
     *
     * The proxy passes `state` straight through to its `Location:` header,
     * so we slot the customer site URL in there. The nonce half is what
     * we verify on return to confirm the round trip wasn't tampered with.
     */
    public static function buildAuthorizeUrl()
    {
        $admin_url = admin_url();
        $b64       = rtrim(strtr(base64_encode($admin_url), '+/', '-_'), '=');
        $nonce     = wp_create_nonce('ep_pinterest_oauth_state');
        $state     = $b64 . '.' . $nonce;

        return self::OAUTH_AUTHORIZE . '?' . http_build_query([
            'client_id'     => self::CLIENT_ID,
            'redirect_uri'  => self::REDIRECT_URI,
            'response_type' => 'code',
            'scope'         => self::DEFAULT_SCOPES,
            'state'         => $state,
        ]);
    }

    /**
     * Verify the nonce half of the state we sent in buildAuthorizeUrl.
     * The proxy passes `state` back verbatim.
     */
    public static function verifyState($state)
    {
        if (!is_string($state) || strpos($state, '.') === false) {
            return false;
        }
        $parts = explode('.', $state, 2);
        return (bool) wp_verify_nonce($parts[1], 'ep_pinterest_oauth_state');
    }

    /**
     * Persist tokens passed back from the proxy. The proxy embeds them in
     * the URL query, the admin_init handler picks them up, validates the
     * state, and calls this.
     */
    public static function storeTokens(array $params)
    {
        $expires_in = isset($params['expires_in']) ? (int) $params['expires_in'] : 2592000; // 30d default
        $existing   = self::getAccountData();

        $data = [
            'access_token'   => isset($params['access_token']) ? (string) $params['access_token'] : '',
            'refresh_token'  => isset($params['refresh_token']) ? (string) $params['refresh_token']
                : (isset($existing['refresh_token']) ? $existing['refresh_token'] : ''),
            'expires_at'     => time() + $expires_in,
            'username'       => isset($params['username']) ? (string) $params['username']
                : (isset($existing['username']) ? $existing['username'] : ''),
            'account_type'   => isset($params['account_type']) ? (string) $params['account_type']
                : (isset($existing['account_type']) ? $existing['account_type'] : ''),
            'granted_scopes' => isset($params['scope']) ? (string) $params['scope'] : self::DEFAULT_SCOPES,
            'connected_at'   => !empty($existing['connected_at']) ? (int) $existing['connected_at'] : time(),
        ];

        update_option(self::OPT_TOKEN, $data, false);
        return $data;
    }

    /**
     * Build the proxy URL that performs a refresh-token exchange and
     * redirects back to the WP admin with fresh tokens.
     */
    public static function buildRefreshUrl()
    {
        $account = self::getAccountData();
        if (empty($account['refresh_token'])) {
            return '';
        }
        $admin_url = admin_url();
        $b64       = rtrim(strtr(base64_encode($admin_url), '+/', '-_'), '=');
        $nonce     = wp_create_nonce('ep_pinterest_oauth_state');
        $state     = $b64 . '.' . $nonce;

        return self::REDIRECT_URI . '?' . http_build_query([
            'action'        => 'refresh',
            'refresh_token' => $account['refresh_token'],
            'state'         => $state,
        ]);
    }

    /**
     * Authenticated GET against the v5 API. Returns WP_Error on 401 so
     * the caller can decide whether to surface "reconnect" UI. We do not
     * try to refresh here because refresh requires the client secret —
     * the proxy is the only thing that can.
     */
    public static function apiGet($path, array $query = [])
    {
        $account = self::getAccountData();
        if (empty($account['access_token'])) {
            return new \WP_Error('embedpress_pinterest_not_connected', 'Pinterest not connected');
        }

        $url = self::API_BASE . '/' . ltrim($path, '/');
        if (!empty($query)) {
            $url = add_query_arg($query, $url);
        }

        $response = wp_remote_get($url, [
            'timeout' => 12,
            'headers' => [
                'Authorization' => 'Bearer ' . $account['access_token'],
                'Accept'        => 'application/json',
            ],
        ]);
        if (is_wp_error($response)) {
            return $response;
        }

        $code = (int) wp_remote_retrieve_response_code($response);
        $body = json_decode((string) wp_remote_retrieve_body($response), true);

        if ($code < 200 || $code >= 300) {
            $msg = is_array($body) && isset($body['message']) ? $body['message'] : 'API request failed';
            return new \WP_Error('embedpress_pinterest_api_error', $msg, ['status' => $code, 'body' => $body]);
        }

        return is_array($body) ? $body : [];
    }

    /**
     * Convenience: fetch the connected account.
     */
    public static function fetchUserAccount()
    {
        return self::apiGet('user_account');
    }
}
