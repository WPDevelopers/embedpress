import { useRef } from 'react';
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

    const inputRef = useRef(null);

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
            {
                lockContent && (
                    <div className={'lock-content-controllers'}>
                        <div className='lock-content-pass-input'>
                            <TextControl
                                label={__("Password")}
                                value={contentPassword}
                                onChange={(contentPassword) => setAttributes({ contentPassword })}
                                type={'password'}
                                placeholder={'••••••'}
                                ref={inputRef}
                            />

                            <span className={'copy-tooltip'}>Copied</span>

                            <span className={'copy-password active'} onClick={() => copyPassword(inputRef)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none" /><polyline points="216 184 216 40 72 40" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="12" /><rect x="40" y="72" width="144" height="144" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="12" /></svg>
                            </span>

                            <span className={'pass-show active'} onClick={() => passwordShowHide('show')} >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16"> <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" /> <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" /> </svg>
                            </span>

                            <span className={'pass-hide'} onClick={() => passwordShowHide('hide')}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16"> <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" /> <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" /> <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" /> </svg>
                            </span>
                        </div>

                        <TextControl
                            label={__("Error Message")}
                            value={lockErrorMessage}
                            onChange={(lockErrorMessage) => setAttributes({ lockErrorMessage })}
                            placeholder={'Oops, that wasn\'t the right password'}
                        />
                        <TextControl
                            label={__("Placeholder")}
                            value={passwordPlaceholder}
                            onChange={(passwordPlaceholder) => setAttributes({ passwordPlaceholder })}
                            placeholder={'Password'}
                        />
                        <TextControl
                            label={__("Button Text")}
                            value={submitButtonText}
                            onChange={(submitButtonText) => setAttributes({ submitButtonText })}
                            placeholder={'Unlock'}
                        />
                        <TextControl
                            label={__("Loader Text")}
                            value={submitUnlockingText}
                            onChange={(submitUnlockingText) => setAttributes({ submitUnlockingText })}
                            placeholder={'Unlocking...'}
                        />

                        <TextControl
                            label={__("Header")}
                            value={lockHeading}
                            onChange={(lockHeading) => setAttributes({ lockHeading })}
                            placeholder={'Content Locked'}
                        />
                        <TextareaControl
                            label={__("Description")}
                            value={lockSubHeading}
                            onChange={(lockSubHeading) => setAttributes({ lockSubHeading })}
                            placeholder={'Content is locked and requires password to access it.'}
                        />
                        <ToggleControl
                            label={__("Footer Text")}
                            checked={enableFooterMessage}
                            onChange={(enableFooterMessage) => setAttributes({ enableFooterMessage })}
                           
                        />

                        {

                            enableFooterMessage && (
                                <TextareaControl
                                    label={__("Footer")}
                                    value={footerMessage}
                                    onChange={(footerMessage) => setAttributes({ footerMessage })}
                                    placeholder={'In case you don\'t have the password, kindly reach out to content owner or administrator to request access.'}
                                />
                            )
                        }

                        <div className={'ep-documentation'}>
                            {EPIcon} 
                            <a href="https://embedpress.com/docs/add-ep-content-protection-in-embedded-content/" target={'_blank'}> Need Help? </a>
                        </div>
                    </div>
                )
            }
        </PanelBody>
    )
}