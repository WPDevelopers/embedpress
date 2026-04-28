<?php

namespace EmbedPress\Includes\Classes;

defined('ABSPATH') or die("No direct script access allowed.");

/**
 * Lead Capture
 *
 * Receives email-capture form submissions from the custom player and
 * stores them as a WP option (capped to MAX_LEADS, FIFO). Adapter
 * plugins can listen on `embedpress_lead_captured` to forward to
 * FluentCRM, Mailchimp, webhooks, etc.
 */
class Lead_Capture
{
    const OPTION_KEY = 'embedpress_captured_leads';
    const MAX_LEADS  = 500;

    public function __construct()
    {
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    public function register_routes()
    {
        register_rest_route('embedpress/v1', '/lead', [
            'methods'             => 'POST',
            'callback'            => [$this, 'handle_lead'],
            'permission_callback' => '__return_true',
            'args' => [
                'email' => [
                    'required' => true,
                    'type'     => 'string',
                    'sanitize_callback' => 'sanitize_email',
                ],
                'name' => [
                    'required' => false,
                    'type'     => 'string',
                    'sanitize_callback' => 'sanitize_text_field',
                ],
                'video_url' => [
                    'required' => false,
                    'type'     => 'string',
                    'sanitize_callback' => 'esc_url_raw',
                ],
                'page_url' => [
                    'required' => false,
                    'type'     => 'string',
                    'sanitize_callback' => 'esc_url_raw',
                ],
            ],
        ]);
    }

    public function handle_lead(\WP_REST_Request $request)
    {
        $email = $request->get_param('email');
        if (!is_email($email)) {
            return new \WP_REST_Response(['message' => 'Invalid email'], 400);
        }

        $lead = [
            'email'     => $email,
            'name'      => (string) $request->get_param('name'),
            'video_url' => (string) $request->get_param('video_url'),
            'page_url'  => (string) $request->get_param('page_url'),
            'captured_at' => current_time('mysql'),
            'ip'        => isset($_SERVER['REMOTE_ADDR']) ? sanitize_text_field($_SERVER['REMOTE_ADDR']) : '',
        ];

        $leads = get_option(self::OPTION_KEY, []);
        if (!is_array($leads)) $leads = [];
        $leads[] = $lead;
        if (count($leads) > self::MAX_LEADS) {
            $leads = array_slice($leads, -self::MAX_LEADS);
        }
        update_option(self::OPTION_KEY, $leads, false);

        /**
         * Fires after a lead is captured.
         * Adapter plugins (FluentCRM, Mailchimp, webhook) hook here.
         */
        do_action('embedpress_lead_captured', $lead);

        return new \WP_REST_Response(['message' => 'ok'], 200);
    }
}
