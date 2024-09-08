<?php

namespace EmbedPress\Providers\TemplateLayouts;


use Embera\Provider\ProviderAdapter;
use Embera\Provider\ProviderInterface;
use Embera\Url;
use EmbedPress\Includes\Classes\Helper;


class YoutubeLayout
{

   

    public static function create_channel_info_layout($channel_info, $channel_url)
    {
        $title = isset($channel_info['snippet']['title']) ? $channel_info['snippet']['title'] : null;
        $handle = isset($channel_info['snippet']['customUrl']) ? $channel_info['snippet']['customUrl'] : null;
        $subscriberCount = isset($channel_info['statistics']['subscriberCount']) ? $channel_info['statistics']['subscriberCount'] : null;
        $videoCount = isset($channel_info['statistics']['videoCount']) ? $channel_info['statistics']['videoCount'] : null;
        $thumbnailUrl = isset($channel_info['snippet']['thumbnails']['high']['url']) ? $channel_info['snippet']['thumbnails']['high']['url'] : null;

        ob_start();
        ?>
        <div class="channel-header" data-channel-url="<?php echo esc_url($channel_url); ?>">
            <img src="<?php echo esc_url($thumbnailUrl); ?>" alt="<?php echo esc_attr($title); ?>" class="profile-picture">
            <div class="channel-info">
                <div class="info-description">
                    <h1 class="channel-name"><?php echo esc_html($title); ?></h1>
                    <p class="channel-details"><?php echo esc_html($handle); ?> · <?php echo esc_html(Helper::format_number($subscriberCount)); ?> subscribers · <?php echo esc_html(Helper::format_number($videoCount)); ?> videos</p>
                </div>
                <a target="_blank" href="<?php echo esc_url('https://www.youtube.com/' . $handle);  ?>" class="subscribe-button">
                    <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.467 1.653A1.6 1.6 0 0 1 8.4 3.093 6.026 6.026 0 0 1 14 9.067v4.586c0 1.067.053 1.92.96 2.4a.694.694 0 0 1-.267 1.28H8.88a1.333 1.333 0 1 1-1.76 0H1.36a.693.693 0 0 1-.32-1.28c.907-.48.96-1.333.96-2.4V9.067a6.027 6.027 0 0 1 5.6-5.974 1.493 1.493 0 1 1 1.867-1.44m-1.44 2.774a4.8 4.8 0 0 0-4.694 4.64v4.693c0 .587 0 1.493-.373 2.293h10.133c-.426-.8-.373-1.653-.373-2.293V9.067a4.8 4.8 0 0 0-1.405-3.289c-.874-.874-2.052-1.324-3.288-1.351" fill="#fff" /></svg>
                    <?php echo esc_html__('Subscribe', 'embbedpress'); ?></a>
            </div>
        </div>
        <?php

        $channel_layout = ob_get_clean();

        return $channel_layout;
    }


    public static function generate_youtube_video_description($video_data) {
        $title = isset($video_data['snippet']['title']) ? $video_data['snippet']['title'] : null;
        $description = isset($video_data['snippet']['description']) ? $video_data['snippet']['description'] : null;
        $publishedAt = isset($video_data['snippet']['publishedAt']) ? date("M j, Y", strtotime($video_data['snippet']['publishedAt'])) : null;
        $channelTitle = isset($video_data['snippet']['channelTitle']) ? $video_data['snippet']['channelTitle'] : null;
        $viewCount = isset($video_data['statistics']['viewCount']) ? $video_data['statistics']['viewCount'] : null;
        $likeCount = isset($video_data['statistics']['likeCount']) ? $video_data['statistics']['likeCount'] : null;
        $commentCount = isset($video_data['statistics']['commentCount']) ? $video_data['statistics']['commentCount'] : null;
        $videoId = isset($video_data['id']) ? $video_data['id'] : null;
        $videoUrl = $videoId ? "https://www.youtube.com/watch?v={$videoId}" : null;

    
        $html = "
        <div class='youtube-video-description'>
            <div class='youtube-video-header'>
                <h1>{$title}</h1>
                <div class='youtube-video-meta'>
                    <span>{$viewCount} views</span>
                    <span>{$publishedAt}</span>
                </div>
            </div>
            <div class='youtube-video-body'>
                <p>{$description}</p>
            </div>
            <div class='youtube-video-footer'>
                <div class='youtube-video-stats'>
                    <span><svg width='20' height='17.539' viewBox='0 0 20 17.539' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M12.648.109a2.814 2.814 0 0 0-3.477 1.93l-.223.781a3.4 3.4 0 0 1-.762 1.367L6.182 6.39a.937.937 0 0 0 1.387 1.261l2.004-2.203a5.3 5.3 0 0 0 1.176-2.113l.223-.781a.937.937 0 1 1 1.805.515l-.223.781a7.2 7.2 0 0 1-1.039 2.168c-.203.285-.227.66-.066.973s.48.508.832.508H17.5a.627.627 0 0 1 .219 1.211.94.94 0 0 0-.375 1.5.624.624 0 0 1-.352 1.027.938.938 0 0 0-.562 1.504.625.625 0 0 1-.265.969.94.94 0 0 0-.563 1.125.627.627 0 0 1-.602.793h-3.809c-.492 0-.977-.145-1.387-.418l-2.41-1.605c-.43-.289-1.012-.172-1.301.262s-.172 1.012.262 1.301l2.41 1.605c.719.48 1.563.734 2.426.734H15a2.5 2.5 0 0 0 2.5-2.422 2.5 2.5 0 0 0 .887-2.461 2.49 2.49 0 0 0 .879-2.722A2.53 2.53 0 0 0 20 8.125a2.5 2.5 0 0 0-2.5-2.5h-3.605c.184-.406.34-.828.461-1.258l.223-.781a2.814 2.814 0 0 0-1.93-3.477M1.25 6.25A1.25 1.25 0 0 0 0 7.5v8.75c0 .691.559 1.25 1.25 1.25h2.5A1.25 1.25 0 0 0 5 16.25V7.5a1.25 1.25 0 0 0-1.25-1.25z' fill='#fff'/></svg> {$likeCount}</span>
                    <span><svg width='20' height='15.975' viewBox='0 0 20 15.975' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M2.783 9.644a1.5 1.5 0 0 0-.234-1.741c-.664-.699-1.02-1.538-1.02-2.412 0-1.981 1.991-3.994 4.992-3.994s4.992 2.012 4.992 3.994-1.991 3.994-4.992 3.994a6.3 6.3 0 0 1-1.179-.112 1.5 1.5 0 0 0-.958.131q-.192.098-.393.187c-.499.225-1.027.421-1.557.562a14 14 0 0 0 .346-.608zM.031 5.491c0 1.304.537 2.499 1.432 3.441l-.087.159C1.055 9.665.68 10.23.234 10.717a.751.751 0 0 0 .546 1.264c1.342 0 2.699-.415 3.828-.927q.227-.104.443-.212c.471.094.964.14 1.47.14 3.585 0 6.49-2.459 6.49-5.491S10.106 0 6.521 0 .031 2.459.031 5.491m13.479 9.485c.505 0 .995-.05 1.47-.14q.217.109.443.212c1.129.512 2.487.927 3.828.927a.746.746 0 0 0 .542-1.26c-.443-.487-.817-1.051-1.142-1.626l-.087-.159c.899-.945 1.435-2.14 1.435-3.445 0-2.945-2.743-5.351-6.184-5.485q.192.712.193 1.491v.019c2.721.209 4.493 2.106 4.493 3.975 0 .874-.356 1.713-1.02 2.409a1.5 1.5 0 0 0-.234 1.741l.1.184q.118.21.246.424a10 10 0 0 1-1.557-.562q-.201-.089-.393-.187a1.5 1.5 0 0 0-.958-.131q-.566.112-1.179.112c-1.925 0-3.432-.827-4.268-1.944a8.7 8.7 0 0 1-1.56.368c1.058 1.823 3.274 3.078 5.832 3.078' fill='#fff'/></svg> {$commentCount}</span>
                </div>
            </div>
        </div>";
    
        return $html;
    }


    public static function create_list_layout($jsonResult, $gallobj, $options, $data, $channelTitle, $channelThumb){

        // $channelTitle = $data['get_channel_info']['snippet']['title'];
        // $channelThumb = $data['get_channel_info']['snippet']['thumbnails']['default']['url'];
        
        foreach ($jsonResult->items as $item) : ?>
            <?php
            $privacyStatus = isset($item->status->privacyStatus) ? $item->status->privacyStatus : null;
            $thumbnail = Helper::get_thumbnail_url($item, $options['thumbnail'], $privacyStatus);
            $vid = Helper::get_id($item);
            $videoTitle = isset($item->snippet->title) ? $item->snippet->title : '';
            $videoDescription = isset($item->snippet->description) ? $item->snippet->description : '';

            $publishedAt = isset($item->snippet->publishedAt) ? $item->snippet->publishedAt : '';

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
                <div class="body youtube-body-content">
                    <div class="description-container">
                        <div class="thumbnail"><img src="<?php echo esc_url($channelThumb ); ?>"/></div>
                        <div class="details">
                            <div class="channel"><?php echo esc_html($channelTitle); ?></div>
                            <div class="title"><?php echo esc_html($videoTitle); ?></div>
                            <p class="description"><?php echo esc_html(Helper::trimTitle($videoDescription, 25)); ?></p>
                            
                            <div class="views-time">
                                 <span class="time"><?php echo esc_html(Helper::timeAgo($publishedAt)); ?></span>
                            </div>
                        </div>
                    </div>
                </div>            
            </div>
        <?php endforeach;
    }
    public static function create_gallery_layout($jsonResult, $gallobj, $options, $data, $channelTitle, $channelThumb){

        // $channelTitle = $data['get_channel_info']['snippet']['title'];
        // $channelThumb = $data['get_channel_info']['snippet']['thumbnails']['default']['url'];

        foreach ($jsonResult->items as $item) : ?>
            <?php
            $privacyStatus = isset($item->status->privacyStatus) ? $item->status->privacyStatus : null;
            $thumbnail = Helper::get_thumbnail_url($item, $options['thumbnail'], $privacyStatus);
            $vid = Helper::get_id($item);
            $videoTitle = isset($item->snippet->title) ? $item->snippet->title : '';
            $publishedAt = isset($item->snippet->publishedAt) ? $item->snippet->publishedAt : '';

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
                <div class="body youtube-body-content">
                    <div class="description-container">
                        <div class="thumbnail"><img src="<?php echo esc_url($channelThumb ); ?>"/></div>
                        <div class="details">
                            <div class="channel"><?php echo esc_html($channelTitle); ?></div>
                            <div class="title"><?php echo esc_html(Helper::trimTitle($videoTitle, 6)); ?></div>
                            
                            <div class="views-time">
                                 <span class="time"><?php echo esc_html(Helper::timeAgo($publishedAt)); ?></span>
                            </div>
                        </div>
                    </div>
                </div>            
            </div>
        <?php endforeach;
    }
    

    public static function create_youtube_layout($options, $data, $layout, $url) {
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


                <?php 
                    $channel_info = $data['get_channel_info'];

                  

                    $chanelTitle = isset($channel_info['snippet']['title']) ? $channel_info['snippet']['title'] : null;
                    $channelThumb = isset($channel_info['snippet']['thumbnails']['high']['url']) ? $channel_info['snippet']['thumbnails']['high']['url'] : null;
                    

                    echo self::create_channel_info_layout($channel_info, $url);

                    $channel_id = '';
                    if(isset($channel_info['id'])) {
                        $channel_id = $channel_info['id'];
                    }

                    $carouselWrapperClass = '';
                    $carouselSelectorId = '';
                    if($layout == 'carousel') {
                        $carouselWrapperClass = 'youtube-carousel';
                        $carouselSelectorId = 'data-youtube-channel-carousel="carousel-'.esc_attr(md5($channel_id)).'"';
                    }
                    
                ?>

            <div class="ep-youtube__content__block" <?php echo $carouselSelectorId; ?> data-unique-id="<?php echo esc_attr(md5($channel_id)); ?>">
                <div class="youtube__content__body youtube-carousel-container">
                    <div class="content__wrap <?php echo esc_attr($carouselWrapperClass);  ?>" >

                        <?php 
                                if($layout === 'gallery'){
                                    echo self::create_gallery_layout($jsonResult, $gallobj, $options, $data, $chanelTitle, $channelThumb); 
                                }
                          
                                else if($layout === 'list'){
                                    echo self::create_list_layout($jsonResult, $gallobj, $options, $data, $chanelTitle, $channelThumb); 
                                }
                                else if($layout === 'grid'){
                                    do_action('embedpress/youtube_grid_layout', $jsonResult, $gallobj, $options, $data, $chanelTitle, $channelThumb);

                                }
                                else if($layout === 'carousel'){
                                    do_action('embedpress/youtube_carousel_layout', $jsonResult, $gallobj, $options, $data, $chanelTitle, $channelThumb);
                                }
                                else{
                                    echo self::create_gallery_layout($jsonResult, $gallobj, $options, $data, $chanelTitle, $channelThumb); 

                                }
                        ?>
                        <div class="item" style="height: 0"></div>
                    </div>
                    
                    <!-- Pagination and other content remains unchanged -->
                    <?php if ($totalPages > 1 && $layout !== 'carousel') : ?>
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
                    
                </div>


                <?php  if($layout === 'carousel'): ?>
                        <div class="carousel-controls">
                            <button class="preview">❮</button>
                            <button class="next">❯</button>
                     <?php endif; ?>

            </div>

            <?php
            $gallobj->html = ob_get_clean();
        else:
            $gallobj->html = Helper::clean_api_error_html(__("There is nothing on the playlist.", 'embedpress'));
        endif;

        return $gallobj;
    }

}





