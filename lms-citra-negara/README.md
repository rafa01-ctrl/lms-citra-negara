# LMS SMK Citra Negara

LMS full-stack berbasis Next.js App Router + MongoDB/Mongoose. Struktur role mengikuti rancangan whiteboard: **Admin, Guru, Siswa, Kurikulum, Kepsek**.

## Fitur utama

- **Admin:** manajemen siswa, guru, kelas, mata pelajaran, pengumuman.
- **Guru:** melihat siswa/kelas, upload materi via link, membuat tugas/proyek, quiz/ujian, monitoring nilai, pengumuman.
- **Siswa:** login, materi, tugas/proyek, quiz/ujian online, nilai, pengumuman, profil.
- **Kurikulum:** monitoring guru, mapel, nilai, pengumuman.
- **Kepsek:** monitoring guru, kelas, nilai, laporan akademik, pengumuman.
- Authentication memakai JWT HTTP-only cookie + bcrypt password hashing.
- MongoDB memakai Mongoose.
- Responsive untuk desktop dan HP.

## Jalankan di Windows

1. Pastikan Node.js LTS terpasang.
2. Buka folder ini di VS Code.
3. Salin `.env.example` menjadi `.env.local`.
4. Isi `MONGODB_URI`. Untuk MongoDB lokal default:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/lms_citra_negara
JWT_SECRET=rahasia-yang-panjang-dan-acak
NEXT_PUBLIC_APP_NAME=SMK Citra Negara LMS
```

5. Install:

```bash
npm install
```

6. Buat data awal:

```bash
npm run seed
```

7. Jalankan:

```bash
npm run dev
```

8. Buka `http://localhost:3000`.

## Akun demo

| Role | Email | Password |
|---|---|---|
| Admin | admin@citra.sch.id | admin123 |
| Guru | guru@citra.sch.id | guru123 |
| Siswa | siswa@citra.sch.id | siswa123 |
| Kurikulum | kurikulum@citra.sch.id | kurikulum123 |
| Kepsek | kepsek@citra.sch.id | kepsek123 |

## Catatan pengembangan

Versi ini adalah fondasi MVP yang sudah punya authentication, role-based access, model MongoDB, API dasar, dashboard, CRUD data inti, quiz scoring, submission, dan grade calculation. Untuk produksi, upload file sebaiknya memakai object storage, bukan `public/uploads`, dan perlu ditambah validasi Zod, audit log, pagination, reset password, CSRF/rate limiting, serta permission yang lebih granular.
