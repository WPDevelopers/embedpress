/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { BlockControls } from "@wordpress/block-editor";
import { ToolbarGroup, ToolbarButton } from "@wordpress/components";

/**
 * Internal dependencies
 */
import { editIcon } from "./icons.jsx";

/**
 * EmbedControls Component
 * 
 * Toolbar controls for the embed block
 */
export default function EmbedControls({ showEditButton, switchBackToURLInput }) {
    if (!showEditButton) {
        return null;
    }

    return (
        <BlockControls>
            <ToolbarGroup>
                <ToolbarButton
                    className="components-toolbar__control"
                    label={__('Edit URL', 'embedpress')}
                    icon={editIcon}
                    onClick={switchBackToURLInput}
                />
            </ToolbarGroup>
        </BlockControls>
    );
}
