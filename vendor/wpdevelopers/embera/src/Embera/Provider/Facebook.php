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
 * @link https://facebook.com
 */
class Facebook extends ProviderAdapter implements ProviderInterface
{
	/** inline {@inheritdoc} */
	protected $shouldSendRequest = false;
	/** inline {@inheritdoc} */
	protected $endpoint = 'https://graph.facebook.com/v8.0/oembed_{type}';

	/** inline {@inheritdoc} */
	protected static $hosts = [
		'facebook.com',
		'fb.com',
		'fb.watch',
	];

	/** inline {@inheritdoc} */
	protected $allowedParams = [ 'maxwidth', 'maxheight', 'callback', 'omitscript', 'breaking_change', 'access_token', 'fields' ];

	/** inline {@inheritdoc} */
	protected $httpsSupport = true;

	/** inline {@inheritdoc} */
	protected $responsiveSupport = false;

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
		'~fb\.watch\/~i',
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

		'~fb\.watch\/~i',
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
		$regx = "/fb\.watch\/|facebook\.com\/[0-9]+\/videos\/|facebook\.com\/watch\//";
		$is_video = preg_match($regx, $this->url);
		$embedUrl = 'https://www.facebook.com/plugins/post.php?href={url}&width={width}&height={height}&show_text=true';

		$height= 680;
		$width = 500;
		$attr = [];
		$class = 'embedpress-facebook--iframe';
		if ( $is_video ) {
			$embedUrl = 'https://www.facebook.com/plugins/video.php?height={url_height}&href={url}&show_text=true&width={width}&t=0';
			$class = 'embedpress-facebook-vid-iframe';
		}
		$attr[] = 'class="embera-facebook-iframe-{md5} '.$class.'"';
		$attr[] = 'src="' . $embedUrl . '"';
		$attr[] = 'width="{width}"';
		$attr[] = 'height="{height}"';
		$attr[] = 'style="border:none;overflow:hidden"';
		$attr[] = 'scrolling="no"';
		$attr[] = 'frameborder="0"';

		if ( $is_video ) {
			$attr[] = 'allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"';
		}
		$attr[] = 'allowTransparency="true"';
		$attr[] = 'allowFullScreen="true"';
		$iframe = '<iframe ' . implode(' ', $attr) . '></iframe>';
		if (!empty($params['maxheight'])) {
			$height = $params['maxheight'];
		} else {
			if (!empty($params['maxwidth'])){
				if ( $is_video ) {
					$height = min(571, (int) ($params['maxwidth'] + 100));
				}else{
					$height = min(680, (int) ($params['maxwidth'] + 100));
				}
			}
		}

		if (!empty($params['maxwidth'])) {
			$width = $params['maxwidth'];
		} else {
			if (!empty($params['maxheight'])){
				if ( $is_video ) {
					$width = min(476, (int) ($params['maxheight'] - 100));
				}else{
					$width = min(500, (int) ($params['maxheight'] - 100));
				}
			}
		}
		$url_height = $height-100;

		$table = array(
			'{url}' => rawurlencode( rtrim( $this->url, '/')),
			'{md5}' => substr(md5($this->url), 0, 5),
			'{width}' => $width,
			'{height}' => $height,
			'{url_height}' => $url_height,
		);

		// Replace the html response
		$response['html'] = str_replace(array_keys($table), array_values($table), $iframe);
		return $response;
	}

}
