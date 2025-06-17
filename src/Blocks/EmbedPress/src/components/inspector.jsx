/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { InspectorControls } from "@wordpress/block-editor";
import {
    PanelBody,
    TextControl,
    ToggleControl,
    SelectControl
} from "@wordpress/components";

/**
 * Inspector Component
 * 
 * Sidebar controls for the EmbedPress block
 */
export default function Inspector({ attributes, setAttributes }) {
    const {
        url,
        width,
        height,
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
    } = attributes;

    return (
        <InspectorControls>
            <PanelBody title={__('Embed Settings', 'embedpress')} initialOpen={true}>
                <TextControl
                    label={__('URL', 'embedpress')}
                    value={url}
                    onChange={(value) => setAttributes({ url: value })}
                    help={__('The URL to embed', 'embedpress')}
                />
                
                <TextControl
                    label={__('Width', 'embedpress')}
                    value={width}
                    onChange={(value) => setAttributes({ width: value })}
                    help={__('Width of the embed (e.g., 600px or 100%)', 'embedpress')}
                />
                
                <TextControl
                    label={__('Height', 'embedpress')}
                    value={height}
                    onChange={(value) => setAttributes({ height: value })}
                    help={__('Height of the embed (e.g., 400px)', 'embedpress')}
                />
            </PanelBody>

            <PanelBody title={__('Content Protection', 'embedpress')} initialOpen={false}>
                <ToggleControl
                    label={__('Lock Content', 'embedpress')}
                    checked={lockContent}
                    onChange={(value) => setAttributes({ lockContent: value })}
                    help={__('Require password or user role to view content', 'embedpress')}
                />
            </PanelBody>

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
        </InspectorControls>
    );
}
