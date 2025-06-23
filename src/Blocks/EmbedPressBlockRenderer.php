<?php

namespace EmbedPress\Src\Blocks;

use EmbedPress\Includes\Classes\Helper;
use EmbedPress\Shortcode;
use Exception;

if (!defined('ABSPATH')) {
    exit;
}

class EmbedPressBlockRenderer
{
    public static function is_dynamic_provider($url)
    {
        $dynamic_providers = [
            'photos.app.goo.gl',
            'photos.google.com',
            'instagram.com',
            'opensea.io',
        ];

        foreach ($dynamic_providers as $provider) {
            if (strpos($url, $provider) !== false) {
                return true;
            }
        }

        return false;
    }

    public static function render_dynamic_content($attributes)
    {
        $url = $attributes['url'] ?? '';

        if (class_exists('\\EmbedPress\\Shortcode')) {
            try {

                // Use EmbedPress shortcode parsing directly
                $embed_result = Shortcode::parseContent($url, false, []);


                if (is_object($embed_result) && isset($embed_result->embed) && !empty($embed_result->embed)) {
                    if (defined('WP_DEBUG') && WP_DEBUG) {
                        error_log('EmbedPress: Shortcode parsing successful for: ' . $url);
                    }
                    return $embed_result->embed;
                }
            } catch (Exception $e) {
                if (defined('WP_DEBUG') && WP_DEBUG) {
                    error_log('EmbedPress: Shortcode parsing failed: ' . $e->getMessage());
                }
            }
        }
    }

    public static function render($attributes, $content = '', $block = null)
    {
        $url = $attributes['url'] ?? '';

        if (empty($url) || !self::is_dynamic_provider($url)) {
            return $content;
        }


        $client_id = !empty($attributes['clientId']) ? md5($attributes['clientId']) : '';
        $block_id = !empty($attributes['clientId']) ? $attributes['clientId'] : '';
        $custom_player = !empty($attributes['customPlayer']) ? $attributes['customPlayer'] : 0;
        $instaLayout = !empty($attributes['instaLayout']) ? ' ' . $attributes['instaLayout'] : ' insta-grid';
        $mode = !empty($attributes['mode']) ? ' ep-google-photos-' . $attributes['mode'] : '';
        $cEmbedType = !empty($attributes['cEmbedType']) ? ' ' . $attributes['cEmbedType'] : '';

        $_carousel_options = '';
        $_carousel_id = '';

        if (!empty($attributes['instaLayout']) && $attributes['instaLayout'] === 'insta-carousel') {
            $_carousel_id = 'data-carouselid=' . esc_attr($client_id);

            $carousel_options = [
                'layout' => $attributes['instaLayout'],
                'slideshow' => !empty($attributes['slidesShow']) ? $attributes['slidesShow'] : 5,
                'autoplay' => !empty($attributes['carouselAutoplay']) ? $attributes['carouselAutoplay'] : 0,
                'autoplayspeed' => !empty($attributes['autoplaySpeed']) ? $attributes['autoplaySpeed'] : 3000,
                'transitionspeed' => !empty($attributes['transitionSpeed']) ? $attributes['transitionSpeed'] : 1000,
                'loop' => !empty($attributes['carouselLoop']) ? $attributes['carouselLoop'] : 0,
                'arrows' => !empty($attributes['carouselArrows']) ? $attributes['carouselArrows'] : 0,
                'spacing' => !empty($attributes['carouselSpacing']) ? $attributes['carouselSpacing'] : 0
            ];

            $_carousel_options = 'data-carousel-options=' . htmlentities(json_encode($carousel_options), ENT_QUOTES);
        }

        $_custom_player = '';
        $_player_options = '';

        if (!empty($custom_player)) {
            $is_self_hosted = Helper::check_media_format($attributes['url']);
            $_custom_player = 'data-playerid=' . esc_attr($client_id);

            $playerOptions = [
                'rewind' => !empty($attributes['playerRewind']),
                'restart' => !empty($attributes['playerRestart']),
                'pip' => !empty($attributes['playerPip']),
                'poster_thumbnail' => $attributes['posterThumbnail'] ?? '',
                'player_color' => $attributes['playerColor'] ?? '',
                'player_preset' => $attributes['playerPreset'] ?? 'preset-default',
                'fast_forward' => !empty($attributes['playerFastForward']),
                'player_tooltip' => !empty($attributes['playerTooltip']),
                'hide_controls' => !empty($attributes['playerHideControls']),
                'download' => !empty($attributes['playerDownload']),
            ];

            if (!empty($attributes['fullscreen'])) {
                $playerOptions['fullscreen'] = $attributes['fullscreen'];
            }

            if (!empty($is_self_hosted['selhosted'])) {
                $playerOptions['self_hosted'] = $is_self_hosted['selhosted'];
                $playerOptions['hosted_format'] = $is_self_hosted['format'];
            }

            if (!empty($attributes['starttime'])) {
                $playerOptions['start'] = $attributes['starttime'];
            }
            if (!empty($attributes['endtime'])) {
                $playerOptions['end'] = $attributes['endtime'];
            }
            if (!empty($attributes['relatedvideos'])) {
                $playerOptions['rel'] = $attributes['relatedvideos'];
            }
            if (!empty($attributes['muteVideo'])) {
                $playerOptions['mute'] = $attributes['muteVideo'];
            }
            if (!empty($attributes['vstarttime'])) {
                $playerOptions['t'] = $attributes['vstarttime'];
            }
            if (!empty($attributes['vautoplay'])) {
                $playerOptions['vautoplay'] = $attributes['vautoplay'];
            }
            if (!empty($attributes['vautopause'])) {
                $playerOptions['autopause'] = $attributes['vautopause'];
            }
            if (!empty($attributes['vdnt'])) {
                $playerOptions['dnt'] = $attributes['vdnt'];
            }

            $_player_options = 'data-options=' . htmlentities(json_encode($playerOptions), ENT_QUOTES);
        }

        $pass_hash_key = isset($attributes['contentPassword']) ? md5($attributes['contentPassword']) : '';

        if (!empty($attributes['embedHTML'])) {

            $embed = self::render_dynamic_content($attributes);

            $content_share_class = !empty($attributes['contentShare']) ? 'ep-content-share-enabled' : '';
            $share_position = $attributes['sharePosition'] ?? 'right';
            $share_position_class = !empty($attributes['contentShare']) ? 'ep-share-position-' . $share_position : '';

            $password_correct = $_COOKIE['password_correct_' . $client_id] ?? '';
            $hash_pass = hash('sha256', wp_salt(32) . md5($attributes['contentPassword'] ?? ''));

            $content_protection_class = 'ep-content-protection-enabled';
            if (empty($attributes['lockContent']) || empty($attributes['contentPassword']) || $hash_pass === $password_correct) {
                $content_protection_class = 'ep-content-protection-disabled';
            }

            $aligns = [
                'left' => 'alignleft',
                'right' => 'alignright',
                'wide' => 'alignwide',
                'full' => 'alignfull',
                'center' => 'aligncenter',
            ];
            $alignment = isset($aligns[$attributes['align'] ?? '']) ? $aligns[$attributes['align']] . ' clear' : 'aligncenter';

            $adsAtts = '';
            if (!empty($attributes['adManager'])) {
                $ad = base64_encode(json_encode($attributes));
                $adsAtts = "data-sponsored-id=$client_id data-sponsored-attrs=$ad class=sponsored-mask";
            }

            $hosted_format = '';
            if (!empty($custom_player)) {
                $self_hosted = Helper::check_media_format($attributes['url']);
                $hosted_format = $self_hosted['format'] ?? '';
            }

            $yt_channel_class = Helper::is_youtube_channel($attributes['url']) ? 'embedded-youtube-channel' : '';
            $autoPause = !empty($attributes['autoPause']) ? ' enabled-auto-pause' : '';

            ob_start();
?>
            <div class="embedpress-gutenberg-wrapper <?php echo esc_attr("$alignment $content_share_class $share_position_class $content_protection_class$cEmbedType"); ?>" id="<?php echo esc_attr($block_id); ?>">

                <div class="wp-block-embed__wrapper <?php echo !empty($attributes['contentShare']) ? esc_attr('position-' . $share_position . '-wraper') : ''; ?> <?php echo ($attributes['videosize'] ?? '') === 'responsive' ? esc_attr('ep-video-responsive') : ''; ?>">
                    <div id="ep-gutenberg-content-<?php echo esc_attr($client_id) ?>" class="ep-gutenberg-content<?php echo esc_attr($autoPause); ?>">
                        <div <?php echo esc_attr($adsAtts); ?>>
                            <div class="ep-embed-content-wraper <?php echo esc_attr(($attributes['playerPreset'] ?? '') . $instaLayout . $mode . ' ' . $hosted_format . ' ' . $yt_channel_class); ?>"
                                <?php echo esc_attr($_custom_player); ?>
                                <?php echo esc_attr($_player_options); ?>
                                <?php echo esc_attr($_carousel_id); ?>
                                <?php echo esc_attr($_carousel_options); ?>>

                                <?php
                                $hash_pass = hash('sha256', wp_salt(32) . md5($attributes['contentPassword']));
                                $password_correct = $_COOKIE['password_correct_' . $client_id] ?? '';

                                $should_display_content = (
                                    !apply_filters('embedpress/is_allow_rander', false) ||
                                    empty($attributes['lockContent']) ||
                                    ($attributes['protectionType'] == 'password' && empty($attributes['contentPassword'])) ||
                                    ($attributes['protectionType'] == 'password' && !empty(Helper::is_password_correct($client_id)) && ($hash_pass === $password_correct)) ||
                                    ($attributes['protectionType'] == 'user-role' && has_content_allowed_roles($attributes['userRole']))
                                );

                                if ($should_display_content) {
                                    if (!empty($attributes['contentShare'])) {
                                        $content_id = $attributes['clientId'];
                                        $embed .= Helper::embed_content_share($content_id, $attributes);
                                    }
                                    echo $embed;
                                } else {
                                    if (!empty($attributes['contentShare'])) {
                                        $content_id = $attributes['clientId'];
                                        $embed .= Helper::embed_content_share($content_id, $attributes);
                                    }

                                    if ($attributes['protectionType'] == 'password') {
                                        do_action('embedpress/display_password_form', $client_id, $embed, $pass_hash_key, $attributes);
                                    } else {
                                        do_action('embedpress/content_protection_content', $client_id, $attributes['protectionMessage'], $attributes['userRole']);
                                    }
                                }
                                ?>
                            </div>

                            <?php
                            if (!empty($attributes['adManager'])) {
                                $embed = apply_filters('embedpress/generate_ad_template', $embed, $client_id, $attributes, 'gutenberg');
                            }
                            ?>
                        </div>
                    </div>
                </div>
            </div>
<?php
            return ob_get_clean();
        }

        return '';
    }
}
?>