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
        action: 'save_gutenberg_source_data',
        block_id: clientId,
        source_url: url
    };

    const encodedData = Object.keys(data)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
        .join('&');

    xhr.send(encodedData);

};

export const deleteSourceData = (clientId) => {
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
        action: 'delete_source_data',
        block_id: clientId,
    };

    const encodedData = Object.keys(data)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
        .join('&');

    xhr.send(encodedData);

};


export const removedBlockID = () => {
    const getBlockList = () => wp.data.select('core/block-editor').getBlocks();
    let previousBlockList = getBlockList();
    wp.data.subscribe(() => {
        const currentBlockList = getBlockList();
        const removedBlocks = previousBlockList.filter(block => !currentBlockList.includes(block));

        if (removedBlocks.length && (currentBlockList.length < previousBlockList.length)) {
            const removedBlockClientIDs = removedBlocks.map(block => block.attributes.clientId);
            console.log(`Blocks with IDs ${removedBlockClientIDs} were removed`);
            deleteSourceData(removedBlockClientIDs);

        }

        previousBlockList = currentBlockList;
    });
}