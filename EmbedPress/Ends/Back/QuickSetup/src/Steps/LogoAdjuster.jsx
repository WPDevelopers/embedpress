import React, { useState } from 'react';

import './scss/LogoAdjuster.scss';

const LogoAdjuster = ({
    proActive = false,
    branding = 'no',
    logoUrl: initialLogoUrl = '',
    logoId: initialLogoId = '',
    logoOpacity: initialOpacity = 100,
    logoXPos: initialXPos = 0,
    logoYPos: initialYPos = 0,
    ctaUrl: initialCtaUrl = '',
    previewVideo = null,
    pxLogoUrl = 'logo_url',
    pxLogoId = 'logo_id',
    pxLogoOpacity = 'logo_opacity',
    pxLogoXPos = 'logo_xpos',
    pxLogoYPos = 'logo_ypos',
    pxCtaUrl = 'cta_url',
}) => {
    const [logoUrl, setLogoUrl] = useState(initialLogoUrl);
    const [logoId, setLogoId] = useState(initialLogoId);
    const [logoOpacity, setLogoOpacity] = useState(initialOpacity);
    const [logoXPos, setLogoXPos] = useState(initialXPos);
    const [logoYPos, setLogoYPos] = useState(initialYPos);
    const [ctaUrl, setCtaUrl] = useState(initialCtaUrl);

    const handleRemoveLogo = () => {
        setLogoUrl('');
        setLogoId('');
    };

    const showUpload = !logoUrl;
    const showPreview = !!logoUrl;
    const isPro = branding === 'yes' && proActive;

    return (
        <div className={`logo-adjuster ${proActive ? '' : 'pro-overlay'}`}>
            {showUpload && (
                <label className="logo-upload" id="logo-upload-wrap">
                    <input type="hidden" name={pxLogoUrl} value={logoUrl} />
                    <input type="hidden" name={pxLogoId} value={logoId} />
                    <span className="icon"><i className="ep-icon ep-upload"></i></span>
                    <span className="text">Click To Upload</span>
                </label>
            )}

            {showPreview && (
                <div className="logo-preview">
                    <div className="preview-container">
                        <button
                            type="button"
                            className="remove-logo"
                            onClick={handleRemoveLogo}
                        >
                            <i className="ep-icon ep-cross"></i>
                        </button>
                        <img className="logo-image" src={logoUrl} alt="Logo preview" />
                    </div>
                </div>
            )}

            <div className="adjustment-section">
                <div className="controls">
                    <ControlItem
                        label="Logo Opacity (%)"
                        type="range"
                        value={logoOpacity}
                        onChange={(e) => setLogoOpacity(e.target.value)}
                        name={pxLogoOpacity}
                    />

                    <ControlItem
                        label="Logo X Position (%)"
                        type="range"
                        value={logoXPos}
                        onChange={(e) => setLogoXPos(e.target.value)}
                        name={pxLogoXPos}
                    />

                    <ControlItem
                        label="Logo Y Position (%)"
                        type="range"
                        value={logoYPos}
                        onChange={(e) => setLogoYPos(e.target.value)}
                        name={pxLogoYPos}
                    />

                    <div className="control-item cta-input">
                        <label htmlFor={pxCtaUrl}>Call to Action Link</label>
                        <input
                            type="url"
                            id={pxCtaUrl}
                            name={pxCtaUrl}
                            className="form-control"
                            value={ctaUrl}
                            onChange={(e) => setCtaUrl(e.target.value)}
                        />
                        <p className="note">You may link the logo to any CTA link.</p>
                    </div>
                </div>

                <div className="live-preview">
                    <span className="preview-title">Live Preview</span>
                    <div className="preview-box">
                        {previewVideo}
                        {logoUrl && (
                            <img
                                src={logoUrl}
                                className="floating-logo"
                                style={{
                                    bottom: `${logoYPos}%`,
                                    right: `${logoXPos}%`,
                                    opacity: logoOpacity / 100,
                                }}
                                alt="Floating logo"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ControlItem = ({ label, type, value, onChange, name }) => (
    <div className="control-item">
        <span className="label">{label}</span>
        <div className="input-group">
            <input type={type} max="100" value={value} name={name} onChange={onChange} />
            <input readOnly type="number" className="form-control value-display" value={value} />
        </div>
    </div>
);

export default LogoAdjuster;
