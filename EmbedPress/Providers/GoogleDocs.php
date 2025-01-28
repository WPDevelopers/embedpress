<?php

namespace EmbedPress\Providers;

use Embera\Provider\ProviderAdapter;
use Embera\Provider\ProviderInterface;
use Embera\Url;

(defined('ABSPATH') && defined('EMBEDPRESS_IS_LOADED')) or die("No direct script access allowed.");

/**
 * Entity responsible to support GoogleDocs embeds.
 *
 * @package     EmbedPress
 * @subpackage  EmbedPress/Providers
 * @author      EmbedPress <help@embedpress.com>
 * @copyright   Copyright (C) 2023 WPDeveloper. All rights reserved.
 * @license     GPLv3 or later
 * @since       1.0.0
 */
class GoogleDocs extends ProviderAdapter implements ProviderInterface
{
    /**
     * Method that verifies if the embed URL belongs to GoogleDocs.
     *
     * @param Url $url
     * @return  boolean
     * @since   1.0.0
     *
     */
    public function validateUrl(Url $url)
    {
        return (bool) preg_match(
            '~http[s]?:\/\/((?:www\.)?docs\.google\.com\/(?:.*/)?(?:document|presentation|spreadsheets|forms|drawings)\/[a-z0-9\/\?=_\-\.\,&%\$#\@\!\+]*)~i',
            $url
        );
    }

    /**
     * This method fakes an Oembed response.
     *
     * @since   1.0.0
     *
     * @return  array
     */

    public function get_document_id($url)
    {
        $pattern = '/\/d\/([a-zA-Z0-9_-]+)\//';
        preg_match($pattern, $url, $matches);
        return isset($matches[1]) ? $matches[1] : null;
    }

    public function get_access_token()
    {
        $use_id = '116346541454387891106';
        $user_info = get_option('google_user_info', []);
        $access_token = $user_info[$use_id]['access_token'];

        return $access_token;
    }

    public function fetch_google_doc($document_id)
    {
        $access_token = $this->get_access_token();

        // Google Docs API URL
        $url = "https://docs.googleapis.com/v1/documents/{$document_id}";

        // Set up request headers
        $headers = [
            'Authorization' => 'Bearer ' . $access_token,
            'Accept'        => 'application/json',
        ];

        // Perform the GET request
        $response = wp_remote_get($url, [
            'headers' => $headers,
        ]);

        // Check for errors in the response
        if (is_wp_error($response)) {
            error_log('Error fetching document: ' . $response->get_error_message());
            return false;
        }

        // Parse the response body
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);

        if (isset($data['error'])) {
            error_log('Error fetching document: ' . $data['error']['message']);
            return false;
        }

        // Document fetched successfully
        return $data;
    }

    public function fetch_and_render_google_doc($document_id)
    {
        // Fetch the document
        $this->document_data = $this->fetch_google_doc($document_id);

        if (!$this->document_data || empty($this->document_data['body']['content'])) {
            return '<p>Error fetching document or no content available.</p>';
        }

        $html_content = '';

        // Loop through content elements
        foreach ($this->document_data['body']['content'] as $element) {
            $html_content .= $this->render_element($element);
        }

        // Render inline objects (images, etc.)
        if (isset($this->document_data['inlineObjects'])) {
            foreach ($this->document_data['inlineObjects'] as $object_id => $inline_object) {
                $html_content .= $this->render_inline_object($object_id, $inline_object);
            }
        }

        // Apply styles to the rendered content
        return $this->render_document_with_styles($html_content);
    }

    private function render_inline_object($object_id, $inline_object)
    {
        // Ensure inline object has properties
        if (!isset($inline_object['inlineObjectProperties']['embeddedObject'])) {
            return '';
        }

        $embedded_object = $inline_object['inlineObjectProperties']['embeddedObject'];

        // Check for image properties
        if (!isset($embedded_object['imageProperties']['contentUri'])) {
            return ''; // Skip non-image objects
        }

        $content_uri = esc_url($embedded_object['imageProperties']['contentUri']);
        $alt_text = esc_attr($embedded_object['description'] ?? 'Image');
        $width = isset($embedded_object['size']['width']['magnitude']) ? $embedded_object['size']['width']['magnitude'] . 'pt' : 'auto';
        $height = isset($embedded_object['size']['height']['magnitude']) ? $embedded_object['size']['height']['magnitude'] . 'pt' : 'auto';

        // Render image
        return "<img src=\"{$content_uri}\" alt=\"{$alt_text}\" style=\"width: {$width}; height: {$height}; margin: 9pt;\" />";
    }



    private function render_element($element)
    {

        // Render paragraphs
        if (isset($element['paragraph'])) {
            return $this->render_paragraph($element['paragraph']);
        }

        // Render tables
        if (isset($element['table'])) {
            return $this->render_table($element['table']);
        }

        // Render images (inlineObjects)
        if (isset($element['inlineObjectElement'])) {
            return $this->render_image($element['inlineObjectElement']);
            error_log(print_r($element['inlineObjectElement'], true));
        } else {
            error_log(print_r('Noting founed', true));
        }

        // Render lists (ordered and unordered)
        if (isset($element['list'])) {
            return $this->render_list($element['list']);
        }

        // Render blockquotes
        if (isset($element['blockQuote'])) {
            return $this->render_blockquote($element['blockQuote']);
        }

        // Render code blocks
        if (isset($element['preformatted'])) {
            return $this->render_code_block($element['preformatted']);
        }

        // Render other elements if needed
        return ''; // Return empty for unsupported elements
    }

    private function render_list($list)
    {
        $html = '';

        // Check if it's an ordered or unordered list
        if ($list['listProperties']['listId'] == 'ORDERED') {
            $html .= '<ol>';
        } else {
            $html .= '<ul>';
        }

        // Loop through the list items and render each one
        foreach ($list['listItems'] as $item) {
            $html .= '<li>';

            // Render the list item content (usually a paragraph)
            if (isset($item['paragraph'])) {
                $html .= $this->render_paragraph($item['paragraph']);
            }

            $html .= '</li>';
        }

        // Close the list tag
        $html .= ($list['listProperties']['listId'] == 'ORDERED') ? '</ol>' : '</ul>';

        return $html;
    }

    private function render_blockquote($blockquote)
    {
        $html = '<blockquote>';

        // Render the content of the blockquote (typically a paragraph)
        if (isset($blockquote['content'][0]['paragraph'])) {
            $html .= $this->render_paragraph($blockquote['content'][0]['paragraph']);
        }

        $html .= '</blockquote>';
        return $html;
    }

    private function render_code_block($preformatted)
    {
        $html = '<pre><code>';

        // Render the content of the preformatted text (often code)
        if (isset($preformatted['content'][0]['paragraph'])) {
            $html .= $this->render_paragraph($preformatted['content'][0]['paragraph']);
        }

        $html .= '</code></pre>';
        return $html;
    }


    private function render_paragraph($paragraph)
    {
        $html = '';

        // Detect if the paragraph is part of a list
        if (isset($paragraph['bullet'])) {
            $listId = $paragraph['bullet']['listId'];
            return $this->render_list_item($listId, $paragraph);
        }

        $tag = 'p'; // Default tag for normal text

        // Detect heading styles
        if (isset($paragraph['paragraphStyle']['namedStyleType'])) {
            switch ($paragraph['paragraphStyle']['namedStyleType']) {
                case 'HEADING_1':
                    $tag = 'h1';
                    break;
                case 'HEADING_2':
                    $tag = 'h2';
                    break;
                case 'HEADING_3':
                    $tag = 'h3';
                    break;
                case 'HEADING_4':
                    $tag = 'h4';
                    break;
                case 'HEADING_5':
                    $tag = 'h5';
                    break;
                case 'HEADING_6':
                    $tag = 'h6';
                    break;
            }
        }

        // Open tag
        $html .= "<{$tag}>";

        // Render text runs (with inline styles)
        foreach ($paragraph['elements'] as $element) {
            if (isset($element['textRun'])) {
                $html .= $this->render_text_run($element['textRun']);
            } elseif (isset($element['inlineObjectElement'])) {
                $object_id = $element['inlineObjectElement']['inlineObjectId'] ?? '';
                if ($object_id && isset($this->document_data['inlineObjects'][$object_id])) {
                    $html .= $this->render_inline_object($object_id, $this->document_data['inlineObjects'][$object_id]);
                }
            }
        }

        // Close tag
        $html .= "</{$tag}>";
        return $html;
    }


    private function render_list_item($listId, $paragraph)
    {
        static $openLists = []; // Track open lists to avoid reopening/closing incorrectly
        $listType = 'ul'; // Default to unordered list

        // Get the list properties
        if (isset($this->document_data['lists'][$listId]['listProperties'])) {
            $listProps = $this->document_data['lists'][$listId]['listProperties'];
            $glyphType = $listProps['nestingLevels'][0]['glyphType'] ?? '';

            // Check for ordered lists
            if ($glyphType === 'DECIMAL') {
                $listType = 'ol';
            }
        }

        // Open the list if not already open
        if (!isset($openLists[$listId])) {
            $openLists[$listId] = true;
            $html = "<{$listType}>";
        } else {
            $html = '';
        }

        // Add the list item
        $html .= '<li>';

        foreach ($paragraph['elements'] as $element) {
            if (isset($element['textRun'])) {
                $html .= $this->render_text_run($element['textRun']);
            }
        }

        $html .= '</li>';

        // Close the list if this is the last item (logic to determine the end can be enhanced)
        // For simplicity, we'll assume lists end when a non-list paragraph is encountered.
        if (!isset($this->next_paragraph_is_list)) {
            $html .= "</{$listType}>";
            unset($openLists[$listId]);
        }

        return $html;
    }

    private function render_text_run($text_run)
    {
        $text = isset($text_run['content']) ? esc_html($text_run['content']) : '';
        $styles = $text_run['textStyle'] ?? [];
        $html = '';

        // Apply text styles
        if (!empty($styles['bold'])) $html .= '<strong>';
        if (!empty($styles['italic'])) $html .= '<em>';
        if (!empty($styles['underline'])) $html .= '<u>';
        if (!empty($styles['strikethrough'])) $html .= '<s>';
        if (!empty($styles['link']['url'])) {
            $url = esc_url($styles['link']['url']);
            $html .= "<a href=\"{$url}\">";
        }

        // Apply font size or color if present
        if (!empty($styles['fontSize'])) {
            $html .= "<span style='font-size: {$styles['fontSize']}px;'>";
        }
        if (!empty($styles['foregroundColor']['color']['rgbColor'])) {
            $color = $styles['foregroundColor']['color']['rgbColor'];
            $hex = sprintf('#%02x%02x%02x', $color['red'] * 255, $color['green'] * 255, $color['blue'] * 255);
            $html .= "<span style='color: {$hex};'>";
        }

        // Add the actual text content
        $html .= $text;

        // Close tags in reverse order
        if (!empty($styles['foregroundColor']['color']['rgbColor'])) $html .= '</span>';
        if (!empty($styles['fontSize'])) $html .= '</span>';
        if (!empty($styles['link']['url'])) $html .= '</a>';
        if (!empty($styles['strikethrough'])) $html .= '</s>';
        if (!empty($styles['underline'])) $html .= '</u>';
        if (!empty($styles['italic'])) $html .= '</em>';
        if (!empty($styles['bold'])) $html .= '</strong>';

        return $html;
    }

    private function render_table($table)
    {
        $html = '<table border="1" style="border-collapse: collapse; width: 100%;">';
        foreach ($table['tableRows'] as $row) {
            $html .= '<tr>';
            foreach ($row['tableCells'] as $cell) {
                $html .= '<td>';
                foreach ($cell['content'] as $content) {
                    if (isset($content['paragraph'])) {
                        $html .= $this->render_paragraph($content['paragraph']);
                    }
                }
                $html .= '</td>';
            }
            $html .= '</tr>';
        }
        $html .= '</table>';
        return $html;
    }

    private function render_image($inline_object_element)
    {
        // Get the inline object ID
        $object_id = $inline_object_element['inlineObjectId'] ?? '';

        if (!$object_id) {
            return ''; // No object ID, no image to render
        }

        // Fetch the inline object properties
        $inline_object = $this->document_data['inlineObjects'][$object_id] ?? null;

        if (!$inline_object || !isset($inline_object['inlineObjectProperties']['embeddedObject'])) {
            return ''; // No inline object or missing embedded object
        }

        $embedded_object = $inline_object['inlineObjectProperties']['embeddedObject'];

        // Check for image properties
        if (!isset($embedded_object['imageProperties']['contentUri'])) {
            return ''; // Skip non-image objects
        }

        // Extract image data
        $content_uri = esc_url($embedded_object['imageProperties']['contentUri']);
        $alt_text = esc_attr($embedded_object['description'] ?? 'Image'); // Alt text (default to "Image" if missing)

        // Optional: Get image dimensions
        $width = isset($embedded_object['size']['width']['magnitude']) ? $embedded_object['size']['width']['magnitude'] . 'pt' : 'auto';
        $height = isset($embedded_object['size']['height']['magnitude']) ? $embedded_object['size']['height']['magnitude'] . 'pt' : 'auto';

        // Render the image
        return "<img src=\"{$content_uri}\" alt=\"{$alt_text}\" style=\"width: {$width}; height: {$height}; margin: 9pt;\" />";
    }

    private function get_inline_object_properties($object_id)
    {
        // Check if inline object exists in document data
        return $this->document_data['inlineObjects'][$object_id]['inlineObjectProperties']['embeddedObject'] ?? null;
    }

    private function render_document_with_styles($html_content)
    {
        $style = '
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                line-height: 1.5;
            }
            h1, h2, h3, h4, h5, h6 {
                font-family: "Arial", sans-serif;
                font-weight: bold;
            }
            p {
                margin: 0 0 15px 0;
            }
            a {
                color: #1a0dab;
                text-decoration: none;
            }
            u {
                text-decoration: underline;
            }
            s {
                text-decoration: line-through;
            }
            .google-docs-table {
                border-collapse: collapse;
                width: 100%;
            }
            .google-docs-table td, .google-docs-table th {
                border: 1px solid #ddd;
                padding: 8px;
            }
        </style>
    ';

        return $style . $html_content;
    }





    public function fakeResponse()
    {
        $iframeSrc = html_entity_decode($this->url);

        $document_id = $this->get_document_id($this->url);

        $data = $this->fetch_and_render_google_doc($document_id);

        // Check the type of document
        preg_match('~google\.com/(?:.+/)?(document|presentation|spreadsheets|forms|drawings)/~i', $iframeSrc, $matches);
        $type = $matches[1];

        switch ($type) {
            case 'document':
                // Check if the url still doesn't have the embedded param, and add if needed
                if (!preg_match('~([?&])embedded=true~i', $iframeSrc, $matches)) {
                    if (substr_count($iframeSrc, '?')) {
                        $iframeSrc .= '&embedded=true';
                    } else {
                        $iframeSrc .= '?embedded=true';
                    }
                }
                break;

            case 'presentation':
                // Convert the /pub to /embed if needed
                if (preg_match('~/pub\?~i', $iframeSrc)) {
                    $iframeSrc = str_replace('/pub?', '/embed?', $iframeSrc);
                }
                break;

            case 'spreadsheets':
                if (substr_count($iframeSrc, '?')) {
                    $query = explode('?', $iframeSrc);
                    $query = $query[1];
                    $query = explode('&', $query);

                    if (!empty($query)) {
                        $hasWidgetParam  = false;
                        $hasHeadersParam = false;

                        foreach ($query as $param) {
                            if (substr_count($param, 'widget=')) {
                                $hasWidgetParam = true;
                            } elseif (substr_count($param, 'headers=')) {
                                $hasHeadersParam = true;
                            }
                        }

                        if (!$hasWidgetParam) {
                            $iframeSrc .= '&widget=true';
                        }

                        if (!$hasHeadersParam) {
                            $iframeSrc .= '&headers=false';
                        }
                    }
                } else {
                    $iframeSrc .= '?widget=true&headers=false';
                }
                break;

            case 'forms':
            case 'drawings':
                break;
        }


        $width = isset($this->config['maxwidth']) ? $this->config['maxwidth'] : 600;
        $height = isset($this->config['maxheight']) ? $this->config['maxheight'] : 450;
        if ($type !== 'drawings') {
            $html = '<iframe src="' . esc_url($iframeSrc) . '" frameborder="0" width="' . $width . '" height="' . $height . '" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>';
        } else {
            $width = isset($this->config['maxwidth']) ? $this->config['maxwidth'] : 960;
            $height = isset($this->config['maxheight']) ? $this->config['maxheight'] : 720;
            $html = '<img src="' . esc_url($iframeSrc) . '" width="' . esc_attr($width) . '" height="' . esc_attr($height) . '" />';
        }

        $html = $data;

        return [
            'type'          => 'rich',
            'provider_name' => 'Google Docs',
            'provider_url'  => 'https://docs.google.com',
            'title'         => 'Unknown title',
            'html'          => $html,
            'wrapper_class' => 'ose-google-docs-' . $type,
        ];
    }

    /** inline @inheritDoc */
    public function modifyResponse(array $response = [])
    {
        return $this->fakeResponse();
    }
}
