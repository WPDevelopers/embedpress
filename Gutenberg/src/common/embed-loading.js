/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Spinner } = wp.components;

const EmbedLoading = () => (
	<div className="wp-block-embed is-loading">
		<Spinner />
		<p>{ __( 'Embedding…' ) }</p>
	</div>
);

export default EmbedLoading;
