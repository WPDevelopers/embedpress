import Youtube from './InspectorControl/youtube';
import OpenSea from './InspectorControl/OpenSea';

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


export default function Inspector({ attributes, setAttributes, isYTChannel, isOpensea }) {

    const {
        width,
        height,
        
        editingURL,
    } = attributes;

    return (
        !editingURL && (
            <InspectorControls>
                {
                    !isOpensea && (
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

                            {
                                isYTChannel && (
                                    <Youtube attributes={attributes} setAttributes={setAttributes} />
                                )
                            }
                        </PanelBody>

                    )
                }

                {
                    isOpensea && (
                        <OpenSea attributes={attributes} setAttributes={setAttributes} />
                    )
                }

            </InspectorControls>
        )
    )
}