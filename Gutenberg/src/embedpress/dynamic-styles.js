import react from 'react';
import { isOpensea, DynamicStyleOpensea } from "./InspectorControl/opensea";
import { isYTChannel, DynamicStyleYTChannel } from "./InspectorControl/youtube";

export const dynamicStyles = ({
    url,
    clientId,
    width,
    height,
    ispagination,
    gapbetweenvideos,
    columns,
    ...attributes
}) => {
    
	const isWistiaVideo = url.match(/\/medias\/|(?:https?:\/\/)?(?:www\.)?(?:wistia.com\/)(\w+)[^?\/]*$/i);

    let repeatCol = `repeat(auto-fit, minmax(250px, 1fr))`;
    if (columns > 0) {
        repeatCol = `repeat(auto-fit, minmax(calc(${100 / columns}% - ${gapbetweenvideos}px), 1fr))`;
    }

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
                        display: flex!important;
                    }

                    ${!ispagination &&
                        `#block-${clientId} .ep-youtube__content__block .ep-youtube__content__pagination{
                            display: none!important;
                        }`
                        }

                    `}
                </style>
            )}

            {
                !isYTChannel(url) && !isOpensea(url) && (
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
                )}

            {/* we can also use filters instead. */}

            {
                isOpensea(url) &&
                <DynamicStyleOpensea {...attributes} />
            }

            {
                isYTChannel(url) &&
                <DynamicStyleYTChannel {...attributes} />
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
							`
						}

					</style>
				)
			}

        </React.Fragment>
    );
};

export default dynamicStyles;