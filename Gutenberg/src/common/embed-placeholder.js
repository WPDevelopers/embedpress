/**
 * WordPress dependencies
 */
const {__, _x} = wp.i18n;
import classnames from 'classnames';
const {Button, Placeholder, ExternalLink} = wp.components;
const {BlockIcon} = wp.blockEditor;

const EmbedPlaceholder = (props) => {
	const {icon, label, value, onSubmit, onChange, cannotEmbed, docLink, DocTitle} = props;
	const classes = classnames( 'wp-block-embed', {} );
	return (
		<div>
			<Placeholder icon={<BlockIcon icon={icon} showColors/>} label={label} className={classes}>

				<form onSubmit={onSubmit}>
					<input
						type="url"
						value={value || ''}
						className="components-placeholder__input"
						aria-label={label}
						placeholder={__('Enter URL to embed here…')}
						onChange={onChange}/>
					<Button
						isLarge
						type="submit">
						{_x('Embed', 'button label')}
					</Button>

					{cannotEmbed &&
					<p className="components-placeholder__error">
						{__('Sorry, we could not embed that content.')}<br/>
					</p>
					}

				</form>
				{docLink &&
				<div className="components-placeholder__learn-more">
					<ExternalLink href={docLink}>{DocTitle}</ExternalLink>
				</div>
				}

			</Placeholder>
		</div>

	);
};

export default EmbedPlaceholder;
