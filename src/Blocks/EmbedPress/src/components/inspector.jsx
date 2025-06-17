/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { 
    PanelBody, 
    TextControl, 
    ToggleControl, 
    SelectControl,
    // RangeControl 
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { SHARE_POSITIONS, PLAYER_PRESETS, PROTECTION_TYPES } from './constants';

const Inspector = ({ attributes, setAttributes, provider }) => {
    const {
        url,
        width,
        height,
        contentShare,
        sharePosition,
        shareFacebook,
        shareTwitter,
        sharePinterest,
        shareLinkedin,
        lockContent,
        protectionType,
        contentPassword,
        customPlayer,
        playerPreset,
        playerColor,
        autoplay,
        muteVideo,
        controls,
        fullscreen,
    } = attributes;

    return (
        <InspectorControls>
            {/* Basic Settings */}
            <PanelBody title={__('Embed Settings', 'embedpress')} initialOpen={true}>
                <TextControl
                    label={__('URL', 'embedpress')}
                    value={url}
                    onChange={(value) => setAttributes({ url: value })}
                    placeholder={__('Enter URL to embed...', 'embedpress')}
                    help={__('Paste any URL from 150+ supported providers', 'embedpress')}
                />
                
                <div style={{ display: 'flex', gap: '12px' }}>
                    <TextControl
                        label={__('Width', 'embedpress')}
                        value={width}
                        onChange={(value) => setAttributes({ width: value })}
                        placeholder="600"
                        type="number"
                    />
                    <TextControl
                        label={__('Height', 'embedpress')}
                        value={height}
                        onChange={(value) => setAttributes({ height: value })}
                        placeholder="400"
                        type="number"
                    />
                </div>

                {provider && (
                    <p className="embedpress-provider-info">
                        <strong>{__('Detected Provider:', 'embedpress')}</strong> {provider.name}
                    </p>
                )}
            </PanelBody>

            {/* Social Sharing */}
            <PanelBody title={__('Social Sharing', 'embedpress')} initialOpen={false}>
                <ToggleControl
                    label={__('Enable Social Sharing', 'embedpress')}
                    checked={contentShare}
                    onChange={(value) => setAttributes({ contentShare: value })}
                    help={__('Show social sharing buttons for this embed', 'embedpress')}
                />

                {contentShare && (
                    <>
                        <SelectControl
                            label={__('Share Position', 'embedpress')}
                            value={sharePosition}
                            options={SHARE_POSITIONS}
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

            {/* Content Protection */}
            <PanelBody title={__('Content Protection', 'embedpress')} initialOpen={false}>
                <ToggleControl
                    label={__('Lock Content', 'embedpress')}
                    checked={lockContent}
                    onChange={(value) => setAttributes({ lockContent: value })}
                    help={__('Protect this embed with password or user roles', 'embedpress')}
                />

                {lockContent && (
                    <>
                        <SelectControl
                            label={__('Protection Type', 'embedpress')}
                            value={protectionType}
                            options={PROTECTION_TYPES}
                            onChange={(value) => setAttributes({ protectionType: value })}
                        />

                        {(protectionType === 'password' || protectionType === 'both') && (
                            <TextControl
                                label={__('Password', 'embedpress')}
                                value={contentPassword}
                                onChange={(value) => setAttributes({ contentPassword: value })}
                                type="password"
                                help={__('Users will need this password to view the content', 'embedpress')}
                            />
                        )}
                    </>
                )}
            </PanelBody>

            {/* Custom Player (for video providers) */}
            {provider && provider.type === 'video' && (
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
                                options={PLAYER_PRESETS}
                                onChange={(value) => setAttributes({ playerPreset: value })}
                            />

                            <TextControl
                                label={__('Player Color', 'embedpress')}
                                value={playerColor}
                                onChange={(value) => setAttributes({ playerColor: value })}
                                type="color"
                            />

                            <ToggleControl
                                label={__('Autoplay', 'embedpress')}
                                checked={autoplay}
                                onChange={(value) => setAttributes({ autoplay: value })}
                            />

                            <ToggleControl
                                label={__('Mute Video', 'embedpress')}
                                checked={muteVideo}
                                onChange={(value) => setAttributes({ muteVideo: value })}
                            />

                            <ToggleControl
                                label={__('Show Controls', 'embedpress')}
                                checked={controls}
                                onChange={(value) => setAttributes({ controls: value })}
                            />

                            <ToggleControl
                                label={__('Allow Fullscreen', 'embedpress')}
                                checked={fullscreen}
                                onChange={(value) => setAttributes({ fullscreen: value })}
                            />
                        </>
                    )}
                </PanelBody>
            )}
        </InspectorControls>
    );
};

export default Inspector;
