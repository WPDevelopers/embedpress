import { sanitizeUrl, saveSourceData, isFileUrl } from '../../../GlobalCoponents/helper';
import { DocumentIcon, epGetPopupIcon, epGetDownloadIcon, epGetPrintIcon, epGetFullscreenIcon, epGetMinimizeIcon, epGetDrawIcon } from '../../../GlobalCoponents/icons';


const PDFViewer = ({ href, id, width, height, setFetching, unitoption }) => {
	return (
		<div className={`embedpress-embed-document-pdf ${id}`} style={{ height: height + 'px', width: width + unitoption }} data-emid={id}>
			<embed src={sanitizeUrl(href)} style={{ height: height + 'px', width: width + unitoption, maxWidth: '100%' }} onLoad={() => setFetching(false)} />
		</div>
	)
};

export default PDFViewer;