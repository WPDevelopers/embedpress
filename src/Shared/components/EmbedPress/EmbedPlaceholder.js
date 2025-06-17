/**
 * EmbedPlaceholder Component
 * 
 * Placeholder component for entering embed URLs
 */

import React, { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { Button } from '@components';

const EmbedPlaceholder = ({
    label,
    onSubmit,
    value,
    cannotEmbed,
    onChange,
    icon,
    docTitle,
    docLink,
    className = ''
}) => {
    const [inputValue, setInputValue] = useState(value || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(e);
    };

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        onChange?.(e);
    };

    return (
        <div className={`embedpress-placeholder ${className}`}>
            <div className="embedpress-placeholder__content">
                <div className="embedpress-placeholder__icon">
                    {typeof icon === 'string' ? (
                        <span className={`dashicons dashicons-${icon}`}></span>
                    ) : (
                        icon
                    )}
                </div>
                
                <h3 className="embedpress-placeholder__title">
                    {label}
                </h3>
                
                {cannotEmbed && (
                    <div className="embedpress-placeholder__error">
                        <p>{__('Sorry, this content could not be embedded.', 'embedpress')}</p>
                        <p>{__('Please check the URL and try again.', 'embedpress')}</p>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="embedpress-placeholder__form">
                    <input
                        type="url"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder={__('Enter URL to embed...', 'embedpress')}
                        className="embedpress-placeholder__input"
                        autoFocus
                    />
                    
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={!inputValue.trim()}
                    >
                        {__('Embed', 'embedpress')}
                    </Button>
                </form>
                
                {docLink && docTitle && (
                    <p className="embedpress-placeholder__help">
                        <a 
                            href={docLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="embedpress-placeholder__doc-link"
                        >
                            {docTitle}
                        </a>
                    </p>
                )}
            </div>
        </div>
    );
};

export default EmbedPlaceholder;
