<?php

namespace EmbedPress\Providers;

use EmbedPress\Includes\Classes\Helper;
use Embera\Provider\ProviderAdapter;
use Embera\Provider\ProviderInterface;
use Embera\Provider\Instagram;
use Embera\Url;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity responsible to support InstagramFeed embeds.
 *
 * @package     EmbedPress
 * @subpackage  EmbedPress/Providers
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2020 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.0.0
 */


class InstagramFeed extends Instagram
{
    /** inline {@inheritdoc} */
    protected $shouldSendRequest = false;

    /**
     * Method that verifies if the embed URL belongs to InstagramFeed.
     *
     * @param Url $url
     * @return  boolean
     * @since   1.0.0
     *
     */

    /** @var array Array with allowed params for the current Provider */
    protected $allowedParams = [
        'maxwidth',
        'maxheight',
        'instaLayout',
        'instafeedColumns',
        'instafeedColumnsGap',
        'instafeedPostsPerPage',
        'instafeedProfileImage',
        'instafeedProfileImageUrl',
        'instafeedTab',
        'instafeedFollowBtn',
        'instafeedFollowBtnLabel',
        'instafeedPostsCount',
        'instafeedPostsCountText',
        'instafeedFollowersCount',
        'instafeedFollowersCountText',
        'instafeedAccName',
        'instafeedPopup',
        'instafeedPopupFollowBtn',
        'instafeedPopupFollowBtnLabel',
        'instafeedLoadmore',
        'instafeedLoadmoreLabel',
        'instafeedHashtag',
        'instafeedAccountType',
        'instafeedLikesCount',
        'instafeedCommentsCount',
        'instafeedFeedType',
        'slidesShow',
        'carouselSpacing'
    ];

    /** inline {@inheritdoc} */
    protected $httpsSupport = true;

    public function getAllowedParams()
    {
        return $this->allowedParams;
    }

    public function validateUrl(Url $url)
    {
        return
            parent::validateUrl($url) ||
            (bool) preg_match(
                '/^(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:[a-zA-Z0-9_\.]+\/?|explore\/tags\/[a-zA-Z0-9_\-]+\/?|(?:reel|p)\/[a-zA-Z0-9_-]+\/?)$/',
                (string) $url
            );
    }


    public function validateInstagramFeed($url)
    {
        return (bool) preg_match(
            '/^(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:[a-zA-Z0-9_\.]+\/?|explore\/tags\/[a-zA-Z0-9_\-]+\/?)$/',
            (string) $url
        );
    }


    public function validateReelUrl($url)
    {
        return (bool) preg_match(
            '/^(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:reel|p)\/[a-zA-Z0-9_-]+\/?$/',
            (string) $url
        );
    }
    function enqueue_instagram_script()
    {
        static $script_loaded = false;

        if (!$script_loaded) {
            echo '<script async src="https://www.instagram.com/embed.js"></script>';
            $script_loaded = true;
        }
    }

    public function get_connected_account_type($userID)
    {
        $instagram_account_data = get_option('ep_instagram_account_data');

        if (is_array($instagram_account_data) && !empty($instagram_account_data)) {
            foreach ($instagram_account_data as $account) {
                if ($account['user_id'] == $userID) {
                    return $account['account_type'];
                }
            }
        }

        return false;
    }

    public function getHashTag($url)
    {
        if (preg_match('/\/explore\/tags\/([a-zA-Z0-9_\-]+)/', parse_url($url, PHP_URL_PATH), $matches)) {
            return $matches[1];
        }
        return '';
    }

    public function getHashTagId($access_token, $hashtag, $user_id)
    {
        $transient_key = 'hashtag_id_' . md5($access_token . $hashtag . $user_id);
        $transient_data = get_transient($transient_key);

        if (false === $transient_data) {
            $api_url = "https://graph.facebook.com/v17.0/ig_hashtag_search?user_id=$user_id&q=$hashtag&access_token=$access_token";

            // Make a GET request to Instagram's API to retrieve posts
            $postsResponse = wp_remote_get($api_url);

            // Check if the posts request was successful
            if (is_wp_error($postsResponse)) {
                echo 'Error: Unable to retrieve Instagram posts.';
            } else {
                $postsBody = wp_remote_retrieve_body($postsResponse);
                $hashtagId = json_decode($postsBody, true);

                if (empty($hashtagId['data'])) {
                    $transient_data = 'Please add Instagram Access Token';
                } elseif (isset($hashtagId['data'][0]['id'])) {
                    $transient_data = $hashtagId['data'][0]['id'];
                } else {
                    $transient_data = '';
                }

                // Set the transient with a 30-day expiration
                set_transient($transient_key, $transient_data, 30 * DAY_IN_SECONDS);
            }
        }

        return $transient_data;
    }


    public function getHashTagPosts($access_token, $hashtag, $user_id)
    {
        // Check if the data is already cached in a transient
        $hashtag_id = $this->getHashTagId($access_token, $hashtag, $user_id);


        $transient_key = 'hashtag_posts_' . $hashtag_id;

        $cached_posts = get_transient($transient_key);

        if (isset($cached_posts[$hashtag_id])) {
            return $cached_posts[$hashtag_id];
        }

        $api_url = "https://graph.facebook.com/$hashtag_id/top_media?user_id=$user_id&fields=id,media_url,media_type,comments_count,like_count,caption,children{media_url,id,media_type},permalink,timestamp&access_token=$access_token";

        $postsResponse = wp_remote_get($api_url, array('timeout' => 30));

        if (is_wp_error($postsResponse)) {
            echo 'Error: Unable to retrieve Hashtag Instagram posts.';
        } else {
            $postsBody = wp_remote_retrieve_body($postsResponse);
            $posts = json_decode($postsBody, true);

            if (empty($posts['data'])) {
                return 'Please add Instagram Access Token';
            }

            // Update the cached posts array with the new data
            $cached_posts[$hashtag_id] = $posts['data'];

            // Store the updated array in the transient
            set_transient($transient_key, $cached_posts, HOUR_IN_SECONDS);

            return $cached_posts[$hashtag_id];
        }
    }


    public function update_instagram_feed_data($access_token, $connected_account_type, $user_id, $limit = 100)
    {
        $option_key = 'ep_instagram_feed_data';
        $feed_data = get_option($option_key, array());

        $feed_userinfo =  Helper::getInstagramUserInfo($access_token, $connected_account_type, $user_id, false);
        $feed_posts    =  Helper::getInstagramPosts($access_token, $connected_account_type, $user_id, $limit, false);

        $feed_data[$user_id] = [
            'feed_userinfo' => $feed_userinfo,
            'feed_posts' => $feed_posts,
        ];

        update_option($option_key, $feed_data);
        // }
    }



    public function getInstaFeedItem($post, $index, $account_type, $hashtag, $profile_picture_url)
    {
        $params = $this->getParams();


        $caption = !empty($post['caption']) ? $post['caption'] : '';
        $media_type = !empty($post['media_type']) ? $post['media_type'] : '';
        $media_url = !empty($post['media_url']) ? $post['media_url'] : '';
        $permalink = !empty($post['permalink']) ? $post['permalink'] : '';
        $timestamp = !empty($post['timestamp']) ? $post['timestamp'] : '';
        $username = !empty($post['username']) ? $post['username'] : '';

        $like_count = !empty($post['like_count']) ? $post['like_count'] : 0;
        $comments_count = !empty($post['comments_count']) ? $post['comments_count'] : 0;

        $connected_usersAttributes = 'data-caption="' . htmlspecialchars($caption) . '" ' .
            'data-media-type="' . htmlspecialchars($media_type) . '" ' .
            'data-media-type="' . htmlspecialchars($media_type) . '" ' .
            'data-media-url="' . htmlspecialchars($media_url) . '" ' .
            'data-permalink="' . htmlspecialchars($permalink) . '" ' .
            'data-timestamp="' . htmlspecialchars($timestamp) . '" ' .
            'data-username="' . htmlspecialchars($username) . '" ' . (($account_type === 'business') ? 'data-like-count="' . htmlspecialchars($like_count) . '" ' : '') . (($account_type === 'business') ? 'data-comments-count="' . htmlspecialchars($comments_count) . '" ' : '');

        $post['account_type'] = $account_type;
        $post['profile_picture_url'] = $profile_picture_url;
        $post['show_likes_count'] = isset($params['instafeedLikesCount']) ? $params['instafeedLikesCount'] : false;
        $post['show_comments_count'] = isset($params['instafeedCommentsCount']) ? $params['instafeedCommentsCount'] : false;
        $post['popup_follow_button'] = isset($params['instafeedPopupFollowBtn']) ? $params['instafeedPopupFollowBtn'] : true;
        $post['popup_follow_button_text'] = isset($params['instafeedPopupFollowBtnLabel']) ? $params['instafeedPopupFollowBtnLabel'] : 'Follow';

        ob_start(); ?>
        <div class="insta-gallery-item cg-carousel__slide js-carousel__slide" data-insta-postid="<?php echo esc_attr($post['id']) ?>" data-postindex="<?php echo esc_attr($index + 1); ?>" data-postdata="<?php echo htmlspecialchars(json_encode($post), ENT_QUOTES, 'UTF-8'); ?>" data-media-type="<?php echo esc_attr($media_type); ?>">
            <?php
                    if (!empty($hashtag) && $media_type == 'CAROUSEL_ALBUM') {
                        if (isset($post['children']['data'][0]['media_url'])) {
                            $hashtag_media_url = $post['children']['data'][0]['media_url'];
                            $hashtag_media_type = $post['children']['data'][0]['media_type'];

                            if ($hashtag_media_type == 'VIDEO') {
                                echo '<video class="insta-gallery-image" src="' . esc_url($hashtag_media_url) . '"></video>';
                            } else {
                                echo ' <img class="insta-gallery-image" src="' . esc_url($hashtag_media_url) . '" alt="' . esc_attr('image') . '">';
                            }
                        }
                    } else {
                        if ($media_type == 'VIDEO') {
                            echo '<video class="insta-gallery-image" src="' . esc_url($media_url) . '"></video>';
                        } else {
                            echo ' <img class="insta-gallery-image" src="' . esc_url($media_url) . '" alt="' . esc_attr('image') . '">';
                        }
                    }

                    ?>

            <div class="insta-gallery-item-type">
                <div class="insta-gallery-item-type-icon">
                    <?php
                            if ($media_type == 'VIDEO') {
                                echo Helper::get_insta_video_icon();
                            } else if ($media_type == 'CAROUSEL_ALBUM') {
                                echo Helper::get_insta_image_carousel_icon();
                            } else {
                                echo Helper::get_insta_image_icon();
                            }
                            ?>
                </div>
            </div>
            <div class="insta-gallery-item-info">
                <?php if (apply_filters('embedpress/is_allow_rander', false) && (isset($params['instafeedFeedType']) && $params['instafeedFeedType'] === 'hashtag_type' || (isset($params['instafeedAccountType']) && strtolower($account_type) === 'business' && $params['instafeedAccountType'] === 'business')  && ((!empty($params['instafeedLikesCount']) && $params['instafeedLikesCount'] !== 'false') || (!empty($params['instafeedLikesCount']) || $params['instafeedLikesCount'] !== 'false')))) : ?>
                    <?php do_action('embedpress/instafeed_reaction_count', $params, $like_count, $comments_count); ?>
                <?php else : ?>
                    <div class="insta-gallery-item-permalink">
                        <?php echo Helper::get_instagram_icon(); ?>
                    </div>
                <?php endif; ?>
            </div>
        </div>

        <?php $feed_item = ob_get_clean();
                return $feed_item;
            }

            public function getInstagramFeedTemplate($accessToken, $account_type, $userID)
            {
                $params = $this->getParams();

                $hashtag = $this->getHashTag($this->url);
                if (!empty($hashtag) && !apply_filters('embedpress/is_allow_rander', false)) {
                    return sprintf(
                        esc_html__('Unlock %s support by upgrading to our %s! Upgrade today to unlock a whole new level of functionality and make the most out of your experience with Hashtag.', 'embedpress'),
                        '<strong>hashtag</strong>',
                        '<strong>Pro subscription</strong>'
                    );
                }

                $feed_type = isset($params['instafeedFeedType']) ? $params['instafeedFeedType'] : 'user_account_type';

                if ($feed_type === 'user_account_type' && !empty($hashtag)) {
                    return 'Please add valid url for user account';
                } else if ($feed_type === 'hashtag_type' && empty($hashtag)) {
                    return 'Please add valid url for hashtag feed';
                } else if ($feed_type === 'mixed_type') {
                    return 'Please add valid url for hashtag feed';
                } else if ($feed_type === 'tagged_type') {
                    return 'Please add valid url for hashtag feed';
                }

                $styleAttribute = '';

                if (isset($params['instaLayout'])) {
                    if ($params['instaLayout'] === 'insta-grid') {


                        if (isset($params['instafeedColumns']) && is_numeric($params['instafeedColumns']) && $params['instafeedColumns'] > 0) {
                            $column = (100 / intval($params['instafeedColumns']));
                            $gap = isset($params['instafeedColumnsGap']) ? $params['instafeedColumnsGap'] : 0;

                            $styleAttribute = 'style="grid-template-columns: repeat(' . esc_attr($params['instafeedColumns']) . ', minmax(0, 1fr)); gap: ' . esc_attr($gap) . 'px;"';
                        } else {
                            $styleAttribute = 'style="grid-template-columns: repeat(1, minmax(0, 1fr));"';
                        }
                    } else if ($params['instaLayout'] === 'insta-masonry') {
                        $styleAttribute = 'style="column-count: ' . esc_attr($params['instafeedColumns']) . '; gap: ' . esc_attr(isset($params['instafeedColumnsGap']) ? $params['instafeedColumnsGap'] : 0) . 'px;"';
                    } else if ($params['instaLayout'] === 'insta-carousel') {
                        $styleAttribute = '';
                        if (isset($params['slidesShow'])) {
                            $column = (100 / intval($params['slidesShow']));
                            $space = isset($params['carouselSpacing']) ? $params['carouselSpacing'] : 0;
                            $styleAttribute = $styleAttribute = 'style="grid-auto-columns: calc(' . esc_attr($column) . '% - ' . esc_attr($space) . 'px); gap: ' . esc_attr($space) . 'px"'; // Or some default style
                        }
                    } else {
                        $styleAttribute = ''; // Or some default style
                    }
                } else {
                    $styleAttribute = ''; // Or some default style
                }


                $feed_data = get_option('ep_instagram_feed_data');

                // print_r($feed_data); die;

                if (!empty($feed_data[$userID]['feed_userinfo']['error'])) {
                    return $feed_data[$userID]['feed_userinfo']['error']['message'];
                }

                $profile_info = $feed_data[$userID]['feed_userinfo'];
                $insta_posts = $feed_data[$userID]['feed_posts'];

                $hashtag_id = '';
                if (!empty($hashtag)) {
                    $option_key = 'ep_instagram_hashtag_feed';
                    $hashtag_feed = get_option($option_key, array());

                    $hashtag_id = $this->getHashTagId($accessToken, $hashtag, $userID);
                    $insta_posts = $this->getHashtagPosts($accessToken, $hashtag, $userID);

                    $hashtag_feed[$hashtag_id] = $insta_posts;

                    update_option($option_key, $hashtag_feed);
                }

                // Check and assign each item to separate variables
                $id = !empty($profile_info['id']) ? $profile_info['id'] : '';
                $username = !empty($profile_info['username']) ? $profile_info['username'] : '';
                $followers_count = !empty($profile_info['followers_count']) ? $profile_info['followers_count'] : 0;
                $media_count = !empty($profile_info['media_count']) ? $profile_info['media_count'] : 0;
                $profile_picture_url = !empty($profile_info['profile_picture_url']) ? $profile_info['profile_picture_url'] : '';
                $name = !empty($profile_info['name']) ? $profile_info['name'] : '';


                $connected_account_type = $account_type;

                if (strtolower($connected_account_type) === 'business') {
                    $tkey = md5($accessToken . $id .  $connected_account_type . $feed_type);
                } else {
                    $tkey = md5($accessToken . $connected_account_type . $feed_type);
                }

                $loadmore_key = $hashtag_id;
                if (empty($hashtag) || $hashtag === 'false') :
                    $loadmore_key = $userID;
                endif;

                if (is_array($insta_posts) and !empty($insta_posts)) {
                    ob_start(); ?>

            <?php
                        $avater_url = 'http://2.gravatar.com/avatar/b642b4217b34b1e8d3bd915fc65c4452?s=150&d=mm&r=g';

                        if (!empty($connected_account_type) && (strtolower($connected_account_type)  === 'business')) {
                            $avater_url = $profile_picture_url;
                        }
                        if (!empty($params['instafeedProfileImageUrl']) && $params['instafeedProfileImageUrl'] !== 'true' && $params['instafeedProfileImageUrl'] !== 'false') {
                            $avater_url = $params['instafeedProfileImageUrl'];
                        }

                        $feed_data[$id]['feed_userinfo']['profile_picture_url'] = $avater_url;

                        update_option('ep_instagram_feed_data', $feed_data);
                        ?>

            <?php if (empty($hashtag) || $hashtag === 'false') : ?>
                <header class="profile-header">

                    <?php if (!empty($params['instafeedProfileImage']) && $params['instafeedProfileImage'] !== 'false') : ?>
                        <div class="profile-image">
                            <img src="<?php echo esc_url($avater_url); ?>" alt="<?php echo esc_attr($name); ?>">
                        </div>
                    <?php endif; ?>
                    <section class="profile-details">
                        <div class="username-section">
                            <a class="profile-link" target="__blank" href="<?php echo esc_url('https://instagram.com/' . $username); ?>" role="link" tabindex="0">
                                <h2 class="username" dir="auto"><?php echo esc_html($username); ?></h2>
                            </a>

                            <?php if (!empty($params['instafeedFollowBtn']) && $params['instafeedFollowBtn'] !== 'false' && !empty($params['instafeedFollowBtnLabel']) && $params['instafeedFollowBtnLabel'] !== 'false' && $params['instafeedFollowBtnLabel'] !== 'true') : ?>
                                <div class="edit-profile-button">
                                    <a class="edit-profile-link" target="__blank" href="<?php echo esc_url('https://instagram.com/' . $username); ?>" role="link" tabindex="0">
                                        <?php echo esc_html($params['instafeedFollowBtnLabel']); ?>
                                    </a>
                                </div>
                            <?php endif; ?>

                        </div>
                        <div class="profile-stats">
                            <?php if (!empty($params['instafeedPostsCount']) && $params['instafeedPostsCount'] !== 'false') : ?>
                                <div class="posts-count">
                                    <?php if (!empty($params['instafeedPostsCountText']) && $params['instafeedPostsCountText'] !== 'false' && $params['instafeedPostsCountText'] !== 'true') :
                                                            $posts_count_text = str_replace('[count]', '<span class="count">' . $media_count . '</span>', $params['instafeedPostsCountText']);
                                                            echo wp_kses_post($posts_count_text);
                                                        endif;
                                                        ?>

                                </div>
                            <?php endif; ?>

                            <?php if (!empty($params['instafeedFollowersCount']) && $params['instafeedFollowersCount'] !== 'false' && $params['instafeedFollowersCountText'] !== 'true') : ?>
                                <?php if (strtolower($connected_account_type) !== 'personal') : ?>
                                    <div class="followers-count">
                                        <?php if (!empty($params['instafeedFollowersCountText']) && $params['instafeedFollowersCountText'] !== 'false' && $params['instafeedFollowersCountText'] !== 'true') : ?>
                                            <a class="followers-link" target="_blank" href="<?php echo esc_url('https://instagram.com/' . $username . '/followers'); ?>" role="link" tabindex="0">
                                                <?php
                                                                            $followers_count_text = str_replace('[count]', '<span class="count">' . $followers_count . '</span>', $params['instafeedFollowersCountText']);

                                                                            echo wp_kses_post($followers_count_text);
                                                                            ?>
                                            </a>
                                        <?php endif; ?>
                                    </div>
                                <?php endif; ?>
                            <?php endif; ?>
                        </div>
                        <?php if (!empty($params['instafeedAccName']) && $params['instafeedAccName'] !== 'false') : ?>
                            <div class="bio-section">
                                <span class="bio" dir="auto"><?php echo esc_attr($name); ?></span>
                            </div>
                        <?php endif; ?>
                    </section>
                </header>
            <?php else : ?>
                <div class="hashtag-container">
                    <div class="embedpress-hashtag-header">

                        <?php if (!empty($params['instafeedProfileImage']) && $params['instafeedProfileImage'] !== 'false') : ?>

                            <div class="embedpress-hashtag-header-img"> <a target="_blank" href="<?php echo esc_url("https://www.instagram.com/explore/tags/$hashtag/"); ?>" class="embedpress-href"> <img decoding="async" loading="lazy" class="embedpress-hashtag-round" src="<?php echo esc_url($avater_url); ?>" width="30" height="30"> <span class="embedpress-hashtag-username"><?php echo esc_html("#$hashtag"); ?></span>
                                </a>
                            </div>
                        <?php endif; ?>

                        <?php if (!empty($params['instafeedFollowBtn']) && $params['instafeedFollowBtn'] !== 'false' && !empty($params['instafeedFollowBtnLabel']) && $params['instafeedFollowBtnLabel'] !== 'false') : ?>
                            <div class="insta-followbtn">
                                <a target="_new" href="<?php echo esc_url("https://www.instagram.com/explore/tags/$hashtag/"); ?>" type="button" class="btn btn-primary"><?php echo esc_html($params['instafeedFollowBtnLabel']); ?></a>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            <?php endif; ?>

            <?php if (apply_filters('embedpress/is_allow_rander', false) && (!empty($params['instafeedTab']) && $params['instafeedTab'] !== 'false')) : ?>
                <?php do_action('embedpress/instafeed_tab_option'); ?>
            <?php endif; ?>

            <?php
                        $params_data = [
                            'show_likes_count' => isset($params['instafeedLikesCount']) ? $params['instafeedLikesCount'] : false,
                            'show_comments_count' => isset($params['instafeedCommentsCount']) ? $params['instafeedCommentsCount'] : false,
                            'popup_follow_button' => isset($params['instafeedPopupFollowBtn']) ? $params['instafeedPopupFollowBtn'] : true,
                            'popup_follow_button_text' => isset($params['instafeedPopupFollowBtnLabel']) ? $params['instafeedPopupFollowBtnLabel'] : 'Follow'
                        ];

                        $params_data_json = json_encode($params_data);

                        ?>

            <div class="instagram-container" data-feed-type="<?php echo esc_attr($feed_type); ?>" data-hashtag="<?php echo esc_attr($hashtag); ?>" data-hashtag-id="<?php echo esc_attr($hashtag_id); ?>" data-connected-acc-type="<?php echo esc_attr($connected_account_type); ?>" data-uid="<?php echo esc_attr($userID); ?>" data-params="<?php echo htmlspecialchars($params_data_json, ENT_QUOTES, 'UTF-8'); ?>">
                <div class="embedpress-insta-container">
                    <div class="insta-gallery cg-carousel__track js-carousel__track" <?php echo  $styleAttribute; ?>>
                        <?php
                                    $posts_per_page = 12;

                                    if (!empty($params['instafeedPostsPerPage'])) {
                                        $posts_per_page = $params['instafeedPostsPerPage'];
                                    }
                                    // Set the limit to 5
                                    $counter = 0; // Initialize a counter variable

                                    foreach ($insta_posts as $index => $post) {
                                        if ($counter >= $posts_per_page) {
                                            break; // Exit the loop when the counter reaches the limit
                                        }
                                        print_r($this->getInstaFeedItem($post, $index, $connected_account_type, $hashtag, $avater_url));

                                        $counter++; // Increment the counter for each processed item
                                    }
                                    ?>
                    </div>
                    <div class="cg-carousel__btns hidden">
                        <button class="cg-carousel__btn" id="js-carousel__prev-1"><svg width="20" height="30" viewBox="-5 0 23 23" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.24.29.361 10.742l-.06.054a.97.97 0 0 0-.301.642v.124a.97.97 0 0 0 .3.642l.054.044L11.239 22.71a1.061 1.061 0 0 0 1.459 0 .964.964 0 0 0 0-1.402l-10.15-9.746 10.15-9.87a.964.964 0 0 0 0-1.402 1.061 1.061 0 0 0-1.459 0Z" fill="#fff" /></svg></button>

                        <button class="cg-carousel__btn" id="js-carousel__next-1"><svg width="20" height="30" viewBox="-5 0 23 23" xmlns="http://www.w3.org/2000/svg">
                                <path d="m1.76.29 10.879 10.452.06.054a.97.97 0 0 1 .301.642v.124a.97.97 0 0 1-.3.642l-.054.044L1.761 22.71a1.061 1.061 0 0 1-1.459 0 .964.964 0 0 1 0-1.402l10.15-9.746-10.15-9.87a.964.964 0 0 1 0-1.402 1.061 1.061 0 0 1 1.459 0Z" fill="#fff" /></svg></button>
                    </div>
                </div>

                <!-- Popup div -->
                <?php if (!empty($params['instafeedPopup']) && $params['instafeedPopup'] !== 'false') : ?>
                    <div class="insta-popup" style="display: none;">
                        <div class="popup-wrapper popup-is-opened">
                            <div class="popup popup-is-initialized" tabindex="-1"> </div>
                            <div class="popup-close">✕</div>
                        </div>
                    </div>
                <?php endif; ?>

                <?php if (!empty($params['instafeedLoadmore']) && $params['instafeedLoadmore'] !== 'false') : ?>


                    <?php if (count($insta_posts) > $posts_per_page && $params['instafeedLoadmoreLabel'] !== 'false' && $params['instafeedLoadmoreLabel'] !== 'true') : ?>
                        <div class="load-more-button-container" data-loadmorekey="<?php echo esc_attr($loadmore_key); ?>" data-loaded-posts="<?php echo esc_attr($posts_per_page); ?>" data-posts-per-page="<?php echo esc_attr($posts_per_page); ?>">
                            <button class="insta-load-more-button">
                                <?php echo !empty($params['instafeedLoadmoreLabel']) ? esc_html($params['instafeedLoadmoreLabel']) : ''; ?>
                            </button>
                        </div>
                    <?php endif; ?>
                <?php endif; ?>

            </div>


<?php
            $feed_template = ob_get_clean();
            return $feed_template;
        }
    }

    public function getInstagramUnserName($url)
    {
        $pattern = '/instagram\.com\/([^\/?]+)/i';
        preg_match($pattern, $url, $matches);
        return isset($matches[1]) ? $matches[1] : '';
    }


    public function getStaticResponse()
    {
        $url = $this->getUrl();

        if (parent::validateUrl($this->url)) {
            return parent::getStaticResponse();
        }

        $insta_feed = [
            "title"         => "Unknown Title",
            "type"          => "video",
            'provider_name' => 'Instagram Feed',
            "provider_url"  => 'https://instagram.com',
            'html'          => "",
        ];


        if ($this->validateReelUrl($url)) {
            
            $params = $this->getParams();
            $width = isset($params['maxwidth']) ? $params['maxwidth'] : 380;
            $height = isset($params['maxheight']) ? $params['maxheight'] : 600;

            $clean_url = rtrim($url, '/');
            $src_url = $clean_url . '/embed';

            $IG_reel = '<iframe width="' . esc_attr($width) . 'px" width="' . esc_attr($height) . 'px" allowtransparency="true" allowfullscreen="true" frameborder="0" height="534" data-instgrm-payload-id="instagram-media-payload-0" scrolling="no" style="background-color: white; border-radius: 3px; border: 1px solid rgb(219, 219, 219); box-shadow: none; display: block; margin: 0px 0px 12px; min-width: 326px; padding: 0px;" class="instagram-media instagram-media-rendered" src="' . esc_url($src_url) . '">Fetching content</iframe>';

            $insta_feed['html'] = $IG_reel;
            return $insta_feed;
        }
        $connected_users =  get_option('ep_instagram_account_data');

        $username = $this->getInstagramUnserName($url) ? $this->getInstagramUnserName($url) : '';

        if ($this->validateInstagramFeed($url) && $this->getHashTag($url)) {
            foreach ($connected_users as $entry) {
                if ($entry['account_type'] === 'business') {
                    $businessUsernames[] = $entry['username'];
                    $username = $businessUsernames[0];
                }
            }
        }

        $access_token = ''; // The access token';
        $account_type = '';
        $userid = '';

        if ($this->validateInstagramFeed($url) || !empty($username)) {
            if (!empty($username)) {

                if (empty($connected_users)) {
                    $connected_users = [];
                }

                // Find the key of the matching username
                $index = array_search($username, array_column($connected_users, 'username'));

                if ($index !== false) {
                    // Matching username found
                    $access_token = $connected_users[$index]['access_token'];
                    $userid = $connected_users[$index]['user_id'];
                    $account_type = $connected_users[$index]['account_type'];
                    // <a href="' . esc_url($page) . '">here</a>
                } else {
                    // No matching username found
                    $page = site_url() . "/wp-admin/admin.php?page=embedpress&page_type=instagram";
                    $insta_feed['html'] = '<p style="text-align:center;height:100%;display:flex;justify-content:center;align-items:center;margin:0;flex-direction: column;">To enable full Instagram embedding experience, please add your access token by navigating to: <b>Dashboard > EmbedPress > Settings > Sources > Instagram</></p>';
                    return $insta_feed;
                }
            }

            $this->update_instagram_feed_data($access_token, $account_type, $userid, $limit = 100);

            if ($this->getInstagramFeedTemplate($access_token, $account_type, $userid)) {
                $insta_feed['html'] = $this->getInstagramFeedTemplate($access_token, $account_type, $userid);
            }
        }


        return $insta_feed;
    }


    /** inline {@inheritdoc} */
    public function getFakeResponse()
    {
        return [
            'type' => 'video',
            'provider_name' => 'Instagram Feed',
            'provider_url' => 'https://instagram.com',
            'title' => 'Unknown title',
            'html' => '',
        ];
    }
}
