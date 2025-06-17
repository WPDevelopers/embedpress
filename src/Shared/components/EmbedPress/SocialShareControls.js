/**
 * SocialShareControls Component
 * 
 * Controls for enabling/disabling social sharing options.
 */

import React from 'react';
import { Toggle } from '@components';

const SocialShareControls = ({
    facebook = true,
    twitter = true,
    pinterest = true,
    linkedin = true,
    onChange
}) => {
    const platforms = [
        { key: 'Facebook', label: 'Facebook', value: facebook },
        { key: 'Twitter', label: 'Twitter/X', value: twitter },
        { key: 'Pinterest', label: 'Pinterest', value: pinterest },
        { key: 'Linkedin', label: 'LinkedIn', value: linkedin },
    ];

    return (
        <div className="ep-social-share-controls">
            <p className="ep-social-share-controls__description">
                Choose which social platforms to show sharing buttons for:
            </p>
            
            <div className="ep-social-share-controls__options">
                {platforms.map(platform => (
                    <Toggle
                        key={platform.key}
                        label={platform.label}
                        checked={platform.value}
                        onChange={(enabled) => onChange?.(platform.key, enabled)}
                    />
                ))}
            </div>
        </div>
    );
};

export default SocialShareControls;
