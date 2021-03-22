<?php
/**
 * Instagram.php
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
 * Instagram Provider
 * @link https://instagram.com
 */
class Instagram extends ProviderAdapter implements ProviderInterface
{
	/** inline {@inheritdoc} */
	protected $shouldSendRequest = false;
    /** inline {@inheritdoc} */
    protected $endpoint = 'https://graph.facebook.com/v8.0/instagram_oembed';

    /** inline {@inheritdoc} */
    protected static $hosts = [
        'instagram.com', 'instagr.am'
    ];

    /** inline {@inheritdoc} */
    protected $allowedParams = [ 'maxwidth', 'maxheight', 'callback', 'omitscript', 'breaking_change', 'access_token', 'fields' ];

    /** inline {@inheritdoc} */
    protected $httpsSupport = true;

    /** inline {@inheritdoc} */
    protected $responsiveSupport = true;

    /** inline {@inheritdoc} */
    public function validateUrl(Url $url)
    {
        return (bool) (
            preg_match('~(instagram\.com|instagr\.am)/(?:p|tv)/([^/]+)/?$~i', (string) $url) ||
            preg_match('~(instagram\.com|instagr\.am)/([^/]+)/(?:p|tv)/([^/]+)/?$~i', (string) $url)
        );
    }

    /** inline {@inheritdoc} */
    public function normalizeUrl(Url $url)
    {
        $url->convertToHttps();
        $url->removeQueryString();

        return $url;
    }

	/** inline {@inheritdoc} */
	public function getStaticResponse() {
		$response = [];
		$params =$this->getParams();
		$height= 540;
		$width = 540;
		if (!empty($params['maxheight'])) {
			$height = $params['maxheight'];
		} else {
			if (!empty($params['maxwidth'])){
				$height = min(680, (int) ($params['maxwidth'] + 100));
			}
		}

		if (!empty($params['maxwidth'])) {
			$width = $params['maxwidth'];
		} else {
			if (!empty($params['maxheight'])){
				$width = min(500, (int) ($params['maxheight'] - 100));
			}
		}
		$hash = substr(md5($this->url), 0, 5);
		$attr = [];
		$attr[] = 'class="instagram-media embera-instagram-'.$hash.'"';
		$attr[] = "data-instgrm-permalink=\"{$this->url}\"";
		$attr[] = 'data-instgrm-captioned';
		$attr[] = 'data-instgrm-version="13"';
		$attr[] = 'style="margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"';
		$attr[] = 'scrolling="no"';
		$attr[] = 'frameborder="0"';
		$attr[] = 'allowTransparency="true"';

		$content = '<blockquote '.implode(' ', $attr).' >'.__('Instagram will load in the frontend.').'</blockquote><script async src="//www.instagram.com/embed.js"></script>';
		// Replace the html response
		$response['html'] = $content;

		return $response;
	}

}
