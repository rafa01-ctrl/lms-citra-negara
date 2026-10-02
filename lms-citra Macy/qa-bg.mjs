const BASE = 'http://localhost:3000';
export default async function run(page) {
  await page.setViewportSize({ width: 1400, height: 820 });
  await page.goto(`${BASE}/login/`);
  await page.waitForSelector('.login-card');
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'shot-login.png' });
  return { ok: true };
}
