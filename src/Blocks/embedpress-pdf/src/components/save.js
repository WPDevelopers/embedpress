/**
 * Internal dependencies
 */
import SocialShareHtml from '../../../GlobalCoponents/social-share-html.js';
import Logo from '../../../GlobalCoponents/Logo.js';
import AdTemplate from '../../../GlobalCoponents/ads-template.js';
import { sanitizeUrl } from '../../../GlobalCoponents/helper.js';

/**
 * WordPress dependencies
 */
const { useBlockProps } = wp.blockEditor;
const { Fragment } = wp.element;

/**
 * Save component for EmbedPress PDF block
 * Renders the same content as the editor for consistent design
 */
const Save = ({ attributes }) => {
    const blockProps = useBlockProps.save();

    const {
        href,
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
        zoomIn,
        zoomOut,
        fitView,
        bookmark
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

    // Generate viewer URLs (using global embedpressObj if available)
    const url = '//view.officeapps.live.com/op/embed.aspx?src=' + getParamData(href);
    let pdf_viewer_src = '';

    if (typeof embedpressObj !== 'undefined' && embedpressObj.pdf_renderer) {
        pdf_viewer_src = embedpressObj.pdf_renderer +
            ((embedpressObj.pdf_renderer.indexOf('?') === -1) ? '?' : '&') +
            'scrolling=' + scrolling + '&selection_tool=' + selection_tool + '&spreads=' + spreads + '&file=' + getParamData(href);
    }

    if (viewerStyle === 'flip-book' && typeof embedpressObj !== 'undefined' && embedpressObj.EMBEDPRESS_URL_ASSETS) {
        pdf_viewer_src = embedpressObj.EMBEDPRESS_URL_ASSETS + 'pdf-flip-book/viewer.html?file=' + getParamData(href);
    }

    return (
        <div {...blockProps}>
            <div className={'embedpress-document-embed ep-doc-' + id + ' ' + content_share_class + ' ' + share_position_class + ' ' + width_class} style={{ width: width + unitoption, maxWidth: '100%' }} id={`ep-doc-${clientId}`} data-source-id={'source-' + clientId}>
                <div className="gutenberg-wraper">
                    <div className={`position-${sharePosition}-wraper gutenberg-pdf-wraper`}>
                        {mime === 'application/pdf' && pdf_viewer_src && (
                            <iframe
                                title=""
                                powered_by={powered_by}
                                style={{ height: height, width: '100%' }}
                                className={'embedpress-embed-document-pdf' + ' ' + id}
                                data-emid={id}
                                src={sanitizeUrl(pdf_viewer_src)}
                            />
                        )}

                        {mime !== 'application/pdf' && (
                            <iframe
                                title=""
                                style={{ height: height, width: '100%' }}
                                src={sanitizeUrl(url)}
                            />
                        )}

                        {powered_by && (
                            <p className="embedpress-el-powered">Powered By EmbedPress</p>
                        )}

                        <Logo id={id} />
                    </div>

                    {contentShare && <SocialShareHtml attributes={attributes} />}
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
    );
};

export default Save;
