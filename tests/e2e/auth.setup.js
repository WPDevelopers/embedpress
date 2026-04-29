import { test as setup, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const authFile = path.join(__dirname, '../../playwright/.auth/user.json');

const username = process.env.WP_ADMIN_USER || process.env.USERNAME || 'admin';
const password = process.env.WP_ADMIN_PASS || process.env.PASSWORD || 'admin';

setup('authenticate', async ({ page }) => {
    await page.goto('wp-login.php');
    await page.getByLabel('Username or Email Address').fill(username);
    await page.getByLabel('Password', { exact: true }).fill(password);
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.waitForURL('**/wp-admin/**');
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    await page.context().storageState({ path: authFile });
});
