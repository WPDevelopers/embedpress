// vite.config.js
import { defineConfig } from "file:///Volumes/WorkSpace/WordPress/embedpress/wp-content/plugins/embedpress/node_modules/vite/dist/node/index.js";
import react from "file:///Volumes/WorkSpace/WordPress/embedpress/wp-content/plugins/embedpress/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
import { fileURLToPath } from "node:url";
import autoprefixer from "file:///Volumes/WorkSpace/WordPress/embedpress/wp-content/plugins/embedpress/node_modules/autoprefixer/lib/autoprefixer.js";
var __vite_injected_original_import_meta_url = "file:///Volumes/WorkSpace/WordPress/embedpress/wp-content/plugins/embedpress/vite.config.js";
var wordpressExternals = {
  "@wordpress/blocks": "wp.blocks",
  "@wordpress/block-editor": "wp.blockEditor",
  "@wordpress/components": "wp.components",
  "@wordpress/data": "wp.data",
  "@wordpress/element": "wp.element",
  "@wordpress/i18n": "wp.i18n",
  "@wordpress/compose": "wp.compose",
  "@wordpress/hooks": "wp.hooks",
  "@wordpress/api-fetch": "wp.apiFetch",
  "@wordpress/url": "wp.url",
  "@wordpress/html-entities": "wp.htmlEntities",
  "@wordpress/keycodes": "wp.keycodes",
  "@wordpress/primitives": "wp.primitives",
  "@wordpress/rich-text": "wp.richText",
  "@wordpress/server-side-render": "wp.serverSideRender",
  "@wordpress/viewport": "wp.viewport",
  "@wordpress/notices": "wp.notices",
  "@wordpress/plugins": "wp.plugins",
  "@wordpress/edit-post": "wp.editPost",
  "@wordpress/core-data": "wp.coreData",
  "react": "React",
  "react-dom": "ReactDOM",
  "jquery": "jQuery",
  "lodash": "lodash"
};
var staticAssets = {
  // Common assets (loaded everywhere)
  common: {
    css: [
      "static/css/embedpress.css",
      "static/css/el-icon.css",
      "static/css/font.css"
    ],
    js: [
      "static/js/front.js"
    ]
  },
  // Admin assets
  adminCommon: {
    css: [
      "static/css/admin.css",
      "static/css/admin-notices.css"
    ],
    js: [
      "static/js/admin.js",
      "static/js/license.js"
    ]
  },
  // Settings assets (migrated from old structure)
  settings: {
    css: [
      "static/css/settings-icons.css",
      "static/css/settings.css"
    ],
    js: [
      "static/js/settings.js"
    ]
  },
  // Block-specific assets
  videoPlayer: {
    css: ["static/css/plyr.css"],
    js: [
      "static/js/plyr.js",
      "static/js/plyr.polyfilled.js",
      "static/js/initplyr.js",
      "static/js/vimeo-player.js",
      "static/js/ytiframeapi.js"
    ]
  },
  carousel: {
    css: [
      "static/css/carousel.min.css",
      "static/css/glider.min.css"
    ],
    js: [
      "static/js/carousel.js",
      "static/js/carousel.min.js",
      "static/js/initCarousel.js",
      "static/js/glider.js",
      "static/js/glider.min.js"
    ]
  },
  gallery: {
    css: [],
    js: [
      "static/js/gallery-justify.js",
      "static/js/instafeed.js"
    ]
  },
  elementor: {
    css: ["static/css/embedpress-elementor.css"],
    js: []
  },
  pdfViewer: {
    css: ["static/css/preview.css"],
    js: [
      "static/js/pdfobject.js",
      "static/js/preview.js"
    ]
  },
  documentViewer: {
    css: [],
    js: ["static/js/documents-viewer-script.js"]
  },
  gutenberg: {
    css: [],
    js: ["static/js/gutneberg-script.js"]
  },
  embedUI: {
    css: [],
    js: ["static/js/embed-ui.min.js"]
  },
  ads: {
    css: [],
    js: ["static/js/ads.js"]
  },
  vendor: {
    css: [],
    js: [
      "static/js/vendor/bootstrap/bootstrap.min.js",
      "static/js/vendor/bootbox.min.js"
    ]
  },
  preview: {
    css: [],
    js: ["static/js/preview.js"]
  }
};
function createStaticAssetsPlugin() {
  return {
    name: "static-assets",
    resolveId(id) {
      if (id.startsWith("virtual:") || id.includes("virtual:")) {
        const virtualId = id.includes("virtual:") ? id.substring(id.indexOf("virtual:")) : id;
        return virtualId;
      }
      return null;
    },
    load(id) {
      if (id.startsWith("virtual:")) {
        const assetMap = {
          "virtual:common-assets": staticAssets.common,
          "virtual:admin-assets": staticAssets.adminCommon,
          "virtual:video-assets": staticAssets.videoPlayer,
          "virtual:carousel-assets": staticAssets.carousel,
          "virtual:gallery-assets": staticAssets.gallery,
          "virtual:elementor-assets": staticAssets.elementor,
          "virtual:pdf-assets": staticAssets.pdfViewer,
          "virtual:document-assets": staticAssets.documentViewer,
          "virtual:gutenberg-assets": staticAssets.gutenberg,
          "virtual:embed-assets": staticAssets.embedUI,
          "virtual:ads-assets": staticAssets.ads,
          "virtual:vendor-assets": staticAssets.vendor,
          "virtual:preview-assets": staticAssets.preview,
          "virtual:settings-assets": staticAssets.settings
        };
        const assets = assetMap[id];
        if (!assets) {
          return "";
        }
        const imports = [];
        assets.css.forEach((file) => {
          imports.push(`import '${path.resolve(process.cwd(), file)}';`);
        });
        assets.js.forEach((file) => {
          imports.push(`import '${path.resolve(process.cwd(), file)}';`);
        });
        return imports.join("\n");
      }
    }
  };
}
var buildConfigs = {
  // Gutenberg blocks (editor + frontend)
  blocks: {
    input: "src/Blocks/index.js",
    output: {
      entryFileNames: "js/blocks.build.js",
      cssFileName: "css/blocks.build.css",
      globals: wordpressExternals,
      external: Object.keys(wordpressExternals),
      format: "iife",
      name: "EmbedPressBlocks"
    }
  },
  analytics: {
    input: "src/Analytics/index.js",
    output: {
      entryFileNames: "js/analytics.build.js",
      cssFileName: "css/analytics.build.css",
      globals: wordpressExternals,
      external: Object.keys(wordpressExternals),
      format: "iife",
      name: "EmbedPressAnalytics"
    }
  },
  // Admin (React-based admin interface)
  admin: {
    input: "src/AdminUI/index.js",
    output: {
      entryFileNames: "js/admin.build.js",
      cssFileName: "css/admin.build.css",
      globals: { "react": "React", "react-dom": "ReactDOM" },
      external: ["react", "react-dom"],
      format: "iife",
      name: "EmbedPressAdmin"
    }
  },
  // Frontend scripts (vanilla JS + analytics)
  frontend: {
    input: "src/Frontend/index.js",
    output: {
      entryFileNames: "js/frontend.build.js",
      cssFileName: "css/frontend.build.css",
      globals: { "jquery": "jQuery" },
      external: ["jquery"],
      format: "iife",
      name: "EmbedPressFrontend"
    }
  },
  // Static assets bundles
  "admin-common": {
    input: "virtual:admin-assets",
    output: {
      entryFileNames: "js/admin-common.build.js",
      cssFileName: "css/admin-common.build.css",
      globals: { "jquery": "jQuery" },
      external: ["jquery"],
      format: "iife",
      name: "EmbedPressAdminCommon"
    }
  },
  "vendor": {
    input: "virtual:vendor-assets",
    output: {
      entryFileNames: "js/vendor.build.js",
      cssFileName: "css/vendor.build.css",
      format: "iife",
      name: "EmbedPressVendor"
    }
  },
  // Settings bundle (migrated from old structure)
  "settings": {
    input: "virtual:settings-assets",
    output: {
      entryFileNames: "js/settings.build.js",
      cssFileName: "css/settings.build.css",
      globals: { "jquery": "jQuery" },
      external: ["jquery"],
      format: "iife",
      name: "EmbedPressSettings"
    }
  },
  "preview": {
    input: "virtual:preview-assets",
    output: {
      entryFileNames: "js/preview.build.js",
      cssFileName: "css/preview.build.css",
      globals: { "jquery": "jQuery" },
      external: ["jquery"],
      format: "iife",
      name: "EmbedPressPreview"
    }
  },
  "common": {
    input: "virtual:common-assets",
    output: {
      entryFileNames: "js/common.build.js",
      cssFileName: "css/common.build.css",
      globals: { "jquery": "jQuery" },
      external: ["jquery"],
      format: "iife",
      name: "EmbedPressCommon"
    }
  },
  "video-player": {
    input: "virtual:video-assets",
    output: {
      entryFileNames: "js/video-player.build.js",
      cssFileName: "css/video-player.build.css",
      globals: { "jquery": "jQuery" },
      external: ["jquery"],
      format: "iife",
      name: "EmbedPressVideoPlayer"
    }
  },
  "carousel": {
    input: "virtual:carousel-assets",
    output: {
      entryFileNames: "js/carousel.build.js",
      cssFileName: "css/carousel.build.css",
      globals: { "jquery": "jQuery" },
      external: ["jquery"],
      format: "iife",
      name: "EmbedPressCarousel"
    }
  },
  "gallery": {
    input: "virtual:gallery-assets",
    output: {
      entryFileNames: "js/gallery.build.js",
      cssFileName: "css/gallery.build.css",
      globals: { "jquery": "jQuery" },
      external: ["jquery"],
      format: "iife",
      name: "EmbedPressGallery"
    }
  },
  "elementor": {
    input: "virtual:elementor-assets",
    output: {
      entryFileNames: "js/elementor.build.js",
      cssFileName: "css/elementor.build.css",
      globals: { "jquery": "jQuery" },
      external: ["jquery"],
      format: "iife",
      name: "EmbedPressElementor"
    }
  },
  "pdf-viewer": {
    input: "virtual:pdf-assets",
    output: {
      entryFileNames: "js/pdf-viewer.build.js",
      cssFileName: "css/pdf-viewer.build.css",
      globals: { "jquery": "jQuery" },
      external: ["jquery"],
      format: "iife",
      name: "EmbedPressPDFViewer"
    }
  },
  "document-viewer": {
    input: "virtual:document-assets",
    output: {
      entryFileNames: "js/document-viewer.build.js",
      cssFileName: "css/document-viewer.build.css",
      globals: { "jquery": "jQuery" },
      external: ["jquery"],
      format: "iife",
      name: "EmbedPressDocumentViewer"
    }
  },
  "gutenberg": {
    input: "virtual:gutenberg-assets",
    output: {
      entryFileNames: "js/gutenberg.build.js",
      cssFileName: "css/gutenberg.build.css",
      globals: { "jquery": "jQuery" },
      external: ["jquery"],
      format: "iife",
      name: "EmbedPressGutenberg"
    }
  },
  "embed-ui": {
    input: "virtual:embed-assets",
    output: {
      entryFileNames: "js/embed-ui.build.js",
      cssFileName: "css/embed-ui.build.css",
      globals: { "jquery": "jQuery" },
      external: ["jquery"],
      format: "iife",
      name: "EmbedPressEmbedUI"
    }
  },
  "ads": {
    input: "virtual:ads-assets",
    output: {
      entryFileNames: "js/ads.build.js",
      cssFileName: "css/ads.build.css",
      globals: { "jquery": "jQuery" },
      external: ["jquery"],
      format: "iife",
      name: "EmbedPressAds"
    }
  }
};
var vite_config_default = defineConfig(({ command, mode }) => {
  const isProduction = mode === "production";
  const __dirname = path.dirname(fileURLToPath(__vite_injected_original_import_meta_url));
  const buildTarget = process.env.BUILD_TARGET || "blocks";
  const config = buildConfigs[buildTarget];
  if (!config) {
    throw new Error(`Unknown build target: ${buildTarget}. Available targets: ${Object.keys(buildConfigs).join(", ")}`);
  }
  return {
    base: "./",
    // Use relative base path to preserve relative URLs
    plugins: [
      // Custom plugin to handle JSX in .js files
      {
        name: "treat-js-files-as-jsx",
        async transform(code, id) {
          if (!id.endsWith(".js")) return null;
          if (id.includes("node_modules")) return null;
          if (code.includes("<") && code.includes(">")) {
            const esbuild = await import("file:///Volumes/WorkSpace/WordPress/embedpress/wp-content/plugins/embedpress/node_modules/esbuild/lib/main.js");
            const result = await esbuild.transform(code, {
              loader: "jsx",
              jsx: "automatic",
              jsxImportSource: "react"
            });
            return result.code;
          }
          return null;
        }
      },
      createStaticAssetsPlugin(),
      react({
        jsxRuntime: "automatic",
        include: ["**/*.jsx"]
        // Only process .jsx files with React plugin
      })
    ],
    build: {
      outDir: "assets",
      emptyOutDir: false,
      sourcemap: !isProduction,
      cssCodeSplit: false,
      target: "es2015",
      minify: isProduction,
      rollupOptions: {
        input: path.resolve(__dirname, config.input),
        output: {
          format: config.output.format,
          entryFileNames: config.output.entryFileNames,
          assetFileNames: (assetInfo) => {
            const ext = path.extname(assetInfo.names?.[0] || "");
            if (ext === ".css") {
              return config.output.cssFileName;
            }
            if ([".png", ".jpg", ".jpeg", ".gif", ".svg"].includes(ext)) {
              return "img/[name][extname]";
            }
            if ([".woff", ".woff2", ".ttf", ".eot"].includes(ext)) {
              return "fonts/[name][extname]";
            }
            return "assets/[name][extname]";
          },
          globals: config.output.globals,
          name: config.output.name,
          inlineDynamicImports: true
          // Single input allows this
        },
        external: config.output.external
      }
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@components": path.resolve(__dirname, "src/Shared/components"),
        "@hooks": path.resolve(__dirname, "src/Shared/hooks"),
        "@utils": path.resolve(__dirname, "src/Shared/utils"),
        "@stores": path.resolve(__dirname, "src/Shared/stores"),
        "@services": path.resolve(__dirname, "src/Shared/services"),
        "@types": path.resolve(__dirname, "src/Shared/types"),
        "@assets": path.resolve(__dirname, "assets"),
        "@blocks": path.resolve(__dirname, "src/Blocks"),
        "@elementor": path.resolve(__dirname, "src/Elementor"),
        "@admin": path.resolve(__dirname, "src/AdminUI"),
        "@shortcodes": path.resolve(__dirname, "src/Shortcodes"),
        "@frontend": path.resolve(__dirname, "src/Frontend")
      }
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer
        ]
      }
    },
    define: {
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development"),
      "__DEV__": process.env.NODE_ENV === "development"
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVm9sdW1lcy9Xb3JrU3BhY2UvV29yZFByZXNzL2VtYmVkcHJlc3Mvd3AtY29udGVudC9wbHVnaW5zL2VtYmVkcHJlc3NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Wb2x1bWVzL1dvcmtTcGFjZS9Xb3JkUHJlc3MvZW1iZWRwcmVzcy93cC1jb250ZW50L3BsdWdpbnMvZW1iZWRwcmVzcy92aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVm9sdW1lcy9Xb3JrU3BhY2UvV29yZFByZXNzL2VtYmVkcHJlc3Mvd3AtY29udGVudC9wbHVnaW5zL2VtYmVkcHJlc3Mvdml0ZS5jb25maWcuanNcIjsvLyB2aXRlLmNvbmZpZy5qc1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAnbm9kZTp1cmwnO1xuaW1wb3J0IGF1dG9wcmVmaXhlciBmcm9tICdhdXRvcHJlZml4ZXInO1xuXG4vLyBXb3JkUHJlc3MgZXh0ZXJuYWxzIG1hcHBpbmdcbmNvbnN0IHdvcmRwcmVzc0V4dGVybmFscyA9IHtcbiAgICAnQHdvcmRwcmVzcy9ibG9ja3MnOiAnd3AuYmxvY2tzJyxcbiAgICAnQHdvcmRwcmVzcy9ibG9jay1lZGl0b3InOiAnd3AuYmxvY2tFZGl0b3InLFxuICAgICdAd29yZHByZXNzL2NvbXBvbmVudHMnOiAnd3AuY29tcG9uZW50cycsXG4gICAgJ0B3b3JkcHJlc3MvZGF0YSc6ICd3cC5kYXRhJyxcbiAgICAnQHdvcmRwcmVzcy9lbGVtZW50JzogJ3dwLmVsZW1lbnQnLFxuICAgICdAd29yZHByZXNzL2kxOG4nOiAnd3AuaTE4bicsXG4gICAgJ0B3b3JkcHJlc3MvY29tcG9zZSc6ICd3cC5jb21wb3NlJyxcbiAgICAnQHdvcmRwcmVzcy9ob29rcyc6ICd3cC5ob29rcycsXG4gICAgJ0B3b3JkcHJlc3MvYXBpLWZldGNoJzogJ3dwLmFwaUZldGNoJyxcbiAgICAnQHdvcmRwcmVzcy91cmwnOiAnd3AudXJsJyxcbiAgICAnQHdvcmRwcmVzcy9odG1sLWVudGl0aWVzJzogJ3dwLmh0bWxFbnRpdGllcycsXG4gICAgJ0B3b3JkcHJlc3Mva2V5Y29kZXMnOiAnd3Aua2V5Y29kZXMnLFxuICAgICdAd29yZHByZXNzL3ByaW1pdGl2ZXMnOiAnd3AucHJpbWl0aXZlcycsXG4gICAgJ0B3b3JkcHJlc3MvcmljaC10ZXh0JzogJ3dwLnJpY2hUZXh0JyxcbiAgICAnQHdvcmRwcmVzcy9zZXJ2ZXItc2lkZS1yZW5kZXInOiAnd3Auc2VydmVyU2lkZVJlbmRlcicsXG4gICAgJ0B3b3JkcHJlc3Mvdmlld3BvcnQnOiAnd3Audmlld3BvcnQnLFxuICAgICdAd29yZHByZXNzL25vdGljZXMnOiAnd3Aubm90aWNlcycsXG4gICAgJ0B3b3JkcHJlc3MvcGx1Z2lucyc6ICd3cC5wbHVnaW5zJyxcbiAgICAnQHdvcmRwcmVzcy9lZGl0LXBvc3QnOiAnd3AuZWRpdFBvc3QnLFxuICAgICdAd29yZHByZXNzL2NvcmUtZGF0YSc6ICd3cC5jb3JlRGF0YScsXG4gICAgJ3JlYWN0JzogJ1JlYWN0JyxcbiAgICAncmVhY3QtZG9tJzogJ1JlYWN0RE9NJyxcbiAgICAnanF1ZXJ5JzogJ2pRdWVyeScsXG4gICAgJ2xvZGFzaCc6ICdsb2Rhc2gnXG59O1xuXG4vLyBTdGF0aWMgYXNzZXRzIGNvbmZpZ3VyYXRpb25cbmNvbnN0IHN0YXRpY0Fzc2V0cyA9IHtcbiAgICAvLyBDb21tb24gYXNzZXRzIChsb2FkZWQgZXZlcnl3aGVyZSlcbiAgICBjb21tb246IHtcbiAgICAgICAgY3NzOiBbXG4gICAgICAgICAgICAnc3RhdGljL2Nzcy9lbWJlZHByZXNzLmNzcycsXG4gICAgICAgICAgICAnc3RhdGljL2Nzcy9lbC1pY29uLmNzcycsXG4gICAgICAgICAgICAnc3RhdGljL2Nzcy9mb250LmNzcydcbiAgICAgICAgXSxcbiAgICAgICAganM6IFtcbiAgICAgICAgICAgICdzdGF0aWMvanMvZnJvbnQuanMnXG4gICAgICAgIF1cbiAgICB9LFxuICAgIC8vIEFkbWluIGFzc2V0c1xuICAgIGFkbWluQ29tbW9uOiB7XG4gICAgICAgIGNzczogW1xuICAgICAgICAgICAgJ3N0YXRpYy9jc3MvYWRtaW4uY3NzJyxcbiAgICAgICAgICAgICdzdGF0aWMvY3NzL2FkbWluLW5vdGljZXMuY3NzJ1xuICAgICAgICBdLFxuICAgICAgICBqczogW1xuICAgICAgICAgICAgJ3N0YXRpYy9qcy9hZG1pbi5qcycsXG4gICAgICAgICAgICAnc3RhdGljL2pzL2xpY2Vuc2UuanMnXG4gICAgICAgIF1cbiAgICB9LFxuICAgIC8vIFNldHRpbmdzIGFzc2V0cyAobWlncmF0ZWQgZnJvbSBvbGQgc3RydWN0dXJlKVxuICAgIHNldHRpbmdzOiB7XG4gICAgICAgIGNzczogW1xuICAgICAgICAgICAgJ3N0YXRpYy9jc3Mvc2V0dGluZ3MtaWNvbnMuY3NzJyxcbiAgICAgICAgICAgICdzdGF0aWMvY3NzL3NldHRpbmdzLmNzcycsXG4gICAgICAgIF0sXG4gICAgICAgIGpzOiBbXG4gICAgICAgICAgICAnc3RhdGljL2pzL3NldHRpbmdzLmpzJ1xuICAgICAgICBdXG4gICAgfSxcbiAgICAvLyBCbG9jay1zcGVjaWZpYyBhc3NldHNcbiAgICB2aWRlb1BsYXllcjoge1xuICAgICAgICBjc3M6IFsnc3RhdGljL2Nzcy9wbHlyLmNzcyddLFxuICAgICAgICBqczogW1xuICAgICAgICAgICAgJ3N0YXRpYy9qcy9wbHlyLmpzJyxcbiAgICAgICAgICAgICdzdGF0aWMvanMvcGx5ci5wb2x5ZmlsbGVkLmpzJyxcbiAgICAgICAgICAgICdzdGF0aWMvanMvaW5pdHBseXIuanMnLFxuICAgICAgICAgICAgJ3N0YXRpYy9qcy92aW1lby1wbGF5ZXIuanMnLFxuICAgICAgICAgICAgJ3N0YXRpYy9qcy95dGlmcmFtZWFwaS5qcydcbiAgICAgICAgXVxuICAgIH0sXG4gICAgY2Fyb3VzZWw6IHtcbiAgICAgICAgY3NzOiBbXG4gICAgICAgICAgICAnc3RhdGljL2Nzcy9jYXJvdXNlbC5taW4uY3NzJyxcbiAgICAgICAgICAgICdzdGF0aWMvY3NzL2dsaWRlci5taW4uY3NzJ1xuICAgICAgICBdLFxuICAgICAgICBqczogW1xuICAgICAgICAgICAgJ3N0YXRpYy9qcy9jYXJvdXNlbC5qcycsXG4gICAgICAgICAgICAnc3RhdGljL2pzL2Nhcm91c2VsLm1pbi5qcycsXG4gICAgICAgICAgICAnc3RhdGljL2pzL2luaXRDYXJvdXNlbC5qcycsXG4gICAgICAgICAgICAnc3RhdGljL2pzL2dsaWRlci5qcycsXG4gICAgICAgICAgICAnc3RhdGljL2pzL2dsaWRlci5taW4uanMnXG4gICAgICAgIF1cbiAgICB9LFxuICAgIGdhbGxlcnk6IHtcbiAgICAgICAgY3NzOiBbXSxcbiAgICAgICAganM6IFtcbiAgICAgICAgICAgICdzdGF0aWMvanMvZ2FsbGVyeS1qdXN0aWZ5LmpzJyxcbiAgICAgICAgICAgICdzdGF0aWMvanMvaW5zdGFmZWVkLmpzJ1xuICAgICAgICBdXG4gICAgfSxcbiAgICBlbGVtZW50b3I6IHtcbiAgICAgICAgY3NzOiBbJ3N0YXRpYy9jc3MvZW1iZWRwcmVzcy1lbGVtZW50b3IuY3NzJ10sXG4gICAgICAgIGpzOiBbXVxuICAgIH0sXG4gICAgcGRmVmlld2VyOiB7XG4gICAgICAgIGNzczogWydzdGF0aWMvY3NzL3ByZXZpZXcuY3NzJ10sXG4gICAgICAgIGpzOiBbXG4gICAgICAgICAgICAnc3RhdGljL2pzL3BkZm9iamVjdC5qcycsXG4gICAgICAgICAgICAnc3RhdGljL2pzL3ByZXZpZXcuanMnXG4gICAgICAgIF1cbiAgICB9LFxuICAgIGRvY3VtZW50Vmlld2VyOiB7XG4gICAgICAgIGNzczogW10sXG4gICAgICAgIGpzOiBbJ3N0YXRpYy9qcy9kb2N1bWVudHMtdmlld2VyLXNjcmlwdC5qcyddXG4gICAgfSxcbiAgICBndXRlbmJlcmc6IHtcbiAgICAgICAgY3NzOiBbXSxcbiAgICAgICAganM6IFsnc3RhdGljL2pzL2d1dG5lYmVyZy1zY3JpcHQuanMnXVxuICAgIH0sXG4gICAgZW1iZWRVSToge1xuICAgICAgICBjc3M6IFtdLFxuICAgICAgICBqczogWydzdGF0aWMvanMvZW1iZWQtdWkubWluLmpzJ11cbiAgICB9LFxuICAgIGFkczoge1xuICAgICAgICBjc3M6IFtdLFxuICAgICAgICBqczogWydzdGF0aWMvanMvYWRzLmpzJ11cbiAgICB9LFxuICAgIHZlbmRvcjoge1xuICAgICAgICBjc3M6IFtdLFxuICAgICAgICBqczogW1xuICAgICAgICAgICAgJ3N0YXRpYy9qcy92ZW5kb3IvYm9vdHN0cmFwL2Jvb3RzdHJhcC5taW4uanMnLFxuICAgICAgICAgICAgJ3N0YXRpYy9qcy92ZW5kb3IvYm9vdGJveC5taW4uanMnLFxuICAgICAgICBdXG4gICAgfSxcbiAgICBwcmV2aWV3OiB7XG4gICAgICAgIGNzczogW10sXG4gICAgICAgIGpzOiBbJ3N0YXRpYy9qcy9wcmV2aWV3LmpzJ11cbiAgICB9LFxufTtcblxuXG5cbi8vIFZpcnR1YWwgcGx1Z2luIHRvIGhhbmRsZSBzdGF0aWMgYXNzZXRzXG5mdW5jdGlvbiBjcmVhdGVTdGF0aWNBc3NldHNQbHVnaW4oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogJ3N0YXRpYy1hc3NldHMnLFxuICAgICAgICByZXNvbHZlSWQoaWQpIHtcbiAgICAgICAgICAgIGlmIChpZC5zdGFydHNXaXRoKCd2aXJ0dWFsOicpIHx8IGlkLmluY2x1ZGVzKCd2aXJ0dWFsOicpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdmlydHVhbElkID0gaWQuaW5jbHVkZXMoJ3ZpcnR1YWw6JykgPyBpZC5zdWJzdHJpbmcoaWQuaW5kZXhPZigndmlydHVhbDonKSkgOiBpZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmlydHVhbElkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0sXG4gICAgICAgIGxvYWQoaWQpIHtcbiAgICAgICAgICAgIGlmIChpZC5zdGFydHNXaXRoKCd2aXJ0dWFsOicpKSB7XG4gICAgICAgICAgICAgICAgLy8gTWFwIHZpcnR1YWwgSURzIGRpcmVjdGx5IHRvIGFzc2V0IGdyb3Vwc1xuICAgICAgICAgICAgICAgIGNvbnN0IGFzc2V0TWFwID0ge1xuICAgICAgICAgICAgICAgICAgICAndmlydHVhbDpjb21tb24tYXNzZXRzJzogc3RhdGljQXNzZXRzLmNvbW1vbixcbiAgICAgICAgICAgICAgICAgICAgJ3ZpcnR1YWw6YWRtaW4tYXNzZXRzJzogc3RhdGljQXNzZXRzLmFkbWluQ29tbW9uLFxuICAgICAgICAgICAgICAgICAgICAndmlydHVhbDp2aWRlby1hc3NldHMnOiBzdGF0aWNBc3NldHMudmlkZW9QbGF5ZXIsXG4gICAgICAgICAgICAgICAgICAgICd2aXJ0dWFsOmNhcm91c2VsLWFzc2V0cyc6IHN0YXRpY0Fzc2V0cy5jYXJvdXNlbCxcbiAgICAgICAgICAgICAgICAgICAgJ3ZpcnR1YWw6Z2FsbGVyeS1hc3NldHMnOiBzdGF0aWNBc3NldHMuZ2FsbGVyeSxcbiAgICAgICAgICAgICAgICAgICAgJ3ZpcnR1YWw6ZWxlbWVudG9yLWFzc2V0cyc6IHN0YXRpY0Fzc2V0cy5lbGVtZW50b3IsXG4gICAgICAgICAgICAgICAgICAgICd2aXJ0dWFsOnBkZi1hc3NldHMnOiBzdGF0aWNBc3NldHMucGRmVmlld2VyLFxuICAgICAgICAgICAgICAgICAgICAndmlydHVhbDpkb2N1bWVudC1hc3NldHMnOiBzdGF0aWNBc3NldHMuZG9jdW1lbnRWaWV3ZXIsXG4gICAgICAgICAgICAgICAgICAgICd2aXJ0dWFsOmd1dGVuYmVyZy1hc3NldHMnOiBzdGF0aWNBc3NldHMuZ3V0ZW5iZXJnLFxuICAgICAgICAgICAgICAgICAgICAndmlydHVhbDplbWJlZC1hc3NldHMnOiBzdGF0aWNBc3NldHMuZW1iZWRVSSxcbiAgICAgICAgICAgICAgICAgICAgJ3ZpcnR1YWw6YWRzLWFzc2V0cyc6IHN0YXRpY0Fzc2V0cy5hZHMsXG4gICAgICAgICAgICAgICAgICAgICd2aXJ0dWFsOnZlbmRvci1hc3NldHMnOiBzdGF0aWNBc3NldHMudmVuZG9yLFxuICAgICAgICAgICAgICAgICAgICAndmlydHVhbDpwcmV2aWV3LWFzc2V0cyc6IHN0YXRpY0Fzc2V0cy5wcmV2aWV3LFxuICAgICAgICAgICAgICAgICAgICAndmlydHVhbDpzZXR0aW5ncy1hc3NldHMnOiBzdGF0aWNBc3NldHMuc2V0dGluZ3NcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgY29uc3QgYXNzZXRzID0gYXNzZXRNYXBbaWRdO1xuICAgICAgICAgICAgICAgIGlmICghYXNzZXRzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBpbXBvcnRzID0gW107XG4gICAgICAgICAgICAgICAgYXNzZXRzLmNzcy5mb3JFYWNoKGZpbGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpbXBvcnRzLnB1c2goYGltcG9ydCAnJHtwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgZmlsZSl9JztgKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBhc3NldHMuanMuZm9yRWFjaChmaWxlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaW1wb3J0cy5wdXNoKGBpbXBvcnQgJyR7cGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksIGZpbGUpfSc7YCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gaW1wb3J0cy5qb2luKCdcXG4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59XG5cbi8vIEJ1aWxkIGNvbmZpZ3VyYXRpb25zIGZvciBkaWZmZXJlbnQgY29udGV4dHNcbmNvbnN0IGJ1aWxkQ29uZmlncyA9IHtcbiAgICAvLyBHdXRlbmJlcmcgYmxvY2tzIChlZGl0b3IgKyBmcm9udGVuZClcbiAgICBibG9ja3M6IHtcbiAgICAgICAgaW5wdXQ6ICdzcmMvQmxvY2tzL2luZGV4LmpzJyxcbiAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgICBlbnRyeUZpbGVOYW1lczogJ2pzL2Jsb2Nrcy5idWlsZC5qcycsXG4gICAgICAgICAgICBjc3NGaWxlTmFtZTogJ2Nzcy9ibG9ja3MuYnVpbGQuY3NzJyxcbiAgICAgICAgICAgIGdsb2JhbHM6IHdvcmRwcmVzc0V4dGVybmFscyxcbiAgICAgICAgICAgIGV4dGVybmFsOiBPYmplY3Qua2V5cyh3b3JkcHJlc3NFeHRlcm5hbHMpLFxuICAgICAgICAgICAgZm9ybWF0OiAnaWlmZScsXG4gICAgICAgICAgICBuYW1lOiAnRW1iZWRQcmVzc0Jsb2NrcydcbiAgICAgICAgfVxuICAgIH0sXG4gICAgYW5hbHl0aWNzOiB7XG4gICAgICAgIGlucHV0OiAnc3JjL0FuYWx5dGljcy9pbmRleC5qcycsXG4gICAgICAgIG91dHB1dDoge1xuICAgICAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdqcy9hbmFseXRpY3MuYnVpbGQuanMnLFxuICAgICAgICAgICAgY3NzRmlsZU5hbWU6ICdjc3MvYW5hbHl0aWNzLmJ1aWxkLmNzcycsXG4gICAgICAgICAgICBnbG9iYWxzOiB3b3JkcHJlc3NFeHRlcm5hbHMsXG4gICAgICAgICAgICBleHRlcm5hbDogT2JqZWN0LmtleXMod29yZHByZXNzRXh0ZXJuYWxzKSxcbiAgICAgICAgICAgIGZvcm1hdDogJ2lpZmUnLFxuICAgICAgICAgICAgbmFtZTogJ0VtYmVkUHJlc3NBbmFseXRpY3MnXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gQWRtaW4gKFJlYWN0LWJhc2VkIGFkbWluIGludGVyZmFjZSlcbiAgICBhZG1pbjoge1xuICAgICAgICBpbnB1dDogJ3NyYy9BZG1pblVJL2luZGV4LmpzJyxcbiAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgICBlbnRyeUZpbGVOYW1lczogJ2pzL2FkbWluLmJ1aWxkLmpzJyxcbiAgICAgICAgICAgIGNzc0ZpbGVOYW1lOiAnY3NzL2FkbWluLmJ1aWxkLmNzcycsXG4gICAgICAgICAgICBnbG9iYWxzOiB7ICdyZWFjdCc6ICdSZWFjdCcsICdyZWFjdC1kb20nOiAnUmVhY3RET00nIH0sXG4gICAgICAgICAgICBleHRlcm5hbDogWydyZWFjdCcsICdyZWFjdC1kb20nXSxcbiAgICAgICAgICAgIGZvcm1hdDogJ2lpZmUnLFxuICAgICAgICAgICAgbmFtZTogJ0VtYmVkUHJlc3NBZG1pbidcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBGcm9udGVuZCBzY3JpcHRzICh2YW5pbGxhIEpTICsgYW5hbHl0aWNzKVxuICAgIGZyb250ZW5kOiB7XG4gICAgICAgIGlucHV0OiAnc3JjL0Zyb250ZW5kL2luZGV4LmpzJyxcbiAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgICBlbnRyeUZpbGVOYW1lczogJ2pzL2Zyb250ZW5kLmJ1aWxkLmpzJyxcbiAgICAgICAgICAgIGNzc0ZpbGVOYW1lOiAnY3NzL2Zyb250ZW5kLmJ1aWxkLmNzcycsXG4gICAgICAgICAgICBnbG9iYWxzOiB7ICdqcXVlcnknOiAnalF1ZXJ5JyB9LFxuICAgICAgICAgICAgZXh0ZXJuYWw6IFsnanF1ZXJ5J10sXG4gICAgICAgICAgICBmb3JtYXQ6ICdpaWZlJyxcbiAgICAgICAgICAgIG5hbWU6ICdFbWJlZFByZXNzRnJvbnRlbmQnXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gU3RhdGljIGFzc2V0cyBidW5kbGVzXG4gICAgJ2FkbWluLWNvbW1vbic6IHtcbiAgICAgICAgaW5wdXQ6ICd2aXJ0dWFsOmFkbWluLWFzc2V0cycsXG4gICAgICAgIG91dHB1dDoge1xuICAgICAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdqcy9hZG1pbi1jb21tb24uYnVpbGQuanMnLFxuICAgICAgICAgICAgY3NzRmlsZU5hbWU6ICdjc3MvYWRtaW4tY29tbW9uLmJ1aWxkLmNzcycsXG4gICAgICAgICAgICBnbG9iYWxzOiB7ICdqcXVlcnknOiAnalF1ZXJ5JyB9LFxuICAgICAgICAgICAgZXh0ZXJuYWw6IFsnanF1ZXJ5J10sXG4gICAgICAgICAgICBmb3JtYXQ6ICdpaWZlJyxcbiAgICAgICAgICAgIG5hbWU6ICdFbWJlZFByZXNzQWRtaW5Db21tb24nXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgJ3ZlbmRvcic6IHtcbiAgICAgICAgaW5wdXQ6ICd2aXJ0dWFsOnZlbmRvci1hc3NldHMnLFxuICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnanMvdmVuZG9yLmJ1aWxkLmpzJyxcbiAgICAgICAgICAgIGNzc0ZpbGVOYW1lOiAnY3NzL3ZlbmRvci5idWlsZC5jc3MnLFxuICAgICAgICAgICAgZm9ybWF0OiAnaWlmZScsXG4gICAgICAgICAgICBuYW1lOiAnRW1iZWRQcmVzc1ZlbmRvcidcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBTZXR0aW5ncyBidW5kbGUgKG1pZ3JhdGVkIGZyb20gb2xkIHN0cnVjdHVyZSlcbiAgICAnc2V0dGluZ3MnOiB7XG4gICAgICAgIGlucHV0OiAndmlydHVhbDpzZXR0aW5ncy1hc3NldHMnLFxuICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnanMvc2V0dGluZ3MuYnVpbGQuanMnLFxuICAgICAgICAgICAgY3NzRmlsZU5hbWU6ICdjc3Mvc2V0dGluZ3MuYnVpbGQuY3NzJyxcbiAgICAgICAgICAgIGdsb2JhbHM6IHsgJ2pxdWVyeSc6ICdqUXVlcnknIH0sXG4gICAgICAgICAgICBleHRlcm5hbDogWydqcXVlcnknXSxcbiAgICAgICAgICAgIGZvcm1hdDogJ2lpZmUnLFxuICAgICAgICAgICAgbmFtZTogJ0VtYmVkUHJlc3NTZXR0aW5ncydcbiAgICAgICAgfVxuICAgIH0sXG4gICAgJ3ByZXZpZXcnOiB7XG4gICAgICAgIGlucHV0OiAndmlydHVhbDpwcmV2aWV3LWFzc2V0cycsXG4gICAgICAgIG91dHB1dDoge1xuICAgICAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdqcy9wcmV2aWV3LmJ1aWxkLmpzJyxcbiAgICAgICAgICAgIGNzc0ZpbGVOYW1lOiAnY3NzL3ByZXZpZXcuYnVpbGQuY3NzJyxcbiAgICAgICAgICAgIGdsb2JhbHM6IHsgJ2pxdWVyeSc6ICdqUXVlcnknIH0sXG4gICAgICAgICAgICBleHRlcm5hbDogWydqcXVlcnknXSxcbiAgICAgICAgICAgIGZvcm1hdDogJ2lpZmUnLFxuICAgICAgICAgICAgbmFtZTogJ0VtYmVkUHJlc3NQcmV2aWV3J1xuICAgICAgICB9XG4gICAgfSxcblxuICAgICdjb21tb24nOiB7XG4gICAgICAgIGlucHV0OiAndmlydHVhbDpjb21tb24tYXNzZXRzJyxcbiAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgICBlbnRyeUZpbGVOYW1lczogJ2pzL2NvbW1vbi5idWlsZC5qcycsXG4gICAgICAgICAgICBjc3NGaWxlTmFtZTogJ2Nzcy9jb21tb24uYnVpbGQuY3NzJyxcbiAgICAgICAgICAgIGdsb2JhbHM6IHsgJ2pxdWVyeSc6ICdqUXVlcnknIH0sXG4gICAgICAgICAgICBleHRlcm5hbDogWydqcXVlcnknXSxcbiAgICAgICAgICAgIGZvcm1hdDogJ2lpZmUnLFxuICAgICAgICAgICAgbmFtZTogJ0VtYmVkUHJlc3NDb21tb24nXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgJ3ZpZGVvLXBsYXllcic6IHtcbiAgICAgICAgaW5wdXQ6ICd2aXJ0dWFsOnZpZGVvLWFzc2V0cycsXG4gICAgICAgIG91dHB1dDoge1xuICAgICAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdqcy92aWRlby1wbGF5ZXIuYnVpbGQuanMnLFxuICAgICAgICAgICAgY3NzRmlsZU5hbWU6ICdjc3MvdmlkZW8tcGxheWVyLmJ1aWxkLmNzcycsXG4gICAgICAgICAgICBnbG9iYWxzOiB7ICdqcXVlcnknOiAnalF1ZXJ5JyB9LFxuICAgICAgICAgICAgZXh0ZXJuYWw6IFsnanF1ZXJ5J10sXG4gICAgICAgICAgICBmb3JtYXQ6ICdpaWZlJyxcbiAgICAgICAgICAgIG5hbWU6ICdFbWJlZFByZXNzVmlkZW9QbGF5ZXInXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgJ2Nhcm91c2VsJzoge1xuICAgICAgICBpbnB1dDogJ3ZpcnR1YWw6Y2Fyb3VzZWwtYXNzZXRzJyxcbiAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgICBlbnRyeUZpbGVOYW1lczogJ2pzL2Nhcm91c2VsLmJ1aWxkLmpzJyxcbiAgICAgICAgICAgIGNzc0ZpbGVOYW1lOiAnY3NzL2Nhcm91c2VsLmJ1aWxkLmNzcycsXG4gICAgICAgICAgICBnbG9iYWxzOiB7ICdqcXVlcnknOiAnalF1ZXJ5JyB9LFxuICAgICAgICAgICAgZXh0ZXJuYWw6IFsnanF1ZXJ5J10sXG4gICAgICAgICAgICBmb3JtYXQ6ICdpaWZlJyxcbiAgICAgICAgICAgIG5hbWU6ICdFbWJlZFByZXNzQ2Fyb3VzZWwnXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgJ2dhbGxlcnknOiB7XG4gICAgICAgIGlucHV0OiAndmlydHVhbDpnYWxsZXJ5LWFzc2V0cycsXG4gICAgICAgIG91dHB1dDoge1xuICAgICAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdqcy9nYWxsZXJ5LmJ1aWxkLmpzJyxcbiAgICAgICAgICAgIGNzc0ZpbGVOYW1lOiAnY3NzL2dhbGxlcnkuYnVpbGQuY3NzJyxcbiAgICAgICAgICAgIGdsb2JhbHM6IHsgJ2pxdWVyeSc6ICdqUXVlcnknIH0sXG4gICAgICAgICAgICBleHRlcm5hbDogWydqcXVlcnknXSxcbiAgICAgICAgICAgIGZvcm1hdDogJ2lpZmUnLFxuICAgICAgICAgICAgbmFtZTogJ0VtYmVkUHJlc3NHYWxsZXJ5J1xuICAgICAgICB9XG4gICAgfSxcblxuICAgICdlbGVtZW50b3InOiB7XG4gICAgICAgIGlucHV0OiAndmlydHVhbDplbGVtZW50b3ItYXNzZXRzJyxcbiAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgICBlbnRyeUZpbGVOYW1lczogJ2pzL2VsZW1lbnRvci5idWlsZC5qcycsXG4gICAgICAgICAgICBjc3NGaWxlTmFtZTogJ2Nzcy9lbGVtZW50b3IuYnVpbGQuY3NzJyxcbiAgICAgICAgICAgIGdsb2JhbHM6IHsgJ2pxdWVyeSc6ICdqUXVlcnknIH0sXG4gICAgICAgICAgICBleHRlcm5hbDogWydqcXVlcnknXSxcbiAgICAgICAgICAgIGZvcm1hdDogJ2lpZmUnLFxuICAgICAgICAgICAgbmFtZTogJ0VtYmVkUHJlc3NFbGVtZW50b3InXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgJ3BkZi12aWV3ZXInOiB7XG4gICAgICAgIGlucHV0OiAndmlydHVhbDpwZGYtYXNzZXRzJyxcbiAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgICBlbnRyeUZpbGVOYW1lczogJ2pzL3BkZi12aWV3ZXIuYnVpbGQuanMnLFxuICAgICAgICAgICAgY3NzRmlsZU5hbWU6ICdjc3MvcGRmLXZpZXdlci5idWlsZC5jc3MnLFxuICAgICAgICAgICAgZ2xvYmFsczogeyAnanF1ZXJ5JzogJ2pRdWVyeScgfSxcbiAgICAgICAgICAgIGV4dGVybmFsOiBbJ2pxdWVyeSddLFxuICAgICAgICAgICAgZm9ybWF0OiAnaWlmZScsXG4gICAgICAgICAgICBuYW1lOiAnRW1iZWRQcmVzc1BERlZpZXdlcidcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAnZG9jdW1lbnQtdmlld2VyJzoge1xuICAgICAgICBpbnB1dDogJ3ZpcnR1YWw6ZG9jdW1lbnQtYXNzZXRzJyxcbiAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgICBlbnRyeUZpbGVOYW1lczogJ2pzL2RvY3VtZW50LXZpZXdlci5idWlsZC5qcycsXG4gICAgICAgICAgICBjc3NGaWxlTmFtZTogJ2Nzcy9kb2N1bWVudC12aWV3ZXIuYnVpbGQuY3NzJyxcbiAgICAgICAgICAgIGdsb2JhbHM6IHsgJ2pxdWVyeSc6ICdqUXVlcnknIH0sXG4gICAgICAgICAgICBleHRlcm5hbDogWydqcXVlcnknXSxcbiAgICAgICAgICAgIGZvcm1hdDogJ2lpZmUnLFxuICAgICAgICAgICAgbmFtZTogJ0VtYmVkUHJlc3NEb2N1bWVudFZpZXdlcidcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAnZ3V0ZW5iZXJnJzoge1xuICAgICAgICBpbnB1dDogJ3ZpcnR1YWw6Z3V0ZW5iZXJnLWFzc2V0cycsXG4gICAgICAgIG91dHB1dDoge1xuICAgICAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdqcy9ndXRlbmJlcmcuYnVpbGQuanMnLFxuICAgICAgICAgICAgY3NzRmlsZU5hbWU6ICdjc3MvZ3V0ZW5iZXJnLmJ1aWxkLmNzcycsXG4gICAgICAgICAgICBnbG9iYWxzOiB7ICdqcXVlcnknOiAnalF1ZXJ5JyB9LFxuICAgICAgICAgICAgZXh0ZXJuYWw6IFsnanF1ZXJ5J10sXG4gICAgICAgICAgICBmb3JtYXQ6ICdpaWZlJyxcbiAgICAgICAgICAgIG5hbWU6ICdFbWJlZFByZXNzR3V0ZW5iZXJnJ1xuICAgICAgICB9XG4gICAgfSxcblxuICAgICdlbWJlZC11aSc6IHtcbiAgICAgICAgaW5wdXQ6ICd2aXJ0dWFsOmVtYmVkLWFzc2V0cycsXG4gICAgICAgIG91dHB1dDoge1xuICAgICAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdqcy9lbWJlZC11aS5idWlsZC5qcycsXG4gICAgICAgICAgICBjc3NGaWxlTmFtZTogJ2Nzcy9lbWJlZC11aS5idWlsZC5jc3MnLFxuICAgICAgICAgICAgZ2xvYmFsczogeyAnanF1ZXJ5JzogJ2pRdWVyeScgfSxcbiAgICAgICAgICAgIGV4dGVybmFsOiBbJ2pxdWVyeSddLFxuICAgICAgICAgICAgZm9ybWF0OiAnaWlmZScsXG4gICAgICAgICAgICBuYW1lOiAnRW1iZWRQcmVzc0VtYmVkVUknXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgJ2Fkcyc6IHtcbiAgICAgICAgaW5wdXQ6ICd2aXJ0dWFsOmFkcy1hc3NldHMnLFxuICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnanMvYWRzLmJ1aWxkLmpzJyxcbiAgICAgICAgICAgIGNzc0ZpbGVOYW1lOiAnY3NzL2Fkcy5idWlsZC5jc3MnLFxuICAgICAgICAgICAgZ2xvYmFsczogeyAnanF1ZXJ5JzogJ2pRdWVyeScgfSxcbiAgICAgICAgICAgIGV4dGVybmFsOiBbJ2pxdWVyeSddLFxuICAgICAgICAgICAgZm9ybWF0OiAnaWlmZScsXG4gICAgICAgICAgICBuYW1lOiAnRW1iZWRQcmVzc0FkcydcbiAgICAgICAgfVxuICAgIH0sXG5cblxufTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IGNvbW1hbmQsIG1vZGUgfSkgPT4ge1xuICAgIGNvbnN0IGlzUHJvZHVjdGlvbiA9IG1vZGUgPT09ICdwcm9kdWN0aW9uJztcbiAgICBjb25zdCBfX2Rpcm5hbWUgPSBwYXRoLmRpcm5hbWUoZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpKTtcblxuICAgIC8vIERldGVybWluZSB3aGljaCBidWlsZCB0byBydW4gYmFzZWQgb24gZW52aXJvbm1lbnQgdmFyaWFibGUgb3IgZGVmYXVsdCB0byBibG9ja3NcbiAgICBjb25zdCBidWlsZFRhcmdldCA9IHByb2Nlc3MuZW52LkJVSUxEX1RBUkdFVCB8fCAnYmxvY2tzJztcbiAgICBjb25zdCBjb25maWcgPSBidWlsZENvbmZpZ3NbYnVpbGRUYXJnZXRdO1xuXG4gICAgaWYgKCFjb25maWcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIGJ1aWxkIHRhcmdldDogJHtidWlsZFRhcmdldH0uIEF2YWlsYWJsZSB0YXJnZXRzOiAke09iamVjdC5rZXlzKGJ1aWxkQ29uZmlncykuam9pbignLCAnKX1gKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBiYXNlOiAnLi8nLCAvLyBVc2UgcmVsYXRpdmUgYmFzZSBwYXRoIHRvIHByZXNlcnZlIHJlbGF0aXZlIFVSTHNcbiAgICAgICAgcGx1Z2luczogW1xuICAgICAgICAgICAgLy8gQ3VzdG9tIHBsdWdpbiB0byBoYW5kbGUgSlNYIGluIC5qcyBmaWxlc1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICd0cmVhdC1qcy1maWxlcy1hcy1qc3gnLFxuICAgICAgICAgICAgICAgIGFzeW5jIHRyYW5zZm9ybShjb2RlLCBpZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlkLmVuZHNXaXRoKCcuanMnKSkgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzJykpIHJldHVybiBudWxsO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSBmaWxlIGNvbnRhaW5zIEpTWCBzeW50YXhcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvZGUuaW5jbHVkZXMoJzwnKSAmJiBjb2RlLmluY2x1ZGVzKCc+JykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRyYW5zZm9ybSB1c2luZyBlc2J1aWxkXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlc2J1aWxkID0gYXdhaXQgaW1wb3J0KCdlc2J1aWxkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBlc2J1aWxkLnRyYW5zZm9ybShjb2RlLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9hZGVyOiAnanN4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc3g6ICdhdXRvbWF0aWMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzeEltcG9ydFNvdXJjZTogJ3JlYWN0J1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0LmNvZGU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNyZWF0ZVN0YXRpY0Fzc2V0c1BsdWdpbigpLFxuICAgICAgICAgICAgcmVhY3Qoe1xuICAgICAgICAgICAgICAgIGpzeFJ1bnRpbWU6ICdhdXRvbWF0aWMnLFxuICAgICAgICAgICAgICAgIGluY2x1ZGU6IFsnKiovKi5qc3gnXSwgLy8gT25seSBwcm9jZXNzIC5qc3ggZmlsZXMgd2l0aCBSZWFjdCBwbHVnaW5cbiAgICAgICAgICAgIH0pLFxuICAgICAgICBdLFxuICAgICAgICBidWlsZDoge1xuICAgICAgICAgICAgb3V0RGlyOiAnYXNzZXRzJyxcbiAgICAgICAgICAgIGVtcHR5T3V0RGlyOiBmYWxzZSxcbiAgICAgICAgICAgIHNvdXJjZW1hcDogIWlzUHJvZHVjdGlvbixcbiAgICAgICAgICAgIGNzc0NvZGVTcGxpdDogZmFsc2UsXG4gICAgICAgICAgICB0YXJnZXQ6ICdlczIwMTUnLFxuICAgICAgICAgICAgbWluaWZ5OiBpc1Byb2R1Y3Rpb24sXG4gICAgICAgICAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgaW5wdXQ6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIGNvbmZpZy5pbnB1dCksXG4gICAgICAgICAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdDogY29uZmlnLm91dHB1dC5mb3JtYXQsXG4gICAgICAgICAgICAgICAgICAgIGVudHJ5RmlsZU5hbWVzOiBjb25maWcub3V0cHV0LmVudHJ5RmlsZU5hbWVzLFxuICAgICAgICAgICAgICAgICAgICBhc3NldEZpbGVOYW1lczogKGFzc2V0SW5mbykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZXh0ID0gcGF0aC5leHRuYW1lKGFzc2V0SW5mby5uYW1lcz8uWzBdIHx8ICcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChleHQgPT09ICcuY3NzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb25maWcub3V0cHV0LmNzc0ZpbGVOYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFsnLnBuZycsICcuanBnJywgJy5qcGVnJywgJy5naWYnLCAnLnN2ZyddLmluY2x1ZGVzKGV4dCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ2ltZy9bbmFtZV1bZXh0bmFtZV0nO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFsnLndvZmYnLCAnLndvZmYyJywgJy50dGYnLCAnLmVvdCddLmluY2x1ZGVzKGV4dCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ2ZvbnRzL1tuYW1lXVtleHRuYW1lXSc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ2Fzc2V0cy9bbmFtZV1bZXh0bmFtZV0nO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBnbG9iYWxzOiBjb25maWcub3V0cHV0Lmdsb2JhbHMsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IGNvbmZpZy5vdXRwdXQubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgaW5saW5lRHluYW1pY0ltcG9ydHM6IHRydWUgLy8gU2luZ2xlIGlucHV0IGFsbG93cyB0aGlzXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBleHRlcm5hbDogY29uZmlnLm91dHB1dC5leHRlcm5hbFxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICBhbGlhczoge1xuICAgICAgICAgICAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXG4gICAgICAgICAgICAgICAgJ0Bjb21wb25lbnRzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9TaGFyZWQvY29tcG9uZW50cycpLFxuICAgICAgICAgICAgICAgICdAaG9va3MnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL1NoYXJlZC9ob29rcycpLFxuICAgICAgICAgICAgICAgICdAdXRpbHMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL1NoYXJlZC91dGlscycpLFxuICAgICAgICAgICAgICAgICdAc3RvcmVzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9TaGFyZWQvc3RvcmVzJyksXG4gICAgICAgICAgICAgICAgJ0BzZXJ2aWNlcyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvU2hhcmVkL3NlcnZpY2VzJyksXG4gICAgICAgICAgICAgICAgJ0B0eXBlcyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvU2hhcmVkL3R5cGVzJyksXG4gICAgICAgICAgICAgICAgJ0Bhc3NldHMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnYXNzZXRzJyksXG4gICAgICAgICAgICAgICAgJ0BibG9ja3MnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL0Jsb2NrcycpLFxuICAgICAgICAgICAgICAgICdAZWxlbWVudG9yJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9FbGVtZW50b3InKSxcbiAgICAgICAgICAgICAgICAnQGFkbWluJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9BZG1pblVJJyksXG4gICAgICAgICAgICAgICAgJ0BzaG9ydGNvZGVzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9TaG9ydGNvZGVzJyksXG4gICAgICAgICAgICAgICAgJ0Bmcm9udGVuZCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvRnJvbnRlbmQnKSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgY3NzOiB7XG4gICAgICAgICAgICBwb3N0Y3NzOiB7XG4gICAgICAgICAgICAgICAgcGx1Z2luczogW1xuICAgICAgICAgICAgICAgICAgICBhdXRvcHJlZml4ZXJcbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGVmaW5lOiB7XG4gICAgICAgICAgICAncHJvY2Vzcy5lbnYuTk9ERV9FTlYnOiBKU09OLnN0cmluZ2lmeShwcm9jZXNzLmVudi5OT0RFX0VOViB8fCAnZGV2ZWxvcG1lbnQnKSxcbiAgICAgICAgICAgICdfX0RFVl9fJzogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcsXG4gICAgICAgIH1cbiAgICB9O1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixTQUFTLHFCQUFxQjtBQUM5QixPQUFPLGtCQUFrQjtBQUx5TixJQUFNLDJDQUEyQztBQVFuUyxJQUFNLHFCQUFxQjtBQUFBLEVBQ3ZCLHFCQUFxQjtBQUFBLEVBQ3JCLDJCQUEyQjtBQUFBLEVBQzNCLHlCQUF5QjtBQUFBLEVBQ3pCLG1CQUFtQjtBQUFBLEVBQ25CLHNCQUFzQjtBQUFBLEVBQ3RCLG1CQUFtQjtBQUFBLEVBQ25CLHNCQUFzQjtBQUFBLEVBQ3RCLG9CQUFvQjtBQUFBLEVBQ3BCLHdCQUF3QjtBQUFBLEVBQ3hCLGtCQUFrQjtBQUFBLEVBQ2xCLDRCQUE0QjtBQUFBLEVBQzVCLHVCQUF1QjtBQUFBLEVBQ3ZCLHlCQUF5QjtB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
