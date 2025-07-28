<?php

namespace EmbedPress\Providers;

use EmbedPress\Includes\Classes\Helper;
use Embera\Provider\ProviderAdapter;
use Embera\Provider\ProviderInterface;
use Embera\Url;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

class GooglePhotos extends ProviderAdapter implements ProviderInterface
{
    protected static $hosts = ["photos.app.goo.gl", "photos.google.com"];
    private $player_js = EMBEDPRESS_URL_ASSETS . "js/embed-ui.min.js";
    private $min_expiration = 0;
    private $allowed_url_patttern = "/^https:\/\/photos\.app\.goo\.gl\/|^https:\/\/photos\.google\.com(?:\/u\/\d+)?\/share\//";

    static public $name = "google-photos-album";

    /** @var array Array with allowed params for the current Provider */
    protected $allowedParams = [
        'mode',
        'maxwidth',
        'google_photos_width',
        'google_photos_height',
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

    public function get_embeded_content($link, $width = 0, $height = 480, $imageWidth = 1920, $imageHeight = 1080, $expiration = 60, $mode = 'gallery-player', $playerAutoplay = false, $delay = 5, $repeat = true, $aspectRatio = true, $enlarge = true, $stretch = true, $cover = false, $backgroundColor = '#000000')
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
        $props->backgroundColor = $backgroundColor;

        $html = $this->get_html($props, $expiration);

        return $html;
    }

    private function build_google_photos_html($props, $photos, $title = '')
    {
        $style = sprintf(
            'display: none; width: %s; height: %s; max-width: 100%%;',
            $props->width === 0 ? '100%' : ($props->width . 'px'),
            $props->height === 0 ? '100%' : '100%'
        );

        $items_code = '';

        if (in_array($props->mode, ['gallery-justify', 'gallery-masonary', 'gallery-grid'], true)) {
            $items_code .= sprintf('<div class="photos-%s">', esc_attr($props->mode));
            $counter = 0;

            foreach ($photos as $photo) {
                $preview_src = sprintf('%s=w%d-h%d', $photo, $props->imageWidth, $props->imageHeight);
                $full_src = $photo . '=w2500';

                $items_code .= sprintf(
                    '<div class="photo-item" data-item-number="%d" id="photo-%s">
                    <img data-photo-src="%s" src="%s" loading="lazy" alt="Photo"/>
                </div>',
                    esc_attr($counter++),
                    md5($preview_src),
                    esc_url($full_src),
                    esc_url($preview_src)
                );
            }

            $items_code .= '</div>';

            return sprintf(
                "<div class=\"google-photos-%s-widget\"><h3 style='text-align:left; margin: 22px 10px;'>%s</h3>%s</div>\n",
                esc_attr($props->mode),
                esc_html($title),
                $items_code
            );
        } else {
            foreach ($photos as $photo) {
                $preview_src = sprintf('%s=w%d-h%d', $photo, $props->imageWidth, $props->imageHeight);
                $items_code .= sprintf('<object data="%s"></object>', esc_url($preview_src));
            }
        }

        // Metadata for embedding
        $attributes = [
            'data-link' => $props->link,
            'data-found' => count($photos),
            'data-title' => $title,
            'data-mediaitems-aspect-ratio' => true,
            'data-mediaitems-enlarge' => '',
            'data-mediaitems-stretch' => '',
            'data-mediaitems-cover' => '',
            'data-background-color' => $props->backgroundColor,
        ];

        $attributes = apply_filters('embedpress_google_photos_attributes', $attributes, $props);

        $attributes_string = '';
        foreach ($attributes as $key => $value) {
            if ($value !== null) {
                $attributes_string .= sprintf(' %s="%s"', $key, $value);
            }
        }

        return sprintf(
            "<div class=\"pa-%s-widget\" style=\"%s\"%s>%s</div>\n",
            esc_attr($props->mode),
            $style,
            $attributes_string,
            $items_code
        );
    }

    private function get_html($props, $expiration = 60)
    {
        $url_hash = md5($props->link);
        $data_transient_key = sprintf('%s-data-%s', self::$name, $url_hash);
        $option_expiration_key = sprintf('%s-expiration-%s', self::$name, $url_hash);

        // Get cached data from transient
        $data = get_transient($data_transient_key);

        // Get previously stored expiration from options
        $prev_expiration = get_option($option_expiration_key, 0);

        $should_refresh = false;

        // Refresh if no data or expiration changed
        if (empty($data) || $prev_expiration != $expiration) {
            $should_refresh = true;
        }

        if ($should_refresh) {
            $contents = $this->get_remote_contents($props->link);
            if (!$contents) {
                return null;
            }

            $og = $this->parse_ogtags($contents);
            $photos = $this->parse_photos($contents);

            $data = [
                'title' => $og['og:title'] ?? null,
                'photos' => $photos,
            ];

            // Cache data transient with current expiration
            set_transient($data_transient_key, $data, $expiration);

            // Store current expiration persistently in options
            update_option($option_expiration_key, $expiration);
        }

        return $this->build_google_photos_html($props, $data['photos'], $data['title']);
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
        $photos = array_unique($m[1]);

        // Use preg_replace_callback to remove width/height parameters directly in the matched URLs
        return preg_replace_callback('/=[^&]+$/', function ($matches) {
            return ''; // Remove the width/height parameters at the end
        }, $photos);
    }


    private function get_embed_google_photos_html($props)
    {
        if ($contents = $this->get_remote_contents($props->link)) {
            $og = $this->parse_ogtags($contents);
            $title = $og['og:title'] ?? null;
            $photos = $this->parse_photos($contents);


            error_log(print_r($contents, true));

            $style = sprintf(
                'display: none; width: %s; height: %s; max-width: 100%%;',
                $props->width === 0 ? '100%' : ($props->width . 'px'),
                $props->height === 0 ? '100%' : ('100%')
            );

            $items_code = '';

            if ($props->mode == 'gallery-justify' || $props->mode == 'gallery-masonary' || $props->mode == 'gallery-grid') {
                $items_code .= sprintf('<div class="photos-%s">', esc_attr($props->mode));
                $counter = 0;

                foreach ($photos as $photo) {
                    // Preview image URL (small version for fast loading)
                    $preview_src = sprintf('%s=w%d-h%d', $photo, $props->imageWidth, $props->imageHeight);

                    // Full image URL (original size or any desired size)
                    $full_src = $photo . '=w2500';

                    // Add image items with preview and full image source
                    $items_code .= sprintf(
                        '<div class="photo-item" data-item-number="%d" id="photo-%s">
                            <img data-photo-src="%s" src="%s" loading="lazy" alt="Photo"/>
                        </div>',
                        esc_attr($counter++),
                        md5($preview_src),
                        esc_url($full_src), // Full image source for later use
                        esc_url($preview_src) // Preview image source for fast loading
                    );
                }

                $items_code .= '</div>';

                return sprintf(
                    "<div class=\"google-photos-%s-widget\"><h3 style='text-align:left; margin: 22px 10px;'>%s</h3>%s</div>\n",
                    esc_attr($props->mode),
                    $title,
                    $items_code
                );
            } else {
                foreach ($photos as $photo) {
                    // Preview image URL (small version for fast loading)
                    $preview_src = sprintf('%s=w%d-h%d', $photo, $props->imageWidth, $props->imageHeight);

                    // Full image URL (original size or any desired size)
                    $full_src = $photo;

                    // Add image items with preview and full image source
                    $items_code .= sprintf(
                        '<object data="%s"></object>',
                        esc_url($preview_src) // Using preview image for non-gallery mode
                    );
                }
            }


            $attributes = [
                'data-link' => $props->link,
                'data-found' => count($photos),
                'data-title' => $title,
                'data-mediaitems-aspect-ratio' => true,
                'data-mediaitems-enlarge' => '',
                'data-mediaitems-stretch' => '',
                'data-mediaitems-cover' => '',
                'data-background-color' => $props->backgroundColor,
            ];

            // Apply filter to allow modification of attributes
            $attributes = apply_filters('embedpress_google_photos_attributes', $attributes, $props);

            $attributes_string = '';
            foreach ($attributes as $key => $value) {
                if ($value !== null) {
                    $attributes_string .= sprintf(' %s="%s"', $key, $value);
                }
            }

            return sprintf(
                "<div class=\"pa-%s-widget\" style=\"%s\"%s>%s</div>\n",
                esc_attr($props->mode),
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

        // Fetch parameters
        $params = $this->getParams();

        // Extract configuration or set defaults
        $width = isset($this->config['maxwidth']) ? $this->config['maxwidth'] : 600;
        $height = isset($this->config['maxheight']) ? $this->config['maxheight'] : 450;


        $expiration = $params['expiration'] ?? 60;
        $mode = $params['mode'] ?? 'carousel';
        $playerAutoplay = isset($params['playerAutoplay']) ? Helper::getBooleanParam($params['playerAutoplay']) : false;
        $delay = $params['delay'] ?? 5;
        $repeat = isset($params['repeat']) ? Helper::getBooleanParam($params['repeat']) : false;
        $aspectRatio = isset($params['mediaitemsAspectRatio']) ? Helper::getBooleanParam($params['mediaitemsAspectRatio']) : false;
        $enlarge = isset($params['mediaitemsEnlarge']) ? Helper::getBooleanParam($params['mediaitemsEnlarge']) : false;
        $stretch = isset($params['mediaitemsStretch']) ? Helper::getBooleanParam($params['mediaitemsStretch']) : false;
        $cover = isset($params['mediaitemsCover']) ? Helper::getBooleanParam($params['mediaitemsCover']) : false;
        $backgroundColor = $params['backgroundColor'] ?? '#000000';

        $html = $this->get_embeded_content(
            $src_url,
            $width,
            $height,
            $width,
            $height,
            $expiration,
            $mode,
            $playerAutoplay,
            $delay,
            $repeat,
            $aspectRatio,
            $enlarge,
            $stretch,
            $cover,
            $backgroundColor
        );

        // Conditionally load player JS only if mode is 'carousel' or autoplay is enabled
        if ($mode === 'carousel' || $mode === 'gallery-player') {
            $html .= '<script src="' . $this->player_js . '"></script>';
        }
        if ($mode === 'gallery-justify') {
            $html .= '<script src="' . EMBEDPRESS_PLUGIN_DIR_URL . 'assets/js/gallery-justify.js"></script>';
        }

        // Always load gallery layout script (or make this conditional too if needed)

        return [
            'type' => 'rich',
            'provider_name' => 'Google Photos',
            'provider_url' => 'https://photos.app.goo.gl',
            'title' => $params['title'] ?? 'Unknown title',
            'html' => $html,
        ];
    }

    public function modifyResponse(array $response = [])
    {
        return $this->fakeResponse();
    }
}
