document.addEventListener("DOMContentLoaded", function() {
  console.log("EmbedPress Frontend loaded");
  initializeEmbeds();
});
function initializeEmbeds() {
  const embeds = document.querySelectorAll(".embedpress-block, .embedpress-embed");
  embeds.forEach((embed) => {
    console.log("Initializing embed:", embed);
  });
}
//# sourceMappingURL=frontend.build.js.map
