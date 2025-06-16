/**
 * EmbedPress Block Edit Component
 * 
 * Example of how to use shared components in Gutenberg blocks.
 */

import React, { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { InspectorControls, BlockControls } from '@wordpress/block-editor';
import { PanelBody, ToolbarGroup, ToolbarButton } from '@wordpress/components';

// Import shared components using the new alias system
import { Button, Input, Toggle, EmbedPreview, SocialShareControls } from '@components';
import { useEmbedPreview, useProviderDetection } from '@hooks';
import { validateURL, trackEvent } from '@utils';

const Edit = ({ attributes, setAttributes, clientId }) => {
    const { url, width, height, responsive, shareFacebook, shareTwitter, sharePinterest, shareLinkedin } = attributes;
    const [isLoading, setIsLoading] = useState(false);
    
    // Use shared hooks
    const { embedData, isValidating } = useEmbedPreview(url);
    const { provider, isSupported } = useProviderDetection(url);

    const handleURLChange = (newUrl) => {
        setAttributes({ url: newUrl });
        
        // Track URL change event using shared utility
        trackEvent('embed_url_changed', {
            provider: provider,
            block_id: clientId
        });
    };

    const handlePreviewRefresh = () => {
        setIsLoading(true);
        // Refresh logic here
        setTimeout(() => setIsLoading(false), 1000);
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Embed Settings', 'embedpress')} initialOpen={true}>
                    <Input
                        label={__('URL', 'embedpress')}
                        value={url}
                        onChange={handleURLChange}
                        placeholder={__('Enter URL to embed...', 'embedpress')}
                        help={__('Paste any URL from 150+ supported providers', 'embedpress')}
                    />
                    
                    <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                        <Input
                            label={__('Width', 'embedpress')}
                            value={width}
                            onChange={(value) => setAttributes({ width: value })}
                            placeholder="600"
                            type="number"
                        />
                        <Input
                            label={__('Height', 'embedpress')}
                            value={height}
                            onChange={(value) => setAttributes({ height: value })}
                            placeholder="400"
                            type="number"
                        />
                    </div>
                    
                    <Toggle
                        label={__('Responsive', 'embedpress')}
                        checked={responsive}
                        onChange={(value) => setAttributes({ responsive: value })}
                        help={__('Make embed responsive to container width', 'embedpress')}
                    />
                </PanelBody>

                <PanelBody title={__('Social Sharing', 'embedpress')} initialOpen={false}>
                    <SocialShareControls
                        facebook={shareFacebook}
                        twitter={shareTwitter}
                        pinterest={sharePinterest}
                        linkedin={shareLinkedin}
                        onChange={(platform, enabled) => {
                            setAttributes({ [`share${platform}`]: enabled });
                        }}
                    />
                </PanelBody>
            </InspectorControls>

            <BlockControls>
                <ToolbarGroup>
                    <ToolbarButton
                        icon="update"
                        label={__('Refresh Preview', 'embedpress')}
                        onClick={handlePreviewRefresh}
                        disabled={isLoading || !url}
                    />
                </ToolbarGroup>
            </BlockControls>

            <div className="embedpress-block-edit">
                {!url ? (
                    <div className="embedpress-placeholder">
                        <div className="embedpress-placeholder__content">
                            <h3>{__('EmbedPress', 'embedpress')}</h3>
                            <p>{__('Embed content from 150+ providers', 'embedpress')}</p>
                            <Input
                                value={url}
                                onChange={handleURLChange}
                                placeholder={__('Enter URL to embed...', 'embedpress')}
                                style={{ marginBottom: '12px' }}
                            />
                            <Button
                                variant="primary"
                                disabled={!url || !validateURL(url)}
                                onClick={() => {
                                    // Handle embed creation
                                    trackEvent('embed_created', { provider });
                                }}
                            >
                                {__('Create Embed', 'embedpress')}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <EmbedPreview
                        url={url}
                        width={width}
                        height={height}
                        responsive={responsive}
                        loading={isValidating || isLoading}
                        provider={provider}
                        embedData={embedData}
                        onRefresh={handlePreviewRefresh}
                    />
                )}
            </div>
        </>
    );
};

export default Edit;
