import Youtube from './InspectorControl/youtube';
import OpenSea from './InspectorControl/OpenSea';
import ControlHeader from '../common/control-heading';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const {
    TextControl,
    PanelBody,
    ColorPicker,
    ColorPalette,
    FontSizePicker,
    ColorIndicator
} = wp.components;

const {
    InspectorControls
} = wp.blockEditor;


export default function Inspector({ attributes, setAttributes, isYTChannel, isOpensea }) {

    const {
        width,
        height,
        titleColor,
        titleFontsize,
        creatorColor,
        creatorFontsize,
        creatorLinkColor,
        creatorLinkFontsize,
        priceColor,
        priceFontsize,
        lastSaleColor,
        lastSaleFontsize,
        buttonTextColor,
        buttonBackgroundColor,
    } = attributes;

    const fontSizes = [
        {
            name: __('Small'),
            slug: 'small',
            size: 12,
        },
        {
            name: __('Big'),
            slug: 'big',
            size: 26,
        },
    ];

    const colors = [
        { name: 'red', color: '#f00' },
        { name: 'white', color: '#fff' },
        { name: 'blue', color: '#00f' },
    ];

    const fallbackFontSize = 16;

    return (
        <InspectorControls>
            <PanelBody title={__("Customize Embedded Link")}>
                <p>{__("You can adjust the width and height of embedded content.")}</p>
                <TextControl
                    label={__("Width")}
                    value={width}
                    onChange={(width) => setAttributes({ width })}
                />

                {
                    !isOpensea && (
                        <TextControl
                            label={__("Height")}
                            value={height}
                            onChange={(height) => setAttributes({ height })}
                        />
                    )

                }

                {
                    isYTChannel && (
                        <Youtube attributes={attributes} setAttributes={setAttributes} />
                    )
                }

                {
                    isOpensea && (
                        <OpenSea attributes={attributes} setAttributes={setAttributes} />
                    )
                }


            </PanelBody>

            {
                isOpensea && (
                    <PanelBody title={__("Color and Typography")} initialOpen={false}>
                        <p>{__("You can adjust the color and typography of embedded content.")}</p>


                        <ControlHeader headerText={'Title Color'} />
                        <ColorPalette
                            label={__("Title Color")}
                            colors={colors}
                            value={titleColor}
                            onChange={(titleColor) => setAttributes({ titleColor })}
                        />

                        <ControlHeader headerText={'Title FontSize'} />
                        <FontSizePicker
                            __nextHasNoMarginBottom
                            fontSizes={fontSizes}
                            value={titleFontsize}
                            fallbackFontSize={fallbackFontSize}
                            onChange={(titleFontsize) => setAttributes({ titleFontsize })}
                        />

                        <ColorIndicator colorValue="#0073aa" />

                    </PanelBody>
                )
            }

        </InspectorControls>
    )
}