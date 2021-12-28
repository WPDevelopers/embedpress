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

		$date = $this->embedpress_get_markup_from_node( $header_dom->find( 'time', 0) );
		$title = $this->embedpress_get_markup_from_node($header_dom->find('h1', 0));

		$content = $this->embedpress_get_markup_from_node( $body_dom->find('div.emrv9za', 0) ) ;


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
				<?php echo wp_kses_post( $event_location_info); ?>
            </aside>

        </article>



		<?php
		$event_output = ob_get_clean();
		file_put_contents( $filename, $event_output);
		embedpress_schedule_cache_cleanup();
		$response['html'] = $event_output;
		return $response;
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

}
