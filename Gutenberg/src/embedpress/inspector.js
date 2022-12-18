import Youtube from './InspectorControl/youtube';
import OpenSea from './InspectorControl/opensea';
import Wistia from './InspectorControl/wistia';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const {
    TextControl,
    PanelBody,
} = wp.components;

const {
    InspectorControls
} = wp.blockEditor;


export default function Inspector({ attributes, setAttributes, isYTChannel, isYTVideo, isOpensea, isOpenseaSingle, isWistiaVideo }) {

    const {
        width,
        height,

        editingURL,
        embedHTML,
    } = attributes;

    return (
        !editingURL && embedHTML && (
            <InspectorControls>
                {
                    !isOpensea && !isOpenseaSingle && (
                        <frameElement>
                            <PanelBody title={__("Embeded Options")}>

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
                                <Youtube attributes={attributes} setAttributes={setAttributes} isYTChannel={isYTChannel} />
                            </PanelBody>

                            <Youtube attributes={attributes} setAttributes={setAttributes} isYTVideo={isYTVideo} />
                            <Wistia attributes={attributes} setAttributes={setAttributes} isWistiaVideo={isWistiaVideo} />


                        </frameElement>
                    )
                }

                <OpenSea attributes={attributes} setAttributes={setAttributes} isOpensea={isOpensea} isOpenseaSingle={isOpenseaSingle} />

            </InspectorControls>
        )
    )
}