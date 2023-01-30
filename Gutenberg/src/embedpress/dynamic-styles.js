import react from 'react';
import { isOpensea, isOpenseaSingle } from "./InspectorControl/opensea";
import { isYTChannel, isYTVideo } from "./InspectorControl/youtube";
import { isVimeoVideo } from "./InspectorControl/vimeo";

export const dynamicStyles = ({
    url,
    clientId,
    width,
    height,
    videosize,
    ispagination,
    gapbetweenvideos,
    columns,
    customlogo,
    loadmore,
    itemperpage,
    limit,
    ...attributes
}) => {

    const isWistiaVideo = url.match(/\/medias\/|(?:https?:\/\/)?(?:www\.)?(?:wistia.com\/)(\w+)[^?\/]*$/i);

    let repeatCol = `repeat(auto-fit, minmax(250px, 1fr))`;
    if (columns > 0) {
        repeatCol = `repeat(auto-fit, minmax(calc(${100 / columns}% - ${gapbetweenvideos}px), 1fr))`;
    }

    let _ispagination = 'flex';

    !ispagination && (
        _ispagination = 'none'
    )

    let _iscustomlogo = '';

    if (customlogo) {
        _iscustomlogo = `
            #block-${clientId} img.watermark.ep-custom-logo {
                display: block !important;
            }
        `;
    }

    let wehnResponsive = '';

    return (
        <React.Fragment>

            {isYTChannel(url) && (
                <style style={{ display: "none" }}>
                    {`
                    #block-${clientId} .ep-youtube__content__block .youtube__content__body .content__wrap{
                        gap: ${gapbetweenvideos}px!important;
                        margin-top: ${gapbetweenvideos}px!important;
                    }

                    #block-${clientId} .ose-youtube{
                        width: ${width}px!important;
                    }
                    #block-${clientId} .ose-youtube .ep-first-video iframe{
                        max-height: ${height}px!important;
                    }

                    #block-${clientId} .ose-youtube > iframe{
                        height: ${height}px!important;
                        width: ${width}px!important;
                    }

                    #block-${clientId} .ep-youtube__content__block .youtube__content__body .content__wrap {
                        grid-template-columns: ${repeatCol};
                    }

                    #block-${clientId} .ep-youtube__content__block .ep-youtube__content__pagination{
                        display: ${_ispagination}!important;
                    }
                    #block-${clientId} img.watermark{
                        display: none;
                    }
                    ${_iscustomlogo}
                    `}
                </style>
            )}



            {
                !isYTChannel(url) && !isOpensea(url) && !isOpenseaSingle(url) && (
                    <style style={{ display: "none" }}>
                        {`
                    #block-${clientId} .ose-embedpress-responsive{
                        width: ${width}px!important;
                        height: ${height}px!important
                    }
                    #block-${clientId} iframe{
                        width: ${width}px!important;
                        height: ${height}px!important
                    }
                    #block-${clientId} .embedpress-yt-subscribe iframe{
                        height: 100%!important
                    }
                    #block-${clientId} .ose-youtube > iframe{
                        height: ${height}px!important;
                        width: ${width}px!important;
                    }
                    #block-${clientId} .ose-youtube{
                        height: ${height}px!important;
                        width: ${width}px!important;
                    }
                    
                `}
                    </style>
                )

            }

            {
                isOpensea(url) && (
                    <style style={{ display: "none" }}>
                        {
                            `
                                #block-${clientId}{
                                    width: 900px;
                                    max-width: 100%!important;
                                }
                
                                #block-${clientId} .ose-opensea {
                                    width: 100%!important;
                                    height: 100%!important;
                                }
                                #block-${clientId} .ose-opensea .ep_nft_item{
                                    display: none!important;
                                }
                                #block-${clientId} .ose-opensea .ep_nft_item:nth-of-type(-n+${loadmore?itemperpage:limit}) {
                                    display: block !important;
                                }

                            `
                        }

                    </style>
                )
            }

            {
                isWistiaVideo && (
                    <style style={{ display: "none" }}>
                        {
                            `
								#block-${clientId} .ose-wistia{
									width: ${width}px!important;
									height: ${height}px!important;
								}
								.wistia_embed{
									width: 100%!important;
									height: 100%!important;
								}
                                #block-${clientId} img.watermark{
                                    display: none;
                                }
                                ${_iscustomlogo}
							`
                        }

                    </style>
                )
            }
            {
                (isYTVideo(url) || isVimeoVideo(url)) && (
                    <style style={{ display: "none" }}>
                        {
                            `
                            #block-${clientId} img.watermark{
                                display: none;
                            }
                                ${_iscustomlogo}
							`
                        }
                    </style>
                )
            }

            {
                ((videosize === 'responsive') && (isYTVideo(url))) && (
                    <style style={{ display: "none" }}>
                        {
                            `
                                #block-${clientId} .ose-youtube {
                                    width: ${width}px!important;
                                    position: relative;
                                    padding: 0;
                                    padding-top: 56.5%;
                                    height: 100%!important;
                                }
                                
                                #block-${clientId} .ose-youtube iframe {
                                    position: absolute;
                                    top: 0;
                                    left: 0;
                                    width: 100%;
                                    height: 100%!important;
                                }
							`
                        }

                    </style>
                )
            }

        </React.Fragment>
    );
};

export default dynamicStyles;