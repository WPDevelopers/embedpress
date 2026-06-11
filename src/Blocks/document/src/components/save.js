/**
 * WordPress dependencies
 */
const { useBlockProps } = wp.blockEditor;

/**
 * Internal dependencies
 */
import { epGetPopupIcon, epGetDownloadIcon, epGetPrintIcon, epGetFullscreenIcon, epGetMinimizeIcon, epGetDrawIcon } from '../../../GlobalCoponents/icons';
import { isFileUrl, getIframeTitle } from '../../../GlobalCoponents/helper';
import Logo from "../../../GlobalCoponents/Logo";
import SocialShareHtml from '../../../GlobalCoponents/social-share-html';
import AdTemplate from '../../../GlobalCoponents/ads-template';
import md5 from "md5";
const { applyFilters } =  wp.hooks;
import PDFViewer from "./PDFViwer";
import FileViewer from "./FileViewer";
import DocStyle from "./doc-style";

import "../style.scss";


const Save = ({ attributes, setAttributes }) => {
    const blockProps = useBlockProps.save();

    const {
        href, mime, id, unitoption, width, height, powered_by, fileName,
        docViewer, themeMode, customColor, presentation = true, position = 'bottom',
        download = true, draw = true, toolbar, doc_rotation, clientId,
        sharePosition, contentShare, adManager, adSource, adFileUrl,
        adXPosition, adYPosition, customlogo,
        showViewCount = false, showDownloadCount = false, viewCountPosition = 'below'
    } = attributes;

    if (!href) return null;

    // Per-embed override for the engagement-stats badge. Emit an explicit marker
    // so the frontend (ep-view-count.js) lets a per-embed toggle win over the
    // global option: "on" -> show, "off" -> hide. Counters default off, so a new
    // embed emits "off" and only shows once the user enables the toggle.
    const statsAttrs = {
        'data-ep-views': showViewCount === true ? 'on' : 'off',
        'data-ep-downloads': showDownloadCount === true ? 'on' : 'off',
        // Only emit when non-default so pre-feature posts stay byte-identical.
        ...(viewCountPosition && viewCountPosition !== 'below'
            ? { 'data-ep-count-position': viewCountPosition }
            : {}),
    };

    // Classes
    const widthClass = unitoption === '%' ? 'ep-percentage-width' : 'ep-fixed-width';
    const contentShareClass = contentShare ? 'ep-content-share-enabled' : '';
    const sharePositionClass = sharePosition ? `ep-share-position-${sharePosition}` : '';
    const isDownloadEnabled = download ? 'enabled-file-download' : '';



    // Iframe Source
    let iframeSrc = `//view.officeapps.live.com/op/embed.aspx?src=${href}`;
    if (docViewer === 'google') {
        iframeSrc = `//docs.google.com/gview?embedded=true&url=${href}`;
    }

    // Viewer URL Params
    const urlParams = new URLSearchParams({
        theme_mode: themeMode,
        ...(themeMode === 'custom' && { custom_color: customColor || '#343434' }),
        presentation,
        position,
        download,
        draw
    }).toString();

    // Custom logo from filter
    const customLogoTemp = applyFilters('embedpress.customLogoComponent', '', attributes);

    const buildViewerUrl = () => {
        if (docViewer === 'google') return `//docs.google.com/gview?embedded=true&url=${href}`;
        return `//view.officeapps.live.com/op/embed.aspx?src=${href}`;
    };

    // Generate client ID hash for content protection
    const _md5ClientId = md5(clientId || '');



    return (
        <div {...blockProps}>
            <div id={`ep-gutenberg-content-${_md5ClientId}`} className="ep-gutenberg-content">
                <div className={`embedpress-document-embed ep-doc-${id}`} style={{ height, width }} data-embed-type="Document" {...statsAttrs}>

                    <div className="ep-embed-content-wraper">
                        <div className={`position-${sharePosition}-wraper gutenberg-doc-wraper`}>
                        <div className='main-content-wraper'>

                            {mime === 'application/pdf' ? (
                                <PDFViewer href={href} id={id} width={width} height={height} unitoption={unitoption} setFetching={false} title={getIframeTitle(href, fileName)} />
                            ) : (
                                <FileViewer
                                    href={href}
                                    url={buildViewerUrl()}
                                    docViewer={docViewer}
                                    width={width}
                                    height={height}
                                    themeMode={themeMode}
                                    customColor={customColor}
                                    id={id}
                                    download={download}
                                    draw={draw}
                                    toolbar={toolbar}
                                    presentation={presentation}
                                    setFetching={false}
                                    title={getIframeTitle(href, fileName)}
                                />
                            )}

                            {contentShare && <SocialShareHtml attributes={attributes} />}

                        </div>

                        {customLogoTemp && (
                            <div className="custom-logo-container" dangerouslySetInnerHTML={{ __html: customLogoTemp }} />
                        )}

                        {powered_by && <p className="embedpress-el-powered">Powered By EmbedPress</p>}

                        <DocStyle attributes={attributes} />
                    </div>

                    {
                        adManager && adSource === 'image' && adFileUrl && (
                            <AdTemplate attributes={attributes} setAttributes={setAttributes} deleteIcon progressBar inEditor />
                        )
                    }
                    </div>
                </div>
            </div>

        </div >
    );
};

export default Save;
