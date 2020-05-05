/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
import classnames from 'classnames';
const { IconButton, Toolbar } = wp.components;
const { BlockControls,BlockAlignmentToolbar } = wp.editor;

const EmbedControls = ( props ) => {
	const {
		showEditButton,
		switchBackToURLInput,
		align,
		alignChange
	} = props;
	return (
		<Fragment>
			<BlockControls>
				<BlockAlignmentToolbar
					value={ align }
					onChange={alignChange}
				/>
				<Toolbar>
					{ showEditButton && (
						<IconButton
							className="components-toolbar__control"
							label={ __( 'Edit URL' ) }
							icon="edit"
							onClick={ switchBackToURLInput }
						/>
					) }
				</Toolbar>
			</BlockControls>

		</Fragment>
	);
};

export default EmbedControls;
