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
    public function validateUrl(Url $url) {
        return (bool) (preg_match('~(v=(?:[a-z0-9_\-]+))|(\/channel\/|\/c\/)~i', (string) $url));
    }

    /** inline {@inheritdoc} */
    public function normalizeUrl(Url $url) {
        if (preg_match('~(?:v=|youtu\.be/|youtube\.com/embed/)([a-z0-9_\-]+)~i', (string) $url, $matches)) {
            $url->overwrite('https://www.youtube.com/watch?v=' . $matches[1]);
        }

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
        preg_match('~\/(channel|c)\/([a-zA-Z0-9\-]{1,})~i', (string) $url, $matches);
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
        if ($this->isChannel() && self::get_api_key()) {
            $channel = $this->getChannel();
            $params = [
                'part' => 'contentDetails,snippet',
                'key'  => self::get_api_key(),
            ];
            if ($channel['type'] == 'c') {
                $params['forUsername'] = $channel['id'];
            } else {
                $params['id'] = $channel['id'];
            }
            return $params;
        }
        return parent::getParams();
    }

    /** inline {@inheritdoc} */
    public function modifyResponse(array $response = []) {
        if (!empty($response["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"])) {
            $the_playlist_id = $response["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"];
            $rel = 'https://www.youtube.com/embed?listType=playlist&list=' . esc_attr($the_playlist_id);
            $gallery = self::get_gallery_page(['playlistId' => $the_playlist_id]);
            $main_iframe = "";
            if (!self::gdpr_mode()) {
                if (!empty($gallery->first_vid)) {
                    $rel = "https://www.youtube.com/embed/{$gallery->first_vid}?feature=oembed";
                }
                $main_iframe = "<iframe width='640' height='360' src='$rel' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen title='{$gallery->title}'></iframe>";
            } else {
                $main_iframe = "
                    <div class='ep-gdrp-content'>
                        <p><strong>Please accept YouTube cookies to play this video</strong>. By accepting you will be accessing content from YouTube, a service provided by an external third party.</p>
                        <p><a href='#'>YouTube privacy policy</a></p>
                        <p>If you accept this notice, your choice will be saved and the page will refresh.</p>
                        <button>Accept YouTube Content</button>
                    </div>
                ";
            }

            $scripts = self::scripts($gallery->transient_key);
            $styles = self::styles();

            return [
                "title"         => $gallery->title,
                "type"          => "video",
                "provider_name" => "YouTube",
                "provider_url"  => "https://www.youtube.com/",
                "html"          => "<div id='{$gallery->transient_key}' class='ep-player-wrap'>$main_iframe {$gallery->html} $styles $scripts</div>",
            ];
        } elseif ($this->isChannel() && empty(self::get_api_key()) && current_user_can('manage_options')) {
            return [
                "title"         => "",
                "type"          => "video",
                "provider_name" => "YouTube",
                "provider_url"  => "https://www.youtube.com/",
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
        $gallobj = new \stdClass();
        $gallobj->title = '';
        $options = wp_parse_args($options, [
            'playlistId'        => '',
            'pageToken'         => '',
            'pageSize'          => 12,
            'columns'           => 3,
            'showTitle'         => true,
            'showPaging'        => '',
            'autonext'          => '',
            'thumbplay'         => '',
            'thumbnail_quality' => 'default',
            'apiKey'            => self::get_api_key(),
            'opt_gallery_hideprivate'  => '',
        ]);

        if (empty($options['apiKey'])) {
            $gallobj->html = '<div>' . __('Please enter your YouTube API key to embed galleries.', 'embedpress') . '</div>';
            return $gallobj;
        }

        $apiEndpoint = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,status&playlistId=' . $options['playlistId']
            . '&maxResults=' . $options['pageSize']
            . '&key=' . $options['apiKey'];
        if ($options['pageToken'] != null) {
            $apiEndpoint .= '&pageToken=' . $options['pageToken'];
        }

        $transient_key = 'ep_embed_youtube_channel_' . md5($apiEndpoint);
        $jsonResult = get_transient($transient_key);
        if (empty($jsonResult)) {
            $apiResult = wp_remote_get($apiEndpoint, array('timeout' => self::$curltimeout));
            if (is_wp_error($apiResult)) {
                $gallobj->html = self::clean_api_error_html($apiResult->get_error_message(), true);
                return $gallobj;
            }
            $jsonResult = json_decode($apiResult['body']);
            if (empty($jsonResult->error)) {
                set_transient($transient_key, $jsonResult, HOUR_IN_SECONDS);
            }
        }

        // print_r($jsonResult);die;

        if (isset($jsonResult->error)) {
            if (isset($jsonResult->error->message)) {
                $gallobj->html = self::clean_api_error_html($jsonResult->error->message, true);
                return $gallobj;
            }
            $gallobj->html = '<div>Sorry, there may be an issue with your YouTube API key.</div>';
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
?>
        <?php


        ob_start();
        if (!empty($jsonResult->items) && is_array($jsonResult->items)) :
            if (strpos($options['playlistId'], 'UU') === 0) {
                // sort only channels
                usort($jsonResult->items, array(get_class(), 'compare_vid_date')); // sorts in place
            }
        ?>
            <div class="ep-youtube__contnet__block">
                <div class="youtube__content__body">
                    <div class="content__wrap ep-col-<?php echo intval(!empty($options['columns']) ? $options['columns'] : 3); ?>">
                        <?php foreach ($jsonResult->items as $item) : ?>
                            <?php
                            $privacyStatus = isset($item->status->privacyStatus) ? $item->status->privacyStatus : null;
                            $thumbnail = self::get_thumbnail_url($item, $options['thumbnail_quality'], $privacyStatus);

                            $vid = isset($item->snippet->resourceId->videoId) ? $item->snippet->resourceId->videoId : null;
                            $vid = $vid ? $vid : (isset($item->id->videoId) ? $item->id->videoId : null);
                            $vid = $vid ? $vid : (isset($item->id) ? $item->id : null);
                            if (empty($gallobj->first_vid)) {
                                $gallobj->first_vid = $vid;
                                $gallobj->title = isset($item->snippet->title) ? $item->snippet->title : '';
                            }
                            if ($privacyStatus == 'private' && $options['opt_gallery_hideprivate']) {
                                continue;
                            }
                            ?>
                            <div class="item" data-vid="<?php echo $vid; ?>">
                                <div class="thumb" style="background: <?php echo self::gdpr_mode() ? '#222' : "url({$thumbnail}) no-repeat center"; ?>">
                                    <div class="play-icon">
                                        <img src="<?php echo EMBEDPRESS_URL_ASSETS . '/images/youtube/youtube-play.png'; ?>" alt="">
                                    </div>
                                </div>
                                <?php if ($options['showTitle']) : ?>
                                    <div class="body">
                                        <p><?php echo $item->snippet->title; ?></p>
                                    </div>
                                <?php endif; ?>
                            </div>
                        <?php endforeach; ?>
                    </div>
                    <div class="ep-youtube__content__pagination">
                        <div class="ep-prev <?php echo empty($prevPageToken) ? ' hide ' : ''; ?>" data-playlistid="<?php echo esc_attr($options['playlistId']) ?>" data-pagetoken="<?php echo esc_attr($prevPageToken) ?>" data-pagesize="<?php echo intval($options['pageSize']) ?>" data-epcolumns="<?php echo intval($options['columns']) ?>" data-showtitle="<?php echo intval($options['showTitle']) ?>" data-showpaging="<?php echo intval($options['showPaging']) ?>" data-autonext="<?php echo intval($options['autonext']) ?>" data-thumbplay="<?php echo intval($options['thumbplay']) ?>">
                            <span><?php _e("Prev", "embedpress"); ?></span>
                        </div>
                        <div class="ep-page-numbers <?php echo $totalPages > 1 ? '' : 'hide'; ?>">
                            <span class="current-page">1</span>
                            <span class="page-separator">/</span>
                            <span class="total-page"><?php echo intval($totalPages); ?></span>
                        </div>
                        <div class="ep-next <?php echo empty($nextPageToken) ? ' hide ' : ''; ?>" data-playlistid="<?php echo esc_attr($options['playlistId']) ?>" data-pagetoken="<?php echo esc_attr($nextPageToken) ?>" data-pagesize="<?php echo intval($options['pageSize']) ?>" data-epcolumns="<?php echo intval($options['columns']) ?>" data-showtitle="<?php echo intval($options['showTitle']) ?>" data-showpaging="<?php echo intval($options['showPaging']) ?>" data-autonext="<?php echo intval($options['autonext']) ?>" data-thumbplay="<?php echo intval($options['thumbplay']) ?>">
                            <span><?php _e("Next", "embedpress"); ?></span>
                        </div>
                        <div class="ep-loader hide"><img alt="loading" src="<?php echo EMBEDPRESS_URL_ASSETS . 'images/youtube/gallery-page-loader.gif'; ?>"></div>
                    </div>
                </div>
            </div>
        <?php
        endif;
        $gallobj->html = ob_get_clean();
        $gallobj->transient_key = $transient_key;
        return $gallobj;
    }

    private static function scripts($id) {
        ob_start();
        ?>
        <script>
            (function() {
                function hasClass(ele, cls) {
                    return !!ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
                }

                function addClass(ele, cls) {
                    if (!hasClass(ele, cls)) ele.className += " " + cls;
                }

                function removeClass(ele, cls) {
                    if (hasClass(ele, cls)) {
                        var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
                        ele.className = ele.className.replace(reg, " ");
                    }
                }
                if (!Element.prototype.matches) {
                    Element.prototype.matches =
                        Element.prototype.matchesSelector ||
                        Element.prototype.webkitMatchesSelector ||
                        Element.prototype.mozMatchesSelector ||
                        Element.prototype.msMatchesSelector ||
                        Element.prototype.oMatchesSelector ||
                        function(s) {
                            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                                i = matches.length;
                            while (--i >= 0 && matches.item(i) !== this) {}
                            return i > -1;
                        };
                }
                var delegate = function(el, evt, sel, handler) {
                    el.addEventListener(evt, function(event) {
                        var t = event.target;
                        while (t && t !== this) {
                            if (t.matches(sel)) {
                                handler.call(t, event);
                            }
                            t = t.parentNode;
                        }
                    });
                };

                function sendRequest(url, postData, callback) {
                    var req = createXMLHTTPObject();
                    if (!req) return;
                    var method = postData ? "POST" : "GET";
                    req.open(method, url, true);
                    if (postData) {
                        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    }
                    req.onreadystatechange = function() {
                        if (req.readyState != 4) return;
                        if (req.status != 200 && req.status != 304) {
                            return;
                        }
                        callback(req);
                    };
                    if (req.readyState == 4) return;
                    req.send(postData);
                }

                var XMLHttpFactories = [
                    function() {
                        return new XMLHttpRequest();
                    },
                    function() {
                        return new ActiveXObject("Msxml3.XMLHTTP");
                    },
                    function() {
                        return new ActiveXObject("Msxml2.XMLHTTP.6.0");
                    },
                    function() {
                        return new ActiveXObject("Msxml2.XMLHTTP.3.0");
                    },
                    function() {
                        return new ActiveXObject("Msxml2.XMLHTTP");
                    },
                    function() {
                        return new ActiveXObject("Microsoft.XMLHTTP");
                    },
                ];

                function createXMLHTTPObject() {
                    var xmlhttp = false;
                    for (var i = 0; i < XMLHttpFactories.length; i++) {
                        try {
                            xmlhttp = XMLHttpFactories[i]();
                        } catch (e) {
                            continue;
                        }
                        break;
                    }
                    return xmlhttp;
                }
                var playerWrap = document.getElementById("<?php echo $id; ?>");
                if (playerWrap) {
                    delegate(playerWrap, "click", ".item", function(event) {
                        var embed = "https://www.youtube.com/embed/";
                        var vid = this.getAttribute("data-vid");
                        var iframe = playerWrap.getElementsByTagName("iframe");
                        if (vid && iframe) {
                            iframe[0].src = iframe[0].src.replace(/(.*\/embed\/)([^\?&"'>]+)(.+)?/, `\$1${vid}\$3`);
                        }
                    });
                    var currentPage = 1;
                    delegate(playerWrap, "click", ".ep-next, .ep-prev", function(event) {
                        var isNext = this.classList.contains("ep-next");
                        if (isNext) {
                            currentPage++;
                        } else {
                            currentPage--;
                        }
                        var data = {
                            action: "youtube_rest_api",
                            playlistid: this.getAttribute("data-playlistid"),
                            pagetoken: this.getAttribute("data-pagetoken"),
                            pagesize: this.getAttribute("data-pagesize"),
                            epcolumns: this.getAttribute("data-epcolumns"),
                            showtitle: this.getAttribute("data-showtitle"),
                            showpaging: this.getAttribute("data-showpaging"),
                            autonext: this.getAttribute("data-autonext"),
                            thumbplay: this.getAttribute("data-thumbplay"),
                        };

                        var formBody = [];
                        for (var property in data) {
                            var encodedKey = encodeURIComponent(property);
                            var encodedValue = encodeURIComponent(data[property]);
                            formBody.push(encodedKey + "=" + encodedValue);
                        }
                        formBody = formBody.join("&");
                        var loader = playerWrap.getElementsByClassName("ep-loader");
                        var galleryWrapper = playerWrap.getElementsByClassName(
                            "ep-youtube__contnet__block"
                        );
                        removeClass(loader[0], "hide");
                        addClass(galleryWrapper[0], "loading");
                        sendRequest("/wp-admin/admin-ajax.php", formBody, function(request) {
                            addClass(loader[0], "hide");
                            removeClass(galleryWrapper[0], "loading");

                            if (galleryWrapper && galleryWrapper[0] && request.responseText) {
                                var response = JSON.parse(request.responseText);
                                galleryWrapper[0].outerHTML = response.html;
                                var currentPageNode =
                                    galleryWrapper[0].getElementsByClassName("current-page");
                                if (currentPageNode && currentPageNode[0]) {
                                    currentPageNode[0].textContent = currentPage;
                                }
                            }
                        });
                    });
                }
            })();
        </script>
    <?php
        return ob_get_clean();
    }

    private static function styles() {
        ob_start();
    ?>
        <style>
            .ep-player-wrap .hide {
                display: none;
            }

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
                grid-template-columns: repeat(3, auto);
                gap: 30px;
            }

            .ep-youtube__contnet__block .content__wrap.ep-col-1 {
                grid-template-columns: repeat(1, auto);
            }

            .ep-youtube__contnet__block .content__wrap.ep-col-2 {
                grid-template-columns: repeat(2, auto);
            }

            .ep-youtube__contnet__block .content__wrap.ep-col-3 {
                grid-template-columns: repeat(3, auto);
            }

            .ep-youtube__contnet__block .content__wrap.ep-col-4 {
                grid-template-columns: repeat(4, auto);
            }

            .ep-youtube__contnet__block .content__wrap.ep-col-5 {
                grid-template-columns: repeat(5, auto);
            }

            .ep-youtube__contnet__block .content__wrap.ep-col-6 {
                grid-template-columns: repeat(6, auto);
            }

            .ep-youtube__contnet__block .content__wrap.ep-col-7 {
                grid-template-columns: repeat(7, auto);
            }

            .ep-youtube__contnet__block .content__wrap.ep-col-8 {
                grid-template-columns: repeat(8, auto);
            }

            .ep-youtube__contnet__block .content__wrap.ep-col-9 {
                grid-template-columns: repeat(9, auto);
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
    }
    public static function gdpr_mode() {
        return (bool) 0;
    }

    public static function get_thumbnail_url($item, $quality, $privacyStatus) {
        $url = "";
        if ($privacyStatus == 'private') {
            $url = EMBEDPRESS_URL_ASSETS . 'images/youtube/private.png';
        } elseif (isset($item->snippet->thumbnails->{$quality}->url)) {
            $url = $item->snippet->thumbnails->{$quality}->url;
        } elseif (isset($item->snippet->thumbnails->default->url)) {
            $url = $item->snippet->thumbnails->default->url;
        } elseif (isset($item->snippet->thumbnails->medium->url)) {
            $url = $item->snippet->thumbnails->medium->url;
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
        $clean_html = '<div>Sorry, there was a YouTube error.</div>';
        if (current_user_can('manage_options')) {
            $clean_html = '<div>Sorry, there was a YouTube API error: <em>' . self::clean_api_error($raw_message) . '</em></div>';
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
