/**
 * WordPress dependencies
 */

import react from 'react';
import ControlHeader from '../../../../GlobalCoponents/control-heading';
import { getParams } from '../../../../../utils/functions';
import LockControl from '../../../../GlobalCoponents/lock-control';
import ContentShare from '../../../../GlobalCoponents/social-share-control';
import { blanKTabIcon } from '../../../../GlobalCoponents/icons';

const { isShallowEqualObjects } = wp.isShallowEqual;
const { useState, useEffect } = wp.element;
const { applyFilters } = wp.hooks;
const { __ } = wp.i18n;
const { addFilter } = wp.hooks;

const {
    SelectControl,
    RangeControl,
    ToggleControl,
    TextControl,
    PanelBody,
    ColorPalette,
    FontSizePicker,
} = wp.components;


const {
    InspectorControls
} = wp.blockEditor;

export const init = () => {
    addFilter('embedpress_block_rest_param', 'embedpress', getCalendlyParams, 10);
}

export const getCalendlyParams = (params, attributes) => {
    if (!attributes.url) {
        return params;
    }

    // which attributes should be passed with rest api.
    const defaults = {
        cEmbedType: 'inline',
        calendlyData: 0,
        hideCookieBanner: 0,
        hideEventTypeDetails: 0,
        cBackgroundColor: 'ffffff',
        cTextColor: '2cff2c',
        cButtonLinkColor: '0000FF',
        cPopupButtonText: 'Schedule time with me',
        cPopupButtonBGColor: '#0000FF',
        cPopupButtonTextColor: '#FFFFFF',
        cPopupLinkText: 'Schedule time with me',


    };

    return getParams(params, attributes, defaults);
}

export const isCalendly = (url) => {
    return url.match(/^https:\/\/calendly\.com\/[a-zA-Z0-9_-]+\/.*/);
}

/**
 *
 * @param {object} attributes
 * @returns
 */
export const useCalendly = (attributes) => {
    // which attribute should call embed();
    const defaults = {
        cEmbedType: null,
        calendlyData: null,
        hideCookieBanner: null,
        hideEventTypeDetails: null,
        cBackgroundColor: null,
        cTextColor: null,
        cButtonLinkColor: null,
        cPopupButtonText: null,
        cPopupButtonBGColor: null,
        cPopupButtonTextColor: null,
        cPopupLinkText: null
    };
    const param = getParams({}, attributes, defaults);
    const [atts, setAtts] = useState(param);

    useEffect(() => {
        const param = getParams(atts, attributes, defaults);
        if (!isShallowEqualObjects(atts || {}, param)) {
            setAtts(param);
        }
    }, [attributes]);

    return atts;
}

export default function Calendly({ attributes, setAttributes, isCalendly }) {
    const {
        cEmbedType,
        calendlyData,
        hideCookieBanner,
        hideEventTypeDetails,
        cBackgroundColor,
        cTextColor,
        cButtonLinkColor,
        cPopupButtonText,
        cPopupButtonBGColor,
        cPopupButtonTextColor,
        cPopupLinkText
    } = attributes;

    const isProPluginActive = embedpressGutenbergData.is_pro_plugin_active;

    const addProAlert = (e, isProPluginActive) => {
        if (!isProPluginActive) {
            document.querySelector('.pro__alert__wrap').style.display = 'block';
        }
    }

    const removeAlert = () => {
        if (document.querySelector('.pro__alert__wrap')) {
            document.querySelector('.pro__alert__wrap .pro__alert__card .button').addEventListener('click', (e) => {
                document.querySelector('.pro__alert__wrap').style.display = 'none';
            });
        }
    }


    const isPro = (display) => {
        const alertPro = `
		<div class="pro__alert__wrap" style="display: none;">
			<div class="pro__alert__card">
				<img src="../wp-content/plugins/embedpress/EmbedPress/Ends/Back/Settings/assets/img/alert.svg" alt=""/>
					<h2>Opps...</h2>
					<p>You need to upgrade to the <a href="https://wpdeveloper.com/in/upgrade-embedpress" target="_blank">Premium</a> Version to use this feature</p>
					<a href="#" class="button radius-10">Close</a>
			</div>
		</div>
		`;

        const dom = document.createElement('div');
        dom.innerHTML = alertPro;

        return dom;

    }

    if (!document.querySelector('.pro__alert__wrap')) {
        document.querySelector('body').append(isPro('none'));
        removeAlert();
    }

    const fontSizes = [
        {
            name: __('Small'),
            slug: 'small',
            size: 16,
        },
        {
            name: __('Medium'),
            slug: 'medium',
            size: 18,
        },
        {
            name: __('Large'),
            slug: 'big',
            size: 26,
        },
    ];

    const colors = [
        { name: '', color: '#FF0000' },
        { name: '', color: '#00FF00' },
        { name: '', color: '#0000FF' },
        { name: '', color: '#FFFF00' },
        { name: '', color: '#FFA500' }
    ];

    const cDataPlaceholder = applyFilters('embedpress.togglePlaceholder', [], __('Calendly Data', 'embedpress'), false);



    return (
        (isCalendly) && (
            <div>
                <PanelBody title={__("Calendly Controls")} initialOpen={false} className={'ep-calendly-options'}>
                    <div>
                        <SelectControl
                            label={__("Embed Type", "embedpress")}
                            value={cEmbedType}
                            options={[
                                { label: 'Inline', value: 'inline' },
                                { label: 'Popup Button', value: 'popup_button' },
                            ]}
                            onChange={(cEmbedType) => setAttributes({ cEmbedType })}
                        />



                        {applyFilters('embedpress.calendlyControls', [cDataPlaceholder], attributes, setAttributes, 'calendlyData')}

                        {
                            calendlyData && (
                                <div className={'ep-calendly-data-link'}>
                                    {blanKTabIcon}
                                    <a href="/wp-admin/admin.php?page=embedpress&page_type=calendly" target={'_blank'} > {__("View Calendly Data", "embedpress")} </a>
                                </div>
                            )
                        }

                        <ToggleControl
                            label="Hide Cookie Banner"
                            checked={hideCookieBanner}
                            onChange={(hideCookieBanner) => setAttributes({ hideCookieBanner })}
                        />
                        <ToggleControl
                            label="Hide Event Type Details"
                            checked={hideEventTypeDetails}
                            onChange={(hideEventTypeDetails) => setAttributes({ hideEventTypeDetails })}
                        />
                        <ControlHeader headerText={'Background Color'} />
                        <ColorPalette
                            label={__("Background Color")}
                            colors={colors}
                            value={cBackgroundColor}
                            onChange={(cBackgroundColor) => setAttributes({ cBackgroundColor })}
                        />

                        <ControlHeader headerText={'Text Color'} />
                        <ColorPalette
                            label={__("Text Color")}
                            colors={colors}
                            value={cTextColor}
                            onChange={(cTextColor) => setAttributes({ cTextColor })}
                        />

                        <ControlHeader headerText={'Button & Link Color'} />
                        <ColorPalette
                            label={__("Button & Link Color")}
                            colors={colors}
                            value={cButtonLinkColor}
                            onChange={(cButtonLinkColor) => setAttributes({ cButtonLinkColor })}
                        />
                    </div>
                </PanelBody>
                <div>
                    {
                        (cEmbedType === 'popup_button') && (
                            <PanelBody title={__("Popup Settings")} initialOpen={false} className={'ep-calendly-options'}>
                                <div>
                                    <TextControl
                                        label="Button Text"
                                        value={cPopupButtonText}
                                        onChange={(cPopupButtonText) => setAttributes({ cPopupButtonText })}
                                    />


                                    <ControlHeader headerText={'Text Color'} />
                                    <ColorPalette
                                        label={__("Text Color")}
                                        colors={colors}
                                        value={cPopupButtonTextColor}
                                        onChange={(cPopupButtonTextColor) => setAttributes({ cPopupButtonTextColor })}
                                    />

                                    <ControlHeader headerText={'Background Color'} />
                                    <ColorPalette
                                        label={__("Background Color")}
                                        colors={colors}
                                        value={cPopupButtonBGColor}
                                        onChange={(cPopupButtonBGColor) => setAttributes({ cPopupButtonBGColor })}
                                    />
                                </div>
                            </PanelBody>
                        )
                    }


                </div>
            </div>

        )
    )
}