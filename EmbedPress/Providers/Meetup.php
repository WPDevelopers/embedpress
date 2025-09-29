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
		return (bool) preg_match('~meetup\.com/[^/]+/?$~i', $url);
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
			$hash = 'mu_' . md5($this->getUrl());
			$filename = wp_get_upload_dir()['basedir'] . "/embedpress/{$hash}.txt";

			return $this->handleRssFeed($response, $filename);
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
	 * Extract event data from DOM and return structured data
	 */
	private function extractEventDataFromDom($dom)
	{
		if (empty($dom) || !is_object($dom)) {
			return false;
		}

		// Event info
		$header_dom = $dom->find('div[data-event-label="top"]', 0);
		$body_dom = $dom->find('div[data-event-label="body"]', 0);
		$event_location_info = $dom->find('div[data-event-label="info"] .sticky', 0);
		if (empty($header_dom) || empty($body_dom) || empty($event_location_info)) {
			return false;
		}

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
		<article class="embedpress-event">
			<header class="ep-event-header">
				<!--Date-->
				<span class="ep-event--date"><?php echo esc_html($event_data['date']); ?></span>
				<!--Event Title -->
				<a class="ep-event-link" href="<?php echo esc_url($event_data['url']); ?>" target="_blank">
					<h1 class="ep-event--title"><?php echo esc_html($event_data['title']); ?></h1>
				</a>
				<!--	Event Host	-->
				<div class="ep-event--host">
					<?php echo wp_kses_post($event_data['host_info']); ?>
				</div>
			</header>

			<section class="ep-event-content">
				<div class="ep-event--description">
					<?php echo wp_kses_post($event_data['content']); ?>
				</div>
			</section>

			<aside>
				<?php echo wp_kses($event_data['event_location_info'], 'post', $allowed_protocols); ?>
			</aside>

		</article>

		<style>
			.embedpress-event a,
			.embedpress-event button {
				text-decoration: none !important;

			}

			.ep-event-header {
				text-align: left;
			}

			.ep-event-header .ep-event--host .flex {
				display: flex;
				align-items: center;
				gap: 12px;
			}

			.ep-event-header .ep-event--host .flex div {
				line-height: 1.3 !important;
			}

			.ep-event-header .ep-event--host img {
				border-radius: 50%;
			}

			.ep-event-content {
				text-align: left;
			}

			.ep-event-content h2 {
				font-size: 22px;
				margin: 10px 0;
			}

			.embedpress-event aside .sticky {
				display: flex;
				gap: 30px;
				text-align: left;
				line-height: 1.3 !important;
			}

			.embedpress-event aside .sticky .hidden {
				display: block;
			}

			.embedpress-event aside .sticky .hidden,
			.embedpress-event aside .sticky .hidden+div {
				flex: 0 0 calc(50% - 15px);
			}

			.embedpress-event aside .sticky .hidden .flex {
				gap: 8px;
			}

			.embedpress-event aside .sticky .hidden .flex button {
				background: transparent;
				padding: 3px;
				border: 0;
				outline: none;
				box-shadow: none;
			}

			/* .ep-event-header a {
				font-size: 0;
			} */
			/* .ep-event-header a div {
				font-size: 0;
			}
			.ep-event-header > a > div > div {
				border-raidus: 50%;
				overflow: hidden;
			} */
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

	/**
	 * Handle RSS feed URLs and parse events
	 */
	private function handleRssFeed($response, $filename)
	{
		// Check if cached file exists and if it contains old inline styles
		if (file_exists($filename)) {
			$cached_content = file_get_contents($filename);
			// If cached content has inline styles, regenerate it
			if (strpos($cached_content, '<style>') === false) {
				$response['html'] = $cached_content;
				return $response;
			} else {
				// Remove old cached file with inline styles
				unlink($filename);
			}
		}

		// Fetch and parse RSS feed
		$rss_content = $this->fetchRssFeed($this->getUrl());
		if (!$rss_content) {
			$response['html'] = '<div class="ep-events-error">Unable to load RSS feed.</div>';
			return $response;
		}

		// Generate HTML for events
		$events_html = $this->generateEventsHtml($rss_content);

		// Cache the result
		file_put_contents($filename, $events_html);
		embedpress_schedule_cache_cleanup();

		$response['html'] = $events_html;
		return $response;
	}

	/**
	 * Fetch RSS feed content
	 */
	private function fetchRssFeed($url)
	{
		// Use WordPress built-in fetch_feed function
		if (!function_exists('fetch_feed')) {
			include_once(ABSPATH . WPINC . '/feed.php');
		}

		$feed = fetch_feed($url);

		if (is_wp_error($feed)) {
			return false;
		}

		return $feed;
	}

	/**
	 * Generate HTML for multiple events from RSS feed
	 */
	private function generateEventsHtml($feed)
	{
		$items = $feed->get_items();

		if (empty($items)) {
			return '<div class="ep-events-empty">No upcoming events found.</div>';
		}

		// Enqueue the CSS file
		wp_enqueue_style('embedpress-meetup-events');

		// Process events with individual page data
		$processed_events = $this->processEventsWithIndividualData($items);

		ob_start();
	?>
		<div class="embedpress-meetup-events">
			<div class="ep-events-header">
				<h2 class="ep-events-title"><?php echo esc_html($feed->get_title()); ?></h2>
				<p class="ep-events-description"><?php echo esc_html($feed->get_description()); ?></p>
			</div>

			<div class="ep-events-list">
				<?php foreach ($processed_events as $event_data): ?>
					<?php echo $this->generateSingleEventHtmlFromData($event_data); ?>
				<?php endforeach; ?>
			</div>
		</div>
	<?php
		return ob_get_clean();
	}

	/**
	 * Process events by fetching individual event data for accurate dates and descriptions
	 */
	private function processEventsWithIndividualData($items)
	{
		$processed_events = [];
		$max_events = 10; // Limit to prevent too many HTTP requests
		$count = 0;

		foreach ($items as $item) {
			if ($count >= $max_events) {
				break;
			}

			$event_data = [
				'title' => $item->get_title(),
				'link' => $item->get_link(),
				'description' => $item->get_description(),
				'date' => null,
				'venue' => null,
				'hosts' => null,
				'image' => null,
				'attendees_count' => 0
			];

			// Fetch individual event page data
			$individual_data = $this->fetchIndividualEventData($item->get_link());
			if ($individual_data) {
				$event_data = array_merge($event_data, $individual_data);
			}

			// If no clean description from individual page, clean the RSS description
			if (empty($event_data['description']) || $event_data['description'] === $item->get_description()) {
				$rss_description = strip_tags($item->get_description());
				$rss_description = html_entity_decode($rss_description);
				$event_data['description'] = $this->cleanMarkdownDescription($rss_description);
			}

			$processed_events[] = $event_data;
			$count++;
		}

		return $processed_events;
	}

	/**
	 * Fetch individual event data from event page
	 */
	private function fetchIndividualEventData($event_url)
	{
		$response = wp_remote_get($event_url, ['timeout' => 10]);

		if (is_wp_error($response)) {
			return false;
		}

		$body = wp_remote_retrieve_body($response);
		if (empty($body)) {
			return false;
		}

		// Extract JSON data from the page
		$event_data = $this->extractEventDataFromPage($body);

		return $event_data;
	}

	/**
	 * Extract event data from individual event page
	 */
	private function extractEventDataFromPage($html)
	{
		// Look for JSON data in the page
		if (preg_match('/"dateTime":"([^"]+)"/', $html, $date_matches)) {
			$date_time = $date_matches[1];
		} else {
			return false;
		}

		// Extract venue information
		$venue = null;
		if (preg_match('/"venue":\s*{[^}]*"name":"([^"]+)"[^}]*"address":"([^"]+)"[^}]*"city":"([^"]+)"[^}]*"state":"([^"]+)"/', $html, $venue_matches)) {
			$venue = [
				'name' => $venue_matches[1],
				'address' => $venue_matches[2],
				'city' => $venue_matches[3],
				'state' => $venue_matches[4]
			];
		}

		// Extract clean description (without markdown)
		$description = null;
		if (preg_match('/"description":"([^"]+)"/', $html, $desc_matches)) {
			$description = $desc_matches[1];
			// Decode JSON escaped characters
			$description = json_decode('"' . $description . '"');
			// Remove markdown formatting
			$description = $this->cleanMarkdownDescription($description);
		}

		// Extract event image
		$image = null;
		// Try multiple patterns for image extraction
		if (preg_match('/"featuredEventPhoto":\s*{[^}]*"source":"([^"]+)"/', $html, $image_matches)) {
			$image = $image_matches[1];
		} elseif (preg_match('/"featuredEventPhoto":\s*{[^}]*"baseUrl":"([^"]+)"[^}]*"id":"([^"]+)"/', $html, $image_matches)) {
			$base_url = $image_matches[1];
			$image_id = $image_matches[2];
			$image = $base_url . $image_id . '/676x380.jpg';
		} elseif (preg_match('/"image":\s*\[\s*"([^"]+)"/', $html, $image_matches)) {
			$image = $image_matches[1];
		}

		// Extract attendees count
		$attendees_count = 0;
		if (preg_match('/"goingCount":\s*{[^}]*"totalCount":(\d+)/', $html, $attendees_matches)) {
			$attendees_count = intval($attendees_matches[1]);
		}

		return [
			'date' => $date_time,
			'venue' => $venue,
			'description' => $description,
			'image' => $image,
			'attendees_count' => $attendees_count
		];
	}

	/**
	 * Clean markdown formatting from description
	 */
	private function cleanMarkdownDescription($description)
	{
		// Remove markdown bold **text**
		$description = preg_replace('/\*\*(.*?)\*\*/', '$1', $description);

		// Remove markdown italic *text*
		$description = preg_replace('/\*(.*?)\*/', '$1', $description);

		// Remove markdown links [text](url)
		$description = preg_replace('/\[([^\]]+)\]\([^\)]+\)/', '$1', $description);

		// Remove markdown headers
		$description = preg_replace('/^#+\s*(.*)$/m', '$1', $description);

		// Clean up extra whitespace
		$description = preg_replace('/\s+/', ' ', $description);
		$description = trim($description);

		return $description;
	}

	/**
	 * Generate HTML for a single event from processed data
	 */
	private function generateSingleEventHtmlFromData($event_data)
	{
		$title = $event_data['title'];
		$link = $event_data['link'];
		$description = $event_data['description'];

		// Format the actual event date
		if (!empty($event_data['date'])) {
			$date_timestamp = strtotime($event_data['date']);
			$day_name = date_i18n('D', $date_timestamp);
			$date_formatted = date_i18n('M j, Y, g:i A', $date_timestamp);
			$timezone = date_i18n('T', $date_timestamp);
			$full_date = strtoupper($day_name) . ', ' . strtoupper($date_formatted) . ' ' . $timezone;
		} else {
			$full_date = 'DATE TBA';
		}

		// Limit description length for better display
		if (strlen($description) > 200) {
			$description = substr($description, 0, 200) . '...';
		}

		// Format venue information
		$venue_info = '';
		if (!empty($event_data['venue'])) {
			$venue = $event_data['venue'];
			$venue_info = $venue['name'];
			if (!empty($venue['city']) && !empty($venue['state'])) {
				$venue_info .= ', ' . $venue['city'] . ', ' . $venue['state'];
			}
		}

		// Get attendees count
		$attendees_count = !empty($event_data['attendees_count']) ? $event_data['attendees_count'] : 0;
		$attendees_text = $attendees_count . ' attendee' . ($attendees_count !== 1 ? 's' : '');

		ob_start();
	?>
		<article class="ep-single-event">
			<div class="ep-event-content">
				<div class="ep-event-info">
					<div class="ep-event-top-content">

						<div class="event-content">
							<div class="ep-event-date"><?php echo esc_html($full_date); ?></div>
							<h3 class="ep-event-title">
								<a href="<?php echo esc_url($link); ?>" target="_blank" rel="noopener">
									<?php echo esc_html($title); ?>
								</a>
							</h3>
							<?php if (!empty($venue_info)): ?>
								<div class="ep-event-venue">
									<span class="ep-venue-icon">📍</span>
									<?php echo esc_html($venue_info); ?>
								</div>
							<?php endif; ?>
							<div class="ep-event-description">
								<?php echo wp_kses_post($description); ?>
							</div>
						</div>
						<?php if (!empty($event_data['image'])): ?>
							<div class="ep-event-image">
								<img src="<?php echo esc_url($event_data['image']); ?>" alt="<?php echo esc_attr($title); ?>" loading="lazy">
							</div>
						<?php endif; ?>
					</div>

					<div class="ep-event-footer">
						<div class="ep-event-attendees">

							<span class="ep-attendees-count"><?php echo esc_html($attendees_text); ?></span>
						</div>
						<a href="<?php echo esc_url($link); ?>" class="ep-attend-button" target="_blank" rel="noopener">
							Attend
						</a>
					</div>
				</div>

			</div>
		</article>
<?php
		return ob_get_clean();
	}
}
