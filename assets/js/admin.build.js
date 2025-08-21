import { r as reactExports, j as jsxRuntimeExports, d as createRoot } from "./chunks/client-CU7r3rCh.js";
const Settings = () => {
  const [settings, setSettings] = reactExports.useState({
    enableAnalytics: true,
    enableSocialShare: true,
    enableCustomPlayer: false,
    enableAds: false,
    enableBranding: true
  });
  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
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
//# sourceMappingURL=admin.build.js.map
