var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __pow = Math.pow;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
(function() {
  "use strict";
  "object" == typeof navigator && function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define("Plyr", t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).Plyr = t();
  }(void 0, function() {
    !function() {
      if ("undefined" != typeof window)
        try {
          var e2 = new window.CustomEvent("test", { cancelable: true });
          if (e2.preventDefault(), true !== e2.defaultPrevented) throw new Error("Could not prevent default");
        } catch (e3) {
          var t2 = function(e4, t3) {
            var i2, s2;
            return (t3 = t3 || {}).bubbles = !!t3.bubbles, t3.cancelable = !!t3.cancelable, (i2 = document.createEvent("CustomEvent")).initCustomEvent(e4, t3.bubbles, t3.cancelable, t3.detail), s2 = i2.preventDefault, i2.preventDefault = function() {
              s2.call(this);
              try {
                Object.defineProperty(this, "defaultPrevented", {
                  get: function() {
                    return true;
                  }
                });
              } catch (e5) {
                this.defaultPrevented = true;
              }
            }, i2;
          };
          t2.prototype = window.Event.prototype, window.CustomEvent = t2;
        }
    }();
    var e = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};
    function t(e2, t2, i2) {
      return (t2 = function(e3) {
        var t3 = function(e4, t4) {
          if ("object" != typeof e4 || null === e4) return e4;
          var i3 = e4[Symbol.toPrimitive];
          if (void 0 !== i3) {
            var s2 = i3.call(e4, t4);
            if ("object" != typeof s2) return s2;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return ("string" === t4 ? String : Number)(e4);
        }(e3, "string");
        return "symbol" == typeof t3 ? t3 : String(t3);
      }(t2)) in e2 ? Object.defineProperty(e2, t2, { value: i2, enumerable: true, configurable: true, writable: true }) : e2[t2] = i2, e2;
    }
    function i(e2, t2) {
      for (var i2 = 0; i2 < t2.length; i2++) {
        var s2 = t2[i2];
        s2.enumerable = s2.enumerable || false, s2.configurable = true, "value" in s2 && (s2.writable = true), Object.defineProperty(e2, s2.key, s2);
      }
    }
    function s(e2, t2, i2) {
      return t2 in e2 ? Object.defineProperty(e2, t2, { value: i2, enumerable: true, configurable: true, writable: true }) : e2[t2] = i2, e2;
    }
    function n(e2, t2) {
      var i2 = Object.keys(e2);
      if (Object.getOwnPropertySymbols) {
        var s2 = Object.getOwnPropertySymbols(e2);
        t2 && (s2 = s2.filter(function(t3) {
          return Object.getOwnPropertyDescriptor(e2, t3).enumerable;
        })), i2.push.apply(i2, s2);
      }
      return i2;
    }
    function a(e2) {
      for (var t2 = 1; t2 < arguments.length; t2++) {
        var i2 = null != arguments[t2] ? arguments[t2] : {};
        t2 % 2 ? n(Object(i2), true).forEach(function(t3) {
          s(e2, t3, i2[t3]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(i2)) : n(Object(i2)).forEach(function(t3) {
          Object.defineProperty(e2, t3, Object.getOwnPropertyDescriptor(i2, t3));
        });
      }
      return e2;
    }
    !function(e2) {
      var t2 = function() {
        try {
          return !!Symbol.iterator;
        } catch (e3) {
          return false;
        }
      }(), i2 = function(e3) {
        var i3 = {
          next: function() {
            var t3 = e3.shift();
            return { done: void 0 === t3, value: t3 };
          }
        };
        return t2 && (i3[Symbol.iterator] = function() {
          return i3;
        }), i3;
      }, s2 = function(e3) {
        return encodeURIComponent(e3).replace(/%20/g, "+");
      }, n2 = function(e3) {
        return decodeURIComponent(String(e3).replace(/\+/g, " "));
      };
      (function() {
        try {
          var t3 = e2.URLSearchParams;
          return "a=1" === new t3("?a=1").toString() && "function" == typeof t3.prototype.set && "function" == typeof t3.prototype.entries;
        } catch (e3) {
          return false;
        }
      })() || function() {
        var n3 = function(e3) {
          Object.defineProperty(this, "_entries", { writable: true, value: {} });
          var t3 = typeof e3;
          if ("undefined" === t3) ;
          else if ("string" === t3) "" !== e3 && this._fromString(e3);
          else if (e3 instanceof n3) {
            var i3 = this;
            e3.forEach(function(e4, t4) {
              i3.append(t4, e4);
            });
          } else {
            if (null === e3 || "object" !== t3) throw new TypeError("Unsupported input's type for URLSearchParams");
            if ("[object Array]" === Object.prototype.toString.call(e3))
              for (var s3 = 0; s3 < e3.length; s3++) {
                var a4 = e3[s3];
                if ("[object Array]" !== Object.prototype.toString.call(a4) && 2 === a4.length) throw new TypeError("Expected [string, any] as entry at index " + s3 + " of URLSearchParams's input");
                this.append(a4[0], a4[1]);
              }
            else for (var r2 in e3) e3.hasOwnProperty(r2) && this.append(r2, e3[r2]);
          }
        }, a3 = n3.prototype;
        a3.append = function(e3, t3) {
          e3 in this._entries ? this._entries[e3].push(String(t3)) : this._entries[e3] = [String(t3)];
        }, a3.delete = function(e3) {
          delete this._entries[e3];
        }, a3.get = function(e3) {
          return e3 in this._entries ? this._entries[e3][0] : null;
        }, a3.getAll = function(e3) {
          return e3 in this._entries ? this._entries[e3].slice(0) : [];
        }, a3.has = function(e3) {
          return e3 in this._entries;
        }, a3.set = function(e3, t3) {
          this._entries[e3] = [String(t3)];
        }, a3.forEach = function(e3, t3) {
          var i3;
          for (var s3 in this._entries)
            if (this._entries.hasOwnProperty(s3)) {
              i3 = this._entries[s3];
              for (var n4 = 0; n4 < i3.length; n4++) e3.call(t3, i3[n4], s3, this);
            }
        }, a3.keys = function() {
          var e3 = [];
          return this.forEach(function(t3, i3) {
            e3.push(i3);
          }), i2(e3);
        }, a3.values = function() {
          var e3 = [];
          return this.forEach(function(t3) {
            e3.push(t3);
          }), i2(e3);
        }, a3.entries = function() {
          var e3 = [];
          return this.forEach(function(t3, i3) {
            e3.push([i3, t3]);
          }), i2(e3);
        }, t2 && (a3[Symbol.iterator] = a3.entries), a3.toString = function() {
          var e3 = [];
          return this.forEach(function(t3, i3) {
            e3.push(s2(i3) + "=" + s2(t3));
          }), e3.join("&");
        }, e2.URLSearchParams = n3;
      }();
      var a2 = e2.URLSearchParams.prototype;
      "function" != typeof a2.sort && (a2.sort = function() {
        var e3 = this, t3 = [];
        this.forEach(function(i4, s3) {
          t3.push([s3, i4]), e3._entries || e3.delete(s3);
        }), t3.sort(function(e4, t4) {
          return e4[0] < t4[0] ? -1 : e4[0] > t4[0] ? 1 : 0;
        }), e3._entries && (e3._entries = {});
        for (var i3 = 0; i3 < t3.length; i3++) this.append(t3[i3][0], t3[i3][1]);
      }), "function" != typeof a2._fromString && Object.defineProperty(a2, "_fromString", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function(e3) {
          if (this._entries) this._entries = {};
          else {
            var t3 = [];
            this.forEach(function(e4, i4) {
              t3.push(i4);
            });
            for (var i3 = 0; i3 < t3.length; i3++) this.delete(t3[i3]);
          }
          var s3, a3 = (e3 = e3.replace(/^\?/, "")).split("&");
          for (i3 = 0; i3 < a3.length; i3++) s3 = a3[i3].split("="), this.append(n2(s3[0]), s3.length > 1 ? n2(s3[1]) : "");
        }
      });
    }(void 0 !== e ? e : "undefined" != typeof window ? window : "undefined" != typeof self ? self : e), function(e2) {
      if (function() {
        try {
          var t3 = new e2.URL("b", "http://a");
          return t3.pathname = "c d", "http://a/c%20d" === t3.href && t3.searchParams;
        } catch (e3) {
          return false;
        }
      }() || function() {
        var t3 = e2.URL, i2 = function(t4, i3) {
          "string" != typeof t4 && (t4 = String(t4)), i3 && "string" != typeof i3 && (i3 = String(i3));
          var s3, n2 = document;
          if (i3 && (void 0 === e2.location || i3 !== e2.location.href)) {
            i3 = i3.toLowerCase(), (s3 = (n2 = document.implementation.createHTMLDocument("")).createElement("base")).href = i3, n2.head.appendChild(s3);
            try {
              if (0 !== s3.href.indexOf(i3)) throw new Error(s3.href);
            } catch (e3) {
              throw new Error("URL unable to set base " + i3 + " due to " + e3);
            }
          }
          var a2 = n2.createElement("a");
          a2.href = t4, s3 && (n2.body.appendChild(a2), a2.href = a2.href);
          var r2 = n2.createElement("input");
          if (r2.type = "url", r2.value = t4, ":" === a2.protocol || !/:/.test(a2.href) || !r2.checkValidity() && !i3) throw new TypeError("Invalid URL");
          Object.defineProperty(this, "_anchorElement", { value: a2 });
          var o2 = new e2.URLSearchParams(this.search), l2 = true, c2 = true, u2 = this;
          ["append", "delete", "set"].forEach(function(e3) {
            var t5 = o2[e3];
            o2[e3] = function() {
              t5.apply(o2, arguments), l2 && (c2 = false, u2.search = o2.toString(), c2 = true);
            };
          }), Object.defineProperty(this, "searchParams", { value: o2, enumerable: true });
          var h2 = void 0;
          Object.defineProperty(this, "_updateSearchParams", {
            enumerable: false,
            configurable: false,
            writable: false,
            value: function() {
              this.search !== h2 && (h2 = this.search, c2 && (l2 = false, this.searchParams._fromString(this.search), l2 = true));
            }
          });
        }, s2 = i2.prototype;
        ["hash", "host", "hostname", "port", "protocol"].forEach(function(e3) {
          !function(e4) {
            Object.defineProperty(s2, e4, {
              get: function() {
                return this._anchorElement[e4];
              },
              set: function(t4) {
                this._anchorElement[e4] = t4;
              },
              enumerable: true
            });
          }(e3);
        }), Object.defineProperty(s2, "search", {
          get: function() {
            return this._anchorElement.search;
          },
          set: function(e3) {
            this._anchorElement.search = e3, this._updateSearchParams();
          },
          enumerable: true
        }), Object.defineProperties(s2, {
          toString: {
            get: function() {
              var e3 = this;
              return function() {
                return e3.href;
              };
            }
          },
          href: {
            get: function() {
              return this._anchorElement.href.replace(/\?$/, "");
            },
            set: function(e3) {
              this._anchorElement.href = e3, this._updateSearchParams();
            },
            enumerable: true
          },
          pathname: {
            get: function() {
              return this._anchorElement.pathname.replace(/(^\/?)/, "/");
            },
            set: function(e3) {
              this._anchorElement.pathname = e3;
            },
            enumerable: true
          },
          origin: {
            get: function() {
              var e3 = { "http:": 80, "https:": 443, "ftp:": 21 }[this._anchorElement.protocol], t4 = this._anchorElement.port != e3 && "" !== this._anchorElement.port;
              return this._anchorElement.protocol + "//" + this._anchorElement.hostname + (t4 ? ":" + this._anchorElement.port : "");
            },
            enumerable: true
          },
          password: {
            get: function() {
              return "";
            },
            set: function(e3) {
            },
            enumerable: true
          },
          username: {
            get: function() {
              return "";
            },
            set: function(e3) {
            },
            enumerable: true
          }
        }), i2.createObjectURL = function(e3) {
          return t3.createObjectURL.apply(t3, arguments);
        }, i2.revokeObjectURL = function(e3) {
          return t3.revokeObjectURL.apply(t3, arguments);
        }, e2.URL = i2;
      }(), void 0 !== e2.location && !("origin" in e2.location)) {
        var t2 = function() {
          return e2.location.protocol + "//" + e2.location.hostname + (e2.location.port ? ":" + e2.location.port : "");
        };
        try {
          Object.defineProperty(e2.location, "origin", { get: t2, enumerable: true });
        } catch (i2) {
          setInterval(function() {
            e2.location.origin = t2();
          }, 100);
        }
      }
    }(void 0 !== e ? e : "undefined" != typeof window ? window : "undefined" != typeof self ? self : e);
    var r = { addCSS: true, thumbWidth: 15, watch: true };
    var o = function(e2) {
      return null != e2 ? e2.constructor : null;
    }, l = function(e2, t2) {
      return !!(e2 && t2 && e2 instanceof t2);
    }, c = function(e2) {
      return null == e2;
    }, u = function(e2) {
      return o(e2) === Object;
    }, h = function(e2) {
      return o(e2) === String;
    }, d = function(e2) {
      return Array.isArray(e2);
    }, m = function(e2) {
      return l(e2, NodeList);
    }, p = {
      nullOrUndefined: c,
      object: u,
      number: function(e2) {
        return o(e2) === Number && !Number.isNaN(e2);
      },
      string: h,
      boolean: function(e2) {
        return o(e2) === Boolean;
      },
      function: function(e2) {
        return o(e2) === Function;
      },
      array: d,
      nodeList: m,
      element: function(e2) {
        return l(e2, Element);
      },
      event: function(e2) {
        return l(e2, Event);
      },
      empty: function(e2) {
        return c(e2) || (h(e2) || d(e2) || m(e2)) && !e2.length || u(e2) && !Object.keys(e2).length;
      }
    };
    function g(e2, t2) {
      if (1 > t2) {
        var i2 = function(e3) {
          var t3 = "".concat(e3).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
          return t3 ? Math.max(0, (t3[1] ? t3[1].length : 0) - (t3[2] ? +t3[2] : 0)) : 0;
        }(t2);
        return parseFloat(e2.toFixed(i2));
      }
      return Math.round(e2 / t2) * t2;
    }
    var f = function() {
      function e2(t2, i2) {
        (function(e3, t3) {
          if (!(e3 instanceof t3)) throw new TypeError("Cannot call a class as a function");
        })(this, e2), p.element(t2) ? this.element = t2 : p.string(t2) && (this.element = document.querySelector(t2)), p.element(this.element) && p.empty(this.element.rangeTouch) && (this.config = a({}, r, {}, i2), this.init());
      }
      return function(e3, t2, s2) {
        t2 && i(e3.prototype, t2), s2 && i(e3, s2);
      }(
        e2,
        [
          {
            key: "init",
            value: function() {
              e2.enabled && (this.config.addCSS && (this.element.style.userSelect = "none", this.element.style.webKitUserSelect = "none", this.element.style.touchAction = "manipulation"), this.listeners(true), this.element.rangeTouch = this);
            }
          },
          {
            key: "destroy",
            value: function() {
              e2.enabled && (this.config.addCSS && (this.element.style.userSelect = "", this.element.style.webKitUserSelect = "", this.element.style.touchAction = ""), this.listeners(false), this.element.rangeTouch = null);
            }
          },
          {
            key: "listeners",
            value: function(e3) {
              var t2 = this, i2 = e3 ? "addEventListener" : "removeEventListener";
              ["touchstart", "touchmove", "touchend"].forEach(function(e4) {
                t2.element[i2](
                  e4,
                  function(e5) {
                    return t2.set(e5);
                  },
                  false
                );
              });
            }
          },
          {
            key: "get",
            value: function(t2) {
              if (!e2.enabled || !p.event(t2)) return null;
              var i2, s2 = t2.target, n2 = t2.changedTouches[0], a2 = parseFloat(s2.getAttribute("min")) || 0, r2 = parseFloat(s2.getAttribute("max")) || 100, o2 = parseFloat(s2.getAttribute("step")) || 1, l2 = s2.getBoundingClientRect(), c2 = 100 / l2.width * (this.config.thumbWidth / 2) / 100;
              return 0 > (i2 = 100 / l2.width * (n2.clientX - l2.left)) ? i2 = 0 : 100 < i2 && (i2 = 100), 50 > i2 ? i2 -= (100 - 2 * i2) * c2 : 50 < i2 && (i2 += 2 * (i2 - 50) * c2), a2 + g(i2 / 100 * (r2 - a2), o2);
            }
          },
          {
            key: "set",
            value: function(t2) {
              e2.enabled && p.event(t2) && !t2.target.disabled && (t2.preventDefault(), t2.target.value = this.get(t2), function(e3, t3) {
                if (e3 && t3) {
                  var i2 = new Event(t3, { bubbles: true });
                  e3.dispatchEvent(i2);
                }
              }(t2.target, "touchend" === t2.type ? "change" : "input"));
            }
          }
        ],
        [
          {
            key: "setup",
            value: function(t2) {
              var i2 = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {}, s2 = null;
              if (p.empty(t2) || p.string(t2) ? s2 = Array.from(document.querySelectorAll(p.string(t2) ? t2 : 'input[type="range"]')) : p.element(t2) ? s2 = [t2] : p.nodeList(t2) ? s2 = Array.from(t2) : p.array(t2) && (s2 = t2.filter(p.element)), p.empty(s2))
                return null;
              var n2 = a({}, r, {}, i2);
              if (p.string(t2) && n2.watch) {
                var o2 = new MutationObserver(function(i3) {
                  Array.from(i3).forEach(function(i4) {
                    Array.from(i4.addedNodes).forEach(function(i5) {
                      p.element(i5) && function(e3, t3) {
                        return function() {
                          return Array.from(document.querySelectorAll(t3)).includes(this);
                        }.call(e3, t3);
                      }(i5, t2) && new e2(i5, n2);
                    });
                  });
                });
                o2.observe(document.body, { childList: true, subtree: true });
              }
              return s2.map(function(t3) {
                return new e2(t3, i2);
              });
            }
          },
          {
            key: "enabled",
            get: function() {
              return "ontouchstart" in document.documentElement;
            }
          }
        ]
      ), e2;
    }();
    const y = (e2) => null != e2 ? e2.constructor : null, b = (e2, t2) => Boolean(e2 && t2 && e2 instanceof t2), v = (e2) => null == e2, w = (e2) => y(e2) === Object, T = (e2) => y(e2) === String, k = (e2) => "function" == typeof e2, E = (e2) => Array.isArray(e2), C = (e2) => b(e2, NodeList), S = (e2) => v(e2) || (T(e2) || E(e2) || C(e2)) && !e2.length || w(e2) && !Object.keys(e2).length;
    var A = {
      nullOrUndefined: v,
      object: w,
      number: (e2) => y(e2) === Number && !Number.isNaN(e2),
      string: T,
      boolean: (e2) => y(e2) === Boolean,
      function: k,
      array: E,
      weakMap: (e2) => b(e2, WeakMap),
      nodeList: C,
      element: (e2) => null !== e2 && "object" == typeof e2 && 1 === e2.nodeType && "object" == typeof e2.style && "object" == typeof e2.ownerDocument,
      textNode: (e2) => y(e2) === Text,
      event: (e2) => b(e2, Event),
      keyboardEvent: (e2) => b(e2, KeyboardEvent),
      cue: (e2) => b(e2, window.TextTrackCue) || b(e2, window.VTTCue),
      track: (e2) => b(e2, TextTrack) || !v(e2) && T(e2.kind),
      promise: (e2) => b(e2, Promise) && k(e2.then),
      url: (e2) => {
        if (b(e2, window.URL)) return true;
        if (!T(e2)) return false;
        let t2 = e2;
        e2.startsWith("http://") && e2.startsWith("https://") || (t2 = `http://${e2}`);
        try {
          return !S(new URL(t2).hostname);
        } catch (e3) {
          return false;
        }
      },
      empty: S
    };
    const P = (() => {
      const e2 = document.createElement("span"), t2 = { WebkitTransition: "webkitTransitionEnd", MozTransition: "transitionend", OTransition: "oTransitionEnd otransitionend", transition: "transitionend" }, i2 = Object.keys(t2).find((t3) => void 0 !== e2.style[t3]);
      return !!A.string(i2) && t2[i2];
    })();
    function M(e2, t2) {
      setTimeout(() => {
        try {
          e2.hidden = true, e2.offsetHeight, e2.hidden = false;
        } catch (e3) {
        }
      }, t2);
    }
    var x = {
      isIE: Boolean(window.document.documentMode),
      isEdge: /Edge/g.test(navigator.userAgent),
      isWebKit: "WebkitAppearance" in document.documentElement.style && !/Edge/g.test(navigator.userAgent),
      isIPhone: /iPhone|iPod/gi.test(navigator.userAgent) && navigator.maxTouchPoints > 1,
      isIPadOS: "MacIntel" === navigator.platform && navigator.maxTouchPoints > 1,
      isIos: /iPad|iPhone|iPod/gi.test(navigator.userAgent) && navigator.maxTouchPoints > 1
    };
    function L(e2, t2) {
      return t2.split(".").reduce((e3, t3) => e3 && e3[t3], e2);
    }
    function N(e2 = {}, ...t2) {
      if (!t2.length) return e2;
      const i2 = t2.shift();
      return A.object(i2) ? (Object.keys(i2).forEach((t3) => {
        A.object(i2[t3]) ? (Object.keys(e2).includes(t3) || Object.assign(e2, { [t3]: {} }), N(e2[t3], i2[t3])) : Object.assign(e2, { [t3]: i2[t3] });
      }), N(e2, ...t2)) : e2;
    }
    function _(e2, t2) {
      const i2 = e2.length ? e2 : [e2];
      Array.from(i2).reverse().forEach((e3, i3) => {
        const s2 = i3 > 0 ? t2.cloneNode(true) : t2, n2 = e3.parentNode, a2 = e3.nextSibling;
        s2.appendChild(e3), a2 ? n2.insertBefore(s2, a2) : n2.appendChild(s2);
      });
    }
    function I(e2, t2) {
      A.element(e2) && !A.empty(t2) && Object.entries(t2).filter(([, e3]) => !A.nullOrUndefined(e3)).forEach(([t3, i2]) => e2.setAttribute(t3, i2));
    }
    function O(e2, t2, i2) {
      const s2 = document.createElement(e2);
      return A.object(t2) && I(s2, t2), A.string(i2) && (s2.innerText = i2), s2;
    }
    function $(e2, t2, i2, s2) {
      A.element(t2) && t2.appendChild(O(e2, i2, s2));
    }
    function j(e2) {
      A.nodeList(e2) || A.array(e2) ? Array.from(e2).forEach(j) : A.element(e2) && A.element(e2.parentNode) && e2.parentNode.removeChild(e2);
    }
    function R(e2) {
      if (!A.element(e2)) return;
      let { length: t2 } = e2.childNodes;
      for (; t2 > 0; ) e2.removeChild(e2.lastChild), t2 -= 1;
    }
    function D(e2, t2) {
      return A.element(t2) && A.element(t2.parentNode) && A.element(e2) ? (t2.parentNode.replaceChild(e2, t2), e2) : null;
    }
    function q(e2, t2) {
      if (!A.string(e2) || A.empty(e2)) return {};
      const i2 = {}, s2 = N({}, t2);
      return e2.split(",").forEach((e3) => {
        const t3 = e3.trim(), n2 = t3.replace(".", ""), a2 = t3.replace(/[[\]]/g, "").split("="), [r2] = a2, o2 = a2.length > 1 ? a2[1].replace(/["']/g, "") : "";
        switch (t3.charAt(0)) {
          case ".":
            A.string(s2.class) ? i2.class = `${s2.class} ${n2}` : i2.class = n2;
            break;
          case "#":
            i2.id = t3.replace("#", "");
            break;
          case "[":
            i2[r2] = o2;
        }
      }), N(s2, i2);
    }
    function H(e2, t2) {
      if (!A.element(e2)) return;
      let i2 = t2;
      A.boolean(i2) || (i2 = !e2.hidden), e2.hidden = i2;
    }
    function F(e2, t2, i2) {
      if (A.nodeList(e2)) return Array.from(e2).map((e3) => F(e3, t2, i2));
      if (A.element(e2)) {
        let s2 = "toggle";
        return void 0 !== i2 && (s2 = i2 ? "add" : "remove"), e2.classList[s2](t2), e2.classList.contains(t2);
      }
      return false;
    }
    function U(e2, t2) {
      return A.element(e2) && e2.classList.contains(t2);
    }
    function V(e2, t2) {
      const { prototype: i2 } = Element;
      return (i2.matches || i2.webkitMatchesSelector || i2.mozMatchesSelector || i2.msMatchesSelector || function() {
        return Array.from(document.querySelectorAll(t2)).includes(this);
      }).call(e2, t2);
    }
    function B(e2) {
      return this.elements.container.querySelectorAll(e2);
    }
    function W(e2) {
      return this.elements.container.querySelector(e2);
    }
    function z(e2 = null, t2 = false) {
      A.element(e2) && e2.focus({ preventScroll: true, focusVisible: t2 });
    }
    const K = { "audio/ogg": "vorbis", "audio/wav": "1", "video/webm": "vp8, vorbis", "video/mp4": "avc1.42E01E, mp4a.40.2", "video/ogg": "theora" }, Y = {
      audio: "canPlayType" in document.createElement("audio"),
      video: "canPlayType" in document.createElement("video"),
      check(e2, t2) {
        const i2 = Y[e2] || "html5" !== t2;
        return { api: i2, ui: i2 && Y.rangeInput };
      },
      pip: !(x.isIPhone || !A.function(O("video").webkitSetPresentationMode) && (!document.pictureInPictureEnabled || O("video").disablePictureInPicture)),
      airplay: A.function(window.WebKitPlaybackTargetAvailabilityEvent),
      playsinline: "playsInline" in document.createElement("video"),
      mime(e2) {
        if (A.empty(e2)) return false;
        const [t2] = e2.split("/");
        let i2 = e2;
        if (!this.isHTML5 || t2 !== this.type) return false;
        Object.keys(K).includes(i2) && (i2 += `; codecs="${K[e2]}"`);
        try {
          return Boolean(i2 && this.media.canPlayType(i2).replace(/no/, ""));
        } catch (e3) {
          return false;
        }
      },
      textTracks: "textTracks" in document.createElement("video"),
      rangeInput: (() => {
        const e2 = document.createElement("input");
        return e2.type = "range", "range" === e2.type;
      })(),
      touch: "ontouchstart" in document.documentElement,
      transitions: false !== P,
      reducedMotion: "matchMedia" in window && window.matchMedia("(prefers-reduced-motion)").matches
    }, Q = (() => {
      let e2 = false;
      try {
        const t2 = Object.defineProperty({}, "passive", { get: () => (e2 = true, null) });
        window.addEventListener("test", null, t2), window.removeEventListener("test", null, t2);
      } catch (e3) {
      }
      return e2;
    })();
    function X(e2, t2, i2, s2 = false, n2 = true, a2 = false) {
      if (!e2 || !("addEventListener" in e2) || A.empty(t2) || !A.function(i2)) return;
      const r2 = t2.split(" ");
      let o2 = a2;
      Q && (o2 = { passive: n2, capture: a2 }), r2.forEach((t3) => {
        this && this.eventListeners && s2 && this.eventListeners.push({ element: e2, type: t3, callback: i2, options: o2 }), e2[s2 ? "addEventListener" : "removeEventListener"](t3, i2, o2);
      });
    }
    function J(e2, t2 = "", i2, s2 = true, n2 = false) {
      X.call(this, e2, t2, i2, true, s2, n2);
    }
    function G(e2, t2 = "", i2, s2 = true, n2 = false) {
      X.call(this, e2, t2, i2, false, s2, n2);
    }
    function Z(e2, t2 = "", i2, s2 = true, n2 = false) {
      const a2 = (...r2) => {
        G(e2, t2, a2, s2, n2), i2.apply(this, r2);
      };
      X.call(this, e2, t2, a2, true, s2, n2);
    }
    function ee(e2, t2 = "", i2 = false, s2 = {}) {
      if (!A.element(e2) || A.empty(t2)) return;
      const n2 = new CustomEvent(t2, { bubbles: i2, detail: __spreadProps(__spreadValues({}, s2), { plyr: this }) });
      e2.dispatchEvent(n2);
    }
    function te() {
      this && this.eventListeners && (this.eventListeners.forEach((e2) => {
        const { element: t2, type: i2, callback: s2, options: n2 } = e2;
        t2.removeEventListener(i2, s2, n2);
      }), this.eventListeners = []);
    }
    function ie() {
      return new Promise((e2) => this.ready ? setTimeout(e2, 0) : J.call(this, this.elements.container, "ready", e2)).then(() => {
      });
    }
    function se(e2) {
      A.promise(e2) && e2.then(null, () => {
      });
    }
    function ne(e2) {
      return A.array(e2) ? e2.filter((t2, i2) => e2.indexOf(t2) === i2) : e2;
    }
    function ae(e2, t2) {
      return A.array(e2) && e2.length ? e2.reduce((e3, i2) => Math.abs(i2 - t2) < Math.abs(e3 - t2) ? i2 : e3) : null;
    }
    function re(e2) {
      return !(!window || !window.CSS) && window.CSS.supports(e2);
    }
    const oe = [
      [1, 1],
      [4, 3],
      [3, 4],
      [5, 4],
      [4, 5],
      [3, 2],
      [2, 3],
      [16, 10],
      [10, 16],
      [16, 9],
      [9, 16],
      [21, 9],
      [9, 21],
      [32, 9],
      [9, 32]
    ].reduce((e2, [t2, i2]) => __spreadProps(__spreadValues({}, e2), { [t2 / i2]: [t2, i2] }), {});
    function le(e2) {
      if (!(A.array(e2) || A.string(e2) && e2.includes(":"))) return false;
      return (A.array(e2) ? e2 : e2.split(":")).map(Number).every(A.number);
    }
    function ce(e2) {
      if (!A.array(e2) || !e2.every(A.number)) return null;
      const [t2, i2] = e2, s2 = (e3, t3) => 0 === t3 ? e3 : s2(t3, e3 % t3), n2 = s2(t2, i2);
      return [t2 / n2, i2 / n2];
    }
    function ue(e2) {
      const t2 = (e3) => le(e3) ? e3.split(":").map(Number) : null;
      let i2 = t2(e2);
      if (null === i2 && (i2 = t2(this.config.ratio)), null === i2 && !A.empty(this.embed) && A.array(this.embed.ratio) && ({ ratio: i2 } = this.embed), null === i2 && this.isHTML5) {
        const { videoWidth: e3, videoHeight: t3 } = this.media;
        i2 = [e3, t3];
      }
      return ce(i2);
    }
    function he(e2) {
      if (!this.isVideo) return {};
      const { wrapper: t2 } = this.elements, i2 = ue.call(this, e2);
      if (!A.array(i2)) return {};
      const [s2, n2] = ce(i2), a2 = 100 / s2 * n2;
      if (re(`aspect-ratio: ${s2}/${n2}`) ? t2.style.aspectRatio = `${s2}/${n2}` : t2.style.paddingBottom = `${a2}%`, this.isVimeo && !this.config.vimeo.premium && this.supported.ui) {
        const e3 = 100 / this.media.offsetWidth * parseInt(window.getComputedStyle(this.media).paddingBottom, 10), i3 = (e3 - a2) / (e3 / 50);
        this.fullscreen.active ? t2.style.paddingBottom = null : this.media.style.transform = `translateY(-${i3}%)`;
      } else this.isHTML5 && t2.classList.add(this.config.classNames.videoFixedRatio);
      return { padding: a2, ratio: i2 };
    }
    function de(e2, t2, i2 = 0.05) {
      const s2 = e2 / t2, n2 = ae(Object.keys(oe), s2);
      return Math.abs(n2 - s2) <= i2 ? oe[n2] : [e2, t2];
    }
    const me = {
      getSources() {
        if (!this.isHTML5) return [];
        return Array.from(this.media.querySelectorAll("source")).filter((e2) => {
          const t2 = e2.getAttribute("type");
          return !!A.empty(t2) || Y.mime.call(this, t2);
        });
      },
      getQualityOptions() {
        return this.config.quality.forced ? this.config.quality.options : me.getSources.call(this).map((e2) => Number(e2.getAttribute("size"))).filter(Boolean);
      },
      setup() {
        if (!this.isHTML5) return;
        const e2 = this;
        e2.options.speed = e2.config.speed.options, A.empty(this.config.ratio) || he.call(e2), Object.defineProperty(e2.media, "quality", {
          get() {
            const t2 = me.getSources.call(e2).find((t3) => t3.getAttribute("src") === e2.source);
            return t2 && Number(t2.getAttribute("size"));
          },
          set(t2) {
            if (e2.quality !== t2) {
              if (e2.config.quality.forced && A.function(e2.config.quality.onChange)) e2.config.quality.onChange(t2);
              else {
                const i2 = me.getSources.call(e2).find((e3) => Number(e3.getAttribute("size")) === t2);
                if (!i2) return;
                const { currentTime: s2, paused: n2, preload: a2, readyState: r2, playbackRate: o2 } = e2.media;
                e2.media.src = i2.getAttribute("src"), ("none" !== a2 || r2) && (e2.once("loadedmetadata", () => {
                  e2.speed = o2, e2.currentTime = s2, n2 || se(e2.play());
                }), e2.media.load());
              }
              ee.call(e2, e2.media, "qualitychange", false, { quality: t2 });
            }
          }
        });
      },
      cancelRequests() {
        this.isHTML5 && (j(me.getSources.call(this)), this.media.setAttribute("src", this.config.blankVideo), this.media.load(), this.debug.log("Cancelled network requests"));
      }
    };
    function pe(e2, ...t2) {
      return A.empty(e2) ? e2 : e2.toString().replace(/{(\d+)}/g, (e3, i2) => t2[i2].toString());
    }
    const ge = (e2 = "", t2 = "", i2 = "") => e2.replace(new RegExp(t2.toString().replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1"), "g"), i2.toString()), fe = (e2 = "") => e2.toString().replace(/\w\S*/g, (e3) => e3.charAt(0).toUpperCase() + e3.slice(1).toLowerCase());
    function ye(e2 = "") {
      let t2 = e2.toString();
      return t2 = function(e3 = "") {
        let t3 = e3.toString();
        return t3 = ge(t3, "-", " "), t3 = ge(t3, "_", " "), t3 = fe(t3), ge(t3, " ", "");
      }(t2), t2.charAt(0).toLowerCase() + t2.slice(1);
    }
    function be(e2) {
      const t2 = document.createElement("div");
      return t2.appendChild(e2), t2.innerHTML;
    }
    const ve = { pip: "PIP", airplay: "AirPlay", html5: "HTML5", vimeo: "Vimeo", youtube: "YouTube" }, we = {
      get(e2 = "", t2 = {}) {
        if (A.empty(e2) || A.empty(t2)) return "";
        let i2 = L(t2.i18n, e2);
        if (A.empty(i2)) return Object.keys(ve).includes(e2) ? ve[e2] : "";
        const s2 = { "{seektime}": t2.seekTime, "{title}": t2.title };
        return Object.entries(s2).forEach(([e3, t3]) => {
          i2 = ge(i2, e3, t3);
        }), i2;
      }
    };
    class Te {
      constructor(e2) {
        t(this, "get", (e3) => {
          if (!Te.supported || !this.enabled) return null;
          const t2 = window.localStorage.getItem(this.key);
          if (A.empty(t2)) return null;
          const i2 = JSON.parse(t2);
          return A.string(e3) && e3.length ? i2[e3] : i2;
        }), t(this, "set", (e3) => {
          if (!Te.supported || !this.enabled) return;
          if (!A.object(e3)) return;
          let t2 = this.get();
          A.empty(t2) && (t2 = {}), N(t2, e3);
          try {
            window.localStorage.setItem(this.key, JSON.stringify(t2));
          } catch (e4) {
          }
        }), this.enabled = e2.config.storage.enabled, this.key = e2.config.storage.key;
      }
      static get supported() {
        try {
          if (!("localStorage" in window)) return false;
          const e2 = "___test";
          return window.localStorage.setItem(e2, e2), window.localStorage.removeItem(e2), true;
        } catch (e2) {
          return false;
        }
      }
    }
    function ke(e2, t2 = "text") {
      return new Promise((i2, s2) => {
        try {
          const s3 = new XMLHttpRequest();
          if (!("withCredentials" in s3)) return;
          s3.addEventListener("load", () => {
            if ("text" === t2)
              try {
                i2(JSON.parse(s3.responseText));
              } catch (e3) {
                i2(s3.responseText);
              }
            else i2(s3.response);
          }), s3.addEventListener("error", () => {
            throw new Error(s3.status);
          }), s3.open("GET", e2, true), s3.responseType = t2, s3.send();
        } catch (e3) {
          s2(e3);
        }
      });
    }
    function Ee(e2, t2) {
      if (!A.string(e2)) return;
      const i2 = "cache", s2 = A.string(t2);
      let n2 = false;
      const a2 = () => null !== document.getElementById(t2), r2 = (e3, t3) => {
        e3.innerHTML = t3, s2 && a2() || document.body.insertAdjacentElement("afterbegin", e3);
      };
      if (!s2 || !a2()) {
        const a3 = Te.supported, o2 = document.createElement("div");
        if (o2.setAttribute("hidden", ""), s2 && o2.setAttribute("id", t2), a3) {
          const e3 = window.localStorage.getItem(`${i2}-${t2}`);
          if (n2 = null !== e3, n2) {
            const t3 = JSON.parse(e3);
            r2(o2, t3.content);
          }
        }
        ke(e2).then((e3) => {
          if (!A.empty(e3)) {
            if (a3)
              try {
                window.localStorage.setItem(`${i2}-${t2}`, JSON.stringify({ content: e3 }));
              } catch (e4) {
              }
            r2(o2, e3);
          }
        }).catch(() => {
        });
      }
    }
    const Ce = (e2) => Math.trunc(e2 / 60 / 60 % 60, 10), Se = (e2) => Math.trunc(e2 / 60 % 60, 10), Ae = (e2) => Math.trunc(e2 % 60, 10);
    function Pe(e2 = 0, t2 = false, i2 = false) {
      if (!A.number(e2)) return Pe(void 0, t2, i2);
      const s2 = (e3) => `0${e3}`.slice(-2);
      let n2 = Ce(e2);
      const a2 = Se(e2), r2 = Ae(e2);
      return n2 = t2 || n2 > 0 ? `${n2}:` : "", `${i2 && e2 > 0 ? "-" : ""}${n2}${s2(a2)}:${s2(r2)}`;
    }
    const Me = {
      getIconUrl() {
        const e2 = new URL(this.config.iconUrl, window.location), t2 = window.location.host ? window.location.host : window.top.location.host, i2 = e2.host !== t2 || x.isIE && !window.svg4everybody;
        return { url: this.config.iconUrl, cors: i2 };
      },
      findElements() {
        try {
          return this.elements.controls = W.call(this, this.config.selectors.controls.wrapper), this.elements.buttons = {
            play: B.call(this, this.config.selectors.buttons.play),
            pause: W.call(this, this.config.selectors.buttons.pause),
            restart: W.call(this, this.config.selectors.buttons.restart),
            rewind: W.call(this, this.config.selectors.buttons.rewind),
            fastForward: W.call(this, this.config.selectors.buttons.fastForward),
            mute: W.call(this, this.config.selectors.buttons.mute),
            pip: W.call(this, this.config.selectors.buttons.pip),
            airplay: W.call(this, this.config.selectors.buttons.airplay),
            settings: W.call(this, this.config.selectors.buttons.settings),
            captions: W.call(this, this.config.selectors.buttons.captions),
            fullscreen: W.call(this, this.config.selectors.buttons.fullscreen)
          }, this.elements.progress = W.call(this, this.config.selectors.progress), this.elements.inputs = { seek: W.call(this, this.config.selectors.inputs.seek), volume: W.call(this, this.config.selectors.inputs.volume) }, this.elements.display = {
            buffer: W.call(this, this.config.selectors.display.buffer),
            currentTime: W.call(this, this.config.selectors.display.currentTime),
            duration: W.call(this, this.config.selectors.display.duration)
          }, A.element(this.elements.progress) && (this.elements.display.seekTooltip = this.elements.progress.querySelector(`.${this.config.classNames.tooltip}`)), true;
        } catch (e2) {
          return this.debug.warn("It looks like there is a problem with your custom controls HTML", e2), this.toggleNativeControls(true), false;
        }
      },
      createIcon(e2, t2) {
        const i2 = "http://www.w3.org/2000/svg", s2 = Me.getIconUrl.call(this), n2 = `${s2.cors ? "" : s2.url}#${this.config.iconPrefix}`, a2 = document.createElementNS(i2, "svg");
        I(a2, N(t2, { "aria-hidden": "true", focusable: "false" }));
        const r2 = document.createElementNS(i2, "use"), o2 = `${n2}-${e2}`;
        return "href" in r2 && r2.setAttributeNS("http://www.w3.org/1999/xlink", "href", o2), r2.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", o2), a2.appendChild(r2), a2;
      },
      createLabel(e2, t2 = {}) {
        const i2 = we.get(e2, this.config);
        return O("span", __spreadProps(__spreadValues({}, t2), { class: [t2.class, this.config.classNames.hidden].filter(Boolean).join(" ") }), i2);
      },
      createBadge(e2) {
        if (A.empty(e2)) return null;
        const t2 = O("span", { class: this.config.classNames.menu.value });
        return t2.appendChild(O("span", { class: this.config.classNames.menu.badge }, e2)), t2;
      },
      createButton(e2, t2) {
        const i2 = N({}, t2);
        let s2 = ye(e2);
        const n2 = { element: "button", toggle: false, label: null, icon: null, labelPressed: null, iconPressed: null };
        switch (["element", "icon", "label"].forEach((e3) => {
          Object.keys(i2).includes(e3) && (n2[e3] = i2[e3], delete i2[e3]);
        }), "button" !== n2.element || Object.keys(i2).includes("type") || (i2.type = "button"), Object.keys(i2).includes("class") ? i2.class.split(" ").some((e3) => e3 === this.config.classNames.control) || N(i2, { class: `${i2.class} ${this.config.classNames.control}` }) : i2.class = this.config.classNames.control, e2) {
          case "play":
            n2.toggle = true, n2.label = "play", n2.labelPressed = "pause", n2.icon = "play", n2.iconPressed = "pause";
            break;
          case "mute":
            n2.toggle = true, n2.label = "mute", n2.labelPressed = "unmute", n2.icon = "volume", n2.iconPressed = "muted";
            break;
          case "captions":
            n2.toggle = true, n2.label = "enableCaptions", n2.labelPressed = "disableCaptions", n2.icon = "captions-off", n2.iconPressed = "captions-on";
            break;
          case "fullscreen":
            n2.toggle = true, n2.label = "enterFullscreen", n2.labelPressed = "exitFullscreen", n2.icon = "enter-fullscreen", n2.iconPressed = "exit-fullscreen";
            break;
          case "play-large":
            i2.class += ` ${this.config.classNames.control}--overlaid`, s2 = "play", n2.label = "play", n2.icon = "play";
            break;
          default:
            A.empty(n2.label) && (n2.label = s2), A.empty(n2.icon) && (n2.icon = e2);
        }
        const a2 = O(n2.element);
        return n2.toggle ? (a2.appendChild(Me.createIcon.call(this, n2.iconPressed, { class: "icon--pressed" })), a2.appendChild(Me.createIcon.call(this, n2.icon, { class: "icon--not-pressed" })), a2.appendChild(Me.createLabel.call(this, n2.labelPressed, { class: "label--pressed" })), a2.appendChild(Me.createLabel.call(this, n2.label, { class: "label--not-pressed" }))) : (a2.appendChild(Me.createIcon.call(this, n2.icon)), a2.appendChild(Me.createLabel.call(this, n2.label))), N(i2, q(this.config.selectors.buttons[s2], i2)), I(a2, i2), "play" === s2 ? (A.array(this.elements.buttons[s2]) || (this.elements.buttons[s2] = []), this.elements.buttons[s2].push(a2)) : this.elements.buttons[s2] = a2, a2;
      },
      createRange(e2, t2) {
        const i2 = O(
          "input",
          N(
            q(this.config.selectors.inputs[e2]),
            { type: "range", min: 0, max: 100, step: 0.01, value: 0, autocomplete: "off", role: "slider", "aria-label": we.get(e2, this.config), "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": 0 },
            t2
          )
        );
        return this.elements.inputs[e2] = i2, Me.updateRangeFill.call(this, i2), f.setup(i2), i2;
      },
      createProgress(e2, t2) {
        const i2 = O("progress", N(q(this.config.selectors.display[e2]), { min: 0, max: 100, value: 0, role: "progressbar", "aria-hidden": true }, t2));
        if ("volume" !== e2) {
          i2.appendChild(O("span", null, "0"));
          const t3 = { played: "played", buffer: "buffered" }[e2], s2 = t3 ? we.get(t3, this.config) : "";
          i2.innerText = `% ${s2.toLowerCase()}`;
        }
        return this.elements.display[e2] = i2, i2;
      },
      createTime(e2, t2) {
        const i2 = q(this.config.selectors.display[e2], t2), s2 = O("div", N(i2, { class: `${i2.class ? i2.class : ""} ${this.config.classNames.display.time} `.trim(), "aria-label": we.get(e2, this.config), role: "timer" }), "00:00");
        return this.elements.display[e2] = s2, s2;
      },
      bindMenuItemShortcuts(e2, t2) {
        J.call(
          this,
          e2,
          "keydown keyup",
          (i2) => {
            if (![" ", "ArrowUp", "ArrowDown", "ArrowRight"].includes(i2.key)) return;
            if (i2.preventDefault(), i2.stopPropagation(), "keydown" === i2.type) return;
            const s2 = V(e2, '[role="menuitemradio"]');
            if (!s2 && [" ", "ArrowRight"].includes(i2.key)) Me.showMenuPanel.call(this, t2, true);
            else {
              let t3;
              " " !== i2.key && ("ArrowDown" === i2.key || s2 && "ArrowRight" === i2.key ? (t3 = e2.nextElementSibling, A.element(t3) || (t3 = e2.parentNode.firstElementChild)) : (t3 = e2.previousElementSibling, A.element(t3) || (t3 = e2.parentNode.lastElementChild)), z.call(this, t3, true));
            }
          },
          false
        ), J.call(this, e2, "keyup", (e3) => {
          "Return" === e3.key && Me.focusFirstMenuItem.call(this, null, true);
        });
      },
      createMenuItem({ value: e2, list: t2, type: i2, title: s2, badge: n2 = null, checked: a2 = false }) {
        const r2 = q(this.config.selectors.inputs[i2]), o2 = O("button", N(r2, { type: "button", role: "menuitemradio", class: `${this.config.classNames.control} ${r2.class ? r2.class : ""}`.trim(), "aria-checked": a2, value: e2 })), l2 = O("span");
        l2.innerHTML = s2, A.element(n2) && l2.appendChild(n2), o2.appendChild(l2), Object.defineProperty(o2, "checked", {
          enumerable: true,
          get: () => "true" === o2.getAttribute("aria-checked"),
          set(e3) {
            e3 && Array.from(o2.parentNode.children).filter((e4) => V(e4, '[role="menuitemradio"]')).forEach((e4) => e4.setAttribute("aria-checked", "false")), o2.setAttribute("aria-checked", e3 ? "true" : "false");
          }
        }), this.listeners.bind(
          o2,
          "click keyup",
          (t3) => {
            if (!A.keyboardEvent(t3) || " " === t3.key) {
              switch (t3.preventDefault(), t3.stopPropagation(), o2.checked = true, i2) {
                case "language":
                  this.currentTrack = Number(e2);
                  break;
                case "quality":
                  this.quality = e2;
                  break;
                case "speed":
                  this.speed = parseFloat(e2);
              }
              Me.showMenuPanel.call(this, "home", A.keyboardEvent(t3));
            }
          },
          i2,
          false
        ), Me.bindMenuItemShortcuts.call(this, o2, i2), t2.appendChild(o2);
      },
      formatTime(e2 = 0, t2 = false) {
        if (!A.number(e2)) return e2;
        return Pe(e2, Ce(this.duration) > 0, t2);
      },
      updateTimeDisplay(e2 = null, t2 = 0, i2 = false) {
        A.element(e2) && A.number(t2) && (e2.innerText = Me.formatTime(t2, i2));
      },
      updateVolume() {
        this.supported.ui && (A.element(this.elements.inputs.volume) && Me.setRange.call(this, this.elements.inputs.volume, this.muted ? 0 : this.volume), A.element(this.elements.buttons.mute) && (this.elements.buttons.mute.pressed = this.muted || 0 === this.volume));
      },
      setRange(e2, t2 = 0) {
        A.element(e2) && (e2.value = t2, Me.updateRangeFill.call(this, e2));
      },
      updateProgress(e2) {
        if (!this.supported.ui || !A.event(e2)) return;
        let t2 = 0;
        const i2 = (e3, t3) => {
          const i3 = A.number(t3) ? t3 : 0, s3 = A.element(e3) ? e3 : this.elements.display.buffer;
          if (A.element(s3)) {
            s3.value = i3;
            const e4 = s3.getElementsByTagName("span")[0];
            A.element(e4) && (e4.childNodes[0].nodeValue = i3);
          }
        };
        if (e2)
          switch (e2.type) {
            case "timeupdate":
            case "seeking":
            case "seeked":
              s2 = this.currentTime, n2 = this.duration, t2 = 0 === s2 || 0 === n2 || Number.isNaN(s2) || Number.isNaN(n2) ? 0 : (s2 / n2 * 100).toFixed(2), "timeupdate" === e2.type && Me.setRange.call(this, this.elements.inputs.seek, t2);
              break;
            case "playing":
            case "progress":
              i2(this.elements.display.buffer, 100 * this.buffered);
          }
        var s2, n2;
      },
      updateRangeFill(e2) {
        const t2 = A.event(e2) ? e2.target : e2;
        if (A.element(t2) && "range" === t2.getAttribute("type")) {
          if (V(t2, this.config.selectors.inputs.seek)) {
            t2.setAttribute("aria-valuenow", this.currentTime);
            const e3 = Me.formatTime(this.currentTime), i2 = Me.formatTime(this.duration), s2 = we.get("seekLabel", this.config);
            t2.setAttribute("aria-valuetext", s2.replace("{currentTime}", e3).replace("{duration}", i2));
          } else if (V(t2, this.config.selectors.inputs.volume)) {
            const e3 = 100 * t2.value;
            t2.setAttribute("aria-valuenow", e3), t2.setAttribute("aria-valuetext", `${e3.toFixed(1)}%`);
          } else t2.setAttribute("aria-valuenow", t2.value);
          (x.isWebKit || x.isIPadOS) && t2.style.setProperty("--value", t2.value / t2.max * 100 + "%");
        }
      },
      updateSeekTooltip(e2) {
        var t2, i2;
        if (!this.config.tooltips.seek || !A.element(this.elements.inputs.seek) || !A.element(this.elements.display.seekTooltip) || 0 === this.duration) return;
        const s2 = this.elements.display.seekTooltip, n2 = `${this.config.classNames.tooltip}--visible`, a2 = (e3) => F(s2, n2, e3);
        if (this.touch) return void a2(false);
        let r2 = 0;
        const o2 = this.elements.progress.getBoundingClientRect();
        if (A.event(e2)) r2 = 100 / o2.width * (e2.pageX - o2.left);
        else {
          if (!U(s2, n2)) return;
          r2 = parseFloat(s2.style.left, 10);
        }
        r2 < 0 ? r2 = 0 : r2 > 100 && (r2 = 100);
        const l2 = this.duration / 100 * r2;
        s2.innerText = Me.formatTime(l2);
        const c2 = null === (t2 = this.config.markers) || void 0 === t2 || null === (i2 = t2.points) || void 0 === i2 ? void 0 : i2.find(({ time: e3 }) => e3 === Math.round(l2));
        c2 && s2.insertAdjacentHTML("afterbegin", `${c2.label}<br>`), s2.style.left = `${r2}%`, A.event(e2) && ["mouseenter", "mouseleave"].includes(e2.type) && a2("mouseenter" === e2.type);
      },
      timeUpdate(e2) {
        const t2 = !A.element(this.elements.display.duration) && this.config.invertTime;
        Me.updateTimeDisplay.call(this, this.elements.display.currentTime, t2 ? this.duration - this.currentTime : this.currentTime, t2), e2 && "timeupdate" === e2.type && this.media.seeking || Me.updateProgress.call(this, e2);
      },
      durationUpdate() {
        if (!this.supported.ui || !this.config.invertTime && this.currentTime) return;
        if (this.duration >= __pow(2, 32)) return H(this.elements.display.currentTime, true), void H(this.elements.progress, true);
        A.element(this.elements.inputs.seek) && this.elements.inputs.seek.setAttribute("aria-valuemax", this.duration);
        const e2 = A.element(this.elements.display.duration);
        !e2 && this.config.displayDuration && this.paused && Me.updateTimeDisplay.call(this, this.elements.display.currentTime, this.duration), e2 && Me.updateTimeDisplay.call(this, this.elements.display.duration, this.duration), this.config.markers.enabled && Me.setMarkers.call(this), Me.updateSeekTooltip.call(this);
      },
      toggleMenuButton(e2, t2) {
        H(this.elements.settings.buttons[e2], !t2);
      },
      updateSetting(e2, t2, i2) {
        const s2 = this.elements.settings.panels[e2];
        let n2 = null, a2 = t2;
        if ("captions" === e2) n2 = this.currentTrack;
        else {
          if (n2 = A.empty(i2) ? this[e2] : i2, A.empty(n2) && (n2 = this.config[e2].default), !A.empty(this.options[e2]) && !this.options[e2].includes(n2)) return void this.debug.warn(`Unsupported value of '${n2}' for ${e2}`);
          if (!this.config[e2].options.includes(n2)) return void this.debug.warn(`Disabled value of '${n2}' for ${e2}`);
        }
        if (A.element(a2) || (a2 = s2 && s2.querySelector('[role="menu"]')), !A.element(a2)) return;
        this.elements.settings.buttons[e2].querySelector(`.${this.config.classNames.menu.value}`).innerHTML = Me.getLabel.call(this, e2, n2);
        const r2 = a2 && a2.querySelector(`[value="${n2}"]`);
        A.element(r2) && (r2.checked = true);
      },
      getLabel(e2, t2) {
        switch (e2) {
          case "speed":
            return 1 === t2 ? we.get("normal", this.config) : `${t2}&times;`;
          case "quality":
            if (A.number(t2)) {
              const e3 = we.get(`qualityLabel.${t2}`, this.config);
              return e3.length ? e3 : `${t2}p`;
            }
            return fe(t2);
          case "captions":
            return Ne.getLabel.call(this);
          default:
            return null;
        }
      },
      setQualityMenu(e2) {
        if (!A.element(this.elements.settings.panels.quality)) return;
        const t2 = "quality", i2 = this.elements.settings.panels.quality.querySelector('[role="menu"]');
        A.array(e2) && (this.options.quality = ne(e2).filter((e3) => this.config.quality.options.includes(e3)));
        const s2 = !A.empty(this.options.quality) && this.options.quality.length > 1;
        if (Me.toggleMenuButton.call(this, t2, s2), R(i2), Me.checkMenu.call(this), !s2) return;
        const n2 = (e3) => {
          const t3 = we.get(`qualityBadge.${e3}`, this.config);
          return t3.length ? Me.createBadge.call(this, t3) : null;
        };
        this.options.quality.sort((e3, t3) => {
          const i3 = this.config.quality.options;
          return i3.indexOf(e3) > i3.indexOf(t3) ? 1 : -1;
        }).forEach((e3) => {
          Me.createMenuItem.call(this, { value: e3, list: i2, type: t2, title: Me.getLabel.call(this, "quality", e3), badge: n2(e3) });
        }), Me.updateSetting.call(this, t2, i2);
      },
      setCaptionsMenu() {
        if (!A.element(this.elements.settings.panels.captions)) return;
        const e2 = "captions", t2 = this.elements.settings.panels.captions.querySelector('[role="menu"]'), i2 = Ne.getTracks.call(this), s2 = Boolean(i2.length);
        if (Me.toggleMenuButton.call(this, e2, s2), R(t2), Me.checkMenu.call(this), !s2) return;
        const n2 = i2.map((e3, i3) => ({
          value: i3,
          checked: this.captions.toggled && this.currentTrack === i3,
          title: Ne.getLabel.call(this, e3),
          badge: e3.language && Me.createBadge.call(this, e3.language.toUpperCase()),
          list: t2,
          type: "language"
        }));
        n2.unshift({ value: -1, checked: !this.captions.toggled, title: we.get("disabled", this.config), list: t2, type: "language" }), n2.forEach(Me.createMenuItem.bind(this)), Me.updateSetting.call(this, e2, t2);
      },
      setSpeedMenu() {
        if (!A.element(this.elements.settings.panels.speed)) return;
        const e2 = "speed", t2 = this.elements.settings.panels.speed.querySelector('[role="menu"]');
        this.options.speed = this.options.speed.filter((e3) => e3 >= this.minimumSpeed && e3 <= this.maximumSpeed);
        const i2 = !A.empty(this.options.speed) && this.options.speed.length > 1;
        Me.toggleMenuButton.call(this, e2, i2), R(t2), Me.checkMenu.call(this), i2 && (this.options.speed.forEach((i3) => {
          Me.createMenuItem.call(this, { value: i3, list: t2, type: e2, title: Me.getLabel.call(this, "speed", i3) });
        }), Me.updateSetting.call(this, e2, t2));
      },
      checkMenu() {
        const { buttons: e2 } = this.elements.settings, t2 = !A.empty(e2) && Object.values(e2).some((e3) => !e3.hidden);
        H(this.elements.settings.menu, !t2);
      },
      focusFirstMenuItem(e2, t2 = false) {
        if (this.elements.settings.popup.hidden) return;
        let i2 = e2;
        A.element(i2) || (i2 = Object.values(this.elements.settings.panels).find((e3) => !e3.hidden));
        const s2 = i2.querySelector('[role^="menuitem"]');
        z.call(this, s2, t2);
      },
      toggleMenu(e2) {
        const { popup: t2 } = this.elements.settings, i2 = this.elements.buttons.settings;
        if (!A.element(t2) || !A.element(i2)) return;
        const { hidden: s2 } = t2;
        let n2 = s2;
        if (A.boolean(e2)) n2 = e2;
        else if (A.keyboardEvent(e2) && "Escape" === e2.key) n2 = false;
        else if (A.event(e2)) {
          const s3 = A.function(e2.composedPath) ? e2.composedPath()[0] : e2.target, a2 = t2.contains(s3);
          if (a2 || !a2 && e2.target !== i2 && n2) return;
        }
        i2.setAttribute("aria-expanded", n2), H(t2, !n2), F(this.elements.container, this.config.classNames.menu.open, n2), n2 && A.keyboardEvent(e2) ? Me.focusFirstMenuItem.call(this, null, true) : n2 || s2 || z.call(this, i2, A.keyboardEvent(e2));
      },
      getMenuSize(e2) {
        const t2 = e2.cloneNode(true);
        t2.style.position = "absolute", t2.style.opacity = 0, t2.removeAttribute("hidden"), e2.parentNode.appendChild(t2);
        const i2 = t2.scrollWidth, s2 = t2.scrollHeight;
        return j(t2), { width: i2, height: s2 };
      },
      showMenuPanel(e2 = "", t2 = false) {
        const i2 = this.elements.container.querySelector(`#plyr-settings-${this.id}-${e2}`);
        if (!A.element(i2)) return;
        const s2 = i2.parentNode, n2 = Array.from(s2.children).find((e3) => !e3.hidden);
        if (Y.transitions && !Y.reducedMotion) {
          s2.style.width = `${n2.scrollWidth}px`, s2.style.height = `${n2.scrollHeight}px`;
          const e3 = Me.getMenuSize.call(this, i2), t3 = (e4) => {
            e4.target === s2 && ["width", "height"].includes(e4.propertyName) && (s2.style.width = "", s2.style.height = "", G.call(this, s2, P, t3));
          };
          J.call(this, s2, P, t3), s2.style.width = `${e3.width}px`, s2.style.height = `${e3.height}px`;
        }
        H(n2, true), H(i2, false), Me.focusFirstMenuItem.call(this, i2, t2);
      },
      setDownloadUrl() {
        const e2 = this.elements.buttons.download;
        A.element(e2) && e2.setAttribute("href", this.download);
      },
      create(e2) {
        const { bindMenuItemShortcuts: t2, createButton: i2, createProgress: s2, createRange: n2, createTime: a2, setQualityMenu: r2, setSpeedMenu: o2, showMenuPanel: l2 } = Me;
        this.elements.controls = null, A.array(this.config.controls) && this.config.controls.includes("play-large") && this.elements.container.appendChild(i2.call(this, "play-large"));
        const c2 = O("div", q(this.config.selectors.controls.wrapper));
        this.elements.controls = c2;
        const u2 = { class: "plyr__controls__item" };
        return ne(A.array(this.config.controls) ? this.config.controls : []).forEach((r3) => {
          if ("restart" === r3 && c2.appendChild(i2.call(this, "restart", u2)), "rewind" === r3 && c2.appendChild(i2.call(this, "rewind", u2)), "play" === r3 && c2.appendChild(i2.call(this, "play", u2)), "fast-forward" === r3 && c2.appendChild(i2.call(this, "fast-forward", u2)), "progress" === r3) {
            const t3 = O("div", { class: `${u2.class} plyr__progress__container` }), i3 = O("div", q(this.config.selectors.progress));
            if (i3.appendChild(n2.call(this, "seek", { id: `plyr-seek-${e2.id}` })), i3.appendChild(s2.call(this, "buffer")), this.config.tooltips.seek) {
              const e3 = O("span", { class: this.config.classNames.tooltip }, "00:00");
              i3.appendChild(e3), this.elements.display.seekTooltip = e3;
            }
            this.elements.progress = i3, t3.appendChild(this.elements.progress), c2.appendChild(t3);
          }
          if ("current-time" === r3 && c2.appendChild(a2.call(this, "currentTime", u2)), "duration" === r3 && c2.appendChild(a2.call(this, "duration", u2)), "mute" === r3 || "volume" === r3) {
            let { volume: t3 } = this.elements;
            if (A.element(t3) && c2.contains(t3) || (t3 = O("div", N({}, u2, { class: `${u2.class} plyr__volume`.trim() })), this.elements.volume = t3, c2.appendChild(t3)), "mute" === r3 && t3.appendChild(i2.call(this, "mute")), "volume" === r3 && !x.isIos && !x.isIPadOS) {
              const i3 = { max: 1, step: 0.05, value: this.config.volume };
              t3.appendChild(n2.call(this, "volume", N(i3, { id: `plyr-volume-${e2.id}` })));
            }
          }
          if ("captions" === r3 && c2.appendChild(i2.call(this, "captions", u2)), "settings" === r3 && !A.empty(this.config.settings)) {
            const s3 = O("div", N({}, u2, { class: `${u2.class} plyr__menu`.trim(), hidden: "" }));
            s3.appendChild(i2.call(this, "settings", { "aria-haspopup": true, "aria-controls": `plyr-settings-${e2.id}`, "aria-expanded": false }));
            const n3 = O("div", { class: "plyr__menu__container", id: `plyr-settings-${e2.id}`, hidden: "" }), a3 = O("div"), r4 = O("div", { id: `plyr-settings-${e2.id}-home` }), o3 = O("div", { role: "menu" });
            r4.appendChild(o3), a3.appendChild(r4), this.elements.settings.panels.home = r4, this.config.settings.forEach((i3) => {
              const s4 = O(
                "button",
                N(q(this.config.selectors.buttons.settings), {
                  type: "button",
                  class: `${this.config.classNames.control} ${this.config.classNames.control}--forward`,
                  role: "menuitem",
                  "aria-haspopup": true,
                  hidden: ""
                })
              );
              t2.call(this, s4, i3), J.call(this, s4, "click", () => {
                l2.call(this, i3, false);
              });
              const n4 = O("span", null, we.get(i3, this.config)), r5 = O("span", { class: this.config.classNames.menu.value });
              r5.innerHTML = e2[i3], n4.appendChild(r5), s4.appendChild(n4), o3.appendChild(s4);
              const c3 = O("div", { id: `plyr-settings-${e2.id}-${i3}`, hidden: "" }), u3 = O("button", { type: "button", class: `${this.config.classNames.control} ${this.config.classNames.control}--back` });
              u3.appendChild(O("span", { "aria-hidden": true }, we.get(i3, this.config))), u3.appendChild(O("span", { class: this.config.classNames.hidden }, we.get("menuBack", this.config))), J.call(
                this,
                c3,
                "keydown",
                (e3) => {
                  "ArrowLeft" === e3.key && (e3.preventDefault(), e3.stopPropagation(), l2.call(this, "home", true));
                },
                false
              ), J.call(this, u3, "click", () => {
                l2.call(this, "home", false);
              }), c3.appendChild(u3), c3.appendChild(O("div", { role: "menu" })), a3.appendChild(c3), this.elements.settings.buttons[i3] = s4, this.elements.settings.panels[i3] = c3;
            }), n3.appendChild(a3), s3.appendChild(n3), c2.appendChild(s3), this.elements.settings.popup = n3, this.elements.settings.menu = s3;
          }
          if ("pip" === r3 && Y.pip && c2.appendChild(i2.call(this, "pip", u2)), "airplay" === r3 && Y.airplay && c2.appendChild(i2.call(this, "airplay", u2)), "download" === r3) {
            const e3 = N({}, u2, { element: "a", href: this.download, target: "_blank" });
            this.isHTML5 && (e3.download = "");
            const { download: t3 } = this.config.urls;
            !A.url(t3) && this.isEmbed && N(e3, { icon: `logo-${this.provider}`, label: this.provider }), c2.appendChild(i2.call(this, "download", e3));
          }
          "fullscreen" === r3 && c2.appendChild(i2.call(this, "fullscreen", u2));
        }), this.isHTML5 && r2.call(this, me.getQualityOptions.call(this)), o2.call(this), c2;
      },
      inject() {
        if (this.config.loadSprite) {
          const e3 = Me.getIconUrl.call(this);
          e3.cors && Ee(e3.url, "sprite-plyr");
        }
        this.id = Math.floor(1e4 * Math.random());
        let e2 = null;
        this.elements.controls = null;
        const t2 = { id: this.id, seektime: this.config.seekTime, title: this.config.title };
        let i2 = true;
        A.function(this.config.controls) && (this.config.controls = this.config.controls.call(this, t2)), this.config.controls || (this.config.controls = []), A.element(this.config.controls) || A.string(this.config.controls) ? e2 = this.config.controls : (e2 = Me.create.call(this, { id: this.id, seektime: this.config.seekTime, speed: this.speed, quality: this.quality, captions: Ne.getLabel.call(this) }), i2 = false);
        let s2;
        i2 && A.string(this.config.controls) && (e2 = ((e3) => {
          let i3 = e3;
          return Object.entries(t2).forEach(([e4, t3]) => {
            i3 = ge(i3, `{${e4}}`, t3);
          }), i3;
        })(e2)), A.string(this.config.selectors.controls.container) && (s2 = document.querySelector(this.config.selectors.controls.container)), A.element(s2) || (s2 = this.elements.container);
        if (s2[A.element(e2) ? "insertAdjacentElement" : "insertAdjacentHTML"]("afterbegin", e2), A.element(this.elements.controls) || Me.findElements.call(this), !A.empty(this.elements.buttons)) {
          const e3 = (e4) => {
            const t3 = this.config.classNames.controlPressed;
            e4.setAttribute("aria-pressed", "false"), Object.defineProperty(e4, "pressed", {
              configurable: true,
              enumerable: true,
              get: () => U(e4, t3),
              set(i3 = false) {
                F(e4, t3, i3), e4.setAttribute("aria-pressed", i3 ? "true" : "false");
              }
            });
          };
          Object.values(this.elements.buttons).filter(Boolean).forEach((t3) => {
            A.array(t3) || A.nodeList(t3) ? Array.from(t3).filter(Boolean).forEach(e3) : e3(t3);
          });
        }
        if (x.isEdge && M(s2), this.config.tooltips.controls) {
          const { classNames: e3, selectors: t3 } = this.config, i3 = `${t3.controls.wrapper} ${t3.labels} .${e3.hidden}`, s3 = B.call(this, i3);
          Array.from(s3).forEach((e4) => {
            F(e4, this.config.classNames.hidden, false), F(e4, this.config.classNames.tooltip, true);
          });
        }
      },
      setMediaMetadata() {
        try {
          "mediaSession" in navigator && (navigator.mediaSession.metadata = new window.MediaMetadata({
            title: this.config.mediaMetadata.title,
            artist: this.config.mediaMetadata.artist,
            album: this.config.mediaMetadata.album,
            artwork: this.config.mediaMetadata.artwork
          }));
        } catch (e2) {
        }
      },
      setMarkers() {
        var e2, t2;
        if (!this.duration || this.elements.markers) return;
        const i2 = null === (e2 = this.config.markers) || void 0 === e2 || null === (t2 = e2.points) || void 0 === t2 ? void 0 : t2.filter(({ time: e3 }) => e3 > 0 && e3 < this.duration);
        if (null == i2 || !i2.length) return;
        const s2 = document.createDocumentFragment(), n2 = document.createDocumentFragment();
        let a2 = null;
        const r2 = `${this.config.classNames.tooltip}--visible`, o2 = (e3) => F(a2, r2, e3);
        i2.forEach((e3) => {
          const t3 = O("span", { class: this.config.classNames.marker }, ""), i3 = e3.time / this.duration * 100 + "%";
          a2 && (t3.addEventListener("mouseenter", () => {
            e3.label || (a2.style.left = i3, a2.innerHTML = e3.label, o2(true));
          }), t3.addEventListener("mouseleave", () => {
            o2(false);
          })), t3.addEventListener("click", () => {
            this.currentTime = e3.time;
          }), t3.style.left = i3, n2.appendChild(t3);
        }), s2.appendChild(n2), this.config.tooltips.seek || (a2 = O("span", { class: this.config.classNames.tooltip }, ""), s2.appendChild(a2)), this.elements.markers = { points: n2, tip: a2 }, this.elements.progress.appendChild(s2);
      }
    };
    function xe(e2, t2 = true) {
      let i2 = e2;
      if (t2) {
        const e3 = document.createElement("a");
        e3.href = i2, i2 = e3.href;
      }
      try {
        return new URL(i2);
      } catch (e3) {
        return null;
      }
    }
    function Le(e2) {
      const t2 = new URLSearchParams();
      return A.object(e2) && Object.entries(e2).forEach(([e3, i2]) => {
        t2.set(e3, i2);
      }), t2;
    }
    const Ne = {
      setup() {
        if (!this.supported.ui) return;
        if (!this.isVideo || this.isYouTube || this.isHTML5 && !Y.textTracks)
          return void (A.array(this.config.controls) && this.config.controls.includes("settings") && this.config.settings.includes("captions") && Me.setCaptionsMenu.call(this));
        var e2, t2;
        if (A.element(this.elements.captions) || (this.elements.captions = O("div", q(this.config.selectors.captions)), this.elements.captions.setAttribute("dir", "auto"), e2 = this.elements.captions, t2 = this.elements.wrapper, A.element(e2) && A.element(t2) && t2.parentNode.insertBefore(e2, t2.nextSibling)), x.isIE && window.URL) {
          const e3 = this.media.querySelectorAll("track");
          Array.from(e3).forEach((e4) => {
            const t3 = e4.getAttribute("src"), i3 = xe(t3);
            null !== i3 && i3.hostname !== window.location.href.hostname && ["http:", "https:"].includes(i3.protocol) && ke(t3, "blob").then((t4) => {
              e4.setAttribute("src", window.URL.createObjectURL(t4));
            }).catch(() => {
              j(e4);
            });
          });
        }
        const i2 = ne((navigator.languages || [navigator.language || navigator.userLanguage || "en"]).map((e3) => e3.split("-")[0]));
        let s2 = (this.storage.get("language") || this.config.captions.language || "auto").toLowerCase();
        "auto" === s2 && ([s2] = i2);
        let n2 = this.storage.get("captions");
        if (A.boolean(n2) || ({ active: n2 } = this.config.captions), Object.assign(this.captions, { toggled: false, active: n2, language: s2, languages: i2 }), this.isHTML5) {
          const e3 = this.config.captions.update ? "addtrack removetrack" : "removetrack";
          J.call(this, this.media.textTracks, e3, Ne.update.bind(this));
        }
        setTimeout(Ne.update.bind(this), 0);
      },
      update() {
        const e2 = Ne.getTracks.call(this, true), { active: t2, language: i2, meta: s2, currentTrackNode: n2 } = this.captions, a2 = Boolean(e2.find((e3) => e3.language === i2));
        this.isHTML5 && this.isVideo && e2.filter((e3) => !s2.get(e3)).forEach((e3) => {
          this.debug.log("Track added", e3), s2.set(e3, { default: "showing" === e3.mode }), "showing" === e3.mode && (e3.mode = "hidden"), J.call(this, e3, "cuechange", () => Ne.updateCues.call(this));
        }), (a2 && this.language !== i2 || !e2.includes(n2)) && (Ne.setLanguage.call(this, i2), Ne.toggle.call(this, t2 && a2)), this.elements && F(this.elements.container, this.config.classNames.captions.enabled, !A.empty(e2)), A.array(this.config.controls) && this.config.controls.includes("settings") && this.config.settings.includes("captions") && Me.setCaptionsMenu.call(this);
      },
      toggle(e2, t2 = true) {
        if (!this.supported.ui) return;
        const { toggled: i2 } = this.captions, s2 = this.config.classNames.captions.active, n2 = A.nullOrUndefined(e2) ? !i2 : e2;
        if (n2 !== i2) {
          if (t2 || (this.captions.active = n2, this.storage.set({ captions: n2 })), !this.language && n2 && !t2) {
            const e3 = Ne.getTracks.call(this), t3 = Ne.findTrack.call(this, [this.captions.language, ...this.captions.languages], true);
            return this.captions.language = t3.language, void Ne.set.call(this, e3.indexOf(t3));
          }
          this.elements.buttons.captions && (this.elements.buttons.captions.pressed = n2), F(this.elements.container, s2, n2), this.captions.toggled = n2, Me.updateSetting.call(this, "captions"), ee.call(this, this.media, n2 ? "captionsenabled" : "captionsdisabled");
        }
        setTimeout(() => {
          n2 && this.captions.toggled && (this.captions.currentTrackNode.mode = "hidden");
        });
      },
      set(e2, t2 = true) {
        const i2 = Ne.getTracks.call(this);
        if (-1 !== e2)
          if (A.number(e2))
            if (e2 in i2) {
              if (this.captions.currentTrack !== e2) {
                this.captions.currentTrack = e2;
                const s2 = i2[e2], { language: n2 } = s2 || {};
                this.captions.currentTrackNode = s2, Me.updateSetting.call(this, "captions"), t2 || (this.captions.language = n2, this.storage.set({ language: n2 })), this.isVimeo && this.embed.enableTextTrack(n2), ee.call(this, this.media, "languagechange");
              }
              Ne.toggle.call(this, true, t2), this.isHTML5 && this.isVideo && Ne.updateCues.call(this);
            } else this.debug.warn("Track not found", e2);
          else this.debug.warn("Invalid caption argument", e2);
        else Ne.toggle.call(this, false, t2);
      },
      setLanguage(e2, t2 = true) {
        if (!A.string(e2)) return void this.debug.warn("Invalid language argument", e2);
        const i2 = e2.toLowerCase();
        this.captions.language = i2;
        const s2 = Ne.getTracks.call(this), n2 = Ne.findTrack.call(this, [i2]);
        Ne.set.call(this, s2.indexOf(n2), t2);
      },
      getTracks(e2 = false) {
        return Array.from((this.media || {}).textTracks || []).filter((t2) => !this.isHTML5 || e2 || this.captions.meta.has(t2)).filter((e3) => ["captions", "subtitles"].includes(e3.kind));
      },
      findTrack(e2, t2 = false) {
        const i2 = Ne.getTracks.call(this), s2 = (e3) => Number((this.captions.meta.get(e3) || {}).default), n2 = Array.from(i2).sort((e3, t3) => s2(t3) - s2(e3));
        let a2;
        return e2.every((e3) => (a2 = n2.find((t3) => t3.language === e3), !a2)), a2 || (t2 ? n2[0] : void 0);
      },
      getCurrentTrack() {
        return Ne.getTracks.call(this)[this.currentTrack];
      },
      getLabel(e2) {
        let t2 = e2;
        return !A.track(t2) && Y.textTracks && this.captions.toggled && (t2 = Ne.getCurrentTrack.call(this)), A.track(t2) ? A.empty(t2.label) ? A.empty(t2.language) ? we.get("enabled", this.config) : e2.language.toUpperCase() : t2.label : we.get("disabled", this.config);
      },
      updateCues(e2) {
        if (!this.supported.ui) return;
        if (!A.element(this.elements.captions)) return void this.debug.warn("No captions element to render to");
        if (!A.nullOrUndefined(e2) && !Array.isArray(e2)) return void this.debug.warn("updateCues: Invalid input", e2);
        let t2 = e2;
        if (!t2) {
          const e3 = Ne.getCurrentTrack.call(this);
          t2 = Array.from((e3 || {}).activeCues || []).map((e4) => e4.getCueAsHTML()).map(be);
        }
        const i2 = t2.map((e3) => e3.trim()).join("\n");
        if (i2 !== this.elements.captions.innerHTML) {
          R(this.elements.captions);
          const e3 = O("span", q(this.config.selectors.caption));
          e3.innerHTML = i2, this.elements.captions.appendChild(e3), ee.call(this, this.media, "cuechange");
        }
      }
    }, _e = {
      enabled: true,
      title: "",
      debug: false,
      autoplay: false,
      autopause: true,
      playsinline: true,
      seekTime: 10,
      volume: 1,
      muted: false,
      duration: null,
      displayDuration: true,
      invertTime: true,
      toggleInvert: true,
      ratio: null,
      clickToPlay: true,
      hideControls: true,
      resetOnEnd: false,
      disableContextMenu: true,
      loadSprite: true,
      iconPrefix: "plyr",
      iconUrl: "https://cdn.plyr.io/3.7.8/plyr.svg",
      blankVideo: "https://cdn.plyr.io/static/blank.mp4",
      quality: { default: 576, options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240], forced: false, onChange: null },
      loop: { active: false },
      speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 4] },
      keyboard: { focused: true, global: false },
      tooltips: { controls: false, seek: true },
      captions: { active: false, language: "auto", update: false },
      fullscreen: { enabled: true, fallback: true, iosNative: false },
      storage: { enabled: true, key: "plyr" },
      controls: ["play-large", "play", "progress", "current-time", "mute", "volume", "captions", "settings", "pip", "airplay", "fullscreen"],
      settings: ["captions", "quality", "speed"],
      i18n: {
        restart: "Restart",
        rewind: "Rewind {seektime}s",
        play: "Play",
        pause: "Pause",
        fastForward: "Forward {seektime}s",
        seek: "Seek",
        seekLabel: "{currentTime} of {duration}",
        played: "Played",
        buffered: "Buffered",
        currentTime: "Current time",
        duration: "Duration",
        volume: "Volume",
        mute: "Mute",
        unmute: "Unmute",
        enableCaptions: "Enable captions",
        disableCaptions: "Disable captions",
        download: "Download",
        enterFullscreen: "Fullscreen",
        exitFullscreen: "Exit fullscreen",
        frameTitle: "Player for {title}",
        captions: "Captions",
        settings: "Settings",
        pip: "Pop-up",
        menuBack: "Go back to previous menu",
        speed: "Speed",
        normal: "Normal",
        quality: "Quality",
        loop: "Loop",
        start: "Start",
        end: "End",
        all: "All",
        reset: "Reset",
        disabled: "Disabled",
        enabled: "Enabled",
        advertisement: "Ad",
        qualityBadge: { 2160: "4K", 1440: "HD", 1080: "HD", 720: "HD", 576: "SD", 480: "SD" }
      },
      urls: {
        download: null,
        vimeo: { sdk: "https://player.vimeo.com/api/player.js", iframe: "https://player.vimeo.com/video/{0}?{1}", api: "https://vimeo.com/api/oembed.json?url={0}" },
        youtube: { sdk: "https://www.youtube.com/iframe_api", api: "https://noembed.com/embed?url=https://www.youtube.com/watch?v={0}" },
        googleIMA: { sdk: "https://imasdk.googleapis.com/js/sdkloader/ima3.js" }
      },
      listeners: {
        seek: null,
        play: null,
        pause: null,
        restart: null,
        rewind: null,
        fastForward: null,
        mute: null,
        volume: null,
        captions: null,
        download: null,
        fullscreen: null,
        pip: null,
        airplay: null,
        speed: null,
        quality: null,
        loop: null,
        language: null
      },
      events: [
        "ended",
        "progress",
        "stalled",
        "playing",
        "waiting",
        "canplay",
        "canplaythrough",
        "loadstart",
        "loadeddata",
        "loadedmetadata",
        "timeupdate",
        "volumechange",
        "play",
        "pause",
        "error",
        "seeking",
        "seeked",
        "emptied",
        "ratechange",
        "cuechange",
        "download",
        "enterfullscreen",
        "exitfullscreen",
        "captionsenabled",
        "captionsdisabled",
        "languagechange",
        "controlshidden",
        "controlsshown",
        "ready",
        "statechange",
        "qualitychange",
        "adsloaded",
        "adscontentpause",
        "adscontentresume",
        "adstarted",
        "adsmidpoint",
        "adscomplete",
        "adsallcomplete",
        "adsimpression",
        "adsclick"
      ],
      selectors: {
        editable: "input, textarea, select, [contenteditable]",
        container: ".plyr",
        controls: { container: null, wrapper: ".plyr__controls" },
        labels: "[data-plyr]",
        buttons: {
          play: '[data-plyr="play"]',
          pause: '[data-plyr="pause"]',
          restart: '[data-plyr="restart"]',
          rewind: '[data-plyr="rewind"]',
          fastForward: '[data-plyr="fast-forward"]',
          mute: '[data-plyr="mute"]',
          captions: '[data-plyr="captions"]',
          download: '[data-plyr="download"]',
          fullscreen: '[data-plyr="fullscreen"]',
          pip: '[data-plyr="pip"]',
          airplay: '[data-plyr="airplay"]',
          settings: '[data-plyr="settings"]',
          loop: '[data-plyr="loop"]'
        },
        inputs: { seek: '[data-plyr="seek"]', volume: '[data-plyr="volume"]', speed: '[data-plyr="speed"]', language: '[data-plyr="language"]', quality: '[data-plyr="quality"]' },
        display: { currentTime: ".plyr__time--current", duration: ".plyr__time--duration", buffer: ".plyr__progress__buffer", loop: ".plyr__progress__loop", volume: ".plyr__volume--display" },
        progress: ".plyr__progress",
        captions: ".plyr__captions",
        caption: ".plyr__caption"
      },
      classNames: {
        type: "plyr--{0}",
        provider: "plyr--{0}",
        video: "plyr__video-wrapper",
        embed: "plyr__video-embed",
        videoFixedRatio: "plyr__video-wrapper--fixed-ratio",
        embedContainer: "plyr__video-embed__container",
        poster: "plyr__poster",
        posterEnabled: "plyr__poster-enabled",
        ads: "plyr__ads",
        control: "plyr__control",
        controlPressed: "plyr__control--pressed",
        playing: "plyr--playing",
        paused: "plyr--paused",
        stopped: "plyr--stopped",
        loading: "plyr--loading",
        hover: "plyr--hover",
        tooltip: "plyr__tooltip",
        cues: "plyr__cues",
        marker: "plyr__progress__marker",
        hidden: "plyr__sr-only",
        hideControls: "plyr--hide-controls",
        isTouch: "plyr--is-touch",
        uiSupported: "plyr--full-ui",
        noTransition: "plyr--no-transition",
        display: { time: "plyr__time" },
        menu: { value: "plyr__menu__value", badge: "plyr__badge", open: "plyr--menu-open" },
        captions: { enabled: "plyr--captions-enabled", active: "plyr--captions-active" },
        fullscreen: { enabled: "plyr--fullscreen-enabled", fallback: "plyr--fullscreen-fallback" },
        pip: { supported: "plyr--pip-supported", active: "plyr--pip-active" },
        airplay: { supported: "plyr--airplay-supported", active: "plyr--airplay-active" },
        posterThumbnails: {
          thumbContainer: "plyr__preview-thumb",
          thumbContainerShown: "plyr__preview-thumb--is-shown",
          imageContainer: "plyr__preview-thumb__image-container",
          timeContainer: "plyr__preview-thumb__time-container",
          scrubbingContainer: "plyr__preview-scrubbing",
          scrubbingContainerShown: "plyr__preview-scrubbing--is-shown"
        }
      },
      attributes: { embed: { provider: "data-plyr-provider", id: "data-plyr-embed-id", hash: "data-plyr-embed-hash" } },
      ads: { enabled: false, publisherId: "", tagUrl: "" },
      posterThumbnails: { enabled: false, src: "" },
      vimeo: { byline: false, portrait: false, title: false, speed: true, transparent: false, customControls: true, referrerPolicy: null, premium: false },
      youtube: { rel: 0, showinfo: 0, iv_load_policy: 3, modestbranding: 1, customControls: true, noCookie: false },
      mediaMetadata: { title: "", artist: "", album: "", artwork: [] },
      markers: { enabled: false, points: [] }
    }, Ie = "picture-in-picture", Oe = "inline", $e = { html5: "html5", youtube: "youtube", vimeo: "vimeo" }, je = "audio", Re = "video";
    const De = () => {
    };
    class qe {
      constructor(e2 = false) {
        this.enabled = window.console && e2, this.enabled && this.log("Debugging enabled");
      }
      get log() {
        return this.enabled ? Function.prototype.bind.call(console.log, console) : De;
      }
      get warn() {
        return this.enabled ? Function.prototype.bind.call(console.warn, console) : De;
      }
      get error() {
        return this.enabled ? Function.prototype.bind.call(console.error, console) : De;
      }
    }
    class He {
      constructor(e2) {
        t(this, "onChange", () => {
          if (!this.supported) return;
          const e3 = this.player.elements.buttons.fullscreen;
          A.element(e3) && (e3.pressed = this.active);
          const t2 = this.target === this.player.media ? this.target : this.player.elements.container;
          ee.call(this.player, t2, this.active ? "enterfullscreen" : "exitfullscreen", true);
        }), t(this, "toggleFallback", (e3 = false) => {
          var _a, _b;
          if (e3 ? this.scrollPosition = { x: (_a = window.scrollX) != null ? _a : 0, y: (_b = window.scrollY) != null ? _b : 0 } : window.scrollTo(this.scrollPosition.x, this.scrollPosition.y), document.body.style.overflow = e3 ? "hidden" : "", F(this.target, this.player.config.classNames.fullscreen.fallback, e3), x.isIos) {
            let t2 = document.head.querySelector('meta[name="viewport"]');
            const i2 = "viewport-fit=cover";
            t2 || (t2 = document.createElement("meta"), t2.setAttribute("name", "viewport"));
            const s2 = A.string(t2.content) && t2.content.includes(i2);
            e3 ? (this.cleanupViewport = !s2, s2 || (t2.content += `,${i2}`)) : this.cleanupViewport && (t2.content = t2.content.split(",").filter((e4) => e4.trim() !== i2).join(","));
          }
          this.onChange();
        }), t(this, "trapFocus", (e3) => {
          if (x.isIos || x.isIPadOS || !this.active || "Tab" !== e3.key) return;
          const t2 = document.activeElement, i2 = B.call(this.player, "a[href], button:not(:disabled), input:not(:disabled), [tabindex]"), [s2] = i2, n2 = i2[i2.length - 1];
          t2 !== n2 || e3.shiftKey ? t2 === s2 && e3.shiftKey && (n2.focus(), e3.preventDefault()) : (s2.focus(), e3.preventDefault());
        }), t(this, "update", () => {
          if (this.supported) {
            let e3;
            e3 = this.forceFallback ? "Fallback (forced)" : He.nativeSupported ? "Native" : "Fallback", this.player.debug.log(`${e3} fullscreen enabled`);
          } else this.player.debug.log("Fullscreen not supported and fallback disabled");
          F(this.player.elements.container, this.player.config.classNames.fullscreen.enabled, this.supported);
        }), t(this, "enter", () => {
          this.supported && (x.isIos && this.player.config.fullscreen.iosNative ? this.player.isVimeo ? this.player.embed.requestFullscreen() : this.target.webkitEnterFullscreen() : !He.nativeSupported || this.forceFallback ? this.toggleFallback(true) : this.prefix ? A.empty(this.prefix) || this.target[`${this.prefix}Request${this.property}`]() : this.target.requestFullscreen({ navigationUI: "hide" }));
        }), t(this, "exit", () => {
          if (this.supported)
            if (x.isIos && this.player.config.fullscreen.iosNative) this.player.isVimeo ? this.player.embed.exitFullscreen() : this.target.webkitEnterFullscreen(), se(this.player.play());
            else if (!He.nativeSupported || this.forceFallback) this.toggleFallback(false);
            else if (this.prefix) {
              if (!A.empty(this.prefix)) {
                const e3 = "moz" === this.prefix ? "Cancel" : "Exit";
                document[`${this.prefix}${e3}${this.property}`]();
              }
            } else (document.cancelFullScreen || document.exitFullscreen).call(document);
        }), t(this, "toggle", () => {
          this.active ? this.exit() : this.enter();
        }), this.player = e2, this.prefix = He.prefix, this.property = He.property, this.scrollPosition = { x: 0, y: 0 }, this.forceFallback = "force" === e2.config.fullscreen.fallback, this.player.elements.fullscreen = e2.config.fullscreen.container && function(e3, t2) {
          const { prototype: i2 } = Element;
          return (i2.closest || function() {
            let e4 = this;
            do {
              if (V.matches(e4, t2)) return e4;
              e4 = e4.parentElement || e4.parentNode;
            } while (null !== e4 && 1 === e4.nodeType);
            return null;
          }).call(e3, t2);
        }(this.player.elements.container, e2.config.fullscreen.container), J.call(this.player, document, "ms" === this.prefix ? "MSFullscreenChange" : `${this.prefix}fullscreenchange`, () => {
          this.onChange();
        }), J.call(this.player, this.player.elements.container, "dblclick", (e3) => {
          A.element(this.player.elements.controls) && this.player.elements.controls.contains(e3.target) || this.player.listeners.proxy(e3, this.toggle, "fullscreen");
        }), J.call(this, this.player.elements.container, "keydown", (e3) => this.trapFocus(e3)), this.update();
      }
      static get nativeSupported() {
        return !!(document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled);
      }
      get useNative() {
        return He.nativeSupported && !this.forceFallback;
      }
      static get prefix() {
        if (A.function(document.exitFullscreen)) return "";
        let e2 = "";
        return ["webkit", "moz", "ms"].some((t2) => !(!A.function(document[`${t2}ExitFullscreen`]) && !A.function(document[`${t2}CancelFullScreen`])) && (e2 = t2, true)), e2;
      }
      static get property() {
        return "moz" === this.prefix ? "FullScreen" : "Fullscreen";
      }
      get supported() {
        return [
          this.player.config.fullscreen.enabled,
          this.player.isVideo,
          He.nativeSupported || this.player.config.fullscreen.fallback,
          !this.player.isYouTube || He.nativeSupported || !x.isIos || this.player.config.playsinline && !this.player.config.fullscreen.iosNative
        ].every(Boolean);
      }
      get active() {
        if (!this.supported) return false;
        if (!He.nativeSupported || this.forceFallback) return U(this.target, this.player.config.classNames.fullscreen.fallback);
        const e2 = this.prefix ? this.target.getRootNode()[`${this.prefix}${this.property}Element`] : this.target.getRootNode().fullscreenElement;
        return e2 && e2.shadowRoot ? e2 === this.target.getRootNode().host : e2 === this.target;
      }
      get target() {
        var _a;
        return x.isIos && this.player.config.fullscreen.iosNative ? this.player.media : (_a = this.player.elements.fullscreen) != null ? _a : this.player.elements.container;
      }
    }
    function Fe(e2, t2 = 1) {
      return new Promise((i2, s2) => {
        const n2 = new Image(), a2 = () => {
          delete n2.onload, delete n2.onerror, (n2.naturalWidth >= t2 ? i2 : s2)(n2);
        };
        Object.assign(n2, { onload: a2, onerror: a2, src: e2 });
      });
    }
    const Ue = {
      addStyleHook() {
        F(this.elements.container, this.config.selectors.container.replace(".", ""), true), F(this.elements.container, this.config.classNames.uiSupported, this.supported.ui);
      },
      toggleNativeControls(e2 = false) {
        e2 && this.isHTML5 ? this.media.setAttribute("controls", "") : this.media.removeAttribute("controls");
      },
      build() {
        if (this.listeners.media(), !this.supported.ui) return this.debug.warn(`Basic support only for ${this.provider} ${this.type}`), void Ue.toggleNativeControls.call(this, true);
        A.element(this.elements.controls) || (Me.inject.call(this), this.listeners.controls()), Ue.toggleNativeControls.call(this), this.isHTML5 && Ne.setup.call(this), this.volume = null, this.muted = null, this.loop = null, this.quality = null, this.speed = null, Me.updateVolume.call(this), Me.timeUpdate.call(this), Me.durationUpdate.call(this), Ue.checkPlaying.call(this), F(this.elements.container, this.config.classNames.pip.supported, Y.pip && this.isHTML5 && this.isVideo), F(this.elements.container, this.config.classNames.airplay.supported, Y.airplay && this.isHTML5), F(this.elements.container, this.config.classNames.isTouch, this.touch), this.ready = true, setTimeout(() => {
          ee.call(this, this.media, "ready");
        }, 0), Ue.setTitle.call(this), this.poster && Ue.setPoster.call(this, this.poster, false).catch(() => {
        }), this.config.duration && Me.durationUpdate.call(this), this.config.mediaMetadata && Me.setMediaMetadata.call(this);
      },
      setTitle() {
        let e2 = we.get("play", this.config);
        if (A.string(this.config.title) && !A.empty(this.config.title) && (e2 += `, ${this.config.title}`), Array.from(this.elements.buttons.play || []).forEach((t2) => {
          t2.setAttribute("aria-label", e2);
        }), this.isEmbed) {
          const e3 = W.call(this, "iframe");
          if (!A.element(e3)) return;
          const t2 = A.empty(this.config.title) ? "video" : this.config.title, i2 = we.get("frameTitle", this.config);
          e3.setAttribute("title", i2.replace("{title}", t2));
        }
      },
      togglePoster(e2) {
        F(this.elements.container, this.config.classNames.posterEnabled, e2);
      },
      setPoster(e2, t2 = true) {
        return t2 && this.poster ? Promise.reject(new Error("Poster already set")) : (this.media.setAttribute("data-poster", e2), this.elements.poster.removeAttribute("hidden"), ie.call(this).then(() => Fe(e2)).catch((t3) => {
          throw e2 === this.poster && Ue.togglePoster.call(this, false), t3;
        }).then(() => {
          if (e2 !== this.poster) throw new Error("setPoster cancelled by later call to setPoster");
        }).then(() => (Object.assign(this.elements.poster.style, { backgroundImage: `url('${e2}')`, backgroundSize: "" }), Ue.togglePoster.call(this, true), e2)));
      },
      checkPlaying(e2) {
        F(this.elements.container, this.config.classNames.playing, this.playing), F(this.elements.container, this.config.classNames.paused, this.paused), F(this.elements.container, this.config.classNames.stopped, this.stopped), Array.from(this.elements.buttons.play || []).forEach((e3) => {
          Object.assign(e3, { pressed: this.playing }), e3.setAttribute("aria-label", we.get(this.playing ? "pause" : "play", this.config));
        }), A.event(e2) && "timeupdate" === e2.type || Ue.toggleControls.call(this);
      },
      checkLoading(e2) {
        this.loading = ["stalled", "waiting"].includes(e2.type), clearTimeout(this.timers.loading), this.timers.loading = setTimeout(
          () => {
            F(this.elements.container, this.config.classNames.loading, this.loading), Ue.toggleControls.call(this);
          },
          this.loading ? 250 : 0
        );
      },
      toggleControls(e2) {
        const { controls: t2 } = this.elements;
        if (t2 && this.config.hideControls) {
          const i2 = this.touch && this.lastSeekTime + 2e3 > Date.now();
          this.toggleControls(Boolean(e2 || this.loading || this.paused || t2.pressed || t2.hover || i2));
        }
      },
      migrateStyles() {
        Object.values(__spreadValues({}, this.media.style)).filter((e2) => !A.empty(e2) && A.string(e2) && e2.startsWith("--plyr")).forEach((e2) => {
          this.elements.container.style.setProperty(e2, this.media.style.getPropertyValue(e2)), this.media.style.removeProperty(e2);
        }), A.empty(this.media.style) && this.media.removeAttribute("style");
      }
    };
    class Ve {
      constructor(e2) {
        t(this, "firstTouch", () => {
          const { player: e3 } = this, { elements: t2 } = e3;
          e3.touch = true, F(t2.container, e3.config.classNames.isTouch, true);
        }), t(this, "global", (e3 = true) => {
          const { player: t2 } = this;
          t2.config.keyboard.global && X.call(t2, window, "keydown keyup", this.handleKey, e3, false), X.call(t2, document.body, "click", this.toggleMenu, e3), Z.call(t2, document.body, "touchstart", this.firstTouch);
        }), t(this, "container", () => {
          const { player: e3 } = this, { config: t2, elements: i2, timers: s2 } = e3;
          !t2.keyboard.global && t2.keyboard.focused && J.call(e3, i2.container, "keydown keyup", this.handleKey, false), J.call(e3, i2.container, "mousemove mouseleave touchstart touchmove enterfullscreen exitfullscreen", (t3) => {
            const { controls: n3 } = i2;
            n3 && "enterfullscreen" === t3.type && (n3.pressed = false, n3.hover = false);
            let a3 = 0;
            ["touchstart", "touchmove", "mousemove"].includes(t3.type) && (Ue.toggleControls.call(e3, true), a3 = e3.touch ? 3e3 : 2e3), clearTimeout(s2.controls), s2.controls = setTimeout(() => Ue.toggleControls.call(e3, false), a3);
          });
          const n2 = () => {
            if (!e3.isVimeo || e3.config.vimeo.premium) return;
            const t3 = i2.wrapper, { active: s3 } = e3.fullscreen, [n3, a3] = ue.call(e3), r2 = re(`aspect-ratio: ${n3} / ${a3}`);
            if (!s3) return void (r2 ? (t3.style.width = null, t3.style.height = null) : (t3.style.maxWidth = null, t3.style.margin = null));
            const [o2, l2] = [Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0), Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)], c2 = o2 / l2 > n3 / a3;
            r2 ? (t3.style.width = c2 ? "auto" : "100%", t3.style.height = c2 ? "100%" : "auto") : (t3.style.maxWidth = c2 ? l2 / a3 * n3 + "px" : null, t3.style.margin = c2 ? "0 auto" : null);
          }, a2 = () => {
            clearTimeout(s2.resized), s2.resized = setTimeout(n2, 50);
          };
          J.call(e3, i2.container, "enterfullscreen exitfullscreen", (t3) => {
            const { target: s3 } = e3.fullscreen;
            if (s3 !== i2.container) return;
            if (!e3.isEmbed && A.empty(e3.config.ratio)) return;
            n2();
            ("enterfullscreen" === t3.type ? J : G).call(e3, window, "resize", a2);
          });
        }), t(this, "media", () => {
          const { player: e3 } = this, { elements: t2 } = e3;
          if (J.call(e3, e3.media, "timeupdate seeking seeked", (t3) => Me.timeUpdate.call(e3, t3)), J.call(e3, e3.media, "durationchange loadeddata loadedmetadata", (t3) => Me.durationUpdate.call(e3, t3)), J.call(e3, e3.media, "ended", () => {
            e3.isHTML5 && e3.isVideo && e3.config.resetOnEnd && (e3.restart(), e3.pause());
          }), J.call(e3, e3.media, "progress playing seeking seeked", (t3) => Me.updateProgress.call(e3, t3)), J.call(e3, e3.media, "volumechange", (t3) => Me.updateVolume.call(e3, t3)), J.call(e3, e3.media, "playing play pause ended emptied timeupdate", (t3) => Ue.checkPlaying.call(e3, t3)), J.call(e3, e3.media, "waiting canplay seeked playing", (t3) => Ue.checkLoading.call(e3, t3)), e3.supported.ui && e3.config.clickToPlay && !e3.isAudio) {
            const i3 = W.call(e3, `.${e3.config.classNames.video}`);
            if (!A.element(i3)) return;
            J.call(e3, t2.container, "click", (s2) => {
              ([t2.container, i3].includes(s2.target) || i3.contains(s2.target)) && (e3.touch && e3.config.hideControls || (e3.ended ? (this.proxy(s2, e3.restart, "restart"), this.proxy(
                s2,
                () => {
                  se(e3.play());
                },
                "play"
              )) : this.proxy(
                s2,
                () => {
                  se(e3.togglePlay());
                },
                "play"
              )));
            });
          }
          e3.supported.ui && e3.config.disableContextMenu && J.call(
            e3,
            t2.wrapper,
            "contextmenu",
            (e4) => {
              e4.preventDefault();
            },
            false
          ), J.call(e3, e3.media, "volumechange", () => {
            e3.storage.set({ volume: e3.volume, muted: e3.muted });
          }), J.call(e3, e3.media, "ratechange", () => {
            Me.updateSetting.call(e3, "speed"), e3.storage.set({ speed: e3.speed });
          }), J.call(e3, e3.media, "qualitychange", (t3) => {
            Me.updateSetting.call(e3, "quality", null, t3.detail.quality);
          }), J.call(e3, e3.media, "ready qualitychange", () => {
            Me.setDownloadUrl.call(e3);
          });
          const i2 = e3.config.events.concat(["keyup", "keydown"]).join(" ");
          J.call(e3, e3.media, i2, (i3) => {
            let { detail: s2 = {} } = i3;
            "error" === i3.type && (s2 = e3.media.error), ee.call(e3, t2.container, i3.type, true, s2);
          });
        }), t(this, "proxy", (e3, t2, i2) => {
          const { player: s2 } = this, n2 = s2.config.listeners[i2];
          let a2 = true;
          A.function(n2) && (a2 = n2.call(s2, e3)), false !== a2 && A.function(t2) && t2.call(s2, e3);
        }), t(this, "bind", (e3, t2, i2, s2, n2 = true) => {
          const { player: a2 } = this, r2 = a2.config.listeners[s2], o2 = A.function(r2);
          J.call(a2, e3, t2, (e4) => this.proxy(e4, i2, s2), n2 && !o2);
        }), t(this, "controls", () => {
          const { player: e3 } = this, { elements: t2 } = e3, i2 = x.isIE ? "change" : "input";
          if (t2.buttons.play && Array.from(t2.buttons.play).forEach((t3) => {
            this.bind(
              t3,
              "click",
              () => {
                se(e3.togglePlay());
              },
              "play"
            );
          }), this.bind(t2.buttons.restart, "click", e3.restart, "restart"), this.bind(
            t2.buttons.rewind,
            "click",
            () => {
              e3.lastSeekTime = Date.now(), e3.rewind();
            },
            "rewind"
          ), this.bind(
            t2.buttons.fastForward,
            "click",
            () => {
              e3.lastSeekTime = Date.now(), e3.forward();
            },
            "fastForward"
          ), this.bind(
            t2.buttons.mute,
            "click",
            () => {
              e3.muted = !e3.muted;
            },
            "mute"
          ), this.bind(t2.buttons.captions, "click", () => e3.toggleCaptions()), this.bind(
            t2.buttons.download,
            "click",
            () => {
              ee.call(e3, e3.media, "download");
            },
            "download"
          ), this.bind(
            t2.buttons.fullscreen,
            "click",
            () => {
              e3.fullscreen.toggle();
            },
            "fullscreen"
          ), this.bind(
            t2.buttons.pip,
            "click",
            () => {
              e3.pip = "toggle";
            },
            "pip"
          ), this.bind(t2.buttons.airplay, "click", e3.airplay, "airplay"), this.bind(
            t2.buttons.settings,
            "click",
            (t3) => {
              t3.stopPropagation(), t3.preventDefault(), Me.toggleMenu.call(e3, t3);
            },
            null,
            false
          ), this.bind(
            t2.buttons.settings,
            "keyup",
            (t3) => {
              [" ", "Enter"].includes(t3.key) && ("Enter" !== t3.key ? (t3.preventDefault(), t3.stopPropagation(), Me.toggleMenu.call(e3, t3)) : Me.focusFirstMenuItem.call(e3, null, true));
            },
            null,
            false
          ), this.bind(t2.settings.menu, "keydown", (t3) => {
            "Escape" === t3.key && Me.toggleMenu.call(e3, t3);
          }), this.bind(t2.inputs.seek, "mousedown mousemove", (e4) => {
            const i3 = t2.progress.getBoundingClientRect(), s2 = 100 / i3.width * (e4.pageX - i3.left);
            e4.currentTarget.setAttribute("seek-value", s2);
          }), this.bind(t2.inputs.seek, "mousedown mouseup keydown keyup touchstart touchend", (t3) => {
            const i3 = t3.currentTarget, s2 = "play-on-seeked";
            if (A.keyboardEvent(t3) && !["ArrowLeft", "ArrowRight"].includes(t3.key)) return;
            e3.lastSeekTime = Date.now();
            const n2 = i3.hasAttribute(s2), a2 = ["mouseup", "touchend", "keyup"].includes(t3.type);
            n2 && a2 ? (i3.removeAttribute(s2), se(e3.play())) : !a2 && e3.playing && (i3.setAttribute(s2, ""), e3.pause());
          }), x.isIos) {
            const t3 = B.call(e3, 'input[type="range"]');
            Array.from(t3).forEach((e4) => this.bind(e4, i2, (e5) => M(e5.target)));
          }
          this.bind(
            t2.inputs.seek,
            i2,
            (t3) => {
              const i3 = t3.currentTarget;
              let s2 = i3.getAttribute("seek-value");
              A.empty(s2) && (s2 = i3.value), i3.removeAttribute("seek-value"), e3.currentTime = s2 / i3.max * e3.duration;
            },
            "seek"
          ), this.bind(t2.progress, "mouseenter mouseleave mousemove", (t3) => Me.updateSeekTooltip.call(e3, t3)), this.bind(t2.progress, "mousemove touchmove", (t3) => {
            const { posterThumbnails: i3 } = e3;
            i3 && i3.loaded && i3.startMove(t3);
          }), this.bind(t2.progress, "mouseleave touchend click", () => {
            const { posterThumbnails: t3 } = e3;
            t3 && t3.loaded && t3.endMove(false, true);
          }), this.bind(t2.progress, "mousedown touchstart", (t3) => {
            const { posterThumbnails: i3 } = e3;
            i3 && i3.loaded && i3.startScrubbing(t3);
          }), this.bind(t2.progress, "mouseup touchend", (t3) => {
            const { posterThumbnails: i3 } = e3;
            i3 && i3.loaded && i3.endScrubbing(t3);
          }), x.isWebKit && Array.from(B.call(e3, 'input[type="range"]')).forEach((t3) => {
            this.bind(t3, "input", (t4) => Me.updateRangeFill.call(e3, t4.target));
          }), e3.config.toggleInvert && !A.element(t2.display.duration) && this.bind(t2.display.currentTime, "click", () => {
            0 !== e3.currentTime && (e3.config.invertTime = !e3.config.invertTime, Me.timeUpdate.call(e3));
          }), this.bind(
            t2.inputs.volume,
            i2,
            (t3) => {
              e3.volume = t3.target.value;
            },
            "volume"
          ), this.bind(t2.controls, "mouseenter mouseleave", (i3) => {
            t2.controls.hover = !e3.touch && "mouseenter" === i3.type;
          }), t2.fullscreen && Array.from(t2.fullscreen.children).filter((e4) => !e4.contains(t2.container)).forEach((i3) => {
            this.bind(i3, "mouseenter mouseleave", (i4) => {
              t2.controls && (t2.controls.hover = !e3.touch && "mouseenter" === i4.type);
            });
          }), this.bind(t2.controls, "mousedown mouseup touchstart touchend touchcancel", (e4) => {
            t2.controls.pressed = ["mousedown", "touchstart"].includes(e4.type);
          }), this.bind(t2.controls, "focusin", () => {
            const { config: i3, timers: s2 } = e3;
            F(t2.controls, i3.classNames.noTransition, true), Ue.toggleControls.call(e3, true), setTimeout(() => {
              F(t2.controls, i3.classNames.noTransition, false);
            }, 0);
            const n2 = this.touch ? 3e3 : 4e3;
            clearTimeout(s2.controls), s2.controls = setTimeout(() => Ue.toggleControls.call(e3, false), n2);
          }), this.bind(
            t2.inputs.volume,
            "wheel",
            (t3) => {
              const i3 = t3.webkitDirectionInvertedFromDevice, [s2, n2] = [t3.deltaX, -t3.deltaY].map((e4) => i3 ? -e4 : e4), a2 = Math.sign(Math.abs(s2) > Math.abs(n2) ? s2 : n2);
              e3.increaseVolume(a2 / 50);
              const { volume: r2 } = e3.media;
              (1 === a2 && r2 < 1 || -1 === a2 && r2 > 0) && t3.preventDefault();
            },
            "volume",
            false
          );
        }), this.player = e2, this.lastKey = null, this.focusTimer = null, this.lastKeyDown = null, this.handleKey = this.handleKey.bind(this), this.toggleMenu = this.toggleMenu.bind(this), this.firstTouch = this.firstTouch.bind(this);
      }
      handleKey(e2) {
        const { player: t2 } = this, { elements: i2 } = t2, { key: s2, type: n2, altKey: a2, ctrlKey: r2, metaKey: o2, shiftKey: l2 } = e2, c2 = "keydown" === n2, u2 = c2 && s2 === this.lastKey;
        if (a2 || r2 || o2 || l2) return;
        if (!s2) return;
        if (c2) {
          const n3 = document.activeElement;
          if (A.element(n3)) {
            const { editable: s3 } = t2.config.selectors, { seek: a3 } = i2.inputs;
            if (n3 !== a3 && V(n3, s3)) return;
            if (" " === e2.key && V(n3, 'button, [role^="menuitem"]')) return;
          }
          switch ([" ", "ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "c", "f", "k", "l", "m"].includes(s2) && (e2.preventDefault(), e2.stopPropagation()), s2) {
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
              u2 || (h2 = parseInt(s2, 10), t2.currentTime = t2.duration / 10 * h2);
              break;
            case " ":
            case "k":
              u2 || se(t2.togglePlay());
              break;
            case "ArrowUp":
              t2.increaseVolume(0.1);
              break;
            case "ArrowDown":
              t2.decreaseVolume(0.1);
              break;
            case "m":
              u2 || (t2.muted = !t2.muted);
              break;
            case "ArrowRight":
              t2.forward();
              break;
            case "ArrowLeft":
              t2.rewind();
              break;
            case "f":
              t2.fullscreen.toggle();
              break;
            case "c":
              u2 || t2.toggleCaptions();
              break;
            case "l":
              t2.loop = !t2.loop;
          }
          "Escape" === s2 && !t2.fullscreen.usingNative && t2.fullscreen.active && t2.fullscreen.toggle(), this.lastKey = s2;
        } else this.lastKey = null;
        var h2;
      }
      toggleMenu(e2) {
        Me.toggleMenu.call(this.player, e2);
      }
    }
    var Be = function(e2, t2) {
      return e2(t2 = { exports: {} }, t2.exports), t2.exports;
    }(function(e2, t2) {
      e2.exports = function() {
        var e3 = function() {
        }, t3 = {}, i2 = {}, s2 = {};
        function n2(e4, t4) {
          e4 = e4.push ? e4 : [e4];
          var n3, a3, r3, o3 = [], l3 = e4.length, c3 = l3;
          for (n3 = function(e5, i3) {
            i3.length && o3.push(e5), --c3 || t4(o3);
          }; l3--; )
            a3 = e4[l3], (r3 = i2[a3]) ? n3(a3, r3) : (s2[a3] = s2[a3] || []).push(n3);
        }
        function a2(e4, t4) {
          if (e4) {
            var n3 = s2[e4];
            if (i2[e4] = t4, n3) for (; n3.length; ) n3[0](e4, t4), n3.splice(0, 1);
          }
        }
        function r2(t4, i3) {
          t4.call && (t4 = { success: t4 }), i3.length ? (t4.error || e3)(i3) : (t4.success || e3)(t4);
        }
        function o2(t4, i3, s3, n3) {
          var a3, r3, l3 = document, c3 = s3.async, u2 = (s3.numRetries || 0) + 1, h2 = s3.before || e3, d2 = t4.replace(/[\?|#].*$/, ""), m2 = t4.replace(/^(css|img)!/, "");
          n3 = n3 || 0, /(^css!|\.css$)/.test(d2) ? ((r3 = l3.createElement("link")).rel = "stylesheet", r3.href = m2, (a3 = "hideFocus" in r3) && r3.relList && (a3 = 0, r3.rel = "preload", r3.as = "style")) : /(^img!|\.(png|gif|jpg|svg|webp)$)/.test(d2) ? (r3 = l3.createElement("img")).src = m2 : ((r3 = l3.createElement("script")).src = t4, r3.async = void 0 === c3 || c3), r3.onload = r3.onerror = r3.onbeforeload = function(e4) {
            var l4 = e4.type[0];
            if (a3)
              try {
                r3.sheet.cssText.length || (l4 = "e");
              } catch (e5) {
                18 != e5.code && (l4 = "e");
              }
            if ("e" == l4) {
              if ((n3 += 1) < u2) return o2(t4, i3, s3, n3);
            } else if ("preload" == r3.rel && "style" == r3.as) return r3.rel = "stylesheet";
            i3(t4, l4, e4.defaultPrevented);
          }, false !== h2(t4, r3) && l3.head.appendChild(r3);
        }
        function l2(e4, t4, i3) {
          var s3, n3, a3 = (e4 = e4.push ? e4 : [e4]).length, r3 = a3, l3 = [];
          for (s3 = function(e5, i4, s4) {
            if ("e" == i4 && l3.push(e5), "b" == i4) {
              if (!s4) return;
              l3.push(e5);
            }
            --a3 || t4(l3);
          }, n3 = 0; n3 < r3; n3++)
            o2(e4[n3], s3, i3);
        }
        function c2(e4, i3, s3) {
          var n3, o3;
          if (i3 && i3.trim && (n3 = i3), o3 = (n3 ? s3 : i3) || {}, n3) {
            if (n3 in t3) throw "LoadJS";
            t3[n3] = true;
          }
          function c3(t4, i4) {
            l2(
              e4,
              function(e5) {
                r2(o3, e5), t4 && r2({ success: t4, error: i4 }, e5), a2(n3, e5);
              },
              o3
            );
          }
          if (o3.returnPromise) return new Promise(c3);
          c3();
        }
        return c2.ready = function(e4, t4) {
          return n2(e4, function(e5) {
            r2(t4, e5);
          }), c2;
        }, c2.done = function(e4) {
          a2(e4, []);
        }, c2.reset = function() {
          t3 = {}, i2 = {}, s2 = {};
        }, c2.isDefined = function(e4) {
          return e4 in t3;
        }, c2;
      }();
    });
    function We(e2) {
      return new Promise((t2, i2) => {
        Be(e2, { success: t2, error: i2 });
      });
    }
    function ze(e2) {
      e2 && !this.embed.hasPlayed && (this.embed.hasPlayed = true), this.media.paused === e2 && (this.media.paused = !e2, ee.call(this, this.media, e2 ? "play" : "pause"));
    }
    const Ke = {
      setup() {
        const e2 = this;
        F(e2.elements.wrapper, e2.config.classNames.embed, true), e2.options.speed = e2.config.speed.options, he.call(e2), A.object(window.Vimeo) ? Ke.ready.call(e2) : We(e2.config.urls.vimeo.sdk).then(() => {
          Ke.ready.call(e2);
        }).catch((t2) => {
          e2.debug.warn("Vimeo SDK (player.js) failed to load", t2);
        });
      },
      ready() {
        const e2 = this, t2 = e2.config.vimeo, _a = t2, { premium: i2, referrerPolicy: s2 } = _a, n2 = __objRest(_a, ["premium", "referrerPolicy"]);
        let a2 = e2.media.getAttribute("src"), r2 = "";
        A.empty(a2) ? (a2 = e2.media.getAttribute(e2.config.attributes.embed.id), r2 = e2.media.getAttribute(e2.config.attributes.embed.hash)) : r2 = function(e3) {
          const t3 = e3.match(/^.*(vimeo.com\/|video\/)(\d+)(\?.*&*h=|\/)+([\d,a-f]+)/);
          return t3 && 5 === t3.length ? t3[4] : null;
        }(a2);
        const o2 = r2 ? { h: r2 } : {};
        i2 && Object.assign(n2, { controls: false, sidedock: false });
        const l2 = Le(__spreadValues(__spreadValues({ loop: e2.config.loop.active, autoplay: e2.autoplay, muted: e2.muted, gesture: "media", playsinline: e2.config.playsinline }, o2), n2)), c2 = (u2 = a2, A.empty(u2) ? null : A.number(Number(u2)) ? u2 : u2.match(/^.*(vimeo.com\/|video\/)(\d+).*/) ? RegExp.$2 : u2);
        var u2;
        const h2 = O("iframe"), d2 = pe(e2.config.urls.vimeo.iframe, c2, l2);
        if (h2.setAttribute("src", d2), h2.setAttribute("allowfullscreen", ""), h2.setAttribute("allow", ["autoplay", "fullscreen", "picture-in-picture", "encrypted-media", "accelerometer", "gyroscope"].join("; ")), A.empty(s2) || h2.setAttribute("referrerPolicy", s2), i2 || !t2.customControls)
          h2.setAttribute("data-poster", e2.poster), e2.media = D(h2, e2.media);
        else {
          const t3 = O("div", { class: e2.config.classNames.embedContainer, "data-poster": e2.poster });
          t3.appendChild(h2), e2.media = D(t3, e2.media);
        }
        t2.customControls || ke(pe(e2.config.urls.vimeo.api, d2)).then((t3) => {
          !A.empty(t3) && t3.thumbnail_url && Ue.setPoster.call(e2, t3.thumbnail_url).catch(() => {
          });
        }), e2.embed = new window.Vimeo.Player(h2, { autopause: e2.config.autopause, muted: e2.muted }), e2.media.paused = true, e2.media.currentTime = 0, e2.supported.ui && e2.embed.disableTextTrack(), e2.media.play = () => (ze.call(e2, true), e2.embed.play()), e2.media.pause = () => (ze.call(e2, false), e2.embed.pause()), e2.media.stop = () => {
          e2.pause(), e2.currentTime = 0;
        };
        let { currentTime: m2 } = e2.media;
        Object.defineProperty(e2.media, "currentTime", {
          get: () => m2,
          set(t3) {
            const { embed: i3, media: s3, paused: n3, volume: a3 } = e2, r3 = n3 && !i3.hasPlayed;
            s3.seeking = true, ee.call(e2, s3, "seeking"), Promise.resolve(r3 && i3.setVolume(0)).then(() => i3.setCurrentTime(t3)).then(() => r3 && i3.pause()).then(() => r3 && i3.setVolume(a3)).catch(() => {
            });
          }
        });
        let p2 = e2.config.speed.selected;
        Object.defineProperty(e2.media, "playbackRate", {
          get: () => p2,
          set(t3) {
            e2.embed.setPlaybackRate(t3).then(() => {
              p2 = t3, ee.call(e2, e2.media, "ratechange");
            }).catch(() => {
              e2.options.speed = [1];
            });
          }
        });
        let { volume: g2 } = e2.config;
        Object.defineProperty(e2.media, "volume", {
          get: () => g2,
          set(t3) {
            e2.embed.setVolume(t3).then(() => {
              g2 = t3, ee.call(e2, e2.media, "volumechange");
            });
          }
        });
        let { muted: f2 } = e2.config;
        Object.defineProperty(e2.media, "muted", {
          get: () => f2,
          set(t3) {
            const i3 = !!A.boolean(t3) && t3;
            e2.embed.setMuted(!!i3 || e2.config.muted).then(() => {
              f2 = i3, ee.call(e2, e2.media, "volumechange");
            });
          }
        });
        let y2, { loop: b2 } = e2.config;
        Object.defineProperty(e2.media, "loop", {
          get: () => b2,
          set(t3) {
            const i3 = A.boolean(t3) ? t3 : e2.config.loop.active;
            e2.embed.setLoop(i3).then(() => {
              b2 = i3;
            });
          }
        }), e2.embed.getVideoUrl().then((t3) => {
          y2 = t3, Me.setDownloadUrl.call(e2);
        }).catch((e3) => {
          this.debug.warn(e3);
        }), Object.defineProperty(e2.media, "currentSrc", { get: () => y2 }), Object.defineProperty(e2.media, "ended", { get: () => e2.currentTime === e2.duration }), Promise.all([e2.embed.getVideoWidth(), e2.embed.getVideoHeight()]).then((t3) => {
          const [i3, s3] = t3;
          e2.embed.ratio = de(i3, s3), he.call(this);
        }), e2.embed.setAutopause(e2.config.autopause).then((t3) => {
          e2.config.autopause = t3;
        }), e2.embed.getVideoTitle().then((t3) => {
          e2.config.title = t3, Ue.setTitle.call(this);
        }), e2.embed.getCurrentTime().then((t3) => {
          m2 = t3, ee.call(e2, e2.media, "timeupdate");
        }), e2.embed.getDuration().then((t3) => {
          e2.media.duration = t3, ee.call(e2, e2.media, "durationchange");
        }), e2.embed.getTextTracks().then((t3) => {
          e2.media.textTracks = t3, Ne.setup.call(e2);
        }), e2.embed.on("cuechange", ({ cues: t3 = [] }) => {
          const i3 = t3.map(
            (e3) => function(e4) {
              const t4 = document.createDocumentFragment(), i4 = document.createElement("div");
              return t4.appendChild(i4), i4.innerHTML = e4, t4.firstChild.innerText;
            }(e3.text)
          );
          Ne.updateCues.call(e2, i3);
        }), e2.embed.on("loaded", () => {
          if (e2.embed.getPaused().then((t3) => {
            ze.call(e2, !t3), t3 || ee.call(e2, e2.media, "playing");
          }), A.element(e2.embed.element) && e2.supported.ui) {
            e2.embed.element.setAttribute("tabindex", -1);
          }
        }), e2.embed.on("bufferstart", () => {
          ee.call(e2, e2.media, "waiting");
        }), e2.embed.on("bufferend", () => {
          ee.call(e2, e2.media, "playing");
        }), e2.embed.on("play", () => {
          ze.call(e2, true), ee.call(e2, e2.media, "playing");
        }), e2.embed.on("pause", () => {
          ze.call(e2, false);
        }), e2.embed.on("timeupdate", (t3) => {
          e2.media.seeking = false, m2 = t3.seconds, ee.call(e2, e2.media, "timeupdate");
        }), e2.embed.on("progress", (t3) => {
          e2.media.buffered = t3.percent, ee.call(e2, e2.media, "progress"), 1 === parseInt(t3.percent, 10) && ee.call(e2, e2.media, "canplaythrough"), e2.embed.getDuration().then((t4) => {
            t4 !== e2.media.duration && (e2.media.duration = t4, ee.call(e2, e2.media, "durationchange"));
          });
        }), e2.embed.on("seeked", () => {
          e2.media.seeking = false, ee.call(e2, e2.media, "seeked");
        }), e2.embed.on("ended", () => {
          e2.media.paused = true, ee.call(e2, e2.media, "ended");
        }), e2.embed.on("error", (t3) => {
          e2.media.error = t3, ee.call(e2, e2.media, "error");
        }), t2.customControls && setTimeout(() => Ue.build.call(e2), 0);
      }
    };
    function Ye(e2) {
      e2 && !this.embed.hasPlayed && (this.embed.hasPlayed = true), this.media.paused === e2 && (this.media.paused = !e2, ee.call(this, this.media, e2 ? "play" : "pause"));
    }
    function Qe(e2) {
      return e2.noCookie ? "https://www.youtube-nocookie.com" : "http:" === window.location.protocol ? "http://www.youtube.com" : void 0;
    }
    const Xe = {
      setup() {
        if (F(this.elements.wrapper, this.config.classNames.embed, true), A.object(window.YT) && A.function(window.YT.Player)) Xe.ready.call(this);
        else {
          const e2 = window.onYouTubeIframeAPIReady;
          window.onYouTubeIframeAPIReady = () => {
            A.function(e2) && e2(), Xe.ready.call(this);
          }, We(this.config.urls.youtube.sdk).catch((e3) => {
            this.debug.warn("YouTube API failed to load", e3);
          });
        }
      },
      getTitle(e2) {
        ke(pe(this.config.urls.youtube.api, e2)).then((e3) => {
          if (A.object(e3)) {
            const { title: t2, height: i2, width: s2 } = e3;
            this.config.title = t2, Ue.setTitle.call(this), this.embed.ratio = de(s2, i2);
          }
          he.call(this);
        }).catch(() => {
          he.call(this);
        });
      },
      ready() {
        const e2 = this, t2 = e2.config.youtube, i2 = e2.media && e2.media.getAttribute("id");
        if (!A.empty(i2) && i2.startsWith("youtube-")) return;
        let s2 = e2.media.getAttribute("src");
        A.empty(s2) && (s2 = e2.media.getAttribute(this.config.attributes.embed.id));
        const n2 = (a2 = s2, A.empty(a2) ? null : a2.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/) ? RegExp.$2 : a2);
        var a2;
        const r2 = O("div", { id: `${e2.provider}-${Math.floor(1e4 * Math.random())}`, "data-poster": t2.customControls ? e2.poster : void 0 });
        if (e2.media = D(r2, e2.media), t2.customControls) {
          const t3 = (e3) => `https://i.ytimg.com/vi/${n2}/${e3}default.jpg`;
          Fe(t3("maxres"), 121).catch(() => Fe(t3("sd"), 121)).catch(() => Fe(t3("hq"))).then((t4) => Ue.setPoster.call(e2, t4.src)).then((t4) => {
            t4.includes("maxres") || (e2.elements.poster.style.backgroundSize = "cover");
          }).catch(() => {
          });
        }
        e2.embed = new window.YT.Player(e2.media, {
          videoId: n2,
          host: Qe(t2),
          playerVars: N(
            {},
            {
              autoplay: e2.config.autoplay ? 1 : 0,
              hl: e2.config.hl,
              controls: e2.supported.ui && t2.customControls ? 0 : 1,
              disablekb: 1,
              playsinline: e2.config.playsinline && !e2.config.fullscreen.iosNative ? 1 : 0,
              cc_load_policy: e2.captions.active ? 1 : 0,
              cc_lang_pref: e2.config.captions.language,
              widget_referrer: window ? window.location.href : null
            },
            t2
          ),
          events: {
            onError(t3) {
              if (!e2.media.error) {
                const i3 = t3.data, s3 = {
                  2: "The request contains an invalid parameter value. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks.",
                  5: "The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.",
                  100: "The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private.",
                  101: "The owner of the requested video does not allow it to be played in embedded players.",
                  150: "The owner of the requested video does not allow it to be played in embedded players."
                }[i3] || "An unknown error occurred";
                e2.media.error = { code: i3, message: s3 }, ee.call(e2, e2.media, "error");
              }
            },
            onPlaybackRateChange(t3) {
              const i3 = t3.target;
              e2.media.playbackRate = i3.getPlaybackRate(), ee.call(e2, e2.media, "ratechange");
            },
            onReady(i3) {
              if (A.function(e2.media.play)) return;
              const s3 = i3.target;
              Xe.getTitle.call(e2, n2), e2.media.play = () => {
                Ye.call(e2, true), s3.playVideo();
              }, e2.media.pause = () => {
                Ye.call(e2, false), s3.pauseVideo();
              }, e2.media.stop = () => {
                s3.stopVideo();
              }, e2.media.duration = s3.getDuration(), e2.media.paused = true, e2.media.currentTime = 0, Object.defineProperty(e2.media, "currentTime", {
                get: () => Number(s3.getCurrentTime()),
                set(t3) {
                  e2.paused && !e2.embed.hasPlayed && e2.embed.mute(), e2.media.seeking = true, ee.call(e2, e2.media, "seeking"), s3.seekTo(t3);
                }
              }), Object.defineProperty(e2.media, "playbackRate", {
                get: () => s3.getPlaybackRate(),
                set(e3) {
                  s3.setPlaybackRate(e3);
                }
              });
              let { volume: a3 } = e2.config;
              Object.defineProperty(e2.media, "volume", {
                get: () => a3,
                set(t3) {
                  a3 = t3, s3.setVolume(100 * a3), ee.call(e2, e2.media, "volumechange");
                }
              });
              let { muted: r3 } = e2.config;
              Object.defineProperty(e2.media, "muted", {
                get: () => r3,
                set(t3) {
                  const i4 = A.boolean(t3) ? t3 : r3;
                  r3 = i4, s3[i4 ? "mute" : "unMute"](), s3.setVolume(100 * a3), ee.call(e2, e2.media, "volumechange");
                }
              }), Object.defineProperty(e2.media, "currentSrc", { get: () => s3.getVideoUrl() }), Object.defineProperty(e2.media, "ended", { get: () => e2.currentTime === e2.duration });
              const o2 = s3.getAvailablePlaybackRates();
              e2.options.speed = o2.filter((t3) => e2.config.speed.options.includes(t3)), e2.supported.ui && t2.customControls && e2.media.setAttribute("tabindex", -1), ee.call(e2, e2.media, "timeupdate"), ee.call(e2, e2.media, "durationchange"), clearInterval(e2.timers.buffering), e2.timers.buffering = setInterval(() => {
                e2.media.buffered = s3.getVideoLoadedFraction(), (null === e2.media.lastBuffered || e2.media.lastBuffered < e2.media.buffered) && ee.call(e2, e2.media, "progress"), e2.media.lastBuffered = e2.media.buffered, 1 === e2.media.buffered && (clearInterval(e2.timers.buffering), ee.call(e2, e2.media, "canplaythrough"));
              }, 200), t2.customControls && setTimeout(() => Ue.build.call(e2), 50);
            },
            onStateChange(i3) {
              const s3 = i3.target;
              clearInterval(e2.timers.playing);
              switch (e2.media.seeking && [1, 2].includes(i3.data) && (e2.media.seeking = false, ee.call(e2, e2.media, "seeked")), i3.data) {
                case -1:
                  ee.call(e2, e2.media, "timeupdate"), e2.media.buffered = s3.getVideoLoadedFraction(), ee.call(e2, e2.media, "progress");
                  break;
                case 0:
                  Ye.call(e2, false), e2.media.loop ? (s3.stopVideo(), s3.playVideo()) : ee.call(e2, e2.media, "ended");
                  break;
                case 1:
                  t2.customControls && !e2.config.autoplay && e2.media.paused && !e2.embed.hasPlayed ? e2.media.pause() : (Ye.call(e2, true), ee.call(e2, e2.media, "playing"), e2.timers.playing = setInterval(() => {
                    ee.call(e2, e2.media, "timeupdate");
                  }, 50), e2.media.duration !== s3.getDuration() && (e2.media.duration = s3.getDuration(), ee.call(e2, e2.media, "durationchange")));
                  break;
                case 2:
                  e2.muted || e2.embed.unMute(), Ye.call(e2, false);
                  break;
                case 3:
                  ee.call(e2, e2.media, "waiting");
              }
              ee.call(e2, e2.elements.container, "statechange", false, { code: i3.data });
            }
          }
        });
      }
    }, Je = {
      setup() {
        this.media ? (F(this.elements.container, this.config.classNames.type.replace("{0}", this.type), true), F(this.elements.container, this.config.classNames.provider.replace("{0}", this.provider), true), this.isEmbed && F(this.elements.container, this.config.classNames.type.replace("{0}", "video"), true), this.isVideo && (this.elements.wrapper = O("div", { class: this.config.classNames.video }), _(this.media, this.elements.wrapper), this.elements.poster = O("div", { class: this.config.classNames.poster }), this.elements.wrapper.appendChild(this.elements.poster)), this.isHTML5 ? me.setup.call(this) : this.isYouTube ? Xe.setup.call(this) : this.isVimeo && Ke.setup.call(this)) : this.debug.warn("No media element found!");
      }
    };
    class Ge {
      constructor(e2) {
        t(this, "load", () => {
          this.enabled && (A.object(window.google) && A.object(window.google.ima) ? this.ready() : We(this.player.config.urls.googleIMA.sdk).then(() => {
            this.ready();
          }).catch(() => {
            this.trigger("error", new Error("Google IMA SDK failed to load"));
          }));
        }), t(this, "ready", () => {
          var e3;
          this.enabled || ((e3 = this).manager && e3.manager.destroy(), e3.elements.displayContainer && e3.elements.displayContainer.destroy(), e3.elements.container.remove()), this.startSafetyTimer(12e3, "ready()"), this.managerPromise.then(() => {
            this.clearSafetyTimer("onAdsManagerLoaded()");
          }), this.listeners(), this.setupIMA();
        }), t(this, "setupIMA", () => {
          this.elements.container = O("div", { class: this.player.config.classNames.ads }), this.player.elements.container.appendChild(this.elements.container), google.ima.settings.setVpaidMode(google.ima.ImaSdkSettings.VpaidMode.ENABLED), google.ima.settings.setLocale(this.player.config.ads.language), google.ima.settings.setDisableCustomPlaybackForIOS10Plus(this.player.config.playsinline), this.elements.displayContainer = new google.ima.AdDisplayContainer(this.elements.container, this.player.media), this.loader = new google.ima.AdsLoader(this.elements.displayContainer), this.loader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, (e3) => this.onAdsManagerLoaded(e3), false), this.loader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, (e3) => this.onAdError(e3), false), this.requestAds();
        }), t(this, "requestAds", () => {
          const { container: e3 } = this.player.elements;
          try {
            const t2 = new google.ima.AdsRequest();
            t2.adTagUrl = this.tagUrl, t2.linearAdSlotWidth = e3.offsetWidth, t2.linearAdSlotHeight = e3.offsetHeight, t2.nonLinearAdSlotWidth = e3.offsetWidth, t2.nonLinearAdSlotHeight = e3.offsetHeight, t2.forceNonLinearFullSlot = false, t2.setAdWillPlayMuted(!this.player.muted), this.loader.requestAds(t2);
          } catch (e4) {
            this.onAdError(e4);
          }
        }), t(this, "pollCountdown", (e3 = false) => {
          if (!e3) return clearInterval(this.countdownTimer), void this.elements.container.removeAttribute("data-badge-text");
          this.countdownTimer = setInterval(() => {
            const e4 = Pe(Math.max(this.manager.getRemainingTime(), 0)), t2 = `${we.get("advertisement", this.player.config)} - ${e4}`;
            this.elements.container.setAttribute("data-badge-text", t2);
          }, 100);
        }), t(this, "onAdsManagerLoaded", (e3) => {
          if (!this.enabled) return;
          const t2 = new google.ima.AdsRenderingSettings();
          t2.restoreCustomPlaybackStateOnAdBreakComplete = true, t2.enablePreloading = true, this.manager = e3.getAdsManager(this.player, t2), this.cuePoints = this.manager.getCuePoints(), this.manager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, (e4) => this.onAdError(e4)), Object.keys(google.ima.AdEvent.Type).forEach((e4) => {
            this.manager.addEventListener(google.ima.AdEvent.Type[e4], (e5) => this.onAdEvent(e5));
          }), this.trigger("loaded");
        }), t(this, "addCuePoints", () => {
          A.empty(this.cuePoints) || this.cuePoints.forEach((e3) => {
            if (0 !== e3 && -1 !== e3 && e3 < this.player.duration) {
              const t2 = this.player.elements.progress;
              if (A.element(t2)) {
                const i2 = 100 / this.player.duration * e3, s2 = O("span", { class: this.player.config.classNames.cues });
                s2.style.left = `${i2.toString()}%`, t2.appendChild(s2);
              }
            }
          });
        }), t(this, "onAdEvent", (e3) => {
          const { container: t2 } = this.player.elements, i2 = e3.getAd(), s2 = e3.getAdData();
          switch (((e4) => {
            ee.call(this.player, this.player.media, `ads${e4.replace(/_/g, "").toLowerCase()}`);
          })(e3.type), e3.type) {
            case google.ima.AdEvent.Type.LOADED:
              this.trigger("loaded"), this.pollCountdown(true), i2.isLinear() || (i2.width = t2.offsetWidth, i2.height = t2.offsetHeight);
              break;
            case google.ima.AdEvent.Type.STARTED:
              this.manager.setVolume(this.player.volume);
              break;
            case google.ima.AdEvent.Type.ALL_ADS_COMPLETED:
              this.player.ended ? this.loadAds() : this.loader.contentComplete();
              break;
            case google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED:
              this.pauseContent();
              break;
            case google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED:
              this.pollCountdown(), this.resumeContent();
              break;
            case google.ima.AdEvent.Type.LOG:
              s2.adError && this.player.debug.warn(`Non-fatal ad error: ${s2.adError.getMessage()}`);
          }
        }), t(this, "onAdError", (e3) => {
          this.cancel(), this.player.debug.warn("Ads error", e3);
        }), t(this, "listeners", () => {
          const { container: e3 } = this.player.elements;
          let t2;
          this.player.on("canplay", () => {
            this.addCuePoints();
          }), this.player.on("ended", () => {
            this.loader.contentComplete();
          }), this.player.on("timeupdate", () => {
            t2 = this.player.currentTime;
          }), this.player.on("seeked", () => {
            const e4 = this.player.currentTime;
            A.empty(this.cuePoints) || this.cuePoints.forEach((i2, s2) => {
              t2 < i2 && i2 < e4 && (this.manager.discardAdBreak(), this.cuePoints.splice(s2, 1));
            });
          }), window.addEventListener("resize", () => {
            this.manager && this.manager.resize(e3.offsetWidth, e3.offsetHeight, google.ima.ViewMode.NORMAL);
          });
        }), t(this, "play", () => {
          const { container: e3 } = this.player.elements;
          this.managerPromise || this.resumeContent(), this.managerPromise.then(() => {
            this.manager.setVolume(this.player.volume), this.elements.displayContainer.initialize();
            try {
              this.initialized || (this.manager.init(e3.offsetWidth, e3.offsetHeight, google.ima.ViewMode.NORMAL), this.manager.start()), this.initialized = true;
            } catch (e4) {
              this.onAdError(e4);
            }
          }).catch(() => {
          });
        }), t(this, "resumeContent", () => {
          this.elements.container.style.zIndex = "", this.playing = false, se(this.player.media.play());
        }), t(this, "pauseContent", () => {
          this.elements.container.style.zIndex = 3, this.playing = true, this.player.media.pause();
        }), t(this, "cancel", () => {
          this.initialized && this.resumeContent(), this.trigger("error"), this.loadAds();
        }), t(this, "loadAds", () => {
          this.managerPromise.then(() => {
            this.manager && this.manager.destroy(), this.managerPromise = new Promise((e3) => {
              this.on("loaded", e3), this.player.debug.log(this.manager);
            }), this.initialized = false, this.requestAds();
          }).catch(() => {
          });
        }), t(this, "trigger", (e3, ...t2) => {
          const i2 = this.events[e3];
          A.array(i2) && i2.forEach((e4) => {
            A.function(e4) && e4.apply(this, t2);
          });
        }), t(this, "on", (e3, t2) => (A.array(this.events[e3]) || (this.events[e3] = []), this.events[e3].push(t2), this)), t(this, "startSafetyTimer", (e3, t2) => {
          this.player.debug.log(`Safety timer invoked from: ${t2}`), this.safetyTimer = setTimeout(() => {
            this.cancel(), this.clearSafetyTimer("startSafetyTimer()");
          }, e3);
        }), t(this, "clearSafetyTimer", (e3) => {
          A.nullOrUndefined(this.safetyTimer) || (this.player.debug.log(`Safety timer cleared from: ${e3}`), clearTimeout(this.safetyTimer), this.safetyTimer = null);
        }), this.player = e2, this.config = e2.config.ads, this.playing = false, this.initialized = false, this.elements = { container: null, displayContainer: null }, this.manager = null, this.loader = null, this.cuePoints = null, this.events = {}, this.safetyTimer = null, this.countdownTimer = null, this.managerPromise = new Promise((e3, t2) => {
          this.on("loaded", e3), this.on("error", t2);
        }), this.load();
      }
      get enabled() {
        const { config: e2 } = this;
        return this.player.isHTML5 && this.player.isVideo && e2.enabled && (!A.empty(e2.publisherId) || A.url(e2.tagUrl));
      }
      get tagUrl() {
        const { config: e2 } = this;
        if (A.url(e2.tagUrl)) return e2.tagUrl;
        return `https://go.aniview.com/api/adserver6/vast/?${Le({
          AV_PUBLISHERID: "58c25bb0073ef448b1087ad6",
          AV_CHANNELID: "5a0458dc28a06145e4519d21",
          AV_URL: window.location.hostname,
          cb: Date.now(),
          AV_WIDTH: 640,
          AV_HEIGHT: 480,
          AV_CDIM2: e2.publisherId
        })}`;
      }
    }
    function Ze(e2 = 0, t2 = 0, i2 = 255) {
      return Math.min(Math.max(e2, t2), i2);
    }
    const et = (e2) => {
      const t2 = [];
      return e2.split(/\r\n\r\n|\n\n|\r\r/).forEach((e3) => {
        const i2 = {};
        e3.split(/\r\n|\n|\r/).forEach((e4) => {
          if (A.number(i2.startTime)) {
            if (!A.empty(e4.trim()) && A.empty(i2.text)) {
              const t3 = e4.trim().split("#xywh=");
              [i2.text] = t3, t3[1] && ([i2.x, i2.y, i2.w, i2.h] = t3[1].split(","));
            }
          } else {
            const t3 = e4.match(/([0-9]{2})?:?([0-9]{2}):([0-9]{2}).([0-9]{2,3})( ?--> ?)([0-9]{2})?:?([0-9]{2}):([0-9]{2}).([0-9]{2,3})/);
            t3 && (i2.startTime = 60 * Number(t3[1] || 0) * 60 + 60 * Number(t3[2]) + Number(t3[3]) + Number(`0.${t3[4]}`), i2.endTime = 60 * Number(t3[6] || 0) * 60 + 60 * Number(t3[7]) + Number(t3[8]) + Number(`0.${t3[9]}`));
          }
        }), i2.text && t2.push(i2);
      }), t2;
    }, tt = (e2, t2) => {
      const i2 = {};
      return e2 > t2.width / t2.height ? (i2.width = t2.width, i2.height = 1 / e2 * t2.width) : (i2.height = t2.height, i2.width = e2 * t2.height), i2;
    };
    class it {
      constructor(e2) {
        t(this, "load", () => {
          this.player.elements.display.seekTooltip && (this.player.elements.display.seekTooltip.hidden = this.enabled), this.enabled && this.getThumbnails().then(() => {
            this.enabled && (this.render(), this.determineContainerAutoSizing(), this.listeners(), this.loaded = true);
          });
        }), t(
          this,
          "getThumbnails",
          () => new Promise((e3) => {
            const { src: t2 } = this.player.config.posterThumbnails;
            if (A.empty(t2)) throw new Error("Missing posterThumbnails.src config attribute");
            const i2 = () => {
              this.thumbnails.sort((e4, t3) => e4.height - t3.height), this.player.debug.log("Preview thumbnails", this.thumbnails), e3();
            };
            if (A.function(t2))
              t2((e4) => {
                this.thumbnails = e4, i2();
              });
            else {
              const e4 = (A.string(t2) ? [t2] : t2).map((e5) => this.getThumbnail(e5));
              Promise.all(e4).then(i2);
            }
          })
        ), t(
          this,
          "getThumbnail",
          (e3) => new Promise((t2) => {
            ke(e3).then((i2) => {
              const s2 = { frames: et(i2), height: null, urlPrefix: "" };
              s2.frames[0].text.startsWith("/") || s2.frames[0].text.startsWith("http://") || s2.frames[0].text.startsWith("https://") || (s2.urlPrefix = e3.substring(0, e3.lastIndexOf("/") + 1));
              const n2 = new Image();
              n2.onload = () => {
                s2.height = n2.naturalHeight, s2.width = n2.naturalWidth, this.thumbnails.push(s2), t2();
              }, n2.src = s2.urlPrefix + s2.frames[0].text;
            });
          })
        ), t(this, "startMove", (e3) => {
          if (this.loaded && A.event(e3) && ["touchmove", "mousemove"].includes(e3.type) && this.player.media.duration) {
            if ("touchmove" === e3.type) this.seekTime = this.player.media.duration * (this.player.elements.inputs.seek.value / 100);
            else {
              var t2, i2;
              const s2 = this.player.elements.progress.getBoundingClientRect(), n2 = 100 / s2.width * (e3.pageX - s2.left);
              this.seekTime = this.player.media.duration * (n2 / 100), this.seekTime < 0 && (this.seekTime = 0), this.seekTime > this.player.media.duration - 1 && (this.seekTime = this.player.media.duration - 1), this.mousePosX = e3.pageX, this.elements.thumb.time.innerText = Pe(this.seekTime);
              const a2 = null === (t2 = this.player.config.markers) || void 0 === t2 || null === (i2 = t2.points) || void 0 === i2 ? void 0 : i2.find(({ time: e4 }) => e4 === Math.round(this.seekTime));
              a2 && this.elements.thumb.time.insertAdjacentHTML("afterbegin", `${a2.label}<br>`);
            }
            this.showImageAtCurrentTime();
          }
        }), t(this, "endMove", () => {
          this.toggleThumbContainer(false, true);
        }), t(this, "startScrubbing", (e3) => {
          (A.nullOrUndefined(e3.button) || false === e3.button || 0 === e3.button) && (this.mouseDown = true, this.player.media.duration && (this.toggleScrubbingContainer(true), this.toggleThumbContainer(false, true), this.showImageAtCurrentTime()));
        }), t(this, "endScrubbing", () => {
          this.mouseDown = false, Math.ceil(this.lastTime) === Math.ceil(this.player.media.currentTime) ? this.toggleScrubbingContainer(false) : Z.call(this.player, this.player.media, "timeupdate", () => {
            this.mouseDown || this.toggleScrubbingContainer(false);
          });
        }), t(this, "listeners", () => {
          this.player.on("play", () => {
            this.toggleThumbContainer(false, true);
          }), this.player.on("seeked", () => {
            this.toggleThumbContainer(false);
          }), this.player.on("timeupdate", () => {
            this.lastTime = this.player.media.currentTime;
          });
        }), t(this, "render", () => {
          this.elements.thumb.container = O("div", { class: this.player.config.classNames.posterThumbnails.thumbContainer }), this.elements.thumb.imageContainer = O("div", { class: this.player.config.classNames.posterThumbnails.imageContainer }), this.elements.thumb.container.appendChild(this.elements.thumb.imageContainer);
          const e3 = O("div", { class: this.player.config.classNames.posterThumbnails.timeContainer });
          this.elements.thumb.time = O("span", {}, "00:00"), e3.appendChild(this.elements.thumb.time), this.elements.thumb.imageContainer.appendChild(e3), A.element(this.player.elements.progress) && this.player.elements.progress.appendChild(this.elements.thumb.container), this.elements.scrubbing.container = O("div", { class: this.player.config.classNames.posterThumbnails.scrubbingContainer }), this.player.elements.wrapper.appendChild(this.elements.scrubbing.container);
        }), t(this, "destroy", () => {
          this.elements.thumb.container && this.elements.thumb.container.remove(), this.elements.scrubbing.container && this.elements.scrubbing.container.remove();
        }), t(this, "showImageAtCurrentTime", () => {
          this.mouseDown ? this.setScrubbingContainerSize() : this.setThumbContainerSizeAndPos();
          const e3 = this.thumbnails[0].frames.findIndex((e4) => this.seekTime >= e4.startTime && this.seekTime <= e4.endTime), t2 = e3 >= 0;
          let i2 = 0;
          this.mouseDown || this.toggleThumbContainer(t2), t2 && (this.thumbnails.forEach((t3, s2) => {
            this.loadedImages.includes(t3.frames[e3].text) && (i2 = s2);
          }), e3 !== this.showingThumb && (this.showingThumb = e3, this.loadImage(i2)));
        }), t(this, "loadImage", (e3 = 0) => {
          const t2 = this.showingThumb, i2 = this.thumbnails[e3], { urlPrefix: s2 } = i2, n2 = i2.frames[t2], a2 = i2.frames[t2].text, r2 = s2 + a2;
          if (this.currentImageElement && this.currentImageElement.dataset.filename === a2)
            this.showImage(this.currentImageElement, n2, e3, t2, a2, false), this.currentImageElement.dataset.index = t2, this.removeOldImages(this.currentImageElement);
          else {
            this.loadingImage && this.usingSprites && (this.loadingImage.onload = null);
            const i3 = new Image();
            i3.src = r2, i3.dataset.index = t2, i3.dataset.filename = a2, this.showingThumbFilename = a2, this.player.debug.log(`Loading image: ${r2}`), i3.onload = () => this.showImage(i3, n2, e3, t2, a2, true), this.loadingImage = i3, this.removeOldImages(i3);
          }
        }), t(this, "showImage", (e3, t2, i2, s2, n2, a2 = true) => {
          this.player.debug.log(`Showing thumb: ${n2}. num: ${s2}. qual: ${i2}. newimg: ${a2}`), this.setImageSizeAndOffset(e3, t2), a2 && (this.currentImageContainer.appendChild(e3), this.currentImageElement = e3, this.loadedImages.includes(n2) || this.loadedImages.push(n2)), this.preloadNearby(s2, true).then(this.preloadNearby(s2, false)).then(this.getHigherQuality(i2, e3, t2, n2));
        }), t(this, "removeOldImages", (e3) => {
          Array.from(this.currentImageContainer.children).forEach((t2) => {
            if ("img" !== t2.tagName.toLowerCase()) return;
            const i2 = this.usingSprites ? 500 : 1e3;
            if (t2.dataset.index !== e3.dataset.index && !t2.dataset.deleting) {
              t2.dataset.deleting = true;
              const { currentImageContainer: e4 } = this;
              setTimeout(() => {
                e4.removeChild(t2), this.player.debug.log(`Removing thumb: ${t2.dataset.filename}`);
              }, i2);
            }
          });
        }), t(
          this,
          "preloadNearby",
          (e3, t2 = true) => new Promise((i2) => {
            setTimeout(() => {
              const s2 = this.thumbnails[0].frames[e3].text;
              if (this.showingThumbFilename === s2) {
                let n2;
                n2 = t2 ? this.thumbnails[0].frames.slice(e3) : this.thumbnails[0].frames.slice(0, e3).reverse();
                let a2 = false;
                n2.forEach((e4) => {
                  const t3 = e4.text;
                  if (t3 !== s2 && !this.loadedImages.includes(t3)) {
                    a2 = true, this.player.debug.log(`Preloading thumb filename: ${t3}`);
                    const { urlPrefix: e5 } = this.thumbnails[0], s3 = e5 + t3, n3 = new Image();
                    n3.src = s3, n3.onload = () => {
                      this.player.debug.log(`Preloaded thumb filename: ${t3}`), this.loadedImages.includes(t3) || this.loadedImages.push(t3), i2();
                    };
                  }
                }), a2 || i2();
              }
            }, 300);
          })
        ), t(this, "getHigherQuality", (e3, t2, i2, s2) => {
          if (e3 < this.thumbnails.length - 1) {
            let n2 = t2.naturalHeight;
            this.usingSprites && (n2 = i2.h), n2 < this.thumbContainerHeight && setTimeout(() => {
              this.showingThumbFilename === s2 && (this.player.debug.log(`Showing higher quality thumb for: ${s2}`), this.loadImage(e3 + 1));
            }, 300);
          }
        }), t(this, "toggleThumbContainer", (e3 = false, t2 = false) => {
          const i2 = this.player.config.classNames.posterThumbnails.thumbContainerShown;
          this.elements.thumb.container.classList.toggle(i2, e3), !e3 && t2 && (this.showingThumb = null, this.showingThumbFilename = null);
        }), t(this, "toggleScrubbingContainer", (e3 = false) => {
          const t2 = this.player.config.classNames.posterThumbnails.scrubbingContainerShown;
          this.elements.scrubbing.container.classList.toggle(t2, e3), e3 || (this.showingThumb = null, this.showingThumbFilename = null);
        }), t(this, "determineContainerAutoSizing", () => {
          (this.elements.thumb.imageContainer.clientHeight > 20 || this.elements.thumb.imageContainer.clientWidth > 20) && (this.sizeSpecifiedInCSS = true);
        }), t(this, "setThumbContainerSizeAndPos", () => {
          const { imageContainer: e3 } = this.elements.thumb;
          if (this.sizeSpecifiedInCSS) {
            if (e3.clientHeight > 20 && e3.clientWidth < 20) {
              const t2 = Math.floor(e3.clientHeight * this.thumbAspectRatio);
              e3.style.width = `${t2}px`;
            } else if (e3.clientHeight < 20 && e3.clientWidth > 20) {
              const t2 = Math.floor(e3.clientWidth / this.thumbAspectRatio);
              e3.style.height = `${t2}px`;
            }
          } else {
            const t2 = Math.floor(this.thumbContainerHeight * this.thumbAspectRatio);
            e3.style.height = `${this.thumbContainerHeight}px`, e3.style.width = `${t2}px`;
          }
          this.setThumbContainerPos();
        }), t(this, "setThumbContainerPos", () => {
          const e3 = this.player.elements.progress.getBoundingClientRect(), t2 = this.player.elements.container.getBoundingClientRect(), { container: i2 } = this.elements.thumb, s2 = t2.left - e3.left + 10, n2 = t2.right - e3.left - i2.clientWidth - 10, a2 = this.mousePosX - e3.left - i2.clientWidth / 2, r2 = Ze(a2, s2, n2);
          i2.style.left = `${r2}px`, i2.style.setProperty("--preview-arrow-offset", a2 - r2 + "px");
        }), t(this, "setScrubbingContainerSize", () => {
          const { width: e3, height: t2 } = tt(this.thumbAspectRatio, { width: this.player.media.clientWidth, height: this.player.media.clientHeight });
          this.elements.scrubbing.container.style.width = `${e3}px`, this.elements.scrubbing.container.style.height = `${t2}px`;
        }), t(this, "setImageSizeAndOffset", (e3, t2) => {
          if (!this.usingSprites) return;
          const i2 = this.thumbContainerHeight / t2.h;
          e3.style.height = e3.naturalHeight * i2 + "px", e3.style.width = e3.naturalWidth * i2 + "px", e3.style.left = `-${t2.x * i2}px`, e3.style.top = `-${t2.y * i2}px`;
        }), this.player = e2, this.thumbnails = [], this.loaded = false, this.lastMouseMoveTime = Date.now(), this.mouseDown = false, this.loadedImages = [], this.elements = { thumb: {}, scrubbing: {} }, this.load();
      }
      get enabled() {
        return this.player.isHTML5 && this.player.isVideo && this.player.config.posterThumbnails.enabled;
      }
      get currentImageContainer() {
        return this.mouseDown ? this.elements.scrubbing.container : this.elements.thumb.imageContainer;
      }
      get usingSprites() {
        return Object.keys(this.thumbnails[0].frames[0]).includes("w");
      }
      get thumbAspectRatio() {
        return this.usingSprites ? this.thumbnails[0].frames[0].w / this.thumbnails[0].frames[0].h : this.thumbnails[0].width / this.thumbnails[0].height;
      }
      get thumbContainerHeight() {
        if (this.mouseDown) {
          const { height: e2 } = tt(this.thumbAspectRatio, { width: this.player.media.clientWidth, height: this.player.media.clientHeight });
          return e2;
        }
        return this.sizeSpecifiedInCSS ? this.elements.thumb.imageContainer.clientHeight : Math.floor(this.player.media.clientWidth / this.thumbAspectRatio / 4);
      }
      get currentImageElement() {
        return this.mouseDown ? this.currentScrubbingImageElement : this.currentThumbnailImageElement;
      }
      set currentImageElement(e2) {
        this.mouseDown ? this.currentScrubbingImageElement = e2 : this.currentThumbnailImageElement = e2;
      }
    }
    const st = {
      insertElements(e2, t2) {
        A.string(t2) ? $(e2, this.media, { src: t2 }) : A.array(t2) && t2.forEach((t3) => {
          $(e2, this.media, t3);
        });
      },
      change(e2) {
        L(e2, "sources.length") ? (me.cancelRequests.call(this), this.destroy.call(
          this,
          () => {
            this.options.quality = [], j(this.media), this.media = null, A.element(this.elements.container) && this.elements.container.removeAttribute("class");
            const { sources: t2, type: i2 } = e2, [{ provider: s2 = $e.html5, src: n2 }] = t2, a2 = "html5" === s2 ? i2 : "div", r2 = "html5" === s2 ? {} : { src: n2 };
            Object.assign(this, { provider: s2, type: i2, supported: Y.check(i2, s2, this.config.playsinline), media: O(a2, r2) }), this.elements.container.appendChild(this.media), A.boolean(e2.autoplay) && (this.config.autoplay = e2.autoplay), this.isHTML5 && (this.config.crossorigin && this.media.setAttribute("crossorigin", ""), this.config.autoplay && this.media.setAttribute("autoplay", ""), A.empty(e2.poster) || (this.poster = e2.poster), this.config.loop.active && this.media.setAttribute("loop", ""), this.config.muted && this.media.setAttribute("muted", ""), this.config.playsinline && this.media.setAttribute("playsinline", "")), Ue.addStyleHook.call(this), this.isHTML5 && st.insertElements.call(this, "source", t2), this.config.title = e2.title, Je.setup.call(this), this.isHTML5 && Object.keys(e2).includes("tracks") && st.insertElements.call(this, "track", e2.tracks), (this.isHTML5 || this.isEmbed && !this.supported.ui) && Ue.build.call(this), this.isHTML5 && this.media.load(), A.empty(e2.posterThumbnails) || (Object.assign(this.config.posterThumbnails, e2.posterThumbnails), this.posterThumbnails && this.posterThumbnails.loaded && (this.posterThumbnails.destroy(), this.posterThumbnails = null), this.config.posterThumbnails.enabled && (this.posterThumbnails = new it(this))), this.fullscreen.update();
          },
          true
        )) : this.debug.warn("Invalid source format");
      }
    };
    class nt {
      constructor(e2, i2) {
        if (t(this, "play", () => A.function(this.media.play) ? (this.ads && this.ads.enabled && this.ads.managerPromise.then(() => this.ads.play()).catch(() => se(this.media.play())), this.media.play()) : null), t(this, "pause", () => this.playing && A.function(this.media.pause) ? this.media.pause() : null), t(this, "togglePlay", (e3) => (A.boolean(e3) ? e3 : !this.playing) ? this.play() : this.pause()), t(this, "stop", () => {
          this.isHTML5 ? (this.pause(), this.restart()) : A.function(this.media.stop) && this.media.stop();
        }), t(this, "restart", () => {
          this.currentTime = 0;
        }), t(this, "rewind", (e3) => {
          this.currentTime -= A.number(e3) ? e3 : this.config.seekTime;
        }), t(this, "forward", (e3) => {
          this.currentTime += A.number(e3) ? e3 : this.config.seekTime;
        }), t(this, "increaseVolume", (e3) => {
          const t2 = this.media.muted ? 0 : this.volume;
          this.volume = t2 + (A.number(e3) ? e3 : 0);
        }), t(this, "decreaseVolume", (e3) => {
          this.increaseVolume(-e3);
        }), t(this, "airplay", () => {
          Y.airplay && this.media.webkitShowPlaybackTargetPicker();
        }), t(this, "toggleControls", (e3) => {
          if (this.supported.ui && !this.isAudio) {
            const t2 = U(this.elements.container, this.config.classNames.hideControls), i3 = void 0 === e3 ? void 0 : !e3, s3 = F(this.elements.container, this.config.classNames.hideControls, i3);
            if (s3 && A.array(this.config.controls) && this.config.controls.includes("settings") && !A.empty(this.config.settings) && Me.toggleMenu.call(this, false), s3 !== t2) {
              const e4 = s3 ? "controlshidden" : "controlsshown";
              ee.call(this, this.media, e4);
            }
            return !s3;
          }
          return false;
        }), t(this, "on", (e3, t2) => {
          J.call(this, this.elements.container, e3, t2);
        }), t(this, "once", (e3, t2) => {
          Z.call(this, this.elements.container, e3, t2);
        }), t(this, "off", (e3, t2) => {
          G(this.elements.container, e3, t2);
        }), t(this, "destroy", (e3, t2 = false) => {
          if (!this.ready) return;
          const i3 = () => {
            document.body.style.overflow = "", this.embed = null, t2 ? (Object.keys(this.elements).length && (j(this.elements.buttons.play), j(this.elements.captions), j(this.elements.controls), j(this.elements.wrapper), this.elements.buttons.play = null, this.elements.captions = null, this.elements.controls = null, this.elements.wrapper = null), A.function(e3) && e3()) : (te.call(this), me.cancelRequests.call(this), D(this.elements.original, this.elements.container), ee.call(this, this.elements.original, "destroyed", true), A.function(e3) && e3.call(this.elements.original), this.ready = false, setTimeout(() => {
              this.elements = null, this.media = null;
            }, 200));
          };
          this.stop(), clearTimeout(this.timers.loading), clearTimeout(this.timers.controls), clearTimeout(this.timers.resized), this.isHTML5 ? (Ue.toggleNativeControls.call(this, true), i3()) : this.isYouTube ? (clearInterval(this.timers.buffering), clearInterval(this.timers.playing), null !== this.embed && A.function(this.embed.destroy) && this.embed.destroy(), i3()) : this.isVimeo && (null !== this.embed && this.embed.unload().then(i3), setTimeout(i3, 200));
        }), t(this, "supports", (e3) => Y.mime.call(this, e3)), this.timers = {}, this.ready = false, this.loading = false, this.failed = false, this.touch = Y.touch, this.media = e2, A.string(this.media) && (this.media = document.querySelectorAll(this.media)), (window.jQuery && this.media instanceof jQuery || A.nodeList(this.media) || A.array(this.media)) && (this.media = this.media[0]), this.config = N(
          {},
          _e,
          nt.defaults,
          i2 || {},
          (() => {
            try {
              return JSON.parse(this.media.getAttribute("data-plyr-config"));
            } catch (e3) {
              return {};
            }
          })()
        ), this.elements = { container: null, fullscreen: null, captions: null, buttons: {}, display: {}, progress: {}, inputs: {}, settings: { popup: null, menu: null, panels: {}, buttons: {} } }, this.captions = { active: null, currentTrack: -1, meta: /* @__PURE__ */ new WeakMap() }, this.fullscreen = { active: false }, this.options = { speed: [], quality: [] }, this.debug = new qe(this.config.debug), this.debug.log("Config", this.config), this.debug.log("Support", Y), A.nullOrUndefined(this.media) || !A.element(this.media))
          return void this.debug.error("Setup failed: no suitable element passed");
        if (this.media.plyr) return void this.debug.warn("Target already setup");
        if (!this.config.enabled) return void this.debug.error("Setup failed: disabled by config");
        if (!Y.check().api) return void this.debug.error("Setup failed: no support");
        const s2 = this.media.cloneNode(true);
        s2.autoplay = false, this.elements.original = s2;
        const n2 = this.media.tagName.toLowerCase();
        let a2 = null, r2 = null;
        switch (n2) {
          case "div":
            if (a2 = this.media.querySelector("iframe"), A.element(a2)) {
              if (r2 = xe(a2.getAttribute("src")), this.provider = function(e3) {
                return /^(https?:\/\/)?(www\.)?(youtube\.com|youtube-nocookie\.com|youtu\.?be)\/.+$/.test(e3) ? $e.youtube : /^https?:\/\/player.vimeo.com\/video\/\d{0,9}(?=\b|\/)/.test(e3) ? $e.vimeo : null;
              }(r2.toString()), this.elements.container = this.media, this.media = a2, this.elements.container.className = "", r2.search.length) {
                const e3 = ["1", "true"];
                e3.includes(r2.searchParams.get("autoplay")) && (this.config.autoplay = true), e3.includes(r2.searchParams.get("loop")) && (this.config.loop.active = true), this.isYouTube ? (this.config.playsinline = e3.includes(r2.searchParams.get("playsinline")), this.config.youtube.hl = r2.searchParams.get("hl")) : this.config.playsinline = true;
              }
            } else this.provider = this.media.getAttribute(this.config.attributes.embed.provider), this.media.removeAttribute(this.config.attributes.embed.provider);
            if (A.empty(this.provider) || !Object.values($e).includes(this.provider)) return void this.debug.error("Setup failed: Invalid provider");
            this.type = Re;
            break;
          case "video":
          case "audio":
            this.type = n2, this.provider = $e.html5, this.media.hasAttribute("crossorigin") && (this.config.crossorigin = true), this.media.hasAttribute("autoplay") && (this.config.autoplay = true), (this.media.hasAttribute("playsinline") || this.media.hasAttribute("webkit-playsinline")) && (this.config.playsinline = true), this.media.hasAttribute("muted") && (this.config.muted = true), this.media.hasAttribute("loop") && (this.config.loop.active = true);
            break;
          default:
            return void this.debug.error("Setup failed: unsupported type");
        }
        this.supported = Y.check(this.type, this.provider), this.supported.api ? (this.eventListeners = [], this.listeners = new Ve(this), this.storage = new Te(this), this.media.plyr = this, A.element(this.elements.container) || (this.elements.container = O("div"), _(this.media, this.elements.container)), Ue.migrateStyles.call(this), Ue.addStyleHook.call(this), Je.setup.call(this), this.config.debug && J.call(this, this.elements.container, this.config.events.join(" "), (e3) => {
          this.debug.log(`event: ${e3.type}`);
        }), this.fullscreen = new He(this), (this.isHTML5 || this.isEmbed && !this.supported.ui) && Ue.build.call(this), this.listeners.container(), this.listeners.global(), this.config.ads.enabled && (this.ads = new Ge(this)), this.isHTML5 && this.config.autoplay && this.once("canplay", () => se(this.play())), this.lastSeekTime = 0, this.config.posterThumbnails.enabled && (this.posterThumbnails = new it(this))) : this.debug.error("Setup failed: no support");
      }
      get isHTML5() {
        return this.provider === $e.html5;
      }
      get isEmbed() {
        return this.isYouTube || this.isVimeo;
      }
      get isYouTube() {
        return this.provider === $e.youtube;
      }
      get isVimeo() {
        return this.provider === $e.vimeo;
      }
      get isVideo() {
        return this.type === Re;
      }
      get isAudio() {
        return this.type === je;
      }
      get playing() {
        return Boolean(this.ready && !this.paused && !this.ended);
      }
      get paused() {
        return Boolean(this.media.paused);
      }
      get stopped() {
        return Boolean(this.paused && 0 === this.currentTime);
      }
      get ended() {
        return Boolean(this.media.ended);
      }
      set currentTime(e2) {
        if (!this.duration) return;
        const t2 = A.number(e2) && e2 > 0;
        this.media.currentTime = t2 ? Math.min(e2, this.duration) : 0, this.debug.log(`Seeking to ${this.currentTime} seconds`);
      }
      get currentTime() {
        return Number(this.media.currentTime);
      }
      get buffered() {
        const { buffered: e2 } = this.media;
        return A.number(e2) ? e2 : e2 && e2.length && this.duration > 0 ? e2.end(0) / this.duration : 0;
      }
      get seeking() {
        return Boolean(this.media.seeking);
      }
      get duration() {
        const e2 = parseFloat(this.config.duration), t2 = (this.media || {}).duration, i2 = A.number(t2) && t2 !== 1 / 0 ? t2 : 0;
        return e2 || i2;
      }
      set volume(e2) {
        let t2 = e2;
        A.string(t2) && (t2 = Number(t2)), A.number(t2) || (t2 = this.storage.get("volume")), A.number(t2) || ({ volume: t2 } = this.config), t2 > 1 && (t2 = 1), t2 < 0 && (t2 = 0), this.config.volume = t2, this.media.volume = t2, !A.empty(e2) && this.muted && t2 > 0 && (this.muted = false);
      }
      get volume() {
        return Number(this.media.volume);
      }
      set muted(e2) {
        let t2 = e2;
        A.boolean(t2) || (t2 = this.storage.get("muted")), A.boolean(t2) || (t2 = this.config.muted), this.config.muted = t2, this.media.muted = t2;
      }
      get muted() {
        return Boolean(this.media.muted);
      }
      get hasAudio() {
        return !this.isHTML5 || !!this.isAudio || Boolean(this.media.mozHasAudio) || Boolean(this.media.webkitAudioDecodedByteCount) || Boolean(this.media.audioTracks && this.media.audioTracks.length);
      }
      set speed(e2) {
        let t2 = null;
        A.number(e2) && (t2 = e2), A.number(t2) || (t2 = this.storage.get("speed")), A.number(t2) || (t2 = this.config.speed.selected);
        const { minimumSpeed: i2, maximumSpeed: s2 } = this;
        t2 = Ze(t2, i2, s2), this.config.speed.selected = t2, setTimeout(() => {
          this.media && (this.media.playbackRate = t2);
        }, 0);
      }
      get speed() {
        return Number(this.media.playbackRate);
      }
      get minimumSpeed() {
        return this.isYouTube ? Math.min(...this.options.speed) : this.isVimeo ? 0.5 : 0.0625;
      }
      get maximumSpeed() {
        return this.isYouTube ? Math.max(...this.options.speed) : this.isVimeo ? 2 : 16;
      }
      set quality(e2) {
        const t2 = this.config.quality, i2 = this.options.quality;
        if (!i2.length) return;
        let s2 = [!A.empty(e2) && Number(e2), this.storage.get("quality"), t2.selected, t2.default].find(A.number), n2 = true;
        if (!i2.includes(s2)) {
          const e3 = ae(i2, s2);
          this.debug.warn(`Unsupported quality option: ${s2}, using ${e3} instead`), s2 = e3, n2 = false;
        }
        t2.selected = s2, this.media.quality = s2, n2 && this.storage.set({ quality: s2 });
      }
      get quality() {
        return this.media.quality;
      }
      set loop(e2) {
        const t2 = A.boolean(e2) ? e2 : this.config.loop.active;
        this.config.loop.active = t2, this.media.loop = t2;
      }
      get loop() {
        return Boolean(this.media.loop);
      }
      set source(e2) {
        st.change.call(this, e2);
      }
      get source() {
        return this.media.currentSrc;
      }
      get download() {
        const { download: e2 } = this.config.urls;
        return A.url(e2) ? e2 : this.source;
      }
      set download(e2) {
        A.url(e2) && (this.config.urls.download = e2, Me.setDownloadUrl.call(this));
      }
      set poster(e2) {
        this.isVideo ? Ue.setPoster.call(this, e2, false).catch(() => {
        }) : this.debug.warn("Poster can only be set for video");
      }
      get poster() {
        return this.isVideo ? this.media.getAttribute("poster") || this.media.getAttribute("data-poster") : null;
      }
      get ratio() {
        if (!this.isVideo) return null;
        const e2 = ce(ue.call(this));
        return A.array(e2) ? e2.join(":") : e2;
      }
      set ratio(e2) {
        this.isVideo ? A.string(e2) && le(e2) ? (this.config.ratio = ce(e2), he.call(this)) : this.debug.error(`Invalid aspect ratio specified (${e2})`) : this.debug.warn("Aspect ratio can only be set for video");
      }
      set autoplay(e2) {
        this.config.autoplay = A.boolean(e2) ? e2 : this.config.autoplay;
      }
      get autoplay() {
        return Boolean(this.config.autoplay);
      }
      toggleCaptions(e2) {
        Ne.toggle.call(this, e2, false);
      }
      set currentTrack(e2) {
        Ne.set.call(this, e2, false), Ne.setup.call(this);
      }
      get currentTrack() {
        const { toggled: e2, currentTrack: t2 } = this.captions;
        return e2 ? t2 : -1;
      }
      set language(e2) {
        Ne.setLanguage.call(this, e2, false);
      }
      get language() {
        return (Ne.getCurrentTrack.call(this) || {}).language;
      }
      set pip(e2) {
        if (!Y.pip) return;
        const t2 = A.boolean(e2) ? e2 : !this.pip;
        A.function(this.media.webkitSetPresentationMode) && this.media.webkitSetPresentationMode(t2 ? Ie : Oe), A.function(this.media.requestPictureInPicture) && (!this.pip && t2 ? this.media.requestPictureInPicture() : this.pip && !t2 && document.exitPictureInPicture());
      }
      get pip() {
        return Y.pip ? A.empty(this.media.webkitPresentationMode) ? this.media === document.pictureInPictureElement : this.media.webkitPresentationMode === Ie : null;
      }
      setposterThumbnails(e2) {
        this.posterThumbnails && this.posterThumbnails.loaded && (this.posterThumbnails.destroy(), this.posterThumbnails = null), Object.assign(this.config.posterThumbnails, e2), this.config.posterThumbnails.enabled && (this.posterThumbnails = new it(this));
      }
      static supported(e2, t2) {
        return Y.check(e2, t2);
      }
      static loadSprite(e2, t2) {
        return Ee(e2, t2);
      }
      static setup(e2, t2 = {}) {
        let i2 = null;
        return A.string(e2) ? i2 = Array.from(document.querySelectorAll(e2)) : A.nodeList(e2) ? i2 = Array.from(e2) : A.array(e2) && (i2 = e2.filter(A.element)), A.empty(i2) ? null : i2.map((e3) => new nt(e3, t2));
      }
    }
    var at;
    return nt.defaults = (at = _e, JSON.parse(JSON.stringify(at))), nt;
  });
  "object" == typeof navigator && function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define("Plyr", t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).Plyr = t();
  }(void 0, function() {
    !function() {
      if ("undefined" != typeof window) try {
        var e2 = new window.CustomEvent("test", { cancelable: true });
        if (e2.preventDefault(), true !== e2.defaultPrevented) throw new Error("Could not prevent default");
      } catch (e3) {
        var t2 = function(e4, t3) {
          var i2, s2;
          return (t3 = t3 || {}).bubbles = !!t3.bubbles, t3.cancelable = !!t3.cancelable, (i2 = document.createEvent("CustomEvent")).initCustomEvent(e4, t3.bubbles, t3.cancelable, t3.detail), s2 = i2.preventDefault, i2.preventDefault = function() {
            s2.call(this);
            try {
              Object.defineProperty(this, "defaultPrevented", { get: function() {
                return true;
              } });
            } catch (e5) {
              this.defaultPrevented = true;
            }
          }, i2;
        };
        t2.prototype = window.Event.prototype, window.CustomEvent = t2;
      }
    }();
    var e = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};
    function t(e2, t2, i2) {
      return (t2 = function(e3) {
        var t3 = function(e4, t4) {
          if ("object" != typeof e4 || null === e4) return e4;
          var i3 = e4[Symbol.toPrimitive];
          if (void 0 !== i3) {
            var s2 = i3.call(e4, t4);
            if ("object" != typeof s2) return s2;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return ("string" === t4 ? String : Number)(e4);
        }(e3, "string");
        return "symbol" == typeof t3 ? t3 : String(t3);
      }(t2)) in e2 ? Object.defineProperty(e2, t2, { value: i2, enumerable: true, configurable: true, writable: true }) : e2[t2] = i2, e2;
    }
    function i(e2, t2) {
      for (var i2 = 0; i2 < t2.length; i2++) {
        var s2 = t2[i2];
        s2.enumerable = s2.enumerable || false, s2.configurable = true, "value" in s2 && (s2.writable = true), Object.defineProperty(e2, s2.key, s2);
      }
    }
    function s(e2, t2, i2) {
      return t2 in e2 ? Object.defineProperty(e2, t2, { value: i2, enumerable: true, configurable: true, writable: true }) : e2[t2] = i2, e2;
    }
    function n(e2, t2) {
      var i2 = Object.keys(e2);
      if (Object.getOwnPropertySymbols) {
        var s2 = Object.getOwnPropertySymbols(e2);
        t2 && (s2 = s2.filter(function(t3) {
          return Object.getOwnPropertyDescriptor(e2, t3).enumerable;
        })), i2.push.apply(i2, s2);
      }
      return i2;
    }
    function a(e2) {
      for (var t2 = 1; t2 < arguments.length; t2++) {
        var i2 = null != arguments[t2] ? arguments[t2] : {};
        t2 % 2 ? n(Object(i2), true).forEach(function(t3) {
          s(e2, t3, i2[t3]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(i2)) : n(Object(i2)).forEach(function(t3) {
          Object.defineProperty(e2, t3, Object.getOwnPropertyDescriptor(i2, t3));
        });
      }
      return e2;
    }
    !function(e2) {
      var t2 = function() {
        try {
          return !!Symbol.iterator;
        } catch (e3) {
          return false;
        }
      }(), i2 = function(e3) {
        var i3 = { next: function() {
          var t3 = e3.shift();
          return { done: void 0 === t3, value: t3 };
        } };
        return t2 && (i3[Symbol.iterator] = function() {
          return i3;
        }), i3;
      }, s2 = function(e3) {
        return encodeURIComponent(e3).replace(/%20/g, "+");
      }, n2 = function(e3) {
        return decodeURIComponent(String(e3).replace(/\+/g, " "));
      };
      (function() {
        try {
          var t3 = e2.URLSearchParams;
          return "a=1" === new t3("?a=1").toString() && "function" == typeof t3.prototype.set && "function" == typeof t3.prototype.entries;
        } catch (e3) {
          return false;
        }
      })() || function() {
        var n3 = function(e3) {
          Object.defineProperty(this, "_entries", { writable: true, value: {} });
          var t3 = typeof e3;
          if ("undefined" === t3) ;
          else if ("string" === t3) "" !== e3 && this._fromString(e3);
          else if (e3 instanceof n3) {
            var i3 = this;
            e3.forEach(function(e4, t4) {
              i3.append(t4, e4);
            });
          } else {
            if (null === e3 || "object" !== t3) throw new TypeError("Unsupported input's type for URLSearchParams");
            if ("[object Array]" === Object.prototype.toString.call(e3)) for (var s3 = 0; s3 < e3.length; s3++) {
              var a4 = e3[s3];
              if ("[object Array]" !== Object.prototype.toString.call(a4) && 2 === a4.length) throw new TypeError("Expected [string, any] as entry at index " + s3 + " of URLSearchParams's input");
              this.append(a4[0], a4[1]);
            }
            else for (var r2 in e3) e3.hasOwnProperty(r2) && this.append(r2, e3[r2]);
          }
        }, a3 = n3.prototype;
        a3.append = function(e3, t3) {
          e3 in this._entries ? this._entries[e3].push(String(t3)) : this._entries[e3] = [String(t3)];
        }, a3.delete = function(e3) {
          delete this._entries[e3];
        }, a3.get = function(e3) {
          return e3 in this._entries ? this._entries[e3][0] : null;
        }, a3.getAll = function(e3) {
          return e3 in this._entries ? this._entries[e3].slice(0) : [];
        }, a3.has = function(e3) {
          return e3 in this._entries;
        }, a3.set = function(e3, t3) {
          this._entries[e3] = [String(t3)];
        }, a3.forEach = function(e3, t3) {
          var i3;
          for (var s3 in this._entries) if (this._entries.hasOwnProperty(s3)) {
            i3 = this._entries[s3];
            for (var n4 = 0; n4 < i3.length; n4++) e3.call(t3, i3[n4], s3, this);
          }
        }, a3.keys = function() {
          var e3 = [];
          return this.forEach(function(t3, i3) {
            e3.push(i3);
          }), i2(e3);
        }, a3.values = function() {
          var e3 = [];
          return this.forEach(function(t3) {
            e3.push(t3);
          }), i2(e3);
        }, a3.entries = function() {
          var e3 = [];
          return this.forEach(function(t3, i3) {
            e3.push([i3, t3]);
          }), i2(e3);
        }, t2 && (a3[Symbol.iterator] = a3.entries), a3.toString = function() {
          var e3 = [];
          return this.forEach(function(t3, i3) {
            e3.push(s2(i3) + "=" + s2(t3));
          }), e3.join("&");
        }, e2.URLSearchParams = n3;
      }();
      var a2 = e2.URLSearchParams.prototype;
      "function" != typeof a2.sort && (a2.sort = function() {
        var e3 = this, t3 = [];
        this.forEach(function(i4, s3) {
          t3.push([s3, i4]), e3._entries || e3.delete(s3);
        }), t3.sort(function(e4, t4) {
          return e4[0] < t4[0] ? -1 : e4[0] > t4[0] ? 1 : 0;
        }), e3._entries && (e3._entries = {});
        for (var i3 = 0; i3 < t3.length; i3++) this.append(t3[i3][0], t3[i3][1]);
      }), "function" != typeof a2._fromString && Object.defineProperty(a2, "_fromString", { enumerable: false, configurable: false, writable: false, value: function(e3) {
        if (this._entries) this._entries = {};
        else {
          var t3 = [];
          this.forEach(function(e4, i4) {
            t3.push(i4);
          });
          for (var i3 = 0; i3 < t3.length; i3++) this.delete(t3[i3]);
        }
        var s3, a3 = (e3 = e3.replace(/^\?/, "")).split("&");
        for (i3 = 0; i3 < a3.length; i3++) s3 = a3[i3].split("="), this.append(n2(s3[0]), s3.length > 1 ? n2(s3[1]) : "");
      } });
    }(void 0 !== e ? e : "undefined" != typeof window ? window : "undefined" != typeof self ? self : e), function(e2) {
      if (function() {
        try {
          var t3 = new e2.URL("b", "http://a");
          return t3.pathname = "c d", "http://a/c%20d" === t3.href && t3.searchParams;
        } catch (e3) {
          return false;
        }
      }() || function() {
        var t3 = e2.URL, i2 = function(t4, i3) {
          "string" != typeof t4 && (t4 = String(t4)), i3 && "string" != typeof i3 && (i3 = String(i3));
          var s3, n2 = document;
          if (i3 && (void 0 === e2.location || i3 !== e2.location.href)) {
            i3 = i3.toLowerCase(), (s3 = (n2 = document.implementation.createHTMLDocument("")).createElement("base")).href = i3, n2.head.appendChild(s3);
            try {
              if (0 !== s3.href.indexOf(i3)) throw new Error(s3.href);
            } catch (e3) {
              throw new Error("URL unable to set base " + i3 + " due to " + e3);
            }
          }
          var a2 = n2.createElement("a");
          a2.href = t4, s3 && (n2.body.appendChild(a2), a2.href = a2.href);
          var r2 = n2.createElement("input");
          if (r2.type = "url", r2.value = t4, ":" === a2.protocol || !/:/.test(a2.href) || !r2.checkValidity() && !i3) throw new TypeError("Invalid URL");
          Object.defineProperty(this, "_anchorElement", { value: a2 });
          var o2 = new e2.URLSearchParams(this.search), l2 = true, c2 = true, u2 = this;
          ["append", "delete", "set"].forEach(function(e3) {
            var t5 = o2[e3];
            o2[e3] = function() {
              t5.apply(o2, arguments), l2 && (c2 = false, u2.search = o2.toString(), c2 = true);
            };
          }), Object.defineProperty(this, "searchParams", { value: o2, enumerable: true });
          var h2 = void 0;
          Object.defineProperty(this, "_updateSearchParams", { enumerable: false, configurable: false, writable: false, value: function() {
            this.search !== h2 && (h2 = this.search, c2 && (l2 = false, this.searchParams._fromString(this.search), l2 = true));
          } });
        }, s2 = i2.prototype;
        ["hash", "host", "hostname", "port", "protocol"].forEach(function(e3) {
          !function(e4) {
            Object.defineProperty(s2, e4, { get: function() {
              return this._anchorElement[e4];
            }, set: function(t4) {
              this._anchorElement[e4] = t4;
            }, enumerable: true });
          }(e3);
        }), Object.defineProperty(s2, "search", { get: function() {
          return this._anchorElement.search;
        }, set: function(e3) {
          this._anchorElement.search = e3, this._updateSearchParams();
        }, enumerable: true }), Object.defineProperties(s2, { toString: { get: function() {
          var e3 = this;
          return function() {
            return e3.href;
          };
        } }, href: { get: function() {
          return this._anchorElement.href.replace(/\?$/, "");
        }, set: function(e3) {
          this._anchorElement.href = e3, this._updateSearchParams();
        }, enumerable: true }, pathname: { get: function() {
          return this._anchorElement.pathname.replace(/(^\/?)/, "/");
        }, set: function(e3) {
          this._anchorElement.pathname = e3;
        }, enumerable: true }, origin: { get: function() {
          var e3 = { "http:": 80, "https:": 443, "ftp:": 21 }[this._anchorElement.protocol], t4 = this._anchorElement.port != e3 && "" !== this._anchorElement.port;
          return this._anchorElement.protocol + "//" + this._anchorElement.hostname + (t4 ? ":" + this._anchorElement.port : "");
        }, enumerable: true }, password: { get: function() {
          return "";
        }, set: function(e3) {
        }, enumerable: true }, username: { get: function() {
          return "";
        }, set: function(e3) {
        }, enumerable: true } }), i2.createObjectURL = function(e3) {
          return t3.createObjectURL.apply(t3, arguments);
        }, i2.revokeObjectURL = function(e3) {
          return t3.revokeObjectURL.apply(t3, arguments);
        }, e2.URL = i2;
      }(), void 0 !== e2.location && !("origin" in e2.location)) {
        var t2 = function() {
          return e2.location.protocol + "//" + e2.location.hostname + (e2.location.port ? ":" + e2.location.port : "");
        };
        try {
          Object.defineProperty(e2.location, "origin", { get: t2, enumerable: true });
        } catch (i2) {
          setInterval(function() {
            e2.location.origin = t2();
          }, 100);
        }
      }
    }(void 0 !== e ? e : "undefined" != typeof window ? window : "undefined" != typeof self ? self : e);
    var r = { addCSS: true, thumbWidth: 15, watch: true };
    var o = function(e2) {
      return null != e2 ? e2.constructor : null;
    }, l = function(e2, t2) {
      return !!(e2 && t2 && e2 instanceof t2);
    }, c = function(e2) {
      return null == e2;
    }, u = function(e2) {
      return o(e2) === Object;
    }, h = function(e2) {
      return o(e2) === String;
    }, d = function(e2) {
      return Array.isArray(e2);
    }, m = function(e2) {
      return l(e2, NodeList);
    }, p = { nullOrUndefined: c, object: u, number: function(e2) {
      return o(e2) === Number && !Number.isNaN(e2);
    }, string: h, boolean: function(e2) {
      return o(e2) === Boolean;
    }, function: function(e2) {
      return o(e2) === Function;
    }, array: d, nodeList: m, element: function(e2) {
      return l(e2, Element);
    }, event: function(e2) {
      return l(e2, Event);
    }, empty: function(e2) {
      return c(e2) || (h(e2) || d(e2) || m(e2)) && !e2.length || u(e2) && !Object.keys(e2).length;
    } };
    function g(e2, t2) {
      if (1 > t2) {
        var i2 = function(e3) {
          var t3 = "".concat(e3).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
          return t3 ? Math.max(0, (t3[1] ? t3[1].length : 0) - (t3[2] ? +t3[2] : 0)) : 0;
        }(t2);
        return parseFloat(e2.toFixed(i2));
      }
      return Math.round(e2 / t2) * t2;
    }
    var f = function() {
      function e2(t2, i2) {
        (function(e3, t3) {
          if (!(e3 instanceof t3)) throw new TypeError("Cannot call a class as a function");
        })(this, e2), p.element(t2) ? this.element = t2 : p.string(t2) && (this.element = document.querySelector(t2)), p.element(this.element) && p.empty(this.element.rangeTouch) && (this.config = a({}, r, {}, i2), this.init());
      }
      return function(e3, t2, s2) {
        t2 && i(e3.prototype, t2), s2 && i(e3, s2);
      }(e2, [{ key: "init", value: function() {
        e2.enabled && (this.config.addCSS && (this.element.style.userSelect = "none", this.element.style.webKitUserSelect = "none", this.element.style.touchAction = "manipulation"), this.listeners(true), this.element.rangeTouch = this);
      } }, { key: "destroy", value: function() {
        e2.enabled && (this.config.addCSS && (this.element.style.userSelect = "", this.element.style.webKitUserSelect = "", this.element.style.touchAction = ""), this.listeners(false), this.element.rangeTouch = null);
      } }, { key: "listeners", value: function(e3) {
        var t2 = this, i2 = e3 ? "addEventListener" : "removeEventListener";
        ["touchstart", "touchmove", "touchend"].forEach(function(e4) {
          t2.element[i2](e4, function(e5) {
            return t2.set(e5);
          }, false);
        });
      } }, { key: "get", value: function(t2) {
        if (!e2.enabled || !p.event(t2)) return null;
        var i2, s2 = t2.target, n2 = t2.changedTouches[0], a2 = parseFloat(s2.getAttribute("min")) || 0, r2 = parseFloat(s2.getAttribute("max")) || 100, o2 = parseFloat(s2.getAttribute("step")) || 1, l2 = s2.getBoundingClientRect(), c2 = 100 / l2.width * (this.config.thumbWidth / 2) / 100;
        return 0 > (i2 = 100 / l2.width * (n2.clientX - l2.left)) ? i2 = 0 : 100 < i2 && (i2 = 100), 50 > i2 ? i2 -= (100 - 2 * i2) * c2 : 50 < i2 && (i2 += 2 * (i2 - 50) * c2), a2 + g(i2 / 100 * (r2 - a2), o2);
      } }, { key: "set", value: function(t2) {
        e2.enabled && p.event(t2) && !t2.target.disabled && (t2.preventDefault(), t2.target.value = this.get(t2), function(e3, t3) {
          if (e3 && t3) {
            var i2 = new Event(t3, { bubbles: true });
            e3.dispatchEvent(i2);
          }
        }(t2.target, "touchend" === t2.type ? "change" : "input"));
      } }], [{ key: "setup", value: function(t2) {
        var i2 = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {}, s2 = null;
        if (p.empty(t2) || p.string(t2) ? s2 = Array.from(document.querySelectorAll(p.string(t2) ? t2 : 'input[type="range"]')) : p.element(t2) ? s2 = [t2] : p.nodeList(t2) ? s2 = Array.from(t2) : p.array(t2) && (s2 = t2.filter(p.element)), p.empty(s2)) return null;
        var n2 = a({}, r, {}, i2);
        if (p.string(t2) && n2.watch) {
          var o2 = new MutationObserver(function(i3) {
            Array.from(i3).forEach(function(i4) {
              Array.from(i4.addedNodes).forEach(function(i5) {
                p.element(i5) && function(e3, t3) {
                  return function() {
                    return Array.from(document.querySelectorAll(t3)).includes(this);
                  }.call(e3, t3);
                }(i5, t2) && new e2(i5, n2);
              });
            });
          });
          o2.observe(document.body, { childList: true, subtree: true });
        }
        return s2.map(function(t3) {
          return new e2(t3, i2);
        });
      } }, { key: "enabled", get: function() {
        return "ontouchstart" in document.documentElement;
      } }]), e2;
    }();
    const y = (e2) => null != e2 ? e2.constructor : null, b = (e2, t2) => Boolean(e2 && t2 && e2 instanceof t2), v = (e2) => null == e2, w = (e2) => y(e2) === Object, T = (e2) => y(e2) === String, k = (e2) => "function" == typeof e2, E = (e2) => Array.isArray(e2), C = (e2) => b(e2, NodeList), S = (e2) => v(e2) || (T(e2) || E(e2) || C(e2)) && !e2.length || w(e2) && !Object.keys(e2).length;
    var A = { nullOrUndefined: v, object: w, number: (e2) => y(e2) === Number && !Number.isNaN(e2), string: T, boolean: (e2) => y(e2) === Boolean, function: k, array: E, weakMap: (e2) => b(e2, WeakMap), nodeList: C, element: (e2) => null !== e2 && "object" == typeof e2 && 1 === e2.nodeType && "object" == typeof e2.style && "object" == typeof e2.ownerDocument, textNode: (e2) => y(e2) === Text, event: (e2) => b(e2, Event), keyboardEvent: (e2) => b(e2, KeyboardEvent), cue: (e2) => b(e2, window.TextTrackCue) || b(e2, window.VTTCue), track: (e2) => b(e2, TextTrack) || !v(e2) && T(e2.kind), promise: (e2) => b(e2, Promise) && k(e2.then), url: (e2) => {
      if (b(e2, window.URL)) return true;
      if (!T(e2)) return false;
      let t2 = e2;
      e2.startsWith("http://") && e2.startsWith("https://") || (t2 = `http://${e2}`);
      try {
        return !S(new URL(t2).hostname);
      } catch (e3) {
        return false;
      }
    }, empty: S };
    const P = (() => {
      const e2 = document.createElement("span"), t2 = { WebkitTransition: "webkitTransitionEnd", MozTransition: "transitionend", OTransition: "oTransitionEnd otransitionend", transition: "transitionend" }, i2 = Object.keys(t2).find((t3) => void 0 !== e2.style[t3]);
      return !!A.string(i2) && t2[i2];
    })();
    function M(e2, t2) {
      setTimeout(() => {
        try {
          e2.hidden = true, e2.offsetHeight, e2.hidden = false;
        } catch (e3) {
        }
      }, t2);
    }
    var x = { isIE: Boolean(window.document.documentMode), isEdge: /Edge/g.test(navigator.userAgent), isWebKit: "WebkitAppearance" in document.documentElement.style && !/Edge/g.test(navigator.userAgent), isIPhone: /iPhone|iPod/gi.test(navigator.userAgent) && navigator.maxTouchPoints > 1, isIPadOS: "MacIntel" === navigator.platform && navigator.maxTouchPoints > 1, isIos: /iPad|iPhone|iPod/gi.test(navigator.userAgent) && navigator.maxTouchPoints > 1 };
    function L(e2, t2) {
      return t2.split(".").reduce((e3, t3) => e3 && e3[t3], e2);
    }
    function N(e2 = {}, ...t2) {
      if (!t2.length) return e2;
      const i2 = t2.shift();
      return A.object(i2) ? (Object.keys(i2).forEach((t3) => {
        A.object(i2[t3]) ? (Object.keys(e2).includes(t3) || Object.assign(e2, { [t3]: {} }), N(e2[t3], i2[t3])) : Object.assign(e2, { [t3]: i2[t3] });
      }), N(e2, ...t2)) : e2;
    }
    function _(e2, t2) {
      const i2 = e2.length ? e2 : [e2];
      Array.from(i2).reverse().forEach((e3, i3) => {
        const s2 = i3 > 0 ? t2.cloneNode(true) : t2, n2 = e3.parentNode, a2 = e3.nextSibling;
        s2.appendChild(e3), a2 ? n2.insertBefore(s2, a2) : n2.appendChild(s2);
      });
    }
    function I(e2, t2) {
      A.element(e2) && !A.empty(t2) && Object.entries(t2).filter(([, e3]) => !A.nullOrUndefined(e3)).forEach(([t3, i2]) => e2.setAttribute(t3, i2));
    }
    function O(e2, t2, i2) {
      const s2 = document.createElement(e2);
      return A.object(t2) && I(s2, t2), A.string(i2) && (s2.innerText = i2), s2;
    }
    function $(e2, t2, i2, s2) {
      A.element(t2) && t2.appendChild(O(e2, i2, s2));
    }
    function j(e2) {
      A.nodeList(e2) || A.array(e2) ? Array.from(e2).forEach(j) : A.element(e2) && A.element(e2.parentNode) && e2.parentNode.removeChild(e2);
    }
    function R(e2) {
      if (!A.element(e2)) return;
      let { length: t2 } = e2.childNodes;
      for (; t2 > 0; ) e2.removeChild(e2.lastChild), t2 -= 1;
    }
    function D(e2, t2) {
      return A.element(t2) && A.element(t2.parentNode) && A.element(e2) ? (t2.parentNode.replaceChild(e2, t2), e2) : null;
    }
    function q(e2, t2) {
      if (!A.string(e2) || A.empty(e2)) return {};
      const i2 = {}, s2 = N({}, t2);
      return e2.split(",").forEach((e3) => {
        const t3 = e3.trim(), n2 = t3.replace(".", ""), a2 = t3.replace(/[[\]]/g, "").split("="), [r2] = a2, o2 = a2.length > 1 ? a2[1].replace(/["']/g, "") : "";
        switch (t3.charAt(0)) {
          case ".":
            A.string(s2.class) ? i2.class = `${s2.class} ${n2}` : i2.class = n2;
            break;
          case "#":
            i2.id = t3.replace("#", "");
            break;
          case "[":
            i2[r2] = o2;
        }
      }), N(s2, i2);
    }
    function H(e2, t2) {
      if (!A.element(e2)) return;
      let i2 = t2;
      A.boolean(i2) || (i2 = !e2.hidden), e2.hidden = i2;
    }
    function F(e2, t2, i2) {
      if (A.nodeList(e2)) return Array.from(e2).map((e3) => F(e3, t2, i2));
      if (A.element(e2)) {
        let s2 = "toggle";
        return void 0 !== i2 && (s2 = i2 ? "add" : "remove"), e2.classList[s2](t2), e2.classList.contains(t2);
      }
      return false;
    }
    function U(e2, t2) {
      return A.element(e2) && e2.classList.contains(t2);
    }
    function V(e2, t2) {
      const { prototype: i2 } = Element;
      return (i2.matches || i2.webkitMatchesSelector || i2.mozMatchesSelector || i2.msMatchesSelector || function() {
        return Array.from(document.querySelectorAll(t2)).includes(this);
      }).call(e2, t2);
    }
    function B(e2) {
      return this.elements.container.querySelectorAll(e2);
    }
    function W(e2) {
      return this.elements.container.querySelector(e2);
    }
    function z(e2 = null, t2 = false) {
      A.element(e2) && e2.focus({ preventScroll: true, focusVisible: t2 });
    }
    const K = { "audio/ogg": "vorbis", "audio/wav": "1", "video/webm": "vp8, vorbis", "video/mp4": "avc1.42E01E, mp4a.40.2", "video/ogg": "theora" }, Y = { audio: "canPlayType" in document.createElement("audio"), video: "canPlayType" in document.createElement("video"), check(e2, t2) {
      const i2 = Y[e2] || "html5" !== t2;
      return { api: i2, ui: i2 && Y.rangeInput };
    }, pip: !(x.isIPhone || !A.function(O("video").webkitSetPresentationMode) && (!document.pictureInPictureEnabled || O("video").disablePictureInPicture)), airplay: A.function(window.WebKitPlaybackTargetAvailabilityEvent), playsinline: "playsInline" in document.createElement("video"), mime(e2) {
      if (A.empty(e2)) return false;
      const [t2] = e2.split("/");
      let i2 = e2;
      if (!this.isHTML5 || t2 !== this.type) return false;
      Object.keys(K).includes(i2) && (i2 += `; codecs="${K[e2]}"`);
      try {
        return Boolean(i2 && this.media.canPlayType(i2).replace(/no/, ""));
      } catch (e3) {
        return false;
      }
    }, textTracks: "textTracks" in document.createElement("video"), rangeInput: (() => {
      const e2 = document.createElement("input");
      return e2.type = "range", "range" === e2.type;
    })(), touch: "ontouchstart" in document.documentElement, transitions: false !== P, reducedMotion: "matchMedia" in window && window.matchMedia("(prefers-reduced-motion)").matches }, Q = (() => {
      let e2 = false;
      try {
        const t2 = Object.defineProperty({}, "passive", { get: () => (e2 = true, null) });
        window.addEventListener("test", null, t2), window.removeEventListener("test", null, t2);
      } catch (e3) {
      }
      return e2;
    })();
    function X(e2, t2, i2, s2 = false, n2 = true, a2 = false) {
      if (!e2 || !("addEventListener" in e2) || A.empty(t2) || !A.function(i2)) return;
      const r2 = t2.split(" ");
      let o2 = a2;
      Q && (o2 = { passive: n2, capture: a2 }), r2.forEach((t3) => {
        this && this.eventListeners && s2 && this.eventListeners.push({ element: e2, type: t3, callback: i2, options: o2 }), e2[s2 ? "addEventListener" : "removeEventListener"](t3, i2, o2);
      });
    }
    function J(e2, t2 = "", i2, s2 = true, n2 = false) {
      X.call(this, e2, t2, i2, true, s2, n2);
    }
    function G(e2, t2 = "", i2, s2 = true, n2 = false) {
      X.call(this, e2, t2, i2, false, s2, n2);
    }
    function Z(e2, t2 = "", i2, s2 = true, n2 = false) {
      const a2 = (...r2) => {
        G(e2, t2, a2, s2, n2), i2.apply(this, r2);
      };
      X.call(this, e2, t2, a2, true, s2, n2);
    }
    function ee(e2, t2 = "", i2 = false, s2 = {}) {
      if (!A.element(e2) || A.empty(t2)) return;
      const n2 = new CustomEvent(t2, { bubbles: i2, detail: __spreadProps(__spreadValues({}, s2), { plyr: this }) });
      e2.dispatchEvent(n2);
    }
    function te() {
      this && this.eventListeners && (this.eventListeners.forEach((e2) => {
        const { element: t2, type: i2, callback: s2, options: n2 } = e2;
        t2.removeEventListener(i2, s2, n2);
      }), this.eventListeners = []);
    }
    function ie() {
      return new Promise((e2) => this.ready ? setTimeout(e2, 0) : J.call(this, this.elements.container, "ready", e2)).then(() => {
      });
    }
    function se(e2) {
      A.promise(e2) && e2.then(null, () => {
      });
    }
    function ne(e2) {
      return A.array(e2) ? e2.filter((t2, i2) => e2.indexOf(t2) === i2) : e2;
    }
    function ae(e2, t2) {
      return A.array(e2) && e2.length ? e2.reduce((e3, i2) => Math.abs(i2 - t2) < Math.abs(e3 - t2) ? i2 : e3) : null;
    }
    function re(e2) {
      return !(!window || !window.CSS) && window.CSS.supports(e2);
    }
    const oe = [[1, 1], [4, 3], [3, 4], [5, 4], [4, 5], [3, 2], [2, 3], [16, 10], [10, 16], [16, 9], [9, 16], [21, 9], [9, 21], [32, 9], [9, 32]].reduce((e2, [t2, i2]) => __spreadProps(__spreadValues({}, e2), { [t2 / i2]: [t2, i2] }), {});
    function le(e2) {
      if (!(A.array(e2) || A.string(e2) && e2.includes(":"))) return false;
      return (A.array(e2) ? e2 : e2.split(":")).map(Number).every(A.number);
    }
    function ce(e2) {
      if (!A.array(e2) || !e2.every(A.number)) return null;
      const [t2, i2] = e2, s2 = (e3, t3) => 0 === t3 ? e3 : s2(t3, e3 % t3), n2 = s2(t2, i2);
      return [t2 / n2, i2 / n2];
    }
    function ue(e2) {
      const t2 = (e3) => le(e3) ? e3.split(":").map(Number) : null;
      let i2 = t2(e2);
      if (null === i2 && (i2 = t2(this.config.ratio)), null === i2 && !A.empty(this.embed) && A.array(this.embed.ratio) && ({ ratio: i2 } = this.embed), null === i2 && this.isHTML5) {
        const { videoWidth: e3, videoHeight: t3 } = this.media;
        i2 = [e3, t3];
      }
      return ce(i2);
    }
    function he(e2) {
      if (!this.isVideo) return {};
      const { wrapper: t2 } = this.elements, i2 = ue.call(this, e2);
      if (!A.array(i2)) return {};
      const [s2, n2] = ce(i2), a2 = 100 / s2 * n2;
      if (re(`aspect-ratio: ${s2}/${n2}`) ? t2.style.aspectRatio = `${s2}/${n2}` : t2.style.paddingBottom = `${a2}%`, this.isVimeo && !this.config.vimeo.premium && this.supported.ui) {
        const e3 = 100 / this.media.offsetWidth * parseInt(window.getComputedStyle(this.media).paddingBottom, 10), i3 = (e3 - a2) / (e3 / 50);
        this.fullscreen.active ? t2.style.paddingBottom = null : this.media.style.transform = `translateY(-${i3}%)`;
      } else this.isHTML5 && t2.classList.add(this.config.classNames.videoFixedRatio);
      return { padding: a2, ratio: i2 };
    }
    function de(e2, t2, i2 = 0.05) {
      const s2 = e2 / t2, n2 = ae(Object.keys(oe), s2);
      return Math.abs(n2 - s2) <= i2 ? oe[n2] : [e2, t2];
    }
    const me = { getSources() {
      if (!this.isHTML5) return [];
      return Array.from(this.media.querySelectorAll("source")).filter((e2) => {
        const t2 = e2.getAttribute("type");
        return !!A.empty(t2) || Y.mime.call(this, t2);
      });
    }, getQualityOptions() {
      return this.config.quality.forced ? this.config.quality.options : me.getSources.call(this).map((e2) => Number(e2.getAttribute("size"))).filter(Boolean);
    }, setup() {
      if (!this.isHTML5) return;
      const e2 = this;
      e2.options.speed = e2.config.speed.options, A.empty(this.config.ratio) || he.call(e2), Object.defineProperty(e2.media, "quality", { get() {
        const t2 = me.getSources.call(e2).find((t3) => t3.getAttribute("src") === e2.source);
        return t2 && Number(t2.getAttribute("size"));
      }, set(t2) {
        if (e2.quality !== t2) {
          if (e2.config.quality.forced && A.function(e2.config.quality.onChange)) e2.config.quality.onChange(t2);
          else {
            const i2 = me.getSources.call(e2).find((e3) => Number(e3.getAttribute("size")) === t2);
            if (!i2) return;
            const { currentTime: s2, paused: n2, preload: a2, readyState: r2, playbackRate: o2 } = e2.media;
            e2.media.src = i2.getAttribute("src"), ("none" !== a2 || r2) && (e2.once("loadedmetadata", () => {
              e2.speed = o2, e2.currentTime = s2, n2 || se(e2.play());
            }), e2.media.load());
          }
          ee.call(e2, e2.media, "qualitychange", false, { quality: t2 });
        }
      } });
    }, cancelRequests() {
      this.isHTML5 && (j(me.getSources.call(this)), this.media.setAttribute("src", this.config.blankVideo), this.media.load(), this.debug.log("Cancelled network requests"));
    } };
    function pe(e2, ...t2) {
      return A.empty(e2) ? e2 : e2.toString().replace(/{(\d+)}/g, (e3, i2) => t2[i2].toString());
    }
    const ge = (e2 = "", t2 = "", i2 = "") => e2.replace(new RegExp(t2.toString().replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1"), "g"), i2.toString()), fe = (e2 = "") => e2.toString().replace(/\w\S*/g, (e3) => e3.charAt(0).toUpperCase() + e3.slice(1).toLowerCase());
    function ye(e2 = "") {
      let t2 = e2.toString();
      return t2 = function(e3 = "") {
        let t3 = e3.toString();
        return t3 = ge(t3, "-", " "), t3 = ge(t3, "_", " "), t3 = fe(t3), ge(t3, " ", "");
      }(t2), t2.charAt(0).toLowerCase() + t2.slice(1);
    }
    function be(e2) {
      const t2 = document.createElement("div");
      return t2.appendChild(e2), t2.innerHTML;
    }
    const ve = { pip: "PIP", airplay: "AirPlay", html5: "HTML5", vimeo: "Vimeo", youtube: "YouTube" }, we = { get(e2 = "", t2 = {}) {
      if (A.empty(e2) || A.empty(t2)) return "";
      let i2 = L(t2.i18n, e2);
      if (A.empty(i2)) return Object.keys(ve).includes(e2) ? ve[e2] : "";
      const s2 = { "{seektime}": t2.seekTime, "{title}": t2.title };
      return Object.entries(s2).forEach(([e3, t3]) => {
        i2 = ge(i2, e3, t3);
      }), i2;
    } };
    class Te {
      constructor(e2) {
        t(this, "get", (e3) => {
          if (!Te.supported || !this.enabled) return null;
          const t2 = window.localStorage.getItem(this.key);
          if (A.empty(t2)) return null;
          const i2 = JSON.parse(t2);
          return A.string(e3) && e3.length ? i2[e3] : i2;
        }), t(this, "set", (e3) => {
          if (!Te.supported || !this.enabled) return;
          if (!A.object(e3)) return;
          let t2 = this.get();
          A.empty(t2) && (t2 = {}), N(t2, e3);
          try {
            window.localStorage.setItem(this.key, JSON.stringify(t2));
          } catch (e4) {
          }
        }), this.enabled = e2.config.storage.enabled, this.key = e2.config.storage.key;
      }
      static get supported() {
        try {
          if (!("localStorage" in window)) return false;
          const e2 = "___test";
          return window.localStorage.setItem(e2, e2), window.localStorage.removeItem(e2), true;
        } catch (e2) {
          return false;
        }
      }
    }
    function ke(e2, t2 = "text") {
      return new Promise((i2, s2) => {
        try {
          const s3 = new XMLHttpRequest();
          if (!("withCredentials" in s3)) return;
          s3.addEventListener("load", () => {
            if ("text" === t2) try {
              i2(JSON.parse(s3.responseText));
            } catch (e3) {
              i2(s3.responseText);
            }
            else i2(s3.response);
          }), s3.addEventListener("error", () => {
            throw new Error(s3.status);
          }), s3.open("GET", e2, true), s3.responseType = t2, s3.send();
        } catch (e3) {
          s2(e3);
        }
      });
    }
    function Ee(e2, t2) {
      if (!A.string(e2)) return;
      const i2 = "cache", s2 = A.string(t2);
      let n2 = false;
      const a2 = () => null !== document.getElementById(t2), r2 = (e3, t3) => {
        e3.innerHTML = t3, s2 && a2() || document.body.insertAdjacentElement("afterbegin", e3);
      };
      if (!s2 || !a2()) {
        const a3 = Te.supported, o2 = document.createElement("div");
        if (o2.setAttribute("hidden", ""), s2 && o2.setAttribute("id", t2), a3) {
          const e3 = window.localStorage.getItem(`${i2}-${t2}`);
          if (n2 = null !== e3, n2) {
            const t3 = JSON.parse(e3);
            r2(o2, t3.content);
          }
        }
        ke(e2).then((e3) => {
          if (!A.empty(e3)) {
            if (a3) try {
              window.localStorage.setItem(`${i2}-${t2}`, JSON.stringify({ content: e3 }));
            } catch (e4) {
            }
            r2(o2, e3);
          }
        }).catch(() => {
        });
      }
    }
    const Ce = (e2) => Math.trunc(e2 / 60 / 60 % 60, 10), Se = (e2) => Math.trunc(e2 / 60 % 60, 10), Ae = (e2) => Math.trunc(e2 % 60, 10);
    function Pe(e2 = 0, t2 = false, i2 = false) {
      if (!A.number(e2)) return Pe(void 0, t2, i2);
      const s2 = (e3) => `0${e3}`.slice(-2);
      let n2 = Ce(e2);
      const a2 = Se(e2), r2 = Ae(e2);
      return n2 = t2 || n2 > 0 ? `${n2}:` : "", `${i2 && e2 > 0 ? "-" : ""}${n2}${s2(a2)}:${s2(r2)}`;
    }
    const Me = { getIconUrl() {
      const e2 = new URL(this.config.iconUrl, window.location), t2 = window.location.host ? window.location.host : window.top.location.host, i2 = e2.host !== t2 || x.isIE && !window.svg4everybody;
      return { url: this.config.iconUrl, cors: i2 };
    }, findElements() {
      try {
        return this.elements.controls = W.call(this, this.config.selectors.controls.wrapper), this.elements.buttons = { play: B.call(this, this.config.selectors.buttons.play), pause: W.call(this, this.config.selectors.buttons.pause), restart: W.call(this, this.config.selectors.buttons.restart), rewind: W.call(this, this.config.selectors.buttons.rewind), fastForward: W.call(this, this.config.selectors.buttons.fastForward), mute: W.call(this, this.config.selectors.buttons.mute), pip: W.call(this, this.config.selectors.buttons.pip), airplay: W.call(this, this.config.selectors.buttons.airplay), settings: W.call(this, this.config.selectors.buttons.settings), captions: W.call(this, this.config.selectors.buttons.captions), fullscreen: W.call(this, this.config.selectors.buttons.fullscreen) }, this.elements.progress = W.call(this, this.config.selectors.progress), this.elements.inputs = { seek: W.call(this, this.config.selectors.inputs.seek), volume: W.call(this, this.config.selectors.inputs.volume) }, this.elements.display = { buffer: W.call(this, this.config.selectors.display.buffer), currentTime: W.call(this, this.config.selectors.display.currentTime), duration: W.call(this, this.config.selectors.display.duration) }, A.element(this.elements.progress) && (this.elements.display.seekTooltip = this.elements.progress.querySelector(`.${this.config.classNames.tooltip}`)), true;
      } catch (e2) {
        return this.debug.warn("It looks like there is a problem with your custom controls HTML", e2), this.toggleNativeControls(true), false;
      }
    }, createIcon(e2, t2) {
      const i2 = "http://www.w3.org/2000/svg", s2 = Me.getIconUrl.call(this), n2 = `${s2.cors ? "" : s2.url}#${this.config.iconPrefix}`, a2 = document.createElementNS(i2, "svg");
      I(a2, N(t2, { "aria-hidden": "true", focusable: "false" }));
      const r2 = document.createElementNS(i2, "use"), o2 = `${n2}-${e2}`;
      return "href" in r2 && r2.setAttributeNS("http://www.w3.org/1999/xlink", "href", o2), r2.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", o2), a2.appendChild(r2), a2;
    }, createLabel(e2, t2 = {}) {
      const i2 = we.get(e2, this.config);
      return O("span", __spreadProps(__spreadValues({}, t2), { class: [t2.class, this.config.classNames.hidden].filter(Boolean).join(" ") }), i2);
    }, createBadge(e2) {
      if (A.empty(e2)) return null;
      const t2 = O("span", { class: this.config.classNames.menu.value });
      return t2.appendChild(O("span", { class: this.config.classNames.menu.badge }, e2)), t2;
    }, createButton(e2, t2) {
      const i2 = N({}, t2);
      let s2 = ye(e2);
      const n2 = { element: "button", toggle: false, label: null, icon: null, labelPressed: null, iconPressed: null };
      switch (["element", "icon", "label"].forEach((e3) => {
        Object.keys(i2).includes(e3) && (n2[e3] = i2[e3], delete i2[e3]);
      }), "button" !== n2.element || Object.keys(i2).includes("type") || (i2.type = "button"), Object.keys(i2).includes("class") ? i2.class.split(" ").some((e3) => e3 === this.config.classNames.control) || N(i2, { class: `${i2.class} ${this.config.classNames.control}` }) : i2.class = this.config.classNames.control, e2) {
        case "play":
          n2.toggle = true, n2.label = "play", n2.labelPressed = "pause", n2.icon = "play", n2.iconPressed = "pause";
          break;
        case "mute":
          n2.toggle = true, n2.label = "mute", n2.labelPressed = "unmute", n2.icon = "volume", n2.iconPressed = "muted";
          break;
        case "captions":
          n2.toggle = true, n2.label = "enableCaptions", n2.labelPressed = "disableCaptions", n2.icon = "captions-off", n2.iconPressed = "captions-on";
          break;
        case "fullscreen":
          n2.toggle = true, n2.label = "enterFullscreen", n2.labelPressed = "exitFullscreen", n2.icon = "enter-fullscreen", n2.iconPressed = "exit-fullscreen";
          break;
        case "play-large":
          i2.class += ` ${this.config.classNames.control}--overlaid`, s2 = "play", n2.label = "play", n2.icon = "play";
          break;
        default:
          A.empty(n2.label) && (n2.label = s2), A.empty(n2.icon) && (n2.icon = e2);
      }
      const a2 = O(n2.element);
      return n2.toggle ? (a2.appendChild(Me.createIcon.call(this, n2.iconPressed, { class: "icon--pressed" })), a2.appendChild(Me.createIcon.call(this, n2.icon, { class: "icon--not-pressed" })), a2.appendChild(Me.createLabel.call(this, n2.labelPressed, { class: "label--pressed" })), a2.appendChild(Me.createLabel.call(this, n2.label, { class: "label--not-pressed" }))) : (a2.appendChild(Me.createIcon.call(this, n2.icon)), a2.appendChild(Me.createLabel.call(this, n2.label))), N(i2, q(this.config.selectors.buttons[s2], i2)), I(a2, i2), "play" === s2 ? (A.array(this.elements.buttons[s2]) || (this.elements.buttons[s2] = []), this.elements.buttons[s2].push(a2)) : this.elements.buttons[s2] = a2, a2;
    }, createRange(e2, t2) {
      const i2 = O("input", N(q(this.config.selectors.inputs[e2]), { type: "range", min: 0, max: 100, step: 0.01, value: 0, autocomplete: "off", role: "slider", "aria-label": we.get(e2, this.config), "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": 0 }, t2));
      return this.elements.inputs[e2] = i2, Me.updateRangeFill.call(this, i2), f.setup(i2), i2;
    }, createProgress(e2, t2) {
      const i2 = O("progress", N(q(this.config.selectors.display[e2]), { min: 0, max: 100, value: 0, role: "progressbar", "aria-hidden": true }, t2));
      if ("volume" !== e2) {
        i2.appendChild(O("span", null, "0"));
        const t3 = { played: "played", buffer: "buffered" }[e2], s2 = t3 ? we.get(t3, this.config) : "";
        i2.innerText = `% ${s2.toLowerCase()}`;
      }
      return this.elements.display[e2] = i2, i2;
    }, createTime(e2, t2) {
      const i2 = q(this.config.selectors.display[e2], t2), s2 = O("div", N(i2, { class: `${i2.class ? i2.class : ""} ${this.config.classNames.display.time} `.trim(), "aria-label": we.get(e2, this.config), role: "timer" }), "00:00");
      return this.elements.display[e2] = s2, s2;
    }, bindMenuItemShortcuts(e2, t2) {
      J.call(this, e2, "keydown keyup", (i2) => {
        if (![" ", "ArrowUp", "ArrowDown", "ArrowRight"].includes(i2.key)) return;
        if (i2.preventDefault(), i2.stopPropagation(), "keydown" === i2.type) return;
        const s2 = V(e2, '[role="menuitemradio"]');
        if (!s2 && [" ", "ArrowRight"].includes(i2.key)) Me.showMenuPanel.call(this, t2, true);
        else {
          let t3;
          " " !== i2.key && ("ArrowDown" === i2.key || s2 && "ArrowRight" === i2.key ? (t3 = e2.nextElementSibling, A.element(t3) || (t3 = e2.parentNode.firstElementChild)) : (t3 = e2.previousElementSibling, A.element(t3) || (t3 = e2.parentNode.lastElementChild)), z.call(this, t3, true));
        }
      }, false), J.call(this, e2, "keyup", (e3) => {
        "Return" === e3.key && Me.focusFirstMenuItem.call(this, null, true);
      });
    }, createMenuItem({ value: e2, list: t2, type: i2, title: s2, badge: n2 = null, checked: a2 = false }) {
      const r2 = q(this.config.selectors.inputs[i2]), o2 = O("button", N(r2, { type: "button", role: "menuitemradio", class: `${this.config.classNames.control} ${r2.class ? r2.class : ""}`.trim(), "aria-checked": a2, value: e2 })), l2 = O("span");
      l2.innerHTML = s2, A.element(n2) && l2.appendChild(n2), o2.appendChild(l2), Object.defineProperty(o2, "checked", { enumerable: true, get: () => "true" === o2.getAttribute("aria-checked"), set(e3) {
        e3 && Array.from(o2.parentNode.children).filter((e4) => V(e4, '[role="menuitemradio"]')).forEach((e4) => e4.setAttribute("aria-checked", "false")), o2.setAttribute("aria-checked", e3 ? "true" : "false");
      } }), this.listeners.bind(o2, "click keyup", (t3) => {
        if (!A.keyboardEvent(t3) || " " === t3.key) {
          switch (t3.preventDefault(), t3.stopPropagation(), o2.checked = true, i2) {
            case "language":
              this.currentTrack = Number(e2);
              break;
            case "quality":
              this.quality = e2;
              break;
            case "speed":
              this.speed = parseFloat(e2);
          }
          Me.showMenuPanel.call(this, "home", A.keyboardEvent(t3));
        }
      }, i2, false), Me.bindMenuItemShortcuts.call(this, o2, i2), t2.appendChild(o2);
    }, formatTime(e2 = 0, t2 = false) {
      if (!A.number(e2)) return e2;
      return Pe(e2, Ce(this.duration) > 0, t2);
    }, updateTimeDisplay(e2 = null, t2 = 0, i2 = false) {
      A.element(e2) && A.number(t2) && (e2.innerText = Me.formatTime(t2, i2));
    }, updateVolume() {
      this.supported.ui && (A.element(this.elements.inputs.volume) && Me.setRange.call(this, this.elements.inputs.volume, this.muted ? 0 : this.volume), A.element(this.elements.buttons.mute) && (this.elements.buttons.mute.pressed = this.muted || 0 === this.volume));
    }, setRange(e2, t2 = 0) {
      A.element(e2) && (e2.value = t2, Me.updateRangeFill.call(this, e2));
    }, updateProgress(e2) {
      if (!this.supported.ui || !A.event(e2)) return;
      let t2 = 0;
      const i2 = (e3, t3) => {
        const i3 = A.number(t3) ? t3 : 0, s3 = A.element(e3) ? e3 : this.elements.display.buffer;
        if (A.element(s3)) {
          s3.value = i3;
          const e4 = s3.getElementsByTagName("span")[0];
          A.element(e4) && (e4.childNodes[0].nodeValue = i3);
        }
      };
      if (e2) switch (e2.type) {
        case "timeupdate":
        case "seeking":
        case "seeked":
          s2 = this.currentTime, n2 = this.duration, t2 = 0 === s2 || 0 === n2 || Number.isNaN(s2) || Number.isNaN(n2) ? 0 : (s2 / n2 * 100).toFixed(2), "timeupdate" === e2.type && Me.setRange.call(this, this.elements.inputs.seek, t2);
          break;
        case "playing":
        case "progress":
          i2(this.elements.display.buffer, 100 * this.buffered);
      }
      var s2, n2;
    }, updateRangeFill(e2) {
      const t2 = A.event(e2) ? e2.target : e2;
      if (A.element(t2) && "range" === t2.getAttribute("type")) {
        if (V(t2, this.config.selectors.inputs.seek)) {
          t2.setAttribute("aria-valuenow", this.currentTime);
          const e3 = Me.formatTime(this.currentTime), i2 = Me.formatTime(this.duration), s2 = we.get("seekLabel", this.config);
          t2.setAttribute("aria-valuetext", s2.replace("{currentTime}", e3).replace("{duration}", i2));
        } else if (V(t2, this.config.selectors.inputs.volume)) {
          const e3 = 100 * t2.value;
          t2.setAttribute("aria-valuenow", e3), t2.setAttribute("aria-valuetext", `${e3.toFixed(1)}%`);
        } else t2.setAttribute("aria-valuenow", t2.value);
        (x.isWebKit || x.isIPadOS) && t2.style.setProperty("--value", t2.value / t2.max * 100 + "%");
      }
    }, updateSeekTooltip(e2) {
      var t2, i2;
      if (!this.config.tooltips.seek || !A.element(this.elements.inputs.seek) || !A.element(this.elements.display.seekTooltip) || 0 === this.duration) return;
      const s2 = this.elements.display.seekTooltip, n2 = `${this.config.classNames.tooltip}--visible`, a2 = (e3) => F(s2, n2, e3);
      if (this.touch) return void a2(false);
      let r2 = 0;
      const o2 = this.elements.progress.getBoundingClientRect();
      if (A.event(e2)) r2 = 100 / o2.width * (e2.pageX - o2.left);
      else {
        if (!U(s2, n2)) return;
        r2 = parseFloat(s2.style.left, 10);
      }
      r2 < 0 ? r2 = 0 : r2 > 100 && (r2 = 100);
      const l2 = this.duration / 100 * r2;
      s2.innerText = Me.formatTime(l2);
      const c2 = null === (t2 = this.config.markers) || void 0 === t2 || null === (i2 = t2.points) || void 0 === i2 ? void 0 : i2.find(({ time: e3 }) => e3 === Math.round(l2));
      c2 && s2.insertAdjacentHTML("afterbegin", `${c2.label}<br>`), s2.style.left = `${r2}%`, A.event(e2) && ["mouseenter", "mouseleave"].includes(e2.type) && a2("mouseenter" === e2.type);
    }, timeUpdate(e2) {
      const t2 = !A.element(this.elements.display.duration) && this.config.invertTime;
      Me.updateTimeDisplay.call(this, this.elements.display.currentTime, t2 ? this.duration - this.currentTime : this.currentTime, t2), e2 && "timeupdate" === e2.type && this.media.seeking || Me.updateProgress.call(this, e2);
    }, durationUpdate() {
      if (!this.supported.ui || !this.config.invertTime && this.currentTime) return;
      if (this.duration >= __pow(2, 32)) return H(this.elements.display.currentTime, true), void H(this.elements.progress, true);
      A.element(this.elements.inputs.seek) && this.elements.inputs.seek.setAttribute("aria-valuemax", this.duration);
      const e2 = A.element(this.elements.display.duration);
      !e2 && this.config.displayDuration && this.paused && Me.updateTimeDisplay.call(this, this.elements.display.currentTime, this.duration), e2 && Me.updateTimeDisplay.call(this, this.elements.display.duration, this.duration), this.config.markers.enabled && Me.setMarkers.call(this), Me.updateSeekTooltip.call(this);
    }, toggleMenuButton(e2, t2) {
      H(this.elements.settings.buttons[e2], !t2);
    }, updateSetting(e2, t2, i2) {
      const s2 = this.elements.settings.panels[e2];
      let n2 = null, a2 = t2;
      if ("captions" === e2) n2 = this.currentTrack;
      else {
        if (n2 = A.empty(i2) ? this[e2] : i2, A.empty(n2) && (n2 = this.config[e2].default), !A.empty(this.options[e2]) && !this.options[e2].includes(n2)) return void this.debug.warn(`Unsupported value of '${n2}' for ${e2}`);
        if (!this.config[e2].options.includes(n2)) return void this.debug.warn(`Disabled value of '${n2}' for ${e2}`);
      }
      if (A.element(a2) || (a2 = s2 && s2.querySelector('[role="menu"]')), !A.element(a2)) return;
      this.elements.settings.buttons[e2].querySelector(`.${this.config.classNames.menu.value}`).innerHTML = Me.getLabel.call(this, e2, n2);
      const r2 = a2 && a2.querySelector(`[value="${n2}"]`);
      A.element(r2) && (r2.checked = true);
    }, getLabel(e2, t2) {
      switch (e2) {
        case "speed":
          return 1 === t2 ? we.get("normal", this.config) : `${t2}&times;`;
        case "quality":
          if (A.number(t2)) {
            const e3 = we.get(`qualityLabel.${t2}`, this.config);
            return e3.length ? e3 : `${t2}p`;
          }
          return fe(t2);
        case "captions":
          return Ne.getLabel.call(this);
        default:
          return null;
      }
    }, setQualityMenu(e2) {
      if (!A.element(this.elements.settings.panels.quality)) return;
      const t2 = "quality", i2 = this.elements.settings.panels.quality.querySelector('[role="menu"]');
      A.array(e2) && (this.options.quality = ne(e2).filter((e3) => this.config.quality.options.includes(e3)));
      const s2 = !A.empty(this.options.quality) && this.options.quality.length > 1;
      if (Me.toggleMenuButton.call(this, t2, s2), R(i2), Me.checkMenu.call(this), !s2) return;
      const n2 = (e3) => {
        const t3 = we.get(`qualityBadge.${e3}`, this.config);
        return t3.length ? Me.createBadge.call(this, t3) : null;
      };
      this.options.quality.sort((e3, t3) => {
        const i3 = this.config.quality.options;
        return i3.indexOf(e3) > i3.indexOf(t3) ? 1 : -1;
      }).forEach((e3) => {
        Me.createMenuItem.call(this, { value: e3, list: i2, type: t2, title: Me.getLabel.call(this, "quality", e3), badge: n2(e3) });
      }), Me.updateSetting.call(this, t2, i2);
    }, setCaptionsMenu() {
      if (!A.element(this.elements.settings.panels.captions)) return;
      const e2 = "captions", t2 = this.elements.settings.panels.captions.querySelector('[role="menu"]'), i2 = Ne.getTracks.call(this), s2 = Boolean(i2.length);
      if (Me.toggleMenuButton.call(this, e2, s2), R(t2), Me.checkMenu.call(this), !s2) return;
      const n2 = i2.map((e3, i3) => ({ value: i3, checked: this.captions.toggled && this.currentTrack === i3, title: Ne.getLabel.call(this, e3), badge: e3.language && Me.createBadge.call(this, e3.language.toUpperCase()), list: t2, type: "language" }));
      n2.unshift({ value: -1, checked: !this.captions.toggled, title: we.get("disabled", this.config), list: t2, type: "language" }), n2.forEach(Me.createMenuItem.bind(this)), Me.updateSetting.call(this, e2, t2);
    }, setSpeedMenu() {
      if (!A.element(this.elements.settings.panels.speed)) return;
      const e2 = "speed", t2 = this.elements.settings.panels.speed.querySelector('[role="menu"]');
      this.options.speed = this.options.speed.filter((e3) => e3 >= this.minimumSpeed && e3 <= this.maximumSpeed);
      const i2 = !A.empty(this.options.speed) && this.options.speed.length > 1;
      Me.toggleMenuButton.call(this, e2, i2), R(t2), Me.checkMenu.call(this), i2 && (this.options.speed.forEach((i3) => {
        Me.createMenuItem.call(this, { value: i3, list: t2, type: e2, title: Me.getLabel.call(this, "speed", i3) });
      }), Me.updateSetting.call(this, e2, t2));
    }, checkMenu() {
      const { buttons: e2 } = this.elements.settings, t2 = !A.empty(e2) && Object.values(e2).some((e3) => !e3.hidden);
      H(this.elements.settings.menu, !t2);
    }, focusFirstMenuItem(e2, t2 = false) {
      if (this.elements.settings.popup.hidden) return;
      let i2 = e2;
      A.element(i2) || (i2 = Object.values(this.elements.settings.panels).find((e3) => !e3.hidden));
      const s2 = i2.querySelector('[role^="menuitem"]');
      z.call(this, s2, t2);
    }, toggleMenu(e2) {
      const { popup: t2 } = this.elements.settings, i2 = this.elements.buttons.settings;
      if (!A.element(t2) || !A.element(i2)) return;
      const { hidden: s2 } = t2;
      let n2 = s2;
      if (A.boolean(e2)) n2 = e2;
      else if (A.keyboardEvent(e2) && "Escape" === e2.key) n2 = false;
      else if (A.event(e2)) {
        const s3 = A.function(e2.composedPath) ? e2.composedPath()[0] : e2.target, a2 = t2.contains(s3);
        if (a2 || !a2 && e2.target !== i2 && n2) return;
      }
      i2.setAttribute("aria-expanded", n2), H(t2, !n2), F(this.elements.container, this.config.classNames.menu.open, n2), n2 && A.keyboardEvent(e2) ? Me.focusFirstMenuItem.call(this, null, true) : n2 || s2 || z.call(this, i2, A.keyboardEvent(e2));
    }, getMenuSize(e2) {
      const t2 = e2.cloneNode(true);
      t2.style.position = "absolute", t2.style.opacity = 0, t2.removeAttribute("hidden"), e2.parentNode.appendChild(t2);
      const i2 = t2.scrollWidth, s2 = t2.scrollHeight;
      return j(t2), { width: i2, height: s2 };
    }, showMenuPanel(e2 = "", t2 = false) {
      const i2 = this.elements.container.querySelector(`#plyr-settings-${this.id}-${e2}`);
      if (!A.element(i2)) return;
      const s2 = i2.parentNode, n2 = Array.from(s2.children).find((e3) => !e3.hidden);
      if (Y.transitions && !Y.reducedMotion) {
        s2.style.width = `${n2.scrollWidth}px`, s2.style.height = `${n2.scrollHeight}px`;
        const e3 = Me.getMenuSize.call(this, i2), t3 = (e4) => {
          e4.target === s2 && ["width", "height"].includes(e4.propertyName) && (s2.style.width = "", s2.style.height = "", G.call(this, s2, P, t3));
        };
        J.call(this, s2, P, t3), s2.style.width = `${e3.width}px`, s2.style.height = `${e3.height}px`;
      }
      H(n2, true), H(i2, false), Me.focusFirstMenuItem.call(this, i2, t2);
    }, setDownloadUrl() {
      const e2 = this.elements.buttons.download;
      A.element(e2) && e2.setAttribute("href", this.download);
    }, create(e2) {
      const { bindMenuItemShortcuts: t2, createButton: i2, createProgress: s2, createRange: n2, createTime: a2, setQualityMenu: r2, setSpeedMenu: o2, showMenuPanel: l2 } = Me;
      this.elements.controls = null, A.array(this.config.controls) && this.config.controls.includes("play-large") && this.elements.container.appendChild(i2.call(this, "play-large"));
      const c2 = O("div", q(this.config.selectors.controls.wrapper));
      this.elements.controls = c2;
      const u2 = { class: "plyr__controls__item" };
      return ne(A.array(this.config.controls) ? this.config.controls : []).forEach((r3) => {
        if ("restart" === r3 && c2.appendChild(i2.call(this, "restart", u2)), "rewind" === r3 && c2.appendChild(i2.call(this, "rewind", u2)), "play" === r3 && c2.appendChild(i2.call(this, "play", u2)), "fast-forward" === r3 && c2.appendChild(i2.call(this, "fast-forward", u2)), "progress" === r3) {
          const t3 = O("div", { class: `${u2.class} plyr__progress__container` }), i3 = O("div", q(this.config.selectors.progress));
          if (i3.appendChild(n2.call(this, "seek", { id: `plyr-seek-${e2.id}` })), i3.appendChild(s2.call(this, "buffer")), this.config.tooltips.seek) {
            const e3 = O("span", { class: this.config.classNames.tooltip }, "00:00");
            i3.appendChild(e3), this.elements.display.seekTooltip = e3;
          }
          this.elements.progress = i3, t3.appendChild(this.elements.progress), c2.appendChild(t3);
        }
        if ("current-time" === r3 && c2.appendChild(a2.call(this, "currentTime", u2)), "duration" === r3 && c2.appendChild(a2.call(this, "duration", u2)), "mute" === r3 || "volume" === r3) {
          let { volume: t3 } = this.elements;
          if (A.element(t3) && c2.contains(t3) || (t3 = O("div", N({}, u2, { class: `${u2.class} plyr__volume`.trim() })), this.elements.volume = t3, c2.appendChild(t3)), "mute" === r3 && t3.appendChild(i2.call(this, "mute")), "volume" === r3 && !x.isIos && !x.isIPadOS) {
            const i3 = { max: 1, step: 0.05, value: this.config.volume };
            t3.appendChild(n2.call(this, "volume", N(i3, { id: `plyr-volume-${e2.id}` })));
          }
        }
        if ("captions" === r3 && c2.appendChild(i2.call(this, "captions", u2)), "settings" === r3 && !A.empty(this.config.settings)) {
          const s3 = O("div", N({}, u2, { class: `${u2.class} plyr__menu`.trim(), hidden: "" }));
          s3.appendChild(i2.call(this, "settings", { "aria-haspopup": true, "aria-controls": `plyr-settings-${e2.id}`, "aria-expanded": false }));
          const n3 = O("div", { class: "plyr__menu__container", id: `plyr-settings-${e2.id}`, hidden: "" }), a3 = O("div"), r4 = O("div", { id: `plyr-settings-${e2.id}-home` }), o3 = O("div", { role: "menu" });
          r4.appendChild(o3), a3.appendChild(r4), this.elements.settings.panels.home = r4, this.config.settings.forEach((i3) => {
            const s4 = O("button", N(q(this.config.selectors.buttons.settings), { type: "button", class: `${this.config.classNames.control} ${this.config.classNames.control}--forward`, role: "menuitem", "aria-haspopup": true, hidden: "" }));
            t2.call(this, s4, i3), J.call(this, s4, "click", () => {
              l2.call(this, i3, false);
            });
            const n4 = O("span", null, we.get(i3, this.config)), r5 = O("span", { class: this.config.classNames.menu.value });
            r5.innerHTML = e2[i3], n4.appendChild(r5), s4.appendChild(n4), o3.appendChild(s4);
            const c3 = O("div", { id: `plyr-settings-${e2.id}-${i3}`, hidden: "" }), u3 = O("button", { type: "button", class: `${this.config.classNames.control} ${this.config.classNames.control}--back` });
            u3.appendChild(O("span", { "aria-hidden": true }, we.get(i3, this.config))), u3.appendChild(O("span", { class: this.config.classNames.hidden }, we.get("menuBack", this.config))), J.call(this, c3, "keydown", (e3) => {
              "ArrowLeft" === e3.key && (e3.preventDefault(), e3.stopPropagation(), l2.call(this, "home", true));
            }, false), J.call(this, u3, "click", () => {
              l2.call(this, "home", false);
            }), c3.appendChild(u3), c3.appendChild(O("div", { role: "menu" })), a3.appendChild(c3), this.elements.settings.buttons[i3] = s4, this.elements.settings.panels[i3] = c3;
          }), n3.appendChild(a3), s3.appendChild(n3), c2.appendChild(s3), this.elements.settings.popup = n3, this.elements.settings.menu = s3;
        }
        if ("pip" === r3 && Y.pip && c2.appendChild(i2.call(this, "pip", u2)), "airplay" === r3 && Y.airplay && c2.appendChild(i2.call(this, "airplay", u2)), "download" === r3) {
          const e3 = N({}, u2, { element: "a", href: this.download, target: "_blank" });
          this.isHTML5 && (e3.download = "");
          const { download: t3 } = this.config.urls;
          !A.url(t3) && this.isEmbed && N(e3, { icon: `logo-${this.provider}`, label: this.provider }), c2.appendChild(i2.call(this, "download", e3));
        }
        "fullscreen" === r3 && c2.appendChild(i2.call(this, "fullscreen", u2));
      }), this.isHTML5 && r2.call(this, me.getQualityOptions.call(this)), o2.call(this), c2;
    }, inject() {
      if (this.config.loadSprite) {
        const e3 = Me.getIconUrl.call(this);
        e3.cors && Ee(e3.url, "sprite-plyr");
      }
      this.id = Math.floor(1e4 * Math.random());
      let e2 = null;
      this.elements.controls = null;
      const t2 = { id: this.id, seektime: this.config.seekTime, title: this.config.title };
      let i2 = true;
      A.function(this.config.controls) && (this.config.controls = this.config.controls.call(this, t2)), this.config.controls || (this.config.controls = []), A.element(this.config.controls) || A.string(this.config.controls) ? e2 = this.config.controls : (e2 = Me.create.call(this, { id: this.id, seektime: this.config.seekTime, speed: this.speed, quality: this.quality, captions: Ne.getLabel.call(this) }), i2 = false);
      let s2;
      i2 && A.string(this.config.controls) && (e2 = ((e3) => {
        let i3 = e3;
        return Object.entries(t2).forEach(([e4, t3]) => {
          i3 = ge(i3, `{${e4}}`, t3);
        }), i3;
      })(e2)), A.string(this.config.selectors.controls.container) && (s2 = document.querySelector(this.config.selectors.controls.container)), A.element(s2) || (s2 = this.elements.container);
      if (s2[A.element(e2) ? "insertAdjacentElement" : "insertAdjacentHTML"]("afterbegin", e2), A.element(this.elements.controls) || Me.findElements.call(this), !A.empty(this.elements.buttons)) {
        const e3 = (e4) => {
          const t3 = this.config.classNames.controlPressed;
          e4.setAttribute("aria-pressed", "false"), Object.defineProperty(e4, "pressed", { configurable: true, enumerable: true, get: () => U(e4, t3), set(i3 = false) {
            F(e4, t3, i3), e4.setAttribute("aria-pressed", i3 ? "true" : "false");
          } });
        };
        Object.values(this.elements.buttons).filter(Boolean).forEach((t3) => {
          A.array(t3) || A.nodeList(t3) ? Array.from(t3).filter(Boolean).forEach(e3) : e3(t3);
        });
      }
      if (x.isEdge && M(s2), this.config.tooltips.controls) {
        const { classNames: e3, selectors: t3 } = this.config, i3 = `${t3.controls.wrapper} ${t3.labels} .${e3.hidden}`, s3 = B.call(this, i3);
        Array.from(s3).forEach((e4) => {
          F(e4, this.config.classNames.hidden, false), F(e4, this.config.classNames.tooltip, true);
        });
      }
    }, setMediaMetadata() {
      try {
        "mediaSession" in navigator && (navigator.mediaSession.metadata = new window.MediaMetadata({ title: this.config.mediaMetadata.title, artist: this.config.mediaMetadata.artist, album: this.config.mediaMetadata.album, artwork: this.config.mediaMetadata.artwork }));
      } catch (e2) {
      }
    }, setMarkers() {
      var e2, t2;
      if (!this.duration || this.elements.markers) return;
      const i2 = null === (e2 = this.config.markers) || void 0 === e2 || null === (t2 = e2.points) || void 0 === t2 ? void 0 : t2.filter(({ time: e3 }) => e3 > 0 && e3 < this.duration);
      if (null == i2 || !i2.length) return;
      const s2 = document.createDocumentFragment(), n2 = document.createDocumentFragment();
      let a2 = null;
      const r2 = `${this.config.classNames.tooltip}--visible`, o2 = (e3) => F(a2, r2, e3);
      i2.forEach((e3) => {
        const t3 = O("span", { class: this.config.classNames.marker }, ""), i3 = e3.time / this.duration * 100 + "%";
        a2 && (t3.addEventListener("mouseenter", () => {
          e3.label || (a2.style.left = i3, a2.innerHTML = e3.label, o2(true));
        }), t3.addEventListener("mouseleave", () => {
          o2(false);
        })), t3.addEventListener("click", () => {
          this.currentTime = e3.time;
        }), t3.style.left = i3, n2.appendChild(t3);
      }), s2.appendChild(n2), this.config.tooltips.seek || (a2 = O("span", { class: this.config.classNames.tooltip }, ""), s2.appendChild(a2)), this.elements.markers = { points: n2, tip: a2 }, this.elements.progress.appendChild(s2);
    } };
    function xe(e2, t2 = true) {
      let i2 = e2;
      if (t2) {
        const e3 = document.createElement("a");
        e3.href = i2, i2 = e3.href;
      }
      try {
        return new URL(i2);
      } catch (e3) {
        return null;
      }
    }
    function Le(e2) {
      const t2 = new URLSearchParams();
      return A.object(e2) && Object.entries(e2).forEach(([e3, i2]) => {
        t2.set(e3, i2);
      }), t2;
    }
    const Ne = { setup() {
      if (!this.supported.ui) return;
      if (!this.isVideo || this.isYouTube || this.isHTML5 && !Y.textTracks) return void (A.array(this.config.controls) && this.config.controls.includes("settings") && this.config.settings.includes("captions") && Me.setCaptionsMenu.call(this));
      var e2, t2;
      if (A.element(this.elements.captions) || (this.elements.captions = O("div", q(this.config.selectors.captions)), this.elements.captions.setAttribute("dir", "auto"), e2 = this.elements.captions, t2 = this.elements.wrapper, A.element(e2) && A.element(t2) && t2.parentNode.insertBefore(e2, t2.nextSibling)), x.isIE && window.URL) {
        const e3 = this.media.querySelectorAll("track");
        Array.from(e3).forEach((e4) => {
          const t3 = e4.getAttribute("src"), i3 = xe(t3);
          null !== i3 && i3.hostname !== window.location.href.hostname && ["http:", "https:"].includes(i3.protocol) && ke(t3, "blob").then((t4) => {
            e4.setAttribute("src", window.URL.createObjectURL(t4));
          }).catch(() => {
            j(e4);
          });
        });
      }
      const i2 = ne((navigator.languages || [navigator.language || navigator.userLanguage || "en"]).map((e3) => e3.split("-")[0]));
      let s2 = (this.storage.get("language") || this.config.captions.language || "auto").toLowerCase();
      "auto" === s2 && ([s2] = i2);
      let n2 = this.storage.get("captions");
      if (A.boolean(n2) || ({ active: n2 } = this.config.captions), Object.assign(this.captions, { toggled: false, active: n2, language: s2, languages: i2 }), this.isHTML5) {
        const e3 = this.config.captions.update ? "addtrack removetrack" : "removetrack";
        J.call(this, this.media.textTracks, e3, Ne.update.bind(this));
      }
      setTimeout(Ne.update.bind(this), 0);
    }, update() {
      const e2 = Ne.getTracks.call(this, true), { active: t2, language: i2, meta: s2, currentTrackNode: n2 } = this.captions, a2 = Boolean(e2.find((e3) => e3.language === i2));
      this.isHTML5 && this.isVideo && e2.filter((e3) => !s2.get(e3)).forEach((e3) => {
        this.debug.log("Track added", e3), s2.set(e3, { default: "showing" === e3.mode }), "showing" === e3.mode && (e3.mode = "hidden"), J.call(this, e3, "cuechange", () => Ne.updateCues.call(this));
      }), (a2 && this.language !== i2 || !e2.includes(n2)) && (Ne.setLanguage.call(this, i2), Ne.toggle.call(this, t2 && a2)), this.elements && F(this.elements.container, this.config.classNames.captions.enabled, !A.empty(e2)), A.array(this.config.controls) && this.config.controls.includes("settings") && this.config.settings.includes("captions") && Me.setCaptionsMenu.call(this);
    }, toggle(e2, t2 = true) {
      if (!this.supported.ui) return;
      const { toggled: i2 } = this.captions, s2 = this.config.classNames.captions.active, n2 = A.nullOrUndefined(e2) ? !i2 : e2;
      if (n2 !== i2) {
        if (t2 || (this.captions.active = n2, this.storage.set({ captions: n2 })), !this.language && n2 && !t2) {
          const e3 = Ne.getTracks.call(this), t3 = Ne.findTrack.call(this, [this.captions.language, ...this.captions.languages], true);
          return this.captions.language = t3.language, void Ne.set.call(this, e3.indexOf(t3));
        }
        this.elements.buttons.captions && (this.elements.buttons.captions.pressed = n2), F(this.elements.container, s2, n2), this.captions.toggled = n2, Me.updateSetting.call(this, "captions"), ee.call(this, this.media, n2 ? "captionsenabled" : "captionsdisabled");
      }
      setTimeout(() => {
        n2 && this.captions.toggled && (this.captions.currentTrackNode.mode = "hidden");
      });
    }, set(e2, t2 = true) {
      const i2 = Ne.getTracks.call(this);
      if (-1 !== e2) if (A.number(e2)) if (e2 in i2) {
        if (this.captions.currentTrack !== e2) {
          this.captions.currentTrack = e2;
          const s2 = i2[e2], { language: n2 } = s2 || {};
          this.captions.currentTrackNode = s2, Me.updateSetting.call(this, "captions"), t2 || (this.captions.language = n2, this.storage.set({ language: n2 })), this.isVimeo && this.embed.enableTextTrack(n2), ee.call(this, this.media, "languagechange");
        }
        Ne.toggle.call(this, true, t2), this.isHTML5 && this.isVideo && Ne.updateCues.call(this);
      } else this.debug.warn("Track not found", e2);
      else this.debug.warn("Invalid caption argument", e2);
      else Ne.toggle.call(this, false, t2);
    }, setLanguage(e2, t2 = true) {
      if (!A.string(e2)) return void this.debug.warn("Invalid language argument", e2);
      const i2 = e2.toLowerCase();
      this.captions.language = i2;
      const s2 = Ne.getTracks.call(this), n2 = Ne.findTrack.call(this, [i2]);
      Ne.set.call(this, s2.indexOf(n2), t2);
    }, getTracks(e2 = false) {
      return Array.from((this.media || {}).textTracks || []).filter((t2) => !this.isHTML5 || e2 || this.captions.meta.has(t2)).filter((e3) => ["captions", "subtitles"].includes(e3.kind));
    }, findTrack(e2, t2 = false) {
      const i2 = Ne.getTracks.call(this), s2 = (e3) => Number((this.captions.meta.get(e3) || {}).default), n2 = Array.from(i2).sort((e3, t3) => s2(t3) - s2(e3));
      let a2;
      return e2.every((e3) => (a2 = n2.find((t3) => t3.language === e3), !a2)), a2 || (t2 ? n2[0] : void 0);
    }, getCurrentTrack() {
      return Ne.getTracks.call(this)[this.currentTrack];
    }, getLabel(e2) {
      let t2 = e2;
      return !A.track(t2) && Y.textTracks && this.captions.toggled && (t2 = Ne.getCurrentTrack.call(this)), A.track(t2) ? A.empty(t2.label) ? A.empty(t2.language) ? we.get("enabled", this.config) : e2.language.toUpperCase() : t2.label : we.get("disabled", this.config);
    }, updateCues(e2) {
      if (!this.supported.ui) return;
      if (!A.element(this.elements.captions)) return void this.debug.warn("No captions element to render to");
      if (!A.nullOrUndefined(e2) && !Array.isArray(e2)) return void this.debug.warn("updateCues: Invalid input", e2);
      let t2 = e2;
      if (!t2) {
        const e3 = Ne.getCurrentTrack.call(this);
        t2 = Array.from((e3 || {}).activeCues || []).map((e4) => e4.getCueAsHTML()).map(be);
      }
      const i2 = t2.map((e3) => e3.trim()).join("\n");
      if (i2 !== this.elements.captions.innerHTML) {
        R(this.elements.captions);
        const e3 = O("span", q(this.config.selectors.caption));
        e3.innerHTML = i2, this.elements.captions.appendChild(e3), ee.call(this, this.media, "cuechange");
      }
    } }, _e = { enabled: true, title: "", debug: false, autoplay: false, autopause: true, playsinline: true, seekTime: 10, volume: 1, muted: false, duration: null, displayDuration: true, invertTime: true, toggleInvert: true, ratio: null, clickToPlay: true, hideControls: true, resetOnEnd: false, disableContextMenu: true, loadSprite: true, iconPrefix: "plyr", iconUrl: "https://cdn.plyr.io/3.7.8/plyr.svg", blankVideo: "https://cdn.plyr.io/static/blank.mp4", quality: { default: 576, options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240], forced: false, onChange: null }, loop: { active: false }, speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 4] }, keyboard: { focused: true, global: false }, tooltips: { controls: false, seek: true }, captions: { active: false, language: "auto", update: false }, fullscreen: { enabled: true, fallback: true, iosNative: false }, storage: { enabled: true, key: "plyr" }, controls: ["play-large", "play", "progress", "current-time", "mute", "volume", "captions", "settings", "pip", "airplay", "fullscreen"], settings: ["captions", "quality", "speed"], i18n: { restart: "Restart", rewind: "Rewind {seektime}s", play: "Play", pause: "Pause", fastForward: "Forward {seektime}s", seek: "Seek", seekLabel: "{currentTime} of {duration}", played: "Played", buffered: "Buffered", currentTime: "Current time", duration: "Duration", volume: "Volume", mute: "Mute", unmute: "Unmute", enableCaptions: "Enable captions", disableCaptions: "Disable captions", download: "Download", enterFullscreen: "Fullscreen", exitFullscreen: "Exit fullscreen", frameTitle: "Player for {title}", captions: "Captions", settings: "Settings", pip: "Pop-up", menuBack: "Go back to previous menu", speed: "Speed", normal: "Normal", quality: "Quality", loop: "Loop", start: "Start", end: "End", all: "All", reset: "Reset", disabled: "Disabled", enabled: "Enabled", advertisement: "Ad", qualityBadge: { 2160: "4K", 1440: "HD", 1080: "HD", 720: "HD", 576: "SD", 480: "SD" } }, urls: { download: null, vimeo: { sdk: "https://player.vimeo.com/api/player.js", iframe: "https://player.vimeo.com/video/{0}?{1}", api: "https://vimeo.com/api/oembed.json?url={0}" }, youtube: { sdk: "https://www.youtube.com/iframe_api", api: "https://noembed.com/embed?url=https://www.youtube.com/watch?v={0}" }, googleIMA: { sdk: "https://imasdk.googleapis.com/js/sdkloader/ima3.js" } }, listeners: { seek: null, play: null, pause: null, restart: null, rewind: null, fastForward: null, mute: null, volume: null, captions: null, download: null, fullscreen: null, pip: null, airplay: null, speed: null, quality: null, loop: null, language: null }, events: ["ended", "progress", "stalled", "playing", "waiting", "canplay", "canplaythrough", "loadstart", "loadeddata", "loadedmetadata", "timeupdate", "volumechange", "play", "pause", "error", "seeking", "seeked", "emptied", "ratechange", "cuechange", "download", "enterfullscreen", "exitfullscreen", "captionsenabled", "captionsdisabled", "languagechange", "controlshidden", "controlsshown", "ready", "statechange", "qualitychange", "adsloaded", "adscontentpause", "adscontentresume", "adstarted", "adsmidpoint", "adscomplete", "adsallcomplete", "adsimpression", "adsclick"], selectors: { editable: "input, textarea, select, [contenteditable]", container: ".plyr", controls: { container: null, wrapper: ".plyr__controls" }, labels: "[data-plyr]", buttons: { play: '[data-plyr="play"]', pause: '[data-plyr="pause"]', restart: '[data-plyr="restart"]', rewind: '[data-plyr="rewind"]', fastForward: '[data-plyr="fast-forward"]', mute: '[data-plyr="mute"]', captions: '[data-plyr="captions"]', download: '[data-plyr="download"]', fullscreen: '[data-plyr="fullscreen"]', pip: '[data-plyr="pip"]', airplay: '[data-plyr="airplay"]', settings: '[data-plyr="settings"]', loop: '[data-plyr="loop"]' }, inputs: { seek: '[data-plyr="seek"]', volume: '[data-plyr="volume"]', speed: '[data-plyr="speed"]', language: '[data-plyr="language"]', quality: '[data-plyr="quality"]' }, display: { currentTime: ".plyr__time--current", duration: ".plyr__time--duration", buffer: ".plyr__progress__buffer", loop: ".plyr__progress__loop", volume: ".plyr__volume--display" }, progress: ".plyr__progress", captions: ".plyr__captions", caption: ".plyr__caption" }, classNames: { type: "plyr--{0}", provider: "plyr--{0}", video: "plyr__video-wrapper", embed: "plyr__video-embed", videoFixedRatio: "plyr__video-wrapper--fixed-ratio", embedContainer: "plyr__video-embed__container", poster: "plyr__poster", posterEnabled: "plyr__poster-enabled", ads: "plyr__ads", control: "plyr__control", controlPressed: "plyr__control--pressed", playing: "plyr--playing", paused: "plyr--paused", stopped: "plyr--stopped", loading: "plyr--loading", hover: "plyr--hover", tooltip: "plyr__tooltip", cues: "plyr__cues", marker: "plyr__progress__marker", hidden: "plyr__sr-only", hideControls: "plyr--hide-controls", isTouch: "plyr--is-touch", uiSupported: "plyr--full-ui", noTransition: "plyr--no-transition", display: { time: "plyr__time" }, menu: { value: "plyr__menu__value", badge: "plyr__badge", open: "plyr--menu-open" }, captions: { enabled: "plyr--captions-enabled", active: "plyr--captions-active" }, fullscreen: { enabled: "plyr--fullscreen-enabled", fallback: "plyr--fullscreen-fallback" }, pip: { supported: "plyr--pip-supported", active: "plyr--pip-active" }, airplay: { supported: "plyr--airplay-supported", active: "plyr--airplay-active" }, posterThumbnails: { thumbContainer: "plyr__preview-thumb", thumbContainerShown: "plyr__preview-thumb--is-shown", imageContainer: "plyr__preview-thumb__image-container", timeContainer: "plyr__preview-thumb__time-container", scrubbingContainer: "plyr__preview-scrubbing", scrubbingContainerShown: "plyr__preview-scrubbing--is-shown" } }, attributes: { embed: { provider: "data-plyr-provider", id: "data-plyr-embed-id", hash: "data-plyr-embed-hash" } }, ads: { enabled: false, publisherId: "", tagUrl: "" }, posterThumbnails: { enabled: false, src: "" }, vimeo: { byline: false, portrait: false, title: false, speed: true, transparent: false, customControls: true, referrerPolicy: null, premium: false }, youtube: { rel: 0, showinfo: 0, iv_load_policy: 3, modestbranding: 1, customControls: true, noCookie: false }, mediaMetadata: { title: "", artist: "", album: "", artwork: [] }, markers: { enabled: false, points: [] } }, Ie = "picture-in-picture", Oe = "inline", $e = { html5: "html5", youtube: "youtube", vimeo: "vimeo" }, je = "audio", Re = "video";
    const De = () => {
    };
    class qe {
      constructor(e2 = false) {
        this.enabled = window.console && e2, this.enabled && this.log("Debugging enabled");
      }
      get log() {
        return this.enabled ? Function.prototype.bind.call(console.log, console) : De;
      }
      get warn() {
        return this.enabled ? Function.prototype.bind.call(console.warn, console) : De;
      }
      get error() {
        return this.enabled ? Function.prototype.bind.call(console.error, console) : De;
      }
    }
    class He {
      constructor(e2) {
        t(this, "onChange", () => {
          if (!this.supported) return;
          const e3 = this.player.elements.buttons.fullscreen;
          A.element(e3) && (e3.pressed = this.active);
          const t2 = this.target === this.player.media ? this.target : this.player.elements.container;
          ee.call(this.player, t2, this.active ? "enterfullscreen" : "exitfullscreen", true);
        }), t(this, "toggleFallback", (e3 = false) => {
          var _a, _b;
          if (e3 ? this.scrollPosition = { x: (_a = window.scrollX) != null ? _a : 0, y: (_b = window.scrollY) != null ? _b : 0 } : window.scrollTo(this.scrollPosition.x, this.scrollPosition.y), document.body.style.overflow = e3 ? "hidden" : "", F(this.target, this.player.config.classNames.fullscreen.fallback, e3), x.isIos) {
            let t2 = document.head.querySelector('meta[name="viewport"]');
            const i2 = "viewport-fit=cover";
            t2 || (t2 = document.createElement("meta"), t2.setAttribute("name", "viewport"));
            const s2 = A.string(t2.content) && t2.content.includes(i2);
            e3 ? (this.cleanupViewport = !s2, s2 || (t2.content += `,${i2}`)) : this.cleanupViewport && (t2.content = t2.content.split(",").filter((e4) => e4.trim() !== i2).join(","));
          }
          this.onChange();
        }), t(this, "trapFocus", (e3) => {
          if (x.isIos || x.isIPadOS || !this.active || "Tab" !== e3.key) return;
          const t2 = document.activeElement, i2 = B.call(this.player, "a[href], button:not(:disabled), input:not(:disabled), [tabindex]"), [s2] = i2, n2 = i2[i2.length - 1];
          t2 !== n2 || e3.shiftKey ? t2 === s2 && e3.shiftKey && (n2.focus(), e3.preventDefault()) : (s2.focus(), e3.preventDefault());
        }), t(this, "update", () => {
          if (this.supported) {
            let e3;
            e3 = this.forceFallback ? "Fallback (forced)" : He.nativeSupported ? "Native" : "Fallback", this.player.debug.log(`${e3} fullscreen enabled`);
          } else this.player.debug.log("Fullscreen not supported and fallback disabled");
          F(this.player.elements.container, this.player.config.classNames.fullscreen.enabled, this.supported);
        }), t(this, "enter", () => {
          this.supported && (x.isIos && this.player.config.fullscreen.iosNative ? this.player.isVimeo ? this.player.embed.requestFullscreen() : this.target.webkitEnterFullscreen() : !He.nativeSupported || this.forceFallback ? this.toggleFallback(true) : this.prefix ? A.empty(this.prefix) || this.target[`${this.prefix}Request${this.property}`]() : this.target.requestFullscreen({ navigationUI: "hide" }));
        }), t(this, "exit", () => {
          if (this.supported) if (x.isIos && this.player.config.fullscreen.iosNative) this.player.isVimeo ? this.player.embed.exitFullscreen() : this.target.webkitEnterFullscreen(), se(this.player.play());
          else if (!He.nativeSupported || this.forceFallback) this.toggleFallback(false);
          else if (this.prefix) {
            if (!A.empty(this.prefix)) {
              const e3 = "moz" === this.prefix ? "Cancel" : "Exit";
              document[`${this.prefix}${e3}${this.property}`]();
            }
          } else (document.cancelFullScreen || document.exitFullscreen).call(document);
        }), t(this, "toggle", () => {
          this.active ? this.exit() : this.enter();
        }), this.player = e2, this.prefix = He.prefix, this.property = He.property, this.scrollPosition = { x: 0, y: 0 }, this.forceFallback = "force" === e2.config.fullscreen.fallback, this.player.elements.fullscreen = e2.config.fullscreen.container && function(e3, t2) {
          const { prototype: i2 } = Element;
          return (i2.closest || function() {
            let e4 = this;
            do {
              if (V.matches(e4, t2)) return e4;
              e4 = e4.parentElement || e4.parentNode;
            } while (null !== e4 && 1 === e4.nodeType);
            return null;
          }).call(e3, t2);
        }(this.player.elements.container, e2.config.fullscreen.container), J.call(this.player, document, "ms" === this.prefix ? "MSFullscreenChange" : `${this.prefix}fullscreenchange`, () => {
          this.onChange();
        }), J.call(this.player, this.player.elements.container, "dblclick", (e3) => {
          A.element(this.player.elements.controls) && this.player.elements.controls.contains(e3.target) || this.player.listeners.proxy(e3, this.toggle, "fullscreen");
        }), J.call(this, this.player.elements.container, "keydown", (e3) => this.trapFocus(e3)), this.update();
      }
      static get nativeSupported() {
        return !!(document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled);
      }
      get useNative() {
        return He.nativeSupported && !this.forceFallback;
      }
      static get prefix() {
        if (A.function(document.exitFullscreen)) return "";
        let e2 = "";
        return ["webkit", "moz", "ms"].some((t2) => !(!A.function(document[`${t2}ExitFullscreen`]) && !A.function(document[`${t2}CancelFullScreen`])) && (e2 = t2, true)), e2;
      }
      static get property() {
        return "moz" === this.prefix ? "FullScreen" : "Fullscreen";
      }
      get supported() {
        return [this.player.config.fullscreen.enabled, this.player.isVideo, He.nativeSupported || this.player.config.fullscreen.fallback, !this.player.isYouTube || He.nativeSupported || !x.isIos || this.player.config.playsinline && !this.player.config.fullscreen.iosNative].every(Boolean);
      }
      get active() {
        if (!this.supported) return false;
        if (!He.nativeSupported || this.forceFallback) return U(this.target, this.player.config.classNames.fullscreen.fallback);
        const e2 = this.prefix ? this.target.getRootNode()[`${this.prefix}${this.property}Element`] : this.target.getRootNode().fullscreenElement;
        return e2 && e2.shadowRoot ? e2 === this.target.getRootNode().host : e2 === this.target;
      }
      get target() {
        var _a;
        return x.isIos && this.player.config.fullscreen.iosNative ? this.player.media : (_a = this.player.elements.fullscreen) != null ? _a : this.player.elements.container;
      }
    }
    function Fe(e2, t2 = 1) {
      return new Promise((i2, s2) => {
        const n2 = new Image(), a2 = () => {
          delete n2.onload, delete n2.onerror, (n2.naturalWidth >= t2 ? i2 : s2)(n2);
        };
        Object.assign(n2, { onload: a2, onerror: a2, src: e2 });
      });
    }
    const Ue = { addStyleHook() {
      F(this.elements.container, this.config.selectors.container.replace(".", ""), true), F(this.elements.container, this.config.classNames.uiSupported, this.supported.ui);
    }, toggleNativeControls(e2 = false) {
      e2 && this.isHTML5 ? this.media.setAttribute("controls", "") : this.media.removeAttribute("controls");
    }, build() {
      if (this.listeners.media(), !this.supported.ui) return this.debug.warn(`Basic support only for ${this.provider} ${this.type}`), void Ue.toggleNativeControls.call(this, true);
      A.element(this.elements.controls) || (Me.inject.call(this), this.listeners.controls()), Ue.toggleNativeControls.call(this), this.isHTML5 && Ne.setup.call(this), this.volume = null, this.muted = null, this.loop = null, this.quality = null, this.speed = null, Me.updateVolume.call(this), Me.timeUpdate.call(this), Me.durationUpdate.call(this), Ue.checkPlaying.call(this), F(this.elements.container, this.config.classNames.pip.supported, Y.pip && this.isHTML5 && this.isVideo), F(this.elements.container, this.config.classNames.airplay.supported, Y.airplay && this.isHTML5), F(this.elements.container, this.config.classNames.isTouch, this.touch), this.ready = true, setTimeout(() => {
        ee.call(this, this.media, "ready");
      }, 0), Ue.setTitle.call(this), this.poster && Ue.setPoster.call(this, this.poster, false).catch(() => {
      }), this.config.duration && Me.durationUpdate.call(this), this.config.mediaMetadata && Me.setMediaMetadata.call(this);
    }, setTitle() {
      let e2 = we.get("play", this.config);
      if (A.string(this.config.title) && !A.empty(this.config.title) && (e2 += `, ${this.config.title}`), Array.from(this.elements.buttons.play || []).forEach((t2) => {
        t2.setAttribute("aria-label", e2);
      }), this.isEmbed) {
        const e3 = W.call(this, "iframe");
        if (!A.element(e3)) return;
        const t2 = A.empty(this.config.title) ? "video" : this.config.title, i2 = we.get("frameTitle", this.config);
        e3.setAttribute("title", i2.replace("{title}", t2));
      }
    }, togglePoster(e2) {
      F(this.elements.container, this.config.classNames.posterEnabled, e2);
    }, setPoster(e2, t2 = true) {
      return t2 && this.poster ? Promise.reject(new Error("Poster already set")) : (this.media.setAttribute("data-poster", e2), this.elements.poster.removeAttribute("hidden"), ie.call(this).then(() => Fe(e2)).catch((t3) => {
        throw e2 === this.poster && Ue.togglePoster.call(this, false), t3;
      }).then(() => {
        if (e2 !== this.poster) throw new Error("setPoster cancelled by later call to setPoster");
      }).then(() => (Object.assign(this.elements.poster.style, { backgroundImage: `url('${e2}')`, backgroundSize: "" }), Ue.togglePoster.call(this, true), e2)));
    }, checkPlaying(e2) {
      F(this.elements.container, this.config.classNames.playing, this.playing), F(this.elements.container, this.config.classNames.paused, this.paused), F(this.elements.container, this.config.classNames.stopped, this.stopped), Array.from(this.elements.buttons.play || []).forEach((e3) => {
        Object.assign(e3, { pressed: this.playing }), e3.setAttribute("aria-label", we.get(this.playing ? "pause" : "play", this.config));
      }), A.event(e2) && "timeupdate" === e2.type || Ue.toggleControls.call(this);
    }, checkLoading(e2) {
      this.loading = ["stalled", "waiting"].includes(e2.type), clearTimeout(this.timers.loading), this.timers.loading = setTimeout(() => {
        F(this.elements.container, this.config.classNames.loading, this.loading), Ue.toggleControls.call(this);
      }, this.loading ? 250 : 0);
    }, toggleControls(e2) {
      const { controls: t2 } = this.elements;
      if (t2 && this.config.hideControls) {
        const i2 = this.touch && this.lastSeekTime + 2e3 > Date.now();
        this.toggleControls(Boolean(e2 || this.loading || this.paused || t2.pressed || t2.hover || i2));
      }
    }, migrateStyles() {
      Object.values(__spreadValues({}, this.media.style)).filter((e2) => !A.empty(e2) && A.string(e2) && e2.startsWith("--plyr")).forEach((e2) => {
        this.elements.container.style.setProperty(e2, this.media.style.getPropertyValue(e2)), this.media.style.removeProperty(e2);
      }), A.empty(this.media.style) && this.media.removeAttribute("style");
    } };
    class Ve {
      constructor(e2) {
        t(this, "firstTouch", () => {
          const { player: e3 } = this, { elements: t2 } = e3;
          e3.touch = true, F(t2.container, e3.config.classNames.isTouch, true);
        }), t(this, "global", (e3 = true) => {
          const { player: t2 } = this;
          t2.config.keyboard.global && X.call(t2, window, "keydown keyup", this.handleKey, e3, false), X.call(t2, document.body, "click", this.toggleMenu, e3), Z.call(t2, document.body, "touchstart", this.firstTouch);
        }), t(this, "container", () => {
          const { player: e3 } = this, { config: t2, elements: i2, timers: s2 } = e3;
          !t2.keyboard.global && t2.keyboard.focused && J.call(e3, i2.container, "keydown keyup", this.handleKey, false), J.call(e3, i2.container, "mousemove mouseleave touchstart touchmove enterfullscreen exitfullscreen", (t3) => {
            const { controls: n3 } = i2;
            n3 && "enterfullscreen" === t3.type && (n3.pressed = false, n3.hover = false);
            let a3 = 0;
            ["touchstart", "touchmove", "mousemove"].includes(t3.type) && (Ue.toggleControls.call(e3, true), a3 = e3.touch ? 3e3 : 2e3), clearTimeout(s2.controls), s2.controls = setTimeout(() => Ue.toggleControls.call(e3, false), a3);
          });
          const n2 = () => {
            if (!e3.isVimeo || e3.config.vimeo.premium) return;
            const t3 = i2.wrapper, { active: s3 } = e3.fullscreen, [n3, a3] = ue.call(e3), r2 = re(`aspect-ratio: ${n3} / ${a3}`);
            if (!s3) return void (r2 ? (t3.style.width = null, t3.style.height = null) : (t3.style.maxWidth = null, t3.style.margin = null));
            const [o2, l2] = [Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0), Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)], c2 = o2 / l2 > n3 / a3;
            r2 ? (t3.style.width = c2 ? "auto" : "100%", t3.style.height = c2 ? "100%" : "auto") : (t3.style.maxWidth = c2 ? l2 / a3 * n3 + "px" : null, t3.style.margin = c2 ? "0 auto" : null);
          }, a2 = () => {
            clearTimeout(s2.resized), s2.resized = setTimeout(n2, 50);
          };
          J.call(e3, i2.container, "enterfullscreen exitfullscreen", (t3) => {
            const { target: s3 } = e3.fullscreen;
            if (s3 !== i2.container) return;
            if (!e3.isEmbed && A.empty(e3.config.ratio)) return;
            n2();
            ("enterfullscreen" === t3.type ? J : G).call(e3, window, "resize", a2);
          });
        }), t(this, "media", () => {
          const { player: e3 } = this, { elements: t2 } = e3;
          if (J.call(e3, e3.media, "timeupdate seeking seeked", (t3) => Me.timeUpdate.call(e3, t3)), J.call(e3, e3.media, "durationchange loadeddata loadedmetadata", (t3) => Me.durationUpdate.call(e3, t3)), J.call(e3, e3.media, "ended", () => {
            e3.isHTML5 && e3.isVideo && e3.config.resetOnEnd && (e3.restart(), e3.pause());
          }), J.call(e3, e3.media, "progress playing seeking seeked", (t3) => Me.updateProgress.call(e3, t3)), J.call(e3, e3.media, "volumechange", (t3) => Me.updateVolume.call(e3, t3)), J.call(e3, e3.media, "playing play pause ended emptied timeupdate", (t3) => Ue.checkPlaying.call(e3, t3)), J.call(e3, e3.media, "waiting canplay seeked playing", (t3) => Ue.checkLoading.call(e3, t3)), e3.supported.ui && e3.config.clickToPlay && !e3.isAudio) {
            const i3 = W.call(e3, `.${e3.config.classNames.video}`);
            if (!A.element(i3)) return;
            J.call(e3, t2.container, "click", (s2) => {
              ([t2.container, i3].includes(s2.target) || i3.contains(s2.target)) && (e3.touch && e3.config.hideControls || (e3.ended ? (this.proxy(s2, e3.restart, "restart"), this.proxy(s2, () => {
                se(e3.play());
              }, "play")) : this.proxy(s2, () => {
                se(e3.togglePlay());
              }, "play")));
            });
          }
          e3.supported.ui && e3.config.disableContextMenu && J.call(e3, t2.wrapper, "contextmenu", (e4) => {
            e4.preventDefault();
          }, false), J.call(e3, e3.media, "volumechange", () => {
            e3.storage.set({ volume: e3.volume, muted: e3.muted });
          }), J.call(e3, e3.media, "ratechange", () => {
            Me.updateSetting.call(e3, "speed"), e3.storage.set({ speed: e3.speed });
          }), J.call(e3, e3.media, "qualitychange", (t3) => {
            Me.updateSetting.call(e3, "quality", null, t3.detail.quality);
          }), J.call(e3, e3.media, "ready qualitychange", () => {
            Me.setDownloadUrl.call(e3);
          });
          const i2 = e3.config.events.concat(["keyup", "keydown"]).join(" ");
          J.call(e3, e3.media, i2, (i3) => {
            let { detail: s2 = {} } = i3;
            "error" === i3.type && (s2 = e3.media.error), ee.call(e3, t2.container, i3.type, true, s2);
          });
        }), t(this, "proxy", (e3, t2, i2) => {
          const { player: s2 } = this, n2 = s2.config.listeners[i2];
          let a2 = true;
          A.function(n2) && (a2 = n2.call(s2, e3)), false !== a2 && A.function(t2) && t2.call(s2, e3);
        }), t(this, "bind", (e3, t2, i2, s2, n2 = true) => {
          const { player: a2 } = this, r2 = a2.config.listeners[s2], o2 = A.function(r2);
          J.call(a2, e3, t2, (e4) => this.proxy(e4, i2, s2), n2 && !o2);
        }), t(this, "controls", () => {
          const { player: e3 } = this, { elements: t2 } = e3, i2 = x.isIE ? "change" : "input";
          if (t2.buttons.play && Array.from(t2.buttons.play).forEach((t3) => {
            this.bind(t3, "click", () => {
              se(e3.togglePlay());
            }, "play");
          }), this.bind(t2.buttons.restart, "click", e3.restart, "restart"), this.bind(t2.buttons.rewind, "click", () => {
            e3.lastSeekTime = Date.now(), e3.rewind();
          }, "rewind"), this.bind(t2.buttons.fastForward, "click", () => {
            e3.lastSeekTime = Date.now(), e3.forward();
          }, "fastForward"), this.bind(t2.buttons.mute, "click", () => {
            e3.muted = !e3.muted;
          }, "mute"), this.bind(t2.buttons.captions, "click", () => e3.toggleCaptions()), this.bind(t2.buttons.download, "click", () => {
            ee.call(e3, e3.media, "download");
          }, "download"), this.bind(t2.buttons.fullscreen, "click", () => {
            e3.fullscreen.toggle();
          }, "fullscreen"), this.bind(t2.buttons.pip, "click", () => {
            e3.pip = "toggle";
          }, "pip"), this.bind(t2.buttons.airplay, "click", e3.airplay, "airplay"), this.bind(t2.buttons.settings, "click", (t3) => {
            t3.stopPropagation(), t3.preventDefault(), Me.toggleMenu.call(e3, t3);
          }, null, false), this.bind(t2.buttons.settings, "keyup", (t3) => {
            [" ", "Enter"].includes(t3.key) && ("Enter" !== t3.key ? (t3.preventDefault(), t3.stopPropagation(), Me.toggleMenu.call(e3, t3)) : Me.focusFirstMenuItem.call(e3, null, true));
          }, null, false), this.bind(t2.settings.menu, "keydown", (t3) => {
            "Escape" === t3.key && Me.toggleMenu.call(e3, t3);
          }), this.bind(t2.inputs.seek, "mousedown mousemove", (e4) => {
            const i3 = t2.progress.getBoundingClientRect(), s2 = 100 / i3.width * (e4.pageX - i3.left);
            e4.currentTarget.setAttribute("seek-value", s2);
          }), this.bind(t2.inputs.seek, "mousedown mouseup keydown keyup touchstart touchend", (t3) => {
            const i3 = t3.currentTarget, s2 = "play-on-seeked";
            if (A.keyboardEvent(t3) && !["ArrowLeft", "ArrowRight"].includes(t3.key)) return;
            e3.lastSeekTime = Date.now();
            const n2 = i3.hasAttribute(s2), a2 = ["mouseup", "touchend", "keyup"].includes(t3.type);
            n2 && a2 ? (i3.removeAttribute(s2), se(e3.play())) : !a2 && e3.playing && (i3.setAttribute(s2, ""), e3.pause());
          }), x.isIos) {
            const t3 = B.call(e3, 'input[type="range"]');
            Array.from(t3).forEach((e4) => this.bind(e4, i2, (e5) => M(e5.target)));
          }
          this.bind(t2.inputs.seek, i2, (t3) => {
            const i3 = t3.currentTarget;
            let s2 = i3.getAttribute("seek-value");
            A.empty(s2) && (s2 = i3.value), i3.removeAttribute("seek-value"), e3.currentTime = s2 / i3.max * e3.duration;
          }, "seek"), this.bind(t2.progress, "mouseenter mouseleave mousemove", (t3) => Me.updateSeekTooltip.call(e3, t3)), this.bind(t2.progress, "mousemove touchmove", (t3) => {
            const { posterThumbnails: i3 } = e3;
            i3 && i3.loaded && i3.startMove(t3);
          }), this.bind(t2.progress, "mouseleave touchend click", () => {
            const { posterThumbnails: t3 } = e3;
            t3 && t3.loaded && t3.endMove(false, true);
          }), this.bind(t2.progress, "mousedown touchstart", (t3) => {
            const { posterThumbnails: i3 } = e3;
            i3 && i3.loaded && i3.startScrubbing(t3);
          }), this.bind(t2.progress, "mouseup touchend", (t3) => {
            const { posterThumbnails: i3 } = e3;
            i3 && i3.loaded && i3.endScrubbing(t3);
          }), x.isWebKit && Array.from(B.call(e3, 'input[type="range"]')).forEach((t3) => {
            this.bind(t3, "input", (t4) => Me.updateRangeFill.call(e3, t4.target));
          }), e3.config.toggleInvert && !A.element(t2.display.duration) && this.bind(t2.display.currentTime, "click", () => {
            0 !== e3.currentTime && (e3.config.invertTime = !e3.config.invertTime, Me.timeUpdate.call(e3));
          }), this.bind(t2.inputs.volume, i2, (t3) => {
            e3.volume = t3.target.value;
          }, "volume"), this.bind(t2.controls, "mouseenter mouseleave", (i3) => {
            t2.controls.hover = !e3.touch && "mouseenter" === i3.type;
          }), t2.fullscreen && Array.from(t2.fullscreen.children).filter((e4) => !e4.contains(t2.container)).forEach((i3) => {
            this.bind(i3, "mouseenter mouseleave", (i4) => {
              t2.controls && (t2.controls.hover = !e3.touch && "mouseenter" === i4.type);
            });
          }), this.bind(t2.controls, "mousedown mouseup touchstart touchend touchcancel", (e4) => {
            t2.controls.pressed = ["mousedown", "touchstart"].includes(e4.type);
          }), this.bind(t2.controls, "focusin", () => {
            const { config: i3, timers: s2 } = e3;
            F(t2.controls, i3.classNames.noTransition, true), Ue.toggleControls.call(e3, true), setTimeout(() => {
              F(t2.controls, i3.classNames.noTransition, false);
            }, 0);
            const n2 = this.touch ? 3e3 : 4e3;
            clearTimeout(s2.controls), s2.controls = setTimeout(() => Ue.toggleControls.call(e3, false), n2);
          }), this.bind(t2.inputs.volume, "wheel", (t3) => {
            const i3 = t3.webkitDirectionInvertedFromDevice, [s2, n2] = [t3.deltaX, -t3.deltaY].map((e4) => i3 ? -e4 : e4), a2 = Math.sign(Math.abs(s2) > Math.abs(n2) ? s2 : n2);
            e3.increaseVolume(a2 / 50);
            const { volume: r2 } = e3.media;
            (1 === a2 && r2 < 1 || -1 === a2 && r2 > 0) && t3.preventDefault();
          }, "volume", false);
        }), this.player = e2, this.lastKey = null, this.focusTimer = null, this.lastKeyDown = null, this.handleKey = this.handleKey.bind(this), this.toggleMenu = this.toggleMenu.bind(this), this.firstTouch = this.firstTouch.bind(this);
      }
      handleKey(e2) {
        const { player: t2 } = this, { elements: i2 } = t2, { key: s2, type: n2, altKey: a2, ctrlKey: r2, metaKey: o2, shiftKey: l2 } = e2, c2 = "keydown" === n2, u2 = c2 && s2 === this.lastKey;
        if (a2 || r2 || o2 || l2) return;
        if (!s2) return;
        if (c2) {
          const n3 = document.activeElement;
          if (A.element(n3)) {
            const { editable: s3 } = t2.config.selectors, { seek: a3 } = i2.inputs;
            if (n3 !== a3 && V(n3, s3)) return;
            if (" " === e2.key && V(n3, 'button, [role^="menuitem"]')) return;
          }
          switch ([" ", "ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "c", "f", "k", "l", "m"].includes(s2) && (e2.preventDefault(), e2.stopPropagation()), s2) {
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
              u2 || (h2 = parseInt(s2, 10), t2.currentTime = t2.duration / 10 * h2);
              break;
            case " ":
            case "k":
              u2 || se(t2.togglePlay());
              break;
            case "ArrowUp":
              t2.increaseVolume(0.1);
              break;
            case "ArrowDown":
              t2.decreaseVolume(0.1);
              break;
            case "m":
              u2 || (t2.muted = !t2.muted);
              break;
            case "ArrowRight":
              t2.forward();
              break;
            case "ArrowLeft":
              t2.rewind();
              break;
            case "f":
              t2.fullscreen.toggle();
              break;
            case "c":
              u2 || t2.toggleCaptions();
              break;
            case "l":
              t2.loop = !t2.loop;
          }
          "Escape" === s2 && !t2.fullscreen.usingNative && t2.fullscreen.active && t2.fullscreen.toggle(), this.lastKey = s2;
        } else this.lastKey = null;
        var h2;
      }
      toggleMenu(e2) {
        Me.toggleMenu.call(this.player, e2);
      }
    }
    var Be = function(e2, t2) {
      return e2(t2 = { exports: {} }, t2.exports), t2.exports;
    }(function(e2, t2) {
      e2.exports = function() {
        var e3 = function() {
        }, t3 = {}, i2 = {}, s2 = {};
        function n2(e4, t4) {
          e4 = e4.push ? e4 : [e4];
          var n3, a3, r3, o3 = [], l3 = e4.length, c3 = l3;
          for (n3 = function(e5, i3) {
            i3.length && o3.push(e5), --c3 || t4(o3);
          }; l3--; ) a3 = e4[l3], (r3 = i2[a3]) ? n3(a3, r3) : (s2[a3] = s2[a3] || []).push(n3);
        }
        function a2(e4, t4) {
          if (e4) {
            var n3 = s2[e4];
            if (i2[e4] = t4, n3) for (; n3.length; ) n3[0](e4, t4), n3.splice(0, 1);
          }
        }
        function r2(t4, i3) {
          t4.call && (t4 = { success: t4 }), i3.length ? (t4.error || e3)(i3) : (t4.success || e3)(t4);
        }
        function o2(t4, i3, s3, n3) {
          var a3, r3, l3 = document, c3 = s3.async, u2 = (s3.numRetries || 0) + 1, h2 = s3.before || e3, d2 = t4.replace(/[\?|#].*$/, ""), m2 = t4.replace(/^(css|img)!/, "");
          n3 = n3 || 0, /(^css!|\.css$)/.test(d2) ? ((r3 = l3.createElement("link")).rel = "stylesheet", r3.href = m2, (a3 = "hideFocus" in r3) && r3.relList && (a3 = 0, r3.rel = "preload", r3.as = "style")) : /(^img!|\.(png|gif|jpg|svg|webp)$)/.test(d2) ? (r3 = l3.createElement("img")).src = m2 : ((r3 = l3.createElement("script")).src = t4, r3.async = void 0 === c3 || c3), r3.onload = r3.onerror = r3.onbeforeload = function(e4) {
            var l4 = e4.type[0];
            if (a3) try {
              r3.sheet.cssText.length || (l4 = "e");
            } catch (e5) {
              18 != e5.code && (l4 = "e");
            }
            if ("e" == l4) {
              if ((n3 += 1) < u2) return o2(t4, i3, s3, n3);
            } else if ("preload" == r3.rel && "style" == r3.as) return r3.rel = "stylesheet";
            i3(t4, l4, e4.defaultPrevented);
          }, false !== h2(t4, r3) && l3.head.appendChild(r3);
        }
        function l2(e4, t4, i3) {
          var s3, n3, a3 = (e4 = e4.push ? e4 : [e4]).length, r3 = a3, l3 = [];
          for (s3 = function(e5, i4, s4) {
            if ("e" == i4 && l3.push(e5), "b" == i4) {
              if (!s4) return;
              l3.push(e5);
            }
            --a3 || t4(l3);
          }, n3 = 0; n3 < r3; n3++) o2(e4[n3], s3, i3);
        }
        function c2(e4, i3, s3) {
          var n3, o3;
          if (i3 && i3.trim && (n3 = i3), o3 = (n3 ? s3 : i3) || {}, n3) {
            if (n3 in t3) throw "LoadJS";
            t3[n3] = true;
          }
          function c3(t4, i4) {
            l2(e4, function(e5) {
              r2(o3, e5), t4 && r2({ success: t4, error: i4 }, e5), a2(n3, e5);
            }, o3);
          }
          if (o3.returnPromise) return new Promise(c3);
          c3();
        }
        return c2.ready = function(e4, t4) {
          return n2(e4, function(e5) {
            r2(t4, e5);
          }), c2;
        }, c2.done = function(e4) {
          a2(e4, []);
        }, c2.reset = function() {
          t3 = {}, i2 = {}, s2 = {};
        }, c2.isDefined = function(e4) {
          return e4 in t3;
        }, c2;
      }();
    });
    function We(e2) {
      return new Promise((t2, i2) => {
        Be(e2, { success: t2, error: i2 });
      });
    }
    function ze(e2) {
      e2 && !this.embed.hasPlayed && (this.embed.hasPlayed = true), this.media.paused === e2 && (this.media.paused = !e2, ee.call(this, this.media, e2 ? "play" : "pause"));
    }
    const Ke = { setup() {
      const e2 = this;
      F(e2.elements.wrapper, e2.config.classNames.embed, true), e2.options.speed = e2.config.speed.options, he.call(e2), A.object(window.Vimeo) ? Ke.ready.call(e2) : We(e2.config.urls.vimeo.sdk).then(() => {
        Ke.ready.call(e2);
      }).catch((t2) => {
        e2.debug.warn("Vimeo SDK (player.js) failed to load", t2);
      });
    }, ready() {
      const e2 = this, t2 = e2.config.vimeo, _a = t2, { premium: i2, referrerPolicy: s2 } = _a, n2 = __objRest(_a, ["premium", "referrerPolicy"]);
      let a2 = e2.media.getAttribute("src"), r2 = "";
      A.empty(a2) ? (a2 = e2.media.getAttribute(e2.config.attributes.embed.id), r2 = e2.media.getAttribute(e2.config.attributes.embed.hash)) : r2 = function(e3) {
        const t3 = e3.match(/^.*(vimeo.com\/|video\/)(\d+)(\?.*&*h=|\/)+([\d,a-f]+)/);
        return t3 && 5 === t3.length ? t3[4] : null;
      }(a2);
      const o2 = r2 ? { h: r2 } : {};
      i2 && Object.assign(n2, { controls: false, sidedock: false });
      const l2 = Le(__spreadValues(__spreadValues({ loop: e2.config.loop.active, autoplay: e2.autoplay, muted: e2.muted, gesture: "media", playsinline: e2.config.playsinline }, o2), n2)), c2 = (u2 = a2, A.empty(u2) ? null : A.number(Number(u2)) ? u2 : u2.match(/^.*(vimeo.com\/|video\/)(\d+).*/) ? RegExp.$2 : u2);
      var u2;
      const h2 = O("iframe"), d2 = pe(e2.config.urls.vimeo.iframe, c2, l2);
      if (h2.setAttribute("src", d2), h2.setAttribute("allowfullscreen", ""), h2.setAttribute("allow", ["autoplay", "fullscreen", "picture-in-picture", "encrypted-media", "accelerometer", "gyroscope"].join("; ")), A.empty(s2) || h2.setAttribute("referrerPolicy", s2), i2 || !t2.customControls) h2.setAttribute("data-poster", e2.poster), e2.media = D(h2, e2.media);
      else {
        const t3 = O("div", { class: e2.config.classNames.embedContainer, "data-poster": e2.poster });
        t3.appendChild(h2), e2.media = D(t3, e2.media);
      }
      t2.customControls || ke(pe(e2.config.urls.vimeo.api, d2)).then((t3) => {
        !A.empty(t3) && t3.thumbnail_url && Ue.setPoster.call(e2, t3.thumbnail_url).catch(() => {
        });
      }), e2.embed = new window.Vimeo.Player(h2, { autopause: e2.config.autopause, muted: e2.muted }), e2.media.paused = true, e2.media.currentTime = 0, e2.supported.ui && e2.embed.disableTextTrack(), e2.media.play = () => (ze.call(e2, true), e2.embed.play()), e2.media.pause = () => (ze.call(e2, false), e2.embed.pause()), e2.media.stop = () => {
        e2.pause(), e2.currentTime = 0;
      };
      let { currentTime: m2 } = e2.media;
      Object.defineProperty(e2.media, "currentTime", { get: () => m2, set(t3) {
        const { embed: i3, media: s3, paused: n3, volume: a3 } = e2, r3 = n3 && !i3.hasPlayed;
        s3.seeking = true, ee.call(e2, s3, "seeking"), Promise.resolve(r3 && i3.setVolume(0)).then(() => i3.setCurrentTime(t3)).then(() => r3 && i3.pause()).then(() => r3 && i3.setVolume(a3)).catch(() => {
        });
      } });
      let p2 = e2.config.speed.selected;
      Object.defineProperty(e2.media, "playbackRate", { get: () => p2, set(t3) {
        e2.embed.setPlaybackRate(t3).then(() => {
          p2 = t3, ee.call(e2, e2.media, "ratechange");
        }).catch(() => {
          e2.options.speed = [1];
        });
      } });
      let { volume: g2 } = e2.config;
      Object.defineProperty(e2.media, "volume", { get: () => g2, set(t3) {
        e2.embed.setVolume(t3).then(() => {
          g2 = t3, ee.call(e2, e2.media, "volumechange");
        });
      } });
      let { muted: f2 } = e2.config;
      Object.defineProperty(e2.media, "muted", { get: () => f2, set(t3) {
        const i3 = !!A.boolean(t3) && t3;
        e2.embed.setMuted(!!i3 || e2.config.muted).then(() => {
          f2 = i3, ee.call(e2, e2.media, "volumechange");
        });
      } });
      let y2, { loop: b2 } = e2.config;
      Object.defineProperty(e2.media, "loop", { get: () => b2, set(t3) {
        const i3 = A.boolean(t3) ? t3 : e2.config.loop.active;
        e2.embed.setLoop(i3).then(() => {
          b2 = i3;
        });
      } }), e2.embed.getVideoUrl().then((t3) => {
        y2 = t3, Me.setDownloadUrl.call(e2);
      }).catch((e3) => {
        this.debug.warn(e3);
      }), Object.defineProperty(e2.media, "currentSrc", { get: () => y2 }), Object.defineProperty(e2.media, "ended", { get: () => e2.currentTime === e2.duration }), Promise.all([e2.embed.getVideoWidth(), e2.embed.getVideoHeight()]).then((t3) => {
        const [i3, s3] = t3;
        e2.embed.ratio = de(i3, s3), he.call(this);
      }), e2.embed.setAutopause(e2.config.autopause).then((t3) => {
        e2.config.autopause = t3;
      }), e2.embed.getVideoTitle().then((t3) => {
        e2.config.title = t3, Ue.setTitle.call(this);
      }), e2.embed.getCurrentTime().then((t3) => {
        m2 = t3, ee.call(e2, e2.media, "timeupdate");
      }), e2.embed.getDuration().then((t3) => {
        e2.media.duration = t3, ee.call(e2, e2.media, "durationchange");
      }), e2.embed.getTextTracks().then((t3) => {
        e2.media.textTracks = t3, Ne.setup.call(e2);
      }), e2.embed.on("cuechange", ({ cues: t3 = [] }) => {
        const i3 = t3.map((e3) => function(e4) {
          const t4 = document.createDocumentFragment(), i4 = document.createElement("div");
          return t4.appendChild(i4), i4.innerHTML = e4, t4.firstChild.innerText;
        }(e3.text));
        Ne.updateCues.call(e2, i3);
      }), e2.embed.on("loaded", () => {
        if (e2.embed.getPaused().then((t3) => {
          ze.call(e2, !t3), t3 || ee.call(e2, e2.media, "playing");
        }), A.element(e2.embed.element) && e2.supported.ui) {
          e2.embed.element.setAttribute("tabindex", -1);
        }
      }), e2.embed.on("bufferstart", () => {
        ee.call(e2, e2.media, "waiting");
      }), e2.embed.on("bufferend", () => {
        ee.call(e2, e2.media, "playing");
      }), e2.embed.on("play", () => {
        ze.call(e2, true), ee.call(e2, e2.media, "playing");
      }), e2.embed.on("pause", () => {
        ze.call(e2, false);
      }), e2.embed.on("timeupdate", (t3) => {
        e2.media.seeking = false, m2 = t3.seconds, ee.call(e2, e2.media, "timeupdate");
      }), e2.embed.on("progress", (t3) => {
        e2.media.buffered = t3.percent, ee.call(e2, e2.media, "progress"), 1 === parseInt(t3.percent, 10) && ee.call(e2, e2.media, "canplaythrough"), e2.embed.getDuration().then((t4) => {
          t4 !== e2.media.duration && (e2.media.duration = t4, ee.call(e2, e2.media, "durationchange"));
        });
      }), e2.embed.on("seeked", () => {
        e2.media.seeking = false, ee.call(e2, e2.media, "seeked");
      }), e2.embed.on("ended", () => {
        e2.media.paused = true, ee.call(e2, e2.media, "ended");
      }), e2.embed.on("error", (t3) => {
        e2.media.error = t3, ee.call(e2, e2.media, "error");
      }), t2.customControls && setTimeout(() => Ue.build.call(e2), 0);
    } };
    function Ye(e2) {
      e2 && !this.embed.hasPlayed && (this.embed.hasPlayed = true), this.media.paused === e2 && (this.media.paused = !e2, ee.call(this, this.media, e2 ? "play" : "pause"));
    }
    function Qe(e2) {
      return e2.noCookie ? "https://www.youtube-nocookie.com" : "http:" === window.location.protocol ? "http://www.youtube.com" : void 0;
    }
    const Xe = { setup() {
      if (F(this.elements.wrapper, this.config.classNames.embed, true), A.object(window.YT) && A.function(window.YT.Player)) Xe.ready.call(this);
      else {
        const e2 = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
          A.function(e2) && e2(), Xe.ready.call(this);
        }, We(this.config.urls.youtube.sdk).catch((e3) => {
          this.debug.warn("YouTube API failed to load", e3);
        });
      }
    }, getTitle(e2) {
      ke(pe(this.config.urls.youtube.api, e2)).then((e3) => {
        if (A.object(e3)) {
          const { title: t2, height: i2, width: s2 } = e3;
          this.config.title = t2, Ue.setTitle.call(this), this.embed.ratio = de(s2, i2);
        }
        he.call(this);
      }).catch(() => {
        he.call(this);
      });
    }, ready() {
      const e2 = this, t2 = e2.config.youtube, i2 = e2.media && e2.media.getAttribute("id");
      if (!A.empty(i2) && i2.startsWith("youtube-")) return;
      let s2 = e2.media.getAttribute("src");
      A.empty(s2) && (s2 = e2.media.getAttribute(this.config.attributes.embed.id));
      const n2 = (a2 = s2, A.empty(a2) ? null : a2.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/) ? RegExp.$2 : a2);
      var a2;
      const r2 = O("div", { id: `${e2.provider}-${Math.floor(1e4 * Math.random())}`, "data-poster": t2.customControls ? e2.poster : void 0 });
      if (e2.media = D(r2, e2.media), t2.customControls) {
        const t3 = (e3) => `https://i.ytimg.com/vi/${n2}/${e3}default.jpg`;
        Fe(t3("maxres"), 121).catch(() => Fe(t3("sd"), 121)).catch(() => Fe(t3("hq"))).then((t4) => Ue.setPoster.call(e2, t4.src)).then((t4) => {
          t4.includes("maxres") || (e2.elements.poster.style.backgroundSize = "cover");
        }).catch(() => {
        });
      }
      e2.embed = new window.YT.Player(e2.media, { videoId: n2, host: Qe(t2), playerVars: N({}, { autoplay: e2.config.autoplay ? 1 : 0, hl: e2.config.hl, controls: e2.supported.ui && t2.customControls ? 0 : 1, disablekb: 1, playsinline: e2.config.playsinline && !e2.config.fullscreen.iosNative ? 1 : 0, cc_load_policy: e2.captions.active ? 1 : 0, cc_lang_pref: e2.config.captions.language, widget_referrer: window ? window.location.href : null }, t2), events: { onError(t3) {
        if (!e2.media.error) {
          const i3 = t3.data, s3 = { 2: "The request contains an invalid parameter value. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks.", 5: "The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.", 100: "The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private.", 101: "The owner of the requested video does not allow it to be played in embedded players.", 150: "The owner of the requested video does not allow it to be played in embedded players." }[i3] || "An unknown error occurred";
          e2.media.error = { code: i3, message: s3 }, ee.call(e2, e2.media, "error");
        }
      }, onPlaybackRateChange(t3) {
        const i3 = t3.target;
        e2.media.playbackRate = i3.getPlaybackRate(), ee.call(e2, e2.media, "ratechange");
      }, onReady(i3) {
        if (A.function(e2.media.play)) return;
        const s3 = i3.target;
        Xe.getTitle.call(e2, n2), e2.media.play = () => {
          Ye.call(e2, true), s3.playVideo();
        }, e2.media.pause = () => {
          Ye.call(e2, false), s3.pauseVideo();
        }, e2.media.stop = () => {
          s3.stopVideo();
        }, e2.media.duration = s3.getDuration(), e2.media.paused = true, e2.media.currentTime = 0, Object.defineProperty(e2.media, "currentTime", { get: () => Number(s3.getCurrentTime()), set(t3) {
          e2.paused && !e2.embed.hasPlayed && e2.embed.mute(), e2.media.seeking = true, ee.call(e2, e2.media, "seeking"), s3.seekTo(t3);
        } }), Object.defineProperty(e2.media, "playbackRate", { get: () => s3.getPlaybackRate(), set(e3) {
          s3.setPlaybackRate(e3);
        } });
        let { volume: a3 } = e2.config;
        Object.defineProperty(e2.media, "volume", { get: () => a3, set(t3) {
          a3 = t3, s3.setVolume(100 * a3), ee.call(e2, e2.media, "volumechange");
        } });
        let { muted: r3 } = e2.config;
        Object.defineProperty(e2.media, "muted", { get: () => r3, set(t3) {
          const i4 = A.boolean(t3) ? t3 : r3;
          r3 = i4, s3[i4 ? "mute" : "unMute"](), s3.setVolume(100 * a3), ee.call(e2, e2.media, "volumechange");
        } }), Object.defineProperty(e2.media, "currentSrc", { get: () => s3.getVideoUrl() }), Object.defineProperty(e2.media, "ended", { get: () => e2.currentTime === e2.duration });
        const o2 = s3.getAvailablePlaybackRates();
        e2.options.speed = o2.filter((t3) => e2.config.speed.options.includes(t3)), e2.supported.ui && t2.customControls && e2.media.setAttribute("tabindex", -1), ee.call(e2, e2.media, "timeupdate"), ee.call(e2, e2.media, "durationchange"), clearInterval(e2.timers.buffering), e2.timers.buffering = setInterval(() => {
          e2.media.buffered = s3.getVideoLoadedFraction(), (null === e2.media.lastBuffered || e2.media.lastBuffered < e2.media.buffered) && ee.call(e2, e2.media, "progress"), e2.media.lastBuffered = e2.media.buffered, 1 === e2.media.buffered && (clearInterval(e2.timers.buffering), ee.call(e2, e2.media, "canplaythrough"));
        }, 200), t2.customControls && setTimeout(() => Ue.build.call(e2), 50);
      }, onStateChange(i3) {
        const s3 = i3.target;
        clearInterval(e2.timers.playing);
        switch (e2.media.seeking && [1, 2].includes(i3.data) && (e2.media.seeking = false, ee.call(e2, e2.media, "seeked")), i3.data) {
          case -1:
            ee.call(e2, e2.media, "timeupdate"), e2.media.buffered = s3.getVideoLoadedFraction(), ee.call(e2, e2.media, "progress");
            break;
          case 0:
            Ye.call(e2, false), e2.media.loop ? (s3.stopVideo(), s3.playVideo()) : ee.call(e2, e2.media, "ended");
            break;
          case 1:
            t2.customControls && !e2.config.autoplay && e2.media.paused && !e2.embed.hasPlayed ? e2.media.pause() : (Ye.call(e2, true), ee.call(e2, e2.media, "playing"), e2.timers.playing = setInterval(() => {
              ee.call(e2, e2.media, "timeupdate");
            }, 50), e2.media.duration !== s3.getDuration() && (e2.media.duration = s3.getDuration(), ee.call(e2, e2.media, "durationchange")));
            break;
          case 2:
            e2.muted || e2.embed.unMute(), Ye.call(e2, false);
            break;
          case 3:
            ee.call(e2, e2.media, "waiting");
        }
        ee.call(e2, e2.elements.container, "statechange", false, { code: i3.data });
      } } });
    } }, Je = { setup() {
      this.media ? (F(this.elements.container, this.config.classNames.type.replace("{0}", this.type), true), F(this.elements.container, this.config.classNames.provider.replace("{0}", this.provider), true), this.isEmbed && F(this.elements.container, this.config.classNames.type.replace("{0}", "video"), true), this.isVideo && (this.elements.wrapper = O("div", { class: this.config.classNames.video }), _(this.media, this.elements.wrapper), this.elements.poster = O("div", { class: this.config.classNames.poster }), this.elements.wrapper.appendChild(this.elements.poster)), this.isHTML5 ? me.setup.call(this) : this.isYouTube ? Xe.setup.call(this) : this.isVimeo && Ke.setup.call(this)) : this.debug.warn("No media element found!");
    } };
    class Ge {
      constructor(e2) {
        t(this, "load", () => {
          this.enabled && (A.object(window.google) && A.object(window.google.ima) ? this.ready() : We(this.player.config.urls.googleIMA.sdk).then(() => {
            this.ready();
          }).catch(() => {
            this.trigger("error", new Error("Google IMA SDK failed to load"));
          }));
        }), t(this, "ready", () => {
          var e3;
          this.enabled || ((e3 = this).manager && e3.manager.destroy(), e3.elements.displayContainer && e3.elements.displayContainer.destroy(), e3.elements.container.remove()), this.startSafetyTimer(12e3, "ready()"), this.managerPromise.then(() => {
            this.clearSafetyTimer("onAdsManagerLoaded()");
          }), this.listeners(), this.setupIMA();
        }), t(this, "setupIMA", () => {
          this.elements.container = O("div", { class: this.player.config.classNames.ads }), this.player.elements.container.appendChild(this.elements.container), google.ima.settings.setVpaidMode(google.ima.ImaSdkSettings.VpaidMode.ENABLED), google.ima.settings.setLocale(this.player.config.ads.language), google.ima.settings.setDisableCustomPlaybackForIOS10Plus(this.player.config.playsinline), this.elements.displayContainer = new google.ima.AdDisplayContainer(this.elements.container, this.player.media), this.loader = new google.ima.AdsLoader(this.elements.displayContainer), this.loader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, (e3) => this.onAdsManagerLoaded(e3), false), this.loader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, (e3) => this.onAdError(e3), false), this.requestAds();
        }), t(this, "requestAds", () => {
          const { container: e3 } = this.player.elements;
          try {
            const t2 = new google.ima.AdsRequest();
            t2.adTagUrl = this.tagUrl, t2.linearAdSlotWidth = e3.offsetWidth, t2.linearAdSlotHeight = e3.offsetHeight, t2.nonLinearAdSlotWidth = e3.offsetWidth, t2.nonLinearAdSlotHeight = e3.offsetHeight, t2.forceNonLinearFullSlot = false, t2.setAdWillPlayMuted(!this.player.muted), this.loader.requestAds(t2);
          } catch (e4) {
            this.onAdError(e4);
          }
        }), t(this, "pollCountdown", (e3 = false) => {
          if (!e3) return clearInterval(this.countdownTimer), void this.elements.container.removeAttribute("data-badge-text");
          this.countdownTimer = setInterval(() => {
            const e4 = Pe(Math.max(this.manager.getRemainingTime(), 0)), t2 = `${we.get("advertisement", this.player.config)} - ${e4}`;
            this.elements.container.setAttribute("data-badge-text", t2);
          }, 100);
        }), t(this, "onAdsManagerLoaded", (e3) => {
          if (!this.enabled) return;
          const t2 = new google.ima.AdsRenderingSettings();
          t2.restoreCustomPlaybackStateOnAdBreakComplete = true, t2.enablePreloading = true, this.manager = e3.getAdsManager(this.player, t2), this.cuePoints = this.manager.getCuePoints(), this.manager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, (e4) => this.onAdError(e4)), Object.keys(google.ima.AdEvent.Type).forEach((e4) => {
            this.manager.addEventListener(google.ima.AdEvent.Type[e4], (e5) => this.onAdEvent(e5));
          }), this.trigger("loaded");
        }), t(this, "addCuePoints", () => {
          A.empty(this.cuePoints) || this.cuePoints.forEach((e3) => {
            if (0 !== e3 && -1 !== e3 && e3 < this.player.duration) {
              const t2 = this.player.elements.progress;
              if (A.element(t2)) {
                const i2 = 100 / this.player.duration * e3, s2 = O("span", { class: this.player.config.classNames.cues });
                s2.style.left = `${i2.toString()}%`, t2.appendChild(s2);
              }
            }
          });
        }), t(this, "onAdEvent", (e3) => {
          const { container: t2 } = this.player.elements, i2 = e3.getAd(), s2 = e3.getAdData();
          switch (((e4) => {
            ee.call(this.player, this.player.media, `ads${e4.replace(/_/g, "").toLowerCase()}`);
          })(e3.type), e3.type) {
            case google.ima.AdEvent.Type.LOADED:
              this.trigger("loaded"), this.pollCountdown(true), i2.isLinear() || (i2.width = t2.offsetWidth, i2.height = t2.offsetHeight);
              break;
            case google.ima.AdEvent.Type.STARTED:
              this.manager.setVolume(this.player.volume);
              break;
            case google.ima.AdEvent.Type.ALL_ADS_COMPLETED:
              this.player.ended ? this.loadAds() : this.loader.contentComplete();
              break;
            case google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED:
              this.pauseContent();
              break;
            case google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED:
              this.pollCountdown(), this.resumeContent();
              break;
            case google.ima.AdEvent.Type.LOG:
              s2.adError && this.player.debug.warn(`Non-fatal ad error: ${s2.adError.getMessage()}`);
          }
        }), t(this, "onAdError", (e3) => {
          this.cancel(), this.player.debug.warn("Ads error", e3);
        }), t(this, "listeners", () => {
          const { container: e3 } = this.player.elements;
          let t2;
          this.player.on("canplay", () => {
            this.addCuePoints();
          }), this.player.on("ended", () => {
            this.loader.contentComplete();
          }), this.player.on("timeupdate", () => {
            t2 = this.player.currentTime;
          }), this.player.on("seeked", () => {
            const e4 = this.player.currentTime;
            A.empty(this.cuePoints) || this.cuePoints.forEach((i2, s2) => {
              t2 < i2 && i2 < e4 && (this.manager.discardAdBreak(), this.cuePoints.splice(s2, 1));
            });
          }), window.addEventListener("resize", () => {
            this.manager && this.manager.resize(e3.offsetWidth, e3.offsetHeight, google.ima.ViewMode.NORMAL);
          });
        }), t(this, "play", () => {
          const { container: e3 } = this.player.elements;
          this.managerPromise || this.resumeContent(), this.managerPromise.then(() => {
            this.manager.setVolume(this.player.volume), this.elements.displayContainer.initialize();
            try {
              this.initialized || (this.manager.init(e3.offsetWidth, e3.offsetHeight, google.ima.ViewMode.NORMAL), this.manager.start()), this.initialized = true;
            } catch (e4) {
              this.onAdError(e4);
            }
          }).catch(() => {
          });
        }), t(this, "resumeContent", () => {
          this.elements.container.style.zIndex = "", this.playing = false, se(this.player.media.play());
        }), t(this, "pauseContent", () => {
          this.elements.container.style.zIndex = 3, this.playing = true, this.player.media.pause();
        }), t(this, "cancel", () => {
          this.initialized && this.resumeContent(), this.trigger("error"), this.loadAds();
        }), t(this, "loadAds", () => {
          this.managerPromise.then(() => {
            this.manager && this.manager.destroy(), this.managerPromise = new Promise((e3) => {
              this.on("loaded", e3), this.player.debug.log(this.manager);
            }), this.initialized = false, this.requestAds();
          }).catch(() => {
          });
        }), t(this, "trigger", (e3, ...t2) => {
          const i2 = this.events[e3];
          A.array(i2) && i2.forEach((e4) => {
            A.function(e4) && e4.apply(this, t2);
          });
        }), t(this, "on", (e3, t2) => (A.array(this.events[e3]) || (this.events[e3] = []), this.events[e3].push(t2), this)), t(this, "startSafetyTimer", (e3, t2) => {
          this.player.debug.log(`Safety timer invoked from: ${t2}`), this.safetyTimer = setTimeout(() => {
            this.cancel(), this.clearSafetyTimer("startSafetyTimer()");
          }, e3);
        }), t(this, "clearSafetyTimer", (e3) => {
          A.nullOrUndefined(this.safetyTimer) || (this.player.debug.log(`Safety timer cleared from: ${e3}`), clearTimeout(this.safetyTimer), this.safetyTimer = null);
        }), this.player = e2, this.config = e2.config.ads, this.playing = false, this.initialized = false, this.elements = { container: null, displayContainer: null }, this.manager = null, this.loader = null, this.cuePoints = null, this.events = {}, this.safetyTimer = null, this.countdownTimer = null, this.managerPromise = new Promise((e3, t2) => {
          this.on("loaded", e3), this.on("error", t2);
        }), this.load();
      }
      get enabled() {
        const { config: e2 } = this;
        return this.player.isHTML5 && this.player.isVideo && e2.enabled && (!A.empty(e2.publisherId) || A.url(e2.tagUrl));
      }
      get tagUrl() {
        const { config: e2 } = this;
        if (A.url(e2.tagUrl)) return e2.tagUrl;
        return `https://go.aniview.com/api/adserver6/vast/?${Le({ AV_PUBLISHERID: "58c25bb0073ef448b1087ad6", AV_CHANNELID: "5a0458dc28a06145e4519d21", AV_URL: window.location.hostname, cb: Date.now(), AV_WIDTH: 640, AV_HEIGHT: 480, AV_CDIM2: e2.publisherId })}`;
      }
    }
    function Ze(e2 = 0, t2 = 0, i2 = 255) {
      return Math.min(Math.max(e2, t2), i2);
    }
    const et = (e2) => {
      const t2 = [];
      return e2.split(/\r\n\r\n|\n\n|\r\r/).forEach((e3) => {
        const i2 = {};
        e3.split(/\r\n|\n|\r/).forEach((e4) => {
          if (A.number(i2.startTime)) {
            if (!A.empty(e4.trim()) && A.empty(i2.text)) {
              const t3 = e4.trim().split("#xywh=");
              [i2.text] = t3, t3[1] && ([i2.x, i2.y, i2.w, i2.h] = t3[1].split(","));
            }
          } else {
            const t3 = e4.match(/([0-9]{2})?:?([0-9]{2}):([0-9]{2}).([0-9]{2,3})( ?--> ?)([0-9]{2})?:?([0-9]{2}):([0-9]{2}).([0-9]{2,3})/);
            t3 && (i2.startTime = 60 * Number(t3[1] || 0) * 60 + 60 * Number(t3[2]) + Number(t3[3]) + Number(`0.${t3[4]}`), i2.endTime = 60 * Number(t3[6] || 0) * 60 + 60 * Number(t3[7]) + Number(t3[8]) + Number(`0.${t3[9]}`));
          }
        }), i2.text && t2.push(i2);
      }), t2;
    }, tt = (e2, t2) => {
      const i2 = {};
      return e2 > t2.width / t2.height ? (i2.width = t2.width, i2.height = 1 / e2 * t2.width) : (i2.height = t2.height, i2.width = e2 * t2.height), i2;
    };
    class it {
      constructor(e2) {
        t(this, "load", () => {
          this.player.elements.display.seekTooltip && (this.player.elements.display.seekTooltip.hidden = this.enabled), this.enabled && this.getThumbnails().then(() => {
            this.enabled && (this.render(), this.determineContainerAutoSizing(), this.listeners(), this.loaded = true);
          });
        }), t(this, "getThumbnails", () => new Promise((e3) => {
          const { src: t2 } = this.player.config.posterThumbnails;
          if (A.empty(t2)) throw new Error("Missing posterThumbnails.src config attribute");
          const i2 = () => {
            this.thumbnails.sort((e4, t3) => e4.height - t3.height), this.player.debug.log("Preview thumbnails", this.thumbnails), e3();
          };
          if (A.function(t2)) t2((e4) => {
            this.thumbnails = e4, i2();
          });
          else {
            const e4 = (A.string(t2) ? [t2] : t2).map((e5) => this.getThumbnail(e5));
            Promise.all(e4).then(i2);
          }
        })), t(this, "getThumbnail", (e3) => new Promise((t2) => {
          ke(e3).then((i2) => {
            const s2 = { frames: et(i2), height: null, urlPrefix: "" };
            s2.frames[0].text.startsWith("/") || s2.frames[0].text.startsWith("http://") || s2.frames[0].text.startsWith("https://") || (s2.urlPrefix = e3.substring(0, e3.lastIndexOf("/") + 1));
            const n2 = new Image();
            n2.onload = () => {
              s2.height = n2.naturalHeight, s2.width = n2.naturalWidth, this.thumbnails.push(s2), t2();
            }, n2.src = s2.urlPrefix + s2.frames[0].text;
          });
        })), t(this, "startMove", (e3) => {
          if (this.loaded && A.event(e3) && ["touchmove", "mousemove"].includes(e3.type) && this.player.media.duration) {
            if ("touchmove" === e3.type) this.seekTime = this.player.media.duration * (this.player.elements.inputs.seek.value / 100);
            else {
              var t2, i2;
              const s2 = this.player.elements.progress.getBoundingClientRect(), n2 = 100 / s2.width * (e3.pageX - s2.left);
              this.seekTime = this.player.media.duration * (n2 / 100), this.seekTime < 0 && (this.seekTime = 0), this.seekTime > this.player.media.duration - 1 && (this.seekTime = this.player.media.duration - 1), this.mousePosX = e3.pageX, this.elements.thumb.time.innerText = Pe(this.seekTime);
              const a2 = null === (t2 = this.player.config.markers) || void 0 === t2 || null === (i2 = t2.points) || void 0 === i2 ? void 0 : i2.find(({ time: e4 }) => e4 === Math.round(this.seekTime));
              a2 && this.elements.thumb.time.insertAdjacentHTML("afterbegin", `${a2.label}<br>`);
            }
            this.showImageAtCurrentTime();
          }
        }), t(this, "endMove", () => {
          this.toggleThumbContainer(false, true);
        }), t(this, "startScrubbing", (e3) => {
          (A.nullOrUndefined(e3.button) || false === e3.button || 0 === e3.button) && (this.mouseDown = true, this.player.media.duration && (this.toggleScrubbingContainer(true), this.toggleThumbContainer(false, true), this.showImageAtCurrentTime()));
        }), t(this, "endScrubbing", () => {
          this.mouseDown = false, Math.ceil(this.lastTime) === Math.ceil(this.player.media.currentTime) ? this.toggleScrubbingContainer(false) : Z.call(this.player, this.player.media, "timeupdate", () => {
            this.mouseDown || this.toggleScrubbingContainer(false);
          });
        }), t(this, "listeners", () => {
          this.player.on("play", () => {
            this.toggleThumbContainer(false, true);
          }), this.player.on("seeked", () => {
            this.toggleThumbContainer(false);
          }), this.player.on("timeupdate", () => {
            this.lastTime = this.player.media.currentTime;
          });
        }), t(this, "render", () => {
          this.elements.thumb.container = O("div", { class: this.player.config.classNames.posterThumbnails.thumbContainer }), this.elements.thumb.imageContainer = O("div", { class: this.player.config.classNames.posterThumbnails.imageContainer }), this.elements.thumb.container.appendChild(this.elements.thumb.imageContainer);
          const e3 = O("div", { class: this.player.config.classNames.posterThumbnails.timeContainer });
          this.elements.thumb.time = O("span", {}, "00:00"), e3.appendChild(this.elements.thumb.time), this.elements.thumb.imageContainer.appendChild(e3), A.element(this.player.elements.progress) && this.player.elements.progress.appendChild(this.elements.thumb.container), this.elements.scrubbing.container = O("div", { class: this.player.config.classNames.posterThumbnails.scrubbingContainer }), this.player.elements.wrapper.appendChild(this.elements.scrubbing.container);
        }), t(this, "destroy", () => {
          this.elements.thumb.container && this.elements.thumb.container.remove(), this.elements.scrubbing.container && this.elements.scrubbing.container.remove();
        }), t(this, "showImageAtCurrentTime", () => {
          this.mouseDown ? this.setScrubbingContainerSize() : this.setThumbContainerSizeAndPos();
          const e3 = this.thumbnails[0].frames.findIndex((e4) => this.seekTime >= e4.startTime && this.seekTime <= e4.endTime), t2 = e3 >= 0;
          let i2 = 0;
          this.mouseDown || this.toggleThumbContainer(t2), t2 && (this.thumbnails.forEach((t3, s2) => {
            this.loadedImages.includes(t3.frames[e3].text) && (i2 = s2);
          }), e3 !== this.showingThumb && (this.showingThumb = e3, this.loadImage(i2)));
        }), t(this, "loadImage", (e3 = 0) => {
          const t2 = this.showingThumb, i2 = this.thumbnails[e3], { urlPrefix: s2 } = i2, n2 = i2.frames[t2], a2 = i2.frames[t2].text, r2 = s2 + a2;
          if (this.currentImageElement && this.currentImageElement.dataset.filename === a2) this.showImage(this.currentImageElement, n2, e3, t2, a2, false), this.currentImageElement.dataset.index = t2, this.removeOldImages(this.currentImageElement);
          else {
            this.loadingImage && this.usingSprites && (this.loadingImage.onload = null);
            const i3 = new Image();
            i3.src = r2, i3.dataset.index = t2, i3.dataset.filename = a2, this.showingThumbFilename = a2, this.player.debug.log(`Loading image: ${r2}`), i3.onload = () => this.showImage(i3, n2, e3, t2, a2, true), this.loadingImage = i3, this.removeOldImages(i3);
          }
        }), t(this, "showImage", (e3, t2, i2, s2, n2, a2 = true) => {
          this.player.debug.log(`Showing thumb: ${n2}. num: ${s2}. qual: ${i2}. newimg: ${a2}`), this.setImageSizeAndOffset(e3, t2), a2 && (this.currentImageContainer.appendChild(e3), this.currentImageElement = e3, this.loadedImages.includes(n2) || this.loadedImages.push(n2)), this.preloadNearby(s2, true).then(this.preloadNearby(s2, false)).then(this.getHigherQuality(i2, e3, t2, n2));
        }), t(this, "removeOldImages", (e3) => {
          Array.from(this.currentImageContainer.children).forEach((t2) => {
            if ("img" !== t2.tagName.toLowerCase()) return;
            const i2 = this.usingSprites ? 500 : 1e3;
            if (t2.dataset.index !== e3.dataset.index && !t2.dataset.deleting) {
              t2.dataset.deleting = true;
              const { currentImageContainer: e4 } = this;
              setTimeout(() => {
                e4.removeChild(t2), this.player.debug.log(`Removing thumb: ${t2.dataset.filename}`);
              }, i2);
            }
          });
        }), t(this, "preloadNearby", (e3, t2 = true) => new Promise((i2) => {
          setTimeout(() => {
            const s2 = this.thumbnails[0].frames[e3].text;
            if (this.showingThumbFilename === s2) {
              let n2;
              n2 = t2 ? this.thumbnails[0].frames.slice(e3) : this.thumbnails[0].frames.slice(0, e3).reverse();
              let a2 = false;
              n2.forEach((e4) => {
                const t3 = e4.text;
                if (t3 !== s2 && !this.loadedImages.includes(t3)) {
                  a2 = true, this.player.debug.log(`Preloading thumb filename: ${t3}`);
                  const { urlPrefix: e5 } = this.thumbnails[0], s3 = e5 + t3, n3 = new Image();
                  n3.src = s3, n3.onload = () => {
                    this.player.debug.log(`Preloaded thumb filename: ${t3}`), this.loadedImages.includes(t3) || this.loadedImages.push(t3), i2();
                  };
                }
              }), a2 || i2();
            }
          }, 300);
        })), t(this, "getHigherQuality", (e3, t2, i2, s2) => {
          if (e3 < this.thumbnails.length - 1) {
            let n2 = t2.naturalHeight;
            this.usingSprites && (n2 = i2.h), n2 < this.thumbContainerHeight && setTimeout(() => {
              this.showingThumbFilename === s2 && (this.player.debug.log(`Showing higher quality thumb for: ${s2}`), this.loadImage(e3 + 1));
            }, 300);
          }
        }), t(this, "toggleThumbContainer", (e3 = false, t2 = false) => {
          const i2 = this.player.config.classNames.posterThumbnails.thumbContainerShown;
          this.elements.thumb.container.classList.toggle(i2, e3), !e3 && t2 && (this.showingThumb = null, this.showingThumbFilename = null);
        }), t(this, "toggleScrubbingContainer", (e3 = false) => {
          const t2 = this.player.config.classNames.posterThumbnails.scrubbingContainerShown;
          this.elements.scrubbing.container.classList.toggle(t2, e3), e3 || (this.showingThumb = null, this.showingThumbFilename = null);
        }), t(this, "determineContainerAutoSizing", () => {
          (this.elements.thumb.imageContainer.clientHeight > 20 || this.elements.thumb.imageContainer.clientWidth > 20) && (this.sizeSpecifiedInCSS = true);
        }), t(this, "setThumbContainerSizeAndPos", () => {
          const { imageContainer: e3 } = this.elements.thumb;
          if (this.sizeSpecifiedInCSS) {
            if (e3.clientHeight > 20 && e3.clientWidth < 20) {
              const t2 = Math.floor(e3.clientHeight * this.thumbAspectRatio);
              e3.style.width = `${t2}px`;
            } else if (e3.clientHeight < 20 && e3.clientWidth > 20) {
              const t2 = Math.floor(e3.clientWidth / this.thumbAspectRatio);
              e3.style.height = `${t2}px`;
            }
          } else {
            const t2 = Math.floor(this.thumbContainerHeight * this.thumbAspectRatio);
            e3.style.height = `${this.thumbContainerHeight}px`, e3.style.width = `${t2}px`;
          }
          this.setThumbContainerPos();
        }), t(this, "setThumbContainerPos", () => {
          const e3 = this.player.elements.progress.getBoundingClientRect(), t2 = this.player.elements.container.getBoundingClientRect(), { container: i2 } = this.elements.thumb, s2 = t2.left - e3.left + 10, n2 = t2.right - e3.left - i2.clientWidth - 10, a2 = this.mousePosX - e3.left - i2.clientWidth / 2, r2 = Ze(a2, s2, n2);
          i2.style.left = `${r2}px`, i2.style.setProperty("--preview-arrow-offset", a2 - r2 + "px");
        }), t(this, "setScrubbingContainerSize", () => {
          const { width: e3, height: t2 } = tt(this.thumbAspectRatio, { width: this.player.media.clientWidth, height: this.player.media.clientHeight });
          this.elements.scrubbing.container.style.width = `${e3}px`, this.elements.scrubbing.container.style.height = `${t2}px`;
        }), t(this, "setImageSizeAndOffset", (e3, t2) => {
          if (!this.usingSprites) return;
          const i2 = this.thumbContainerHeight / t2.h;
          e3.style.height = e3.naturalHeight * i2 + "px", e3.style.width = e3.naturalWidth * i2 + "px", e3.style.left = `-${t2.x * i2}px`, e3.style.top = `-${t2.y * i2}px`;
        }), this.player = e2, this.thumbnails = [], this.loaded = false, this.lastMouseMoveTime = Date.now(), this.mouseDown = false, this.loadedImages = [], this.elements = { thumb: {}, scrubbing: {} }, this.load();
      }
      get enabled() {
        return this.player.isHTML5 && this.player.isVideo && this.player.config.posterThumbnails.enabled;
      }
      get currentImageContainer() {
        return this.mouseDown ? this.elements.scrubbing.container : this.elements.thumb.imageContainer;
      }
      get usingSprites() {
        return Object.keys(this.thumbnails[0].frames[0]).includes("w");
      }
      get thumbAspectRatio() {
        return this.usingSprites ? this.thumbnails[0].frames[0].w / this.thumbnails[0].frames[0].h : this.thumbnails[0].width / this.thumbnails[0].height;
      }
      get thumbContainerHeight() {
        if (this.mouseDown) {
          const { height: e2 } = tt(this.thumbAspectRatio, { width: this.player.media.clientWidth, height: this.player.media.clientHeight });
          return e2;
        }
        return this.sizeSpecifiedInCSS ? this.elements.thumb.imageContainer.clientHeight : Math.floor(this.player.media.clientWidth / this.thumbAspectRatio / 4);
      }
      get currentImageElement() {
        return this.mouseDown ? this.currentScrubbingImageElement : this.currentThumbnailImageElement;
      }
      set currentImageElement(e2) {
        this.mouseDown ? this.currentScrubbingImageElement = e2 : this.currentThumbnailImageElement = e2;
      }
    }
    const st = { insertElements(e2, t2) {
      A.string(t2) ? $(e2, this.media, { src: t2 }) : A.array(t2) && t2.forEach((t3) => {
        $(e2, this.media, t3);
      });
    }, change(e2) {
      L(e2, "sources.length") ? (me.cancelRequests.call(this), this.destroy.call(this, () => {
        this.options.quality = [], j(this.media), this.media = null, A.element(this.elements.container) && this.elements.container.removeAttribute("class");
        const { sources: t2, type: i2 } = e2, [{ provider: s2 = $e.html5, src: n2 }] = t2, a2 = "html5" === s2 ? i2 : "div", r2 = "html5" === s2 ? {} : { src: n2 };
        Object.assign(this, { provider: s2, type: i2, supported: Y.check(i2, s2, this.config.playsinline), media: O(a2, r2) }), this.elements.container.appendChild(this.media), A.boolean(e2.autoplay) && (this.config.autoplay = e2.autoplay), this.isHTML5 && (this.config.crossorigin && this.media.setAttribute("crossorigin", ""), this.config.autoplay && this.media.setAttribute("autoplay", ""), A.empty(e2.poster) || (this.poster = e2.poster), this.config.loop.active && this.media.setAttribute("loop", ""), this.config.muted && this.media.setAttribute("muted", ""), this.config.playsinline && this.media.setAttribute("playsinline", "")), Ue.addStyleHook.call(this), this.isHTML5 && st.insertElements.call(this, "source", t2), this.config.title = e2.title, Je.setup.call(this), this.isHTML5 && Object.keys(e2).includes("tracks") && st.insertElements.call(this, "track", e2.tracks), (this.isHTML5 || this.isEmbed && !this.supported.ui) && Ue.build.call(this), this.isHTML5 && this.media.load(), A.empty(e2.posterThumbnails) || (Object.assign(this.config.posterThumbnails, e2.posterThumbnails), this.posterThumbnails && this.posterThumbnails.loaded && (this.posterThumbnails.destroy(), this.posterThumbnails = null), this.config.posterThumbnails.enabled && (this.posterThumbnails = new it(this))), this.fullscreen.update();
      }, true)) : this.debug.warn("Invalid source format");
    } };
    class nt {
      constructor(e2, i2) {
        if (t(this, "play", () => A.function(this.media.play) ? (this.ads && this.ads.enabled && this.ads.managerPromise.then(() => this.ads.play()).catch(() => se(this.media.play())), this.media.play()) : null), t(this, "pause", () => this.playing && A.function(this.media.pause) ? this.media.pause() : null), t(this, "togglePlay", (e3) => (A.boolean(e3) ? e3 : !this.playing) ? this.play() : this.pause()), t(this, "stop", () => {
          this.isHTML5 ? (this.pause(), this.restart()) : A.function(this.media.stop) && this.media.stop();
        }), t(this, "restart", () => {
          this.currentTime = 0;
        }), t(this, "rewind", (e3) => {
          this.currentTime -= A.number(e3) ? e3 : this.config.seekTime;
        }), t(this, "forward", (e3) => {
          this.currentTime += A.number(e3) ? e3 : this.config.seekTime;
        }), t(this, "increaseVolume", (e3) => {
          const t2 = this.media.muted ? 0 : this.volume;
          this.volume = t2 + (A.number(e3) ? e3 : 0);
        }), t(this, "decreaseVolume", (e3) => {
          this.increaseVolume(-e3);
        }), t(this, "airplay", () => {
          Y.airplay && this.media.webkitShowPlaybackTargetPicker();
        }), t(this, "toggleControls", (e3) => {
          if (this.supported.ui && !this.isAudio) {
            const t2 = U(this.elements.container, this.config.classNames.hideControls), i3 = void 0 === e3 ? void 0 : !e3, s3 = F(this.elements.container, this.config.classNames.hideControls, i3);
            if (s3 && A.array(this.config.controls) && this.config.controls.includes("settings") && !A.empty(this.config.settings) && Me.toggleMenu.call(this, false), s3 !== t2) {
              const e4 = s3 ? "controlshidden" : "controlsshown";
              ee.call(this, this.media, e4);
            }
            return !s3;
          }
          return false;
        }), t(this, "on", (e3, t2) => {
          J.call(this, this.elements.container, e3, t2);
        }), t(this, "once", (e3, t2) => {
          Z.call(this, this.elements.container, e3, t2);
        }), t(this, "off", (e3, t2) => {
          G(this.elements.container, e3, t2);
        }), t(this, "destroy", (e3, t2 = false) => {
          if (!this.ready) return;
          const i3 = () => {
            document.body.style.overflow = "", this.embed = null, t2 ? (Object.keys(this.elements).length && (j(this.elements.buttons.play), j(this.elements.captions), j(this.elements.controls), j(this.elements.wrapper), this.elements.buttons.play = null, this.elements.captions = null, this.elements.controls = null, this.elements.wrapper = null), A.function(e3) && e3()) : (te.call(this), me.cancelRequests.call(this), D(this.elements.original, this.elements.container), ee.call(this, this.elements.original, "destroyed", true), A.function(e3) && e3.call(this.elements.original), this.ready = false, setTimeout(() => {
              this.elements = null, this.media = null;
            }, 200));
          };
          this.stop(), clearTimeout(this.timers.loading), clearTimeout(this.timers.controls), clearTimeout(this.timers.resized), this.isHTML5 ? (Ue.toggleNativeControls.call(this, true), i3()) : this.isYouTube ? (clearInterval(this.timers.buffering), clearInterval(this.timers.playing), null !== this.embed && A.function(this.embed.destroy) && this.embed.destroy(), i3()) : this.isVimeo && (null !== this.embed && this.embed.unload().then(i3), setTimeout(i3, 200));
        }), t(this, "supports", (e3) => Y.mime.call(this, e3)), this.timers = {}, this.ready = false, this.loading = false, this.failed = false, this.touch = Y.touch, this.media = e2, A.string(this.media) && (this.media = document.querySelectorAll(this.media)), (window.jQuery && this.media instanceof jQuery || A.nodeList(this.media) || A.array(this.media)) && (this.media = this.media[0]), this.config = N({}, _e, nt.defaults, i2 || {}, (() => {
          try {
            return JSON.parse(this.media.getAttribute("data-plyr-config"));
          } catch (e3) {
            return {};
          }
        })()), this.elements = { container: null, fullscreen: null, captions: null, buttons: {}, display: {}, progress: {}, inputs: {}, settings: { popup: null, menu: null, panels: {}, buttons: {} } }, this.captions = { active: null, currentTrack: -1, meta: /* @__PURE__ */ new WeakMap() }, this.fullscreen = { active: false }, this.options = { speed: [], quality: [] }, this.debug = new qe(this.config.debug), this.debug.log("Config", this.config), this.debug.log("Support", Y), A.nullOrUndefined(this.media) || !A.element(this.media)) return void this.debug.error("Setup failed: no suitable element passed");
        if (this.media.plyr) return void this.debug.warn("Target already setup");
        if (!this.config.enabled) return void this.debug.error("Setup failed: disabled by config");
        if (!Y.check().api) return void this.debug.error("Setup failed: no support");
        const s2 = this.media.cloneNode(true);
        s2.autoplay = false, this.elements.original = s2;
        const n2 = this.media.tagName.toLowerCase();
        let a2 = null, r2 = null;
        switch (n2) {
          case "div":
            if (a2 = this.media.querySelector("iframe"), A.element(a2)) {
              if (r2 = xe(a2.getAttribute("src")), this.provider = function(e3) {
                return /^(https?:\/\/)?(www\.)?(youtube\.com|youtube-nocookie\.com|youtu\.?be)\/.+$/.test(e3) ? $e.youtube : /^https?:\/\/player.vimeo.com\/video\/\d{0,9}(?=\b|\/)/.test(e3) ? $e.vimeo : null;
              }(r2.toString()), this.elements.container = this.media, this.media = a2, this.elements.container.className = "", r2.search.length) {
                const e3 = ["1", "true"];
                e3.includes(r2.searchParams.get("autoplay")) && (this.config.autoplay = true), e3.includes(r2.searchParams.get("loop")) && (this.config.loop.active = true), this.isYouTube ? (this.config.playsinline = e3.includes(r2.searchParams.get("playsinline")), this.config.youtube.hl = r2.searchParams.get("hl")) : this.config.playsinline = true;
              }
            } else this.provider = this.media.getAttribute(this.config.attributes.embed.provider), this.media.removeAttribute(this.config.attributes.embed.provider);
            if (A.empty(this.provider) || !Object.values($e).includes(this.provider)) return void this.debug.error("Setup failed: Invalid provider");
            this.type = Re;
            break;
          case "video":
          case "audio":
            this.type = n2, this.provider = $e.html5, this.media.hasAttribute("crossorigin") && (this.config.crossorigin = true), this.media.hasAttribute("autoplay") && (this.config.autoplay = true), (this.media.hasAttribute("playsinline") || this.media.hasAttribute("webkit-playsinline")) && (this.config.playsinline = true), this.media.hasAttribute("muted") && (this.config.muted = true), this.media.hasAttribute("loop") && (this.config.loop.active = true);
            break;
          default:
            return void this.debug.error("Setup failed: unsupported type");
        }
        this.supported = Y.check(this.type, this.provider), this.supported.api ? (this.eventListeners = [], this.listeners = new Ve(this), this.storage = new Te(this), this.media.plyr = this, A.element(this.elements.container) || (this.elements.container = O("div"), _(this.media, this.elements.container)), Ue.migrateStyles.call(this), Ue.addStyleHook.call(this), Je.setup.call(this), this.config.debug && J.call(this, this.elements.container, this.config.events.join(" "), (e3) => {
          this.debug.log(`event: ${e3.type}`);
        }), this.fullscreen = new He(this), (this.isHTML5 || this.isEmbed && !this.supported.ui) && Ue.build.call(this), this.listeners.container(), this.listeners.global(), this.config.ads.enabled && (this.ads = new Ge(this)), this.isHTML5 && this.config.autoplay && this.once("canplay", () => se(this.play())), this.lastSeekTime = 0, this.config.posterThumbnails.enabled && (this.posterThumbnails = new it(this))) : this.debug.error("Setup failed: no support");
      }
      get isHTML5() {
        return this.provider === $e.html5;
      }
      get isEmbed() {
        return this.isYouTube || this.isVimeo;
      }
      get isYouTube() {
        return this.provider === $e.youtube;
      }
      get isVimeo() {
        return this.provider === $e.vimeo;
      }
      get isVideo() {
        return this.type === Re;
      }
      get isAudio() {
        return this.type === je;
      }
      get playing() {
        return Boolean(this.ready && !this.paused && !this.ended);
      }
      get paused() {
        return Boolean(this.media.paused);
      }
      get stopped() {
        return Boolean(this.paused && 0 === this.currentTime);
      }
      get ended() {
        return Boolean(this.media.ended);
      }
      set currentTime(e2) {
        if (!this.duration) return;
        const t2 = A.number(e2) && e2 > 0;
        this.media.currentTime = t2 ? Math.min(e2, this.duration) : 0, this.debug.log(`Seeking to ${this.currentTime} seconds`);
      }
      get currentTime() {
        return Number(this.media.currentTime);
      }
      get buffered() {
        const { buffered: e2 } = this.media;
        return A.number(e2) ? e2 : e2 && e2.length && this.duration > 0 ? e2.end(0) / this.duration : 0;
      }
      get seeking() {
        return Boolean(this.media.seeking);
      }
      get duration() {
        const e2 = parseFloat(this.config.duration), t2 = (this.media || {}).duration, i2 = A.number(t2) && t2 !== 1 / 0 ? t2 : 0;
        return e2 || i2;
      }
      set volume(e2) {
        let t2 = e2;
        A.string(t2) && (t2 = Number(t2)), A.number(t2) || (t2 = this.storage.get("volume")), A.number(t2) || ({ volume: t2 } = this.config), t2 > 1 && (t2 = 1), t2 < 0 && (t2 = 0), this.config.volume = t2, this.media.volume = t2, !A.empty(e2) && this.muted && t2 > 0 && (this.muted = false);
      }
      get volume() {
        return Number(this.media.volume);
      }
      set muted(e2) {
        let t2 = e2;
        A.boolean(t2) || (t2 = this.storage.get("muted")), A.boolean(t2) || (t2 = this.config.muted), this.config.muted = t2, this.media.muted = t2;
      }
      get muted() {
        return Boolean(this.media.muted);
      }
      get hasAudio() {
        return !this.isHTML5 || (!!this.isAudio || (Boolean(this.media.mozHasAudio) || Boolean(this.media.webkitAudioDecodedByteCount) || Boolean(this.media.audioTracks && this.media.audioTracks.length)));
      }
      set speed(e2) {
        let t2 = null;
        A.number(e2) && (t2 = e2), A.number(t2) || (t2 = this.storage.get("speed")), A.number(t2) || (t2 = this.config.speed.selected);
        const { minimumSpeed: i2, maximumSpeed: s2 } = this;
        t2 = Ze(t2, i2, s2), this.config.speed.selected = t2, setTimeout(() => {
          this.media && (this.media.playbackRate = t2);
        }, 0);
      }
      get speed() {
        return Number(this.media.playbackRate);
      }
      get minimumSpeed() {
        return this.isYouTube ? Math.min(...this.options.speed) : this.isVimeo ? 0.5 : 0.0625;
      }
      get maximumSpeed() {
        return this.isYouTube ? Math.max(...this.options.speed) : this.isVimeo ? 2 : 16;
      }
      set quality(e2) {
        const t2 = this.config.quality, i2 = this.options.quality;
        if (!i2.length) return;
        let s2 = [!A.empty(e2) && Number(e2), this.storage.get("quality"), t2.selected, t2.default].find(A.number), n2 = true;
        if (!i2.includes(s2)) {
          const e3 = ae(i2, s2);
          this.debug.warn(`Unsupported quality option: ${s2}, using ${e3} instead`), s2 = e3, n2 = false;
        }
        t2.selected = s2, this.media.quality = s2, n2 && this.storage.set({ quality: s2 });
      }
      get quality() {
        return this.media.quality;
      }
      set loop(e2) {
        const t2 = A.boolean(e2) ? e2 : this.config.loop.active;
        this.config.loop.active = t2, this.media.loop = t2;
      }
      get loop() {
        return Boolean(this.media.loop);
      }
      set source(e2) {
        st.change.call(this, e2);
      }
      get source() {
        return this.media.currentSrc;
      }
      get download() {
        const { download: e2 } = this.config.urls;
        return A.url(e2) ? e2 : this.source;
      }
      set download(e2) {
        A.url(e2) && (this.config.urls.download = e2, Me.setDownloadUrl.call(this));
      }
      set poster(e2) {
        this.isVideo ? Ue.setPoster.call(this, e2, false).catch(() => {
        }) : this.debug.warn("Poster can only be set for video");
      }
      get poster() {
        return this.isVideo ? this.media.getAttribute("poster") || this.media.getAttribute("data-poster") : null;
      }
      get ratio() {
        if (!this.isVideo) return null;
        const e2 = ce(ue.call(this));
        return A.array(e2) ? e2.join(":") : e2;
      }
      set ratio(e2) {
        this.isVideo ? A.string(e2) && le(e2) ? (this.config.ratio = ce(e2), he.call(this)) : this.debug.error(`Invalid aspect ratio specified (${e2})`) : this.debug.warn("Aspect ratio can only be set for video");
      }
      set autoplay(e2) {
        this.config.autoplay = A.boolean(e2) ? e2 : this.config.autoplay;
      }
      get autoplay() {
        return Boolean(this.config.autoplay);
      }
      toggleCaptions(e2) {
        Ne.toggle.call(this, e2, false);
      }
      set currentTrack(e2) {
        Ne.set.call(this, e2, false), Ne.setup.call(this);
      }
      get currentTrack() {
        const { toggled: e2, currentTrack: t2 } = this.captions;
        return e2 ? t2 : -1;
      }
      set language(e2) {
        Ne.setLanguage.call(this, e2, false);
      }
      get language() {
        return (Ne.getCurrentTrack.call(this) || {}).language;
      }
      set pip(e2) {
        if (!Y.pip) return;
        const t2 = A.boolean(e2) ? e2 : !this.pip;
        A.function(this.media.webkitSetPresentationMode) && this.media.webkitSetPresentationMode(t2 ? Ie : Oe), A.function(this.media.requestPictureInPicture) && (!this.pip && t2 ? this.media.requestPictureInPicture() : this.pip && !t2 && document.exitPictureInPicture());
      }
      get pip() {
        return Y.pip ? A.empty(this.media.webkitPresentationMode) ? this.media === document.pictureInPictureElement : this.media.webkitPresentationMode === Ie : null;
      }
      setposterThumbnails(e2) {
        this.posterThumbnails && this.posterThumbnails.loaded && (this.posterThumbnails.destroy(), this.posterThumbnails = null), Object.assign(this.config.posterThumbnails, e2), this.config.posterThumbnails.enabled && (this.posterThumbnails = new it(this));
      }
      static supported(e2, t2) {
        return Y.check(e2, t2);
      }
      static loadSprite(e2, t2) {
        return Ee(e2, t2);
      }
      static setup(e2, t2 = {}) {
        let i2 = null;
        return A.string(e2) ? i2 = Array.from(document.querySelectorAll(e2)) : A.nodeList(e2) ? i2 = Array.from(e2) : A.array(e2) && (i2 = e2.filter(A.element)), A.empty(i2) ? null : i2.map((e3) => new nt(e3, t2));
      }
    }
    var at;
    return nt.defaults = (at = _e, JSON.parse(JSON.stringify(at))), nt;
  });
  /*! @vimeo/player v2.20.1 | (c) 2023 Vimeo | MIT License | https://github.com/vimeo/player.js */
  !function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : ((e = "undefined" != typeof globalThis ? globalThis : e || self).Vimeo = e.Vimeo || {}, e.Vimeo.Player = t());
  }(void 0, function() {
    function r(t2, e2) {
      var n2, r2 = Object.keys(t2);
      return Object.getOwnPropertySymbols && (n2 = Object.getOwnPropertySymbols(t2), e2 && (n2 = n2.filter(function(e3) {
        return Object.getOwnPropertyDescriptor(t2, e3).enumerable;
      })), r2.push.apply(r2, n2)), r2;
    }
    function u(t2) {
      for (var e2 = 1; e2 < arguments.length; e2++) {
        var n2 = null != arguments[e2] ? arguments[e2] : {};
        e2 % 2 ? r(Object(n2), true).forEach(function(e3) {
          s(t2, e3, n2[e3]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t2, Object.getOwnPropertyDescriptors(n2)) : r(Object(n2)).forEach(function(e3) {
          Object.defineProperty(t2, e3, Object.getOwnPropertyDescriptor(n2, e3));
        });
      }
      return t2;
    }
    function j() {
      j = function() {
        return a2;
      };
      var a2 = {}, e2 = Object.prototype, s2 = e2.hasOwnProperty, f2 = Object.defineProperty || function(e3, t3, n3) {
        e3[t3] = n3.value;
      }, t2 = "function" == typeof Symbol ? Symbol : {}, o2 = t2.iterator || "@@iterator", n2 = t2.asyncIterator || "@@asyncIterator", r2 = t2.toStringTag || "@@toStringTag";
      function i2(e3, t3, n3) {
        return Object.defineProperty(e3, t3, { value: n3, enumerable: true, configurable: true, writable: true }), e3[t3];
      }
      try {
        i2({}, "");
      } catch (e3) {
        i2 = function(e4, t3, n3) {
          return e4[t3] = n3;
        };
      }
      function u2(e3, t3, n3, r3) {
        var i3, a3, u3, c3, o3 = t3 && t3.prototype instanceof p2 ? t3 : p2, l3 = Object.create(o3.prototype), s3 = new x2(r3 || []);
        return f2(l3, "_invoke", { value: (i3 = e3, a3 = n3, u3 = s3, c3 = "suspendedStart", function(e4, t4) {
          if ("executing" === c3) throw new Error("Generator is already running");
          if ("completed" === c3) {
            if ("throw" === e4) throw t4;
            return T2();
          }
          for (u3.method = e4, u3.arg = t4; ; ) {
            var n4 = u3.delegate;
            if (n4) {
              var r4 = function e5(t5, n5) {
                var r5 = n5.method, o5 = t5.iterator[r5];
                if (void 0 === o5) return n5.delegate = null, "throw" === r5 && t5.iterator.return && (n5.method = "return", n5.arg = void 0, e5(t5, n5), "throw" === n5.method) || "return" !== r5 && (n5.method = "throw", n5.arg = new TypeError("The iterator does not provide a '" + r5 + "' method")), h2;
                var i4 = d2(o5, t5.iterator, n5.arg);
                if ("throw" === i4.type) return n5.method = "throw", n5.arg = i4.arg, n5.delegate = null, h2;
                var a4 = i4.arg;
                return a4 ? a4.done ? (n5[t5.resultName] = a4.value, n5.next = t5.nextLoc, "return" !== n5.method && (n5.method = "next", n5.arg = void 0), n5.delegate = null, h2) : a4 : (n5.method = "throw", n5.arg = new TypeError("iterator result is not an object"), n5.delegate = null, h2);
              }(n4, u3);
              if (r4) {
                if (r4 === h2) continue;
                return r4;
              }
            }
            if ("next" === u3.method) u3.sent = u3._sent = u3.arg;
            else if ("throw" === u3.method) {
              if ("suspendedStart" === c3) throw c3 = "completed", u3.arg;
              u3.dispatchException(u3.arg);
            } else "return" === u3.method && u3.abrupt("return", u3.arg);
            c3 = "executing";
            var o4 = d2(i3, a3, u3);
            if ("normal" === o4.type) {
              if (c3 = u3.done ? "completed" : "suspendedYield", o4.arg === h2) continue;
              return { value: o4.arg, done: u3.done };
            }
            "throw" === o4.type && (c3 = "completed", u3.method = "throw", u3.arg = o4.arg);
          }
        }) }), l3;
      }
      function d2(e3, t3, n3) {
        try {
          return { type: "normal", arg: e3.call(t3, n3) };
        } catch (e4) {
          return { type: "throw", arg: e4 };
        }
      }
      a2.wrap = u2;
      var h2 = {};
      function p2() {
      }
      function c2() {
      }
      function l2() {
      }
      var v2 = {};
      i2(v2, o2, function() {
        return this;
      });
      var y2 = Object.getPrototypeOf, m2 = y2 && y2(y2(P2([])));
      m2 && m2 !== e2 && s2.call(m2, o2) && (v2 = m2);
      var g2 = l2.prototype = p2.prototype = Object.create(v2);
      function w2(e3) {
        ["next", "throw", "return"].forEach(function(t3) {
          i2(e3, t3, function(e4) {
            return this._invoke(t3, e4);
          });
        });
      }
      function b2(c3, l3) {
        var t3;
        f2(this, "_invoke", { value: function(n3, r3) {
          function e3() {
            return new l3(function(e4, t4) {
              !function t5(e5, n4, r4, o3) {
                var i3 = d2(c3[e5], c3, n4);
                if ("throw" !== i3.type) {
                  var a3 = i3.arg, u3 = a3.value;
                  return u3 && "object" == typeof u3 && s2.call(u3, "__await") ? l3.resolve(u3.__await).then(function(e6) {
                    t5("next", e6, r4, o3);
                  }, function(e6) {
                    t5("throw", e6, r4, o3);
                  }) : l3.resolve(u3).then(function(e6) {
                    a3.value = e6, r4(a3);
                  }, function(e6) {
                    return t5("throw", e6, r4, o3);
                  });
                }
                o3(i3.arg);
              }(n3, r3, e4, t4);
            });
          }
          return t3 = t3 ? t3.then(e3, e3) : e3();
        } });
      }
      function k2(e3) {
        var t3 = { tryLoc: e3[0] };
        1 in e3 && (t3.catchLoc = e3[1]), 2 in e3 && (t3.finallyLoc = e3[2], t3.afterLoc = e3[3]), this.tryEntries.push(t3);
      }
      function E2(e3) {
        var t3 = e3.completion || {};
        t3.type = "normal", delete t3.arg, e3.completion = t3;
      }
      function x2(e3) {
        this.tryEntries = [{ tryLoc: "root" }], e3.forEach(k2, this), this.reset(true);
      }
      function P2(t3) {
        if (t3) {
          var e3 = t3[o2];
          if (e3) return e3.call(t3);
          if ("function" == typeof t3.next) return t3;
          if (!isNaN(t3.length)) {
            var n3 = -1, r3 = function e4() {
              for (; ++n3 < t3.length; ) if (s2.call(t3, n3)) return e4.value = t3[n3], e4.done = false, e4;
              return e4.value = void 0, e4.done = true, e4;
            };
            return r3.next = r3;
          }
        }
        return { next: T2 };
      }
      function T2() {
        return { value: void 0, done: true };
      }
      return f2(g2, "constructor", { value: c2.prototype = l2, configurable: true }), f2(l2, "constructor", { value: c2, configurable: true }), c2.displayName = i2(l2, r2, "GeneratorFunction"), a2.isGeneratorFunction = function(e3) {
        var t3 = "function" == typeof e3 && e3.constructor;
        return !!t3 && (t3 === c2 || "GeneratorFunction" === (t3.displayName || t3.name));
      }, a2.mark = function(e3) {
        return Object.setPrototypeOf ? Object.setPrototypeOf(e3, l2) : (e3.__proto__ = l2, i2(e3, r2, "GeneratorFunction")), e3.prototype = Object.create(g2), e3;
      }, a2.awrap = function(e3) {
        return { __await: e3 };
      }, w2(b2.prototype), i2(b2.prototype, n2, function() {
        return this;
      }), a2.AsyncIterator = b2, a2.async = function(e3, t3, n3, r3, o3) {
        void 0 === o3 && (o3 = Promise);
        var i3 = new b2(u2(e3, t3, n3, r3), o3);
        return a2.isGeneratorFunction(t3) ? i3 : i3.next().then(function(e4) {
          return e4.done ? e4.value : i3.next();
        });
      }, w2(g2), i2(g2, r2, "Generator"), i2(g2, o2, function() {
        return this;
      }), i2(g2, "toString", function() {
        return "[object Generator]";
      }), a2.keys = function(e3) {
        var n3 = Object(e3), r3 = [];
        for (var t3 in n3) r3.push(t3);
        return r3.reverse(), function e4() {
          for (; r3.length; ) {
            var t4 = r3.pop();
            if (t4 in n3) return e4.value = t4, e4.done = false, e4;
          }
          return e4.done = true, e4;
        };
      }, a2.values = P2, x2.prototype = { constructor: x2, reset: function(e3) {
        if (this.prev = 0, this.next = 0, this.sent = this._sent = void 0, this.done = false, this.delegate = null, this.method = "next", this.arg = void 0, this.tryEntries.forEach(E2), !e3) for (var t3 in this) "t" === t3.charAt(0) && s2.call(this, t3) && !isNaN(+t3.slice(1)) && (this[t3] = void 0);
      }, stop: function() {
        this.done = true;
        var e3 = this.tryEntries[0].completion;
        if ("throw" === e3.type) throw e3.arg;
        return this.rval;
      }, dispatchException: function(n3) {
        if (this.done) throw n3;
        var r3 = this;
        function e3(e4, t4) {
          return i3.type = "throw", i3.arg = n3, r3.next = e4, t4 && (r3.method = "next", r3.arg = void 0), !!t4;
        }
        for (var t3 = this.tryEntries.length - 1; 0 <= t3; --t3) {
          var o3 = this.tryEntries[t3], i3 = o3.completion;
          if ("root" === o3.tryLoc) return e3("end");
          if (o3.tryLoc <= this.prev) {
            var a3 = s2.call(o3, "catchLoc"), u3 = s2.call(o3, "finallyLoc");
            if (a3 && u3) {
              if (this.prev < o3.catchLoc) return e3(o3.catchLoc, true);
              if (this.prev < o3.finallyLoc) return e3(o3.finallyLoc);
            } else if (a3) {
              if (this.prev < o3.catchLoc) return e3(o3.catchLoc, true);
            } else {
              if (!u3) throw new Error("try statement without catch or finally");
              if (this.prev < o3.finallyLoc) return e3(o3.finallyLoc);
            }
          }
        }
      }, abrupt: function(e3, t3) {
        for (var n3 = this.tryEntries.length - 1; 0 <= n3; --n3) {
          var r3 = this.tryEntries[n3];
          if (r3.tryLoc <= this.prev && s2.call(r3, "finallyLoc") && this.prev < r3.finallyLoc) {
            var o3 = r3;
            break;
          }
        }
        o3 && ("break" === e3 || "continue" === e3) && o3.tryLoc <= t3 && t3 <= o3.finallyLoc && (o3 = null);
        var i3 = o3 ? o3.completion : {};
        return i3.type = e3, i3.arg = t3, o3 ? (this.method = "next", this.next = o3.finallyLoc, h2) : this.complete(i3);
      }, complete: function(e3, t3) {
        if ("throw" === e3.type) throw e3.arg;
        return "break" === e3.type || "continue" === e3.type ? this.next = e3.arg : "return" === e3.type ? (this.rval = this.arg = e3.arg, this.method = "return", this.next = "end") : "normal" === e3.type && t3 && (this.next = t3), h2;
      }, finish: function(e3) {
        for (var t3 = this.tryEntries.length - 1; 0 <= t3; --t3) {
          var n3 = this.tryEntries[t3];
          if (n3.finallyLoc === e3) return this.complete(n3.completion, n3.afterLoc), E2(n3), h2;
        }
      }, catch: function(e3) {
        for (var t3 = this.tryEntries.length - 1; 0 <= t3; --t3) {
          var n3 = this.tryEntries[t3];
          if (n3.tryLoc === e3) {
            var r3, o3 = n3.completion;
            return "throw" === o3.type && (r3 = o3.arg, E2(n3)), r3;
          }
        }
        throw new Error("illegal catch attempt");
      }, delegateYield: function(e3, t3, n3) {
        return this.delegate = { iterator: P2(e3), resultName: t3, nextLoc: n3 }, "next" === this.method && (this.arg = void 0), h2;
      } }, a2;
    }
    function c(e2, t2, n2, r2, o2, i2, a2) {
      try {
        var u2 = e2[i2](a2), c2 = u2.value;
      } catch (e3) {
        return void n2(e3);
      }
      u2.done ? t2(c2) : Promise.resolve(c2).then(r2, o2);
    }
    function h(u2) {
      return function() {
        var e2 = this, a2 = arguments;
        return new Promise(function(t2, n2) {
          var r2 = u2.apply(e2, a2);
          function o2(e3) {
            c(r2, t2, n2, o2, i2, "next", e3);
          }
          function i2(e3) {
            c(r2, t2, n2, o2, i2, "throw", e3);
          }
          o2(void 0);
        });
      };
    }
    function l(e2, t2) {
      if (!(e2 instanceof t2)) throw new TypeError("Cannot call a class as a function");
    }
    function o(e2, t2) {
      for (var n2 = 0; n2 < t2.length; n2++) {
        var r2 = t2[n2];
        r2.enumerable = r2.enumerable || false, r2.configurable = true, "value" in r2 && (r2.writable = true), Object.defineProperty(e2, y(r2.key), r2);
      }
    }
    function e(e2, t2, n2) {
      return t2 && o(e2.prototype, t2), Object.defineProperty(e2, "prototype", { writable: false }), e2;
    }
    function s(e2, t2, n2) {
      return (t2 = y(t2)) in e2 ? Object.defineProperty(e2, t2, { value: n2, enumerable: true, configurable: true, writable: true }) : e2[t2] = n2, e2;
    }
    function i(e2) {
      return (i = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(e3) {
        return e3.__proto__ || Object.getPrototypeOf(e3);
      })(e2);
    }
    function f(e2, t2) {
      return (f = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(e3, t3) {
        return e3.__proto__ = t3, e3;
      })(e2, t2);
    }
    function a() {
      if ("undefined" == typeof Reflect || !Reflect.construct) return false;
      if (Reflect.construct.sham) return false;
      if ("function" == typeof Proxy) return true;
      try {
        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
        })), true;
      } catch (e2) {
        return false;
      }
    }
    function d(e2, t2, n2) {
      return (d = a() ? Reflect.construct.bind() : function(e3, t3, n3) {
        var r2 = [null];
        r2.push.apply(r2, t3);
        var o2 = new (Function.bind.apply(e3, r2))();
        return n3 && f(o2, n3.prototype), o2;
      }).apply(null, arguments);
    }
    function t(e2) {
      var r2 = "function" == typeof Map ? /* @__PURE__ */ new Map() : void 0;
      return (t = function(e3) {
        if (null === e3 || (t2 = e3, -1 === Function.toString.call(t2).indexOf("[native code]"))) return e3;
        var t2;
        if ("function" != typeof e3) throw new TypeError("Super expression must either be null or a function");
        if (void 0 !== r2) {
          if (r2.has(e3)) return r2.get(e3);
          r2.set(e3, n2);
        }
        function n2() {
          return d(e3, arguments, i(this).constructor);
        }
        return n2.prototype = Object.create(e3.prototype, { constructor: { value: n2, enumerable: false, writable: true, configurable: true } }), f(n2, e3);
      })(e2);
    }
    function p(e2) {
      if (void 0 === e2) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      return e2;
    }
    function v(n2) {
      var r2 = a();
      return function() {
        var e2, t2 = i(n2);
        return function(e3, t3) {
          if (t3 && ("object" == typeof t3 || "function" == typeof t3)) return t3;
          if (void 0 !== t3) throw new TypeError("Derived constructors may only return object or undefined");
          return p(e3);
        }(this, r2 ? (e2 = i(this).constructor, Reflect.construct(t2, arguments, e2)) : t2.apply(this, arguments));
      };
    }
    function y(e2) {
      var t2 = function(e3, t3) {
        if ("object" != typeof e3 || null === e3) return e3;
        var n2 = e3[Symbol.toPrimitive];
        if (void 0 === n2) return ("string" === t3 ? String : Number)(e3);
        var r2 = n2.call(e3, t3);
        if ("object" != typeof r2) return r2;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }(e2, "string");
      return "symbol" == typeof t2 ? t2 : String(t2);
    }
    var n = "undefined" != typeof global && "[object global]" === {}.toString.call(global);
    function m(e2, t2) {
      return 0 === e2.indexOf(t2.toLowerCase()) ? e2 : "".concat(t2.toLowerCase()).concat(e2.substr(0, 1).toUpperCase()).concat(e2.substr(1));
    }
    function g(e2) {
      return /^(https?:)?\/\/((player|www)\.)?vimeo\.com(?=$|\/)/.test(e2);
    }
    function w(e2) {
      return /^https:\/\/player\.vimeo\.com\/video\/\d+/.test(e2);
    }
    function b(e2) {
      var t2, n2 = 0 < arguments.length && void 0 !== e2 ? e2 : {}, r2 = n2.id, o2 = n2.url, i2 = r2 || o2;
      if (!i2) throw new Error("An id or url must be passed, either in an options object or as a data-vimeo-id or data-vimeo-url attribute.");
      if (t2 = i2, !isNaN(parseFloat(t2)) && isFinite(t2) && Math.floor(t2) == t2) return "https://vimeo.com/".concat(i2);
      if (g(i2)) return i2.replace("http:", "https:");
      if (r2) throw new TypeError("“".concat(r2, "” is not a valid video id."));
      throw new TypeError("“".concat(i2, "” is not a vimeo.com url."));
    }
    function k(t2, e2, n2, r2, o2) {
      var i2 = 3 < arguments.length && void 0 !== r2 ? r2 : "addEventListener", a2 = 4 < arguments.length && void 0 !== o2 ? o2 : "removeEventListener", u2 = "string" == typeof e2 ? [e2] : e2;
      return u2.forEach(function(e3) {
        t2[i2](e3, n2);
      }), { cancel: function() {
        return u2.forEach(function(e3) {
          return t2[a2](e3, n2);
        });
      } };
    }
    var E = void 0 !== Array.prototype.indexOf, x = "undefined" != typeof window && void 0 !== window.postMessage;
    if (!(n || E && x)) throw new Error("Sorry, the Vimeo Player API is not available in this browser.");
    var P, T, O, _, M = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};
    function S() {
      if (void 0 === this) throw new TypeError("Constructor WeakMap requires 'new'");
      if (_(this, "_id", "_WeakMap_" + N() + "." + N()), 0 < arguments.length) throw new TypeError("WeakMap iterable is not supported");
    }
    function C(e2, t2) {
      if (!F(e2) || !T.call(e2, "_id")) throw new TypeError(t2 + " method called on incompatible receiver " + typeof e2);
    }
    function N() {
      return Math.random().toString().substring(2);
    }
    function F(e2) {
      return Object(e2) === e2;
    }
    (P = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : "undefined" != typeof window ? window : M).WeakMap || (T = Object.prototype.hasOwnProperty, O = Object.defineProperty && function() {
      try {
        return 1 === Object.defineProperty({}, "x", { value: 1 }).x;
      } catch (e2) {
      }
    }(), _ = function(e2, t2, n2) {
      O ? Object.defineProperty(e2, t2, { configurable: true, writable: true, value: n2 }) : e2[t2] = n2;
    }, P.WeakMap = (_(S.prototype, "delete", function(e2) {
      if (C(this, "delete"), !F(e2)) return false;
      var t2 = e2[this._id];
      return !(!t2 || t2[0] !== e2) && (delete e2[this._id], true);
    }), _(S.prototype, "get", function(e2) {
      if (C(this, "get"), F(e2)) {
        var t2 = e2[this._id];
        return t2 && t2[0] === e2 ? t2[1] : void 0;
      }
    }), _(S.prototype, "has", function(e2) {
      if (C(this, "has"), !F(e2)) return false;
      var t2 = e2[this._id];
      return !(!t2 || t2[0] !== e2);
    }), _(S.prototype, "set", function(e2, t2) {
      if (C(this, "set"), !F(e2)) throw new TypeError("Invalid value used as weak map key");
      var n2 = e2[this._id];
      return n2 && n2[0] === e2 ? n2[1] = t2 : _(e2, this._id, [e2, t2]), this;
    }), _(S, "_polyfill", true), S));
    var L, A = (function(e2) {
      var t2, n2, r2;
      r2 = function() {
        var t3, n3, r3, o2, i2, a2, e3 = Object.prototype.toString, u2 = "undefined" != typeof setImmediate ? function(e4) {
          return setImmediate(e4);
        } : setTimeout;
        try {
          Object.defineProperty({}, "x", {}), t3 = function(e4, t4, n4, r4) {
            return Object.defineProperty(e4, t4, { value: n4, writable: true, configurable: false !== r4 });
          };
        } catch (e4) {
          t3 = function(e5, t4, n4) {
            return e5[t4] = n4, e5;
          };
        }
        function c2(e4, t4) {
          this.fn = e4, this.self = t4, this.next = void 0;
        }
        function l2(e4, t4) {
          r3.add(e4, t4), n3 = n3 || u2(r3.drain);
        }
        function s2(e4) {
          var t4, n4 = typeof e4;
          return null == e4 || "object" != n4 && "function" != n4 || (t4 = e4.then), "function" == typeof t4 && t4;
        }
        function f2() {
          for (var e4 = 0; e4 < this.chain.length; e4++) !function(e5, t4, n4) {
            var r4, o3;
            try {
              false === t4 ? n4.reject(e5.msg) : (r4 = true === t4 ? e5.msg : t4.call(void 0, e5.msg)) === n4.promise ? n4.reject(TypeError("Promise-chain cycle")) : (o3 = s2(r4)) ? o3.call(r4, n4.resolve, n4.reject) : n4.resolve(r4);
            } catch (e6) {
              n4.reject(e6);
            }
          }(this, 1 === this.state ? this.chain[e4].success : this.chain[e4].failure, this.chain[e4]);
          this.chain.length = 0;
        }
        function d2(e4) {
          var n4, r4 = this;
          if (!r4.triggered) {
            r4.triggered = true, r4.def && (r4 = r4.def);
            try {
              (n4 = s2(e4)) ? l2(function() {
                var t4 = new v2(r4);
                try {
                  n4.call(e4, function() {
                    d2.apply(t4, arguments);
                  }, function() {
                    h2.apply(t4, arguments);
                  });
                } catch (e5) {
                  h2.call(t4, e5);
                }
              }) : (r4.msg = e4, r4.state = 1, 0 < r4.chain.length && l2(f2, r4));
            } catch (e5) {
              h2.call(new v2(r4), e5);
            }
          }
        }
        function h2(e4) {
          var t4 = this;
          t4.triggered || (t4.triggered = true, t4.def && (t4 = t4.def), t4.msg = e4, t4.state = 2, 0 < t4.chain.length && l2(f2, t4));
        }
        function p2(e4, n4, r4, o3) {
          for (var t4 = 0; t4 < n4.length; t4++) !function(t5) {
            e4.resolve(n4[t5]).then(function(e5) {
              r4(t5, e5);
            }, o3);
          }(t4);
        }
        function v2(e4) {
          this.def = e4, this.triggered = false;
        }
        function y2(e4) {
          this.promise = e4, this.state = 0, this.triggered = false, this.chain = [], this.msg = void 0;
        }
        function m2(e4) {
          if ("function" != typeof e4) throw TypeError("Not a function");
          if (0 !== this.__NPO__) throw TypeError("Not a promise");
          this.__NPO__ = 1;
          var r4 = new y2(this);
          this.then = function(e5, t4) {
            var n4 = { success: "function" != typeof e5 || e5, failure: "function" == typeof t4 && t4 };
            return n4.promise = new this.constructor(function(e6, t5) {
              if ("function" != typeof e6 || "function" != typeof t5) throw TypeError("Not a function");
              n4.resolve = e6, n4.reject = t5;
            }), r4.chain.push(n4), 0 !== r4.state && l2(f2, r4), n4.promise;
          }, this.catch = function(e5) {
            return this.then(void 0, e5);
          };
          try {
            e4.call(void 0, function(e5) {
              d2.call(r4, e5);
            }, function(e5) {
              h2.call(r4, e5);
            });
          } catch (e5) {
            h2.call(r4, e5);
          }
        }
        var g2 = t3({}, "constructor", m2, !(r3 = { add: function(e4, t4) {
          a2 = new c2(e4, t4), i2 ? i2.next = a2 : o2 = a2, i2 = a2, a2 = void 0;
        }, drain: function() {
          var e4 = o2;
          for (o2 = i2 = n3 = void 0; e4; ) e4.fn.call(e4.self), e4 = e4.next;
        } }));
        return t3(m2.prototype = g2, "__NPO__", 0, false), t3(m2, "resolve", function(n4) {
          return n4 && "object" == typeof n4 && 1 === n4.__NPO__ ? n4 : new this(function(e4, t4) {
            if ("function" != typeof e4 || "function" != typeof t4) throw TypeError("Not a function");
            e4(n4);
          });
        }), t3(m2, "reject", function(n4) {
          return new this(function(e4, t4) {
            if ("function" != typeof e4 || "function" != typeof t4) throw TypeError("Not a function");
            t4(n4);
          });
        }), t3(m2, "all", function(t4) {
          var a3 = this;
          return "[object Array]" != e3.call(t4) ? a3.reject(TypeError("Not an array")) : 0 === t4.length ? a3.resolve([]) : new a3(function(n4, e4) {
            if ("function" != typeof n4 || "function" != typeof e4) throw TypeError("Not a function");
            var r4 = t4.length, o3 = Array(r4), i3 = 0;
            p2(a3, t4, function(e5, t5) {
              o3[e5] = t5, ++i3 === r4 && n4(o3);
            }, e4);
          });
        }), t3(m2, "race", function(t4) {
          var r4 = this;
          return "[object Array]" != e3.call(t4) ? r4.reject(TypeError("Not an array")) : new r4(function(n4, e4) {
            if ("function" != typeof n4 || "function" != typeof e4) throw TypeError("Not a function");
            p2(r4, t4, function(e5, t5) {
              n4(t5);
            }, e4);
          });
        }), m2;
      }, (n2 = M)[t2 = "Promise"] = n2[t2] || r2(), e2.exports && (e2.exports = n2[t2]);
    }(L = { exports: {} }), L.exports), R = /* @__PURE__ */ new WeakMap();
    function q(e2, t2, n2) {
      var r2 = R.get(e2.element) || {};
      t2 in r2 || (r2[t2] = []), r2[t2].push(n2), R.set(e2.element, r2);
    }
    function I(e2, t2) {
      return (R.get(e2.element) || {})[t2] || [];
    }
    function V(e2, t2, n2) {
      var r2 = R.get(e2.element) || {};
      if (!r2[t2]) return true;
      if (!n2) return r2[t2] = [], R.set(e2.element, r2), true;
      var o2 = r2[t2].indexOf(n2);
      return -1 !== o2 && r2[t2].splice(o2, 1), R.set(e2.element, r2), r2[t2] && 0 === r2[t2].length;
    }
    function D(e2) {
      if ("string" == typeof e2) try {
        e2 = JSON.parse(e2);
      } catch (e3) {
        return console.warn(e3), {};
      }
      return e2;
    }
    function W(e2, t2, n2) {
      var r2, o2;
      e2.element.contentWindow && e2.element.contentWindow.postMessage && (r2 = { method: t2 }, void 0 !== n2 && (r2.value = n2), 8 <= (o2 = parseFloat(navigator.userAgent.toLowerCase().replace(/^.*msie (\d+).*$/, "$1"))) && o2 < 10 && (r2 = JSON.stringify(r2)), e2.element.contentWindow.postMessage(r2, e2.origin));
    }
    function z(n2, r2) {
      var t2, e2, o2 = [];
      (r2 = D(r2)).event ? ("error" === r2.event && I(n2, r2.data.method).forEach(function(e3) {
        var t3 = new Error(r2.data.message);
        t3.name = r2.data.name, e3.reject(t3), V(n2, r2.data.method, e3);
      }), o2 = I(n2, "event:".concat(r2.event)), t2 = r2.data) : !r2.method || (e2 = function(e3, t3) {
        var n3 = I(e3, t3);
        if (n3.length < 1) return false;
        var r3 = n3.shift();
        return V(e3, t3, r3), r3;
      }(n2, r2.method)) && (o2.push(e2), t2 = r2.value), o2.forEach(function(e3) {
        try {
          if ("function" == typeof e3) return void e3.call(n2, t2);
          e3.resolve(t2);
        } catch (e4) {
        }
      });
    }
    var U = ["autopause", "autoplay", "background", "byline", "color", "colors", "controls", "dnt", "height", "id", "interactive_params", "keyboard", "loop", "maxheight", "maxwidth", "muted", "playsinline", "portrait", "responsive", "speed", "texttrack", "title", "transparent", "url", "width"];
    function G(r2, e2) {
      var t2 = 1 < arguments.length && void 0 !== e2 ? e2 : {};
      return U.reduce(function(e3, t3) {
        var n2 = r2.getAttribute("data-vimeo-".concat(t3));
        return !n2 && "" !== n2 || (e3[t3] = "" === n2 ? 1 : n2), e3;
      }, t2);
    }
    function B(e2, t2) {
      var n2 = e2.html;
      if (!t2) throw new TypeError("An element must be provided");
      if (null !== t2.getAttribute("data-vimeo-initialized")) return t2.querySelector("iframe");
      var r2 = document.createElement("div");
      return r2.innerHTML = n2, t2.appendChild(r2.firstChild), t2.setAttribute("data-vimeo-initialized", "true"), t2.querySelector("iframe");
    }
    function H(i2, e2, t2) {
      var a2 = 1 < arguments.length && void 0 !== e2 ? e2 : {}, u2 = 2 < arguments.length ? t2 : void 0;
      return new Promise(function(t3, n2) {
        if (!g(i2)) throw new TypeError("“".concat(i2, "” is not a vimeo.com url."));
        var e3 = "https://vimeo.com/api/oembed.json?url=".concat(encodeURIComponent(i2));
        for (var r2 in a2) a2.hasOwnProperty(r2) && (e3 += "&".concat(r2, "=").concat(encodeURIComponent(a2[r2])));
        var o2 = new ("XDomainRequest" in window ? XDomainRequest : XMLHttpRequest)();
        o2.open("GET", e3, true), o2.onload = function() {
          if (404 !== o2.status) if (403 !== o2.status) try {
            var e4 = JSON.parse(o2.responseText);
            if (403 === e4.domain_status_code) return B(e4, u2), void n2(new Error("“".concat(i2, "” is not embeddable.")));
            t3(e4);
          } catch (e5) {
            n2(e5);
          }
          else n2(new Error("“".concat(i2, "” is not embeddable.")));
          else n2(new Error("“".concat(i2, "” was not found.")));
        }, o2.onerror = function() {
          var e4 = o2.status ? " (".concat(o2.status, ")") : "";
          n2(new Error("There was an error fetching the embed code from Vimeo".concat(e4, ".")));
        }, o2.send();
      });
    }
    var Y, Q, J, X = { role: "viewer", autoPlayMuted: true, allowedDrift: 0.3, maxAllowedDrift: 1, minCheckInterval: 0.1, maxRateAdjustment: 0.2, maxTimeToCatchUp: 1 }, $ = function() {
      !function(e2, t2) {
        if ("function" != typeof t2 && null !== t2) throw new TypeError("Super expression must either be null or a function");
        e2.prototype = Object.create(t2 && t2.prototype, { constructor: { value: e2, writable: true, configurable: true } }), Object.defineProperty(e2, "prototype", { writable: false }), t2 && f(e2, t2);
      }(a2, t(EventTarget));
      var r2, n2, o2, i2 = v(a2);
      function a2(e2, t2) {
        var o3, n3 = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : {}, r3 = 3 < arguments.length ? arguments[3] : void 0;
        return l(this, a2), s(p(o3 = i2.call(this)), "logger", void 0), s(p(o3), "speedAdjustment", 0), s(p(o3), "adjustSpeed", function() {
          var n4 = h(j().mark(function e3(t3, n5) {
            var r4;
            return j().wrap(function(e4) {
              for (; ; ) switch (e4.prev = e4.next) {
                case 0:
                  if (o3.speedAdjustment === n5) return e4.abrupt("return");
                  e4.next = 2;
                  break;
                case 2:
                  return e4.next = 4, t3.getPlaybackRate();
                case 4:
                  return e4.t0 = e4.sent, e4.t1 = o3.speedAdjustment, e4.t2 = e4.t0 - e4.t1, e4.t3 = n5, r4 = e4.t2 + e4.t3, o3.log("New playbackRate:  ".concat(r4)), e4.next = 12, t3.setPlaybackRate(r4);
                case 12:
                  o3.speedAdjustment = n5;
                case 13:
                case "end":
                  return e4.stop();
              }
            }, e3);
          }));
          return function(e3, t3) {
            return n4.apply(this, arguments);
          };
        }()), o3.logger = r3, o3.init(t2, e2, u(u({}, X), n3)), o3;
      }
      return e(a2, [{ key: "disconnect", value: function() {
        this.dispatchEvent(new Event("disconnect"));
      } }, { key: "init", value: (o2 = h(j().mark(function e2(t2, n3, r3) {
        var o3, i3, a3, u2 = this;
        return j().wrap(function(e3) {
          for (; ; ) switch (e3.prev = e3.next) {
            case 0:
              return e3.next = 2, this.waitForTOReadyState(t2, "open");
            case 2:
              if ("viewer" === r3.role) return e3.next = 5, this.updatePlayer(t2, n3, r3);
              e3.next = 10;
              break;
            case 5:
              o3 = k(t2, "change", function() {
                return u2.updatePlayer(t2, n3, r3);
              }), i3 = this.maintainPlaybackPosition(t2, n3, r3), this.addEventListener("disconnect", function() {
                i3.cancel(), o3.cancel();
              }), e3.next = 14;
              break;
            case 10:
              return e3.next = 12, this.updateTimingObject(t2, n3);
            case 12:
              a3 = k(n3, ["seeked", "play", "pause", "ratechange"], function() {
                return u2.updateTimingObject(t2, n3);
              }, "on", "off"), this.addEventListener("disconnect", function() {
                return a3.cancel();
              });
            case 14:
            case "end":
              return e3.stop();
          }
        }, e2, this);
      })), function(e2, t2, n3) {
        return o2.apply(this, arguments);
      }) }, { key: "updateTimingObject", value: (n2 = h(j().mark(function e2(t2, n3) {
        return j().wrap(function(e3) {
          for (; ; ) switch (e3.prev = e3.next) {
            case 0:
              return e3.t0 = t2, e3.next = 3, n3.getCurrentTime();
            case 3:
              return e3.t1 = e3.sent, e3.next = 6, n3.getPaused();
            case 6:
              if (!e3.sent) {
                e3.next = 10;
                break;
              }
              e3.t2 = 0, e3.next = 13;
              break;
            case 10:
              return e3.next = 12, n3.getPlaybackRate();
            case 12:
              e3.t2 = e3.sent;
            case 13:
              e3.t3 = e3.t2, e3.t4 = { position: e3.t1, velocity: e3.t3 }, e3.t0.update.call(e3.t0, e3.t4);
            case 16:
            case "end":
              return e3.stop();
          }
        }, e2);
      })), function(e2, t2) {
        return n2.apply(this, arguments);
      }) }, { key: "updatePlayer", value: (r2 = h(j().mark(function e2(t2, n3, r3) {
        var o3, i3, a3;
        return j().wrap(function(e3) {
          for (; ; ) switch (e3.prev = e3.next) {
            case 0:
              if (o3 = t2.query(), i3 = o3.position, a3 = o3.velocity, "number" == typeof i3 && n3.setCurrentTime(i3), "number" != typeof a3) {
                e3.next = 25;
                break;
              }
              if (0 === a3) return e3.next = 6, n3.getPaused();
              e3.next = 11;
              break;
            case 6:
              if (e3.t0 = e3.sent, false !== e3.t0) {
                e3.next = 9;
                break;
              }
              n3.pause();
            case 9:
              e3.next = 25;
              break;
            case 11:
              if (0 < a3) return e3.next = 14, n3.getPaused();
              e3.next = 25;
              break;
            case 14:
              if (e3.t1 = e3.sent, true === e3.t1) return e3.next = 18, n3.play().catch(function() {
                var t3 = h(j().mark(function e4(t4) {
                  return j().wrap(function(e5) {
                    for (; ; ) switch (e5.prev = e5.next) {
                      case 0:
                        if ("NotAllowedError" === t4.name && r3.autoPlayMuted) return e5.next = 3, n3.setMuted(true);
                        e5.next = 5;
                        break;
                      case 3:
                        return e5.next = 5, n3.play().catch(function(e6) {
                          return console.error("Couldn't play the video from TimingSrcConnector. Error:", e6);
                        });
                      case 5:
                      case "end":
                        return e5.stop();
                    }
                  }, e4);
                }));
                return function(e4) {
                  return t3.apply(this, arguments);
                };
              }());
              e3.next = 19;
              break;
            case 18:
              this.updatePlayer(t2, n3, r3);
            case 19:
              return e3.next = 21, n3.getPlaybackRate();
            case 21:
              if (e3.t2 = e3.sent, e3.t3 = a3, e3.t2 === e3.t3) {
                e3.next = 25;
                break;
              }
              n3.setPlaybackRate(a3);
            case 25:
            case "end":
              return e3.stop();
          }
        }, e2, this);
      })), function(e2, t2, n3) {
        return r2.apply(this, arguments);
      }) }, { key: "maintainPlaybackPosition", value: function(a3, u2, e2) {
        var c2 = this, l2 = e2.allowedDrift, s2 = e2.maxAllowedDrift, t2 = e2.minCheckInterval, f2 = e2.maxRateAdjustment, d2 = e2.maxTimeToCatchUp, n3 = 1e3 * Math.min(d2, Math.max(t2, s2)), r3 = function() {
          var e3 = h(j().mark(function e4() {
            var t3, n4, r4, o4, i3;
            return j().wrap(function(e5) {
              for (; ; ) switch (e5.prev = e5.next) {
                case 0:
                  if (e5.t0 = 0 === a3.query().velocity, e5.t0) {
                    e5.next = 6;
                    break;
                  }
                  return e5.next = 4, u2.getPaused();
                case 4:
                  e5.t1 = e5.sent, e5.t0 = true === e5.t1;
                case 6:
                  if (e5.t0) return e5.abrupt("return");
                  e5.next = 8;
                  break;
                case 8:
                  return e5.t2 = a3.query().position, e5.next = 11, u2.getCurrentTime();
                case 11:
                  if (e5.t3 = e5.sent, t3 = e5.t2 - e5.t3, n4 = Math.abs(t3), c2.log("Drift: ".concat(t3)), s2 < n4) return e5.next = 18, c2.adjustSpeed(u2, 0);
                  e5.next = 22;
                  break;
                case 18:
                  u2.setCurrentTime(a3.query().position), c2.log("Resync by currentTime"), e5.next = 29;
                  break;
                case 22:
                  if (l2 < n4) return i3 = (r4 = n4 / d2) < (o4 = f2) ? (o4 - r4) / 2 : o4, e5.next = 28, c2.adjustSpeed(u2, i3 * Math.sign(t3));
                  e5.next = 29;
                  break;
                case 28:
                  c2.log("Resync by playbackRate");
                case 29:
                case "end":
                  return e5.stop();
              }
            }, e4);
          }));
          return function() {
            return e3.apply(this, arguments);
          };
        }(), o3 = setInterval(function() {
          return r3();
        }, n3);
        return { cancel: function() {
          return clearInterval(o3);
        } };
      } }, { key: "log", value: function(e2) {
        var t2;
        null !== (t2 = this.logger) && void 0 !== t2 && t2.call(this, "TimingSrcConnector: ".concat(e2));
      } }, { key: "waitForTOReadyState", value: function(n3, r3) {
        return new Promise(function(t2) {
          !function e2() {
            n3.readyState === r3 ? t2() : n3.addEventListener("readystatechange", e2, { once: true });
          }();
        });
      } }]), a2;
    }(), K = /* @__PURE__ */ new WeakMap(), Z = /* @__PURE__ */ new WeakMap(), ee = {}, Player = function() {
      function Player2(u2) {
        var e2, t2, c2 = this, n3 = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {};
        if (l(this, Player2), window.jQuery && u2 instanceof jQuery && (1 < u2.length && window.console && console.warn && console.warn("A jQuery object with multiple elements was passed, using the first element."), u2 = u2[0]), "undefined" != typeof document && "string" == typeof u2 && (u2 = document.getElementById(u2)), e2 = u2, !Boolean(e2 && 1 === e2.nodeType && "nodeName" in e2 && e2.ownerDocument && e2.ownerDocument.defaultView)) throw new TypeError("You must pass either a valid element or a valid id.");
        if ("IFRAME" === u2.nodeName || (t2 = u2.querySelector("iframe")) && (u2 = t2), "IFRAME" === u2.nodeName && !g(u2.getAttribute("src") || "")) throw new Error("The player element passed isn’t a Vimeo embed.");
        if (K.has(u2)) return K.get(u2);
        this._window = u2.ownerDocument.defaultView, this.element = u2, this.origin = "*";
        var r2, o2 = new A(function(i2, a2) {
          var e3;
          c2._onMessage = function(e4) {
            if (g(e4.origin) && c2.element.contentWindow === e4.source) {
              "*" === c2.origin && (c2.origin = e4.origin);
              var t3 = D(e4.data);
              if (t3 && "error" === t3.event && t3.data && "ready" === t3.data.method) {
                var n4 = new Error(t3.data.message);
                return n4.name = t3.data.name, void a2(n4);
              }
              var r3 = t3 && "ready" === t3.event, o3 = t3 && "ping" === t3.method;
              if (r3 || o3) return c2.element.setAttribute("data-ready", "true"), void i2();
              z(c2, t3);
            }
          }, c2._window.addEventListener("message", c2._onMessage), "IFRAME" !== c2.element.nodeName && H(b(e3 = G(u2, n3)), e3, u2).then(function(e4) {
            var t3, n4, r3, o3 = B(e4, u2);
            return c2.element = o3, c2._originalElement = u2, t3 = u2, n4 = o3, r3 = R.get(t3), R.set(n4, r3), R.delete(t3), K.set(c2.element, c2), e4;
          }).catch(a2);
        });
        return Z.set(this, o2), K.set(this.element, this), "IFRAME" === this.element.nodeName && W(this, "ping"), ee.isEnabled && (r2 = function() {
          return ee.exit();
        }, this.fullscreenchangeHandler = function() {
          (ee.isFullscreen ? q : V)(c2, "event:exitFullscreen", r2), c2.ready().then(function() {
            W(c2, "fullscreenchange", ee.isFullscreen);
          });
        }, ee.on("fullscreenchange", this.fullscreenchangeHandler)), this;
      }
      var n2;
      return e(Player2, [{ key: "callMethod", value: function(n3, e2) {
        var r2 = this, o2 = 1 < arguments.length && void 0 !== e2 ? e2 : {};
        return new A(function(e3, t2) {
          return r2.ready().then(function() {
            q(r2, n3, { resolve: e3, reject: t2 }), W(r2, n3, o2);
          }).catch(t2);
        });
      } }, { key: "get", value: function(n3) {
        var r2 = this;
        return new A(function(e2, t2) {
          return n3 = m(n3, "get"), r2.ready().then(function() {
            q(r2, n3, { resolve: e2, reject: t2 }), W(r2, n3);
          }).catch(t2);
        });
      } }, { key: "set", value: function(n3, r2) {
        var o2 = this;
        return new A(function(e2, t2) {
          if (n3 = m(n3, "set"), null == r2) throw new TypeError("There must be a value to set.");
          return o2.ready().then(function() {
            q(o2, n3, { resolve: e2, reject: t2 }), W(o2, n3, r2);
          }).catch(t2);
        });
      } }, { key: "on", value: function(e2, t2) {
        if (!e2) throw new TypeError("You must pass an event name.");
        if (!t2) throw new TypeError("You must pass a callback function.");
        if ("function" != typeof t2) throw new TypeError("The callback must be a function.");
        0 === I(this, "event:".concat(e2)).length && this.callMethod("addEventListener", e2).catch(function() {
        }), q(this, "event:".concat(e2), t2);
      } }, { key: "off", value: function(e2, t2) {
        if (!e2) throw new TypeError("You must pass an event name.");
        if (t2 && "function" != typeof t2) throw new TypeError("The callback must be a function.");
        V(this, "event:".concat(e2), t2) && this.callMethod("removeEventListener", e2).catch(function(e3) {
        });
      } }, { key: "loadVideo", value: function(e2) {
        return this.callMethod("loadVideo", e2);
      } }, { key: "ready", value: function() {
        var e2 = Z.get(this) || new A(function(e3, t2) {
          t2(new Error("Unknown player. Probably unloaded."));
        });
        return A.resolve(e2);
      } }, { key: "addCuePoint", value: function(e2, t2) {
        var n3 = 1 < arguments.length && void 0 !== t2 ? t2 : {};
        return this.callMethod("addCuePoint", { time: e2, data: n3 });
      } }, { key: "removeCuePoint", value: function(e2) {
        return this.callMethod("removeCuePoint", e2);
      } }, { key: "enableTextTrack", value: function(e2, t2) {
        if (!e2) throw new TypeError("You must pass a language.");
        return this.callMethod("enableTextTrack", { language: e2, kind: t2 });
      } }, { key: "disableTextTrack", value: function() {
        return this.callMethod("disableTextTrack");
      } }, { key: "pause", value: function() {
        return this.callMethod("pause");
      } }, { key: "play", value: function() {
        return this.callMethod("play");
      } }, { key: "requestFullscreen", value: function() {
        return ee.isEnabled ? ee.request(this.element) : this.callMethod("requestFullscreen");
      } }, { key: "exitFullscreen", value: function() {
        return ee.isEnabled ? ee.exit() : this.callMethod("exitFullscreen");
      } }, { key: "getFullscreen", value: function() {
        return ee.isEnabled ? A.resolve(ee.isFullscreen) : this.get("fullscreen");
      } }, { key: "requestPictureInPicture", value: function() {
        return this.callMethod("requestPictureInPicture");
      } }, { key: "exitPictureInPicture", value: function() {
        return this.callMethod("exitPictureInPicture");
      } }, { key: "getPictureInPicture", value: function() {
        return this.get("pictureInPicture");
      } }, { key: "remotePlaybackPrompt", value: function() {
        return this.callMethod("remotePlaybackPrompt");
      } }, { key: "unload", value: function() {
        return this.callMethod("unload");
      } }, { key: "destroy", value: function() {
        var n3 = this;
        return new A(function(e2) {
          var t2;
          Z.delete(n3), K.delete(n3.element), n3._originalElement && (K.delete(n3._originalElement), n3._originalElement.removeAttribute("data-vimeo-initialized")), n3.element && "IFRAME" === n3.element.nodeName && n3.element.parentNode && (n3.element.parentNode.parentNode && n3._originalElement && n3._originalElement !== n3.element.parentNode ? n3.element.parentNode.parentNode.removeChild(n3.element.parentNode) : n3.element.parentNode.removeChild(n3.element)), n3.element && "DIV" === n3.element.nodeName && n3.element.parentNode && (n3.element.removeAttribute("data-vimeo-initialized"), (t2 = n3.element.querySelector("iframe")) && t2.parentNode && (t2.parentNode.parentNode && n3._originalElement && n3._originalElement !== t2.parentNode ? t2.parentNode.parentNode.removeChild(t2.parentNode) : t2.parentNode.removeChild(t2))), n3._window.removeEventListener("message", n3._onMessage), ee.isEnabled && ee.off("fullscreenchange", n3.fullscreenchangeHandler), e2();
        });
      } }, { key: "getAutopause", value: function() {
        return this.get("autopause");
      } }, { key: "setAutopause", value: function(e2) {
        return this.set("autopause", e2);
      } }, { key: "getBuffered", value: function() {
        return this.get("buffered");
      } }, { key: "getCameraProps", value: function() {
        return this.get("cameraProps");
      } }, { key: "setCameraProps", value: function(e2) {
        return this.set("cameraProps", e2);
      } }, { key: "getChapters", value: function() {
        return this.get("chapters");
      } }, { key: "getCurrentChapter", value: function() {
        return this.get("currentChapter");
      } }, { key: "getColor", value: function() {
        return this.get("color");
      } }, { key: "getColors", value: function() {
        return A.all([this.get("colorOne"), this.get("colorTwo"), this.get("colorThree"), this.get("colorFour")]);
      } }, { key: "setColor", value: function(e2) {
        return this.set("color", e2);
      } }, { key: "setColors", value: function(e2) {
        if (!Array.isArray(e2)) return new A(function(e3, t3) {
          return t3(new TypeError("Argument must be an array."));
        });
        var t2 = new A(function(e3) {
          return e3(null);
        }), n3 = [e2[0] ? this.set("colorOne", e2[0]) : t2, e2[1] ? this.set("colorTwo", e2[1]) : t2, e2[2] ? this.set("colorThree", e2[2]) : t2, e2[3] ? this.set("colorFour", e2[3]) : t2];
        return A.all(n3);
      } }, { key: "getCuePoints", value: function() {
        return this.get("cuePoints");
      } }, { key: "getCurrentTime", value: function() {
        return this.get("currentTime");
      } }, { key: "setCurrentTime", value: function(e2) {
        return this.set("currentTime", e2);
      } }, { key: "getDuration", value: function() {
        return this.get("duration");
      } }, { key: "getEnded", value: function() {
        return this.get("ended");
      } }, { key: "getLoop", value: function() {
        return this.get("loop");
      } }, { key: "setLoop", value: function(e2) {
        return this.set("loop", e2);
      } }, { key: "setMuted", value: function(e2) {
        return this.set("muted", e2);
      } }, { key: "getMuted", value: function() {
        return this.get("muted");
      } }, { key: "getPaused", value: function() {
        return this.get("paused");
      } }, { key: "getPlaybackRate", value: function() {
        return this.get("playbackRate");
      } }, { key: "setPlaybackRate", value: function(e2) {
        return this.set("playbackRate", e2);
      } }, { key: "getPlayed", value: function() {
        return this.get("played");
      } }, { key: "getQualities", value: function() {
        return this.get("qualities");
      } }, { key: "getQuality", value: function() {
        return this.get("quality");
      } }, { key: "setQuality", value: function(e2) {
        return this.set("quality", e2);
      } }, { key: "getRemotePlaybackAvailability", value: function() {
        return this.get("remotePlaybackAvailability");
      } }, { key: "getRemotePlaybackState", value: function() {
        return this.get("remotePlaybackState");
      } }, { key: "getSeekable", value: function() {
        return this.get("seekable");
      } }, { key: "getSeeking", value: function() {
        return this.get("seeking");
      } }, { key: "getTextTracks", value: function() {
        return this.get("textTracks");
      } }, { key: "getVideoEmbedCode", value: function() {
        return this.get("videoEmbedCode");
      } }, { key: "getVideoId", value: function() {
        return this.get("videoId");
      } }, { key: "getVideoTitle", value: function() {
        return this.get("videoTitle");
      } }, { key: "getVideoWidth", value: function() {
        return this.get("videoWidth");
      } }, { key: "getVideoHeight", value: function() {
        return this.get("videoHeight");
      } }, { key: "getVideoUrl", value: function() {
        return this.get("videoUrl");
      } }, { key: "getVolume", value: function() {
        return this.get("volume");
      } }, { key: "setVolume", value: function(e2) {
        return this.set("volume", e2);
      } }, { key: "setTimingSrc", value: (n2 = h(j().mark(function e2(t2, n3) {
        var r2, o2 = this;
        return j().wrap(function(e3) {
          for (; ; ) switch (e3.prev = e3.next) {
            case 0:
              if (t2) {
                e3.next = 2;
                break;
              }
              throw new TypeError("A Timing Object must be provided.");
            case 2:
              return e3.next = 4, this.ready();
            case 4:
              return r2 = new $(this, t2, n3), W(this, "notifyTimingObjectConnect"), r2.addEventListener("disconnect", function() {
                return W(o2, "notifyTimingObjectDisconnect");
              }), e3.abrupt("return", r2);
            case 8:
            case "end":
              return e3.stop();
          }
        }, e2, this);
      })), function(e2, t2) {
        return n2.apply(this, arguments);
      }) }]), Player2;
    }();
    return n || (Y = function() {
      for (var e2, t2 = [["requestFullscreen", "exitFullscreen", "fullscreenElement", "fullscreenEnabled", "fullscreenchange", "fullscreenerror"], ["webkitRequestFullscreen", "webkitExitFullscreen", "webkitFullscreenElement", "webkitFullscreenEnabled", "webkitfullscreenchange", "webkitfullscreenerror"], ["webkitRequestFullScreen", "webkitCancelFullScreen", "webkitCurrentFullScreenElement", "webkitCancelFullScreen", "webkitfullscreenchange", "webkitfullscreenerror"], ["mozRequestFullScreen", "mozCancelFullScreen", "mozFullScreenElement", "mozFullScreenEnabled", "mozfullscreenchange", "mozfullscreenerror"], ["msRequestFullscreen", "msExitFullscreen", "msFullscreenElement", "msFullscreenEnabled", "MSFullscreenChange", "MSFullscreenError"]], n2 = 0, r2 = t2.length, o2 = {}; n2 < r2; n2++) if ((e2 = t2[n2]) && e2[1] in document) {
        for (n2 = 0; n2 < e2.length; n2++) o2[t2[0][n2]] = e2[n2];
        return o2;
      }
      return false;
    }(), Q = { fullscreenchange: Y.fullscreenchange, fullscreenerror: Y.fullscreenerror }, J = { request: function(o2) {
      return new Promise(function(e2, t2) {
        function n2() {
          J.off("fullscreenchange", n2), e2();
        }
        J.on("fullscreenchange", n2);
        var r2 = (o2 = o2 || document.documentElement)[Y.requestFullscreen]();
        r2 instanceof Promise && r2.then(n2).catch(t2);
      });
    }, exit: function() {
      return new Promise(function(t2, e2) {
        var n2, r2;
        J.isFullscreen ? (n2 = function e3() {
          J.off("fullscreenchange", e3), t2();
        }, J.on("fullscreenchange", n2), (r2 = document[Y.exitFullscreen]()) instanceof Promise && r2.then(n2).catch(e2)) : t2();
      });
    }, on: function(e2, t2) {
      var n2 = Q[e2];
      n2 && document.addEventListener(n2, t2);
    }, off: function(e2, t2) {
      var n2 = Q[e2];
      n2 && document.removeEventListener(n2, t2);
    } }, Object.defineProperties(J, { isFullscreen: { get: function() {
      return Boolean(document[Y.fullscreenElement]);
    } }, element: { enumerable: true, get: function() {
      return document[Y.fullscreenElement];
    } }, isEnabled: { enumerable: true, get: function() {
      return Boolean(document[Y.fullscreenEnabled]);
    } } }), ee = J, function(e2) {
      function n2(e3) {
        "console" in window && console.error && console.error("There was an error creating an embed: ".concat(e3));
      }
      var t2 = document;
      [].slice.call(t2.querySelectorAll("[data-vimeo-id], [data-vimeo-url]")).forEach(function(t3) {
        try {
          if (null !== t3.getAttribute("data-vimeo-defer")) return;
          var e3 = G(t3);
          H(b(e3), e3, t3).then(function(e4) {
            return B(e4, t3);
          }).catch(n2);
        } catch (e4) {
          n2(e4);
        }
      });
    }(), function(e2) {
      var r2 = document;
      window.VimeoPlayerResizeEmbeds_ || (window.VimeoPlayerResizeEmbeds_ = true, window.addEventListener("message", function(e3) {
        if (g(e3.origin) && e3.data && "spacechange" === e3.data.event) {
          for (var t2 = r2.querySelectorAll("iframe"), n2 = 0; n2 < t2.length; n2++) if (t2[n2].contentWindow === e3.source) {
            t2[n2].parentElement.style.paddingBottom = "".concat(e3.data.data[0].bottom, "px");
            break;
          }
        }
      }));
    }(), function(e2) {
      var a2 = document;
      window.VimeoSeoMetadataAppended || (window.VimeoSeoMetadataAppended = true, window.addEventListener("message", function(e3) {
        if (g(e3.origin)) {
          var t2 = D(e3.data);
          if (t2 && "ready" === t2.event) for (var n2 = a2.querySelectorAll("iframe"), r2 = 0; r2 < n2.length; r2++) {
            var o2 = n2[r2], i2 = o2.contentWindow === e3.source;
            w(o2.src) && i2 && new Player(o2).callMethod("appendVideoMetadata", window.location.href);
          }
        }
      }));
    }(), function(e2) {
      var a2, t2 = document;
      window.VimeoCheckedUrlTimeParam || (window.VimeoCheckedUrlTimeParam = true, a2 = function(e3) {
        "console" in window && console.error && console.error("There was an error getting video Id: ".concat(e3));
      }, window.addEventListener("message", function(n2) {
        if (g(n2.origin)) {
          var e3 = D(n2.data);
          if (e3 && "ready" === e3.event) for (var o2 = t2.querySelectorAll("iframe"), i2 = 0; i2 < o2.length; i2++) !function() {
            var r2, e4 = o2[i2], t3 = e4.contentWindow === n2.source;
            w(e4.src) && t3 && (r2 = new Player(e4)).getVideoId().then(function(e5) {
              var t4, n3 = new RegExp("[?&]vimeo_t_".concat(e5, "=([^&#]*)")).exec(window.location.href);
              n3 && n3[1] && (t4 = decodeURI(n3[1]), r2.setCurrentTime(t4));
            }).catch(a2);
          }();
        }
      }));
    }()), Player;
  });
  var scriptUrl = "https://www.youtube.com/s/player/9d15588c/www-widgetapi.vflset/www-widgetapi.js";
  try {
    var ttPolicy = window.trustedTypes.createPolicy("youtube-widget-api", { createScriptURL: function(x) {
      return x;
    } });
    scriptUrl = ttPolicy.createScriptURL(scriptUrl);
  } catch (e) {
  }
  var YT;
  if (!window["YT"]) YT = { loading: 0, loaded: 0 };
  var YTConfig;
  if (!window["YTConfig"]) YTConfig = { "host": "https://www.youtube.com" };
  if (!YT.loading) {
    YT.loading = 1;
    (function() {
      var l = [];
      YT.ready = function(f) {
        if (YT.loaded) f();
        else l.push(f);
      };
      window.onYTReady = function() {
        YT.loaded = 1;
        var i = 0;
        for (; i < l.length; i++) try {
          l[i]();
        } catch (e) {
        }
      };
      YT.setConfig = function(c2) {
        var k;
        for (k in c2) if (c2.hasOwnProperty(k)) YTConfig[k] = c2[k];
      };
      var a = document.createElement("script");
      a.type = "text/javascript";
      a.id = "www-widgetapi-script";
      a.src = scriptUrl;
      a.async = true;
      var c = document.currentScript;
      if (c) {
        var n = c.nonce || c.getAttribute("nonce");
        if (n) a.setAttribute(
          "nonce",
          n
        );
      }
      var b = document.getElementsByTagName("script")[0];
      b.parentNode.insertBefore(a, b);
    })();
  }
  document.addEventListener("DOMContentLoaded", function() {
    const overlayMask = document.createElement("div");
    overlayMask.className = "overlay-mask";
    let embedWrappers = document.querySelectorAll(".ep-embed-content-wraper");
    embedWrappers.forEach((wrapper) => {
      initPlayer(wrapper);
    });
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const addedNodes = Array.from(mutation.addedNodes);
        addedNodes.forEach((node) => {
          traverseAndInitPlayer(node);
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    function traverseAndInitPlayer(node) {
      if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains("ep-embed-content-wraper")) {
        initPlayer(node);
      }
      if (node.hasChildNodes()) {
        node.childNodes.forEach((childNode) => {
          traverseAndInitPlayer(childNode);
        });
      }
    }
  });
  function initPlayer(wrapper) {
    var _a, _b;
    const playerId = wrapper.getAttribute("data-playerid");
    let options = (_a = document.querySelector(`[data-playerid='${playerId}']`)) == null ? void 0 : _a.getAttribute("data-options");
    if (!options) {
      return false;
    }
    if (typeof options === "string") {
      try {
        options = JSON.parse(options);
      } catch (e) {
        console.error("Invalid JSON format:", e);
        return;
      }
    } else {
      console.error("Options is not a string");
      return;
    }
    const pipPlayIconElement = document.createElement("div");
    pipPlayIconElement.className = "pip-play";
    pipPlayIconElement.innerHTML = '<svg width="20" height="20" viewBox="-0.15 -0.112 0.9 0.9" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin" class="jam jam-play"><path fill="#fff" d="M.518.357A.037.037 0 0 0 .506.306L.134.08a.039.039 0 0 0-.02-.006.038.038 0 0 0-.038.037v.453c0 .007.002.014.006.02a.039.039 0 0 0 .052.012L.506.37A.034.034 0 0 0 .518.358zm.028.075L.174.658A.115.115 0 0 1 .017.622.109.109 0 0 1 0 .564V.111C0 .05.051 0 .114 0c.021 0 .042.006.06.017l.372.226a.11.11 0 0 1 0 .189z"/></svg>';
    pipPlayIconElement.style.display = "none";
    const pipPauseIconElement = document.createElement("div");
    pipPauseIconElement.className = "pip-pause";
    pipPauseIconElement.innerHTML = '<svg fill="#fff" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 2.5 2.5" xml:space="preserve"><path d="M1.013.499 1.006.5V.499H.748a.054.054 0 0 0-.054.054v1.394c0 .03.024.054.054.054h.266a.054.054 0 0 0 .054-.054V.553a.054.054 0 0 0-.054-.054zm.793 1.448V.553a.054.054 0 0 0-.054-.054L1.745.5V.499h-.258a.054.054 0 0 0-.054.054v1.394c0 .03.024.054.054.054h.265a.054.054 0 0 0 .054-.054z"/></svg>';
    const pipCloseElement = document.createElement("div");
    pipCloseElement.className = "pip-close";
    pipCloseElement.innerHTML = '<svg width="20" height="20" viewBox="0 0 0.9 0.9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M.198.198a.037.037 0 0 1 .053 0L.45.397.648.199a.037.037 0 1 1 .053.053L.503.45l.198.198a.037.037 0 0 1-.053.053L.45.503.252.701A.037.037 0 0 1 .199.648L.397.45.198.252a.037.037 0 0 1 0-.053z" fill="#fff"/></svg>';
    if (playerId && !wrapper.classList.contains("plyr-initialized")) {
      let selector = `[data-playerid='${playerId}'] .ose-embedpress-responsive`;
      if (options.self_hosted && options.hosted_format === "video") {
        selector = `[data-playerid='${playerId}'] .ose-embedpress-responsive video`;
      } else if (options.self_hosted && options.hosted_format === "audio") {
        selector = `[data-playerid='${playerId}'] .ose-embedpress-responsive audio`;
        wrapper.style.opacity = "1";
      }
      document.querySelector(`[data-playerid='${playerId}']`).style.setProperty("--plyr-color-main", options.player_color);
      (_b = document.querySelector(`[data-playerid='${playerId}'].custom-player-preset-1, [data-playerid='${playerId}'].custom-player-preset-3, [data-playerid='${playerId}'].custom-player-preset-4`)) == null ? void 0 : _b.style.setProperty("--plyr-range-fill-background", "#ffffff");
      if (document.querySelector(`[data-playerid='${playerId}'] iframe`)) {
        document.querySelector(`[data-playerid='${playerId}'] iframe`).setAttribute("data-poster", options.poster_thumbnail);
      }
      if (document.querySelector(`[data-playerid='${playerId}'] video`)) {
        document.querySelector(`[data-playerid='${playerId}'] video`).setAttribute("data-poster", options.poster_thumbnail);
      }
      const controls = [
        "play-large",
        options.restart ? "restart" : "",
        options.rewind ? "rewind" : "",
        "play",
        options.fast_forward ? "fast-forward" : "",
        "progress",
        "current-time",
        "duration",
        "mute",
        "volume",
        "captions",
        "settings",
        options.pip ? "pip" : "",
        "airplay",
        options.download ? "download" : "",
        options.fullscreen ? "fullscreen" : ""
      ].filter((control) => control !== "");
      new Plyr(selector, {
        controls,
        seekTime: 10,
        poster: options.poster_thumbnail,
        storage: {
          enabled: true,
          key: "plyr_volume"
        },
        displayDuration: true,
        tooltips: { controls: options.player_tooltip, seek: options.player_tooltip },
        hideControls: options.hide_controls,
        youtube: __spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues({}, options.autoplay && { autoplay: options.autoplay }), options.start && { start: options.start }), options.end && { end: options.end }), options.rel && { rel: options.rel }), options.fullscreen && { fs: options.fullscreen }),
        vimeo: __spreadValues(__spreadValues(__spreadValues(__spreadValues({
          byline: false,
          portrait: false,
          title: false,
          speed: true,
          transparent: false,
          controls: false
        }, options.t && { t: options.t }), options.vautoplay && { autoplay: options.vautoplay }), options.autopause && { autopause: options.autopause }), options.dnt && { dnt: options.dnt })
      });
      wrapper.classList.add("plyr-initialized");
      const posterElement = wrapper.querySelector(".plyr__poster");
      if (posterElement) {
        const interval = setInterval(() => {
          if (posterElement && posterElement.style.backgroundImage) {
            wrapper.style.opacity = "1";
            clearInterval(interval);
          }
        }, 200);
      }
    }
    const pipInterval = setInterval(() => {
      let playerPip = document.querySelector(`[data-playerid="${playerId}"] [data-plyr="pip"]`);
      if (playerPip) {
        clearInterval(pipInterval);
        let options2 = document.querySelector(`[data-playerid="${playerId}"]`).getAttribute("data-options");
        options2 = JSON.parse(options2);
        if (!options2.self_hosted) {
          const iframeSelector = document.querySelector(`[data-playerid="${playerId}"] .plyr__video-wrapper`);
          playerPip.addEventListener("click", () => {
            iframeSelector.classList.toggle("pip-mode");
            let parentElement = iframeSelector.parentElement;
            while (parentElement) {
              parentElement.style.zIndex = "9999";
              parentElement = parentElement.parentElement;
            }
          });
          if (options2.pip) {
            iframeSelector.appendChild(pipPlayIconElement);
            iframeSelector.appendChild(pipPauseIconElement);
            iframeSelector.appendChild(pipCloseElement);
            const pipPlay = document.querySelector(`[data-playerid="${playerId}"] .plyr__video-wrapper .pip-play`);
            const pipPause = document.querySelector(`[data-playerid="${playerId}"] .plyr__video-wrapper .pip-pause`);
            const pipClose = document.querySelector(`[data-playerid="${playerId}"] .plyr__video-wrapper .pip-close`);
            pipClose.addEventListener("click", () => {
              iframeSelector.classList.remove("pip-mode");
              console.log(iframeSelector.classList);
            });
            iframeSelector.addEventListener("click", () => {
              const ariaPressedValue = document.querySelector(`[data-playerid="${playerId}"] .plyr__controls [data-plyr="play"]`).getAttribute("aria-pressed");
              console.log(ariaPressedValue);
              if (ariaPressedValue === "true") {
                pipPause.style.display = "none";
                pipPlay.style.display = "flex";
              } else {
                pipPlay.style.display = "none";
                pipPause.style.display = "flex";
              }
            });
          }
        }
      }
    }, 200);
  }
})();
//# sourceMappingURL=video-player.build.js.map
