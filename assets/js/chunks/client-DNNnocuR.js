import { a as getAugmentedNamespace, b as reactDom } from "./index-DUMpZcOk.js";
const require$$0 = /* @__PURE__ */ getAugmentedNamespace(reactDom);
var createRoot;
var m = require$$0;
{
  var i = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  createRoot = function(c, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.createRoot(c, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
}
export {
  createRoot as c
};
//# sourceMappingURL=client-DNNnocuR.js.map
