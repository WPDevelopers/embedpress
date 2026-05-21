<?php

namespace EmbedPress\Providers;

use Embera\Provider\Pinterest;
use Embera\Url;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * EmbedPress Pinterest Feed provider.
 *
 * Extends Embera's Pinterest provider to add profile and board feed support
 * on top of the existing single-pin oEmbed behaviour:
 *
 *   - pinterest.com/{user}/             → profile feed (grid)
 *   - pinterest.com/{user}/{board}/     → board feed (grid)
 *   - pinterest.com/pin/{id}/           → single pin (legacy oEmbed, untouched)
 *
 * The single-pin path still flows through Embera's oEmbed endpoint. For
 * profile/board feeds we suppress the oEmbed request and emit our own HTML
 * via the embedpress_render_dynamic_content filter — same pattern used by
 * InstagramFeed.
 *
 * @package     EmbedPress
 * @subpackage  EmbedPress/Providers
 * @author      EmbedPress <help@embedpress.com>
 * @license     GPLv3 or later
 */
class PinterestFeed extends Pinterest
{
    /**
     * Suppress Embera's oEmbed HTTP request unconditionally — we render
     * single pins and feeds ourselves. Mirrors InstagramFeed's approach.
     *
     * Pinterest's oEmbed endpoint actually responds for profile URLs with a
     * generic widget iframe, so leaving this true would override our feed
     * markup with Pinterest's stock widget. The setting MUST live on the
     * class (not the constructor) — the parent constructor reads it before
     * our subclass body runs.
     *
     * @var bool
     */
    protected $shouldSendRequest = false;

    /**
     * Allowed query/shortcode params. Mirrors the attribute list documented
     * on card fbs-81329. Free params are listed first; Pro params follow and
     * are surfaced/persisted by the block UI but only honoured when the Pro
     * plugin is active.
     *
     * @var array
     */
    protected $allowedParams = [
        'maxwidth',
        'maxheight',
        // Free
        'pinLayout',
        'pinColumns',
        'pinColumnsGap',
        'pinPostsPerPage',
        'pinShowTitle',
        'pinShowDescription',
        'pinOpenIn',
        // Pro
        'pinShowSavesCount',
        'pinShowBoardName',
        'pinHeaderEnable',
        'pinProfileImage',
        'pinProfileImageUrl',
        'pinFollowersCount',
        'pinFollowBtn',
        'pinFollowBtnLabel',
        'pinLightbox',
        'pinLightboxFollowBtn',
        'pinLightboxFollowBtnLabel',
        'pinLoadmore',
        'pinLoadmoreLabel',
        'pinInfiniteScroll',
        'pinFeedType',
        'pinHashtag',
        'pinPinType',
        'pinCacheTTL',
        // Carousel passthroughs (Pro)
        'slidesShow',
        'carouselSpacing',
        'carouselAutoplay',
        'carouselArrows',
        'carouselDots',
        'carouselLoop',
    ];

    /** inline {@inheritdoc} */
    protected $httpsSupport = true;

    public function __construct($url, array $config = [])
    {
        parent::__construct($url, $config);

        // We always render Pinterest output ourselves: single pins use a
        // direct iframe to Pinterest's embed.html, and profile/board URLs
        // use our feed container. shouldSendRequest = false (above) stops
        // Embera from making the upstream oEmbed call.
        add_filter('embedpress_render_dynamic_content', [$this, 'fakeDynamicResponse'], 10, 2);
    }

    public function getAllowedParams()
    {
        return $this->allowedParams;
    }

    /**
     * Case-insensitive param resolution. shortcode_parse_atts() lowercases
     * attribute names, so [embedpress pinLayout="grid"] arrives as
     * `pinlayout`. The default ProviderAdapter::getParams() uses case-
     * sensitive lookups against the camelCase allowedParams list, which
     * would drop every lowercased shortcode attribute. Mirrors the override
     * in InstagramFeed.
     */
    public function getParams()
    {
        $params = parent::getParams();
        foreach ($this->allowedParams as $allowed) {
            if (isset($params[$allowed])) {
                continue;
            }
            foreach ($this->config as $key => $value) {
                if (strcasecmp($key, $allowed) === 0) {
                    $params[$allowed] = $value;
                    break;
                }
            }
        }
        return $params;
    }

    /** inline {@inheritdoc} */
    public function validateUrl(Url $url)
    {
        $str = (string) $url;
        return $this->isSinglePinUrl($str)
            || $this->isProfileUrl($str)
            || $this->isBoardUrl($str);
    }

    /**
     * /pin/{id}/ — kept on the legacy oEmbed path.
     */
    public function isSinglePinUrl($url)
    {
        return (bool) preg_match(
            '~^https?://(?:[a-z]{2,3}\.)?pinterest\.[a-z.]+/pin/[0-9]+/?$~i',
            (string) $url
        );
    }

    /**
     * pinterest.com/{user}/ — profile feed.
     */
    public function isProfileUrl($url)
    {
        return (bool) preg_match(
            '~^https?://(?:[a-z]{2,3}\.)?pinterest\.[a-z.]+/[a-zA-Z0-9_\.\-]+/?$~i',
            (string) $url
        );
    }

    /**
     * pinterest.com/{user}/{board}/ — board feed.
     */
    public function isBoardUrl($url)
    {
        return (bool) preg_match(
            '~^https?://(?:[a-z]{2,3}\.)?pinterest\.[a-z.]+/[a-zA-Z0-9_\.\-]+/[a-zA-Z0-9_\-]+/?$~i',
            (string) $url
        );
    }

    /**
     * True for any URL that should render as a feed grid (profile or board),
     * false for single pin or anything else.
     */
    public function isFeedUrl($url)
    {
        $str = (string) $url;
        if ($this->isSinglePinUrl($str)) {
            return false;
        }
        return $this->isProfileUrl($str) || $this->isBoardUrl($str);
    }

    /**
     * Extract the Pinterest username from a profile or board URL.
     */
    public function getUsername($url)
    {
        if (preg_match('~pinterest\.[a-z.]+/([a-zA-Z0-9_\.\-]+)(?:/|$)~i', (string) $url, $m)) {
            return $m[1];
        }
        return '';
    }

    /**
     * Extract the board slug from a board URL, or '' for profile URLs.
     */
    public function getBoardSlug($url)
    {
        if ($this->isBoardUrl((string) $url)
            && preg_match('~pinterest\.[a-z.]+/[a-zA-Z0-9_\.\-]+/([a-zA-Z0-9_\-]+)/?$~i', (string) $url, $m)
        ) {
            return $m[1];
        }
        return '';
    }

    /**
     * Dynamic-content render path. Branches on URL shape:
     *
     *   - single pin (`/pin/{id}/`) → emit Pinterest's standard embed iframe
     *     directly, skipping the oEmbed roundtrip
     *   - profile / board → emit our `.ep-pinterest-feed` container that
     *     `static/js/pinterest-feed.js` hydrates from the REST endpoint
     */
    public function fakeDynamicResponse($html, $params)
    {
        $url = isset($params['url']) ? $params['url'] : '';

        if ($this->isSinglePinUrl($url)) {
            return [
                'html'          => $this->renderSinglePinIframe($url, (array) $params),
                'provider_name' => 'Pinterest',
            ];
        }

        if (!$this->isFeedUrl($url)) {
            return $html;
        }

        $params = $this->getParams() + (array) $params;
        $template = $this->getPinterestFeedTemplate($url, $params);

        return [
            'html'          => $template,
            'provider_name' => 'Pinterest Feed',
        ];
    }

    /**
     * Build the iframe markup for a single pin without contacting Pinterest's
     * oEmbed endpoint. Pinterest's public embed widget URL is stable:
     *
     *   https://assets.pinterest.com/ext/embed.html?id={PIN_ID}
     */
    public function renderSinglePinIframe($url, array $params = [])
    {
        if (!preg_match('~pinterest\.[a-z.]+/pin/([0-9]+)~i', (string) $url, $m)) {
            return '';
        }
        $pin_id = $m[1];
        $width  = isset($params['maxwidth'])  ? (int) $params['maxwidth']  : 345;
        $height = isset($params['maxheight']) ? (int) $params['maxheight'] : 480;

        $src = 'https://assets.pinterest.com/ext/embed.html?id=' . rawurlencode($pin_id);

        return sprintf(
            '<iframe src="%s" width="%d" height="%d" frameborder="0" scrolling="no" allowtransparency="true" allowfullscreen="true" title="Pinterest Pin"></iframe>',
            \esc_url($src),
            $width,
            $height
        );
    }

    /**
     * Render the feed container. Header card, boards filter, pin items
     * are all painted client-side by static/js/pinterest-feed.js once it
     * fetches `/wp-json/embedpress/v1/pinterest-feed`. The server only
     * emits the skeleton frame so the layout is stable while data loads
     * and the JSON-LD / SEO crawlers still see a meaningful structure.
     */
    public function getPinterestFeedTemplate($url, array $params = [])
    {
        $username = $this->getUsername($url);
        $board    = $this->getBoardSlug($url);
        $feedType = $board ? 'board' : 'profile';

        $columns         = isset($params['pinColumns'])      ? max(1, min(6, (int) $params['pinColumns'])) : 3;
        $gap             = isset($params['pinColumnsGap'])   ? max(0, (int) $params['pinColumnsGap'])       : 16;
        $posts_per_page  = isset($params['pinPostsPerPage']) ? max(1, min(50, (int) $params['pinPostsPerPage'])) : 12;
        $layout          = isset($params['pinLayout']) ? \sanitize_html_class($params['pinLayout']) : 'masonry';

        // Default to masonry — the layout Pinterest is known for. Grid
        // remains opt-in for users who want uniform tiles.
        if (!in_array($layout, ['masonry', 'grid', 'carousel', 'justified'], true)) {
            $layout = 'masonry';
        }

        // Elementor's convert_settings coerces every unset switcher to the
        // literal string 'false', WP shortcodes can deliver '0', '', or
        // 'no' — so a single uniform truthy check.
        $is_truthy = function ($v) {
            return !($v === '' || $v === null || $v === false || $v === 'false' || $v === '0' || $v === 0 || $v === 'no');
        };

        $data = [
            'feedType'        => $feedType,
            'username'        => $username,
            'board'           => $board,
            'layout'          => $layout,
            'columns'         => $columns,
            'gap'             => $gap,
            'postsPerPage'    => $posts_per_page,
            // The header (avatar + name + followers) and the boards filter
            // strip are the core Pinterest-feel experience — render them
            // unconditionally. The pinHeaderEnable / pinFiltersEnable
            // toggles surface in Pro to opt out, but free always shows.
            'showHeader'      => true,
            'showFilters'     => true,
            // Title / description / board-name overlays remain opt-in.
            'showTitle'       => isset($params['pinShowTitle']) ? $is_truthy($params['pinShowTitle']) : true,
            'showDescription' => $is_truthy($params['pinShowDescription'] ?? null),
            'showBoardName'   => $is_truthy($params['pinShowBoardName'] ?? null),
            'openIn'          => isset($params['pinOpenIn']) && $params['pinOpenIn'] === 'same-tab' ? 'same-tab' : 'new-tab',
            'profileUrl'      => 'https://www.pinterest.com/' . $username . '/',
        ];

        $columns_style = sprintf('--ep-pin-columns: %d; --ep-pin-gap: %dpx;', $columns, $gap);

        ob_start(); ?>
<div class="ep-pinterest-feed ep-pinterest-feed--<?php echo esc_attr($layout); ?>"
     data-feed="<?php echo esc_attr(wp_json_encode($data)); ?>"
     style="<?php echo esc_attr($columns_style); ?>">

    <header class="ep-pinterest-feed__header" data-ep-header hidden>
        <div class="ep-pinterest-feed__header-avatar">
            <img alt="" data-ep-avatar />
        </div>
        <div class="ep-pinterest-feed__header-body">
            <h3 class="ep-pinterest-feed__header-name" data-ep-name></h3>
            <a class="ep-pinterest-feed__header-handle" data-ep-handle target="_blank" rel="noopener"></a>
            <p class="ep-pinterest-feed__header-about" data-ep-about hidden></p>
            <ul class="ep-pinterest-feed__header-stats" data-ep-stats></ul>
            <div class="ep-pinterest-feed__header-actions">
                <a class="ep-pinterest-feed__follow-btn" data-ep-follow target="_blank" rel="noopener">
                    <?php \esc_html_e('Follow', 'embedpress'); ?>
                </a>
            </div>
        </div>
    </header>

    <nav class="ep-pinterest-feed__filters" data-ep-filters hidden></nav>

    <div class="ep-pinterest-feed__masonry" data-ep-grid>
        <?php for ($i = 0; $i < $posts_per_page; $i++) : ?>
            <div class="ep-pinterest-feed__skeleton" aria-hidden="true"
                 style="--ep-skeleton-h: <?php echo esc_attr(220 + (($i * 53) % 180)); ?>px"></div>
        <?php endfor; ?>
    </div>

    <div class="ep-pinterest-feed__empty" hidden>
        <?php \esc_html_e('No pins found.', 'embedpress'); ?>
    </div>

    <div class="ep-pinterest-feed__error" data-ep-error hidden></div>
</div>
<?php
        return ob_get_clean();
    }

    /** inline {@inheritdoc} */
    public function getFakeResponse()
    {
        return [
            'type'          => 'rich',
            'provider_name' => 'Pinterest Feed',
            'provider_url'  => 'https://pinterest.com',
            'title'         => 'Pinterest Feed',
            'html'          => '',
        ];
    }

    /**
     * Embera calls this when shouldSendRequest === false (which it always
     * is on PinterestFeed). The Shortcode / Elementor render paths use the
     * returned `html` directly — this is what surfaces the feed grid for
     * front-end renders, the editor preview, and shortcode embeds.
     *
     * The Gutenberg block renderer also fires `embedpress_render_dynamic_content`
     * elsewhere, but Shortcode/Elementor do not — so we must produce the
     * complete HTML here rather than rely on the dynamic-content filter.
     */
    public function getStaticResponse()
    {
        $url    = $this->getUrl();
        $params = $this->getParams();

        if ($this->isSinglePinUrl((string) $url)) {
            return [
                'type'          => 'rich',
                'provider_name' => 'Pinterest',
                'provider_url'  => 'https://pinterest.com',
                'title'         => 'Pinterest Pin',
                'html'          => $this->renderSinglePinIframe((string) $url, $params),
            ];
        }

        if ($this->isFeedUrl((string) $url)) {
            return [
                'type'          => 'rich',
                'provider_name' => 'Pinterest Feed',
                'provider_url'  => 'https://pinterest.com',
                'title'         => 'Pinterest Feed',
                'html'          => $this->getPinterestFeedTemplate((string) $url, $params),
            ];
        }

        return $this->getFakeResponse();
    }
}
