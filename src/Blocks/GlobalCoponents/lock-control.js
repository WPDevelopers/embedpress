import { useRef } from 'react';
import { applyFilters } from '@wordpress/hooks';

import { addProAlert, passwordShowHide, copyPassword } from './helper';
import { EPIcon } from './icons';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
    TextControl,
    TextareaControl,
    ToggleControl,
    PanelBody
} from '@wordpress/components';

export default function LockControl({ attributes, setAttributes }) {

    const {
        lockContent,
        protectionType,
        userRole,
        lockHeading,
        lockSubHeading,
        lockErrorMessage,
        passwordPlaceholder,
        submitButtonText,
        submitUnlockingText,
        enableFooterMessage,
        footerMessage,
        contentPassword
    } = attributes;

    
    const togglePlacehoder = applyFilters('embedpress.togglePlaceholder', [], 'Enable Content Protection', false);

    return (
        <PanelBody title={<div className='ep-pannel-icon'>{EPIcon} {__('Content Protection', 'embedpress')}</div>} initialOpen={false} className={lockContent ? "" : "disabled-content-protection"} >
            {applyFilters('embedpress.toggleContentProtection', [togglePlacehoder], attributes, setAttributes)}
            {applyFilters('embedpress.lockContentControllers', [], attributes, setAttributes)}
        </PanelBody>
    )
}