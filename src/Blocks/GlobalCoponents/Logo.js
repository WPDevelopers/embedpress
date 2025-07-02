/*
INIT: ensure Babel/Eslint/Flow is configured for ES Class Fields & Static Properties
JSX USAGE: <Logo id={id} />
*/
const {Fragment} = wp.element;

function Logo(props) {
		let d = embedpressGutenbergData.document_cta;
		var style = '';
		var cta = '';
		if(embedpressGutenbergData.embedpress_pro && d && d.logo_url) {
			var url = d.cta_url ? d.cta_url : null;
			var x = d.logo_xpos ? d.logo_xpos + '%' : '10%';
			var y = d.logo_ypos ? d.logo_ypos + '%' : '10%';
			var opacity = d.logo_opacity ? d.logo_opacity / 100 : '10%';
			var cssClass = '.ep-doc-' + props.id;
			 style  = `
            ${cssClass}{
                text-align: left;
                position: relative;
            }
           ${cssClass} .watermark {
           		display:inline-block;
                border: 0;
                position: absolute;
                bottom: ${y};
                right:  ${x};
                max-width: 150px;
                max-height: 75px;
                opacity: ${opacity};
                z-index: 5;
                -o-transition: opacity 0.5s ease-in-out;
                -moz-transition: opacity 0.5s ease-in-out;
                -webkit-transition: opacity 0.5s ease-in-out;
                transition: opacity 0.5s ease-in-out;
            }
            ${cssClass} .watermark:hover {
					   opacity: 1;
				   }
		`;
			if (url && '' !== url){
				cta += `<a href=${url}>`;
			}
			cta += `<img class="watermark" alt="" src="${d.logo_url}"/>`;

			if (url && '' !== url){
				cta +='</a>';
			}
			return (
				<Fragment>
					<style dangerouslySetInnerHTML={{__html: style}}></style>
					<div dangerouslySetInnerHTML={{__html: cta}}></div>

				</Fragment>
			)
		}else{
			return '';
		}


}

export default Logo
