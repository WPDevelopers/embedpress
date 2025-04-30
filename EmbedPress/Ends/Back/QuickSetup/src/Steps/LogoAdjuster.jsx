import React, { useEffect, useState, useRef } from 'react';

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
    previewVideo = "https://www.youtube.com/embed/ZkXnx1kk3hs?si=gPPtcx2L9DcUq3Ai",
    onBrandingChange,
}) => {
    const [logoUrl, setLogoUrl] = useState(initialLogoUrl);
    const [logoId, setLogoId] = useState(initialLogoId);
    const [logoOpacity, setLogoOpacity] = useState(initialOpacity);
    const [logoXPos, setLogoXPos] = useState(initialXPos);
    const [logoYPos, setLogoYPos] = useState(initialYPos);
    const [ctaUrl, setCtaUrl] = useState(initialCtaUrl);

    const uploaderRef = useRef(null);

    const handleRemoveLogo = () => {
        setLogoUrl('');
        setLogoId('');
    };

    const handleUploadClick = (e) => {
        e.preventDefault();

        // Check if WordPress media is available
        if (!window.wp || !window.wp.media) {
            alert('WordPress media uploader not available.');
            return;
        }

        // Create media uploader instance if not exists
        if (!uploaderRef.current) {
            uploaderRef.current = window.wp.media({
                title: 'Select or Upload Logo',
                button: {
                    text: 'Use this logo'
                },
                multiple: false,
                library: {
                    type: 'image' // Restrict to images only
                }
            });

            // Handle selection
            uploaderRef.current.on('select', () => {
                const attachment = uploaderRef.current.state().get('selection').first().toJSON();

                // Validate file type
                if (!attachment.type || attachment.type !== 'image') {
                    alert('Please select an image file for the logo.');
                    return;
                }

                setLogoUrl(attachment.url);
                setLogoId(attachment.id);
            });
        }

        uploaderRef.current.open();
    };

    useEffect(() => {
        return () => {
            if (uploaderRef.current) {
                uploaderRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (onBrandingChange) {
            onBrandingChange({
                logo_url: logoUrl,
                logo_id: logoId,
                logo_opacity: logoOpacity,
                logo_xpos: logoXPos,
                logo_ypos: logoYPos,
                cta_url: ctaUrl,
            });
        }
    }, [logoUrl, logoId, logoOpacity, logoXPos, logoYPos, ctaUrl, onBrandingChange]);

    const showUpload = !logoUrl;
    const showPreview = !!logoUrl;
    const isPro = branding === 'yes' && proActive;

    return (
        <div className={`logo-adjuster ${proActive ? '' : 'pro-overlay'}`}>

            {showUpload && (
                <label
                    className="logo-upload"
                    id="logo-upload-wrap"
                    style={{ cursor: 'pointer' }}
                    onClick={handleUploadClick}
                >
                    <input type="hidden" name="logo_url" value={logoUrl} />
                    <input type="hidden" name="logo_id" value={logoId} />
                    <span className="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5b4e96"><path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" /></svg>
                    </span>
                    <span className="text">Click To Upload</span>
                </label>
            )}

            {showPreview && (
                <div className="logo-preview">
                    <div className="preview-container">
                        <div className="logo-actions">
                            <button
                                type="button"
                                className="change-logo"
                                onClick={handleUploadClick}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" /></svg>
                            </button>
                            <button
                                type="button"
                                className="remove-logo"
                                onClick={handleRemoveLogo}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg>
                            </button>
                        </div>
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
                        name="logo_opacity"
                    />

                    <ControlItem
                        label="Logo X Position (%)"
                        type="range"
                        value={logoXPos}
                        onChange={(e) => setLogoXPos(e.target.value)}
                        name="logo_xpos"
                    />

                    <ControlItem
                        label="Logo Y Position (%)"
                        type="range"
                        value={logoYPos}
                        onChange={(e) => setLogoYPos(e.target.value)}
                        name="logo_ypos"
                    />

                    <div className="control-item cta-input">
                        <label htmlFor="cta_url">Call to Action Link</label>
                        <input
                            type="url"
                            id="cta_url"
                            name="cta_url"
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
                        <iframe width="560" height="315" src={previewVideo} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

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
