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

namespace Embera\Provider;

use Embera\Url;

/**
 * youtube.com Provider
 * @link https://youtube.com
 * @link https://youtube-eng.googleblog.com/2009/10/oembed-support_9.html
 */
class Youtube extends ProviderAdapter implements ProviderInterface
{
    public static $curltimeout = 30;
    /** inline {@inheritdoc} */
    protected $endpoint = 'https://www.youtube.com/oembed?format=json&scheme=https';

    /** inline {@inheritdoc} */
    protected static $hosts = [
        'm.youtube.com', 'youtube.com', 'youtu.be',
    ];

    /** inline {@inheritdoc} */
    protected $httpsSupport = true;

    /** inline {@inheritdoc} */
    public function validateUrl(Url $url)
    {
        return (bool) (preg_match('~(v=(?:[a-z0-9_\-]+))|(\/channel\/|\/c\/)~i', (string) $url));
    }

    /** inline {@inheritdoc} */
    public function normalizeUrl(Url $url)
    {
        if (preg_match('~(?:v=|youtu\.be/|youtube\.com/embed/)([a-z0-9_\-]+)~i', (string) $url, $matches)) {
            $url->overwrite('https://www.youtube.com/watch?v=' . $matches[1]);
        }

        return $url;
    }

    public function isChannel($url = null){
        if(empty($url)){
            $url = $this->url;
        }
        $channel = $this->getChannel($url);
        return !empty($channel['id']);
    }

    public function getChannel($url = null){
        if(empty($url)){
            $url = $this->url;
        }
        preg_match('~\/(channel|c)\/([a-zA-Z0-9\-]{1,})~i', (string) $url, $matches);
        return [
            "type" => isset($matches[1]) ? $matches[1] : '',
            "id"   => isset($matches[2]) ? $matches[2] : '',
        ];
    }

    /** inline {@inheritdoc} */
    public function getEndpoint()
    {
        if($this->isChannel()){
            $apiEndpoint = 'https://www.googleapis.com/youtube/v3/channels';
            return $apiEndpoint;
        }
        return (string) $this->endpoint;
    }

    /** inline {@inheritdoc} */
    public function getParams()
    {
        if($this->isChannel()){
            $channel = $this->getChannel();
            $params = [
                'part' => 'contentDetails,snippet',
                'key'  => 'AIzaSyDS89wUFgzgDAIeJEUDfBc6bUZxzmtpIu4',
            ];
            if($channel['type'] == 'c'){
                $params['forUsername'] = $channel['id'];
            }
            else{
                $params['id'] = $channel['id'];
            }
            return $params;
        }
        return parent::getParams();
    }

    /** inline {@inheritdoc} */
    public function modifyResponse(array $response = [])
    {
        if(!empty($response["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"])){
            $the_playlist_id = $response["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"];
            $rel = 'https://www.youtube.com/embed?listType=playlist&list=' . esc_attr($the_playlist_id);
            $gallery = $this->get_gallery_page(['playlistId' => $the_playlist_id]);
            $main_iframe = "";
            if(!self::gdpr_mode()){
                $main_iframe = "<iframe width='640' height='360' src='$rel' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen title='WELCOME TO THE CLASSIC MR. BEAN CHANNEL'></iframe>";
            }
            else{
                $main_iframe = "
                    <div class='ep-gdrp-content'>
                        <p><strong>Please accept YouTube cookies to play this video</strong>. By accepting you will be accessing content from YouTube, a service provided by an external third party.</p>
                        <p><a href='#'>YouTube privacy policy</a></p>                        
                        <p>If you accept this notice, your choice will be saved and the page will refresh.</p>
                        <button>Accept YouTube Content</button>
                    </div>
                ";
            }
            return [
                "title"            => "WELCOME TO THE CLASSIC MR. BEAN CHANNEL",
                "author_name"      => "Classic Mr Bean",
                "author_url"       => "https://www.youtube.com/c/ClassicMrBean",
                "type"             => "video",
                "height"           => 360,
                "width"            => 640,
                "version"          => "1.0",
                "provider_name"    => "YouTube",
                "provider_url"     => "https://www.youtube.com/",
                "thumbnail_height" => 360,
                "thumbnail_width"  => 480,
                "thumbnail_url"    => "https://i.ytimg.com/vi/b0P8-_uRtmM/hqdefault.jpg",
                "html"             => "<div class='ep-player-wrap'>$main_iframe</div>" . $gallery,
            ];
        }
        return $response;
    }

    public function get_gallery_page($options)
    {
        $gallobj = new \stdClass();
        $options = wp_parse_args($options, [
            'playlistId' => '',
            'pageToken'  => '',
            'pageSize'   => 50,
            'columns'    => 3,
            'showTitle'  => '',
            'showPaging' => '',
            'autonext'   => '',
            'thumbplay'  => '',
            'apiKey'     => 'AIzaSyDS89wUFgzgDAIeJEUDfBc6bUZxzmtpIu4',

            'opt_debugmode'  => '',
            'opt_gallery_hideprivate'  => '',
            'opt_gallery_customarrows'  => '',
            'opt_gallery_customprev'  => '',
            'opt_gallery_customnext'  => '',

        ]);

        // if (empty($options['apiKey']))
        // {
        //     $gallobj->html = '<div>Please enter your YouTube API key to embed galleries.</div>';
        //     return $gallobj;
        // }

        $apiEndpoint = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,status&playlistId=' . $options['playlistId']
                . '&maxResults=' . $options['pageSize']
                . '&key=' . $options['apiKey'];
        if ($options['pageToken'] != null)
        {
            $apiEndpoint .= '&pageToken=' . $options['pageToken'];
        }

        $code = '';
        $init_id = null;

        $apiResult = wp_remote_get($apiEndpoint, array('timeout' => self::$curltimeout));

        if (is_wp_error($apiResult))
        {
            $gallobj->html = self::clean_api_error_html($apiResult->get_error_message(), true);
            return $gallobj;
        }

        if ($options['opt_debugmode'] == 1 && current_user_can('manage_options'))
        {
            $redactedEndpoint = preg_replace('@&key=[^&]+@i', '&key=PRIVATE', $apiEndpoint);
            $active_plugins = get_option('active_plugins');
            $gallobj->html = '<pre onclick="_EPADashboard_.selectText(this);" class="epyt-debug">CLICK this debug text to auto-select all. Then, COPY the selection.' . "\n\n" .
                    'THIS IS DEBUG MODE OUTPUT. UNCHECK THE OPTION IN THE SETTINGS PAGE ONCE YOU ARE DONE DEBUGGING TO PUT THINGS BACK TO NORMAL.' . "\n\n" . $redactedEndpoint . "\n\n" . print_r($apiResult, true) . "\n\nActive Plugins\n\n" . print_r($active_plugins, true) . '</pre>';
            return $gallobj;
        }
        ob_start();

        $jsonResult = json_decode($apiResult['body']);
//        print_r($jsonResult);
//        die;

        ?>
        <?php  ?>
        <div class="ep-youtube__contnet__block">
            <div class="youtube__content__body">
                <div class="content__wrap">
                    <?php foreach ($jsonResult->items as $item){?>

                        <div class="item">
                            <div class="thumb" style="background: <?php echo self::gdpr_mode() ? '#222' : "url({$item->snippet->thumbnails->medium->url}) no-repeat center";?>">
                                <div class="play-icon">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/2560px-YouTube_full-color_icon_%282017%29.svg.png" alt="">
                                </div>
                            </div>
                            <div class="body">
                                <p><?php echo $item->snippet->title;?></p>
                            </div>
                        </div>

                    <?php } ?>
                </div>
                <div class="ep-youtube__content__pagination">
                    <div class="ep-prev">
                        <span>Prev</span>
                    </div>
                    <div class="ep-page-numbers">
                        <span class="current-page">3</span>
                        <span class="page-separator">/</span>
                        <span class="total-page">6</span>
                    </div>
                    <div class="ep-next">
                        <span>Next</span>
                    </div>
                </div>
            </div>
        </div>


        <style>
            .ep-gdrp-content {
                background: #222;
                padding: 50px 30px;
                color: #fff;
            }
            .ep-gdrp-content a {
                color: #fff;
            }
            .ep-youtube__content__pagination {
                display: flex;
                justify-content: center;
                align-content: center;
                margin-top: 30px;
                gap: 15px;
            }
            .ep-youtube__content__pagination .ep-prev,
            .ep-youtube__content__pagination .ep-next {
                cursor: pointer;
            }

            .ep-youtube__contnet__block .youtube__content__body .content__wrap {
                margin-top: 30px;
                display: grid;
                grid-template-columns: repeat(4, auto); /* column number */
                gap: 30px;
            }
            .ep-youtube__contnet__block .item {
                cursor: pointer;
            }

            .ep-youtube__contnet__block .item:hover .thumb .play-icon {
                opacity: 1;
                top: 50%;
            }
            .ep-youtube__contnet__block .item:hover .thumb:after {
                opacity: .4;
                z-index: 0;
            }
            .ep-youtube__contnet__block .thumb {
                padding-top: 56.25%;
                margin-bottom: 5px;
                position: relative;
                background: #222;
                background-size: contain !important;
            }

            .ep-youtube__contnet__block .thumb:after {
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 100%;
                content: '';
                background: #000;
                opacity: 0;
                transition: opacity .3s ease;
            }
            .ep-youtube__contnet__block .thumb:before {
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 100%;
                content: '';
                background: #222;
                z-index: -1;
            }
            .ep-youtube__contnet__block .thumb img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            .ep-youtube__contnet__block .thumb .play-icon {
                width: 50px;
                height: auto;
                position: absolute;
                top: 40%;
                left: 50%;
                transform: translate(-50%, -50%);
                opacity: 0;
                transition: all .3s ease;
                z-index: 2;
            }
            .ep-youtube__contnet__block .thumb .play-icon img {
                width: 100;
            }
            .ep-youtube__contnet__block .body p {
                margin-bottom: 0;
                font-size: 18px;
                font-weight: 400;
            }

        </style>



        <?php
        return ob_get_clean();


//
        if (isset($jsonResult->error))
        {
            if (isset($jsonResult->error->message))
            {
                $gallobj->html = self::clean_api_error_html($jsonResult->error->message, true);
                return $gallobj;
            }
            $gallobj->html = '<div>Sorry, there may be an issue with your YouTube API key.</div>';
            return $gallobj;
        }



        $resultsPerPage = $options['pageSize']; // $jsonResult->pageInfo->resultsPerPage;
        $totalResults = $jsonResult->pageInfo->totalResults;

        $nextPageToken = '';
        $prevPageToken = '';
        if (isset($jsonResult->nextPageToken))
        {
            $nextPageToken = $jsonResult->nextPageToken;
        }

        if (isset($jsonResult->prevPageToken))
        {
            $prevPageToken = $jsonResult->prevPageToken;
        }

        $cnt = 0;
        $colclass = ' epyt-cols-' . $options['columns'] . ' ';
        $code .= '<div class="epyt-gallery-allthumbs ' . $colclass . '">';

        if (isset($jsonResult->items) && $jsonResult->items != null && is_array($jsonResult->items))
        {
            if (strpos($options['playlistId'], 'UU') === 0)
            {
                // sort only channels
                usort($jsonResult->items, array(get_class(), 'compare_vid_date')); // sorts in place
            }

            foreach ($jsonResult->items as $item)
            {

                $thumb = new \stdClass();

                $thumb->id = isset($item->snippet->resourceId->videoId) ? $item->snippet->resourceId->videoId : null;
                $thumb->id = $thumb->id ? $thumb->id : $item->id->videoId;
                $thumb->title = $options['showTitle'] ? $item->snippet->title : '';
                $thumb->privacyStatus = isset($item->status->privacyStatus) ? $item->status->privacyStatus : null;

                if ($thumb->privacyStatus == 'private' && $options['opt_gallery_hideprivate'] == 1)
                {
                    continue;
                }

                if ($cnt == 0 && $options['pageToken'] == null)
                {
                    $init_id = $thumb->id;
                }

                if ($thumb->privacyStatus == 'private')
                {
                    $thumb->img = plugins_url('/images/private.png', __FILE__);
                    $thumb->quality = 'medium';
                }
                else
                {
                    if (isset($item->snippet->thumbnails->high->url))
                    {
                        $thumb->img = $item->snippet->thumbnails->high->url;
                        $thumb->quality = 'high';
                    }
                    elseif (isset($item->snippet->thumbnails->default->url))
                    {
                        $thumb->img = $item->snippet->thumbnails->default->url;
                        $thumb->quality = 'default';
                    }
                    elseif (isset($item->snippet->thumbnails->medium->url))
                    {
                        $thumb->img = $item->snippet->thumbnails->medium->url;
                        $thumb->quality = 'medium';
                    }
                    else
                    {
                        $thumb->img = plugins_url('/images/deleted-video-thumb.png', __FILE__);
                        $thumb->quality = 'medium';
                    }
                }

                $code .= self::get_thumbnail_html($thumb, $options);
                $cnt++;

                if ($cnt % $options['columns'] === 0)
                {
                    $code .= '<div class="epyt-gallery-rowbreak"></div>';
                }
            }
        }

        $code .= '<div class="epyt-gallery-clear"></div></div>';

        $totalPages = ceil($totalResults / $resultsPerPage);
        $pagination = '<div class="epyt-pagination ' . ($options['showPaging'] == 0 ? 'epyt-hide-pagination' : '') . '">';

        $txtprev = $options['opt_gallery_customarrows'] ? $options['opt_gallery_customprev'] : _('Prev');
        $pagination .= '<div tabindex="0" role="button" class="epyt-pagebutton epyt-prev ' . (empty($prevPageToken) ? ' hide ' : '') . '" data-playlistid="' . esc_attr($options['playlistId'])
                . '" data-pagesize="' . intval($options['pageSize'])
                . '" data-pagetoken="' . esc_attr($prevPageToken)
                . '" data-epcolumns="' . intval($options['columns'])
                . '" data-showtitle="' . intval($options['showTitle'])
                . '" data-showpaging="' . intval($options['showPaging'])
                . '" data-autonext="' . intval($options['autonext'])
                . '" data-thumbplay="' . intval($options['thumbplay'])
                . '"><div class="epyt-arrow">&laquo;</div> <div>' . $txtprev . '</div></div>';


        $pagination .= '<div class="epyt-pagenumbers ' . ($totalPages > 1 ? '' : 'hide') . '">';
        $pagination .= '<div class="epyt-current">1</div><div class="epyt-pageseparator"> / </div><div class="epyt-totalpages">' . $totalPages . '</div>';
        $pagination .= '</div>';

        $txtnext = $options['opt_gallery_customarrows'] ? $options['opt_gallery_customnext'] : _('Next');
        $pagination .= '<div tabindex="0" role="button" class="epyt-pagebutton epyt-next' . (empty($nextPageToken) ? ' hide ' : '') . '" data-playlistid="' . esc_attr($options['playlistId'])
                . '" data-pagesize="' . intval($options['pageSize'])
                . '" data-pagetoken="' . esc_attr($nextPageToken)
                . '" data-epcolumns="' . intval($options['columns'])
                . '" data-showtitle="' . intval($options['showTitle'])
                . '" data-showpaging="' . intval($options['showPaging'])
                . '" data-autonext="' . intval($options['autonext'])
                . '" data-thumbplay="' . intval($options['thumbplay'])
                . '"><div>' . $txtnext . '</div> <div class="epyt-arrow">&raquo;</div></div>';

        $pagination .= '<div class="epyt-loader"><img alt="loading" width="16" height="11" src="' . plugins_url('images/gallery-page-loader.gif', __FILE__) . '"></div>';
        $pagination .= '</div>';

//        if ($options['showPaging'] == 0)
//        {
//            $pagination = '<div class="epyt-pagination"></div>';
//        }
        $code = $pagination . $code . $pagination;
        $gallobj->html = $code;
        $gallobj->init_id = $init_id;
        return $gallobj;
    }

    public static function gdpr_mode()
    {
        return (bool) 0;
    }

    public static function get_thumbnail_html($thumb, $options)
    {
        $escId = esc_attr($thumb->id);
        $code = '';
        $code .= '<div tabindex="0" role="button" data-videoid="' . $escId . '" class="epyt-gallery-thumb">';

        $code .= (self::gdpr_mode() ? '<div class="epyt-gallery-img-box"><div class="epyt-gallery-img epyt-gallery-img-gdpr">' :
                        '<div class="epyt-gallery-img-box"><div class="epyt-gallery-img" style="background-image: url(' . esc_attr($thumb->img) . ')">') .
                '<div class="epyt-gallery-playhover"><img alt="play" class="epyt-play-img" width="30" height="23" src="' . plugins_url('images/playhover.png', __FILE__) . '" data-no-lazy="1" data-skipgform_ajax_framebjll="" /><div class="epyt-gallery-playcrutch"></div></div>' .
                '</div></div>';


        if (!empty($thumb->title))
        {
            $code .= '<div class="epyt-gallery-title">' . esc_html($thumb->title) . '</div>';
        }
        else
        {
            $code .= '<div class="epyt-gallery-notitle"><span>' . esc_html($thumb->title) . '</span></div>';
        }
        $code .= '</div>';
        return $code;
    }

    public static function compare_vid_date($a, $b)
    {
        if ($a->snippet->publishedAt == $b->snippet->publishedAt)
        {
            return 0;
        }
        return ($a->snippet->publishedAt > $b->snippet->publishedAt) ? -1 : 1;
    }

    public static function clean_api_error($raw_message)
    {
        return htmlspecialchars(strip_tags(preg_replace('@&key=[^& ]+@i', '&key=*******', $raw_message)));
    }

    public static function clean_api_error_html($raw_message, $add_boilerplate)
    {
        $clean_html = '<div>Sorry, there was a YouTube error.</div>';
        if (current_user_can('manage_options'))
        {
            $clean_html = '<div>Sorry, there was a YouTube API error: <em>' . self::clean_api_error($raw_message) . '</em>' .
                    ( $add_boilerplate ? self::$boilerplate_api_error_message : '' ) .
                    '</div>';
        }
        return $clean_html;
    }

    /** inline {@inheritdoc} */
    public function getFakeResponse()
    {
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
            'html' => '<iframe ' . implode(' ', $attr). '></iframe>',
        ];
    }

}
