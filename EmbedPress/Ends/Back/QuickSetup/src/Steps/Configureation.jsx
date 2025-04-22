import React, { useState } from "react";


import HeaderSteps from "./HeaderSteps";
import Navigation from "./Navigation";
import LogoAdjuster from "./LogoAdjuster";

const proFeatures = [
    { title: "YouTube Custom Branding" },
    { title: "Vimeo Custom Branding" },
    { title: "Wistia Custom Branding" },
    { title: "Twitch Custom Branding" },
    { title: "Dailymotion Custom Branding" },
    { title: "Document Custom Branding" },
];

const Configuration = ({ step, setStep }) => {

    const [featureToggles, setFeatureToggles] = useState(
        proFeatures.reduce((acc, feature) => {
            acc[feature.title] = false;
            return acc;
        }, {})
    );

    const handleToggleChange = (title, isChecked) => {
        setFeatureToggles((prev) => ({
            ...prev,
            [title]: isChecked,
        }));
        console.log(`${title} Toggle:`, isChecked);
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
                                                id="WidthPxInput"
                                                className="epob-64_px"
                                            />
                                            <label htmlFor="number">px</label>
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
                                                placeholder={550}
                                                id="HeightPxInput"
                                                className="epob-64_px"
                                            />
                                            <label htmlFor="number">px</label>
                                        </form>
                                    </div>
                                </div>
                                <div className="epob-row_style">
                                    <div className="flex-1">
                                        <h4 className="epob-title">PDF Custom Color</h4>
                                    </div>
                                    <div className="epob-toggle_switch epob-px_input">
                                        <form action="#" className="epob-on_off-btn_style">
                                            <label htmlFor="" className="epob-on_off">
                                                OFF
                                            </label>
                                            <label className="epob-switch">
                                                <input
                                                    type="checkbox"
                                                    onChange={(e) => {
                                                        const isChecked = e.target.checked;
                                                        const settingsContainer = document.getElementById('pdfCustomColorSettings');
                                                        if (isChecked) {
                                                            settingsContainer.style.display = 'block';
                                                        } else {
                                                            settingsContainer.style.display = 'none';
                                                        }
                                                        console.log("PDF Custom Color Toggle:", isChecked);
                                                    }}
                                                />
                                                <span className="epob-slider epob-round" />
                                            </label>
                                            <label htmlFor="" className="epob-on_off">
                                                ON
                                            </label>
                                        </form>
                                    </div>
                                </div>
                                <div id="pdfCustomColorSettings" style={{ display: 'none', marginTop: '10px' }}>
                                    <div className="epob-row_style">
                                        <div className="flex-1">
                                            <h4 className="epob-title">Select Color</h4>
                                        </div>
                                        <div className="epob-toggle_switch epob-px_input">
                                            <input type="color" id="pdfColorPicker" className="epob-color_picker" />
                                        </div>
                                    </div>
                                </div>
                                <div className="epob-row_style">
                                    <div className="flex-1">
                                        <h4 className="epob-title">Powered by EmbedPress</h4>
                                    </div>
                                    <div className="epob-toggle_switch epob-px_input">
                                        <form action="#" className="epob-on_off-btn_style">
                                            <label htmlFor="" className="epob-on_off">
                                                OFF
                                            </label>
                                            <label className="epob-switch">
                                                <input
                                                    type="checkbox"
                                                    onChange={(e) => {
                                                        console.log("Powered by EmbedPress Toggle:", e.target.checked);
                                                    }}
                                                />
                                                <span className="epob-slider epob-round" />
                                            </label>
                                            <label htmlFor="" className="epob-on_off">
                                                ON
                                            </label>
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
                                        {featureToggles[feature.title] && <LogoAdjuster />}

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
                    />
                </div>
            </section>
        </>
    );
};

export default Configuration;
