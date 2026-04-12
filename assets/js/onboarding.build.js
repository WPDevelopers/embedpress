import { r as reactExports, j as jsxRuntimeExports } from "./chunks/index-COP4orOf.js";
import { c as createRoot } from "./chunks/client-vRIbh7MO.js";
const TOTAL_STEPS = 3;
const STEP_LABELS = ["Get Started", "Settings", "Features"];
const initialSettings = {
  shortcode: true,
  gutenberg_block: false,
  elementor_widget: false,
  flipbook: false,
  video_styling: false,
  custom_branding: false,
  custom_ads: false
};
function settingsReducer(state, action) {
  switch (action.type) {
    case "TOGGLE":
      return { ...state, [action.key]: !state[action.key] };
    case "INIT":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
function buildInitialSettings(data) {
  if (!data) return initialSettings;
  const s = data.settings || {};
  const el = data.elements || {};
  const gutenbergBlocks = el.gutenberg || {};
  const elementorWidgets = el.elementor || {};
  return {
    shortcode: s.enableShortcode !== void 0 ? !!parseInt(s.enableShortcode, 10) : true,
    gutenberg_block: !!gutenbergBlocks.embedpress,
    elementor_widget: !!elementorWidgets.embedpress,
    flipbook: !!parseInt(s.onboarding_flipbook, 10),
    video_styling: !!parseInt(s.onboarding_video_styling, 10),
    custom_branding: !!parseInt(s.onboarding_custom_branding, 10),
    custom_ads: !!parseInt(s.onboarding_custom_ads, 10)
  };
}
const StepIndicator = ({ current, total }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ep-ob-stepper", children: Array.from({ length: total }, (_, i) => {
  const step = i + 1;
  let state = "upcoming";
  if (step < current) state = "completed";
  else if (step === current) state = "active";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `ep-ob-stepper__tab ep-ob-stepper__tab--${state}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ep-ob-stepper__icon", children: state === "completed" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "8", cy: "8", r: "8", fill: "#5B4E96" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M4.5 8L7 10.5L11.5 5.5", stroke: "#fff", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })
    ] }) : state === "active" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "8", cy: "8", r: "7", stroke: "#5B4E96", strokeWidth: "2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "8", cy: "8", r: "4", fill: "#5B4E96" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "8", cy: "8", r: "7", stroke: "#DCDCE5", strokeWidth: "2" }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ep-ob-stepper__label", children: STEP_LABELS[i] })
  ] }, step);
}) });
const ToggleCard = ({ title, description, checked, onChange, pro }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `ep-ob-toggle-card${checked ? " active" : ""}`, children: [
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ep-ob-toggle-card__body", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ep-ob-toggle-card__title", children: [
      title,
      pro && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ep-ob-pro-badge", children: "PRO" })
    ] }),
    description && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ep-ob-toggle-card__desc", children: description })
  ] }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "ep-ob-toggle", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked, onChange }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ep-ob-toggle__slider" })
  ] })
] });
const ConsentModal = ({ onClose }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ep-ob-modal-overlay", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ep-ob-modal", onClick: (e) => e.stopPropagation(), children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "ep-ob-modal__close", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "20", height: "20", viewBox: "0 0 20 20", fill: "none", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M5 5l10 10M15 5L5 15", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }) }) }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "ep-ob-modal__title", children: "What Do We Collect?" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ep-ob-modal__text", children: "We collect non-sensitive diagnostic data and plugin usage information. Your site URL, WordPress & PHP version, plugins & themes, and email address to send you the discount coupon. This data lets us make sure this plugin always stays compatible with the most popular plugins and themes. No spam, we promise." })
] }) });
const FinishingModal = ({ saving, onGoSettings, onGoDashboard }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ep-ob-modal-overlay ep-ob-modal-overlay--dark", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ep-ob-modal ep-ob-modal--finish", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ep-ob-finish-illustration", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "180", height: "180", viewBox: "0 0 180 180", fill: "none", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "90", cy: "90", r: "84", stroke: "#E8E5F3", strokeWidth: "1.5", strokeDasharray: "5 5" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "90", cy: "90", r: "68", fill: "#F5F3FF" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "90", cy: "90", r: "50", fill: "#EDE9FF" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { transform: "translate(90, 90)", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M0-38c-3 0-8 10-8 22v8h16v-8c0-12-5-22-8-22z", fill: "#5B4E96" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "0", cy: "-12", r: "5", fill: "#fff", fillOpacity: "0.4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "0", cy: "-12", r: "3", fill: "#7B6DB5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "-8", y: "-8", width: "16", height: "24", rx: "2", fill: "#5B4E96" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M-8 6l-6 14h6z", fill: "#5B4E96", fillOpacity: "0.7" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M8 6l6 14h-6z", fill: "#5B4E96", fillOpacity: "0.7" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "-8", y: "12", width: "16", height: "4", rx: "1", fill: "#474559" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M-5 16c0 0-2 10 5 14c7-4 5-14 5-14z", fill: "#FF7369" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M-3 16c0 0-1 7 3 10c4-3 3-10 3-10z", fill: "#FFB347" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "45", cy: "55", r: "3", fill: "#FF7369", fillOpacity: "0.5" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "140", cy: "50", r: "2", fill: "#5B4E96", fillOpacity: "0.4" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "135", cy: "120", r: "2.5", fill: "#4AD750", fillOpacity: "0.5" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "50", cy: "130", r: "2", fill: "#5B4E96", fillOpacity: "0.3" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M42 75l1.5 3 3 .5-2 2 .5 3-3-1.5-3 1.5.5-3-2-2 3-.5z", fill: "#FFB347", fillOpacity: "0.6" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M138 85l1 2 2 .3-1.5 1.5.3 2-2-1-2 1 .3-2-1.5-1.5 2-.3z", fill: "#5B4E96", fillOpacity: "0.4" })
  ] }) }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "ep-ob-modal__title", children: "Finishing Up" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ep-ob-modal__text", children: "Congratulations! You are all set to start embedding multimedia content on your website with EmbedPress. Best wishes." }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ep-ob-finish-actions", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        className: "ep-ob-btn ep-ob-btn--primary",
        onClick: onGoSettings,
        disabled: saving,
        children: saving ? "Saving…" : "Start Configuring Settings"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        className: "ep-ob-btn ep-ob-btn--text",
        onClick: onGoDashboard,
        disabled: saving,
        children: "Skip It"
      }
    )
  ] })
] }) });
const PREMIUM_FEATURES = [
  ["Custom Branding", "Content Protection"],
  ["24/7 Customer Support", "Video & Audio Custom Player"],
  ["Lazy Loading", "Custom Ads"],
  ["YouTube Exclusive Controls", "Download/Print PDFs"]
];
const Onboarding = () => {
  const data = typeof embedpressOnboardingData !== "undefined" ? embedpressOnboardingData : null;
  const [currentStep, setCurrentStep] = reactExports.useState(1);
  const [settings, dispatch] = reactExports.useReducer(settingsReducer, buildInitialSettings(data));
  const [saving, setSaving] = reactExports.useState(false);
  const [showConsent, setShowConsent] = reactExports.useState(false);
  const [showFinishing, setShowFinishing] = reactExports.useState(false);
  const toggle = reactExports.useCallback((key) => dispatch({ type: "TOGGLE", key }), []);
  const goNext = () => setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 1));
  const saveSettings = reactExports.useCallback(
    (complete = false) => {
      if (!data) return Promise.resolve();
      setSaving(true);
      const formData = new FormData();
      formData.append("action", "embedpress_save_onboarding");
      formData.append("nonce", data.nonce);
      Object.entries(settings).forEach(([k, v]) => formData.append(k, v ? "1" : "0"));
      if (complete) {
        formData.append("complete", "1");
        formData.append("data_consent", "1");
      }
      return fetch(data.ajaxUrl, { method: "POST", body: formData }).then((r) => r.json()).finally(() => setSaving(false));
    },
    [data, settings]
  );
  const handleFinish = reactExports.useCallback(
    (destination) => {
      saveSettings(true).then(() => {
        const url = destination === "settings" ? data == null ? void 0 : data.settingsUrl : data == null ? void 0 : data.dashboardUrl;
        if (url) window.location.href = url;
      });
    },
    [saveSettings, data]
  );
  const handleFinishWithoutPro = () => {
    saveSettings(true).then(() => {
      setShowFinishing(true);
    });
  };
  const assetsUrl = (data == null ? void 0 : data.assetsUrl) || "";
  const platformIcons = [
    { name: "youtube", file: "youtube.svg" },
    { name: "vimeo", file: "vimeo.svg" },
    { name: "google-maps", file: "map.svg" },
    { name: "soundcloud", file: "soundcloud.svg" },
    { name: "embedpress", file: "icon-128x128.png", isRoot: true },
    { name: "x", file: "x.svg" },
    { name: "wordpress", file: "wordpress.svg" },
    { name: "linkedin", file: "linkedin.png" },
    { name: "instagram", file: "instagram.svg" }
  ];
  const renderStep1 = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ep-ob-step ep-ob-step--welcome", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ep-ob-welcome-illustration", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ep-ob-platforms-grid", children: platformIcons.map(({ name, file, isRoot }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ep-ob-platform-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: `${assetsUrl}images/${isRoot ? "" : "sources/icons/"}${file}`,
        alt: name,
        width: "32",
        height: "32"
      }
    ) }, name)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "ep-ob-step__heading", children: "Thank You for Choosing EmbedPress" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ep-ob-step__subheading", children: "To embed versatile multimedia content on your website in one click, no coding is needed. Enhance your storytelling by embedding interactive content from 250+ sources." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ep-ob-welcome-actions", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "ep-ob-btn ep-ob-btn--primary", onClick: goNext, children: [
        "Start Configuring Settings",
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M6 4l4 4-4 4", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "ep-ob-btn ep-ob-btn--text",
          onClick: () => handleFinish("dashboard"),
          disabled: saving,
          children: saving ? "Saving…" : "Skip It"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ep-ob-consent-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "By proceeding, you grant permission for this plugin to collect your information." }),
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "ep-ob-consent-link",
          type: "button",
          onClick: () => setShowConsent(true),
          children: "Find out what we collect?"
        }
      )
    ] })
  ] });
  const renderStep2 = () => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ep-ob-step ep-ob-step--settings", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ep-ob-toggle-grid", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ToggleCard,
      {
        title: "Shortcode",
        description: "Generate embedding shortcodes of your chosen source and embed them in Classic editor, Divi or other popular page builders.",
        checked: settings.shortcode,
        onChange: () => toggle("shortcode")
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ToggleCard,
      {
        title: "Gutenberg Embed Block",
        description: "Embed content in default Gutenberg editor using the EmbedPress block. Just copy the source link and embed it in one click.",
        checked: settings.gutenberg_block,
        onChange: () => toggle("gutenberg_block")
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ToggleCard,
      {
        title: "Elementor Embed Widget",
        description: "For Elementor website builder, get an embed widget to embed multimedia sources in editor in one click, no custom coding is needed.",
        checked: settings.elementor_widget,
        onChange: () => toggle("elementor_widget")
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ToggleCard,
      {
        title: "Embed Flipbook",
        description: "Convert static PDFs into interactive 3D flipbooks to draw visitors to your website.",
        checked: settings.flipbook,
        onChange: () => toggle("flipbook")
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ToggleCard,
      {
        title: "Embedded Video Styling",
        description: "Personalize your embedded video content styling from YouTube, Vimeo, Wistia, etc.",
        checked: settings.video_styling,
        onChange: () => toggle("video_styling"),
        pro: true
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ToggleCard,
      {
        title: "Custom Branding",
        description: "Showcase your own brand or business logo on your embedded content with this function.",
        checked: settings.custom_branding,
        onChange: () => toggle("custom_branding"),
        pro: true
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ToggleCard,
      {
        title: "Custom Ads",
        description: "Display custom ads in the form of video or image on your embedded content seamlessly.",
        checked: settings.custom_ads,
        onChange: () => toggle("custom_ads"),
        pro: true
      }
    )
  ] }) });
  const renderStep3 = () => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ep-ob-step ep-ob-step--features", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ep-ob-features-split", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ep-ob-features-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "ep-ob-features__heading", children: "Supercharge Embedding Experience with Premium Features" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ep-ob-features__subheading", children: "Unlock premium features, deeper customization, and expert support to elevate your workflows, designed for growing websites." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ep-ob-features-checklist", children: PREMIUM_FEATURES.map((row, ri) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ep-ob-features-checklist__row", children: row.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ep-ob-features-checklist__item", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "18", height: "18", viewBox: "0 0 18 18", fill: "none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "9", cy: "9", r: "9", fill: "#4AD750", fillOpacity: "0.15" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M5.5 9L8 11.5L12.5 6.5", stroke: "#4AD750", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item })
      ] }, item)) }, ri)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ep-ob-features-actions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: (data == null ? void 0 : data.upgradeUrl) || "https://wpdeveloper.com/in/upgrade-embedpress",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "ep-ob-btn ep-ob-btn--upgrade",
            children: [
              "Upgrade to PRO",
              /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M5 2h7v7M12 2L2 12", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: "https://embedpress.com/documentation/",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "ep-ob-btn ep-ob-btn--outline",
            children: [
              "Explore Documentation",
              /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M6 4l4 4-4 4", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }) })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ep-ob-features-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: `${assetsUrl}images/onboard-feature.svg`,
        alt: "EmbedPress Premium Features",
        className: "ep-ob-features-img"
      }
    ) })
  ] }) });
  const stepRenderers = [renderStep1, renderStep2, renderStep3];
  const handleNext = () => {
    if (currentStep === 2) {
      saveSettings(false).then(goNext);
    } else {
      goNext();
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ep-ob", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ep-ob__header", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StepIndicator, { current: currentStep, total: TOTAL_STEPS }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ep-ob__body", children: stepRenderers[currentStep - 1]() }),
    currentStep > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ep-ob__footer", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "ep-ob-btn ep-ob-btn--secondary", onClick: goBack, disabled: saving, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M10 4l-4 4 4 4", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }),
        "Back"
      ] }),
      currentStep === 3 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: "ep-ob-btn ep-ob-btn--primary",
          onClick: handleFinishWithoutPro,
          disabled: saving,
          children: [
            saving ? "Saving…" : "Finish Without Pro",
            !saving && /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M6 4l4 4-4 4", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "ep-ob-btn ep-ob-btn--primary", onClick: handleNext, disabled: saving, children: [
        saving ? "Saving…" : "Next",
        !saving && /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M6 4l4 4-4 4", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) })
      ] })
    ] }),
    showConsent && /* @__PURE__ */ jsxRuntimeExports.jsx(ConsentModal, { onClose: () => setShowConsent(false) }),
    showFinishing && /* @__PURE__ */ jsxRuntimeExports.jsx(
      FinishingModal,
      {
        saving,
        onGoSettings: () => handleFinish("settings"),
        onGoDashboard: () => handleFinish("dashboard")
      }
    )
  ] });
};
const onboardingContainer = document.getElementById("embedpress-onboarding-root");
if (onboardingContainer) {
  const root = createRoot(onboardingContainer);
  root.render(/* @__PURE__ */ jsxRuntimeExports.jsx(Onboarding, {}));
}
//# sourceMappingURL=onboarding.build.js.map
