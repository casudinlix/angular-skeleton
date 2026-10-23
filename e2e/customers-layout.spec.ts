import { expect, test } from '@playwright/test';

test('customer tables scroll locally and dialogs stay usable on small screens', async ({ page }) => {
  await page.route('**/api/session', async (route) => {
    if (route.request().method() !== 'GET') return route.fallback();
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'layout-test-user',
        displayName: 'Responsive QA',
        permissions: ['customers:read', 'customers:create', 'customers:update', 'customers:delete'],
      }),
    });
  });
  await page.route('**/api/customers**', async (route) => {
    if (route.request().method() !== 'GET') return route.fallback();
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        items: [{
          id: 'example-0001',
          name: 'Very Long Example Company Customer Name for Responsive Layout',
          email: 'unusually-long-example-customer-address@example-company-for-ui-testing.invalid',
          status: 'active',
        }],
        nextCursor: null,
      }),
    });
  });
  await page.goto('/customers', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('table')).toBeVisible();

  const scroller = page.locator('.app-scroll-region');
  for (const width of [280, 320, 375, 390, 600, 768, 1024, 1280]) {
    await page.setViewportSize({ width, height: width <= 430 ? 568 : 800 });
    const metrics = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
    }));
    expect.soft(metrics.content - metrics.viewport, 'customers width: ' + width).toBeLessThanOrEqual(2);
    await expect(scroller).toBeVisible();
  }

  await page.setViewportSize({ width: 320, height: 568 });
  const scrollMetrics = await scroller.evaluate((element) => ({
    visibleWidth: element.clientWidth,
    totalWidth: element.scrollWidth,
  }));
  expect(scrollMetrics.totalWidth).toBeGreaterThan(scrollMetrics.visibleWidth);
  await scroller.focus();
  await expect(scroller).toBeFocused();

  await page.getByRole('button', { name: /tambah pelanggan|new customer/i }).click();
  const dialog = page.locator('dialog[open]');
  await expect(dialog).toBeVisible();
  const bounds = await dialog.boundingBox();
  expect(bounds).not.toBeNull();
  if (bounds) {
    expect(bounds.width).toBeLessThanOrEqual(320);
    expect(bounds.height).toBeLessThanOrEqual(568);
  }
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('mobile navigation, accessible contrast mode and locale survive reload', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.getByRole('button', { name: /ubah tema|toggle theme/i }).click();
  await expect(page.locator('html')).not.toHaveClass(/dark/);
  await page.getByRole('button', { name: /ubah tema|toggle theme/i }).click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.getByLabel('Bahasa').selectOption('en');
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('h1')).toContainText('Enterprise');
});
