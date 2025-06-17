/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/charenc/charenc.js":
/*!*****************************************!*\
  !*** ./node_modules/charenc/charenc.js ***!
  \*****************************************/
/***/ ((module) => {

var charenc = {
  // UTF-8 encoding
  utf8: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
    }
  },

  // Binary encoding
  bin: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      for (var bytes = [], i = 0; i < str.length; i++)
        bytes.push(str.charCodeAt(i) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      for (var str = [], i = 0; i < bytes.length; i++)
        str.push(String.fromCharCode(bytes[i]));
      return str.join('');
    }
  }
};

module.exports = charenc;


/***/ }),

/***/ "./node_modules/crypt/crypt.js":
/*!*************************************!*\
  !*** ./node_modules/crypt/crypt.js ***!
  \*************************************/
/***/ ((module) => {

(function() {
  var base64map
      = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',

  crypt = {
    // Bit-wise rotation left
    rotl: function(n, b) {
      return (n << b) | (n >>> (32 - b));
    },

    // Bit-wise rotation right
    rotr: function(n, b) {
      return (n << (32 - b)) | (n >>> b);
    },

    // Swap big-endian to little-endian and vice versa
    endian: function(n) {
      // If number given, swap endian
      if (n.constructor == Number) {
        return crypt.rotl(n, 8) & 0x00FF00FF | crypt.rotl(n, 24) & 0xFF00FF00;
      }

      // Else, assume array and swap all items
      for (var i = 0; i < n.length; i++)
        n[i] = crypt.endian(n[i]);
      return n;
    },

    // Generate an array of any length of random bytes
    randomBytes: function(n) {
      for (var bytes = []; n > 0; n--)
        bytes.push(Math.floor(Math.random() * 256));
      return bytes;
    },

    // Convert a byte array to big-endian 32-bit words
    bytesToWords: function(bytes) {
      for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
        words[b >>> 5] |= bytes[i] << (24 - b % 32);
      return words;
    },

    // Convert big-endian 32-bit words to a byte array
    wordsToBytes: function(words) {
      for (var bytes = [], b = 0; b < words.length * 32; b += 8)
        bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a hex string
    bytesToHex: function(bytes) {
      for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
      }
      return hex.join('');
    },

    // Convert a hex string to a byte array
    hexToBytes: function(hex) {
      for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
      return bytes;
    },

    // Convert a byte array to a base-64 string
    bytesToBase64: function(bytes) {
      for (var base64 = [], i = 0; i < bytes.length; i += 3) {
        var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
        for (var j = 0; j < 4; j++)
          if (i * 8 + j * 6 <= bytes.length * 8)
            base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
          else
            base64.push('=');
      }
      return base64.join('');
    },

    // Convert a base-64 string to a byte array
    base64ToBytes: function(base64) {
      // Remove non-base-64 characters
      base64 = base64.replace(/[^A-Z0-9+\/]/ig, '');

      for (var bytes = [], i = 0, imod4 = 0; i < base64.length;
          imod4 = ++i % 4) {
        if (imod4 == 0) continue;
        bytes.push(((base64map.indexOf(base64.charAt(i - 1))
            & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2))
            | (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
      }
      return bytes;
    }
  };

  module.exports = crypt;
})();


/***/ }),

/***/ "./node_modules/is-buffer/index.js":
/*!*****************************************!*\
  !*** ./node_modules/is-buffer/index.js ***!
  \*****************************************/
/***/ ((module) => {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}


/***/ }),

/***/ "./node_modules/md5/md5.js":
/*!*********************************!*\
  !*** ./node_modules/md5/md5.js ***!
  \*********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

(function(){
  var crypt = __webpack_require__(/*! crypt */ "./node_modules/crypt/crypt.js"),
      utf8 = (__webpack_require__(/*! charenc */ "./node_modules/charenc/charenc.js").utf8),
      isBuffer = __webpack_require__(/*! is-buffer */ "./node_modules/is-buffer/index.js"),
      bin = (__webpack_require__(/*! charenc */ "./node_modules/charenc/charenc.js").bin),

  // The core
  md5 = function (message, options) {
    // Convert to byte array
    if (message.constructor == String)
      if (options && options.encoding === 'binary')
        message = bin.stringToBytes(message);
      else
        message = utf8.stringToBytes(message);
    else if (isBuffer(message))
      message = Array.prototype.slice.call(message, 0);
    else if (!Array.isArray(message) && message.constructor !== Uint8Array)
      message = message.toString();
    // else, assume byte array already

    var m = crypt.bytesToWords(message),
        l = message.length * 8,
        a =  1732584193,
        b = -271733879,
        c = -1732584194,
        d =  271733878;

    // Swap endian
    for (var i = 0; i < m.length; i++) {
      m[i] = ((m[i] <<  8) | (m[i] >>> 24)) & 0x00FF00FF |
             ((m[i] << 24) | (m[i] >>>  8)) & 0xFF00FF00;
    }

    // Padding
    m[l >>> 5] |= 0x80 << (l % 32);
    m[(((l + 64) >>> 9) << 4) + 14] = l;

    // Method shortcuts
    var FF = md5._ff,
        GG = md5._gg,
        HH = md5._hh,
        II = md5._ii;

    for (var i = 0; i < m.length; i += 16) {

      var aa = a,
          bb = b,
          cc = c,
          dd = d;

      a = FF(a, b, c, d, m[i+ 0],  7, -680876936);
      d = FF(d, a, b, c, m[i+ 1], 12, -389564586);
      c = FF(c, d, a, b, m[i+ 2], 17,  606105819);
      b = FF(b, c, d, a, m[i+ 3], 22, -1044525330);
      a = FF(a, b, c, d, m[i+ 4],  7, -176418897);
      d = FF(d, a, b, c, m[i+ 5], 12,  1200080426);
      c = FF(c, d, a, b, m[i+ 6], 17, -1473231341);
      b = FF(b, c, d, a, m[i+ 7], 22, -45705983);
      a = FF(a, b, c, d, m[i+ 8],  7,  1770035416);
      d = FF(d, a, b, c, m[i+ 9], 12, -1958414417);
      c = FF(c, d, a, b, m[i+10], 17, -42063);
      b = FF(b, c, d, a, m[i+11], 22, -1990404162);
      a = FF(a, b, c, d, m[i+12],  7,  1804603682);
      d = FF(d, a, b, c, m[i+13], 12, -40341101);
      c = FF(c, d, a, b, m[i+14], 17, -1502002290);
      b = FF(b, c, d, a, m[i+15], 22,  1236535329);

      a = GG(a, b, c, d, m[i+ 1],  5, -165796510);
      d = GG(d, a, b, c, m[i+ 6],  9, -1069501632);
      c = GG(c, d, a, b, m[i+11], 14,  643717713);
      b = GG(b, c, d, a, m[i+ 0], 20, -373897302);
      a = GG(a, b, c, d, m[i+ 5],  5, -701558691);
      d = GG(d, a, b, c, m[i+10],  9,  38016083);
      c = GG(c, d, a, b, m[i+15], 14, -660478335);
      b = GG(b, c, d, a, m[i+ 4], 20, -405537848);
      a = GG(a, b, c, d, m[i+ 9],  5,  568446438);
      d = GG(d, a, b, c, m[i+14],  9, -1019803690);
      c = GG(c, d, a, b, m[i+ 3], 14, -187363961);
      b = GG(b, c, d, a, m[i+ 8], 20,  1163531501);
      a = GG(a, b, c, d, m[i+13],  5, -1444681467);
      d = GG(d, a, b, c, m[i+ 2],  9, -51403784);
      c = GG(c, d, a, b, m[i+ 7], 14,  1735328473);
      b = GG(b, c, d, a, m[i+12], 20, -1926607734);

      a = HH(a, b, c, d, m[i+ 5],  4, -378558);
      d = HH(d, a, b, c, m[i+ 8], 11, -2022574463);
      c = HH(c, d, a, b, m[i+11], 16,  1839030562);
      b = HH(b, c, d, a, m[i+14], 23, -35309556);
      a = HH(a, b, c, d, m[i+ 1],  4, -1530992060);
      d = HH(d, a, b, c, m[i+ 4], 11,  1272893353);
      c = HH(c, d, a, b, m[i+ 7], 16, -155497632);
      b = HH(b, c, d, a, m[i+10], 23, -1094730640);
      a = HH(a, b, c, d, m[i+13],  4,  681279174);
      d = HH(d, a, b, c, m[i+ 0], 11, -358537222);
      c = HH(c, d, a, b, m[i+ 3], 16, -722521979);
      b = HH(b, c, d, a, m[i+ 6], 23,  76029189);
      a = HH(a, b, c, d, m[i+ 9],  4, -640364487);
      d = HH(d, a, b, c, m[i+12], 11, -421815835);
      c = HH(c, d, a, b, m[i+15], 16,  530742520);
      b = HH(b, c, d, a, m[i+ 2], 23, -995338651);

      a = II(a, b, c, d, m[i+ 0],  6, -198630844);
      d = II(d, a, b, c, m[i+ 7], 10,  1126891415);
      c = II(c, d, a, b, m[i+14], 15, -1416354905);
      b = II(b, c, d, a, m[i+ 5], 21, -57434055);
      a = II(a, b, c, d, m[i+12],  6,  1700485571);
      d = II(d, a, b, c, m[i+ 3], 10, -1894986606);
      c = II(c, d, a, b, m[i+10], 15, -1051523);
      b = II(b, c, d, a, m[i+ 1], 21, -2054922799);
      a = II(a, b, c, d, m[i+ 8],  6,  1873313359);
      d = II(d, a, b, c, m[i+15], 10, -30611744);
      c = II(c, d, a, b, m[i+ 6], 15, -1560198380);
      b = II(b, c, d, a, m[i+13], 21,  1309151649);
      a = II(a, b, c, d, m[i+ 4],  6, -145523070);
      d = II(d, a, b, c, m[i+11], 10, -1120210379);
      c = II(c, d, a, b, m[i+ 2], 15,  718787259);
      b = II(b, c, d, a, m[i+ 9], 21, -343485551);

      a = (a + aa) >>> 0;
      b = (b + bb) >>> 0;
      c = (c + cc) >>> 0;
      d = (d + dd) >>> 0;
    }

    return crypt.endian([a, b, c, d]);
  };

  // Auxiliary functions
  md5._ff  = function (a, b, c, d, x, s, t) {
    var n = a + (b & c | ~b & d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._gg  = function (a, b, c, d, x, s, t) {
    var n = a + (b & d | c & ~d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._hh  = function (a, b, c, d, x, s, t) {
    var n = a + (b ^ c ^ d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._ii  = function (a, b, c, d, x, s, t) {
    var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };

  // Package private blocksize
  md5._blocksize = 16;
  md5._digestsize = 16;

  module.exports = function (message, options) {
    if (message === undefined || message === null)
      throw new Error('Illegal argument ' + message);

    var digestbytes = crypt.wordsToBytes(md5(message, options));
    return options && options.asBytes ? digestbytes :
        options && options.asString ? bin.bytesToString(digestbytes) :
        crypt.bytesToHex(digestbytes);
  };

})();


/***/ }),

/***/ "./src/Blocks/EmbedPress/block.json":
/*!******************************************!*\
  !*** ./src/Blocks/EmbedPress/block.json ***!
  \******************************************/
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","title":"EmbedPress","name":"embedpress/embedpress","category":"embedpress","description":"Embed content from 150+ providers with advanced customization options including YouTube, Vimeo, Google Docs, social media, and more.","apiVersion":2,"textdomain":"embedpress","editorScript":"embedpress-blocks-editor","editorStyle":"embedpress-blocks-editor-style","style":"embedpress-blocks-style","supports":{"anchor":true,"align":["wide","full"],"html":false}}');

/***/ }),

/***/ "./src/Blocks/EmbedPress/src/components/attributes.js":
/*!************************************************************!*\
  !*** ./src/Blocks/EmbedPress/src/components/attributes.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * EmbedPress Block Attributes
 *
 * Defines all the attributes for the EmbedPress block
 */

const attributes = {
  // Core attributes
  clientId: {
    type: 'string'
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
    default: '600'
  },
  width: {
    type: 'string',
    default: '600'
  },
  // State attributes
  editingURL: {
    type: 'boolean',
    default: false
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
  // Content Protection
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
  // Social Sharing
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
  shareFacebook: {
    type: 'boolean',
    default: true
  },
  shareTwitter: {
    type: 'boolean',
    default: true
  },
  sharePinterest: {
    type: 'boolean',
    default: true
  },
  shareLinkedin: {
    type: 'boolean',
    default: true
  },
  // Custom Branding
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
    type: 'string'
  },
  logoOpacity: {
    type: 'number',
    default: 0.6
  },
  // Custom Player
  customPlayer: {
    type: 'boolean',
    default: false
  },
  playerPreset: {
    type: 'string',
    default: 'preset-default'
  },
  playerColor: {
    type: 'string',
    default: '#5b4e96'
  },
  autoPause: {
    type: 'boolean',
    default: false
  },
  posterThumbnail: {
    type: 'string',
    default: ''
  },
  playerPip: {
    type: 'boolean',
    default: true
  },
  playerRestart: {
    type: 'boolean',
    default: true
  },
  playerRewind: {
    type: 'boolean',
    default: false
  },
  playerFastForward: {
    type: 'boolean',
    default: false
  },
  playerTooltip: {
    type: 'boolean',
    default: true
  },
  playerHideControls: {
    type: 'boolean',
    default: false
  },
  playerDownload: {
    type: 'boolean',
    default: false
  },
  // YouTube specific attributes
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
  videosize: {
    type: 'string',
    default: 'fixed'
  },
  starttime: {
    type: 'string'
  },
  endtime: {
    type: 'string'
  },
  autoplay: {
    type: 'boolean',
    default: false
  },
  muteVideo: {
    type: 'boolean',
    default: true
  },
  controls: {
    type: 'string'
  },
  fullscreen: {
    type: 'boolean',
    default: true
  },
  videoannotations: {
    type: 'boolean',
    default: true
  },
  progressbarcolor: {
    type: 'string',
    default: 'red'
  },
  closedcaptions: {
    type: 'boolean',
    default: true
  },
  modestbranding: {
    type: 'string'
  },
  relatedvideos: {
    type: 'boolean',
    default: true
  },
  // Vimeo specific attributes
  vstarttime: {
    type: 'string'
  },
  vautoplay: {
    type: 'boolean',
    default: false
  },
  vscheme: {
    type: 'string'
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
  // Wistia specific attributes
  wstarttime: {
    type: 'string'
  },
  wautoplay: {
    type: 'boolean',
    default: true
  },
  scheme: {
    type: 'string'
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
  // Instagram specific attributes
  instaLayout: {
    type: 'string',
    default: 'grid'
  },
  slidesShow: {
    type: 'string',
    default: '3'
  },
  slidesScroll: {
    type: 'string',
    default: '1'
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
  // Ad Manager attributes
  adManager: {
    type: 'boolean',
    default: false
  },
  adSource: {
    type: 'string',
    default: 'image'
  },
  adFileUrl: {
    type: 'string',
    default: ''
  },
  adWidth: {
    type: 'number',
    default: 300
  },
  adHeight: {
    type: 'number',
    default: 250
  },
  adXPosition: {
    type: 'number',
    default: 25
  },
  adYPosition: {
    type: 'number',
    default: 20
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (attributes);

/***/ }),

/***/ "./src/Blocks/EmbedPress/src/components/conditional-register.js":
/*!**********************************************************************!*\
  !*** ./src/Blocks/EmbedPress/src/components/conditional-register.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   embedpressConditionalRegisterBlockType: () => (/* binding */ embedpressConditionalRegisterBlockType)
/* harmony export */ });
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/**
 * WordPress dependencies
 */


/**
 * Conditionally register block type based on EmbedPress settings
 */
const embedpressConditionalRegisterBlockType = (metadata, settings) => {
  // Debug logging
  console.log('EmbedPress: Attempting to register block', metadata.name);
  console.log('EmbedPress: embedpressObj available:', typeof embedpressObj !== 'undefined');
  if (typeof embedpressObj !== 'undefined') {
    console.log('EmbedPress: embedpressObj:', embedpressObj);
    console.log('EmbedPress: active_blocks:', embedpressObj.active_blocks);
  }

  // Check if block is enabled in settings
  const isBlockEnabled = typeof embedpressObj !== 'undefined' && embedpressObj && embedpressObj.active_blocks && embedpressObj.active_blocks.embedpress;

  // Fallback: if embedpressObj is not available, register the block anyway
  // This ensures the block works even if there are localization issues
  // Also register if embedpressObj exists but active_blocks is undefined/empty
  const shouldRegister = isBlockEnabled || typeof embedpressObj === 'undefined' || typeof embedpressObj !== 'undefined' && !embedpressObj.active_blocks;
  console.log('EmbedPress: Block enabled in settings:', isBlockEnabled);
  console.log('EmbedPress: Should register block:', shouldRegister);
  if (shouldRegister) {
    console.log('EmbedPress: Registering block', metadata.name);
    (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(metadata.name, {
      ...metadata,
      ...settings
    });
  } else {
    console.warn('EmbedPress: Block not registered - disabled in settings', metadata.name);
  }
};

/***/ }),

/***/ "./src/Blocks/EmbedPress/src/components/edit.jsx":
/*!*******************************************************!*\
  !*** ./src/Blocks/EmbedPress/src/components/edit.jsx ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Edit)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _inspector_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./inspector.jsx */ "./src/Blocks/EmbedPress/src/components/inspector.jsx");
/* harmony import */ var _embed_controls_jsx__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./embed-controls.jsx */ "./src/Blocks/EmbedPress/src/components/embed-controls.jsx");
/* harmony import */ var _embed_loading_jsx__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./embed-loading.jsx */ "./src/Blocks/EmbedPress/src/components/embed-loading.jsx");
/* harmony import */ var _embed_placeholder_jsx__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./embed-placeholder.jsx */ "./src/Blocks/EmbedPress/src/components/embed-placeholder.jsx");
/* harmony import */ var _embed_wrap_jsx__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./embed-wrap.jsx */ "./src/Blocks/EmbedPress/src/components/embed-wrap.jsx");
/* harmony import */ var _icons_jsx__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./icons.jsx */ "./src/Blocks/EmbedPress/src/components/icons.jsx");
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./helper */ "./src/Blocks/EmbedPress/src/components/helper.js");
/* harmony import */ var md5__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! md5 */ "./node_modules/md5/md5.js");
/* harmony import */ var md5__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(md5__WEBPACK_IMPORTED_MODULE_13__);

/**
 * WordPress dependencies
 */






/**
 * Internal dependencies
 */









// Initialize block ID removal
(0,_helper__WEBPACK_IMPORTED_MODULE_12__.removedBlockID)();
function Edit(props) {
  const {
    attributes,
    setAttributes,
    clientId
  } = props;
  const {
    url,
    editingURL,
    fetching,
    cannotEmbed,
    interactive,
    embedHTML,
    height,
    width,
    contentShare,
    sharePosition,
    lockContent,
    customlogo,
    logoX,
    logoY,
    customlogoUrl,
    logoOpacity,
    customPlayer,
    playerPreset,
    adManager,
    adSource,
    adFileUrl,
    adXPosition,
    adYPosition,
    shareFacebook,
    shareTwitter,
    sharePinterest,
    shareLinkedin
  } = attributes;

  // Set client ID if not set
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    if (!attributes.clientId) {
      setAttributes({
        clientId
      });
    }
  }, [clientId, attributes.clientId, setAttributes]);
  const _md5ClientId = md5__WEBPACK_IMPORTED_MODULE_13___default()(attributes.clientId || clientId);

  // Dynamic logo setting based on URL
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    if (typeof embedpressObj !== 'undefined') {
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        setAttributes({
          customlogo: embedpressObj.youtube_brand_logo_url || ''
        });
      } else if (url.includes('vimeo.com')) {
        setAttributes({
          customlogo: embedpressObj.vimeo_brand_logo_url || ''
        });
      } else if (url.includes('wistia.com')) {
        setAttributes({
          customlogo: embedpressObj.wistia_brand_logo_url || ''
        });
      } else if (url.includes('twitch.com')) {
        setAttributes({
          customlogo: embedpressObj.twitch_brand_logo_url || ''
        });
      } else if (url.includes('dailymotion.com')) {
        setAttributes({
          customlogo: embedpressObj.dailymotion_brand_logo_url || ''
        });
      }
    }
  }, [url, setAttributes]);

  // Content share classes
  let contentShareClass = '';
  let sharePositionClass = '';
  let sharePos = sharePosition || 'right';
  if (contentShare) {
    contentShareClass = 'ep-content-share-enabled';
    sharePositionClass = 'ep-share-position-' + sharePos;
  }

  // Player preset class
  let playerPresetClass = '';
  if (customPlayer) {
    playerPresetClass = playerPreset || 'preset-default';
  }

  // Share HTML
  let shareHtml = '';
  if (contentShare) {
    shareHtml = (0,_helper__WEBPACK_IMPORTED_MODULE_12__.shareIconsHtml)(sharePosition, shareFacebook, shareTwitter, sharePinterest, shareLinkedin);
  }

  // Custom logo component
  const customLogoTemp = (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_5__.applyFilters)('embedpress.customLogoComponent', [], attributes);
  function switchBackToURLInput() {
    setAttributes({
      editingURL: true
    });
  }
  function onLoad() {
    setAttributes({
      fetching: false
    });
  }
  function execScripts() {
    if (!embedHTML) return;
    let scripts = embedHTML.matchAll(/<script.*?src=["'](.*?)["'].*?><\/script>/g);
    scripts = [...scripts];
    for (const script of scripts) {
      if (script && typeof script[1] !== 'undefined') {
        const url = script[1];
        const hash = md5__WEBPACK_IMPORTED_MODULE_13___default()(url);
        const exist = document.getElementById(hash);
        if (exist) {
          exist.remove();
        }
        const s = document.createElement('script');
        s.type = 'text/javascript';
        s.setAttribute('id', hash);
        s.setAttribute('src', url);
        document.body.appendChild(s);
      }
    }
  }
  function embed(event) {
    if (event) event.preventDefault();
    if (url) {
      setAttributes({
        fetching: true
      });

      // API request to get embed HTML
      const fetchData = async embedUrl => {
        let params = {
          url: embedUrl,
          width,
          height
        };
        params = (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_5__.applyFilters)('embedpress_block_rest_param', params, attributes);
        const apiUrl = `${embedpressObj.site_url}/wp-json/embedpress/v1/oembed/embedpress`;
        const args = {
          url: apiUrl,
          method: "POST",
          data: params
        };
        return await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_4___default()(args).then(res => res).catch(err => {
          console.error('EmbedPress API Error:', err);
          return {
            error: true
          };
        });
      };
      fetchData(url).then(data => {
        setAttributes({
          fetching: false
        });
        if (data.data && data.data.status === 404 || !data.embed || data.error) {
          setAttributes({
            cannotEmbed: true,
            editingURL: true
          });
        } else {
          setAttributes({
            embedHTML: data.embed,
            cannotEmbed: false,
            editingURL: false
          });
          execScripts();
        }
      });
    } else {
      setAttributes({
        cannotEmbed: true,
        fetching: false,
        editingURL: true
      });
    }
    if (attributes.clientId && url) {
      (0,_helper__WEBPACK_IMPORTED_MODULE_12__.saveSourceData)(attributes.clientId, url);
    }
  }
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    if (embedHTML && !editingURL && !fetching) {
      execScripts();
    }
  }, [embedHTML, editingURL, fetching]);
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.useBlockProps)();
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_inspector_jsx__WEBPACK_IMPORTED_MODULE_6__["default"], {
    attributes: attributes,
    setAttributes: setAttributes
  }), (!embedHTML || !!editingURL) && !fetching && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ...blockProps
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_embed_placeholder_jsx__WEBPACK_IMPORTED_MODULE_9__["default"], {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('EmbedPress - Embed anything from 150+ sites', 'embedpress'),
    onSubmit: embed,
    value: url,
    cannotEmbed: cannotEmbed,
    onChange: event => setAttributes({
      url: event.target.value
    }),
    icon: _icons_jsx__WEBPACK_IMPORTED_MODULE_11__.embedPressIcon,
    DocTitle: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Learn more about EmbedPress', 'embedpress'),
    docLink: 'https://embedpress.com/docs/'
  })), fetching && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: blockProps.className
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_embed_loading_jsx__WEBPACK_IMPORTED_MODULE_8__["default"], null)), embedHTML && !editingURL && !fetching && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("figure", {
    ...blockProps,
    "data-source-id": 'source-' + attributes.clientId
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: `gutenberg-block-wraper ${contentShareClass} ${sharePositionClass}`
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_embed_wrap_jsx__WEBPACK_IMPORTED_MODULE_10__["default"], {
    className: `position-${sharePos}-wraper ep-embed-content-wraper ${playerPresetClass}`,
    style: {
      display: fetching ? 'none' : 'inline-block',
      position: 'relative'
    },
    ...(customPlayer ? {
      'data-playerid': md5__WEBPACK_IMPORTED_MODULE_13___default()(attributes.clientId)
    } : {}),
    ...(customPlayer ? {
      'data-options': (0,_helper__WEBPACK_IMPORTED_MODULE_12__.getPlayerOptions)({
        attributes
      })
    } : {}),
    dangerouslySetInnerHTML: {
      __html: embedHTML + customLogoTemp + shareHtml
    }
  }), !interactive && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "block-library-embed__interactive-overlay",
    onMouseUp: () => setAttributes({
      interactive: true
    })
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_embed_controls_jsx__WEBPACK_IMPORTED_MODULE_7__["default"], {
    showEditButton: embedHTML && !cannotEmbed,
    switchBackToURLInput: switchBackToURLInput
  }))), customlogo && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("style", null, `
                        [data-source-id="source-${attributes.clientId}"] img.watermark {
                            opacity: ${logoOpacity};
                            left: ${logoX}px;
                            top: ${logoY}px;
                        }
                    `));
}

/***/ }),

/***/ "./src/Blocks/EmbedPress/src/components/embed-controls.jsx":
/*!*****************************************************************!*\
  !*** ./src/Blocks/EmbedPress/src/components/embed-controls.jsx ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EmbedControls)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _icons_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./icons.jsx */ "./src/Blocks/EmbedPress/src/components/icons.jsx");

/**
 * WordPress dependencies
 */




/**
 * Internal dependencies
 */


/**
 * EmbedControls Component
 * 
 * Toolbar controls for the embed block
 */
function EmbedControls({
  showEditButton,
  switchBackToURLInput
}) {
  if (!showEditButton) {
    return null;
  }
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.BlockControls, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToolbarGroup, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToolbarButton, {
    className: "components-toolbar__control",
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Edit URL', 'embedpress'),
    icon: _icons_jsx__WEBPACK_IMPORTED_MODULE_4__.editIcon,
    onClick: switchBackToURLInput
  })));
}

/***/ }),

/***/ "./src/Blocks/EmbedPress/src/components/embed-loading.jsx":
/*!****************************************************************!*\
  !*** ./src/Blocks/EmbedPress/src/components/embed-loading.jsx ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EmbedLoading)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);

/**
 * WordPress dependencies
 */



/**
 * EmbedLoading Component
 * 
 * Displays a loading state while fetching embed content
 */
function EmbedLoading() {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "embedpress-loading"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Spinner, null), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Embedding...', 'embedpress')));
}

/***/ }),

/***/ "./src/Blocks/EmbedPress/src/components/embed-placeholder.jsx":
/*!********************************************************************!*\
  !*** ./src/Blocks/EmbedPress/src/components/embed-placeholder.jsx ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EmbedPlaceholder)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _icons_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./icons.jsx */ "./src/Blocks/EmbedPress/src/components/icons.jsx");

/**
 * WordPress dependencies
 */




/**
 * Internal dependencies
 */


/**
 * EmbedPlaceholder Component
 * 
 * Displays a placeholder for entering embed URLs
 */
function EmbedPlaceholder({
  label,
  onSubmit,
  value,
  cannotEmbed,
  onChange,
  icon,
  DocTitle,
  docLink
}) {
  const [url, setUrl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(value || '');
  const handleSubmit = event => {
    event.preventDefault();
    if (url.trim()) {
      onSubmit(event);
    }
  };
  const handleChange = event => {
    const newValue = event.target.value;
    setUrl(newValue);
    if (onChange) {
      onChange(event);
    }
  };
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Placeholder, {
    icon: icon || _icons_jsx__WEBPACK_IMPORTED_MODULE_4__.linkIcon,
    label: label || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('EmbedPress', 'embedpress'),
    className: "embedpress-placeholder",
    instructions: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Paste a URL to embed content from 150+ providers', 'embedpress')
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("form", {
    onSubmit: handleSubmit,
    className: "embedpress-placeholder-form"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "url",
    value: url,
    className: "embedpress-placeholder-input",
    placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Enter URL to embed here...', 'embedpress'),
    onChange: handleChange
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
    type: "submit",
    variant: "primary",
    disabled: !url.trim()
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Embed', 'embedpress'))), cannotEmbed && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "embedpress-placeholder-error"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Sorry, this content could not be embedded.', 'embedpress')), DocTitle && docLink && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "embedpress-placeholder-help"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: docLink,
    target: "_blank",
    rel: "noopener noreferrer",
    className: "embedpress-placeholder-help-link"
  }, DocTitle)));
}

/***/ }),

/***/ "./src/Blocks/EmbedPress/src/components/embed-wrap.jsx":
/*!*************************************************************!*\
  !*** ./src/Blocks/EmbedPress/src/components/embed-wrap.jsx ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EmbedWrap)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

/**
 * EmbedWrap Component
 * 
 * Wrapper component for embedded content
 */
function EmbedWrap({
  children,
  className,
  style,
  dangerouslySetInnerHTML,
  ...props
}) {
  if (dangerouslySetInnerHTML) {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: `embedpress-embed-wrap ${className || ''}`,
      style: style,
      dangerouslySetInnerHTML: dangerouslySetInnerHTML,
      ...props
    });
  }
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: `embedpress-embed-wrap ${className || ''}`,
    style: style,
    ...props
  }, children);
}

/***/ }),

/***/ "./src/Blocks/EmbedPress/src/components/helper.js":
/*!********************************************************!*\
  !*** ./src/Blocks/EmbedPress/src/components/helper.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   deleteSourceData: () => (/* binding */ deleteSourceData),
/* harmony export */   getCarouselOptions: () => (/* binding */ getCarouselOptions),
/* harmony export */   getPlayerOptions: () => (/* binding */ getPlayerOptions),
/* harmony export */   removedBlockID: () => (/* binding */ removedBlockID),
/* harmony export */   saveSourceData: () => (/* binding */ saveSourceData),
/* harmony export */   shareIconsHtml: () => (/* binding */ shareIconsHtml)
/* harmony export */ });
/**
 * EmbedPress Helper Functions
 * 
 * Collection of utility functions for the EmbedPress block
 */

/**
 * Save source data for analytics tracking
 */
const saveSourceData = (clientId, url) => {
  if (typeof embedpressObj === 'undefined' || !embedpressObj.ajax_url) {
    return;
  }
  const xhr = new XMLHttpRequest();
  xhr.open('POST', embedpressObj.ajax_url);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log('EmbedPress: Source data saved successfully');
    } else {
      console.error('EmbedPress: Failed to save source data:', xhr.statusText);
    }
  };
  xhr.onerror = function () {
    console.error('EmbedPress: Request failed:', xhr.statusText);
  };
  const data = {
    action: 'save_source_data',
    block_id: clientId,
    source_url: url,
    _source_nonce: embedpressObj.source_nonce || ''
  };
  const encodedData = Object.keys(data).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join('&');
  xhr.send(encodedData);
};

/**
 * Delete source data when block is removed
 */
const deleteSourceData = clientId => {
  if (typeof embedpressObj === 'undefined' || !embedpressObj.ajax_url) {
    return;
  }
  const xhr = new XMLHttpRequest();
  xhr.open('POST', embedpressObj.ajax_url);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log('EmbedPress: Source data deleted successfully');
    } else {
      console.error('EmbedPress: Failed to delete source data:', xhr.statusText);
    }
  };
  xhr.onerror = function () {
    console.error('EmbedPress: Request failed:', xhr.statusText);
  };
  const data = {
    action: 'delete_source_data',
    block_id: clientId,
    _source_nonce: embedpressObj.source_nonce || ''
  };
  const encodedData = Object.keys(data).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join('&');
  xhr.send(encodedData);
};

/**
 * Track removed blocks and clean up their data
 */
const removedBlockID = () => {
  if (typeof wp === 'undefined' || !wp.data) {
    return;
  }
  const getBlockList = () => wp.data.select('core/block-editor').getBlocks();
  let previousBlockList = getBlockList();
  wp.data.subscribe(() => {
    const currentBlockList = getBlockList();
    const removedBlocks = previousBlockList.filter(block => !currentBlockList.includes(block));
    if (removedBlocks.length && currentBlockList.length < previousBlockList.length) {
      const removedBlockClientIDs = removedBlocks.filter(block => block.name === 'embedpress/embedpress' && block.attributes.clientId).map(block => block.attributes.clientId);
      if (removedBlockClientIDs.length > 0) {
        console.log(`EmbedPress: Blocks with IDs ${removedBlockClientIDs} were removed`);
        removedBlockClientIDs.forEach(clientId => deleteSourceData(clientId));
      }
    }
    previousBlockList = currentBlockList;
  });
};

/**
 * Generate social share icons HTML
 */
const shareIconsHtml = (sharePosition, shareFacebook, shareTwitter, sharePinterest, shareLinkedin) => {
  let shareHtml = `<div class="ep-social-share share-position-${sharePosition}">`;
  if (shareFacebook) {
    shareHtml += `
        <a href="#" class="ep-social-icon facebook" target="_blank">
            <svg fill="#ffffff" height="24" width="24" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
        </a>`;
  }
  if (shareTwitter) {
    shareHtml += `
        <a href="#" class="ep-social-icon twitter" target="_blank">
            <svg fill="#ffffff" height="24" width="24" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
        </a>`;
  }
  if (sharePinterest) {
    shareHtml += `
        <a href="#" class="ep-social-icon pinterest" target="_blank">
            <svg fill="#ffffff" height="24" width="24" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
            </svg>
        </a>`;
  }
  if (shareLinkedin) {
    shareHtml += `
        <a href="#" class="ep-social-icon linkedin" target="_blank">
            <svg fill="#ffffff" height="24" width="24" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
        </a>`;
  }
  shareHtml += '</div>';
  return shareHtml;
};

/**
 * Get player options for custom player
 */
const getPlayerOptions = ({
  attributes
}) => {
  const {
    customPlayer
  } = attributes;
  if (!customPlayer) {
    return '';
  }
  const {
    playerPreset,
    playerColor,
    posterThumbnail,
    playerPip,
    playerRestart,
    playerRewind,
    playerFastForward,
    playerTooltip,
    playerHideControls,
    playerDownload,
    // YouTube options
    starttime,
    endtime,
    relatedvideos,
    muteVideo,
    fullscreen,
    // Vimeo options
    vstarttime,
    vautoplay,
    vautopause,
    vdnt
  } = attributes;
  const playerOptions = {
    rewind: playerRewind,
    restart: playerRestart,
    pip: playerPip,
    poster_thumbnail: posterThumbnail,
    player_color: playerColor,
    player_preset: playerPreset,
    fast_forward: playerFastForward,
    player_tooltip: playerTooltip,
    hide_controls: playerHideControls,
    download: playerDownload,
    // YouTube
    ...(starttime && {
      start: starttime
    }),
    ...(endtime && {
      end: endtime
    }),
    ...(relatedvideos && {
      rel: relatedvideos
    }),
    ...(muteVideo && {
      mute: muteVideo
    }),
    ...(fullscreen && {
      fullscreen: fullscreen
    }),
    // Vimeo
    ...(vstarttime && {
      t: vstarttime
    }),
    ...(vautoplay && {
      autoplay: vautoplay
    }),
    ...(vautopause && {
      autopause: vautopause
    }),
    ...(vdnt && {
      dnt: vdnt
    })
  };
  return JSON.stringify(playerOptions);
};

/**
 * Get carousel options for Instagram carousel
 */
const getCarouselOptions = ({
  attributes
}) => {
  const {
    instaLayout,
    slidesShow,
    slidesScroll,
    carouselAutoplay,
    autoplaySpeed,
    transitionSpeed,
    carouselLoop,
    carouselArrows,
    carouselSpacing
  } = attributes;
  if (instaLayout !== 'insta-carousel') {
    return '';
  }
  const carouselOptions = {
    layout: instaLayout,
    slideshow: slidesShow,
    autoplay: carouselAutoplay,
    autoplayspeed: autoplaySpeed,
    transitionspeed: transitionSpeed,
    loop: carouselLoop,
    arrows: carouselArrows,
    spacing: carouselSpacing
  };
  return JSON.stringify(carouselOptions);
};

/***/ }),

/***/ "./src/Blocks/EmbedPress/src/components/icons.jsx":
/*!********************************************************!*\
  !*** ./src/Blocks/EmbedPress/src/components/icons.jsx ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   editIcon: () => (/* binding */ editIcon),
/* harmony export */   embedPressIcon: () => (/* binding */ embedPressIcon),
/* harmony export */   linkIcon: () => (/* binding */ linkIcon),
/* harmony export */   loadingIcon: () => (/* binding */ loadingIcon),
/* harmony export */   playIcon: () => (/* binding */ playIcon)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

/**
 * EmbedPress Icons
 * 
 * Collection of SVG icons used in the EmbedPress block
 */

const embedPressIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  width: "24",
  height: "24",
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z",
  fill: "currentColor"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M10 8.5L15 12L10 15.5V8.5Z",
  fill: "currentColor"
}));
const playIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  width: "24",
  height: "24",
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M8 5V19L19 12L8 5Z",
  fill: "currentColor"
}));
const editIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  width: "24",
  height: "24",
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z",
  fill: "currentColor"
}));
const linkIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  width: "24",
  height: "24",
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M3.9 12C3.9 10.29 5.29 8.9 7 8.9H11V7H7C4.24 7 2 9.24 2 12C2 14.76 4.24 17 7 17H11V15.1H7C5.29 15.1 3.9 13.71 3.9 12ZM8 13H16V11H8V13ZM17 7H13V8.9H17C18.71 8.9 20.1 10.29 20.1 12C20.1 13.71 18.71 15.1 17 15.1H13V17H17C19.76 17 22 14.76 22 12C22 9.24 19.76 7 17 7Z",
  fill: "currentColor"
}));
const loadingIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  width: "24",
  height: "24",
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M12 2V6",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M12 18V22",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M4.93 4.93L7.76 7.76",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M16.24 16.24L19.07 19.07",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M2 12H6",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M18 12H22",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M4.93 19.07L7.76 16.24",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M16.24 7.76L19.07 4.93",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round"
}));

/***/ }),

/***/ "./src/Blocks/EmbedPress/src/components/inspector.jsx":
/*!************************************************************!*\
  !*** ./src/Blocks/EmbedPress/src/components/inspector.jsx ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Inspector)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);

/**
 * WordPress dependencies
 */




/**
 * Inspector Component
 * 
 * Sidebar controls for the EmbedPress block
 */
function Inspector({
  attributes,
  setAttributes
}) {
  const {
    url,
    width,
    height,
    contentShare,
    sharePosition,
    lockContent,
    customPlayer,
    playerPreset,
    playerColor,
    shareFacebook,
    shareTwitter,
    sharePinterest,
    shareLinkedin
  } = attributes;
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Embed Settings', 'embedpress'),
    initialOpen: true
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('URL', 'embedpress'),
    value: url,
    onChange: value => setAttributes({
      url: value
    }),
    help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('The URL to embed', 'embedpress')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Width', 'embedpress'),
    value: width,
    onChange: value => setAttributes({
      width: value
    }),
    help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Width of the embed (e.g., 600px or 100%)', 'embedpress')
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Height', 'embedpress'),
    value: height,
    onChange: value => setAttributes({
      height: value
    }),
    help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Height of the embed (e.g., 400px)', 'embedpress')
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Content Protection', 'embedpress'),
    initialOpen: false
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Lock Content', 'embedpress'),
    checked: lockContent,
    onChange: value => setAttributes({
      lockContent: value
    }),
    help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Require password or user role to view content', 'embedpress')
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Social Sharing', 'embedpress'),
    initialOpen: false
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Enable Social Sharing', 'embedpress'),
    checked: contentShare,
    onChange: value => setAttributes({
      contentShare: value
    })
  }), contentShare && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Share Position', 'embedpress'),
    value: sharePosition,
    options: [{
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Right', 'embedpress'),
      value: 'right'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Left', 'embedpress'),
      value: 'left'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Top', 'embedpress'),
      value: 'top'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Bottom', 'embedpress'),
      value: 'bottom'
    }],
    onChange: value => setAttributes({
      sharePosition: value
    })
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Facebook', 'embedpress'),
    checked: shareFacebook,
    onChange: value => setAttributes({
      shareFacebook: value
    })
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Twitter', 'embedpress'),
    checked: shareTwitter,
    onChange: value => setAttributes({
      shareTwitter: value
    })
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Pinterest', 'embedpress'),
    checked: sharePinterest,
    onChange: value => setAttributes({
      sharePinterest: value
    })
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('LinkedIn', 'embedpress'),
    checked: shareLinkedin,
    onChange: value => setAttributes({
      shareLinkedin: value
    })
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Custom Player', 'embedpress'),
    initialOpen: false
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Enable Custom Player', 'embedpress'),
    checked: customPlayer,
    onChange: value => setAttributes({
      customPlayer: value
    }),
    help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Use EmbedPress custom video player', 'embedpress')
  }), customPlayer && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Player Preset', 'embedpress'),
    value: playerPreset,
    options: [{
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Default', 'embedpress'),
      value: 'preset-default'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Modern', 'embedpress'),
      value: 'preset-modern'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Classic', 'embedpress'),
      value: 'preset-classic'
    }],
    onChange: value => setAttributes({
      playerPreset: value
    })
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Player Color', 'embedpress'),
    value: playerColor,
    onChange: value => setAttributes({
      playerColor: value
    }),
    help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Hex color code for player theme', 'embedpress')
  }))));
}

/***/ }),

/***/ "./src/Blocks/EmbedPress/src/components/save.jsx":
/*!*******************************************************!*\
  !*** ./src/Blocks/EmbedPress/src/components/save.jsx ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Save)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/**
 * WordPress dependencies
 */


/**
 * Save component for EmbedPress block
 * 
 * This is a dynamic block, so we return null here.
 * The actual rendering is handled by the PHP render callback.
 */
function Save() {
  return null;
}

/***/ }),

/***/ "./src/Blocks/EmbedPress/src/index.js":
/*!********************************************!*\
  !*** ./src/Blocks/EmbedPress/src/index.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_save_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/save.jsx */ "./src/Blocks/EmbedPress/src/components/save.jsx");
/* harmony import */ var _components_edit_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/edit.jsx */ "./src/Blocks/EmbedPress/src/components/edit.jsx");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../block.json */ "./src/Blocks/EmbedPress/block.json");
/* harmony import */ var _components_attributes__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/attributes */ "./src/Blocks/EmbedPress/src/components/attributes.js");
/* harmony import */ var _components_conditional_register__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/conditional-register */ "./src/Blocks/EmbedPress/src/components/conditional-register.js");
/* harmony import */ var _components_icons_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/icons.jsx */ "./src/Blocks/EmbedPress/src/components/icons.jsx");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./style.scss */ "./src/Blocks/EmbedPress/src/style.scss");
/**
 * WordPress dependencies
 */


/**
 * Internal dependencies
 */







/**
 * Import styles
 */

(0,_components_conditional_register__WEBPACK_IMPORTED_MODULE_5__.embedpressConditionalRegisterBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_3__, {
  icon: _components_icons_jsx__WEBPACK_IMPORTED_MODULE_6__.embedPressIcon,
  attributes: _components_attributes__WEBPACK_IMPORTED_MODULE_4__["default"],
  keywords: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("embed", "embedpress"), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("embedpress", "embedpress"), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("video", "embedpress"), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("social", "embedpress"), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("youtube", "embedpress"), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("vimeo", "embedpress"), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("google docs", "embedpress"), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("pdf", "embedpress")],
  edit: _components_edit_jsx__WEBPACK_IMPORTED_MODULE_2__["default"],
  save: _components_save_jsx__WEBPACK_IMPORTED_MODULE_1__["default"]
});

/***/ }),

/***/ "./src/Blocks/EmbedPress/src/style.scss":
/*!**********************************************!*\
  !*** ./src/Blocks/EmbedPress/src/style.scss ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/Blocks/index.js":
/*!*****************************!*\
  !*** ./src/Blocks/index.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _GlobalCoponents_icons_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../GlobalCoponents/icons.js */ "./src/GlobalCoponents/icons.js");
/* harmony import */ var _EmbedPress_src_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EmbedPress/src/index.js */ "./src/Blocks/EmbedPress/src/index.js");
/**
 * EmbedPress Gutenberg Blocks Entry Point
 *
 * This file registers all EmbedPress Gutenberg blocks
 * using the new centralized structure.
 */

// Import WordPress dependencies
const {
  __
} = wp.i18n;

// Import block registrations


// Register block category
if (wp.blocks && wp.blocks.registerBlockCollection) {
  wp.blocks.registerBlockCollection('embedpress', {
    title: __('EmbedPress', 'embedpress'),
    icon: _GlobalCoponents_icons_js__WEBPACK_IMPORTED_MODULE_0__.EPIcon
  });
}

/***/ }),

/***/ "./src/GlobalCoponents/icons.js":
/*!**************************************!*\
  !*** ./src/GlobalCoponents/icons.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CalendarIcon: () => (/* binding */ CalendarIcon),
/* harmony export */   DocumentIcon: () => (/* binding */ DocumentIcon),
/* harmony export */   EPIcon: () => (/* binding */ EPIcon),
/* harmony export */   InfoIcon: () => (/* binding */ InfoIcon),
/* harmony export */   PdfIcon: () => (/* binding */ PdfIcon),
/* harmony export */   blanKTabIcon: () => (/* binding */ blanKTabIcon),
/* harmony export */   embedPressIcon: () => (/* binding */ embedPressIcon),
/* harmony export */   epGetDownloadIcon: () => (/* binding */ epGetDownloadIcon),
/* harmony export */   epGetDrawIcon: () => (/* binding */ epGetDrawIcon),
/* harmony export */   epGetFullscreenIcon: () => (/* binding */ epGetFullscreenIcon),
/* harmony export */   epGetMinimizeIcon: () => (/* binding */ epGetMinimizeIcon),
/* harmony export */   epGetPopupIcon: () => (/* binding */ epGetPopupIcon),
/* harmony export */   epGetPrintIcon: () => (/* binding */ epGetPrintIcon),
/* harmony export */   googleDocsIcon: () => (/* binding */ googleDocsIcon),
/* harmony export */   googleDrawingsIcon: () => (/* binding */ googleDrawingsIcon),
/* harmony export */   googleFormsIcon: () => (/* binding */ googleFormsIcon),
/* harmony export */   googleMapsIcon: () => (/* binding */ googleMapsIcon),
/* harmony export */   googleSheetsIcon: () => (/* binding */ googleSheetsIcon),
/* harmony export */   googleSlidesIcon: () => (/* binding */ googleSlidesIcon),
/* harmony export */   twitchIcon: () => (/* binding */ twitchIcon),
/* harmony export */   wistiaIcon: () => (/* binding */ wistiaIcon),
/* harmony export */   youtubeIcon: () => (/* binding */ youtubeIcon),
/* harmony export */   youtubeNewIcon: () => (/* binding */ youtubeNewIcon)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

/**
 * WordPress dependencies
 */
const {
  G,
  Path,
  Polygon,
  SVG
} = wp.components;
const googleDocsIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(SVG, {
  xmlns: "http://www.w3.org/1999/xlink",
  viewBox: "0 0 48 48"
}, " ", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(G, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  style: {
    fill: '#2196F3'
  },
  d: "M 37 45 L 11 45 C 9.34375 45 8 43.65625 8 42 L 8 6 C 8 4.34375 9.34375 3 11 3 L 30 3 L 40 13 L 40 42 C 40 43.65625 38.65625 45 37 45 Z "
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  style: {
    fill: '#BBDEFB'
  },
  d: "M 40 13 L 30 13 L 30 3 Z "
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  style: {
    fill: '#1565C0'
  },
  d: "M 30 13 L 40 23 L 40 13 Z "
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  style: {
    fill: '#E3F2FD'
  },
  d: "M 15 23 L 33 23 L 33 25 L 15 25 Z "
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  style: {
    fill: '#E3F2FD'
  },
  d: "M 15 27 L 33 27 L 33 29 L 15 29 Z "
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  style: {
    fill: '#E3F2FD'
  },
  d: "M 15 31 L 33 31 L 33 33 L 15 33 Z "
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  style: {
    fill: '#E3F2FD'
  },
  d: "M 15 35 L 25 35 L 25 37 L 15 37 Z "
})));
const googleSlidesIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(SVG, {
  xmlns: "http://www.w3.org/1999/xlink",
  enableBackground: "new 0 0 24 24",
  id: "Layer_2",
  version: "1.1",
  viewBox: "0 0 24 24"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(G, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  d: "M21,6l-6-6H5C3.8954306,0,3,0.8954305,3,2v20c0,1.1045704,0.8954306,2,2,2h14c1.1045704,0,2-0.8954296,2-2   V6z",
  style: {
    fill: "#FFC720"
  }
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  d: "M17,6c-0.5444336,0-1.0367432-0.2190552-1.3973999-0.5719604L21,10.8254395V6H17z",
  style: {
    fill: "url(#SVGID_1_)"
  }
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  d: "M19,23.75H5c-1.1045532,0-2-0.8954468-2-2V22c0,1.1045532,0.8954468,2,2,2h14c1.1045532,0,2-0.8954468,2-2   v-0.25C21,22.8545532,20.1045532,23.75,19,23.75z",
  style: {
    opacity: "0.1"
  }
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  d: "M15,0v4c0,1.1045694,0.8954306,2,2,2h4L15,0z",
  style: {
    fill: "#FFE083"
  }
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  d: "M17,5.75c-1.1045532,0-2-0.8954468-2-2V4c0,1.1045532,0.8954468,2,2,2h4l-0.25-0.25H17z",
  style: {
    opacity: "0.1"
  }
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  d: "M15,0H5C3.8954468,0,3,0.8953857,3,2v0.25c0-1.1046143,0.8954468-2,2-2h10",
  style: {
    fill: "#FFFFFF",
    opacity: "0.2"
  }
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  d: "M15.5,9h-7C7.6728516,9,7,9.6728516,7,10.5v6C7,17.3271484,7.6728516,18,8.5,18h7   c0.8271484,0,1.5-0.6728516,1.5-1.5v-6C17,9.6728516,16.3271484,9,15.5,9z M8,15.5V11h8v4.5H8z",
  style: {
    fill: "#FFFFFF"
  }
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  d: "M21,6l-6-6H5C3.8954306,0,3,0.8954305,3,2v20c0,1.1045704,0.8954306,2,2,2h14   c1.1045704,0,2-0.8954296,2-2V6z",
  style: {
    fill: "url(#SVGID_2_)"
  }
})));
const googleSheetsIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(SVG, {
  xmlns: "http://www.w3.org/1999/xlink",
  viewBox: "0 0 48 48",
  version: "1.1"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(G, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  style: {
    fill: '#43A047'
  },
  d: "M 37 45 L 11 45 C 9.34375 45 8 43.65625 8 42 L 8 6 C 8 4.34375 9.34375 3 11 3 L 30 3 L 40 13 L 40 42 C 40 43.65625 38.65625 45 37 45 Z "
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  style: {
    fill: '#C8E6C9'
  },
  d: "M 40 13 L 30 13 L 30 3 Z "
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  style: {
    fill: '#2E7D32'
  },
  d: "M 30 13 L 40 23 L 40 13 Z "
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  style: {
    fill: '#E8F5E9'
  },
  d: "M 31 23 L 15 23 L 15 37 L 33 37 L 33 23 Z M 17 25 L 21 25 L 21 27 L 17 27 Z M 17 29 L 21 29 L 21 31 L 17 31 Z M 17 33 L 21 33 L 21 35 L 17 35 Z M 31 35 L 23 35 L 23 33 L 31 33 Z M 31 31 L 23 31 L 23 29 L 31 29 Z M 31 27 L 23 27 L 23 25 L 31 25 Z "
})));
const googleFormsIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(SVG, {
  xmlns: "http://www.w3.org/1999/xlink",
  viewBox: "0 0 48 48",
  version: "1.1"
}, " ", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(G, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  style: {
    fill: '#7850C1'
  },
  d: "M 37 45 L 11 45 C 9.34375 45 8 43.65625 8 42 L 8 6 C 8 4.34375 9.34375 3 11 3 L 30 3 L 40 13 L 40 42 C 40 43.65625 38.65625 45 37 45 Z "
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  style: {
    fill: '#C2ABE1'
  },
  d: "M 40 13 L 30 13 L 30 3 Z "
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  style: {
    fill: '#2E7D32'
  },
  d: "M 30 13 L 40 23 L 40 13 Z "
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  style: {
    fill: '#E8F5E9'
  },
  d: "M 19 23 L 33 23 L 33 25 L 19 25 Z "
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  style: {
    fill: '#E8F5E9'
  },
  d: "M 19 28 L 33 28 L 33 30 L 19 30 Z "
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  style: {
    fill: '#E8F5E9'
  },
  d: "M 19 33 L 33 33 L 33 35 L 19 35 Z "
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  style: {
    fill: '#E8F5E9'
  },
  d: "M 15 23 L 17 23 L 17 25 L 15 25 Z "
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  style: {
    fill: '#E8F5E9'
  },
  d: "M 15 28 L 17 28 L 17 30 L 15 30 Z "
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  style: {
    fill: '#E8F5E9'
  },
  d: "M 15 33 L 17 33 L 17 35 L 15 35 Z "
})));
const googleDrawingsIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(SVG, {
  xmlns: "http://www.w3.org/1999/xlink",
  viewBox: "0 0 48 48",
  version: "1.1"
}, " ", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(G, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  style: {
    fill: '#DE5245'
  },
  d: "M37,45H11c-1.7,0-3-1.3-3-3V6c0-1.7,1.3-3,3-3h19l10,10v29C40,43.7,38.7,45,37,45z"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  style: {
    fill: '#EEA6A0'
  },
  d: "M40,13H30V3L40,13z"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  style: {
    fill: '#B3433A'
  },
  d: "M30,13l10,10V13H30z"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  style: {
    fill: '#FFFFFF'
  },
  d: "M20.5,32c-3,0-5.5-2.5-5.5-5.5c0-3,2.5-5.5,5.5-5.5s5.5,2.5,5.5,5.5C26,29.5,23.5,32,20.5,32z    M20.5,23c-1.9,0-3.5,1.6-3.5,3.5s1.6,3.5,3.5,3.5s3.5-1.6,3.5-3.5S22.4,23,20.5,23z"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  style: {
    fill: '#FFFFFF'
  },
  d: "M27.6,29c-0.6,1.8-1.9,3.3-3.6,4.1V38h9v-9H27.6z"
})));
const googleMapsIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(SVG, {
  xmlns: "http://www.w3.org/1999/xlink",
  viewBox: "0 0 48 48",
  version: "1.1"
}, " ", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(G, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  style: {
    fill: '#1C9957'
  },
  d: "M 42 39 L 42 9 C 42 7.34375 40.65625 6 39 6 L 9 6 C 7.34375 6 6 7.34375 6 9 L 6 39 C 6 40.65625 7.34375 42 9 42 L 39 42 C 40.65625 42 42 40.65625 42 39 Z "
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  style: {
    fill: '#3E7BF1'
  },
  d: "M 9 42 L 39 42 C 40.65625 42 24 26 24 26 C 24 26 7.34375 42 9 42 Z "
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  style: {
    fill: '#CBCCC9'
  },
  d: "M 42 39 L 42 9 C 42 7.34375 26 24 26 24 C 26 24 42 40.65625 42 39 Z "
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  style: {
    fill: '#EFEFEF'
  },
  d: "M 39 42 C 40.65625 42 42 40.65625 42 39 L 42 38.753906 L 26.246094 23 L 23 26.246094 L 38.753906 42 Z "
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  style: {
    fill: '#FFD73D'
  },
  d: "M 42 9 C 42 7.34375 40.65625 6 39 6 L 38.753906 6 L 6 38.753906 L 6 39 C 6 40.65625 7.34375 42 9 42 L 9.246094 42 L 42 9.246094 Z "
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  style: {
    fill: '#D73F35'
  },
  d: "M 36 2 C 30.476563 2 26 6.476563 26 12 C 26 18.8125 33.664063 21.296875 35.332031 31.851563 C 35.441406 32.53125 35.449219 33 36 33 C 36.550781 33 36.558594 32.53125 36.667969 31.851563 C 38.335938 21.296875 46 18.8125 46 12 C 46 6.476563 41.523438 2 36 2 Z "
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  style: {
    fill: '#752622'
  },
  d: "M 39.5 12 C 39.5 13.933594 37.933594 15.5 36 15.5 C 34.066406 15.5 32.5 13.933594 32.5 12 C 32.5 10.066406 34.066406 8.5 36 8.5 C 37.933594 8.5 39.5 10.066406 39.5 12 Z "
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  style: {
    fill: '#FFFFFF'
  },
  d: "M 14.492188 12.53125 L 14.492188 14.632813 L 17.488281 14.632813 C 17.09375 15.90625 16.03125 16.816406 14.492188 16.816406 C 12.660156 16.816406 11.175781 15.332031 11.175781 13.5 C 11.175781 11.664063 12.660156 10.179688 14.492188 10.179688 C 15.316406 10.179688 16.070313 10.484375 16.648438 10.980469 L 18.195313 9.433594 C 17.21875 8.542969 15.921875 8 14.492188 8 C 11.453125 8 8.992188 10.464844 8.992188 13.5 C 8.992188 16.535156 11.453125 19 14.492188 19 C 19.304688 19 20.128906 14.683594 19.675781 12.539063 Z "
})));
const twitchIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(SVG, {
  xmlns: "http://www.w3.org/1999/xlink",
  viewBox: "0 0 48 48",
  version: "1.1"
}, " ", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(G, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  style: {
    fill: '#FFFFFF'
  },
  d: "M 12 32 L 12 8 L 39 8 L 39 26 L 33 32 L 24 32 L 18 38 L 18 32 Z "
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  style: {
    fill: '#8E24AA'
  },
  d: "M 9 5 L 6 12.121094 L 6 38 L 15 38 L 15 43 L 20 43 L 25 38 L 32 38 L 42 28 L 42 5 Z M 38 26 L 33 31 L 24 31 L 19 36 L 19 31 L 13 31 L 13 9 L 38 9 Z "
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  style: {
    fill: '#8E24AA'
  },
  d: "M 32 25 L 27 25 L 27 15 L 32 15 Z "
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  style: {
    fill: '#8E24AA'
  },
  d: "M 24 25 L 19 25 L 19 15 L 24 15 Z "
})));
const wistiaIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(SVG, {
  xmlns: "http://www.w3.org/1999/xlink",
  viewBox: "0 0 769 598",
  version: "1.1"
}, " ", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(G, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  style: {
    fill: '#148ee0'
  },
  d: "M766.89,229.17c0,0 -17.78,35.38 -106.5,91.3c-37.82,23.79 -116.36,49.1 -217.33,58.86c-54.52,5.29 -154.9,0.99 -197.96,0.99c-43.29,0 -63.13,9.12 -101.95,52.84c-143.15,161.36 -143.15,161.36 -143.15,161.36c0,0 49.57,0.24 87.01,0.24c37.43,0 271.55,13.59 375.43,-14.98c337.36,-92.72 304.46,-350.62 304.46,-350.62z"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  style: {
    fill: '#54bbff'
  },
  d: "M757.84,126.66c16.23,-98.97 -39.68,-126.16 -39.68,-126.16c0,0 2.36,80.57 -145.7,97.65c-131.42,15.16 -572.46,3.74 -572.46,3.74c0,0 0,0 141.74,162.54c38.39,44.06 58.76,49.17 101.92,52.22c43.16,2.89 138.42,1.86 202.99,-3.05c70.58,-5.41 171.17,-28.43 239.19,-81.11c34.88,-26.98 65.21,-64.48 72,-105.83z"
})));
const youtubeIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24",
  viewBox: "0 0 24 24",
  role: "img",
  "aria-hidden": "true",
  focusable: "false"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Path, {
  d: "M21.8 8s-.195-1.377-.795-1.984c-.76-.797-1.613-.8-2.004-.847-2.798-.203-6.996-.203-6.996-.203h-.01s-4.197 0-6.996.202c-.39.046-1.242.05-2.003.846C2.395 6.623 2.2 8 2.2 8S2 9.62 2 11.24v1.517c0 1.618.2 3.237.2 3.237s.195 1.378.795 1.985c.76.797 1.76.77 2.205.855 1.6.153 6.8.2 6.8.2s4.203-.005 7-.208c.392-.047 1.244-.05 2.005-.847.6-.607.795-1.985.795-1.985s.2-1.618.2-3.237v-1.517C22 9.62 21.8 8 21.8 8zM9.935 14.595v-5.62l5.403 2.82-5.403 2.8z"
}));
const youtubeNewIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  version: "1.1",
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 56 23"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  style: {
    fill: '#DA2B28'
  },
  className: "st0",
  d: "M55.4,3.7c-0.2-0.9-0.6-1.6-1.3-2.2c-0.7-0.6-1.4-0.9-2.3-1c-2.7-0.3-6.8-0.4-12.3-0.4 c-5.5,0-9.6,0.1-12.3,0.4c-0.9,0.1-1.6,0.5-2.3,1c-0.7,0.6-1.1,1.3-1.3,2.2c-0.4,1.7-0.6,4.3-0.6,7.8c0,3.5,0.2,6.1,0.6,7.8 c0.2,0.9,0.6,1.6,1.3,2.2c0.7,0.6,1.4,0.9,2.3,1c2.7,0.3,6.8,0.5,12.3,0.5c5.5,0,9.6-0.2,12.3-0.5c0.9-0.1,1.6-0.4,2.3-1 c0.7-0.6,1.1-1.3,1.3-2.2c0.4-1.7,0.6-4.3,0.6-7.8C56,8,55.8,5.4,55.4,3.7L55.4,3.7z M32.5,6h-2.4v12.6h-2.2V6h-2.3V3.9h6.9V6z M38.5,18.6h-2v-1.2c-0.8,0.9-1.6,1.4-2.3,1.4c-0.7,0-1.1-0.3-1.3-0.8c-0.1-0.4-0.2-0.9-0.2-1.6V7.6h2v8.1c0,0.5,0,0.7,0,0.8 c0,0.3,0.2,0.5,0.5,0.5c0.4,0,0.8-0.3,1.3-0.9V7.6h2V18.6z M46.1,15.3c0,1.1-0.1,1.8-0.2,2.2c-0.3,0.8-0.8,1.2-1.6,1.2 c-0.7,0-1.4-0.4-2.1-1.2v1.1h-2V3.9h2v4.8c0.6-0.8,1.3-1.2,2.1-1.2c0.8,0,1.3,0.4,1.6,1.2c0.1,0.4,0.2,1.1,0.2,2.2V15.3z M53.5,13.5h-4v1.9c0,1,0.3,1.5,1,1.5c0.5,0,0.8-0.3,0.9-0.8c0-0.1,0-0.6,0-1.4h2v0.3c0,0.7,0,1.2,0,1.3c0,0.4-0.2,0.8-0.5,1.2 c-0.5,0.8-1.3,1.2-2.4,1.2c-1,0-1.8-0.4-2.4-1.1c-0.4-0.5-0.6-1.4-0.6-2.6v-3.8c0-1.2,0.2-2,0.6-2.6c0.6-0.8,1.4-1.1,2.4-1.1 c1,0,1.8,0.4,2.3,1.1c0.4,0.5,0.6,1.4,0.6,2.6V13.5z M53.5,13.5"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  className: "st0",
  d: "M43.2,9.3c-0.3,0-0.7,0.2-1,0.5v6.7c0.3,0.3,0.7,0.5,1,0.5c0.6,0,0.9-0.5,0.9-1.5v-4.7 C44.1,9.8,43.8,9.3,43.2,9.3L43.2,9.3z M43.2,9.3"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  className: "st0",
  d: "M50.6,9.3c-0.7,0-1,0.5-1,1.5v1h2v-1C51.6,9.8,51.2,9.3,50.6,9.3L50.6,9.3z M50.6,9.3"
})), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M2.8,12.8v6h2.2v-6L7.7,4H5.5L4,9.8L2.4,4H0.1c0.4,1.2,0.9,2.6,1.4,4.1C2.2,10.2,2.6,11.7,2.8,12.8L2.8,12.8z M2.8,12.8"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M10.7,19c1,0,1.8-0.4,2.3-1.1c0.4-0.5,0.6-1.4,0.6-2.6v-3.9c0-1.2-0.2-2-0.6-2.6c-0.5-0.8-1.3-1.1-2.3-1.1 c-1,0-1.8,0.4-2.3,1.1C8,9.3,7.8,10.2,7.8,11.4v3.9c0,1.2,0.2,2.1,0.6,2.6C8.9,18.6,9.7,19,10.7,19L10.7,19z M9.8,11 c0-1,0.3-1.5,1-1.5c0.6,0,1,0.5,1,1.5v4.7c0,1-0.3,1.6-1,1.6c-0.6,0-1-0.5-1-1.6V11z M9.8,11"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M16.8,19c0.7,0,1.5-0.5,2.3-1.4v1.2h2V7.8h-2v8.4c-0.4,0.6-0.9,1-1.3,1c-0.3,0-0.4-0.2-0.5-0.5c0,0,0-0.3,0-0.8V7.8h-2 v8.7c0,0.8,0.1,1.3,0.2,1.7C15.7,18.7,16.1,19,16.8,19L16.8,19z M16.8,19"
}))));
const DocumentIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 276 340"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M196.7.6H24.3C11.1.6.4 11.3.4 24.6v292.9c0 12.3 10 22.2 22.2 22.2H252c13.3 0 23.9-10.7 23.9-23.9V80.9L196.7.6z",
  fill: "#e94848"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M196.7 57c0 13.3 10.7 23.9 23.9 23.9H276L196.7.6V57z",
  fill: "#f19191"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("linearGradient", {
  id: "A",
  gradientUnits: "userSpaceOnUse",
  x1: "44.744",
  y1: "77.111",
  x2: "116.568",
  y2: "77.111"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  offset: "0",
  stopColor: "#fff"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  offset: "1",
  stopColor: "#fff0f0"
})), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M113 84.5H48.3c-1.9 0-3.5-1.6-3.5-3.5v-7.7c0-1.9 1.6-3.5 3.5-3.5H113c1.9 0 3.5 1.6 3.5 3.5V81c.1 1.9-1.5 3.5-3.5 3.5z",
  fill: "url(#A)"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("linearGradient", {
  id: "B",
  gradientUnits: "userSpaceOnUse",
  x1: "44.744",
  y1: "136.016",
  x2: "233.927",
  y2: "136.016"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  offset: "0",
  stopColor: "#fff"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  offset: "1",
  stopColor: "#fff0f0"
})), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("use", {
  href: "#H",
  opacity: ".8",
  fill: "url(#B)"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("linearGradient", {
  id: "C",
  gradientUnits: "userSpaceOnUse",
  x1: "44.744",
  y1: "135.993",
  x2: "233.927",
  y2: "135.993"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  offset: "0",
  stopColor: "#fff"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  offset: "1",
  stopColor: "#fff0f0"
})), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("use", {
  href: "#H",
  y: "33.6",
  opacity: ".7",
  fill: "url(#C)"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("linearGradient", {
  id: "D",
  gradientUnits: "userSpaceOnUse",
  x1: "44.744",
  y1: "135.969",
  x2: "233.927",
  y2: "135.969"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  offset: "0",
  stopColor: "#fff"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  offset: "1",
  stopColor: "#fff0f0"
})), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("use", {
  href: "#H",
  y: "67.2",
  opacity: ".6",
  fill: "url(#D)"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("linearGradient", {
  id: "E",
  gradientUnits: "userSpaceOnUse",
  x1: "44.744",
  y1: "136.045",
  x2: "233.927",
  y2: "136.045"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  offset: "0",
  stopColor: "#fff"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  offset: "1",
  stopColor: "#fff0f0"
})), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("use", {
  href: "#H",
  y: "100.7",
  opacity: ".4",
  fill: "url(#E)"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("linearGradient", {
  id: "F",
  gradientUnits: "userSpaceOnUse",
  x1: "44.744",
  y1: "270.322",
  x2: "174.778",
  y2: "270.322"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  offset: "0",
  stopColor: "#fff"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("stop", {
  offset: "1",
  stopColor: "#fff0f0"
})), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M171.9 277.7H47.6c-1.6 0-2.9-1.3-2.9-2.9v-9c0-1.6 1.3-2.9 2.9-2.9h124.3c1.6 0 2.9 1.3 2.9 2.9v9c0 1.6-1.3 2.9-2.9 2.9z",
  opacity: ".3",
  fill: "url(#F)"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("defs", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  id: "H",
  d: "M231 143.4H47.6c-1.6 0-2.9-1.3-2.9-2.9v-9c0-1.6 1.3-2.9 2.9-2.9H231c1.6 0 2.9 1.3 2.9 2.9v9c0 1.6-1.3 2.9-2.9 2.9z"
})));
const embedPressIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  width: "33",
  height: "20",
  version: "1.1",
  id: "Layer_1",
  xmlns: "http://www.w3.org/2000/svg",
  x: "0px",
  y: "0px",
  viewBox: "0 0 270 270",
  role: "img",
  focusable: "false"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("polygon", {
  className: "st0",
  fill: "#9595C1",
  points: "0,0 0,52 15,52 15,15 52,15 52,0 \t"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("polygon", {
  className: "st0",
  fill: "#9595C1",
  points: "255,218 255,255 218,255 218,270 270,270 270,218 \t"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  fill: "#5B4E96",
  d: "M260.7,68.1c-10.4-18.6-29.3-31.2-50.6-33.6c-12.4-1.4-25,0.6-36.3,6c-1.3,0.6-2.6,1.3-3.9,2 C154.5,51,143,65.3,138.3,81.7l0,0.1l-36.4,103.8c-3.1,9.4-9.1,17-17.1,21.4c-0.7,0.4-1.4,0.7-2.1,1.1c-6.1,2.9-12.8,4-19.5,3.2 c-11.5-1.3-21.6-8.1-27.2-18.1c-4.6-8.3-5.7-18-3.1-27.2c2.6-9.2,8.7-16.9,17.1-21.5c0.7-0.4,1.4-0.8,2.1-1.1 c6.1-2.9,12.7-4,19.6-3.2c0.3,0,0.5,0.1,0.8,0.1L64.9,162c-0.5,1.5,0.3,3.1,1.8,3.6l19.4,6.3c1.5,0.5,3-0.3,3.5-1.7l16.7-47.4 c0.4-1.2,0.3-2.5-0.3-3.6c-0.6-1.1-1.6-2-2.8-2.4l-17.6-5.1c-0.4-0.1-0.8-0.2-1.2-0.3l-1.6-0.5l0,0.1c-2.5-0.6-5-1.1-7.5-1.3 c-12.5-1.4-25.1,0.6-36.4,6c-1.3,0.6-2.6,1.3-3.9,2c-15.6,8.7-27,22.9-31.9,40.1c-4.9,17.1-2.8,35.1,5.8,50.5 c10.4,18.6,29.3,31.2,50.6,33.6c12.4,1.4,25-0.6,36.3-6c1.3-0.6,2.6-1.3,3.9-2c15.3-8.5,26.8-22.8,31.6-39.2l0-0.1L167.8,91 l0.1-0.2l0-0.1c4.1-10.5,9.3-17,17-21.3c0.7-0.4,1.4-0.7,2.1-1.1c6.1-2.9,12.8-4,19.5-3.2c11.5,1.3,21.6,8.1,27.2,18.1 c9.6,17.2,3.3,39.1-14,48.7c-0.7,0.4-1.4,0.7-2.1,1.1c-6.1,2.9-12.8,4-19.7,3.2c-2-0.2-4.1-0.6-6.1-1.2l-0.2-0.1l-11.3-3.4 c-1.2-0.4-2.5,0.3-2.9,1.5l-8.8,24.8c-0.5,1.3,0.3,2.7,1.6,3.1l13.9,4c3.4,0.9,6.8,1.6,10.3,2c12.4,1.4,25-0.6,36.3-6l0.1,0 c1.3-0.6,2.6-1.3,3.9-2C266.8,140.8,278.5,100.1,260.7,68.1z"
})));
const PdfIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  version: "1.1",
  id: "Layer_1",
  xmlns: "http://www.w3.org/2000/svg",
  x: "0px",
  y: "0px",
  viewBox: "0 0 512 512"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  fill: "#E2E5E7",
  d: "M128,0c-17.6,0-32,14.4-32,32v448c0,17.6,14.4,32,32,32h320c17.6,0,32-14.4,32-32V128L352,0H128z"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  fill: "#B0B7BD",
  d: "M384,128h96L352,0v96C352,113.6,366.4,128,384,128z"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("polygon", {
  fill: "#CAD1D8",
  points: "480,224 384,128 480,128 "
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  fill: "#F15642",
  d: "M416,416c0,8.8-7.2,16-16,16H48c-8.8,0-16-7.2-16-16V256c0-8.8,7.2-16,16-16h352c8.8,0,16,7.2,16,16 V416z"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  fill: "#FFFFFF",
  d: "M101.744,303.152c0-4.224,3.328-8.832,8.688-8.832h29.552c16.64,0,31.616,11.136,31.616,32.48 c0,20.224-14.976,31.488-31.616,31.488h-21.36v16.896c0,5.632-3.584,8.816-8.192,8.816c-4.224,0-8.688-3.184-8.688-8.816V303.152z M118.624,310.432v31.872h21.36c8.576,0,15.36-7.568,15.36-15.504c0-8.944-6.784-16.368-15.36-16.368H118.624z"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  fill: "#FFFFFF",
  d: "M196.656,384c-4.224,0-8.832-2.304-8.832-7.92v-72.672c0-4.592,4.608-7.936,8.832-7.936h29.296 c58.464,0,57.184,88.528,1.152,88.528H196.656z M204.72,311.088V368.4h21.232c34.544,0,36.08-57.312,0-57.312H204.72z"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  fill: "#FFFFFF",
  d: "M303.872,312.112v20.336h32.624c4.608,0,9.216,4.608,9.216,9.072c0,4.224-4.608,7.68-9.216,7.68 h-32.624v26.864c0,4.48-3.184,7.92-7.664,7.92c-5.632,0-9.072-3.44-9.072-7.92v-72.672c0-4.592,3.456-7.936,9.072-7.936h44.912 c5.632,0,8.96,3.344,8.96,7.936c0,4.096-3.328,8.704-8.96,8.704h-37.248V312.112z"
})), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  fill: "#CAD1D8",
  d: "M400,432H96v16h304c8.8,0,16-7.2,16-16v-16C416,424.8,408.8,432,400,432z"
}));
const CalendarIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "186 38 76 76"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  fill: "#fff",
  d: "M244 56h-40v40h40V56z"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  fill: "#EA4335",
  d: "M244 114l18-18h-18v18z"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  fill: "#FBBC04",
  d: "M262 56h-18v40h18V56z"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  fill: "#34A853",
  d: "M244 96h-40v18h40V96z"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  fill: "#188038",
  d: "M186 96v12c0 3.315 2.685 6 6 6h12V96h-18z"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  fill: "#1967D2",
  d: "M262 56V44c0-3.315-2.685-6-6-6h-12v18h18z"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  fill: "#4285F4",
  d: "M244 38h-52c-3.315 0 -6 2.685-6 6v52h18V56h40V38z"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  fill: "#4285F4",
  d: "M212.205 87.03c-1.495-1.01-2.53-2.485-3.095-4.435l3.47-1.43c.315 1.2.865 2.13 1.65 2.79.78.66 1.73.985 2.84.985 1.135 0 2.11-.345 2.925-1.035s1.225-1.57 1.225-2.635c0-1.09-.43-1.98-1.29-2.67-.86-.69-1.94-1.035-3.23-1.035h-2.005V74.13h1.8c1.11 0 2.045-.3 2.805-.9.76-.6 1.14-1.42 1.14-2.465 0 -.93-.34-1.67-1.02-2.225-.68-.555-1.54-.835-2.585-.835-1.02 0 -1.83.27-2.43.815a4.784 4.784 0 0 0 -1.31 2.005l-3.435-1.43c.455-1.29 1.29-2.43 2.515-3.415 1.225-.985 2.79-1.48 4.69-1.48 1.405 0 2.67.27 3.79.815 1.12.545 2 1.3 2.635 2.26.635.965.95 2.045.95 3.245 0 1.225-.295 2.26-.885 3.11-.59.85-1.315 1.5-2.175 1.955v.205a6.605 6.605 0 0 1 2.79 2.175c.725.975 1.09 2.14 1.09 3.5 0 1.36-.345 2.575-1.035 3.64s-1.645 1.905-2.855 2.515c-1.215.61-2.58.92-4.095.92-1.755.005-3.375-.5-4.87-1.51zM233.52 69.81l-3.81 2.755-1.905-2.89 6.835-4.93h2.62V88h-3.74V69.81z"
}));
const EPIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  xmlSpace: "preserve",
  id: "Layer_1",
  x: 0,
  y: 0,
  style: {
    enableBackground: "new 0 0 70 70"
  },
  viewBox: "0 0 70 70"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("style", null, ".st0{fill:#5b4e96}"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M4 4.4h9.3V1.1H.7v12.7H4zM65.7 56.8v9.3h-9.4v3.3H68.9V56.8zM59 41.8c.3-.2.7-.3 1-.5 8.2-4.5 11.1-14.8 6.6-22.9-2.6-4.7-7.4-7.9-12.8-8.5-3.1-.4-6.3.2-9.2 1.5-.3.2-.7.3-1 .5-3.9 2.2-6.8 5.8-8 9.9L26.4 48c-.8 2.4-2.3 4.3-4.3 5.4-.2.1-.3.2-.5.3-1.5.7-3.2 1-4.9.8-2.9-.3-5.5-2-6.9-4.6-1.2-2.1-1.4-4.5-.8-6.9.7-2.3 2.2-4.3 4.3-5.4.2-.1.4-.2.5-.3 1.5-.7 3.2-1 5-.8h.2L17.1 42c-.1.4.1.8.5.9l4.9 1.6c.4.1.8-.1.9-.4l4.2-12c.1-.3.1-.6-.1-.9-.1-.3-.4-.5-.7-.6l-4.4-1.3c-.1 0-.2 0-.3-.1l-.4-.1c-.6-.1-1.3-.3-1.9-.3-3.2-.4-6.3.2-9.2 1.5-.3.2-.7.3-1 .5-4 2.2-6.8 5.8-8.1 10.1-1.3 4.4-.7 9 1.5 12.9 2.6 4.7 7.4 7.9 12.8 8.5 3.1.4 6.3-.2 9.2-1.5.3-.2.7-.3 1-.5 3.9-2.2 6.8-5.8 8-9.9l9.2-26.2v-.1c1-2.6 2.4-4.3 4.3-5.4.2-.1.4-.2.5-.3 1.5-.7 3.2-1 4.9-.8 2.9.3 5.5 2 6.9 4.6 2.4 4.4.8 9.9-3.5 12.3-.2.1-.4.2-.5.3-1.6.7-3.2 1-5 .8-.5-.1-1-.2-1.6-.3l-2.8-.8c-.3-.1-.6.1-.7.4L43.3 41c-.1.3.1.7.4.8l3.5 1c.8.2 1.7.4 2.6.5 3.1.4 6.3-.2 9.2-1.5z",
  className: "st0"
}));
const InfoIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  width: "25",
  height: "25",
  viewBox: "0 0 48 48",
  version: "1",
  xmlns: "http://www.w3.org/2000/svg"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
  fill: "#2196F3",
  cx: "24",
  cy: "24",
  r: "21"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  fill: "#fff",
  d: "M22 22h4v11h-4z"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
  fill: "#fff",
  cx: "24",
  cy: "16.5",
  r: "2.5"
}));
const blanKTabIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24",
  "aria-hidden": "true",
  focusable: "false"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M19.5 4.5h-7V6h4.44l-5.97 5.97 1.06 1.06L18 7.06v4.44h1.5v-7Zm-13 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3H17v3a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h3V5.5h-3Z"
}));
const epGetPopupIcon = () => {
  const svg = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "ep-doc-popup-icon"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    xmlSpace: "preserve"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    fill: "#fff",
    d: "M5 3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-6l-2-2v8H5V5h8l-2-2H5zm9 0 2.7 2.7-7.5 7.5 1.7 1.7 7.5-7.5L21 10V3h-7z"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    style: {
      fill: "none"
    },
    d: "M0 0h24v24H0z"
  })));
  return svg;
};
const epGetDownloadIcon = () => {
  const svg = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "ep-doc-download-icon"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    width: 20,
    height: 20,
    viewBox: "0 0 0.6 0.6",
    xmlns: "http://www.w3.org/2000/svg"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    fill: "#fff",
    fillRule: "evenodd",
    d: "M.525.4A.025.025 0 0 1 .55.422v.053A.075.075 0 0 1 .479.55H.125A.075.075 0 0 1 .05.479V.425A.025.025 0 0 1 .1.422v.053A.025.025 0 0 0 .122.5h.353A.025.025 0 0 0 .5.478V.425A.025.025 0 0 1 .525.4ZM.3.05a.025.025 0 0 1 .025.025v.24L.357.283A.025.025 0 0 1 .39.281l.002.002a.025.025 0 0 1 .002.033L.392.318.317.393.316.394.314.395.311.397.308.398.305.399.301.4H.295L.292.399.289.398.287.397.285.395A.025.025 0 0 1 .283.393L.208.318A.025.025 0 0 1 .241.281l.002.002.032.032v-.24A.025.025 0 0 1 .3.05Z"
  })));
  return svg;
};
const epGetPrintIcon = () => {
  const svg = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "ep-doc-print-icon"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: 20,
    height: 20,
    viewBox: "0 0 24 24"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z",
    fill: "#fff"
  })));
  return svg;
};
const epGetFullscreenIcon = () => {
  const svg = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "ep-doc-fullscreen-icon"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "m3 15 .117.007a1 1 0 0 1 .876.876L4 16v4h4l.117.007a1 1 0 0 1 0 1.986L8 22H3l-.117-.007a1 1 0 0 1-.876-.876L2 21v-5l.007-.117a1 1 0 0 1 .876-.876L3 15Zm18 0a1 1 0 0 1 .993.883L22 16v5a1 1 0 0 1-.883.993L21 22h-5a1 1 0 0 1-.117-1.993L16 20h4v-4a1 1 0 0 1 .883-.993L21 15ZM8 2a1 1 0 0 1 .117 1.993L8 4H4v4a1 1 0 0 1-.883.993L3 9a1 1 0 0 1-.993-.883L2 8V3a1 1 0 0 1 .883-.993L3 2h5Zm13 0 .117.007a1 1 0 0 1 .876.876L22 3v5l-.007.117a1 1 0 0 1-.876.876L21 9l-.117-.007a1 1 0 0 1-.876-.876L20 8V4h-4l-.117-.007a1 1 0 0 1 0-1.986L16 2h5Z",
    fill: "#fff"
  })));
  ;
  return svg;
};
const epGetMinimizeIcon = () => {
  const svg = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "ep-doc-minimize-icon",
    style: {
      display: "none"
    }
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    style: {
      enableBackground: "new 0 0 385.331 385.331"
    },
    xmlSpace: "preserve",
    width: 20,
    height: 20
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    fill: "#fff",
    d: "M13.751 8.131h5.62c0.355 0 0.619 -0.28 0.619 -0.634 0 -0.355 -0.265 -0.615 -0.619 -0.614h-4.995V1.878c0 -0.355 -0.27 -0.624 -0.624 -0.624s-0.624 0.27 -0.624 0.624v5.62c0 0.002 0.001 0.003 0.001 0.004 0 0.002 -0.001 0.003 -0.001 0.005 0 0.348 0.276 0.625 0.624 0.624zM6.244 1.259c-0.354 0 -0.614 0.265 -0.614 0.619v4.995H0.624c-0.355 0 -0.624 0.27 -0.624 0.624 0 0.355 0.27 0.624 0.624 0.624h5.62c0.002 0 0.003 -0.001 0.004 -0.001 0.002 0 0.003 0.001 0.005 0.001 0.348 0 0.624 -0.276 0.624 -0.624V1.878c0 -0.354 -0.28 -0.619 -0.634 -0.619zm0.005 10.61H0.629c-0.355 0.001 -0.619 0.28 -0.619 0.634 0 0.355 0.265 0.615 0.619 0.614h4.995v5.005c0 0.355 0.27 0.624 0.624 0.624 0.355 0 0.624 -0.27 0.624 -0.624V12.502c0 -0.002 -0.001 -0.003 -0.001 -0.004 0 -0.002 0.001 -0.003 0.001 -0.005 0 -0.348 -0.276 -0.624 -0.624 -0.624zm13.127 0H13.756c-0.002 0 -0.003 0.001 -0.004 0.001 -0.002 0 -0.003 -0.001 -0.005 -0.001 -0.348 0 -0.624 0.276 -0.624 0.624v5.62c0 0.355 0.28 0.619 0.634 0.619 0.354 0.001 0.614 -0.265 0.614 -0.619v-4.995H19.376c0.355 0 0.624 -0.27 0.624 -0.624s-0.27 -0.624 -0.624 -0.625z"
  }), " ", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", null), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", null), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", null), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", null), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", null), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", null)));
  ;
  return svg;
};
const epGetDrawIcon = () => {
  const svg = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "ep-doc-draw-icon"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "m15 7.5 2.5 2.5m-10 10L19.25 8.25c0.69 -0.69 0.69 -1.81 0 -2.5v0c-0.69 -0.69 -1.81 -0.69 -2.5 0L5 17.5V20h2.5Zm0 0h8.379C17.05 20 18 19.05 18 17.879v0c0 -0.563 -0.224 -1.103 -0.621 -1.5L17 16M4.5 5c2 -2 5.5 -1 5.5 1 0 2.5 -6 2.5 -6 5 0 0.876 0.533 1.526 1.226 2",
    stroke: "#fff",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })));
  return svg;
};

/***/ }),

/***/ "@wordpress/api-fetch":
/*!**********************************!*\
  !*** external ["wp","apiFetch"] ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["apiFetch"];

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/hooks":
/*!*******************************!*\
  !*** external ["wp","hooks"] ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["hooks"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = window["React"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var chunkIds = deferred[i][0];
/******/ 				var fn = deferred[i][1];
/******/ 				var priority = deferred[i][2];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"blocks.build": 0,
/******/ 			"./style-blocks.build": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var chunkIds = data[0];
/******/ 			var moreModules = data[1];
/******/ 			var runtime = data[2];
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkembedpress"] = self["webpackChunkembedpress"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-blocks.build"], () => (__webpack_require__("./src/Blocks/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=blocks.build.js.map