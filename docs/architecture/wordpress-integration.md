# WordPress Integration

How EmbedPress plugs into the WordPress lifecycle.

## Plugin bootstrap order

`embedpress.php` is the only file WordPress directly loads. From there:

```
embedpress.php
  ├─ defines EMBEDPRESS_PLUGIN_VERSION (4.5.1), EMBEDPRESS_FILE,
  │           EMBEDPRESS_PLUGIN_BASENAME, EMBEDPRESS_PLUGIN_DIR_PATH,
  │           EMBEDPRESS_PLUGIN_URL, EMBEDPRESS_GUTENBERG_DIR_URL,
  │           EMBEDPRESS_SETTINGS_ASSETS_URL
  ├─ require_once includes.php
  │     └─ defines EMBEDPRESS, EMBEDPRESS_PLG_NAME, EMBEDPRESS_VERSION,
  │       EMBEDPRESS_PATH_BASE, EMBEDPRESS_PATH_CORE, EMBEDPRESS_URL_ASSETS,
  │       EMBEDPRESS_URL_STATIC, EMBEDPRESS_SHORTCODE, EMBEDPRESS_LICENSES_API_HOST
  │     └─ Composer autoload, plus utility functions:
  │       embedpress_cache_cleanup, embedpress_schedule_cache_cleanup,
  │       is_embedpress_pro_active, get_embedpress_pro_version, stringToBoolean
  ├─ require_once autoloader.php
  │     └─ AutoLoader::register('EmbedPress', EMBEDPRESS_PATH_CORE)      → EmbedPress/
  │     └─ AutoLoader::register('EmbedPress\\Src', EMBEDPRESS_PATH_BASE.'src/')
  ├─ require_once providers.php
  │     └─ builds $additionalServiceProviders (26 providers)
  └─ around line 115 — branch by WP version + active editor:
       ├─ WP 5+ with block editor → Core::initialize()
       └─ WP < 5.0 (TinyMCE)      → CoreLegacy::initialize()
       both then:
         ├─ Feature_Enhancer instantiated
         ├─ Helper instantiated
         ├─ Analytics_Manager instantiated (≈line 152)
         ├─ Shortcode::register() (≈line 160)
         └─ Embedpress_Elementor_Integration if Elementor active (≈line 156)
```

## Hooks EmbedPress relies on

| WP hook | What EmbedPress does |
|---|---|
| `plugins_loaded` | Boot Core / CoreLegacy + Feature_Enhancer |
| `init` | Register Gutenberg blocks (via `BlockManager`) |
| `rest_api_init` | Register REST routes (oembed proxy, analytics, send-feedback) |
| `enqueue_block_editor_assets` | Editor JS for blocks |
| `wp_enqueue_scripts` | Frontend runtime (player, analytics, viewer assets) |
| `admin_enqueue_scripts` | Admin UI (settings, analytics dashboard) |
| `oembed_providers` | Register EmbedPress-known hosts as oEmbed providers |
| `pre_oembed_result` (effectively, via REST) | Route to EmbedPress's pipeline |
| `embedpress_cache_cleanup_action` | Daily cron — clean `/wp-content/uploads/embedpress/` |
| `pp_embed_parsed_content` | AMP plugin compatibility |
| `fl_builder_before_render_shortcodes` | Beaver Builder support |

## Constants you'll see everywhere

| Constant | Defined in | Meaning |
|---|---|---|
| `EMBEDPRESS_PATH_BASE` | `includes.php` | Plugin root |
| `EMBEDPRESS_PATH_CORE` | `includes.php` | `EMBEDPRESS_PATH_BASE . 'EmbedPress/'` |
| `EMBEDPRESS_URL_ASSETS` | `includes.php` | URL to `assets/` |
| `EMBEDPRESS_URL_STATIC` | `includes.php` | URL to `static/` |
| `EMBEDPRESS_NAMESPACE` | (older code uses `'\\EmbedPress'`) | Used in providers.php |
| `EMBEDPRESS_PLUGIN_VERSION` | `embedpress.php` | The real version (cache-bust source) |
| `EMBEDPRESS_FILE` | `embedpress.php` | Bootstrap file path |
| `EMBEDPRESS_LICENSES_API_HOST` | `includes.php` | `embedpress.com` |

## Autoloading

`Core/AutoLoader.php` is a small PSR-style loader. `autoloader.php` registers two namespace roots:

- `EmbedPress\` → `EmbedPress/`
- `EmbedPress\Src\` → `src/`

Class `EmbedPress\Providers\Youtube` resolves to `EmbedPress/Providers/Youtube.php`. **File names must match class names exactly** — autoloading is case-sensitive.

Composer autoload also runs (via `includes.php`) for vendor libs (Embera, license SDK, etc.). Both autoloaders coexist.

## Settings storage

EmbedPress options live in `wp_options`:

- `embedpress` — main settings (read by `Core::getSettings`)
- `embedpress_settings` — secondary settings keys (used by some features)
- per-feature keys (analytics email settings, tracking settings, etc.)

Defaults from `Core::getSettings`:

```
enablePluginInAdmin, enablePluginInFront,
enableGlobalEmbedResize, default sizes 600 × 550
```

## Database

Free EmbedPress's **Analytics module** creates custom tables (in `EmbedPress/Includes/Classes/Analytics/`). Other features use options or post meta. Pro adds **no** custom tables.

## Multisite

Per-site options. Activation hook runs per blog. Tested on subsite, subdirectory, and subdomain.

## Compatibility shims

`EmbedPress/Plugins/`, `EmbedPress/ThirdParty/`, and `EmbedPress/AMP/` hold conditional compatibility code for popular plugins / frameworks (Elementor's loop builder, AMP, Beaver Builder, page builders). Loaded on-demand.
