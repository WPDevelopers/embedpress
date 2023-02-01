
const isFileURL = (url) => {
    const pattern = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/i;
    return pattern.test(url);
}

const getExtensionFromFileURL = (url) => {
    const urlSplit = url.split(".");
    const ext = urlSplit[urlSplit.length - 1];
    return ext;
}

const getSourceName = (url) => {
    let sourceName = "";
    let protocolIndex = url.indexOf("://");
    if (protocolIndex !== -1) {
        let domainStartIndex = protocolIndex + 3;
        let domainEndIndex = url.indexOf(".", domainStartIndex);
        let secondDotIndex = url.indexOf(".", domainEndIndex + 1);
        if (secondDotIndex === -1) {
            sourceName = url.substring(domainStartIndex, domainEndIndex);
        } else {
            sourceName = url.substring(domainEndIndex + 1, secondDotIndex);
        }
    }

    console.log(isFileURL(url)); 

    if (isFileURL(url)) {
        sourceName = 'document_' + getExtensionFromFileURL(url);
    }

    return sourceName;
}

export const addProAlert = (e, isProPluginActive) => {
    if (!isProPluginActive) {
        document.querySelector('.pro__alert__wrap').style.display = 'block';
    }
}

export const removeAlert = () => {
    if (document.querySelector('.pro__alert__wrap')) {
        document.querySelector('.pro__alert__wrap .pro__alert__card .button').addEventListener('click', (e) => {
            document.querySelector('.pro__alert__wrap').style.display = 'none';
        });
    }
}


export const isPro = (display) => {
    const alertPro = `
		<div class="pro__alert__wrap" style="display: none;">
			<div class="pro__alert__card">
				<img src="../wp-content/plugins/embedpress/EmbedPress/Ends/Back/Settings/assets/img/alert.svg" alt=""/>
					<h2>Opps...</h2>
					<p>You need to upgrade to the <a href="https://wpdeveloper.com/in/upgrade-embedpress" target="_blank">Premium</a> Version to use this feature</p>
					<a href="#" class="button radius-10">Close</a>
			</div>
		</div>
		`;

    const dom = document.createElement('div');
    dom.innerHTML = alertPro;

    return dom;
}


export const saveSourceData = (clientId, url) => {
    const xhr = new XMLHttpRequest();

    xhr.open('POST', ajaxurl);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log('Request successful:', xhr.responseText);
        } else {
            console.error('Request failed:', xhr.statusText);
        }
    };

    xhr.onerror = function () {
        console.error('Request failed:', xhr.statusText);
    };

    const data = {
        action: 'save_source_name',
        source_name: getSourceName(url),
        block_id: clientId,
        source_url: url
    };

    const encodedData = Object.keys(data)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
        .join('&');

    xhr.send(encodedData);

};