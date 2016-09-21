/**
 * @package     EmbedPress
 * @author      PressShack <help@pressshack.com>
 * @copyright   Copyright (C) 2016 Open Source Training, LLC. All rights reserved.
 * @license     GPLv2 or later
 * @since       1.0
 */

(function(window, $, String, $data) {
    "use strict";

    $(window.document).ready(function() {
        String.prototype.capitalizeFirstLetter = function() {
            return this.charAt(0).toUpperCase() + this.slice(1);
        }

        String.prototype.isValidUrl = function() {
            var rule = /^(https?|ftp|embedpresss?):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;

            return rule.test(this.toString());
        }

        String.prototype.hasShortcode = function(shortcode) {
            var shortcodeRule = new RegExp('\\['+ shortcode +'(?:\\]|.+?\\])', "ig");
            return !!this.toString().match(shortcodeRule);
        }

        String.prototype.stripShortcode = function(shortcode) {
            var stripRule = new RegExp('(\\['+ shortcode +'(?:\\]|.+?\\])|\\[\\/'+ shortcode +'\\])', "ig");
            return this.toString().replace(stripRule, "");
        }

        String.prototype.setShortcodeAttribute = function(attr, value, shortcode, replaceInsteadOfMerge) {
            replaceInsteadOfMerge = typeof replaceInsteadOfMerge === "undefined" ? false : replaceInsteadOfMerge;
            var subject = this.toString();

            if (subject.hasShortcode(shortcode)) {
                var attributes = subject.getShortcodeAttributes(shortcode);

                if (attributes.hasOwnProperty(attr)) {
                    if (replaceInsteadOfMerge) {
                        attributes[attr] = value;
                    } else {
                        attributes[attr] += " " + value;
                    }
                } else {
                    attributes[attr] = value;
                }

                if (!!Object.keys(attributes).length) {
                    var parsedAttributes = [];
                    for (var attr in attributes) {
                        parsedAttributes.push(attr + '="' + attributes[attr] + '"');
                    }

                    subject = '[' + shortcode + ' ' + parsedAttributes.join(" ") + ']' + subject.stripShortcode(shortcode) + '[/' + shortcode + ']';
                } else {
                    subject = '[' + shortcode + ']' + subject.stripShortcode(shortcode) + '[/' + shortcode + ']';
                }

                return subject;
            } else {
                return subject;
            }
        }

        String.prototype.getShortcodeAttributes = function(shortcode) {
            var subject = this.toString();
            if (subject.hasShortcode(shortcode)) {
                var attributes = {};
                var propertiesString = (new RegExp(/\[embed\s*(.*?)\]/ig)).exec(subject)[1]; // Separate all shortcode attributes from the rest of the string
                if (propertiesString.length > 0) {
                    var extractAttributesRule = new RegExp(/(\!?\w+-?\w*)(?:="(.+?)")?/ig); // Extract attributes and their values
                    var match;
                    while (match = extractAttributesRule.exec(propertiesString)) {
                        var attrName = match[1];
                        var attrValue;
                        if (match[2] === undefined) {
                            // Prevent `class` property being empty an treated as a boolean param
                            if (attrName.toLowerCase() !== "class") {
                                if (attrName.indexOf('!') === 0) {
                                    attrName = attrName.replace('!', "");
                                    attrValue = "false";
                                } else {
                                    attrValue = "true";
                                }

                                attributes[attrName] = attrValue;
                            }
                        } else {
                            attrValue = match[2];
                            if (attrValue.isBoolean()) {
                                attrValue = attrValue.isFalse() ? "false" : "true";
                            }

                            attributes[attrName] = attrValue;
                        }
                    }
                    match = extractAttributesRule = null;
                }
                propertiesString = null;

                return attributes;
            } else {
                return {};
            }
        }

        String.prototype.isBoolean = function() {
            var subject = this.toString().trim().toLowerCase();

            return subject.isTrue(false) || subject.isFalse();
        };

        String.prototype.isTrue = function(defaultValue) {
            var subject = this.toString().trim().toLowerCase();
            defaultValue = typeof defaultValue === undefined ? true : defaultValue;

            switch (subject) {
                case "":
                    defaultValue += "";
                    return !defaultValue.isFalse();
                case "1":
                case "true":
                case "on":
                case "yes":
                case "y":
                    return true;
                default:
                    return false;
            }
        };

        String.prototype.isFalse = function() {
            var subject = this.toString().trim().toLowerCase();

            switch (subject) {
                case "0":
                case "false":
                case "off":
                case "no":
                case "n":
                case "nil":
                case "null":
                    return true;
                default:
                    return false;
            }
        };

        if (!$data.displayPreviewBox.length || $data.displayPreviewBox.isFalse()) {
            return;
        }

        var SHORTCODE_REGEXP = new RegExp('\\[\/?'+ $data.EMBEDPRESS_SHORTCODE +'\\]', "gi");

        var EmbedPressPreview = function() {
            var self = this;

            var PLG_SYSTEM_ASSETS_CSS_PATH = $data.EMBEDPRESS_URL_ASSETS +"css";
            var PLG_CONTENT_ASSETS_CSS_PATH = PLG_SYSTEM_ASSETS_CSS_PATH;

            /**
             * The default params
             *
             * @type Object
             */
            self.params = {
                juriRoot: '',
                versionUID: '0'
            };

            /**
             * True, if user agent is iOS
             * @type Boolean True, if is iOS
             */
            self.iOS = /iPad|iPod|iPhone/.test(window.navigator.userAgent);

            /**
             * The active wrapper, activated by the mouse enter event
             * @type Element
             */
            self.activeWrapper = null;

            self.activeWrapperForModal = null;

            /**
             * The active controller panel
             * @type Element
             */
            self.activeControllerPanel = null;

            /**
             * Init the plugin
             *
             * @param  object params Override the plugin's params
             * @return void
             */
            self.init = function (params) {
                $.extend(self.params, params);

                // Fix iOS doesn't firing click events on 'standard' elements
                if (self.iOS) {
                    $(window.document.body).css('cursor', 'pointer');
                }

                $(self.onReady);
            };

            self.addEvent = function(event, element, callback) {
                if (typeof element.on !== 'undefined') {
                    element.on(event, callback);
                } else {
                    if (element['on' + event.capitalizeFirstLetter()]) {
                        element['on' + event.capitalizeFirstLetter()].add(callback);
                    }
                }
            };

            self.isEmpty = function(list) {
                return list.length === 0;
            };

            self.isDefined = function(attribute) {
                return (typeof attribute !== 'undefined') && (attribute !== null);
            }

            self.makeId = function() {
                var text = "";
                var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

                for( var i=0; i < 5; i++ )
                    text += possible.charAt(Math.floor(Math.random() * possible.length));

                return text;
            };

            self.loadAsyncDynamicJsCodeFromElement = function(subject, wrapper)
            {
                subject = $(subject);
                if (subject.prop('tagName').toLowerCase() === "script") {
                    var scriptSrc = subject.attr('src') || null;
                    if (!scriptSrc) {
                        self.addScriptDeclaration(wrapper, subject.html());
                    } else {
                        self.addScript(scriptSrc, null, wrapper);
                    }
                } else {
                    var innerScriptsList = $('script', subject);
                    if (innerScriptsList.length > 0) {
                        $.each(innerScriptsList, function(innerScriptIndex, innerScript) {
                            self.loadAsyncDynamicJsCodeFromElement(innerScript, wrapper);
                        });
                    }
                }
            }

            /**
             * Method executed on the document ready event
             *
             * @return void
             */
            self.onReady = function() {
                if (self.tinymceIsAvailable()) {
                    // Wait until the editor is available
                    var interval = window.setInterval(
                        function() {

                            // @todo: Support multiple editors
                            self.editor = self.getEditor();

                            if (self.editor !== null) {
                                window.clearInterval(interval);
                                interval = null;

                                self.onFindEditor();
                            }
                        },
                        200
                    );
                }
            };

            /**
             * Detects if tinymce object is available
             * @return Boolean True, if available
             */
            self.tinymceIsAvailable = function() {
                return typeof window.tinymce === 'object' || typeof window.tinyMCE === "object";
            }

            /**
             * Returns true if the controller panel is active
             * @return Boolean True, if the controller panel is active
             */
            self.controllerPanelIsActive = function() {
                return typeof self.activeControllerPanel !== 'undefined' && self.activeControllerPanel !== null;
            };

            /**
             * Returns the editor
             * @return Object The editor
             */
            self.getEditor = function() {
                if (window.tinymce.editors.length === 0) {
                    return null;
                }

                return window.tinymce.activeEditor;
            };

            /**
             * Parses the content, sending it to the component which will
             * look for urls to be parsed into embed codes
             *
             * @param  string   content   The content
             * @param  function onsuccess The callback called on success
             * @return void
             */
            self.getParsedContent = function(content, onsuccess) {
                // Get the parsed content
                $.ajax({
                    type: 'POST',
                    url: "admin-ajax.php",
                    data: {
                        action: "embedpress_do_ajax_request",
                        subject: content
                    },
                    success: onsuccess,
                    dataType: 'json',
                    async: true
                });
            };

            self.addStylesheet = function(url) {
                var head = self.editor.getDoc().getElementsByTagName('head')[0];

                var $style = $('<link rel="stylesheet" type="text/css" href="' + url + '">');
                $style.appendTo(head);
            }

            self.convertURLSchemeToPattern = function(scheme) {
                var prefix = '(.*)((?:http|embedpress)s?:\\/\\/(?:www\\.)?',
                    suffix = '[\\/]?)(.*)',
                    pattern;

                scheme = scheme.replace(/\*/g, '[a-zA-Z0-9=&_\\-\\?\\.\\/!\\+%:@,#]+');
                scheme = scheme.replace(/\./g, '\\.');
                scheme = scheme.replace(/\//g, '\\/');

                return prefix + scheme + suffix;
            };

            self.getProvidersURLPatterns = function() {
                // @todo: Add option to disable/enable the providers
                var urlSchemes = [
                        // PollDaddy
                        '*.polldaddy.com/s/*',
                        'polldaddy.com/poll/*',
                        'polldaddy.com/ratings/*',

                        // VideoPress
                        'videopress.com/v/*',

                        // Tumblr
                        '*.tumblr.com/post/*',

                        // SmugMug
                        'smugmug.com/*',

                        // SlideShare
                        'slideshare.net/*',

                        // Reddit
                        'reddit.com/r/[^/]+/comments/*',

                        // Photobucket
                        'i*.photobucket.com/albums/*',
                        'gi*.photobucket.com/groups/*',

                        // Cloudup
                        'cloudup.com/*',

                        // Imgur
                        'imgur.com/*',
                        'i.imgur.com/*',

                        // YouTube (http://www.youtube.com/)
                        'youtube.com/watch\\?*',

                        // IFTTT (http://www.ifttt.com/)
                        'ifttt.com/recipes/*',

                        // Flickr (http://www.flickr.com/)
                        'flickr.com/photos/*/*',
                        'flic.kr/p/*',

                        // Viddler (http://www.viddler.com/)
                        'viddler.com/v/*',

                        // Hulu (http://www.hulu.com/)
                        'hulu.com/watch/*',

                        // Vimeo (http://vimeo.com/)
                        'vimeo.com/*',
                        'vimeo.com/groups/*/videos/*',

                        // CollegeHumor (http://www.collegehumor.com/)
                        'collegehumor.com/video/*',

                        // Deviantart.com (http://www.deviantart.com)
                        '*.deviantart.com/art/*',
                        '*.deviantart.com/*#/d*',
                        'fav.me/*',
                        'sta.sh/*',

                        // SlideShare (http://www.slideshare.net/)
                        'slideshare.net/*/*',
                        'fr.slideshare.net/*/*',
                        'de.slideshare.net/*/*',
                        'es.slideshare.net/*/*',
                        'pt.slideshare.net/*/*',

                        // chirbit.com (http://www.chirbit.com/)
                        'chirb.it/*',

                        // nfb.ca (http://www.nfb.ca/)
                        '*.nfb.ca/film/*',

                        // Scribd (http://www.scribd.com/)
                        'scribd.com/doc/*',

                        // Dotsub (http://dotsub.com/)
                        'dotsub.com/view/*',

                        // Animoto (http://animoto.com/)
                        'animoto.com/play/*',

                        // Rdio (http://rdio.com/)
                        '*.rdio.com/artist/*',
                        '*.rdio.com/people/*',

                        // MixCloud (http://mixcloud.com/)
                        'mixcloud.com/*/*/',

                        // FunnyOrDie (http://www.funnyordie.com/)
                        'funnyordie.com/videos/*',

                        // Ted (http://ted.com)
                        'ted.com/talks/*',

                        // Sapo Videos (http://videos.sapo.pt)
                        'videos.sapo.pt/*',

                        // Official FM (http://official.fm)
                        'official.fm/tracks/*',
                        'official.fm/playlists/*',

                        // HuffDuffer (http://huffduffer.com)
                        'huffduffer.com/*/*',

                        // Shoudio (http://shoudio.com)
                        'shoudio.com/*',
                        'shoud.io/*',

                        // Moby Picture (http://www.mobypicture.com)
                        'mobypicture.com/user/*/view/*',
                        'moby.to/*',

                        // 23HQ (http://www.23hq.com)
                        '23hq.com/*/photo/*',

                        // Cacoo (https://cacoo.com)
                        'cacoo.com/diagrams/*',

                        // Dipity (http://www.dipity.com)
                        'dipity.com/*/*/',

                        // Roomshare (http://roomshare.jp)
                        'roomshare.jp/post/*',
                        'roomshare.jp/en/post/*',

                        // Dailymotion (http://www.dailymotion.com)
                        'dailymotion.com/video/*',

                        // Crowd Ranking (http://crowdranking.com)
                        'crowdranking.com/*/*',

                        // CircuitLab (https://www.circuitlab.com/)
                        'circuitlab.com/circuit/*',

                        // Coub (http://coub.com/)
                        'coub.com/view/*',
                        'coub.com/embed/*',

                        // SpeakerDeck (https://speakerdeck.com)
                        'speakerdeck.com/*/*',

                        // Instagram (https://instagram.com)
                        'instagram.com/p/*',
                        'instagr.am/p/*',

                        // SoundCloud (http://soundcloud.com/)
                        'soundcloud.com/*',

                        // On Aol (http://on.aol.com/)
                        'on.aol.com/video/*',

                        // Kickstarter (http://www.kickstarter.com)
                        'kickstarter.com/projects/*',

                        // Ustream (http://www.ustream.tv)
                        '*.ustream.tv/*',
                        '*.ustream.com/*',

                        // Daily Mile (http://www.dailymile.com)
                        'dailymile.com/people/*/entries/*',

                        // Sketchfab (http://sketchfab.com)
                        'sketchfab.com/models/*',
                        'sketchfab.com/*/folders/*',

                        // Meetup (http://www.meetup.com)
                        'meetup.com/*',
                        'meetu.ps/*',

                        // AudioSnaps (http://audiosnaps.com)
                        'audiosnaps.com/k/*',

                        // RapidEngage (https://rapidengage.com)
                        'rapidengage.com/s/*',

                        // Getty Images (http://www.gettyimages.com/)
                        'gty.im/*',

                        // amCharts Live Editor (http://live.amcharts.com/)
                        'live.amcharts.com/*',

                        // Infogram (https://infogr.am/)
                        'infogr.am/*',

                        // ChartBlocks (http://www.chartblocks.com/)
                        'public.chartblocks.com/c/*',

                        // ReleaseWire (http://www.releasewire.com/)
                        'rwire.com/*',

                        // ShortNote (https://www.shortnote.jp/)
                        'shortnote.jp/view/notes/*',

                        // EgliseInfo (http://egliseinfo.catholique.fr/)
                        'egliseinfo.catholique.fr/*',

                        // Silk (http://www.silk.co/)
                        '*.silk.co/explore/*',
                        '*.silk.co/s/embed/*',

                        // Twitter
                        'twitter.com/*/status/*',

                        // http://bambuser.com
                        'bambuser.com/v/*',

                        // https://clyp.it
                        'clyp.it/*',

                        // http://www.edocr.com
                        'edocr.com/doc/*',

                        // https://gist.github.com
                        'gist.github.com/*',

                        // http://issuu.com
                         'issuu.com/*',

                        // https://portfolium.com
                        'portfolium.com/*',

                        // https://www.reverbnation.com
                        'reverbnation.com/*',

                        // http://rutube.ru
                        'rutube.ru/video/*',

                        // https://spotify.com/
                        'open.spotify.com/*',

                        // http://www.videojug.com
                        'videojug.com/*',

                        // https://vine.com
                        'vine.co/*',

                        // Facebook
                        'facebook.com/*',

                        // Google Shortened Url
                        'goo.gl/*',

                        // Google Maps
                        'google.com/*',
                        'google.com.*/*',
                        'maps.google.com/*',

                        // Google Docs
                        'docs.google.com/presentation/*',
                        'docs.google.com/document/*',
                        'docs.google.com/spreadsheets/*',
                        'docs.google.com/forms/*',
                        'docs.google.com/drawings/*'
                    ],
                    patterns = [];

                self.each(urlSchemes, function convertEachURLSchemesToPattern(scheme) {
                    patterns.push(self.convertURLSchemeToPattern(scheme));
                });

                return patterns;
            };

            self.addScript = function(source, callback, wrapper) {
                var doc = self.editor.getDoc();

                if (typeof wrapper === 'undefined' || !wrapper) {
                    wrapper = $(doc.getElementsByTagName('head')[0]);
                }

                var $script = $(doc.createElement('script'));
                $script.attr('async', 1);

                if (typeof callback === 'function') {
                    $script.ready(callback);
                }

                $script.attr('src', source);

                wrapper.append($script);
            };

            self.addScriptDeclaration = function(wrapper, declaration) {
                var doc = self.editor.getDoc(),
                    $script = $(doc.createElement('script'));

                $(wrapper).append($script);

                $script.text(declaration);
            };

            self.addURLsPlaceholder = function(node, url, rawUrl) {
                var uid = self.makeId();

                var wrapperClasses = ["embedpress_wrapper", "embedpress_placeholder"];

                var shortcodeAttributes = node.value.getShortcodeAttributes($data.EMBEDPRESS_SHORTCODE);
                var customAttributes = shortcodeAttributes;

                var customClasses = "";
                if (!!Object.keys(shortcodeAttributes).length) {
                    var specialAttributes = ["class", "href", "data-href"];
                    // Iterates over each attribute of shortcodeAttributes to add the prefix "data-" if missing
                    var dataPrefix = "data-";
                    var prefixedShortcodeAttributes = [];
                    for (var attr in shortcodeAttributes) {
                        if (specialAttributes.indexOf(attr) === -1) {
                            if (attr.indexOf(dataPrefix) !== 0) {
                                prefixedShortcodeAttributes[dataPrefix + attr] = shortcodeAttributes[attr];
                            } else {
                                prefixedShortcodeAttributes[attr] = shortcodeAttributes[attr];
                            }
                        } else {
                            attr = attr.replace(dataPrefix, "");
                            if (attr === "class") {
                                wrapperClasses.push(shortcodeAttributes[attr]);
                            }
                        }
                    }

                    shortcodeAttributes = prefixedShortcodeAttributes;
                    prefixedShortcodeAttributes = dataPrefix = null;
                }

                if (("data-width" in shortcodeAttributes || "data-height" in shortcodeAttributes) && "data-responsive" in shortcodeAttributes) {
                    shortcodeAttributes['data-responsive'] = "false";
                }

                var wrapper = new self.Node('div', 1);
                var wrapperSettings = {
                    'class': Array.from(new Set(wrapperClasses)).join(" "),
                    'data-url': url,
                    'data-raw-url': rawUrl,
                    'data-uid': uid,
                    'id': 'embedpress_wrapper_' + uid,
                    'data-loading-text': 'Loading embed...'
                };

                wrapperSettings = $.extend({}, wrapperSettings, shortcodeAttributes);

                wrapperSettings.class += " is-loading";

                wrapper.attr(wrapperSettings);

                var panel = new self.Node('div', 1);
                panel.attr({
                    'id': 'embedpress_controller_panel_' + uid,
                    'class': 'embedpress_controller_panel embedpress_ignore_mouseout hidden'
                });
                wrapper.append(panel);

                function createGhostNode(htmlTag, content) {
                    htmlTag = htmlTag || "span";
                    content = content || "&nbsp;";

                    var ghostNode = new self.Node(htmlTag, 1);
                    ghostNode.attr({
                        'class': "hidden"
                    });

                    var ghostText = new self.Node('#text', 3);
                    ghostText.value = content;
                    ghostNode.append(ghostText);

                    return ghostNode;
                }

                var editButton = new self.Node('div', 1);
                editButton.attr({
                    'id': 'embedpress_button_edit_' + uid,
                    'class': 'embedpress_ignore_mouseout embedpress_controller_button'
                });
                var editButtonIcon = new self.Node('div', 1);
                editButtonIcon.attr({
                    'class': 'embedpress-icon-pencil embedpress_ignore_mouseout'
                });
                editButtonIcon.append(createGhostNode());
                editButton.append(editButtonIcon);
                panel.append(editButton);

                var removeButton = new self.Node('div', 1);
                removeButton.attr({
                    'id': 'embedpress_button_remove_' + uid,
                    'class': 'embedpress_ignore_mouseout embedpress_controller_button'
                });
                var removeButtonIcon = new self.Node('div', 1);
                removeButtonIcon.attr({
                    'class': 'embedpress-icon-x embedpress_ignore_mouseout'
                });
                removeButtonIcon.append(createGhostNode());
                removeButton.append(removeButtonIcon);
                panel.append(removeButton);

                node.replace(wrapper);

                // Trigger the timeout which will load the content
                window.setTimeout(function() {
                    self.parseContentAsync(uid, url, customAttributes);
                }, 800);

                return wrapper;
            };

            self.parseContentAsync = function(uid, url, customAttributes) {
                customAttributes = typeof customAttributes === "undefined" ? {} : customAttributes;

                url = self.decodeEmbedURLSpecialChars(url, true, customAttributes);

                // Get the parsed embed code from the EmbedPress plugin
                self.getParsedContent(url, function getParsedContentCallback(result) {
                    result.data.content = result.data.content.stripShortcode($data.EMBEDPRESS_SHORTCODE);

                    var $wrapper = $(self.getElementInContentById('embedpress_wrapper_' + uid));

                    $wrapper.removeClass('is-loading');

                    // Parse as DOM element
                    var $content;
                    try {
                        $content = $(result.data.content);
                    } catch(err) {
                        // Fallback to a div, if the result is not a html markup, e.g. a url
                        $content = $('<div>');
                        $content.html(result.data.content);
                    }

                    if (!$('iframe', $content).length) {
                        var contentWrapper = $($content).clone();
                        contentWrapper.html('');

                        var dom = self.editor.dom;

                        $wrapper.removeClass('embedpress_placeholder');

                        $wrapper.append(contentWrapper);

                        setTimeout(function() {
                            self.editor.undoManager.transact(function() {
                                var iframe = self.editor.getDoc().createElement('iframe');
                                iframe.src = tinymce.Env.ie ? 'javascript:""' : '';
                                iframe.frameBorder = '0';
                                iframe.allowTransparency = 'true';
                                iframe.scrolling = 'no';
                                iframe.class = "wpview-sandbox";
                                iframe.style.width = (customAttributes.width ? customAttributes.width +'px' : '100%');

                                dom.add(contentWrapper, iframe);
                                var iframeWindow = iframe.contentWindow;
                                // Content failed to load.
                                if (!iframeWindow) {
                                    return;
                                }

                                var iframeDoc = iframeWindow.document;

                                $(iframe).load(function() {
                                    if (customAttributes.height) {
                                        iframe.height = customAttributes.height;
                                        iframe.style.height = customAttributes.height +'px';
                                    } else {
                                        iframe.height = iframeDoc.body.scrollHeight;
                                    }
                                });

                                iframeDoc.open();
                                iframeDoc.write(
                                    '<!DOCTYPE html>'+
                                    '<html>'+
                                        '<head>'+
                                            '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />'+
                                            '<style>'+
                                                'html {'+
                                                    'background: transparent;'+
                                                    'padding: 0;'+
                                                    'margin: 0;'+
                                                '}'+
                                                'body#wpview-iframe-sandbox {'+
                                                    'background: transparent;'+
                                                    'padding: 1px 0 !important;'+
                                                    'margin: -1px 0 0 !important;'+
                                                '}'+
                                                'body#wpview-iframe-sandbox:before,'+
                                                'body#wpview-iframe-sandbox:after {'+
                                                    'display: none;'+
                                                    'content: "";'+
                                                '}'+
                                            '</style>'+
                                        '</head>'+
                                        '<body id="wpview-iframe-sandbox" class="'+ self.editor.getBody().className +'">'+
                                            $content.html() +
                                        '</body>'+
                                    '</html>'
                                );
                                iframeDoc.close();
                            });
                        }, 50);
                    } else {
                        $wrapper.removeClass('embedpress_placeholder');

                        self.appendElementsIntoWrapper($content, $wrapper);
                    }
                });
            };

            self.appendElementsIntoWrapper = function(elementsList, wrapper) {
                if (elementsList.length > 0) {
                    $.each(elementsList, function appendElementIntoWrapper(elementIndex, element) {
                        // Check if the element is a script and do not add it now (if added here it wouldn't be executed)
                        if (element.tagName.toLowerCase() !== 'script') {
                            wrapper.append($(element));

                            if (element.tagName.toLowerCase() === 'iframe') {
                                $(element).ready(function() {
                                    window.setTimeout(function() {
                                        $.each(self.editor.dom.select('div.embedpress_wrapper iframe'), function(elementIndex, iframe) {
                                            self.fixIframeSize(iframe);
                                        });
                                    }, 300);
                                });
                            } else if (element.tagName.toLowerCase() === "div") {
                                if ($('img', $(element)).length || $('blockquote', wrapper).length) {
                                    // This ensures that the embed wrapper have the same width as its content
                                    $($(element).parents('.embedpress_wrapper').get(0)).addClass('dynamic-width');
                                }

                                $(element).css('max-width', $($(element).parents('body').get(0)).width());
                            }
                        }

                        self.loadAsyncDynamicJsCodeFromElement(element, wrapper);
                    });
                }

                return wrapper;
            };

            self.encodeEmbedURLSpecialChars = function(content) {
                if (content.match(SHORTCODE_REGEXP)) {
                    var subject = content.replace(SHORTCODE_REGEXP, '');

                    if (!subject.isValidUrl()) {
                        return content;
                    }

                    content = subject;
                    subject = null;
                }

                // Bypass the autolink plugin, avoiding to have the url converted to a link automatically
                content = content.replace(/http(s?)\:\/\//i, 'embedpress$1://');

                // Bypass the autolink plugin, avoiding to have some urls with @ being treated as email address (e.g. GMaps)
                content = content.replace('@', '::__at__::').trim();

                return content;
            };

            self.decodeEmbedURLSpecialChars = function(content, applyShortcode, attributes) {
                var encodingRegexpRule = /embedpress(s?):\/\//;
                applyShortcode = (typeof applyShortcode === "undefined") ? true : applyShortcode;
                attributes = (typeof attributes === "undefined") ? {} : attributes;

                var isEncoded = content.match(encodingRegexpRule);

                // Restore http[s] in the url (converted to bypass autolink plugin)
                content = content.replace(/embedpress(s?):\/\//, 'http$1://');
                content = content.replace('::__at__::', '@').trim();

                if ("class" in attributes) {
                    var classesList = attributes.class.split(/\s/g);
                    var shouldRemoveDynamicWidthClass = false;
                    for (var classIndex = 0; classIndex < classesList.length; classIndex++) {
                        if (classesList[classIndex] === "dynamic-width") {
                            shouldRemoveDynamicWidthClass = classIndex;
                            break;
                        }
                    }

                    if (shouldRemoveDynamicWidthClass !== false) {
                        classesList.splice(shouldRemoveDynamicWidthClass, 1);

                        if (classesList.length === 0) {
                            delete attributes.class;
                        }

                        attributes.class = classesList.join(" ");
                    }

                    shouldRemoveDynamicWidthClass = classesList = classIndex = null;
                }

                if (isEncoded && applyShortcode) {
                    var shortcode = '[' + $data.EMBEDPRESS_SHORTCODE;
                    if (!!Object.keys(attributes).length) {
                        var attrValue;

                        for (var attrName in attributes) {
                            attrValue = attributes[attrName];

                            // Prevent `class` property being empty an treated as a boolean param
                            if (attrName.toLowerCase() === "class" && !attrValue.length) {
                                continue;
                            }
                            else {
                                if (attrValue.isBoolean()) {
                                    shortcode += " ";
                                    if (attrValue.isFalse()) {
                                        shortcode += "!";
                                    }

                                    shortcode += attrName
                                } else {
                                    shortcode += ' '+ attrName +'="'+ attrValue +'"';
                                }
                            }
                        }
                        attrValue = attrName = null;
                    }

                    content = shortcode + ']' + content + '[/' + $data.EMBEDPRESS_SHORTCODE + ']';
                }

                return content;
            };

            /**
             * Method executed after find the editor. It will make additional
             * configurations and add the content's stylesheets for the preview
             *
             * @return void
             */
            self.onFindEditor = function() {
                self.each   = tinymce.each;
                self.extend = tinymce.extend;
                self.JSON   = tinymce.util.JSON;
                self.Node   = tinymce.html.Node;

                function onFindEditorCallback() {
                    self.addStylesheet(PLG_SYSTEM_ASSETS_CSS_PATH + '/font.css?' + self.params.versionUID);
                    self.addStylesheet(PLG_SYSTEM_ASSETS_CSS_PATH + '/preview.css?' + self.params.versionUID);
                    self.addStylesheet(PLG_CONTENT_ASSETS_CSS_PATH + '/embedpress.css?' + self.params.versionUID);
                    self.addEvent('paste', self.editor, self.onPaste);
                    self.addEvent('nodechange', self.editor, self.onNodeChange);
                    self.addEvent('keydown', self.editor, self.onKeyDown);

                    self.addEvent('undo', self.editor, self.onUndo); // TinyMCE
                    self.addEvent('undo', self.editor.undoManager, self.onUndo); // JCE

                    // Add the node filter that will convert the url into the preview box for the embed code
                    // @todo: Recognize <a> tags as well
                    self.editor.parser.addNodeFilter('#text', function addNodeFilterIntoParser(nodes, arg) {
                        self.each(nodes, function eachNodeInParser(node) {
                            var subject = node.value;
                            if (!subject.isValidUrl()) {
                                if (!subject.match(SHORTCODE_REGEXP)) {
                                    return;
                                }
                            }

                            subject = self.decodeEmbedURLSpecialChars(subject);
                            if (!subject.isValidUrl()) {
                                if (!subject.match(SHORTCODE_REGEXP)) {
                                    return;
                                }
                            }

                            subject = node.value.stripShortcode($data.EMBEDPRESS_SHORTCODE).trim();

                            // These patterns need to have groups for the pre and post texts
                            var patterns = self.getProvidersURLPatterns();

                            self.each(patterns, function eachPatternForNodeFilterInParser(pattern) {
                                var regex = new RegExp(pattern),
                                    matches,
                                    value;

                                value = self.decodeEmbedURLSpecialChars(subject).trim();

                                matches = value.match(regex);
                                if (matches !== null && !!matches.length) {
                                    var preText  = matches[1];
                                    var url      = self.encodeEmbedURLSpecialChars(matches[2]);
                                    var postText = matches[3];
                                    var wrapper = self.addURLsPlaceholder(node, url, matches[2]);

                                    // Add the pre text if exists
                                    var text;
                                    if (preText !== '') {
                                        text = new self.Node('#text', 3);
                                        text.value = preText.trim();

                                        // Insert before
                                        wrapper.parent.insert(text, wrapper, true);
                                    }

                                    // Add the post text if exists
                                    if (postText !== '') {
                                        text = new self.Node('#text', 3);
                                        text.value = postText.trim();

                                        // Insert after
                                        wrapper.parent.insert(text, wrapper, false);
                                    }
                                }
                            });
                        });
                    });

                    // Add the filter that will convert the preview box/embed code back to the raw url
                    self.editor.serializer.addNodeFilter('div', function addNodeFilterIntoSerializer(nodes, arg) {
                        self.each(nodes, function eachNodeInSerializer(node) {
                            var nodeClasses = (node.attributes.map.class || "").split(' ');
                            var wrapperFactoryClasses = ["embedpress_wrapper", "embedpress_placeholder"];

                            var isWrapped = nodeClasses.filter(function(n) {
                                return wrapperFactoryClasses.indexOf(n) != -1;
                            }).length > 0;

                            if (isWrapped) {
                                var factoryAttributes = ["id", "style", "data-loading-text", "data-uid", "data-url", "data-raw-url"];
                                var customAttributes = {};
                                var dataPrefix = "data-";
                                for (var attr in node.attributes.map) {
                                    if (attr.toLowerCase() !== "class") {
                                        if (factoryAttributes.indexOf(attr) < 0) {
                                            // Remove the "data-" prefix for more readability
                                            customAttributes[attr.replace(dataPrefix, "")] = node.attributes.map[attr];
                                        }
                                    } else {
                                        var customClasses = [];
                                        for (var wrapperClassIndex in nodeClasses) {
                                            var wrapperClass = nodeClasses[wrapperClassIndex];
                                            if (wrapperFactoryClasses.indexOf(wrapperClass) === -1) {
                                                customClasses.push(wrapperClass);
                                            }
                                        }

                                        if (!!customClasses.length) {
                                            customAttributes.class = customClasses.join(" ");
                                        }
                                    }
                                }

                                var text = new self.Node('#text', 3);
                                text.value = self.decodeEmbedURLSpecialChars(node.attributes.map['data-url'].trim(), true, customAttributes);

                                node.replace(text);

                                // @todo: Remove/avoid to add empty paragraphs before and after the text every time we run this
                            }
                        });
                    });

                    // Add event to reconfigure wrappers every time the content is loaded
                    tinymce.each(tinymce.editors, function onEachEditor(editor) {
                        self.addEvent('loadContent', editor, function onInitEditor(ed) {
                            self.configureWrappers();
                        });
                    });

                    // Add the edit form

                    // @todo: This is needed only for JCE, to fix the img placeholder. Try to find out a better approach to avoid the placeholder blink
                    window.setTimeout(
                        function afterTimeoutOnFindEditor() {
                            /*
                             * This is required because after load/refresh the page, the
                             * onLoadContent is not being triggered automatically, so
                             * we force the event
                             */
                            self.editor.load();
                        },
                        // If in JCE the user see the placeholder (img) instead of the iframe after load/refresh the pagr, this time is too short
                        500
                    );
                }

                // Let's make sure the inner doc has been fully loaded first.
                var checkTimesLimit = 100;
                var checkIndex = 0;
                var statusCheckerInterval = setInterval(function() {
                    if (checkIndex === checkTimesLimit) {
                        clearInterval(statusCheckerInterval);
                        alert('For some reason TinyMCE was not fully loaded yet. Please, refresh the page and try again.');
                    } else {
                        var doc = self.editor.getDoc();
                        if (doc) {
                            clearInterval(statusCheckerInterval);
                            onFindEditorCallback();
                        } else {
                            checkIndex++;
                        }
                    }
                }, 250);
            };

            self.fixIframeSize = function(iframe) {
                var maxWidth = 480;
                if ($(iframe).width() > maxWidth && !$(iframe).data('size-fixed')) {
                    var ratio = $(iframe).height() / $(iframe).width();
                    $(iframe).width(maxWidth);
                    $(iframe).height(maxWidth * ratio);
                    $(iframe).css('max-width', maxWidth);
                    $(iframe).attr('max-width', maxWidth);

                    $(iframe).data('size-fixed', true);
                }
            }

            /**
             * Function triggered on mouse enter the wrapper
             *
             * @param  object e The event
             * @return void
             */
            self.onMouseEnter = function(e) {
                self.displayPreviewControllerPanel($(e.currentTarget));
            };

            /**
             * Function triggered on mouse get out of the wrapper
             *
             * @param  object e The event
             * @return void
             */
            self.onMouseOut = function(e) {
                // Check if the destiny is not a child element
                // Chrome
                if (self.isDefined(e.toElement)) {
                    if (e.toElement.parentElement == e.fromElement
                        || $(e.toElement).hasClass('embedpress_ignore_mouseout')
                    ) {
                        return false;
                    }
                }

                // Firefox
                if (self.isDefined(e.relatedTarget)) {
                    if ($(e.relatedTarget).hasClass('embedpress_ignore_mouseout')) {
                        return false;
                    }
                }

                self.hidePreviewControllerPanel();
            };

            /**
             * Function called on paste event in the editor
             *
             * @param  object e The event
             * @return void
             */
            self.onPaste = function(e, b) {
                var event;

                // Prevent default paste behavior. We have 2 arguments because the difference between JCE and TinyMCE.
                // Sometimes, the argument e is the editor, instead of the event
                if (e.preventDefault) {
                    event = e;
                } else {
                    event = b;
                }

                // Check for clipboard data in various places for cross-browser compatibility
                // Get that data as text
                var content = ((event.originalEvent || event).clipboardData || window.clipboardData).getData('Text');

                // Check if the pasted content has a recognized embed url pattern
                var patterns = self.getProvidersURLPatterns();

                self.each(patterns, function eachPatternForOnPaste(pattern) {
                    var regex   = new RegExp(pattern),
                        matches = content.match(regex),
                        url;

                    if (matches !== null && !!matches.length) {
                        event.preventDefault();

                        content += '<span>&nbsp;</span>'; // This assures that the cursor are positioned after the embed

                        // Let TinyMCE do the heavy lifting for inserting that content into the self.editor
                        // We cancel the default behavior and insert using command to trigger the node change and the parser
                        self.editor.execCommand('mceInsertContent', false, content);

                        self.configureWrappers();
                    }
                });
            };

            /**
             * Method trigered on every node change, to detect new lines. It will
             * try to fix a default behavior for some editors of clone the parent
             * element when adding a line break. This will clone the embed wrapper
             * if we set the cursor after a preview wrapper and hit enter.
             *
             * @param  object e The event
             * @return void
             */
            self.onNodeChange = function(e) {
                // Fix the clone parent on break lines issue
                // Check if a line break was added
                if (e.element.tagName === 'BR') {
                    // Check one of the parent elements is a clonned embed wrapper
                    if (e.parents.length > 0) {
                        $.each(e.parents, function(index, parent) {
                            if ($(parent).hasClass('embedpress_wrapper')) {
                                // Remove the cloned wrapper and replace with a 'br' tag
                                $(parent).replaceWith($('<br>'));
                            }
                        });
                    }
                } else if (e.element.tagName === "IFRAME") {
                    if (e.parents.length > 0) {
                        $.each(e.parents, function(index, parent) {
                            parent = $(parent);
                            if (parent.hasClass('embedpress_wrapper')) {
                                var wrapper = $('.embedpress-wrapper', parent);
                                if (wrapper.length > 1) {
                                    wrapper.get(0).remove();
                                }
                            }
                        });
                    }
                }
            };

            self.onKeyDown = function(e) {
                var node = self.editor.selection.getNode();

                if (e.keyCode == 8 || e.keyCode == 46) {
                    if (node.nodeName.toLowerCase() === 'p') {
                        var children = $(node).children();
                        if (children.length > 0) {
                            $.each(children, function() {
                                // On delete, make sure to remove the wrapper and children, not only the wrapper
                                if ($(this).hasClass('embedpress_wrapper') || $(this).hasClass('embedpress_ignore_mouseout')) {
                                    $(this).remove();

                                    self.editor.focus();
                                }
                            });
                        }
                    }
                } else {
                    // Ignore the arrows keys
                    var arrowsKeyCodes = [37, 38, 39, 40];
                    if (arrowsKeyCodes.indexOf(e.keyCode) == -1) {

                        // Check if we are inside a preview wrapper
                        if ($(node).hasClass('embedpress_wrapper') || $(node).hasClass('embedpress_ignore_mouseout')) {
                            // Avoid delete the wrapper or block line break if we are inside the wrapper
                            if (e.keyCode == 13) {
                                wrapper = $(self.getWrapperFromChild(node));
                                if (wrapper.length > 0) {
                                    // Creates a temporary element which will be inserted after the wrapper
                                    var tmpId = '__embedpress__tmp_' + self.makeId();
                                    wrapper.after($('<span id="' + tmpId + '"></span>'));
                                    // Get and select the temporary element
                                    var span = self.editor.dom.select('span#' + tmpId)[0];
                                    self.editor.selection.select(span);
                                    // Remove the temporary element
                                    $(span).remove();
                                }

                                return true;
                            } else {
                                // If we are inside the embed preview, ignore any key to avoid edition
                                return self.cancelEvent(e);
                            }
                        }
                    }
                }

                return true;
            }

            self.getWrapperFromChild = function(element) {
                // Is the wrapper
                if ($(element).hasClass('embedpress_wrapper')) {
                    return element;
                } else {
                    var $parent = $(element).parent();

                    if ($parent.length > 0) {
                        return self.getWrapperFromChild($parent[0]);
                    }
                }

                return false;
            };

            self.onUndo = function(e) {
                // Force re-render everything
                self.editor.load();
            };

            self.cancelEvent = function(e) {
                e.preventDefault();
                e.stopPropagation();
                self.editor.dom.events.cancel();

                return false;
            };

            /**
             * Method executed when the edit button is clicked. It will display
             * a field with the current url, to update the current embed's source
             * url.
             *
             * @param  Object e The event
             * @return void
             */
            self.onClickEditButton = function(e) {
                // Prevent edition of the panel
                self.cancelEvent(e);

                self.activeWrapperForModal = self.activeWrapper;

                var $wrapper = self.activeWrapperForModal;
                var wrapperUid = $wrapper.prop('id').replace("embedpress_wrapper_", "");

                var customAttributes = {};

                var embedInnerWrapper = $('.embedpress-wrapper', $wrapper);
                var embedItem = $('iframe', $wrapper);
                if (!embedItem.length) {
                    embedItem = null;
                }

                $.each(embedInnerWrapper.attributes, function() {
                    if (this.specified) {
                        if (this.name !== "class") {
                            customAttributes[this.name.replace('data-', "").toLowerCase()] = this.value;
                        }
                    }
                });

                var embedWidth = (((embedItem && embedItem.width()) || embedInnerWrapper.data('width')) || embedInnerWrapper.width()) || "";
                var embedHeight = (((embedItem && embedItem.height()) || embedInnerWrapper.data('height')) || embedInnerWrapper.height()) || "";

                embedItem = embedInnerWrapper = null;

                $('<div class="loader-indicator"><i class="embedpress-icon-reload"></i></div>').appendTo($wrapper);

                setTimeout(function() {
                    $.ajax({
                        type: "GET",
                        url: "admin-ajax.php",
                        data: {
                            action: "embedpress_get_embed_url_info",
                            url: self.decodeEmbedURLSpecialChars($wrapper.data('url'), false)
                        },
                        beforeSend: function(request, requestSettings) {
                            $('.loader-indicator', $wrapper).addClass('is-loading');
                        },
                        success: function(response) {
                            if (!response) {
                                bootbox.alert('Unable to get a valid response from the server.');
                                return;
                            }

                            if (response.canBeResponsive) {
                                var embedShouldBeResponsive = true;
                                if ("width" in customAttributes || "height" in customAttributes) {
                                    embedShouldBeResponsive = false;
                                } else if ("responsive" in customAttributes && customAttributes['responsive'].isFalse()) {
                                    embedShouldBeResponsive = false;
                                }
                            }

                            bootbox.dialog({
                                className: "embedpress-modal",
                                title: "Editing Embed properties",
                                message: '<form id="form-'+ wrapperUid +'" embedpress>'+
                                            '<div class="row">'+
                                                '<div class="col-md-12">'+
                                                    '<div class="form-group">'+
                                                        '<label for="input-url-'+ wrapperUid +'">Url</label>'+
                                                        '<input class="form-control" type="url" id="input-url-'+ wrapperUid +'" value="'+ self.decodeEmbedURLSpecialChars($wrapper.data('url'), false) +'">'+
                                                    '</div>'+
                                                '</div>'+
                                            '</div>'+
                                            '<div class="row">'+
                                                (response.canBeResponsive ?
                                                '<div class="col-md-12">'+
                                                    '<label>Responsive</label>'+
                                                    '<div class="form-group">'+
                                                        '<label class="radio-inline">'+
                                                            '<input type="radio" name="input-responsive-'+ wrapperUid +'" id="input-responsive-1-'+ wrapperUid +'" value="1"'+ (embedShouldBeResponsive ? ' checked' : '') +'> Yes'+
                                                        '</label>'+
                                                        '<label class="radio-inline">'+
                                                            '<input type="radio" name="input-responsive-'+ wrapperUid +'" id="input-responsive-0-'+ wrapperUid +'" value="0"'+ (!embedShouldBeResponsive ? ' checked' : '') +'> No'+
                                                        '</label>'+
                                                    '</div>'+
                                                '</div>' : '')+
                                                '<div class="col-md-6">'+
                                                    '<div class="form-group">'+
                                                        '<label for="input-width-'+ wrapperUid +'">Width</label>'+
                                                        '<input class="form-control" type="integer" id="input-width-'+ wrapperUid +'" value="'+ embedWidth +'"'+ (embedShouldBeResponsive ? ' disabled' : '') +'>'+
                                                    '</div>'+
                                                '</div>'+
                                                '<div class="col-md-6">'+
                                                    '<div class="form-group">'+
                                                        '<label for="input-height-'+ wrapperUid +'">Height</label>'+
                                                        '<input class="form-control" type="integer" id="input-height-'+ wrapperUid +'" value="'+ embedHeight +'"'+ (embedShouldBeResponsive ? ' disabled' : '') +'>'+
                                                    '</div>'+
                                                '</div>'+
                                            '</div>'+
                                         '</form>',
                                buttons: {
                                    danger: {
                                        label: "Cancel",
                                        className: "btn-default",
                                        callback: function() {
                                            // do nothing
                                            self.activeWrapperForModal = null;
                                        }
                                    },
                                    success: {
                                        label: "Save",
                                        className: "btn-primary",
                                        callback: function() {
                                            var $wrapper = self.activeWrapperForModal;

                                            // Select the current wrapper as a base for the new element
                                            self.editor.focus();
                                            self.editor.selection.select($wrapper[0]);

                                            $wrapper.children().remove();
                                            $wrapper.remove();

                                            if (response.canBeResponsive) {
                                                if ($('#form-'+ wrapperUid +' input[name="input-responsive-'+ wrapperUid +'"]:checked').val().isFalse()) {
                                                    var embedCustomWidth = $('#input-width-'+ wrapperUid).val();
                                                    if (parseInt(embedCustomWidth) > 0) {
                                                        customAttributes['width'] = embedCustomWidth;
                                                    }

                                                    var embedCustomHeight = $('#input-height-'+ wrapperUid).val();
                                                    if (parseInt(embedCustomHeight) > 0) {
                                                        customAttributes['height'] = embedCustomHeight;
                                                    }

                                                    customAttributes['responsive'] = "false";
                                                } else {
                                                    delete customAttributes['width'];
                                                    delete customAttributes['height'];

                                                    customAttributes['responsive'] = "true";
                                                }
                                            } else {
                                                var embedCustomWidth = $('#input-width-'+ wrapperUid).val();
                                                if (parseInt(embedCustomWidth) > 0) {
                                                    customAttributes['width'] = embedCustomWidth;
                                                }

                                                var embedCustomHeight = $('#input-height-'+ wrapperUid).val();
                                                if (parseInt(embedCustomHeight) > 0) {
                                                    customAttributes['height'] = embedCustomHeight;
                                                }
                                            }

                                            var customAttributesList = [];
                                            if (!!Object.keys(customAttributes).length) {
                                                for (var attrName in customAttributes) {
                                                    customAttributesList.push(attrName + '="' + customAttributes[attrName] + '"');
                                                }
                                            }

                                            var shortcode = '['+ $data.EMBEDPRESS_SHORTCODE + (customAttributesList.length > 0 ? " "+ customAttributesList.join(" ") : "") +']'+ $('#input-url-'+ wrapperUid).val() +'[/'+ $data.EMBEDPRESS_SHORTCODE +']';
                                            // We do not directly replace the node because it was causing a bug on a second edit attempt
                                            self.editor.execCommand('mceInsertContent', false, shortcode);

                                            self.configureWrappers();
                                        }
                                    }
                                }
                            });

                            $('form[embedpress]').on('change', 'input[type="radio"]', function(e) {
                                var self = $(this);
                                var form = self.parents('form[embedpress]');

                                $('input[type="integer"]', form).prop('disabled', self.val().isTrue());
                            });
                        },
                        complete: function(request, textStatus) {
                            $('.loader-indicator', $wrapper).removeClass('is-loading');

                            setTimeout(function() {
                                $('.loader-indicator', $wrapper).remove();
                            }, 350);
                        },
                        dataType: "json",
                        async: true
                    });
                }, 200);

                return false;
            };

            /**
             * Method executed when the remove button is clicked. It will remove
             * the preview and embed code, adding a mark to ignore the url
             *
             * @param  Object e The event
             * @return void
             */
            self.onClickRemoveButton = function(e) {
                // Prevent edition of the panel
                self.cancelEvent(e);

                var $wrapper = self.activeWrapper;

                $wrapper.children().remove();
                $wrapper.remove();

                return false;
            };

            self.recursivelyAddClass = function(element, className) {
                $(element).children().each(function(index, child) {
                    $(child).addClass(className);

                    var grandChild = $(child).children();
                    if (grandChild.length > 0) {
                        self.recursivelyAddClass(child, className)
                    }
                });
            };

            self.setInterval = function(callback, time, timeout) {
                var elapsed    = 0;
                var iteraction = 0;

                var interval = window.setInterval(function() {
                    elapsed += time;
                    iteraction++;

                    if (elapsed <= timeout) {
                        callback(iteraction, elapsed);
                    } else {
                        self.stopInterval(interval);
                    }
                }, time);

                return interval;
            };

            self.stopInterval = function(interval) {
                window.clearInterval(interval);
                interval = null;
            };

            /**
             * Configure unconfigured embed wrappers, adding events and css
             * @return void
             */
            self.configureWrappers = function() {
                window.setTimeout(
                    function configureWrappersTimeOut() {
                        var doc = self.editor.getDoc(),
                            total = 0,
                            $wrapper = null,
                            $iframe = null;

                        // Get all the wrappers
                        var wrappers = doc.getElementsByClassName('embedpress_wrapper');
                        total = wrappers.length;
                        if (total > 0) {
                            for (var i = 0; i < total; i++) {
                                $wrapper = $(wrappers[i]);

                                // Check if the wrapper wasn't already configured
                                if ($wrapper.data('configured') != true) {
                                    // A timeout was set to avoid block the content loading
                                    window.setTimeout(function() {
                                        // @todo: Check if we need a limit of levels to avoid use too much resources
                                        self.recursivelyAddClass($wrapper, 'embedpress_ignore_mouseout');
                                    }, 500);

                                    // Fix the wrapper size. Wait until find the child iframe. L
                                    var interval = self.setInterval(function(iteraction) {
                                        var $childIframes = $wrapper.find('iframe');

                                        if ($childIframes.length > 0) {
                                            $.each($childIframes, function(index, iframe) {
                                                // Facebook has more than one iframe, we need to ignore the Cross Domain Iframes
                                                if ($(iframe).attr('id') !== 'fb_xdm_frame_https'
                                                    && $(iframe).attr('id') !== 'fb_xdm_frame_http'
                                                ) {
                                                    $wrapper.css('width', $(iframe).width() + 'px');
                                                    self.stopInterval(interval);
                                                }
                                            });
                                        }
                                    }, 500, 8000);

                                    $wrapper.on('mouseenter', self.onMouseEnter);
                                    $wrapper.on('mouseout', self.onMouseOut);
                                    $wrapper.data('configured', true);
                                }
                            }
                        }
                    },
                    200
                );
            };

            /**
             * Hide the controller panel
             *
             * @return void
             */
            self.hidePreviewControllerPanel = function() {
                if (self.controllerPanelIsActive()) {
                    $(self.activeControllerPanel).addClass('hidden');
                    self.activeControllerPanel = null;
                    self.activeWrapper = null;
                }
            };

            /**
             * Get an element by id in the editor's content
             *
             * @param  String id The element id
             * @return Element   The found element or null, wrapped by jQuery
             */
            self.getElementInContentById = function(id) {
                var doc = self.editor.getDoc();

                return $(doc.getElementById(id));
            };

            /**
             * Show the controller panel
             *
             * @param  element $wrapper The wrapper which will be activate
             * @return void
             */
            self.displayPreviewControllerPanel = function($wrapper) {
                if (self.controllerPanelIsActive() && $wrapper !== self.activeWrapper) {
                    self.hidePreviewControllerPanel();
                }

                if (!self.controllerPanelIsActive() && !$wrapper.hasClass('is-loading')) {
                    var uid = $wrapper.data('uid');
                    var $panel = self.getElementInContentById('embedpress_controller_panel_' + uid);

                    if (!$panel.data('event-set')) {
                        var $editButton = self.getElementInContentById('embedpress_button_edit_' + uid);
                        var $removeButton = self.getElementInContentById('embedpress_button_remove_' + uid);

                        self.addEvent('mousedown', $editButton, self.onClickEditButton);
                        self.addEvent('mousedown', $removeButton, self.onClickRemoveButton);

                        // Prevent the action of set cursor into the panel after click
                        self.addEvent('mousedown', $panel, self.cancelEvent);

                        $panel.data('event-set', true);
                    }

                    // Update the position of the control bar
                    var next = $panel.next()[0];
                    if (typeof next !== 'undefined') {
                        if (next.nodeName.toLowerCase() === 'iframe') {
                            $panel.css('left', ($(next).width() / 2));
                        }
                    }

                    // Show the bar
                    $panel.removeClass('hidden');

                    self.activeControllerPanel = $panel;
                    self.activeWrapper = $wrapper;
                }
            };
        };

        if (!window.EmbedPressPreview) {
            window.EmbedPressPreview = new EmbedPressPreview();
        }

        window.EmbedPressPreview.init($data.previewSettings);
    });
})(window, jQuery, String, $data);
