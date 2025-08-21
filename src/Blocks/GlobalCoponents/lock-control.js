const { useRef } = wp.element;
const { applyFilters } = wp.hooks;



import { addProAlert, passwordShowHide, copyPassword } from './helper';
import { EPIcon } from './icons';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const {
    TextControl,
    TextareaControl,
    ToggleControl,
    PanelBody
} = wp.components;

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