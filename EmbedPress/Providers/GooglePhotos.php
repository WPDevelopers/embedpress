<?php

namespace EmbedPress\Providers;

use Embera\Provider\ProviderAdapter;
use Embera\Provider\ProviderInterface;
use Embera\Url;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

class GooglePhotos extends ProviderAdapter implements ProviderInterface
{
    protected static $hosts = ["photos.app.goo.gl", "photos.google.com"];
    private $player_js = "https://cdn.jsdelivr.net/npm/publicalbum@latest/embed-ui.min.js";
    private $min_expiration = 3600;
    private $allowed_url_patttern = "/^https:\/\/photos\.app\.goo\.gl\/|^https:\/\/photos\.google\.com\/share\//";
    static public $name = "google-photos-album";

    /** @var array Array with allowed params for the current Provider */
    protected $allowedParams = [
        'mode',
        'maxwidth',
        'maxheight',
        'imageWidth',
        'imageHeight',
        'playerAutoplay',
        'delay',
        'repeat',
        'mediaitemsAspectRatio',
        'mediaitemsEnlarge',
        'mediaitemsStretch',
        'mediaitemsCover',
        'backgroundColor',
        'expiration',
    ];


    /** inline {@inheritdoc} */
    protected $httpsSupport = true;

    public function getAllowedParams()
    {
        return $this->allowedParams;
    }

    public function __construct($url, array $config = [])
    {
        parent::__construct($url, $config);
    }

    public function validateUrl(Url $url)
    {
        return preg_match('~^https:\/\/(photos\.app\.goo\.gl|photos\.google\.com)\/.*$~i', (string) $url);
    }

    public function get_embeded_content($link, $width = 0, $height = 480, $imageWidth = 1920, $imageHeight = 1080, $expiration = 0, $mode = 'gallery-player', $playerAutoplay = false, $delay = 5, $repeat = true, $aspectRatio = true, $enlarge = true, $stretch = true, $cover = false, $backgroundColor = '#000000')
    {
        if (is_object($link)) {
            return $this->get_html($link, $expiration);
        }



        $props = $this->create_default_attr();
        $props->link = $link;
        $props->width = $width;
        $props->height = $height;
        $props->imageWidth = $imageWidth;
        $props->imageHeight = $imageHeight;
        $props->mode = $mode;
        $props->slideshowAutoplay = $playerAutoplay;
        $props->slideshowDelay = $delay;
        $props->repeat = $repeat;
        $props->mediaitemsAspectRatio = $aspectRatio;
        $props->mediaitemsEnlarge = $enlarge;
        $props->mediaitemsStretch = $stretch;
        $props->mediaitemsCover = $cover;
        $props->backgroundColor = $backgroundColor;

        return $this->get_html($props, $expiration);
    }

    private function get_html($props, $expiration = 0)
    {


        // Generate a hash from the $props object for uniqueness
        $props_hash = md5(serialize($props));
        $url_hash = md5($props->link);
        $transient = sprintf('%s-%s-%s', self::$name, $url_hash, $props_hash);

        $html = get_transient($transient);
        if ($html) {
            return $html;
        }

        $html = $this->get_embed_google_photos_html($props);
        if ($html) {
            $expiration = $expiration > 0 ? $expiration : $this->min_expiration;
            set_transient($transient, $html, $expiration);
            return $html;
        }

        return null;
    }


    private function get_remote_contents($url)
    {
        if (preg_match($this->allowed_url_patttern, $url)) {
            $response = wp_remote_get($url);
            if (!is_wp_error($response)) {
                return wp_remote_retrieve_body($response);
            }
        }
        return null;
    }

    private function parse_ogtags($contents)
    {
        preg_match_all('~<\s*meta\s+property="(og:[^"]+)"\s+content="([^"]*)~i', $contents, $m);
        $ogtags = [];
        for ($i = 0; $i < count($m[1]); $i++) {
            $ogtags[$m[1][$i]] = $m[2][$i];
        }
        return $ogtags;
    }

    private function parse_photos($contents)
    {
        preg_match_all('~\"(http[^"]+)\"\,[0-9^,]+\,[0-9^,]+~i', $contents, $m);
        return array_unique($m[1]);
    }

    private function get_embed_google_photos_html($props)
    {

        error_log(print_r($props, true));

        if ($contents = $this->get_remote_contents($props->link)) {
            $og = $this->parse_ogtags($contents);
            $title = $og['og:title'] ?? null;
            $photos = $this->parse_photos($contents);

            $style = sprintf(
                'display:none;width:%s;height:%s;',
                $props->width === 0 ? '100%' : ($props->width . 'px'),
                $props->height === 0 ? '100%' : ($props->height . 'px')
            );

            $items_code = '';
            foreach ($photos as $photo) {
                $src = sprintf('%s=w%d-h%d', $photo, $props->imageWidth, $props->imageHeight);
                $items_code .= sprintf('<object data="%s"></object>', esc_url($src));
            }

            $attributes = [
                'data-link' => $props->link,
                'data-found' => count($photos),
                'data-title' => $title,
                'data-autoplay' => 'false', //
                'data-delay' => $props->slideshowDelay > 0 ? $props->slideshowDelay : null,
                'data-repeat' => 'true',
                'data-mediaitems-aspectratio' => $props->mediaitemsAspectRatio ? 'true' : 'false',
                'data-mediaitems-enlarge' => $props->mediaitemsEnlarge ? 'true' : 'false',
                'data-mediaitems-stretch' => $props->mediaitemsStretch ? 'true' : 'false',
                'data-mediaitems-cover' => $props->mediaitemsCover ? 'true' : 'false',
                'data-background-color' => $props->backgroundColor,
            ];

            $attributes_string = '';
            foreach ($attributes as $key => $value) {
                if ($value !== null) {
                    $attributes_string .= sprintf(' %s="%s"', $key, $value);
                }
            }

            return sprintf(
                "<div class=\"pa-%s-widget\" style=\"%s\"%s>%s</div>\n",
                $props->mode,
                $style,
                $attributes_string,
                $items_code
            );
        }
        return null;
    }

    private function create_default_attr()
    {
        $props = new \stdClass();
        $props->mode = 'gallery-player';
        $props->width = 600;
        $props->height = 450;
        $props->imageWidth = 1920;
        $props->imageHeight = 1080;
        $props->slideshowAutoplay = false;
        $props->slideshowDelay = 5;
        $props->repeat = true;
        $props->mediaitemsAspectRatio = true;
        $props->mediaitemsEnlarge = true;
        $props->mediaitemsStretch = true;
        $props->mediaitemsCover = false;
        $props->backgroundColor = '#000000';
        return $props;
    }

    public function fakeResponse()
    {
        $src_url = urldecode($this->url);

        // Extract configuration or set defaults
        $width = isset($this->config['maxwidth']) ? $this->config['maxwidth'] : 600;
        $height = isset($this->config['maxheight']) ? $this->config['maxheight'] : 450;

        // Fetch parameters
        $params = $this->getParams();


        // Pass parameters explicitly
        return [
            'type' => 'rich',
            'provider_name' => 'Google Photos',
            'provider_url' => 'https://photos.app.goo.gl',
            'title' => $params['title'] ?? 'Unknown title',
            'html' => $this->get_embeded_content(
                $src_url,
                $width,
                $height,
                $width,
                $height,
                $params['expiration'] ?? 0,
                $params['mode'] ?? 'gallery-player',
                $params['playerAutoplay'],
                $params['delay'] ?? 2,
                $params['repeat'],
                $params['mediaitemsAspectRatio'],
                $params['mediaitemsEnlarge'],
                $params['mediaitemsStretch'],
                $params['mediaitemsCover'],               
                $params['backgroundColor'],
            ) . '<script src="' . $this->player_js . '"></script>',
        ];
    }

    public function modifyResponse(array $response = [])
    {
        return $this->fakeResponse();
    }
}
