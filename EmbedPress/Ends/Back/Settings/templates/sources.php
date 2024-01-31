<?php
$icon_src = EMBEDPRESS_SETTINGS_ASSETS_URL . "img/sources/icons";


$sources = [
    ["name" => "YouTube", "icon" => $icon_src . "/youtube.png", "type" => "video", "settings" => true, "settings_url" => admin_url('admin.php')."?page=embedpress&page_type=youtube", "doc_url" => "https://embedpress.com/docs/embed-youtube-wordpress/"],
    ["name" => "YouTube Live", "icon" => $icon_src . "/youtubelive.png", "type" => "stream", "settings" => true, "settings_url" => admin_url('admin.php')."?page=embedpress&page_type=youtube", "doc_url" => "https://embedpress.com/docs/embed-youtube-wordpress/"],
    ["name" => "Vimeo", "icon" => $icon_src . "/vimeo.png", "type" => "video", "settings" => true, "settings_url" => admin_url('admin.php')."?page=embedpress&page_type=vimeo", "doc_url" => "https://embedpress.com/docs/embed-vimeo-videos-wordpress/"],
    ["name" => "Wistia", "icon" => $icon_src . "/wistia.png", "type" => "video", "settings" => true, "settings_url" => admin_url('admin.php')."?page=embedpress&page_type=wistia", "doc_url" => "https://embedpress.com/docs/embed-wistia-videos-wordpress/"],
    ["name" => "Twitch", "icon" => $icon_src . "/twitch.png", "type" => "video", "settings" => true, "settings_url" => admin_url('admin.php')."?page=embedpress&page_type=twitch", "doc_url" => "https://embedpress.com/docs/embed-twitch-streams-chat/"],
    ["name" => "Dailymotion", "icon" => $icon_src . "/dailymotion.png", "type" => "video", "settings" => true, "settings_url" => admin_url('admin.php')."?page=embedpress&page_type=dailymotion", "doc_url" => "https://embedpress.com/docs/embed-dailymotion-videos-wordpress/"],
    ["name" => "PDF", "icon" => $icon_src . "/pdf.png", "type" => "pdf", "doc_url" => "https://wpdeveloper.com/embed-pdf-documents-wordpress"],
    ["name" => "SoundCloud", "icon" => $icon_src . "/soundcloud.png", "type" => "audio", "settings" => true, "settings_url" => admin_url('admin.php')."?page=embedpress&page_type=soundcloud", "doc_url" => "https://embedpress.com/docs/embed-soundcloud-audio-wordpress/"],
    ["name" => "Spotify", "icon" => $icon_src . "/spotify.png", "type" => "audio", "settings" => true, "settings_url" => admin_url('admin.php')."?page=embedpress&page_type=spotify", "doc_url" => "https://embedpress.com/docs/embed-spotify-audios-wordpress/"],
    ["name" => "Google Calendar", "icon" => $icon_src . "/google-calendar.png", "type" => "google", "settings" => true, "settings_url" => admin_url('admin.php')."?page=embedpress&page_type=google-calendar", "doc_url" => "https://embedpress.com/docs/embed-google-calendar-in-wordpress/"],
    ["name" => "OpenSea NFT", "icon" => $icon_src . "/opensea.png", "type" => "image", "settings" => true, "settings_url" => admin_url('admin.php')."?page=embedpress&page_type=opensea", "doc_url" => "https://embedpress.com/docs/embed-opensea-nft-collections-wordpress/"],
    ["name" => "Calendly", "icon" => $icon_src . "/calendly.png", "type" => "calendar", "settings" => true, "settings_url" => admin_url('admin.php')."?page=embedpress&page_type=calendly", "doc_url" => "https://embedpress.com/docs/how-to-embed-calendly-events-with-embedpress/"],
    ["name" => "Google Drawings", "icon" => $icon_src . "/google-drawings.png", "type" => "google pdf", "doc_url" => "https://embedpress.com/docs/embed-google-drawings-wordpress/"],
    ["name" => "Google Docs", "icon" => $icon_src . "/google-docs.png", "type" => "google pdf", "doc_url" => "https://embedpress.com/docs/embed-google-docs-wordpress/"],
    ["name" => "Google Slides", "icon" => $icon_src . "/google-slides.png", "type" => "google pdf", "doc_url" => "https://embedpress.com/docs/embed-google-slides-wordpress/"],
    ["name" => "Google Forms", "icon" => $icon_src . "/google-forms.png", "type" => "google", "doc_url" => "https://embedpress.com/docs/embed-google-forms-wordpress/"],
    ["name" => "Google Maps", "icon" => $icon_src . "/google-maps.png", "type" => "google", "doc_url" => "https://embedpress.com/docs/embed-google-maps-wordpress/"],
    ["name" => "Google Sheets", "icon" => $icon_src . "/google-sheets.png", "type" => "google pdf", "doc_url" => "https://embedpress.com/docs/embed-google-sheets-wordpress/"],
    ["name" => "X", "icon" => $icon_src . "/x.png", "type" => "social",  "doc_url" => "https://embedpress.com/docs/embed-twitter-tweets-wordpress/"],
    ["name" => "Facebook", "icon" => $icon_src . "/facebook.png", "type" => "social",  "doc_url" => "https://embedpress.com/docs/embed-facebook-posts-wordpress/"],
    ["name" => "Instagram", "icon" => $icon_src . "/instagram.png", "type" => "social",  "doc_url" => "https://embedpress.com/docs/embed-instagram-wordpress/"],
    ["name" => "Github", "icon" => $icon_src . "/github.png", "type" => "social",  "doc_url" => "https://embedpress.com/docs/embed-github-gist-snippets-wordpress/"],
    ["name" => "Tumblr", "icon" => $icon_src . "/tumblr.png", "type" => "social",  "doc_url" => "https://embedpress.com/docs/embed-tumblr-wordpress/"],
    ["name" => "WordPress.tv", "icon" => $icon_src . "/wordpress-tv.png", "type" => "video",  "doc_url" => "https://embedpress.com/docs/embed-wordpress-tv-videos-wordpress/"],
    ["name" => "Rumble Video", "icon" => $icon_src . "/rumble.png", "type" => "video", "doc_url" => "https://embedpress.com/docs/how-to-embed-rumble-video/"],
    ["name" => "DeviantArt", "icon" => $icon_src . "/deviantart.png", "type" => "image",  "doc_url" => "https://embedpress.com/docs/embed-deviantart-image-wordpress/"],
    ["name" => "Imgur", "icon" => $icon_src . "/imgur-images.png", "type" => "image",  "doc_url" => "https://embedpress.com/docs/embed-imgur-images-wordpress/"],
    ["name" => "Scribd", "icon" => $icon_src . "/scribd.png", "type" => "document",  "doc_url" => "https://embedpress.com/docs/embed-scribd-document-wordpress/"],
    ["name" => "Flickr", "icon" => $icon_src . "/flickr-images.png", "type" => "image",  "doc_url" => "https://embedpress.com/docs/embed-flickr-image-wordpress/"],
    ["name" => "Slideshare", "icon" => $icon_src . "/slideshare.png", "type" => "presentation",  "doc_url" => "https://embedpress.com/docs/embed-slideshare-presentations-wordpress/"],
    ["name" => "Giphy", "icon" => $icon_src . "/giphy-gifs.png", "type" => "image",  "doc_url" => "https://embedpress.com/docs/embed-giphy-gifs-wordpress/"],
    ["name" => "Gumroad", "icon" => $icon_src . "/gumroad.png", "type" => "product",  "doc_url" => "https://embedpress.com/docs/embed-gumroad-product/"],
    ["name" => "Meetup", "icon" => $icon_src . "/meetup.png", "type" => "event",  "doc_url" => "https://embedpress.com/docs/embed-meetup-groups-events-wordpress/"],
    ["name" => "Wordwall", "icon" => $icon_src . "/wordwall.png", "type" => "lesson", "doc_url" => "https://embedpress.com/docs/how-to-embed-wordwall-lessons-in-wordpress/"],
    ["name" => "SmugMug", "icon" => $icon_src . "/smugmug.png", "type" => "image",  "doc_url" => "https://embedpress.com/docs/embed-smugmug-images-wordpress/"],
    ["name" => "Kickstarter", "icon" => $icon_src . "/kickstarter.png", "type" => "video", "doc_url" => "https://embedpress.com/docs/embed-kickstarter-videos-wordpress/"],
    ["name" => "Getty Images", "icon" => $icon_src . "/getty-images.png", "type" => "image",  "doc_url" => "https://embedpress.com/docs/embed-getty-images-wordpress/"],
    ["name" => "Matterport 3D Scans", "icon" => $icon_src . "/matterport.png", "type" => "3d", "doc_url" => "https://embedpress.com/docs/how-to-embed-matterport-3d-scans/"],
    ["name" => "CodePen", "icon" => $icon_src . "/codepen.png", "type" => "code",  "doc_url" => "https://embedpress.com/docs/embed-codepen-codes-in-wordpress/"],
    ["name" => "Padlet", "icon" => $icon_src . "/padlet.png", "type" => "board", "doc_url" => "https://embedpress.com/docs/how-to-embed-padlet-in-wordpress/"],
    ["name" => "Streamable", "icon" => $icon_src . "/streamable.png", "type" => "video", "doc_url" => "https://embedpress.com/docs/how-to-embed-streamable-videos-in-wordpress/"],
    ["name" => "CodeSandbox", "icon" => $icon_src . "/codesandbox.png", "type" => "code", "doc_url" => "https://embedpress.com/docs/how-to-embed-codesandbox-codes-in-wordpress/"],
    ["name" => "Gyazo", "icon" => $icon_src . "/gyazo.png", "type" => "image", "doc_url" => "https://embedpress.com/docs/how-to-embed-gyazo/"],
    ["name" => "iFixit", "icon" => $icon_src . "/ifixit.png", "type" => "repair", "doc_url" => "https://embedpress.com/docs/how-to-embed-ifixit-repair-manuals-in-wordpress/"],
    ["name" => "Gloria.tv", "icon" => $icon_src . "/gloria-tv.png", "type" => "video", "doc_url" => "https://embedpress.com/docs/how-to-embed-gloria-tv-videos-in-wordpress/"],
    ["name" => "Boomplay Music", "icon" => $icon_src . "/boomplay.png", "type" => "music", "doc_url" => "https://embedpress.com/docs/how-to-embed-boomplay-music/"],
    ["name" => "TED", "icon" => $icon_src . "/ted-videos.png", "type" => "video", "doc_url" => "https://embedpress.com/docs/embed-ted-videos-wordpress/"],
    ["name" => "Gfycat", "icon" => $icon_src . "/gfycat.png", "type" => "gif", "doc_url" => "https://embedpress.com/docs/how-to-embed-gfycat-gifs-in-wordpress/"],
    ["name" => "Mixcloud", "icon" => $icon_src . "/mixcloud-audio.png", "type" => "audio", "doc_url" => "https://embedpress.com/docs/embed-mixcloud-audio-wordpress/"],
    ["name" => "DocDroid", "icon" => $icon_src . "/docdroid.png", "type" => "document", "doc_url" => "https://embedpress.com/docs/embed-docdroid-documentation-in-wordpress/"],
    ["name" => "Coub", "icon" => $icon_src . "/coub-videos.png", "type" => "video", "doc_url" => "https://embedpress.com/docs/embed-coub-videos-iwordpress/"],
    ["name" => "Speaker Deck", "icon" => $icon_src . "/speakerdeck.png", "type" => "presentation", "doc_url" => "https://embedpress.com/docs/embed-speakerdeck-presentations-wordpress/"],
    ["name" => "ReverbNation", "icon" => $icon_src . "/reverbnation.png", "type" => "audio", "doc_url" => "https://embedpress.com/docs/embed-reverbnation-audio-wordpress/"],
    ["name" => "Spreaker", "icon" => $icon_src . "/spreaker.png", "type" => "podcast", "doc_url" => "https://embedpress.com/docs/how-to-embed-spreaker-podcasts-in-wordpress/"],
    ["name" => "Vidyard", "icon" => $icon_src . "/vidyard.png", "type" => "video", "doc_url" => "https://embedpress.com/docs/embed-vidyard-in-wordpress/"],
    ["name" => "LearningApps", "icon" => $icon_src . "/learningapps.png", "type" => "app", "doc_url" => "https://embedpress.com/docs/how-to-embed-learningapps-apps-in-wordpress/"],
    ["name" => "iHeartRadio", "icon" => $icon_src . "/iHeartradio.png", "type" => "podcast", "doc_url" => "https://embedpress.com/docs/how-to-embed-iheartradio-podcasts-in-wordpress/"],
    ["name" => "Hearthis.at", "icon" => $icon_src . "/hearthis.png", "type" => "audio", "doc_url" => "https://embedpress.com/docs/how-to-embed-hearthis-audio-in-wordpress/"],
    ["name" => "Flourish", "icon" => $icon_src . "/flourish.png", "type" => "chart", "doc_url" => "https://embedpress.com/docs/how-to-embed-flourish/"],
    ["name" => "NRK Radio", "icon" => $icon_src . "/nrk-radio.png", "type" => "podcast", "doc_url" => "https://embedpress.com/docs/embed-nrk-radio-podcasts-in-wordpress/"],
    ["name" => "Infogram", "icon" => $icon_src . "/infogram.png", "type" => "chart", "doc_url" => "https://embedpress.com/docs/embed-infogram-charts-wordpress/"],
    ["name" => "FITE", "icon" => $icon_src . "/fite.png", "type" => "video", "doc_url" => "https://embedpress.com/docs/how-to-embed-fite/"],
    ["name" => "Animoto", "icon" => $icon_src . "/animoto.png", "type" => "video", "doc_url" => "https://embedpress.com/docs/embed-animoto-videos-wordpress/"],

    ["name" => "Digiteka", "icon" => $icon_src . "/digiteka.png", "type" => "video", "doc_url" => ""],

    ["name" => "Toornament", "icon" => $icon_src . "/toornament.png", "type" => "esports", "doc_url" => "https://embedpress.com/docs/how-to-embed-toornament/"],
    ["name" => "SAPO Videos", "icon" => $icon_src . "/sapa.png", "type" => "video", "doc_url" => "https://embedpress.com/docs/how-to-embed-sapo-videos-in-wordpress/"],
    ["name" => "Fader", "icon" => $icon_src . "/fader.png", "type" => "music", "doc_url" => "https://embedpress.com/docs/how-to-embed-fader/"],
    ["name" => "TVCF Advertisements", "icon" => $icon_src . "/tvcf.png", "type" => "video", "doc_url" => "https://embedpress.com/docs/how-to-embed-tvcf-advertisements-in-wordpress/"],
    ["name" => "Wizer", "icon" => $icon_src . "/wizer.png", "type" => "education", "doc_url" => "https://embedpress.com/docs/how-to-embed-wizer/"],
    ["name" => "Cloudup", "icon" => $icon_src . "/cloudup.png", "type" => "cloud", "doc_url" => "https://embedpress.com/docs/embed-cloudup-videos-images-or-audios-wordpress/"],
    ["name" => "Sudomemo", "icon" => $icon_src . "/sudomemo.png", "type" => "animation", "doc_url" => "https://embedpress.com/docs/how-to-embed-sudomemo/"],
    ["name" => "CircuitLab", "icon" => $icon_src . "/circuitlab.png", "type" => "circuit", "doc_url" => "https://embedpress.com/docs/embed-circuitlab-circuit-wordpress/"],
    ["name" => "Edumedia Science Files", "icon" => $icon_src . "/edumedia.png", "type" => "science", "doc_url" => "https://embedpress.com/docs/how-to-embed-edumedia-science-files-in-wordpress/"],
    ["name" => "Ludus", "icon" => $icon_src . "/ludus.png", "type" => "presentation", "doc_url" => "https://embedpress.com/docs/embed-ludus-in-wordpress/"],
    ["name" => "RunKit", "icon" => $icon_src . "/runkit.png", "type" => "code", "doc_url" => "https://embedpress.com/docs/embed-runkit-in-wordpress/"],
    ["name" => "Clyp.it", "icon" => $icon_src . "/clyp-audio.png", "type" => "audio", "doc_url" => "https://embedpress.com/docs/embed-clypit-audio-wordpress/"],

    ["name" => "Hippo Videos", "icon" => $icon_src . "/hippo-videos.png", "type" => "video", "doc_url" => ""],

    ["name" => "Roomshare Listings", "icon" => $icon_src . "/roomshare.png", "type" => "listing", "doc_url" => "https://embedpress.com/docs/embed-roomshare-listings-wordpress/"],
    ["name" => "Didacte Courses", "icon" => $icon_src . "/didacte.png", "type" => "course", "doc_url" => "https://embedpress.com/docs/how-to-embed-didacte-courses-in-wordpress/"],
    ["name" => "Lumiere", "icon" => $icon_src . "/lumiere.png", "type" => "video", "doc_url" => "https://embedpress.com/docs/how-to-embed-lumiere/"],
    ["name" => "Huffduffer", "icon" => $icon_src . "/huffduffer.png", "type" => "podcast", "doc_url" => "https://embedpress.com/docs/how-to-embed-huffduffer-podcasts-in-wordpress/"],
    ["name" => "OnSizzle Content", "icon" => $icon_src . "/onsizzle.png", "type" => "meme", "doc_url" => "https://embedpress.com/docs/embed-onsizzle-content-in-wordpress/"],
    ["name" => "Social Explorer Maps", "icon" => $icon_src . "/socialexplorer.png", "type" => "map", "doc_url" => "https://embedpress.com/docs/how-to-embed-social-explorer-maps-in-wordpress/"],
    ["name" => "Chartblocks", "icon" => $icon_src . "/chartblocks.png", "type" => "chart", "doc_url" => "https://embedpress.com/docs/embed-chartblocks-charts-wordpress/"],
    ["name" => "Orbitvu 360 Images", "icon" => $icon_src . "/orbitvu.png", "type" => "image", "doc_url" => "https://embedpress.com/docs/how-to-embed-orbitvu-360-images-in-wordpress/"],

    ["name" => "GetShow", "icon" => $icon_src . "/getshow.png", "type" => "social", "doc_url" => "https://embedpress.com/docs/how-to-embed-getshow-social-posts-in-wordpress/"],
    ["name" => "Wave", "icon" => $icon_src . "/wave.png", "type" => "audio", "doc_url" => "https://embedpress.com/docs/how-to-embed-wave-videos-in-wordpress/"],

    ["name" => "Shortnote", "icon" => $icon_src . "/shortnote.png", "type" => "note", "doc_url" => "https://embedpress.com/docs/embed-shortnote-notes-wordpress/"],
    ["name" => "Dotsub", "icon" => $icon_src . "/dotsub.png", "type" => "video", "doc_url" => "https://embedpress.com/docs/embed-dotsub-videos-wordpress/"],
    ["name" => "Chirbit", "icon" => $icon_src . "/chirbit-audio.png", "type" => "audio", "doc_url" => "https://embedpress.com/docs/embed-chirbit-audio-wordpress/"],
    ["name" => "Songlink Odesli Page", "icon" => $icon_src . "/songlink.png", "type" => "music", "doc_url" => "https://embedpress.com/docs/embed-songlink-odesli-page/"],
    ["name" => "The New York Times", "icon" => $icon_src . "/nytimes.png", "type" => "news", "doc_url" => "https://embedpress.com/docs/embed-the-new-york-times-news-in-wordpress/"],
    ["name" => "Smash Notes Podcasts", "icon" => $icon_src . "/smashnotes.png", "type" => "podcast", "doc_url" => "https://embedpress.com/docs/how-to-embed-smash-notes-podcasts-in-wordpress/"],

    ["name" => "Commaful", "icon" => $icon_src . "/commaful.png", "type" => "writing", "doc_url" => "https://embedpress.com/docs/how-to-embed-commaful-in-wordpress/"],
    ["name" => "ShowTheWay", "icon" => $icon_src . "/showtheway.png", "type" => "map", "doc_url" => "https://embedpress.com/docs/how-to-embed-showtheway-maps-in-wordpress/"],
    ["name" => "Blogcast", "icon" => $icon_src . "/blogcast.png", "type" => "podcast", "doc_url" => "https://embedpress.com/docs/how-to-embed-blogcast-podcasts-in-wordpress/"],
    ["name" => "VideoPress", "icon" => $icon_src . "/videopress.png", "type" => "video", "doc_url" => "https://embedpress.com/docs/embed-videopress-videos-wordpress/"],
    ["name" => "KaKao TV", "icon" => $icon_src . "/kakaotv.png", "type" => "video", "doc_url" => "https://embedpress.com/docs/how-to-embed-kakao-tv-videos-in-wordpress/"],
    ["name" => "Crowdsignal", "icon" => $icon_src . "/crowdsignal.png", "type" => "survey", "doc_url" => "https://embedpress.com/docs/how-to-embed-crowdsignal-surveys-in-wordpress/"],
    ["name" => "Medienarchiv", "icon" => $icon_src . "/medienarchiv.png", "type" => "media", "doc_url" => "https://embedpress.com/docs/how-to-embed-medienarchiv-of-zurich-university/"],


    ["name" => "ZingSoft Charts & Grids", "icon" => $icon_src . "/zingsoft.png", "type" => "chart", "doc_url" => "https://embedpress.com/docs/how-to-embed-zingsoft-charts-grids-in-wordpress/"],
    ["name" => "EthFiddle", "icon" => $icon_src . "/ethfiddle.png", "type" => "ethereum", "doc_url" => "https://embedpress.com/docs/how-to-embed-ethfiddle/"],
    ["name" => "Namchey", "icon" => $icon_src . "/namchey.png", "type" => "namchey", "doc_url" => "https://embedpress.com/docs/how-to-embed-namchey/"],
    ["name" => "Polldaddy", "icon" => $icon_src . "/polldaddy.png", "type" => "poll", "doc_url" => "https://embedpress.com/docs/polldaddy-embed-wordpress/"],
    ["name" => "Sway", "icon" => $icon_src . "/sway.png", "type" => "presentation", "doc_url" => "https://embedpress.com/docs/how-to-embed-sway/"],
    ["name" => "VoxSnap", "icon" => $icon_src . "/voxsnap.png", "type" => "audio", "doc_url" => "https://embedpress.com/docs/how-to-embed-voxsnap/"],

    ["name" => "Overflow", "icon" => $icon_src . "/overflow.png", "type" => "web", "doc_url" => "https://embedpress.com/docs/how-to-embed-overflow-in-wordpress-with-embedpress/"],
    ["name" => "SproutVideo", "icon" => $icon_src . "/sproutvideo.png", "type" => "video", "doc_url" => "https://embedpress.com/docs/how-to-embed-sproutvideo/"],
    ["name" => "SongLink", "icon" => $icon_src . "/songlink.png", "type" => "audio", "doc_url" => "https://embedpress.com/docs/how-to-embed-sproutvideo/"],
    ["name" => "23hq Photos", "icon" => $icon_src . "/23hq.png", "type" => "photo", "doc_url" => "https://embedpress.com/docs/embed-23hq-photos-wordpress/"],
    ["name" => "Geograph UK", "icon" => $icon_src . "/geograph-uk.png", "type" => "map", "doc_url" => "https://embedpress.com/docs/how-to-embed-geograph/"],
    ["name" => "ISSUU", "icon" => $icon_src . "/issuu.png", "type" => "document", "doc_url" => "https://embedpress.com/docs/embed-issuu-documents-wordpress/"],
    ["name" => "Roosterteeth", "icon" => $icon_src . "/roosterteeth.png", "type" => "video", "doc_url" => "https://embedpress.com/docs/embed-roosterteeth-videos-wordpress/"],
    ["name" => "Daily Mile", "icon" => $icon_src . "/dailymile.png", "type" => "health", "doc_url" => "https://embedpress.com/docs/embed-dailymile-activity-wordpress/"],
    ["name" => "Sketchfab", "icon" => $icon_src . "/sketchfab.png", "type" => "3D", "doc_url" => "https://embedpress.com/docs/embed-sketchfab-drawings-wordpress/"],
    ["name" => "Matterport", "icon" => $icon_src . "/matterport.png", "type" => "3D", "doc_url" => "https://embedpress.com/docs/how-to-embed-matterport-3d-scans/"],
    ["name" => "Code point", "icon" => $icon_src . "/codepoint.png", "type" => "data", "doc_url" => "https://embedpress.com/docs/how-to-embed-codepoints-codes-in-wordpress/"],
    ["name" => "MBM", "icon" => $icon_src . "/mbm.png", "type" => "audio", "doc_url" => "https://embedpress.com/docs/how-to-embed-mbm-audio-in-wordpress/"],
    ["name" => "Datawrapper", "icon" => $icon_src . "/datawrapper.png", "type" => "data", "doc_url" => "https://embedpress.com/docs/how-to-embed-datawrapper-data-charts-in-wordpress/"],
    ["name" => "Eyrie", "icon" => $icon_src . "/eyrie.png", "type" => "photo", "doc_url" => "https://embedpress.com/docs/how-to-embed-eyrie-photo-albums-in-wordpress/"],
    ["name" => "Cambridge Map", "icon" => $icon_src . "/cambridge-map.png", "type" => "map", "doc_url" => "https://embedpress.com/docs/how-to-embed-university-cambridge-map/"],
    ["name" => "Mermaid", "icon" => $icon_src . "/mermaid.png", "type" => "graphics", "doc_url" => "https://embedpress.com/docs/embed-mermaid-in-wordpress/"],
    ["name" => "Facebook Live", "icon" => $icon_src . "/facebooklive.png", "type" => "stream", "doc_url" => "https://embedpress.com/docs/embed-facebook-posts-wordpress/"],
    ["name" => "PolariShare", "icon" => $icon_src . "/polarishare.png", "type" => "stream", "doc_url" => "https://embedpress.com/docs/how-to-embed-polarishare-videos-in-wordpress/"],

];


?>


<div class="source-settings-page">

    <div class="tab-content-section">
        <?php
        $index = 0;
        foreach ($sources as $source) : ?>
        <div class="source-item" data-tab="<?php echo esc_attr($source['type']); ?>">
            <div class="source-left">
                <div class="icon">
                    <img class="source-image" src="<?php echo esc_url($source['icon']); ?>"
                        alt="<?php echo esc_attr($source['name']); ?>">
                </div>
                <span class="source-name"><?php echo esc_html($source['name']); ?></span>
            </div>
            <div class="source-right">

                <?php if (!empty($source['settings'])) : ?>
                <a href="<?php echo esc_url($source['settings_url']); ?>">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#a)" stroke="#988FBD" stroke-linecap="round" stroke-linejoin="round">
                            <path
                                d="M6.883 2.878c.284-1.17 1.95-1.17 2.234 0a1.15 1.15 0 0 0 1.715.71c1.029-.626 2.207.551 1.58 1.58a1.148 1.148 0 0 0 .71 1.715c1.17.284 1.17 1.95 0 2.234a1.15 1.15 0 0 0-.71 1.715c.626 1.029-.551 2.207-1.58 1.58a1.148 1.148 0 0 0-1.715.71c-.284 1.17-1.95 1.17-2.234 0a1.15 1.15 0 0 0-1.715-.71c-1.029.626-2.207-.551-1.58-1.58a1.15 1.15 0 0 0-.71-1.715c-1.17-.284-1.17-1.95 0-2.234a1.15 1.15 0 0 0 .71-1.715c-.626-1.029.551-2.207 1.58-1.58a1.149 1.149 0 0 0 1.715-.71Z" />
                            <path d="M6 8a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z" />
                        </g>
                        <defs>
                            <clipPath id="a">
                                <path fill="#fff" d="M0 0h16v16H0z" />
                            </clipPath>
                        </defs>
                    </svg>
                </a>
                <?php endif; ?>

                <a href="<?php if(!empty($source['doc_url'])): echo esc_url($source['doc_url']); endif; ?>"
                    target="_blank">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <g clip-path="url(#a)" stroke="#988FBD" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9.333 2v2.667a.667.667 0 0 0 .667.666h2.666" />
                            <path
                                d="M11.333 14H4.666a1.334 1.334 0 0 1-1.333-1.333V3.333A1.333 1.333 0 0 1 4.666 2h4.667l3.333 3.333v7.334A1.333 1.333 0 0 1 11.333 14ZM6 11.333h4M6 8.667h4" />
                        </g>
                        <defs>
                            <clipPath id="a">
                                <path fill="#fff" d="M0 0h16v16H0z" />
                            </clipPath>
                        </defs>
                    </svg>
                </a>
            </div>
        </div>
        <?php $index++;
        endforeach; ?>
    </div>
</div>

<script>
    document.addEventListener("DOMContentLoaded", function () {
        var tabButtons = document.querySelectorAll(".tab-button");
        var tabItems = document.querySelectorAll(".source-item");

        tabButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                tabButtons.forEach(function (btn) {
                    btn.classList.remove("active");
                });

                button.classList.add("active");

                var tabName = button.getAttribute("data-tab");

                tabItems.forEach(function (item) {
                    var dataTabs = item.getAttribute("data-tab").split(' ');
                    if (tabName === "all" || dataTabs.includes(tabName)) {
                        item.style.display = "flex";
                    } else {
                        item.style.display = "none";
                    }
                });
            });
        });

        var allButton = document.querySelector(".tab-button[data-tab='all']");
        if (allButton) {
            allButton.click();
        }
    });
</script>