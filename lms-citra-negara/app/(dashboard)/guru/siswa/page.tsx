"use client";
import DataPage from '@/components/DataPage';

/**
 * Guru hanya melihat data siswa agar bisa diberi nilai.
 * Akun siswa tetap dikelola oleh admin, jadi di sini tidak ada
 * tombol tambah/ubah/hapus.
 */
export default function Page() {
  return (
    <DataPage
      title="Siswa & Kelas"
      description="Daftar siswa yang bisa Anda nilai. Pengelolaan akun siswa dilakukan oleh admin."
      endpoint="/api/users"
      idKey="name"
      searchPlaceholder="Cari siswa berdasarkan nama atau NIS..."
      columns={[
        { key: 'name', label: 'Nama' },
        { key: 'nis', label: 'NIS' },
        { key: 'classId.name', label: 'Kelas' },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role' },
      ]}
    />
  );
}
