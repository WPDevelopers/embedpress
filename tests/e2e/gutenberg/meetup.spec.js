const { test, expect } = require('@playwright/test');


test.describe('Gutenberg MeetUp', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('playwright-gutenberg/gutenberg-meetup/');
    });

    // Single MeetUp 
    test('Embed Gutenberg Single MeetUp', async ({ page }) => {
        await expect(page.locator('header').filter({ hasText: 'Friday, May 23, 2025 · 1:00' })).toBeVisible();
    });
    // Group MeetUp 
    test('Embed Gutenberg Group MeetUp', async ({ page }) => {
        await expect(page.locator('div').filter({ hasText: 'Events' }).first()).toBeVisible();
        await expect(page.getByRole('heading', { name: 'MeetUp Group' })).toBeVisible();
        await page.getByRole('heading', { name: 'Events – Veg Society of DC' }).click();
        await expect(page.locator('.ep-single-event > .ep-event-content').first()).toBeVisible();
        await expect(page.getByRole('link', { name: 'Attend' }).first()).toBeVisible();
        await expect(page.getByText('40 attendees')).toBeVisible();
        await expect(page.locator('article:nth-child(2) > .ep-event-content')).toBeVisible();
    });
});

