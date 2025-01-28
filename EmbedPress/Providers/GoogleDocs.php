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

        error_log(print_r($data, true));

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
        $document_data = $this->fetch_google_doc($document_id);

        error_log(print_r($document_data, true));

        if (!$document_data || empty($document_data['body']['content'])) {
            return '<p>Error fetching document or no content available.</p>';
        }

        $html_content = '';

        // Loop through content elements
        foreach ($document_data['body']['content'] as $element) {
            $html_content .= $this->render_element($element);
        }

        return $html_content;
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
        }

        // Render other elements if needed
        return ''; // Return empty for unsupported elements
    }

    private function render_paragraph($paragraph)
    {
        $html = '';
        $tag = 'p'; // Default to paragraph

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

        // Start the paragraph/heading tag
        $html .= "<{$tag}>";

        // Render text runs (with styles)
        foreach ($paragraph['elements'] as $element) {
            if (isset($element['textRun'])) {
                $html .= $this->render_text_run($element['textRun']);
            }
        }

        // Close the paragraph/heading tag
        $html .= "</{$tag}>";
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

        // Add the actual text content
        $html .= $text;

        // Close tags in reverse order
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
        // Inline object ID
        $object_id = $inline_object_element['inlineObjectId'] ?? '';
        if (!$object_id) return '';

        // Image properties
        $image_properties = $this->get_inline_object_properties($object_id);
        if (!$image_properties) return '';

        $source = esc_url($image_properties['contentUri'] ?? '');
        $alt_text = esc_attr($image_properties['description'] ?? 'Image');

        return "<img src=\"{$source}\" alt=\"{$alt_text}\" style=\"max-width: 100%; height: auto;\" />";
    }

    private function get_inline_object_properties($object_id)
    {
        // Fetch inline object properties from the document data
        global $document_data; // Ensure document data is globally accessible
        return $document_data['inlineObjects'][$object_id]['inlineObjectProperties']['embeddedObject'] ?? null;
    }



    public function fakeResponse()
    {
        $iframeSrc = html_entity_decode($this->url);

        $document_id = $this->get_document_id($this->url);

        $data = $this->fetch_and_render_google_doc($document_id);

        error_log(print_r($data, true));

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
