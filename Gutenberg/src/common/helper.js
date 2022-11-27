
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

