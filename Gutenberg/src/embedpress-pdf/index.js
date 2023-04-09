/**
 * BLOCK: embedpress-blocks
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './style.scss';
import './editor.scss';
import edit from './edit';
import {PdfIcon} from '../common/icons';


const {__} = wp.i18n; // Import __() from wp.i18n
const {registerBlockType} = wp.blocks; // Import registerBlockType() from wp.blocks

if (embedpressObj && embedpressObj.active_blocks && embedpressObj.active_blocks['embedpress-pdf']) {
	registerBlockType('embedpress/embedpress-pdf', {
		// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
		title: __('EmbedPress PDF'), // Block title.
		icon: PdfIcon, // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
		category: 'embedpress', // Block category — Group blocks together based on common traits E.g. common, formatting, layout Widgets, embed.
		keywords: [
			__('embedpress'),
			__('pdf'),
			__('doc'),
			__('document'),
		],
		supports: {
			align: ["left", "center", "right"],
			default: ''
		},
		attributes: {
			id: {
				type: "string"
			},
			clientId: {
				type: 'string',
			},
			lockContent: {
				type: 'boolean',
				default: false
			},
			contentPassword: {
				type: 'string',
				default: 'igNeARnE'
			},
			lockHeading: {
				type: 'string',
				default: 'Content Locked'
			},
			lockSubHeading: {
				type: 'string',
				default: 'Content is locked and requires password to access it.'
			},
			lockErrorMessage: {
				type: 'string',
				default: 'Oops, that wasn\'t the right password. Try again.'
			},
			passwordPlaceholder: {
				type: 'string',
				default: 'Password'
			},
			submitButtonText: {
				type: 'string',
				default: 'Unlock'
			},
			submitUnlockingText: {
				type: 'string',
				default: 'Unlocking'
			},
			enableFooterMessage: {
				type: 'boolean',
				default: false
			},
			footerMessage: {
				type: 'string',
				default: 'In case you don\'t have the password, kindly reach out to content owner or administrator to request access.'
			},
			
			contentShare: {
				type: 'boolean',
				default: false
			},
			sharePosition: {
				type: 'string',
				default: 'right'
			},
			customTitle: {
				type: 'string',
				default: ''
			},
			customDescription: {
				type: 'string',
				default: ''
			},
			customThumbnail: {
				type: 'string',
				default: ''
			},
			href: {
				type: "string"
			},
			powered_by: {
				type: "boolean",
				default: true,
			},

			presentation: {
				type: "boolean",
				default: true,
			},
			themeMode: {
				type: "string",
				default: 'default',
			},
			customColor: {
				type: "string",
				default: '#403A81',
			},
			position: {
				type: "string",
				default: 'top',
			},
			
			download: {
				type: "boolean",
				default: true,
			},
			open: {
				type: "boolean",
				default: false,
			},
			copy_text: {
				type: "boolean",
				default: true,
			},
			add_text: {
				type: "boolean",
				default: true,
			},
			draw: {
				type: "boolean",
				default: true,
			},
			toolbar: {
				type: "boolean",
				default: true,
			},
			doc_details: {
				type: "boolean",
				default: true,
			},
			doc_rotation: {
				type: 'boolean',
				default: true,
			},
			unitoption: {
				type: 'string',
				default: 'px',
			},
			
			width: {
				type: 'number',
				default: 600,
			},
			height: {
				type: 'number',
				default: 450,
			},
			fileName: {
				type: "string",
			},
			mime: {
				type: "string",
			}
		},
		edit,
		save: () => null,


	});
}
