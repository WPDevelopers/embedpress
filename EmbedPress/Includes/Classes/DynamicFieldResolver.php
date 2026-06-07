<?php

namespace EmbedPress\Includes\Classes;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Resolves dynamic embed URLs from custom-field sources (ACF, MetaBox, Pods,
 * Toolset, JetEngine, raw post meta).
 *
 * Used by:
 *   - Elementor PDF / Document widgets via resolve_elementor_dynamic()
 *   - Gutenberg block renderer + shortcode via resolve_field()
 *
 * Why one class: the three surfaces (Elementor / Gutenberg / shortcode) all
 * need the same source map. Keeping it in one place means adding a new field
 * plugin (e.g. SCF, Carbon Fields) touches one method, not three.
 */
class DynamicFieldResolver
{
    /**
     * Resolve a custom-field URL given an explicit source + field name.
     * Used by Gutenberg blocks and shortcodes (which know their source directly).
     *
     * @param string   $source  acf|metabox|pods|toolset|jetengine|meta
     * @param string   $field   Field name / key on the current post.
     * @param int|null $post_id Defaults to current queried post.
     * @return string Resolved URL, or '' when no value / source unavailable.
     */
    public static function resolve_field($source, $field, $post_id = null)
    {
        $field = sanitize_key((string) $field);
        if ($field === '') {
            return '';
        }

        if ($post_id === null) {
            $post_id = get_the_ID();
        }
        if (!$post_id) {
            return '';
        }

        $url = '';

        switch ($source) {
            case 'acf':
                if (function_exists('get_field')) {
                    $value = get_field($field, $post_id);
                    $url   = is_array($value) && isset($value['url']) ? $value['url'] : (string) $value;
                }
                break;

            case 'metabox':
                // MetaBox exposes rwmb_meta(); fall back to raw post meta if unavailable.
                if (function_exists('rwmb_meta')) {
                    $value = rwmb_meta($field, '', $post_id);
                    $url   = is_array($value) && isset($value['url']) ? $value['url'] : (string) $value;
                } else {
                    $url = (string) get_post_meta($post_id, $field, true);
                }
                break;

            case 'pods':
                if (function_exists('pods_field')) {
                    $value = pods_field(get_post_type($post_id), $post_id, $field, true);
                    $url   = is_array($value) && isset($value['guid'])
                        ? $value['guid']
                        : (is_array($value) && isset($value['url']) ? $value['url'] : (string) $value);
                } else {
                    $url = (string) get_post_meta($post_id, $field, true);
                }
                break;

            case 'toolset':
                // Toolset Types prefixes meta keys with `wpcf-`.
                $url = (string) get_post_meta($post_id, 'wpcf-' . $field, true);
                break;

            case 'jetengine':
            case 'meta':
            default:
                $url = (string) get_post_meta($post_id, $field, true);
                break;
        }

        // Back-compat: existing free 4.5.x filter, applied by the legacy
        // Elementor PDF/Document inline resolvers. Keep firing it from the
        // central path so third-party code keeps working.
        $url = apply_filters('embedpress/custom_meta_field_value', $url, $field);

        return is_string($url) ? trim($url) : '';
    }

    /**
     * Resolve a dynamic URL coming from Elementor's `__dynamic__` payload
     * (the picker emits an HTML-encoded blob containing the source + field).
     *
     * @param string $dynamic_value Raw `__dynamic__[<control>]` value.
     * @return string Resolved URL, or '' if nothing could be resolved.
     */
    public static function resolve_elementor_dynamic($dynamic_value)
    {
        if (empty($dynamic_value)) {
            return '';
        }

        $decoded = urldecode($dynamic_value);

        if (!preg_match('/name="([^"]+)"/', $decoded, $name_matches)) {
            return '';
        }
        $name_key = $name_matches[1];

        $source  = '';
        $pattern = '';

        if ($name_key === 'acf-url' && class_exists('ACF') && function_exists('get_field')) {
            $source  = 'acf';
            $pattern = '/"key":"[^"]+:(.*?)"/';
        } elseif ($name_key === 'toolset-url' && class_exists('Types_Helper_Output_Meta_Box')) {
            $source  = 'toolset';
            $pattern = '/"key":"[^"]+:(.*?)"/';
        } elseif ($name_key === 'jet-post-custom-field' && class_exists('Jet_Engine')) {
            $source  = 'jetengine';
            $pattern = '/"meta_field":"([^"]+)"/';
        } elseif ($name_key === 'post-custom-field') {
            // Elementor Pro's native "Post Custom Field" tag — URL_CATEGORY,
            // so it can target the EmbedPress PDF/Document URL control. Maps
            // to raw post_meta via get_post_meta(). Settings emit either
            // `key` (predefined dropdown of meta keys) or `custom_key`
            // (free-form input); try `custom_key` first because when both are
            // present Elementor's own render() prefers `key`, but `key` may
            // be empty and `custom_key` carries the actual field name.
            $source  = 'meta';
            $pattern = '/"custom_key":"([^"]+)"/';
            if (!preg_match($pattern, $decoded, $m) || empty($m[1])) {
                $pattern = '/"key":"([^"]+)"/';
            }
        }

        if ($source === '' || !preg_match($pattern, $decoded, $matches) || empty($matches[1])) {
            return self::elementor_fallback($decoded);
        }

        $url = self::resolve_field($source, $matches[1]);

        if ($url === '') {
            $url = self::elementor_fallback($decoded);
        }

        return esc_url_raw($url);
    }

    private static function elementor_fallback($decoded)
    {
        if (preg_match('/"fallback":"([^"]+)"/', $decoded, $m)) {
            return (string) $m[1];
        }
        return '';
    }

    /**
     * REST: enumerate available custom-field keys for the requested source.
     *
     * Used by the Gutenberg PDF block's Dynamic Source inspector so editors
     * pick a field from a dropdown instead of typing the key by hand. Each
     * source uses its own native API (ACF field groups, MetaBox registry,
     * Pods fields, JetEngine meta-boxes, Toolset Types definitions); the
     * `meta` source falls back to distinct `wp_postmeta` keys excluding the
     * usual core/private prefixes.
     *
     * Response: { fields: [{ value, label }, ...], available: bool, message }
     */
    public static function rest_list_fields(\WP_REST_Request $request)
    {
        $source = sanitize_key((string) $request->get_param('source'));
        $fields = [];
        $available = true;
        $message   = '';

        switch ($source) {
            case 'acf':
                if (!function_exists('acf_get_field_groups')) {
                    $available = false;
                    $message   = 'ACF plugin is not active.';
                    break;
                }
                foreach (acf_get_field_groups() as $group) {
                    foreach (acf_get_fields($group['key']) ?: [] as $field) {
                        $fields[] = [
                            'value' => $field['name'],
                            'label' => $field['label'] . ' (' . $field['name'] . ')',
                        ];
                    }
                }
                break;

            case 'metabox':
                if (!function_exists('rwmb_get_registry')) {
                    $available = false;
                    $message   = 'Meta Box plugin is not active.';
                    break;
                }
                $registry = rwmb_get_registry('field');
                foreach ($registry->get_by_object_type('post') as $post_type_fields) {
                    foreach ($post_type_fields as $field) {
                        if (empty($field['id'])) continue;
                        $fields[] = [
                            'value' => $field['id'],
                            'label' => ($field['name'] ?? $field['id']) . ' (' . $field['id'] . ')',
                        ];
                    }
                }
                break;

            case 'pods':
                if (!function_exists('pods_api')) {
                    $available = false;
                    $message   = 'Pods plugin is not active.';
                    break;
                }
                $pods = pods_api()->load_pods(['type' => 'post_type', 'names' => true]) ?: [];
                foreach ($pods as $pod_slug => $pod_label) {
                    $pod = pods_api()->load_pod(['name' => $pod_slug]);
                    foreach ($pod['fields'] ?? [] as $field_name => $field) {
                        $fields[] = [
                            'value' => $field_name,
                            'label' => ($field['label'] ?? $field_name) . ' (' . $field_name . ')',
                        ];
                    }
                }
                break;

            case 'jetengine':
                if (!class_exists('Jet_Engine')) {
                    $available = false;
                    $message   = 'JetEngine plugin is not active.';
                    break;
                }
                if (!empty(\Jet_Engine::instance()->meta_boxes)) {
                    foreach (\Jet_Engine::instance()->meta_boxes->data->get_items() as $meta_box) {
                        foreach ($meta_box['meta_fields'] ?? [] as $field) {
                            if (empty($field['name'])) continue;
                            $fields[] = [
                                'value' => $field['name'],
                                'label' => ($field['title'] ?? $field['name']) . ' (' . $field['name'] . ')',
                            ];
                        }
                    }
                }
                break;

            case 'toolset':
                if (!function_exists('wpcf_admin_fields_get_fields')) {
                    $available = false;
                    $message   = 'Toolset Types plugin is not active.';
                    break;
                }
                foreach (wpcf_admin_fields_get_fields() as $slug => $field) {
                    $fields[] = [
                        'value' => $slug,
                        'label' => ($field['name'] ?? $slug) . ' (' . $slug . ')',
                    ];
                }
                break;

            case 'meta':
            default:
                global $wpdb;
                $rows = $wpdb->get_col(
                    "SELECT DISTINCT meta_key FROM {$wpdb->postmeta} "
                    . "WHERE meta_key NOT LIKE '\\_%' "
                    . "AND meta_key NOT LIKE '\\\\_%' "
                    . "ORDER BY meta_key ASC LIMIT 200"
                );
                foreach ($rows as $key) {
                    $fields[] = ['value' => $key, 'label' => $key];
                }
                break;
        }

        return rest_ensure_response([
            'source'    => $source,
            'available' => $available,
            'message'   => $message,
            'fields'    => $fields,
        ]);
    }
}
