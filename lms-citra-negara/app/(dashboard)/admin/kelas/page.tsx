"use client";
import { useEffect, useState } from 'react';
import DataPage from '@/components/DataPage';

/** Wali kelas dipilih dari akun yang sudah terdaftar dan berperan guru. */
function useTeacherOptions() {
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  useEffect(() => {
    fetch('/api/users')
      .then(r => (r.ok ? r.json() : []))
      .then(list => {
        const teachers = (Array.isArray(list) ? list : []).filter((u: any) => u.role === 'guru');
        setOptions(teachers.map((t: any) => ({ value: t._id, label: t.name })));
      })
      .catch(() => setOptions([]));
  }, []);
  return options;
}

export default function Page() {
  const waliKelas = useTeacherOptions();
  return (
    <DataPage
      title="Manajemen Kelas"
      description="Kelola rombel/kelas dan tahun ajaran."
      endpoint="/api/classes"
      canCreate canEdit canDelete
      createLabel="Tambah Kelas"
      idKey="name"
      fields={[
        { name: 'name', label: 'Nama kelas', required: true },
        { name: 'level', label: 'Tingkat' },
        { name: 'major', label: 'Jurusan' },
        { name: 'academicYear', label: 'Tahun ajaran' },
        { name: 'homeroomTeacherId', label: 'Wali Kelas', options: waliKelas, fromRow: 'homeroomTeacherId' },
      ]}
      columns={[
        { key: 'name', label: 'Kelas' },
        { key: 'level', label: 'Tingkat' },
        { key: 'major', label: 'Jurusan' },
        { key: 'academicYear', label: 'Tahun Ajaran' },
        { key: 'homeroomTeacherId.name', label: 'Wali Kelas' },
      ]}
    />
  );
}
