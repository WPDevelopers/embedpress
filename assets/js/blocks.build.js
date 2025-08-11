(function(require$$0) {
  "use strict";
  var jsxRuntime = { exports: {} };
  var reactJsxRuntime_production_min = {};
  /**
   * @license React
   * react-jsx-runtime.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var f = require$$0, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: true, ref: true, __self: true, __source: true };
  function q(c, a, g) {
    var b, d = {}, e = null, h = null;
    void 0 !== g && (e = "" + g);
    void 0 !== a.key && (e = "" + a.key);
    void 0 !== a.ref && (h = a.ref);
    for (b in a) m.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
    if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
    return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
  }
  reactJsxRuntime_production_min.Fragment = l;
  reactJsxRuntime_production_min.jsx = q;
  reactJsxRuntime_production_min.jsxs = q;
  {
    jsxRuntime.exports = reactJsxRuntime_production_min;
  }
  var jsxRuntimeExports = jsxRuntime.exports;
  const {
    G,
    Path,
    Polygon,
    SVG
  } = wp.components;
  const EPIcon = /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      xmlSpace: "preserve",
      id: "Layer_1",
      x: 0,
      y: 0,
      style: {
        enableBackground: "new 0 0 70 70"
      },
      viewBox: "0 0 70 70",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: ".st0{fill:#5b4e96}" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: "M4 4.4h9.3V1.1H.7v12.7H4zM65.7 56.8v9.3h-9.4v3.3H68.9V56.8zM59 41.8c.3-.2.7-.3 1-.5 8.2-4.5 11.1-14.8 6.6-22.9-2.6-4.7-7.4-7.9-12.8-8.5-3.1-.4-6.3.2-9.2 1.5-.3.2-.7.3-1 .5-3.9 2.2-6.8 5.8-8 9.9L26.4 48c-.8 2.4-2.3 4.3-4.3 5.4-.2.1-.3.2-.5.3-1.5.7-3.2 1-4.9.8-2.9-.3-5.5-2-6.9-4.6-1.2-2.1-1.4-4.5-.8-6.9.7-2.3 2.2-4.3 4.3-5.4.2-.1.4-.2.5-.3 1.5-.7 3.2-1 5-.8h.2L17.1 42c-.1.4.1.8.5.9l4.9 1.6c.4.1.8-.1.9-.4l4.2-12c.1-.3.1-.6-.1-.9-.1-.3-.4-.5-.7-.6l-4.4-1.3c-.1 0-.2 0-.3-.1l-.4-.1c-.6-.1-1.3-.3-1.9-.3-3.2-.4-6.3.2-9.2 1.5-.3.2-.7.3-1 .5-4 2.2-6.8 5.8-8.1 10.1-1.3 4.4-.7 9 1.5 12.9 2.6 4.7 7.4 7.9 12.8 8.5 3.1.4 6.3-.2 9.2-1.5.3-.2.7-.3 1-.5 3.9-2.2 6.8-5.8 8-9.9l9.2-26.2v-.1c1-2.6 2.4-4.3 4.3-5.4.2-.1.4-.2.5-.3 1.5-.7 3.2-1 4.9-.8 2.9.3 5.5 2 6.9 4.6 2.4 4.4.8 9.9-3.5 12.3-.2.1-.4.2-.5.3-1.6.7-3.2 1-5 .8-.5-.1-1-.2-1.6-.3l-2.8-.8c-.3-.1-.6.1-.7.4L43.3 41c-.1.3.1.7.4.8l3.5 1c.8.2 1.7.4 2.6.5 3.1.4 6.3-.2 9.2-1.5z",
            className: "st0"
          }
        )
      ]
    }
  );
  const { __ } = wp.i18n;
  if (wp.blocks && wp.blocks.registerBlockCollection) {
    wp.blocks.registerBlockCollection("embedpress", {
      title: __("EmbedPress", "embedpress"),
      icon: EPIcon
    });
  }
})(React);
//# sourceMappingURL=blocks.build.js.map
