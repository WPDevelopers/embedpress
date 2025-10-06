<?php

/**
 * Meetup.php
 *
 * @package Embera
 * @author Michael Pratt <yo@michael-pratt.com>
 * @link   http://www.michael-pratt.com/
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace EmbedPress\Providers;

use EmbedPress\Includes\Classes\Helper;
use Embera\Provider\ProviderAdapter;
use Embera\Provider\ProviderInterface;
use Embera\Url;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Meetup Provider
 * @link https://meetup.com
 */
class Meetup extends ProviderAdapter implements ProviderInterface
{
	/** inline {@inheritdoc} */
	protected $shouldSendRequest = false;
	/** inline {@inheritdoc} */
	protected $endpoint = 'https://api.meetup.com/oembed?format=json';

	/** inline {@inheritdoc} */
	protected static $hosts = [
		'meetup.com'
	];

	/** inline {@inheritdoc} */
	protected $httpsSupport = true;

	/** inline {@inheritdoc} */
	protected $responsiveSupport = true;

	/** inline {@inheritdoc} */
	public function validateUrl(Url $url)
	{
		return (bool) (
			preg_match('~meetup\.com/(?:.+)~i', (string) $url) ||
			preg_match('~meetu\.ps/(?:\w+)/?$~i', (string) $url)
		);
	}

	/**
	 * Check if the URL is an RSS feed URL or a group URL that should be treated as RSS
	 */
	private function isRssUrl($url)
	{
		// Check if it's already an RSS URL
		if (preg_match('~meetup\.com/.+/events/rss~i', $url)) {
			return true;
		}

		// Check if it's a group URL that should be converted to RSS
		if (preg_match('~meetup\.com/[^/]+/?$~i', $url)) {
			return true;
		}

		// Check if it's an events URL that should be converted to RSS
		if (preg_match('~meetup\.com/[^/]+/events/?$~i', $url)) {
			return true;
		}

		return false;
	}

	/**
	 * Check if pro features are enabled
	 */
	protected function isProFeaturesEnabled()
	{
		// Use the Helper class to check pro features
		if (class_exists('\EmbedPress\Includes\Classes\Helper')) {
			return Helper::is_pro_features_enabled();
		}

		// Fallback: check if pro plugin is active
		return function_exists('is_embedpress_pro_active') && is_embedpress_pro_active();
	}

	/**
	 * Get pro upgrade message for RSS feeds using EmbedPress styling
	 */
	private function getProUpgradeMessage($response)
	{
		// Get the alert icon URL
		$alert_icon_url = defined('EMBEDPRESS_URL_ASSETS') ? EMBEDPRESS_URL_ASSETS . 'images/alert.svg' : '';

		$response['html'] = '<div class="embedpress-meetup-upgrade-notice" style="
			width: calc(100% - 30px);
			max-width: 500px;
			margin: 20px auto;
			background: #fff;
			border-radius: 20px;
			padding: 30px;
			display: flex;
			flex-direction: column;
			align-items: center;
			text-align: center;
		">
			' . ($alert_icon_url ? '<img src="' . esc_url($alert_icon_url) . '" alt="" style="height: 100px; margin-bottom: 20px;">' : '') . '
			<h2 style="
				font-size: 32px;
				font-weight: 450;
				color: #131f4d;
				margin-bottom: 15px;
				margin-top: 0;
			">
				' . __('Meetup Events Feed', 'embedpress') . '
			</h2>
			<p style="
				font-size: 14px;
				font-weight: 400;
				color: #7c8db5;
				margin-top: 10px;
				margin-bottom: 15px;
				line-height: 1.5;
			">
				' . sprintf(
					__('Display multiple Meetup events from RSS feeds is a premium feature. You need to upgrade to the <a href="%s" target="_blank">Premium</a> Version to use this feature.', 'embedpress'),
					'https://wpdeveloper.com/in/upgrade-embedpress'
				) . '
			</p>
			<p style="
				font-size: 12px;
				font-weight: 400;
				color: #7c8db5;
				margin: 0;
			">
				' . __('For single events, use the individual event URL instead of the RSS feed.', 'embedpress') . '
			</p>
		</div>

		<style>
		.embedpress-meetup-upgrade-notice p a {
			text-decoration: underline;
			font-weight: 700;
			color: #131f4d;
		}
		.embedpress-meetup-upgrade-notice p a:hover {
			color: #0f1a3a;
		}
		</style>';

		return $response;
	}

	/** inline {@inheritdoc} */
	public function normalizeUrl(Url $url)
	{
		$url->convertToHttps();
		$url->removeQueryString();

		$url_string = (string) $url;

		// If it's a group URL without /events/rss, append it
		if (preg_match('~meetup\.com/[^/]+/?$~i', $url_string)) {
			// Don't append if it already has /events/rss
			if (!preg_match('~meetup\.com/.+/events/rss~i', $url_string)) {
				$url_string = rtrim($url_string, '/') . '/events/rss';
				$url = new Url($url_string);
			}
		}

		// If it's an events URL without /rss, append it
		if (preg_match('~meetup\.com/[^/]+/events/?$~i', $url_string)) {
			// Don't append if it already has /rss
			if (!preg_match('~meetup\.com/.+/events/rss~i', $url_string)) {
				$url_string = rtrim($url_string, '/') . '/rss';
				$url = new Url($url_string);
			}
		}

		return $url;
	}

	public function getStaticResponse()
	{
		$meetup_website = 'https://meetup.com';
		$response = [];
		$response['type'] = 'rich';
		$response['provider_name'] = 'Meetup';
		$response['provider_url'] = $meetup_website;
		$response['url'] = $this->getUrl();

		add_filter('safe_style_css', [$this, 'safe_style_css']);
		$allowed_protocols = wp_allowed_protocols();
		$allowed_protocols[] = 'data';



		// Check if this is an RSS feed URL
		if ($this->isRssUrl($this->getUrl())) {
			// Check if pro features are enabled for RSS feeds
			if (!$this->isProFeaturesEnabled()) {
				return $this->getProUpgradeMessage($response);
			}

			// Delegate RSS feed handling to the pro plugin
			if (class_exists('\Embedpress\Pro\Providers\Meetup')) {
				$hash = 'mu_' . md5($this->getUrl());
				$cache_duration = apply_filters('embedpress_meetup_rss_cache_duration', 3600 * 6); // 6 hour default
				$filename = wp_get_upload_dir()['basedir'] . "/embedpress/{$hash}.txt";

				return \Embedpress\Pro\Providers\Meetup::handleRssFeed($response, $filename, $this->getUrl(), $cache_duration);
			} else {
				// Pro plugin not available, show upgrade message
				return $this->getProUpgradeMessage($response);
			}
		}

		// Get cached data or fetch new data
		$event_data = $this->getCachedEventData();

		if (!$event_data) {
			$t = wp_remote_get($this->getUrl(), ['timeout' => 10]);
			if (!is_wp_error($t)) {
				if ($meetup_page_content = wp_remote_retrieve_body($t)) {
					$dom = str_get_html($meetup_page_content);
					$event_data = $this->extractEventDataFromDom($dom);
					if ($event_data) {
						$this->cacheEventData($event_data);
					}
				}
			}
		}


		if (!$event_data) {
			$response['html'] = $this->getUrl();
			return $response;
		}

		// Generate HTML from cached data
		$response['html'] = $this->generateEventHtml($event_data, $allowed_protocols);
		remove_filter('safe_style_css', [$this, 'safe_style_css']);
		return $response;
	}

	/**
	 * Get cached event data using transients
	 */
	private function getCachedEventData()
	{
		$url_hash = md5($this->getUrl());
		$data_transient_key = 'meetup_event_data_' . $url_hash;

		return get_transient($data_transient_key);
	}

	/**
	 * Cache event data using transients
	 */
	private function cacheEventData($event_data, $expiration = 3600)
	{
		$url_hash = md5($this->getUrl());
		$data_transient_key = 'meetup_event_data_' . $url_hash;

		set_transient($data_transient_key, $event_data, $expiration);
	}

	/**
	 * Extract event data from Next.js JSON or fallback to DOM parsing
	 */
	private function extractEventDataFromDom($dom)
	{
		if (empty($dom) || !is_object($dom)) {
			return false;
		}

		// First, try to extract from __NEXT_DATA__ JSON (new Meetup structure)
		$next_data_script = $dom->find('script#__NEXT_DATA__', 0);
		if ($next_data_script) {
			$json_data = $next_data_script->innertext();
			$data = json_decode($json_data, true);

			if ($data && isset($data['props']['pageProps']['event'])) {
				$event = $data['props']['pageProps']['event'];
				return $this->extractFromNextData($event);
			}
		}

		// Fallback to old DOM parsing method
		$header_dom = $dom->find('div[data-event-label="top"]', 0);
		$body_dom = $dom->find('div[data-event-label="body"]', 0);
		$event_location_info = $dom->find('div[data-event-label="info"] .sticky', 0);

		if (empty($header_dom) || empty($body_dom) || empty($event_location_info)) {
			return false;
		}

		return $this->extractFromDomElements($header_dom, $body_dom, $event_location_info);
	}

	/**
	 * Extract event data from Next.js __NEXT_DATA__ JSON
	 */
	private function extractFromNextData($event)
	{
		// Extract basic event info
		$title = isset($event['title']) ? $event['title'] : '';
		$description = isset($event['description']) ? $event['description'] : '';
		$event_url = isset($event['eventUrl']) ? $event['eventUrl'] : $this->getUrl();

		// Extract date/time
		$date_time = '';
		if (isset($event['dateTime'])) {
			$timestamp = strtotime($event['dateTime']);
			$date_time = date('l, F j, Y · g:i A', $timestamp);
			if (isset($event['endTime'])) {
				$end_timestamp = strtotime($event['endTime']);
				$date_time .= ' to ' . date('g:i A T', $end_timestamp);
			}
		}

		// Extract hosts
		$hosts_html = '';
		if (isset($event['eventHosts']) && is_array($event['eventHosts'])) {
			$host_names = array();
			foreach ($event['eventHosts'] as $host) {
				if (isset($host['name'])) {
					$host_names[] = esc_html($host['name']);
				}
			}
			if (!empty($host_names)) {
				$hosts_html = '<div class="ep-event-hosts">Hosted by ' . implode(', ', $host_names) . '</div>';
			}
		}

		// Extract venue/location
		$location_html = '';
		if (isset($event['eventType']) && $event['eventType'] === 'ONLINE') {
			$location_html = '<div class="ep-event-location"><strong>📍 Online event</strong></div>';
		} elseif (isset($event['venue'])) {
			$venue = $event['venue'];
			$location_parts = array();
			if (!empty($venue['name'])) $location_parts[] = $venue['name'];
			if (!empty($venue['address'])) $location_parts[] = $venue['address'];
			if (!empty($venue['city'])) $location_parts[] = $venue['city'];
			if (!empty($venue['state'])) $location_parts[] = $venue['state'];

			if (!empty($location_parts)) {
				$location_html = '<div class="ep-event-location"><strong>📍 ' . esc_html(implode(', ', $location_parts)) . '</strong></div>';
			}
		}

		// Extract featured image
		$image_html = '';
		if (isset($event['featuredEventPhoto']['source'])) {
			$image_url = esc_url($event['featuredEventPhoto']['source']);
			$image_html = '<div class="ep-event-single-image"><img src="' . $image_url . '" alt="' . esc_attr($title) . '" /></div>';
		}

		// Format description (convert markdown-style links to HTML)
		$description_html = $this->formatDescription($description);

		return array(
			'date' => $date_time,
			'title' => $title,
			'content' => $image_html . '<div class="ep-event-description">' . $description_html . '</div>',
			'host_info' => $hosts_html,
			'event_location_info' => $location_html,
			'url' => $event_url
		);
	}

	/**
	 * Format description text (convert markdown-style links to HTML)
	 */
	private function formatDescription($description)
	{
		// Convert markdown links [text](url) to HTML
		$description = preg_replace('/\[([^\]]+)\]\(([^\)]+)\)/', '<a href="$2" target="_blank" rel="noopener">$1</a>', $description);

		// Convert **bold** to <strong>
		$description = preg_replace('/\*\*([^\*]+)\*\*/', '<strong>$1</strong>', $description);

		// Convert line breaks to <br>
		$description = nl2br($description);

		return $description;
	}

	/**
	 * Extract event data from DOM elements (legacy method)
	 */
	private function extractFromDomElements($header_dom, $body_dom, $event_location_info)
	{

		// Process location info images
		$dewqijm = $event_location_info->find('.dewqijm', 0)->find('span', 0);
		if (!empty($dewqijm)) {
			$img = $dewqijm->find('noscript', 0)->innertext();
			$dewqijm->removeChild($dewqijm->find('img', 1));
			$dewqijm->find('noscript', 0)->remove();
			$dewqijm->outertext = $dewqijm->makeup() . $dewqijm->innertext . $img . '</span>';
		}

		$date = $this->embedpress_get_markup_from_node($header_dom->find('time', 0));
		$title = $this->embedpress_get_markup_from_node($header_dom->find('h1', 0));
		$emrv9za = $body_dom->find('div.emrv9za', 0);
		$picture = $emrv9za->find('picture[data-testid="event-description-image"]', 0);
		if (!empty($picture) && $picture->find('img', 0)) {
			if ($picture->find('noscript', 0)) {
				$picture->find('img', 0)->remove();
				$img = $picture->find('noscript', 0)->innertext();
				$img = str_replace('/_next/image/', 'https://www.meetup.com/_next/image/', $img);
				$picture->find('noscript', 0)->remove();
				$span = $picture->find('div', 0)->find('span', 0);
				$span->outertext = $span->makeup() . $span->innertext . $img . '</span>';
			} else {
				$img = $picture->find('img', 0);
				$src = $img->src;
				if ($src && strpos($src, '/_next/image/') === 0) {
					$img->src = 'https://www.meetup.com' . $img->src;
				} else if (strpos($src, '//') === false && $srcset = $img->srcset) {
					$img->src = $this->getLargestImage($srcset);
					if (strpos($img->src, '//') === false) {
						$img->src = 'https://www.meetup.com' . $img->src;
					}
				}
			}
		}

		$content = $this->embedpress_get_markup_from_node($emrv9za);

		$host_info = $header_dom->find('a[data-event-label="hosted-by"]', 0);
		ob_start();
		echo $host_info;
		$host_info = ob_get_clean();

		ob_start();
		echo $event_location_info;
		$event_location_info = ob_get_clean();

		// Return structured data instead of generating HTML
		return [
			'date' => $date,
			'title' => $title,
			'content' => $content,
			'host_info' => $host_info,
			'event_location_info' => $event_location_info,
			'url' => $this->getUrl()
		];
	}

	/**
	 * Generate HTML from cached event data
	 */
	private function generateEventHtml($event_data, $allowed_protocols)
	{
		ob_start();
?>
		<article class="embedpress-event embedpress-event--modern">
			<div class="ep-event-card">
				<header class="ep-event-header">
					<div class="ep-event-meta">
						<span class="ep-event--date">
							<svg class="ep-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
								<line x1="16" y1="2" x2="16" y2="6"></line>
								<line x1="8" y1="2" x2="8" y2="6"></line>
								<line x1="3" y1="10" x2="21" y2="10"></line>
							</svg>
							<?php echo esc_html($event_data['date']); ?>
						</span>
						<?php if (!empty($event_data['event_location_info'])): ?>
							<div class="ep-event--location">
								<?php echo wp_kses($event_data['event_location_info'], 'post', $allowed_protocols); ?>
							</div>
						<?php endif; ?>
					</div>

					<a class="ep-event-link" href="<?php echo esc_url($event_data['url']); ?>" target="_blank" rel="noopener noreferrer">
						<h2 class="ep-event--title"><?php echo esc_html($event_data['title']); ?></h2>
					</a>

					<?php if (!empty($event_data['host_info'])): ?>
						<div class="ep-event--host">
							<?php echo wp_kses_post($event_data['host_info']); ?>
						</div>
					<?php endif; ?>
				</header>

				<section class="ep-event-content">
					<div class="ep-event--description">
						<?php echo wp_kses_post($event_data['content']); ?>
					</div>
				</section>

				<footer class="ep-event-footer">
					<a href="<?php echo esc_url($event_data['url']); ?>" target="_blank" rel="noopener noreferrer" class="ep-event-cta">
						View Event Details
						<svg class="ep-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<line x1="5" y1="12" x2="19" y2="12"></line>
							<polyline points="12 5 19 12 12 19"></polyline>
						</svg>
					</a>
				</footer>
			</div>
		</article>

		<style>
			/* Modern Meetup Event Card Styles */
			.embedpress-event--modern {
				font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
				margin: 24px 0;
				max-width: 100%;
			}

			.embedpress-event--modern .ep-event-card {
				background: #ffffff;
				border: 1px solid #e5e7eb;
				border-radius: 12px;
				overflow: hidden;
				box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
				transition: all 0.3s ease;
			}

			.embedpress-event--modern .ep-event-card:hover {
				box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
				transform: translateY(-2px);
			}

			/* Header Section */
			.embedpress-event--modern .ep-event-header {
				padding: 24px;
				border-bottom: 1px solid #f3f4f6;
			}

			.embedpress-event--modern .ep-event-meta {
				display: flex;
				flex-wrap: wrap;
				gap: 16px;
				margin-bottom: 16px;
			}

			.embedpress-event--modern .ep-event--date {
				display: inline-flex;
				align-items: center;
				gap: 6px;
				color: #6b7280;
				font-size: 14px;
				font-weight: 500;
				padding: 6px 12px;
				background: #f9fafb;
				border-radius: 6px;
			}

			.embedpress-event--modern .ep-event--location {
				display: inline-flex;
				align-items: center;
				gap: 6px;
				color: #059669;
				font-size: 14px;
				font-weight: 500;
				padding: 6px 12px;
				background: #ecfdf5;
				border-radius: 6px;
			}

			.embedpress-event--modern .ep-icon {
				flex-shrink: 0;
				width: 16px;
				height: 16px;
			}

			.embedpress-event--modern .ep-event-link {
				text-decoration: none;
				color: inherit;
				display: block;
				transition: color 0.2s ease;
			}

			.embedpress-event--modern .ep-event-link:hover {
				color: #007cba;
			}

			.embedpress-event--modern .ep-event--title {
				font-size: 24px;
				font-weight: 700;
				line-height: 1.3;
				color: #111827;
				margin: 0 0 16px 0;
				transition: color 0.2s ease;
			}

			.embedpress-event--modern .ep-event-link:hover .ep-event--title {
				color: #007cba;
			}

			.embedpress-event--modern .ep-event--host {
				display: flex;
				align-items: center;
				gap: 8px;
				color: #6b7280;
				font-size: 14px;
			}

			.embedpress-event--modern .ep-event--host::before {
				content: "👤";
				font-size: 16px;
			}

			/* Content Section */
			.embedpress-event--modern .ep-event-content {
				padding: 24px;
			}

			.embedpress-event--modern .ep-event--description {
				color: #374151;
				font-size: 15px;
				line-height: 1.6;
			}

			.embedpress-event--modern .ep-event-image {
				margin-bottom: 16px;
				border-radius: 8px;
				overflow: hidden;
			}

			.embedpress-event--modern .ep-event-image img {
				width: 100%;
				height: auto;
				display: block;
				transition: transform 0.3s ease;
			}

			.embedpress-event--modern .ep-event-card:hover .ep-event-image img {
				transform: scale(1.02);
			}

			.embedpress-event--modern .ep-event-description p {
				margin: 0 0 12px 0;
			}

			.embedpress-event--modern .ep-event-description p:last-child {
				margin-bottom: 0;
			}

			.embedpress-event--modern .ep-event-description a {
				color: #007cba;
				text-decoration: underline;
				transition: color 0.2s ease;
			}

			.embedpress-event--modern .ep-event-description a:hover {
				color: #005a87;
			}

			.embedpress-event--modern .ep-event-description strong {
				color: #111827;
				font-weight: 600;
			}

			/* Footer Section */
			.embedpress-event--modern .ep-event-footer {
				padding: 20px 24px;
				background: #f9fafb;
				border-top: 1px solid #e5e7eb;
			}

			.embedpress-event--modern .ep-event-cta {
				display: inline-flex;
				align-items: center;
				gap: 8px;
				padding: 10px 20px;
				background: #007cba;
				color: #ffffff;
				font-size: 14px;
				font-weight: 600;
				border-radius: 6px;
				text-decoration: none;
				transition: all 0.2s ease;
			}

			.embedpress-event--modern .ep-event-cta:hover {
				background: #005a87;
				transform: translateX(2px);
				color: #ffffff;
			}

			.embedpress-event--modern .ep-event-cta .ep-icon {
				transition: transform 0.2s ease;
			}

			.embedpress-event--modern .ep-event-cta:hover .ep-icon {
				transform: translateX(3px);
			}

			/* Responsive Design */
			@media (max-width: 640px) {
				.embedpress-event--modern .ep-event-header,
				.embedpress-event--modern .ep-event-content,
				.embedpress-event--modern .ep-event-footer {
					padding: 16px;
				}

				.embedpress-event--modern .ep-event--title {
					font-size: 20px;
				}

				.embedpress-event--modern .ep-event-meta {
					flex-direction: column;
					gap: 8px;
				}

				.embedpress-event--modern .ep-event-cta {
					width: 100%;
					justify-content: center;
				}
			}
		</style>

	<?php
		return ob_get_clean();
	}

	public function safe_style_css($styles)
	{
		$styles[] = 'position';
		$styles[] = 'display';
		$styles[] = 'opacity';
		$styles[] = 'box-sizing';
		$styles[] = 'left';
		$styles[] = 'bottom';
		$styles[] = 'right';
		$styles[] = 'top';
		return $styles;
	}

	/**
	 * It checks for data in the node before returning.
	 *
	 * @param \simple_html_dom_node $node
	 * @param string               $method
	 * @param string               $attr_name
	 *
	 * @return string it returns data from the node if found or empty strings otherwise.
	 */
	public function embedpress_get_markup_from_node($node, $method = 'innertext', $attr_name = '')
	{
		if (!empty($node) && is_object($node)) {
			if (!empty($attr_name)) {
				return $node->getAttribute($attr_name);
			}
			if (!empty($method) && method_exists($node, $method)) {
				return $node->{$method}();
			}
			return '';
		}
		return '';
	}

	function getLargestImage($srcsetString)
	{
		$images = array();
		// split on comma
		$srcsetArray = explode(",", $srcsetString);
		foreach ($srcsetArray as $srcString) {
			// split on whitespace - optional descriptor
			$imgArray = explode(" ", trim($srcString));
			// cast w or x descriptor as an Integer
			$images[(int)$imgArray[1]] = $imgArray[0];
		}
		// find the max
		$maxIndex = max(array_keys($images));
		return $images[$maxIndex];
	}







}
