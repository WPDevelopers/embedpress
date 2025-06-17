/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { Spinner } from "@wordpress/components";

/**
 * EmbedLoading Component
 * 
 * Displays a loading state while fetching embed content
 */
export default function EmbedLoading() {
    return (
        <div className="embedpress-loading">
            <Spinner />
            <p>{__('Embedding...', 'embedpress')}</p>
        </div>
    );
}
