/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { useState, useEffect, Fragment } = wp.element;
const {
    BlockControls,
    BlockIcon,
    MediaPlaceholder,
    InspectorControls,
    useBlockProps
} = wp.blockEditor;

const {
    ToolbarButton,
    PanelBody,
    ExternalLink,
    ToggleControl,
    TextControl,
    SelectControl,
    RadioControl,
    ColorPalette,
    Tooltip,
} = wp.components;


/**
 * Internal dependencies
 */
import ControlHeader from '../../GlobalCoponents/control-heading';
import LockControl from '../../GlobalCoponents/lock-control';
import ContentShare from '../../GlobalCoponents/social-share-control';
import AdControl from '../../GlobalCoponents/ads-control';
import Upgrade from '../../GlobalCoponents/upgrade';
import CustomBranding from "../../GlobalCoponents/custombranding";
import { EPIcon, InfoIcon } from "../../GlobalCoponents/icons";
import DocControls from "./components/doc-controls";

const Inspector = ({ attributes, setAttributes }) => {

    const { unitoption, width, height } = attributes;

    return (
        <InspectorControls>
            <PanelBody title={<div className="ep-pannel-icon">{EPIcon} {__('Embed Size', 'embedpress')}</div>} className="embedpress-documents-control">
                <div className='ep-controls-margin'>
                    <div className={'ep-pdf-width-contol'}>
                        <RadioControl
                            selected={unitoption}
                            options={[
                                { label: '%', value: '%' },
                                { label: 'PX', value: 'px' },
                            ]}
                            onChange={(unitoption) => setAttributes({ unitoption })}
                            className={'ep-unit-choice-option'}
                        />
                        <div className="ep-width-control-with-tooltip">
                            <TextControl
                                label={
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        {__("Width")}
                                        <Tooltip text={__("Works as max container width", "embedpress")} position="top">
                                            <span style={{ display: 'inline-flex', cursor: 'help' }}>
                                                {InfoIcon}
                                            </span>
                                        </Tooltip>
                                    </span>
                                }
                                type={'number'}
                                value={width}
                                onChange={(width) => setAttributes({ width })}
                            />
                        </div>
                    </div>
                    <TextControl
                        label={__('Height', 'embedpress')}
                        value={height}
                        type={'number'}
                        onChange={(height) => setAttributes({ height })}
                    />
                </div>
            </PanelBody>

            <DocControls attributes={attributes} setAttributes={setAttributes} />

            <CustomBranding attributes={attributes} setAttributes={setAttributes} />
            <AdControl attributes={attributes} setAttributes={setAttributes} />
            <LockControl attributes={attributes} setAttributes={setAttributes} />
            <ContentShare attributes={attributes} setAttributes={setAttributes} />

            <Upgrade />

        </InspectorControls>

    );
};

export default Inspector;
