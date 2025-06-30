import { epGetPopupIcon, epGetDownloadIcon, epGetPrintIcon, epGetFullscreenIcon, epGetMinimizeIcon, epGetDrawIcon } from '../../../GlobalCoponents/icons';
import { isFileUrl } from '../../../GlobalCoponents/helper';
import Logo from "../../../GlobalCoponents/Logo";

const save = (props) => {
	const {
		href,
		mime,
		id,
		width,
		height,
		powered_by,
		docViewer,
		themeMode, customColor, presentation, position, download, draw, toolbar, doc_rotation
	} = props.attributes

	const { attributes } = props;

	const urlParamsObject = {
		theme_mode: themeMode,
		...(themeMode === 'custom' && { custom_color: customColor ? customColor : '#343434' }),
		presentation: presentation ? presentation : true,
		position: position ? position : 'bottom',
		download: download ? download : true,
		draw: draw ? draw : true,
	}
	const urlParams = new URLSearchParams(urlParamsObject);
	const queryString = urlParams.toString();

	let isDownloadEnabled = ' enabled-file-download';
	if (!download) {
		isDownloadEnabled = '';
	}

	let iframeSrc = '//view.officeapps.live.com/op/embed.aspx?src=' + href // + '?' + queryString;
	
	if(docViewer === 'google') {
		iframeSrc = '//docs.google.com/gview?embedded=true&url=' + href;
	}

	return (
		<div className={'embedpress-document-embed ep-doc-' + id} style={{ height: height, width: width }}>
			{mime === 'application/pdf' && (
				<div
					style={{
						height: height,
						width: width
					}}
					className={'embedpress-embed-document-pdf' + ' ' + id}
					data-emid={id}
					data-emsrc={href}></div>
			)}

			{mime !== 'application/pdf' && (
				<div className={`${docViewer === 'custom' ? 'ep-file-download-option-masked ' : ''}ep-gutenberg-file-doc ep-powered-by-enabled ${isDownloadEnabled}`} data-theme-mode={themeMode} data-custom-color={customColor} data-id={id}>
					<iframe
						style={{
							height: height,
							width: width
						}}
						src={iframeSrc}
						mozallowfullscreen="true"
						webkitallowfullscreen="true" />
					{
						draw && docViewer === 'custom' &&  (
							<canvas class="ep-doc-canvas" width={width} height={height} ></canvas>
						)
					}

					{
						toolbar && docViewer === 'custom' &&  (
							<div class="ep-external-doc-icons ">
								{
									!isFileUrl(href) && (
										epGetPopupIcon()
									)
								}
								{(download && isFileUrl(href)) && (epGetPrintIcon())}
								{(download && isFileUrl(href)) && (epGetDownloadIcon())}
								{draw && (epGetDrawIcon())}
								{presentation && (epGetFullscreenIcon())}
								{presentation && (epGetMinimizeIcon())}
							</div>
						)
					}
				</div>
			)}
			{powered_by && (
				<p className="embedpress-el-powered">Powered
					By
					EmbedPress</p>
			)}
			{embedpressObj.embedpress_pro && <Logo id={id} />}


		</div>
	);
};

export default save;
