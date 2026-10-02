"use client";
import DataPage from '@/components/DataPage';
import { useOptions } from '@/components/useOptions';

const TIPE = [
  { value: 'quiz', label: 'Quiz' },
  { value: 'ujian', label: 'Ujian' },
];

export default function Page() {
  const mapel = useOptions('/api/subjects');
  const kelas = useOptions('/api/classes');

  return (
    <DataPage
      title="Quiz & Ujian Online"
      description="Buat, ubah, dan hapus quiz/ujian milik Anda."
      endpoint="/api/quizzes"
      canCreate canEdit canDelete
      createLabel="Buat Quiz"
      idKey="title"
      searchPlaceholder="Cari quiz berdasarkan judul atau deskripsi..."
      defaults={{ type: 'quiz', duration: 60, classIds: [], published: true }}
      fields={[
        { name: 'title', label: 'Judul', required: true },
        { name: 'type', label: 'Tipe', options: TIPE, required: true },
        { name: 'description', label: 'Deskripsi', type: 'textarea' },
        { name: 'duration', label: 'Durasi (menit)', type: 'number' },
        { name: 'subjectId', label: 'Mata pelajaran', options: mapel },
        { name: 'classIds', label: 'Ditujukan ke kelas', type: 'multiselect', options: kelas },
      ]}
      columns={[
        { key: 'title', label: 'Judul' },
        { key: 'type', label: 'Tipe' },
        { key: 'duration', label: 'Durasi' },
        { key: 'subjectId.name', label: 'Mapel' },
        { key: 'classIds', label: 'Kelas' },
      ]}
    />
  );
}
