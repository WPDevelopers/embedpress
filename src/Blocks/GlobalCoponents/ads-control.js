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
    RangeControl,
    SelectControl,
    ToggleControl,
    PanelBody,
    Button,
} = wp.components;

const {
    MediaUpload,
} = wp.blockEditor;
import AdTemplate from './ads-template';



export default function AdControl({ attributes, setAttributes }) {



    const {
        adManager,
        adSource,
        adContent,
        adFileUrl,
        adWidth,
        adHeight,
        adXPosition,
        adYPosition,
        adUrl,
        adStart,
        adSkipButton,
        adSkipButtonAfter

    } = attributes;

    const onSelectImage = (ad) => {
        setAttributes({ adContent: ad });

        if (ad.type === 'image') {
            setAttributes({ adFileUrl: ad.sizes.full.url });
            setAttributes({ adSource: 'image' });
        }
        else if (ad.type === 'video') {
            setAttributes({ adFileUrl: ad.url });
            setAttributes({ adSource: 'video' });

        }
    }

    const inputRef = useRef(null);

    let adLabel = 'Ad Content';
    if (adFileUrl) {
        adLabel = 'Preview';
    }

    const togglePlaceholder = applyFilters('embedpress.togglePlaceholder', [], 'Ads Settings', true);
    const adsPlaceholder = applyFilters('embedpress.adsPlaceholder', []);

    return (

        <PanelBody title={<div className='ep-pannel-icon'>{EPIcon} {__('Ads Settings', 'embedpress')}</div>} initialOpen={false} className={adManager ? "" : "disabled-content-protection"} >

            {applyFilters('embedpress.adsSettings', [togglePlaceholder], attributes, setAttributes)}
            {applyFilters('embedpress.adManagerSettings', [adsPlaceholder], attributes, setAttributes)}

            <div className={'ep-documentation ads-help'}>
                {EPIcon}
                <a href="https://embedpress.com/docs/add-ep-content-protection-in-embedded-content/" target={'_blank'}> {__('Need Help?', 'emebdpress')} </a>
            </div>

        </PanelBody>
    )
}