import { expect, test } from '@playwright/test';

const desktopViewports = [
  { width: 1440, height: 900 },
  { width: 1365, height: 768 },
  { width: 1820, height: 1024 }, // Same physical 1365 × 768 screen at 75% zoom.
  { width: 1024, height: 768 },
  { width: 1440, height: 600 },
];

test.describe('Selected Projects stacking', () => {
  test.skip(({ isMobile }) => isMobile, 'Uses explicit desktop and mobile viewport sizes.');

  for (const viewport of desktopViewports) {
    test(`later cards fully cover earlier cards at ${viewport.width} × ${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/#projects');
      await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
      const slots = page.locator('.nam-project-slot');
      const last = slots.last();
      await last.evaluate(element => {
        window.scrollTo(0, window.scrollY + element.getBoundingClientRect().top - parseFloat(getComputedStyle(element).top));
      });
      await expect.poll(() => last.evaluate(element => Math.abs(element.getBoundingClientRect().top - parseFloat(getComputedStyle(element).top)))).toBeLessThan(1);

      const cards = await slots.evaluateAll(elements => elements.map(element => {
        const card = element.querySelector<HTMLElement>('.nam-project-card')!;
        const bounds = card.getBoundingClientRect();
        return {
          position: getComputedStyle(element).position,
          top: bounds.top,
          bottom: bounds.bottom,
          height: bounds.height,
          overflowing: card.scrollHeight > card.clientHeight + 1,
        };
      }));
      expect(cards).toHaveLength(5);
      for (const [index, card] of cards.entries()) {
        expect(card.position).toBe('sticky');
        expect(card.overflowing).toBe(false);
        expect(card.height).toBeCloseTo(cards[0].height, 1);
        if (index > 0) {
          expect(card.top - cards[index - 1].top).toBeCloseTo(14, 0);
          expect(card.bottom).toBeGreaterThan(cards[index - 1].bottom);
        }
      }
      expect(cards[4].bottom).toBeLessThanOrEqual(viewport.height);
      const visibleBottomCard = await last.evaluate(element => {
        const bounds = element.getBoundingClientRect();
        return document.elementFromPoint(bounds.left + bounds.width / 2, bounds.bottom - 8)?.closest('article')?.getAttribute('aria-label');
      });
      expect(visibleBottomCard).toBe('AI for Rehabilitation');
      await expect(page.getByRole('button', { name: 'View Project', exact: true }).last()).toBeVisible();
    });
  }

  test('mobile and reduced motion keep full cards in ordinary reading order', async ({ page }) => {
    for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ reducedMotion: viewport.width > 1000 ? 'reduce' : 'no-preference' });
      await page.goto('/#projects');
      const cards = await page.locator('.nam-project-slot').evaluateAll(elements => elements.map(element => ({
        position: getComputedStyle(element).position,
        top: element.getBoundingClientRect().top,
        bottom: element.getBoundingClientRect().bottom,
      })));
      for (const [index, card] of cards.entries()) {
        expect(card.position).toBe('relative');
        if (index > 0) expect(card.top).toBeGreaterThan(cards[index - 1].bottom);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(viewport.width);
    }
  });
});
