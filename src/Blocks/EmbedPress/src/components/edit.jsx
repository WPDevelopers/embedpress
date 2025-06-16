/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment, useEffect } from '@wordpress/element';
import { useBlockProps } from '@wordpress/block-editor';
import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import Inspector from './inspector.jsx';
import { PROVIDERS, API_ENDPOINTS } from './constants';
import { EmbedPreview } from '@components';
import { validateURL, trackEvent } from '@utils';

/**
 * External dependencies
 */
import md5 from 'md5';

const Edit = (props) => {
    const { attributes, setAttributes, clientId } = props;
    const {
        url,
        embedHTML,
        editingURL,
        fetching,
        cannotEmbed,
        height,
        width,
        contentShare,
        sharePosition,
        shareFacebook,
        shareTwitter,
        sharePinterest,
        shareLinkedin,
    } = attributes;

    const blockProps = useBlockProps();

    // Set client ID if not set
    useEffect(() => {
        if (!attributes.clientId) {
            setAttributes({ clientId });
        }
    }, [clientId, attributes.clientId, setAttributes]);

    // Detect provider from URL
    const detectProvider = (url) => {
        if (!url) return null;
        
        for (const [key, provider] of Object.entries(PROVIDERS)) {
            if (provider.patterns.some(pattern => url.includes(pattern))) {
                return provider;
            }
        }
        return null;
    };

    const provider = detectProvider(url);

    // Handle URL submission
    const handleSubmit = async (event) => {
        if (event) event.preventDefault();

        if (!url || !validateURL(url)) {
            setAttributes({
                cannotEmbed: true,
                fetching: false,
                editingURL: true
            });
            return;
        }

        setAttributes({ fetching: true, cannotEmbed: false });

        try {
            // Track embed attempt
            trackEvent('embed_attempt', {
                provider: provider?.name || 'Unknown',
                url: url,
                clientId: clientId
            });

            // Prepare API parameters
            let params = {
                url,
                width: width || '600',
                height: height || '400',
            };

            // Apply filters to allow extensions to modify parameters
            params = applyFilters('embedpress_block_rest_param', params, attributes);

            // Make API request
            const response = await wp.apiFetch({
                path: API_ENDPOINTS.OEMBED,
                method: 'POST',
                data: params
            });

            if (response && response.embed) {
                setAttributes({
                    embedHTML: response.embed,
                    cannotEmbed: false,
                    editingURL: false,
                    fetching: false
                });

                // Track successful embed
                trackEvent('embed_success', {
                    provider: provider?.name || 'Unknown',
                    url: url,
                    clientId: clientId
                });
            } else {
                throw new Error('No embed data received');
            }
        } catch (error) {
            console.error('EmbedPress: Failed to fetch embed', error);
            
            setAttributes({
                cannotEmbed: true,
                editingURL: true,
                fetching: false
            });

            // Track failed embed
            trackEvent('embed_error', {
                provider: provider?.name || 'Unknown',
                url: url,
                error: error.message,
                clientId: clientId
            });
        }
    };

    // Handle URL change
    const handleURLChange = (newUrl) => {
        setAttributes({ 
            url: newUrl,
            cannotEmbed: false 
        });
    };

    // Switch back to URL input
    const switchBackToURLInput = () => {
        setAttributes({ editingURL: true });
    };

    // Generate share HTML if enabled
    const generateShareHTML = () => {
        if (!contentShare) return '';
        
        const shareButtons = [];
        if (shareFacebook) shareButtons.push('<a href="#" class="ep-share-facebook">Facebook</a>');
        if (shareTwitter) shareButtons.push('<a href="#" class="ep-share-twitter">Twitter</a>');
        if (sharePinterest) shareButtons.push('<a href="#" class="ep-share-pinterest">Pinterest</a>');
        if (shareLinkedin) shareButtons.push('<a href="#" class="ep-share-linkedin">LinkedIn</a>');
        
        return `<div class="ep-social-share ep-share-${sharePosition}">${shareButtons.join('')}</div>`;
    };

    return (
        <Fragment>
            <Inspector
                attributes={attributes}
                setAttributes={setAttributes}
                provider={provider}
            />

            <div {...blockProps}>
                {(!embedHTML || editingURL) && !fetching && (
                    <div className="embedpress-placeholder">
                        <div className="embedpress-placeholder__content">
                            <h3>{__('EmbedPress', 'embedpress')}</h3>
                            <p>{__('Embed content from 150+ providers', 'embedpress')}</p>
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => handleURLChange(e.target.value)}
                                    placeholder={__('Enter URL to embed...', 'embedpress')}
                                    style={{ marginBottom: '12px', width: '100%', padding: '8px' }}
                                />
                                <button type="submit" disabled={!url || !validateURL(url)}>
                                    {__('Embed', 'embedpress')}
                                </button>
                            </form>
                            {cannotEmbed && (
                                <p style={{ color: 'red' }}>
                                    {__('Sorry, this content could not be embedded.', 'embedpress')}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {fetching && (
                    <div className="embedpress-loading">
                        <div className="embedpress-spinner"></div>
                        <p>{__('Loading embed...', 'embedpress')}</p>
                    </div>
                )}

                {embedHTML && !editingURL && !fetching && (
                    <div className="embedpress-embed-wrapper">
                        <div
                            dangerouslySetInnerHTML={{ __html: embedHTML + generateShareHTML() }}
                            style={{ width: width, height: height }}
                        />

                        <div className="embedpress-controls">
                            <button onClick={switchBackToURLInput}>
                                {__('Edit', 'embedpress')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Fragment>
    );
};

export default Edit;
