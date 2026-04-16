# WordPress.org Live Preview Blueprint

This folder is deployed to SVN `/embedpress/assets/blueprints/` by the deploy workflow and powers the **Live Preview** button on the EmbedPress plugin page at wordpress.org.

## Files

- **`blueprint.json`** — the Playground boot script. Committed. Don't rename.
- **`embedpress-demo.wxr`** — the curated demo page imported into the preview. **Replace this file** to change what users see when they click Live Preview.

## Updating the demo page

1. On a staging WordPress install, build and style the page you want users to see. Configure EmbedPress settings, add your embeds, tweak layout.
2. Give the page the slug **`embedpress-live-demo`** (or it will fall back to "most recently imported page").
3. **Tools → Export → All content** (or just "Pages" if you don't need media). Download the `.xml`.
4. Save it as `embedpress-demo.wxr` in this folder. Commit.
5. Test:
   ```
   https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/WPDevelopers/embedpress/main/.wordpress-org/blueprints/blueprint.json
   ```

## Constraints

- Playground boots in the user's browser via a network proxy — external assets (images, CSS from other domains) must be reachable via HTTPS.
- Keep the WXR small (< 500KB ideally). Strip revisions and trashed posts before exporting.
- The `importWxr` step pulls from `raw.githubusercontent.com/WPDevelopers/embedpress/main/...` so the demo updates as soon as your WXR change lands on `main`.
