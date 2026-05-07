---
order: 5
---

# Analytics

A first-party analytics system that records every embed interaction (impression, click, view, play, pause, complete) and rolls it up into a React dashboard with overview cards, time-series chart, world map, browser/device pies, top-referrers list, milestone notifications, and CSV/PDF/Excel export.

Built entirely on `wpdb` (no third-party services). Tracker fingerprints clients via canvas + WebGL hashes (no PII). Cookies: `ep_user_id` (30-day) + `ep_session_id` (session).

## Free vs Pro

| Capability | Free | Pro |
|---|---|---|
| Total views / clicks / impressions | ✓ | ✓ |
| Total unique viewers (aggregate) | ✓ | ✓ |
| Per-embed breakdown | – | ✓ |
| Unique viewers per embed | – | ✓ |
| Geo (country / region) | – | ✓ |
| Device + browser breakdown | – | ✓ |
| Referrer + UTM | – | ✓ |
| Milestones (100, 500, 1K, 5K, 10K+) | ✓ | ✓ |
| Email reports (weekly / monthly) | – | ✓ |
| Advanced charts | – | ✓ |
| CSV export | ✓ | ✓ |
| Excel export | – | ✓ |
| PDF export | – | ✓ |
| Tracking limit | 100 content items | unlimited |
| Retention | 90 days | 365 days |

License gating happens at REST registration time **and** inside `Pro_Data_Collector` instantiation. If `License_Manager::has_pro_license()` returns false, Pro endpoints are simply not registered, and the React dashboard renders a `ProOverlay` upsell over the gated panels. This means a license bug silently strips Pro features without errors.

## Architecture

```
        Frontend visitor                        wp-admin (analytics page)
              │                                            │
              ▼                                            ▼
   assets/js/analytics-tracker.js                React AnalyticsDashboard
   (IntersectionObserver + click                 (src/Analytics/)
    delegates + fingerprint)                              │
              │                                           │
              ▼                                           ▼
   POST /embedpress/v1/analytics/track ◄── REST_API.php router ──► GET /data, /content, /views,
                                                                    /spline-chart, /overview,
                                                                    /embed-details, /milestones,
                                                                    /features, /geo, /device,
                                                                    /browser, /export, …
                                                  │
                                                  ▼
                              Data_Collector ── extends ──► Pro_Data_Collector
                                                              (only if licensed)
                                                  │
                                                  ▼
                                       wpdb → 5 analytics tables
                                       + 3 wp_options keys
                                       + cron (weekly/monthly reports + milestones)
```

## Database schema (`Analytics_Schema.php` — version `1.0.8`)

| Table | Purpose | Key columns |
|---|---|---|
| `{prefix}embedpress_analytics_content` | Per-embed metadata + rollup counters | `content_id`, `embed_type`, `post_id`, `total_views`, `total_clicks`, `total_impressions` |
| `{prefix}embedpress_analytics_views` | Each interaction row | `content_id`, `user_id`, `session_id`, `interaction_type`, `user_ip`, `referrer_url`, `view_duration` |
| `{prefix}embedpress_analytics_browser_info` | Per-session client metadata | `user_id`, `session_id`, `browser_fingerprint`, `browser_name`, `device_type`, `country`, `city` |
| `{prefix}embedpress_analytics_milestones` | Achievement records | `milestone_type`, `milestone_value`, `achieved_value`, `is_notified` |
| `{prefix}embedpress_analytics_referrers` | Referrer + UTM aggregation | `referrer_url`, `referrer_domain`, `utm_source`, `utm_medium`, `utm_campaign`, `total_views`, `unique_visitors` |

Bump `Analytics_Schema::DB_VERSION` (~L23) when adding columns; `dbDelta` runs on activation/upgrade and reads this option.

## Tracker payload (frontend → server)

```js
{
  content_id,                  // stable per-embed hash
  interaction_type,            // 'impression' | 'click' | 'view' | 'play' | 'pause' | 'complete'
  user_id,                     // 'ep-user-{ts}-{rand}', 30-day cookie
  session_id,                  // 'ep-sess-{ts}-{rand}', session cookie
  page_url,
  interaction_data: {
    embed_type,                // 'YouTube' | 'Vimeo' | 'PDF' | …
    embed_url,
    viewport_percentage,
    location_data,             // client-sourced geo (IP-based fallback server-side)
    browser_fingerprint        // canvas + WebGL hash
  }
}
```

## Tracking semantics

| Interaction | Trigger | Cooldown / threshold |
|---|---|---|
| `impression` | Element enters viewport ≥49% | 5 s cooldown per content_id |
| `click` | Click event delegated on embed | 2 s cooldown |
| `view` | ≥49% visible for ≥3 s | One-shot per session per content |
| `play` | Custom Player play event | – |
| `pause` | Custom Player pause | – |
| `complete` | Custom Player ≥85% watched | Pro only |

Defaults from `analytics-tracker.js` (~L57-69): `viewThreshold: 49`, `viewDuration: 3000`, `impressionCooldown: 5000`, `clickCooldown: 2000`.

## Code paths

### Free PHP

| File | Role |
|---|---|
| `EmbedPress/Analytics.php` | Admin menu registration, page render, enqueues `analytics.build.js`. Sets `embedpress_analytics_tracking_enabled` (default true). |
| `EmbedPress/Includes/Classes/Analytics/REST_API.php` | All 20+ REST routes. Pro_Data_Collector instantiated at constructor (~L31). License gate at ~L201. |
| `EmbedPress/Includes/Classes/Analytics/Data_Collector.php` | Free-tier collector. `track_interaction`, `get_views_analytics`, `get_content_analytics`, `get_browser_analytics`, `track_referrer_from_interaction_data`. |
| `EmbedPress/Includes/Classes/Analytics/Pro_Data_Collector.php` | Extends Data_Collector. Adds `get_unique_viewers_per_embed`, `get_geo_analytics`, `get_device_analytics`, `get_referral_analytics`. |
| `EmbedPress/Includes/Classes/Analytics/License_Manager.php` | `has_pro_license()` (~L23). Free vs Pro feature arrays (~L78-97). Limits (~L167-186). |
| `EmbedPress/Includes/Classes/Analytics/Export_Manager.php` | CSV / XLSX / PDF generation. Outputs to `/wp-content/uploads/embedpress-analytics/`. |
| `EmbedPress/Includes/Classes/Analytics/Milestone_Manager.php` | Tracks 100, 500, 1K, 5K, 10K+ thresholds. Fires `embedpress_milestone_achieved` (~L240). |
| `EmbedPress/Includes/Classes/Analytics/Email_Reports.php` | Cron handlers `embedpress_weekly_analytics_report`, `embedpress_monthly_analytics_report` (~L45-46). |
| `EmbedPress/Includes/Classes/Analytics/Browser_Detector.php` | Parses User-Agent → browser/OS/device-type. |
| `EmbedPress/Includes/Classes/Analytics/Content_Cache_Manager.php` | Cache invalidation. Filter `embedpress_cache_clear_post_types` (~L58). |
| `EmbedPress/Includes/Database/Analytics_Schema.php` | `dbDelta` schema for 5 tables. Schema version `1.0.8`. |

### Free JS

| File | Role |
|---|---|
| `assets/js/analytics-tracker.js` | 1200+ LOC tracker. IntersectionObserver, fingerprint, payload builder. |
| `src/Analytics/index.js` | Mounts React `AnalyticsDashboard`. |
| `src/Analytics/components/AnalyticsDashboard.js` | Container — date range, custom date range, active tabs. |
| `src/Analytics/components/Header.js` | Date-range picker. |
| `src/Analytics/components/Overview.js` | Totals cards. |
| `src/Analytics/components/SplineChart.js` | amCharts5 time-series. |
| `src/Analytics/components/WorldMap.js` | amCharts5 geo heatmap (Pro). |
| `src/Analytics/components/PieChart.js` | Browser/device. |
| `src/Analytics/components/EmbedDetailsModal.js` | Per-embed modal. |
| `src/Analytics/components/ExportDropdown.js` | CSV / Excel / PDF export. |
| `src/Analytics/services/AnalyticsDataProvider.js` | REST client wrapper. |

### Pro

| File | Role |
|---|---|
| `embedpress-pro/includes/Classes/CustomPlayer/Completion_Tracker.php` | `POST /completion`, `GET /completions`. Fires `embedpress_video_completed` (~L33). 85% watch-time guard (~L23). |
| `embedpress-pro/includes/Classes/CustomPlayer/Heatmap_Tracker.php` | `POST /heatmap/sample`, `GET /heatmap/data`, `GET /heatmap/list`. 100-bucket anonymous drop-off via `wp_options` keyed `embedpress_heatmap_<md5(url)>` (~L12). |

Pro doesn't add its own analytics tables — it writes into the free schema via `Pro_Data_Collector`, plus heatmap/completion sidecars in `wp_options`.

## REST endpoints

See [api/rest.md](../api/rest.md) for the full route list.

## Hooks

| Hook | Type | Where | Use |
|---|---|---|---|
| `embedpress_milestone_achieved` | action | `Milestone_Manager.php:240` | Args: `(type, value, achieved)`. Hook for custom notifications. |
| `embedpress_weekly_analytics_report` | action | `Email_Reports.php:45` | Cron-fired. |
| `embedpress_monthly_analytics_report` | action | `Email_Reports.php:46` | Cron-fired. |
| `embedpress_video_completed` | action | `Completion_Tracker.php:33` | Pro. Fires when ≥85% completion arrives — LMS integrations hook here. |
| `embedpress_cache_clear_post_types` | filter | `Content_Cache_Manager.php:58` | Allow extra post types. |
| `embedpress_content_count_post_types` | filter | `Data_Collector.php:1295` | Post types counted as "content". |

## License gating

`License_Manager` defines feature arrays:

**Free**: `total_views`, `total_clicks`, `total_impressions`, `total_unique_viewers`, `views_over_time_basic`, `basic_charts`.

**Pro**: `per_embed_analytics`, `unique_viewers_per_embed`, `views_over_time_advanced`, `geo_tracking`, `device_analytics`, `email_reports`, `referral_tracking`, `advanced_charts`, `export_pdf`.

Detection: `is_plugin_active('embedpress-pro/embedpress-pro.php')` AND license active for `EMBEDPRESS_SL_ITEM_SLUG`.

## Common pitfalls

- **Schema bumps require both** the `Analytics_Schema::DB_VERSION` constant change AND a `dbDelta` re-run path. Adding columns without bumping the version means existing installs never get the column.
- **License-gated REST routes are silent**. If `has_pro_license()` returns false, the route doesn't exist — the React dashboard sees a 404, not a "Pro required" payload. When debugging "feature missing" reports, check license first.
- **Tracking can be globally disabled** via `embedpress_analytics_tracking_enabled` option. Front-end JS is still enqueued; the server just rejects writes. Useful for GDPR consent tooling.
- **Fingerprint is best-effort only** — Safari ITP / Brave / Firefox-strict block canvas + WebGL fingerprinting. Treat `user_id`/`session_id` cookies as the primary identity, fingerprint as a tiebreaker.
- **`embedpress_heatmap_<md5(url)>` options can grow unbounded** if many videos are embedded. The Pro Heatmap_Tracker doesn't currently prune; long-running sites should manually clear.
- **Free retention is 90 days** but pruning is a cron, not a query-time filter. Sites with disabled cron will accumulate beyond the limit.
- **`embed_type` strings are case-sensitive** in queries. The tracker emits `'YouTube'`, `'Vimeo'`, etc. Don't compare lowercase server-side.
- **Pro Heatmap & Completion are separate from analytics tables**. They live in `wp_options` to avoid yet-another-table on activation; keep them out of the `Analytics_Schema` migrations.

## Testing

- **Smoke**: `make wp ARG="user create test test@x.test --role=author"`, visit any embed-bearing post in incognito. Confirm an `impression` row appears in `{prefix}embedpress_analytics_views`.
- **Forcing a milestone**: insert rows directly into the views table to push `total_views` above 100, then run cron via `make wp ARG="cron event run embedpress_daily_milestone_check"`.
- **License toggle**: deactivate Pro plugin, refresh dashboard — Pro panels should render the upsell, not 500.
- **Export**: trigger `/analytics/export?format=csv&date_range=30` and verify file in `/wp-content/uploads/embedpress-analytics/`.
- **E2E**: `npm run test:e2e:dashboard`.
