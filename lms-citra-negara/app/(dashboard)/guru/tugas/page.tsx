"use client";
import DataPage from '@/components/DataPage';
import { useOptions } from '@/components/useOptions';

export default function Page() {
  const mapel = useOptions('/api/subjects');
  const kelas = useOptions('/api/classes');

  return (
    <DataPage
      title="Tugas & Proyek"
      description="Buat tugas/proyek, ubah deadline, dan hapus."
      endpoint="/api/assignments"
      canCreate canEdit canDelete
      createLabel="Buat Tugas"
      idKey="title"
      searchPlaceholder="Cari tugas berdasarkan judul atau deskripsi..."
      defaults={{ classIds: [] }}
      fields={[
        { name: 'title', label: 'Judul', required: true },
        { name: 'description', label: 'Deskripsi', type: 'textarea' },
        { name: 'dueDate', label: 'Deadline', type: 'date' },
        { name: 'subjectId', label: 'Mata pelajaran', options: mapel },
        { name: 'classIds', label: 'Ditugaskan ke kelas', type: 'multiselect', options: kelas },
        { name: 'attachmentUrl', label: 'Link lampiran', type: 'url' },
      ]}
      columns={[
        { key: 'title', label: 'Judul' },
        { key: 'subjectId.name', label: 'Mapel' },
        { key: 'classIds', label: 'Kelas' },
        { key: 'dueDate', label: 'Deadline' },
        { key: 'description', label: 'Deskripsi' },
      ]}
    />
  );
}
