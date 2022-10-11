import Youtube from './InspectorControl/youtube';

/**
 * WordPress dependencies
 */
 const { __ } = wp.i18n;
 
 const {
     TextControl,
     PanelBody
 } = wp.components;
 
 const {
     InspectorControls
 } = wp.blockEditor;
 

export default function Inspector({attributes, setAttributes, isYTChannel}) {

    const {
        width,
        height,
    } = attributes;

    return (
        <InspectorControls>
            <PanelBody title={__("Customize Embedded Link")}>
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

                {
                    isYTChannel && (
                        <Youtube attributes={attributes} setAttributes={setAttributes}  />
                    )
                }
            </PanelBody>
        </InspectorControls>
    )
}