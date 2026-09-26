import { expect, test } from '@playwright/test';

test('assistant submits once, displays replies, and restores keyboard focus', async ({ page }) => {
  let requests = 0;
  await page.route('**/api/chat', async route => {
    requests += 1;
    expect(route.request().postDataJSON()).toEqual({ message: 'What does Nam specialize in?' });
    await route.fulfill({ json: { message: 'Nam works on computer vision and backend systems.' } });
  });
  await page.goto('/');
  const launcher = page.getByRole('button', { name: 'Ask AI about Nam' });
  await launcher.click();
  const dialog = page.getByRole('dialog', { name: "Nam's portfolio assistant" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'What does Nam specialize in?' }).click();
  await expect(dialog.getByRole('log')).toContainText('Nam works on computer vision and backend systems.');
  expect(requests).toBe(1);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(launcher).toBeFocused();
  await launcher.click();
  await expect(dialog.getByRole('log')).toContainText('Nam works on computer vision and backend systems.');
});

test('assistant recovers from an API failure without losing the conversation', async ({ page }) => {
  await page.route('**/api/chat', route => route.fulfill({ status: 502, json: { error: 'Unavailable' } }));
  await page.goto('/');
  await page.getByRole('button', { name: 'Ask AI about Nam' }).click();
  const input = page.getByRole('textbox', { name: 'Your message' });
  await input.fill('Tell me about Nam');
  await page.getByRole('button', { name: 'Send question' }).click();
  await expect(page.getByRole('log')).toContainText("I couldn't reach the assistant");
  await page.route('**/api/chat', route => route.fulfill({ json: { message: 'Nam studies Artificial Intelligence.' } }));
  await input.fill('What does Nam study?');
  await input.press('Enter');
  await expect(page.getByRole('log')).toContainText('Nam studies Artificial Intelligence.');
  await expect(page.getByRole('log')).toContainText('Tell me about Nam');
});
