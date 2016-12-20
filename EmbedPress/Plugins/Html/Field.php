<?php
namespace EmbedPress\Plugins\Html;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity responsible to generating and rendering html fields to the settings page.
 *
 * @package     EmbedPress
 * @author      PressShack <help@pressshack.com>
 * @copyright   Copyright (C) 2016 Open Source Training, LLC. All rights reserved.
 * @license     GPLv2 or later
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
        $html = '<input type="text" name="embedpress:{{slug}}[{{name}}]" class="{{classes}}" placeholder="{{placeholder}}" value="'. (string)$value .'">';

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
        $html = '<textarea name="embedpress:{{slug}}[{{name}}]" class="{{classes}}" placeholder="{{placeholder}}">'. (string)$value .'</textarea>';

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
        $html = array();

        foreach ((array)$options as $optionValue => $optionLabel) {
            $html[] = '<label>';
            $html[] = '<input type="radio" name="embedpress:{{slug}}[{{name}}]" class="{{classes}}" value="'. $optionValue .'"'. ($value === $optionValue ? ' checked' : '') .'>';
            $html[] = '&nbsp;'. $optionLabel;
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
        $html = array('<select name="embedpress:{{slug}}[{{name}}]" class="{{classes}}">');

        foreach ((array)$options as $optionValue => $optionLabel) {
            $html[] = '<option value="'. $optionValue .'"'. ($value === (string)$optionValue ? ' selected' : '') .'>'. $optionLabel .'</option>';
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
     * @param   array       $params There's two available keys: 'field' which holds the field schema; and 'pluginSlug' which represents the slug of the plugin where the field belongs to.
     * @return  void
     */
    public static function render($params)
    {
        $field = json_decode(json_encode($params['field']));

        $pluginSlug = "embedpress:{$params['pluginSlug']}";

        $options = (array)get_option($pluginSlug);

        $field->type = strtolower($field->type);

        if ($field->slug === "license_key") {
            $value = @$options['license']['key'];
        } else {
            $value = isset($options[$field->slug]) ? $options[$field->slug] : (isset($field->default) ? $field->default : '');
        }

        if (in_array($field->type, array('bool', 'boolean'))) {
            $html = self::radio(array(
                0 => 'No',
                1 => 'Yes'
            ), (int)$value);
        } else if (isset($field->options)) {
            $html = self::select((array)$field->options, (string)$value);
        } else if (in_array($field->type, array('textarea'))) {
            $html = self::textarea((string)$value);
        } else {
            $html = self::text((string)$value);
        }

        $html = str_replace('{{slug}}', $params['pluginSlug'], $html);
        $html = str_replace('{{name}}', $field->slug, $html);
        $html = str_replace('{{classes}}', implode(' ', (array)@$field->classes), $html);
        $html = str_replace('{{placeholder}}', (string)@$field->placeholder, $html);

        $html .= wp_nonce_field("{$pluginSlug}:nonce", "{$pluginSlug}:nonce");

        if ($field->slug === "license_key") {
            switch (trim(strtoupper(@$options['license']['status']))) {
                case '':
                    $licenseStatus = '<span class="ep-label-danger">' . __('Missing license.') . '</span>';
                    break;
                case 'EXPIRED':
                    $licenseStatus = '<span class="ep-label-danger">' . __('Your license key is expired.') . '</span>';
                    break;
                case 'REVOKED':
                    $licenseStatus = '<span class="ep-label-danger">' . __('Your license key has been disabled.') . '</span>';
                    break;
                case 'MISSING':
                case 'INVALID':
                    $licenseStatus = '<span class="ep-label-danger">' . __('Invalid license.') . '</span>';
                    break;
                case 'SITE_INACTIVE':
                    $licenseStatus = '<span class="ep-label-danger">' . __('Your license is not active for this URL.') . '</span>';
                    break;
                case 'ITEM_NAME_MISMATCH':
                    $licenseStatus = '<span class="ep-label-danger">' . __('This appears to be an invalid license key for this product.') . '</span>';
                    break;
                case 'NO_ACTIVATIONS_LEFT':
                    $licenseStatus = '<span class="ep-label-danger">' . __('Your license key has reached its activation limit.') . '</span>';
                    break;
                case 'VALID':
                    $licenseStatus = '<span class="ep-label-success">' . __('Activated.') . '</span>';
                    break;
                default:
                    $licenseStatus = '<span class="ep-label-danger">' . __('Not validated yet.') . '</span>';
                    break;
            }

            $html .= '<br/><br/><strong>Status: '. $licenseStatus .'</strong><br/><br/>';

            if (@$options['license']['status'] !== 'valid') {
                $html .= '<button type="submit" class="button-secondary">' . __('Activate License') . '</button> ';
                $html .= '<a href="https://pressshack.com/embedpress/docs/activate-license" target="_blank" class="ep-small-link ep-small-spacing">' . __('More information') . '</a>';
                $html .= '<br/><br/>';
            }

            $html .= '<hr>';
        }

        if (!empty($field->description)) {
            $html .= '<br/>';
            $html .= '<p class="description">'. $field->description .'</p>';
        }

        echo $html;
    }
}
