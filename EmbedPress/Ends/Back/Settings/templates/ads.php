<div class="embedpress_calendly_settings  background__white radius-25 p40">
    <h3 class="ads-settings-title"><?php esc_html_e("Ads Preview", "embedpress"); ?></h3>


    <div class="entry-content clear" ast-blocks-layout="true" itemprop="text">
        <div class="ad-preview-sectiion">
            <div class="video-ad-prewiew-options">
                <div class="ad__adjust__wrap " style="display: block;">

                    <div class="ad__adjust" >
                        <form class="ad__adjust__controller" id="ad-preview-1">
                            <div class="ad__adjust__controller__item">
                                <span class="controller__label">Upload Ad</span>
                                <div class="ad__adjust__controller__inputs ad-upload-options">
                                    <input type="button" id="uploadBtn" class="button" value="Upload" /><br/>
                                    <input type="hidden" id="fileInput" name="adFileUrl"/><br/>
                                    <p class="uploaded-file-url"></p>
                                    <div class="ad__upload__preview" id="yt_ad__upload__preview" style="display:none ">
                                        <div class="instant__preview">
                                            <a href="#" id="yt_preview__remove" class="preview__remove"><i class="ep-icon ep-cross"></i></a>
                                            <img class="instant__preview__img" id="yt_logo_preview" src="" alt="">
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="ad__adjust__controller__item">
                                <span class="controller__label">Ad Start After (Sec)</span>
                                <div class="ad__adjust__controller__inputs">
                                    <input type="range" max="100" data-default="10" value="10" class="opacity__range" name="adStart">
                                    <input readonly="" type="number" class="form__control range__value" data-default="10" value="10">
                                </div>
                            </div>

                            <div class="ad__adjust__controller__item">
                                <span class="controller__label">Skip Button</span>
                                <div class="ad__adjust__controller__inputs">
                                    <label class="input__switch switch__text ">
                                        <input type="checkbox" name="adSkipButton" data-default="no" data-value="no" value="yes" checked>
                                        <span></span>
                                       
                                    </label>
                                </div>
                            </div>

                            <div class="ad__adjust__controller__item">
                                <span class="controller__label">Skip Button After (Sec)</span>
                                <div class="ad__adjust__controller__inputs">
                                    <input type="range" max="100" data-default="5" value="5" class="x__range" name="adSkipButtonAfter">
                                    <input readonly="" type="number" class="form__control range__value" data-default="5" value="5">
                                </div>
                            </div>

                            <button type="submit" class="button preview-btn" onclick="playPreview('#ep-ad-preview-1', '1')"> Play Preview </button>
                        </form>

                    </div>
                </div>
            </div>
            <div class="embedpress-gutenberg-wrapper aligncenter   ep-content-protection-disabled inline" id="1c3da3de-7606-4e9f-9693-d4b570cd2ca3">
                <h2 class="wp-block-heading has-text-align-center"><mark style="background-color:rgba(0, 0, 0, 0)" class="has-inline-color has-ast-global-color-2-color">Video ad Preview</mark> in Video</h2>
                <div class="wp-block-embed__wrapper   ">
                    <div id="ep-gutenberg-content-ep-ad-preview-1" class="ep-gutenberg-content">
                        <div data-ad-id="ep-ad-preview-1" id="ep-ad-preview-1" data-ad-attrs="eyJjbGllbnRJZCI6IjFjM2RhM2RlLTc2MDYtNGU5Zi05NjkzLWQ0YjU3MGNkMmNhMyIsInVybCI6Imh0dHBzOlwvXC93d3cueW91dHViZS5jb21cL3dhdGNoP3Y9QU1VNjZuYkZuR2cmcHA9eWdVTWQzQmtaWFpsYkc5bGNHVnkiLCJlbWJlZEhUTUwiOiI8ZGl2IGNsYXNzPVwib3NlLXlvdXR1YmUgb3NlLXVpZC1jYzkyZjFiZGQwZDQ3ZWQyYTEyOWMzMjBjMTA4MmFkNSBvc2UtZW1iZWRwcmVzcy1yZXNwb25zaXZlXCIgc3R5bGU9XCJ3aWR0aDo2MDBweDsgaGVpZ2h0OjM0MHB4OyBtYXgtaGVpZ2h0OjM0MHB4OyBtYXgtd2lkdGg6MTAwJTsgZGlzcGxheTppbmxpbmUtYmxvY2s7XCI+PGlmcmFtZSBhbGxvd2Z1bGxzY3JlZW4gdGl0bGU9XCJIb3cgVG8gTWFrZSBBbnkgUGFnZSBMYXlvdXQgVXNpbmcgVGhlIFdvcmRQcmVzcyBCbG9jayBFZGl0b3I6IEd1dGVuYmVyZ1wiIHdpZHRoPVwiNjAwXCIgaGVpZ2h0PVwiMzQwXCIgc3JjPVwiaHR0cHM6XC9cL3d3dy55b3V0dWJlLmNvbVwvZW1iZWRcL0FNVTY2bmJGbkdnP2ZlYXR1cmU9b2VtYmVkJmNvbG9yPXJlZCZyZWw9MSZjb250cm9scz0yJnN0YXJ0PXRydWUmZW5kPXRydWUmZnM9MSZpdl9sb2FkX3BvbGljeT0xJmF1dG9wbGF5PTAmbW9kZXN0YnJhbmRpbmc9MCZjY19sb2FkX3BvbGljeT0wXCIgZnJhbWVib3JkZXI9XCIwXCIgYWxsb3c9XCJhY2NlbGVyb21ldGVyOyBlbmNyeXB0ZWQtbWVkaWE7YWNjZWxlcm9tZXRlcjthdXRvcGxheTtjbGlwYm9hcmQtd3JpdGU7Z3lyb3Njb3BlO3BpY3R1cmUtaW4tcGljdHVyZSBjbGlwYm9hcmQtd3JpdGU7IGVuY3J5cHRlZC1tZWRpYTsgZ3lyb3Njb3BlOyBwaWN0dXJlLWluLXBpY3R1cmU7IHdlYi1zaGFyZVwiIGxvYWRpbmc9bGF6eT48XC9pZnJhbWU+PFwvZGl2PiIsImhlaWdodCI6IjM0MCIsImNvbnRlbnRQYXNzd29yZCI6IjEiLCJlZGl0aW5nVVJMIjpmYWxzZSwiaW50ZXJhY3RpdmUiOnRydWUsImxvZ29YIjoxMDAsImFkTWFuYWdlciI6dHJ1ZSwiYWRDb250ZW50Ijp7ImlkIjoxOTcsInRpdGxlIjoiNSBTdGFycyBFdmVyeXdoZXJlIiwiZmlsZW5hbWUiOiI1LVN0YXJzLUV2ZXJ5d2hlcmUubXA0IiwidXJsIjoiaHR0cDpcL1wvZW1iZWRwcmVzcy5sb2NhbFwvd3AtY29udGVudFwvdXBsb2Fkc1wvMjAyM1wvMTFcLzUtU3RhcnMtRXZlcnl3aGVyZS5tcDQiLCJsaW5rIjoiaHR0cDpcL1wvZW1iZWRwcmVzcy5sb2NhbFwvZW1iZWRwcmVzcy1hZHNcLzUtc3RhcnMtZXZlcnl3aGVyZVwvIiwiYWx0IjoiIiwiYXV0aG9yIjoiMSIsImRlc2NyaXB0aW9uIjoiIiwiY2FwdGlvbiI6IiIsIm5hbWUiOiI1LXN0YXJzLWV2ZXJ5d2hlcmUiLCJzdGF0dXMiOiJpbmhlcml0IiwidXBsb2FkZWRUbyI6MTA0LCJkYXRlIjoiMjAyMy0xMS0wMlQwOTo1NDozOS4wMDBaIiwibW9kaWZpZWQiOiIyMDIzLTExLTAyVDA5OjU0OjM5LjAwMFoiLCJtZW51T3JkZXIiOjAsIm1pbWUiOiJ2aWRlb1wvbXA0IiwidHlwZSI6InZpZGVvIiwic3VidHlwZSI6Im1wNCIsImljb24iOiJodHRwOlwvXC9lbWJlZHByZXNzLmxvY2FsXC93cC1pbmNsdWRlc1wvaW1hZ2VzXC9tZWRpYVwvdmlkZW8ucG5nIiwiZGF0ZUZvcm1hdHRlZCI6Ik5vdmVtYmVyIDIsIDIwMjMiLCJub25jZXMiOnsidXBkYXRlIjoiNGE4MDM3MGMzNyIsImRlbGV0ZSI6IjU5YzFjNzc3NDkiLCJlZGl0IjoiZTkxYmZmM2U0OCJ9LCJlZGl0TGluayI6Imh0dHA6XC9cL2VtYmVkcHJlc3MubG9jYWxcL3dwLWFkbWluXC9wb3N0LnBocD9wb3N0PTE5NyZhY3Rpb249ZWRpdCIsIm1ldGEiOnsiYXJ0aXN0IjpmYWxzZSwiYWxidW0iOmZhbHNlLCJiaXRyYXRlIjpmYWxzZSwiYml0cmF0ZV9tb2RlIjpmYWxzZX0sImF1dGhvck5hbWUiOiJhZG1pbiIsImF1dGhvckxpbmsiOiJodHRwOlwvXC9lbWJlZHByZXNzLmxvY2FsXC93cC1hZG1pblwvcHJvZmlsZS5waHAiLCJ1cGxvYWRlZFRvVGl0bGUiOiJFbWJlZFByZXNzIEFEcyIsInVwbG9hZGVkVG9MaW5rIjoiaHR0cDpcL1wvZW1iZWRwcmVzcy5sb2NhbFwvd3AtYWRtaW5cL3Bvc3QucGhwP3Bvc3Q9MTA0JmFjdGlvbj1lZGl0IiwiZmlsZXNpemVJbkJ5dGVzIjoyOTI1NjU2LCJmaWxlc2l6ZUh1bWFuUmVhZGFibGUiOiIzIE1CIiwiY29udGV4dCI6IiIsIndpZHRoIjoxMjgwLCJoZWlnaHQiOjcyMCwiZmlsZUxlbmd0aCI6IjE6MDMiLCJmaWxlTGVuZ3RoSHVtYW5SZWFkYWJsZSI6IjEgbWludXRlLCAzIHNlY29uZHMiLCJpbWFnZSI6eyJzcmMiOiJodHRwOlwvXC9lbWJlZHByZXNzLmxvY2FsXC93cC1pbmNsdWRlc1wvaW1hZ2VzXC9tZWRpYVwvdmlkZW8ucG5nIiwid2lkdGgiOjQ4LCJoZWlnaHQiOjY0fSwidGh1bWIiOnsic3JjIjoiaHR0cDpcL1wvZW1iZWRwcmVzcy5sb2NhbFwvd3AtaW5jbHVkZXNcL2ltYWdlc1wvbWVkaWFcL3ZpZGVvLnBuZyIsIndpZHRoIjo0OCwiaGVpZ2h0Ijo2NH0sImNvbXBhdCI6eyJpdGVtIjoiIiwibWV0YSI6IiJ9fSwiYWRGaWxlVXJsIjoiaHR0cDpcL1wvZW1iZWRwcmVzcy5sb2NhbFwvd3AtY29udGVudFwvdXBsb2Fkc1wvMjAyM1wvMTFcLzUtU3RhcnMtRXZlcnl3aGVyZS5tcDQiLCJhZFVybCI6Imh0dHBzOlwvXC93cGRldmVsb3Blci5jb21cLyIsIndpZHRoIjoiNjAwIiwibG9ja0NvbnRlbnQiOmZhbHNlLCJsb2NrSGVhZGluZyI6IkNvbnRlbnQgTG9ja2VkIiwibG9ja1N1YkhlYWRpbmciOiJDb250ZW50IGlzIGxvY2tlZCBhbmQgcmVxdWlyZXMgcGFzc3dvcmQgdG8gYWNjZXNzIGl0LiIsImxvY2tFcnJvck1lc3NhZ2UiOiJPb3BzLCB0aGF0IHdhc24ndCB0aGUgcmlnaHQgcGFzc3dvcmQuIFRyeSBhZ2Fpbi4iLCJwYXNzd29yZFBsYWNlaG9sZGVyIjoiUGFzc3dvcmQiLCJzdWJtaXRCdXR0b25UZXh0IjoiVW5sb2NrIiwic3VibWl0VW5sb2NraW5nVGV4dCI6IlVubG9ja2luZyIsImVuYWJsZUZvb3Rlck1lc3NhZ2UiOmZhbHNlLCJmb290ZXJNZXNzYWdlIjoiSW4gY2FzZSB5b3UgZG9uJ3QgaGF2ZSB0aGUgcGFzc3dvcmQsIGtpbmRseSByZWFjaCBvdXQgdG8gY29udGVudCBvd25lciBvciBhZG1pbmlzdHJhdG9yIHRvIHJlcXVlc3QgYWNjZXNzLiIsImNvbnRlbnRTaGFyZSI6ZmFsc2UsInNoYXJlUG9zaXRpb24iOiJyaWdodCIsImN1c3RvbVRpdGxlIjoiIiwiY3VzdG9tRGVzY3JpcHRpb24iOiIiLCJjdXN0b21UaHVtYm5haWwiOiIiLCJ2aWRlb3NpemUiOiJmaXhlZCIsImxvYWRtb3JlIjpmYWxzZSwiYXV0b3BsYXkiOmZhbHNlLCJjbG9zZWRjYXB0aW9ucyI6dHJ1ZSwicmVsYXRlZHZpZGVvcyI6dHJ1ZSwiZnVsbHNjcmVlbiI6dHJ1ZSwiY3VzdG9tUGxheWVyIjpmYWxzZSwicG9zdGVyVGh1bWJuYWlsIjoiIiwicGxheWVyUHJlc2V0IjoiIiwicGxheWVyQ29sb3IiOiIjMmUyZTk5IiwicGxheWVyUGlwIjpmYWxzZSwicGxheWVyUmVzdGFydCI6dHJ1ZSwicGxheWVyUmV3aW5kIjp0cnVlLCJwbGF5ZXJGYXN0Rm9yd2FyZCI6dHJ1ZSwicGxheWVyVG9vbHRpcCI6dHJ1ZSwicGxheWVySGlkZUNvbnRyb2xzIjp0cnVlLCJwbGF5ZXJEb3dubG9hZCI6dHJ1ZSwid2F1dG9wbGF5Ijp0cnVlLCJjYXB0aW9ucyI6dHJ1ZSwicGxheWJ1dHRvbiI6dHJ1ZSwic21hbGxwbGF5YnV0dG9uIjp0cnVlLCJwbGF5YmFyIjp0cnVlLCJyZXN1bWFibGUiOnRydWUsIndpc3RpYWZvY3VzIjp0cnVlLCJ2b2x1bWVjb250cm9sIjp0cnVlLCJ2b2x1bWUiOjEwMCwicmV3aW5kIjpmYWxzZSwid2Z1bGxzY3JlZW4iOnRydWUsInZhdXRvcGxheSI6ZmFsc2UsInZ0aXRsZSI6dHJ1ZSwidmF1dGhvciI6dHJ1ZSwidmF2YXRhciI6dHJ1ZSwidmxvb3AiOmZhbHNlLCJ2YXV0b3BhdXNlIjpmYWxzZSwidmRudCI6ZmFsc2UsImNFbWJlZFR5cGUiOiJpbmxpbmUiLCJjYWxlbmRseURhdGEiOmZhbHNlLCJoaWRlQ29va2llQmFubmVyIjpmYWxzZSwiaGlkZUV2ZW50VHlwZURldGFpbHMiOmZhbHNlLCJjQmFja2dyb3VuZENvbG9yIjoiZmZmZmZmIiwiY1RleHRDb2xvciI6IjFBMUExQSIsImNCdXR0b25MaW5rQ29sb3IiOiIwMDAwRkYiLCJjUG9wdXBCdXR0b25UZXh0IjoiU2NoZWR1bGUgdGltZSB3aXRoIG1lIiwiY1BvcHVwQnV0dG9uQkdDb2xvciI6IiMwMDAwRkYiLCJjUG9wdXBCdXR0b25UZXh0Q29sb3IiOiIjRkZGRkZGIiwiY1BvcHVwTGlua1RleHQiOiJTY2hlZHVsZSB0aW1lIHdpdGggbWUiLCJhZFNvdXJjZSI6InZpZGVvIiwiYWRXaWR0aCI6IjMwMCIsImFkSGVpZ2h0IjoiMjAwIiwiYWRYUG9zaXRpb24iOjI1LCJhZFlQb3NpdGlvbiI6MTAsImFkU3RhcnQiOiIxMCIsImFkU2tpcEJ1dHRvbiI6dHJ1ZSwiYWRTa2lwQnV0dG9uQWZ0ZXIiOiI1In0=" class="ad-mask" data-ad-index="0">
                            <div class="ep-embed-content-wraper ">
                                <iframe class="ose-youtube ose-uid-cc92f1bdd0d47ed2a129c320c1082ad5 ose-embedpress-responsive" style="width: 600px; height: 550px; max-height: 338px; max-width: 100%; display: inline-block;" frameborder="0" allowfullscreen="1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" title="How To Make Any Page Layout Using The WordPress Block Editor: Gutenberg" width="640" height="360" src="https://www.youtube.com/embed/AMU66nbFnGg?enablejsapi=1&amp;origin=http%3A%2F%2Fembedpress.local&amp;widgetid=1" id="widget2"></iframe> </div>
                            <div class="main-ad-template video" id="ad-ep-ad-preview-1" style="display:none">
                                <div class="ep-ad-container">
                                    <div class="ep-ad-content" style="position: relative;">
                                        <a target="_blank" href="https://wpdeveloper.com/"> <video class="ep-ad" muted="">
                                                <source src="http://embedpress.local/wp-content/uploads/2023/11/5-Stars-Everywhere.mp4">
                                            </video>

                                            <div class="ad-timer">
                                                <span class="ad-running-time"></span>
                                                <span class="ad-duration">&nbsp;• Ad</span>
                                            </div>
                                            <div class="progress-bar-container">
                                                <div class="progress-bar"></div>
                                            </div>


                                        </a>


                                        <button title="Skip Ad" class="skip-ad-button" style="display: none;">
                                            Skip Ad </button>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>
                .ose-uid-cc92f1bdd0d47ed2a129c320c1082ad5 {
                    width: 600px !important;
                    height: 340px !important;
                    max-width: 100%;
                }

                .ose-uid-cc92f1bdd0d47ed2a129c320c1082ad5>iframe {
                    height: 340px !important;
                    max-height: 340px !important;
                    width: 100%;
                }

                .ose-uid-cc92f1bdd0d47ed2a129c320c1082ad5 .wistia_embed {
                    max-width: 100%;
                }

                .alignright .ose-wistia.ose-uid-cc92f1bdd0d47ed2a129c320c1082ad5 {
                    margin-left: auto;
                }

                .alignleft .ose-wistia.ose-uid-cc92f1bdd0d47ed2a129c320c1082ad5 {
                    margin-right: auto;
                }

                .aligncenter .ose-wistia.ose-uid-cc92f1bdd0d47ed2a129c320c1082ad5 {
                    margin: auto;
                }

                .ose-uid-cc92f1bdd0d47ed2a129c320c1082ad5 img.watermark {
                    display: none;
                }
            </style>
        </div>

        <h2 class="wp-block-heading has-text-align-center"><mark style="background-color:rgba(0, 0, 0, 0)" class="has-inline-color has-ast-global-color-2-color">Image ad Preview</mark> in Video</h2>


        <div class="embedpress-gutenberg-wrapper aligncenter   ep-content-protection-disabled inline" id="0a6178a7-c433-4cd3-a761-edb000bbf2fa">
            <div class="wp-block-embed__wrapper   ">
                <div id="ep-gutenberg-content-291c61c171ca2add49648c86f82a230f" class="ep-gutenberg-content">
                    <div data-ad-id="291c61c171ca2add49648c86f82a230f" data-ad-attrs="eyJjbGllbnRJZCI6IjBhNjE3OGE3LWM0MzMtNGNkMy1hNzYxLWVkYjAwMGJiZjJmYSIsInVybCI6Imh0dHBzOlwvXC93d3cueW91dHViZS5jb21cL3dhdGNoP3Y9Q0VVcWdPUzRDTjAmcHA9eWdVTWQzQmtaWFpsYkc5bGNHVnkiLCJlbWJlZEhUTUwiOiI8ZGl2IGNsYXNzPVwib3NlLXlvdXR1YmUgb3NlLXVpZC1hNzE1N2U4NzRlYTQ1OGUyYWFhNWI1ZGQxOGFmOTcxMSBvc2UtZW1iZWRwcmVzcy1yZXNwb25zaXZlXCIgc3R5bGU9XCJ3aWR0aDo2MDBweDsgaGVpZ2h0OjM0MHB4OyBtYXgtaGVpZ2h0OjM0MHB4OyBtYXgtd2lkdGg6MTAwJTsgZGlzcGxheTppbmxpbmUtYmxvY2s7XCI+PGlmcmFtZSBhbGxvd2Z1bGxzY3JlZW4gdGl0bGU9XCJDb25maWd1cmUgVGhlIFdvb0NvbW1lcmNlIE15IEFjY291bnQgV2l0aCBFQSBXb28gQWNjb3VudCBEYXNoYm9hcmQgV2lkZ2V0XCIgd2lkdGg9XCI2MDBcIiBoZWlnaHQ9XCIzNDBcIiBzcmM9XCJodHRwczpcL1wvd3d3LnlvdXR1YmUuY29tXC9lbWJlZFwvQ0VVcWdPUzRDTjA/ZmVhdHVyZT1vZW1iZWQmY29sb3I9cmVkJnJlbD0xJmNvbnRyb2xzPTImc3RhcnQ9dHJ1ZSZlbmQ9dHJ1ZSZmcz0xJml2X2xvYWRfcG9saWN5PTEmYXV0b3BsYXk9MCZtb2Rlc3RicmFuZGluZz0wJmNjX2xvYWRfcG9saWN5PTBcIiBmcmFtZWJvcmRlcj1cIjBcIiBhbGxvdz1cImFjY2VsZXJvbWV0ZXI7IGVuY3J5cHRlZC1tZWRpYTthY2NlbGVyb21ldGVyO2F1dG9wbGF5O2NsaXBib2FyZC13cml0ZTtneXJvc2NvcGU7cGljdHVyZS1pbi1waWN0dXJlIGNsaXBib2FyZC13cml0ZTsgZW5jcnlwdGVkLW1lZGlhOyBneXJvc2NvcGU7IHBpY3R1cmUtaW4tcGljdHVyZTsgd2ViLXNoYXJlXCIgbG9hZGluZz1sYXp5PjxcL2lmcmFtZT48XC9kaXY+IiwiaGVpZ2h0IjoiMzQwIiwiZWRpdGluZ1VSTCI6ZmFsc2UsImludGVyYWN0aXZlIjp0cnVlLCJhZE1hbmFnZXIiOnRydWUsImFkU291cmNlIjoiaW1hZ2UiLCJhZENvbnRlbnQiOnsiaWQiOjIzMSwidGl0bGUiOiIyNzk0NmE5OTY1N2NkZGYwY2JkZTc5YTdlNGU2ZjUxZiIsImZpbGVuYW1lIjoiMjc5NDZhOTk2NTdjZGRmMGNiZGU3OWE3ZTRlNmY1MWYuZ2lmIiwidXJsIjoiaHR0cDpcL1wvZW1iZWRwcmVzcy5sb2NhbFwvd3AtY29udGVudFwvdXBsb2Fkc1wvMjAyM1wvMTFcLzI3OTQ2YTk5NjU3Y2RkZjBjYmRlNzlhN2U0ZTZmNTFmLmdpZiIsImxpbmsiOiJodHRwOlwvXC9lbWJlZHByZXNzLmxvY2FsXC9lbWJlZHByZXNzLWFkc1wvMjc5NDZhOTk2NTdjZGRmMGNiZGU3OWE3ZTRlNmY1MWZcLyIsImFsdCI6IiIsImF1dGhvciI6IjEiLCJkZXNjcmlwdGlvbiI6IiIsImNhcHRpb24iOiIiLCJuYW1lIjoiMjc5NDZhOTk2NTdjZGRmMGNiZGU3OWE3ZTRlNmY1MWYiLCJzdGF0dXMiOiJpbmhlcml0IiwidXBsb2FkZWRUbyI6MTA0LCJkYXRlIjoiMjAyMy0xMS0wNVQxMToyMjozOS4wMDBaIiwibW9kaWZpZWQiOiIyMDIzLTExLTA1VDExOjIyOjM5LjAwMFoiLCJtZW51T3JkZXIiOjAsIm1pbWUiOiJpbWFnZVwvZ2lmIiwidHlwZSI6ImltYWdlIiwic3VidHlwZSI6ImdpZiIsImljb24iOiJodHRwOlwvXC9lbWJlZHByZXNzLmxvY2FsXC93cC1pbmNsdWRlc1wvaW1hZ2VzXC9tZWRpYVwvZGVmYXVsdC5wbmciLCJkYXRlRm9ybWF0dGVkIjoiTm92ZW1iZXIgNSwgMjAyMyIsIm5vbmNlcyI6eyJ1cGRhdGUiOiJiMTIwZWNiYmZmIiwiZGVsZXRlIjoiMDM5OTNkMTkzOSIsImVkaXQiOiJlNjdiNDY5MTJjIn0sImVkaXRMaW5rIjoiaHR0cDpcL1wvZW1iZWRwcmVzcy5sb2NhbFwvd3AtYWRtaW5cL3Bvc3QucGhwP3Bvc3Q9MjMxJmFjdGlvbj1lZGl0IiwibWV0YSI6ZmFsc2UsImF1dGhvck5hbWUiOiJhZG1pbiIsImF1dGhvckxpbmsiOiJodHRwOlwvXC9lbWJlZHByZXNzLmxvY2FsXC93cC1hZG1pblwvcHJvZmlsZS5waHAiLCJ1cGxvYWRlZFRvVGl0bGUiOiJFbWJlZFByZXNzIEFEcyIsInVwbG9hZGVkVG9MaW5rIjoiaHR0cDpcL1wvZW1iZWRwcmVzcy5sb2NhbFwvd3AtYWRtaW5cL3Bvc3QucGhwP3Bvc3Q9MTA0JmFjdGlvbj1lZGl0IiwiZmlsZXNpemVJbkJ5dGVzIjoxODUzODksImZpbGVzaXplSHVtYW5SZWFkYWJsZSI6IjE4MSBLQiIsImNvbnRleHQiOiIiLCJoZWlnaHQiOjg3MSwid2lkdGgiOjcwMCwib3JpZW50YXRpb24iOiJwb3J0cmFpdCIsInNpemVzIjp7InRodW1ibmFpbCI6eyJoZWlnaHQiOjE1MCwid2lkdGgiOjE1MCwidXJsIjoiaHR0cDpcL1wvZW1iZWRwcmVzcy5sb2NhbFwvd3AtY29udGVudFwvdXBsb2Fkc1wvMjAyM1wvMTFcLzI3OTQ2YTk5NjU3Y2RkZjBjYmRlNzlhN2U0ZTZmNTFmLTE1MHgxNTAuZ2lmIiwib3JpZW50YXRpb24iOiJsYW5kc2NhcGUifSwibWVkaXVtIjp7ImhlaWdodCI6MzAwLCJ3aWR0aCI6MjQxLCJ1cmwiOiJodHRwOlwvXC9lbWJlZHByZXNzLmxvY2FsXC93cC1jb250ZW50XC91cGxvYWRzXC8yMDIzXC8xMVwvMjc5NDZhOTk2NTdjZGRmMGNiZGU3OWE3ZTRlNmY1MWYtMjQxeDMwMC5naWYiLCJvcmllbnRhdGlvbiI6InBvcnRyYWl0In0sImZ1bGwiOnsidXJsIjoiaHR0cDpcL1wvZW1iZWRwcmVzcy5sb2NhbFwvd3AtY29udGVudFwvdXBsb2Fkc1wvMjAyM1wvMTFcLzI3OTQ2YTk5NjU3Y2RkZjBjYmRlNzlhN2U0ZTZmNTFmLmdpZiIsImhlaWdodCI6ODcxLCJ3aWR0aCI6NzAwLCJvcmllbnRhdGlvbiI6InBvcnRyYWl0In19LCJjb21wYXQiOnsiaXRlbSI6IiIsIm1ldGEiOiIifX0sImFkRmlsZVVybCI6Imh0dHA6XC9cL2VtYmVkcHJlc3MubG9jYWxcL3dwLWNvbnRlbnRcL3VwbG9hZHNcLzIwMjNcLzExXC8yNzk0NmE5OTY1N2NkZGYwY2JkZTc5YTdlNGU2ZjUxZi5naWYiLCJ3aWR0aCI6IjYwMCIsImxvY2tDb250ZW50IjpmYWxzZSwibG9ja0hlYWRpbmciOiJDb250ZW50IExvY2tlZCIsImxvY2tTdWJIZWFkaW5nIjoiQ29udGVudCBpcyBsb2NrZWQgYW5kIHJlcXVpcmVzIHBhc3N3b3JkIHRvIGFjY2VzcyBpdC4iLCJsb2NrRXJyb3JNZXNzYWdlIjoiT29wcywgdGhhdCB3YXNuJ3QgdGhlIHJpZ2h0IHBhc3N3b3JkLiBUcnkgYWdhaW4uIiwicGFzc3dvcmRQbGFjZWhvbGRlciI6IlBhc3N3b3JkIiwic3VibWl0QnV0dG9uVGV4dCI6IlVubG9jayIsInN1Ym1pdFVubG9ja2luZ1RleHQiOiJVbmxvY2tpbmciLCJlbmFibGVGb290ZXJNZXNzYWdlIjpmYWxzZSwiZm9vdGVyTWVzc2FnZSI6IkluIGNhc2UgeW91IGRvbid0IGhhdmUgdGhlIHBhc3N3b3JkLCBraW5kbHkgcmVhY2ggb3V0IHRvIGNvbnRlbnQgb3duZXIgb3IgYWRtaW5pc3RyYXRvciB0byByZXF1ZXN0IGFjY2Vzcy4iLCJjb250ZW50UGFzc3dvcmQiOiIiLCJjb250ZW50U2hhcmUiOmZhbHNlLCJzaGFyZVBvc2l0aW9uIjoicmlnaHQiLCJjdXN0b21UaXRsZSI6IiIsImN1c3RvbURlc2NyaXB0aW9uIjoiIiwiY3VzdG9tVGh1bWJuYWlsIjoiIiwidmlkZW9zaXplIjoiZml4ZWQiLCJsb2FkbW9yZSI6ZmFsc2UsImF1dG9wbGF5IjpmYWxzZSwiY2xvc2VkY2FwdGlvbnMiOnRydWUsInJlbGF0ZWR2aWRlb3MiOnRydWUsImZ1bGxzY3JlZW4iOnRydWUsImN1c3RvbVBsYXllciI6ZmFsc2UsInBvc3RlclRodW1ibmFpbCI6IiIsInBsYXllclByZXNldCI6IiIsInBsYXllckNvbG9yIjoiIzJlMmU5OSIsInBsYXllclBpcCI6ZmFsc2UsInBsYXllclJlc3RhcnQiOnRydWUsInBsYXllclJld2luZCI6dHJ1ZSwicGxheWVyRmFzdEZvcndhcmQiOnRydWUsInBsYXllclRvb2x0aXAiOnRydWUsInBsYXllckhpZGVDb250cm9scyI6dHJ1ZSwicGxheWVyRG93bmxvYWQiOnRydWUsIndhdXRvcGxheSI6dHJ1ZSwiY2FwdGlvbnMiOnRydWUsInBsYXlidXR0b24iOnRydWUsInNtYWxscGxheWJ1dHRvbiI6dHJ1ZSwicGxheWJhciI6dHJ1ZSwicmVzdW1hYmxlIjp0cnVlLCJ3aXN0aWFmb2N1cyI6dHJ1ZSwidm9sdW1lY29udHJvbCI6dHJ1ZSwidm9sdW1lIjoxMDAsInJld2luZCI6ZmFsc2UsIndmdWxsc2NyZWVuIjp0cnVlLCJ2YXV0b3BsYXkiOmZhbHNlLCJ2dGl0bGUiOnRydWUsInZhdXRob3IiOnRydWUsInZhdmF0YXIiOnRydWUsInZsb29wIjpmYWxzZSwidmF1dG9wYXVzZSI6ZmFsc2UsInZkbnQiOmZhbHNlLCJjRW1iZWRUeXBlIjoiaW5saW5lIiwiY2FsZW5kbHlEYXRhIjpmYWxzZSwiaGlkZUNvb2tpZUJhbm5lciI6ZmFsc2UsImhpZGVFdmVudFR5cGVEZXRhaWxzIjpmYWxzZSwiY0JhY2tncm91bmRDb2xvciI6ImZmZmZmZiIsImNUZXh0Q29sb3IiOiIxQTFBMUEiLCJjQnV0dG9uTGlua0NvbG9yIjoiMDAwMEZGIiwiY1BvcHVwQnV0dG9uVGV4dCI6IlNjaGVkdWxlIHRpbWUgd2l0aCBtZSIsImNQb3B1cEJ1dHRvbkJHQ29sb3IiOiIjMDAwMEZGIiwiY1BvcHVwQnV0dG9uVGV4dENvbG9yIjoiI0ZGRkZGRiIsImNQb3B1cExpbmtUZXh0IjoiU2NoZWR1bGUgdGltZSB3aXRoIG1lIiwiYWRXaWR0aCI6IjMwMCIsImFkSGVpZ2h0IjoiMjAwIiwiYWRYUG9zaXRpb24iOjI1LCJhZFlQb3NpdGlvbiI6MTAsImFkVXJsIjoiIiwiYWRTdGFydCI6IjEwIiwiYWRTa2lwQnV0dG9uIjp0cnVlLCJhZFNraXBCdXR0b25BZnRlciI6IjUifQ==" class="ad-mask" data-ad-index="1">
                        <div class="ep-embed-content-wraper ">
                            <iframe class="ose-youtube ose-uid-a7157e874ea458e2aaa5b5dd18af9711 ose-embedpress-responsive" style="width: 600px; height: 550px; max-height: 338px; max-width: 100%; display: inline-block;" frameborder="0" allowfullscreen="1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" title="Configure The WooCommerce My Account With EA Woo Account Dashboard Widget" width="640" height="360" src="https://www.youtube.com/embed/CEUqgOS4CN0?enablejsapi=1&amp;origin=http%3A%2F%2Fembedpress.local&amp;widgetid=3" id="widget4"></iframe> </div>
                        <div class="main-ad-template image" id="ad-291c61c171ca2add49648c86f82a230f" style="display:none">
                            <div class="ep-ad-container">
                                <div class="ep-ad-content" style="position: relative;">
                                    <img decoding="async" class="ep-ad" src="http://embedpress.local/wp-content/uploads/2023/11/27946a99657cddf0cbde79a7e4e6f51f.gif">



                                    <button title="Skip Ad" class="skip-ad-button" style="display: inline-block;">
                                        Skip Ad </button>

                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
        <style>
            .ose-uid-a7157e874ea458e2aaa5b5dd18af9711 {
                width: 600px !important;
                height: 340px !important;
                max-width: 100%;
            }

            .ose-uid-a7157e874ea458e2aaa5b5dd18af9711>iframe {
                height: 340px !important;
                max-height: 340px !important;
                width: 100%;
            }

            .ose-uid-a7157e874ea458e2aaa5b5dd18af9711 .wistia_embed {
                max-width: 100%;
            }

            .alignright .ose-wistia.ose-uid-a7157e874ea458e2aaa5b5dd18af9711 {
                margin-left: auto;
            }

            .alignleft .ose-wistia.ose-uid-a7157e874ea458e2aaa5b5dd18af9711 {
                margin-right: auto;
            }

            .aligncenter .ose-wistia.ose-uid-a7157e874ea458e2aaa5b5dd18af9711 {
                margin: auto;
            }

            .ose-uid-a7157e874ea458e2aaa5b5dd18af9711 img.watermark {
                display: none;
            }
        </style>


        <h2 class="wp-block-heading has-text-align-center"><mark style="background-color:rgba(0, 0, 0, 0)" class="has-inline-color has-ast-global-color-2-color">Video ad Preview</mark> in PDF documents</h2>

        <div id="ep-gutenberg-content-fc2d9f8fc6a2e87c25ecb6bdb7561542" class="ep-gutenberg-content ep-aligncenter ep-fixed-width   ep-content-protection-disabled ">
            <div class="embedpress-inner-iframe  ep-doc-fc2d9f8fc6a2e87c25ecb6bdb7561542" style="max-width:100%" id="embedpress-pdf-1702801774415">
                <div data-ad-id="fc2d9f8fc6a2e87c25ecb6bdb7561542" data-ad-attrs="eyJpZCI6ImVtYmVkcHJlc3MtcGRmLTE3MDI4MDE3NzQ0MTUiLCJjbGllbnRJZCI6Ijk5YjQyYWYzLTc4NWUtNDUwMC1iNWQzLTJhYzI4NTdiNWJjNSIsImhyZWYiOiJodHRwOlwvXC9lbWJlZHByZXNzLmxvY2FsXC93cC1jb250ZW50XC91cGxvYWRzXC8yMDIzXC8xMFwvc2FtcGxlLnBkZiIsImZpbGVOYW1lIjoic2FtcGxlIiwibWltZSI6ImFwcGxpY2F0aW9uXC9wZGYiLCJhZE1hbmFnZXIiOnRydWUsImFkQ29udGVudCI6eyJpZCI6MTk3LCJ0aXRsZSI6IjUgU3RhcnMgRXZlcnl3aGVyZSIsImZpbGVuYW1lIjoiNS1TdGFycy1FdmVyeXdoZXJlLm1wNCIsInVybCI6Imh0dHA6XC9cL2VtYmVkcHJlc3MubG9jYWxcL3dwLWNvbnRlbnRcL3VwbG9hZHNcLzIwMjNcLzExXC81LVN0YXJzLUV2ZXJ5d2hlcmUubXA0IiwibGluayI6Imh0dHA6XC9cL2VtYmVkcHJlc3MubG9jYWxcL2VtYmVkcHJlc3MtYWRzXC81LXN0YXJzLWV2ZXJ5d2hlcmVcLyIsImFsdCI6IiIsImF1dGhvciI6IjEiLCJkZXNjcmlwdGlvbiI6IiIsImNhcHRpb24iOiIiLCJuYW1lIjoiNS1zdGFycy1ldmVyeXdoZXJlIiwic3RhdHVzIjoiaW5oZXJpdCIsInVwbG9hZGVkVG8iOjEwNCwiZGF0ZSI6IjIwMjMtMTEtMDJUMDk6NTQ6MzkuMDAwWiIsIm1vZGlmaWVkIjoiMjAyMy0xMS0wMlQwOTo1NDozOS4wMDBaIiwibWVudU9yZGVyIjowLCJtaW1lIjoidmlkZW9cL21wNCIsInR5cGUiOiJ2aWRlbyIsInN1YnR5cGUiOiJtcDQiLCJpY29uIjoiaHR0cDpcL1wvZW1iZWRwcmVzcy5sb2NhbFwvd3AtaW5jbHVkZXNcL2ltYWdlc1wvbWVkaWFcL3ZpZGVvLnBuZyIsImRhdGVGb3JtYXR0ZWQiOiJOb3ZlbWJlciAyLCAyMDIzIiwibm9uY2VzIjp7InVwZGF0ZSI6IjRhODAzNzBjMzciLCJkZWxldGUiOiI1OWMxYzc3NzQ5IiwiZWRpdCI6ImU5MWJmZjNlNDgifSwiZWRpdExpbmsiOiJodHRwOlwvXC9lbWJlZHByZXNzLmxvY2FsXC93cC1hZG1pblwvcG9zdC5waHA/cG9zdD0xOTcmYWN0aW9uPWVkaXQiLCJtZXRhIjp7ImFydGlzdCI6ZmFsc2UsImFsYnVtIjpmYWxzZSwiYml0cmF0ZSI6ZmFsc2UsImJpdHJhdGVfbW9kZSI6ZmFsc2V9LCJhdXRob3JOYW1lIjoiYWRtaW4iLCJhdXRob3JMaW5rIjoiaHR0cDpcL1wvZW1iZWRwcmVzcy5sb2NhbFwvd3AtYWRtaW5cL3Byb2ZpbGUucGhwIiwidXBsb2FkZWRUb1RpdGxlIjoiRW1iZWRQcmVzcyBBRHMiLCJ1cGxvYWRlZFRvTGluayI6Imh0dHA6XC9cL2VtYmVkcHJlc3MubG9jYWxcL3dwLWFkbWluXC9wb3N0LnBocD9wb3N0PTEwNCZhY3Rpb249ZWRpdCIsImZpbGVzaXplSW5CeXRlcyI6MjkyNTY1NiwiZmlsZXNpemVIdW1hblJlYWRhYmxlIjoiMyBNQiIsImNvbnRleHQiOiIiLCJ3aWR0aCI6MTI4MCwiaGVpZ2h0Ijo3MjAsImZpbGVMZW5ndGgiOiIxOjAzIiwiZmlsZUxlbmd0aEh1bWFuUmVhZGFibGUiOiIxIG1pbnV0ZSwgMyBzZWNvbmRzIiwiaW1hZ2UiOnsic3JjIjoiaHR0cDpcL1wvZW1iZWRwcmVzcy5sb2NhbFwvd3AtaW5jbHVkZXNcL2ltYWdlc1wvbWVkaWFcL3ZpZGVvLnBuZyIsIndpZHRoIjo0OCwiaGVpZ2h0Ijo2NH0sInRodW1iIjp7InNyYyI6Imh0dHA6XC9cL2VtYmVkcHJlc3MubG9jYWxcL3dwLWluY2x1ZGVzXC9pbWFnZXNcL21lZGlhXC92aWRlby5wbmciLCJ3aWR0aCI6NDgsImhlaWdodCI6NjR9LCJjb21wYXQiOnsiaXRlbSI6IiIsIm1ldGEiOiIifX0sImFkRmlsZVVybCI6Imh0dHA6XC9cL2VtYmVkcHJlc3MubG9jYWxcL3dwLWNvbnRlbnRcL3VwbG9hZHNcLzIwMjNcLzExXC81LVN0YXJzLUV2ZXJ5d2hlcmUubXA0IiwiYWxpZ24iOiJjZW50ZXIiLCJwb3dlcmVkX2J5Ijp0cnVlLCJsb2NrQ29udGVudCI6ZmFsc2UsImxvY2tIZWFkaW5nIjoiQ29udGVudCBMb2NrZWQiLCJsb2NrU3ViSGVhZGluZyI6IkNvbnRlbnQgaXMgbG9ja2VkIGFuZCByZXF1aXJlcyBwYXNzd29yZCB0byBhY2Nlc3MgaXQuIiwicGFzc3dvcmRQbGFjZWhvbGRlciI6IlBhc3N3b3JkIiwic3VibWl0QnV0dG9uVGV4dCI6IlVubG9jayIsInN1Ym1pdFVubG9ja2luZ1RleHQiOiJVbmxvY2tpbmciLCJsb2NrRXJyb3JNZXNzYWdlIjoiT29wcywgdGhhdCB3YXNuJ3QgdGhlIHJpZ2h0IHBhc3N3b3JkLiBUcnkgYWdhaW4uIiwiZW5hYmxlRm9vdGVyTWVzc2FnZSI6ZmFsc2UsImZvb3Rlck1lc3NhZ2UiOiJJbiBjYXNlIHlvdSBkb24ndCBoYXZlIHRoZSBwYXNzd29yZCwga2luZGx5IHJlYWNoIG91dCB0byBjb250ZW50IG93bmVyIG9yIGFkbWluaXN0cmF0b3IgdG8gcmVxdWVzdCBhY2Nlc3MuIiwiY29udGVudFBhc3N3b3JkIjoiIiwiY29udGVudFNoYXJlIjpmYWxzZSwic2hhcmVQb3NpdGlvbiI6InJpZ2h0IiwicHJlc2VudGF0aW9uIjp0cnVlLCJwb3NpdGlvbiI6InRvcCIsInByaW50Ijp0cnVlLCJkb3dubG9hZCI6dHJ1ZSwib3BlbiI6dHJ1ZSwiY29weV90ZXh0Ijp0cnVlLCJhZGRfdGV4dCI6dHJ1ZSwiZHJhdyI6dHJ1ZSwidG9vbGJhciI6dHJ1ZSwiZG9jX2RldGFpbHMiOnRydWUsImRvY19yb3RhdGlvbiI6dHJ1ZSwidW5pdG9wdGlvbiI6InB4IiwiYWRTb3VyY2UiOiJ2aWRlbyIsImFkV2lkdGgiOiIzMDAiLCJhZEhlaWdodCI6IjIwMCIsImFkWFBvc2l0aW9uIjoyNSwiYWRZUG9zaXRpb24iOjIwLCJhZFVybCI6IiIsImFkU3RhcnQiOiIxMCIsImFkU2tpcEJ1dHRvbiI6dHJ1ZSwiYWRTa2lwQnV0dG9uQWZ0ZXIiOiI1In0=" class="ad-mask" data-ad-index="2">
                    <div class="ep-embed-content-wraper">
                        <div class="position-right-wraper gutenberg-pdf-wraper"><iframe title="sample" class="embedpress-embed-document-pdf embedpress-pdf-1702801774415" style="width:600px;height:600px; max-width:100%; display: inline-block" src="http://embedpress.local/wp-admin/admin-ajax.php?action=get_viewer&amp;file=http%3A%2F%2Fembedpress.local%2Fwp-content%2Fuploads%2F2023%2F10%2Fsample.pdf#key=dGhlbWVNb2RlPWRlZmF1bHQmdG9vbGJhcj10cnVlJnBvc2l0aW9uPXRvcCZwcmVzZW50YXRpb249dHJ1ZSZkb3dubG9hZD10cnVlJmNvcHlfdGV4dD10cnVlJmFkZF90ZXh0PXRydWUmZHJhdz10cnVlJmRvY19yb3RhdGlvbj10cnVlJmRvY19kZXRhaWxzPXRydWU=" frameborder="0" oncontextmenu="return false;"></iframe>
                            <p class="embedpress-el-powered">Powered By EmbedPress</p>
                        </div>
                    </div>
                    <div class="main-ad-template video" id="ad-fc2d9f8fc6a2e87c25ecb6bdb7561542" style="display:none">
                        <div class="ep-ad-container">
                            <div class="ep-ad-content" style="position: relative;">
                                <video class="ep-ad" muted="">
                                    <source src="http://embedpress.local/wp-content/uploads/2023/11/5-Stars-Everywhere.mp4">
                                </video>

                                <div class="ad-timer">
                                    <span class="ad-running-time"></span>
                                    <span class="ad-duration">&nbsp;• Ad</span>
                                </div>
                                <div class="progress-bar-container">
                                    <div class="progress-bar"></div>
                                </div>




                                <button title="Skip Ad" class="skip-ad-button" style="display: none;">
                                    Skip Ad </button>

                            </div>
                        </div>
                    </div>



                </div>
            </div>
        </div>



        <h2 class="wp-block-heading has-text-align-center"><mark style="background-color:rgba(0, 0, 0, 0)" class="has-inline-color has-ast-global-color-2-color">Image ad Preview</mark> in PDF documents</h2>

        <div id="ep-gutenberg-content-1081011a548224fec38c97e5471bd6c0" class="ep-gutenberg-content ep-aligncenter ep-fixed-width   ep-content-protection-disabled ">
            <div class="embedpress-inner-iframe  ep-doc-1081011a548224fec38c97e5471bd6c0" style="max-width:100%" id="embedpress-pdf-1701320841615">
                <div data-ad-id="1081011a548224fec38c97e5471bd6c0" data-ad-attrs="eyJpZCI6ImVtYmVkcHJlc3MtcGRmLTE3MDEzMjA4NDE2MTUiLCJjbGllbnRJZCI6IjM2NGRkNDY2LTk5ZDEtNDE3ZC05MTRlLTQyNjc1ZDhlNjljMiIsImhyZWYiOiJodHRwOlwvXC9lbWJlZHByZXNzLmxvY2FsXC93cC1jb250ZW50XC91cGxvYWRzXC8yMDIzXC8xMFwvc2FtcGxlLnBkZiIsIndpZHRoIjo2NjYsImZpbGVOYW1lIjoic2FtcGxlIiwibWltZSI6ImFwcGxpY2F0aW9uXC9wZGYiLCJhZE1hbmFnZXIiOnRydWUsImFkU291cmNlIjoiaW1hZ2UiLCJhZENvbnRlbnQiOnsiaWQiOjIzMSwidGl0bGUiOiIyNzk0NmE5OTY1N2NkZGYwY2JkZTc5YTdlNGU2ZjUxZiIsImZpbGVuYW1lIjoiMjc5NDZhOTk2NTdjZGRmMGNiZGU3OWE3ZTRlNmY1MWYuZ2lmIiwidXJsIjoiaHR0cDpcL1wvZW1iZWRwcmVzcy5sb2NhbFwvd3AtY29udGVudFwvdXBsb2Fkc1wvMjAyM1wvMTFcLzI3OTQ2YTk5NjU3Y2RkZjBjYmRlNzlhN2U0ZTZmNTFmLmdpZiIsImxpbmsiOiJodHRwOlwvXC9lbWJlZHByZXNzLmxvY2FsXC9lbWJlZHByZXNzLWFkc1wvMjc5NDZhOTk2NTdjZGRmMGNiZGU3OWE3ZTRlNmY1MWZcLyIsImFsdCI6IiIsImF1dGhvciI6IjEiLCJkZXNjcmlwdGlvbiI6IiIsImNhcHRpb24iOiIiLCJuYW1lIjoiMjc5NDZhOTk2NTdjZGRmMGNiZGU3OWE3ZTRlNmY1MWYiLCJzdGF0dXMiOiJpbmhlcml0IiwidXBsb2FkZWRUbyI6MTA0LCJkYXRlIjoiMjAyMy0xMS0wNVQxMToyMjozOS4wMDBaIiwibW9kaWZpZWQiOiIyMDIzLTExLTA1VDExOjIyOjM5LjAwMFoiLCJtZW51T3JkZXIiOjAsIm1pbWUiOiJpbWFnZVwvZ2lmIiwidHlwZSI6ImltYWdlIiwic3VidHlwZSI6ImdpZiIsImljb24iOiJodHRwOlwvXC9lbWJlZHByZXNzLmxvY2FsXC93cC1pbmNsdWRlc1wvaW1hZ2VzXC9tZWRpYVwvZGVmYXVsdC5wbmciLCJkYXRlRm9ybWF0dGVkIjoiTm92ZW1iZXIgNSwgMjAyMyIsIm5vbmNlcyI6eyJ1cGRhdGUiOiJiMTIwZWNiYmZmIiwiZGVsZXRlIjoiMDM5OTNkMTkzOSIsImVkaXQiOiJlNjdiNDY5MTJjIn0sImVkaXRMaW5rIjoiaHR0cDpcL1wvZW1iZWRwcmVzcy5sb2NhbFwvd3AtYWRtaW5cL3Bvc3QucGhwP3Bvc3Q9MjMxJmFjdGlvbj1lZGl0IiwibWV0YSI6ZmFsc2UsImF1dGhvck5hbWUiOiJhZG1pbiIsImF1dGhvckxpbmsiOiJodHRwOlwvXC9lbWJlZHByZXNzLmxvY2FsXC93cC1hZG1pblwvcHJvZmlsZS5waHAiLCJ1cGxvYWRlZFRvVGl0bGUiOiJFbWJlZFByZXNzIEFEcyIsInVwbG9hZGVkVG9MaW5rIjoiaHR0cDpcL1wvZW1iZWRwcmVzcy5sb2NhbFwvd3AtYWRtaW5cL3Bvc3QucGhwP3Bvc3Q9MTA0JmFjdGlvbj1lZGl0IiwiZmlsZXNpemVJbkJ5dGVzIjoxODUzODksImZpbGVzaXplSHVtYW5SZWFkYWJsZSI6IjE4MSBLQiIsImNvbnRleHQiOiIiLCJoZWlnaHQiOjg3MSwid2lkdGgiOjcwMCwib3JpZW50YXRpb24iOiJwb3J0cmFpdCIsInNpemVzIjp7InRodW1ibmFpbCI6eyJoZWlnaHQiOjE1MCwid2lkdGgiOjE1MCwidXJsIjoiaHR0cDpcL1wvZW1iZWRwcmVzcy5sb2NhbFwvd3AtY29udGVudFwvdXBsb2Fkc1wvMjAyM1wvMTFcLzI3OTQ2YTk5NjU3Y2RkZjBjYmRlNzlhN2U0ZTZmNTFmLTE1MHgxNTAuZ2lmIiwib3JpZW50YXRpb24iOiJsYW5kc2NhcGUifSwibWVkaXVtIjp7ImhlaWdodCI6MzAwLCJ3aWR0aCI6MjQxLCJ1cmwiOiJodHRwOlwvXC9lbWJlZHByZXNzLmxvY2FsXC93cC1jb250ZW50XC91cGxvYWRzXC8yMDIzXC8xMVwvMjc5NDZhOTk2NTdjZGRmMGNiZGU3OWE3ZTRlNmY1MWYtMjQxeDMwMC5naWYiLCJvcmllbnRhdGlvbiI6InBvcnRyYWl0In0sImZ1bGwiOnsidXJsIjoiaHR0cDpcL1wvZW1iZWRwcmVzcy5sb2NhbFwvd3AtY29udGVudFwvdXBsb2Fkc1wvMjAyM1wvMTFcLzI3OTQ2YTk5NjU3Y2RkZjBjYmRlNzlhN2U0ZTZmNTFmLmdpZiIsImhlaWdodCI6ODcxLCJ3aWR0aCI6NzAwLCJvcmllbnRhdGlvbiI6InBvcnRyYWl0In19LCJjb21wYXQiOnsiaXRlbSI6IiIsIm1ldGEiOiIifX0sImFkRmlsZVVybCI6Imh0dHA6XC9cL2VtYmVkcHJlc3MubG9jYWxcL3dwLWNvbnRlbnRcL3VwbG9hZHNcLzIwMjNcLzExXC8yNzk0NmE5OTY1N2NkZGYwY2JkZTc5YTdlNGU2ZjUxZi5naWYiLCJhZFhQb3NpdGlvbiI6MzksImFsaWduIjoiY2VudGVyIiwicG93ZXJlZF9ieSI6dHJ1ZSwibG9ja0NvbnRlbnQiOmZhbHNlLCJsb2NrSGVhZGluZyI6IkNvbnRlbnQgTG9ja2VkIiwibG9ja1N1YkhlYWRpbmciOiJDb250ZW50IGlzIGxvY2tlZCBhbmQgcmVxdWlyZXMgcGFzc3dvcmQgdG8gYWNjZXNzIGl0LiIsInBhc3N3b3JkUGxhY2Vob2xkZXIiOiJQYXNzd29yZCIsInN1Ym1pdEJ1dHRvblRleHQiOiJVbmxvY2siLCJzdWJtaXRVbmxvY2tpbmdUZXh0IjoiVW5sb2NraW5nIiwibG9ja0Vycm9yTWVzc2FnZSI6Ik9vcHMsIHRoYXQgd2Fzbid0IHRoZSByaWdodCBwYXNzd29yZC4gVHJ5IGFnYWluLiIsImVuYWJsZUZvb3Rlck1lc3NhZ2UiOmZhbHNlLCJmb290ZXJNZXNzYWdlIjoiSW4gY2FzZSB5b3UgZG9uJ3QgaGF2ZSB0aGUgcGFzc3dvcmQsIGtpbmRseSByZWFjaCBvdXQgdG8gY29udGVudCBvd25lciBvciBhZG1pbmlzdHJhdG9yIHRvIHJlcXVlc3QgYWNjZXNzLiIsImNvbnRlbnRQYXNzd29yZCI6IiIsImNvbnRlbnRTaGFyZSI6ZmFsc2UsInNoYXJlUG9zaXRpb24iOiJyaWdodCIsInByZXNlbnRhdGlvbiI6dHJ1ZSwicG9zaXRpb24iOiJ0b3AiLCJwcmludCI6dHJ1ZSwiZG93bmxvYWQiOnRydWUsIm9wZW4iOnRydWUsImNvcHlfdGV4dCI6dHJ1ZSwiYWRkX3RleHQiOnRydWUsImRyYXciOnRydWUsInRvb2xiYXIiOnRydWUsImRvY19kZXRhaWxzIjp0cnVlLCJkb2Nfcm90YXRpb24iOnRydWUsInVuaXRvcHRpb24iOiJweCIsImFkV2lkdGgiOiIzMDAiLCJhZEhlaWdodCI6IjIwMCIsImFkWVBvc2l0aW9uIjoyMCwiYWRVcmwiOiIiLCJhZFN0YXJ0IjoiMTAiLCJhZFNraXBCdXR0b24iOnRydWUsImFkU2tpcEJ1dHRvbkFmdGVyIjoiNSJ9" class="ad-mask" data-ad-index="3">
                    <div class="ep-embed-content-wraper">
                        <div class="position-right-wraper gutenberg-pdf-wraper"><iframe title="sample" class="embedpress-embed-document-pdf embedpress-pdf-1701320841615" style="width:666px;height:600px; max-width:100%; display: inline-block" src="http://embedpress.local/wp-admin/admin-ajax.php?action=get_viewer&amp;file=http%3A%2F%2Fembedpress.local%2Fwp-content%2Fuploads%2F2023%2F10%2Fsample.pdf#key=dGhlbWVNb2RlPWRlZmF1bHQmdG9vbGJhcj10cnVlJnBvc2l0aW9uPXRvcCZwcmVzZW50YXRpb249dHJ1ZSZkb3dubG9hZD10cnVlJmNvcHlfdGV4dD10cnVlJmFkZF90ZXh0PXRydWUmZHJhdz10cnVlJmRvY19yb3RhdGlvbj10cnVlJmRvY19kZXRhaWxzPXRydWU=" frameborder="0" oncontextmenu="return false;"></iframe>
                            <p class="embedpress-el-powered">Powered By EmbedPress</p>
                        </div>
                    </div>
                    <div class="main-ad-template image" id="ad-1081011a548224fec38c97e5471bd6c0" style="display:none">
                        <div class="ep-ad-container">
                            <div class="ep-ad-content" style="position: relative;">
                                <img decoding="async" class="ep-ad" src="http://embedpress.local/wp-content/uploads/2023/11/27946a99657cddf0cbde79a7e4e6f51f.gif">



                                <button title="Skip Ad" class="skip-ad-button" style="display: inline-block;">
                                    Skip Ad </button>

                            </div>
                        </div>
                    </div>



                </div>
            </div>
        </div>


    </div>

</div>

<style>
    /* page css */
    .ad-preview-sectiion {
        display: flex;
        gap: 30px;
        justify-content: space-between;
        margin-bottom: 60px;
    }

    .video-ad-prewiew-options {
        width: 49%;
    }

    .ad-upload-options{
        width: 320px;
    }

    .uploaded-file-url.uploaded {
        background: #efeef5;
        padding: 5px;
        word-wrap: break-word;
        border-radius: 5px;
    }


    .ad__adjust__controller__item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 30px;
    }

    /* Common Styles */
    .ad-mask .ose-embedpress-responsive {
        position: relative;
    }

    .ad-running {
        display: inline-block !important;
    }

    .ad-mask .ep-embed-content-wraper::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .ep-embed-content-wraper {
        position: relative;
    }

    .ose-youtube {
        /* display: none !important; */
    }

    [data-ad-id] {
        position: relative;
        display: inline-block;
    }

    .main-ad-template.image.ad-running {
        position: absolute;
        z-index: 1;
        bottom: 75px;
        left: 50%;
        height: auto;
    }

    [data-ad-id] .main-ad-template.image.ad-running {
        border-radius: 5px;
    }

    .ep-ad-container {
        position: relative;
    }

    .main-ad-template video,
    .main-ad-template img {
        width: 100%;
        height: 100%;
        background-color: #000;
    }

    .progress-bar-container {
        margin-top: -10px;
        background: #ff000021;
    }

    .progress-bar {
        background: #5be82a;
        height: 5px;
        margin-top: -4px;
        max-width: 100%;
    }

    button.skip-ad-button {
        position: absolute;
        bottom: 15px;
        right: 10px;
        border: none;
        background: #d41556b5 !important;
        color: white !important;
        z-index: 122222222;
        font-size: 14px;
        border-radius: 4px;
        height: 30px;
        width: 80px;
        font-weight: normal;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    .ad-timer {
        position: absolute;
        background: #d41556b5;
        font-size: 14px;
        width: 110px;
        color: white;
        bottom: 15px;
        left: 10px;
        text-align: center;
        border-radius: 4px;
        height: 30px;
        width: 80px;
        font-weight: normal;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    [data-ad-id] .hidden {
        display: none !important;
    }

    /* Specific Styles for Ad Type 1 */
    [data-ad-id="ep-ad-preview-1"] .main-ad-template {
        width: 600px;
        height: 340px;
        max-width: 100%;
        display: inline-block;
    }

    [data-ad-id="ep-ad-preview-1"] .main-ad-template.image.ad-running {
        width: 300px !important;
        height: 200px !important;
        bottom: 10%;
        left: 25%;
    }

    /* Specific Styles for Ad Type 2 */
    [data-ad-id="291c61c171ca2add49648c86f82a230f"] .main-ad-template {
        width: 600px;
        height: 340px;
        max-width: 100%;
        display: inline-block;
    }

    [data-ad-id="291c61c171ca2add49648c86f82a230f"] .main-ad-template.image.ad-running {
        width: 300px !important;
        height: 200px !important;
        bottom: 10%;
        left: 25%;
    }

    /* Specific Styles for Ad Type 3 */
    [data-ad-id="fc2d9f8fc6a2e87c25ecb6bdb7561542"] .main-ad-template {
        width: 600px;
        height: 550px;
        max-width: 100%;
        display: inline-block;
    }

    [data-ad-id="fc2d9f8fc6a2e87c25ecb6bdb7561542"] .main-ad-template.image.ad-running {
        width: 300px !important;
        height: 200px !important;
        bottom: 20%;
        left: 25%;
    }

    /* Specific Styles for Ad Type 4 */
    [data-ad-id="1081011a548224fec38c97e5471bd6c0"] .main-ad-template {
        width: 666px;
        height: 550px;
        max-width: 100%;
        display: inline-block;
    }

    [data-ad-id="1081011a548224fec38c97e5471bd6c0"] .main-ad-template.image.ad-running {
        width: 300px !important;
        height: 200px !important;
        bottom: 20%;
        left: 39%;
    }
</style>



<script>
const isPyr = document.querySelector('[data-playerid]')?.getAttribute('data-playerid');
if (!isPyr) {
    var scriptUrl = 'https:\/\/www.youtube.com\/s\/player\/9d15588c\/www-widgetapi.vflset\/www-widgetapi.js'; try { var ttPolicy = window.trustedTypes.createPolicy("youtube-widget-api", { createScriptURL: function (x) { return x } }); scriptUrl = ttPolicy.createScriptURL(scriptUrl) } catch (e) { } var YT; if (!window["YT"]) YT = { loading: 0, loaded: 0 }; var YTConfig; if (!window["YTConfig"]) YTConfig = { "host": "https://www.youtube.com" };
    if (!YT.loading) {
        YT.loading = 1; (function () {
            var l = []; YT.ready = function (f) { if (YT.loaded) f(); else l.push(f) }; window.onYTReady = function () { YT.loaded = 1; var i = 0; for (; i < l.length; i++)try { l[i]() } catch (e) { } }; YT.setConfig = function (c) { var k; for (k in c) if (c.hasOwnProperty(k)) YTConfig[k] = c[k] }; var a = document.createElement("script"); a.type = "text/javascript"; a.id = "www-widgetapi-script"; a.src = scriptUrl; a.async = true; var c = document.currentScript; if (c) {
                var n = c.nonce || c.getAttribute("nonce"); if (n) a.setAttribute("nonce",
                    n)
            } var b = document.getElementsByTagName("script")[0]; b.parentNode.insertBefore(a, b)
        })()
    };
}




let adsConainers = document.querySelectorAll('[data-ad-id]');
let container = document.querySelector('[data-ad-id]');
const player = [];
const playerInit = [];
let playerIndex = 0;


adsConainers = Array.from(adsConainers);

const getYTVideoId = (url) => {
    // Check if the input is a string
    if (typeof url !== 'string') {
        return false;
    }

    const regex = /(?:youtube\.com\/(?:[^\/]+\/[^\/]+\/|(?:v|e(?:mbed)?)\/|[^#]*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);

    if (match && match[1]) {
        return match[1];
    }
    return false;
}

const hashParentClass = (element, className) => {
    var parent = element.parentNode;

    while (parent && !parent.classList?.contains(className)) {
        parent = parent.parentNode;
    }

    return !!parent;
}



const adInitialization = (adContainer, index) => {

    const adAtts = JSON.parse(atob(adContainer.getAttribute('data-ad-attrs')));

    console.log(adAtts);

    const blockId = adAtts.clientId;
    const blockIdMD5 = adContainer.getAttribute('data-ad-id');
    const adStartAfter = adAtts.adStart * 1000;
    const adContent = adAtts.adContent;
    const adVideo = adContainer.querySelector('.ep-ad');
    const adSource = adAtts.adSource;
    const adVideos = [];
    const srcUrl = adAtts.url || adAtts.embedpress_embeded_link;
    const adSkipButtonAfter = parseInt(adAtts.adSkipButtonAfter);


    addWrapperForYoutube(adContainer, srcUrl, adAtts);

    // let adVideo = adContainer.querySelector('#ad-' + blockId + ' .ep-ad');
    adVideos.push(adVideo);

    const adTemplate = adContainer.querySelector('.main-ad-template');
    const progressBar = adContainer.querySelector('.progress-bar');
    const skipButton = adContainer.querySelector('.skip-ad-button');
    const adRunningTime = adContainer.querySelector('.ad-running-time');
    var playerId;
    const adMask = adContainer;


    let playbackInitiated = false;

    if (skipButton && adSource !== 'video') {
        skipButton.style.display = 'inline-block';
    }

    const hashClass = hashParentClass(adContainer, 'ep-content-protection-enabled');

    if (hashClass) {
        adContainer.classList.remove('ad-mask');
    }

    adMask?.addEventListener('click', function () {

        if (adContainer.classList.contains('ad-mask')) {
            playerId = adContainer.querySelector('[data-playerid]')?.getAttribute('data-playerid');

            if (playerInit?.length > 0) {
                playerInit[playerId]?.play();
            }

            if (getYTVideoId(srcUrl)) {
                player[index]?.playVideo();
            }

            if (!playbackInitiated) {
                setTimeout(() => {
                    if (adSource !== 'image') {
                        adContainer.querySelector('.ep-embed-content-wraper').classList.add('hidden');
                    }
                    adTemplate?.classList.add('ad-running');
                    if (adVideo && adSource === 'video') {
                        adVideo.muted = false;
                        adVideo.play();
                    }
                }, adStartAfter);

                playbackInitiated = true;
            }

            adContainer.classList.remove('ad-mask');
        }

    });

    adVideo?.addEventListener('timeupdate', () => {
        const currentTime = adVideo?.currentTime;
        const videoDuration = adVideo?.duration;

        if (currentTime <= videoDuration) {
            const remainingTime = Math.max(0, videoDuration - currentTime); // Ensure it's not negative
            adRunningTime.innerText = Math.floor(remainingTime / 60) + ':' + (Math.floor(remainingTime) % 60).toString().padStart(2, '0');
        }

        if (!isNaN(currentTime) && !isNaN(videoDuration)) {
            const progress = (currentTime / videoDuration) * 100;
            progressBar.style.width = progress + '%';

            if (currentTime >= adSkipButtonAfter) {
                // Show the skip button after 3 seconds
                skipButton.style.display = 'inline-block';
            }
        }
    });


    // Add a click event listener to the skip button
    skipButton?.addEventListener('click', () => {
        adTemplate.remove();
        if (playerInit?.length > 0) {
            playerInit[playerId]?.play();

        }
        if (getYTVideoId(srcUrl)) {
            player[index]?.playVideo();
        }
        adContainer.querySelector('.ep-embed-content-wraper').classList.remove('hidden');
    });

    // Add an event listener to check for video end
    adVideo?.addEventListener('play', () => {
        if (playerInit?.length > 0) {
            playerInit[playerId]?.stop();
        }
    });

    // Add an event listener to check for video end
    adVideo?.addEventListener('ended', () => {
        // Remove the main ad template from the DOM when the video ends
        adTemplate.remove();
        adContainer.querySelector('.ep-embed-content-wraper').classList.remove('hidden');
    });

    playerIndex++;

}

const addWrapperForYoutube = (adContainer, srcUrl, adAtts) => {
    const youtubeIframe = adContainer.querySelector(`.ose-youtube iframe`);
    if (youtubeIframe && getYTVideoId(srcUrl)) {

        const divWrapper = document.createElement('div');
        divWrapper.className = 'ad-youtube-video';
        youtubeIframe.setAttribute('width', adAtts.width);
        youtubeIframe.setAttribute('height', adAtts.height);
        youtubeIframe.parentNode.replaceChild(divWrapper, youtubeIframe);
        divWrapper.appendChild(youtubeIframe);
    }
}



function onYouTubeIframeAPIReady(iframe, srcUrl, adVideo, index) {
    // Find the iframe by its src attribute

    if (iframe && getYTVideoId(srcUrl) !== null) {
        player[index] = new YT.Player(iframe, {
            videoId: getYTVideoId(srcUrl),

            events: {
                'onReady': (event) => onPlayerReady(event, adVideo),
            }
        });

    }

}

// This function is called when the player is ready
function onPlayerReady(event, adVideo) {
    adVideo?.addEventListener('ended', function () {
        event.target.playVideo();
    });

    adVideo?.addEventListener('play', function () {
        event.target.pauseVideo();
    });
}


window.onload = function () {
    let yVideos = setInterval(() => {
        var youtubeVideos = document.querySelectorAll('.ose-youtube');
        if (youtubeVideos.length > 0) {
            clearInterval(yVideos);

            youtubeVideos.forEach((yVideo, index) => {
                const srcUrl = yVideo.querySelector('iframe')?.getAttribute('src');
                const adVideo = yVideo.closest('.ad-mask')?.querySelector('.ep-ad');
                const isYTChannel = yVideo.closest('.ad-mask')?.querySelector('.ep-youtube-channel');
                if(adVideo && !isYTChannel){

                    console.log(isYTChannel);
                    
                    onYouTubeIframeAPIReady(yVideo, srcUrl, adVideo, index);
                }
            });
        }
    }, 100);
};


if (adsConainers.length > 0) {
    let ytIndex = 0;
    adsConainers.forEach((adContainer, epAdIndex) => {

        adContainer.setAttribute('data-ad-index', epAdIndex);
        adInitialization(adContainer, ytIndex);
        if (getYTVideoId(adContainer.querySelector('iframe')?.getAttribute('src'))) {
            ytIndex++;
        }
    });
}


// const playPreview = (adPreviewId) => {
//     const adPreviewContainer = document.querySelector(adPreviewId);
//     console.log(adPreviewContainer);
// }

function playPreview() {


    var form = document.getElementById("ad-preview-1");
    var formData = new FormData(form);

    // You can now access form data using the FormData object
    // For example, to get the value of the "videoFile" field:
    var videoFile = formData.get("videoFile");

    // To get all form data as an object, you can convert FormData to JSON
    var formDataObject = {};
    formData.forEach(function(value, key){
        formDataObject[key] = value;
    });

    // Now formDataObject contains all form data as key-value pairs
    console.log(formDataObject);

    adInitialization

    // Perform any additional actions, such as AJAX request or other processing
    event.preventDefault();


}





</script>

<form id="uploadForm">
    <input type="button" id="uploadBtn" class="button" value="Upload" />
    <input type="hidden" id="fileInput" name="file_input" value="" />
</form>

<script>
jQuery(document).ready(function($){
    var mediaUploader;

    // Trigger when the "Upload" button is clicked
    $('#uploadBtn').click(function(e) {
        e.preventDefault();
        if (mediaUploader) {
            mediaUploader.open();
            return;
        }

        // Extend the wp.media object
        mediaUploader = wp.media.frames.file_frame = wp.media({
            title: 'Choose File',
            button: {
                text: 'Choose File'
            },
            multiple: false
        });

        // Handle the file selection
        mediaUploader.on('select', function() {
            var attachment = mediaUploader.state().get('selection').first().toJSON();

            console.log(attachment);
            $('#fileInput').val(attachment.url);
            $('.uploaded-file-url').text(attachment.url);
            $('.uploaded-file-url').addClass('uploaded');
        });

        // Open the media uploader
        mediaUploader.open();
    });
});
</script>
