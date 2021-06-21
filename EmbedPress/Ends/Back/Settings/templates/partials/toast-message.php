<?php

if ( !isset( $success_message) ) {
	$success_message = esc_html__( "Settings Updated", "embedpress" );

}
if ( !isset( $error_message) ) {
	$error_message = esc_html__( "Ops! Something went wrong.", "embedpress" );
}
if ( !isset( $warning_message) ) {
	$warning_message = esc_html__( "Please provide valid data", "embedpress" );
}
?>

<div class="embedpress-toast__message toast__message--success">
	<img src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/check.svg" alt="">
	<p><?php echo esc_html( $success_message); ?></p>
</div>

<div class="embedpress-toast__message toast__message--error">
	<img src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/error.svg" alt="">
    <p><?php echo esc_html( $error_message); ?></p>
</div>

<div class="embedpress-toast__message toast__message--attention">
	<img src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/attention.svg" alt="">
    <p><?php echo esc_html( $warning_message); ?></p>
</div>

<?php  if (!empty( $_GET['success'])){ ?>
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
} elseif (!empty( $_GET['error'])){ ?>
    <script>
        (function ($) {
            let $error_message_node = $('.toast__message--error');
            $error_message_node.addClass('show');
            setTimeout(function (){
                $error_message_node.removeClass('show');
                history.pushState('', '', embedPressRemoveURLParameter(location.href, 'error'));
            }, 3000);

        })(jQuery);
    </script>
	<?php
} elseif (!empty( $_GET['attention'])){ ?>
    <script>
        (function ($) {
            let $attention_message_node = $('.toast__message--attention');
            $attention_message_node.addClass('show');
            setTimeout(function (){
                $attention_message_node.removeClass('show');
                history.pushState('', '', embedPressRemoveURLParameter(location.href, 'attention'));
            }, 3000);

        })(jQuery);
    </script>
<?php
}
?>