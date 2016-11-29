<?php
namespace EmbedPress\Plugins\Html;

class Field
{
    protected static function text($value)
    {
        $html = '<input type="text" name="embedpress:{{slug}}[{{name}}]" class="{{classes}}" placeholder="{{placeholder}}" value="'. (string)$value .'">';

        return $html;
    }

    protected static function textarea($value)
    {
        $html = '<textarea name="embedpress:{{slug}}[{{name}}]" class="{{classes}}" placeholder="{{placeholder}}">'. (string)$value .'</textarea>';

        return $html;
    }

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

    public static function render($params)
    {
        $field = json_decode(json_encode($params['field']));

        $options = (array)get_option("embedpress:{$params['pluginSlug']}");

        $field->type = strtolower($field->type);

        $value = isset($options[$field->slug]) ? $options[$field->slug] : (isset($field->default) ? $field->default : '');

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
        $html = str_replace('{{placeholder}}', $field->placeholder, $html);

        if (!empty($field->description)) {
            $html .= '<br/>';
            $html .= '<p class="description">'. $field->description .'</p>';
        }

        echo $html;
    }
}
