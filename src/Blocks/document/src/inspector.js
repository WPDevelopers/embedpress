/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { useState, useEffect, Fragment } from "@wordpress/element";
import {
    BlockControls,
    BlockIcon,
    MediaPlaceholder,
    InspectorControls,
    useBlockProps
} from "@wordpress/block-editor";
import {
    ToolbarButton,
    RangeControl,
    PanelBody,
    ExternalLink,
    ToggleControl,
    TextControl,
    SelectControl,
    RadioControl,
    ColorPalette,
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from "@wordpress/components";

import { getBlobByURL, isBlobURL, revokeBlobURL } from "@wordpress/blob";
import { applyFilters } from "@wordpress/hooks";

/**
 * Internal dependencies
 */
import ControlHeader from '../../GlobalCoponents/control-heading';
import LockControl from '../../GlobalCoponents/lock-control';
import ContentShare from '../../GlobalCoponents/social-share-control';
import AdControl from '../../GlobalCoponents/ads-control';
import Upgrade from '../../GlobalCoponents/upgrade';
import CustomBranding from "../../GlobalCoponents/custombranding";
import { EPIcon } from "../../GlobalCoponents/icons";
import DocControls from "./components/doc-controls";

const Inspector = ({ attributes, setAttributes }) => {

    const { width, height } = attributes;
    const min = 1;
    const max = 1000;

    return (
        <InspectorControls>
            <PanelBody title={<div className="ep-pannel-icon">{EPIcon} {__('Embed Size', 'embedpress')}</div>} className="embedpress-documents-control">
                <RangeControl label={__('Width', 'embedpress')} value={width || 720} onChange={(width) => setAttributes({ width })} min={min} max={max} />
                <RangeControl label={__('Height', 'embedpress')} value={height} onChange={(height) => setAttributes({ height })} min={min} max={max} />
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
