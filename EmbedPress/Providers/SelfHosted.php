<?php

namespace EmbedPress\Providers;

use Embera\Provider\ProviderAdapter;
use Embera\Provider\ProviderInterface;
use Embera\Url;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity responsible to support SelfHosted embeds.
 *
 * @package     EmbedPress
 * @subpackage  EmbedPress/Providers
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2020 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.0.0
 */

class SelfHosted extends ProviderAdapter implements ProviderInterface
{

    /** Original URL with port preserved — Embera\Url::__toString() drops the
     *  port, which breaks self-hosted media on dev hosts like localhost:8080. */
    protected $rawUrl;

    public function __construct($url, array $config = [])
    {
        parent::__construct($url, $config);
        $this->rawUrl = (string) $url;
        $hosts_url = parse_url($url);
        $this->addHost($hosts_url['host']);
    }

    /**
     * Returns the source URL with the original port restored. Embera's
     * Url object strips the port in __toString(), so self-hosted assets
     * served from non-standard ports (e.g. http://localhost:8080) end up
     * pointing at the wrong origin in the rendered <video>/<audio> tag.
     */
    protected function srcUrl()
    {
        $orig = parse_url($this->rawUrl);
        if (empty($orig['port'])) {
            return (string) $this->url;
        }
        $cur = parse_url((string) $this->url);
        if (!empty($cur['port'])) {
            return (string) $this->url;
        }
        $rebuilt = (isset($cur['scheme']) ? $cur['scheme'] : 'http') . '://'
            . (isset($cur['host']) ? $cur['host'] : $orig['host']) . ':' . $orig['port']
            . (isset($cur['path']) ? $cur['path'] : '')
            . (isset($cur['query']) ? '?' . $cur['query'] : '')
            . (isset($cur['fragment']) ? '#' . $cur['fragment'] : '');
        return $rebuilt;
    }

    /** inline {@inheritdoc} */


    /**
     * Method that verifies if the embed URL belongs to SelfHosted.
     *
     * @param Url $url
     * @return  boolean
     * @since   1.0.0
     *
     */
    public function validateUrl(Url $url)
    {
        return  (bool) preg_match(
            '/^(https?:\/\/)?(www\.)?([a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,24}|localhost|(\d{1,3}\.){3}\d{1,3})(:[0-9]{1,5})?(\/.*)?$/i',
            (string) $url
        );
    }

    public function validateSelfHostedVideo($url)
    {
        // Strip query string / fragment before extension test — streaming
        // manifests often carry signed-URL parameters (?token=…&exp=…).
        $path = preg_replace('/[?#].*$/', '', (string) $url);
        return  (bool) preg_match(
            '/\.(mp4|mov|avi|wmv|flv|mkv|webm|mpeg|mpg|m3u8|mpd)$/i',
            $path
        );
    }
    public function validateSelfHostedAudio($url)
    {
        return  (bool) preg_match(
            '/\.(mp3|wav|ogg|aac)$/i',
            (string) $url
        );
    }

    public function validateWrapper($url)
    {
        return  (bool) preg_match(
            '/^(https?:\/\/)?(www\.)?([a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,24}|localhost|(\d{1,3}\.){3}\d{1,3})(:[0-9]{1,5})?(\/.*)?$/i',
            (string) $url
        );
    }

    public function fileExtention($fileUrl)
    {
        $pathInfo = pathinfo($fileUrl);

        if (isset($pathInfo['extension'])) {
            $fileExtension = $pathInfo['extension'];
            return $fileExtension;
        }
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
        $media_url = $this->srcUrl();
        $src_url = urldecode($media_url);
        $provider_name = 'Self Hosterd';

        $width = isset($this->config['maxwidth']) ? $this->config['maxwidth'] : 600;
        $height = isset($this->config['maxheight']) ? $this->config['maxheight'] : 450;

        // Check if the url is already converted to the embed format
        if ($this->fileExtention($src_url) === 'ppsx' || $this->fileExtention($src_url) === 'pptx' || $this->fileExtention($src_url) === 'ppt' || $this->fileExtention($src_url) === 'xlsx' || $this->fileExtention($src_url) === 'xls' || $this->fileExtention($src_url) === 'doc' || $this->fileExtention($src_url) === 'docx') {
            $src_url = '//view.officeapps.live.com/op/embed.aspx?src=' . $media_url;
        }

        // Check if the url is already converted to the embed format
        $html = '';
        if ($this->validateSelfHostedVideo($media_url)) {
            $videoMime = [
                'mp4' => 'video/mp4', 'mov' => 'video/quicktime', 'webm' => 'video/webm',
                'mkv' => 'video/x-matroska', 'avi' => 'video/x-msvideo', 'wmv' => 'video/x-ms-wmv',
                'flv' => 'video/x-flv', 'mpeg' => 'video/mpeg', 'mpg' => 'video/mpeg',
                'm3u8' => 'application/vnd.apple.mpegurl',
                'mpd'  => 'application/dash+xml',
            ];
            $ext_path = preg_replace('/[?#].*$/', '', $media_url);
            $ext = strtolower($this->fileExtention($ext_path));
            $type = isset($videoMime[$ext]) ? $videoMime[$ext] : 'video/mp4';
            $html = '<video controls width="' . esc_attr($width) . '" height="' . esc_attr($height) . '"> <source src="' . esc_url($media_url) . '" type="' . esc_attr($type) . '"> </video>';
        } else if ($this->validateSelfHostedAudio($media_url)) {
            $audioMime = [ 'mp3' => 'audio/mpeg', 'wav' => 'audio/wav', 'ogg' => 'audio/ogg', 'aac' => 'audio/aac' ];
            $ext = strtolower($this->fileExtention($media_url));
            $type = isset($audioMime[$ext]) ? $audioMime[$ext] : 'audio/mpeg';
            $html = '<audio controls> <source src="' . esc_url($media_url) . '" type="' . esc_attr($type) . '"></audio>';
        } else if ($this->validateWrapper($media_url)) {
            $provider_name = 'Wrapper';

            $html = '<iframe width="' . esc_attr($width) . '" height="' . esc_attr($height) . '" src="' . esc_url($src_url) . '" > </iframe>';
        } else {
            return [];
        }

        return [
            'type'          => 'rich',
            'provider_name' => $provider_name,
            'provider_url'  => site_url(),
            'title'         => 'Unknown title',
            'html'          => $html,
        ];
    }
    /** inline @inheritDoc */
    public function modifyResponse(array $response = [])
    {
        return $this->fakeResponse();
    }
}
