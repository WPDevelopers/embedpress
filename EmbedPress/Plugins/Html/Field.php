<?php

namespace EmbedPress\Plugins\Html;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity responsible to generating and rendering html fields to the settings page.
 *
 * @package     EmbedPress
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2020 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.4.0
 */
class Field
{
    /**
     * Generates a text type input.
     *
     * @since   1.4.0
     * @access  protected
     * @static
     *
     * @return  string
     */
    protected static function text($value)
    {
        $html = '<input type="text" name="embedpress:{{slug}}[{{name}}]" class="{{classes}}" placeholder="{{placeholder}}" value="' . (string)$value . '">';

        return $html;
    }

    /**
     * Generates a textarea input.
     *
     * @since   1.4.0
     * @access  protected
     * @static
     *
     * @return  string
     */
    protected static function textarea($value)
    {
        $html = '<textarea name="embedpress:{{slug}}[{{name}}]" class="{{classes}}" placeholder="{{placeholder}}">' . (string)$value . '</textarea>';

        return $html;
    }

    /**
     * Generates a radio type input.
     *
     * @since   1.4.0
     * @access  protected
     * @static
     *
     * @return  string
     */
    protected static function radio($options, $value = null)
    {
        $html = [];

        foreach ((array)$options as $optionValue => $optionLabel) {
            $html[] = '<label>';
            $html[] = '<input type="radio" name="embedpress:{{slug}}[{{name}}]" class="{{classes}}" value="' . $optionValue . '"' . ($value === $optionValue ? ' checked' : '') . '>';
            $html[] = '&nbsp;' . $optionLabel;
            $html[] = '</label>&nbsp;&nbsp;';
        }

        $html = implode('', $html);

        return $html;
    }

    /**
     * Generates a select input.
     *
     * @since   1.4.0
     * @access  protected
     * @static
     *
     * @return  string
     */
    protected static function select($options, $value = null)
    {
        $html = ['<select name="embedpress:{{slug}}[{{name}}]" class="{{classes}}">'];

        foreach ((array)$options as $optionValue => $optionLabel) {
            $html[] = '<option value="' . $optionValue . '"' . ($value === (string)$optionValue ? ' selected' : '') . '>' . $optionLabel . '</option>';
        }

        $html[] = '</select>';

        $html = implode('', $html);

        return $html;
    }

    /**
     * Render a field based on a field schema.
     *
     * @since   1.4.0
     * @static
     *
     * @param   array $params There's two available keys: 'field' which holds the field schema; and 'pluginSlug' which
     *                        represents the slug of the plugin where the field belongs to.
     *
     * @return  void
     */
    public static function render($params)
    {
        $field = json_decode(json_encode($params['field']));

        $pluginSlug = "embedpress:{$params['pluginSlug']}";

        $options = (array)get_option($pluginSlug);

        $field->type = strtolower($field->type);

        if ($field->slug === "license_key") {
            $value = isset($options['license']['key']) ? (string)$options['license']['key'] : "";
        } else {
            $value = isset($options[$field->slug]) ? $options[$field->slug] : (isset($field->default) ? $field->default : '');
        }

        if (in_array($field->type, ['bool', 'boolean'])) {
            $html = self::radio([
                0 => 'No',
                1 => 'Yes',
            ], (int)$value);
        } elseif (isset($field->options)) {
            $html = self::select((array)$field->options, (string)$value);
        } elseif (in_array($field->type, ['textarea'])) {
            $html = self::textarea((string)$value);
        } else {
            $html = self::text((string)$value);
        }

        $html = str_replace('{{slug}}', $params['pluginSlug'], $html);
        $html = str_replace('{{name}}', $field->slug, $html);
        $html = str_replace('{{classes}}', implode(' ', (! empty($field->classes) ? (array)$field->classes : [])),
            $html);
        $html = str_replace('{{placeholder}}', (! empty($field->placeholder) ? (string)$field->placeholder : ""),
            $html);

        $html .= wp_nonce_field("{$pluginSlug}:nonce", "{$pluginSlug}:nonce");

        if ( ! empty($field->description)) {
            $html .= '<br/>';
            $html .= '<p class="description">' . $field->description . '</p>';
        }

        echo $html;
    }
}
