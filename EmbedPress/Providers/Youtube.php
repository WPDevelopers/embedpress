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
    protected $allowedParams = [ 'maxwidth', 'maxheight', 'pagesize', 'thumbnail', 'gallery', 'hideprivate', 'columns', 'ispagination', 'gapbetweenvideos', 'ytChannelLayout' ];

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
        return (bool) (preg_match('~\/channel\/|\/c\/|\/user\/|\/@\w+|(?:https?:\/\/)?(?:www\.)?(?:youtube.com\/)(\w+)[^?\/]*$~i', (string) $url));
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
                if(!empty($this->get_youtube_handler($this->url))){
                    if(!empty($this->get_channel_id_by_handler($this->get_youtube_handler($this->url)))){
                        $channelId = $this->get_channel_id_by_handler($this->get_youtube_handler($this->url));
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

            if(!empty($matches[1])){
                $channelId = $matches[1];
            }
        
            if(!empty($this->get_youtube_handler($this->url))){
                if(!empty($this->get_channel_id_by_handler($this->get_youtube_handler($this->url)))){
                    $channelId = $this->get_channel_id_by_handler($this->get_youtube_handler($this->url));
                }
            }



            $embedUrl = 'https://www.youtube.com/embed/live_stream?channel='.$channelId.'&feature=oembed';

            $attr = [];
            $attr[] = 'width="'.esc_attr($params['maxheight']).'"';
            $attr[] = 'height="'.esc_attr($params['maxheight']).'";';
            $attr[] = 'src="' . esc_url($embedUrl) . '"';
            $attr[] = 'frameborder="0"';
            $attr[] = 'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"';
            $attr[] = 'allowfullscreen';

            $results['html'] = '<iframe ' . implode(' ', $attr) . '></iframe>';
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
        // preg_match('/^https:\/\/www.youtube.com\/@(.+)\/live$/i', $url, $matches);
        preg_match('/^https:\/\/www.youtube.com\/@([^\/?]+)/i', $url, $matches);


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
    
        if (false === $channel_id) {
            $ch = curl_init();
    
            $channel_handle = "https://www.youtube.com/@{$handle}";
    
            curl_setopt($ch, CURLOPT_URL, $channel_handle);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    
            $response = curl_exec($ch);
    
            if (curl_errno($ch)) {
                return 'cURL error: ' . curl_error($ch);
            }
    
            curl_close($ch);
    
            $pattern = '/(<link rel="canonical" href="https:\/\/www\.youtube\.com\/channel\/)(.{1,50})(">)/';
            if (preg_match($pattern, $response, $matches)) {
                $channel_id = $matches[2];
                set_transient($transient_key, $channel_id, 30 * DAY_IN_SECONDS);

                return $channel_id;
            } else {
                return "Not a channel URL";
            }
        } else {
            return $channel_id;
        }
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
            $params          = $this->getParams();
            $the_playlist_id = $channel["playlistID"];
            $rel             = 'https://www.youtube.com/embed?listType=playlist&list=' . esc_attr($the_playlist_id);
            $title           = $channel['title'];
            $main_iframe     = "";
            $gallery_args    = [
                'playlistId' => $the_playlist_id,
            ];
            if(!empty($params['pagesize'])){
                $gallery_args['pagesize'] = $params['pagesize'];
            }

            $layout_data = $this->layout_data();

            
            // $gallery         = $this->get_gallery_page($gallery_args);

            $channel_layout = 'layout-gallery';

            $gallery  = YoutubeLayout::create_youtube_layout($gallery_args, $layout_data, $channel_layout, $this->url);

            if(isset($params['ytChannelLayout'])){
                if($params['ytChannelLayout'] === 'gallery'){
                    $channel_layout = 'layout-gallery';

                }
                else if($params['ytChannelLayout'] === 'grid'){
                    $channel_layout = 'layout-grid';
                }
                else if($params['ytChannelLayout'] === 'list'){
                    $channel_layout = 'layout-list';

                }
                else if($params['ytChannelLayout'] === 'carousel'){
                    $channel_layout = 'layout-carousel';

                }



                $gallery  = YoutubeLayout::create_youtube_layout($gallery_args, $layout_data, $params['ytChannelLayout'], $this->url);

            }

            $main_iframe = '';
            if (!empty($gallery->first_vid) && empty($params['ytChannelLayout']) || $params['ytChannelLayout'] === 'gallery') {
                $rel = "https://www.youtube.com/embed/{$gallery->first_vid}?feature=oembed";
                $main_iframe = "<div class='ep-first-video'><iframe width='{$params['maxwidth']}' height='{$params['maxheight']}' src='$rel' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen title='{$title}'></iframe></div>";
            }

            if (!apply_filters('embedpress/is_allow_rander', false) && isset($params['ytChannelLayout']) && ($params['ytChannelLayout'] == 'grid' || $params['ytChannelLayout'] == 'carousel')) {
                return [];
            }            

            if ($gallery->html) {
                $styles = $this->styles($params, $this->getUrl());
                $html_content = $main_iframe . $gallery->html . ' ' . $styles;

                if ($this->validateTYLiveUrl($this->getUrl())) {
                    return [
                        "title" => $title,
                        "html"  => "<div class='ep-player-wrap'>$main_iframe $styles</div>",
                    ];
                }

                return [
                    "title" => $title,
                    "html"  => "<div class='ep-player-wrap $channel_layout'>$html_content</div>",
                ];
            }

        }
        elseif ($this->isChannel() && empty($this->get_api_key()) && current_user_can('manage_options')) {
            return [
                "html"          => "<div class='ep-player-wrap'>" . __('Please enter your YouTube API key to embed YouTube Channel.', 'embedpress') . "</div>",
            ];
        }

        return $response;
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
                                        <img src="<?php echo esc_url(EMBEDPRESS_URL_ASSETS . 'images/youtube/youtube-play.png'); ?>" alt="">
                                    </div>
                                </div>
                                <div class="body">
                                    <p><?php echo $item->snippet->title; ?></p>
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
                        <div class="ep-loader"><img alt="loading" src="<?php echo esc_url(EMBEDPRESS_URL_ASSETS . 'images/youtube/spin.gif'); ?>"></div>
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
