/**
 * Menjalankan MongoDB in-memory untuk development.
 * Dipakai karena mesin ini tidak punya MongoDB Server terinstall dan tidak ada
 * package manager (winget/choco/scoop) untuk memasangnya.
 *
 * Jalankan: npm run db:dev
 * Data TIDAK persisten — hilang setiap server dimatikan. Untuk data permanen,
 * jalankan MongoDB Community Server lalu jalankan `npm run seed`.
 */
import { MongoMemoryServer } from 'mongodb-memory-server';
import { writeFileSync } from 'node:fs';

async function main() {
  const mongod = await MongoMemoryServer.create({ instance: { port: 27017 } });

  // Simpan URI ke .env.local supaya lib/db.ts otomatis memakainya
  const uri = mongod.getUri('lms-citra-negara');
  writeFileSync('.env.local', `MONGODB_URI=${uri}\n`);

  console.log('MongoDB in-memory aktif di', uri);
  console.log('Data akan hilang saat proses ini dihentikan (Ctrl+C).');

  const stop = async () => {
    await mongod.stop();
    process.exit(0);
  };
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
}

main().catch((e) => {
  console.error('Gagal menjalankan MongoDB in-memory:', e);
  process.exit(1);
});
