<?php
$icon_src = EMBEDPRESS_SETTINGS_ASSETS_URL . "img/sources/icons";

$sources = [
    ["name" => "YouTube", "icon" => $icon_src . "/youtube.png", "type" => "video", "settings" => true],
    ["name" => "Youtube Live", "icon" => $icon_src . "/youtubelive.png", "type" => "stream", "settings" => true],
    ["name" => "Vimeo", "icon" => $icon_src . "/vimeo.png", "type" => "video", "settings" => true],
    ["name" => "Wistia", "icon" => $icon_src . "/wistia.png", "type" => "video", "settings" => true],
    ["name" => "Twitch", "icon" => $icon_src . "/twitch.png", "type" => "video", "settings" => true],
    ["name" => "Dailymotion", "icon" => $icon_src . "/dailymotion.png", "type" => "video", "settings" => true],
    ["name" => "SoundCloud", "icon" => $icon_src . "/soundcloud.png", "type" => "audio", "settings" => true],
    ["name" => "Spotify", "icon" => $icon_src . "/spotify.png", "type" => "audio", "settings" => true],
    ["name" => "Google Calendar", "icon" => $icon_src . "/google-calendar.png", "type" => "google", "settings" => true],
    ["name" => "OpenSea", "icon" => $icon_src . "/opensea.png", "type" => "google", "settings" => true],
    ["name" => "Calendly", "icon" => $icon_src . "/calendly.png", "type" => "calendar", "settings" => true],
    ["name" => "Google Drawings", "icon" => $icon_src . "/google-drawings.png", "type" => "google"],
    ["name" => "Google Docs", "icon" => $icon_src . "/google-docs.png", "type" => "google"],
    ["name" => "Google Slides", "icon" => $icon_src . "/google-slides.png", "type" => "google"],
    ["name" => "Google Forms", "icon" => $icon_src . "/google-forms.png", "type" => "google"],
    ["name" => "Google Maps", "icon" => $icon_src . "/google-maps.png", "type" => "google"],
    ["name" => "Google Sheets", "icon" => $icon_src . "/google-sheets.png", "type" => "google"],
    ["name" => "Twitter", "icon" => $icon_src . "/twitter.png", "type" => "social"],
    ["name" => "Facebook", "icon" => $icon_src . "/facebook.png", "type" => "social"],
    ["name" => "Instagram", "icon" => $icon_src . "/instagram.png", "type" => "social"],
    ["name" => "Github", "icon" => $icon_src . "/github.png", "type" => "social"],
    ["name" => "TikTok", "icon" => $icon_src . "/tiktok.png", "type" => "social"],
    ["name" => "Reddit", "icon" => $icon_src . "/reddit.png", "type" => "social"],
    ["name" => "WordPress.Tv", "icon" => $icon_src . "/wordpress-tv.png", "type" => "video"],
    ["name" => "Apple Podcast", "icon" => $icon_src . "/apple-podcast.png", "type" => "audio"],
    ["name" => "Tumblr", "icon" => $icon_src . "/tumblr.png", "type" => "social"],
    ["name" => "DeviantArt", "icon" => $icon_src . "/deviantart.png", "type" => "social"],
    ["name" => "UPS", "icon" => $icon_src . "/ups.png", "type" => "stream"],
    ["name" => "Rumble", "icon" => $icon_src . "/rumble.png", "type" => "video"],
    ["name" => "Gumroad", "icon" => $icon_src . "/gumroad.png", "type" => "stream"],
    ["name" => "Imgur Images", "icon" => $icon_src . "/imgur-images.png", "type" => "image"],
    ["name" => "Streamable", "icon" => $icon_src . "/streamable.png", "type" => "video"],
    ["name" => "Smugmug", "icon" => $icon_src . "/smugmug.png", "type" => "image"],
    ["name" => "Scribd", "icon" => $icon_src . "/scribd.png", "type" => "pdf"],
    ["name" => "Flickr Images", "icon" => $icon_src . "/flickr-images.png", "type" => "image"],
    ["name" => "Ifixit", "icon" => $icon_src . "/ifixit.png", "type" => "image"],
    ["name" => "SlideShare", "icon" => $icon_src . "/slideshare.png", "type" => "pdf"],
    ["name" => "Giphy Gifs", "icon" => $icon_src . "/giphy-gifs.png", "type" => "image"],
    ["name" => "TED Videos", "icon" => $icon_src . "/ted-videos.png", "type" => "video"],
    ["name" => "Meetup", "icon" => $icon_src . "/meetup.png", "type" => "social"],
    ["name" => "Wordwall", "icon" => $icon_src . "/wordwall.png", "type" => "social"],
    ["name" => "DocDroid", "icon" => $icon_src . "/docdroid.png", "type" => "pdf"],
    ["name" => "Kickstarter", "icon" => $icon_src . "/kickstarter.png", "type" => "social"],
    ["name" => "Getty Images", "icon" => $icon_src . "/getty-images.png", "type" => "image"],
    ["name" => "Vidyard", "icon" => $icon_src . "/vidyard.png", "type" => "video"],
    ["name" => "CodePen", "icon" => $icon_src . "/codepen.png", "type" => "social"],
    ["name" => "Padlet", "icon" => $icon_src . "/padlet.png", "type" => "social"],
    ["name" => "Hearthis", "icon" => $icon_src . "/hearthis.png", "type" => "audio"],
    ["name" => "Codesandbox", "icon" => $icon_src . "/codesandbox.png", "type" => "social"],
    ["name" => "Gyazo", "icon" => $icon_src . "/gyazo.png", "type" => "image"],
    ["name" => "Archivos", "icon" => $icon_src . "/archivos.png", "type" => "stream"],
    ["name" => "Gloria TV", "icon" => $icon_src . "/gloria-tv.png", "type" => "video"],
    ["name" => "BoomPlay", "icon" => $icon_src . "/boomplay.png", "type" => "audio"],
    ["name" => "Animoto", "icon" => $icon_src . "/animoto.png", "type" => "video"],
    ["name" => "Gfycat", "icon" => $icon_src . "/gfycat.png", "type" => "video"],
    ["name" => "MixCloud Audio", "icon" => $icon_src . "/mixcloud-audio.png", "type" => "audio"],
    ["name" => "Fader", "icon" => $icon_src . "/fader.png", "type" => "audio"],
    ["name" => "Coub Videos", "icon" => $icon_src . "/coub-videos.png", "type" => "video"],
    ["name" => "SpeakerDeck", "icon" => $icon_src . "/speakerdeck.png", "type" => "presentation"],
    ["name" => "Wizer", "icon" => $icon_src . "/wizer.png", "type" => "educational"],
    ["name" => "ReverbNation", "icon" => $icon_src . "/reverbnation.png", "type" => "audio"],
    ["name" => "Spreaker", "icon" => $icon_src . "/spreaker.png", "type" => "audio"],
    ["name" => "CircuitLab", "icon" => $icon_src . "/circuitlab.png", "type" => "educational"],
    ["name" => "LearningApps", "icon" => $icon_src . "/learningapps.png", "type" => "educational"],
    ["name" => "iHeartRadio", "icon" => $icon_src . "/iheartradio.png", "type" => "audio"],
    ["name" => "RunKit", "icon" => $icon_src . "/runkit.png", "type" => "development"],
    ["name" => "Flourish", "icon" => $icon_src . "/flourish.png", "type" => "data"],
    ["name" => "NRK Radio", "icon" => $icon_src . "/nrk-radio.png", "type" => "audio"],
    ["name" => "Roomshare", "icon" => $icon_src . "/roomshare.png", "type" => "social"],
    ["name" => "Infogram", "icon" => $icon_src . "/infogram.png", "type" => "data"],
    ["name" => "FITE", "icon" => $icon_src . "/fite.png", "type" => "sports"],
    ["name" => "Digiteka", "icon" => $icon_src . "/digiteka.png", "type" => "video"],
    ["name" => "Toornament", "icon" => $icon_src . "/toornament.png", "type" => "sports"],
    ["name" => "Sapa", "icon" => $icon_src . "/sapa.png", "type" => "social"],
    ["name" => "Huffduffer", "icon" => $icon_src . "/huffduffer.png", "type" => "audio"],
    ["name" => "Geograph UK", "icon" => $icon_src . "/geograph-uk.png", "type" => "map"],
    ["name" => "Tvcf", "icon" => $icon_src . "/tvcf.png", "type" => "video"],
    ["name" => "Cloudup", "icon" => $icon_src . "/cloudup.png", "type" => "file"],
    ["name" => "Sudomemo", "icon" => $icon_src . "/sudomemo.png", "type" => "social"],
    ["name" => "Fitapp", "icon" => $icon_src . "/fitapp.png", "type" => "health"],
    ["name" => "Edumedia", "icon" => $icon_src . "/edumedia.png", "type" => "educational"],
    ["name" => "Ludus", "icon" => $icon_src . "/ludus.png", "type" => "presentation"],
    ["name" => "Chirbit Audio", "icon" => $icon_src . "/chirbit-audio.png", "type" => "audio"],
    ["name" => "Clyp Audio", "icon" => $icon_src . "/clyp-audio.png", "type" => "audio"],
    ["name" => "Hippo Videos", "icon" => $icon_src . "/hippo-videos.png", "type" => "video"],
    ["name" => "Zingsoft", "icon" => $icon_src . "/zingsoft.png", "type" => "development"],
    ["name" => "Didacte", "icon" => $icon_src . "/didacte.png", "type" => "educational"],
    ["name" => "Lumiere", "icon" => $icon_src . "/lumiere.png", "type" => "photo"],
    ["name" => "Subscribi", "icon" => $icon_src . "/subscribi.png", "type" => "subscription"],
    ["name" => "Tuxx", "icon" => $icon_src . "/tuxx.png", "type" => "social"],
    ["name" => "Rcvis", "icon" => $icon_src . "/rcvis.png", "type" => "social"],
    ["name" => "LillePod", "icon" => $icon_src . "/lillepod.png", "type" => "podcast"],
    ["name" => "Onsizzle", "icon" => $icon_src . "/onsizzle.png", "type" => "social"],
    ["name" => "SocialExplorer", "icon" => $icon_src . "/socialexplorer.png", "type" => "social"],
    ["name" => "Namchey", "icon" => $icon_src . "/namchey.png", "type" => "social"],
    ["name" => "GetShow", "icon" => $icon_src . "/getshow.png", "type" => "social"],
    ["name" => "Orbitvu", "icon" => $icon_src . "/orbitvu.png", "type" => "photo"],
    ["name" => "Wave", "icon" => $icon_src . "/wave.png", "type" => "audio"],
    ["name" => "ShortNote", "icon" => $icon_src . "/shortnote.png", "type" => "note"],
    ["name" => "Dotsub", "icon" => $icon_src . "/dotsub.png", "type" => "video"],
    ["name" => "Zoomable", "icon" => $icon_src . "/zoomable.png", "type" => "photo"],
    ["name" => "The New York Times", "icon" => $icon_src . "/nytimes.png", "type" => "news"],
    ["name" => "SmashNotes", "icon" => $icon_src . "/smashnotes.png", "type" => "podcast"],
    ["name" => "Commaful", "icon" => $icon_src . "/commaful.png", "type" => "writing"],
    ["name" => "ShowTheWay", "icon" => $icon_src . "/showtheway.png", "type" => "map"],
    ["name" => "Blogcast", "icon" => $icon_src . "/blogcast.png", "type" => "podcast"],
    ["name" => "VideoPress", "icon" => $icon_src . "/videopress.png", "type" => "video"],
    ["name" => "Ethfiddle", "icon" => $icon_src . "/ethfiddle.png", "type" => "development"],
    ["name" => "KaKao TV", "icon" => $icon_src . "/kakaotv.png", "type" => "video"],
    ["name" => "Crowdsignal", "icon" => $icon_src . "/crowdsignal.png", "type" => "survey"],
    ["name" => "Medienarchiv", "icon" => $icon_src . "/medienarchiv.png", "type" => "media"],
    ["name" => "MermaidInk", "icon" => $icon_src . "/mermaidink.png", "type" => "graphics"],
    ["name" => "AudioClip", "icon" => $icon_src . "/audioclip.png", "type" => "audio"],
    ["name" => "Polldaddy Polls", "icon" => $icon_src . "/polldaddy.png", "type" => "survey"],
    ["name" => "Sway", "icon" => $icon_src . "/sway.png", "type" => "presentation"],
    ["name" => "Geograph", "icon" => $icon_src . "/geograph.png", "type" => "map"],
    ["name" => "VoxSnap", "icon" => $icon_src . "/voxsnap.png", "type" => "audio"],
    ["name" => "Overflow", "icon" => $icon_src . "/overflow.png", "type" => "web"],
    ["name" => "The NY Times IN", "icon" => $icon_src . "/nytimesin.png", "type" => "news"],
    ["name" => "SproutVideo", "icon" => $icon_src . "/sproutvideo.png", "type" => "video"],
    ["name" => "SongLink", "icon" => $icon_src . "/songlink.png", "type" => "audio"],
    ["name" => "23hq Photos", "icon" => $icon_src . "/23hq.png", "type" => "photo"],
    ["name" => "Geograph UK", "icon" => $icon_src . "/geograph-uk.png", "type" => "map"],
    ["name" => "ISSUU", "icon" => $icon_src . "/issuu.png", "type" => "document"],
    ["name" => "Roosterteeth", "icon" => $icon_src . "/roosterteeth.png", "type" => "video"],
    ["name" => "Daily Mile", "icon" => $icon_src . "/dailymile.png", "type" => "health"],
    ["name" => "Sketchfab", "icon" => $icon_src . "/sketchfab.png", "type" => "3D"],
    ["name" => "Matterport", "icon" => $icon_src . "/matterport.png", "type" => "3D"],
    ["name" => "Code point", "icon" => $icon_src . "/codepoint.png", "type" => "data"],
    ["name" => "MBM", "icon" => $icon_src . "/mbm.png", "type" => "audio"],
    ["name" => "Datawrapper", "icon" => $icon_src . "/datawrapper.png", "type" => "data"],
    ["name" => "Eyrie", "icon" => $icon_src . "/eyrie.png", "type" => "photo"],
    ["name" => "Cambridge Map", "icon" => $icon_src . "/cambridge-map.png", "type" => "map"],
    ["name" => "Geograph G", "icon" => $icon_src . "/geograph-g.png", "type" => "map"],
    ["name" => "Mermaid", "icon" => $icon_src . "/mermaid.png", "type" => "graphics"],
    ["name" => "Facebook Live", "icon" => $icon_src . "/facebooklive.png", "type" => "stream"],
    ["name" => "Polarishare", "icon" => $icon_src . "/polarishare.png", "type" => "stream"],
    ["name" => "PDF", "icon" => $icon_src . "/pdf.png", "type" => "pdf"]
];


$docs_url = [
    "https://embedpress.com/docs/embed-youtube-wordpress/",
    "https://embedpress.com/docs/embed-google-docs-wordpress/",
    "https://embedpress.com/docs/embed-google-slides-wordpress/",
    "https://embedpress.com/docs/embed-google-drawings-wordpress/",
    "https://embedpress.com/docs/embed-google-maps-wordpress/",
    "https://embedpress.com/docs/embed-google-sheets-wordpress/",
    "https://embedpress.com/docs/embed-facebook-posts-wordpress/",
    "https://embedpress.com/docs/embed-instagram-wordpress/",
    "https://embedpress.com/docs/embed-twitter-tweets-wordpress/",
    "https://embedpress.com/docs/embed-tiktok-in-wordpress/",
    "https://embedpress.com/docs/embed-reddit-post-wordpress/",
    "https://embedpress.com/docs/embed-github-gist-snippets-wordpress/",
    "https://embedpress.com/docs/embed-tumblr-wordpress/",
    "https://embedpress.com/docs/embed-wordpress-tv-videos-wordpress/",
    "https://embedpress.com/docs/how-to-embed-pantheon-sorbonne-university/",
    "https://embedpress.com/docs/how-to-embed-rumble-video/",
    "https://embedpress.com/docs/embed-deviantart-image-wordpress/",
    "https://embedpress.com/docs/embed-imgur-images-wordpress/",
    "https://embedpress.com/docs/embed-soundcloud-audio-wordpress/",
    "https://embedpress.com/docs/embed-dailymotion-videos-wordpress/",
    "https://embedpress.com/docs/embed-scribd-document-wordpress/",
    "https://embedpress.com/docs/embed-flickr-image-wordpress/",
    "https://embedpress.com/docs/embed-vimeo-videos-wordpress/",
    "https://embedpress.com/docs/embed-slideshare-presentations-wordpress/",
    "https://embedpress.com/docs/embed-giphy-gifs-wordpress/",
    "https://embedpress.com/docs/embed-gumroad-product/",
    "https://embedpress.com/docs/embed-meetup-groups-events-wordpress/",
    "https://embedpress.com/docs/how-to-embed-wordwall-lessons-in-wordpress/",
    "https://embedpress.com/docs/embed-smugmug-images-wordpress/",
    "https://embedpress.com/docs/embed-kickstarter-videos-wordpress/",
    "https://embedpress.com/docs/embed-getty-images-wordpress/",
    "https://embedpress.com/docs/embed-opensea-nft-collections-wordpress/",
    "https://embedpress.com/docs/how-to-embed-matterport-3d-scans/",
    "https://embedpress.com/docs/embed-codepen-codes-in-wordpress/",
    "https://embedpress.com/docs/how-to-embed-padlet-in-wordpress/",
    "https://embedpress.com/docs/how-to-embed-streamable-videos-in-wordpress/",
    "https://embedpress.com/docs/how-to-embed-codesandbox-codes-in-wordpress/",
    "https://embedpress.com/docs/how-to-embed-gyazo/",
    "https://embedpress.com/docs/how-to-embed-ifixit-repair-manuals-in-wordpress/",
    "https://embedpress.com/docs/how-to-embed-gloria-tv-videos-in-wordpress/",
    "https://embedpress.com/docs/how-to-embed-boomplay-music/",
    "https://embedpress.com/docs/embed-ted-videos-wordpress/",
    "https://embedpress.com/docs/how-to-embed-gfycat-gifs-in-wordpress/",
    "https://embedpress.com/docs/embed-mixcloud-audio-wordpress/",
    "https://embedpress.com/docs/embed-docdroid-documentation-in-wordpress/",
    "https://embedpress.com/docs/embed-coub-videos-iwordpress/",
    "https://embedpress.com/docs/embed-speakerdeck-presentations-wordpress/",
    "https://embedpress.com/docs/embed-reverbnation-audio-wordpress/",
    "https://embedpress.com/docs/embed-wistia-videos-wordpress/",
    "https://embedpress.com/docs/how-to-embed-spreaker-podcasts-in-wordpress/",
    "https://embedpress.com/docs/embed-vidyard-in-wordpress/",
    "https://embedpress.com/docs/how-to-embed-learningapps-apps-in-wordpress/",
    "https://embedpress.com/docs/how-to-embed-iheartradio-podcasts-in-wordpress/",
    "https://embedpress.com/docs/how-to-embed-hearthis-audio-in-wordpress/",
    "https://embedpress.com/docs/how-to-embed-flourish/",
    "https://embedpress.com/docs/embed-nrk-radio-podcasts-in-wordpress/",
    "https://embedpress.com/docs/embed-infogram-charts-wordpress/",
    "https://embedpress.com/docs/how-to-embed-fite/",
    "https://embedpress.com/docs/embed-animoto-videos-wordpress/",
    "https://embedpress.com/docs/how-to-embed-toornament/",
    "https://embedpress.com/docs/how-to-embed-sapo-videos-in-wordpress/",
    "https://embedpress.com/docs/how-to-embed-fader/",
    "https://embedpress.com/docs/how-to-embed-geograph/",
    "https://embedpress.com/docs/how-to-embed-tvcf-advertisements-in-wordpress/",
    "https://embedpress.com/docs/how-to-embed-wizer/",
    "https://embedpress.com/docs/embed-cloudup-videos-images-or-audios-wordpress/",
    "https://embedpress.com/docs/how-to-embed-sudomemo/",
    "https://embedpress.com/docs/embed-circuitlab-circuit-wordpress/",
    "https://embedpress.com/docs/how-to-embed-edumedia-science-files-in-wordpress/",
    "https://embedpress.com/docs/embed-ludus-in-wordpress/",
    "https://embedpress.com/docs/embed-runkit-in-wordpress/",
    "https://embedpress.com/docs/embed-clypit-audio-wordpress/",
    "https://embedpress.com/docs/embed-gumroad-product/",
    "https://embedpress.com/docs/embed-roomshare-listings-wordpress/",
    "https://embedpress.com/docs/how-to-embed-didacte-courses-in-wordpress/",
    "https://embedpress.com/docs/how-to-embed-lumiere/",
    "https://embedpress.com/docs/how-to-embed-huffduffer-podcasts-in-wordpress/",
    "https://embedpress.com/docs/embed-onsizzle-content-in-wordpress/",
    "https://embedpress.com/docs/how-to-embed-social-explorer-maps-in-wordpress/",
    "https://embedpress.com/docs/embed-chartblocks-charts-wordpress/",
    "https://embedpress.com/docs/how-to-embed-orbitvu-360-images-in-wordpress/",
    "https://embedpress.com/docs/embed-shortnote-notes-wordpress/",
    "https://embedpress.com/docs/embed-dotsub-videos-wordpress/",
    "https://embedpress.com/docs/embed-chirbit-audio-wordpress/",
    "https://embedpress.com/docs/embed-songlink-odesli-page/",
    "https://embedpress.com/docs/embed-the-new-york-times-news-in-wordpres/",
    "https://embedpress.com/docs/how-to-embed-smash-notes-podcasts-in-wordpress/",
    "https://embedpress.com/docs/how-to-embed-zingsoft-charts-grids-in-wordpress/",
    "https://embedpress.com/docs/how-to-embed-ethfiddle/",
    "https://embedpress.com/docs/how-to-embed-namchey/",
    "https://embedpress.com/docs/polldaddy-embed-wordpress/",
    "https://embedpress.com/docs/how-to-embed-sway/",
    "https://embedpress.com/docs/how-to-embed-voxsnap/"
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
                        <img class="source-image" src="<?php echo esc_url($source['icon']); ?>" alt="<?php echo esc_attr($source['name']); ?>">
                    </div>
                    <span class="source-name"><?php echo esc_html($source['name']); ?></span>
                </div>
                <div class="source-right">

                    <?php if (!empty($source['settings'])) : ?>
                        <a href="#">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#a)" stroke="#988FBD" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M6.883 2.878c.284-1.17 1.95-1.17 2.234 0a1.15 1.15 0 0 0 1.715.71c1.029-.626 2.207.551 1.58 1.58a1.148 1.148 0 0 0 .71 1.715c1.17.284 1.17 1.95 0 2.234a1.15 1.15 0 0 0-.71 1.715c.626 1.029-.551 2.207-1.58 1.58a1.148 1.148 0 0 0-1.715.71c-.284 1.17-1.95 1.17-2.234 0a1.15 1.15 0 0 0-1.715-.71c-1.029.626-2.207-.551-1.58-1.58a1.15 1.15 0 0 0-.71-1.715c-1.17-.284-1.17-1.95 0-2.234a1.15 1.15 0 0 0 .71-1.715c-.626-1.029.551-2.207 1.58-1.58a1.149 1.149 0 0 0 1.715-.71Z" />
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

                    <a href="<?php echo esc_url($docs_url[$index]); ?>">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <g clip-path="url(#a)" stroke="#988FBD" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M9.333 2v2.667a.667.667 0 0 0 .667.666h2.666" />
                                <path d="M11.333 14H4.666a1.334 1.334 0 0 1-1.333-1.333V3.333A1.333 1.333 0 0 1 4.666 2h4.667l3.333 3.333v7.334A1.333 1.333 0 0 1 11.333 14ZM6 11.333h4M6 8.667h4" />
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
    document.addEventListener("DOMContentLoaded", function() {
        var tabButtons = document.querySelectorAll(".tab-button");
        var tabItems = document.querySelectorAll(".source-item");

        tabButtons.forEach(function(button) {
            button.addEventListener("click", function() {
                tabButtons.forEach(function(btn) {
                    btn.classList.remove("active");
                });

                button.classList.add("active");

                var tabName = button.getAttribute("data-tab");

                tabItems.forEach(function(item) {
                    var dataTab = item.getAttribute("data-tab");
                    if (tabName === "all" || tabName === dataTab) {
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