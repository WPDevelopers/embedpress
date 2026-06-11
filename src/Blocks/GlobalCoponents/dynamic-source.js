/**
 * Dynamic Source panel (fbs-81736) — Pro feature gate.
 *
 * Free ships the PanelBody shell + a placeholder upsell card. The Pro
 * plugin registers `embedpress.dynamicSourceSettings` and returns the
 * functional Source / Field dropdowns + REST-driven field enumerator.
 *
 * This mirrors the `embedpress.customLogoSettings` / Custom Branding gate
 * (see `custombranding.js`). PHP-side gating happens in
 * `EmbedPressBlockRenderer::apply_dynamic_source`, `Shortcode::parseContent`,
 * and the Elementor widgets via `Helper::is_pro_features_enabled()`.
 */

import { wrapFiltered } from './helper';
import { EPIcon } from './icons';

const { __ } = wp.i18n;
const { applyFilters } = wp.hooks;
const { PanelBody } = wp.components;

const Placeholder = () => (
    <div className='ep-dynamic-source-upsell' style={{ padding: 8 }}>
        <p style={{ marginTop: 0, color: '#6b7280', fontSize: 12 }}>
            {__('Pull the PDF URL from a custom field on each post (great for archive/loop pages).', 'embedpress')}
        </p>
        <div style={{
            padding: '12px',
            background: '#faf5ff',
            border: '1px solid #e9d5ff',
            borderRadius: 6,
            color: '#6b21a8',
            fontSize: 12,
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span aria-hidden="true" style={{ fontSize: 16 }}>👑</span>
                <strong style={{ color: '#581c87' }}>{__('Pro feature', 'embedpress')}</strong>
            </div>
            <p style={{ margin: '0 0 10px', color: '#6b21a8' }}>
                {__('Upgrade EmbedPress to enable MetaBox / ACF / Pods / Toolset / JetEngine / raw meta lookups.', 'embedpress')}
            </p>
            <a
                href="https://wpdeveloper.com/in/upgrade-embedpress"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    display: 'inline-block',
                    padding: '6px 12px',
                    background: '#5b4e96',
                    color: '#fff',
                    textDecoration: 'none',
                    borderRadius: 4,
                    fontWeight: 500,
                }}
            >
                {__('Upgrade to Pro', 'embedpress')}
            </a>
        </div>
    </div>
);

export default function DynamicSource({ attributes, setAttributes }) {
    return (
        <PanelBody title={<div className='ep-pannel-icon'>{EPIcon} {__('Dynamic Source', 'embedpress')}</div>} initialOpen={false}>
            {wrapFiltered(applyFilters('embedpress.dynamicSourceSettings', [<Placeholder key="ep-dyn-placeholder" />], attributes, setAttributes))}
        </PanelBody>
    );
}
