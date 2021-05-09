<?php

?>

<div class="embedpress-toast__message toast__message--success">
	<img src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/check.svg" alt="">
	<p><?php esc_html_e( "Settings Updated", "embedpress" ); ?></p>
</div>

<div class="embedpress-toast__message toast__message--error">
	<img src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/error.svg" alt="">
	<p><?php esc_html_e( "Ops! Something went wrong.", "embedpress" ); ?></p>
</div>

<?php
if (!empty( $_GET['success'])){ ?>
<script>
    (function ($) {
        let $success_message_node = $('.toast__message--success');
        $success_message_node.addClass('show');
        setTimeout(function (){
            $success_message_node.removeClass('show');
            history.pushState('', '', embedPressRemoveURLParameter(location.href, 'success'));
        }, 3000);

    })(jQuery);
</script>
<?php
}