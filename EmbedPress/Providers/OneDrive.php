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
        // CASE 1: All 1drv.ms embed styles — including /w/s!abc123 or /w/c/abc123 or /p/c/x/y
        if (preg_match('~https?://1drv\.ms/[a-z]+/[a-z0-9!_-]+(?:/[^?\s]*)?~i', $url)) {
            return $this->appendEmbedParam($url);
        }

        // CASE 2: Short link like /w/abc123 → convert to /w/c/abc123
        if (preg_match('~https?://1drv\.ms/([a-z]+)/([a-zA-Z0-9_-]+)$~i', $url, $matches)) {
            return "https://1drv.ms/{$matches[1]}/c/{$matches[2]}?embed=1&em=2";
        }

        // CASE 3: SharePoint or OneDrive full link
        if (preg_match('~https?://(?:onedrive\.live\.com|[\w.-]+\.sharepoint\.com)/.*?(?:resid=|id=|file/)([^&?/]+)(?:&authkey=([^&]+))?~i', $url, $matches)) {
            $fileId = $matches[1];
            $authKey = $matches[2] ?? '';
            $iframeSrc = "https://1drv.ms/w/c/$fileId";

            if ($authKey) {
                $iframeSrc .= "?authkey=$authKey";
            }

            return $this->appendEmbedParam($iframeSrc);
        }

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
