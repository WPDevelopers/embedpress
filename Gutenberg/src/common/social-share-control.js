/**
 * WordPress dependencies
 */

import CustomThumbnail from "../embedpress/InspectorControl/customthumbnail";

const { __ } = wp.i18n;

const {
    ToggleControl,
    SelectControl
} = wp.components;

export default function ContentShare({ attributes, setAttributes }) {

    const {
        contentShare,
        sharePosition
    } = attributes;


    return (
        <frameElement>
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

                        <SelectControl
                            label={__("Share Postion")}
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
        </frameElement>
    )
}