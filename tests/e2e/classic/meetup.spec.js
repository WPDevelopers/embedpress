const { test, expect } = require('@playwright/test');

test.describe('Classic MeetUp', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://ep-automation.mdnahidhasan.com/classic-meetup/');
    });

    test('Embed Classic Single MeetUp Event', async ({ page }) => {
        await expect(page.getByRole('link', { name: 'Newark Tech Week' })).toBeVisible();
        await expect(page.getByText('October 13, 2025, 6:00 pm GMT+')).toBeVisible();
        await expect(page.getByRole('link', { name: 'Newark Tech Week' })).toBeVisible();
        await expect(page.getByText('Hosted by CITI MEDINA')).toBeVisible();
        await expect(page.getByRole('img', { name: 'Newark Tech Week' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'View Event Details' })).toBeVisible();
    });

    test('Embed Classic Group MeetUp Event', async ({ page }) => {
        await expect(page.getByText('Group Events')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Events - Veg Society of DC' })).toBeVisible();
        await expect(page.getByRole('paragraph').filter({ hasText: 'Events - Veg Society of DC' })).toBeVisible();
        await expect(page.getByText('April 19, 2026, 8:00 pm GMT+')).toBeVisible();
        await expect(page.getByRole('link', { name: 'VSDC Vegan Trekkers: visit to' })).toBeVisible();
        await expect(page.locator('article:nth-child(2) > .ep-event-content')).toBeVisible();
        await expect(page.locator('article:nth-child(3) > .ep-event-content')).toBeVisible();
        await expect(page.getByRole('link', { name: 'VSDC Vegan Trekkers: Maryland' })).toBeVisible();
        await expect(page.locator('#post-10153').getByRole('article').filter({ hasText: 'April 12, 2026, 11:00 pm GMT+' }).getByRole('link').nth(1)).toBeVisible();
    });
});

// As now we only have embed support for MeetUp

