import { test, expect } from '@playwright/test';
import * as path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * E2E coverage for the 12 advanced custom-player features (card 81243).
 *
 * Strategy
 * --------
 * The frontend logic lives in `static/js/initplyr.js` as a set of helper
 * functions (epInit*, epShow*) that the main `initPlayer()` wires together.
 * Driving the full flow through Plyr's async lifecycle (loadedmetadata,
 * ready, timeupdate) is fragile in CI and depends on a real video file
 * loading.
 *
 * Instead, each test:
 *   1. Loads a Plyr-free harness on a real http origin (so localStorage
 *      and sessionStorage work — `setContent` runs on about:blank which
 *      blocks them).
 *   2. Injects initplyr.js (the helpers become global function declarations).
 *   3. Calls the relevant helper directly with a fake player object that
 *      mimics Plyr's `.on()` / `.once()` / `.currentTime` / `.duration`
 *      surface. We can fire arbitrary events synchronously via `fire()`.
 *   4. Asserts the overlay / network behavior.
 *
 * This keeps tests deterministic and offline while still exercising the
 * actual production helpers from initplyr.js.
 */

test.use({ storageState: { cookies: [], origins: [] } });

const INITPLYR_PATH = path.resolve(__dirname, '../../static/js/initplyr.js');

/**
 * Plyr-free harness — provides just the wrapper structure the helpers
 * expect. The video src controls the localStorage key for resume / leads.
 */
function harnessNoPlyr(extraInner: string = '') {
    return `<!doctype html>
<html><head><meta charset="utf-8"/></head><body>
<div class="ep-embed-content-wraper" data-playerid="t1"
    style="position:relative;width:640px;height:360px;">
    <div class="ose-embedpress-responsive">
        <video src="https://example.test/v.mp4" controls></video>
        ${extraInner}
    </div>
</div>
</body></html>`;
}

async function loadOnRealOrigin(page: import('@playwright/test').Page, html: string) {
    await page.route('http://test.local/', (route) =>
        route.fulfill({ contentType: 'text/html; charset=utf-8', body: html })
    );
    await page.goto('http://test.local/');
    await page.addScriptTag({ path: INITPLYR_PATH });
}

/**
 * JS source for a fake Plyr-shaped player. Eval'd inside `page.evaluate`.
 */
const FAKE_PLAYER = `
    (() => {
        const listeners = {};
        const player = {
            _state: { time: 0, duration: 200 },
            get currentTime() { return this._state.time; },
            set currentTime(v) { this._state.time = v; },
            get duration() { return this._state.duration; },
            on(name, cb) { (listeners[name] = listeners[name] || []).push(cb); },
            once(name, cb) { this.on(name, cb); },
            fire(name) { (listeners[name] || []).forEach(cb => cb()); },
            play() {},
            pause() {},
        };
        window.__player = player;
        return player;
    })()
`;

const SOURCE_KEY = 'https://example.test/v.mp4';

// ===========================================================================
// 4.5 — Auto Resume Playback
// ===========================================================================

test.describe('4.5 Auto Resume Playback', () => {
    test('shows Resume prompt when localStorage has a saved position', async ({ page }) => {
        await loadOnRealOrigin(page, harnessNoPlyr());
        await page.evaluate(([k]) => {
            localStorage.setItem('embedpress_resume::' + k, JSON.stringify({ t: 90, d: 200, savedAt: Date.now() }));
        }, [SOURCE_KEY]);
        await page.evaluate(`
            const wrapper = document.querySelector('.ep-embed-content-wraper');
            const player = ${FAKE_PLAYER};
            window.epInitAutoResume(player, wrapper, { auto_resume_threshold: 30 });
        `);
        await expect(page.locator('.ep-resume-prompt')).toBeVisible();
        await expect(page.locator('.ep-resume-prompt__msg')).toContainText('1:30');
    });

    test('does NOT prompt when below threshold', async ({ page }) => {
        await loadOnRealOrigin(page, harnessNoPlyr());
        await page.evaluate(([k]) => {
            localStorage.setItem('embedpress_resume::' + k, JSON.stringify({ t: 5, d: 200, savedAt: Date.now() }));
        }, [SOURCE_KEY]);
        await page.evaluate(`
            const wrapper = document.querySelector('.ep-embed-content-wraper');
            const player = ${FAKE_PLAYER};
            window.epInitAutoResume(player, wrapper, { auto_resume_threshold: 30 });
        `);
        await page.waitForTimeout(200);
        await expect(page.locator('.ep-resume-prompt')).toHaveCount(0);
    });

    test('Resume click sets player.currentTime to saved position', async ({ page }) => {
        await loadOnRealOrigin(page, harnessNoPlyr());
        await page.evaluate(([k]) => {
            localStorage.setItem('embedpress_resume::' + k, JSON.stringify({ t: 42, d: 200, savedAt: Date.now() }));
        }, [SOURCE_KEY]);
        await page.evaluate(`
            const wrapper = document.querySelector('.ep-embed-content-wraper');
            const player = ${FAKE_PLAYER};
            window.epInitAutoResume(player, wrapper, { auto_resume_threshold: 30 });
        `);
        await page.locator('[data-action="resume"]').click();
        const t = await page.evaluate(() => (window as any).__player.currentTime);
        expect(t).toBe(42);
    });
});

// ===========================================================================
// 4.6 — Custom End Screen
// ===========================================================================

test.describe('4.6 Custom End Screen', () => {
    test('message-mode renders message + replay button on `ended`', async ({ page }) => {
        await loadOnRealOrigin(page, harnessNoPlyr());
        await page.evaluate(`
            const wrapper = document.querySelector('.ep-embed-content-wraper');
            const player = ${FAKE_PLAYER};
            window.epInitEndScreen(player, wrapper, { mode: 'message', message: 'Thanks for watching', show_replay: true });
            player.fire('ended');
        `);
        await expect(page.locator('.ep-end-screen__msg')).toContainText('Thanks for watching');
        await expect(page.locator('.ep-end-screen__btn', { hasText: 'Replay' })).toBeVisible();
    });

    test('CTA mode renders external link button', async ({ page }) => {
        await loadOnRealOrigin(page, harnessNoPlyr());
        await page.evaluate(`
            const wrapper = document.querySelector('.ep-embed-content-wraper');
            const player = ${FAKE_PLAYER};
            window.epInitEndScreen(player, wrapper, { mode: 'cta', message: 'Subscribe', button_text: 'Go', button_url: 'https://example.com', show_replay: false });
            player.fire('ended');
        `);
        const cta = page.locator('.ep-end-screen__btn--primary');
        await expect(cta).toHaveAttribute('href', 'https://example.com');
        await expect(cta).toHaveAttribute('target', '_blank');
    });

    test('Replay click calls onReplay and removes overlay', async ({ page }) => {
        await loadOnRealOrigin(page, harnessNoPlyr());
        await page.evaluate(`
            window.__replayed = false;
            const wrapper = document.querySelector('.ep-embed-content-wraper');
            window.epShowEndScreen(wrapper, { mode: 'message', message: 'Done', show_replay: true }, () => { window.__replayed = true; });
        `);
        await page.locator('.ep-end-screen__btn', { hasText: 'Replay' }).click();
        await expect(page.locator('.ep-end-screen')).toHaveCount(0);
        const replayed = await page.evaluate(() => (window as any).__replayed);
        expect(replayed).toBe(true);
    });
});

// ===========================================================================
// 4.10 — Advanced Privacy Mode
// ===========================================================================

test.describe('4.10 Advanced Privacy Mode', () => {
    test('overlay shows; iframe src restored only after click', async ({ page }) => {
        await loadOnRealOrigin(page, `<!doctype html><html><body>
            <div class="ep-embed-content-wraper ep-privacy-pending" data-playerid="t1"
                style="position:relative;width:640px;height:360px;">
                <iframe src="about:blank" data-ep-privacy-src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"></iframe>
            </div>
        </body></html>`);
        await page.evaluate(`
            window.__consented = false;
            const wrapper = document.querySelector('.ep-embed-content-wraper');
            window.epShowPrivacyOverlay(wrapper, { privacy_message: 'Click to load' }, () => {
                window.__consented = true;
                window.epRestorePrivacyIframes(wrapper);
            });
        `);
        await expect(page.locator('.ep-privacy-overlay')).toBeVisible();
        await expect(page.locator('iframe')).toHaveAttribute('src', 'about:blank');

        await page.locator('.ep-privacy-overlay').click();
        await expect(page.locator('iframe')).toHaveAttribute('src', /youtube-nocookie\.com/);
        await expect(page.locator('.ep-privacy-overlay')).toHaveCount(0);
        const consented = await page.evaluate(() => (window as any).__consented);
        expect(consented).toBe(true);
    });

    test('overlay shows custom message text', async ({ page }) => {
        await loadOnRealOrigin(page, `<!doctype html><html><body>
            <div class="ep-embed-content-wraper ep-privacy-pending" data-playerid="t1"
                style="position:relative;width:640px;height:360px;">
                <iframe src="about:blank" data-ep-privacy-src="https://example.com/iframe"></iframe>
            </div>
        </body></html>`);
        await page.evaluate(`
            const wrapper = document.querySelector('.ep-embed-content-wraper');
            window.epShowPrivacyOverlay(wrapper, { privacy_message: 'GDPR notice' }, () => {});
        `);
        await expect(page.locator('.ep-privacy-overlay__msg')).toContainText('GDPR notice');
    });
});

// ===========================================================================
// 4.3 — Timed CTA
// ===========================================================================

test.describe('4.3 Timed CTA', () => {
    test('overlay appears at the configured time and is dismissible', async ({ page }) => {
        await loadOnRealOrigin(page, harnessNoPlyr());
        await page.evaluate(`
            const wrapper = document.querySelector('.ep-embed-content-wraper');
            const player = ${FAKE_PLAYER};
            window.epInitTimedCTA(player, wrapper, [
                { time: 10, headline: 'Try our app', button_text: 'Install', button_url: 'https://example.com', duration: 0, dismissible: true }
            ]);
            player._state.time = 11;
            player.fire('timeupdate');
        `);
        await expect(page.locator('.ep-timed-cta__headline')).toContainText('Try our app');
        await page.locator('.ep-timed-cta__close').click();
        await expect(page.locator('.ep-timed-cta')).toHaveCount(0);
    });

    test('multiple CTAs fire at their respective times', async ({ page }) => {
        await loadOnRealOrigin(page, harnessNoPlyr());
        await page.evaluate(`
            const wrapper = document.querySelector('.ep-embed-content-wraper');
            const player = ${FAKE_PLAYER};
            window.epInitTimedCTA(player, wrapper, [
                { time: 10, headline: 'First', dismissible: true },
                { time: 30, headline: 'Second', dismissible: true },
            ]);
            player._state.time = 11; player.fire('timeupdate');
            player._state.time = 31; player.fire('timeupdate');
        `);
        await expect(page.locator('.ep-timed-cta')).toHaveCount(2);
    });
});

// ===========================================================================
// 4.4 — Video Chapters
// ===========================================================================

test.describe('4.4 Video Chapters', () => {
    test('renders chapter label and clickable chapter list', async ({ page }) => {
        await loadOnRealOrigin(page, harnessNoPlyr(`<div class="plyr__progress" style="position:relative;height:8px;background:#ccc;"></div>`));
        await page.evaluate(`
            const wrapper = document.querySelector('.ep-embed-content-wraper');
            const player = ${FAKE_PLAYER};
            window.epInitChapters(player, wrapper, {
                items: [
                    { time: 0, title: 'Intro' },
                    { time: 60, title: 'Demo' },
                    { time: 180, title: 'Outro' },
                ],
                show_title: true,
            });
            player._state.time = 70;
            player.fire('timeupdate');
        `);
        await expect(page.locator('.ep-chapter-label')).toBeVisible();
        await page.locator('.ep-chapter-label').click();
        await expect(page.locator('.ep-chapter-list--open')).toBeVisible();
        await expect(page.locator('.ep-chapter-list__item')).toHaveCount(3);
    });

    test('clicking a chapter list item seeks the player', async ({ page }) => {
        await loadOnRealOrigin(page, harnessNoPlyr(`<div class="plyr__progress" style="position:relative;height:8px;background:#ccc;"></div>`));
        await page.evaluate(`
            const wrapper = document.querySelector('.ep-embed-content-wraper');
            const player = ${FAKE_PLAYER};
            window.epInitChapters(player, wrapper, {
                items: [{ time: 0, title: 'A' }, { time: 60, title: 'B' }],
                show_title: true,
            });
        `);
        await page.locator('.ep-chapter-label').click();
        await page.locator('.ep-chapter-list__item', { hasText: 'B' }).click();
        const t = await page.evaluate(() => (window as any).__player.currentTime);
        expect(t).toBe(60);
    });
});

// ===========================================================================
// 4.1 — Email Capture
// ===========================================================================

test.describe('4.1 Email Capture', () => {
    test('blocks playback at trigger time and submits form to REST', async ({ page }) => {
        let posted = false;
        await page.route('**/embedpress/v1/lead', (route) => {
            posted = true;
            route.fulfill({ status: 200, contentType: 'application/json', body: '{"message":"ok"}' });
        });
        await loadOnRealOrigin(page, harnessNoPlyr());
        await page.evaluate(`
            const wrapper = document.querySelector('.ep-embed-content-wraper');
            const player = ${FAKE_PLAYER};
            window.epInitEmailCapture(player, wrapper, {
                time: 5, unit: 'seconds', headline: 'Drop your email',
                require_name: false, allow_skip: false, button_text: 'Continue',
                rest_url: '/wp-json/embedpress/v1/lead', nonce: 'x',
            });
            player._state.time = 6;
            player.fire('timeupdate');
        `);
        await expect(page.locator('.ep-lead-form__headline')).toContainText('Drop your email');
        await page.locator('input[type=email]').fill('test@example.com');
        await page.locator('.ep-lead-form__btn--primary').click();
        await expect(page.locator('.ep-lead-form')).toHaveCount(0);
        expect(posted).toBe(true);
    });

    test('rejects invalid email locally before posting', async ({ page }) => {
        let posted = false;
        await page.route('**/embedpress/v1/lead', (route) => {
            posted = true;
            route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
        });
        await loadOnRealOrigin(page, harnessNoPlyr());
        await page.evaluate(`
            const wrapper = document.querySelector('.ep-embed-content-wraper');
            window.epShowEmailCaptureForm(wrapper, {
                headline: 'Email please', allow_skip: false, button_text: 'Go',
                rest_url: '/wp-json/embedpress/v1/lead', nonce: 'x',
            }, () => {});
        `);
        await page.locator('input[type=email]').fill('not-an-email');
        await page.locator('.ep-lead-form__btn--primary').click();
        await expect(page.locator('.ep-lead-form__error')).toBeVisible();
        expect(posted).toBe(false);
    });
});

// ===========================================================================
// 4.2 — Action Lock
// ===========================================================================

test.describe('4.2 Action Lock', () => {
    test('share-mode renders Facebook/Twitter/LinkedIn buttons', async ({ page }) => {
        await loadOnRealOrigin(page, harnessNoPlyr());
        await page.evaluate(`
            const wrapper = document.querySelector('.ep-embed-content-wraper');
            window.epBuildActionLockOverlay(wrapper, {
                type: 'share', headline: 'Unlock', message: 'Share to watch',
                share_networks: ['facebook', 'twitter', 'linkedin'],
                share_url: 'https://example.com/post',
            }, () => {});
        `);
        await expect(page.locator('.ep-action-lock')).toBeVisible();
        await expect(page.locator('.ep-action-lock__btn--facebook')).toBeVisible();
        await expect(page.locator('.ep-action-lock__btn--twitter')).toBeVisible();
        await expect(page.locator('.ep-action-lock__btn--linkedin')).toBeVisible();
    });

    test('login-mode renders an anchor to wp-login', async ({ page }) => {
        await loadOnRealOrigin(page, harnessNoPlyr());
        await page.evaluate(`
            const wrapper = document.querySelector('.ep-embed-content-wraper');
            window.epBuildActionLockOverlay(wrapper, {
                type: 'login', headline: 'Members only', login_url: '/wp-login.php?redirect_to=x'
            }, () => {});
        `);
        await expect(page.locator('a.ep-action-lock__btn--primary')).toHaveAttribute('href', /wp-login/);
    });
});

// ===========================================================================
// 4.7 — Drop-off Heatmap
// ===========================================================================

test.describe('4.7 Drop-off Heatmap', () => {
    test('POSTs the current bucket to /heatmap/sample', async ({ page }) => {
        let posted: any[] = [];
        await page.route('**/embedpress/v1/heatmap/sample', async (route) => {
            const body = route.request().postData() || '';
            posted.push(body);
            route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
        });
        await loadOnRealOrigin(page, harnessNoPlyr());
        await page.evaluate(`
            const wrapper = document.querySelector('.ep-embed-content-wraper');
            const player = ${FAKE_PLAYER};
            player._state.duration = 100;
            window.epInitHeatmap(player, wrapper, { rest_url: '/wp-json/embedpress/v1/heatmap/sample', nonce: 'x', interval: 0 });
            player._state.time = 25; player.fire('timeupdate');
            player._state.time = 50; player.fire('timeupdate');
        `);
        await page.waitForTimeout(150);
        expect(posted.length).toBeGreaterThanOrEqual(1);
    });

    test('does not post twice for the same bucket', async ({ page }) => {
        let calls = 0;
        await page.route('**/embedpress/v1/heatmap/sample', (route) => {
            calls++;
            route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
        });
        await loadOnRealOrigin(page, harnessNoPlyr());
        await page.evaluate(`
            const wrapper = document.querySelector('.ep-embed-content-wraper');
            const player = ${FAKE_PLAYER};
            player._state.duration = 100;
            window.epInitHeatmap(player, wrapper, { rest_url: '/wp-json/embedpress/v1/heatmap/sample', nonce: 'x', interval: 0 });
            // same bucket (5%) repeatedly — should send only once
            for (let i = 0; i < 5; i++) { player._state.time = 5 + i*0.1; player.fire('timeupdate'); }
        `);
        await page.waitForTimeout(150);
        expect(calls).toBe(1);
    });
});

// ===========================================================================
// 4.11 — LMS Completion Tracking
// ===========================================================================

test.describe('4.11 LMS Completion Tracking', () => {
    test('dispatches embedpress:video-completed and POSTs on watch-through', async ({ page }) => {
        let posted = false;
        await page.route('**/embedpress/v1/completion', (route) => {
            posted = true;
            route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
        });
        await loadOnRealOrigin(page, harnessNoPlyr());
        const fired = await page.evaluate(`
            new Promise((resolve) => {
                document.addEventListener('embedpress:video-completed', (e) => resolve(e.detail), { once: true });
                const wrapper = document.querySelector('.ep-embed-content-wraper');
                const player = ${FAKE_PLAYER};
                player._state.duration = 10;
                window.epInitLmsTracking(player, wrapper, { threshold: 90, rest_url: '/wp-json/embedpress/v1/completion', nonce: 'x' });
                let t = 0;
                const tick = () => {
                    if (t > 12) return resolve(null);
                    t += 0.5;
                    player._state.time = t;
                    player.fire('timeupdate');
                    setTimeout(tick, 1);
                };
                tick();
            })
        `);
        expect(fired).not.toBeNull();
        expect((fired as any).total_seconds).toBe(10);
        await page.waitForTimeout(150);
        expect(posted).toBe(true);
    });

    test('does NOT fire when viewer skipped to end', async ({ page }) => {
        let dispatched = false;
        await loadOnRealOrigin(page, harnessNoPlyr());
        dispatched = await page.evaluate(`
            new Promise((resolve) => {
                document.addEventListener('embedpress:video-completed', () => resolve(true));
                const wrapper = document.querySelector('.ep-embed-content-wraper');
                const player = ${FAKE_PLAYER};
                player._state.duration = 100;
                window.epInitLmsTracking(player, wrapper, { threshold: 90, rest_url: '/wp-json/embedpress/v1/completion', nonce: 'x' });
                // Skip directly to 99 — single big delta, doesn't accumulate watched.
                player._state.time = 99;
                player.fire('seeking');
                player.fire('timeupdate');
                player.fire('ended');
                setTimeout(() => resolve(false), 200);
            })
        `);
        expect(dispatched).toBe(false);
    });
});

// ===========================================================================
// 4.8 — Adaptive Streaming
// ===========================================================================

test.describe('4.8 Adaptive Streaming', () => {
    test('skips hls.js / dash.js when src is plain mp4', async ({ page }) => {
        const errors: string[] = [];
        page.on('pageerror', (e) => errors.push(e.message));
        let scriptLoaded = false;
        await page.route('https://cdn.jsdelivr.net/**', (route) => {
            scriptLoaded = true;
            route.fulfill({ status: 200, body: '' });
        });
        await loadOnRealOrigin(page, harnessNoPlyr());
        await page.evaluate(`
            const v = document.querySelector('video');
            window.epAttachAdaptiveStreaming(v);
        `);
        await page.waitForTimeout(150);
        expect(errors).toEqual([]);
        expect(scriptLoaded).toBe(false);
    });

    test('lazy-loads hls.js for .m3u8 source on browsers without native HLS', async ({ page }) => {
        let loaded = false;
        await page.route(/cdn\.jsdelivr\.net\/npm\/hls\.js/, (route) => {
            loaded = true;
            route.fulfill({ status: 200, contentType: 'application/javascript', body: '' });
        });
        await loadOnRealOrigin(page, `<!doctype html><html><body>
            <div class="ep-embed-content-wraper" data-playerid="t1" style="position:relative;width:640px;height:360px;">
                <video src="https://example.test/playlist.m3u8"></video>
            </div>
        </body></html>`);
        await page.evaluate(`
            const v = document.querySelector('video');
            // Force the non-native-HLS branch.
            v.canPlayType = () => '';
            window.epAttachAdaptiveStreaming(v);
        `);
        await page.waitForTimeout(300);
        expect(loaded).toBe(true);
    });
});
