<?php
/*
 * Player & Engagement landing page (Pro INACTIVE only).
 *
 * Renders the same React mount point Pro uses. The CustomPlayer React app
 * reads window.embedpressCustomPlayerData.isProActive — when false, it
 * renders the full Pro layout (header + tabs) with an UpgradePanel in the
 * body instead of fetching engagement data. Identical markup to Pro;
 * only the body content differs.
 *
 * When Pro IS active, Pro plugin's Admin_Page registers its own page on
 * this same slug and supplies REST endpoints + isProActive=true.
 */

if (!defined('ABSPATH')) exit;
?>
<div class="embedpress-custom-player-wrapper">
    <div id="embedpress-custom-player-root"></div>
</div>
