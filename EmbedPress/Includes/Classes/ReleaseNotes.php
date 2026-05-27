<?php
namespace EmbedPress\Includes\Classes;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Release Notes
 *
 * Hybrid release-notes system:
 *   - Monthly digest entries (default cadence — one tooltip per month max)
 *   - Major-version overrides (X.0.0 bumps get a dedicated hero)
 *
 * Adds an admin page (?page=embedpress-release-notes) and pipes announcements
 * through FeatureNoticeManager so the existing menu-anchored tooltip is reused.
 *
 * @since 4.5.5
 *
 * ---------------------------------------------------------------------------
 * EDITORIAL WORKFLOW — when shipping a new release-notes entry, follow the
 * `embedpress-release-notes` skill (~/.claude/skills/embedpress-release-notes/).
 * It covers: which array to edit (monthly vs major), the story field reference,
 * screenshot conventions, tooltip-refire mechanics, the per-release checklist,
 * and the 3-minute local verification loop.
 *
 * Sibling skills:
 *   - `embedpress-release`     — version bump + changelog + .pot (free)
 *   - `embedpress-pro-release` — version bump + changelog + .pot (Pro)
 *
 * This file is the implementation; that skill is the playbook.
 * ---------------------------------------------------------------------------
 */
class ReleaseNotes
{
    const PAGE_SLUG          = 'embedpress-release-notes';
    const SEEN_VERSION_OPT   = 'embedpress_last_seen_version';
    const USAGE_CACHE_KEY    = 'embedpress_release_notes_top_category';
    const USAGE_CACHE_TTL    = 86400; // 1 day in seconds (DAY_IN_SECONDS — inlined to be class-const safe)

    /** @var ReleaseNotes */
    private static $instance = null;

    public static function get_instance()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct()
    {
        add_action('admin_init', [$this, 'register_release_notice'], 5);
        add_action('admin_menu', [$this, 'register_menu'], 100);
    }

    /**
     * Monthly release-notes digest.
     *
     * Add one entry per month. Each entry aggregates whatever shipped that month
     * (any number of patches / minors / hotfixes). `announce: false` keeps it on
     * the Release Notes page but skips the tooltip.
     *
     * Keyed by YYYY-MM so the active month is trivial to look up.
     */
    public static function monthly_releases()
    {
        return [
            '2026-05' => [
                'label'    => 'May 2026',
                'headline' => 'Player & Engagement, Broken Embeds, and a Google Calendar overhaul',
                'announce' => true,
                'versions' => ['4.5.2', '4.5.3', '4.5.4'],
                'stories'  => [
                    [
                        'icon'   => '🎬',
                        'title'  => 'Player & Engagement suite',
                        'desc'   => 'The Custom Player grew up. Capture emails mid-video, lock viewers in until a chosen timestamp, fire timed CTAs, jump between chapters, auto-resume on return, and track completions per user — all on top of YouTube, Vimeo, Wistia, and self-hosted video.',
                        'image'  => '',
                        'is_pro' => true,
                        'cta'    => ['label' => 'Open Player & Engagement', 'url' => admin_url('admin.php?page=embedpress&page_type=settings')],
                    ],
                    [
                        'icon'   => '🔍',
                        'title'  => 'Broken Embeds Detector',
                        'desc'   => 'A new scanner sweeps every tracked embed URL and surfaces the dead ones in a sortable dashboard table — with a status filter, oEmbed-first probing, and same-origin smarts that keep false positives out.',
                        'image'  => '',
                        'is_pro' => true,
                        'cta'    => ['label' => 'See broken embeds', 'url' => admin_url('admin.php?page=embedpress&page_type=analytics')],
                    ],
                    [
                        'icon'   => '📅',
                        'title'  => 'Google Calendar, rebuilt',
                        'desc'   => 'Replaced the JSON-upload flow with a clean Client ID + Secret form, restored private-calendar rendering inside Gutenberg and Elementor editors, and gave the calendar UI a modern theme-proof refresh.',
                        'image'  => '',
                        'is_pro' => false,
                        'cta'    => ['label' => 'Configure Google Calendar', 'url' => admin_url('admin.php?page=embedpress&page_type=settings')],
                    ],
                    [
                        'icon'   => '📸',
                        'title'  => 'Instagram feeds get Masonry, Carousel & Justify',
                        'desc'   => 'The Instagram shortcode generator now ships Masonry, Carousel, and Justified layouts, a roomier mobile popup, and a load-more flow that actually works on busy feeds.',
                        'image'  => '',
                        'is_pro' => false,
                    ],
                    [
                        'icon'   => '📄',
                        'title'  => 'Dynamic Source for PDF embeds',
                        'desc'   => 'Wire PDF embeds to Elementor Dynamic Tags — pull the file from an ACF field, custom field, or any registered dynamic source. No more hard-coded URLs per template.',
                        'image'  => '',
                        'is_pro' => true,
                    ],
                    [
                        'icon'   => '🔒',
                        'title'  => 'Security & i18n hardening',
                        'desc'   => 'Three CVEs closed (stored XSS in block URLs, escaped YouTube API output, plugged a Google Calendar info-disclosure path), the textdomain now loads on the right hook, and every React app is wired for WPML and Loco translations.',
                        'image'  => '',
                        'is_pro' => false,
                    ],
                ],
            ],
            // '2026-06' => [
            //     'label'    => 'June 2026',
            //     'headline' => 'Cinematic previews + faster PDFs',
            //     'announce' => true,
            //     'versions' => ['4.5.5', '4.5.6'],
            //     'stories'  => [
            //         [
            //             'title'  => 'Netflix-style cinematic preview',
            //             'desc'   => 'Drop a hero overlay over any video embed — autoplay-on-hover, custom poster, mute toggle.',
            //             'image'  => 'release-notes/cinematic.png',
            //             'is_pro' => true,
            //             'cta'    => ['label' => 'Try it', 'url' => 'admin.php?page=embedpress&page_type=settings'],
            //         ],
            //     ],
            // ],
        ];
    }

    /**
     * Major-version override stories.
     *
     * Keyed by version. A major bump (X.0.0 → next X.0.0) shows the matching
     * hero instead of the monthly digest. Falls back to monthly when missing.
     */
    public static function major_releases()
    {
        return [
            // '5.0.0' => [
            //     'label'    => 'EmbedPress 5.0',
            //     'headline' => 'The biggest EmbedPress release ever',
            //     'announce' => true,
            //     'hero'     => 'release-notes/5.0-hero.png',
            //     'stories'  => [],
            // ],
        ];
    }

    /**
     * Detect a version bump and register the appropriate announcement notice
     * through FeatureNoticeManager. Idempotent — won't re-announce something
     * the user has already seen (tracked in SEEN_ANNOUNCE_OPT).
     */
    public function register_release_notice()
    {
        $current  = defined('EMBEDPRESS_VERSION') ? EMBEDPRESS_VERSION : '0.0.0';
        $previous = get_option(self::SEEN_VERSION_OPT, '');

        // First install — record the version, don't announce anything until
        // the user actually goes through an upgrade cycle.
        if (empty($previous)) {
            update_option(self::SEEN_VERSION_OPT, $current);
            return;
        }

        if ($previous !== $current) {
            update_option(self::SEEN_VERSION_OPT, $current);
        }

        $picked = $this->pick_active_entry($current, $previous);
        if (!$picked) {
            return;
        }

        list($kind, $key, $entry) = $picked;
        if (empty($entry['announce'])) {
            return;
        }

        $notice_id = 'release_notes_' . $kind . '_' . str_replace(['.', '-'], '_', $key);
        $end_date  = !empty($entry['expires'])
            ? $entry['expires']
            : gmdate('Y-m-d', strtotime('+30 days'));

        FeatureNoticeManager::get_instance()->register_notice($notice_id, [
            'title'       => __('Release Notes', 'embedpress'),
            'message'     => sprintf(
                '<strong>%s</strong><br>%s',
                esc_html($entry['label']),
                esc_html($entry['headline'])
            ),
            'button_text' => __('Read release notes', 'embedpress'),
            'button_url'  => admin_url('admin.php?page=' . self::PAGE_SLUG),
            'skip_text'   => __('Later', 'embedpress'),
            'capability'  => 'manage_options',
            'end_date'    => $end_date,
            'priority'    => 1, // beat seasonal/marketing notices
            'type'        => 'info',
        ]);
    }

    /**
     * Hybrid pick: major-version override beats monthly digest.
     * Returns [kind, key, entry] or null.
     */
    private function pick_active_entry($current, $previous)
    {
        // Major bump → use the major-release override if defined.
        $majors = self::major_releases();
        if ($this->is_major_bump($previous, $current) && isset($majors[$current])) {
            return ['major', $current, $majors[$current]];
        }

        // Otherwise fall back to current-month digest.
        $monthly = self::monthly_releases();
        $ym = gmdate('Y-m');
        if (isset($monthly[$ym])) {
            return ['monthly', $ym, $monthly[$ym]];
        }

        return null;
    }

    private function is_major_bump($previous, $current)
    {
        if (empty($previous)) {
            return false;
        }
        $p = (int) explode('.', $previous)[0];
        $c = (int) explode('.', $current)[0];
        return $c > $p;
    }

    public function register_menu()
    {
        add_submenu_page(
            'embedpress',
            __('EmbedPress Release Notes', 'embedpress'),
            __('Release Notes', 'embedpress'),
            'manage_options',
            self::PAGE_SLUG,
            [$this, 'render_page']
        );
    }

    public function render_page()
    {
        $monthly = self::monthly_releases();
        $majors  = self::major_releases();

        // Sort newest-first.
        krsort($monthly);
        uksort($majors, 'version_compare');
        $majors = array_reverse($majors, true);

        $current_ym      = gmdate('Y-m');
        $current_version = defined('EMBEDPRESS_VERSION') ? EMBEDPRESS_VERSION : '';
        $is_pro          = class_exists('\EmbedPress\Includes\Classes\Helper')
            && Helper::is_pro_active();

        $featured = null;
        if (!empty($majors[$current_version])) {
            $featured = ['kind' => 'major', 'key' => $current_version, 'entry' => $majors[$current_version]];
        } elseif (!empty($monthly[$current_ym])) {
            $featured = ['kind' => 'monthly', 'key' => $current_ym, 'entry' => $monthly[$current_ym]];
        } elseif (!empty($monthly)) {
            $first_key = array_key_first($monthly);
            $featured  = ['kind' => 'monthly', 'key' => $first_key, 'entry' => $monthly[$first_key]];
        }

        ?>
        <div class="embedpress-release-notes">
            <div class="ep-rn-pageheader">
                <div>
                    <h1 class="ep-rn-pageheader__title"><?php esc_html_e('EmbedPress Release Notes', 'embedpress'); ?></h1>
                    <p class="ep-rn-pageheader__subtitle">
                        <?php esc_html_e('Monthly digests, major-version highlights, and what\'s coming next.', 'embedpress'); ?>
                    </p>
                </div>
            </div>
            <div class="ep-rn-layout">
                <main class="ep-rn-main">
                    <?php if ($featured) : ?>
                        <?php $this->render_release($featured['entry'], true); ?>
                    <?php else : ?>
                        <div class="ep-rn-empty">
                            <h1><?php esc_html_e('Nothing new — yet.', 'embedpress'); ?></h1>
                            <p><?php esc_html_e('We ship monthly release notes. Check back at the start of next month.', 'embedpress'); ?></p>
                        </div>
                    <?php endif; ?>

                    <?php
                    // Previous entries — collapse oldest behind a button.
                    $past = $monthly;
                    if ($featured && $featured['kind'] === 'monthly') {
                        unset($past[$featured['key']]);
                    }
                    if (!empty($past)) :
                    ?>
                        <section class="ep-rn-past">
                            <h2><?php esc_html_e('Previous releases', 'embedpress'); ?></h2>
                            <?php foreach ($past as $entry) : ?>
                                <?php $this->render_release($entry, false); ?>
                            <?php endforeach; ?>
                        </section>
                    <?php endif; ?>

                    <p class="ep-rn-changelog-link">
                        <?php
                        printf(
                            /* translators: %s = link to wordpress.org changelog */
                            esc_html__('Looking for the full technical changelog? %s', 'embedpress'),
                            '<a href="https://wordpress.org/plugins/embedpress/#developers" target="_blank" rel="noopener">'
                            . esc_html__('View it on WordPress.org', 'embedpress') . '</a>'
                        );
                        ?>
                    </p>
                </main>

                <aside class="ep-rn-sidebar">
                    <?php $this->render_sidebar($is_pro); ?>
                </aside>
            </div>
        </div>
        <?php
    }

    private function render_release($entry, $is_featured)
    {
        $label    = isset($entry['label']) ? $entry['label'] : '';
        $headline = isset($entry['headline']) ? $entry['headline'] : '';
        $stories  = isset($entry['stories']) ? $entry['stories'] : [];
        ?>
        <article class="ep-rn-release <?php echo $is_featured ? 'is-featured' : ''; ?>">
            <header class="ep-rn-release__header">
                <span class="ep-rn-release__label"><?php echo esc_html($label); ?></span>
                <?php if ($headline) : ?>
                    <h1 class="ep-rn-release__headline"><?php echo esc_html($headline); ?></h1>
                <?php endif; ?>
            </header>

            <?php if (!empty($stories)) : ?>
                <div class="ep-rn-stories">
                    <?php foreach ($stories as $i => $story) : ?>
                        <?php $this->render_story($story, (int) $i); ?>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </article>
        <?php
    }

    private function render_story($story, $index = 0)
    {
        $icon   = isset($story['icon']) ? $story['icon'] : '';
        $title  = isset($story['title']) ? $story['title'] : '';
        $desc   = isset($story['desc']) ? $story['desc'] : '';
        $image  = isset($story['image']) ? $story['image'] : '';
        $is_pro = !empty($story['is_pro']);
        $cta    = isset($story['cta']) ? $story['cta'] : null;
        $src    = $image
            ? (preg_match('#^https?://#', $image) ? $image : EMBEDPRESS_URL_ASSETS . 'images/' . ltrim($image, '/'))
            : '';

        // Rotate accent color across stories so the page has visual rhythm.
        $accents = ['violet', 'teal', 'amber', 'rose', 'sky', 'lime'];
        $accent  = $accents[$index % count($accents)];

        $row_classes  = ['ep-rn-story'];
        $row_classes[] = 'ep-rn-story--' . $accent;
        if (!$src) {
            $row_classes[] = 'ep-rn-story--no-media';
        }
        ?>
        <article class="<?php echo esc_attr(implode(' ', $row_classes)); ?>">
            <div class="ep-rn-story__icon" aria-hidden="true">
                <span><?php echo $icon ? esc_html($icon) : '✨'; ?></span>
            </div>

            <?php if ($src) : ?>
                <div class="ep-rn-story__media">
                    <img src="<?php echo esc_url($src); ?>" alt="<?php echo esc_attr($title); ?>" loading="lazy" />
                </div>
            <?php endif; ?>

            <div class="ep-rn-story__body">
                <div class="ep-rn-story__tags">
                    <?php if ($is_pro) : ?>
                        <span class="ep-rn-pill ep-rn-pill--pro">PRO</span>
                    <?php else : ?>
                        <span class="ep-rn-pill ep-rn-pill--free">FREE</span>
                    <?php endif; ?>
                </div>
                <h3 class="ep-rn-story__title"><?php echo esc_html($title); ?></h3>
                <p class="ep-rn-story__desc"><?php echo esc_html($desc); ?></p>
                <?php if ($cta && !empty($cta['url']) && !empty($cta['label'])) : ?>
                    <a class="ep-rn-story__cta"
                       href="<?php echo esc_url($cta['url']); ?>"
                       <?php echo !empty($cta['external']) ? 'target="_blank" rel="noopener"' : ''; ?>>
                        <?php echo esc_html($cta['label']); ?>
                        <span class="ep-rn-story__cta-arrow" aria-hidden="true">&rarr;</span>
                    </a>
                <?php endif; ?>
            </div>
        </article>
        <?php
    }

    private function render_sidebar($is_pro)
    {
        if ($is_pro) {
            ?>
            <div class="ep-rn-sidebar-card ep-rn-sidebar-card--thanks">
                <h3><?php esc_html_e('Thanks for being on Pro 💜', 'embedpress'); ?></h3>
                <p><?php esc_html_e('Your subscription powers everything you see here. Got an idea for the next release?', 'embedpress'); ?></p>
                <a class="ep-rn-btn ep-rn-btn--secondary"
                   href="https://embedpress.com/contact/"
                   target="_blank" rel="noopener">
                    <?php esc_html_e('Share feedback', 'embedpress'); ?>
                </a>
            </div>
            <?php
            return;
        }

        $usage    = self::detect_top_usage();
        $category = $usage['category'];
        $provider = $usage['provider'];
        $rec      = self::pro_recommendations();
        $bucket   = isset($rec[$category]) ? $rec[$category] : $rec['general'];
        $is_personalized = $category !== 'general';
        $category_label  = self::category_label($category);

        // Lead with provider-specific Pro inspector controls when the top
        // provider has any; pad with universal features from the category
        // bucket so the list still feels complete (max 6 bullets).
        $controls_map     = self::provider_controls();
        $provider_specific = (!empty($provider) && isset($controls_map[$provider]))
            ? $controls_map[$provider]
            : [];
        $merged = array_values(array_unique(array_merge($provider_specific, $bucket['features'])));
        $merged = array_slice($merged, 0, 6);
        ?>
        <div class="ep-rn-sidebar-card ep-rn-sidebar-card--upsell">
            <span class="ep-rn-sidebar-card__eyebrow">
                <?php echo $is_personalized
                    ? esc_html(sprintf(__('For your %s', 'embedpress'), $category_label))
                    : esc_html__('Upgrade', 'embedpress'); ?>
            </span>
            <h3><?php echo esc_html($bucket['headline']); ?></h3>
            <ul class="ep-rn-features">
                <?php foreach ($merged as $feature) : ?>
                    <li><?php echo esc_html($feature); ?></li>
                <?php endforeach; ?>
            </ul>
            <?php if ($is_personalized) : ?>
                <p class="ep-rn-sidebar-card__hint">
                    <?php
                    printf(
                        /* translators: %s = embed category, e.g. "video embeds" */
                        esc_html__('Recommended because you use %s on this site.', 'embedpress'),
                        '<strong>' . esc_html($category_label) . '</strong>'
                    );
                    ?>
                </p>
            <?php endif; ?>
            <a class="ep-rn-btn ep-rn-btn--primary"
               href="https://embedpress.com/pricing/?utm_source=plugin&amp;utm_medium=release-notes&amp;utm_campaign=upgrade&amp;utm_content=<?php echo esc_attr($category); ?>"
               target="_blank" rel="noopener">
                <?php esc_html_e('Upgrade to Pro', 'embedpress'); ?>
            </a>
            <a class="ep-rn-link"
               href="https://embedpress.com/features/?utm_source=plugin&amp;utm_medium=release-notes&amp;utm_campaign=features"
               target="_blank" rel="noopener">
                <?php esc_html_e('See all Pro features', 'embedpress'); ?> &rarr;
            </a>
        </div>

        <div class="ep-rn-sidebar-card ep-rn-sidebar-card--secondary">
            <h4><?php esc_html_e('Stay in the loop', 'embedpress'); ?></h4>
            <p><?php esc_html_e('Get release notes by email — one short summary per month, no spam.', 'embedpress'); ?></p>
            <a class="ep-rn-link"
               href="https://embedpress.com/newsletter/"
               target="_blank" rel="noopener">
                <?php esc_html_e('Subscribe', 'embedpress'); ?> &rarr;
            </a>
        </div>
        <?php
    }

    /**
     * Map an analytics `embed_type` to a high-level category we can pitch
     * Pro features against (video / pdf / document / social / maps / 3d / audio).
     */
    public static function category_for_embed_type($type)
    {
        static $map = null;
        if ($map === null) {
            $map = [
                // Video
                'youtube' => 'video', 'youtubechannel' => 'video', 'youtubelive' => 'video', 'youtubeshort' => 'video',
                'vimeo' => 'video', 'wistia' => 'video', 'twitch' => 'video', 'dailymotion' => 'video',
                'vidyard' => 'video', 'animotion' => 'video', 'ted' => 'video', 'rumble' => 'video',
                // PDF
                'pdf' => 'pdf', 'document_pdf' => 'pdf', 'pdfgallery' => 'pdf',
                'embedpress-pdf' => 'pdf', 'embedpress-pdf-gallery' => 'pdf',
                // Office docs
                'document' => 'document', 'googledocs' => 'document', 'googlesheets' => 'document',
                'googleslides' => 'document', 'googledrawings' => 'document', 'googleforms' => 'document',
                'googledrive' => 'document',
                // Social
                'pinterest' => 'social', 'pinterestfeed' => 'social', 'instagram' => 'social',
                'facebook' => 'social', 'twitter' => 'social', 'x' => 'social',
                'tiktok' => 'social', 'reddit' => 'social', 'linkedin' => 'social',
                // Maps / calendar
                'googlemaps' => 'maps', 'googlecalendar' => 'maps',
                // 3D / interactive
                'sketchfab' => '3d', 'codepen' => '3d',
                // Audio
                'spotify' => 'audio', 'soundcloud' => 'audio',
                'apple-podcasts' => 'audio', 'mixcloud' => 'audio',
            ];
        }
        $key = strtolower((string) $type);
        return isset($map[$key]) ? $map[$key] : 'general';
    }

    /**
     * Detect the user's most-used embed category from the analytics table.
     * Cached for 24h to avoid scanning on every page render.
     * Falls back to 'general' when there's no usage data yet.
     */
    public static function detect_top_category()
    {
        $data = self::detect_top_usage();
        return $data['category'];
    }

    /**
     * Returns ['category' => 'video', 'provider' => 'youtube'] (both lowercase),
     * detected from the analytics table. Cached for 24h.
     * Falls back to 'general' / '' when there's no usage data yet.
     */
    public static function detect_top_usage()
    {
        $cached = get_transient(self::USAGE_CACHE_KEY);
        if (is_array($cached) && isset($cached['category'], $cached['provider'])) {
            return $cached;
        }

        global $wpdb;
        $table = $wpdb->prefix . 'embedpress_analytics_content';
        $result = ['category' => 'general', 'provider' => ''];

        $exists = $wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $table));
        if ($exists === $table) {
            $rows = $wpdb->get_results(
                "SELECT embed_type, COUNT(*) AS n FROM {$table} GROUP BY embed_type",
                ARRAY_A
            );
            if (!empty($rows)) {
                $by_cat = [];
                $by_provider = [];
                foreach ($rows as $row) {
                    $type = strtolower((string) $row['embed_type']);
                    $cat  = self::category_for_embed_type($row['embed_type']);
                    $n    = (int) $row['n'];

                    if (!isset($by_cat[$cat])) {
                        $by_cat[$cat] = 0;
                    }
                    $by_cat[$cat] += $n;

                    if ($cat !== 'general') {
                        if (!isset($by_provider[$type])) {
                            $by_provider[$type] = 0;
                        }
                        $by_provider[$type] += $n;
                    }
                }
                unset($by_cat['general']);
                if (!empty($by_cat)) {
                    arsort($by_cat);
                    $result['category'] = (string) array_key_first($by_cat);
                }
                if (!empty($by_provider)) {
                    arsort($by_provider);
                    $result['provider'] = (string) array_key_first($by_provider);
                }
            }
        }

        set_transient(self::USAGE_CACHE_KEY, $result, self::USAGE_CACHE_TTL);
        return $result;
    }

    /**
     * Provider-specific Pro inspector controls — short, scannable names that
     * mirror what the user would see (or see disabled with "[Pro]") in the
     * block inspector for that provider.
     *
     * Source: embedpress-pro/Gutenberg/src/filters/*.js — the `controlName ==`
     * branches in each filter file.
     */
    public static function provider_controls()
    {
        return [
            // Video
            'youtube' => [
                __('Custom player preset & color', 'embedpress'),
                __('Closed captions & modest branding', 'embedpress'),
                __('Sticky video on scroll', 'embedpress'),
                __('Cinematic preview overlay', 'embedpress'),
                __('Email capture, chapters & end screen', 'embedpress'),
            ],
            'youtubechannel' => [
                __('Custom player preset & color', 'embedpress'),
                __('Sticky video on scroll', 'embedpress'),
                __('Cinematic preview overlay', 'embedpress'),
            ],
            'vimeo' => [
                __('Loop, auto-pause & DNT controls', 'embedpress'),
                __('Cinematic preview overlay', 'embedpress'),
                __('Custom branded player', 'embedpress'),
                __('Email capture, chapters & end screen', 'embedpress'),
            ],
            'wistia' => [
                __('Captions & volume controls', 'embedpress'),
                __('Cinematic preview overlay', 'embedpress'),
                __('Custom branded player', 'embedpress'),
                __('Email capture, chapters & end screen', 'embedpress'),
            ],
            'twitch' => [
                __('Show chat alongside the player', 'embedpress'),
                __('Custom branded player', 'embedpress'),
                __('Sticky video on scroll', 'embedpress'),
            ],
            'dailymotion' => [
                __('Custom branded player', 'embedpress'),
                __('Cinematic preview overlay', 'embedpress'),
                __('Email capture & timed CTAs', 'embedpress'),
            ],
            // PDF
            'pdf' => [
                __('PDF watermark (text, color, opacity)', 'embedpress'),
                __('Toolbar: print, download, draw, copy', 'embedpress'),
                __('Logo & CTA overlay', 'embedpress'),
                __('Password & role protection', 'embedpress'),
            ],
            'document_pdf' => [
                __('PDF watermark (text, color, opacity)', 'embedpress'),
                __('Toolbar: print, download, draw, copy', 'embedpress'),
                __('Logo & CTA overlay', 'embedpress'),
                __('Password & role protection', 'embedpress'),
            ],
            'pdfgallery' => [
                __('Bookshelf layout (Pro)', 'embedpress'),
                __('PDF watermark per item', 'embedpress'),
                __('Logo & CTA overlay', 'embedpress'),
            ],
            // Documents
            'document' => [
                __('Office Online viewer (DOCX/PPTX/XLSX)', 'embedpress'),
                __('Toolbar: print, download', 'embedpress'),
                __('Logo & CTA overlay', 'embedpress'),
                __('Password & role protection', 'embedpress'),
            ],
            // Social
            'instagram' => [
                __('Instagram profile image', 'embedpress'),
                __('Feed tab toggle', 'embedpress'),
                __('Likes & comments counts', 'embedpress'),
            ],
            // Audio
            'spreaker' => [
                __('Disable download', 'embedpress'),
                __('Continuous playlist', 'embedpress'),
                __('Loop playlist', 'embedpress'),
            ],
            // Other
            'opensea' => [
                __('Custom labels (price, rank, details)', 'embedpress'),
                __('Items per page & load more', 'embedpress'),
                __('Text & accent color', 'embedpress'),
            ],
            'calendly' => [
                __('Hide event type details', 'embedpress'),
                __('Hide cookie banner', 'embedpress'),
                __('Brand color override', 'embedpress'),
            ],
        ];
    }

    /**
     * Per-category Pro upsell content.
     *
     * Each bullet is a short, scannable feature name (3-6 words) — the kind
     * of thing a user can recognise at a glance, not a marketing sentence.
     * Order: provider-specific Pro inspector controls first, universal Pro
     * features (Showcase Ads, Content Protection, Lazy Load, advanced
     * Analytics) after.
     *
     * Source of truth for provider-specific controls:
     *   embedpress-pro/Gutenberg/src/filters/*.js
     */
    public static function pro_recommendations()
    {
        return [
            'video' => [
                'headline' => __('Make every video a hero', 'embedpress'),
                'features' => [
                    __('Branded video player (Plyr)', 'embedpress'),
                    __('Cinematic preview overlay', 'embedpress'),
                    __('In-player email capture', 'embedpress'),
                    __('Chapters, timed CTAs & end screen', 'embedpress'),
                    __('Drop-off heatmap & completion tracking', 'embedpress'),
                ],
            ],
            'pdf' => [
                'headline' => __('Pro tools for your PDFs', 'embedpress'),
                'features' => [
                    __('PDF watermark', 'embedpress'),
                    __('Print, download & copy controls', 'embedpress'),
                    __('Logo & CTA overlay', 'embedpress'),
                    __('Password & role protection', 'embedpress'),
                    __('Per-PDF analytics', 'embedpress'),
                ],
            ],
            'document' => [
                'headline' => __('Smarter DOCX, PPTX & XLSX embeds', 'embedpress'),
                'features' => [
                    __('Office Online viewer', 'embedpress'),
                    __('Print & download controls', 'embedpress'),
                    __('Logo & CTA overlay', 'embedpress'),
                    __('Password & role protection', 'embedpress'),
                    __('Per-document analytics', 'embedpress'),
                ],
            ],
            'social' => [
                'headline' => __('Get more from your social feeds', 'embedpress'),
                'features' => [
                    __('Showcase ads on feeds', 'embedpress'),
                    __('Password-protect any feed', 'embedpress'),
                    __('Lazy-load heavy feeds', 'embedpress'),
                    __('Per-feed analytics', 'embedpress'),
                    __('Geo & referrer insights', 'embedpress'),
                ],
            ],
            'maps' => [
                'headline' => __('Faster, protected maps', 'embedpress'),
                'features' => [
                    __('Lazy-load Google Maps', 'embedpress'),
                    __('Showcase ads on maps', 'embedpress'),
                    __('Password & role protection', 'embedpress'),
                    __('Per-map analytics', 'embedpress'),
                ],
            ],
            '3d' => [
                'headline' => __('Level up your interactive embeds', 'embedpress'),
                'features' => [
                    __('Showcase ads overlay', 'embedpress'),
                    __('Password & role protection', 'embedpress'),
                    __('Lazy loading', 'embedpress'),
                    __('Per-embed analytics', 'embedpress'),
                ],
            ],
            'audio' => [
                'headline' => __('Get more from your audio embeds', 'embedpress'),
                'features' => [
                    __('Showcase ads overlay', 'embedpress'),
                    __('Password & role protection', 'embedpress'),
                    __('Lazy loading', 'embedpress'),
                    __('Per-track analytics', 'embedpress'),
                    __('Geo & referrer insights', 'embedpress'),
                ],
            ],
            'general' => [
                'headline' => __('Unlock everything EmbedPress can do', 'embedpress'),
                'features' => [
                    __('Branded video player & cinematic preview', 'embedpress'),
                    __('PDF watermark & branding overlay', 'embedpress'),
                    __('Password & role protection', 'embedpress'),
                    __('Showcase ads on any embed', 'embedpress'),
                    __('Geo, device & referrer analytics', 'embedpress'),
                ],
            ],
        ];
    }

    private static function category_label($category)
    {
        $labels = [
            'video'    => __('video embeds', 'embedpress'),
            'pdf'      => __('PDF embeds', 'embedpress'),
            'document' => __('document embeds', 'embedpress'),
            'social'   => __('social feed embeds', 'embedpress'),
            'maps'     => __('maps & calendars', 'embedpress'),
            '3d'       => __('3D & interactive embeds', 'embedpress'),
            'audio'    => __('audio embeds', 'embedpress'),
            'general'  => __('embeds', 'embedpress'),
        ];
        return isset($labels[$category]) ? $labels[$category] : $labels['general'];
    }
}
