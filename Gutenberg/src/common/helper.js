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

export const passwordShowHide = (value) => {
    if (document.querySelector('.lock-content-pass-input span')) {
        const showEye = document.querySelector('.lock-content-pass-input .pass-show');
        const hideEye = document.querySelector('.lock-content-pass-input .pass-hide');

        if(value === 'show'){
            showEye.classList.remove('active');
            hideEye.classList.add('active');
            document.querySelector('.lock-content-pass-input input').setAttribute('type', 'text');
        }
        if(value === 'hide'){
            hideEye.classList.remove('active');
            showEye.classList.add('active');
            document.querySelector('.lock-content-pass-input input').setAttribute('type', 'password');
        }
    }
}

export const copiedMessage = () => {
    const passwordInput = document.querySelector(".lock-content-pass-input input");
    const tooltip = document.querySelector('.copy-tooltip');
    setTimeout(() => {
      tooltip.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      tooltip.classList.remove('show');  
      passwordInput.selectionStart = passwordInput.selectionEnd;
    }, 1000);
}

export const copyPassword = (inputRef) => {

   const passwordInput = inputRef.current;
   const tempInput = document.createElement('input');
   tempInput.type = 'text';
   tempInput.value = passwordInput.value;
   document.body.appendChild(tempInput);
   tempInput.select();
   document.execCommand('copy');
   
   passwordInput.select();
   document.body.removeChild(tempInput);

    setTimeout(() => {
        passwordInput.selectionStart = passwordInput.selectionEnd;
    }, 1000);

    copiedMessage();
}


