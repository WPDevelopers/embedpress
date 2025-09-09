/**
 * EmbedPreview Component
 * 
 * A shared component for previewing embeds across different contexts.
 */

import React from 'react';
import classNames from 'classnames';

const EmbedPreview = ({
    url,
    width,
    height,
    responsive = true,
    loading = false,
    provider,
    embedData,
    onRefresh,
    className = ''
}) => {
    const previewClasses = classNames(
        'ep-embed-preview',
        {
            'ep-embed-preview--responsive': responsive,
            'ep-embed-preview--loading': loading,
        },
        className
    );

    if (loading) {
        return (
            <div className={previewClasses}>
                <div className="ep-embed-preview__loading">
                    <div className="ep-spinner"></div>
                    <p>Loading embed preview...</p>
                </div>
            </div>
        );
    }

    if (!url) {
        return (
            <div className={previewClasses}>
                <div className="ep-embed-preview__placeholder">
                    <p>Enter a URL to see the embed preview</p>
                </div>
            </div>
        );
    }

    const style = {};
    if (width) style.width = width;
    if (height) style.height = height;

    return (
        <div className={previewClasses} style={style}>
            <div className="ep-embed-preview__content">
                {embedData ? (
                    <div dangerouslySetInnerHTML={{ __html: embedData.html }} />
                ) : (
                    <div className="ep-embed-preview__fallback">
                        <p>Preview for: {url}</p>
                        <p>Provider: {provider || 'Unknown'}</p>
                        {onRefresh && (
                            <button onClick={onRefresh} className="ep-button ep-button--secondary">
                                Refresh Preview
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmbedPreview;
