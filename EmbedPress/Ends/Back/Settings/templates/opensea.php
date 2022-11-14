<?php
/*
 * It will be customzed for OpenSea
 *  All undefined vars comes from 'render_settings_page' method
 *  */

$opensea_settings = get_option( EMBEDPRESS_PLG_NAME.':opensea');

$os_api_key = isset( $opensea_settings['api_key']) ? $opensea_settings['api_key'] : '';
$limit = isset( $opensea_settings['limit']) ? $opensea_settings['limit'] : 9;
$orderby = isset( $opensea_settings['orderby']) ? $opensea_settings['orderby'] : 'desc';

?>

<div class="embedpress__settings background__white radius-25 p40">
    <h3><?php esc_html_e( "OpenSea Settings", "embedpress" ); ?></h3>
    <div class="embedpress__settings__form">
        <form action="" method="post" class="embedpress-settings-form" >
	        <?php
	        do_action( 'embedpress_before_opensea_settings_fields');
            echo  $nonce_field ; ?>
            <div class="form__group">
                <p class="form__label" ><?php esc_html_e( "OpenSea API Key", "embedpress" ); ?> </p>
                <div class="form__control__wrap">
                    <input type="text"  name="api_key" id="api_key" class="form__control" data-default="<?php echo esc_attr( $os_api_key); ?>" value="<?php echo esc_attr( $os_api_key); ?>" placeholder="<?php esc_html_e( "Enter API key", "embedpress" ); ?>" >
                    <p><?php echo sprintf(__( "Insert your OpenSea API key. To obtain your API key, refer to this <a  class='ep-link' href='%s' target='_blank'>documentation</a>.", "embedpress" ), 'https://docs.opensea.io/reference/request-an-api-key/'); ?></p>
                </div>

            </div>
            <div class="form__group">
                <p class="form__label" ><?php esc_html_e( "NFT Item Limit", "embedpress" ); ?> </p>
                <div class="form__control__wrap">
                    <input type="number" min="1" max="100" name="limit" id="limit" class="form__control" data-default="<?php echo esc_attr( $limit); ?>" value="<?php echo esc_attr( $limit); ?>">
                    <p><?php esc_html_e( "Specify the number of item you wish to show on page.", "embedpress" ); ?></p>
                    <p class="ep-note"><?php esc_html_e( "Note: This option takes effect only when a OpenSea collection is embedded.", "embedpress" ); ?></p>
                </div>

            </div>
            
            <div class="form__group">
                <p class="form__label"><?php esc_html_e( "Order By", "embedpress" ); ?></p>
                <div class="form__control__wrap">
                    <div class="embedpress__select">
                        <span><i class="ep-icon ep-caret-down"></i></span>
                        <select name="orderby" data-default="<?php echo esc_attr($orderby); ?>">
                            <option value="desc" <?php selected( 'desc',$orderby); ?>><?php esc_html_e( 'Newest', 'embedpress'); ?></option>
                            <option value="asc" <?php selected( 'asc',$orderby); ?>><?php esc_html_e( 'Oldest', 'embedpress'); ?></option>
                        </select>
                    </div>
                    <p><?php esc_html_e( 'Indicates whether the video player controls are displayed.', 'embedpress'); ?> </p>
                </div>
            </div>

	        <?php do_action( 'embedpress_after_opensea_settings_fields'); ?>
            <button class="button button__themeColor radius-10 embedpress-submit-btn" name="submit" value="opensea"><?php esc_html_e( 'Save Changes', 'embedpress'); ?></button>
        </form>
    </div>
</div>
