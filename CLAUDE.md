# EmbedPress

## Project Management (Zoobbe)
- **Account:** akash@wpdeveloper.com (office)
- **Workspace:** Team Startise
- **Board:** Development - EmbedPress (`nN1NU8sH`)
- **CLI:** Use `zb` instead of `zoobbe` — it auto-switches account/workspace based on this directory
- **Workflow:** Backlog → To-Do → On-Going → Need Feedback → Client End Fixed → Tested & Closed → Released
- **Card creation:** Always assign to current user, set priority, add label, include description
- **Labels:** Bug Fix, New Feature, Feature Request, Improvements, Critical, Security Issue, Client Issue, Pro, Free, WordPress ORG

## Gutenberg blocks — backwards compatibility (applies to ALL blocks under `src/Blocks/`)

When changing **any** EmbedPress block's `save()` output (markup, attributes, `data-options` shape, wrapper classes, etc.), preserve old-post compatibility — Gutenberg validates current `save()` against the saved HTML and shows the "Block contains unexpected or invalid content. Attempt recovery" prompt on every mismatch, which wipes the user's configuration. This rule applies to all blocks in this plugin (EmbedPress, Calendly, YouTube channel, Document, etc.) — not just the main EmbedPress block.

Order of preference:

1. **Conditional emission first.** If the change is additive (new attributes off-by-default), only emit the new keys/markup when their toggle is `true`. Old posts (where new attrs read as defaults) regenerate the original markup byte-for-byte. Pattern: `...(playerEmailCapture && { email_capture: build() })` instead of `email_capture: build() || false`. This was the working fix for #81243 Pro feature keys in `src/Blocks/EmbedPress/src/components/helper.js` `getPlayerOptions()`.
2. **Add a `deprecated[]` entry** in the block's `deprecated.js` (e.g. `src/Blocks/EmbedPress/src/components/deprecated.js`) when the markup change is unconditional. Provide a `save()` that reproduces the previous markup and an identity `migrate`. Place new entries at the **front** of the array. Wire `deprecated` into `registerBlockType` in the block's `index.js`.
3. **`isEligible: () => true`** as a safety-net catch-all forces WP to apply a deprecation even when its `save()` doesn't byte-match — useful when shared rendering (e.g. `DynamicStyles`) varies across revisions.

Whenever a JS save-shape changes, also check the matching PHP renderer (e.g. `EmbedPress/Gutenberg/EmbedPressBlockRenderer.php` `build_player_options()`) — both feed the same JSON that frontend scripts (`initplyr.js`, etc.) parse.
