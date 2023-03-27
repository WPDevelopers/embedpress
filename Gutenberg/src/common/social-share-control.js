/**
 * WordPress dependencies
 */

import CustomThumbnail from "./customthumbnail";

const { __ } = wp.i18n;

const {
    TextControl,
    TextareaControl,
    ToggleControl,
    SelectControl,
    PanelBody,
} = wp.components;

export default function ContentShare({ attributes, setAttributes }) {

    const {
        customTitle,
        customDescription,
        contentShare,
        sharePosition
    } = attributes;


    return (
        <PanelBody title={__("Content Share")} initialOpen={false}>
            <div className={'content-share-toggle'}>
                <ToggleControl
                    label={__("Enable Content Share")}
                    checked={contentShare}
                    onChange={(contentShare) => setAttributes({ contentShare })}
                />
            </div>
            {
                contentShare && (
                    <div>

                        <TextControl
                            label={__("Title")}
                            value={customTitle}
                            onChange={(customTitle) => setAttributes({ customTitle })}
                        />
                        <TextareaControl
                            label={__("Description")}
                            placeholder={__("Enter description")}
                            value={customDescription}
                            onChange={(customDescription) => setAttributes({ customDescription })}
                        />
                        <SelectControl
                            label={__("Position")}
                            value={sharePosition}
                            options={[
                                { label: 'Top', value: 'top' },
                                { label: 'Right', value: 'right' },
                                { label: 'Bottom', value: 'bottom' },
                                { label: 'Left', value: 'left' },
                            ]}
                            onChange={(sharePosition) => setAttributes({ sharePosition })}
                            __nextHasNoMarginBottom
                        />


                        <CustomThumbnail attributes={attributes} setAttributes={setAttributes} />
                    </div>
                )
            }
        </PanelBody>
    )
}