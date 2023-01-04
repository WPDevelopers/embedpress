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

    if (location.hash) {
        let hashParams = new URLSearchParams(hash.substring(1));

        paramsObj = {
            themeMode: hashParams.get('themeMode'),
            presentation: hashParams.get('presentation'),
            copy_text: hashParams.get('copy_text'),
            position: hashParams.get('position'),
            download: hashParams.get('download'),
            toolbar: hashParams.get('toolbar'),
            doc_details: hashParams.get('doc_details'),
            doc_rotation: hashParams.get('doc_rotation')
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


const pdfIframeStyle = (data) => {
    let settingsPos = '';

    if (data.toolbar === false || data.toolbar == 'false') {
        data.presentation = false; data.download = true; data.copy_text = true; data.doc_details = false; data.doc_rotation = false;
    }

    let position = 'top';
    let toolbar = isDisplay(data.toolbar);
    let presentation = isDisplay(data.presentation);
    let download = isDisplay(data.download);
    let copy_text = isDisplay(data.copy_text);

    if (copy_text === 'block' || copy_text == 'true' || copy_text == true) {
        copy_text = 'text';
    }

    let doc_details = isDisplay(data.doc_details);
    let doc_rotation = isDisplay(data.doc_rotation);

    // console.log(position, toolbar, presentation, download, copy_text, doc_details, doc_rotation);

    const otherhead = document.getElementsByTagName("head")[0];

    // console.log(document.getElementsByTagName("head")[0]);

    const style = document.createElement("style");
    style.setAttribute('id', 'EBiframeStyleID');

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
