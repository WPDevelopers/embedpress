# Provider Catalog

Every Provider class shipped with the free plugin and how it's wired in.

> Verified against `EmbedPress/Providers/` (28 PHP files) and `providers.php` (26 active host registrations) on the `4.5.1` baseline. Two files (`Wrapper.php`, `TikTok.php`) exist in the Providers directory but are not registered in `providers.php` — they're invoked via different paths. **Vimeo is NOT a custom Provider class** — it's handled by Embera's built-in adapter.

## How to read this catalog

For each provider:

- **Class** — the EmbedPress\Providers\* file
- **Hosts in `providers.php`** — the URL patterns Embera matches against (if registered there)
- **Notes** — anything special

## Video / Streaming

| Class | Hosts | Notes |
|---|---|---|
| **Youtube** | `youtube.com` | Most-used provider. Routed via `Feature_Enhancer::isEmbra`. Pro extender in `embedpress-pro/includes/Providers/Youtube.php` adds channel/playlist/livechat controls. |
| **Wistia** | `*.wistia.com`, `wistia.com` | Volume + custom player params via Feature_Enhancer. Pro extender adds advanced controls. |
| **Twitch** | `twitch.tv`, `clips.twitch.tv` | Channel, clips, VODs all flow through one provider. Pro adds chat parameter. |
| **FITE** | `fite.tv`, `triller.tv`, `trillertv.com` | Live event streaming. |
| (TikTok) | (not in providers.php) | File exists at `Providers/TikTok.php`; Feature_Enhancer::isEmbra invokes it directly when host matches. |

> **Vimeo, Dailymotion, SoundCloud, Spotify, Apple Podcasts** etc. are handled via Embera's built-in adapters and EmbedPress's Feature_Enhancer decoration — no custom Provider class in `EmbedPress/Providers/`.

## Documents / PDFs / Files

| Class | Hosts | Notes |
|---|---|---|
| **GoogleDocs** | `docs.google.com` | Docs, Sheets, Slides, Forms all share host but each has its own Gutenberg block. |
| **GoogleDrive** | `drive.google.com` | Drive file embed. |
| **OneDrive** | `onedrive.live.com`, `1drv.ms` | Microsoft's Drive equivalent. |
| **GoogleCalendar** | `calendar.google.com` | Calendar iframe + ICS feed. |
| **SelfHosted** | site host + long TLD wildcard list | Catches direct file URLs (`.mp4`, `.mp3`, `.pdf`, `.docx`, etc.). The fallback for self-hosted media. **Five regex copies** (PHP + JS) to keep in sync. |

## Maps / Locations

| Class | Hosts | Notes |
|---|---|---|
| **GoogleMaps** | `google.com`, `google.com.*`, `maps.google.com`, `goo.gl`, `google.co.*` | Tight regex needed because `google.com` is shared with Google's other services. |

## Social / Feeds

| Class | Hosts | Notes |
|---|---|---|
| **InstagramFeed** | `instagram.com` | Single post; multi-post feed UX is Pro. |
| **X** | `*.x.com`, `x.com` | Renamed from Twitter. Class is `X`. |
| **LinkedIn** | `*.linkedin.com`, `linkedin.com` | Posts + share embeds. |
| **GitHub** | `gist.github.com`, `github.com` | Gists and source files. |
| **OpenSea** | `opensea.io` | NFT widget. Has separate Elementor `ep-preset-1/-2` styling unrelated to Custom Player presets. |

## Audio

| Class | Hosts | Notes |
|---|---|---|
| **Boomplay** | `boomplay.com` | African music streaming. |
| **Spreaker** | `*.spreaker.com`, `spreaker.com` | Podcast hosting. Routed via `isEmbra`. |
| **NRKRadio** | `radio.nrk.no`, `nrk.no` | Norwegian public radio. |

## Tools / Forms / Misc

| Class | Hosts | Notes |
|---|---|---|
| **Calendly** | `*.calendly.com`, `calendly.com` | Booking widget. Pro adds OAuth + sync. |
| **AirTable** | `*.airtable.com`, `airtable.com` | Database / view embed. |
| **Canva** | `*.canva.com`, `canva.com` | Design embed. |
| **Gumroad** | `*.gumroad.com`, `gumroad.com` | Product/store embed. |
| **GooglePhotos** | `photos.app.goo.gl`, `photos.google.com` | Album embed (server-side fetch to derive). Routed via `isEmbra`. |
| **GettyImages** | `gettyimages.com` | Stock image embed. |
| **Giphy** | `giphy.com`, `i.giphy.com` | GIF embed. |
| **Meetup** | `meetup.com` | Event embed. Pro extender adds advanced controls. |

## The Wrapper

`Providers/Wrapper.php` is the universal fallback. Not registered in `providers.php` — instead, `Feature_Enhancer::isEmbra` invokes it when no other provider matches. It renders a sandboxed iframe pointing at the URL.

See [Universal Wrapper](../features/wrapper.md).

## Where the "250+ providers" number comes from

The bundled **Embera library** ships adapters for many additional services (Vimeo, SoundCloud, Spotify, Apple Podcasts, Dailymotion, TED, SlideShare, Codepen, dozens of social and tool sites). Combined with EmbedPress's custom Provider classes here and the Wrapper fallback, the total catalog crosses 250 sources.

When you see a provider's controls in the editor that isn't listed above, it's almost certainly an Embera-adapter source decorated by `Feature_Enhancer` rather than a custom Provider class. To confirm, grep for the provider name in `vendor/mauricius/embera/` (Composer).

## How to keep this catalog accurate

When you add or rename a Provider class, update:

1. The file in `EmbedPress/Providers/`
2. The host registration in `providers.php`
3. The corresponding row in this catalog
4. (If applicable) the Pro extender in `embedpress-pro/includes/Providers/`
