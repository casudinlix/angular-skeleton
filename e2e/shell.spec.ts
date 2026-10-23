import { test, expect } from '@playwright/test';
test('public home and language toggle', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Pondasi');
  await page.getByLabel('Bahasa').selectOption('en');
  await expect(page.locator('h1')).toContainText('Enterprise');
  await page.reload();
  await expect(page.locator('h1')).toContainText('Enterprise');
});
test('unknown routes show 404', async ({ page }) => {
  await page.goto('/this-route-does-not-exist');
  await expect(page.locator('h1')).toContainText('Halaman');
  await expect(page.getByText('404', { exact: true })).toBeVisible();
});
test('protected customers redirect when session API is absent', async ({ page }) => {
  await page.goto('/customers');
  await expect(page).toHaveURL(/\/(login|500)/);
});
