import DataPage from '@/components/DataPage';

export default function Page() {
  return (
    <DataPage
      title="Mata Pelajaran"
      description="Kelola daftar mata pelajaran."
      endpoint="/api/subjects"
      canCreate canEdit canDelete
      createLabel="Tambah Mapel"
      idKey="name"
      fields={[
        { name: 'name', label: 'Nama mapel', required: true },
        { name: 'code', label: 'Kode', required: true },
        { name: 'description', label: 'Deskripsi', type: 'textarea' },
      ]}
      columns={[
        { key: 'name', label: 'Mata Pelajaran' },
        { key: 'code', label: 'Kode' },
        { key: 'description', label: 'Deskripsi' },
      ]}
    />
  );
}
