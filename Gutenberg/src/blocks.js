/**
 * Gutenberg Blocks
 *
 * All blocks related JavaScript files should be imported here.
 * You can create a new block folder in this dir and include code
 * for that block here as well.
 *
 * All blocks should be included here since this is the file that
 * Webpack is compiling as the input file.
 */

import './google-docs/index.js';
import './google-slides/index.js';
import './google-sheets/index.js';
import './google-forms/index.js';
import './google-drawings/index.js';
import './google-maps/index.js';
import './twitch/index.js';
import './wistia/index.js';
import './youtube/index.js';
import './document/index.js';

( function() {
		let a = <svg width="33" height="20" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
					 viewBox="0 0 270 270">
					<g>
						<polygon className="st0" fill="#9595C1" points="0,0 0,52 15,52 15,15 52,15 52,0 	"/>
						<polygon className="st0" fill="#9595C1" points="255,218 255,255 218,255 218,270 270,270 270,218 	"/>
						<path  fill="#5B4E96" d="M260.7,68.1c-10.4-18.6-29.3-31.2-50.6-33.6c-12.4-1.4-25,0.6-36.3,6c-1.3,0.6-2.6,1.3-3.9,2
							C154.5,51,143,65.3,138.3,81.7l0,0.1l-36.4,103.8c-3.1,9.4-9.1,17-17.1,21.4c-0.7,0.4-1.4,0.7-2.1,1.1c-6.1,2.9-12.8,4-19.5,3.2
							c-11.5-1.3-21.6-8.1-27.2-18.1c-4.6-8.3-5.7-18-3.1-27.2c2.6-9.2,8.7-16.9,17.1-21.5c0.7-0.4,1.4-0.8,2.1-1.1
							c6.1-2.9,12.7-4,19.6-3.2c0.3,0,0.5,0.1,0.8,0.1L64.9,162c-0.5,1.5,0.3,3.1,1.8,3.6l19.4,6.3c1.5,0.5,3-0.3,3.5-1.7l16.7-47.4
							c0.4-1.2,0.3-2.5-0.3-3.6c-0.6-1.1-1.6-2-2.8-2.4l-17.6-5.1c-0.4-0.1-0.8-0.2-1.2-0.3l-1.6-0.5l0,0.1c-2.5-0.6-5-1.1-7.5-1.3
							c-12.5-1.4-25.1,0.6-36.4,6c-1.3,0.6-2.6,1.3-3.9,2c-15.6,8.7-27,22.9-31.9,40.1c-4.9,17.1-2.8,35.1,5.8,50.5
							c10.4,18.6,29.3,31.2,50.6,33.6c12.4,1.4,25-0.6,36.3-6c1.3-0.6,2.6-1.3,3.9-2c15.3-8.5,26.8-22.8,31.6-39.2l0-0.1L167.8,91
							l0.1-0.2l0-0.1c4.1-10.5,9.3-17,17-21.3c0.7-0.4,1.4-0.7,2.1-1.1c6.1-2.9,12.8-4,19.5-3.2c11.5,1.3,21.6,8.1,27.2,18.1
							c9.6,17.2,3.3,39.1-14,48.7c-0.7,0.4-1.4,0.7-2.1,1.1c-6.1,2.9-12.8,4-19.7,3.2c-2-0.2-4.1-0.6-6.1-1.2l-0.2-0.1l-11.3-3.4
							c-1.2-0.4-2.5,0.3-2.9,1.5l-8.8,24.8c-0.5,1.3,0.3,2.7,1.6,3.1l13.9,4c3.4,0.9,6.8,1.6,10.3,2c12.4,1.4,25-0.6,36.3-6l0.1,0
							c1.3-0.6,2.6-1.3,3.9-2C266.8,140.8,278.5,100.1,260.7,68.1z"/>
					</g>
				</svg>
		wp.blocks.updateCategory( 'embedpress', { icon: a } );
} )();
