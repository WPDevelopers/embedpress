
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

        const viewerElement = el.querySelector('.ose-google-docs');
        if (viewerElement) {
          viewerElement.style.width = '';
          viewerElement.style.height = '';
        }
      }
    });
  }

  function downloadAsPDF(viewerElement) {
    if (!viewerElement) return;

    // Use html2pdf.js to generate a PDF from the .ose-google-docs section
    import('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js')
      .then((html2pdf) => {
        html2pdf.default()
          .set({
            margin: 10,
            filename: 'document.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
          })
          .from(viewerElement)
          .save();
      })
      .catch((err) => console.error('Error loading html2pdf:', err));
  }

  function printViewerContent(viewerElement) {
    if (!viewerElement) return;

    // Clone the section and open in a new window for printing
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
      <head>
        <title>Print Document</title>
        <style>
          body { margin: 20px; padding: 10px; text-align: center; }
          .ose-google-docs { width: 100%; max-width: 800px; margin: auto; text-align: left; }
        </style>
      </head>
      <body>
        <div class="ose-google-docs">${viewerElement.innerHTML}</div>
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  }

  function handleClick(event) {
    event.stopPropagation();

    const viwerParentEl = event.target.closest('.ep-file-download-option-masked');
    if (!viwerParentEl) return;

    const fullscreenEl = viwerParentEl.querySelector('.ose-google-docs');
    const viewerElement = viwerParentEl;
    if (!viewerElement) return;

    const popupIcon = event.target.closest('.ep-doc-popup-icon svg');
    const printIcon = event.target.closest('.ep-doc-print-icon svg');
    const downloadIcon = event.target.closest('.ep-doc-download-icon svg');
    const minimizeIcon = event.target.closest('.ep-doc-minimize-icon svg');
    const fullscreenIcon = event.target.closest('.ep-doc-fullscreen-icon svg');

    if (popupIcon instanceof SVGElement) {
      window.open(viewerElement.getAttribute('src'), '_blank');
    } else if (printIcon instanceof SVGElement) {
      printViewerContent(viewerElement);
    } else if (downloadIcon instanceof SVGElement) {
      printViewerContent(viewerElement);
    } else if (minimizeIcon instanceof SVGElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    } else if (fullscreenIcon instanceof SVGElement) {
      if (fullscreenEl.requestFullscreen) {
        fullscreenEl.requestFullscreen();
      } else if (fullscreenEl.webkitRequestFullscreen) {
        fullscreenEl.webkitRequestFullscreen();
      } else if (fullscreenEl.msRequestFullscreen) {
        fullscreenEl.msRequestFullscreen();
      }

      fullscreenEl.classList.add("fullscreen-enabled");

      fullscreenEl.style.width = "100vw";
      fullscreenEl.style.height = "100vh";
      fullscreenEl.style.position = "fixed";
      fullscreenEl.style.top = "0";
      fullscreenEl.style.left = "0";
      fullscreenEl.style.background = "#fff";
      fullscreenEl.style.zIndex = "9999";

      if (fullscreenEl) {
        fullscreenEl.setAttribute(
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