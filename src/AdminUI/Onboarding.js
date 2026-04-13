/**
 * EmbedPress Onboarding Wizard — 6-step guided setup matching Figma design
 */

import React, { useState, useReducer, useCallback, useEffect } from 'react';

const TOTAL_STEPS = 3;

const STEP_LABELS = ['Get Started', 'Settings', 'Features'];

const initialSettings = {
    gutenberg_block: true,
    elementor_widget: true,
    embedpress_document_powered_by: true,
    analytics_tracking: true,
    g_lazyload: false,
    social_share: false,
    custom_branding: false,
    custom_ads: false,
    content_protection: false,
};

function settingsReducer(state, action) {
    switch (action.type) {
        case 'TOGGLE':
            return { ...state, [action.key]: !state[action.key] };
        case 'INIT':
            return { ...state, ...action.payload };
        default:
            return state;
    }
}

function buildInitialSettings(data) {
    if (!data) return initialSettings;
    const s = data.settings || {};

    return {
        gutenberg_block: Object.keys(data.elements?.gutenberg || {}).length > 0,
        elementor_widget: Object.keys(data.elements?.elementor || {}).length > 0,
        analytics_tracking: data.analyticsTracking !== undefined ? !!data.analyticsTracking : true,
        g_lazyload: !!parseInt(s.g_lazyload, 10),
        embedpress_document_powered_by: s.embedpress_document_powered_by !== undefined ? s.embedpress_document_powered_by === 'yes' : true,
        social_share: !!parseInt(s.social_share, 10),
        custom_branding: !!parseInt(s.custom_branding, 10),
        custom_ads: !!parseInt(s.custom_ads, 10),
        content_protection: !!parseInt(s.content_protection, 10),
    };
}

/* ---------- Step Indicator (Tab-style) ---------- */
const StepIndicator = ({ current, total }) => (
    <div className="ep-ob-stepper">
        {Array.from({ length: total }, (_, i) => {
            const step = i + 1;
            let state = 'upcoming';
            if (step < current) state = 'completed';
            else if (step === current) state = 'active';
            return (
                <div key={step} className={`ep-ob-stepper__tab ep-ob-stepper__tab--${state}`}>
                    <span className="ep-ob-stepper__icon">
                        {state === 'completed' ? (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <circle cx="8" cy="8" r="8" fill="#5B4E96" />
                                <path d="M4.5 8L7 10.5L11.5 5.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        ) : state === 'active' ? (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <circle cx="8" cy="8" r="7" stroke="#5B4E96" strokeWidth="2" />
                                <circle cx="8" cy="8" r="4" fill="#5B4E96" />
                            </svg>
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <circle cx="8" cy="8" r="7" stroke="#DCDCE5" strokeWidth="2" />
                            </svg>
                        )}
                    </span>
                    <span className="ep-ob-stepper__label">{STEP_LABELS[i]}</span>
                </div>
            );
        })}
    </div>
);

/* ---------- Pro Crown Icon ---------- */
const ProCrown = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.7602 14.4609H3.24016C2.64471 14.4609 2.16016 14.9455 2.16016 15.5409C2.16016 16.1364 2.64471 16.6209 3.24016 16.6209H14.7602C15.3556 16.6209 15.8402 16.1364 15.8402 15.5409C15.8402 14.9455 15.3556 14.4609 14.7602 14.4609Z" fill="#FF9900" />
        <path d="M16.56 3.66C15.7659 3.66 15.12 4.30586 15.12 5.1C15.12 5.63353 15.4152 6.09503 15.8479 6.34414C15.0149 8.31694 13.7153 9.52726 12.5006 9.41782C11.1499 9.30768 10.0483 7.7107 9.44061 5.03879C10.2196 4.8415 10.8 4.1395 10.8 3.3C10.8 2.30712 9.99285 1.5 8.99996 1.5C8.00708 1.5 7.19996 2.30712 7.19996 3.3C7.19996 4.13953 7.78029 4.84153 8.55932 5.03879C7.95164 7.7107 6.85002 9.30768 5.49932 9.41782C4.28973 9.52726 2.98434 8.31694 2.15205 6.34414C2.58476 6.09503 2.87996 5.6335 2.87996 5.1C2.87996 4.30586 2.23411 3.66 1.43996 3.66C0.645855 3.66 0 4.30586 0 5.1C0 5.83874 0.561586 6.44209 1.2787 6.52414L2.66544 13.74H15.3346L16.7213 6.52414C17.4384 6.44209 18 5.83874 18 5.1C18 4.30586 17.3541 3.66 16.56 3.66Z" fill="url(#paint0_crown)" />
        <defs>
            <linearGradient id="paint0_crown" x1="9" y1="1.5" x2="9" y2="13.74" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFC045" />
                <stop offset="1" stopColor="#FF9900" />
            </linearGradient>
        </defs>
    </svg>
);

/* ---------- Pro Upsell Popup ---------- */
const ProPopup = ({ onClose, upgradeUrl }) => (
    <div className="ep-ob-modal-overlay" onClick={onClose}>
        <div className="ep-ob-modal ep-ob-modal--pro" onClick={(e) => e.stopPropagation()}>
            <button className="ep-ob-modal__close" onClick={onClose}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            </button>
            <div className="ep-ob-pro-popup__icon"><ProCrown /></div>
            <h3 className="ep-ob-modal__title">Premium Feature</h3>
            <p className="ep-ob-modal__text">
                This feature requires EmbedPress Pro. Upgrade to unlock all premium features and take your embeds to the next level.
            </p>
            <a
                href={upgradeUrl || 'https://wpdeveloper.com/in/upgrade-embedpress'}
                target="_blank"
                rel="noopener noreferrer"
                className="ep-ob-btn ep-ob-btn--upgrade"
            >
                Upgrade to PRO
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 2h7v7M12 2L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </a>
        </div>
    </div>
);

/* ---------- Toggle Card ---------- */
const ToggleCard = ({ title, description, checked, onChange, pro, onProClick }) => (
    <div className={`ep-ob-toggle-card${checked ? ' active' : ''}${pro ? ' ep-ob-toggle-card--pro' : ''}`}>
        <div className="ep-ob-toggle-card__body">
            <div className="ep-ob-toggle-card__title">
                {title}
                {pro && <span className="ep-ob-pro-badge"><ProCrown /></span>}
            </div>
            {description && <div className="ep-ob-toggle-card__desc">{description}</div>}
        </div>
        <label className="ep-ob-toggle" onClick={pro ? (e) => { e.preventDefault(); onProClick && onProClick(); } : undefined}>
            <input type="checkbox" checked={pro ? false : checked} onChange={pro ? () => {} : onChange} readOnly={pro} />
            <span className="ep-ob-toggle__slider" />
        </label>
    </div>
);

/* ---------- Consent Modal ---------- */
const ConsentModal = ({ onClose }) => (
    <div className="ep-ob-modal-overlay" onClick={onClose}>
        <div className="ep-ob-modal" onClick={(e) => e.stopPropagation()}>
            <button className="ep-ob-modal__close" onClick={onClose}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            </button>
            <h3 className="ep-ob-modal__title">What Do We Collect?</h3>
            <p className="ep-ob-modal__text">
                We collect non-sensitive diagnostic data and plugin usage information. Your site
                URL, WordPress & PHP version, plugins & themes, and email address to send you
                the discount coupon. This data lets us make sure this plugin always stays
                compatible with the most popular plugins and themes. No spam, we promise.
            </p>
        </div>
    </div>
);

/* ---------- Finishing Modal ---------- */
/* ---------- Finishing Modal ---------- */
const FinishingModal = ({ redirectUrl }) => {
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        const t1 = setTimeout(() => setFinished(true), 1500);
        const t2 = setTimeout(() => {
            if (redirectUrl) window.location.href = redirectUrl;
        }, 3000);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [redirectUrl]);

    return (
        <div className="ep-ob-modal-overlay ep-ob-modal-overlay--dark">
            <div className="ep-ob-modal ep-ob-modal--finish">
                <div className={`ep-ob-finish-illustration ${finished ? 'ep-ob-finish--done' : 'ep-ob-finish--launching'}`}>
                    {!finished ? (
                        <svg width="180" height="180" viewBox="0 0 180 180" fill="none" className="ep-ob-rocket-svg">
                            <circle cx="90" cy="90" r="84" stroke="#E8E5F3" strokeWidth="1.5" strokeDasharray="5 5" className="ep-ob-rocket-orbit" />
                            <circle cx="90" cy="90" r="68" fill="#F5F3FF" />
                            <circle cx="90" cy="90" r="50" fill="#EDE9FF" />
                            <g className="ep-ob-rocket-body">
                                <path d="M90 52c-3 0-8 10-8 22v8h16v-8c0-12-5-22-8-22z" fill="#5B4E96" />
                                <circle cx="90" cy="78" r="5" fill="#fff" fillOpacity="0.4" />
                                <circle cx="90" cy="78" r="3" fill="#7B6DB5" />
                                <rect x="82" y="82" width="16" height="24" rx="2" fill="#5B4E96" />
                                <path d="M82 96l-6 14h6z" fill="#5B4E96" fillOpacity="0.7" />
                                <path d="M98 96l6 14h-6z" fill="#5B4E96" fillOpacity="0.7" />
                                <rect x="82" y="102" width="16" height="4" rx="1" fill="#474559" />
                                <g className="ep-ob-rocket-flame">
                                    <path d="M85 106c0 0-2 10 5 14c7-4 5-14 5-14z" fill="#FF7369" />
                                    <path d="M87 106c0 0-1 7 3 10c4-3 3-10 3-10z" fill="#FFB347" />
                                </g>
                            </g>
                            <circle cx="45" cy="55" r="3" fill="#FF7369" fillOpacity="0.5" className="ep-ob-sparkle" />
                            <circle cx="140" cy="50" r="2" fill="#5B4E96" fillOpacity="0.4" className="ep-ob-sparkle" />
                            <circle cx="135" cy="120" r="2.5" fill="#4AD750" fillOpacity="0.5" className="ep-ob-sparkle" />
                            <circle cx="50" cy="130" r="2" fill="#5B4E96" fillOpacity="0.3" className="ep-ob-sparkle" />
                            <path d="M42 75l1.5 3 3 .5-2 2 .5 3-3-1.5-3 1.5.5-3-2-2 3-.5z" fill="#FFB347" fillOpacity="0.6" className="ep-ob-sparkle" />
                            <path d="M138 85l1 2 2 .3-1.5 1.5.3 2-2-1-2 1 .3-2-1.5-1.5 2-.3z" fill="#5B4E96" fillOpacity="0.4" className="ep-ob-sparkle" />
                        </svg>
                    ) : (
                        <svg width="180" height="180" viewBox="0 0 180 180" fill="none" className="ep-ob-checkmark-svg">
                            <circle cx="90" cy="90" r="84" stroke="#E8E5F3" strokeWidth="1.5" strokeDasharray="5 5" />
                            <circle cx="90" cy="90" r="68" fill="#EAFBEB" className="ep-ob-check-circle-outer" />
                            <circle cx="90" cy="90" r="50" fill="#4AD750" className="ep-ob-check-circle-inner" />
                            <path d="M65 90l15 15 35-35" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className="ep-ob-check-path" fill="none" />
                        </svg>
                    )}
                </div>
                <h3 className="ep-ob-modal__title">{finished ? 'Finished!' : 'Finishing Up'}</h3>
                <p className="ep-ob-modal__text">
                    Congratulations! You are all set to start embedding multimedia
                    content on your website with EmbedPress. Best wishes.
                </p>
            </div>
        </div>
    );
};

/* ---------- Feature checklist items ---------- */
const PREMIUM_FEATURES = [
    ['Custom Branding', 'Content Protection'],
    ['24/7 Customer Support', 'Video & Audio Custom Player'],
    ['Lazy Loading', 'Custom Ads'],
    ['YouTube Exclusive Controls', 'Download/Print PDFs'],
];

/* ========================================================================= */
/*  MAIN COMPONENT                                                           */
/* ========================================================================= */

const Onboarding = () => {
    const data = typeof embedpressOnboardingData !== 'undefined' ? embedpressOnboardingData : null;
    const [currentStep, setCurrentStep] = useState(1);
    const [settings, dispatch] = useReducer(settingsReducer, buildInitialSettings(data));
    const [saving, setSaving] = useState(false);
    const [showConsent, setShowConsent] = useState(false);
    const [showFinishing, setShowFinishing] = useState(false);
    const [dataConsent, setDataConsent] = useState(false);
    const [showProPopup, setShowProPopup] = useState(false);

    const proActive = !!data?.proActive;
    const toggle = useCallback((key) => dispatch({ type: 'TOGGLE', key }), []);

    const goNext = () => setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
    const goBack = () => setCurrentStep((s) => Math.max(s - 1, 1));

    const saveSettings = useCallback(
        (complete = false) => {
            if (!data) return Promise.resolve();
            setSaving(true);

            const formData = new FormData();
            formData.append('action', 'embedpress_save_onboarding');
            formData.append('nonce', data.nonce);
            Object.entries(settings).forEach(([k, v]) => formData.append(k, v ? '1' : '0'));
            if (complete) {
                formData.append('complete', '1');
            }
            if (dataConsent) {
                formData.append('data_consent', '1');
            }

            return fetch(data.ajaxUrl, { method: 'POST', body: formData })
                .then((r) => r.json())
                .finally(() => setSaving(false));
        },
        [data, settings, dataConsent],
    );

    const handleFinishWithoutPro = () => {
        saveSettings(true).then(() => {
            setShowFinishing(true);
        });
    };

    /* ---------- Step 1: Get Started ---------- */
    const assetsUrl = data?.assetsUrl || '';
    const platformIcons = [
        { name: 'youtube', file: 'youtube.svg' },
        { name: 'vimeo', file: 'vimeo.svg' },
        { name: 'google-maps', file: 'map.svg' },
        { name: 'soundcloud', file: 'soundcloud.svg' },
        { name: 'embedpress', file: 'icon-128x128.png', isRoot: true },
        { name: 'x', file: 'x.svg' },
        { name: 'wordpress', file: 'wordpress.svg' },
        { name: 'linkedin', file: 'linkedin.png' },
        { name: 'instagram', file: 'instagram.svg' },
    ];

    const renderStep1 = () => (
        <div className="ep-ob-step ep-ob-step--welcome">
            <div className="ep-ob-welcome-illustration">
                <div className="ep-ob-platforms-grid">
                    {platformIcons.map(({ name, file, isRoot }) => (
                        <div key={name} className="ep-ob-platform-icon">
                            <img
                                src={`${assetsUrl}images/${isRoot ? '' : 'sources/icons/'}${file}`}
                                alt={name}
                                width="32"
                                height="32"
                            />
                        </div>
                    ))}

                </div>
            </div>
            <h2 className="ep-ob-step__heading">Thank You for Choosing EmbedPress</h2>
            <p className="ep-ob-step__subheading">
                To embed versatile multimedia content on your website in one click, no coding is needed.
                Enhance your storytelling by embedding interactive content from 250+ sources.
            </p>
            <div className="ep-ob-welcome-actions">
                <button className="ep-ob-btn ep-ob-btn--primary" onClick={() => { setDataConsent(true); goNext(); }}>
                    Start Configuring Settings
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <button
                    className="ep-ob-btn ep-ob-btn--text"
                    onClick={goNext}
                >
                    Skip It
                </button>
            </div>
            <div className="ep-ob-consent-row">
                <span>By proceeding, you grant permission for this plugin to collect your information.</span>
                {' '}
                <button
                    className="ep-ob-consent-link"
                    type="button"
                    onClick={() => setShowConsent(true)}
                >
                    Find out what we collect?
                </button>
            </div>
        </div>
    );

    /* ---------- Step 2: Settings ---------- */
    const renderStep2 = () => (
        <div className="ep-ob-step ep-ob-step--settings">
            <div className="ep-ob-toggle-grid">
                <ToggleCard
                    title="Gutenberg Embed Block"
                    description="Embed content in default Gutenberg editor using the EmbedPress block. Just copy the source link and embed it in one click."
                    checked={settings.gutenberg_block}
                    onChange={() => toggle('gutenberg_block')}
                />
                <ToggleCard
                    title="Elementor Embed Widget"
                    description="For Elementor website builder, get an embed widget to embed multimedia sources in editor in one click, no custom coding is needed."
                    checked={settings.elementor_widget}
                    onChange={() => toggle('elementor_widget')}
                />
                <ToggleCard
                    title="Powered By EmbedPress"
                    description="Display 'Powered by EmbedPress' branding on embedded documents."
                    checked={settings.embedpress_document_powered_by}
                    onChange={() => toggle('embedpress_document_powered_by')}
                />
                <ToggleCard
                    title="Analytics"
                    description="Track views and engagement on your embedded content with built-in analytics."
                    checked={settings.analytics_tracking}
                    onChange={() => toggle('analytics_tracking')}
                />
                <ToggleCard
                    title="Social Share"
                    description="Allow visitors to share your embedded content on social media platforms."
                    checked={settings.social_share}
                    onChange={() => toggle('social_share')}
                    pro={!proActive}
                    onProClick={() => setShowProPopup(true)}
                />
                <ToggleCard
                    title="Lazy Load"
                    description="Improve page speed by loading embedded content only when it becomes visible in the viewport."
                    checked={settings.g_lazyload}
                    onChange={() => toggle('g_lazyload')}
                />
                <ToggleCard
                    title="Custom Branding"
                    description="Showcase your own brand or business logo on your embedded content."
                    checked={settings.custom_branding}
                    onChange={() => toggle('custom_branding')}
                    pro={!proActive}
                    onProClick={() => setShowProPopup(true)}
                />
                <ToggleCard
                    title="Custom Ads"
                    description="Display custom ads in the form of video or image on your embedded content seamlessly."
                    checked={settings.custom_ads}
                    onChange={() => toggle('custom_ads')}
                    pro={!proActive}
                    onProClick={() => setShowProPopup(true)}
                />
                <ToggleCard
                    title="Content Protection"
                    description="Restrict access to embedded content based on user roles and permissions."
                    checked={settings.content_protection}
                    onChange={() => toggle('content_protection')}
                    pro={!proActive}
                    onProClick={() => setShowProPopup(true)}
                />
            </div>
        </div>
    );

    /* ---------- Step 3: Features (Upsell / Pro Active) ---------- */
    const renderStep3 = () => (
        <div className="ep-ob-step ep-ob-step--features">
            <div className="ep-ob-features-split">
                <div className="ep-ob-features-left">
                    <h2 className="ep-ob-features__heading">
                        {proActive
                            ? 'You Have Premium Features Unlocked!'
                            : 'Supercharge Embedding Experience with Premium Features'}
                    </h2>
                    <p className="ep-ob-features__subheading">
                        {proActive
                            ? 'Thank you for being a Pro user! All premium features are available and ready to use.'
                            : 'Unlock premium features, deeper customization, and expert support to elevate your workflows, designed for growing websites.'}
                    </p>
                    <div className="ep-ob-features-checklist">
                        {PREMIUM_FEATURES.map((row, ri) => (
                            <div key={ri} className="ep-ob-features-checklist__row">
                                {row.map((item) => (
                                    <div key={item} className="ep-ob-features-checklist__item">
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                            <circle cx="9" cy="9" r="9" fill="#4AD750" fillOpacity="0.15" />
                                            <path d="M5.5 9L8 11.5L12.5 6.5" stroke="#4AD750" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="ep-ob-features-actions">
                        {!proActive && (
                            <a
                                href={data?.upgradeUrl || 'https://wpdeveloper.com/in/upgrade-embedpress'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ep-ob-btn ep-ob-btn--upgrade"
                            >
                                Upgrade to PRO
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M5 2h7v7M12 2L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </a>
                        )}
                        <a
                            href="https://embedpress.com/documentation/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ep-ob-btn ep-ob-btn--outline"
                        >
                            Explore Documentation
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </a>
                    </div>
                </div>
                <div className="ep-ob-features-right">
                    <img
                        src={`${assetsUrl}images/onboard-feature.svg`}
                        alt="EmbedPress Premium Features"
                        className="ep-ob-features-img"
                    />
                </div>
            </div>
        </div>
    );

    const stepRenderers = [renderStep1, renderStep2, renderStep3];

    const handleNext = () => {
        if (currentStep === 2) {
            saveSettings(false).then(goNext);
        } else {
            goNext();
        }
    };

    return (
        <div className="ep-ob">
            <div className="ep-ob__header">
                <StepIndicator current={currentStep} total={TOTAL_STEPS} />
            </div>

            <div className="ep-ob__body">
                <div className="ep-ob__body-inner">
                    {stepRenderers[currentStep - 1]()}
                </div>
            </div>

            {currentStep > 1 && (
                <div className="ep-ob__footer">
                    {!(currentStep === 2 && dataConsent) && (
                        <button className="ep-ob-btn ep-ob-btn--secondary" onClick={goBack} disabled={saving}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Back
                        </button>
                    )}
                    {currentStep === 3 ? (
                        <button
                            className="ep-ob-btn ep-ob-btn--primary"
                            onClick={handleFinishWithoutPro}
                            disabled={saving}
                        >
                            {saving ? 'Saving\u2026' : proActive ? 'Finish' : 'Finish Without Pro'}
                            {!saving && (
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </button>
                    ) : (
                        <button className="ep-ob-btn ep-ob-btn--primary" onClick={handleNext} disabled={saving}>
                            {saving ? 'Saving\u2026' : 'Next'}
                            {!saving && (
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </button>
                    )}
                </div>
            )}

            {showConsent && <ConsentModal onClose={() => setShowConsent(false)} />}
            {showProPopup && <ProPopup onClose={() => setShowProPopup(false)} upgradeUrl={data?.upgradeUrl} />}
            {showFinishing && (
                <FinishingModal redirectUrl={data?.dashboardUrl} />
            )}
        </div>
    );
};

export default Onboarding;
