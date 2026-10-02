"use client";
import DataPage from '@/components/DataPage';
import { useOptions } from '@/components/useOptions';
import { useSiswaOptions } from '@/components/useSiswaOptions';

/** Nilai akhir dihitung otomatis: tugas 30%, quiz 30%, ujian 40%. */
export default function Page() {
  const mapel = useOptions('/api/subjects');
  const siswa = useSiswaOptions();

  return (
    <DataPage
      title="Penilaian"
      description="Input dan ubah nilai siswa. Nilai akhir dihitung otomatis dari tugas 30%, quiz 30%, ujian 40%."
      endpoint="/api/grades"
      canCreate canEdit canDelete
      createLabel="Input Nilai"
      idKey="studentId.name"
      searchPlaceholder="Cari nilai berdasarkan nama siswa atau mapel..."
      defaults={{ assignment: 0, quiz: 0, exam: 0 }}
      fields={[
        { name: 'studentId', label: 'Siswa', options: siswa, fromRow: 'studentId', required: true },
        { name: 'subjectId', label: 'Mata pelajaran', options: mapel, fromRow: 'subjectId', required: true },
        { name: 'assignment', label: 'Nilai Tugas (0-100)', type: 'number', required: true },
        { name: 'quiz', label: 'Nilai Quiz (0-100)', type: 'number', required: true },
        { name: 'exam', label: 'Nilai Ujian (0-100)', type: 'number', required: true },
      ]}
      columns={[
        { key: 'studentId.name', label: 'Siswa' },
        { key: 'studentId.nis', label: 'NIS' },
        { key: 'subjectId.name', label: 'Mapel' },
        { key: 'assignment', label: 'Tugas' },
        { key: 'quiz', label: 'Quiz' },
        { key: 'exam', label: 'Ujian' },
        { key: 'final', label: 'Nilai Akhir' },
      ]}
    />
  );
}
