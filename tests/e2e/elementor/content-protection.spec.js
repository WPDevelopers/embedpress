const { test, expect } = require('@playwright/test');

let slug = 'playwright-elementor/elementor-content-protection/';

// User Login 
const subscriberUser = process.env.SUBSCRIBER_USER;
const subscriberPass = process.env.SUBSCRIBER_PASS;

test.describe('Content Protection Pro Feature - Elementor Editor', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(slug);
    });

    test('Should protect content in Elementor editor', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Content Protection Type : User Role - Subscriber', exact: true })).toBeVisible();
        await expect(page.locator('#ep-elements-id-457260e').getByText('You do not have access to')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Content Protection Type : Password - Password is' })).toBeVisible();
        await expect(page.locator('#ep-elements-id-a8e79aa').getByText('Content Locked Content is')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Content Protection Type : User Role - Subscriber : PDF Support' })).toBeVisible();
        await expect(page.locator('#ep-elementor-content-5d16632').getByText('You do not have access to')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Content Protection Type : Password - 69769 : PDF Support' })).toBeVisible();
        await expect(page.locator('#ep-elementor-content-f5057f4').getByText('Content Locked Content is')).toBeVisible();
    });

    test('Content Protection Type : Password Should Visibile', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Content Protection Type : Password - Password is' })).toBeVisible();
        await expect(page.locator('iframe[title="আপনাকে কেন ভালবাসি\\, ইয়া রাসুলাল্লাহ \\(সঃ\\)\\? \\[Baseera\\]"]').contentFrame().locator('.ytp-cued-thumbnail-overlay-image')).toBeHidden();
        await page.locator('input[name="pass_a8e79aa"]').click();
        await page.locator('input[name="pass_a8e79aa"]').fill('96796');
        await page.locator('#ep-elements-id-a8e79aa').getByRole('button', { name: 'Unlock' }).click();
        await expect(page.locator('iframe[title="আপনাকে কেন ভালবাসি\\, ইয়া রাসুলাল্লাহ \\(সঃ\\)\\? \\[Baseera\\]"]').contentFrame().locator('.ytp-cued-thumbnail-overlay-image')).toBeVisible();

        // Content Protection Type: Password - 69769 : PDF Support

        await expect(page.getByRole('heading', { name: 'Content Protection Type : Password - 69769 : PDF Support' })).toBeVisible();
        await expect(page.locator('iframe[title="sample_pdf"]').contentFrame().getByText('PDF Bookmark Sample Page 1 of')).toBeHidden();
        await page.getByPlaceholder('Password').click();
        await page.getByPlaceholder('Password').fill('69769');
        await page.getByRole('button', { name: 'Unlock' }).click();
        await expect(page.locator('iframe[title="sample_pdf"]').contentFrame().getByText('PDF Bookmark Sample Page 1 of')).toBeVisible();
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

        await expect(page.getByRole('heading', { name: 'Content Protection Type : User Role - Subscriber', exact: true })).toBeVisible();
        await expect(page.locator('iframe[title="আপনাকে কেন ভালবাসি\\, ইয়া রাসুলাল্লাহ \\(সঃ\\)\\? \\[Baseera\\]"]').contentFrame().locator('video')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Content Protection Type : User Role - Subscriber : PDF Support' })).toBeVisible();
        await expect(page.locator('iframe[title="sample_pdf"]').contentFrame().getByText('PDF Bookmark Sample Page 1 of')).toBeVisible();
    });
});

