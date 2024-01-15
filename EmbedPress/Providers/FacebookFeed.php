<?php

namespace EmbedPress\Providers;

use Embera\Provider\ProviderAdapter;
use Embera\Provider\ProviderInterface;
use Embera\Url;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity responsible to support FacebookFeed embeds.
 *
 * @package     EmbedPress
 * @subpackage  EmbedPress/Providers
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2023 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.0.0
 */
class FacebookFeed extends ProviderAdapter implements ProviderInterface
{
    /** inline {@inheritdoc} */
    protected static $hosts = ["facebook.com"];
    /**
     * Method that verifies if the embed URL belongs to FacebookFeed.
     *
     * @param Url $url
     * @return  boolean
     * @since   1.0.0
     *
     */
    public function validateUrl(Url $url)
    {
        $facebookPageRegex = '/https:\/\/www\.facebook\.com\/\d+/';
        return preg_match($facebookPageRegex, $url) === 1;
    }

    public function isValidFacebookUrl($url)
    {
        $facebookPageRegex = '/https:\/\/www\.facebook\.com\/\d+/';
        return preg_match($facebookPageRegex, $url) === 1;
    }

    public function getFBPageID($url)
    {
        $pattern = '/facebook\.com\/(\d+)/';
        preg_match($pattern, $url, $matches);

        if (isset($matches[1])) {
            return $matches[1];
        } else {
            return null;
        }
    }

    public function getFacebookFeedData($type)
    {
        $page_id = $this->getFBPageID($this->url);

        $fb_feed_data = get_transient("facebook_feed_data_$page_id");

        return $fb_feed_data[$page_id][$type]['data'];
    }

    public function firstEmbedVideo($video_id, $page_id, $width, $height)
    {
        return '<div class="first-embed-video">
        <iframe width="' . esc_attr($width) . '" height="' . esc_attr($height) . '" src="https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/' . $page_id . '/videos/' . $video_id . '/&autoplay=true" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
        </div>';
    }

    public function createFeedTemplate($type, $page_id, $width = 600, $height = 400)
    {
        $videos = $this->getFacebookFeedData($type);


        ob_start();

        // Wrap the entire content in a container div
        echo '<div class="video-container">';

        // Embed the first video separately, if available
        if (!empty($videos) && isset($videos[0]['id'])) {
            echo $this->firstEmbedVideo($videos[0]['id'], $page_id, $width, $height);
        }

        echo '<div class="facebook-video-container">';

        // Output iframe for each video
        foreach ($videos as $video) {
            $videoId = esc_attr($video['id']);
            $thumbnailUrl = esc_attr($video['thumbnail_url']);
            $iframeSrc = "https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/{$page_id}/$type/{$videoId}/";
            echo '<div data-video-id="' . esc_attr($videoId) . '" class="facebook-video-item"><img src="' . esc_url($thumbnailUrl) . '"/></div>';
        }

        // Close the container div
        echo '</div>';
        echo '</div>';

        ?>
        <script type="text/javascript">
            console.log('akash');
            jQuery(document).ready(function() {

                function playVideo(videoId, pageId, type) {
                    var iframeSrc = `https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/${pageId}/${type}/${videoId}&autoplay=1`;
                    jQuery('.first-embed-video iframe').attr('src', iframeSrc);
                }

                jQuery('[data-video-id].facebook-video-item').on('click', function() {
                    var videoId = jQuery(this).data('video-id');
                    var pageId = "<?php echo $page_id; ?>";
                    var type = "<?php echo $type; ?>";

                    console.log(videoId);

                    playVideo(videoId, pageId, type);

                });
            });
        </script>

<?php

        return ob_get_clean();
    }


    /**
     * This method fakes an Oembed response.
     *
     * @since   1.0.0
     *
     * @return  array
     */
    public function fakeResponse()
    {
        $width = isset($this->config['maxwidth']) ? $this->config['maxwidth'] : 600;
        $height = isset($this->config['maxheight']) ? $this->config['maxheight'] : 350;

        return [
            'type'          => 'rich',
            'provider_name' => 'FacebookFeed',
            'provider_url'  => 'https://facebook.com',
            'title'         => 'Unknown title',
            'html'          => $this->createFeedTemplate('videos', $this->getFBPageID($this->url), $width, $height),
        ];
    }
    /** inline @inheritDoc */
    public function modifyResponse(array $response = [])
    {
        return $this->fakeResponse();
    }
}
