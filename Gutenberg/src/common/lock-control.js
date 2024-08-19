import { useRef } from 'react';
import { applyFilters } from '@wordpress/hooks';

import { addProAlert, passwordShowHide, copyPassword } from '../common/helper';
import { EPIcon } from '../common/icons';

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

    const isProPluginActive = embedpressObj.is_pro_plugin_active;


    const lockContentControllers = applyFilters('embedpress.lockContentControllers', [], attributes, setAttributes);
    console.log(lockContentControllers);

    return (
        <PanelBody title={<div className='ep-pannel-icon'>{EPIcon} {__('Content Protection', 'embedpress')}</div>} initialOpen={false} className={lockContent ? "" : "disabled-content-protection"} >
            <div className={isProPluginActive ? "pro-control-active" : "pro-control"} onClick={(e) => { addProAlert(e, isProPluginActive) }}>
                <ToggleControl
                    label={__("Enable Content Protection")}
                    checked={lockContent}
                    onChange={(lockContent) => setAttributes({ lockContent })}
                />

                {
                    (!isProPluginActive) && (
                        <span className='isPro'>{__('pro', 'embedpress')}</span>
                    )
                }
            </div>

            {lockContentControllers}
        </PanelBody>
    )
}