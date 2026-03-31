
const { test, expect } = require('@playwright/test');

const image_path = "https://ep-automation.mdnahidhasan.com/wp-content/plugins/embedpress/assets/images/sources/icons";


const data = [
    {
        img: `${image_path}/google-photos.png`,
        name: "Google Photos",
        doc: "https://embedpress.com/docs/embed-google-photos-in-wordpress/",
    },
    {
        img: `${image_path}/instagram.png`,
        name: "Instagram",
        doc: "https://embedpress.com/docs/embed-instagram-wordpress/",
    },
    {
        img: `${image_path}/airtable.png`,
        name: "Airtable",
        doc: "https://embedpress.com/docs/embed-airtable-workspace-with-embedpress/",
    },
    {
        img: `${image_path}/canva.webp`,
        name: "Canva",
        doc: "https://embedpress.com/docs/embed-canva-in-wordpress/",
    },
    {
        img: `${image_path}/youtube.png`,
        name: "YouTube",
        doc: "https://embedpress.com/docs/embed-youtube-wordpress/",
    },
    {
        img: `${image_path}/youtubelive.png`,
        name: "YouTube Live",
        doc: "https://embedpress.com/docs/embed-youtube-wordpress/",
    },
    {
        img: `${image_path}/vimeo.png`,
        name: "Vimeo",
        doc: "https://embedpress.com/docs/embed-vimeo-videos-wordpress/",
    },
    {
        img: `${image_path}/wistia.png`,
        name: "Wistia",
        doc: "https://embedpress.com/docs/embed-wistia-videos-wordpress/",
    },
    {
        img: `${image_path}/twitch.png`,
        name: "Twitch",
        doc: "https://embedpress.com/docs/embed-twitch-streams-chat/",
    },
    {
        img: `${image_path}/dailymotion.png`,
        name: "Dailymotion",
        doc: "https://embedpress.com/docs/embed-dailymotion-videos-wordpress/",
    },
    {
        img: `${image_path}/pdf.png`,
        name: "PDF",
        doc: "https://wpdeveloper.com/embed-pdf-documents-wordpress",
    },
    {
        img: `${image_path}/soundcloud.png`,
        name: "SoundCloud",
        doc: "https://embedpress.com/docs/embed-soundcloud-audio-wordpress/",
    },
    {
        img: `${image_path}/spotify.png`,
        name: "Spotify",
        doc: "https://embedpress.com/docs/embed-spotify-audios-wordpress/",
    },
    {
        img: `${image_path}/spreaker.png`,
        name: "Spreaker",
        doc: "https://embedpress.com/docs/how-to-embed-spreaker-podcasts-in-wordpress/",
    },
    {
        img: `${image_path}/word.svg`,
        name: "MS Word",
        doc: "https://embedpress.com/docs/embed-word-document-in-wordpress/",
    },
    {
        img: `${image_path}/xlsx.svg`,
        name: "MS XLSX",
        doc: "https://embedpress.com/docs/embed-excel-workbook-in-wordpress/",
    },
    {
        img: `${image_path}/opensea.png`,
        name: "OpenSea NFT",
        doc: "https://embedpress.com/docs/embed-opensea-nft-collections-wordpress/",
    },
    {
        img: `${image_path}/calendly.png`,
        name: "Calendly",
        doc: "https://embedpress.com/docs/how-to-embed-calendly-events-with-embedpress/",
    },
    {
        img: `${image_path}/google-docs.png`,
        name: "Google Docs",
        doc: "https://embedpress.com/docs/embed-google-docs-wordpress/",
    },
    {
        img: `${image_path}/google-slides.png`,
        name: "Google Slides",
        doc: "https://embedpress.com/docs/embed-google-slides-wordpress/",
    },
    {
        img: `${image_path}/google-forms.png`,
        name: "Google Forms",
        doc: "https://embedpress.com/docs/embed-google-forms-wordpress/",
    },
    {
        img: `${image_path}/google-maps.png`,
        name: "Google Maps",
        doc: "https://embedpress.com/docs/embed-google-maps-wordpress/",
    },
    {
        img: `${image_path}/google-sheets.png`,
        name: "Google Sheets",
        doc: "https://embedpress.com/docs/embed-google-sheets-wordpress/",
    },
    {
        img: `${image_path}/google-calendar.png`,
        name: "Google Calendar",
        doc: "https://embedpress.com/docs/embed-google-calendar-in-wordpress/",
    },
    {
        img: `${image_path}/google-drawings.png`,
        name: "Google Drawings",
        doc: "https://embedpress.com/docs/embed-google-drawings-wordpress/",
    },

    {
        img: `${image_path}/facebook.png`,
        name: "Facebook",
        doc: "https://embedpress.com/docs/embed-facebook-posts-wordpress/",
    },
    {
        img: `${image_path}/facebooklive.png`,
        name: "Facebook Live",
        doc: "https://embedpress.com/docs/embed-facebook-posts-wordpress/",
    },
    {
        img: `${image_path}/x.png`,
        name: "X",
        doc: "https://embedpress.com/docs/embed-twitter-tweets-wordpress/",
    },
    {
        img: `${image_path}/linkedin.png`,
        name: "LinkedIn",
        doc: "https://embedpress.com/docs/embed-linkedin-posts-in-wordpress/",
    },
    {
        img: `${image_path}/github.png`,
        name: "Github",
        doc: "https://embedpress.com/docs/embed-github-gist-snippets-wordpress/",
    },
    {
        img: `${image_path}/tumblr.png`,
        name: "Tumblr",
        doc: "https://embedpress.com/docs/embed-tumblr-wordpress/",
    },
    {
        img: `${image_path}/wordpress-tv.png`,
        name: "WordPress.tv",
        doc: "https://embedpress.com/docs/embed-wordpress-tv-videos-wordpress/",
    },
    {
        img: `${image_path}/rumble.png`,
        name: "Rumble Video",
        doc: "https://embedpress.com/docs/how-to-embed-rumble-video/",
    },
    {
        img: `${image_path}/deviantart.png`,
        name: "DeviantArt",
        doc: "https://embedpress.com/docs/embed-deviantart-image-wordpress/",
    },
    {
        img: `${image_path}/imgur-images.png`,
        name: "Imgur",
        doc: "https://embedpress.com/docs/embed-imgur-images-wordpress/",
    },
    {
        img: `${image_path}/scribd.png`,
        name: "Scribd",
        doc: "https://embedpress.com/docs/embed-scribd-document-wordpress/",
    },
    {
        img: `${image_path}/flickr-images.png`,
        name: "Flickr",
        doc: "https://embedpress.com/docs/embed-flickr-image-wordpress/",
    },
    {
        img: `${image_path}/slideshare.png`,
        name: "Slideshare",
        doc: "https://embedpress.com/docs/embed-slideshare-presentations-wordpress/",
    },
    {
        img: `${image_path}/giphy-gifs.png`,
        name: "Giphy",
        doc: "https://embedpress.com/docs/embed-giphy-gifs-wordpress/",
    },
    {
        img: `${image_path}/gumroad.png`,
        name: "Gumroad",
        doc: "https://embedpress.com/docs/embed-gumroad-product/",
    },
    {
        img: `${image_path}/meetup.png`,
        name: "Meetup",
        doc: "https://embedpress.com/docs/embed-meetup-groups-events-wordpress/",
    },
    {
        img: `${image_path}/wordwall.png`,
        name: "Wordwall",
        doc: "https://embedpress.com/docs/how-to-embed-wordwall-lessons-in-wordpress/",
    },
    {
        img: `${image_path}/smugmug.png`,
        name: "SmugMug",
        doc: "https://embedpress.com/docs/embed-smugmug-images-wordpress/",
    },
    {
        img: `${image_path}/kickstarter.png`,
        name: "Kickstarter",
        doc: "https://embedpress.com/docs/embed-kickstarter-videos-wordpress/",
    },
    {
        img: `${image_path}/getty-images.png`,
        name: "Getty Images",
        doc: "https://embedpress.com/docs/embed-getty-images-wordpress/",
    },
    {
        img: `${image_path}/matterport.png`,
        name: "Matterport 3D Scans",
        doc: "https://embedpress.com/docs/how-to-embed-matterport-3d-scans/",
    },
    {
        img: `${image_path}/codepen.png`,
        name: "CodePen",
        doc: "https://embedpress.com/docs/embed-codepen-codes-in-wordpress/",
    },
    {
        img: `${image_path}/padlet.png`,
        name: "Padlet",
        doc: "https://embedpress.com/docs/how-to-embed-padlet-in-wordpress/",
    },
    {
        img: `${image_path}/streamable.png`,
        name: "Streamable",
        doc: "https://embedpress.com/docs/how-to-embed-streamable-videos-in-wordpress/",
    },
    {
        img: `${image_path}/codesandbox.png`,
        name: "CodeSandbox",
        doc: "https://embedpress.com/docs/how-to-embed-codesandbox-codes-in-wordpress/",
    },
    {
        img: `${image_path}/gyazo.png`,
        name: "Gyazo",
        doc: "https://embedpress.com/docs/how-to-embed-gyazo/",
    },
    {
        img: `${image_path}/ifixit.png`,
        name: "iFixit",
        doc: "https://embedpress.com/docs/how-to-embed-ifixit-repair-manuals-in-wordpress/",
    },
    {
        img: `${image_path}/gloria-tv.png`,
        name: "Gloria.tv",
        doc: "https://embedpress.com/docs/how-to-embed-gloria-tv-videos-in-wordpress/",
    },
    {
        img: `${image_path}/boomplay.png`,
        name: "Boomplay Music",
        doc: "https://embedpress.com/docs/how-to-embed-boomplay-music/",
    },
    {
        img: `${image_path}/ted-videos.png`,
        name: "TED",
        doc: "https://embedpress.com/docs/embed-ted-videos-wordpress/",
    },
    {
        img: `${image_path}/gfycat.png`,
        name: "Gfycat",
        doc: "https://embedpress.com/docs/how-to-embed-gfycat-gifs-in-wordpress/",
    },
    {
        img: `${image_path}/mixcloud-audio.png`,
        name: "Mixcloud",
        doc: "https://embedpress.com/docs/embed-mixcloud-audio-wordpress/",
    },
    {
        img: `${image_path}/docdroid.png`,
        name: "DocDroid",
        doc: "https://embedpress.com/docs/embed-docdroid-documentation-in-wordpress/",
    },
    {
        img: `${image_path}/coub-videos.png`,
        name: "Coub",
        doc: "https://embedpress.com/docs/embed-coub-videos-iwordpress/",
    },
    {
        img: `${image_path}/speakerdeck.png`,
        name: "Speaker Deck",
        doc: "https://embedpress.com/docs/embed-speakerdeck-presentations-wordpress/",
    },
    {
        img: `${image_path}/reverbnation.png`,
        name: "ReverbNation",
        doc: "https://embedpress.com/docs/embed-reverbnation-audio-wordpress/",
    },
    {
        img: `${image_path}/vidyard.png`,
        name: "Vidyard",
        doc: "https://embedpress.com/docs/embed-vidyard-in-wordpress/",
    },
    {
        img: `${image_path}/learningapps.png`,
        name: "LearningApps",
        doc: "https://embedpress.com/docs/how-to-embed-learningapps-apps-in-wordpress/",
    },
    {
        img: `${image_path}/iHeartradio.png`,
        name: "iHeartRadio",
        doc: "https://embedpress.com/docs/how-to-embed-iheartradio-podcasts-in-wordpress/",
    },
    {
        img: `${image_path}/hearthis.png`,
        name: "Hearthis.at",
        doc: "https://embedpress.com/docs/how-to-embed-hearthis-audio-in-wordpress/",
    },
    {
        img: `${image_path}/flourish.png`,
        name: "Flourish",
        doc: "https://embedpress.com/docs/how-to-embed-flourish/",
    },
    {
        img: `${image_path}/nrk-radio.png`,
        name: "NRK Radio",
        doc: "https://embedpress.com/docs/embed-nrk-radio-podcasts-in-wordpress/",
    },
    {
        img: `${image_path}/infogram.png`,
        name: "Infogram",
        doc: "https://embedpress.com/docs/embed-infogram-charts-wordpress/",
    },
    {
        img: `${image_path}/fite.png`,
        name: "FITE",
        doc: "https://embedpress.com/docs/how-to-embed-fite/",
    },
    {
        img: `${image_path}/animoto.png`,
        name: "Animoto",
        doc: "https://embedpress.com/docs/embed-animoto-videos-wordpress/",
    },
    {
        img: `${image_path}/digiteka.png`,
        name: "Digiteka",
        doc: "",
    },
    {
        img: `${image_path}/toornament.png`,
        name: "Toornament",
        doc: "https://embedpress.com/docs/how-to-embed-toornament/",
    },
    {
        img: `${image_path}/sapa.png`,
        name: "SAPO Videos",
        doc: "https://embedpress.com/docs/how-to-embed-sapo-videos-in-wordpress/",
    },
    {
        img: `${image_path}/fader.png`,
        name: "Fader",
        doc: "https://embedpress.com/docs/how-to-embed-fader/",
    },
    {
        img: `${image_path}/tvcf.png`,
        name: "TVCF Advertisements",
        doc: "https://embedpress.com/docs/how-to-embed-tvcf-advertisements-in-wordpress/",
    },
    {
        img: `${image_path}/wizer.png`,
        name: "Wizer",
        doc: "https://embedpress.com/docs/how-to-embed-wizer/",
    },
    {
        img: `${image_path}/cloudup.png`,
        name: "Cloudup",
        doc: "https://embedpress.com/docs/embed-cloudup-videos-images-or-audios-wordpress/",
    },
    {
        img: `${image_path}/sudomemo.png`,
        name: "Sudomemo",
        doc: "https://embedpress.com/docs/how-to-embed-sudomemo/",
    },
    {
        img: `${image_path}/circuitlab.png`,
        name: "CircuitLab",
        doc: "https://embedpress.com/docs/embed-circuitlab-circuit-wordpress/",
    },
    {
        img: `${image_path}/edumedia.png`,
        name: "Edumedia Science Files",
        doc: "https://embedpress.com/docs/how-to-embed-edumedia-science-files-in-wordpress/",
    },
    {
        img: `${image_path}/ludus.png`,
        name: "Ludus",
        doc: "https://embedpress.com/docs/embed-ludus-in-wordpress/",
    },
    {
        img: `${image_path}/runkit.png`,
        name: "RunKit",
        doc: "https://embedpress.com/docs/embed-runkit-in-wordpress/",
    },
    {
        img: `${image_path}/clyp-audio.png`,
        name: "Clyp.it",
        doc: "https://embedpress.com/docs/embed-clypit-audio-wordpress/",
    },
    {
        img: `${image_path}/hippo-videos.png`,
        name: "Hippo Videos",
        doc: "",
    },
    {
        img: `${image_path}/roomshare.png`,
        name: "Roomshare Listings",
        doc: "https://embedpress.com/docs/embed-roomshare-listings-wordpress/",
    },
    {
        img: `${image_path}/didacte.png`,
        name: "Didacte Courses",
        doc: "https://embedpress.com/docs/how-to-embed-didacte-courses-in-wordpress/",
    },
    {
        img: `${image_path}/lumiere.png`,
        name: "Lumiere",
        doc: "https://embedpress.com/docs/how-to-embed-lumiere/",
    },
    {
        img: `${image_path}/huffduffer.png`,
        name: "Huffduffer",
        doc: "https://embedpress.com/docs/how-to-embed-huffduffer-podcasts-in-wordpress/",
    },
    {
        img: `${image_path}/onsizzle.png`,
        name: "OnSizzle Content",
        doc: "https://embedpress.com/docs/embed-onsizzle-content-in-wordpress/",
    },
    {
        img: `${image_path}/socialexplorer.png`,
        name: "Social Explorer Maps",
        doc: "https://embedpress.com/docs/how-to-embed-social-explorer-maps-in-wordpress/",
    },
    {
        img: `${image_path}/chartblocks.png`,
        name: "Chartblocks",
        doc: "https://embedpress.com/docs/embed-chartblocks-charts-wordpress/",
    },
    {
        img: `${image_path}/orbitvu.png`,
        name: "Orbitvu 360 Images",
        doc: "https://embedpress.com/docs/how-to-embed-orbitvu-360-images-in-wordpress/",
    },
    {
        img: `${image_path}/getshow.png`,
        name: "GetShow",
        doc: "https://embedpress.com/docs/how-to-embed-getshow-social-posts-in-wordpress/",
    },
    {
        img: `${image_path}/wave.png`,
        name: "Wave",
        doc: "https://embedpress.com/docs/how-to-embed-wave-videos-in-wordpress/",
    },
    {
        img: `${image_path}/shortnote.png`,
        name: "Shortnote",
        doc: "https://embedpress.com/docs/embed-shortnote-notes-wordpress/",
    },
    {
        img: `${image_path}/dotsub.png`,
        name: "Dotsub",
        doc: "https://embedpress.com/docs/embed-dotsub-videos-wordpress/",
    },
    {
        img: `${image_path}/chirbit-audio.png`,
        name: "Chirbit",
        doc: "https://embedpress.com/docs/embed-chirbit-audio-wordpress/",
    },
    {
        img: `${image_path}/songlink.png`,
        name: "Songlink Odesli Page",
        doc: "https://embedpress.com/docs/embed-songlink-odesli-page/",
    },
    {
        img: `${image_path}/nytimes.png`,
        name: "The New York Times",
        doc: "https://embedpress.com/docs/embed-the-new-york-times-news-in-wordpress/",
    },
    {
        img: `${image_path}/smashnotes.png`,
        name: "Smash Notes Podcasts",
        doc: "https://embedpress.com/docs/how-to-embed-smash-notes-podcasts-in-wordpress/",
    },
    {
        img: `${image_path}/commaful.png`,
        name: "Commaful",
        doc: "https://embedpress.com/docs/how-to-embed-commaful-in-wordpress/",
    },
    {
        img: `${image_path}/showtheway.png`,
        name: "ShowTheWay",
        doc: "https://embedpress.com/docs/how-to-embed-showtheway-maps-in-wordpress/",
    },
    {
        img: `${image_path}/blogcast.png`,
        name: "Blogcast",
        doc: "https://embedpress.com/docs/how-to-embed-blogcast-podcasts-in-wordpress/",
    },
    {
        img: `${image_path}/videopress.png`,
        name: "VideoPress",
        doc: "https://embedpress.com/docs/embed-videopress-videos-wordpress/",
    },
    {
        img: `${image_path}/kakaotv.png`,
        name: "KaKao TV",
        doc: "https://embedpress.com/docs/how-to-embed-kakao-tv-videos-in-wordpress/",
    },
    {
        img: `${image_path}/crowdsignal.png`,
        name: "Crowdsignal",
        doc: "https://embedpress.com/docs/how-to-embed-crowdsignal-surveys-in-wordpress/",
    },
    {
        img: `${image_path}/medienarchiv.png`,
        name: "Medienarchiv",
        doc: "https://embedpress.com/docs/how-to-embed-medienarchiv-of-zurich-university/",
    },
    {
        img: `${image_path}/zingsoft.png`,
        name: "ZingSoft Charts & Grids",
        doc: "https://embedpress.com/docs/how-to-embed-zingsoft-charts-grids-in-wordpress/",
    },
    {
        img: `${image_path}/ethfiddle.png`,
        name: "EthFiddle",
        doc: "https://embedpress.com/docs/how-to-embed-ethfiddle/",
    },
    {
        img: `${image_path}/namchey.png`,
        name: "Namchey",
        doc: "https://embedpress.com/docs/how-to-embed-namchey/",
    },
    {
        img: `${image_path}/polldaddy.png`,
        name: "Polldaddy",
        doc: "https://embedpress.com/docs/polldaddy-embed-wordpress/",
    },
    {
        img: `${image_path}/sway.png`,
        name: "Sway",
        doc: "https://embedpress.com/docs/how-to-embed-sway/",
    },
    {
        img: `${image_path}/voxsnap.png`,
        name: "VoxSnap",
        doc: "https://embedpress.com/docs/how-to-embed-voxsnap/",
    },
    {
        img: `${image_path}/overflow.png`,
        name: "Overflow",
        doc: "https://embedpress.com/docs/how-to-embed-overflow-in-wordpress-with-embedpress/",
    },
    {
        img: `${image_path}/sproutvideo.png`,
        name: "SproutVideo",
        doc: "https://embedpress.com/docs/how-to-embed-sproutvideo/",
    },
    {
        img: `${image_path}/songlink.png`,
        name: "SongLink",
        doc: "https://embedpress.com/docs/how-to-embed-sproutvideo/",
    },
    {
        img: `${image_path}/23hq.png`,
        name: "23hq Photos",
        doc: "https://embedpress.com/docs/embed-23hq-photos-wordpress/",
    },
    {
        img: `${image_path}/geograph-uk.png`,
        name: "Geograph UK",
        doc: "https://embedpress.com/docs/how-to-embed-geograph/",
    },
    {
        img: `${image_path}/issuu.png`,
        name: "ISSUU",
        doc: "https://embedpress.com/docs/embed-issuu-documents-wordpress/",
    },
    {
        img: `${image_path}/roosterteeth.png`,
        name: "Roosterteeth",
        doc: "https://embedpress.com/docs/embed-roosterteeth-videos-wordpress/",
    },
    {
        img: `${image_path}/dailymile.png`,
        name: "Daily Mile",
        doc: "https://embedpress.com/docs/embed-dailymile-activity-wordpress/",
    },
    {
        img: `${image_path}/sketchfab.png`,
        name: "Sketchfab",
        doc: "https://embedpress.com/docs/embed-sketchfab-drawings-wordpress/",
    },
    {
        img: `${image_path}/matterport.png`,
        name: "Matterport",
        doc: "https://embedpress.com/docs/how-to-embed-matterport-3d-scans/",
    },
    {
        img: `${image_path}/codepoint.png`,
        name: "Code point",
        doc: "https://embedpress.com/docs/how-to-embed-codepoints-codes-in-wordpress/",
    },
    {
        img: `${image_path}/mbm.png`,
        name: "MBM",
        doc: "https://embedpress.com/docs/how-to-embed-mbm-audio-in-wordpress/",
    },
    {
        img: `${image_path}/datawrapper.png`,
        name: "Datawrapper",
        doc: "https://embedpress.com/docs/how-to-embed-datawrapper-data-charts-in-wordpress/",
    },
    {
        img: `${image_path}/eyrie.png`,
        name: "Eyrie",
        doc: "https://embedpress.com/docs/how-to-embed-eyrie-photo-albums-in-wordpress/",
    },
    {
        img: `${image_path}/cambridge-map.png`,
        name: "Cambridge Map",
        doc: "https://embedpress.com/docs/how-to-embed-university-cambridge-map/",
    },
    {
        img: `${image_path}/mermaid.png`,
        name: "Mermaid",
        doc: "https://embedpress.com/docs/embed-mermaid-in-wordpress/",
    },
    {
        img: `${image_path}/polarishare.png`,
        name: "PolariShare",
        doc: "https://embedpress.com/docs/how-to-embed-polarishare-videos-in-wordpress/",
    }
];

test.describe("Sources Name , Icon, Docs Verify", () => {
    test("Dashboard Sources Tab", async ({ browser }) => {
        test.skip(process.env.CI, 'Skipping in CI environment');
        const context = await browser.newContext({ storageState: "playwright/.auth/user.json" });
        const page = await context.newPage();
        await page.goto("/wp-admin/admin.php?page=embedpress&page_type=sources");

        for (let i = 0; i < data.length; i++) {
            const item = page.locator("div.tab-content-section div.source-item").nth(i);
            await expect(item.locator("div.icon img")).toHaveAttribute("src", data[i].img);
            await expect(item.locator("span.source-name")).toContainText(data[i].name);
            await expect(item.locator("div.source-right a").last()).toHaveAttribute("href", data[i].doc);
        }

        await context.close();
    });
});