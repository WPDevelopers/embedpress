import { r as reactExports, j as jsxRuntimeExports } from "./chunks/index-COP4orOf.js";
import { c as createRoot } from "./chunks/client-vRIbh7MO.js";
const data = window.embedpressCustomPlayerData || {};
const REST = data.restUrl || "/wp-json/embedpress/v1/";
const NONCE = data.nonce || "";
data.assetsUrl || "";
function apiFetch(path, params = {}) {
  const url = new URL(REST.replace(/\/$/, "") + "/" + path.replace(/^\//, ""), window.location.origin);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== void 0 && v !== null && v !== "") url.searchParams.set(k, v);
  });
  return fetch(url.toString(), {
    credentials: "same-origin",
    headers: { "X-WP-Nonce": NONCE, "Accept": "application/json" }
  }).then((r) => {
    if (!r.ok) throw new Error("HTTP " + r.status);
    return r.json();
  });
}
const Header = () => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ep-cp__header", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ep-cp__header-inner", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ep-cp__brand", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "36", height: "36", viewBox: "0 0 36 36", fill: "none", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: "36", height: "36", rx: "8", fill: "#5B4E96" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M14 12 L14 24 L24 18 Z", fill: "#fff" })
  ] }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "ep-cp__title", children: "Custom Player" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ep-cp__subtitle", children: "Marketing & learning data captured from your videos" })
  ] })
] }) }) });
const TabBar = ({ tab, onChange, counts }) => {
  const items = [
    { key: "leads", label: "Leads", hint: "Email captures" },
    { key: "heatmap", label: "Drop-off Heatmap", hint: "Where viewers leave" },
    { key: "completions", label: "Completions", hint: "Watch-through events" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ep-cp__tabs", role: "tablist", children: items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      role: "tab",
      "aria-selected": tab === it.key,
      className: `ep-cp__tab ${tab === it.key ? "ep-cp__tab--active" : ""}`,
      onClick: () => onChange(it.key),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ep-cp__tab-label", children: it.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ep-cp__tab-hint", children: it.hint }),
        counts[it.key] !== void 0 && counts[it.key] !== null && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ep-cp__tab-count", children: counts[it.key] })
      ]
    },
    it.key
  )) });
};
const EmptyState = ({ icon, title, body }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ep-cp__empty", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ep-cp__empty-icon", children: icon }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "ep-cp__empty-title", children: title }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ep-cp__empty-body", children: body })
] });
const Spinner = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ep-cp__spinner", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ep-cp__spinner-dot" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ep-cp__spinner-dot" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ep-cp__spinner-dot" })
] });
const truncate = (s, n = 40) => {
  if (!s) return "";
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
};
const formatDate = (s) => {
  if (!s) return "";
  const d = new Date(s.replace(" ", "T"));
  if (Number.isNaN(d.valueOf())) return s;
  return d.toLocaleString();
};
const LeadsTab = ({ onTotal }) => {
  const [filters, setFilters] = reactExports.useState({ from: "", to: "", q: "" });
  const [page, setPage] = reactExports.useState(1);
  const [state, setState] = reactExports.useState({ loading: true, error: null, rows: [], total: 0, totalPages: 1 });
  const load = reactExports.useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }));
    apiFetch("leads", { ...filters, page, per_page: 25 }).then((res) => {
      setState({ loading: false, error: null, rows: res.data || [], total: res.total || 0, totalPages: res.total_pages || 1 });
      onTotal && onTotal(res.total || 0);
    }).catch((e) => setState((s) => ({ ...s, loading: false, error: e.message })));
  }, [filters, page, onTotal]);
  reactExports.useEffect(() => {
    load();
  }, [load]);
  const exportUrl = reactExports.useMemo(() => {
    const params = new URLSearchParams({
      page: "embedpress-custom-player",
      tab: "leads",
      embedpress_export: "leads",
      _wpnonce: data.exportNonce || "",
      from: filters.from || "",
      to: filters.to || "",
      q: filters.q || ""
    });
    return (data.adminUrl || "/wp-admin/admin.php") + "?" + params.toString();
  }, [filters]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ep-cp__panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ep-cp__filters", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "ep-cp__field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "From" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: filters.from, onChange: (e) => {
          setFilters({ ...filters, from: e.target.value });
          setPage(1);
        } })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "ep-cp__field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "To" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: filters.to, onChange: (e) => {
          setFilters({ ...filters, to: e.target.value });
          setPage(1);
        } })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "ep-cp__field ep-cp__field--grow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Search" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "search",
            placeholder: "email or video URL",
            value: filters.q,
            onChange: (e) => {
              setFilters({ ...filters, q: e.target.value });
              setPage(1);
            }
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { className: "ep-cp__btn ep-cp__btn--secondary", href: exportUrl, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M8 2v8m0 0L4.5 6.5M8 10l3.5-3.5M2 13h12", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round" }) }),
        "Export CSV"
      ] })
    ] }),
    state.loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, {}) : state.error ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: "⚠️",
        title: "Couldn't load leads",
        body: state.error
      }
    ) : state.rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "48", height: "48", viewBox: "0 0 48 48", fill: "none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "6", y: "12", width: "36", height: "24", rx: "3", stroke: "#DCDCE5", strokeWidth: "2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M6 16l18 12 18-12", stroke: "#DCDCE5", strokeWidth: "2" })
        ] }),
        title: "No leads captured yet",
        body: "When viewers submit the email-capture form on a video, they'll appear here."
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ep-cp__count", children: [
        "Showing ",
        state.rows.length,
        " of ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: state.total }),
        " leads"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ep-cp__tablewrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "ep-cp__table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Captured" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Video" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Page" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: state.rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: formatDate(r.created_at) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: r.email }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: r.name || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ep-cp__muted", children: "—" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: r.video_url, target: "_blank", rel: "noopener noreferrer", children: truncate(r.video_url, 36) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: r.page_url, target: "_blank", rel: "noopener noreferrer", children: truncate(r.page_url, 36) }) })
        ] }, r.id)) })
      ] }) }),
      state.totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ep-cp__pagination", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: page <= 1, onClick: () => setPage(page - 1), children: "← Prev" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Page ",
          page,
          " of ",
          state.totalPages
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: page >= state.totalPages, onClick: () => setPage(page + 1), children: "Next →" })
      ] })
    ] })
  ] });
};
const HeatmapTab = ({ onTotal }) => {
  const [state, setState] = reactExports.useState({ loading: true, error: null, videos: [] });
  const [selected, setSelected] = reactExports.useState(null);
  reactExports.useEffect(() => {
    apiFetch("heatmap/list").then((res) => {
      setState({ loading: false, error: null, videos: res.data || [] });
      onTotal && onTotal(res.total || 0);
      if (res.data && res.data.length > 0) setSelected(res.data[0].key);
    }).catch((e) => setState({ loading: false, error: e.message, videos: [] }));
  }, [onTotal]);
  const current = reactExports.useMemo(
    () => state.videos.find((v) => v.key === selected),
    [state.videos, selected]
  );
  const max = current ? Math.max(1, ...current.buckets) : 1;
  if (state.loading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ep-cp__panel", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, {}) });
  if (state.error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ep-cp__panel", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { icon: "⚠️", title: "Couldn't load heatmap", body: state.error }) });
  }
  if (state.videos.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ep-cp__panel", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "48", height: "48", viewBox: "0 0 48 48", fill: "none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "6", y: "30", width: "6", height: "12", fill: "#DCDCE5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "14", y: "22", width: "6", height: "20", fill: "#DCDCE5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "22", y: "14", width: "6", height: "28", fill: "#DCDCE5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "30", y: "20", width: "6", height: "22", fill: "#DCDCE5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "38", y: "34", width: "6", height: "8", fill: "#DCDCE5" })
        ] }),
        title: "No heatmap data yet",
        body: "Enable Drop-off Heatmap on a video and have viewers play it. Each visit contributes anonymous samples."
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ep-cp__panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ep-cp__filters", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "ep-cp__field ep-cp__field--grow", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Video" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: selected || "", onChange: (e) => setSelected(e.target.value), children: state.videos.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: v.key, children: [
        truncate(v.url || v.key, 60),
        " — ",
        v.samples.toLocaleString(),
        " samples"
      ] }, v.key)) })
    ] }) }),
    current && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ep-cp__statgrid", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ep-cp__stat", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ep-cp__stat-label", children: "Total samples" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ep-cp__stat-value", children: current.samples.toLocaleString() })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ep-cp__stat ep-cp__stat--wide", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ep-cp__stat-label", children: "Video URL" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "ep-cp__stat-code", children: current.url || current.key })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ep-cp__chartwrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ep-cp__chart", children: current.buckets.map((count, i) => {
          const h = max > 0 ? count / max * 100 : 0;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "ep-cp__chart-bar",
              style: { height: `${h}%` },
              title: `${i}%: ${count} viewers`
            },
            i
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ep-cp__chart-axis", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "0%" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "25%" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "50%" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "75%" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "100%" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ep-cp__muted ep-cp__hint", children: "Each bar represents 1% of the video. Taller = more viewers reached that point." })
    ] })
  ] });
};
const CompletionsTab = ({ onTotal }) => {
  const [state, setState] = reactExports.useState({ loading: true, error: null, rows: [], days: 14 });
  reactExports.useEffect(() => {
    apiFetch("completions").then((res) => {
      setState({ loading: false, error: null, rows: res.data || [], days: res.days || 14 });
      onTotal && onTotal(res.total || 0);
    }).catch((e) => setState({ loading: false, error: e.message, rows: [], days: 14 }));
  }, [onTotal]);
  if (state.loading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ep-cp__panel", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, {}) });
  if (state.error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ep-cp__panel", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { icon: "⚠️", title: "Couldn't load completions", body: state.error }) });
  }
  if (state.rows.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ep-cp__panel", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "48", height: "48", viewBox: "0 0 48 48", fill: "none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "24", cy: "24", r: "20", stroke: "#DCDCE5", strokeWidth: "2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M16 24l6 6 12-12", stroke: "#DCDCE5", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round" })
        ] }),
        title: "No completion records yet",
        body: "LMS adapters may have already consumed completions through the embedpress_video_completed action. The fallback log keeps the last 14 days for debugging."
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ep-cp__panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "ep-cp__muted ep-cp__hint", children: [
      state.rows.length,
      " entries from the last ",
      state.days,
      " days. Older entries are auto-pruned."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ep-cp__tablewrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "ep-cp__table", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Completed" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "User" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Video" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Watched" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Page" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: state.rows.map((e, i) => {
        const watchedPct = e.total_seconds > 0 ? Math.round(e.watched_seconds / e.total_seconds * 100) : 0;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: formatDate(e.completed_at) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: e.user_login || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ep-cp__muted", children: "guest" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: e.video_url, target: "_blank", rel: "noopener noreferrer", children: truncate(e.video_url, 36) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ep-cp__progress", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ep-cp__progress-bar", style: { width: `${watchedPct}%` } }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ep-cp__progress-label", children: [
              watchedPct,
              "%"
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: e.page_url, target: "_blank", rel: "noopener noreferrer", children: truncate(e.page_url, 36) }) })
        ] }, i);
      }) })
    ] }) })
  ] });
};
const CustomPlayer = () => {
  const [tab, setTab] = reactExports.useState(() => {
    const u = new URLSearchParams(window.location.search);
    return u.get("tab") || "leads";
  });
  const [counts, setCounts] = reactExports.useState({ leads: null, heatmap: null, completions: null });
  reactExports.useEffect(() => {
    const u = new URLSearchParams(window.location.search);
    u.set("tab", tab);
    const newUrl = window.location.pathname + "?" + u.toString();
    window.history.replaceState(null, "", newUrl);
  }, [tab]);
  const setLeadsCount = reactExports.useCallback((n) => setCounts((c) => ({ ...c, leads: n })), []);
  const setHeatmapCount = reactExports.useCallback((n) => setCounts((c) => ({ ...c, heatmap: n })), []);
  const setCompletionsCount = reactExports.useCallback((n) => setCounts((c) => ({ ...c, completions: n })), []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ep-cp", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TabBar, { tab, onChange: setTab, counts }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ep-cp__body", children: [
      tab === "leads" && /* @__PURE__ */ jsxRuntimeExports.jsx(LeadsTab, { onTotal: setLeadsCount }),
      tab === "heatmap" && /* @__PURE__ */ jsxRuntimeExports.jsx(HeatmapTab, { onTotal: setHeatmapCount }),
      tab === "completions" && /* @__PURE__ */ jsxRuntimeExports.jsx(CompletionsTab, { onTotal: setCompletionsCount })
    ] })
  ] });
};
const container = document.getElementById("embedpress-custom-player-root");
if (container) {
  const root = createRoot(container);
  root.render(/* @__PURE__ */ jsxRuntimeExports.jsx(CustomPlayer, {}));
}
//# sourceMappingURL=custom-player.build.js.map
