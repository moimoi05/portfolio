import { test, expect } from '@playwright/test';

test('CV opens as a page and serves the original PDF', async ({ page }) => {
  await page.goto('/#about');
  await page.getByRole('link', { name: 'View CV', exact: true }).click();
  await expect(page).toHaveURL(/\/cv$/);
  await expect(page).toHaveTitle('CV — Nguyen Phuong Nam');
  const image = page.getByRole('img', { name: /curriculum vitae/i });
  await expect.poll(() => image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  const response = await page.request.get('/cv/CV_Nguyen_Phuong_Nam.pdf');
  expect(response.status()).toBe(200);
  expect((await response.body()).subarray(0, 5).toString()).toBe('%PDF-');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Tiếng Việt' }).click();
  await expect(page.getByRole('heading', { name: 'Học vấn & thành tích' })).toBeVisible();
  await page.getByRole('link', { name: 'Quay lại portfolio' }).click();
  await expect(page).toHaveURL(/\/#about$/);
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Kinh nghiệm' })).toBeVisible();
});

test('both research projects show loaded, attributed paper figures', async ({ page }) => {
  await page.goto('/#projects');
  for (const name of ['Alzheimer’s Prognosis', 'AI for Rehabilitation']) {
    const card = page.getByRole('article', { name, exact: true });
    await card.scrollIntoViewIfNeeded();
    const image = card.getByRole('img', { name: /published.*pipeline/i });
    await expect.poll(() => image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    await expect(card.getByRole('link', { name: 'Source paper' })).toBeVisible();
    await expect(card.getByRole('link', { name: 'CC BY 4.0' })).toBeVisible();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('Nam portfolio has working navigation, real screenshots, and no horizontal overflow', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page).toHaveTitle('Nam — AI Engineer & Software Developer');
  await expect(page.getByRole('heading', { level: 1, name: /building\s*intelligence/i })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Contact Me' }).first()).toHaveAttribute('href', 'mailto:nnam.hp2005@gmail.com');
  await expect.poll(() => page.locator('.hero-id-photo').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  await page.getByRole('navigation').getByRole('link', { name: 'Experience' }).click();
  await expect(page).toHaveURL(/#experience$/);
  await expect(page.getByRole('heading', { name: 'Experience', exact: true })).toBeInViewport();
  await page.goto('/#projects');
  const card = page.getByRole('article', { name: 'GUU & T DESIGN' });
  await card.scrollIntoViewIfNeeded();
  await expect(card.getByRole('link', { name: 'Live Project' })).toHaveAttribute('href', 'https://guut.com.vn');
  for (const img of await card.getByRole('img').all()) {
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('the old services and experiment bookmarks redirect to Experience', async ({ page }) => {
  await page.goto('/#services');
  await expect(page).toHaveURL(/#experience$/);
  await expect(page.getByRole('heading', { name: 'Experience', exact: true })).toBeInViewport();
  await page.goto('/#experiment');
  await expect(page).toHaveURL(/#experience$/);
});

test('reduced motion keeps profile text and keyboard navigation accessible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#about$/);
  await expect(page.getByRole('heading', { name: 'About me' })).toBeInViewport();
  await expect(page.locator('.about-copy')).toContainText('I’m Nguyen Phuong Nam');
  expect(await page.locator('.project-stack-slot').first().evaluate(el => getComputedStyle(el).position)).toBe('relative');
});

test('private project details open, trap focus, and return focus on Escape', async ({ page }) => {
  await page.goto('/#projects');
  for (const name of ['Medical Supply Management', 'UAV Thermal Vision', 'Alzheimer’s Prognosis', 'AI for Rehabilitation']) {
    const button = page.getByRole('article', { name, exact: true }).getByRole('button', { name: 'View Project' });
    await button.click();
    const dialog = page.getByRole('dialog', { name, exact: true });
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText(/concept|reference figure/i);
    await page.keyboard.press('Tab');
    expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(button).toBeFocused();
  }
});
