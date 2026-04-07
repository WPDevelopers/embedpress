/**
 * EmbedPress Onboarding Wizard — 6-step guided setup
 */

import React, { useState, useReducer, useCallback } from 'react';

const TOTAL_STEPS = 6;

const STEP_LABELS = [
    'Get Started',
    'Configuration',
    'Blocks',
    'Optimization',
    'Premium',
    'Finish',
];

const initialSettings = {
    // Step 2 — Configuration
    gutenberg_block: true,
    elementor_widget: true,
    flipbook: false,
    video_styling: false,
    custom_ads: false,
    // Step 4 — Optimization
    lazy_loading: true,
    display_management: false,
    social_embed_styling: false,
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
    const el = data.elements || {};
    const gutenbergBlocks = el.gutenberg || {};
    const elementorWidgets = el.elementor || {};

    return {
        gutenberg_block: !!gutenbergBlocks.embedpress,
        elementor_widget: !!elementorWidgets.embedpress,
        flipbook: !!parseInt(s.onboarding_flipbook, 10),
        video_styling: !!parseInt(s.onboarding_video_styling, 10),
        custom_ads: !!parseInt(s.onboarding_custom_ads, 10),
        lazy_loading: !!parseInt(s.g_lazyload, 10),
        display_management: !!parseInt(s.onboarding_display_management, 10),
        social_embed_styling: !!parseInt(s.onboarding_social_embed_styling, 10),
        content_protection: !!parseInt(s.onboarding_content_protection, 10),
    };
}

/* ---------- Toggle Card Component ---------- */
const ToggleCard = ({ icon, title, description, checked, onChange, pro }) => (
    <div className={`ep-ob-toggle-card${checked ? ' active' : ''}`}>
        <div className="ep-ob-toggle-card__icon">{icon}</div>
        <div className="ep-ob-toggle-card__body">
            <div className="ep-ob-toggle-card__title">
                {title}
                {pro && <span className="ep-ob-pro-badge">PRO</span>}
            </div>
            {description && <div className="ep-ob-toggle-card__desc">{description}</div>}
        </div>
        <label className="ep-ob-toggle">
            <input type="checkbox" checked={checked} onChange={onChange} />
            <span className="ep-ob-toggle__slider" />
        </label>
    </div>
);

/* ---------- Step Indicator ---------- */
const StepIndicator = ({ current, total }) => (
    <div className="ep-ob-steps">
        {Array.from({ length: total }, (_, i) => {
            const step = i + 1;
            let state = 'upcoming';
            if (step < current) state = 'completed';
            else if (step === current) state = 'active';
            return (
                <div key={step} className={`ep-ob-steps__item ep-ob-steps__item--${state}`}>
                    <div className="ep-ob-steps__dot">
                        {state === 'completed' ? (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        ) : (
                            <span>{step}</span>
                        )}
                    </div>
                    <span className="ep-ob-steps__label">{STEP_LABELS[i]}</span>
                    {i < total - 1 && <div className="ep-ob-steps__line" />}
                </div>
            );
        })}
    </div>
);

/* ---------- Feature Card (Upsell) ---------- */
const FeatureCard = ({ icon, title, description }) => (
    <div className="ep-ob-feature-card">
        <div className="ep-ob-feature-card__icon">{icon}</div>
        <h4 className="ep-ob-feature-card__title">{title}</h4>
        <p className="ep-ob-feature-card__desc">{description}</p>
    </div>
);

/* ---------- Icons (inline SVG) ---------- */
const icons = {
    gutenberg: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M3 9h18M9 9v12" stroke="currentColor" strokeWidth="2"/></svg>
    ),
    elementor: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/><line x1="8" y1="8" x2="8" y2="16" stroke="currentColor" strokeWidth="2"/><line x1="12" y1="8" x2="16" y2="8" stroke="currentColor" strokeWidth="2"/><line x1="12" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2"/><line x1="12" y1="16" x2="16" y2="16" stroke="currentColor" strokeWidth="2"/></svg>
    ),
    flipbook: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    video: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="15" height="16" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M17 9l5-3v12l-5-3V9z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
    ),
    ads: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    lazy: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/><path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    display: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/><line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2"/></svg>
    ),
    social: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="2"/><circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2"/><circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="2"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke="currentColor" strokeWidth="2"/></svg>
    ),
    lock: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    youtube: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 001.94-2A29 29 0 0023 12a29 29 0 00-.46-5.58z" stroke="currentColor" strokeWidth="2"/><path d="M9.75 15.02l5.75-3.27-5.75-3.27v6.54z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
    ),
    pdf: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M14 2v6h6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M9 15h6M9 11h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    customize: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.32 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="2"/></svg>
    ),
    support: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
    ),
};

/* ========================================================================= */
/*  MAIN COMPONENT                                                           */
/* ========================================================================= */

const Onboarding = () => {
    const data = typeof embedpressOnboardingData !== 'undefined' ? embedpressOnboardingData : null;
    const [currentStep, setCurrentStep] = useState(1);
    const [settings, dispatch] = useReducer(settingsReducer, buildInitialSettings(data));
    const [saving, setSaving] = useState(false);

    const toggle = useCallback((key) => dispatch({ type: 'TOGGLE', key }), []);

    const goNext = () => setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
    const goBack = () => setCurrentStep((s) => Math.max(s - 1, 1));
    const goToStep = (n) => setCurrentStep(n);

    const saveSettings = useCallback(
        (complete = false) => {
            if (!data) return Promise.resolve();
            setSaving(true);

            const formData = new FormData();
            formData.append('action', 'embedpress_save_onboarding');
            formData.append('nonce', data.nonce);
            // Booleans → "1" / "0"
            Object.entries(settings).forEach(([k, v]) => formData.append(k, v ? '1' : '0'));
            if (complete) {
                formData.append('complete', '1');
                formData.append('data_consent', '1');
            }

            return fetch(data.ajaxUrl, { method: 'POST', body: formData })
                .then((r) => r.json())
                .finally(() => setSaving(false));
        },
        [data, settings],
    );

    const handleFinish = useCallback(
        (destination) => {
            saveSettings(true).then(() => {
                const url = destination === 'settings' ? data?.settingsUrl : data?.dashboardUrl;
                if (url) window.location.href = url;
            });
        },
        [saveSettings, data],
    );

    /* ---------- Step renderers ---------- */

    const renderStep1 = () => (
        <div className="ep-ob-step ep-ob-step--welcome">
            <div className="ep-ob-welcome-hero">
                <div className="ep-ob-welcome-icon">
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                        <rect width="64" height="64" rx="16" fill="#5B4E96" fillOpacity="0.1"/>
                        <path d="M20 22h24v20H20z" stroke="#5B4E96" strokeWidth="2.5" strokeLinejoin="round"/>
                        <path d="M28 32l4 3 4-6" stroke="#5B4E96" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <h2 className="ep-ob-step__heading">Get Started with EmbedPress</h2>
                <p className="ep-ob-step__subheading">
                    Enhance your storytelling by embedding interactive content from 250+ platforms with exclusive customizations
                </p>
            </div>
            <div className="ep-ob-welcome-actions">
                <button className="ep-ob-btn ep-ob-btn--primary" onClick={goNext}>
                    Proceed To Next Step
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <button className="ep-ob-btn ep-ob-btn--text" onClick={() => goToStep(5)}>
                    Check Pro Features
                </button>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="ep-ob-step ep-ob-step--config">
            <h2 className="ep-ob-step__heading">Configuration</h2>
            <p className="ep-ob-step__subheading">Enable or disable core embedding features for your site</p>
            <div className="ep-ob-toggle-grid">
                <ToggleCard icon={icons.gutenberg} title="Gutenberg Embed Block" description="Embed content directly in the WordPress block editor" checked={settings.gutenberg_block} onChange={() => toggle('gutenberg_block')} />
                <ToggleCard icon={icons.elementor} title="Elementor Embed Widget" description="Embed content using the Elementor page builder" checked={settings.elementor_widget} onChange={() => toggle('elementor_widget')} />
                <ToggleCard icon={icons.flipbook} title="Embed Flipbook" description="Display PDF documents as interactive flipbooks" checked={settings.flipbook} onChange={() => toggle('flipbook')} />
                <ToggleCard icon={icons.video} title="Embedded Video Styling" description="Custom styling options for embedded videos" checked={settings.video_styling} onChange={() => toggle('video_styling')} />
                <ToggleCard icon={icons.ads} title="Custom Ads" description="Display custom ads alongside your embeds" checked={settings.custom_ads} onChange={() => toggle('custom_ads')} />
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="ep-ob-step ep-ob-step--blocks">
            <h2 className="ep-ob-step__heading">Blocks</h2>
            <p className="ep-ob-step__subheading">Active blocks for your page builders</p>
            <div className="ep-ob-block-cards">
                <div className="ep-ob-block-detail-card">
                    <div className="ep-ob-block-detail-card__icon">{icons.gutenberg}</div>
                    <div className="ep-ob-block-detail-card__body">
                        <h4>Gutenberg Embed Block</h4>
                        <p>Use the EmbedPress block in the WordPress Gutenberg editor to embed content from 250+ sources. Just paste a URL and EmbedPress handles the rest.</p>
                    </div>
                    <span className={`ep-ob-status-badge ep-ob-status-badge--${settings.gutenberg_block ? 'active' : 'inactive'}`}>
                        {settings.gutenberg_block ? 'Active' : 'Inactive'}
                    </span>
                </div>
                <div className="ep-ob-block-detail-card">
                    <div className="ep-ob-block-detail-card__icon">{icons.elementor}</div>
                    <div className="ep-ob-block-detail-card__body">
                        <h4>Elementor Embed Widget</h4>
                        <p>Drag and drop the EmbedPress widget in Elementor to embed videos, documents, maps, and more with full visual customization.</p>
                    </div>
                    <span className={`ep-ob-status-badge ep-ob-status-badge--${settings.elementor_widget ? 'active' : 'inactive'}`}>
                        {settings.elementor_widget ? 'Active' : 'Inactive'}
                    </span>
                </div>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="ep-ob-step ep-ob-step--optimization">
            <h2 className="ep-ob-step__heading">Optimization</h2>
            <p className="ep-ob-step__subheading">Optimize performance and control how embeds display</p>
            <div className="ep-ob-toggle-grid">
                <ToggleCard icon={icons.lazy} title="Lazy Loading" description="Load embeds only when they enter the viewport for faster page speed" checked={settings.lazy_loading} onChange={() => toggle('lazy_loading')} />
                <ToggleCard icon={icons.display} title="Display Management" description="Control embed visibility by device, browser, or user role" checked={settings.display_management} onChange={() => toggle('display_management')} />
                <ToggleCard icon={icons.social} title="Social Embed Styling" description="Apply custom styling to social media embed cards" checked={settings.social_embed_styling} onChange={() => toggle('social_embed_styling')} />
                <ToggleCard icon={icons.lock} title="Content Protection" description="Restrict embed access to logged-in users or specific roles" checked={settings.content_protection} onChange={() => toggle('content_protection')} />
            </div>
        </div>
    );

    const renderStep5 = () => (
        <div className="ep-ob-step ep-ob-step--premium">
            <h2 className="ep-ob-step__heading">Supercharge Embedding Experience with Premium Features</h2>
            <div className="ep-ob-feature-grid">
                <FeatureCard icon={icons.youtube} title="YouTube Exclusive Controls" description="Unlock advanced YouTube player controls including custom branding, playlist management, and subscription prompts." />
                <FeatureCard icon={icons.pdf} title="Download / Print PDFs" description="Allow your visitors to download and print embedded PDF documents with a single click." />
                <FeatureCard icon={icons.customize} title="Advanced Customization Options" description="Fine-tune every aspect of your embeds with advanced styling, layout, and behavior options." />
                <FeatureCard icon={icons.support} title="24/7 Customer Support" description="Get priority assistance from our dedicated support team anytime you need help." />
            </div>
            <div className="ep-ob-premium-actions">
                <a
                    href={data?.upgradeUrl || 'https://wpdeveloper.com/in/upgrade-embedpress'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ep-ob-btn ep-ob-btn--upgrade"
                >
                    Upgrade to PRO
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2h7v7M12 2L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
                <button className="ep-ob-btn ep-ob-btn--text" onClick={goNext}>
                    Finish Without Pro
                </button>
            </div>
            <details className="ep-ob-consent-details">
                <summary>What Do We Collect?</summary>
                <p>
                    By proceeding, you agree to share non-sensitive diagnostic data and feature usage statistics to help us improve EmbedPress. No personal data or content is collected. You can opt out at any time from Settings.
                </p>
            </details>
        </div>
    );

    const renderStep6 = () => (
        <div className="ep-ob-step ep-ob-step--finish">
            <div className="ep-ob-finish-icon">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <circle cx="40" cy="40" r="36" fill="#5B4E96" fillOpacity="0.1"/>
                    <circle cx="40" cy="40" r="24" fill="#5B4E96" fillOpacity="0.2"/>
                    <path d="M28 40l8 8 16-16" stroke="#5B4E96" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            <h2 className="ep-ob-step__heading">Congratulations! You are all set to start embedding</h2>
            <p className="ep-ob-step__subheading">Thank You for Choosing EmbedPress</p>
            <div className="ep-ob-finish-actions">
                <button className="ep-ob-btn ep-ob-btn--primary" onClick={() => handleFinish('settings')} disabled={saving}>
                    {saving ? 'Saving…' : 'Start Configuring Settings'}
                </button>
                <button className="ep-ob-btn ep-ob-btn--secondary" onClick={() => handleFinish('dashboard')} disabled={saving}>
                    Skip It
                </button>
            </div>
        </div>
    );

    const stepRenderers = [renderStep1, renderStep2, renderStep3, renderStep4, renderStep5, renderStep6];

    const handleNext = () => {
        // Save settings when leaving config or optimization steps
        if (currentStep === 2 || currentStep === 4) {
            saveSettings(false).then(goNext);
        } else {
            goNext();
        }
    };

    return (
        <div className="ep-ob">
            <div className="ep-ob__header">
                <div className="ep-ob__logo">
                    <img
                        src={data ? `${data.assetsUrl}images/menu-icon.svg` : ''}
                        alt="EmbedPress"
                        width="28"
                        height="28"
                    />
                    <span>EmbedPress</span>
                </div>
                <StepIndicator current={currentStep} total={TOTAL_STEPS} />
            </div>

            <div className="ep-ob__body">
                {stepRenderers[currentStep - 1]()}
            </div>

            {currentStep !== 1 && currentStep !== 5 && currentStep !== 6 && (
                <div className="ep-ob__footer">
                    <button className="ep-ob-btn ep-ob-btn--secondary" onClick={goBack} disabled={saving}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Back
                    </button>
                    <button className="ep-ob-btn ep-ob-btn--primary" onClick={handleNext} disabled={saving}>
                        {saving ? 'Saving…' : 'Next'}
                        {!saving && (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Onboarding;
