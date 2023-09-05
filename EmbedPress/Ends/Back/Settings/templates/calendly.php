<?php
/*
 * It will be customzed for OpenSea
 *  All undefined vars comes from 'render_settings_page' method
 *  */

$authorize_url = 'https://auth.calendly.com/oauth/authorize?client_id=RVIzKSKamm_V88B9Z7yB2fr4JBd7Bqbdi_VQ5rlji2I&response_type=code&redirect_uri=https://api.embedpress.com/calendly.php&state=' . admin_url('admin.php');



$event_types = !empty(get_option( 'calendly_event_types' )) ? get_option( 'calendly_event_types' ) : [];

?>

<div class="embedpress_calendly_settings  background__white radius-25 p40">
    <h3 class="calendly-settings-title"><?php esc_html_e("Calendly Settings", "embedpress"); ?></h3>
    <div class="calendly-embedpress-authorize-button">
        <div class="account-wrap full-width-layout">
            <a href="<?php echo esc_url($authorize_url); ?>" class="calendly-connect-button" target="_self" title="Connect with Calendly">
                <img class="embedpress-calendly-icon" src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/calendly-white.svg" alt="calendly">
                <?php echo esc_html__('Connect with Calendly', 'embedpress'); ?>
            </a>
        </div>

        <div class="calendly-sync-button">
            <a href="<?php echo esc_url($authorize_url); ?>" class="calendly-connect-button" target="_self" title="Connect with Calendly">
                <span class="dashicons dashicons-update-alt emcs-dashicon"></span><?php echo esc_html__('Sync', 'embedpress'); ?>
            </a>
        </div>
    </div>

    <div class="event-type-list">
        <div class="event-type-group-list">
            <div class="event-type-group-list-item user-item">
                <div class="list-header">
                    <div class="calendly-profile-avatar">
                        <img src="https://d3v0px0pttie1i.cloudfront.net/uploads/user/avatar/29243744/4b76aa68.jpg" alt="" class="il6wqd3">
                    </div>
                    <div class="calendly-user">
                        <div class="KF8rYwhNst0H6JyJ1_kq">
                            <span class="_UeGX8dh81nHkmsXSvAD">
                                <p style="color: currentcolor;">Akash M</p>
                            </span>
                        </div>
                        <a target="_blank" rel="noopener noreferrer" href="https://calendly.com/akash-mia">
                            <span class="_UeGX8dh81nHkmsXSvAD">https://calendly.com/akash-mia</span>
                        </a>
                    </div>
                </div>
                <div>
                    <div class="event-type-card-list">
                        <?php
                        foreach ($event_types['collection'] as $item) { 
                                $status = 'In-active';
                                if(!empty($item['active'])){
                                    $status = 'Active';
                                }
                            ?>
                            <div class="event-type-card-list-item" data-event-status="<?php echo esc_attr( $status ); ?>">
                                <div class="event-type-card">
                                    <div class="event-type-card-top">
                                        <h2><?php echo esc_html($item['name']); ?></h2>
                                        <p>30 mins, One-on-One</p>
                                        <a target="_blank" href="<?php echo esc_url($item['scheduling_url']); ?>"><?php echo esc_html__('View booking page', 'embedpress'); ?></a>
                                    </div>
                                    <div class="event-type-card-bottom">
                                        <div class="calendly-event-copy-link">
                                            <svg width="40" height="40" viewBox="0 0 0.75 0.75" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M0.05 0.476a0.076 0.076 0 0 0 0.076 0.074H0.2V0.5H0.126A0.026 0.026 0 0 1 0.1 0.474V0.124A0.026 0.026 0 0 1 0.126 0.098h0.35a0.026 0.026 0 0 1 0.026 0.026V0.2H0.276A0.076 0.076 0 0 0 0.2 0.276v0.35A0.076 0.076 0 0 0 0.276 0.7h0.35A0.076 0.076 0 0 0 0.702 0.624V0.274A0.076 0.076 0 0 0 0.626 0.2H0.55V0.126A0.076 0.076 0 0 0 0.476 0.05H0.126a0.076 0.076 0 0 0 -0.076 0.076v0.35Zm0.2 -0.2A0.026 0.026 0 0 1 0.276 0.25h0.35a0.026 0.026 0 0 1 0.026 0.026v0.35a0.026 0.026 0 0 1 -0.026 0.026H0.276A0.026 0.026 0 0 1 0.25 0.626V0.276Z" fill="#6633cc" /></svg>
                                            Copy link
                                        </div>
                                        <div class="event-status <?php echo esc_attr( $status ); ?>">
                                            <?php echo esc_html( $status ); ?>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        <?php
                        }
                        ?>
                    </div>
                </div>
            </div>
        </div>

    </div>
</div>