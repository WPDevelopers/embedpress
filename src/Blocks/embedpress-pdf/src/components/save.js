/**
 * Internal dependencies
 */
import SocialShareHtml from '../../../GlobalCoponents/social-share-html.js';
import Logo from '../../../GlobalCoponents/Logo.js';
import AdTemplate from '../../../GlobalCoponents/ads-template.js';
import { sanitizeUrl, getIframeTitle } from '../../../GlobalCoponents/helper.js';
import md5 from "md5";

const { applyFilters } = wp.hooks;

/**
 * WordPress dependencies
 */
const { useBlockProps } = wp.blockEditor;
const { Fragment } = wp.element;

import "../style.scss";


/**
 * Save component for EmbedPress PDF block
 * Renders the same content as the editor for consistent design
 */
const Save = ({ attributes }) => {
    const blockProps = useBlockProps.save();

    const {
        href,
        fileName,
        mime,
        id,
        unitoption,
        width,
        height,
        powered_by,
        themeMode,
        customColor,
        presentation,
        lazyLoad,
        position,
        flipbook_toolbar_position,
        download,
        add_text,
        draw,
        toolbar,
        copy_text,
        doc_details,
        doc_rotation,
        add_image,
        selection_tool,
        scrolling,
        spreads,
        clientId,
        sharePosition,
        contentShare,
        adManager,
        adSource,
        adFileUrl,
        adXPosition,
        adYPosition,
        viewerStyle,
        displayMode,
        lightboxThumbnail,
        lightboxAlign,
        zoomIn,
        zoomOut,
        fitView,
        bookmark,
        customlogo,
        watermarkText,
        watermarkFontSize,
        watermarkColor,
        watermarkOpacity,
        watermarkStyle
    } = attributes;

    if (!href) {
        return null;
    }

    let width_class = '';
    if (unitoption === '%') {
        width_class = 'ep-percentage-width';
    } else {
        width_class = 'ep-fixed-width';
    }

    let content_share_class = '';
    let share_position_class = '';
    let share_position = sharePosition ? sharePosition : 'right';
    if (contentShare) {
        content_share_class = 'ep-content-share-enabled';
        share_position_class = 'ep-share-position-' + share_position;
    }



    function getParamData(href) {
        let pdf_params = '';
        let colorsObj = {};

        //Generate PDF params
        if (themeMode === 'custom') {
            colorsObj = {
                customColor: (customColor && (customColor !== 'default')) ? customColor : '#403A81',
            }
        }

        let _pdf_params = {
            themeMode: themeMode ? themeMode : 'default',
            ...colorsObj,
            presentation: presentation ? presentation : false,
            lazyLoad: lazyLoad ? lazyLoad : false,
            position: position ? position : 'top',
            flipbook_toolbar_position: flipbook_toolbar_position ? flipbook_toolbar_position : 'bottom',
            download: download ? download : false,
            toolbar: toolbar ? toolbar : false,
            copy_text: copy_text ? copy_text : false,
            add_text: add_text ? add_text : false,
            draw: draw ? draw : false,
            doc_details: doc_details ? doc_details : false,
            doc_rotation: doc_rotation ? doc_rotation : false,
            add_image: add_image ? add_image : false,
            zoom_in: zoomIn ? zoomIn : false,
            zoom_out: zoomOut ? zoomOut : false,
            fit_view: fitView ? fitView : false,
            bookmark: bookmark ? bookmark : false,
            selection_tool: selection_tool ? selection_tool : '0',
            scrolling: scrolling ? scrolling : '-1',
            spreads: spreads ? spreads : '0',
            watermark_text: watermarkText ? watermarkText : '',
            watermark_font_size: watermarkFontSize ? watermarkFontSize : '48',
            watermark_color: watermarkColor ? watermarkColor : '#000000',
            watermark_opacity: watermarkOpacity ? watermarkOpacity : '15',
            watermark_style: watermarkStyle ? watermarkStyle : 'center',
        };

        // Convert object to query string
        const queryString = new URLSearchParams(_pdf_params).toString();

        // Encode the query string to base64
        const base64String = btoa(encodeURIComponent(queryString).replace(/%([0-9A-F]{2})/g, function (match, p1) {
            return String.fromCharCode(parseInt(p1, 16));
        }));

        // Return the formatted string
        pdf_params = "key=" + base64String;

        let __url = href.split('#');
        __url = encodeURIComponent(__url[0]);

        if (viewerStyle === 'flip-book') {
            return `${__url}&${pdf_params}`;
        }

        return `${__url}#${pdf_params}`;
    }

    // Generate viewer URLs (using global embedpressGutenbergData if available)
    const url = '//view.officeapps.live.com/op/embed.aspx?src=' + getParamData(href);
    let pdf_viewer_src = '';

    if (typeof embedpressGutenbergData !== 'undefined' && embedpressGutenbergData.pdfRenderer) {
        pdf_viewer_src = embedpressGutenbergData.pdfRenderer +
            ((embedpressGutenbergData.pdfRenderer.indexOf('?') === -1) ? '?' : '&') +
            'scrolling=' + scrolling + '&selection_tool=' + selection_tool + '&spreads=' + spreads + '&file=' + getParamData(href);
    }

    if (viewerStyle === 'flip-book' && typeof embedpressGutenbergData !== 'undefined' && embedpressGutenbergData.flipbookRenderer) {
        pdf_viewer_src = embedpressGutenbergData.flipbookRenderer +
            ((embedpressGutenbergData.flipbookRenderer.indexOf('?') === -1) ? '?' : '&') +
            'file=' + getParamData(href);
    }

    const customLogoTemp = applyFilters('embedpress.customLogoComponent', '', attributes);

    // Generate client ID hash for content protection
    const _md5ClientId = md5(clientId || '');

    // Lightbox mode: show thumbnail instead of inline viewer
    if (displayMode === 'lightbox' && mime === 'application/pdf') {
        // Get base64 viewer params for the lightbox data attribute
        const _pdf_params_obj = {
            themeMode: themeMode || 'default',
            ...(themeMode === 'custom' ? { customColor: customColor || '#403A81' } : {}),
            presentation: presentation || false,
            lazyLoad: lazyLoad || false,
            position: position || 'top',
            flipbook_toolbar_position: flipbook_toolbar_position || 'bottom',
            download: download || false,
            toolbar: toolbar || false,
            copy_text: copy_text || false,
            add_text: add_text || false,
            draw: draw || false,
            doc_details: doc_details || false,
            doc_rotation: doc_rotation || false,
            add_image: add_image || false,
            zoom_in: zoomIn || false,
            zoom_out: zoomOut || false,
            fit_view: fitView || false,
            bookmark: bookmark || false,
            selection_tool: selection_tool || '0',
            scrolling: scrolling || '-1',
            spreads: spreads || '0',
            watermark_text: watermarkText || '',
            watermark_font_size: watermarkFontSize || '48',
            watermark_color: watermarkColor || '#000000',
            watermark_opacity: watermarkOpacity || '15',
            watermark_style: watermarkStyle || 'center',
        };
        const _qs = new URLSearchParams(_pdf_params_obj).toString();
        const _b64 = btoa(encodeURIComponent(_qs).replace(/%([0-9A-F]{2})/g, function (m, p1) {
            return String.fromCharCode(parseInt(p1, 16));
        }));

        const alignStyle = {};
        if (lightboxAlign === 'center') {
            alignStyle.textAlign = 'center';
        } else if (lightboxAlign === 'right') {
            alignStyle.textAlign = 'right';
        }

        const pdfTitle = fileName || href.split('/').pop().replace('.pdf', '') || 'PDF';

        return (
            <div {...blockProps}>
                <div id={`ep-gutenberg-content-${_md5ClientId}`} className="ep-gutenberg-content">
                    <div className={'embedpress-document-embed ep-doc-' + id + ' ' + width_class}
                         style={{ maxWidth: width + unitoption, ...alignStyle }}
                         id={`ep-doc-${clientId}`}
                         data-source-id={'source-' + clientId}
                         data-embed-type="PDF">
                        <div className="ep-pdf-thumbnail-card">
                            <div className="ep-pdf-thumbnail-wrap"
                                 data-pdf-url={href}
                                 data-viewer-style={viewerStyle}
                                 data-viewer-params={_b64}
                                 data-custom-thumbnail={lightboxThumbnail || ''}>
                                <div className="ep-pdf-thumbnail-inner">
                                    {lightboxThumbnail ? (
                                        <img className="ep-pdf-thumbnail-custom" src={lightboxThumbnail} alt={pdfTitle} />
                                    ) : (
                                        <canvas className="ep-pdf-thumbnail-canvas"
                                                data-pdf-url={href}
                                                data-loading="true"></canvas>
                                    )}
                                    <div className="ep-pdf-thumbnail-overlay">
                                        <div className="ep-pdf-thumbnail-icon-circle">
                                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8 5v14l11-7z"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="ep-pdf-thumbnail-title">{pdfTitle}</div>
                        </div>
                        {powered_by && <p className="embedpress-el-powered">Powered By EmbedPress</p>}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div {...blockProps}>
            <div id={`ep-gutenberg-content-${_md5ClientId}`} className="ep-gutenberg-content">
                <div className={'embedpress-document-embed ep-doc-' + id + ' ' + content_share_class + ' ' + share_position_class + ' ' + width_class} style={{ width: width + unitoption, height: height + 'px', maxWidth: '100%' }} id={`ep-doc-${clientId}`} data-source-id={'source-' + clientId} data-embed-type="PDF">
                    <div className="ep-embed-content-wraper">
                        <div className={`position-${sharePosition}-wraper gutenberg-pdf-wraper`}>
                        <div className='main-content-wraper'>
                            {mime === 'application/pdf' && pdf_viewer_src && (
                                <iframe
                                    title={getIframeTitle(href, fileName)}
                                    powered_by={powered_by}
                                    style={{ height: height + 'px', width: width + unitoption, maxWidth: '100%' }}
                                    className={'embedpress-embed-document-pdf' + ' ' + id}
                                    data-emid={id}
                                    data-viewer-style={viewerStyle}
                                    src={sanitizeUrl(pdf_viewer_src)}
                                />
                            )}

                            {mime !== 'application/pdf' && (
                                <iframe
                                    title={getIframeTitle(url, fileName)}
                                    style={{ height: height + 'px', width: width + unitoption, maxWidth: '100%' }}
                                    src={sanitizeUrl(url)}
                                />
                            )}

                            {contentShare && <SocialShareHtml attributes={attributes} />}
                        </div>

                        {customLogoTemp && (
                            <div className="custom-logo-container" dangerouslySetInnerHTML={{ __html: customLogoTemp }} />
                        )}

                        {powered_by && <p className="embedpress-el-powered">Powered By EmbedPress</p>}
                    </div>


                    {adManager && (adSource === 'image') && adFileUrl && (
                        <AdTemplate
                            attributes={attributes}
                            deleteIcon={false}
                            progressBar={false}
                            inEditor={false}
                        />
                    )}

                    </div>
                </div>


            </div>
        </div>
    );
};

export default Save;
