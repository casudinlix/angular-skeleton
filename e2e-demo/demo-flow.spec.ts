import { expect, test } from '@playwright/test';

test('demo login, pagination, create/search and logout work against the actual localhost API', async ({ page }, testInfo) => {
  await page.goto('/login');
  await expect(page.getByText(/mode demo|demo mode/i)).toBeVisible();
  await page.locator('#login-email').fill('demo@example.test');
  await page.locator('#login-password').fill('demo12345');
  await page.getByRole('button', { name: /masuk|sign in/i }).click();
  await expect(page).toHaveURL(/\/customers(?:\?.*)?$/);

  const rows = page.locator('table tbody tr');
  await expect(rows).toHaveCount(20);
  await page.getByRole('button', { name: /halaman berikutnya|next page/i }).click();
  await expect(rows).toHaveCount(16);
  await page.getByRole('button', { name: /halaman sebelumnya|previous page/i }).click();
  await expect(rows).toHaveCount(20);

  await page.getByRole('button', { name: /tambah pelanggan|new customer/i }).click();
  const dialog = page.locator('dialog[open]');
  await expect(dialog).toBeVisible();

  const name = 'Sample UI ' + testInfo.project.name;
  const email = 'sample-' + testInfo.project.name + '@example.test';
  await dialog.locator('#customer-name').fill(name);
  await dialog.locator('#customer-email').fill(email);
  await dialog.getByRole('button', { name: /simpan|save/i }).click();
  await expect(dialog).toBeHidden();

  await page.locator('#customer-search').fill(email);
  await expect(page.locator('table tbody tr')).toHaveCount(1);
  await expect(page.locator('table')).toContainText(email);

  await page.getByRole('button', { name: /keluar|sign out/i }).click();
  await expect(page).toHaveURL('/');
  await page.goto('/customers');
  await expect(page).toHaveURL(/\/login\?returnUrl=/);
});
