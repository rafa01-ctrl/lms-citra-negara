"use client";
import DataPage from '@/components/DataPage';
import { useOptions } from '@/components/useOptions';

export default function Page() {
  const mapel = useOptions('/api/subjects');
  const kelas = useOptions('/api/classes');

  return (
    <DataPage
      title="Materi"
      description="Kelola materi milik Anda sendiri: buat, ubah, dan hapus."
      endpoint="/api/materials"
      canCreate canEdit canDelete
      createLabel="Tambah Materi"
      idKey="title"
      searchPlaceholder="Cari materi berdasarkan judul atau deskripsi..."
      defaults={{ classIds: [] }}
      fields={[
        { name: 'title', label: 'Judul', required: true },
        { name: 'description', label: 'Deskripsi', type: 'textarea' },
        { name: 'link', label: 'Link PDF / Google Drive', type: 'url' },
        { name: 'subjectId', label: 'Mata pelajaran', options: mapel },
        { name: 'classIds', label: 'Kelas tujuan', type: 'multiselect', options: kelas },
      ]}
      columns={[
        { key: 'title', label: 'Judul' },
        { key: 'subjectId.name', label: 'Mapel' },
        { key: 'classIds', label: 'Kelas' },
        { key: 'description', label: 'Deskripsi' },
        { key: 'link', label: 'Link' },
      ]}
    />
  );
}
