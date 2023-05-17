
const embedpressDocViewer = {};

document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) {
        const viwerParentEl = document.querySelector('.ep-file-download-option-masked.fullscreen-enabled');
        if (viwerParentEl) {
            viwerParentEl.classList.remove("fullscreen-enabled");
            viwerParentEl.querySelector(".ep-doc-minimize-icon").style.display = 'none';
            viwerParentEl.querySelector(".ep-doc-fullscreen-icon").style.display = 'flex';
        }
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        const viwerParentEl = document.querySelector('.ep-file-download-option-masked.fullscreen-enabled');
        if (viwerParentEl) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }
});


embedpressDocViewer.getColorBrightness = (hexColor) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Convert the RGB color to HSL
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;

    // Calculate the brightness position in percentage
    const brightnessPercentage = Math.round(l / 255 * 100);

    return brightnessPercentage;
}

embedpressDocViewer.adjustHexColor = (hexColor, percentage) => {
    // Convert hex color to RGB values
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Calculate adjusted RGB values
    const adjustment = Math.round((percentage / 100) * 255);
    const newR = Math.max(Math.min(r + adjustment, 255), 0);
    const newG = Math.max(Math.min(g + adjustment, 255), 0);
    const newB = Math.max(Math.min(b + adjustment, 255), 0);

    // Convert adjusted RGB values back to hex color
    const newHexColor = '#' + ((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1);

    return newHexColor;
}

embedpressDocViewer.viewerStyle = () => {
    const viwerParentEls = document.querySelectorAll('.ep-file-download-option-masked');

    let customStyle = document.getElementById('custom-styles') || document.createElement('style');
    customStyle.id = 'custom-styles';
    customStyle.type = 'text/css';
    customStyle.innerHTML = ''

    if (viwerParentEls !== null) {
        viwerParentEls.forEach((el) => {
            let customColor = el.getAttribute('data-custom-color');
            if (customColor == null) {
                return false;
            }
            let colorBrightness = embedpressDocViewer.getColorBrightness(customColor);
            let docId = el.getAttribute('data-id');

            let iconsColor = '#f2f2f6';
            if (colorBrightness > 60) {
                iconsColor = '#343434';
            }

            if (el.getAttribute('data-theme-mode') == 'custom') {

                viewerCustomColor = `    
                [data-id='${docId}'][data-theme-mode='custom'] {
                    --viewer-primary-color: ${customColor};
                    --viewer-icons-color: ${iconsColor};
                    --viewer-icons-hover-bgcolor: ${embedpressDocViewer.adjustHexColor(customColor, -10)};
                
                }`;
                customStyle.innerHTML += viewerCustomColor;
            }
        });

        document.head.appendChild(customStyle);
    }
}

embedpressDocViewer.epDocumentsViewerController = () => {

    const viwerParentEls = document.querySelectorAll('.ep-file-download-option-masked');

    function handleFullscreenChange() {
        if (!document.fullscreenElement) {
            viwerParentEls.forEach((el) => {
                el.classList.remove('fullscreen-enabled');
                el.querySelector('.ep-doc-minimize-icon').style.display = 'none';
                el.querySelector('.ep-doc-fullscreen-icon').style.display = 'flex';
            });
        }
    }

    document.addEventListener('click', function (event) {
        const viwerParentEl = event.target.closest('.ep-file-download-option-masked');

        if (!viwerParentEl) return;

        const viewerIframeEl = viwerParentEl.querySelector('iframe');
        if (!viewerIframeEl) return;

        const iframeSrc = decodeURIComponent(viewerIframeEl.getAttribute('src'));
        if (!iframeSrc) return;

        const regex = /(url|src)=([^&]+)/;
        const match = iframeSrc.match(regex);
        let fileUrl = match && match[2];

        if (!fileUrl) {
            fileUrl = iframeSrc;
        }

        const popupIcon = event.target.closest('.ep-doc-popup-icon svg');
        const printIcon = event.target.closest('.ep-doc-print-icon svg');
        const downloadcIcon = event.target.closest('.ep-doc-download-icon svg');
        const minimizeIcon = event.target.closest('.ep-doc-minimize-icon svg');
        const fullscreenIcon = event.target.closest('.ep-doc-fullscreen-icon svg');
        const drawIcon = event.target.closest('.ep-doc-draw-icon svg');

        if (popupIcon instanceof SVGElement) {
            window.open(fileUrl, '_blank');
        }
        else if (printIcon instanceof SVGElement) {
            const newTab = window.open(`https://view.officeapps.live.com/op/view.aspx?src=${fileUrl}&wdOrigin=BROWSELINK`, '_blank');
        } else if (downloadcIcon instanceof SVGElement) {
            fetch(fileUrl, { mode: 'no-cors' })
                .then(response => {
                    if (response.ok) {
                        response.blob().then(blob => {
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                        });
                    } else {
                        window.location.href = fileUrl;
                    }
                })
                .catch(error => {
                    window.location.href = fileUrl;
                });
        } else if (minimizeIcon instanceof SVGElement) {
            const viwerParentEl = event.target.closest('.ep-file-download-option-masked');

            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }

        } else if (fullscreenIcon instanceof SVGElement) {
            const viwerParentEl = event.target.closest('.ep-file-download-option-masked');

            if (viwerParentEl.requestFullscreen) {
                viwerParentEl.requestFullscreen();
            } else if (viwerParentEl.webkitRequestFullscreen) {
                viwerParentEl.webkitRequestFullscreen();
            } else if (viwerParentEl.msRequestFullscreen) {
                viwerParentEl.msRequestFullscreen();
            }

            viwerParentEl.querySelector(".ep-doc-minimize-icon").style.display = 'flex';
            viwerParentEl.querySelector(".ep-doc-fullscreen-icon").style.display = 'none';
            viwerParentEl.classList.add("fullscreen-enabled");

        } else if (drawIcon instanceof SVGElement) {

            const canvas = viwerParentEl.querySelector(".ep-doc-canvas");
            const drawTooggle = viwerParentEl.querySelector(".ep-doc-draw-icon svg");
            if (!canvas || !drawTooggle) return;


            const ctx = canvas.getContext("2d");
            let isDrawing = false;
            let canDraw = false;

            canvas.addEventListener("mousedown", function (e) {
                if (canDraw) {
                    isDrawing = true;
                    ctx.beginPath();
                    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
                }
            });
            canvas.addEventListener("mousemove", function (e) {
                if (isDrawing && canDraw) {
                    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
                    ctx.stroke();
                }
            });
            canvas.addEventListener("mouseup", function (e) {
                isDrawing = false;
            });

            drawTooggle.parentNode.classList.toggle("active");
            canDraw = drawTooggle.parentNode.classList.contains("active");
            canvas.style.display = canDraw ? "block" : "none";
        }
    });

    document.addEventListener('fullscreenchange', handleFullscreenChange);
};

if (typeof embedpressDocViewer.epDocumentsViewerController === "function") {
    if (jQuery('.wp-block-embedpress-document.embedpress-document-embed').length > 0) {
        embedpressDocViewer.epDocumentsViewerController();
    }
}
if (typeof embedpressDocViewer.viewerStyle === "function") {
    if (jQuery('.wp-block-embedpress-document.embedpress-document-embed').length > 0) {
        embedpressDocViewer.viewerStyle();
    }
}
jQuery(window).on("elementor/frontend/init", function () {
    var filterableGalleryHandler = function ($scope, $) {
        if (typeof embedpressDocViewer.epDocumentsViewerController === "function") {
            embedpressDocViewer.epDocumentsViewerController();
        }
        if (typeof embedpressDocViewer.epDocumentsViewerController === "function") {
            embedpressDocViewer.viewerStyle();
        }

    };
    elementorFrontend.hooks.addAction("frontend/element_ready/embedpres_document.default", filterableGalleryHandler);
});