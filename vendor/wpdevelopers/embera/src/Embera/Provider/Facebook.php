<?php
/**
 * Facebook.php
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
 * Facebook Provider
 * Connect with friends and the world around you on Facebook.
 * This Provider Requires the use of an access_token provided by Facebook.
 * Example: `$embera = new Embera([ 'facebook_access_token' => 'yourtokenforfacebook' ]);`
 *
 * @link https://facebook.com
 * @see https://developers.facebook.com/docs/plugins/oembed-endpoints
 */
class Facebook extends ProviderAdapter implements ProviderInterface
{
	/** inline {@inheritdoc} */
	protected $shouldSendRequest = false;
    /** inline {@inheritdoc} */
    protected $endpoint = 'https://graph.facebook.com/v16.0/oembed_{type}';

    /** inline {@inheritdoc} */
    protected static $hosts = [
        'facebook.com'
    ];

    /** inline {@inheritdoc} */
    protected $allowedParams = [ 'maxwidth', 'maxheight', 'callback', 'omitscript', 'breaking_change', 'access_token', 'fields', 'locale' ];

    /** inline {@inheritdoc} */
    protected $httpsSupport = true;

    /** inline {@inheritdoc} */
    protected $responsiveSupport = true;

    /** Patterns that match posts urls */
    protected $postPatterns = [
        /**
         * https://www.facebook.com/{page-name}/posts/{post-id}
         * https://www.facebook.com/{username}/posts/{post-id}
         * https://www.facebook.com/{username}/activity/{activity-id}
         *
         * Undocumented: https://www.facebook.com/{username}/photos/{photo-id}
         */
        '~facebook\.com/(?:[^/]+)/(?:posts|activity|photos)/(?:[^/]+)/?~i',

        /**
         * https://www.facebook.com/notes/{username}/{note-url}/{note-id}
         */
        '~facebook\.com/notes/(?:[^/]+)/(?:[^/]+)/(?:[^/]+)/?~i',

        /**
         * https://www.facebook.com/photo.php?fbid={photo-id}
         * https://www.facebook.com/permalink.php?story_fbid={post-id}
         */
        '~facebook\.com/(?:photo|permalink)\.php\?(?:(story_)?fbid)=(?:[^ ]+)~i',

        /**
         * https://www.facebook.com/photos/{photo-id}
         * https://www.facebook.com/questions/{question-id}
         */
        '~facebook\.com/(?:photos|questions)/(?:[^/ ]+)/?~i',

        /**
         * NOTE: This url scheme is stated to be supported, however
         * I havent found any example that work. I'm leaving it
         * but I suspect that its not valid anymore.. we know how
         * facebook is with API's :/
         *
         * However in order to be really complaint with the documentation
         * I'm leaving the pattern.
         *
         * https://www.facebook.com/media/set?set={set-id}
         */
        '~facebook\.com/media/set/?\?set=(?:[^/ ]+)~i',
    ];

    /** Patterns that match video urls */
    protected $videoPatterns = [
        /**
         * https://www.facebook.com/{page-name}/videos/{video-id}/
         * https://www.facebook.com/{username}/videos/{video-id}/
         */
        '~facebook\.com/(?:[^/]+)/videos/(?:[^/]+)/?~i',

        /**
         * https://www.facebook.com/video.php?id={video-id}
         * https://www.facebook.com/video.php?v={video-id}
         */
        '~facebook\.com/video\.php\?(?:id|v)=(?:[^ ]+)~i',
        
         /**
        * https://www.facebook.com/watch?v={video-id}
         */
        '~facebook\.com/watch\?v=(?:[^ ]+)~i',
    ];

    /** Patterns that match page urls */
    protected $pagePatterns = array(
        '~facebook\.com\/\S+[\/]?$~'
    );

    /**
     * Checks if $url matches the given list of patterns
     *
     * @param string $url
     * @param array $patternList
     * @return bool
     */
    protected function urlMatchesPattern($url, array $patternList)
    {
        foreach ($patternList as $p) {
            if (preg_match($p, (string) $url)) {
                return true;
            }
        }

        return false;
    }

    /** inline {@inheritdoc} */
    public function validateUrl(Url $url)
    {
        return $this->urlMatchesPattern($url, array_merge($this->postPatterns, $this->videoPatterns, $this->pagePatterns));
    }

    /** inline {@inheritdoc} */
    public function getEndpoint()
    {
        if ($this->urlMatchesPattern($this->url, $this->videoPatterns)) {
            $type = 'video';
        } elseif ($this->urlMatchesPattern($this->url, $this->postPatterns)) {
            $type = 'post';
        } else {
            $type = 'page';
        }

        return str_replace('{type}', $type, $this->endpoint);
    }

    /** inline {@inheritdoc} */
    public function normalizeUrl(Url $url)
    {
        $url->convertToHttps();
        return $url;
    }

	/** inline {@inheritdoc} */
	public function getStaticResponse() {
		$response = [];
		$params =$this->getParams();
		$embedUrl = 'https://www.facebook.com/plugins/post.php?href={url}&width={width}&height={height}&show_text=true';
		$height= 680;
		$width = 500;
		$attr = [];
		$attr[] = 'class="embera-facebook-iframe-{md5}"';
		$attr[] = 'src="' . $embedUrl . '"';
		$attr[] = 'width="{width}"';
		$attr[] = 'height="{height}"';
		$attr[] = 'style="border:none;overflow:hidden"';
		$attr[] = 'scrolling="no"';
		$attr[] = 'frameborder="0"';
		$attr[] = 'allowTransparency="true"';

		$iframe = '<iframe ' . implode(' ', $attr) . '></iframe>';
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

		$table = array(
			'{url}' => rawurlencode($this->url),
			'{md5}' => substr(md5($this->url), 0, 5),
			'{width}' => $width,
			'{height}' => $height,
		);

		// Replace the html response
		$response['html'] = str_replace(array_keys($table), array_values($table), $iframe);

		return $response;
    }

}
