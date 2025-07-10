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
(function(React2, require$$0) {
  "use strict";
  function _interopNamespaceDefault(e) {
    const n2 = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
    if (e) {
      for (const k2 in e) {
        if (k2 !== "default") {
          const d = Object.getOwnPropertyDescriptor(e, k2);
          Object.defineProperty(n2, k2, d.get ? d : {
            enumerable: true,
            get: () => e[k2]
          });
        }
      }
    }
    n2.default = e;
    return Object.freeze(n2);
  }
  const React__namespace = /* @__PURE__ */ _interopNamespaceDefault(React2);
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
  var f = React2, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: true, ref: true, __self: true, __source: true };
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
  var m = require$$0;
  {
    createRoot = m.createRoot;
    m.hydrateRoot;
  }
  /**
   * @remix-run/router v1.23.0
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   */
  function _extends$1() {
    _extends$1 = Object.assign ? Object.assign.bind() : function(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends$1.apply(this, arguments);
  }
  var Action;
  (function(Action2) {
    Action2["Pop"] = "POP";
    Action2["Push"] = "PUSH";
    Action2["Replace"] = "REPLACE";
  })(Action || (Action = {}));
  const PopStateEventType = "popstate";
  function createBrowserHistory(options) {
    if (options === void 0) {
      options = {};
    }
    function createBrowserLocation(window2, globalHistory) {
      let {
        pathname,
        search,
        hash
      } = window2.location;
      return createLocation(
        "",
        {
          pathname,
          search,
          hash
        },
        // state defaults to `null` because `window.history.state` does
        globalHistory.state && globalHistory.state.usr || null,
        globalHistory.state && globalHistory.state.key || "default"
      );
    }
    function createBrowserHref(window2, to) {
      return typeof to === "string" ? to : createPath(to);
    }
    return getUrlBasedHistory(createBrowserLocation, createBrowserHref, null, options);
  }
  function invariant(value, message) {
    if (value === false || value === null || typeof value === "undefined") {
      throw new Error(message);
    }
  }
  function warning(cond, message) {
    if (!cond) {
      if (typeof console !== "undefined") console.warn(message);
      try {
        throw new Error(message);
      } catch (e) {
      }
    }
  }
  function createKey() {
    return Math.random().toString(36).substr(2, 8);
  }
  function getHistoryState(location, index) {
    return {
      usr: location.state,
      key: location.key,
      idx: index
    };
  }
  function createLocation(current, to, state, key) {
    if (state === void 0) {
      state = null;
    }
    let location = _extends$1({
      pathname: typeof current === "string" ? current : current.pathname,
      search: "",
      hash: ""
    }, typeof to === "string" ? parsePath(to) : to, {
      state,
      // TODO: This could be cleaned up.  push/replace should probably just take
      // full Locations now and avoid the need to run through this flow at all
      // But that's a pretty big refactor to the current test suite so going to
      // keep as is for the time being and just let any incoming keys take precedence
      key: to && to.key || key || createKey()
    });
    return location;
  }
  function createPath(_ref) {
    let {
      pathname = "/",
      search = "",
      hash = ""
    } = _ref;
    if (search && search !== "?") pathname += search.charAt(0) === "?" ? search : "?" + search;
    if (hash && hash !== "#") pathname += hash.charAt(0) === "#" ? hash : "#" + hash;
    return pathname;
  }
  function parsePath(path) {
    let parsedPath = {};
    if (path) {
      let hashIndex = path.indexOf("#");
      if (hashIndex >= 0) {
        parsedPath.hash = path.substr(hashIndex);
        path = path.substr(0, hashIndex);
      }
      let searchIndex = path.indexOf("?");
      if (searchIndex >= 0) {
        parsedPath.search = path.substr(searchIndex);
        path = path.substr(0, searchIndex);
      }
      if (path) {
        parsedPath.pathname = path;
      }
    }
    return parsedPath;
  }
  function getUrlBasedHistory(getLocation, createHref, validateLocation, options) {
    if (options === void 0) {
      options = {};
    }
    let {
      window: window2 = document.defaultView,
      v5Compat = false
    } = options;
    let globalHistory = window2.history;
    let action = Action.Pop;
    let listener = null;
    let index = getIndex();
    if (index == null) {
      index = 0;
      globalHistory.replaceState(_extends$1({}, globalHistory.state, {
        idx: index
      }), "");
    }
    function getIndex() {
      let state = globalHistory.state || {
        idx: null
      };
      return state.idx;
    }
    function handlePop() {
      action = Action.Pop;
      let nextIndex = getIndex();
      let delta = nextIndex == null ? null : nextIndex - index;
      index = nextIndex;
      if (listener) {
        listener({
          action,
          location: history.location,
          delta
        });
      }
    }
    function push(to, state) {
      action = Action.Push;
      let location = createLocation(history.location, to, state);
      index = getIndex() + 1;
      let historyState = getHistoryState(location, index);
      let url = history.createHref(location);
      try {
        globalHistory.pushState(historyState, "", url);
      } catch (error) {
        if (error instanceof DOMException && error.name === "DataCloneError") {
          throw error;
        }
        window2.location.assign(url);
      }
      if (v5Compat && listener) {
        listener({
          action,
          location: history.location,
          delta: 1
        });
      }
    }
    function replace(to, state) {
      action = Action.Replace;
      let location = createLocation(history.location, to, state);
      index = getIndex();
      let historyState = getHistoryState(location, index);
      let url = history.createHref(location);
      globalHistory.replaceState(historyState, "", url);
      if (v5Compat && listener) {
        listener({
          action,
          location: history.location,
          delta: 0
        });
      }
    }
    function createURL(to) {
      let base = window2.location.origin !== "null" ? window2.location.origin : window2.location.href;
      let href = typeof to === "string" ? to : createPath(to);
      href = href.replace(/ $/, "%20");
      invariant(base, "No window.location.(origin|href) available to create URL for href: " + href);
      return new URL(href, base);
    }
    let history = {
      get action() {
        return action;
      },
      get location() {
        return getLocation(window2, globalHistory);
      },
      listen(fn) {
        if (listener) {
          throw new Error("A history only accepts one active listener");
        }
        window2.addEventListener(PopStateEventType, handlePop);
        listener = fn;
        return () => {
          window2.removeEventListener(PopStateEventType, handlePop);
          listener = null;
        };
      },
      createHref(to) {
        return createHref(window2, to);
      },
      createURL,
      encodeLocation(to) {
        let url = createURL(to);
        return {
          pathname: url.pathname,
          search: url.search,
          hash: url.hash
        };
      },
      push,
      replace,
      go(n2) {
        return globalHistory.go(n2);
      }
    };
    return history;
  }
  var ResultType;
  (function(ResultType2) {
    ResultType2["data"] = "data";
    ResultType2["deferred"] = "deferred";
    ResultType2["redirect"] = "redirect";
    ResultType2["error"] = "error";
  })(ResultType || (ResultType = {}));
  function matchRoutes(routes, locationArg, basename) {
    if (basename === void 0) {
      basename = "/";
    }
    return matchRoutesImpl(routes, locationArg, basename);
  }
  function matchRoutesImpl(routes, locationArg, basename, allowPartial) {
    let location = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
    let pathname = stripBasename(location.pathname || "/", basename);
    if (pathname == null) {
      return null;
    }
    let branches = flattenRoutes(routes);
    rankRouteBranches(branches);
    let matches = null;
    for (let i = 0; matches == null && i < branches.length; ++i) {
      let decoded = decodePath(pathname);
      matches = matchRouteBranch(branches[i], decoded);
    }
    return matches;
  }
  function flattenRoutes(routes, branches, parentsMeta, parentPath) {
    if (branches === void 0) {
      branches = [];
    }
    if (parentsMeta === void 0) {
      parentsMeta = [];
    }
    if (parentPath === void 0) {
      parentPath = "";
    }
    let flattenRoute = (route, index, relativePath) => {
      let meta = {
        relativePath: relativePath === void 0 ? route.path || "" : relativePath,
        caseSensitive: route.caseSensitive === true,
        childrenIndex: index,
        route
      };
      if (meta.relativePath.startsWith("/")) {
        invariant(meta.relativePath.startsWith(parentPath), 'Absolute route path "' + meta.relativePath + '" nested under path ' + ('"' + parentPath + '" is not valid. An absolute child route path ') + "must start with the combined path of all its parent routes.");
        meta.relativePath = meta.relativePath.slice(parentPath.length);
      }
      let path = joinPaths([parentPath, meta.relativePath]);
      let routesMeta = parentsMeta.concat(meta);
      if (route.children && route.children.length > 0) {
        invariant(
          // Our types know better, but runtime JS may not!
          // @ts-expect-error
          route.index !== true,
          "Index routes must not have child routes. Please remove " + ('all child routes from route path "' + path + '".')
        );
        flattenRoutes(route.children, branches, routesMeta, path);
      }
      if (route.path == null && !route.index) {
        return;
      }
      branches.push({
        path,
        score: computeScore(path, route.index),
        routesMeta
      });
    };
    routes.forEach((route, index) => {
      var _route$path;
      if (route.path === "" || !((_route$path = route.path) != null && _route$path.includes("?"))) {
        flattenRoute(route, index);
      } else {
        for (let exploded of explodeOptionalSegments(route.path)) {
          flattenRoute(route, index, exploded);
        }
      }
    });
    return branches;
  }
  function explodeOptionalSegments(path) {
    let segments = path.split("/");
    if (segments.length === 0) return [];
    let [first, ...rest] = segments;
    let isOptional = first.endsWith("?");
    let required = first.replace(/\?$/, "");
    if (rest.length === 0) {
      return isOptional ? [required, ""] : [required];
    }
    let restExploded = explodeOptionalSegments(rest.join("/"));
    let result = [];
    result.push(...restExploded.map((subpath) => subpath === "" ? required : [required, subpath].join("/")));
    if (isOptional) {
      result.push(...restExploded);
    }
    return result.map((exploded) => path.startsWith("/") && exploded === "" ? "/" : exploded);
  }
  function rankRouteBranches(branches) {
    branches.sort((a, b) => a.score !== b.score ? b.score - a.score : compareIndexes(a.routesMeta.map((meta) => meta.childrenIndex), b.routesMeta.map((meta) => meta.childrenIndex)));
  }
  const paramRe = /^:[\w-]+$/;
  const dynamicSegmentValue = 3;
  const indexRouteValue = 2;
  const emptySegmentValue = 1;
  const staticSegmentValue = 10;
  const splatPenalty = -2;
  const isSplat = (s) => s === "*";
  function computeScore(path, index) {
    let segments = path.split("/");
    let initialScore = segments.length;
    if (segments.some(isSplat)) {
      initialScore += splatPenalty;
    }
    if (index) {
      initialScore += indexRouteValue;
    }
    return segments.filter((s) => !isSplat(s)).reduce((score, segment) => score + (paramRe.test(segment) ? dynamicSegmentValue : segment === "" ? emptySegmentValue : staticSegmentValue), initialScore);
  }
  function compareIndexes(a, b) {
    let siblings = a.length === b.length && a.slice(0, -1).every((n2, i) => n2 === b[i]);
    return siblings ? (
      // If two routes are siblings, we should try to match the earlier sibling
      // first. This allows people to have fine-grained control over the matching
      // behavior by simply putting routes with identical paths in the order they
      // want them tried.
      a[a.length - 1] - b[b.length - 1]
    ) : (
      // Otherwise, it doesn't really make sense to rank non-siblings by index,
      // so they sort equally.
      0
    );
  }
  function matchRouteBranch(branch, pathname, allowPartial) {
    let {
      routesMeta
    } = branch;
    let matchedParams = {};
    let matchedPathname = "/";
    let matches = [];
    for (let i = 0; i < routesMeta.length; ++i) {
      let meta = routesMeta[i];
      let end = i === routesMeta.length - 1;
      let remainingPathname = matchedPathname === "/" ? pathname : pathname.slice(matchedPathname.length) || "/";
      let match = matchPath({
        path: meta.relativePath,
        caseSensitive: meta.caseSensitive,
        end
      }, remainingPathname);
      let route = meta.route;
      if (!match) {
        return null;
      }
      Object.assign(matchedParams, match.params);
      matches.push({
        // TODO: Can this as be avoided?
        params: matchedParams,
        pathname: joinPaths([matchedPathname, match.pathname]),
        pathnameBase: normalizePathname(joinPaths([matchedPathname, match.pathnameBase])),
        route
      });
      if (match.pathnameBase !== "/") {
        matchedPathname = joinPaths([matchedPathname, match.pathnameBase]);
      }
    }
    return matches;
  }
  function matchPath(pattern, pathname) {
    if (typeof pattern === "string") {
      pattern = {
        path: pattern,
        caseSensitive: false,
        end: true
      };
    }
    let [matcher, compiledParams] = compilePath(pattern.path, pattern.caseSensitive, pattern.end);
    let match = pathname.match(matcher);
    if (!match) return null;
    let matchedPathname = match[0];
    let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
    let captureGroups = match.slice(1);
    let params = compiledParams.reduce((memo, _ref, index) => {
      let {
        paramName,
        isOptional
      } = _ref;
      if (paramName === "*") {
        let splatValue = captureGroups[index] || "";
        pathnameBase = matchedPathname.slice(0, matchedPathname.length - splatValue.length).replace(/(.)\/+$/, "$1");
      }
      const value = captureGroups[index];
      if (isOptional && !value) {
        memo[paramName] = void 0;
      } else {
        memo[paramName] = (value || "").replace(/%2F/g, "/");
      }
      return memo;
    }, {});
    return {
      params,
      pathname: matchedPathname,
      pathnameBase,
      pattern
    };
  }
  function compilePath(path, caseSensitive, end) {
    if (caseSensitive === void 0) {
      caseSensitive = false;
    }
    if (end === void 0) {
      end = true;
    }
    warning(path === "*" || !path.endsWith("*") || path.endsWith("/*"), 'Route path "' + path + '" will be treated as if it were ' + ('"' + path.replace(/\*$/, "/*") + '" because the `*` character must ') + "always follow a `/` in the pattern. To get rid of this warning, " + ('please change the route path to "' + path.replace(/\*$/, "/*") + '".'));
    let params = [];
    let regexpSource = "^" + path.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(/\/:([\w-]+)(\?)?/g, (_, paramName, isOptional) => {
      params.push({
        paramName,
        isOptional: isOptional != null
      });
      return isOptional ? "/?([^\\/]+)?" : "/([^\\/]+)";
    });
    if (path.endsWith("*")) {
      params.push({
        paramName: "*"
      });
      regexpSource += path === "*" || path === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$";
    } else if (end) {
      regexpSource += "\\/*$";
    } else if (path !== "" && path !== "/") {
      regexpSource += "(?:(?=\\/|$))";
    } else ;
    let matcher = new RegExp(regexpSource, caseSensitive ? void 0 : "i");
    return [matcher, params];
  }
  function decodePath(value) {
    try {
      return value.split("/").map((v) => decodeURIComponent(v).replace(/\//g, "%2F")).join("/");
    } catch (error) {
      warning(false, 'The URL path "' + value + '" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent ' + ("encoding (" + error + ")."));
      return value;
    }
  }
  function stripBasename(pathname, basename) {
    if (basename === "/") return pathname;
    if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) {
      return null;
    }
    let startIndex = basename.endsWith("/") ? basename.length - 1 : basename.length;
    let nextChar = pathname.charAt(startIndex);
    if (nextChar && nextChar !== "/") {
      return null;
    }
    return pathname.slice(startIndex) || "/";
  }
  const joinPaths = (paths) => paths.join("/").replace(/\/\/+/g, "/");
  const normalizePathname = (pathname) => pathname.replace(/\/+$/, "").replace(/^\/*/, "/");
  function isRouteErrorResponse(error) {
    return error != null && typeof error.status === "number" && typeof error.statusText === "string" && typeof error.internal === "boolean" && "data" in error;
  }
  const validMutationMethodsArr = ["post", "put", "patch", "delete"];
  new Set(validMutationMethodsArr);
  const validRequestMethodsArr = ["get", ...validMutationMethodsArr];
  new Set(validRequestMethodsArr);
  /**
   * React Router v6.30.1
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   */
  function _extends() {
    _extends = Object.assign ? Object.assign.bind() : function(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }
  const DataRouterContext = /* @__PURE__ */ React__namespace.createContext(null);
  const DataRouterStateContext = /* @__PURE__ */ React__namespace.createContext(null);
  const NavigationContext = /* @__PURE__ */ React__namespace.createContext(null);
  const LocationContext = /* @__PURE__ */ React__namespace.createContext(null);
  const RouteContext = /* @__PURE__ */ React__namespace.createContext({
    outlet: null,
    matches: [],
    isDataRoute: false
  });
  const RouteErrorContext = /* @__PURE__ */ React__namespace.createContext(null);
  function useInRouterContext() {
    return React__namespace.useContext(LocationContext) != null;
  }
  function useLocation() {
    !useInRouterContext() ? invariant(false) : void 0;
    return React__namespace.useContext(LocationContext).location;
  }
  function useRoutes(routes, locationArg) {
    return useRoutesImpl(routes, locationArg);
  }
  function useRoutesImpl(routes, locationArg, dataRouterState, future) {
    !useInRouterContext() ? invariant(false) : void 0;
    let {
      navigator
    } = React__namespace.useContext(NavigationContext);
    let {
      matches: parentMatches
    } = React__namespace.useContext(RouteContext);
    let routeMatch = parentMatches[parentMatches.length - 1];
    let parentParams = routeMatch ? routeMatch.params : {};
    routeMatch ? routeMatch.pathname : "/";
    let parentPathnameBase = routeMatch ? routeMatch.pathnameBase : "/";
    routeMatch && routeMatch.route;
    let locationFromContext = useLocation();
    let location;
    if (locationArg) {
      var _parsedLocationArg$pa;
      let parsedLocationArg = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
      !(parentPathnameBase === "/" || ((_parsedLocationArg$pa = parsedLocationArg.pathname) == null ? void 0 : _parsedLocationArg$pa.startsWith(parentPathnameBase))) ? invariant(false) : void 0;
      location = parsedLocationArg;
    } else {
      location = locationFromContext;
    }
    let pathname = location.pathname || "/";
    let remainingPathname = pathname;
    if (parentPathnameBase !== "/") {
      let parentSegments = parentPathnameBase.replace(/^\//, "").split("/");
      let segments = pathname.replace(/^\//, "").split("/");
      remainingPathname = "/" + segments.slice(parentSegments.length).join("/");
    }
    let matches = matchRoutes(routes, {
      pathname: remainingPathname
    });
    let renderedMatches = _renderMatches(matches && matches.map((match) => Object.assign({}, match, {
      params: Object.assign({}, parentParams, match.params),
      pathname: joinPaths([
        parentPathnameBase,
        // Re-encode pathnames that were decoded inside matchRoutes
        navigator.encodeLocation ? navigator.encodeLocation(match.pathname).pathname : match.pathname
      ]),
      pathnameBase: match.pathnameBase === "/" ? parentPathnameBase : joinPaths([
        parentPathnameBase,
        // Re-encode pathnames that were decoded inside matchRoutes
        navigator.encodeLocation ? navigator.encodeLocation(match.pathnameBase).pathname : match.pathnameBase
      ])
    })), parentMatches, dataRouterState, future);
    if (locationArg && renderedMatches) {
      return /* @__PURE__ */ React__namespace.createElement(LocationContext.Provider, {
        value: {
          location: _extends({
            pathname: "/",
            search: "",
            hash: "",
            state: null,
            key: "default"
          }, location),
          navigationType: Action.Pop
        }
      }, renderedMatches);
    }
    return renderedMatches;
  }
  function DefaultErrorComponent() {
    let error = useRouteError();
    let message = isRouteErrorResponse(error) ? error.status + " " + error.statusText : error instanceof Error ? error.message : JSON.stringify(error);
    let stack = error instanceof Error ? error.stack : null;
    let lightgrey = "rgba(200,200,200, 0.5)";
    let preStyles = {
      padding: "0.5rem",
      backgroundColor: lightgrey
    };
    let devInfo = null;
    return /* @__PURE__ */ React__namespace.createElement(React__namespace.Fragment, null, /* @__PURE__ */ React__namespace.createElement("h2", null, "Unexpected Application Error!"), /* @__PURE__ */ React__namespace.createElement("h3", {
      style: {
        fontStyle: "italic"
      }
    }, message), stack ? /* @__PURE__ */ React__namespace.createElement("pre", {
      style: preStyles
    }, stack) : null, devInfo);
  }
  const defaultErrorElement = /* @__PURE__ */ React__namespace.createElement(DefaultErrorComponent, null);
  class RenderErrorBoundary extends React__namespace.Component {
    constructor(props) {
      super(props);
      this.state = {
        location: props.location,
        revalidation: props.revalidation,
        error: props.error
      };
    }
    static getDerivedStateFromError(error) {
      return {
        error
      };
    }
    static getDerivedStateFromProps(props, state) {
      if (state.location !== props.location || state.revalidation !== "idle" && props.revalidation === "idle") {
        return {
          error: props.error,
          location: props.location,
          revalidation: props.revalidation
        };
      }
      return {
        error: props.error !== void 0 ? props.error : state.error,
        location: state.location,
        revalidation: props.revalidation || state.revalidation
      };
    }
    componentDidCatch(error, errorInfo) {
      console.error("React Router caught the following error during render", error, errorInfo);
    }
    render() {
      return this.state.error !== void 0 ? /* @__PURE__ */ React__namespace.createElement(RouteContext.Provider, {
        value: this.props.routeContext
      }, /* @__PURE__ */ React__namespace.createElement(RouteErrorContext.Provider, {
        value: this.state.error,
        children: this.props.component
      })) : this.props.children;
    }
  }
  function RenderedRoute(_ref) {
    let {
      routeContext,
      match,
      children
    } = _ref;
    let dataRouterContext = React__namespace.useContext(DataRouterContext);
    if (dataRouterContext && dataRouterContext.static && dataRouterContext.staticContext && (match.route.errorElement || match.route.ErrorBoundary)) {
      dataRouterContext.staticContext._deepestRenderedBoundaryId = match.route.id;
    }
    return /* @__PURE__ */ React__namespace.createElement(RouteContext.Provider, {
      value: routeContext
    }, children);
  }
  function _renderMatches(matches, parentMatches, dataRouterState, future) {
    var _dataRouterState;
    if (parentMatches === void 0) {
      parentMatches = [];
    }
    if (dataRouterState === void 0) {
      dataRouterState = null;
    }
    if (future === void 0) {
      future = null;
    }
    if (matches == null) {
      var _future;
      if (!dataRouterState) {
        return null;
      }
      if (dataRouterState.errors) {
        matches = dataRouterState.matches;
      } else if ((_future = future) != null && _future.v7_partialHydration && parentMatches.length === 0 && !dataRouterState.initialized && dataRouterState.matches.length > 0) {
        matches = dataRouterState.matches;
      } else {
        return null;
      }
    }
    let renderedMatches = matches;
    let errors = (_dataRouterState = dataRouterState) == null ? void 0 : _dataRouterState.errors;
    if (errors != null) {
      let errorIndex = renderedMatches.findIndex((m2) => m2.route.id && (errors == null ? void 0 : errors[m2.route.id]) !== void 0);
      !(errorIndex >= 0) ? invariant(false) : void 0;
      renderedMatches = renderedMatches.slice(0, Math.min(renderedMatches.length, errorIndex + 1));
    }
    let renderFallback = false;
    let fallbackIndex = -1;
    if (dataRouterState && future && future.v7_partialHydration) {
      for (let i = 0; i < renderedMatches.length; i++) {
        let match = renderedMatches[i];
        if (match.route.HydrateFallback || match.route.hydrateFallbackElement) {
          fallbackIndex = i;
        }
        if (match.route.id) {
          let {
            loaderData,
            errors: errors2
          } = dataRouterState;
          let needsToRunLoader = match.route.loader && loaderData[match.route.id] === void 0 && (!errors2 || errors2[match.route.id] === void 0);
          if (match.route.lazy || needsToRunLoader) {
            renderFallback = true;
            if (fallbackIndex >= 0) {
              renderedMatches = renderedMatches.slice(0, fallbackIndex + 1);
            } else {
              renderedMatches = [renderedMatches[0]];
            }
            break;
          }
        }
      }
    }
    return renderedMatches.reduceRight((outlet, match, index) => {
      let error;
      let shouldRenderHydrateFallback = false;
      let errorElement = null;
      let hydrateFallbackElement = null;
      if (dataRouterState) {
        error = errors && match.route.id ? errors[match.route.id] : void 0;
        errorElement = match.route.errorElement || defaultErrorElement;
        if (renderFallback) {
          if (fallbackIndex < 0 && index === 0) {
            warningOnce("route-fallback");
            shouldRenderHydrateFallback = true;
            hydrateFallbackElement = null;
          } else if (fallbackIndex === index) {
            shouldRenderHydrateFallback = true;
            hydrateFallbackElement = match.route.hydrateFallbackElement || null;
          }
        }
      }
      let matches2 = parentMatches.concat(renderedMatches.slice(0, index + 1));
      let getChildren = () => {
        let children;
        if (error) {
          children = errorElement;
        } else if (shouldRenderHydrateFallback) {
          children = hydrateFallbackElement;
        } else if (match.route.Component) {
          children = /* @__PURE__ */ React__namespace.createElement(match.route.Component, null);
        } else if (match.route.element) {
          children = match.route.element;
        } else {
          children = outlet;
        }
        return /* @__PURE__ */ React__namespace.createElement(RenderedRoute, {
          match,
          routeContext: {
            outlet,
            matches: matches2,
            isDataRoute: dataRouterState != null
          },
          children
        });
      };
      return dataRouterState && (match.route.ErrorBoundary || match.route.errorElement || index === 0) ? /* @__PURE__ */ React__namespace.createElement(RenderErrorBoundary, {
        location: dataRouterState.location,
        revalidation: dataRouterState.revalidation,
        component: errorElement,
        error,
        children: getChildren(),
        routeContext: {
          outlet: null,
          matches: matches2,
          isDataRoute: true
        }
      }) : getChildren();
    }, null);
  }
  var DataRouterStateHook$1 = /* @__PURE__ */ function(DataRouterStateHook2) {
    DataRouterStateHook2["UseBlocker"] = "useBlocker";
    DataRouterStateHook2["UseLoaderData"] = "useLoaderData";
    DataRouterStateHook2["UseActionData"] = "useActionData";
    DataRouterStateHook2["UseRouteError"] = "useRouteError";
    DataRouterStateHook2["UseNavigation"] = "useNavigation";
    DataRouterStateHook2["UseRouteLoaderData"] = "useRouteLoaderData";
    DataRouterStateHook2["UseMatches"] = "useMatches";
    DataRouterStateHook2["UseRevalidator"] = "useRevalidator";
    DataRouterStateHook2["UseNavigateStable"] = "useNavigate";
    DataRouterStateHook2["UseRouteId"] = "useRouteId";
    return DataRouterStateHook2;
  }(DataRouterStateHook$1 || {});
  function useDataRouterState(hookName) {
    let state = React__namespace.useContext(DataRouterStateContext);
    !state ? invariant(false) : void 0;
    return state;
  }
  function useRouteContext(hookName) {
    let route = React__namespace.useContext(RouteContext);
    !route ? invariant(false) : void 0;
    return route;
  }
  function useCurrentRouteId(hookName) {
    let route = useRouteContext();
    let thisRoute = route.matches[route.matches.length - 1];
    !thisRoute.route.id ? invariant(false) : void 0;
    return thisRoute.route.id;
  }
  function useRouteError() {
    var _state$errors;
    let error = React__namespace.useContext(RouteErrorContext);
    let state = useDataRouterState(DataRouterStateHook$1.UseRouteError);
    let routeId = useCurrentRouteId();
    if (error !== void 0) {
      return error;
    }
    return (_state$errors = state.errors) == null ? void 0 : _state$errors[routeId];
  }
  const alreadyWarned$1 = {};
  function warningOnce(key, cond, message) {
    if (!alreadyWarned$1[key]) {
      alreadyWarned$1[key] = true;
    }
  }
  function logV6DeprecationWarnings(renderFuture, routerFuture) {
    if ((renderFuture == null ? void 0 : renderFuture.v7_startTransition) === void 0) ;
    if ((renderFuture == null ? void 0 : renderFuture.v7_relativeSplatPath) === void 0 && true) ;
  }
  function Route(_props) {
    invariant(false);
  }
  function Router(_ref5) {
    let {
      basename: basenameProp = "/",
      children = null,
      location: locationProp,
      navigationType = Action.Pop,
      navigator,
      static: staticProp = false,
      future
    } = _ref5;
    !!useInRouterContext() ? invariant(false) : void 0;
    let basename = basenameProp.replace(/^\/*/, "/");
    let navigationContext = React__namespace.useMemo(() => ({
      basename,
      navigator,
      static: staticProp,
      future: _extends({
        v7_relativeSplatPath: false
      }, future)
    }), [basename, future, navigator, staticProp]);
    if (typeof locationProp === "string") {
      locationProp = parsePath(locationProp);
    }
    let {
      pathname = "/",
      search = "",
      hash = "",
      state = null,
      key = "default"
    } = locationProp;
    let locationContext = React__namespace.useMemo(() => {
      let trailingPathname = stripBasename(pathname, basename);
      if (trailingPathname == null) {
        return null;
      }
      return {
        location: {
          pathname: trailingPathname,
          search,
          hash,
          state,
          key
        },
        navigationType
      };
    }, [basename, pathname, search, hash, state, key, navigationType]);
    if (locationContext == null) {
      return null;
    }
    return /* @__PURE__ */ React__namespace.createElement(NavigationContext.Provider, {
      value: navigationContext
    }, /* @__PURE__ */ React__namespace.createElement(LocationContext.Provider, {
      children,
      value: locationContext
    }));
  }
  function Routes(_ref6) {
    let {
      children,
      location
    } = _ref6;
    return useRoutes(createRoutesFromChildren(children), location);
  }
  new Promise(() => {
  });
  function createRoutesFromChildren(children, parentPath) {
    if (parentPath === void 0) {
      parentPath = [];
    }
    let routes = [];
    React__namespace.Children.forEach(children, (element, index) => {
      if (!/* @__PURE__ */ React__namespace.isValidElement(element)) {
        return;
      }
      let treePath = [...parentPath, index];
      if (element.type === React__namespace.Fragment) {
        routes.push.apply(routes, createRoutesFromChildren(element.props.children, treePath));
        return;
      }
      !(element.type === Route) ? invariant(false) : void 0;
      !(!element.props.index || !element.props.children) ? invariant(false) : void 0;
      let route = {
        id: element.props.id || treePath.join("-"),
        caseSensitive: element.props.caseSensitive,
        element: element.props.element,
        Component: element.props.Component,
        index: element.props.index,
        path: element.props.path,
        loader: element.props.loader,
        action: element.props.action,
        errorElement: element.props.errorElement,
        ErrorBoundary: element.props.ErrorBoundary,
        hasErrorBoundary: element.props.ErrorBoundary != null || element.props.errorElement != null,
        shouldRevalidate: element.props.shouldRevalidate,
        handle: element.props.handle,
        lazy: element.props.lazy
      };
      if (element.props.children) {
        route.children = createRoutesFromChildren(element.props.children, treePath);
      }
      routes.push(route);
    });
    return routes;
  }
  /**
   * React Router DOM v6.30.1
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   */
  const REACT_ROUTER_VERSION = "6";
  try {
    window.__reactRouterVersion = REACT_ROUTER_VERSION;
  } catch (e) {
  }
  const START_TRANSITION = "startTransition";
  const startTransitionImpl = React__namespace[START_TRANSITION];
  function BrowserRouter(_ref4) {
    let {
      basename,
      children,
      future,
      window: window2
    } = _ref4;
    let historyRef = React__namespace.useRef();
    if (historyRef.current == null) {
      historyRef.current = createBrowserHistory({
        window: window2,
        v5Compat: true
      });
    }
    let history = historyRef.current;
    let [state, setStateImpl] = React__namespace.useState({
      action: history.action,
      location: history.location
    });
    let {
      v7_startTransition
    } = future || {};
    let setState = React__namespace.useCallback((newState) => {
      v7_startTransition && startTransitionImpl ? startTransitionImpl(() => setStateImpl(newState)) : setStateImpl(newState);
    }, [setStateImpl, v7_startTransition]);
    React__namespace.useLayoutEffect(() => history.listen(setState), [history, setState]);
    React__namespace.useEffect(() => logV6DeprecationWarnings(future), [future]);
    return /* @__PURE__ */ React__namespace.createElement(Router, {
      basename,
      children,
      location: state.location,
      navigationType: state.action,
      navigator: history,
      future
    });
  }
  var DataRouterHook;
  (function(DataRouterHook2) {
    DataRouterHook2["UseScrollRestoration"] = "useScrollRestoration";
    DataRouterHook2["UseSubmit"] = "useSubmit";
    DataRouterHook2["UseSubmitFetcher"] = "useSubmitFetcher";
    DataRouterHook2["UseFetcher"] = "useFetcher";
    DataRouterHook2["useViewTransitionState"] = "useViewTransitionState";
  })(DataRouterHook || (DataRouterHook = {}));
  var DataRouterStateHook;
  (function(DataRouterStateHook2) {
    DataRouterStateHook2["UseFetcher"] = "useFetcher";
    DataRouterStateHook2["UseFetchers"] = "useFetchers";
    DataRouterStateHook2["UseScrollRestoration"] = "useScrollRestoration";
  })(DataRouterStateHook || (DataRouterStateHook = {}));
  const Dashboard = () => {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "embedpress-admin-dashboard", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "EmbedPress Dashboard" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Welcome to the EmbedPress admin dashboard." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dashboard-stats", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stat-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Total Embeds" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "stat-number", children: "0" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stat-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Total Views" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "stat-number", children: "0" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stat-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Active Blocks" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "stat-number", children: "0" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dashboard-actions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "button button-primary", children: "Create New Embed" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "button", children: "View Analytics" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "button", children: "Settings" })
      ] })
    ] });
  };
  const Analytics = () => {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "embedpress-analytics", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "Analytics" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "View detailed analytics for your embeds." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "analytics-overview", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "metric-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Total Views" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "metric-value", children: "0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "metric-change", children: "+0%" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "metric-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Total Clicks" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "metric-value", children: "0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "metric-change", children: "+0%" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "metric-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Impressions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "metric-value", children: "0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "metric-change", children: "+0%" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "metric-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Unique Viewers" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "metric-value", children: "0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "metric-change", children: "+0%" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "analytics-charts", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "chart-container", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Views Over Time" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "chart-placeholder", children: "Chart will be rendered here" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "chart-container", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Top Performing Embeds" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "chart-placeholder", children: "Chart will be rendered here" })
        ] })
      ] })
    ] });
  };
  const Settings = () => {
    const [settings, setSettings] = React2.useState({
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
  const Onboarding = () => {
    const [currentStep, setCurrentStep] = React2.useState(1);
    const totalSteps = 4;
    const nextStep = () => {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    };
    const prevStep = () => {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
      }
    };
    const renderStep = () => {
      switch (currentStep) {
        case 1:
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "onboarding-step", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Welcome to EmbedPress!" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Let's get you started with embedding content in WordPress." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "step-content", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/assets/img/welcome.svg", alt: "Welcome" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Embed videos, documents, and more" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Track analytics and engagement" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Customize appearance and behavior" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Works with Gutenberg and Elementor" })
              ] })
            ] })
          ] });
        case 2:
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "onboarding-step", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Choose Your Blocks" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Select which EmbedPress blocks you want to enable." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "step-content", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "block-options", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", defaultChecked: true }),
                "EmbedPress Block"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", defaultChecked: true }),
                "PDF Block"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", defaultChecked: true }),
                "Document Block"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox" }),
                "Calendar Block"
              ] })
            ] }) })
          ] });
        case 3:
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "onboarding-step", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Configure Analytics" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Set up analytics to track your embed performance." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "step-content", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "analytics-options", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", defaultChecked: true }),
                "Enable view tracking"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", defaultChecked: true }),
                "Enable click tracking"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox" }),
                "Enable geo tracking"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox" }),
                "Enable device analytics"
              ] })
            ] }) })
          ] });
        case 4:
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "onboarding-step", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "You're All Set!" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "EmbedPress is ready to use. Start creating amazing embeds!" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "step-content", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "completion-actions", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "button button-primary button-large", children: "Create Your First Embed" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "button button-large", children: "View Documentation" })
            ] }) })
          ] });
        default:
          return null;
      }
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "embedpress-onboarding", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "onboarding-progress", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "progress-bar", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "progress-fill",
            style: { width: `${currentStep / totalSteps * 100}%` }
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "progress-text", children: [
          "Step ",
          currentStep,
          " of ",
          totalSteps
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "onboarding-content", children: renderStep() }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "onboarding-navigation", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: prevStep,
            disabled: currentStep === 1,
            className: "button",
            children: "Previous"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: nextStep,
            disabled: currentStep === totalSteps,
            className: "button button-primary",
            children: currentStep === totalSteps ? "Finish" : "Next"
          }
        )
      ] })
    ] });
  };
  const Layout = ({ children }) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "embedpress-layout", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "embedpress-header", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "embedpress-logo", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "EmbedPress" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "embedpress-nav", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#dashboard", children: "Dashboard" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#analytics", children: "Analytics" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#settings", children: "Settings" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "embedpress-main", children }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "embedpress-footer", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "© 2024 EmbedPress. All rights reserved." }) })
    ] });
  };
  class ErrorBoundary extends React2.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
      console.error("EmbedPress Error Boundary caught an error:", error, errorInfo);
    }
    render() {
      var _a;
      if (this.state.hasError) {
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "embedpress-error-boundary", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Something went wrong" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "An error occurred while loading this component." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("summary", { children: "Error details" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { children: (_a = this.state.error) == null ? void 0 : _a.toString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => this.setState({ hasError: false, error: null }),
              className: "button",
              children: "Try again"
            }
          )
        ] });
      }
      return this.props.children;
    }
  }
  const App = () => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorBoundary, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(BrowserRouter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Routes, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Dashboard, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/analytics", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Analytics, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/settings", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/onboarding", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Onboarding, {}) })
    ] }) }) }) });
  };
  const container = document.getElementById("embedpress-admin-root");
  if (container) {
    const root = createRoot(container);
    root.render(/* @__PURE__ */ jsxRuntimeExports.jsx(App, {}));
  }
})(React, ReactDOM);
//# sourceMappingURL=admin.build.js.map
