<?php

namespace EmbedPress\Includes\Classes\Analytics;

defined('ABSPATH') or die("No direct script access allowed.");

/**
 * EmbedPress Browser Detector
 * 
 * Detects browser and device information for analytics
 * 
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2023 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       4.2.7
 */
class Browser_Detector
{
    /**
     * User agent string
     *
     * @var string
     */
    private $user_agent;

    /**
     * Constructor
     *
     * @param string $user_agent
     */
    public function __construct($user_agent = null)
    {
        $this->user_agent = $user_agent ?: (isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : '');
    }

    /**
     * Detect browser and device information
     *
     * @return array
     */
    public function detect()
    {
        return [
            'browser_name' => $this->get_browser_name(),
            'browser_version' => $this->get_browser_version(),
            'operating_system' => $this->get_operating_system(),
            'device_type' => $this->get_device_type()
        ];
    }

    /**
     * Get browser name
     *
     * @return string
     */
    private function get_browser_name()
    {
        $browsers = [
            'Edge' => 'Edge',
            'Chrome' => 'Chrome',
            'Firefox' => 'Firefox',
            'Safari' => 'Safari',
            'Opera' => 'Opera',
            'Internet Explorer' => 'MSIE|Trident'
        ];

        foreach ($browsers as $browser => $pattern) {
            if (preg_match('/(' . $pattern . ')/i', $this->user_agent)) {
                return $browser;
            }
        }

        return 'Unknown';
    }

    /**
     * Get browser version
     *
     * @return string
     */
    private function get_browser_version()
    {
        $browser = $this->get_browser_name();
        $version = 'Unknown';

        switch ($browser) {
            case 'Chrome':
                if (preg_match('/Chrome\/([0-9.]+)/', $this->user_agent, $matches)) {
                    $version = $matches[1];
                }
                break;
            case 'Firefox':
                if (preg_match('/Firefox\/([0-9.]+)/', $this->user_agent, $matches)) {
                    $version = $matches[1];
                }
                break;
            case 'Safari':
                if (preg_match('/Version\/([0-9.]+)/', $this->user_agent, $matches)) {
                    $version = $matches[1];
                }
                break;
            case 'Edge':
                if (preg_match('/Edge\/([0-9.]+)/', $this->user_agent, $matches)) {
                    $version = $matches[1];
                } elseif (preg_match('/Edg\/([0-9.]+)/', $this->user_agent, $matches)) {
                    $version = $matches[1];
                }
                break;
            case 'Opera':
                if (preg_match('/Opera\/([0-9.]+)/', $this->user_agent, $matches)) {
                    $version = $matches[1];
                } elseif (preg_match('/OPR\/([0-9.]+)/', $this->user_agent, $matches)) {
                    $version = $matches[1];
                }
                break;
            case 'Internet Explorer':
                if (preg_match('/MSIE ([0-9.]+)/', $this->user_agent, $matches)) {
                    $version = $matches[1];
                } elseif (preg_match('/rv:([0-9.]+)/', $this->user_agent, $matches)) {
                    $version = $matches[1];
                }
                break;
        }

        return $version;
    }

    /**
     * Get operating system
     *
     * @return string
     */
    private function get_operating_system()
    {
        $os_array = [
            'Windows 11' => 'Windows NT 10.0.*Windows NT 10.0.*22000',
            'Windows 10' => 'Windows NT 10.0',
            'Windows 8.1' => 'Windows NT 6.3',
            'Windows 8' => 'Windows NT 6.2',
            'Windows 7' => 'Windows NT 6.1',
            'Windows Vista' => 'Windows NT 6.0',
            'Windows XP' => 'Windows NT 5.1|Windows XP',
            'macOS Big Sur' => 'Mac OS X 10_16|Mac OS X 11',
            'macOS Monterey' => 'Mac OS X 12',
            'macOS Ventura' => 'Mac OS X 13',
            'macOS Sonoma' => 'Mac OS X 14',
            'macOS' => 'Mac OS X|Macintosh',
            'iOS' => 'iPhone|iPad',
            'Android' => 'Android',
            'Linux' => 'Linux',
            'Ubuntu' => 'Ubuntu',
            'Chrome OS' => 'CrOS'
        ];

        foreach ($os_array as $os => $pattern) {
            if (preg_match('/(' . $pattern . ')/i', $this->user_agent)) {
                return $os;
            }
        }

        return 'Unknown';
    }

    /**
     * Get device type
     *
     * @return string
     */
    private function get_device_type()
    {
        // Check for mobile devices
        $mobile_patterns = [
            'iPhone', 'iPod', 'Android.*Mobile', 'BlackBerry', 'webOS',
            'Windows Phone', 'Opera Mini', 'IEMobile', 'Mobile'
        ];

        foreach ($mobile_patterns as $pattern) {
            if (preg_match('/(' . $pattern . ')/i', $this->user_agent)) {
                return 'mobile';
            }
        }

        // Check for tablets
        $tablet_patterns = [
            'iPad', 'Android(?!.*Mobile)', 'Tablet', 'PlayBook', 'Kindle'
        ];

        foreach ($tablet_patterns as $pattern) {
            if (preg_match('/(' . $pattern . ')/i', $this->user_agent)) {
                return 'tablet';
            }
        }

        // Default to desktop
        return 'desktop';
    }

    /**
     * Check if device is mobile
     *
     * @return bool
     */
    public function is_mobile()
    {
        return $this->get_device_type() === 'mobile';
    }

    /**
     * Check if device is tablet
     *
     * @return bool
     */
    public function is_tablet()
    {
        return $this->get_device_type() === 'tablet';
    }

    /**
     * Check if device is desktop
     *
     * @return bool
     */
    public function is_desktop()
    {
        return $this->get_device_type() === 'desktop';
    }

    /**
     * Get detailed browser information
     *
     * @return array
     */
    public function get_detailed_info()
    {
        $info = $this->detect();
        
        return array_merge($info, [
            'user_agent' => $this->user_agent,
            'is_mobile' => $this->is_mobile(),
            'is_tablet' => $this->is_tablet(),
            'is_desktop' => $this->is_desktop(),
            'supports_webp' => $this->supports_webp(),
            'supports_avif' => $this->supports_avif()
        ]);
    }

    /**
     * Check if browser supports WebP
     *
     * @return bool
     */
    private function supports_webp()
    {
        // Chrome 23+, Firefox 65+, Safari 14+, Edge 18+
        $browser = $this->get_browser_name();
        $version = $this->get_browser_version();

        switch ($browser) {
            case 'Chrome':
                return version_compare($version, '23', '>=');
            case 'Firefox':
                return version_compare($version, '65', '>=');
            case 'Safari':
                return version_compare($version, '14', '>=');
            case 'Edge':
                return version_compare($version, '18', '>=');
            default:
                return false;
        }
    }

    /**
     * Check if browser supports AVIF
     *
     * @return bool
     */
    private function supports_avif()
    {
        // Chrome 85+, Firefox 93+
        $browser = $this->get_browser_name();
        $version = $this->get_browser_version();

        switch ($browser) {
            case 'Chrome':
                return version_compare($version, '85', '>=');
            case 'Firefox':
                return version_compare($version, '93', '>=');
            default:
                return false;
        }
    }
}
