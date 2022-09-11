<?php

/**
 * opensea.io
 *
 * @package EmbedPress
 * @author Alimuzzaman Alim <alimuzzamanalim@gmail.com>
 * @link   https://alim.dev/
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace EmbedPress\Providers;

use Embera\Provider\ProviderAdapter;
use Embera\Provider\ProviderInterface;
use Embera\Url;

/**
 * opensea.io Provider
 * @link opensea.io
 */
class OpenSea extends ProviderAdapter implements ProviderInterface {
	/** inline {@inheritdoc} */
	protected $shouldSendRequest = false;
    public static $curltimeout = 30;
    /** inline {@inheritdoc} */
    /** @var array Array with allowed params for the current Provider */
    protected $allowedParams = [ 'maxwidth', 'maxheight' ];

    /** inline {@inheritdoc} */
    protected static $hosts = [
        'opensea.io',
    ];

    /** inline {@inheritdoc} */
    protected $httpsSupport = true;

    public function getAllowedParams(){
        return $this->allowedParams;
    }

    /** inline {@inheritdoc} */
    public function validateUrl(Url $url) {
        return (bool) (preg_match('~opensea\.io/(collection/(.*)|assets/.*[a-zA-Z0-9]+/[a-zA-Z0-9]+)~i', (string) $url));
    }

    /** inline {@inheritdoc} */
    public function normalizeUrl(Url $url) {
        return $url;
    }

    /** inline {@inheritdoc} */
    public function isAssets($url) {
        return (bool) (preg_match('~opensea\.io/assets/.*[a-zA-Z0-9]+/[a-zA-Z0-9]+~i', (string) $url));
    }

    /** inline {@inheritdoc} */
    public function isCollection($url) {
        return (bool) (preg_match('~opensea\.io/collection/(.*)~i', (string) $url));
    }

	public function getStaticResponse() {
        $results = [
            "title"         => "",
            "type"          => "video",
            'provider_name' => $this->getProviderName(),
            "provider_url"  => "https://opensea.io/",
            'html'          => "",
        ];
        $url = $this->getUrl();

        if($this->isAssets($url)){
            $results['html'] = $this->getAssets($url);
        }


        return $results;
    }


    public function getAssets($url) {
        preg_match('~opensea\.io/assets/.*/([a-zA-Z0-9]+)/([a-zA-Z0-9]+)~i', (string) $url, $matches);

        if(!empty($matches[1]) && !empty($matches[2])){
            return "
            <nft-card
            contractAddress=\"{$matches[1]}\"
            tokenId=\"{$matches[2]}\">
            </nft-card>
            <script src=\"https://unpkg.com/embeddable-nfts/dist/nft-card.min.js\"></script>";
        }
        return "";
    }


    /** inline {@inheritdoc} */
    public function getFakeResponse() {
        return [
            'type' => 'video',
            'provider_name' => $this->getProviderName(),
            'provider_url' => 'https://opensea.io/',
            'title' => 'Unknown title',
            'html' => '',
        ];
    }

}
