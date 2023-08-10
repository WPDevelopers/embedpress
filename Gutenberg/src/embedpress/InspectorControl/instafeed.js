/**
 * WordPress dependencies
 */

// import { addProAlert, isPro, removeAlert, isInstagramFeed } from '../../common/helper';
// import ControlHeader from '../../common/control-heading';
import CustomBranding from './custombranding';

const { isShallowEqualObjects } = wp.isShallowEqual;
const { useState, useEffect } = wp.element;
const { __ } = wp.i18n;
// const { addFilter } = wp.hooks;

const {
    TextControl,
    SelectControl,
    RangeControl,
    ToggleControl,
    PanelBody,
    Button,
    ColorPalette,
} = wp.components;


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


export default function Instafeed({ attributes, setAttributes }) {

    const {
        url,
        instaLayout,
        instafeedColumns,
        instafeedColumnsGap,
        instafeedPostsPerPage,
        instafeedTab,
        instafeedPopup,
        instafeedPopupFollowBtn,
        instafeedPopupFollowBtnLabel,
        instafeedLoadmore,
        instafeedLoadmoreLabel,
        slidesShow,
        slidesScroll,
        carouselAutoplay,
        autoplaySpeed,
        transitionSpeed,
        carouselLoop,
        carouselArrows,
        carouselSpacing,
        carouselDots,
        instafeedProfileImage,
        instafeedProfileImageUrl,
        instafeedFollowBtn,
        instafeedFollowBtnLabel,
        instafeedPostsCount,
        instafeedPostsCountText,
        instafeedFollowersCount,
        instafeedFollowersCountText,
        instafeedAccName,

    } = attributes;


    const _isInstagramFeed = isInstagramFeed(url);


    const isProPluginActive = embedpressObj.is_pro_plugin_active;

    const onSelectImage = (logo) => {
        console.log(logo.sizes.full.url);
        setAttributes({ customlogo: logo.sizes.full.url });
    }
    const removeImage = (e) => {
        setAttributes({ customlogo: '' });
    }

    if (!document.querySelector('.pro__alert__wrap')) {
        document.querySelector('body').append(isPro('none'));
        removeAlert();
    }

    const columnOptions = [
        { label: 'Auto', value: 'auto' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
        { label: '6', value: '6' },
    ];

    return (
        <div>

            {
                (_isInstagramFeed) && (
                    <div className={'ep__instafeed-options'}>
                        <PanelBody title={__('Instagram Profile Settings', 'embedpress')} initialOpen={false}>
                            <ToggleControl
                                label={__('Profile Image', 'embedpress')}
                                checked={instafeedProfileImage}
                                onChange={(instafeedProfileImage) => setAttributes({ instafeedProfileImage })}
                            />
                            {instafeedProfileImage && (
                                <TextControl
                                    label={__('Image URL', 'embedpress')}
                                    value={instafeedProfileImageUrl}
                                    onChange={(instafeedProfileImageUrl) => setAttributes({ instafeedProfileImageUrl })}
                                />
                            )}

                            <ToggleControl
                                label={__('Follow Button', 'embedpress')}
                                checked={instafeedFollowBtn}
                                onChange={(instafeedFollowBtn) => setAttributes({ instafeedFollowBtn })}
                            />
                            {instafeedFollowBtn && (
                                <TextControl
                                    label={__('Button Label', 'embedpress')}
                                    value={instafeedFollowBtnLabel}
                                    onChange={(instafeedFollowBtnLabel) => setAttributes({ instafeedFollowBtnLabel })}
                                />
                            )}

                            <ToggleControl
                                label={__('Posts Count', 'embedpress')}
                                checked={instafeedPostsCount}
                                onChange={(instafeedPostsCount) => setAttributes({ instafeedPostsCount })}
                            />
                            {instafeedPostsCount && (
                                <TextControl
                                    label={__('Count Text', 'embedpress')}
                                    value={instafeedPostsCountText}
                                    onChange={(instafeedPostsCountText) => setAttributes({ instafeedPostsCountText })}
                                />
                            )}

                            <ToggleControl
                                label={__('Followers Count', 'embedpress')}
                                checked={instafeedFollowersCount}
                                onChange={(instafeedFollowersCount) => setAttributes({ instafeedFollowersCount})}
                            />
                            {instafeedFollowersCount && (
                                <TextControl
                                    label={__('Count Text', 'embedpress')}
                                    value={instafeedFollowersCountText}
                                    onChange={(instafeedFollowersCountText) => setAttributes({ instafeedFollowersCountText})}
                                />
                            )}

                            <ToggleControl
                                label={__('Account Name', 'embedpress')}
                                checked={instafeedAccName}
                                onChange={(instafeedAccName) => setAttributes({ instafeedAccName})}
                            />


                        </PanelBody>

                        <PanelBody title={__('Instagram Feed Settings', 'embedpress')} initialOpen={false}>
                            {
                                _isInstagramFeed && (
                                    <div className='instafeed-controls'>
                                        <SelectControl
                                            label={__("Layout")}
                                            value={instaLayout}
                                            options={[
                                                { label: 'Grid', value: 'insta-grid' },
                                                { label: 'Masonry', value: 'insta-masonry' },
                                                { label: 'Carousel', value: 'insta-carousel' },
                                            ]}
                                            onChange={(instaLayout) => setAttributes({ instaLayout })}
                                            __nextHasNoMarginBottom
                                        />


                                        {(instaLayout === 'insta-grid' || instaLayout === 'insta-masonry') && (
                                            <div>
                                                <SelectControl
                                                    label={__('Columns', 'embedpress')}
                                                    value={instafeedColumns}
                                                    options={columnOptions}
                                                    onChange={(instafeedColumns) => setAttributes({ instafeedColumns })}
                                                />
                                                <TextControl
                                                    label={__('Column Gap', 'embedpress')}
                                                    value={instafeedColumnsGap}
                                                    onChange={(instafeedColumnsGap) => setAttributes({ instafeedColumnsGap })}
                                                />
                                            </div>
                                        )}
                                        {
                                            console.log({instafeedColumns})
                                        }
                                        {
                                            (instaLayout === 'insta-carousel') && (
                                                <div>
                                                    <SelectControl
                                                        label={__("Slides to Show")}
                                                        value={slidesShow}
                                                        options={[
                                                            { label: '1', value: '1' },
                                                            { label: '2', value: '2' },
                                                            { label: '3', value: '3' },
                                                            { label: '4', value: '4' },
                                                            { label: '5', value: '5' },
                                                            { label: '6', value: '6' },
                                                            { label: '7', value: '7' },
                                                            { label: '8', value: '8' },
                                                            { label: '9', value: '9' },
                                                            { label: '10', value: '10' },
                                                        ]}
                                                        onChange={(slidesShow) => setAttributes({ slidesShow })}
                                                        __nextHasNoMarginBottom
                                                    />

                                                    <ToggleControl
                                                        label={__("Autoplay")}
                                                        checked={carouselAutoplay}
                                                        onChange={(carouselAutoplay) => setAttributes({ carouselAutoplay })}
                                                    />
                                                    <TextControl
                                                        label={__("Autoplay Speed")}
                                                        value={autoplaySpeed}
                                                        onChange={(autoplaySpeed) => setAttributes({ autoplaySpeed })}
                                                    />
                                                    <TextControl
                                                        label={__("Transition Speed")}
                                                        value={transitionSpeed}
                                                        onChange={(transitionSpeed) => setAttributes({ transitionSpeed })}
                                                    />

                                                    <ToggleControl
                                                        label={__("Loop")}
                                                        checked={carouselLoop}
                                                        onChange={(carouselLoop) => setAttributes({ carouselLoop })}
                                                    />

                                                    <TextControl
                                                        label={__("Space")}
                                                        value={carouselSpacing}
                                                        onChange={(carouselSpacing) => setAttributes({ carouselSpacing })}
                                                    />

                                                    <ToggleControl
                                                        label={__("Arrows")}
                                                        checked={carouselArrows}
                                                        onChange={(carouselArrows) => setAttributes({ carouselArrows })}
                                                    />
                                                </div>
                                            )
                                        }

                                        <TextControl
                                            label={__('Posts Per Page', 'embedpress')}
                                            value={instafeedPostsPerPage}
                                            onChange={(instafeedPostsPerPage) => setAttributes({ instafeedPostsPerPage })}
                                        />

                                        <ToggleControl
                                            label={__('Feed Tab', 'embedpress')}
                                            checked={instafeedTab}
                                            onChange={(instafeedTab) => setAttributes({ instafeedTab})}
                                        />

                                        <ToggleControl
                                            label={__('Popup', 'embedpress')}
                                            checked={instafeedPopup}
                                            onChange={(instafeedPopup) => setAttributes({ instafeedPopup})}
                                        />

                                        {instafeedPopup && (
                                            <div>
                                                <ToggleControl
                                                    label={__('Popup Follow Button', 'embedpress')}
                                                    checked={instafeedPopupFollowBtn}
                                                    onChange={(instafeedPopupFollowBtn) => setAttributes({ instafeedPopupFollowBtn })}
                                                />
                                                {instafeedPopupFollowBtn && (
                                                    <TextControl
                                                        label={__('Button Label', 'embedpress')}
                                                        value={instafeedPopupFollowBtnLabel}
                                                        onChange={(instafeedPopupFollowBtnLabel) => setAttributes({ instafeedPopupFollowBtnLabel })}
                                                    />
                                                )}
                                            </div>
                                        )}

                                        {(instaLayout === 'insta-grid' || instaLayout === 'insta-masonry') && (
                                            <ToggleControl
                                                label={__('Load More', 'embedpress')}
                                                checked={instafeedLoadmore}
                                                onChange={(instafeedLoadmore) => setAttributes({ instafeedLoadmore })}
                                            />
                                        )}
                                        {instafeedLoadmore && (
                                            <TextControl
                                                label={__('Load More Label', 'embedpress')}
                                                value={instafeedLoadmoreLabel}
                                                onChange={(instafeedLoadmoreLabel) => setAttributes({ instafeedLoadmoreLabel })}
                                            />
                                        )}


                                    </div>
                                )
                            }


                        </PanelBody>

                        <CustomBranding attributes={attributes} setAttributes={setAttributes} />

                    </div>
                )
            }
        </div>


    )
}
