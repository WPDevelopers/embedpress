import react from 'react';
import { isOpensea, isOpenseaSingle } from "./InspectorControl/opensea";
import { isYTChannel, isYTVideo, isYTLive } from "./InspectorControl/youtube";
import { isVimeoVideo } from "./InspectorControl/vimeo";
import { isInstagramFeed } from '../common/helper';
import md5 from 'md5';
import { isGoogleDocsUrl } from './functions';

export const dynamicStyles = ({ attributes }) => {

    const {
        url,
        clientId,
        width,
        height,
        videosize,
        ispagination,
        gapbetweenvideos,
        ytChannelLayout,
        columns,
        customlogo,
        loadmore,
        itemperpage,
        loadmorelabel,
        limit,
        //custom players attribute  
        customPlayer,
        fullscreen,
        posterThumbnail,
        playerPreset,
        playerColor,
        playerPip,
        playerRestart,
        playerRewind,
        playerFastForward,
        playerDownload,

        instaLayout
    } = attributes;

    const { h1FontSize, h1LineHeight, h1LetterSpacing, h1FontFamily, h1FontWeight, h1TextTransform, h1Color, h2FontSize, h2LineHeight, h2LetterSpacing, h2FontFamily, h2FontWeight, h2TextTransform, h2Color, h3FontSize, h3LineHeight, h3LetterSpacing, h3FontFamily, h3FontWeight, h3TextTransform, h3Color, h4FontSize, h4LineHeight, h4LetterSpacing, h4FontFamily, h4FontWeight, h4TextTransform, h4Color, h5FontSize, h5LineHeight, h5LetterSpacing, h5FontFamily, h5FontWeight, h5TextTransform, h5Color, h6FontSize, h6LineHeight, h6LetterSpacing, h6FontFamily, h6FontWeight, h6TextTransform, h6Color, pFontSize, pLineHeight, pLetterSpacing, pFontFamily, pFontWeight, pTextTransform, pColor } = attributes;


    const _md5ClientId = md5(clientId || '');


    // const _posterThumbnail = posterThumbnail ? 'block' : 'none';
    // const _playerPreset = playerPreset ? 'block' : 'none';
    // const _playerColor = playerColor ? 'block' : 'none';

    const _playerPip = playerPip ? 'block' : 'none';
    const _playerRestart = playerRestart ? 'block' : 'none';
    const _playerRewind = playerRewind ? 'block' : 'none';
    const _playerFastForward = playerFastForward ? 'block' : 'none';
    const _fullscreen = fullscreen ? 'block' : 'none';
    const _download = playerDownload ? 'block' : 'none';

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
            [data-source-id="source-${clientId}"] img.watermark.ep-custom-logo {
                display: block !important;
            }
        `;
    }

    let carouselBtns = 'none';
    if (instaLayout === 'insta-carousel') {
        carouselBtns = 'block';
    }

    let wehnResponsive = '';


    return (
        <React.Fragment>
            {isYTChannel(url) && (


                <style style={{ display: "none" }}>
                    {`
                    [data-source-id="source-${clientId}"] .ep-youtube__content__block .youtube__content__body .content__wrap:not(.youtube-carousel){
                        gap: ${gapbetweenvideos}px!important;
                        margin-top: ${gapbetweenvideos}px!important;
                        display: grid!important;
                        grid-template-columns: ${repeatCol}!important;
                    }

                    [data-source-id="source-${clientId}"] .ose-youtube{
                        width: ${width}px!important;
                    }
                    [data-source-id="source-${clientId}"] .ose-youtube .ep-first-video iframe{
                        max-height: ${height}px!important;
                    }

                    [data-source-id="source-${clientId}"] .ose-youtube > iframe{
                        height: ${height}px!important;
                        width: ${width}px!important;
                    }

                    [data-source-id="source-${clientId}"] .ep-youtube__content__block .ep-youtube__content__pagination{
                        display: ${_ispagination}!important;
                    }
                    [data-source-id="source-${clientId}"] img.watermark{
                        display: none;
                    }

                    [data-source-id="source-${clientId}"] .layout-list .ep-youtube__content__block .youtube__content__body .content__wrap{
                        grid-template-columns: repeat(auto-fit, minmax(calc(100% - 30px), 1fr))!important;
                    }
                    ${_iscustomlogo}
                    `}
                </style>
            )}



            {
                !isYTChannel(url) && !isOpensea(url) && !isOpenseaSingle(url) && (
                    <style style={{ display: "none" }}>
                        {`
                    [data-source-id="source-${clientId}"] .ose-embedpress-responsive{
                        width: ${width}px!important;
                        height: ${height}px!important;
                        max-height: ${height}px!important;
                    }
                    [data-source-id="source-${clientId}"] iframe{
                        width: ${width}px!important;
                        height: ${height}px!important;
                        max-height: ${height}px!important;

                    }
                    [data-source-id="source-${clientId}"] .embedpress-yt-subscribe iframe{
                        height: 100%!important;
                    }
                    [data-source-id="source-${clientId}"] .ose-youtube > iframe{
                        height: ${height}px!important;
                        width: ${width}px!important;
                    }
                    [data-source-id="source-${clientId}"] .ose-youtube{
                        height: ${height}px!important;
                        width: ${width}px!important;
                    }
                    [data-source-id="source-${clientId}"] .ose-giphy img{
                        height: ${height}px!important;
                        width: ${width}px!important;
                    }
                    [data-source-id="source-${clientId}"] .ose-google-docs img{
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
                                [data-source-id="source-${clientId}"]{
                                    width: 900px;
                                    max-width: 100%!important;
                                }
                
                                [data-source-id="source-${clientId}"] .ose-opensea {
                                    width: calc(100% - 40px)!important;
                                    height: 100%!important;
                                }
                                [data-source-id="source-${clientId}"] .ose-opensea .ep_nft_item{
                                    display: none!important;
                                }
                                [data-source-id="source-${clientId}"] .ose-opensea .ep_nft_item:nth-of-type(-n+${loadmore ? itemperpage : limit}) {
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
								[data-source-id="source-${clientId}"] .ose-wistia{
									width: ${width}px!important;
									height: ${height}px!important;
								}
								.wistia_embed{
									width: 100%!important;
									height: 100%!important;
								}
                                [data-source-id="source-${clientId}"] img.watermark{
                                    display: none;
                                }
                                ${_iscustomlogo}
							`
                        }

                    </style>
                )
            }
            {
                (isYTVideo(url) || isVimeoVideo(url) || isYTLive(url)) && (
                    <style style={{ display: "none" }}>
                        {
                            `
                            [data-source-id="source-${clientId}"] img.watermark{
                                display: none;
                            }
                                ${_iscustomlogo}
							`
                        }
                    </style>
                )
            }

            {
                ((videosize === 'responsive') && (isYTVideo(url) || isYTLive(url))) && (
                    <style style={{ display: "none" }}>
                        {
                            `
                                [data-source-id="source-${clientId}"] .ose-youtube {
                                    width: ${width}px!important;
                                    position: relative;
                                    padding: 0;
                                    padding-top: 56.5%;
                                    height: 100%!important;
                                }
                                
                                [data-source-id="source-${clientId}"] .ose-youtube iframe {
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

            {
                customPlayer && (
                    <style style={{ display: "none" }}>
                        {`
                            [data-source-id="source-${clientId}"] {
                            --plyr-color-main: ${playerColor && playerColor.length === 7
                                ? `rgba(${parseInt(playerColor.slice(1, 3), 16)}, ${parseInt(playerColor.slice(3, 5), 16)}, ${parseInt(playerColor.slice(5, 7), 16)}, .8)`
                                : 'rgba(0, 0, 0, .8)'
                            }; /* Transparent with dynamic color */
                            }
                            [data-source-id="source-${clientId}"] .custom-player-preset-1, [data-source-id="source-${clientId}"] .custom-player-preset-3, [data-source-id="source-${clientId}"] .custom-player-preset-4{
                            --plyr-color-main: ${playerColor && playerColor.length === 7
                                ? `rgb(${parseInt(playerColor.slice(1, 3), 16)}, ${parseInt(playerColor.slice(3, 5), 16)}, ${parseInt(playerColor.slice(5, 7), 16)})`

                                : 'rgba(0, 0, 0, .8)'

                            }; /* Transparent with dynamic color */
                            --plyr-range-fill-background: #fff;

                            }
                        
                            [data-source-id="source-${clientId}"] [data-plyr="restart"] {
                            display: ${_playerRestart}!important;
                            }
                            [data-source-id="source-${clientId}"] [data-plyr="rewind"] {
                            display: ${_playerRewind}!important;
                            }
                            [data-source-id="source-${clientId}"] [data-plyr="fast-forward"] {
                            display: ${_playerFastForward}!important;
                            }
                            [data-source-id="source-${clientId}"] [data-plyr="pip"] {
                            display: ${_playerPip}!important;
                            }
                            [data-source-id="source-${clientId}"] [data-plyr="fullscreen"] {
                            display: ${_fullscreen}!important;
                            }
                            [data-source-id="source-${clientId}"] [data-plyr="download"] {
                            display: ${_download}!important;
                            }
                        
                            [data-playerid="${_md5ClientId}"] > .plyr {
                            width: ${width}px!important;
                            height: ${height}px!important;
                            max-height: ${height}px!important;
                            }

                            ${posterThumbnail && posterThumbnail.length >= 0
                                ? `[data-playerid="${_md5ClientId}"] .plyr__poster {
                                background-image: url("${posterThumbnail}")!important;
                                opacity: 1!important;
                            }`: ``}
                            
                        `}
                    </style>

                )
            }

            {
                isInstagramFeed(url) && (
                    <style style={{ display: "none" }}>
                        {`
                            [data-carouselid="${clientId}"] .cg-carousel__btns{
                                display: ${carouselBtns}
                            };
                            
                        `}
                    </style>
                )
            }
            {
                isGoogleDocsUrl(url) && (
                    <style style={{ display: "none" }}>
                        {`
                            [data-source-id="source-${clientId}"] .ose-google-docs h1 {
								font-size: ${h1FontSize}px;
								line-height: ${h1LineHeight};
								letter-spacing: ${h1LetterSpacing};
								font-family: ${h1FontFamily};
								font-weight: ${h1FontWeight};
								text-transform: ${h1TextTransform};
								color: ${h1Color};
							}

							[data-source-id="source-${clientId}"] .ose-google-docs h2 {
								font-size: ${h2FontSize}px;
								line-height: ${h2LineHeight};
								letter-spacing: ${h2LetterSpacing};
								font-family: ${h2FontFamily};
								font-weight: ${h2FontWeight};
								text-transform: ${h2TextTransform};
								color: ${h2Color};
							}

							[data-source-id="source-${clientId}"] .ose-google-docs h3 {
								font-size: ${h3FontSize}px;
								line-height: ${h3LineHeight};
								letter-spacing: ${h3LetterSpacing};
								font-family: ${h3FontFamily};
								font-weight: ${h3FontWeight};
								text-transform: ${h3TextTransform};
								color: ${h3Color};
							}

							[data-source-id="source-${clientId}"] .ose-google-docs h4 {
								font-size: ${h4FontSize}px;
								line-height: ${h4LineHeight};
								letter-spacing: ${h4LetterSpacing};
								font-family: ${h4FontFamily};
								font-weight: ${h4FontWeight};
								text-transform: ${h4TextTransform};
								color: ${h4Color};
							}

							[data-source-id="source-${clientId}"] .ose-google-docs h5 {
								font-size: ${h5FontSize}px;
								line-height: ${h5LineHeight};
								letter-spacing: ${h5LetterSpacing};
								font-family: ${h5FontFamily};
								font-weight: ${h5FontWeight};
								text-transform: ${h5TextTransform};
								color: ${h5Color};
							}

							[data-source-id="source-${clientId}"] .ose-google-docs h6 {
								font-size: ${h6FontSize}px;
								line-height: ${h6LineHeight};
								letter-spacing: ${h6LetterSpacing};
								font-family: ${h6FontFamily};
								font-weight: ${h6FontWeight};
								text-transform: ${h6TextTransform};
								color: ${h6Color};
                            }
							[data-source-id="source-${clientId}"] .ose-google-docs p {
								font-size: ${pFontSize}px!important;
								line-height: ${pLineHeight};
								letter-spacing: ${pLetterSpacing};
								font-family: ${pFontFamily};
								font-weight: ${pFontWeight};
								text-transform: ${pTextTransform};
								color: ${pColor};
							}
                            
                        `}
                    </style>
                )
            }

        </React.Fragment>
    );
};

export default dynamicStyles;