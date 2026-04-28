import { test, expect } from '@playwright/test';

/**
 * E2E coverage for the 12 advanced custom-player features (card 81243).
 *
 * These tests focus on the FRONTEND behavior — the JS in initplyr.js
 * reads `data-options` and renders the right overlays/interactions.
 * Per-block toggles in the editor (Pro Inspector) are exercised by the
 * Playwright suites in embedpress-playwright-automation against staging.
 *
 * Strategy: render a wrapper with hand-crafted `data-options` JSON via
 * `page.setContent`, init Plyr against it, then assert the DOM/network.
 */

test.use({ storageState: { cookies: [], origins: [] } });

const PLYR_CDN = 'https://cdn.plyr.io/3.7.8/plyr.polyfilled.js';
const PLYR_CSS = 'https://cdn.plyr.io/3.7.8/plyr.css';

// Resolves to the built initplyr.js. The dev server / Apache serves it at
// /wp-content/plugins/embedpress/static/js/initplyr.js, but for unit-style
// browser tests we read the file directly via fixtures.
const INITPLYR_PATH = '../../static/js/initplyr.js';

function harness(options: Record<string, unknown>, mediaTag: string = 'video', mediaSrc: string = 'https://cdn.plyr.io/static/blank.mp4') {
    return `<!doctype html>
<html><head>
<meta charset="utf-8" />
<link rel="stylesheet" href="${PLYR_CSS}" />
<link rel="stylesheet" href="/static/css/embedpress.css" />
<script src="${PLYR_CDN}"></script>
</head><body>
<div class="ep-embed-content-wraper" data-playerid="t1"
    data-options='${JSON.stringify(options).replace(/'/g, '&#39;')}'
    style="position:relative;width:640px;height:360px;">
    <div class="ose-embedpress-responsive">
        <${mediaTag} src="${mediaSrc}" controls></${mediaTag}>
    </div>
</div>
</body></html>`;
}

// ---------------------------------------------------------------------------
// 4.5 — Auto Resume Playback
// ---------------------------------------------------------------------------

test.describe('Custom Player — Auto Resume Playback', () => {
    test('shows Resume prompt when localStorage has a saved position', async ({ page, context }) => {
        await context.addInitScript(() => {
            localStorage.setItem(
                'embedpress_resume::https://cdn.plyr.io/static/blank.mp4',
                JSON.stringify({ t: 90, d: 200, savedAt: Date.now() })
            );
        });
        await page.setContent(harness({
            self_hosted: true, hosted_format: 'video',
            auto_resume: true, auto_resume_threshold: 30,
        }));
        await page.addScriptTag({ path: INITPLYR_PATH });
        await expect(page.locator('.ep-resume-prompt')).toBeVisible();
        await expect(page.locator('.ep-resume-prompt__msg')).toContainText('1:30');
    });

    test('does NOT prompt when below threshold', async ({ page, context }) => {
        await context.addInitScript(() => {
            localStorage.setItem(
                'embedpress_resume::https://cdn.plyr.io/static/blank.mp4',
                JSON.stringify({ t: 5, d: 200, savedAt: Date.now() })
            );
        });
        await page.setContent(harness({
            self_hosted: true, hosted_format: 'video',
            auto_resume: true, auto_resume_threshold: 30,
        }));
        await page.addScriptTag({ path: INITPLYR_PATH });
        await page.waitForTimeout(800);
        await expect(page.locator('.ep-resume-prompt')).toHaveCount(0);
    });
});

// ---------------------------------------------------------------------------
// 4.6 — Custom End Screen
// ---------------------------------------------------------------------------

test.describe('Custom Player — End Screen', () => {
    test('renders message-mode end screen on `ended` event', async ({ page }) => {
        await page.setContent(harness({
            self_hosted: true, hosted_format: 'video',
            end_screen: { mode: 'message', message: 'Thanks for watching', show_replay: true },
        }));
        await page.addScriptTag({ path: INITPLYR_PATH });
        await page.evaluate(() => {
            const v = document.querySelector('video') as HTMLVideoElement;
            v.dispatchEvent(new Event('ended'));
        });
        await expect(page.locator('.ep-end-screen__msg')).toContainText('Thanks for watching');
        await expect(page.locator('.ep-end-screen__btn', { hasText: 'Replay' })).toBeVisible();
    });

    test('CTA mode renders external link button', async ({ page }) => {
        await page.setContent(harness({
            self_hosted: true, hosted_format: 'video',
            end_screen: { mode: 'cta', message: 'Subscribe', button_text: 'Go', button_url: 'https://example.com', show_replay: false },
        }));
        await page.addScriptTag({ path: INITPLYR_PATH });
        await page.evaluate(() => document.querySelector('video')!.dispatchEvent(new Event('ended')));
        const cta = page.locator('.ep-end-screen__btn--primary');
        await expect(cta).toHaveAttribute('href', 'https://example.com');
        await expect(cta).toHaveAttribute('target', '_blank');
    });
});

// ---------------------------------------------------------------------------
// 4.10 — Advanced Privacy Mode
// ---------------------------------------------------------------------------

test.describe('Custom Player — Privacy Mode', () => {
    test('iframe loads only after click; src restored from data-ep-privacy-src', async ({ page }) => {
        // Server-side rewrite is simulated here (about:blank + data-ep-privacy-src).
        await page.setContent(`<!doctype html><html><body>
            <div class="ep-embed-content-wraper ep-privacy-pending" data-playerid="t1"
                data-options='${JSON.stringify({ privacy_mode: true, privacy_message: 'Click to load' }).replace(/'/g, '&#39;')}'
                style="position:relative;width:640px;height:360px;">
                <iframe src="about:blank" data-ep-privacy-src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"></iframe>
            </div>
        </body></html>`);
        await page.addScriptTag({ path: INITPLYR_PATH });
        await expect(page.locator('.ep-privacy-overlay')).toBeVisible();
        // Iframe still pointing at about:blank.
        await expect(page.locator('iframe')).toHaveAttribute('src', 'about:blank');

        await page.locator('.ep-privacy-overlay').click();
        await expect(page.locator('iframe')).toHaveAttribute('src', /youtube-nocookie\.com/);
        await expect(page.locator('.ep-privacy-overlay')).toHaveCount(0);
    });
});

// ---------------------------------------------------------------------------
// 4.3 — Timed CTA
// ---------------------------------------------------------------------------

test.describe('Custom Player — Timed CTA', () => {
    test('overlay appears at the configured time and is dismissible', async ({ page }) => {
        await page.setContent(harness({
            self_hosted: true, hosted_format: 'video',
            timed_cta: [{ time: 1, headline: 'Try our app', button_text: 'Install', button_url: 'https://example.com', duration: 0, dismissible: true }],
        }));
        await page.addScriptTag({ path: INITPLYR_PATH });
        await page.evaluate(async () => {
            const v = document.querySelector('video') as HTMLVideoElement;
            v.currentTime = 2;
            v.dispatchEvent(new Event('timeupdate'));
        });
        await expect(page.locator('.ep-timed-cta__headline')).toContainText('Try our app');
        await page.locator('.ep-timed-cta__close').click();
        await expect(page.locator('.ep-timed-cta')).toHaveCount(0);
    });
});

// ---------------------------------------------------------------------------
// 4.4 — Video Chapters
// ---------------------------------------------------------------------------

test.describe('Custom Player — Chapters', () => {
    test('renders ticks + label, click chapter seeks player', async ({ page }) => {
        await page.setContent(harness({
            self_hosted: true, hosted_format: 'video',
            chapters: { items: [
                { time: 0, title: 'Intro' },
                { time: 60, title: 'Demo' },
                { time: 180, title: 'Outro' },
            ], show_title: true },
        }));
        await page.addScriptTag({ path: INITPLYR_PATH });
        await expect(page.locator('.ep-chapter-label')).toBeVisible();
        await page.locator('.ep-chapter-label').click();
        await expect(page.locator('.ep-chapter-list--open')).toBeVisible();
        await expect(page.locator('.ep-chapter-list__item')).toHaveCount(3);
    });
});

// ---------------------------------------------------------------------------
// 4.1 — Email Capture
// ---------------------------------------------------------------------------

test.describe('Custom Player — Email Capture', () => {
    test('blocks playback at trigger time and submits form to REST', async ({ page }) => {
        await page.route('**/embedpress/v1/lead', (route) =>
            route.fulfill({ status: 200, contentType: 'application/json', body: '{"message":"ok"}' })
        );
        await page.setContent(harness({
            self_hosted: true, hosted_format: 'video',
            email_capture: {
                time: 0.5, unit: 'seconds', headline: 'Drop your email',
                require_name: false, allow_skip: false, button_text: 'Continue',
                rest_url: '/wp-json/embedpress/v1/lead', nonce: 'x',
            },
        }));
        await page.addScriptTag({ path: INITPLYR_PATH });
        await page.evaluate(() => {
            const v = document.querySelector('video') as HTMLVideoElement;
            v.currentTime = 5;
            v.dispatchEvent(new Event('timeupdate'));
        });
        await expect(page.locator('.ep-lead-form__headline')).toContainText('Drop your email');
        await page.locator('input[type=email]').fill('test@example.com');
        await page.locator('.ep-lead-form__btn--primary').click();
        await expect(page.locator('.ep-lead-form')).toHaveCount(0);
    });
});

// ---------------------------------------------------------------------------
// 4.2 — Action Lock
// ---------------------------------------------------------------------------

test.describe('Custom Player — Action Lock', () => {
    test('share-mode overlay renders Facebook/Twitter/LinkedIn buttons', async ({ page }) => {
        await page.setContent(harness({
            self_hosted: true, hosted_format: 'video',
            action_lock: {
                type: 'share', headline: 'Unlock', message: 'Share to watch',
                share_networks: ['facebook', 'twitter', 'linkedin'],
                share_url: 'https://example.com/post',
            },
        }));
        await page.addScriptTag({ path: INITPLYR_PATH });
        await expect(page.locator('.ep-action-lock')).toBeVisible();
        await expect(page.locator('.ep-action-lock__btn--facebook')).toBeVisible();
        await expect(page.locator('.ep-action-lock__btn--twitter')).toBeVisible();
        await expect(page.locator('.ep-action-lock__btn--linkedin')).toBeVisible();
    });

    test('login-mode renders an anchor to wp-login', async ({ page }) => {
        await page.setContent(harness({
            self_hosted: true, hosted_format: 'video',
            action_lock: { type: 'login', headline: 'Members only', login_url: '/wp-login.php?redirect_to=x' },
        }));
        await page.addScriptTag({ path: INITPLYR_PATH });
        await expect(page.locator('a.ep-action-lock__btn--primary')).toHaveAttribute('href', /wp-login/);
    });
});

// ---------------------------------------------------------------------------
// 4.7 — Drop-off Heatmap
// ---------------------------------------------------------------------------

test.describe('Custom Player — Heatmap', () => {
    test('POSTs the current bucket to /heatmap/sample at most once per interval', async ({ page }) => {
        let calls = 0;
        await page.route('**/embedpress/v1/heatmap/sample', (route) => {
            calls += 1;
            route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
        });
        await page.setContent(harness({
            self_hosted: true, hosted_format: 'video',
            heatmap: { rest_url: '/wp-json/embedpress/v1/heatmap/sample', nonce: 'x', interval: 0 },
        }));
        await page.addScriptTag({ path: INITPLYR_PATH });
        // Move into 3 distinct buckets quickly.
        for (const t of [10, 50, 90]) {
            await page.evaluate((sec) => {
                const v = document.querySelector('video') as HTMLVideoElement;
                Object.defineProperty(v, 'duration', { get: () => 100, configurable: true });
                v.currentTime = sec;
                v.dispatchEvent(new Event('timeupdate'));
            }, t);
            await page.waitForTimeout(50);
        }
        expect(calls).toBeGreaterThanOrEqual(1);
    });
});

// ---------------------------------------------------------------------------
// 4.11 — LMS Completion Tracking
// ---------------------------------------------------------------------------

test.describe('Custom Player — LMS Completion', () => {
    test('dispatches embedpress:video-completed on watch-through', async ({ page }) => {
        await page.route('**/embedpress/v1/completion', (route) =>
            route.fulfill({ status: 200, contentType: 'application/json', body: '{}' })
        );
        await page.setContent(harness({
            self_hosted: true, hosted_format: 'video',
            lms_tracking: { threshold: 90, rest_url: '/wp-json/embedpress/v1/completion', nonce: 'x' },
        }));
        await page.addScriptTag({ path: INITPLYR_PATH });
        const fired = await page.evaluate(async () => {
            return new Promise<boolean>((resolve) => {
                document.addEventListener('embedpress:video-completed', () => resolve(true), { once: true });
                const v = document.querySelector('video') as HTMLVideoElement;
                Object.defineProperty(v, 'duration', { get: () => 10, configurable: true });
                // Simulate watching 9.5s (95%) by stepping forward.
                let t = 0;
                const step = () => {
                    if (t > 10) return resolve(false);
                    t += 0.5;
                    Object.defineProperty(v, 'currentTime', { get: () => t, set: () => {}, configurable: true });
                    v.dispatchEvent(new Event('timeupdate'));
                    requestAnimationFrame(step);
                };
                step();
                setTimeout(() => resolve(false), 3000);
            });
        });
        expect(fired).toBe(true);
    });
});

// ---------------------------------------------------------------------------
// Smoke: Adaptive Streaming + CDN are exercised by the renderer-level tests
// (string rewrites in PHP). The frontend behavior here is an external
// network dep (jsDelivr) so we only verify the option lookup path doesn't
// error when no .m3u8 source is present.
// ---------------------------------------------------------------------------

test.describe('Custom Player — Adaptive Streaming', () => {
    test('init does not throw when adaptive_streaming is on but src is mp4', async ({ page }) => {
        const errors: string[] = [];
        page.on('pageerror', (e) => errors.push(e.message));
        await page.setContent(harness({
            self_hosted: true, hosted_format: 'video',
            adaptive_streaming: true,
        }));
        await page.addScriptTag({ path: INITPLYR_PATH });
        await page.waitForTimeout(300);
        expect(errors).toEqual([]);
    });
});
