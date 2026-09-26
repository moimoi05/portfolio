import { test, expect } from '@playwright/test';

test('Hero scene pauses, resumes after a click, and respects a changed motion preference', async ({ page, isMobile }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.locator('.hero-badge-stage').scrollIntoViewIfNeeded();
  const pause = page.getByRole('button', { name: 'Pause hero animation' });
  await pause.click();
  const body = page.locator('.hero-mascot-body');
  const frozen = await body.getAttribute('style');
  await page.waitForTimeout(350);
  expect(await body.getAttribute('style')).toBe(frozen);
  await page.getByRole('button', { name: 'Play hero animation' }).click();
  if (!isMobile) await page.locator('.hero-id-card').click({ position: { x: 150, y: 100 } });
  await expect.poll(() => page.locator('.hero-badge-body').evaluate(el => Math.abs(new DOMMatrix(getComputedStyle(el).transform).m41)), { timeout: 10000 }).toBeGreaterThan(12);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(pause).toHaveCount(0);
  await expect.poll(() => page.locator('.hero-badge-body').evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m41)).toBe(0);
  const greeting = await body.getAttribute('style');
  await page.waitForTimeout(350);
  expect(await body.getAttribute('style')).toBe(greeting);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('mobile touch drag moves the profile badge', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Uses the touch-enabled mobile project.');
  await page.goto('/');
  await page.getByRole('button', { name: 'Pause hero animation' }).click();
  const card = page.locator('.hero-id-card');
  await card.scrollIntoViewIfNeeded();
  const box = await card.boundingBox();
  expect(box).not.toBeNull();
  const session = await page.context().newCDPSession(page);
  const point = { x: box!.x + box!.width / 2, y: box!.y + box!.height / 2 };
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ ...point, radiusX: 8, radiusY: 8, force: 1, id: 1 }],
  });
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: [{ ...point, x: point.x + 80, y: point.y - 35, radiusX: 8, radiusY: 8, force: 1, id: 1 }],
  });
  await expect.poll(() => card.evaluate(element => Math.abs(new DOMMatrix(getComputedStyle(element.parentElement!).transform).m41)), { timeout: 3000 }).toBeGreaterThan(10);
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
});

test('company logos load next to all three company names', async ({ page }) => {
  await page.goto('/#about');
  for (const name of ['Viettel High Tech', 'Central Military Hospital 108', 'AVITECH · VNU-UET']) {
    const heading = page.getByRole('heading', { name, exact: true });
    await heading.scrollIntoViewIfNeeded();
    await expect.poll(() => heading.locator('img').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
    expect(await heading.evaluate(el => el.querySelector('img')!.getBoundingClientRect().right <= el.lastElementChild!.getBoundingClientRect().left)).toBe(true);
  }
});
