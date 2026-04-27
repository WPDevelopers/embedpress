<?php

namespace EmbedPress\Includes\Classes;


// phpcs:disable WordPress.DB.PreparedSQL.NotPrepared
// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared
// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery
// phpcs:disable WordPress.DB.DirectDatabaseQuery.NoCaching
// phpcs:disable WordPress.DB.DirectDatabaseQuery.SchemaChange
// phpcs:disable PluginCheck.Security.DirectDB.UnescapedDBParameter
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals
// phpcs:disable WordPress.PHP.DevelopmentFunctions
// phpcs:disable WordPress.Security.NonceVerification.Missing
// phpcs:disable WordPress.Security.NonceVerification.Recommended
// phpcs:disable WordPress.Security.ValidatedSanitizedInput.MissingUnslash
// phpcs:disable WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
// phpcs:disable WordPress.Security.ValidatedSanitizedInput.InputNotValidated
// phpcs:disable Squiz.PHP.DiscouragedFunctions.Discouraged
// phpcs:disable PluginCheck.CodeAnalysis.ShortURL.Found
// phpcs:disable WordPress.WP.EnqueuedResourceParameters.MissingVersion

(defined('ABSPATH')) or die("No direct script access allowed.");

/**
 * Handles PDF thumbnail generation and upload via AJAX.
 * Extracted from Embedpress_Pdf_Gallery to avoid Elementor dependency.
 */
class Pdf_Thumbnail_Handler
{
    /**
     * AJAX handler: generate a thumbnail for a PDF attachment.
     */
    public static function ajax_generate_pdf_thumbnail()
    {
        check_ajax_referer('ep_pdf_gallery_nonce', 'nonce');

        if (!current_user_can('upload_files')) {
            wp_send_json_error(['message' => 'Insufficient permissions']);
        }

        $attachment_id = isset($_POST['attachment_id']) ? intval($_POST['attachment_id']) : 0;
        if (!$attachment_id) {
            wp_send_json_error(['message' => 'Invalid attachment ID']);
        }

        // Verify it's a PDF
        if (get_post_mime_type($attachment_id) !== 'application/pdf') {
            wp_send_json_error(['message' => 'Not a PDF file']);
        }

        // Check cached thumbnail first (stored as post meta on the PDF attachment)
        $cached_thumb_id = get_post_meta($attachment_id, '_ep_pdf_thumbnail_id', true);
        if ($cached_thumb_id) {
            $cached_url = wp_get_attachment_url($cached_thumb_id);
            if ($cached_url) {
                wp_send_json_success([
                    'url' => $cached_url,
                    'id'  => (int) $cached_thumb_id,
                ]);
                return;
            }
            // Cached thumbnail attachment no longer exists, clear stale meta
            delete_post_meta($attachment_id, '_ep_pdf_thumbnail_id');
        }

        // Method 1: WordPress already generated a preview during upload
        $thumb_src = wp_get_attachment_image_src($attachment_id, 'medium');
        if ($thumb_src && !empty($thumb_src[0])) {
            wp_send_json_success([
                'url' => $thumb_src[0],
                'id'  => $attachment_id,
            ]);
            return;
        }

        // Method 2: Try regenerating attachment metadata (triggers WP PDF preview)
        $file_path = get_attached_file($attachment_id);
        if ($file_path && file_exists($file_path)) {
            require_once ABSPATH . 'wp-admin/includes/image.php';
            $metadata = wp_generate_attachment_metadata($attachment_id, $file_path);
            if (!empty($metadata)) {
                wp_update_attachment_metadata($attachment_id, $metadata);
                $thumb_src = wp_get_attachment_image_src($attachment_id, 'medium');
                if ($thumb_src && !empty($thumb_src[0])) {
                    wp_send_json_success([
                        'url' => $thumb_src[0],
                        'id'  => $attachment_id,
                    ]);
                    return;
                }
            }
        }

        // Method 3: Direct Imagick rendering as last resort
        if (class_exists('Imagick') && $file_path && file_exists($file_path)) {
            try {
                $imagick = new \Imagick();
                $imagick->setResolution(200, 200);
                $imagick->readImage($file_path . '[0]');
                $imagick->setImageFormat('png');
                $imagick->setImageAlphaChannel(\Imagick::ALPHACHANNEL_REMOVE);
                $imagick->setImageBackgroundColor('white');
                $imagick = $imagick->flattenImages();
                $imagick->thumbnailImage(800, 0);

                $upload_dir = wp_upload_dir();
                $base_name  = pathinfo(basename($file_path), PATHINFO_FILENAME);
                $thumb_file = 'pdf-thumb-' . sanitize_file_name($base_name) . '.png';
                $thumb_path = trailingslashit($upload_dir['path']) . $thumb_file;

                $imagick->writeImage($thumb_path);
                $imagick->destroy();

                $attachment = [
                    'post_mime_type' => 'image/png',
                    'post_title'    => sanitize_file_name($base_name) . ' - PDF Thumbnail',
                    'post_content'  => '',
                    'post_status'   => 'inherit',
                ];

                $thumb_id = wp_insert_attachment($attachment, $thumb_path);
                if (!is_wp_error($thumb_id)) {
                    $meta = wp_generate_attachment_metadata($thumb_id, $thumb_path);
                    wp_update_attachment_metadata($thumb_id, $meta);

                    // Cache thumbnail ID on the PDF attachment for future lookups
                    update_post_meta($attachment_id, '_ep_pdf_thumbnail_id', $thumb_id);

                    wp_send_json_success([
                        'url' => wp_get_attachment_url($thumb_id),
                        'id'  => $thumb_id,
                    ]);
                    return;
                }
            } catch (\Exception $e) {
                // Imagick failed, fall through
            }
        }

        wp_send_json_error(['message' => 'Could not generate thumbnail']);
    }

    /**
     * AJAX handler: receive a client-rendered thumbnail (base64 PNG) and save as WP attachment.
     */
    public static function ajax_upload_pdf_thumbnail()
    {
        check_ajax_referer('ep_pdf_gallery_nonce', 'nonce');

        if (!current_user_can('upload_files')) {
            wp_send_json_error(['message' => 'Insufficient permissions']);
        }

        $image_data    = isset($_POST['image_data']) ? $_POST['image_data'] : '';
        $pdf_url       = isset($_POST['pdf_url']) ? esc_url_raw($_POST['pdf_url']) : '';
        $file_name     = isset($_POST['file_name']) ? sanitize_file_name($_POST['file_name']) : '';
        $attachment_id = isset($_POST['attachment_id']) ? intval($_POST['attachment_id']) : 0;

        if (empty($image_data) || empty($pdf_url)) {
            wp_send_json_error(['message' => 'Missing data']);
        }

        // Check cached thumbnail for this PDF attachment
        if ($attachment_id) {
            $cached_thumb_id = get_post_meta($attachment_id, '_ep_pdf_thumbnail_id', true);
            if ($cached_thumb_id) {
                $cached_url = wp_get_attachment_url($cached_thumb_id);
                if ($cached_url) {
                    wp_send_json_success([
                        'url' => $cached_url,
                        'id'  => (int) $cached_thumb_id,
                    ]);
                    return;
                }
                // Stale meta, clear it
                delete_post_meta($attachment_id, '_ep_pdf_thumbnail_id');
            }
        }

        // Strip data-URI prefix
        $image_data = preg_replace('/^data:image\/\w+;base64,/', '', $image_data);
        $decoded    = base64_decode($image_data);
        if (!$decoded || strlen($decoded) < 8) {
            wp_send_json_error(['message' => 'Invalid image data']);
        }

        // Detect MIME from raw bytes
        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $mime  = $finfo->buffer($decoded);
        if ($mime !== 'image/png' && $mime !== 'image/jpeg') {
            wp_send_json_error(['message' => 'Invalid image format']);
        }

        $ext        = ($mime === 'image/jpeg') ? '.jpg' : '.png';
        $upload_dir = wp_upload_dir();
        $base_name  = $file_name ? pathinfo($file_name, PATHINFO_FILENAME) : md5($pdf_url);
        $thumb_file = 'pdf-thumb-' . sanitize_file_name($base_name) . $ext;
        $thumb_path = trailingslashit($upload_dir['path']) . $thumb_file;

        // Avoid overwriting existing files
        $counter = 0;
        while (file_exists($thumb_path)) {
            $counter++;
            $thumb_file = 'pdf-thumb-' . sanitize_file_name($base_name) . '-' . $counter . $ext;
            $thumb_path = trailingslashit($upload_dir['path']) . $thumb_file;
        }

        // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_file_put_contents
        file_put_contents($thumb_path, $decoded);

        $attachment = [
            'post_mime_type' => $mime,
            'post_title'    => sanitize_file_name($base_name) . ' - PDF Thumbnail',
            'post_content'  => '',
            'post_status'   => 'inherit',
        ];

        $thumb_id = wp_insert_attachment($attachment, $thumb_path);
        if (is_wp_error($thumb_id)) {
            wp_send_json_error(['message' => 'Failed to create attachment']);
        }

        require_once ABSPATH . 'wp-admin/includes/image.php';
        $meta = wp_generate_attachment_metadata($thumb_id, $thumb_path);
        wp_update_attachment_metadata($thumb_id, $meta);

        // Cache thumbnail ID on the PDF attachment for future lookups
        if ($attachment_id) {
            update_post_meta($attachment_id, '_ep_pdf_thumbnail_id', $thumb_id);
        }

        wp_send_json_success([
            'url' => wp_get_attachment_url($thumb_id),
            'id'  => $thumb_id,
        ]);
    }
}
