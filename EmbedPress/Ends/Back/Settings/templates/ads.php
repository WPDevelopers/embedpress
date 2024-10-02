<?php
/*
 * Custom Logo Settings page
 * All undefined vars comes from 'render_settings_page' method
 *
 *  */

use EmbedPress\Includes\Classes\Helper;

$video_demo_adUrl = 'https://embedpress.com/wp-content/uploads/2023/12/notificationX-demo-ad.mp4';
$image_demo_adUrl = 'https://embedpress.com/wp-content/uploads/2023/12/demo-ad.gif';
$youtube_embed_url = 'https://www.youtube.com/embed/coLxfjnrm3I?enablejsapi=1&origin=' . site_url();


global $pro_active;
$updgrade_pro_text = ' You';
if(!$pro_active){
    $updgrade_pro_text = ' This is a pro feature but you';
}

?>

<div class="embedpress_calendly_settings  background__white radius-25 p40" >
<div class="border">
<div class="sponsored-settings-top">
        <div <?php if(!$pro_active): echo 'class="sponsored-settings-content"'; endif; ?>>
            <h3 class="ads-settings-title">
                <?php
                echo wp_kses_post(
                    sprintf(
                        esc_html__(
                            'Advertise Across %s with EmbedPress – Your Gateway to Unlimited Exposure!',
                            'embedpress'
                        ),
                        '<a target="_blank" href="' . esc_url('https://embedpress.com/sources/') . '"><span style="color:#FF7369">' . esc_html__('150+ Platforms', 'embedpress') . '</span></a>'
                    )
                );
                ?>

            </h3>
            <p class="ads-settings-description">
                <?php
                echo wp_kses_post(
                    sprintf(
                        esc_html__(
                            "Now, you can showcase your ads across %s, guaranteeing unlimited exposure for your business through your embedded contents.%s can check the settings below for a demo example. | %s",
                            'embedpress'
                        ),
                        '<strong>' . esc_html__('150+ diverse platforms', 'embedpress') . '</strong>',
                        $updgrade_pro_text,
                        '<a href="' . esc_url('https://embedpress.com/docs/how-to-configure-ep-ads-settings/                            ') . '" target="_blank" style="color:#FF7369"><strong>' . esc_html__('Docs', 'embedpress') . '</strong></a>'
                    )
                );

                ?>
            </p>
        </div>
        <?php
        
        if (!$pro_active) :
            ?>
            <a href="<?php echo esc_url('https://wpdeveloper.com/in/upgrade-embedpress'); ?>" target="_blank" class="button button-pro-upgrade"><?php echo esc_html__('Upgrade To Pro', 'embedpress'); ?><i class="ep-icon ep-link-icon"></i></a>
        <?php endif; ?>
    </div>
</div>
  

    <div class="sponsored-toggle_wrapper">
         <div class="btn-video sponsored-toggle_btn  sponsored-active_btn " >
           <span>  
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">               
             <g clip-path="url(#clip0_952_112)">
               <path d="M15 10L19.553 7.724C19.7054 7.64783 19.8748 7.61188 20.045 7.61954C20.2152 7.62721 20.3806 7.67824 20.5256 7.7678C20.6706 7.85736 20.7902 7.98247 20.8733 8.13127C20.9563 8.28006 20.9999 8.44761 21 8.618V15.382C20.9999 15.5524 20.9563 15.7199 20.8733 15.8687C20.7902 16.0175 20.6706 16.1426 20.5256 16.2322C20.3806 16.3218 20.2152 16.3728 20.045 16.3805C19.8748 16.3881 19.7054 16.3522 19.553 16.276L15 14V10Z" stroke="#25396F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
               <path d="M3 8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H13C13.5304 6 14.0391 6.21071 14.4142 6.58579C14.7893 6.96086 15 7.46957 15 8V16C15 16.5304 14.7893 17.0391 14.4142 17.4142C14.0391 17.7893 13.5304 18 13 18H5C4.46957 18 3.96086 17.7893 3.58579 17.4142C3.21071 17.0391 3 16.5304 3 16V8Z" stroke="#25396F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
               </g>
               <defs>
               <clipPath id="clip0_952_112">
               <rect width="24" height="24" fill="white"/>
               </clipPath>
               </defs>
               </svg>

           </span>
           <span>Video</span>
         </div>
       <div class="btn-img sponsored-toggle_btn ">
           <span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <g clip-path="url(#clip0_952_123)">
                   <path d="M12.5 6.66663H12.5083" stroke="#7C8DB5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                   <path d="M2.5 5C2.5 4.33696 2.76339 3.70107 3.23223 3.23223C3.70107 2.76339 4.33696 2.5 5 2.5H15C15.663 2.5 16.2989 2.76339 16.7678 3.23223C17.2366 3.70107 17.5 4.33696 17.5 5V15C17.5 15.663 17.2366 16.2989 16.7678 16.7678C16.2989 17.2366 15.663 17.5 15 17.5H5C4.33696 17.5 3.70107 17.2366 3.23223 16.7678C2.76339 16.2989 2.5 15.663 2.5 15V5Z" stroke="#7C8DB5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                   <path d="M2.5 13.3333L6.66667 9.16665C7.44 8.42248 8.39333 8.42248 9.16667 9.16665L13.3333 13.3333" stroke="#7C8DB5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                   <path d="M11.666 11.6667L12.4993 10.8334C13.2727 10.0892 14.226 10.0892 14.9993 10.8334L17.4993 13.3334" stroke="#7C8DB5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                   </g>
                   <defs>
                   <clipPath id="clip0_952_123">
                   <rect width="20" height="20" fill="white"/>
                   </clipPath>
                   </defs>
                 </svg>
           </span>
           <span>Images</span>
       </div>
    </div>

    <div class="entry-content clear" ast-blocks-layout="true" itemprop="text">

    <div class="sponsored-wrapper video-body toggle-active">
        <div class="sponsored-preview-sectiion">
            <div class="video-ad-prewiew-options">
                <div class="ad__adjust__wrap " style="display: block;">

                    <div class="ad__adjust">
                        <form class="ad__adjust__controller" id="ad-preview-0">
                            <div class="form-input-wrapper">
                                <div class="ad__adjust__controller__item">
                                    <span class="controller__label negative-margin"><?php echo esc_html__('Upload Ad', 'embedpress'); ?></span>
                                    <div class="ad__adjust__controller__inputs sponsored-upload-options">

                                        <button class="uploadBtn" type="button" data-upload-index="0">
                                            <span class="dashicons dashicons-upload"></span> <?php echo esc_html__('Upload', 'embedpress'); ?>
                                        </button>
                             
                                        <input type="hidden" id="fileInput-0" name="adFileUrl" value="<?php echo esc_url('https://embedpress.com/wp-content/uploads/2023/12/notificationX-demo-ad.mp4'); ?>" />

                                        <p class="uploaded-file-url-0 uploaded"><?php echo esc_html('notificationX-demo-ad.mp4'); ?></p>
                      
                                    </div>
                                </div>

                                <div class="ad__adjust__controller__item">
                                    <span class="controller__label"><?php echo esc_html__('Ad Redirection URL', 'embedpress'); ?></span>
                                    <div class="ad__adjust__controller__inputs">
                                        <input type="url" name="adUrl" id="ad_cta_url" class="form__control" data-default="<?php echo esc_url('https://notificationx.com/'); ?>" value="<?php echo esc_url('https://notificationx.com/'); ?>">
                                    </div>
                                </div>

                                <div class="ad__adjust__controller__item">
                                    <span class="controller__label"><?php echo esc_html__('Ad Start After (Sec)', 'embedpress'); ?></span>
                                    <div class="ad__adjust__controller__inputs">
                                       
                                    <div class="range-control opacity-range_control">
                                        <span class="range_negative">
                                          <div class="controller negative-controller"></div>
                                        </span>
                                         <div class="show-value">
                                            <input  type="number" name="adStart" class="form__control range__value" data-default="10" value="10">
                                           
                                         </div>
                                         
                                         <span class="range_positive"> 
                                         <div class="controller controller-roted"></div>
                                         <div class="controller"></div>
                                         </span>
                                    </div>    
                                    </div>
                                </div>

                                <div class="ad__adjust__controller__item skip-controller">
                                    <span class="controller__label"><?php echo esc_html__('Skip Button', 'embedpress'); ?></span>
                                    <div class="ad__adjust__controller__inputs">


                                        <label class="input__switch switch__text ">
                                            <input type="checkbox" name="adSkipButton" data-default="no" data-value="no" value="yes" checked>
                                            <span></span>

                                        </label>


                                        
                                    </div>
                                </div>

                                <div class="ad__adjust__controller__item skip-controller">
                                    <span class="controller__label"><?php echo esc_html__('Skip Button After (Sec)', 'embedpress'); ?></span>
                                    <div class="ad__adjust__controller__inputs">
                                 <div class="range-control skip-range_control">
                                       <span class="range_negative">
                                           <div class="controller negative-controller"></div>
                                        </span>
                                            <div class="show-value">
                                            <input  type="number" name="adSkipButtonAfter" class="form__control range__value " data-default="5" value="5">
                                         </div>
                                          

                                            <span class="range_positive"> 
                                         <div class="controller controller-roted"></div>
                                         <div class="controller"></div>
                                         </span>
                                 </div>
                                 </div>
                                </div>
                            </div>


                        </form>

                    </div>
                </div>
            </div>
            <div class="embedpress-gutenberg-wrapper aligncenter ep-content-protection-disabled inline" id="1c3da3de-7606-4e9f-9693-d4b570cd2ca30">
                <h2 class="wp-block-heading has-text-align-center"><mark style="background-color:rgba(0, 0, 0, 0)" class="has-inline-color has-ast-global-color-2-color"><?php echo esc_html__('Live Preview for Video', 'embedpress'); ?></h2>
                <p class="preview-description"><?php echo esc_html__('Experience EmbedPress Ad feature with YouTube video, but it will work with all embedded contents such as videos, audios, documents, etc..', 'embedpress'); ?></p>
                <div class="wp-block-embed__wrapper">
                    <div id="ep-gutenberg-content-ep-ad-preview-0" class="ep-gutenberg-content margin-bottom-24px">
                        <div data-sponsored-id="ep-ad-preview-0" id="ep-ad-preview-0" class="sponsored-mask" data-ad-index="0">
                            <div class="ep-embed-content-wraper ">
                                <div class="ose-youtube ose-embedpress-responsive">
                                    <iframe width="560" height="315" src="<?php echo esc_url($youtube_embed_url); ?>" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                                </div>
                            </div>
                            <div class="main-ad-template" id="ad-template-0" data-adType="video" style="display:none">
                                <div class="ep-ad-container">
                                    <div class="ep-ad-content sponsored-video hidden" style="position: relative;">
                                        <a target="_blank" class="sponsored-url" href="#">

                                            <video class="ep-ad" muted="">
                                                <source src="<?php echo esc_url($video_demo_adUrl); ?>">
                                            </video>

                                            <div class="sponsored-timer">
                                                <span class="sponsored-running-time"></span>
                                                <span class="sponsored-duration">&nbsp;• Ad</span>
                                            </div>
                                            <div class="progress-bar-container">
                                                <div class="progress-bar"></div>
                                            </div>
                                        </a>


                                        <button title="Skip Ad" class="skip-ad-button" style="display: none;">
                                            <?php echo esc_html__('Skip Ad', 'embedpress'); ?> </button>

                                    </div>

                                    <div class="ep-ad-content sponsored-image hidden" style="position: relative;">
                                        <a target="_blank" class="sponsored-url" href="#">
                                            <img decoding="async" class="ep-ad" src="<?php echo esc_url($image_demo_adUrl); ?>">
                                        </a>
                                        <button title="Skip Ad" class="skip-ad-button" style="display: inline-block;">
                                            <?php echo esc_html__('Skip Ad', 'embedpress'); ?> </button>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button type="submit" class="button preview-btn-0"> <?php echo esc_html__('Start Preview', 'embedpress'); ?> </button>
                </div>
            </div>



        </div>
   </div>

      
   <div class="sponsored-wrapper img-body ">
        <div class="sponsored-preview-sectiion">
            <div class="video-ad-prewiew-options">
                <div class="ad__adjust__wrap " style="display: block;">
                    <div class="ad__adjust">
                        <form class="ad__adjust__controller" id="ad-preview-1">
                            <div class="form-input-wrapper">

                                <div class="ad__adjust__controller__item">
                                    <span class="controller__label negative-margin"><?php echo esc_html__('Upload Ad', 'embedpress'); ?></span>
                                    <div class="ad__adjust__controller__inputs sponsored-upload-options">
                                        <button class="uploadBtn" type="button" data-upload-index="1">
                                            <span class="dashicons dashicons-upload"></span> <?php echo esc_html__('Upload', 'embedpress'); ?>
                                        </button>

                                        <input type="hidden" id="fileInput-1" name="adFileUrl" value="<?php echo esc_url($image_demo_adUrl); ?>" />
                                        <p class="uploaded-file-url-1 uploaded"><?php echo esc_html('demo-ad.gif'); ?></p>
                                    </div>
                                </div>


                                <div class="ad__adjust__controller__item">
                                    <span class="controller__label"><?php echo esc_html__('Ad Redirection URL', 'embedpress'); ?></span>
                                    <div class="ad__adjust__controller__inputs">
                                        <input type="url" name="adUrl" id="ad_cta_url" class="form__control" data-default="<?php echo esc_url('https://notificationx.com/'); ?>" value="<?php echo esc_url('https://notificationx.com/'); ?>">
                                    </div>
                                </div>

                                <div class="ad__adjust__controller__item">
                                    <span class="controller__label"><?php echo esc_html__('Ad Start After (Sec)', 'embedpress'); ?></span>
                                    <div class="ad__adjust__controller__inputs">
                                    <div class="range-control image-range_control">
                                       <span class="range_negative">
                                           <div class="controller negative-controller"></div>
                                        </span>

                                            <div class="show-value">
                                            <!-- <span class="input-value_show">6</span> -->
                                            <input  type="number" name="adStart" class="form__control range__value" data-default="10" value="10">
                                         </div>
                                          

                                            <span class="range_positive"> 
                                         <div class="controller controller-roted"></div>
                                         <div class="controller"></div>
                                         </span>
                                 </div>
                                     
                                     
                                    </div>
                                </div>

                                <div class="ad__adjust__controller__item skip-controller hidden">
                                    <span class="controller__label"><?php echo esc_html__('Skip Button', 'embedpress'); ?></span>
                                    <div class="ad__adjust__controller__inputs">
                                        <label class="input__switch switch__text ">
                                            <input type="checkbox" name="adSkipButton" data-default="no" data-value="no" value="yes" checked>
                                            <span></span>

                                        </label>
                                    </div>
                                </div>

                                <div class="ad__adjust__controller__item skip-controller hidden">
                                    <span class="controller__label"><?php echo esc_html__('Skip Button After (Sec)', 'embedpress'); ?></span>
                                    <div class="ad__adjust__controller__inputs">

                                        <input readonly="" type="number" name="adSkipButtonAfter" class="form__control range__value" data-default="5" value="5">
                                    </div>
                                </div>

                            </div>
                           
                        </form>

                    </div>
                </div>
            </div>
            <div class="embedpress-gutenberg-wrapper aligncenter   ep-content-protection-disabled inline" id="1c3da3de-7606-4e9f-9693-d4b570cd2ca31">
                <h2 class="wp-block-heading has-text-align-center"><mark style="background-color:rgba(0, 0, 0, 0)" class="has-inline-color has-ast-global-color-2-color"><?php echo esc_html__('Live Preview for Documents', 'embedpress'); ?></h2>

                <p class="preview-description"><?php echo esc_html__('Experience EmbedPress Ad feature with with a PDF, but it will work with all embedded contents such as videos, audios, documents, etc..', 'embedpress'); ?></p>

                <div class="wp-block-embed__wrapper   ">
                    <div id="ep-gutenberg-content-ep-ad-preview-1" class="ep-gutenberg-content margin-bottom-24px">
                        <div data-sponsored-id="ep-ad-preview-1" id="ep-ad-preview-1" class="sponsored-mask" data-ad-index="0">
                            <div class="ep-embed-content-wraper">
                                <div class="position-right-wraper gutenberg-pdf-wraper">
                                    <?php
                                    $pdf_url = EMBEDPRESS_SETTINGS_ASSETS_URL . 'embedpress.pdf';
                                    $renderer = Helper::get_pdf_renderer();
                                    $src = $renderer . ((strpos($renderer, '?') == false) ? '?' : '&') . 'file=' . urlencode($pdf_url);
                                    ?>
                                    <iframe title="sample" class="embedpress-embed-document-pdf embedpress-pdf-1701320841615" style="width:550px;height:320px; max-width:100%; display: inline-block" src="<?php echo esc_url($src); ?>" frameborder="0" oncontextmenu="return false;"></iframe>
                                    <!-- <p class="embedpress-el-powered"><?php echo esc_html__('Powered By EmbedPress', 'embedpress'); ?></p> -->
                                </div>
                            </div>

                            <div class="main-ad-template" id="ad-template-1" data-adType="image" style="display:none">
                                <div class="ep-ad-container">
                                    <div class="ep-ad-content sponsored-video hidden" style="position: relative;">
                                        <a target="_blank" class="sponsored-url" href="#">

                                            <video class="ep-ad" muted="">
                                                <source src="<?php echo esc_url($video_demo_adUrl); ?>">
                                            </video>

                                            <div class="sponsored-timer">
                                                <span class="sponsored-running-time"></span>
                                                <span class="sponsored-duration">&nbsp;• Ad</span>
                                            </div>
                                            <div class="progress-bar-container">
                                                <div class="progress-bar"></div>
                                            </div>
                                        </a>


                                        <button title="Skip Ad" class="skip-ad-button" style="display: none;">
                                            <?php echo esc_html__('Skip Ad', 'embedpress'); ?> </button>

                                    </div>

                                    <div class="ep-ad-content sponsored-image hidden" style="position: relative;">
                                        <a target="_blank" class="sponsored-url" href="#">
                                            <img decoding="async" class="ep-ad" src="<?php echo esc_url($image_demo_adUrl); ?>">
                                        </a>
                                        <button title="Skip Ad" class="skip-ad-button" style="display: inline-block;">
                                            <?php echo esc_html__('Skip Ad', 'embedpress'); ?> </button>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button type="submit" class="button preview-btn-1"> <?php echo esc_html__('Start Preview', 'embedpress'); ?> </button>


            </div>

        </div>
        </div>
    </div>

</div>

<style>
    /* page css */
    .entry-content.clear {
        padding: 0 10px;
    }

    .sponsored-settings-top {
        padding: 20px 25px;
        /* background: #EEEDF4; */
        color: #444;
        border-radius: 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 60px;
        border: 1px solid #f9f3f3;
    }

    .sponsored-settings-content {
        width: calc(100% - 240px);
    }

    h3.ads-settings-title {
        color: #131F4D;
        margin-bottom: 10px;
        font-size: 18px;
    }

    p.ads-settings-description {
        font-size: 16px;
        line-height: 1.6;
        color: #25396F;
        text-align: justify;
    }

    .ad__adjust__controller__item .controller__label {
        font-size: 16px;
        font-weight: 400;
        color: #7C8DB5;
        width: 180px;
    }

    .sponsored-preview-sectiion {
        display: flex;
        gap: 30px;
        justify-content: space-around;
        margin-bottom: 60px;
        border-bottom: 1px solid #ddd;
        padding-bottom: 60px;
    }


    .sponsored-upload-options {
        width: 320px;
    }

    p.uploaded {
        background: #efeef5;
        padding: 5px 10px;
        word-wrap: break-word;
        border-radius: 5px;
    }

    button.uploadBtn {
        font-size: 14px;
        padding: 10px 15px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        gap: 5px;
        border: 1px solid #ddd;
        cursor: pointer;
        color: #394b7b;
        margin-bottom: 10px;

    }

    button.uploadBtn span.dashicons.dashicons-upload {
        font-size: 18px;
    }

    .video-ad-prewiew-options {
        width: 45%
    }

    .ad__adjust__controller__item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 30px;
        gap: 20px;
    }

    .ad__adjust__controller__inputs {
        max-width: 100%;
        width: calc(100% - 15px);
    }

    .ad__adjust__controller__inputs p {
        margin-top: 5px;
        color: #131F4D;
    }

    /* Common Styles */
    /* .sponsored-mask .ose-embedpress-responsive {
        position: relative;
    } */

    .sponsored-running {
        display: inline-block !important;
    }

    .ep-ad-content.sponsored-image img {
        object-fit: cover;
    }

    .ep-ad-content.sponsored-image {
        height: 100%;
        width: 100%;
    }

    /* .sponsored-mask .ep-embed-content-wraper::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    } */

    .ep-embed-content-wraper {
        position: relative;
    }
    .ep-embed-content-wraper iframe{
        border-radius: 8px;
    }

    .embedpress-gutenberg-wrapper {
        width: 55%;
    }

    h2.wp-block-heading {
        font-size: 22px;
        margin-bottom: 12px;
        color: #131F4D
    }

    p.preview-description {
        font-size: 16px;
        line-height: 1.6;
        color: #7C8DB5;
        margin-bottom: 15px;
        width: 580px;
        max-width: 100%;
        text-align: justify;
    }

    .ose-youtube {
        /* display: none !important; */
        opacity: 0
    }

    div[data-sponsored-id] {
        position: relative;
        display: inline-block;
        max-width: 100%;
    }
    .embedpress-document-embed div[data-sponsored-id] {
        width: 100%;
    }
    
    .main-ad-template.image.sponsored-running {
        position: absolute;
        z-index: 1;
        bottom: 75px;
        left: 50%;
        height: auto;
    }

    [data-sponsored-id] .main-ad-template.image.sponsored-running {
        border-radius: 5px;
    }

    .ep-ad-container {
        position: relative;
        height: 100%;
        display: flex;
        align-items: center;
        background-color: #000;
        justify-content: center;

    }

    .ep-ad-content.sponsored-video {
        height: 100%;
    }

    a.sponsored-url {
        display: inline;
    }

    .main-ad-template video,
    .main-ad-template img {
        width: 100%;
        height: 100%;
        background-color: #000;
    }

    .progress-bar-container {
        margin-top: -10px;
        background: #ff000021;
    }

    .progress-bar {
        background: #5be82a;
        height: 5px;
        margin-top: -4px;
        max-width: 100%;
    }

    button.skip-ad-button {
        position: absolute;
        bottom: 15px;
        right: 10px;
        border: none;
        background: #d41556b5 !important;
        color: white !important;
        z-index: 999999999;
        font-size: 14px;
        border-radius: 4px;
        height: 30px;
        width: 80px;
        font-weight: normal;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        text-transform: capitalize;
        font-weight: 600;
        font-size: 12px;
        padding: 0;
    }

    .sponsored-timer {
        position: absolute;
        background: #d41556b5;
        font-size: 14px;
        width: 110px;
        color: white;
        bottom: 15px;
        left: 10px;
        text-align: center;
        border-radius: 4px;
        height: 30px;
        width: 80px;
        font-weight: normal;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    [data-sponsored-id] .hidden,
    .hidden {
        display: none !important;
    }

    /* Specific Styles for Ad Type 1 */
    [data-sponsored-id="ep-ad-preview-0"] .main-ad-template {
        width: 550px;
        height: 310px;
        max-width: 100%;
        display: inline-block;
        border-radius: 12px;
        overflow: hidden;
    }

    [data-sponsored-id="ep-ad-preview-0"] .main-ad-template.image.sponsored-running {
        width: 300px;
        height: 200px;
        bottom: 10%;
        left: 25%;
    }

    /* Specific Styles for Ad Type 2 */
    [data-sponsored-id="ep-ad-preview-1"] .main-ad-template {
        width: 550px;
        height: 310px;
        max-width: 100%;
        display: inline-block;
    }

    [data-sponsored-id="ep-ad-preview-1"] .main-ad-template.image.sponsored-running {
        width: 300px !important;
        height: 200px !important;
        bottom: 10%;
        left: 25%;
    }

    iframe.ose-youtube {
        /* display: none !important; */
        max-width: 100%;
        max-height: 310px;
        height: 310px;
        width: 550px;
    }

    .position-right-wraper.gutenberg-pdf-wraper iframe {
        border: 1px solid #ddd;
    }

    p.embedpress-el-powered {
        text-align: center;
    }

    .info-message-section {
        max-width: 800px;
        margin: auto;
        margin-bottom: 60px;
        width: 100%;
    }

    .info-message {
        display: flex;
        align-items: center;
        gap: 10px;
        /* background: #fbebed; */
        padding: 12px;
        border-radius: 5px;
        font-size: 14px;
        line-height: 1.4em;
        border-left: 4px solid #fe8c59;
        border: 1px solid #faf4f4;
        color: #25396F;
    }

    .info-message svg {
        width: 18px;
    }

    span.dashicons.dashicons-warning {
        color: #fe8c59;
    }

    @media only screen and (max-width: 1540px) {


        .ad__adjust__controller__item {
            flex-direction: column;
            align-items: start;
            padding-right: 15px;
            gap: 10px;
        }

        .video-ad-prewiew-options .form-input-wrapper {
            max-height: 440px;
            overflow: auto;
            max-width: 100%;
        }


        .video-ad-prewiew-options .form-input-wrapper::-webkit-scrollbar {
            width: 5px;
        }

        .video-ad-prewiew-options .form-input-wrapper::-webkit-scrollbar-track {
            background: #f5f7fd;
            border-radius: 5px;
        }

        .video-ad-prewiew-options .form-input-wrapper::-webkit-scrollbar-thumb {
            background: #988FBD;
            border-radius: 5px;
        }

        .template__wrapper input[type=range] {
            margin: 0;
        }

        form#ad-preview-0 .form-input-wrapper {
            max-height: 400px !important;
        }
    }


    @media only screen and (max-width: 1440px) {
        .embedpress-gutenberg-wrapper {
            width: 60%;
        }

        .video-ad-prewiew-options {
            width: 40%
        }
    }

    @media screen and (max-width: 1250px) {
        .sponsored-preview-sectiion {
            flex-direction: column-reverse;
        }

        .video-ad-prewiew-options {
            width: 100%;
        }

        .embedpress-gutenberg-wrapper {
            width: 100%;
        }

        .sponsored-settings-top {
            display: block;
        }

        .sponsored-settings-content {
            width: 100%;
            margin-bottom: 15px;
        }

        h3.ads-settings-title {
            line-height: 1.5;
        }

        p.ads-settings-description {
            line-height: 1.3;
        }
    }

    @media screen and (max-width: 991px) {
        div[data-sponsored-id] {
            max-width: 100%;
            display: block;
        }

        iframe.ose-youtube {
            width: 100%;
            height: 400px;
            max-height: 100%;
        }
    }
</style>


<script>
    // Check if data-playerid attribute exists and get its value
    const isPyr = document.querySelector('[data-playerid]')?.getAttribute('data-playerid');

    if (!isPyr) {
        var scriptUrl = 'https://www.youtube.com/s/player/9d15588c/www-widgetapi.vflset/www-widgetapi.js';
        try {
            var ttPolicy = window.trustedTypes.createPolicy("youtube-widget-api", {
                createScriptURL: function(x) {
                    return x;
                }
            });
            scriptUrl = ttPolicy.createScriptURL(scriptUrl);
        } catch (e) {}

        var YT;
        if (!window["YT"]) YT = { loading: 0, loaded: 0 };
        var YTConfig;
        if (!window["YTConfig"]) YTConfig = { "host": "https://www.youtube.com" };
        if (!YT.loading) {
            YT.loading = 1;
            (function() {
                var l = [];
                YT.ready = function(f) {
                    if (YT.loaded) f();
                    else l.push(f);
                };
                window.onYTReady = function() {
                    YT.loaded = 1;
                    var i = 0;
                    for (; i < l.length; i++) try {
                        l[i]();
                    } catch (e) {}
                };
                YT.setConfig = function(c) {
                    var k;
                    for (k in c)
                        if (c.hasOwnProperty(k)) YTConfig[k] = c[k];
                };
                var a = document.createElement("script");
                a.type = "text/javascript";
                a.id = "www-widgetapi-script";
                a.src = scriptUrl;
                a.async = true;
                var c = document.currentScript;
                if (c) {
                    var n = c.nonce || c.getAttribute("nonce");
                    if (n) a.setAttribute("nonce", n);
                }
                var b = document.getElementsByTagName("script")[0];
                b.parentNode.insertBefore(a, b);
            })();
        }
    }

    let adsContainers = document.querySelectorAll('[data-sponsored-id]');
    let container = document.querySelector('[data-sponsored-id]');
    var player = [];
    var playerInit = [];
    var playerIndex = 0;
    let adTimeout;

    adsContainers = Array.from(adsContainers);

    const getYTVideoId = (url) => {
        // Check if the input is a string
        if (typeof url !== 'string') {
            return false;
        }

        const regex = /(?:youtube\.com\/(?:[^\/]+\/[^\/]+\/|(?:v|e(?:mbed)?)\/|[^#]*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regex);

        if (match && match[1]) {
            return match[1];
        }
        return false;
    }

    const hasParentClass = (element, className) => {
    var parent = element.parentNode;

    while (parent && !(parent.classList && parent.classList.contains(className))) {
        parent = parent.parentNode;
    }

    return !!(parent && parent.classList && parent.classList.contains(className));
}


    const adInitialization = (adContainer, index, adAtts, adType) => {
        const blockId = adAtts.clientId;
        const blockIdMD5 = adContainer.getAttribute('data-sponsored-id');
        const adStartAfter = adAtts.adStart * 1000;
        const adContent = adAtts.adContent;
        const adVideo = adContainer.querySelector('.ep-ad');
        const adSource = adAtts.adSource;
        const adVideos = [];
        const srcUrl = adAtts.url || adAtts.embedpress_embeded_link;
        const adSkipButtonAfter = parseInt(adAtts.adSkipButtonAfter);
        const adSkipButton = adAtts.adSkipButton;
        const adUrl = adAtts.adUrl;

        adVideos.push(adVideo);

        const adTemplate = adContainer.querySelector('.main-ad-template');
        const imageAdTemplate = adContainer.querySelector('.main-ad-template.image');
        const progressBar = adContainer.querySelector('.progress-bar');
        const skipButton = adTemplate.querySelector('.skip-ad-button');
        const adRunningTime = adContainer.querySelector('.sponsored-running-time');
        var playerId;
        const adMask = adContainer;

        let playbackInitiated = false;

        if (skipButton && adSource !== 'video') {
            skipButton.style.display = 'inline-block';
        }

        const hashClass = hasParentClass(adContainer, 'ep-content-protection-enabled');

        if (hashClass) {
            adContainer.classList.remove('sponsored-mask');
        }

        playerId = adContainer.querySelector('[data-playerid]')?.getAttribute('data-playerid');

        if (getYTVideoId(srcUrl)) {
            player[index]?.playVideo();
            player[index]?.seekTo(0);
        }
        clearTimeout(adTimeout);

        adTemplate.classList.remove('image', 'video');
        adTemplate.classList.add(adType);

        if (adType === 'image' && adUrl) {
            adTemplate.querySelector('.sponsored-image .sponsored-url')?.setAttribute('href', adUrl);
        } else {
            adTemplate.querySelector('.sponsored-video .sponsored-url')?.setAttribute('href', adUrl);
        }

        if (!playbackInitiated) {
            adTimeout = setTimeout(() => {
                if (adSource !== 'image') {
                    adContainer.querySelector('.ep-embed-content-wraper').classList.add('hidden');
                }
                adTemplate?.classList.add('sponsored-running');
                adTemplate?.classList.remove('hidden');
                if (adVideo && adSource === 'video') {
                    adVideo.muted = false;
                    adTemplate.querySelector('.sponsored-video').classList.remove('hidden');
                    adTemplate.querySelector('.sponsored-image').classList.add('hidden');
                    adVideo.play();
                }

                if (adType === 'image') {
                    adTemplate.querySelector('.sponsored-image').classList.remove('hidden');
                    adTemplate.querySelector('.sponsored-video').classList.add('hidden');
                }
            }, adStartAfter);

            playbackInitiated = true;
        }

        adContainer.classList.remove('sponsored-mask');

        if (adType == 'video') {
            adVideo?.addEventListener('timeupdate', () => {
                const currentTime = adVideo?.currentTime;
                const videoDuration = adVideo?.duration;

                if (currentTime <= videoDuration) {
                    const remainingTime = Math.max(0, videoDuration - currentTime); // Ensure it's not negative
                    adRunningTime.innerText = Math.floor(remainingTime / 60) + ':' + (Math.floor(remainingTime) % 60).toString().padStart(2, '0');
                }

                if (!isNaN(currentTime) && !isNaN(videoDuration)) {
                    const progress = (currentTime / videoDuration) * 100;
                    progressBar.style.width = progress + '%';

                    if (adSkipButton && currentTime >= adSkipButtonAfter) {
                        skipButton.style.display = 'inline-block';
                    } else {
                        skipButton.style.display = 'none';
                    }
                }
            });
        }

        document?.addEventListener('click', (event) => {
            if (event.target.classList.contains('skip-ad-button')) {
                adTemplate?.classList.remove('sponsored-running');
                document.querySelector('.preview-btn-' + index).innerText = 'Play Preview';
                document.querySelector('.preview-btn-' + index).removeAttribute('disabled');

                if (adType == 'video') {
                    adVideo.pause();
                    adVideo.currentTime = 0;

                    if (getYTVideoId(srcUrl)) {
                        player[index]?.playVideo();
                    }
                    adTemplate.querySelector('.sponsored-video').classList.add('hidden');

                } else {
                    adTemplate.querySelector('.sponsored-image').classList.add('hidden');
                }
                adContainer.querySelector('.ep-embed-content-wraper').classList.remove('hidden');
            }
        });

        if (adType == 'video') {
            adVideo?.addEventListener('play', () => {
                if (typeof playerInit !== 'undefined' && playerInit.length > 0) {
                    playerInit[playerId]?.stop();
                }
            });

            adVideo?.addEventListener('ended', () => {
                adTemplate.classList.add('hidden');
                adContainer.querySelector('.ep-embed-content-wraper').classList.remove('hidden');
                document.querySelector('.preview-btn-' + index).innerText = 'Play Preview';
                document.querySelector('.preview-btn-' + index).removeAttribute('disabled');
            });
        }
        playerIndex++;
    }

    function onYouTubeIframeAPIReady(iframe, srcUrl, adVideo, index) {
        if (iframe && getYTVideoId(srcUrl) !== null) {
            player[index] = new YT.Player(iframe, {
                videoId: getYTVideoId(srcUrl),
                events: {
                    'onReady': (event) => onPlayerReady(event, adVideo),
                }
            });
        }
    }

    function onPlayerReady(event, adVideo) {
        adVideo?.addEventListener('ended', function() {
            event.target.playVideo();
        });

        adVideo?.addEventListener('play', function() {
            event.target.pauseVideo();
        });
        event.target.g.style = 'opacity: 1';
    }

    window.onload = function() {
        let yVideos = setInterval(() => {
            var youtubeVideos = document.querySelectorAll('.ose-youtube');
            if (youtubeVideos.length > 0) {
                clearInterval(yVideos);

                youtubeVideos.forEach((yVideo, index) => {
                    const srcUrl = yVideo.querySelector('iframe')?.getAttribute('src');
                    const adVideo = yVideo.closest('.sponsored-mask')?.querySelector('.ep-ad');
                    const isYTChannel = yVideo.closest('.sponsored-mask')?.querySelector('.ep-youtube-channel');
                    if (adVideo && !isYTChannel) {
                        onYouTubeIframeAPIReady(yVideo, srcUrl, adVideo, index);
                    }
                });
            }
        }, 100);
    };

    function getFormData(index) {
        var form = document.getElementById("ad-preview-" + index);
        var formData = new FormData(form);

        var formDataObject = {};
        formData.forEach(function(value, key) {
            formDataObject[key] = value;
        });

        return formDataObject;
    }

    const rangeUpdate = () => {
        var rangeInputs = document.querySelectorAll('input[type="range"]');
        var numberInputs = document.querySelectorAll('input[type="number"]');

        rangeInputs.forEach(function(rangeInput, index) {
            var numberInput = numberInputs[index];

            rangeInput.addEventListener('input', function() {
                numberInput.value = rangeInput.value;
            });
        });
    }

    rangeUpdate();

    jQuery(document).on('click', '.preview-btn-0', function(e) {
        e.preventDefault();
        const index = 0;
        const adContainer = document.querySelector('#ep-ad-preview-' + index);
        const adType = document.querySelector('#ad-template-' + index).getAttribute('data-adType');
        const currentAdAtts = getFormData(index);

        const adAtts = {
            "clientId": "1c3da3de-7606-4e9f-9693-d4b570cd2ca30",
            "url": "https://www.youtube.com/watch?v=AMU66nbFnGg&pp=ygUMd3BkZXZlbG9lcGVy",
            "height": "310",
            "adManager": true,
            "adFileUrl": currentAdAtts?.adFileUrl,
            "adUrl": currentAdAtts?.adUrl,
            "width": "600",
            "adSource": adType ?? 'video',
            "adXPosition": 25,
            "adYPosition": 10,
            "adStart": currentAdAtts?.adStart,
            "adSkipButton": currentAdAtts?.adSkipButton === 'yes' ? true : false,
            "adSkipButtonAfter": currentAdAtts?.adSkipButtonAfter
        }

        console.log(currentAdAtts);

        if (currentAdAtts?.adFileUrl) {
            adInitialization(adContainer, index, adAtts, adType);
            jQuery('.preview-btn-' + index).attr('disabled', true);

            let startIn = parseInt(currentAdAtts?.adStart) - 1;
            const setIntervalId = setInterval(() => {
                jQuery('.preview-btn-' + index).text('Ad starting in ' + startIn-- + ' sec');
                if (startIn === -1) {
                    clearInterval(setIntervalId);
                    jQuery('.preview-btn-' + index).text('Ad Running');
                }
            }, 1000);
        } else {
            jQuery('.uploaded-file-url-' + index).text('Please upload a video/image Ad.');
        }
    });

    jQuery(document).on('click', '.preview-btn-1', function(e) {
        e.preventDefault();
        const index = 1;
        const adContainer = document.querySelector('#ep-ad-preview-' + index);
        const adType = document.querySelector('#ad-template-' + index).getAttribute('data-adType');
        const currentAdAtts = getFormData(index);

        const adAtts = {
            "clientId": "1c3da3de-7606-4e9f-9693-d4b570cd2ca31",
            "url": "https://www.africau.edu/images/default/sample.pdf",
            "height": "310",
            "adManager": true,
            "adFileUrl": currentAdAtts?.adFileUrl,
            "adUrl": currentAdAtts?.adUrl,
            "width": "600",
            "adSource": adType ?? 'video',
            "adXPosition": 25,
            "adYPosition": 10,
            "adStart": currentAdAtts?.adStart,
            "adSkipButton": currentAdAtts?.adSkipButton === 'yes' ? true : false,
            "adSkipButtonAfter": currentAdAtts?.adSkipButtonAfter
        }

        if (currentAdAtts?.adFileUrl) {
            adInitialization(adContainer, index, adAtts, adType);
            jQuery('.preview-btn-' + index).attr('disabled', true);

            let startIn = parseInt(currentAdAtts?.adStart) - 1;
            const setIntervalId = setInterval(() => {
                jQuery('.preview-btn-' + index).text('Ad starting in ' + startIn-- + ' sec');
                if (startIn === -1) {
                    clearInterval(setIntervalId);
                    jQuery('.preview-btn-' + index).text('Ad Running');
                }
            }, 1000);
        } else {
            jQuery('.uploaded-file-url-' + index).text('Please upload a video/image Ad.');
        }
    });
</script>

<script>
    jQuery(document).ready(function($) {
        var mediaUploader;

        // Trigger when the "Upload" button is clicked
        $('.uploadBtn').click(function(e) {
            e.preventDefault();

            const index = $(this).data('upload-index');

            // Reset mediaUploader variable
            mediaUploader = undefined;

            if (mediaUploader) {
                mediaUploader.open();
                return;
            }

            // Extend the wp.media object
            mediaUploader = wp.media.frames.file_frame = wp.media({
                title: 'Choose File',
                button: {
                    text: 'Choose File'
                },
                multiple: false,
                library: {
                    type: ['image', 'video']
                },
            });

            // Handle the file selection
            mediaUploader.on('select', function() {
                var attachment = mediaUploader.state().get('selection').first().toJSON();

                if (attachment.type === 'image') {
                    $('#ad-preview-' + index + ' .skip-controller').addClass('hidden');
                    $('#ad-preview-' + index + ' .image-ad-control').removeClass('hidden');
                    $('#ad-template-' + index + ' img').attr('src', attachment.url);

                } else {
                    $('#ad-preview-' + index + ' .skip-controller').removeClass('hidden');
                    $('#ad-preview-' + index + ' .image-ad-control').addClass('hidden');
                    $('#ad-template-' + index + ' video').attr('src', attachment.url);
                }

                $('#fileInput-' + index).val(attachment.url);
                $('.uploaded-file-url-' + index).text('File Name: ' + attachment.name + '.' + attachment.subtype);
                $('#ad-template-' + index).attr('data-adType', attachment.type);
                $('.uploaded-file-url-' + index).addClass('uploaded');
            });

            // Open the media uploader
            mediaUploader.open();
        });
    });
</script>