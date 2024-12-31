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

    public function validateUrl(Url $url)
    {
        return preg_match('~^https:\/\/(photos\.app\.goo\.gl|photos\.google\.com)\/.*$~i', (string) $url);
    }

    public function getcode($link, $width = 0, $height = 480, $imageWidth = 1920, $imageHeight = 1080, $expiration = 0)
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

        return $this->get_html($props, $expiration);
    }

    private function get_html($props, $expiration = 0)
    {
        $url_hash = md5($props->link);
        $transient = sprintf('%s-%s', self::$name, $url_hash);
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
        if ($contents = $this->get_remote_contents($props->link)) {
            $og = $this->parse_ogtags($contents);
            $title = isset($og['og:title']) ? $og['og:title'] : null;
            $photos = $this->parse_photos($contents);

            $style = 'display:none;' . 'width:' . ($props->width === 0 ? '100%' : ($props->width . 'px')) . ';' . 'height:' . ($props->height === 0 ? '100%' : ($props->height . 'px')) . ';';

            $items_code = '';
            foreach ($photos as $photo) {
                $src = sprintf('%s=w%d-h%d', $photo, $props->imageWidth, $props->imageHeight);
                $items_code .= '<object data="' . esc_url($src) . '"></object>';
            }

            return '<div class="pa-' . $props->mode . '-widget" style="' . esc_attr($style) . '"' . ' data-link="' . esc_url($props->link) . '"' . ' data-found="' . count($photos) . '"' . ($title ? ' data-title="' . esc_attr($title) . '"' : '') . '>' . $items_code . '</div>' . "\n";
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
        $props->backgroundColor = '#000000';
        return $props;
    }

    public function fakeResponse()
    {
        $src_url = urldecode($this->url);

        $width = isset($this->config['maxwidth']) ? $this->config['maxwidth'] : 600;
        $height = isset($this->config['maxheight']) ? $this->config['maxheight'] : 450;

        return [
            'type' => 'rich',
            'provider_name' => 'Google Photos',
            'provider_url' => 'https://photos.app.goo.gl',
            'title' => 'Unknown title',
            'html' => $this->getcode($src_url, $width, $height) . '<script src="' . $this->player_js . '"></script>',
        ];
    }

    public function modifyResponse(array $response = [])
    {
        return $this->fakeResponse();
    }
}
