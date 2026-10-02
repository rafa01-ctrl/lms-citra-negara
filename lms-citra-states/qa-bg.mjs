const BASE = 'http://localhost:3000';
export default async function run(page) {
  await page.setViewportSize({ width: 1400, height: 820 });
  await page.goto(`${BASE}/login/`);
  await page.waitForSelector('.login-card');
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'shot-login.png' });

  await page.locator('input').nth(0).fill('admin@citra.sch.id');
  await page.locator('input').nth(1).fill('admin123');
  await page.getByRole('button', { name: 'Masuk' }).first().click();
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'shot-dash.png' });
  return {
    bg: await page.evaluate(() => getComputedStyle(document.body).backgroundImage.slice(0, 80)),
    err: await page.locator('.alert').allInnerTexts(),
  };
}
