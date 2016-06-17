=== EmbedPress ===
Contributors: PressShack
Tags: embed, embera, embedding, pressshack, ostraining
Requires at least: 4.0
Tested up to: 4.5.2
Stable tag: 1.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

EmbedPress - Embed anything in WordPress! But now, you can enhance your embeds by passing custom parameters to each one of them.

== Description ==
EmbedPress makes embedding super-easy. All you need is the URL and you can embed almost anything into a WordPress site! You can even pass custom attributes to the generated html.

Even if you are not an experienced developer, with EmbedPress, you can easily embed content to your WordPress site from over 60 sources including these:
Facebook, YouTube, Vimeo, DailyMotion, Instagram, SoundCloud, Twitter, Slideshare, Flickr, Hulu, Kickstarter, Vine, Getty Images and [many more](https://github.com/OSTraining/EmbedPress/blob/master/PROVIDERS.md)!

== Installation ==
There's two ways to install EmbedPress plugin:

**Through your WordPress site's admin**

1. Go to your site's admin page;
2. Access the "Plugins" page;
3. Click on the "Add New" button;
4. Search for "EmbedPress";
5. Install EmbedPress plugin;
6. Activate the EmbedPress plugin.

**Manually uploading the plugin to your repository**

1. Download the EmbedPress plugin zip file;
2. Upload the plugin to your site's repository under the *"/wp-content/plugins/"* directory;
3. Go to your site's admin page;
4. Access the "Plugins" page;
5. Activate the EmbedPress plugin.

== Usage ==
- Once the plugin is active, you can go on the editor and paste any URL as you normally would.
- To pass custom parameters to an embed ou can do:

`
// This will render the iframe (if there's one. Some services may use other tags) having its dimensions fixed to 460x300px.
[embed width="460" height="300" responsive="false"]your-link[/embed]

// This will render the html-embed having an additional html property data-foo="this is awesome".
[embed foo="this is awesome"]your-other-link[/embed]

// This will render the html-embed having the class "cool-embed".
[embed class="cool-embed"]your-other-link[/embed]
`

== Changelog ==
= 1.0 =
Release Date: 2016-06-17

* Initial release.
