/**
 * WordPress dependencies
 */

import { addProAlert, isPro, removeAlert, isInstagramFeed } from '../../common/helper';
import ControlHeader from '../../common/control-heading';
import CustomBranding from './custombranding';
import { getParams } from '../functions';
import { EPIcon } from './../../common/icons';



const { isShallowEqualObjects } = wp.isShallowEqual;

import { MediaUpload } from "@wordpress/block-editor";
const { useState, useEffect } = wp.element;
const { __ } = wp.i18n;
const { addFilter } = wp.hooks;

const {
    TextControl,
    SelectControl,
    RangeControl,
    ToggleControl,
    PanelBody,
    Button,
    ColorPalette,
    PanelRow
} = wp.components;


/**
 *
 * @param {object} attributes
 * @returns
 */





const isProPluginActive = embedpressObj.is_pro_plugin_active;


export const init = () => {
    addFilter('embedpress_block_rest_param', 'embedpress', getInstafeedParams, 10);
}


export const getInstafeedParams = (params, attributes) => {
    if (!attributes.url || !(isInstagramFeed(attributes.url))) {
        return params;
    }
    // which attributes should be passed with rest api.
    const defaults = {
        width: '900',
        instafeedAccName: true,
        instafeedProfileImage: true,
        instafeedProfileImageUrl: '',
        instafeedFollowBtn: true,
        instafeedFollowBtnLabel: 'Follow',
        instafeedPostsCount: true,
        instafeedPostsCountText: '[count] posts',
        instafeedFollowersCount: true,
        instafeedFollowersCountText: '[count] followers',
        instaLayout: 'insta-grid',
        instafeedFeedType: 'user_account_type',
        instafeedAccountType: 'personal',
        instafeedColumns: '3',
        instafeedColumnsGap: '5',
        instafeedPostsPerPage: true,
        instafeedTab: true,
        instafeedCommentsCount: false,
        instafeedLikesCount: false,
        instafeedPopup: true,
        instafeedPopupFollowBtn: true,
        instafeedPopupFollowBtnLabel: 'Follow',
        instafeedLoadmore: true,
        instafeedLoadmoreLabel: 'Load More',
        slidesShow: '4',
        slidesScroll: '4',
        carouselAutoplay: false,
        autoplaySpeed: '3000',
        transitionSpeed: '1000',
        carouselLoop: true,
        carouselArrows: true,
        carouselSpacing: '0',
        carouselDots: false,
    };

    return getParams(params, attributes, defaults);
}
//
export const useInstafeed = (attributes) => {
    // which attribute should call embed();
    const defaults = {
        width: null,
        instaLayout: null,
        instafeedFeedType: null,
        instafeedAccountType: null,
        slidesShow: null,
        slidesScroll: null,
        carouselAutoplay: null,
        autoplaySpeed: null,
        transitionSpeed: null,
        carouselLoop: null,
        carouselArrows: null,
        carouselSpacing: null,
        instafeedProfileImage: null,
        instafeedProfileImageUrl: null,
        instafeedFollowBtn: null,
        instafeedFollowBtnLabel: null,
        instafeedPostsCount: null,
        instafeedPostsCountText: null,
        instafeedFollowersCount: null,
        instafeedFollowersCountText: null,
        instafeedAccName: null,
        instafeedColumns: null,
        instafeedColumnsGap: null,
        instafeedPostsPerPage: null,
        instafeedTab: null,
        instafeedCommentsCount: null,
        instafeedLikesCount: null,
        instafeedPopup: null,
        instafeedPopupFollowBtn: null,
        instafeedPopupFollowBtnLabel: null,
        instafeedLoadmore: null,
        instafeedLoadmoreLabel: null,
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
        instafeedFeedType,
        instafeedAccountType,
        instafeedColumns,
        instafeedColumnsGap,
        instafeedPostsPerPage,
        instafeedTab,
        instafeedCommentsCount,
        instafeedLikesCount,
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


    const onSelectImage = (logo) => {
        console.log(logo.sizes.full.url);
        setAttributes({ instafeedProfileImageUrl: logo.sizes.full.url });
    }
    const removeImage = (e) => {
        setAttributes({ instafeedProfileImageUrl: '' });
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

    if (instaLayout === 'insta-carousel') {
        setAttributes({ instafeedLoadmore: false })
    }


    return (
        <div>

            {
                (_isInstagramFeed) && (
                    <div className={'ep__instafeed-options'}>
                        <PanelBody title={<div className='ep-pannel-icon'>{EPIcon} {__('Profile Settings', 'embedpress')}</div>} initialOpen={false}>
                            <ToggleControl
                                label={__('Profile Image', 'embedpress')}
                                checked={instafeedProfileImage}
                                onChange={(instafeedProfileImage) => setAttributes({ instafeedProfileImage })}
                            />
                            {
                                instafeedProfileImageUrl && (
                                    <div className={'ep__custom-logo'} style={{ position: 'relative' }}>
                                        <button title="Remove Image" className="ep-remove__image" type="button" onClick={removeImage} >
                                            <span class="dashicon dashicons dashicons-trash"></span>
                                        </button>
                                        <img
                                            src={instafeedProfileImageUrl}
                                            alt="John"
                                        />
                                    </div>
                                )
                            }


                            <div className={isProPluginActive ? "pro-control-active" : "pro-control"} onClick={(e) => { addProAlert(e, isProPluginActive) }}>
                                {instafeedProfileImage && (
                                    <MediaUpload
                                        onSelect={onSelectImage}
                                        allowedTypes={['image']}
                                        value={instafeedProfileImageUrl}
                                        render={({ open }) => (
                                            <Button className={'ep-logo-upload-button instagram-profile-image-uploader'} icon={!instafeedProfileImageUrl ? 'upload' : 'update'} onClick={open}>
                                                {
                                                    (!instafeedProfileImageUrl) ? 'Upload Image' : 'Change Image'
                                                }
                                            </Button>
                                        )}
                                    />
                                )}
                                {
                                    (!isProPluginActive) && (
                                        <span className='isPro'>{__('pro', 'embedpress')}</span>
                                    )
                                }
                            </div>

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


                            {instafeedAccountType === 'business' && (
                                <ToggleControl
                                    label={__('Followers Count', 'embedpress')}
                                    checked={instafeedFollowersCount}
                                    onChange={(instafeedFollowersCount) => setAttributes({ instafeedFollowersCount })}
                                />
                            )}

                            {instafeedFollowersCount && (instafeedAccountType === 'business') && (
                                <TextControl
                                    label={__('Count Text', 'embedpress')}
                                    value={instafeedFollowersCountText}
                                    onChange={(instafeedFollowersCountText) => setAttributes({ instafeedFollowersCountText })}
                                />
                            )}

                            <ToggleControl
                                label={__('Account Name', 'embedpress')}
                                checked={instafeedAccName}
                                onChange={(instafeedAccName) => setAttributes({ instafeedAccName })}
                            />


                        </PanelBody>

                        <PanelBody title={<div className='ep-pannel-icon'>{EPIcon} {__('Feed Settings', 'embedpress')}</div>} initialOpen={false}>
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

                                        {instaLayout === 'insta-carousel' && (
                                            <PanelRow className="elementor-panel-alert elementor-panel-warning-info margin-bottom-10">
                                                Changes will apply in frontend.
                                            </PanelRow>

                                        )}


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
                                            console.log({ instafeedColumns })
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

                                        <div className={isProPluginActive ? "pro-control-active" : "pro-control"} onClick={(e) => { addProAlert(e, isProPluginActive) }}>
                                            <ToggleControl
                                                label={__('Feed Tab', 'embedpress')}
                                                checked={instafeedTab}
                                                onChange={(instafeedTab) => setAttributes({ instafeedTab })}
                                            />
                                            {
                                                (!isProPluginActive) && (
                                                    <span className='isPro'>{__('pro', 'embedpress')}</span>
                                                )
                                            }
                                        </div>

                                        <div className={isProPluginActive ? "pro-control-active" : "pro-control"} onClick={(e) => { addProAlert(e, isProPluginActive) }}>
                                            {
                                                (instafeedAccountType === 'business' || instafeedFeedType === 'hashtag_type') && (
                                                    <ToggleControl
                                                        label={__('Likes Count', 'embedpress')}
                                                        checked={instafeedLikesCount}
                                                        onChange={(instafeedLikesCount) => setAttributes({ instafeedLikesCount })}
                                                    />
                                                )
                                            }
                                            {
                                                (!isProPluginActive) && (
                                                    <span className='isPro'>{__('pro', 'embedpress')}</span>
                                                )
                                            }
                                        </div>

                                        <div className={isProPluginActive ? "pro-control-active" : "pro-control"} onClick={(e) => { addProAlert(e, isProPluginActive) }}>
                                            {
                                                (instafeedAccountType === 'business' || instafeedFeedType === 'hashtag_type') && (
                                                    <ToggleControl
                                                        label={__('Comments Count', 'embedpress')}
                                                        checked={instafeedCommentsCount}
                                                        onChange={(instafeedCommentsCount) => setAttributes({ instafeedCommentsCount })}
                                                    />
                                                )
                                            }
                                            {
                                                (!isProPluginActive) && (
                                                    <span className='isPro'>{__('pro', 'embedpress')}</span>
                                                )
                                            }
                                        </div>




                                        <ToggleControl
                                            label={__('Popup', 'embedpress')}
                                            checked={instafeedPopup}
                                            onChange={(instafeedPopup) => setAttributes({ instafeedPopup })}
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

                    </div >
                )
            }
        </div >


    )
}
