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
        buttonFontSize,
    } = attributes;

    const fontSizes = [
        {
            name: __('Small'),
            slug: 'small',
            size: 16,
        },
        {
            name: __('Medium'),
            slug: 'medium',
            size: 18,
        },
        {
            name: __('Big'),
            slug: 'big',
            size: 26,
        },
    ];

    const colors = [
        { name: '', color: 'red' },
        { name: '', color: 'green' },
        { name: '', color: 'blue' },
        { name: '', color: 'yellow' },
        { name: '', color: 'orange' },
    ];

    const fallbackFontSize = 16;

    return (
        <InspectorControls>
            <PanelBody title={__("Embeded Options")}>


                {
                    !isOpensea && (
                        <div>

                             <p>{__("You can adjust the width and height of embedded content.")}</p>
                            <TextControl
                                label={__("Width")}
                                value={width}
                                onChange={(width) => setAttributes({ width })}
                            />
                            <TextControl
                                label={__("Height")}
                                value={height}
                                onChange={(height) => setAttributes({ height })}
                            />
                        </div>
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

                        <InspectorControls>
                            <PanelBody title={__("Title")} initialOpen={false}>
                                <ControlHeader headerText={'Color'} />
                                <ColorPalette
                                    label={__("Color")}
                                    colors={colors}
                                    value={titleColor}
                                    onChange={(titleColor) => setAttributes({ titleColor })}
                                />

                                <ControlHeader headerText={'FontSize'} />
                                <FontSizePicker
                                    __nextHasNoMarginBottom
                                    fontSizes={fontSizes}
                                    value={titleFontsize}
                                    fallbackFontSize={fallbackFontSize}
                                    onChange={(titleFontsize) => setAttributes({ titleFontsize })}
                                />
                            </PanelBody>
                            <PanelBody title={__("Creator")} initialOpen={false}>
                                <ControlHeader headerText={'Color'} />
                                <ColorPalette
                                    label={__("Color")}
                                    colors={colors}
                                    value={creatorColor}
                                    onChange={(creatorColor) => setAttributes({ creatorColor })}
                                />

                                <ControlHeader headerText={'FontSize'} />
                                <FontSizePicker
                                    __nextHasNoMarginBottom
                                    fontSizes={fontSizes}
                                    value={creatorFontsize}
                                    fallbackFontSize={fallbackFontSize}
                                    onChange={(creatorFontsize) => setAttributes({ creatorFontsize })}
                                />

                                <ControlHeader headerText={'Link Color'} />
                                <ColorPalette
                                    label={__("Color")}
                                    colors={colors}
                                    value={creatorLinkColor}
                                    onChange={(creatorLinkColor) => setAttributes({ creatorLinkColor })}
                                />

                                <ControlHeader headerText={'Link FontSize'} />
                                <FontSizePicker
                                    __nextHasNoMarginBottom
                                    fontSizes={fontSizes}
                                    value={creatorLinkFontsize}
                                    fallbackFontSize={fallbackFontSize}
                                    onChange={(creatorLinkFontsize) => setAttributes({ creatorLinkFontsize })}
                                />
                            </PanelBody>
                            <PanelBody title={__("Current Price")} initialOpen={false}>
                                <ControlHeader headerText={'Color'} />
                                <ColorPalette
                                    label={__("Color")}
                                    colors={colors}
                                    value={priceColor}
                                    onChange={(priceColor) => setAttributes({ priceColor })}
                                />

                                <ControlHeader headerText={'FontSize'} />
                                <FontSizePicker
                                    __nextHasNoMarginBottom
                                    fontSizes={fontSizes}
                                    value={priceFontsize}
                                    fallbackFontSize={fallbackFontSize}
                                    onChange={(priceFontsize) => setAttributes({ priceFontsize })}
                                />
                            </PanelBody>
                            <PanelBody title={__("Last Sale Price")} initialOpen={false}>
                                <ControlHeader headerText={'Color'} />
                                <ColorPalette
                                    label={__("Color")}
                                    colors={colors}
                                    value={lastSaleColor}
                                    onChange={(lastSaleColor) => setAttributes({ lastSaleColor })}
                                />

                                <ControlHeader headerText={'FontSize'} />
                                <FontSizePicker
                                    __nextHasNoMarginBottom
                                    fontSizes={fontSizes}
                                    value={lastSaleFontsize}
                                    fallbackFontSize={fallbackFontSize}
                                    onChange={(lastSaleFontsize) => setAttributes({ lastSaleFontsize })}
                                />
                            </PanelBody>
                            <PanelBody title={__("Button")} initialOpen={false}>

                                <ControlHeader headerText={'Color'} />
                                <ColorPalette
                                    label={__("Color")}
                                    colors={colors}
                                    value={buttonTextColor}
                                    onChange={(buttonTextColor) => setAttributes({ buttonTextColor })}
                                />

                                <ControlHeader headerText={'Background Color'} />
                                <ColorPalette
                                    label={__("Color")}
                                    colors={colors}
                                    value={buttonBackgroundColor}
                                    onChange={(buttonBackgroundColor) => setAttributes({ buttonBackgroundColor })}
                                />

                                <ControlHeader headerText={'FontSize'} />
                                <FontSizePicker
                                    __nextHasNoMarginBottom
                                    fontSizes={fontSizes}
                                    value={buttonFontSize}
                                    fallbackFontSize={fallbackFontSize}
                                    onChange={(buttonFontSize) => setAttributes({ buttonFontSize })}
                                />
                            </PanelBody>
                        </InspectorControls>

                    </PanelBody>
                )
            }

        </InspectorControls>
    )
}