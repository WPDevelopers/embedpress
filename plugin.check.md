# Plugin Check Report

**Plugin:** EmbedPress
**Generated at:** 2026-04-27 04:39:30


## `tests/e2e/.auth/.gitignore` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | WARNING | hidden_files | Hidden files are not permitted. |  |

## `.gitignore` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | WARNING | hidden_files | Hidden files are not permitted. |  |

## `.distignore` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | WARNING | hidden_files | Hidden files are not permitted. |  |

## `.claude` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | WARNING | ai_instruction_directory | AI instruction directory ".claude" detected. These directories should not be included in production plugins. |  |

## `.github` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | WARNING | github_directory | GitHub workflow directory ".github" detected. This directory should not be included in production plugins. |  |

## `plugin.check.md` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | WARNING | unexpected_markdown_file | Unexpected markdown file "plugin.check.md" detected in plugin root. Only specific markdown files are expected in production plugins. |  |

## `CLAUDE.md` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | WARNING | unexpected_markdown_file | Unexpected markdown file "CLAUDE.md" detected in plugin root. Only specific markdown files are expected in production plugins. |  |

## `EmbedPress/Ends/Back/Handler.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 45 | 20 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 45 | 43 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 63 | 13 | WARNING | Squiz.PHP.DiscouragedFunctions.Discouraged | The use of function set_time_limit() is discouraged |  |
| 71 | 56 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;_nonce&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 71 | 56 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;_nonce&#039;] |  |
| 73 | 53 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;access_token&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 74 | 53 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotValidated | Detected usage of a possibly undefined superglobal array index: $_POST[&#039;account_type&#039;]. Check that the array index exists before using it. |  |
| 74 | 53 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;account_type&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 80 | 53 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;access_token&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 81 | 53 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotValidated | Detected usage of a possibly undefined superglobal array index: $_POST[&#039;account_type&#039;]. Check that the array index exists before using it. |  |
| 81 | 53 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;account_type&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 116 | 13 | WARNING | Squiz.PHP.DiscouragedFunctions.Discouraged | The use of function set_time_limit() is discouraged |  |
| 123 | 56 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;_nonce&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 123 | 56 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;_nonce&#039;] |  |
| 126 | 53 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;access_token&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 127 | 53 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotValidated | Detected usage of a possibly undefined superglobal array index: $_POST[&#039;account_type&#039;]. Check that the array index exists before using it. |  |
| 127 | 53 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;account_type&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 128 | 48 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotValidated | Detected usage of a possibly undefined superglobal array index: $_POST[&#039;user_id&#039;]. Check that the array index exists before using it. |  |
| 128 | 48 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;user_id&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 322 | 13 | WARNING | WordPress.Security.SafeRedirect.wp_redirect_wp_redirect | wp_redirect() found. Using wp_safe_redirect(), along with the &quot;allowed_redirect_hosts&quot; filter if needed, can help avoid any chances of malicious redirects within code. It is also important to remember to call exit() after a redirect so that no other unwanted code is executed. | [Docs](https://developer.wordpress.org/reference/functions/wp_safe_redirect/) |
| 335 | 35 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;_nonce&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 335 | 35 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_GET[&#039;_nonce&#039;] |  |
| 350 | 33 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;access_token&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 350 | 33 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_GET[&#039;access_token&#039;] |  |
| 351 | 34 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotValidated | Detected usage of a possibly undefined superglobal array index: $_GET[&#039;refresh_token&#039;]. Check that the array index exists before using it. |  |
| 351 | 34 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;refresh_token&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 351 | 34 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_GET[&#039;refresh_token&#039;] |  |
| 352 | 31 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotValidated | Detected usage of a possibly undefined superglobal array index: $_GET[&#039;expires_in&#039;]. Check that the array index exists before using it. |  |
| 352 | 31 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;expires_in&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 352 | 31 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_GET[&#039;expires_in&#039;] |  |
| 353 | 31 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotValidated | Detected usage of a possibly undefined superglobal array index: $_GET[&#039;created_at&#039;]. Check that the array index exists before using it. |  |
| 353 | 31 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;created_at&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 353 | 31 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_GET[&#039;created_at&#039;] |  |
| 396 | 31 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;embedepress/calendly_event_data&quot;. |  |
| 400 | 13 | WARNING | WordPress.Security.SafeRedirect.wp_redirect_wp_redirect | wp_redirect() found. Using wp_safe_redirect(), along with the &quot;allowed_redirect_hosts&quot; filter if needed, can help avoid any chances of malicious redirects within code. It is also important to remember to call exit() after a redirect so that no other unwanted code is executed. | [Docs](https://developer.wordpress.org/reference/functions/wp_safe_redirect/) |
| 441 | 26 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 441 | 47 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 441 | 47 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;subject&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 441 | 47 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;subject&#039;] |  |
| 462 | 22 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 462 | 43 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 462 | 43 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;url&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 462 | 43 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_GET[&#039;url&#039;] |  |
| 814 | 56 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;_nonce&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 814 | 56 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;_nonce&#039;] |  |
| 815 | 51 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;user_id&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 815 | 51 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;user_id&#039;] |  |
| 816 | 61 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;account_type&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 816 | 61 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;account_type&#039;] |  |

## `EmbedPress/ThirdParty/Googlecalendar/Embedpress_Google_Helper.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 129 | 13 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;start&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 129 | 13 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;start&#039;] |  |
| 130 | 11 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;end&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 130 | 11 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;end&#039;] |  |
| 135 | 57 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;thisCalendarids&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 135 | 57 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;thisCalendarids&#039;] |  |
| 183 | 30 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;timeZone&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 183 | 30 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;timeZone&#039;] |  |
| 204 | 51 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_SERVER[&#039;HTTP_REFERER&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 204 | 51 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_SERVER[&#039;HTTP_REFERER&#039;] |  |
| 392 | 9 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 392 | 9 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 459 | 14 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 493 | 13 | WARNING | WordPress.Security.SafeRedirect.wp_redirect_wp_redirect | wp_redirect() found. Using wp_safe_redirect(), along with the &quot;allowed_redirect_hosts&quot; filter if needed, can help avoid any chances of malicious redirects within code. It is also important to remember to call exit() after a redirect so that no other unwanted code is executed. | [Docs](https://developer.wordpress.org/reference/functions/wp_safe_redirect/) |
| 746 | 69 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;epgc_deletecache_data&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 746 | 69 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;epgc_deletecache_data&#039;] |  |
| 816 | 72 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;epgc_remove_private_data&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 816 | 72 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;epgc_remove_private_data&#039;] |  |
| 829 | 72 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;epgc_remove_private_data&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 829 | 72 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;epgc_remove_private_data&#039;] |  |
| 865 | 67 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;epgc_authorize_data&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 865 | 67 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;epgc_authorize_data&#039;] |  |
| 881 | 13 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 881 | 48 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 888 | 14 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 900 | 17 | WARNING | WordPress.Security.SafeRedirect.wp_redirect_wp_redirect | wp_redirect() found. Using wp_safe_redirect(), along with the &quot;allowed_redirect_hosts&quot; filter if needed, can help avoid any chances of malicious redirects within code. It is also important to remember to call exit() after a redirect so that no other unwanted code is executed. | [Docs](https://developer.wordpress.org/reference/functions/wp_safe_redirect/) |

## `embedpress.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 1 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.InvalidPrefixPassed | The &quot;embedpress/elementor_enhancer&quot; prefix is not a valid namespace/function/class/variable/constant prefix in PHP. |  |
| 44 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$original_referrer&quot;. |  |
| 48 | 9 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$current_site_url&quot;. |  |
| 49 | 20 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_SERVER[&#039;HTTP_REFERER&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 49 | 20 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_SERVER[&#039;HTTP_REFERER&#039;] |  |
| 50 | 13 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$original_referrer&quot;. |  |
| 50 | 34 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_SERVER[&#039;HTTP_REFERER&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 50 | 34 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_SERVER[&#039;HTTP_REFERER&#039;] |  |
| 93 | 12 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 97 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound | Functions declared in the global namespace by a theme/plugin should start with the theme/plugin prefix. Found: &quot;onPluginActivationCallback&quot;. |  |
| 102 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound | Functions declared in the global namespace by a theme/plugin should start with the theme/plugin prefix. Found: &quot;onPluginDeactivationCallback&quot;. |  |
| 114 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$editor_check&quot;. |  |
| 116 | 11 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 116 | 45 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 116 | 66 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 172 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$is_pro_active&quot;. |  |
| 174 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$is_pro_active&quot;. |  |

## `Core/AssetManager.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 611 | 31 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 611 | 48 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 611 | 48 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;page&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 611 | 48 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_GET[&#039;page&#039;] |  |
| 810 | 27 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 812 | 31 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 813 | 71 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 813 | 71 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;post&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 813 | 71 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_GET[&#039;post&#039;] |  |
| 906 | 31 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 906 | 48 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 906 | 48 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;page&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 906 | 48 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_GET[&#039;page&#039;] |  |

## `Core/LocalizationManager.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 461 | 33 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;plugin_locale&quot;. |  |
| 535 | 23 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_COOKIE[&#039;ep_session_id&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 535 | 23 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_COOKIE[&#039;ep_session_id&#039;] |  |

## `tests/unit/Providers/GoogleMapsTest.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 56 | 16 | WARNING | PluginCheck.CodeAnalysis.ShortURL.Found | Short URL detected (goo.gl). Use full URLs instead of URL shorteners. |  |

## `tests/unit/Providers/GooglePhotosTest.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 46 | 16 | WARNING | PluginCheck.CodeAnalysis.ShortURL.Found | Short URL detected (goo.gl). Use full URLs instead of URL shorteners. |  |

## `EmbedPress/MilestoneNotification.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 249 | 13 | WARNING | WordPress.PHP.DevelopmentFunctions.error_log_error_log | error_log() found. Debug code should not normally be used in production. |  |
| 431 | 13 | WARNING | WordPress.PHP.DevelopmentFunctions.error_log_error_log | error_log() found. Debug code should not normally be used in production. |  |
| 482 | 57 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;nonce&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 482 | 57 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;nonce&#039;] |  |

## `EmbedPress/Shortcode.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 221 | 29 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_COOKIE[&#039;password_correct_&#039; . $client_id] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 221 | 29 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_COOKIE[&#039;password_correct_&#039; . $client_id] |  |
| 524 | 44 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;pp_embed_parsed_content&quot;. |  |
| 846 | 9 | WARNING | WordPress.PHP.DevelopmentFunctions.error_log_var_dump | var_dump() found. Debug code should not normally be used in production. |  |
| 969 | 31 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;embed_apple_podcast&quot;. |  |
| 1366 | 29 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_COOKIE[&#039;password_correct_&#039; . $client_id] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 1366 | 29 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_COOKIE[&#039;password_correct_&#039; . $client_id] |  |

## `EmbedPress/Providers/OpenSea.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 235 | 36 | WARNING | WordPress.PHP.DevelopmentFunctions.error_log_print_r | print_r() found. Debug code should not normally be used in production. |  |
| 385 | 37 | WARNING | WordPress.PHP.DevelopmentFunctions.error_log_print_r | print_r() found. Debug code should not normally be used in production. |  |

## `EmbedPress/Providers/GooglePhotos.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 493 | 31 | WARNING | PluginCheck.CodeAnalysis.ShortURL.Found | Short URL detected (goo.gl). Use full URLs instead of URL shorteners. |  |

## `EmbedPress/Gutenberg/EmbedPressBlockRenderer.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 115 | 17 | WARNING | WordPress.PHP.DevelopmentFunctions.error_log_error_log | error_log() found. Debug code should not normally be used in production. |  |
| 467 | 29 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_COOKIE[&#039;password_correct_&#039; . $client_id] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 467 | 29 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_COOKIE[&#039;password_correct_&#039; . $client_id] |  |
| 993 | 29 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_COOKIE[&#039;password_correct_&#039; . $client_id] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 993 | 29 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_COOKIE[&#039;password_correct_&#039; . $client_id] |  |

## `EmbedPress/Includes/Traits/Shared.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 253 | 92 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotValidated | Detected usage of a possibly undefined superglobal array index: $_SERVER[&#039;REQUEST_URI&#039;]. Check that the array index exists before using it. |  |
| 253 | 136 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotValidated | Detected usage of a possibly undefined superglobal array index: $_SERVER[&#039;REQUEST_URI&#039;]. Check that the array index exists before using it. |  |
| 295 | 27 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;ep_admin_notices&quot;. |  |

## `EmbedPress/Includes/Classes/EmbedPress_Plugin_Usage_Tracker.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 191 | 30 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotValidated | Detected usage of a possibly undefined superglobal array index: $_SERVER[&#039;REQUEST_URI&#039;]. Check that the array index exists before using it. |  |
| 191 | 30 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_SERVER[&#039;REQUEST_URI&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 191 | 30 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_SERVER[&#039;REQUEST_URI&#039;] |  |
| 192 | 30 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotValidated | Detected usage of a possibly undefined superglobal array index: $_SERVER[&#039;REQUEST_URI&#039;]. Check that the array index exists before using it. |  |
| 192 | 30 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_SERVER[&#039;REQUEST_URI&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 192 | 30 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_SERVER[&#039;REQUEST_URI&#039;] |  |
| 382 | 59 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_SERVER[&#039;SERVER_SOFTWARE&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 382 | 59 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_SERVER[&#039;SERVER_SOFTWARE&#039;] |  |
| 533 | 67 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_SERVER[&#039;REMOTE_ADDR&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 533 | 67 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_SERVER[&#039;REMOTE_ADDR&#039;] |  |
| 747 | 67 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 747 | 67 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;plugin&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 747 | 67 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_GET[&#039;plugin&#039;] |  |
| 752 | 27 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;_wpnonce&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 752 | 27 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_GET[&#039;_wpnonce&#039;] |  |
| 756 | 35 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;plugin&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 757 | 35 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;plugin_action&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 806 | 15 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;values&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 806 | 15 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;values&#039;] |  |
| 810 | 36 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;details&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 862 | 34 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;&#039;wpins_form_text_&#039; . $this-&gt;plugin_name&quot;. |  |

## `EmbedPress/Includes/Classes/Database/Analytics_Schema.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 84 | 29 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 84 | 29 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 340 | 23 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 340 | 23 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 342 | 24 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 342 | 24 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 342 | 31 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table used in $wpdb-&gt;get_results()\n$table assigned unsafely at line 339. |  |
| 342 | 43 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;SHOW INDEX FROM $table WHERE Key_name = &#039;unique_page_embed&#039;&quot; |  |
| 353 | 32 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 353 | 32 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 353 | 39 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table used in $wpdb-&gt;get_var()\n$table assigned unsafely at line 339. |  |
| 353 | 47 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;SHOW INDEX FROM $table WHERE Key_name = &#039;unique_page_embed&#039;&quot; |  |
| 355 | 25 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 355 | 25 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 355 | 32 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table used in $wpdb-&gt;query()\n$table assigned unsafely at line 339. |  |
| 355 | 38 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;ALTER TABLE $table DROP INDEX unique_page_embed&quot; |  |
| 355 | 38 | WARNING | WordPress.DB.DirectDatabaseQuery.SchemaChange | Attempting a database schema change is discouraged. |  |
| 357 | 21 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 357 | 21 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 357 | 28 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table used in $wpdb-&gt;query()\n$table assigned unsafely at line 339. |  |
| 357 | 34 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;ALTER TABLE $table ADD UNIQUE KEY unique_page_embed (page_url(191), embed_type(50))&quot; |  |
| 357 | 34 | WARNING | WordPress.DB.DirectDatabaseQuery.SchemaChange | Attempting a database schema change is discouraged. |  |
| 363 | 17 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 363 | 17 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 364 | 28 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table used in $wpdb-&gt;get_var()\n$table assigned unsafely at line 362. |  |
| 364 | 36 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;SHOW INDEX FROM $table WHERE Key_name = &#039;idx_content_id&#039;&quot; |  |
| 365 | 28 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table used in $wpdb-&gt;query()\n$table assigned unsafely at line 362. |  |
| 365 | 34 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;ALTER TABLE $table DROP INDEX idx_content_id&quot; |  |
| 365 | 34 | WARNING | WordPress.DB.DirectDatabaseQuery.SchemaChange | Attempting a database schema change is discouraged. |  |
| 367 | 17 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 367 | 17 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 367 | 24 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table used in $wpdb-&gt;query()\n$table assigned unsafely at line 362. |  |
| 367 | 30 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;ALTER TABLE $table ADD INDEX idx_content_id (content_id(191))&quot; |  |
| 367 | 30 | WARNING | WordPress.DB.DirectDatabaseQuery.SchemaChange | Attempting a database schema change is discouraged. |  |
| 369 | 21 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 369 | 21 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 369 | 28 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table used in $wpdb-&gt;get_var()\n$table assigned unsafely at line 362. |  |
| 369 | 36 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;SHOW INDEX FROM $table WHERE Key_name = &#039;idx_user_id&#039;&quot; |  |
| 370 | 28 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table used in $wpdb-&gt;query()\n$table assigned unsafely at line 362. |  |
| 370 | 34 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;ALTER TABLE $table DROP INDEX idx_user_id&quot; |  |
| 370 | 34 | WARNING | WordPress.DB.DirectDatabaseQuery.SchemaChange | Attempting a database schema change is discouraged. |  |
| 372 | 17 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 372 | 17 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 372 | 24 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table used in $wpdb-&gt;query()\n$table assigned unsafely at line 362. |  |
| 372 | 30 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;ALTER TABLE $table ADD INDEX idx_user_id (user_id(191))&quot; |  |
| 372 | 30 | WARNING | WordPress.DB.DirectDatabaseQuery.SchemaChange | Attempting a database schema change is discouraged. |  |
| 374 | 21 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 374 | 21 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 374 | 28 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table used in $wpdb-&gt;get_var()\n$table assigned unsafely at line 362. |  |
| 374 | 36 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;SHOW INDEX FROM $table WHERE Key_name = &#039;idx_session_id&#039;&quot; |  |
| 375 | 28 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table used in $wpdb-&gt;query()\n$table assigned unsafely at line 362. |  |
| 375 | 34 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;ALTER TABLE $table DROP INDEX idx_session_id&quot; |  |
| 375 | 34 | WARNING | WordPress.DB.DirectDatabaseQuery.SchemaChange | Attempting a database schema change is discouraged. |  |
| 377 | 17 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 377 | 17 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 377 | 24 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table used in $wpdb-&gt;query()\n$table assigned unsafely at line 362. |  |
| 377 | 30 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;ALTER TABLE $table ADD INDEX idx_session_id (session_id(191))&quot; |  |
| 377 | 30 | WARNING | WordPress.DB.DirectDatabaseQuery.SchemaChange | Attempting a database schema change is discouraged. |  |
| 379 | 21 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 379 | 21 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 379 | 28 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table used in $wpdb-&gt;get_var()\n$table assigned unsafely at line 362. |  |
| 379 | 36 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;SHOW INDEX FROM $table WHERE Key_name = &#039;idx_content_interaction&#039;&quot; |  |
| 380 | 28 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table used in $wpdb-&gt;query()\n$table assigned unsafely at line 362. |  |
| 380 | 34 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;ALTER TABLE $table DROP INDEX idx_content_interaction&quot; |  |
| 380 | 34 | WARNING | WordPress.DB.DirectDatabaseQuery.SchemaChange | Attempting a database schema change is discouraged. |  |
| 382 | 17 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 382 | 17 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 382 | 24 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table used in $wpdb-&gt;query()\n$table assigned unsafely at line 362. |  |
| 382 | 30 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;ALTER TABLE $table ADD INDEX idx_content_interaction (content_id(191), interaction_type)&quot; |  |
| 382 | 30 | WARNING | WordPress.DB.DirectDatabaseQuery.SchemaChange | Attempting a database schema change is discouraged. |  |
| 384 | 21 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 384 | 21 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 384 | 28 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table used in $wpdb-&gt;get_var()\n$table assigned unsafely at line 362. |  |
| 384 | 36 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;SHOW INDEX FROM $table WHERE Key_name = &#039;idx_daily_stats&#039;&quot; |  |
| 385 | 28 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table used in $wpdb-&gt;query()\n$table assigned unsafely at line 362. |  |
| 385 | 34 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;ALTER TABLE $table DROP INDEX idx_daily_stats&quot; |  |
| 385 | 34 | WARNING | WordPress.DB.DirectDatabaseQuery.SchemaChange | Attempting a database schema change is discouraged. |  |
| 387 | 17 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 387 | 17 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 387 | 24 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table used in $wpdb-&gt;query()\n$table assigned unsafely at line 362. |  |
| 387 | 30 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;ALTER TABLE $table ADD INDEX idx_daily_stats (content_id(191), interaction_type, created_at)&quot; |  |
| 387 | 30 | WARNING | WordPress.DB.DirectDatabaseQuery.SchemaChange | Attempting a database schema change is discouraged. |  |
| 389 | 21 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 389 | 21 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 389 | 28 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table used in $wpdb-&gt;get_var()\n$table assigned unsafely at line 362. |  |
| 389 | 36 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;SHOW INDEX FROM $table WHERE Key_name = &#039;idx_user_content_interaction&#039;&quot; |  |
| 390 | 28 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table used in $wpdb-&gt;query()\n$table assigned unsafely at line 362. |  |
| 390 | 34 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;ALTER TABLE $table DROP INDEX idx_user_content_interaction&quot; |  |
| 390 | 34 | WARNING | WordPress.DB.DirectDatabaseQuery.SchemaChange | Attempting a database schema change is discouraged. |  |
| 392 | 17 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 392 | 17 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 392 | 24 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table used in $wpdb-&gt;query()\n$table assigned unsafely at line 362. |  |
| 392 | 30 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;ALTER TABLE $table ADD INDEX idx_user_content_interaction (user_id(100), content_id(100), interaction_type)&quot; |  |
| 392 | 30 | WARNING | WordPress.DB.DirectDatabaseQuery.SchemaChange | Attempting a database schema change is discouraged. |  |
| 394 | 21 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 394 | 21 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 394 | 28 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table used in $wpdb-&gt;get_var()\n$table assigned unsafely at line 362. |  |
| 394 | 36 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;SHOW INDEX FROM $table WHERE Key_name = &#039;idx_deduplication&#039;&quot; |  |
| 395 | 28 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table used in $wpdb-&gt;query()\n$table assigned unsafely at line 362. |  |
| 395 | 34 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;ALTER TABLE $table DROP INDEX idx_deduplication&quot; |  |
| 395 | 34 | WARNING | WordPress.DB.DirectDatabaseQuery.SchemaChange | Attempting a database schema change is discouraged. |  |
| 397 | 17 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 397 | 17 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 397 | 24 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table used in $wpdb-&gt;query()\n$table assigned unsafely at line 362. |  |
| 397 | 30 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;ALTER TABLE $table ADD INDEX idx_deduplication (user_id(100), content_id(100), interaction_type, created_at)&quot; |  |
| 397 | 30 | WARNING | WordPress.DB.DirectDatabaseQuery.SchemaChange | Attempting a database schema change is discouraged. |  |
| 402 | 17 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 402 | 17 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 403 | 28 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table used in $wpdb-&gt;get_var()\n$table assigned unsafely at line 401. |  |
| 403 | 36 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;SHOW INDEX FROM $table WHERE Key_name = &#039;unique_user_fingerprint&#039;&quot; |  |
| 404 | 28 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table used in $wpdb-&gt;query()\n$table assigned unsafely at line 401. |  |
| 404 | 34 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;ALTER TABLE $table DROP INDEX unique_user_fingerprint&quot; |  |
| 404 | 34 | WARNING | WordPress.DB.DirectDatabaseQuery.SchemaChange | Attempting a database schema change is discouraged. |  |
| 406 | 17 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 406 | 17 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 406 | 24 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table used in $wpdb-&gt;query()\n$table assigned unsafely at line 401. |  |
| 406 | 30 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;ALTER TABLE $table ADD UNIQUE KEY unique_user_fingerprint (user_id(191), browser_fingerprint(50))&quot; |  |
| 406 | 30 | WARNING | WordPress.DB.DirectDatabaseQuery.SchemaChange | Attempting a database schema change is discouraged. |  |
| 408 | 21 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 408 | 21 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 408 | 28 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table used in $wpdb-&gt;get_var()\n$table assigned unsafely at line 401. |  |
| 408 | 36 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;SHOW INDEX FROM $table WHERE Key_name = &#039;idx_user_id&#039;&quot; |  |
| 409 | 28 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table used in $wpdb-&gt;query()\n$table assigned unsafely at line 401. |  |
| 409 | 34 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;ALTER TABLE $table DROP INDEX idx_user_id&quot; |  |
| 409 | 34 | WARNING | WordPress.DB.DirectDatabaseQuery.SchemaChange | Attempting a database schema change is discouraged. |  |
| 411 | 17 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 411 | 17 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 411 | 24 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table used in $wpdb-&gt;query()\n$table assigned unsafely at line 401. |  |
| 411 | 30 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;ALTER TABLE $table ADD INDEX idx_user_id (user_id(191))&quot; |  |
| 411 | 30 | WARNING | WordPress.DB.DirectDatabaseQuery.SchemaChange | Attempting a database schema change is discouraged. |  |
| 413 | 21 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 413 | 21 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 413 | 28 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table used in $wpdb-&gt;get_var()\n$table assigned unsafely at line 401. |  |
| 413 | 36 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;SHOW INDEX FROM $table WHERE Key_name = &#039;idx_session_id&#039;&quot; |  |
| 414 | 28 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table used in $wpdb-&gt;query()\n$table assigned unsafely at line 401. |  |
| 414 | 34 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;ALTER TABLE $table DROP INDEX idx_session_id&quot; |  |
| 414 | 34 | WARNING | WordPress.DB.DirectDatabaseQuery.SchemaChange | Attempting a database schema change is discouraged. |  |
| 416 | 17 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 416 | 17 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 416 | 24 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table used in $wpdb-&gt;query()\n$table assigned unsafely at line 401. |  |
| 416 | 30 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;ALTER TABLE $table ADD INDEX idx_session_id (session_id(191))&quot; |  |
| 416 | 30 | WARNING | WordPress.DB.DirectDatabaseQuery.SchemaChange | Attempting a database schema change is discouraged. |  |
| 421 | 17 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 421 | 17 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 422 | 28 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table used in $wpdb-&gt;get_var()\n$table assigned unsafely at line 420. |  |
| 422 | 36 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;SHOW INDEX FROM $table WHERE Key_name = &#039;unique_referrer_url&#039;&quot; |  |
| 423 | 28 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table used in $wpdb-&gt;query()\n$table assigned unsafely at line 420. |  |
| 423 | 34 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;ALTER TABLE $table DROP INDEX unique_referrer_url&quot; |  |
| 423 | 34 | WARNING | WordPress.DB.DirectDatabaseQuery.SchemaChange | Attempting a database schema change is discouraged. |  |
| 425 | 17 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 425 | 17 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 425 | 24 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table used in $wpdb-&gt;query()\n$table assigned unsafely at line 420. |  |
| 425 | 30 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;ALTER TABLE $table ADD UNIQUE KEY unique_referrer_url (referrer_url(191))&quot; |  |
| 425 | 30 | WARNING | WordPress.DB.DirectDatabaseQuery.SchemaChange | Attempting a database schema change is discouraged. |  |
| 427 | 21 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 427 | 21 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 427 | 28 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table used in $wpdb-&gt;get_var()\n$table assigned unsafely at line 420. |  |
| 427 | 36 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;SHOW INDEX FROM $table WHERE Key_name = &#039;idx_referrer_domain&#039;&quot; |  |
| 428 | 28 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table used in $wpdb-&gt;query()\n$table assigned unsafely at line 420. |  |
| 428 | 34 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;ALTER TABLE $table DROP INDEX idx_referrer_domain&quot; |  |
| 428 | 34 | WARNING | WordPress.DB.DirectDatabaseQuery.SchemaChange | Attempting a database schema change is discouraged. |  |
| 430 | 17 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 430 | 17 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 430 | 24 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table used in $wpdb-&gt;query()\n$table assigned unsafely at line 420. |  |
| 430 | 30 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;ALTER TABLE $table ADD INDEX idx_referrer_domain (referrer_domain(191))&quot; |  |
| 430 | 30 | WARNING | WordPress.DB.DirectDatabaseQuery.SchemaChange | Attempting a database schema change is discouraged. |  |
| 432 | 21 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 432 | 21 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 432 | 28 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table used in $wpdb-&gt;get_var()\n$table assigned unsafely at line 420. |  |
| 432 | 36 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;SHOW INDEX FROM $table WHERE Key_name = &#039;idx_utm_campaign&#039;&quot; |  |
| 433 | 28 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table used in $wpdb-&gt;query()\n$table assigned unsafely at line 420. |  |
| 433 | 34 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;ALTER TABLE $table DROP INDEX idx_utm_campaign&quot; |  |
| 433 | 34 | WARNING | WordPress.DB.DirectDatabaseQuery.SchemaChange | Attempting a database schema change is discouraged. |  |
| 435 | 17 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 435 | 17 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 435 | 24 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table used in $wpdb-&gt;query()\n$table assigned unsafely at line 420. |  |
| 435 | 30 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;ALTER TABLE $table ADD INDEX idx_utm_campaign (utm_campaign(191))&quot; |  |
| 435 | 30 | WARNING | WordPress.DB.DirectDatabaseQuery.SchemaChange | Attempting a database schema change is discouraged. |  |
| 459 | 13 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 459 | 13 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 459 | 26 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table at &quot;DROP TABLE IF EXISTS $table&quot; |  |
| 459 | 26 | WARNING | WordPress.DB.DirectDatabaseQuery.SchemaChange | Attempting a database schema change is discouraged. |  |
| 497 | 20 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 497 | 20 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 509 | 13 | WARNING | WordPress.PHP.DevelopmentFunctions.error_log_error_log | error_log() found. Debug code should not normally be used in production. |  |

## `EmbedPress/Includes/Classes/EmbedPress_Notice.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 125 | 24 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 125 | 45 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 126 | 28 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 126 | 46 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 244 | 20 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 245 | 44 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 245 | 44 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;plugin&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 249 | 28 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 250 | 59 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 250 | 59 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;plugin_action&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 252 | 28 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 253 | 53 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 253 | 53 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;dismiss&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 255 | 28 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 256 | 51 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 256 | 51 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;later&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 303 | 39 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotValidated | Detected usage of a possibly undefined superglobal array index: $_SERVER[&#039;REQUEST_URI&#039;]. Check that the array index exists before using it. |  |
| 303 | 39 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_SERVER[&#039;REQUEST_URI&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 303 | 39 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_SERVER[&#039;REQUEST_URI&#039;] |  |
| 304 | 39 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotValidated | Detected usage of a possibly undefined superglobal array index: $_SERVER[&#039;REQUEST_URI&#039;]. Check that the array index exists before using it. |  |
| 304 | 39 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_SERVER[&#039;REQUEST_URI&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 304 | 39 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_SERVER[&#039;REQUEST_URI&#039;] |  |
| 549 | 24 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.DynamicHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$this-&gt;do_notice_action&quot;. |  |
| 553 | 24 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.DynamicHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$this-&gt;do_notice_action&quot;. |  |
| 782 | 49 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;dismiss&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 782 | 49 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;dismiss&#039;] |  |
| 783 | 47 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;notice&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 783 | 47 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;notice&#039;] |  |
| 807 | 49 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;dismiss&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 807 | 49 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;dismiss&#039;] |  |

## `EmbedPress/Includes/Classes/Pdf_Thumbnail_Handler.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 137 | 56 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;image_data&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 137 | 56 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;image_data&#039;] |  |
| 138 | 65 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;pdf_url&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 139 | 74 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;file_name&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |

## `EmbedPress/Includes/Classes/EmbedPress_Core_Installer.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 64 | 54 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;slug&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 64 | 54 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;slug&#039;] |  |
| 65 | 54 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;file&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 65 | 54 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;file&#039;] |  |

## `EmbedPress/Includes/Classes/Helper.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 51 | 13 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 53 | 31 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 53 | 31 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;vid&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 287 | 22 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 287 | 65 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 287 | 65 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;client_id&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 288 | 21 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 288 | 63 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 288 | 63 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;password&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 289 | 20 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 289 | 48 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 330 | 22 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 330 | 65 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 330 | 65 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;client_id&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 331 | 21 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 331 | 63 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 331 | 63 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;password&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 332 | 29 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 332 | 79 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 332 | 79 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;content_password&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 410 | 11 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_COOKIE[&#039;password_correct_&#039; . $client_id] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 410 | 11 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_COOKIE[&#039;password_correct_&#039; . $client_id] |  |
| 745 | 91 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;connected_account_type&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 746 | 67 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;hashtag_id&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 747 | 65 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;feed_type&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 748 | 61 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;user_id&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 749 | 71 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;loadmore_key&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 750 | 58 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;_nonce&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 751 | 59 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;params&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 1163 | 14 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 1163 | 32 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |

## `EmbedPress/Includes/Classes/Feature_Enhancer.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 25 | 112 | WARNING | WordPress.WP.EnqueuedResourceParameters.MissingVersion | Resource version not set in call to wp_enqueue_script(). This means new versions of the script may not always be loaded due to browser caching. |  |
| 117 | 59 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;_source_nonce&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 117 | 59 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;_source_nonce&#039;] |  |
| 125 | 47 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;source_url&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 125 | 47 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;source_url&#039;] |  |
| 126 | 42 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;block_id&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 126 | 42 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;block_id&#039;] |  |
| 226 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 226 | 77 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 226 | 77 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;playlistid&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 227 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 227 | 76 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 227 | 76 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;pagetoken&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 228 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 228 | 75 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 228 | 75 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;pagesize&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 229 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 229 | 78 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 229 | 78 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;currentpage&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 230 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 230 | 76 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 230 | 76 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;epcolumns&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 231 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 231 | 76 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 231 | 76 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;showtitle&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 232 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 232 | 77 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 232 | 77 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;showpaging&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 233 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 233 | 75 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 233 | 75 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;autonext&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 234 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 234 | 76 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 234 | 76 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;thumbplay&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 235 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 235 | 84 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 235 | 84 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;thumbnail_quality&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 236 | 28 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 236 | 72 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 236 | 72 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;channelUrl&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 596 | 30 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;emebedpress_get_options&quot;. |  |
| 1402 | 112 | WARNING | WordPress.WP.EnqueuedResourceParameters.MissingVersion | Resource version not set in call to wp_enqueue_script(). This means new versions of the script may not always be loaded due to browser caching. |  |
| 1623 | 14 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 1625 | 36 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 1625 | 36 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;hash&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 1626 | 26 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 1626 | 65 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 1626 | 65 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;unique&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |

## `EmbedPress/Includes/Classes/Analytics/Content_Cache_Manager.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 93 | 30 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotValidated | Detected usage of a possibly undefined superglobal array index: $_POST[&#039;nonce&#039;]. Check that the array index exists before using it. |  |
| 93 | 30 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;nonce&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 93 | 30 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;nonce&#039;] |  |

## `EmbedPress/Includes/Classes/Analytics/REST_API.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 684 | 23 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 684 | 23 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 684 | 30 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table_name used in $wpdb-&gt;get_var()\n$table_name assigned unsafely at line 670. |  |
| 685 | 17 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table_name at &quot;SELECT id FROM $table_name WHERE user_id = %s AND browser_fingerprint = %s&quot; |  |
| 1033 | 28 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 1033 | 28 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 1033 | 35 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $content_table used in $wpdb-&gt;query()\n$content_table assigned unsafely at line 1029. |  |
| 1034 | 13 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $content_table at &quot;DELETE FROM $content_table WHERE embed_type = &#039;unknown&#039; OR embed_type = &#039;&#039;&quot; |  |
| 1038 | 26 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 1038 | 26 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 1038 | 33 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $views_table used in $wpdb-&gt;query()\n$views_table assigned unsafely at line 1030. |  |
| 1039 | 13 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at &quot;DELETE v FROM $views_table v\n |  |
| 1040 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $content_table at LEFT JOIN $content_table c ON v.content_id = c.content_id\n |  |
| 1092 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable {$where_clause} at {$where_clause}\n |  |
| 1138 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable {$where_clause} at {$where_clause}\n |  |
| 1517 | 31 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 1517 | 31 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 1517 | 38 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $views_table used in $wpdb-&gt;query()\n$views_table assigned unsafely at line 1514. |  |
| 1518 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at DELETE v1 FROM $views_table v1\n |  |
| 1519 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at INNER JOIN $views_table v2\n |  |
| 1547 | 31 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 1547 | 31 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 1547 | 38 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $browser_table used in $wpdb-&gt;query()\n$browser_table assigned unsafely at line 1544. |  |
| 1548 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $browser_table at DELETE b1 FROM $browser_table b1\n |  |
| 1549 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $browser_table at INNER JOIN $browser_table b2\n |  |
| 1560 | 31 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 1560 | 31 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 1560 | 38 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $browser_table used in $wpdb-&gt;query()\n$browser_table assigned unsafely at line 1544. |  |
| 1561 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $browser_table at DELETE FROM $browser_table\n |  |

## `EmbedPress/Includes/Classes/Analytics/Data_Collector.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 55 | 21 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_column at &quot;AND DATE($date_column) BETWEEN %s AND %s&quot; |  |
| 66 | 21 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_column at &quot;AND $date_column &gt;= DATE_SUB(NOW(), INTERVAL %d DAY)&quot; |  |
| 112 | 19 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 112 | 19 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 112 | 26 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $sql used in $wpdb-&gt;query()\n$sql assigned unsafely at line 102. |  |
| 155 | 28 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 155 | 28 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 155 | 35 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $views_table used in $wpdb-&gt;get_row()\n$views_table assigned unsafely at line 140. |  |
| 156 | 13 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at &quot;SELECT * FROM $views_table\n |  |
| 209 | 86 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_SERVER[&#039;HTTP_USER_AGENT&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 223 | 19 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 229 | 86 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_SERVER[&#039;HTTP_USER_AGENT&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 284 | 19 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 284 | 19 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 321 | 42 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_SERVER[&#039;HTTP_REFERER&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 333 | 86 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_SERVER[&#039;HTTP_USER_AGENT&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 342 | 19 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 403 | 27 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 403 | 27 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 403 | 34 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table_name used in $wpdb-&gt;get_var()\n$table_name assigned unsafely at line 374. |  |
| 404 | 13 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table_name at &quot;SELECT id FROM $table_name WHERE page_url = %s AND embed_type = %s&quot; |  |
| 432 | 13 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 916 | 19 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 916 | 19 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 916 | 26 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table_name used in $wpdb-&gt;get_var()\n$table_name assigned unsafely at line 913. |  |
| 917 | 13 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table_name at &quot;SELECT id FROM $table_name WHERE session_id = %s&quot; |  |
| 937 | 42 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 937 | 93 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 937 | 93 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;screen_resolution&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 938 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 938 | 75 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 938 | 75 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;language&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 939 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 939 | 75 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 939 | 75 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;timezone&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 942 | 86 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_SERVER[&#039;HTTP_USER_AGENT&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 946 | 9 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 960 | 23 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_SERVER[$key] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 960 | 23 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_SERVER[$key] |  |
| 970 | 49 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_SERVER[&#039;REMOTE_ADDR&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 970 | 49 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_SERVER[&#039;REMOTE_ADDR&#039;] |  |
| 1048 | 17 | WARNING | WordPress.PHP.DevelopmentFunctions.error_log_error_log | error_log() found. Debug code should not normally be used in production. |  |
| 1055 | 17 | WARNING | WordPress.PHP.DevelopmentFunctions.error_log_error_log | error_log() found. Debug code should not normally be used in production. |  |
| 1064 | 17 | WARNING | WordPress.PHP.DevelopmentFunctions.error_log_error_log | error_log() found. Debug code should not normally be used in production. |  |
| 1262 | 25 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 1262 | 25 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 1268 | 21 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 1268 | 21 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 1268 | 28 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $content_table used in $wpdb-&gt;get_results()\n$content_table assigned unsafely at line 1260. |  |
| 1269 | 17 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable {$content_table} at &quot;SELECT content_type, COUNT(*) as cnt FROM {$content_table} GROUP BY content_type&quot; |  |
| 1321 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable {$status_condition} at WHERE {$status_condition} {$post_type_condition}\n |  |
| 1321 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable {$post_type_condition} at WHERE {$status_condition} {$post_type_condition}\n |  |
| 1329 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable {$status_condition} at WHERE {$status_condition} {$post_type_condition}\n |  |
| 1329 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable {$post_type_condition} at WHERE {$status_condition} {$post_type_condition}\n |  |
| 1347 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable {$status_condition} at WHERE {$status_condition} {$post_type_condition}\n |  |
| 1347 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable {$post_type_condition} at WHERE {$status_condition} {$post_type_condition}\n |  |
| 1505 | 28 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 1505 | 28 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 1505 | 35 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $views_table used in $wpdb-&gt;get_var()\n$views_table assigned unsafely at line 1501. |  |
| 1506 | 13 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at &quot;SELECT COUNT(*) FROM $views_table WHERE interaction_type = &#039;view&#039; $date_condition&quot; |  |
| 1506 | 13 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_condition at &quot;SELECT COUNT(*) FROM $views_table WHERE interaction_type = &#039;view&#039; $date_condition&quot; |  |
| 1510 | 28 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 1510 | 28 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 1510 | 35 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $views_table used in $wpdb-&gt;get_var()\n$views_table assigned unsafely at line 1501. |  |
| 1512 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at FROM $views_table\n |  |
| 1513 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_condition at WHERE (interaction_type = &#039;combined&#039; OR interaction_type = &#039;&#039; OR interaction_type IS NULL) $date_condition&quot; |  |
| 1519 | 24 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 1519 | 24 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 1519 | 31 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $views_table used in $wpdb-&gt;get_results()\n$views_table assigned unsafely at line 1501. |  |
| 1524 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at FROM $views_table\n |  |
| 1525 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_condition at WHERE interaction_type IN (&#039;view&#039;, &#039;combined&#039;, &#039;&#039;) OR interaction_type IS NULL $date_condition\n |  |
| 1558 | 21 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 1558 | 21 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 1558 | 28 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table_name used in $wpdb-&gt;get_results()\n$table_name assigned unsafely at line 1554. |  |
| 1560 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table_name at FROM $table_name\n |  |
| 1562 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_condition at $date_condition\n |  |
| 1569 | 15 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 1569 | 15 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 1569 | 22 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table_name used in $wpdb-&gt;get_results()\n$table_name assigned unsafely at line 1554. |  |
| 1571 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table_name at FROM $table_name\n |  |
| 1573 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_condition at $date_condition\n |  |
| 1580 | 20 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 1580 | 20 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 1580 | 27 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table_name used in $wpdb-&gt;get_results()\n$table_name assigned unsafely at line 1554. |  |
| 1582 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table_name at FROM $table_name\n |  |
| 1584 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_condition at $date_condition\n |  |
| 1617 | 22 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 1617 | 22 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 1617 | 29 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $views_table used in $wpdb-&gt;get_var()\n$views_table assigned unsafely at line 1606. |  |
| 1620 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at FROM $views_table\n |  |
| 1622 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_condition at $date_condition\n |  |
| 1628 | 22 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 1628 | 22 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 1628 | 29 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $views_table used in $wpdb-&gt;get_var()\n$views_table assigned unsafely at line 1606. |  |
| 1631 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at FROM $views_table v\n |  |
| 1632 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $content_table at INNER JOIN $content_table c ON v.content_id = c.content_id\n |  |
| 1633 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_condition_views at WHERE (v.interaction_type IN (&#039;view&#039;, &#039;impression&#039;, &#039;combined&#039;) OR v.interaction_type = &#039;&#039; OR v.interaction_type IS NULL) $date_condition_views AND c.content_type = %s\n |  |
| 1661 | 22 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 1661 | 22 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 1661 | 29 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $views_table used in $wpdb-&gt;get_var()\n$views_table assigned unsafely at line 1651. |  |
| 1663 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at FROM $views_table\n |  |
| 1665 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_condition at $date_condition&quot; |  |
| 1669 | 22 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 1669 | 22 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 1669 | 29 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $views_table used in $wpdb-&gt;get_var()\n$views_table assigned unsafely at line 1651. |  |
| 1671 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at FROM $views_table v\n |  |
| 1672 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $content_table at INNER JOIN $content_table c ON v.content_id = c.content_id\n |  |
| 1673 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_condition_views at WHERE (v.interaction_type IN (&#039;view&#039;, &#039;impression&#039;, &#039;combined&#039;) OR v.interaction_type = &#039;&#039; OR v.interaction_type IS NULL) $date_condition_views AND c.content_type = %s&quot; |  |
| 1700 | 20 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 1700 | 20 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 1700 | 27 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $content_table used in $wpdb-&gt;get_results()\n$content_table assigned unsafely at line 1697. |  |
| 1709 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $content_table at FROM $content_table c\n |  |
| 1710 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at LEFT JOIN $views_table v ON c.content_id = v.content_id\n |  |
| 1712 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_condition at $date_condition\n |  |
| 1745 | 22 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 1745 | 22 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 1745 | 29 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $browser_table used in $wpdb-&gt;get_results()\n$browser_table assigned unsafely at line 1739. |  |
| 1750 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $browser_table at FROM $browser_table b\n |  |
| 1751 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at INNER JOIN $views_table v ON (\n |  |
| 1756 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_condition at WHERE 1=1 $date_condition\n |  |
| 1765 | 19 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 1765 | 19 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 1765 | 26 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $browser_table used in $wpdb-&gt;get_results()\n$browser_table assigned unsafely at line 1739. |  |
| 1770 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $browser_table at FROM $browser_table b\n |  |
| 1771 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at INNER JOIN $views_table v ON (\n |  |
| 1776 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_condition at WHERE 1=1 $date_condition\n |  |
| 1825 | 20 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 1825 | 20 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 1825 | 27 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $browser_table used in $wpdb-&gt;get_results()\n$browser_table assigned unsafely at line 1821. |  |
| 1829 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $browser_table at FROM $browser_table\n |  |
| 1831 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_condition at $date_condition\n |  |
| 1838 | 24 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 1838 | 24 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 1838 | 31 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $browser_table used in $wpdb-&gt;get_results()\n$browser_table assigned unsafely at line 1821. |  |
| 1842 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $browser_table at FROM $browser_table\n |  |
| 1844 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_condition at $date_condition\n |  |
| 1884 | 22 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 1884 | 22 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 1884 | 29 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $views_table used in $wpdb-&gt;get_results()\n$views_table assigned unsafely at line 1881. |  |
| 1897 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at FROM $views_table\n |  |
| 1899 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_condition at $date_condition\n |  |
| 1934 | 25 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 1934 | 25 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 1934 | 32 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $content_table used in $wpdb-&gt;get_var()\n$content_table assigned unsafely at line 1930. |  |
| 1935 | 13 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $content_table at &quot;SELECT SUM(total_clicks) FROM $content_table&quot; |  |
| 1941 | 33 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 1941 | 33 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 1941 | 40 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $views_table used in $wpdb-&gt;get_var()\n$views_table assigned unsafely at line 1931. |  |
| 1942 | 17 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at &quot;SELECT COUNT(*) FROM $views_table WHERE interaction_type = &#039;click&#039;&quot; |  |
| 1946 | 33 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 1946 | 33 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 1946 | 40 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $views_table used in $wpdb-&gt;get_var()\n$views_table assigned unsafely at line 1931. |  |
| 1948 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at FROM $views_table\n |  |
| 1972 | 30 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 1972 | 30 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 1972 | 37 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $content_table used in $wpdb-&gt;get_var()\n$content_table assigned unsafely at line 1968. |  |
| 1973 | 13 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $content_table at &quot;SELECT SUM(total_impressions) FROM $content_table&quot; |  |
| 1979 | 38 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 1979 | 38 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 1979 | 45 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $views_table used in $wpdb-&gt;get_var()\n$views_table assigned unsafely at line 1969. |  |
| 1980 | 17 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at &quot;SELECT COUNT(*) FROM $views_table WHERE interaction_type = &#039;impression&#039;&quot; |  |
| 1984 | 38 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 1984 | 38 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 1984 | 45 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $views_table used in $wpdb-&gt;get_var()\n$views_table assigned unsafely at line 1969. |  |
| 1986 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at FROM $views_table\n |  |
| 2010 | 26 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 2010 | 26 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 2010 | 33 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $views_table used in $wpdb-&gt;get_results()\n$views_table assigned unsafely at line 2007. |  |
| 2016 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at FROM $views_table\n |  |
| 2028 | 24 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 2028 | 24 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 2074 | 25 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 2074 | 25 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 2074 | 32 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $views_table used in $wpdb-&gt;get_results()\n$views_table assigned unsafely at line 2067. |  |
| 2079 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at FROM $views_table\n |  |
| 2080 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_condition at WHERE interaction_type IN (&#039;click&#039;, &#039;combined&#039;) $date_condition\n |  |
| 2087 | 32 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 2087 | 32 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 2087 | 39 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $content_table used in $wpdb-&gt;get_results()\n$content_table assigned unsafely at line 2066. |  |
| 2089 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $content_table at FROM $content_table\n |  |
| 2120 | 30 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 2120 | 30 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 2120 | 37 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $views_table used in $wpdb-&gt;get_results()\n$views_table assigned unsafely at line 2113. |  |
| 2125 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at FROM $views_table\n |  |
| 2126 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_condition at WHERE interaction_type IN (&#039;impression&#039;, &#039;combined&#039;) $date_condition\n |  |
| 2197 | 32 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 2197 | 32 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 2197 | 39 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $views_table used in $wpdb-&gt;get_var()\n$views_table assigned unsafely at line 2175. |  |
| 2198 | 17 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at &quot;SELECT COUNT(*) FROM $views_table WHERE interaction_type = &#039;view&#039; $date_condition&quot; |  |
| 2198 | 17 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_condition at &quot;SELECT COUNT(*) FROM $views_table WHERE interaction_type = &#039;view&#039; $date_condition&quot; |  |
| 2200 | 33 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 2200 | 33 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 2200 | 40 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $views_table used in $wpdb-&gt;get_var()\n$views_table assigned unsafely at line 2175. |  |
| 2201 | 17 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at &quot;SELECT COUNT(*) FROM $views_table WHERE interaction_type = &#039;click&#039; $date_condition&quot; |  |
| 2201 | 17 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_condition at &quot;SELECT COUNT(*) FROM $views_table WHERE interaction_type = &#039;click&#039; $date_condition&quot; |  |
| 2203 | 38 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 2203 | 38 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 2203 | 45 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $views_table used in $wpdb-&gt;get_var()\n$views_table assigned unsafely at line 2175. |  |
| 2204 | 17 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at &quot;SELECT COUNT(*) FROM $views_table WHERE interaction_type = &#039;impression&#039; $date_condition&quot; |  |
| 2204 | 17 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_condition at &quot;SELECT COUNT(*) FROM $views_table WHERE interaction_type = &#039;impression&#039; $date_condition&quot; |  |
| 2208 | 32 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 2208 | 32 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 2208 | 39 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $views_table used in $wpdb-&gt;get_var()\n$views_table assigned unsafely at line 2175. |  |
| 2210 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at FROM $views_table WHERE (interaction_type = &#039;combined&#039; OR interaction_type = &#039;&#039; OR interaction_type IS NULL) $date_condition&quot; |  |
| 2210 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_condition at FROM $views_table WHERE (interaction_type = &#039;combined&#039; OR interaction_type = &#039;&#039; OR interaction_type IS NULL) $date_condition&quot; |  |
| 2212 | 33 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 2212 | 33 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 2212 | 40 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $views_table used in $wpdb-&gt;get_var()\n$views_table assigned unsafely at line 2175. |  |
| 2214 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at FROM $views_table WHERE (interaction_type = &#039;combined&#039; OR interaction_type = &#039;&#039; OR interaction_type IS NULL) $date_condition&quot; |  |
| 2214 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_condition at FROM $views_table WHERE (interaction_type = &#039;combined&#039; OR interaction_type = &#039;&#039; OR interaction_type IS NULL) $date_condition&quot; |  |
| 2216 | 38 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 2216 | 38 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 2216 | 45 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $views_table used in $wpdb-&gt;get_var()\n$views_table assigned unsafely at line 2175. |  |
| 2218 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at FROM $views_table WHERE (interaction_type = &#039;combined&#039; OR interaction_type = &#039;&#039; OR interaction_type IS NULL) $date_condition&quot; |  |
| 2218 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_condition at FROM $views_table WHERE (interaction_type = &#039;combined&#039; OR interaction_type = &#039;&#039; OR interaction_type IS NULL) $date_condition&quot; |  |
| 2228 | 32 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 2228 | 32 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 2228 | 39 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $views_table used in $wpdb-&gt;get_var()\n$views_table assigned unsafely at line 2175. |  |
| 2229 | 17 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at &quot;SELECT COUNT(*) FROM $views_table v\n |  |
| 2230 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $content_table at INNER JOIN $content_table c ON v.content_id = c.content_id\n |  |
| 2231 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_condition_views at WHERE v.interaction_type = &#039;view&#039; $date_condition_views AND c.content_type = %s&quot; |  |
| 2234 | 33 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 2234 | 33 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 2234 | 40 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $views_table used in $wpdb-&gt;get_var()\n$views_table assigned unsafely at line 2175. |  |
| 2235 | 17 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at &quot;SELECT COUNT(*) FROM $views_table v\n |  |
| 2236 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $content_table at INNER JOIN $content_table c ON v.content_id = c.content_id\n |  |
| 2237 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_condition_views at WHERE v.interaction_type = &#039;click&#039; $date_condition_views AND c.content_type = %s&quot; |  |
| 2240 | 38 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 2240 | 38 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 2240 | 45 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $views_table used in $wpdb-&gt;get_var()\n$views_table assigned unsafely at line 2175. |  |
| 2241 | 17 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at &quot;SELECT COUNT(*) FROM $views_table v\n |  |
| 2242 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $content_table at INNER JOIN $content_table c ON v.content_id = c.content_id\n |  |
| 2243 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_condition_views at WHERE v.interaction_type = &#039;impression&#039; $date_condition_views AND c.content_type = %s&quot; |  |
| 2248 | 32 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 2248 | 32 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 2248 | 39 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $views_table used in $wpdb-&gt;get_var()\n$views_table assigned unsafely at line 2175. |  |
| 2250 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at FROM $views_table v\n |  |
| 2251 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $content_table at INNER JOIN $content_table c ON v.content_id = c.content_id\n |  |
| 2252 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_condition_views at WHERE (v.interaction_type = &#039;combined&#039; OR v.interaction_type = &#039;&#039; OR v.interaction_type IS NULL) $date_condition_views AND c.content_type = %s&quot; |  |
| 2255 | 33 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 2255 | 33 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 2255 | 40 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $views_table used in $wpdb-&gt;get_var()\n$views_table assigned unsafely at line 2175. |  |
| 2257 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at FROM $views_table v\n |  |
| 2258 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $content_table at INNER JOIN $content_table c ON v.content_id = c.content_id\n |  |
| 2259 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_condition_views at WHERE (v.interaction_type = &#039;combined&#039; OR v.interaction_type = &#039;&#039; OR v.interaction_type IS NULL) $date_condition_views AND c.content_type = %s&quot; |  |
| 2262 | 38 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 2262 | 38 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 2262 | 45 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $views_table used in $wpdb-&gt;get_var()\n$views_table assigned unsafely at line 2175. |  |
| 2264 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at FROM $views_table v\n |  |
| 2265 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $content_table at INNER JOIN $content_table c ON v.content_id = c.content_id\n |  |
| 2266 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_condition_views at WHERE (v.interaction_type = &#039;combined&#039; OR v.interaction_type = &#039;&#039; OR v.interaction_type IS NULL) $date_condition_views AND c.content_type = %s&quot; |  |
| 2314 | 24 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 2314 | 24 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 2314 | 31 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $content_table used in $wpdb-&gt;get_var()\n$content_table assigned unsafely at line 2310. |  |
| 2315 | 13 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $content_table at &quot;SELECT SUM(total_views) FROM $content_table&quot; |  |
| 2321 | 32 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 2321 | 32 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 2321 | 39 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $views_table used in $wpdb-&gt;get_var()\n$views_table assigned unsafely at line 2311. |  |
| 2322 | 17 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at &quot;SELECT COUNT(*) FROM $views_table WHERE interaction_type = &#039;view&#039;&quot; |  |
| 2326 | 32 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 2326 | 32 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 2326 | 39 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $views_table used in $wpdb-&gt;get_var()\n$views_table assigned unsafely at line 2311. |  |
| 2328 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at FROM $views_table\n |  |
| 2349 | 18 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 2349 | 18 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 2349 | 25 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $content_table used in $wpdb-&gt;get_var()\n$content_table assigned unsafely at line 2347. |  |
| 2350 | 13 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $content_table at &quot;SELECT COUNT(*) FROM $content_table&quot; |  |
| 2380 | 20 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 2380 | 20 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 2380 | 27 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $content_table used in $wpdb-&gt;get_results()\n$content_table assigned unsafely at line 2377. |  |
| 2381 | 13 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $content_table at &quot;SELECT id, page_url, post_id, content_type FROM $content_table\n |  |
| 2408 | 23 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 2408 | 23 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 2446 | 24 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 2446 | 24 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 2446 | 31 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $views_table used in $wpdb-&gt;get_var()\n$views_table assigned unsafely at line 2442. |  |
| 2446 | 39 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at &quot;SELECT COUNT(*) FROM $views_table&quot; |  |
| 2447 | 31 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 2447 | 31 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 2447 | 38 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $browser_table used in $wpdb-&gt;get_var()\n$browser_table assigned unsafely at line 2443. |  |
| 2447 | 46 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $browser_table at &quot;SELECT COUNT(*) FROM $browser_table&quot; |  |
| 2450 | 25 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 2450 | 25 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 2450 | 32 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $views_table used in $wpdb-&gt;get_var()\n$views_table assigned unsafely at line 2442. |  |
| 2450 | 40 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at &quot;SELECT COUNT(DISTINCT user_id) FROM $views_table WHERE user_id IS NOT NULL&quot; |  |
| 2451 | 40 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 2451 | 40 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 2451 | 47 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $browser_table used in $wpdb-&gt;get_var()\n$browser_table assigned unsafely at line 2443. |  |
| 2451 | 55 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $browser_table at &quot;SELECT COUNT(DISTINCT browser_fingerprint) FROM $browser_table WHERE browser_fingerprint IS NOT NULL&quot; |  |
| 2454 | 38 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 2454 | 38 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 2454 | 45 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $views_table used in $wpdb-&gt;get_var()\n$views_table assigned unsafely at line 2442. |  |
| 2457 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at FROM $views_table\n |  |
| 2464 | 45 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 2464 | 45 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 2464 | 52 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $browser_table used in $wpdb-&gt;get_var()\n$browser_table assigned unsafely at line 2443. |  |
| 2467 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $browser_table at FROM $browser_table\n |  |
| 2570 | 30 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 2570 | 30 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 2570 | 37 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $referrers_table used in $wpdb-&gt;get_row()\n$referrers_table assigned unsafely at line 2564. |  |
| 2571 | 13 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $referrers_table at &quot;SELECT * FROM $referrers_table WHERE referrer_url = %s LIMIT 1&quot; |  |
| 2705 | 19 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 2786 | 25 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 2786 | 25 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 2786 | 32 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $referrers_table used in $wpdb-&gt;get_var()\n$referrers_table assigned unsafely at line 2783. |  |
| 2787 | 13 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $referrers_table at &quot;SELECT referrer_url FROM $referrers_table WHERE id = %d&quot; |  |
| 2796 | 33 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 2796 | 33 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 2796 | 40 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $views_table used in $wpdb-&gt;get_var()\n$views_table assigned unsafely at line 2782. |  |
| 2797 | 13 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at &quot;SELECT COUNT(*) FROM $views_table\n |  |
| 2857 | 42 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_SERVER[&#039;HTTP_REFERER&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 2895 | 22 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 2895 | 22 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 2895 | 29 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $referrers_table used in $wpdb-&gt;get_results()\n$referrers_table assigned unsafely at line 2878. |  |
| 2912 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $referrers_table at FROM $referrers_table\n |  |
| 2913 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_condition at WHERE 1=1 $date_condition\n |  |
| 2914 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $order_by at ORDER BY $order_by DESC, id DESC\n |  |
| 2920 | 19 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 2920 | 19 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 2920 | 26 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $referrers_table used in $wpdb-&gt;get_row()\n$referrers_table assigned unsafely at line 2878. |  |
| 2926 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $referrers_table at FROM $referrers_table\n |  |
| 2927 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_condition at WHERE 1=1 $date_condition&quot; |  |
| 2932 | 24 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 2932 | 24 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 2932 | 31 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $referrers_table used in $wpdb-&gt;get_results()\n$referrers_table assigned unsafely at line 2878. |  |
| 2939 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $referrers_table at FROM $referrers_table\n |  |
| 2940 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_condition at WHERE 1=1 $date_condition\n |  |

## `EmbedPress/Includes/Classes/Analytics/License_Manager.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 202 | 18 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 202 | 18 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 202 | 25 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $content_table used in $wpdb-&gt;get_var()\n$content_table assigned unsafely at line 200. |  |
| 202 | 33 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $content_table at &quot;SELECT COUNT(*) FROM $content_table&quot; |  |

## `EmbedPress/Includes/Classes/Analytics/Pro_Data_Collector.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 41 | 21 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_column at &quot;AND DATE($date_column) BETWEEN %s AND %s&quot; |  |
| 52 | 21 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_column at &quot;AND $date_column &gt;= DATE_SUB(NOW(), INTERVAL %d DAY)&quot; |  |
| 120 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $content_table at FROM $content_table c\n |  |
| 123 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at FROM $views_table\n |  |
| 124 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $subquery_date_condition at WHERE 1=1 $subquery_date_condition\n |  |
| 130 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at FROM $views_table\n |  |
| 131 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $subquery_date_condition at WHERE (interaction_type = &#039;view&#039; OR interaction_type = &#039;combined&#039; OR interaction_type = &#039;&#039; OR interaction_type IS NULL) $subquery_date_condition\n |  |
| 138 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at FROM $views_table\n |  |
| 139 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $subquery_date_condition at WHERE (interaction_type = &#039;click&#039; OR interaction_type = &#039;combined&#039; OR interaction_type = &#039;&#039; OR interaction_type IS NULL) $subquery_date_condition\n |  |
| 146 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at FROM $views_table\n |  |
| 147 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $subquery_date_condition at WHERE (interaction_type = &#039;impression&#039; OR interaction_type = &#039;combined&#039; OR interaction_type = &#039;&#039; OR interaction_type IS NULL) $subquery_date_condition\n |  |
| 150 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $order_by_clause at ORDER BY $order_by_clause DESC\n |  |
| 151 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $limit_clause at $limit_clause&quot; |  |
| 156 | 20 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 156 | 20 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 156 | 27 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $content_table used in $wpdb-&gt;get_results()\n$content_table assigned unsafely at line 89. |  |
| 167 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $content_table at FROM $content_table c\n |  |
| 172 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at FROM $views_table\n |  |
| 180 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at FROM $views_table\n |  |
| 188 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at FROM $views_table\n |  |
| 193 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $limit_clause at $limit_clause&quot; |  |
| 214 | 16 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 214 | 16 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 214 | 23 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $content_table used in $wpdb-&gt;get_results()\n$content_table assigned unsafely at line 211. |  |
| 226 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $content_table at FROM $content_table c\n |  |
| 227 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at LEFT JOIN $views_table v ON c.content_id = v.content_id\n |  |
| 229 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_condition at $date_condition\n |  |
| 257 | 22 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 257 | 22 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 257 | 29 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $browser_table used in $wpdb-&gt;get_results()\n$browser_table assigned unsafely at line 252. |  |
| 268 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $browser_table at FROM $browser_table b\n |  |
| 269 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at INNER JOIN $views_table v ON (\n |  |
| 274 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_condition at WHERE 1=1 $date_condition\n |  |
| 282 | 19 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 282 | 19 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 282 | 26 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $browser_table used in $wpdb-&gt;get_results()\n$browser_table assigned unsafely at line 252. |  |
| 287 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $browser_table at FROM $browser_table b\n |  |
| 288 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at INNER JOIN $views_table v ON (\n |  |
| 293 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_condition at WHERE 1=1 $date_condition\n |  |
| 332 | 25 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 332 | 25 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 332 | 32 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $views_table used in $wpdb-&gt;get_var()\n$views_table assigned unsafely at line 326. |  |
| 333 | 17 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at &quot;SELECT COUNT(*) FROM $views_table WHERE 1=1 $date_condition&quot; |  |
| 333 | 17 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_condition at &quot;SELECT COUNT(*) FROM $views_table WHERE 1=1 $date_condition&quot; |  |
| 370 | 25 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 370 | 25 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 370 | 32 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $views_table used in $wpdb-&gt;get_results()\n$views_table assigned unsafely at line 326. |  |
| 380 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at FROM $views_table\n |  |
| 478 | 20 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 478 | 20 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 478 | 27 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $browser_table used in $wpdb-&gt;get_results()\n$browser_table assigned unsafely at line 473. |  |
| 483 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $browser_table at FROM $browser_table b\n |  |
| 484 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at INNER JOIN $views_table v ON (\n |  |
| 489 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_condition at WHERE 1=1 $date_condition\n |  |
| 496 | 24 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 496 | 24 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 496 | 31 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $browser_table used in $wpdb-&gt;get_results()\n$browser_table assigned unsafely at line 473. |  |
| 500 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $browser_table at FROM $browser_table b\n |  |
| 501 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at INNER JOIN $views_table v ON b.session_id = v.session_id\n |  |
| 503 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_condition at $date_condition\n |  |
| 538 | 20 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 538 | 20 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 538 | 27 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $views_table used in $wpdb-&gt;get_results()\n$views_table assigned unsafely at line 535. |  |
| 554 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at FROM $views_table\n |  |
| 556 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_condition at $date_condition\n |  |
| 664 | 21 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 664 | 21 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 664 | 28 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table_name used in $wpdb-&gt;get_results()\n$table_name assigned unsafely at line 660. |  |
| 666 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table_name at FROM $table_name\n |  |
| 668 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_condition at $date_condition\n |  |
| 675 | 15 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 675 | 15 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 675 | 22 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table_name used in $wpdb-&gt;get_results()\n$table_name assigned unsafely at line 660. |  |
| 677 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table_name at FROM $table_name\n |  |
| 679 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_condition at $date_condition\n |  |
| 686 | 20 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 686 | 20 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 686 | 27 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table_name used in $wpdb-&gt;get_results()\n$table_name assigned unsafely at line 660. |  |
| 688 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table_name at FROM $table_name\n |  |
| 690 | 1 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $date_condition at $date_condition\n |  |

## `EmbedPress/Includes/Classes/Analytics/Milestone_Manager.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 55 | 24 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 55 | 24 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 55 | 31 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $content_table used in $wpdb-&gt;get_var()\n$content_table assigned unsafely at line 54. |  |
| 55 | 39 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $content_table at &quot;SELECT SUM(total_views) FROM $content_table&quot; |  |
| 79 | 25 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 79 | 25 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 79 | 32 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $content_table used in $wpdb-&gt;get_var()\n$content_table assigned unsafely at line 78. |  |
| 79 | 40 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $content_table at &quot;SELECT COUNT(*) FROM $content_table&quot; |  |
| 105 | 24 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 105 | 24 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 105 | 31 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $views_table used in $wpdb-&gt;get_var() |  |
| 106 | 13 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at &quot;SELECT COUNT(*) FROM $views_table \n |  |
| 135 | 26 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 135 | 26 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 135 | 33 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $views_table used in $wpdb-&gt;get_var() |  |
| 136 | 13 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $views_table at &quot;SELECT COUNT(*) FROM $views_table \n |  |
| 176 | 19 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 176 | 19 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 176 | 26 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table_name used in $wpdb-&gt;get_var()\n$table_name assigned unsafely at line 165. |  |
| 177 | 13 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table_name at &quot;SELECT id FROM $table_name WHERE $where_clause&quot; |  |
| 177 | 13 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $where_clause at &quot;SELECT id FROM $table_name WHERE $where_clause&quot; |  |
| 177 | 61 | WARNING | WordPress.DB.PreparedSQLPlaceholders.UnfinishedPrepare | Replacement variables found, but no valid placeholders found in the query. |  |
| 205 | 9 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 286 | 32 | WARNING | WordPress.DB.DirectDatabaseQuery.DirectQuery | Use of a direct database call is discouraged. |  |
| 286 | 32 | WARNING | WordPress.DB.DirectDatabaseQuery.NoCaching | Direct database call without caching detected. Consider using wp_cache_get() / wp_cache_set() or wp_cache_delete(). |  |
| 286 | 39 | WARNING | PluginCheck.Security.DirectDB.UnescapedDBParameter | Unescaped parameter $table_name used in $wpdb-&gt;get_results()\n$table_name assigned unsafely at line 283. |  |
| 287 | 13 | WARNING | WordPress.DB.PreparedSQL.InterpolatedNotPrepared | Use placeholders and $wpdb-&gt;prepare(); found interpolated variable $table_name at &quot;SELECT * FROM $table_name \n |  |

## `EmbedPress/Includes/Classes/Analytics/Browser_Detector.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 34 | 82 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_SERVER[&#039;HTTP_USER_AGENT&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 34 | 82 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_SERVER[&#039;HTTP_USER_AGENT&#039;] |  |

## `EmbedPress/Includes/Classes/FeatureNoticeManager.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 224 | 9 | WARNING | WordPress.PHP.DevelopmentFunctions.error_log_error_log | error_log() found. Debug code should not normally be used in production. |  |
| 224 | 19 | WARNING | WordPress.PHP.DevelopmentFunctions.error_log_print_r | print_r() found. Debug code should not normally be used in production. |  |
| 276 | 71 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;notice_id&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 298 | 71 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;notice_id&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 321 | 71 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;notice_id&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |

## `EmbedPress/Elementor/Widgets/Embedpress_Pdf.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 1017 | 19 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;extend_elementor_controls&quot;. |  |
| 1235 | 101 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_COOKIE[&#039;password_correct_&#039; . $client_id] not unslashed before sanitization. Use wp_unslash() or similar |  |

## `EmbedPress/Elementor/Widgets/Embedpress_Elementor.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 454 | 19 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;extend_elementor_controls&quot;. |  |
| 701 | 19 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;extend_customplayer_controls&quot;. |  |
| 4629 | 96 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_COOKIE[&#039;password_correct_&#039; . $client_id] not unslashed before sanitization. Use wp_unslash() or similar |  |

## `EmbedPress/Elementor/Widgets/Embedpress_Document.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 474 | 19 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;extend_elementor_controls&quot;. |  |
| 669 | 101 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_COOKIE[&#039;password_correct_&#039; . $client_id] not unslashed before sanitization. Use wp_unslash() or similar |  |

## `EmbedPress/Ends/Back/Settings/EmbedpressSettings.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 63 | 14 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 63 | 32 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 158 | 36 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 168 | 14 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 168 | 41 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 201 | 52 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;_wpnonce&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 201 | 52 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;_wpnonce&#039;] |  |
| 206 | 65 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;element_type&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 207 | 65 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;element_name&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 208 | 43 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;checked&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 208 | 43 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;checked&#039;] |  |
| 326 | 25 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 326 | 62 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 326 | 62 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;page&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 331 | 22 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 331 | 64 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 331 | 64 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;page_type&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 393 | 9 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$page_slug&quot;. |  |
| 394 | 9 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$template&quot;. |  |
| 394 | 22 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 394 | 63 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 394 | 63 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;page_type&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 396 | 9 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$nonce_field&quot;. |  |
| 397 | 9 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$ep_page&quot;. |  |
| 398 | 9 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$gen_menu_template_names&quot;. |  |
| 398 | 50 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;ep_general_menu_tmpl_names&quot;. |  |
| 399 | 9 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$platform_menu_template_names&quot;. |  |
| 399 | 55 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;ep_platform_menu_tmpl_names&quot;. |  |
| 400 | 9 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$brand_menu_template_names&quot;. |  |
| 400 | 52 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;ep_brand_menu_templates&quot;. |  |
| 401 | 9 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$pro_active&quot;. |  |
| 402 | 9 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$coming_soon&quot;. |  |
| 403 | 9 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$success_message&quot;. |  |
| 404 | 9 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$error_message&quot;. |  |
| 411 | 62 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;ep_settings_nonce&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 411 | 62 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;ep_settings_nonce&#039;] |  |
| 412 | 46 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;submit&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 412 | 46 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;submit&#039;] |  |
| 414 | 23 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;before_{$save_handler_method}&quot;. |  |
| 415 | 23 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;before_embedpress_settings_save&quot;. |  |
| 419 | 23 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;after_embedpress_settings_save&quot;. |  |
| 420 | 52 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_SERVER[&#039;HTTP_REFERER&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 420 | 52 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_SERVER[&#039;HTTP_REFERER&#039;] |  |
| 433 | 47 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 433 | 90 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 434 | 48 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 434 | 92 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 435 | 50 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 435 | 96 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 436 | 45 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 436 | 86 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 437 | 43 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 437 | 82 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 439 | 37 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 439 | 63 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 439 | 63 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;custom_color&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 439 | 63 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;custom_color&#039;] |  |
| 443 | 35 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;ep_general_settings_before_save&quot;. |  |
| 443 | 75 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 444 | 35 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;ep_settings_settings_before_save&quot;. |  |
| 444 | 76 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 449 | 19 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;ep_general_settings_after_save&quot;. |  |
| 449 | 58 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 450 | 19 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;ep_settings_settings_after_save&quot;. |  |
| 450 | 59 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 463 | 32 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 463 | 73 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 463 | 73 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;api_key&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 464 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 464 | 75 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 464 | 75 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;pagesize&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 465 | 35 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 465 | 79 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 465 | 79 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;start_time&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 466 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 466 | 75 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 466 | 75 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;end_time&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 467 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 467 | 75 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 467 | 75 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;autoplay&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 468 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 468 | 75 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 468 | 75 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;controls&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 469 | 27 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 469 | 63 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 469 | 63 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;fs&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 470 | 39 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 470 | 87 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 470 | 87 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;iv_load_policy&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 471 | 30 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 471 | 69 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 471 | 69 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;color&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 472 | 28 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 472 | 65 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 472 | 65 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;rel&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 476 | 35 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;ep_youtube_settings_before_save&quot;. |  |
| 478 | 19 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;ep_youtube_settings_after_save&quot;. |  |
| 485 | 35 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 485 | 79 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 485 | 79 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;start_time&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 486 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 486 | 75 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 486 | 75 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;autoplay&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 487 | 50 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 487 | 109 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 487 | 109 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;display_fullscreen_button&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 488 | 42 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 488 | 93 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 488 | 93 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;small_play_button&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 489 | 37 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 489 | 83 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 489 | 83 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;player_color&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 490 | 41 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 490 | 91 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 490 | 91 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;plugin_resumable&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 491 | 37 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 491 | 83 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 491 | 83 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;plugin_focus&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 492 | 38 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 492 | 85 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 492 | 85 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;plugin_rewind&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 493 | 40 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 493 | 89 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 493 | 89 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;display_playbar&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 494 | 43 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 494 | 95 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 494 | 95 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;plugin_rewind_time&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 495 | 45 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 495 | 99 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 495 | 99 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;always_show_controls&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 498 | 35 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;ep_wistia_settings_before_save&quot;. |  |
| 500 | 19 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;ep_wistia_settings_after_save&quot;. |  |
| 507 | 35 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 507 | 79 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 507 | 79 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;start_time&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 508 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 508 | 75 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 508 | 75 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;autoplay&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 509 | 30 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 509 | 69 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 509 | 69 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;color&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 510 | 38 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 510 | 85 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 510 | 85 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;display_title&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 511 | 39 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 511 | 87 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 511 | 87 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;display_author&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 512 | 39 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 512 | 87 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 512 | 87 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;display_avatar&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 515 | 35 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;ep_vimeo_settings_before_save&quot;. |  |
| 517 | 19 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;ep_vimeo_settings_after_save&quot;. |  |
| 524 | 55 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 524 | 97 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 524 | 97 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;autoplay&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 525 | 42 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 525 | 78 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 525 | 78 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;fs&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 526 | 35 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 526 | 79 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 526 | 79 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;start_time&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 527 | 52 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 527 | 91 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 527 | 91 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;theme&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 528 | 51 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 528 | 89 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 528 | 89 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;mute&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 531 | 35 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;ep_twitch_settings_before_save&quot;. |  |
| 533 | 19 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;ep_twitch_settings_after_save&quot;. |  |
| 540 | 30 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 540 | 77 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 540 | 77 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;spotify_theme&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 543 | 35 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;ep_spotify_settings_before_save&quot;. |  |
| 545 | 19 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;ep_spotify_settings_after_save&quot;. |  |
| 551 | 19 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;before_embedpress_branding_save&quot;. |  |
| 556 | 55 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 556 | 119 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 556 | 119 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;embedpress_document_powered_by&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 559 | 19 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;after_embedpress_branding_save&quot;. |  |
| 566 | 35 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 566 | 79 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 566 | 79 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;start_time&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 567 | 31 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 567 | 71 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 567 | 71 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;visual&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 568 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 568 | 75 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 568 | 75 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;autoplay&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 569 | 39 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 569 | 87 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 569 | 87 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;play_on_mobile&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 570 | 30 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 570 | 69 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 570 | 69 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;color&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 571 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 571 | 75 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 571 | 75 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;controls&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 572 | 35 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 572 | 79 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 572 | 79 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;video_info&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 573 | 29 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 573 | 67 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 573 | 67 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;mute&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 575 | 35 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;ep_dailymotion_settings_before_save&quot;. |  |
| 577 | 19 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;ep_dailymotion_settings_after_save&quot;. |  |
| 584 | 31 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 584 | 71 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 584 | 71 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;visual&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 585 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 585 | 75 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 585 | 75 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;autoplay&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 586 | 39 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 586 | 87 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 586 | 87 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;play_on_mobile&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 587 | 37 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 587 | 83 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 587 | 83 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;share_button&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 588 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 588 | 75 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 588 | 75 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;comments&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 589 | 30 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 589 | 69 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 589 | 69 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;color&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 590 | 32 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 590 | 73 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 590 | 73 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;artwork&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 591 | 35 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 591 | 79 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 591 | 79 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;play_count&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 592 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 592 | 75 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 592 | 75 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;username&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 596 | 35 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;ep_soundcloud_settings_before_save&quot;. |  |
| 598 | 19 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;ep_soundcloud_settings_after_save&quot;. |  |
| 603 | 27 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 603 | 87 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 603 | 87 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;epgc_client_secret&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 603 | 87 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;epgc_client_secret&#039;] |  |
| 604 | 29 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 604 | 65 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 605 | 40 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 605 | 113 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 605 | 113 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;epgc_selected_calendar_ids&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 622 | 32 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 622 | 73 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 622 | 73 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;api_key&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 623 | 30 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 623 | 69 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 623 | 69 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;limit&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 624 | 32 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 624 | 73 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 624 | 73 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;orderby&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 629 | 35 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;ep_opensea_settings_before_save&quot;. |  |
| 631 | 19 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;ep_opensea_settings_after_save&quot;. |  |
| 646 | 24 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotValidated | Detected usage of a possibly undefined superglobal array index: $_POST[&#039;nonce&#039;]. Check that the array index exists before using it. |  |
| 646 | 24 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;nonce&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 646 | 24 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;nonce&#039;] |  |
| 655 | 55 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;logo_url&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 688 | 24 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotValidated | Detected usage of a possibly undefined superglobal array index: $_POST[&#039;nonce&#039;]. Check that the array index exists before using it. |  |
| 688 | 24 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;nonce&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 688 | 24 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;nonce&#039;] |  |
| 697 | 71 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;element_type&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 735 | 51 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;nonce&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 735 | 51 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;nonce&#039;] |  |
| 744 | 65 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;notice_id&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 835 | 51 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;nonce&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 835 | 51 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;nonce&#039;] |  |
| 867 | 28 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;gutenberg_block&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 876 | 28 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;elementor_widget&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |

## `EmbedPress/Ends/Back/Settings/templates/main-template.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 11 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$is_main_banner_dismissed&quot;. |  |
| 135 | 30 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 135 | 53 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 135 | 98 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 135 | 121 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 135 | 121 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotValidated | Detected usage of a possibly undefined superglobal array index: $_GET[&#039;page&#039;]. Check that the array index exists before using it. |  |
| 168 | 17 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$template_file&quot;. |  |

## `EmbedPress/Ends/Back/Settings/templates/calendly.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 10 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$authorize_url&quot;. |  |
| 13 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$user_info&quot;. |  |
| 14 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$event_types&quot;. |  |
| 15 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$scheduled_events&quot;. |  |
| 16 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$invtitees_list&quot;. |  |
| 18 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$avatarUrl&quot;. |  |
| 19 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$name&quot;. |  |
| 20 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$schedulingUrl&quot;. |  |
| 24 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound | Functions declared in the global namespace by a theme/plugin should start with the theme/plugin prefix. Found: &quot;getCalendlyUuid&quot;. |  |
| 37 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$calendly_tokens&quot;. |  |
| 38 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$expirationTime&quot;. |  |
| 39 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$currentTimestamp&quot;. |  |
| 43 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$nonce&quot;. |  |
| 46 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$nonce_param&quot;. |  |
| 48 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$calendly_connect_url&quot;. |  |
| 49 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$calendly_sync_url&quot;. |  |
| 51 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$calendly_disconnect_url&quot;. |  |
| 54 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$calendly_connect_url&quot;. |  |
| 55 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$calendly_sync_url&quot;. |  |
| 57 | 52 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;_nonce&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 57 | 52 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_GET[&#039;_nonce&#039;] |  |
| 57 | 90 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotValidated | Detected usage of a possibly undefined superglobal array index: $_GET[&#039;calendly_status&#039;]. Check that the array index exists before using it. |  |
| 62 | 48 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;_nonce&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 62 | 48 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_GET[&#039;_nonce&#039;] |  |
| 66 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$is_calendly_connected&quot;. |  |
| 69 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$invtitees_list&quot;. |  |
| 70 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$scheduled_events&quot;. |  |
| 71 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$event_types&quot;. |  |
| 75 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$invtitees_list&quot;. |  |
| 113 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$scheduled_events&quot;. |  |
| 153 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$event_types&quot;. |  |
| 262 | 72 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$item&quot;. |  |
| 325 | 25 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$index&quot;. |  |
| 326 | 25 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$current_datetime&quot;. |  |
| 328 | 25 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$upcoming_events&quot;. |  |
| 329 | 25 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$past_events&quot;. |  |
| 332 | 73 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$event&quot;. |  |
| 333 | 33 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$uuid&quot;. |  |
| 336 | 33 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$name&quot;. |  |
| 339 | 33 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$start_time&quot;. |  |
| 340 | 33 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$end_time&quot;. |  |
| 343 | 33 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$is_past_event&quot;. |  |
| 347 | 37 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$past_events&quot;. |  |
| 352 | 37 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$upcoming_events&quot;. |  |
| 371 | 25 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$sorted_events&quot;. |  |
| 375 | 56 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$event_data&quot;. |  |
| 376 | 33 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$event&quot;. |  |
| 377 | 33 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$name&quot;. |  |
| 380 | 33 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$start_time&quot;. |  |
| 381 | 33 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$end_time&quot;. |  |
| 384 | 33 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$is_past_event&quot;. |  |

## `EmbedPress/Ends/Back/Settings/templates/partials/toast-message.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 7 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$success_message&quot;. |  |
| 11 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$error_message&quot;. |  |
| 14 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$warning_message&quot;. |  |
| 36 | 20 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 49 | 19 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 62 | 19 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |

## `EmbedPress/ThirdParty/Googlecalendar/GoogleClient.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 225 | 14 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 226 | 68 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 228 | 13 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 231 | 22 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 231 | 40 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 231 | 40 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;state&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 231 | 40 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_GET[&#039;state&#039;] |  |
| 237 | 14 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 237 | 14 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;code&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 237 | 14 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_GET[&#039;code&#039;] |  |

## `EmbedPress/Providers/InstagramFeed.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 121 | 104 | WARNING | WordPress.WP.EnqueuedResourceParameters.MissingVersion | Resource version not set in call to wp_enqueue_script(). This means new versions of the script may not always be loaded due to browser caching. |  |

## `readme.txt` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | WARNING | mismatched_plugin_name | Plugin name "EmbedPress - PDF Embedder, Embed YouTube Videos, 3D FlipBook, Social feeds, Docs & more" is different from the name declared in plugin header "EmbedPress". | [Docs](https://developer.wordpress.org/plugins/wordpress-org/common-issues/#incomplete-readme) |

## `tests/bootstrap.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 12 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$ep_plugin_dir&quot;. |  |
| 13 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$ep_tests_dir&quot;. |  |

## `tests/stubs.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 20 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound | Functions declared in the global namespace by a theme/plugin should start with the theme/plugin prefix. Found: &quot;site_url&quot;. |  |
| 26 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound | Functions declared in the global namespace by a theme/plugin should start with the theme/plugin prefix. Found: &quot;esc_url&quot;. |  |
| 32 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound | Functions declared in the global namespace by a theme/plugin should start with the theme/plugin prefix. Found: &quot;esc_attr&quot;. |  |
| 38 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound | Functions declared in the global namespace by a theme/plugin should start with the theme/plugin prefix. Found: &quot;wp_remote_get&quot;. |  |
| 44 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound | Functions declared in the global namespace by a theme/plugin should start with the theme/plugin prefix. Found: &quot;wp_remote_retrieve_body&quot;. |  |
| 50 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound | Functions declared in the global namespace by a theme/plugin should start with the theme/plugin prefix. Found: &quot;is_wp_error&quot;. |  |
| 56 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound | Functions declared in the global namespace by a theme/plugin should start with the theme/plugin prefix. Found: &quot;__&quot;. |  |
| 62 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound | Functions declared in the global namespace by a theme/plugin should start with the theme/plugin prefix. Found: &quot;apply_filters&quot;. |  |
| 68 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound | Functions declared in the global namespace by a theme/plugin should start with the theme/plugin prefix. Found: &quot;do_action&quot;. |  |
| 72 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound | Functions declared in the global namespace by a theme/plugin should start with the theme/plugin prefix. Found: &quot;add_filter&quot;. |  |
| 78 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound | Functions declared in the global namespace by a theme/plugin should start with the theme/plugin prefix. Found: &quot;add_action&quot;. |  |
| 84 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound | Functions declared in the global namespace by a theme/plugin should start with the theme/plugin prefix. Found: &quot;remove_filter&quot;. |  |
| 90 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound | Functions declared in the global namespace by a theme/plugin should start with the theme/plugin prefix. Found: &quot;has_filter&quot;. |  |
| 96 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound | Functions declared in the global namespace by a theme/plugin should start with the theme/plugin prefix. Found: &quot;wp_parse_args&quot;. |  |
| 102 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound | Functions declared in the global namespace by a theme/plugin should start with the theme/plugin prefix. Found: &quot;plugins_url&quot;. |  |
| 108 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound | Functions declared in the global namespace by a theme/plugin should start with the theme/plugin prefix. Found: &quot;plugin_dir_path&quot;. |  |
| 114 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound | Functions declared in the global namespace by a theme/plugin should start with the theme/plugin prefix. Found: &quot;trailingslashit&quot;. |  |
| 120 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound | Functions declared in the global namespace by a theme/plugin should start with the theme/plugin prefix. Found: &quot;wp_json_encode&quot;. |  |
| 126 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound | Functions declared in the global namespace by a theme/plugin should start with the theme/plugin prefix. Found: &quot;absint&quot;. |  |
| 132 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound | Functions declared in the global namespace by a theme/plugin should start with the theme/plugin prefix. Found: &quot;get_option&quot;. |  |
| 138 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound | Functions declared in the global namespace by a theme/plugin should start with the theme/plugin prefix. Found: &quot;update_option&quot;. |  |
| 144 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound | Functions declared in the global namespace by a theme/plugin should start with the theme/plugin prefix. Found: &quot;sanitize_text_field&quot;. |  |
| 150 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound | Functions declared in the global namespace by a theme/plugin should start with the theme/plugin prefix. Found: &quot;get_the_title&quot;. |  |
| 156 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound | Functions declared in the global namespace by a theme/plugin should start with the theme/plugin prefix. Found: &quot;attachment_url_to_postid&quot;. |  |
| 162 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound | Functions declared in the global namespace by a theme/plugin should start with the theme/plugin prefix. Found: &quot;admin_url&quot;. |  |
| 168 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound | Functions declared in the global namespace by a theme/plugin should start with the theme/plugin prefix. Found: &quot;delete_option&quot;. |  |
| 192 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound | Functions declared in the global namespace by a theme/plugin should start with the theme/plugin prefix. Found: &quot;esc_html&quot;. |  |

## `EmbedPress/simple_html_dom.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 86 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound | Functions declared in the global namespace by a theme/plugin should start with the theme/plugin prefix. Found: &quot;file_get_html&quot;. |  |
| 143 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound | Functions declared in the global namespace by a theme/plugin should start with the theme/plugin prefix. Found: &quot;str_get_html&quot;. |  |
| 170 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound | Functions declared in the global namespace by a theme/plugin should start with the theme/plugin prefix. Found: &quot;dump_html_tree&quot;. |  |

## `EmbedPress/AMP/Adapter/Twitter.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 91 | 20 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedConstantFound | Global constants defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;PPEMB_TWITTER_AMP_SCRIPT_LOADED&quot;. |  |

## `EmbedPress/AMP/Adapter/Reddit.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 98 | 20 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedConstantFound | Global constants defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;PPEMB_REDDIT_AMP_SCRIPT_LOADED&quot;. |  |

## `EmbedPress/Ends/Back/Settings/templates/spotify.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 10 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$settings&quot;. |  |
| 11 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$spotify_theme&quot;. |  |

## `EmbedPress/Ends/Back/Settings/templates/ads.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 13 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$video_demo_adUrl&quot;. |  |
| 14 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$image_demo_adUrl&quot;. |  |
| 15 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$youtube_embed_url&quot;. |  |
| 19 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$updgrade_pro_text&quot;. |  |
| 21 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$updgrade_pro_text&quot;. |  |
| 353 | 37 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$pdf_url&quot;. |  |
| 354 | 37 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$renderer&quot;. |  |
| 355 | 37 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$src&quot;. |  |

## `EmbedPress/Ends/Back/Settings/templates/sources.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 5 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$icon_src&quot;. |  |
| 8 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$sources&quot;. |  |
| 166 | 9 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$index&quot;. |  |
| 167 | 30 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$source&quot;. |  |

## `EmbedPress/Ends/Back/Settings/templates/hub.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 10 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$license_info&quot;. |  |
| 11 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$is_pro_active&quot;. |  |
| 12 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$license_status&quot;. |  |
| 13 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$license_key&quot;. |  |
| 14 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$is_features_enabled&quot;. |  |
| 15 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$status_message&quot;. |  |
| 17 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$is_banner_dismissed&quot;. |  |
| 20 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$stored_version&quot;. |  |
| 21 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$current_version&quot;. |  |
| 22 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$is_popup_dismissed&quot;. |  |
| 27 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$is_popup_dismissed&quot;. |  |
| 30 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$is_popup_dismissed&quot;. |  |
| 34 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$show_bfriday_banner&quot;. |  |
| 37 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$global_brand_settings&quot;. |  |
| 38 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$global_brand_logo_url&quot;. |  |
| 39 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$global_brand_logo_id&quot;. |  |
| 43 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$username&quot;. |  |
| 392 | 9 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$icon_src&quot;. |  |
| 394 | 9 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$popular_sources&quot;. |  |
| 443 | 52 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$category_key&quot;. |  |
| 443 | 69 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$category&quot;. |  |
| 453 | 72 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$source&quot;. |  |

## `EmbedPress/Ends/Back/Settings/templates/settings.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 12 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$g_settings&quot;. |  |
| 14 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$lazy_load&quot;. |  |
| 15 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$pdf_custom_color_settings&quot;. |  |
| 16 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$turn_off_rating_help&quot;. |  |
| 17 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$turn_off_milestone&quot;. |  |
| 19 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$custom_color&quot;. |  |
| 21 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$enableEmbedResizeHeight&quot;. |  |
| 22 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$enableEmbedResizeWidth&quot;. |  |
| 119 | 25 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$license_info&quot;. |  |

## `EmbedPress/Ends/Back/Settings/templates/instagram.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 10 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$personal_token_url&quot;. |  |
| 12 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$business_token_url&quot;. |  |
| 14 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$personal_data&quot;. |  |
| 16 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$business_data&quot;. |  |
| 18 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$feed_data&quot;. |  |
| 20 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$get_data&quot;. |  |
| 27 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$is_connected&quot;. |  |
| 94 | 33 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$avater_url&quot;. |  |
| 97 | 37 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$avater_url&quot;. |  |
| 101 | 57 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$data&quot;. |  |
| 104 | 45 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$avater_url&quot;. |  |
| 106 | 45 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$avater_url&quot;. |  |
| 120 | 49 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$is_connected&quot;. |  |

## `EmbedPress/Ends/Back/Settings/templates/vimeo.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 9 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$vm_settings&quot;. |  |
| 11 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$start_time&quot;. |  |
| 12 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$autoplay&quot;. |  |
| 13 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$loop&quot;. |  |
| 14 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$autopause&quot;. |  |
| 15 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$vimeo_dnt&quot;. |  |
| 16 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$color&quot;. |  |
| 17 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$display_title&quot;. |  |
| 18 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$display_author&quot;. |  |
| 19 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$display_avatar&quot;. |  |

## `EmbedPress/Ends/Back/Settings/templates/go-premium.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 2 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$icon_src&quot;. |  |
| 4 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$sources&quot;. |  |

## `EmbedPress/Ends/Back/Settings/templates/google-calendar.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 12 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$calendarList&quot;. |  |

## `EmbedPress/Ends/Back/Settings/templates/opensea.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 11 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$opensea_settings&quot;. |  |
| 13 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$os_api_key&quot;. |  |
| 14 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$limit&quot;. |  |

## `EmbedPress/Ends/Back/Settings/templates/soundcloud.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 9 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$visual&quot;. |  |
| 10 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$autoplay&quot;. |  |
| 11 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$share_button&quot;. |  |
| 13 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$color&quot;. |  |
| 14 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$artwork&quot;. |  |
| 15 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$play_count&quot;. |  |
| 16 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$username&quot;. |  |
| 18 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$download_button&quot;. |  |
| 19 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$buy_button&quot;. |  |

## `EmbedPress/Ends/Back/Settings/templates/dailymotion.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 9 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$dm_settings&quot;. |  |
| 11 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$start_time&quot;. |  |
| 13 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$autoplay&quot;. |  |
| 14 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$play_on_mobile&quot;. |  |
| 15 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$mute&quot;. |  |
| 16 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$controls&quot;. |  |
| 17 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$video_info&quot;. |  |
| 18 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$color&quot;. |  |
| 20 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$start_time&quot;. |  |
| 21 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$show_logo&quot;. |  |

## `EmbedPress/Ends/Back/Settings/templates/wistia.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 9 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$wis_settings&quot;. |  |
| 10 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$start_time&quot;. |  |
| 11 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$autoplay&quot;. |  |
| 12 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$display_fullscreen_button&quot;. |  |
| 13 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$display_playbar&quot;. |  |
| 14 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$small_play_button&quot;. |  |
| 15 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$display_volume_control&quot;. |  |
| 16 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$volume&quot;. |  |
| 17 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$player_color&quot;. |  |
| 18 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$plugin_resumable&quot;. |  |
| 19 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$plugin_captions&quot;. |  |
| 20 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$plugin_captions_default&quot;. |  |
| 21 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$plugin_focus&quot;. |  |
| 22 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$plugin_rewind&quot;. |  |
| 23 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$plugin_rewind_time&quot;. |  |
| 24 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$always_show_controls&quot;. |  |

## `EmbedPress/Ends/Back/Settings/templates/custom-logo.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 13 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$option_name&quot;. |  |
| 14 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$yt_settings&quot;. |  |
| 15 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$gen_settings&quot;. |  |
| 16 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$yt_logo_xpos&quot;. |  |
| 17 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$yt_logo_ypos&quot;. |  |
| 18 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$yt_logo_opacity&quot;. |  |
| 19 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$yt_logo_id&quot;. |  |
| 20 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$yt_logo_url&quot;. |  |
| 21 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$yt_cta_url&quot;. |  |
| 22 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$yt_branding&quot;. |  |
| 28 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$vm_settings&quot;. |  |
| 29 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$vm_branding&quot;. |  |
| 30 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$vm_logo_xpos&quot;. |  |
| 31 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$vm_logo_ypos&quot;. |  |
| 32 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$vm_logo_opacity&quot;. |  |
| 33 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$vm_logo_id&quot;. |  |
| 34 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$vm_logo_url&quot;. |  |
| 35 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$vm_cta_url&quot;. |  |

## `EmbedPress/Ends/Back/Settings/templates/twitch.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 9 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$twitch_settings&quot;. |  |
| 11 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$start_time&quot;. |  |
| 12 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$autoplay&quot;. |  |
| 13 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$show_chat&quot;. |  |
| 14 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$theme&quot;. |  |
| 15 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$fs&quot;. |  |
| 16 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$mute&quot;. |  |

## `EmbedPress/Ends/Back/Settings/templates/youtube.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 10 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$yt_settings&quot;. |  |
| 11 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$api_key&quot;. |  |
| 12 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$pagesize&quot;. |  |
| 13 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$start_time&quot;. |  |
| 14 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$end_time&quot;. |  |
| 15 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$autoplay&quot;. |  |
| 16 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$controls&quot;. |  |
| 17 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$fs&quot;. |  |
| 18 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$iv_load_policy&quot;. |  |
| 19 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$color&quot;. |  |
| 20 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$rel&quot;. |  |
| 23 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$cc_load_policy&quot;. |  |
| 24 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$modestbranding&quot;. |  |
| 25 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$yt_lc_show&quot;. |  |
| 27 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$yt_sub_channel&quot;. |  |
| 28 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$yt_sub_text&quot;. |  |
| 29 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$yt_sub_layout&quot;. |  |
| 30 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$yt_sub_theme&quot;. |  |
| 31 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$yt_sub_count&quot;. |  |

## `EmbedPress/Ends/Back/Settings/templates/general.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 10 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$g_settings&quot;. |  |
| 12 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$lazy_load&quot;. |  |
| 13 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$pdf_custom_color_settings&quot;. |  |
| 14 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$turn_off_rating_help&quot;. |  |
| 15 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$turn_off_milestone&quot;. |  |
| 17 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$custom_color&quot;. |  |
| 19 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$enableEmbedResizeHeight&quot;. |  |
| 20 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$enableEmbedResizeWidth&quot;. |  |

## `EmbedPress/Ends/Back/Settings/templates/partials/feature-notice.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 14 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$is_feature_notice_dismissed&quot;. |  |
| 21 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$analytics_url&quot;. |  |
| 22 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$learn_more_url&quot;. |  |
| 23 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$nonce&quot;. |  |

## `EmbedPress/Ends/Back/Settings/templates/partials/sidebar.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 17 | 29 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;ep_before_element_menu&quot;. |  |
| 19 | 33 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;ep_before_element_item&quot;. |  |
| 26 | 33 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;ep_after_element_item&quot;. |  |
| 29 | 33 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;ep_before_element_item&quot;. |  |
| 39 | 33 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;ep_after_element_item&quot;. |  |
| 42 | 33 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;ep_before_element_item&quot;. |  |
| 49 | 33 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;ep_after_element_item&quot;. |  |
| 52 | 33 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;ep_before_element_item&quot;. |  |
| 76 | 33 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;ep_after_element_item&quot;. |  |
| 79 | 33 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;ep_before_element_item&quot;. |  |
| 88 | 33 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;ep_after_element_item&quot;. |  |
| 90 | 29 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;ep_before_branding_menu&quot;. |  |
| 98 | 29 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;ep_before_branding_menu&quot;. |  |
| 118 | 27 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;ep_before_license_menu&quot;. |  |
| 122 | 29 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;ep_after_license_menu&quot;. |  |
| 131 | 23 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;ep_before_premium_menu&quot;. |  |
| 151 | 25 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound | Hook names invoked by a theme/plugin should start with the theme/plugin prefix. Found: &quot;ep_after_premium_menu&quot;. |  |

## `EmbedPress/Ends/Back/Settings/templates/elements.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 8 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$elements&quot;. |  |
| 9 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$g_blocks&quot;. |  |
| 10 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$e_blocks&quot;. |  |
| 11 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$settings&quot;. |  |
| 12 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$enablePluginInAdmin&quot;. |  |
| 13 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$enablePluginInFront&quot;. |  |

## `includes.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 105 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound | Functions declared in the global namespace by a theme/plugin should start with the theme/plugin prefix. Found: &quot;is_embedpress_pro_active&quot;. |  |
| 118 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound | Functions declared in the global namespace by a theme/plugin should start with the theme/plugin prefix. Found: &quot;get_embedpress_pro_version&quot;. |  |
| 147 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound | Functions declared in the global namespace by a theme/plugin should start with the theme/plugin prefix. Found: &quot;stringToBoolean&quot;. |  |
| 167 | 5 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$new_block_file&quot;. |  |

## `providers.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 19 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$host_url&quot;. |  |
| 22 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$additionalServiceProviders&quot;. |  |

## `autoloader.php` ✅ DONE

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 14 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound | Global variables defined by a theme/plugin should start with the theme/plugin prefix. Found: &quot;$autoLoaderFullClassName&quot;. |  |
