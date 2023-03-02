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

        if (hashParams.get('themeMode') == 'custom') {
            colorsObj = {
                customColor: hashParams.get('customColor'),
            };
        }
        paramsObj = {
            themeMode: hashParams.get('themeMode'),
            ...colorsObj,
            presentation: hashParams.get('presentation'),
            copy_text: hashParams.get('copy_text'),
            add_text: hashParams.get('add_text'),
            draw: hashParams.get('draw'),
            position: hashParams.get('position'),
            download: hashParams.get('download'),
            toolbar: hashParams.get('toolbar'),
            doc_details: hashParams.get('doc_details'),
            doc_rotation: hashParams.get('doc_rotation'),
        };

    
        if(hashParams.get('download') !== 'true' && hashParams.get('download') !== 'yes'){
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
    let settingsPos = '';

    if (data.toolbar === false || data.toolbar == 'false') {
        data.presentation = false; data.download = true; data.copy_text = true; data.add_text = true; data.draw = true, data.doc_details = false; data.doc_rotation = false;
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
        #secondaryDownload, #secondaryPrint, #toolbarViewerRight #print, #toolbarViewerRight #download{
            display: ${download}!important;
        }
        #pageRotateCw{
            display: ${doc_rotation}!important;
        }
        #pageRotateCcw{
            display: ${doc_rotation}!important;
        }
        #documentProperties{
            display: ${doc_details}!important;
        }
        .textLayer{
            user-select: ${copy_text}!important;
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
