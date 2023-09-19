<div class="source-settings-page">
    <div class="tab-button-section">
        <div class="source-tab">
            <button class="tab-button" onclick="openTab('all')"><img class="source-image" src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/sources/code.svg" alt=""> All Sources</button>
            <button class="tab-button" onclick="openTab('video')"><img class="source-image" src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/sources/video.svg" alt="">Video Sources</button>
            <button class="tab-button" onclick="openTab('image')"><img class="source-image" src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/sources/image.svg" alt="">Image Sources 1</button>
            <button class="tab-button" onclick="openTab('google')"><img class="source-image" src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/sources/google.svg" alt="">Google Sources</button>
            <button class="tab-button" onclick="openTab('social')"><img class="source-image" src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/sources/social.svg" alt="">Social Sources</button>
            <button class="tab-button" onclick="openTab('audio')"><img class="source-image" src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/sources/audio.svg" alt="">Audio Sources</button>
            <button class="tab-button" onclick="openTab('stream')"><img class="source-image" src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/sources/stream.svg" alt="">Live Stream Sources</button>
            <button class="tab-button" onclick="openTab('pdf')"><img class="source-image" src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/sources/pdf.svg" alt="">PDF & Doc Sources</button>
        </div>
    </div>
    <div class="tab-content-section">
        <div class="source-item" data-tab="video">
            <!-- Content for Video Sources -->
            <div class="source-left">
            <div class="icon">
                 <img class="source-image" src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/sources/youtube.svg" alt="">
           </div>
            <span class="source-name">Youtube</span>
            </div>
            <div class="source-right">
                <a href="#"> 
                    <img class="settings-icon" src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/sources/source-settings.svg" alt="">
                </a>
                <a href="#"> 
                    <img class="settings-icon" src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/sources/source-doc.svg" alt="">
                </a>
            </div>
        </div>
        <div class="source-item" data-tab="audio">
            <!-- Content for Video Sources -->
            <img class="source-image" src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/sources/youtube.svg" alt="">
            <span class="source-name">Youtube</span>
            <img class="settings-icon" src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/sources/source-settings.svg" alt="">
            <img class="doc-icon" src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/sources/source-doc.svg" alt="">
        </div>
        <div class="source-item" data-tab="image">
            <!-- Content for Video Sources -->
            <img class="source-image" src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/sources/youtube.svg" alt="">
            <span class="source-name">Youtube</span>
            <img class="settings-icon" src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/sources/source-settings.svg" alt="">
            <img class="doc-icon" src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/sources/source-doc.svg" alt="">
        </div>
        <div class="source-item" data-tab="google">
            <!-- Content for Video Sources -->
            <img class="source-image" src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/sources/youtube.svg" alt="">
            <span class="source-name">Youtube</span>
            <img class="settings-icon" src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/sources/source-settings.svg" alt="">
            <img class="doc-icon" src="<?php echo EMBEDPRESS_SETTINGS_ASSETS_URL; ?>img/sources/source-doc.svg" alt="">
        </div>
    </div>
</div>

<script>
    function openTab(tabName) {
    var i, tabContent;
    tabContent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }

    // Remove "active" class from all buttons
    var tabButtons = document.getElementsByClassName("tab-button");
    for (i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove("active");
    }

    if (tabName === "all") {
        // Display all tab content if "All Sources" is clicked
        for (i = 0; i < tabContent.length; i++) {
            tabContent[i].style.display = "block";
        }
    } else {
        document.getElementById(tabName).style.display = "block";
        // Add "active" class to the clicked button
        var clickedButton = document.querySelector("[onclick='openTab(\"" + tabName + "\")']");
        if (clickedButton) {
            clickedButton.classList.add("active");
        }
    }
}

</script>


<style>
    .source-settings-page {
    background: #fff;
    padding: 25px;
    border-radius: 25px;
}
button.tab-button.active {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: #5b4e96;
    padding: 15px;
    border-radius: 30px;
    margin-bottom: 5px;
    color: white;
}
   .tab-content-section{
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* Three items per row */
    gap: 15px; /* Adjust the gap between items as needed */
}

.source-item {
    padding: 10px;
    text-align: center;
    display: flex!important;
    align-items: center;
    justify-content: space-between;
    background: #f5f7fd;
    border-radius: 8px;
}

.source-item div {
    display: flex;
    align-items: center;
    gap: 5px;
    color: #404040;
    font-family: 'DMSans';
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 120%; /* 16.8px */
    letter-spacing: -0.28px;
}

.source-left .icon{
    width: 32px;
    height: 32px;
    background: #fff;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.source-left .icon img{
    width: 20px;
    height: 20px;
}

.source-right a{
    width: 28px;
    height: 28px;
    background: #fff;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.source-right a img{
    width: 18px;
    height: 18px;
}

/* Additional styles for source-item if needed */

</style>