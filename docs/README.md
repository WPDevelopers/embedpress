# EmbedPress Developer Documentation

Welcome to the EmbedPress developer documentation. This is the **free** plugin — for the Pro extension, see the corresponding `docs/` folder in the `embedpress-pro` repo.

EmbedPress is a WordPress plugin that turns 250+ external sources (videos, audio, PDFs, calendars, social feeds, maps, documents…) into clean, configurable embeds available as **Gutenberg blocks**, **Elementor widgets**, and the classic **`[embed]` / `[embedpress]` shortcode**.

This documentation explains **how the plugin is built**, **why it's designed the way it is**, and **how to extend it safely**.

---

## Table of contents

### Architecture
- [Architecture Overview](architecture/overview.md) — the 30,000-ft view of the codebase
- [Data Flow](architecture/data-flow.md) — how a URL becomes a rendered embed
- [WordPress Integration](architecture/wordpress-integration.md) — hooks, lifecycle, autoloading
- [Free + Pro Coupling](architecture/free-pro-coupling.md) — how Pro extends the free plugin

### Folder Structure
- [Folder Reference](architecture/folders.md) — what every top-level folder does

### Editors
- [Gutenberg Architecture](gutenberg/README.md)
- [Elementor Architecture](elementor/README.md)
- [Classic Shortcode](architecture/shortcode.md)

### Providers
- [Provider System](providers/README.md) — adapter pattern, URL routing, embed generation
- [Adding a New Provider](providers/adding-a-provider.md) — step-by-step
- [Provider Catalog](providers/catalog.md) — every shipped provider, what it does

### Features
- [Custom Video Player](features/custom-player.md)
- [PDF Embedder + 3D Flipbook](features/pdf.md)
- [PDF Gallery](features/pdf-gallery.md)
- [Document Block (DOC/PPT/XLS)](features/document.md)
- [Analytics](features/analytics.md)
- [Social Share](features/social-share.md)
- [Universal Wrapper / Auto-embed](features/wrapper.md)
- [Onboarding Wizard](features/onboarding.md)

### APIs & External Integrations
- [REST API](api/rest.md)
- [oEmbed Integration](api/oembed.md)
- [Provider HTTP calls](api/external.md)

### Developer Guides
- [Coding Standards](guides/coding-standards.md)
- [Hooks & Filters Reference](guides/hooks-and-filters.md)
- [Extending EmbedPress](guides/extending.md)
- [Debugging & Troubleshooting](guides/debugging.md)
- [Build & Asset Pipeline](guides/build-pipeline.md)
- [Testing](guides/testing.md)

### Contributing
- [Local Development Setup](contributing/setup.md)
- [Pull Request Guidelines](contributing/pull-requests.md)
- [Release Process](contributing/release.md)

---

## Quick orientation

If you have **15 minutes** and want to grok the plugin:

1. Read [Architecture Overview](architecture/overview.md) — explains the four entry points (shortcode, block, widget, auto-embed) and how they all funnel into the same renderer.
2. Skim [Data Flow](architecture/data-flow.md) — follow a YouTube URL from paste to rendered iframe.
3. Open [Provider System](providers/README.md) — the heart of the plugin. Almost every customer-facing feature lives in or hooks into a Provider.

If you're **adding a feature**, start with [Extending EmbedPress](guides/extending.md). If you're **fixing a bug**, start with [Debugging](guides/debugging.md).

---

## Conventions used in these docs

- **File paths** are relative to the plugin root (`/Applications/Workspace/GitHub/embedpress/`).
- **Code snippets** are illustrative — always cross-check against the actual file before relying on signatures.
- **"Pro"** in italics or in a callout means the behavior described requires the Pro plugin to be active.
- **PHP namespaces** are written `EmbedPress\Foo\Bar` (the leading `\` from `EMBEDPRESS_NAMESPACE` is omitted in prose for readability).

## Where this documentation lives in the codebase

```
docs/
├── README.md              ← you are here
├── architecture/          ← high-level design
├── providers/             ← provider system
├── elementor/             ← Elementor widget internals
├── gutenberg/             ← Gutenberg block internals
├── features/              ← per-feature deep dives
├── api/                   ← REST + external HTTP
├── guides/                ← cross-cutting how-tos
└── contributing/          ← local dev, PRs, release
```

When you ship a feature, **update the matching doc in the same PR**. Documentation that drifts is worse than no documentation.

## Legacy notes

A few pre-existing scratch / issue notes from past tickets live in `docs/legacy/`:

- `legacy/BLOCK_KEY_FIXES.md`
- `legacy/LOCALIZATION_KEYS.md`
- `legacy/broken-embeds-detection.md`
- `legacy/exclude-height-sources.md`
- `legacy/google-docs-block-standard-structure.md`

These are kept for historical context only. New documentation goes into the structured subfolders above.
