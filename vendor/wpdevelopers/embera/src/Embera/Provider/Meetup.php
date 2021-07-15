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
		$search = ['href="/', 'src="/'];
		$replace = ['href="'.$meetup_website.'/', 'src="'.$meetup_website.'/'];
		$hash = 'mu_'.md5( $this->getUrl());
		$filename = wp_get_upload_dir()['basedir'] ."/embedpress/$hash.txt";
		//$params =$this->getParams();

		if ( file_exists( $filename) ) {
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
		$date = $dom->find('.eventTimeDisplay-startDate span', 0);

		$date = $this->embedpress_get_markup_from_node( $date );
		$title = $dom->find('.pageHead-headline', 0);
		$title = $this->embedpress_get_markup_from_node( $title);
		$content = $dom->find('.event-description--wrapper', 0);
		$content = str_replace( $search, $replace, $this->embedpress_get_markup_from_node( $content )) ;

		$host_info = $dom->find('.event-host-info', 0);
		$host_info = str_replace( $search, $replace, $this->embedpress_get_markup_from_node( $host_info )) ;

		$attendees = $dom->find('.attendees-sample', 0);
		$attendees = str_replace( $search, $replace, $this->embedpress_get_markup_from_node( $attendees )) ;


		// Group info
		$group_name = $dom->find('.event-group-name span', 0);
		$group_name = $this->embedpress_get_markup_from_node( $group_name );
		$group_link = $dom->find('a.event-group', 0);
		$group_link = $meetup_website.$this->embedpress_get_markup_from_node( $group_link, false, 'href');
		$group_img = $dom->find('.event-group-photo', 0);
		$group_img = $this->embedpress_get_markup_from_node( $group_img, false, 'src') ;

		// Time
		$datetime = $dom->find('.eventDateTime--hover time', 0);
		$datetime = $this->embedpress_get_markup_from_node( $datetime, 'outertext');
		$recurrence = $dom->find('.eventTimeDisplay-recurrence', 0);
		$recurrence = $this->embedpress_get_markup_from_node( $recurrence);

		// Location
		$location = $dom->find('.event-info address', 0);
		$location = $this->embedpress_get_markup_from_node( $location, 'outertext');

		$data = [
			'date' => $date,
			'title' => $title,
			'host_info' => $host_info,
			'content' => $content,
			'attendees' => $attendees,
			'group_name' => $group_name,
			'group_link' => $group_link,
			'group_img' => $group_img,
			'datetime' => $datetime,
			'recurrence' => $recurrence,
			'location' => $location,
		];
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
				<div class="ep-event--attendees">
					<?php echo wp_kses_post( $attendees );?>
				</div>
			</section>

			<aside>
				<a class="ep-event-group-link" href="<?php echo esc_url( $group_link); ?>">
					<img class="ep-event-group--image" src="<?php echo esc_url( $group_img)?>" alt="<?php echo esc_attr( $title ); ?>"/ >
					<h4 class="ep-event-group--name"><?php echo wp_kses_post( $group_name );?></h4>
				</a>
                <div class="ep-event-time-location">
                    <div class="ep-event-datetime">
                        <?php echo wp_kses_post( $datetime ); ?>
                        <?php echo wp_kses_post( $recurrence ); ?>
                    </div>
                    <div class="ep-event-location">
                        <?php echo wp_kses_post( $location ); ?>
                    </div>
                </div>
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
