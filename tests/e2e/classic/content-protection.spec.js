const { test, expect } = require('@playwright/test');

let slug = 'playwright-classic-editor/classic-content-protection/';

// User Login 
const subscriberUser = process.env.SUBSCRIBER_USER;
const subscriberPass = process.env.SUBSCRIBER_PASS;

test.describe('Content Protection Pro Feature - Classic Editor', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(slug);
        await expect(page.getByRole('heading', { name: 'Classic Content Protection' })).toBeVisible();
    });

    test('Should protect content in classic editor', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Content Protection Type : User Role – Subscriber', exact: true })).toBeVisible();
        await expect(page.getByText('Only editor will see the')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Content Protection Type : Password – Password is' })).toBeVisible();
        await expect(page.locator('iframe[title="আপনাকে কেন ভালবাসি\\, ইয়া রাসুলাল্লাহ \\(সঃ\\)\\? \\[Baseera\\]"]').contentFrame().locator('.ytp-cued-thumbnail-overlay-image')).toBeHidden();
        await expect(page.getByText('Content Locked Content is')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Content Protection Type : User Role – Subscriber : PDF Support' })).toBeVisible();
        await expect(page.getByText('This content is protected.')).toBeVisible();
        await expect(page.locator('iframe[title="sample_pdf"]').contentFrame().locator('#viewer')).toBeHidden();
    });

    test('Content Protection Type : Password Should Visibile', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Content Protection Type : Password – Password is' })).toBeVisible();
        await expect(page.getByText('Content Locked Content is')).toBeVisible();
        await expect(page.locator('iframe[title="আপনাকে কেন ভালবাসি\\, ইয়া রাসুলাল্লাহ \\(সঃ\\)\\? \\[Baseera\\]"]').contentFrame().locator('.ytp-cued-thumbnail-overlay-image')).toBeHidden();
        await page.getByPlaceholder('Password').click();
        await page.getByPlaceholder('Password').fill('96796');
        await page.getByRole('button', { name: 'Unlock' }).click();
        await expect(page.locator('iframe[title="আপনাকে কেন ভালবাসি\\, ইয়া রাসুলাল্লাহ \\(সঃ\\)\\? \\[Baseera\\]"]').contentFrame().locator('.ytp-cued-thumbnail-overlay-image')).toBeVisible();
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
        await expect(page.getByText('Only editor will see the')).toBeHidden();
        await expect(page.getByText('This content is protected.')).toBeHidden();
        await expect(page.locator('iframe[title="আপনাকে কেন ভালবাসি\\, ইয়া রাসুলাল্লাহ \\(সঃ\\)\\? \\[Baseera\\]"]').contentFrame().locator('.ytp-cued-thumbnail-overlay-image')).toBeVisible();
        await expect(page.locator('iframe[title="sample_pdf"]').contentFrame().locator('#viewer')).toBeVisible();
    });
});

