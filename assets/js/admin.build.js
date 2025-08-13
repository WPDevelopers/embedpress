var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
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
(function(require$$0, require$$0$1) {
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
  var f = require$$0, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: true, ref: true, __self: true, __source: true };
  function q(c, a, g) {
    var b, d = {}, e = null, h = null;
    void 0 !== g && (e = "" + g);
    void 0 !== a.key && (e = "" + a.key);
    void 0 !== a.ref && (h = a.ref);
    for (b in a) m$1.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
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
  var createRoot;
  var m = require$$0$1;
  {
    createRoot = m.createRoot;
    m.hydrateRoot;
  }
  const Settings = () => {
    const [settings, setSettings] = require$$0.useState({
      enableAnalytics: true,
      enableSocialShare: true,
      enableCustomPlayer: false,
      enableAds: false,
      enableBranding: true
    });
    const handleSettingChange = (key, value) => {
      setSettings((prev) => __spreadProps(__spreadValues({}, prev), {
        [key]: value
      }));
    };
    const handleSave = () => {
      console.log("Saving settings:", settings);
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "embedpress-settings", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "Settings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Configure your EmbedPress settings." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-sections", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-section", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "General Settings" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setting-item", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: settings.enableAnalytics,
                  onChange: (e) => handleSettingChange("enableAnalytics", e.target.checked)
                }
              ),
              "Enable Analytics"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "setting-description", children: "Track views, clicks, and other metrics for your embeds." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setting-item", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: settings.enableSocialShare,
                  onChange: (e) => handleSettingChange("enableSocialShare", e.target.checked)
                }
              ),
              "Enable Social Share"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "setting-description", children: "Add social sharing buttons to your embeds." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setting-item", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: settings.enableBranding,
                  onChange: (e) => handleSettingChange("enableBranding", e.target.checked)
                }
              ),
              "Enable Branding"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "setting-description", children: "Show EmbedPress branding on embeds." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-section", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Advanced Settings" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setting-item", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: settings.enableCustomPlayer,
                  onChange: (e) => handleSettingChange("enableCustomPlayer", e.target.checked)
                }
              ),
              "Enable Custom Player"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "setting-description", children: "Use custom video player for better control." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setting-item", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: settings.enableAds,
                  onChange: (e) => handleSettingChange("enableAds", e.target.checked)
                }
              ),
              "Enable Ads"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "setting-description", children: "Show advertisements on your embeds." })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-actions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleSave, className: "button button-primary", children: "Save Settings" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "button", children: "Reset to Defaults" })
      ] })
    ] });
  };
  const App = () => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "embedpress-admin", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, {}) });
  };
  const container = document.getElementById("embedpress-admin-root");
  if (container) {
    const root = createRoot(container);
    root.render(/* @__PURE__ */ jsxRuntimeExports.jsx(App, {}));
  }
  console.log("EmbedPress Admin UI initialized");
})(React, ReactDOM);
//# sourceMappingURL=admin.build.js.map
