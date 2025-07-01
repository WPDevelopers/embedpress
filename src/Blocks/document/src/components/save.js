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

/**
 * Save component for EmbedPress Document block
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
        docViewer,
        themeMode,
        customColor,
        presentation,
        position,
        download,
        draw,
        toolbar,
        doc_rotation,
        clientId,
        sharePosition,
        contentShare,
        adManager,
        adSource,
        adFileUrl,
        adXPosition,
        adYPosition,
        customlogo
    } = attributes;

    if (!href) {
        return null;
    }

    let width_class = '';
    if (unitoption == '%') {
        width_class = 'ep-percentage-width';
    }
    else {
        width_class = 'ep-fixed-width';
    }

    let content_share_class = '';
    if (contentShare) {
        content_share_class = 'ep-content-share-enabled';
    }

    let share_position_class = '';
    if (sharePosition) {
        share_position_class = 'ep-share-position-' + sharePosition;
    }

    const urlParamsObject = {
        theme_mode: themeMode,
        ...(themeMode === 'custom' && { custom_color: customColor ? customColor : '#343434' }),
        presentation: presentation ? presentation : true,
        position: position ? position : 'bottom',
        download: download ? download : true,
        draw: draw ? draw : true,
    }
    const urlParams = new URLSearchParams(urlParamsObject);
    const queryString = urlParams.toString();

    let isDownloadEnabled = ' enabled-file-download';
    if (!download) {
        isDownloadEnabled = '';
    }

    let iframeSrc = '//view.officeapps.live.com/op/embed.aspx?src=' + href;

    if (docViewer === 'google') {
        iframeSrc = '//docs.google.com/gview?embedded=true&url=' + href;
    }


    // Custom logo component
    const customLogoTemp = applyFilters('embedpress.customLogoComponent', '', attributes);

    return (
        <div {...blockProps}>
            <div className={'embedpress-document-embed ep-doc-' + id + ' ' + content_share_class + ' ' + share_position_class + ' ' + width_class} style={{ width: width + unitoption, maxWidth: '100%' }} id={`ep-doc-${attributes.clientId || clientId}`} data-source-id={'source-' + (attributes.clientId || clientId)} >
                <div className="ep-embed-content-wraper">
                    {mime === 'application/pdf' && (
                        <div
                            style={{
                                height: height,
                                width: width
                            }}
                            className={'embedpress-embed-document-pdf' + ' ' + id}
                            data-emid={id}
                            data-emsrc={href}>

                            {
                                 customLogoTemp && (
                                    <div
                                        className="custom-logo-container"
                                        dangerouslySetInnerHTML={{
                                            __html: customLogoTemp + '',
                                        }}
                                    ></div>
                                )
                            }
                        </div>
                    )}

                    {mime !== 'application/pdf' && (
                        <div className={`${docViewer === 'custom' ? 'ep-file-download-option-masked ' : ''}ep-gutenberg-file-doc ep-powered-by-enabled ${isDownloadEnabled}`} data-theme-mode={themeMode} data-custom-color={customColor} data-id={id}>
                            <iframe
                                style={{
                                    height: height,
                                    width: width
                                }}
                                src={iframeSrc}
                                mozallowfullscreen="true"
                                webkitallowfullscreen="true" />
                            {
                                draw && docViewer === 'custom' && (
                                    <canvas class="ep-doc-canvas" width={width} height={height} ></canvas>
                                )
                            }

                            {
                                toolbar && docViewer === 'custom' && (
                                    <div class="ep-external-doc-icons ">
                                        {
                                            !isFileUrl(href) && (
                                                epGetPopupIcon()
                                            )
                                        }
                                        {(download && isFileUrl(href)) && (epGetPrintIcon())}
                                        {(download && isFileUrl(href)) && (epGetDownloadIcon())}
                                        {draw && (epGetDrawIcon())}
                                        {presentation && (epGetFullscreenIcon())}
                                        {presentation && (epGetMinimizeIcon())}
                                    </div>
                                )
                            }


                            {
                                 customLogoTemp && (
                                    <div
                                        className="custom-logo-container"
                                        dangerouslySetInnerHTML={{
                                            __html: customLogoTemp + '',
                                        }}
                                    ></div>
                                )
                            }
                        </div>
                    )}


                    {powered_by && (
                        <p className="embedpress-el-powered">Powered By EmbedPress</p>
                    )}

                    <Logo id={id} />
                </div>

                {
                    contentShare &&
                    <SocialShareHtml attributes={attributes} />
                }

            </div>
            {
                adManager && (adSource === 'image') && adFileUrl && (
                    <AdTemplate attributes={attributes} deleteIcon={false} progressBar={false} inEditor={false} />
                )
            }

        </div>
    );
};

export default Save;
