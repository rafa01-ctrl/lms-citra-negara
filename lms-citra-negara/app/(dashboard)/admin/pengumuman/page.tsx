import DataPage from '@/components/DataPage';

/**
 * targetRoles berupa array (role tujuan). Form memakai input teks,
 * jadi admin mengetik role dipisah koma, mis: "siswa, guru".
 * Kosongkan bila pengumuman untuk semua pengguna.
 */

export default function Page() {
  return (
    <DataPage
      title="Pengumuman"
      description="Informasi yang diterbitkan sekolah."
      endpoint="/api/announcements"
      canCreate canEdit canDelete
      createLabel="Buat Pengumuman"
      idKey="title"
      fields={[
        { name: 'title', label: 'Judul', required: true },
        { name: 'content', label: 'Isi', type: 'textarea', required: true },
        { name: 'targetRoles', label: 'Ditujukan ke (pisahkan dengan koma)' },
      ]}
      columns={[
        { key: 'title', label: 'Judul' },
        { key: 'content', label: 'Isi' },
        { key: 'authorId.name', label: 'Penulis' },
      ]}
    />
  );
}
