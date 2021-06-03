<?php
/*
 * Custom Logo Settings page
 * All undefined vars comes from 'render_settings_page' method
 *
 *  */

$option_name = EMBEDPRESS_PLG_NAME.':youtube';
$yt_settings = get_option( $option_name);
$gen_settings = get_option( EMBEDPRESS_PLG_NAME);
$yt_logo_xpos = isset( $yt_settings['logo_xpos']) ? intval( $yt_settings['logo_xpos']) : 10;
$yt_logo_ypos = isset( $yt_settings['logo_ypos']) ? intval( $yt_settings['logo_ypos']) : 10;
$yt_logo_opacity = isset( $yt_settings['logo_opacity']) ? intval( $yt_settings['logo_opacity']) : 50;
$yt_logo_id = isset( $yt_settings['logo_id']) ? intval( $yt_settings['logo_id']) : 0;
$yt_logo_url = isset( $yt_settings['logo_url']) ? esc_url( $yt_settings['logo_url']) : '';
$yt_cta_url = isset( $yt_settings['cta_url']) ? esc_url( $yt_settings['cta_url']) : '';
$yt_branding = isset( $yt_settings['branding']) ? sanitize_text_field( $yt_settings['branding']) : (!empty( $yt_logo_url) ? 'yes': 'no');


$embedpress_document_powered_by = isset( $gen_settings['embedpress_document_powered_by']) ? sanitize_text_field( $gen_settings['embedpress_document_powered_by']) : 'yes';

// Vimeo branding
$vm_settings = get_option( EMBEDPRESS_PLG_NAME.':vimeo');
//error_log( print_r( $vm_settings, 1));
$vm_branding = isset( $vm_settings['branding']) ? sanitize_text_field( $vm_settings['branding']) : 'no';
$vm_logo_xpos = isset( $vm_settings['logo_xpos']) ? intval( $vm_settings['logo_xpos']) : 10;
$vm_logo_ypos = isset( $vm_settings['logo_ypos']) ? intval( $vm_settings['logo_ypos']) : 10;
$vm_logo_opacity = isset( $vm_settings['logo_opacity']) ? intval( $vm_settings['logo_opacity']) : 50;
$vm_logo_id = isset( $vm_settings['logo_id']) ? intval( $vm_settings['logo_id']) : 0;
$vm_logo_url = isset( $vm_settings['logo_url']) ? esc_url( $vm_settings['logo_url']) : '';
$vm_cta_url = isset( $vm_settings['cta_url']) ? esc_url( $vm_settings['cta_url']) : 'no';


?>

<div class="embedpress__settings background__white radius-25 p40">
    <h3><?php esc_html_e( "Global Branding Settings", "embedpress" ); ?></h3>
    <div class="embedpress__settings__form">
        <form action="" method="post" enctype="multipart/form-data"  class="embedpress-settings-form">
	        <?php
	        do_action( 'embedpress_before_custom_branding_settings_fields');
	        echo  $nonce_field ; ?>
            <div class="form__group">
                <p class="form__label">Powered by EmbedPress</p>
                <div class="form__control__wrap">
                    <label class="input__switch switch__text">
                        <input type="checkbox" data-default="<?php echo esc_attr(  $embedpress_document_powered_by ); ?>" data-value="<?php echo esc_attr(  $embedpress_document_powered_by ); ?>" value="yes" name="embedpress_document_powered_by" <?php checked( 'yes', $embedpress_document_powered_by );?>>
                        <span></span>
                    </label>
                </div>
            </div>
            <h3><?php esc_html_e( "Custom Logo", "embedpress" ); ?></h3>
	        <?php
            embedpress_print_branding_controls('youtube', 'yt');
            embedpress_print_branding_controls('vimeo', 'vm');
            embedpress_print_branding_controls('wistia', 'wis');
            embedpress_print_branding_controls('twitch', 'tw');
            ?>
	        <?php  do_action( 'embedpress_after_custom_branding_settings_fields'); ?>
            <button class="button button__themeColor radius-10 embedpress-submit-btn" name="submit" value="custom_logo"><?php esc_html_e( 'Save Changes', 'embedpress'); ?></button>
        </form>
    </div>
</div>


<?php
/**
 * @param string $provider this is the provider name eg. youtube and vimeo etc. It should be lowercase generally or the same as the key we use to save data in the database. We save data like eg. EMBEDPRESS_PLG_NAME.':youtube'. Here youtube is the provider.
 * @param string $prefix It is a prefix for field name eg. yt or vm etc.
 */
function embedpress_print_branding_controls($provider='', $prefix='') {
    global $pro_active;
	$settings = get_option( EMBEDPRESS_PLG_NAME.':'.$provider, []);
    $branding = isset( $settings['branding']) ? $settings['branding'] : 'no';
	$logo_xpos = isset( $settings['logo_xpos']) ? intval( $settings['logo_xpos']) : 10;
	$logo_ypos = isset( $settings['logo_ypos']) ? intval( $settings['logo_ypos']) : 10;
	$logo_opacity = isset( $settings['logo_opacity']) ? intval( $settings['logo_opacity']) : 50;
	$logo_id = isset( $settings['logo_id']) ? intval( $settings['logo_id']) : 0;
	$logo_url = isset( $settings['logo_url']) ? esc_url( $settings['logo_url']) : '';
	$cta_url = isset( $settings['cta_url']) ? esc_url( $settings['cta_url']) : '';

	// prepare prefixed field name
    $px_branding = "{$prefix}_branding";
    $px_logo_xpos = "{$prefix}_logo_xpos";
    $px_logo_ypos = "{$prefix}_logo_ypos";
    $px_logo_opacity = "{$prefix}_logo_opacity";
    $px_logo_id = "{$prefix}_logo_id";
    $px_logo_url = "{$prefix}_logo_url";
    $px_cta_url = "{$prefix}_cta_url";
    switch ($provider){
        case 'vimeo':
            $preview_video = '<iframe src="https://player.vimeo.com/video/463346733" frameborder="0"></iframe>';
            break;
        case 'wistia':
            $preview_video=<<<KAMAL
<div class="embedpress-wrapper ose-wistia ose-uid-e792463aa8177370c576bf5d5e13d10d responsive">
<script src="https://fast.wistia.com/assets/external/E-v1.js" async></script>
<script>window.pp_embed_wistia_labels = {"watch_from_beginning":"Watch from the beginning","skip_to_where_you_left_off":"Skip to where you left off","you_have_watched_it_before":"It looks like you've watched<br \/>part of this video before!"};</script>

<script>
window._wq = window._wq || []; _wq.push({"kjg": {"videoFoam":true,"fullscreenButton":false,"plugin":[]}});
</script>
<div id="wistia_kjgpmu64ul" class="wistia_embed wistia_async_kjgpmu64ul" style="width:90%; height:360px;"></div>
</div>
KAMAL;

            break;
        case 'twitch':
            $preview_video = <<<KAMAL
<div class="embedpress_wrapper" data-url="https://www.twitch.tv/tsm_imperialhal" style="width:90%; height:360px;">
                <iframe src="https://embed.twitch.tv?autoplay=true&#038;channel=tsm_imperialhal&#038;height=360&#038;layout=video&#038;migration=true&#038;muted=false&#038;theme=dark&#038;time=0h0m0s&#038;video=&#038;width=600&#038;allowfullscreen=true&#038;parent=wpdevsocial.com" allowfullscreen="" scrolling="no" frameborder="0" allow="autoplay; fullscreen" title="Twitch" sandbox="allow-modals allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox" ></iframe>
            </div>
KAMAL;

            break;
	    default:
		    $preview_video = '<iframe src="https://www.youtube.com/embed/2u0HRUdLHxo" frameborder="0"></iframe>';
		    break;
    }
    ?>
    <div class="form__group">
        <p class="form__label"><?php
			printf( esc_html__( '%s Custom Branding', 'embedpress'), ucfirst( $provider));
			echo $pro_active ? '': ' <span class="isPro">Pro</span>'; ?>
        </p>
        <div class="form__control__wrap">
            <label class="input__switch switch__text <?php echo $pro_active ? '': 'isPro'; ?>">
                <input type="checkbox" name="<?php echo esc_attr( $px_branding ); ?>"  data-default="<?php echo esc_attr(  $branding ); ?>" data-value="<?php echo esc_attr(  $branding ); ?>"  value="yes" <?php checked( 'yes', $branding);?> <?php echo $pro_active ? '': ' disabled'; ?>>
                <span></span>
            </label>
            <div class="logo__adjust__wrap <?php echo $pro_active ? '': 'proOverlay'; ?>" style="<?php if ( ('yes' !== $branding) || !$pro_active ) { echo 'display:none;'; } ?>">
                <label class="logo__upload" id="yt_logo_upload_wrap" style="<?php if (!empty( $logo_url)) { echo 'display:none;'; } ?>">
                    <input type="hidden" class="preview__logo__input" name="<?php echo esc_attr( $px_logo_url ); ?>" id="<?php echo esc_attr( $px_logo_url ); ?>" data-default="<?php echo esc_attr( $logo_url ); ?>" value="<?php echo $logo_url; ?>">
                    <input type="hidden" class="preview__logo__input_id" name="<?php echo esc_attr( $px_logo_id ); ?>" id="<?php echo esc_attr( $px_logo_id ); ?>" data-default="<?php echo esc_attr( $logo_id ); ?>" value="<?php echo $logo_id; ?>">
                    <span class="icon"><i class="ep-icon ep-upload"></i></span>
                    <span class="text"><?php esc_html_e( "Click To Upload", "embedpress" ); ?></span>
                </label>
                <div class="logo__upload__preview" id="yt_logo__upload__preview" style="<?php if ( empty( $logo_url) ) { echo 'display:none'; } ?> ">
                    <div class="instant__preview">
                        <a href="#" id="yt_preview__remove" class="preview__remove"><i class="ep-icon ep-cross"></i></a>
                        <img class="instant__preview__img" id="yt_logo_preview" src="<?php echo $logo_url; ?>" alt="">
                    </div>
                </div>

                <div class="logo__adjust">
                    <div class="logo__adjust__controller">
                        <div class="logo__adjust__controller__item">
                            <span class="controller__label"><?php esc_html_e( "Logo Opacity (%)", "embedpress" ); ?></span>
                            <div class="logo__adjust__controller__inputs">
                                <input type="range" max="100" data-default="<?php echo esc_attr( $logo_opacity ); ?>" value="<?php echo esc_attr( $logo_opacity ); ?>" class="opacity__range" name="<?php echo esc_attr( $px_logo_opacity )?>">
                                <input readonly type="number" class="form__control range__value" data-default="<?php echo esc_attr( $logo_opacity ); ?>" value="<?php echo esc_attr( $logo_opacity ); ?>">
                            </div>
                        </div>
                        <div class="logo__adjust__controller__item">
                            <span class="controller__label"><?php esc_html_e( "Logo X Position (%)", "embedpress" ); ?></span>
                            <div class="logo__adjust__controller__inputs">
                                <input type="range" max="100" data-default="<?php echo esc_attr( $logo_xpos ); ?>" value="<?php echo $logo_xpos; ?>" class="x__range" name="<?php echo esc_attr( $px_logo_xpos );?>">
                                <input readonly type="number" class="form__control range__value" data-default="<?php echo esc_attr( $logo_xpos ); ?>" value="<?php echo $logo_xpos; ?>">
                            </div>
                        </div>
                        <div class="logo__adjust__controller__item">
                            <span class="controller__label"><?php esc_html_e( "Logo Y Position (%)", "embedpress" ); ?></span>
                            <div class="logo__adjust__controller__inputs">
                                <input type="range" max="100" data-default="<?php echo esc_attr( $logo_ypos ); ?>" value="<?php echo esc_attr( $logo_ypos ); ?>" class="y__range" name="<?php echo esc_attr( $px_logo_ypos ); ?>" >
                                <input readonly type="number" class="form__control range__value" data-default="<?php echo esc_attr( $logo_ypos ); ?>"  value="<?php echo esc_attr( $logo_ypos ); ?>">
                            </div>
                        </div>
                        <div class="logo__adjust__controller__item">
                            <label class="controller__label" for="yt_cta_url" ><?php esc_html_e( "Call to Action Link", "embedpress" );?> </label>
                            <div>
                                <input type="url"  name="<?php echo esc_attr( $px_cta_url ); ?>" id="<?php echo esc_attr( $px_cta_url ); ?>" class="form__control" data-default="<?php echo esc_attr( $cta_url ); ?>" value="<?php echo esc_attr( $cta_url); ?>">

                                <p><?php esc_html_e( "You may link the logo to any CTA link.", "embedpress" ); ?></p>
                            </div>
                        </div>
                    </div>
                    <div class="logo__adjust__preview">
                        <span class="title"><?php esc_html_e( "Live Preview", "embedpress" ); ?></span>
                        <div class="preview__box">
	                        <?php echo  $preview_video ;?>
                            <img src="<?php echo $logo_url; ?>" class="preview__logo" style="bottom:<?php echo esc_attr( $logo_ypos); ?>%; right:<?php echo esc_attr( $logo_xpos); ?>%; opacity:<?php echo ($logo_opacity/100); ?>;" alt="">
                        </div>
                    </div>
                </div>
            </div>
			<?php if ( !$pro_active ) {  include EMBEDPRESS_SETTINGS_PATH . 'templates/partials/alert-pro.php'; } ?>

        </div>
    </div>

<?php
}
?>