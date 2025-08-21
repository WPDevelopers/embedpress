/**
 * WordPress dependencies
 */

import { addProAlert, isPro, removeAlert } from '../../../../GlobalCoponents/helper';
const { __ } = wp.i18n;
const { applyFilters } = wp.hooks;


const {
    TextControl,
    RangeControl,
    PanelBody,
    Button,
} = wp.components;

import { EPIcon } from '../../../../GlobalCoponents/icons';


/**
 *
 * @param {object} attributes
 * @returns
 */


export default function CustomBranding({ attributes, setAttributes }) {

    const {
        customlogo,
        logoX,
        logoY,
        customlogoUrl,
        logoOpacity
    } = attributes;

    const isProPluginActive = embedpressGutenbergData.isProPluginActive;

    const onSelectImage = (logo) => {
        setAttributes({ customlogo: logo.sizes.full.url });
    }
    const removeImage = (e) => {
        setAttributes({ customlogo: '' });
    }

    if (!document.querySelector('.pro__alert__wrap')) {
        document.querySelector('body').append(isPro('none'));
        removeAlert();
    }

    const placeholder = applyFilters('embedpress.uploadPlaceholder', []);

    return (
        <PanelBody title={<div className='ep-pannel-icon'>{EPIcon} {__('Custom Branding', 'embedpress')}</div>} initialOpen={false}>
            {applyFilters('embedpress.customLogoSettings', [placeholder], attributes, setAttributes)}
        </PanelBody>
    )
}
