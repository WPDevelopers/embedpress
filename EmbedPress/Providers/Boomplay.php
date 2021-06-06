<?php
namespace EmbedPress\Providers;

use Embera\Provider\ProviderAdapter;
use Embera\Provider\ProviderInterface;
use Embera\Url;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed. or EmbedPress is not loaded yet.");

/**
 * Entity responsible to support Boomplay embeds.
 *
 * @package     EmbedPress
 * @subpackage  EmbedPress/Providers
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2021 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.5.0
 */
class Boomplay extends ProviderAdapter implements ProviderInterface
{
	/**
	 * The regex which identifies Boomplay URLs.
	 *
	 * @since   1.5.0
	 * @access  private
	 *
	 * @var     string
	 */
	private $urlRegexPattern = '/boomplay\.com\/(songs|playlists|albums)\/(\d+)/';

	/**
	 * Method that verifies if the embed URL belongs to Boomplay.
	 *
	 * @param Url $url
	 * @return  boolean
	 *
	 */
	public function validateUrl(Url $url)
	{
		return (bool) preg_match($this->urlRegexPattern, $this->url);
	}

	/**
	 * This method fakes an Oembed response.
	 *
	 * @since   1.5.0
	 *
	 * @return  array
	 */
	public function fakeResponse()
	{
		$url         = $this->getUrl();
		$providerUrl = 'https://www.boomplay.com';

		if (preg_match("{$this->urlRegexPattern}i", $url, $matches)) {
			$type = $matches[1]; // songs | playlists | album
			$content_id = $matches[2];
			$endpoint_type = in_array( $type, ['album', 'playlists']) ? 'COL': 'MUSIC';

			$width = isset( $this->config['maxwidth']) ? $this->config['maxwidth']: '100%';
			$height = isset( $this->config['maxheight']) ? $this->config['maxheight']: 450;

			$html = "<iframe src='https://www.boomplay.com/embed/$content_id/$endpoint_type' frameborder='0' height='$height' width='$width'></iframe>";

			$response = [
				'type'          => $type,
				'content_id'    => $content_id,
				'provider_name' => 'Boomplay',
				'provider_url'  => $providerUrl,
				'url'           => $url,
				'html'          => $html,
			];
		} else {
			$response = [];
		}

		return $response;
	}
	/** inline @inheritDoc */
	public function modifyResponse( array $response = [])
	{
		return $this->fakeResponse();
	}
}
