"use client";
import { useEffect, useState } from 'react';
import DataPage from '@/components/DataPage';

const ROLES = [
  { value: 'admin', label: 'Administrator' },
  { value: 'guru', label: 'Guru' },
  { value: 'siswa', label: 'Siswa' },
  { value: 'kurikulum', label: 'Kurikulum' },
  { value: 'kepsek', label: 'Kepala Sekolah' },
];

/** Pilihan kelas diambil dari API agar siswa bisa langsung ditugaskan ke rombel. */
function useClassOptions() {
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  useEffect(() => {
    fetch('/api/classes')
      .then(r => (r.ok ? r.json() : []))
      .then(list => setOptions((Array.isArray(list) ? list : []).map((c: any) => ({ value: c._id, label: c.name }))))
      .catch(() => setOptions([]));
  }, []);
  return options;
}

export default function AdminSiswa() {
  const kelas = useClassOptions();
  return (
    <DataPage
      title="Manajemen Siswa"
      description="Tambah, ubah, dan hapus akun siswa."
      endpoint="/api/users"
      canCreate canEdit canDelete
      createLabel="Tambah Siswa"
      idKey="name"
      searchPlaceholder="Cari siswa berdasarkan nama, email, NIS, kelas, atau role..."
      defaults={{ role: 'siswa' }}
      fields={[
        { name: 'name', label: 'Nama', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'password', label: 'Password', type: 'password', requiredOnCreate: true },
        { name: 'nis', label: 'NIS' },
        { name: 'role', label: 'Role', options: ROLES },
        { name: 'classId', label: 'Kelas', options: kelas, fromRow: 'classId' },
      ]}
      columns={[
        { key: 'name', label: 'Nama' },
        { key: 'email', label: 'Email' },
        { key: 'nis', label: 'NIS' },
        { key: 'classId.name', label: 'Kelas' },
        { key: 'role', label: 'Role' },
      ]}
    />
  );
}
