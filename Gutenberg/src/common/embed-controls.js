/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { IconButton, Toolbar } = wp.components;
const { BlockControls } = wp.editor;

const EmbedControls = ( props ) => {
	const {
		showEditButton,
		switchBackToURLInput
	} = props;
	return (
		<Fragment>
			<BlockControls>
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
