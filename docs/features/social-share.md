# Social Share

Per-block toggleable share buttons (Facebook, X/Twitter, Pinterest, LinkedIn) rendered around any embed. **Fully free**, no Pro gating.

Implemented as inline SVG icons in `target="_blank"` anchors pointing at each platform's intent URL. No JS dependencies, no popup window code, no third-party SDKs.

## Configuration

Per embed: toggle on/off, position (top / right / bottom / left), per-platform toggles, custom title and description fields that override the post's defaults for richer share metadata.

## Architecture

```
   Block save()
     contentShare: bool
     sharePosition: 'top' | 'right' | 'bottom' | 'left'
     customTitle, customDescription
     shareFacebook | shareTwitter | sharePinterest | shareLinkedin: bool
            │
            ▼
   src/Blocks/GlobalCoponents/social-share-html.js
     Builds <div class="ep-social-share share-position-{pos}">
     For each enabled platform:
       <a href="<intent-url>" target="_blank">
         <svg .platform-{name}/>
       </a>
            │
            ▼
   Frontend renders directly — no JS event handler beyond default link behavior
            │
            ▼
   CSS: assets/css/embedpress.css ~L1390-1470
```

## Code paths

| File | Role |
|---|---|
| `src/Blocks/GlobalCoponents/social-share-control.js` | Inspector controls — toggle, position, customTitle, customDescription, per-platform toggles |
| `src/Blocks/GlobalCoponents/social-share-html.js` | HTML builder — renders the share div with inline SVG icons |
| `src/Blocks/<provider>/src/components/attributes.js` | Each provider block re-declares the share attributes (defaults vary, e.g. `shareFacebook:true`, `sharePosition:'right'`) |
| `assets/css/embedpress.css` (~L1390-1470) | Layout + per-platform fill colors |

## Block attributes (per host block)

| Attribute | Type | Default | Purpose |
|---|---|---|---|
| `contentShare` | bool | false | Master toggle |
| `sharePosition` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'right'` | Where buttons appear |
| `customTitle` | string | — | Override post title in share |
| `customDescription` | string | — | Override description |
| `shareFacebook` | bool | true | Show FB button |
| `shareTwitter` | bool | true | Show X button |
| `sharePinterest` | bool | true | Show Pinterest button |
| `shareLinkedin` | bool | true | Show LinkedIn button |

## Share URLs

- **Facebook**: `https://www.facebook.com/sharer/sharer.php?u=<post-url>&t=<title>`
- **X/Twitter**: `https://twitter.com/intent/tweet?url=<post-url>&text=<title>`
- **Pinterest**: `https://www.pinterest.com/pin/create/button/?url=<post-url>&description=<description>&media=<image>`
- **LinkedIn**: `https://www.linkedin.com/shareArticle?mini=true&url=<post-url>&title=<title>&summary=<description>`

All components are URL-encoded inside `social-share-html.js`.

## CSS palette

| Class | Color |
|---|---|
| `.facebook { fill: #475a96 }` | FB blue |
| `.twitter { fill: #1DA1F2 }` | Legacy bird blue (pre-X rebrand) |
| `.pinterest` | Pinterest red |
| `.linkedin` | LinkedIn blue |

`.ep-social-share` is a flex row/column depending on `share-position-*`.

## Common pitfalls

- **Twitter color is the legacy bird blue.** Update if/when re-branding to X (black).
- **No popup window code.** Buttons are plain `target="_blank"` links. Opening a `window.open(...)` style popup is a feature add — current code does nothing JS-side.
- **Pinterest needs an image URL.** The `media` param requires the embed thumbnail; without it, Pinterest's modal asks the user to pick. The host block must expose a thumbnail.
- **Custom title/description fall back to the post's title** if not set. The fallback is in `social-share-html.js`, not server-side — view source if customers report wrong text being shared.
- **Position class is rendered into HTML** (`.share-position-right` etc.). Don't change class names without updating the CSS file.
- **Each provider block redeclares share attributes** in its own `attributes.js`. Adding a 5th platform (e.g., WhatsApp) requires touching every provider block + the global JS module.
- **No analytics integration.** Clicks are not tracked.
- **No preview in the editor.** The Inspector shows toggles, but the editor canvas may not render the buttons depending on the host block's render path. Test in the frontend, not just the editor.

## Testing

- **Smoke**: enable share on a YouTube embed, position right → 4 buttons appear right of the iframe.
- **Click**: each button opens the correct intent URL in a new tab with the post URL pre-filled.
- **Custom title**: set `customTitle='X'` → share dialog uses 'X' instead of post title.
- **Per-platform**: disable Pinterest only → 3 buttons render.
- **Position**: switch positions, verify CSS rearranges.
