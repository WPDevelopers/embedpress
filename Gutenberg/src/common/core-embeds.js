/**
 * Internal dependencies
 */
import { embedGoogleDocsIcon } from './icons';
/**
 * WordPress dependencies
 */
const { __ } =  wp.i18n;

export const common = [
	{
		name: 'embedpress-blocks/google',
		settings: {
			title: 'Google Docs',
			icon: embedGoogleDocsIcon,
			keywords: [ 'google' , 'docs' ],
			description: __( 'Embed a google document.' ),
		},
		patterns: [ /^http[s]?:\/\/((?:www\.)?docs\.google\.com(?:.*)?(?:document|presentation|spreadsheets|forms|drawings)\/[a-z0-9\/\?=_\-\.\,&%\$#\@\!\+]*)\/. +/i ]
	},
];

export const others = [

];
