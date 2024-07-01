<?php

namespace EmbedPress\Providers\TemplateLayouts;

use Embera\Provider\ProviderAdapter;
use Embera\Provider\ProviderInterface;
use Embera\Url;

class YoutubeLayout
{

    public static function create_channel_info_layout($channel_info)
    {
        $title = $channel_info['snippet']['title'];
        $customUrl = $channel_info['snippet']['customUrl'];
        $subscriberCount = $channel_info['statistics']['subscriberCount'];
        $videoCount = $channel_info['statistics']['videoCount'];
        $thumbnailUrl = $channel_info['snippet']['thumbnails']['high']['url'];

        ob_start();
        ?>
        <div class="channel-header">
            <img src="<?php echo $thumbnailUrl; ?>" alt="Channel Profile" class="profile-picture">
            <div class="channel-info">
                <div class="info-description">
                    <h1 class="channel-name"><?php echo $title; ?></h1>
                    <p class="channel-details"><?php echo esc_html($customUrl); ?> · <?php echo esc_html($subscriberCount); ?> subscribers · <?php echo esc_html($videoCount); ?> videos</p>
                </div>
                <a target="_blank" href="<?php echo esc_url('youtube.com/' . $customUrl) ?>" class="subscribe-button">
                    <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.467 1.653A1.6 1.6 0 0 1 8.4 3.093 6.026 6.026 0 0 1 14 9.067v4.586c0 1.067.053 1.92.96 2.4a.694.694 0 0 1-.267 1.28H8.88a1.333 1.333 0 1 1-1.76 0H1.36a.693.693 0 0 1-.32-1.28c.907-.48.96-1.333.96-2.4V9.067a6.027 6.027 0 0 1 5.6-5.974 1.493 1.493 0 1 1 1.867-1.44m-1.44 2.774a4.8 4.8 0 0 0-4.694 4.64v4.693c0 .587 0 1.493-.373 2.293h10.133c-.426-.8-.373-1.653-.373-2.293V9.067a4.8 4.8 0 0 0-1.405-3.289c-.874-.874-2.052-1.324-3.288-1.351" fill="#fff" /></svg>
                    Subscribe</a>
            </div>
        </div>
        <?php

        $channel_layout = ob_get_clean();

        return $channel_layout;
    }
}
