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

( function() {
		let a = <svg height="24" width="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 270 270">
			<circle cx="135" cy="135" r="135" fill="#5b4e96"/>
			<path  className="st1" fill="#fff" d="M65.8 65.8v26.7h7.7v-19h19v-7.7zM196.5 177.5v19h-19v7.7h26.7v-26.7zM199.4 100.7c-5.3-9.5-15-16-25.9-17.2-6.4-.7-12.8.3-18.6 3.1-.7.3-1.3.7-2 1-7.9 4.4-13.8 11.7-16.2 20.1v.1L118 160.9c-1.6 4.8-4.7 8.7-8.8 11-.4.2-.7.4-1.1.6-3.1 1.5-6.6 2-10 1.6-5.9-.7-11.1-4.1-13.9-9.3-2.4-4.3-2.9-9.2-1.6-13.9s4.5-8.7 8.8-11c.4-.2.7-.4 1.1-.6 3.1-1.5 6.5-2 10-1.6.2 0 .3.1.4.1L99 148.9c-.3.8.2 1.6.9 1.8l9.9 3.2c.8.3 1.5-.2 1.8-.9l8.6-24.3c.2-.6.2-1.3-.2-1.8s-.8-1-1.4-1.2l-9-2.6c-.2-.1-.4-.1-.6-.2l-.8-.3v.1c-1.3-.3-2.6-.6-3.8-.7-6.4-.7-12.9.3-18.6 3.1-.7.3-1.3.7-2 1-8 4.5-13.8 11.7-16.3 20.5s-1.4 18 3 25.9c5.3 9.5 15 16 25.9 17.2 6.4.7 12.8-.3 18.6-3.1.7-.3 1.3-.7 2-1 7.8-4.4 13.7-11.7 16.2-20.1v-.1l18.7-53.1.1-.1v-.1c2.1-5.4 4.8-8.7 8.7-10.9.4-.2.7-.4 1.1-.6 3.1-1.5 6.6-2 10-1.6 5.9.7 11.1 4.1 13.9 9.3 4.9 8.8 1.7 20-7.2 24.9-.4.2-.7.4-1.1.6-3.1 1.5-6.6 2-10.1 1.6-1-.1-2.1-.3-3.1-.6l-.1-.1-5.8-1.7c-.6-.2-1.3.2-1.5.8l-4.5 12.7c-.3.7.2 1.4.8 1.6l7.1 2c1.7.5 3.5.8 5.3 1 6.4.7 12.8-.3 18.6-3.1h.1c.7-.3 1.3-.7 2-1 16.3-9 22.3-29.9 13.2-46.3z"/>
		</svg>
		wp.blocks.updateCategory( 'embedpress', { icon: a } );
} )();
