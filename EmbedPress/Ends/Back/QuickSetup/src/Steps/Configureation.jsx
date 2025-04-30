import React, { useState, useEffect } from "react";
import HeaderSteps from "./HeaderSteps";
import Navigation from "./Navigation";
import LogoAdjuster from "./LogoAdjuster";

const proFeatures = [
    { title: "YouTube Custom Branding", provider: "youtube" },
    { title: "Vimeo Custom Branding", provider: "vimeo" },
    { title: "Wistia Custom Branding", provider: "wistia" },
    { title: "Twitch Custom Branding", provider: "twitch" },
    { title: "Dailymotion Custom Branding", provider: "dailymotion" },
    { title: "Document Custom Branding", provider: "document" },
];

const Configuration = ({ step, setStep, settings, setSettings }) => {
    const [featureToggles, setFeatureToggles] = useState(
        proFeatures.reduce((acc, feature) => {
            acc[feature.title] = false;
            return acc;
        }, {})
    );

    const [brandingData, setBrandingData] = useState(quickSetup?.brandingData || {});

    useEffect(() => {
        // Initialize feature toggles based on branding settings
        if (quickSetup?.brandingData) {
            const initialToggles = {};
            proFeatures.forEach(feature => {
                const providerData = quickSetup.brandingData[feature.provider];
                initialToggles[feature.title] = providerData?.branding === 'yes';
            });
            setFeatureToggles(initialToggles);
        }
    }, []);

    const handleSettingChange = (name, value) => {
        setSettings({
            ...settings,
            [name]: value
        });
    };

    const handleToggleChange = (featureTitle, checked) => {
        setFeatureToggles(prev => ({
            ...prev,
            [featureTitle]: checked
        }));
    };

    const handleBrandingChange = (provider, brandingSettings) => {
        setBrandingData(prev => ({
            ...prev,
            [provider]: {
                ...prev[provider],
                ...brandingSettings
            }
        }));
    };

    // Save settings before going to next step
    const handleSaveSettings = () => {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('ep_settings_nonce', quickSetup?.nonce || '');
            formData.append('submit', 'general');
            formData.append('action', 'embedpress_quicksetup_save_settings');

            // Add all current settings
            for (const key in settings) {
                if (settings.hasOwnProperty(key)) {
                    let value = settings[key];
                    if (typeof value === 'boolean') {
                        value = value ? '1' : '0';
                    }
                    formData.append(key, value);
                }
            }

            // Add branding data for each provider
            Object.entries(brandingData).forEach(([provider, data]) => {
                Object.entries(data).forEach(([key, value]) => {
                    formData.append(`${provider}_${key}`, value);
                });
            });

            fetch(quickSetup.ajaxurl, {
                method: 'POST',
                body: formData,
                credentials: 'same-origin'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Settings saved successfully');
                    resolve();
                } else {
                    console.error('Failed to save settings:', data);
                    reject(new Error('Failed to save settings'));
                }
            })
            .catch(error => {
                console.error('Error saving settings:', error);
                reject(error);
            });
        });
    };

    return (
        <>
            <HeaderSteps step={step} setStep={setStep} />
            <section className="section epob-configuration_section">
                <div className="epob-container">
                    <div className="epob-configuration_header-wrapper">
                        <h2 className="epob-header">Complete Basic Configuration</h2>
                        <p className="epob-title">
                            Setup global embedding settings, you can update them anytime from
                            EmbedPress dashboard
                        </p>
                    </div>
                    <div className="epob-configur_wrapper">
                        <div className="epob-setting_wrapper">
                            <h3 className="epob-settion_header">Global Embed Settings</h3>
                            <div className="epob-setting">
                                <div className="epob-row_style">
                                    <div className="flex-1">
                                        <h4 className="epob-title">Embed iFrame Width</h4>
                                    </div>
                                    <div className="epob-toggle_switch epob-px_input">
                                        <form action="#">
                                            <input
                                                type="number"
                                                placeholder={600}
                                                value={settings.embedWidth}
                                                onChange={(e) => handleSettingChange('embedWidth', e.target.value)}
                                                className="epob-64_px"
                                            />
                                            <label>px</label>
                                        </form>
                                    </div>
                                </div>
                                <div className="epob-row_style">
                                    <div className="flex-1">
                                        <h4 className="epob-title">Embed iFrame Height</h4>
                                    </div>
                                    <div className="epob-toggle_switch epob-px_input">
                                        <form action="#">
                                            <input
                                                type="number"
                                                placeholder={600}
                                                value={settings.embedHeight}
                                                onChange={(e) => handleSettingChange('embedHeight', e.target.value)}
                                                className="epob-64_px"
                                            />
                                            <label>px</label>
                                        </form>
                                    </div>
                                </div>
                                <div className="epob-row_style">
                                    <div className="flex-1">
                                        <h4 className="epob-title">PDF Custom Color</h4>
                                    </div>
                                    <div className="epob-toggle_switch epob-px_input">
                                        <form action="#" className="epob-on_off-btn_style">
                                            <label className="epob-on_off">OFF</label>
                                            <label className="epob-switch">
                                                <input
                                                    type="checkbox"
                                                    checked={settings.pdfCustomColor}
                                                    onChange={(e) => handleSettingChange('pdfCustomColor', e.target.checked)}
                                                />
                                                <span className="epob-slider epob-round" />
                                            </label>
                                            <label className="epob-on_off">ON</label>
                                        </form>
                                    </div>
                                </div>
                                <div style={{ display: settings.pdfCustomColor ? 'block' : 'none', marginTop: '10px' }}>
                                    <div className="epob-row_style">
                                        <div className="flex-1">
                                            <h4 className="epob-title">Select Color</h4>
                                        </div>
                                        <div className="epob-toggle_switch epob-px_input">
                                            <input
                                                type="color"
                                                value={settings.customColor}
                                                onChange={(e) => handleSettingChange('customColor', e.target.value)}
                                                className="epob-color_picker"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="epob-row_style">
                                    <div className="flex-1">
                                        <h4 className="epob-title">Powered by EmbedPress</h4>
                                    </div>
                                    <div className="epob-toggle_switch epob-px_input">
                                        <form action="#" className="epob-on_off-btn_style">
                                            <label className="epob-on_off">OFF</label>
                                            <label className="epob-switch">
                                                <input
                                                    type="checkbox"
                                                    checked={settings.poweredByEmbedPress}
                                                    onChange={(e) => handleSettingChange('poweredByEmbedPress', e.target.checked)}
                                                />
                                                <span className="epob-slider epob-round" />
                                            </label>
                                            <label className="epob-on_off">ON</label>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="epob-pro_embedding-features_wrapper">
                            <h3 className="epob-settion_header">Pro Embedding Features</h3>
                            <div className="epob-pro_features">
                                {proFeatures.map((feature, index) => (
                                    <>
                                        <div className="epob-row_style" key={index}>
                                            <div className="flex-1">
                                                <h4 className="epob-title">{feature.title}</h4>
                                            </div>
                                            <div className="epob-toggle_switch epob-px_input">
                                                <form action="#" className="epob-on_off-btn_style">
                                                    <label htmlFor="" className="epob-on_off">
                                                        OFF
                                                    </label>
                                                    <label className="epob-switch">
                                                        <input
                                                            type="checkbox"
                                                            checked={featureToggles[feature.title]}
                                                            onChange={(e) => handleToggleChange(feature.title, e.target.checked)}
                                                        />
                                                        <span className="epob-slider epob-round" />
                                                    </label>
                                                    <label htmlFor="" className="epob-on_off">
                                                        ON
                                                    </label>
                                                </form>
                                            </div>
                                            <div className="epob-inactive_overlay" />
                                        </div>
                                        {featureToggles[feature.title] && (
                                            <LogoAdjuster
                                                proActive={quickSetup?.is_pro_active}
                                                branding={settings[`${feature.provider}_branding`] || 'no'}
                                                logoUrl={brandingData[feature.provider]?.logo_url || ''}
                                                logoId={brandingData[feature.provider]?.logo_id || ''}
                                                logoOpacity={brandingData[feature.provider]?.logo_opacity || 100}
                                                logoXPos={brandingData[feature.provider]?.logo_xpos || 0}
                                                logoYPos={brandingData[feature.provider]?.logo_ypos || 0}
                                                ctaUrl={brandingData[feature.provider]?.cta_url || ''}
                                                onBrandingChange={(settings) => handleBrandingChange(feature.provider, settings)}
                                            />
                                        )}
                                    </>
                                ))}

                            </div>
                        </div>
                    </div>
                    <Navigation
                        step={step}
                        setStep={setStep}
                        backLabel={'Previous'}
                        nextLabel={'Next'}
                        onNextClick={handleSaveSettings}
                    />
                </div>
            </section>
        </>
    );
};

export default Configuration;
