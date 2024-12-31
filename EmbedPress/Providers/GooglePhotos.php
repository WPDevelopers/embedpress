<?php

namespace EmbedPress\Providers;

use Embera\Provider\ProviderAdapter;
use Embera\Provider\ProviderInterface;
use Embera\Url;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

class GooglePhotos extends ProviderAdapter implements ProviderInterface
{
    /** Supported hosts */
    protected static $hosts = ["photos.app.goo.gl", "photos.google.com"];

    /** Embed player JavaScript URL */
    private $player_js = "https://cdn.jsdelivr.net/npm/publicalbum@latest/embed-ui.min.js";

    /** Unique index for multiple embeds in the same post */
    private static $index = 1;

    /** Transient expiration time */
    private $min_expiration = 3600; // 1 hour

    private $allowed_url_patttern = "/^https:\/\/photos\.app\.goo\.gl\/|^https:\/\/photos\.google\.com\/share\//";

    static public $name = "pavex-embed-player";



    /**
     * Validate whether the URL belongs to a Google Photos album.
     *
     * @param Url $url
     * @return bool
     */
    public function validateUrl(Url $url)
    {

        return preg_match(
            '~^https:\/\/(photos\.app\.goo\.gl|photos\.google\.com)\/.*$~i',
            (string) $url
        );
    }

    /**
     * Generate the embedding HTML for the Google Photos album.
     *
     * @param string $link
     * @param int $width
     * @param int $height
     * @param int $imageWidth
     * @param int $imageHeight
     * @param int $expiration
     * @return string|null
     */
    public function getcode($link, $width = 0, $height = 480, $imageWidth = 1920, $imageHeight = 1080, $expiration = 0)
    {
        if (is_object($link)) {
            return $this->get_html($link, $expiration);
        }

        $props = $this->create_default_props();
        $props->link = $link;
        $props->width = $width;
        $props->height = $height;
        $props->imageWidth = $imageWidth;
        $props->imageHeight = $imageHeight;

        return $this->get_html($props, $expiration);
    }

    /**
     * Generate HTML using the fetched photos and metadata.
     *
     * @param object $props
     * @param int $expiration
     * @return string|null
     */
    private function get_html($props, $expiration = 0)
    {
        if (self::$index == 1) {
            wp_enqueue_script(self::$name, $this->player_js, [], false, true);
        }

        global $post;
        $transient = sprintf('%s-%d-%d', self::$name, $post->ID, self::$index++);

        if ($html = get_transient($transient)) {
            return $html;
        }

        if ($html = $this->get_embed_player_html_code($props)) {
            $expiration = $expiration > 0 ? $expiration : $this->min_expiration;
            set_transient($transient, $html, $expiration);
            return $html;
        }

        return null;
    }

    /**
     * Fetch the contents of a remote URL.
     *
     * @param string $url
     * @return string|null
     */
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

    /**
     * Parse Open Graph tags from HTML content.
     *
     * @param string $contents
     * @return array
     */
    private function parse_ogtags($contents)
    {
        $m = null;
        preg_match_all('~<\s*meta\s+property="(og:[^"]+)"\s+content="([^"]*)~i', $contents, $m);
        $ogtags = [];
        for ($i = 0; $i < count($m[1]); $i++) {
            $ogtags[$m[1][$i]] = $m[2][$i];
        }
        return $ogtags;
    }

    /**
     * Parse photo URLs from HTML content.
     *
     * @param string $contents
     * @return array
     */
    private function parse_photos($contents)
    {
        $m = null;
        preg_match_all('~\"(http[^"]+)"\,[0-9^,]+\,[0-9^,]+~i', $contents, $m);
        return array_unique($m[1]);
    }

    /**
     * Generate the embed player HTML code for the album.
     *
     * @param object $props
     * @return string|null
     */
    private function get_embed_player_html_code($props)
    {
        if ($contents = $this->get_remote_contents($props->link)) {
            $og = $this->parse_ogtags($contents);
            $title = isset($og['og:title']) ? $og['og:title'] : null;
            $photos = $this->parse_photos($contents);

            $style = 'display:none;'
                . 'width:' . ($props->width === 0 ? '100%' : ($props->width . 'px')) . ';'
                . 'height:' . ($props->height === 0 ? '100%' : ($props->height . 'px')) . ';';

            $items_code = '';
            foreach ($photos as $photo) {
                $src = sprintf('%s=w%d-h%d', $photo, $props->imageWidth, $props->imageHeight);
                $items_code .= '<object data="' . esc_url($src) . '"></object>';
            }

            return "<!-- publicalbum.org -->\n"
                . '<div class="pa-' . $props->mode . '-widget" style="' . esc_attr($style) . '"'
                . ' data-link="' . esc_url($props->link) . '"'
                . ' data-found="' . count($photos) . '"'
                . ($title ? ' data-title="' . esc_attr($title) . '"' : '')
                . '>' . $items_code . '</div>' . "\n";
        }
        return null;
    }

    /**
     * Create default embedding properties.
     *
     * @return \stdClass
     */
    private function create_default_props()
    {
        $props = new \stdClass();
        $props->mode = 'gallery-player';
        $props->width = 600;
        $props->height = 450;
        $props->imageWidth = 1920;
        $props->imageHeight = 1080;
        $props->slideshowAutoplay = false;
        $props->slideshowDelay = 5; // Seconds
        $props->backgroundColor = '#000000';
        return $props;
    }

    /**
     * This method fakes an Oembed response.
     *
     * @since   1.0.0
     *
     * @return  array
     */
    public function fakeResponse()
    {
        $src_url = urldecode($this->url);

        error_log(print_r($src_url, true));

        die;


        $width = isset($this->config['maxwidth']) ? $this->config['maxwidth'] : 600;
        $height = isset($this->config['maxheight']) ? $this->config['maxheight'] : 450;

        return [
            'type'          => 'rich',
            'provider_name' => 'Google drive',
            'provider_url'  => 'https://photos.app.goo.gl',
            'title'         => 'Unknown title',
            'html'          => $this->getcode($src_url, $width, $height),
        ];
    }
    /** inline @inheritDoc */
    public function modifyResponse(array $response = [])
    {
        return $this->fakeResponse();
    }
}
