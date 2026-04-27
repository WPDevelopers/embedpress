const { test, expect } = require('@playwright/test');

let slug = 'playwright-gutenberg/gutenberg-content-protection/';

// User Login 
const subscriberUser = process.env.SUBSCRIBER_USER;
const subscriberPass = process.env.SUBSCRIBER_PASS;

test.describe('Content Protection Pro Feature - Gutenberg Editor', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(slug);
    });

    test('Should protect content in Gutenberg editor', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Gutenberg Content Protection' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Content Protection Type : User Role – Subscriber', exact: true })).toBeVisible();
        await expect(page.locator('#ep-gutenberg-content-d28ff816f12dacc66f143459b582620f').getByText('You do not have access to')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Content Protection Type : Password – Password is' })).toBeVisible();
        await expect(page.locator('#ep-gutenberg-content-366d986477571ab26b22fdb60bc0f582').getByText('Content Locked Content is')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Content Protection Type : User Role – Subscriber : PDF Support' })).toBeVisible();
        await expect(page.locator('#embedpress-pdf-1737615603282').getByText('You do not have access to')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Content Protection Type : Password – 69769 : PDF Support' })).toBeVisible();
        await expect(page.locator('#embedpress-pdf-1737615683818').getByText('Content Locked Content is')).toBeVisible();
    });

    test('Content Protection Type : Password Should Visibile', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Content Protection Type : Password – Password is' })).toBeVisible();
        await expect(page.locator('#ep-gutenberg-content-366d986477571ab26b22fdb60bc0f582').getByText('Content Locked Content is')).toBeVisible();
        await expect(page.locator('iframe[title="আপনাকে কেন ভালবাসি\\, ইয়া রাসুলাল্লাহ \\(সঃ\\)\\? \\[Baseera\\]"]').contentFrame().locator('.ytp-cued-thumbnail-overlay-image')).toBeHidden();
        await page.locator('input[name="pass_366d986477571ab26b22fdb60bc0f582"]').click();
        await page.locator('input[name="pass_366d986477571ab26b22fdb60bc0f582"]').fill('96796');
        await page.locator('#ep-gutenberg-content-366d986477571ab26b22fdb60bc0f582').getByRole('button', { name: 'Unlock' }).click();
        await expect(page.locator('iframe[title="আপনাকে কেন ভালবাসি\\, ইয়া রাসুলাল্লাহ \\(সঃ\\)\\? \\[Baseera\\]"]').contentFrame().locator('.ytp-cued-thumbnail-overlay-image')).toBeVisible();

        // Content Protection Type: Password – 69769 : PDF Support

        await expect(page.getByRole('heading', { name: 'Content Protection Type : Password – 69769 : PDF Support' })).toBeVisible();
        await expect(page.getByText('Content Locked Content is')).toBeVisible();
        await expect(page.locator('iframe[title="Kubernetes_book"]').contentFrame().getByText('Brendan Burns,Joe Beda &')).toBeHidden();
        await page.getByPlaceholder('Password').click();
        await page.getByPlaceholder('Password').fill('69769');
        await page.getByRole('button', { name: 'Unlock' }).click();
        await expect(page.locator('iframe[title="Kubernetes_book"]').contentFrame().getByText('Brendan Burns,Joe Beda &')).toBeVisible();
    });

    test('Content Protection Type : User Role Should Visibile', async ({ page }) => {
        if (!subscriberUser || !subscriberPass) {
            throw new Error('Environment variables SUBSCRIBER_USER and SUBSCRIBER_PASS are not set.');
        }
        await page.goto('https://ep-automation.mdnahidhasan.com/wp-admin');
        await page.getByLabel('Username or Email Address').click();
        await page.getByLabel('Username or Email Address').fill(subscriberUser);
        await page.getByLabel('Password', { exact: true }).click();
        await page.getByLabel('Password', { exact: true }).fill(subscriberPass);
        await page.getByRole('button', { name: 'Log In' }).click();
        await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible();
        await page.goto(slug);

        // Based On User Role Content Should Be Visible
        await expect(page.locator('#embedpress-pdf-1737615603282').getByText('You do not have access to')).toBeHidden();
        await expect(page.locator('iframe[title="sample_pdf"]').contentFrame().getByText('PDF Bookmark Sample Page 1 of')).toBeVisible();
        await expect(page.locator('#ep-gutenberg-content-d28ff816f12dacc66f143459b582620f').getByText('You do not have access to')).toBeHidden();
        await expect(page.locator('iframe[title="আপনাকে কেন ভালবাসি\\, ইয়া রাসুলাল্লাহ \\(সঃ\\)\\? \\[Baseera\\]"]').contentFrame().locator('.ytp-cued-thumbnail-overlay-image')).toBeVisible();
    });
});

