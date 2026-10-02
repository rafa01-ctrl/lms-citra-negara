"use client";
import DataPage from '@/components/DataPage';
import { useOptions } from '@/components/useOptions';

/**
 * targetRoles berupa array role tujuan. Form memakai input teks,
 * jadi guru mengetik role dipisah koma, mis: "siswa, guru".
 * Kosongkan bila pengumuman untuk semua pengguna.
 */
export default function Page() {
  const kelas = useOptions('/api/classes');

  return (
    <DataPage
      title="Pengumuman Guru"
      description="Buat pengumuman untuk siswa/kelas. Anda hanya bisa mengubah dan menghapus pengumuman milik sendiri."
      endpoint="/api/announcements"
      canCreate canEdit canDelete
      createLabel="Buat Pengumuman"
      idKey="title"
      searchPlaceholder="Cari pengumuman berdasarkan judul atau isi..."
      fields={[
        { name: 'title', label: 'Judul', required: true },
        { name: 'content', label: 'Isi pengumuman', type: 'textarea', required: true },
        { name: 'targetRoles', label: 'Ditujukan ke (pisahkan dengan koma)', options: [
          { value: 'siswa', label: 'siswa' },
          { value: 'guru', label: 'guru' },
        ] },
        { name: 'classIds', label: 'Kelas tujuan', type: 'multiselect', options: kelas },
      ]}
      columns={[
        { key: 'title', label: 'Judul' },
        { key: 'content', label: 'Isi' },
        { key: 'targetRoles', label: 'Ditujukan ke' },
        { key: 'classIds', label: 'Kelas' },
        { key: 'authorId.name', label: 'Penulis' },
      ]}
    />
  );
}
