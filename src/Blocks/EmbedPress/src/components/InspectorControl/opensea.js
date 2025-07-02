/**
 * WordPress dependencies
 */

import react from 'react';
import ControlHeader from '../../../../GlobalCoponents/control-heading';
import { getParams } from '../../../../../utils/functions';
import LockControl from '../../../../GlobalCoponents/lock-control';
import ContentShare from '../../../../GlobalCoponents/social-share-control';
import AdControl from '../../../../GlobalCoponents/ads-control';
import { EPIcon } from '../../../../GlobalCoponents/icons';


const { isShallowEqualObjects } = wp.isShallowEqual;
const { useState, useEffect } = wp.element;
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
    // AlignmentMatrixControl
} = wp.components;

// import { __experimentalAlignmentMatrixControl as AlignmentMatrixControl } from '@wordpress/components';

const {
    InspectorControls
} = wp.blockEditor;
const {
    applyFilters
} = wp.hooks;

export const init = () => {
    addFilter('embedpress_block_rest_param', 'embedpress', getOpenseaParams, 10);
}

export const getOpenseaParams = (params, attributes) => {
    if (!attributes.url || !(isOpensea(attributes.url) || isOpenseaSingle(attributes.url))) {
        return params;
    }
    // which attributes should be passed with rest api.
    const defaults = {
        limit: 20,
        itemperpage: 9,
        loadmore: false,
        loadmorelabel: 'Load More',
        orderby: 'desc',
        layout: isOpenseaSingle ? 'ep-list' : 'ep-grid',
        preset: 'ep-preset-1',
        nftperrow: '3',
        gapbetweenitem: 30,
        collectionname: false,
        nftrank: false,
        label_nftrank: '',
        nftdetails: false,
        label_nftdetails: '',
        nftimage: false,
        nftcreator: false,
        prefix_nftcreator: '',
        nfttitle: false,
        nftprice: false,
        prefix_nftprice: '',
        nftlastsale: false,
        prefix_nftlastsale: '',
        nftbutton: false,
        label_nftbutton: '',

        //Pass Color and Typography
        itemBGColor: '',
        collectionNameColor: '',
        collectionNameFZ: '',
        titleColor: '',
        titleFontsize: '',
        creatorColor: '',
        creatorFontsize: '',
        creatorLinkColor: '',
        creatorLinkFontsize: '',
        priceLabelColor: '',
        priceLabelFontsize: '',
        priceColor: '',
        priceFontsize: '',
        priceUSDColor: '',
        priceUSDFontsize: '',
        lastSaleLabelColor: '',
        lastSaleLabelFontsize: '',
        lastSaleColor: '',
        lastSaleFontsize: '',
        lastSaleUSDColor: '',
        lastSaleUSDFontsize: '',
        buttonTextColor: '',
        buttonBackgroundColor: '',
        buttonFontSize: '',
        loadmoreTextColor: '',
        loadmoreBackgroundColor: '',
        loadmoreTextFontsize: '',
        rankBtnColor: '',
        rankBtnFZ: '',
        rankBtnBorderColor: '',
        rankLabelColor: '',
        rankLabelFZ: '',
        detialTitleColor: '',
        detialTitleFZ: '',
        detailTextColor: '',
        detailTextLinkColor: '',
        detailTextFZ: '',
    };

    return getParams(params, attributes, defaults);
}

export const isOpensea = (url) => {
    return url.match(/\/collection\/|(?:https?:\/\/)?(?:www\.)?(?:opensea.com\/)(\w+)[^?\/]*$/i);
}

export const isOpenseaSingle = (url) => {
    return url.match(/\/assets\/|(?:https?:\/\/)?(?:www\.)?(?:opensea.io\/)(\w+)[^?\/]*$/i);
}

/**
 *
 * @param {object} attributes
 * @returns
 */
export const useOpensea = (attributes) => {
    // which attribute should call embed();
    const defaults = {
        limit: null,
        itemperpage: null,
        loadmore: null,
        loadmorelabel: null,
        layout: null,
        preset: null,
        orderby: null,
        collectionname: null,
        nftimage: null,
        nfttitle: null,
        nftprice: null,
        prefix_nftprice: null,
        nftlastsale: null,
        prefix_nftlastsale: null,
        nftperrow: null,
        gapbetweenitem: null,
        nftbutton: null,
        nftrank: null,
        label_nftrank: null,
        nftdetails: null,
        label_nftdetails: null,
        label_nftbutton: null,
        nftcreator: null,
        prefix_nftcreator: null,
        itemBGColor: null,
        collectionNameColor: null,
        collectionNameFZ: null,
        titleColor: null,
        titleFontsize: null,
        creatorColor: null,
        creatorFontsize: null,
        creatorLinkColor: null,
        creatorLinkFontsize: null,
        priceLabelColor: null,
        priceLabelFontsize: null,
        priceColor: null,
        priceFontsize: null,
        priceUSDColor: null,
        priceUSDFontsize: null,
        lastSaleLabelColor: null,
        lastSaleLabelFontsize: null,
        lastSaleColor: null,
        lastSaleFontsize: null,
        lastSaleUSDColor: null,
        lastSaleUSDFontsize: null,
        buttonTextColor: null,
        buttonBackgroundColor: null,
        buttonFontSize: null,
        loadmoreTextColor: null,
        loadmoreBackgroundColor: null,
        loadmoreTextFontsize: null,
        rankBtnColor: null,
        rankBtnFZ: null,
        rankBtnBorderColor: null,
        rankLabelColor: null,
        rankLabelFZ: null,
        detialTitleColor: null,
        detialTitleFZ: null,
        detailTextColor: null,
        detailTextLinkColor: null,
        detailTextFZ: null,
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

export default function OpenSea({ attributes, setAttributes, isOpensea, isOpenseaSingle }) {
    const {
        limit,
        itemperpage,
        loadmore,
        loadmorelabel,
        orderby,
        layout,
        preset,
        nftperrow,
        gapbetweenitem,
        collectionname,
        nftimage,
        nftcreator,
        prefix_nftcreator,
        nfttitle,
        nftprice,
        prefix_nftprice,
        nftlastsale,
        prefix_nftlastsale,
        nftbutton,
        nftrank,
        label_nftrank,
        nftdetails,
        label_nftdetails,
        label_nftbutton,
        alignment,
        itemBGColor,
        collectionNameColor,
        collectionNameFZ,
        titleColor,
        titleFontsize,
        creatorColor,
        creatorFontsize,
        creatorLinkColor,
        creatorLinkFontsize,
        priceLabelColor,
        priceLabelFontsize,
        priceColor,
        priceFontsize,
        priceUSDColor,
        priceUSDFontsize,
        lastSaleLabelColor,
        lastSaleLabelFontsize,
        lastSaleColor,
        lastSaleFontsize,
        lastSaleUSDColor,
        lastSaleUSDFontsize,
        buttonTextColor,
        buttonBackgroundColor,
        buttonFontSize,
        loadmoreTextColor,
        loadmoreBackgroundColor,
        loadmoreTextFontsize,
        rankBtnColor,
        rankBtnFZ,
        rankBtnBorderColor,
        rankLabelColor,
        rankLabelFZ,
        detialTitleColor,
        detialTitleFZ,
        detailTextColor,
        detailTextLinkColor,
        detailTextFZ,
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
        { name: '', color: 'red' },
        { name: '', color: 'green' },
        { name: '', color: 'blue' },
        { name: '', color: 'yellow' },
        { name: '', color: 'orange' },
    ];

    const fallbackFontSize = 16;


    const profileImagePlaceholder = applyFilters('embedpress.uploadPlaceholder', [], __('Sticky Video', 'embedpress'), false);


    const creatorPrefixPlaceholder = applyFilters('embedpress.textControlPlaceholder', [], __('Creator Prefix', 'embedpress'), '');
    const pricePrefixPlaceholder = applyFilters('embedpress.textControlPlaceholder', [], __('Price Prefix', 'embedpress'), '');
    const lastSalePrefixPlaceholder = applyFilters('embedpress.textControlPlaceholder', [], __('Last Sale Prefix', 'embedpress'), '');
    const buttonLabelPlaceholder = applyFilters('embedpress.textControlPlaceholder', [], __('Button Label', 'embedpress'), '');
    const rankLabelPlaceholder = applyFilters('embedpress.textControlPlaceholder', [], __('Rank Label', 'embedpress'), '');
    const detailsLabelPlaceholder = applyFilters('embedpress.textControlPlaceholder', [], __('Details Label', 'embedpress'), '');
    const loadmorePlaceholder = applyFilters('embedpress.togglePlaceholder', [], __('Load More', 'embedpress'), false);

    return (
        (isOpensea || isOpenseaSingle) && (
            <div>

                {
                    isOpensea && (
                        <PanelBody title={<div className='ep-pannel-icon'>{EPIcon} {__('Query', 'embedpress')}</div>} initialOpen={true} className={'ep-opensea-options'}>
                            <div>
                                <RangeControl
                                    label={__("Limit", "embedpress")}
                                    value={limit}
                                    onChange={(limit) => setAttributes({ limit })}
                                    min={1}
                                    max={100}
                                />

                                <SelectControl
                                    label={__("Order By", "embedpress")}
                                    value={orderby}
                                    options={[
                                        { label: 'Oldest', value: 'asc' },
                                        { label: 'Newest', value: 'desc' },
                                    ]}
                                    onChange={(orderby) => setAttributes({ orderby })}
                                    __nextHasNoMarginBottom
                                />
                            </div>
                        </PanelBody>
                    )
                }

                {
                    isOpensea && (
                        <PanelBody title={<div className='ep-pannel-icon'>{EPIcon} {__('Layout', 'embedpress')}</div>} initialOpen={false} className={'ep-opensea-options'}>
                            <div>
                                <SelectControl
                                    label={__("Layout", "embedpress")}
                                    value={layout}
                                    options={[
                                        { label: 'List', value: 'ep-list' },
                                        { label: 'Grid', value: 'ep-grid' },
                                    ]}
                                    onChange={(layout) => setAttributes({ layout })}
                                />
                                {
                                    (layout == 'ep-grid') && (
                                        <SelectControl
                                            label={__("Preset", "embedpress")}
                                            value={preset}
                                            options={[
                                                { label: 'Preset 1', value: 'ep-preset-1' },
                                                { label: 'Preset 2', value: 'ep-preset-2' },
                                            ]}
                                            onChange={(preset) => setAttributes({ preset })}
                                        />
                                    )
                                }


                                <RangeControl
                                    label={__("Item Per Row", "embedpress")}
                                    value={nftperrow || 3}
                                    onChange={(nftperrow) => setAttributes({ nftperrow })}
                                    min={1}
                                    max={6}
                                />



                                <RangeControl
                                    label={__("Gap Between Item", "embedpress")}
                                    value={gapbetweenitem}
                                    onChange={(gapbetweenitem) => setAttributes({ gapbetweenitem })}
                                    min={1}
                                    max={100}
                                />
                            </div>

                        </PanelBody>
                    )
                }

                <PanelBody title={<div className='ep-pannel-icon'>{EPIcon} {__('Content', 'embedpress')}</div>} initialOpen={false} className={'ep-opensea-options'}>

                    {
                        isOpenseaSingle && (
                            <ToggleControl
                                label={__("Collection Name", "embedpress")}
                                checked={collectionname}
                                onChange={(collectionname) => setAttributes({ collectionname })}
                            />
                        )
                    }
                    <ToggleControl
                        label={__("Thumbnail", "embedpress")}
                        checked={nftimage}
                        onChange={(nftimage) => setAttributes({ nftimage })}
                    />
                    <ToggleControl
                        label={__("Title", "embedpress")}
                        checked={nfttitle}
                        onChange={(nfttitle) => setAttributes({ nfttitle })}
                    />

                    <ToggleControl
                        label={__("Creator", "embedpress")}
                        checked={nftcreator}
                        onChange={(nftcreator) => setAttributes({ nftcreator })}
                    />
                    {
                        nftcreator && (
                            applyFilters('embedpress.openseaControls', [creatorPrefixPlaceholder], attributes, setAttributes, 'creatorPrefix')
                        )
                    }

                    <ToggleControl
                        label={__("Show Price", "embedpress")}
                        checked={nftprice}
                        onChange={(nftprice) => setAttributes({ nftprice })}
                    />
                    {
                        nftprice && (
                            applyFilters('embedpress.openseaControls', [pricePrefixPlaceholder], attributes, setAttributes, 'pricePrefix')
                        )
                    }

                    <ToggleControl
                        label={__("Last Sale", "embedpress")}
                        checked={nftlastsale}
                        onChange={(nftlastsale) => setAttributes({ nftlastsale })}
                    />

                    {
                        nftlastsale && (
                            applyFilters('embedpress.openseaControls', [lastSalePrefixPlaceholder], attributes, setAttributes, 'lastSalePrefix')

                        )
                    }

                    <ToggleControl
                        label={__("Show Button", "embedpress")}
                        checked={nftbutton}
                        onChange={(nftbutton) => setAttributes({ nftbutton })}
                    />
                    {
                        nftbutton && (
                            applyFilters('embedpress.openseaControls', [buttonLabelPlaceholder], attributes, setAttributes, 'buttonLabel')

                        )
                    }

                    {
                        isOpenseaSingle && (
                            <div>
                                <ToggleControl
                                    label={__("Rank", "embedpress")}
                                    checked={nftrank}
                                    onChange={(nftrank) => setAttributes({ nftrank })}
                                />

                                {
                                    nftrank && (
                                        applyFilters('embedpress.openseaControls', [rankLabelPlaceholder], attributes, setAttributes, 'rankLabel')
                                    )
                                }

                                <ToggleControl
                                    label={__("Details", "embedpress")}
                                    checked={nftdetails}
                                    onChange={(nftdetails) => setAttributes({ nftdetails })}
                                />

                                {
                                    nftdetails && (
                                        applyFilters('embedpress.openseaControls', [detailsLabelPlaceholder], attributes, setAttributes, 'detailsLabel')

                                    )
                                }

                            </div>
                        )
                    }
                </PanelBody>

                {
                    isOpensea && (
                        <PanelBody title={<div className='ep-pannel-icon'>{EPIcon} {__('Load More', 'embedpress')}</div>} initialOpen={false} className={'ep-opensea-options'}>
                            {applyFilters('embedpress.openseaControls', [loadmorePlaceholder], attributes, setAttributes, 'loadMore')}
                        </PanelBody>
                    )
                }

                <PanelBody title={<div className='ep-pannel-icon'>{EPIcon} {__('Color and Typography', 'embedpress')}</div>} initialOpen={false} className={'ep-colors-typography'}>
                    <p>{__("You can adjust the color and typography of embedded content.")}</p>
                    <div className='ep-opensea-sub-controls'>
                        <PanelBody title={__("Item")} initialOpen={false}>
                            <ControlHeader headerText={'Background Color'} />
                            <ColorPalette
                                label={__("Background Color")}
                                colors={colors}
                                value={itemBGColor}
                                onChange={(itemBGColor) => setAttributes({ itemBGColor })}
                            />
                        </PanelBody>
                        <PanelBody title={__("Collection Name")} initialOpen={false}>
                            <ControlHeader headerText={'Color'} />
                            <ColorPalette
                                label={__("Color")}
                                colors={colors}
                                value={collectionNameColor}
                                onChange={(collectionNameColor) => setAttributes({ collectionNameColor })}
                            />

                            <ControlHeader headerText={'Font Size'} />
                            <FontSizePicker
                                __nextHasNoMarginBottom
                                fontSizes={fontSizes}
                                value={collectionNameFZ}
                                fallbackFontSize={fallbackFontSize}
                                onChange={(collectionNameFZ) => setAttributes({ collectionNameFZ })}
                            />
                        </PanelBody>
                        <PanelBody title={__("Title")} initialOpen={false}>
                            <ControlHeader headerText={'Color'} />
                            <ColorPalette
                                label={__("Color")}
                                colors={colors}
                                value={titleColor}
                                onChange={(titleColor) => setAttributes({ titleColor })}
                            />

                            <ControlHeader headerText={'Font Size'} />
                            <FontSizePicker
                                __nextHasNoMarginBottom
                                fontSizes={fontSizes}
                                value={titleFontsize}
                                fallbackFontSize={fallbackFontSize}
                                onChange={(titleFontsize) => setAttributes({ titleFontsize })}
                            />
                        </PanelBody>
                        <PanelBody title={__("Creator")} initialOpen={false}>
                            <ControlHeader headerText={'Color'} />
                            <ColorPalette
                                label={__("Color")}
                                colors={colors}
                                value={creatorColor}
                                onChange={(creatorColor) => setAttributes({ creatorColor })}
                            />

                            <ControlHeader headerText={'Font Size'} />
                            <FontSizePicker
                                __nextHasNoMarginBottom
                                fontSizes={fontSizes}
                                value={creatorFontsize}
                                fallbackFontSize={fallbackFontSize}
                                onChange={(creatorFontsize) => setAttributes({ creatorFontsize })}
                            />

                            <ControlHeader headerText={'Link Color'} />
                            <ColorPalette
                                label={__("Color")}
                                colors={colors}
                                value={creatorLinkColor}
                                onChange={(creatorLinkColor) => setAttributes({ creatorLinkColor })}
                            />

                            <ControlHeader headerText={'Link Font Size'} />
                            <FontSizePicker
                                __nextHasNoMarginBottom
                                fontSizes={fontSizes}
                                value={creatorLinkFontsize}
                                fallbackFontSize={fallbackFontSize}
                                onChange={(creatorLinkFontsize) => setAttributes({ creatorLinkFontsize })}
                            />
                        </PanelBody>

                        <PanelBody title={__("Current Price")} initialOpen={false}>
                            {
                                isOpenseaSingle && (
                                    <div>
                                        <ControlHeader headerText={'Label Color'} />
                                        <ColorPalette
                                            label={__("Color")}
                                            colors={colors}
                                            value={priceLabelColor}
                                            onChange={(priceLabelColor) => setAttributes({ priceLabelColor })}
                                        />

                                        <ControlHeader headerText={'Label Font Size'} />
                                        <FontSizePicker
                                            __nextHasNoMarginBottom
                                            fontSizes={fontSizes}
                                            value={priceLabelFontsize}
                                            fallbackFontSize={fallbackFontSize}
                                            onChange={(priceLabelFontsize) => setAttributes({ priceLabelFontsize })}
                                        />
                                    </div>
                                )
                            }

                            <ControlHeader headerText={'ETH Price Color'} />
                            <ColorPalette
                                label={__("Color")}
                                colors={colors}
                                value={priceColor}
                                onChange={(priceColor) => setAttributes({ priceColor })}
                            />

                            <ControlHeader headerText={'ETH Font Size'} />
                            <FontSizePicker
                                __nextHasNoMarginBottom
                                fontSizes={fontSizes}
                                value={priceFontsize}
                                fallbackFontSize={fallbackFontSize}
                                onChange={(priceFontsize) => setAttributes({ priceFontsize })}
                            />
                            {
                                isOpenseaSingle && (
                                    <div>
                                        <ControlHeader headerText={'USD Price Color'} />
                                        <ColorPalette
                                            label={__("Color")}
                                            colors={colors}
                                            value={priceUSDColor}
                                            onChange={(priceUSDColor) => setAttributes({ priceUSDColor })}
                                        />

                                        <ControlHeader headerText={'USD Font Size'} />
                                        <FontSizePicker
                                            __nextHasNoMarginBottom
                                            fontSizes={fontSizes}
                                            value={priceUSDFontsize}
                                            fallbackFontSize={fallbackFontSize}
                                            onChange={(priceUSDFontsize) => setAttributes({ priceUSDFontsize })}
                                        />

                                    </div>
                                )
                            }
                        </PanelBody>

                        <PanelBody title={__("Last Sale Price")} initialOpen={false}>
                            {
                                isOpenseaSingle && (
                                    <div>
                                        <ControlHeader headerText={'Label Color'} />
                                        <ColorPalette
                                            label={__("Color")}
                                            colors={colors}
                                            value={lastSaleLabelColor}
                                            onChange={(lastSaleLabelColor) => setAttributes({ lastSaleLabelColor })}
                                        />

                                        <ControlHeader headerText={'Label Font Size'} />
                                        <FontSizePicker
                                            __nextHasNoMarginBottom
                                            fontSizes={fontSizes}
                                            value={lastSaleLabelFontsize}
                                            fallbackFontSize={fallbackFontSize}
                                            onChange={(lastSaleLabelFontsize) => setAttributes({ lastSaleLabelFontsize })}
                                        />
                                    </div>
                                )
                            }
                            <ControlHeader headerText={'ETH Color'} />
                            <ColorPalette
                                label={__("Color")}
                                colors={colors}
                                value={lastSaleColor}
                                onChange={(lastSaleColor) => setAttributes({ lastSaleColor })}
                            />

                            <ControlHeader headerText={'ETH Font Size'} />
                            <FontSizePicker
                                __nextHasNoMarginBottom
                                fontSizes={fontSizes}
                                value={lastSaleFontsize}
                                fallbackFontSize={fallbackFontSize}
                                onChange={(lastSaleFontsize) => setAttributes({ lastSaleFontsize })}
                            />
                            {
                                isOpenseaSingle && (
                                    <div>
                                        <ControlHeader headerText={'USD Price Color'} />
                                        <ColorPalette
                                            label={__("Color")}
                                            colors={colors}
                                            value={lastSaleUSDColor}
                                            onChange={(lastSaleUSDColor) => setAttributes({ lastSaleUSDColor })}
                                        />

                                        <ControlHeader headerText={'USD Font Size'} />
                                        <FontSizePicker
                                            __nextHasNoMarginBottom
                                            fontSizes={fontSizes}
                                            value={lastSaleUSDFontsize}
                                            fallbackFontSize={fallbackFontSize}
                                            onChange={(lastSaleUSDFontsize) => setAttributes({ lastSaleUSDFontsize })}
                                        />
                                    </div>
                                )
                            }
                        </PanelBody>
                        <PanelBody title={__("Button")} initialOpen={false}>

                            <ControlHeader headerText={'Color'} />
                            <ColorPalette
                                label={__("Color")}
                                colors={colors}
                                value={buttonTextColor}
                                onChange={(buttonTextColor) => setAttributes({ buttonTextColor })}
                            />

                            <ControlHeader headerText={'Background Color'} />
                            <ColorPalette
                                label={__("Color")}
                                colors={colors}
                                value={buttonBackgroundColor}
                                onChange={(buttonBackgroundColor) => setAttributes({ buttonBackgroundColor })}
                            />

                            <ControlHeader headerText={'Font Size'} />
                            <FontSizePicker
                                __nextHasNoMarginBottom
                                fontSizes={fontSizes}
                                value={buttonFontSize}
                                fallbackFontSize={fallbackFontSize}
                                onChange={(buttonFontSize) => setAttributes({ buttonFontSize })}
                            />
                        </PanelBody>

                        {
                            (loadmore) && (
                                applyFilters('embedpress.openseaControls', [], attributes, setAttributes, 'loadmorePanelBody')
                            )
                        }

                        {

                            isOpenseaSingle && (
                                <PanelBody title={__("Rank")} initialOpen={false}>
                                    <ControlHeader headerText={'Label Color'} />
                                    <ColorPalette
                                        label={__("Label Color")}
                                        colors={colors}
                                        value={rankLabelColor}
                                        onChange={(rankLabelColor) => setAttributes({ rankLabelColor })}
                                    />

                                    <ControlHeader headerText={'Label Font Size'} />
                                    <FontSizePicker
                                        __nextHasNoMarginBottom
                                        fontSizes={fontSizes}
                                        value={rankLabelFZ}
                                        fallbackFontSize={fallbackFontSize}
                                        onChange={(rankLabelFZ) => setAttributes({ rankLabelFZ })}
                                    />

                                    <ControlHeader headerText={'Color'} />
                                    <ColorPalette
                                        label={__("Title Color")}
                                        colors={colors}
                                        value={rankBtnColor}
                                        onChange={(rankBtnColor) => setAttributes({ rankBtnColor })}
                                    />

                                    <ControlHeader headerText={'Font Size'} />
                                    <FontSizePicker
                                        __nextHasNoMarginBottom
                                        fontSizes={fontSizes}
                                        value={rankBtnFZ}
                                        fallbackFontSize={fallbackFontSize}
                                        onChange={(rankBtnFZ) => setAttributes({ rankBtnFZ })}
                                    />

                                    <ControlHeader headerText={'Border Color'} />
                                    <ColorPalette
                                        label={__("Color")}
                                        colors={colors}
                                        value={rankBtnBorderColor}
                                        onChange={(rankBtnBorderColor) => setAttributes({ rankBtnBorderColor })}
                                    />
                                </PanelBody>
                            )
                        }

                        {
                            isOpenseaSingle && (
                                <PanelBody title={__("Details")} initialOpen={false}>

                                    <ControlHeader headerText={'Title Color'} />
                                    <ColorPalette
                                        label={__("Title Color")}
                                        colors={colors}
                                        value={detialTitleColor}
                                        onChange={(detialTitleColor) => setAttributes({ detialTitleColor })}
                                    />

                                    <ControlHeader headerText={'Title Font Size'} />
                                    <FontSizePicker
                                        __nextHasNoMarginBottom
                                        fontSizes={fontSizes}
                                        value={detialTitleFZ}
                                        fallbackFontSize={fallbackFontSize}
                                        onChange={(detialTitleFZ) => setAttributes({ detialTitleFZ })}
                                    />

                                    <ControlHeader headerText={'Content Color'} />
                                    <ColorPalette
                                        label={__("Color")}
                                        colors={colors}
                                        value={detailTextColor}
                                        onChange={(detailTextColor) => setAttributes({ detailTextColor })}
                                    />

                                    <ControlHeader headerText={'Link Color'} />
                                    <ColorPalette
                                        label={__("Color")}
                                        colors={colors}
                                        value={detailTextLinkColor}
                                        onChange={(detailTextLinkColor) => setAttributes({ detailTextLinkColor })}
                                    />

                                    <ControlHeader headerText={'Content Font Size'} />
                                    <FontSizePicker
                                        __nextHasNoMarginBottom
                                        fontSizes={fontSizes}
                                        value={detailTextFZ}
                                        fallbackFontSize={fallbackFontSize}
                                        onChange={(detailTextFZ) => setAttributes({ detailTextFZ })}
                                    />
                                </PanelBody>
                            )
                        }
                    </div>

                </PanelBody>

                <AdControl attributes={attributes} setAttributes={setAttributes} />
                <LockControl attributes={attributes} setAttributes={setAttributes} />
                <ContentShare attributes={attributes} setAttributes={setAttributes} />
            </div>
        )
    )
}