/**
 * EmbedControls Component
 * 
 * Controls for editing embedded content
 */

import React from 'react';
import { __ } from '@wordpress/i18n';
import { Button } from '@components';

const EmbedControls = ({
    showEditButton = true,
    onEdit,
    className = ''
}) => {
    if (!showEditButton) {
        return null;
    }

    return (
        <div className={`embedpress-controls ${className}`}>
            <div className="embedpress-controls__overlay">
                <div className="embedpress-controls__buttons">
                    <Button
                        variant="secondary"
                        size="small"
                        onClick={onEdit}
                        icon="edit"
                    >
                        {__('Edit', 'embedpress')}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EmbedControls;
