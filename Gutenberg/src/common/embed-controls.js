/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { Button, Toolbar } = wp.components;
const { BlockControls } = wp.blockEditor;
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
						<Button
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
