<?php

namespace EmbedPress\Providers;

use Embera\Provider\ProviderAdapter;
use Embera\Provider\ProviderInterface;
use Embera\Url;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Wistia provider for EmbedPress.
 *
 * @package     EmbedPress
 * @subpackage  EmbedPress/Providers
 * @author      EmbedPress
 * @license     GPLv3 or later
 * @since       1.0.0
 */
class Wistia extends ProviderAdapter implements ProviderInterface
{
    protected static $hosts = [
        '*.wistia.com',
        'wistia.com'
    ];

    /** inline {@inheritdoc} */
    protected $allowedParams = [
        'maxwidth',
        'maxheight',
        'wstarttime',
        'wautoplay',
        'scheme',
        'captions',
        'captions_default',
        'playbutton',
        'smallplaybutton',
        'playbar',
        'resumable',
        'wistiafocus',
        'volumecontrol',
        'volume',
        'rewind',
        'rewind_time',
        'wfullscreen',
    ];


    /** inline {@inheritdoc} */
    protected $httpsSupport = true;

    public function getAllowedParams()
    {
        return $this->allowedParams;
    }

    /** inline {@inheritdoc} */
    protected $responsiveSupport = true;

    public function __construct($url, array $config = [])
    {
        parent::__construct($url, $config);
        add_filter('embedpress_render_dynamic_content', [$this, 'fakeDynamicResponse'], 10, 2);
    }

    /**
     * Validates if the URL belongs to Wistia.
     *
     * @param Url $url
     * @return bool
     */
    public function validateUrl(Url $url)
    {
        $urlString = (string) $url;


        return (bool) (
            preg_match('~(?:\w+\.)?wistia\.com/embed/(iframe|playlists)/([^/]+)~i', $urlString) ||
            preg_match('~(?:\w+\.)?wistia\.com/medias/([^/]+)~i', $urlString)
        );
    }

    public function getVideoIDFromURL($url)
    {
        // https://fast.wistia.com/embed/medias/xf1edjzn92.jsonp
        // https://ostraining-1.wistia.com/medias/xf1edjzn92
        preg_match('#\/medias\\\?\/([a-z0-9]+)\.?#i', $url, $matches);

        $id = false;
        if (isset($matches[1])) {
            $id = $matches[1];
        }

        return $id;
    }

    private function getMergedOptions($providerOptions = [])
    {
        $wis_settings = get_option(EMBEDPRESS_PLG_NAME . ':wistia');
        if (!is_array($wis_settings)) {
            $wis_settings = [];
        }

        // Map: provider param => [admin settings key, default value]
        $defaults_map = [
            'wfullscreen'      => ['display_fullscreen_button', 1],
            'playbar'          => ['display_playbar', 1],
            'smallplaybutton'  => ['small_play_button', 1],
            'playbutton'       => [null, 1],
            'wautoplay'        => ['autoplay', ''],
            'wstarttime'       => ['start_time', 0],
            'scheme'           => ['player_color', ''],
            'resumable'        => ['plugin_resumable', ''],
            'wistiafocus'      => ['plugin_focus', ''],
            'rewind'           => ['plugin_rewind', ''],
            'rewind_time'      => ['plugin_rewind_time', 10],
            'volumecontrol'    => ['display_volume_control', 1],
            'volume'           => ['volume', 100],
            'captions'         => ['plugin_captions', ''],
            'captions_default' => ['plugin_captions_default', ''],
        ];

        $merged = $providerOptions;

        foreach ($defaults_map as $paramKey => list($adminKey, $default)) {
            if (!isset($merged[$paramKey]) || $merged[$paramKey] === '') {
                if ($adminKey !== null && isset($wis_settings[$adminKey]) && $wis_settings[$adminKey] !== '') {
                    $merged[$paramKey] = $wis_settings[$adminKey];
                } else {
                    $merged[$paramKey] = $default;
                }
            }
        }

        return $merged;
    }

    private function buildEmbedHtml($options)
    {
        $embedOptions = new \stdClass;
        $embedOptions->videoFoam = false;

        // Fullscreen
        $embedOptions->fullscreenButton = (bool) $options['wfullscreen'];

        // Playbar
        $embedOptions->playbar = (bool) $options['playbar'];

        // Small play button
        $embedOptions->smallPlayButton = (bool) $options['smallplaybutton'];

        // Big play button
        $embedOptions->playButton = (bool) $options['playbutton'];

        // Autoplay
        $embedOptions->autoPlay = (bool) $options['wautoplay'];

        // Volume control
        $embedOptions->volumeControl = (bool) $options['volumecontrol'];

        // Volume (convert 0-100 to 0-1 float)
        if (isset($options['volume'])) {
            $embedOptions->volume = max(0, min(1, (int) $options['volume'] / 100));
        }

        // Start time
        if (!empty($options['wstarttime'])) {
            $embedOptions->time = (int) $options['wstarttime'];
        }

        // Player color
        if (!empty($options['scheme'])) {
            $embedOptions->playerColor = $options['scheme'];
        }

        // Plugins
        $pluginsBaseURL = plugins_url(
            'assets/js/wistia/min',
            dirname(__DIR__) . '/embedpress-Wistia.php'
        );

        $pluginList = [];

        // Resumable
        $isResumableEnabled = !empty($options['resumable']);
        if ($isResumableEnabled) {
            $pluginList['resumable'] = [
                'src'   => $pluginsBaseURL . '/resumable.min.js',
                'async' => false
            ];
        }

        // Autoplay + resumable fix
        if ($embedOptions->autoPlay && $isResumableEnabled) {
            $pluginList['fixautoplayresumable'] = [
                'src' => $pluginsBaseURL . '/fixautoplayresumable.min.js'
            ];
        }

        // Focus (dim the lights)
        if (!empty($options['wistiafocus'])) {
            $pluginList['dimthelights'] = [
                'src'     => $pluginsBaseURL . '/dimthelights.min.js',
                'autoDim' => true
            ];
            $embedOptions->focus = true;
        }

        // Captions
        if (!empty($options['captions'])) {
            $pluginList['captions-v1'] = [
                'onByDefault' => !empty($options['captions_default']),
            ];
        }

        // Rewind
        if (!empty($options['rewind'])) {
            $rewindTime = !empty($options['rewind_time']) ? (int) $options['rewind_time'] : 10;
            $embedOptions->rewindTime = $rewindTime;

            $pluginList['rewind'] = [
                'src' => $pluginsBaseURL . '/rewind.min.js'
            ];
        }

        $embedOptions->plugin = $pluginList;
        $embedOptions = json_encode($embedOptions);

        // Video ID
        $videoId = $this->getVideoIDFromURL($options['url']);
        $shortVideoId = substr($videoId, 0, 3);

        $class = [
            'wistia_embed',
            'wistia_async_' . $videoId
        ];

        $width  = $options['width']  ?? 640;
        $height = $options['height'] ?? 360;

        $attribs = [
            sprintf('id="wistia_%s"', $videoId),
            sprintf('class="%s"', implode(' ', $class)),
            sprintf('style="width:%spx; height:%spx;"', $width, $height)
        ];

        $html  = "<div class=\"embedpress-wrapper ose-wistia ose-uid-{$videoId} responsive we\">";
        $html .= '<script src="https://fast.wistia.com/assets/external/E-v1.js" async></script>';
        $html .= "<script>window._wq = window._wq || []; _wq.push({\"{$shortVideoId}\": {$embedOptions}});</script>";
        $html .= '<div ' . implode(' ', $attribs) . '></div>';
        $html .= '</div>';

        return $html;
    }

    public function enhance_wistia()
    {
        $options = $this->getMergedOptions($this->getParams());
        return $this->buildEmbedHtml($options);
    }

    public function fakeDynamicResponse($embed, $options = [])
    {
        $options = $this->getMergedOptions($options);
        return $this->buildEmbedHtml($options);
    }


    /**
     * Generates a fake oEmbed response.
     *
     * @return array
     */
    public function fakeResponse()
    {

        return [
            'type'          => 'rich',
            'provider_name' => 'Wistia',
            'provider_url'  => 'https://wistia.com',
            'title'         => 'Wistia',
            'html'          => $this->enhance_wistia(),
        ];
    }

    /**
     * Fallback for modifyResponse, returns fakeResponse.
     *
     * @param array $response
     * @return array
     */
    public function modifyResponse(array $response = [])
    {
        return $this->fakeResponse();
    }
}
