/**
 * @package   OSEmbed
 * @contact   www.alledia.com, support@alledia.com
 * @copyright 2016 Open Source Training, LLC. All rights reserved
 * @license   http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

(function(window, $, String, $data){
    $(window.document).ready(function() {
        String.prototype.capitalizeFirstLetter = function() {
            return this.charAt(0).toUpperCase() + this.slice(1);
        }

        String.prototype.isValidUrl = function() {
            var rule = /^(https?|ftp|osembeds?):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;

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
                var propertiesString = (new RegExp(/\[embed\s*(.*?)\]/, "ig")).exec(subject)[1]; // Separate all shortcode attributes from the rest of the string
                if (propertiesString.length > 0) {
                    var extractAttributesRule = new RegExp(/(\!?\w+-?\w*)(?:="(.+?)")?/, "ig"); // Extract attributes and their values
                    var match;
                    while (match = extractAttributesRule.exec(propertiesString)) {
                        var attrName = match[1];
                        var attrValue;
                        if (match[2] === undefined) {
                            if (attrName.indexOf('!') === 0) {
                                attrName = attrName.replace('!', "");
                                attrValue = "false";
                            } else {
                                attrValue = "true";
                            }
                        } else {
                            attrValue = match[2];
                            if (attrValue.isBoolean()) {
                                attrValue = attrValue.isFalse() ? "false" : "true";
                            }
                        }

                        attributes[attrName] = attrValue;
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

        var SHORTCODE_REGEXP = new RegExp('\\[\/?'+ $data.EMBEDPRESS_SHORTCODE +'\\]', "gi");

        var OSEmbedPreview = function() {
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
                    //url : 'index.php?plg_task=osembedpreview.parse_content',
                    url: "admin-ajax.php",
                    //data: {'content': content},
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

                $style = $('<link rel="stylesheet" type="text/css" href="' + url + '">');
                $style.appendTo(head);
            }

            self.convertURLSchemeToPattern = function(scheme) {
                var prefix = '(.*)((?:http|osembed)s?:\\/\\/(?:www\\.)?',
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

            self.addScript = function(source, callback) {
                var doc = self.editor.getDoc(),
                    $script = $(doc.createElement('script')),
                    $head = $(doc.getElementsByTagName('head')[0]);
                $script.attr('async', 1);
                $head.append($script);

                if (typeof callback !== 'undefined') {
                    $script.ready(callback);
                }

                $script.attr('src', source);
            };

            self.addScriptDeclaration = function(wrapper, declaration) {
                var doc = self.editor.getDoc(),
                    $script = $(doc.createElement('script'));

                $(wrapper).append($script);

                $script.text(declaration);
            };

            self.addURLsPlaceholder = function(node, url) {
                var uid = self.makeId();

                var wrapperClasses = ["osembed_wrapper", "osembed_placeholder"];

                var shortcodeAttributes = node.value.getShortcodeAttributes($data.EMBEDPRESS_SHORTCODE);
                var customAttributes = shortcodeAttributes;

                var customClasses = "";
                if (!!Object.keys(shortcodeAttributes).length) {
                    var specialAttributes = ["class"];
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

                var wrapper = new self.Node('div', 1);
                var wrapperSettings = {
                    'class': Array.from(new Set(wrapperClasses)).join(" "),
                    'data-url': url,
                    'data-uid': uid,
                    'id': 'osembed_wrapper_' + uid,
                    'data-loading-text': 'Loading...'
                };

                wrapperSettings = $.extend({}, wrapperSettings, shortcodeAttributes);

                wrapper.attr(wrapperSettings);

                var panel = new self.Node('div', 1);
                panel.attr({
                    'id': 'osembed_controller_panel_' + uid,
                    'class': 'osembed_controller_panel osembed_ignore_mouseout hidden'
                });
                wrapper.append(panel);

                var editButton = new self.Node('div', 1);
                editButton.attr({
                    'id': 'osembed_button_edit_' + uid,
                    'class': 'osembed_ignore_mouseout osembed_controller_button'
                });
                editButtonIcon = new self.Node('i', 1);
                editButtonIcon.attr({
                    'class': 'osembed-icon-pencil osembed_ignore_mouseout'
                });
                editButton.append(editButtonIcon);
                panel.append(editButton);

                // var paramsButton = new self.Node('div', 1);
                // paramsButton.attr({
                //     'id': 'osembed_button_params_' + uid,
                //     'class': 'osembed_ignore_mouseout osembed_controller_button'
                // });
                // paramsButtonIcon = new self.Node('i', 1);
                // paramsButtonIcon.attr({
                //     'class': 'osembed-icon-gear osembed_ignore_mouseout'
                // });
                // paramsButton.append(paramsButtonIcon);
                // panel.append(paramsButton);

                var removeButton = new self.Node('div', 1);
                removeButton.attr({
                    'id': 'osembed_button_remove_' + uid,
                    'class': 'osembed_ignore_mouseout osembed_controller_button'
                });
                removeButtonIcon = new self.Node('i', 1);
                removeButtonIcon.attr({
                    'class': 'osembed-icon-x osembed_ignore_mouseout'
                });
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

                // Get the parsed embed code from the OSEmbed plugin
                self.getParsedContent(url, function getParsedContentCallback(result) {
                    result.data.content = result.data.content.stripShortcode($data.EMBEDPRESS_SHORTCODE);

                    // Parse as DOM element
                    var $content;
                    try {
                        $content = $(result.data.content);
                    } catch(err) {
                        // Fallback to a div, if the result is not a html markup, e.g. a url
                        $content = $('<div>');
                        $content.html(result.data.content);
                    }

                    var $wrapper = $(self.getElementInContentById('osembed_wrapper_' + uid));
                    var scripts = [];

                    $wrapper.removeClass('osembed_placeholder');

                    $.each($content, function appendEachEmbedElement(index, element) {
                        // Check if the element is a script and do not add it now (if added here it wouldn't be executed)
                        if (element.tagName.toLowerCase() !== 'script') {
                            $wrapper.append($(element));

                            if (element.tagName.toLowerCase() === 'iframe') {
                                $(element).ready(function() {
                                    window.setTimeout(function() {
                                        $.each(self.editor.dom.select('div.osembed_wrapper iframe'), function(index, iframe) {
                                            self.fixIframeSize(iframe);
                                        });
                                    }, 300);
                                });
                            }
                        } else {

                            if (typeof $(element).attr('src') !== 'undefined') {
                                self.addScript($(element).attr('src'));
                            } else {
                                self.addScriptDeclaration($wrapper, $(element).html());
                            }
                        }
                    });
                });
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
                content = content.replace(/http(s?)\:\/\//i, 'osembed$1://');

                // Bypass the autolink plugin, avoiding to have some urls with @ being treated as email address (e.g. GMaps)
                content = content.replace('@', '::__at__::').trim();

                return content;
            };

            self.decodeEmbedURLSpecialChars = function(content, applyShortcode, attributes) {
                var encodingRegexpRule = /osembed(s?):\/\//;
                applyShortcode = (typeof applyShortcode === "undefined") ? true : applyShortcode;
                attributes = (typeof attributes === "undefined") ? {} : attributes;

                var isEncoded = content.match(encodingRegexpRule);

                // Restore http[s] in the url (converted to bypass autolink plugin)
                content = content.replace(/osembed(s?):\/\//, 'http$1://');
                content = content.replace('::__at__::', '@').trim();

                if (isEncoded && applyShortcode) {
                    var shortcode = '[' + $data.EMBEDPRESS_SHORTCODE;
                    if (!!Object.keys(attributes).length) {
                        var attrValue;
                        for (var attrName in attributes) {
                            attrValue = attributes[attrName];
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

                self.addStylesheet(PLG_SYSTEM_ASSETS_CSS_PATH + '/font.css?' + self.params.versionUID);
                self.addStylesheet(PLG_SYSTEM_ASSETS_CSS_PATH + '/preview.css?' + self.params.versionUID);
                self.addStylesheet(PLG_CONTENT_ASSETS_CSS_PATH + '/osembed.css?' + self.params.versionUID);
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
                                var wrapper = self.addURLsPlaceholder(node, url);

                                // Add the pre text if exists
                                var text;
                                if (preText !== '') {
                                    // p = new self.Node('p', 1);
                                    text = new self.Node('#text', 3);
                                    text.value = preText.trim();
                                    // p.append(text);

                                    // Insert before
                                    wrapper.parent.insert(text, wrapper, true);
                                }

                                // Add the post text if exists
                                if (postText !== '') {
                                    // p = new self.Node('p', 1);
                                    text = new self.Node('#text', 3);
                                    text.value = postText.trim();
                                    // p.append(text)

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
                        var wrapperFactoryClasses = ["osembed_wrapper", "osembed_placeholder"];

                        var isWrapped = nodeClasses.filter(function(n) {
                            return wrapperFactoryClasses.indexOf(n) != -1;
                        }).length > 0;

                        if (isWrapped) {
                            var factoryAttributes = ["id", "style", "data-loading-text", "data-uid", "data-url"];
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

                            text = new self.Node('#text', 3);
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
                        || $(e.toElement).hasClass('osembed_ignore_mouseout')
                    ) {
                        return false;
                    }
                }

                // Firefox
                if (self.isDefined(e.relatedTarget)) {
                    if ($(e.relatedTarget).hasClass('osembed_ignore_mouseout')) {
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
                            if ($(parent).hasClass('osembed_wrapper')) {
                                // Remove the cloned wrapper and replace with a 'br' tag
                                $(parent).replaceWith($('<br>'));
                            }
                        });
                    }
                }
            };

            self.onKeyDown = function(e) {
                var node = self.editor.selection.getNode();

                if (e.keyCode == 8 || e.keyCode == 46) {
                    if (node.nodeName.toLowerCase() === 'p') {
                        children = $(node).children();
                        if (children.length > 0) {
                            $.each(children, function() {
                                // On delete, make sure to remove the wrapper and children, not only the wrapper
                                if ($(this).hasClass('osembed_wrapper') || $(this).hasClass('osembed_ignore_mouseout')) {
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
                        if ($(node).hasClass('osembed_wrapper') || $(node).hasClass('osembed_ignore_mouseout')) {
                            // Avoid delete the wrapper or block line break if we are inside the wrapper
                            if (e.keyCode == 13) {
                                wrapper = $(self.getWrapperFromChild(node));
                                if (wrapper.length > 0) {
                                    // Creates a temporary element which will be inserted after the wrapper
                                    var tmpId = '__osembed__tmp_' + self.makeId();
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
                if ($(element).hasClass('osembed_wrapper')) {
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

                bootbox.prompt({
                    title: "Edit the URL",
                    size: "small",
                    message: "Testing...",
                    value: self.decodeEmbedURLSpecialChars($wrapper.data('url'), false),
                    callback: function(result) {
                        if (result !== null) {
                            var $wrapper = self.activeWrapperForModal;

                            // Select the current wrapper as a base for the new element
                            self.editor.focus();
                            self.editor.selection.select($wrapper[0]);

                            $wrapper.children().remove();
                            $wrapper.remove();

                            // We do not directly replace the node because it was causing a bug on a second edit attempt
                            self.editor.execCommand('mceInsertContent', false, result);

                            self.configureWrappers();
                        }
                    }
                });

                return false;
            };

            /**
             * Method executed when the params button is clicked. It will display
             * some fields which allow to configure the current embed code.
             *
             * @param  Object e The event
             * @return void
             */
            // self.onClickParamsButton = function(e) {
            //     // Prevent edition of the panel
            //     self.cancelEvent(e);

            //     // @todo: Implement onClickParamsButton
            //     return false;
            // };

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
                        var wrappers = doc.getElementsByClassName('osembed_wrapper');
                        total = wrappers.length;
                        if (total > 0) {
                            for (var i = 0; i < total; i++) {
                                $wrapper = $(wrappers[i]);

                                // Check if the wrapper wasn't already configured
                                if ($wrapper.data('configured') != true) {
                                    // A timeout was set to avoid block the content loading
                                    window.setTimeout(function() {
                                        // @todo: Check if we need a limit of levels to avoid use too much resources
                                        self.recursivelyAddClass($wrapper, 'osembed_ignore_mouseout');
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

                if (!self.controllerPanelIsActive()) {
                    var uid = $wrapper.data('uid');
                    var $panel = self.getElementInContentById('osembed_controller_panel_' + uid);

                    if (!$panel.data('event-set')) {
                        var $editButton = self.getElementInContentById('osembed_button_edit_' + uid);
                        // var $paramsButton = self.getElementInContentById('osembed_button_params_' + uid);
                        var $removeButton = self.getElementInContentById('osembed_button_remove_' + uid);

                        self.addEvent('mousedown', $editButton, self.onClickEditButton);
                        // self.addEvent('mousedown', $paramsButton, self.onClickParamsButton);
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

        if (!window.OSEmbedPreview) {
            window.OSEmbedPreview = new OSEmbedPreview();
        }

        window.OSEmbedPreview.init($data.previewSettings);
    });
})(window, jQuery, String, $data);
