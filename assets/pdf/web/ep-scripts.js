"use strict";

//Create theme mode function
const setThemeMode = (themeMode) => {
    const htmlEL = document.getElementsByTagName("html")[0];
    if (htmlEL) {
        htmlEL.setAttribute('ep-data-theme', themeMode);
    }
}


const getParamObj = (hash) => {

    let paramsObj = {};
    let colorsObj = {};

    if (location.hash) {
        let hashParams = new URLSearchParams(hash.substring(1));

        if (hashParams.get('key') !== null) {
            hashParams = '#' + atob(hashParams.get('key'));
            hashParams = new URLSearchParams(hashParams.substring(1));
        }

        if (hashParams.get('themeMode') == 'custom') {
            colorsObj = {
                customColor: hashParams.get('customColor'),
            };
        }
        paramsObj = {
            themeMode: hashParams.get('themeMode'),
            ...colorsObj,
            presentation: hashParams.get('presentation'),
            lazyLoad: hashParams.get('lazyLoad'),
            copy_text: hashParams.get('copy_text'),
            add_text: hashParams.get('add_text'),
            draw: hashParams.get('draw'),
            add_image: hashParams.get('add_image'),
            position: hashParams.get('position'),
            download: hashParams.get('download'),
            toolbar: hashParams.get('toolbar'),
            doc_details: hashParams.get('pdf_details'),
            doc_rotation: hashParams.get('pdf_rotation'),
            selection_tool: hashParams.get('selection_tool'),
            scrolling: hashParams.get('scrolling'),
            spreads: hashParams.get('spreads'),
            is_pro_active: hashParams.get('is_pro_active'),
            watermark_text: hashParams.get('watermark_text'),
            watermark_font_size: hashParams.get('watermark_font_size'),
            watermark_color: hashParams.get('watermark_color'),
            watermark_opacity: hashParams.get('watermark_opacity'),
            watermark_style: hashParams.get('watermark_style'),
        };


        if (hashParams.get('download') !== 'true' && hashParams.get('download') !== 'yes') {
            window.addEventListener('beforeunload', function (event) {
                event.stopImmediatePropagation();
            });
        }
    }

    return paramsObj;
}

const isDisplay = (selectorName) => {
    if (selectorName == 'false' || selectorName == false) {
        selectorName = 'none';
    }
    else {
        selectorName = 'block';
    }
    return selectorName;
}


const adjustHexColor = (hexColor, percentage) => {
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


const getColorBrightness = (hexColor) => {
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
const pdfIframeStyle = (data) => {

    const isAllNull = Object.values(data).every(value => value === null);;

    if (isAllNull) {
        return false;
    };

    let settingsPos = '';

    if (data.toolbar === false || data.toolbar == 'false') {
        data.presentation = false; data.download = true; data.copy_text = true; data.add_text = true; data.draw = true, data.doc_details = false; data.doc_rotation = false, data.add_image = false;
    }

    let position = 'top';
    let toolbar = isDisplay(data.toolbar);
    let presentation = isDisplay(data.presentation);
    let download = isDisplay(data.download);
    let copy_text = isDisplay(data.copy_text);
    let add_text = isDisplay(data.add_text);
    let draw = isDisplay(data.draw);

    if (copy_text === 'block' || copy_text == 'true' || copy_text == true) {
        copy_text = 'text';
    }


    let doc_details = isDisplay(data.doc_details);
    let doc_rotation = isDisplay(data.doc_rotation);
    let add_image = isDisplay(data.add_image);

    const otherhead = document.getElementsByTagName("head")[0];

    const style = document.createElement("style");
    style.setAttribute('id', 'EBiframeStyleID');

    let pdfCustomColor = '';



    if (data.themeMode == 'custom') {
        if (!data.customColor) {
            data.customColor = '#38383d';
        }

        let colorBrightness = getColorBrightness(data.customColor);

        let iconsTextsColor = 'white';
        if (colorBrightness > 60) {
            iconsTextsColor = 'black';
        }

        pdfCustomColor = `    
        [ep-data-theme="custom"] {
            --body-bg-color: ${data.customColor};
            --toolbar-bg-color: ${adjustHexColor(data.customColor, 15)};
            --doorhanger-bg-color: ${data.customColor};
            --field-bg-color: ${data.customColor};
            --dropdown-btn-bg-color: ${data.customColor};
            --button-hover-color: ${adjustHexColor(data.customColor, 25)};
            --toggled-btn-bg-color: ${adjustHexColor(data.customColor, 25)};
            --doorhanger-hover-bg-color: ${adjustHexColor(data.customColor, 20)};
            --toolbar-border-color: ${adjustHexColor(data.customColor, 10)};
            --doorhanger-border-color: ${adjustHexColor(data.customColor, 10)};
            --doorhanger-border-color-whcm: ${adjustHexColor(data.customColor, 10)};
            --separator-color: ${adjustHexColor(data.customColor, 10)};
            --doorhanger-separator-color: ${adjustHexColor(data.customColor, 15)};
            --toolbar-icon-bg-color: ${iconsTextsColor};
            --toolbar-icon-bg-color: ${iconsTextsColor};
            --main-color: ${iconsTextsColor};
            --field-color: ${iconsTextsColor};
            --doorhanger-hover-color: ${iconsTextsColor};
            --toolbar-icon-hover-bg-color: ${iconsTextsColor};
            --toggled-btn-color: ${iconsTextsColor};

        }`;
    }

    if (data.position === 'top') {
        position = 'top:0;bottom:auto;'
        settingsPos = '';
    }
    else {
        position = 'bottom:0;top:auto;'
        settingsPos = `
        .findbar, .secondaryToolbar {
            top: auto;bottom: 32px;
        }
        .doorHangerRight:after{
            transform: rotate(180deg);
            bottom: -16px;
        }
         .doorHangerRight:before {
            transform: rotate(180deg);
            bottom: -18px;
        }

        .findbar.doorHanger:before {
            bottom: -18px;
            transform: rotate(180deg);
        }
        .findbar.doorHanger:after {
            bottom: -16px;
            transform: rotate(180deg);
        }

        div#editorInkParamsToolbar, #editorFreeTextParamsToolbar {
            bottom: 32px;
            top: auto; 
        }
        #mainContainer {
            top: -40px!important;
        }
    `;
    }

    style.textContent = `
        .toolbar{
            display: ${toolbar}!important;
            position: absolute;
            ${position}
        }
        #secondaryToolbar{
            display: ${toolbar};
        }
        #secondaryPresentationMode, #toolbarViewerRight #presentationMode{
            display: ${presentation}!important;
        }
        #secondaryOpenFile, #toolbarViewerRight #openFile{
            display: none!important;
        }
        #secondaryDownload, #secondaryPrint, #print, #download{
            display: ${download}!important;
        }
        #pageRotateCw{
            display: ${doc_rotation}!important;
        }
        #editorStamp{
            display: ${add_image}!important;
        }
        #pageRotateCcw{
            display: ${doc_rotation}!important;
        }
        #documentProperties{
            display: ${doc_details}!important;
        }
        .textLayer{
            user-select: ${copy_text}!important;
            -webkit-user-select: ${copy_text}!important;
            -moz-user-select: ${copy_text}!important;   
            -ms-user-select: ${copy_text}!important;    
        }
        button#cursorSelectTool{
            display: ${copy_text}!important;
        }

        #editorFreeText{
            display: ${add_text}!important;
        }
        #editorInk{
            display: ${draw}!important;
        }

        ${pdfCustomColor}

        ${settingsPos}
    `;

    if (otherhead) {
        if (document.getElementById("EBiframeStyleID")) {
            document.getElementById("EBiframeStyleID").remove();
        }
        otherhead.appendChild(style);
    }
}

const manupulatePDFIframe = (e) => {
    let hashNewUrl = new URL(e.newURL);
    let data = getParamObj(hashNewUrl.hash);
    pdfIframeStyle(data);
    setThemeMode(data.themeMode);

}

window.addEventListener('hashchange', (e) => {
    manupulatePDFIframe(e);
}, false);


let data = getParamObj(location.hash);

pdfIframeStyle(data);
setThemeMode(data.themeMode);



document.querySelector(".presentationMode")?.addEventListener("click", function () {

    var mainContainer = document.getElementById("mainContainer");
    if (mainContainer && !document.fullscreenElement) {
        mainContainer.requestFullscreen().catch(err => {
            alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
});

document.getElementById("viewBookmark")?.addEventListener('click', (e) => {
    e.preventDefault();
    const url = e.target.getAttribute('href');
    if (url !== null) {
        alert(`Current Page: ${url}`);
    }
});


if (data.lazyLoad === false || data.lazyLoad == 'false') {
    document.querySelector('html').style.opacity = '1';
}
else {
    function updateOpacity() {
        const pdfViewer = document.querySelector('.pdfViewer');

        if (pdfViewer.innerHTML.trim()) {
            document.querySelector('html').style.opacity = '1';
            document.querySelector('html').style.transition = '500ms';
            clearInterval(intervalId);  // Clear the interval once opacity is set to 1
        }
    }
    const intervalId = setInterval(updateOpacity, 100);
    updateOpacity();
}


// ── Watermark: draw directly on PDF page canvas ──
const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const drawWatermarkOnCanvas = (canvas, wm) => {
    if (!wm.text) return;
    const ctx = canvas.getContext('2d');
    ctx.save();

    const fontSize = parseInt(wm.fontSize, 10) || 48;
    const opacity = (parseInt(wm.opacity, 10) || 15) / 100;
    const color = wm.color || '#000000';

    ctx.fillStyle = hexToRgba(color, opacity);
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (wm.style === 'tiled') {
        // Tiled: repeated watermark across the page
        const textWidth = ctx.measureText(wm.text).width;
        const stepX = textWidth + 80;
        const stepY = fontSize * 3;
        // Expand drawing area to cover rotated canvas
        const diagonal = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height);

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-Math.PI / 6);

        for (let y = -diagonal; y < diagonal; y += stepY) {
            for (let x = -diagonal; x < diagonal; x += stepX) {
                ctx.fillText(wm.text, x, y);
            }
        }
    } else {
        // Center: single diagonal watermark
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-Math.atan2(canvas.height, canvas.width));

        // Scale font to fit page width if text is long
        const textWidth = ctx.measureText(wm.text).width;
        const maxWidth = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height) * 0.8;
        if (textWidth > maxWidth) {
            const scaledSize = Math.floor(fontSize * (maxWidth / textWidth));
            ctx.font = `bold ${scaledSize}px sans-serif`;
        }

        ctx.fillText(wm.text, 0, 0);
    }

    ctx.restore();
};

// Hook into PDF.js pagerendered event
if (data.watermark_text) {
    const wmData = {
        text: data.watermark_text,
        fontSize: data.watermark_font_size || '48',
        color: data.watermark_color || '#000000',
        opacity: data.watermark_opacity || '15',
        style: data.watermark_style || 'center',
    };

    // Wait for PDFViewerApplication to be ready
    const waitForViewer = setInterval(() => {
        if (typeof PDFViewerApplication !== 'undefined' && PDFViewerApplication.eventBus) {
            clearInterval(waitForViewer);
            PDFViewerApplication.eventBus.on('pagerendered', (evt) => {
                const canvas = evt.source.canvas;
                if (canvas) {
                    drawWatermarkOnCanvas(canvas, wmData);
                }
            });
        }
    }, 100);
}

