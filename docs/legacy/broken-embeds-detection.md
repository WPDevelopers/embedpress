# PRD — Broken Embed Source URL Detection

**Card:** [r0gbn6r2c3](https://zoobbe.com/c/r0gbn6r2c3) — *Detect and Report Broken Embed Source URLs in Analytics*
**Owner:** Akash · **Status:** In Development · **Target:** EmbedPress 4.3.0

## 1. Problem
When an embedded source becomes unavailable (video removed, link revoked, file deleted), the embed silently fails on the frontend. Site owners have no way to discover which posts contain dead embeds without manually visiting every page.

## 2. Goal
Surface broken embed source URLs inside the existing **Analytics** dashboard so admins can audit and fix them in one place.

## 3. Scope
- **In:** Detect dead/inaccessible URLs for embeds tracked in `wp_embedpress_analytics_content`. Display results in a new tab in the Analytics dashboard. Manual + scheduled re-checks. Open-in-editor link to the affected post.
- **Out:** Auto-replacement of broken URLs. Frontend fallback rendering (separate ticket). Bulk delete/edit operations.

## 4. UX
A new tab **“Broken Embeds”** is added to the Content section of the Analytics dashboard, immediately after **“Top Performing Content.”** The panel renders a table:

| Page Title | Source URL | Type | Status | Last Checked | Action |
|---|---|---|---|---|---|
| About Us | `youtube.com/watch?v=xyz` | YouTube | 404 Not Found | 2 hrs ago | Edit · Re-check |

Header shows a **“Re-check All”** button and a count badge of currently broken embeds. Empty state: *“All your embeds are healthy. Last scan: …”*

## 5. Detection Logic
For each distinct `embed_url` in `wp_embedpress_analytics_content`:

1. Issue an HTTP `HEAD` request (5s timeout) via `wp_remote_head`.
2. If the response is `405 Method Not Allowed` or empty body, fall back to `GET` (3s timeout).
3. **Mark BROKEN** if:
   - HTTP status is `4xx` or `5xx`, OR
   - Connection error / timeout, OR
   - Provider-specific failure pattern (e.g. YouTube returns `200` on `/watch?v=` but body contains `"Video unavailable"`; Vimeo returns `403`/`404` JSON from oEmbed).
4. **Mark OK** if `2xx` and provider check passes.
5. Cache per-URL result in DB column for 24h to avoid re-hitting the network on every dashboard load.

## 6. Backend
- **New class:** `EmbedPress\Includes\Classes\Analytics\Broken_Embeds_Detector`
  - `scan_all($args)` — iterate distinct URLs, return [{url, status, http_code, last_checked, content_ids[]}]
  - `check_url($url, $embed_type)` — single-URL check with provider-aware fallback
  - `recheck_url($url)` — bypasses cache
- **Schema additions** to `wp_embedpress_analytics_content` (DB version 1.0.9):
  - `last_check_status` ENUM('unknown','ok','broken') DEFAULT 'unknown'
  - `last_check_code` INT(4) DEFAULT NULL
  - `last_check_at` DATETIME DEFAULT NULL
  - INDEX `idx_last_check_status`
- **REST endpoints** in `REST_API::register_routes()`:
  - `GET /embedpress/v1/analytics/broken-embeds` → list broken (and optionally all-with-status)
  - `POST /embedpress/v1/analytics/broken-embeds/recheck` → trigger fresh scan, returns updated list
- **WP-Cron:** `embedpress_daily_broken_embed_scan` runs once daily, batches 50 URLs per tick.

## 7. Frontend
- `src/Analytics/components/AnalyticsDashboard.js` — add third tab in `tabThree` group; render `<BrokenEmbedsTable>` panel when `activeTabThree === 'broken'`.
- `src/Analytics/components/BrokenEmbedsTable.js` — new component handling load + re-check action.
- `src/Analytics/services/AnalyticsDataProvider.js` — add `getBrokenEmbeds()` and `recheckBrokenEmbeds()`.
- Available to both Free and Pro users (reliability ≠ depth-of-analytics).

## 8. Performance & Safety
- Network calls only run inside the cron tick or explicit user action — never inside the dashboard render path.
- Per-host throttle: max 5 requests/sec to any single domain.
- `User-Agent: EmbedPress/<ver> Broken-Link-Checker (+site-url)` so providers can identify and rate-limit cleanly.
- Respect `WP_HTTP_BLOCK_EXTERNAL`; no-op silently when external requests are blocked.

## 9. Telemetry
None. (Status counters live in the DB and are visible in the dashboard.)

## 10. Acceptance
- [ ] New “Broken Embeds” tab appears after “Top Performing Content” in the Analytics dashboard.
- [ ] First load shows cached statuses; never blocks on network.
- [ ] “Re-check All” triggers a real scan and updates the table without a page reload.
- [ ] A 404’d YouTube URL inserted into a test post shows up as `BROKEN` after one cron tick.
- [ ] Cron is registered on plugin activation and unscheduled on deactivation.
