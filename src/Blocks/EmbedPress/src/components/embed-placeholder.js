/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
import { Button, Placeholder } from "@wordpress/components";

/**
 * Internal dependencies
 */
import { linkIcon } from "./icons.js";

/**
 * EmbedPlaceholder Component
 * 
 * Displays a placeholder for entering embed URLs
 */
export default function EmbedPlaceholder({
    label,
    onSubmit,
    value,
    cannotEmbed,
    onChange,
    icon,
    DocTitle,
    docLink
}) {
    const [url, setUrl] = useState(value || '');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (url.trim()) {
            onSubmit(event);
        }
    };

    const handleChange = (event) => {
        const newValue = event.target.value;
        setUrl(newValue);
        if (onChange) {
            onChange(event);
        }
    };

    return (
        <Placeholder
            icon={icon || linkIcon}
            label={label || __('EmbedPress', 'embedpress')}
            className="embedpress-placeholder"
            instructions={__('Paste a URL to embed content from 150+ providers', 'embedpress')}
        >
            <form onSubmit={handleSubmit} className="embedpress-placeholder-form">
                <input
                    type="url"
                    value={url}
                    className="embedpress-placeholder-input"
                    placeholder={__('Enter URL to embed here...', 'embedpress')}
                    onChange={handleChange}
                />
                <Button
                    type="submit"
                    variant="primary"
                    disabled={!url.trim()}
                >
                    {__('Embed', 'embedpress')}
                </Button>
            </form>
            
            {cannotEmbed && (
                <div className="embedpress-placeholder-error">
                    {__('Sorry, this content could not be embedded.', 'embedpress')}
                </div>
            )}
            
            {DocTitle && docLink && (
                <div className="embedpress-placeholder-help">
                    <a 
                        href={docLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="embedpress-placeholder-help-link"
                    >
                        {DocTitle}
                    </a>
                </div>
            )}
        </Placeholder>
    );
}
