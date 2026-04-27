# Plugin Check Report

**Plugin:** EmbedPress
**Generated at:** 2026-04-27 03:52:44


## `.DS_Store` ✅ DONE (excluded via .distignore)

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | hidden_files | Hidden files are not permitted. |  |

## `tests/e2e/.auth/.gitkeep` ✅ DONE (excluded via .distignore)

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | hidden_files | Hidden files are not permitted. |  |

## `.prettierrc` ✅ DONE (excluded via .distignore)

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | hidden_files | Hidden files are not permitted. |  |

## `.gitattributes` ✅ DONE (excluded via .distignore)

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | hidden_files | Hidden files are not permitted. |  |

## `.env.example` ✅ DONE (excluded via .distignore)

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | hidden_files | Hidden files are not permitted. |  |

## `.eslintrc.json` ✅ DONE (excluded via .distignore)

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | hidden_files | Hidden files are not permitted. |  |

## `watch.sh` ✅ DONE (excluded via .distignore)

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | application_detected | Application files are not permitted. |  |

## `build.sh` ✅ DONE (excluded via .distignore)

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | application_detected | Application files are not permitted. |  |

## `EmbedPress/ThirdParty/Googlecalendar/Embedpress_Google_Helper.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 523 | 20 | ERROR | WordPress.Security.EscapeOutput.OutputNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found '__'. | [Docs](https://developer.wordpress.org/apis/security/escaping/#escaping-functions) |
| 523 | 63 | ERROR | WordPress.Security.EscapeOutput.OutputNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found '$backLink'. | [Docs](https://developer.wordpress.org/apis/security/escaping/#escaping-functions) |

## `EmbedPress/ThirdParty/Googlecalendar/GoogleClient.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 87 | 96 | ERROR | WordPress.Security.EscapeOutput.ExceptionNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found '$result'. | [Docs](https://developer.wordpress.org/apis/security/escaping/) |

## `EmbedPress/Includes/Classes/Analytics/Data_Collector.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 114 | 13 | ERROR | WordPress.DB.PreparedSQL.NotPrepared | Use placeholders and $wpdb->prepare(); found $sql |  |

## `EmbedPress/Includes/Classes/Analytics/Pro_Data_Collector.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 149 | 28 | ERROR | WordPress.DB.PreparedSQL.NotPrepared | Use placeholders and $wpdb->prepare(); found $order_by_total_views |  |
| 149 | 50 | ERROR | WordPress.DB.PreparedSQL.NotPrepared | Use placeholders and $wpdb->prepare(); found ? |  |
| 149 | 81 | ERROR | WordPress.DB.PreparedSQL.NotPrepared | Use placeholders and $wpdb->prepare(); found : |  |

## `EmbedPress/Providers/Calendly.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 136 | 1 | ERROR | WordPress.WP.EnqueuedResources.NonEnqueuedStylesheet | Stylesheets must be registered/enqueued via wp_enqueue_style() |  |
| 136 | 1 | ERROR | PluginCheck.CodeAnalysis.Offloading.OffloadedContent | Offloading images, js, css, and other scripts to your servers or any remote service is disallowed. |  |
| 142 | 1 | ERROR | WordPress.WP.EnqueuedResources.NonEnqueuedStylesheet | Stylesheets must be registered/enqueued via wp_enqueue_style() |  |
| 142 | 1 | ERROR | PluginCheck.CodeAnalysis.Offloading.OffloadedContent | Offloading images, js, css, and other scripts to your servers or any remote service is disallowed. |  |
| 143 | 1 | ERROR | WordPress.WP.EnqueuedResources.NonEnqueuedScript | Scripts must be registered/enqueued via wp_enqueue_script() |  |

## `EmbedPress/Providers/OpenSea.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 254 | 1 | ERROR | WordPress.WP.EnqueuedResources.NonEnqueuedScript | Scripts must be registered/enqueued via wp_enqueue_script() |  |
| 254 | 1 | ERROR | PluginCheck.CodeAnalysis.Offloading.OffloadedContent | Offloading images, js, css, and other scripts to your servers or any remote service is disallowed. |  |
