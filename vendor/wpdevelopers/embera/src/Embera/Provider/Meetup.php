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

namespace Embera\Provider;

use Embera\Url;

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

	/** inline {@inheritdoc} */
	public function normalizeUrl(Url $url)
	{
		$url->convertToHttps();
		$url->removeQueryString();

		return $url;
	}

	public function getStaticResponse() {
		$meetup_website = 'https://meetup.com';
		$response = [];
		$response['type'] = 'rich';
		$response['provider_name'] = 'Meetup';
		$response['provider_url'] = $meetup_website;
		$response['url'] = $this->getUrl();
		$hash = 'mu_'.md5( $this->getUrl());
		$filename = wp_get_upload_dir()['basedir'] ."/embedpress/$hash.txt";
		add_filter('safe_style_css', [$this, 'safe_style_css']);
		$allowed_protocols = wp_allowed_protocols();
		$allowed_protocols[] = 'data';

		if (file_exists( $filename) ) {
			$response['html'] = file_get_contents( $filename);
			return $response;
		}else{
			$t = wp_remote_get( $this->getUrl() , ['timeout'=>10]);
			if ( !is_wp_error( $t) ) {
				if ( $meetup_page_content = wp_remote_retrieve_body( $t) ) {
					$dom = str_get_html($meetup_page_content);
				}
			}
		}


		if ( empty( $dom) || !is_object( $dom) ) {
			$response['html'] = $this->getUrl();
			return $response;
		}


		// Event info
		$header_dom = $dom->find('div[data-event-label="top"]', 0);
		$body_dom = $dom->find('div[data-event-label="body"]', 0);
		$event_location_info = $dom->find( 'div[data-event-label="info"] .sticky', 0);
		if(empty($header_dom) || empty($body_dom) || empty($event_location_info)){
			return [];
		}
		$dewqijm = $event_location_info->find('.dewqijm', 0)->find('span', 0);
		if(!empty($dewqijm)){
			$img = $dewqijm->find('noscript', 0)->innertext();
			$dewqijm->removeChild($dewqijm->find('img', 1));
			$dewqijm->find('noscript', 0)->remove();
			$dewqijm->outertext = $dewqijm->makeup() . $dewqijm->innertext . $img . '</span>';
		}


		$date = $this->embedpress_get_markup_from_node( $header_dom->find( 'time', 0) );
		$title = $this->embedpress_get_markup_from_node($header_dom->find('h1', 0));
		$emrv9za = $body_dom->find('div.emrv9za', 0);
		$picture = $emrv9za->find('picture[data-testid="event-description-image"]', 0);
		if(!empty($picture) && $picture->find('img', 0)){
			if($picture->find('noscript', 0)){
				$picture->find('img', 0)->remove();
				$img = $picture->find('noscript', 0)->innertext();
				$img = str_replace('/_next/image/', 'https://www.meetup.com/_next/image/', $img);
				$picture->find('noscript', 0)->remove();
				$span = $picture->find('div', 0)->find('span', 0);
				$span->outertext = $span->makeup() . $span->innertext . $img . '</span>';
			}
			else{
				$img = $picture->find('img', 0);
				$src = $img->src;
				if($src && strpos($src, '/_next/image/') === 0){
					$img->src = 'https://www.meetup.com' . $img->src;
				}
				else if(strpos($src, '//') === false && $srcset = $img->srcset){
					$img->src = $this->getLargestImage($srcset);
					if(strpos($img->src, '//') === false){
						$img->src = 'https://www.meetup.com' . $img->src;
					}
				}
			}
		}

		$content = $this->embedpress_get_markup_from_node( $emrv9za ) ;



		$host_info = $header_dom->find('a[data-event-label="hosted-by"]', 0);
		ob_start();
		echo $host_info;
		$host_info = ob_get_clean();


		ob_start();
		echo $event_location_info;
		$event_location_info = ob_get_clean();

		ob_start();
		?>
        <article class="embedpress-event">
            <header class="ep-event-header">
                <!--Date-->
                <span class="ep-event--date"><?php echo esc_html( $date); ?></span>
                <!--Event Title -->
                <a class="ep-event-link" href="<?php echo esc_url( $this->getUrl()); ?>" target="_blank">
                    <h1 class="ep-event--title"><?php echo esc_html( $title); ?></h1>
                </a>
                <!--	Event Host	-->
                <div class="ep-event--host">
					<?php echo wp_kses_post( $host_info );?>
                </div>
            </header>

            <section class="ep-event-content">
                <div class="ep-event--description">
					<?php echo wp_kses_post( $content );?>
                </div>
            </section>

            <aside>
				<?php echo wp_kses( $event_location_info, 'post', $allowed_protocols); ?>
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
			.embedpress-event aside .sticky .hidden + div {
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
		$event_output = ob_get_clean();
		file_put_contents( $filename, $event_output);
		embedpress_schedule_cache_cleanup();
		$response['html'] = $event_output;
		remove_filter('safe_style_css', [$this, 'safe_style_css']);
		return $response;
	}

	public function safe_style_css($styles){
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
	public function embedpress_get_markup_from_node( $node, $method='innertext', $attr_name=''){
		if ( !empty( $node) && is_object( $node) ) {
			if ( !empty( $attr_name) ) {
				return $node->getAttribute( $attr_name );
			}
			if ( !empty( $method) && method_exists( $node, $method) ) {
				return $node->{$method}();
			}
			return '';
		}
		return '';
	}

	function getLargestImage($srcsetString){
		$images = array();
		// split on comma
		$srcsetArray = explode(",", $srcsetString);
		foreach($srcsetArray as $srcString){
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
