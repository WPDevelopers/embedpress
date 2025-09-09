import { sanitizeUrl, saveSourceData, isFileUrl } from '../../../GlobalCoponents/helper';
import { DocumentIcon, epGetPopupIcon, epGetDownloadIcon, epGetPrintIcon, epGetFullscreenIcon, epGetMinimizeIcon, epGetDrawIcon } from '../../../GlobalCoponents/icons';


const PDFViewer = ({ href, id, width, height, setFetching }) => (
	<div className={`embedpress-embed-document-pdf ${id}`} style={{ height, width }} data-emid={id}>
		<embed src={sanitizeUrl(href)} style={{ height, width }} onLoad={() => setFetching(false)} />
	</div>
);

export default PDFViewer;