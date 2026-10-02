const BASE = 'http://localhost:3000';
export default async function run(page) {
  const out = {};
  await page.setViewportSize({ width: 1400, height: 900 });
  await page.goto(`${BASE}/login/`);
  await page.waitForSelector('.role-grid');
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'shot-role.png' });
  out.kartuRole = await page.locator('.role-card .role-nama').allInnerTexts();

  // klik kartu lewat .role-nama yang PERSIS sama (hindari cocok sebagian)
  const kartuGuru = page.locator('.role-card').filter({ has: page.locator('.role-nama', { hasText: /^Guru$/ }) });
  await kartuGuru.click();
  await page.waitForSelector('.login-card');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'shot-guru.png' });
  out.judul = await page.locator('.login-card h1').innerText();
  out.emailTerisi = await page.locator('input:not([type=password])').first().inputValue();
  out.passwordTerisi = await page.locator('input[type=password]').inputValue();

  // ganti role -> kembali ke daftar
  await page.getByRole('button', { name: 'Ganti role' }).click();
  await page.waitForSelector('.role-grid');
  await page.waitForTimeout(400);
  out.kembaliKeDaftar = await page.locator('.role-card').count();

  // login cepat sebagai Guru
  const kGuru = page.locator('.role-card').filter({ has: page.locator('.role-nama', { hasText: /^Guru$/ }) });
  await kGuru.click();
  await page.waitForSelector('.login-card');
  const [resp] = await Promise.all([
    page.waitForResponse(r => r.url().includes('/api/auth/login'), { timeout: 15000 }),
    page.getByRole('button', { name: /Login cepat/ }).click(),
  ]);
  out.loginCepatStatus = resp.status();
  await page.waitForTimeout(3000);
  out.urlSetelahLogin = page.url();
  out.menuGuru = await page.locator('.nav a').allInnerTexts();
  return out;
}
