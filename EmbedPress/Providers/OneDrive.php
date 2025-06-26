<?php

namespace EmbedPress\Providers;

use Embera\Provider\ProviderAdapter;
use Embera\Provider\ProviderInterface;
use Embera\Url;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * OneDrive provider for EmbedPress.
 *
 * @package     EmbedPress
 * @subpackage  EmbedPress/Providers
 * @author      EmbedPress
 * @license     GPLv3 or later
 * @since       1.0.0
 */
class OneDrive extends ProviderAdapter implements ProviderInterface
{
    protected static $hosts = ["onedrive.live.com", "1drv.ms"];

    /**
     * Validates if the URL belongs to OneDrive.
     *
     * @param Url $url
     * @return bool
     */
    public function validateUrl(Url $url)
    {
        return (bool) preg_match(
            '~https?:\/\/(?:onedrive\.live\.com|1drv\.ms)\/(?:embed|redir|w\/c)?\/?(?:[^\/]*\/)*([^\/]+)~i',
            (string) $url
        );
    }


    /**
     * Determines the appropriate iframe src for the given URL.
     *
     * @param string $url
     * @return string|null
     */
    private function getIframeSrc(string $url): ?string
    {
        // New format: 1drv.ms/w/c/...
        if (preg_match('~https?://1drv\.ms/[uvwxyz]/c/[^/]+/[^?\s]+~i', $url)) {
            return $this->appendEmbedParam($url);
        }

        // Old short link: 1drv.ms/{type}/{code}
        if (preg_match('~https?://1drv\.ms/([uvwxyz])/([a-zA-Z0-9!_-]+)~i', $url, $matches)) {
            return "https://1drv.ms/{$matches[1]}/c/{$matches[2]}?em=2";
        }

        // SharePoint or OneDrive with resid/id/file
        if (preg_match('~https?://(?:onedrive\.live\.com|[\w-]+\.sharepoint\.com)/.*?(?:resid=|id=|file/)([^&/]+)(?:&authkey=([^&]+))?~i', $url, $matches)) {
            $fileId = $matches[1];
            $authKey = $matches[2] ?? '';
            $iframeSrc = "https://1drv.ms/w/c/$fileId";

            if ($authKey) {
                $iframeSrc .= "?$authKey";
            }

            return $this->appendEmbedParam($iframeSrc);
        }

        // No match
        return null;
    }

    /**
     * Appends ?em=2 or &em=2 to a URL if not already present.
     *
     * @param string $url
     * @return string
     */
    private function appendEmbedParam(string $url): string
    {
        if (strpos($url, 'em=') !== false) {
            return $url;
        }

        return $url . (strpos($url, '?') === false ? '?em=2' : '&em=2');
    }

    /**
     * Generates a fake oEmbed response.
     *
     * @return array
     */
    public function fakeResponse()
    {
        $srcUrl = urldecode($this->url);
        $iframeSrc = $this->getIframeSrc($srcUrl);

        if (!$iframeSrc) {
            return [];
        }

        $width = $this->config['maxwidth'] ?? 600;
        $height = $this->config['maxheight'] ?? 450;

        return [
            'type'          => 'rich',
            'provider_name' => 'OneDrive',
            'provider_url'  => 'https://onedrive.live.com',
            'title'         => 'OneDrive Document',
            'html'          => sprintf(
                '<iframe title="OneDrive Document" width="%d" height="%d" src="%s" frameborder="0" scrolling="no"></iframe>',
                esc_attr($width),
                esc_attr($height),
                esc_url($iframeSrc)
            ),
        ];
    }

    /**
     * Fallback for modifyResponse, returns fakeResponse.
     *
     * @param array $response
     * @return array
     */
    public function modifyResponse(array $response = [])
    {
        return $this->fakeResponse();
    }
}
