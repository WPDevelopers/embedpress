import React, { useState } from 'react';

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
    pxCtaUrl = 'cta_url'
}) => {
    const [logoUrl, setLogoUrl] = useState(initialLogoUrl);
    const [logoId, setLogoId] = useState(initialLogoId);
    const [logoOpacity, setLogoOpacity] = useState(initialOpacity);
    const [logoXPos, setLogoXPos] = useState(initialXPos);
    const [logoYPos, setLogoYPos] = useState(initialYPos);
    const [ctaUrl, setCtaUrl] = useState(initialCtaUrl);

    const handleOpacityChange = (e) => setLogoOpacity(e.target.value);
    const handleXPosChange = (e) => setLogoXPos(e.target.value);
    const handleYPosChange = (e) => setLogoYPos(e.target.value);
    const handleCtaUrlChange = (e) => setCtaUrl(e.target.value);

    const handleRemoveLogo = () => {
        setLogoUrl('');
        setLogoId('');
    };

    const showWrap = branding === 'yes' && proActive;
    const showUpload = !logoUrl;
    const showPreview = !!logoUrl;

    return (
        <div className={`logo__adjust__wrap ${proActive ? '' : 'proOverlay'}`} >
            {showUpload && (
                <label className="logo__upload" id="yt_logo_upload_wrap">
                    <input type="hidden" className="preview__logo__input" name={pxLogoUrl} id={pxLogoUrl} data-default={initialLogoUrl} value={logoUrl} />
                    <input type="hidden" className="preview__logo__input_id" name={pxLogoId} id={pxLogoId} data-default={initialLogoId} value={logoId} />
                    <span className="icon"><i className="ep-icon ep-upload"></i></span>
                    <span className="text">Click To Upload</span>
                </label>
            )}

            {showPreview && (
                <div className="logo__upload__preview" id="yt_logo__upload__preview">
                    <div className="instant__preview">
                        <a href="#" id="yt_preview__remove" className="preview__remove" onClick={handleRemoveLogo}>
                            <i className="ep-icon ep-cross"></i>
                        </a>
                        <img className="instant__preview__img" id="yt_logo_preview" src={logoUrl} alt="" />
                    </div>
                </div>
            )}

            <div className="logo__adjust">
                <div className="logo__adjust__controller">
                    <div className="logo__adjust__controller__item">
                        <span className="controller__label">Logo Opacity (%)</span>
                        <div className="logo__adjust__controller__inputs">
                            <input type="range" max="100" value={logoOpacity} className="opacity__range" name={pxLogoOpacity} onChange={handleOpacityChange} />
                            <input readOnly type="number" className="form__control range__value" value={logoOpacity} />
                        </div>
                    </div>

                    <div className="logo__adjust__controller__item">
                        <span className="controller__label">Logo X Position (%)</span>
                        <div className="logo__adjust__controller__inputs">
                            <input type="range" max="100" value={logoXPos} className="x__range" name={pxLogoXPos} onChange={handleXPosChange} />
                            <input readOnly type="number" className="form__control range__value" value={logoXPos} />
                        </div>
                    </div>

                    <div className="logo__adjust__controller__item">
                        <span className="controller__label">Logo Y Position (%)</span>
                        <div className="logo__adjust__controller__inputs">
                            <input type="range" max="100" value={logoYPos} className="y__range" name={pxLogoYPos} onChange={handleYPosChange} />
                            <input readOnly type="number" className="form__control range__value" value={logoYPos} />
                        </div>
                    </div>

                    <div className="logo__adjust__controller__item">
                        <label className="controller__label" htmlFor="yt_cta_url">Call to Action Link</label>
                        <div>
                            <input
                                type="url"
                                name={pxCtaUrl}
                                id={pxCtaUrl}
                                className="form__control"
                                value={ctaUrl}
                                onChange={handleCtaUrlChange}
                            />
                            <p>You may link the logo to any CTA link.</p>
                        </div>
                    </div>
                </div>

                <div className="logo__adjust__preview">
                    <span className="title">Live Preview</span>
                    <div className="preview__box">
                        {previewVideo}
                        {logoUrl && (
                            <img
                                src={logoUrl}
                                className="preview__logo"
                                style={{
                                    bottom: `${logoYPos}%`,
                                    right: `${logoXPos}%`,
                                    opacity: logoOpacity / 100,
                                }}
                                alt=""
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogoAdjuster;
