<?php

namespace EmbedPress\Providers\TemplateLayouts;


use Embera\Provider\ProviderAdapter;
use Embera\Provider\ProviderInterface;
use Embera\Url;
use EmbedPress\Includes\Classes\Helper;


class YoutubeLayout
{

    public static function create_channel_info_layout($channel_info)
    {
        $title = $channel_info['snippet']['title'];
        $handle = $channel_info['snippet']['customUrl'];
        $subscriberCount = $channel_info['statistics']['subscriberCount'];
        $videoCount = $channel_info['statistics']['videoCount'];
        $thumbnailUrl = $channel_info['snippet']['thumbnails']['high']['url'];
        
        ob_start();
        ?>
        <div class="channel-header">
            <img src="<?php echo esc_url($thumbnailUrl); ?>" alt="Channel Profile" class="profile-picture">
            <div class="channel-info">
                <div class="info-description">
                    <h1 class="channel-name"><?php echo esc_html($title); ?></h1>
                    <p class="channel-details"><?php echo esc_html($handle); ?> · <?php echo esc_html(Helper::format_number($subscriberCount)); ?> subscribers · <?php echo esc_html(Helper::format_number($videoCount)); ?> videos</p>
                </div>
                <a target="_blank" href="<?php echo esc_url('youtube.com/' . $handle);  ?>" class="subscribe-button">
                    <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.467 1.653A1.6 1.6 0 0 1 8.4 3.093 6.026 6.026 0 0 1 14 9.067v4.586c0 1.067.053 1.92.96 2.4a.694.694 0 0 1-.267 1.28H8.88a1.333 1.333 0 1 1-1.76 0H1.36a.693.693 0 0 1-.32-1.28c.907-.48.96-1.333.96-2.4V9.067a6.027 6.027 0 0 1 5.6-5.974 1.493 1.493 0 1 1 1.867-1.44m-1.44 2.774a4.8 4.8 0 0 0-4.694 4.64v4.693c0 .587 0 1.493-.373 2.293h10.133c-.426-.8-.373-1.653-.373-2.293V9.067a4.8 4.8 0 0 0-1.405-3.289c-.874-.874-2.052-1.324-3.288-1.351" fill="#fff" /></svg>
                    <?php echo esc_html__('Subscribe', 'embbedpress'); ?></a>
            </div>
        </div>
        <?php

        $channel_layout = ob_get_clean();

        return $channel_layout;
    }


    public static function create_gallery_layout($options, $data) {
        $nextPageToken = '';
        $prevPageToken = '';
        $gallobj       = new \stdClass();
        $options       = wp_parse_args($options, [
            'playlistId'  => '',
            'pageToken'   => '',
            'pagesize'    => $data['get_pagesize'] ? $data['get_pagesize'] : 6,
            'currentpage' => '',
            'columns'     => 3,
            'thumbnail'   => 'medium',
            'gallery'     => true,
            'autonext'    => true,
            'thumbplay'   => true,
            'apiKey'      => $data['get_api_key'],
            'hideprivate' => '',
        ]);
        $options['pagesize'] = $options['pagesize'] > 50 ? 50 : $options['pagesize'];
        $options['pagesize'] = $options['pagesize'] < 1 ? 1 : $options['pagesize'];

        if (empty($options['apiKey'])) {
            $gallobj->html = $data['get_api_key_error_message'];
            return $gallobj;
        }

        $apiEndpoint = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,status,contentDetails&playlistId=' . $options['playlistId']
            . '&maxResults=' . $options['pagesize']
            . '&key=' . $options['apiKey'];
        if ($options['pageToken'] != null) {
            $apiEndpoint .= '&pageToken=' . $options['pageToken'];
        }



        $transient_key          = 'ep_embed_youtube_channel_' . md5($apiEndpoint);
        $gallobj->transient_key = $transient_key;
        $jsonResult             = get_transient($transient_key);


        if (empty($jsonResult)) {
            $apiResult = wp_remote_get($apiEndpoint, array('timeout' => $data['curltimeout']));
            if (is_wp_error($apiResult)) {
                $gallobj->html = Helper::clean_api_error_html($apiResult->get_error_message(), true);
                return $gallobj;
            }
            $jsonResult = json_decode($apiResult['body']);
            
            if (empty($jsonResult->error)) {
                set_transient($transient_key, $jsonResult, MINUTE_IN_SECONDS * 20);
            }
            else{
                set_transient($transient_key, $jsonResult, 10);
            }
        }



        if (isset($jsonResult->error)) {
            if(!empty($jsonResult->error->errors[0]->reason) && $jsonResult->error->errors[0]->reason == 'playlistNotFound'){
                $gallobj->html = Helper::clean_api_error_html(__('There is nothing on the playlist.', 'embedpress'));
                return $gallobj;
            }
            if (isset($jsonResult->error->message)) {
                $gallobj->html = Helper::clean_api_error_html($jsonResult->error->message);
                return $gallobj;
            }
            $gallobj->html = Helper::clean_api_error_html(__('Sorry, there may be an issue with your YouTube API key.', 'embedpress'));
            return $gallobj;
        }



        $resultsPerPage = $jsonResult->pageInfo->resultsPerPage;
        $totalResults = $jsonResult->pageInfo->totalResults;
        $totalPages = ceil($totalResults / $resultsPerPage);
        if (isset($jsonResult->nextPageToken)) {
            $nextPageToken = $jsonResult->nextPageToken;
        }

        if (isset($jsonResult->prevPageToken)) {
            $prevPageToken = $jsonResult->prevPageToken;
        }


        if (!empty($jsonResult->items) && is_array($jsonResult->items)) :
            if($options['gallery'] === "false"){
                $gallobj->html = "";
                if(count($jsonResult->items) === 1){
                    $gallobj->first_vid = Helper::get_id($jsonResult->items[0]);
                }
                return $gallobj;
            }

            if(count($jsonResult->items) === 1 && empty($nextPageToken) && empty($prevPageToken)){
                $gallobj->first_vid = Helper::get_id($jsonResult->items[0]);
                $gallobj->html = "";
                return $gallobj;
            }

            if (strpos($options['playlistId'], 'UU') === 0) {
                // sort only channels
                usort($jsonResult->items, array(Helper::class, 'compare_vid_date')); // sorts in place
            }
            

            ob_start();

            ?>

            <div class="ep-youtube__content__block"  data-unique-id="<?php echo wp_rand(); ?>">
                <div class="youtube__content__body">
                    <?php 
                    $channel_info = $data['get_channel_info'];
                    echo YoutubeLayout::create_channel_info_layout($channel_info); ?>

                    <div class="content__wrap">
                        <?php foreach ($jsonResult->items as $item) : ?>
                            <?php
                            $privacyStatus = isset($item->status->privacyStatus) ? $item->status->privacyStatus : null;
                            $thumbnail = Helper::get_thumbnail_url($item, $options['thumbnail'], $privacyStatus);
                            $vid = Helper::get_id($item);
                            if (empty($gallobj->first_vid)) {
                                $gallobj->first_vid = $vid;
                            }
                            if ($privacyStatus == 'private' && $options['hideprivate']) {
                                continue;
                            }
                            ?>
                            <div class="item" data-vid="<?php echo $vid; ?>">
                                <div class="thumb" style="background: <?php echo "url({$thumbnail}) no-repeat center"; ?>">
                                    <div class="play-icon">
                                        <img src="<?php echo esc_url(EMBEDPRESS_URL_ASSETS . 'images/youtube/youtube-play.png'); ?>" alt="">
                                    </div>
                                </div>
                                <div class="body">
                                    <p><?php echo $item->snippet->title; ?></p>
                                </div>
                            </div>

                        <?php endforeach; ?>
                        <div class="item" style="height: 0"></div>
                    </div>


                    <?php if ($totalPages > 1) : ?>
                        <div class="ep-youtube__content__pagination <?php echo (empty($prevPageToken) && empty($nextPageToken)) ? ' hide ' : ''; ?>">
                            <div
                                class="ep-prev" <?php echo empty($prevPageToken) ? ' style="display:none" ' : ''; ?>
                                data-playlistid="<?php echo esc_attr($options['playlistId']) ?>"
                                data-pagetoken="<?php echo esc_attr($prevPageToken) ?>"
                                data-pagesize="<?php echo intval($options['pagesize']) ?>"
                            >
                                <span><?php _e("Prev", "embedpress"); ?></span>
                            </div>
                            <div class="is_desktop_device ep-page-numbers <?php echo $totalPages > 1 ? '' : 'hide'; ?>">
                                <?php

                                    $numOfPages = $totalPages;
                                    $renderedEllipses = false;

                                    $currentPage = !empty($options['currentpage'])?$options['currentpage'] : 1;

                                    for($i = 1; $i<=$numOfPages; $i++)
                                    {
                                        //render pages 1 - 3
                                        if($i < 4) {
                                            //render link
                                            $is_current = $i == (int)$currentPage? "active__current_page" : "";

                                            echo wp_kses_post("<span class='page-number  $is_current' data-page='$i'>$i</span>");

                                        }

                                        //render current page number
                                        else if($i == (int)$currentPage) {
                                            //render link
                                            echo wp_kses_post('<span class="page-number active__current_page" data-page="'.$i.'">'.$i.'</span>');
                                            //reset ellipses
                                            $renderedEllipses = false;
                                        }

                                        //last page number
                                        else if ($i >= $numOfPages - 1) {
                                            //render link
                                            echo wp_kses_post('<span class="page-number" data-page="'.$i.'">'.$i.'</span>');
                                        }

                                        //make sure you only do this once per ellipses group
                                        else {
                                        if (!$renderedEllipses){
                                            print("...");
                                            $renderedEllipses = true;
                                        }
                                        }
                                    }
                                ?>

                            </div>

                            <div class="is_mobile_device ep-page-numbers <?php echo $totalPages > 1 ? '' : 'hide'; ?>">
                                <?php

                                    $numOfPages = $totalPages;
                                    $renderedEllipses = false;

                                    $currentPage = !empty($options['currentpage'])?$options['currentpage'] : 1;

                                    for($i = 1; $i<=$numOfPages; $i++)
                                    {

                                        //render current page number
                                    if($i == (int)$currentPage) {
                                            //render link
                                            echo wp_kses_post('<span class="page-number-mobile" data-page="'.$i.'">'.$i.'</span>');
                                            //reset ellipses
                                            $renderedEllipses = false;
                                        }

                                        //last page number
                                        else if ($i >= $numOfPages ) {
                                            //render link
                                            echo wp_kses_post('...<span class="page-number-mobile" data-page="'.$i.'">'.$i.'</span>');
                                        }
                                    }
                                ?>

                            </div>


                            <div
                                class="ep-next " <?php echo empty($nextPageToken) ? ' style="display:none" ' : ''; ?>
                                data-playlistid="<?php echo esc_attr($options['playlistId']) ?>"
                                data-pagetoken="<?php echo esc_attr($nextPageToken) ?>"
                                data-pagesize="<?php echo intval($options['pagesize']) ?>"
                            >
                                <span><?php _e("Next ", "embedpress"); ?> </span>
                            </div>
                        </div>
                    <?php endif; ?>

                    <div class="ep-loader-wrap">
                        <div class="ep-loader"><img alt="loading" src="<?php echo esc_url(EMBEDPRESS_URL_ASSETS . 'images/youtube/spin.gif'); ?>"></div>
                    </div>

                </div>
            </div>
            <?php
            $gallobj->html = ob_get_clean();
        else:
            $gallobj->html = Helper::clean_api_error_html(__("There is nothing on the playlist.", 'embedpress'));
        endif;

        return $gallobj;
    }


    public static function create_grid_layout($options, $data) {
        $nextPageToken = '';
        $prevPageToken = '';
        $gallobj       = new \stdClass();
        $options       = wp_parse_args($options, [
            'playlistId'  => '',
            'pageToken'   => '',
            'pagesize'    => $data['get_pagesize'] ? $data['get_pagesize'] : 6,
            'currentpage' => '',
            'columns'     => 3,
            'thumbnail'   => 'medium',
            'gallery'     => true,
            'autonext'    => true,
            'thumbplay'   => true,
            'apiKey'      => $data['get_api_key'],
            'hideprivate' => '',
        ]);
        $options['pagesize'] = $options['pagesize'] > 50 ? 50 : $options['pagesize'];
        $options['pagesize'] = $options['pagesize'] < 1 ? 1 : $options['pagesize'];

        if (empty($options['apiKey'])) {
            $gallobj->html = $data['get_api_key_error_message'];
            return $gallobj;
        }

        $apiEndpoint = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,status,contentDetails&playlistId=' . $options['playlistId']
            . '&maxResults=' . $options['pagesize']
            . '&key=' . $options['apiKey'];
        if ($options['pageToken'] != null) {
            $apiEndpoint .= '&pageToken=' . $options['pageToken'];
        }



        $transient_key          = 'ep_embed_youtube_channel_' . md5($apiEndpoint);
        $gallobj->transient_key = $transient_key;
        $jsonResult             = get_transient($transient_key);


        if (empty($jsonResult)) {
            $apiResult = wp_remote_get($apiEndpoint, array('timeout' => $data['curltimeout']));
            if (is_wp_error($apiResult)) {
                $gallobj->html = Helper::clean_api_error_html($apiResult->get_error_message(), true);
                return $gallobj;
            }
            $jsonResult = json_decode($apiResult['body']);
            
            if (empty($jsonResult->error)) {
                set_transient($transient_key, $jsonResult, MINUTE_IN_SECONDS * 20);
            }
            else{
                set_transient($transient_key, $jsonResult, 10);
            }
        }



        if (isset($jsonResult->error)) {
            if(!empty($jsonResult->error->errors[0]->reason) && $jsonResult->error->errors[0]->reason == 'playlistNotFound'){
                $gallobj->html = Helper::clean_api_error_html(__('There is nothing on the playlist.', 'embedpress'));
                return $gallobj;
            }
            if (isset($jsonResult->error->message)) {
                $gallobj->html = Helper::clean_api_error_html($jsonResult->error->message);
                return $gallobj;
            }
            $gallobj->html = Helper::clean_api_error_html(__('Sorry, there may be an issue with your YouTube API key.', 'embedpress'));
            return $gallobj;
        }



        $resultsPerPage = $jsonResult->pageInfo->resultsPerPage;
        $totalResults = $jsonResult->pageInfo->totalResults;
        $totalPages = ceil($totalResults / $resultsPerPage);
        if (isset($jsonResult->nextPageToken)) {
            $nextPageToken = $jsonResult->nextPageToken;
        }

        if (isset($jsonResult->prevPageToken)) {
            $prevPageToken = $jsonResult->prevPageToken;
        }


        if (!empty($jsonResult->items) && is_array($jsonResult->items)) :
            if($options['gallery'] === "false"){
                $gallobj->html = "";
                if(count($jsonResult->items) === 1){
                    $gallobj->first_vid = Helper::get_id($jsonResult->items[0]);
                }
                return $gallobj;
            }

            if(count($jsonResult->items) === 1 && empty($nextPageToken) && empty($prevPageToken)){
                $gallobj->first_vid = Helper::get_id($jsonResult->items[0]);
                $gallobj->html = "";
                return $gallobj;
            }

            if (strpos($options['playlistId'], 'UU') === 0) {
                // sort only channels
                usort($jsonResult->items, array(Helper::class, 'compare_vid_date')); // sorts in place
            }
            

            ob_start();

            ?>

            <div class="ep-youtube__content__block"  data-unique-id="<?php echo wp_rand(); ?>">
                <div class="youtube__content__body">
                    <?php 
                    $channel_info = $data['get_channel_info'];
                    echo YoutubeLayout::create_channel_info_layout($channel_info); ?>

                    <div class="content__wrap">
                        <?php foreach ($jsonResult->items as $item) : ?>
                            <?php
                            $privacyStatus = isset($item->status->privacyStatus) ? $item->status->privacyStatus : null;
                            $thumbnail = Helper::get_thumbnail_url($item, $options['thumbnail'], $privacyStatus);
                            $vid = Helper::get_id($item);
                            if (empty($gallobj->first_vid)) {
                                $gallobj->first_vid = $vid;
                            }
                            if ($privacyStatus == 'private' && $options['hideprivate']) {
                                continue;
                            }
                            ?>
                            <div class="item" data-vid="<?php echo $vid; ?>">
                                <div class="thumb" style="background: <?php echo "url({$thumbnail}) no-repeat center"; ?>">
                                    <div class="play-icon">
                                        <img src="<?php echo esc_url(EMBEDPRESS_URL_ASSETS . 'images/youtube/youtube-play.png'); ?>" alt="">
                                    </div>
                                </div>
                                <div class="body">
                                    <p><?php echo $item->snippet->title; ?></p>
                                </div>
                            </div>

                        <?php endforeach; ?>
                        <div class="item" style="height: 0"></div>
                    </div>


                    <?php if ($totalPages > 1) : ?>
                        <div class="ep-youtube__content__pagination <?php echo (empty($prevPageToken) && empty($nextPageToken)) ? ' hide ' : ''; ?>">
                            <div
                                class="ep-prev" <?php echo empty($prevPageToken) ? ' style="display:none" ' : ''; ?>
                                data-playlistid="<?php echo esc_attr($options['playlistId']) ?>"
                                data-pagetoken="<?php echo esc_attr($prevPageToken) ?>"
                                data-pagesize="<?php echo intval($options['pagesize']) ?>"
                            >
                                <span><?php _e("Prev", "embedpress"); ?></span>
                            </div>
                            <div class="is_desktop_device ep-page-numbers <?php echo $totalPages > 1 ? '' : 'hide'; ?>">
                                <?php

                                    $numOfPages = $totalPages;
                                    $renderedEllipses = false;

                                    $currentPage = !empty($options['currentpage'])?$options['currentpage'] : 1;

                                    for($i = 1; $i<=$numOfPages; $i++)
                                    {
                                        //render pages 1 - 3
                                        if($i < 4) {
                                            //render link
                                            $is_current = $i == (int)$currentPage? "active__current_page" : "";

                                            echo wp_kses_post("<span class='page-number  $is_current' data-page='$i'>$i</span>");

                                        }

                                        //render current page number
                                        else if($i == (int)$currentPage) {
                                            //render link
                                            echo wp_kses_post('<span class="page-number active__current_page" data-page="'.$i.'">'.$i.'</span>');
                                            //reset ellipses
                                            $renderedEllipses = false;
                                        }

                                        //last page number
                                        else if ($i >= $numOfPages - 1) {
                                            //render link
                                            echo wp_kses_post('<span class="page-number" data-page="'.$i.'">'.$i.'</span>');
                                        }

                                        //make sure you only do this once per ellipses group
                                        else {
                                        if (!$renderedEllipses){
                                            print("...");
                                            $renderedEllipses = true;
                                        }
                                        }
                                    }
                                ?>

                            </div>

                            <div class="is_mobile_device ep-page-numbers <?php echo $totalPages > 1 ? '' : 'hide'; ?>">
                                <?php

                                    $numOfPages = $totalPages;
                                    $renderedEllipses = false;

                                    $currentPage = !empty($options['currentpage'])?$options['currentpage'] : 1;

                                    for($i = 1; $i<=$numOfPages; $i++)
                                    {

                                        //render current page number
                                    if($i == (int)$currentPage) {
                                            //render link
                                            echo wp_kses_post('<span class="page-number-mobile" data-page="'.$i.'">'.$i.'</span>');
                                            //reset ellipses
                                            $renderedEllipses = false;
                                        }

                                        //last page number
                                        else if ($i >= $numOfPages ) {
                                            //render link
                                            echo wp_kses_post('...<span class="page-number-mobile" data-page="'.$i.'">'.$i.'</span>');
                                        }
                                    }
                                ?>

                            </div>


                            <div
                                class="ep-next " <?php echo empty($nextPageToken) ? ' style="display:none" ' : ''; ?>
                                data-playlistid="<?php echo esc_attr($options['playlistId']) ?>"
                                data-pagetoken="<?php echo esc_attr($nextPageToken) ?>"
                                data-pagesize="<?php echo intval($options['pagesize']) ?>"
                            >
                                <span><?php _e("Next ", "embedpress"); ?> </span>
                            </div>
                        </div>
                    <?php endif; ?>

                    <div class="ep-loader-wrap">
                        <div class="ep-loader"><img alt="loading" src="<?php echo esc_url(EMBEDPRESS_URL_ASSETS . 'images/youtube/spin.gif'); ?>"></div>
                    </div>

                </div>
            </div>

                <div id="videoPopup" class="video-popup">
                    <div class="video-popup-content">
                        <span class="close">&times;</span>
                        <iframe id="videoIframe" frameborder="0" allowfullscreen></iframe>
                        <div class="popup-controls">
                            <span id="prevVideo" class="nav-icon prev-icon">&#10094;</span>
                            <span id="nextVideo" class="nav-icon next-icon">&#10095;</span>
                        </div>
                    </div>
                </div>

            <?php
            $gallobj->html = ob_get_clean();
        else:
            $gallobj->html = Helper::clean_api_error_html(__("There is nothing on the playlist.", 'embedpress'));
        endif;

        return $gallobj;
    }
}


