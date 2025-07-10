(function() {
  "use strict";
  /**
   *  PDFObject v2.2.6
   *  https://github.com/pipwerks/PDFObject
   *  @license
   *  Copyright (c) 2008-2021 Philip Hutchison
   *  MIT-style license: http://pipwerks.mit-license.org/
   *  UMD module pattern from https://github.com/umdjs/umd/blob/master/templates/returnExports.js
   */
  (function(root, factory) {
    if (typeof define === "function" && define.amd) {
      define([], factory);
    } else if (typeof module === "object" && module.exports) {
      module.exports = factory();
    } else {
      root.PDFObject = factory();
    }
  })(void 0, function() {
    if (typeof window === "undefined" || window.navigator === void 0 || window.navigator.userAgent === void 0 || window.navigator.mimeTypes === void 0) {
      return false;
    }
    let pdfobjectversion = "2.2.6";
    let nav = window.navigator;
    let ua = window.navigator.userAgent;
    let isIE = "ActiveXObject" in window;
    let isModernBrowser = window.Promise !== void 0;
    let supportsPdfMimeType = nav.mimeTypes["application/pdf"] !== void 0;
    let isSafariIOSDesktopMode = nav.platform !== void 0 && nav.platform === "MacIntel" && nav.maxTouchPoints !== void 0 && nav.maxTouchPoints > 1;
    let isMobileDevice = isSafariIOSDesktopMode || /Mobi|Tablet|Android|iPad|iPhone/.test(ua);
    let isSafariDesktop = !isMobileDevice && nav.vendor !== void 0 && /Apple/.test(nav.vendor) && /Safari/.test(ua);
    let isFirefoxWithPDFJS = !isMobileDevice && /irefox/.test(ua) && ua.split("rv:").length > 1 ? parseInt(ua.split("rv:")[1].split(".")[0], 10) > 18 : false;
    let createAXO = function(type) {
      var ax;
      try {
        ax = new ActiveXObject(type);
      } catch (e) {
        ax = null;
      }
      return ax;
    };
    let supportsPdfActiveX = function() {
      return !!(createAXO("AcroPDF.PDF") || createAXO("PDF.PdfCtrl"));
    };
    let supportsPDFs = (
      //As of Sept 2020 no mobile browsers properly support PDF embeds
      !isMobileDevice && //We're moving into the age of MIME-less browsers. They mostly all support PDF rendering without plugins.
      (isModernBrowser || //Modern versions of Firefox come bundled with PDFJS
      isFirefoxWithPDFJS || //Browsers that still support the original MIME type check
      supportsPdfMimeType || //Pity the poor souls still using IE
      isIE && supportsPdfActiveX())
    );
    let buildURLFragmentString = function(pdfParams) {
      let string = "";
      let prop;
      if (pdfParams) {
        for (prop in pdfParams) {
          if (pdfParams.hasOwnProperty(prop)) {
            string += encodeURIComponent(prop) + "=" + encodeURIComponent(pdfParams[prop]) + "&";
          }
        }
        if (string) {
          string = "#" + string;
          string = string.slice(0, string.length - 1);
        }
      }
      return string;
    };
    let embedError = function(msg, suppressConsole) {
      return false;
    };
    let emptyNodeContents = function(node) {
      while (node.firstChild) {
        node.removeChild(node.firstChild);
      }
    };
    let getTargetElement = function(targetSelector) {
      let targetNode = document.body;
      if (typeof targetSelector === "string") {
        targetNode = document.querySelector(targetSelector);
      } else if (window.jQuery !== void 0 && targetSelector instanceof jQuery && targetSelector.length) {
        targetNode = targetSelector.get(0);
      } else if (targetSelector.nodeType !== void 0 && targetSelector.nodeType === 1) {
        targetNode = targetSelector;
      }
      return targetNode;
    };
    let generatePDFJSMarkup = function(targetNode, url, pdfOpenFragment, PDFJS_URL, id, omitInlineStyles) {
      emptyNodeContents(targetNode);
      let fullURL = PDFJS_URL + "?file=" + encodeURIComponent(url) + pdfOpenFragment;
      let div = document.createElement("div");
      let iframe = document.createElement("iframe");
      iframe.src = fullURL;
      iframe.className = "pdfobject";
      iframe.type = "application/pdf";
      iframe.frameborder = "0";
      iframe.allow = "fullscreen";
      if (id) {
        iframe.id = id;
      }
      if (!omitInlineStyles) {
        div.style.cssText = "position: absolute; top: 0; right: 0; bottom: 0; left: 0;";
        iframe.style.cssText = "border: none; width: 100%; height: 100%;";
        targetNode.style.position = "relative";
        targetNode.style.overflow = "auto";
      }
      div.appendChild(iframe);
      targetNode.appendChild(div);
      targetNode.classList.add("pdfobject-container");
      return targetNode.getElementsByTagName("iframe")[0];
    };
    let generatePDFObjectMarkup = function(embedType, targetNode, targetSelector, url, pdfOpenFragment, width, height, id, title, omitInlineStyles) {
      emptyNodeContents(targetNode);
      let embed2 = document.createElement(embedType);
      if ("object" === embedType) {
        embed2.data = url + pdfOpenFragment;
      } else {
        embed2.src = url + pdfOpenFragment;
      }
      embed2.className = "pdfobject";
      embed2.type = "application/pdf";
      embed2.title = title;
      if (id) {
        embed2.id = id;
      }
      if (embedType === "iframe") {
        embed2.allow = "fullscreen";
      }
      if (!omitInlineStyles) {
        let style = embedType === "embed" ? "overflow: auto;" : "border: none;";
        if (targetSelector && targetSelector !== document.body) {
          style += "width: " + width + "; height: " + height + ";";
        } else {
          style += "position: absolute; top: 0; right: 0; bottom: 0; left: 0; width: 100%; height: 100%;";
        }
        embed2.style.cssText = style;
      }
      targetNode.classList.add("pdfobject-container");
      targetNode.appendChild(embed2);
      return targetNode.getElementsByTagName(embedType)[0];
    };
    let embed = function(url, targetSelector, options) {
      let selector = targetSelector || false;
      let opt = options || {};
      let id = typeof opt.id === "string" ? opt.id : "";
      let page = opt.page || false;
      let pdfOpenParams = opt.pdfOpenParams || {};
      let fallbackLink = opt.fallbackLink || true;
      let width = opt.width || "100%";
      let height = opt.height || "100%";
      let title = opt.title || "Embedded PDF";
      let assumptionMode = typeof opt.assumptionMode === "boolean" ? opt.assumptionMode : true;
      let forcePDFJS = typeof opt.forcePDFJS === "boolean" ? opt.forcePDFJS : false;
      let supportRedirect = typeof opt.supportRedirect === "boolean" ? opt.supportRedirect : false;
      let omitInlineStyles = typeof opt.omitInlineStyles === "boolean" ? opt.omitInlineStyles : false;
      typeof opt.suppressConsole === "boolean" ? opt.suppressConsole : false;
      let forceIframe = typeof opt.forceIframe === "boolean" ? opt.forceIframe : false;
      let forceObject = typeof opt.forceObject === "boolean" ? opt.forceObject : false;
      let PDFJS_URL = opt.PDFJS_URL || false;
      let targetNode = getTargetElement(selector);
      let fallbackHTML = "";
      let pdfOpenFragment = "";
      let fallbackHTML_default = "<p>This browser does not support inline PDFs. Please download the PDF to view it: <a href='[url]'>Download PDF</a></p>";
      if (typeof url !== "string") {
        return embedError();
      }
      if (!targetNode) {
        return embedError();
      }
      if (page) {
        pdfOpenParams.page = page;
      }
      pdfOpenFragment = buildURLFragmentString(pdfOpenParams);
      if (forcePDFJS && PDFJS_URL) {
        return generatePDFJSMarkup(targetNode, url, pdfOpenFragment, PDFJS_URL, id, omitInlineStyles);
      }
      if (supportsPDFs || assumptionMode && !isMobileDevice) {
        let embedtype = forceIframe || supportRedirect || isSafariDesktop ? "iframe" : forceObject ? "object" : "embed";
        return generatePDFObjectMarkup(embedtype, targetNode, targetSelector, url, pdfOpenFragment, width, height, id, title, omitInlineStyles);
      }
      if (PDFJS_URL) {
        return generatePDFJSMarkup(targetNode, url, pdfOpenFragment, PDFJS_URL, id, omitInlineStyles);
      }
      {
        fallbackHTML = typeof fallbackLink === "string" ? fallbackLink : fallbackHTML_default;
        targetNode.innerHTML = fallbackHTML.replace(/\[url\]/g, url);
      }
      return embedError();
    };
    return {
      embed: function(a, b, c) {
        return embed(a, b, c);
      },
      pdfobjectversion: /* @__PURE__ */ function() {
        return pdfobjectversion;
      }(),
      supportsPDFs: /* @__PURE__ */ function() {
        return supportsPDFs;
      }()
    };
  });
  /**
   * @package     EmbedPress
   * @author      EmbedPress <help@embedpress.com>
   * @copyright   Copyright (C) 2018 EmbedPress. All rights reserved.
   * @license     GPLv2 or later
   * @since       1.0
   */
  (function($, String2, embedpressPreviewData2, undefined$1) {
    $(window.document).ready(function() {
      String2.prototype.capitalizeFirstLetter = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
      };
      String2.prototype.isValidUrl = function() {
        var rule = /^(https?|embedpresss?):\/\//i;
        return rule.test(this.toString());
      };
      String2.prototype.hasShortcode = function(shortcode) {
        var shortcodeRule = new RegExp("\\[" + shortcode + "(?:\\]|.+?\\])", "ig");
        return !!this.toString().match(shortcodeRule);
      };
      String2.prototype.stripShortcode = function(shortcode) {
        var stripRule = new RegExp("(\\[" + shortcode + "(?:\\]|.+?\\])|\\[\\/" + shortcode + "\\])", "ig");
        return this.toString().replace(stripRule, "");
      };
      String2.prototype.setShortcodeAttribute = function(attr, value, shortcode, replaceInsteadOfMerge) {
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
            for (var ats in attributes) {
              parsedAttributes.push(ats + '="' + attributes[ats] + '"');
            }
            subject = "[" + shortcode + " " + parsedAttributes.join(" ") + "]" + subject.stripShortcode(shortcode) + "[/" + shortcode + "]";
          } else {
            subject = "[" + shortcode + "]" + subject.stripShortcode(shortcode) + "[/" + shortcode + "]";
          }
          return subject;
        } else {
          return subject;
        }
      };
      String2.prototype.getShortcodeAttributes = function(shortcode) {
        var subject = this.toString();
        if (subject.hasShortcode(shortcode)) {
          var attributes = {};
          var propertiesString = new RegExp(/\[embed\s*(.*?)\]/ig).exec(subject)[1];
          if (propertiesString.length > 0) {
            var extractAttributesRule = new RegExp(/(\!?\w+-?\w*)(?:="(.+?)")?/ig);
            var match;
            while (match = extractAttributesRule.exec(propertiesString)) {
              var attrName = match[1];
              var attrValue;
              if (match[2] === undefined$1) {
                if (attrName.toLowerCase() !== "class") {
                  if (attrName.indexOf("!") === 0) {
                    attrName = attrName.replace("!", "");
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
      };
      String2.prototype.isBoolean = function() {
        var subject = this.toString().trim().toLowerCase();
        return subject.isTrue(false) || subject.isFalse();
      };
      String2.prototype.isTrue = function(defaultValue) {
        var subject = this.toString().trim().toLowerCase();
        defaultValue = typeof defaultValue === undefined$1 ? true : defaultValue;
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
      String2.prototype.isFalse = function() {
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
      var SHORTCODE_REGEXP = new RegExp("\\[/?" + embedpressPreviewData2.shortcode + "\\]", "gi");
      var EmbedPress = function() {
        var self = this;
        var PLG_SYSTEM_ASSETS_CSS_PATH = embedpressPreviewData2.assetsUrl + "css";
        var PLG_CONTENT_ASSETS_CSS_PATH = PLG_SYSTEM_ASSETS_CSS_PATH;
        self.params = {
          baseUrl: "",
          versionUID: "0"
        };
        self.iOS = /iPad|iPod|iPhone/.test(window.navigator.userAgent);
        self.activeWrapper = null;
        self.activeWrapperForModal = null;
        self.activeControllerPanel = null;
        self.loadedEditors = [];
        self.init = function(params) {
          $.extend(self.params, params);
          if (self.iOS) {
            $(window.document.body).css("cursor", "pointer");
          }
          $(self.onReady);
        };
        self.addEvent = function(event, element, callback) {
          if (typeof element.on !== "undefined") {
            element.on(event, callback);
          } else {
            if (element["on" + event.capitalizeFirstLetter()]) {
              element["on" + event.capitalizeFirstLetter()].add(callback);
            }
          }
        };
        self.isEmpty = function(list) {
          return list.length === 0;
        };
        self.isDefined = function(attribute) {
          return typeof attribute !== "undefined" && attribute !== null;
        };
        self.makeId = function() {
          var text = "";
          var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
          for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
          return text;
        };
        self.loadAsyncDynamicJsCodeFromElement = function(subject, wrapper2, editorInstance) {
          subject = $(subject);
          if (subject.prop("tagName") && subject.prop("tagName").toLowerCase() === "script") {
            var scriptSrc = subject.attr("src") || null;
            if (!scriptSrc) {
              self.addScriptDeclaration(wrapper2, subject.html(), editorInstance);
            } else {
              self.addScript(scriptSrc, null, wrapper2, editorInstance);
            }
          } else {
            var innerScriptsList = $("script", subject);
            if (innerScriptsList.length > 0) {
              $.each(innerScriptsList, function(innerScriptIndex, innerScript) {
                self.loadAsyncDynamicJsCodeFromElement(innerScript, wrapper2, editorInstance);
              });
            }
          }
        };
        self.onReady = function() {
          var findEditors = function() {
            var interval = window.setInterval(
              function() {
                var editorsFound = self.getEditors();
                if (editorsFound.length) {
                  self.loadedEditors = editorsFound;
                  for (var editorIndex = 0; editorIndex < self.loadedEditors.length; editorIndex++) {
                    self.onFindEditor(self.loadedEditors[editorIndex]);
                  }
                  window.clearInterval(interval);
                  return self.loadedEditors;
                }
              },
              250
            );
          };
          if (self.tinymceIsAvailable()) {
            findEditors();
          }
          if (typeof FLLightbox !== "undefined") {
            $.each(FLLightbox._instances, function(index) {
              FLLightbox._instances[index].on("open", function() {
                setTimeout(function() {
                  findEditors();
                }, 500);
              });
              FLLightbox._instances[index].on("didHideLightbox", function() {
                setTimeout(function() {
                  findEditors();
                }, 500);
              });
            });
          }
        };
        self.tinymceIsAvailable = function() {
          return typeof window.tinymce === "object" || typeof window.tinyMCE === "object";
        };
        self.controllerPanelIsActive = function() {
          return typeof self.activeControllerPanel !== "undefined" && self.activeControllerPanel !== null;
        };
        self.getEditors = function() {
          if (!window.tinymce || !window.tinymce.editors || window.tinymce.editors.length === 0) {
            return [];
          }
          return window.tinymce.editors || [];
        };
        self.getParsedContent = function(content, onsuccess) {
          $.ajax({
            type: "POST",
            url: self.params.baseUrl + "wp-admin/admin-ajax.php",
            data: {
              action: "embedpress_do_ajax_request",
              subject: content
            },
            success: onsuccess,
            dataType: "json",
            async: true
          });
        };
        self.addStylesheet = function(url, editorInstance) {
          var head = editorInstance.getDoc().getElementsByTagName("head")[0];
          var $style = $('<link rel="stylesheet" type="text/css" href="' + url + '">');
          $style.appendTo(head);
        };
        self.convertURLSchemeToPattern = function(scheme) {
          var prefix = "(.*)((?:http|embedpress)s?:\\/\\/(?:www\\.)?", suffix = "[\\/]?)(.*)";
          scheme = scheme.replace(/\*/g, "[a-zA-Z0-9=&_\\-\\?\\.\\/!\\+%:@,#]+");
          scheme = scheme.replace(/\./g, "\\.");
          scheme = scheme.replace(/\//g, "\\/");
          return prefix + scheme + suffix;
        };
        self.getProvidersURLPatterns = function() {
          var patterns = [];
          self.each(embedpressPreviewData2.urlSchemes, function convertEachURLSchemesToPattern(scheme) {
            patterns.push(self.convertURLSchemeToPattern(scheme));
          });
          return patterns;
        };
        self.addScript = function(source, callback, wrapper2, editorInstance) {
          var doc = editorInstance.getDoc();
          if (typeof wrapper2 === "undefined" || !wrapper2) {
            wrapper2 = $(doc.getElementsByTagName("head")[0]);
          }
          var $script = $(doc.createElement("script"));
          $script.attr("async", 1);
          if (typeof callback === "function") {
            $script.ready(callback);
          }
          $script.attr("src", source);
          wrapper2.append($script);
        };
        self.addScriptDeclaration = function(wrapper2, declaration, editorInstance) {
          var doc = editorInstance.getDoc(), $script = $(doc.createElement("script"));
          $(wrapper2).append($script);
          $script.text(declaration);
        };
        self.addURLsPlaceholder = function(node, url, editorInstance) {
          var uid = self.makeId();
          var wrapperClasses = ["embedpress_wrapper", "embedpress_placeholder", "wpview", "wpview-wrap"];
          var shortcodeAttributes = node.value.getShortcodeAttributes(embedpressPreviewData2.shortcode);
          var customAttributes = shortcodeAttributes;
          if (!!Object.keys(shortcodeAttributes).length) {
            var specialAttributes = ["class", "href", "data-href"];
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
            shortcodeAttributes["data-responsive"] = "false";
          }
          var wrapper2 = new self.Node("div", 1);
          var wrapperSettings = {
            "class": Array.from(new Set(wrapperClasses)).join(" "),
            "data-url": url,
            "data-uid": uid,
            "id": "embedpress_wrapper_" + uid,
            "data-loading-text": "Loading your embed..."
          };
          wrapperSettings = $.extend({}, wrapperSettings, shortcodeAttributes);
          if (wrapperSettings.class.indexOf("is-loading") === -1) {
            wrapperSettings.class += " is-loading";
          }
          wrapper2.attr(wrapperSettings);
          var panel = new self.Node("div", 1);
          panel.attr({
            "id": "embedpress_controller_panel_" + uid,
            "class": "embedpress_controller_panel embedpress_ignore_mouseout hidden"
          });
          wrapper2.append(panel);
          function createGhostNode(htmlTag, content) {
            htmlTag = htmlTag || "span";
            content = content || "&nbsp;";
            var ghostNode = new self.Node(htmlTag, 1);
            ghostNode.attr({
              "class": "hidden"
            });
            var ghostText = new self.Node("#text", 3);
            ghostText.value = content;
            ghostNode.append(ghostText);
            return ghostNode;
          }
          var editButton = new self.Node("div", 1);
          editButton.attr({
            "id": "embedpress_button_edit_" + uid,
            "class": "embedpress_ignore_mouseout embedpress_controller_button"
          });
          var editButtonIcon = new self.Node("div", 1);
          editButtonIcon.attr({
            "class": "embedpress-icon-pencil embedpress_ignore_mouseout"
          });
          editButtonIcon.append(createGhostNode());
          editButton.append(editButtonIcon);
          panel.append(editButton);
          var removeButton = new self.Node("div", 1);
          removeButton.attr({
            "id": "embedpress_button_remove_" + uid,
            "class": "embedpress_ignore_mouseout embedpress_controller_button"
          });
          var removeButtonIcon = new self.Node("div", 1);
          removeButtonIcon.attr({
            "class": "embedpress-icon-x embedpress_ignore_mouseout"
          });
          removeButtonIcon.append(createGhostNode());
          removeButton.append(removeButtonIcon);
          panel.append(removeButton);
          node.value = node.value.trim();
          node.replace(wrapper2);
          window.setTimeout(function() {
            self.parseContentAsync(uid, url, customAttributes, editorInstance);
          }, 200);
          return wrapper2;
        };
        self.parseContentAsync = function(uid, url, customAttributes, editorInstance) {
          customAttributes = typeof customAttributes === "undefined" ? {} : customAttributes;
          url = self.decodeEmbedURLSpecialChars(url, true, customAttributes);
          var rawUrl = url.stripShortcode(embedpressPreviewData2.shortcode);
          $(self).triggerHandler("EmbedPress.beforeEmbed", {
            "url": rawUrl,
            "meta": {
              "attributes": customAttributes || {}
            }
          });
          self.getParsedContent(url, function getParsedContentCallback(result) {
            var embeddedContent = (typeof result.data === "object" ? result.data.embed : result.data).stripShortcode(embedpressPreviewData2.shortcode);
            var $wrapper = $(self.getElementInContentById("embedpress_wrapper_" + uid, editorInstance));
            var wrapperParent = $($wrapper.parent());
            if (wrapperParent.prop("tagName") && wrapperParent.prop("tagName").toUpperCase() === "P") {
              wrapperParent.replaceWith($wrapper);
              var nextSibling = $($wrapper).next();
              if (!nextSibling.length || nextSibling.prop("tagName").toUpperCase() !== "P") ;
              nextSibling = null;
            }
            wrapperParent = null;
            if (rawUrl === embeddedContent) {
              $wrapper.replaceWith($("<p>" + rawUrl + "</p>"));
              return;
            }
            $wrapper.removeClass("is-loading");
            var $content;
            try {
              $content = $(embeddedContent);
            } catch (err) {
              $content = $("<div>");
              $content.html(embeddedContent);
            }
            if (!$("iframe", $content).length && result.data.provider_name !== "Infogram") {
              var contentWrapper = $($content).clone();
              contentWrapper.html("");
              $wrapper.removeClass("embedpress_placeholder");
              $wrapper.append(contentWrapper);
              setTimeout(function() {
                editorInstance.undoManager.transact(function() {
                  var iframe = editorInstance.getDoc().createElement("iframe");
                  iframe.src = tinymce.Env.ie ? 'javascript:""' : "";
                  iframe.frameBorder = "0";
                  iframe.allowTransparency = "true";
                  iframe.scrolling = "no";
                  iframe.class = "wpview-sandbox";
                  iframe.style.width = "100%";
                  contentWrapper.append(iframe);
                  var iframeWindow = iframe.contentWindow;
                  if (!iframeWindow) {
                    return;
                  }
                  var iframeDoc = iframeWindow.document;
                  $(iframe).load(function() {
                    var maximumChecksAllowed = 8;
                    var checkIndex = 0;
                    var checkerInterval = setInterval(function() {
                      if (checkIndex === maximumChecksAllowed) {
                        clearInterval(checkerInterval);
                        setTimeout(function() {
                          $wrapper.css("width", iframe.width);
                          $wrapper.css("height", iframe.height);
                        }, 100);
                      } else {
                        if (customAttributes.height) {
                          iframe.height = customAttributes.height;
                          iframe.style.height = customAttributes.height + "px";
                        } else {
                          iframe.height = $("body", iframeDoc).height();
                        }
                        if (customAttributes.width) {
                          iframe.width = customAttributes.width;
                          iframe.style.width = customAttributes.width + "px";
                        } else {
                          iframe.width = $("body", iframeDoc).width();
                        }
                        checkIndex++;
                      }
                    }, 250);
                  });
                  iframeDoc.open();
                  iframeDoc.write(
                    '<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><style>html {background: transparent;padding: 0;margin: 0;}body#wpview-iframe-sandbox {background: transparent;padding: 1px 0 !important;margin: -1px 0 0 !important;}body#wpview-iframe-sandbox:before,body#wpview-iframe-sandbox:after {display: none;content: "";}</style></head><body id="wpview-iframe-sandbox" class="' + editorInstance.getBody().className + '" style="display: inline-block; width: 100%;" >' + $content.html() + "</body></html>"
                  );
                  iframeDoc.close();
                });
              }, 50);
            } else {
              $wrapper.removeClass("embedpress_placeholder");
              self.appendElementsIntoWrapper($content, $wrapper, editorInstance);
            }
            $wrapper.append($('<span class="wpview-end"></span>'));
            if (result && result.data && typeof result.data === "object") {
              result.data.width = $($wrapper).width();
              result.data.height = $($wrapper).height();
            }
            $(self).triggerHandler("EmbedPress.afterEmbed", {
              "meta": result.data,
              "url": rawUrl,
              "wrapper": $wrapper
            });
          });
        };
        self.appendElementsIntoWrapper = function(elementsList, wrapper2, editorInstance) {
          if (elementsList.length > 0) {
            $.each(elementsList, function appendElementIntoWrapper(elementIndex, element) {
              if (element.tagName && element.tagName.toLowerCase() !== "script") {
                wrapper2.append($(element));
                if (element.tagName.toLowerCase() === "iframe") {
                  $(element).ready(function() {
                    window.setTimeout(function() {
                      $.each(editorInstance.dom.select("div.embedpress_wrapper iframe"), function(elementIndex2, iframe) {
                        self.fixIframeSize(iframe);
                      });
                    }, 300);
                  });
                } else if (element.tagName.toLowerCase() === "div") {
                  if ($("img", $(element)).length || $("blockquote", wrapper2).length) {
                    $($(element).parents(".embedpress_wrapper").get(0)).addClass("dynamic-width");
                  }
                  $(element).css("max-width", $($(element).parents("body").get(0)).width());
                }
              }
              self.loadAsyncDynamicJsCodeFromElement(element, wrapper2, editorInstance);
            });
          }
          return wrapper2;
        };
        self.encodeEmbedURLSpecialChars = function(content) {
          if (content.match(SHORTCODE_REGEXP)) {
            var subject = content.replace(SHORTCODE_REGEXP, "");
            if (!subject.isValidUrl()) {
              return content;
            }
            content = subject;
            subject = null;
          }
          content = content.replace(/http(s?)\:\/\//i, "embedpress$1://");
          content = content.replace("@", "::__at__::").trim();
          return content;
        };
        self.decodeEmbedURLSpecialChars = function(content, applyShortcode, attributes) {
          var encodingRegexpRule = /embedpress(s?):\/\//;
          applyShortcode = typeof applyShortcode === "undefined" ? true : applyShortcode;
          attributes = typeof attributes === "undefined" ? {} : attributes;
          var isEncoded = content.match(encodingRegexpRule);
          content = content.replace(/embedpress(s?):\/\//, "http$1://");
          content = content.replace("::__at__::", "@").trim();
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
            var shortcode = "[" + embedpressPreviewData2.shortcode;
            if (!!Object.keys(attributes).length) {
              var attrValue;
              for (var attrName in attributes) {
                attrValue = attributes[attrName];
                if (attrName.toLowerCase() === "class" && !attrValue.length) ;
                else {
                  if (attrValue.isBoolean()) {
                    shortcode += " ";
                    if (attrValue.isFalse()) {
                      shortcode += "!";
                    }
                    shortcode += attrName;
                  } else {
                    shortcode += " " + attrName + '="' + attrValue + '"';
                  }
                }
              }
              attrValue = attrName = null;
            }
            content = shortcode + "]" + content + "[/" + embedpressPreviewData2.shortcode + "]";
          }
          return content;
        };
        self.onFindEditor = function(editorInstance) {
          self.each = tinymce.each;
          self.extend = tinymce.extend;
          self.JSON = tinymce.util.JSON;
          self.Node = tinymce.html.Node;
          function onFindEditorCallback() {
            $(window.document.getElementsByTagName("head")[0]).append($('<link rel="stylesheet" type="text/css" href="' + (PLG_SYSTEM_ASSETS_CSS_PATH + "/vendor/bootstrap/bootstrap.min.css?v=" + self.params.versionUID) + '">'));
            self.addStylesheet(PLG_SYSTEM_ASSETS_CSS_PATH + "/font.css?v=" + self.params.versionUID, editorInstance, editorInstance);
            self.addStylesheet(PLG_SYSTEM_ASSETS_CSS_PATH + "/preview.css?v=" + self.params.versionUID, editorInstance, editorInstance);
            self.addStylesheet(PLG_CONTENT_ASSETS_CSS_PATH + "/embedpress.css?v=" + self.params.versionUID, editorInstance, editorInstance);
            self.addEvent("nodechange", editorInstance, self.onNodeChange);
            self.addEvent("keydown", editorInstance, function(e) {
              self.onKeyDown(e, editorInstance);
            });
            var onUndoCallback = function(e) {
              self.onUndo(e, editorInstance);
            };
            self.addEvent("undo", editorInstance, onUndoCallback);
            self.addEvent("undo", editorInstance.undoManager, onUndoCallback);
            var doc = editorInstance.getDoc();
            $(doc).on("mouseenter", ".embedpress_wrapper", function(e) {
              self.onMouseEnter(e, editorInstance);
            });
            $(doc).on("mouseout", ".embedpress_wrapper", self.onMouseOut);
            $(doc).on("mousedown", ".embedpress_wrapper > .embedpress_controller_panel", function(e) {
              self.cancelEvent(e, editorInstance);
            });
            doc = null;
            editorInstance.parser.addNodeFilter("#text", function addNodeFilterIntoParser(nodes, arg) {
              self.each(nodes, function eachNodeInParser(node) {
                if (node.parent === null && node.prev === null) {
                  return;
                }
                var subject = node.value.trim();
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
                subject = node.value.stripShortcode(embedpressPreviewData2.shortcode).trim();
                var patterns = self.getProvidersURLPatterns();
                (function tryToMatchContentAgainstUrlPatternWithIndex(urlPatternIndex) {
                  if (urlPatternIndex < patterns.length) {
                    var urlPattern = patterns[urlPatternIndex];
                    var urlPatternRegex = new RegExp(urlPattern);
                    var url = self.decodeEmbedURLSpecialChars(subject).trim();
                    var matches = url.match(urlPatternRegex);
                    if (matches && matches !== null && !!matches.length) {
                      url = self.encodeEmbedURLSpecialChars(matches[2]);
                      var wrapper2 = self.addURLsPlaceholder(node, url, editorInstance);
                      setTimeout(function() {
                        var doc2 = editorInstance.getDoc();
                        if (doc2 === null) {
                          return;
                        }
                        var previewWrapper = $(doc2.querySelector("#" + wrapper2.attributes.map["id"]));
                        var previewWrapperParent = $(previewWrapper.parent());
                        if (previewWrapperParent && previewWrapperParent.prop("tagName") && previewWrapperParent.prop("tagName").toUpperCase() === "P") {
                          previewWrapperParent.replaceWith(previewWrapper);
                        }
                        var previewWrapperOlderSibling = previewWrapper.prev();
                        if (previewWrapperOlderSibling && previewWrapperOlderSibling.prop("tagName") && previewWrapperOlderSibling.prop("tagName").toUpperCase() === "P" && !previewWrapperOlderSibling.html().replace(/\&nbsp\;/i, "").length) {
                          previewWrapperOlderSibling.remove();
                        } else {
                          if (typeof previewWrapperOlderSibling.html() !== "undefined") {
                            if (previewWrapperOlderSibling.html().match(/<[\/]?br>/)) {
                              if (!previewWrapperOlderSibling.prev().length) {
                                previewWrapperOlderSibling.remove();
                              }
                            }
                          }
                        }
                        var previewWrapperYoungerSibling = previewWrapper.next();
                        if (previewWrapperYoungerSibling && previewWrapperYoungerSibling.length && previewWrapperYoungerSibling.prop("tagName").toUpperCase() === "P") {
                          if (!previewWrapperYoungerSibling.next().length && !previewWrapperYoungerSibling.html().replace(/\&nbsp\;/i, "").length) {
                            previewWrapperYoungerSibling.remove();
                            $("<p>&nbsp;</p>").insertAfter(previewWrapper);
                          }
                        } else {
                          $("<p>&nbsp;</p>").insertAfter(previewWrapper);
                        }
                        setTimeout(function() {
                          editorInstance.selection.select(editorInstance.getBody(), true);
                          editorInstance.selection.collapse(false);
                        }, 50);
                      }, 50);
                    } else {
                      tryToMatchContentAgainstUrlPatternWithIndex(urlPatternIndex + 1);
                    }
                  }
                })(0);
              });
            });
            editorInstance.serializer.addNodeFilter("div", function addNodeFilterIntoSerializer(nodes, arg) {
              self.each(nodes, function eachNodeInSerializer(node) {
                if (node.parent === null && node.prev === null) {
                  return;
                }
                var nodeClasses = (node.attributes.map.class || "").split(" ");
                var wrapperFactoryClasses = ["embedpress_wrapper", "embedpress_placeholder", "wpview", "wpview-wrap"];
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
                  var p = new self.Node("p", 1);
                  var text = new self.Node("#text", 3);
                  text.value = node.attributes.map && typeof node.attributes.map["data-url"] != "undefined" ? self.decodeEmbedURLSpecialChars(node.attributes.map["data-url"].trim(), true, customAttributes) : "";
                  p.append(text.clone());
                  node.replace(text);
                  text.replace(p);
                }
              });
            });
            editorInstance.serializer.addNodeFilter("p", function addNodeFilterIntoSerializer(nodes, arg) {
              self.each(nodes, function eachNodeInSerializer(node) {
                if (node.firstChild == node.lastChild) {
                  if (node.firstChild && "value" in node.firstChild && (node.firstChild.value === "&nbsp;" || !node.firstChild.value.trim().length)) {
                    node.remove();
                  }
                }
              });
            });
            tinymce.each(tinymce.editors, function onEachEditor(editor) {
              self.addEvent("loadContent", editor, function onInitEditor(ed) {
                self.configureWrappers(editor);
              });
            });
            window.setTimeout(
              function afterTimeoutOnFindEditor() {
                editorInstance.load();
              },
              // If in JCE the user see the placeholder (img) instead of the iframe after load/refresh the pagr, this time is too short
              500
            );
          }
          var checkTimesLimit = 100;
          var checkIndex = 0;
          var statusCheckerInterval = setInterval(function() {
            if (checkIndex === checkTimesLimit) {
              clearInterval(statusCheckerInterval);
              alert("For some reason TinyMCE was not fully loaded yet. Please, refresh the page and try again.");
            } else {
              var doc = editorInstance.getDoc();
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
          if ($(iframe).width() > maxWidth && !$(iframe).data("size-fixed")) {
            var ratio = $(iframe).height() / $(iframe).width();
            $(iframe).width(maxWidth);
            $(iframe).height(maxWidth * ratio);
            $(iframe).css("max-width", maxWidth);
            $(iframe).attr("max-width", maxWidth);
            $(iframe).data("size-fixed", true);
          }
        };
        self.onMouseEnter = function(e, editorInstance) {
          self.displayPreviewControllerPanel($(e.currentTarget), editorInstance);
        };
        self.onMouseOut = function(e) {
          if (self.isDefined(e.toElement)) {
            if (e.toElement.parentElement == e.fromElement || $(e.toElement).hasClass("embedpress_ignore_mouseout")) {
              return false;
            }
          }
          if (self.isDefined(e.relatedTarget)) {
            if ($(e.relatedTarget).hasClass("embedpress_ignore_mouseout")) {
              return false;
            }
          }
          self.hidePreviewControllerPanel();
        };
        self.onPaste = function(plugin, args) {
          var urlPatternRegex = new RegExp(/(https?):\/\/([w]{3}\.)?.+?(?:\s|$)/i);
          var urlPatternsList = self.getProvidersURLPatterns();
          var contentLines = args.content.split(/\n/g) || [];
          contentLines = contentLines.map(function(line, itemIndex) {
            if (line.match(urlPatternRegex)) {
              let termsList = line.trim().split(/\s+/);
              termsList = termsList.map(function(term, termIndex) {
                var match = term.match(urlPatternRegex);
                if (match) {
                  for (var urlPatternIndex = 0; urlPatternIndex < urlPatternsList.length; urlPatternIndex++) {
                    var urlPattern = new RegExp(urlPatternsList[urlPatternIndex]);
                    if (urlPattern.test(term)) {
                      return "</p><p>" + match[0] + "</p><p>";
                    }
                  }
                }
                return term;
              });
              termsList[termsList.length - 1] = termsList[termsList.length - 1] + "<br>";
              line = termsList.join(" ");
            }
            return line;
          });
          var content = contentLines.join("");
          if (content.replace(/<br>$/, "") !== args.content) {
            args.content = "<p>" + args.content + "</p>";
          }
        };
        self.onNodeChange = function(e) {
          if (e.element.tagName === "BR") {
            if (e.parents.length > 0) {
              $.each(e.parents, function(index, parent) {
                if ($(parent).hasClass("embedpress_wrapper")) {
                  $(parent).replaceWith($("<br>"));
                }
              });
            }
          } else if (e.element.tagName === "IFRAME") {
            if (e.parents.length > 0) {
              $.each(e.parents, function(index, parent) {
                parent = $(parent);
                if (parent.hasClass("embedpress_wrapper")) {
                  var wrapper2 = $(".embedpress-wrapper", parent);
                  if (wrapper2.length > 1) {
                    wrapper2.get(0).remove();
                  }
                }
              });
            }
          }
        };
        self.onKeyDown = function(e, editorInstance) {
          var node = editorInstance.selection.getNode();
          if (e.keyCode == 8 || e.keyCode == 46) {
            if (node.nodeName.toLowerCase() === "p") {
              var children = $(node).children();
              if (children.length > 0) {
                $.each(children, function() {
                  if ($(this).hasClass("embedpress_wrapper") || $(this).hasClass("embedpress_ignore_mouseout")) {
                    $(this).remove();
                    editorInstance.focus();
                  }
                });
              }
            }
          } else {
            var arrowsKeyCodes = [37, 38, 39, 40];
            if (arrowsKeyCodes.indexOf(e.keyCode) == -1) {
              if ($(node).hasClass("embedpress_wrapper") || $(node).hasClass("embedpress_ignore_mouseout")) {
                if (e.keyCode == 13) {
                  wrapper = $(self.getWrapperFromChild(node));
                  if (wrapper.length > 0) {
                    var tmpId = "__embedpress__tmp_" + self.makeId();
                    wrapper.after($('<span id="' + tmpId + '"></span>'));
                    var span = editorInstance.dom.select("span#" + tmpId)[0];
                    editorInstance.selection.select(span);
                    $(span).remove();
                  }
                  return true;
                } else {
                  return self.cancelEvent(e, editorInstance);
                }
              }
            }
          }
          return true;
        };
        self.getWrapperFromChild = function(element) {
          if ($(element).hasClass("embedpress_wrapper")) {
            return element;
          } else {
            var $parent = $(element).parent();
            if ($parent.length > 0) {
              return self.getWrapperFromChild($parent[0]);
            }
          }
          return false;
        };
        self.onUndo = function(e, editorInstance) {
          editorInstance.load();
        };
        self.cancelEvent = function(e, editorInstance) {
          e.preventDefault();
          e.stopPropagation();
          editorInstance.dom.events.cancel();
          return false;
        };
        self.onClickEditButton = function(e, editorInstance) {
          self.cancelEvent(e, editorInstance);
          self.activeWrapperForModal = self.activeWrapper;
          var $wrapper = self.activeWrapperForModal;
          var wrapperUid = $wrapper.prop("id").replace("embedpress_wrapper_", "");
          var customAttributes = {};
          var $embedInnerWrapper = $(".embedpress-wrapper", $wrapper);
          var embedItem = $("iframe", $wrapper);
          if (!embedItem.length) {
            embedItem = null;
          }
          if ($embedInnerWrapper.length > 1) {
            $.each($embedInnerWrapper[0].attributes, function() {
              if (this.specified) {
                if (this.name !== "class") {
                  customAttributes[this.name.replace("data-", "").toLowerCase()] = this.value;
                }
              }
            });
          }
          var embedWidth = embedItem && embedItem.width() || $embedInnerWrapper.data("width") || $embedInnerWrapper.width() || "";
          var embedHeight = embedItem && embedItem.height() || $embedInnerWrapper.data("height") || $embedInnerWrapper.height() || "";
          embedItem = $embedInnerWrapper = null;
          $('<div class="loader-indicator"><i class="embedpress-icon-reload"></i></div>').appendTo($wrapper);
          setTimeout(function() {
            $.ajax({
              type: "GET",
              url: self.params.baseUrl + "wp-admin/admin-ajax.php",
              data: {
                action: "embedpress_get_embed_url_info",
                url: self.decodeEmbedURLSpecialChars($wrapper.data("url"), false)
              },
              beforeSend: function(request, requestSettings) {
                $(".loader-indicator", $wrapper).addClass("is-loading");
              },
              success: function(response) {
                if (!response) {
                  bootbox.alert("Unable to get a valid response from the server.");
                  return;
                }
                if (response.canBeResponsive) {
                  var embedShouldBeResponsive = true;
                  if ("width" in customAttributes || "height" in customAttributes) {
                    embedShouldBeResponsive = false;
                  } else if ("responsive" in customAttributes && customAttributes["responsive"].isFalse()) {
                    embedShouldBeResponsive = false;
                  }
                }
                bootbox.dialog({
                  className: "embedpress-modal",
                  title: "Editing Embed properties",
                  message: '<form id="form-' + wrapperUid + '" embedpress><div class="row"><div class="col-md-12"><div class="form-group"><label for="input-url-' + wrapperUid + '">Url</label><input class="form-control" type="url" id="input-url-' + wrapperUid + '" value="' + self.decodeEmbedURLSpecialChars($wrapper.data("url"), false) + '"></div></div></div><div class="row">' + (response.canBeResponsive ? '<div class="col-md-12"><label>Responsive</label><div class="form-group"><label class="radio-inline"><input type="radio" name="input-responsive-' + wrapperUid + '" id="input-responsive-1-' + wrapperUid + '" value="1"' + (embedShouldBeResponsive ? ' checked="checked"' : "") + '> Yes</label><label class="radio-inline"><input type="radio" name="input-responsive-' + wrapperUid + '" id="input-responsive-0-' + wrapperUid + '" value="0"' + (!embedShouldBeResponsive ? ' checked="checked"' : "") + "> No</label></div></div>" : "") + '<div class="col-md-6"><div class="form-group"><label for="input-width-' + wrapperUid + '">Width</label><input class="form-control" type="integer" id="input-width-' + wrapperUid + '" value="' + embedWidth + '"' + (embedShouldBeResponsive ? " disabled" : "") + '></div></div><div class="col-md-6"><div class="form-group"><label for="input-height-' + wrapperUid + '">Height</label><input class="form-control" type="integer" id="input-height-' + wrapperUid + '" value="' + embedHeight + '"' + (embedShouldBeResponsive ? " disabled" : "") + "></div></div></div></form>",
                  buttons: {
                    danger: {
                      label: "Cancel",
                      className: "btn-default",
                      callback: function() {
                        self.activeWrapperForModal = null;
                      }
                    },
                    success: {
                      label: "Save",
                      className: "btn-primary",
                      callback: function() {
                        var $wrapper2 = self.activeWrapperForModal;
                        editorInstance.focus();
                        editorInstance.selection.select($wrapper2[0]);
                        $wrapper2.children().remove();
                        $wrapper2.remove();
                        if (response.canBeResponsive) {
                          if ($("#form-" + wrapperUid + ' input[name="input-responsive-' + wrapperUid + '"]:checked').val().isFalse()) {
                            var embedCustomWidth = $("#input-width-" + wrapperUid).val();
                            if (parseInt(embedCustomWidth) > 0) {
                              customAttributes["width"] = embedCustomWidth;
                            }
                            var embedCustomHeight = $("#input-height-" + wrapperUid).val();
                            if (parseInt(embedCustomHeight) > 0) {
                              customAttributes["height"] = embedCustomHeight;
                            }
                            customAttributes["responsive"] = "false";
                          } else {
                            delete customAttributes["width"];
                            delete customAttributes["height"];
                            customAttributes["responsive"] = "true";
                          }
                        } else {
                          var embedCustomWidth = $("#input-width-" + wrapperUid).val();
                          if (parseInt(embedCustomWidth) > 0) {
                            customAttributes["width"] = embedCustomWidth;
                          }
                          var embedCustomHeight = $("#input-height-" + wrapperUid).val();
                          if (parseInt(embedCustomHeight) > 0) {
                            customAttributes["height"] = embedCustomHeight;
                          }
                        }
                        var customAttributesList = [];
                        if (!!Object.keys(customAttributes).length) {
                          for (var attrName in customAttributes) {
                            customAttributesList.push(attrName + '="' + customAttributes[attrName] + '"');
                          }
                        }
                        var shortcode = "[" + embedpressPreviewData2.shortcode + (customAttributesList.length > 0 ? " " + customAttributesList.join(" ") : "") + "]" + $("#input-url-" + wrapperUid).val() + "[/" + embedpressPreviewData2.shortcode + "]";
                        editorInstance.execCommand("mceInsertContent", false, shortcode);
                        self.configureWrappers(editorInstance);
                      }
                    }
                  }
                });
                $("form[embedpress]").on("change", 'input[type="radio"]', function(e2) {
                  var self2 = $(this);
                  var form = self2.parents("form[embedpress]");
                  $('input[type="integer"]', form).prop("disabled", self2.val().isTrue());
                });
              },
              complete: function(request, textStatus) {
                $(".loader-indicator", $wrapper).removeClass("is-loading");
                setTimeout(function() {
                  $(".loader-indicator", $wrapper).remove();
                }, 350);
              },
              dataType: "json",
              async: true
            });
          }, 200);
          return false;
        };
        self.onClickRemoveButton = function(e, editorInstance) {
          self.cancelEvent(e, editorInstance);
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
              self.recursivelyAddClass(child, className);
            }
          });
        };
        self.setInterval = function(callback, time, timeout) {
          var elapsed = 0;
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
        self.configureWrappers = function(editorInstance) {
          window.setTimeout(
            function configureWrappersTimeOut() {
              var doc = editorInstance.getDoc(), $wrapper = null;
              var wrappers = doc.getElementsByClassName("embedpress_wrapper");
              if (wrappers.length > 0) {
                for (var i = 0; i < wrappers.length; i++) {
                  $wrapper = $(wrappers[i]);
                  if ($wrapper.data("configured") != true) {
                    window.setTimeout(function() {
                      self.recursivelyAddClass($wrapper, "embedpress_ignore_mouseout");
                    }, 500);
                    var interval = self.setInterval(function(iteraction) {
                      var $childIframes = $wrapper.find("iframe");
                      if ($childIframes.length > 0) {
                        $.each($childIframes, function(index, iframe) {
                          if ($(iframe).attr("id") !== "fb_xdm_frame_https" && $(iframe).attr("id") !== "fb_xdm_frame_http") {
                            $wrapper.css("width", $(iframe).width() + "px");
                            self.stopInterval(interval);
                          }
                        });
                      }
                    }, 500, 8e3);
                    $wrapper.data("configured", true);
                  }
                }
              }
            },
            200
          );
        };
        self.hidePreviewControllerPanel = function() {
          if (self.controllerPanelIsActive()) {
            $(self.activeControllerPanel).addClass("hidden");
            self.activeControllerPanel = null;
            self.activeWrapper = null;
          }
        };
        self.getElementInContentById = function(id, editorInstance) {
          var doc = editorInstance.getDoc();
          if (doc === null) {
            return;
          }
          return $(doc.getElementById(id));
        };
        self.displayPreviewControllerPanel = function($wrapper, editorInstance) {
          if (self.controllerPanelIsActive() && $wrapper !== self.activeWrapper) {
            self.hidePreviewControllerPanel();
          }
          if (!self.controllerPanelIsActive() && !$wrapper.hasClass("is-loading")) {
            var uid = $wrapper.data("uid");
            var $panel = self.getElementInContentById("embedpress_controller_panel_" + uid, editorInstance);
            if (!$panel.data("event-set")) {
              var $editButton = self.getElementInContentById("embedpress_button_edit_" + uid, editorInstance);
              var $removeButton = self.getElementInContentById("embedpress_button_remove_" + uid, editorInstance);
              self.addEvent("mousedown", $editButton, function(e) {
                self.onClickEditButton(e, editorInstance);
              });
              self.addEvent("mousedown", $removeButton, function(e) {
                self.onClickRemoveButton(e, editorInstance);
              });
              $panel.data("event-set", true);
            }
            var next = $panel.next()[0];
            if (typeof next !== "undefined") {
              if (next.nodeName.toLowerCase() === "iframe") {
                $panel.css("left", $(next).width() / 2);
              }
            }
            $panel.removeClass("hidden");
            self.activeControllerPanel = $panel;
            self.activeWrapper = $wrapper;
          }
        };
      };
      if (!window.EmbedPress) {
        window.EmbedPress = new EmbedPress();
      }
      window.EmbedPress.init(embedpressPreviewData2.previewSettings);
    });
  })(jQuery, String, embedpressPreviewData);
})();
//# sourceMappingURL=pdf-viewer.build.js.map
