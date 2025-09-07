/**
 * WordPress dependencies
 */
const { Fragment } = wp.element;

/**
 * Internal dependencies
 */
import {
    isYTChannel,
    isYTVideo,
    isYTLive,
    isVimeoVideo,
    isWistiaVideo,
    isOpensea,
    isOpenseaSingle,
    isInstagramFeed
} from "./helper";
import md5 from "md5";

/**
 * Dynamic Styles Component
 * 
 * Generates dynamic CSS styles based on block attributes
 */
export default function DynamicStyles({ attributes }) {
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
        limit,
        // Custom player attributes  
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

    const _md5ClientId = md5(clientId || '');

    // Player control visibility
    const _playerPip = playerPip ? 'block' : 'none';
    const _playerRestart = playerRestart ? 'block' : 'none';
    const _playerRewind = playerRewind ? 'block' : 'none';
    const _playerFastForward = playerFastForward ? 'block' : 'none';
    const _fullscreen = fullscreen ? 'block' : 'none';
    const _download = playerDownload ? 'block' : 'none';

    // Grid layout for YouTube channels
    let repeatCol = `repeat(auto-fit, minmax(250px, 1fr))`;
    if (columns > 0) {
        repeatCol = `repeat(auto-fit, minmax(calc(${100 / columns}% - ${gapbetweenvideos}px), 1fr))`;
    }

    // Pagination visibility
    let _ispagination = 'flex';
    if (!ispagination) {
        _ispagination = 'none';
    }

    // Custom logo visibility
    let _iscustomlogo = '';
    if (customlogo) {
        _iscustomlogo = `
            [data-source-id="source-${clientId}"] img.watermark.ep-custom-logo {
                display: block !important;
            }
        `;
    }

    // Carousel buttons visibility
    let carouselBtns = 'none';
    if (instaLayout === 'insta-carousel') {
        carouselBtns = 'block';
    }

    return (
        <Fragment>
            {/* YouTube Channel Styles */}
            {isYTChannel(url) && (
                <style>
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

            {/* General Embed Styles */}
            {!isYTChannel(url) && !isOpensea(url) && !isOpenseaSingle(url) && (
                <style>
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
                    [data-source-id="source-${clientId}"] .ose-embedpress-responsive.ose-google-photos{
                        height: 100% !important;
                        max-height: 100% !important;
                    }

                    [data-source-id="source-${clientId}"] .embera-embed-responsive-provider-gettyimages,
                    [data-source-id="source-${clientId}"] .embera-embed-responsive-provider-gettyimages iframe,
                    [data-source-id="source-${clientId}"] .getty{
                        width: ${width}px!important;
                        height: ${height}px!important;
                        max-height: ${height}px!important;
                        max-width: 100%!important;
                    }
                    `}
                </style>
            )}

            {/* OpenSea Collection Styles */}
            {isOpensea(url) && (
                <style>
                    {`
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
                    `}
                </style>
            )}

            {/* Wistia Video Styles */}
            {isWistiaVideo(url) && (
                <style>
                    {`
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
                    `}
                </style>
            )}

            {/* Video Watermark Styles */}
            {(isYTVideo(url) || isVimeoVideo(url) || isYTLive(url)) && (
                <style>
                    {`
                    [data-source-id="source-${clientId}"] img.watermark{
                        display: none;
                    }
                    ${_iscustomlogo}
                    `}
                </style>
            )}

            {/* Responsive Video Styles */}
            {((videosize === 'responsive') && (isYTVideo(url) || isYTLive(url))) && (
                <style>
                    {`
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
                    `}
                </style>
            )}

            {/* Custom Player Styles */}
            {customPlayer && (
                <style>
                    {`
                    [data-source-id="source-${clientId}"] {
                        --plyr-color-main: ${playerColor && playerColor.length === 7
                            ? `rgba(${parseInt(playerColor.slice(1, 3), 16)}, ${parseInt(playerColor.slice(3, 5), 16)}, ${parseInt(playerColor.slice(5, 7), 16)}, .8)`
                            : 'rgba(0, 0, 0, .8)'
                        };
                    }
                    [data-source-id="source-${clientId}"] .custom-player-preset-1, 
                    [data-source-id="source-${clientId}"] .custom-player-preset-3, 
                    [data-source-id="source-${clientId}"] .custom-player-preset-4{
                        --plyr-color-main: ${playerColor && playerColor.length === 7
                            ? `rgb(${parseInt(playerColor.slice(1, 3), 16)}, ${parseInt(playerColor.slice(3, 5), 16)}, ${parseInt(playerColor.slice(5, 7), 16)})`
                            : 'rgba(0, 0, 0, .8)'
                        };
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
                            ? `[data-playerid="${_md5ClientId}"] .plyr--paused .plyr__poster {
                            background-image: url("${posterThumbnail}")!important;
                            opacity: 1!important;
                        }`: ``}
                    `}
                </style>
            )}

            {/* Instagram Carousel Styles */}
            {isInstagramFeed(url) && (
                <style>
                    {`
                    [data-carouselid="${clientId}"] .cg-carousel__btns{
                        display: ${carouselBtns};
                    }
                    `}
                </style>
            )}
        </Fragment>
    );
}
