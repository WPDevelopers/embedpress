(function(l){"use strict";var n={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var s=l,p=Symbol.for("react.element"),y=Symbol.for("react.fragment"),c=Object.prototype.hasOwnProperty,d=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,m={key:!0,ref:!0,__self:!0,__source:!0};function f(t,e,u){var r,o={},_=null,i=null;u!==void 0&&(_=""+u),e.key!==void 0&&(_=""+e.key),e.ref!==void 0&&(i=e.ref);for(r in e)c.call(e,r)&&!m.hasOwnProperty(r)&&(o[r]=e[r]);if(t&&t.defaultProps)for(r in e=t.defaultProps,e)o[r]===void 0&&(o[r]=e[r]);return{$$typeof:p,type:t,key:_,ref:i,props:o,_owner:d.current}}n.Fragment=y,n.jsx=f,n.jsxs=f})(React);
//# sourceMappingURL=analytics.build.js.map
