/**
 * EmbedPress Block Save Component
 */

import React from 'react';

const Save = ({ attributes }) => {
    const { url, width, height, responsive } = attributes;

    if (!url) {
        return null;
    }

    const style = {};
    if (width) style.width = width;
    if (height) style.height = height;

    return (
        <div 
            className={`embedpress-block ${responsive ? 'embedpress-block--responsive' : ''}`}
            style={style}
            data-url={url}
        >
            {/* The actual embed will be rendered by PHP */}
            <div className="embedpress-embed-placeholder">
                {url}
            </div>
        </div>
    );
};

export default Save;
