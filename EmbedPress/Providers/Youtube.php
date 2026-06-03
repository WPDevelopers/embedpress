<?php

/**
 * Youtube.php
 *
 * @package Embera
 * @author Michael Pratt <yo@michael-pratt.com>
 * @link   http://www.michael-pratt.com/
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace EmbedPress\Providers;

use Embera\Provider\ProviderAdapter;
use Embera\Provider\ProviderInterface;
use Embera\Url;

use EmbedPress\Includes\Classes\Helper;

use EmbedPress\Providers\TemplateLayouts\YoutubeLayout;

/**
 * youtube.com Provider
 * @link https://youtube.com
 * @link https://youtube-eng.googleblog.com/2009/10/oembed-support_9.html
 */


class Youtube extends ProviderAdapter implements ProviderInterface {
	/** inline {@inheritdoc} */
	protected $shouldSendRequest = false;
    public static $curltimeout = 30;
    /** inline {@inheritdoc} */
    protected $endpoint = 'https://www.youtube.com/oembed?format=json&scheme=https';
    protected static $channel_endpoint = 'https://www.googleapis.com/youtube/v3/';
    /** @var array Array with allowed params for the current Provider */
    protected $allowedParams = [ 'maxwidth', 'maxheight', 'pagesize', 'thumbnail', 'gallery', 'hideprivate', 'columns', 'ispagination', 'gapbetweenvideos', 'ytChannelLayout', 'ytPlaylistLayout', 'ytPlaylistMode' ];

    /** inline {@inheritdoc} */
    protected static $hosts = [
        'm.youtube.com', 'youtube.com', 'youtu.be',
    ];

    /** inline {@inheritdoc} */
    protected $httpsSupport = true;

    public function getAllowedParams(){
        return $this->allowedParams;
    }

    /** inline {@inheritdoc} */
    public function validateUrl(Url $url) {
        $u = $this->normalize_yt_url((string) $url);
        // Channel / handle / user / playlist landing URLs go through this
        // provider so getStaticResponse() can render a gallery for them.
        if (preg_match('~\/channel\/|\/c\/|\/user\/|\/@\w+~i', $u)) {
            return true;
        }
        // /playlist?list=PL… and /watch?…&list=PL|RD|UU… all render as a queue.
        if (preg_match('~^https?://(?:www\.)?youtube\.com/(?:playlist|watch)\?(?:[^#]*&)?list=([\w-]+)~i', $u)) {
            return true;
        }
        return (bool) (preg_match('~(?:https?:\/\/)?(?:www\.)?(?:youtube.com\/)(\w+)[^?\/]*$~i', $u));
    }

    public function validateTYLiveUrl($url) {
        return (bool) (preg_match('~(?:https?:\/\/)?(?:www\.)?(?:youtube.com\/(?:channel|c|user)\/\w+\/live|@\w+\/live)~i', (string) $url));
    }

    /** inline {@inheritdoc} */
    public function normalizeUrl(Url $url) {
        return $url;
    }
    

    public function isChannel($url = null) {
        if (empty($url)) {
            $url = $this->url;
        }
        $channel = $this->getChannel($url);
        return !empty($channel['id']);
    }

    public function isPlaylist($url = null) {
        if (empty($url)) {
            $url = $this->url;
        }
        return !empty($this->getPlaylistID($url));
    }

    /**
     * Extract a playlist ID from any YouTube URL that exposes one:
     *  - /playlist?list=PL…           (landing page)
     *  - /watch?v=…&list=PL…          (video inside a playlist)
     *  - /watch?v=…&list=RD…          (auto-generated Mix / Radio)
     *  - /watch?v=…&list=UU…          (channel uploads via list= param)
     *
     * Single-video watch URLs (no list=) return '' so the normal oembed path
     * still handles them.
     */
    /**
     * Normalize a YouTube URL for query-string regex matching: WP often
     * runs URLs through esc_url() which encodes & → &#038;, so we decode
     * back to a single canonical form before pattern-matching.
     */
    protected function normalize_yt_url($url) {
        return str_replace(['&#038;', '&amp;'], '&', (string) $url);
    }

    public function getPlaylistID($url = null) {
        if (empty($url)) {
            $url = $this->url;
        }
        $url = $this->normalize_yt_url($url);
        if (preg_match('~^https?://(?:www\.)?youtube\.com/playlist\?(?:[^#]*&)?list=([\w-]+)~i', $url, $m)) {
            return $m[1];
        }
        if (preg_match('~^https?://(?:www\.)?youtube\.com/watch\?(?:[^#]*&)?list=([\w-]+)~i', $url, $m)) {
            return $m[1];
        }
        return '';
    }

    /**
     * Optional starting video ID from a watch?v=…&list=… URL. The queue
     * opens at this video instead of item #1.
     */
    public function getStartVideoID($url = null) {
        if (empty($url)) {
            $url = $this->url;
        }
        $url = $this->normalize_yt_url($url);
        if (preg_match('~^https?://(?:www\.)?youtube\.com/watch\?(?:[^#]*&)?v=([\w-]{6,15})~i', $url, $m)) {
            return $m[1];
        }
        return '';
    }

    public function getChannel($url = null) {
        $channelId = 'unknown_id'; // temporarily assigned a placeholder value for demonstration purposes

        if (empty($url)) {
            $url = $this->url;
        }
        preg_match('~\/(channel|c|user)\/(.+)~i', (string) $url, $matches);
        if(empty($matches[1])){
            preg_match('~(?:https?:\/\/)?(?:www\.)?(?:youtube.com\/)(\w+)[^?\/]*$~i', (string) $url, $matches);
            if(!empty($matches[1])){
                return [
                    "type" => 'user',
                    "id"   => $matches[1],
                ];
            }
        }
        
        

        if(empty($matches[1])){
            preg_match('~\/(@)(\w+)~i', (string) $url, $matches);
            if(!empty($matches[1])){
                $handle = $this->get_youtube_handler($this->url);
                if(!empty($handle)){
                    $resolved = $this->get_channel_id_by_handler($handle);
                    if(!empty($resolved)){
                        $channelId = $resolved;
                    }
                }
                return [
                    "type" => 'user',
                    "id"   => $channelId,
                ];
            }
        }
        return [
            "type" => isset($matches[1]) ? $matches[1] : '',
            "id"   => isset($matches[2]) ? $matches[2] : '',
        ];
    }

    /** inline {@inheritdoc} */
    public function getEndpoint() {
        if ($this->isChannel()) {
            $apiEndpoint = 'https://www.googleapis.com/youtube/v3/channels';
            return $apiEndpoint;
        }
        return (string) $this->endpoint;
    }

    protected function get_api_key() {
        $settings = (array) get_option(EMBEDPRESS_PLG_NAME . ':youtube', []);
        return !empty($settings['api_key']) ? $settings['api_key'] : '';
    }

    protected function get_pagesize() {
        $settings = (array) get_option(EMBEDPRESS_PLG_NAME . ':youtube', []);
        return !empty($settings['pagesize']) ? $settings['pagesize'] : '';
    }

    /** inline {@inheritdoc} */
    public function getParams() {
        $params = parent::getParams();

        // WP lowercases shortcode attribute names. Re-map lowercase keys
        // to camelCase ones so `[embedpress ytplaylistlayout="theatre"]`
        // flows through the same code path as block/Elementor attrs.
        $aliases = [
            'ytplaylistlayout' => 'ytPlaylistLayout',
            'ytplaylistmode'   => 'ytPlaylistMode',
            'ytchannellayout'  => 'ytChannelLayout',
        ];
        foreach ($aliases as $lower => $canon) {
            if (isset($this->config[$lower]) && !isset($params[$canon])) {
                $params[$canon] = $this->config[$lower];
            }
        }

        if ($this->isChannel() && $this->get_api_key()) {
            $channel        = $this->getChannel();
            $params['part'] = 'contentDetails,snippet';
            $params['key']  = $this->get_api_key();
            if ($channel['type'] == 'c') {
                $params['forUsername'] = $channel['id'];
            } else {
                $params['id'] = $channel['id'];
            }
            unset($params['url']);
        }
        return $params;
    }

    /**
     * Builds a valid Oembed query string based on the given parameters,
     * Since this method uses the http_build_query function, there is no
     * need to pass urlencoded parameters, http_build_query already does
     * this for us.
     *
     * @param string $endpoint The Url to the Oembed endpoint
     * @param array  $params Parameters for the query string
     * @return string
     */

    protected function constructUrl($endpoint, array $params = array())
    {
        $endpoint = self::$channel_endpoint . $endpoint;

        return $endpoint . ((strpos($endpoint, '?') === false) ? '?' : '&') . http_build_query(array_filter($params));
    }

	public function getStaticResponse() {
        $results = [
            "title"         => "",
            "type"          => "video",
            'provider_name' => $this->getProviderName(),
            "provider_url"  => "https://www.youtube.com/",
            'html'          => '',
        ];

        $params          = $this->getParams();

        if (preg_match("/^https?:\/\/(?:www\.)?youtube\.com\/channel\/([\w-]+)\/live$/", $this->url, $matches) || $this->validateTYLiveUrl($this->url)) {

            $channelId = '';

            if(!empty($matches[1])){
                $channelId = $matches[1];
            }

            if(empty($channelId)){
                $handle = $this->get_youtube_handler($this->url);
                if(!empty($handle)){
                    $resolved = $this->get_channel_id_by_handler($handle);
                    if(!empty($resolved)){
                        $channelId = $resolved;
                    }
                }
            }

            if(empty($channelId)){
                return $results;
            }

            $api_key = $this->get_api_key();

            // When API key is available, check for active live stream
            if (!empty($api_key)) {
                $live_video_id = $this->get_live_video_id($channelId, $api_key);

                if (!empty($live_video_id)) {
                    // Channel is live - embed the live video directly
                    $embedUrl = 'https://www.youtube.com/embed/' . $live_video_id . '?feature=oembed';
                } else {
                    // Channel is not live - show the last completed stream or latest video
                    $last_video_id = $this->get_last_stream_or_video($channelId, $api_key);
                    if (!empty($last_video_id)) {
                        $embedUrl = 'https://www.youtube.com/embed/' . $last_video_id . '?feature=oembed';
                    } else {
                        // No video found at all
                        $embedUrl = 'https://www.youtube.com/embed/live_stream?channel=' . $channelId . '&feature=oembed';
                    }
                }
            } else {
                // No API key - use live_stream endpoint as fallback
                $embedUrl = 'https://www.youtube.com/embed/live_stream?channel='.$channelId.'&feature=oembed';
            }

            $attr = [];
            $attr[] = 'width="'.esc_attr($params['maxwidth']).'"';
            $attr[] = 'height="'.esc_attr($params['maxheight']).'"';
            $attr[] = 'src="' . esc_url($embedUrl) . '"';
            $attr[] = 'frameborder="0"';
            $attr[] = 'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"';
            $attr[] = 'allowfullscreen';
            $attr[] = 'referrerpolicy="origin"';

            $results['html'] = '<iframe ' . implode(' ', $attr) . '></iframe>';
        }
        else if($this->isPlaylist()){
            // User can opt-out of the playlist UI via ytPlaylistMode=single.
            // For watch?v=…&list=… URLs, this renders just the v= video as a
            // normal single-video oembed. For /playlist?list=… URLs (no v=),
            // 'single' means "render the playlist's first item as a single
            // video" — getStartVideoID() falls back to the playlist's lead
            // item via the YouTube API.
            $mode = isset($params['ytPlaylistMode']) ? $params['ytPlaylistMode'] : 'playlist';
            if ($mode === 'single') {
                $single_vid = $this->getStartVideoID();
                if (empty($single_vid)) {
                    // /playlist?list=… URL — fetch first item from playlistItems.
                    $first = $this->get_playlist_first_video($this->getPlaylistID());
                    if (!empty($first)) {
                        $single_vid = $first;
                    }
                }
                if (!empty($single_vid)) {
                    $embedUrl = 'https://www.youtube.com/embed/' . rawurlencode($single_vid) . '?feature=oembed';
                    $w = esc_attr($params['maxwidth']);
                    $h = esc_attr($params['maxheight']);
                    $results['html'] = '<iframe width="'.$w.'" height="'.$h.'" src="'.esc_url($embedUrl).'" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
                    return $results;
                }
                // No video resolvable — fall through to playlist UI as a sane fallback.
            }
            $playlist = $this->getPlaylistGallery();
            $results  = array_merge($results, $playlist);
        }
        else if($this->isChannel()){
            $channel = $this->getChannelGallery();
            $results = array_merge($results, $channel);
        }

        return $results;
    }

    public function getChannelPlaylist(){
        $result = [
            "playlistID" => '',
            "title" => '',
        ];
        $channel       = $this->getChannel();
        $channel_url   = $this->constructUrl('channels', $this->getParams());
        $transient_key = 'ep_embed_youtube_channel_playlist_id_' . md5($channel_url);
        $jsonResult    = get_transient($transient_key);

        if(!empty($jsonResult)){
            return $jsonResult;
        }

        if($channel['type'] == 'user' || $channel['type'] == 'c'){
            $this->getChannelIDbyUsername();
            $channel_url = $this->constructUrl('channels', $this->getParams());
        }

        if (empty($this->get_api_key())) {
            $result['error'] = true;
            $result['html'] = $this->get_api_key_error_message();
            return $result;
        }

        $apiResult = wp_remote_get($channel_url, array('timeout' => self::$curltimeout));
        if (is_wp_error($apiResult)) {
            $result['error'] = true;
            $result['html'] = $this->clean_api_error_html($apiResult->get_error_message(), true);
            set_transient($transient_key, $result, 10);
            return $result;
        }
        $jsonResult = json_decode($apiResult['body']);


        if (isset($jsonResult->error)) {
            $result['error'] = true;
            if (isset($jsonResult->error->message)) {
                $result['html'] = $this->clean_api_error_html($jsonResult->error->message, true);
            }
            else{
                $result['html'] = $this->clean_api_error_html(__('Sorry, there may be an issue with your YouTube API key.', 'embedpress'));
            }
            set_transient($transient_key, $result, MINUTE_IN_SECONDS);
            return $result;
        }
        elseif(!empty($jsonResult->items[0]->contentDetails->relatedPlaylists->uploads)){
            $result['playlistID'] = $jsonResult->items[0]->contentDetails->relatedPlaylists->uploads;
            $result['title'] = isset($jsonResult->items[0]->snippet->title) ? $jsonResult->items[0]->snippet->title : '';
            set_transient($transient_key, $result, DAY_IN_SECONDS);
        }

        return $result;
    }

    public function get_youtube_handler($url){
        preg_match('/^https?:\/\/(?:www\.)?youtube\.com\/@([^\/?]+)/i', $url, $matches);

        $handle_name = '';
        if(!empty($matches[1])){
            $handle_name = $matches[1];
        }

        return $handle_name;
    }

    public function getChannelIDbyUsername(){
        $url       = $this->getUrl();
        $apiResult = wp_remote_get($url, array('timeout' => self::$curltimeout));

        if (!is_wp_error($apiResult)) {
            $channel_html = $apiResult['body'];
            preg_match("/<meta\s+itemprop=[\"']channelId[\"']\s+content=[\"'](.*?)[\"']\/?>/", $channel_html, $matches);
            if(!empty($matches[1])){
                $url = "https://www.youtube.com/channel/{$matches[1]}";
                $url = $this->normalizeUrl(new Url($url));
            }
        }
    }

    
    public function get_channel_id_by_handler($handle)
    {
        $transient_key = 'channel_id_' . md5($handle);
        $channel_id = get_transient($transient_key);

        if (false !== $channel_id && preg_match('/^UC[\w-]+$/', $channel_id)) {
            return $channel_id;
        }

        // Prefer the YouTube Data API when a key is configured. Scraping
        // youtube.com from EU server IPs gets bounced to consent.youtube.com
        // and the response contains neither the canonical channel link nor
        // externalId, so the regex fallback below silently returns ''.
        $api_key = $this->get_api_key();
        if (!empty($api_key)) {
            $api_url = self::$channel_endpoint . 'channels?' . http_build_query([
                'part'      => 'id',
                'forHandle' => '@' . $handle,
                'key'       => $api_key,
            ]);
            $api_response = wp_remote_get($api_url, ['timeout' => self::$curltimeout]);
            if (!is_wp_error($api_response)) {
                $api_body = json_decode(wp_remote_retrieve_body($api_response));
                if (!empty($api_body->items[0]->id) && preg_match('/^UC[\w-]+$/', $api_body->items[0]->id)) {
                    $channel_id = $api_body->items[0]->id;
                    set_transient($transient_key, $channel_id, 7 * DAY_IN_SECONDS);
                    return $channel_id;
                }
            }
        }

        $channel_handle = "https://www.youtube.com/@{$handle}";

        // Bypass YouTube's EU consent redirect by sending the CONSENT cookie
        // and a real browser UA. Without this the response is a consent page
        // when the request originates from an EU IP.
        $response = wp_remote_get($channel_handle, [
            'timeout'    => self::$curltimeout,
            'user-agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'headers'    => [
                'Accept-Language' => 'en-US,en;q=0.9',
                'Cookie'          => 'CONSENT=YES+cb.20210328-17-p0.en+FX+000',
            ],
        ]);

        if (is_wp_error($response)) {
            return '';
        }

        $body = wp_remote_retrieve_body($response);

        if (empty($body)) {
            return '';
        }

        // Try canonical link first (most reliable)
        $pattern = '/<link rel="canonical" href="https:\/\/www\.youtube\.com\/channel\/([^"]{1,50})">/';
        if (preg_match($pattern, $body, $matches)) {
            $channel_id = $matches[1];
            set_transient($transient_key, $channel_id, 7 * DAY_IN_SECONDS);
            return $channel_id;
        }

        // Fallback: try externalId from page data
        if (preg_match('/"externalId"\s*:\s*"(UC[a-zA-Z0-9_-]+)"/', $body, $matches)) {
            $channel_id = $matches[1];
            set_transient($transient_key, $channel_id, 7 * DAY_IN_SECONDS);
            return $channel_id;
        }

        return '';
    }

    /**
     * Check if a channel has an active live stream and return the video ID.
     */
    public function get_live_video_id($channel_id, $api_key) {
        $transient_key = 'ep_yt_live_' . md5($channel_id);
        $cached = get_transient($transient_key);

        if (false !== $cached) {
            return $cached;
        }

        $api_url = self::$channel_endpoint . 'search?' . http_build_query([
            'part'       => 'id',
            'channelId'  => $channel_id,
            'eventType'  => 'live',
            'type'       => 'video',
            'key'        => $api_key,
        ]);

        $response = wp_remote_get($api_url, ['timeout' => self::$curltimeout]);

        if (is_wp_error($response)) {
            return '';
        }

        $data = json_decode(wp_remote_retrieve_body($response));

        if (!empty($data->items[0]->id->videoId)) {
            $video_id = $data->items[0]->id->videoId;
            set_transient($transient_key, $video_id, 2 * MINUTE_IN_SECONDS);
            return $video_id;
        }

        // Cache empty result briefly to avoid repeated API calls
        set_transient($transient_key, '', MINUTE_IN_SECONDS);
        return '';
    }

    /**
     * Get the last completed live stream or latest video from a channel.
     * Tries completed streams first, falls back to latest upload.
     */
    public function get_last_stream_or_video($channel_id, $api_key) {
        $transient_key = 'ep_yt_last_stream_' . md5($channel_id);
        $cached = get_transient($transient_key);

        if (false !== $cached) {
            return $cached;
        }

        // First try: get the last completed live stream
        $api_url = self::$channel_endpoint . 'search?' . http_build_query([
            'part'       => 'id',
            'channelId'  => $channel_id,
            'eventType'  => 'completed',
            'type'       => 'video',
            'order'      => 'date',
            'maxResults' => 1,
            'key'        => $api_key,
        ]);

        $response = wp_remote_get($api_url, ['timeout' => self::$curltimeout]);

        if (!is_wp_error($response)) {
            $data = json_decode(wp_remote_retrieve_body($response));
            if (!empty($data->items[0]->id->videoId)) {
                $video_id = $data->items[0]->id->videoId;
                set_transient($transient_key, $video_id, 5 * MINUTE_IN_SECONDS);
                return $video_id;
            }
        }

        // Fallback: get the latest video from the channel's uploads playlist
        $channel_url = self::$channel_endpoint . 'channels?' . http_build_query([
            'part' => 'contentDetails',
            'id'   => $channel_id,
            'key'  => $api_key,
        ]);

        $ch_response = wp_remote_get($channel_url, ['timeout' => self::$curltimeout]);

        if (!is_wp_error($ch_response)) {
            $ch_data = json_decode(wp_remote_retrieve_body($ch_response));
            $uploads_playlist = $ch_data->items[0]->contentDetails->relatedPlaylists->uploads ?? '';

            if (!empty($uploads_playlist)) {
                $playlist_url = self::$channel_endpoint . 'playlistItems?' . http_build_query([
                    'part'       => 'snippet',
                    'playlistId' => $uploads_playlist,
                    'maxResults' => 1,
                    'key'        => $api_key,
                ]);

                $pl_response = wp_remote_get($playlist_url, ['timeout' => self::$curltimeout]);

                if (!is_wp_error($pl_response)) {
                    $pl_data = json_decode(wp_remote_retrieve_body($pl_response));
                    if (!empty($pl_data->items[0]->snippet->resourceId->videoId)) {
                        $video_id = $pl_data->items[0]->snippet->resourceId->videoId;
                        set_transient($transient_key, $video_id, 5 * MINUTE_IN_SECONDS);
                        return $video_id;
                    }
                }
            }
        }

        set_transient($transient_key, '', 2 * MINUTE_IN_SECONDS);
        return '';
    }

    public function layout_data(){
        $data = [];
        $data['get_pagesize'] = $this->get_pagesize(); 
        $data['get_api_key'] = $this->get_api_key(); 
        $data['get_api_key_error_message'] = $this->get_api_key_error_message(); 
        $data['get_channel_info'] = $this->get_channel_info(); 
        $data['get_api_key'] = $this->get_api_key(); 
        $data['curltimeout'] = self::$curltimeout; 
        $data['self::class'] = self::class; 

        return $data;

    }
    

    /** inline {@inheritdoc} */
    public function getChannelGallery() {
        $response = [];
        $channel  = $this->getChannelPlaylist();
        if(!empty($channel['error'])){
            return $channel;
        }
        if (!empty($channel["playlistID"])) {
            return $this->buildGallery($channel["playlistID"], $channel['title']);
        }
        elseif ($this->isChannel() && empty($this->get_api_key()) && current_user_can('manage_options')) {
            return [
                "html"          => "<div class='ep-player-wrap'>" . __('Please enter your YouTube API key to embed YouTube Channel.', 'embedpress') . "</div>",
            ];
        }

        return $response;
    }

    /**
     * Look up the first video ID inside a playlist (for 'single' mode when
     * the URL has no v=). Cached 1d alongside the playlist info call.
     */
    public function get_playlist_first_video($playlist_id) {
        $api_key = $this->get_api_key();
        if (empty($api_key) || empty($playlist_id)) {
            return '';
        }
        $transient_key = 'ep_yt_playlist_first_' . md5($playlist_id);
        $cached        = get_transient($transient_key);
        if (is_string($cached) && $cached !== '') {
            return $cached;
        }
        $url = self::$channel_endpoint . 'playlistItems?' . http_build_query([
            'part'       => 'snippet,contentDetails',
            'playlistId' => $playlist_id,
            'maxResults' => 1,
            'key'        => $api_key,
        ]);
        $response = wp_remote_get($url, ['timeout' => self::$curltimeout]);
        if (is_wp_error($response)) {
            return '';
        }
        $body = json_decode(wp_remote_retrieve_body($response));
        $vid = isset($body->items[0]) ? Helper::get_id($body->items[0]) : '';
        if (!empty($vid)) {
            set_transient($transient_key, $vid, DAY_IN_SECONDS);
        }
        return (string) $vid;
    }

    /**
     * Fetch playlist metadata (title, channel, item count, thumbnail) from
     * youtube/v3/playlists. Cached 1d. Returns [] on failure.
     */
    public function get_playlist_info($playlist_id) {
        $api_key = $this->get_api_key();
        if (empty($api_key) || empty($playlist_id)) {
            return [];
        }

        $transient_key = 'ep_yt_playlist_info_' . md5($playlist_id);
        $cached        = get_transient($transient_key);
        if (is_array($cached)) {
            return $cached;
        }

        $url = self::$channel_endpoint . 'playlists?' . http_build_query([
            'part' => 'snippet,contentDetails',
            'id'   => $playlist_id,
            'key'  => $api_key,
        ]);

        $response = wp_remote_get($url, ['timeout' => self::$curltimeout]);
        if (is_wp_error($response)) {
            return [];
        }
        $body = json_decode(wp_remote_retrieve_body($response));
        if (empty($body->items[0])) {
            set_transient($transient_key, [], MINUTE_IN_SECONDS);
            return [];
        }

        $item = $body->items[0];
        $info = [
            'id'             => $playlist_id,
            'title'          => isset($item->snippet->title) ? $item->snippet->title : '',
            'channel_title'  => isset($item->snippet->channelTitle) ? $item->snippet->channelTitle : '',
            'channel_id'     => isset($item->snippet->channelId) ? $item->snippet->channelId : '',
            'description'    => isset($item->snippet->description) ? $item->snippet->description : '',
            'item_count'     => isset($item->contentDetails->itemCount) ? (int) $item->contentDetails->itemCount : 0,
            'thumbnail'      => isset($item->snippet->thumbnails->medium->url)
                ? $item->snippet->thumbnails->medium->url
                : (isset($item->snippet->thumbnails->default->url) ? $item->snippet->thumbnails->default->url : ''),
            'playlist_url'   => 'https://www.youtube.com/playlist?list=' . rawurlencode($playlist_id),
        ];

        set_transient($transient_key, $info, DAY_IN_SECONDS);
        return $info;
    }

    /**
     * Render a playlist URL (youtube.com/playlist?list=PL…) as a queue/gallery,
     * reusing the same layout engine as channels.
     */
    public function getPlaylistGallery() {
        $playlist_id = $this->getPlaylistID();
        if (empty($playlist_id)) {
            return [];
        }

        if (empty($this->get_api_key())) {
            if (current_user_can('manage_options')) {
                return [
                    "html" => "<div class='ep-player-wrap'>" . $this->get_api_key_error_message() . "</div>",
                ];
            }
            return [];
        }

        $playlist_info = $this->get_playlist_info($playlist_id);
        $title         = !empty($playlist_info['title']) ? $playlist_info['title'] : '';
        $start_vid     = $this->getStartVideoID();
        if (!empty($start_vid)) {
            $playlist_info['start_vid'] = $start_vid;
        }

        return $this->buildGallery($playlist_id, $title, $playlist_info);
    }

    /**
     * Shared gallery renderer for both channel uploads playlists and
     * standalone playlist URLs. Extracted from getChannelGallery() so the
     * layout/pagination/iframe code path stays a single source of truth.
     *
     * @param string $playlist_id   YouTube playlist ID.
     * @param string $title         Display title (channel name or playlist title).
     * @param array  $playlist_info Optional playlist metadata from get_playlist_info() — non-empty when rendering a standalone playlist URL.
     */
    protected function buildGallery($playlist_id, $title = '', $playlist_info = []) {
        $params       = $this->getParams();
        $is_playlist  = !empty($playlist_info);
        $gallery_args = [
            'playlistId' => $playlist_id,
        ];
        if (!empty($params['pagesize'])) {
            $gallery_args['pagesize'] = $params['pagesize'];
        } elseif ($is_playlist) {
            // Queue layout — render enough items to fill the scrollable area
            // out of the box. The JS auto-fetches more on scroll regardless.
            $gallery_args['pagesize'] = 12;
        }

        // Layout selection differs by source:
        //   Channel URLs → ytChannelLayout (gallery/list/grid/carousel) [unchanged]
        //   Playlist URLs → ytPlaylistLayout (queue/theatre, more to come)
        // Each surface has its own attribute so a saved channel pick can't
        // leak into a playlist render and vice versa.
        if ($is_playlist) {
            // Free layouts always render. Pro layouts (library/spotlight/
            // cinema/magazine) only render when Pro is active; otherwise we
            // fall back to queue and the inspector shows the upsell.
            $playlist_layouts = ['queue', 'theatre', 'library', 'spotlight', 'cinema', 'magazine'];
            $pro_playlist_layouts = ['library', 'spotlight', 'cinema', 'magazine'];
            $picked = isset($params['ytPlaylistLayout']) ? $params['ytPlaylistLayout'] : '';
            if (!in_array($picked, $playlist_layouts, true)) {
                $picked = 'queue';
            }
            if (in_array($picked, $pro_playlist_layouts, true) && !apply_filters('embedpress/is_allow_rander', false)) {
                $picked = 'queue';
            }
            $layout = $picked;
        } else {
            $default_layout = 'gallery';
            $layout = isset($params['ytChannelLayout']) && $params['ytChannelLayout'] !== ''
                ? $params['ytChannelLayout']
                : $default_layout;
        }

        $layout_data                  = $this->layout_data();
        $layout_data['is_playlist']   = $is_playlist;
        $layout_data['playlist_info'] = $playlist_info;

        // For playlist URLs the channel-info fetch returns a string error
        // ("No channel information found") because get_channel_info() targets
        // channel URLs. Pro's youtube_carousel_layout dereferences this as
        // an array, so feed it a synthetic shape sourced from playlist_info.
        if ($is_playlist) {
            $layout_data['get_channel_info'] = [
                'snippet' => [
                    'title' => !empty($playlist_info['channel_title']) ? $playlist_info['channel_title'] : (!empty($playlist_info['title']) ? $playlist_info['title'] : ''),
                    'thumbnails' => [
                        'default' => ['url' => !empty($playlist_info['thumbnail']) ? $playlist_info['thumbnail'] : ''],
                        'high'    => ['url' => !empty($playlist_info['thumbnail']) ? $playlist_info['thumbnail'] : ''],
                    ],
                ],
            ];
        }

        $channel_layout = 'layout-' . $layout;

        $gallery = YoutubeLayout::create_youtube_layout($gallery_args, $layout_data, $layout, $this->url);

        $main_iframe = '';
        // Queue layout renders its own leading player; gallery layout uses ep-first-video block.
        if (!empty($gallery->first_vid) && $layout === 'gallery') {
            $rel           = esc_url("https://www.youtube.com/embed/{$gallery->first_vid}?feature=oembed");
            $iframe_width  = esc_attr($params['maxwidth']);
            $iframe_height = esc_attr($params['maxheight']);
            $iframe_title  = esc_attr($title);
            $main_iframe   = "<div class='ep-first-video'><iframe width='{$iframe_width}' height='{$iframe_height}' src='{$rel}' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen title='{$iframe_title}'></iframe></div>";
        }

        if (!apply_filters('embedpress/is_allow_rander', false) && ($layout === 'grid' || $layout === 'carousel')) {
            return [];
        }

        if (!empty($gallery->html)) {
            // Queue layout owns its own styling; skip the gallery/grid <style> block.
            $styles       = $layout === 'queue' ? '' : $this->styles($params, $this->getUrl());
            $html_content = $main_iframe . $gallery->html . ' ' . $styles;

            return [
                "title" => $title,
                "html"  => "<div class='ep-player-wrap $channel_layout'>$html_content</div>",
            ];
        }

        return [];
    }
    

    public function get_channel_info() {
        $api_key = $this->get_api_key();
        $channel_id = $this->getChannel($this->url);
        $channel_id = $channel_id['id'];


        // Create a unique transient key based on the channel ID
        $transient_key = 'youtube_channel_info_' . $channel_id;

        // Attempt to get cached response
        $channel_info = get_transient($transient_key);

        if ($channel_info === false) {
            // No cached response, make the API call
            $endpoint = "https://www.googleapis.com/youtube/v3/channels?part=snippet%2Cstatistics&id=$channel_id&key=$api_key";
            $response = wp_remote_get($endpoint);

            if (is_wp_error($response)) {
                return 'Error fetching channel info';
            }

            $body = wp_remote_retrieve_body($response);
            $data = json_decode($body, true);

            if (empty($data['items'])) {
                return 'No channel information found';
            }

            $channel_info = $data['items'][0];
            

            // Cache the response for 1 hour
            set_transient($transient_key, $channel_info, HOUR_IN_SECONDS);
        }

        update_option('youtube_channel_info_'. md5($this->url), $channel_info);


        return $channel_info;
        
    }

    
    public function get_layout() {
        $params = $this->getParams();
        return isset($params['ytChannelLayout']) ? $params['ytChannelLayout'] : '';
    }

    /**
     * Undocumented function
     *
     * @param array $options
     * @return object
     */
    public function get_gallery_page($options) {

        $nextPageToken = '';
        $prevPageToken = '';
        $gallobj       = new \stdClass();
        $options       = wp_parse_args($options, [
            'playlistId'  => '',
            'pageToken'   => '',
            'pagesize'    => $this->get_pagesize() ? $this->get_pagesize() : 6,
            'currentpage' => '',
            'columns'     => 3,
            'ytChannelLayout' => 'gallery',
            'thumbnail'   => 'medium',
            'gallery'     => true,
            'autonext'    => true,
            'thumbplay'   => true,
            'apiKey'      => $this->get_api_key(),
            'hideprivate' => '',
        ]);
        $options['pagesize'] = $options['pagesize'] > 50 ? 50 : $options['pagesize'];
        $options['pagesize'] = $options['pagesize'] < 1 ? 1 : $options['pagesize'];

        if (empty($options['apiKey'])) {
            $gallobj->html = $this->get_api_key_error_message();
            return $gallobj;
        }

        $apiEndpoint = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,status,contentDetails&playlistId=' . $options['playlistId']
            . '&maxResults=' . $options['pagesize']
            . '&key=' . $options['apiKey'];
        if ($options['pageToken'] != null) {
            $apiEndpoint .= '&pageToken=' . $options['pageToken'];
        }



        $transient_key          = 'ep_embed_youtube_channel_' . md5($apiEndpoint);
        $gallobj->transient_key = $transient_key;
        $jsonResult             = get_transient($transient_key);


        if (empty($jsonResult)) {
            $apiResult = wp_remote_get($apiEndpoint, array('timeout' => self::$curltimeout));
            if (is_wp_error($apiResult)) {
                $gallobj->html = $this->clean_api_error_html($apiResult->get_error_message(), true);
                return $gallobj;
            }
            $jsonResult = json_decode($apiResult['body']);
            
            if (empty($jsonResult->error)) {
                set_transient($transient_key, $jsonResult, MINUTE_IN_SECONDS * 20);
            }
            else{
                set_transient($transient_key, $jsonResult, 10);
            }
        }



        if (isset($jsonResult->error)) {
            if(!empty($jsonResult->error->errors[0]->reason) && $jsonResult->error->errors[0]->reason == 'playlistNotFound'){
                $gallobj->html = $this->clean_api_error_html(__('There is nothing on the playlist.', 'embedpress'));
                return $gallobj;
            }
            if (isset($jsonResult->error->message)) {
                $gallobj->html = $this->clean_api_error_html($jsonResult->error->message);
                return $gallobj;
            }
            $gallobj->html = $this->clean_api_error_html(__('Sorry, there may be an issue with your YouTube API key.', 'embedpress'));
            return $gallobj;
        }



        $resultsPerPage = $jsonResult->pageInfo->resultsPerPage;
        $totalResults = $jsonResult->pageInfo->totalResults;
        $totalPages = ceil($totalResults / $resultsPerPage);

        if (isset($jsonResult->nextPageToken)) {
            $nextPageToken = $jsonResult->nextPageToken;
        }

        if (isset($jsonResult->prevPageToken)) {
            $prevPageToken = $jsonResult->prevPageToken;
        }


        if (!empty($jsonResult->items) && is_array($jsonResult->items)) :
            if($options['gallery'] === "false"){
                $gallobj->html = "";
                if(count($jsonResult->items) === 1){
                    $gallobj->first_vid = $this->get_id($jsonResult->items[0]);
                }
                return $gallobj;
            }

            if(count($jsonResult->items) === 1 && empty($nextPageToken) && empty($prevPageToken)){
                $gallobj->first_vid = $this->get_id($jsonResult->items[0]);
                $gallobj->html = "";
                return $gallobj;
            }

            if (strpos($options['playlistId'], 'UU') === 0) {
                // sort only channels
                usort($jsonResult->items, array(self::class, 'compare_vid_date')); // sorts in place
            }
            
            ob_start();

            ?>

            <div class="ep-youtube__content__block"  data-unique-id="<?php echo wp_rand(); ?>">
                <div class="youtube__content__body">
                    <?php 
                     ?>

                    <div class="content__wrap">

                    <?php 

                                $data = $this->layout_data();


                                $channel_info = get_option('youtube_channel_info_'.md5($options['channel_url']));

                                $channelTitle = isset($channel_info['snippet']['title']) ? $channel_info['snippet']['title'] : null;
                                $channelThumb = isset($channel_info['snippet']['thumbnails']['high']['url']) ? $channel_info['snippet']['thumbnails']['high']['url'] : null;
                                $layout = $this->get_layout();

                                
                                if($layout === 'gallery'){
                                    echo YoutubeLayout::create_gallery_layout($jsonResult, $gallobj, $options, $data, $channelTitle, $channelThumb); 
                                }
                                else if($layout === 'grid'){
                                    do_action('embedpress/youtube_grid_layout', $jsonResult, $gallobj, $options, $data, $channelTitle, $channelThumb);
                                }
                                else if($layout === 'list'){
                                    echo YoutubeLayout::create_list_layout($jsonResult, $gallobj, $options, $data, $channelTitle, $channelThumb); 
                                }
                                else if($layout === 'carousel'){
                                    do_action('embedpress/youtube_carousel_layout', $jsonResult, $gallobj, $options, $data, $channelTitle, $channelThumb);
                                }
                                else{
                                    echo YoutubeLayout::create_gallery_layout($jsonResult, $gallobj, $options, $data, $channelTitle, $channelThumb); 

                                }

                        ?>
<!--                         
                        <?php foreach ($jsonResult->items as $item) : ?>
                            <?php
                            $privacyStatus = isset($item->status->privacyStatus) ? $item->status->privacyStatus : null;
                            $thumbnail = $this->get_thumbnail_url($item, $options['thumbnail'], $privacyStatus);
                            $vid = $this->get_id($item);
                            if (empty($gallobj->first_vid)) {
                                $gallobj->first_vid = $vid;
                            }
                            if ($privacyStatus == 'private' && $options['hideprivate']) {
                                continue;
                            }
                            ?>
                            <div class="item" data-vid="<?php echo $vid; ?>">
                                <div class="thumb" style="background: <?php echo "url({$thumbnail}) no-repeat center"; ?>">
                                    <div class="play-icon">
                                        <img src="<?php echo esc_url(EMBEDPRESS_URL_ASSETS. 'images/youtube.svg'); ?>" alt="">
                                    </div>
                                </div>
                                <div class="body">
                                    <p><?php echo esc_html($item->snippet->title); ?></p>
                                </div>
                            </div>

                        <?php endforeach; ?> -->

                        <div class="item" style="height: 0"></div>
                    </div>


                    <?php 
                    $layout = $this->get_layout();
                    
                    if ($totalPages > 1 && $layout !== 'carousel') : ?>
                        <div class="ep-youtube__content__pagination <?php echo (empty($prevPageToken) && empty($nextPageToken)) ? ' hide ' : ''; ?>">
                            <div
                                class="ep-prev" <?php echo empty($prevPageToken) ? ' style="display:none" ' : ''; ?>
                                data-playlistid="<?php echo esc_attr($options['playlistId']) ?>"
                                data-pagetoken="<?php echo esc_attr($prevPageToken) ?>"
                                data-pagesize="<?php echo intval($options['pagesize']) ?>"
                            >
                                <span><?php _e("Prev", "embedpress"); ?></span>
                            </div>
                            <div class="is_desktop_device ep-page-numbers <?php echo $totalPages > 1 ? '' : 'hide'; ?>">
                                <?php

                                    $numOfPages = $totalPages;
                                    $renderedEllipses = false;

                                    $currentPage = !empty($options['currentpage'])?$options['currentpage'] : 1;

                                    for($i = 1; $i<=$numOfPages; $i++)
                                    {
                                        //render pages 1 - 3
                                        if($i < 4) {
                                            //render link
                                            $is_current = $i == (int)$currentPage? "active__current_page" : "";

                                            echo wp_kses_post("<span class='page-number  $is_current' data-page='$i'>$i</span>");

                                        }

                                        //render current page number
                                        else if($i == (int)$currentPage) {
                                            //render link
                                            echo wp_kses_post('<span class="page-number active__current_page" data-page="'.$i.'">'.$i.'</span>');
                                            //reset ellipses
                                            $renderedEllipses = false;
                                        }

                                        //last page number
                                        else if ($i >= $numOfPages - 1) {
                                            //render link
                                            echo wp_kses_post('<span class="page-number" data-page="'.$i.'">'.$i.'</span>');
                                        }

                                        //make sure you only do this once per ellipses group
                                        else {
                                        if (!$renderedEllipses){
                                            print("...");
                                            $renderedEllipses = true;
                                        }
                                        }
                                    }
                                ?>

                            </div>

                            <div class="is_mobile_device ep-page-numbers <?php echo $totalPages > 1 ? '' : 'hide'; ?>">
                                <?php

                                    $numOfPages = $totalPages;
                                    $renderedEllipses = false;

                                    $currentPage = !empty($options['currentpage'])?$options['currentpage'] : 1;

                                    for($i = 1; $i<=$numOfPages; $i++)
                                    {

                                        //render current page number
                                    if($i == (int)$currentPage) {
                                            //render link
                                            echo wp_kses_post('<span class="page-number-mobile" data-page="'.$i.'">'.$i.'</span>');
                                            //reset ellipses
                                            $renderedEllipses = false;
                                        }

                                        //last page number
                                        else if ($i >= $numOfPages ) {
                                            //render link
                                            echo wp_kses_post('...<span class="page-number-mobile" data-page="'.$i.'">'.$i.'</span>');
                                        }
                                    }
                                ?>

                            </div>


                            <div
                                class="ep-next " <?php echo empty($nextPageToken) ? ' style="display:none" ' : ''; ?>
                                data-playlistid="<?php echo esc_attr($options['playlistId']) ?>"
                                data-pagetoken="<?php echo esc_attr($nextPageToken) ?>"
                                data-pagesize="<?php echo intval($options['pagesize']) ?>"
                            >
                                <span><?php _e("Next ", "embedpress"); ?> </span>
                            </div>
                        </div>
                    <?php endif; ?>

                    <div class="ep-loader-wrap">
                        <div class="ep-loader"><img alt="loading" src="<?php echo esc_url(EMBEDPRESS_URL_ASSETS. 'images/youtube/spin.gif'); ?>"></div>
                    </div>

                </div>
            </div>
            
            <?php
            $gallobj->html = ob_get_clean();
        else:
            $gallobj->html = $this->clean_api_error_html(__("There is nothing on the playlist.", 'embedpress'));
        endif;

        return $gallobj;
    }

    public function get_api_key_error_message(){
        return '<div>' . sprintf(__("EmbedPress: Please enter your YouTube API key at <a class='ep-link' href='%s' target='_blank' style='color: #5b4e96; text-decoration: none'>EmbedPress > Platforms > YouTube</a> to embed YouTube Channel.", "embedpress"), admin_url('?page=embedpress&page_type=youtube#api_key'))  . '</div>';
    }

    public function get_id($item){
        $vid = isset($item->snippet->resourceId->videoId) ? $item->snippet->resourceId->videoId : null;
        $vid = $vid ? $vid : (isset($item->id->videoId) ? $item->id->videoId : null);
        $vid = $vid ? $vid : (isset($item->id) ? $item->id : null);
        return $vid;
    }
    public function get_thumbnail_url($item, $quality, $privacyStatus) {
        $url = "";
        if ($privacyStatus == 'private') {
            $url = EMBEDPRESS_URL_ASSETS. 'images/youtube/private.png';
        } elseif (isset($item->snippet->thumbnails->{$quality}->url)) {
            $url = $item->snippet->thumbnails->{$quality}->url;
        } elseif (isset($item->snippet->thumbnails->medium->url)) {
            $url = $item->snippet->thumbnails->medium->url;
        } elseif (isset($item->snippet->thumbnails->default->url)) {
            $url = $item->snippet->thumbnails->default->url;
        } elseif (isset($item->snippet->thumbnails->high->url)) {
            $url = $item->snippet->thumbnails->high->url;
        } else {
            $url = EMBEDPRESS_URL_ASSETS. 'images/youtube/deleted-video-thumb.png';
        }
        return $url;
    }

    public function compare_vid_date($a, $b) {
        if ($a->snippet->publishedAt == $b->snippet->publishedAt) {
            return 0;
        }
        return ($a->snippet->publishedAt > $b->snippet->publishedAt) ? -1 : 1;
    }

    public function clean_api_error($raw_message) {
        return htmlspecialchars(strip_tags(preg_replace('@&key=[^& ]+@i', '&key=*******', $raw_message)));
    }

    public function clean_api_error_html($raw_message) {
        $clean_html = '';
        if ((defined('REST_REQUEST') && REST_REQUEST) || current_user_can('manage_options')) {
            $clean_html = '<div>' . __('EmbedPress: ', 'embedpress') . $this->clean_api_error($raw_message) . '</div>';
        }
        return $clean_html;
    }

    /** inline {@inheritdoc} */
    public function getFakeResponse() {        
        preg_match('~v=([a-z0-9_\-]+)~i', (string) $this->url, $matches);

        $embedUrl = 'https://www.youtube.com/embed/' . $matches['1'] . '?feature=oembed';

        $attr = [];
        $attr[] = 'width="{width}"';
        $attr[] = 'height="{height}"';
        $attr[] = 'src="' . esc_url($embedUrl) . '"';
        $attr[] = 'frameborder="0"';
        $attr[] = 'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"';
        $attr[] = 'allowfullscreen';

        return [
            'type' => 'video',
            'provider_name' => 'Youtube',
            'provider_url' => 'https://www.youtube.com',
            'title' => 'Unknown title',
            'html' => '<iframe ' . implode(' ', $attr) . '></iframe>',
        ];
    }

    // public $num = 0;



    public $x = 0;

    public function styles($params, $url){

        $uniqid = '.ose-youtube.ose-uid-'.md5($url);

        ob_start();
        ?>
        <style>
        
        <?php
        $attributes_data = $params;

        $is_pagination = 'flex';

        $gap = '30';
        $columns = '';

        if (isset($attributes_data['ispagination']) && $attributes_data['ispagination']) {
            $is_pagination = 'none';
        }
        if(isset($attributes_data['gapbetweenvideos'])){
            $gap = $attributes_data['gapbetweenvideos'];
        }
        if(isset($attributes_data['columns'])){
            $columns = $attributes_data['columns'];
        }


        if(!empty($columns) && (int) $columns > 0){
            $repeatCol = 'repeat(auto-fit, minmax('.esc_html('calc('.(100 / (int) $columns).'% - '.$gap.'px)').', 1fr))';
        }
        else{
            $repeatCol = 'repeat(auto-fit, minmax(calc(250px - '.$gap.'px), 1fr))';
        }

        ?>
        <?php echo esc_attr($uniqid); ?> .ep-youtube__content__block .youtube__content__body .content__wrap:not(.youtube-carousel) {
            gap: <?php echo esc_html($gap); ?>px !important;
            margin-top: <?php echo esc_html($gap); ?>px !important;
            grid-template-columns: <?php echo $repeatCol; ?>;
        }
        <?php echo esc_attr($uniqid); ?> .ep-youtube__content__block .ep-youtube__content__pagination {
            display: <?php echo esc_html($is_pagination); ?>!important;
        }

        <?php echo esc_attr($uniqid); ?> .layout-list .ep-youtube__content__block .youtube__content__body .content__wrap{
            grid-template-columns: repeat(auto-fit, minmax(calc(100% - 30px), 1fr))!important;
        }

        @media (max-width: 420px) {
            <?php echo esc_attr($uniqid); ?> .ep-youtube__content__block .youtube__content__body .content__wrap:not(.youtube-carousel) {
                gap: 30px !important;
            }
        }

        <?php
            if($is_pagination){
                echo esc_attr($uniqid) ?> {
                    height: 100%!important;
                }
                <?php
            }
        ?>
        </style>
        <?php
        return ob_get_clean();
    }
}
