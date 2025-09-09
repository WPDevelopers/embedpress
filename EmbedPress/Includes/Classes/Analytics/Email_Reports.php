<?php

namespace EmbedPress\Includes\Classes\Analytics;

/**
 * EmbedPress Analytics Email Reports (Pro Feature)
 *
 * Handles automated email reports for analytics data
 *
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2023 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       4.2.7
 */
class Email_Reports
{
    /**
     * Data collector instance
     *
     * @var Data_Collector
     */
    private $data_collector;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->data_collector = new Data_Collector();
        $this->init_hooks();
    }

    /**
     * Initialize hooks
     *
     * @return void
     */
    private function init_hooks()
    {
        // Schedule email reports
        add_action('init', [$this, 'schedule_reports']);

        // Handle scheduled reports
        add_action('embedpress_weekly_analytics_report', [$this, 'send_weekly_report']);
        add_action('embedpress_monthly_analytics_report', [$this, 'send_monthly_report']);

        // Admin settings
        add_action('admin_init', [$this, 'register_settings']);
    }

    /**
     * Schedule email reports
     *
     * @return void
     */
    public function schedule_reports()
    {
        // Check if pro feature is available
        if (!License_Manager::has_analytics_feature('email_reports')) {
            return;
        }

        $settings = $this->get_email_settings();

        if ($settings['weekly_enabled']) {
            if (!wp_next_scheduled('embedpress_weekly_analytics_report')) {
                wp_schedule_event(time(), 'weekly', 'embedpress_weekly_analytics_report');
            }
        } else {
            wp_clear_scheduled_hook('embedpress_weekly_analytics_report');
        }

        if ($settings['monthly_enabled']) {
            if (!wp_next_scheduled('embedpress_monthly_analytics_report')) {
                wp_schedule_event(time(), 'monthly', 'embedpress_monthly_analytics_report');
            }
        } else {
            wp_clear_scheduled_hook('embedpress_monthly_analytics_report');
        }
    }

    /**
     * Send weekly report
     *
     * @return void
     */
    public function send_weekly_report()
    {
        if (!License_Manager::has_analytics_feature('email_reports')) {
            return;
        }

        $settings = $this->get_email_settings();

        if (!$settings['weekly_enabled']) {
            return;
        }

        $data = $this->get_report_data(7);
        $this->send_report_email('weekly', $data, $settings);
    }

    /**
     * Send monthly report
     *
     * @return void
     */
    public function send_monthly_report()
    {
        if (!License_Manager::has_analytics_feature('email_reports')) {
            return;
        }

        $settings = $this->get_email_settings();

        if (!$settings['monthly_enabled']) {
            return;
        }

        $data = $this->get_report_data(30);
        $this->send_report_email('monthly', $data, $settings);
    }

    /**
     * Get report data
     *
     * @param int $days
     * @return array
     */
    private function get_report_data($days)
    {
        $args = ['date_range' => $days];

        return [
            'period' => $days,
            'content_by_type' => $this->data_collector->get_total_content_by_type(),
            'views_analytics' => $this->data_collector->get_views_analytics($args),
            'total_unique_viewers' => $this->data_collector->get_total_unique_viewers($args),
            'browser_analytics' => $this->data_collector->get_browser_analytics($args),
            'geo_analytics' => $this->data_collector->get_geo_analytics($args),
            'device_analytics' => $this->data_collector->get_device_analytics($args),
            'referral_analytics' => $this->data_collector->get_referral_analytics($args)
        ];
    }

    /**
     * Send report email
     *
     * @param string $type
     * @param array $data
     * @param array $settings
     * @return bool
     */
    private function send_report_email($type, $data, $settings)
    {
        $subject = sprintf(
            __('EmbedPress %s Analytics Report - %s', 'embedpress'),
            ucfirst($type),
            get_bloginfo('name')
        );

        $message = $this->generate_email_content($type, $data);

        $headers = [
            'Content-Type: text/html; charset=UTF-8',
            'From: ' . get_bloginfo('name') . ' <' . get_option('admin_email') . '>'
        ];

        $recipients = $this->get_email_recipients($settings);

        $sent = false;
        foreach ($recipients as $email) {
            if (is_email($email)) {
                $sent = wp_mail($email, $subject, $message, $headers) || $sent;
            }
        }

        return $sent;
    }

    /**
     * Generate email content
     *
     * @param string $type
     * @param array $data
     * @return string
     */
    private function generate_email_content($type, $data)
    {
        $period_text = $type === 'weekly' ? __('last 7 days', 'embedpress') : __('last 30 days', 'embedpress');

        ob_start();
        ?>
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title><?php echo esc_html(sprintf(__('EmbedPress %s Analytics Report', 'embedpress'), ucfirst($type))); ?></title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #3498db; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: #f9f9f9; }
                .metric { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
                .metric h3 { margin: 0 0 10px 0; color: #3498db; }
                .metric .value { font-size: 24px; font-weight: bold; color: #2c3e50; }
                .table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                .table th, .table td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
                .table th { background: #3498db; color: white; }
                .footer { text-align: center; padding: 20px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1><?php echo esc_html(sprintf(__('EmbedPress %s Analytics Report', 'embedpress'), ucfirst($type))); ?></h1>
                    <p><?php echo esc_html(sprintf(__('Analytics summary for %s', 'embedpress'), $period_text)); ?></p>
                </div>

                <div class="content">
                    <!-- Overview Metrics -->
                    <h2><?php _e('Overview', 'embedpress'); ?></h2>

                    <div class="metric">
                        <h3><?php _e('Total Embeds', 'embedpress'); ?></h3>
                        <div class="value"><?php echo esc_html($data['content_by_type']['total']); ?></div>
                        <p>
                            Elementor: <?php echo esc_html($data['content_by_type']['elementor']); ?> |
                            Gutenberg: <?php echo esc_html($data['content_by_type']['gutenberg']); ?> |
                            Shortcode: <?php echo esc_html($data['content_by_type']['shortcode']); ?>
                        </p>
                    </div>

                    <div class="metric">
                        <h3><?php _e('Total Views', 'embedpress'); ?></h3>
                        <div class="value"><?php echo esc_html($data['views_analytics']['total_views']); ?></div>
                    </div>

                    <div class="metric">
                        <h3><?php _e('Unique Viewers', 'embedpress'); ?></h3>
                        <div class="value"><?php echo esc_html($data['total_unique_viewers']); ?></div>
                    </div>

                    <!-- Top Content -->
                    <?php if (!empty($data['views_analytics']['top_content'])): ?>
                    <h2><?php _e('Top Performing Content', 'embedpress'); ?></h2>
                    <table class="table">
                        <thead>
                            <tr>
                                <th><?php _e('Content', 'embedpress'); ?></th>
                                <th><?php _e('Type', 'embedpress'); ?></th>
                                <th><?php _e('Views', 'embedpress'); ?></th>
                                <th><?php _e('Clicks', 'embedpress'); ?></th>
                                <th><?php _e('Impressions', 'embedpress'); ?></th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach (array_slice($data['views_analytics']['top_content'], 0, 5) as $content): ?>
                            <tr>
                                <td><?php echo esc_html($content['title'] ?: 'Untitled'); ?></td>
                                <td><?php echo esc_html($content['embed_type']); ?></td>
                                <td><?php echo esc_html($content['total_views']); ?></td>
                                <td><?php echo esc_html($content['total_clicks']); ?></td>
                                <td><?php echo esc_html($content['total_impressions'] ?? 0); ?></td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                    <?php endif; ?>

                    <!-- Geo Analytics (Pro) -->
                    <?php if (!empty($data['geo_analytics']['countries'])): ?>
                    <h2><?php _e('Top Countries', 'embedpress'); ?></h2>
                    <table class="table">
                        <thead>
                            <tr>
                                <th><?php _e('Country', 'embedpress'); ?></th>
                                <th><?php _e('Visitors', 'embedpress'); ?></th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach (array_slice($data['geo_analytics']['countries'], 0, 5) as $country): ?>
                            <tr>
                                <td><?php echo esc_html($country['country']); ?></td>
                                <td><?php echo esc_html($country['visitors']); ?></td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                    <?php endif; ?>

                    <!-- Device Analytics (Pro) -->
                    <?php if (!empty($data['device_analytics']['devices'])): ?>
                    <h2><?php _e('Device Types', 'embedpress'); ?></h2>
                    <table class="table">
                        <thead>
                            <tr>
                                <th><?php _e('Device', 'embedpress'); ?></th>
                                <th><?php _e('Visitors', 'embedpress'); ?></th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($data['device_analytics']['devices'] as $device): ?>
                            <tr>
                                <td><?php echo esc_html(ucfirst($device['device_type'])); ?></td>
                                <td><?php echo esc_html($device['visitors']); ?></td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                    <?php endif; ?>
                </div>

                <div class="footer">
                    <p><?php _e('This report was generated automatically by EmbedPress Pro.', 'embedpress'); ?></p>
                    <p><a href="<?php echo esc_url(admin_url('admin.php?page=embedpress#/analytics')); ?>"><?php _e('View Full Analytics Dashboard', 'embedpress'); ?></a></p>
                </div>
            </div>
        </body>
        </html>
        <?php

        return ob_get_clean();
    }

    /**
     * Get email recipients
     *
     * @param array $settings
     * @return array
     */
    private function get_email_recipients($settings)
    {
        $recipients = [];

        if (!empty($settings['recipients'])) {
            $emails = explode(',', $settings['recipients']);
            foreach ($emails as $email) {
                $email = trim($email);
                if (is_email($email)) {
                    $recipients[] = $email;
                }
            }
        }

        // Fallback to admin email
        if (empty($recipients)) {
            $recipients[] = get_option('admin_email');
        }

        return $recipients;
    }

    /**
     * Get email settings
     *
     * @return array
     */
    private function get_email_settings()
    {
        $defaults = [
            'weekly_enabled' => false,
            'monthly_enabled' => false,
            'recipients' => get_option('admin_email')
        ];

        $settings = get_option('embedpress_email_reports', []);

        return wp_parse_args($settings, $defaults);
    }

    /**
     * Register settings
     *
     * @return void
     */
    public function register_settings()
    {
        register_setting('embedpress_settings', 'embedpress_email_reports');
    }

    /**
     * Update email settings
     *
     * @param array $settings
     * @return bool
     */
    public function update_settings($settings)
    {
        if (!License_Manager::has_analytics_feature('email_reports')) {
            return false;
        }

        $updated = update_option('embedpress_email_reports', $settings);

        if ($updated) {
            // Reschedule reports
            wp_clear_scheduled_hook('embedpress_weekly_analytics_report');
            wp_clear_scheduled_hook('embedpress_monthly_analytics_report');
            $this->schedule_reports();
        }

        return $updated;
    }

    /**
     * Send test email
     *
     * @param string $email
     * @return bool
     */
    public function send_test_email($email)
    {
        if (!License_Manager::has_analytics_feature('email_reports')) {
            return false;
        }

        if (!is_email($email)) {
            return false;
        }

        $data = $this->get_report_data(7);
        $settings = ['recipients' => $email];

        return $this->send_report_email('test', $data, $settings);
    }
}
