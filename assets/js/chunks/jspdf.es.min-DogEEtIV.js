const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["js/chunks/index.es-BZm2x08E.js","js/chunks/index-D4WnN6nl.js","js/analytics.build.js","js/chunks/client-Cb2H9Ojh.js","css/analytics.build.css"])))=>i.map(i=>d[i]);
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { _ as __vitePreload } from "../analytics.build.js";
function _typeof(o2) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o3) {
    return typeof o3;
  } : function(o3) {
    return o3 && "function" == typeof Symbol && o3.constructor === Symbol && o3 !== Symbol.prototype ? "symbol" : typeof o3;
  }, _typeof(o2);
}
var u8 = Uint8Array, u16 = Uint16Array, i32 = Int32Array;
var fleb = new u8([
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  0,
  /* unused */
  0,
  0,
  /* impossible */
  0
]);
var fdeb = new u8([
  0,
  0,
  0,
  0,
  1,
  1,
  2,
  2,
  3,
  3,
  4,
  4,
  5,
  5,
  6,
  6,
  7,
  7,
  8,
  8,
  9,
  9,
  10,
  10,
  11,
  11,
  12,
  12,
  13,
  13,
  /* unused */
  0,
  0
]);
var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
var freb = function(eb, start) {
  var b2 = new u16(31);
  for (var i2 = 0; i2 < 31; ++i2) {
    b2[i2] = start += 1 << eb[i2 - 1];
  }
  var r = new i32(b2[30]);
  for (var i2 = 1; i2 < 30; ++i2) {
    for (var j2 = b2[i2]; j2 < b2[i2 + 1]; ++j2) {
      r[j2] = j2 - b2[i2] << 5 | i2;
    }
  }
  return { b: b2, r };
};
var _a = freb(fleb, 2), fl = _a.b, revfl = _a.r;
fl[28] = 258, revfl[258] = 28;
var _b = freb(fdeb, 0), revfd = _b.r;
var rev = new u16(32768);
for (var i$1 = 0; i$1 < 32768; ++i$1) {
  var x$1 = (i$1 & 43690) >> 1 | (i$1 & 21845) << 1;
  x$1 = (x$1 & 52428) >> 2 | (x$1 & 13107) << 2;
  x$1 = (x$1 & 61680) >> 4 | (x$1 & 3855) << 4;
  rev[i$1] = ((x$1 & 65280) >> 8 | (x$1 & 255) << 8) >> 1;
}
var hMap = function(cd, mb, r) {
  var s2 = cd.length;
  var i2 = 0;
  var l2 = new u16(mb);
  for (; i2 < s2; ++i2) {
    if (cd[i2])
      ++l2[cd[i2] - 1];
  }
  var le2 = new u16(mb);
  for (i2 = 1; i2 < mb; ++i2) {
    le2[i2] = le2[i2 - 1] + l2[i2 - 1] << 1;
  }
  var co;
  if (r) {
    co = new u16(1 << mb);
    var rvb = 15 - mb;
    for (i2 = 0; i2 < s2; ++i2) {
      if (cd[i2]) {
        var sv = i2 << 4 | cd[i2];
        var r_1 = mb - cd[i2];
        var v2 = le2[cd[i2] - 1]++ << r_1;
        for (var m2 = v2 | (1 << r_1) - 1; v2 <= m2; ++v2) {
          co[rev[v2] >> rvb] = sv;
        }
      }
    }
  } else {
    co = new u16(s2);
    for (i2 = 0; i2 < s2; ++i2) {
      if (cd[i2]) {
        co[i2] = rev[le2[cd[i2] - 1]++] >> 15 - cd[i2];
      }
    }
  }
  return co;
};
var flt = new u8(288);
for (var i$1 = 0; i$1 < 144; ++i$1)
  flt[i$1] = 8;
for (var i$1 = 144; i$1 < 256; ++i$1)
  flt[i$1] = 9;
for (var i$1 = 256; i$1 < 280; ++i$1)
  flt[i$1] = 7;
for (var i$1 = 280; i$1 < 288; ++i$1)
  flt[i$1] = 8;
var fdt = new u8(32);
for (var i$1 = 0; i$1 < 32; ++i$1)
  fdt[i$1] = 5;
var flm = /* @__PURE__ */ hMap(flt, 9, 0);
var fdm = /* @__PURE__ */ hMap(fdt, 5, 0);
var shft = function(p2) {
  return (p2 + 7) / 8 | 0;
};
var slc = function(v2, s2, e) {
  if (e == null || e > v2.length)
    e = v2.length;
  return new u8(v2.subarray(s2, e));
};
var wbits = function(d2, p2, v2) {
  v2 <<= p2 & 7;
  var o2 = p2 / 8 | 0;
  d2[o2] |= v2;
  d2[o2 + 1] |= v2 >> 8;
};
var wbits16 = function(d2, p2, v2) {
  v2 <<= p2 & 7;
  var o2 = p2 / 8 | 0;
  d2[o2] |= v2;
  d2[o2 + 1] |= v2 >> 8;
  d2[o2 + 2] |= v2 >> 16;
};
var hTree = function(d2, mb) {
  var t2 = [];
  for (var i2 = 0; i2 < d2.length; ++i2) {
    if (d2[i2])
      t2.push({ s: i2, f: d2[i2] });
  }
  var s2 = t2.length;
  var t22 = t2.slice();
  if (!s2)
    return { t: et$1, l: 0 };
  if (s2 == 1) {
    var v2 = new u8(t2[0].s + 1);
    v2[t2[0].s] = 1;
    return { t: v2, l: 1 };
  }
  t2.sort(function(a2, b2) {
    return a2.f - b2.f;
  });
  t2.push({ s: -1, f: 25001 });
  var l2 = t2[0], r = t2[1], i0 = 0, i1 = 1, i22 = 2;
  t2[0] = { s: -1, f: l2.f + r.f, l: l2, r };
  while (i1 != s2 - 1) {
    l2 = t2[t2[i0].f < t2[i22].f ? i0++ : i22++];
    r = t2[i0 != i1 && t2[i0].f < t2[i22].f ? i0++ : i22++];
    t2[i1++] = { s: -1, f: l2.f + r.f, l: l2, r };
  }
  var maxSym = t22[0].s;
  for (var i2 = 1; i2 < s2; ++i2) {
    if (t22[i2].s > maxSym)
      maxSym = t22[i2].s;
  }
  var tr = new u16(maxSym + 1);
  var mbt = ln(t2[i1 - 1], tr, 0);
  if (mbt > mb) {
    var i2 = 0, dt2 = 0;
    var lft = mbt - mb, cst = 1 << lft;
    t22.sort(function(a2, b2) {
      return tr[b2.s] - tr[a2.s] || a2.f - b2.f;
    });
    for (; i2 < s2; ++i2) {
      var i2_1 = t22[i2].s;
      if (tr[i2_1] > mb) {
        dt2 += cst - (1 << mbt - tr[i2_1]);
        tr[i2_1] = mb;
      } else
        break;
    }
    dt2 >>= lft;
    while (dt2 > 0) {
      var i2_2 = t22[i2].s;
      if (tr[i2_2] < mb)
        dt2 -= 1 << mb - tr[i2_2]++ - 1;
      else
        ++i2;
    }
    for (; i2 >= 0 && dt2; --i2) {
      var i2_3 = t22[i2].s;
      if (tr[i2_3] == mb) {
        --tr[i2_3];
        ++dt2;
      }
    }
    mbt = mb;
  }
  return { t: new u8(tr), l: mbt };
};
var ln = function(n, l2, d2) {
  return n.s == -1 ? Math.max(ln(n.l, l2, d2 + 1), ln(n.r, l2, d2 + 1)) : l2[n.s] = d2;
};
var lc = function(c2) {
  var s2 = c2.length;
  while (s2 && !c2[--s2])
    ;
  var cl = new u16(++s2);
  var cli = 0, cln = c2[0], cls = 1;
  var w2 = function(v2) {
    cl[cli++] = v2;
  };
  for (var i2 = 1; i2 <= s2; ++i2) {
    if (c2[i2] == cln && i2 != s2)
      ++cls;
    else {
      if (!cln && cls > 2) {
        for (; cls > 138; cls -= 138)
          w2(32754);
        if (cls > 2) {
          w2(cls > 10 ? cls - 11 << 5 | 28690 : cls - 3 << 5 | 12305);
          cls = 0;
        }
      } else if (cls > 3) {
        w2(cln), --cls;
        for (; cls > 6; cls -= 6)
          w2(8304);
        if (cls > 2)
          w2(cls - 3 << 5 | 8208), cls = 0;
      }
      while (cls--)
        w2(cln);
      cls = 1;
      cln = c2[i2];
    }
  }
  return { c: cl.subarray(0, cli), n: s2 };
};
var clen = function(cf, cl) {
  var l2 = 0;
  for (var i2 = 0; i2 < cl.length; ++i2)
    l2 += cf[i2] * cl[i2];
  return l2;
};
var wfblk = function(out, pos, dat) {
  var s2 = dat.length;
  var o2 = shft(pos + 2);
  out[o2] = s2 & 255;
  out[o2 + 1] = s2 >> 8;
  out[o2 + 2] = out[o2] ^ 255;
  out[o2 + 3] = out[o2 + 1] ^ 255;
  for (var i2 = 0; i2 < s2; ++i2)
    out[o2 + i2 + 4] = dat[i2];
  return (o2 + 4 + s2) * 8;
};
var wblk = function(dat, out, final, syms, lf, df, eb, li, bs, bl, p2) {
  wbits(out, p2++, final);
  ++lf[256];
  var _a2 = hTree(lf, 15), dlt = _a2.t, mlb = _a2.l;
  var _b2 = hTree(df, 15), ddt = _b2.t, mdb = _b2.l;
  var _c = lc(dlt), lclt = _c.c, nlc = _c.n;
  var _d = lc(ddt), lcdt = _d.c, ndc = _d.n;
  var lcfreq = new u16(19);
  for (var i2 = 0; i2 < lclt.length; ++i2)
    ++lcfreq[lclt[i2] & 31];
  for (var i2 = 0; i2 < lcdt.length; ++i2)
    ++lcfreq[lcdt[i2] & 31];
  var _e2 = hTree(lcfreq, 7), lct = _e2.t, mlcb = _e2.l;
  var nlcc = 19;
  for (; nlcc > 4 && !lct[clim[nlcc - 1]]; --nlcc)
    ;
  var flen = bl + 5 << 3;
  var ftlen = clen(lf, flt) + clen(df, fdt) + eb;
  var dtlen = clen(lf, dlt) + clen(df, ddt) + eb + 14 + 3 * nlcc + clen(lcfreq, lct) + 2 * lcfreq[16] + 3 * lcfreq[17] + 7 * lcfreq[18];
  if (bs >= 0 && flen <= ftlen && flen <= dtlen)
    return wfblk(out, p2, dat.subarray(bs, bs + bl));
  var lm, ll, dm, dl;
  wbits(out, p2, 1 + (dtlen < ftlen)), p2 += 2;
  if (dtlen < ftlen) {
    lm = hMap(dlt, mlb, 0), ll = dlt, dm = hMap(ddt, mdb, 0), dl = ddt;
    var llm = hMap(lct, mlcb, 0);
    wbits(out, p2, nlc - 257);
    wbits(out, p2 + 5, ndc - 1);
    wbits(out, p2 + 10, nlcc - 4);
    p2 += 14;
    for (var i2 = 0; i2 < nlcc; ++i2)
      wbits(out, p2 + 3 * i2, lct[clim[i2]]);
    p2 += 3 * nlcc;
    var lcts = [lclt, lcdt];
    for (var it2 = 0; it2 < 2; ++it2) {
      var clct = lcts[it2];
      for (var i2 = 0; i2 < clct.length; ++i2) {
        var len = clct[i2] & 31;
        wbits(out, p2, llm[len]), p2 += lct[len];
        if (len > 15)
          wbits(out, p2, clct[i2] >> 5 & 127), p2 += clct[i2] >> 12;
      }
    }
  } else {
    lm = flm, ll = flt, dm = fdm, dl = fdt;
  }
  for (var i2 = 0; i2 < li; ++i2) {
    var sym = syms[i2];
    if (sym > 255) {
      var len = sym >> 18 & 31;
      wbits16(out, p2, lm[len + 257]), p2 += ll[len + 257];
      if (len > 7)
        wbits(out, p2, sym >> 23 & 31), p2 += fleb[len];
      var dst = sym & 31;
      wbits16(out, p2, dm[dst]), p2 += dl[dst];
      if (dst > 3)
        wbits16(out, p2, sym >> 5 & 8191), p2 += fdeb[dst];
    } else {
      wbits16(out, p2, lm[sym]), p2 += ll[sym];
    }
  }
  wbits16(out, p2, lm[256]);
  return p2 + ll[256];
};
var deo = /* @__PURE__ */ new i32([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]);
var et$1 = /* @__PURE__ */ new u8(0);
var dflt = function(dat, lvl, plvl, pre, post, st2) {
  var s2 = st2.z || dat.length;
  var o2 = new u8(pre + s2 + 5 * (1 + Math.ceil(s2 / 7e3)) + post);
  var w2 = o2.subarray(pre, o2.length - post);
  var lst = st2.l;
  var pos = (st2.r || 0) & 7;
  if (lvl) {
    if (pos)
      w2[0] = st2.r >> 3;
    var opt = deo[lvl - 1];
    var n = opt >> 13, c2 = opt & 8191;
    var msk_1 = (1 << plvl) - 1;
    var prev = st2.p || new u16(32768), head = st2.h || new u16(msk_1 + 1);
    var bs1_1 = Math.ceil(plvl / 3), bs2_1 = 2 * bs1_1;
    var hsh = function(i3) {
      return (dat[i3] ^ dat[i3 + 1] << bs1_1 ^ dat[i3 + 2] << bs2_1) & msk_1;
    };
    var syms = new i32(25e3);
    var lf = new u16(288), df = new u16(32);
    var lc_1 = 0, eb = 0, i2 = st2.i || 0, li = 0, wi = st2.w || 0, bs = 0;
    for (; i2 + 2 < s2; ++i2) {
      var hv = hsh(i2);
      var imod = i2 & 32767, pimod = head[hv];
      prev[imod] = pimod;
      head[hv] = imod;
      if (wi <= i2) {
        var rem = s2 - i2;
        if ((lc_1 > 7e3 || li > 24576) && (rem > 423 || !lst)) {
          pos = wblk(dat, w2, 0, syms, lf, df, eb, li, bs, i2 - bs, pos);
          li = lc_1 = eb = 0, bs = i2;
          for (var j2 = 0; j2 < 286; ++j2)
            lf[j2] = 0;
          for (var j2 = 0; j2 < 30; ++j2)
            df[j2] = 0;
        }
        var l2 = 2, d2 = 0, ch_1 = c2, dif = imod - pimod & 32767;
        if (rem > 2 && hv == hsh(i2 - dif)) {
          var maxn = Math.min(n, rem) - 1;
          var maxd = Math.min(32767, i2);
          var ml = Math.min(258, rem);
          while (dif <= maxd && --ch_1 && imod != pimod) {
            if (dat[i2 + l2] == dat[i2 + l2 - dif]) {
              var nl = 0;
              for (; nl < ml && dat[i2 + nl] == dat[i2 + nl - dif]; ++nl)
                ;
              if (nl > l2) {
                l2 = nl, d2 = dif;
                if (nl > maxn)
                  break;
                var mmd = Math.min(dif, nl - 2);
                var md = 0;
                for (var j2 = 0; j2 < mmd; ++j2) {
                  var ti = i2 - dif + j2 & 32767;
                  var pti = prev[ti];
                  var cd = ti - pti & 32767;
                  if (cd > md)
                    md = cd, pimod = ti;
                }
              }
            }
            imod = pimod, pimod = prev[imod];
            dif += imod - pimod & 32767;
          }
        }
        if (d2) {
          syms[li++] = 268435456 | revfl[l2] << 18 | revfd[d2];
          var lin = revfl[l2] & 31, din = revfd[d2] & 31;
          eb += fleb[lin] + fdeb[din];
          ++lf[257 + lin];
          ++df[din];
          wi = i2 + l2;
          ++lc_1;
        } else {
          syms[li++] = dat[i2];
          ++lf[dat[i2]];
        }
      }
    }
    for (i2 = Math.max(i2, wi); i2 < s2; ++i2) {
      syms[li++] = dat[i2];
      ++lf[dat[i2]];
    }
    pos = wblk(dat, w2, lst, syms, lf, df, eb, li, bs, i2 - bs, pos);
    if (!lst) {
      st2.r = pos & 7 | w2[pos / 8 | 0] << 3;
      pos -= 7;
      st2.h = head, st2.p = prev, st2.i = i2, st2.w = wi;
    }
  } else {
    for (var i2 = st2.w || 0; i2 < s2 + lst; i2 += 65535) {
      var e = i2 + 65535;
      if (e >= s2) {
        w2[pos / 8 | 0] = lst;
        e = s2;
      }
      pos = wfblk(w2, pos + 1, dat.subarray(i2, e));
    }
    st2.i = s2;
  }
  return slc(o2, 0, pre + shft(pos) + post);
};
var adler = function() {
  var a2 = 1, b2 = 0;
  return {
    p: function(d2) {
      var n = a2, m2 = b2;
      var l2 = d2.length | 0;
      for (var i2 = 0; i2 != l2; ) {
        var e = Math.min(i2 + 2655, l2);
        for (; i2 < e; ++i2)
          m2 += n += d2[i2];
        n = (n & 65535) + 15 * (n >> 16), m2 = (m2 & 65535) + 15 * (m2 >> 16);
      }
      a2 = n, b2 = m2;
    },
    d: function() {
      a2 %= 65521, b2 %= 65521;
      return (a2 & 255) << 24 | (a2 & 65280) << 8 | (b2 & 255) << 8 | b2 >> 8;
    }
  };
};
var dopt = function(dat, opt, pre, post, st2) {
  if (!st2) {
    st2 = { l: 1 };
    if (opt.dictionary) {
      var dict = opt.dictionary.subarray(-32768);
      var newDat = new u8(dict.length + dat.length);
      newDat.set(dict);
      newDat.set(dat, dict.length);
      dat = newDat;
      st2.w = dict.length;
    }
  }
  return dflt(dat, opt.level == null ? 6 : opt.level, opt.mem == null ? st2.l ? Math.ceil(Math.max(8, Math.min(13, Math.log(dat.length))) * 1.5) : 20 : 12 + opt.mem, pre, post, st2);
};
var wbytes = function(d2, b2, v2) {
  for (; v2; ++b2)
    d2[b2] = v2, v2 >>>= 8;
};
var zlh = function(c2, o2) {
  var lv = o2.level, fl2 = lv == 0 ? 0 : lv < 6 ? 1 : lv == 9 ? 3 : 2;
  c2[0] = 120, c2[1] = fl2 << 6 | (o2.dictionary && 32);
  c2[1] |= 31 - (c2[0] << 8 | c2[1]) % 31;
  if (o2.dictionary) {
    var h2 = adler();
    h2.p(o2.dictionary);
    wbytes(c2, 2, h2.d());
  }
};
function zlibSync(data, opts) {
  if (!opts)
    opts = {};
  var a2 = adler();
  a2.p(data);
  var d2 = dopt(data, opts, opts.dictionary ? 6 : 2, 4);
  return zlh(d2, opts), wbytes(d2, d2.length - 4, a2.d()), d2;
}
var td = typeof TextDecoder != "undefined" && /* @__PURE__ */ new TextDecoder();
var tds = 0;
try {
  td.decode(et$1, { stream: true });
  tds = 1;
} catch (e) {
}
function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}
function _iterableToArrayLimit(r, l2) {
  var t2 = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t2) {
    var e, n, i2, u2, a2 = [], f2 = true, o2 = false;
    try {
      if (i2 = (t2 = t2.call(r)).next, 0 === l2) ;
      else for (; !(f2 = (e = i2.call(t2)).done) && (a2.push(e.value), a2.length !== l2); f2 = true) ;
    } catch (r2) {
      o2 = true, n = r2;
    } finally {
      try {
        if (!f2 && null != t2["return"] && (u2 = t2["return"](), Object(u2) !== u2)) return;
      } finally {
        if (o2) throw n;
      }
    }
    return a2;
  }
}
function _arrayLikeToArray(r, a2) {
  (null == a2 || a2 > r.length) && (a2 = r.length);
  for (var e = 0, n = Array(a2); e < a2; e++) n[e] = r[e];
  return n;
}
function _unsupportedIterableToArray(r, a2) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a2);
    var t2 = {}.toString.call(r).slice(8, -1);
    return "Object" === t2 && r.constructor && (t2 = r.constructor.name), "Map" === t2 || "Set" === t2 ? Array.from(r) : "Arguments" === t2 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t2) ? _arrayLikeToArray(r, a2) : void 0;
  }
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _slicedToArray(r, e) {
  return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function decode(bytes, encoding = "utf8") {
  const decoder = new TextDecoder(encoding);
  return decoder.decode(bytes);
}
const encoder = new TextEncoder();
function encode(str) {
  return encoder.encode(str);
}
const defaultByteLength = 1024 * 8;
const hostBigEndian = (() => {
  const array = new Uint8Array(4);
  const view = new Uint32Array(array.buffer);
  return !((view[0] = 1) & array[0]);
})();
const typedArrays = {
  int8: globalThis.Int8Array,
  uint8: globalThis.Uint8Array,
  int16: globalThis.Int16Array,
  uint16: globalThis.Uint16Array,
  int32: globalThis.Int32Array,
  uint32: globalThis.Uint32Array,
  uint64: globalThis.BigUint64Array,
  int64: globalThis.BigInt64Array,
  float32: globalThis.Float32Array,
  float64: globalThis.Float64Array
};
class IOBuffer {
  /**
   * Create a new IOBuffer.
   * @param data - The data to construct the IOBuffer with.
   * If data is a number, it will be the new buffer's length<br>
   * If data is `undefined`, the buffer will be initialized with a default length of 8Kb<br>
   * If data is an ArrayBuffer, SharedArrayBuffer, an ArrayBufferView (Typed Array), an IOBuffer instance,
   * or a Node.js Buffer, a view will be created over the underlying ArrayBuffer.
   * @param options - An object for the options.
   * @returns A new IOBuffer instance.
   */
  constructor(data = defaultByteLength, options = {}) {
    /**
     * Reference to the internal ArrayBuffer object.
     */
    __publicField(this, "buffer");
    /**
     * Byte length of the internal ArrayBuffer.
     */
    __publicField(this, "byteLength");
    /**
     * Byte offset of the internal ArrayBuffer.
     */
    __publicField(this, "byteOffset");
    /**
     * Byte length of the internal ArrayBuffer.
     */
    __publicField(this, "length");
    /**
     * The current offset of the buffer's pointer.
     */
    __publicField(this, "offset");
    __publicField(this, "lastWrittenByte");
    __publicField(this, "littleEndian");
    __publicField(this, "_data");
    __publicField(this, "_mark");
    __publicField(this, "_marks");
    let dataIsGiven = false;
    if (typeof data === "number") {
      data = new ArrayBuffer(data);
    } else {
      dataIsGiven = true;
      this.lastWrittenByte = data.byteLength;
    }
    const offset = options.offset ? options.offset >>> 0 : 0;
    const byteLength = data.byteLength - offset;
    let dvOffset = offset;
    if (ArrayBuffer.isView(data) || data instanceof IOBuffer) {
      if (data.byteLength !== data.buffer.byteLength) {
        dvOffset = data.byteOffset + offset;
      }
      data = data.buffer;
    }
    if (dataIsGiven) {
      this.lastWrittenByte = byteLength;
    } else {
      this.lastWrittenByte = 0;
    }
    this.buffer = data;
    this.length = byteLength;
    this.byteLength = byteLength;
    this.byteOffset = dvOffset;
    this.offset = 0;
    this.littleEndian = true;
    this._data = new DataView(this.buffer, dvOffset, byteLength);
    this._mark = 0;
    this._marks = [];
  }
  /**
   * Checks if the memory allocated to the buffer is sufficient to store more
   * bytes after the offset.
   * @param byteLength - The needed memory in bytes.
   * @returns `true` if there is sufficient space and `false` otherwise.
   */
  available(byteLength = 1) {
    return this.offset + byteLength <= this.length;
  }
  /**
   * Check if little-endian mode is used for reading and writing multi-byte
   * values.
   * @returns `true` if little-endian mode is used, `false` otherwise.
   */
  isLittleEndian() {
    return this.littleEndian;
  }
  /**
   * Set little-endian mode for reading and writing multi-byte values.
   * @returns This.
   */
  setLittleEndian() {
    this.littleEndian = true;
    return this;
  }
  /**
   * Check if big-endian mode is used for reading and writing multi-byte values.
   * @returns `true` if big-endian mode is used, `false` otherwise.
   */
  isBigEndian() {
    return !this.littleEndian;
  }
  /**
   * Switches to big-endian mode for reading and writing multi-byte values.
   * @returns This.
   */
  setBigEndian() {
    this.littleEndian = false;
    return this;
  }
  /**
   * Move the pointer n bytes forward.
   * @param n - Number of bytes to skip.
   * @returns This.
   */
  skip(n = 1) {
    this.offset += n;
    return this;
  }
  /**
   * Move the pointer n bytes backward.
   * @param n - Number of bytes to move back.
   * @returns This.
   */
  back(n = 1) {
    this.offset -= n;
    return this;
  }
  /**
   * Move the pointer to the given offset.
   * @param offset - The offset to move to.
   * @returns This.
   */
  seek(offset) {
    this.offset = offset;
    return this;
  }
  /**
   * Store the current pointer offset.
   * @see {@link IOBuffer#reset}
   * @returns This.
   */
  mark() {
    this._mark = this.offset;
    return this;
  }
  /**
   * Move the pointer back to the last pointer offset set by mark.
   * @see {@link IOBuffer#mark}
   * @returns This.
   */
  reset() {
    this.offset = this._mark;
    return this;
  }
  /**
   * Push the current pointer offset to the mark stack.
   * @see {@link IOBuffer#popMark}
   * @returns This.
   */
  pushMark() {
    this._marks.push(this.offset);
    return this;
  }
  /**
   * Pop the last pointer offset from the mark stack, and set the current
   * pointer offset to the popped value.
   * @see {@link IOBuffer#pushMark}
   * @returns This.
   */
  popMark() {
    const offset = this._marks.pop();
    if (offset === void 0) {
      throw new Error("Mark stack empty");
    }
    this.seek(offset);
    return this;
  }
  /**
   * Move the pointer offset back to 0.
   * @returns This.
   */
  rewind() {
    this.offset = 0;
    return this;
  }
  /**
   * Make sure the buffer has sufficient memory to write a given byteLength at
   * the current pointer offset.
   * If the buffer's memory is insufficient, this method will create a new
   * buffer (a copy) with a length that is twice (byteLength + current offset).
   * @param byteLength - The needed memory in bytes.
   * @returns This.
   */
  ensureAvailable(byteLength = 1) {
    if (!this.available(byteLength)) {
      const lengthNeeded = this.offset + byteLength;
      const newLength = lengthNeeded * 2;
      const newArray = new Uint8Array(newLength);
      newArray.set(new Uint8Array(this.buffer));
      this.buffer = newArray.buffer;
      this.length = newLength;
      this.byteLength = newLength;
      this._data = new DataView(this.buffer);
    }
    return this;
  }
  /**
   * Read a byte and return false if the byte's value is 0, or true otherwise.
   * Moves pointer forward by one byte.
   * @returns The read boolean.
   */
  readBoolean() {
    return this.readUint8() !== 0;
  }
  /**
   * Read a signed 8-bit integer and move pointer forward by 1 byte.
   * @returns The read byte.
   */
  readInt8() {
    return this._data.getInt8(this.offset++);
  }
  /**
   * Read an unsigned 8-bit integer and move pointer forward by 1 byte.
   * @returns The read byte.
   */
  readUint8() {
    return this._data.getUint8(this.offset++);
  }
  /**
   * Alias for {@link IOBuffer#readUint8}.
   * @returns The read byte.
   */
  readByte() {
    return this.readUint8();
  }
  /**
   * Read `n` bytes and move pointer forward by `n` bytes.
   * @param n - Number of bytes to read.
   * @returns The read bytes.
   */
  readBytes(n = 1) {
    return this.readArray(n, "uint8");
  }
  /**
   * Creates an array of corresponding to the type `type` and size `size`.
   * For example type `uint8` will create a `Uint8Array`.
   * @param size - size of the resulting array
   * @param type - number type of elements to read
   * @returns The read array.
   */
  readArray(size, type) {
    const bytes = typedArrays[type].BYTES_PER_ELEMENT * size;
    const offset = this.byteOffset + this.offset;
    const slice = this.buffer.slice(offset, offset + bytes);
    if (this.littleEndian === hostBigEndian && type !== "uint8" && type !== "int8") {
      const slice2 = new Uint8Array(this.buffer.slice(offset, offset + bytes));
      slice2.reverse();
      const returnArray2 = new typedArrays[type](slice2.buffer);
      this.offset += bytes;
      returnArray2.reverse();
      return returnArray2;
    }
    const returnArray = new typedArrays[type](slice);
    this.offset += bytes;
    return returnArray;
  }
  /**
   * Read a 16-bit signed integer and move pointer forward by 2 bytes.
   * @returns The read value.
   */
  readInt16() {
    const value = this._data.getInt16(this.offset, this.littleEndian);
    this.offset += 2;
    return value;
  }
  /**
   * Read a 16-bit unsigned integer and move pointer forward by 2 bytes.
   * @returns The read value.
   */
  readUint16() {
    const value = this._data.getUint16(this.offset, this.littleEndian);
    this.offset += 2;
    return value;
  }
  /**
   * Read a 32-bit signed integer and move pointer forward by 4 bytes.
   * @returns The read value.
   */
  readInt32() {
    const value = this._data.getInt32(this.offset, this.littleEndian);
    this.offset += 4;
    return value;
  }
  /**
   * Read a 32-bit unsigned integer and move pointer forward by 4 bytes.
   * @returns The read value.
   */
  readUint32() {
    const value = this._data.getUint32(this.offset, this.littleEndian);
    this.offset += 4;
    return value;
  }
  /**
   * Read a 32-bit floating number and move pointer forward by 4 bytes.
   * @returns The read value.
   */
  readFloat32() {
    const value = this._data.getFloat32(this.offset, this.littleEndian);
    this.offset += 4;
    return value;
  }
  /**
   * Read a 64-bit floating number and move pointer forward by 8 bytes.
   * @returns The read value.
   */
  readFloat64() {
    const value = this._data.getFloat64(this.offset, this.littleEndian);
    this.offset += 8;
    return value;
  }
  /**
   * Read a 64-bit signed integer number and move pointer forward by 8 bytes.
   * @returns The read value.
   */
  readBigInt64() {
    const value = this._data.getBigInt64(this.offset, this.littleEndian);
    this.offset += 8;
    return value;
  }
  /**
   * Read a 64-bit unsigned integer number and move pointer forward by 8 bytes.
   * @returns The read value.
   */
  readBigUint64() {
    const value = this._data.getBigUint64(this.offset, this.littleEndian);
    this.offset += 8;
    return value;
  }
  /**
   * Read a 1-byte ASCII character and move pointer forward by 1 byte.
   * @returns The read character.
   */
  readChar() {
    return String.fromCharCode(this.readInt8());
  }
  /**
   * Read `n` 1-byte ASCII characters and move pointer forward by `n` bytes.
   * @param n - Number of characters to read.
   * @returns The read characters.
   */
  readChars(n = 1) {
    let result = "";
    for (let i2 = 0; i2 < n; i2++) {
      result += this.readChar();
    }
    return result;
  }
  /**
   * Read the next `n` bytes, return a UTF-8 decoded string and move pointer
   * forward by `n` bytes.
   * @param n - Number of bytes to read.
   * @returns The decoded string.
   */
  readUtf8(n = 1) {
    return decode(this.readBytes(n));
  }
  /**
   * Read the next `n` bytes, return a string decoded with `encoding` and move pointer
   * forward by `n` bytes.
   * If no encoding is passed, the function is equivalent to @see {@link IOBuffer#readUtf8}
   * @param n - Number of bytes to read.
   * @param encoding - The encoding to use. Default is 'utf8'.
   * @returns The decoded string.
   */
  decodeText(n = 1, encoding = "utf8") {
    return decode(this.readBytes(n), encoding);
  }
  /**
   * Write 0xff if the passed value is truthy, 0x00 otherwise and move pointer
   * forward by 1 byte.
   * @param value - The value to write.
   * @returns This.
   */
  writeBoolean(value) {
    this.writeUint8(value ? 255 : 0);
    return this;
  }
  /**
   * Write `value` as an 8-bit signed integer and move pointer forward by 1 byte.
   * @param value - The value to write.
   * @returns This.
   */
  writeInt8(value) {
    this.ensureAvailable(1);
    this._data.setInt8(this.offset++, value);
    this._updateLastWrittenByte();
    return this;
  }
  /**
   * Write `value` as an 8-bit unsigned integer and move pointer forward by 1
   * byte.
   * @param value - The value to write.
   * @returns This.
   */
  writeUint8(value) {
    this.ensureAvailable(1);
    this._data.setUint8(this.offset++, value);
    this._updateLastWrittenByte();
    return this;
  }
  /**
   * An alias for {@link IOBuffer#writeUint8}.
   * @param value - The value to write.
   * @returns This.
   */
  writeByte(value) {
    return this.writeUint8(value);
  }
  /**
   * Write all elements of `bytes` as uint8 values and move pointer forward by
   * `bytes.length` bytes.
   * @param bytes - The array of bytes to write.
   * @returns This.
   */
  writeBytes(bytes) {
    this.ensureAvailable(bytes.length);
    for (let i2 = 0; i2 < bytes.length; i2++) {
      this._data.setUint8(this.offset++, bytes[i2]);
    }
    this._updateLastWrittenByte();
    return this;
  }
  /**
   * Write `value` as a 16-bit signed integer and move pointer forward by 2
   * bytes.
   * @param value - The value to write.
   * @returns This.
   */
  writeInt16(value) {
    this.ensureAvailable(2);
    this._data.setInt16(this.offset, value, this.littleEndian);
    this.offset += 2;
    this._updateLastWrittenByte();
    return this;
  }
  /**
   * Write `value` as a 16-bit unsigned integer and move pointer forward by 2
   * bytes.
   * @param value - The value to write.
   * @returns This.
   */
  writeUint16(value) {
    this.ensureAvailable(2);
    this._data.setUint16(this.offset, value, this.littleEndian);
    this.offset += 2;
    this._updateLastWrittenByte();
    return this;
  }
  /**
   * Write `value` as a 32-bit signed integer and move pointer forward by 4
   * bytes.
   * @param value - The value to write.
   * @returns This.
   */
  writeInt32(value) {
    this.ensureAvailable(4);
    this._data.setInt32(this.offset, value, this.littleEndian);
    this.offset += 4;
    this._updateLastWrittenByte();
    return this;
  }
  /**
   * Write `value` as a 32-bit unsigned integer and move pointer forward by 4
   * bytes.
   * @param value - The value to write.
   * @returns This.
   */
  writeUint32(value) {
    this.ensureAvailable(4);
    this._data.setUint32(this.offset, value, this.littleEndian);
    this.offset += 4;
    this._updateLastWrittenByte();
    return this;
  }
  /**
   * Write `value` as a 32-bit floating number and move pointer forward by 4
   * bytes.
   * @param value - The value to write.
   * @returns This.
   */
  writeFloat32(value) {
    this.ensureAvailable(4);
    this._data.setFloat32(this.offset, value, this.littleEndian);
    this.offset += 4;
    this._updateLastWrittenByte();
    return this;
  }
  /**
   * Write `value` as a 64-bit floating number and move pointer forward by 8
   * bytes.
   * @param value - The value to write.
   * @returns This.
   */
  writeFloat64(value) {
    this.ensureAvailable(8);
    this._data.setFloat64(this.offset, value, this.littleEndian);
    this.offset += 8;
    this._updateLastWrittenByte();
    return this;
  }
  /**
   * Write `value` as a 64-bit signed bigint and move pointer forward by 8
   * bytes.
   * @param value - The value to write.
   * @returns This.
   */
  writeBigInt64(value) {
    this.ensureAvailable(8);
    this._data.setBigInt64(this.offset, value, this.littleEndian);
    this.offset += 8;
    this._updateLastWrittenByte();
    return this;
  }
  /**
   * Write `value` as a 64-bit unsigned bigint and move pointer forward by 8
   * bytes.
   * @param value - The value to write.
   * @returns This.
   */
  writeBigUint64(value) {
    this.ensureAvailable(8);
    this._data.setBigUint64(this.offset, value, this.littleEndian);
    this.offset += 8;
    this._updateLastWrittenByte();
    return this;
  }
  /**
   * Write the charCode of `str`'s first character as an 8-bit unsigned integer
   * and move pointer forward by 1 byte.
   * @param str - The character to write.
   * @returns This.
   */
  writeChar(str) {
    return this.writeUint8(str.charCodeAt(0));
  }
  /**
   * Write the charCodes of all `str`'s characters as 8-bit unsigned integers
   * and move pointer forward by `str.length` bytes.
   * @param str - The characters to write.
   * @returns This.
   */
  writeChars(str) {
    for (let i2 = 0; i2 < str.length; i2++) {
      this.writeUint8(str.charCodeAt(i2));
    }
    return this;
  }
  /**
   * UTF-8 encode and write `str` to the current pointer offset and move pointer
   * forward according to the encoded length.
   * @param str - The string to write.
   * @returns This.
   */
  writeUtf8(str) {
    return this.writeBytes(encode(str));
  }
  /**
   * Export a Uint8Array view of the internal buffer.
   * The view starts at the byte offset and its length
   * is calculated to stop at the last written byte or the original length.
   * @returns A new Uint8Array view.
   */
  toArray() {
    return new Uint8Array(this.buffer, this.byteOffset, this.lastWrittenByte);
  }
  /**
   *  Get the total number of bytes written so far, regardless of the current offset.
   * @returns - Total number of bytes.
   */
  getWrittenByteLength() {
    return this.lastWrittenByte - this.byteOffset;
  }
  /**
   * Update the last written byte offset
   * @private
   */
  _updateLastWrittenByte() {
    if (this.offset > this.lastWrittenByte) {
      this.lastWrittenByte = this.offset;
    }
  }
}
function zero$1(buf) {
  let len = buf.length;
  while (--len >= 0) {
    buf[len] = 0;
  }
}
const MIN_MATCH$1 = 3;
const MAX_MATCH$1 = 258;
const LENGTH_CODES$1 = 29;
const LITERALS$1 = 256;
const L_CODES$1 = LITERALS$1 + 1 + LENGTH_CODES$1;
const D_CODES$1 = 30;
const DIST_CODE_LEN = 512;
const static_ltree = new Array((L_CODES$1 + 2) * 2);
zero$1(static_ltree);
const static_dtree = new Array(D_CODES$1 * 2);
zero$1(static_dtree);
const _dist_code = new Array(DIST_CODE_LEN);
zero$1(_dist_code);
const _length_code = new Array(MAX_MATCH$1 - MIN_MATCH$1 + 1);
zero$1(_length_code);
const base_length = new Array(LENGTH_CODES$1);
zero$1(base_length);
const base_dist = new Array(D_CODES$1);
zero$1(base_dist);
const adler32 = (adler2, buf, len, pos) => {
  let s1 = adler2 & 65535 | 0, s2 = adler2 >>> 16 & 65535 | 0, n = 0;
  while (len !== 0) {
    n = len > 2e3 ? 2e3 : len;
    len -= n;
    do {
      s1 = s1 + buf[pos++] | 0;
      s2 = s2 + s1 | 0;
    } while (--n);
    s1 %= 65521;
    s2 %= 65521;
  }
  return s1 | s2 << 16 | 0;
};
var adler32_1 = adler32;
const makeTable = () => {
  let c2, table = [];
  for (var n = 0; n < 256; n++) {
    c2 = n;
    for (var k2 = 0; k2 < 8; k2++) {
      c2 = c2 & 1 ? 3988292384 ^ c2 >>> 1 : c2 >>> 1;
    }
    table[n] = c2;
  }
  return table;
};
const crcTable$1 = new Uint32Array(makeTable());
const crc32 = (crc2, buf, len, pos) => {
  const t2 = crcTable$1;
  const end = pos + len;
  crc2 ^= -1;
  for (let i2 = pos; i2 < end; i2++) {
    crc2 = crc2 >>> 8 ^ t2[(crc2 ^ buf[i2]) & 255];
  }
  return crc2 ^ -1;
};
var crc32_1 = crc32;
var messages = {
  2: "need dictionary",
  /* Z_NEED_DICT       2  */
  1: "stream end",
  /* Z_STREAM_END      1  */
  0: "",
  /* Z_OK              0  */
  "-1": "file error",
  /* Z_ERRNO         (-1) */
  "-2": "stream error",
  /* Z_STREAM_ERROR  (-2) */
  "-3": "data error",
  /* Z_DATA_ERROR    (-3) */
  "-4": "insufficient memory",
  /* Z_MEM_ERROR     (-4) */
  "-5": "buffer error",
  /* Z_BUF_ERROR     (-5) */
  "-6": "incompatible version"
  /* Z_VERSION_ERROR (-6) */
};
var constants$2 = {
  /* Allowed flush values; see deflate() and inflate() below for details */
  Z_NO_FLUSH: 0,
  Z_FINISH: 4,
  Z_BLOCK: 5,
  Z_TREES: 6,
  /* Return codes for the compression/decompression functions. Negative values
  * are errors, positive values are used for special but normal events.
  */
  Z_OK: 0,
  Z_STREAM_END: 1,
  Z_NEED_DICT: 2,
  Z_STREAM_ERROR: -2,
  Z_DATA_ERROR: -3,
  Z_MEM_ERROR: -4,
  Z_BUF_ERROR: -5,
  /* The deflate compression method */
  Z_DEFLATED: 8
  //Z_NULL:                 null // Use -1 or null inline, depending on var type
};
const _has = (obj, key) => {
  return Object.prototype.hasOwnProperty.call(obj, key);
};
var assign = function(obj) {
  const sources = Array.prototype.slice.call(arguments, 1);
  while (sources.length) {
    const source = sources.shift();
    if (!source) {
      continue;
    }
    if (typeof source !== "object") {
      throw new TypeError(source + "must be non-object");
    }
    for (const p2 in source) {
      if (_has(source, p2)) {
        obj[p2] = source[p2];
      }
    }
  }
  return obj;
};
var flattenChunks = (chunks) => {
  let len = 0;
  for (let i2 = 0, l2 = chunks.length; i2 < l2; i2++) {
    len += chunks[i2].length;
  }
  const result = new Uint8Array(len);
  for (let i2 = 0, pos = 0, l2 = chunks.length; i2 < l2; i2++) {
    let chunk = chunks[i2];
    result.set(chunk, pos);
    pos += chunk.length;
  }
  return result;
};
var common = {
  assign,
  flattenChunks
};
let STR_APPLY_UIA_OK = true;
try {
  String.fromCharCode.apply(null, new Uint8Array(1));
} catch (__) {
  STR_APPLY_UIA_OK = false;
}
const _utf8len = new Uint8Array(256);
for (let q2 = 0; q2 < 256; q2++) {
  _utf8len[q2] = q2 >= 252 ? 6 : q2 >= 248 ? 5 : q2 >= 240 ? 4 : q2 >= 224 ? 3 : q2 >= 192 ? 2 : 1;
}
_utf8len[254] = _utf8len[254] = 1;
var string2buf = (str) => {
  if (typeof TextEncoder === "function" && TextEncoder.prototype.encode) {
    return new TextEncoder().encode(str);
  }
  let buf, c2, c22, m_pos, i2, str_len = str.length, buf_len = 0;
  for (m_pos = 0; m_pos < str_len; m_pos++) {
    c2 = str.charCodeAt(m_pos);
    if ((c2 & 64512) === 55296 && m_pos + 1 < str_len) {
      c22 = str.charCodeAt(m_pos + 1);
      if ((c22 & 64512) === 56320) {
        c2 = 65536 + (c2 - 55296 << 10) + (c22 - 56320);
        m_pos++;
      }
    }
    buf_len += c2 < 128 ? 1 : c2 < 2048 ? 2 : c2 < 65536 ? 3 : 4;
  }
  buf = new Uint8Array(buf_len);
  for (i2 = 0, m_pos = 0; i2 < buf_len; m_pos++) {
    c2 = str.charCodeAt(m_pos);
    if ((c2 & 64512) === 55296 && m_pos + 1 < str_len) {
      c22 = str.charCodeAt(m_pos + 1);
      if ((c22 & 64512) === 56320) {
        c2 = 65536 + (c2 - 55296 << 10) + (c22 - 56320);
        m_pos++;
      }
    }
    if (c2 < 128) {
      buf[i2++] = c2;
    } else if (c2 < 2048) {
      buf[i2++] = 192 | c2 >>> 6;
      buf[i2++] = 128 | c2 & 63;
    } else if (c2 < 65536) {
      buf[i2++] = 224 | c2 >>> 12;
      buf[i2++] = 128 | c2 >>> 6 & 63;
      buf[i2++] = 128 | c2 & 63;
    } else {
      buf[i2++] = 240 | c2 >>> 18;
      buf[i2++] = 128 | c2 >>> 12 & 63;
      buf[i2++] = 128 | c2 >>> 6 & 63;
      buf[i2++] = 128 | c2 & 63;
    }
  }
  return buf;
};
const buf2binstring = (buf, len) => {
  if (len < 65534) {
    if (buf.subarray && STR_APPLY_UIA_OK) {
      return String.fromCharCode.apply(null, buf.length === len ? buf : buf.subarray(0, len));
    }
  }
  let result = "";
  for (let i2 = 0; i2 < len; i2++) {
    result += String.fromCharCode(buf[i2]);
  }
  return result;
};
var buf2string = (buf, max) => {
  const len = max || buf.length;
  if (typeof TextDecoder === "function" && TextDecoder.prototype.decode) {
    return new TextDecoder().decode(buf.subarray(0, max));
  }
  let i2, out;
  const utf16buf = new Array(len * 2);
  for (out = 0, i2 = 0; i2 < len; ) {
    let c2 = buf[i2++];
    if (c2 < 128) {
      utf16buf[out++] = c2;
      continue;
    }
    let c_len = _utf8len[c2];
    if (c_len > 4) {
      utf16buf[out++] = 65533;
      i2 += c_len - 1;
      continue;
    }
    c2 &= c_len === 2 ? 31 : c_len === 3 ? 15 : 7;
    while (c_len > 1 && i2 < len) {
      c2 = c2 << 6 | buf[i2++] & 63;
      c_len--;
    }
    if (c_len > 1) {
      utf16buf[out++] = 65533;
      continue;
    }
    if (c2 < 65536) {
      utf16buf[out++] = c2;
    } else {
      c2 -= 65536;
      utf16buf[out++] = 55296 | c2 >> 10 & 1023;
      utf16buf[out++] = 56320 | c2 & 1023;
    }
  }
  return buf2binstring(utf16buf, out);
};
var utf8border = (buf, max) => {
  max = max || buf.length;
  if (max > buf.length) {
    max = buf.length;
  }
  let pos = max - 1;
  while (pos >= 0 && (buf[pos] & 192) === 128) {
    pos--;
  }
  if (pos < 0) {
    return max;
  }
  if (pos === 0) {
    return max;
  }
  return pos + _utf8len[buf[pos]] > max ? pos : max;
};
var strings = {
  string2buf,
  buf2string,
  utf8border
};
function ZStream() {
  this.input = null;
  this.next_in = 0;
  this.avail_in = 0;
  this.total_in = 0;
  this.output = null;
  this.next_out = 0;
  this.avail_out = 0;
  this.total_out = 0;
  this.msg = "";
  this.state = null;
  this.data_type = 2;
  this.adler = 0;
}
var zstream = ZStream;
const BAD$1 = 16209;
const TYPE$1 = 16191;
var inffast = function inflate_fast(strm, start) {
  let _in;
  let last;
  let _out;
  let beg;
  let end;
  let dmax;
  let wsize;
  let whave;
  let wnext;
  let s_window;
  let hold;
  let bits;
  let lcode;
  let dcode;
  let lmask;
  let dmask;
  let here;
  let op;
  let len;
  let dist;
  let from;
  let from_source;
  let input, output;
  const state = strm.state;
  _in = strm.next_in;
  input = strm.input;
  last = _in + (strm.avail_in - 5);
  _out = strm.next_out;
  output = strm.output;
  beg = _out - (start - strm.avail_out);
  end = _out + (strm.avail_out - 257);
  dmax = state.dmax;
  wsize = state.wsize;
  whave = state.whave;
  wnext = state.wnext;
  s_window = state.window;
  hold = state.hold;
  bits = state.bits;
  lcode = state.lencode;
  dcode = state.distcode;
  lmask = (1 << state.lenbits) - 1;
  dmask = (1 << state.distbits) - 1;
  top:
    do {
      if (bits < 15) {
        hold += input[_in++] << bits;
        bits += 8;
        hold += input[_in++] << bits;
        bits += 8;
      }
      here = lcode[hold & lmask];
      dolen:
        for (; ; ) {
          op = here >>> 24;
          hold >>>= op;
          bits -= op;
          op = here >>> 16 & 255;
          if (op === 0) {
            output[_out++] = here & 65535;
          } else if (op & 16) {
            len = here & 65535;
            op &= 15;
            if (op) {
              if (bits < op) {
                hold += input[_in++] << bits;
                bits += 8;
              }
              len += hold & (1 << op) - 1;
              hold >>>= op;
              bits -= op;
            }
            if (bits < 15) {
              hold += input[_in++] << bits;
              bits += 8;
              hold += input[_in++] << bits;
              bits += 8;
            }
            here = dcode[hold & dmask];
            dodist:
              for (; ; ) {
                op = here >>> 24;
                hold >>>= op;
                bits -= op;
                op = here >>> 16 & 255;
                if (op & 16) {
                  dist = here & 65535;
                  op &= 15;
                  if (bits < op) {
                    hold += input[_in++] << bits;
                    bits += 8;
                    if (bits < op) {
                      hold += input[_in++] << bits;
                      bits += 8;
                    }
                  }
                  dist += hold & (1 << op) - 1;
                  if (dist > dmax) {
                    strm.msg = "invalid distance too far back";
                    state.mode = BAD$1;
                    break top;
                  }
                  hold >>>= op;
                  bits -= op;
                  op = _out - beg;
                  if (dist > op) {
                    op = dist - op;
                    if (op > whave) {
                      if (state.sane) {
                        strm.msg = "invalid distance too far back";
                        state.mode = BAD$1;
                        break top;
                      }
                    }
                    from = 0;
                    from_source = s_window;
                    if (wnext === 0) {
                      from += wsize - op;
                      if (op < len) {
                        len -= op;
                        do {
                          output[_out++] = s_window[from++];
                        } while (--op);
                        from = _out - dist;
                        from_source = output;
                      }
                    } else if (wnext < op) {
                      from += wsize + wnext - op;
                      op -= wnext;
                      if (op < len) {
                        len -= op;
                        do {
                          output[_out++] = s_window[from++];
                        } while (--op);
                        from = 0;
                        if (wnext < len) {
                          op = wnext;
                          len -= op;
                          do {
                            output[_out++] = s_window[from++];
                          } while (--op);
                          from = _out - dist;
                          from_source = output;
                        }
                      }
                    } else {
                      from += wnext - op;
                      if (op < len) {
                        len -= op;
                        do {
                          output[_out++] = s_window[from++];
                        } while (--op);
                        from = _out - dist;
                        from_source = output;
                      }
                    }
                    while (len > 2) {
                      output[_out++] = from_source[from++];
                      output[_out++] = from_source[from++];
                      output[_out++] = from_source[from++];
                      len -= 3;
                    }
                    if (len) {
                      output[_out++] = from_source[from++];
                      if (len > 1) {
                        output[_out++] = from_source[from++];
                      }
                    }
                  } else {
                    from = _out - dist;
                    do {
                      output[_out++] = output[from++];
                      output[_out++] = output[from++];
                      output[_out++] = output[from++];
                      len -= 3;
                    } while (len > 2);
                    if (len) {
                      output[_out++] = output[from++];
                      if (len > 1) {
                        output[_out++] = output[from++];
                      }
                    }
                  }
                } else if ((op & 64) === 0) {
                  here = dcode[(here & 65535) + (hold & (1 << op) - 1)];
                  continue dodist;
                } else {
                  strm.msg = "invalid distance code";
                  state.mode = BAD$1;
                  break top;
                }
                break;
              }
          } else if ((op & 64) === 0) {
            here = lcode[(here & 65535) + (hold & (1 << op) - 1)];
            continue dolen;
          } else if (op & 32) {
            state.mode = TYPE$1;
            break top;
          } else {
            strm.msg = "invalid literal/length code";
            state.mode = BAD$1;
            break top;
          }
          break;
        }
    } while (_in < last && _out < end);
  len = bits >> 3;
  _in -= len;
  bits -= len << 3;
  hold &= (1 << bits) - 1;
  strm.next_in = _in;
  strm.next_out = _out;
  strm.avail_in = _in < last ? 5 + (last - _in) : 5 - (_in - last);
  strm.avail_out = _out < end ? 257 + (end - _out) : 257 - (_out - end);
  state.hold = hold;
  state.bits = bits;
  return;
};
const MAXBITS = 15;
const ENOUGH_LENS$1 = 852;
const ENOUGH_DISTS$1 = 592;
const CODES$1 = 0;
const LENS$1 = 1;
const DISTS$1 = 2;
const lbase = new Uint16Array([
  /* Length codes 257..285 base */
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  13,
  15,
  17,
  19,
  23,
  27,
  31,
  35,
  43,
  51,
  59,
  67,
  83,
  99,
  115,
  131,
  163,
  195,
  227,
  258,
  0,
  0
]);
const lext = new Uint8Array([
  /* Length codes 257..285 extra */
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  17,
  17,
  17,
  17,
  18,
  18,
  18,
  18,
  19,
  19,
  19,
  19,
  20,
  20,
  20,
  20,
  21,
  21,
  21,
  21,
  16,
  72,
  78
]);
const dbase = new Uint16Array([
  /* Distance codes 0..29 base */
  1,
  2,
  3,
  4,
  5,
  7,
  9,
  13,
  17,
  25,
  33,
  49,
  65,
  97,
  129,
  193,
  257,
  385,
  513,
  769,
  1025,
  1537,
  2049,
  3073,
  4097,
  6145,
  8193,
  12289,
  16385,
  24577,
  0,
  0
]);
const dext = new Uint8Array([
  /* Distance codes 0..29 extra */
  16,
  16,
  16,
  16,
  17,
  17,
  18,
  18,
  19,
  19,
  20,
  20,
  21,
  21,
  22,
  22,
  23,
  23,
  24,
  24,
  25,
  25,
  26,
  26,
  27,
  27,
  28,
  28,
  29,
  29,
  64,
  64
]);
const inflate_table = (type, lens, lens_index, codes, table, table_index, work, opts) => {
  const bits = opts.bits;
  let len = 0;
  let sym = 0;
  let min = 0, max = 0;
  let root = 0;
  let curr = 0;
  let drop = 0;
  let left = 0;
  let used = 0;
  let huff = 0;
  let incr;
  let fill;
  let low;
  let mask;
  let next;
  let base = null;
  let match;
  const count = new Uint16Array(MAXBITS + 1);
  const offs = new Uint16Array(MAXBITS + 1);
  let extra = null;
  let here_bits, here_op, here_val;
  for (len = 0; len <= MAXBITS; len++) {
    count[len] = 0;
  }
  for (sym = 0; sym < codes; sym++) {
    count[lens[lens_index + sym]]++;
  }
  root = bits;
  for (max = MAXBITS; max >= 1; max--) {
    if (count[max] !== 0) {
      break;
    }
  }
  if (root > max) {
    root = max;
  }
  if (max === 0) {
    table[table_index++] = 1 << 24 | 64 << 16 | 0;
    table[table_index++] = 1 << 24 | 64 << 16 | 0;
    opts.bits = 1;
    return 0;
  }
  for (min = 1; min < max; min++) {
    if (count[min] !== 0) {
      break;
    }
  }
  if (root < min) {
    root = min;
  }
  left = 1;
  for (len = 1; len <= MAXBITS; len++) {
    left <<= 1;
    left -= count[len];
    if (left < 0) {
      return -1;
    }
  }
  if (left > 0 && (type === CODES$1 || max !== 1)) {
    return -1;
  }
  offs[1] = 0;
  for (len = 1; len < MAXBITS; len++) {
    offs[len + 1] = offs[len] + count[len];
  }
  for (sym = 0; sym < codes; sym++) {
    if (lens[lens_index + sym] !== 0) {
      work[offs[lens[lens_index + sym]]++] = sym;
    }
  }
  if (type === CODES$1) {
    base = extra = work;
    match = 20;
  } else if (type === LENS$1) {
    base = lbase;
    extra = lext;
    match = 257;
  } else {
    base = dbase;
    extra = dext;
    match = 0;
  }
  huff = 0;
  sym = 0;
  len = min;
  next = table_index;
  curr = root;
  drop = 0;
  low = -1;
  used = 1 << root;
  mask = used - 1;
  if (type === LENS$1 && used > ENOUGH_LENS$1 || type === DISTS$1 && used > ENOUGH_DISTS$1) {
    return 1;
  }
  for (; ; ) {
    here_bits = len - drop;
    if (work[sym] + 1 < match) {
      here_op = 0;
      here_val = work[sym];
    } else if (work[sym] >= match) {
      here_op = extra[work[sym] - match];
      here_val = base[work[sym] - match];
    } else {
      here_op = 32 + 64;
      here_val = 0;
    }
    incr = 1 << len - drop;
    fill = 1 << curr;
    min = fill;
    do {
      fill -= incr;
      table[next + (huff >> drop) + fill] = here_bits << 24 | here_op << 16 | here_val | 0;
    } while (fill !== 0);
    incr = 1 << len - 1;
    while (huff & incr) {
      incr >>= 1;
    }
    if (incr !== 0) {
      huff &= incr - 1;
      huff += incr;
    } else {
      huff = 0;
    }
    sym++;
    if (--count[len] === 0) {
      if (len === max) {
        break;
      }
      len = lens[lens_index + work[sym]];
    }
    if (len > root && (huff & mask) !== low) {
      if (drop === 0) {
        drop = root;
      }
      next += min;
      curr = len - drop;
      left = 1 << curr;
      while (curr + drop < max) {
        left -= count[curr + drop];
        if (left <= 0) {
          break;
        }
        curr++;
        left <<= 1;
      }
      used += 1 << curr;
      if (type === LENS$1 && used > ENOUGH_LENS$1 || type === DISTS$1 && used > ENOUGH_DISTS$1) {
        return 1;
      }
      low = huff & mask;
      table[low] = root << 24 | curr << 16 | next - table_index | 0;
    }
  }
  if (huff !== 0) {
    table[next + huff] = len - drop << 24 | 64 << 16 | 0;
  }
  opts.bits = root;
  return 0;
};
var inftrees = inflate_table;
const CODES = 0;
const LENS = 1;
const DISTS = 2;
const {
  Z_FINISH: Z_FINISH$1,
  Z_BLOCK,
  Z_TREES,
  Z_OK: Z_OK$1,
  Z_STREAM_END: Z_STREAM_END$1,
  Z_NEED_DICT: Z_NEED_DICT$1,
  Z_STREAM_ERROR: Z_STREAM_ERROR$1,
  Z_DATA_ERROR: Z_DATA_ERROR$1,
  Z_MEM_ERROR: Z_MEM_ERROR$1,
  Z_BUF_ERROR,
  Z_DEFLATED
} = constants$2;
const HEAD = 16180;
const FLAGS = 16181;
const TIME = 16182;
const OS = 16183;
const EXLEN = 16184;
const EXTRA = 16185;
const NAME = 16186;
const COMMENT = 16187;
const HCRC = 16188;
const DICTID = 16189;
const DICT = 16190;
const TYPE = 16191;
const TYPEDO = 16192;
const STORED = 16193;
const COPY_ = 16194;
const COPY = 16195;
const TABLE = 16196;
const LENLENS = 16197;
const CODELENS = 16198;
const LEN_ = 16199;
const LEN = 16200;
const LENEXT = 16201;
const DIST = 16202;
const DISTEXT = 16203;
const MATCH = 16204;
const LIT = 16205;
const CHECK = 16206;
const LENGTH = 16207;
const DONE = 16208;
const BAD = 16209;
const MEM = 16210;
const SYNC = 16211;
const ENOUGH_LENS = 852;
const ENOUGH_DISTS = 592;
const MAX_WBITS = 15;
const DEF_WBITS = MAX_WBITS;
const zswap32 = (q2) => {
  return (q2 >>> 24 & 255) + (q2 >>> 8 & 65280) + ((q2 & 65280) << 8) + ((q2 & 255) << 24);
};
function InflateState() {
  this.strm = null;
  this.mode = 0;
  this.last = false;
  this.wrap = 0;
  this.havedict = false;
  this.flags = 0;
  this.dmax = 0;
  this.check = 0;
  this.total = 0;
  this.head = null;
  this.wbits = 0;
  this.wsize = 0;
  this.whave = 0;
  this.wnext = 0;
  this.window = null;
  this.hold = 0;
  this.bits = 0;
  this.length = 0;
  this.offset = 0;
  this.extra = 0;
  this.lencode = null;
  this.distcode = null;
  this.lenbits = 0;
  this.distbits = 0;
  this.ncode = 0;
  this.nlen = 0;
  this.ndist = 0;
  this.have = 0;
  this.next = null;
  this.lens = new Uint16Array(320);
  this.work = new Uint16Array(288);
  this.lendyn = null;
  this.distdyn = null;
  this.sane = 0;
  this.back = 0;
  this.was = 0;
}
const inflateStateCheck = (strm) => {
  if (!strm) {
    return 1;
  }
  const state = strm.state;
  if (!state || state.strm !== strm || state.mode < HEAD || state.mode > SYNC) {
    return 1;
  }
  return 0;
};
const inflateResetKeep = (strm) => {
  if (inflateStateCheck(strm)) {
    return Z_STREAM_ERROR$1;
  }
  const state = strm.state;
  strm.total_in = strm.total_out = state.total = 0;
  strm.msg = "";
  if (state.wrap) {
    strm.adler = state.wrap & 1;
  }
  state.mode = HEAD;
  state.last = 0;
  state.havedict = 0;
  state.flags = -1;
  state.dmax = 32768;
  state.head = null;
  state.hold = 0;
  state.bits = 0;
  state.lencode = state.lendyn = new Int32Array(ENOUGH_LENS);
  state.distcode = state.distdyn = new Int32Array(ENOUGH_DISTS);
  state.sane = 1;
  state.back = -1;
  return Z_OK$1;
};
const inflateReset = (strm) => {
  if (inflateStateCheck(strm)) {
    return Z_STREAM_ERROR$1;
  }
  const state = strm.state;
  state.wsize = 0;
  state.whave = 0;
  state.wnext = 0;
  return inflateResetKeep(strm);
};
const inflateReset2 = (strm, windowBits) => {
  let wrap;
  if (inflateStateCheck(strm)) {
    return Z_STREAM_ERROR$1;
  }
  const state = strm.state;
  if (windowBits < 0) {
    wrap = 0;
    windowBits = -windowBits;
  } else {
    wrap = (windowBits >> 4) + 5;
    if (windowBits < 48) {
      windowBits &= 15;
    }
  }
  if (windowBits && (windowBits < 8 || windowBits > 15)) {
    return Z_STREAM_ERROR$1;
  }
  if (state.window !== null && state.wbits !== windowBits) {
    state.window = null;
  }
  state.wrap = wrap;
  state.wbits = windowBits;
  return inflateReset(strm);
};
const inflateInit2 = (strm, windowBits) => {
  if (!strm) {
    return Z_STREAM_ERROR$1;
  }
  const state = new InflateState();
  strm.state = state;
  state.strm = strm;
  state.window = null;
  state.mode = HEAD;
  const ret = inflateReset2(strm, windowBits);
  if (ret !== Z_OK$1) {
    strm.state = null;
  }
  return ret;
};
const inflateInit = (strm) => {
  return inflateInit2(strm, DEF_WBITS);
};
let virgin = true;
let lenfix, distfix;
const fixedtables = (state) => {
  if (virgin) {
    lenfix = new Int32Array(512);
    distfix = new Int32Array(32);
    let sym = 0;
    while (sym < 144) {
      state.lens[sym++] = 8;
    }
    while (sym < 256) {
      state.lens[sym++] = 9;
    }
    while (sym < 280) {
      state.lens[sym++] = 7;
    }
    while (sym < 288) {
      state.lens[sym++] = 8;
    }
    inftrees(LENS, state.lens, 0, 288, lenfix, 0, state.work, { bits: 9 });
    sym = 0;
    while (sym < 32) {
      state.lens[sym++] = 5;
    }
    inftrees(DISTS, state.lens, 0, 32, distfix, 0, state.work, { bits: 5 });
    virgin = false;
  }
  state.lencode = lenfix;
  state.lenbits = 9;
  state.distcode = distfix;
  state.distbits = 5;
};
const updatewindow = (strm, src, end, copy) => {
  let dist;
  const state = strm.state;
  if (state.window === null) {
    state.wsize = 1 << state.wbits;
    state.wnext = 0;
    state.whave = 0;
    state.window = new Uint8Array(state.wsize);
  }
  if (copy >= state.wsize) {
    state.window.set(src.subarray(end - state.wsize, end), 0);
    state.wnext = 0;
    state.whave = state.wsize;
  } else {
    dist = state.wsize - state.wnext;
    if (dist > copy) {
      dist = copy;
    }
    state.window.set(src.subarray(end - copy, end - copy + dist), state.wnext);
    copy -= dist;
    if (copy) {
      state.window.set(src.subarray(end - copy, end), 0);
      state.wnext = copy;
      state.whave = state.wsize;
    } else {
      state.wnext += dist;
      if (state.wnext === state.wsize) {
        state.wnext = 0;
      }
      if (state.whave < state.wsize) {
        state.whave += dist;
      }
    }
  }
  return 0;
};
const inflate$2 = (strm, flush) => {
  let state;
  let input, output;
  let next;
  let put;
  let have, left;
  let hold;
  let bits;
  let _in, _out;
  let copy;
  let from;
  let from_source;
  let here = 0;
  let here_bits, here_op, here_val;
  let last_bits, last_op, last_val;
  let len;
  let ret;
  const hbuf = new Uint8Array(4);
  let opts;
  let n;
  const order = (
    /* permutation of code lengths */
    new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15])
  );
  if (inflateStateCheck(strm) || !strm.output || !strm.input && strm.avail_in !== 0) {
    return Z_STREAM_ERROR$1;
  }
  state = strm.state;
  if (state.mode === TYPE) {
    state.mode = TYPEDO;
  }
  put = strm.next_out;
  output = strm.output;
  left = strm.avail_out;
  next = strm.next_in;
  input = strm.input;
  have = strm.avail_in;
  hold = state.hold;
  bits = state.bits;
  _in = have;
  _out = left;
  ret = Z_OK$1;
  inf_leave:
    for (; ; ) {
      switch (state.mode) {
        case HEAD:
          if (state.wrap === 0) {
            state.mode = TYPEDO;
            break;
          }
          while (bits < 16) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          if (state.wrap & 2 && hold === 35615) {
            if (state.wbits === 0) {
              state.wbits = 15;
            }
            state.check = 0;
            hbuf[0] = hold & 255;
            hbuf[1] = hold >>> 8 & 255;
            state.check = crc32_1(state.check, hbuf, 2, 0);
            hold = 0;
            bits = 0;
            state.mode = FLAGS;
            break;
          }
          if (state.head) {
            state.head.done = false;
          }
          if (!(state.wrap & 1) || /* check if zlib header allowed */
          (((hold & 255) << 8) + (hold >> 8)) % 31) {
            strm.msg = "incorrect header check";
            state.mode = BAD;
            break;
          }
          if ((hold & 15) !== Z_DEFLATED) {
            strm.msg = "unknown compression method";
            state.mode = BAD;
            break;
          }
          hold >>>= 4;
          bits -= 4;
          len = (hold & 15) + 8;
          if (state.wbits === 0) {
            state.wbits = len;
          }
          if (len > 15 || len > state.wbits) {
            strm.msg = "invalid window size";
            state.mode = BAD;
            break;
          }
          state.dmax = 1 << state.wbits;
          state.flags = 0;
          strm.adler = state.check = 1;
          state.mode = hold & 512 ? DICTID : TYPE;
          hold = 0;
          bits = 0;
          break;
        case FLAGS:
          while (bits < 16) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          state.flags = hold;
          if ((state.flags & 255) !== Z_DEFLATED) {
            strm.msg = "unknown compression method";
            state.mode = BAD;
            break;
          }
          if (state.flags & 57344) {
            strm.msg = "unknown header flags set";
            state.mode = BAD;
            break;
          }
          if (state.head) {
            state.head.text = hold >> 8 & 1;
          }
          if (state.flags & 512 && state.wrap & 4) {
            hbuf[0] = hold & 255;
            hbuf[1] = hold >>> 8 & 255;
            state.check = crc32_1(state.check, hbuf, 2, 0);
          }
          hold = 0;
          bits = 0;
          state.mode = TIME;
        case TIME:
          while (bits < 32) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          if (state.head) {
            state.head.time = hold;
          }
          if (state.flags & 512 && state.wrap & 4) {
            hbuf[0] = hold & 255;
            hbuf[1] = hold >>> 8 & 255;
            hbuf[2] = hold >>> 16 & 255;
            hbuf[3] = hold >>> 24 & 255;
            state.check = crc32_1(state.check, hbuf, 4, 0);
          }
          hold = 0;
          bits = 0;
          state.mode = OS;
        case OS:
          while (bits < 16) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          if (state.head) {
            state.head.xflags = hold & 255;
            state.head.os = hold >> 8;
          }
          if (state.flags & 512 && state.wrap & 4) {
            hbuf[0] = hold & 255;
            hbuf[1] = hold >>> 8 & 255;
            state.check = crc32_1(state.check, hbuf, 2, 0);
          }
          hold = 0;
          bits = 0;
          state.mode = EXLEN;
        case EXLEN:
          if (state.flags & 1024) {
            while (bits < 16) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state.length = hold;
            if (state.head) {
              state.head.extra_len = hold;
            }
            if (state.flags & 512 && state.wrap & 4) {
              hbuf[0] = hold & 255;
              hbuf[1] = hold >>> 8 & 255;
              state.check = crc32_1(state.check, hbuf, 2, 0);
            }
            hold = 0;
            bits = 0;
          } else if (state.head) {
            state.head.extra = null;
          }
          state.mode = EXTRA;
        case EXTRA:
          if (state.flags & 1024) {
            copy = state.length;
            if (copy > have) {
              copy = have;
            }
            if (copy) {
              if (state.head) {
                len = state.head.extra_len - state.length;
                if (!state.head.extra) {
                  state.head.extra = new Uint8Array(state.head.extra_len);
                }
                state.head.extra.set(
                  input.subarray(
                    next,
                    // extra field is limited to 65536 bytes
                    // - no need for additional size check
                    next + copy
                  ),
                  /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
                  len
                );
              }
              if (state.flags & 512 && state.wrap & 4) {
                state.check = crc32_1(state.check, input, copy, next);
              }
              have -= copy;
              next += copy;
              state.length -= copy;
            }
            if (state.length) {
              break inf_leave;
            }
          }
          state.length = 0;
          state.mode = NAME;
        case NAME:
          if (state.flags & 2048) {
            if (have === 0) {
              break inf_leave;
            }
            copy = 0;
            do {
              len = input[next + copy++];
              if (state.head && len && state.length < 65536) {
                state.head.name += String.fromCharCode(len);
              }
            } while (len && copy < have);
            if (state.flags & 512 && state.wrap & 4) {
              state.check = crc32_1(state.check, input, copy, next);
            }
            have -= copy;
            next += copy;
            if (len) {
              break inf_leave;
            }
          } else if (state.head) {
            state.head.name = null;
          }
          state.length = 0;
          state.mode = COMMENT;
        case COMMENT:
          if (state.flags & 4096) {
            if (have === 0) {
              break inf_leave;
            }
            copy = 0;
            do {
              len = input[next + copy++];
              if (state.head && len && state.length < 65536) {
                state.head.comment += String.fromCharCode(len);
              }
            } while (len && copy < have);
            if (state.flags & 512 && state.wrap & 4) {
              state.check = crc32_1(state.check, input, copy, next);
            }
            have -= copy;
            next += copy;
            if (len) {
              break inf_leave;
            }
          } else if (state.head) {
            state.head.comment = null;
          }
          state.mode = HCRC;
        case HCRC:
          if (state.flags & 512) {
            while (bits < 16) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (state.wrap & 4 && hold !== (state.check & 65535)) {
              strm.msg = "header crc mismatch";
              state.mode = BAD;
              break;
            }
            hold = 0;
            bits = 0;
          }
          if (state.head) {
            state.head.hcrc = state.flags >> 9 & 1;
            state.head.done = true;
          }
          strm.adler = state.check = 0;
          state.mode = TYPE;
          break;
        case DICTID:
          while (bits < 32) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          strm.adler = state.check = zswap32(hold);
          hold = 0;
          bits = 0;
          state.mode = DICT;
        case DICT:
          if (state.havedict === 0) {
            strm.next_out = put;
            strm.avail_out = left;
            strm.next_in = next;
            strm.avail_in = have;
            state.hold = hold;
            state.bits = bits;
            return Z_NEED_DICT$1;
          }
          strm.adler = state.check = 1;
          state.mode = TYPE;
        case TYPE:
          if (flush === Z_BLOCK || flush === Z_TREES) {
            break inf_leave;
          }
        case TYPEDO:
          if (state.last) {
            hold >>>= bits & 7;
            bits -= bits & 7;
            state.mode = CHECK;
            break;
          }
          while (bits < 3) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          state.last = hold & 1;
          hold >>>= 1;
          bits -= 1;
          switch (hold & 3) {
            case 0:
              state.mode = STORED;
              break;
            case 1:
              fixedtables(state);
              state.mode = LEN_;
              if (flush === Z_TREES) {
                hold >>>= 2;
                bits -= 2;
                break inf_leave;
              }
              break;
            case 2:
              state.mode = TABLE;
              break;
            case 3:
              strm.msg = "invalid block type";
              state.mode = BAD;
          }
          hold >>>= 2;
          bits -= 2;
          break;
        case STORED:
          hold >>>= bits & 7;
          bits -= bits & 7;
          while (bits < 32) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          if ((hold & 65535) !== (hold >>> 16 ^ 65535)) {
            strm.msg = "invalid stored block lengths";
            state.mode = BAD;
            break;
          }
          state.length = hold & 65535;
          hold = 0;
          bits = 0;
          state.mode = COPY_;
          if (flush === Z_TREES) {
            break inf_leave;
          }
        case COPY_:
          state.mode = COPY;
        case COPY:
          copy = state.length;
          if (copy) {
            if (copy > have) {
              copy = have;
            }
            if (copy > left) {
              copy = left;
            }
            if (copy === 0) {
              break inf_leave;
            }
            output.set(input.subarray(next, next + copy), put);
            have -= copy;
            next += copy;
            left -= copy;
            put += copy;
            state.length -= copy;
            break;
          }
          state.mode = TYPE;
          break;
        case TABLE:
          while (bits < 14) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          state.nlen = (hold & 31) + 257;
          hold >>>= 5;
          bits -= 5;
          state.ndist = (hold & 31) + 1;
          hold >>>= 5;
          bits -= 5;
          state.ncode = (hold & 15) + 4;
          hold >>>= 4;
          bits -= 4;
          if (state.nlen > 286 || state.ndist > 30) {
            strm.msg = "too many length or distance symbols";
            state.mode = BAD;
            break;
          }
          state.have = 0;
          state.mode = LENLENS;
        case LENLENS:
          while (state.have < state.ncode) {
            while (bits < 3) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state.lens[order[state.have++]] = hold & 7;
            hold >>>= 3;
            bits -= 3;
          }
          while (state.have < 19) {
            state.lens[order[state.have++]] = 0;
          }
          state.lencode = state.lendyn;
          state.lenbits = 7;
          opts = { bits: state.lenbits };
          ret = inftrees(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
          state.lenbits = opts.bits;
          if (ret) {
            strm.msg = "invalid code lengths set";
            state.mode = BAD;
            break;
          }
          state.have = 0;
          state.mode = CODELENS;
        case CODELENS:
          while (state.have < state.nlen + state.ndist) {
            for (; ; ) {
              here = state.lencode[hold & (1 << state.lenbits) - 1];
              here_bits = here >>> 24;
              here_op = here >>> 16 & 255;
              here_val = here & 65535;
              if (here_bits <= bits) {
                break;
              }
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (here_val < 16) {
              hold >>>= here_bits;
              bits -= here_bits;
              state.lens[state.have++] = here_val;
            } else {
              if (here_val === 16) {
                n = here_bits + 2;
                while (bits < n) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                hold >>>= here_bits;
                bits -= here_bits;
                if (state.have === 0) {
                  strm.msg = "invalid bit length repeat";
                  state.mode = BAD;
                  break;
                }
                len = state.lens[state.have - 1];
                copy = 3 + (hold & 3);
                hold >>>= 2;
                bits -= 2;
              } else if (here_val === 17) {
                n = here_bits + 3;
                while (bits < n) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                hold >>>= here_bits;
                bits -= here_bits;
                len = 0;
                copy = 3 + (hold & 7);
                hold >>>= 3;
                bits -= 3;
              } else {
                n = here_bits + 7;
                while (bits < n) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                hold >>>= here_bits;
                bits -= here_bits;
                len = 0;
                copy = 11 + (hold & 127);
                hold >>>= 7;
                bits -= 7;
              }
              if (state.have + copy > state.nlen + state.ndist) {
                strm.msg = "invalid bit length repeat";
                state.mode = BAD;
                break;
              }
              while (copy--) {
                state.lens[state.have++] = len;
              }
            }
          }
          if (state.mode === BAD) {
            break;
          }
          if (state.lens[256] === 0) {
            strm.msg = "invalid code -- missing end-of-block";
            state.mode = BAD;
            break;
          }
          state.lenbits = 9;
          opts = { bits: state.lenbits };
          ret = inftrees(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
          state.lenbits = opts.bits;
          if (ret) {
            strm.msg = "invalid literal/lengths set";
            state.mode = BAD;
            break;
          }
          state.distbits = 6;
          state.distcode = state.distdyn;
          opts = { bits: state.distbits };
          ret = inftrees(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
          state.distbits = opts.bits;
          if (ret) {
            strm.msg = "invalid distances set";
            state.mode = BAD;
            break;
          }
          state.mode = LEN_;
          if (flush === Z_TREES) {
            break inf_leave;
          }
        case LEN_:
          state.mode = LEN;
        case LEN:
          if (have >= 6 && left >= 258) {
            strm.next_out = put;
            strm.avail_out = left;
            strm.next_in = next;
            strm.avail_in = have;
            state.hold = hold;
            state.bits = bits;
            inffast(strm, _out);
            put = strm.next_out;
            output = strm.output;
            left = strm.avail_out;
            next = strm.next_in;
            input = strm.input;
            have = strm.avail_in;
            hold = state.hold;
            bits = state.bits;
            if (state.mode === TYPE) {
              state.back = -1;
            }
            break;
          }
          state.back = 0;
          for (; ; ) {
            here = state.lencode[hold & (1 << state.lenbits) - 1];
            here_bits = here >>> 24;
            here_op = here >>> 16 & 255;
            here_val = here & 65535;
            if (here_bits <= bits) {
              break;
            }
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          if (here_op && (here_op & 240) === 0) {
            last_bits = here_bits;
            last_op = here_op;
            last_val = here_val;
            for (; ; ) {
              here = state.lencode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
              here_bits = here >>> 24;
              here_op = here >>> 16 & 255;
              here_val = here & 65535;
              if (last_bits + here_bits <= bits) {
                break;
              }
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            hold >>>= last_bits;
            bits -= last_bits;
            state.back += last_bits;
          }
          hold >>>= here_bits;
          bits -= here_bits;
          state.back += here_bits;
          state.length = here_val;
          if (here_op === 0) {
            state.mode = LIT;
            break;
          }
          if (here_op & 32) {
            state.back = -1;
            state.mode = TYPE;
            break;
          }
          if (here_op & 64) {
            strm.msg = "invalid literal/length code";
            state.mode = BAD;
            break;
          }
          state.extra = here_op & 15;
          state.mode = LENEXT;
        case LENEXT:
          if (state.extra) {
            n = state.extra;
            while (bits < n) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state.length += hold & (1 << state.extra) - 1;
            hold >>>= state.extra;
            bits -= state.extra;
            state.back += state.extra;
          }
          state.was = state.length;
          state.mode = DIST;
        case DIST:
          for (; ; ) {
            here = state.distcode[hold & (1 << state.distbits) - 1];
            here_bits = here >>> 24;
            here_op = here >>> 16 & 255;
            here_val = here & 65535;
            if (here_bits <= bits) {
              break;
            }
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          if ((here_op & 240) === 0) {
            last_bits = here_bits;
            last_op = here_op;
            last_val = here_val;
            for (; ; ) {
              here = state.distcode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
              here_bits = here >>> 24;
              here_op = here >>> 16 & 255;
              here_val = here & 65535;
              if (last_bits + here_bits <= bits) {
                break;
              }
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            hold >>>= last_bits;
            bits -= last_bits;
            state.back += last_bits;
          }
          hold >>>= here_bits;
          bits -= here_bits;
          state.back += here_bits;
          if (here_op & 64) {
            strm.msg = "invalid distance code";
            state.mode = BAD;
            break;
          }
          state.offset = here_val;
          state.extra = here_op & 15;
          state.mode = DISTEXT;
        case DISTEXT:
          if (state.extra) {
            n = state.extra;
            while (bits < n) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state.offset += hold & (1 << state.extra) - 1;
            hold >>>= state.extra;
            bits -= state.extra;
            state.back += state.extra;
          }
          if (state.offset > state.dmax) {
            strm.msg = "invalid distance too far back";
            state.mode = BAD;
            break;
          }
          state.mode = MATCH;
        case MATCH:
          if (left === 0) {
            break inf_leave;
          }
          copy = _out - left;
          if (state.offset > copy) {
            copy = state.offset - copy;
            if (copy > state.whave) {
              if (state.sane) {
                strm.msg = "invalid distance too far back";
                state.mode = BAD;
                break;
              }
            }
            if (copy > state.wnext) {
              copy -= state.wnext;
              from = state.wsize - copy;
            } else {
              from = state.wnext - copy;
            }
            if (copy > state.length) {
              copy = state.length;
            }
            from_source = state.window;
          } else {
            from_source = output;
            from = put - state.offset;
            copy = state.length;
          }
          if (copy > left) {
            copy = left;
          }
          left -= copy;
          state.length -= copy;
          do {
            output[put++] = from_source[from++];
          } while (--copy);
          if (state.length === 0) {
            state.mode = LEN;
          }
          break;
        case LIT:
          if (left === 0) {
            break inf_leave;
          }
          output[put++] = state.length;
          left--;
          state.mode = LEN;
          break;
        case CHECK:
          if (state.wrap) {
            while (bits < 32) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold |= input[next++] << bits;
              bits += 8;
            }
            _out -= left;
            strm.total_out += _out;
            state.total += _out;
            if (state.wrap & 4 && _out) {
              strm.adler = state.check = /*UPDATE_CHECK(state.check, put - _out, _out);*/
              state.flags ? crc32_1(state.check, output, _out, put - _out) : adler32_1(state.check, output, _out, put - _out);
            }
            _out = left;
            if (state.wrap & 4 && (state.flags ? hold : zswap32(hold)) !== state.check) {
              strm.msg = "incorrect data check";
              state.mode = BAD;
              break;
            }
            hold = 0;
            bits = 0;
          }
          state.mode = LENGTH;
        case LENGTH:
          if (state.wrap && state.flags) {
            while (bits < 32) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (state.wrap & 4 && hold !== (state.total & 4294967295)) {
              strm.msg = "incorrect length check";
              state.mode = BAD;
              break;
            }
            hold = 0;
            bits = 0;
          }
          state.mode = DONE;
        case DONE:
          ret = Z_STREAM_END$1;
          break inf_leave;
        case BAD:
          ret = Z_DATA_ERROR$1;
          break inf_leave;
        case MEM:
          return Z_MEM_ERROR$1;
        case SYNC:
        default:
          return Z_STREAM_ERROR$1;
      }
    }
  strm.next_out = put;
  strm.avail_out = left;
  strm.next_in = next;
  strm.avail_in = have;
  state.hold = hold;
  state.bits = bits;
  if (state.wsize || _out !== strm.avail_out && state.mode < BAD && (state.mode < CHECK || flush !== Z_FINISH$1)) {
    if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) ;
  }
  _in -= strm.avail_in;
  _out -= strm.avail_out;
  strm.total_in += _in;
  strm.total_out += _out;
  state.total += _out;
  if (state.wrap & 4 && _out) {
    strm.adler = state.check = /*UPDATE_CHECK(state.check, strm.next_out - _out, _out);*/
    state.flags ? crc32_1(state.check, output, _out, strm.next_out - _out) : adler32_1(state.check, output, _out, strm.next_out - _out);
  }
  strm.data_type = state.bits + (state.last ? 64 : 0) + (state.mode === TYPE ? 128 : 0) + (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
  if ((_in === 0 && _out === 0 || flush === Z_FINISH$1) && ret === Z_OK$1) {
    ret = Z_BUF_ERROR;
  }
  return ret;
};
const inflateEnd = (strm) => {
  if (inflateStateCheck(strm)) {
    return Z_STREAM_ERROR$1;
  }
  let state = strm.state;
  if (state.window) {
    state.window = null;
  }
  strm.state = null;
  return Z_OK$1;
};
const inflateGetHeader = (strm, head) => {
  if (inflateStateCheck(strm)) {
    return Z_STREAM_ERROR$1;
  }
  const state = strm.state;
  if ((state.wrap & 2) === 0) {
    return Z_STREAM_ERROR$1;
  }
  state.head = head;
  head.done = false;
  return Z_OK$1;
};
const inflateSetDictionary = (strm, dictionary) => {
  const dictLength = dictionary.length;
  let state;
  let dictid;
  let ret;
  if (inflateStateCheck(strm)) {
    return Z_STREAM_ERROR$1;
  }
  state = strm.state;
  if (state.wrap !== 0 && state.mode !== DICT) {
    return Z_STREAM_ERROR$1;
  }
  if (state.mode === DICT) {
    dictid = 1;
    dictid = adler32_1(dictid, dictionary, dictLength, 0);
    if (dictid !== state.check) {
      return Z_DATA_ERROR$1;
    }
  }
  ret = updatewindow(strm, dictionary, dictLength, dictLength);
  if (ret) {
    state.mode = MEM;
    return Z_MEM_ERROR$1;
  }
  state.havedict = 1;
  return Z_OK$1;
};
var inflateReset_1 = inflateReset;
var inflateReset2_1 = inflateReset2;
var inflateResetKeep_1 = inflateResetKeep;
var inflateInit_1 = inflateInit;
var inflateInit2_1 = inflateInit2;
var inflate_2$1 = inflate$2;
var inflateEnd_1 = inflateEnd;
var inflateGetHeader_1 = inflateGetHeader;
var inflateSetDictionary_1 = inflateSetDictionary;
var inflateInfo = "pako inflate (from Nodeca project)";
var inflate_1$2 = {
  inflateReset: inflateReset_1,
  inflateReset2: inflateReset2_1,
  inflateResetKeep: inflateResetKeep_1,
  inflateInit: inflateInit_1,
  inflateInit2: inflateInit2_1,
  inflate: inflate_2$1,
  inflateEnd: inflateEnd_1,
  inflateGetHeader: inflateGetHeader_1,
  inflateSetDictionary: inflateSetDictionary_1,
  inflateInfo
};
function GZheader() {
  this.text = 0;
  this.time = 0;
  this.xflags = 0;
  this.os = 0;
  this.extra = null;
  this.extra_len = 0;
  this.name = "";
  this.comment = "";
  this.hcrc = 0;
  this.done = false;
}
var gzheader = GZheader;
const toString = Object.prototype.toString;
const {
  Z_NO_FLUSH,
  Z_FINISH,
  Z_OK,
  Z_STREAM_END,
  Z_NEED_DICT,
  Z_STREAM_ERROR,
  Z_DATA_ERROR,
  Z_MEM_ERROR
} = constants$2;
function Inflate$1(options) {
  this.options = common.assign({
    chunkSize: 1024 * 64,
    windowBits: 15,
    to: ""
  }, options || {});
  const opt = this.options;
  if (opt.raw && opt.windowBits >= 0 && opt.windowBits < 16) {
    opt.windowBits = -opt.windowBits;
    if (opt.windowBits === 0) {
      opt.windowBits = -15;
    }
  }
  if (opt.windowBits >= 0 && opt.windowBits < 16 && !(options && options.windowBits)) {
    opt.windowBits += 32;
  }
  if (opt.windowBits > 15 && opt.windowBits < 48) {
    if ((opt.windowBits & 15) === 0) {
      opt.windowBits |= 15;
    }
  }
  this.err = 0;
  this.msg = "";
  this.ended = false;
  this.chunks = [];
  this.strm = new zstream();
  this.strm.avail_out = 0;
  let status = inflate_1$2.inflateInit2(
    this.strm,
    opt.windowBits
  );
  if (status !== Z_OK) {
    throw new Error(messages[status]);
  }
  this.header = new gzheader();
  inflate_1$2.inflateGetHeader(this.strm, this.header);
  if (opt.dictionary) {
    if (typeof opt.dictionary === "string") {
      opt.dictionary = strings.string2buf(opt.dictionary);
    } else if (toString.call(opt.dictionary) === "[object ArrayBuffer]") {
      opt.dictionary = new Uint8Array(opt.dictionary);
    }
    if (opt.raw) {
      status = inflate_1$2.inflateSetDictionary(this.strm, opt.dictionary);
      if (status !== Z_OK) {
        throw new Error(messages[status]);
      }
    }
  }
}
Inflate$1.prototype.push = function(data, flush_mode) {
  const strm = this.strm;
  const chunkSize = this.options.chunkSize;
  const dictionary = this.options.dictionary;
  let status, _flush_mode, last_avail_out;
  if (this.ended) return false;
  if (flush_mode === ~~flush_mode) _flush_mode = flush_mode;
  else _flush_mode = flush_mode === true ? Z_FINISH : Z_NO_FLUSH;
  if (toString.call(data) === "[object ArrayBuffer]") {
    strm.input = new Uint8Array(data);
  } else {
    strm.input = data;
  }
  strm.next_in = 0;
  strm.avail_in = strm.input.length;
  for (; ; ) {
    if (strm.avail_out === 0) {
      strm.output = new Uint8Array(chunkSize);
      strm.next_out = 0;
      strm.avail_out = chunkSize;
    }
    status = inflate_1$2.inflate(strm, _flush_mode);
    if (status === Z_NEED_DICT && dictionary) {
      status = inflate_1$2.inflateSetDictionary(strm, dictionary);
      if (status === Z_OK) {
        status = inflate_1$2.inflate(strm, _flush_mode);
      } else if (status === Z_DATA_ERROR) {
        status = Z_NEED_DICT;
      }
    }
    while (strm.avail_in > 0 && status === Z_STREAM_END && strm.state.wrap > 0 && data[strm.next_in] !== 0) {
      inflate_1$2.inflateReset(strm);
      status = inflate_1$2.inflate(strm, _flush_mode);
    }
    switch (status) {
      case Z_STREAM_ERROR:
      case Z_DATA_ERROR:
      case Z_NEED_DICT:
      case Z_MEM_ERROR:
        this.onEnd(status);
        this.ended = true;
        return false;
    }
    last_avail_out = strm.avail_out;
    if (strm.next_out) {
      if (strm.avail_out === 0 || status === Z_STREAM_END) {
        if (this.options.to === "string") {
          let next_out_utf8 = strings.utf8border(strm.output, strm.next_out);
          let tail = strm.next_out - next_out_utf8;
          let utf8str = strings.buf2string(strm.output, next_out_utf8);
          strm.next_out = tail;
          strm.avail_out = chunkSize - tail;
          if (tail) strm.output.set(strm.output.subarray(next_out_utf8, next_out_utf8 + tail), 0);
          this.onData(utf8str);
        } else {
          this.onData(strm.output.length === strm.next_out ? strm.output : strm.output.subarray(0, strm.next_out));
        }
      }
    }
    if (status === Z_OK && last_avail_out === 0) continue;
    if (status === Z_STREAM_END) {
      status = inflate_1$2.inflateEnd(this.strm);
      this.onEnd(status);
      this.ended = true;
      return true;
    }
    if (strm.avail_in === 0) break;
  }
  return true;
};
Inflate$1.prototype.onData = function(chunk) {
  this.chunks.push(chunk);
};
Inflate$1.prototype.onEnd = function(status) {
  if (status === Z_OK) {
    if (this.options.to === "string") {
      this.result = this.chunks.join("");
    } else {
      this.result = common.flattenChunks(this.chunks);
    }
  }
  this.chunks = [];
  this.err = status;
  this.msg = this.strm.msg;
};
function inflate$1(input, options) {
  const inflator = new Inflate$1(options);
  inflator.push(input);
  if (inflator.err) throw inflator.msg || messages[inflator.err];
  return inflator.result;
}
var Inflate_1$1 = Inflate$1;
var inflate_2 = inflate$1;
var inflate_1$1 = {
  Inflate: Inflate_1$1,
  inflate: inflate_2
};
const { Inflate, inflate } = inflate_1$1;
var Inflate_1 = Inflate;
var inflate_1 = inflate;
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c2 = n;
  for (let k2 = 0; k2 < 8; k2++) {
    if (c2 & 1) {
      c2 = 3988292384 ^ c2 >>> 1;
    } else {
      c2 = c2 >>> 1;
    }
  }
  crcTable[n] = c2;
}
const initialCrc = 4294967295;
function updateCrc(currentCrc, data, length) {
  let c2 = currentCrc;
  for (let n = 0; n < length; n++) {
    c2 = crcTable[(c2 ^ data[n]) & 255] ^ c2 >>> 8;
  }
  return c2;
}
function crc(data, length) {
  return (updateCrc(initialCrc, data, length) ^ initialCrc) >>> 0;
}
function checkCrc(buffer, crcLength, chunkName) {
  const expectedCrc = buffer.readUint32();
  const actualCrc = crc(new Uint8Array(buffer.buffer, buffer.byteOffset + buffer.offset - crcLength - 4, crcLength), crcLength);
  if (actualCrc !== expectedCrc) {
    throw new Error(`CRC mismatch for chunk ${chunkName}. Expected ${expectedCrc}, found ${actualCrc}`);
  }
}
function unfilterNone(currentLine, newLine, bytesPerLine) {
  for (let i2 = 0; i2 < bytesPerLine; i2++) {
    newLine[i2] = currentLine[i2];
  }
}
function unfilterSub(currentLine, newLine, bytesPerLine, bytesPerPixel) {
  let i2 = 0;
  for (; i2 < bytesPerPixel; i2++) {
    newLine[i2] = currentLine[i2];
  }
  for (; i2 < bytesPerLine; i2++) {
    newLine[i2] = currentLine[i2] + newLine[i2 - bytesPerPixel] & 255;
  }
}
function unfilterUp(currentLine, newLine, prevLine, bytesPerLine) {
  let i2 = 0;
  if (prevLine.length === 0) {
    for (; i2 < bytesPerLine; i2++) {
      newLine[i2] = currentLine[i2];
    }
  } else {
    for (; i2 < bytesPerLine; i2++) {
      newLine[i2] = currentLine[i2] + prevLine[i2] & 255;
    }
  }
}
function unfilterAverage(currentLine, newLine, prevLine, bytesPerLine, bytesPerPixel) {
  let i2 = 0;
  if (prevLine.length === 0) {
    for (; i2 < bytesPerPixel; i2++) {
      newLine[i2] = currentLine[i2];
    }
    for (; i2 < bytesPerLine; i2++) {
      newLine[i2] = currentLine[i2] + (newLine[i2 - bytesPerPixel] >> 1) & 255;
    }
  } else {
    for (; i2 < bytesPerPixel; i2++) {
      newLine[i2] = currentLine[i2] + (prevLine[i2] >> 1) & 255;
    }
    for (; i2 < bytesPerLine; i2++) {
      newLine[i2] = currentLine[i2] + (newLine[i2 - bytesPerPixel] + prevLine[i2] >> 1) & 255;
    }
  }
}
function unfilterPaeth(currentLine, newLine, prevLine, bytesPerLine, bytesPerPixel) {
  let i2 = 0;
  if (prevLine.length === 0) {
    for (; i2 < bytesPerPixel; i2++) {
      newLine[i2] = currentLine[i2];
    }
    for (; i2 < bytesPerLine; i2++) {
      newLine[i2] = currentLine[i2] + newLine[i2 - bytesPerPixel] & 255;
    }
  } else {
    for (; i2 < bytesPerPixel; i2++) {
      newLine[i2] = currentLine[i2] + prevLine[i2] & 255;
    }
    for (; i2 < bytesPerLine; i2++) {
      newLine[i2] = currentLine[i2] + paethPredictor(newLine[i2 - bytesPerPixel], prevLine[i2], prevLine[i2 - bytesPerPixel]) & 255;
    }
  }
}
function paethPredictor(a2, b2, c2) {
  const p2 = a2 + b2 - c2;
  const pa = Math.abs(p2 - a2);
  const pb = Math.abs(p2 - b2);
  const pc = Math.abs(p2 - c2);
  if (pa <= pb && pa <= pc)
    return a2;
  else if (pb <= pc)
    return b2;
  else
    return c2;
}
function applyUnfilter(filterType, currentLine, newLine, prevLine, passLineBytes, bytesPerPixel) {
  switch (filterType) {
    case 0:
      unfilterNone(currentLine, newLine, passLineBytes);
      break;
    case 1:
      unfilterSub(currentLine, newLine, passLineBytes, bytesPerPixel);
      break;
    case 2:
      unfilterUp(currentLine, newLine, prevLine, passLineBytes);
      break;
    case 3:
      unfilterAverage(currentLine, newLine, prevLine, passLineBytes, bytesPerPixel);
      break;
    case 4:
      unfilterPaeth(currentLine, newLine, prevLine, passLineBytes, bytesPerPixel);
      break;
    default:
      throw new Error(`Unsupported filter: ${filterType}`);
  }
}
const uint16$1 = new Uint16Array([255]);
const uint8$1 = new Uint8Array(uint16$1.buffer);
const osIsLittleEndian$1 = uint8$1[0] === 255;
function decodeInterlaceAdam7(params) {
  const { data, width, height, channels, depth } = params;
  const passes = [
    { x: 0, y: 0, xStep: 8, yStep: 8 },
    // Pass 1
    { x: 4, y: 0, xStep: 8, yStep: 8 },
    // Pass 2
    { x: 0, y: 4, xStep: 4, yStep: 8 },
    // Pass 3
    { x: 2, y: 0, xStep: 4, yStep: 4 },
    // Pass 4
    { x: 0, y: 2, xStep: 2, yStep: 4 },
    // Pass 5
    { x: 1, y: 0, xStep: 2, yStep: 2 },
    // Pass 6
    { x: 0, y: 1, xStep: 1, yStep: 2 }
    // Pass 7
  ];
  const bytesPerPixel = Math.ceil(depth / 8) * channels;
  const resultData = new Uint8Array(height * width * bytesPerPixel);
  let offset = 0;
  for (let passIndex = 0; passIndex < 7; passIndex++) {
    const pass = passes[passIndex];
    const passWidth = Math.ceil((width - pass.x) / pass.xStep);
    const passHeight = Math.ceil((height - pass.y) / pass.yStep);
    if (passWidth <= 0 || passHeight <= 0)
      continue;
    const passLineBytes = passWidth * bytesPerPixel;
    const prevLine = new Uint8Array(passLineBytes);
    for (let y2 = 0; y2 < passHeight; y2++) {
      const filterType = data[offset++];
      const currentLine = data.subarray(offset, offset + passLineBytes);
      offset += passLineBytes;
      const newLine = new Uint8Array(passLineBytes);
      applyUnfilter(filterType, currentLine, newLine, prevLine, passLineBytes, bytesPerPixel);
      prevLine.set(newLine);
      for (let x2 = 0; x2 < passWidth; x2++) {
        const outputX = pass.x + x2 * pass.xStep;
        const outputY = pass.y + y2 * pass.yStep;
        if (outputX >= width || outputY >= height)
          continue;
        for (let i2 = 0; i2 < bytesPerPixel; i2++) {
          resultData[(outputY * width + outputX) * bytesPerPixel + i2] = newLine[x2 * bytesPerPixel + i2];
        }
      }
    }
  }
  if (depth === 16) {
    const uint16Data = new Uint16Array(resultData.buffer);
    if (osIsLittleEndian$1) {
      for (let k2 = 0; k2 < uint16Data.length; k2++) {
        uint16Data[k2] = swap16$1(uint16Data[k2]);
      }
    }
    return uint16Data;
  } else {
    return resultData;
  }
}
function swap16$1(val) {
  return (val & 255) << 8 | val >> 8 & 255;
}
const uint16 = new Uint16Array([255]);
const uint8 = new Uint8Array(uint16.buffer);
const osIsLittleEndian = uint8[0] === 255;
const empty = new Uint8Array(0);
function decodeInterlaceNull(params) {
  const { data, width, height, channels, depth } = params;
  const bytesPerPixel = Math.ceil(depth / 8) * channels;
  const bytesPerLine = Math.ceil(depth / 8 * channels * width);
  const newData = new Uint8Array(height * bytesPerLine);
  let prevLine = empty;
  let offset = 0;
  let currentLine;
  let newLine;
  for (let i2 = 0; i2 < height; i2++) {
    currentLine = data.subarray(offset + 1, offset + 1 + bytesPerLine);
    newLine = newData.subarray(i2 * bytesPerLine, (i2 + 1) * bytesPerLine);
    switch (data[offset]) {
      case 0:
        unfilterNone(currentLine, newLine, bytesPerLine);
        break;
      case 1:
        unfilterSub(currentLine, newLine, bytesPerLine, bytesPerPixel);
        break;
      case 2:
        unfilterUp(currentLine, newLine, prevLine, bytesPerLine);
        break;
      case 3:
        unfilterAverage(currentLine, newLine, prevLine, bytesPerLine, bytesPerPixel);
        break;
      case 4:
        unfilterPaeth(currentLine, newLine, prevLine, bytesPerLine, bytesPerPixel);
        break;
      default:
        throw new Error(`Unsupported filter: ${data[offset]}`);
    }
    prevLine = newLine;
    offset += bytesPerLine + 1;
  }
  if (depth === 16) {
    const uint16Data = new Uint16Array(newData.buffer);
    if (osIsLittleEndian) {
      for (let k2 = 0; k2 < uint16Data.length; k2++) {
        uint16Data[k2] = swap16(uint16Data[k2]);
      }
    }
    return uint16Data;
  } else {
    return newData;
  }
}
function swap16(val) {
  return (val & 255) << 8 | val >> 8 & 255;
}
const pngSignature = Uint8Array.of(137, 80, 78, 71, 13, 10, 26, 10);
function checkSignature(buffer) {
  if (!hasPngSignature(buffer.readBytes(pngSignature.length))) {
    throw new Error("wrong PNG signature");
  }
}
function hasPngSignature(array) {
  if (array.length < pngSignature.length) {
    return false;
  }
  for (let i2 = 0; i2 < pngSignature.length; i2++) {
    if (array[i2] !== pngSignature[i2]) {
      return false;
    }
  }
  return true;
}
const textChunkName = "tEXt";
const NULL = 0;
const latin1Decoder = new TextDecoder("latin1");
function validateKeyword(keyword) {
  validateLatin1(keyword);
  if (keyword.length === 0 || keyword.length > 79) {
    throw new Error("keyword length must be between 1 and 79");
  }
}
const latin1Regex = /^[\u0000-\u00FF]*$/;
function validateLatin1(text) {
  if (!latin1Regex.test(text)) {
    throw new Error("invalid latin1 text");
  }
}
function decodetEXt(text, buffer, length) {
  const keyword = readKeyword(buffer);
  text[keyword] = readLatin1(buffer, length - keyword.length - 1);
}
function readKeyword(buffer) {
  buffer.mark();
  while (buffer.readByte() !== NULL) {
  }
  const end = buffer.offset;
  buffer.reset();
  const keyword = latin1Decoder.decode(buffer.readBytes(end - buffer.offset - 1));
  buffer.skip(1);
  validateKeyword(keyword);
  return keyword;
}
function readLatin1(buffer, length) {
  return latin1Decoder.decode(buffer.readBytes(length));
}
const ColorType = {
  UNKNOWN: -1,
  GREYSCALE: 0,
  TRUECOLOUR: 2,
  INDEXED_COLOUR: 3,
  GREYSCALE_ALPHA: 4,
  TRUECOLOUR_ALPHA: 6
};
const CompressionMethod = {
  UNKNOWN: -1,
  DEFLATE: 0
};
const FilterMethod = {
  UNKNOWN: -1,
  ADAPTIVE: 0
};
const InterlaceMethod = {
  UNKNOWN: -1,
  NO_INTERLACE: 0,
  ADAM7: 1
};
const DisposeOpType = {
  NONE: 0,
  BACKGROUND: 1,
  PREVIOUS: 2
};
const BlendOpType = {
  SOURCE: 0,
  OVER: 1
};
class PngDecoder extends IOBuffer {
  constructor(data, options = {}) {
    super(data);
    __publicField(this, "_checkCrc");
    __publicField(this, "_inflator");
    __publicField(this, "_png");
    __publicField(this, "_apng");
    __publicField(this, "_end");
    __publicField(this, "_hasPalette");
    __publicField(this, "_palette");
    __publicField(this, "_hasTransparency");
    __publicField(this, "_transparency");
    __publicField(this, "_compressionMethod");
    __publicField(this, "_filterMethod");
    __publicField(this, "_interlaceMethod");
    __publicField(this, "_colorType");
    __publicField(this, "_isAnimated");
    __publicField(this, "_numberOfFrames");
    __publicField(this, "_numberOfPlays");
    __publicField(this, "_frames");
    __publicField(this, "_writingDataChunks");
    const { checkCrc: checkCrc2 = false } = options;
    this._checkCrc = checkCrc2;
    this._inflator = new Inflate_1();
    this._png = {
      width: -1,
      height: -1,
      channels: -1,
      data: new Uint8Array(0),
      depth: 1,
      text: {}
    };
    this._apng = {
      width: -1,
      height: -1,
      channels: -1,
      depth: 1,
      numberOfFrames: 1,
      numberOfPlays: 0,
      text: {},
      frames: []
    };
    this._end = false;
    this._hasPalette = false;
    this._palette = [];
    this._hasTransparency = false;
    this._transparency = new Uint16Array(0);
    this._compressionMethod = CompressionMethod.UNKNOWN;
    this._filterMethod = FilterMethod.UNKNOWN;
    this._interlaceMethod = InterlaceMethod.UNKNOWN;
    this._colorType = ColorType.UNKNOWN;
    this._isAnimated = false;
    this._numberOfFrames = 1;
    this._numberOfPlays = 0;
    this._frames = [];
    this._writingDataChunks = false;
    this.setBigEndian();
  }
  decode() {
    checkSignature(this);
    while (!this._end) {
      const length = this.readUint32();
      const type = this.readChars(4);
      this.decodeChunk(length, type);
    }
    this.decodeImage();
    return this._png;
  }
  decodeApng() {
    checkSignature(this);
    while (!this._end) {
      const length = this.readUint32();
      const type = this.readChars(4);
      this.decodeApngChunk(length, type);
    }
    this.decodeApngImage();
    return this._apng;
  }
  // https://www.w3.org/TR/PNG/#5Chunk-layout
  decodeChunk(length, type) {
    const offset = this.offset;
    switch (type) {
      case "IHDR":
        this.decodeIHDR();
        break;
      case "PLTE":
        this.decodePLTE(length);
        break;
      case "IDAT":
        this.decodeIDAT(length);
        break;
      case "IEND":
        this._end = true;
        break;
      case "tRNS":
        this.decodetRNS(length);
        break;
      case "iCCP":
        this.decodeiCCP(length);
        break;
      case textChunkName:
        decodetEXt(this._png.text, this, length);
        break;
      case "pHYs":
        this.decodepHYs();
        break;
      default:
        this.skip(length);
        break;
    }
    if (this.offset - offset !== length) {
      throw new Error(`Length mismatch while decoding chunk ${type}`);
    }
    if (this._checkCrc) {
      checkCrc(this, length + 4, type);
    } else {
      this.skip(4);
    }
  }
  decodeApngChunk(length, type) {
    const offset = this.offset;
    if (type !== "fdAT" && type !== "IDAT" && this._writingDataChunks) {
      this.pushDataToFrame();
    }
    switch (type) {
      case "acTL":
        this.decodeACTL();
        break;
      case "fcTL":
        this.decodeFCTL();
        break;
      case "fdAT":
        this.decodeFDAT(length);
        break;
      default:
        this.decodeChunk(length, type);
        this.offset = offset + length;
        break;
    }
    if (this.offset - offset !== length) {
      throw new Error(`Length mismatch while decoding chunk ${type}`);
    }
    if (this._checkCrc) {
      checkCrc(this, length + 4, type);
    } else {
      this.skip(4);
    }
  }
  // https://www.w3.org/TR/PNG/#11IHDR
  decodeIHDR() {
    const image = this._png;
    image.width = this.readUint32();
    image.height = this.readUint32();
    image.depth = checkBitDepth(this.readUint8());
    const colorType = this.readUint8();
    this._colorType = colorType;
    let channels;
    switch (colorType) {
      case ColorType.GREYSCALE:
        channels = 1;
        break;
      case ColorType.TRUECOLOUR:
        channels = 3;
        break;
      case ColorType.INDEXED_COLOUR:
        channels = 1;
        break;
      case ColorType.GREYSCALE_ALPHA:
        channels = 2;
        break;
      case ColorType.TRUECOLOUR_ALPHA:
        channels = 4;
        break;
      case ColorType.UNKNOWN:
      default:
        throw new Error(`Unknown color type: ${colorType}`);
    }
    this._png.channels = channels;
    this._compressionMethod = this.readUint8();
    if (this._compressionMethod !== CompressionMethod.DEFLATE) {
      throw new Error(`Unsupported compression method: ${this._compressionMethod}`);
    }
    this._filterMethod = this.readUint8();
    this._interlaceMethod = this.readUint8();
  }
  decodeACTL() {
    this._numberOfFrames = this.readUint32();
    this._numberOfPlays = this.readUint32();
    this._isAnimated = true;
  }
  decodeFCTL() {
    const image = {
      sequenceNumber: this.readUint32(),
      width: this.readUint32(),
      height: this.readUint32(),
      xOffset: this.readUint32(),
      yOffset: this.readUint32(),
      delayNumber: this.readUint16(),
      delayDenominator: this.readUint16(),
      disposeOp: this.readUint8(),
      blendOp: this.readUint8(),
      data: new Uint8Array(0)
    };
    this._frames.push(image);
  }
  // https://www.w3.org/TR/PNG/#11PLTE
  decodePLTE(length) {
    if (length % 3 !== 0) {
      throw new RangeError(`PLTE field length must be a multiple of 3. Got ${length}`);
    }
    const l2 = length / 3;
    this._hasPalette = true;
    const palette = [];
    this._palette = palette;
    for (let i2 = 0; i2 < l2; i2++) {
      palette.push([this.readUint8(), this.readUint8(), this.readUint8()]);
    }
  }
  // https://www.w3.org/TR/PNG/#11IDAT
  decodeIDAT(length) {
    this._writingDataChunks = true;
    const dataLength = length;
    const dataOffset = this.offset + this.byteOffset;
    this._inflator.push(new Uint8Array(this.buffer, dataOffset, dataLength));
    if (this._inflator.err) {
      throw new Error(`Error while decompressing the data: ${this._inflator.err}`);
    }
    this.skip(length);
  }
  decodeFDAT(length) {
    this._writingDataChunks = true;
    let dataLength = length;
    let dataOffset = this.offset + this.byteOffset;
    dataOffset += 4;
    dataLength -= 4;
    this._inflator.push(new Uint8Array(this.buffer, dataOffset, dataLength));
    if (this._inflator.err) {
      throw new Error(`Error while decompressing the data: ${this._inflator.err}`);
    }
    this.skip(length);
  }
  // https://www.w3.org/TR/PNG/#11tRNS
  decodetRNS(length) {
    switch (this._colorType) {
      case ColorType.GREYSCALE:
      case ColorType.TRUECOLOUR: {
        if (length % 2 !== 0) {
          throw new RangeError(`tRNS chunk length must be a multiple of 2. Got ${length}`);
        }
        if (length / 2 > this._png.width * this._png.height) {
          throw new Error(`tRNS chunk contains more alpha values than there are pixels (${length / 2} vs ${this._png.width * this._png.height})`);
        }
        this._hasTransparency = true;
        this._transparency = new Uint16Array(length / 2);
        for (let i2 = 0; i2 < length / 2; i2++) {
          this._transparency[i2] = this.readUint16();
        }
        break;
      }
      case ColorType.INDEXED_COLOUR: {
        if (length > this._palette.length) {
          throw new Error(`tRNS chunk contains more alpha values than there are palette colors (${length} vs ${this._palette.length})`);
        }
        let i2 = 0;
        for (; i2 < length; i2++) {
          const alpha = this.readByte();
          this._palette[i2].push(alpha);
        }
        for (; i2 < this._palette.length; i2++) {
          this._palette[i2].push(255);
        }
        break;
      }
      case ColorType.UNKNOWN:
      case ColorType.GREYSCALE_ALPHA:
      case ColorType.TRUECOLOUR_ALPHA:
      default: {
        throw new Error(`tRNS chunk is not supported for color type ${this._colorType}`);
      }
    }
  }
  // https://www.w3.org/TR/PNG/#11iCCP
  decodeiCCP(length) {
    const name = readKeyword(this);
    const compressionMethod = this.readUint8();
    if (compressionMethod !== CompressionMethod.DEFLATE) {
      throw new Error(`Unsupported iCCP compression method: ${compressionMethod}`);
    }
    const compressedProfile = this.readBytes(length - name.length - 2);
    this._png.iccEmbeddedProfile = {
      name,
      profile: inflate_1(compressedProfile)
    };
  }
  // https://www.w3.org/TR/PNG/#11pHYs
  decodepHYs() {
    const ppuX = this.readUint32();
    const ppuY = this.readUint32();
    const unitSpecifier = this.readByte();
    this._png.resolution = { x: ppuX, y: ppuY, unit: unitSpecifier };
  }
  decodeApngImage() {
    this._apng.width = this._png.width;
    this._apng.height = this._png.height;
    this._apng.channels = this._png.channels;
    this._apng.depth = this._png.depth;
    this._apng.numberOfFrames = this._numberOfFrames;
    this._apng.numberOfPlays = this._numberOfPlays;
    this._apng.text = this._png.text;
    this._apng.resolution = this._png.resolution;
    for (let i2 = 0; i2 < this._numberOfFrames; i2++) {
      const newFrame = {
        sequenceNumber: this._frames[i2].sequenceNumber,
        delayNumber: this._frames[i2].delayNumber,
        delayDenominator: this._frames[i2].delayDenominator,
        data: this._apng.depth === 8 ? new Uint8Array(this._apng.width * this._apng.height * this._apng.channels) : new Uint16Array(this._apng.width * this._apng.height * this._apng.channels)
      };
      const frame = this._frames.at(i2);
      if (frame) {
        frame.data = decodeInterlaceNull({
          data: frame.data,
          width: frame.width,
          height: frame.height,
          channels: this._apng.channels,
          depth: this._apng.depth
        });
        if (this._hasPalette) {
          this._apng.palette = this._palette;
        }
        if (this._hasTransparency) {
          this._apng.transparency = this._transparency;
        }
        if (i2 === 0 || frame.xOffset === 0 && frame.yOffset === 0 && frame.width === this._png.width && frame.height === this._png.height) {
          newFrame.data = frame.data;
        } else {
          const prevFrame = this._apng.frames.at(i2 - 1);
          this.disposeFrame(frame, prevFrame, newFrame);
          this.addFrameDataToCanvas(newFrame, frame);
        }
        this._apng.frames.push(newFrame);
      }
    }
    return this._apng;
  }
  disposeFrame(frame, prevFrame, imageFrame) {
    switch (frame.disposeOp) {
      case DisposeOpType.NONE:
        break;
      case DisposeOpType.BACKGROUND:
        for (let row = 0; row < this._png.height; row++) {
          for (let col = 0; col < this._png.width; col++) {
            const index = (row * frame.width + col) * this._png.channels;
            for (let channel = 0; channel < this._png.channels; channel++) {
              imageFrame.data[index + channel] = 0;
            }
          }
        }
        break;
      case DisposeOpType.PREVIOUS:
        imageFrame.data.set(prevFrame.data);
        break;
      default:
        throw new Error("Unknown disposeOp");
    }
  }
  addFrameDataToCanvas(imageFrame, frame) {
    const maxValue = 1 << this._png.depth;
    const calculatePixelIndices = (row, col) => {
      const index = ((row + frame.yOffset) * this._png.width + frame.xOffset + col) * this._png.channels;
      const frameIndex = (row * frame.width + col) * this._png.channels;
      return { index, frameIndex };
    };
    switch (frame.blendOp) {
      case BlendOpType.SOURCE:
        for (let row = 0; row < frame.height; row++) {
          for (let col = 0; col < frame.width; col++) {
            const { index, frameIndex } = calculatePixelIndices(row, col);
            for (let channel = 0; channel < this._png.channels; channel++) {
              imageFrame.data[index + channel] = frame.data[frameIndex + channel];
            }
          }
        }
        break;
      case BlendOpType.OVER:
        for (let row = 0; row < frame.height; row++) {
          for (let col = 0; col < frame.width; col++) {
            const { index, frameIndex } = calculatePixelIndices(row, col);
            for (let channel = 0; channel < this._png.channels; channel++) {
              const sourceAlpha = frame.data[frameIndex + this._png.channels - 1] / maxValue;
              const foregroundValue = channel % (this._png.channels - 1) === 0 ? 1 : frame.data[frameIndex + channel];
              const value = Math.floor(sourceAlpha * foregroundValue + (1 - sourceAlpha) * imageFrame.data[index + channel]);
              imageFrame.data[index + channel] += value;
            }
          }
        }
        break;
      default:
        throw new Error("Unknown blendOp");
    }
  }
  decodeImage() {
    var _a2;
    if (this._inflator.err) {
      throw new Error(`Error while decompressing the data: ${this._inflator.err}`);
    }
    const data = this._isAnimated ? ((_a2 = this._frames) == null ? void 0 : _a2.at(0)).data : this._inflator.result;
    if (this._filterMethod !== FilterMethod.ADAPTIVE) {
      throw new Error(`Filter method ${this._filterMethod} not supported`);
    }
    if (this._interlaceMethod === InterlaceMethod.NO_INTERLACE) {
      this._png.data = decodeInterlaceNull({
        data,
        width: this._png.width,
        height: this._png.height,
        channels: this._png.channels,
        depth: this._png.depth
      });
    } else if (this._interlaceMethod === InterlaceMethod.ADAM7) {
      this._png.data = decodeInterlaceAdam7({
        data,
        width: this._png.width,
        height: this._png.height,
        channels: this._png.channels,
        depth: this._png.depth
      });
    } else {
      throw new Error(`Interlace method ${this._interlaceMethod} not supported`);
    }
    if (this._hasPalette) {
      this._png.palette = this._palette;
    }
    if (this._hasTransparency) {
      this._png.transparency = this._transparency;
    }
  }
  pushDataToFrame() {
    const result = this._inflator.result;
    const lastFrame = this._frames.at(-1);
    if (lastFrame) {
      lastFrame.data = result;
    } else {
      this._frames.push({
        sequenceNumber: 0,
        width: this._png.width,
        height: this._png.height,
        xOffset: 0,
        yOffset: 0,
        delayNumber: 0,
        delayDenominator: 0,
        disposeOp: DisposeOpType.NONE,
        blendOp: BlendOpType.SOURCE,
        data: result
      });
    }
    this._inflator = new Inflate_1();
    this._writingDataChunks = false;
  }
}
function checkBitDepth(value) {
  if (value !== 1 && value !== 2 && value !== 4 && value !== 8 && value !== 16) {
    throw new Error(`invalid bit depth: ${value}`);
  }
  return value;
}
var ResolutionUnitSpecifier;
(function(ResolutionUnitSpecifier2) {
  ResolutionUnitSpecifier2[ResolutionUnitSpecifier2["UNKNOWN"] = 0] = "UNKNOWN";
  ResolutionUnitSpecifier2[ResolutionUnitSpecifier2["METRE"] = 1] = "METRE";
})(ResolutionUnitSpecifier || (ResolutionUnitSpecifier = {}));
function decodePng(data, options) {
  const decoder = new PngDecoder(data, options);
  return decoder.decode();
}
var i = /* @__PURE__ */ function() {
  return "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this;
}();
function a() {
  i.console && "function" == typeof i.console.log && i.console.log.apply(i.console, arguments);
}
var o = { log: a, warn: function(t2) {
  i.console && ("function" == typeof i.console.warn ? i.console.warn.apply(i.console, arguments) : a.call(null, arguments));
}, error: function(t2) {
  i.console && ("function" == typeof i.console.error ? i.console.error.apply(i.console, arguments) : a(t2));
} };
function s(t2, e, n) {
  var r = new XMLHttpRequest();
  r.open("GET", t2), r.responseType = "blob", r.onload = function() {
    l(r.response, e, n);
  }, r.onerror = function() {
    o.error("could not download file");
  }, r.send();
}
function u(t2) {
  var e = new XMLHttpRequest();
  e.open("HEAD", t2, false);
  try {
    e.send();
  } catch (n) {
  }
  return e.status >= 200 && e.status <= 299;
}
function c(t2) {
  try {
    t2.dispatchEvent(new MouseEvent("click"));
  } catch (n) {
    var e = document.createEvent("MouseEvents");
    e.initMouseEvent("click", true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null), t2.dispatchEvent(e);
  }
}
var l = i.saveAs || ("object" !== ("undefined" == typeof window ? "undefined" : _typeof(window)) || window !== i ? function() {
} : "undefined" != typeof HTMLAnchorElement && "download" in HTMLAnchorElement.prototype ? function(t2, e, n) {
  var r = i.URL || i.webkitURL, a2 = document.createElement("a");
  e = e || t2.name || "download", a2.download = e, a2.rel = "noopener", "string" == typeof t2 ? (a2.href = t2, a2.origin !== location.origin ? u(a2.href) ? s(t2, e, n) : c(a2, a2.target = "_blank") : c(a2)) : (a2.href = r.createObjectURL(t2), setTimeout(function() {
    r.revokeObjectURL(a2.href);
  }, 4e4), setTimeout(function() {
    c(a2);
  }, 0));
} : "msSaveOrOpenBlob" in navigator ? function(e, n, r) {
  if (n = n || e.name || "download", "string" == typeof e) if (u(e)) s(e, n, r);
  else {
    var i2 = document.createElement("a");
    i2.href = e, i2.target = "_blank", setTimeout(function() {
      c(i2);
    });
  }
  else navigator.msSaveOrOpenBlob(function(e2, n2) {
    return void 0 === n2 ? n2 = { autoBom: false } : "object" !== _typeof(n2) && (o.warn("Deprecated: Expected third argument to be a object"), n2 = { autoBom: !n2 }), n2.autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e2.type) ? new Blob([String.fromCharCode(65279), e2], { type: e2.type }) : e2;
  }(e, r), n);
} : function(e, n, r, a2) {
  if ((a2 = a2 || open("", "_blank")) && (a2.document.title = a2.document.body.innerText = "downloading..."), "string" == typeof e) return s(e, n, r);
  var o2 = "application/octet-stream" === e.type, u2 = /constructor/i.test(i.HTMLElement) || i.safari, c2 = /CriOS\/[\d]+/.test(navigator.userAgent);
  if ((c2 || o2 && u2) && "object" === ("undefined" == typeof FileReader ? "undefined" : _typeof(FileReader))) {
    var l2 = new FileReader();
    l2.onloadend = function() {
      var t2 = l2.result;
      t2 = c2 ? t2 : t2.replace(/^data:[^;]*;/, "data:attachment/file;"), a2 ? a2.location.href = t2 : location = t2, a2 = null;
    }, l2.readAsDataURL(e);
  } else {
    var h2 = i.URL || i.webkitURL, f2 = h2.createObjectURL(e);
    a2 ? a2.location = f2 : location.href = f2, a2 = null, setTimeout(function() {
      h2.revokeObjectURL(f2);
    }, 4e4);
  }
});
/**
 * A class to parse color values
 * @author Stoyan Stefanov <sstoo@gmail.com>
 * {@link   http://www.phpied.com/rgb-color-parser-in-javascript/}
 * @license Use it if you like it
 */
function h(t2) {
  var e;
  t2 = t2 || "", this.ok = false, "#" == t2.charAt(0) && (t2 = t2.substr(1, 6)), t2 = { aliceblue: "f0f8ff", antiquewhite: "faebd7", aqua: "00ffff", aquamarine: "7fffd4", azure: "f0ffff", beige: "f5f5dc", bisque: "ffe4c4", black: "000000", blanchedalmond: "ffebcd", blue: "0000ff", blueviolet: "8a2be2", brown: "a52a2a", burlywood: "deb887", cadetblue: "5f9ea0", chartreuse: "7fff00", chocolate: "d2691e", coral: "ff7f50", cornflowerblue: "6495ed", cornsilk: "fff8dc", crimson: "dc143c", cyan: "00ffff", darkblue: "00008b", darkcyan: "008b8b", darkgoldenrod: "b8860b", darkgray: "a9a9a9", darkgreen: "006400", darkkhaki: "bdb76b", darkmagenta: "8b008b", darkolivegreen: "556b2f", darkorange: "ff8c00", darkorchid: "9932cc", darkred: "8b0000", darksalmon: "e9967a", darkseagreen: "8fbc8f", darkslateblue: "483d8b", darkslategray: "2f4f4f", darkturquoise: "00ced1", darkviolet: "9400d3", deeppink: "ff1493", deepskyblue: "00bfff", dimgray: "696969", dodgerblue: "1e90ff", feldspar: "d19275", firebrick: "b22222", floralwhite: "fffaf0", forestgreen: "228b22", fuchsia: "ff00ff", gainsboro: "dcdcdc", ghostwhite: "f8f8ff", gold: "ffd700", goldenrod: "daa520", gray: "808080", green: "008000", greenyellow: "adff2f", honeydew: "f0fff0", hotpink: "ff69b4", indianred: "cd5c5c", indigo: "4b0082", ivory: "fffff0", khaki: "f0e68c", lavender: "e6e6fa", lavenderblush: "fff0f5", lawngreen: "7cfc00", lemonchiffon: "fffacd", lightblue: "add8e6", lightcoral: "f08080", lightcyan: "e0ffff", lightgoldenrodyellow: "fafad2", lightgrey: "d3d3d3", lightgreen: "90ee90", lightpink: "ffb6c1", lightsalmon: "ffa07a", lightseagreen: "20b2aa", lightskyblue: "87cefa", lightslateblue: "8470ff", lightslategray: "778899", lightsteelblue: "b0c4de", lightyellow: "ffffe0", lime: "00ff00", limegreen: "32cd32", linen: "faf0e6", magenta: "ff00ff", maroon: "800000", mediumaquamarine: "66cdaa", mediumblue: "0000cd", mediumorchid: "ba55d3", mediumpurple: "9370d8", mediumseagreen: "3cb371", mediumslateblue: "7b68ee", mediumspringgreen: "00fa9a", mediumturquoise: "48d1cc", mediumvioletred: "c71585", midnightblue: "191970", mintcream: "f5fffa", mistyrose: "ffe4e1", moccasin: "ffe4b5", navajowhite: "ffdead", navy: "000080", oldlace: "fdf5e6", olive: "808000", olivedrab: "6b8e23", orange: "ffa500", orangered: "ff4500", orchid: "da70d6", palegoldenrod: "eee8aa", palegreen: "98fb98", paleturquoise: "afeeee", palevioletred: "d87093", papayawhip: "ffefd5", peachpuff: "ffdab9", peru: "cd853f", pink: "ffc0cb", plum: "dda0dd", powderblue: "b0e0e6", purple: "800080", red: "ff0000", rosybrown: "bc8f8f", royalblue: "4169e1", saddlebrown: "8b4513", salmon: "fa8072", sandybrown: "f4a460", seagreen: "2e8b57", seashell: "fff5ee", sienna: "a0522d", silver: "c0c0c0", skyblue: "87ceeb", slateblue: "6a5acd", slategray: "708090", snow: "fffafa", springgreen: "00ff7f", steelblue: "4682b4", tan: "d2b48c", teal: "008080", thistle: "d8bfd8", tomato: "ff6347", turquoise: "40e0d0", violet: "ee82ee", violetred: "d02090", wheat: "f5deb3", white: "ffffff", whitesmoke: "f5f5f5", yellow: "ffff00", yellowgreen: "9acd32" }[t2 = (t2 = t2.replace(/ /g, "")).toLowerCase()] || t2;
  for (var n = [{ re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/, example: ["rgb(123, 234, 45)", "rgb(255,234,245)"], process: function(t3) {
    return [parseInt(t3[1]), parseInt(t3[2]), parseInt(t3[3])];
  } }, { re: /^(\w{2})(\w{2})(\w{2})$/, example: ["#00ff00", "336699"], process: function(t3) {
    return [parseInt(t3[1], 16), parseInt(t3[2], 16), parseInt(t3[3], 16)];
  } }, { re: /^(\w{1})(\w{1})(\w{1})$/, example: ["#fb0", "f0f"], process: function(t3) {
    return [parseInt(t3[1] + t3[1], 16), parseInt(t3[2] + t3[2], 16), parseInt(t3[3] + t3[3], 16)];
  } }], r = 0; r < n.length; r++) {
    var i2 = n[r].re, a2 = n[r].process, o2 = i2.exec(t2);
    o2 && (e = a2(o2), this.r = e[0], this.g = e[1], this.b = e[2], this.ok = true);
  }
  this.r = this.r < 0 || isNaN(this.r) ? 0 : this.r > 255 ? 255 : this.r, this.g = this.g < 0 || isNaN(this.g) ? 0 : this.g > 255 ? 255 : this.g, this.b = this.b < 0 || isNaN(this.b) ? 0 : this.b > 255 ? 255 : this.b, this.toRGB = function() {
    return "rgb(" + this.r + ", " + this.g + ", " + this.b + ")";
  }, this.toHex = function() {
    var t3 = this.r.toString(16), e2 = this.g.toString(16), n2 = this.b.toString(16);
    return 1 == t3.length && (t3 = "0" + t3), 1 == e2.length && (e2 = "0" + e2), 1 == n2.length && (n2 = "0" + n2), "#" + t3 + e2 + n2;
  };
}
var f = i.atob.bind(i), d = i.btoa.bind(i);
/**
 * @license
 * Joseph Myers does not specify a particular license for his work.
 *
 * Author: Joseph Myers
 * Accessed from: http://www.myersdaily.org/joseph/javascript/md5.js
 *
 * Modified by: Owen Leong
 */
function p(t2, e) {
  var n = t2[0], r = t2[1], i2 = t2[2], a2 = t2[3];
  n = m(n, r, i2, a2, e[0], 7, -680876936), a2 = m(a2, n, r, i2, e[1], 12, -389564586), i2 = m(i2, a2, n, r, e[2], 17, 606105819), r = m(r, i2, a2, n, e[3], 22, -1044525330), n = m(n, r, i2, a2, e[4], 7, -176418897), a2 = m(a2, n, r, i2, e[5], 12, 1200080426), i2 = m(i2, a2, n, r, e[6], 17, -1473231341), r = m(r, i2, a2, n, e[7], 22, -45705983), n = m(n, r, i2, a2, e[8], 7, 1770035416), a2 = m(a2, n, r, i2, e[9], 12, -1958414417), i2 = m(i2, a2, n, r, e[10], 17, -42063), r = m(r, i2, a2, n, e[11], 22, -1990404162), n = m(n, r, i2, a2, e[12], 7, 1804603682), a2 = m(a2, n, r, i2, e[13], 12, -40341101), i2 = m(i2, a2, n, r, e[14], 17, -1502002290), n = v(n, r = m(r, i2, a2, n, e[15], 22, 1236535329), i2, a2, e[1], 5, -165796510), a2 = v(a2, n, r, i2, e[6], 9, -1069501632), i2 = v(i2, a2, n, r, e[11], 14, 643717713), r = v(r, i2, a2, n, e[0], 20, -373897302), n = v(n, r, i2, a2, e[5], 5, -701558691), a2 = v(a2, n, r, i2, e[10], 9, 38016083), i2 = v(i2, a2, n, r, e[15], 14, -660478335), r = v(r, i2, a2, n, e[4], 20, -405537848), n = v(n, r, i2, a2, e[9], 5, 568446438), a2 = v(a2, n, r, i2, e[14], 9, -1019803690), i2 = v(i2, a2, n, r, e[3], 14, -187363961), r = v(r, i2, a2, n, e[8], 20, 1163531501), n = v(n, r, i2, a2, e[13], 5, -1444681467), a2 = v(a2, n, r, i2, e[2], 9, -51403784), i2 = v(i2, a2, n, r, e[7], 14, 1735328473), n = b(n, r = v(r, i2, a2, n, e[12], 20, -1926607734), i2, a2, e[5], 4, -378558), a2 = b(a2, n, r, i2, e[8], 11, -2022574463), i2 = b(i2, a2, n, r, e[11], 16, 1839030562), r = b(r, i2, a2, n, e[14], 23, -35309556), n = b(n, r, i2, a2, e[1], 4, -1530992060), a2 = b(a2, n, r, i2, e[4], 11, 1272893353), i2 = b(i2, a2, n, r, e[7], 16, -155497632), r = b(r, i2, a2, n, e[10], 23, -1094730640), n = b(n, r, i2, a2, e[13], 4, 681279174), a2 = b(a2, n, r, i2, e[0], 11, -358537222), i2 = b(i2, a2, n, r, e[3], 16, -722521979), r = b(r, i2, a2, n, e[6], 23, 76029189), n = b(n, r, i2, a2, e[9], 4, -640364487), a2 = b(a2, n, r, i2, e[12], 11, -421815835), i2 = b(i2, a2, n, r, e[15], 16, 530742520), n = y(n, r = b(r, i2, a2, n, e[2], 23, -995338651), i2, a2, e[0], 6, -198630844), a2 = y(a2, n, r, i2, e[7], 10, 1126891415), i2 = y(i2, a2, n, r, e[14], 15, -1416354905), r = y(r, i2, a2, n, e[5], 21, -57434055), n = y(n, r, i2, a2, e[12], 6, 1700485571), a2 = y(a2, n, r, i2, e[3], 10, -1894986606), i2 = y(i2, a2, n, r, e[10], 15, -1051523), r = y(r, i2, a2, n, e[1], 21, -2054922799), n = y(n, r, i2, a2, e[8], 6, 1873313359), a2 = y(a2, n, r, i2, e[15], 10, -30611744), i2 = y(i2, a2, n, r, e[6], 15, -1560198380), r = y(r, i2, a2, n, e[13], 21, 1309151649), n = y(n, r, i2, a2, e[4], 6, -145523070), a2 = y(a2, n, r, i2, e[11], 10, -1120210379), i2 = y(i2, a2, n, r, e[2], 15, 718787259), r = y(r, i2, a2, n, e[9], 21, -343485551), t2[0] = P(n, t2[0]), t2[1] = P(r, t2[1]), t2[2] = P(i2, t2[2]), t2[3] = P(a2, t2[3]);
}
function g(t2, e, n, r, i2, a2) {
  return e = P(P(e, t2), P(r, a2)), P(e << i2 | e >>> 32 - i2, n);
}
function m(t2, e, n, r, i2, a2, o2) {
  return g(e & n | ~e & r, t2, e, i2, a2, o2);
}
function v(t2, e, n, r, i2, a2, o2) {
  return g(e & r | n & ~r, t2, e, i2, a2, o2);
}
function b(t2, e, n, r, i2, a2, o2) {
  return g(e ^ n ^ r, t2, e, i2, a2, o2);
}
function y(t2, e, n, r, i2, a2, o2) {
  return g(n ^ (e | ~r), t2, e, i2, a2, o2);
}
function w(t2) {
  var e, n = t2.length, r = [1732584193, -271733879, -1732584194, 271733878];
  for (e = 64; e <= t2.length; e += 64) p(r, N(t2.substring(e - 64, e)));
  t2 = t2.substring(e - 64);
  var i2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (e = 0; e < t2.length; e++) i2[e >> 2] |= t2.charCodeAt(e) << (e % 4 << 3);
  if (i2[e >> 2] |= 128 << (e % 4 << 3), e > 55) for (p(r, i2), e = 0; e < 16; e++) i2[e] = 0;
  return i2[14] = 8 * n, p(r, i2), r;
}
function N(t2) {
  var e, n = [];
  for (e = 0; e < 64; e += 4) n[e >> 2] = t2.charCodeAt(e) + (t2.charCodeAt(e + 1) << 8) + (t2.charCodeAt(e + 2) << 16) + (t2.charCodeAt(e + 3) << 24);
  return n;
}
var L = "0123456789abcdef".split("");
function x(t2) {
  for (var e = "", n = 0; n < 4; n++) e += L[t2 >> 8 * n + 4 & 15] + L[t2 >> 8 * n & 15];
  return e;
}
function A(t2) {
  return String.fromCharCode(255 & t2, (65280 & t2) >> 8, (16711680 & t2) >> 16, (4278190080 & t2) >> 24);
}
function S(t2) {
  return w(t2).map(A).join("");
}
var _ = "5d41402abc4b2a76b9719d911017c592" != function(t2) {
  for (var e = 0; e < t2.length; e++) t2[e] = x(t2[e]);
  return t2.join("");
}(w("hello"));
function P(t2, e) {
  if (_) {
    var n = (65535 & t2) + (65535 & e);
    return (t2 >> 16) + (e >> 16) + (n >> 16) << 16 | 65535 & n;
  }
  return t2 + e & 4294967295;
}
/**
 * @license
 * FPDF is released under a permissive license: there is no usage restriction.
 * You may embed it freely in your application (commercial or not), with or
 * without modifications.
 *
 * Reference: http://www.fpdf.org/en/script/script37.php
 */
function k(t2, e) {
  var n, r, i2, a2;
  if (t2 !== n) {
    for (var o2 = (i2 = t2, a2 = 1 + (256 / t2.length | 0), new Array(a2 + 1).join(i2)), s2 = [], u2 = 0; u2 < 256; u2++) s2[u2] = u2;
    var c2 = 0;
    for (u2 = 0; u2 < 256; u2++) {
      var l2 = s2[u2];
      c2 = (c2 + l2 + o2.charCodeAt(u2)) % 256, s2[u2] = s2[c2], s2[c2] = l2;
    }
    n = t2, r = s2;
  } else s2 = r;
  var h2 = e.length, f2 = 0, d2 = 0, p2 = "";
  for (u2 = 0; u2 < h2; u2++) d2 = (d2 + (l2 = s2[f2 = (f2 + 1) % 256])) % 256, s2[f2] = s2[d2], s2[d2] = l2, o2 = s2[(s2[f2] + s2[d2]) % 256], p2 += String.fromCharCode(e.charCodeAt(u2) ^ o2);
  return p2;
}
/**
 * @license
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 * Author: Owen Leong (@owenl131)
 * Date: 15 Oct 2020
 * References:
 * https://www.cs.cmu.edu/~dst/Adobe/Gallery/anon21jul01-pdf-encryption.txt
 * https://github.com/foliojs/pdfkit/blob/master/lib/security.js
 * http://www.fpdf.org/en/script/script37.php
 */
var F = { print: 4, modify: 8, copy: 16, "annot-forms": 32 };
function I(t2, e, n, r) {
  this.v = 1, this.r = 2;
  var i2 = 192;
  t2.forEach(function(t3) {
    if (void 0 !== F.perm) throw new Error("Invalid permission: " + t3);
    i2 += F[t3];
  }), this.padding = "(¿N^NuAd\0NVÿú\b..\0¶Ðh>/\f©þdSiz";
  var a2 = (e + this.padding).substr(0, 32), o2 = (n + this.padding).substr(0, 32);
  this.O = this.processOwnerPassword(a2, o2), this.P = -(1 + (255 ^ i2)), this.encryptionKey = S(a2 + this.O + this.lsbFirstWord(this.P) + this.hexToBytes(r)).substr(0, 5), this.U = k(this.encryptionKey, this.padding);
}
function j(t2) {
  if (/[^\u0000-\u00ff]/.test(t2)) throw new Error("Invalid PDF Name Object: " + t2 + ", Only accept ASCII characters.");
  for (var e = "", n = t2.length, r = 0; r < n; r++) {
    var i2 = t2.charCodeAt(r);
    e += i2 < 33 || 35 === i2 || 37 === i2 || 40 === i2 || 41 === i2 || 47 === i2 || 60 === i2 || 62 === i2 || 91 === i2 || 93 === i2 || 123 === i2 || 125 === i2 || i2 > 126 ? "#" + ("0" + i2.toString(16)).slice(-2) : t2[r];
  }
  return e;
}
function C(e) {
  if ("object" !== _typeof(e)) throw new Error("Invalid Context passed to initialize PubSub (jsPDF-module)");
  var n = {};
  this.subscribe = function(t2, e2, r) {
    if (r = r || false, "string" != typeof t2 || "function" != typeof e2 || "boolean" != typeof r) throw new Error("Invalid arguments passed to PubSub.subscribe (jsPDF-module)");
    n.hasOwnProperty(t2) || (n[t2] = {});
    var i2 = Math.random().toString(35);
    return n[t2][i2] = [e2, !!r], i2;
  }, this.unsubscribe = function(t2) {
    for (var e2 in n) if (n[e2][t2]) return delete n[e2][t2], 0 === Object.keys(n[e2]).length && delete n[e2], true;
    return false;
  }, this.publish = function(t2) {
    if (n.hasOwnProperty(t2)) {
      var r = Array.prototype.slice.call(arguments, 1), a2 = [];
      for (var s2 in n[t2]) {
        var u2 = n[t2][s2];
        try {
          u2[0].apply(e, r);
        } catch (c2) {
          i.console && o.error("jsPDF PubSub Error", c2.message, c2);
        }
        u2[1] && a2.push(s2);
      }
      a2.length && a2.forEach(this.unsubscribe);
    }
  }, this.getTopics = function() {
    return n;
  };
}
function O(t2) {
  if (!(this instanceof O)) return new O(t2);
  var e = "opacity,stroke-opacity".split(",");
  for (var n in t2) t2.hasOwnProperty(n) && e.indexOf(n) >= 0 && (this[n] = t2[n]);
  this.id = "", this.objectNumber = -1;
}
function B(t2, e) {
  this.gState = t2, this.matrix = e, this.id = "", this.objectNumber = -1;
}
function M(t2, e, n, r, i2) {
  if (!(this instanceof M)) return new M(t2, e, n, r, i2);
  this.type = "axial" === t2 ? 2 : 3, this.coords = e, this.colors = n, B.call(this, r, i2);
}
function q(t2, e, n, r, i2) {
  if (!(this instanceof q)) return new q(t2, e, n, r, i2);
  this.boundingBox = t2, this.xStep = e, this.yStep = n, this.stream = "", this.cloneIndex = 0, B.call(this, r, i2);
}
function E(e) {
  var n, r = "string" == typeof arguments[0] ? arguments[0] : "p", a2 = arguments[1], s2 = arguments[2], u2 = arguments[3], c2 = [], f2 = 1, p2 = 16, g2 = "S", m2 = null;
  "object" === _typeof(e = e || {}) && (r = e.orientation, a2 = e.unit || a2, s2 = e.format || s2, u2 = e.compress || e.compressPdf || u2, null !== (m2 = e.encryption || null) && (m2.userPassword = m2.userPassword || "", m2.ownerPassword = m2.ownerPassword || "", m2.userPermissions = m2.userPermissions || []), f2 = "number" == typeof e.userUnit ? Math.abs(e.userUnit) : 1, void 0 !== e.precision && (n = e.precision), void 0 !== e.floatPrecision && (p2 = e.floatPrecision), g2 = e.defaultPathOperation || "S"), c2 = e.filters || (true === u2 ? ["FlateEncode"] : c2), a2 = a2 || "mm", r = ("" + (r || "P")).toLowerCase();
  var v2 = e.putOnlyUsedFonts || false, b2 = {}, y2 = { internal: {}, __private__: {} };
  y2.__private__.PubSub = C;
  var w2 = "1.3", N2 = y2.__private__.getPdfVersion = function() {
    return w2;
  };
  y2.__private__.setPdfVersion = function(t2) {
    w2 = t2;
  };
  var L2 = { a0: [2383.94, 3370.39], a1: [1683.78, 2383.94], a2: [1190.55, 1683.78], a3: [841.89, 1190.55], a4: [595.28, 841.89], a5: [419.53, 595.28], a6: [297.64, 419.53], a7: [209.76, 297.64], a8: [147.4, 209.76], a9: [104.88, 147.4], a10: [73.7, 104.88], b0: [2834.65, 4008.19], b1: [2004.09, 2834.65], b2: [1417.32, 2004.09], b3: [1000.63, 1417.32], b4: [708.66, 1000.63], b5: [498.9, 708.66], b6: [354.33, 498.9], b7: [249.45, 354.33], b8: [175.75, 249.45], b9: [124.72, 175.75], b10: [87.87, 124.72], c0: [2599.37, 3676.54], c1: [1836.85, 2599.37], c2: [1298.27, 1836.85], c3: [918.43, 1298.27], c4: [649.13, 918.43], c5: [459.21, 649.13], c6: [323.15, 459.21], c7: [229.61, 323.15], c8: [161.57, 229.61], c9: [113.39, 161.57], c10: [79.37, 113.39], dl: [311.81, 623.62], letter: [612, 792], "government-letter": [576, 756], legal: [612, 1008], "junior-legal": [576, 360], ledger: [1224, 792], tabloid: [792, 1224], "credit-card": [153, 243] };
  y2.__private__.getPageFormats = function() {
    return L2;
  };
  var x2 = y2.__private__.getPageFormat = function(t2) {
    return L2[t2];
  };
  s2 = s2 || "a4";
  var A2 = "compat", S2 = "advanced", _2 = A2;
  function P2() {
    this.saveGraphicsState(), lt2(new Wt2(St, 0, 0, -St, 0, Ln() * St).toString() + " cm"), this.setFontSize(this.getFontSize() / St), g2 = "n", _2 = S2;
  }
  function k2() {
    this.restoreGraphicsState(), g2 = "S", _2 = A2;
  }
  var F2 = y2.__private__.combineFontStyleAndFontWeight = function(t2, e2) {
    if ("bold" == t2 && "normal" == e2 || "bold" == t2 && 400 == e2 || "normal" == t2 && "italic" == e2 || "bold" == t2 && "italic" == e2) throw new Error("Invalid Combination of fontweight and fontstyle");
    return e2 && (t2 = 400 == e2 || "normal" === e2 ? "italic" === t2 ? "italic" : "normal" : 700 != e2 && "bold" !== e2 || "normal" !== t2 ? (700 == e2 ? "bold" : e2) + "" + t2 : "bold"), t2;
  };
  y2.advancedAPI = function(t2) {
    var e2 = _2 === A2;
    return e2 && P2.call(this), "function" != typeof t2 || (t2(this), e2 && k2.call(this)), this;
  }, y2.compatAPI = function(t2) {
    var e2 = _2 === S2;
    return e2 && k2.call(this), "function" != typeof t2 || (t2(this), e2 && P2.call(this)), this;
  }, y2.isAdvancedAPI = function() {
    return _2 === S2;
  };
  var B2, R2 = function(t2) {
    if (_2 !== S2) throw new Error(t2 + " is only available in 'advanced' API mode. You need to call advancedAPI() first.");
  }, D2 = y2.roundToPrecision = y2.__private__.roundToPrecision = function(t2, e2) {
    var r2 = n || e2;
    if (isNaN(t2) || isNaN(r2)) throw new Error("Invalid argument passed to jsPDF.roundToPrecision");
    return t2.toFixed(r2).replace(/0+$/, "");
  };
  B2 = y2.hpf = y2.__private__.hpf = "number" == typeof p2 ? function(t2) {
    if (isNaN(t2)) throw new Error("Invalid argument passed to jsPDF.hpf");
    return D2(t2, p2);
  } : "smart" === p2 ? function(t2) {
    if (isNaN(t2)) throw new Error("Invalid argument passed to jsPDF.hpf");
    return D2(t2, t2 > -1 && t2 < 1 ? 16 : 5);
  } : function(t2) {
    if (isNaN(t2)) throw new Error("Invalid argument passed to jsPDF.hpf");
    return D2(t2, 16);
  };
  var T2 = y2.f2 = y2.__private__.f2 = function(t2) {
    if (isNaN(t2)) throw new Error("Invalid argument passed to jsPDF.f2");
    return D2(t2, 2);
  }, z2 = y2.__private__.f3 = function(t2) {
    if (isNaN(t2)) throw new Error("Invalid argument passed to jsPDF.f3");
    return D2(t2, 3);
  }, U2 = y2.scale = y2.__private__.scale = function(t2) {
    if (isNaN(t2)) throw new Error("Invalid argument passed to jsPDF.scale");
    return _2 === A2 ? t2 * St : _2 === S2 ? t2 : void 0;
  }, H2 = function(t2) {
    return U2(function(t3) {
      return _2 === A2 ? Ln() - t3 : _2 === S2 ? t3 : void 0;
    }(t2));
  };
  y2.__private__.setPrecision = y2.setPrecision = function(t2) {
    "number" == typeof parseInt(t2, 10) && (n = parseInt(t2, 10));
  };
  var W2, V2 = "00000000000000000000000000000000", G2 = y2.__private__.getFileId = function() {
    return V2;
  }, Y2 = y2.__private__.setFileId = function(t2) {
    return V2 = void 0 !== t2 && /^[a-fA-F0-9]{32}$/.test(t2) ? t2.toUpperCase() : V2.split("").map(function() {
      return "ABCDEF0123456789".charAt(Math.floor(16 * Math.random()));
    }).join(""), null !== m2 && (je2 = new I(m2.userPermissions, m2.userPassword, m2.ownerPassword, V2)), V2;
  };
  y2.setFileId = function(t2) {
    return Y2(t2), this;
  }, y2.getFileId = function() {
    return G2();
  };
  var J2 = y2.__private__.convertDateToPDFDate = function(t2) {
    var e2 = t2.getTimezoneOffset(), n2 = e2 < 0 ? "+" : "-", r2 = Math.floor(Math.abs(e2 / 60)), i2 = Math.abs(e2 % 60), a3 = [n2, Q2(r2), "'", Q2(i2), "'"].join("");
    return ["D:", t2.getFullYear(), Q2(t2.getMonth() + 1), Q2(t2.getDate()), Q2(t2.getHours()), Q2(t2.getMinutes()), Q2(t2.getSeconds()), a3].join("");
  }, X2 = y2.__private__.convertPDFDateToDate = function(t2) {
    var e2 = parseInt(t2.substr(2, 4), 10), n2 = parseInt(t2.substr(6, 2), 10) - 1, r2 = parseInt(t2.substr(8, 2), 10), i2 = parseInt(t2.substr(10, 2), 10), a3 = parseInt(t2.substr(12, 2), 10), o2 = parseInt(t2.substr(14, 2), 10);
    return new Date(e2, n2, r2, i2, a3, o2, 0);
  }, K2 = y2.__private__.setCreationDate = function(t2) {
    var e2;
    if (void 0 === t2 && (t2 = /* @__PURE__ */ new Date()), t2 instanceof Date) e2 = J2(t2);
    else {
      if (!/^D:(20[0-2][0-9]|203[0-7]|19[7-9][0-9])(0[0-9]|1[0-2])([0-2][0-9]|3[0-1])(0[0-9]|1[0-9]|2[0-3])(0[0-9]|[1-5][0-9])(0[0-9]|[1-5][0-9])(\+0[0-9]|\+1[0-4]|-0[0-9]|-1[0-1])'(0[0-9]|[1-5][0-9])'?$/.test(t2)) throw new Error("Invalid argument passed to jsPDF.setCreationDate");
      e2 = t2;
    }
    return W2 = e2;
  }, Z2 = y2.__private__.getCreationDate = function(t2) {
    var e2 = W2;
    return "jsDate" === t2 && (e2 = X2(W2)), e2;
  };
  y2.setCreationDate = function(t2) {
    return K2(t2), this;
  }, y2.getCreationDate = function(t2) {
    return Z2(t2);
  };
  var $2, Q2 = y2.__private__.padd2 = function(t2) {
    return ("0" + parseInt(t2)).slice(-2);
  }, tt2 = y2.__private__.padd2Hex = function(t2) {
    return ("00" + (t2 = t2.toString())).substr(t2.length);
  }, et2 = 0, nt2 = [], rt2 = [], it2 = 0, at2 = [], ot2 = [], st2 = false, ut2 = rt2;
  y2.__private__.setCustomOutputDestination = function(t2) {
    st2 = true, ut2 = t2;
  };
  var ct2 = function(t2) {
    st2 || (ut2 = t2);
  };
  y2.__private__.resetCustomOutputDestination = function() {
    st2 = false, ut2 = rt2;
  };
  var lt2 = y2.__private__.out = function(t2) {
    return t2 = t2.toString(), it2 += t2.length + 1, ut2.push(t2), ut2;
  }, ht2 = y2.__private__.write = function(t2) {
    return lt2(1 === arguments.length ? t2.toString() : Array.prototype.join.call(arguments, " "));
  }, ft2 = y2.__private__.getArrayBuffer = function(t2) {
    for (var e2 = t2.length, n2 = new ArrayBuffer(e2), r2 = new Uint8Array(n2); e2--; ) r2[e2] = t2.charCodeAt(e2);
    return n2;
  }, dt2 = [["Helvetica", "helvetica", "normal", "WinAnsiEncoding"], ["Helvetica-Bold", "helvetica", "bold", "WinAnsiEncoding"], ["Helvetica-Oblique", "helvetica", "italic", "WinAnsiEncoding"], ["Helvetica-BoldOblique", "helvetica", "bolditalic", "WinAnsiEncoding"], ["Courier", "courier", "normal", "WinAnsiEncoding"], ["Courier-Bold", "courier", "bold", "WinAnsiEncoding"], ["Courier-Oblique", "courier", "italic", "WinAnsiEncoding"], ["Courier-BoldOblique", "courier", "bolditalic", "WinAnsiEncoding"], ["Times-Roman", "times", "normal", "WinAnsiEncoding"], ["Times-Bold", "times", "bold", "WinAnsiEncoding"], ["Times-Italic", "times", "italic", "WinAnsiEncoding"], ["Times-BoldItalic", "times", "bolditalic", "WinAnsiEncoding"], ["ZapfDingbats", "zapfdingbats", "normal", null], ["Symbol", "symbol", "normal", null]];
  y2.__private__.getStandardFonts = function() {
    return dt2;
  };
  var pt2 = e.fontSize || 16;
  y2.__private__.setFontSize = y2.setFontSize = function(t2) {
    return pt2 = _2 === S2 ? t2 / St : t2, this;
  };
  var gt2, mt2 = y2.__private__.getFontSize = y2.getFontSize = function() {
    return _2 === A2 ? pt2 : pt2 * St;
  }, vt2 = e.R2L || false;
  y2.__private__.setR2L = y2.setR2L = function(t2) {
    return vt2 = t2, this;
  }, y2.__private__.getR2L = y2.getR2L = function() {
    return vt2;
  };
  var bt2, yt2 = y2.__private__.setZoomMode = function(t2) {
    if (/^(?:\d+\.\d*|\d*\.\d+|\d+)%$/.test(t2)) gt2 = t2;
    else if (isNaN(t2)) {
      if (-1 === [void 0, null, "fullwidth", "fullheight", "fullpage", "original"].indexOf(t2)) throw new Error('zoom must be Integer (e.g. 2), a percentage Value (e.g. 300%) or fullwidth, fullheight, fullpage, original. "' + t2 + '" is not recognized.');
      gt2 = t2;
    } else gt2 = parseInt(t2, 10);
  };
  y2.__private__.getZoomMode = function() {
    return gt2;
  };
  var wt2, Nt2 = y2.__private__.setPageMode = function(t2) {
    if (-1 == [void 0, null, "UseNone", "UseOutlines", "UseThumbs", "FullScreen"].indexOf(t2)) throw new Error('Page mode must be one of UseNone, UseOutlines, UseThumbs, or FullScreen. "' + t2 + '" is not recognized.');
    bt2 = t2;
  };
  y2.__private__.getPageMode = function() {
    return bt2;
  };
  var Lt2 = y2.__private__.setLayoutMode = function(t2) {
    if (-1 == [void 0, null, "continuous", "single", "twoleft", "tworight", "two"].indexOf(t2)) throw new Error('Layout mode must be one of continuous, single, twoleft, tworight. "' + t2 + '" is not recognized.');
    wt2 = t2;
  };
  y2.__private__.getLayoutMode = function() {
    return wt2;
  }, y2.__private__.setDisplayMode = y2.setDisplayMode = function(t2, e2, n2) {
    return yt2(t2), Lt2(e2), Nt2(n2), this;
  };
  var xt2 = { title: "", subject: "", author: "", keywords: "", creator: "" };
  y2.__private__.getDocumentProperty = function(t2) {
    if (-1 === Object.keys(xt2).indexOf(t2)) throw new Error("Invalid argument passed to jsPDF.getDocumentProperty");
    return xt2[t2];
  }, y2.__private__.getDocumentProperties = function() {
    return xt2;
  }, y2.__private__.setDocumentProperties = y2.setProperties = y2.setDocumentProperties = function(t2) {
    for (var e2 in xt2) xt2.hasOwnProperty(e2) && t2[e2] && (xt2[e2] = t2[e2]);
    return this;
  }, y2.__private__.setDocumentProperty = function(t2, e2) {
    if (-1 === Object.keys(xt2).indexOf(t2)) throw new Error("Invalid arguments passed to jsPDF.setDocumentProperty");
    return xt2[t2] = e2;
  };
  var At2, St, _t2, Pt2, kt2, Ft2 = {}, It2 = {}, jt2 = [], Ct2 = {}, Ot2 = {}, Bt2 = {}, Mt2 = {}, qt2 = null, Et2 = 0, Rt2 = [], Dt2 = new C(y2), Tt2 = e.hotfixes || [], zt2 = {}, Ut2 = {}, Ht2 = [], Wt2 = function t2(e2, n2, r2, i2, a3, o2) {
    if (!(this instanceof t2)) return new t2(e2, n2, r2, i2, a3, o2);
    isNaN(e2) && (e2 = 1), isNaN(n2) && (n2 = 0), isNaN(r2) && (r2 = 0), isNaN(i2) && (i2 = 1), isNaN(a3) && (a3 = 0), isNaN(o2) && (o2 = 0), this._matrix = [e2, n2, r2, i2, a3, o2];
  };
  Object.defineProperty(Wt2.prototype, "sx", { get: function() {
    return this._matrix[0];
  }, set: function(t2) {
    this._matrix[0] = t2;
  } }), Object.defineProperty(Wt2.prototype, "shy", { get: function() {
    return this._matrix[1];
  }, set: function(t2) {
    this._matrix[1] = t2;
  } }), Object.defineProperty(Wt2.prototype, "shx", { get: function() {
    return this._matrix[2];
  }, set: function(t2) {
    this._matrix[2] = t2;
  } }), Object.defineProperty(Wt2.prototype, "sy", { get: function() {
    return this._matrix[3];
  }, set: function(t2) {
    this._matrix[3] = t2;
  } }), Object.defineProperty(Wt2.prototype, "tx", { get: function() {
    return this._matrix[4];
  }, set: function(t2) {
    this._matrix[4] = t2;
  } }), Object.defineProperty(Wt2.prototype, "ty", { get: function() {
    return this._matrix[5];
  }, set: function(t2) {
    this._matrix[5] = t2;
  } }), Object.defineProperty(Wt2.prototype, "a", { get: function() {
    return this._matrix[0];
  }, set: function(t2) {
    this._matrix[0] = t2;
  } }), Object.defineProperty(Wt2.prototype, "b", { get: function() {
    return this._matrix[1];
  }, set: function(t2) {
    this._matrix[1] = t2;
  } }), Object.defineProperty(Wt2.prototype, "c", { get: function() {
    return this._matrix[2];
  }, set: function(t2) {
    this._matrix[2] = t2;
  } }), Object.defineProperty(Wt2.prototype, "d", { get: function() {
    return this._matrix[3];
  }, set: function(t2) {
    this._matrix[3] = t2;
  } }), Object.defineProperty(Wt2.prototype, "e", { get: function() {
    return this._matrix[4];
  }, set: function(t2) {
    this._matrix[4] = t2;
  } }), Object.defineProperty(Wt2.prototype, "f", { get: function() {
    return this._matrix[5];
  }, set: function(t2) {
    this._matrix[5] = t2;
  } }), Object.defineProperty(Wt2.prototype, "rotation", { get: function() {
    return Math.atan2(this.shx, this.sx);
  } }), Object.defineProperty(Wt2.prototype, "scaleX", { get: function() {
    return this.decompose().scale.sx;
  } }), Object.defineProperty(Wt2.prototype, "scaleY", { get: function() {
    return this.decompose().scale.sy;
  } }), Object.defineProperty(Wt2.prototype, "isIdentity", { get: function() {
    return 1 === this.sx && 0 === this.shy && 0 === this.shx && 1 === this.sy && 0 === this.tx && 0 === this.ty;
  } }), Wt2.prototype.join = function(t2) {
    return [this.sx, this.shy, this.shx, this.sy, this.tx, this.ty].map(B2).join(t2);
  }, Wt2.prototype.multiply = function(t2) {
    var e2 = t2.sx * this.sx + t2.shy * this.shx, n2 = t2.sx * this.shy + t2.shy * this.sy, r2 = t2.shx * this.sx + t2.sy * this.shx, i2 = t2.shx * this.shy + t2.sy * this.sy, a3 = t2.tx * this.sx + t2.ty * this.shx + this.tx, o2 = t2.tx * this.shy + t2.ty * this.sy + this.ty;
    return new Wt2(e2, n2, r2, i2, a3, o2);
  }, Wt2.prototype.decompose = function() {
    var t2 = this.sx, e2 = this.shy, n2 = this.shx, r2 = this.sy, i2 = this.tx, a3 = this.ty, o2 = Math.sqrt(t2 * t2 + e2 * e2), s3 = (t2 /= o2) * n2 + (e2 /= o2) * r2;
    n2 -= t2 * s3, r2 -= e2 * s3;
    var u3 = Math.sqrt(n2 * n2 + r2 * r2);
    return s3 /= u3, t2 * (r2 /= u3) < e2 * (n2 /= u3) && (t2 = -t2, e2 = -e2, s3 = -s3, o2 = -o2), { scale: new Wt2(o2, 0, 0, u3, 0, 0), translate: new Wt2(1, 0, 0, 1, i2, a3), rotate: new Wt2(t2, e2, -e2, t2, 0, 0), skew: new Wt2(1, 0, s3, 1, 0, 0) };
  }, Wt2.prototype.toString = function(t2) {
    return this.join(" ");
  }, Wt2.prototype.inversed = function() {
    var t2 = this.sx, e2 = this.shy, n2 = this.shx, r2 = this.sy, i2 = this.tx, a3 = this.ty, o2 = 1 / (t2 * r2 - e2 * n2), s3 = r2 * o2, u3 = -e2 * o2, c3 = -n2 * o2, l2 = t2 * o2;
    return new Wt2(s3, u3, c3, l2, -s3 * i2 - c3 * a3, -u3 * i2 - l2 * a3);
  }, Wt2.prototype.applyToPoint = function(t2) {
    var e2 = t2.x * this.sx + t2.y * this.shx + this.tx, n2 = t2.x * this.shy + t2.y * this.sy + this.ty;
    return new gn(e2, n2);
  }, Wt2.prototype.applyToRectangle = function(t2) {
    var e2 = this.applyToPoint(t2), n2 = this.applyToPoint(new gn(t2.x + t2.w, t2.y + t2.h));
    return new mn(e2.x, e2.y, n2.x - e2.x, n2.y - e2.y);
  }, Wt2.prototype.clone = function() {
    var t2 = this.sx, e2 = this.shy, n2 = this.shx, r2 = this.sy, i2 = this.tx, a3 = this.ty;
    return new Wt2(t2, e2, n2, r2, i2, a3);
  }, y2.Matrix = Wt2;
  var Vt2 = y2.matrixMult = function(t2, e2) {
    return e2.multiply(t2);
  }, Gt2 = new Wt2(1, 0, 0, 1, 0, 0);
  y2.unitMatrix = y2.identityMatrix = Gt2;
  var Yt2 = function(t2, e2) {
    if (!Ot2[t2]) {
      var n2 = (e2 instanceof M ? "Sh" : "P") + (Object.keys(Ct2).length + 1).toString(10);
      e2.id = n2, Ot2[t2] = n2, Ct2[n2] = e2, Dt2.publish("addPattern", e2);
    }
  };
  y2.ShadingPattern = M, y2.TilingPattern = q, y2.addShadingPattern = function(t2, e2) {
    return R2("addShadingPattern()"), Yt2(t2, e2), this;
  }, y2.beginTilingPattern = function(t2) {
    R2("beginTilingPattern()"), bn(t2.boundingBox[0], t2.boundingBox[1], t2.boundingBox[2] - t2.boundingBox[0], t2.boundingBox[3] - t2.boundingBox[1], t2.matrix);
  }, y2.endTilingPattern = function(t2, e2) {
    R2("endTilingPattern()"), e2.stream = ot2[$2].join("\n"), Yt2(t2, e2), Dt2.publish("endTilingPattern", e2), Ht2.pop().restore();
  };
  var Jt2, Xt2 = y2.__private__.newObject = function() {
    var t2 = Kt2();
    return Zt2(t2, true), t2;
  }, Kt2 = y2.__private__.newObjectDeferred = function() {
    return et2++, nt2[et2] = function() {
      return it2;
    }, et2;
  }, Zt2 = function(t2, e2) {
    return e2 = "boolean" == typeof e2 && e2, nt2[t2] = it2, e2 && lt2(t2 + " 0 obj"), t2;
  }, $t2 = y2.__private__.newAdditionalObject = function() {
    var t2 = { objId: Kt2(), content: "" };
    return at2.push(t2), t2;
  }, Qt2 = Kt2(), te2 = Kt2(), ee2 = y2.__private__.decodeColorString = function(t2) {
    var e2 = t2.split(" ");
    if (2 !== e2.length || "g" !== e2[1] && "G" !== e2[1]) 5 !== e2.length || "k" !== e2[4] && "K" !== e2[4] || (e2 = [(1 - e2[0]) * (1 - e2[3]), (1 - e2[1]) * (1 - e2[3]), (1 - e2[2]) * (1 - e2[3]), "r"]);
    else {
      var n2 = parseFloat(e2[0]);
      e2 = [n2, n2, n2, "r"];
    }
    for (var r2 = "#", i2 = 0; i2 < 3; i2++) r2 += ("0" + Math.floor(255 * parseFloat(e2[i2])).toString(16)).slice(-2);
    return r2;
  }, ne2 = y2.__private__.encodeColorString = function(e2) {
    var n2;
    "string" == typeof e2 && (e2 = { ch1: e2 });
    var r2 = e2.ch1, i2 = e2.ch2, a3 = e2.ch3, o2 = e2.ch4, s3 = "draw" === e2.pdfColorType ? ["G", "RG", "K"] : ["g", "rg", "k"];
    if ("string" == typeof r2 && "#" !== r2.charAt(0)) {
      var u3 = new h(r2);
      if (u3.ok) r2 = u3.toHex();
      else if (!/^\d*\.?\d*$/.test(r2)) throw new Error('Invalid color "' + r2 + '" passed to jsPDF.encodeColorString.');
    }
    if ("string" == typeof r2 && /^#[0-9A-Fa-f]{3}$/.test(r2) && (r2 = "#" + r2[1] + r2[1] + r2[2] + r2[2] + r2[3] + r2[3]), "string" == typeof r2 && /^#[0-9A-Fa-f]{6}$/.test(r2)) {
      var c3 = parseInt(r2.substr(1), 16);
      r2 = c3 >> 16 & 255, i2 = c3 >> 8 & 255, a3 = 255 & c3;
    }
    if (void 0 === i2 || void 0 === o2 && r2 === i2 && i2 === a3) n2 = "string" == typeof r2 ? r2 + " " + s3[0] : 2 === e2.precision ? T2(r2 / 255) + " " + s3[0] : z2(r2 / 255) + " " + s3[0];
    else if (void 0 === o2 || "object" === _typeof(o2)) {
      if (o2 && !isNaN(o2.a) && 0 === o2.a) return ["1.", "1.", "1.", s3[1]].join(" ");
      n2 = "string" == typeof r2 ? [r2, i2, a3, s3[1]].join(" ") : 2 === e2.precision ? [T2(r2 / 255), T2(i2 / 255), T2(a3 / 255), s3[1]].join(" ") : [z2(r2 / 255), z2(i2 / 255), z2(a3 / 255), s3[1]].join(" ");
    } else n2 = "string" == typeof r2 ? [r2, i2, a3, o2, s3[2]].join(" ") : 2 === e2.precision ? [T2(r2), T2(i2), T2(a3), T2(o2), s3[2]].join(" ") : [z2(r2), z2(i2), z2(a3), z2(o2), s3[2]].join(" ");
    return n2;
  }, re2 = y2.__private__.getFilters = function() {
    return c2;
  }, ie2 = y2.__private__.putStream = function(t2) {
    var e2 = (t2 = t2 || {}).data || "", n2 = t2.filters || re2(), r2 = t2.alreadyAppliedFilters || [], i2 = t2.addLength1 || false, a3 = e2.length, o2 = t2.objectId, s3 = function(t3) {
      return t3;
    };
    if (null !== m2 && void 0 === o2) throw new Error("ObjectId must be passed to putStream for file encryption");
    null !== m2 && (s3 = je2.encryptor(o2, 0));
    var u3 = {};
    true === n2 && (n2 = ["FlateEncode"]);
    var c3 = t2.additionalKeyValues || [], l2 = (u3 = void 0 !== E.API.processDataByFilters ? E.API.processDataByFilters(e2, n2) : { data: e2, reverseChain: [] }).reverseChain + (Array.isArray(r2) ? r2.join(" ") : r2.toString());
    if (0 !== u3.data.length && (c3.push({ key: "Length", value: u3.data.length }), true === i2 && c3.push({ key: "Length1", value: a3 })), 0 != l2.length) if (l2.split("/").length - 1 == 1) c3.push({ key: "Filter", value: l2 });
    else {
      c3.push({ key: "Filter", value: "[" + l2 + "]" });
      for (var h2 = 0; h2 < c3.length; h2 += 1) if ("DecodeParms" === c3[h2].key) {
        for (var f3 = [], d2 = 0; d2 < u3.reverseChain.split("/").length - 1; d2 += 1) f3.push("null");
        f3.push(c3[h2].value), c3[h2].value = "[" + f3.join(" ") + "]";
      }
    }
    lt2("<<");
    for (var p3 = 0; p3 < c3.length; p3++) lt2("/" + c3[p3].key + " " + c3[p3].value);
    lt2(">>"), 0 !== u3.data.length && (lt2("stream"), lt2(s3(u3.data)), lt2("endstream"));
  }, ae2 = y2.__private__.putPage = function(t2) {
    var e2 = t2.number, n2 = t2.data, r2 = t2.objId, i2 = t2.contentsObjId;
    Zt2(r2, true), lt2("<</Type /Page"), lt2("/Parent " + t2.rootDictionaryObjId + " 0 R"), lt2("/Resources " + t2.resourceDictionaryObjId + " 0 R"), lt2("/MediaBox [" + parseFloat(B2(t2.mediaBox.bottomLeftX)) + " " + parseFloat(B2(t2.mediaBox.bottomLeftY)) + " " + B2(t2.mediaBox.topRightX) + " " + B2(t2.mediaBox.topRightY) + "]"), null !== t2.cropBox && lt2("/CropBox [" + B2(t2.cropBox.bottomLeftX) + " " + B2(t2.cropBox.bottomLeftY) + " " + B2(t2.cropBox.topRightX) + " " + B2(t2.cropBox.topRightY) + "]"), null !== t2.bleedBox && lt2("/BleedBox [" + B2(t2.bleedBox.bottomLeftX) + " " + B2(t2.bleedBox.bottomLeftY) + " " + B2(t2.bleedBox.topRightX) + " " + B2(t2.bleedBox.topRightY) + "]"), null !== t2.trimBox && lt2("/TrimBox [" + B2(t2.trimBox.bottomLeftX) + " " + B2(t2.trimBox.bottomLeftY) + " " + B2(t2.trimBox.topRightX) + " " + B2(t2.trimBox.topRightY) + "]"), null !== t2.artBox && lt2("/ArtBox [" + B2(t2.artBox.bottomLeftX) + " " + B2(t2.artBox.bottomLeftY) + " " + B2(t2.artBox.topRightX) + " " + B2(t2.artBox.topRightY) + "]"), "number" == typeof t2.userUnit && 1 !== t2.userUnit && lt2("/UserUnit " + t2.userUnit), Dt2.publish("putPage", { objId: r2, pageContext: Rt2[e2], pageNumber: e2, page: n2 }), lt2("/Contents " + i2 + " 0 R"), lt2(">>"), lt2("endobj");
    var a3 = n2.join("\n");
    return _2 === S2 && (a3 += "\nQ"), Zt2(i2, true), ie2({ data: a3, filters: re2(), objectId: i2 }), lt2("endobj"), r2;
  }, oe2 = y2.__private__.putPages = function() {
    var t2, e2, n2 = [];
    for (t2 = 1; t2 <= Et2; t2++) Rt2[t2].objId = Kt2(), Rt2[t2].contentsObjId = Kt2();
    for (t2 = 1; t2 <= Et2; t2++) n2.push(ae2({ number: t2, data: ot2[t2], objId: Rt2[t2].objId, contentsObjId: Rt2[t2].contentsObjId, mediaBox: Rt2[t2].mediaBox, cropBox: Rt2[t2].cropBox, bleedBox: Rt2[t2].bleedBox, trimBox: Rt2[t2].trimBox, artBox: Rt2[t2].artBox, userUnit: Rt2[t2].userUnit, rootDictionaryObjId: Qt2, resourceDictionaryObjId: te2 }));
    Zt2(Qt2, true), lt2("<</Type /Pages");
    var r2 = "/Kids [";
    for (e2 = 0; e2 < Et2; e2++) r2 += n2[e2] + " 0 R ";
    lt2(r2 + "]"), lt2("/Count " + Et2), lt2(">>"), lt2("endobj"), Dt2.publish("postPutPages");
  }, se2 = function(t2) {
    Dt2.publish("putFont", { font: t2, out: lt2, newObject: Xt2, putStream: ie2 }), true !== t2.isAlreadyPutted && (t2.objectNumber = Xt2(), lt2("<<"), lt2("/Type /Font"), lt2("/BaseFont /" + j(t2.postScriptName)), lt2("/Subtype /Type1"), "string" == typeof t2.encoding && lt2("/Encoding /" + t2.encoding), lt2("/FirstChar 32"), lt2("/LastChar 255"), lt2(">>"), lt2("endobj"));
  }, ue2 = function(t2) {
    t2.objectNumber = Xt2();
    var e2 = [];
    e2.push({ key: "Type", value: "/XObject" }), e2.push({ key: "Subtype", value: "/Form" }), e2.push({ key: "BBox", value: "[" + [B2(t2.x), B2(t2.y), B2(t2.x + t2.width), B2(t2.y + t2.height)].join(" ") + "]" }), e2.push({ key: "Matrix", value: "[" + t2.matrix.toString() + "]" });
    var n2 = t2.pages[1].join("\n");
    ie2({ data: n2, additionalKeyValues: e2, objectId: t2.objectNumber }), lt2("endobj");
  }, ce2 = function(t2, e2) {
    e2 || (e2 = 21);
    var n2 = Xt2(), r2 = function(t3, e3) {
      var n3, r3 = [], i3 = 1 / (e3 - 1);
      for (n3 = 0; n3 < 1; n3 += i3) r3.push(n3);
      if (r3.push(1), 0 != t3[0].offset) {
        var a4 = { offset: 0, color: t3[0].color };
        t3.unshift(a4);
      }
      if (1 != t3[t3.length - 1].offset) {
        var o2 = { offset: 1, color: t3[t3.length - 1].color };
        t3.push(o2);
      }
      for (var s3 = "", u3 = 0, c3 = 0; c3 < r3.length; c3++) {
        for (n3 = r3[c3]; n3 > t3[u3 + 1].offset; ) u3++;
        var l2 = t3[u3].offset, h2 = (n3 - l2) / (t3[u3 + 1].offset - l2), f3 = t3[u3].color, d2 = t3[u3 + 1].color;
        s3 += tt2(Math.round((1 - h2) * f3[0] + h2 * d2[0]).toString(16)) + tt2(Math.round((1 - h2) * f3[1] + h2 * d2[1]).toString(16)) + tt2(Math.round((1 - h2) * f3[2] + h2 * d2[2]).toString(16));
      }
      return s3.trim();
    }(t2.colors, e2), i2 = [];
    i2.push({ key: "FunctionType", value: "0" }), i2.push({ key: "Domain", value: "[0.0 1.0]" }), i2.push({ key: "Size", value: "[" + e2 + "]" }), i2.push({ key: "BitsPerSample", value: "8" }), i2.push({ key: "Range", value: "[0.0 1.0 0.0 1.0 0.0 1.0]" }), i2.push({ key: "Decode", value: "[0.0 1.0 0.0 1.0 0.0 1.0]" }), ie2({ data: r2, additionalKeyValues: i2, alreadyAppliedFilters: ["/ASCIIHexDecode"], objectId: n2 }), lt2("endobj"), t2.objectNumber = Xt2(), lt2("<< /ShadingType " + t2.type), lt2("/ColorSpace /DeviceRGB");
    var a3 = "/Coords [" + B2(parseFloat(t2.coords[0])) + " " + B2(parseFloat(t2.coords[1])) + " ";
    2 === t2.type ? a3 += B2(parseFloat(t2.coords[2])) + " " + B2(parseFloat(t2.coords[3])) : a3 += B2(parseFloat(t2.coords[2])) + " " + B2(parseFloat(t2.coords[3])) + " " + B2(parseFloat(t2.coords[4])) + " " + B2(parseFloat(t2.coords[5])), lt2(a3 += "]"), t2.matrix && lt2("/Matrix [" + t2.matrix.toString() + "]"), lt2("/Function " + n2 + " 0 R"), lt2("/Extend [true true]"), lt2(">>"), lt2("endobj");
  }, le2 = function(t2, e2) {
    var n2 = Kt2(), r2 = Xt2();
    e2.push({ resourcesOid: n2, objectOid: r2 }), t2.objectNumber = r2;
    var i2 = [];
    i2.push({ key: "Type", value: "/Pattern" }), i2.push({ key: "PatternType", value: "1" }), i2.push({ key: "PaintType", value: "1" }), i2.push({ key: "TilingType", value: "1" }), i2.push({ key: "BBox", value: "[" + t2.boundingBox.map(B2).join(" ") + "]" }), i2.push({ key: "XStep", value: B2(t2.xStep) }), i2.push({ key: "YStep", value: B2(t2.yStep) }), i2.push({ key: "Resources", value: n2 + " 0 R" }), t2.matrix && i2.push({ key: "Matrix", value: "[" + t2.matrix.toString() + "]" }), ie2({ data: t2.stream, additionalKeyValues: i2, objectId: t2.objectNumber }), lt2("endobj");
  }, he2 = function(t2) {
    for (var e2 in t2.objectNumber = Xt2(), lt2("<<"), t2) switch (e2) {
      case "opacity":
        lt2("/ca " + T2(t2[e2]));
        break;
      case "stroke-opacity":
        lt2("/CA " + T2(t2[e2]));
    }
    lt2(">>"), lt2("endobj");
  }, fe2 = function(t2) {
    Zt2(t2.resourcesOid, true), lt2("<<"), lt2("/ProcSet [/PDF /Text /ImageB /ImageC /ImageI]"), function() {
      for (var t3 in lt2("/Font <<"), Ft2) Ft2.hasOwnProperty(t3) && (false === v2 || true === v2 && b2.hasOwnProperty(t3)) && lt2("/" + t3 + " " + Ft2[t3].objectNumber + " 0 R");
      lt2(">>");
    }(), function() {
      if (Object.keys(Ct2).length > 0) {
        for (var t3 in lt2("/Shading <<"), Ct2) Ct2.hasOwnProperty(t3) && Ct2[t3] instanceof M && Ct2[t3].objectNumber >= 0 && lt2("/" + t3 + " " + Ct2[t3].objectNumber + " 0 R");
        Dt2.publish("putShadingPatternDict"), lt2(">>");
      }
    }(), function(t3) {
      if (Object.keys(Ct2).length > 0) {
        for (var e2 in lt2("/Pattern <<"), Ct2) Ct2.hasOwnProperty(e2) && Ct2[e2] instanceof y2.TilingPattern && Ct2[e2].objectNumber >= 0 && Ct2[e2].objectNumber < t3 && lt2("/" + e2 + " " + Ct2[e2].objectNumber + " 0 R");
        Dt2.publish("putTilingPatternDict"), lt2(">>");
      }
    }(t2.objectOid), function() {
      if (Object.keys(Bt2).length > 0) {
        var t3;
        for (t3 in lt2("/ExtGState <<"), Bt2) Bt2.hasOwnProperty(t3) && Bt2[t3].objectNumber >= 0 && lt2("/" + t3 + " " + Bt2[t3].objectNumber + " 0 R");
        Dt2.publish("putGStateDict"), lt2(">>");
      }
    }(), function() {
      for (var t3 in lt2("/XObject <<"), zt2) zt2.hasOwnProperty(t3) && zt2[t3].objectNumber >= 0 && lt2("/" + t3 + " " + zt2[t3].objectNumber + " 0 R");
      Dt2.publish("putXobjectDict"), lt2(">>");
    }(), lt2(">>"), lt2("endobj");
  }, de2 = function(t2) {
    It2[t2.fontName] = It2[t2.fontName] || {}, It2[t2.fontName][t2.fontStyle] = t2.id;
  }, pe2 = function(t2, e2, n2, r2, i2) {
    var a3 = { id: "F" + (Object.keys(Ft2).length + 1).toString(10), postScriptName: t2, fontName: e2, fontStyle: n2, encoding: r2, isStandardFont: i2 || false, metadata: {} };
    return Dt2.publish("addFont", { font: a3, instance: this }), Ft2[a3.id] = a3, de2(a3), a3.id;
  }, ge2 = y2.__private__.pdfEscape = y2.pdfEscape = function(t2, e2) {
    return function(t3, e3) {
      var n2, r2, i2, a3, o2, s3, u3, c3, l2;
      if (i2 = (e3 = e3 || {}).sourceEncoding || "Unicode", o2 = e3.outputEncoding, (e3.autoencode || o2) && Ft2[At2].metadata && Ft2[At2].metadata[i2] && Ft2[At2].metadata[i2].encoding && (a3 = Ft2[At2].metadata[i2].encoding, !o2 && Ft2[At2].encoding && (o2 = Ft2[At2].encoding), !o2 && a3.codePages && (o2 = a3.codePages[0]), "string" == typeof o2 && (o2 = a3[o2]), o2)) {
        for (u3 = false, s3 = [], n2 = 0, r2 = t3.length; n2 < r2; n2++) (c3 = o2[t3.charCodeAt(n2)]) ? s3.push(String.fromCharCode(c3)) : s3.push(t3[n2]), s3[n2].charCodeAt(0) >> 8 && (u3 = true);
        t3 = s3.join("");
      }
      for (n2 = t3.length; void 0 === u3 && 0 !== n2; ) t3.charCodeAt(n2 - 1) >> 8 && (u3 = true), n2--;
      if (!u3) return t3;
      for (s3 = e3.noBOM ? [] : [254, 255], n2 = 0, r2 = t3.length; n2 < r2; n2++) {
        if ((l2 = (c3 = t3.charCodeAt(n2)) >> 8) >> 8) throw new Error("Character at position " + n2 + " of string '" + t3 + "' exceeds 16bits. Cannot be encoded into UCS-2 BE");
        s3.push(l2), s3.push(c3 - (l2 << 8));
      }
      return String.fromCharCode.apply(void 0, s3);
    }(t2, e2).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  }, me2 = y2.__private__.beginPage = function(t2) {
    ot2[++Et2] = [], Rt2[Et2] = { objId: 0, contentsObjId: 0, userUnit: Number(f2), artBox: null, bleedBox: null, cropBox: null, trimBox: null, mediaBox: { bottomLeftX: 0, bottomLeftY: 0, topRightX: Number(t2[0]), topRightY: Number(t2[1]) } }, ye2(Et2), ct2(ot2[$2]);
  }, ve2 = function(t2, e2) {
    var n2, i2, a3;
    switch (r = e2 || r, "string" == typeof t2 && (n2 = x2(t2.toLowerCase()), Array.isArray(n2) && (i2 = n2[0], a3 = n2[1])), Array.isArray(t2) && (i2 = t2[0] * St, a3 = t2[1] * St), isNaN(i2) && (i2 = s2[0], a3 = s2[1]), (i2 > 14400 || a3 > 14400) && (o.warn("A page in a PDF can not be wider or taller than 14400 userUnit. jsPDF limits the width/height to 14400"), i2 = Math.min(14400, i2), a3 = Math.min(14400, a3)), s2 = [i2, a3], r.substr(0, 1)) {
      case "l":
        a3 > i2 && (s2 = [a3, i2]);
        break;
      case "p":
        i2 > a3 && (s2 = [a3, i2]);
    }
    me2(s2), Ze(Xe), lt2(on), 0 !== fn && lt2(fn + " J"), 0 !== dn && lt2(dn + " j"), Dt2.publish("addPage", { pageNumber: Et2 });
  }, be2 = function(t2) {
    t2 > 0 && t2 <= Et2 && (ot2.splice(t2, 1), Rt2.splice(t2, 1), Et2--, $2 > Et2 && ($2 = Et2), this.setPage($2));
  }, ye2 = function(t2) {
    t2 > 0 && t2 <= Et2 && ($2 = t2);
  }, we2 = y2.__private__.getNumberOfPages = y2.getNumberOfPages = function() {
    return ot2.length - 1;
  }, Ne2 = function(t2, e2, n2) {
    var r2, i2 = void 0;
    return n2 = n2 || {}, t2 = void 0 !== t2 ? t2 : Ft2[At2].fontName, e2 = void 0 !== e2 ? e2 : Ft2[At2].fontStyle, r2 = t2.toLowerCase(), void 0 !== It2[r2] && void 0 !== It2[r2][e2] ? i2 = It2[r2][e2] : void 0 !== It2[t2] && void 0 !== It2[t2][e2] ? i2 = It2[t2][e2] : false === n2.disableWarning && o.warn("Unable to look up font label for font '" + t2 + "', '" + e2 + "'. Refer to getFontList() for available fonts."), i2 || n2.noFallback || null == (i2 = It2.times[e2]) && (i2 = It2.times.normal), i2;
  }, Le2 = y2.__private__.putInfo = function() {
    var t2 = Xt2(), e2 = function(t3) {
      return t3;
    };
    for (var n2 in null !== m2 && (e2 = je2.encryptor(t2, 0)), lt2("<<"), lt2("/Producer (" + ge2(e2("jsPDF " + E.version)) + ")"), xt2) xt2.hasOwnProperty(n2) && xt2[n2] && lt2("/" + n2.substr(0, 1).toUpperCase() + n2.substr(1) + " (" + ge2(e2(xt2[n2])) + ")");
    lt2("/CreationDate (" + ge2(e2(W2)) + ")"), lt2(">>"), lt2("endobj");
  }, xe2 = y2.__private__.putCatalog = function(t2) {
    var e2 = (t2 = t2 || {}).rootDictionaryObjId || Qt2;
    switch (Xt2(), lt2("<<"), lt2("/Type /Catalog"), lt2("/Pages " + e2 + " 0 R"), gt2 || (gt2 = "fullwidth"), gt2) {
      case "fullwidth":
        lt2("/OpenAction [3 0 R /FitH null]");
        break;
      case "fullheight":
        lt2("/OpenAction [3 0 R /FitV null]");
        break;
      case "fullpage":
        lt2("/OpenAction [3 0 R /Fit]");
        break;
      case "original":
        lt2("/OpenAction [3 0 R /XYZ null null 1]");
        break;
      default:
        var n2 = "" + gt2;
        "%" === n2.substr(n2.length - 1) && (gt2 = parseInt(gt2) / 100), "number" == typeof gt2 && lt2("/OpenAction [3 0 R /XYZ null null " + T2(gt2) + "]");
    }
    switch (wt2 || (wt2 = "continuous"), wt2) {
      case "continuous":
        lt2("/PageLayout /OneColumn");
        break;
      case "single":
        lt2("/PageLayout /SinglePage");
        break;
      case "two":
      case "twoleft":
        lt2("/PageLayout /TwoColumnLeft");
        break;
      case "tworight":
        lt2("/PageLayout /TwoColumnRight");
    }
    bt2 && lt2("/PageMode /" + bt2), Dt2.publish("putCatalog"), lt2(">>"), lt2("endobj");
  }, Ae2 = y2.__private__.putTrailer = function() {
    lt2("trailer"), lt2("<<"), lt2("/Size " + (et2 + 1)), lt2("/Root " + et2 + " 0 R"), lt2("/Info " + (et2 - 1) + " 0 R"), null !== m2 && lt2("/Encrypt " + je2.oid + " 0 R"), lt2("/ID [ <" + V2 + "> <" + V2 + "> ]"), lt2(">>");
  }, Se2 = y2.__private__.putHeader = function() {
    lt2("%PDF-" + w2), lt2("%ºß¬à");
  }, _e2 = y2.__private__.putXRef = function() {
    var t2 = "0000000000";
    lt2("xref"), lt2("0 " + (et2 + 1)), lt2("0000000000 65535 f ");
    for (var e2 = 1; e2 <= et2; e2++) "function" == typeof nt2[e2] ? lt2((t2 + nt2[e2]()).slice(-10) + " 00000 n ") : void 0 !== nt2[e2] ? lt2((t2 + nt2[e2]).slice(-10) + " 00000 n ") : lt2("0000000000 00000 n ");
  }, Pe2 = y2.__private__.buildDocument = function() {
    var t2;
    et2 = 0, it2 = 0, rt2 = [], nt2 = [], at2 = [], Qt2 = Kt2(), te2 = Kt2(), ct2(rt2), Dt2.publish("buildDocument"), Se2(), oe2(), function() {
      Dt2.publish("putAdditionalObjects");
      for (var t3 = 0; t3 < at2.length; t3++) {
        var e3 = at2[t3];
        Zt2(e3.objId, true), lt2(e3.content), lt2("endobj");
      }
      Dt2.publish("postPutAdditionalObjects");
    }(), t2 = [], function() {
      for (var t3 in Ft2) Ft2.hasOwnProperty(t3) && (false === v2 || true === v2 && b2.hasOwnProperty(t3)) && se2(Ft2[t3]);
    }(), function() {
      var t3;
      for (t3 in Bt2) Bt2.hasOwnProperty(t3) && he2(Bt2[t3]);
    }(), function() {
      for (var t3 in zt2) zt2.hasOwnProperty(t3) && ue2(zt2[t3]);
    }(), function(t3) {
      var e3;
      for (e3 in Ct2) Ct2.hasOwnProperty(e3) && (Ct2[e3] instanceof M ? ce2(Ct2[e3]) : Ct2[e3] instanceof q && le2(Ct2[e3], t3));
    }(t2), Dt2.publish("putResources"), t2.forEach(fe2), fe2({ resourcesOid: te2, objectOid: Number.MAX_SAFE_INTEGER }), Dt2.publish("postPutResources"), null !== m2 && (je2.oid = Xt2(), lt2("<<"), lt2("/Filter /Standard"), lt2("/V " + je2.v), lt2("/R " + je2.r), lt2("/U <" + je2.toHexString(je2.U) + ">"), lt2("/O <" + je2.toHexString(je2.O) + ">"), lt2("/P " + je2.P), lt2(">>"), lt2("endobj")), Le2(), xe2();
    var e2 = it2;
    return _e2(), Ae2(), lt2("startxref"), lt2("" + e2), lt2("%%EOF"), ct2(ot2[$2]), rt2.join("\n");
  }, ke2 = y2.__private__.getBlob = function(t2) {
    return new Blob([ft2(t2)], { type: "application/pdf" });
  }, Fe2 = y2.output = y2.__private__.output = (Jt2 = function(t2, e2) {
    switch ("string" == typeof (e2 = e2 || {}) ? e2 = { filename: e2 } : e2.filename = e2.filename || "generated.pdf", t2) {
      case void 0:
        return Pe2();
      case "save":
        y2.save(e2.filename);
        break;
      case "arraybuffer":
        return ft2(Pe2());
      case "blob":
        return ke2(Pe2());
      case "bloburi":
      case "bloburl":
        if (void 0 !== i.URL && "function" == typeof i.URL.createObjectURL) return i.URL && i.URL.createObjectURL(ke2(Pe2())) || void 0;
        o.warn("bloburl is not supported by your system, because URL.createObjectURL is not supported by your browser.");
        break;
      case "datauristring":
      case "dataurlstring":
        var n2 = "", r2 = Pe2();
        try {
          n2 = d(r2);
        } catch (m3) {
          n2 = d(unescape(encodeURIComponent(r2)));
        }
        return "data:application/pdf;filename=" + e2.filename + ";base64," + n2;
      case "pdfobjectnewwindow":
        if ("[object Window]" === Object.prototype.toString.call(i)) {
          var a3 = "https://cdnjs.cloudflare.com/ajax/libs/pdfobject/2.1.1/pdfobject.min.js", s3 = ' integrity="sha512-4ze/a9/4jqu+tX9dfOqJYSvyYd5M6qum/3HpCLr+/Jqf0whc37VUbkpNGHR7/8pSnCFw47T1fmIpwBV7UySh3g==" crossorigin="anonymous"';
          e2.pdfObjectUrl && (a3 = e2.pdfObjectUrl, s3 = "");
          var u3 = '<html><style>html, body { padding: 0; margin: 0; } iframe { width: 100%; height: 100%; border: 0;}  </style><body><script src="' + a3 + '"' + s3 + '><\/script><script >PDFObject.embed("' + this.output("dataurlstring") + '", ' + JSON.stringify(e2) + ");<\/script></body></html>", c3 = i.open();
          return null !== c3 && c3.document.write(u3), c3;
        }
        throw new Error("The option pdfobjectnewwindow just works in a browser-environment.");
      case "pdfjsnewwindow":
        if ("[object Window]" === Object.prototype.toString.call(i)) {
          var l2 = '<html><style>html, body { padding: 0; margin: 0; } iframe { width: 100%; height: 100%; border: 0;}  </style><body><iframe id="pdfViewer" src="' + (e2.pdfJsUrl || "examples/PDF.js/web/viewer.html") + "?file=&downloadName=" + e2.filename + '" width="500px" height="400px" /></body></html>', h2 = i.open();
          if (null !== h2) {
            h2.document.write(l2);
            var f3 = this;
            h2.document.documentElement.querySelector("#pdfViewer").onload = function() {
              h2.document.title = e2.filename, h2.document.documentElement.querySelector("#pdfViewer").contentWindow.PDFViewerApplication.open(f3.output("bloburl"));
            };
          }
          return h2;
        }
        throw new Error("The option pdfjsnewwindow just works in a browser-environment.");
      case "dataurlnewwindow":
        if ("[object Window]" !== Object.prototype.toString.call(i)) throw new Error("The option dataurlnewwindow just works in a browser-environment.");
        var p3 = '<html><style>html, body { padding: 0; margin: 0; } iframe { width: 100%; height: 100%; border: 0;}  </style><body><iframe src="' + this.output("datauristring", e2) + '"></iframe></body></html>', g3 = i.open();
        if (null !== g3 && (g3.document.write(p3), g3.document.title = e2.filename), g3 || "undefined" == typeof safari) return g3;
        break;
      case "datauri":
      case "dataurl":
        return i.document.location.href = this.output("datauristring", e2);
      default:
        return null;
    }
  }, Jt2.foo = function() {
    try {
      return Jt2.apply(this, arguments);
    } catch (n2) {
      var t2 = n2.stack || "";
      ~t2.indexOf(" at ") && (t2 = t2.split(" at ")[1]);
      var e2 = "Error in function " + t2.split("\n")[0].split("<")[0] + ": " + n2.message;
      if (!i.console) throw new Error(e2);
      i.console.error(e2, n2), i.alert && alert(e2);
    }
  }, Jt2.foo.bar = Jt2, Jt2.foo), Ie2 = function(t2) {
    return true === Array.isArray(Tt2) && Tt2.indexOf(t2) > -1;
  };
  switch (a2) {
    case "pt":
      St = 1;
      break;
    case "mm":
      St = 72 / 25.4;
      break;
    case "cm":
      St = 72 / 2.54;
      break;
    case "in":
      St = 72;
      break;
    case "px":
      St = 1 == Ie2("px_scaling") ? 0.75 : 96 / 72;
      break;
    case "pc":
    case "em":
      St = 12;
      break;
    case "ex":
      St = 6;
      break;
    default:
      if ("number" != typeof a2) throw new Error("Invalid unit: " + a2);
      St = a2;
  }
  var je2 = null;
  K2(), Y2();
  var Ce = y2.__private__.getPageInfo = y2.getPageInfo = function(t2) {
    if (isNaN(t2) || t2 % 1 != 0) throw new Error("Invalid argument passed to jsPDF.getPageInfo");
    return { objId: Rt2[t2].objId, pageNumber: t2, pageContext: Rt2[t2] };
  }, Oe = y2.__private__.getPageInfoByObjId = function(t2) {
    if (isNaN(t2) || t2 % 1 != 0) throw new Error("Invalid argument passed to jsPDF.getPageInfoByObjId");
    for (var e2 in Rt2) if (Rt2[e2].objId === t2) break;
    return Ce(e2);
  }, Be = y2.__private__.getCurrentPageInfo = y2.getCurrentPageInfo = function() {
    return { objId: Rt2[$2].objId, pageNumber: $2, pageContext: Rt2[$2] };
  };
  y2.addPage = function() {
    return ve2.apply(this, arguments), this;
  }, y2.setPage = function() {
    return ye2.apply(this, arguments), ct2.call(this, ot2[$2]), this;
  }, y2.insertPage = function(t2) {
    return this.addPage(), this.movePage($2, t2), this;
  }, y2.movePage = function(t2, e2) {
    var n2, r2;
    if (t2 > e2) {
      n2 = ot2[t2], r2 = Rt2[t2];
      for (var i2 = t2; i2 > e2; i2--) ot2[i2] = ot2[i2 - 1], Rt2[i2] = Rt2[i2 - 1];
      ot2[e2] = n2, Rt2[e2] = r2, this.setPage(e2);
    } else if (t2 < e2) {
      n2 = ot2[t2], r2 = Rt2[t2];
      for (var a3 = t2; a3 < e2; a3++) ot2[a3] = ot2[a3 + 1], Rt2[a3] = Rt2[a3 + 1];
      ot2[e2] = n2, Rt2[e2] = r2, this.setPage(e2);
    }
    return this;
  }, y2.deletePage = function() {
    return be2.apply(this, arguments), this;
  }, y2.__private__.text = y2.text = function(e2, n2, r2, i2, a3) {
    var o2, s3, u3, c3, l2, h2, f3, d2, p3, g3 = (i2 = i2 || {}).scope || this;
    if ("number" == typeof e2 && "number" == typeof n2 && ("string" == typeof r2 || Array.isArray(r2))) {
      var m3 = r2;
      r2 = n2, n2 = e2, e2 = m3;
    }
    if (arguments[3] instanceof Wt2 == 0 ? (u3 = arguments[4], c3 = arguments[5], "object" === _typeof(f3 = arguments[3]) && null !== f3 || ("string" == typeof u3 && (c3 = u3, u3 = null), "string" == typeof f3 && (c3 = f3, f3 = null), "number" == typeof f3 && (u3 = f3, f3 = null), i2 = { flags: f3, angle: u3, align: c3 })) : (R2("The transform parameter of text() with a Matrix value"), p3 = a3), isNaN(n2) || isNaN(r2) || null == e2) throw new Error("Invalid arguments passed to jsPDF.text");
    if (0 === e2.length) return g3;
    var v3, y3 = "", w3 = "number" == typeof i2.lineHeightFactor ? i2.lineHeightFactor : Je, N3 = g3.internal.scaleFactor;
    function L3(t2) {
      return t2 = t2.split("	").join(Array(i2.TabLen || 9).join(" ")), ge2(t2, f3);
    }
    function x3(t2) {
      for (var e3, n3 = t2.concat(), r3 = [], i3 = n3.length; i3--; ) "string" == typeof (e3 = n3.shift()) ? r3.push(e3) : Array.isArray(t2) && (1 === e3.length || void 0 === e3[1] && void 0 === e3[2]) ? r3.push(e3[0]) : r3.push([e3[0], e3[1], e3[2]]);
      return r3;
    }
    function A3(t2, e3) {
      var n3;
      if ("string" == typeof t2) n3 = e3(t2)[0];
      else if (Array.isArray(t2)) {
        for (var r3, i3, a4 = t2.concat(), o3 = [], s4 = a4.length; s4--; ) "string" == typeof (r3 = a4.shift()) ? o3.push(e3(r3)[0]) : Array.isArray(r3) && "string" == typeof r3[0] && (i3 = e3(r3[0], r3[1], r3[2]), o3.push([i3[0], i3[1], i3[2]]));
        n3 = o3;
      }
      return n3;
    }
    var P3 = false, k3 = true;
    if ("string" == typeof e2) P3 = true;
    else if (Array.isArray(e2)) {
      var F3 = e2.concat();
      s3 = [];
      for (var I2, j2 = F3.length; j2--; ) ("string" != typeof (I2 = F3.shift()) || Array.isArray(I2) && "string" != typeof I2[0]) && (k3 = false);
      P3 = k3;
    }
    if (false === P3) throw new Error('Type of text must be string or Array. "' + e2 + '" is not recognized.');
    "string" == typeof e2 && (e2 = e2.match(/[\r?\n]/) ? e2.split(/\r\n|\r|\n/g) : [e2]);
    var C2 = pt2 / g3.internal.scaleFactor, O2 = C2 * (w3 - 1);
    switch (i2.baseline) {
      case "bottom":
        r2 -= O2;
        break;
      case "top":
        r2 += C2 - O2;
        break;
      case "hanging":
        r2 += C2 - 2 * O2;
        break;
      case "middle":
        r2 += C2 / 2 - O2;
    }
    if ((h2 = i2.maxWidth || 0) > 0 && ("string" == typeof e2 ? e2 = g3.splitTextToSize(e2, h2) : "[object Array]" === Object.prototype.toString.call(e2) && (e2 = e2.reduce(function(t2, e3) {
      return t2.concat(g3.splitTextToSize(e3, h2));
    }, []))), o2 = { text: e2, x: n2, y: r2, options: i2, mutex: { pdfEscape: ge2, activeFontKey: At2, fonts: Ft2, activeFontSize: pt2 } }, Dt2.publish("preProcessText", o2), e2 = o2.text, u3 = (i2 = o2.options).angle, p3 instanceof Wt2 == 0 && u3 && "number" == typeof u3) {
      u3 *= Math.PI / 180, 0 === i2.rotationDirection && (u3 = -u3), _2 === S2 && (u3 = -u3);
      var M2 = Math.cos(u3), q2 = Math.sin(u3);
      p3 = new Wt2(M2, q2, -q2, M2, 0, 0);
    } else u3 && u3 instanceof Wt2 && (p3 = u3);
    _2 !== S2 || p3 || (p3 = Gt2), void 0 !== (l2 = i2.charSpace || ln2) && (y3 += B2(U2(l2)) + " Tc\n", this.setCharSpace(this.getCharSpace() || 0)), void 0 !== (d2 = i2.horizontalScale) && (y3 += B2(100 * d2) + " Tz\n"), i2.lang;
    var E2 = -1, D3 = void 0 !== i2.renderingMode ? i2.renderingMode : i2.stroke, T3 = g3.internal.getCurrentPageInfo().pageContext;
    switch (D3) {
      case 0:
      case false:
      case "fill":
        E2 = 0;
        break;
      case 1:
      case true:
      case "stroke":
        E2 = 1;
        break;
      case 2:
      case "fillThenStroke":
        E2 = 2;
        break;
      case 3:
      case "invisible":
        E2 = 3;
        break;
      case 4:
      case "fillAndAddForClipping":
        E2 = 4;
        break;
      case 5:
      case "strokeAndAddPathForClipping":
        E2 = 5;
        break;
      case 6:
      case "fillThenStrokeAndAddToPathForClipping":
        E2 = 6;
        break;
      case 7:
      case "addToPathForClipping":
        E2 = 7;
    }
    var z3 = void 0 !== T3.usedRenderingMode ? T3.usedRenderingMode : -1;
    -1 !== E2 ? y3 += E2 + " Tr\n" : -1 !== z3 && (y3 += "0 Tr\n"), -1 !== E2 && (T3.usedRenderingMode = E2), c3 = i2.align || "left";
    var H3, W3 = pt2 * w3, V3 = g3.internal.pageSize.getWidth(), G3 = Ft2[At2];
    l2 = i2.charSpace || ln2, h2 = i2.maxWidth || 0, f3 = Object.assign({ autoencode: true, noBOM: true }, i2.flags);
    var Y3 = [], J3 = function(t2) {
      return g3.getStringUnitWidth(t2, { font: G3, charSpace: l2, fontSize: pt2, doKerning: false }) * pt2 / N3;
    };
    if ("[object Array]" === Object.prototype.toString.call(e2)) {
      var X3;
      s3 = x3(e2), "left" !== c3 && (H3 = s3.map(J3));
      var K3, Z3 = 0;
      if ("right" === c3) {
        n2 -= H3[0], e2 = [], j2 = s3.length;
        for (var $3 = 0; $3 < j2; $3++) 0 === $3 ? (K3 = en(n2), X3 = nn(r2)) : (K3 = U2(Z3 - H3[$3]), X3 = -W3), e2.push([s3[$3], K3, X3]), Z3 = H3[$3];
      } else if ("center" === c3) {
        n2 -= H3[0] / 2, e2 = [], j2 = s3.length;
        for (var Q3 = 0; Q3 < j2; Q3++) 0 === Q3 ? (K3 = en(n2), X3 = nn(r2)) : (K3 = U2((Z3 - H3[Q3]) / 2), X3 = -W3), e2.push([s3[Q3], K3, X3]), Z3 = H3[Q3];
      } else if ("left" === c3) {
        e2 = [], j2 = s3.length;
        for (var tt3 = 0; tt3 < j2; tt3++) e2.push(s3[tt3]);
      } else if ("justify" === c3 && "Identity-H" === G3.encoding) {
        e2 = [], j2 = s3.length, h2 = 0 !== h2 ? h2 : V3;
        for (var et3 = 0, nt3 = 0; nt3 < j2; nt3++) if (X3 = 0 === nt3 ? nn(r2) : -W3, K3 = 0 === nt3 ? en(n2) : et3, nt3 < j2 - 1) {
          var rt3 = U2((h2 - H3[nt3]) / (s3[nt3].split(" ").length - 1)), it3 = s3[nt3].split(" ");
          e2.push([it3[0] + " ", K3, X3]), et3 = 0;
          for (var at3 = 1; at3 < it3.length; at3++) {
            var ot3 = (J3(it3[at3 - 1] + " " + it3[at3]) - J3(it3[at3])) * N3 + rt3;
            at3 == it3.length - 1 ? e2.push([it3[at3], ot3, 0]) : e2.push([it3[at3] + " ", ot3, 0]), et3 -= ot3;
          }
        } else e2.push([s3[nt3], K3, X3]);
        e2.push(["", et3, 0]);
      } else {
        if ("justify" !== c3) throw new Error('Unrecognized alignment option, use "left", "center", "right" or "justify".');
        for (e2 = [], j2 = s3.length, h2 = 0 !== h2 ? h2 : V3, nt3 = 0; nt3 < j2; nt3++) X3 = 0 === nt3 ? nn(r2) : -W3, K3 = 0 === nt3 ? en(n2) : 0, nt3 < j2 - 1 ? Y3.push(B2(U2((h2 - H3[nt3]) / (s3[nt3].split(" ").length - 1)))) : Y3.push(0), e2.push([s3[nt3], K3, X3]);
      }
    }
    true === ("boolean" == typeof i2.R2L ? i2.R2L : vt2) && (e2 = A3(e2, function(t2, e3, n3) {
      return [t2.split("").reverse().join(""), e3, n3];
    })), o2 = { text: e2, x: n2, y: r2, options: i2, mutex: { pdfEscape: ge2, activeFontKey: At2, fonts: Ft2, activeFontSize: pt2 } }, Dt2.publish("postProcessText", o2), e2 = o2.text, v3 = o2.mutex.isHex || false;
    var st3 = Ft2[At2].encoding;
    "WinAnsiEncoding" !== st3 && "StandardEncoding" !== st3 || (e2 = A3(e2, function(t2, e3, n3) {
      return [L3(t2), e3, n3];
    })), s3 = x3(e2), e2 = [];
    for (var ut3, ct3, ht3, ft3 = Array.isArray(s3[0]) ? 1 : 0, dt3 = "", gt3 = function(t2, e3, n3) {
      var r3 = "";
      return n3 instanceof Wt2 ? (n3 = "number" == typeof i2.angle ? Vt2(n3, new Wt2(1, 0, 0, 1, t2, e3)) : Vt2(new Wt2(1, 0, 0, 1, t2, e3), n3), _2 === S2 && (n3 = Vt2(new Wt2(1, 0, 0, -1, 0, 0), n3)), r3 = n3.join(" ") + " Tm\n") : r3 = B2(t2) + " " + B2(e3) + " Td\n", r3;
    }, mt3 = 0; mt3 < s3.length; mt3++) {
      switch (dt3 = "", ft3) {
        case 1:
          ht3 = (v3 ? "<" : "(") + s3[mt3][0] + (v3 ? ">" : ")"), ut3 = parseFloat(s3[mt3][1]), ct3 = parseFloat(s3[mt3][2]);
          break;
        case 0:
          ht3 = (v3 ? "<" : "(") + s3[mt3] + (v3 ? ">" : ")"), ut3 = en(n2), ct3 = nn(r2);
      }
      void 0 !== Y3 && void 0 !== Y3[mt3] && (dt3 = Y3[mt3] + " Tw\n"), 0 === mt3 ? e2.push(dt3 + gt3(ut3, ct3, p3) + ht3) : 0 === ft3 ? e2.push(dt3 + ht3) : 1 === ft3 && e2.push(dt3 + gt3(ut3, ct3, p3) + ht3);
    }
    e2 = 0 === ft3 ? e2.join(" Tj\nT* ") : e2.join(" Tj\n"), e2 += " Tj\n";
    var bt3 = "BT\n/";
    return bt3 += At2 + " " + pt2 + " Tf\n", bt3 += B2(pt2 * w3) + " TL\n", bt3 += un + "\n", bt3 += y3, bt3 += e2, lt2(bt3 += "ET"), b2[At2] = true, g3;
  };
  var Me = y2.__private__.clip = y2.clip = function(t2) {
    return lt2("evenodd" === t2 ? "W*" : "W"), this;
  };
  y2.clipEvenOdd = function() {
    return Me("evenodd");
  }, y2.__private__.discardPath = y2.discardPath = function() {
    return lt2("n"), this;
  };
  var qe = y2.__private__.isValidStyle = function(t2) {
    var e2 = false;
    return -1 !== [void 0, null, "S", "D", "F", "DF", "FD", "f", "f*", "B", "B*", "n"].indexOf(t2) && (e2 = true), e2;
  };
  y2.__private__.setDefaultPathOperation = y2.setDefaultPathOperation = function(t2) {
    return qe(t2) && (g2 = t2), this;
  };
  var Ee = y2.__private__.getStyle = y2.getStyle = function(t2) {
    var e2 = g2;
    switch (t2) {
      case "D":
      case "S":
        e2 = "S";
        break;
      case "F":
        e2 = "f";
        break;
      case "FD":
      case "DF":
        e2 = "B";
        break;
      case "f":
      case "f*":
      case "B":
      case "B*":
        e2 = t2;
    }
    return e2;
  }, Re = y2.close = function() {
    return lt2("h"), this;
  };
  y2.stroke = function() {
    return lt2("S"), this;
  }, y2.fill = function(t2) {
    return De("f", t2), this;
  }, y2.fillEvenOdd = function(t2) {
    return De("f*", t2), this;
  }, y2.fillStroke = function(t2) {
    return De("B", t2), this;
  }, y2.fillStrokeEvenOdd = function(t2) {
    return De("B*", t2), this;
  };
  var De = function(e2, n2) {
    "object" === _typeof(n2) ? Ue(n2, e2) : lt2(e2);
  }, Te = function(t2) {
    null === t2 || _2 === S2 && void 0 === t2 || (t2 = Ee(t2), lt2(t2));
  };
  function ze(t2, e2, n2, r2, i2) {
    var a3 = new q(e2 || this.boundingBox, n2 || this.xStep, r2 || this.yStep, this.gState, i2 || this.matrix);
    a3.stream = this.stream;
    var o2 = t2 + "$$" + this.cloneIndex++ + "$$";
    return Yt2(o2, a3), a3;
  }
  var Ue = function(t2, e2) {
    var n2 = Ot2[t2.key], r2 = Ct2[n2];
    if (r2 instanceof M) lt2("q"), lt2(He(e2)), r2.gState && y2.setGState(r2.gState), lt2(t2.matrix.toString() + " cm"), lt2("/" + n2 + " sh"), lt2("Q");
    else if (r2 instanceof q) {
      var i2 = new Wt2(1, 0, 0, -1, 0, Ln());
      t2.matrix && (i2 = i2.multiply(t2.matrix || Gt2), n2 = ze.call(r2, t2.key, t2.boundingBox, t2.xStep, t2.yStep, i2).id), lt2("q"), lt2("/Pattern cs"), lt2("/" + n2 + " scn"), r2.gState && y2.setGState(r2.gState), lt2(e2), lt2("Q");
    }
  }, He = function(t2) {
    switch (t2) {
      case "f":
      case "F":
      case "n":
        return "W n";
      case "f*":
        return "W* n";
      case "B":
      case "S":
        return "W S";
      case "B*":
        return "W* S";
    }
  }, We = y2.moveTo = function(t2, e2) {
    return lt2(B2(U2(t2)) + " " + B2(H2(e2)) + " m"), this;
  }, Ve = y2.lineTo = function(t2, e2) {
    return lt2(B2(U2(t2)) + " " + B2(H2(e2)) + " l"), this;
  }, Ge = y2.curveTo = function(t2, e2, n2, r2, i2, a3) {
    return lt2([B2(U2(t2)), B2(H2(e2)), B2(U2(n2)), B2(H2(r2)), B2(U2(i2)), B2(H2(a3)), "c"].join(" ")), this;
  };
  y2.__private__.line = y2.line = function(t2, e2, n2, r2, i2) {
    if (isNaN(t2) || isNaN(e2) || isNaN(n2) || isNaN(r2) || !qe(i2)) throw new Error("Invalid arguments passed to jsPDF.line");
    return _2 === A2 ? this.lines([[n2 - t2, r2 - e2]], t2, e2, [1, 1], i2 || "S") : this.lines([[n2 - t2, r2 - e2]], t2, e2, [1, 1]).stroke();
  }, y2.__private__.lines = y2.lines = function(t2, e2, n2, r2, i2, a3) {
    var o2, s3, u3, c3, l2, h2, f3, d2, p3, g3, m3, v3;
    if ("number" == typeof t2 && (v3 = n2, n2 = e2, e2 = t2, t2 = v3), r2 = r2 || [1, 1], a3 = a3 || false, isNaN(e2) || isNaN(n2) || !Array.isArray(t2) || !Array.isArray(r2) || !qe(i2) || "boolean" != typeof a3) throw new Error("Invalid arguments passed to jsPDF.lines");
    for (We(e2, n2), o2 = r2[0], s3 = r2[1], c3 = t2.length, g3 = e2, m3 = n2, u3 = 0; u3 < c3; u3++) 2 === (l2 = t2[u3]).length ? (g3 = l2[0] * o2 + g3, m3 = l2[1] * s3 + m3, Ve(g3, m3)) : (h2 = l2[0] * o2 + g3, f3 = l2[1] * s3 + m3, d2 = l2[2] * o2 + g3, p3 = l2[3] * s3 + m3, g3 = l2[4] * o2 + g3, m3 = l2[5] * s3 + m3, Ge(h2, f3, d2, p3, g3, m3));
    return a3 && Re(), Te(i2), this;
  }, y2.path = function(t2) {
    for (var e2 = 0; e2 < t2.length; e2++) {
      var n2 = t2[e2], r2 = n2.c;
      switch (n2.op) {
        case "m":
          We(r2[0], r2[1]);
          break;
        case "l":
          Ve(r2[0], r2[1]);
          break;
        case "c":
          Ge.apply(this, r2);
          break;
        case "h":
          Re();
      }
    }
    return this;
  }, y2.__private__.rect = y2.rect = function(t2, e2, n2, r2, i2) {
    if (isNaN(t2) || isNaN(e2) || isNaN(n2) || isNaN(r2) || !qe(i2)) throw new Error("Invalid arguments passed to jsPDF.rect");
    return _2 === A2 && (r2 = -r2), lt2([B2(U2(t2)), B2(H2(e2)), B2(U2(n2)), B2(U2(r2)), "re"].join(" ")), Te(i2), this;
  }, y2.__private__.triangle = y2.triangle = function(t2, e2, n2, r2, i2, a3, o2) {
    if (isNaN(t2) || isNaN(e2) || isNaN(n2) || isNaN(r2) || isNaN(i2) || isNaN(a3) || !qe(o2)) throw new Error("Invalid arguments passed to jsPDF.triangle");
    return this.lines([[n2 - t2, r2 - e2], [i2 - n2, a3 - r2], [t2 - i2, e2 - a3]], t2, e2, [1, 1], o2, true), this;
  }, y2.__private__.roundedRect = y2.roundedRect = function(t2, e2, n2, r2, i2, a3, o2) {
    if (isNaN(t2) || isNaN(e2) || isNaN(n2) || isNaN(r2) || isNaN(i2) || isNaN(a3) || !qe(o2)) throw new Error("Invalid arguments passed to jsPDF.roundedRect");
    var s3 = 4 / 3 * (Math.SQRT2 - 1);
    return i2 = Math.min(i2, 0.5 * n2), a3 = Math.min(a3, 0.5 * r2), this.lines([[n2 - 2 * i2, 0], [i2 * s3, 0, i2, a3 - a3 * s3, i2, a3], [0, r2 - 2 * a3], [0, a3 * s3, -i2 * s3, a3, -i2, a3], [2 * i2 - n2, 0], [-i2 * s3, 0, -i2, -a3 * s3, -i2, -a3], [0, 2 * a3 - r2], [0, -a3 * s3, i2 * s3, -a3, i2, -a3]], t2 + i2, e2, [1, 1], o2, true), this;
  }, y2.__private__.ellipse = y2.ellipse = function(t2, e2, n2, r2, i2) {
    if (isNaN(t2) || isNaN(e2) || isNaN(n2) || isNaN(r2) || !qe(i2)) throw new Error("Invalid arguments passed to jsPDF.ellipse");
    var a3 = 4 / 3 * (Math.SQRT2 - 1) * n2, o2 = 4 / 3 * (Math.SQRT2 - 1) * r2;
    return We(t2 + n2, e2), Ge(t2 + n2, e2 - o2, t2 + a3, e2 - r2, t2, e2 - r2), Ge(t2 - a3, e2 - r2, t2 - n2, e2 - o2, t2 - n2, e2), Ge(t2 - n2, e2 + o2, t2 - a3, e2 + r2, t2, e2 + r2), Ge(t2 + a3, e2 + r2, t2 + n2, e2 + o2, t2 + n2, e2), Te(i2), this;
  }, y2.__private__.circle = y2.circle = function(t2, e2, n2, r2) {
    if (isNaN(t2) || isNaN(e2) || isNaN(n2) || !qe(r2)) throw new Error("Invalid arguments passed to jsPDF.circle");
    return this.ellipse(t2, e2, n2, n2, r2);
  }, y2.setFont = function(t2, e2, n2) {
    return n2 && (e2 = F2(e2, n2)), At2 = Ne2(t2, e2, { disableWarning: false }), this;
  };
  var Ye = y2.__private__.getFont = y2.getFont = function() {
    return Ft2[Ne2.apply(y2, arguments)];
  };
  y2.__private__.getFontList = y2.getFontList = function() {
    var t2, e2, n2 = {};
    for (t2 in It2) if (It2.hasOwnProperty(t2)) for (e2 in n2[t2] = [], It2[t2]) It2[t2].hasOwnProperty(e2) && n2[t2].push(e2);
    return n2;
  }, y2.addFont = function(t2, e2, n2, r2, i2) {
    var a3 = ["StandardEncoding", "MacRomanEncoding", "Identity-H", "WinAnsiEncoding"];
    return arguments[3] && -1 !== a3.indexOf(arguments[3]) ? i2 = arguments[3] : arguments[3] && -1 == a3.indexOf(arguments[3]) && (n2 = F2(n2, r2)), pe2.call(this, t2, e2, n2, i2 = i2 || "Identity-H");
  };
  var Je, Xe = e.lineWidth || 0.200025, Ke = y2.__private__.getLineWidth = y2.getLineWidth = function() {
    return Xe;
  }, Ze = y2.__private__.setLineWidth = y2.setLineWidth = function(t2) {
    return Xe = t2, lt2(B2(U2(t2)) + " w"), this;
  };
  y2.__private__.setLineDash = E.API.setLineDash = E.API.setLineDashPattern = function(t2, e2) {
    if (t2 = t2 || [], e2 = e2 || 0, isNaN(e2) || !Array.isArray(t2)) throw new Error("Invalid arguments passed to jsPDF.setLineDash");
    return t2 = t2.map(function(t3) {
      return B2(U2(t3));
    }).join(" "), e2 = B2(U2(e2)), lt2("[" + t2 + "] " + e2 + " d"), this;
  };
  var $e = y2.__private__.getLineHeight = y2.getLineHeight = function() {
    return pt2 * Je;
  };
  y2.__private__.getLineHeight = y2.getLineHeight = function() {
    return pt2 * Je;
  };
  var Qe = y2.__private__.setLineHeightFactor = y2.setLineHeightFactor = function(t2) {
    return "number" == typeof (t2 = t2 || 1.15) && (Je = t2), this;
  }, tn = y2.__private__.getLineHeightFactor = y2.getLineHeightFactor = function() {
    return Je;
  };
  Qe(e.lineHeight);
  var en = y2.__private__.getHorizontalCoordinate = function(t2) {
    return U2(t2);
  }, nn = y2.__private__.getVerticalCoordinate = function(t2) {
    return _2 === S2 ? t2 : Rt2[$2].mediaBox.topRightY - Rt2[$2].mediaBox.bottomLeftY - U2(t2);
  }, rn = y2.__private__.getHorizontalCoordinateString = y2.getHorizontalCoordinateString = function(t2) {
    return B2(en(t2));
  }, an = y2.__private__.getVerticalCoordinateString = y2.getVerticalCoordinateString = function(t2) {
    return B2(nn(t2));
  }, on = e.strokeColor || "0 G";
  y2.__private__.getStrokeColor = y2.getDrawColor = function() {
    return ee2(on);
  }, y2.__private__.setStrokeColor = y2.setDrawColor = function(t2, e2, n2, r2) {
    return on = ne2({ ch1: t2, ch2: e2, ch3: n2, ch4: r2, pdfColorType: "draw", precision: 2 }), lt2(on), this;
  };
  var sn = e.fillColor || "0 g";
  y2.__private__.getFillColor = y2.getFillColor = function() {
    return ee2(sn);
  }, y2.__private__.setFillColor = y2.setFillColor = function(t2, e2, n2, r2) {
    return sn = ne2({ ch1: t2, ch2: e2, ch3: n2, ch4: r2, pdfColorType: "fill", precision: 2 }), lt2(sn), this;
  };
  var un = e.textColor || "0 g", cn = y2.__private__.getTextColor = y2.getTextColor = function() {
    return ee2(un);
  };
  y2.__private__.setTextColor = y2.setTextColor = function(t2, e2, n2, r2) {
    return un = ne2({ ch1: t2, ch2: e2, ch3: n2, ch4: r2, pdfColorType: "text", precision: 3 }), this;
  };
  var ln2 = e.charSpace, hn = y2.__private__.getCharSpace = y2.getCharSpace = function() {
    return parseFloat(ln2 || 0);
  };
  y2.__private__.setCharSpace = y2.setCharSpace = function(t2) {
    if (isNaN(t2)) throw new Error("Invalid argument passed to jsPDF.setCharSpace");
    return ln2 = t2, this;
  };
  var fn = 0;
  y2.CapJoinStyles = { 0: 0, butt: 0, but: 0, miter: 0, 1: 1, round: 1, rounded: 1, circle: 1, 2: 2, projecting: 2, project: 2, square: 2, bevel: 2 }, y2.__private__.setLineCap = y2.setLineCap = function(t2) {
    var e2 = y2.CapJoinStyles[t2];
    if (void 0 === e2) throw new Error("Line cap style of '" + t2 + "' is not recognized. See or extend .CapJoinStyles property for valid styles");
    return fn = e2, lt2(e2 + " J"), this;
  };
  var dn = 0;
  y2.__private__.setLineJoin = y2.setLineJoin = function(t2) {
    var e2 = y2.CapJoinStyles[t2];
    if (void 0 === e2) throw new Error("Line join style of '" + t2 + "' is not recognized. See or extend .CapJoinStyles property for valid styles");
    return dn = e2, lt2(e2 + " j"), this;
  }, y2.__private__.setLineMiterLimit = y2.__private__.setMiterLimit = y2.setLineMiterLimit = y2.setMiterLimit = function(t2) {
    if (t2 = t2 || 0, isNaN(t2)) throw new Error("Invalid argument passed to jsPDF.setLineMiterLimit");
    return lt2(B2(U2(t2)) + " M"), this;
  }, y2.GState = O, y2.setGState = function(t2) {
    (t2 = "string" == typeof t2 ? Bt2[Mt2[t2]] : pn(null, t2)).equals(qt2) || (lt2("/" + t2.id + " gs"), qt2 = t2);
  };
  var pn = function(t2, e2) {
    if (!t2 || !Mt2[t2]) {
      var n2 = false;
      for (var r2 in Bt2) if (Bt2.hasOwnProperty(r2) && Bt2[r2].equals(e2)) {
        n2 = true;
        break;
      }
      if (n2) e2 = Bt2[r2];
      else {
        var i2 = "GS" + (Object.keys(Bt2).length + 1).toString(10);
        Bt2[i2] = e2, e2.id = i2;
      }
      return t2 && (Mt2[t2] = e2.id), Dt2.publish("addGState", e2), e2;
    }
  };
  y2.addGState = function(t2, e2) {
    return pn(t2, e2), this;
  }, y2.saveGraphicsState = function() {
    return lt2("q"), jt2.push({ key: At2, size: pt2, color: un }), this;
  }, y2.restoreGraphicsState = function() {
    lt2("Q");
    var t2 = jt2.pop();
    return At2 = t2.key, pt2 = t2.size, un = t2.color, qt2 = null, this;
  }, y2.setCurrentTransformationMatrix = function(t2) {
    return lt2(t2.toString() + " cm"), this;
  }, y2.comment = function(t2) {
    return lt2("#" + t2), this;
  };
  var gn = function(t2, e2) {
    var n2 = t2 || 0;
    Object.defineProperty(this, "x", { enumerable: true, get: function() {
      return n2;
    }, set: function(t3) {
      isNaN(t3) || (n2 = parseFloat(t3));
    } });
    var r2 = e2 || 0;
    Object.defineProperty(this, "y", { enumerable: true, get: function() {
      return r2;
    }, set: function(t3) {
      isNaN(t3) || (r2 = parseFloat(t3));
    } });
    var i2 = "pt";
    return Object.defineProperty(this, "type", { enumerable: true, get: function() {
      return i2;
    }, set: function(t3) {
      i2 = t3.toString();
    } }), this;
  }, mn = function(t2, e2, n2, r2) {
    gn.call(this, t2, e2), this.type = "rect";
    var i2 = n2 || 0;
    Object.defineProperty(this, "w", { enumerable: true, get: function() {
      return i2;
    }, set: function(t3) {
      isNaN(t3) || (i2 = parseFloat(t3));
    } });
    var a3 = r2 || 0;
    return Object.defineProperty(this, "h", { enumerable: true, get: function() {
      return a3;
    }, set: function(t3) {
      isNaN(t3) || (a3 = parseFloat(t3));
    } }), this;
  }, vn = function() {
    this.page = Et2, this.currentPage = $2, this.pages = ot2.slice(0), this.pagesContext = Rt2.slice(0), this.x = _t2, this.y = Pt2, this.matrix = kt2, this.width = wn($2), this.height = Ln($2), this.outputDestination = ut2, this.id = "", this.objectNumber = -1;
  };
  vn.prototype.restore = function() {
    Et2 = this.page, $2 = this.currentPage, Rt2 = this.pagesContext, ot2 = this.pages, _t2 = this.x, Pt2 = this.y, kt2 = this.matrix, Nn($2, this.width), xn($2, this.height), ut2 = this.outputDestination;
  };
  var bn = function(t2, e2, n2, r2, i2) {
    Ht2.push(new vn()), Et2 = $2 = 0, ot2 = [], _t2 = t2, Pt2 = e2, kt2 = i2, me2([n2, r2]);
  };
  for (var yn in y2.beginFormObject = function(t2, e2, n2, r2, i2) {
    return bn(t2, e2, n2, r2, i2), this;
  }, y2.endFormObject = function(t2) {
    return function(t3) {
      if (Ut2[t3]) Ht2.pop().restore();
      else {
        var e2 = new vn(), n2 = "Xo" + (Object.keys(zt2).length + 1).toString(10);
        e2.id = n2, Ut2[t3] = n2, zt2[n2] = e2, Dt2.publish("addFormObject", e2), Ht2.pop().restore();
      }
    }(t2), this;
  }, y2.doFormObject = function(t2, e2) {
    var n2 = zt2[Ut2[t2]];
    return lt2("q"), lt2(e2.toString() + " cm"), lt2("/" + n2.id + " Do"), lt2("Q"), this;
  }, y2.getFormObject = function(t2) {
    var e2 = zt2[Ut2[t2]];
    return { x: e2.x, y: e2.y, width: e2.width, height: e2.height, matrix: e2.matrix };
  }, y2.save = function(t2, e2) {
    return t2 = t2 || "generated.pdf", (e2 = e2 || {}).returnPromise = e2.returnPromise || false, false === e2.returnPromise ? (l(ke2(Pe2()), t2), "function" == typeof l.unload && i.setTimeout && setTimeout(l.unload, 911), this) : new Promise(function(e3, n2) {
      try {
        var r2 = l(ke2(Pe2()), t2);
        "function" == typeof l.unload && i.setTimeout && setTimeout(l.unload, 911), e3(r2);
      } catch (a3) {
        n2(a3.message);
      }
    });
  }, E.API) E.API.hasOwnProperty(yn) && ("events" === yn && E.API.events.length ? function(t2, e2) {
    var n2, r2, i2;
    for (i2 = e2.length - 1; -1 !== i2; i2--) n2 = e2[i2][0], r2 = e2[i2][1], t2.subscribe.apply(t2, [n2].concat("function" == typeof r2 ? [r2] : r2));
  }(Dt2, E.API.events) : y2[yn] = E.API[yn]);
  var wn = y2.getPageWidth = function(t2) {
    return (Rt2[t2 = t2 || $2].mediaBox.topRightX - Rt2[t2].mediaBox.bottomLeftX) / St;
  }, Nn = y2.setPageWidth = function(t2, e2) {
    Rt2[t2].mediaBox.topRightX = e2 * St + Rt2[t2].mediaBox.bottomLeftX;
  }, Ln = y2.getPageHeight = function(t2) {
    return (Rt2[t2 = t2 || $2].mediaBox.topRightY - Rt2[t2].mediaBox.bottomLeftY) / St;
  }, xn = y2.setPageHeight = function(t2, e2) {
    Rt2[t2].mediaBox.topRightY = e2 * St + Rt2[t2].mediaBox.bottomLeftY;
  };
  return y2.internal = { pdfEscape: ge2, getStyle: Ee, getFont: Ye, getFontSize: mt2, getCharSpace: hn, getTextColor: cn, getLineHeight: $e, getLineHeightFactor: tn, getLineWidth: Ke, write: ht2, getHorizontalCoordinate: en, getVerticalCoordinate: nn, getCoordinateString: rn, getVerticalCoordinateString: an, collections: {}, newObject: Xt2, newAdditionalObject: $t2, newObjectDeferred: Kt2, newObjectDeferredBegin: Zt2, getFilters: re2, putStream: ie2, events: Dt2, scaleFactor: St, pageSize: { getWidth: function() {
    return wn($2);
  }, setWidth: function(t2) {
    Nn($2, t2);
  }, getHeight: function() {
    return Ln($2);
  }, setHeight: function(t2) {
    xn($2, t2);
  } }, encryptionOptions: m2, encryption: je2, getEncryptor: function(t2) {
    return null !== m2 ? je2.encryptor(t2, 0) : function(t3) {
      return t3;
    };
  }, output: Fe2, getNumberOfPages: we2, pages: ot2, out: lt2, f2: T2, f3: z2, getPageInfo: Ce, getPageInfoByObjId: Oe, getCurrentPageInfo: Be, getPDFVersion: N2, Point: gn, Rectangle: mn, Matrix: Wt2, hasHotfix: Ie2 }, Object.defineProperty(y2.internal.pageSize, "width", { get: function() {
    return wn($2);
  }, set: function(t2) {
    Nn($2, t2);
  }, enumerable: true, configurable: true }), Object.defineProperty(y2.internal.pageSize, "height", { get: function() {
    return Ln($2);
  }, set: function(t2) {
    xn($2, t2);
  }, enumerable: true, configurable: true }), (function(t2) {
    for (var e2 = 0, n2 = dt2.length; e2 < n2; e2++) {
      var r2 = pe2.call(this, t2[e2][0], t2[e2][1], t2[e2][2], dt2[e2][3], true);
      false === v2 && (b2[r2] = true);
      var i2 = t2[e2][0].split("-");
      de2({ id: r2, fontName: i2[0], fontStyle: i2[1] || "" });
    }
    Dt2.publish("addFonts", { fonts: Ft2, dictionary: It2 });
  }).call(y2, dt2), At2 = "F1", ve2(s2, r), Dt2.publish("initialized"), y2;
}
I.prototype.lsbFirstWord = function(t2) {
  return String.fromCharCode(255 & t2, t2 >> 8 & 255, t2 >> 16 & 255, t2 >> 24 & 255);
}, I.prototype.toHexString = function(t2) {
  return t2.split("").map(function(t3) {
    return ("0" + (255 & t3.charCodeAt(0)).toString(16)).slice(-2);
  }).join("");
}, I.prototype.hexToBytes = function(t2) {
  for (var e = [], n = 0; n < t2.length; n += 2) e.push(String.fromCharCode(parseInt(t2.substr(n, 2), 16)));
  return e.join("");
}, I.prototype.processOwnerPassword = function(t2, e) {
  return k(S(e).substr(0, 5), t2);
}, I.prototype.encryptor = function(t2, e) {
  var n = S(this.encryptionKey + String.fromCharCode(255 & t2, t2 >> 8 & 255, t2 >> 16 & 255, 255 & e, e >> 8 & 255)).substr(0, 10);
  return function(t3) {
    return k(n, t3);
  };
}, O.prototype.equals = function(e) {
  var n, r = "id,objectNumber,equals";
  if (!e || _typeof(e) !== _typeof(this)) return false;
  var i2 = 0;
  for (n in this) if (!(r.indexOf(n) >= 0)) {
    if (this.hasOwnProperty(n) && !e.hasOwnProperty(n)) return false;
    if (this[n] !== e[n]) return false;
    i2++;
  }
  for (n in e) e.hasOwnProperty(n) && r.indexOf(n) < 0 && i2--;
  return 0 === i2;
}, E.API = { events: [] }, E.version = "3.0.2";
var R = E.API, D = 1, T = function(t2) {
  return t2.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}, z = function(t2) {
  return t2.replace(/\\\\/g, "\\").replace(/\\\(/g, "(").replace(/\\\)/g, ")");
}, U = function(t2) {
  return t2.toFixed(2);
}, H = function(t2) {
  return t2.toFixed(5);
};
R.__acroform__ = {};
var W = function(t2, e) {
  t2.prototype = Object.create(e.prototype), t2.prototype.constructor = t2;
}, V = function(t2) {
  return t2 * D;
}, G = function(t2) {
  var e = new ct(), n = xt.internal.getHeight(t2) || 0, r = xt.internal.getWidth(t2) || 0;
  return e.BBox = [0, 0, Number(U(r)), Number(U(n))], e;
}, Y = R.__acroform__.setBit = function(t2, e) {
  if (t2 = t2 || 0, e = e || 0, isNaN(t2) || isNaN(e)) throw new Error("Invalid arguments passed to jsPDF.API.__acroform__.setBit");
  return t2 | 1 << e;
}, J = R.__acroform__.clearBit = function(t2, e) {
  if (t2 = t2 || 0, e = e || 0, isNaN(t2) || isNaN(e)) throw new Error("Invalid arguments passed to jsPDF.API.__acroform__.clearBit");
  return t2 & ~(1 << e);
}, X = R.__acroform__.getBit = function(t2, e) {
  if (isNaN(t2) || isNaN(e)) throw new Error("Invalid arguments passed to jsPDF.API.__acroform__.getBit");
  return t2 & 1 << e ? 1 : 0;
}, K = R.__acroform__.getBitForPdf = function(t2, e) {
  if (isNaN(t2) || isNaN(e)) throw new Error("Invalid arguments passed to jsPDF.API.__acroform__.getBitForPdf");
  return X(t2, e - 1);
}, Z = R.__acroform__.setBitForPdf = function(t2, e) {
  if (isNaN(t2) || isNaN(e)) throw new Error("Invalid arguments passed to jsPDF.API.__acroform__.setBitForPdf");
  return Y(t2, e - 1);
}, $ = R.__acroform__.clearBitForPdf = function(t2, e) {
  if (isNaN(t2) || isNaN(e)) throw new Error("Invalid arguments passed to jsPDF.API.__acroform__.clearBitForPdf");
  return J(t2, e - 1);
}, Q = R.__acroform__.calculateCoordinates = function(t2, e) {
  var n = e.internal.getHorizontalCoordinate, r = e.internal.getVerticalCoordinate, i2 = t2[0], a2 = t2[1], o2 = t2[2], s2 = t2[3], u2 = {};
  return u2.lowerLeft_X = n(i2) || 0, u2.lowerLeft_Y = r(a2 + s2) || 0, u2.upperRight_X = n(i2 + o2) || 0, u2.upperRight_Y = r(a2) || 0, [Number(U(u2.lowerLeft_X)), Number(U(u2.lowerLeft_Y)), Number(U(u2.upperRight_X)), Number(U(u2.upperRight_Y))];
}, tt = function(t2) {
  if (t2.appearanceStreamContent) return t2.appearanceStreamContent;
  if (t2.V || t2.DV) {
    var e = [], n = t2._V || t2.DV, r = et(t2, n), i2 = t2.scope.internal.getFont(t2.fontName, t2.fontStyle).id;
    e.push("/Tx BMC"), e.push("q"), e.push("BT"), e.push(t2.scope.__private__.encodeColorString(t2.color)), e.push("/" + i2 + " " + U(r.fontSize) + " Tf"), e.push("1 0 0 1 0 0 Tm"), e.push(r.text), e.push("ET"), e.push("Q"), e.push("EMC");
    var a2 = G(t2);
    return a2.scope = t2.scope, a2.stream = e.join("\n"), a2;
  }
}, et = function(t2, e) {
  var n = 0 === t2.fontSize ? t2.maxFontSize : t2.fontSize, r = { text: "", fontSize: "" }, i2 = (e = ")" == (e = "(" == e.substr(0, 1) ? e.substr(1) : e).substr(e.length - 1) ? e.substr(0, e.length - 1) : e).split(" ");
  i2 = t2.multiline ? i2.map(function(t3) {
    return t3.split("\n");
  }) : i2.map(function(t3) {
    return [t3];
  });
  var a2 = n, o2 = xt.internal.getHeight(t2) || 0;
  o2 = o2 < 0 ? -o2 : o2;
  var s2 = xt.internal.getWidth(t2) || 0;
  s2 = s2 < 0 ? -s2 : s2;
  var u2 = function(e2, n2, r2) {
    if (e2 + 1 < i2.length) {
      var a3 = n2 + " " + i2[e2 + 1][0];
      return nt(a3, t2, r2).width <= s2 - 4;
    }
    return false;
  };
  a2++;
  t: for (; a2 > 0; ) {
    e = "", a2--;
    var c2, l2, h2 = nt("3", t2, a2).height, f2 = t2.multiline ? o2 - a2 : (o2 - h2) / 2, d2 = f2 += 2, p2 = 0, g2 = 0, m2 = 0;
    if (a2 <= 0) {
      e = "(...) Tj\n", e += "% Width of Text: " + nt(e, t2, a2 = 12).width + ", FieldWidth:" + s2 + "\n";
      break;
    }
    for (var v2 = "", b2 = 0, y2 = 0; y2 < i2.length; y2++) if (i2.hasOwnProperty(y2)) {
      var w2 = false;
      if (1 !== i2[y2].length && m2 !== i2[y2].length - 1) {
        if ((h2 + 2) * (b2 + 2) + 2 > o2) continue t;
        v2 += i2[y2][m2], w2 = true, g2 = y2, y2--;
      } else {
        v2 = " " == (v2 += i2[y2][m2] + " ").substr(v2.length - 1) ? v2.substr(0, v2.length - 1) : v2;
        var N2 = parseInt(y2), L2 = u2(N2, v2, a2), x2 = y2 >= i2.length - 1;
        if (L2 && !x2) {
          v2 += " ", m2 = 0;
          continue;
        }
        if (L2 || x2) {
          if (x2) g2 = N2;
          else if (t2.multiline && (h2 + 2) * (b2 + 2) + 2 > o2) continue t;
        } else {
          if (!t2.multiline) continue t;
          if ((h2 + 2) * (b2 + 2) + 2 > o2) continue t;
          g2 = N2;
        }
      }
      for (var A2 = "", S2 = p2; S2 <= g2; S2++) {
        var _2 = i2[S2];
        if (t2.multiline) {
          if (S2 === g2) {
            A2 += _2[m2] + " ", m2 = (m2 + 1) % _2.length;
            continue;
          }
          if (S2 === p2) {
            A2 += _2[_2.length - 1] + " ";
            continue;
          }
        }
        A2 += _2[0] + " ";
      }
      switch (A2 = " " == A2.substr(A2.length - 1) ? A2.substr(0, A2.length - 1) : A2, l2 = nt(A2, t2, a2).width, t2.textAlign) {
        case "right":
          c2 = s2 - l2 - 2;
          break;
        case "center":
          c2 = (s2 - l2) / 2;
          break;
        default:
          c2 = 2;
      }
      e += U(c2) + " " + U(d2) + " Td\n", e += "(" + T(A2) + ") Tj\n", e += -U(c2) + " 0 Td\n", d2 = -(a2 + 2), l2 = 0, p2 = w2 ? g2 : g2 + 1, b2++, v2 = "";
    }
    break;
  }
  return r.text = e, r.fontSize = a2, r;
}, nt = function(t2, e, n) {
  var r = e.scope.internal.getFont(e.fontName, e.fontStyle), i2 = e.scope.getStringUnitWidth(t2, { font: r, fontSize: parseFloat(n), charSpace: 0 }) * parseFloat(n);
  return { height: e.scope.getStringUnitWidth("3", { font: r, fontSize: parseFloat(n), charSpace: 0 }) * parseFloat(n) * 1.5, width: i2 };
}, rt = { fields: [], xForms: [], acroFormDictionaryRoot: null, printedOut: false, internal: null, isInitialized: false }, it = function(t2, e) {
  var n = { type: "reference", object: t2 };
  void 0 === e.internal.getPageInfo(t2.page).pageContext.annotations.find(function(t3) {
    return t3.type === n.type && t3.object === n.object;
  }) && e.internal.getPageInfo(t2.page).pageContext.annotations.push(n);
}, at = function(e, n) {
  if (n.scope = e, void 0 !== e.internal && (void 0 === e.internal.acroformPlugin || false === e.internal.acroformPlugin.isInitialized)) {
    if (ht.FieldNum = 0, e.internal.acroformPlugin = JSON.parse(JSON.stringify(rt)), e.internal.acroformPlugin.acroFormDictionaryRoot) throw new Error("Exception while creating AcroformDictionary");
    D = e.internal.scaleFactor, e.internal.acroformPlugin.acroFormDictionaryRoot = new lt(), e.internal.acroformPlugin.acroFormDictionaryRoot.scope = e, e.internal.acroformPlugin.acroFormDictionaryRoot._eventID = e.internal.events.subscribe("postPutResources", function() {
      !function(t2) {
        t2.internal.events.unsubscribe(t2.internal.acroformPlugin.acroFormDictionaryRoot._eventID), delete t2.internal.acroformPlugin.acroFormDictionaryRoot._eventID, t2.internal.acroformPlugin.printedOut = true;
      }(e);
    }), e.internal.events.subscribe("buildDocument", function() {
      !function(t2) {
        t2.internal.acroformPlugin.acroFormDictionaryRoot.objId = void 0;
        var e2 = t2.internal.acroformPlugin.acroFormDictionaryRoot.Fields;
        for (var n2 in e2) if (e2.hasOwnProperty(n2)) {
          var r = e2[n2];
          r.objId = void 0, r.hasAnnotation && it(r, t2);
        }
      }(e);
    }), e.internal.events.subscribe("putCatalog", function() {
      !function(t2) {
        if (void 0 === t2.internal.acroformPlugin.acroFormDictionaryRoot) throw new Error("putCatalogCallback: Root missing.");
        t2.internal.write("/AcroForm " + t2.internal.acroformPlugin.acroFormDictionaryRoot.objId + " 0 R");
      }(e);
    }), e.internal.events.subscribe("postPutPages", function(n2) {
      !function(e2, n3) {
        var r = !e2;
        for (var i2 in e2 || (n3.internal.newObjectDeferredBegin(n3.internal.acroformPlugin.acroFormDictionaryRoot.objId, true), n3.internal.acroformPlugin.acroFormDictionaryRoot.putStream()), e2 = e2 || n3.internal.acroformPlugin.acroFormDictionaryRoot.Kids) if (e2.hasOwnProperty(i2)) {
          var a2 = e2[i2], o2 = [], s2 = a2.Rect;
          if (a2.Rect && (a2.Rect = Q(a2.Rect, n3)), n3.internal.newObjectDeferredBegin(a2.objId, true), a2.DA = xt.createDefaultAppearanceStream(a2), "object" === _typeof(a2) && "function" == typeof a2.getKeyValueListForStream && (o2 = a2.getKeyValueListForStream()), a2.Rect = s2, a2.hasAppearanceStream && !a2.appearanceStreamContent) {
            var u2 = tt(a2);
            o2.push({ key: "AP", value: "<</N " + u2 + ">>" }), n3.internal.acroformPlugin.xForms.push(u2);
          }
          if (a2.appearanceStreamContent) {
            var c2 = "";
            for (var l2 in a2.appearanceStreamContent) if (a2.appearanceStreamContent.hasOwnProperty(l2)) {
              var h2 = a2.appearanceStreamContent[l2];
              if (c2 += "/" + l2 + " ", c2 += "<<", Object.keys(h2).length >= 1 || Array.isArray(h2)) {
                for (var i2 in h2) if (h2.hasOwnProperty(i2)) {
                  var f2 = h2[i2];
                  "function" == typeof f2 && (f2 = f2.call(n3, a2)), c2 += "/" + i2 + " " + f2 + " ", n3.internal.acroformPlugin.xForms.indexOf(f2) >= 0 || n3.internal.acroformPlugin.xForms.push(f2);
                }
              } else "function" == typeof (f2 = h2) && (f2 = f2.call(n3, a2)), c2 += "/" + i2 + " " + f2, n3.internal.acroformPlugin.xForms.indexOf(f2) >= 0 || n3.internal.acroformPlugin.xForms.push(f2);
              c2 += ">>";
            }
            o2.push({ key: "AP", value: "<<\n" + c2 + ">>" });
          }
          n3.internal.putStream({ additionalKeyValues: o2, objectId: a2.objId }), n3.internal.out("endobj");
        }
        r && function(e3, n4) {
          for (var r2 in e3) if (e3.hasOwnProperty(r2)) {
            var i3 = r2, a3 = e3[r2];
            n4.internal.newObjectDeferredBegin(a3.objId, true), "object" === _typeof(a3) && "function" == typeof a3.putStream && a3.putStream(), delete e3[i3];
          }
        }(n3.internal.acroformPlugin.xForms, n3);
      }(n2, e);
    }), e.internal.acroformPlugin.isInitialized = true;
  }
}, ot = R.__acroform__.arrayToPdfArray = function(e, n, r) {
  var i2 = function(t2) {
    return t2;
  };
  if (Array.isArray(e)) {
    for (var a2 = "[", o2 = 0; o2 < e.length; o2++) switch (0 !== o2 && (a2 += " "), _typeof(e[o2])) {
      case "boolean":
      case "number":
      case "object":
        a2 += e[o2].toString();
        break;
      case "string":
        "/" !== e[o2].substr(0, 1) ? (void 0 !== n && r && (i2 = r.internal.getEncryptor(n)), a2 += "(" + T(i2(e[o2].toString())) + ")") : a2 += e[o2].toString();
    }
    return a2 + "]";
  }
  throw new Error("Invalid argument passed to jsPDF.__acroform__.arrayToPdfArray");
}, st = function(t2, e, n) {
  var r = function(t3) {
    return t3;
  };
  return void 0 !== e && n && (r = n.internal.getEncryptor(e)), (t2 = t2 || "").toString(), "(" + T(r(t2)) + ")";
}, ut = function() {
  this._objId = void 0, this._scope = void 0, Object.defineProperty(this, "objId", { get: function() {
    if (void 0 === this._objId) {
      if (void 0 === this.scope) return;
      this._objId = this.scope.internal.newObjectDeferred();
    }
    return this._objId;
  }, set: function(t2) {
    this._objId = t2;
  } }), Object.defineProperty(this, "scope", { value: this._scope, writable: true });
};
ut.prototype.toString = function() {
  return this.objId + " 0 R";
}, ut.prototype.putStream = function() {
  var t2 = this.getKeyValueListForStream();
  this.scope.internal.putStream({ data: this.stream, additionalKeyValues: t2, objectId: this.objId }), this.scope.internal.out("endobj");
}, ut.prototype.getKeyValueListForStream = function() {
  var t2 = [], e = Object.getOwnPropertyNames(this).filter(function(t3) {
    return "content" != t3 && "appearanceStreamContent" != t3 && "scope" != t3 && "objId" != t3 && "_" != t3.substring(0, 1);
  });
  for (var n in e) if (false === Object.getOwnPropertyDescriptor(this, e[n]).configurable) {
    var r = e[n], i2 = this[r];
    i2 && (Array.isArray(i2) ? t2.push({ key: r, value: ot(i2, this.objId, this.scope) }) : i2 instanceof ut ? (i2.scope = this.scope, t2.push({ key: r, value: i2.objId + " 0 R" })) : "function" != typeof i2 && t2.push({ key: r, value: i2 }));
  }
  return t2;
};
var ct = function() {
  ut.call(this), Object.defineProperty(this, "Type", { value: "/XObject", configurable: false, writable: true }), Object.defineProperty(this, "Subtype", { value: "/Form", configurable: false, writable: true }), Object.defineProperty(this, "FormType", { value: 1, configurable: false, writable: true });
  var t2, e = [];
  Object.defineProperty(this, "BBox", { configurable: false, get: function() {
    return e;
  }, set: function(t3) {
    e = t3;
  } }), Object.defineProperty(this, "Resources", { value: "2 0 R", configurable: false, writable: true }), Object.defineProperty(this, "stream", { enumerable: false, configurable: true, set: function(e2) {
    t2 = e2.trim();
  }, get: function() {
    return t2 || null;
  } });
};
W(ct, ut);
var lt = function() {
  ut.call(this);
  var t2, e = [];
  Object.defineProperty(this, "Kids", { enumerable: false, configurable: true, get: function() {
    return e.length > 0 ? e : void 0;
  } }), Object.defineProperty(this, "Fields", { enumerable: false, configurable: false, get: function() {
    return e;
  } }), Object.defineProperty(this, "DA", { enumerable: false, configurable: false, get: function() {
    if (t2) {
      var e2 = function(t3) {
        return t3;
      };
      return this.scope && (e2 = this.scope.internal.getEncryptor(this.objId)), "(" + T(e2(t2)) + ")";
    }
  }, set: function(e2) {
    t2 = e2;
  } });
};
W(lt, ut);
var ht = function t() {
  ut.call(this);
  var e = 4;
  Object.defineProperty(this, "F", { enumerable: false, configurable: false, get: function() {
    return e;
  }, set: function(t2) {
    if (isNaN(t2)) throw new Error('Invalid value "' + t2 + '" for attribute F supplied.');
    e = t2;
  } }), Object.defineProperty(this, "showWhenPrinted", { enumerable: true, configurable: true, get: function() {
    return Boolean(K(e, 3));
  }, set: function(t2) {
    true === Boolean(t2) ? this.F = Z(e, 3) : this.F = $(e, 3);
  } });
  var n = 0;
  Object.defineProperty(this, "Ff", { enumerable: false, configurable: false, get: function() {
    return n;
  }, set: function(t2) {
    if (isNaN(t2)) throw new Error('Invalid value "' + t2 + '" for attribute Ff supplied.');
    n = t2;
  } });
  var r = [];
  Object.defineProperty(this, "Rect", { enumerable: false, configurable: false, get: function() {
    if (0 !== r.length) return r;
  }, set: function(t2) {
    r = void 0 !== t2 ? t2 : [];
  } }), Object.defineProperty(this, "x", { enumerable: true, configurable: true, get: function() {
    return !r || isNaN(r[0]) ? 0 : r[0];
  }, set: function(t2) {
    r[0] = t2;
  } }), Object.defineProperty(this, "y", { enumerable: true, configurable: true, get: function() {
    return !r || isNaN(r[1]) ? 0 : r[1];
  }, set: function(t2) {
    r[1] = t2;
  } }), Object.defineProperty(this, "width", { enumerable: true, configurable: true, get: function() {
    return !r || isNaN(r[2]) ? 0 : r[2];
  }, set: function(t2) {
    r[2] = t2;
  } }), Object.defineProperty(this, "height", { enumerable: true, configurable: true, get: function() {
    return !r || isNaN(r[3]) ? 0 : r[3];
  }, set: function(t2) {
    r[3] = t2;
  } });
  var i2 = "";
  Object.defineProperty(this, "FT", { enumerable: true, configurable: false, get: function() {
    return i2;
  }, set: function(t2) {
    switch (t2) {
      case "/Btn":
      case "/Tx":
      case "/Ch":
      case "/Sig":
        i2 = t2;
        break;
      default:
        throw new Error('Invalid value "' + t2 + '" for attribute FT supplied.');
    }
  } });
  var a2 = null;
  Object.defineProperty(this, "T", { enumerable: true, configurable: false, get: function() {
    if (!a2 || a2.length < 1) {
      if (this instanceof yt) return;
      a2 = "FieldObject" + t.FieldNum++;
    }
    var e2 = function(t2) {
      return t2;
    };
    return this.scope && (e2 = this.scope.internal.getEncryptor(this.objId)), "(" + T(e2(a2)) + ")";
  }, set: function(t2) {
    a2 = t2.toString();
  } }), Object.defineProperty(this, "fieldName", { configurable: true, enumerable: true, get: function() {
    return a2;
  }, set: function(t2) {
    a2 = t2;
  } });
  var o2 = "helvetica";
  Object.defineProperty(this, "fontName", { enumerable: true, configurable: true, get: function() {
    return o2;
  }, set: function(t2) {
    o2 = t2;
  } });
  var s2 = "normal";
  Object.defineProperty(this, "fontStyle", { enumerable: true, configurable: true, get: function() {
    return s2;
  }, set: function(t2) {
    s2 = t2;
  } });
  var u2 = 0;
  Object.defineProperty(this, "fontSize", { enumerable: true, configurable: true, get: function() {
    return u2;
  }, set: function(t2) {
    u2 = t2;
  } });
  var c2 = void 0;
  Object.defineProperty(this, "maxFontSize", { enumerable: true, configurable: true, get: function() {
    return void 0 === c2 ? 50 / D : c2;
  }, set: function(t2) {
    c2 = t2;
  } });
  var l2 = "black";
  Object.defineProperty(this, "color", { enumerable: true, configurable: true, get: function() {
    return l2;
  }, set: function(t2) {
    l2 = t2;
  } });
  var h2 = "/F1 0 Tf 0 g";
  Object.defineProperty(this, "DA", { enumerable: true, configurable: false, get: function() {
    if (!(!h2 || this instanceof yt || this instanceof Nt)) return st(h2, this.objId, this.scope);
  }, set: function(t2) {
    t2 = t2.toString(), h2 = t2;
  } });
  var f2 = null;
  Object.defineProperty(this, "DV", { enumerable: false, configurable: false, get: function() {
    if (f2) return this instanceof mt == 0 ? st(f2, this.objId, this.scope) : f2;
  }, set: function(t2) {
    t2 = t2.toString(), f2 = this instanceof mt == 0 ? "(" === t2.substr(0, 1) ? z(t2.substr(1, t2.length - 2)) : z(t2) : t2;
  } }), Object.defineProperty(this, "defaultValue", { enumerable: true, configurable: true, get: function() {
    return this instanceof mt == 1 ? z(f2.substr(1, f2.length - 1)) : f2;
  }, set: function(t2) {
    t2 = t2.toString(), f2 = this instanceof mt == 1 ? "/" + t2 : t2;
  } });
  var d2 = null;
  Object.defineProperty(this, "_V", { enumerable: false, configurable: false, get: function() {
    if (d2) return d2;
  }, set: function(t2) {
    this.V = t2;
  } }), Object.defineProperty(this, "V", { enumerable: false, configurable: false, get: function() {
    if (d2) return this instanceof mt == 0 ? st(d2, this.objId, this.scope) : d2;
  }, set: function(t2) {
    t2 = t2.toString(), d2 = this instanceof mt == 0 ? "(" === t2.substr(0, 1) ? z(t2.substr(1, t2.length - 2)) : z(t2) : t2;
  } }), Object.defineProperty(this, "value", { enumerable: true, configurable: true, get: function() {
    return this instanceof mt == 1 ? z(d2.substr(1, d2.length - 1)) : d2;
  }, set: function(t2) {
    t2 = t2.toString(), d2 = this instanceof mt == 1 ? "/" + t2 : t2;
  } }), Object.defineProperty(this, "hasAnnotation", { enumerable: true, configurable: true, get: function() {
    return this.Rect;
  } }), Object.defineProperty(this, "Type", { enumerable: true, configurable: false, get: function() {
    return this.hasAnnotation ? "/Annot" : null;
  } }), Object.defineProperty(this, "Subtype", { enumerable: true, configurable: false, get: function() {
    return this.hasAnnotation ? "/Widget" : null;
  } });
  var p2, g2 = false;
  Object.defineProperty(this, "hasAppearanceStream", { enumerable: true, configurable: true, get: function() {
    return g2;
  }, set: function(t2) {
    t2 = Boolean(t2), g2 = t2;
  } }), Object.defineProperty(this, "page", { enumerable: true, configurable: true, get: function() {
    if (p2) return p2;
  }, set: function(t2) {
    p2 = t2;
  } }), Object.defineProperty(this, "readOnly", { enumerable: true, configurable: true, get: function() {
    return Boolean(K(this.Ff, 1));
  }, set: function(t2) {
    true === Boolean(t2) ? this.Ff = Z(this.Ff, 1) : this.Ff = $(this.Ff, 1);
  } }), Object.defineProperty(this, "required", { enumerable: true, configurable: true, get: function() {
    return Boolean(K(this.Ff, 2));
  }, set: function(t2) {
    true === Boolean(t2) ? this.Ff = Z(this.Ff, 2) : this.Ff = $(this.Ff, 2);
  } }), Object.defineProperty(this, "noExport", { enumerable: true, configurable: true, get: function() {
    return Boolean(K(this.Ff, 3));
  }, set: function(t2) {
    true === Boolean(t2) ? this.Ff = Z(this.Ff, 3) : this.Ff = $(this.Ff, 3);
  } });
  var m2 = null;
  Object.defineProperty(this, "Q", { enumerable: true, configurable: false, get: function() {
    if (null !== m2) return m2;
  }, set: function(t2) {
    if (-1 === [0, 1, 2].indexOf(t2)) throw new Error('Invalid value "' + t2 + '" for attribute Q supplied.');
    m2 = t2;
  } }), Object.defineProperty(this, "textAlign", { get: function() {
    var t2;
    switch (m2) {
      case 0:
      default:
        t2 = "left";
        break;
      case 1:
        t2 = "center";
        break;
      case 2:
        t2 = "right";
    }
    return t2;
  }, configurable: true, enumerable: true, set: function(t2) {
    switch (t2) {
      case "right":
      case 2:
        m2 = 2;
        break;
      case "center":
      case 1:
        m2 = 1;
        break;
      default:
        m2 = 0;
    }
  } });
};
W(ht, ut);
var ft = function() {
  ht.call(this), this.FT = "/Ch", this.V = "()", this.fontName = "zapfdingbats";
  var t2 = 0;
  Object.defineProperty(this, "TI", { enumerable: true, configurable: false, get: function() {
    return t2;
  }, set: function(e2) {
    t2 = e2;
  } }), Object.defineProperty(this, "topIndex", { enumerable: true, configurable: true, get: function() {
    return t2;
  }, set: function(e2) {
    t2 = e2;
  } });
  var e = [];
  Object.defineProperty(this, "Opt", { enumerable: true, configurable: false, get: function() {
    return ot(e, this.objId, this.scope);
  }, set: function(t3) {
    var n, r;
    r = [], "string" == typeof (n = t3) && (r = function(t4, e2, n2) {
      n2 || (n2 = 1);
      for (var r2, i2 = []; r2 = e2.exec(t4); ) i2.push(r2[n2]);
      return i2;
    }(n, /\((.*?)\)/g)), e = r;
  } }), this.getOptions = function() {
    return e;
  }, this.setOptions = function(t3) {
    e = t3, this.sort && e.sort();
  }, this.addOption = function(t3) {
    t3 = (t3 = t3 || "").toString(), e.push(t3), this.sort && e.sort();
  }, this.removeOption = function(t3, n) {
    for (n = n || false, t3 = (t3 = t3 || "").toString(); -1 !== e.indexOf(t3) && (e.splice(e.indexOf(t3), 1), false !== n); ) ;
  }, Object.defineProperty(this, "combo", { enumerable: true, configurable: true, get: function() {
    return Boolean(K(this.Ff, 18));
  }, set: function(t3) {
    true === Boolean(t3) ? this.Ff = Z(this.Ff, 18) : this.Ff = $(this.Ff, 18);
  } }), Object.defineProperty(this, "edit", { enumerable: true, configurable: true, get: function() {
    return Boolean(K(this.Ff, 19));
  }, set: function(t3) {
    true === this.combo && (true === Boolean(t3) ? this.Ff = Z(this.Ff, 19) : this.Ff = $(this.Ff, 19));
  } }), Object.defineProperty(this, "sort", { enumerable: true, configurable: true, get: function() {
    return Boolean(K(this.Ff, 20));
  }, set: function(t3) {
    true === Boolean(t3) ? (this.Ff = Z(this.Ff, 20), e.sort()) : this.Ff = $(this.Ff, 20);
  } }), Object.defineProperty(this, "multiSelect", { enumerable: true, configurable: true, get: function() {
    return Boolean(K(this.Ff, 22));
  }, set: function(t3) {
    true === Boolean(t3) ? this.Ff = Z(this.Ff, 22) : this.Ff = $(this.Ff, 22);
  } }), Object.defineProperty(this, "doNotSpellCheck", { enumerable: true, configurable: true, get: function() {
    return Boolean(K(this.Ff, 23));
  }, set: function(t3) {
    true === Boolean(t3) ? this.Ff = Z(this.Ff, 23) : this.Ff = $(this.Ff, 23);
  } }), Object.defineProperty(this, "commitOnSelChange", { enumerable: true, configurable: true, get: function() {
    return Boolean(K(this.Ff, 27));
  }, set: function(t3) {
    true === Boolean(t3) ? this.Ff = Z(this.Ff, 27) : this.Ff = $(this.Ff, 27);
  } }), this.hasAppearanceStream = false;
};
W(ft, ht);
var dt = function() {
  ft.call(this), this.fontName = "helvetica", this.combo = false;
};
W(dt, ft);
var pt = function() {
  dt.call(this), this.combo = true;
};
W(pt, dt);
var gt = function() {
  pt.call(this), this.edit = true;
};
W(gt, pt);
var mt = function() {
  ht.call(this), this.FT = "/Btn", Object.defineProperty(this, "noToggleToOff", { enumerable: true, configurable: true, get: function() {
    return Boolean(K(this.Ff, 15));
  }, set: function(t2) {
    true === Boolean(t2) ? this.Ff = Z(this.Ff, 15) : this.Ff = $(this.Ff, 15);
  } }), Object.defineProperty(this, "radio", { enumerable: true, configurable: true, get: function() {
    return Boolean(K(this.Ff, 16));
  }, set: function(t2) {
    true === Boolean(t2) ? this.Ff = Z(this.Ff, 16) : this.Ff = $(this.Ff, 16);
  } }), Object.defineProperty(this, "pushButton", { enumerable: true, configurable: true, get: function() {
    return Boolean(K(this.Ff, 17));
  }, set: function(t2) {
    true === Boolean(t2) ? this.Ff = Z(this.Ff, 17) : this.Ff = $(this.Ff, 17);
  } }), Object.defineProperty(this, "radioIsUnison", { enumerable: true, configurable: true, get: function() {
    return Boolean(K(this.Ff, 26));
  }, set: function(t2) {
    true === Boolean(t2) ? this.Ff = Z(this.Ff, 26) : this.Ff = $(this.Ff, 26);
  } });
  var e, n = {};
  Object.defineProperty(this, "MK", { enumerable: false, configurable: false, get: function() {
    var t2 = function(t3) {
      return t3;
    };
    if (this.scope && (t2 = this.scope.internal.getEncryptor(this.objId)), 0 !== Object.keys(n).length) {
      var e2, r = [];
      for (e2 in r.push("<<"), n) r.push("/" + e2 + " (" + T(t2(n[e2])) + ")");
      return r.push(">>"), r.join("\n");
    }
  }, set: function(e2) {
    "object" === _typeof(e2) && (n = e2);
  } }), Object.defineProperty(this, "caption", { enumerable: true, configurable: true, get: function() {
    return n.CA || "";
  }, set: function(t2) {
    "string" == typeof t2 && (n.CA = t2);
  } }), Object.defineProperty(this, "AS", { enumerable: false, configurable: false, get: function() {
    return e;
  }, set: function(t2) {
    e = t2;
  } }), Object.defineProperty(this, "appearanceState", { enumerable: true, configurable: true, get: function() {
    return e.substr(1, e.length - 1);
  }, set: function(t2) {
    e = "/" + t2;
  } });
};
W(mt, ht);
var vt = function() {
  mt.call(this), this.pushButton = true;
};
W(vt, mt);
var bt = function() {
  mt.call(this), this.radio = true, this.pushButton = false;
  var t2 = [];
  Object.defineProperty(this, "Kids", { enumerable: true, configurable: false, get: function() {
    return t2;
  }, set: function(e) {
    t2 = void 0 !== e ? e : [];
  } });
};
W(bt, mt);
var yt = function() {
  var e, n;
  ht.call(this), Object.defineProperty(this, "Parent", { enumerable: false, configurable: false, get: function() {
    return e;
  }, set: function(t2) {
    e = t2;
  } }), Object.defineProperty(this, "optionName", { enumerable: false, configurable: true, get: function() {
    return n;
  }, set: function(t2) {
    n = t2;
  } });
  var r, i2 = {};
  Object.defineProperty(this, "MK", { enumerable: false, configurable: false, get: function() {
    var t2 = function(t3) {
      return t3;
    };
    this.scope && (t2 = this.scope.internal.getEncryptor(this.objId));
    var e2, n2 = [];
    for (e2 in n2.push("<<"), i2) n2.push("/" + e2 + " (" + T(t2(i2[e2])) + ")");
    return n2.push(">>"), n2.join("\n");
  }, set: function(e2) {
    "object" === _typeof(e2) && (i2 = e2);
  } }), Object.defineProperty(this, "caption", { enumerable: true, configurable: true, get: function() {
    return i2.CA || "";
  }, set: function(t2) {
    "string" == typeof t2 && (i2.CA = t2);
  } }), Object.defineProperty(this, "AS", { enumerable: false, configurable: false, get: function() {
    return r;
  }, set: function(t2) {
    r = t2;
  } }), Object.defineProperty(this, "appearanceState", { enumerable: true, configurable: true, get: function() {
    return r.substr(1, r.length - 1);
  }, set: function(t2) {
    r = "/" + t2;
  } }), this.caption = "l", this.appearanceState = "Off", this._AppearanceType = xt.RadioButton.Circle, this.appearanceStreamContent = this._AppearanceType.createAppearanceStream(this.optionName);
};
W(yt, ht), bt.prototype.setAppearance = function(t2) {
  if (!("createAppearanceStream" in t2) || !("getCA" in t2)) throw new Error("Couldn't assign Appearance to RadioButton. Appearance was Invalid!");
  for (var e in this.Kids) if (this.Kids.hasOwnProperty(e)) {
    var n = this.Kids[e];
    n.appearanceStreamContent = t2.createAppearanceStream(n.optionName), n.caption = t2.getCA();
  }
}, bt.prototype.createOption = function(t2) {
  var e = new yt();
  return e.Parent = this, e.optionName = t2, this.Kids.push(e), At.call(this.scope, e), e;
};
var wt = function() {
  mt.call(this), this.fontName = "zapfdingbats", this.caption = "3", this.appearanceState = "On", this.value = "On", this.textAlign = "center", this.appearanceStreamContent = xt.CheckBox.createAppearanceStream();
};
W(wt, mt);
var Nt = function() {
  ht.call(this), this.FT = "/Tx", Object.defineProperty(this, "multiline", { enumerable: true, configurable: true, get: function() {
    return Boolean(K(this.Ff, 13));
  }, set: function(t3) {
    true === Boolean(t3) ? this.Ff = Z(this.Ff, 13) : this.Ff = $(this.Ff, 13);
  } }), Object.defineProperty(this, "fileSelect", { enumerable: true, configurable: true, get: function() {
    return Boolean(K(this.Ff, 21));
  }, set: function(t3) {
    true === Boolean(t3) ? this.Ff = Z(this.Ff, 21) : this.Ff = $(this.Ff, 21);
  } }), Object.defineProperty(this, "doNotSpellCheck", { enumerable: true, configurable: true, get: function() {
    return Boolean(K(this.Ff, 23));
  }, set: function(t3) {
    true === Boolean(t3) ? this.Ff = Z(this.Ff, 23) : this.Ff = $(this.Ff, 23);
  } }), Object.defineProperty(this, "doNotScroll", { enumerable: true, configurable: true, get: function() {
    return Boolean(K(this.Ff, 24));
  }, set: function(t3) {
    true === Boolean(t3) ? this.Ff = Z(this.Ff, 24) : this.Ff = $(this.Ff, 24);
  } }), Object.defineProperty(this, "comb", { enumerable: true, configurable: true, get: function() {
    return Boolean(K(this.Ff, 25));
  }, set: function(t3) {
    true === Boolean(t3) ? this.Ff = Z(this.Ff, 25) : this.Ff = $(this.Ff, 25);
  } }), Object.defineProperty(this, "richText", { enumerable: true, configurable: true, get: function() {
    return Boolean(K(this.Ff, 26));
  }, set: function(t3) {
    true === Boolean(t3) ? this.Ff = Z(this.Ff, 26) : this.Ff = $(this.Ff, 26);
  } });
  var t2 = null;
  Object.defineProperty(this, "MaxLen", { enumerable: true, configurable: false, get: function() {
    return t2;
  }, set: function(e) {
    t2 = e;
  } }), Object.defineProperty(this, "maxLength", { enumerable: true, configurable: true, get: function() {
    return t2;
  }, set: function(e) {
    Number.isInteger(e) && (t2 = e);
  } }), Object.defineProperty(this, "hasAppearanceStream", { enumerable: true, configurable: true, get: function() {
    return this.V || this.DV;
  } });
};
W(Nt, ht);
var Lt = function() {
  Nt.call(this), Object.defineProperty(this, "password", { enumerable: true, configurable: true, get: function() {
    return Boolean(K(this.Ff, 14));
  }, set: function(t2) {
    true === Boolean(t2) ? this.Ff = Z(this.Ff, 14) : this.Ff = $(this.Ff, 14);
  } }), this.password = true;
};
W(Lt, Nt);
var xt = { CheckBox: { createAppearanceStream: function() {
  return { N: { On: xt.CheckBox.YesNormal }, D: { On: xt.CheckBox.YesPushDown, Off: xt.CheckBox.OffPushDown } };
}, YesPushDown: function(t2) {
  var e = G(t2);
  e.scope = t2.scope;
  var n = [], r = t2.scope.internal.getFont(t2.fontName, t2.fontStyle).id, i2 = t2.scope.__private__.encodeColorString(t2.color), a2 = et(t2, t2.caption);
  return n.push("0.749023 g"), n.push("0 0 " + U(xt.internal.getWidth(t2)) + " " + U(xt.internal.getHeight(t2)) + " re"), n.push("f"), n.push("BMC"), n.push("q"), n.push("0 0 1 rg"), n.push("/" + r + " " + U(a2.fontSize) + " Tf " + i2), n.push("BT"), n.push(a2.text), n.push("ET"), n.push("Q"), n.push("EMC"), e.stream = n.join("\n"), e;
}, YesNormal: function(t2) {
  var e = G(t2);
  e.scope = t2.scope;
  var n = t2.scope.internal.getFont(t2.fontName, t2.fontStyle).id, r = t2.scope.__private__.encodeColorString(t2.color), i2 = [], a2 = xt.internal.getHeight(t2), o2 = xt.internal.getWidth(t2), s2 = et(t2, t2.caption);
  return i2.push("1 g"), i2.push("0 0 " + U(o2) + " " + U(a2) + " re"), i2.push("f"), i2.push("q"), i2.push("0 0 1 rg"), i2.push("0 0 " + U(o2 - 1) + " " + U(a2 - 1) + " re"), i2.push("W"), i2.push("n"), i2.push("0 g"), i2.push("BT"), i2.push("/" + n + " " + U(s2.fontSize) + " Tf " + r), i2.push(s2.text), i2.push("ET"), i2.push("Q"), e.stream = i2.join("\n"), e;
}, OffPushDown: function(t2) {
  var e = G(t2);
  e.scope = t2.scope;
  var n = [];
  return n.push("0.749023 g"), n.push("0 0 " + U(xt.internal.getWidth(t2)) + " " + U(xt.internal.getHeight(t2)) + " re"), n.push("f"), e.stream = n.join("\n"), e;
} }, RadioButton: { Circle: { createAppearanceStream: function(t2) {
  var e = { D: { Off: xt.RadioButton.Circle.OffPushDown }, N: {} };
  return e.N[t2] = xt.RadioButton.Circle.YesNormal, e.D[t2] = xt.RadioButton.Circle.YesPushDown, e;
}, getCA: function() {
  return "l";
}, YesNormal: function(t2) {
  var e = G(t2);
  e.scope = t2.scope;
  var n = [], r = xt.internal.getWidth(t2) <= xt.internal.getHeight(t2) ? xt.internal.getWidth(t2) / 4 : xt.internal.getHeight(t2) / 4;
  r = Number((0.9 * r).toFixed(5));
  var i2 = xt.internal.Bezier_C, a2 = Number((r * i2).toFixed(5));
  return n.push("q"), n.push("1 0 0 1 " + H(xt.internal.getWidth(t2) / 2) + " " + H(xt.internal.getHeight(t2) / 2) + " cm"), n.push(r + " 0 m"), n.push(r + " " + a2 + " " + a2 + " " + r + " 0 " + r + " c"), n.push("-" + a2 + " " + r + " -" + r + " " + a2 + " -" + r + " 0 c"), n.push("-" + r + " -" + a2 + " -" + a2 + " -" + r + " 0 -" + r + " c"), n.push(a2 + " -" + r + " " + r + " -" + a2 + " " + r + " 0 c"), n.push("f"), n.push("Q"), e.stream = n.join("\n"), e;
}, YesPushDown: function(t2) {
  var e = G(t2);
  e.scope = t2.scope;
  var n = [], r = xt.internal.getWidth(t2) <= xt.internal.getHeight(t2) ? xt.internal.getWidth(t2) / 4 : xt.internal.getHeight(t2) / 4;
  r = Number((0.9 * r).toFixed(5));
  var i2 = Number((2 * r).toFixed(5)), a2 = Number((i2 * xt.internal.Bezier_C).toFixed(5)), o2 = Number((r * xt.internal.Bezier_C).toFixed(5));
  return n.push("0.749023 g"), n.push("q"), n.push("1 0 0 1 " + H(xt.internal.getWidth(t2) / 2) + " " + H(xt.internal.getHeight(t2) / 2) + " cm"), n.push(i2 + " 0 m"), n.push(i2 + " " + a2 + " " + a2 + " " + i2 + " 0 " + i2 + " c"), n.push("-" + a2 + " " + i2 + " -" + i2 + " " + a2 + " -" + i2 + " 0 c"), n.push("-" + i2 + " -" + a2 + " -" + a2 + " -" + i2 + " 0 -" + i2 + " c"), n.push(a2 + " -" + i2 + " " + i2 + " -" + a2 + " " + i2 + " 0 c"), n.push("f"), n.push("Q"), n.push("0 g"), n.push("q"), n.push("1 0 0 1 " + H(xt.internal.getWidth(t2) / 2) + " " + H(xt.internal.getHeight(t2) / 2) + " cm"), n.push(r + " 0 m"), n.push(r + " " + o2 + " " + o2 + " " + r + " 0 " + r + " c"), n.push("-" + o2 + " " + r + " -" + r + " " + o2 + " -" + r + " 0 c"), n.push("-" + r + " -" + o2 + " -" + o2 + " -" + r + " 0 -" + r + " c"), n.push(o2 + " -" + r + " " + r + " -" + o2 + " " + r + " 0 c"), n.push("f"), n.push("Q"), e.stream = n.join("\n"), e;
}, OffPushDown: function(t2) {
  var e = G(t2);
  e.scope = t2.scope;
  var n = [], r = xt.internal.getWidth(t2) <= xt.internal.getHeight(t2) ? xt.internal.getWidth(t2) / 4 : xt.internal.getHeight(t2) / 4;
  r = Number((0.9 * r).toFixed(5));
  var i2 = Number((2 * r).toFixed(5)), a2 = Number((i2 * xt.internal.Bezier_C).toFixed(5));
  return n.push("0.749023 g"), n.push("q"), n.push("1 0 0 1 " + H(xt.internal.getWidth(t2) / 2) + " " + H(xt.internal.getHeight(t2) / 2) + " cm"), n.push(i2 + " 0 m"), n.push(i2 + " " + a2 + " " + a2 + " " + i2 + " 0 " + i2 + " c"), n.push("-" + a2 + " " + i2 + " -" + i2 + " " + a2 + " -" + i2 + " 0 c"), n.push("-" + i2 + " -" + a2 + " -" + a2 + " -" + i2 + " 0 -" + i2 + " c"), n.push(a2 + " -" + i2 + " " + i2 + " -" + a2 + " " + i2 + " 0 c"), n.push("f"), n.push("Q"), e.stream = n.join("\n"), e;
} }, Cross: { createAppearanceStream: function(t2) {
  var e = { D: { Off: xt.RadioButton.Cross.OffPushDown }, N: {} };
  return e.N[t2] = xt.RadioButton.Cross.YesNormal, e.D[t2] = xt.RadioButton.Cross.YesPushDown, e;
}, getCA: function() {
  return "8";
}, YesNormal: function(t2) {
  var e = G(t2);
  e.scope = t2.scope;
  var n = [], r = xt.internal.calculateCross(t2);
  return n.push("q"), n.push("1 1 " + U(xt.internal.getWidth(t2) - 2) + " " + U(xt.internal.getHeight(t2) - 2) + " re"), n.push("W"), n.push("n"), n.push(U(r.x1.x) + " " + U(r.x1.y) + " m"), n.push(U(r.x2.x) + " " + U(r.x2.y) + " l"), n.push(U(r.x4.x) + " " + U(r.x4.y) + " m"), n.push(U(r.x3.x) + " " + U(r.x3.y) + " l"), n.push("s"), n.push("Q"), e.stream = n.join("\n"), e;
}, YesPushDown: function(t2) {
  var e = G(t2);
  e.scope = t2.scope;
  var n = xt.internal.calculateCross(t2), r = [];
  return r.push("0.749023 g"), r.push("0 0 " + U(xt.internal.getWidth(t2)) + " " + U(xt.internal.getHeight(t2)) + " re"), r.push("f"), r.push("q"), r.push("1 1 " + U(xt.internal.getWidth(t2) - 2) + " " + U(xt.internal.getHeight(t2) - 2) + " re"), r.push("W"), r.push("n"), r.push(U(n.x1.x) + " " + U(n.x1.y) + " m"), r.push(U(n.x2.x) + " " + U(n.x2.y) + " l"), r.push(U(n.x4.x) + " " + U(n.x4.y) + " m"), r.push(U(n.x3.x) + " " + U(n.x3.y) + " l"), r.push("s"), r.push("Q"), e.stream = r.join("\n"), e;
}, OffPushDown: function(t2) {
  var e = G(t2);
  e.scope = t2.scope;
  var n = [];
  return n.push("0.749023 g"), n.push("0 0 " + U(xt.internal.getWidth(t2)) + " " + U(xt.internal.getHeight(t2)) + " re"), n.push("f"), e.stream = n.join("\n"), e;
} } }, createDefaultAppearanceStream: function(t2) {
  var e = t2.scope.internal.getFont(t2.fontName, t2.fontStyle).id, n = t2.scope.__private__.encodeColorString(t2.color);
  return "/" + e + " " + t2.fontSize + " Tf " + n;
} };
xt.internal = { Bezier_C: 0.551915024494, calculateCross: function(t2) {
  var e = xt.internal.getWidth(t2), n = xt.internal.getHeight(t2), r = Math.min(e, n);
  return { x1: { x: (e - r) / 2, y: (n - r) / 2 + r }, x2: { x: (e - r) / 2 + r, y: (n - r) / 2 }, x3: { x: (e - r) / 2, y: (n - r) / 2 }, x4: { x: (e - r) / 2 + r, y: (n - r) / 2 + r } };
} }, xt.internal.getWidth = function(e) {
  var n = 0;
  return "object" === _typeof(e) && (n = V(e.Rect[2])), n;
}, xt.internal.getHeight = function(e) {
  var n = 0;
  return "object" === _typeof(e) && (n = V(e.Rect[3])), n;
};
var At = R.addField = function(t2) {
  if (at(this, t2), !(t2 instanceof ht)) throw new Error("Invalid argument passed to jsPDF.addField.");
  var e;
  return (e = t2).scope.internal.acroformPlugin.printedOut && (e.scope.internal.acroformPlugin.printedOut = false, e.scope.internal.acroformPlugin.acroFormDictionaryRoot = null), e.scope.internal.acroformPlugin.acroFormDictionaryRoot.Fields.push(e), t2.page = t2.scope.internal.getCurrentPageInfo().pageNumber, this;
};
R.AcroFormChoiceField = ft, R.AcroFormListBox = dt, R.AcroFormComboBox = pt, R.AcroFormEditBox = gt, R.AcroFormButton = mt, R.AcroFormPushButton = vt, R.AcroFormRadioButton = bt, R.AcroFormCheckBox = wt, R.AcroFormTextField = Nt, R.AcroFormPasswordField = Lt, R.AcroFormAppearance = xt, R.AcroForm = { ChoiceField: ft, ListBox: dt, ComboBox: pt, EditBox: gt, Button: mt, PushButton: vt, RadioButton: bt, CheckBox: wt, TextField: Nt, PasswordField: Lt, Appearance: xt }, E.AcroForm = { ChoiceField: ft, ListBox: dt, ComboBox: pt, EditBox: gt, Button: mt, PushButton: vt, RadioButton: bt, CheckBox: wt, TextField: Nt, PasswordField: Lt, Appearance: xt };
E.AcroForm;
function _t(t2) {
  return t2.reduce(function(t3, e, n) {
    return t3[e] = n, t3;
  }, {});
}
!function(e) {
  var n = "addImage_";
  e.__addimage__ = {};
  var r = "UNKNOWN", i2 = { PNG: [[137, 80, 78, 71]], TIFF: [[77, 77, 0, 42], [73, 73, 42, 0]], JPEG: [[255, 216, 255, 224, void 0, void 0, 74, 70, 73, 70, 0], [255, 216, 255, 225, void 0, void 0, 69, 120, 105, 102, 0, 0], [255, 216, 255, 219], [255, 216, 255, 238]], JPEG2000: [[0, 0, 0, 12, 106, 80, 32, 32]], GIF87a: [[71, 73, 70, 56, 55, 97]], GIF89a: [[71, 73, 70, 56, 57, 97]], WEBP: [[82, 73, 70, 70, void 0, void 0, void 0, void 0, 87, 69, 66, 80]], BMP: [[66, 77], [66, 65], [67, 73], [67, 80], [73, 67], [80, 84]] }, a2 = e.__addimage__.getImageFileTypeByImageData = function(t2, e2) {
    var n2, a3, o3, s3, u3, c3 = r;
    if ("RGBA" === (e2 = e2 || r) || void 0 !== t2.data && t2.data instanceof Uint8ClampedArray && "height" in t2 && "width" in t2) return "RGBA";
    if (A2(t2)) for (u3 in i2) for (o3 = i2[u3], n2 = 0; n2 < o3.length; n2 += 1) {
      for (s3 = true, a3 = 0; a3 < o3[n2].length; a3 += 1) if (void 0 !== o3[n2][a3] && o3[n2][a3] !== t2[a3]) {
        s3 = false;
        break;
      }
      if (true === s3) {
        c3 = u3;
        break;
      }
    }
    else for (u3 in i2) for (o3 = i2[u3], n2 = 0; n2 < o3.length; n2 += 1) {
      for (s3 = true, a3 = 0; a3 < o3[n2].length; a3 += 1) if (void 0 !== o3[n2][a3] && o3[n2][a3] !== t2.charCodeAt(a3)) {
        s3 = false;
        break;
      }
      if (true === s3) {
        c3 = u3;
        break;
      }
    }
    return c3 === r && e2 !== r && (c3 = e2), c3;
  }, o2 = function t2(e2) {
    for (var n2 = this.internal.write, r2 = this.internal.putStream, i3 = (0, this.internal.getFilters)(); -1 !== i3.indexOf("FlateEncode"); ) i3.splice(i3.indexOf("FlateEncode"), 1);
    e2.objectId = this.internal.newObject();
    var a3 = [];
    if (a3.push({ key: "Type", value: "/XObject" }), a3.push({ key: "Subtype", value: "/Image" }), a3.push({ key: "Width", value: e2.width }), a3.push({ key: "Height", value: e2.height }), e2.colorSpace === y2.INDEXED ? a3.push({ key: "ColorSpace", value: "[/Indexed /DeviceRGB " + (e2.palette.length / 3 - 1) + " " + ("sMask" in e2 && void 0 !== e2.sMask ? e2.objectId + 2 : e2.objectId + 1) + " 0 R]" }) : (a3.push({ key: "ColorSpace", value: "/" + e2.colorSpace }), e2.colorSpace === y2.DEVICE_CMYK && a3.push({ key: "Decode", value: "[1 0 1 0 1 0 1 0]" })), a3.push({ key: "BitsPerComponent", value: e2.bitsPerComponent }), "decodeParameters" in e2 && void 0 !== e2.decodeParameters && a3.push({ key: "DecodeParms", value: "<<" + e2.decodeParameters + ">>" }), "transparency" in e2 && Array.isArray(e2.transparency)) {
      for (var o3 = "", s3 = 0, u3 = e2.transparency.length; s3 < u3; s3++) o3 += e2.transparency[s3] + " " + e2.transparency[s3] + " ";
      a3.push({ key: "Mask", value: "[" + o3 + "]" });
    }
    void 0 !== e2.sMask && a3.push({ key: "SMask", value: e2.objectId + 1 + " 0 R" });
    var c3 = void 0 !== e2.filter ? ["/" + e2.filter] : void 0;
    if (r2({ data: e2.data, additionalKeyValues: a3, alreadyAppliedFilters: c3, objectId: e2.objectId }), n2("endobj"), "sMask" in e2 && void 0 !== e2.sMask) {
      var l3 = (null != e2.predictor ? "/Predictor " + e2.predictor : "") + " /Colors 1 /BitsPerComponent 8 /Columns " + e2.width, h3 = { width: e2.width, height: e2.height, colorSpace: "DeviceGray", bitsPerComponent: e2.bitsPerComponent, decodeParameters: l3, data: e2.sMask };
      "filter" in e2 && (h3.filter = e2.filter), t2.call(this, h3);
    }
    if (e2.colorSpace === y2.INDEXED) {
      var f2 = this.internal.newObject();
      r2({ data: _2(new Uint8Array(e2.palette)), objectId: f2 }), n2("endobj");
    }
  }, s2 = function() {
    var t2 = this.internal.collections[n + "images"];
    for (var e2 in t2) o2.call(this, t2[e2]);
  }, u2 = function() {
    var t2, e2 = this.internal.collections[n + "images"], r2 = this.internal.write;
    for (var i3 in e2) r2("/I" + (t2 = e2[i3]).index, t2.objectId, "0", "R");
  }, c2 = function() {
    this.internal.collections[n + "images"] || (this.internal.collections[n + "images"] = {}, this.internal.events.subscribe("putResources", s2), this.internal.events.subscribe("putXobjectDict", u2));
  }, l2 = function() {
    var t2 = this.internal.collections[n + "images"];
    return c2.call(this), t2;
  }, h2 = function() {
    return Object.keys(this.internal.collections[n + "images"]).length;
  }, d2 = function(t2) {
    return "function" == typeof e["process" + t2.toUpperCase()];
  }, p2 = function(e2) {
    return "object" === _typeof(e2) && 1 === e2.nodeType;
  }, g2 = function(t2, n2) {
    if ("IMG" === t2.nodeName && t2.hasAttribute("src")) {
      var r2 = "" + t2.getAttribute("src");
      if (0 === r2.indexOf("data:image/")) return f(unescape(r2).split("base64,").pop());
      var i3 = e.loadFile(r2, true);
      if (void 0 !== i3) return i3;
    }
    if ("CANVAS" === t2.nodeName) {
      if (0 === t2.width || 0 === t2.height) throw new Error("Given canvas must have data. Canvas width: " + t2.width + ", height: " + t2.height);
      var a3;
      switch (n2) {
        case "PNG":
          a3 = "image/png";
          break;
        case "WEBP":
          a3 = "image/webp";
          break;
        default:
          a3 = "image/jpeg";
      }
      return f(t2.toDataURL(a3, 1).split("base64,").pop());
    }
  }, m2 = function(t2) {
    var e2 = this.internal.collections[n + "images"];
    if (e2) {
      for (var r2 in e2) if (t2 === e2[r2].alias) return e2[r2];
    }
  }, v2 = function(t2, e2, n2) {
    return t2 || e2 || (t2 = -96, e2 = -96), t2 < 0 && (t2 = -1 * n2.width * 72 / t2 / this.internal.scaleFactor), e2 < 0 && (e2 = -1 * n2.height * 72 / e2 / this.internal.scaleFactor), 0 === t2 && (t2 = e2 * n2.width / n2.height), 0 === e2 && (e2 = t2 * n2.height / n2.width), [t2, e2];
  }, b2 = function(t2, e2, n2, r2, i3, a3) {
    var o3 = v2.call(this, n2, r2, i3), s3 = this.internal.getCoordinateString, u3 = this.internal.getVerticalCoordinateString, c3 = l2.call(this);
    if (n2 = o3[0], r2 = o3[1], c3[i3.index] = i3, a3) {
      a3 *= Math.PI / 180;
      var h3 = Math.cos(a3), f2 = Math.sin(a3), d3 = function(t3) {
        return t3.toFixed(4);
      }, p3 = [d3(h3), d3(f2), d3(-1 * f2), d3(h3), 0, 0, "cm"];
    }
    this.internal.write("q"), a3 ? (this.internal.write([1, "0", "0", 1, s3(t2), u3(e2 + r2), "cm"].join(" ")), this.internal.write(p3.join(" ")), this.internal.write([s3(n2), "0", "0", s3(r2), "0", "0", "cm"].join(" "))) : this.internal.write([s3(n2), "0", "0", s3(r2), s3(t2), u3(e2 + r2), "cm"].join(" ")), this.isAdvancedAPI() && this.internal.write([1, 0, 0, -1, 0, 0, "cm"].join(" ")), this.internal.write("/I" + i3.index + " Do"), this.internal.write("Q");
  }, y2 = e.color_spaces = { DEVICE_RGB: "DeviceRGB", DEVICE_GRAY: "DeviceGray", DEVICE_CMYK: "DeviceCMYK", CAL_GREY: "CalGray", CAL_RGB: "CalRGB", LAB: "Lab", ICC_BASED: "ICCBased", INDEXED: "Indexed", PATTERN: "Pattern", SEPARATION: "Separation", DEVICE_N: "DeviceN" };
  e.decode = { DCT_DECODE: "DCTDecode", FLATE_DECODE: "FlateDecode", LZW_DECODE: "LZWDecode", JPX_DECODE: "JPXDecode", JBIG2_DECODE: "JBIG2Decode", ASCII85_DECODE: "ASCII85Decode", ASCII_HEX_DECODE: "ASCIIHexDecode", RUN_LENGTH_DECODE: "RunLengthDecode", CCITT_FAX_DECODE: "CCITTFaxDecode" };
  var w2 = e.image_compression = { NONE: "NONE", FAST: "FAST", MEDIUM: "MEDIUM", SLOW: "SLOW" }, N2 = e.__addimage__.sHashCode = function(t2) {
    var e2, n2, r2 = 0;
    if ("string" == typeof t2) for (n2 = t2.length, e2 = 0; e2 < n2; e2++) r2 = (r2 << 5) - r2 + t2.charCodeAt(e2), r2 |= 0;
    else if (A2(t2)) for (n2 = t2.byteLength / 2, e2 = 0; e2 < n2; e2++) r2 = (r2 << 5) - r2 + t2[e2], r2 |= 0;
    return r2;
  }, L2 = e.__addimage__.validateStringAsBase64 = function(t2) {
    (t2 = t2 || "").toString().trim();
    var e2 = true;
    return 0 === t2.length && (e2 = false), t2.length % 4 != 0 && (e2 = false), false === /^[A-Za-z0-9+/]+$/.test(t2.substr(0, t2.length - 2)) && (e2 = false), false === /^[A-Za-z0-9/][A-Za-z0-9+/]|[A-Za-z0-9+/]=|==$/.test(t2.substr(-2)) && (e2 = false), e2;
  }, x2 = e.__addimage__.extractImageFromDataUrl = function(t2) {
    if (null == t2) return null;
    if (!(t2 = t2.trim()).startsWith("data:")) return null;
    var e2 = t2.indexOf(",");
    return e2 < 0 ? null : t2.substring(0, e2).trim().endsWith("base64") ? t2.substring(e2 + 1) : null;
  };
  e.__addimage__.isArrayBuffer = function(t2) {
    return t2 instanceof ArrayBuffer;
  };
  var A2 = e.__addimage__.isArrayBufferView = function(t2) {
    return t2 instanceof Int8Array || t2 instanceof Uint8Array || t2 instanceof Uint8ClampedArray || t2 instanceof Int16Array || t2 instanceof Uint16Array || t2 instanceof Int32Array || t2 instanceof Uint32Array || t2 instanceof Float32Array || t2 instanceof Float64Array;
  }, S2 = e.__addimage__.binaryStringToUint8Array = function(t2) {
    for (var e2 = t2.length, n2 = new Uint8Array(e2), r2 = 0; r2 < e2; r2++) n2[r2] = t2.charCodeAt(r2);
    return n2;
  }, _2 = e.__addimage__.arrayBufferToBinaryString = function(t2) {
    for (var e2 = "", n2 = A2(t2) ? t2 : new Uint8Array(t2), r2 = 0; r2 < n2.length; r2 += 8192) e2 += String.fromCharCode.apply(null, n2.subarray(r2, r2 + 8192));
    return e2;
  };
  e.addImage = function() {
    var e2, n2, i3, a3, o3, s3, u3, l3, h3;
    if ("number" == typeof arguments[1] ? (n2 = r, i3 = arguments[1], a3 = arguments[2], o3 = arguments[3], s3 = arguments[4], u3 = arguments[5], l3 = arguments[6], h3 = arguments[7]) : (n2 = arguments[1], i3 = arguments[2], a3 = arguments[3], o3 = arguments[4], s3 = arguments[5], u3 = arguments[6], l3 = arguments[7], h3 = arguments[8]), "object" === _typeof(e2 = arguments[0]) && !p2(e2) && "imageData" in e2) {
      var f2 = e2;
      e2 = f2.imageData, n2 = f2.format || n2 || r, i3 = f2.x || i3 || 0, a3 = f2.y || a3 || 0, o3 = f2.w || f2.width || o3, s3 = f2.h || f2.height || s3, u3 = f2.alias || u3, l3 = f2.compression || l3, h3 = f2.rotation || f2.angle || h3;
    }
    var d3 = this.internal.getFilters();
    if (void 0 === l3 && -1 !== d3.indexOf("FlateEncode") && (l3 = "SLOW"), isNaN(i3) || isNaN(a3)) throw new Error("Invalid coordinates passed to jsPDF.addImage");
    c2.call(this);
    var g3 = P2.call(this, e2, n2, u3, l3);
    return b2.call(this, i3, a3, o3, s3, g3, h3), this;
  };
  var P2 = function(t2, n2, i3, o3) {
    var s3, u3, c3;
    if ("string" == typeof t2 && a2(t2) === r) {
      t2 = unescape(t2);
      var l3 = k2(t2, false);
      ("" !== l3 || void 0 !== (l3 = e.loadFile(t2, true))) && (t2 = l3);
    }
    if (p2(t2) && (t2 = g2(t2, n2)), n2 = a2(t2, n2), !d2(n2)) throw new Error("addImage does not support files of type '" + n2 + "', please ensure that a plugin for '" + n2 + "' support is added.");
    if ((null == (c3 = i3) || 0 === c3.length) && (i3 = function(t3) {
      return "string" == typeof t3 || A2(t3) ? N2(t3) : A2(t3.data) ? N2(t3.data) : null;
    }(t2)), (s3 = m2.call(this, i3)) || (t2 instanceof Uint8Array || "RGBA" === n2 || (u3 = t2, t2 = S2(t2)), s3 = this["process" + n2.toUpperCase()](t2, h2.call(this), i3, function(t3) {
      return t3 && "string" == typeof t3 && (t3 = t3.toUpperCase()), t3 in e.image_compression ? t3 : w2.NONE;
    }(o3), u3)), !s3) throw new Error("An unknown error occurred whilst processing the image.");
    return s3;
  }, k2 = e.__addimage__.convertBase64ToBinaryString = function(t2, e2) {
    e2 = "boolean" != typeof e2 || e2;
    var n2, r2 = "";
    if ("string" == typeof t2) {
      var i3;
      n2 = null !== (i3 = x2(t2)) && void 0 !== i3 ? i3 : t2;
      try {
        r2 = f(n2);
      } catch (a3) {
        if (e2) throw L2(n2) ? new Error("atob-Error in jsPDF.convertBase64ToBinaryString " + a3.message) : new Error("Supplied Data is not a valid base64-String jsPDF.convertBase64ToBinaryString ");
      }
    }
    return r2;
  };
  e.getImageProperties = function(t2) {
    var n2, i3, o3 = "";
    if (p2(t2) && (t2 = g2(t2)), "string" == typeof t2 && a2(t2) === r && ("" === (o3 = k2(t2, false)) && (o3 = e.loadFile(t2) || ""), t2 = o3), i3 = a2(t2), !d2(i3)) throw new Error("addImage does not support files of type '" + i3 + "', please ensure that a plugin for '" + i3 + "' support is added.");
    if (t2 instanceof Uint8Array || (t2 = S2(t2)), !(n2 = this["process" + i3.toUpperCase()](t2))) throw new Error("An unknown error occurred whilst processing the image");
    return n2.fileType = i3, n2;
  };
}(E.API), /**
 * @license
 * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(t2) {
  var e = function(t3) {
    if (void 0 !== t3 && "" != t3) return true;
  };
  E.API.events.push(["addPage", function(t3) {
    this.internal.getPageInfo(t3.pageNumber).pageContext.annotations = [];
  }]), t2.events.push(["putPage", function(t3) {
    for (var n, r, i2, a2 = this.internal.getCoordinateString, o2 = this.internal.getVerticalCoordinateString, s2 = this.internal.getPageInfoByObjId(t3.objId), u2 = t3.pageContext.annotations, c2 = false, l2 = 0; l2 < u2.length && !c2; l2++) switch ((n = u2[l2]).type) {
      case "link":
        (e(n.options.url) || e(n.options.pageNumber)) && (c2 = true);
        break;
      case "reference":
      case "text":
      case "freetext":
        c2 = true;
    }
    if (0 != c2) {
      this.internal.write("/Annots [");
      for (var h2 = 0; h2 < u2.length; h2++) {
        n = u2[h2];
        var f2 = this.internal.pdfEscape, d2 = this.internal.getEncryptor(t3.objId);
        switch (n.type) {
          case "reference":
            this.internal.write(" " + n.object.objId + " 0 R ");
            break;
          case "text":
            var p2 = this.internal.newAdditionalObject(), g2 = this.internal.newAdditionalObject(), m2 = this.internal.getEncryptor(p2.objId), v2 = n.title || "Note";
            i2 = "<</Type /Annot /Subtype /Text " + (r = "/Rect [" + a2(n.bounds.x) + " " + o2(n.bounds.y + n.bounds.h) + " " + a2(n.bounds.x + n.bounds.w) + " " + o2(n.bounds.y) + "] ") + "/Contents (" + f2(m2(n.contents)) + ")", i2 += " /Popup " + g2.objId + " 0 R", i2 += " /P " + s2.objId + " 0 R", i2 += " /T (" + f2(m2(v2)) + ") >>", p2.content = i2;
            var b2 = p2.objId + " 0 R";
            i2 = "<</Type /Annot /Subtype /Popup " + (r = "/Rect [" + a2(n.bounds.x + 30) + " " + o2(n.bounds.y + n.bounds.h) + " " + a2(n.bounds.x + n.bounds.w + 30) + " " + o2(n.bounds.y) + "] ") + " /Parent " + b2, n.open && (i2 += " /Open true"), i2 += " >>", g2.content = i2, this.internal.write(p2.objId, "0 R", g2.objId, "0 R");
            break;
          case "freetext":
            r = "/Rect [" + a2(n.bounds.x) + " " + o2(n.bounds.y) + " " + a2(n.bounds.x + n.bounds.w) + " " + o2(n.bounds.y + n.bounds.h) + "] ";
            var y2 = n.color || "#000000";
            i2 = "<</Type /Annot /Subtype /FreeText " + r + "/Contents (" + f2(d2(n.contents)) + ")", i2 += " /DS(font: Helvetica,sans-serif 12.0pt; text-align:left; color:#" + y2 + ")", i2 += " /Border [0 0 0]", i2 += " >>", this.internal.write(i2);
            break;
          case "link":
            if (n.options.name) {
              var w2 = this.annotations._nameMap[n.options.name];
              n.options.pageNumber = w2.page, n.options.top = w2.y;
            } else n.options.top || (n.options.top = 0);
            if (r = "/Rect [" + n.finalBounds.x + " " + n.finalBounds.y + " " + n.finalBounds.w + " " + n.finalBounds.h + "] ", i2 = "", n.options.url) i2 = "<</Type /Annot /Subtype /Link " + r + "/Border [0 0 0] /A <</S /URI /URI (" + f2(d2(n.options.url)) + ") >>";
            else if (n.options.pageNumber) switch (i2 = "<</Type /Annot /Subtype /Link " + r + "/Border [0 0 0] /Dest [" + this.internal.getPageInfo(n.options.pageNumber).objId + " 0 R", n.options.magFactor = n.options.magFactor || "XYZ", n.options.magFactor) {
              case "Fit":
                i2 += " /Fit]";
                break;
              case "FitH":
                i2 += " /FitH " + n.options.top + "]";
                break;
              case "FitV":
                n.options.left = n.options.left || 0, i2 += " /FitV " + n.options.left + "]";
                break;
              default:
                var N2 = o2(n.options.top);
                n.options.left = n.options.left || 0, void 0 === n.options.zoom && (n.options.zoom = 0), i2 += " /XYZ " + n.options.left + " " + N2 + " " + n.options.zoom + "]";
            }
            "" != i2 && (i2 += " >>", this.internal.write(i2));
        }
      }
      this.internal.write("]");
    }
  }]), t2.createAnnotation = function(t3) {
    var e2 = this.internal.getCurrentPageInfo();
    switch (t3.type) {
      case "link":
        this.link(t3.bounds.x, t3.bounds.y, t3.bounds.w, t3.bounds.h, t3);
        break;
      case "text":
      case "freetext":
        e2.pageContext.annotations.push(t3);
    }
  }, t2.link = function(t3, e2, n, r, i2) {
    var a2 = this.internal.getCurrentPageInfo(), o2 = this.internal.getCoordinateString, s2 = this.internal.getVerticalCoordinateString;
    a2.pageContext.annotations.push({ finalBounds: { x: o2(t3), y: s2(e2), w: o2(t3 + n), h: s2(e2 + r) }, options: i2, type: "link" });
  }, t2.textWithLink = function(t3, e2, n, r) {
    var i2, a2, o2 = this.getTextWidth(t3), s2 = this.internal.getLineHeight() / this.internal.scaleFactor;
    if (void 0 !== r.maxWidth) {
      a2 = r.maxWidth;
      var u2 = this.splitTextToSize(t3, a2).length;
      i2 = Math.ceil(s2 * u2);
    } else a2 = o2, i2 = s2;
    return this.text(t3, e2, n, r), n += 0.2 * s2, "center" === r.align && (e2 -= o2 / 2), "right" === r.align && (e2 -= o2), this.link(e2, n - s2, a2, i2, r), o2;
  }, t2.getTextWidth = function(t3) {
    var e2 = this.internal.getFontSize();
    return this.getStringUnitWidth(t3) * e2 / this.internal.scaleFactor;
  };
}(E.API), /**
 * @license
 * Copyright (c) 2017 Aras Abbasi
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(t2) {
  var e = { 1569: [65152], 1570: [65153, 65154], 1571: [65155, 65156], 1572: [65157, 65158], 1573: [65159, 65160], 1574: [65161, 65162, 65163, 65164], 1575: [65165, 65166], 1576: [65167, 65168, 65169, 65170], 1577: [65171, 65172], 1578: [65173, 65174, 65175, 65176], 1579: [65177, 65178, 65179, 65180], 1580: [65181, 65182, 65183, 65184], 1581: [65185, 65186, 65187, 65188], 1582: [65189, 65190, 65191, 65192], 1583: [65193, 65194], 1584: [65195, 65196], 1585: [65197, 65198], 1586: [65199, 65200], 1587: [65201, 65202, 65203, 65204], 1588: [65205, 65206, 65207, 65208], 1589: [65209, 65210, 65211, 65212], 1590: [65213, 65214, 65215, 65216], 1591: [65217, 65218, 65219, 65220], 1592: [65221, 65222, 65223, 65224], 1593: [65225, 65226, 65227, 65228], 1594: [65229, 65230, 65231, 65232], 1601: [65233, 65234, 65235, 65236], 1602: [65237, 65238, 65239, 65240], 1603: [65241, 65242, 65243, 65244], 1604: [65245, 65246, 65247, 65248], 1605: [65249, 65250, 65251, 65252], 1606: [65253, 65254, 65255, 65256], 1607: [65257, 65258, 65259, 65260], 1608: [65261, 65262], 1609: [65263, 65264, 64488, 64489], 1610: [65265, 65266, 65267, 65268], 1649: [64336, 64337], 1655: [64477], 1657: [64358, 64359, 64360, 64361], 1658: [64350, 64351, 64352, 64353], 1659: [64338, 64339, 64340, 64341], 1662: [64342, 64343, 64344, 64345], 1663: [64354, 64355, 64356, 64357], 1664: [64346, 64347, 64348, 64349], 1667: [64374, 64375, 64376, 64377], 1668: [64370, 64371, 64372, 64373], 1670: [64378, 64379, 64380, 64381], 1671: [64382, 64383, 64384, 64385], 1672: [64392, 64393], 1676: [64388, 64389], 1677: [64386, 64387], 1678: [64390, 64391], 1681: [64396, 64397], 1688: [64394, 64395], 1700: [64362, 64363, 64364, 64365], 1702: [64366, 64367, 64368, 64369], 1705: [64398, 64399, 64400, 64401], 1709: [64467, 64468, 64469, 64470], 1711: [64402, 64403, 64404, 64405], 1713: [64410, 64411, 64412, 64413], 1715: [64406, 64407, 64408, 64409], 1722: [64414, 64415], 1723: [64416, 64417, 64418, 64419], 1726: [64426, 64427, 64428, 64429], 1728: [64420, 64421], 1729: [64422, 64423, 64424, 64425], 1733: [64480, 64481], 1734: [64473, 64474], 1735: [64471, 64472], 1736: [64475, 64476], 1737: [64482, 64483], 1739: [64478, 64479], 1740: [64508, 64509, 64510, 64511], 1744: [64484, 64485, 64486, 64487], 1746: [64430, 64431], 1747: [64432, 64433] }, n = { 65247: { 65154: 65269, 65156: 65271, 65160: 65273, 65166: 65275 }, 65248: { 65154: 65270, 65156: 65272, 65160: 65274, 65166: 65276 }, 65165: { 65247: { 65248: { 65258: 65010 } } }, 1617: { 1612: 64606, 1613: 64607, 1614: 64608, 1615: 64609, 1616: 64610 } }, r = { 1612: 64606, 1613: 64607, 1614: 64608, 1615: 64609, 1616: 64610 }, i2 = [1570, 1571, 1573, 1575];
  t2.__arabicParser__ = {};
  var a2 = t2.__arabicParser__.isInArabicSubstitutionA = function(t3) {
    return void 0 !== e[t3.charCodeAt(0)];
  }, o2 = t2.__arabicParser__.isArabicLetter = function(t3) {
    return "string" == typeof t3 && /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+$/.test(t3);
  }, s2 = t2.__arabicParser__.isArabicEndLetter = function(t3) {
    return o2(t3) && a2(t3) && e[t3.charCodeAt(0)].length <= 2;
  }, u2 = t2.__arabicParser__.isArabicAlfLetter = function(t3) {
    return o2(t3) && i2.indexOf(t3.charCodeAt(0)) >= 0;
  };
  t2.__arabicParser__.arabicLetterHasIsolatedForm = function(t3) {
    return o2(t3) && a2(t3) && e[t3.charCodeAt(0)].length >= 1;
  };
  var c2 = t2.__arabicParser__.arabicLetterHasFinalForm = function(t3) {
    return o2(t3) && a2(t3) && e[t3.charCodeAt(0)].length >= 2;
  };
  t2.__arabicParser__.arabicLetterHasInitialForm = function(t3) {
    return o2(t3) && a2(t3) && e[t3.charCodeAt(0)].length >= 3;
  };
  var l2 = t2.__arabicParser__.arabicLetterHasMedialForm = function(t3) {
    return o2(t3) && a2(t3) && 4 == e[t3.charCodeAt(0)].length;
  }, h2 = t2.__arabicParser__.resolveLigatures = function(t3) {
    var e2 = 0, r2 = n, i3 = "", a3 = 0;
    for (e2 = 0; e2 < t3.length; e2 += 1) void 0 !== r2[t3.charCodeAt(e2)] ? (a3++, "number" == typeof (r2 = r2[t3.charCodeAt(e2)]) && (i3 += String.fromCharCode(r2), r2 = n, a3 = 0), e2 === t3.length - 1 && (r2 = n, i3 += t3.charAt(e2 - (a3 - 1)), e2 -= a3 - 1, a3 = 0)) : (r2 = n, i3 += t3.charAt(e2 - a3), e2 -= a3, a3 = 0);
    return i3;
  };
  t2.__arabicParser__.isArabicDiacritic = function(t3) {
    return void 0 !== t3 && void 0 !== r[t3.charCodeAt(0)];
  };
  var f2 = t2.__arabicParser__.getCorrectForm = function(t3, e2, n2) {
    return o2(t3) ? false === a2(t3) ? -1 : !c2(t3) || !o2(e2) && !o2(n2) || !o2(n2) && s2(e2) || s2(t3) && !o2(e2) || s2(t3) && u2(e2) || s2(t3) && s2(e2) ? 0 : l2(t3) && o2(e2) && !s2(e2) && o2(n2) && c2(n2) ? 3 : s2(t3) || !o2(n2) ? 1 : 2 : -1;
  }, d2 = function(t3) {
    var n2 = 0, r2 = 0, i3 = 0, a3 = "", s3 = "", u3 = "", c3 = (t3 = t3 || "").split("\\s+"), l3 = [];
    for (n2 = 0; n2 < c3.length; n2 += 1) {
      for (l3.push(""), r2 = 0; r2 < c3[n2].length; r2 += 1) a3 = c3[n2][r2], s3 = c3[n2][r2 - 1], u3 = c3[n2][r2 + 1], o2(a3) ? (i3 = f2(a3, s3, u3), l3[n2] += -1 !== i3 ? String.fromCharCode(e[a3.charCodeAt(0)][i3]) : a3) : l3[n2] += a3;
      l3[n2] = h2(l3[n2]);
    }
    return l3.join(" ");
  }, p2 = t2.__arabicParser__.processArabic = t2.processArabic = function() {
    var t3, e2 = "string" == typeof arguments[0] ? arguments[0] : arguments[0].text, n2 = [];
    if (Array.isArray(e2)) {
      var r2 = 0;
      for (n2 = [], r2 = 0; r2 < e2.length; r2 += 1) Array.isArray(e2[r2]) ? n2.push([d2(e2[r2][0]), e2[r2][1], e2[r2][2]]) : n2.push([d2(e2[r2])]);
      t3 = n2;
    } else t3 = d2(e2);
    return "string" == typeof arguments[0] ? t3 : (arguments[0].text = t3, arguments[0]);
  };
  t2.events.push(["preProcessText", p2]);
}(E.API), E.API.autoPrint = function(t2) {
  var e;
  return (t2 = t2 || {}).variant = t2.variant || "non-conform", "javascript" === t2.variant ? this.addJS("print({});") : (this.internal.events.subscribe("postPutResources", function() {
    e = this.internal.newObject(), this.internal.out("<<"), this.internal.out("/S /Named"), this.internal.out("/Type /Action"), this.internal.out("/N /Print"), this.internal.out(">>"), this.internal.out("endobj");
  }), this.internal.events.subscribe("putCatalog", function() {
    this.internal.out("/OpenAction " + e + " 0 R");
  })), this;
}, /**
 * @license
 * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(t2) {
  var e = function() {
    var t3 = void 0;
    Object.defineProperty(this, "pdf", { get: function() {
      return t3;
    }, set: function(e3) {
      t3 = e3;
    } });
    var e2 = 150;
    Object.defineProperty(this, "width", { get: function() {
      return e2;
    }, set: function(t4) {
      e2 = isNaN(t4) || false === Number.isInteger(t4) || t4 < 0 ? 150 : t4, this.getContext("2d").pageWrapXEnabled && (this.getContext("2d").pageWrapX = e2 + 1);
    } });
    var n = 300;
    Object.defineProperty(this, "height", { get: function() {
      return n;
    }, set: function(t4) {
      n = isNaN(t4) || false === Number.isInteger(t4) || t4 < 0 ? 300 : t4, this.getContext("2d").pageWrapYEnabled && (this.getContext("2d").pageWrapY = n + 1);
    } });
    var r = [];
    Object.defineProperty(this, "childNodes", { get: function() {
      return r;
    }, set: function(t4) {
      r = t4;
    } });
    var i2 = {};
    Object.defineProperty(this, "style", { get: function() {
      return i2;
    }, set: function(t4) {
      i2 = t4;
    } }), Object.defineProperty(this, "parentNode", {});
  };
  e.prototype.getContext = function(t3, e2) {
    var n;
    if ("2d" !== (t3 = t3 || "2d")) return null;
    for (n in e2) this.pdf.context2d.hasOwnProperty(n) && (this.pdf.context2d[n] = e2[n]);
    return this.pdf.context2d._canvas = this, this.pdf.context2d;
  }, e.prototype.toDataURL = function() {
    throw new Error("toDataURL is not implemented.");
  }, t2.events.push(["initialized", function() {
    this.canvas = new e(), this.canvas.pdf = this;
  }]);
}(E.API), function(e) {
  var n = { left: 0, top: 0, bottom: 0, right: 0 }, r = false, i2 = function() {
    void 0 === this.internal.__cell__ && (this.internal.__cell__ = {}, this.internal.__cell__.padding = 3, this.internal.__cell__.headerFunction = void 0, this.internal.__cell__.margins = Object.assign({}, n), this.internal.__cell__.margins.width = this.getPageWidth(), a2.call(this));
  }, a2 = function() {
    this.internal.__cell__.lastCell = new o2(), this.internal.__cell__.pages = 1;
  }, o2 = function() {
    var t2 = arguments[0];
    Object.defineProperty(this, "x", { enumerable: true, get: function() {
      return t2;
    }, set: function(e3) {
      t2 = e3;
    } });
    var e2 = arguments[1];
    Object.defineProperty(this, "y", { enumerable: true, get: function() {
      return e2;
    }, set: function(t3) {
      e2 = t3;
    } });
    var n2 = arguments[2];
    Object.defineProperty(this, "width", { enumerable: true, get: function() {
      return n2;
    }, set: function(t3) {
      n2 = t3;
    } });
    var r2 = arguments[3];
    Object.defineProperty(this, "height", { enumerable: true, get: function() {
      return r2;
    }, set: function(t3) {
      r2 = t3;
    } });
    var i3 = arguments[4];
    Object.defineProperty(this, "text", { enumerable: true, get: function() {
      return i3;
    }, set: function(t3) {
      i3 = t3;
    } });
    var a3 = arguments[5];
    Object.defineProperty(this, "lineNumber", { enumerable: true, get: function() {
      return a3;
    }, set: function(t3) {
      a3 = t3;
    } });
    var o3 = arguments[6];
    return Object.defineProperty(this, "align", { enumerable: true, get: function() {
      return o3;
    }, set: function(t3) {
      o3 = t3;
    } }), this;
  };
  o2.prototype.clone = function() {
    return new o2(this.x, this.y, this.width, this.height, this.text, this.lineNumber, this.align);
  }, o2.prototype.toArray = function() {
    return [this.x, this.y, this.width, this.height, this.text, this.lineNumber, this.align];
  }, e.setHeaderFunction = function(t2) {
    return i2.call(this), this.internal.__cell__.headerFunction = "function" == typeof t2 ? t2 : void 0, this;
  }, e.getTextDimensions = function(t2, e2) {
    i2.call(this);
    var n2 = (e2 = e2 || {}).fontSize || this.getFontSize(), r2 = e2.font || this.getFont(), a3 = e2.scaleFactor || this.internal.scaleFactor, o3 = 0, s3 = 0, u3 = 0, c2 = this;
    if (!Array.isArray(t2) && "string" != typeof t2) {
      if ("number" != typeof t2) throw new Error("getTextDimensions expects text-parameter to be of type String or type Number or an Array of Strings.");
      t2 = String(t2);
    }
    var l2 = e2.maxWidth;
    l2 > 0 ? "string" == typeof t2 ? t2 = this.splitTextToSize(t2, l2) : "[object Array]" === Object.prototype.toString.call(t2) && (t2 = t2.reduce(function(t3, e3) {
      return t3.concat(c2.splitTextToSize(e3, l2));
    }, [])) : t2 = Array.isArray(t2) ? t2 : [t2];
    for (var h2 = 0; h2 < t2.length; h2++) o3 < (u3 = this.getStringUnitWidth(t2[h2], { font: r2 }) * n2) && (o3 = u3);
    return 0 !== o3 && (s3 = t2.length), { w: o3 /= a3, h: Math.max((s3 * n2 * this.getLineHeightFactor() - n2 * (this.getLineHeightFactor() - 1)) / a3, 0) };
  }, e.cellAddPage = function() {
    i2.call(this), this.addPage();
    var t2 = this.internal.__cell__.margins || n;
    return this.internal.__cell__.lastCell = new o2(t2.left, t2.top, void 0, void 0), this.internal.__cell__.pages += 1, this;
  };
  var s2 = e.cell = function() {
    var t2;
    t2 = arguments[0] instanceof o2 ? arguments[0] : new o2(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]), i2.call(this);
    var e2 = this.internal.__cell__.lastCell, a3 = this.internal.__cell__.padding, s3 = this.internal.__cell__.margins || n, u3 = this.internal.__cell__.tableHeaderRow, c2 = this.internal.__cell__.printHeaders;
    return void 0 !== e2.lineNumber && (e2.lineNumber === t2.lineNumber ? (t2.x = (e2.x || 0) + (e2.width || 0), t2.y = e2.y || 0) : e2.y + e2.height + t2.height + s3.bottom > this.getPageHeight() ? (this.cellAddPage(), t2.y = s3.top, c2 && u3 && (this.printHeaderRow(t2.lineNumber, true), t2.y += u3[0].height)) : t2.y = e2.y + e2.height || t2.y), void 0 !== t2.text[0] && (this.rect(t2.x, t2.y, t2.width, t2.height, true === r ? "FD" : void 0), "right" === t2.align ? this.text(t2.text, t2.x + t2.width - a3, t2.y + a3, { align: "right", baseline: "top" }) : "center" === t2.align ? this.text(t2.text, t2.x + t2.width / 2, t2.y + a3, { align: "center", baseline: "top", maxWidth: t2.width - a3 - a3 }) : this.text(t2.text, t2.x + a3, t2.y + a3, { align: "left", baseline: "top", maxWidth: t2.width - a3 - a3 })), this.internal.__cell__.lastCell = t2, this;
  };
  e.table = function(e2, r2, c2, l2, h2) {
    if (i2.call(this), !c2) throw new Error("No data for PDF table.");
    var f2, d2, p2, g2, m2 = [], v2 = [], b2 = [], y2 = {}, w2 = {}, N2 = [], L2 = [], x2 = (h2 = h2 || {}).autoSize || false, A2 = false !== h2.printHeaders, S2 = h2.css && void 0 !== h2.css["font-size"] ? 16 * h2.css["font-size"] : h2.fontSize || 12, _2 = h2.margins || Object.assign({ width: this.getPageWidth() }, n), P2 = "number" == typeof h2.padding ? h2.padding : 3, k2 = h2.headerBackgroundColor || "#c8c8c8", F2 = h2.headerTextColor || "#000";
    if (a2.call(this), this.internal.__cell__.printHeaders = A2, this.internal.__cell__.margins = _2, this.internal.__cell__.table_font_size = S2, this.internal.__cell__.padding = P2, this.internal.__cell__.headerBackgroundColor = k2, this.internal.__cell__.headerTextColor = F2, this.setFontSize(S2), null == l2) v2 = m2 = Object.keys(c2[0]), b2 = m2.map(function() {
      return "left";
    });
    else if (Array.isArray(l2) && "object" === _typeof(l2[0])) for (m2 = l2.map(function(t2) {
      return t2.name;
    }), v2 = l2.map(function(t2) {
      return t2.prompt || t2.name || "";
    }), b2 = l2.map(function(t2) {
      return t2.align || "left";
    }), f2 = 0; f2 < l2.length; f2 += 1) w2[l2[f2].name] = 0.7499990551181103 * l2[f2].width;
    else Array.isArray(l2) && "string" == typeof l2[0] && (v2 = m2 = l2, b2 = m2.map(function() {
      return "left";
    }));
    if (x2 || Array.isArray(l2) && "string" == typeof l2[0]) for (f2 = 0; f2 < m2.length; f2 += 1) {
      for (y2[g2 = m2[f2]] = c2.map(function(t2) {
        return t2[g2];
      }), this.setFont(void 0, "bold"), N2.push(this.getTextDimensions(v2[f2], { fontSize: this.internal.__cell__.table_font_size, scaleFactor: this.internal.scaleFactor }).w), d2 = y2[g2], this.setFont(void 0, "normal"), p2 = 0; p2 < d2.length; p2 += 1) N2.push(this.getTextDimensions(d2[p2], { fontSize: this.internal.__cell__.table_font_size, scaleFactor: this.internal.scaleFactor }).w);
      w2[g2] = Math.max.apply(null, N2) + P2 + P2, N2 = [];
    }
    if (A2) {
      var I2 = {};
      for (f2 = 0; f2 < m2.length; f2 += 1) I2[m2[f2]] = {}, I2[m2[f2]].text = v2[f2], I2[m2[f2]].align = b2[f2];
      var j2 = u2.call(this, I2, w2);
      L2 = m2.map(function(t2) {
        return new o2(e2, r2, w2[t2], j2, I2[t2].text, void 0, I2[t2].align);
      }), this.setTableHeaderRow(L2), this.printHeaderRow(1, false);
    }
    var C2 = l2.reduce(function(t2, e3) {
      return t2[e3.name] = e3.align, t2;
    }, {});
    for (f2 = 0; f2 < c2.length; f2 += 1) {
      "rowStart" in h2 && h2.rowStart instanceof Function && h2.rowStart({ row: f2, data: c2[f2] }, this);
      var O2 = u2.call(this, c2[f2], w2);
      for (p2 = 0; p2 < m2.length; p2 += 1) {
        var B2 = c2[f2][m2[p2]];
        "cellStart" in h2 && h2.cellStart instanceof Function && h2.cellStart({ row: f2, col: p2, data: B2 }, this), s2.call(this, new o2(e2, r2, w2[m2[p2]], O2, B2, f2 + 2, C2[m2[p2]]));
      }
    }
    return this.internal.__cell__.table_x = e2, this.internal.__cell__.table_y = r2, this;
  };
  var u2 = function(t2, e2) {
    var n2 = this.internal.__cell__.padding, r2 = this.internal.__cell__.table_font_size, i3 = this.internal.scaleFactor;
    return Object.keys(t2).map(function(r3) {
      var i4 = t2[r3];
      return this.splitTextToSize(i4.hasOwnProperty("text") ? i4.text : i4, e2[r3] - n2 - n2);
    }, this).map(function(t3) {
      return this.getLineHeightFactor() * t3.length * r2 / i3 + n2 + n2;
    }, this).reduce(function(t3, e3) {
      return Math.max(t3, e3);
    }, 0);
  };
  e.setTableHeaderRow = function(t2) {
    i2.call(this), this.internal.__cell__.tableHeaderRow = t2;
  }, e.printHeaderRow = function(t2, e2) {
    if (i2.call(this), !this.internal.__cell__.tableHeaderRow) throw new Error("Property tableHeaderRow does not exist.");
    var n2;
    if (r = true, "function" == typeof this.internal.__cell__.headerFunction) {
      var a3 = this.internal.__cell__.headerFunction(this, this.internal.__cell__.pages);
      this.internal.__cell__.lastCell = new o2(a3[0], a3[1], a3[2], a3[3], void 0, -1);
    }
    this.setFont(void 0, "bold");
    for (var u3 = [], c2 = 0; c2 < this.internal.__cell__.tableHeaderRow.length; c2 += 1) {
      n2 = this.internal.__cell__.tableHeaderRow[c2].clone(), e2 && (n2.y = this.internal.__cell__.margins.top || 0, u3.push(n2)), n2.lineNumber = t2;
      var l2 = this.getTextColor();
      this.setTextColor(this.internal.__cell__.headerTextColor), this.setFillColor(this.internal.__cell__.headerBackgroundColor), s2.call(this, n2), this.setTextColor(l2);
    }
    u3.length > 0 && this.setTableHeaderRow(u3), this.setFont(void 0, "normal"), r = false;
  };
}(E.API);
var Pt = { italic: ["italic", "oblique", "normal"], oblique: ["oblique", "italic", "normal"], normal: ["normal", "oblique", "italic"] }, kt = ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded"], Ft = _t(kt), It = [100, 200, 300, 400, 500, 600, 700, 800, 900], jt = _t(It);
function Ct(t2) {
  var e = t2.family.replace(/"|'/g, "").toLowerCase(), n = function(t3) {
    return Pt[t3 = t3 || "normal"] ? t3 : "normal";
  }(t2.style), r = function(t3) {
    return t3 ? "number" == typeof t3 ? t3 >= 100 && t3 <= 900 && t3 % 100 == 0 ? t3 : 400 : /^\d00$/.test(t3) ? parseInt(t3) : "bold" === t3 ? 700 : 400 : 400;
  }(t2.weight), i2 = function(t3) {
    return "number" == typeof Ft[t3 = t3 || "normal"] ? t3 : "normal";
  }(t2.stretch);
  return { family: e, style: n, weight: r, stretch: i2, src: t2.src || [], ref: t2.ref || { name: e, style: [i2, n, r].join(" ") } };
}
function Ot(t2, e, n, r) {
  var i2;
  for (i2 = n; i2 >= 0 && i2 < e.length; i2 += r) if (t2[e[i2]]) return t2[e[i2]];
  for (i2 = n; i2 >= 0 && i2 < e.length; i2 -= r) if (t2[e[i2]]) return t2[e[i2]];
}
var Bt = { "sans-serif": "helvetica", fixed: "courier", monospace: "courier", terminal: "courier", cursive: "times", fantasy: "times", serif: "times" }, Mt = { caption: "times", icon: "times", menu: "times", "message-box": "times", "small-caption": "times", "status-bar": "times" };
function qt(t2) {
  return [t2.stretch, t2.style, t2.weight, t2.family].join(" ");
}
function Et(t2) {
  return t2.trimLeft();
}
function Rt(t2, e) {
  for (var n = 0; n < t2.length; ) {
    if (t2.charAt(n) === e) return [t2.substring(0, n), t2.substring(n + 1)];
    n += 1;
  }
  return null;
}
function Dt(t2) {
  var e = t2.match(/^(-[a-z_]|[a-z_])[a-z0-9_-]*/i);
  return null === e ? null : [e[0], t2.substring(e[0].length)];
}
var Tt, zt, Ut, Ht, Wt, Vt, Gt, Yt, Jt = ["times"];
function Xt(t2, n, r, i2) {
  var a2 = 4, o2 = $t;
  switch (i2) {
    case E.API.image_compression.FAST:
      a2 = 1, o2 = Zt;
      break;
    case E.API.image_compression.MEDIUM:
      a2 = 6, o2 = Qt;
      break;
    case E.API.image_compression.SLOW:
      a2 = 9, o2 = te;
  }
  t2 = function(t3, e, n2, r2) {
    for (var i3, a3 = t3.length / e, o3 = new Uint8Array(t3.length + a3), s3 = [Kt, Zt, $t, Qt, te], u2 = 0; u2 < a3; u2 += 1) {
      var c2 = u2 * e, l2 = t3.subarray(c2, c2 + e);
      if (r2) o3.set(r2(l2, n2, i3), c2 + u2);
      else {
        for (var h2 = s3.length, f2 = [], d2 = 0; d2 < h2; d2 += 1) f2[d2] = s3[d2](l2, n2, i3);
        var p2 = ne(f2.concat());
        o3.set(f2[p2], c2 + u2);
      }
      i3 = l2;
    }
    return o3;
  }(t2, n, r, o2);
  var s2 = zlibSync(t2, { level: a2 });
  return E.API.__addimage__.arrayBufferToBinaryString(s2);
}
function Kt(t2) {
  var e = Array.apply([], t2);
  return e.unshift(0), e;
}
function Zt(t2, e) {
  var n = t2.length, r = [];
  r[0] = 1;
  for (var i2 = 0; i2 < n; i2 += 1) {
    var a2 = t2[i2 - e] || 0;
    r[i2 + 1] = t2[i2] - a2 + 256 & 255;
  }
  return r;
}
function $t(t2, e, n) {
  var r = t2.length, i2 = [];
  i2[0] = 2;
  for (var a2 = 0; a2 < r; a2 += 1) {
    var o2 = n && n[a2] || 0;
    i2[a2 + 1] = t2[a2] - o2 + 256 & 255;
  }
  return i2;
}
function Qt(t2, e, n) {
  var r = t2.length, i2 = [];
  i2[0] = 3;
  for (var a2 = 0; a2 < r; a2 += 1) {
    var o2 = t2[a2 - e] || 0, s2 = n && n[a2] || 0;
    i2[a2 + 1] = t2[a2] + 256 - (o2 + s2 >>> 1) & 255;
  }
  return i2;
}
function te(t2, e, n) {
  var r = t2.length, i2 = [];
  i2[0] = 4;
  for (var a2 = 0; a2 < r; a2 += 1) {
    var o2 = ee(t2[a2 - e] || 0, n && n[a2] || 0, n && n[a2 - e] || 0);
    i2[a2 + 1] = t2[a2] - o2 + 256 & 255;
  }
  return i2;
}
function ee(t2, e, n) {
  if (t2 === e && e === n) return t2;
  var r = Math.abs(e - n), i2 = Math.abs(t2 - n), a2 = Math.abs(t2 + e - n - n);
  return r <= i2 && r <= a2 ? t2 : i2 <= a2 ? e : n;
}
function ne(t2) {
  var e = t2.map(function(t3) {
    return t3.reduce(function(t4, e2) {
      return t4 + Math.abs(e2);
    }, 0);
  });
  return e.indexOf(Math.min.apply(null, e));
}
function re(t2, e, n) {
  var r = e * n, i2 = Math.floor(r / 8), a2 = 16 - (r - 8 * i2 + n), o2 = (1 << n) - 1;
  return ae(t2, i2) >> a2 & o2;
}
function ie(t2, e, n, r) {
  var i2 = n * r, a2 = Math.floor(i2 / 8), o2 = 16 - (i2 - 8 * a2 + r), s2 = (1 << r) - 1, u2 = (e & s2) << o2;
  !function(t3, e2, n2) {
    if (e2 + 1 < t3.byteLength) t3.setUint16(e2, n2, false);
    else {
      var r2 = n2 >> 8 & 255;
      t3.setUint8(e2, r2);
    }
  }(t2, a2, ae(t2, a2) & ~(s2 << o2) & 65535 | u2);
}
function ae(t2, e) {
  return e + 1 < t2.byteLength ? t2.getUint16(e, false) : t2.getUint8(e) << 8;
}
function oe(t2) {
  var e = 0;
  if (71 !== t2[e++] || 73 !== t2[e++] || 70 !== t2[e++] || 56 !== t2[e++] || 56 != (t2[e++] + 1 & 253) || 97 !== t2[e++]) throw new Error("Invalid GIF 87a/89a header.");
  var n = t2[e++] | t2[e++] << 8, r = t2[e++] | t2[e++] << 8, i2 = t2[e++], a2 = i2 >> 7, o2 = 1 << 1 + (7 & i2);
  t2[e++], t2[e++];
  var s2 = null, u2 = null;
  a2 && (s2 = e, u2 = o2, e += 3 * o2);
  var c2 = true, l2 = [], h2 = 0, f2 = null, d2 = 0, p2 = null;
  for (this.width = n, this.height = r; c2 && e < t2.length; ) switch (t2[e++]) {
    case 33:
      switch (t2[e++]) {
        case 255:
          if (11 !== t2[e] || 78 == t2[e + 1] && 69 == t2[e + 2] && 84 == t2[e + 3] && 83 == t2[e + 4] && 67 == t2[e + 5] && 65 == t2[e + 6] && 80 == t2[e + 7] && 69 == t2[e + 8] && 50 == t2[e + 9] && 46 == t2[e + 10] && 48 == t2[e + 11] && 3 == t2[e + 12] && 1 == t2[e + 13] && 0 == t2[e + 16]) e += 14, p2 = t2[e++] | t2[e++] << 8, e++;
          else for (e += 12; ; ) {
            if (!((P2 = t2[e++]) >= 0)) throw Error("Invalid block size");
            if (0 === P2) break;
            e += P2;
          }
          break;
        case 249:
          if (4 !== t2[e++] || 0 !== t2[e + 4]) throw new Error("Invalid graphics extension block.");
          var g2 = t2[e++];
          h2 = t2[e++] | t2[e++] << 8, f2 = t2[e++], 1 & g2 || (f2 = null), d2 = g2 >> 2 & 7, e++;
          break;
        case 254:
          for (; ; ) {
            if (!((P2 = t2[e++]) >= 0)) throw Error("Invalid block size");
            if (0 === P2) break;
            e += P2;
          }
          break;
        default:
          throw new Error("Unknown graphic control label: 0x" + t2[e - 1].toString(16));
      }
      break;
    case 44:
      var m2 = t2[e++] | t2[e++] << 8, v2 = t2[e++] | t2[e++] << 8, b2 = t2[e++] | t2[e++] << 8, y2 = t2[e++] | t2[e++] << 8, w2 = t2[e++], N2 = w2 >> 6 & 1, L2 = 1 << 1 + (7 & w2), x2 = s2, A2 = u2, S2 = false;
      w2 >> 7 && (S2 = true, x2 = e, A2 = L2, e += 3 * L2);
      var _2 = e;
      for (e++; ; ) {
        var P2;
        if (!((P2 = t2[e++]) >= 0)) throw Error("Invalid block size");
        if (0 === P2) break;
        e += P2;
      }
      l2.push({ x: m2, y: v2, width: b2, height: y2, has_local_palette: S2, palette_offset: x2, palette_size: A2, data_offset: _2, data_length: e - _2, transparent_index: f2, interlaced: !!N2, delay: h2, disposal: d2 });
      break;
    case 59:
      c2 = false;
      break;
    default:
      throw new Error("Unknown gif block: 0x" + t2[e - 1].toString(16));
  }
  this.numFrames = function() {
    return l2.length;
  }, this.loopCount = function() {
    return p2;
  }, this.frameInfo = function(t3) {
    if (t3 < 0 || t3 >= l2.length) throw new Error("Frame index out of range.");
    return l2[t3];
  }, this.decodeAndBlitFrameBGRA = function(e2, r2) {
    var i3 = this.frameInfo(e2), a3 = i3.width * i3.height, o3 = new Uint8Array(a3);
    se(t2, i3.data_offset, o3, a3);
    var s3 = i3.palette_offset, u3 = i3.transparent_index;
    null === u3 && (u3 = 256);
    var c3 = i3.width, l3 = n - c3, h3 = c3, f3 = 4 * (i3.y * n + i3.x), d3 = 4 * ((i3.y + i3.height) * n + i3.x), p3 = f3, g3 = 4 * l3;
    true === i3.interlaced && (g3 += 4 * n * 7);
    for (var m3 = 8, v3 = 0, b3 = o3.length; v3 < b3; ++v3) {
      var y3 = o3[v3];
      if (0 === h3 && (h3 = c3, (p3 += g3) >= d3 && (g3 = 4 * l3 + 4 * n * (m3 - 1), p3 = f3 + (c3 + l3) * (m3 << 1), m3 >>= 1)), y3 === u3) p3 += 4;
      else {
        var w3 = t2[s3 + 3 * y3], N3 = t2[s3 + 3 * y3 + 1], L3 = t2[s3 + 3 * y3 + 2];
        r2[p3++] = L3, r2[p3++] = N3, r2[p3++] = w3, r2[p3++] = 255;
      }
      --h3;
    }
  }, this.decodeAndBlitFrameRGBA = function(e2, r2) {
    var i3 = this.frameInfo(e2), a3 = i3.width * i3.height, o3 = new Uint8Array(a3);
    se(t2, i3.data_offset, o3, a3);
    var s3 = i3.palette_offset, u3 = i3.transparent_index;
    null === u3 && (u3 = 256);
    var c3 = i3.width, l3 = n - c3, h3 = c3, f3 = 4 * (i3.y * n + i3.x), d3 = 4 * ((i3.y + i3.height) * n + i3.x), p3 = f3, g3 = 4 * l3;
    true === i3.interlaced && (g3 += 4 * n * 7);
    for (var m3 = 8, v3 = 0, b3 = o3.length; v3 < b3; ++v3) {
      var y3 = o3[v3];
      if (0 === h3 && (h3 = c3, (p3 += g3) >= d3 && (g3 = 4 * l3 + 4 * n * (m3 - 1), p3 = f3 + (c3 + l3) * (m3 << 1), m3 >>= 1)), y3 === u3) p3 += 4;
      else {
        var w3 = t2[s3 + 3 * y3], N3 = t2[s3 + 3 * y3 + 1], L3 = t2[s3 + 3 * y3 + 2];
        r2[p3++] = w3, r2[p3++] = N3, r2[p3++] = L3, r2[p3++] = 255;
      }
      --h3;
    }
  };
}
function se(t2, e, n, r) {
  for (var i2 = t2[e++], a2 = 1 << i2, s2 = a2 + 1, u2 = s2 + 1, c2 = i2 + 1, l2 = (1 << c2) - 1, h2 = 0, f2 = 0, d2 = 0, p2 = t2[e++], g2 = new Int32Array(4096), m2 = null; ; ) {
    for (; h2 < 16 && 0 !== p2; ) f2 |= t2[e++] << h2, h2 += 8, 1 === p2 ? p2 = t2[e++] : --p2;
    if (h2 < c2) break;
    var v2 = f2 & l2;
    if (f2 >>= c2, h2 -= c2, v2 !== a2) {
      if (v2 === s2) break;
      for (var b2 = v2 < u2 ? v2 : m2, y2 = 0, w2 = b2; w2 > a2; ) w2 = g2[w2] >> 8, ++y2;
      var N2 = w2;
      if (d2 + y2 + (b2 !== v2 ? 1 : 0) > r) return void o.log("Warning, gif stream longer than expected.");
      n[d2++] = N2;
      var L2 = d2 += y2;
      for (b2 !== v2 && (n[d2++] = N2), w2 = b2; y2--; ) w2 = g2[w2], n[--L2] = 255 & w2, w2 >>= 8;
      null !== m2 && u2 < 4096 && (g2[u2++] = m2 << 8 | N2, u2 >= l2 + 1 && c2 < 12 && (++c2, l2 = l2 << 1 | 1)), m2 = v2;
    } else u2 = s2 + 1, l2 = (1 << (c2 = i2 + 1)) - 1, m2 = null;
  }
  return d2 !== r && o.log("Warning, gif stream shorter than expected."), n;
}
/**
 * @license
  Copyright (c) 2008, Adobe Systems Incorporated
  All rights reserved.

  Redistribution and use in source and binary forms, with or without 
  modification, are permitted provided that the following conditions are
  met:

  * Redistributions of source code must retain the above copyright notice, 
    this list of conditions and the following disclaimer.
  
  * Redistributions in binary form must reproduce the above copyright
    notice, this list of conditions and the following disclaimer in the 
    documentation and/or other materials provided with the distribution.
  
  * Neither the name of Adobe Systems Incorporated nor the names of its 
    contributors may be used to endorse or promote products derived from 
    this software without specific prior written permission.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
  IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
  THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
  PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR 
  CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
  PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
  PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
function ue(t2) {
  var e, n, r, i2, a2, o2 = Math.floor, s2 = new Array(64), u2 = new Array(64), c2 = new Array(64), l2 = new Array(64), h2 = new Array(65535), f2 = new Array(65535), d2 = new Array(64), p2 = new Array(64), g2 = [], m2 = 0, v2 = 7, b2 = new Array(64), y2 = new Array(64), w2 = new Array(64), N2 = new Array(256), L2 = new Array(2048), x2 = [0, 1, 5, 6, 14, 15, 27, 28, 2, 4, 7, 13, 16, 26, 29, 42, 3, 8, 12, 17, 25, 30, 41, 43, 9, 11, 18, 24, 31, 40, 44, 53, 10, 19, 23, 32, 39, 45, 52, 54, 20, 22, 33, 38, 46, 51, 55, 60, 21, 34, 37, 47, 50, 56, 59, 61, 35, 36, 48, 49, 57, 58, 62, 63], A2 = [0, 0, 1, 5, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0], S2 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], _2 = [0, 0, 2, 1, 3, 3, 2, 4, 3, 5, 5, 4, 4, 0, 0, 1, 125], P2 = [1, 2, 3, 0, 4, 17, 5, 18, 33, 49, 65, 6, 19, 81, 97, 7, 34, 113, 20, 50, 129, 145, 161, 8, 35, 66, 177, 193, 21, 82, 209, 240, 36, 51, 98, 114, 130, 9, 10, 22, 23, 24, 25, 26, 37, 38, 39, 40, 41, 42, 52, 53, 54, 55, 56, 57, 58, 67, 68, 69, 70, 71, 72, 73, 74, 83, 84, 85, 86, 87, 88, 89, 90, 99, 100, 101, 102, 103, 104, 105, 106, 115, 116, 117, 118, 119, 120, 121, 122, 131, 132, 133, 134, 135, 136, 137, 138, 146, 147, 148, 149, 150, 151, 152, 153, 154, 162, 163, 164, 165, 166, 167, 168, 169, 170, 178, 179, 180, 181, 182, 183, 184, 185, 186, 194, 195, 196, 197, 198, 199, 200, 201, 202, 210, 211, 212, 213, 214, 215, 216, 217, 218, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250], k2 = [0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0], F2 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], I2 = [0, 0, 2, 1, 2, 4, 4, 3, 4, 7, 5, 4, 4, 0, 1, 2, 119], j2 = [0, 1, 2, 3, 17, 4, 5, 33, 49, 6, 18, 65, 81, 7, 97, 113, 19, 34, 50, 129, 8, 20, 66, 145, 161, 177, 193, 9, 35, 51, 82, 240, 21, 98, 114, 209, 10, 22, 36, 52, 225, 37, 241, 23, 24, 25, 26, 38, 39, 40, 41, 42, 53, 54, 55, 56, 57, 58, 67, 68, 69, 70, 71, 72, 73, 74, 83, 84, 85, 86, 87, 88, 89, 90, 99, 100, 101, 102, 103, 104, 105, 106, 115, 116, 117, 118, 119, 120, 121, 122, 130, 131, 132, 133, 134, 135, 136, 137, 138, 146, 147, 148, 149, 150, 151, 152, 153, 154, 162, 163, 164, 165, 166, 167, 168, 169, 170, 178, 179, 180, 181, 182, 183, 184, 185, 186, 194, 195, 196, 197, 198, 199, 200, 201, 202, 210, 211, 212, 213, 214, 215, 216, 217, 218, 226, 227, 228, 229, 230, 231, 232, 233, 234, 242, 243, 244, 245, 246, 247, 248, 249, 250];
  function C2(t3, e2) {
    for (var n2 = 0, r2 = 0, i3 = new Array(), a3 = 1; a3 <= 16; a3++) {
      for (var o3 = 1; o3 <= t3[a3]; o3++) i3[e2[r2]] = [], i3[e2[r2]][0] = n2, i3[e2[r2]][1] = a3, r2++, n2++;
      n2 *= 2;
    }
    return i3;
  }
  function O2(t3) {
    for (var e2 = t3[0], n2 = t3[1] - 1; n2 >= 0; ) e2 & 1 << n2 && (m2 |= 1 << v2), n2--, --v2 < 0 && (255 == m2 ? (B2(255), B2(0)) : B2(m2), v2 = 7, m2 = 0);
  }
  function B2(t3) {
    g2.push(t3);
  }
  function M2(t3) {
    B2(t3 >> 8 & 255), B2(255 & t3);
  }
  function q2(t3, e2, n2, r2, i3) {
    for (var a3, o3 = i3[0], s3 = i3[240], u3 = function(t4, e3) {
      var n3, r3, i4, a4, o4, s4, u4, c4, l4, h3, f3 = 0;
      for (l4 = 0; l4 < 8; ++l4) {
        n3 = t4[f3], r3 = t4[f3 + 1], i4 = t4[f3 + 2], a4 = t4[f3 + 3], o4 = t4[f3 + 4], s4 = t4[f3 + 5], u4 = t4[f3 + 6];
        var p3 = n3 + (c4 = t4[f3 + 7]), g4 = n3 - c4, m4 = r3 + u4, v4 = r3 - u4, b4 = i4 + s4, y4 = i4 - s4, w4 = a4 + o4, N3 = a4 - o4, L3 = p3 + w4, x3 = p3 - w4, A3 = m4 + b4, S3 = m4 - b4;
        t4[f3] = L3 + A3, t4[f3 + 4] = L3 - A3;
        var _3 = 0.707106781 * (S3 + x3);
        t4[f3 + 2] = x3 + _3, t4[f3 + 6] = x3 - _3;
        var P3 = 0.382683433 * ((L3 = N3 + y4) - (S3 = v4 + g4)), k3 = 0.5411961 * L3 + P3, F3 = 1.306562965 * S3 + P3, I3 = 0.707106781 * (A3 = y4 + v4), j3 = g4 + I3, C3 = g4 - I3;
        t4[f3 + 5] = C3 + k3, t4[f3 + 3] = C3 - k3, t4[f3 + 1] = j3 + F3, t4[f3 + 7] = j3 - F3, f3 += 8;
      }
      for (f3 = 0, l4 = 0; l4 < 8; ++l4) {
        n3 = t4[f3], r3 = t4[f3 + 8], i4 = t4[f3 + 16], a4 = t4[f3 + 24], o4 = t4[f3 + 32], s4 = t4[f3 + 40], u4 = t4[f3 + 48];
        var O3 = n3 + (c4 = t4[f3 + 56]), B3 = n3 - c4, M3 = r3 + u4, q3 = r3 - u4, E3 = i4 + s4, R2 = i4 - s4, D2 = a4 + o4, T2 = a4 - o4, z2 = O3 + D2, U2 = O3 - D2, H2 = M3 + E3, W2 = M3 - E3;
        t4[f3] = z2 + H2, t4[f3 + 32] = z2 - H2;
        var V2 = 0.707106781 * (W2 + U2);
        t4[f3 + 16] = U2 + V2, t4[f3 + 48] = U2 - V2;
        var G2 = 0.382683433 * ((z2 = T2 + R2) - (W2 = q3 + B3)), Y2 = 0.5411961 * z2 + G2, J2 = 1.306562965 * W2 + G2, X2 = 0.707106781 * (H2 = R2 + q3), K2 = B3 + X2, Z2 = B3 - X2;
        t4[f3 + 40] = Z2 + Y2, t4[f3 + 24] = Z2 - Y2, t4[f3 + 8] = K2 + J2, t4[f3 + 56] = K2 - J2, f3++;
      }
      for (l4 = 0; l4 < 64; ++l4) h3 = t4[l4] * e3[l4], d2[l4] = h3 > 0 ? h3 + 0.5 | 0 : h3 - 0.5 | 0;
      return d2;
    }(t3, e2), c3 = 0; c3 < 64; ++c3) p2[x2[c3]] = u3[c3];
    var l3 = p2[0] - n2;
    n2 = p2[0], 0 == l3 ? O2(r2[0]) : (O2(r2[f2[a3 = 32767 + l3]]), O2(h2[a3]));
    for (var g3 = 63; g3 > 0 && 0 == p2[g3]; ) g3--;
    if (0 == g3) return O2(o3), n2;
    for (var m3, v3 = 1; v3 <= g3; ) {
      for (var b3 = v3; 0 == p2[v3] && v3 <= g3; ) ++v3;
      var y3 = v3 - b3;
      if (y3 >= 16) {
        m3 = y3 >> 4;
        for (var w3 = 1; w3 <= m3; ++w3) O2(s3);
        y3 &= 15;
      }
      a3 = 32767 + p2[v3], O2(i3[(y3 << 4) + f2[a3]]), O2(h2[a3]), v3++;
    }
    return 63 != g3 && O2(o3), n2;
  }
  function E2(t3) {
    t3 = Math.min(Math.max(t3, 1), 100), a2 != t3 && (function(t4) {
      for (var e2 = [16, 11, 10, 16, 24, 40, 51, 61, 12, 12, 14, 19, 26, 58, 60, 55, 14, 13, 16, 24, 40, 57, 69, 56, 14, 17, 22, 29, 51, 87, 80, 62, 18, 22, 37, 56, 68, 109, 103, 77, 24, 35, 55, 64, 81, 104, 113, 92, 49, 64, 78, 87, 103, 121, 120, 101, 72, 92, 95, 98, 112, 100, 103, 99], n2 = 0; n2 < 64; n2++) {
        var r2 = o2((e2[n2] * t4 + 50) / 100);
        r2 = Math.min(Math.max(r2, 1), 255), s2[x2[n2]] = r2;
      }
      for (var i3 = [17, 18, 24, 47, 99, 99, 99, 99, 18, 21, 26, 66, 99, 99, 99, 99, 24, 26, 56, 99, 99, 99, 99, 99, 47, 66, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99], a3 = 0; a3 < 64; a3++) {
        var h3 = o2((i3[a3] * t4 + 50) / 100);
        h3 = Math.min(Math.max(h3, 1), 255), u2[x2[a3]] = h3;
      }
      for (var f3 = [1, 1.387039845, 1.306562965, 1.175875602, 1, 0.785694958, 0.5411961, 0.275899379], d3 = 0, p3 = 0; p3 < 8; p3++) for (var g3 = 0; g3 < 8; g3++) c2[d3] = 1 / (s2[x2[d3]] * f3[p3] * f3[g3] * 8), l2[d3] = 1 / (u2[x2[d3]] * f3[p3] * f3[g3] * 8), d3++;
    }(t3 < 50 ? Math.floor(5e3 / t3) : Math.floor(200 - 2 * t3)), a2 = t3);
  }
  this.encode = function(t3, a3) {
    a3 && E2(a3), g2 = new Array(), m2 = 0, v2 = 7, M2(65496), M2(65504), M2(16), B2(74), B2(70), B2(73), B2(70), B2(0), B2(1), B2(1), B2(0), M2(1), M2(1), B2(0), B2(0), function() {
      M2(65499), M2(132), B2(0);
      for (var t4 = 0; t4 < 64; t4++) B2(s2[t4]);
      B2(1);
      for (var e2 = 0; e2 < 64; e2++) B2(u2[e2]);
    }(), function(t4, e2) {
      M2(65472), M2(17), B2(8), M2(e2), M2(t4), B2(3), B2(1), B2(17), B2(0), B2(2), B2(17), B2(1), B2(3), B2(17), B2(1);
    }(t3.width, t3.height), function() {
      M2(65476), M2(418), B2(0);
      for (var t4 = 0; t4 < 16; t4++) B2(A2[t4 + 1]);
      for (var e2 = 0; e2 <= 11; e2++) B2(S2[e2]);
      B2(16);
      for (var n2 = 0; n2 < 16; n2++) B2(_2[n2 + 1]);
      for (var r2 = 0; r2 <= 161; r2++) B2(P2[r2]);
      B2(1);
      for (var i3 = 0; i3 < 16; i3++) B2(k2[i3 + 1]);
      for (var a4 = 0; a4 <= 11; a4++) B2(F2[a4]);
      B2(17);
      for (var o4 = 0; o4 < 16; o4++) B2(I2[o4 + 1]);
      for (var s3 = 0; s3 <= 161; s3++) B2(j2[s3]);
    }(), M2(65498), M2(12), B2(3), B2(1), B2(0), B2(2), B2(17), B2(3), B2(17), B2(0), B2(63), B2(0);
    var o3 = 0, h3 = 0, f3 = 0;
    m2 = 0, v2 = 7, this.encode.displayName = "_encode_";
    for (var d3, p3, N3, x3, C3, R2, D2, T2, z2, U2 = t3.data, H2 = t3.width, W2 = t3.height, V2 = 4 * H2, G2 = 0; G2 < W2; ) {
      for (d3 = 0; d3 < V2; ) {
        for (C3 = V2 * G2 + d3, D2 = -1, T2 = 0, z2 = 0; z2 < 64; z2++) R2 = C3 + (T2 = z2 >> 3) * V2 + (D2 = 4 * (7 & z2)), G2 + T2 >= W2 && (R2 -= V2 * (G2 + 1 + T2 - W2)), d3 + D2 >= V2 && (R2 -= d3 + D2 - V2 + 4), p3 = U2[R2++], N3 = U2[R2++], x3 = U2[R2++], b2[z2] = (L2[p3] + L2[N3 + 256 | 0] + L2[x3 + 512 | 0] >> 16) - 128, y2[z2] = (L2[p3 + 768 | 0] + L2[N3 + 1024 | 0] + L2[x3 + 1280 | 0] >> 16) - 128, w2[z2] = (L2[p3 + 1280 | 0] + L2[N3 + 1536 | 0] + L2[x3 + 1792 | 0] >> 16) - 128;
        o3 = q2(b2, c2, o3, e, r), h3 = q2(y2, l2, h3, n, i2), f3 = q2(w2, l2, f3, n, i2), d3 += 32;
      }
      G2 += 8;
    }
    if (v2 >= 0) {
      var Y2 = [];
      Y2[1] = v2 + 1, Y2[0] = (1 << v2 + 1) - 1, O2(Y2);
    }
    return M2(65497), new Uint8Array(g2);
  }, t2 = t2 || 50, function() {
    for (var t3 = String.fromCharCode, e2 = 0; e2 < 256; e2++) N2[e2] = t3(e2);
  }(), e = C2(A2, S2), n = C2(k2, F2), r = C2(_2, P2), i2 = C2(I2, j2), function() {
    for (var t3 = 1, e2 = 2, n2 = 1; n2 <= 15; n2++) {
      for (var r2 = t3; r2 < e2; r2++) f2[32767 + r2] = n2, h2[32767 + r2] = [], h2[32767 + r2][1] = n2, h2[32767 + r2][0] = r2;
      for (var i3 = -(e2 - 1); i3 <= -t3; i3++) f2[32767 + i3] = n2, h2[32767 + i3] = [], h2[32767 + i3][1] = n2, h2[32767 + i3][0] = e2 - 1 + i3;
      t3 <<= 1, e2 <<= 1;
    }
  }(), function() {
    for (var t3 = 0; t3 < 256; t3++) L2[t3] = 19595 * t3, L2[t3 + 256 | 0] = 38470 * t3, L2[t3 + 512 | 0] = 7471 * t3 + 32768, L2[t3 + 768 | 0] = -11059 * t3, L2[t3 + 1024 | 0] = -21709 * t3, L2[t3 + 1280 | 0] = 32768 * t3 + 8421375, L2[t3 + 1536 | 0] = -27439 * t3, L2[t3 + 1792 | 0] = -5329 * t3;
  }(), E2(t2);
}
/**
 * @license
 * Copyright (c) 2017 Aras Abbasi
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function ce(t2, e) {
  if (this.pos = 0, this.buffer = t2, this.datav = new DataView(t2.buffer), this.is_with_alpha = !!e, this.bottom_up = true, this.flag = String.fromCharCode(this.buffer[0]) + String.fromCharCode(this.buffer[1]), this.pos += 2, -1 === ["BM", "BA", "CI", "CP", "IC", "PT"].indexOf(this.flag)) throw new Error("Invalid BMP File");
  this.parseHeader(), this.parseBGR();
}
function le(t2) {
  function e(t3) {
    if (!t3) throw Error("assert :P");
  }
  function n(t3, e2, n2) {
    for (var r2 = 0; 4 > r2; r2++) if (t3[e2 + r2] != n2.charCodeAt(r2)) return true;
    return false;
  }
  function r(t3, e2, n2, r2, i3) {
    for (var a3 = 0; a3 < i3; a3++) t3[e2 + a3] = n2[r2 + a3];
  }
  function i2(t3, e2, n2, r2) {
    for (var i3 = 0; i3 < r2; i3++) t3[e2 + i3] = n2;
  }
  function a2(t3) {
    return new Int32Array(t3);
  }
  function o2(t3, e2) {
    for (var n2 = [], r2 = 0; r2 < t3; r2++) n2.push(new e2());
    return n2;
  }
  function s2(t3, e2) {
    var n2 = [];
    return function t4(n3, r2, i3) {
      for (var a3 = i3[r2], o3 = 0; o3 < a3 && (n3.push(i3.length > r2 + 1 ? [] : new e2()), !(i3.length < r2 + 1)); o3++) t4(n3[o3], r2 + 1, i3);
    }(n2, 0, t3), n2;
  }
  var u2 = function() {
    var t3 = this;
    function u3(t4, e2) {
      for (var n2 = 1 << e2 - 1 >>> 0; t4 & n2; ) n2 >>>= 1;
      return n2 ? (t4 & n2 - 1) + n2 : t4;
    }
    function c3(t4, n2, r2, i3, a3) {
      e(!(i3 % r2));
      do {
        t4[n2 + (i3 -= r2)] = a3;
      } while (0 < i3);
    }
    function l3(t4, n2, r2, i3, o3) {
      if (e(2328 >= o3), 512 >= o3) var s3 = a2(512);
      else if (null == (s3 = a2(o3))) return 0;
      return function(t5, n3, r3, i4, o4, s4) {
        var l4, f4, d4 = n3, p4 = 1 << r3, g4 = a2(16), m4 = a2(16);
        for (e(0 != o4), e(null != i4), e(null != t5), e(0 < r3), f4 = 0; f4 < o4; ++f4) {
          if (15 < i4[f4]) return 0;
          ++g4[i4[f4]];
        }
        if (g4[0] == o4) return 0;
        for (m4[1] = 0, l4 = 1; 15 > l4; ++l4) {
          if (g4[l4] > 1 << l4) return 0;
          m4[l4 + 1] = m4[l4] + g4[l4];
        }
        for (f4 = 0; f4 < o4; ++f4) l4 = i4[f4], 0 < i4[f4] && (s4[m4[l4]++] = f4);
        if (1 == m4[15]) return (i4 = new h3()).g = 0, i4.value = s4[0], c3(t5, d4, 1, p4, i4), p4;
        var v4, b4 = -1, y4 = p4 - 1, w4 = 0, N4 = 1, L4 = 1, x4 = 1 << r3;
        for (f4 = 0, l4 = 1, o4 = 2; l4 <= r3; ++l4, o4 <<= 1) {
          if (N4 += L4 <<= 1, 0 > (L4 -= g4[l4])) return 0;
          for (; 0 < g4[l4]; --g4[l4]) (i4 = new h3()).g = l4, i4.value = s4[f4++], c3(t5, d4 + w4, o4, x4, i4), w4 = u3(w4, l4);
        }
        for (l4 = r3 + 1, o4 = 2; 15 >= l4; ++l4, o4 <<= 1) {
          if (N4 += L4 <<= 1, 0 > (L4 -= g4[l4])) return 0;
          for (; 0 < g4[l4]; --g4[l4]) {
            if (i4 = new h3(), (w4 & y4) != b4) {
              for (d4 += x4, v4 = 1 << (b4 = l4) - r3; 15 > b4 && !(0 >= (v4 -= g4[b4])); ) ++b4, v4 <<= 1;
              p4 += x4 = 1 << (v4 = b4 - r3), t5[n3 + (b4 = w4 & y4)].g = v4 + r3, t5[n3 + b4].value = d4 - n3 - b4;
            }
            i4.g = l4 - r3, i4.value = s4[f4++], c3(t5, d4 + (w4 >> r3), o4, x4, i4), w4 = u3(w4, l4);
          }
        }
        return N4 != 2 * m4[15] - 1 ? 0 : p4;
      }(t4, n2, r2, i3, o3, s3);
    }
    function h3() {
      this.value = this.g = 0;
    }
    function f3() {
      this.value = this.g = 0;
    }
    function d3() {
      this.G = o2(5, h3), this.H = a2(5), this.jc = this.Qb = this.qb = this.nd = 0, this.pd = o2(Rn, f3);
    }
    function p3(t4, n2, r2, i3) {
      e(null != t4), e(null != n2), e(2147483648 > i3), t4.Ca = 254, t4.I = 0, t4.b = -8, t4.Ka = 0, t4.oa = n2, t4.pa = r2, t4.Jd = n2, t4.Yc = r2 + i3, t4.Zc = 4 <= i3 ? r2 + i3 - 4 + 1 : r2, _2(t4);
    }
    function g3(t4, e2) {
      for (var n2 = 0; 0 < e2--; ) n2 |= k2(t4, 128) << e2;
      return n2;
    }
    function m3(t4, e2) {
      var n2 = g3(t4, e2);
      return P2(t4) ? -n2 : n2;
    }
    function v3(t4, n2, r2, i3) {
      var a3, o3 = 0;
      for (e(null != t4), e(null != n2), e(4294967288 > i3), t4.Sb = i3, t4.Ra = 0, t4.u = 0, t4.h = 0, 4 < i3 && (i3 = 4), a3 = 0; a3 < i3; ++a3) o3 += n2[r2 + a3] << 8 * a3;
      t4.Ra = o3, t4.bb = i3, t4.oa = n2, t4.pa = r2;
    }
    function b3(t4) {
      for (; 8 <= t4.u && t4.bb < t4.Sb; ) t4.Ra >>>= 8, t4.Ra += t4.oa[t4.pa + t4.bb] << zn - 8 >>> 0, ++t4.bb, t4.u -= 8;
      x3(t4) && (t4.h = 1, t4.u = 0);
    }
    function y3(t4, n2) {
      if (e(0 <= n2), !t4.h && n2 <= Tn) {
        var r2 = L3(t4) & Dn[n2];
        return t4.u += n2, b3(t4), r2;
      }
      return t4.h = 1, t4.u = 0;
    }
    function w3() {
      this.b = this.Ca = this.I = 0, this.oa = [], this.pa = 0, this.Jd = [], this.Yc = 0, this.Zc = [], this.Ka = 0;
    }
    function N3() {
      this.Ra = 0, this.oa = [], this.h = this.u = this.bb = this.Sb = this.pa = 0;
    }
    function L3(t4) {
      return t4.Ra >>> (t4.u & zn - 1) >>> 0;
    }
    function x3(t4) {
      return e(t4.bb <= t4.Sb), t4.h || t4.bb == t4.Sb && t4.u > zn;
    }
    function A3(t4, e2) {
      t4.u = e2, t4.h = x3(t4);
    }
    function S2(t4) {
      t4.u >= Un && (e(t4.u >= Un), b3(t4));
    }
    function _2(t4) {
      e(null != t4 && null != t4.oa), t4.pa < t4.Zc ? (t4.I = (t4.oa[t4.pa++] | t4.I << 8) >>> 0, t4.b += 8) : (e(null != t4 && null != t4.oa), t4.pa < t4.Yc ? (t4.b += 8, t4.I = t4.oa[t4.pa++] | t4.I << 8) : t4.Ka ? t4.b = 0 : (t4.I <<= 8, t4.b += 8, t4.Ka = 1));
    }
    function P2(t4) {
      return g3(t4, 1);
    }
    function k2(t4, e2) {
      var n2 = t4.Ca;
      0 > t4.b && _2(t4);
      var r2 = t4.b, i3 = n2 * e2 >>> 8, a3 = (t4.I >>> r2 > i3) + 0;
      for (a3 ? (n2 -= i3, t4.I -= i3 + 1 << r2 >>> 0) : n2 = i3 + 1, r2 = n2, i3 = 0; 256 <= r2; ) i3 += 8, r2 >>= 8;
      return r2 = 7 ^ i3 + Hn[r2], t4.b -= r2, t4.Ca = (n2 << r2) - 1, a3;
    }
    function F2(t4, e2, n2) {
      t4[e2 + 0] = n2 >> 24 & 255, t4[e2 + 1] = n2 >> 16 & 255, t4[e2 + 2] = n2 >> 8 & 255, t4[e2 + 3] = 255 & n2;
    }
    function I2(t4, e2) {
      return t4[e2 + 0] | t4[e2 + 1] << 8;
    }
    function j2(t4, e2) {
      return I2(t4, e2) | t4[e2 + 2] << 16;
    }
    function C2(t4, e2) {
      return I2(t4, e2) | I2(t4, e2 + 2) << 16;
    }
    function O2(t4, n2) {
      var r2 = 1 << n2;
      return e(null != t4), e(0 < n2), t4.X = a2(r2), null == t4.X ? 0 : (t4.Mb = 32 - n2, t4.Xa = n2, 1);
    }
    function B2(t4, n2) {
      e(null != t4), e(null != n2), e(t4.Xa == n2.Xa), r(n2.X, 0, t4.X, 0, 1 << n2.Xa);
    }
    function M2() {
      this.X = [], this.Xa = this.Mb = 0;
    }
    function q2(t4, n2, r2, i3) {
      e(null != r2), e(null != i3);
      var a3 = r2[0], o3 = i3[0];
      return 0 == a3 && (a3 = (t4 * o3 + n2 / 2) / n2), 0 == o3 && (o3 = (n2 * a3 + t4 / 2) / t4), 0 >= a3 || 0 >= o3 ? 0 : (r2[0] = a3, i3[0] = o3, 1);
    }
    function E2(t4, e2) {
      return t4 + (1 << e2) - 1 >>> e2;
    }
    function R2(t4, e2) {
      return ((4278255360 & t4) + (4278255360 & e2) >>> 0 & 4278255360) + ((16711935 & t4) + (16711935 & e2) >>> 0 & 16711935) >>> 0;
    }
    function D2(e2, n2) {
      t3[n2] = function(n3, r2, i3, a3, o3, s3, u4) {
        var c4;
        for (c4 = 0; c4 < o3; ++c4) {
          var l4 = t3[e2](s3[u4 + c4 - 1], i3, a3 + c4);
          s3[u4 + c4] = R2(n3[r2 + c4], l4);
        }
      };
    }
    function T2() {
      this.ud = this.hd = this.jd = 0;
    }
    function z2(t4, e2) {
      return ((4278124286 & (t4 ^ e2)) >>> 1) + (t4 & e2) >>> 0;
    }
    function U2(t4) {
      return 0 <= t4 && 256 > t4 ? t4 : 0 > t4 ? 0 : 255 < t4 ? 255 : void 0;
    }
    function H2(t4, e2) {
      return U2(t4 + (t4 - e2 + 0.5 >> 1));
    }
    function W2(t4, e2, n2) {
      return Math.abs(e2 - n2) - Math.abs(t4 - n2);
    }
    function V2(t4, e2, n2, r2, i3, a3, o3) {
      for (r2 = a3[o3 - 1], n2 = 0; n2 < i3; ++n2) a3[o3 + n2] = r2 = R2(t4[e2 + n2], r2);
    }
    function G2(t4, e2, n2, r2, i3) {
      var a3;
      for (a3 = 0; a3 < n2; ++a3) {
        var o3 = t4[e2 + a3], s3 = o3 >> 8 & 255, u4 = 16711935 & (u4 = (u4 = 16711935 & o3) + ((s3 << 16) + s3));
        r2[i3 + a3] = (4278255360 & o3) + u4 >>> 0;
      }
    }
    function Y2(t4, e2) {
      e2.jd = 255 & t4, e2.hd = t4 >> 8 & 255, e2.ud = t4 >> 16 & 255;
    }
    function J2(t4, e2, n2, r2, i3, a3) {
      var o3;
      for (o3 = 0; o3 < r2; ++o3) {
        var s3 = e2[n2 + o3], u4 = s3 >>> 8, c4 = s3, l4 = 255 & (l4 = (l4 = s3 >>> 16) + ((t4.jd << 24 >> 24) * (u4 << 24 >> 24) >>> 5));
        c4 = 255 & (c4 = (c4 += (t4.hd << 24 >> 24) * (u4 << 24 >> 24) >>> 5) + ((t4.ud << 24 >> 24) * (l4 << 24 >> 24) >>> 5)), i3[a3 + o3] = (4278255360 & s3) + (l4 << 16) + c4;
      }
    }
    function X2(e2, n2, r2, i3, a3) {
      t3[n2] = function(t4, e3, n3, r3, o3, s3, u4, c4, l4) {
        for (r3 = u4; r3 < c4; ++r3) for (u4 = 0; u4 < l4; ++u4) o3[s3++] = a3(n3[i3(t4[e3++])]);
      }, t3[e2] = function(e3, n3, o3, s3, u4, c4, l4) {
        var h4 = 8 >> e3.b, f4 = e3.Ea, d4 = e3.K[0], p4 = e3.w;
        if (8 > h4) for (e3 = (1 << e3.b) - 1, p4 = (1 << h4) - 1; n3 < o3; ++n3) {
          var g4, m4 = 0;
          for (g4 = 0; g4 < f4; ++g4) g4 & e3 || (m4 = i3(s3[u4++])), c4[l4++] = a3(d4[m4 & p4]), m4 >>= h4;
        }
        else t3["VP8LMapColor" + r2](s3, u4, d4, p4, c4, l4, n3, o3, f4);
      };
    }
    function K2(t4, e2, n2, r2, i3) {
      for (n2 = e2 + n2; e2 < n2; ) {
        var a3 = t4[e2++];
        r2[i3++] = a3 >> 16 & 255, r2[i3++] = a3 >> 8 & 255, r2[i3++] = 255 & a3;
      }
    }
    function Z2(t4, e2, n2, r2, i3) {
      for (n2 = e2 + n2; e2 < n2; ) {
        var a3 = t4[e2++];
        r2[i3++] = a3 >> 16 & 255, r2[i3++] = a3 >> 8 & 255, r2[i3++] = 255 & a3, r2[i3++] = a3 >> 24 & 255;
      }
    }
    function $2(t4, e2, n2, r2, i3) {
      for (n2 = e2 + n2; e2 < n2; ) {
        var a3 = (o3 = t4[e2++]) >> 16 & 240 | o3 >> 12 & 15, o3 = 240 & o3 | o3 >> 28 & 15;
        r2[i3++] = a3, r2[i3++] = o3;
      }
    }
    function Q2(t4, e2, n2, r2, i3) {
      for (n2 = e2 + n2; e2 < n2; ) {
        var a3 = (o3 = t4[e2++]) >> 16 & 248 | o3 >> 13 & 7, o3 = o3 >> 5 & 224 | o3 >> 3 & 31;
        r2[i3++] = a3, r2[i3++] = o3;
      }
    }
    function tt2(t4, e2, n2, r2, i3) {
      for (n2 = e2 + n2; e2 < n2; ) {
        var a3 = t4[e2++];
        r2[i3++] = 255 & a3, r2[i3++] = a3 >> 8 & 255, r2[i3++] = a3 >> 16 & 255;
      }
    }
    function et2(t4, e2, n2, i3, a3, o3) {
      if (0 == o3) for (n2 = e2 + n2; e2 < n2; ) F2(i3, ((o3 = t4[e2++])[0] >> 24 | o3[1] >> 8 & 65280 | o3[2] << 8 & 16711680 | o3[3] << 24) >>> 0), a3 += 32;
      else r(i3, a3, t4, e2, n2);
    }
    function nt2(e2, n2) {
      t3[n2][0] = t3[e2 + "0"], t3[n2][1] = t3[e2 + "1"], t3[n2][2] = t3[e2 + "2"], t3[n2][3] = t3[e2 + "3"], t3[n2][4] = t3[e2 + "4"], t3[n2][5] = t3[e2 + "5"], t3[n2][6] = t3[e2 + "6"], t3[n2][7] = t3[e2 + "7"], t3[n2][8] = t3[e2 + "8"], t3[n2][9] = t3[e2 + "9"], t3[n2][10] = t3[e2 + "10"], t3[n2][11] = t3[e2 + "11"], t3[n2][12] = t3[e2 + "12"], t3[n2][13] = t3[e2 + "13"], t3[n2][14] = t3[e2 + "0"], t3[n2][15] = t3[e2 + "0"];
    }
    function rt2(t4) {
      return t4 == Ur || t4 == Hr || t4 == Wr || t4 == Vr;
    }
    function it2() {
      this.eb = [], this.size = this.A = this.fb = 0;
    }
    function at2() {
      this.y = [], this.f = [], this.ea = [], this.F = [], this.Tc = this.Ed = this.Cd = this.Fd = this.lb = this.Db = this.Ab = this.fa = this.J = this.W = this.N = this.O = 0;
    }
    function ot2() {
      this.Rd = this.height = this.width = this.S = 0, this.f = {}, this.f.RGBA = new it2(), this.f.kb = new at2(), this.sd = null;
    }
    function st2() {
      this.width = [0], this.height = [0], this.Pd = [0], this.Qd = [0], this.format = [0];
    }
    function ut2() {
      this.Id = this.fd = this.Md = this.hb = this.ib = this.da = this.bd = this.cd = this.j = this.v = this.Da = this.Sd = this.ob = 0;
    }
    function ct2(t4) {
      return alert("todo:WebPSamplerProcessPlane"), t4.T;
    }
    function lt2(t4, e2) {
      var n2 = t4.T, i3 = e2.ba.f.RGBA, a3 = i3.eb, o3 = i3.fb + t4.ka * i3.A, s3 = mi[e2.ba.S], u4 = t4.y, c4 = t4.O, l4 = t4.f, h4 = t4.N, f4 = t4.ea, d4 = t4.W, p4 = e2.cc, g4 = e2.dc, m4 = e2.Mc, v4 = e2.Nc, b4 = t4.ka, y4 = t4.ka + t4.T, w4 = t4.U, N4 = w4 + 1 >> 1;
      for (0 == b4 ? s3(u4, c4, null, null, l4, h4, f4, d4, l4, h4, f4, d4, a3, o3, null, null, w4) : (s3(e2.ec, e2.fc, u4, c4, p4, g4, m4, v4, l4, h4, f4, d4, a3, o3 - i3.A, a3, o3, w4), ++n2); b4 + 2 < y4; b4 += 2) p4 = l4, g4 = h4, m4 = f4, v4 = d4, h4 += t4.Rc, d4 += t4.Rc, o3 += 2 * i3.A, s3(u4, (c4 += 2 * t4.fa) - t4.fa, u4, c4, p4, g4, m4, v4, l4, h4, f4, d4, a3, o3 - i3.A, a3, o3, w4);
      return c4 += t4.fa, t4.j + y4 < t4.o ? (r(e2.ec, e2.fc, u4, c4, w4), r(e2.cc, e2.dc, l4, h4, N4), r(e2.Mc, e2.Nc, f4, d4, N4), n2--) : 1 & y4 || s3(u4, c4, null, null, l4, h4, f4, d4, l4, h4, f4, d4, a3, o3 + i3.A, null, null, w4), n2;
    }
    function ht2(t4, n2, r2) {
      var i3 = t4.F, a3 = [t4.J];
      if (null != i3) {
        var o3 = t4.U, s3 = n2.ba.S, u4 = s3 == Dr || s3 == Wr;
        n2 = n2.ba.f.RGBA;
        var c4 = [0], l4 = t4.ka;
        c4[0] = t4.T, t4.Kb && (0 == l4 ? --c4[0] : (--l4, a3[0] -= t4.width), t4.j + t4.ka + t4.T == t4.o && (c4[0] = t4.o - t4.j - l4));
        var h4 = n2.eb;
        l4 = n2.fb + l4 * n2.A, t4 = Ar(i3, a3[0], t4.width, o3, c4, h4, l4 + (u4 ? 0 : 3), n2.A), e(r2 == c4), t4 && rt2(s3) && Lr(h4, l4, u4, o3, c4, n2.A);
      }
      return 0;
    }
    function ft2(t4) {
      var e2 = t4.ma, n2 = e2.ba.S, r2 = 11 > n2, i3 = n2 == qr || n2 == Rr || n2 == Dr || n2 == Tr || 12 == n2 || rt2(n2);
      if (e2.memory = null, e2.Ib = null, e2.Jb = null, e2.Nd = null, !Mn(e2.Oa, t4, i3 ? 11 : 12)) return 0;
      if (i3 && rt2(n2) && bn(), t4.da) alert("todo:use_scaling");
      else {
        if (r2) {
          if (e2.Ib = ct2, t4.Kb) {
            if (n2 = t4.U + 1 >> 1, e2.memory = a2(t4.U + 2 * n2), null == e2.memory) return 0;
            e2.ec = e2.memory, e2.fc = 0, e2.cc = e2.ec, e2.dc = e2.fc + t4.U, e2.Mc = e2.cc, e2.Nc = e2.dc + n2, e2.Ib = lt2, bn();
          }
        } else alert("todo:EmitYUV");
        i3 && (e2.Jb = ht2, r2 && mn());
      }
      if (r2 && !Ii) {
        for (t4 = 0; 256 > t4; ++t4) ji[t4] = 89858 * (t4 - 128) + Si >> Ai, Bi[t4] = -22014 * (t4 - 128) + Si, Oi[t4] = -45773 * (t4 - 128), Ci[t4] = 113618 * (t4 - 128) + Si >> Ai;
        for (t4 = _i; t4 < Pi; ++t4) e2 = 76283 * (t4 - 16) + Si >> Ai, Mi[t4 - _i] = Vt2(e2, 255), qi[t4 - _i] = Vt2(e2 + 8 >> 4, 15);
        Ii = 1;
      }
      return 1;
    }
    function dt2(t4) {
      var n2 = t4.ma, r2 = t4.U, i3 = t4.T;
      return e(!(1 & t4.ka)), 0 >= r2 || 0 >= i3 ? 0 : (r2 = n2.Ib(t4, n2), null != n2.Jb && n2.Jb(t4, n2, r2), n2.Dc += r2, 1);
    }
    function pt2(t4) {
      t4.ma.memory = null;
    }
    function gt2(t4, e2, n2, r2) {
      return 47 != y3(t4, 8) ? 0 : (e2[0] = y3(t4, 14) + 1, n2[0] = y3(t4, 14) + 1, r2[0] = y3(t4, 1), 0 != y3(t4, 3) ? 0 : !t4.h);
    }
    function mt2(t4, e2) {
      if (4 > t4) return t4 + 1;
      var n2 = t4 - 2 >> 1;
      return (2 + (1 & t4) << n2) + y3(e2, n2) + 1;
    }
    function vt2(t4, e2) {
      return 120 < e2 ? e2 - 120 : 1 <= (n2 = ((n2 = Zr[e2 - 1]) >> 4) * t4 + (8 - (15 & n2))) ? n2 : 1;
      var n2;
    }
    function bt2(t4, e2, n2) {
      var r2 = L3(n2), i3 = t4[e2 += 255 & r2].g - 8;
      return 0 < i3 && (A3(n2, n2.u + 8), r2 = L3(n2), e2 += t4[e2].value, e2 += r2 & (1 << i3) - 1), A3(n2, n2.u + t4[e2].g), t4[e2].value;
    }
    function yt2(t4, n2, r2) {
      return r2.g += t4.g, r2.value += t4.value << n2 >>> 0, e(8 >= r2.g), t4.g;
    }
    function wt2(t4, n2, r2) {
      var i3 = t4.xc;
      return e((n2 = 0 == i3 ? 0 : t4.vc[t4.md * (r2 >> i3) + (n2 >> i3)]) < t4.Wb), t4.Ya[n2];
    }
    function Nt2(t4, n2, i3, a3) {
      var o3 = t4.ab, s3 = t4.c * n2, u4 = t4.C;
      n2 = u4 + n2;
      var c4 = i3, l4 = a3;
      for (a3 = t4.Ta, i3 = t4.Ua; 0 < o3--; ) {
        var h4 = t4.gc[o3], f4 = u4, d4 = n2, p4 = c4, g4 = l4, m4 = (l4 = a3, c4 = i3, h4.Ea);
        switch (e(f4 < d4), e(d4 <= h4.nc), h4.hc) {
          case 2:
            Gn(p4, g4, (d4 - f4) * m4, l4, c4);
            break;
          case 0:
            var v4 = f4, b4 = d4, y4 = l4, w4 = c4, N4 = (_3 = h4).Ea;
            0 == v4 && (Wn(p4, g4, null, null, 1, y4, w4), V2(p4, g4 + 1, 0, 0, N4 - 1, y4, w4 + 1), g4 += N4, w4 += N4, ++v4);
            for (var L4 = 1 << _3.b, x4 = L4 - 1, A4 = E2(N4, _3.b), S3 = _3.K, _3 = _3.w + (v4 >> _3.b) * A4; v4 < b4; ) {
              var P3 = S3, k3 = _3, F3 = 1;
              for (Vn(p4, g4, y4, w4 - N4, 1, y4, w4); F3 < N4; ) {
                var I3 = (F3 & ~x4) + L4;
                I3 > N4 && (I3 = N4), (0, Zn[P3[k3++] >> 8 & 15])(p4, g4 + +F3, y4, w4 + F3 - N4, I3 - F3, y4, w4 + F3), F3 = I3;
              }
              g4 += N4, w4 += N4, ++v4 & x4 || (_3 += A4);
            }
            d4 != h4.nc && r(l4, c4 - m4, l4, c4 + (d4 - f4 - 1) * m4, m4);
            break;
          case 1:
            for (m4 = p4, b4 = g4, N4 = (p4 = h4.Ea) - (w4 = p4 & ~(y4 = (g4 = 1 << h4.b) - 1)), v4 = E2(p4, h4.b), L4 = h4.K, h4 = h4.w + (f4 >> h4.b) * v4; f4 < d4; ) {
              for (x4 = L4, A4 = h4, S3 = new T2(), _3 = b4 + w4, P3 = b4 + p4; b4 < _3; ) Y2(x4[A4++], S3), $n(S3, m4, b4, g4, l4, c4), b4 += g4, c4 += g4;
              b4 < P3 && (Y2(x4[A4++], S3), $n(S3, m4, b4, N4, l4, c4), b4 += N4, c4 += N4), ++f4 & y4 || (h4 += v4);
            }
            break;
          case 3:
            if (p4 == l4 && g4 == c4 && 0 < h4.b) {
              for (b4 = l4, p4 = m4 = c4 + (d4 - f4) * m4 - (w4 = (d4 - f4) * E2(h4.Ea, h4.b)), g4 = l4, y4 = c4, v4 = [], w4 = (N4 = w4) - 1; 0 <= w4; --w4) v4[w4] = g4[y4 + w4];
              for (w4 = N4 - 1; 0 <= w4; --w4) b4[p4 + w4] = v4[w4];
              Yn(h4, f4, d4, l4, m4, l4, c4);
            } else Yn(h4, f4, d4, p4, g4, l4, c4);
        }
        c4 = a3, l4 = i3;
      }
      l4 != i3 && r(a3, i3, c4, l4, s3);
    }
    function Lt2(t4, n2) {
      var r2 = t4.V, i3 = t4.Ba + t4.c * t4.C, a3 = n2 - t4.C;
      if (e(n2 <= t4.l.o), e(16 >= a3), 0 < a3) {
        var o3 = t4.l, s3 = t4.Ta, u4 = t4.Ua, c4 = o3.width;
        if (Nt2(t4, a3, r2, i3), a3 = u4 = [u4], e((r2 = t4.C) < (i3 = n2)), e(o3.v < o3.va), i3 > o3.o && (i3 = o3.o), r2 < o3.j) {
          var l4 = o3.j - r2;
          r2 = o3.j, a3[0] += l4 * c4;
        }
        if (r2 >= i3 ? r2 = 0 : (a3[0] += 4 * o3.v, o3.ka = r2 - o3.j, o3.U = o3.va - o3.v, o3.T = i3 - r2, r2 = 1), r2) {
          if (u4 = u4[0], 11 > (r2 = t4.ca).S) {
            var h4 = r2.f.RGBA, f4 = (i3 = r2.S, a3 = o3.U, o3 = o3.T, l4 = h4.eb, h4.A), d4 = o3;
            for (h4 = h4.fb + t4.Ma * h4.A; 0 < d4--; ) {
              var p4 = s3, g4 = u4, m4 = a3, v4 = l4, b4 = h4;
              switch (i3) {
                case Mr:
                  Qn(p4, g4, m4, v4, b4);
                  break;
                case qr:
                  tr(p4, g4, m4, v4, b4);
                  break;
                case Ur:
                  tr(p4, g4, m4, v4, b4), Lr(v4, b4, 0, m4, 1, 0);
                  break;
                case Er:
                  rr(p4, g4, m4, v4, b4);
                  break;
                case Rr:
                  et2(p4, g4, m4, v4, b4, 1);
                  break;
                case Hr:
                  et2(p4, g4, m4, v4, b4, 1), Lr(v4, b4, 0, m4, 1, 0);
                  break;
                case Dr:
                  et2(p4, g4, m4, v4, b4, 0);
                  break;
                case Wr:
                  et2(p4, g4, m4, v4, b4, 0), Lr(v4, b4, 1, m4, 1, 0);
                  break;
                case Tr:
                  er(p4, g4, m4, v4, b4);
                  break;
                case Vr:
                  er(p4, g4, m4, v4, b4), xr(v4, b4, m4, 1, 0);
                  break;
                case zr:
                  nr(p4, g4, m4, v4, b4);
                  break;
                default:
                  e(0);
              }
              u4 += c4, h4 += f4;
            }
            t4.Ma += o3;
          } else alert("todo:EmitRescaledRowsYUVA");
          e(t4.Ma <= r2.height);
        }
      }
      t4.C = n2, e(t4.C <= t4.i);
    }
    function xt2(t4) {
      var e2;
      if (0 < t4.ua) return 0;
      for (e2 = 0; e2 < t4.Wb; ++e2) {
        var n2 = t4.Ya[e2].G, r2 = t4.Ya[e2].H;
        if (0 < n2[1][r2[1] + 0].g || 0 < n2[2][r2[2] + 0].g || 0 < n2[3][r2[3] + 0].g) return 0;
      }
      return 1;
    }
    function At2(t4, n2, r2, i3, a3, o3) {
      if (0 != t4.Z) {
        var s3 = t4.qd, u4 = t4.rd;
        for (e(null != gi[t4.Z]); n2 < r2; ++n2) gi[t4.Z](s3, u4, i3, a3, i3, a3, o3), s3 = i3, u4 = a3, a3 += o3;
        t4.qd = s3, t4.rd = u4;
      }
    }
    function St(t4, n2) {
      var r2 = t4.l.ma, i3 = 0 == r2.Z || 1 == r2.Z ? t4.l.j : t4.C;
      if (i3 = t4.C < i3 ? i3 : t4.C, e(n2 <= t4.l.o), n2 > i3) {
        var a3 = t4.l.width, o3 = r2.ca, s3 = r2.tb + a3 * i3, u4 = t4.V, c4 = t4.Ba + t4.c * i3, l4 = t4.gc;
        e(1 == t4.ab), e(3 == l4[0].hc), Xn(l4[0], i3, n2, u4, c4, o3, s3), At2(r2, i3, n2, o3, s3, a3);
      }
      t4.C = t4.Ma = n2;
    }
    function _t2(t4, n2, r2, i3, a3, o3, s3) {
      var u4 = t4.$ / i3, c4 = t4.$ % i3, l4 = t4.m, h4 = t4.s, f4 = r2 + t4.$, d4 = f4;
      a3 = r2 + i3 * a3;
      var p4 = r2 + i3 * o3, g4 = 280 + h4.ua, m4 = t4.Pb ? u4 : 16777216, v4 = 0 < h4.ua ? h4.Wa : null, b4 = h4.wc, y4 = f4 < p4 ? wt2(h4, c4, u4) : null;
      e(t4.C < o3), e(p4 <= a3);
      var w4 = false;
      t: for (; ; ) {
        for (; w4 || f4 < p4; ) {
          var N4 = 0;
          if (u4 >= m4) {
            var _3 = f4 - r2;
            e((m4 = t4).Pb), m4.wd = m4.m, m4.xd = _3, 0 < m4.s.ua && B2(m4.s.Wa, m4.s.vb), m4 = u4 + Qr;
          }
          if (c4 & b4 || (y4 = wt2(h4, c4, u4)), e(null != y4), y4.Qb && (n2[f4] = y4.qb, w4 = true), !w4) if (S2(l4), y4.jc) {
            N4 = l4, _3 = n2;
            var P3 = f4, k3 = y4.pd[L3(N4) & Rn - 1];
            e(y4.jc), 256 > k3.g ? (A3(N4, N4.u + k3.g), _3[P3] = k3.value, N4 = 0) : (A3(N4, N4.u + k3.g - 256), e(256 <= k3.value), N4 = k3.value), 0 == N4 && (w4 = true);
          } else N4 = bt2(y4.G[0], y4.H[0], l4);
          if (l4.h) break;
          if (w4 || 256 > N4) {
            if (!w4) if (y4.nd) n2[f4] = (y4.qb | N4 << 8) >>> 0;
            else {
              if (S2(l4), w4 = bt2(y4.G[1], y4.H[1], l4), S2(l4), _3 = bt2(y4.G[2], y4.H[2], l4), P3 = bt2(y4.G[3], y4.H[3], l4), l4.h) break;
              n2[f4] = (P3 << 24 | w4 << 16 | N4 << 8 | _3) >>> 0;
            }
            if (w4 = false, ++f4, ++c4 >= i3 && (c4 = 0, ++u4, null != s3 && u4 <= o3 && !(u4 % 16) && s3(t4, u4), null != v4)) for (; d4 < f4; ) N4 = n2[d4++], v4.X[(506832829 * N4 & 4294967295) >>> v4.Mb] = N4;
          } else if (280 > N4) {
            if (N4 = mt2(N4 - 256, l4), _3 = bt2(y4.G[4], y4.H[4], l4), S2(l4), _3 = vt2(i3, _3 = mt2(_3, l4)), l4.h) break;
            if (f4 - r2 < _3 || a3 - f4 < N4) break t;
            for (P3 = 0; P3 < N4; ++P3) n2[f4 + P3] = n2[f4 + P3 - _3];
            for (f4 += N4, c4 += N4; c4 >= i3; ) c4 -= i3, ++u4, null != s3 && u4 <= o3 && !(u4 % 16) && s3(t4, u4);
            if (e(f4 <= a3), c4 & b4 && (y4 = wt2(h4, c4, u4)), null != v4) for (; d4 < f4; ) N4 = n2[d4++], v4.X[(506832829 * N4 & 4294967295) >>> v4.Mb] = N4;
          } else {
            if (!(N4 < g4)) break t;
            for (w4 = N4 - 280, e(null != v4); d4 < f4; ) N4 = n2[d4++], v4.X[(506832829 * N4 & 4294967295) >>> v4.Mb] = N4;
            N4 = f4, e(!(w4 >>> (_3 = v4).Xa)), n2[N4] = _3.X[w4], w4 = true;
          }
          w4 || e(l4.h == x3(l4));
        }
        if (t4.Pb && l4.h && f4 < a3) e(t4.m.h), t4.a = 5, t4.m = t4.wd, t4.$ = t4.xd, 0 < t4.s.ua && B2(t4.s.vb, t4.s.Wa);
        else {
          if (l4.h) break t;
          null != s3 && s3(t4, u4 > o3 ? o3 : u4), t4.a = 0, t4.$ = f4 - r2;
        }
        return 1;
      }
      return t4.a = 3, 0;
    }
    function Pt2(t4) {
      e(null != t4), t4.vc = null, t4.yc = null, t4.Ya = null;
      var n2 = t4.Wa;
      null != n2 && (n2.X = null), t4.vb = null, e(null != t4);
    }
    function kt2() {
      var e2 = new on();
      return null == e2 ? null : (e2.a = 0, e2.xb = pi, nt2("Predictor", "VP8LPredictors"), nt2("Predictor", "VP8LPredictors_C"), nt2("PredictorAdd", "VP8LPredictorsAdd"), nt2("PredictorAdd", "VP8LPredictorsAdd_C"), Gn = G2, $n = J2, Qn = K2, tr = Z2, er = $2, nr = Q2, rr = tt2, t3.VP8LMapColor32b = Jn, t3.VP8LMapColor8b = Kn, e2);
    }
    function Ft2(t4, n2, r2, s3, u4) {
      var c4 = 1, f4 = [t4], p4 = [n2], g4 = s3.m, m4 = s3.s, v4 = null, b4 = 0;
      t: for (; ; ) {
        if (r2) for (; c4 && y3(g4, 1); ) {
          var w4 = f4, N4 = p4, x4 = s3, _3 = 1, P3 = x4.m, k3 = x4.gc[x4.ab], F3 = y3(P3, 2);
          if (x4.Oc & 1 << F3) c4 = 0;
          else {
            switch (x4.Oc |= 1 << F3, k3.hc = F3, k3.Ea = w4[0], k3.nc = N4[0], k3.K = [null], ++x4.ab, e(4 >= x4.ab), F3) {
              case 0:
              case 1:
                k3.b = y3(P3, 3) + 2, _3 = Ft2(E2(k3.Ea, k3.b), E2(k3.nc, k3.b), 0, x4, k3.K), k3.K = k3.K[0];
                break;
              case 3:
                var I3, j3 = y3(P3, 8) + 1, C3 = 16 < j3 ? 0 : 4 < j3 ? 1 : 2 < j3 ? 2 : 3;
                if (w4[0] = E2(k3.Ea, C3), k3.b = C3, I3 = _3 = Ft2(j3, 1, 0, x4, k3.K)) {
                  var B3, M3 = j3, q3 = k3, D3 = 1 << (8 >> q3.b), T3 = a2(D3);
                  if (null == T3) I3 = 0;
                  else {
                    var z3 = q3.K[0], U3 = q3.w;
                    for (T3[0] = q3.K[0][0], B3 = 1; B3 < 1 * M3; ++B3) T3[B3] = R2(z3[U3 + B3], T3[B3 - 1]);
                    for (; B3 < 4 * D3; ++B3) T3[B3] = 0;
                    q3.K[0] = null, q3.K[0] = T3, I3 = 1;
                  }
                }
                _3 = I3;
                break;
              case 2:
                break;
              default:
                e(0);
            }
            c4 = _3;
          }
        }
        if (f4 = f4[0], p4 = p4[0], c4 && y3(g4, 1) && !(c4 = 1 <= (b4 = y3(g4, 4)) && 11 >= b4)) {
          s3.a = 3;
          break t;
        }
        var H3;
        if (H3 = c4) e: {
          var W3, V3, G3, Y3 = s3, J3 = f4, X3 = p4, K3 = b4, Z3 = r2, $3 = Y3.m, Q3 = Y3.s, tt3 = [null], et3 = 1, nt3 = 0, rt3 = $r[K3];
          n: for (; ; ) {
            if (Z3 && y3($3, 1)) {
              var it3 = y3($3, 3) + 2, at3 = E2(J3, it3), ot3 = E2(X3, it3), st3 = at3 * ot3;
              if (!Ft2(at3, ot3, 0, Y3, tt3)) break n;
              for (tt3 = tt3[0], Q3.xc = it3, W3 = 0; W3 < st3; ++W3) {
                var ut3 = tt3[W3] >> 8 & 65535;
                tt3[W3] = ut3, ut3 >= et3 && (et3 = ut3 + 1);
              }
            }
            if ($3.h) break n;
            for (V3 = 0; 5 > V3; ++V3) {
              var ct3 = Jr[V3];
              !V3 && 0 < K3 && (ct3 += 1 << K3), nt3 < ct3 && (nt3 = ct3);
            }
            var lt3 = o2(et3 * rt3, h3), ht3 = et3, ft3 = o2(ht3, d3);
            if (null == ft3) var dt3 = null;
            else e(65536 >= ht3), dt3 = ft3;
            var pt3 = a2(nt3);
            if (null == dt3 || null == pt3 || null == lt3) {
              Y3.a = 1;
              break n;
            }
            var gt3 = lt3;
            for (W3 = G3 = 0; W3 < et3; ++W3) {
              var mt3 = dt3[W3], vt3 = mt3.G, bt3 = mt3.H, wt3 = 0, Nt3 = 1, Lt3 = 0;
              for (V3 = 0; 5 > V3; ++V3) {
                ct3 = Jr[V3], vt3[V3] = gt3, bt3[V3] = G3, !V3 && 0 < K3 && (ct3 += 1 << K3);
                r: {
                  var xt3, At3 = ct3, St2 = Y3, kt3 = pt3, It3 = gt3, jt3 = G3, Ct3 = 0, Ot3 = St2.m, Bt3 = y3(Ot3, 1);
                  if (i2(kt3, 0, 0, At3), Bt3) {
                    var Mt3 = y3(Ot3, 1) + 1, qt3 = y3(Ot3, 1), Et3 = y3(Ot3, 0 == qt3 ? 1 : 8);
                    kt3[Et3] = 1, 2 == Mt3 && (kt3[Et3 = y3(Ot3, 8)] = 1);
                    var Rt3 = 1;
                  } else {
                    var Dt3 = a2(19), Tt3 = y3(Ot3, 4) + 4;
                    if (19 < Tt3) {
                      St2.a = 3;
                      var zt3 = 0;
                      break r;
                    }
                    for (xt3 = 0; xt3 < Tt3; ++xt3) Dt3[Kr[xt3]] = y3(Ot3, 3);
                    var Ut3 = void 0, Ht3 = void 0, Wt3 = St2, Vt3 = Dt3, Gt3 = At3, Yt3 = kt3, Jt3 = 0, Xt3 = Wt3.m, Kt3 = 8, Zt3 = o2(128, h3);
                    i: for (; l3(Zt3, 0, 7, Vt3, 19); ) {
                      if (y3(Xt3, 1)) {
                        var $t3 = 2 + 2 * y3(Xt3, 3);
                        if ((Ut3 = 2 + y3(Xt3, $t3)) > Gt3) break i;
                      } else Ut3 = Gt3;
                      for (Ht3 = 0; Ht3 < Gt3 && Ut3--; ) {
                        S2(Xt3);
                        var Qt3 = Zt3[0 + (127 & L3(Xt3))];
                        A3(Xt3, Xt3.u + Qt3.g);
                        var te3 = Qt3.value;
                        if (16 > te3) Yt3[Ht3++] = te3, 0 != te3 && (Kt3 = te3);
                        else {
                          var ee3 = 16 == te3, ne3 = te3 - 16, re3 = Yr[ne3], ie3 = y3(Xt3, Gr[ne3]) + re3;
                          if (Ht3 + ie3 > Gt3) break i;
                          for (var ae3 = ee3 ? Kt3 : 0; 0 < ie3--; ) Yt3[Ht3++] = ae3;
                        }
                      }
                      Jt3 = 1;
                      break i;
                    }
                    Jt3 || (Wt3.a = 3), Rt3 = Jt3;
                  }
                  (Rt3 = Rt3 && !Ot3.h) && (Ct3 = l3(It3, jt3, 8, kt3, At3)), Rt3 && 0 != Ct3 ? zt3 = Ct3 : (St2.a = 3, zt3 = 0);
                }
                if (0 == zt3) break n;
                if (Nt3 && 1 == Xr[V3] && (Nt3 = 0 == gt3[G3].g), wt3 += gt3[G3].g, G3 += zt3, 3 >= V3) {
                  var oe3, se3 = pt3[0];
                  for (oe3 = 1; oe3 < ct3; ++oe3) pt3[oe3] > se3 && (se3 = pt3[oe3]);
                  Lt3 += se3;
                }
              }
              if (mt3.nd = Nt3, mt3.Qb = 0, Nt3 && (mt3.qb = (vt3[3][bt3[3] + 0].value << 24 | vt3[1][bt3[1] + 0].value << 16 | vt3[2][bt3[2] + 0].value) >>> 0, 0 == wt3 && 256 > vt3[0][bt3[0] + 0].value && (mt3.Qb = 1, mt3.qb += vt3[0][bt3[0] + 0].value << 8)), mt3.jc = !mt3.Qb && 6 > Lt3, mt3.jc) {
                var ue3, ce3 = mt3;
                for (ue3 = 0; ue3 < Rn; ++ue3) {
                  var le3 = ue3, he3 = ce3.pd[le3], fe3 = ce3.G[0][ce3.H[0] + le3];
                  256 <= fe3.value ? (he3.g = fe3.g + 256, he3.value = fe3.value) : (he3.g = 0, he3.value = 0, le3 >>= yt2(fe3, 8, he3), le3 >>= yt2(ce3.G[1][ce3.H[1] + le3], 16, he3), le3 >>= yt2(ce3.G[2][ce3.H[2] + le3], 0, he3), yt2(ce3.G[3][ce3.H[3] + le3], 24, he3));
                }
              }
            }
            Q3.vc = tt3, Q3.Wb = et3, Q3.Ya = dt3, Q3.yc = lt3, H3 = 1;
            break e;
          }
          H3 = 0;
        }
        if (!(c4 = H3)) {
          s3.a = 3;
          break t;
        }
        if (0 < b4) {
          if (m4.ua = 1 << b4, !O2(m4.Wa, b4)) {
            s3.a = 1, c4 = 0;
            break t;
          }
        } else m4.ua = 0;
        var de3 = s3, pe3 = f4, ge3 = p4, me3 = de3.s, ve3 = me3.xc;
        if (de3.c = pe3, de3.i = ge3, me3.md = E2(pe3, ve3), me3.wc = 0 == ve3 ? -1 : (1 << ve3) - 1, r2) {
          s3.xb = di;
          break t;
        }
        if (null == (v4 = a2(f4 * p4))) {
          s3.a = 1, c4 = 0;
          break t;
        }
        c4 = (c4 = _t2(s3, v4, 0, f4, p4, p4, null)) && !g4.h;
        break t;
      }
      return c4 ? (null != u4 ? u4[0] = v4 : (e(null == v4), e(r2)), s3.$ = 0, r2 || Pt2(m4)) : Pt2(m4), c4;
    }
    function It2(t4, n2) {
      var r2 = t4.c * t4.i, i3 = r2 + n2 + 16 * n2;
      return e(t4.c <= n2), t4.V = a2(i3), null == t4.V ? (t4.Ta = null, t4.Ua = 0, t4.a = 1, 0) : (t4.Ta = t4.V, t4.Ua = t4.Ba + r2 + n2, 1);
    }
    function jt2(t4, n2) {
      var r2 = t4.C, i3 = n2 - r2, a3 = t4.V, o3 = t4.Ba + t4.c * r2;
      for (e(n2 <= t4.l.o); 0 < i3; ) {
        var s3 = 16 < i3 ? 16 : i3, u4 = t4.l.ma, c4 = t4.l.width, l4 = c4 * s3, h4 = u4.ca, f4 = u4.tb + c4 * r2, d4 = t4.Ta, p4 = t4.Ua;
        Nt2(t4, s3, a3, o3), Sr(d4, p4, h4, f4, l4), At2(u4, r2, r2 + s3, h4, f4, c4), i3 -= s3, a3 += s3 * t4.c, r2 += s3;
      }
      e(r2 == n2), t4.C = t4.Ma = n2;
    }
    function Ct2() {
      this.ub = this.yd = this.td = this.Rb = 0;
    }
    function Ot2() {
      this.Kd = this.Ld = this.Ud = this.Td = this.i = this.c = 0;
    }
    function Bt2() {
      this.Fb = this.Bb = this.Cb = 0, this.Zb = a2(4), this.Lb = a2(4);
    }
    function Mt2() {
      this.Yb = function() {
        var t4 = [];
        return function t5(e2, n2, r2) {
          for (var i3 = r2[n2], a3 = 0; a3 < i3 && (e2.push(r2.length > n2 + 1 ? [] : 0), !(r2.length < n2 + 1)); a3++) t5(e2[a3], n2 + 1, r2);
        }(t4, 0, [3, 11]), t4;
      }();
    }
    function qt2() {
      this.jb = a2(3), this.Wc = s2([4, 8], Mt2), this.Xc = s2([4, 17], Mt2);
    }
    function Et2() {
      this.Pc = this.wb = this.Tb = this.zd = 0, this.vd = new a2(4), this.od = new a2(4);
    }
    function Rt2() {
      this.ld = this.La = this.dd = this.tc = 0;
    }
    function Dt2() {
      this.Na = this.la = 0;
    }
    function Tt2() {
      this.Sc = [0, 0], this.Eb = [0, 0], this.Qc = [0, 0], this.ia = this.lc = 0;
    }
    function zt2() {
      this.ad = a2(384), this.Za = 0, this.Ob = a2(16), this.$b = this.Ad = this.ia = this.Gc = this.Hc = this.Dd = 0;
    }
    function Ut2() {
      this.uc = this.M = this.Nb = 0, this.wa = Array(new Rt2()), this.Y = 0, this.ya = Array(new zt2()), this.aa = 0, this.l = new Gt2();
    }
    function Ht2() {
      this.y = a2(16), this.f = a2(8), this.ea = a2(8);
    }
    function Wt2() {
      this.cb = this.a = 0, this.sc = "", this.m = new w3(), this.Od = new Ct2(), this.Kc = new Ot2(), this.ed = new Et2(), this.Qa = new Bt2(), this.Ic = this.$c = this.Aa = 0, this.D = new Ut2(), this.Xb = this.Va = this.Hb = this.zb = this.yb = this.Ub = this.za = 0, this.Jc = o2(8, w3), this.ia = 0, this.pb = o2(4, Tt2), this.Pa = new qt2(), this.Bd = this.kc = 0, this.Ac = [], this.Bc = 0, this.zc = [0, 0, 0, 0], this.Gd = Array(new Ht2()), this.Hd = 0, this.rb = Array(new Dt2()), this.sb = 0, this.wa = Array(new Rt2()), this.Y = 0, this.oc = [], this.pc = 0, this.sa = [], this.ta = 0, this.qa = [], this.ra = 0, this.Ha = [], this.B = this.R = this.Ia = 0, this.Ec = [], this.M = this.ja = this.Vb = this.Fc = 0, this.ya = Array(new zt2()), this.L = this.aa = 0, this.gd = s2([4, 2], Rt2), this.ga = null, this.Fa = [], this.Cc = this.qc = this.P = 0, this.Gb = [], this.Uc = 0, this.mb = [], this.nb = 0, this.rc = [], this.Ga = this.Vc = 0;
    }
    function Vt2(t4, e2) {
      return 0 > t4 ? 0 : t4 > e2 ? e2 : t4;
    }
    function Gt2() {
      this.T = this.U = this.ka = this.height = this.width = 0, this.y = [], this.f = [], this.ea = [], this.Rc = this.fa = this.W = this.N = this.O = 0, this.ma = "void", this.put = "VP8IoPutHook", this.ac = "VP8IoSetupHook", this.bc = "VP8IoTeardownHook", this.ha = this.Kb = 0, this.data = [], this.hb = this.ib = this.da = this.o = this.j = this.va = this.v = this.Da = this.ob = this.w = 0, this.F = [], this.J = 0;
    }
    function Yt2() {
      var t4 = new Wt2();
      return null != t4 && (t4.a = 0, t4.sc = "OK", t4.cb = 0, t4.Xb = 0, ni || (ni = Zt2)), t4;
    }
    function Jt2(t4, e2, n2) {
      return 0 == t4.a && (t4.a = e2, t4.sc = n2, t4.cb = 0), 0;
    }
    function Xt2(t4, e2, n2) {
      return 3 <= n2 && 157 == t4[e2 + 0] && 1 == t4[e2 + 1] && 42 == t4[e2 + 2];
    }
    function Kt2(t4, n2) {
      if (null == t4) return 0;
      if (t4.a = 0, t4.sc = "OK", null == n2) return Jt2(t4, 2, "null VP8Io passed to VP8GetHeaders()");
      var r2 = n2.data, a3 = n2.w, o3 = n2.ha;
      if (4 > o3) return Jt2(t4, 7, "Truncated header.");
      var s3 = r2[a3 + 0] | r2[a3 + 1] << 8 | r2[a3 + 2] << 16, u4 = t4.Od;
      if (u4.Rb = !(1 & s3), u4.td = s3 >> 1 & 7, u4.yd = s3 >> 4 & 1, u4.ub = s3 >> 5, 3 < u4.td) return Jt2(t4, 3, "Incorrect keyframe parameters.");
      if (!u4.yd) return Jt2(t4, 4, "Frame not displayable.");
      a3 += 3, o3 -= 3;
      var c4 = t4.Kc;
      if (u4.Rb) {
        if (7 > o3) return Jt2(t4, 7, "cannot parse picture header");
        if (!Xt2(r2, a3, o3)) return Jt2(t4, 3, "Bad code word");
        c4.c = 16383 & (r2[a3 + 4] << 8 | r2[a3 + 3]), c4.Td = r2[a3 + 4] >> 6, c4.i = 16383 & (r2[a3 + 6] << 8 | r2[a3 + 5]), c4.Ud = r2[a3 + 6] >> 6, a3 += 7, o3 -= 7, t4.za = c4.c + 15 >> 4, t4.Ub = c4.i + 15 >> 4, n2.width = c4.c, n2.height = c4.i, n2.Da = 0, n2.j = 0, n2.v = 0, n2.va = n2.width, n2.o = n2.height, n2.da = 0, n2.ib = n2.width, n2.hb = n2.height, n2.U = n2.width, n2.T = n2.height, i2((s3 = t4.Pa).jb, 0, 255, s3.jb.length), e(null != (s3 = t4.Qa)), s3.Cb = 0, s3.Bb = 0, s3.Fb = 1, i2(s3.Zb, 0, 0, s3.Zb.length), i2(s3.Lb, 0, 0, s3.Lb);
      }
      if (u4.ub > o3) return Jt2(t4, 7, "bad partition length");
      p3(s3 = t4.m, r2, a3, u4.ub), a3 += u4.ub, o3 -= u4.ub, u4.Rb && (c4.Ld = P2(s3), c4.Kd = P2(s3)), c4 = t4.Qa;
      var l4, h4 = t4.Pa;
      if (e(null != s3), e(null != c4), c4.Cb = P2(s3), c4.Cb) {
        if (c4.Bb = P2(s3), P2(s3)) {
          for (c4.Fb = P2(s3), l4 = 0; 4 > l4; ++l4) c4.Zb[l4] = P2(s3) ? m3(s3, 7) : 0;
          for (l4 = 0; 4 > l4; ++l4) c4.Lb[l4] = P2(s3) ? m3(s3, 6) : 0;
        }
        if (c4.Bb) for (l4 = 0; 3 > l4; ++l4) h4.jb[l4] = P2(s3) ? g3(s3, 8) : 255;
      } else c4.Bb = 0;
      if (s3.Ka) return Jt2(t4, 3, "cannot parse segment header");
      if ((c4 = t4.ed).zd = P2(s3), c4.Tb = g3(s3, 6), c4.wb = g3(s3, 3), c4.Pc = P2(s3), c4.Pc && P2(s3)) {
        for (h4 = 0; 4 > h4; ++h4) P2(s3) && (c4.vd[h4] = m3(s3, 6));
        for (h4 = 0; 4 > h4; ++h4) P2(s3) && (c4.od[h4] = m3(s3, 6));
      }
      if (t4.L = 0 == c4.Tb ? 0 : c4.zd ? 1 : 2, s3.Ka) return Jt2(t4, 3, "cannot parse filter header");
      var f4 = o3;
      if (o3 = l4 = a3, a3 = l4 + f4, c4 = f4, t4.Xb = (1 << g3(t4.m, 2)) - 1, f4 < 3 * (h4 = t4.Xb)) r2 = 7;
      else {
        for (l4 += 3 * h4, c4 -= 3 * h4, f4 = 0; f4 < h4; ++f4) {
          var d4 = r2[o3 + 0] | r2[o3 + 1] << 8 | r2[o3 + 2] << 16;
          d4 > c4 && (d4 = c4), p3(t4.Jc[+f4], r2, l4, d4), l4 += d4, c4 -= d4, o3 += 3;
        }
        p3(t4.Jc[+h4], r2, l4, c4), r2 = l4 < a3 ? 0 : 5;
      }
      if (0 != r2) return Jt2(t4, r2, "cannot parse partitions");
      for (r2 = g3(l4 = t4.m, 7), o3 = P2(l4) ? m3(l4, 4) : 0, a3 = P2(l4) ? m3(l4, 4) : 0, c4 = P2(l4) ? m3(l4, 4) : 0, h4 = P2(l4) ? m3(l4, 4) : 0, l4 = P2(l4) ? m3(l4, 4) : 0, f4 = t4.Qa, d4 = 0; 4 > d4; ++d4) {
        if (f4.Cb) {
          var v4 = f4.Zb[d4];
          f4.Fb || (v4 += r2);
        } else {
          if (0 < d4) {
            t4.pb[d4] = t4.pb[0];
            continue;
          }
          v4 = r2;
        }
        var b4 = t4.pb[d4];
        b4.Sc[0] = ti[Vt2(v4 + o3, 127)], b4.Sc[1] = ei[Vt2(v4 + 0, 127)], b4.Eb[0] = 2 * ti[Vt2(v4 + a3, 127)], b4.Eb[1] = 101581 * ei[Vt2(v4 + c4, 127)] >> 16, 8 > b4.Eb[1] && (b4.Eb[1] = 8), b4.Qc[0] = ti[Vt2(v4 + h4, 117)], b4.Qc[1] = ei[Vt2(v4 + l4, 127)], b4.lc = v4 + l4;
      }
      if (!u4.Rb) return Jt2(t4, 4, "Not a key frame.");
      for (P2(s3), u4 = t4.Pa, r2 = 0; 4 > r2; ++r2) {
        for (o3 = 0; 8 > o3; ++o3) for (a3 = 0; 3 > a3; ++a3) for (c4 = 0; 11 > c4; ++c4) h4 = k2(s3, ui[r2][o3][a3][c4]) ? g3(s3, 8) : oi[r2][o3][a3][c4], u4.Wc[r2][o3].Yb[a3][c4] = h4;
        for (o3 = 0; 17 > o3; ++o3) u4.Xc[r2][o3] = u4.Wc[r2][ci[o3]];
      }
      return t4.kc = P2(s3), t4.kc && (t4.Bd = g3(s3, 8)), t4.cb = 1;
    }
    function Zt2(t4, e2, n2, r2, i3, a3, o3) {
      var s3 = e2[i3].Yb[n2];
      for (n2 = 0; 16 > i3; ++i3) {
        if (!k2(t4, s3[n2 + 0])) return i3;
        for (; !k2(t4, s3[n2 + 1]); ) if (s3 = e2[++i3].Yb[0], n2 = 0, 16 == i3) return 16;
        var u4 = e2[i3 + 1].Yb;
        if (k2(t4, s3[n2 + 2])) {
          var c4 = t4, l4 = 0;
          if (k2(c4, (f4 = s3)[(h4 = n2) + 3])) if (k2(c4, f4[h4 + 6])) {
            for (s3 = 0, h4 = 2 * (l4 = k2(c4, f4[h4 + 8])) + (f4 = k2(c4, f4[h4 + 9 + l4])), l4 = 0, f4 = ri[h4]; f4[s3]; ++s3) l4 += l4 + k2(c4, f4[s3]);
            l4 += 3 + (8 << h4);
          } else k2(c4, f4[h4 + 7]) ? (l4 = 7 + 2 * k2(c4, 165), l4 += k2(c4, 145)) : l4 = 5 + k2(c4, 159);
          else l4 = k2(c4, f4[h4 + 4]) ? 3 + k2(c4, f4[h4 + 5]) : 2;
          s3 = u4[2];
        } else l4 = 1, s3 = u4[1];
        u4 = o3 + ii[i3], 0 > (c4 = t4).b && _2(c4);
        var h4, f4 = c4.b, d4 = (h4 = c4.Ca >> 1) - (c4.I >> f4) >> 31;
        --c4.b, c4.Ca += d4, c4.Ca |= 1, c4.I -= (h4 + 1 & d4) << f4, a3[u4] = ((l4 ^ d4) - d4) * r2[(0 < i3) + 0];
      }
      return 16;
    }
    function $t2(t4) {
      var e2 = t4.rb[t4.sb - 1];
      e2.la = 0, e2.Na = 0, i2(t4.zc, 0, 0, t4.zc.length), t4.ja = 0;
    }
    function Qt2(t4, e2, n2, r2, i3) {
      i3 = t4[e2 + n2 + 32 * r2] + (i3 >> 3), t4[e2 + n2 + 32 * r2] = -256 & i3 ? 0 > i3 ? 0 : 255 : i3;
    }
    function te2(t4, e2, n2, r2, i3, a3) {
      Qt2(t4, e2, 0, n2, r2 + i3), Qt2(t4, e2, 1, n2, r2 + a3), Qt2(t4, e2, 2, n2, r2 - a3), Qt2(t4, e2, 3, n2, r2 - i3);
    }
    function ee2(t4) {
      return (20091 * t4 >> 16) + t4;
    }
    function ne2(t4, e2, n2, r2) {
      var i3, o3 = 0, s3 = a2(16);
      for (i3 = 0; 4 > i3; ++i3) {
        var u4 = t4[e2 + 0] + t4[e2 + 8], c4 = t4[e2 + 0] - t4[e2 + 8], l4 = (35468 * t4[e2 + 4] >> 16) - ee2(t4[e2 + 12]), h4 = ee2(t4[e2 + 4]) + (35468 * t4[e2 + 12] >> 16);
        s3[o3 + 0] = u4 + h4, s3[o3 + 1] = c4 + l4, s3[o3 + 2] = c4 - l4, s3[o3 + 3] = u4 - h4, o3 += 4, e2++;
      }
      for (i3 = o3 = 0; 4 > i3; ++i3) u4 = (t4 = s3[o3 + 0] + 4) + s3[o3 + 8], c4 = t4 - s3[o3 + 8], l4 = (35468 * s3[o3 + 4] >> 16) - ee2(s3[o3 + 12]), Qt2(n2, r2, 0, 0, u4 + (h4 = ee2(s3[o3 + 4]) + (35468 * s3[o3 + 12] >> 16))), Qt2(n2, r2, 1, 0, c4 + l4), Qt2(n2, r2, 2, 0, c4 - l4), Qt2(n2, r2, 3, 0, u4 - h4), o3++, r2 += 32;
    }
    function re2(t4, e2, n2, r2) {
      var i3 = t4[e2 + 0] + 4, a3 = 35468 * t4[e2 + 4] >> 16, o3 = ee2(t4[e2 + 4]), s3 = 35468 * t4[e2 + 1] >> 16;
      te2(n2, r2, 0, i3 + o3, t4 = ee2(t4[e2 + 1]), s3), te2(n2, r2, 1, i3 + a3, t4, s3), te2(n2, r2, 2, i3 - a3, t4, s3), te2(n2, r2, 3, i3 - o3, t4, s3);
    }
    function ie2(t4, e2, n2, r2, i3) {
      ne2(t4, e2, n2, r2), i3 && ne2(t4, e2 + 16, n2, r2 + 4);
    }
    function ae2(t4, e2, n2, r2) {
      ar(t4, e2 + 0, n2, r2, 1), ar(t4, e2 + 32, n2, r2 + 128, 1);
    }
    function oe2(t4, e2, n2, r2) {
      var i3;
      for (t4 = t4[e2 + 0] + 4, i3 = 0; 4 > i3; ++i3) for (e2 = 0; 4 > e2; ++e2) Qt2(n2, r2, e2, i3, t4);
    }
    function se2(t4, e2, n2, r2) {
      t4[e2 + 0] && ur(t4, e2 + 0, n2, r2), t4[e2 + 16] && ur(t4, e2 + 16, n2, r2 + 4), t4[e2 + 32] && ur(t4, e2 + 32, n2, r2 + 128), t4[e2 + 48] && ur(t4, e2 + 48, n2, r2 + 128 + 4);
    }
    function ue2(t4, e2, n2, r2) {
      var i3, o3 = a2(16);
      for (i3 = 0; 4 > i3; ++i3) {
        var s3 = t4[e2 + 0 + i3] + t4[e2 + 12 + i3], u4 = t4[e2 + 4 + i3] + t4[e2 + 8 + i3], c4 = t4[e2 + 4 + i3] - t4[e2 + 8 + i3], l4 = t4[e2 + 0 + i3] - t4[e2 + 12 + i3];
        o3[0 + i3] = s3 + u4, o3[8 + i3] = s3 - u4, o3[4 + i3] = l4 + c4, o3[12 + i3] = l4 - c4;
      }
      for (i3 = 0; 4 > i3; ++i3) s3 = (t4 = o3[0 + 4 * i3] + 3) + o3[3 + 4 * i3], u4 = o3[1 + 4 * i3] + o3[2 + 4 * i3], c4 = o3[1 + 4 * i3] - o3[2 + 4 * i3], l4 = t4 - o3[3 + 4 * i3], n2[r2 + 0] = s3 + u4 >> 3, n2[r2 + 16] = l4 + c4 >> 3, n2[r2 + 32] = s3 - u4 >> 3, n2[r2 + 48] = l4 - c4 >> 3, r2 += 64;
    }
    function ce2(t4, e2, n2) {
      var r2, i3 = e2 - 32, a3 = Or, o3 = 255 - t4[i3 - 1];
      for (r2 = 0; r2 < n2; ++r2) {
        var s3, u4 = a3, c4 = o3 + t4[e2 - 1];
        for (s3 = 0; s3 < n2; ++s3) t4[e2 + s3] = u4[c4 + t4[i3 + s3]];
        e2 += 32;
      }
    }
    function le2(t4, e2) {
      ce2(t4, e2, 4);
    }
    function he2(t4, e2) {
      ce2(t4, e2, 8);
    }
    function fe2(t4, e2) {
      ce2(t4, e2, 16);
    }
    function de2(t4, e2) {
      var n2;
      for (n2 = 0; 16 > n2; ++n2) r(t4, e2 + 32 * n2, t4, e2 - 32, 16);
    }
    function pe2(t4, e2) {
      var n2;
      for (n2 = 16; 0 < n2; --n2) i2(t4, e2, t4[e2 - 1], 16), e2 += 32;
    }
    function ge2(t4, e2, n2) {
      var r2;
      for (r2 = 0; 16 > r2; ++r2) i2(e2, n2 + 32 * r2, t4, 16);
    }
    function me2(t4, e2) {
      var n2, r2 = 16;
      for (n2 = 0; 16 > n2; ++n2) r2 += t4[e2 - 1 + 32 * n2] + t4[e2 + n2 - 32];
      ge2(r2 >> 5, t4, e2);
    }
    function ve2(t4, e2) {
      var n2, r2 = 8;
      for (n2 = 0; 16 > n2; ++n2) r2 += t4[e2 - 1 + 32 * n2];
      ge2(r2 >> 4, t4, e2);
    }
    function be2(t4, e2) {
      var n2, r2 = 8;
      for (n2 = 0; 16 > n2; ++n2) r2 += t4[e2 + n2 - 32];
      ge2(r2 >> 4, t4, e2);
    }
    function ye2(t4, e2) {
      ge2(128, t4, e2);
    }
    function we2(t4, e2, n2) {
      return t4 + 2 * e2 + n2 + 2 >> 2;
    }
    function Ne2(t4, e2) {
      var n2, i3 = e2 - 32;
      for (i3 = new Uint8Array([we2(t4[i3 - 1], t4[i3 + 0], t4[i3 + 1]), we2(t4[i3 + 0], t4[i3 + 1], t4[i3 + 2]), we2(t4[i3 + 1], t4[i3 + 2], t4[i3 + 3]), we2(t4[i3 + 2], t4[i3 + 3], t4[i3 + 4])]), n2 = 0; 4 > n2; ++n2) r(t4, e2 + 32 * n2, i3, 0, i3.length);
    }
    function Le2(t4, e2) {
      var n2 = t4[e2 - 1], r2 = t4[e2 - 1 + 32], i3 = t4[e2 - 1 + 64], a3 = t4[e2 - 1 + 96];
      F2(t4, e2 + 0, 16843009 * we2(t4[e2 - 1 - 32], n2, r2)), F2(t4, e2 + 32, 16843009 * we2(n2, r2, i3)), F2(t4, e2 + 64, 16843009 * we2(r2, i3, a3)), F2(t4, e2 + 96, 16843009 * we2(i3, a3, a3));
    }
    function xe2(t4, e2) {
      var n2, r2 = 4;
      for (n2 = 0; 4 > n2; ++n2) r2 += t4[e2 + n2 - 32] + t4[e2 - 1 + 32 * n2];
      for (r2 >>= 3, n2 = 0; 4 > n2; ++n2) i2(t4, e2 + 32 * n2, r2, 4);
    }
    function Ae2(t4, e2) {
      var n2 = t4[e2 - 1 + 0], r2 = t4[e2 - 1 + 32], i3 = t4[e2 - 1 + 64], a3 = t4[e2 - 1 - 32], o3 = t4[e2 + 0 - 32], s3 = t4[e2 + 1 - 32], u4 = t4[e2 + 2 - 32], c4 = t4[e2 + 3 - 32];
      t4[e2 + 0 + 96] = we2(r2, i3, t4[e2 - 1 + 96]), t4[e2 + 1 + 96] = t4[e2 + 0 + 64] = we2(n2, r2, i3), t4[e2 + 2 + 96] = t4[e2 + 1 + 64] = t4[e2 + 0 + 32] = we2(a3, n2, r2), t4[e2 + 3 + 96] = t4[e2 + 2 + 64] = t4[e2 + 1 + 32] = t4[e2 + 0 + 0] = we2(o3, a3, n2), t4[e2 + 3 + 64] = t4[e2 + 2 + 32] = t4[e2 + 1 + 0] = we2(s3, o3, a3), t4[e2 + 3 + 32] = t4[e2 + 2 + 0] = we2(u4, s3, o3), t4[e2 + 3 + 0] = we2(c4, u4, s3);
    }
    function Se2(t4, e2) {
      var n2 = t4[e2 + 1 - 32], r2 = t4[e2 + 2 - 32], i3 = t4[e2 + 3 - 32], a3 = t4[e2 + 4 - 32], o3 = t4[e2 + 5 - 32], s3 = t4[e2 + 6 - 32], u4 = t4[e2 + 7 - 32];
      t4[e2 + 0 + 0] = we2(t4[e2 + 0 - 32], n2, r2), t4[e2 + 1 + 0] = t4[e2 + 0 + 32] = we2(n2, r2, i3), t4[e2 + 2 + 0] = t4[e2 + 1 + 32] = t4[e2 + 0 + 64] = we2(r2, i3, a3), t4[e2 + 3 + 0] = t4[e2 + 2 + 32] = t4[e2 + 1 + 64] = t4[e2 + 0 + 96] = we2(i3, a3, o3), t4[e2 + 3 + 32] = t4[e2 + 2 + 64] = t4[e2 + 1 + 96] = we2(a3, o3, s3), t4[e2 + 3 + 64] = t4[e2 + 2 + 96] = we2(o3, s3, u4), t4[e2 + 3 + 96] = we2(s3, u4, u4);
    }
    function _e2(t4, e2) {
      var n2 = t4[e2 - 1 + 0], r2 = t4[e2 - 1 + 32], i3 = t4[e2 - 1 + 64], a3 = t4[e2 - 1 - 32], o3 = t4[e2 + 0 - 32], s3 = t4[e2 + 1 - 32], u4 = t4[e2 + 2 - 32], c4 = t4[e2 + 3 - 32];
      t4[e2 + 0 + 0] = t4[e2 + 1 + 64] = a3 + o3 + 1 >> 1, t4[e2 + 1 + 0] = t4[e2 + 2 + 64] = o3 + s3 + 1 >> 1, t4[e2 + 2 + 0] = t4[e2 + 3 + 64] = s3 + u4 + 1 >> 1, t4[e2 + 3 + 0] = u4 + c4 + 1 >> 1, t4[e2 + 0 + 96] = we2(i3, r2, n2), t4[e2 + 0 + 64] = we2(r2, n2, a3), t4[e2 + 0 + 32] = t4[e2 + 1 + 96] = we2(n2, a3, o3), t4[e2 + 1 + 32] = t4[e2 + 2 + 96] = we2(a3, o3, s3), t4[e2 + 2 + 32] = t4[e2 + 3 + 96] = we2(o3, s3, u4), t4[e2 + 3 + 32] = we2(s3, u4, c4);
    }
    function Pe2(t4, e2) {
      var n2 = t4[e2 + 0 - 32], r2 = t4[e2 + 1 - 32], i3 = t4[e2 + 2 - 32], a3 = t4[e2 + 3 - 32], o3 = t4[e2 + 4 - 32], s3 = t4[e2 + 5 - 32], u4 = t4[e2 + 6 - 32], c4 = t4[e2 + 7 - 32];
      t4[e2 + 0 + 0] = n2 + r2 + 1 >> 1, t4[e2 + 1 + 0] = t4[e2 + 0 + 64] = r2 + i3 + 1 >> 1, t4[e2 + 2 + 0] = t4[e2 + 1 + 64] = i3 + a3 + 1 >> 1, t4[e2 + 3 + 0] = t4[e2 + 2 + 64] = a3 + o3 + 1 >> 1, t4[e2 + 0 + 32] = we2(n2, r2, i3), t4[e2 + 1 + 32] = t4[e2 + 0 + 96] = we2(r2, i3, a3), t4[e2 + 2 + 32] = t4[e2 + 1 + 96] = we2(i3, a3, o3), t4[e2 + 3 + 32] = t4[e2 + 2 + 96] = we2(a3, o3, s3), t4[e2 + 3 + 64] = we2(o3, s3, u4), t4[e2 + 3 + 96] = we2(s3, u4, c4);
    }
    function ke2(t4, e2) {
      var n2 = t4[e2 - 1 + 0], r2 = t4[e2 - 1 + 32], i3 = t4[e2 - 1 + 64], a3 = t4[e2 - 1 + 96];
      t4[e2 + 0 + 0] = n2 + r2 + 1 >> 1, t4[e2 + 2 + 0] = t4[e2 + 0 + 32] = r2 + i3 + 1 >> 1, t4[e2 + 2 + 32] = t4[e2 + 0 + 64] = i3 + a3 + 1 >> 1, t4[e2 + 1 + 0] = we2(n2, r2, i3), t4[e2 + 3 + 0] = t4[e2 + 1 + 32] = we2(r2, i3, a3), t4[e2 + 3 + 32] = t4[e2 + 1 + 64] = we2(i3, a3, a3), t4[e2 + 3 + 64] = t4[e2 + 2 + 64] = t4[e2 + 0 + 96] = t4[e2 + 1 + 96] = t4[e2 + 2 + 96] = t4[e2 + 3 + 96] = a3;
    }
    function Fe2(t4, e2) {
      var n2 = t4[e2 - 1 + 0], r2 = t4[e2 - 1 + 32], i3 = t4[e2 - 1 + 64], a3 = t4[e2 - 1 + 96], o3 = t4[e2 - 1 - 32], s3 = t4[e2 + 0 - 32], u4 = t4[e2 + 1 - 32], c4 = t4[e2 + 2 - 32];
      t4[e2 + 0 + 0] = t4[e2 + 2 + 32] = n2 + o3 + 1 >> 1, t4[e2 + 0 + 32] = t4[e2 + 2 + 64] = r2 + n2 + 1 >> 1, t4[e2 + 0 + 64] = t4[e2 + 2 + 96] = i3 + r2 + 1 >> 1, t4[e2 + 0 + 96] = a3 + i3 + 1 >> 1, t4[e2 + 3 + 0] = we2(s3, u4, c4), t4[e2 + 2 + 0] = we2(o3, s3, u4), t4[e2 + 1 + 0] = t4[e2 + 3 + 32] = we2(n2, o3, s3), t4[e2 + 1 + 32] = t4[e2 + 3 + 64] = we2(r2, n2, o3), t4[e2 + 1 + 64] = t4[e2 + 3 + 96] = we2(i3, r2, n2), t4[e2 + 1 + 96] = we2(a3, i3, r2);
    }
    function Ie2(t4, e2) {
      var n2;
      for (n2 = 0; 8 > n2; ++n2) r(t4, e2 + 32 * n2, t4, e2 - 32, 8);
    }
    function je2(t4, e2) {
      var n2;
      for (n2 = 0; 8 > n2; ++n2) i2(t4, e2, t4[e2 - 1], 8), e2 += 32;
    }
    function Ce(t4, e2, n2) {
      var r2;
      for (r2 = 0; 8 > r2; ++r2) i2(e2, n2 + 32 * r2, t4, 8);
    }
    function Oe(t4, e2) {
      var n2, r2 = 8;
      for (n2 = 0; 8 > n2; ++n2) r2 += t4[e2 + n2 - 32] + t4[e2 - 1 + 32 * n2];
      Ce(r2 >> 4, t4, e2);
    }
    function Be(t4, e2) {
      var n2, r2 = 4;
      for (n2 = 0; 8 > n2; ++n2) r2 += t4[e2 + n2 - 32];
      Ce(r2 >> 3, t4, e2);
    }
    function Me(t4, e2) {
      var n2, r2 = 4;
      for (n2 = 0; 8 > n2; ++n2) r2 += t4[e2 - 1 + 32 * n2];
      Ce(r2 >> 3, t4, e2);
    }
    function qe(t4, e2) {
      Ce(128, t4, e2);
    }
    function Ee(t4, e2, n2) {
      var r2 = t4[e2 - n2], i3 = t4[e2 + 0], a3 = 3 * (i3 - r2) + jr[1020 + t4[e2 - 2 * n2] - t4[e2 + n2]], o3 = Cr[112 + (a3 + 4 >> 3)];
      t4[e2 - n2] = Or[255 + r2 + Cr[112 + (a3 + 3 >> 3)]], t4[e2 + 0] = Or[255 + i3 - o3];
    }
    function Re(t4, e2, n2, r2) {
      var i3 = t4[e2 + 0], a3 = t4[e2 + n2];
      return Br[255 + t4[e2 - 2 * n2] - t4[e2 - n2]] > r2 || Br[255 + a3 - i3] > r2;
    }
    function De(t4, e2, n2, r2) {
      return 4 * Br[255 + t4[e2 - n2] - t4[e2 + 0]] + Br[255 + t4[e2 - 2 * n2] - t4[e2 + n2]] <= r2;
    }
    function Te(t4, e2, n2, r2, i3) {
      var a3 = t4[e2 - 3 * n2], o3 = t4[e2 - 2 * n2], s3 = t4[e2 - n2], u4 = t4[e2 + 0], c4 = t4[e2 + n2], l4 = t4[e2 + 2 * n2], h4 = t4[e2 + 3 * n2];
      return 4 * Br[255 + s3 - u4] + Br[255 + o3 - c4] > r2 ? 0 : Br[255 + t4[e2 - 4 * n2] - a3] <= i3 && Br[255 + a3 - o3] <= i3 && Br[255 + o3 - s3] <= i3 && Br[255 + h4 - l4] <= i3 && Br[255 + l4 - c4] <= i3 && Br[255 + c4 - u4] <= i3;
    }
    function ze(t4, e2, n2, r2) {
      var i3 = 2 * r2 + 1;
      for (r2 = 0; 16 > r2; ++r2) De(t4, e2 + r2, n2, i3) && Ee(t4, e2 + r2, n2);
    }
    function Ue(t4, e2, n2, r2) {
      var i3 = 2 * r2 + 1;
      for (r2 = 0; 16 > r2; ++r2) De(t4, e2 + r2 * n2, 1, i3) && Ee(t4, e2 + r2 * n2, 1);
    }
    function He(t4, e2, n2, r2) {
      var i3;
      for (i3 = 3; 0 < i3; --i3) ze(t4, e2 += 4 * n2, n2, r2);
    }
    function We(t4, e2, n2, r2) {
      var i3;
      for (i3 = 3; 0 < i3; --i3) Ue(t4, e2 += 4, n2, r2);
    }
    function Ve(t4, e2, n2, r2, i3, a3, o3, s3) {
      for (a3 = 2 * a3 + 1; 0 < i3--; ) {
        if (Te(t4, e2, n2, a3, o3)) if (Re(t4, e2, n2, s3)) Ee(t4, e2, n2);
        else {
          var u4 = t4, c4 = e2, l4 = n2, h4 = u4[c4 - 2 * l4], f4 = u4[c4 - l4], d4 = u4[c4 + 0], p4 = u4[c4 + l4], g4 = u4[c4 + 2 * l4], m4 = 27 * (b4 = jr[1020 + 3 * (d4 - f4) + jr[1020 + h4 - p4]]) + 63 >> 7, v4 = 18 * b4 + 63 >> 7, b4 = 9 * b4 + 63 >> 7;
          u4[c4 - 3 * l4] = Or[255 + u4[c4 - 3 * l4] + b4], u4[c4 - 2 * l4] = Or[255 + h4 + v4], u4[c4 - l4] = Or[255 + f4 + m4], u4[c4 + 0] = Or[255 + d4 - m4], u4[c4 + l4] = Or[255 + p4 - v4], u4[c4 + 2 * l4] = Or[255 + g4 - b4];
        }
        e2 += r2;
      }
    }
    function Ge(t4, e2, n2, r2, i3, a3, o3, s3) {
      for (a3 = 2 * a3 + 1; 0 < i3--; ) {
        if (Te(t4, e2, n2, a3, o3)) if (Re(t4, e2, n2, s3)) Ee(t4, e2, n2);
        else {
          var u4 = t4, c4 = e2, l4 = n2, h4 = u4[c4 - l4], f4 = u4[c4 + 0], d4 = u4[c4 + l4], p4 = Cr[112 + (4 + (g4 = 3 * (f4 - h4)) >> 3)], g4 = Cr[112 + (g4 + 3 >> 3)], m4 = p4 + 1 >> 1;
          u4[c4 - 2 * l4] = Or[255 + u4[c4 - 2 * l4] + m4], u4[c4 - l4] = Or[255 + h4 + g4], u4[c4 + 0] = Or[255 + f4 - p4], u4[c4 + l4] = Or[255 + d4 - m4];
        }
        e2 += r2;
      }
    }
    function Ye(t4, e2, n2, r2, i3, a3) {
      Ve(t4, e2, n2, 1, 16, r2, i3, a3);
    }
    function Je(t4, e2, n2, r2, i3, a3) {
      Ve(t4, e2, 1, n2, 16, r2, i3, a3);
    }
    function Xe(t4, e2, n2, r2, i3, a3) {
      var o3;
      for (o3 = 3; 0 < o3; --o3) Ge(t4, e2 += 4 * n2, n2, 1, 16, r2, i3, a3);
    }
    function Ke(t4, e2, n2, r2, i3, a3) {
      var o3;
      for (o3 = 3; 0 < o3; --o3) Ge(t4, e2 += 4, 1, n2, 16, r2, i3, a3);
    }
    function Ze(t4, e2, n2, r2, i3, a3, o3, s3) {
      Ve(t4, e2, i3, 1, 8, a3, o3, s3), Ve(n2, r2, i3, 1, 8, a3, o3, s3);
    }
    function $e(t4, e2, n2, r2, i3, a3, o3, s3) {
      Ve(t4, e2, 1, i3, 8, a3, o3, s3), Ve(n2, r2, 1, i3, 8, a3, o3, s3);
    }
    function Qe(t4, e2, n2, r2, i3, a3, o3, s3) {
      Ge(t4, e2 + 4 * i3, i3, 1, 8, a3, o3, s3), Ge(n2, r2 + 4 * i3, i3, 1, 8, a3, o3, s3);
    }
    function tn(t4, e2, n2, r2, i3, a3, o3, s3) {
      Ge(t4, e2 + 4, 1, i3, 8, a3, o3, s3), Ge(n2, r2 + 4, 1, i3, 8, a3, o3, s3);
    }
    function en() {
      this.ba = new ot2(), this.ec = [], this.cc = [], this.Mc = [], this.Dc = this.Nc = this.dc = this.fc = 0, this.Oa = new ut2(), this.memory = 0, this.Ib = "OutputFunc", this.Jb = "OutputAlphaFunc", this.Nd = "OutputRowFunc";
    }
    function nn() {
      this.data = [], this.offset = this.kd = this.ha = this.w = 0, this.na = [], this.xa = this.gb = this.Ja = this.Sa = this.P = 0;
    }
    function rn() {
      this.nc = this.Ea = this.b = this.hc = 0, this.K = [], this.w = 0;
    }
    function an() {
      this.ua = 0, this.Wa = new M2(), this.vb = new M2(), this.md = this.xc = this.wc = 0, this.vc = [], this.Wb = 0, this.Ya = new d3(), this.yc = new h3();
    }
    function on() {
      this.xb = this.a = 0, this.l = new Gt2(), this.ca = new ot2(), this.V = [], this.Ba = 0, this.Ta = [], this.Ua = 0, this.m = new N3(), this.Pb = 0, this.wd = new N3(), this.Ma = this.$ = this.C = this.i = this.c = this.xd = 0, this.s = new an(), this.ab = 0, this.gc = o2(4, rn), this.Oc = 0;
    }
    function sn() {
      this.Lc = this.Z = this.$a = this.i = this.c = 0, this.l = new Gt2(), this.ic = 0, this.ca = [], this.tb = 0, this.qd = null, this.rd = 0;
    }
    function un(t4, e2, n2, r2, i3, a3, o3) {
      for (t4 = null == t4 ? 0 : t4[e2 + 0], e2 = 0; e2 < o3; ++e2) i3[a3 + e2] = t4 + n2[r2 + e2] & 255, t4 = i3[a3 + e2];
    }
    function cn(t4, e2, n2, r2, i3, a3, o3) {
      var s3;
      if (null == t4) un(null, null, n2, r2, i3, a3, o3);
      else for (s3 = 0; s3 < o3; ++s3) i3[a3 + s3] = t4[e2 + s3] + n2[r2 + s3] & 255;
    }
    function ln2(t4, e2, n2, r2, i3, a3, o3) {
      if (null == t4) un(null, null, n2, r2, i3, a3, o3);
      else {
        var s3, u4 = t4[e2 + 0], c4 = u4, l4 = u4;
        for (s3 = 0; s3 < o3; ++s3) c4 = l4 + (u4 = t4[e2 + s3]) - c4, l4 = n2[r2 + s3] + (-256 & c4 ? 0 > c4 ? 0 : 255 : c4) & 255, c4 = u4, i3[a3 + s3] = l4;
      }
    }
    function hn(t4, n2, i3, o3) {
      var s3 = n2.width, u4 = n2.o;
      if (e(null != t4 && null != n2), 0 > i3 || 0 >= o3 || i3 + o3 > u4) return null;
      if (!t4.Cc) {
        if (null == t4.ga) {
          var c4;
          if (t4.ga = new sn(), (c4 = null == t4.ga) || (c4 = n2.width * n2.o, e(0 == t4.Gb.length), t4.Gb = a2(c4), t4.Uc = 0, null == t4.Gb ? c4 = 0 : (t4.mb = t4.Gb, t4.nb = t4.Uc, t4.rc = null, c4 = 1), c4 = !c4), !c4) {
            c4 = t4.ga;
            var l4 = t4.Fa, h4 = t4.P, f4 = t4.qc, d4 = t4.mb, p4 = t4.nb, g4 = h4 + 1, m4 = f4 - 1, b4 = c4.l;
            if (e(null != l4 && null != d4 && null != n2), gi[0] = null, gi[1] = un, gi[2] = cn, gi[3] = ln2, c4.ca = d4, c4.tb = p4, c4.c = n2.width, c4.i = n2.height, e(0 < c4.c && 0 < c4.i), 1 >= f4) n2 = 0;
            else if (c4.$a = 3 & l4[h4 + 0], c4.Z = l4[h4 + 0] >> 2 & 3, c4.Lc = l4[h4 + 0] >> 4 & 3, h4 = l4[h4 + 0] >> 6 & 3, 0 > c4.$a || 1 < c4.$a || 4 <= c4.Z || 1 < c4.Lc || h4) n2 = 0;
            else if (b4.put = dt2, b4.ac = ft2, b4.bc = pt2, b4.ma = c4, b4.width = n2.width, b4.height = n2.height, b4.Da = n2.Da, b4.v = n2.v, b4.va = n2.va, b4.j = n2.j, b4.o = n2.o, c4.$a) t: {
              e(1 == c4.$a), n2 = kt2();
              e: for (; ; ) {
                if (null == n2) {
                  n2 = 0;
                  break t;
                }
                if (e(null != c4), c4.mc = n2, n2.c = c4.c, n2.i = c4.i, n2.l = c4.l, n2.l.ma = c4, n2.l.width = c4.c, n2.l.height = c4.i, n2.a = 0, v3(n2.m, l4, g4, m4), !Ft2(c4.c, c4.i, 1, n2, null)) break e;
                if (1 == n2.ab && 3 == n2.gc[0].hc && xt2(n2.s) ? (c4.ic = 1, l4 = n2.c * n2.i, n2.Ta = null, n2.Ua = 0, n2.V = a2(l4), n2.Ba = 0, null == n2.V ? (n2.a = 1, n2 = 0) : n2 = 1) : (c4.ic = 0, n2 = It2(n2, c4.c)), !n2) break e;
                n2 = 1;
                break t;
              }
              c4.mc = null, n2 = 0;
            }
            else n2 = m4 >= c4.c * c4.i;
            c4 = !n2;
          }
          if (c4) return null;
          1 != t4.ga.Lc ? t4.Ga = 0 : o3 = u4 - i3;
        }
        e(null != t4.ga), e(i3 + o3 <= u4);
        t: {
          if (n2 = (l4 = t4.ga).c, u4 = l4.l.o, 0 == l4.$a) {
            if (g4 = t4.rc, m4 = t4.Vc, b4 = t4.Fa, h4 = t4.P + 1 + i3 * n2, f4 = t4.mb, d4 = t4.nb + i3 * n2, e(h4 <= t4.P + t4.qc), 0 != l4.Z) for (e(null != gi[l4.Z]), c4 = 0; c4 < o3; ++c4) gi[l4.Z](g4, m4, b4, h4, f4, d4, n2), g4 = f4, m4 = d4, d4 += n2, h4 += n2;
            else for (c4 = 0; c4 < o3; ++c4) r(f4, d4, b4, h4, n2), g4 = f4, m4 = d4, d4 += n2, h4 += n2;
            t4.rc = g4, t4.Vc = m4;
          } else {
            if (e(null != l4.mc), n2 = i3 + o3, e(null != (c4 = l4.mc)), e(n2 <= c4.i), c4.C >= n2) n2 = 1;
            else if (l4.ic || mn(), l4.ic) {
              l4 = c4.V, g4 = c4.Ba, m4 = c4.c;
              var y4 = c4.i, w4 = (b4 = 1, h4 = c4.$ / m4, f4 = c4.$ % m4, d4 = c4.m, p4 = c4.s, c4.$), N4 = m4 * y4, L4 = m4 * n2, A4 = p4.wc, _3 = w4 < L4 ? wt2(p4, f4, h4) : null;
              e(w4 <= N4), e(n2 <= y4), e(xt2(p4));
              e: for (; ; ) {
                for (; !d4.h && w4 < L4; ) {
                  if (f4 & A4 || (_3 = wt2(p4, f4, h4)), e(null != _3), S2(d4), 256 > (y4 = bt2(_3.G[0], _3.H[0], d4))) l4[g4 + w4] = y4, ++w4, ++f4 >= m4 && (f4 = 0, ++h4 <= n2 && !(h4 % 16) && St(c4, h4));
                  else {
                    if (!(280 > y4)) {
                      b4 = 0;
                      break e;
                    }
                    y4 = mt2(y4 - 256, d4);
                    var P3, k3 = bt2(_3.G[4], _3.H[4], d4);
                    if (S2(d4), !(w4 >= (k3 = vt2(m4, k3 = mt2(k3, d4))) && N4 - w4 >= y4)) {
                      b4 = 0;
                      break e;
                    }
                    for (P3 = 0; P3 < y4; ++P3) l4[g4 + w4 + P3] = l4[g4 + w4 + P3 - k3];
                    for (w4 += y4, f4 += y4; f4 >= m4; ) f4 -= m4, ++h4 <= n2 && !(h4 % 16) && St(c4, h4);
                    w4 < L4 && f4 & A4 && (_3 = wt2(p4, f4, h4));
                  }
                  e(d4.h == x3(d4));
                }
                St(c4, h4 > n2 ? n2 : h4);
                break e;
              }
              !b4 || d4.h && w4 < N4 ? (b4 = 0, c4.a = d4.h ? 5 : 3) : c4.$ = w4, n2 = b4;
            } else n2 = _t2(c4, c4.V, c4.Ba, c4.c, c4.i, n2, jt2);
            if (!n2) {
              o3 = 0;
              break t;
            }
          }
          i3 + o3 >= u4 && (t4.Cc = 1), o3 = 1;
        }
        if (!o3) return null;
        if (t4.Cc && (null != (o3 = t4.ga) && (o3.mc = null), t4.ga = null, 0 < t4.Ga)) return alert("todo:WebPDequantizeLevels"), null;
      }
      return t4.nb + i3 * s3;
    }
    function fn(t4, e2, n2, r2, i3, a3) {
      for (; 0 < i3--; ) {
        var o3, s3 = t4, u4 = e2 + (n2 ? 1 : 0), c4 = t4, l4 = e2 + (n2 ? 0 : 3);
        for (o3 = 0; o3 < r2; ++o3) {
          var h4 = c4[l4 + 4 * o3];
          255 != h4 && (h4 *= 32897, s3[u4 + 4 * o3 + 0] = s3[u4 + 4 * o3 + 0] * h4 >> 23, s3[u4 + 4 * o3 + 1] = s3[u4 + 4 * o3 + 1] * h4 >> 23, s3[u4 + 4 * o3 + 2] = s3[u4 + 4 * o3 + 2] * h4 >> 23);
        }
        e2 += a3;
      }
    }
    function dn(t4, e2, n2, r2, i3) {
      for (; 0 < r2--; ) {
        var a3;
        for (a3 = 0; a3 < n2; ++a3) {
          var o3 = t4[e2 + 2 * a3 + 0], s3 = 15 & (c4 = t4[e2 + 2 * a3 + 1]), u4 = 4369 * s3, c4 = (240 & c4 | c4 >> 4) * u4 >> 16;
          t4[e2 + 2 * a3 + 0] = (240 & o3 | o3 >> 4) * u4 >> 16 & 240 | (15 & o3 | o3 << 4) * u4 >> 16 >> 4 & 15, t4[e2 + 2 * a3 + 1] = 240 & c4 | s3;
        }
        e2 += i3;
      }
    }
    function pn(t4, e2, n2, r2, i3, a3, o3, s3) {
      var u4, c4, l4 = 255;
      for (c4 = 0; c4 < i3; ++c4) {
        for (u4 = 0; u4 < r2; ++u4) {
          var h4 = t4[e2 + u4];
          a3[o3 + 4 * u4] = h4, l4 &= h4;
        }
        e2 += n2, o3 += s3;
      }
      return 255 != l4;
    }
    function gn(t4, e2, n2, r2, i3) {
      var a3;
      for (a3 = 0; a3 < i3; ++a3) n2[r2 + a3] = t4[e2 + a3] >> 8;
    }
    function mn() {
      Lr = fn, xr = dn, Ar = pn, Sr = gn;
    }
    function vn(n2, r2, i3) {
      t3[n2] = function(t4, n3, a3, o3, s3, u4, c4, l4, h4, f4, d4, p4, g4, m4, v4, b4, y4) {
        var w4, N4 = y4 - 1 >> 1, L4 = s3[u4 + 0] | c4[l4 + 0] << 16, x4 = h4[f4 + 0] | d4[p4 + 0] << 16;
        e(null != t4);
        var A4 = 3 * L4 + x4 + 131074 >> 2;
        for (r2(t4[n3 + 0], 255 & A4, A4 >> 16, g4, m4), null != a3 && (A4 = 3 * x4 + L4 + 131074 >> 2, r2(a3[o3 + 0], 255 & A4, A4 >> 16, v4, b4)), w4 = 1; w4 <= N4; ++w4) {
          var S3 = s3[u4 + w4] | c4[l4 + w4] << 16, _3 = h4[f4 + w4] | d4[p4 + w4] << 16, P3 = L4 + S3 + x4 + _3 + 524296, k3 = P3 + 2 * (S3 + x4) >> 3;
          A4 = k3 + L4 >> 1, L4 = (P3 = P3 + 2 * (L4 + _3) >> 3) + S3 >> 1, r2(t4[n3 + 2 * w4 - 1], 255 & A4, A4 >> 16, g4, m4 + (2 * w4 - 1) * i3), r2(t4[n3 + 2 * w4 - 0], 255 & L4, L4 >> 16, g4, m4 + (2 * w4 - 0) * i3), null != a3 && (A4 = P3 + x4 >> 1, L4 = k3 + _3 >> 1, r2(a3[o3 + 2 * w4 - 1], 255 & A4, A4 >> 16, v4, b4 + (2 * w4 - 1) * i3), r2(a3[o3 + 2 * w4 + 0], 255 & L4, L4 >> 16, v4, b4 + (2 * w4 + 0) * i3)), L4 = S3, x4 = _3;
        }
        1 & y4 || (A4 = 3 * L4 + x4 + 131074 >> 2, r2(t4[n3 + y4 - 1], 255 & A4, A4 >> 16, g4, m4 + (y4 - 1) * i3), null != a3 && (A4 = 3 * x4 + L4 + 131074 >> 2, r2(a3[o3 + y4 - 1], 255 & A4, A4 >> 16, v4, b4 + (y4 - 1) * i3)));
      };
    }
    function bn() {
      mi[Mr] = vi, mi[qr] = yi, mi[Er] = bi, mi[Rr] = wi, mi[Dr] = Ni, mi[Tr] = Li, mi[zr] = xi, mi[Ur] = yi, mi[Hr] = wi, mi[Wr] = Ni, mi[Vr] = Li;
    }
    function yn(t4) {
      return t4 & -16384 ? 0 > t4 ? 0 : 255 : t4 >> ki;
    }
    function wn(t4, e2) {
      return yn((19077 * t4 >> 8) + (26149 * e2 >> 8) - 14234);
    }
    function Nn(t4, e2, n2) {
      return yn((19077 * t4 >> 8) - (6419 * e2 >> 8) - (13320 * n2 >> 8) + 8708);
    }
    function Ln(t4, e2) {
      return yn((19077 * t4 >> 8) + (33050 * e2 >> 8) - 17685);
    }
    function xn(t4, e2, n2, r2, i3) {
      r2[i3 + 0] = wn(t4, n2), r2[i3 + 1] = Nn(t4, e2, n2), r2[i3 + 2] = Ln(t4, e2);
    }
    function An(t4, e2, n2, r2, i3) {
      r2[i3 + 0] = Ln(t4, e2), r2[i3 + 1] = Nn(t4, e2, n2), r2[i3 + 2] = wn(t4, n2);
    }
    function Sn(t4, e2, n2, r2, i3) {
      var a3 = Nn(t4, e2, n2);
      e2 = a3 << 3 & 224 | Ln(t4, e2) >> 3, r2[i3 + 0] = 248 & wn(t4, n2) | a3 >> 5, r2[i3 + 1] = e2;
    }
    function _n(t4, e2, n2, r2, i3) {
      var a3 = 240 & Ln(t4, e2) | 15;
      r2[i3 + 0] = 240 & wn(t4, n2) | Nn(t4, e2, n2) >> 4, r2[i3 + 1] = a3;
    }
    function Pn(t4, e2, n2, r2, i3) {
      r2[i3 + 0] = 255, xn(t4, e2, n2, r2, i3 + 1);
    }
    function kn(t4, e2, n2, r2, i3) {
      An(t4, e2, n2, r2, i3), r2[i3 + 3] = 255;
    }
    function Fn(t4, e2, n2, r2, i3) {
      xn(t4, e2, n2, r2, i3), r2[i3 + 3] = 255;
    }
    function Vt2(t4, e2) {
      return 0 > t4 ? 0 : t4 > e2 ? e2 : t4;
    }
    function In(e2, n2, r2) {
      t3[e2] = function(t4, e3, i3, a3, o3, s3, u4, c4, l4) {
        for (var h4 = c4 + (-2 & l4) * r2; c4 != h4; ) n2(t4[e3 + 0], i3[a3 + 0], o3[s3 + 0], u4, c4), n2(t4[e3 + 1], i3[a3 + 0], o3[s3 + 0], u4, c4 + r2), e3 += 2, ++a3, ++s3, c4 += 2 * r2;
        1 & l4 && n2(t4[e3 + 0], i3[a3 + 0], o3[s3 + 0], u4, c4);
      };
    }
    function jn(t4, e2, n2) {
      return 0 == n2 ? 0 == t4 ? 0 == e2 ? 6 : 5 : 0 == e2 ? 4 : 0 : n2;
    }
    function Cn(t4, e2, n2, r2, i3) {
      switch (t4 >>> 30) {
        case 3:
          ar(e2, n2, r2, i3, 0);
          break;
        case 2:
          or(e2, n2, r2, i3);
          break;
        case 1:
          ur(e2, n2, r2, i3);
      }
    }
    function On(t4, e2) {
      var n2, a3, o3 = e2.M, s3 = e2.Nb, u4 = t4.oc, c4 = t4.pc + 40, l4 = t4.oc, h4 = t4.pc + 584, f4 = t4.oc, d4 = t4.pc + 600;
      for (n2 = 0; 16 > n2; ++n2) u4[c4 + 32 * n2 - 1] = 129;
      for (n2 = 0; 8 > n2; ++n2) l4[h4 + 32 * n2 - 1] = 129, f4[d4 + 32 * n2 - 1] = 129;
      for (0 < o3 ? u4[c4 - 1 - 32] = l4[h4 - 1 - 32] = f4[d4 - 1 - 32] = 129 : (i2(u4, c4 - 32 - 1, 127, 21), i2(l4, h4 - 32 - 1, 127, 9), i2(f4, d4 - 32 - 1, 127, 9)), a3 = 0; a3 < t4.za; ++a3) {
        var p4 = e2.ya[e2.aa + a3];
        if (0 < a3) {
          for (n2 = -1; 16 > n2; ++n2) r(u4, c4 + 32 * n2 - 4, u4, c4 + 32 * n2 + 12, 4);
          for (n2 = -1; 8 > n2; ++n2) r(l4, h4 + 32 * n2 - 4, l4, h4 + 32 * n2 + 4, 4), r(f4, d4 + 32 * n2 - 4, f4, d4 + 32 * n2 + 4, 4);
        }
        var g4 = t4.Gd, m4 = t4.Hd + a3, v4 = p4.ad, b4 = p4.Hc;
        if (0 < o3 && (r(u4, c4 - 32, g4[m4].y, 0, 16), r(l4, h4 - 32, g4[m4].f, 0, 8), r(f4, d4 - 32, g4[m4].ea, 0, 8)), p4.Za) {
          var y4 = u4, w4 = c4 - 32 + 16;
          for (0 < o3 && (a3 >= t4.za - 1 ? i2(y4, w4, g4[m4].y[15], 4) : r(y4, w4, g4[m4 + 1].y, 0, 4)), n2 = 0; 4 > n2; n2++) y4[w4 + 128 + n2] = y4[w4 + 256 + n2] = y4[w4 + 384 + n2] = y4[w4 + 0 + n2];
          for (n2 = 0; 16 > n2; ++n2, b4 <<= 2) y4 = u4, w4 = c4 + Ei[n2], hi[p4.Ob[n2]](y4, w4), Cn(b4, v4, 16 * +n2, y4, w4);
        } else if (y4 = jn(a3, o3, p4.Ob[0]), li[y4](u4, c4), 0 != b4) for (n2 = 0; 16 > n2; ++n2, b4 <<= 2) Cn(b4, v4, 16 * +n2, u4, c4 + Ei[n2]);
        for (n2 = p4.Gc, y4 = jn(a3, o3, p4.Dd), fi[y4](l4, h4), fi[y4](f4, d4), b4 = v4, y4 = l4, w4 = h4, 255 & (p4 = 0 | n2) && (170 & p4 ? sr(b4, 256, y4, w4) : cr(b4, 256, y4, w4)), p4 = f4, b4 = d4, 255 & (n2 >>= 8) && (170 & n2 ? sr(v4, 320, p4, b4) : cr(v4, 320, p4, b4)), o3 < t4.Ub - 1 && (r(g4[m4].y, 0, u4, c4 + 480, 16), r(g4[m4].f, 0, l4, h4 + 224, 8), r(g4[m4].ea, 0, f4, d4 + 224, 8)), n2 = 8 * s3 * t4.B, g4 = t4.sa, m4 = t4.ta + 16 * a3 + 16 * s3 * t4.R, v4 = t4.qa, p4 = t4.ra + 8 * a3 + n2, b4 = t4.Ha, y4 = t4.Ia + 8 * a3 + n2, n2 = 0; 16 > n2; ++n2) r(g4, m4 + n2 * t4.R, u4, c4 + 32 * n2, 16);
        for (n2 = 0; 8 > n2; ++n2) r(v4, p4 + n2 * t4.B, l4, h4 + 32 * n2, 8), r(b4, y4 + n2 * t4.B, f4, d4 + 32 * n2, 8);
      }
    }
    function Bn(t4, r2, i3, a3, o3, s3, u4, c4, l4) {
      var h4 = [0], f4 = [0], d4 = 0, p4 = null != l4 ? l4.kd : 0, g4 = null != l4 ? l4 : new nn();
      if (null == t4 || 12 > i3) return 7;
      g4.data = t4, g4.w = r2, g4.ha = i3, r2 = [r2], i3 = [i3], g4.gb = [g4.gb];
      t: {
        var m4 = r2, b4 = i3, y4 = g4.gb;
        if (e(null != t4), e(null != b4), e(null != y4), y4[0] = 0, 12 <= b4[0] && !n(t4, m4[0], "RIFF")) {
          if (n(t4, m4[0] + 8, "WEBP")) {
            y4 = 3;
            break t;
          }
          var w4 = C2(t4, m4[0] + 4);
          if (12 > w4 || 4294967286 < w4) {
            y4 = 3;
            break t;
          }
          if (p4 && w4 > b4[0] - 8) {
            y4 = 7;
            break t;
          }
          y4[0] = w4, m4[0] += 12, b4[0] -= 12;
        }
        y4 = 0;
      }
      if (0 != y4) return y4;
      for (w4 = 0 < g4.gb[0], i3 = i3[0]; ; ) {
        t: {
          var L4 = t4;
          b4 = r2, y4 = i3;
          var x4 = h4, A4 = f4, S3 = m4 = [0];
          if ((k3 = d4 = [d4])[0] = 0, 8 > y4[0]) y4 = 7;
          else {
            if (!n(L4, b4[0], "VP8X")) {
              if (10 != C2(L4, b4[0] + 4)) {
                y4 = 3;
                break t;
              }
              if (18 > y4[0]) {
                y4 = 7;
                break t;
              }
              var _3 = C2(L4, b4[0] + 8), P3 = 1 + j2(L4, b4[0] + 12);
              if (2147483648 <= P3 * (L4 = 1 + j2(L4, b4[0] + 15))) {
                y4 = 3;
                break t;
              }
              null != S3 && (S3[0] = _3), null != x4 && (x4[0] = P3), null != A4 && (A4[0] = L4), b4[0] += 18, y4[0] -= 18, k3[0] = 1;
            }
            y4 = 0;
          }
        }
        if (d4 = d4[0], m4 = m4[0], 0 != y4) return y4;
        if (b4 = !!(2 & m4), !w4 && d4) return 3;
        if (null != s3 && (s3[0] = !!(16 & m4)), null != u4 && (u4[0] = b4), null != c4 && (c4[0] = 0), u4 = h4[0], m4 = f4[0], d4 && b4 && null == l4) {
          y4 = 0;
          break;
        }
        if (4 > i3) {
          y4 = 7;
          break;
        }
        if (w4 && d4 || !w4 && !d4 && !n(t4, r2[0], "ALPH")) {
          i3 = [i3], g4.na = [g4.na], g4.P = [g4.P], g4.Sa = [g4.Sa];
          t: {
            _3 = t4, y4 = r2, w4 = i3;
            var k3 = g4.gb;
            x4 = g4.na, A4 = g4.P, S3 = g4.Sa, P3 = 22, e(null != _3), e(null != w4), L4 = y4[0];
            var F3 = w4[0];
            for (e(null != x4), e(null != S3), x4[0] = null, A4[0] = null, S3[0] = 0; ; ) {
              if (y4[0] = L4, w4[0] = F3, 8 > F3) {
                y4 = 7;
                break t;
              }
              var I3 = C2(_3, L4 + 4);
              if (4294967286 < I3) {
                y4 = 3;
                break t;
              }
              var O3 = 8 + I3 + 1 & -2;
              if (P3 += O3, 0 < k3 && P3 > k3) {
                y4 = 3;
                break t;
              }
              if (!n(_3, L4, "VP8 ") || !n(_3, L4, "VP8L")) {
                y4 = 0;
                break t;
              }
              if (F3[0] < O3) {
                y4 = 7;
                break t;
              }
              n(_3, L4, "ALPH") || (x4[0] = _3, A4[0] = L4 + 8, S3[0] = I3), L4 += O3, F3 -= O3;
            }
          }
          if (i3 = i3[0], g4.na = g4.na[0], g4.P = g4.P[0], g4.Sa = g4.Sa[0], 0 != y4) break;
        }
        i3 = [i3], g4.Ja = [g4.Ja], g4.xa = [g4.xa];
        t: if (k3 = t4, y4 = r2, w4 = i3, x4 = g4.gb[0], A4 = g4.Ja, S3 = g4.xa, _3 = y4[0], L4 = !n(k3, _3, "VP8 "), P3 = !n(k3, _3, "VP8L"), e(null != k3), e(null != w4), e(null != A4), e(null != S3), 8 > w4[0]) y4 = 7;
        else {
          if (L4 || P3) {
            if (k3 = C2(k3, _3 + 4), 12 <= x4 && k3 > x4 - 12) {
              y4 = 3;
              break t;
            }
            if (p4 && k3 > w4[0] - 8) {
              y4 = 7;
              break t;
            }
            A4[0] = k3, y4[0] += 8, w4[0] -= 8, S3[0] = P3;
          } else S3[0] = 5 <= w4[0] && 47 == k3[_3 + 0] && !(k3[_3 + 4] >> 5), A4[0] = w4[0];
          y4 = 0;
        }
        if (i3 = i3[0], g4.Ja = g4.Ja[0], g4.xa = g4.xa[0], r2 = r2[0], 0 != y4) break;
        if (4294967286 < g4.Ja) return 3;
        if (null == c4 || b4 || (c4[0] = g4.xa ? 2 : 1), u4 = [u4], m4 = [m4], g4.xa) {
          if (5 > i3) {
            y4 = 7;
            break;
          }
          c4 = u4, p4 = m4, b4 = s3, null == t4 || 5 > i3 ? t4 = 0 : 5 <= i3 && 47 == t4[r2 + 0] && !(t4[r2 + 4] >> 5) ? (w4 = [0], k3 = [0], x4 = [0], v3(A4 = new N3(), t4, r2, i3), gt2(A4, w4, k3, x4) ? (null != c4 && (c4[0] = w4[0]), null != p4 && (p4[0] = k3[0]), null != b4 && (b4[0] = x4[0]), t4 = 1) : t4 = 0) : t4 = 0;
        } else {
          if (10 > i3) {
            y4 = 7;
            break;
          }
          c4 = m4, null == t4 || 10 > i3 || !Xt2(t4, r2 + 3, i3 - 3) ? t4 = 0 : (p4 = t4[r2 + 0] | t4[r2 + 1] << 8 | t4[r2 + 2] << 16, b4 = 16383 & (t4[r2 + 7] << 8 | t4[r2 + 6]), t4 = 16383 & (t4[r2 + 9] << 8 | t4[r2 + 8]), 1 & p4 || 3 < (p4 >> 1 & 7) || !(p4 >> 4 & 1) || p4 >> 5 >= g4.Ja || !b4 || !t4 ? t4 = 0 : (u4 && (u4[0] = b4), c4 && (c4[0] = t4), t4 = 1));
        }
        if (!t4) return 3;
        if (u4 = u4[0], m4 = m4[0], d4 && (h4[0] != u4 || f4[0] != m4)) return 3;
        null != l4 && (l4[0] = g4, l4.offset = r2 - l4.w, e(4294967286 > r2 - l4.w), e(l4.offset == l4.ha - i3));
        break;
      }
      return 0 == y4 || 7 == y4 && d4 && null == l4 ? (null != s3 && (s3[0] |= null != g4.na && 0 < g4.na.length), null != a3 && (a3[0] = u4), null != o3 && (o3[0] = m4), 0) : y4;
    }
    function Mn(t4, e2, n2) {
      var r2 = e2.width, i3 = e2.height, a3 = 0, o3 = 0, s3 = r2, u4 = i3;
      if (e2.Da = null != t4 && 0 < t4.Da, e2.Da && (s3 = t4.cd, u4 = t4.bd, a3 = t4.v, o3 = t4.j, 11 > n2 || (a3 &= -2, o3 &= -2), 0 > a3 || 0 > o3 || 0 >= s3 || 0 >= u4 || a3 + s3 > r2 || o3 + u4 > i3)) return 0;
      if (e2.v = a3, e2.j = o3, e2.va = a3 + s3, e2.o = o3 + u4, e2.U = s3, e2.T = u4, e2.da = null != t4 && 0 < t4.da, e2.da) {
        if (!q2(s3, u4, n2 = [t4.ib], a3 = [t4.hb])) return 0;
        e2.ib = n2[0], e2.hb = a3[0];
      }
      return e2.ob = null != t4 && t4.ob, e2.Kb = null == t4 || !t4.Sd, e2.da && (e2.ob = e2.ib < 3 * r2 / 4 && e2.hb < 3 * i3 / 4, e2.Kb = 0), 1;
    }
    function qn(t4) {
      if (null == t4) return 2;
      if (11 > t4.S) {
        var e2 = t4.f.RGBA;
        e2.fb += (t4.height - 1) * e2.A, e2.A = -e2.A;
      } else e2 = t4.f.kb, t4 = t4.height, e2.O += (t4 - 1) * e2.fa, e2.fa = -e2.fa, e2.N += (t4 - 1 >> 1) * e2.Ab, e2.Ab = -e2.Ab, e2.W += (t4 - 1 >> 1) * e2.Db, e2.Db = -e2.Db, null != e2.F && (e2.J += (t4 - 1) * e2.lb, e2.lb = -e2.lb);
      return 0;
    }
    function En(t4, e2, n2, r2) {
      if (null == r2 || 0 >= t4 || 0 >= e2) return 2;
      if (null != n2) {
        if (n2.Da) {
          var i3 = n2.cd, o3 = n2.bd, s3 = -2 & n2.v, u4 = -2 & n2.j;
          if (0 > s3 || 0 > u4 || 0 >= i3 || 0 >= o3 || s3 + i3 > t4 || u4 + o3 > e2) return 2;
          t4 = i3, e2 = o3;
        }
        if (n2.da) {
          if (!q2(t4, e2, i3 = [n2.ib], o3 = [n2.hb])) return 2;
          t4 = i3[0], e2 = o3[0];
        }
      }
      r2.width = t4, r2.height = e2;
      t: {
        var c4 = r2.width, l4 = r2.height;
        if (t4 = r2.S, 0 >= c4 || 0 >= l4 || !(t4 >= Mr && 13 > t4)) t4 = 2;
        else {
          if (0 >= r2.Rd && null == r2.sd) {
            s3 = o3 = i3 = e2 = 0;
            var h4 = (u4 = c4 * zi[t4]) * l4;
            if (11 > t4 || (o3 = (l4 + 1) / 2 * (e2 = (c4 + 1) / 2), 12 == t4 && (s3 = (i3 = c4) * l4)), null == (l4 = a2(h4 + 2 * o3 + s3))) {
              t4 = 1;
              break t;
            }
            r2.sd = l4, 11 > t4 ? ((c4 = r2.f.RGBA).eb = l4, c4.fb = 0, c4.A = u4, c4.size = h4) : ((c4 = r2.f.kb).y = l4, c4.O = 0, c4.fa = u4, c4.Fd = h4, c4.f = l4, c4.N = 0 + h4, c4.Ab = e2, c4.Cd = o3, c4.ea = l4, c4.W = 0 + h4 + o3, c4.Db = e2, c4.Ed = o3, 12 == t4 && (c4.F = l4, c4.J = 0 + h4 + 2 * o3), c4.Tc = s3, c4.lb = i3);
          }
          if (e2 = 1, i3 = r2.S, o3 = r2.width, s3 = r2.height, i3 >= Mr && 13 > i3) if (11 > i3) t4 = r2.f.RGBA, e2 &= (u4 = Math.abs(t4.A)) * (s3 - 1) + o3 <= t4.size, e2 &= u4 >= o3 * zi[i3], e2 &= null != t4.eb;
          else {
            t4 = r2.f.kb, u4 = (o3 + 1) / 2, h4 = (s3 + 1) / 2, c4 = Math.abs(t4.fa), l4 = Math.abs(t4.Ab);
            var f4 = Math.abs(t4.Db), d4 = Math.abs(t4.lb), p4 = d4 * (s3 - 1) + o3;
            e2 &= c4 * (s3 - 1) + o3 <= t4.Fd, e2 &= l4 * (h4 - 1) + u4 <= t4.Cd, e2 = (e2 &= f4 * (h4 - 1) + u4 <= t4.Ed) & c4 >= o3 & l4 >= u4 & f4 >= u4, e2 &= null != t4.y, e2 &= null != t4.f, e2 &= null != t4.ea, 12 == i3 && (e2 &= d4 >= o3, e2 &= p4 <= t4.Tc, e2 &= null != t4.F);
          }
          else e2 = 0;
          t4 = e2 ? 0 : 2;
        }
      }
      return 0 != t4 || null != n2 && n2.fd && (t4 = qn(r2)), t4;
    }
    var Rn = 64, Dn = [0, 1, 3, 7, 15, 31, 63, 127, 255, 511, 1023, 2047, 4095, 8191, 16383, 32767, 65535, 131071, 262143, 524287, 1048575, 2097151, 4194303, 8388607, 16777215], Tn = 24, zn = 32, Un = 8, Hn = [0, 0, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7];
    D2("Predictor0", "PredictorAdd0"), t3.Predictor0 = function() {
      return 4278190080;
    }, t3.Predictor1 = function(t4) {
      return t4;
    }, t3.Predictor2 = function(t4, e2, n2) {
      return e2[n2 + 0];
    }, t3.Predictor3 = function(t4, e2, n2) {
      return e2[n2 + 1];
    }, t3.Predictor4 = function(t4, e2, n2) {
      return e2[n2 - 1];
    }, t3.Predictor5 = function(t4, e2, n2) {
      return z2(z2(t4, e2[n2 + 1]), e2[n2 + 0]);
    }, t3.Predictor6 = function(t4, e2, n2) {
      return z2(t4, e2[n2 - 1]);
    }, t3.Predictor7 = function(t4, e2, n2) {
      return z2(t4, e2[n2 + 0]);
    }, t3.Predictor8 = function(t4, e2, n2) {
      return z2(e2[n2 - 1], e2[n2 + 0]);
    }, t3.Predictor9 = function(t4, e2, n2) {
      return z2(e2[n2 + 0], e2[n2 + 1]);
    }, t3.Predictor10 = function(t4, e2, n2) {
      return z2(z2(t4, e2[n2 - 1]), z2(e2[n2 + 0], e2[n2 + 1]));
    }, t3.Predictor11 = function(t4, e2, n2) {
      var r2 = e2[n2 + 0];
      return 0 >= W2(r2 >> 24 & 255, t4 >> 24 & 255, (e2 = e2[n2 - 1]) >> 24 & 255) + W2(r2 >> 16 & 255, t4 >> 16 & 255, e2 >> 16 & 255) + W2(r2 >> 8 & 255, t4 >> 8 & 255, e2 >> 8 & 255) + W2(255 & r2, 255 & t4, 255 & e2) ? r2 : t4;
    }, t3.Predictor12 = function(t4, e2, n2) {
      var r2 = e2[n2 + 0];
      return (U2((t4 >> 24 & 255) + (r2 >> 24 & 255) - ((e2 = e2[n2 - 1]) >> 24 & 255)) << 24 | U2((t4 >> 16 & 255) + (r2 >> 16 & 255) - (e2 >> 16 & 255)) << 16 | U2((t4 >> 8 & 255) + (r2 >> 8 & 255) - (e2 >> 8 & 255)) << 8 | U2((255 & t4) + (255 & r2) - (255 & e2))) >>> 0;
    }, t3.Predictor13 = function(t4, e2, n2) {
      var r2 = e2[n2 - 1];
      return (H2((t4 = z2(t4, e2[n2 + 0])) >> 24 & 255, r2 >> 24 & 255) << 24 | H2(t4 >> 16 & 255, r2 >> 16 & 255) << 16 | H2(t4 >> 8 & 255, r2 >> 8 & 255) << 8 | H2(255 & t4, 255 & r2)) >>> 0;
    };
    var Wn = t3.PredictorAdd0;
    t3.PredictorAdd1 = V2, D2("Predictor2", "PredictorAdd2"), D2("Predictor3", "PredictorAdd3"), D2("Predictor4", "PredictorAdd4"), D2("Predictor5", "PredictorAdd5"), D2("Predictor6", "PredictorAdd6"), D2("Predictor7", "PredictorAdd7"), D2("Predictor8", "PredictorAdd8"), D2("Predictor9", "PredictorAdd9"), D2("Predictor10", "PredictorAdd10"), D2("Predictor11", "PredictorAdd11"), D2("Predictor12", "PredictorAdd12"), D2("Predictor13", "PredictorAdd13");
    var Vn = t3.PredictorAdd2;
    X2("ColorIndexInverseTransform", "MapARGB", "32b", function(t4) {
      return t4 >> 8 & 255;
    }, function(t4) {
      return t4;
    }), X2("VP8LColorIndexInverseTransformAlpha", "MapAlpha", "8b", function(t4) {
      return t4;
    }, function(t4) {
      return t4 >> 8 & 255;
    });
    var Gn, Yn = t3.ColorIndexInverseTransform, Jn = t3.MapARGB, Xn = t3.VP8LColorIndexInverseTransformAlpha, Kn = t3.MapAlpha, Zn = t3.VP8LPredictorsAdd = [];
    Zn.length = 16, (t3.VP8LPredictors = []).length = 16, (t3.VP8LPredictorsAdd_C = []).length = 16, (t3.VP8LPredictors_C = []).length = 16;
    var $n, Qn, tr, er, nr, rr, ir, ar, or, sr, ur, cr, lr, hr, fr, dr, pr, gr, mr, vr, br, yr, wr, Nr, Lr, xr, Ar, Sr, _r = a2(511), Pr = a2(2041), kr = a2(225), Fr = a2(767), Ir = 0, jr = Pr, Cr = kr, Or = Fr, Br = _r, Mr = 0, qr = 1, Er = 2, Rr = 3, Dr = 4, Tr = 5, zr = 6, Ur = 7, Hr = 8, Wr = 9, Vr = 10, Gr = [2, 3, 7], Yr = [3, 3, 11], Jr = [280, 256, 256, 256, 40], Xr = [0, 1, 1, 1, 0], Kr = [17, 18, 0, 1, 2, 3, 4, 5, 16, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], Zr = [24, 7, 23, 25, 40, 6, 39, 41, 22, 26, 38, 42, 56, 5, 55, 57, 21, 27, 54, 58, 37, 43, 72, 4, 71, 73, 20, 28, 53, 59, 70, 74, 36, 44, 88, 69, 75, 52, 60, 3, 87, 89, 19, 29, 86, 90, 35, 45, 68, 76, 85, 91, 51, 61, 104, 2, 103, 105, 18, 30, 102, 106, 34, 46, 84, 92, 67, 77, 101, 107, 50, 62, 120, 1, 119, 121, 83, 93, 17, 31, 100, 108, 66, 78, 118, 122, 33, 47, 117, 123, 49, 63, 99, 109, 82, 94, 0, 116, 124, 65, 79, 16, 32, 98, 110, 48, 115, 125, 81, 95, 64, 114, 126, 97, 111, 80, 113, 127, 96, 112], $r = [2954, 2956, 2958, 2962, 2970, 2986, 3018, 3082, 3212, 3468, 3980, 5004], Qr = 8, ti = [4, 5, 6, 7, 8, 9, 10, 10, 11, 12, 13, 14, 15, 16, 17, 17, 18, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 25, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 93, 95, 96, 98, 100, 101, 102, 104, 106, 108, 110, 112, 114, 116, 118, 122, 124, 126, 128, 130, 132, 134, 136, 138, 140, 143, 145, 148, 151, 154, 157], ei = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100, 102, 104, 106, 108, 110, 112, 114, 116, 119, 122, 125, 128, 131, 134, 137, 140, 143, 146, 149, 152, 155, 158, 161, 164, 167, 170, 173, 177, 181, 185, 189, 193, 197, 201, 205, 209, 213, 217, 221, 225, 229, 234, 239, 245, 249, 254, 259, 264, 269, 274, 279, 284], ni = null, ri = [[173, 148, 140, 0], [176, 155, 140, 135, 0], [180, 157, 141, 134, 130, 0], [254, 254, 243, 230, 196, 177, 153, 140, 133, 130, 129, 0]], ii = [0, 1, 4, 8, 5, 2, 3, 6, 9, 12, 13, 10, 7, 11, 14, 15], ai = [-0, 1, -1, 2, -2, 3, 4, 6, -3, 5, -4, -5, -6, 7, -7, 8, -8, -9], oi = [[[[128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128], [128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128], [128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128]], [[253, 136, 254, 255, 228, 219, 128, 128, 128, 128, 128], [189, 129, 242, 255, 227, 213, 255, 219, 128, 128, 128], [106, 126, 227, 252, 214, 209, 255, 255, 128, 128, 128]], [[1, 98, 248, 255, 236, 226, 255, 255, 128, 128, 128], [181, 133, 238, 254, 221, 234, 255, 154, 128, 128, 128], [78, 134, 202, 247, 198, 180, 255, 219, 128, 128, 128]], [[1, 185, 249, 255, 243, 255, 128, 128, 128, 128, 128], [184, 150, 247, 255, 236, 224, 128, 128, 128, 128, 128], [77, 110, 216, 255, 236, 230, 128, 128, 128, 128, 128]], [[1, 101, 251, 255, 241, 255, 128, 128, 128, 128, 128], [170, 139, 241, 252, 236, 209, 255, 255, 128, 128, 128], [37, 116, 196, 243, 228, 255, 255, 255, 128, 128, 128]], [[1, 204, 254, 255, 245, 255, 128, 128, 128, 128, 128], [207, 160, 250, 255, 238, 128, 128, 128, 128, 128, 128], [102, 103, 231, 255, 211, 171, 128, 128, 128, 128, 128]], [[1, 152, 252, 255, 240, 255, 128, 128, 128, 128, 128], [177, 135, 243, 255, 234, 225, 128, 128, 128, 128, 128], [80, 129, 211, 255, 194, 224, 128, 128, 128, 128, 128]], [[1, 1, 255, 128, 128, 128, 128, 128, 128, 128, 128], [246, 1, 255, 128, 128, 128, 128, 128, 128, 128, 128], [255, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128]]], [[[198, 35, 237, 223, 193, 187, 162, 160, 145, 155, 62], [131, 45, 198, 221, 172, 176, 220, 157, 252, 221, 1], [68, 47, 146, 208, 149, 167, 221, 162, 255, 223, 128]], [[1, 149, 241, 255, 221, 224, 255, 255, 128, 128, 128], [184, 141, 234, 253, 222, 220, 255, 199, 128, 128, 128], [81, 99, 181, 242, 176, 190, 249, 202, 255, 255, 128]], [[1, 129, 232, 253, 214, 197, 242, 196, 255, 255, 128], [99, 121, 210, 250, 201, 198, 255, 202, 128, 128, 128], [23, 91, 163, 242, 170, 187, 247, 210, 255, 255, 128]], [[1, 200, 246, 255, 234, 255, 128, 128, 128, 128, 128], [109, 178, 241, 255, 231, 245, 255, 255, 128, 128, 128], [44, 130, 201, 253, 205, 192, 255, 255, 128, 128, 128]], [[1, 132, 239, 251, 219, 209, 255, 165, 128, 128, 128], [94, 136, 225, 251, 218, 190, 255, 255, 128, 128, 128], [22, 100, 174, 245, 186, 161, 255, 199, 128, 128, 128]], [[1, 182, 249, 255, 232, 235, 128, 128, 128, 128, 128], [124, 143, 241, 255, 227, 234, 128, 128, 128, 128, 128], [35, 77, 181, 251, 193, 211, 255, 205, 128, 128, 128]], [[1, 157, 247, 255, 236, 231, 255, 255, 128, 128, 128], [121, 141, 235, 255, 225, 227, 255, 255, 128, 128, 128], [45, 99, 188, 251, 195, 217, 255, 224, 128, 128, 128]], [[1, 1, 251, 255, 213, 255, 128, 128, 128, 128, 128], [203, 1, 248, 255, 255, 128, 128, 128, 128, 128, 128], [137, 1, 177, 255, 224, 255, 128, 128, 128, 128, 128]]], [[[253, 9, 248, 251, 207, 208, 255, 192, 128, 128, 128], [175, 13, 224, 243, 193, 185, 249, 198, 255, 255, 128], [73, 17, 171, 221, 161, 179, 236, 167, 255, 234, 128]], [[1, 95, 247, 253, 212, 183, 255, 255, 128, 128, 128], [239, 90, 244, 250, 211, 209, 255, 255, 128, 128, 128], [155, 77, 195, 248, 188, 195, 255, 255, 128, 128, 128]], [[1, 24, 239, 251, 218, 219, 255, 205, 128, 128, 128], [201, 51, 219, 255, 196, 186, 128, 128, 128, 128, 128], [69, 46, 190, 239, 201, 218, 255, 228, 128, 128, 128]], [[1, 191, 251, 255, 255, 128, 128, 128, 128, 128, 128], [223, 165, 249, 255, 213, 255, 128, 128, 128, 128, 128], [141, 124, 248, 255, 255, 128, 128, 128, 128, 128, 128]], [[1, 16, 248, 255, 255, 128, 128, 128, 128, 128, 128], [190, 36, 230, 255, 236, 255, 128, 128, 128, 128, 128], [149, 1, 255, 128, 128, 128, 128, 128, 128, 128, 128]], [[1, 226, 255, 128, 128, 128, 128, 128, 128, 128, 128], [247, 192, 255, 128, 128, 128, 128, 128, 128, 128, 128], [240, 128, 255, 128, 128, 128, 128, 128, 128, 128, 128]], [[1, 134, 252, 255, 255, 128, 128, 128, 128, 128, 128], [213, 62, 250, 255, 255, 128, 128, 128, 128, 128, 128], [55, 93, 255, 128, 128, 128, 128, 128, 128, 128, 128]], [[128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128], [128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128], [128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128]]], [[[202, 24, 213, 235, 186, 191, 220, 160, 240, 175, 255], [126, 38, 182, 232, 169, 184, 228, 174, 255, 187, 128], [61, 46, 138, 219, 151, 178, 240, 170, 255, 216, 128]], [[1, 112, 230, 250, 199, 191, 247, 159, 255, 255, 128], [166, 109, 228, 252, 211, 215, 255, 174, 128, 128, 128], [39, 77, 162, 232, 172, 180, 245, 178, 255, 255, 128]], [[1, 52, 220, 246, 198, 199, 249, 220, 255, 255, 128], [124, 74, 191, 243, 183, 193, 250, 221, 255, 255, 128], [24, 71, 130, 219, 154, 170, 243, 182, 255, 255, 128]], [[1, 182, 225, 249, 219, 240, 255, 224, 128, 128, 128], [149, 150, 226, 252, 216, 205, 255, 171, 128, 128, 128], [28, 108, 170, 242, 183, 194, 254, 223, 255, 255, 128]], [[1, 81, 230, 252, 204, 203, 255, 192, 128, 128, 128], [123, 102, 209, 247, 188, 196, 255, 233, 128, 128, 128], [20, 95, 153, 243, 164, 173, 255, 203, 128, 128, 128]], [[1, 222, 248, 255, 216, 213, 128, 128, 128, 128, 128], [168, 175, 246, 252, 235, 205, 255, 255, 128, 128, 128], [47, 116, 215, 255, 211, 212, 255, 255, 128, 128, 128]], [[1, 121, 236, 253, 212, 214, 255, 255, 128, 128, 128], [141, 84, 213, 252, 201, 202, 255, 219, 128, 128, 128], [42, 80, 160, 240, 162, 185, 255, 205, 128, 128, 128]], [[1, 1, 255, 128, 128, 128, 128, 128, 128, 128, 128], [244, 1, 255, 128, 128, 128, 128, 128, 128, 128, 128], [238, 1, 255, 128, 128, 128, 128, 128, 128, 128, 128]]]], si = [[[231, 120, 48, 89, 115, 113, 120, 152, 112], [152, 179, 64, 126, 170, 118, 46, 70, 95], [175, 69, 143, 80, 85, 82, 72, 155, 103], [56, 58, 10, 171, 218, 189, 17, 13, 152], [114, 26, 17, 163, 44, 195, 21, 10, 173], [121, 24, 80, 195, 26, 62, 44, 64, 85], [144, 71, 10, 38, 171, 213, 144, 34, 26], [170, 46, 55, 19, 136, 160, 33, 206, 71], [63, 20, 8, 114, 114, 208, 12, 9, 226], [81, 40, 11, 96, 182, 84, 29, 16, 36]], [[134, 183, 89, 137, 98, 101, 106, 165, 148], [72, 187, 100, 130, 157, 111, 32, 75, 80], [66, 102, 167, 99, 74, 62, 40, 234, 128], [41, 53, 9, 178, 241, 141, 26, 8, 107], [74, 43, 26, 146, 73, 166, 49, 23, 157], [65, 38, 105, 160, 51, 52, 31, 115, 128], [104, 79, 12, 27, 217, 255, 87, 17, 7], [87, 68, 71, 44, 114, 51, 15, 186, 23], [47, 41, 14, 110, 182, 183, 21, 17, 194], [66, 45, 25, 102, 197, 189, 23, 18, 22]], [[88, 88, 147, 150, 42, 46, 45, 196, 205], [43, 97, 183, 117, 85, 38, 35, 179, 61], [39, 53, 200, 87, 26, 21, 43, 232, 171], [56, 34, 51, 104, 114, 102, 29, 93, 77], [39, 28, 85, 171, 58, 165, 90, 98, 64], [34, 22, 116, 206, 23, 34, 43, 166, 73], [107, 54, 32, 26, 51, 1, 81, 43, 31], [68, 25, 106, 22, 64, 171, 36, 225, 114], [34, 19, 21, 102, 132, 188, 16, 76, 124], [62, 18, 78, 95, 85, 57, 50, 48, 51]], [[193, 101, 35, 159, 215, 111, 89, 46, 111], [60, 148, 31, 172, 219, 228, 21, 18, 111], [112, 113, 77, 85, 179, 255, 38, 120, 114], [40, 42, 1, 196, 245, 209, 10, 25, 109], [88, 43, 29, 140, 166, 213, 37, 43, 154], [61, 63, 30, 155, 67, 45, 68, 1, 209], [100, 80, 8, 43, 154, 1, 51, 26, 71], [142, 78, 78, 16, 255, 128, 34, 197, 171], [41, 40, 5, 102, 211, 183, 4, 1, 221], [51, 50, 17, 168, 209, 192, 23, 25, 82]], [[138, 31, 36, 171, 27, 166, 38, 44, 229], [67, 87, 58, 169, 82, 115, 26, 59, 179], [63, 59, 90, 180, 59, 166, 93, 73, 154], [40, 40, 21, 116, 143, 209, 34, 39, 175], [47, 15, 16, 183, 34, 223, 49, 45, 183], [46, 17, 33, 183, 6, 98, 15, 32, 183], [57, 46, 22, 24, 128, 1, 54, 17, 37], [65, 32, 73, 115, 28, 128, 23, 128, 205], [40, 3, 9, 115, 51, 192, 18, 6, 223], [87, 37, 9, 115, 59, 77, 64, 21, 47]], [[104, 55, 44, 218, 9, 54, 53, 130, 226], [64, 90, 70, 205, 40, 41, 23, 26, 57], [54, 57, 112, 184, 5, 41, 38, 166, 213], [30, 34, 26, 133, 152, 116, 10, 32, 134], [39, 19, 53, 221, 26, 114, 32, 73, 255], [31, 9, 65, 234, 2, 15, 1, 118, 73], [75, 32, 12, 51, 192, 255, 160, 43, 51], [88, 31, 35, 67, 102, 85, 55, 186, 85], [56, 21, 23, 111, 59, 205, 45, 37, 192], [55, 38, 70, 124, 73, 102, 1, 34, 98]], [[125, 98, 42, 88, 104, 85, 117, 175, 82], [95, 84, 53, 89, 128, 100, 113, 101, 45], [75, 79, 123, 47, 51, 128, 81, 171, 1], [57, 17, 5, 71, 102, 57, 53, 41, 49], [38, 33, 13, 121, 57, 73, 26, 1, 85], [41, 10, 67, 138, 77, 110, 90, 47, 114], [115, 21, 2, 10, 102, 255, 166, 23, 6], [101, 29, 16, 10, 85, 128, 101, 196, 26], [57, 18, 10, 102, 102, 213, 34, 20, 43], [117, 20, 15, 36, 163, 128, 68, 1, 26]], [[102, 61, 71, 37, 34, 53, 31, 243, 192], [69, 60, 71, 38, 73, 119, 28, 222, 37], [68, 45, 128, 34, 1, 47, 11, 245, 171], [62, 17, 19, 70, 146, 85, 55, 62, 70], [37, 43, 37, 154, 100, 163, 85, 160, 1], [63, 9, 92, 136, 28, 64, 32, 201, 85], [75, 15, 9, 9, 64, 255, 184, 119, 16], [86, 6, 28, 5, 64, 255, 25, 248, 1], [56, 8, 17, 132, 137, 255, 55, 116, 128], [58, 15, 20, 82, 135, 57, 26, 121, 40]], [[164, 50, 31, 137, 154, 133, 25, 35, 218], [51, 103, 44, 131, 131, 123, 31, 6, 158], [86, 40, 64, 135, 148, 224, 45, 183, 128], [22, 26, 17, 131, 240, 154, 14, 1, 209], [45, 16, 21, 91, 64, 222, 7, 1, 197], [56, 21, 39, 155, 60, 138, 23, 102, 213], [83, 12, 13, 54, 192, 255, 68, 47, 28], [85, 26, 85, 85, 128, 128, 32, 146, 171], [18, 11, 7, 63, 144, 171, 4, 4, 246], [35, 27, 10, 146, 174, 171, 12, 26, 128]], [[190, 80, 35, 99, 180, 80, 126, 54, 45], [85, 126, 47, 87, 176, 51, 41, 20, 32], [101, 75, 128, 139, 118, 146, 116, 128, 85], [56, 41, 15, 176, 236, 85, 37, 9, 62], [71, 30, 17, 119, 118, 255, 17, 18, 138], [101, 38, 60, 138, 55, 70, 43, 26, 142], [146, 36, 19, 30, 171, 255, 97, 27, 20], [138, 45, 61, 62, 219, 1, 81, 188, 64], [32, 41, 20, 117, 151, 142, 20, 21, 163], [112, 19, 12, 61, 195, 128, 48, 4, 24]]], ui = [[[[255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[176, 246, 255, 255, 255, 255, 255, 255, 255, 255, 255], [223, 241, 252, 255, 255, 255, 255, 255, 255, 255, 255], [249, 253, 253, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 244, 252, 255, 255, 255, 255, 255, 255, 255, 255], [234, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255], [253, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 246, 254, 255, 255, 255, 255, 255, 255, 255, 255], [239, 253, 254, 255, 255, 255, 255, 255, 255, 255, 255], [254, 255, 254, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 248, 254, 255, 255, 255, 255, 255, 255, 255, 255], [251, 255, 254, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 253, 254, 255, 255, 255, 255, 255, 255, 255, 255], [251, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255], [254, 255, 254, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 254, 253, 255, 254, 255, 255, 255, 255, 255, 255], [250, 255, 254, 255, 254, 255, 255, 255, 255, 255, 255], [254, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]]], [[[217, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [225, 252, 241, 253, 255, 255, 254, 255, 255, 255, 255], [234, 250, 241, 250, 253, 255, 253, 254, 255, 255, 255]], [[255, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255], [223, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255], [238, 253, 254, 254, 255, 255, 255, 255, 255, 255, 255]], [[255, 248, 254, 255, 255, 255, 255, 255, 255, 255, 255], [249, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 253, 255, 255, 255, 255, 255, 255, 255, 255, 255], [247, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 253, 254, 255, 255, 255, 255, 255, 255, 255, 255], [252, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255], [253, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 254, 253, 255, 255, 255, 255, 255, 255, 255, 255], [250, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [254, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]]], [[[186, 251, 250, 255, 255, 255, 255, 255, 255, 255, 255], [234, 251, 244, 254, 255, 255, 255, 255, 255, 255, 255], [251, 251, 243, 253, 254, 255, 254, 255, 255, 255, 255]], [[255, 253, 254, 255, 255, 255, 255, 255, 255, 255, 255], [236, 253, 254, 255, 255, 255, 255, 255, 255, 255, 255], [251, 253, 253, 254, 254, 255, 255, 255, 255, 255, 255]], [[255, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255], [254, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255], [254, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255], [254, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [254, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]]], [[[248, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [250, 254, 252, 254, 255, 255, 255, 255, 255, 255, 255], [248, 254, 249, 253, 255, 255, 255, 255, 255, 255, 255]], [[255, 253, 253, 255, 255, 255, 255, 255, 255, 255, 255], [246, 253, 253, 255, 255, 255, 255, 255, 255, 255, 255], [252, 254, 251, 254, 254, 255, 255, 255, 255, 255, 255]], [[255, 254, 252, 255, 255, 255, 255, 255, 255, 255, 255], [248, 254, 253, 255, 255, 255, 255, 255, 255, 255, 255], [253, 255, 254, 254, 255, 255, 255, 255, 255, 255, 255]], [[255, 251, 254, 255, 255, 255, 255, 255, 255, 255, 255], [245, 251, 254, 255, 255, 255, 255, 255, 255, 255, 255], [253, 253, 254, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 251, 253, 255, 255, 255, 255, 255, 255, 255, 255], [252, 253, 254, 255, 255, 255, 255, 255, 255, 255, 255], [255, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 252, 255, 255, 255, 255, 255, 255, 255, 255, 255], [249, 255, 254, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 254, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 255, 253, 255, 255, 255, 255, 255, 255, 255, 255], [250, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [254, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]]]], ci = [0, 1, 2, 3, 6, 4, 5, 6, 6, 6, 6, 6, 6, 6, 6, 7, 0], li = [], hi = [], fi = [], di = 1, pi = 2, gi = [], mi = [];
    vn("UpsampleRgbLinePair", xn, 3), vn("UpsampleBgrLinePair", An, 3), vn("UpsampleRgbaLinePair", Fn, 4), vn("UpsampleBgraLinePair", kn, 4), vn("UpsampleArgbLinePair", Pn, 4), vn("UpsampleRgba4444LinePair", _n, 2), vn("UpsampleRgb565LinePair", Sn, 2);
    var vi = t3.UpsampleRgbLinePair, bi = t3.UpsampleBgrLinePair, yi = t3.UpsampleRgbaLinePair, wi = t3.UpsampleBgraLinePair, Ni = t3.UpsampleArgbLinePair, Li = t3.UpsampleRgba4444LinePair, xi = t3.UpsampleRgb565LinePair, Ai = 16, Si = 1 << Ai - 1, _i = -227, Pi = 482, ki = 6, Ii = 0, ji = a2(256), Ci = a2(256), Oi = a2(256), Bi = a2(256), Mi = a2(Pi - _i), qi = a2(Pi - _i);
    In("YuvToRgbRow", xn, 3), In("YuvToBgrRow", An, 3), In("YuvToRgbaRow", Fn, 4), In("YuvToBgraRow", kn, 4), In("YuvToArgbRow", Pn, 4), In("YuvToRgba4444Row", _n, 2), In("YuvToRgb565Row", Sn, 2);
    var Ei = [0, 4, 8, 12, 128, 132, 136, 140, 256, 260, 264, 268, 384, 388, 392, 396], Ri = [0, 2, 8], Di = [8, 7, 6, 4, 4, 2, 2, 2, 1, 1, 1, 1], Ti = 1;
    this.WebPDecodeRGBA = function(t4, n2, s3, u4, c4) {
      var l4 = qr, h4 = new en(), f4 = new ot2();
      h4.ba = f4, f4.S = l4, f4.width = [f4.width], f4.height = [f4.height];
      var d4 = f4.width, p4 = f4.height, g4 = new st2();
      if (null == g4 || null == t4) var m4 = 2;
      else e(null != g4), m4 = Bn(t4, n2, s3, g4.width, g4.height, g4.Pd, g4.Qd, g4.format, null);
      if (0 != m4 ? d4 = 0 : (null != d4 && (d4[0] = g4.width[0]), null != p4 && (p4[0] = g4.height[0]), d4 = 1), d4) {
        f4.width = f4.width[0], f4.height = f4.height[0], null != u4 && (u4[0] = f4.width), null != c4 && (c4[0] = f4.height);
        t: {
          if (u4 = new Gt2(), (c4 = new nn()).data = t4, c4.w = n2, c4.ha = s3, c4.kd = 1, n2 = [0], e(null != c4), (0 == (t4 = Bn(c4.data, c4.w, c4.ha, null, null, null, n2, null, c4)) || 7 == t4) && n2[0] && (t4 = 4), 0 == (n2 = t4)) {
            if (e(null != h4), u4.data = c4.data, u4.w = c4.w + c4.offset, u4.ha = c4.ha - c4.offset, u4.put = dt2, u4.ac = ft2, u4.bc = pt2, u4.ma = h4, c4.xa) {
              if (null == (t4 = kt2())) {
                h4 = 1;
                break t;
              }
              if (function(t5, n3) {
                var r2 = [0], i3 = [0], a3 = [0];
                e: for (; ; ) {
                  if (null == t5) return 0;
                  if (null == n3) return t5.a = 2, 0;
                  if (t5.l = n3, t5.a = 0, v3(t5.m, n3.data, n3.w, n3.ha), !gt2(t5.m, r2, i3, a3)) {
                    t5.a = 3;
                    break e;
                  }
                  if (t5.xb = pi, n3.width = r2[0], n3.height = i3[0], !Ft2(r2[0], i3[0], 1, t5, null)) break e;
                  return 1;
                }
                return e(0 != t5.a), 0;
              }(t4, u4)) {
                if (u4 = 0 == (n2 = En(u4.width, u4.height, h4.Oa, h4.ba))) {
                  e: {
                    u4 = t4;
                    n: for (; ; ) {
                      if (null == u4) {
                        u4 = 0;
                        break e;
                      }
                      if (e(null != u4.s.yc), e(null != u4.s.Ya), e(0 < u4.s.Wb), e(null != (s3 = u4.l)), e(null != (c4 = s3.ma)), 0 != u4.xb) {
                        if (u4.ca = c4.ba, u4.tb = c4.tb, e(null != u4.ca), !Mn(c4.Oa, s3, Rr)) {
                          u4.a = 2;
                          break n;
                        }
                        if (!It2(u4, s3.width)) break n;
                        if (s3.da) break n;
                        if ((s3.da || rt2(u4.ca.S)) && mn(), 11 > u4.ca.S || (alert("todo:WebPInitConvertARGBToYUV"), null != u4.ca.f.kb.F && mn()), u4.Pb && 0 < u4.s.ua && null == u4.s.vb.X && !O2(u4.s.vb, u4.s.Wa.Xa)) {
                          u4.a = 1;
                          break n;
                        }
                        u4.xb = 0;
                      }
                      if (!_t2(u4, u4.V, u4.Ba, u4.c, u4.i, s3.o, Lt2)) break n;
                      c4.Dc = u4.Ma, u4 = 1;
                      break e;
                    }
                    e(0 != u4.a), u4 = 0;
                  }
                  u4 = !u4;
                }
                u4 && (n2 = t4.a);
              } else n2 = t4.a;
            } else {
              if (null == (t4 = new Yt2())) {
                h4 = 1;
                break t;
              }
              if (t4.Fa = c4.na, t4.P = c4.P, t4.qc = c4.Sa, Kt2(t4, u4)) {
                if (0 == (n2 = En(u4.width, u4.height, h4.Oa, h4.ba))) {
                  if (t4.Aa = 0, s3 = h4.Oa, e(null != (c4 = t4)), null != s3) {
                    if (0 < (d4 = 0 > (d4 = s3.Md) ? 0 : 100 < d4 ? 255 : 255 * d4 / 100)) {
                      for (p4 = g4 = 0; 4 > p4; ++p4) 12 > (m4 = c4.pb[p4]).lc && (m4.ia = d4 * Di[0 > m4.lc ? 0 : m4.lc] >> 3), g4 |= m4.ia;
                      g4 && (alert("todo:VP8InitRandom"), c4.ia = 1);
                    }
                    c4.Ga = s3.Id, 100 < c4.Ga ? c4.Ga = 100 : 0 > c4.Ga && (c4.Ga = 0);
                  }
                  (function(t5, n3) {
                    if (null == t5) return 0;
                    if (null == n3) return Jt2(t5, 2, "NULL VP8Io parameter in VP8Decode().");
                    if (!t5.cb && !Kt2(t5, n3)) return 0;
                    if (e(t5.cb), null == n3.ac || n3.ac(n3)) {
                      n3.ob && (t5.L = 0);
                      var s4 = Ri[t5.L];
                      if (2 == t5.L ? (t5.yb = 0, t5.zb = 0) : (t5.yb = n3.v - s4 >> 4, t5.zb = n3.j - s4 >> 4, 0 > t5.yb && (t5.yb = 0), 0 > t5.zb && (t5.zb = 0)), t5.Va = n3.o + 15 + s4 >> 4, t5.Hb = n3.va + 15 + s4 >> 4, t5.Hb > t5.za && (t5.Hb = t5.za), t5.Va > t5.Ub && (t5.Va = t5.Ub), 0 < t5.L) {
                        var u5 = t5.ed;
                        for (s4 = 0; 4 > s4; ++s4) {
                          var c5;
                          if (t5.Qa.Cb) {
                            var l5 = t5.Qa.Lb[s4];
                            t5.Qa.Fb || (l5 += u5.Tb);
                          } else l5 = u5.Tb;
                          for (c5 = 0; 1 >= c5; ++c5) {
                            var h5 = t5.gd[s4][c5], f5 = l5;
                            if (u5.Pc && (f5 += u5.vd[0], c5 && (f5 += u5.od[0])), 0 < (f5 = 0 > f5 ? 0 : 63 < f5 ? 63 : f5)) {
                              var d5 = f5;
                              0 < u5.wb && (d5 = 4 < u5.wb ? d5 >> 2 : d5 >> 1) > 9 - u5.wb && (d5 = 9 - u5.wb), 1 > d5 && (d5 = 1), h5.dd = d5, h5.tc = 2 * f5 + d5, h5.ld = 40 <= f5 ? 2 : 15 <= f5 ? 1 : 0;
                            } else h5.tc = 0;
                            h5.La = c5;
                          }
                        }
                      }
                      s4 = 0;
                    } else Jt2(t5, 6, "Frame setup failed"), s4 = t5.a;
                    if (s4 = 0 == s4) {
                      if (s4) {
                        t5.$c = 0, 0 < t5.Aa || (t5.Ic = Ti);
                        e: {
                          s4 = t5.Ic, u5 = 4 * (d5 = t5.za);
                          var p5 = 32 * d5, g5 = d5 + 1, m5 = 0 < t5.L ? d5 * (0 < t5.Aa ? 2 : 1) : 0, v4 = (2 == t5.Aa ? 2 : 1) * d5;
                          if ((h5 = u5 + 832 + (c5 = 3 * (16 * s4 + Ri[t5.L]) / 2 * p5) + (l5 = null != t5.Fa && 0 < t5.Fa.length ? t5.Kc.c * t5.Kc.i : 0)) != h5) s4 = 0;
                          else {
                            if (h5 > t5.Vb) {
                              if (t5.Vb = 0, t5.Ec = a2(h5), t5.Fc = 0, null == t5.Ec) {
                                s4 = Jt2(t5, 1, "no memory during frame initialization.");
                                break e;
                              }
                              t5.Vb = h5;
                            }
                            h5 = t5.Ec, f5 = t5.Fc, t5.Ac = h5, t5.Bc = f5, f5 += u5, t5.Gd = o2(p5, Ht2), t5.Hd = 0, t5.rb = o2(g5 + 1, Dt2), t5.sb = 1, t5.wa = m5 ? o2(m5, Rt2) : null, t5.Y = 0, t5.D.Nb = 0, t5.D.wa = t5.wa, t5.D.Y = t5.Y, 0 < t5.Aa && (t5.D.Y += d5), e(true), t5.oc = h5, t5.pc = f5, f5 += 832, t5.ya = o2(v4, zt2), t5.aa = 0, t5.D.ya = t5.ya, t5.D.aa = t5.aa, 2 == t5.Aa && (t5.D.aa += d5), t5.R = 16 * d5, t5.B = 8 * d5, d5 = (p5 = Ri[t5.L]) * t5.R, p5 = p5 / 2 * t5.B, t5.sa = h5, t5.ta = f5 + d5, t5.qa = t5.sa, t5.ra = t5.ta + 16 * s4 * t5.R + p5, t5.Ha = t5.qa, t5.Ia = t5.ra + 8 * s4 * t5.B + p5, t5.$c = 0, f5 += c5, t5.mb = l5 ? h5 : null, t5.nb = l5 ? f5 : null, e(f5 + l5 <= t5.Fc + t5.Vb), $t2(t5), i2(t5.Ac, t5.Bc, 0, u5), s4 = 1;
                          }
                        }
                        if (s4) {
                          if (n3.ka = 0, n3.y = t5.sa, n3.O = t5.ta, n3.f = t5.qa, n3.N = t5.ra, n3.ea = t5.Ha, n3.Vd = t5.Ia, n3.fa = t5.R, n3.Rc = t5.B, n3.F = null, n3.J = 0, !Ir) {
                            for (s4 = -255; 255 >= s4; ++s4) _r[255 + s4] = 0 > s4 ? -s4 : s4;
                            for (s4 = -1020; 1020 >= s4; ++s4) Pr[1020 + s4] = -128 > s4 ? -128 : 127 < s4 ? 127 : s4;
                            for (s4 = -112; 112 >= s4; ++s4) kr[112 + s4] = -16 > s4 ? -16 : 15 < s4 ? 15 : s4;
                            for (s4 = -255; 510 >= s4; ++s4) Fr[255 + s4] = 0 > s4 ? 0 : 255 < s4 ? 255 : s4;
                            Ir = 1;
                          }
                          ir = ue2, ar = ie2, sr = ae2, ur = oe2, cr = se2, or = re2, lr = Ye, hr = Je, fr = Ze, dr = $e, pr = Xe, gr = Ke, mr = Qe, vr = tn, br = ze, yr = Ue, wr = He, Nr = We, hi[0] = xe2, hi[1] = le2, hi[2] = Ne2, hi[3] = Le2, hi[4] = Ae2, hi[5] = _e2, hi[6] = Se2, hi[7] = Pe2, hi[8] = Fe2, hi[9] = ke2, li[0] = me2, li[1] = fe2, li[2] = de2, li[3] = pe2, li[4] = ve2, li[5] = be2, li[6] = ye2, fi[0] = Oe, fi[1] = he2, fi[2] = Ie2, fi[3] = je2, fi[4] = Me, fi[5] = Be, fi[6] = qe, s4 = 1;
                        } else s4 = 0;
                      }
                      s4 && (s4 = function(t6, n4) {
                        for (t6.M = 0; t6.M < t6.Va; ++t6.M) {
                          var o3, s5 = t6.Jc[t6.M & t6.Xb], u6 = t6.m, c6 = t6;
                          for (o3 = 0; o3 < c6.za; ++o3) {
                            var l6 = u6, h6 = c6, f6 = h6.Ac, d6 = h6.Bc + 4 * o3, p6 = h6.zc, g6 = h6.ya[h6.aa + o3];
                            if (h6.Qa.Bb ? g6.$b = k2(l6, h6.Pa.jb[0]) ? 2 + k2(l6, h6.Pa.jb[2]) : k2(l6, h6.Pa.jb[1]) : g6.$b = 0, h6.kc && (g6.Ad = k2(l6, h6.Bd)), g6.Za = !k2(l6, 145) + 0, g6.Za) {
                              var m6 = g6.Ob, v5 = 0;
                              for (h6 = 0; 4 > h6; ++h6) {
                                var b4, y4 = p6[0 + h6];
                                for (b4 = 0; 4 > b4; ++b4) {
                                  y4 = si[f6[d6 + b4]][y4];
                                  for (var w4 = ai[k2(l6, y4[0])]; 0 < w4; ) w4 = ai[2 * w4 + k2(l6, y4[w4])];
                                  y4 = -w4, f6[d6 + b4] = y4;
                                }
                                r(m6, v5, f6, d6, 4), v5 += 4, p6[0 + h6] = y4;
                              }
                            } else y4 = k2(l6, 156) ? k2(l6, 128) ? 1 : 3 : k2(l6, 163) ? 2 : 0, g6.Ob[0] = y4, i2(f6, d6, y4, 4), i2(p6, 0, y4, 4);
                            g6.Dd = k2(l6, 142) ? k2(l6, 114) ? k2(l6, 183) ? 1 : 3 : 2 : 0;
                          }
                          if (c6.m.Ka) return Jt2(t6, 7, "Premature end-of-partition0 encountered.");
                          for (; t6.ja < t6.za; ++t6.ja) {
                            if (c6 = s5, l6 = (u6 = t6).rb[u6.sb - 1], f6 = u6.rb[u6.sb + u6.ja], o3 = u6.ya[u6.aa + u6.ja], d6 = u6.kc ? o3.Ad : 0) l6.la = f6.la = 0, o3.Za || (l6.Na = f6.Na = 0), o3.Hc = 0, o3.Gc = 0, o3.ia = 0;
                            else {
                              var N4, L4;
                              if (l6 = f6, f6 = c6, d6 = u6.Pa.Xc, p6 = u6.ya[u6.aa + u6.ja], g6 = u6.pb[p6.$b], h6 = p6.ad, m6 = 0, v5 = u6.rb[u6.sb - 1], y4 = b4 = 0, i2(h6, m6, 0, 384), p6.Za) var x4 = 0, A4 = d6[3];
                              else {
                                w4 = a2(16);
                                var S3 = l6.Na + v5.Na;
                                if (S3 = ni(f6, d6[1], S3, g6.Eb, 0, w4, 0), l6.Na = v5.Na = (0 < S3) + 0, 1 < S3) ir(w4, 0, h6, m6);
                                else {
                                  var _3 = w4[0] + 3 >> 3;
                                  for (w4 = 0; 256 > w4; w4 += 16) h6[m6 + w4] = _3;
                                }
                                x4 = 1, A4 = d6[0];
                              }
                              var P3 = 15 & l6.la, F3 = 15 & v5.la;
                              for (w4 = 0; 4 > w4; ++w4) {
                                var I3 = 1 & F3;
                                for (_3 = L4 = 0; 4 > _3; ++_3) P3 = P3 >> 1 | (I3 = (S3 = ni(f6, A4, S3 = I3 + (1 & P3), g6.Sc, x4, h6, m6)) > x4) << 7, L4 = L4 << 2 | (3 < S3 ? 3 : 1 < S3 ? 2 : 0 != h6[m6 + 0]), m6 += 16;
                                P3 >>= 4, F3 = F3 >> 1 | I3 << 7, b4 = (b4 << 8 | L4) >>> 0;
                              }
                              for (A4 = P3, x4 = F3 >> 4, N4 = 0; 4 > N4; N4 += 2) {
                                for (L4 = 0, P3 = l6.la >> 4 + N4, F3 = v5.la >> 4 + N4, w4 = 0; 2 > w4; ++w4) {
                                  for (I3 = 1 & F3, _3 = 0; 2 > _3; ++_3) S3 = I3 + (1 & P3), P3 = P3 >> 1 | (I3 = 0 < (S3 = ni(f6, d6[2], S3, g6.Qc, 0, h6, m6))) << 3, L4 = L4 << 2 | (3 < S3 ? 3 : 1 < S3 ? 2 : 0 != h6[m6 + 0]), m6 += 16;
                                  P3 >>= 2, F3 = F3 >> 1 | I3 << 5;
                                }
                                y4 |= L4 << 4 * N4, A4 |= P3 << 4 << N4, x4 |= (240 & F3) << N4;
                              }
                              l6.la = A4, v5.la = x4, p6.Hc = b4, p6.Gc = y4, p6.ia = 43690 & y4 ? 0 : g6.ia, d6 = !(b4 | y4);
                            }
                            if (0 < u6.L && (u6.wa[u6.Y + u6.ja] = u6.gd[o3.$b][o3.Za], u6.wa[u6.Y + u6.ja].La |= !d6), c6.Ka) return Jt2(t6, 7, "Premature end-of-file encountered.");
                          }
                          if ($t2(t6), u6 = n4, c6 = 1, o3 = (s5 = t6).D, l6 = 0 < s5.L && s5.M >= s5.zb && s5.M <= s5.Va, 0 == s5.Aa) e: {
                            if (o3.M = s5.M, o3.uc = l6, On(s5, o3), c6 = 1, o3 = (L4 = s5.D).Nb, l6 = (y4 = Ri[s5.L]) * s5.R, f6 = y4 / 2 * s5.B, w4 = 16 * o3 * s5.R, _3 = 8 * o3 * s5.B, d6 = s5.sa, p6 = s5.ta - l6 + w4, g6 = s5.qa, h6 = s5.ra - f6 + _3, m6 = s5.Ha, v5 = s5.Ia - f6 + _3, F3 = 0 == (P3 = L4.M), b4 = P3 >= s5.Va - 1, 2 == s5.Aa && On(s5, L4), L4.uc) for (I3 = (S3 = s5).D.M, e(S3.D.uc), L4 = S3.yb; L4 < S3.Hb; ++L4) {
                              x4 = L4, A4 = I3;
                              var j3 = (C3 = (z3 = S3).D).Nb;
                              N4 = z3.R;
                              var C3 = C3.wa[C3.Y + x4], O3 = z3.sa, B3 = z3.ta + 16 * j3 * N4 + 16 * x4, M3 = C3.dd, q3 = C3.tc;
                              if (0 != q3) if (e(3 <= q3), 1 == z3.L) 0 < x4 && yr(O3, B3, N4, q3 + 4), C3.La && Nr(O3, B3, N4, q3), 0 < A4 && br(O3, B3, N4, q3 + 4), C3.La && wr(O3, B3, N4, q3);
                              else {
                                var E3 = z3.B, R3 = z3.qa, D3 = z3.ra + 8 * j3 * E3 + 8 * x4, T3 = z3.Ha, z3 = z3.Ia + 8 * j3 * E3 + 8 * x4;
                                j3 = C3.ld, 0 < x4 && (hr(O3, B3, N4, q3 + 4, M3, j3), dr(R3, D3, T3, z3, E3, q3 + 4, M3, j3)), C3.La && (gr(O3, B3, N4, q3, M3, j3), vr(R3, D3, T3, z3, E3, q3, M3, j3)), 0 < A4 && (lr(O3, B3, N4, q3 + 4, M3, j3), fr(R3, D3, T3, z3, E3, q3 + 4, M3, j3)), C3.La && (pr(O3, B3, N4, q3, M3, j3), mr(R3, D3, T3, z3, E3, q3, M3, j3));
                              }
                            }
                            if (s5.ia && alert("todo:DitherRow"), null != u6.put) {
                              if (L4 = 16 * P3, P3 = 16 * (P3 + 1), F3 ? (u6.y = s5.sa, u6.O = s5.ta + w4, u6.f = s5.qa, u6.N = s5.ra + _3, u6.ea = s5.Ha, u6.W = s5.Ia + _3) : (L4 -= y4, u6.y = d6, u6.O = p6, u6.f = g6, u6.N = h6, u6.ea = m6, u6.W = v5), b4 || (P3 -= y4), P3 > u6.o && (P3 = u6.o), u6.F = null, u6.J = null, null != s5.Fa && 0 < s5.Fa.length && L4 < P3 && (u6.J = hn(s5, u6, L4, P3 - L4), u6.F = s5.mb, null == u6.F && 0 == u6.F.length)) {
                                c6 = Jt2(s5, 3, "Could not decode alpha data.");
                                break e;
                              }
                              L4 < u6.j && (y4 = u6.j - L4, L4 = u6.j, e(!(1 & y4)), u6.O += s5.R * y4, u6.N += s5.B * (y4 >> 1), u6.W += s5.B * (y4 >> 1), null != u6.F && (u6.J += u6.width * y4)), L4 < P3 && (u6.O += u6.v, u6.N += u6.v >> 1, u6.W += u6.v >> 1, null != u6.F && (u6.J += u6.v), u6.ka = L4 - u6.j, u6.U = u6.va - u6.v, u6.T = P3 - L4, c6 = u6.put(u6));
                            }
                            o3 + 1 != s5.Ic || b4 || (r(s5.sa, s5.ta - l6, d6, p6 + 16 * s5.R, l6), r(s5.qa, s5.ra - f6, g6, h6 + 8 * s5.B, f6), r(s5.Ha, s5.Ia - f6, m6, v5 + 8 * s5.B, f6));
                          }
                          if (!c6) return Jt2(t6, 6, "Output aborted.");
                        }
                        return 1;
                      }(t5, n3)), null != n3.bc && n3.bc(n3), s4 &= 1;
                    }
                    return s4 ? (t5.cb = 0, s4) : 0;
                  })(t4, u4) || (n2 = t4.a);
                }
              } else n2 = t4.a;
            }
            0 == n2 && null != h4.Oa && h4.Oa.fd && (n2 = qn(h4.ba));
          }
          h4 = n2;
        }
        l4 = 0 != h4 ? null : 11 > l4 ? f4.f.RGBA.eb : f4.f.kb.y;
      } else l4 = null;
      return l4;
    };
    var zi = [3, 4, 3, 4, 4, 2, 2, 4, 4, 4, 2, 1, 1];
  };
  function c2(t3, e2) {
    for (var n2 = "", r2 = 0; r2 < 4; r2++) n2 += String.fromCharCode(t3[e2++]);
    return n2;
  }
  function l2(t3, e2) {
    return t3[e2 + 0] | t3[e2 + 1] << 8;
  }
  function h2(t3, e2) {
    return (t3[e2 + 0] | t3[e2 + 1] << 8 | t3[e2 + 2] << 16) >>> 0;
  }
  function f2(t3, e2) {
    return (t3[e2 + 0] | t3[e2 + 1] << 8 | t3[e2 + 2] << 16 | t3[e2 + 3] << 24) >>> 0;
  }
  new u2();
  var d2 = [0], p2 = [0], g2 = [], m2 = new u2(), v2 = t2, b2 = function(t3, e2) {
    var n2 = {}, r2 = 0, i3 = false, a3 = 0, o3 = 0;
    if (n2.frames = [], !/** @license
       * Copyright (c) 2017 Dominik Homberger
      Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
      The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
      https://webpjs.appspot.com
      WebPRiffParser dominikhlbg@gmail.com
      */
    function(t4, e3) {
      for (var n3 = 0; n3 < 4; n3++) if (t4[e3 + n3] != "RIFF".charCodeAt(n3)) return true;
      return false;
    }(t3, e2)) {
      for (f2(t3, e2 += 4), e2 += 8; e2 < t3.length; ) {
        var s3 = c2(t3, e2), u3 = f2(t3, e2 += 4);
        e2 += 4;
        var d3 = u3 + (1 & u3);
        switch (s3) {
          case "VP8 ":
          case "VP8L":
            void 0 === n2.frames[r2] && (n2.frames[r2] = {}), (m3 = n2.frames[r2]).src_off = i3 ? o3 : e2 - 8, m3.src_size = a3 + u3 + 8, r2++, i3 && (i3 = false, a3 = 0, o3 = 0);
            break;
          case "VP8X":
            (m3 = n2.header = {}).feature_flags = t3[e2];
            var p3 = e2 + 4;
            m3.canvas_width = 1 + h2(t3, p3), p3 += 3, m3.canvas_height = 1 + h2(t3, p3), p3 += 3;
            break;
          case "ALPH":
            i3 = true, a3 = d3 + 8, o3 = e2 - 8;
            break;
          case "ANIM":
            (m3 = n2.header).bgcolor = f2(t3, e2), p3 = e2 + 4, m3.loop_count = l2(t3, p3), p3 += 2;
            break;
          case "ANMF":
            var g3, m3;
            (m3 = n2.frames[r2] = {}).offset_x = 2 * h2(t3, e2), e2 += 3, m3.offset_y = 2 * h2(t3, e2), e2 += 3, m3.width = 1 + h2(t3, e2), e2 += 3, m3.height = 1 + h2(t3, e2), e2 += 3, m3.duration = h2(t3, e2), e2 += 3, g3 = t3[e2++], m3.dispose = 1 & g3, m3.blend = g3 >> 1 & 1;
        }
        "ANMF" != s3 && (e2 += d3);
      }
      return n2;
    }
  }(v2, 0);
  b2.response = v2, b2.rgbaoutput = true, b2.dataurl = false;
  var y2 = b2.header ? b2.header : null, w2 = b2.frames ? b2.frames : null;
  if (y2) {
    y2.loop_counter = y2.loop_count, d2 = [y2.canvas_height], p2 = [y2.canvas_width];
    for (var N2 = 0; N2 < w2.length && 0 != w2[N2].blend; N2++) ;
  }
  var L2 = w2[0], x2 = m2.WebPDecodeRGBA(v2, L2.src_off, L2.src_size, p2, d2);
  L2.rgba = x2, L2.imgwidth = p2[0], L2.imgheight = d2[0];
  for (var A2 = 0; A2 < p2[0] * d2[0] * 4; A2++) g2[A2] = x2[A2];
  return this.width = p2, this.height = d2, this.data = g2, this;
}
!function(e) {
  var n, r, i2, a2, s2, u2, c2, l2, f2, d2 = function(t2) {
    return t2 = t2 || {}, this.isStrokeTransparent = t2.isStrokeTransparent || false, this.strokeOpacity = t2.strokeOpacity || 1, this.strokeStyle = t2.strokeStyle || "#000000", this.fillStyle = t2.fillStyle || "#000000", this.isFillTransparent = t2.isFillTransparent || false, this.fillOpacity = t2.fillOpacity || 1, this.font = t2.font || "10px sans-serif", this.textBaseline = t2.textBaseline || "alphabetic", this.textAlign = t2.textAlign || "left", this.lineWidth = t2.lineWidth || 1, this.lineJoin = t2.lineJoin || "miter", this.lineCap = t2.lineCap || "butt", this.path = t2.path || [], this.transform = void 0 !== t2.transform ? t2.transform.clone() : new l2(), this.globalCompositeOperation = t2.globalCompositeOperation || "normal", this.globalAlpha = t2.globalAlpha || 1, this.clip_path = t2.clip_path || [], this.currentPoint = t2.currentPoint || new u2(), this.miterLimit = t2.miterLimit || 10, this.lastPoint = t2.lastPoint || new u2(), this.lineDashOffset = t2.lineDashOffset || 0, this.lineDash = t2.lineDash || [], this.margin = t2.margin || [0, 0, 0, 0], this.prevPageLastElemOffset = t2.prevPageLastElemOffset || 0, this.ignoreClearRect = "boolean" != typeof t2.ignoreClearRect || t2.ignoreClearRect, this;
  };
  e.events.push(["initialized", function() {
    this.context2d = new p2(this), n = this.internal.f2, r = this.internal.getCoordinateString, i2 = this.internal.getVerticalCoordinateString, a2 = this.internal.getHorizontalCoordinate, s2 = this.internal.getVerticalCoordinate, u2 = this.internal.Point, c2 = this.internal.Rectangle, l2 = this.internal.Matrix, f2 = new d2();
  }]);
  var p2 = function(t2) {
    Object.defineProperty(this, "canvas", { get: function() {
      return { parentNode: false, style: false };
    } });
    var e2 = t2;
    Object.defineProperty(this, "pdf", { get: function() {
      return e2;
    } });
    var n2 = false;
    Object.defineProperty(this, "pageWrapXEnabled", { get: function() {
      return n2;
    }, set: function(t3) {
      n2 = Boolean(t3);
    } });
    var r2 = false;
    Object.defineProperty(this, "pageWrapYEnabled", { get: function() {
      return r2;
    }, set: function(t3) {
      r2 = Boolean(t3);
    } });
    var i3 = 0;
    Object.defineProperty(this, "posX", { get: function() {
      return i3;
    }, set: function(t3) {
      isNaN(t3) || (i3 = t3);
    } });
    var a3 = 0;
    Object.defineProperty(this, "posY", { get: function() {
      return a3;
    }, set: function(t3) {
      isNaN(t3) || (a3 = t3);
    } }), Object.defineProperty(this, "margin", { get: function() {
      return f2.margin;
    }, set: function(t3) {
      var e3;
      "number" == typeof t3 ? e3 = [t3, t3, t3, t3] : ((e3 = new Array(4))[0] = t3[0], e3[1] = t3.length >= 2 ? t3[1] : e3[0], e3[2] = t3.length >= 3 ? t3[2] : e3[0], e3[3] = t3.length >= 4 ? t3[3] : e3[1]), f2.margin = e3;
    } });
    var o2 = false;
    Object.defineProperty(this, "autoPaging", { get: function() {
      return o2;
    }, set: function(t3) {
      o2 = t3;
    } });
    var s3 = 0;
    Object.defineProperty(this, "lastBreak", { get: function() {
      return s3;
    }, set: function(t3) {
      s3 = t3;
    } });
    var u3 = [];
    Object.defineProperty(this, "pageBreaks", { get: function() {
      return u3;
    }, set: function(t3) {
      u3 = t3;
    } }), Object.defineProperty(this, "ctx", { get: function() {
      return f2;
    }, set: function(t3) {
      t3 instanceof d2 && (f2 = t3);
    } }), Object.defineProperty(this, "path", { get: function() {
      return f2.path;
    }, set: function(t3) {
      f2.path = t3;
    } });
    var c3 = [];
    Object.defineProperty(this, "ctxStack", { get: function() {
      return c3;
    }, set: function(t3) {
      c3 = t3;
    } }), Object.defineProperty(this, "fillStyle", { get: function() {
      return this.ctx.fillStyle;
    }, set: function(t3) {
      var e3;
      e3 = g2(t3), this.ctx.fillStyle = e3.style, this.ctx.isFillTransparent = 0 === e3.a, this.ctx.fillOpacity = e3.a, this.pdf.setFillColor(e3.r, e3.g, e3.b, { a: e3.a }), this.pdf.setTextColor(e3.r, e3.g, e3.b, { a: e3.a });
    } }), Object.defineProperty(this, "strokeStyle", { get: function() {
      return this.ctx.strokeStyle;
    }, set: function(t3) {
      var e3 = g2(t3);
      this.ctx.strokeStyle = e3.style, this.ctx.isStrokeTransparent = 0 === e3.a, this.ctx.strokeOpacity = e3.a, 0 === e3.a ? this.pdf.setDrawColor(255, 255, 255) : (e3.a, this.pdf.setDrawColor(e3.r, e3.g, e3.b));
    } }), Object.defineProperty(this, "lineCap", { get: function() {
      return this.ctx.lineCap;
    }, set: function(t3) {
      -1 !== ["butt", "round", "square"].indexOf(t3) && (this.ctx.lineCap = t3, this.pdf.setLineCap(t3));
    } }), Object.defineProperty(this, "lineWidth", { get: function() {
      return this.ctx.lineWidth;
    }, set: function(t3) {
      isNaN(t3) || (this.ctx.lineWidth = t3, this.pdf.setLineWidth(t3));
    } }), Object.defineProperty(this, "lineJoin", { get: function() {
      return this.ctx.lineJoin;
    }, set: function(t3) {
      -1 !== ["bevel", "round", "miter"].indexOf(t3) && (this.ctx.lineJoin = t3, this.pdf.setLineJoin(t3));
    } }), Object.defineProperty(this, "miterLimit", { get: function() {
      return this.ctx.miterLimit;
    }, set: function(t3) {
      isNaN(t3) || (this.ctx.miterLimit = t3, this.pdf.setMiterLimit(t3));
    } }), Object.defineProperty(this, "textBaseline", { get: function() {
      return this.ctx.textBaseline;
    }, set: function(t3) {
      this.ctx.textBaseline = t3;
    } }), Object.defineProperty(this, "textAlign", { get: function() {
      return this.ctx.textAlign;
    }, set: function(t3) {
      -1 !== ["right", "end", "center", "left", "start"].indexOf(t3) && (this.ctx.textAlign = t3);
    } });
    var l3 = null;
    var h2 = null;
    Object.defineProperty(this, "fontFaces", { get: function() {
      return h2;
    }, set: function(t3) {
      l3 = null, h2 = t3;
    } }), Object.defineProperty(this, "font", { get: function() {
      return this.ctx.font;
    }, set: function(t3) {
      var e3;
      if (this.ctx.font = t3, null !== (e3 = /^\s*(?=(?:(?:[-a-z]+\s*){0,2}(italic|oblique))?)(?=(?:(?:[-a-z]+\s*){0,2}(small-caps))?)(?=(?:(?:[-a-z]+\s*){0,2}(bold(?:er)?|lighter|[1-9]00))?)(?:(?:normal|\1|\2|\3)\s*){0,3}((?:xx?-)?(?:small|large)|medium|smaller|larger|[.\d]+(?:\%|in|[cem]m|ex|p[ctx]))(?:\s*\/\s*(normal|[.\d]+(?:\%|in|[cem]m|ex|p[ctx])))?\s*([-_,\"\'\sa-z]+?)\s*$/i.exec(t3))) {
        var n3 = e3[1];
        e3[2];
        var r3 = e3[3], i4 = e3[4];
        e3[5];
        var a4 = e3[6], o3 = /^([.\d]+)((?:%|in|[cem]m|ex|p[ctx]))$/i.exec(i4)[2];
        i4 = "px" === o3 ? Math.floor(parseFloat(i4) * this.pdf.internal.scaleFactor) : "em" === o3 ? Math.floor(parseFloat(i4) * this.pdf.getFontSize()) : Math.floor(parseFloat(i4) * this.pdf.internal.scaleFactor), this.pdf.setFontSize(i4);
        var s4 = function(t4) {
          var e4, n4, r4 = [], i5 = t4.trim();
          if ("" === i5) return Jt;
          if (i5 in Mt) return [Mt[i5]];
          for (; "" !== i5; ) {
            switch (n4 = null, e4 = (i5 = Et(i5)).charAt(0)) {
              case '"':
              case "'":
                n4 = Rt(i5.substring(1), e4);
                break;
              default:
                n4 = Dt(i5);
            }
            if (null === n4) return Jt;
            if (r4.push(n4[0]), "" !== (i5 = Et(n4[1])) && "," !== i5.charAt(0)) return Jt;
            i5 = i5.replace(/^,/, "");
          }
          return r4;
        }(a4);
        if (this.fontFaces) {
          var u4 = function(t4, e4) {
            if (null === l3) {
              var n4 = function(t5) {
                var e5 = [];
                return Object.keys(t5).forEach(function(n5) {
                  t5[n5].forEach(function(t6) {
                    var r4 = null;
                    switch (t6) {
                      case "bold":
                        r4 = { family: n5, weight: "bold" };
                        break;
                      case "italic":
                        r4 = { family: n5, style: "italic" };
                        break;
                      case "bolditalic":
                        r4 = { family: n5, weight: "bold", style: "italic" };
                        break;
                      case "":
                      case "normal":
                        r4 = { family: n5 };
                    }
                    null !== r4 && (r4.ref = { name: n5, style: t6 }, e5.push(r4));
                  });
                }), e5;
              }(t4.getFontList());
              l3 = function(t5) {
                for (var e5 = {}, n5 = 0; n5 < t5.length; ++n5) {
                  var r4 = Ct(t5[n5]), i5 = r4.family, a5 = r4.stretch, o4 = r4.style, s5 = r4.weight;
                  e5[i5] = e5[i5] || {}, e5[i5][a5] = e5[i5][a5] || {}, e5[i5][a5][o4] = e5[i5][a5][o4] || {}, e5[i5][a5][o4][s5] = r4;
                }
                return e5;
              }(n4.concat(e4));
            }
            return l3;
          }(this.pdf, this.fontFaces), c4 = s4.map(function(t4) {
            return { family: t4, stretch: "normal", weight: r3, style: n3 };
          }), h3 = function(t4, e4, n4) {
            for (var r4 = (n4 = n4 || {}).defaultFontFamily || "times", i5 = Object.assign({}, Bt, n4.genericFontFamilies || {}), a5 = null, o4 = null, s5 = 0; s5 < e4.length; ++s5) if (i5[(a5 = Ct(e4[s5])).family] && (a5.family = i5[a5.family]), t4.hasOwnProperty(a5.family)) {
              o4 = t4[a5.family];
              break;
            }
            if (!(o4 = o4 || t4[r4])) throw new Error("Could not find a font-family for the rule '" + qt(a5) + "' and default family '" + r4 + "'.");
            if (o4 = function(t5, e5) {
              if (e5[t5]) return e5[t5];
              var n5 = Ft[t5], r5 = n5 <= Ft.normal ? -1 : 1, i6 = Ot(e5, kt, n5, r5);
              if (!i6) throw new Error("Could not find a matching font-stretch value for " + t5);
              return i6;
            }(a5.stretch, o4), o4 = function(t5, e5) {
              if (e5[t5]) return e5[t5];
              for (var n5 = Pt[t5], r5 = 0; r5 < n5.length; ++r5) if (e5[n5[r5]]) return e5[n5[r5]];
              throw new Error("Could not find a matching font-style for " + t5);
            }(a5.style, o4), !(o4 = function(t5, e5) {
              if (e5[t5]) return e5[t5];
              if (400 === t5 && e5[500]) return e5[500];
              if (500 === t5 && e5[400]) return e5[400];
              var n5 = jt[t5], r5 = Ot(e5, It, n5, t5 < 400 ? -1 : 1);
              if (!r5) throw new Error("Could not find a matching font-weight for value " + t5);
              return r5;
            }(a5.weight, o4))) throw new Error("Failed to resolve a font for the rule '" + qt(a5) + "'.");
            return o4;
          }(u4, c4);
          this.pdf.setFont(h3.ref.name, h3.ref.style);
        } else {
          var f3 = "";
          ("bold" === r3 || parseInt(r3, 10) >= 700 || "bold" === n3) && (f3 = "bold"), "italic" === n3 && (f3 += "italic"), 0 === f3.length && (f3 = "normal");
          for (var d3 = "", p3 = { arial: "Helvetica", Arial: "Helvetica", verdana: "Helvetica", Verdana: "Helvetica", helvetica: "Helvetica", Helvetica: "Helvetica", "sans-serif": "Helvetica", fixed: "Courier", monospace: "Courier", terminal: "Courier", cursive: "Times", fantasy: "Times", serif: "Times" }, g3 = 0; g3 < s4.length; g3++) {
            if (void 0 !== this.pdf.internal.getFont(s4[g3], f3, { noFallback: true, disableWarning: true })) {
              d3 = s4[g3];
              break;
            }
            if ("bolditalic" === f3 && void 0 !== this.pdf.internal.getFont(s4[g3], "bold", { noFallback: true, disableWarning: true })) d3 = s4[g3], f3 = "bold";
            else if (void 0 !== this.pdf.internal.getFont(s4[g3], "normal", { noFallback: true, disableWarning: true })) {
              d3 = s4[g3], f3 = "normal";
              break;
            }
          }
          if ("" === d3) {
            for (var m3 = 0; m3 < s4.length; m3++) if (p3[s4[m3]]) {
              d3 = p3[s4[m3]];
              break;
            }
          }
          d3 = "" === d3 ? "Times" : d3, this.pdf.setFont(d3, f3);
        }
      }
    } }), Object.defineProperty(this, "globalCompositeOperation", { get: function() {
      return this.ctx.globalCompositeOperation;
    }, set: function(t3) {
      this.ctx.globalCompositeOperation = t3;
    } }), Object.defineProperty(this, "globalAlpha", { get: function() {
      return this.ctx.globalAlpha;
    }, set: function(t3) {
      this.ctx.globalAlpha = t3;
    } }), Object.defineProperty(this, "lineDashOffset", { get: function() {
      return this.ctx.lineDashOffset;
    }, set: function(t3) {
      this.ctx.lineDashOffset = t3, T2.call(this);
    } }), Object.defineProperty(this, "lineDash", { get: function() {
      return this.ctx.lineDash;
    }, set: function(t3) {
      this.ctx.lineDash = t3, T2.call(this);
    } }), Object.defineProperty(this, "ignoreClearRect", { get: function() {
      return this.ctx.ignoreClearRect;
    }, set: function(t3) {
      this.ctx.ignoreClearRect = Boolean(t3);
    } });
  };
  p2.prototype.setLineDash = function(t2) {
    this.lineDash = t2;
  }, p2.prototype.getLineDash = function() {
    return this.lineDash.length % 2 ? this.lineDash.concat(this.lineDash) : this.lineDash.slice();
  }, p2.prototype.fill = function() {
    x2.call(this, "fill", false);
  }, p2.prototype.stroke = function() {
    x2.call(this, "stroke", false);
  }, p2.prototype.beginPath = function() {
    this.path = [{ type: "begin" }];
  }, p2.prototype.moveTo = function(t2, e2) {
    if (isNaN(t2) || isNaN(e2)) throw o.error("jsPDF.context2d.moveTo: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.moveTo");
    var n2 = this.ctx.transform.applyToPoint(new u2(t2, e2));
    this.path.push({ type: "mt", x: n2.x, y: n2.y }), this.ctx.lastPoint = new u2(t2, e2);
  }, p2.prototype.closePath = function() {
    var e2 = new u2(0, 0), n2 = 0;
    for (n2 = this.path.length - 1; -1 !== n2; n2--) if ("begin" === this.path[n2].type && "object" === _typeof(this.path[n2 + 1]) && "number" == typeof this.path[n2 + 1].x) {
      e2 = new u2(this.path[n2 + 1].x, this.path[n2 + 1].y);
      break;
    }
    this.path.push({ type: "close" }), this.ctx.lastPoint = new u2(e2.x, e2.y);
  }, p2.prototype.lineTo = function(t2, e2) {
    if (isNaN(t2) || isNaN(e2)) throw o.error("jsPDF.context2d.lineTo: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.lineTo");
    var n2 = this.ctx.transform.applyToPoint(new u2(t2, e2));
    this.path.push({ type: "lt", x: n2.x, y: n2.y }), this.ctx.lastPoint = new u2(n2.x, n2.y);
  }, p2.prototype.clip = function() {
    this.ctx.clip_path = JSON.parse(JSON.stringify(this.path)), x2.call(this, null, true);
  }, p2.prototype.quadraticCurveTo = function(t2, e2, n2, r2) {
    if (isNaN(n2) || isNaN(r2) || isNaN(t2) || isNaN(e2)) throw o.error("jsPDF.context2d.quadraticCurveTo: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.quadraticCurveTo");
    var i3 = this.ctx.transform.applyToPoint(new u2(n2, r2)), a3 = this.ctx.transform.applyToPoint(new u2(t2, e2));
    this.path.push({ type: "qct", x1: a3.x, y1: a3.y, x: i3.x, y: i3.y }), this.ctx.lastPoint = new u2(i3.x, i3.y);
  }, p2.prototype.bezierCurveTo = function(t2, e2, n2, r2, i3, a3) {
    if (isNaN(i3) || isNaN(a3) || isNaN(t2) || isNaN(e2) || isNaN(n2) || isNaN(r2)) throw o.error("jsPDF.context2d.bezierCurveTo: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.bezierCurveTo");
    var s3 = this.ctx.transform.applyToPoint(new u2(i3, a3)), c3 = this.ctx.transform.applyToPoint(new u2(t2, e2)), l3 = this.ctx.transform.applyToPoint(new u2(n2, r2));
    this.path.push({ type: "bct", x1: c3.x, y1: c3.y, x2: l3.x, y2: l3.y, x: s3.x, y: s3.y }), this.ctx.lastPoint = new u2(s3.x, s3.y);
  }, p2.prototype.arc = function(t2, e2, n2, r2, i3, a3) {
    if (isNaN(t2) || isNaN(e2) || isNaN(n2) || isNaN(r2) || isNaN(i3)) throw o.error("jsPDF.context2d.arc: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.arc");
    if (a3 = Boolean(a3), !this.ctx.transform.isIdentity) {
      var s3 = this.ctx.transform.applyToPoint(new u2(t2, e2));
      t2 = s3.x, e2 = s3.y;
      var c3 = this.ctx.transform.applyToPoint(new u2(0, n2)), l3 = this.ctx.transform.applyToPoint(new u2(0, 0));
      n2 = Math.sqrt(Math.pow(c3.x - l3.x, 2) + Math.pow(c3.y - l3.y, 2));
    }
    Math.abs(i3 - r2) >= 2 * Math.PI && (r2 = 0, i3 = 2 * Math.PI), this.path.push({ type: "arc", x: t2, y: e2, radius: n2, startAngle: r2, endAngle: i3, counterclockwise: a3 });
  }, p2.prototype.arcTo = function(t2, e2, n2, r2, i3) {
    throw new Error("arcTo not implemented.");
  }, p2.prototype.rect = function(t2, e2, n2, r2) {
    if (isNaN(t2) || isNaN(e2) || isNaN(n2) || isNaN(r2)) throw o.error("jsPDF.context2d.rect: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.rect");
    this.moveTo(t2, e2), this.lineTo(t2 + n2, e2), this.lineTo(t2 + n2, e2 + r2), this.lineTo(t2, e2 + r2), this.lineTo(t2, e2), this.lineTo(t2 + n2, e2), this.lineTo(t2, e2);
  }, p2.prototype.fillRect = function(t2, e2, n2, r2) {
    if (isNaN(t2) || isNaN(e2) || isNaN(n2) || isNaN(r2)) throw o.error("jsPDF.context2d.fillRect: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.fillRect");
    if (!m2.call(this)) {
      var i3 = {};
      "butt" !== this.lineCap && (i3.lineCap = this.lineCap, this.lineCap = "butt"), "miter" !== this.lineJoin && (i3.lineJoin = this.lineJoin, this.lineJoin = "miter"), this.beginPath(), this.rect(t2, e2, n2, r2), this.fill(), i3.hasOwnProperty("lineCap") && (this.lineCap = i3.lineCap), i3.hasOwnProperty("lineJoin") && (this.lineJoin = i3.lineJoin);
    }
  }, p2.prototype.strokeRect = function(t2, e2, n2, r2) {
    if (isNaN(t2) || isNaN(e2) || isNaN(n2) || isNaN(r2)) throw o.error("jsPDF.context2d.strokeRect: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.strokeRect");
    v2.call(this) || (this.beginPath(), this.rect(t2, e2, n2, r2), this.stroke());
  }, p2.prototype.clearRect = function(t2, e2, n2, r2) {
    if (isNaN(t2) || isNaN(e2) || isNaN(n2) || isNaN(r2)) throw o.error("jsPDF.context2d.clearRect: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.clearRect");
    this.ignoreClearRect || (this.fillStyle = "#ffffff", this.fillRect(t2, e2, n2, r2));
  }, p2.prototype.save = function(t2) {
    t2 = "boolean" != typeof t2 || t2;
    for (var e2 = this.pdf.internal.getCurrentPageInfo().pageNumber, n2 = 0; n2 < this.pdf.internal.getNumberOfPages(); n2++) this.pdf.setPage(n2 + 1), this.pdf.internal.out("q");
    if (this.pdf.setPage(e2), t2) {
      this.ctx.fontSize = this.pdf.internal.getFontSize();
      var r2 = new d2(this.ctx);
      this.ctxStack.push(this.ctx), this.ctx = r2;
    }
  }, p2.prototype.restore = function(t2) {
    t2 = "boolean" != typeof t2 || t2;
    for (var e2 = this.pdf.internal.getCurrentPageInfo().pageNumber, n2 = 0; n2 < this.pdf.internal.getNumberOfPages(); n2++) this.pdf.setPage(n2 + 1), this.pdf.internal.out("Q");
    this.pdf.setPage(e2), t2 && 0 !== this.ctxStack.length && (this.ctx = this.ctxStack.pop(), this.fillStyle = this.ctx.fillStyle, this.strokeStyle = this.ctx.strokeStyle, this.font = this.ctx.font, this.lineCap = this.ctx.lineCap, this.lineWidth = this.ctx.lineWidth, this.lineJoin = this.ctx.lineJoin, this.lineDash = this.ctx.lineDash, this.lineDashOffset = this.ctx.lineDashOffset);
  }, p2.prototype.toDataURL = function() {
    throw new Error("toDataUrl not implemented.");
  };
  var g2 = function(t2) {
    var e2, n2, r2, i3;
    if (true === t2.isCanvasGradient && (t2 = t2.getColor()), !t2) return { r: 0, g: 0, b: 0, a: 0, style: t2 };
    if (/transparent|rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*0+\s*\)/.test(t2)) e2 = 0, n2 = 0, r2 = 0, i3 = 0;
    else {
      var a3 = /rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/.exec(t2);
      if (null !== a3) e2 = parseInt(a3[1]), n2 = parseInt(a3[2]), r2 = parseInt(a3[3]), i3 = 1;
      else if (null !== (a3 = /rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/.exec(t2))) e2 = parseInt(a3[1]), n2 = parseInt(a3[2]), r2 = parseInt(a3[3]), i3 = parseFloat(a3[4]);
      else {
        if (i3 = 1, "string" == typeof t2 && "#" !== t2.charAt(0)) {
          var o2 = new h(t2);
          t2 = o2.ok ? o2.toHex() : "#000000";
        }
        4 === t2.length ? (e2 = t2.substring(1, 2), e2 += e2, n2 = t2.substring(2, 3), n2 += n2, r2 = t2.substring(3, 4), r2 += r2) : (e2 = t2.substring(1, 3), n2 = t2.substring(3, 5), r2 = t2.substring(5, 7)), e2 = parseInt(e2, 16), n2 = parseInt(n2, 16), r2 = parseInt(r2, 16);
      }
    }
    return { r: e2, g: n2, b: r2, a: i3, style: t2 };
  }, m2 = function() {
    return this.ctx.isFillTransparent || 0 == this.globalAlpha;
  }, v2 = function() {
    return Boolean(this.ctx.isStrokeTransparent || 0 == this.globalAlpha);
  };
  p2.prototype.fillText = function(t2, e2, n2, r2) {
    if (isNaN(e2) || isNaN(n2) || "string" != typeof t2) throw o.error("jsPDF.context2d.fillText: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.fillText");
    if (r2 = isNaN(r2) ? void 0 : r2, !m2.call(this)) {
      var i3 = E2(this.ctx.transform.rotation), a3 = this.ctx.transform.scaleX;
      j2.call(this, { text: t2, x: e2, y: n2, scale: a3, angle: i3, align: this.textAlign, maxWidth: r2 });
    }
  }, p2.prototype.strokeText = function(t2, e2, n2, r2) {
    if (isNaN(e2) || isNaN(n2) || "string" != typeof t2) throw o.error("jsPDF.context2d.strokeText: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.strokeText");
    if (!v2.call(this)) {
      r2 = isNaN(r2) ? void 0 : r2;
      var i3 = E2(this.ctx.transform.rotation), a3 = this.ctx.transform.scaleX;
      j2.call(this, { text: t2, x: e2, y: n2, scale: a3, renderingMode: "stroke", angle: i3, align: this.textAlign, maxWidth: r2 });
    }
  }, p2.prototype.measureText = function(t2) {
    if ("string" != typeof t2) throw o.error("jsPDF.context2d.measureText: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.measureText");
    var e2 = this.pdf, n2 = this.pdf.internal.scaleFactor, r2 = e2.internal.getFontSize(), i3 = e2.getStringUnitWidth(t2) * r2 / e2.internal.scaleFactor;
    return new function(t3) {
      var e3 = (t3 = t3 || {}).width || 0;
      return Object.defineProperty(this, "width", { get: function() {
        return e3;
      } }), this;
    }({ width: i3 *= Math.round(96 * n2 / 72 * 1e4) / 1e4 });
  }, p2.prototype.scale = function(t2, e2) {
    if (isNaN(t2) || isNaN(e2)) throw o.error("jsPDF.context2d.scale: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.scale");
    var n2 = new l2(t2, 0, 0, e2, 0, 0);
    this.ctx.transform = this.ctx.transform.multiply(n2);
  }, p2.prototype.rotate = function(t2) {
    if (isNaN(t2)) throw o.error("jsPDF.context2d.rotate: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.rotate");
    var e2 = new l2(Math.cos(t2), Math.sin(t2), -Math.sin(t2), Math.cos(t2), 0, 0);
    this.ctx.transform = this.ctx.transform.multiply(e2);
  }, p2.prototype.translate = function(t2, e2) {
    if (isNaN(t2) || isNaN(e2)) throw o.error("jsPDF.context2d.translate: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.translate");
    var n2 = new l2(1, 0, 0, 1, t2, e2);
    this.ctx.transform = this.ctx.transform.multiply(n2);
  }, p2.prototype.transform = function(t2, e2, n2, r2, i3, a3) {
    if (isNaN(t2) || isNaN(e2) || isNaN(n2) || isNaN(r2) || isNaN(i3) || isNaN(a3)) throw o.error("jsPDF.context2d.transform: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.transform");
    var s3 = new l2(t2, e2, n2, r2, i3, a3);
    this.ctx.transform = this.ctx.transform.multiply(s3);
  }, p2.prototype.setTransform = function(t2, e2, n2, r2, i3, a3) {
    t2 = isNaN(t2) ? 1 : t2, e2 = isNaN(e2) ? 0 : e2, n2 = isNaN(n2) ? 0 : n2, r2 = isNaN(r2) ? 1 : r2, i3 = isNaN(i3) ? 0 : i3, a3 = isNaN(a3) ? 0 : a3, this.ctx.transform = new l2(t2, e2, n2, r2, i3, a3);
  };
  var b2 = function() {
    return this.margin[0] > 0 || this.margin[1] > 0 || this.margin[2] > 0 || this.margin[3] > 0;
  };
  p2.prototype.drawImage = function(t2, e2, n2, r2, i3, a3, o2, s3, u3) {
    var h2 = this.pdf.getImageProperties(t2), f3 = 1, d3 = 1, p3 = 1, g3 = 1;
    void 0 !== r2 && void 0 !== s3 && (p3 = s3 / r2, g3 = u3 / i3, f3 = h2.width / r2 * s3 / r2, d3 = h2.height / i3 * u3 / i3), void 0 === a3 && (a3 = e2, o2 = n2, e2 = 0, n2 = 0), void 0 !== r2 && void 0 === s3 && (s3 = r2, u3 = i3), void 0 === r2 && void 0 === s3 && (s3 = h2.width, u3 = h2.height);
    for (var m3, v3 = this.ctx.transform.decompose(), w3 = E2(v3.rotate.shx), x3 = new l2(), S3 = (x3 = (x3 = (x3 = x3.multiply(v3.translate)).multiply(v3.skew)).multiply(v3.scale)).applyToRectangle(new c2(a3 - e2 * p3, o2 - n2 * g3, r2 * f3, i3 * d3)), _3 = y2.call(this, S3), P3 = [], k3 = 0; k3 < _3.length; k3 += 1) -1 === P3.indexOf(_3[k3]) && P3.push(_3[k3]);
    if (L2(P3), this.autoPaging) for (var F3 = P3[0], I3 = P3[P3.length - 1], j3 = F3; j3 < I3 + 1; j3++) {
      this.pdf.setPage(j3);
      var C3 = this.pdf.internal.pageSize.width - this.margin[3] - this.margin[1], O3 = 1 === j3 ? this.posY + this.margin[0] : this.margin[0], B3 = this.pdf.internal.pageSize.height - this.posY - this.margin[0] - this.margin[2], M3 = this.pdf.internal.pageSize.height - this.margin[0] - this.margin[2], q3 = 1 === j3 ? 0 : B3 + (j3 - 2) * M3;
      if (0 !== this.ctx.clip_path.length) {
        var R3 = this.path;
        m3 = JSON.parse(JSON.stringify(this.ctx.clip_path)), this.path = N2(m3, this.posX + this.margin[3], -q3 + O3 + this.ctx.prevPageLastElemOffset), A2.call(this, "fill", true), this.path = R3;
      }
      var D3 = JSON.parse(JSON.stringify(S3));
      D3 = N2([D3], this.posX + this.margin[3], -q3 + O3 + this.ctx.prevPageLastElemOffset)[0];
      var T3 = (j3 > F3 || j3 < I3) && b2.call(this);
      T3 && (this.pdf.saveGraphicsState(), this.pdf.rect(this.margin[3], this.margin[0], C3, M3, null).clip().discardPath()), this.pdf.addImage(t2, "JPEG", D3.x, D3.y, D3.w, D3.h, null, null, w3), T3 && this.pdf.restoreGraphicsState();
    }
    else this.pdf.addImage(t2, "JPEG", S3.x, S3.y, S3.w, S3.h, null, null, w3);
  };
  var y2 = function(t2, e2, n2) {
    var r2 = [];
    e2 = e2 || this.pdf.internal.pageSize.width, n2 = n2 || this.pdf.internal.pageSize.height - this.margin[0] - this.margin[2];
    var i3 = this.posY + this.ctx.prevPageLastElemOffset;
    switch (t2.type) {
      default:
      case "mt":
      case "lt":
        r2.push(Math.floor((t2.y + i3) / n2) + 1);
        break;
      case "arc":
        r2.push(Math.floor((t2.y + i3 - t2.radius) / n2) + 1), r2.push(Math.floor((t2.y + i3 + t2.radius) / n2) + 1);
        break;
      case "qct":
        var a3 = R2(this.ctx.lastPoint.x, this.ctx.lastPoint.y, t2.x1, t2.y1, t2.x, t2.y);
        r2.push(Math.floor((a3.y + i3) / n2) + 1), r2.push(Math.floor((a3.y + a3.h + i3) / n2) + 1);
        break;
      case "bct":
        var o2 = D2(this.ctx.lastPoint.x, this.ctx.lastPoint.y, t2.x1, t2.y1, t2.x2, t2.y2, t2.x, t2.y);
        r2.push(Math.floor((o2.y + i3) / n2) + 1), r2.push(Math.floor((o2.y + o2.h + i3) / n2) + 1);
        break;
      case "rect":
        r2.push(Math.floor((t2.y + i3) / n2) + 1), r2.push(Math.floor((t2.y + t2.h + i3) / n2) + 1);
    }
    for (var s3 = 0; s3 < r2.length; s3 += 1) for (; this.pdf.internal.getNumberOfPages() < r2[s3]; ) w2.call(this);
    return r2;
  }, w2 = function() {
    var t2 = this.fillStyle, e2 = this.strokeStyle, n2 = this.font, r2 = this.lineCap, i3 = this.lineWidth, a3 = this.lineJoin;
    this.pdf.addPage(), this.fillStyle = t2, this.strokeStyle = e2, this.font = n2, this.lineCap = r2, this.lineWidth = i3, this.lineJoin = a3;
  }, N2 = function(t2, e2, n2) {
    for (var r2 = 0; r2 < t2.length; r2++) switch (t2[r2].type) {
      case "bct":
        t2[r2].x2 += e2, t2[r2].y2 += n2;
      case "qct":
        t2[r2].x1 += e2, t2[r2].y1 += n2;
      default:
        t2[r2].x += e2, t2[r2].y += n2;
    }
    return t2;
  }, L2 = function(t2) {
    return t2.sort(function(t3, e2) {
      return t3 - e2;
    });
  }, x2 = function(t2, e2) {
    for (var n2, r2, i3 = this.fillStyle, a3 = this.strokeStyle, o2 = this.lineCap, s3 = this.lineWidth, u3 = Math.abs(s3 * this.ctx.transform.scaleX), c3 = this.lineJoin, l3 = JSON.parse(JSON.stringify(this.path)), h2 = JSON.parse(JSON.stringify(this.path)), f3 = [], d3 = 0; d3 < h2.length; d3++) if (void 0 !== h2[d3].x) for (var p3 = y2.call(this, h2[d3]), g3 = 0; g3 < p3.length; g3 += 1) -1 === f3.indexOf(p3[g3]) && f3.push(p3[g3]);
    for (var m3 = 0; m3 < f3.length; m3++) for (; this.pdf.internal.getNumberOfPages() < f3[m3]; ) w2.call(this);
    if (L2(f3), this.autoPaging) for (var v3 = f3[0], x3 = f3[f3.length - 1], S3 = v3; S3 < x3 + 1; S3++) {
      this.pdf.setPage(S3), this.fillStyle = i3, this.strokeStyle = a3, this.lineCap = o2, this.lineWidth = u3, this.lineJoin = c3;
      var _3 = this.pdf.internal.pageSize.width - this.margin[3] - this.margin[1], P3 = 1 === S3 ? this.posY + this.margin[0] : this.margin[0], k3 = this.pdf.internal.pageSize.height - this.posY - this.margin[0] - this.margin[2], F3 = this.pdf.internal.pageSize.height - this.margin[0] - this.margin[2], I3 = 1 === S3 ? 0 : k3 + (S3 - 2) * F3;
      if (0 !== this.ctx.clip_path.length) {
        var j3 = this.path;
        n2 = JSON.parse(JSON.stringify(this.ctx.clip_path)), this.path = N2(n2, this.posX + this.margin[3], -I3 + P3 + this.ctx.prevPageLastElemOffset), A2.call(this, t2, true), this.path = j3;
      }
      if (r2 = JSON.parse(JSON.stringify(l3)), this.path = N2(r2, this.posX + this.margin[3], -I3 + P3 + this.ctx.prevPageLastElemOffset), false === e2 || 0 === S3) {
        var C3 = (S3 > v3 || S3 < x3) && b2.call(this);
        C3 && (this.pdf.saveGraphicsState(), this.pdf.rect(this.margin[3], this.margin[0], _3, F3, null).clip().discardPath()), A2.call(this, t2, e2), C3 && this.pdf.restoreGraphicsState();
      }
      this.lineWidth = s3;
    }
    else this.lineWidth = u3, A2.call(this, t2, e2), this.lineWidth = s3;
    this.path = l3;
  }, A2 = function(t2, e2) {
    if (("stroke" !== t2 || e2 || !v2.call(this)) && ("stroke" === t2 || e2 || !m2.call(this))) {
      for (var n2, r2, i3 = [], a3 = this.path, o2 = 0; o2 < a3.length; o2++) {
        var s3 = a3[o2];
        switch (s3.type) {
          case "begin":
            i3.push({ begin: true });
            break;
          case "close":
            i3.push({ close: true });
            break;
          case "mt":
            i3.push({ start: s3, deltas: [], abs: [] });
            break;
          case "lt":
            var u3 = i3.length;
            if (a3[o2 - 1] && !isNaN(a3[o2 - 1].x) && (n2 = [s3.x - a3[o2 - 1].x, s3.y - a3[o2 - 1].y], u3 > 0)) {
              for (; u3 >= 0; u3--) if (true !== i3[u3 - 1].close && true !== i3[u3 - 1].begin) {
                i3[u3 - 1].deltas.push(n2), i3[u3 - 1].abs.push(s3);
                break;
              }
            }
            break;
          case "bct":
            n2 = [s3.x1 - a3[o2 - 1].x, s3.y1 - a3[o2 - 1].y, s3.x2 - a3[o2 - 1].x, s3.y2 - a3[o2 - 1].y, s3.x - a3[o2 - 1].x, s3.y - a3[o2 - 1].y], i3[i3.length - 1].deltas.push(n2);
            break;
          case "qct":
            var c3 = a3[o2 - 1].x + 2 / 3 * (s3.x1 - a3[o2 - 1].x), l3 = a3[o2 - 1].y + 2 / 3 * (s3.y1 - a3[o2 - 1].y), h2 = s3.x + 2 / 3 * (s3.x1 - s3.x), f3 = s3.y + 2 / 3 * (s3.y1 - s3.y), d3 = s3.x, p3 = s3.y;
            n2 = [c3 - a3[o2 - 1].x, l3 - a3[o2 - 1].y, h2 - a3[o2 - 1].x, f3 - a3[o2 - 1].y, d3 - a3[o2 - 1].x, p3 - a3[o2 - 1].y], i3[i3.length - 1].deltas.push(n2);
            break;
          case "arc":
            i3.push({ deltas: [], abs: [], arc: true }), Array.isArray(i3[i3.length - 1].abs) && i3[i3.length - 1].abs.push(s3);
        }
      }
      r2 = e2 ? null : "stroke" === t2 ? "stroke" : "fill";
      for (var g3 = false, b3 = 0; b3 < i3.length; b3++) if (i3[b3].arc) for (var y3 = i3[b3].abs, w3 = 0; w3 < y3.length; w3++) {
        var N3 = y3[w3];
        "arc" === N3.type ? P2.call(this, N3.x, N3.y, N3.radius, N3.startAngle, N3.endAngle, N3.counterclockwise, void 0, e2, !g3) : C2.call(this, N3.x, N3.y), g3 = true;
      }
      else if (true === i3[b3].close) this.pdf.internal.out("h"), g3 = false;
      else if (true !== i3[b3].begin) {
        var L3 = i3[b3].start.x, x3 = i3[b3].start.y;
        O2.call(this, i3[b3].deltas, L3, x3), g3 = true;
      }
      r2 && k2.call(this, r2), e2 && F2.call(this);
    }
  }, S2 = function(t2) {
    var e2 = this.pdf.internal.getFontSize() / this.pdf.internal.scaleFactor, n2 = e2 * (this.pdf.internal.getLineHeightFactor() - 1);
    switch (this.ctx.textBaseline) {
      case "bottom":
        return t2 - n2;
      case "top":
        return t2 + e2 - n2;
      case "hanging":
        return t2 + e2 - 2 * n2;
      case "middle":
        return t2 + e2 / 2 - n2;
      default:
        return t2;
    }
  }, _2 = function(t2) {
    return t2 + this.pdf.internal.getFontSize() / this.pdf.internal.scaleFactor * (this.pdf.internal.getLineHeightFactor() - 1);
  };
  p2.prototype.createLinearGradient = function() {
    var t2 = function() {
    };
    return t2.colorStops = [], t2.addColorStop = function(t3, e2) {
      this.colorStops.push([t3, e2]);
    }, t2.getColor = function() {
      return 0 === this.colorStops.length ? "#000000" : this.colorStops[0][1];
    }, t2.isCanvasGradient = true, t2;
  }, p2.prototype.createPattern = function() {
    return this.createLinearGradient();
  }, p2.prototype.createRadialGradient = function() {
    return this.createLinearGradient();
  };
  var P2 = function(t2, e2, n2, r2, i3, a3, o2, s3, u3) {
    for (var c3 = M2.call(this, n2, r2, i3, a3), l3 = 0; l3 < c3.length; l3++) {
      var h2 = c3[l3];
      0 === l3 && (u3 ? I2.call(this, h2.x1 + t2, h2.y1 + e2) : C2.call(this, h2.x1 + t2, h2.y1 + e2)), B2.call(this, t2, e2, h2.x2, h2.y2, h2.x3, h2.y3, h2.x4, h2.y4);
    }
    s3 ? F2.call(this) : k2.call(this, o2);
  }, k2 = function(t2) {
    switch (t2) {
      case "stroke":
        this.pdf.internal.out("S");
        break;
      case "fill":
        this.pdf.internal.out("f");
    }
  }, F2 = function() {
    this.pdf.clip(), this.pdf.discardPath();
  }, I2 = function(t2, e2) {
    this.pdf.internal.out(r(t2) + " " + i2(e2) + " m");
  }, j2 = function(t2) {
    var e2;
    switch (t2.align) {
      case "right":
      case "end":
        e2 = "right";
        break;
      case "center":
        e2 = "center";
        break;
      default:
        e2 = "left";
    }
    var n2 = this.pdf.getTextDimensions(t2.text), r2 = S2.call(this, t2.y), i3 = _2.call(this, r2) - n2.h, a3 = this.ctx.transform.applyToPoint(new u2(t2.x, r2)), o2 = this.ctx.transform.decompose(), s3 = new l2();
    s3 = (s3 = (s3 = s3.multiply(o2.translate)).multiply(o2.skew)).multiply(o2.scale);
    for (var h2, f3, d3, p3 = this.ctx.transform.applyToRectangle(new c2(t2.x, r2, n2.w, n2.h)), g3 = s3.applyToRectangle(new c2(t2.x, i3, n2.w, n2.h)), m3 = y2.call(this, g3), v3 = [], w3 = 0; w3 < m3.length; w3 += 1) -1 === v3.indexOf(m3[w3]) && v3.push(m3[w3]);
    if (L2(v3), this.autoPaging) for (var x3 = v3[0], P3 = v3[v3.length - 1], k3 = x3; k3 < P3 + 1; k3++) {
      this.pdf.setPage(k3);
      var F3 = 1 === k3 ? this.posY + this.margin[0] : this.margin[0], I3 = this.pdf.internal.pageSize.height - this.posY - this.margin[0] - this.margin[2], j3 = this.pdf.internal.pageSize.height - this.margin[2], C3 = j3 - this.margin[0], O3 = this.pdf.internal.pageSize.width - this.margin[1], B3 = O3 - this.margin[3], M3 = 1 === k3 ? 0 : I3 + (k3 - 2) * C3;
      if (0 !== this.ctx.clip_path.length) {
        var q3 = this.path;
        h2 = JSON.parse(JSON.stringify(this.ctx.clip_path)), this.path = N2(h2, this.posX + this.margin[3], -1 * M3 + F3), A2.call(this, "fill", true), this.path = q3;
      }
      var E3 = N2([JSON.parse(JSON.stringify(g3))], this.posX + this.margin[3], -M3 + F3 + this.ctx.prevPageLastElemOffset)[0];
      t2.scale >= 0.01 && (f3 = this.pdf.internal.getFontSize(), this.pdf.setFontSize(f3 * t2.scale), d3 = this.lineWidth, this.lineWidth = d3 * t2.scale);
      var R3 = "text" !== this.autoPaging;
      if (R3 || E3.y + E3.h <= j3) {
        if (R3 || E3.y >= F3 && E3.x <= O3) {
          var D3 = R3 ? t2.text : this.pdf.splitTextToSize(t2.text, t2.maxWidth || O3 - E3.x)[0], T3 = N2([JSON.parse(JSON.stringify(p3))], this.posX + this.margin[3], -M3 + F3 + this.ctx.prevPageLastElemOffset)[0], z2 = R3 && (k3 > x3 || k3 < P3) && b2.call(this);
          z2 && (this.pdf.saveGraphicsState(), this.pdf.rect(this.margin[3], this.margin[0], B3, C3, null).clip().discardPath()), this.pdf.text(D3, T3.x, T3.y, { angle: t2.angle, align: e2, renderingMode: t2.renderingMode }), z2 && this.pdf.restoreGraphicsState();
        }
      } else E3.y < j3 && (this.ctx.prevPageLastElemOffset += j3 - E3.y);
      t2.scale >= 0.01 && (this.pdf.setFontSize(f3), this.lineWidth = d3);
    }
    else t2.scale >= 0.01 && (f3 = this.pdf.internal.getFontSize(), this.pdf.setFontSize(f3 * t2.scale), d3 = this.lineWidth, this.lineWidth = d3 * t2.scale), this.pdf.text(t2.text, a3.x + this.posX, a3.y + this.posY, { angle: t2.angle, align: e2, renderingMode: t2.renderingMode, maxWidth: t2.maxWidth }), t2.scale >= 0.01 && (this.pdf.setFontSize(f3), this.lineWidth = d3);
  }, C2 = function(t2, e2, n2, a3) {
    n2 = n2 || 0, a3 = a3 || 0, this.pdf.internal.out(r(t2 + n2) + " " + i2(e2 + a3) + " l");
  }, O2 = function(t2, e2, n2) {
    return this.pdf.lines(t2, e2, n2, null, null);
  }, B2 = function(t2, e2, r2, i3, o2, u3, c3, l3) {
    this.pdf.internal.out([n(a2(r2 + t2)), n(s2(i3 + e2)), n(a2(o2 + t2)), n(s2(u3 + e2)), n(a2(c3 + t2)), n(s2(l3 + e2)), "c"].join(" "));
  }, M2 = function(t2, e2, n2, r2) {
    for (var i3 = 2 * Math.PI, a3 = Math.PI / 2; e2 > n2; ) e2 -= i3;
    var o2 = Math.abs(n2 - e2);
    o2 < i3 && r2 && (o2 = i3 - o2);
    for (var s3 = [], u3 = r2 ? -1 : 1, c3 = e2; o2 > 1e-5; ) {
      var l3 = c3 + u3 * Math.min(o2, a3);
      s3.push(q2.call(this, t2, c3, l3)), o2 -= Math.abs(l3 - c3), c3 = l3;
    }
    return s3;
  }, q2 = function(t2, e2, n2) {
    var r2 = (n2 - e2) / 2, i3 = t2 * Math.cos(r2), a3 = t2 * Math.sin(r2), o2 = i3, s3 = -a3, u3 = o2 * o2 + s3 * s3, c3 = u3 + o2 * i3 + s3 * a3, l3 = 4 / 3 * (Math.sqrt(2 * u3 * c3) - c3) / (o2 * a3 - s3 * i3), h2 = o2 - l3 * s3, f3 = s3 + l3 * o2, d3 = h2, p3 = -f3, g3 = r2 + e2, m3 = Math.cos(g3), v3 = Math.sin(g3);
    return { x1: t2 * Math.cos(e2), y1: t2 * Math.sin(e2), x2: h2 * m3 - f3 * v3, y2: h2 * v3 + f3 * m3, x3: d3 * m3 - p3 * v3, y3: d3 * v3 + p3 * m3, x4: t2 * Math.cos(n2), y4: t2 * Math.sin(n2) };
  }, E2 = function(t2) {
    return 180 * t2 / Math.PI;
  }, R2 = function(t2, e2, n2, r2, i3, a3) {
    var o2 = t2 + 0.5 * (n2 - t2), s3 = e2 + 0.5 * (r2 - e2), u3 = i3 + 0.5 * (n2 - i3), l3 = a3 + 0.5 * (r2 - a3), h2 = Math.min(t2, i3, o2, u3), f3 = Math.max(t2, i3, o2, u3), d3 = Math.min(e2, a3, s3, l3), p3 = Math.max(e2, a3, s3, l3);
    return new c2(h2, d3, f3 - h2, p3 - d3);
  }, D2 = function(t2, e2, n2, r2, i3, a3, o2, s3) {
    var u3, l3, h2, f3, d3, p3, g3, m3, v3, b3, y3, w3, N3, L3, x3 = n2 - t2, A3 = r2 - e2, S3 = i3 - n2, _3 = a3 - r2, P3 = o2 - i3, k3 = s3 - a3;
    for (l3 = 0; l3 < 41; l3++) v3 = (g3 = (h2 = t2 + (u3 = l3 / 40) * x3) + u3 * ((d3 = n2 + u3 * S3) - h2)) + u3 * (d3 + u3 * (i3 + u3 * P3 - d3) - g3), b3 = (m3 = (f3 = e2 + u3 * A3) + u3 * ((p3 = r2 + u3 * _3) - f3)) + u3 * (p3 + u3 * (a3 + u3 * k3 - p3) - m3), 0 == l3 ? (y3 = v3, w3 = b3, N3 = v3, L3 = b3) : (y3 = Math.min(y3, v3), w3 = Math.min(w3, b3), N3 = Math.max(N3, v3), L3 = Math.max(L3, b3));
    return new c2(Math.round(y3), Math.round(w3), Math.round(N3 - y3), Math.round(L3 - w3));
  }, T2 = function() {
    if (this.prevLineDash || this.ctx.lineDash.length || this.ctx.lineDashOffset) {
      var t2, e2, n2 = (t2 = this.ctx.lineDash, e2 = this.ctx.lineDashOffset, JSON.stringify({ lineDash: t2, lineDashOffset: e2 }));
      this.prevLineDash !== n2 && (this.pdf.setLineDash(this.ctx.lineDash, this.ctx.lineDashOffset), this.prevLineDash = n2);
    }
  };
}(E.API), /**
 * @license
 * jsPDF filters PlugIn
 * Copyright (c) 2014 Aras Abbasi
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(t2) {
  var n = function(t3) {
    var e, n2, r2, i3, a3, o3, s2, u2, c2, l2;
    for (n2 = [], r2 = 0, i3 = (t3 += e = "\0\0\0\0".slice(t3.length % 4 || 4)).length; i3 > r2; r2 += 4) 0 !== (a3 = (t3.charCodeAt(r2) << 24) + (t3.charCodeAt(r2 + 1) << 16) + (t3.charCodeAt(r2 + 2) << 8) + t3.charCodeAt(r2 + 3)) ? (o3 = (a3 = ((a3 = ((a3 = ((a3 = (a3 - (l2 = a3 % 85)) / 85) - (c2 = a3 % 85)) / 85) - (u2 = a3 % 85)) / 85) - (s2 = a3 % 85)) / 85) % 85, n2.push(o3 + 33, s2 + 33, u2 + 33, c2 + 33, l2 + 33)) : n2.push(122);
    return function(t4, e2) {
      for (var n3 = e2; n3 > 0; n3--) t4.pop();
    }(n2, e.length), String.fromCharCode.apply(String, n2) + "~>";
  }, r = function(t3) {
    var e, n2, r2, i3, a3, o3 = String, s2 = "length", u2 = 255, c2 = "charCodeAt", l2 = "slice", h2 = "replace";
    for (t3[l2](-2), t3 = t3[l2](0, -2)[h2](/\s/g, "")[h2]("z", "!!!!!"), r2 = [], i3 = 0, a3 = (t3 += e = "uuuuu"[l2](t3[s2] % 5 || 5))[s2]; a3 > i3; i3 += 5) n2 = 52200625 * (t3[c2](i3) - 33) + 614125 * (t3[c2](i3 + 1) - 33) + 7225 * (t3[c2](i3 + 2) - 33) + 85 * (t3[c2](i3 + 3) - 33) + (t3[c2](i3 + 4) - 33), r2.push(u2 & n2 >> 24, u2 & n2 >> 16, u2 & n2 >> 8, u2 & n2);
    return function(t4, e2) {
      for (var n3 = e2; n3 > 0; n3--) t4.pop();
    }(r2, e[s2]), o3.fromCharCode.apply(o3, r2);
  }, i2 = function(t3) {
    return t3.split("").map(function(t4) {
      return ("0" + t4.charCodeAt().toString(16)).slice(-2);
    }).join("") + ">";
  }, a2 = function(t3) {
    var e = new RegExp(/^([0-9A-Fa-f]{2})+$/);
    if (-1 !== (t3 = t3.replace(/\s/g, "")).indexOf(">") && (t3 = t3.substr(0, t3.indexOf(">"))), t3.length % 2 && (t3 += "0"), false === e.test(t3)) return "";
    for (var n2 = "", r2 = 0; r2 < t3.length; r2 += 2) n2 += String.fromCharCode("0x" + (t3[r2] + t3[r2 + 1]));
    return n2;
  }, o2 = function(t3) {
    for (var n2 = new Uint8Array(t3.length), r2 = t3.length; r2--; ) n2[r2] = t3.charCodeAt(r2);
    return (n2 = zlibSync(n2)).reduce(function(t4, e) {
      return t4 + String.fromCharCode(e);
    }, "");
  };
  t2.processDataByFilters = function(t3, e) {
    var s2 = 0, u2 = t3 || "", c2 = [];
    for ("string" == typeof (e = e || []) && (e = [e]), s2 = 0; s2 < e.length; s2 += 1) switch (e[s2]) {
      case "ASCII85Decode":
      case "/ASCII85Decode":
        u2 = r(u2), c2.push("/ASCII85Encode");
        break;
      case "ASCII85Encode":
      case "/ASCII85Encode":
        u2 = n(u2), c2.push("/ASCII85Decode");
        break;
      case "ASCIIHexDecode":
      case "/ASCIIHexDecode":
        u2 = a2(u2), c2.push("/ASCIIHexEncode");
        break;
      case "ASCIIHexEncode":
      case "/ASCIIHexEncode":
        u2 = i2(u2), c2.push("/ASCIIHexDecode");
        break;
      case "FlateEncode":
      case "/FlateEncode":
        u2 = o2(u2), c2.push("/FlateDecode");
        break;
      default:
        throw new Error('The filter: "' + e[s2] + '" is not implemented');
    }
    return { data: u2, reverseChain: c2.reverse().join(" ") };
  };
}(E.API), /**
 * @license
 * jsPDF fileloading PlugIn
 * Copyright (c) 2018 Aras Abbasi (aras.abbasi@gmail.com)
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(t2) {
  t2.loadFile = function(t3, e, n) {
    return function(t4, e2, n2) {
      e2 = false !== e2, n2 = "function" == typeof n2 ? n2 : function() {
      };
      var r = void 0;
      try {
        r = function(t5, e3, n3) {
          var r2 = new XMLHttpRequest(), i2 = 0, a2 = function(t6) {
            var e4 = t6.length, n4 = [], r3 = String.fromCharCode;
            for (i2 = 0; i2 < e4; i2 += 1) n4.push(r3(255 & t6.charCodeAt(i2)));
            return n4.join("");
          };
          if (r2.open("GET", t5, !e3), r2.overrideMimeType("text/plain; charset=x-user-defined"), false === e3 && (r2.onload = function() {
            200 === r2.status ? n3(a2(this.responseText)) : n3(void 0);
          }), r2.send(null), e3 && 200 === r2.status) return a2(r2.responseText);
        }(t4, e2, n2);
      } catch (i2) {
      }
      return r;
    }(t3, e, n);
  }, t2.loadImageFile = t2.loadFile;
}(E.API), function(e) {
  function n() {
    return (i.html2canvas ? Promise.resolve(i.html2canvas) : __vitePreload(() => import("./html2canvas.esm-Dtsxr8dG.js"), true ? [] : void 0)).catch(function(t2) {
      return Promise.reject(new Error("Could not load html2canvas: " + t2));
    }).then(function(t2) {
      return t2.default ? t2.default : t2;
    });
  }
  function r() {
    return (i.DOMPurify ? Promise.resolve(i.DOMPurify) : __vitePreload(() => import("./purify.es-CRunum0v.js"), true ? [] : void 0)).catch(function(t2) {
      return Promise.reject(new Error("Could not load dompurify: " + t2));
    }).then(function(t2) {
      return t2.default ? t2.default : t2;
    });
  }
  var a2 = function(e2) {
    var n2 = _typeof(e2);
    return "undefined" === n2 ? "undefined" : "string" === n2 || e2 instanceof String ? "string" : "number" === n2 || e2 instanceof Number ? "number" : "function" === n2 || e2 instanceof Function ? "function" : e2 && e2.constructor === Array ? "array" : e2 && 1 === e2.nodeType ? "element" : "object" === n2 ? "object" : "unknown";
  }, o2 = function(t2, e2) {
    var n2 = document.createElement(t2);
    for (var r2 in e2.className && (n2.className = e2.className), e2.innerHTML && e2.dompurify && (n2.innerHTML = e2.dompurify.sanitize(e2.innerHTML)), e2.style) n2.style[r2] = e2.style[r2];
    return n2;
  }, s2 = function t2(e2, n2) {
    for (var r2 = 3 === e2.nodeType ? document.createTextNode(e2.nodeValue) : e2.cloneNode(false), i2 = e2.firstChild; i2; i2 = i2.nextSibling) true !== n2 && 1 === i2.nodeType && "SCRIPT" === i2.nodeName || r2.appendChild(t2(i2, n2));
    return 1 === e2.nodeType && ("CANVAS" === e2.nodeName ? (r2.width = e2.width, r2.height = e2.height, r2.getContext("2d").drawImage(e2, 0, 0)) : "TEXTAREA" !== e2.nodeName && "SELECT" !== e2.nodeName || (r2.value = e2.value), r2.addEventListener("load", function() {
      r2.scrollTop = e2.scrollTop, r2.scrollLeft = e2.scrollLeft;
    }, true)), r2;
  }, u2 = function t2(e2) {
    var n2 = Object.assign(t2.convert(Promise.resolve()), JSON.parse(JSON.stringify(t2.template))), r2 = t2.convert(Promise.resolve(), n2);
    return (r2 = r2.setProgress(1, t2, 1, [t2])).set(e2);
  };
  (u2.prototype = Object.create(Promise.prototype)).constructor = u2, u2.convert = function(t2, e2) {
    return t2.__proto__ = e2 || u2.prototype, t2;
  }, u2.template = { prop: { src: null, container: null, overlay: null, canvas: null, img: null, pdf: null, pageSize: null, callback: function() {
  } }, progress: { val: 0, state: null, n: 0, stack: [] }, opt: { filename: "file.pdf", margin: [0, 0, 0, 0], enableLinks: true, x: 0, y: 0, html2canvas: {}, jsPDF: {}, backgroundColor: "transparent" } }, u2.prototype.from = function(t2, e2) {
    return this.then(function() {
      switch (e2 = e2 || function(t3) {
        switch (a2(t3)) {
          case "string":
            return "string";
          case "element":
            return "canvas" === t3.nodeName.toLowerCase() ? "canvas" : "element";
          default:
            return "unknown";
        }
      }(t2), e2) {
        case "string":
          return this.then(r).then(function(e3) {
            return this.set({ src: o2("div", { innerHTML: t2, dompurify: e3 }) });
          });
        case "element":
          return this.set({ src: t2 });
        case "canvas":
          return this.set({ canvas: t2 });
        case "img":
          return this.set({ img: t2 });
        default:
          return this.error("Unknown source type.");
      }
    });
  }, u2.prototype.to = function(t2) {
    switch (t2) {
      case "container":
        return this.toContainer();
      case "canvas":
        return this.toCanvas();
      case "img":
        return this.toImg();
      case "pdf":
        return this.toPdf();
      default:
        return this.error("Invalid target.");
    }
  }, u2.prototype.toContainer = function() {
    return this.thenList([function() {
      return this.prop.src || this.error("Cannot duplicate - no source HTML.");
    }, function() {
      return this.prop.pageSize || this.setPageSize();
    }]).then(function() {
      var t2 = { position: "relative", display: "inline-block", width: ("number" != typeof this.opt.width || isNaN(this.opt.width) || "number" != typeof this.opt.windowWidth || isNaN(this.opt.windowWidth) ? Math.max(this.prop.src.clientWidth, this.prop.src.scrollWidth, this.prop.src.offsetWidth) : this.opt.windowWidth) + "px", left: 0, right: 0, top: 0, margin: "auto", backgroundColor: this.opt.backgroundColor }, e2 = s2(this.prop.src, this.opt.html2canvas.javascriptEnabled);
      "BODY" === e2.tagName && (t2.height = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight) + "px"), this.prop.overlay = o2("div", { className: "html2pdf__overlay", style: { position: "fixed", overflow: "hidden", zIndex: 1e3, left: "-100000px", right: 0, bottom: 0, top: 0 } }), this.prop.container = o2("div", { className: "html2pdf__container", style: t2 }), this.prop.container.appendChild(e2), this.prop.container.firstChild.appendChild(o2("div", { style: { clear: "both", border: "0 none transparent", margin: 0, padding: 0, height: 0 } })), this.prop.container.style.float = "none", this.prop.overlay.appendChild(this.prop.container), document.body.appendChild(this.prop.overlay), this.prop.container.firstChild.style.position = "relative", this.prop.container.height = Math.max(this.prop.container.firstChild.clientHeight, this.prop.container.firstChild.scrollHeight, this.prop.container.firstChild.offsetHeight) + "px";
    });
  }, u2.prototype.toCanvas = function() {
    var t2 = [function() {
      return document.body.contains(this.prop.container) || this.toContainer();
    }];
    return this.thenList(t2).then(n).then(function(t3) {
      var e2 = Object.assign({}, this.opt.html2canvas);
      return delete e2.onrendered, t3(this.prop.container, e2);
    }).then(function(t3) {
      (this.opt.html2canvas.onrendered || function() {
      })(t3), this.prop.canvas = t3, document.body.removeChild(this.prop.overlay);
    });
  }, u2.prototype.toContext2d = function() {
    var t2 = [function() {
      return document.body.contains(this.prop.container) || this.toContainer();
    }];
    return this.thenList(t2).then(n).then(function(t3) {
      var e2 = this.opt.jsPDF, n2 = this.opt.fontFaces, r2 = "number" != typeof this.opt.width || isNaN(this.opt.width) || "number" != typeof this.opt.windowWidth || isNaN(this.opt.windowWidth) ? 1 : this.opt.width / this.opt.windowWidth, i2 = Object.assign({ async: true, allowTaint: true, scale: r2, scrollX: this.opt.scrollX || 0, scrollY: this.opt.scrollY || 0, backgroundColor: "#ffffff", imageTimeout: 15e3, logging: true, proxy: null, removeContainer: true, foreignObjectRendering: false, useCORS: false }, this.opt.html2canvas);
      if (delete i2.onrendered, e2.context2d.autoPaging = void 0 === this.opt.autoPaging || this.opt.autoPaging, e2.context2d.posX = this.opt.x, e2.context2d.posY = this.opt.y, e2.context2d.margin = this.opt.margin, e2.context2d.fontFaces = n2, n2) for (var a3 = 0; a3 < n2.length; ++a3) {
        var o3 = n2[a3], s3 = o3.src.find(function(t4) {
          return "truetype" === t4.format;
        });
        s3 && e2.addFont(s3.url, o3.ref.name, o3.ref.style);
      }
      return i2.windowHeight = i2.windowHeight || 0, i2.windowHeight = 0 == i2.windowHeight ? Math.max(this.prop.container.clientHeight, this.prop.container.scrollHeight, this.prop.container.offsetHeight) : i2.windowHeight, e2.context2d.save(true), t3(this.prop.container, i2);
    }).then(function(t3) {
      this.opt.jsPDF.context2d.restore(true), (this.opt.html2canvas.onrendered || function() {
      })(t3), this.prop.canvas = t3, document.body.removeChild(this.prop.overlay);
    });
  }, u2.prototype.toImg = function() {
    return this.thenList([function() {
      return this.prop.canvas || this.toCanvas();
    }]).then(function() {
      var t2 = this.prop.canvas.toDataURL("image/" + this.opt.image.type, this.opt.image.quality);
      this.prop.img = document.createElement("img"), this.prop.img.src = t2;
    });
  }, u2.prototype.toPdf = function() {
    return this.thenList([function() {
      return this.toContext2d();
    }]).then(function() {
      this.prop.pdf = this.prop.pdf || this.opt.jsPDF;
    });
  }, u2.prototype.output = function(t2, e2, n2) {
    return "img" === (n2 = n2 || "pdf").toLowerCase() || "image" === n2.toLowerCase() ? this.outputImg(t2, e2) : this.outputPdf(t2, e2);
  }, u2.prototype.outputPdf = function(t2, e2) {
    return this.thenList([function() {
      return this.prop.pdf || this.toPdf();
    }]).then(function() {
      return this.prop.pdf.output(t2, e2);
    });
  }, u2.prototype.outputImg = function(t2) {
    return this.thenList([function() {
      return this.prop.img || this.toImg();
    }]).then(function() {
      switch (t2) {
        case void 0:
        case "img":
          return this.prop.img;
        case "datauristring":
        case "dataurlstring":
          return this.prop.img.src;
        case "datauri":
        case "dataurl":
          return document.location.href = this.prop.img.src;
        default:
          throw 'Image output type "' + t2 + '" is not supported.';
      }
    });
  }, u2.prototype.save = function(t2) {
    return this.thenList([function() {
      return this.prop.pdf || this.toPdf();
    }]).set(t2 ? { filename: t2 } : null).then(function() {
      this.prop.pdf.save(this.opt.filename);
    });
  }, u2.prototype.doCallback = function() {
    return this.thenList([function() {
      return this.prop.pdf || this.toPdf();
    }]).then(function() {
      this.prop.callback(this.prop.pdf);
    });
  }, u2.prototype.set = function(t2) {
    if ("object" !== a2(t2)) return this;
    var e2 = Object.keys(t2 || {}).map(function(e3) {
      if (e3 in u2.template.prop) return function() {
        this.prop[e3] = t2[e3];
      };
      switch (e3) {
        case "margin":
          return this.setMargin.bind(this, t2.margin);
        case "jsPDF":
          return function() {
            return this.opt.jsPDF = t2.jsPDF, this.setPageSize();
          };
        case "pageSize":
          return this.setPageSize.bind(this, t2.pageSize);
        default:
          return function() {
            this.opt[e3] = t2[e3];
          };
      }
    }, this);
    return this.then(function() {
      return this.thenList(e2);
    });
  }, u2.prototype.get = function(t2, e2) {
    return this.then(function() {
      var n2 = t2 in u2.template.prop ? this.prop[t2] : this.opt[t2];
      return e2 ? e2(n2) : n2;
    });
  }, u2.prototype.setMargin = function(t2) {
    return this.then(function() {
      switch (a2(t2)) {
        case "number":
          t2 = [t2, t2, t2, t2];
        case "array":
          if (2 === t2.length && (t2 = [t2[0], t2[1], t2[0], t2[1]]), 4 === t2.length) break;
        default:
          return this.error("Invalid margin array.");
      }
      this.opt.margin = t2;
    }).then(this.setPageSize);
  }, u2.prototype.setPageSize = function(t2) {
    function e2(t3, e3) {
      return Math.floor(t3 * e3 / 72 * 96);
    }
    return this.then(function() {
      (t2 = t2 || E.getPageSize(this.opt.jsPDF)).hasOwnProperty("inner") || (t2.inner = { width: t2.width - this.opt.margin[1] - this.opt.margin[3], height: t2.height - this.opt.margin[0] - this.opt.margin[2] }, t2.inner.px = { width: e2(t2.inner.width, t2.k), height: e2(t2.inner.height, t2.k) }, t2.inner.ratio = t2.inner.height / t2.inner.width), this.prop.pageSize = t2;
    });
  }, u2.prototype.setProgress = function(t2, e2, n2, r2) {
    return null != t2 && (this.progress.val = t2), null != e2 && (this.progress.state = e2), null != n2 && (this.progress.n = n2), null != r2 && (this.progress.stack = r2), this.progress.ratio = this.progress.val / this.progress.state, this;
  }, u2.prototype.updateProgress = function(t2, e2, n2, r2) {
    return this.setProgress(t2 ? this.progress.val + t2 : null, e2 || null, n2 ? this.progress.n + n2 : null, r2 ? this.progress.stack.concat(r2) : null);
  }, u2.prototype.then = function(t2, e2) {
    var n2 = this;
    return this.thenCore(t2, e2, function(t3, e3) {
      return n2.updateProgress(null, null, 1, [t3]), Promise.prototype.then.call(this, function(e4) {
        return n2.updateProgress(null, t3), e4;
      }).then(t3, e3).then(function(t4) {
        return n2.updateProgress(1), t4;
      });
    });
  }, u2.prototype.thenCore = function(t2, e2, n2) {
    n2 = n2 || Promise.prototype.then;
    var r2 = this;
    t2 && (t2 = t2.bind(r2)), e2 && (e2 = e2.bind(r2));
    var i2 = -1 !== Promise.toString().indexOf("[native code]") && "Promise" === Promise.name ? r2 : u2.convert(Object.assign({}, r2), Promise.prototype), a3 = n2.call(i2, t2, e2);
    return u2.convert(a3, r2.__proto__);
  }, u2.prototype.thenExternal = function(t2, e2) {
    return Promise.prototype.then.call(this, t2, e2);
  }, u2.prototype.thenList = function(t2) {
    var e2 = this;
    return t2.forEach(function(t3) {
      e2 = e2.thenCore(t3);
    }), e2;
  }, u2.prototype.catch = function(t2) {
    t2 && (t2 = t2.bind(this));
    var e2 = Promise.prototype.catch.call(this, t2);
    return u2.convert(e2, this);
  }, u2.prototype.catchExternal = function(t2) {
    return Promise.prototype.catch.call(this, t2);
  }, u2.prototype.error = function(t2) {
    return this.then(function() {
      throw new Error(t2);
    });
  }, u2.prototype.using = u2.prototype.set, u2.prototype.saveAs = u2.prototype.save, u2.prototype.export = u2.prototype.output, u2.prototype.run = u2.prototype.then, E.getPageSize = function(e2, n2, r2) {
    if ("object" === _typeof(e2)) {
      var i2 = e2;
      e2 = i2.orientation, n2 = i2.unit || n2, r2 = i2.format || r2;
    }
    n2 = n2 || "mm", r2 = r2 || "a4", e2 = ("" + (e2 || "P")).toLowerCase();
    var a3, o3 = ("" + r2).toLowerCase(), s3 = { a0: [2383.94, 3370.39], a1: [1683.78, 2383.94], a2: [1190.55, 1683.78], a3: [841.89, 1190.55], a4: [595.28, 841.89], a5: [419.53, 595.28], a6: [297.64, 419.53], a7: [209.76, 297.64], a8: [147.4, 209.76], a9: [104.88, 147.4], a10: [73.7, 104.88], b0: [2834.65, 4008.19], b1: [2004.09, 2834.65], b2: [1417.32, 2004.09], b3: [1000.63, 1417.32], b4: [708.66, 1000.63], b5: [498.9, 708.66], b6: [354.33, 498.9], b7: [249.45, 354.33], b8: [175.75, 249.45], b9: [124.72, 175.75], b10: [87.87, 124.72], c0: [2599.37, 3676.54], c1: [1836.85, 2599.37], c2: [1298.27, 1836.85], c3: [918.43, 1298.27], c4: [649.13, 918.43], c5: [459.21, 649.13], c6: [323.15, 459.21], c7: [229.61, 323.15], c8: [161.57, 229.61], c9: [113.39, 161.57], c10: [79.37, 113.39], dl: [311.81, 623.62], letter: [612, 792], "government-letter": [576, 756], legal: [612, 1008], "junior-legal": [576, 360], ledger: [1224, 792], tabloid: [792, 1224], "credit-card": [153, 243] };
    switch (n2) {
      case "pt":
        a3 = 1;
        break;
      case "mm":
        a3 = 72 / 25.4;
        break;
      case "cm":
        a3 = 72 / 2.54;
        break;
      case "in":
        a3 = 72;
        break;
      case "px":
        a3 = 0.75;
        break;
      case "pc":
      case "em":
        a3 = 12;
        break;
      case "ex":
        a3 = 6;
        break;
      default:
        throw "Invalid unit: " + n2;
    }
    var u3, c2 = 0, l2 = 0;
    if (s3.hasOwnProperty(o3)) c2 = s3[o3][1] / a3, l2 = s3[o3][0] / a3;
    else try {
      c2 = r2[1], l2 = r2[0];
    } catch (h2) {
      throw new Error("Invalid format: " + r2);
    }
    if ("p" === e2 || "portrait" === e2) e2 = "p", l2 > c2 && (u3 = l2, l2 = c2, c2 = u3);
    else {
      if ("l" !== e2 && "landscape" !== e2) throw "Invalid orientation: " + e2;
      e2 = "l", c2 > l2 && (u3 = l2, l2 = c2, c2 = u3);
    }
    return { width: l2, height: c2, unit: n2, k: a3, orientation: e2 };
  }, e.html = function(t2, e2) {
    (e2 = e2 || {}).callback = e2.callback || function() {
    }, e2.html2canvas = e2.html2canvas || {}, e2.html2canvas.canvas = e2.html2canvas.canvas || this.canvas, e2.jsPDF = e2.jsPDF || this, e2.fontFaces = e2.fontFaces ? e2.fontFaces.map(Ct) : null;
    var n2 = new u2(e2);
    return e2.worker ? n2 : n2.from(t2).doCallback();
  };
}(E.API), E.API.addJS = function(t2) {
  return Ut = t2, this.internal.events.subscribe("postPutResources", function() {
    Tt = this.internal.newObject(), this.internal.out("<<"), this.internal.out("/Names [(EmbeddedJS) " + (Tt + 1) + " 0 R]"), this.internal.out(">>"), this.internal.out("endobj"), zt = this.internal.newObject(), this.internal.out("<<"), this.internal.out("/S /JavaScript"), this.internal.out("/JS (" + Ut + ")"), this.internal.out(">>"), this.internal.out("endobj");
  }), this.internal.events.subscribe("putCatalog", function() {
    void 0 !== Tt && void 0 !== zt && this.internal.out("/Names <</JavaScript " + Tt + " 0 R>>");
  }), this;
}, /**
 * @license
 * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(t2) {
  var e;
  t2.events.push(["postPutResources", function() {
    var t3 = this, n = /^(\d+) 0 obj$/;
    if (this.outline.root.children.length > 0) for (var r = t3.outline.render().split(/\r\n/), i2 = 0; i2 < r.length; i2++) {
      var a2 = r[i2], o2 = n.exec(a2);
      if (null != o2) {
        var s2 = o2[1];
        t3.internal.newObjectDeferredBegin(s2, false);
      }
      t3.internal.write(a2);
    }
    if (this.outline.createNamedDestinations) {
      var u2 = this.internal.pages.length, c2 = [];
      for (i2 = 0; i2 < u2; i2++) {
        var l2 = t3.internal.newObject();
        c2.push(l2);
        var h2 = t3.internal.getPageInfo(i2 + 1);
        t3.internal.write("<< /D[" + h2.objId + " 0 R /XYZ null null null]>> endobj");
      }
      var f2 = t3.internal.newObject();
      for (t3.internal.write("<< /Names [ "), i2 = 0; i2 < c2.length; i2++) t3.internal.write("(page_" + (i2 + 1) + ")" + c2[i2] + " 0 R");
      t3.internal.write(" ] >>", "endobj"), e = t3.internal.newObject(), t3.internal.write("<< /Dests " + f2 + " 0 R"), t3.internal.write(">>", "endobj");
    }
  }]), t2.events.push(["putCatalog", function() {
    var t3 = this;
    t3.outline.root.children.length > 0 && (t3.internal.write("/Outlines", this.outline.makeRef(this.outline.root)), this.outline.createNamedDestinations && t3.internal.write("/Names " + e + " 0 R"));
  }]), t2.events.push(["initialized", function() {
    var t3 = this;
    t3.outline = { createNamedDestinations: false, root: { children: [] } }, t3.outline.add = function(t4, e2, n) {
      var r = { title: e2, options: n, children: [] };
      return null == t4 && (t4 = this.root), t4.children.push(r), r;
    }, t3.outline.render = function() {
      return this.ctx = {}, this.ctx.val = "", this.ctx.pdf = t3, this.genIds_r(this.root), this.renderRoot(this.root), this.renderItems(this.root), this.ctx.val;
    }, t3.outline.genIds_r = function(e2) {
      e2.id = t3.internal.newObjectDeferred();
      for (var n = 0; n < e2.children.length; n++) this.genIds_r(e2.children[n]);
    }, t3.outline.renderRoot = function(t4) {
      this.objStart(t4), this.line("/Type /Outlines"), t4.children.length > 0 && (this.line("/First " + this.makeRef(t4.children[0])), this.line("/Last " + this.makeRef(t4.children[t4.children.length - 1]))), this.line("/Count " + this.count_r({ count: 0 }, t4)), this.objEnd();
    }, t3.outline.renderItems = function(e2) {
      for (var n = this.ctx.pdf.internal.getVerticalCoordinateString, r = 0; r < e2.children.length; r++) {
        var i2 = e2.children[r];
        this.objStart(i2), this.line("/Title " + this.makeString(i2.title)), this.line("/Parent " + this.makeRef(e2)), r > 0 && this.line("/Prev " + this.makeRef(e2.children[r - 1])), r < e2.children.length - 1 && this.line("/Next " + this.makeRef(e2.children[r + 1])), i2.children.length > 0 && (this.line("/First " + this.makeRef(i2.children[0])), this.line("/Last " + this.makeRef(i2.children[i2.children.length - 1])));
        var a2 = this.count = this.count_r({ count: 0 }, i2);
        if (a2 > 0 && this.line("/Count " + a2), i2.options && i2.options.pageNumber) {
          var o2 = t3.internal.getPageInfo(i2.options.pageNumber);
          this.line("/Dest [" + o2.objId + " 0 R /XYZ 0 " + n(0) + " 0]");
        }
        this.objEnd();
      }
      for (var s2 = 0; s2 < e2.children.length; s2++) this.renderItems(e2.children[s2]);
    }, t3.outline.line = function(t4) {
      this.ctx.val += t4 + "\r\n";
    }, t3.outline.makeRef = function(t4) {
      return t4.id + " 0 R";
    }, t3.outline.makeString = function(e2) {
      return "(" + t3.internal.pdfEscape(e2) + ")";
    }, t3.outline.objStart = function(t4) {
      this.ctx.val += "\r\n" + t4.id + " 0 obj\r\n<<\r\n";
    }, t3.outline.objEnd = function() {
      this.ctx.val += ">> \r\nendobj\r\n";
    }, t3.outline.count_r = function(t4, e2) {
      for (var n = 0; n < e2.children.length; n++) t4.count++, this.count_r(t4, e2.children[n]);
      return t4.count;
    };
  }]);
}(E.API), /**
 * @license
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(t2) {
  var e = [192, 193, 194, 195, 196, 197, 198, 199];
  t2.processJPEG = function(t3, n, r, i2, a2, o2) {
    var s2, u2 = this.decode.DCT_DECODE, c2 = null;
    if ("string" == typeof t3 || this.__addimage__.isArrayBuffer(t3) || this.__addimage__.isArrayBufferView(t3)) {
      switch (t3 = a2 || t3, t3 = this.__addimage__.isArrayBuffer(t3) ? new Uint8Array(t3) : t3, s2 = function(t4) {
        for (var n2, r2 = 256 * t4.charCodeAt(4) + t4.charCodeAt(5), i3 = t4.length, a3 = { width: 0, height: 0, numcomponents: 1 }, o3 = 4; o3 < i3; o3 += 2) {
          if (o3 += r2, -1 !== e.indexOf(t4.charCodeAt(o3 + 1))) {
            n2 = 256 * t4.charCodeAt(o3 + 5) + t4.charCodeAt(o3 + 6), a3 = { width: 256 * t4.charCodeAt(o3 + 7) + t4.charCodeAt(o3 + 8), height: n2, numcomponents: t4.charCodeAt(o3 + 9) };
            break;
          }
          r2 = 256 * t4.charCodeAt(o3 + 2) + t4.charCodeAt(o3 + 3);
        }
        return a3;
      }(t3 = this.__addimage__.isArrayBufferView(t3) ? this.__addimage__.arrayBufferToBinaryString(t3) : t3), s2.numcomponents) {
        case 1:
          o2 = this.color_spaces.DEVICE_GRAY;
          break;
        case 4:
          o2 = this.color_spaces.DEVICE_CMYK;
          break;
        case 3:
          o2 = this.color_spaces.DEVICE_RGB;
      }
      c2 = { data: t3, width: s2.width, height: s2.height, colorSpace: o2, bitsPerComponent: 8, filter: u2, index: n, alias: r };
    }
    return c2;
  };
}(E.API), E.API.processPNG = function(t2, i2, a2, o2) {
  if (this.__addimage__.isArrayBuffer(t2) && (t2 = new Uint8Array(t2)), this.__addimage__.isArrayBufferView(t2)) {
    var s2, u2 = decodePng(t2, { checkCrc: true }), c2 = u2.width, l2 = u2.height, h2 = u2.channels, f2 = u2.palette, d2 = u2.depth;
    s2 = f2 && 1 === h2 ? function(t3) {
      for (var e = t3.width, r = t3.height, i3 = t3.data, a3 = t3.palette, o3 = t3.depth, s3 = false, u3 = [], c3 = [], l3 = void 0, h3 = false, f3 = 0, d3 = 0; d3 < a3.length; d3++) {
        var p3 = _slicedToArray(a3[d3], 4), g3 = p3[0], m3 = p3[1], v3 = p3[2], b3 = p3[3];
        u3.push(g3, m3, v3), null != b3 && (0 === b3 ? (f3++, c3.length < 1 && c3.push(d3)) : b3 < 255 && (h3 = true));
      }
      if (h3 || f3 > 1) {
        s3 = true, c3 = void 0;
        var y3 = e * r;
        l3 = new Uint8Array(y3);
        for (var w3 = new DataView(i3.buffer), N3 = 0; N3 < y3; N3++) {
          var L3 = re(w3, N3, o3), x3 = _slicedToArray(a3[L3], 4)[3];
          l3[N3] = x3;
        }
      }
      return { colorSpace: "Indexed", colorsPerPixel: 1, colorBytes: i3, alphaBytes: l3, needSMask: s3, palette: u3, mask: c3 };
    }(u2) : 2 === h2 || 4 === h2 ? function(t3) {
      for (var e = t3.data, n = t3.width, r = t3.height, i3 = t3.channels, a3 = t3.depth, o3 = 2 === i3 ? "DeviceGray" : "DeviceRGB", s3 = i3 - 1, u3 = n * r, c3 = s3, l3 = u3 * c3, h3 = 1 * u3, f3 = Math.ceil(l3 * a3 / 8), d3 = Math.ceil(h3 * a3 / 8), p3 = new Uint8Array(f3), g3 = new Uint8Array(d3), m3 = new DataView(e.buffer), v3 = new DataView(p3.buffer), b3 = new DataView(g3.buffer), y3 = false, w3 = 0; w3 < u3; w3++) {
        for (var N3 = w3 * i3, L3 = 0; L3 < c3; L3++) ie(v3, re(m3, N3 + L3, a3), w3 * c3 + L3, a3);
        var x3 = re(m3, N3 + c3, a3);
        x3 < (1 << a3) - 1 && (y3 = true), ie(b3, x3, 1 * w3, a3);
      }
      return { colorSpace: o3, colorsPerPixel: s3, colorBytes: p3, alphaBytes: g3, needSMask: y3 };
    }(u2) : function(t3) {
      var e = t3.data, n = 1 === t3.channels ? "DeviceGray" : "DeviceRGB";
      return { colorSpace: n, colorsPerPixel: "DeviceGray" === n ? 1 : 3, colorBytes: e instanceof Uint8Array ? e : new Uint8Array(e.buffer), needSMask: false };
    }(u2);
    var p2, g2, m2, v2 = s2, b2 = v2.colorSpace, y2 = v2.colorsPerPixel, w2 = v2.colorBytes, N2 = v2.alphaBytes, L2 = v2.needSMask, x2 = v2.palette, A2 = v2.mask, S2 = null;
    return o2 !== E.API.image_compression.NONE && "function" == typeof zlibSync ? (S2 = function(t3) {
      var e;
      switch (t3) {
        case E.API.image_compression.FAST:
          e = 11;
          break;
        case E.API.image_compression.MEDIUM:
          e = 13;
          break;
        case E.API.image_compression.SLOW:
          e = 14;
          break;
        default:
          e = 12;
      }
      return e;
    }(o2), p2 = this.decode.FLATE_DECODE, g2 = "/Predictor ".concat(S2, " "), t2 = Xt(w2, c2 * y2, y2, o2), L2 && (m2 = Xt(N2, c2, 1, o2))) : (p2 = void 0, g2 = "", t2 = w2, L2 && (m2 = N2)), g2 += "/Colors ".concat(y2, " /BitsPerComponent ").concat(d2, " /Columns ").concat(c2), (this.__addimage__.isArrayBuffer(t2) || this.__addimage__.isArrayBufferView(t2)) && (t2 = this.__addimage__.arrayBufferToBinaryString(t2)), (m2 && this.__addimage__.isArrayBuffer(m2) || this.__addimage__.isArrayBufferView(m2)) && (m2 = this.__addimage__.arrayBufferToBinaryString(m2)), { alias: a2, data: t2, index: i2, filter: p2, decodeParameters: g2, transparency: A2, palette: x2, sMask: m2, predictor: S2, width: c2, height: l2, bitsPerComponent: d2, colorSpace: b2 };
  }
}, function(t2) {
  t2.processGIF89A = function(e, n, r, i2) {
    var a2 = new oe(e), o2 = a2.width, s2 = a2.height, u2 = [];
    a2.decodeAndBlitFrameRGBA(0, u2);
    var c2 = { data: u2, width: o2, height: s2 }, l2 = new ue(100).encode(c2, 100);
    return t2.processJPEG.call(this, l2, n, r, i2);
  }, t2.processGIF87A = t2.processGIF89A;
}(E.API), ce.prototype.parseHeader = function() {
  if (this.fileSize = this.datav.getUint32(this.pos, true), this.pos += 4, this.reserved = this.datav.getUint32(this.pos, true), this.pos += 4, this.offset = this.datav.getUint32(this.pos, true), this.pos += 4, this.headerSize = this.datav.getUint32(this.pos, true), this.pos += 4, this.width = this.datav.getUint32(this.pos, true), this.pos += 4, this.height = this.datav.getInt32(this.pos, true), this.pos += 4, this.planes = this.datav.getUint16(this.pos, true), this.pos += 2, this.bitPP = this.datav.getUint16(this.pos, true), this.pos += 2, this.compress = this.datav.getUint32(this.pos, true), this.pos += 4, this.rawSize = this.datav.getUint32(this.pos, true), this.pos += 4, this.hr = this.datav.getUint32(this.pos, true), this.pos += 4, this.vr = this.datav.getUint32(this.pos, true), this.pos += 4, this.colors = this.datav.getUint32(this.pos, true), this.pos += 4, this.importantColors = this.datav.getUint32(this.pos, true), this.pos += 4, 16 === this.bitPP && this.is_with_alpha && (this.bitPP = 15), this.bitPP < 15) {
    var t2 = 0 === this.colors ? 1 << this.bitPP : this.colors;
    this.palette = new Array(t2);
    for (var e = 0; e < t2; e++) {
      var n = this.datav.getUint8(this.pos++, true), r = this.datav.getUint8(this.pos++, true), i2 = this.datav.getUint8(this.pos++, true), a2 = this.datav.getUint8(this.pos++, true);
      this.palette[e] = { red: i2, green: r, blue: n, quad: a2 };
    }
  }
  this.height < 0 && (this.height *= -1, this.bottom_up = false);
}, ce.prototype.parseBGR = function() {
  this.pos = this.offset;
  try {
    var t2 = "bit" + this.bitPP, e = this.width * this.height * 4;
    this.data = new Uint8Array(e), this[t2]();
  } catch (n) {
    o.log("bit decode error:" + n);
  }
}, ce.prototype.bit1 = function() {
  var t2, e = Math.ceil(this.width / 8), n = e % 4;
  for (t2 = this.height - 1; t2 >= 0; t2--) {
    for (var r = this.bottom_up ? t2 : this.height - 1 - t2, i2 = 0; i2 < e; i2++) for (var a2 = this.datav.getUint8(this.pos++, true), o2 = r * this.width * 4 + 8 * i2 * 4, s2 = 0; s2 < 8 && 8 * i2 + s2 < this.width; s2++) {
      var u2 = this.palette[a2 >> 7 - s2 & 1];
      this.data[o2 + 4 * s2] = u2.blue, this.data[o2 + 4 * s2 + 1] = u2.green, this.data[o2 + 4 * s2 + 2] = u2.red, this.data[o2 + 4 * s2 + 3] = 255;
    }
    0 !== n && (this.pos += 4 - n);
  }
}, ce.prototype.bit4 = function() {
  for (var t2 = Math.ceil(this.width / 2), e = t2 % 4, n = this.height - 1; n >= 0; n--) {
    for (var r = this.bottom_up ? n : this.height - 1 - n, i2 = 0; i2 < t2; i2++) {
      var a2 = this.datav.getUint8(this.pos++, true), o2 = r * this.width * 4 + 2 * i2 * 4, s2 = a2 >> 4, u2 = 15 & a2, c2 = this.palette[s2];
      if (this.data[o2] = c2.blue, this.data[o2 + 1] = c2.green, this.data[o2 + 2] = c2.red, this.data[o2 + 3] = 255, 2 * i2 + 1 >= this.width) break;
      c2 = this.palette[u2], this.data[o2 + 4] = c2.blue, this.data[o2 + 4 + 1] = c2.green, this.data[o2 + 4 + 2] = c2.red, this.data[o2 + 4 + 3] = 255;
    }
    0 !== e && (this.pos += 4 - e);
  }
}, ce.prototype.bit8 = function() {
  for (var t2 = this.width % 4, e = this.height - 1; e >= 0; e--) {
    for (var n = this.bottom_up ? e : this.height - 1 - e, r = 0; r < this.width; r++) {
      var i2 = this.datav.getUint8(this.pos++, true), a2 = n * this.width * 4 + 4 * r;
      if (i2 < this.palette.length) {
        var o2 = this.palette[i2];
        this.data[a2] = o2.red, this.data[a2 + 1] = o2.green, this.data[a2 + 2] = o2.blue, this.data[a2 + 3] = 255;
      } else this.data[a2] = 255, this.data[a2 + 1] = 255, this.data[a2 + 2] = 255, this.data[a2 + 3] = 255;
    }
    0 !== t2 && (this.pos += 4 - t2);
  }
}, ce.prototype.bit15 = function() {
  for (var t2 = this.width % 3, e = parseInt("11111", 2), n = this.height - 1; n >= 0; n--) {
    for (var r = this.bottom_up ? n : this.height - 1 - n, i2 = 0; i2 < this.width; i2++) {
      var a2 = this.datav.getUint16(this.pos, true);
      this.pos += 2;
      var o2 = (a2 & e) / e * 255 | 0, s2 = (a2 >> 5 & e) / e * 255 | 0, u2 = (a2 >> 10 & e) / e * 255 | 0, c2 = a2 >> 15 ? 255 : 0, l2 = r * this.width * 4 + 4 * i2;
      this.data[l2] = u2, this.data[l2 + 1] = s2, this.data[l2 + 2] = o2, this.data[l2 + 3] = c2;
    }
    this.pos += t2;
  }
}, ce.prototype.bit16 = function() {
  for (var t2 = this.width % 3, e = parseInt("11111", 2), n = parseInt("111111", 2), r = this.height - 1; r >= 0; r--) {
    for (var i2 = this.bottom_up ? r : this.height - 1 - r, a2 = 0; a2 < this.width; a2++) {
      var o2 = this.datav.getUint16(this.pos, true);
      this.pos += 2;
      var s2 = (o2 & e) / e * 255 | 0, u2 = (o2 >> 5 & n) / n * 255 | 0, c2 = (o2 >> 11) / e * 255 | 0, l2 = i2 * this.width * 4 + 4 * a2;
      this.data[l2] = c2, this.data[l2 + 1] = u2, this.data[l2 + 2] = s2, this.data[l2 + 3] = 255;
    }
    this.pos += t2;
  }
}, ce.prototype.bit24 = function() {
  for (var t2 = this.height - 1; t2 >= 0; t2--) {
    for (var e = this.bottom_up ? t2 : this.height - 1 - t2, n = 0; n < this.width; n++) {
      var r = this.datav.getUint8(this.pos++, true), i2 = this.datav.getUint8(this.pos++, true), a2 = this.datav.getUint8(this.pos++, true), o2 = e * this.width * 4 + 4 * n;
      this.data[o2] = a2, this.data[o2 + 1] = i2, this.data[o2 + 2] = r, this.data[o2 + 3] = 255;
    }
    this.pos += this.width % 4;
  }
}, ce.prototype.bit32 = function() {
  for (var t2 = this.height - 1; t2 >= 0; t2--) for (var e = this.bottom_up ? t2 : this.height - 1 - t2, n = 0; n < this.width; n++) {
    var r = this.datav.getUint8(this.pos++, true), i2 = this.datav.getUint8(this.pos++, true), a2 = this.datav.getUint8(this.pos++, true), o2 = this.datav.getUint8(this.pos++, true), s2 = e * this.width * 4 + 4 * n;
    this.data[s2] = a2, this.data[s2 + 1] = i2, this.data[s2 + 2] = r, this.data[s2 + 3] = o2;
  }
}, ce.prototype.getData = function() {
  return this.data;
}, /**
 * @license
 * Copyright (c) 2018 Aras Abbasi
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(t2) {
  t2.processBMP = function(e, n, r, i2) {
    var a2 = new ce(e, false), o2 = a2.width, s2 = a2.height, u2 = { data: a2.getData(), width: o2, height: s2 }, c2 = new ue(100).encode(u2, 100);
    return t2.processJPEG.call(this, c2, n, r, i2);
  };
}(E.API), le.prototype.getData = function() {
  return this.data;
}, /**
 * @license
 * Copyright (c) 2019 Aras Abbasi
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(t2) {
  t2.processWEBP = function(e, n, r, i2) {
    var a2 = new le(e), o2 = a2.width, s2 = a2.height, u2 = { data: a2.getData(), width: o2, height: s2 }, c2 = new ue(100).encode(u2, 100);
    return t2.processJPEG.call(this, c2, n, r, i2);
  };
}(E.API), E.API.processRGBA = function(t2, e, n) {
  for (var r = t2.data, i2 = r.length, a2 = new Uint8Array(i2 / 4 * 3), o2 = new Uint8Array(i2 / 4), s2 = 0, u2 = 0, c2 = 0; c2 < i2; c2 += 4) {
    var l2 = r[c2], h2 = r[c2 + 1], f2 = r[c2 + 2], d2 = r[c2 + 3];
    a2[s2++] = l2, a2[s2++] = h2, a2[s2++] = f2, o2[u2++] = d2;
  }
  var p2 = this.__addimage__.arrayBufferToBinaryString(a2);
  return { alpha: this.__addimage__.arrayBufferToBinaryString(o2), data: p2, index: e, alias: n, colorSpace: "DeviceRGB", bitsPerComponent: 8, width: t2.width, height: t2.height };
}, E.API.setLanguage = function(t2) {
  return void 0 === this.internal.languageSettings && (this.internal.languageSettings = {}, this.internal.languageSettings.isSubscribed = false), void 0 !== { af: "Afrikaans", sq: "Albanian", ar: "Arabic (Standard)", "ar-DZ": "Arabic (Algeria)", "ar-BH": "Arabic (Bahrain)", "ar-EG": "Arabic (Egypt)", "ar-IQ": "Arabic (Iraq)", "ar-JO": "Arabic (Jordan)", "ar-KW": "Arabic (Kuwait)", "ar-LB": "Arabic (Lebanon)", "ar-LY": "Arabic (Libya)", "ar-MA": "Arabic (Morocco)", "ar-OM": "Arabic (Oman)", "ar-QA": "Arabic (Qatar)", "ar-SA": "Arabic (Saudi Arabia)", "ar-SY": "Arabic (Syria)", "ar-TN": "Arabic (Tunisia)", "ar-AE": "Arabic (U.A.E.)", "ar-YE": "Arabic (Yemen)", an: "Aragonese", hy: "Armenian", as: "Assamese", ast: "Asturian", az: "Azerbaijani", eu: "Basque", be: "Belarusian", bn: "Bengali", bs: "Bosnian", br: "Breton", bg: "Bulgarian", my: "Burmese", ca: "Catalan", ch: "Chamorro", ce: "Chechen", zh: "Chinese", "zh-HK": "Chinese (Hong Kong)", "zh-CN": "Chinese (PRC)", "zh-SG": "Chinese (Singapore)", "zh-TW": "Chinese (Taiwan)", cv: "Chuvash", co: "Corsican", cr: "Cree", hr: "Croatian", cs: "Czech", da: "Danish", nl: "Dutch (Standard)", "nl-BE": "Dutch (Belgian)", en: "English", "en-AU": "English (Australia)", "en-BZ": "English (Belize)", "en-CA": "English (Canada)", "en-IE": "English (Ireland)", "en-JM": "English (Jamaica)", "en-NZ": "English (New Zealand)", "en-PH": "English (Philippines)", "en-ZA": "English (South Africa)", "en-TT": "English (Trinidad & Tobago)", "en-GB": "English (United Kingdom)", "en-US": "English (United States)", "en-ZW": "English (Zimbabwe)", eo: "Esperanto", et: "Estonian", fo: "Faeroese", fj: "Fijian", fi: "Finnish", fr: "French (Standard)", "fr-BE": "French (Belgium)", "fr-CA": "French (Canada)", "fr-FR": "French (France)", "fr-LU": "French (Luxembourg)", "fr-MC": "French (Monaco)", "fr-CH": "French (Switzerland)", fy: "Frisian", fur: "Friulian", gd: "Gaelic (Scots)", "gd-IE": "Gaelic (Irish)", gl: "Galacian", ka: "Georgian", de: "German (Standard)", "de-AT": "German (Austria)", "de-DE": "German (Germany)", "de-LI": "German (Liechtenstein)", "de-LU": "German (Luxembourg)", "de-CH": "German (Switzerland)", el: "Greek", gu: "Gujurati", ht: "Haitian", he: "Hebrew", hi: "Hindi", hu: "Hungarian", is: "Icelandic", id: "Indonesian", iu: "Inuktitut", ga: "Irish", it: "Italian (Standard)", "it-CH": "Italian (Switzerland)", ja: "Japanese", kn: "Kannada", ks: "Kashmiri", kk: "Kazakh", km: "Khmer", ky: "Kirghiz", tlh: "Klingon", ko: "Korean", "ko-KP": "Korean (North Korea)", "ko-KR": "Korean (South Korea)", la: "Latin", lv: "Latvian", lt: "Lithuanian", lb: "Luxembourgish", mk: "North Macedonia", ms: "Malay", ml: "Malayalam", mt: "Maltese", mi: "Maori", mr: "Marathi", mo: "Moldavian", nv: "Navajo", ng: "Ndonga", ne: "Nepali", no: "Norwegian", nb: "Norwegian (Bokmal)", nn: "Norwegian (Nynorsk)", oc: "Occitan", or: "Oriya", om: "Oromo", fa: "Persian", "fa-IR": "Persian/Iran", pl: "Polish", pt: "Portuguese", "pt-BR": "Portuguese (Brazil)", pa: "Punjabi", "pa-IN": "Punjabi (India)", "pa-PK": "Punjabi (Pakistan)", qu: "Quechua", rm: "Rhaeto-Romanic", ro: "Romanian", "ro-MO": "Romanian (Moldavia)", ru: "Russian", "ru-MO": "Russian (Moldavia)", sz: "Sami (Lappish)", sg: "Sango", sa: "Sanskrit", sc: "Sardinian", sd: "Sindhi", si: "Singhalese", sr: "Serbian", sk: "Slovak", sl: "Slovenian", so: "Somani", sb: "Sorbian", es: "Spanish", "es-AR": "Spanish (Argentina)", "es-BO": "Spanish (Bolivia)", "es-CL": "Spanish (Chile)", "es-CO": "Spanish (Colombia)", "es-CR": "Spanish (Costa Rica)", "es-DO": "Spanish (Dominican Republic)", "es-EC": "Spanish (Ecuador)", "es-SV": "Spanish (El Salvador)", "es-GT": "Spanish (Guatemala)", "es-HN": "Spanish (Honduras)", "es-MX": "Spanish (Mexico)", "es-NI": "Spanish (Nicaragua)", "es-PA": "Spanish (Panama)", "es-PY": "Spanish (Paraguay)", "es-PE": "Spanish (Peru)", "es-PR": "Spanish (Puerto Rico)", "es-ES": "Spanish (Spain)", "es-UY": "Spanish (Uruguay)", "es-VE": "Spanish (Venezuela)", sx: "Sutu", sw: "Swahili", sv: "Swedish", "sv-FI": "Swedish (Finland)", "sv-SV": "Swedish (Sweden)", ta: "Tamil", tt: "Tatar", te: "Teluga", th: "Thai", tig: "Tigre", ts: "Tsonga", tn: "Tswana", tr: "Turkish", tk: "Turkmen", uk: "Ukrainian", hsb: "Upper Sorbian", ur: "Urdu", ve: "Venda", vi: "Vietnamese", vo: "Volapuk", wa: "Walloon", cy: "Welsh", xh: "Xhosa", ji: "Yiddish", zu: "Zulu" }[t2] && (this.internal.languageSettings.languageCode = t2, false === this.internal.languageSettings.isSubscribed && (this.internal.events.subscribe("putCatalog", function() {
    this.internal.write("/Lang (" + this.internal.languageSettings.languageCode + ")");
  }), this.internal.languageSettings.isSubscribed = true)), this;
}, Ht = E.API, Wt = Ht.getCharWidthsArray = function(e, n) {
  var r, i2, a2 = (n = n || {}).font || this.internal.getFont(), o2 = n.fontSize || this.internal.getFontSize(), s2 = n.charSpace || this.internal.getCharSpace(), u2 = n.widths ? n.widths : a2.metadata.Unicode.widths, c2 = u2.fof ? u2.fof : 1, l2 = n.kerning ? n.kerning : a2.metadata.Unicode.kerning, h2 = l2.fof ? l2.fof : 1, f2 = false !== n.doKerning, d2 = 0, p2 = e.length, g2 = 0, m2 = u2[0] || c2, v2 = [];
  for (r = 0; r < p2; r++) i2 = e.charCodeAt(r), "function" == typeof a2.metadata.widthOfString ? v2.push((a2.metadata.widthOfGlyph(a2.metadata.characterToGlyph(i2)) + s2 * (1e3 / o2) || 0) / 1e3) : (d2 = f2 && "object" === _typeof(l2[i2]) && !isNaN(parseInt(l2[i2][g2], 10)) ? l2[i2][g2] / h2 : 0, v2.push((u2[i2] || m2) / c2 + d2)), g2 = i2;
  return v2;
}, Vt = Ht.getStringUnitWidth = function(t2, e) {
  var n = (e = e || {}).fontSize || this.internal.getFontSize(), r = e.font || this.internal.getFont(), i2 = e.charSpace || this.internal.getCharSpace();
  return Ht.processArabic && (t2 = Ht.processArabic(t2)), "function" == typeof r.metadata.widthOfString ? r.metadata.widthOfString(t2, n, i2) / n : Wt.apply(this, arguments).reduce(function(t3, e2) {
    return t3 + e2;
  }, 0);
}, Gt = function(t2, e, n, r) {
  for (var i2 = [], a2 = 0, o2 = t2.length, s2 = 0; a2 !== o2 && s2 + e[a2] < n; ) s2 += e[a2], a2++;
  i2.push(t2.slice(0, a2));
  var u2 = a2;
  for (s2 = 0; a2 !== o2; ) s2 + e[a2] > r && (i2.push(t2.slice(u2, a2)), s2 = 0, u2 = a2), s2 += e[a2], a2++;
  return u2 !== a2 && i2.push(t2.slice(u2, a2)), i2;
}, Yt = function(t2, e, n) {
  n || (n = {});
  var r, i2, a2, o2, s2, u2, c2, l2 = [], h2 = [l2], f2 = n.textIndent || 0, d2 = 0, p2 = 0, g2 = t2.split(" "), m2 = Wt.apply(this, [" ", n])[0];
  if (u2 = -1 === n.lineIndent ? g2[0].length + 2 : n.lineIndent || 0) {
    var v2 = Array(u2).join(" "), b2 = [];
    g2.map(function(t3) {
      (t3 = t3.split(/\s*\n/)).length > 1 ? b2 = b2.concat(t3.map(function(t4, e2) {
        return (e2 && t4.length ? "\n" : "") + t4;
      })) : b2.push(t3[0]);
    }), g2 = b2, u2 = Vt.apply(this, [v2, n]);
  }
  for (a2 = 0, o2 = g2.length; a2 < o2; a2++) {
    var y2 = 0;
    if (r = g2[a2], u2 && "\n" == r[0] && (r = r.substr(1), y2 = 1), f2 + d2 + (p2 = (i2 = Wt.apply(this, [r, n])).reduce(function(t3, e2) {
      return t3 + e2;
    }, 0)) > e || y2) {
      if (p2 > e) {
        for (s2 = Gt.apply(this, [r, i2, e - (f2 + d2), e]), l2.push(s2.shift()), l2 = [s2.pop()]; s2.length; ) h2.push([s2.shift()]);
        p2 = i2.slice(r.length - (l2[0] ? l2[0].length : 0)).reduce(function(t3, e2) {
          return t3 + e2;
        }, 0);
      } else l2 = [r];
      h2.push(l2), f2 = p2 + u2, d2 = m2;
    } else l2.push(r), f2 += d2 + p2, d2 = m2;
  }
  return c2 = u2 ? function(t3, e2) {
    return (e2 ? v2 : "") + t3.join(" ");
  } : function(t3) {
    return t3.join(" ");
  }, h2.map(c2);
}, Ht.splitTextToSize = function(t2, e, n) {
  var r, i2 = (n = n || {}).fontSize || this.internal.getFontSize(), a2 = (function(t3) {
    if (t3.widths && t3.kerning) return { widths: t3.widths, kerning: t3.kerning };
    var e2 = this.internal.getFont(t3.fontName, t3.fontStyle), n2 = "Unicode";
    return e2.metadata[n2] ? { widths: e2.metadata[n2].widths || { 0: 1 }, kerning: e2.metadata[n2].kerning || {} } : { font: e2.metadata, fontSize: this.internal.getFontSize(), charSpace: this.internal.getCharSpace() };
  }).call(this, n);
  r = Array.isArray(t2) ? t2 : String(t2).split(/\r?\n/);
  var o2 = 1 * this.internal.scaleFactor * e / i2;
  a2.textIndent = n.textIndent ? 1 * n.textIndent * this.internal.scaleFactor / i2 : 0, a2.lineIndent = n.lineIndent;
  var s2, u2, c2 = [];
  for (s2 = 0, u2 = r.length; s2 < u2; s2++) c2 = c2.concat(Yt.apply(this, [r[s2], o2, a2]));
  return c2;
}, function(e) {
  e.__fontmetrics__ = e.__fontmetrics__ || {};
  for (var n = "0123456789abcdef", r = "klmnopqrstuvwxyz", i2 = {}, a2 = {}, o2 = 0; o2 < 16; o2++) i2[r[o2]] = n[o2], a2[n[o2]] = r[o2];
  var s2 = function(t2) {
    return "0x" + parseInt(t2, 10).toString(16);
  }, u2 = e.__fontmetrics__.compress = function(e2) {
    var n2, r2, i3, o3, c3 = ["{"];
    for (var l3 in e2) {
      if (n2 = e2[l3], isNaN(parseInt(l3, 10)) ? r2 = "'" + l3 + "'" : (l3 = parseInt(l3, 10), r2 = (r2 = s2(l3).slice(2)).slice(0, -1) + a2[r2.slice(-1)]), "number" == typeof n2) n2 < 0 ? (i3 = s2(n2).slice(3), o3 = "-") : (i3 = s2(n2).slice(2), o3 = ""), i3 = o3 + i3.slice(0, -1) + a2[i3.slice(-1)];
      else {
        if ("object" !== _typeof(n2)) throw new Error("Don't know what to do with value type " + _typeof(n2) + ".");
        i3 = u2(n2);
      }
      c3.push(r2 + i3);
    }
    return c3.push("}"), c3.join("");
  }, c2 = e.__fontmetrics__.uncompress = function(t2) {
    if ("string" != typeof t2) throw new Error("Invalid argument passed to uncompress.");
    for (var e2, n2, r2, a3, o3 = {}, s3 = 1, u3 = o3, c3 = [], l3 = "", h3 = "", f3 = t2.length - 1, d2 = 1; d2 < f3; d2 += 1) "'" == (a3 = t2[d2]) ? e2 ? (r2 = e2.join(""), e2 = void 0) : e2 = [] : e2 ? e2.push(a3) : "{" == a3 ? (c3.push([u3, r2]), u3 = {}, r2 = void 0) : "}" == a3 ? ((n2 = c3.pop())[0][n2[1]] = u3, r2 = void 0, u3 = n2[0]) : "-" == a3 ? s3 = -1 : void 0 === r2 ? i2.hasOwnProperty(a3) ? (l3 += i2[a3], r2 = parseInt(l3, 16) * s3, s3 = 1, l3 = "") : l3 += a3 : i2.hasOwnProperty(a3) ? (h3 += i2[a3], u3[r2] = parseInt(h3, 16) * s3, s3 = 1, r2 = void 0, h3 = "") : h3 += a3;
    return o3;
  }, l2 = { codePages: ["WinAnsiEncoding"], WinAnsiEncoding: c2("{19m8n201n9q201o9r201s9l201t9m201u8m201w9n201x9o201y8o202k8q202l8r202m9p202q8p20aw8k203k8t203t8v203u9v2cq8s212m9t15m8w15n9w2dw9s16k8u16l9u17s9z17x8y17y9y}") }, h2 = { Unicode: { Courier: l2, "Courier-Bold": l2, "Courier-BoldOblique": l2, "Courier-Oblique": l2, Helvetica: l2, "Helvetica-Bold": l2, "Helvetica-BoldOblique": l2, "Helvetica-Oblique": l2, "Times-Roman": l2, "Times-Bold": l2, "Times-BoldItalic": l2, "Times-Italic": l2 } }, f2 = { Unicode: { "Courier-Oblique": c2("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"), "Times-BoldItalic": c2("{'widths'{k3o2q4ycx2r201n3m201o6o201s2l201t2l201u2l201w3m201x3m201y3m2k1t2l2r202m2n2n3m2o3m2p5n202q6o2r1w2s2l2t2l2u3m2v3t2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w3t3x3t3y3t3z3m4k5n4l4m4m4m4n4m4o4s4p4m4q4m4r4s4s4y4t2r4u3m4v4m4w3x4x5t4y4s4z4s5k3x5l4s5m4m5n3r5o3x5p4s5q4m5r5t5s4m5t3x5u3x5v2l5w1w5x2l5y3t5z3m6k2l6l3m6m3m6n2w6o3m6p2w6q2l6r3m6s3r6t1w6u1w6v3m6w1w6x4y6y3r6z3m7k3m7l3m7m2r7n2r7o1w7p3r7q2w7r4m7s3m7t2w7u2r7v2n7w1q7x2n7y3t202l3mcl4mal2ram3man3mao3map3mar3mas2lat4uau1uav3maw3way4uaz2lbk2sbl3t'fof'6obo2lbp3tbq3mbr1tbs2lbu1ybv3mbz3mck4m202k3mcm4mcn4mco4mcp4mcq5ycr4mcs4mct4mcu4mcv4mcw2r2m3rcy2rcz2rdl4sdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek3mel3mem3men3meo3mep3meq4ser2wes2wet2weu2wev2wew1wex1wey1wez1wfl3rfm3mfn3mfo3mfp3mfq3mfr3tfs3mft3rfu3rfv3rfw3rfz2w203k6o212m6o2dw2l2cq2l3t3m3u2l17s3x19m3m}'kerning'{cl{4qu5kt5qt5rs17ss5ts}201s{201ss}201t{cks4lscmscnscoscpscls2wu2yu201ts}201x{2wu2yu}2k{201ts}2w{4qx5kx5ou5qx5rs17su5tu}2x{17su5tu5ou}2y{4qx5kx5ou5qx5rs17ss5ts}'fof'-6ofn{17sw5tw5ou5qw5rs}7t{cksclscmscnscoscps4ls}3u{17su5tu5os5qs}3v{17su5tu5os5qs}7p{17su5tu}ck{4qu5kt5qt5rs17ss5ts}4l{4qu5kt5qt5rs17ss5ts}cm{4qu5kt5qt5rs17ss5ts}cn{4qu5kt5qt5rs17ss5ts}co{4qu5kt5qt5rs17ss5ts}cp{4qu5kt5qt5rs17ss5ts}6l{4qu5ou5qw5rt17su5tu}5q{ckuclucmucnucoucpu4lu}5r{ckuclucmucnucoucpu4lu}7q{cksclscmscnscoscps4ls}6p{4qu5ou5qw5rt17sw5tw}ek{4qu5ou5qw5rt17su5tu}el{4qu5ou5qw5rt17su5tu}em{4qu5ou5qw5rt17su5tu}en{4qu5ou5qw5rt17su5tu}eo{4qu5ou5qw5rt17su5tu}ep{4qu5ou5qw5rt17su5tu}es{17ss5ts5qs4qu}et{4qu5ou5qw5rt17sw5tw}eu{4qu5ou5qw5rt17ss5ts}ev{17ss5ts5qs4qu}6z{17sw5tw5ou5qw5rs}fm{17sw5tw5ou5qw5rs}7n{201ts}fo{17sw5tw5ou5qw5rs}fp{17sw5tw5ou5qw5rs}fq{17sw5tw5ou5qw5rs}7r{cksclscmscnscoscps4ls}fs{17sw5tw5ou5qw5rs}ft{17su5tu}fu{17su5tu}fv{17su5tu}fw{17su5tu}fz{cksclscmscnscoscps4ls}}}"), "Helvetica-Bold": c2("{'widths'{k3s2q4scx1w201n3r201o6o201s1w201t1w201u1w201w3m201x3m201y3m2k1w2l2l202m2n2n3r2o3r2p5t202q6o2r1s2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v2l3w3u3x3u3y3u3z3x4k6l4l4s4m4s4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3r4v4s4w3x4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v2l5w1w5x2l5y3u5z3r6k2l6l3r6m3x6n3r6o3x6p3r6q2l6r3x6s3x6t1w6u1w6v3r6w1w6x5t6y3x6z3x7k3x7l3x7m2r7n3r7o2l7p3x7q3r7r4y7s3r7t3r7u3m7v2r7w1w7x2r7y3u202l3rcl4sal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3xbq3rbr1wbs2lbu2obv3rbz3xck4s202k3rcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw1w2m2zcy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3res3ret3reu3rev3rew1wex1wey1wez1wfl3xfm3xfn3xfo3xfp3xfq3xfr3ufs3xft3xfu3xfv3xfw3xfz3r203k6o212m6o2dw2l2cq2l3t3r3u2l17s4m19m3r}'kerning'{cl{4qs5ku5ot5qs17sv5tv}201t{2ww4wy2yw}201w{2ks}201x{2ww4wy2yw}2k{201ts201xs}2w{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}2x{5ow5qs}2y{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}'fof'-6o7p{17su5tu5ot}ck{4qs5ku5ot5qs17sv5tv}4l{4qs5ku5ot5qs17sv5tv}cm{4qs5ku5ot5qs17sv5tv}cn{4qs5ku5ot5qs17sv5tv}co{4qs5ku5ot5qs17sv5tv}cp{4qs5ku5ot5qs17sv5tv}6l{17st5tt5os}17s{2kwclvcmvcnvcovcpv4lv4wwckv}5o{2kucltcmtcntcotcpt4lt4wtckt}5q{2ksclscmscnscoscps4ls4wvcks}5r{2ks4ws}5t{2kwclvcmvcnvcovcpv4lv4wwckv}eo{17st5tt5os}fu{17su5tu5ot}6p{17ss5ts}ek{17st5tt5os}el{17st5tt5os}em{17st5tt5os}en{17st5tt5os}6o{201ts}ep{17st5tt5os}es{17ss5ts}et{17ss5ts}eu{17ss5ts}ev{17ss5ts}6z{17su5tu5os5qt}fm{17su5tu5os5qt}fn{17su5tu5os5qt}fo{17su5tu5os5qt}fp{17su5tu5os5qt}fq{17su5tu5os5qt}fs{17su5tu5os5qt}ft{17su5tu5ot}7m{5os}fv{17su5tu5ot}fw{17su5tu5ot}}}"), Courier: c2("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"), "Courier-BoldOblique": c2("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"), "Times-Bold": c2("{'widths'{k3q2q5ncx2r201n3m201o6o201s2l201t2l201u2l201w3m201x3m201y3m2k1t2l2l202m2n2n3m2o3m2p6o202q6o2r1w2s2l2t2l2u3m2v3t2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w3t3x3t3y3t3z3m4k5x4l4s4m4m4n4s4o4s4p4m4q3x4r4y4s4y4t2r4u3m4v4y4w4m4x5y4y4s4z4y5k3x5l4y5m4s5n3r5o4m5p4s5q4s5r6o5s4s5t4s5u4m5v2l5w1w5x2l5y3u5z3m6k2l6l3m6m3r6n2w6o3r6p2w6q2l6r3m6s3r6t1w6u2l6v3r6w1w6x5n6y3r6z3m7k3r7l3r7m2w7n2r7o2l7p3r7q3m7r4s7s3m7t3m7u2w7v2r7w1q7x2r7y3o202l3mcl4sal2lam3man3mao3map3mar3mas2lat4uau1yav3maw3tay4uaz2lbk2sbl3t'fof'6obo2lbp3rbr1tbs2lbu2lbv3mbz3mck4s202k3mcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw2r2m3rcy2rcz2rdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3rek3mel3mem3men3meo3mep3meq4ser2wes2wet2weu2wev2wew1wex1wey1wez1wfl3rfm3mfn3mfo3mfp3mfq3mfr3tfs3mft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3m3u2l17s4s19m3m}'kerning'{cl{4qt5ks5ot5qy5rw17sv5tv}201t{cks4lscmscnscoscpscls4wv}2k{201ts}2w{4qu5ku7mu5os5qx5ru17su5tu}2x{17su5tu5ou5qs}2y{4qv5kv7mu5ot5qz5ru17su5tu}'fof'-6o7t{cksclscmscnscoscps4ls}3u{17su5tu5os5qu}3v{17su5tu5os5qu}fu{17su5tu5ou5qu}7p{17su5tu5ou5qu}ck{4qt5ks5ot5qy5rw17sv5tv}4l{4qt5ks5ot5qy5rw17sv5tv}cm{4qt5ks5ot5qy5rw17sv5tv}cn{4qt5ks5ot5qy5rw17sv5tv}co{4qt5ks5ot5qy5rw17sv5tv}cp{4qt5ks5ot5qy5rw17sv5tv}6l{17st5tt5ou5qu}17s{ckuclucmucnucoucpu4lu4wu}5o{ckuclucmucnucoucpu4lu4wu}5q{ckzclzcmzcnzcozcpz4lz4wu}5r{ckxclxcmxcnxcoxcpx4lx4wu}5t{ckuclucmucnucoucpu4lu4wu}7q{ckuclucmucnucoucpu4lu}6p{17sw5tw5ou5qu}ek{17st5tt5qu}el{17st5tt5ou5qu}em{17st5tt5qu}en{17st5tt5qu}eo{17st5tt5qu}ep{17st5tt5ou5qu}es{17ss5ts5qu}et{17sw5tw5ou5qu}eu{17sw5tw5ou5qu}ev{17ss5ts5qu}6z{17sw5tw5ou5qu5rs}fm{17sw5tw5ou5qu5rs}fn{17sw5tw5ou5qu5rs}fo{17sw5tw5ou5qu5rs}fp{17sw5tw5ou5qu5rs}fq{17sw5tw5ou5qu5rs}7r{cktcltcmtcntcotcpt4lt5os}fs{17sw5tw5ou5qu5rs}ft{17su5tu5ou5qu}7m{5os}fv{17su5tu5ou5qu}fw{17su5tu5ou5qu}fz{cksclscmscnscoscps4ls}}}"), Symbol: c2("{'widths'{k3uaw4r19m3m2k1t2l2l202m2y2n3m2p5n202q6o3k3m2s2l2t2l2v3r2w1t3m3m2y1t2z1wbk2sbl3r'fof'6o3n3m3o3m3p3m3q3m3r3m3s3m3t3m3u1w3v1w3w3r3x3r3y3r3z2wbp3t3l3m5v2l5x2l5z3m2q4yfr3r7v3k7w1o7x3k}'kerning'{'fof'-6o}}"), Helvetica: c2("{'widths'{k3p2q4mcx1w201n3r201o6o201s1q201t1q201u1q201w2l201x2l201y2l2k1w2l1w202m2n2n3r2o3r2p5t202q6o2r1n2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v1w3w3u3x3u3y3u3z3r4k6p4l4m4m4m4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3m4v4m4w3r4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v1w5w1w5x1w5y2z5z3r6k2l6l3r6m3r6n3m6o3r6p3r6q1w6r3r6s3r6t1q6u1q6v3m6w1q6x5n6y3r6z3r7k3r7l3r7m2l7n3m7o1w7p3r7q3m7r4s7s3m7t3m7u3m7v2l7w1u7x2l7y3u202l3rcl4mal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3rbr1wbs2lbu2obv3rbz3xck4m202k3rcm4mcn4mco4mcp4mcq6ocr4scs4mct4mcu4mcv4mcw1w2m2ncy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3mes3ret3reu3rev3rew1wex1wey1wez1wfl3rfm3rfn3rfo3rfp3rfq3rfr3ufs3xft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3r3u1w17s4m19m3r}'kerning'{5q{4wv}cl{4qs5kw5ow5qs17sv5tv}201t{2wu4w1k2yu}201x{2wu4wy2yu}17s{2ktclucmucnu4otcpu4lu4wycoucku}2w{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}2x{17sy5ty5oy5qs}2y{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}'fof'-6o7p{17sv5tv5ow}ck{4qs5kw5ow5qs17sv5tv}4l{4qs5kw5ow5qs17sv5tv}cm{4qs5kw5ow5qs17sv5tv}cn{4qs5kw5ow5qs17sv5tv}co{4qs5kw5ow5qs17sv5tv}cp{4qs5kw5ow5qs17sv5tv}6l{17sy5ty5ow}do{17st5tt}4z{17st5tt}7s{fst}dm{17st5tt}dn{17st5tt}5o{ckwclwcmwcnwcowcpw4lw4wv}dp{17st5tt}dq{17st5tt}7t{5ow}ds{17st5tt}5t{2ktclucmucnu4otcpu4lu4wycoucku}fu{17sv5tv5ow}6p{17sy5ty5ow5qs}ek{17sy5ty5ow}el{17sy5ty5ow}em{17sy5ty5ow}en{5ty}eo{17sy5ty5ow}ep{17sy5ty5ow}es{17sy5ty5qs}et{17sy5ty5ow5qs}eu{17sy5ty5ow5qs}ev{17sy5ty5ow5qs}6z{17sy5ty5ow5qs}fm{17sy5ty5ow5qs}fn{17sy5ty5ow5qs}fo{17sy5ty5ow5qs}fp{17sy5ty5qs}fq{17sy5ty5ow5qs}7r{5ow}fs{17sy5ty5ow5qs}ft{17sv5tv5ow}7m{5ow}fv{17sv5tv5ow}fw{17sv5tv5ow}}}"), "Helvetica-BoldOblique": c2("{'widths'{k3s2q4scx1w201n3r201o6o201s1w201t1w201u1w201w3m201x3m201y3m2k1w2l2l202m2n2n3r2o3r2p5t202q6o2r1s2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v2l3w3u3x3u3y3u3z3x4k6l4l4s4m4s4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3r4v4s4w3x4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v2l5w1w5x2l5y3u5z3r6k2l6l3r6m3x6n3r6o3x6p3r6q2l6r3x6s3x6t1w6u1w6v3r6w1w6x5t6y3x6z3x7k3x7l3x7m2r7n3r7o2l7p3x7q3r7r4y7s3r7t3r7u3m7v2r7w1w7x2r7y3u202l3rcl4sal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3xbq3rbr1wbs2lbu2obv3rbz3xck4s202k3rcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw1w2m2zcy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3res3ret3reu3rev3rew1wex1wey1wez1wfl3xfm3xfn3xfo3xfp3xfq3xfr3ufs3xft3xfu3xfv3xfw3xfz3r203k6o212m6o2dw2l2cq2l3t3r3u2l17s4m19m3r}'kerning'{cl{4qs5ku5ot5qs17sv5tv}201t{2ww4wy2yw}201w{2ks}201x{2ww4wy2yw}2k{201ts201xs}2w{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}2x{5ow5qs}2y{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}'fof'-6o7p{17su5tu5ot}ck{4qs5ku5ot5qs17sv5tv}4l{4qs5ku5ot5qs17sv5tv}cm{4qs5ku5ot5qs17sv5tv}cn{4qs5ku5ot5qs17sv5tv}co{4qs5ku5ot5qs17sv5tv}cp{4qs5ku5ot5qs17sv5tv}6l{17st5tt5os}17s{2kwclvcmvcnvcovcpv4lv4wwckv}5o{2kucltcmtcntcotcpt4lt4wtckt}5q{2ksclscmscnscoscps4ls4wvcks}5r{2ks4ws}5t{2kwclvcmvcnvcovcpv4lv4wwckv}eo{17st5tt5os}fu{17su5tu5ot}6p{17ss5ts}ek{17st5tt5os}el{17st5tt5os}em{17st5tt5os}en{17st5tt5os}6o{201ts}ep{17st5tt5os}es{17ss5ts}et{17ss5ts}eu{17ss5ts}ev{17ss5ts}6z{17su5tu5os5qt}fm{17su5tu5os5qt}fn{17su5tu5os5qt}fo{17su5tu5os5qt}fp{17su5tu5os5qt}fq{17su5tu5os5qt}fs{17su5tu5os5qt}ft{17su5tu5ot}7m{5os}fv{17su5tu5ot}fw{17su5tu5ot}}}"), ZapfDingbats: c2("{'widths'{k4u2k1w'fof'6o}'kerning'{'fof'-6o}}"), "Courier-Bold": c2("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"), "Times-Italic": c2("{'widths'{k3n2q4ycx2l201n3m201o5t201s2l201t2l201u2l201w3r201x3r201y3r2k1t2l2l202m2n2n3m2o3m2p5n202q5t2r1p2s2l2t2l2u3m2v4n2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w4n3x4n3y4n3z3m4k5w4l3x4m3x4n4m4o4s4p3x4q3x4r4s4s4s4t2l4u2w4v4m4w3r4x5n4y4m4z4s5k3x5l4s5m3x5n3m5o3r5p4s5q3x5r5n5s3x5t3r5u3r5v2r5w1w5x2r5y2u5z3m6k2l6l3m6m3m6n2w6o3m6p2w6q1w6r3m6s3m6t1w6u1w6v2w6w1w6x4s6y3m6z3m7k3m7l3m7m2r7n2r7o1w7p3m7q2w7r4m7s2w7t2w7u2r7v2s7w1v7x2s7y3q202l3mcl3xal2ram3man3mao3map3mar3mas2lat4wau1vav3maw4nay4waz2lbk2sbl4n'fof'6obo2lbp3mbq3obr1tbs2lbu1zbv3mbz3mck3x202k3mcm3xcn3xco3xcp3xcq5tcr4mcs3xct3xcu3xcv3xcw2l2m2ucy2lcz2ldl4mdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek3mel3mem3men3meo3mep3meq4mer2wes2wet2weu2wev2wew1wex1wey1wez1wfl3mfm3mfn3mfo3mfp3mfq3mfr4nfs3mft3mfu3mfv3mfw3mfz2w203k6o212m6m2dw2l2cq2l3t3m3u2l17s3r19m3m}'kerning'{cl{5kt4qw}201s{201sw}201t{201tw2wy2yy6q-t}201x{2wy2yy}2k{201tw}2w{7qs4qy7rs5ky7mw5os5qx5ru17su5tu}2x{17ss5ts5os}2y{7qs4qy7rs5ky7mw5os5qx5ru17su5tu}'fof'-6o6t{17ss5ts5qs}7t{5os}3v{5qs}7p{17su5tu5qs}ck{5kt4qw}4l{5kt4qw}cm{5kt4qw}cn{5kt4qw}co{5kt4qw}cp{5kt4qw}6l{4qs5ks5ou5qw5ru17su5tu}17s{2ks}5q{ckvclvcmvcnvcovcpv4lv}5r{ckuclucmucnucoucpu4lu}5t{2ks}6p{4qs5ks5ou5qw5ru17su5tu}ek{4qs5ks5ou5qw5ru17su5tu}el{4qs5ks5ou5qw5ru17su5tu}em{4qs5ks5ou5qw5ru17su5tu}en{4qs5ks5ou5qw5ru17su5tu}eo{4qs5ks5ou5qw5ru17su5tu}ep{4qs5ks5ou5qw5ru17su5tu}es{5ks5qs4qs}et{4qs5ks5ou5qw5ru17su5tu}eu{4qs5ks5qw5ru17su5tu}ev{5ks5qs4qs}ex{17ss5ts5qs}6z{4qv5ks5ou5qw5ru17su5tu}fm{4qv5ks5ou5qw5ru17su5tu}fn{4qv5ks5ou5qw5ru17su5tu}fo{4qv5ks5ou5qw5ru17su5tu}fp{4qv5ks5ou5qw5ru17su5tu}fq{4qv5ks5ou5qw5ru17su5tu}7r{5os}fs{4qv5ks5ou5qw5ru17su5tu}ft{17su5tu5qs}fu{17su5tu5qs}fv{17su5tu5qs}fw{17su5tu5qs}}}"), "Times-Roman": c2("{'widths'{k3n2q4ycx2l201n3m201o6o201s2l201t2l201u2l201w2w201x2w201y2w2k1t2l2l202m2n2n3m2o3m2p5n202q6o2r1m2s2l2t2l2u3m2v3s2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v1w3w3s3x3s3y3s3z2w4k5w4l4s4m4m4n4m4o4s4p3x4q3r4r4s4s4s4t2l4u2r4v4s4w3x4x5t4y4s4z4s5k3r5l4s5m4m5n3r5o3x5p4s5q4s5r5y5s4s5t4s5u3x5v2l5w1w5x2l5y2z5z3m6k2l6l2w6m3m6n2w6o3m6p2w6q2l6r3m6s3m6t1w6u1w6v3m6w1w6x4y6y3m6z3m7k3m7l3m7m2l7n2r7o1w7p3m7q3m7r4s7s3m7t3m7u2w7v3k7w1o7x3k7y3q202l3mcl4sal2lam3man3mao3map3mar3mas2lat4wau1vav3maw3say4waz2lbk2sbl3s'fof'6obo2lbp3mbq2xbr1tbs2lbu1zbv3mbz2wck4s202k3mcm4scn4sco4scp4scq5tcr4mcs3xct3xcu3xcv3xcw2l2m2tcy2lcz2ldl4sdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek2wel2wem2wen2weo2wep2weq4mer2wes2wet2weu2wev2wew1wex1wey1wez1wfl3mfm3mfn3mfo3mfp3mfq3mfr3sfs3mft3mfu3mfv3mfw3mfz3m203k6o212m6m2dw2l2cq2l3t3m3u1w17s4s19m3m}'kerning'{cl{4qs5ku17sw5ou5qy5rw201ss5tw201ws}201s{201ss}201t{ckw4lwcmwcnwcowcpwclw4wu201ts}2k{201ts}2w{4qs5kw5os5qx5ru17sx5tx}2x{17sw5tw5ou5qu}2y{4qs5kw5os5qx5ru17sx5tx}'fof'-6o7t{ckuclucmucnucoucpu4lu5os5rs}3u{17su5tu5qs}3v{17su5tu5qs}7p{17sw5tw5qs}ck{4qs5ku17sw5ou5qy5rw201ss5tw201ws}4l{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cm{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cn{4qs5ku17sw5ou5qy5rw201ss5tw201ws}co{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cp{4qs5ku17sw5ou5qy5rw201ss5tw201ws}6l{17su5tu5os5qw5rs}17s{2ktclvcmvcnvcovcpv4lv4wuckv}5o{ckwclwcmwcnwcowcpw4lw4wu}5q{ckyclycmycnycoycpy4ly4wu5ms}5r{cktcltcmtcntcotcpt4lt4ws}5t{2ktclvcmvcnvcovcpv4lv4wuckv}7q{cksclscmscnscoscps4ls}6p{17su5tu5qw5rs}ek{5qs5rs}el{17su5tu5os5qw5rs}em{17su5tu5os5qs5rs}en{17su5qs5rs}eo{5qs5rs}ep{17su5tu5os5qw5rs}es{5qs}et{17su5tu5qw5rs}eu{17su5tu5qs5rs}ev{5qs}6z{17sv5tv5os5qx5rs}fm{5os5qt5rs}fn{17sv5tv5os5qx5rs}fo{17sv5tv5os5qx5rs}fp{5os5qt5rs}fq{5os5qt5rs}7r{ckuclucmucnucoucpu4lu5os}fs{17sv5tv5os5qx5rs}ft{17ss5ts5qs}fu{17sw5tw5qs}fv{17sw5tw5qs}fw{17ss5ts5qs}fz{ckuclucmucnucoucpu4lu5os5rs}}}"), "Helvetica-Oblique": c2("{'widths'{k3p2q4mcx1w201n3r201o6o201s1q201t1q201u1q201w2l201x2l201y2l2k1w2l1w202m2n2n3r2o3r2p5t202q6o2r1n2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v1w3w3u3x3u3y3u3z3r4k6p4l4m4m4m4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3m4v4m4w3r4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v1w5w1w5x1w5y2z5z3r6k2l6l3r6m3r6n3m6o3r6p3r6q1w6r3r6s3r6t1q6u1q6v3m6w1q6x5n6y3r6z3r7k3r7l3r7m2l7n3m7o1w7p3r7q3m7r4s7s3m7t3m7u3m7v2l7w1u7x2l7y3u202l3rcl4mal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3rbr1wbs2lbu2obv3rbz3xck4m202k3rcm4mcn4mco4mcp4mcq6ocr4scs4mct4mcu4mcv4mcw1w2m2ncy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3mes3ret3reu3rev3rew1wex1wey1wez1wfl3rfm3rfn3rfo3rfp3rfq3rfr3ufs3xft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3r3u1w17s4m19m3r}'kerning'{5q{4wv}cl{4qs5kw5ow5qs17sv5tv}201t{2wu4w1k2yu}201x{2wu4wy2yu}17s{2ktclucmucnu4otcpu4lu4wycoucku}2w{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}2x{17sy5ty5oy5qs}2y{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}'fof'-6o7p{17sv5tv5ow}ck{4qs5kw5ow5qs17sv5tv}4l{4qs5kw5ow5qs17sv5tv}cm{4qs5kw5ow5qs17sv5tv}cn{4qs5kw5ow5qs17sv5tv}co{4qs5kw5ow5qs17sv5tv}cp{4qs5kw5ow5qs17sv5tv}6l{17sy5ty5ow}do{17st5tt}4z{17st5tt}7s{fst}dm{17st5tt}dn{17st5tt}5o{ckwclwcmwcnwcowcpw4lw4wv}dp{17st5tt}dq{17st5tt}7t{5ow}ds{17st5tt}5t{2ktclucmucnu4otcpu4lu4wycoucku}fu{17sv5tv5ow}6p{17sy5ty5ow5qs}ek{17sy5ty5ow}el{17sy5ty5ow}em{17sy5ty5ow}en{5ty}eo{17sy5ty5ow}ep{17sy5ty5ow}es{17sy5ty5qs}et{17sy5ty5ow5qs}eu{17sy5ty5ow5qs}ev{17sy5ty5ow5qs}6z{17sy5ty5ow5qs}fm{17sy5ty5ow5qs}fn{17sy5ty5ow5qs}fo{17sy5ty5ow5qs}fp{17sy5ty5qs}fq{17sy5ty5ow5qs}7r{5ow}fs{17sy5ty5ow5qs}ft{17sv5tv5ow}7m{5ow}fv{17sv5tv5ow}fw{17sv5tv5ow}}}") } };
  e.events.push(["addFont", function(t2) {
    var e2 = t2.font, n2 = f2.Unicode[e2.postScriptName];
    n2 && (e2.metadata.Unicode = {}, e2.metadata.Unicode.widths = n2.widths, e2.metadata.Unicode.kerning = n2.kerning);
    var r2 = h2.Unicode[e2.postScriptName];
    r2 && (e2.metadata.Unicode.encoding = r2, e2.encoding = r2.codePages[0]);
  }]);
}(E.API), /**
 * @license
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(t2) {
  var e = function(t3) {
    for (var e2 = t3.length, n = new Uint8Array(e2), r = 0; r < e2; r++) n[r] = t3.charCodeAt(r);
    return n;
  };
  t2.API.events.push(["addFont", function(n) {
    var r = void 0, i2 = n.font, a2 = n.instance;
    if (!i2.isStandardFont) {
      if (void 0 === a2) throw new Error("Font does not exist in vFS, import fonts or remove declaration doc.addFont('" + i2.postScriptName + "').");
      if ("string" != typeof (r = false === a2.existsFileInVFS(i2.postScriptName) ? a2.loadFile(i2.postScriptName) : a2.getFileFromVFS(i2.postScriptName))) throw new Error("Font is not stored as string-data in vFS, import fonts or remove declaration doc.addFont('" + i2.postScriptName + "').");
      !function(n2, r2) {
        r2 = /^\x00\x01\x00\x00/.test(r2) ? e(r2) : e(f(r2)), n2.metadata = t2.API.TTFFont.open(r2), n2.metadata.Unicode = n2.metadata.Unicode || { encoding: {}, kerning: {}, widths: [] }, n2.metadata.glyIdsUsed = [0];
      }(i2, r);
    }
  }]);
}(E), E.API.addSvgAsImage = function(t2, e, n, r, a2, s2, u2, c2) {
  if (isNaN(e) || isNaN(n)) throw o.error("jsPDF.addSvgAsImage: Invalid coordinates", arguments), new Error("Invalid coordinates passed to jsPDF.addSvgAsImage");
  if (isNaN(r) || isNaN(a2)) throw o.error("jsPDF.addSvgAsImage: Invalid measurements", arguments), new Error("Invalid measurements (width and/or height) passed to jsPDF.addSvgAsImage");
  var l2 = document.createElement("canvas");
  l2.width = r, l2.height = a2;
  var h2 = l2.getContext("2d");
  h2.fillStyle = "#fff", h2.fillRect(0, 0, l2.width, l2.height);
  var f2 = { ignoreMouse: true, ignoreAnimation: true, ignoreDimensions: true }, d2 = this;
  return (i.canvg ? Promise.resolve(i.canvg) : __vitePreload(() => import("./index.es-BZm2x08E.js"), true ? __vite__mapDeps([0,1,2,3,4]) : void 0)).catch(function(t3) {
    return Promise.reject(new Error("Could not load canvg: " + t3));
  }).then(function(t3) {
    return t3.default ? t3.default : t3;
  }).then(function(e2) {
    return e2.fromString(h2, t2, f2);
  }, function() {
    return Promise.reject(new Error("Could not load canvg."));
  }).then(function(t3) {
    return t3.render(f2);
  }).then(function() {
    d2.addImage(l2.toDataURL("image/jpeg", 1), e, n, r, a2, u2, c2);
  });
}, E.API.putTotalPages = function(t2) {
  var e, n = 0;
  parseInt(this.internal.getFont().id.substr(1), 10) < 15 ? (e = new RegExp(t2, "g"), n = this.internal.getNumberOfPages()) : (e = new RegExp(this.pdfEscape16(t2, this.internal.getFont()), "g"), n = this.pdfEscape16(this.internal.getNumberOfPages() + "", this.internal.getFont()));
  for (var r = 1; r <= this.internal.getNumberOfPages(); r++) for (var i2 = 0; i2 < this.internal.pages[r].length; i2++) this.internal.pages[r][i2] = this.internal.pages[r][i2].replace(e, n);
  return this;
}, E.API.viewerPreferences = function(e, n) {
  var r;
  e = e || {}, n = n || false;
  var i2, a2, o2, s2 = { HideToolbar: { defaultValue: false, value: false, type: "boolean", explicitSet: false, valueSet: [true, false], pdfVersion: 1.3 }, HideMenubar: { defaultValue: false, value: false, type: "boolean", explicitSet: false, valueSet: [true, false], pdfVersion: 1.3 }, HideWindowUI: { defaultValue: false, value: false, type: "boolean", explicitSet: false, valueSet: [true, false], pdfVersion: 1.3 }, FitWindow: { defaultValue: false, value: false, type: "boolean", explicitSet: false, valueSet: [true, false], pdfVersion: 1.3 }, CenterWindow: { defaultValue: false, value: false, type: "boolean", explicitSet: false, valueSet: [true, false], pdfVersion: 1.3 }, DisplayDocTitle: { defaultValue: false, value: false, type: "boolean", explicitSet: false, valueSet: [true, false], pdfVersion: 1.4 }, NonFullScreenPageMode: { defaultValue: "UseNone", value: "UseNone", type: "name", explicitSet: false, valueSet: ["UseNone", "UseOutlines", "UseThumbs", "UseOC"], pdfVersion: 1.3 }, Direction: { defaultValue: "L2R", value: "L2R", type: "name", explicitSet: false, valueSet: ["L2R", "R2L"], pdfVersion: 1.3 }, ViewArea: { defaultValue: "CropBox", value: "CropBox", type: "name", explicitSet: false, valueSet: ["MediaBox", "CropBox", "TrimBox", "BleedBox", "ArtBox"], pdfVersion: 1.4 }, ViewClip: { defaultValue: "CropBox", value: "CropBox", type: "name", explicitSet: false, valueSet: ["MediaBox", "CropBox", "TrimBox", "BleedBox", "ArtBox"], pdfVersion: 1.4 }, PrintArea: { defaultValue: "CropBox", value: "CropBox", type: "name", explicitSet: false, valueSet: ["MediaBox", "CropBox", "TrimBox", "BleedBox", "ArtBox"], pdfVersion: 1.4 }, PrintClip: { defaultValue: "CropBox", value: "CropBox", type: "name", explicitSet: false, valueSet: ["MediaBox", "CropBox", "TrimBox", "BleedBox", "ArtBox"], pdfVersion: 1.4 }, PrintScaling: { defaultValue: "AppDefault", value: "AppDefault", type: "name", explicitSet: false, valueSet: ["AppDefault", "None"], pdfVersion: 1.6 }, Duplex: { defaultValue: "", value: "none", type: "name", explicitSet: false, valueSet: ["Simplex", "DuplexFlipShortEdge", "DuplexFlipLongEdge", "none"], pdfVersion: 1.7 }, PickTrayByPDFSize: { defaultValue: false, value: false, type: "boolean", explicitSet: false, valueSet: [true, false], pdfVersion: 1.7 }, PrintPageRange: { defaultValue: "", value: "", type: "array", explicitSet: false, valueSet: null, pdfVersion: 1.7 }, NumCopies: { defaultValue: 1, value: 1, type: "integer", explicitSet: false, valueSet: null, pdfVersion: 1.7 } }, u2 = Object.keys(s2), c2 = [], l2 = 0, h2 = 0, f2 = 0;
  function d2(t2, e2) {
    var n2, r2 = false;
    for (n2 = 0; n2 < t2.length; n2 += 1) t2[n2] === e2 && (r2 = true);
    return r2;
  }
  if (void 0 === this.internal.viewerpreferences && (this.internal.viewerpreferences = {}, this.internal.viewerpreferences.configuration = JSON.parse(JSON.stringify(s2)), this.internal.viewerpreferences.isSubscribed = false), r = this.internal.viewerpreferences.configuration, "reset" === e || true === n) {
    var p2 = u2.length;
    for (f2 = 0; f2 < p2; f2 += 1) r[u2[f2]].value = r[u2[f2]].defaultValue, r[u2[f2]].explicitSet = false;
  }
  if ("object" === _typeof(e)) {
    for (a2 in e) if (o2 = e[a2], d2(u2, a2) && void 0 !== o2) {
      if ("boolean" === r[a2].type && "boolean" == typeof o2) r[a2].value = o2;
      else if ("name" === r[a2].type && d2(r[a2].valueSet, o2)) r[a2].value = o2;
      else if ("integer" === r[a2].type && Number.isInteger(o2)) r[a2].value = o2;
      else if ("array" === r[a2].type) {
        for (l2 = 0; l2 < o2.length; l2 += 1) if (i2 = true, 1 === o2[l2].length && "number" == typeof o2[l2][0]) c2.push(String(o2[l2] - 1));
        else if (o2[l2].length > 1) {
          for (h2 = 0; h2 < o2[l2].length; h2 += 1) "number" != typeof o2[l2][h2] && (i2 = false);
          true === i2 && c2.push([o2[l2][0] - 1, o2[l2][1] - 1].join(" "));
        }
        r[a2].value = "[" + c2.join(" ") + "]";
      } else r[a2].value = r[a2].defaultValue;
      r[a2].explicitSet = true;
    }
  }
  return false === this.internal.viewerpreferences.isSubscribed && (this.internal.events.subscribe("putCatalog", function() {
    var t2, e2 = [];
    for (t2 in r) true === r[t2].explicitSet && ("name" === r[t2].type ? e2.push("/" + t2 + " /" + r[t2].value) : e2.push("/" + t2 + " " + r[t2].value));
    0 !== e2.length && this.internal.write("/ViewerPreferences\n<<\n" + e2.join("\n") + "\n>>");
  }), this.internal.viewerpreferences.isSubscribed = true), this.internal.viewerpreferences.configuration = r, this;
}, /** ====================================================================
 * @license
 * jsPDF XMP metadata plugin
 * Copyright (c) 2016 Jussi Utunen, u-jussi@suomi24.fi
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * ====================================================================
 */
function(t2) {
  var e = function() {
    var t3 = '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description rdf:about="" xmlns:jspdf="' + this.internal.__metadata__.namespaceuri + '"><jspdf:metadata>', e2 = unescape(encodeURIComponent('<x:xmpmeta xmlns:x="adobe:ns:meta/">')), n2 = unescape(encodeURIComponent(t3)), r = unescape(encodeURIComponent(this.internal.__metadata__.metadata)), i2 = unescape(encodeURIComponent("</jspdf:metadata></rdf:Description></rdf:RDF>")), a2 = unescape(encodeURIComponent("</x:xmpmeta>")), o2 = n2.length + r.length + i2.length + e2.length + a2.length;
    this.internal.__metadata__.metadata_object_number = this.internal.newObject(), this.internal.write("<< /Type /Metadata /Subtype /XML /Length " + o2 + " >>"), this.internal.write("stream"), this.internal.write(e2 + n2 + r + i2 + a2), this.internal.write("endstream"), this.internal.write("endobj");
  }, n = function() {
    this.internal.__metadata__.metadata_object_number && this.internal.write("/Metadata " + this.internal.__metadata__.metadata_object_number + " 0 R");
  };
  t2.addMetadata = function(t3, r) {
    return void 0 === this.internal.__metadata__ && (this.internal.__metadata__ = { metadata: t3, namespaceuri: r || "http://jspdf.default.namespaceuri/" }, this.internal.events.subscribe("putCatalog", n), this.internal.events.subscribe("postPutResources", e)), this;
  };
}(E.API), function(t2) {
  var e = t2.API, n = e.pdfEscape16 = function(t3, e2) {
    for (var n2, r2 = e2.metadata.Unicode.widths, i3 = ["", "0", "00", "000", "0000"], a2 = [""], o2 = 0, s2 = t3.length; o2 < s2; ++o2) {
      if (n2 = e2.metadata.characterToGlyph(t3.charCodeAt(o2)), e2.metadata.glyIdsUsed.push(n2), e2.metadata.toUnicode[n2] = t3.charCodeAt(o2), -1 == r2.indexOf(n2) && (r2.push(n2), r2.push([parseInt(e2.metadata.widthOfGlyph(n2), 10)])), "0" == n2) return a2.join("");
      n2 = n2.toString(16), a2.push(i3[4 - n2.length], n2);
    }
    return a2.join("");
  }, r = function(t3) {
    var e2, n2, r2, i3, a2, o2, s2;
    for (a2 = "/CIDInit /ProcSet findresource begin\n12 dict begin\nbegincmap\n/CIDSystemInfo <<\n  /Registry (Adobe)\n  /Ordering (UCS)\n  /Supplement 0\n>> def\n/CMapName /Adobe-Identity-UCS def\n/CMapType 2 def\n1 begincodespacerange\n<0000><ffff>\nendcodespacerange", r2 = [], o2 = 0, s2 = (n2 = Object.keys(t3).sort(function(t4, e3) {
      return t4 - e3;
    })).length; o2 < s2; o2++) e2 = n2[o2], r2.length >= 100 && (a2 += "\n" + r2.length + " beginbfchar\n" + r2.join("\n") + "\nendbfchar", r2 = []), void 0 !== t3[e2] && null !== t3[e2] && "function" == typeof t3[e2].toString && (i3 = ("0000" + t3[e2].toString(16)).slice(-4), e2 = ("0000" + (+e2).toString(16)).slice(-4), r2.push("<" + e2 + "><" + i3 + ">"));
    return r2.length && (a2 += "\n" + r2.length + " beginbfchar\n" + r2.join("\n") + "\nendbfchar\n"), a2 + "endcmap\nCMapName currentdict /CMap defineresource pop\nend\nend";
  };
  e.events.push(["putFont", function(e2) {
    !function(e3) {
      var n2 = e3.font, i3 = e3.out, a2 = e3.newObject, o2 = e3.putStream;
      if (n2.metadata instanceof t2.API.TTFFont && "Identity-H" === n2.encoding) {
        for (var s2 = n2.metadata.Unicode.widths, u2 = n2.metadata.subset.encode(n2.metadata.glyIdsUsed, 1), c2 = "", l2 = 0; l2 < u2.length; l2++) c2 += String.fromCharCode(u2[l2]);
        var h2 = a2();
        o2({ data: c2, addLength1: true, objectId: h2 }), i3("endobj");
        var f2 = a2();
        o2({ data: r(n2.metadata.toUnicode), addLength1: true, objectId: f2 }), i3("endobj");
        var d2 = a2();
        i3("<<"), i3("/Type /FontDescriptor"), i3("/FontName /" + j(n2.fontName)), i3("/FontFile2 " + h2 + " 0 R"), i3("/FontBBox " + t2.API.PDFObject.convert(n2.metadata.bbox)), i3("/Flags " + n2.metadata.flags), i3("/StemV " + n2.metadata.stemV), i3("/ItalicAngle " + n2.metadata.italicAngle), i3("/Ascent " + n2.metadata.ascender), i3("/Descent " + n2.metadata.decender), i3("/CapHeight " + n2.metadata.capHeight), i3(">>"), i3("endobj");
        var p2 = a2();
        i3("<<"), i3("/Type /Font"), i3("/BaseFont /" + j(n2.fontName)), i3("/FontDescriptor " + d2 + " 0 R"), i3("/W " + t2.API.PDFObject.convert(s2)), i3("/CIDToGIDMap /Identity"), i3("/DW 1000"), i3("/Subtype /CIDFontType2"), i3("/CIDSystemInfo"), i3("<<"), i3("/Supplement 0"), i3("/Registry (Adobe)"), i3("/Ordering (" + n2.encoding + ")"), i3(">>"), i3(">>"), i3("endobj"), n2.objectNumber = a2(), i3("<<"), i3("/Type /Font"), i3("/Subtype /Type0"), i3("/ToUnicode " + f2 + " 0 R"), i3("/BaseFont /" + j(n2.fontName)), i3("/Encoding /" + n2.encoding), i3("/DescendantFonts [" + p2 + " 0 R]"), i3(">>"), i3("endobj"), n2.isAlreadyPutted = true;
      }
    }(e2);
  }]), e.events.push(["putFont", function(e2) {
    !function(e3) {
      var n2 = e3.font, i3 = e3.out, a2 = e3.newObject, o2 = e3.putStream;
      if (n2.metadata instanceof t2.API.TTFFont && "WinAnsiEncoding" === n2.encoding) {
        for (var s2 = n2.metadata.rawData, u2 = "", c2 = 0; c2 < s2.length; c2++) u2 += String.fromCharCode(s2[c2]);
        var l2 = a2();
        o2({ data: u2, addLength1: true, objectId: l2 }), i3("endobj");
        var h2 = a2();
        o2({ data: r(n2.metadata.toUnicode), addLength1: true, objectId: h2 }), i3("endobj");
        var f2 = a2();
        i3("<<"), i3("/Descent " + n2.metadata.decender), i3("/CapHeight " + n2.metadata.capHeight), i3("/StemV " + n2.metadata.stemV), i3("/Type /FontDescriptor"), i3("/FontFile2 " + l2 + " 0 R"), i3("/Flags 96"), i3("/FontBBox " + t2.API.PDFObject.convert(n2.metadata.bbox)), i3("/FontName /" + j(n2.fontName)), i3("/ItalicAngle " + n2.metadata.italicAngle), i3("/Ascent " + n2.metadata.ascender), i3(">>"), i3("endobj"), n2.objectNumber = a2();
        for (var d2 = 0; d2 < n2.metadata.hmtx.widths.length; d2++) n2.metadata.hmtx.widths[d2] = parseInt(n2.metadata.hmtx.widths[d2] * (1e3 / n2.metadata.head.unitsPerEm));
        i3("<</Subtype/TrueType/Type/Font/ToUnicode " + h2 + " 0 R/BaseFont/" + j(n2.fontName) + "/FontDescriptor " + f2 + " 0 R/Encoding/" + n2.encoding + " /FirstChar 29 /LastChar 255 /Widths " + t2.API.PDFObject.convert(n2.metadata.hmtx.widths) + ">>"), i3("endobj"), n2.isAlreadyPutted = true;
      }
    }(e2);
  }]);
  var i2 = function(t3) {
    var e2, r2 = t3.text || "", i3 = t3.x, a2 = t3.y, o2 = t3.options || {}, s2 = t3.mutex || {}, u2 = s2.pdfEscape, c2 = s2.activeFontKey, l2 = s2.fonts, h2 = c2, f2 = "", d2 = 0, p2 = "", g2 = l2[h2].encoding;
    if ("Identity-H" !== l2[h2].encoding) return { text: r2, x: i3, y: a2, options: o2, mutex: s2 };
    for (p2 = r2, h2 = c2, Array.isArray(r2) && (p2 = r2[0]), d2 = 0; d2 < p2.length; d2 += 1) l2[h2].metadata.hasOwnProperty("cmap") && (e2 = l2[h2].metadata.cmap.unicode.codeMap[p2[d2].charCodeAt(0)]), e2 || p2[d2].charCodeAt(0) < 256 && l2[h2].metadata.hasOwnProperty("Unicode") ? f2 += p2[d2] : f2 += "";
    var m2 = "";
    return parseInt(h2.slice(1)) < 14 || "WinAnsiEncoding" === g2 ? m2 = u2(f2, h2).split("").map(function(t4) {
      return t4.charCodeAt(0).toString(16);
    }).join("") : "Identity-H" === g2 && (m2 = n(f2, l2[h2])), s2.isHex = true, { text: m2, x: i3, y: a2, options: o2, mutex: s2 };
  };
  e.events.push(["postProcessText", function(t3) {
    var e2 = t3.text || "", n2 = [], r2 = { text: e2, x: t3.x, y: t3.y, options: t3.options, mutex: t3.mutex };
    if (Array.isArray(e2)) {
      var a2 = 0;
      for (a2 = 0; a2 < e2.length; a2 += 1) Array.isArray(e2[a2]) && 3 === e2[a2].length ? n2.push([i2(Object.assign({}, r2, { text: e2[a2][0] })).text, e2[a2][1], e2[a2][2]]) : n2.push(i2(Object.assign({}, r2, { text: e2[a2] })).text);
      t3.text = n2;
    } else t3.text = i2(Object.assign({}, r2, { text: e2 })).text;
  }]);
}(E), /**
 * @license
 * jsPDF virtual FileSystem functionality
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(t2) {
  var e = function() {
    return void 0 === this.internal.vFS && (this.internal.vFS = {}), true;
  };
  t2.existsFileInVFS = function(t3) {
    return e.call(this), void 0 !== this.internal.vFS[t3];
  }, t2.addFileToVFS = function(t3, n) {
    return e.call(this), this.internal.vFS[t3] = n, this;
  }, t2.getFileFromVFS = function(t3) {
    return e.call(this), void 0 !== this.internal.vFS[t3] ? this.internal.vFS[t3] : null;
  };
}(E.API), /**
 * @license
 * Unicode Bidi Engine based on the work of Alex Shensis (@asthensis)
 * MIT License
 */
function(t2) {
  t2.__bidiEngine__ = t2.prototype.__bidiEngine__ = function(t3) {
    var n2, r, i2, a2, o2, s2, u2, c2 = e, l2 = [[0, 3, 0, 1, 0, 0, 0], [0, 3, 0, 1, 2, 2, 0], [0, 3, 0, 17, 2, 0, 1], [0, 3, 5, 5, 4, 1, 0], [0, 3, 21, 21, 4, 0, 1], [0, 3, 5, 5, 4, 2, 0]], h2 = [[2, 0, 1, 1, 0, 1, 0], [2, 0, 1, 1, 0, 2, 0], [2, 0, 2, 1, 3, 2, 0], [2, 0, 2, 33, 3, 1, 1]], f2 = { L: 0, R: 1, EN: 2, AN: 3, N: 4, B: 5, S: 6 }, d2 = { 0: 0, 5: 1, 6: 2, 7: 3, 32: 4, 251: 5, 254: 6, 255: 7 }, p2 = ["(", ")", "(", "<", ">", "<", "[", "]", "[", "{", "}", "{", "«", "»", "«", "‹", "›", "‹", "⁅", "⁆", "⁅", "⁽", "⁾", "⁽", "₍", "₎", "₍", "≤", "≥", "≤", "〈", "〉", "〈", "﹙", "﹚", "﹙", "﹛", "﹜", "﹛", "﹝", "﹞", "﹝", "﹤", "﹥", "﹤"], g2 = new RegExp(/^([1-4|9]|1[0-9]|2[0-9]|3[0168]|4[04589]|5[012]|7[78]|159|16[0-9]|17[0-2]|21[569]|22[03489]|250)$/), m2 = false, v2 = 0;
    this.__bidiEngine__ = {};
    var b2 = function(t4) {
      var e2 = t4.charCodeAt(), n3 = e2 >> 8, r2 = d2[n3];
      return void 0 !== r2 ? c2[256 * r2 + (255 & e2)] : 252 === n3 || 253 === n3 ? "AL" : g2.test(n3) ? "L" : 8 === n3 ? "R" : "N";
    }, y2 = function(t4) {
      for (var e2, n3 = 0; n3 < t4.length; n3++) {
        if ("L" === (e2 = b2(t4.charAt(n3)))) return false;
        if ("R" === e2) return true;
      }
      return false;
    }, w2 = function(t4, e2, o3, s3) {
      var u3, c3, l3, h3, f3 = e2[s3];
      switch (f3) {
        case "L":
        case "R":
        case "LRE":
        case "RLE":
        case "LRO":
        case "RLO":
        case "PDF":
          m2 = false;
          break;
        case "N":
        case "AN":
          break;
        case "EN":
          m2 && (f3 = "AN");
          break;
        case "AL":
          m2 = true, f3 = "R";
          break;
        case "WS":
        case "BN":
          f3 = "N";
          break;
        case "CS":
          s3 < 1 || s3 + 1 >= e2.length || "EN" !== (u3 = o3[s3 - 1]) && "AN" !== u3 || "EN" !== (c3 = e2[s3 + 1]) && "AN" !== c3 ? f3 = "N" : m2 && (c3 = "AN"), f3 = c3 === u3 ? c3 : "N";
          break;
        case "ES":
          f3 = "EN" === (u3 = s3 > 0 ? o3[s3 - 1] : "B") && s3 + 1 < e2.length && "EN" === e2[s3 + 1] ? "EN" : "N";
          break;
        case "ET":
          if (s3 > 0 && "EN" === o3[s3 - 1]) {
            f3 = "EN";
            break;
          }
          if (m2) {
            f3 = "N";
            break;
          }
          for (l3 = s3 + 1, h3 = e2.length; l3 < h3 && "ET" === e2[l3]; ) l3++;
          f3 = l3 < h3 && "EN" === e2[l3] ? "EN" : "N";
          break;
        case "NSM":
          if (i2 && !a2) {
            for (h3 = e2.length, l3 = s3 + 1; l3 < h3 && "NSM" === e2[l3]; ) l3++;
            if (l3 < h3) {
              var d3 = t4[s3], p3 = d3 >= 1425 && d3 <= 2303 || 64286 === d3;
              if (u3 = e2[l3], p3 && ("R" === u3 || "AL" === u3)) {
                f3 = "R";
                break;
              }
            }
          }
          f3 = s3 < 1 || "B" === (u3 = e2[s3 - 1]) ? "N" : o3[s3 - 1];
          break;
        case "B":
          m2 = false, n2 = true, f3 = v2;
          break;
        case "S":
          r = true, f3 = "N";
      }
      return f3;
    }, N2 = function(t4, e2, n3) {
      var r2 = t4.split("");
      return n3 && L2(r2, n3, { hiLevel: v2 }), r2.reverse(), e2 && e2.reverse(), r2.join("");
    }, L2 = function(t4, e2, i3) {
      var a3, o3, s3, u3, c3, d3 = -1, p3 = t4.length, g3 = 0, y3 = [], N3 = v2 ? h2 : l2, L3 = [];
      for (m2 = false, n2 = false, r = false, o3 = 0; o3 < p3; o3++) L3[o3] = b2(t4[o3]);
      for (s3 = 0; s3 < p3; s3++) {
        if (c3 = g3, y3[s3] = w2(t4, L3, y3, s3), a3 = 240 & (g3 = N3[c3][f2[y3[s3]]]), g3 &= 15, e2[s3] = u3 = N3[g3][5], a3 > 0) if (16 === a3) {
          for (o3 = d3; o3 < s3; o3++) e2[o3] = 1;
          d3 = -1;
        } else d3 = -1;
        if (N3[g3][6]) -1 === d3 && (d3 = s3);
        else if (d3 > -1) {
          for (o3 = d3; o3 < s3; o3++) e2[o3] = u3;
          d3 = -1;
        }
        "B" === L3[s3] && (e2[s3] = 0), i3.hiLevel |= u3;
      }
      r && function(t5, e3, n3) {
        for (var r2 = 0; r2 < n3; r2++) if ("S" === t5[r2]) {
          e3[r2] = v2;
          for (var i4 = r2 - 1; i4 >= 0 && "WS" === t5[i4]; i4--) e3[i4] = v2;
        }
      }(L3, e2, p3);
    }, x2 = function(t4, e2, r2, i3, a3) {
      if (!(a3.hiLevel < t4)) {
        if (1 === t4 && 1 === v2 && !n2) return e2.reverse(), void (r2 && r2.reverse());
        for (var o3, s3, u3, c3, l3 = e2.length, h3 = 0; h3 < l3; ) {
          if (i3[h3] >= t4) {
            for (u3 = h3 + 1; u3 < l3 && i3[u3] >= t4; ) u3++;
            for (c3 = h3, s3 = u3 - 1; c3 < s3; c3++, s3--) o3 = e2[c3], e2[c3] = e2[s3], e2[s3] = o3, r2 && (o3 = r2[c3], r2[c3] = r2[s3], r2[s3] = o3);
            h3 = u3;
          }
          h3++;
        }
      }
    }, A2 = function(t4, e2, n3) {
      var r2 = t4.split(""), i3 = { hiLevel: v2 };
      return n3 || (n3 = []), L2(r2, n3, i3), function(t5, e3, n4) {
        if (0 !== n4.hiLevel && u2) for (var r3, i4 = 0; i4 < t5.length; i4++) 1 === e3[i4] && (r3 = p2.indexOf(t5[i4])) >= 0 && (t5[i4] = p2[r3 + 1]);
      }(r2, n3, i3), x2(2, r2, e2, n3, i3), x2(1, r2, e2, n3, i3), r2.join("");
    };
    return this.__bidiEngine__.doBidiReorder = function(t4, e2, n3) {
      if (function(t5, e3) {
        if (e3) for (var n4 = 0; n4 < t5.length; n4++) e3[n4] = n4;
        void 0 === a2 && (a2 = y2(t5)), void 0 === s2 && (s2 = y2(t5));
      }(t4, e2), i2 || !o2 || s2) if (i2 && o2 && a2 ^ s2) v2 = a2 ? 1 : 0, t4 = N2(t4, e2, n3);
      else if (!i2 && o2 && s2) v2 = a2 ? 1 : 0, t4 = A2(t4, e2, n3), t4 = N2(t4, e2);
      else if (!i2 || a2 || o2 || s2) {
        if (i2 && !o2 && a2 ^ s2) t4 = N2(t4, e2), a2 ? (v2 = 0, t4 = A2(t4, e2, n3)) : (v2 = 1, t4 = A2(t4, e2, n3), t4 = N2(t4, e2));
        else if (i2 && a2 && !o2 && s2) v2 = 1, t4 = A2(t4, e2, n3), t4 = N2(t4, e2);
        else if (!i2 && !o2 && a2 ^ s2) {
          var r2 = u2;
          a2 ? (v2 = 1, t4 = A2(t4, e2, n3), v2 = 0, u2 = false, t4 = A2(t4, e2, n3), u2 = r2) : (v2 = 0, t4 = A2(t4, e2, n3), t4 = N2(t4, e2), v2 = 1, u2 = false, t4 = A2(t4, e2, n3), u2 = r2, t4 = N2(t4, e2));
        }
      } else v2 = 0, t4 = A2(t4, e2, n3);
      else v2 = a2 ? 1 : 0, t4 = A2(t4, e2, n3);
      return t4;
    }, this.__bidiEngine__.setOptions = function(t4) {
      t4 && (i2 = t4.isInputVisual, o2 = t4.isOutputVisual, a2 = t4.isInputRtl, s2 = t4.isOutputRtl, u2 = t4.isSymmetricSwapping);
    }, this.__bidiEngine__.setOptions(t3), this.__bidiEngine__;
  };
  var e = ["BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "S", "B", "S", "WS", "B", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "B", "B", "B", "S", "WS", "N", "N", "ET", "ET", "ET", "N", "N", "N", "N", "N", "ES", "CS", "ES", "CS", "CS", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "CS", "N", "N", "N", "N", "N", "N", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "N", "N", "N", "N", "N", "N", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "N", "N", "N", "N", "BN", "BN", "BN", "BN", "BN", "BN", "B", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "CS", "N", "ET", "ET", "ET", "ET", "N", "N", "N", "N", "L", "N", "N", "BN", "N", "N", "ET", "ET", "EN", "EN", "N", "L", "N", "N", "N", "EN", "L", "N", "N", "N", "N", "N", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "N", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "N", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "N", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "N", "N", "L", "L", "L", "L", "L", "L", "L", "N", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "N", "L", "N", "N", "N", "N", "N", "ET", "N", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "R", "NSM", "R", "NSM", "NSM", "R", "NSM", "NSM", "R", "NSM", "N", "N", "N", "N", "N", "N", "N", "N", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "N", "N", "N", "N", "N", "R", "R", "R", "R", "R", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "AN", "AN", "AN", "AN", "AN", "AN", "N", "N", "AL", "ET", "ET", "AL", "CS", "AL", "N", "N", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "AL", "AL", "N", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "AN", "AN", "AN", "AN", "AN", "AN", "AN", "AN", "AN", "AN", "ET", "AN", "AN", "AL", "AL", "AL", "NSM", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "AN", "N", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "AL", "AL", "NSM", "NSM", "N", "NSM", "NSM", "NSM", "NSM", "AL", "AL", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "N", "AL", "AL", "NSM", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "N", "N", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "AL", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "R", "R", "N", "N", "N", "N", "R", "N", "N", "N", "N", "N", "WS", "WS", "WS", "WS", "WS", "WS", "WS", "WS", "WS", "WS", "WS", "BN", "BN", "BN", "L", "R", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "WS", "B", "LRE", "RLE", "PDF", "LRO", "RLO", "CS", "ET", "ET", "ET", "ET", "ET", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "CS", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "WS", "BN", "BN", "BN", "BN", "BN", "N", "LRI", "RLI", "FSI", "PDI", "BN", "BN", "BN", "BN", "BN", "BN", "EN", "L", "N", "N", "EN", "EN", "EN", "EN", "EN", "EN", "ES", "ES", "N", "N", "N", "L", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "ES", "ES", "N", "N", "N", "N", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "N", "N", "N", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "L", "L", "L", "L", "L", "L", "L", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "L", "L", "L", "L", "L", "N", "N", "N", "N", "N", "R", "NSM", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "ES", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "N", "R", "R", "R", "R", "R", "N", "R", "N", "R", "R", "N", "R", "R", "N", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "CS", "N", "CS", "N", "N", "CS", "N", "N", "N", "N", "N", "N", "N", "N", "N", "ET", "N", "N", "ES", "ES", "N", "N", "N", "N", "N", "ET", "ET", "N", "N", "N", "N", "N", "AL", "AL", "AL", "AL", "AL", "N", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "N", "N", "BN", "N", "N", "N", "ET", "ET", "ET", "N", "N", "N", "N", "N", "ES", "CS", "ES", "CS", "CS", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "CS", "N", "N", "N", "N", "N", "N", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "N", "N", "N", "N", "N", "N", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "N", "N", "N", "L", "L", "L", "L", "L", "L", "N", "N", "L", "L", "L", "L", "L", "L", "N", "N", "L", "L", "L", "L", "L", "L", "N", "N", "L", "L", "L", "N", "N", "N", "ET", "ET", "N", "N", "N", "ET", "ET", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N"], n = new t2.__bidiEngine__({ isInputVisual: true });
  t2.API.events.push(["postProcessText", function(t3) {
    var e2 = t3.text;
    t3.x, t3.y;
    var r = t3.options || {};
    t3.mutex, r.lang;
    var i2 = [];
    if (r.isInputVisual = "boolean" != typeof r.isInputVisual || r.isInputVisual, n.setOptions(r), "[object Array]" === Object.prototype.toString.call(e2)) {
      var a2 = 0;
      for (i2 = [], a2 = 0; a2 < e2.length; a2 += 1) "[object Array]" === Object.prototype.toString.call(e2[a2]) ? i2.push([n.doBidiReorder(e2[a2][0]), e2[a2][1], e2[a2][2]]) : i2.push([n.doBidiReorder(e2[a2])]);
      t3.text = i2;
    } else t3.text = n.doBidiReorder(e2);
    n.setOptions({ isInputVisual: true });
  }]);
}(E), E.API.TTFFont = function() {
  function t2(t3) {
    var e;
    if (this.rawData = t3, e = this.contents = new fe(t3), this.contents.pos = 4, "ttcf" === e.readString(4)) throw new Error("TTCF not supported.");
    e.pos = 0, this.parse(), this.subset = new je(this), this.registerTTF();
  }
  return t2.open = function(e) {
    return new t2(e);
  }, t2.prototype.parse = function() {
    return this.directory = new de(this.contents), this.head = new me(this), this.name = new xe(this), this.cmap = new be(this), this.toUnicode = {}, this.hhea = new ye(this), this.maxp = new Ae(this), this.hmtx = new Se(this), this.post = new Ne(this), this.os2 = new we(this), this.loca = new Ie(this), this.glyf = new Pe(this), this.ascender = this.os2.exists && this.os2.ascender || this.hhea.ascender, this.decender = this.os2.exists && this.os2.decender || this.hhea.decender, this.lineGap = this.os2.exists && this.os2.lineGap || this.hhea.lineGap, this.bbox = [this.head.xMin, this.head.yMin, this.head.xMax, this.head.yMax];
  }, t2.prototype.registerTTF = function() {
    var t3, e, n, r, i2;
    if (this.scaleFactor = 1e3 / this.head.unitsPerEm, this.bbox = (function() {
      var e2, n2, r2, i3;
      for (i3 = [], e2 = 0, n2 = (r2 = this.bbox).length; e2 < n2; e2++) t3 = r2[e2], i3.push(Math.round(t3 * this.scaleFactor));
      return i3;
    }).call(this), this.stemV = 0, this.post.exists ? (n = 255 & (r = this.post.italic_angle), 32768 & (e = r >> 16) && (e = -(1 + (65535 ^ e))), this.italicAngle = +(e + "." + n)) : this.italicAngle = 0, this.ascender = Math.round(this.ascender * this.scaleFactor), this.decender = Math.round(this.decender * this.scaleFactor), this.lineGap = Math.round(this.lineGap * this.scaleFactor), this.capHeight = this.os2.exists && this.os2.capHeight || this.ascender, this.xHeight = this.os2.exists && this.os2.xHeight || 0, this.familyClass = (this.os2.exists && this.os2.familyClass || 0) >> 8, this.isSerif = 1 === (i2 = this.familyClass) || 2 === i2 || 3 === i2 || 4 === i2 || 5 === i2 || 7 === i2, this.isScript = 10 === this.familyClass, this.flags = 0, this.post.isFixedPitch && (this.flags |= 1), this.isSerif && (this.flags |= 2), this.isScript && (this.flags |= 8), 0 !== this.italicAngle && (this.flags |= 64), this.flags |= 32, !this.cmap.unicode) throw new Error("No unicode cmap for font");
  }, t2.prototype.characterToGlyph = function(t3) {
    var e;
    return (null != (e = this.cmap.unicode) ? e.codeMap[t3] : void 0) || 0;
  }, t2.prototype.widthOfGlyph = function(t3) {
    var e;
    return e = 1e3 / this.head.unitsPerEm, this.hmtx.forGlyph(t3).advance * e;
  }, t2.prototype.widthOfString = function(t3, e, n) {
    var r, i2, a2, o2;
    for (a2 = 0, i2 = 0, o2 = (t3 = "" + t3).length; 0 <= o2 ? i2 < o2 : i2 > o2; i2 = 0 <= o2 ? ++i2 : --i2) r = t3.charCodeAt(i2), a2 += this.widthOfGlyph(this.characterToGlyph(r)) + n * (1e3 / e) || 0;
    return a2 * (e / 1e3);
  }, t2.prototype.lineHeight = function(t3, e) {
    var n;
    return null == e && (e = false), n = e ? this.lineGap : 0, (this.ascender + n - this.decender) / 1e3 * t3;
  }, t2;
}();
var he, fe = function() {
  function t2(t3) {
    this.data = null != t3 ? t3 : [], this.pos = 0, this.length = this.data.length;
  }
  return t2.prototype.readByte = function() {
    return this.data[this.pos++];
  }, t2.prototype.writeByte = function(t3) {
    return this.data[this.pos++] = t3;
  }, t2.prototype.readUInt32 = function() {
    return 16777216 * this.readByte() + (this.readByte() << 16) + (this.readByte() << 8) + this.readByte();
  }, t2.prototype.writeUInt32 = function(t3) {
    return this.writeByte(t3 >>> 24 & 255), this.writeByte(t3 >> 16 & 255), this.writeByte(t3 >> 8 & 255), this.writeByte(255 & t3);
  }, t2.prototype.readInt32 = function() {
    var t3;
    return (t3 = this.readUInt32()) >= 2147483648 ? t3 - 4294967296 : t3;
  }, t2.prototype.writeInt32 = function(t3) {
    return t3 < 0 && (t3 += 4294967296), this.writeUInt32(t3);
  }, t2.prototype.readUInt16 = function() {
    return this.readByte() << 8 | this.readByte();
  }, t2.prototype.writeUInt16 = function(t3) {
    return this.writeByte(t3 >> 8 & 255), this.writeByte(255 & t3);
  }, t2.prototype.readInt16 = function() {
    var t3;
    return (t3 = this.readUInt16()) >= 32768 ? t3 - 65536 : t3;
  }, t2.prototype.writeInt16 = function(t3) {
    return t3 < 0 && (t3 += 65536), this.writeUInt16(t3);
  }, t2.prototype.readString = function(t3) {
    var e, n;
    for (n = [], e = 0; 0 <= t3 ? e < t3 : e > t3; e = 0 <= t3 ? ++e : --e) n[e] = String.fromCharCode(this.readByte());
    return n.join("");
  }, t2.prototype.writeString = function(t3) {
    var e, n, r;
    for (r = [], e = 0, n = t3.length; 0 <= n ? e < n : e > n; e = 0 <= n ? ++e : --e) r.push(this.writeByte(t3.charCodeAt(e)));
    return r;
  }, t2.prototype.readShort = function() {
    return this.readInt16();
  }, t2.prototype.writeShort = function(t3) {
    return this.writeInt16(t3);
  }, t2.prototype.readLongLong = function() {
    var t3, e, n, r, i2, a2, o2, s2;
    return t3 = this.readByte(), e = this.readByte(), n = this.readByte(), r = this.readByte(), i2 = this.readByte(), a2 = this.readByte(), o2 = this.readByte(), s2 = this.readByte(), 128 & t3 ? -1 * (72057594037927940 * (255 ^ t3) + 281474976710656 * (255 ^ e) + 1099511627776 * (255 ^ n) + 4294967296 * (255 ^ r) + 16777216 * (255 ^ i2) + 65536 * (255 ^ a2) + 256 * (255 ^ o2) + (255 ^ s2) + 1) : 72057594037927940 * t3 + 281474976710656 * e + 1099511627776 * n + 4294967296 * r + 16777216 * i2 + 65536 * a2 + 256 * o2 + s2;
  }, t2.prototype.writeLongLong = function(t3) {
    var e, n;
    return e = Math.floor(t3 / 4294967296), n = 4294967295 & t3, this.writeByte(e >> 24 & 255), this.writeByte(e >> 16 & 255), this.writeByte(e >> 8 & 255), this.writeByte(255 & e), this.writeByte(n >> 24 & 255), this.writeByte(n >> 16 & 255), this.writeByte(n >> 8 & 255), this.writeByte(255 & n);
  }, t2.prototype.readInt = function() {
    return this.readInt32();
  }, t2.prototype.writeInt = function(t3) {
    return this.writeInt32(t3);
  }, t2.prototype.read = function(t3) {
    var e, n;
    for (e = [], n = 0; 0 <= t3 ? n < t3 : n > t3; n = 0 <= t3 ? ++n : --n) e.push(this.readByte());
    return e;
  }, t2.prototype.write = function(t3) {
    var e, n, r, i2;
    for (i2 = [], n = 0, r = t3.length; n < r; n++) e = t3[n], i2.push(this.writeByte(e));
    return i2;
  }, t2;
}(), de = function() {
  var t2;
  function e(t3) {
    var e2, n, r;
    for (this.scalarType = t3.readInt(), this.tableCount = t3.readShort(), this.searchRange = t3.readShort(), this.entrySelector = t3.readShort(), this.rangeShift = t3.readShort(), this.tables = {}, n = 0, r = this.tableCount; 0 <= r ? n < r : n > r; n = 0 <= r ? ++n : --n) e2 = { tag: t3.readString(4), checksum: t3.readInt(), offset: t3.readInt(), length: t3.readInt() }, this.tables[e2.tag] = e2;
  }
  return e.prototype.encode = function(e2) {
    var n, r, i2, a2, o2, s2, u2, c2, l2, h2, f2, d2, p2;
    for (p2 in f2 = Object.keys(e2).length, s2 = Math.log(2), l2 = 16 * Math.floor(Math.log(f2) / s2), a2 = Math.floor(l2 / s2), c2 = 16 * f2 - l2, (r = new fe()).writeInt(this.scalarType), r.writeShort(f2), r.writeShort(l2), r.writeShort(a2), r.writeShort(c2), i2 = 16 * f2, u2 = r.pos + i2, o2 = null, d2 = [], e2) for (h2 = e2[p2], r.writeString(p2), r.writeInt(t2(h2)), r.writeInt(u2), r.writeInt(h2.length), d2 = d2.concat(h2), "head" === p2 && (o2 = u2), u2 += h2.length; u2 % 4; ) d2.push(0), u2++;
    return r.write(d2), n = 2981146554 - t2(r.data), r.pos = o2 + 8, r.writeUInt32(n), r.data;
  }, t2 = function(t3) {
    var e2, n, r, i2;
    for (t3 = _e.call(t3); t3.length % 4; ) t3.push(0);
    for (r = new fe(t3), n = 0, e2 = 0, i2 = t3.length; e2 < i2; e2 = e2 += 4) n += r.readUInt32();
    return 4294967295 & n;
  }, e;
}(), pe = {}.hasOwnProperty, ge = function(t2, e) {
  for (var n in e) pe.call(e, n) && (t2[n] = e[n]);
  function r() {
    this.constructor = t2;
  }
  return r.prototype = e.prototype, t2.prototype = new r(), t2.__super__ = e.prototype, t2;
};
he = function() {
  function t2(t3) {
    var e;
    this.file = t3, e = this.file.directory.tables[this.tag], this.exists = !!e, e && (this.offset = e.offset, this.length = e.length, this.parse(this.file.contents));
  }
  return t2.prototype.parse = function() {
  }, t2.prototype.encode = function() {
  }, t2.prototype.raw = function() {
    return this.exists ? (this.file.contents.pos = this.offset, this.file.contents.read(this.length)) : null;
  }, t2;
}();
var me = function() {
  function t2() {
    return t2.__super__.constructor.apply(this, arguments);
  }
  return ge(t2, he), t2.prototype.tag = "head", t2.prototype.parse = function(t3) {
    return t3.pos = this.offset, this.version = t3.readInt(), this.revision = t3.readInt(), this.checkSumAdjustment = t3.readInt(), this.magicNumber = t3.readInt(), this.flags = t3.readShort(), this.unitsPerEm = t3.readShort(), this.created = t3.readLongLong(), this.modified = t3.readLongLong(), this.xMin = t3.readShort(), this.yMin = t3.readShort(), this.xMax = t3.readShort(), this.yMax = t3.readShort(), this.macStyle = t3.readShort(), this.lowestRecPPEM = t3.readShort(), this.fontDirectionHint = t3.readShort(), this.indexToLocFormat = t3.readShort(), this.glyphDataFormat = t3.readShort();
  }, t2.prototype.encode = function(t3) {
    var e;
    return (e = new fe()).writeInt(this.version), e.writeInt(this.revision), e.writeInt(this.checkSumAdjustment), e.writeInt(this.magicNumber), e.writeShort(this.flags), e.writeShort(this.unitsPerEm), e.writeLongLong(this.created), e.writeLongLong(this.modified), e.writeShort(this.xMin), e.writeShort(this.yMin), e.writeShort(this.xMax), e.writeShort(this.yMax), e.writeShort(this.macStyle), e.writeShort(this.lowestRecPPEM), e.writeShort(this.fontDirectionHint), e.writeShort(t3), e.writeShort(this.glyphDataFormat), e.data;
  }, t2;
}(), ve = function() {
  function t2(t3, e) {
    var n, r, i2, a2, o2, s2, u2, c2, l2, h2, f2, d2, p2, g2, m2, v2, b2;
    switch (this.platformID = t3.readUInt16(), this.encodingID = t3.readShort(), this.offset = e + t3.readInt(), l2 = t3.pos, t3.pos = this.offset, this.format = t3.readUInt16(), this.length = t3.readUInt16(), this.language = t3.readUInt16(), this.isUnicode = 3 === this.platformID && 1 === this.encodingID && 4 === this.format || 0 === this.platformID && 4 === this.format, this.codeMap = {}, this.format) {
      case 0:
        for (s2 = 0; s2 < 256; ++s2) this.codeMap[s2] = t3.readByte();
        break;
      case 4:
        for (f2 = t3.readUInt16(), h2 = f2 / 2, t3.pos += 6, i2 = function() {
          var e2, n2;
          for (n2 = [], s2 = e2 = 0; 0 <= h2 ? e2 < h2 : e2 > h2; s2 = 0 <= h2 ? ++e2 : --e2) n2.push(t3.readUInt16());
          return n2;
        }(), t3.pos += 2, p2 = function() {
          var e2, n2;
          for (n2 = [], s2 = e2 = 0; 0 <= h2 ? e2 < h2 : e2 > h2; s2 = 0 <= h2 ? ++e2 : --e2) n2.push(t3.readUInt16());
          return n2;
        }(), u2 = function() {
          var e2, n2;
          for (n2 = [], s2 = e2 = 0; 0 <= h2 ? e2 < h2 : e2 > h2; s2 = 0 <= h2 ? ++e2 : --e2) n2.push(t3.readUInt16());
          return n2;
        }(), c2 = function() {
          var e2, n2;
          for (n2 = [], s2 = e2 = 0; 0 <= h2 ? e2 < h2 : e2 > h2; s2 = 0 <= h2 ? ++e2 : --e2) n2.push(t3.readUInt16());
          return n2;
        }(), r = (this.length - t3.pos + this.offset) / 2, o2 = function() {
          var e2, n2;
          for (n2 = [], s2 = e2 = 0; 0 <= r ? e2 < r : e2 > r; s2 = 0 <= r ? ++e2 : --e2) n2.push(t3.readUInt16());
          return n2;
        }(), s2 = m2 = 0, b2 = i2.length; m2 < b2; s2 = ++m2) for (g2 = i2[s2], n = v2 = d2 = p2[s2]; d2 <= g2 ? v2 <= g2 : v2 >= g2; n = d2 <= g2 ? ++v2 : --v2) 0 === c2[s2] ? a2 = n + u2[s2] : 0 !== (a2 = o2[c2[s2] / 2 + (n - d2) - (h2 - s2)] || 0) && (a2 += u2[s2]), this.codeMap[n] = 65535 & a2;
    }
    t3.pos = l2;
  }
  return t2.encode = function(t3, e) {
    var n, r, i2, a2, o2, s2, u2, c2, l2, h2, f2, d2, p2, g2, m2, v2, b2, y2, w2, N2, L2, x2, A2, S2, _2, P2, k2, F2, I2, j2, C2, O2, B2, M2, q2, E2, R2, D2, T2, z2, U2, H2, W2, V2, G2, Y2;
    switch (F2 = new fe(), a2 = Object.keys(t3).sort(function(t4, e2) {
      return t4 - e2;
    }), e) {
      case "macroman":
        for (p2 = 0, g2 = function() {
          var t4 = [];
          for (d2 = 0; d2 < 256; ++d2) t4.push(0);
          return t4;
        }(), v2 = { 0: 0 }, i2 = {}, I2 = 0, B2 = a2.length; I2 < B2; I2++) null == v2[W2 = t3[r = a2[I2]]] && (v2[W2] = ++p2), i2[r] = { old: t3[r], new: v2[t3[r]] }, g2[r] = v2[t3[r]];
        return F2.writeUInt16(1), F2.writeUInt16(0), F2.writeUInt32(12), F2.writeUInt16(0), F2.writeUInt16(262), F2.writeUInt16(0), F2.write(g2), { charMap: i2, subtable: F2.data, maxGlyphID: p2 + 1 };
      case "unicode":
        for (P2 = [], l2 = [], b2 = 0, v2 = {}, n = {}, m2 = u2 = null, j2 = 0, M2 = a2.length; j2 < M2; j2++) null == v2[w2 = t3[r = a2[j2]]] && (v2[w2] = ++b2), n[r] = { old: w2, new: v2[w2] }, o2 = v2[w2] - r, null != m2 && o2 === u2 || (m2 && l2.push(m2), P2.push(r), u2 = o2), m2 = r;
        for (m2 && l2.push(m2), l2.push(65535), P2.push(65535), S2 = 2 * (A2 = P2.length), x2 = 2 * Math.pow(Math.log(A2) / Math.LN2, 2), h2 = Math.log(x2 / 2) / Math.LN2, L2 = 2 * A2 - x2, s2 = [], N2 = [], f2 = [], d2 = C2 = 0, q2 = P2.length; C2 < q2; d2 = ++C2) {
          if (_2 = P2[d2], c2 = l2[d2], 65535 === _2) {
            s2.push(0), N2.push(0);
            break;
          }
          if (_2 - (k2 = n[_2].new) >= 32768) for (s2.push(0), N2.push(2 * (f2.length + A2 - d2)), r = O2 = _2; _2 <= c2 ? O2 <= c2 : O2 >= c2; r = _2 <= c2 ? ++O2 : --O2) f2.push(n[r].new);
          else s2.push(k2 - _2), N2.push(0);
        }
        for (F2.writeUInt16(3), F2.writeUInt16(1), F2.writeUInt32(12), F2.writeUInt16(4), F2.writeUInt16(16 + 8 * A2 + 2 * f2.length), F2.writeUInt16(0), F2.writeUInt16(S2), F2.writeUInt16(x2), F2.writeUInt16(h2), F2.writeUInt16(L2), U2 = 0, E2 = l2.length; U2 < E2; U2++) r = l2[U2], F2.writeUInt16(r);
        for (F2.writeUInt16(0), H2 = 0, R2 = P2.length; H2 < R2; H2++) r = P2[H2], F2.writeUInt16(r);
        for (V2 = 0, D2 = s2.length; V2 < D2; V2++) o2 = s2[V2], F2.writeUInt16(o2);
        for (G2 = 0, T2 = N2.length; G2 < T2; G2++) y2 = N2[G2], F2.writeUInt16(y2);
        for (Y2 = 0, z2 = f2.length; Y2 < z2; Y2++) p2 = f2[Y2], F2.writeUInt16(p2);
        return { charMap: n, subtable: F2.data, maxGlyphID: b2 + 1 };
    }
  }, t2;
}(), be = function() {
  function t2() {
    return t2.__super__.constructor.apply(this, arguments);
  }
  return ge(t2, he), t2.prototype.tag = "cmap", t2.prototype.parse = function(t3) {
    var e, n, r;
    for (t3.pos = this.offset, this.version = t3.readUInt16(), r = t3.readUInt16(), this.tables = [], this.unicode = null, n = 0; 0 <= r ? n < r : n > r; n = 0 <= r ? ++n : --n) e = new ve(t3, this.offset), this.tables.push(e), e.isUnicode && null == this.unicode && (this.unicode = e);
    return true;
  }, t2.encode = function(t3, e) {
    var n, r;
    return null == e && (e = "macroman"), n = ve.encode(t3, e), (r = new fe()).writeUInt16(0), r.writeUInt16(1), n.table = r.data.concat(n.subtable), n;
  }, t2;
}(), ye = function() {
  function t2() {
    return t2.__super__.constructor.apply(this, arguments);
  }
  return ge(t2, he), t2.prototype.tag = "hhea", t2.prototype.parse = function(t3) {
    return t3.pos = this.offset, this.version = t3.readInt(), this.ascender = t3.readShort(), this.decender = t3.readShort(), this.lineGap = t3.readShort(), this.advanceWidthMax = t3.readShort(), this.minLeftSideBearing = t3.readShort(), this.minRightSideBearing = t3.readShort(), this.xMaxExtent = t3.readShort(), this.caretSlopeRise = t3.readShort(), this.caretSlopeRun = t3.readShort(), this.caretOffset = t3.readShort(), t3.pos += 8, this.metricDataFormat = t3.readShort(), this.numberOfMetrics = t3.readUInt16();
  }, t2;
}(), we = function() {
  function t2() {
    return t2.__super__.constructor.apply(this, arguments);
  }
  return ge(t2, he), t2.prototype.tag = "OS/2", t2.prototype.parse = function(t3) {
    if (t3.pos = this.offset, this.version = t3.readUInt16(), this.averageCharWidth = t3.readShort(), this.weightClass = t3.readUInt16(), this.widthClass = t3.readUInt16(), this.type = t3.readShort(), this.ySubscriptXSize = t3.readShort(), this.ySubscriptYSize = t3.readShort(), this.ySubscriptXOffset = t3.readShort(), this.ySubscriptYOffset = t3.readShort(), this.ySuperscriptXSize = t3.readShort(), this.ySuperscriptYSize = t3.readShort(), this.ySuperscriptXOffset = t3.readShort(), this.ySuperscriptYOffset = t3.readShort(), this.yStrikeoutSize = t3.readShort(), this.yStrikeoutPosition = t3.readShort(), this.familyClass = t3.readShort(), this.panose = function() {
      var e, n;
      for (n = [], e = 0; e < 10; ++e) n.push(t3.readByte());
      return n;
    }(), this.charRange = function() {
      var e, n;
      for (n = [], e = 0; e < 4; ++e) n.push(t3.readInt());
      return n;
    }(), this.vendorID = t3.readString(4), this.selection = t3.readShort(), this.firstCharIndex = t3.readShort(), this.lastCharIndex = t3.readShort(), this.version > 0 && (this.ascent = t3.readShort(), this.descent = t3.readShort(), this.lineGap = t3.readShort(), this.winAscent = t3.readShort(), this.winDescent = t3.readShort(), this.codePageRange = function() {
      var e, n;
      for (n = [], e = 0; e < 2; e = ++e) n.push(t3.readInt());
      return n;
    }(), this.version > 1)) return this.xHeight = t3.readShort(), this.capHeight = t3.readShort(), this.defaultChar = t3.readShort(), this.breakChar = t3.readShort(), this.maxContext = t3.readShort();
  }, t2;
}(), Ne = function() {
  function t2() {
    return t2.__super__.constructor.apply(this, arguments);
  }
  return ge(t2, he), t2.prototype.tag = "post", t2.prototype.parse = function(t3) {
    var e, n, r;
    switch (t3.pos = this.offset, this.format = t3.readInt(), this.italicAngle = t3.readInt(), this.underlinePosition = t3.readShort(), this.underlineThickness = t3.readShort(), this.isFixedPitch = t3.readInt(), this.minMemType42 = t3.readInt(), this.maxMemType42 = t3.readInt(), this.minMemType1 = t3.readInt(), this.maxMemType1 = t3.readInt(), this.format) {
      case 65536:
      case 196608:
        break;
      case 131072:
        var i2;
        for (n = t3.readUInt16(), this.glyphNameIndex = [], i2 = 0; 0 <= n ? i2 < n : i2 > n; i2 = 0 <= n ? ++i2 : --i2) this.glyphNameIndex.push(t3.readUInt16());
        for (this.names = [], r = []; t3.pos < this.offset + this.length; ) e = t3.readByte(), r.push(this.names.push(t3.readString(e)));
        return r;
      case 151552:
        return n = t3.readUInt16(), this.offsets = t3.read(n);
      case 262144:
        return this.map = (function() {
          var e2, n2, r2;
          for (r2 = [], i2 = e2 = 0, n2 = this.file.maxp.numGlyphs; 0 <= n2 ? e2 < n2 : e2 > n2; i2 = 0 <= n2 ? ++e2 : --e2) r2.push(t3.readUInt32());
          return r2;
        }).call(this);
    }
  }, t2;
}(), Le = function(t2, e) {
  this.raw = t2, this.length = t2.length, this.platformID = e.platformID, this.encodingID = e.encodingID, this.languageID = e.languageID;
}, xe = function() {
  function t2() {
    return t2.__super__.constructor.apply(this, arguments);
  }
  return ge(t2, he), t2.prototype.tag = "name", t2.prototype.parse = function(t3) {
    var e, n, r, i2, a2, o2, s2, u2, c2, l2, h2;
    for (t3.pos = this.offset, t3.readShort(), e = t3.readShort(), o2 = t3.readShort(), n = [], i2 = 0; 0 <= e ? i2 < e : i2 > e; i2 = 0 <= e ? ++i2 : --i2) n.push({ platformID: t3.readShort(), encodingID: t3.readShort(), languageID: t3.readShort(), nameID: t3.readShort(), length: t3.readShort(), offset: this.offset + o2 + t3.readShort() });
    for (s2 = {}, i2 = c2 = 0, l2 = n.length; c2 < l2; i2 = ++c2) r = n[i2], t3.pos = r.offset, u2 = t3.readString(r.length), a2 = new Le(u2, r), null == s2[h2 = r.nameID] && (s2[h2] = []), s2[r.nameID].push(a2);
    this.strings = s2, this.copyright = s2[0], this.fontFamily = s2[1], this.fontSubfamily = s2[2], this.uniqueSubfamily = s2[3], this.fontName = s2[4], this.version = s2[5];
    try {
      this.postscriptName = s2[6][0].raw.replace(/[\x00-\x19\x80-\xff]/g, "");
    } catch (f2) {
      this.postscriptName = s2[4][0].raw.replace(/[\x00-\x19\x80-\xff]/g, "");
    }
    return this.trademark = s2[7], this.manufacturer = s2[8], this.designer = s2[9], this.description = s2[10], this.vendorUrl = s2[11], this.designerUrl = s2[12], this.license = s2[13], this.licenseUrl = s2[14], this.preferredFamily = s2[15], this.preferredSubfamily = s2[17], this.compatibleFull = s2[18], this.sampleText = s2[19];
  }, t2;
}(), Ae = function() {
  function t2() {
    return t2.__super__.constructor.apply(this, arguments);
  }
  return ge(t2, he), t2.prototype.tag = "maxp", t2.prototype.parse = function(t3) {
    return t3.pos = this.offset, this.version = t3.readInt(), this.numGlyphs = t3.readUInt16(), this.maxPoints = t3.readUInt16(), this.maxContours = t3.readUInt16(), this.maxCompositePoints = t3.readUInt16(), this.maxComponentContours = t3.readUInt16(), this.maxZones = t3.readUInt16(), this.maxTwilightPoints = t3.readUInt16(), this.maxStorage = t3.readUInt16(), this.maxFunctionDefs = t3.readUInt16(), this.maxInstructionDefs = t3.readUInt16(), this.maxStackElements = t3.readUInt16(), this.maxSizeOfInstructions = t3.readUInt16(), this.maxComponentElements = t3.readUInt16(), this.maxComponentDepth = t3.readUInt16();
  }, t2;
}(), Se = function() {
  function t2() {
    return t2.__super__.constructor.apply(this, arguments);
  }
  return ge(t2, he), t2.prototype.tag = "hmtx", t2.prototype.parse = function(t3) {
    var e, n, r, i2, a2, o2, s2;
    for (t3.pos = this.offset, this.metrics = [], e = 0, o2 = this.file.hhea.numberOfMetrics; 0 <= o2 ? e < o2 : e > o2; e = 0 <= o2 ? ++e : --e) this.metrics.push({ advance: t3.readUInt16(), lsb: t3.readInt16() });
    for (r = this.file.maxp.numGlyphs - this.file.hhea.numberOfMetrics, this.leftSideBearings = function() {
      var n2, i3;
      for (i3 = [], e = n2 = 0; 0 <= r ? n2 < r : n2 > r; e = 0 <= r ? ++n2 : --n2) i3.push(t3.readInt16());
      return i3;
    }(), this.widths = (function() {
      var t4, e2, n2, r2;
      for (r2 = [], t4 = 0, e2 = (n2 = this.metrics).length; t4 < e2; t4++) i2 = n2[t4], r2.push(i2.advance);
      return r2;
    }).call(this), n = this.widths[this.widths.length - 1], s2 = [], e = a2 = 0; 0 <= r ? a2 < r : a2 > r; e = 0 <= r ? ++a2 : --a2) s2.push(this.widths.push(n));
    return s2;
  }, t2.prototype.forGlyph = function(t3) {
    return t3 in this.metrics ? this.metrics[t3] : { advance: this.metrics[this.metrics.length - 1].advance, lsb: this.leftSideBearings[t3 - this.metrics.length] };
  }, t2;
}(), _e = [].slice, Pe = function() {
  function t2() {
    return t2.__super__.constructor.apply(this, arguments);
  }
  return ge(t2, he), t2.prototype.tag = "glyf", t2.prototype.parse = function() {
    return this.cache = {};
  }, t2.prototype.glyphFor = function(t3) {
    var e, n, r, i2, a2, o2, s2, u2, c2, l2;
    return t3 in this.cache ? this.cache[t3] : (i2 = this.file.loca, e = this.file.contents, n = i2.indexOf(t3), 0 === (r = i2.lengthOf(t3)) ? this.cache[t3] = null : (e.pos = this.offset + n, a2 = (o2 = new fe(e.read(r))).readShort(), u2 = o2.readShort(), l2 = o2.readShort(), s2 = o2.readShort(), c2 = o2.readShort(), this.cache[t3] = -1 === a2 ? new Fe(o2, u2, l2, s2, c2) : new ke(o2, a2, u2, l2, s2, c2), this.cache[t3]));
  }, t2.prototype.encode = function(t3, e, n) {
    var r, i2, a2, o2, s2;
    for (a2 = [], i2 = [], o2 = 0, s2 = e.length; o2 < s2; o2++) r = t3[e[o2]], i2.push(a2.length), r && (a2 = a2.concat(r.encode(n)));
    return i2.push(a2.length), { table: a2, offsets: i2 };
  }, t2;
}(), ke = function() {
  function t2(t3, e, n, r, i2, a2) {
    this.raw = t3, this.numberOfContours = e, this.xMin = n, this.yMin = r, this.xMax = i2, this.yMax = a2, this.compound = false;
  }
  return t2.prototype.encode = function() {
    return this.raw.data;
  }, t2;
}(), Fe = function() {
  function t2(t3, e, n, r, i2) {
    var a2, o2;
    for (this.raw = t3, this.xMin = e, this.yMin = n, this.xMax = r, this.yMax = i2, this.compound = true, this.glyphIDs = [], this.glyphOffsets = [], a2 = this.raw; o2 = a2.readShort(), this.glyphOffsets.push(a2.pos), this.glyphIDs.push(a2.readUInt16()), 32 & o2; ) a2.pos += 1 & o2 ? 4 : 2, 128 & o2 ? a2.pos += 8 : 64 & o2 ? a2.pos += 4 : 8 & o2 && (a2.pos += 2);
  }
  return t2.prototype.encode = function() {
    var t3, e, n;
    for (e = new fe(_e.call(this.raw.data)), t3 = 0, n = this.glyphIDs.length; t3 < n; ++t3) e.pos = this.glyphOffsets[t3];
    return e.data;
  }, t2;
}(), Ie = function() {
  function t2() {
    return t2.__super__.constructor.apply(this, arguments);
  }
  return ge(t2, he), t2.prototype.tag = "loca", t2.prototype.parse = function(t3) {
    var e, n;
    return t3.pos = this.offset, e = this.file.head.indexToLocFormat, this.offsets = 0 === e ? (function() {
      var e2, r;
      for (r = [], n = 0, e2 = this.length; n < e2; n += 2) r.push(2 * t3.readUInt16());
      return r;
    }).call(this) : (function() {
      var e2, r;
      for (r = [], n = 0, e2 = this.length; n < e2; n += 4) r.push(t3.readUInt32());
      return r;
    }).call(this);
  }, t2.prototype.indexOf = function(t3) {
    return this.offsets[t3];
  }, t2.prototype.lengthOf = function(t3) {
    return this.offsets[t3 + 1] - this.offsets[t3];
  }, t2.prototype.encode = function(t3, e) {
    for (var n = new Uint32Array(this.offsets.length), r = 0, i2 = 0, a2 = 0; a2 < n.length; ++a2) if (n[a2] = r, i2 < e.length && e[i2] == a2) {
      ++i2, n[a2] = r;
      var o2 = this.offsets[a2], s2 = this.offsets[a2 + 1] - o2;
      s2 > 0 && (r += s2);
    }
    for (var u2 = new Array(4 * n.length), c2 = 0; c2 < n.length; ++c2) u2[4 * c2 + 3] = 255 & n[c2], u2[4 * c2 + 2] = (65280 & n[c2]) >> 8, u2[4 * c2 + 1] = (16711680 & n[c2]) >> 16, u2[4 * c2] = (4278190080 & n[c2]) >> 24;
    return u2;
  }, t2;
}(), je = function() {
  function t2(t3) {
    this.font = t3, this.subset = {}, this.unicodes = {}, this.next = 33;
  }
  return t2.prototype.generateCmap = function() {
    var t3, e, n, r, i2;
    for (e in r = this.font.cmap.tables[0].codeMap, t3 = {}, i2 = this.subset) n = i2[e], t3[e] = r[n];
    return t3;
  }, t2.prototype.glyphsFor = function(t3) {
    var e, n, r, i2, a2, o2, s2;
    for (r = {}, a2 = 0, o2 = t3.length; a2 < o2; a2++) r[i2 = t3[a2]] = this.font.glyf.glyphFor(i2);
    for (i2 in e = [], r) (null != (n = r[i2]) ? n.compound : void 0) && e.push.apply(e, n.glyphIDs);
    if (e.length > 0) for (i2 in s2 = this.glyphsFor(e)) n = s2[i2], r[i2] = n;
    return r;
  }, t2.prototype.encode = function(t3, e) {
    var n, r, i2, a2, o2, s2, u2, c2, l2, h2, f2, d2, p2, g2, m2;
    for (r in n = be.encode(this.generateCmap(), "unicode"), a2 = this.glyphsFor(t3), f2 = { 0: 0 }, m2 = n.charMap) f2[(s2 = m2[r]).old] = s2.new;
    for (d2 in h2 = n.maxGlyphID, a2) d2 in f2 || (f2[d2] = h2++);
    return c2 = function(t4) {
      var e2, n2;
      for (e2 in n2 = {}, t4) n2[t4[e2]] = e2;
      return n2;
    }(f2), l2 = Object.keys(c2).sort(function(t4, e2) {
      return t4 - e2;
    }), p2 = function() {
      var t4, e2, n2;
      for (n2 = [], t4 = 0, e2 = l2.length; t4 < e2; t4++) o2 = l2[t4], n2.push(c2[o2]);
      return n2;
    }(), i2 = this.font.glyf.encode(a2, p2, f2), u2 = this.font.loca.encode(i2.offsets, p2), g2 = { cmap: this.font.cmap.raw(), glyf: i2.table, loca: u2, hmtx: this.font.hmtx.raw(), hhea: this.font.hhea.raw(), maxp: this.font.maxp.raw(), post: this.font.post.raw(), name: this.font.name.raw(), head: this.font.head.encode(e) }, this.font.os2.exists && (g2["OS/2"] = this.font.os2.raw()), this.font.directory.encode(g2);
  }, t2;
}();
E.API.PDFObject = function() {
  var t2;
  function e() {
  }
  return t2 = function(t3, e2) {
    return (Array(e2 + 1).join("0") + t3).slice(-e2);
  }, e.convert = function(n) {
    var r, i2, a2, o2;
    if (Array.isArray(n)) return "[" + function() {
      var t3, i3, a3;
      for (a3 = [], t3 = 0, i3 = n.length; t3 < i3; t3++) r = n[t3], a3.push(e.convert(r));
      return a3;
    }().join(" ") + "]";
    if ("string" == typeof n) return "/" + n;
    if (null != n ? n.isString : void 0) return "(" + n + ")";
    if (n instanceof Date) return "(D:" + t2(n.getUTCFullYear(), 4) + t2(n.getUTCMonth(), 2) + t2(n.getUTCDate(), 2) + t2(n.getUTCHours(), 2) + t2(n.getUTCMinutes(), 2) + t2(n.getUTCSeconds(), 2) + "Z)";
    if ("[object Object]" === {}.toString.call(n)) {
      for (i2 in a2 = ["<<"], n) o2 = n[i2], a2.push("/" + i2 + " " + e.convert(o2));
      return a2.push(">>"), a2.join("\n");
    }
    return "" + n;
  }, e;
}();
const jspdf_es_min = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AcroFormAppearance: xt,
  AcroFormButton: mt,
  AcroFormCheckBox: wt,
  AcroFormChoiceField: ft,
  AcroFormComboBox: pt,
  AcroFormEditBox: gt,
  AcroFormListBox: dt,
  AcroFormPasswordField: Lt,
  AcroFormPushButton: vt,
  AcroFormRadioButton: bt,
  AcroFormTextField: Nt,
  GState: O,
  ShadingPattern: M,
  TilingPattern: q,
  default: E,
  jsPDF: E
}, Symbol.toStringTag, { value: "Module" }));
export {
  _typeof as _,
  jspdf_es_min as j
};
//# sourceMappingURL=jspdf.es.min-DogEEtIV.js.map
