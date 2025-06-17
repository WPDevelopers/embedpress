/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { InspectorControls } from "@wordpress/block-editor";
import {
    PanelBody,
    TextControl,
    ToggleControl,
    SelectControl,
    NumberControl,
    PanelRow,
    ColorPicker,
    RangeControl
} from "@wordpress/components";

/**
 * Internal dependencies
 */
import { isInstagramFeed, isInstagramHashtag } from "./helper";
import { EPIcon } from "../../../GlobalCoponents/icons";

// Platform-specific inspector controls
import Youtube from "./InspectorControl/youtube";
import OpenSea from "./InspectorControl/opensea";
import Wistia from "./InspectorControl/wistia";
import Vimeo from "./InspectorControl/vimeo";
import SelfHosted from "./InspectorControl/selfhosted";
import Instafeed from "./InspectorControl/instafeed";
import Calendly from "./InspectorControl/calendly";
import CustomBranding from "./InspectorControl/custombranding";
import Spreaker from "./InspectorControl/spreaker";
import GooglePhotos from "./InspectorControl/google-photos";
import Upgrade from "./upgrade";

/**
 * Inspector Component
 *
 * Sidebar controls for the EmbedPress block with platform-specific controls
 */
export default function Inspector({
    attributes,
    setAttributes,
    isYTChannel,
    isYTVideo,
    isYTLive,
    isYTShorts,
    isOpensea,
    isOpenseaSingle,
    isWistiaVideo,
    isVimeoVideo,
    isSelfHostedVideo,
    isSelfHostedAudio,
    isCalendly,
    isTikTok,
    isSpreaker,
    isGooglePhotos
}) {
    const {
        url,
        width,
        height,
        videosize,
        contentShare,
        sharePosition,
        lockContent,
        customPlayer,
        playerPreset,
        playerColor,
        shareFacebook,
        shareTwitter,
        sharePinterest,
        shareLinkedin,
        editingURL,
        embedHTML,
        // Instagram attributes
        instaLayout,
        instafeedFeedType,
        instafeedAccountType,
        // YouTube attributes
        ispagination,
        ytChannelLayout,
        columns,
        gapbetweenvideos,
        pagesize,
        // Google Photos attributes
        mode,
    } = attributes;

    const isProPluginActive = typeof window.embedpressObj !== 'undefined' ? window.embedpressObj.is_pro_plugin_active : false;

    const roundToNearestFive = (value) => {
        return Math.round(value / 5) * 5;
    };

    // Auto-adjust dimensions for specific platforms
    if ((isYTVideo || isYTLive || isVimeoVideo) && width === '600' && height === '600') {
        setAttributes({ height: '340' });
    }

    if (isSelfHostedAudio) {
        setAttributes({ height: '48' });
    }

    if (isCalendly && width === '600' && height === '600') {
        setAttributes({ height: '950' });
    }

    if (isTikTok && width === '600' && height === '600') {
        setAttributes({ width: '350' });
        setAttributes({ height: '580' });
    }

    if (isInstagramHashtag(url) && width === '600') {
        setAttributes({ instafeedFeedType: 'hashtag_type' });
        setAttributes({ width: '900' });
    }

    return (
        !editingURL && embedHTML && (
            <InspectorControls>
                {!isOpensea && !isOpenseaSingle && (
                    <div className='embedpress-gutenberg-controls'>
                        <PanelBody title={<div className='ep-pannel-icon'>{EPIcon} {__('General', 'embedpress')}</div>}>
                            <div className='ep-controls-margin'>
                                {isInstagramFeed(url) && (
                                    <PanelRow>
                                        <div style={{ marginBottom: '10px', backgroundColor: '#ebe4ff', padding: '8px', borderRadius: '8px', fontWeight: 500 }} className='elementor-panel-alert elementor-panel-warning-info'>
                                            To enable full Instagram embedding experience, please add your access token <a href="/wp-admin/admin.php?page=embedpress&page_type=instagram" target='_blank'>here</a>.
                                        </div>
                                    </PanelRow>
                                )}

                                {isYTLive && (
                                    <p className='ep-live-video-info'>
                                        <span>ℹ️</span> {'The most recent live video will be seen.'}
                                    </p>
                                )}

                                {(isYTVideo || isVimeoVideo || isYTLive || isSelfHostedVideo) && (
                                    <SelectControl
                                        label={__("Video Size")}
                                        value={videosize}
                                        options={[
                                            { label: 'Fixed', value: 'fixed' },
                                            { label: 'Responsive', value: 'responsive' },
                                        ]}
                                        onChange={(videosize) => setAttributes({ videosize })}
                                    />
                                )}

                                {((!isYTVideo && !isYTLive && !isVimeoVideo && !isSelfHostedVideo) || (videosize === 'fixed')) && (
                                    <p>{__("You can adjust the width and height of embedded content.")}</p>
                                )}

                                {((isYTVideo || isVimeoVideo || isYTLive || isSelfHostedVideo) && (videosize === 'responsive')) && (
                                    <p>{__("You can adjust the width of embedded content.", "embedpress")}</p>
                                )}

                                <TextControl
                                    label={__("Width")}
                                    value={width}
                                    onChange={(width) => {
                                        (isVimeoVideo || isYTVideo || isYTLive || isSelfHostedVideo) ? (
                                            setAttributes({
                                                width: `${Math.round(width)}`,
                                                height: `${roundToNearestFive(Math.round((width * 9) / 16))}`
                                            })
                                        ) : (
                                            setAttributes({ width })
                                        )
                                    }}
                                />

                                {((!isInstagramFeed(url) && !isInstagramHashtag(url) && !isYTChannel) && ((!isYTVideo && !isVimeoVideo && !isYTLive && !isSelfHostedVideo) || (videosize === 'fixed'))) ||
                                    (isGooglePhotos && (mode === 'carousel' || mode === 'gallery-player')) ? (
                                    <TextControl
                                        label={__("Height")}
                                        value={height}
                                        onChange={(height) => {
                                            if (isVimeoVideo || isYTVideo || isYTLive || isSelfHostedVideo) {
                                                setAttributes({
                                                    height: `${Math.round(height)}`,
                                                    width: `${roundToNearestFive(Math.round((height * 16) / 9))}`
                                                });
                                            } else {
                                                setAttributes({ height });
                                            }
                                        }}
                                    />
                                ) : null}

                                {isYTVideo && (
                                    <div className={'ep-tips-and-tricks'}>
                                        {EPIcon}
                                        <a href="#" target={'_blank'} onClick={(e) => { e.preventDefault(); }}>
                                            {__("Tips & Tricks", "embedpress")}
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Instagram Feed Type Selection */}
                            {isInstagramFeed(url) && (
                                <div>
                                    <SelectControl
                                        label="Feed Type"
                                        value={instafeedFeedType}
                                        options={[
                                            { label: 'User Account', value: 'user_account_type' },
                                            { label: 'Hashtag', value: 'hashtag_type' },
                                            { label: 'Tagged(Coming Soon)', value: 'tagged_type' },
                                            { label: 'Mixed(Coming Soon)', value: 'mixed_type' }
                                        ]}
                                        onChange={(instafeedFeedType) => setAttributes({ instafeedFeedType })}
                                    />

                                    {!isProPluginActive && instafeedFeedType === 'hashtag_type' && (
                                        <PanelRow className="elementor-panel-alert elementor-panel-warning-info">
                                            <a style={{ color: 'red' }} target="_blank" href="https://wpdeveloper.com/in/upgrade-embedpress">
                                                {__('Only Available in Pro Version!', 'embedpress')}
                                            </a>
                                        </PanelRow>
                                    )}

                                    {instafeedFeedType === 'user_account_type' && (
                                        <SelectControl
                                            label="Account Type"
                                            value={instafeedAccountType}
                                            options={[
                                                { label: 'Personal', value: 'personal' },
                                                { label: 'Business', value: 'business' }
                                            ]}
                                            onChange={(instafeedAccountType) => setAttributes({ instafeedAccountType })}
                                        />
                                    )}
                                </div>
                            )}
                        </PanelBody>

                        {/* YouTube Channel Controls */}
                        {isYTChannel && (
                            <PanelBody title={__('YouTube Channel Settings', 'embedpress')} initialOpen={false}>
                                <SelectControl
                                    label={__('Layout', 'embedpress')}
                                    value={ytChannelLayout}
                                    options={[
                                        { label: __('Gallery', 'embedpress'), value: 'gallery' },
                                        { label: __('List', 'embedpress'), value: 'list' },
                                    ]}
                                    onChange={(value) => setAttributes({ ytChannelLayout: value })}
                                />

                                <NumberControl
                                    label={__('Columns', 'embedpress')}
                                    value={columns}
                                    onChange={(value) => setAttributes({ columns: value })}
                                    min={1}
                                    max={6}
                                />

                                <NumberControl
                                    label={__('Gap Between Videos', 'embedpress')}
                                    value={gapbetweenvideos}
                                    onChange={(value) => setAttributes({ gapbetweenvideos: value })}
                                    min={0}
                                    max={100}
                                />

                                <NumberControl
                                    label={__('Videos Per Page', 'embedpress')}
                                    value={pagesize}
                                    onChange={(value) => setAttributes({ pagesize: value })}
                                    min={1}
                                    max={50}
                                />

                                <ToggleControl
                                    label={__('Show Pagination', 'embedpress')}
                                    checked={ispagination}
                                    onChange={(value) => setAttributes({ ispagination: value })}
                                />
                            </PanelBody>
                        )}

                        {/* Instagram Layout Controls */}
                        {isInstagramFeed(url) && (
                            <PanelBody title={__('Instagram Layout', 'embedpress')} initialOpen={false}>
                                <SelectControl
                                    label={__('Layout Type', 'embedpress')}
                                    value={instaLayout}
                                    options={[
                                        { label: __('Grid', 'embedpress'), value: 'insta-grid' },
                                        { label: __('Carousel', 'embedpress'), value: 'insta-carousel' },
                                    ]}
                                    onChange={(value) => setAttributes({ instaLayout: value })}
                                />
                            </PanelBody>
                        )}
                    </div>
                )}

                {/* Platform-specific controls */}
                <Instafeed attributes={attributes} setAttributes={setAttributes} />
                <Youtube
                    attributes={attributes}
                    setAttributes={setAttributes}
                    isYTVideo={isYTVideo}
                    isYTLive={isYTLive}
                    isYTShorts={isYTShorts}
                />
                <SelfHosted attributes={attributes} setAttributes={setAttributes} />
                <Spreaker attributes={attributes} setAttributes={setAttributes} />
                <Wistia
                    attributes={attributes}
                    setAttributes={setAttributes}
                    isWistiaVideo={isWistiaVideo}
                />
                <Vimeo
                    attributes={attributes}
                    setAttributes={setAttributes}
                    isVimeoVideo={isVimeoVideo}
                />
                <Calendly
                    attributes={attributes}
                    setAttributes={setAttributes}
                    isCalendly={isCalendly}
                />
                <GooglePhotos attributes={attributes} setAttributes={setAttributes} />

                {isYTChannel && !isYTLive && (
                    <CustomBranding attributes={attributes} setAttributes={setAttributes} />
                )}

                {/* Content Protection */}
                <PanelBody title={__('Content Protection', 'embedpress')} initialOpen={false}>
                    <ToggleControl
                        label={__('Lock Content', 'embedpress')}
                        checked={lockContent}
                        onChange={(value) => setAttributes({ lockContent: value })}
                        help={__('Require password or user role to view content', 'embedpress')}
                    />
                </PanelBody>

                {/* Social Sharing */}
                <PanelBody title={__('Social Sharing', 'embedpress')} initialOpen={false}>
                    <ToggleControl
                        label={__('Enable Social Sharing', 'embedpress')}
                        checked={contentShare}
                        onChange={(value) => setAttributes({ contentShare: value })}
                    />

                    {contentShare && (
                        <>
                            <SelectControl
                                label={__('Share Position', 'embedpress')}
                                value={sharePosition}
                                options={[
                                    { label: __('Right', 'embedpress'), value: 'right' },
                                    { label: __('Left', 'embedpress'), value: 'left' },
                                    { label: __('Top', 'embedpress'), value: 'top' },
                                    { label: __('Bottom', 'embedpress'), value: 'bottom' },
                                ]}
                                onChange={(value) => setAttributes({ sharePosition: value })}
                            />

                            <ToggleControl
                                label={__('Facebook', 'embedpress')}
                                checked={shareFacebook}
                                onChange={(value) => setAttributes({ shareFacebook: value })}
                            />

                            <ToggleControl
                                label={__('Twitter', 'embedpress')}
                                checked={shareTwitter}
                                onChange={(value) => setAttributes({ shareTwitter: value })}
                            />

                            <ToggleControl
                                label={__('Pinterest', 'embedpress')}
                                checked={sharePinterest}
                                onChange={(value) => setAttributes({ sharePinterest: value })}
                            />

                            <ToggleControl
                                label={__('LinkedIn', 'embedpress')}
                                checked={shareLinkedin}
                                onChange={(value) => setAttributes({ shareLinkedin: value })}
                            />
                        </>
                    )}
                </PanelBody>

                {/* Custom Player */}
                <PanelBody title={__('Custom Player', 'embedpress')} initialOpen={false}>
                    <ToggleControl
                        label={__('Enable Custom Player', 'embedpress')}
                        checked={customPlayer}
                        onChange={(value) => setAttributes({ customPlayer: value })}
                        help={__('Use EmbedPress custom video player', 'embedpress')}
                    />

                    {customPlayer && (
                        <>
                            <SelectControl
                                label={__('Player Preset', 'embedpress')}
                                value={playerPreset}
                                options={[
                                    { label: __('Default', 'embedpress'), value: 'preset-default' },
                                    { label: __('Modern', 'embedpress'), value: 'preset-modern' },
                                    { label: __('Classic', 'embedpress'), value: 'preset-classic' },
                                ]}
                                onChange={(value) => setAttributes({ playerPreset: value })}
                            />

                            <TextControl
                                label={__('Player Color', 'embedpress')}
                                value={playerColor}
                                onChange={(value) => setAttributes({ playerColor: value })}
                                help={__('Hex color code for player theme', 'embedpress')}
                            />
                        </>
                    )}
                </PanelBody>

                {/* OpenSea Controls */}
                <OpenSea
                    attributes={attributes}
                    setAttributes={setAttributes}
                    isOpensea={isOpensea}
                    isOpenseaSingle={isOpenseaSingle}
                />

                {/* Upgrade to Pro */}
                <Upgrade />
            </InspectorControls>
        )
    );
}
