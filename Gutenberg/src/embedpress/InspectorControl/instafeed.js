/**
 * WordPress dependencies
 */

import { addProAlert, isPro, removeAlert, isInstagramFeed } from '../../common/helper';
import ControlHeader from '../../common/control-heading';
import CustomBranding from './custombranding';

const { isShallowEqualObjects } = wp.isShallowEqual;
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
} = wp.components;


export default function Instafeed({ attributes, setAttributes }) {

    const {
        url,
        instaLayout,
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

    return (
        <div>

            {
                (_isInstagramFeed) && (
                    <div className={'ep__instafeed-options'}>
                        <PanelBody title={__('Instagram Profile Settings', 'embedpress')} initialOpen={false}>
                            <ToggleControl
                                label={__('Profile Image', 'your-plugin')}
                                checked={instafeedProfileImage}
                                onChange={(value) => setAttributes({ instafeedProfileImage: value })}
                            />
                            {instafeedProfileImage && (
                                <TextControl
                                    label={__('Image URL', 'your-plugin')}
                                    value={instafeedProfileImageUrl}
                                    onChange={(value) => setAttributes({ instafeedProfileImageUrl: value })}
                                />
                            )}

                            <ToggleControl
                                label={__('Follow Button', 'your-plugin')}
                                checked={instafeedFollowBtn}
                                onChange={(value) => setAttributes({ instafeedFollowBtn: value })}
                            />
                            {instafeedFollowBtn && (
                                <TextControl
                                    label={__('Button Label', 'your-plugin')}
                                    value={instafeedFollowBtnLabel}
                                    onChange={(value) => setAttributes({ instafeedFollowBtnLabel: value })}
                                />
                            )}

                            <ToggleControl
                                label={__('Posts Count', 'your-plugin')}
                                checked={instafeedPostsCount}
                                onChange={(value) => setAttributes({ instafeedPostsCount: value })}
                            />
                            {instafeedPostsCount && (
                                <TextControl
                                    label={__('Count Text', 'your-plugin')}
                                    value={instafeedPostsCountText}
                                    onChange={(value) => setAttributes({ instafeedPostsCountText: value })}
                                />
                            )}

                            <ToggleControl
                                label={__('Followers Count', 'your-plugin')}
                                checked={instafeedFollowersCount}
                                onChange={(value) => setAttributes({ instafeedFollowersCount: value })}
                            />
                            {instafeedFollowersCount && (
                                <TextControl
                                    label={__('Count Text', 'your-plugin')}
                                    value={instafeedFollowersCountText}
                                    onChange={(value) => setAttributes({ instafeedFollowersCountText: value })}
                                />
                            )}

                            <ToggleControl
                                label={__('Account Name', 'your-plugin')}
                                checked={instafeedAccName}
                                onChange={(value) => setAttributes({ instafeedAccName: value })}
                            />


                        </PanelBody>

                        <PanelBody title={__('Instagram Feed Settings', 'embedpress')} initialOpen={false}>
                            {
                                isInstagramFeed(url) && (
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
