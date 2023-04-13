/**
 * WordPress dependencies
 */

import CustomThumbnail from "./customthumbnail";
import { EPIcon } from '../common/icons';

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
        <PanelBody title={__("EP Social Share")} initialOpen={false}>
            <div className={'content-share-toggle'}>
                <ToggleControl
                    label={__("Enable Social Share")}
                    checked={contentShare}
                    onChange={(contentShare) => setAttributes({ contentShare })}
                />
            </div>
            {
                contentShare && (
                    <div className={'content-share-controls'}>

                        <TextControl
                            label={__("Title")}
                            value={customTitle}
                            onChange={(customTitle) => setAttributes({ customTitle })}
                            placeholder={__("Enter Title")}
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

                        <div className={'ep-documentation '}>
                            {EPIcon} 
                            <a href="https://embedpress.com/docs/ep-social-share-option-with-embedded-content/" target={'_blank'}> Need Help? </a>
                        </div>
                    </div>
                )
            }
        </PanelBody>
    )
}