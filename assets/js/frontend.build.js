(function() {
  "use strict";
  const trackEvent = (eventName, properties = {}) => {
    console.log("EmbedPress Event:", eventName, properties);
    if (typeof gtag !== "undefined") {
      gtag("event", eventName, properties);
    }
  };
  document.addEventListener("DOMContentLoaded", function() {
    console.log("EmbedPress Frontend loaded");
    trackEvent("page_load", {
      url: window.location.href,
      timestamp: Date.now()
    });
    initializeEmbeds();
  });
  function initializeEmbeds() {
    const embeds = document.querySelectorAll(".embedpress-block, .embedpress-embed");
    embeds.forEach((embed) => {
      console.log("Initializing embed:", embed);
    });
  }
})();
//# sourceMappingURL=frontend.build.js.map
