<?php

namespace EmbedPress\Includes\Classes\Analytics;

defined('ABSPATH') or die("No direct script access allowed.");

/**
 * EmbedPress Milestone Manager
 * 
 * Handles milestone tracking and notifications for upsell features
 * 
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2023 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       4.2.7
 */
class Milestone_Manager
{
    /**
     * Milestone thresholds
     *
     * @var array
     */
    private $milestones = [
        'total_views' => [100, 500, 1000, 5000, 10000, 50000, 100000],
        'total_embeds' => [10, 25, 50, 100, 250, 500, 1000],
        'daily_views' => [50, 100, 250, 500, 1000],
        'monthly_views' => [500, 1000, 2500, 5000, 10000, 25000, 50000]
    ];

    /**
     * Check for milestone achievements
     *
     * @return void
     */
    public function check_milestones()
    {
        $this->check_total_views_milestones();
        $this->check_total_embeds_milestones();
        $this->check_daily_views_milestones();
        $this->check_monthly_views_milestones();
    }

    /**
     * Check total views milestones
     *
     * @return void
     */
    private function check_total_views_milestones()
    {
        global $wpdb;
        
        $content_table = $wpdb->prefix . 'embedpress_analytics_content';
        $total_views = $wpdb->get_var("SELECT SUM(total_views) FROM $content_table");
        
        if (!$total_views) {
            return;
        }

        foreach ($this->milestones['total_views'] as $milestone) {
            if ($total_views >= $milestone && !$this->is_milestone_achieved('total_views', $milestone)) {
                $this->record_milestone_achievement('total_views', $milestone, $total_views);
                $this->trigger_milestone_notification('total_views', $milestone, $total_views);
            }
        }
    }

    /**
     * Check total embeds milestones
     *
     * @return void
     */
    private function check_total_embeds_milestones()
    {
        global $wpdb;
        
        $content_table = $wpdb->prefix . 'embedpress_analytics_content';
        $total_embeds = $wpdb->get_var("SELECT COUNT(*) FROM $content_table");
        
        if (!$total_embeds) {
            return;
        }

        foreach ($this->milestones['total_embeds'] as $milestone) {
            if ($total_embeds >= $milestone && !$this->is_milestone_achieved('total_embeds', $milestone)) {
                $this->record_milestone_achievement('total_embeds', $milestone, $total_embeds);
                $this->trigger_milestone_notification('total_embeds', $milestone, $total_embeds);
            }
        }
    }

    /**
     * Check daily views milestones
     *
     * @return void
     */
    private function check_daily_views_milestones()
    {
        global $wpdb;
        
        $views_table = $wpdb->prefix . 'embedpress_analytics_views';
        $today = date('Y-m-d');
        
        $daily_views = $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM $views_table 
             WHERE interaction_type = 'view' AND DATE(created_at) = %s",
            $today
        ));
        
        if (!$daily_views) {
            return;
        }

        foreach ($this->milestones['daily_views'] as $milestone) {
            if ($daily_views >= $milestone && !$this->is_milestone_achieved('daily_views', $milestone, $today)) {
                $this->record_milestone_achievement('daily_views', $milestone, $daily_views);
                $this->trigger_milestone_notification('daily_views', $milestone, $daily_views);
            }
        }
    }

    /**
     * Check monthly views milestones
     *
     * @return void
     */
    private function check_monthly_views_milestones()
    {
        global $wpdb;
        
        $views_table = $wpdb->prefix . 'embedpress_analytics_views';
        $start_of_month = date('Y-m-01');
        
        $monthly_views = $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM $views_table 
             WHERE interaction_type = 'view' AND DATE(created_at) >= %s",
            $start_of_month
        ));
        
        if (!$monthly_views) {
            return;
        }

        foreach ($this->milestones['monthly_views'] as $milestone) {
            if ($monthly_views >= $milestone && !$this->is_milestone_achieved('monthly_views', $milestone, $start_of_month)) {
                $this->record_milestone_achievement('monthly_views', $milestone, $monthly_views);
                $this->trigger_milestone_notification('monthly_views', $milestone, $monthly_views);
            }
        }
    }

    /**
     * Check if milestone is already achieved
     *
     * @param string $type
     * @param int $value
     * @param string $date
     * @return bool
     */
    private function is_milestone_achieved($type, $value, $date = null)
    {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'embedpress_analytics_milestones';
        
        $where_clause = "milestone_type = %s AND milestone_value = %d";
        $params = [$type, $value];
        
        // For daily/monthly milestones, check for specific date
        if ($date && in_array($type, ['daily_views', 'monthly_views'])) {
            $where_clause .= " AND DATE(achieved_at) = %s";
            $params[] = $date;
        }
        
        $exists = $wpdb->get_var($wpdb->prepare(
            "SELECT id FROM $table_name WHERE $where_clause",
            ...$params
        ));
        
        return !empty($exists);
    }

    /**
     * Record milestone achievement
     *
     * @param string $type
     * @param int $milestone_value
     * @param int $achieved_value
     * @return void
     */
    private function record_milestone_achievement($type, $milestone_value, $achieved_value)
    {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'embedpress_analytics_milestones';
        
        $data = [
            'milestone_type' => $type,
            'milestone_value' => $milestone_value,
            'achieved_value' => $achieved_value,
            'achieved_at' => current_time('mysql')
        ];
        
        $wpdb->insert($table_name, $data);
    }

    /**
     * Trigger milestone notification
     *
     * @param string $type
     * @param int $milestone_value
     * @param int $achieved_value
     * @return void
     */
    private function trigger_milestone_notification($type, $milestone_value, $achieved_value)
    {
        // Store notification in WordPress transients for admin display
        $notification_data = [
            'type' => $type,
            'milestone_value' => $milestone_value,
            'achieved_value' => $achieved_value,
            'timestamp' => time()
        ];
        
        // Store multiple notifications
        $existing_notifications = get_transient('embedpress_milestone_notifications');
        if (!is_array($existing_notifications)) {
            $existing_notifications = [];
        }
        
        $existing_notifications[] = $notification_data;
        
        // Keep only last 5 notifications
        $existing_notifications = array_slice($existing_notifications, -5);
        
        set_transient('embedpress_milestone_notifications', $existing_notifications, DAY_IN_SECONDS);
        
        // Trigger action for other plugins/themes to hook into
        do_action('embedpress_milestone_achieved', $type, $milestone_value, $achieved_value);
    }

    /**
     * Get milestone notifications
     *
     * @return array
     */
    public function get_milestone_notifications()
    {
        $notifications = get_transient('embedpress_milestone_notifications');
        return is_array($notifications) ? $notifications : [];
    }

    /**
     * Mark notification as read
     *
     * @param int $timestamp
     * @return void
     */
    public function mark_notification_read($timestamp)
    {
        $notifications = $this->get_milestone_notifications();
        
        foreach ($notifications as $key => $notification) {
            if ($notification['timestamp'] == $timestamp) {
                unset($notifications[$key]);
                break;
            }
        }
        
        set_transient('embedpress_milestone_notifications', array_values($notifications), DAY_IN_SECONDS);
    }

    /**
     * Get milestone data for dashboard
     *
     * @return array
     */
    public function get_milestone_data()
    {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'embedpress_analytics_milestones';
        
        // Get recent achievements
        $recent_achievements = $wpdb->get_results(
            "SELECT * FROM $table_name 
             ORDER BY achieved_at DESC 
             LIMIT 10",
            ARRAY_A
        );
        
        // Get progress towards next milestones
        $data_collector = new Data_Collector();
        $current_stats = $data_collector->get_analytics_data();
        
        $progress = [];
        
        // Total views progress
        $total_views = $current_stats['views_analytics']['total_views'];
        $next_views_milestone = $this->get_next_milestone('total_views', $total_views);
        if ($next_views_milestone) {
            $progress['total_views'] = [
                'current' => $total_views,
                'next_milestone' => $next_views_milestone,
                'progress_percentage' => ($total_views / $next_views_milestone) * 100
            ];
        }
        
        // Total embeds progress
        $total_embeds = $current_stats['content_by_type']['total'];
        $next_embeds_milestone = $this->get_next_milestone('total_embeds', $total_embeds);
        if ($next_embeds_milestone) {
            $progress['total_embeds'] = [
                'current' => $total_embeds,
                'next_milestone' => $next_embeds_milestone,
                'progress_percentage' => ($total_embeds / $next_embeds_milestone) * 100
            ];
        }
        
        return [
            'recent_achievements' => $recent_achievements,
            'progress' => $progress,
            'notifications' => $this->get_milestone_notifications()
        ];
    }

    /**
     * Get next milestone for a given type and current value
     *
     * @param string $type
     * @param int $current_value
     * @return int|null
     */
    private function get_next_milestone($type, $current_value)
    {
        if (!isset($this->milestones[$type])) {
            return null;
        }
        
        foreach ($this->milestones[$type] as $milestone) {
            if ($milestone > $current_value) {
                return $milestone;
            }
        }
        
        return null;
    }

    /**
     * Get milestone message for notifications
     *
     * @param string $type
     * @param int $milestone_value
     * @param int $achieved_value
     * @return string
     */
    public function get_milestone_message($type, $milestone_value, $achieved_value)
    {
        $messages = [
            'total_views' => sprintf(
                __('🎉 Congratulations! Your embedded content has reached %s total views! Consider upgrading to EmbedPress Pro for advanced analytics and features.', 'embedpress'),
                number_format($milestone_value)
            ),
            'total_embeds' => sprintf(
                __('🚀 Amazing! You\'ve created %s embedded content pieces! Unlock more embedding options with EmbedPress Pro.', 'embedpress'),
                number_format($milestone_value)
            ),
            'daily_views' => sprintf(
                __('📈 Fantastic! You\'ve reached %s views today! Upgrade to Pro for detailed daily analytics and insights.', 'embedpress'),
                number_format($milestone_value)
            ),
            'monthly_views' => sprintf(
                __('🏆 Incredible! %s views this month! Get advanced monthly reports with EmbedPress Pro.', 'embedpress'),
                number_format($milestone_value)
            )
        ];
        
        return isset($messages[$type]) ? $messages[$type] : __('Milestone achieved!', 'embedpress');
    }
}
