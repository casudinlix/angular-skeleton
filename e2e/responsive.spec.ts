import { expect, test, type Page } from '@playwright/test';

async function assertWithinViewport(page: Page, description: string): Promise<void> {
  const widths = await page.evaluate(() => ({
    content: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
    viewport: document.documentElement.clientWidth,
  }));
  expect.soft(
    widths.content - widths.viewport,
    description + ': document must not scroll horizontally (use local scrolling for wide data)',
  ).toBeLessThanOrEqual(2);
}

test('home layout reflows across mobile, tablet, desktop and ultrawide widths', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('h1')).toBeVisible();
  for (const width of [280, 320, 360, 375, 390, 430, 600, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: width < 768 ? 667 : 900 });
    await assertWithinViewport(page, 'home at ' + width + ' CSS px');
  }
});

test('login and error pages reflow and remain readable', async ({ page }) => {
  for (const path of ['/login', '/403', '/not-found']) {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1')).toBeVisible();
    for (const width of [280, 320, 390, 768, 1280]) {
      await page.setViewportSize({ width, height: 568 });
      await assertWithinViewport(page, path + ' at ' + width + ' CSS px');
    }
  }
});

test('mobile menu opens and closes, desktop nav remains visible', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const nav = page.locator('#main-navigation');
  const toggle = page.getByRole('button', { name: /buka menu|open menu/i });
  await expect(nav).toBeHidden();
  await toggle.click();
  await expect(nav).toBeVisible();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await assertWithinViewport(page, 'expanded mobile navigation');
  await nav.getByRole('link', { name: /ringkasan|overview/i }).click();
  await expect(nav).toBeHidden();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');

  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(nav).toBeVisible();
  await assertWithinViewport(page, 'desktop navigation after mobile collapse');
});

test('browser text scaling does not clip the page or prevent keyboard focus', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.setViewportSize({ width: 320, height: 640 });
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  await assertWithinViewport(page, '200% root text size at 320px');
  const menu = page.getByRole('button', { name: /buka menu|open menu/i });
  await menu.focus();
  await expect(menu).toBeFocused();
  await menu.click();
  await assertWithinViewport(page, 'expanded navigation at 200% text size');
});

test('uses Plus Jakarta Sans with local fallbacks and vector branding for high DPI', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const font = await page.evaluate(() => getComputedStyle(document.documentElement).fontFamily);
  expect(font).toContain('Plus Jakarta Sans');
  const logo = page.locator('img[src="/assets/branding/skeleton-mark.svg"]');
  await expect(logo).toBeVisible();
  await expect(logo).toHaveJSProperty('complete', true);
  expect(await logo.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  await assertWithinViewport(page, 'vector icon at current device pixel ratio');
});
