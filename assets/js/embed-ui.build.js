(function() {
  "use strict";
  (function() {
    var e, aa = aa || {}, h = this;
    function ba(a2) {
      return void 0 !== a2;
    }
    function l(a2) {
      return "string" == typeof a2;
    }
    function ca() {
    }
    function da(a2) {
      var b = typeof a2;
      if ("object" == b) if (a2) {
        if (a2 instanceof Array) return "array";
        if (a2 instanceof Object) return b;
        var c = Object.prototype.toString.call(a2);
        if ("[object Window]" == c) return "object";
        if ("[object Array]" == c || "number" == typeof a2.length && "undefined" != typeof a2.splice && "undefined" != typeof a2.propertyIsEnumerable && !a2.propertyIsEnumerable("splice")) return "array";
        if ("[object Function]" == c || "undefined" != typeof a2.call && "undefined" != typeof a2.propertyIsEnumerable && !a2.propertyIsEnumerable("call")) return "function";
      } else return "null";
      else if ("function" == b && "undefined" == typeof a2.call) return "object";
      return b;
    }
    function ea(a2) {
      return "array" == da(a2);
    }
    function fa(a2) {
      var b = typeof a2;
      return "object" == b && null != a2 || "function" == b;
    }
    function ja(a2, b, c) {
      return a2.call.apply(a2.bind, arguments);
    }
    function ka(a2, b, c) {
      if (!a2) throw Error();
      if (2 < arguments.length) {
        var d = Array.prototype.slice.call(arguments, 2);
        return function() {
          var f = Array.prototype.slice.call(arguments);
          Array.prototype.unshift.apply(f, d);
          return a2.apply(b, f);
        };
      }
      return function() {
        return a2.apply(b, arguments);
      };
    }
    function m(a2, b, c) {
      Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? m = ja : m = ka;
      return m.apply(null, arguments);
    }
    var la = Date.now || function() {
      return +/* @__PURE__ */ new Date();
    };
    function n(a2, b) {
      a2 = a2.split(".");
      var c = h;
      a2[0] in c || "undefined" == typeof c.execScript || c.execScript("var " + a2[0]);
      for (var d; a2.length && (d = a2.shift()); ) !a2.length && ba(b) ? c[d] = b : c[d] && c[d] !== Object.prototype[d] ? c = c[d] : c = c[d] = {};
    }
    function p(a2, b) {
      function c() {
      }
      c.prototype = b.prototype;
      a2.g = b.prototype;
      a2.prototype = new c();
      a2.prototype.constructor = a2;
      a2.Ic = function(d, f, g) {
        for (var k = Array(arguments.length - 2), u = 2; u < arguments.length; u++) k[u - 2] = arguments[u];
        return b.prototype[f].apply(d, k);
      };
    }
    var ma;
    function na(a2) {
      if (Error.captureStackTrace) Error.captureStackTrace(this, na);
      else {
        var b = Error().stack;
        b && (this.stack = b);
      }
      a2 && (this.message = String(a2));
    }
    p(na, Error);
    na.prototype.name = "CustomError";
    function oa(a2, b) {
      a2 = a2.split("%s");
      for (var c = "", d = a2.length - 1, f = 0; f < d; f++) c += a2[f] + (f < b.length ? b[f] : "%s");
      na.call(this, c + a2[d]);
    }
    p(oa, na);
    oa.prototype.name = "AssertionError";
    function pa(a2, b) {
      throw new oa("Failure" + (": " + a2), Array.prototype.slice.call(arguments, 1));
    }
    function qa(a2, b, c) {
      for (var d in a2) b.call(c, a2[d], d, a2);
    }
    function ra(a2, b) {
      for (var c in a2) if (b.call(void 0, a2[c], c, a2)) return true;
      return false;
    }
    function q(a2, b, c) {
      return null !== a2 && b in a2 ? a2[b] : c;
    }
    function sa(a2) {
      var b = {}, c;
      for (c in a2) b[c] = a2[c];
      return b;
    }
    var ta = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
    function ua(a2, b) {
      for (var c, d, f = 1; f < arguments.length; f++) {
        d = arguments[f];
        for (c in d) a2[c] = d[c];
        for (var g = 0; g < ta.length; g++) c = ta[g], Object.prototype.hasOwnProperty.call(d, c) && (a2[c] = d[c]);
      }
    }
    var va = String.prototype.trim ? function(a2) {
      return a2.trim();
    } : function(a2) {
      return /^[\s\xa0]*([\s\S]*?)[\s\xa0]*$/.exec(a2)[1];
    };
    function wa(a2, b) {
      return a2 < b ? -1 : a2 > b ? 1 : 0;
    }
    function xa(a2) {
      return String(a2).replace(/\-([a-z])/g, function(b, c) {
        return c.toUpperCase();
      });
    }
    function ya(a2) {
      var b = l(void 0) ? "undefined".replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08") : "\\s";
      return a2.replace(new RegExp("(^" + (b ? "|[" + b + "]+" : "") + ")([a-z])", "g"), function(c, d, f) {
        return d + f.toUpperCase();
      });
    }
    var za;
    a: {
      var Aa = h.navigator;
      if (Aa) {
        var Ba = Aa.userAgent;
        if (Ba) {
          za = Ba;
          break a;
        }
      }
      za = "";
    }
    function r(a2) {
      return -1 != za.indexOf(a2);
    }
    var Ca = Array.prototype.indexOf ? function(a2, b) {
      return Array.prototype.indexOf.call(a2, b, void 0);
    } : function(a2, b) {
      if (l(a2)) return l(b) && 1 == b.length ? a2.indexOf(b, 0) : -1;
      for (var c = 0; c < a2.length; c++) if (c in a2 && a2[c] === b) return c;
      return -1;
    }, t = Array.prototype.forEach ? function(a2, b, c) {
      Array.prototype.forEach.call(a2, b, c);
    } : function(a2, b, c) {
      for (var d = a2.length, f = l(a2) ? a2.split("") : a2, g = 0; g < d; g++) g in f && b.call(c, f[g], g, a2);
    }, Da = Array.prototype.filter ? function(a2, b) {
      return Array.prototype.filter.call(a2, b, void 0);
    } : function(a2, b) {
      for (var c = a2.length, d = [], f = 0, g = l(a2) ? a2.split("") : a2, k = 0; k < c; k++) if (k in g) {
        var u = g[k];
        b.call(void 0, u, k, a2) && (d[f++] = u);
      }
      return d;
    };
    function Ea(a2) {
      a: {
        var b = Fa;
        for (var c = a2.length, d = l(a2) ? a2.split("") : a2, f = 0; f < c; f++) if (f in d && b.call(void 0, d[f], f, a2)) {
          b = f;
          break a;
        }
        b = -1;
      }
      return 0 > b ? null : l(a2) ? a2.charAt(b) : a2[b];
    }
    function Ga(a2, b) {
      0 <= Ca(a2, b) || a2.push(b);
    }
    function Ha(a2, b) {
      b = Ca(a2, b);
      var c;
      (c = 0 <= b) && Array.prototype.splice.call(a2, b, 1);
      return c;
    }
    function Ia(a2, b, c, d) {
      Array.prototype.splice.apply(a2, Ja(arguments, 1));
    }
    function Ja(a2, b, c) {
      return 2 >= arguments.length ? Array.prototype.slice.call(a2, b) : Array.prototype.slice.call(a2, b, c);
    }
    function Ka() {
      this.ea = this.ea;
      this.Z = this.Z;
    }
    var La = 0;
    Ka.prototype.ea = false;
    function Na(a2) {
      if (!a2.ea && (a2.ea = true, a2.N(), 0 != La)) ;
    }
    Ka.prototype.N = function() {
      if (this.Z) for (; this.Z.length; ) this.Z.shift()();
    };
    var Oa = "closure_listenable_" + (1e6 * Math.random() | 0);
    function Pa(a2) {
      return !(!a2 || !a2[Oa]);
    }
    var Qa = 0;
    function Ra(a2, b, c, d, f) {
      this.listener = a2;
      this.proxy = null;
      this.src = b;
      this.type = c;
      this.capture = !!d;
      this.va = f;
      this.key = ++Qa;
      this.ca = this.sa = false;
    }
    function Sa(a2) {
      a2.ca = true;
      a2.listener = null;
      a2.proxy = null;
      a2.src = null;
      a2.va = null;
    }
    function Ta(a2) {
      this.src = a2;
      this.a = {};
      this.b = 0;
    }
    Ta.prototype.add = function(a2, b, c, d, f) {
      var g = a2.toString();
      a2 = this.a[g];
      a2 || (a2 = this.a[g] = [], this.b++);
      var k = Ua(a2, b, d, f);
      -1 < k ? (b = a2[k], c || (b.sa = false)) : (b = new Ra(b, this.src, g, !!d, f), b.sa = c, a2.push(b));
      return b;
    };
    function Va(a2, b) {
      var c = b.type;
      c in a2.a && Ha(a2.a[c], b) && (Sa(b), 0 == a2.a[c].length && (delete a2.a[c], a2.b--));
    }
    function Wa(a2, b, c, d, f) {
      a2 = a2.a[b.toString()];
      b = -1;
      a2 && (b = Ua(a2, c, d, f));
      return -1 < b ? a2[b] : null;
    }
    function Xa(a2, b) {
      var c = ba(b), d = c ? b.toString() : "", f = ba(void 0);
      return ra(a2.a, function(g) {
        for (var k = 0; k < g.length; ++k) if (!(c && g[k].type != d || f && void 0 != g[k].capture)) return true;
        return false;
      });
    }
    function Ua(a2, b, c, d) {
      for (var f = 0; f < a2.length; ++f) {
        var g = a2[f];
        if (!g.ca && g.listener == b && g.capture == !!c && g.va == d) return f;
      }
      return -1;
    }
    function v(a2, b) {
      this.type = a2;
      this.b = this.target = b;
      this.i = false;
      this.hb = true;
    }
    v.prototype.stopPropagation = function() {
      this.i = true;
    };
    v.prototype.a = function() {
      this.hb = false;
    };
    function Ya(a2) {
      Ya[" "](a2);
      return a2;
    }
    Ya[" "] = ca;
    function Za(a2, b) {
      var c = $a;
      return Object.prototype.hasOwnProperty.call(c, a2) ? c[a2] : c[a2] = b(a2);
    }
    var ab = r("Opera"), w = r("Trident") || r("MSIE"), bb = r("Edge"), cb = r("Gecko") && !(-1 != za.toLowerCase().indexOf("webkit") && !r("Edge")) && !(r("Trident") || r("MSIE")) && !r("Edge"), db = -1 != za.toLowerCase().indexOf("webkit") && !r("Edge");
    function eb() {
      var a2 = h.document;
      return a2 ? a2.documentMode : void 0;
    }
    var fb;
    a: {
      var gb = "", hb = function() {
        var a2 = za;
        if (cb) return /rv:([^\);]+)(\)|;)/.exec(a2);
        if (bb) return /Edge\/([\d\.]+)/.exec(a2);
        if (w) return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a2);
        if (db) return /WebKit\/(\S+)/.exec(a2);
        if (ab) return /(?:Version)[ \/]?(\S+)/.exec(a2);
      }();
      hb && (gb = hb ? hb[1] : "");
      if (w) {
        var ib = eb();
        if (null != ib && ib > parseFloat(gb)) {
          fb = String(ib);
          break a;
        }
      }
      fb = gb;
    }
    var $a = {};
    function jb(a2) {
      return Za(a2, function() {
        for (var b = 0, c = va(String(fb)).split("."), d = va(String(a2)).split("."), f = Math.max(c.length, d.length), g = 0; 0 == b && g < f; g++) {
          var k = c[g] || "", u = d[g] || "";
          do {
            k = /(\d*)(\D*)(.*)/.exec(k) || ["", "", "", ""];
            u = /(\d*)(\D*)(.*)/.exec(u) || ["", "", "", ""];
            if (0 == k[0].length && 0 == u[0].length) break;
            b = wa(0 == k[1].length ? 0 : parseInt(k[1], 10), 0 == u[1].length ? 0 : parseInt(u[1], 10)) || wa(0 == k[2].length, 0 == u[2].length) || wa(k[2], u[2]);
            k = k[3];
            u = u[3];
          } while (0 == b);
        }
        return 0 <= b;
      });
    }
    var kb;
    var lb = h.document;
    kb = lb && w ? eb() || ("CSS1Compat" == lb.compatMode ? parseInt(fb, 10) : 5) : void 0;
    var mb = !w || 9 <= Number(kb), nb = w && !jb("9"), ob = function() {
      if (!h.addEventListener || !Object.defineProperty) return false;
      var a2 = false, b = Object.defineProperty({}, "passive", { get: function() {
        a2 = true;
      } });
      h.addEventListener("test", ca, b);
      h.removeEventListener("test", ca, b);
      return a2;
    }();
    var pb = Object.freeze || function(a2) {
      return a2;
    };
    function qb(a2, b) {
      v.call(this, a2 ? a2.type : "");
      this.relatedTarget = this.b = this.target = null;
      this.button = this.screenY = this.screenX = this.clientY = this.clientX = 0;
      this.key = "";
      this.B = 0;
      this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = false;
      this.pointerId = 0;
      this.pointerType = "";
      this.m = null;
      if (a2) {
        var c = this.type = a2.type, d = a2.changedTouches ? a2.changedTouches[0] : null;
        this.target = a2.target || a2.srcElement;
        this.b = b;
        if (b = a2.relatedTarget) {
          if (cb) {
            a: {
              try {
                Ya(b.nodeName);
                var f = true;
                break a;
              } catch (g) {
              }
              f = false;
            }
            f || (b = null);
          }
        } else "mouseover" == c ? b = a2.fromElement : "mouseout" == c && (b = a2.toElement);
        this.relatedTarget = b;
        null === d ? (this.clientX = void 0 !== a2.clientX ? a2.clientX : a2.pageX, this.clientY = void 0 !== a2.clientY ? a2.clientY : a2.pageY, this.screenX = a2.screenX || 0, this.screenY = a2.screenY || 0) : (this.clientX = void 0 !== d.clientX ? d.clientX : d.pageX, this.clientY = void 0 !== d.clientY ? d.clientY : d.pageY, this.screenX = d.screenX || 0, this.screenY = d.screenY || 0);
        this.button = a2.button;
        this.B = a2.keyCode || 0;
        this.key = a2.key || "";
        this.ctrlKey = a2.ctrlKey;
        this.altKey = a2.altKey;
        this.shiftKey = a2.shiftKey;
        this.metaKey = a2.metaKey;
        this.pointerId = a2.pointerId || 0;
        this.pointerType = l(a2.pointerType) ? a2.pointerType : rb[a2.pointerType] || "";
        this.m = a2;
        a2.defaultPrevented && this.a();
      }
    }
    p(qb, v);
    var rb = pb({ 2: "touch", 3: "pen", 4: "mouse" });
    qb.prototype.stopPropagation = function() {
      qb.g.stopPropagation.call(this);
      this.m.stopPropagation ? this.m.stopPropagation() : this.m.cancelBubble = true;
    };
    qb.prototype.a = function() {
      qb.g.a.call(this);
      var a2 = this.m;
      if (a2.preventDefault) a2.preventDefault();
      else if (a2.returnValue = false, nb) try {
        if (a2.ctrlKey || 112 <= a2.keyCode && 123 >= a2.keyCode) a2.keyCode = -1;
      } catch (b) {
      }
    };
    var sb = "closure_lm_" + (1e6 * Math.random() | 0), tb = {};
    function x(a2, b, c, d, f) {
      if (d && d.once) return vb(a2, b, c, d, f);
      if (ea(b)) {
        for (var g = 0; g < b.length; g++) x(a2, b[g], c, d, f);
        return null;
      }
      c = wb(c);
      return Pa(a2) ? y(a2, b, c, fa(d) ? !!d.capture : !!d, f) : xb(a2, b, c, false, d, f);
    }
    function xb(a2, b, c, d, f, g) {
      if (!b) throw Error("Invalid event type");
      var k = fa(f) ? !!f.capture : !!f, u = yb(a2);
      u || (a2[sb] = u = new Ta(a2));
      c = u.add(b, c, d, k, g);
      if (c.proxy) return c;
      d = zb();
      c.proxy = d;
      d.src = a2;
      d.listener = c;
      if (a2.addEventListener) ob || (f = k), void 0 === f && (f = false), a2.addEventListener(b.toString(), d, f);
      else if (a2.attachEvent) a2.attachEvent(Ab(b.toString()), d);
      else if (a2.addListener && a2.removeListener) a2.addListener(d);
      else throw Error("addEventListener and attachEvent are unavailable.");
      return c;
    }
    function zb() {
      var a2 = Bb, b = mb ? function(c) {
        return a2.call(b.src, b.listener, c);
      } : function(c) {
        c = a2.call(b.src, b.listener, c);
        if (!c) return c;
      };
      return b;
    }
    function vb(a2, b, c, d, f) {
      if (ea(b)) {
        for (var g = 0; g < b.length; g++) vb(a2, b[g], c, d, f);
        return null;
      }
      c = wb(c);
      return Pa(a2) ? a2.O.add(String(b), c, true, fa(d) ? !!d.capture : !!d, f) : xb(a2, b, c, true, d, f);
    }
    function Cb(a2, b, c, d, f) {
      if (ea(b)) for (var g = 0; g < b.length; g++) Cb(a2, b[g], c, d, f);
      else d = fa(d) ? !!d.capture : !!d, c = wb(c), Pa(a2) ? (a2 = a2.O, b = String(b).toString(), b in a2.a && (g = a2.a[b], c = Ua(g, c, d, f), -1 < c && (Sa(g[c]), Array.prototype.splice.call(g, c, 1), 0 == g.length && (delete a2.a[b], a2.b--)))) : a2 && (a2 = yb(a2)) && (c = Wa(a2, b, c, d, f)) && Db(c);
    }
    function Db(a2) {
      if ("number" != typeof a2 && a2 && !a2.ca) {
        var b = a2.src;
        if (Pa(b)) Va(b.O, a2);
        else {
          var c = a2.type, d = a2.proxy;
          b.removeEventListener ? b.removeEventListener(c, d, a2.capture) : b.detachEvent ? b.detachEvent(Ab(c), d) : b.addListener && b.removeListener && b.removeListener(d);
          (c = yb(b)) ? (Va(c, a2), 0 == c.b && (c.src = null, b[sb] = null)) : Sa(a2);
        }
      }
    }
    function Ab(a2) {
      return a2 in tb ? tb[a2] : tb[a2] = "on" + a2;
    }
    function Eb(a2, b, c, d) {
      var f = true;
      if (a2 = yb(a2)) {
        if (b = a2.a[b.toString()]) for (b = b.concat(), a2 = 0; a2 < b.length; a2++) {
          var g = b[a2];
          g && g.capture == c && !g.ca && (g = Fb(g, d), f = f && false !== g);
        }
      }
      return f;
    }
    function Fb(a2, b) {
      var c = a2.listener, d = a2.va || a2.src;
      a2.sa && Db(a2);
      return c.call(d, b);
    }
    function Bb(a2, b) {
      if (a2.ca) return true;
      if (!mb) {
        if (!b) a: {
          b = ["window", "event"];
          for (var c = h, d = 0; d < b.length; d++) if (c = c[b[d]], null == c) {
            b = null;
            break a;
          }
          b = c;
        }
        d = b;
        b = new qb(d, this);
        c = true;
        if (!(0 > d.keyCode || void 0 != d.returnValue)) {
          a: {
            var f = false;
            if (0 == d.keyCode) try {
              d.keyCode = -1;
              break a;
            } catch (k) {
              f = true;
            }
            if (f || void 0 == d.returnValue) d.returnValue = true;
          }
          d = [];
          for (f = b.b; f; f = f.parentNode) d.push(f);
          a2 = a2.type;
          for (f = d.length - 1; !b.i && 0 <= f; f--) {
            b.b = d[f];
            var g = Eb(d[f], a2, true, b);
            c = c && g;
          }
          for (f = 0; !b.i && f < d.length; f++) b.b = d[f], g = Eb(d[f], a2, false, b), c = c && g;
        }
        return c;
      }
      return Fb(a2, new qb(b, this));
    }
    function yb(a2) {
      a2 = a2[sb];
      return a2 instanceof Ta ? a2 : null;
    }
    var Gb = "__closure_events_fn_" + (1e9 * Math.random() >>> 0);
    function wb(a2) {
      if ("function" == da(a2)) return a2;
      a2[Gb] || (a2[Gb] = function(b) {
        return a2.handleEvent(b);
      });
      return a2[Gb];
    }
    function z() {
      Ka.call(this);
      this.O = new Ta(this);
      this.kb = this;
      this.ra = null;
    }
    p(z, Ka);
    z.prototype[Oa] = true;
    z.prototype.Ka = function(a2) {
      this.ra = a2;
    };
    z.prototype.removeEventListener = function(a2, b, c, d) {
      Cb(this, a2, b, c, d);
    };
    function A(a2, b) {
      var c, d = a2.ra;
      if (d) for (c = []; d; d = d.ra) c.push(d);
      a2 = a2.kb;
      d = b.type || b;
      if (l(b)) b = new v(b, a2);
      else if (b instanceof v) b.target = b.target || a2;
      else {
        var f = b;
        b = new v(d, a2);
        ua(b, f);
      }
      f = true;
      if (c) for (var g = c.length - 1; !b.i && 0 <= g; g--) {
        var k = b.b = c[g];
        f = Hb(k, d, true, b) && f;
      }
      b.i || (k = b.b = a2, f = Hb(k, d, true, b) && f, b.i || (f = Hb(k, d, false, b) && f));
      if (c) for (g = 0; !b.i && g < c.length; g++) k = b.b = c[g], f = Hb(k, d, false, b) && f;
    }
    z.prototype.N = function() {
      z.g.N.call(this);
      if (this.O) {
        var a2 = this.O, c;
        for (c in a2.a) {
          for (var d = a2.a[c], f = 0; f < d.length; f++) Sa(d[f]);
          delete a2.a[c];
          a2.b--;
        }
      }
      this.ra = null;
    };
    function y(a2, b, c, d, f) {
      return a2.O.add(String(b), c, false, d, f);
    }
    function Hb(a2, b, c, d) {
      b = a2.O.a[String(b)];
      if (!b) return true;
      b = b.concat();
      for (var f = true, g = 0; g < b.length; ++g) {
        var k = b[g];
        if (k && !k.ca && k.capture == c) {
          var u = k.listener, Ic = k.va || k.src;
          k.sa && Va(a2.O, k);
          f = false !== u.call(Ic, d) && f;
        }
      }
      return f && 0 != d.hb;
    }
    function B(a2, b) {
      return Xa(a2.O, ba(b) ? String(b) : void 0);
    }
    function Ib(a2, b) {
      z.call(this);
      this.a = a2 || 1;
      this.b = b || h;
      this.i = m(this.ub, this);
      this.m = la();
    }
    p(Ib, z);
    e = Ib.prototype;
    e.W = false;
    e.U = null;
    function Jb(a2, b) {
      a2.a = b;
      a2.U && a2.W ? (a2.stop(), a2.start()) : a2.U && a2.stop();
    }
    e.ub = function() {
      if (this.W) {
        var a2 = la() - this.m;
        0 < a2 && a2 < 0.8 * this.a ? this.U = this.b.setTimeout(this.i, this.a - a2) : (this.U && (this.b.clearTimeout(this.U), this.U = null), A(this, "tick"), this.W && (this.U = this.b.setTimeout(this.i, this.a), this.m = la()));
      }
    };
    e.start = function() {
      this.W = true;
      this.U || (this.U = this.b.setTimeout(this.i, this.a), this.m = la());
    };
    e.stop = function() {
      this.W = false;
      this.U && (this.b.clearTimeout(this.U), this.U = null);
    };
    e.N = function() {
      Ib.g.N.call(this);
      this.stop();
      delete this.b;
    };
    function Kb(a2, b, c) {
      if ("function" == da(a2)) c && (a2 = m(a2, c));
      else if (a2 && "function" == typeof a2.handleEvent) a2 = m(a2.handleEvent, a2);
      else throw Error("Invalid listener argument");
      return 2147483647 < Number(b) ? -1 : h.setTimeout(a2, b || 0);
    }
    function Lb(a2, b) {
      this.a = ba(a2) ? a2 : 0;
      this.b = ba(b) ? b : 0;
    }
    Lb.prototype.toString = function() {
      return "(" + this.a + ", " + this.b + ")";
    };
    Lb.prototype.ceil = function() {
      this.a = Math.ceil(this.a);
      this.b = Math.ceil(this.b);
      return this;
    };
    Lb.prototype.floor = function() {
      this.a = Math.floor(this.a);
      this.b = Math.floor(this.b);
      return this;
    };
    Lb.prototype.round = function() {
      this.a = Math.round(this.a);
      this.b = Math.round(this.b);
      return this;
    };
    function Mb(a2, b, c, d) {
      this.m = a2;
      this.i = b;
      this.a = c;
      this.b = d;
    }
    Mb.prototype.toString = function() {
      return "(" + this.m + "t, " + this.i + "r, " + this.a + "b, " + this.b + "l)";
    };
    Mb.prototype.ceil = function() {
      this.m = Math.ceil(this.m);
      this.i = Math.ceil(this.i);
      this.a = Math.ceil(this.a);
      this.b = Math.ceil(this.b);
      return this;
    };
    Mb.prototype.floor = function() {
      this.m = Math.floor(this.m);
      this.i = Math.floor(this.i);
      this.a = Math.floor(this.a);
      this.b = Math.floor(this.b);
      return this;
    };
    Mb.prototype.round = function() {
      this.m = Math.round(this.m);
      this.i = Math.round(this.i);
      this.a = Math.round(this.a);
      this.b = Math.round(this.b);
      return this;
    };
    function C(a2, b) {
      this.width = a2;
      this.height = b;
    }
    e = C.prototype;
    e.toString = function() {
      return "(" + this.width + " x " + this.height + ")";
    };
    e.aspectRatio = function() {
      return this.width / this.height;
    };
    e.ceil = function() {
      this.width = Math.ceil(this.width);
      this.height = Math.ceil(this.height);
      return this;
    };
    e.floor = function() {
      this.width = Math.floor(this.width);
      this.height = Math.floor(this.height);
      return this;
    };
    e.round = function() {
      this.width = Math.round(this.width);
      this.height = Math.round(this.height);
      return this;
    };
    function Nb(a2, b, c, d) {
      this.a = a2;
      this.b = b;
      this.width = c;
      this.height = d;
    }
    Nb.prototype.toString = function() {
      return "(" + this.a + ", " + this.b + " - " + this.width + "w x " + this.height + "h)";
    };
    Nb.prototype.ceil = function() {
      this.a = Math.ceil(this.a);
      this.b = Math.ceil(this.b);
      this.width = Math.ceil(this.width);
      this.height = Math.ceil(this.height);
      return this;
    };
    Nb.prototype.floor = function() {
      this.a = Math.floor(this.a);
      this.b = Math.floor(this.b);
      this.width = Math.floor(this.width);
      this.height = Math.floor(this.height);
      return this;
    };
    Nb.prototype.round = function() {
      this.a = Math.round(this.a);
      this.b = Math.round(this.b);
      this.width = Math.round(this.width);
      this.height = Math.round(this.height);
      return this;
    };
    var Ob = !cb && !w || w && 9 <= Number(kb) || cb && jb("1.9.1"), Pb = w || ab || db;
    function Qb(a2) {
      return a2 ? new Rb(Sb(a2)) : ma || (ma = new Rb());
    }
    function Tb(a2, b) {
      var c = b || document;
      return c.querySelectorAll && c.querySelector ? c.querySelectorAll("." + a2) : Ub(a2, b);
    }
    function Ub(a2, b) {
      var c;
      var d = document;
      b = b || d;
      if (b.querySelectorAll && b.querySelector && a2) return b.querySelectorAll(a2 ? "." + a2 : "");
      if (a2 && b.getElementsByClassName) {
        var f = b.getElementsByClassName(a2);
        return f;
      }
      f = b.getElementsByTagName("*");
      if (a2) {
        var g = {};
        for (d = c = 0; b = f[d]; d++) {
          var k = b.className, u;
          if (u = "function" == typeof k.split) u = 0 <= Ca(k.split(/\s+/), a2);
          u && (g[c++] = b);
        }
        g.length = c;
        return g;
      }
      return f;
    }
    function Vb(a2) {
      a2 = a2.document;
      a2 = "CSS1Compat" == a2.compatMode ? a2.documentElement : a2.body;
      return new C(a2.clientWidth, a2.clientHeight);
    }
    function Wb(a2) {
      for (var b; b = a2.firstChild; ) a2.removeChild(b);
    }
    function Xb(a2) {
      a2 && a2.parentNode && a2.parentNode.removeChild(a2);
    }
    function Yb(a2) {
      return Ob && void 0 != a2.children ? a2.children : Da(a2.childNodes, function(b) {
        return 1 == b.nodeType;
      });
    }
    function Zb(a2) {
      var b;
      if (Pb && !(w && jb("9") && !jb("10") && h.SVGElement && a2 instanceof h.SVGElement) && (b = a2.parentElement)) return b;
      b = a2.parentNode;
      return fa(b) && 1 == b.nodeType ? b : null;
    }
    function Sb(a2) {
      return 9 == a2.nodeType ? a2 : a2.ownerDocument || a2.document;
    }
    function $b(a2, b) {
      if ("textContent" in a2) a2.textContent = b;
      else if (3 == a2.nodeType) a2.data = String(b);
      else if (a2.firstChild && 3 == a2.firstChild.nodeType) {
        for (; a2.lastChild != a2.firstChild; ) a2.removeChild(a2.lastChild);
        a2.firstChild.data = String(b);
      } else Wb(a2), a2.appendChild(Sb(a2).createTextNode(String(b)));
    }
    function Rb(a2) {
      this.a = a2 || h.document || document;
    }
    Rb.prototype.c = function() {
      return l(void 0) ? this.a.getElementById(void 0) : void 0;
    };
    function D(a2, b) {
      return a2.a.createElement(String(b));
    }
    Rb.prototype.appendChild = function(a2, b) {
      a2.appendChild(b);
    };
    function E(a2, b, c) {
      if (l(b)) (b = ac(a2, b)) && (a2.style[b] = c);
      else for (var d in b) {
        c = a2;
        var f = b[d], g = ac(c, d);
        g && (c.style[g] = f);
      }
    }
    var bc = {};
    function ac(a2, b) {
      var c = bc[b];
      if (!c) {
        var d = xa(b);
        c = d;
        void 0 === a2.style[d] && (d = (db ? "Webkit" : cb ? "Moz" : w ? "ms" : ab ? "O" : null) + ya(d), void 0 !== a2.style[d] && (c = d));
        bc[b] = c;
      }
      return c;
    }
    function cc(a2, b) {
      var c = Sb(a2);
      return c.defaultView && c.defaultView.getComputedStyle && (a2 = c.defaultView.getComputedStyle(a2, null)) ? a2[b] || a2.getPropertyValue(b) || "" : "";
    }
    function dc(a2, b, c) {
      if (b instanceof Lb) {
        var d = b.a;
        b = b.b;
      } else d = b, b = c;
      a2.style.left = ec(d, false);
      a2.style.top = ec(b, false);
    }
    function fc(a2, b, c) {
      if (b instanceof C) c = b.height, b = b.width;
      else if (void 0 == c) throw Error("missing height argument");
      a2.style.width = ec(b, true);
      a2.style.height = ec(c, true);
    }
    function ec(a2, b) {
      "number" == typeof a2 && (a2 = (b ? Math.round(a2) : a2) + "px");
      return a2;
    }
    function F(a2, b) {
      a2 = a2.style;
      "opacity" in a2 ? a2.opacity = b : "MozOpacity" in a2 ? a2.MozOpacity = b : "filter" in a2 && (a2.filter = "" === b ? "" : "alpha(opacity=" + 100 * Number(b) + ")");
    }
    function gc(a2, b) {
      a2.style.display = b ? "" : "none";
    }
    function hc(a2) {
      var b = Sb(a2), c = w && a2.currentStyle;
      if (c && "CSS1Compat" == Qb(b).a.compatMode && "auto" != c.width && "auto" != c.height && !c.boxSizing) return b = ic(a2, c.width, "width", "pixelWidth"), a2 = ic(a2, c.height, "height", "pixelHeight"), new C(b, a2);
      c = new C(a2.offsetWidth, a2.offsetHeight);
      if (w) {
        b = jc(a2, "paddingLeft");
        var d = jc(a2, "paddingRight"), f = jc(a2, "paddingTop"), g = jc(a2, "paddingBottom");
        b = new Mb(f, d, g, b);
      } else b = cc(a2, "paddingLeft"), d = cc(a2, "paddingRight"), f = cc(a2, "paddingTop"), g = cc(a2, "paddingBottom"), b = new Mb(
        parseFloat(f),
        parseFloat(d),
        parseFloat(g),
        parseFloat(b)
      );
      !w || 9 <= Number(kb) ? (d = cc(a2, "borderLeftWidth"), f = cc(a2, "borderRightWidth"), g = cc(a2, "borderTopWidth"), a2 = cc(a2, "borderBottomWidth"), a2 = new Mb(parseFloat(g), parseFloat(f), parseFloat(a2), parseFloat(d))) : (d = kc(a2, "borderLeft"), f = kc(a2, "borderRight"), g = kc(a2, "borderTop"), a2 = kc(a2, "borderBottom"), a2 = new Mb(g, f, a2, d));
      return new C(c.width - a2.b - b.b - b.i - a2.i, c.height - a2.m - b.m - b.a - a2.a);
    }
    function ic(a2, b, c, d) {
      if (/^\d+px?$/.test(b)) return parseInt(b, 10);
      var f = a2.style[c], g = a2.runtimeStyle[c];
      a2.runtimeStyle[c] = a2.currentStyle[c];
      a2.style[c] = b;
      b = a2.style[d];
      a2.style[c] = f;
      a2.runtimeStyle[c] = g;
      return +b;
    }
    function jc(a2, b) {
      return (b = a2.currentStyle ? a2.currentStyle[b] : null) ? ic(a2, b, "left", "pixelLeft") : 0;
    }
    var lc = { thin: 2, medium: 4, thick: 6 };
    function kc(a2, b) {
      if ("none" == (a2.currentStyle ? a2.currentStyle[b + "Style"] : null)) return 0;
      b = a2.currentStyle ? a2.currentStyle[b + "Width"] : null;
      return b in lc ? lc[b] : ic(a2, b, "left", "pixelLeft");
    }
    function mc(a2) {
      Ka.call(this);
      this.b = a2;
      this.a = {};
    }
    p(mc, Ka);
    var nc = [];
    function G(a2, b, c, d) {
      ea(c) || (c && (nc[0] = c.toString()), c = nc);
      for (var f = 0; f < c.length; f++) {
        var g = x(b, c[f], d || a2.handleEvent, false, a2.b || a2);
        if (!g) break;
        a2.a[g.key] = g;
      }
    }
    function oc(a2, b, c, d, f, g) {
      if (ea(c)) for (var k = 0; k < c.length; k++) oc(a2, b, c[k], d, f, g);
      else d = d || a2.handleEvent, f = fa(f) ? !!f.capture : !!f, g = g || a2.b || a2, d = wb(d), f = !!f, c = Pa(b) ? Wa(b.O, String(c), d, f, g) : b ? (b = yb(b)) ? Wa(b, c, d, f, g) : null : null, c && (Db(c), delete a2.a[c.key]);
    }
    function pc(a2) {
      qa(a2.a, function(b, c) {
        this.a.hasOwnProperty(c) && Db(b);
      }, a2);
      a2.a = {};
    }
    mc.prototype.N = function() {
      mc.g.N.call(this);
      pc(this);
    };
    mc.prototype.handleEvent = function() {
      throw Error("EventHandler.handleEvent not implemented");
    };
    function qc() {
    }
    qc.a = void 0;
    qc.b = function() {
      return qc.a ? qc.a : qc.a = new qc();
    };
    qc.prototype.a = 0;
    function rc(a2) {
      z.call(this);
      this.i = a2 || Qb();
      this.qa = null;
      this.H = false;
      this.m = null;
      this.P = void 0;
      this.I = this.B = this.F = null;
      this.ga = false;
    }
    p(rc, z);
    e = rc.prototype;
    e.wb = qc.b();
    function sc(a2) {
      return a2.qa || (a2.qa = ":" + (a2.wb.a++).toString(36));
    }
    e.c = function() {
      return this.m;
    };
    function H(a2) {
      a2.P || (a2.P = new mc(a2));
      return a2.P;
    }
    function tc(a2, b) {
      if (a2 == b) throw Error("Unable to set parent component");
      var c;
      if (c = b && a2.F && a2.qa) {
        c = a2.F;
        var d = a2.qa;
        c = c.I && d ? q(c.I, d) || null : null;
      }
      if (c && a2.F != b) throw Error("Unable to set parent component");
      a2.F = b;
      rc.g.Ka.call(a2, b);
    }
    e.Ka = function(a2) {
      if (this.F && this.F != a2) throw Error("Method not supported");
      rc.g.Ka.call(this, a2);
    };
    e.w = function() {
      this.m = D(this.i, "DIV");
    };
    function I(a2, b, c) {
      if (a2.H) throw Error("Component already rendered");
      a2.m || a2.w();
      b ? b.insertBefore(a2.m, c || null) : a2.i.a.body.appendChild(a2.m);
      a2.F && !a2.F.H || a2.A();
    }
    e.$ = function(a2) {
      if (this.H) throw Error("Component already rendered");
      if (a2) {
        this.ga = true;
        var b = Sb(a2);
        this.i && this.i.a == b || (this.i = Qb(a2));
        this.D(a2);
        this.A();
      } else throw Error("Invalid element to decorate");
    };
    e.D = function(a2) {
      this.m = a2;
    };
    e.A = function() {
      this.H = true;
      J(this, function(a2) {
        !a2.H && a2.c() && a2.A();
      });
    };
    e.ha = function() {
      J(this, function(a2) {
        a2.H && a2.ha();
      });
      this.P && pc(this.P);
      this.H = false;
    };
    e.N = function() {
      this.H && this.ha();
      this.P && (Na(this.P), delete this.P);
      J(this, function(a2) {
        Na(a2);
      });
      !this.ga && this.m && Xb(this.m);
      this.F = this.m = this.I = this.B = null;
      rc.g.N.call(this);
    };
    e.T = function(a2, b) {
      var c = K(this);
      if (a2.H && (b || !this.H)) throw Error("Component already rendered");
      if (0 > c || c > K(this)) throw Error("Child component index out of bounds");
      this.I && this.B || (this.I = {}, this.B = []);
      if (a2.F == this) {
        var d = sc(a2);
        this.I[d] = a2;
        Ha(this.B, a2);
      } else {
        d = this.I;
        var f = sc(a2);
        if (null !== d && f in d) throw Error('The object already contains the key "' + f + '"');
        d[f] = a2;
      }
      tc(a2, this);
      Ia(this.B, c, 0, a2);
      a2.H && this.H && a2.F == this ? (b = this.ia(), c = b.childNodes[c] || null, c != a2.c() && b.insertBefore(a2.c(), c)) : b ? (this.m || this.w(), c = L(this, c + 1), I(a2, this.ia(), c ? c.m : null)) : this.H && !a2.H && a2.m && a2.m.parentNode && 1 == a2.m.parentNode.nodeType && a2.A();
    };
    e.ia = function() {
      return this.m;
    };
    function K(a2) {
      return a2.B ? a2.B.length : 0;
    }
    function L(a2, b) {
      return a2.B ? a2.B[b] || null : null;
    }
    function J(a2, b, c) {
      a2.B && t(a2.B, b, c);
    }
    e.removeChild = function(a2, b) {
      if (a2) {
        var c = l(a2) ? a2 : sc(a2);
        a2 = this.I && c ? q(this.I, c) || null : null;
        if (c && a2) {
          var d = this.I;
          c in d && delete d[c];
          Ha(this.B, a2);
          b && (a2.ha(), a2.m && Xb(a2.m));
          tc(a2, null);
        }
      }
      if (!a2) throw Error("Child is not in parent component");
      return a2;
    };
    function uc(a2) {
      for (var b = []; a2.B && 0 != a2.B.length; ) b.push(a2.removeChild(L(a2, 0), true));
      return b;
    }
    function M(a2) {
      rc.call(this, a2);
      this.Aa = true;
    }
    p(M, rc);
    e = M.prototype;
    e.M = function(a2) {
      this.Aa = a2;
    };
    function N(a2) {
      a2.M(false);
    }
    function O(a2) {
      return a2.H && a2.Aa;
    }
    e.T = function(a2, b) {
      a2.M(this.Aa);
      M.g.T.call(this, a2, b);
    };
    e.update = function() {
      var a2 = this.c();
      a2.tabIndex = -1;
      a2.removeAttribute("tabIndex");
    };
    e.v = function() {
      return "jx";
    };
    e.A = function() {
      M.g.A.call(this);
      O(this) && this.update();
    };
    var vc = /#(.)(.)(.)/;
    function wc(a2, b, c) {
      a2 = Number(a2);
      b = Number(b);
      c = Number(c);
      if (a2 != (a2 & 255) || b != (b & 255) || c != (c & 255)) throw Error('"(' + a2 + "," + b + "," + c + '") is not a valid RGB color');
      return "#" + xc(a2.toString(16)) + xc(b.toString(16)) + xc(c.toString(16));
    }
    function yc(a2) {
      return wc(a2[0], a2[1], a2[2]);
    }
    var zc = /^#(?:[0-9a-f]{3}){1,2}$/i;
    function xc(a2) {
      return 1 == a2.length ? "0" + a2 : a2;
    }
    function Ac(a2) {
      M.call(this, a2);
      this.h = this.u = this.j = null;
      this.G = false;
      this.f = [];
      this.K = this.R = this.V = this.J = true;
      this.o = this.l = this.a = this.s = null;
      this.C = Bc;
    }
    p(Ac, M);
    var Bc = 500;
    function Cc(a2, b) {
      if (l(b)) {
        var c = new Dc();
        c.src = b;
        b = c;
      }
      Ga(a2.f, b);
      O(a2) && a2.update();
    }
    function Ec(a2, b, c) {
      a2 = Math.round(Math.sqrt(Math.pow(a2.j.width, 2) + Math.pow(a2.j.height, 2)) / Math.sqrt(Math.pow(a2.h.width, 2) + Math.pow(a2.h.height, 2)));
      E(b, "filter", c ? "blur(" + a2 + "px)" : "none");
    }
    e = Ac.prototype;
    e.Bc = function() {
      F(this.a, 1);
      this.S = setTimeout(m(this.Ac, this), 1.25 * this.C);
    };
    e.Ac = function() {
      clearTimeout(this.S);
      this.S = null;
      E(this.s, Fc);
      E(this.s, Gc);
      Ec(this, this.s, this.G);
      null !== this.o && Hc(this, this.o);
      this.o = null;
    };
    function Hc(a2, b) {
      if (a2.l != b) {
        var c = a2.f[b] ? a2.f[b] : void 0;
        c && (a2.a ? a2.o = b : (a2.C = Bc * (null === a2.l ? 0.3 : 1), a2.l = b, a2.o = null, a2.a || (a2.a = D(a2.i, "IMG"), a2.b.appendChild(a2.a), E(a2.a, Jc), b = a2.C, E(a2.a, "transition", 0 < b ? "opacity " + 1e-3 * b + "s ease" : "none"), x(a2.a, "load", a2.Db, false, a2)), E(a2.a, "z-index", 2), F(a2.a, 0), a2.a.src = c.src));
      }
    }
    function Kc(a2) {
      var b = hc(a2.c()), c = a2.u ? a2.u : a2.h;
      c = new Nb(0, 0, c.width, c.height);
      var d = b.width / b.height, f = a2.J ? c.width / c.height : d, g = (a2.R || !(null !== a2.u || 1 == a2.f.length)) && c.width < b.width && c.height < b.height, k = a2.K;
      if (a2.V && (c.width > b.width || c.height > b.height) || g || k) d = d > f, !k && d || k && !d ? (c.width = b.height * f, c.height = b.height) : (c.width = b.width, c.height = b.width / f);
      c.a = Math.round((b.width - c.width) / 2);
      c.b = Math.round((b.height - c.height) / 2);
      dc(a2.b, c.a, c.b);
      fc(a2.b, c.width, c.height);
    }
    function Lc(a2) {
      null !== a2.l && null !== a2.h && Kc(a2);
      if (0 < a2.f.length) if (1 < a2.f.length) {
        var b = a2.j.width, c = a2.j.height, d = 0;
        for (d in a2.f) {
          d = Number(d);
          var f = a2.f[d];
          if (f.width >= b || f.height > c) break;
        }
        Hc(a2, d);
      } else null === a2.l && Hc(a2, 0);
    }
    e.update = function() {
      Ac.g.update.call(this);
      this.j = hc(this.c());
      Lc(this);
      E(this.c(), "background-color", "none");
    };
    e.v = function() {
      return "jx-imageset";
    };
    e.D = function() {
      throw Error("Method not supported");
    };
    e.w = function() {
      Ac.g.w.call(this);
      var a2 = this.c(), b = this.i;
      this.b = D(b, "DIV");
      a2.appendChild(this.b);
      this.s = D(b, "IMG");
      this.b.appendChild(this.s);
      a2 = this.c();
      P(a2, this.v());
      E(a2, Mc);
      E(a2, Gc);
      E(this.b, Nc);
    };
    e.Db = function() {
      var a2 = this.a;
      this.h = new C(a2.naturalWidth, a2.naturalHeight);
      this.G = 128 > Math.sqrt(Math.pow(this.h.width, 2) + Math.pow(this.h.height, 2));
      Kc(this);
      E(a2, Gc);
      Ec(this, a2, this.G);
      window.requestAnimationFrame(m(this.Bc, this));
    };
    var Mc = { overflow: "hidden" }, Gc = { width: "100%", height: "100%" }, Nc = { position: "relative", overflow: "hidden" }, Fc = { position: "absolute", "z-index": 1 }, Jc = { position: "absolute", "z-index": 2 };
    function Dc() {
      this.height = this.width = 0;
    }
    function Oc(a) {
      a = String(a);
      if (/^\s*$/.test(a) ? 0 : /^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g, "@").replace(/(?:"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)[\s\u2028\u2029]*(?=:|,|]|}|$)/g, "]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g, ""))) try {
        return eval("(" + a + ")");
      } catch (b) {
      }
      throw Error("Invalid JSON string: " + a);
    }
    function Pc(a2, b) {
      this.b = {};
      this.a = [];
      this.i = 0;
      var c = arguments.length;
      if (1 < c) {
        if (c % 2) throw Error("Uneven number of arguments");
        for (var d = 0; d < c; d += 2) this.set(arguments[d], arguments[d + 1]);
      } else if (a2) if (a2 instanceof Pc) for (c = a2.Fa(), d = 0; d < c.length; d++) this.set(c[d], a2.get(c[d]));
      else for (d in a2) this.set(d, a2[d]);
    }
    Pc.prototype.Fa = function() {
      if (this.i != this.a.length) {
        for (var a2 = 0, b = 0; a2 < this.a.length; ) {
          var c = this.a[a2];
          Object.prototype.hasOwnProperty.call(this.b, c) && (this.a[b++] = c);
          a2++;
        }
        this.a.length = b;
      }
      if (this.i != this.a.length) {
        var d = {};
        for (b = a2 = 0; a2 < this.a.length; ) c = this.a[a2], Object.prototype.hasOwnProperty.call(d, c) || (this.a[b++] = c, d[c] = 1), a2++;
        this.a.length = b;
      }
      return this.a.concat();
    };
    Pc.prototype.get = function(a2, b) {
      return Object.prototype.hasOwnProperty.call(this.b, a2) ? this.b[a2] : b;
    };
    Pc.prototype.set = function(a2, b) {
      Object.prototype.hasOwnProperty.call(this.b, a2) || (this.i++, this.a.push(a2));
      this.b[a2] = b;
    };
    Pc.prototype.forEach = function(a2, b) {
      for (var c = this.Fa(), d = 0; d < c.length; d++) {
        var f = c[d], g = this.get(f);
        a2.call(b, g, f, this);
      }
    };
    var Qc = /^(?:([^:/?#.]+):)?(?:\/\/(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\?([^#]*))?(?:#([\s\S]*))?$/;
    function Rc() {
    }
    Rc.prototype.a = null;
    function Sc(a2) {
      var b;
      (b = a2.a) || (b = {}, Tc(a2) && (b[0] = true, b[1] = true), b = a2.a = b);
      return b;
    }
    var Uc;
    function Vc() {
    }
    p(Vc, Rc);
    function Wc(a2) {
      return (a2 = Tc(a2)) ? new ActiveXObject(a2) : new XMLHttpRequest();
    }
    function Tc(a2) {
      if (!a2.b && "undefined" == typeof XMLHttpRequest && "undefined" != typeof ActiveXObject) {
        for (var b = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"], c = 0; c < b.length; c++) {
          var d = b[c];
          try {
            return new ActiveXObject(d), a2.b = d;
          } catch (f) {
          }
        }
        throw Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed");
      }
      return a2.b;
    }
    Uc = new Vc();
    function Xc(a2, b, c) {
      this.reset(a2, b, c, void 0, void 0);
    }
    Xc.prototype.a = null;
    Xc.prototype.reset = function(a2, b, c, d, f) {
      delete this.a;
    };
    function Zc(a2) {
      this.m = a2;
      this.b = this.i = this.a = null;
    }
    function $c(a2, b) {
      this.name = a2;
      this.value = b;
    }
    $c.prototype.toString = function() {
      return this.name;
    };
    var ad = new $c("SEVERE", 1e3), bd = new $c("CONFIG", 700), cd = new $c("FINE", 500);
    function dd(a2) {
      if (a2.i) return a2.i;
      if (a2.a) return dd(a2.a);
      pa("Root logger has no level set.");
      return null;
    }
    Zc.prototype.log = function(a2, b, c) {
      if (a2.value >= dd(this).value) for ("function" == da(b) && (b = b()), a2 = new Xc(a2, String(b), this.m), c && (a2.a = c), c = this; c; ) c = c.a;
    };
    var ed = {}, fd = null;
    function gd(a2) {
      fd || (fd = new Zc(""), ed[""] = fd, fd.i = bd);
      var b;
      if (!(b = ed[a2])) {
        b = new Zc(a2);
        var c = a2.lastIndexOf("."), d = a2.substr(c + 1);
        c = gd(a2.substr(0, c));
        c.b || (c.b = {});
        c.b[d] = b;
        b.a = c;
        ed[a2] = b;
      }
      return b;
    }
    function Q(a2, b) {
      a2 && a2.log(cd, b, void 0);
    }
    function hd(a2) {
      z.call(this);
      this.headers = new Pc();
      this.l = a2 || null;
      this.i = false;
      this.L = this.a = null;
      this.B = this.s = this.I = "";
      this.m = this.o = this.f = this.P = false;
      this.F = 0;
      this.h = null;
      this.u = id;
      this.j = this.C = false;
    }
    p(hd, z);
    var id = "", jd = hd.prototype, kd = gd("goog.net.XhrIo");
    jd.b = kd;
    var ld = /^https?$/i, md = ["POST", "PUT"], nd = [];
    function od(a2, b) {
      var c = new hd();
      nd.push(c);
      b && y(c, "complete", b);
      c.O.add("ready", c.nb, true, void 0, void 0);
      pd(c, a2);
    }
    e = hd.prototype;
    e.nb = function() {
      Na(this);
      Ha(nd, this);
    };
    function pd(a2, b) {
      if (a2.a) throw Error("[goog.net.XhrIo] Object is active with another request=" + a2.I + "; newUri=" + b);
      a2.I = b;
      a2.B = "";
      a2.s = "GET";
      a2.P = false;
      a2.i = true;
      a2.a = a2.l ? Wc(a2.l) : Wc(Uc);
      a2.L = a2.l ? Sc(a2.l) : Sc(Uc);
      a2.a.onreadystatechange = m(a2.$a, a2);
      try {
        Q(a2.b, qd(a2, "Opening Xhr")), a2.o = true, a2.a.open("GET", String(b), true), a2.o = false;
      } catch (f) {
        Q(a2.b, qd(a2, "Error opening Xhr: " + f.message));
        rd(a2, f);
        return;
      }
      b = new Pc(a2.headers);
      var c = Ea(b.Fa()), d = h.FormData && false;
      !(0 <= Ca(md, "GET")) || c || d || b.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
      b.forEach(function(f, g) {
        this.a.setRequestHeader(g, f);
      }, a2);
      a2.u && (a2.a.responseType = a2.u);
      "withCredentials" in a2.a && a2.a.withCredentials !== a2.C && (a2.a.withCredentials = a2.C);
      try {
        sd(a2), 0 < a2.F && (a2.j = td(a2.a), Q(a2.b, qd(a2, "Will abort after " + a2.F + "ms if incomplete, xhr2 " + a2.j)), a2.j ? (a2.a.timeout = a2.F, a2.a.ontimeout = m(a2.ib, a2)) : a2.h = Kb(a2.ib, a2.F, a2)), Q(a2.b, qd(a2, "Sending request")), a2.f = true, a2.a.send(""), a2.f = false;
      } catch (f) {
        Q(a2.b, qd(a2, "Send error: " + f.message)), rd(a2, f);
      }
    }
    function td(a2) {
      return w && jb(9) && "number" == typeof a2.timeout && ba(a2.ontimeout);
    }
    function Fa(a2) {
      return "content-type" == a2.toLowerCase();
    }
    e.ib = function() {
      "undefined" != typeof aa && this.a && (this.B = "Timed out after " + this.F + "ms, aborting", Q(this.b, qd(this, this.B)), A(this, "timeout"), this.abort(8));
    };
    function rd(a2, b) {
      a2.i = false;
      a2.a && (a2.m = true, a2.a.abort(), a2.m = false);
      a2.B = b;
      ud(a2);
      vd(a2);
    }
    function ud(a2) {
      a2.P || (a2.P = true, A(a2, "complete"), A(a2, "error"));
    }
    e.abort = function() {
      this.a && this.i && (Q(this.b, qd(this, "Aborting")), this.i = false, this.m = true, this.a.abort(), this.m = false, A(this, "complete"), A(this, "abort"), vd(this));
    };
    e.N = function() {
      this.a && (this.i && (this.i = false, this.m = true, this.a.abort(), this.m = false), vd(this, true));
      hd.g.N.call(this);
    };
    e.$a = function() {
      this.ea || (this.o || this.f || this.m ? wd(this) : this.Eb());
    };
    e.Eb = function() {
      wd(this);
    };
    function wd(a2) {
      if (a2.i && "undefined" != typeof aa) {
        if (a2.L[1] && 4 == xd(a2) && 2 == yd(a2)) Q(a2.b, qd(a2, "Local request error detected and ignored"));
        else if (a2.f && 4 == xd(a2)) Kb(a2.$a, 0, a2);
        else if (A(a2, "readystatechange"), 4 == xd(a2)) {
          Q(a2.b, qd(a2, "Request complete"));
          a2.i = false;
          try {
            var b = yd(a2);
            a: switch (b) {
              case 200:
              case 201:
              case 202:
              case 204:
              case 206:
              case 304:
              case 1223:
                var c = true;
                break a;
              default:
                c = false;
            }
            var d;
            if (!(d = c)) {
              var f;
              if (f = 0 === b) {
                var g = String(a2.I).match(Qc)[1] || null;
                if (!g && h.self && h.self.location) {
                  var k = h.self.location.protocol;
                  g = k.substr(0, k.length - 1);
                }
                f = !ld.test(g ? g.toLowerCase() : "");
              }
              d = f;
            }
            if (d) A(a2, "complete"), A(a2, "success");
            else {
              try {
                var u = 2 < xd(a2) ? a2.a.statusText : "";
              } catch (Ic) {
                Q(a2.b, "Can not get status: " + Ic.message), u = "";
              }
              a2.B = u + " [" + yd(a2) + "]";
              ud(a2);
            }
          } finally {
            vd(a2);
          }
        }
      }
    }
    function vd(a2, b) {
      if (a2.a) {
        sd(a2);
        var c = a2.a, d = a2.L[0] ? ca : null;
        a2.a = null;
        a2.L = null;
        b || A(a2, "ready");
        try {
          c.onreadystatechange = d;
        } catch (f) {
          (a2 = a2.b) && a2.log(ad, "Problem encountered resetting onreadystatechange: " + f.message, void 0);
        }
      }
    }
    function sd(a2) {
      a2.a && a2.j && (a2.a.ontimeout = null);
      a2.h && (h.clearTimeout(a2.h), a2.h = null);
    }
    function xd(a2) {
      return a2.a ? a2.a.readyState : 0;
    }
    function yd(a2) {
      try {
        return 2 < xd(a2) ? a2.a.status : -1;
      } catch (b) {
        return -1;
      }
    }
    function qd(a2, b) {
      return b + " [" + a2.s + " " + a2.I + " " + yd(a2) + "]";
    }
    function R(a2) {
      M.call(this, a2);
      this.fa = true;
      this.Ba = 0;
      this.J = new Ib();
      Jb(this.J, zd);
    }
    p(R, M);
    var zd = 1e3;
    e = R.prototype;
    e.isVisible = function() {
      return this.fa;
    };
    function Ad(a2) {
      a2.Ba = 0;
      a2.J.W || (a2.fa = true, a2.za(), A(a2, "show"), a2.J.start());
    }
    e.M = function(a2) {
      R.g.M.call(this, a2);
      J(this, function(b) {
        b.M(a2);
      });
    };
    e.za = function() {
      var a2 = this.c();
      this.ga ? (a2 = Yb(a2), t(a2, function(b) {
        F(b, true === this.fa ? 1 : 0);
      }, this)) : F(a2, true === this.fa ? 1 : 0);
    };
    e.update = function() {
      R.g.update.call(this);
      this.za();
      J(this, function(a2) {
        a2.update();
      });
    };
    e.D = function(a2) {
      R.g.D.call(this, a2);
      this.ga || E(this.c(), Bd);
    };
    e.w = function() {
      R.g.w.call(this);
      this.ga || E(this.c(), Bd);
    };
    e.Gb = function() {
      Ad(this);
    };
    e.Fb = function() {
      this.Ba++;
      3 < this.Ba && (this.fa = false, this.za(), A(this, "hide"), this.J.W && this.J.stop());
    };
    e.A = function() {
      R.g.A.call(this);
      G(H(this), this.c(), "mousemove", this.Gb);
      x(this.J, "tick", this.Fb, false, this);
      Ad(this);
    };
    var Bd = { transition: "opacity 0.125s linear" };
    function P(a2, b) {
      if (a2.classList) a2.classList.add(b);
      else {
        if (a2.classList) var c = !a2.classList.contains(b);
        else a2.classList ? c = a2.classList : (c = a2.className, c = l(c) && c.match(/\S+/g) || []), c = !(0 <= Ca(c, b));
        c && (a2.className += 0 < a2.className.length ? " " + b : b);
      }
    }
    function Cd(a2, b) {
      M.call(this, b);
      this.b = 0;
      this.h = 100;
      this.a = 50;
      this.j = false;
    }
    p(Cd, M);
    function Dd(a2) {
      var b = a2.h - a2.b;
      a2.a = Math.min(a2.h, Math.max(a2.b, a2.a));
      var c = 100 * a2.a / b;
      b = a2.a / b * a2.l.width;
      var d = a2.l.width - b;
      E(a2.s, "width", b + "px");
      E(a2.u, "width", d + "px");
      dc(a2.o, c + "%");
    }
    e = Cd.prototype;
    e.update = function() {
      Cd.g.update.call(this);
      this.l = hc(this.c());
      Dd(this);
    };
    e.D = function() {
      throw Error("Method not supported");
    };
    e.v = function() {
      return "jx-range-slider";
    };
    e.w = function() {
      Cd.g.w.call(this);
      var a2 = this.i, b = this.c();
      this.s = D(a2, "DIV");
      b.appendChild(this.s);
      this.u = D(a2, "DIV");
      b.appendChild(this.u);
      this.o = D(a2, "DIV");
      b.appendChild(this.o);
      a2 = this.c();
      P(a2, this.v());
      E(a2, Ed);
      E(this.s, Fd);
      E(this.u, Gd);
      E(this.o, Hd);
    };
    e.mc = function(a2) {
      this.j = true;
      this.f = this.c().offsetLeft;
      this.a = this.b + (this.h - this.b) * (a2.clientX - this.f) / this.l.width;
      A(this, Id);
      Dd(this);
    };
    e.nc = function(a2) {
      this.j && (this.a = this.b + (this.h - this.b) * (a2.clientX - this.f) / this.l.width, A(this, Id), Dd(this));
    };
    e.Cb = function() {
      this.j && (this.j = false);
    };
    e.A = function() {
      Cd.g.A.call(this);
      var a2 = H(this);
      G(a2, this.c(), "mousedown", this.mc);
      var b = Zb(this.c());
      G(a2, b, "mousemove", this.nc);
      G(a2, b, "mouseup", this.Cb);
    };
    var Ed = { position: "relative", height: "24px", "user-select": "none" }, Fd = { position: "absolute", left: 0, top: "8px", bottom: "8px", "background-color": "rgba(255, 255, 255, 0.6)", "border-top-left-radius": "2px", "border-bottom-left-radius": "2px", cursor: "pointer" }, Gd = { position: "absolute", right: 0, top: "8px", bottom: "8px", "background-color": "rgba(255, 255, 255, 0.2)", "border-top-right-radius": "2px", "border-bottom-right-radius": "2px", cursor: "pointer" }, Hd = {
      position: "absolute",
      width: "16px",
      height: "16px",
      top: "4px",
      "margin-left": "-8px",
      "border-radius": "50%",
      "background-color": "#FFFFFF",
      cursor: "pointer"
    }, Id = "timechange";
    function Jd(a2) {
      M.call(this, a2);
      this.b = new Cd();
      this.u = true;
      this.s = new Ib(250);
      this.f = Kd;
      this.o = 0;
      this.h = new Ib();
      Jb(this.h, Ld);
    }
    p(Jd, M);
    var Ld = 1200, Kd = 0;
    e = Jd.prototype;
    e.play = function() {
      2 == this.f && (this.a.play(), this.s.start());
    };
    e.pause = function() {
      this.a.pause();
      this.s.stop();
    };
    e.reset = function() {
      this.pause();
      this.l.removeAttribute("src");
      this.f = Kd;
    };
    function Md(a2, b) {
      b !== a2.u && (a2.u = 1 == b, b && Nd(a2), F(a2.b.c(), b ? 1 : 0));
    }
    e.La = function() {
      this.o = 0;
      this.h.W || (Md(this, true), this.h.start());
    };
    e.pa = function() {
      this.f === Kd && (this.f = 1, this.l.setAttribute("src", this.C), this.a.load());
    };
    function Nd(a2) {
      if (a2.u) {
        var b = a2.b;
        b.j || (b.a = a2.a.currentTime, O(b) && Dd(b));
        Dd(a2.b);
      }
    }
    e.ya = function() {
      var a2 = this.a.currentTime, b = this.b, c = this.a.duration;
      b.b = 0;
      b.h = c;
      this.b.a = a2;
      this.b.update();
    };
    e.update = function() {
      Jd.g.update.call(this);
      this.pa();
      2 === this.f && this.ya();
    };
    e.v = function() {
      return "jx-video-player";
    };
    e.D = function() {
      throw Error("Method not supported");
    };
    e.w = function() {
      Jd.g.w.call(this);
      var a2 = this.c(), b = this.i;
      this.a = D(b, "VIDEO");
      this.l = D(b, "SOURCE");
      this.a.appendChild(this.l);
      a2.appendChild(this.a);
      N(this.b);
      I(this.b, a2);
      a2 = this.c();
      P(a2, this.v());
      E(a2, Od);
      E(a2, Pd);
      E(this.a, Qd);
      E(this.l, Rd);
      E(this.b.c(), Sd);
      Md(this, false);
    };
    e.vc = function() {
      this.La();
    };
    e.uc = function() {
      this.o++;
      3 < this.o && (Md(this, false), this.h.W && this.h.stop());
    };
    e.Oa = function() {
      this.f = 2;
      this.update();
    };
    e.sb = function() {
      2 != this.f && this.Oa();
    };
    e.Pa = function() {
    };
    e.tb = function() {
      this.Pa();
    };
    e.zc = function() {
      this.a.currentTime = this.b.a;
    };
    e.wc = function() {
      Nd(this);
    };
    e.A = function() {
      Jd.g.A.call(this);
      var a2 = H(this);
      G(a2, this.c(), "mousemove", this.vc);
      G(a2, this.h, "tick", this.uc);
      G(a2, this.a, "canplay", this.sb);
      G(a2, this.a, "ended", this.tb);
      G(a2, this.b, Id, this.zc);
      G(a2, this.s, "tick", this.wc);
    };
    var Od = { overflow: "hidden", position: "relative" }, Pd = { width: "100%", height: "100%" }, Qd = { width: "100%", height: "100%", "z-index": 1 }, Rd = {}, Sd = { position: "absolute", bottom: 0, "margin-bottom": "22px", height: "24px", width: "40%", "margin-left": "30%", "margin-right": "30%", transition: "opacity 0.125s linear" };
    function Td(a2) {
      Jd.call(this, a2);
      this.j = false;
    }
    p(Td, Jd);
    e = Td.prototype;
    e.Oa = function() {
      Td.g.Oa.call(this);
      A(this, Ud);
      A(this, Vd);
    };
    e.active = function() {
      this.j = true;
      this.ya();
      this.pa();
    };
    e.Na = function() {
      this.j = false;
      Md(this, false);
      this.h.W && this.h.stop();
      this.reset();
    };
    e.play = function() {
      Td.g.play.call(this);
    };
    e.stop = function() {
      this.pause();
    };
    e.ja = function() {
      return this.C;
    };
    e.Pa = function() {
      Td.g.Pa.call(this);
      A(this, Wd);
    };
    e.La = function() {
      this.j && Td.g.La.call(this);
    };
    e.ya = function() {
      this.j && Td.g.ya.call(this);
    };
    e.pa = function() {
      this.j && Td.g.pa.call(this);
    };
    function S(a2, b) {
      "boolean" == typeof a2 ? b = true === a2 : l(a2) ? (a2 = a2.toLowerCase(), b = "true" === a2 ? true : "false" === a2 ? false : true === b) : b = true === b;
      return b;
    }
    function Xd(a2) {
      return l(a2) ? a2 : null;
    }
    function Yd(a2) {
      return ea(a2) ? a2 : [];
    }
    var Zd = !w && !(r("Safari") && !((r("Chrome") || r("CriOS")) && !r("Edge") || r("Coast") || r("Opera") || r("Edge") || r("Silk") || r("Android")));
    function $d(a2) {
      if (a2 instanceof Element) if (Zd && a2.dataset) var b = a2.dataset;
      else {
        b = {};
        a2 = a2.attributes;
        for (var c = 0; c < a2.length; ++c) {
          var d = a2[c];
          if (0 == d.name.lastIndexOf("data-", 0)) {
            var f = xa(d.name.substr(5));
            b[f] = d.value;
          }
        }
      }
      else b = {};
      return sa(b);
    }
    function ae(a2) {
      M.call(this, a2);
      this.b = null;
    }
    p(ae, M);
    e = ae.prototype;
    e.active = function() {
      F(this.a, 1);
    };
    e.Na = function() {
      F(this.a, 0);
    };
    e.play = function() {
    };
    e.stop = function() {
    };
    e.update = function() {
      ae.g.update.call(this);
      var a2 = hc(this.F.ia()), b = a2.width < be;
      a2 = a2.height < ce;
      E(this.c(), b ? de : ee);
      E(this.a, b ? fe : ge);
      E(this.c(), "bottom", (a2 ? 72 : 96) + "px");
      $b(this.a, null !== this.b ? this.b : "");
    };
    e.v = function() {
      return "jx-image-description";
    };
    e.D = function() {
      throw Error("Method not supported");
    };
    e.w = function() {
      ae.g.w.call(this);
      var a2 = this.c();
      this.a = D(this.i, "DIV");
      a2.appendChild(this.a);
      a2 = this.c();
      P(a2, this.v());
      E(a2, he);
      E(this.a, ie);
    };
    var be = 320, ce = 540, he = { position: "absolute", margin: 0, "z-index": 101 }, ie = { "font-family": '"YouTube Noto", Roboto, Arial, Helvetica, sans-serif', "font-weight": "normal", color: "rgba(220, 220, 220, 1.0)", opacity: 0, transition: "opacity 0.25s 2s" }, ee = { left: "64px", right: "64px", bottom: "128px" }, ge = { "font-size": "14px", "white-space": "pre-wrap", "line-height": "1.6em" }, de = { left: "8px", right: "8px", bottom: "64px" }, fe = { "font-size": "10px", "white-space": "pre-wrap", "line-height": "1.4em" };
    function je(a2) {
      z.call(this);
      this.a = a2 || window;
      this.i = x(this.a, "resize", this.m, false, this);
      this.b = Vb(this.a || window);
    }
    p(je, z);
    je.prototype.N = function() {
      je.g.N.call(this);
      this.i && (Db(this.i), this.i = null);
      this.b = this.a = null;
    };
    je.prototype.m = function() {
      var a2 = Vb(this.a || window), b = this.b;
      a2 == b || a2 && b && a2.width == b.width && a2.height == b.height || (this.b = a2, A(this, "resize"));
    };
    function ke(a2) {
      Ac.call(this, a2);
    }
    p(ke, Ac);
    e = ke.prototype;
    e.active = function() {
      A(this, Vd);
    };
    e.Na = function() {
    };
    e.play = function() {
    };
    e.stop = function() {
    };
    e.ja = function() {
      var a2 = null;
      var b = 0;
      for (b in this.f) {
        b = Number(b);
        var c = this.f[b];
        if (0 <= c.width || 0 < c.height) a2 = c;
      }
      return a2 ? a2.src : null;
    };
    function le(a2) {
      M.call(this, a2);
    }
    p(le, M);
    var Vd = "mediaitem-active", Ud = "mediaitem-wait", Wd = "mediaitem-next";
    function me(a2) {
      J(a2, function(b) {
        b.active();
      });
    }
    function ne(a2) {
      J(a2, function(b) {
        b.Na();
      });
    }
    e = le.prototype;
    e.ja = function() {
      return this.L.ja();
    };
    e.update = function() {
      le.g.update.call(this);
      J(this, function(a2) {
        a2.update();
      });
    };
    e.v = function() {
      return "jx-media-item";
    };
    e.D = function() {
      throw Error("Method not supported");
    };
    e.w = function() {
      le.g.w.call(this);
      P(this.c(), this.v());
      N(this);
    };
    var oe, pe;
    function qe(a2) {
      !oe && a2 && (oe = a2, pe = sa(a2.style), E(a2, re), a2.focus());
    }
    function se() {
      oe && (E(oe, pe), pe = oe = null);
    }
    var re = { position: "fixed", top: 0, right: 0, bottom: 0, left: 0, border: "1px splid red", "background-color": "#000", "z-index": 2147483647 };
    function T(a2) {
      M.call(this, a2);
      this.b = this.f = this.Y = null;
      this.j = new je();
      this.Ma = false;
    }
    p(T, M);
    var te = /publicalbum|goo/;
    e = T.prototype;
    e.Ja = function(a2) {
      this.Y = ue(this, a2);
      O(this) && this.update();
    };
    function ve(a2, b) {
      for (var c = 0; c < b.length; c++) {
        var d = q(b[c], "src");
        if (d && d.match(te)) {
          a2.Ma = true;
          break;
        }
      }
    }
    function we(a2, b) {
      var c = $d(b), d = [];
      b instanceof Element && (t((b || document).getElementsByTagName("OBJECT"), function(f) {
        var g = $d(f), k = f.getAttribute("data");
        k && (f = f.getAttribute("type") || "image/jpeg", g.src = k, g.mimetype = f, Ga(d, g));
      }, a2), t((b || document).getElementsByTagName("IMG"), function(f) {
        f = $d(f);
        Ga(d, f);
      }, a2));
      ve(a2, d);
      c.mediaItems = d;
      return c;
    }
    function ue(a2, b) {
      var c = a2.Da();
      c.B(b);
      var d = [];
      t(Yd(q(b, "mediaItems")), function(f) {
        var g = this.ta();
        f.aspectRatio = c.O;
        f.Ea = c.h;
        f.stretch = c.j;
        f.Ca = c.I;
        g.a = Xd(q(f, "mimetype"));
        g.src = Xd(q(f, "src"));
        g.wa = Xd(q(f, "initialSrc"));
        g.aspectRatio = S(q(f, "aspectRatio"), true);
        g.Ea = S(q(f, "enlarge"), true);
        g.stretch = S(q(f, "stretch"), true);
        g.Ca = S(q(f, "cover"), false);
        var k = parseInt(q(f, "width"), 10);
        g.width = 0 < k ? k : null;
        k = parseInt(q(f, "height"), 10);
        g.height = 0 < k ? k : null;
        f = q(f, "description");
        g.description = ba(f) && null !== f ? String(f).replace(
          "\\n",
          "\n"
        ) : null;
        Ga(d, g);
      }, a2);
      c.aa = d;
      return c;
    }
    function xe(a2, b, c) {
      if (c.delay) {
        var d = 1e3 * c.delay;
        b.j.a != d && Jb(b.j, d);
      }
      c.title && b.ma(c.title, c.Ra, c.Qa, c.link);
      c.link && b.la(c.link);
      b.f = c.m;
      b.C = c.F;
      d = b.b;
      d.C = c.P;
      O(d) && ye(d);
      O(b) && ye(b.b);
      b.da(true === c.l && !!c.link);
      b.ka(true === c.L && 0 < c.aa.length);
      b.xa(a2.Ma);
    }
    function ze(a2, b) {
      var c = b.src ? b.src : "";
      switch (b.a) {
        case "video/mp4":
          var d = new Td();
          d.C = c;
          d.f = Kd;
          O(d) && d.pa();
          a2.L = d;
          a2.T(a2.L, !a2.L.H);
          break;
        default:
          d = new ke();
          null !== b.width && 0 < b.width && null !== b.height && 0 < b.height && (d.u = new C(b.width, b.height), O(d) && (d.j = hc(d.c()), Lc(d)));
          d.J = b.aspectRatio;
          O(d) && Lc(d);
          d.R = b.Ea;
          O(d) && Lc(d);
          d.V = b.stretch;
          O(d) && Lc(d);
          d.K = b.Ca;
          O(d) && Lc(d);
          if (b.wa) {
            var f = new Dc();
            f.src = b.wa;
            f.width = 0;
            f.height = 0;
            Cc(d, f);
          }
          f = new Dc();
          f.src = c;
          Cc(d, f);
          a2.L = d;
          a2.T(a2.L, !a2.L.H);
      }
      l(b.description) && (c = new ae(), c.b = b.description, O(c) && $b(c.a, null !== c.b ? c.b : ""), a2.T(c, true));
    }
    e.pb = function() {
      this.b = this.f.contentWindow.document.body;
      E(this.b, Ae);
      E(this.b.parentElement, Ae);
      this.h.call(this);
    };
    function Be(a2, b) {
      a2.h = b;
      b = document.createElement("IFRAME");
      b.setAttribute("frameborder", "0");
      b.setAttribute("marginwidth", "0");
      b.setAttribute("marginheight", "0");
      b.setAttribute("scrolling", "no");
      b.setAttribute("allowfullscreen", true);
      b.setAttribute("srcdoc", "");
      b.setAttribute("id", "iframe" + sc(a2));
      var c = a2.c();
      c.insertBefore(b, c.childNodes[0] || null);
      a2.f = b;
      E(b, Ce);
      x(b, "load", a2.pb, false, a2);
    }
    function De(a2, b, c) {
      c && od(b, m(function(d) {
        d = d.target;
        if (d.a) b: {
          d = d.a.responseText;
          if (h.JSON) try {
            var f = h.JSON.parse(d);
            break b;
          } catch (g) {
          }
          f = Oc(d);
        }
        else f = void 0;
        c.call(this, f);
      }, a2));
    }
    function Ee(a2, b) {
      De(a2, "https://www.publicalbum.org/v1/json/story?id=" + b + "&origin=" + location.hostname, function(c) {
        var d = this.Y;
        d.title = q(c, "headline");
        var f = q(c, "author");
        f && (d.Ra = q(f, "name") || null, d.lb = q(f, "url") || null, d.Qa = q(q(f, "image"), "url") || null);
        d.link = q(c, "url") || (d.link && d.link.match(/publicalbum|google|goo\.gl/) ? d.link : null);
        d.link && (this.Ma = true, console.log("Public album photoset `" + d.link + "` loaded."));
        t(c.image, function(g) {
          var k = this.ta();
          k.wa = q(g, "url");
          k.src = q(g, "contentUrl");
          k.description = q(g, "text");
          d.aa.push(k);
        }, this);
        this.M(true);
        this.update();
        this.refresh();
      });
    }
    e.D = function(a2) {
      T.g.D.call(this, a2);
      if (!this.Y) {
        var b = we(this, a2);
        this.Y = ue(this, b);
        this.Y.id && (Ee(this, this.Y.id), this.M(false));
      }
      Wb(a2);
      E(a2, "display", "block");
      E(a2, "visibility", "visible");
    };
    e.w = function() {
      throw Error("Method not supported");
    };
    e.Hb = function() {
      this.refresh();
    };
    e.A = function() {
      T.g.A.call(this);
      G(H(this), this.j, "resize", this.Hb);
    };
    var Ce = { width: "100%", "min-width": "100%", "max-width": "100%", height: "100%", "min-height": "100%", "max-height": "100%", margin: 0, padding: 0, border: 0 }, Ae = { margin: 0, padding: 0, widht: "100%", height: "100%", "user-select": "none" };
    function Fe() {
      this.m = false;
      this.delay = 5;
      this.F = true;
      this.P = [0, 0, 0];
      this.description = this.lb = this.Qa = this.Ra = this.title = this.link = this.id = null;
      this.L = this.l = false;
      this.j = this.h = this.O = true;
      this.I = false;
      this.aa = [];
    }
    Fe.prototype.B = function(a2) {
      this.m = S(q(a2, "autoplay"), this.m);
      this.delay = parseInt(q(a2, "delay", this.delay), 10);
      this.F = S(q(a2, "repeat"), this.F);
      var b = q(a2, "backgroundColor", "#000000");
      if ("transparent" != b) if (l(b)) {
        if (!zc.test(b)) throw Error("'" + b + "' is not a valid hex color");
        4 == b.length && (b = b.replace(vc, "#$1$1$2$2$3$3"));
        b = b.toLowerCase();
        b = [parseInt(b.substr(1, 2), 16), parseInt(b.substr(3, 2), 16), parseInt(b.substr(5, 2), 16)];
      } else b = ea(void 0) ? void 0 : null;
      else b = null;
      this.P = b;
      this.id = Xd(q(a2, "id"));
      this.link = Xd(q(a2, "link"));
      this.title = String(q(a2, "title") || "");
      b = q(a2, "description");
      this.description = ba(b) && null !== b ? String(b) : null;
      this.l = S(q(a2, "showLinkButton"), this.l);
      this.L = S(q(a2, "showDownloadButton"), this.L);
      this.O = S(q(a2, "mediaitemsAspectRatio"), this.O);
      this.h = S(q(a2, "mediaitemsEnlarge"), this.h);
      this.j = S(q(a2, "mediaitemsStretch"), this.j);
      this.I = S(q(a2, "mediaitemsCover"), this.I);
    };
    function Ge() {
      this.wa = this.src = this.a = null;
      this.stretch = this.Ea = this.aspectRatio = true;
      this.Ca = false;
    }
    function U(a2, b) {
      this.b = a2;
      this.a = b ? b : new Nb(0, 0, 32, 32);
    }
    function V(a2, b) {
      M.call(this, b);
      this.b = a2 || null;
    }
    p(V, M);
    function He(a2, b) {
      a2.h = b;
      O(a2) && Ie(a2);
    }
    function Ie(a2) {
      if (ea(a2.h)) {
        var b = yc(a2.h);
        E(a2.a, "fill", b);
      }
    }
    V.prototype.update = function() {
      V.g.update.call(this);
      if (this.b) {
        var a2 = this.b;
        if (a2.a) a2 = a2.a, a2 = a2.a + " " + a2.b + " " + a2.width + " " + a2.height;
        else throw Error();
        var b = this.b.b;
        this.a.setAttribute("viewBox", a2);
        this.f.setAttribute("d", b);
      }
      Ie(this);
    };
    V.prototype.v = function() {
      return "jx-svg-image";
    };
    V.prototype.D = function() {
      throw Error("Method not supported");
    };
    V.prototype.w = function() {
      V.g.w.call(this);
      var a2 = this.c();
      this.f = document.createElementNS("http://www.w3.org/2000/svg", "path");
      this.a = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      this.a.appendChild(this.f);
      a2.appendChild(this.a);
      P(this.c(), this.v());
      E(this.a, Je);
    };
    var Je = { width: "100%", height: "100%" };
    function Ke(a2, b) {
      M.call(this, b);
      this.a = new V(a2 || null, this.i);
      this.l = null;
      this.j = false;
      this.f = true;
      this.h = false;
      this.G = 0.6;
      this.C = 0;
    }
    p(Ke, M);
    function Le(a2, b) {
      a2.l = b;
      a2.j = false;
      O(a2) && Me(a2);
    }
    function Ne(a2, b) {
      a2.f = b;
      O(a2) && Oe(a2);
    }
    function Pe(a2) {
      var b = a2.h ? 1 : a2.G, c = a2.c();
      E(c, "transition-delay", (a2.h ? 0 : 1e-3 * a2.C) + "s");
      F(c, b);
    }
    function Oe(a2) {
      E(a2.c(), "display", a2.f ? Qe : "none");
    }
    function Me(a2) {
      if (!a2.j) {
        var b = a2.c();
        a2.l ? b.setAttribute("title", a2.l) : b.removeAttribute("title");
        a2.j = true;
      }
    }
    e = Ke.prototype;
    e.update = function() {
      Ke.g.update.call(this);
      this.a.update();
      Pe(this);
      Oe(this);
      Me(this);
    };
    e.D = function() {
      throw Error("Method not supported");
    };
    e.v = function() {
      return "jx-svg-button";
    };
    e.Ga = function() {
      var a2 = this.c();
      P(a2, this.v());
      E(a2, Re);
      E(this.a.c(), Se);
    };
    e.w = function() {
      Ke.g.w.call(this);
      N(this.a);
      I(this.a, this.c());
      this.Ga();
    };
    e.oc = function(a2) {
      this.f && (a2.stopPropagation(), a2.a(), A(this, "click"));
    };
    e.pc = function(a2) {
      this.f && (a2.stopPropagation(), a2.a(), this.h = true, Pe(this));
    };
    e.qc = function(a2) {
      this.f && (a2.stopPropagation(), a2.a(), this.h = false, Pe(this));
    };
    e.A = function() {
      Ke.g.A.call(this);
      var a2 = H(this);
      G(a2, this.c(), "mousedown", this.oc);
      G(a2, this.c(), "mouseenter", this.pc);
      G(a2, this.c(), "mouseleave", this.qc);
    };
    var Qe = "flex", Re = { display: Qe, "justify-content": "center", "align-items": "center", transition: "opacity 0.125s linear" }, Se = { transition: "opacity 0.250s linear" };
    function W(a2, b) {
      Ke.call(this, a2, b);
      this.o = new C(48, 48);
      this.s = false;
    }
    p(W, Ke);
    function Te(a2, b) {
      a2.s = b;
      O(a2) && Ue(a2);
    }
    function Ue(a2) {
      var b = a2.o;
      E(a2.a.c(), { width: (a2.s ? 0.6 * b.width : b.width) + "px", height: (a2.s ? 0.6 * b.height : b.height) + "px", "border-radius": 0.5 * Math.min(b.width, b.height) + "px" });
    }
    W.prototype.update = function() {
      Ue(this);
      W.g.update.call(this);
    };
    W.prototype.v = function() {
      return "jx-svg-round-button";
    };
    W.prototype.Ga = function() {
      var a2 = this.c();
      P(a2, this.v());
      E(a2, Ve);
      a2 = this.a;
      E(a2.c(), We);
      He(a2, Xe);
      W.g.Ga.call(this);
    };
    var Ve = { overflow: "hidden", "tap-highlight-color": "transparent" }, We = { background: "rgba(66,66,66,0.54)", cursor: "pointer" }, Xe = [255, 255, 255];
    var Ye = { en: "Open in new window." }, Ze = { en: "Download image." }, $e = { en: "Publicalbum.org photo sharing website" };
    function af(a2) {
      R.call(this, a2);
    }
    p(af, R);
    af.prototype.ba = function() {
    };
    af.prototype.za = function() {
      var a2 = this.isVisible() ? 1 : 0;
      F(this.S, a2);
      F(this.V, a2);
      F(this.C, a2);
      F(this.R, a2);
    };
    function bf(a2, b) {
      I(b, a2.S);
      E(b.c(), cf);
    }
    function df(a2, b) {
      I(b, a2.V);
      E(b.c(), ef);
    }
    function ff(a2, b) {
      I(b, a2.R);
      E(b.c(), gf);
    }
    af.prototype.D = function(a2) {
      af.g.D.call(this, a2);
      var b = this.i;
      this.S = D(b, "DIV");
      a2.appendChild(this.S);
      this.V = D(b, "DIV");
      a2.appendChild(this.V);
      this.C = D(b, "DIV");
      a2.appendChild(this.C);
      this.R = D(b, "DIV");
      a2.appendChild(this.R);
      E(this.S, hf);
      E(this.S, jf);
      E(this.V, hf);
      E(this.V, kf);
      E(this.C, hf);
      E(this.C, lf);
      E(this.R, hf);
      E(this.R, mf);
    };
    af.prototype.w = function() {
      throw Error("Method not supported");
    };
    var hf = { position: "absolute", overflow: "auto", transition: "opacity 0.125s linear", opacity: 0, "z-index": 101 }, jf = { top: 0, left: 0, width: "100%", height: "64px", padding: "12px 0 0 8px", background: "linear-gradient(to bottom, rgba(0,0,0,0.33) 0%, rgba(0,0,0,0.02) 88%, rgba(0,0,0,0) 100%)" }, kf = { top: 0, right: 0, margin: "12px 8px 0 0" }, lf = { bottom: 0, left: 0, margin: "0 0 12px 8px" }, mf = { bottom: 0, right: 0, margin: "0 8px 12px 0" }, cf = { "float": "left", "margin-right": "8px" }, ef = { "float": "right", "margin-left": "8px" }, nf = {
      "float": "left",
      "margin-right": "8px"
    }, gf = { "float": "left", "margin-right": "8px" };
    var of = window && (window.navigator.a || window.navigator.language).split("-")[0] || "en";
    function pf(a2) {
      return a2[of] ? a2[of] : a2.en ? a2.en : "%" + a2 + "%";
    }
    function qf(a2) {
      M.call(this, a2);
      this.a = true;
      this.j = this.h = false;
    }
    p(qf, M);
    function rf(a2) {
      F(a2.c(), a2.h ? 1 : 0.6);
    }
    e = qf.prototype;
    e.update = function() {
      qf.g.update.call(this);
      rf(this);
      gc(this.c(), this.a);
      E(this.c(), this.j ? sf : tf);
    };
    e.v = function() {
      return "jx-logo-button";
    };
    e.D = function() {
      throw Error("Method not supported");
    };
    e.w = function() {
      qf.g.w.call(this);
      var a2 = this.c(), b = this.i;
      this.f = D(b, "SPAN");
      $b(this.f, "Album");
      this.b = D(b, "A");
      $b(this.b, "Public");
      this.b.appendChild(this.f);
      this.b.removeAttribute("href");
      this.b.removeAttribute("target");
      this.b.setAttribute("title", pf($e));
      a2.appendChild(this.b);
      a2 = this.c();
      P(a2, this.v());
      E(a2, uf);
      E(this.b, vf);
      E(this.f, wf);
    };
    e.jc = function(a2) {
      this.a && (a2.stopPropagation(), a2.a(), A(this, "click"));
    };
    e.kc = function(a2) {
      this.a && (a2.stopPropagation(), a2.a(), this.h = true, rf(this));
    };
    e.lc = function(a2) {
      this.a && (a2.stopPropagation(), a2.a(), this.h = false, rf(this));
    };
    e.A = function() {
      qf.g.A.call(this);
      var a2 = H(this);
      G(a2, this.c(), "mousedown", this.jc);
      G(a2, this.c(), "mouseenter", this.kc);
      G(a2, this.c(), "mouseleave", this.lc);
    };
    var uf = { "z-index": 101, transition: "opacity 0.125s linear" }, tf = { height: "48px", "line-height": "48px", "padding-right": "16px", "font-size": "11px", "letter-spacing": "0.7px" }, sf = { height: "32px", "line-height": "32px", "padding-right": "8px", "font-size": "8px", "letter-spacing": "0.4px" }, vf = { color: "rgb(160, 160, 160)", "font-family": "arial", "text-transform": "uppercase", "text-decoration": "none", "font-weight": 600, cursor: "pointer", opacity: 0.6 }, wf = { "margin-left": "1px", color: "rgb(230, 230, 230)" };
    function xf(a2) {
      R.call(this, a2);
      a2 = this.i;
      this.G = new yf(a2);
      this.K = new zf(a2);
      this.o = new W(Af, a2);
      this.l = new W(Bf, a2);
      a2 = this.s = new qf(a2);
      a2.a = false;
      O(a2) && gc(a2.c(), a2.a);
    }
    p(xf, af);
    e = xf.prototype;
    e.ba = function(a2) {
      xf.g.ba.call(this, a2);
      Te(this.G, a2);
      Te(this.K, a2);
      Te(this.o, a2);
      Te(this.l, a2);
      var b = this.s;
      b.j = a2;
      O(b) && E(b.c(), b.j ? sf : tf);
      O(this) && (this.G.update(), this.K.update(), this.o.update(), this.l.update(), this.s.update());
    };
    e.da = function(a2) {
      Ne(this.o, a2);
    };
    e.ka = function(a2) {
      Ne(this.l, a2);
    };
    e.xa = function(a2) {
      var b = this.s;
      b.a = a2;
      O(b) && gc(b.c(), b.a);
    };
    e.update = function() {
      xf.g.update.call(this);
      this.G.update();
      this.K.update();
      this.o.update();
      this.l.update();
      this.s.update();
    };
    e.v = function() {
      return "jx-carousel-controls";
    };
    e.D = function(a2) {
      xf.g.D.call(this, a2);
      N(this.G);
      I(this.G, a2);
      N(this.K);
      I(this.K, a2);
      N(this.o);
      Le(this.o, pf(Ye));
      df(this, this.o);
      N(this.l);
      Le(this.l, pf(Ze));
      df(this, this.l);
      N(this.s);
      ff(this, this.s);
    };
    e.Kb = function() {
      A(this, Cf);
    };
    e.Mb = function() {
      A(this, Df);
    };
    e.Lb = function() {
      A(this, Ef);
    };
    e.Jb = function() {
      A(this, Ff);
    };
    e.yb = function() {
      A(this, Gf);
    };
    e.A = function() {
      xf.g.A.call(this);
      var a2 = H(this);
      G(a2, this.G, "click", this.Kb);
      G(a2, this.K, "click", this.Mb);
      G(a2, this.o, "click", this.Lb);
      G(a2, this.l, "click", this.Jb);
      G(a2, this.s, "click", this.yb);
    };
    var Cf = "leftarrowclick", Df = "rightarrowclick", Ef = "linkbuttonclick", Ff = "downloadbuttonclick", Gf = "logobuttonclick";
    var Hf = new Nb(-3, -3, 24, 24), X = new Nb(-8, -8, 40, 40), If = new U("M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z", X), Jf = new U("M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z", X), Kf = new U("M4.5 11H3v4h4v-1.5H4.5V11zM3 7h1.5V4.5H7V3H3v4zm10.5 6.5H11V15h4v-4h-1.5v2.5zM11 3v1.5h2.5V7H15V3h-4z", Hf), Lf = new U("M3 12.5h2.5V15H7v-4H3v1.5zm2.5-7H3V7h4V3H5.5v2.5zM11 15h1.5v-2.5H15V11h-4v4zm1.5-9.5V3H11v4h4V5.5h-2.5z", Hf), Bf = new U("M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z", X), Af = new U(
      "M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z",
      X
    ), Mf = new U("M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z", new Nb(-7, -8, 40, 40)), Nf = new U("M8 5v14l11-7z", X), Of = new U("M6 19h4V5H6v14zm8-14v14h4V5h-4z", X), Pf = new U(
      "M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z",
      X
    ), Qf = new U("M19 5H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 12H5V7h14v10z", X), Rf = new U("M19 7H5c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 8H5V9h14v6z", X), Sf = new U("M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z", X), Tf = new U("M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z", X);
    function Uf(a2, b, c) {
      M.call(this, c);
      c = this.i;
      this.b = new V(a2 || null, c);
      this.a = new V(b || null, c);
      this.u = false;
      this.j = true;
      this.l = this.o = false;
      this.f = true;
    }
    p(Uf, M);
    function Vf(a2, b) {
      a2.j = b;
      O(a2) && Wf(a2);
    }
    function Y(a2, b) {
      a2.l = b;
      O(a2) && Xf(a2);
    }
    function Yf(a2) {
      var b = a2.o ? 1 : 0.6, c = a2.c();
      E(c, "transition-delay", (a2.o ? 0 : 0) + "s");
      F(c, b);
    }
    function Wf(a2) {
      E(a2.c(), "display", a2.j ? Zf : "none");
    }
    function Xf(a2) {
      F(a2.b.c(), a2.l ? 1 : 0);
      F(a2.a.c(), a2.l ? 0 : 1);
    }
    e = Uf.prototype;
    e.update = function() {
      Uf.g.update.call(this);
      this.b.update();
      this.a.update();
      Yf(this);
      Wf(this);
      this.u || (this.c().removeAttribute("title"), this.u = true);
      Xf(this);
    };
    e.D = function() {
      throw Error("Method not supported");
    };
    e.v = function() {
      return "jx-svg-switch";
    };
    e.Ha = function() {
      var a2 = this.c();
      P(a2, this.v());
      E(a2, $f);
      E(this.h, ag);
      E(this.b.c(), bg);
      E(this.a.c(), bg);
    };
    e.w = function() {
      Uf.g.w.call(this);
      this.h = document.createElement("DIV");
      this.c().appendChild(this.h);
      N(this.b);
      I(this.b, this.h);
      N(this.a);
      I(this.a, this.h);
      this.Ha();
    };
    e.rc = function(a2) {
      this.j && (a2.stopPropagation(), O(this) && this.f && Y(this, !this.l), A(this, "click"));
    };
    e.sc = function(a2) {
      this.j && (a2.stopPropagation(), this.o = true, Yf(this));
    };
    e.tc = function(a2) {
      this.j && (a2.stopPropagation(), this.o = false, Yf(this));
    };
    e.A = function() {
      Uf.g.A.call(this);
      var a2 = H(this);
      G(a2, this.c(), "mousedown", this.rc);
      G(a2, this.c(), "mouseenter", this.sc);
      G(a2, this.c(), "mouseleave", this.tc);
    };
    var Zf = "flex", $f = { display: Zf, "justify-content": "center", "align-items": "center", transition: "opacity 0.125s linear" }, ag = { position: "relative", width: "320px", height: "320px" }, bg = { position: "absolute", transition: "opacity 0.250s linear", opacity: 0 };
    function cg(a2, b, c) {
      Uf.call(this, a2, b, c);
      this.s = false;
    }
    p(cg, Uf);
    function dg(a2, b) {
      a2.s = b;
      O(a2) && eg(a2);
    }
    function eg(a2) {
      var b = a2.s ? 32 : 48;
      b = { width: b + "px", height: b + "px", "border-radius": 0.5 * b + "px" };
      E(a2.b.c(), b);
      E(a2.a.c(), b);
      E(a2.h, b);
    }
    cg.prototype.update = function() {
      eg(this);
      cg.g.update.call(this);
    };
    cg.prototype.v = function() {
      return "jx-svg-round-switch";
    };
    cg.prototype.Ha = function() {
      var a2 = this.c();
      P(a2, this.v());
      E(a2, fg);
      a2 = this.b;
      var b = this.a;
      E(a2.c(), gg);
      E(b.c(), gg);
      He(a2, hg);
      He(b, hg);
      cg.g.Ha.call(this);
    };
    var fg = { overflow: "hidden", "tap-highlight-color": "transparent" }, gg = { background: "rgba(66,66,66,0.54)", cursor: "pointer" }, hg = [255, 255, 255];
    var ig = { en: "Share it." };
    function jg(a2) {
      xf.call(this, a2);
      a2 = this.i;
      this.j = new W(Tf, a2);
      this.u = new W(Mf, a2);
      this.h = new cg(Of, Nf, a2);
      this.f = new cg(Pf, Pf, a2);
      this.a = new cg(Rf, Qf, a2);
      this.b = new cg(Lf, Kf, a2);
    }
    p(jg, xf);
    e = jg.prototype;
    e.ba = function(a2) {
      jg.g.ba.call(this, a2);
      Te(this.j, a2);
      Te(this.u, a2);
      dg(this.h, a2);
      dg(this.f, a2);
      dg(this.a, a2);
      dg(this.b, a2);
      O(this) && (this.j.update(), this.u.update(), this.h.update(), this.f.update(), this.a.update(), this.b.update());
    };
    e.update = function() {
      jg.g.update.call(this);
      var a2 = this.b.l;
      Ne(this.j, !!oe && !a2);
      Vf(this.a, !a2);
      this.j.update();
      this.u.update();
      this.h.update();
      this.f.update();
      this.a.update();
      this.b.update();
    };
    e.v = function() {
      return "jx-gallery-controls";
    };
    e.D = function(a2) {
      jg.g.D.call(this, a2);
      N(this.j);
      bf(this, this.j);
      N(this.u);
      Le(this.u, pf(ig));
      df(this, this.u);
      N(this.h);
      this.h.f = false;
      a2 = this.h;
      I(a2, this.C);
      E(a2.c(), nf);
      N(this.f);
      this.f.f = false;
      a2 = this.f;
      I(a2, this.C);
      E(a2.c(), nf);
      N(this.a);
      this.a.f = false;
      ff(this, this.a);
      N(this.b);
      this.b.f = false;
      ff(this, this.b);
      E(this.j.a.c(), kg);
      He(this.f.a, [0, 0, 0]);
      Ne(this.u, false);
    };
    e.Rb = function() {
      A(this, lg);
    };
    e.Vb = function() {
      A(this, mg);
    };
    e.Ub = function() {
      A(this, ng);
    };
    e.Dc = function() {
      A(this, og);
    };
    e.Sb = function() {
      A(this, pg);
    };
    e.Tb = function() {
      A(this, qg);
    };
    e.A = function() {
      jg.g.A.call(this);
      var a2 = H(this);
      G(a2, this.j, "click", this.Rb);
      G(a2, this.u, "click", this.Vb);
      G(a2, this.h, "click", this.Ub);
      G(a2, this.f, "click", this.Dc);
      G(a2, this.a, "click", this.Sb);
      G(a2, this.b, "click", this.Tb);
    };
    var kg = { "background-color": "rgba(0, 0, 0, 0)" }, rg = Cf, sg = Df, tg = Ef, ug = Ff, lg = "backbuttonclick", mg = "sharebuttonclick", ng = "playswitchclick", og = "repeatswitchclick", pg = "fullpageswithcclick", qg = "fullscreenswithcclick";
    function vg(a2) {
      a2.webkitRequestFullscreen ? a2.webkitRequestFullscreen() : a2.mozRequestFullScreen ? a2.mozRequestFullScreen() : a2.msRequestFullscreen ? a2.msRequestFullscreen() : a2.requestFullscreen && a2.requestFullscreen();
    }
    function wg(a2) {
      a2 = a2 ? a2.a : Qb().a;
      return !!(a2.webkitIsFullScreen || a2.mozFullScreen || a2.msFullscreenElement || a2.fullscreenElement);
    }
    function xg(a2) {
      W.call(this, this.u(), a2);
    }
    p(xg, W);
    xg.prototype.v = function() {
      return "jx-carousel-arrow";
    };
    xg.prototype.b = function() {
      E(this.c(), yg);
      this.G = 0;
      this.C = 250;
    };
    xg.prototype.D = function() {
      throw Error("Method not supported");
    };
    xg.prototype.w = function() {
      xg.g.w.call(this);
      this.b();
    };
    var yg = { position: "absolute", "z-index": 101, top: "64px", bottom: "64px", width: "64px", "box-sizing": "content-box" };
    function zf(a2) {
      xg.call(this, a2);
    }
    p(zf, xg);
    zf.prototype.u = function() {
      return Jf;
    };
    zf.prototype.b = function() {
      zf.g.b.call(this);
      E(this.c(), zg);
    };
    var zg = { right: 0 };
    function Ag(a2) {
      z.call(this);
      this.a = a2;
      this.m = false;
      this.i = new Lb();
      this.b = null;
      x(this.a, "touchstart", this.f, false, this);
    }
    p(Ag, z);
    Ag.prototype.c = function() {
      return this.a;
    };
    function Bg(a2) {
      a2 = a2.m;
      return fa(a2) ? "touchend" == a2.type || "touchcancel" == a2.type ? a2.changedTouches : a2.targetTouches : [a2];
    }
    Ag.prototype.f = function(a2) {
      this.m = false;
      a2 = Bg(a2);
      if (B(this, "gmultitouchstart")) {
        var b = new Cg("gmultitouchstart", this, a2);
        A(this, b);
      }
      a2 && 1 == a2.length && (B(this, "gtouchhmove") || B(this, "gtouchvmove") ? (this.i.a = a2[0].clientX, this.i.b = a2[0].clientY, this.b = null) : B(this, "gtouchstart") && (b = new Cg("gtouchstart", this, a2), A(this, b)), x(this.a, "touchmove", this.F, false, this), x(this.a, "touchend", this.B, false, this));
    };
    Ag.prototype.F = function(a2) {
      this.m = true;
      var b = Bg(a2), c = B(this, "gtouchhmove"), d = B(this, "gtouchvmove");
      if (c || d) {
        if (!this.b && (this.b = Math.abs(this.i.a - b[0].clientX) > Math.abs(this.i.b - b[0].clientY) ? 1 : 2, B(this, "gtouchstart"))) {
          var f = new Cg("gtouchstart", this, b);
          A(this, f);
        }
        c && 1 == this.b && (f = new Cg("gtouchhmove", this, b), A(this, f), a2.stopPropagation(), a2.a());
        d && 2 == this.b && (f = new Cg("gtouchvmove", this, b), A(this, f), a2.stopPropagation(), a2.a());
      }
      B(this, "gtouchmove") && (f = new Cg("gtouchmove", this, b), A(this, f), a2.a());
      B(
        this,
        "gmultitouchmove"
      ) && (f = new Cg("gmultitouchmove", this, b), A(this, f), a2.a());
    };
    Ag.prototype.B = function(a2) {
      a2 = Bg(a2);
      if (1 == a2.length && (Cb(this.a, "touchmove", this.F, false, this), Cb(this.a, "touchend", this.B, false, this), B(this, "gtouchend"))) {
        var b = new Cg("gtouchend", this, a2);
        A(this, b);
      }
      B(this, "gmultitouchend") && (b = new Cg("gmultitouchend", this, a2), A(this, b));
      B(this, "tap") && (this.m || A(this, "tap"));
      this.m = false;
    };
    function Cg(a2, b, c) {
      v.call(this, a2, b);
      this.touches = c;
    }
    p(Cg, v);
    function Dg(a2) {
      z.call(this);
      this.i = a2;
      this.a = false;
      this.f = 0;
      this.b = new Ag(this.i.c());
      y(this.b, "gtouchstart", this.F, false, this);
      y(this.b, "gtouchmove", this.B, false, this);
      y(this.b, "gtouchend", this.m, false, this);
    }
    p(Dg, z);
    Dg.prototype.reset = function() {
      this.a = false;
      this.f = 0;
    };
    Dg.prototype.F = function(a2) {
      a2.stopPropagation();
      a2.a();
      this.a || (a2 = a2.touches[0].clientX, this.a = true, this.f = a2, A(this, new Eg("cgtart", a2)));
    };
    Dg.prototype.B = function(a2) {
      this.a && (a2.stopPropagation(), a2.a(), A(this, new Eg("cgmove", a2.touches[0].clientX - this.f)));
    };
    Dg.prototype.m = function(a2) {
      a2.stopPropagation();
      a2.a();
      this.a && (A(this, new Eg("cgfinish", a2.touches[0].clientX - this.f)), this.a = false);
    };
    function Eg(a2, b) {
      v.call(this, a2);
      this.offset = b;
    }
    p(Eg, v);
    function Fg(a2) {
      M.call(this, a2);
      this.C = this.u = null;
      this.f = new C(960, 540);
      this.b = this.a = 0;
      this.j = true;
      this.G = Gg;
      this.J = Hg;
      this.s = null;
    }
    p(Fg, M);
    var Gg = 250, Hg = 0.05;
    e = Fg.prototype;
    e.ia = function() {
      return this.u;
    };
    function Ig(a2, b) {
      a2.b = b;
      O(a2) && Jg(a2);
    }
    function Kg(a2) {
      return L(a2, a2.b);
    }
    function Lg(a2) {
      0 < a2.a ? Ig(a2, a2.a - 1) : Ig(a2, K(a2) - 1);
    }
    e.play = function() {
      Kg(this).L.play();
    };
    e.stop = function() {
      Kg(this).L.stop();
    };
    function ye(a2) {
      if (a2.C) var b = yc(a2.C);
      else {
        if (isNaN(0)) throw Error('"(0,0,0,0") is not a valid RGBA color');
        b = xc(0 .toString(16));
        b = wc(0, 0, 0) + b;
      }
      E(a2.c(), "background-color", b);
    }
    function Mg(a2) {
      fc(a2.c(), a2.f);
      var b = L(a2, a2.a);
      null !== b && (fc(b.c(), a2.f), b.update());
    }
    function Ng(a2) {
      var b = K(a2) - 1;
      return a2.a == b && 0 == a2.b ? -1 : 0 == a2.a && a2.b == b ? 1 : a2.b > a2.a ? -1 : 1;
    }
    function Og(a2, b) {
      E(a2, "transition", false !== b ? b : "none");
    }
    function Pg(a2) {
      E(L(a2, a2.b).c(), "z-index", 2);
      E(L(a2, a2.a).c(), "z-index", 1);
    }
    function Qg(a2) {
      Og(L(a2, a2.b).c(), false);
      Og(L(a2, a2.a).c(), false);
    }
    function Rg(a2, b, c, d) {
      fc(b, a2.f);
      dc(b, new Lb(c, 0));
      F(b, d);
    }
    function Sg(a2, b, c, d, f) {
      b = L(a2, b);
      Rg(a2, b.c(), c, d);
      true === f && b.update();
      return b;
    }
    e.Cc = function() {
      var a2 = this.f.width * Ng(this) * this.J;
      Sg(this, this.a, 0, 1, false);
      Sg(this, this.b, a2, 0, true);
      window.requestAnimationFrame(m(this.gb, this));
    };
    e.gb = function() {
      if (this.j) {
        var a2 = 1e-3 * this.G + "s";
        Og(L(this, this.b).c(), "left " + a2 + " ease-out, opacity " + a2 + " ease-out");
        Og(L(this, this.a).c(), "left " + a2 + " ease-in, opacity " + a2 + " ease-in");
      }
      ne(Sg(this, this.a, -this.f.width * Ng(this) * this.J, 0, false));
      me(Sg(this, this.b, 0, 1, !this.j));
      this.a = this.b;
      A(this, "index");
    };
    e.jb = function() {
      clearTimeout(this.s);
      this.s = null;
    };
    function Jg(a2) {
      if (0 != K(a2)) {
        if (a2.b != a2.a && null != a2.a) a2.j = true, null !== a2.s && (a2.jb(), a2.j = false), Pg(a2), Qg(a2), a2.j ? window.requestAnimationFrame(m(a2.Cc, a2)) : a2.gb(), a2.s = setTimeout(m(a2.jb, a2), 1.2 * a2.G);
        else if (0 == a2.a && 0 == a2.b) {
          var b = L(a2, 0);
          if (b) {
            var c = b.c();
            Rg(a2, c, 0, 1);
            E(c, "z-index", 2);
            Og(c, false);
            a2.a = 0;
            me(b);
          }
        }
      }
    }
    e.update = function() {
      Fg.g.update.call(this);
      ye(this);
      Mg(this);
      Jg(this);
    };
    e.T = function(a2) {
      Fg.g.T.call(this, a2, !a2.H);
      a2 = a2.c();
      P(a2, this.v() + "-child");
      E(a2, Tg);
    };
    e.v = function() {
      return "jx-swipe-base";
    };
    e.D = function() {
      throw Error("Method not supported");
    };
    e.w = function() {
      Fg.g.w.call(this);
      var a2 = this.c();
      this.u = D(this.i, "DIV");
      a2.appendChild(this.u);
      a2 = this.c();
      P(a2, this.v());
      E(a2, Ug);
      a2 = this.ia();
      P(a2, this.v() + "-content");
      E(a2, Vg);
    };
    var Ug = { position: "relative", overflow: "hidden" }, Vg = { position: "relative" }, Tg = { position: "absolute", opacity: 0 };
    function Wg(a2) {
      Fg.call(this, a2);
      this.h = null;
      this.S = Xg;
      this.K = Yg;
      this.R = Zg;
      this.l = null;
    }
    p(Wg, Fg);
    var Yg = 250, Zg = 0.2, Xg = 16;
    function $g(a2, b) {
      var c = a2.f.width + a2.S;
      b *= c;
      c = b + c * a2.h;
      Rg(a2, L(a2, a2.a).c(), b, 1);
      Rg(a2, L(a2, a2.b).c(), c, 1);
    }
    e = Wg.prototype;
    e.Hc = function() {
      this.l && this.o.reset();
      A(this, "swipestart");
    };
    e.Gc = function(a2) {
      a2 = a2.offset / this.f.width;
      if (!this.l) {
        var b = 0 <= a2 ? -1 : 1;
        if (this.h != b) {
          this.h = b;
          b = this.a;
          var c = this.a;
          var d = K(this);
          this.b = c = 1 == this.h ? c >= d - 1 ? 0 : c + 1 : (0 == c ? d : c) - 1;
          Qg(this);
          Pg(this);
          ne(Sg(this, b, 0, 2));
          me(Sg(this, c, 0, 1, true));
        }
        $g(this, a2);
      }
    };
    e.xc = function() {
      clearTimeout(this.l);
      this.l = null;
      A(this, "swipefinish");
    };
    e.Fc = function(a2) {
      if (this.h) {
        var b = (a2 = Math.abs(a2.offset / this.f.width) > this.R) ? -this.h : 0, c = 1e-3 * this.K + "s";
        Og(L(this, this.b).c(), "left " + c + " ease-out");
        Og(L(this, this.a).c(), "left " + c + " ease-out");
        $g(this, b);
        this.l = setTimeout(m(this.xc, this), 1.2 * this.K);
        this.h = null;
        a2 && (this.a = this.b, A(this, "index"));
      }
    };
    e.A = function() {
      Wg.g.A.call(this);
      this.o = new Dg(this);
      y(this.o, "cgtart", this.Hc, false, this);
      y(this.o, "cgmove", this.Gc, false, this);
      y(this.o, "cgfinish", this.Fc, false, this);
    };
    function ah(a2) {
      M.call(this, a2);
      this.C = this.f = this.j = this.o = null;
      this.l = false;
    }
    p(ah, M);
    e = ah.prototype;
    e.ma = function(a2) {
      this.o = a2;
      O(this) && bh(this);
    };
    e.la = function(a2) {
      this.C = a2;
      O(this) && ch(this);
    };
    function bh(a2) {
      gc(a2.c(), !!a2.o);
      $b(a2.G, null !== a2.o ? a2.o : "");
    }
    function dh(a2) {
      gc(a2.u, !!a2.j);
      $b(a2.u, null !== a2.j ? a2.j : "");
    }
    function ch(a2) {
      gc(a2.h, !!a2.f);
      E(a2.b, a2.f ? eh : {});
      null !== a2.f && (a2.h.src = a2.f);
    }
    e.update = function() {
      ah.g.update.call(this);
      bh(this);
      dh(this);
      ch(this);
      this.H && (this.a.removeAttribute("href"), this.a.removeAttribute("target"), E(this.a, gh));
      E(this.a, this.l ? hh : ih);
      E(this.h, this.l ? jh : kh);
    };
    e.v = function() {
      return "jx-carousel-title";
    };
    e.D = function() {
      throw Error("Method not supported");
    };
    e.w = function() {
      ah.g.w.call(this);
      var a2 = this.c(), b = this.i;
      this.a = D(b, "A");
      this.b = D(b, "DIV");
      this.s = D(b, "DIV");
      this.h = D(b, "IMG");
      this.b.appendChild(this.h);
      this.G = D(b, "DIV");
      this.u = D(b, "DIV");
      this.s.appendChild(this.G);
      this.s.appendChild(this.u);
      this.a.appendChild(this.b);
      this.a.appendChild(this.s);
      a2.appendChild(this.a);
      a2 = this.c();
      P(a2, this.v());
      E(a2, lh);
      E(this.a, mh);
      E(this.b, nh);
      E(this.h, oh);
      E(this.s, ph);
      E(this.G, qh);
      E(this.u, rh);
      E(a2, lh);
      E(a2, lh);
    };
    var lh = { height: "48px" }, mh = { "font-family": '"YouTube Noto", Roboto, Arial, Helvetica, sans-serif', "font-weight": "normal", color: "#FFF", display: "flex", "flex-direction": "row", "align-items": "center", height: "100%", "text-decoration": "none" }, gh = { cursor: "arrow" }, ih = { "font-size": "18px" }, hh = { "font-size": "14px" }, nh = { "align-items": "center", "margin-left": "12px", height: "100%" }, eh = { display: "flex" }, oh = { width: "40px", height: "40px", "border-radius": "50%" }, kh = { width: "40px", height: "40px" }, jh = {
      width: "32px",
      height: "32px"
    }, ph = { "margin-left": "12px" }, qh = { "white-space": "nowrap", "text-overflow": "ellipsis", "max-width": "70vw", overflow: "hidden", padding: 0 }, rh = { "font-size": "72%", padding: "2px 0 0 0", opacity: 0.8 };
    function sh(a2, b) {
      M.call(this, b);
      this.b = a2;
      this.a = this.Ia = false;
    }
    p(sh, M);
    function th(a2) {
      E(a2.c(), a2.a ? uh : a2.Ia ? vh : wh);
    }
    e = sh.prototype;
    e.update = function() {
      sh.g.update.call(this);
      th(this);
    };
    e.D = function() {
      E(this.c(), xh);
    };
    e.w = function() {
      sh.g.w.call(this);
      E(this.c(), xh);
    };
    e.bb = function(a2) {
      a2.stopPropagation();
      A(this, new yh("select", this.b));
    };
    e.cb = function(a2) {
      a2.stopPropagation();
      this.a = true;
      th(this);
    };
    e.eb = function(a2) {
      a2.stopPropagation();
      this.a = false;
      th(this);
    };
    e.A = function() {
      sh.g.A.call(this);
      var a2 = H(this), b = this.c();
      G(a2, b, "click", this.bb);
      G(a2, b, "mouseenter", this.cb);
      G(a2, b, "mouseleave", this.eb);
    };
    e.ha = function() {
      sh.g.ha.call(this);
      var a2 = H(this), b = this.c();
      oc(a2, b, "click", this.bb);
      oc(a2, b, "mouseenter", this.cb);
      oc(a2, b, "mouseleave", this.eb);
    };
    e.N = function() {
      sh.g.N.call(this);
    };
    var xh = { width: "8px", height: "8px", "border-radius": "4px", margin: "4px", transition: "opacity 0.125s linear" }, wh = { opacity: 0.4 }, uh = { opacity: 1 }, vh = { opacity: 0.8 };
    function yh(a2, b) {
      v.call(this, a2);
      this.B = b;
    }
    p(yh, v);
    function zh(a2) {
      M.call(this, a2);
      this.b = Ah;
      this.f = this.a = 0;
    }
    p(zh, M);
    function Bh(a2) {
      a2 = uc(a2);
      t(a2, function(b) {
        Na(b);
      });
      a2 = null;
    }
    function Ch(a2) {
      if (a2.a != K(a2)) {
        Bh(a2);
        for (var b = a2.i, c = 0; c < a2.a; c++) {
          var d = new sh(c, b);
          d.M(false);
          a2.T(d, true);
          E(d.c(), Dh);
        }
      }
    }
    function Eh(a2) {
      if (ea(a2.b)) {
        var b = yc(a2.b);
        J(a2, function(c) {
          E(c.c(), "background-color", b);
        });
      }
    }
    function Fh(a2) {
      J(a2, function(b, c) {
        c = this.f == c;
        b.Ia != c && (b.Ia = c, O(b) && th(b));
      }, a2);
    }
    zh.prototype.update = function() {
      zh.g.update.call(this);
      Ch(this);
      Eh(this);
      Fh(this);
      J(this, function(a2) {
        a2.update();
      });
    };
    zh.prototype.v = function() {
      return "jx-carousel-navigator";
    };
    zh.prototype.D = function() {
      throw Error("Method not supported");
    };
    zh.prototype.w = function() {
      zh.g.w.call(this);
      E(this.c(), Gh);
    };
    var Gh = { width: "100%", "text-align": "center" }, Dh = { display: "inline-block", cursor: "pointer" }, Ah = [255, 255, 255];
    function yf(a2) {
      xg.call(this, a2);
    }
    p(yf, xg);
    yf.prototype.u = function() {
      return If;
    };
    yf.prototype.b = function() {
      yf.g.b.call(this);
      E(this.c(), Hh);
    };
    var Hh = { left: 0 };
    function Ih(a2) {
      M.call(this, a2);
      this.b = new Wg(this.i);
      this.j = new Ib(this.Xa);
      this.u = true;
      this.f = this.Va;
      this.C = this.Wa;
      this.J = this.K = false;
    }
    p(Ih, M);
    e = Ih.prototype;
    e.Xa = 5e3;
    e.Va = true;
    e.Wa = true;
    function Jh(a2) {
      a2.f && !a2.K && 1 < K(a2.b) && a2.j.start();
    }
    e.play = function() {
      this.f = true;
      this.b.play();
    };
    e.stop = function() {
      this.f = false;
      this.b.stop();
    };
    e.next = function() {
      var a2 = this.b;
      a2.a < K(a2) - 1 ? Ig(a2, a2.a + 1) : Ig(a2, 0);
      Kh(this);
    };
    function Lh(a2) {
      var b;
      if (b = !a2.C) b = a2.b, b = b.b == K(b) - 1;
      b ? a2.stop() : a2.u && a2.next();
    }
    function Mh(a2) {
      var b = hc(a2.c());
      a2 = a2.b;
      a2.f = b;
      O(a2) && Mg(a2);
    }
    function Nh(a2) {
      a2 = a2.b.f;
      return 360 >= a2.width || 360 >= a2.height;
    }
    function Kh(a2) {
      a2.K = false;
      Jg(a2.b);
    }
    e.X = function() {
      Mh(this);
      Mg(this.b);
    };
    e.update = function() {
      Ih.g.update.call(this);
      Mh(this);
      this.b.update();
    };
    e.D = function() {
      throw Error("Method not supported");
    };
    e.w = function() {
      Ih.g.w.call(this);
      this.T(this.b, true);
      var a2 = this.c();
      P(a2, this.v());
      E(a2, Oh);
    };
    e.Ib = function() {
      Lh(this);
      this.j.stop();
    };
    e.zb = function() {
      this.u && Jh(this);
      this.f && this.b.play();
    };
    e.Bb = function() {
      this.K = true;
      this.j.stop();
    };
    e.Ab = function() {
      this.K = false;
      Lh(this);
    };
    e.oa = function() {
      this.J = true;
    };
    e.na = function() {
      this.J = false;
    };
    e.A = function() {
      Ih.g.A.call(this);
      H(this);
      y(this.j, "tick", this.Ib, false, this);
      var a2 = this.b;
      y(a2, Vd, this.zb, false, this);
      y(a2, Ud, this.Bb, false, this);
      y(a2, Wd, this.Ab, false, this);
      y(a2, "swipestart", this.oa, false, this);
      y(a2, "swipefinish", this.na, false, this);
    };
    var Oh = { position: "relative", overflow: "hidden", width: "100%", height: "100%" };
    function Z(a2) {
      Ih.call(this, a2);
      a2 = this.i;
      this.h = new ah(a2);
      this.a = new jg(a2);
      this.V = new je();
      this.R = null;
      this.l = this.o = this.G = false;
    }
    p(Z, Ih);
    e = Z.prototype;
    e.Xa = 5e3;
    e.Va = false;
    e.Wa = false;
    e.ma = function(a2, b, c, d) {
      this.h.ma(a2);
      a2 = this.h;
      a2.j = b ? b : null;
      O(a2) && dh(a2);
      b = this.h;
      b.f = c ? c : null;
      O(b) && ch(b);
      this.h.la(d ? d : null);
    };
    e.xa = function(a2) {
      this.a.xa(a2);
    };
    e.la = function(a2) {
      this.R = a2;
    };
    e.da = function(a2) {
      this.a.da(a2);
    };
    e.ka = function(a2) {
      this.a.ka(a2);
    };
    e.play = function() {
      Z.g.play.call(this);
      Y(this.a.h, this.f);
      this.a.update();
    };
    e.stop = function() {
      Z.g.stop.call(this);
      Y(this.a.h, this.f);
      this.a.update();
    };
    function Ph(a2) {
      var b = Nh(a2), c = a2.h;
      c.l = b;
      O(c) && c.update();
      a2.a.ba(b);
    }
    function Qh(a2) {
      var b = a2.c();
      B(a2, Rh) ? A(a2, Rh) : !oe && b && qe(b);
      a2.o = a2.G = true;
      a2.X();
    }
    function Sh(a2) {
      B(a2, Th) ? A(a2, Th) : oe && se();
      a2.o = a2.G = false;
      a2.X();
    }
    e.X = function() {
      Z.g.update.call(this);
      Ph(this);
      this.h.update();
      this.a.update();
    };
    e.update = function() {
      Z.g.update.call(this);
      Ph(this);
      Y(this.a.h, this.f);
      Y(this.a.f, this.C);
      Y(this.a.a, this.G);
      Y(this.a.b, this.l);
      this.h.update();
      this.a.update();
    };
    e.v = function() {
      return "jx-gallery";
    };
    e.w = function() {
      Z.g.w.call(this);
      var a2 = this.b.c();
      N(this.a);
      this.a.$(a2);
      N(this.h);
      bf(this.a, this.h);
      a2 = this.c();
      P(a2, this.v());
      E(a2, Uh);
      E(this.a.c(), Vh);
      wg(this.i);
    };
    e.dc = function() {
      this.stop();
      Lg(this.b);
      Kh(this);
    };
    e.gc = function() {
      this.stop();
      this.next();
    };
    e.ec = function() {
    };
    e.ac = function() {
    };
    e.$b = function() {
      this.o = false;
      this.o !== this.G && (this.o ? Qh(this) : Sh(this));
    };
    e.hc = function() {
    };
    e.fc = function() {
      this.f ? this.stop() : this.play();
    };
    e.Ec = function() {
      this.C = !this.C;
      Y(this.a.f, this.C);
      this.a.update();
    };
    e.bc = function() {
      this.o ? Sh(this) : Qh(this);
      Y(this.a.a, this.G);
      this.a.update();
    };
    e.cc = function() {
      if (this.l) {
        var a2 = (a2 = this.i) ? a2.a : Qb().a;
        a2.webkitCancelFullScreen ? a2.webkitCancelFullScreen() : a2.mozCancelFullScreen ? a2.mozCancelFullScreen() : a2.msExitFullscreen ? a2.msExitFullscreen() : a2.exitFullscreen && a2.exitFullscreen();
      } else (a2 = this.c()) && vg(a2);
      this.l = !this.l;
      Y(this.a.b, this.l);
      this.a.update();
    };
    e.Za = function() {
      this.u = false;
      this.j.stop();
    };
    e.Ya = function() {
      this.J || (this.u = true, Jh(this));
    };
    e.oa = function(a2) {
      Z.g.oa.call(this, a2);
      this.Za(a2);
    };
    e.na = function(a2) {
      Z.g.na.call(this, a2);
      this.Ya(a2);
    };
    e.ic = function() {
      var a2 = wg(this.i);
      this.l !== a2 && (this.l = a2, Y(this.a.b, this.l), this.a.update());
      this.X();
    };
    e.xb = function(a2) {
      switch (a2.B) {
        case 37:
          Lg(this.b);
          Kh(this);
          break;
        case 39:
          this.next();
          break;
        case 122:
          if (!wg(this.i)) {
            var b = this.c();
            b && vg(b);
          }
          a2.a();
          break;
        case 80:
          this.f ? this.stop() : this.play();
          break;
        case 27:
          this.o && (Sh(this), Y(this.a.a, this.G), a2.a());
      }
    };
    e.A = function() {
      Z.g.A.call(this);
      y(this.a, rg, this.dc, false, this);
      y(this.a, sg, this.gc, false, this);
      y(this.a, tg, this.ec, false, this);
      y(this.a, ug, this.ac, false, this);
      y(this.a, lg, this.$b, false, this);
      y(this.a, mg, this.hc, false, this);
      y(this.a, ng, this.fc, false, this);
      y(this.a, og, this.Ec, false, this);
      y(this.a, pg, this.bc, false, this);
      y(this.a, qg, this.cc, false, this);
      y(this.a, "show", this.Za, false, this);
      y(this.a, "hide", this.Ya, false, this);
      x(this.V, "resize", this.ic, false, this);
      x(Sb(this.c()), "keydown", this.xb, false, this);
    };
    var Uh = { position: "relative", overflow: "hidden", width: "100%", height: "100%" }, Vh = { position: "absolute", top: 0, "z-index": 5 }, Rh = "reuestfullpage", Th = "exitfullpage";
    function Wh(a2) {
      T.call(this, a2);
      this.a = new Z(this.i);
    }
    p(Wh, T);
    e = Wh.prototype;
    e.Da = function() {
      return new Xh();
    };
    e.ta = function() {
      return new Yh();
    };
    function Zh(a2) {
      var b = a2.Y;
      a2.a.M(false);
      uc(a2.a.b);
      t(b.aa, function(c) {
        var d = new le();
        d.M(false);
        ze(d, c);
        this.a.b.T(d, !d.H);
      }, a2);
      xe(a2, a2.a, b);
      Vf(a2.a.a.f, b.i);
      Vf(a2.a.a.a, b.a);
      Vf(a2.a.a.b, b.b);
      a2.a.M(true);
      Kb(function() {
        this.a.update();
      }, 0, a2);
    }
    e.refresh = function() {
      this.a.X();
    };
    e.update = function() {
      Zh(this);
    };
    e.v = function() {
      return "jx-gallery-widget";
    };
    e.D = function(a2) {
      Wh.g.D.call(this, a2);
      P(a2, this.v());
      Be(this, function() {
        I(this.a, this.b);
      }.bind(this));
    };
    e.Zb = function() {
      qe(this.f || this.c());
    };
    e.Yb = function() {
      se();
    };
    e.A = function() {
      Wh.g.A.call(this);
      var a2 = H(this);
      G(a2, this.a, Rh, this.Zb);
      G(a2, this.a, Th, this.Yb);
    };
    function Xh() {
      Fe.call(this);
      this.m = false;
      this.b = this.a = this.i = true;
    }
    p(Xh, Fe);
    Xh.prototype.B = function(a2) {
      Xh.g.B.call(this, a2);
      this.i = S(q(a2, "showRepeatSwitch"), this.i);
      this.a = S(q(a2, "showFullpageSwitch"), this.a);
      this.b = S(q(a2, "showFullscreenSwitch"), this.b);
    };
    function Yh() {
      Ge.call(this);
    }
    p(Yh, Ge);
    n("GalleryWidget", Wh);
    n("GalleryWidget.prototype.decorate", Wh.prototype.$);
    n("GalleryWidget.prototype.setDataset", Wh.prototype.Ja);
    n("GalleryWidget.prototype.refresh", Wh.prototype.refresh);
    n("GalleryWidget.prototype.update", Wh.prototype.update);
    function $h(a2) {
      W.call(this, Sf, a2);
      this.b = true;
    }
    p($h, W);
    e = $h.prototype;
    e.w = function() {
      $h.g.w.call(this);
      E(this.c(), ai);
      E(this.a.c(), bi);
      this.o = new C(128, 128);
      O(this) && Ue(this);
    };
    e.vb = function() {
      Ne(this, false);
      Oe(this);
      this.b && A(this, ci);
    };
    function di(a2) {
      a2.o = new C(256, 256);
      O(a2) && Ue(a2);
      Ue(a2);
      F(a2.a.c(), 0);
      Kb(a2.vb, 360, a2);
    }
    e.fb = function(a2) {
      a2.stopPropagation();
      a2.a();
      oc(H(this), this.c(), "click", this.fb);
      this.b = true;
      di(this);
    };
    e.ab = function() {
      oc(H(this), Zb(this.c()), "click", this.ab);
      this.b = false;
      di(this);
    };
    e.A = function() {
      $h.g.A.call(this);
      var a2 = H(this);
      G(a2, this.c(), "click", this.fb);
      G(a2, Zb(this.c()), "click", this.ab);
    };
    var ai = { position: "absolute", top: "20%", right: "20%", bottom: "20%", left: "20%", "z-index": 1001, display: "flex", "justify-content": "center", "align-items": "center" }, bi = { transition: "width 0.36s ease-out,height 0.36s ease-out,opacity 0.36s ease-out" }, ci = "playerbuttonclick";
    function ei(a2) {
      Z.call(this, a2);
      a2 = this.i;
      this.S = true;
      this.s = new $h(a2);
    }
    p(ei, Z);
    e = ei.prototype;
    e.X = function() {
      ei.g.update.call(this);
      Te(this.s, Nh(this));
      this.s.update();
    };
    e.update = function() {
      ei.g.update.call(this);
      Te(this.s, Nh(this));
      this.s.update();
    };
    e.v = function() {
      return "jx-gallery-player";
    };
    e.w = function() {
      ei.g.w.call(this);
      N(this.s);
      I(this.s, this.a.c());
      var a2 = this.c();
      P(a2, this.v());
      E(a2, fi);
    };
    e.yc = function() {
      this.S && Qh(this);
      this.play();
    };
    e.A = function() {
      ei.g.A.call(this);
      y(this.s, ci, this.yc, false, this);
    };
    var fi = {};
    function gi(a2) {
      T.call(this, a2);
      this.a = new ei(this.i);
    }
    p(gi, T);
    e = gi.prototype;
    e.Da = function() {
      return new hi();
    };
    e.ta = function() {
      return new ii();
    };
    function ji(a2) {
      var b = a2.Y;
      a2.a.M(false);
      uc(a2.a.b);
      t(b.aa, function(c) {
        var d = new le();
        d.M(false);
        ze(d, c);
        this.a.b.T(d, !d.H);
      }, a2);
      xe(a2, a2.a, b);
      a2.a.S = b.f && b.a;
      Vf(a2.a.a.f, b.i);
      Vf(a2.a.a.a, b.a);
      Vf(a2.a.a.b, b.b);
    }
    e.refresh = function() {
      this.a.X();
    };
    e.update = function() {
      ji(this);
    };
    e.v = function() {
      return "jx-gallery-player-widget";
    };
    e.D = function(a2) {
      gi.g.D.call(this, a2);
      P(a2, this.v());
      Be(this, function() {
        I(this.a, this.b);
        this.a.M(true);
        this.a.update();
      }.bind(this));
    };
    e.Xb = function() {
      qe(this.f || this.c());
    };
    e.Wb = function() {
      se();
    };
    e.A = function() {
      gi.g.A.call(this);
      var a2 = H(this);
      G(a2, this.a, Rh, this.Xb);
      G(a2, this.a, Th, this.Wb);
    };
    function hi() {
      Fe.call(this);
      this.m = false;
      this.b = this.a = this.i = this.f = this.F = true;
    }
    p(hi, Fe);
    hi.prototype.B = function(a2) {
      hi.g.B.call(this, a2);
      this.f = S(q(a2, "fullpageAutoplay"), this.f);
      this.i = S(q(a2, "showRepeatSwitch"), this.i);
      this.a = S(q(a2, "showFullpageSwitch"), this.a);
      this.b = S(q(a2, "showFullscreenSwitch"), this.b);
    };
    function ii() {
      Ge.call(this);
    }
    p(ii, Ge);
    n("GalleryPlayerWidget", gi);
    n("GalleryPlayerWidget.prototype.decorate", gi.prototype.$);
    n("GalleryPlayerWidget.prototype.setDataset", gi.prototype.Ja);
    n("GalleryPlayerWidget.prototype.refresh", gi.prototype.refresh);
    n("GalleryPlayerWidget.prototype.update", gi.prototype.update);
    var ki = { Ua: "decorated", ob: function(a2, b) {
      a2.call().$(b);
    }, qb: function(a2, b) {
      q(b, ki.Ua, false) || (ki.ob(a2, b), b[ki.Ua] = true);
    }, ua: function(a2, b, c) {
      t(Tb(a2, c), function(d) {
        ki.qb(b, d);
      });
    } };
    function li(a2) {
      Ih.call(this, a2);
      a2 = this.i;
      this.h = new ah(a2);
      this.a = new xf(a2);
      this.l = new zh(a2);
      this.o = null;
    }
    p(li, Ih);
    e = li.prototype;
    e.ma = function(a2, b, c, d) {
      this.h.ma(a2);
      a2 = this.h;
      a2.j = b ? b : null;
      O(a2) && dh(a2);
      b = this.h;
      b.f = c ? c : null;
      O(b) && ch(b);
      this.h.la(d ? d : null);
    };
    e.la = function(a2) {
      this.o = a2;
    };
    e.xa = function(a2) {
      this.a.da(a2);
    };
    e.da = function(a2) {
      this.a.da(a2);
    };
    e.ka = function(a2) {
      this.a.ka(a2);
    };
    function mi(a2) {
      var b = Nh(a2), c = a2.h;
      c.l = b;
      O(c) && c.update();
      a2.a.ba(b);
    }
    e.X = function() {
      li.g.X.call(this);
      mi(this);
      this.h.update();
      this.a.update();
    };
    e.update = function() {
      li.g.update.call(this);
      mi(this);
      this.h.update();
      this.a.update();
      var a2 = K(this.b), b = this.l;
      b.a = 1 < a2 && 12 >= a2 ? K(this.b) : 0;
      O(b) && Ch(b);
      this.l.update();
    };
    e.v = function() {
      return "jx-carousel";
    };
    e.w = function() {
      li.g.w.call(this);
      var a2 = this.b.c();
      N(this.a);
      this.a.$(a2);
      N(this.h);
      bf(this.a, this.h);
      N(this.l);
      I(this.l, a2);
      a2 = this.c();
      P(a2, this.v());
      E(a2, ni);
      E(this.a.c(), oi);
      E(this.l.c(), pi);
    };
    e.Ob = function() {
      this.stop();
      Lg(this.b);
      Kh(this);
    };
    e.Qb = function() {
      this.stop();
      this.next();
    };
    e.Pb = function() {
    };
    e.Nb = function() {
    };
    e.mb = function() {
      var a2 = this.l;
      a2.f = this.b.b;
      O(a2) && Fh(a2);
      this.l.update();
    };
    e.rb = function(a2) {
      a2 = a2.B;
      a2 != this.b.b && (this.a.isVisible() || (this.j.stop(), Jh(this)), Ig(this.b, a2), Kh(this));
    };
    e.Ta = function() {
      this.u = false;
      this.j.stop();
    };
    e.Sa = function() {
      this.J || (this.play(), this.u = true, Jh(this));
    };
    e.oa = function(a2) {
      li.g.oa.call(this, a2);
      this.Ta(a2);
    };
    e.na = function(a2) {
      li.g.na.call(this, a2);
      this.Sa(a2);
    };
    e.A = function() {
      li.g.A.call(this);
      y(this.a, rg, this.Ob, false, this);
      y(this.a, sg, this.Qb, false, this);
      y(this.a, Ef, this.Pb, false, this);
      y(this.a, Ff, this.Nb, false, this);
      y(this.a, "show", this.Ta, false, this);
      y(this.a, "hide", this.Sa, false, this);
      y(this.l, "select", this.rb, false, this);
      y(this.b, "index", this.mb, false, this);
    };
    var ni = { position: "relative", overflow: "hidden", width: "100%", height: "100%" }, oi = { position: "absolute", top: 0, "z-index": 2 }, pi = { position: "absolute", bottom: "64px", "z-index": 101 };
    function qi(a2) {
      T.call(this, a2);
      this.a = new li(this.i);
    }
    p(qi, T);
    e = qi.prototype;
    e.Da = function() {
      return new ri();
    };
    e.ta = function() {
      return new si();
    };
    function ti(a2) {
      var b = a2.Y;
      a2.a.M(true);
      uc(a2.a.b);
      t(b.aa, function(c) {
        var d = new le();
        d.M(false);
        ze(d, c);
        this.a.b.T(d, !d.H);
      }, a2);
      xe(a2, a2.a, b);
      a2.a.M(true);
      Kb(function() {
        this.a.update();
      }, 0, a2);
    }
    e.refresh = function() {
      this.a.X();
    };
    e.update = function() {
      ti(this);
    };
    e.v = function() {
      return "jx-carousel-widget";
    };
    e.D = function(a2) {
      qi.g.D.call(this, a2);
      P(a2, this.v());
      Be(this, function() {
        I(this.a, this.b);
      }.bind(this));
    };
    function ri() {
      Fe.call(this);
      this.m = true;
    }
    p(ri, Fe);
    function si() {
      Ge.call(this);
    }
    p(si, Ge);
    n("CarouselWidget", qi);
    n("CarouselWidget.prototype.decorate", qi.prototype.$);
    n("CarouselWidget.prototype.setDataset", qi.prototype.Ja);
    n("CarouselWidget.prototype.refresh", qi.prototype.refresh);
    n("CarouselWidget.prototype.update", qi.prototype.update);
    function ui() {
      ki.ua("pa-carousel-widget", function() {
        return new qi();
      });
      ki.ua("pa-gallery-widget", function() {
        return new Wh();
      });
      ki.ua("pa-gallery-player-widget", function() {
        return new gi();
      });
    }
    x(document, "DOMContentLoaded", ui);
    ui();
    n("WidgetDecorator", ki);
    n("WidgetDecorator.decorateAll", ki.ua);
  }).call(void 0);
})();
//# sourceMappingURL=embed-ui.build.js.map
