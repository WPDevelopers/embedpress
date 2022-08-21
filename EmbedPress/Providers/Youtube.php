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
    protected $allowedParams = [ 'maxwidth', 'maxheight', 'pageSize', 'thumbnail', 'hideprivate' ];

    /** inline {@inheritdoc} */
    protected static $hosts = [
        'm.youtube.com', 'youtube.com', 'youtu.be',
    ];

    /** inline {@inheritdoc} */
    protected $httpsSupport = true;

    /** inline {@inheritdoc} */
    public function validateUrl(Url $url) {
        return (bool) (preg_match('~\/channel\/|\/c\/|\/user\/|(?:https?:\/\/)?(?:www\.)?(?:youtube.com\/)(\w+)[^?\/]*$~i', (string) $url));
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

    public function getChannel($url = null) {
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

    protected static function get_api_key() {
        $settings = (array) get_option(EMBEDPRESS_PLG_NAME . ':youtube', []);
        return !empty($settings['api_key']) ? $settings['api_key'] : '';
    }

    /** inline {@inheritdoc} */
    public function getParams() {
        $params = parent::getParams();
        if ($this->isChannel() && self::get_api_key()) {
            $channel        = $this->getChannel();
            $params['part'] = 'contentDetails,snippet';
            $params['key']  = self::get_api_key();
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
        if($this->isChannel()){
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

        $apiResult = wp_remote_get($channel_url, array('timeout' => self::$curltimeout));
        if (is_wp_error($apiResult)) {
            $result['html'] = self::clean_api_error_html($apiResult->get_error_message(), true);
            set_transient($transient_key, $result, 10);
            return $result;
        }
        $jsonResult = json_decode($apiResult['body']);

        if (isset($jsonResult->error)) {
            if (isset($jsonResult->error->message)) {
                $result['html'] = self::clean_api_error_html($jsonResult->error->message, true);
            }
            else{
                $result['html'] = __('<div>Sorry, there may be an issue with your YouTube API key.</div>', 'embedpress');
            }
            set_transient($transient_key, $result, MINUTE_IN_SECONDS);
            return $result;
        }
        elseif(!empty($jsonResult->items[0]->contentDetails->relatedPlaylists->uploads)){
            $result['playlistID'] = $jsonResult->items[0]->contentDetails->relatedPlaylists->uploads;
            $result['title'] = isset($jsonResult->items[0]->snippet->title) ? $jsonResult->items[0]->snippet->title : '';
            set_transient($transient_key, $result, DAY_IN_SECONDS);
        }

        //
        return $result;
    }

    public function getChannelIDbyUsername(){
        $url       = $this->getUrl();
        $apiResult = wp_remote_get($url, array('timeout' => self::$curltimeout));

        if (!is_wp_error($apiResult)) {
            $channel_html = $apiResult['body'];
            preg_match("/<meta\s+itemprop=[\"']channelId[\"']\s+content=[\"'](.*?)[\"']\/?>/", $channel_html, $matches);
            if(!empty($matches[1])){
                $url = "https://www.youtube.com/channel/{$matches[1]}";
                $this->url = $this->normalizeUrl(new Url($url));
            }
        }
    }

    /** inline {@inheritdoc} */
    public function getChannelGallery() {
        $response = [];
        $channel  = $this->getChannelPlaylist();
        if(!empty($channel['error'])){
            return $channel;
        }
        if (!empty($channel["playlistID"])) {
            $params          = $this->getParams();
            $the_playlist_id = $channel["playlistID"];
            $rel             = 'https://www.youtube.com/embed?listType=playlist&list=' . esc_attr($the_playlist_id);
            $gallery         = self::get_gallery_page([
                'pageSize'   => isset($params['pageSize']) ? $params['pageSize'] : 6,
                'playlistId' => $the_playlist_id,
            ]);
            $title           = $channel['title'];
            $main_iframe     = "";

            if (!empty($gallery->first_vid)) {
                $rel = "https://www.youtube.com/embed/{$gallery->first_vid}?feature=oembed";
                $main_iframe = "<iframe width='{$params['maxwidth']}' height='{$params['maxheight']}' src='$rel' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen title='{$title}'></iframe>";
            }
            return [
                "title"         => $title,
                "html"          => "<div class='ep-player-wrap'>$main_iframe {$gallery->html}</div>",
            ];
        }
        elseif ($this->isChannel() && empty(self::get_api_key()) && current_user_can('manage_options')) {
            return [
                "html"          => "<div class='ep-player-wrap'>" . __('Please enter your YouTube API key to embed galleries.', 'embedpress') . "</div>",
            ];
        }
        return $response;
    }

    /**
     * Undocumented function
     *
     * @param array $options
     * @return object
     */
    public static function get_gallery_page($options) {
        $nextPageToken = '';
        $prevPageToken = '';
        $gallobj       = new \stdClass();
        $options       = wp_parse_args($options, [
            'playlistId'  => '',
            'pageToken'   => '',
            'pageSize'    => 6,
            'columns'     => 2,
            'thumbnail'   => 'medium',
            'autonext'    => true,
            'thumbplay'   => true,
            'apiKey'      => self::get_api_key(),
            'hideprivate' => '',
        ]);

        if (empty($options['apiKey'])) {
            $gallobj->html = self::clean_api_error_html(__('Please enter your YouTube API key to embed galleries.', 'embedpress'));
            return $gallobj;
        }

        $apiEndpoint = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,status&playlistId=' . $options['playlistId']
            . '&maxResults=' . $options['pageSize']
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
                $gallobj->html = self::clean_api_error_html($apiResult->get_error_message(), true);
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

        // print_r($jsonResult);die;

        if (isset($jsonResult->error)) {
            if (isset($jsonResult->error->message)) {
                $gallobj->html = self::clean_api_error_html($jsonResult->error->message);
                return $gallobj;
            }
            $gallobj->html = self::clean_api_error_html(__('Sorry, there may be an issue with your YouTube API key.', 'embedpress'));
            return $gallobj;
        }


        $resultsPerPage = $options['pageSize']; // $jsonResult->pageInfo->resultsPerPage;
        $totalResults = $jsonResult->pageInfo->totalResults;
        $totalPages = ceil($totalResults / $resultsPerPage);
        if (isset($jsonResult->nextPageToken)) {
            $nextPageToken = $jsonResult->nextPageToken;
        }

        if (isset($jsonResult->prevPageToken)) {
            $prevPageToken = $jsonResult->prevPageToken;
        }

        ob_start();
        if (!empty($jsonResult->items) && is_array($jsonResult->items)) :
            if (strpos($options['playlistId'], 'UU') === 0) {
                // sort only channels
                usort($jsonResult->items, array(get_class(), 'compare_vid_date')); // sorts in place
            }
        ?>
            <div class="ep-youtube__contnet__block">
                <div class="youtube__content__body">
                    <div class="content__wrap">
                        <?php foreach ($jsonResult->items as $item) : ?>
                            <?php
                            $privacyStatus = isset($item->status->privacyStatus) ? $item->status->privacyStatus : null;
                            $thumbnail = self::get_thumbnail_url($item, $options['thumbnail'], $privacyStatus);

                            $vid = isset($item->snippet->resourceId->videoId) ? $item->snippet->resourceId->videoId : null;
                            $vid = $vid ? $vid : (isset($item->id->videoId) ? $item->id->videoId : null);
                            $vid = $vid ? $vid : (isset($item->id) ? $item->id : null);
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
                                        <img src="<?php echo EMBEDPRESS_URL_ASSETS . 'images/youtube/youtube-play.png'; ?>" alt="">
                                    </div>
                                </div>
                                <div class="body">
                                    <p><?php echo $item->snippet->title; ?></p>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                    <div class="ep-youtube__content__pagination">
                        <div
                            class="ep-prev <?php echo empty($prevPageToken) ? ' hide ' : ''; ?>"
                            data-playlistid="<?php echo esc_attr($options['playlistId']) ?>"
                            data-pagetoken="<?php echo esc_attr($prevPageToken) ?>"
                            data-pagesize="<?php echo intval($options['pageSize']) ?>"
                        >
                            <span><?php _e("Prev", "embedpress"); ?></span>
                        </div>
                        <div class="ep-page-numbers <?php echo $totalPages > 1 ? '' : 'hide'; ?>">
                            <span class="current-page">1</span>
                            <span class="page-separator">/</span>
                            <span class="total-page"><?php echo intval($totalPages); ?></span>
                        </div>
                        <div
                            class="ep-next <?php echo empty($nextPageToken) ? ' hide ' : ''; ?>"
                            data-playlistid="<?php echo esc_attr($options['playlistId']) ?>"
                            data-pagetoken="<?php echo esc_attr($nextPageToken) ?>"
                            data-pagesize="<?php echo intval($options['pageSize']) ?>"
                        >
                            <span><?php _e("Next", "embedpress"); ?></span>
                        </div>
                    </div>
                    <div class="ep-loader-wrap">
                        <div class="ep-loader"><img alt="loading" src="<?php echo EMBEDPRESS_URL_ASSETS . 'images/youtube/spin.gif'; ?>"></div>
                    </div>

                </div>
            </div>
        <?php
        else:
            echo __("There is nothing on the playlist.", 'embedpress');
        endif;
        $gallobj->html = ob_get_clean();
        return $gallobj;
    }

    public static function get_thumbnail_url($item, $quality, $privacyStatus) {
        $url = "";
        if ($privacyStatus == 'private') {
            $url = EMBEDPRESS_URL_ASSETS . 'images/youtube/private.png';
        } elseif (isset($item->snippet->thumbnails->{$quality}->url)) {
            $url = $item->snippet->thumbnails->{$quality}->url;
        } elseif (isset($item->snippet->thumbnails->medium->url)) {
            $url = $item->snippet->thumbnails->medium->url;
        } elseif (isset($item->snippet->thumbnails->default->url)) {
            $url = $item->snippet->thumbnails->default->url;
        } elseif (isset($item->snippet->thumbnails->high->url)) {
            $url = $item->snippet->thumbnails->high->url;
        } else {
            $url = EMBEDPRESS_URL_ASSETS . 'images/youtube/deleted-video-thumb.png';
        }
        return $url;
    }

    public static function compare_vid_date($a, $b) {
        if ($a->snippet->publishedAt == $b->snippet->publishedAt) {
            return 0;
        }
        return ($a->snippet->publishedAt > $b->snippet->publishedAt) ? -1 : 1;
    }

    public static function clean_api_error($raw_message) {
        return htmlspecialchars(strip_tags(preg_replace('@&key=[^& ]+@i', '&key=*******', $raw_message)));
    }

    public static function clean_api_error_html($raw_message) {
        $clean_html = '';
        if (current_user_can('manage_options')) {
            $clean_html = '<div>' . sprintf(__('Sorry, there was a YouTube API error: <em>%s</em>', 'embedpress'), self::clean_api_error($raw_message)) . '</div>';
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
        $attr[] = 'src="' . $embedUrl . '"';
        $attr[] = 'frameborder="0"';
        $attr[] = 'allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"';
        $attr[] = 'allowfullscreen';

        return [
            'type' => 'video',
            'provider_name' => 'Youtube',
            'provider_url' => 'https://www.youtube.com',
            'title' => 'Unknown title',
            'html' => '<iframe ' . implode(' ', $attr) . '></iframe>',
        ];
    }
}
