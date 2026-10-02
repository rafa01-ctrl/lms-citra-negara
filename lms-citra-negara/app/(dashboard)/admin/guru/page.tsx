import DataPage from '@/components/DataPage';

const ROLES = [
  { value: 'admin', label: 'Administrator' },
  { value: 'guru', label: 'Guru' },
  { value: 'kurikulum', label: 'Kurikulum' },
  { value: 'kepsek', label: 'Kepala Sekolah' },
  { value: 'siswa', label: 'Siswa' },
];

export default function Page() {
  return (
    <DataPage
      title="Manajemen Guru"
      description="Kelola data guru dan akun pengajar."
      endpoint="/api/users"
      canCreate canEdit canDelete
      createLabel="Tambah Guru"
      idKey="name"
      searchPlaceholder="Cari guru berdasarkan nama, email, atau NIP..."
      defaults={{ role: 'guru' }}
      fields={[
        { name: 'name', label: 'Nama', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'password', label: 'Password', type: 'password', requiredOnCreate: true },
        { name: 'nip', label: 'NIP' },
        { name: 'phone', label: 'No. HP' },
        { name: 'role', label: 'Role', options: ROLES },
      ]}
      columns={[
        { key: 'name', label: 'Nama' },
        { key: 'email', label: 'Email' },
        { key: 'nip', label: 'NIP' },
        { key: 'phone', label: 'No. HP' },
        { key: 'role', label: 'Role' },
      ]}
    />
  );
}
