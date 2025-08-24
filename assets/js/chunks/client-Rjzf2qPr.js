import ReactDOM from "react-dom";
var createRoot;
var m = ReactDOM;
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
//# sourceMappingURL=client-Rjzf2qPr.js.map
