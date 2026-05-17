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
}
