import { sanitizeUrl, isFileUrl } from '../../../GlobalCoponents/helper';
import { DocumentIcon, epGetPopupIcon, epGetDownloadIcon, epGetPrintIcon, epGetFullscreenIcon, epGetMinimizeIcon, epGetDrawIcon } from '../../../GlobalCoponents/icons';


const FileViewer = ({
    href, url, docViewer, width, height, themeMode, customColor, id,
    download, draw, toolbar, presentation, setShowOverlay, setFetching, loadPdf, fetching
}) => (
    <div
        className={`${docViewer === 'custom' ? 'ep-file-download-option-masked ' : ''}ep-gutenberg-file-doc ep-powered-by-enabled${download ? ' enabled-file-download' : ''}`}
        data-theme-mode={themeMode}
        data-custom-color={customColor}
        data-id={id}
    >
        <iframe
            src={sanitizeUrl(url)}
            style={{ height, width }}
            onLoad={() => setFetching(false)}
            onMouseUp={() => setShowOverlay(false)}
        />

        {draw && docViewer === 'custom' && <canvas className="ep-doc-canvas" width={width} height={height} />}

        {toolbar && docViewer === 'custom' && (
            <div className="ep-external-doc-icons">
                {!isFileUrl(href) && epGetPopupIcon()}
                {download && isFileUrl(href) && epGetPrintIcon()}
                {download && isFileUrl(href) && epGetDownloadIcon()}
                {draw && epGetDrawIcon()}
                {presentation && epGetFullscreenIcon()}
                {presentation && epGetMinimizeIcon()}
            </div>
        )}
    </div>
);

export default FileViewer;
