=== EmbedPress ===
Contributors: PressShack
Tags: 23hq, amcharts, animoto, aol on, bambuser, cacoo, chartblocks, chirbit, circuitlab, cloudup, clyp, collegehumor, coub, crowd ranking, daily mile, dailymotion, devianart, dipity, dotsub, edocr, facebook, flickr, funnyordie, gettyimages, github gist, google docs, google drawings, google maps, google sheets, google slides, huffduffer, hulu, ifttt, imgur, infogram, instagram, issuu, kickstarter, meetup, mixcloud, mobypicture, nfb, photobucket, polldaddy, porfolium, reddit, release wire, reverbnation, roomshare, rutube, sapo videos, scribd, shortnote, shoudio, sketchfab, slideshare, smugmug, soundcloud, speaker deck, spotify, ted, tumblr, twitter, ustream, viddler, videojug, videopress, vimeo, vine, wordpress tv, youtube
Requires at least: 4.0
Tested up to: 4.6.1
Stable tag: 1.1.3
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

WordPress supports around 35 embed sources, but EmbedPress adds over 40 more, including Facebook, Google Maps, Google Docs, UStream! Just use the URL!

== Description ==
The goal of EmbedPress is to embed ANYTHING in WordPress.

We’re starting with Facebook, Google, UStream and more. All you need is the URL and you can embed media from over 40 more providers into your WordPress site!

In addition to the default WordPress sources, EmbedPress supports these providers:

- [23h](http://23hq.com/) <em>(Images)</em>
- [AmCharts](http://live.amcharts.com/) <em>(Charts)</em>
- [Aol On](http://on.aol.com/) <em>(Videos)</em>
- [Bambuser](http://bambuser.com/) <em>(Videos)</em>
- [Cacoo](http://cacoo.com/) <em>(Charts)</em>
- [ChartBlocks](http://chartblocks.com/) <em>(Charts)</em>
- [Chirbit](http://chirb.it/) <em>(Audios)</em>
- [Cly](http://clyp.it/) <em>(Audios)</em>
- [CircuitLab](https://www.circuitlab.com/) <em>(Charts)</em>
- [Coub](http://coub.com/) <em>(Videos)</em>
- [Crowd Ranking](http://crowdranking.com/) <em>(Polls)</em>
- [Daily Mile](http://dailymile.com/) <em>(Activity)</em>
- [Devianart](http://deviantart.com/) <em>(Images)</em>
- [Dipity](http://www.dipity.com/) <em>(Timelines)</em>
- [Dotsub](http://dotsub.com/) <em>(Videos)</em>
- [Edocr](http://edocr.com/) <em>(Documents)</em>
- [Facebook](https://www.facebook.com/) <em>(Posts)</em>
- [GettyImages](http://www.gettyimages.com/) <em>(Images)</em>
- [Github Gist](https://gist.github.com/) <em>(Code)</em>
- [Google Docs ](https://docs.google.com/) <em>(Documents)</em>
- [Google Maps](https://www.google.com/maps) <em>(Maps)</em>
- [Google Drawings](http://drawings.google.com) <em>(Drawings)</em>
- [Google Sheets](https://www.google.com/sheets/) <em>(Spreadsheets)</em>
- [Google Slides](https://google.com/slides) <em>(Presentation Slideshows)</em>
- [HuffDuffer](http://huffduffer.com/) <em>(Audios)</em>
- [IFTTT](http://ifttt.com/) <em>(Idea)</em>
- [Infogram](https://infogr.am/) <em>(Charts)</em>
- [MobyPicture](http://mobypicture.com/) <em>(Image)</em>
- [NFB](http://www.nfb.ca/) <em>(Videos)</em>
- [Porfolium](https://portfolium.com/) <em>(Projects)</em>
- [Release Wire](http://releasewire.com/) <em>(Press releases)</em>
- [Roomshare](http://roomshare.jp/) <em>(Listings, in Japanese)</em>
- [Sapo Videos](http://videos.sapo.pt/) <em>(Videos, in Spanish)</em>
- [ShortNote](https://www.shortnote.jp/) <em>(Notes, in Japanese)</em>
- [Rutube](https://rutube.ru/) <em>(Videos, in Russian)</em>
- [Shoudio](http://shoudio.com/) <em>(Audios)</em>
- [Sketchfab](http://sketchfab.com/) <em>(Drawings)</em>
- [Ustream](http://ustream.tv/) <em>(Videos)</em>
- [Viddler](http://www.viddler.com/) <em>(Videos)</em>
- [VideoJug](http://www.videojug.com/) <em>(Videos)</em>

== Installation ==
There're two ways to install EmbedPress plugin:

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
- To pass custom parameters to an embed you can hover on the preview and click on the "Pencil" button. Optionally you can set custom parameters directly using short-codes like:

`
// This will render the iframe (if there's one. Some services may use other tags) having its dimensions fixed to 460x300px.
[embed width="460" height="300" responsive="false"]your-link[/embed]

// This will render the html-embed having an additional html property data-foo="this is awesome".
[embed foo="this is awesome"]your-other-link[/embed]

// This will render the html-embed having the class "cool-embed".
[embed class="cool-embed"]your-other-link[/embed]
`

== Changelog ==
= 1.1.3 =
Release Date: 2016-09-20

* Updated plugin's description to a more concise text.

= 1.1.2 =
Release Date: 2016-09-19

* Updated plugin's description and the list of supported service providers.

= 1.1.1 =
Release Date: 2016-09-15

* Fixed missing bug that was breaking the plugin on some environments.

= 1.1.0 =
Release Date: 2016-09-14

* Fixed uncommon bug that was breaking the plugin on some environments;
* Fixed bugs with PollDaddy urls;
* A lot of other bug fixes.

= 1.0.0 =
Release Date: 2016-07-27

* Initial release.
