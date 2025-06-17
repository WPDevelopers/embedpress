/**
 * WordPress dependencies
 */
import { useBlockProps } from "@wordpress/block-editor";

/**
 * Save component for EmbedPress block
 * 
 * This is a dynamic block, so we return null here.
 * The actual rendering is handled by the PHP render callback.
 */
export default function Save() {
    return null;
}
