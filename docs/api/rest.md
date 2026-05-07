---
order: 1
---

# REST API

EmbedPress exposes REST endpoints under the `embedpress/v1` namespace, registered across `Core.php` and `EmbedPress/Includes/Classes/Analytics/REST_API.php`.

> The list below was verified by `grep -rn register_rest_route EmbedPress/`. If you add a new route, update this doc in the same PR.

## Authentication

- **Admin endpoints** require capability + nonce (`X-WP-Nonce`).
- **Public endpoints** (analytics tracker, oembed proxy) accept anonymous calls but are scoped/rate-limited where appropriate.

## Free endpoints

### Embed proxy

| Route | Method | Purpose | Defined in |
|---|---|---|---|
| `/embedpress/v1/oembed/{provider}` | GET / POST | Resolve a URL through `Shortcode::parseContent` and return embed HTML — used by editor previews and as the auto-embed routing target | `EmbedPress/Core.php` ~line 410 |

### Feedback

| Route | Method | Purpose |
|---|---|---|
| `/embedpress/v1/send-feedback` | POST | Submit user feedback / rating | `Core.php` ~line 663 |

### Analytics

All in `EmbedPress/Includes/Classes/Analytics/REST_API.php`. The full list:

| Route | Method | Purpose |
|---|---|---|
| `/embedpress/v1/analytics/track` | POST | Frontend tracker writes events |
| `/embedpress/v1/analytics/data` | GET | Aggregate data for the dashboard |
| `/embedpress/v1/analytics/content` | GET | Content table (per-post breakdown) |
| `/embedpress/v1/analytics/views` | GET | View counts |
| `/embedpress/v1/analytics/spline-chart` | GET | Time-series chart data |
| `/embedpress/v1/analytics/overview` | GET | Overview cards |
| `/embedpress/v1/analytics/embed-details` | GET | Per-embed detail panel |
| `/embedpress/v1/analytics/milestones` | GET / POST | List + persist milestone notifications |
| `/embedpress/v1/analytics/milestones/read` | POST | Mark milestone read |
| `/embedpress/v1/analytics/features` | GET / POST | Feature toggle state |
| `/embedpress/v1/analytics/geo` | GET | Country breakdown (Pro tier extends) |
| `/embedpress/v1/analytics/device` | GET | Device breakdown |
| `/embedpress/v1/analytics/browser` | GET | Browser breakdown |
| `/embedpress/v1/analytics/browser-info` | GET | Detailed browser info |
| `/embedpress/v1/analytics/unique-viewers-per-embed` | GET | Unique viewers (Pro tier) |
| `/embedpress/v1/analytics/referral` | GET | Referrer breakdown (Pro tier) |
| `/embedpress/v1/analytics/export` | GET | CSV / Excel / PDF export |
| `/embedpress/v1/analytics/email-settings` | GET / POST | Email report config |
| `/embedpress/v1/analytics/sync-counters` | POST | Reconcile counter rows |
| `/embedpress/v1/analytics/tracking-setting` | GET / POST | Tracking preferences |
| `/embedpress/v1/analytics/cleanup-redundant-data` | POST | Maintenance cleanup |
| `/embedpress/v1/analytics/performance-stats` | GET | Internal performance dashboard |

Several routes branch on Pro activation — Pro-tier capabilities (unique viewers per embed, referral, advanced geo) are gated inside the same handler, not separate Pro routes. See [Analytics](../features/analytics.md).

## Pro endpoints

Pro currently does **not** register new feature routes under `embedpress-pro/v1` or anywhere else. The only Pro-side `register_rest_route` call lives in the bundled licensing dependency:

- `includes/Dependencies/WPDeveloper/Licensing/RESTApi.php` — license activation, deactivation, status. Namespace is dynamic (constructed by `LicenseManager`).

Adding a Pro REST namespace is a real architectural decision; if you need it, raise it explicitly in a design doc rather than just bolting one on.

## Patterns we follow

- **Validate args via `args` schema in `register_rest_route`** — don't validate in the handler.
- **Return `WP_Error` with explicit status codes** for failure.
- **Sanitize input on the way in, escape on the way out**, even for admin-only endpoints.
- **Nonce check via `permission_callback` only** — don't sprinkle nonce checks inside handlers.

## Example handler skeleton

```php
register_rest_route('embedpress/v1', '/foo', [
    'methods'  => WP_REST_Server::READABLE,
    'permission_callback' => function () {
        return current_user_can('manage_options');
    },
    'args' => [
        'id' => [
            'required'          => true,
            'sanitize_callback' => 'absint',
        ],
    ],
    'callback' => function (WP_REST_Request $req) {
        $id = $req->get_param('id');
        // …
        return rest_ensure_response(['ok' => true]);
    },
]);
```
