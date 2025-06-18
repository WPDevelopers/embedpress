/**
 * EmbedPress Settings Component
 */

import React, { useState } from 'react';

const Settings = () => {
    const [settings, setSettings] = useState({
        enableAnalytics: true,
        enableSocialShare: true,
        enableCustomPlayer: false,
        enableAds: false,
        enableBranding: true
    });

    const handleSettingChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSave = () => {
        // Save settings logic here
        console.log('Saving settings:', settings);
    };

    return (
        <div className="embedpress-settings">
            <h1>Settings</h1>
            <p>Configure your EmbedPress settings.</p>
            
            <div className="settings-sections">
                <div className="settings-section">
                    <h3>General Settings</h3>
                    
                    <div className="setting-item">
                        <label>
                            <input
                                type="checkbox"
                                checked={settings.enableAnalytics}
                                onChange={(e) => handleSettingChange('enableAnalytics', e.target.checked)}
                            />
                            Enable Analytics
                        </label>
                        <p className="setting-description">
                            Track views, clicks, and other metrics for your embeds.
                        </p>
                    </div>
                    
                    <div className="setting-item">
                        <label>
                            <input
                                type="checkbox"
                                checked={settings.enableSocialShare}
                                onChange={(e) => handleSettingChange('enableSocialShare', e.target.checked)}
                            />
                            Enable Social Share
                        </label>
                        <p className="setting-description">
                            Add social sharing buttons to your embeds.
                        </p>
                    </div>
                    
                    <div className="setting-item">
                        <label>
                            <input
                                type="checkbox"
                                checked={settings.enableBranding}
                                onChange={(e) => handleSettingChange('enableBranding', e.target.checked)}
                            />
                            Enable Branding
                        </label>
                        <p className="setting-description">
                            Show EmbedPress branding on embeds.
                        </p>
                    </div>
                </div>
                
                <div className="settings-section">
                    <h3>Advanced Settings</h3>
                    
                    <div className="setting-item">
                        <label>
                            <input
                                type="checkbox"
                                checked={settings.enableCustomPlayer}
                                onChange={(e) => handleSettingChange('enableCustomPlayer', e.target.checked)}
                            />
                            Enable Custom Player
                        </label>
                        <p className="setting-description">
                            Use custom video player for better control.
                        </p>
                    </div>
                    
                    <div className="setting-item">
                        <label>
                            <input
                                type="checkbox"
                                checked={settings.enableAds}
                                onChange={(e) => handleSettingChange('enableAds', e.target.checked)}
                            />
                            Enable Ads
                        </label>
                        <p className="setting-description">
                            Show advertisements on your embeds.
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="settings-actions">
                <button onClick={handleSave} className="button button-primary">
                    Save Settings
                </button>
                
                <button className="button">
                    Reset to Defaults
                </button>
            </div>
        </div>
    );
};

export default Settings;
