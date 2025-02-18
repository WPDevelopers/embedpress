
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
    viwerParentEls.forEach((el) => {
      if (!document.fullscreenElement) {
        el.classList.remove('fullscreen-enabled');
        el.style.width = '';
        el.style.height = '';
        el.style.position = '';
        el.style.top = '';
        el.style.left = '';
        el.style.background = '';
        el.style.zIndex = '';

        el.querySelector('.ep-doc-minimize-icon').style.display = 'none';
        el.querySelector('.ep-doc-fullscreen-icon').style.display = 'flex';

        const viewerElement = el.querySelector('iframe') || el.querySelector('.ose-google-docs');
        if (viewerElement) {
          viewerElement.style.width = '';
          viewerElement.style.height = '';
        }
      }
    });
  }

  function handleClick(event) {
    event.stopPropagation();

    const viwerParentEl = event.target.closest('.ep-file-download-option-masked');
    if (!viwerParentEl) return;

    const viewerElement = viwerParentEl.querySelector('iframe') || viwerParentEl.querySelector('.ose-google-docs');
    if (!viewerElement) return;

    const popupIcon = event.target.closest('.ep-doc-popup-icon svg');
    const printIcon = event.target.closest('.ep-doc-print-icon svg');
    const downloadIcon = event.target.closest('.ep-doc-download-icon svg');
    const minimizeIcon = event.target.closest('.ep-doc-minimize-icon svg');
    const fullscreenIcon = event.target.closest('.ep-doc-fullscreen-icon svg');

    if (popupIcon instanceof SVGElement) {
      window.open(viewerElement.getAttribute('src'), '_blank');
    } else if (printIcon instanceof SVGElement) {
      window.open(`https://view.officeapps.live.com/op/view.aspx?src=${viewerElement.getAttribute('src')}&wdOrigin=BROWSELINK`, '_blank');
    } else if (downloadIcon instanceof SVGElement) {
      fetch(viewerElement.getAttribute('src'), { mode: 'no-cors' })
        .then(response => {
          if (response.ok) {
            response.blob().then(blob => {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'document';
              document.body.appendChild(a);
              a.click();
              a.remove();
            });
          } else {
            window.location.href = viewerElement.getAttribute('src');
          }
        })
        .catch(() => {
          window.location.href = viewerElement.getAttribute('src');
        });
    } else if (minimizeIcon instanceof SVGElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    } else if (fullscreenIcon instanceof SVGElement) {
      if (viwerParentEl.requestFullscreen) {
        viwerParentEl.requestFullscreen();
      } else if (viwerParentEl.webkitRequestFullscreen) {
        viwerParentEl.webkitRequestFullscreen();
      } else if (viwerParentEl.msRequestFullscreen) {
        viwerParentEl.msRequestFullscreen();
      }

      viwerParentEl.classList.add("fullscreen-enabled");

      viwerParentEl.style.width = "100vw";
      viwerParentEl.style.height = "100vh";
      viwerParentEl.style.position = "fixed";
      viwerParentEl.style.top = "0";
      viwerParentEl.style.left = "0";
      viwerParentEl.style.background = "#fff";
      viwerParentEl.style.zIndex = "9999";

      if (viewerElement) {
        viewerElement.setAttribute(
          "style",
          "width: 100% !important; height: 100% !important;"
        );
      }      

      viwerParentEl.querySelector(".ep-doc-minimize-icon").style.display = 'flex';
      viwerParentEl.querySelector(".ep-doc-fullscreen-icon").style.display = 'none';
    }
  }

  document.addEventListener('click', handleClick);
  document.addEventListener('fullscreenchange', handleFullscreenChange);
};

  

if (typeof embedpressDocViewer.epDocumentsViewerController === "function") {
    if (jQuery('.wp-block-embedpress-document.embedpress-document-embed').length > 0) {
        embedpressDocViewer.epDocumentsViewerController();
    }
}

if (typeof wp !== 'undefined' && typeof wp.editor !== 'undefined') {
    if (typeof embedpressDocViewer.viewerStyle === "function") {
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
    elementorFrontend.hooks.addAction("frontend/element_ready/embedpres_elementor.default", filterableGalleryHandler);
});


const myDivs = document.querySelectorAll('.ep-file-download-option-masked');
const canDownloadDivs = document.querySelectorAll('.enabled-file-download');


myDivs.forEach(function (div) {
    div.addEventListener('contextmenu', preventRightClick);
});

function preventRightClick(event) {
    event.preventDefault();
}

canDownloadDivs.forEach(function (div) {
    div.removeEventListener('contextmenu', preventRightClick);
});