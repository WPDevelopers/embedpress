# Plugin Check Report

**Plugin:** EmbedPress
**Generated at:** 2026-04-27 03:18:39


## `EmbedPress/Ends/Back/Settings/templates/shortcode.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 18 | 25 | ERROR | WordPress.WP.I18n.MissingTranslatorsComment | A function call to __() with texts containing placeholders was found, but was not accompanied by a "translators:" comment on the line above to clarify the meaning of the placeholders. | [Docs](https://developer.wordpress.org/plugins/internationalization/how-to-internationalize-your-plugin/#descriptions) |

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

## `tests/bootstrap.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | missing_direct_file_access_protection | PHP file should prevent direct access. Add a check like: if ( ! defined( 'ABSPATH' ) ) exit; | [Docs](https://developer.wordpress.org/plugins/wordpress-org/common-issues/#direct-file-access) |
| 66 | 10 | ERROR | WordPress.Security.EscapeOutput.OutputNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found '"Could not find WordPress test suite at {$ep_tests_dir}.\n"'. | [Docs](https://developer.wordpress.org/apis/security/escaping/#escaping-functions) |

## `EmbedPress/Gutenberg/EmbedPressBlockRenderer.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 1179 | 28 | ERROR | WordPress.Security.EscapeOutput.OutputNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found 'wp_strip_all_tags'. | [Docs](https://developer.wordpress.org/apis/security/escaping/#escaping-functions) |

## `EmbedPress/Elementor/Elementor_Upsale.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 76 | 61 | ERROR | WordPress.Security.EscapeOutput.OutputNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found '$i'. | [Docs](https://developer.wordpress.org/apis/security/escaping/#escaping-functions) |

## `EmbedPress/simple_html_dom.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | missing_direct_file_access_protection | PHP file should prevent direct access. Add a check like: if ( ! defined( 'ABSPATH' ) ) exit; | [Docs](https://developer.wordpress.org/plugins/wordpress-org/common-issues/#direct-file-access) |
| 210 | 14 | ERROR | WordPress.Security.EscapeOutput.OutputNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found 'str_repeat'. | [Docs](https://developer.wordpress.org/apis/security/escaping/#escaping-functions) |
| 210 | 41 | ERROR | WordPress.Security.EscapeOutput.OutputNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found '$this'. | [Docs](https://developer.wordpress.org/apis/security/escaping/#escaping-functions) |
| 215 | 22 | ERROR | WordPress.Security.EscapeOutput.OutputNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found '"[$k]=>\"$v\", "'. | [Docs](https://developer.wordpress.org/apis/security/escaping/#escaping-functions) |
| 275 | 18 | ERROR | WordPress.Security.EscapeOutput.OutputNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found '$string'. | [Docs](https://developer.wordpress.org/apis/security/escaping/#escaping-functions) |

## `EmbedPress/Ends/Back/Settings/templates/vimeo.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | missing_direct_file_access_protection | PHP file should prevent direct access. Add a check like: if ( ! defined( 'ABSPATH' ) ) exit; | [Docs](https://developer.wordpress.org/plugins/wordpress-org/common-issues/#direct-file-access) |
| 25 | 19 | ERROR | WordPress.Security.EscapeOutput.OutputNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found '$nonce_field'. | [Docs](https://developer.wordpress.org/apis/security/escaping/#escaping-functions) |

## `EmbedPress/Ends/Back/Settings/templates/soundcloud.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | missing_direct_file_access_protection | PHP file should prevent direct access. Add a check like: if ( ! defined( 'ABSPATH' ) ) exit; | [Docs](https://developer.wordpress.org/plugins/wordpress-org/common-issues/#direct-file-access) |
| 26 | 19 | ERROR | WordPress.Security.EscapeOutput.OutputNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found '$nonce_field'. | [Docs](https://developer.wordpress.org/apis/security/escaping/#escaping-functions) |

## `EmbedPress/Ends/Back/Settings/templates/dailymotion.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | missing_direct_file_access_protection | PHP file should prevent direct access. Add a check like: if ( ! defined( 'ABSPATH' ) ) exit; | [Docs](https://developer.wordpress.org/plugins/wordpress-org/common-issues/#direct-file-access) |
| 29 | 19 | ERROR | WordPress.Security.EscapeOutput.OutputNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found '$nonce_field'. | [Docs](https://developer.wordpress.org/apis/security/escaping/#escaping-functions) |

## `EmbedPress/Ends/Back/Settings/templates/wistia.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | missing_direct_file_access_protection | PHP file should prevent direct access. Add a check like: if ( ! defined( 'ABSPATH' ) ) exit; | [Docs](https://developer.wordpress.org/plugins/wordpress-org/common-issues/#direct-file-access) |
| 31 | 19 | ERROR | WordPress.Security.EscapeOutput.OutputNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found '$nonce_field'. | [Docs](https://developer.wordpress.org/apis/security/escaping/#escaping-functions) |

## `EmbedPress/Ends/Back/Settings/templates/custom-logo.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 191 | 233 | ERROR | WordPress.Security.EscapeOutput.OutputNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found '$logo_id'. | [Docs](https://developer.wordpress.org/apis/security/escaping/#escaping-functions) |
| 214 | 134 | ERROR | WordPress.Security.EscapeOutput.OutputNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found '$logo_xpos'. | [Docs](https://developer.wordpress.org/apis/security/escaping/#escaping-functions) |
| 215 | 169 | ERROR | WordPress.Security.EscapeOutput.OutputNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found '$logo_xpos'. | [Docs](https://developer.wordpress.org/apis/security/escaping/#escaping-functions) |

## `EmbedPress/Ends/Back/Settings/templates/twitch.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | missing_direct_file_access_protection | PHP file should prevent direct access. Add a check like: if ( ! defined( 'ABSPATH' ) ) exit; | [Docs](https://developer.wordpress.org/plugins/wordpress-org/common-issues/#direct-file-access) |
| 24 | 19 | ERROR | WordPress.Security.EscapeOutput.OutputNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found '$nonce_field'. | [Docs](https://developer.wordpress.org/apis/security/escaping/#escaping-functions) |

## `EmbedPress/Ends/Back/Settings/templates/partials/logo.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | missing_direct_file_access_protection | PHP file should prevent direct access. Add a check like: if ( ! defined( 'ABSPATH' ) ) exit; | [Docs](https://developer.wordpress.org/plugins/wordpress-org/common-issues/#direct-file-access) |
| 9 | 57 | ERROR | WordPress.Security.EscapeOutput.OutputNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found 'EMBEDPRESS_URL_ASSETS'. | [Docs](https://developer.wordpress.org/apis/security/escaping/#escaping-functions) |

## `EmbedPress/ThirdParty/Googlecalendar/Embedpress_Google_Helper.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | missing_direct_file_access_protection | PHP file should prevent direct access. Add a check like: if ( ! defined( 'ABSPATH' ) ) exit; | [Docs](https://developer.wordpress.org/plugins/wordpress-org/common-issues/#direct-file-access) |
| 62 | 47 | ERROR | WordPress.Security.EscapeOutput.OutputNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found '$htmlId'. | [Docs](https://developer.wordpress.org/apis/security/escaping/#escaping-functions) |
| 67 | 48 | ERROR | WordPress.Security.EscapeOutput.OutputNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found '$htmlId'. | [Docs](https://developer.wordpress.org/apis/security/escaping/#escaping-functions) |
| 84 | 22 | ERROR | WordPress.Security.EscapeOutput.UnsafePrintingFunction | All output should be run through an escaping function (like esc_html_e() or esc_attr_e()), found '_e'. | [Docs](https://developer.wordpress.org/apis/security/escaping/#escaping-with-localization) |
| 109 | 27 | ERROR | WordPress.Security.EscapeOutput.OutputNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found '$notice'. | [Docs](https://developer.wordpress.org/apis/security/escaping/#escaping-functions) |
| 313 | 33 | ERROR | WordPress.Security.EscapeOutput.ExceptionNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found 'EPGC_ERRORS_CLIENT_SECRET_MISSING'. | [Docs](https://developer.wordpress.org/apis/security/escaping/) |
| 317 | 33 | ERROR | WordPress.Security.EscapeOutput.ExceptionNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found 'EPGC_ERRORS_CLIENT_SECRET_INVALID'. | [Docs](https://developer.wordpress.org/apis/security/escaping/) |
| 323 | 41 | ERROR | WordPress.Security.EscapeOutput.ExceptionNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found 'EPGC_ERRORS_REDIRECT_URI_MISSING'. | [Docs](https://developer.wordpress.org/apis/security/escaping/) |
| 323 | 75 | ERROR | WordPress.Security.EscapeOutput.ExceptionNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found 'EPGC_REDIRECT_URL'. | [Docs](https://developer.wordpress.org/apis/security/escaping/) |
| 336 | 37 | ERROR | WordPress.Security.EscapeOutput.ExceptionNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found 'EPGC_ERRORS_ACCESS_TOKEN_MISSING'. | [Docs](https://developer.wordpress.org/apis/security/escaping/) |
| 341 | 37 | ERROR | WordPress.Security.EscapeOutput.ExceptionNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found 'EPGC_ERRORS_REFRESH_TOKEN_MISSING'. | [Docs](https://developer.wordpress.org/apis/security/escaping/) |
| 390 | 55 | ERROR | WordPress.DB.PreparedSQL.NotPrepared | Use placeholders and $wpdb->prepare(); found EPGC_TRANSIENT_PREFIX |  |
| 390 | 119 | ERROR | WordPress.DB.PreparedSQL.NotPrepared | Use placeholders and $wpdb->prepare(); found EPGC_TRANSIENT_PREFIX |  |
| 498 | 20 | ERROR | WordPress.Security.EscapeOutput.OutputNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found '__'. | [Docs](https://developer.wordpress.org/apis/security/escaping/#escaping-functions) |
| 498 | 56 | ERROR | WordPress.Security.EscapeOutput.OutputNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found '$backLink'. | [Docs](https://developer.wordpress.org/apis/security/escaping/#escaping-functions) |
| 511 | 36 | ERROR | WordPress.Security.EscapeOutput.OutputNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found '$s'. | [Docs](https://developer.wordpress.org/apis/security/escaping/#escaping-functions) |
| 511 | 42 | ERROR | WordPress.Security.EscapeOutput.OutputNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found '$backLink'. | [Docs](https://developer.wordpress.org/apis/security/escaping/#escaping-functions) |
| 513 | 36 | ERROR | WordPress.Security.EscapeOutput.OutputNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found '$error'. | [Docs](https://developer.wordpress.org/apis/security/escaping/#escaping-functions) |
| 513 | 46 | ERROR | WordPress.Security.EscapeOutput.OutputNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found '$backLink'. | [Docs](https://developer.wordpress.org/apis/security/escaping/#escaping-functions) |
| 515 | 20 | ERROR | WordPress.Security.EscapeOutput.OutputNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found '$error'. | [Docs](https://developer.wordpress.org/apis/security/escaping/#escaping-functions) |
| 515 | 29 | ERROR | WordPress.Security.EscapeOutput.OutputNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found '$backLink'. | [Docs](https://developer.wordpress.org/apis/security/escaping/#escaping-functions) |
| 517 | 20 | ERROR | WordPress.Security.EscapeOutput.OutputNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found '__'. | [Docs](https://developer.wordpress.org/apis/security/escaping/#escaping-functions) |
| 517 | 63 | ERROR | WordPress.Security.EscapeOutput.OutputNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found '$backLink'. | [Docs](https://developer.wordpress.org/apis/security/escaping/#escaping-functions) |

## `EmbedPress/ThirdParty/Googlecalendar/GoogleClient.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | missing_direct_file_access_protection | PHP file should prevent direct access. Add a check like: if ( ! defined( 'ABSPATH' ) ) exit; | [Docs](https://developer.wordpress.org/plugins/wordpress-org/common-issues/#direct-file-access) |
| 79 | 64 | ERROR | WordPress.Security.EscapeOutput.ExceptionNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found '$result'. | [Docs](https://developer.wordpress.org/apis/security/escaping/) |
| 84 | 96 | ERROR | WordPress.Security.EscapeOutput.ExceptionNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found '$result'. | [Docs](https://developer.wordpress.org/apis/security/escaping/) |
| 108 | 64 | ERROR | WordPress.Security.EscapeOutput.ExceptionNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found '$exMessage'. | [Docs](https://developer.wordpress.org/apis/security/escaping/) |
| 108 | 76 | ERROR | WordPress.Security.EscapeOutput.ExceptionNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found '$exCode'. | [Docs](https://developer.wordpress.org/apis/security/escaping/) |
| 108 | 85 | ERROR | WordPress.Security.EscapeOutput.ExceptionNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found '$exDescription'. | [Docs](https://developer.wordpress.org/apis/security/escaping/) |
| 223 | 33 | ERROR | WordPress.Security.EscapeOutput.ExceptionNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found '$_GET['error']'. | [Docs](https://developer.wordpress.org/apis/security/escaping/) |

## `EmbedPress/AutoLoader.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 196 | 34 | ERROR | WordPress.Security.EscapeOutput.ExceptionNotEscaped | All output should be run through an escaping function (see the Security sections in the WordPress Developer Handbooks), found '"Cannot register '{$prefix}'. The requested base directory does not exist!'"'. | [Docs](https://developer.wordpress.org/apis/security/escaping/) |

## `tests/stubs.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 145 | 21 | ERROR | WordPress.WP.AlternativeFunctions.strip_tags_strip_tags | strip_tags() is discouraged. Use the more comprehensive wp_strip_all_tags() instead. |  |

## `EmbedPress/Providers/SelfHosted.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 28 | 22 | ERROR | WordPress.WP.AlternativeFunctions.parse_url_parse_url | parse_url() is discouraged because of inconsistency in the output across PHP versions; use wp_parse_url() instead. |  |

## `EmbedPress/Providers/Wrapper.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 26 | 22 | ERROR | WordPress.WP.AlternativeFunctions.parse_url_parse_url | parse_url() is discouraged because of inconsistency in the output across PHP versions; use wp_parse_url() instead. |  |

## `EmbedPress/Includes/Classes/Analytics/REST_API.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 726 | 26 | ERROR | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $sql used in $wpdb->query()\n$sql assigned unsafely at line 725. |  |
| 726 | 47 | ERROR | WordPress.DB.PreparedSQL.NotPrepared | Use placeholders and $wpdb->prepare(); found $sql |  |
| 1083 | 25 | ERROR | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $where_clause used in $wpdb->get_results()\n$where_clause assigned unsafely at line 1078. |  |
| 1129 | 36 | ERROR | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $where_clause used in $wpdb->get_results()\n$where_clause assigned unsafely at line 1078. |  |

## `EmbedPress/Includes/Classes/Analytics/Data_Collector.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 111 | 26 | ERROR | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $sql used in $wpdb->query()\n$sql assigned unsafely at line 101. |  |
| 112 | 13 | ERROR | WordPress.DB.PreparedSQL.NotPrepared | Use placeholders and $wpdb->prepare(); found $sql |  |
| 410 | 20 | ERROR | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $sql used in $wpdb->query()\n$sql assigned unsafely at line 409. |  |
| 410 | 41 | ERROR | WordPress.DB.PreparedSQL.NotPrepared | Use placeholders and $wpdb->prepare(); found $sql |  |
| 804 | 27 | ERROR | WordPress.WP.AlternativeFunctions.parse_url_parse_url | parse_url() is discouraged because of inconsistency in the output across PHP versions; use wp_parse_url() instead. |  |
| 1314 | 41 | ERROR | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $status_condition used in $wpdb->get_var()\n$status_condition assigned unsafely at line 1302. |  |
| 1321 | 41 | ERROR | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $status_condition used in $wpdb->get_var()\n$status_condition assigned unsafely at line 1302. |  |
| 1336 | 45 | ERROR | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $status_condition used in $wpdb->get_var()\n$status_condition assigned unsafely at line 1302. |  |
| 2273 | 55 | ERROR | WordPress.WP.AlternativeFunctions.rand_rand | rand() is discouraged. Use the far less predictable wp_rand() instead. |  |
| 2274 | 57 | ERROR | WordPress.WP.AlternativeFunctions.rand_rand | rand() is discouraged. Use the far less predictable wp_rand() instead. |  |
| 2275 | 67 | ERROR | WordPress.WP.AlternativeFunctions.rand_rand | rand() is discouraged. Use the far less predictable wp_rand() instead. |  |
| 2276 | 67 | ERROR | WordPress.WP.AlternativeFunctions.rand_rand | rand() is discouraged. Use the far less predictable wp_rand() instead. |  |
| 2585 | 19 | ERROR | WordPress.WP.AlternativeFunctions.parse_url_parse_url | parse_url() is discouraged because of inconsistency in the output across PHP versions; use wp_parse_url() instead. |  |
| 2757 | 23 | ERROR | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $sql used in $wpdb->query()\n$sql assigned unsafely at line 2755. |  |
| 2757 | 44 | ERROR | WordPress.DB.PreparedSQL.NotPrepared | Use placeholders and $wpdb->prepare(); found $sql |  |

## `EmbedPress/Includes/Classes/Analytics/Pro_Data_Collector.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 107 | 27 | ERROR | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $limit_clause used in $wpdb->get_results()\n$limit_clause assigned unsafely at line 97. |  |
| 148 | 28 | ERROR | WordPress.DB.PreparedSQL.NotPrepared | Use placeholders and $wpdb->prepare(); found $order_by_total_views |  |
| 148 | 50 | ERROR | WordPress.DB.PreparedSQL.NotPrepared | Use placeholders and $wpdb->prepare(); found ? |  |
| 148 | 81 | ERROR | WordPress.DB.PreparedSQL.NotPrepared | Use placeholders and $wpdb->prepare(); found : |  |
| 365 | 25 | ERROR | WordPress.DateTime.RestrictedFunctions.date_date | date() is affected by runtime timezone changes which can cause date/time to be incorrectly displayed. Use gmdate() instead. |  |
| 639 | 23 | ERROR | WordPress.WP.AlternativeFunctions.parse_url_parse_url | parse_url() is discouraged because of inconsistency in the output across PHP versions; use wp_parse_url() instead. |  |

## `EmbedPress/Includes/Classes/Analytics/Export_Manager.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 219 | 17 | ERROR | WordPress.DateTime.RestrictedFunctions.date_date | date() is affected by runtime timezone changes which can cause date/time to be incorrectly displayed. Use gmdate() instead. |  |
| 220 | 17 | ERROR | WordPress.DateTime.RestrictedFunctions.date_date | date() is affected by runtime timezone changes which can cause date/time to be incorrectly displayed. Use gmdate() instead. |  |
| 241 | 44 | ERROR | WordPress.DateTime.RestrictedFunctions.date_date | date() is affected by runtime timezone changes which can cause date/time to be incorrectly displayed. Use gmdate() instead. |  |
| 384 | 30 | ERROR | WordPress.DateTime.RestrictedFunctions.date_date | date() is affected by runtime timezone changes which can cause date/time to be incorrectly displayed. Use gmdate() instead. |  |
| 472 | 40 | ERROR | WordPress.DateTime.RestrictedFunctions.date_date | date() is affected by runtime timezone changes which can cause date/time to be incorrectly displayed. Use gmdate() instead. |  |
| 555 | 45 | ERROR | WordPress.DateTime.RestrictedFunctions.date_date | date() is affected by runtime timezone changes which can cause date/time to be incorrectly displayed. Use gmdate() instead. |  |
| 659 | 40 | ERROR | WordPress.DateTime.RestrictedFunctions.date_date | date() is affected by runtime timezone changes which can cause date/time to be incorrectly displayed. Use gmdate() instead. |  |
| 703 | 17 | ERROR | WordPress.DateTime.RestrictedFunctions.date_date | date() is affected by runtime timezone changes which can cause date/time to be incorrectly displayed. Use gmdate() instead. |  |
| 704 | 17 | ERROR | WordPress.DateTime.RestrictedFunctions.date_date | date() is affected by runtime timezone changes which can cause date/time to be incorrectly displayed. Use gmdate() instead. |  |

## `EmbedPress/Ends/Back/Settings/templates/calendly.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | missing_direct_file_access_protection | PHP file should prevent direct access. Add a check like: if ( ! defined( 'ABSPATH' ) ) exit; | [Docs](https://developer.wordpress.org/plugins/wordpress-org/common-issues/#direct-file-access) |
| 386 | 68 | ERROR | WordPress.DateTime.RestrictedFunctions.date_date | date() is affected by runtime timezone changes which can cause date/time to be incorrectly displayed. Use gmdate() instead. |  |
| 387 | 61 | ERROR | WordPress.DateTime.RestrictedFunctions.date_date | date() is affected by runtime timezone changes which can cause date/time to be incorrectly displayed. Use gmdate() instead. |  |
| 387 | 117 | ERROR | WordPress.DateTime.RestrictedFunctions.date_date | date() is affected by runtime timezone changes which can cause date/time to be incorrectly displayed. Use gmdate() instead. |  |

## `EmbedPress/Core.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | missing_direct_file_access_protection | PHP file should prevent direct access. Add a check like: if ( ! defined( 'ABSPATH' ) ) exit; | [Docs](https://developer.wordpress.org/plugins/wordpress-org/common-issues/#direct-file-access) |
| 549 | 21 | ERROR | PluginCheck.CodeAnalysis.Offloading.OffloadedContent | Offloading images, js, css, and other scripts to your servers or any remote service is disallowed. |  |
| 708 | 13 | ERROR | WordPress.WP.AlternativeFunctions.file_system_operations_mkdir | File operations should use WP_Filesystem methods instead of direct PHP filesystem calls. Found: mkdir(). |  |

## `includes.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 88 | 5 | ERROR | WordPress.WP.AlternativeFunctions.unlink_unlink | unlink() is discouraged. Use wp_delete_file() to delete a file. |  |

## `providers.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | missing_direct_file_access_protection | PHP file should prevent direct access. Add a check like: if ( ! defined( 'ABSPATH' ) ) exit; | [Docs](https://developer.wordpress.org/plugins/wordpress-org/common-issues/#direct-file-access) |
| 17 | 13 | ERROR | WordPress.WP.AlternativeFunctions.parse_url_parse_url | parse_url() is discouraged because of inconsistency in the output across PHP versions; use wp_parse_url() instead. |  |

## `EmbedPress/Providers/Calendly.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 134 | 28 | ERROR | WordPress.WP.EnqueuedResources.NonEnqueuedScript | Scripts must be registered/enqueued via wp_enqueue_script() |  |
| 135 | 1 | ERROR | WordPress.WP.EnqueuedResources.NonEnqueuedStylesheet | Stylesheets must be registered/enqueued via wp_enqueue_style() |  |
| 135 | 1 | ERROR | PluginCheck.CodeAnalysis.Offloading.OffloadedContent | Offloading images, js, css, and other scripts to your servers or any remote service is disallowed. |  |
| 140 | 1 | ERROR | WordPress.WP.EnqueuedResources.NonEnqueuedStylesheet | Stylesheets must be registered/enqueued via wp_enqueue_style() |  |
| 140 | 1 | ERROR | PluginCheck.CodeAnalysis.Offloading.OffloadedContent | Offloading images, js, css, and other scripts to your servers or any remote service is disallowed. |  |
| 141 | 1 | ERROR | WordPress.WP.EnqueuedResources.NonEnqueuedScript | Scripts must be registered/enqueued via wp_enqueue_script() |  |

## `EmbedPress/Providers/FITE.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 56 | 89 | ERROR | WordPress.WP.EnqueuedResources.NonEnqueuedScript | Scripts must be registered/enqueued via wp_enqueue_script() |  |

## `EmbedPress/Providers/OpenSea.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 253 | 1 | ERROR | WordPress.WP.EnqueuedResources.NonEnqueuedScript | Scripts must be registered/enqueued via wp_enqueue_script() |  |
| 253 | 1 | ERROR | PluginCheck.CodeAnalysis.Offloading.OffloadedContent | Offloading images, js, css, and other scripts to your servers or any remote service is disallowed. |  |

## `EmbedPress/Providers/Wistia.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | missing_direct_file_access_protection | PHP file should prevent direct access. Add a check like: if ( ! defined( 'ABSPATH' ) ) exit; | [Docs](https://developer.wordpress.org/plugins/wordpress-org/common-issues/#direct-file-access) |
| 256 | 18 | ERROR | WordPress.WP.EnqueuedResources.NonEnqueuedScript | Scripts must be registered/enqueued via wp_enqueue_script() |  |

## `EmbedPress/Providers/GooglePhotos.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | missing_direct_file_access_protection | PHP file should prevent direct access. Add a check like: if ( ! defined( 'ABSPATH' ) ) exit; | [Docs](https://developer.wordpress.org/plugins/wordpress-org/common-issues/#direct-file-access) |
| 426 | 22 | ERROR | WordPress.WP.EnqueuedResources.NonEnqueuedScript | Scripts must be registered/enqueued via wp_enqueue_script() |  |
| 480 | 22 | ERROR | WordPress.WP.EnqueuedResources.NonEnqueuedScript | Scripts must be registered/enqueued via wp_enqueue_script() |  |

## `EmbedPress/Includes/Classes/Elementor_Enhancer.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 320 | 26 | ERROR | WordPress.WP.EnqueuedResources.NonEnqueuedScript | Scripts must be registered/enqueued via wp_enqueue_script() |  |

## `EmbedPress/AMP/Adapter/Twitter.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | missing_direct_file_access_protection | PHP file should prevent direct access. Add a check like: if ( ! defined( 'ABSPATH' ) ) exit; | [Docs](https://developer.wordpress.org/plugins/wordpress-org/common-issues/#direct-file-access) |
| 86 | 18 | ERROR | WordPress.WP.EnqueuedResources.NonEnqueuedScript | Scripts must be registered/enqueued via wp_enqueue_script() |  |

## `EmbedPress/AMP/Adapter/Reddit.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | missing_direct_file_access_protection | PHP file should prevent direct access. Add a check like: if ( ! defined( 'ABSPATH' ) ) exit; | [Docs](https://developer.wordpress.org/plugins/wordpress-org/common-issues/#direct-file-access) |
| 93 | 18 | ERROR | WordPress.WP.EnqueuedResources.NonEnqueuedScript | Scripts must be registered/enqueued via wp_enqueue_script() |  |

## `readme.txt` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | license_mismatch | Your plugin has a different license declared in the readme file and plugin header. Please update your readme with a valid GPL license identifier. | [Docs](https://developer.wordpress.org/plugins/wordpress-org/common-issues/#declared-license-mismatched) |

## `Core/AssetManager.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | missing_direct_file_access_protection | PHP file should prevent direct access. Add a check like: if ( ! defined( 'ABSPATH' ) ) exit; | [Docs](https://developer.wordpress.org/plugins/wordpress-org/common-issues/#direct-file-access) |

## `Core/LocalizationManager.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | missing_direct_file_access_protection | PHP file should prevent direct access. Add a check like: if ( ! defined( 'ABSPATH' ) ) exit; | [Docs](https://developer.wordpress.org/plugins/wordpress-org/common-issues/#direct-file-access) |

## `EmbedPress/Loader.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | missing_direct_file_access_protection | PHP file should prevent direct access. Add a check like: if ( ! defined( 'ABSPATH' ) ) exit; | [Docs](https://developer.wordpress.org/plugins/wordpress-org/common-issues/#direct-file-access) |

## `EmbedPress/DisablerLegacy.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | missing_direct_file_access_protection | PHP file should prevent direct access. Add a check like: if ( ! defined( 'ABSPATH' ) ) exit; | [Docs](https://developer.wordpress.org/plugins/wordpress-org/common-issues/#direct-file-access) |

## `EmbedPress/Providers/LinkedIn.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | missing_direct_file_access_protection | PHP file should prevent direct access. Add a check like: if ( ! defined( 'ABSPATH' ) ) exit; | [Docs](https://developer.wordpress.org/plugins/wordpress-org/common-issues/#direct-file-access) |

## `EmbedPress/Gutenberg/BlockManager.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | missing_direct_file_access_protection | PHP file should prevent direct access. Add a check like: if ( ! defined( 'ABSPATH' ) ) exit; | [Docs](https://developer.wordpress.org/plugins/wordpress-org/common-issues/#direct-file-access) |

## `EmbedPress/Includes/Classes/FeatureNotices.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | missing_direct_file_access_protection | PHP file should prevent direct access. Add a check like: if ( ! defined( 'ABSPATH' ) ) exit; | [Docs](https://developer.wordpress.org/plugins/wordpress-org/common-issues/#direct-file-access) |

## `EmbedPress/Includes/Classes/Analytics/Content_Cache_Manager.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | missing_direct_file_access_protection | PHP file should prevent direct access. Add a check like: if ( ! defined( 'ABSPATH' ) ) exit; | [Docs](https://developer.wordpress.org/plugins/wordpress-org/common-issues/#direct-file-access) |

## `EmbedPress/CoreLegacy.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | missing_direct_file_access_protection | PHP file should prevent direct access. Add a check like: if ( ! defined( 'ABSPATH' ) ) exit; | [Docs](https://developer.wordpress.org/plugins/wordpress-org/common-issues/#direct-file-access) |

## `EmbedPress/Elementor/Widgets/Embedpress_Pdf_Gallery.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | missing_direct_file_access_protection | PHP file should prevent direct access. Add a check like: if ( ! defined( 'ABSPATH' ) ) exit; | [Docs](https://developer.wordpress.org/plugins/wordpress-org/common-issues/#direct-file-access) |

## `EmbedPress/Ends/Back/Settings/EmbedpressSettings.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | missing_direct_file_access_protection | PHP file should prevent direct access. Add a check like: if ( ! defined( 'ABSPATH' ) ) exit; | [Docs](https://developer.wordpress.org/plugins/wordpress-org/common-issues/#direct-file-access) |

## `EmbedPress/Ends/Back/Settings/templates/sources.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | missing_direct_file_access_protection | PHP file should prevent direct access. Add a check like: if ( ! defined( 'ABSPATH' ) ) exit; | [Docs](https://developer.wordpress.org/plugins/wordpress-org/common-issues/#direct-file-access) |

## `EmbedPress/Ends/Back/Settings/templates/main-template.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | missing_direct_file_access_protection | PHP file should prevent direct access. Add a check like: if ( ! defined( 'ABSPATH' ) ) exit; | [Docs](https://developer.wordpress.org/plugins/wordpress-org/common-issues/#direct-file-access) |

## `EmbedPress/Ends/Back/Settings/templates/license.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | missing_direct_file_access_protection | PHP file should prevent direct access. Add a check like: if ( ! defined( 'ABSPATH' ) ) exit; | [Docs](https://developer.wordpress.org/plugins/wordpress-org/common-issues/#direct-file-access) |

## `EmbedPress/Ends/Back/Settings/templates/partials/toast-message.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | missing_direct_file_access_protection | PHP file should prevent direct access. Add a check like: if ( ! defined( 'ABSPATH' ) ) exit; | [Docs](https://developer.wordpress.org/plugins/wordpress-org/common-issues/#direct-file-access) |

## `EmbedPress/Ends/Back/Settings/templates/partials/footer.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | missing_direct_file_access_protection | PHP file should prevent direct access. Add a check like: if ( ! defined( 'ABSPATH' ) ) exit; | [Docs](https://developer.wordpress.org/plugins/wordpress-org/common-issues/#direct-file-access) |

## `EmbedPress/Ends/Back/Settings/templates/partials/sidebar.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | missing_direct_file_access_protection | PHP file should prevent direct access. Add a check like: if ( ! defined( 'ABSPATH' ) ) exit; | [Docs](https://developer.wordpress.org/plugins/wordpress-org/common-issues/#direct-file-access) |

## `EmbedPress/Ends/Back/Settings/templates/elements.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | missing_direct_file_access_protection | PHP file should prevent direct access. Add a check like: if ( ! defined( 'ABSPATH' ) ) exit; | [Docs](https://developer.wordpress.org/plugins/wordpress-org/common-issues/#direct-file-access) |

## `EmbedPress/Ends/Back/Handler.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | missing_direct_file_access_protection | PHP file should prevent direct access. Add a check like: if ( ! defined( 'ABSPATH' ) ) exit; | [Docs](https://developer.wordpress.org/plugins/wordpress-org/common-issues/#direct-file-access) |

## `EmbedPress/Analytics/Analytics.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | ERROR | missing_direct_file_access_protection | PHP file should prevent direct access. Add a check like: if ( ! defined( 'ABSPATH' ) ) exit; | [Docs](https://developer.wordpress.org/plugins/wordpress-org/common-issues/#direct-file-access) |
