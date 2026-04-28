<?php

namespace EmbedPress\Includes\Classes;

use \Elementor\Controls_Manager;
use \Elementor\Repeater;

class Extend_CustomPlayer_Controls
{

	public function __construct()
	{
		add_action('extend_customplayer_controls', [$this, 'extend_elementor_customplayer_controls'], 10, 4);
	}

	public function extend_elementor_customplayer_controls($that, $infix = '', $pro_text = '', $pro_class = '')
	{

		$condition = [
			'emberpress_custom_player' => 'yes',
			'embedpress_pro_embeded_source' => ['youtube', 'vimeo', 'selfhosted_video', 'selfhosted_audio']
		];

		// ─── Section heading: Playback Controls ──────────────────────────
		$that->add_control(
			'embepress_player_section_playback',
			[
				'label' => __('Playback Controls', 'embedpress'),
				'type'  => Controls_Manager::HEADING,
				'separator' => 'before',
				'condition' => $condition,
			]
		);

		$that->add_control(
			'embepress_player_restart',
			[
				'label'        => __('Restart', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'condition' => $condition,
			]
		);
		$that->add_control(
			'embepress_player_rewind',
			[
				'label'        => __('Rewind', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'condition' => $condition,
			]
		);
		$that->add_control(
			'embepress_player_fast_forward',
			[
				'label'        => __('Fast Forward', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'condition' => $condition,
			]
		);
		$that->add_control(
			'embepress_player_tooltip',
			[
				'label' => sprintf(__('Tooltip %s', 'embedpress'), $pro_text),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'condition' => $condition,
				'classes'     => $pro_class,
			]
		);
		$that->add_control(
			'embepress_player_hide_controls',
			[
				'label' => sprintf(__('Auto Hide Controls %s', 'embedpress'), $pro_text),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => '',
				'classes'     => $pro_class,
				'condition' =>  [
					'emberpress_custom_player' => 'yes',
					'embedpress_pro_embeded_source' => ['youtube', 'vimeo', 'selfhosted_video']
				],
			]
		);
		$that->add_control(
			'embepress_player_download',
			[
				'label' => sprintf(__('Source Link %s', 'embedpress'), $pro_text),
				'type'         => Controls_Manager::SWITCHER,
				'label_block'  => false,
				'return_value' => 'yes',
				'default'      => 'yes',
				'condition' => $condition,
				'classes'     => $pro_class,
			]
		);

		// ─── Section: Engagement & Conversions ───────────────────────────
		$that->add_control(
			'embepress_player_section_engagement',
			[
				'label' => __('Engagement & Conversions', 'embedpress'),
				'type'  => Controls_Manager::HEADING,
				'separator' => 'before',
				'condition' => $condition,
			]
		);

		// 4.1 — Email Capture
		$that->add_control(
			'embepress_player_email_capture',
			[
				'label'        => sprintf(__('Email Capture %s', 'embedpress'), $pro_text),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => '',
				'classes'      => $pro_class,
				'condition'    => $condition,
			]
		);
		$that->add_control(
			'embepress_player_email_capture_unit',
			[
				'label'   => __('Trigger Unit', 'embedpress'),
				'type'    => Controls_Manager::SELECT,
				'options' => [
					'seconds' => __('Seconds', 'embedpress'),
					'percent' => __('Percent of duration', 'embedpress'),
				],
				'default' => 'seconds',
				'classes' => $pro_class,
				'condition' => array_merge($condition, ['embepress_player_email_capture' => 'yes']),
			]
		);
		$that->add_control(
			'embepress_player_email_capture_time',
			[
				'label'   => __('Trigger At', 'embedpress'),
				'type'    => Controls_Manager::NUMBER,
				'min'     => 0,
				'default' => 30,
				'classes' => $pro_class,
				'condition' => array_merge($condition, ['embepress_player_email_capture' => 'yes']),
			]
		);
		$that->add_control(
			'embepress_player_email_capture_headline',
			[
				'label'   => __('Headline', 'embedpress'),
				'type'    => Controls_Manager::TEXT,
				'default' => __('Enter your email to keep watching', 'embedpress'),
				'classes' => $pro_class,
				'condition' => array_merge($condition, ['embepress_player_email_capture' => 'yes']),
			]
		);
		$that->add_control(
			'embepress_player_email_capture_button_text',
			[
				'label'   => __('Submit Button Text', 'embedpress'),
				'type'    => Controls_Manager::TEXT,
				'default' => __('Continue', 'embedpress'),
				'classes' => $pro_class,
				'condition' => array_merge($condition, ['embepress_player_email_capture' => 'yes']),
			]
		);
		$that->add_control(
			'embepress_player_email_capture_require_name',
			[
				'label'        => __('Require Name', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => '',
				'classes'      => $pro_class,
				'condition' => array_merge($condition, ['embepress_player_email_capture' => 'yes']),
			]
		);
		$that->add_control(
			'embepress_player_email_capture_allow_skip',
			[
				'label'        => __('Allow Skip', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => '',
				'classes'      => $pro_class,
				'condition' => array_merge($condition, ['embepress_player_email_capture' => 'yes']),
			]
		);

		// 4.2 — Action Lock
		$that->add_control(
			'embepress_player_action_lock',
			[
				'label'        => sprintf(__('Action Lock %s', 'embedpress'), $pro_text),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => '',
				'classes'      => $pro_class,
				'separator'    => 'before',
				'condition'    => $condition,
			]
		);
		$that->add_control(
			'embepress_player_action_lock_type',
			[
				'label'   => __('Action Type', 'embedpress'),
				'type'    => Controls_Manager::SELECT,
				'options' => [
					'share' => __('Social Share', 'embedpress'),
					'link'  => __('Open Link', 'embedpress'),
					'login' => __('Login', 'embedpress'),
				],
				'default' => 'share',
				'classes' => $pro_class,
				'condition' => array_merge($condition, ['embepress_player_action_lock' => 'yes']),
			]
		);
		$that->add_control(
			'embepress_player_action_lock_headline',
			[
				'label'   => __('Headline', 'embedpress'),
				'type'    => Controls_Manager::TEXT,
				'default' => __('Unlock this video', 'embedpress'),
				'classes' => $pro_class,
				'condition' => array_merge($condition, ['embepress_player_action_lock' => 'yes']),
			]
		);
		$that->add_control(
			'embepress_player_action_lock_message',
			[
				'label'   => __('Message', 'embedpress'),
				'type'    => Controls_Manager::TEXTAREA,
				'default' => __('Complete the action below to continue watching.', 'embedpress'),
				'classes' => $pro_class,
				'condition' => array_merge($condition, ['embepress_player_action_lock' => 'yes']),
			]
		);
		$that->add_control(
			'embepress_player_action_lock_share_networks',
			[
				'label'   => __('Networks', 'embedpress'),
				'type'    => Controls_Manager::SELECT2,
				'multiple' => true,
				'options' => [
					'facebook' => 'Facebook',
					'twitter'  => 'Twitter',
					'linkedin' => 'LinkedIn',
				],
				'default' => ['facebook', 'twitter', 'linkedin'],
				'classes' => $pro_class,
				'condition' => array_merge($condition, [
					'embepress_player_action_lock' => 'yes',
					'embepress_player_action_lock_type' => 'share',
				]),
			]
		);
		$that->add_control(
			'embepress_player_action_lock_share_url',
			[
				'label'   => __('Share URL (blank = current page)', 'embedpress'),
				'type'    => Controls_Manager::URL,
				'classes' => $pro_class,
				'condition' => array_merge($condition, [
					'embepress_player_action_lock' => 'yes',
					'embepress_player_action_lock_type' => 'share',
				]),
			]
		);
		$that->add_control(
			'embepress_player_action_lock_link_url',
			[
				'label'   => __('Link URL', 'embedpress'),
				'type'    => Controls_Manager::URL,
				'classes' => $pro_class,
				'condition' => array_merge($condition, [
					'embepress_player_action_lock' => 'yes',
					'embepress_player_action_lock_type' => 'link',
				]),
			]
		);
		$that->add_control(
			'embepress_player_action_lock_link_text',
			[
				'label'   => __('Button Text', 'embedpress'),
				'type'    => Controls_Manager::TEXT,
				'default' => __('Open link', 'embedpress'),
				'classes' => $pro_class,
				'condition' => array_merge($condition, [
					'embepress_player_action_lock' => 'yes',
					'embepress_player_action_lock_type' => 'link',
				]),
			]
		);
		$that->add_control(
			'embepress_player_action_lock_bypass_admins',
			[
				'label'        => __('Bypass for Admins', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => 'yes',
				'classes'      => $pro_class,
				'condition' => array_merge($condition, ['embepress_player_action_lock' => 'yes']),
			]
		);

		// 4.3 — Timed CTA (repeater)
		$that->add_control(
			'embepress_player_timed_cta',
			[
				'label'        => sprintf(__('Timed Call To Action %s', 'embedpress'), $pro_text),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => '',
				'classes'      => $pro_class,
				'separator'    => 'before',
				'condition'    => $condition,
			]
		);
		$cta_repeater = new Repeater();
		$cta_repeater->add_control('time', [
			'label' => __('Time (seconds)', 'embedpress'),
			'type'  => Controls_Manager::NUMBER,
			'min'   => 0,
			'default' => 30,
		]);
		$cta_repeater->add_control('headline', [
			'label' => __('Headline', 'embedpress'),
			'type'  => Controls_Manager::TEXT,
		]);
		$cta_repeater->add_control('button_text', [
			'label' => __('Button Text', 'embedpress'),
			'type'  => Controls_Manager::TEXT,
		]);
		$cta_repeater->add_control('button_url', [
			'label' => __('Button URL', 'embedpress'),
			'type'  => Controls_Manager::URL,
		]);
		$cta_repeater->add_control('duration', [
			'label' => __('Auto-hide (seconds, 0 = until dismissed)', 'embedpress'),
			'type'  => Controls_Manager::NUMBER,
			'min'   => 0,
			'default' => 8,
		]);
		$cta_repeater->add_control('dismissible', [
			'label' => __('Dismissible', 'embedpress'),
			'type'  => Controls_Manager::SWITCHER,
			'return_value' => 'yes',
			'default' => 'yes',
		]);
		$that->add_control(
			'embepress_player_timed_cta_items',
			[
				'label'   => __('CTAs', 'embedpress'),
				'type'    => Controls_Manager::REPEATER,
				'fields'  => $cta_repeater->get_controls(),
				'classes' => $pro_class,
				'condition' => array_merge($condition, ['embepress_player_timed_cta' => 'yes']),
			]
		);

		// ─── Section: Navigation & UX ────────────────────────────────────
		$that->add_control(
			'embepress_player_section_navigation',
			[
				'label' => __('Navigation & UX', 'embedpress'),
				'type'  => Controls_Manager::HEADING,
				'separator' => 'before',
				'condition' => $condition,
			]
		);

		// 4.4 — Video Chapters (repeater)
		$that->add_control(
			'embepress_player_chapters',
			[
				'label'        => sprintf(__('Video Chapters %s', 'embedpress'), $pro_text),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => '',
				'classes'      => $pro_class,
				'condition'    => $condition,
			]
		);
		$that->add_control(
			'embepress_player_chapters_show_title',
			[
				'label'        => __('Show Current Chapter Title', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => 'yes',
				'classes'      => $pro_class,
				'condition' => array_merge($condition, ['embepress_player_chapters' => 'yes']),
			]
		);
		$chapter_repeater = new Repeater();
		$chapter_repeater->add_control('time', [
			'label' => __('Start (seconds)', 'embedpress'),
			'type'  => Controls_Manager::NUMBER,
			'min'   => 0,
			'default' => 0,
		]);
		$chapter_repeater->add_control('title', [
			'label' => __('Title', 'embedpress'),
			'type'  => Controls_Manager::TEXT,
		]);
		$that->add_control(
			'embepress_player_chapters_items',
			[
				'label'   => __('Chapters', 'embedpress'),
				'type'    => Controls_Manager::REPEATER,
				'fields'  => $chapter_repeater->get_controls(),
				'classes' => $pro_class,
				'condition' => array_merge($condition, ['embepress_player_chapters' => 'yes']),
			]
		);

		// 4.5 — Auto Resume Playback
		$that->add_control(
			'embepress_player_auto_resume',
			[
				'label'        => sprintf(__('Auto Resume Playback %s', 'embedpress'), $pro_text),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => '',
				'classes'      => $pro_class,
				'separator'    => 'before',
				'condition'    => $condition,
			]
		);
		$that->add_control(
			'embepress_player_auto_resume_threshold',
			[
				'label'   => __('Resume Threshold (seconds)', 'embedpress'),
				'type'    => Controls_Manager::NUMBER,
				'min'     => 5,
				'default' => 30,
				'classes' => $pro_class,
				'condition' => array_merge($condition, ['embepress_player_auto_resume' => 'yes']),
			]
		);

		// 4.6 — Custom End Screen
		$that->add_control(
			'embepress_player_end_screen',
			[
				'label'        => sprintf(__('Custom End Screen %s', 'embedpress'), $pro_text),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => '',
				'classes'      => $pro_class,
				'separator'    => 'before',
				'condition'    => $condition,
			]
		);
		$that->add_control(
			'embepress_player_end_screen_mode',
			[
				'label'   => __('End Screen Mode', 'embedpress'),
				'type'    => Controls_Manager::SELECT,
				'options' => [
					'message'  => __('Message Only', 'embedpress'),
					'cta'      => __('Message + Button', 'embedpress'),
					'redirect' => __('Auto Redirect', 'embedpress'),
				],
				'default' => 'message',
				'classes' => $pro_class,
				'condition' => array_merge($condition, ['embepress_player_end_screen' => 'yes']),
			]
		);
		$that->add_control(
			'embepress_player_end_screen_message',
			[
				'label'   => __('Message', 'embedpress'),
				'type'    => Controls_Manager::TEXT,
				'default' => __('Thanks for watching!', 'embedpress'),
				'classes' => $pro_class,
				'condition' => array_merge($condition, ['embepress_player_end_screen' => 'yes']),
			]
		);
		$that->add_control(
			'embepress_player_end_screen_button_text',
			[
				'label'   => __('Button Text', 'embedpress'),
				'type'    => Controls_Manager::TEXT,
				'default' => __('Learn more', 'embedpress'),
				'classes' => $pro_class,
				'condition' => array_merge($condition, [
					'embepress_player_end_screen' => 'yes',
					'embepress_player_end_screen_mode' => 'cta',
				]),
			]
		);
		$that->add_control(
			'embepress_player_end_screen_button_url',
			[
				'label'   => __('Button URL', 'embedpress'),
				'type'    => Controls_Manager::URL,
				'classes' => $pro_class,
				'condition' => array_merge($condition, [
					'embepress_player_end_screen' => 'yes',
					'embepress_player_end_screen_mode' => 'cta',
				]),
			]
		);
		$that->add_control(
			'embepress_player_end_screen_redirect_url',
			[
				'label'   => __('Redirect URL', 'embedpress'),
				'type'    => Controls_Manager::URL,
				'classes' => $pro_class,
				'condition' => array_merge($condition, [
					'embepress_player_end_screen' => 'yes',
					'embepress_player_end_screen_mode' => 'redirect',
				]),
			]
		);
		$that->add_control(
			'embepress_player_end_screen_countdown',
			[
				'label'   => __('Countdown (seconds)', 'embedpress'),
				'type'    => Controls_Manager::NUMBER,
				'min'     => 0,
				'default' => 5,
				'classes' => $pro_class,
				'condition' => array_merge($condition, [
					'embepress_player_end_screen' => 'yes',
					'embepress_player_end_screen_mode' => 'redirect',
				]),
			]
		);
		$that->add_control(
			'embepress_player_end_screen_show_replay',
			[
				'label'        => __('Show Replay Button', 'embedpress'),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => 'yes',
				'classes'      => $pro_class,
				'condition' => array_merge($condition, ['embepress_player_end_screen' => 'yes']),
			]
		);

		// ─── Section: Privacy & Compliance ───────────────────────────────
		$that->add_control(
			'embepress_player_section_privacy',
			[
				'label' => __('Privacy & Compliance', 'embedpress'),
				'type'  => Controls_Manager::HEADING,
				'separator' => 'before',
				'condition' => $condition,
			]
		);

		// 4.10 — Advanced Privacy Mode
		$that->add_control(
			'embepress_player_privacy_mode',
			[
				'label'        => sprintf(__('Advanced Privacy Mode %s', 'embedpress'), $pro_text),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => '',
				'classes'      => $pro_class,
				'condition'    => $condition,
			]
		);
		$that->add_control(
			'embepress_player_privacy_message',
			[
				'label'   => __('Click-to-load Message', 'embedpress'),
				'type'    => Controls_Manager::TEXTAREA,
				'default' => __('Click to load. By playing, you accept third-party cookies.', 'embedpress'),
				'classes' => $pro_class,
				'condition' => array_merge($condition, ['embepress_player_privacy_mode' => 'yes']),
			]
		);

		// 4.9 — Country Restriction
		$that->add_control(
			'embepress_player_country_restriction',
			[
				'label'        => sprintf(__('Country Restriction %s', 'embedpress'), $pro_text),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => '',
				'classes'      => $pro_class,
				'separator'    => 'before',
				'condition'    => $condition,
			]
		);
		$that->add_control(
			'embepress_player_country_mode',
			[
				'label'   => __('Mode', 'embedpress'),
				'type'    => Controls_Manager::SELECT,
				'options' => [
					'block' => __('Block listed countries', 'embedpress'),
					'allow' => __('Allow only listed countries', 'embedpress'),
				],
				'default' => 'block',
				'classes' => $pro_class,
				'condition' => array_merge($condition, ['embepress_player_country_restriction' => 'yes']),
			]
		);
		$that->add_control(
			'embepress_player_country_list',
			[
				'label'   => __('Country Codes (comma-separated)', 'embedpress'),
				'type'    => Controls_Manager::TEXT,
				'placeholder' => 'US, GB, DE',
				'classes' => $pro_class,
				'condition' => array_merge($condition, ['embepress_player_country_restriction' => 'yes']),
			]
		);
		$that->add_control(
			'embepress_player_country_message',
			[
				'label'   => __('Restricted Message', 'embedpress'),
				'type'    => Controls_Manager::TEXTAREA,
				'default' => __('Sorry, this video is not available in your country.', 'embedpress'),
				'classes' => $pro_class,
				'condition' => array_merge($condition, ['embepress_player_country_restriction' => 'yes']),
			]
		);

		// ─── Section: Analytics & Learning ───────────────────────────────
		$that->add_control(
			'embepress_player_section_analytics',
			[
				'label' => __('Analytics & Learning', 'embedpress'),
				'type'  => Controls_Manager::HEADING,
				'separator' => 'before',
				'condition' => $condition,
			]
		);

		// 4.7 — Drop-off Heatmap
		$that->add_control(
			'embepress_player_heatmap',
			[
				'label'        => sprintf(__('Drop-off Heatmap %s', 'embedpress'), $pro_text),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => '',
				'classes'      => $pro_class,
				'condition'    => $condition,
			]
		);

		// 4.11 — Course Completion Tracking
		$that->add_control(
			'embepress_player_lms_tracking',
			[
				'label'        => sprintf(__('Course Completion Tracking %s', 'embedpress'), $pro_text),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => '',
				'classes'      => $pro_class,
				'separator'    => 'before',
				'condition'    => $condition,
			]
		);
		$that->add_control(
			'embepress_player_lms_threshold',
			[
				'label'   => __('Completion Threshold (%)', 'embedpress'),
				'type'    => Controls_Manager::NUMBER,
				'min'     => 50,
				'max'     => 99,
				'default' => 90,
				'classes' => $pro_class,
				'condition' => array_merge($condition, ['embepress_player_lms_tracking' => 'yes']),
			]
		);

		// ─── Section: Delivery ───────────────────────────────────────────
		$that->add_control(
			'embepress_player_section_delivery',
			[
				'label' => __('Delivery', 'embedpress'),
				'type'  => Controls_Manager::HEADING,
				'separator' => 'before',
				'condition' => $condition,
			]
		);

		// 4.8 — Adaptive Streaming
		$that->add_control(
			'embepress_player_adaptive_streaming',
			[
				'label'        => sprintf(__('Adaptive Streaming (HLS/DASH) %s', 'embedpress'), $pro_text),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => '',
				'classes'      => $pro_class,
				'description'  => __('Auto-detects .m3u8 / .mpd self-hosted sources.', 'embedpress'),
				'condition'    => $condition,
			]
		);

		// 4.12 — CDN Offloading (per-block opt-out)
		$that->add_control(
			'embepress_player_cdn_enabled',
			[
				'label'        => sprintf(__('Use CDN (if configured) %s', 'embedpress'), $pro_text),
				'type'         => Controls_Manager::SWITCHER,
				'return_value' => 'yes',
				'default'      => 'yes',
				'classes'      => $pro_class,
				'condition'    => $condition,
			]
		);
	}
}
