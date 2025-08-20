/**
 * WordPress dependencies
 */
import { useBlockProps } from "@wordpress/block-editor";

/**
 * Internal dependencies
 */
import { epGetPopupIcon, epGetDownloadIcon, epGetPrintIcon, epGetFullscreenIcon, epGetMinimizeIcon, epGetDrawIcon } from '../../../GlobalCoponents/icons';
import { isFileUrl } from '../../../GlobalCoponents/helper';
import Logo from "../../../GlobalCoponents/Logo";
import SocialShareHtml from '../../../GlobalCoponents/social-share-html';
import AdTemplate from '../../../GlobalCoponents/ads-template';
import { applyFilters } from "@wordpress/hooks";
import PDFViewer from "./PDFViwer";
import FileViewer from "./FileViewer";
import DocStyle from "./doc-style";

import "../style.scss";


const Save = ({ attributes, setAttributes }) => {
    const blockProps = useBlockProps.save();

    const {
        href, mime, id, unitoption, width, height, powered_by,
        docViewer, themeMode, customColor, presentation = true, position = 'bottom',
        download = true, draw = true, toolbar, doc_rotation, clientId,
        sharePosition, contentShare, adManager, adSource, adFileUrl,
        adXPosition, adYPosition, customlogo
    } = attributes;

    if (!href) return null;

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


    

    return (
        <div {...blockProps}>

            <div className={`embedpress-document-embed ep-doc-${id}`} style={{ height, width }} data-embed-type="Document">

                <div className="ep-embed-content-wraper">
                    <div className={`position-${sharePosition}-wraper gutenberg-doc-wraper`}>
                        <div className='main-content-wraper'>

                            {mime === 'application/pdf' ? (
                                <PDFViewer href={href} id={id} width={width} height={height} setFetching={false} />
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

        </div >
    );
};

export default Save;
