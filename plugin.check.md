# Plugin Check Report

**Plugin:** EmbedPress
**Generated at:** 2026-04-27 05:02:20


## `tests/e2e/.auth/.gitignore`

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | WARNING | hidden_files | Hidden files are not permitted. |  |

## `.gitignore`

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | WARNING | hidden_files | Hidden files are not permitted. |  |

## `.distignore`

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | WARNING | hidden_files | Hidden files are not permitted. |  |

## `.claude`

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | WARNING | ai_instruction_directory | AI instruction directory ".claude" detected. These directories should not be included in production plugins. |  |

## `.github`

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | WARNING | github_directory | GitHub workflow directory ".github" detected. This directory should not be included in production plugins. |  |

## `plugin.check.md`

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | WARNING | unexpected_markdown_file | Unexpected markdown file "plugin.check.md" detected in plugin root. Only specific markdown files are expected in production plugins. |  |

## `CLAUDE.md`

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | WARNING | unexpected_markdown_file | Unexpected markdown file "CLAUDE.md" detected in plugin root. Only specific markdown files are expected in production plugins. |  |

## `embedpress.php`

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 1 | 1 | WARNING | WordPress.NamingConventions.PrefixAllGlobals.InvalidPrefixPassed | The &quot;embedpress/elementor_enhancer&quot; prefix is not a valid namespace/function/class/variable/constant prefix in PHP. |  |
| 62 | 20 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_SERVER[&#039;HTTP_REFERER&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 62 | 20 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_SERVER[&#039;HTTP_REFERER&#039;] |  |
| 63 | 34 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_SERVER[&#039;HTTP_REFERER&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 63 | 34 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_SERVER[&#039;HTTP_REFERER&#039;] |  |
| 106 | 12 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 129 | 11 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 129 | 45 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 129 | 66 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |

## `Core/AssetManager.php`

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 624 | 31 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 624 | 48 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 624 | 48 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;page&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 624 | 48 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_GET[&#039;page&#039;] |  |
| 823 | 27 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 825 | 31 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 826 | 71 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 826 | 71 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;post&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 826 | 71 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_GET[&#039;post&#039;] |  |
| 919 | 31 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 919 | 48 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 919 | 48 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;page&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 919 | 48 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_GET[&#039;page&#039;] |  |

## `EmbedPress/Includes/Classes/EmbedPress_Plugin_Usage_Tracker.php`

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 204 | 30 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotValidated | Detected usage of a possibly undefined superglobal array index: $_SERVER[&#039;REQUEST_URI&#039;]. Check that the array index exists before using it. |  |
| 204 | 30 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_SERVER[&#039;REQUEST_URI&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 204 | 30 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_SERVER[&#039;REQUEST_URI&#039;] |  |
| 205 | 30 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotValidated | Detected usage of a possibly undefined superglobal array index: $_SERVER[&#039;REQUEST_URI&#039;]. Check that the array index exists before using it. |  |
| 205 | 30 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_SERVER[&#039;REQUEST_URI&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 205 | 30 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_SERVER[&#039;REQUEST_URI&#039;] |  |
| 395 | 59 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_SERVER[&#039;SERVER_SOFTWARE&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 395 | 59 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_SERVER[&#039;SERVER_SOFTWARE&#039;] |  |
| 546 | 67 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_SERVER[&#039;REMOTE_ADDR&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 546 | 67 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_SERVER[&#039;REMOTE_ADDR&#039;] |  |
| 760 | 67 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 760 | 67 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;plugin&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 760 | 67 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_GET[&#039;plugin&#039;] |  |
| 765 | 27 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;_wpnonce&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 765 | 27 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_GET[&#039;_wpnonce&#039;] |  |
| 769 | 35 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;plugin&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 770 | 35 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;plugin_action&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 819 | 15 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;values&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 819 | 15 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;values&#039;] |  |
| 823 | 36 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;details&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |

## `EmbedPress/Includes/Classes/Database/Analytics_Schema.php`

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 521 | 13 | WARNING | WordPress.PHP.DevelopmentFunctions.error_log_error_log | error_log() found. Debug code should not normally be used in production. |  |

## `EmbedPress/Includes/Classes/EmbedPress_Notice.php`

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 138 | 24 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 138 | 45 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 139 | 28 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 139 | 46 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 257 | 20 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 258 | 44 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 258 | 44 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;plugin&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 262 | 28 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 263 | 59 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 263 | 59 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;plugin_action&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 265 | 28 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 266 | 53 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 266 | 53 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;dismiss&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 268 | 28 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 269 | 51 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 269 | 51 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;later&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 316 | 39 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotValidated | Detected usage of a possibly undefined superglobal array index: $_SERVER[&#039;REQUEST_URI&#039;]. Check that the array index exists before using it. |  |
| 316 | 39 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_SERVER[&#039;REQUEST_URI&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 316 | 39 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_SERVER[&#039;REQUEST_URI&#039;] |  |
| 317 | 39 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotValidated | Detected usage of a possibly undefined superglobal array index: $_SERVER[&#039;REQUEST_URI&#039;]. Check that the array index exists before using it. |  |
| 317 | 39 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_SERVER[&#039;REQUEST_URI&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 317 | 39 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_SERVER[&#039;REQUEST_URI&#039;] |  |
| 795 | 49 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;dismiss&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 795 | 49 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;dismiss&#039;] |  |
| 796 | 47 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;notice&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 796 | 47 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;notice&#039;] |  |
| 820 | 49 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;dismiss&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 820 | 49 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;dismiss&#039;] |  |

## `EmbedPress/Includes/Classes/Helper.php`

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 64 | 13 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 66 | 31 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 66 | 31 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;vid&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 300 | 22 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 300 | 65 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 300 | 65 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;client_id&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 301 | 21 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 301 | 63 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 301 | 63 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;password&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 302 | 20 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 302 | 48 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 343 | 22 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 343 | 65 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 343 | 65 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;client_id&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 344 | 21 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 344 | 63 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 344 | 63 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;password&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 345 | 29 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 345 | 79 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 345 | 79 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;content_password&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 423 | 11 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_COOKIE[&#039;password_correct_&#039; . $client_id] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 423 | 11 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_COOKIE[&#039;password_correct_&#039; . $client_id] |  |
| 758 | 91 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;connected_account_type&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 759 | 67 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;hashtag_id&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 760 | 65 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;feed_type&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 761 | 61 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;user_id&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 762 | 71 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;loadmore_key&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 763 | 58 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;_nonce&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 764 | 59 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;params&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 1176 | 14 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 1176 | 32 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |

## `EmbedPress/Includes/Classes/Feature_Enhancer.php`

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 130 | 59 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;_source_nonce&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 130 | 59 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;_source_nonce&#039;] |  |
| 138 | 47 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;source_url&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 138 | 47 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;source_url&#039;] |  |
| 139 | 42 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;block_id&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 139 | 42 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;block_id&#039;] |  |
| 239 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 239 | 77 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 239 | 77 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;playlistid&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 240 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 240 | 76 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 240 | 76 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;pagetoken&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 241 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 241 | 75 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 241 | 75 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;pagesize&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 242 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 242 | 78 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 242 | 78 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;currentpage&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 243 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 243 | 76 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 243 | 76 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;epcolumns&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 244 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 244 | 76 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 244 | 76 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;showtitle&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 245 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 245 | 77 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 245 | 77 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;showpaging&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 246 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 246 | 75 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 246 | 75 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;autonext&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 247 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 247 | 76 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 247 | 76 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;thumbplay&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 248 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 248 | 84 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 248 | 84 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;thumbnail_quality&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 249 | 28 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 249 | 72 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 249 | 72 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;channelUrl&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 1636 | 14 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 1638 | 36 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 1638 | 36 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;hash&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 1639 | 26 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 1639 | 65 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 1639 | 65 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;unique&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |

## `EmbedPress/Includes/Classes/Analytics/Data_Collector.php`

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 221 | 86 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_SERVER[&#039;HTTP_USER_AGENT&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 241 | 86 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_SERVER[&#039;HTTP_USER_AGENT&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 333 | 42 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_SERVER[&#039;HTTP_REFERER&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 345 | 86 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_SERVER[&#039;HTTP_USER_AGENT&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 949 | 42 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 949 | 93 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 949 | 93 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;screen_resolution&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 950 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 950 | 75 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 950 | 75 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;language&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 951 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 951 | 75 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 951 | 75 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;timezone&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 954 | 86 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_SERVER[&#039;HTTP_USER_AGENT&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 972 | 23 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_SERVER[$key] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 972 | 23 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_SERVER[$key] |  |
| 982 | 49 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_SERVER[&#039;REMOTE_ADDR&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 982 | 49 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_SERVER[&#039;REMOTE_ADDR&#039;] |  |
| 1060 | 17 | WARNING | WordPress.PHP.DevelopmentFunctions.error_log_error_log | error_log() found. Debug code should not normally be used in production. |  |
| 1067 | 17 | WARNING | WordPress.PHP.DevelopmentFunctions.error_log_error_log | error_log() found. Debug code should not normally be used in production. |  |
| 1076 | 17 | WARNING | WordPress.PHP.DevelopmentFunctions.error_log_error_log | error_log() found. Debug code should not normally be used in production. |  |
| 2869 | 42 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_SERVER[&#039;HTTP_REFERER&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |

## `EmbedPress/Includes/Classes/Analytics/Milestone_Manager.php`

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 189 | 61 | WARNING | WordPress.DB.PreparedSQLPlaceholders.UnfinishedPrepare | Replacement variables found, but no valid placeholders found in the query. |  |

## `EmbedPress/Ends/Back/Settings/EmbedpressSettings.php`

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 76 | 14 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 76 | 32 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 171 | 36 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 181 | 14 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 181 | 41 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 214 | 52 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;_wpnonce&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 214 | 52 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;_wpnonce&#039;] |  |
| 219 | 65 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;element_type&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 220 | 65 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;element_name&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 221 | 43 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;checked&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 221 | 43 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;checked&#039;] |  |
| 339 | 25 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 339 | 62 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 339 | 62 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;page&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 344 | 22 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 344 | 64 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 344 | 64 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;page_type&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 407 | 22 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 407 | 63 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 407 | 63 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;page_type&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 424 | 62 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;ep_settings_nonce&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 424 | 62 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;ep_settings_nonce&#039;] |  |
| 425 | 46 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;submit&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 425 | 46 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;submit&#039;] |  |
| 433 | 52 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_SERVER[&#039;HTTP_REFERER&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 433 | 52 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_SERVER[&#039;HTTP_REFERER&#039;] |  |
| 446 | 47 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 446 | 90 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 447 | 48 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 447 | 92 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 448 | 50 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 448 | 96 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 449 | 45 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 449 | 86 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 450 | 43 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 450 | 82 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 452 | 37 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 452 | 63 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 452 | 63 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;custom_color&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 452 | 63 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;custom_color&#039;] |  |
| 456 | 75 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 457 | 76 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 462 | 58 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 463 | 59 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 476 | 32 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 476 | 73 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 476 | 73 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;api_key&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 477 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 477 | 75 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 477 | 75 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;pagesize&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 478 | 35 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 478 | 79 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 478 | 79 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;start_time&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 479 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 479 | 75 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 479 | 75 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;end_time&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 480 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 480 | 75 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 480 | 75 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;autoplay&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 481 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 481 | 75 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 481 | 75 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;controls&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 482 | 27 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 482 | 63 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 482 | 63 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;fs&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 483 | 39 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 483 | 87 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 483 | 87 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;iv_load_policy&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 484 | 30 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 484 | 69 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 484 | 69 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;color&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 485 | 28 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 485 | 65 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 485 | 65 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;rel&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 498 | 35 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 498 | 79 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 498 | 79 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;start_time&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 499 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 499 | 75 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 499 | 75 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;autoplay&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 500 | 50 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 500 | 109 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 500 | 109 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;display_fullscreen_button&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 501 | 42 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 501 | 93 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 501 | 93 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;small_play_button&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 502 | 37 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 502 | 83 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 502 | 83 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;player_color&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 503 | 41 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 503 | 91 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 503 | 91 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;plugin_resumable&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 504 | 37 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 504 | 83 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 504 | 83 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;plugin_focus&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 505 | 38 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 505 | 85 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 505 | 85 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;plugin_rewind&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 506 | 40 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 506 | 89 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 506 | 89 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;display_playbar&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 507 | 43 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 507 | 95 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 507 | 95 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;plugin_rewind_time&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 508 | 45 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 508 | 99 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 508 | 99 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;always_show_controls&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 520 | 35 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 520 | 79 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 520 | 79 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;start_time&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 521 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 521 | 75 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 521 | 75 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;autoplay&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 522 | 30 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 522 | 69 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 522 | 69 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;color&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 523 | 38 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 523 | 85 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 523 | 85 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;display_title&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 524 | 39 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 524 | 87 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 524 | 87 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;display_author&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 525 | 39 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 525 | 87 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 525 | 87 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;display_avatar&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 537 | 55 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 537 | 97 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 537 | 97 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;autoplay&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 538 | 42 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 538 | 78 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 538 | 78 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;fs&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 539 | 35 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 539 | 79 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 539 | 79 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;start_time&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 540 | 52 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 540 | 91 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 540 | 91 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;theme&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 541 | 51 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 541 | 89 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 541 | 89 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;mute&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 553 | 30 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 553 | 77 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 553 | 77 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;spotify_theme&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 569 | 55 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 569 | 119 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 569 | 119 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;embedpress_document_powered_by&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 579 | 35 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 579 | 79 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 579 | 79 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;start_time&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 580 | 31 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 580 | 71 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 580 | 71 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;visual&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 581 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 581 | 75 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 581 | 75 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;autoplay&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 582 | 39 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 582 | 87 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 582 | 87 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;play_on_mobile&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 583 | 30 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 583 | 69 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 583 | 69 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;color&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 584 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 584 | 75 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 584 | 75 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;controls&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 585 | 35 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 585 | 79 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 585 | 79 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;video_info&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 586 | 29 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 586 | 67 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 586 | 67 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;mute&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 597 | 31 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 597 | 71 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 597 | 71 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;visual&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 598 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 598 | 75 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 598 | 75 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;autoplay&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 599 | 39 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 599 | 87 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 599 | 87 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;play_on_mobile&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 600 | 37 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 600 | 83 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 600 | 83 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;share_button&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 601 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 601 | 75 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 601 | 75 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;comments&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 602 | 30 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 602 | 69 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 602 | 69 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;color&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 603 | 32 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 603 | 73 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 603 | 73 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;artwork&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 604 | 35 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 604 | 79 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 604 | 79 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;play_count&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 605 | 33 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 605 | 75 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 605 | 75 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;username&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 616 | 27 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 616 | 87 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 616 | 87 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;epgc_client_secret&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 616 | 87 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;epgc_client_secret&#039;] |  |
| 617 | 29 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 617 | 65 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 618 | 40 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 618 | 113 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 618 | 113 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;epgc_selected_calendar_ids&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 635 | 32 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 635 | 73 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 635 | 73 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;api_key&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 636 | 30 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 636 | 69 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 636 | 69 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;limit&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 637 | 32 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 637 | 73 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 637 | 73 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;orderby&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 659 | 24 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotValidated | Detected usage of a possibly undefined superglobal array index: $_POST[&#039;nonce&#039;]. Check that the array index exists before using it. |  |
| 659 | 24 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;nonce&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 659 | 24 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;nonce&#039;] |  |
| 668 | 55 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;logo_url&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 701 | 24 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotValidated | Detected usage of a possibly undefined superglobal array index: $_POST[&#039;nonce&#039;]. Check that the array index exists before using it. |  |
| 701 | 24 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;nonce&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 701 | 24 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;nonce&#039;] |  |
| 710 | 71 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;element_type&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 748 | 51 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;nonce&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 748 | 51 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;nonce&#039;] |  |
| 757 | 65 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;notice_id&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 848 | 51 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;nonce&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 848 | 51 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;nonce&#039;] |  |
| 880 | 28 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;gutenberg_block&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 889 | 28 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;elementor_widget&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |

## `EmbedPress/Ends/Back/Handler.php`

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 58 | 20 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 58 | 43 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 84 | 56 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;_nonce&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 84 | 56 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;_nonce&#039;] |  |
| 86 | 53 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;access_token&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 87 | 53 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotValidated | Detected usage of a possibly undefined superglobal array index: $_POST[&#039;account_type&#039;]. Check that the array index exists before using it. |  |
| 87 | 53 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;account_type&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 93 | 53 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;access_token&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 94 | 53 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotValidated | Detected usage of a possibly undefined superglobal array index: $_POST[&#039;account_type&#039;]. Check that the array index exists before using it. |  |
| 94 | 53 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;account_type&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 136 | 56 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;_nonce&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 136 | 56 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;_nonce&#039;] |  |
| 139 | 53 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;access_token&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 140 | 53 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotValidated | Detected usage of a possibly undefined superglobal array index: $_POST[&#039;account_type&#039;]. Check that the array index exists before using it. |  |
| 140 | 53 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;account_type&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 141 | 48 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotValidated | Detected usage of a possibly undefined superglobal array index: $_POST[&#039;user_id&#039;]. Check that the array index exists before using it. |  |
| 141 | 48 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;user_id&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 348 | 35 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;_nonce&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 348 | 35 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_GET[&#039;_nonce&#039;] |  |
| 363 | 33 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;access_token&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 363 | 33 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_GET[&#039;access_token&#039;] |  |
| 364 | 34 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotValidated | Detected usage of a possibly undefined superglobal array index: $_GET[&#039;refresh_token&#039;]. Check that the array index exists before using it. |  |
| 364 | 34 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;refresh_token&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 364 | 34 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_GET[&#039;refresh_token&#039;] |  |
| 365 | 31 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotValidated | Detected usage of a possibly undefined superglobal array index: $_GET[&#039;expires_in&#039;]. Check that the array index exists before using it. |  |
| 365 | 31 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;expires_in&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 365 | 31 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_GET[&#039;expires_in&#039;] |  |
| 366 | 31 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotValidated | Detected usage of a possibly undefined superglobal array index: $_GET[&#039;created_at&#039;]. Check that the array index exists before using it. |  |
| 366 | 31 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;created_at&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 366 | 31 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_GET[&#039;created_at&#039;] |  |
| 454 | 26 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 454 | 47 | WARNING | WordPress.Security.NonceVerification.Missing | Processing form data without nonce verification. |  |
| 454 | 47 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;subject&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 454 | 47 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;subject&#039;] |  |
| 475 | 22 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 475 | 43 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 475 | 43 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;url&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 475 | 43 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_GET[&#039;url&#039;] |  |
| 827 | 56 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;_nonce&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 827 | 56 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;_nonce&#039;] |  |
| 828 | 51 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;user_id&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 828 | 51 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;user_id&#039;] |  |
| 829 | 61 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;account_type&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 829 | 61 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;account_type&#039;] |  |

## `EmbedPress/ThirdParty/Googlecalendar/Embedpress_Google_Helper.php`

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 142 | 13 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;start&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 142 | 13 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;start&#039;] |  |
| 143 | 11 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;end&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 143 | 11 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;end&#039;] |  |
| 148 | 57 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;thisCalendarids&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 148 | 57 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;thisCalendarids&#039;] |  |
| 196 | 30 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;timeZone&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 196 | 30 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;timeZone&#039;] |  |
| 217 | 51 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_SERVER[&#039;HTTP_REFERER&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 217 | 51 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_SERVER[&#039;HTTP_REFERER&#039;] |  |
| 472 | 14 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 759 | 69 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;epgc_deletecache_data&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 759 | 69 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;epgc_deletecache_data&#039;] |  |
| 829 | 72 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;epgc_remove_private_data&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 829 | 72 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;epgc_remove_private_data&#039;] |  |
| 842 | 72 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;epgc_remove_private_data&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 842 | 72 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;epgc_remove_private_data&#039;] |  |
| 878 | 67 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_POST[&#039;epgc_authorize_data&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 878 | 67 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_POST[&#039;epgc_authorize_data&#039;] |  |
| 894 | 13 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 894 | 48 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 901 | 14 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |

## `EmbedPress/ThirdParty/Googlecalendar/GoogleClient.php`

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 238 | 14 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 239 | 68 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 241 | 13 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 244 | 22 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 244 | 40 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 244 | 40 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;state&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 244 | 40 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_GET[&#039;state&#039;] |  |
| 250 | 14 | WARNING | WordPress.Security.NonceVerification.Recommended | Processing form data without nonce verification. |  |
| 250 | 14 | WARNING | WordPress.Security.ValidatedSanitizedInput.MissingUnslash | $_GET[&#039;code&#039;] not unslashed before sanitization. Use wp_unslash() or similar |  |
| 250 | 14 | WARNING | WordPress.Security.ValidatedSanitizedInput.InputNotSanitized | Detected usage of a non-sanitized input variable: $_GET[&#039;code&#039;] |  |

## `readme.txt`

| Line | Column | Type | Code | Message | Docs |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | WARNING | mismatched_plugin_name | Plugin name "EmbedPress - PDF Embedder, Embed YouTube Videos, 3D FlipBook, Social feeds, Docs & more" is different from the name declared in plugin header "EmbedPress". | [Docs](https://developer.wordpress.org/plugins/wordpress-org/common-issues/#incomplete-readme) |
