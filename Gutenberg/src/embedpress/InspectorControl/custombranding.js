/**
 * WordPress dependencies
 */

import { addProAlert, isPro, removeAlert } from '../../common/helper';
const { __ } = wp.i18n;
import { applyFilters } from '@wordpress/hooks';

import { EPIcon } from '../../common/icons';


const {
    TextControl,
    RangeControl,
    PanelBody,
    Button,
} = wp.components;

import {
    MediaUpload,
} from "@wordpress/block-editor";


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

    const isProPluginActive = embedpressObj.is_pro_plugin_active;

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

    const customLogoSettings = applyFilters('embedpress.customLogoSettings', [], attributes, setAttributes);
    const placeholder = applyFilters('embedpress.uploadPlaceholder', []);

    return (
        <PanelBody title={<div className='ep-pannel-icon'>{EPIcon} {__('Custom Branding', 'embedpress')}</div>} initialOpen={false}>
            {placeholder}
            {customLogoSettings}
        </PanelBody>
    )
}
