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
import { embedPressIcon } from '../common/icons';
import { init as instafeedInit } from './InspectorControl/instafeed';
import { init as openseaInit } from './InspectorControl/opensea';
import { init as calendlyInit } from './InspectorControl/calendly';
import { init as youtubeInit } from './InspectorControl/youtube';
import { init as wistiaInit } from './InspectorControl/wistia';
import { init as vimeoInit } from './InspectorControl/vimeo';
import { init as spreakerInit } from './InspectorControl/spreaker';
import { init as googlePhotos } from './InspectorControl/google-photos';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
if (embedpressObj && embedpressObj.active_blocks && embedpressObj.active_blocks.embedpress) {

	/**
	 * Register: aa Gutenberg Block.
	 *
	 * Registers a new block provided a unique name and an object defining its
	 * behavior. Once registered, the block is made editor as an option to any
	 * editor interface where blocks are implemented.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/
	 * @param  {string}   name     Block name.
	 * @param  {Object}   settings Block settings.
	 * @return {?WPBlock}          The block, if it has been successfully
	 *                             registered; otherwise `undefined`.
	 */
	registerBlockType('embedpress/embedpress', {
		// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
		title: __('EmbedPress'), // Block title.
		icon: embedPressIcon, // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
		category: 'embedpress', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
		keywords: [
			'embedpress',
			'embed',
			'google',
			'youtube',
			'docs',
		],
		supports: {
			align: ["right", "left", "center"],
			default: 'center',
			lightBlockWrapper: true
		},
		attributes: {
			clientId: {
				type: 'string',
			},
			url: {
				type: 'string',
				default: ''
			},
			embedHTML: {
				type: 'string',
				default: ''
			},
			height: {
				type: 'string',
				default: embedpressObj.iframe_height || '600'
			},
			width: {
				type: 'string',
				default: embedpressObj.iframe_width || '600'
			},
			lockContent: {
				type: 'boolean',
				default: false
			},
			protectionType: {
				type: 'string',
				default: 'password'
			},
			userRole: {
				type: 'array',
				default: []
			},
			protectionMessage: {
				type: 'string',
				default: 'You do not have access to this content. Only users with the following roles can view it: [user_roles]'
			},
			contentPassword: {
				type: 'string',
				default: ''
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
			editingURL: {
				type: 'boolean',
				default: 0
			},
			fetching: {
				type: 'boolean',
				default: false
			},
			cannotEmbed: {
				type: 'boolean',
				default: false
			},
			interactive: {
				type: 'boolean',
				default: false
			},
			align: {
				type: 'string',
				default: 'center'
			},

			//YouTube Attributes
			ispagination: {
				type: 'boolean',
				default: true
			},
			ytChannelLayout: {
				type: 'string',
				default: 'gallery'
			},
			pagesize: {
				type: 'string',
				default: '6'
			},
			columns: {
				type: 'string',
				default: '3'
			},
			gapbetweenvideos: {
				type: 'number',
				default: 30
			},

			//NFT Attributes
			limit: {
				type: 'number',
				default: 20
			},
			itemperpage: {
				type: 'number',
				default: 9
			},
			loadmore: {
				type: 'boolean',
				default: false
			},
			loadmorelabel: {
				type: 'text',
				default: 'Load More'
			},
			orderby: {
				type: 'string',
				default: 'desc'
			},
			gapbetweenitem: {
				type: 'number',
				default: 30
			},

			layout: {
				type: 'string',
				default: 'ep-grid'
			},

			preset: {
				type: 'string',
				default: 'preset-default'
			},

			nftperrow: {
				type: 'number',
				default: 3
			},
			collectionname: {
				type: 'boolean',
				default: true
			},
			nftimage: {
				type: 'boolean',
				default: true
			},
			nfttitle: {
				type: 'boolean',
				default: true
			},
			nftcreator: {
				type: 'boolean',
				default: true
			},
			prefix_nftcreator: {
				type: 'string',
				default: 'Created By'
			},
			nftprice: {
				type: 'boolean',
				default: true
			},
			prefix_nftprice: {
				type: 'string',
				default: 'Current Price'
			},
			nftlastsale: {
				type: 'boolean',
				default: true
			},
			prefix_nftlastsale: {
				type: 'string',
				default: 'Last Sale'
			},
			nftbutton: {
				type: 'boolean',
				default: true
			},
			nftrank: {
				type: 'boolean',
				default: true
			},
			label_nftrank: {
				type: 'string',
				default: 'Rank'
			},
			nftdetails: {
				type: 'boolean',
				default: true
			},
			label_nftdetails: {
				type: 'string',
				default: 'Details'
			},
			label_nftbutton: {
				type: 'string',
				default: 'See Details'
			},
			alignment: {
				type: 'string',
				default: 'ep-item-center'
			},

			// Color and Typograpyh
			itemBGColor: {
				type: 'string',
			},
			collectionNameColor: {
				type: 'string',
			},

			collectionNameFZ: {
				type: 'number',
			},

			titleColor: {
				type: 'string',
			},

			titleFontsize: {
				type: 'number',
			},
			creatorColor: {
				type: 'string',
			},

			creatorFontsize: {
				type: 'number',
			},

			creatorLinkColor: {
				type: 'string',
			},

			creatorLinkFontsize: {
				type: 'number',
			},

			priceLabelColor: {
				type: 'string',
			},

			priceLabelFontsize: {
				type: 'number',
			},
			priceColor: {
				type: 'string',
			},

			priceFontsize: {
				type: 'number',
			},
			priceUSDColor: {
				type: 'string',
			},

			priceUSDFontsize: {
				type: 'number',
			},

			lastSaleLabelColor: {
				type: 'string',
			},

			lastSaleLabelFontsize: {
				type: 'number',
			},
			lastSaleColor: {
				type: 'string',
			},

			lastSaleFontsize: {
				type: 'number',
			},
			lastSaleUSDColor: {
				type: 'string',
			},

			lastSaleUSDFontsize: {
				type: 'number',
			},
			buttonTextColor: {
				type: 'string',
			},

			buttonBackgroundColor: {
				type: 'string',
			},

			buttonTextFontsize: {
				type: 'number',
			},
			loadmoreTextColor: {
				type: 'string',
			},

			loadmoreBackgroundColor: {
				type: 'string',
			},

			loadmoreTextFontsize: {
				type: 'number',
			},
			rankBtnColor: {
				type: 'string',
			},

			rankBtnBorderColor: {
				type: 'string',
			},
			rankBtnFZ: {
				type: 'number',
			},
			rankLabelColor: {
				type: 'string',
			},
			rankLabelFZ: {
				type: 'number',
			},
			detialTitleColor: {
				type: 'string',
			},
			detialTitleFZ: {
				type: 'number',
			},
			detailTextColor: {
				type: 'string',
			},
			detailTextLinkColor: {
				type: 'string',
			},
			detailTextFZ: {
				type: 'number',
			},
			//YouTube single video controls attribute
			videosize: {
				type: 'string',
				default: 'fixed',
			},
			starttime: {
				type: 'string',
			},
			endtime: {
				type: 'string',
			},
			autoplay: {
				type: 'boolean',
				default: false,
			},
			controls: {
				type: 'string',
			},
			fullscreen: {
				type: 'boolean',
				default: true,
			},
			videoannotations: {
				type: 'boolean',
				default: true,
			},
			progressbarcolor: {
				type: 'string',
				default: 'red'
			},
			closedcaptions: {
				type: 'boolean',
				default: true,
			},
			modestbranding: {
				type: 'string',
			},
			relatedvideos: {
				type: 'boolean',
				default: true,
			},

			//Wistia video controls attribute
			wstarttime: {
				type: 'string',
			},
			wautoplay: {
				type: 'boolean',
				default: true
			},
			scheme: {
				type: 'string',
			},
			captions: {
				type: 'boolean',
				default: true
			},
			playbutton: {
				type: 'boolean',
				default: true
			},
			smallplaybutton: {
				type: 'boolean',
				default: true
			},
			playbar: {
				type: 'boolean',
				default: true
			},
			resumable: {
				type: 'boolean',
				default: true
			},
			wistiafocus: {
				type: 'boolean',
				default: true
			},
			volumecontrol: {
				type: 'boolean',
				default: true
			},
			volume: {
				type: 'number',
				default: 100
			},
			rewind: {
				type: 'boolean',
				default: false
			},
			wfullscreen: {
				type: 'boolean',
				default: true
			},

			//Vimeo video controls attribute
			vstarttime: {
				type: 'string',
			},
			vautoplay: {
				type: 'boolean',
				default: false
			},
			vscheme: {
				type: 'string',
			},
			vtitle: {
				type: 'boolean',
				default: true
			},
			vauthor: {
				type: 'boolean',
				default: true
			},
			vavatar: {
				type: 'boolean',
				default: true
			},
			vloop: {
				type: 'boolean',
				default: false
			},
			vautopause: {
				type: 'boolean',
				default: false
			},
			vdnt: {
				type: 'boolean',
				default: false
			},

			// custom player attributes
			autoPause: {
				type: 'boolean',
				default: false
			},
			customPlayer: {
				type: 'boolean',
				default: false
			},
			customPlayer: {
				type: 'boolean',
				default: false
			},
			posterThumbnail: {
				type: 'string',
				default: ''
			},
			playerPreset: {
				type: 'string',
				default: 'preset-default'
			},

			playerColor: {
				type: 'string',
				default: '#5b4e96',
			},

			playerPip: {
				type: 'boolean',
				default: false,
			},
			playerRestart: {
				type: 'boolean',
				default: true,
			},
			playerRewind: {
				type: 'boolean',
				default: true,
			},
			playerFastForward: {
				type: 'boolean',
				default: true,
			},
			playerFastForward: {
				type: 'boolean',
				default: true,
			},
			playerTooltip: {
				type: 'boolean',
				default: true,
			},
			playerHideControls: {
				type: 'boolean',
				default: true,
			},
			playerDownload: {
				type: 'boolean',
				default: true,
			},

			pVolume: {
				type: 'number',
				default: 1,
			},
			playbackSpeed: {
				type: 'number',
				default: 1,
			},
			showProgress: {
				type: 'boolean',
				default: true,
			},
			showCurrentTime: {
				type: 'boolean',
				default: true,
			},
			showDuration: {
				type: 'boolean',
				default: true,
			},
			showMute: {
				type: 'boolean',
				default: true,
			},
			showVolume: {
				type: 'boolean',
				default: true,
			},
			showCaptions: {
				type: 'boolean',
				default: true,
			},
			showFullscreen: {
				type: 'boolean',
				default: true,
			},
			showPictureInPicture: {
				type: 'boolean',
				default: true,
			},
			showSettings: {
				type: 'boolean',
				default: true,
			},
			showPlaybackSpeed: {
				type: 'boolean',
				default: true,
			},
			showRestart: {
				type: 'boolean',
				default: true,
			},
			showSeek: {
				type: 'boolean',
				default: true,
			},
			showLoop: {
				type: 'boolean',
				default: true,
			},

			//Instagram Feed attributes

			instafeedFeedType: {
				type: 'string',
				default: 'user_account_type',
			},
			instafeedAccountType: {
				type: 'string',
				default: 'personal',
			},
			instafeedProfileImage: {
				type: 'boolean',
				default: true,
			},
			instafeedProfileImageUrl: {
				type: 'string',
				default: '',
			},
			instafeedFollowBtn: {
				type: 'boolean',
				default: true,
			},
			instafeedFollowBtnLabel: {
				type: 'string',
				default: 'Follow',
			},
			instafeedPostsCount: {
				type: 'boolean',
				default: true,
			},
			instafeedPostsCountText: {
				type: 'string',
				default: '[count] posts',
			},
			instafeedFollowersCount: {
				type: 'boolean',
				default: true,
			},
			instafeedFollowersCountText: {
				type: 'string',
				default: '[count] followers',
			},
			instafeedAccName: {
				type: 'boolean',
				default: true,
			},

			instaLayout: {
				type: 'string',
				default: 'insta-grid'
			},
			instafeedColumns: {
				type: 'string',
				default: '3'
			},
			instafeedColumnsGap: {
				type: 'string',
				default: '5'
			},
			instafeedPostsPerPage: {
				type: 'string',
				default: '12'
			},
			instafeedTab: {
				type: 'boolean',
				default: true,
			},
			instafeedLikesCount: {
				type: 'boolean',
				default: true,
			},
			instafeedCommentsCount: {
				type: 'boolean',
				default: true,
			},
			instafeedPopup: {
				type: 'boolean',
				default: true,
			},


			instafeedPopupFollowBtn: {
				type: 'boolean',
				default: true,
			},

			instafeedPopupFollowBtnLabel: {
				type: 'string',
				default: 'Follow',
			},
			instafeedLoadmore: {
				type: 'boolean',
				default: true,
			},
			instafeedLoadmoreLabel: {
				type: 'string',
				default: 'Load More',
			},

			slidesShow: {
				type: 'string',
				default: '4'
			},
			slidesScroll: {
				type: 'string',
				default: '4'
			},
			carouselAutoplay: {
				type: 'boolean',
				default: false
			},
			autoplaySpeed: {
				type: 'string',
				default: '3000'
			},
			transitionSpeed: {
				type: 'string',
				default: '1000'
			},
			carouselLoop: {
				type: 'boolean',
				default: true
			},
			carouselArrows: {
				type: 'boolean',
				default: true
			},
			carouselSpacing: {
				type: 'string',
				default: '0'
			},
			carouselDots: {
				type: 'boolean',
				default: false
			},

			// Calendly attributes
			cEmbedType: {
				type: 'string',
				default: 'inline'
			},
			calendlyData: {
				type: 'boolean',
				default: false
			},
			hideCookieBanner: {
				type: 'boolean',
				default: false
			},
			hideEventTypeDetails: {
				type: 'boolean',
				default: false
			},
			cBackgroundColor: {
				type: 'string',
				default: 'ffffff'
			},
			cTextColor: {
				type: 'string',
				default: '1A1A1A'
			},
			cButtonLinkColor: {
				type: 'string',
				default: '0000FF'
			},
			cPopupButtonText: {
				type: 'string',
				default: 'Schedule time with me'
			},
			cPopupButtonBGColor: {
				type: 'string',
				default: '0000FF'
			},
			cPopupButtonTextColor: {
				type: 'string',
				default: 'FFFFFF'
			},
			cPopupLinkText: {
				type: 'string',
				default: 'Schedule time with me'
			},

			//Spreaker attributes
			theme: {
				type: 'string',
				default: 'light'
			},
			color: {
				type: 'string',
				default: ''
			},
			coverImageUrl: {
				type: 'string',
				default: ''
			},
			playlist: {
				type: 'boolean',
				default: false
			},
			playlistContinuous: {
				type: 'boolean',
				default: false
			},
			playlistLoop: {
				type: 'boolean',
				default: false
			},
			playlistAutoupdate: {
				type: 'boolean',
				default: true
			},
			chaptersImage: {
				type: 'boolean',
				default: true
			},
			episodeImagePosition: {
				type: 'string',
				default: 'right'
			},
			hideLikes: {
				type: 'boolean',
				default: false
			},
			hideComments: {
				type: 'boolean',
				default: false
			},
			hideSharing: {
				type: 'boolean',
				default: false
			},
			hideLogo: {
				type: 'boolean',
				default: false
			},
			hideEpisodeDescription: {
				type: 'boolean',
				default: false
			},
			hidePlaylistDescriptions: {
				type: 'boolean',
				default: false
			},
			hidePlaylistImages: {
				type: 'boolean',
				default: false
			},
			hideDownload: {
				type: 'boolean',
				default: false
			},

			// Google photos attributes
			mode: {
				type: 'string',
				default: 'carousel'
			},
			imageWidth: {
				type: 'number',
				default: 800
			},
			imageHeight: {
				type: 'number',
				default: 600
			},
			playerAutoplay: {
				type: 'boolean',
				default: false
			},
			delay: {
				type: 'number',
				default: 5
			},
			repeat: {
				type: 'boolean',
				default: true
			},
			mediaitemsAspectRatio: {
				type: 'boolean',
				default: true
			},
			mediaitemsEnlarge: {
				type: 'boolean',
				default: false
			},
			mediaitemsStretch: {
				type: 'boolean',
				default: false
			},
			mediaitemsCover: {
				type: 'boolean',
				default: false
			},
			backgroundColor: {
				type: 'string',
				default: '#000000'
			},
			expiration: {
				type: 'number',
				default: 60
			},

			//Custom logo atributes
			customlogo: {
				type: 'string',
				default: ''
			},
			logoX: {
				type: 'number',
				default: 5
			},
			logoY: {
				type: 'number',
				default: 10
			},
			customlogoUrl: {
				type: 'string',
			},
			logoOpacity: {
				type: 'number',
				default: 0.6
			},

			//Ads Manage attributes
			adManager: {
				type: 'boolean',
				default: false
			},
			adSource: {
				type: 'string',
				default: 'video'
			},
			adContent: {
				type: 'object',
			},
			adFileUrl: {
				type: 'string',
				default: ''
			},
			adWidth: {
				type: 'string',
				default: '300'
			},
			adHeight: {
				type: 'string',
				default: '200'
			},

			adXPosition: {
				type: 'number',
				default: 25
			},
			adYPosition: {
				type: 'number',
				default: 10
			},

			adUrl: {
				type: 'string',
				default: ''
			},
			adStart: {
				type: 'string',
				default: '10'
			},
			adSkipButton: {
				type: 'boolean',
				default: true
			},
			adSkipButtonAfter: {
				type: 'string',
				default: '5'
			},

		},
		/**
		 * The edit function describes the structure of your block in the context of the editor.
		 * This represents what the editor will render when the block is used.
		 *
		 * The "edit" property must be a valid function.
		 *
		 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
		 */
		edit,

		/**
		 * The save function defines the way in which the different attributes should be combined
		 * into the final markup, which is then serialized by Gutenberg into post_content.
		 *
		 * The "save" property must be specified and must be a valid function.
		 *
		 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
		 */
		save: () => null,
	});

	instafeedInit();
	youtubeInit();
	openseaInit();
	wistiaInit();
	vimeoInit();
	calendlyInit();
	spreakerInit();
	googlePhotos();

}
