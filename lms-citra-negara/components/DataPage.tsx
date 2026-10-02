"use client";
import { useEffect, useState } from 'react';
import { Pencil, Trash2, Plus, X, Search } from 'lucide-react';

export type Field = {
  name: string;
  label: string;
  type?: string;
  /** Wajib diisi saat create. */
  required?: boolean;
  /** Wajib diisi juga saat edit (default: false bila ada `requiredOnCreate`). */
  requiredOnEdit?: boolean;
  /** Wajib saat create, opsional saat edit â€” mis. password. */
  requiredOnCreate?: boolean;
  /** Kolom select atau textarea. */
  options?: { value: string; label: string }[];
  /** Kolom ObjectId; nilai diambil dari list yang sudah dipopulate, mis. "classId.name". */
  fromRow?: string;
};

type Props = {
  title: string;
  endpoint: string;
  description?: string;
  columns: { key: string; label: string }[];
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  createLabel?: string;
  fields?: Field[];
  defaults?: any;
  /** Kolom yang dipakai untuk menyebut nama target saat konfirmasi hapus. */
  idKey?: string;
  /** Placeholder khusus kotak pencarian, mis. "Cari siswa berdasarkan nama, NIS, atau email...". */
  searchPlaceholder?: string;
  /** Nilai awal untuk pilihan kolom pencarian. */
  defaultSearchColumn?: string;
};

export default function DataPage({
  title, endpoint, description, columns,
  canCreate = false, canEdit = false, canDelete = false,
  createLabel = 'Tambah', fields = [], defaults = {}, idKey = 'name',
  searchPlaceholder, defaultSearchColumn = '',
}: Props) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [modal, setModal] = useState<null | 'create' | 'edit'>(null);
  const [editingId, setEditingId] = useState<string>('');
  const [form, setForm] = useState<any>(defaults);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState('');
  const [searchCol, setSearchCol] = useState(defaultSearchColumn);
  const [confirm, setConfirm] = useState<any>(null);

  async function load() {
    try {
      const r = await fetch(endpoint);
      const d = await r.json();
      if (!r.ok) { setLoadError(d.error || 'Gagal memuat data'); setLoading(false); return; }
      setLoadError('');
      setRows(Array.isArray(d) ? d : []);
    } catch {
      setLoadError('Tidak dapat terhubung ke server');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [endpoint]);

  function openCreate() {
    setEditingId('');
    setForm({ ...defaults });
    setMsg(null);
    setModal('create');
  }

  /** Isi form dari baris yang dipilih agar user hanya mengubah yang perlu. */
  function openEdit(row: any) {
    setEditingId(String(row._id));
    const seed: any = { ...defaults };
    for (const f of fields) {
      if (f.fromRow) {
        const v = f.fromRow.split('.').reduce((a, k) => a?.[k], row);
        seed[f.name] = v && typeof v === 'object' ? (v._id ?? '') : (v ?? '');
      } else if (f.name === 'password') {
        seed[f.name] = '';
      } else if (Array.isArray(row[f.name])) {
        // Kolom array (mis. targetRoles) diedit sebagai teks dipisah koma.
        seed[f.name] = row[f.name].join(', ');
      } else {
        seed[f.name] = row[f.name] ?? '';
      }
    }
    setForm(seed);
    setMsg(null);
    setModal('edit');
  }

  function closeModal() { setModal(null); setMsg(null); setBusy(false); }

  async function submit(e: any) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);

    const missing = fields.find(f => {
      const wajib = modal === 'edit'
        ? (f.requiredOnEdit ?? f.required)
        : (f.required || f.requiredOnCreate);
      return wajib && !form[f.name];
    });
    if (missing) {
      setMsg({ text: `${missing.label} wajib diisi`, ok: false });
      setBusy(false);
      return;
    }

    try {
      const isEdit = modal === 'edit';
      const url = isEdit ? `${endpoint}/${editingId}` : endpoint;
      const r = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const d = await r.json();
      if (!r.ok) { setMsg({ text: d.error || 'Gagal menyimpan', ok: false }); setBusy(false); return; }
      closeModal();
      setMsg({ text: isEdit ? 'Perubahan tersimpan' : 'Data berhasil ditambahkan', ok: true });
      await load();
    } catch {
      setMsg({ text: 'Terjadi kesalahan jaringan', ok: false });
      setBusy(false);
    }
  }

  async function remove() {
    if (!confirm) return;
    setBusy(true);
    try {
      const r = await fetch(`${endpoint}/${confirm._id}`, { method: 'DELETE' });
      const d = await r.json();
      if (!r.ok) {
        setMsg({ text: d.error || 'Gagal menghapus', ok: false });
        setBusy(false); setConfirm(null); return;
      }
      setConfirm(null);
      setMsg({ text: 'Data berhasil dihapus', ok: true });
      await load();
    } catch {
      setMsg({ text: 'Terjadi kesalahan jaringan', ok: false });
    } finally {
      setBusy(false);
    }
  }

  function val(row: any, key: string) {
    const v = key.split('.').reduce((a, k) => a?.[k], row);
    if (Array.isArray(v)) return v.map((x: any) => (x && typeof x === 'object' ? (x.name ?? x._id) : x)).join(', ');
    if (v && typeof v === 'object') return String(v.name ?? v._id ?? 'â€”');
    return v === undefined || v === null || v === '' ? 'â€”' : String(v);
  }

  const term = search.trim().toLowerCase();
  const shown = term
    ? rows.filter(r => (searchCol
        ? val(r, searchCol).toLowerCase().includes(term)
        : columns.some(c => val(r, c.key).toLowerCase().includes(term))))
    : rows;

  const hasActions = canEdit || canDelete;

  return (
    <>
      <div className="between mb">
        <div>
          <h1 className="page-title">{title}</h1>
          {description && <p className="muted">{description}</p>}
        </div>
        {canCreate && (
          <button className="btn btn-primary" onClick={openCreate}>
            <Plus size={16} /> {createLabel}
          </button>
        )}
      </div>

      {msg && <div className={`alert ${msg.ok ? 'alert-blue' : ''} mb`}>{msg.text}</div>}
      {loadError && <div className="alert mb">{loadError}</div>}

      {rows.length > 0 && (
        <div className="search-panel mb">
          <div className="search-box">
            <Search size={16} />
            <input
              className="input"
              placeholder={searchPlaceholder ?? `Cari di ${title.toLowerCase()}...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Cari data"
            />
            {search && (
              <button
                type="button"
                className="search-clear"
                onClick={() => setSearch('')}
                title="Bersihkan pencarian"
                aria-label="Bersihkan pencarian"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {columns.length > 1 && (
            <div className="search-filters">
              <select
                className="select"
                value={searchCol}
                onChange={e => setSearchCol(e.target.value)}
                aria-label="Kolom yang dicari"
              >
                <option value="">Semua kolom</option>
                {columns.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </div>
          )}

          <div className="muted search-info">
            {term
              ? <>{shown.length} dari {rows.length} data cocok</>
              : <>{rows.length} data</>}
          </div>
        </div>
      )}

      {modal && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="card modal-card" onClick={e => e.stopPropagation()}>
            <div className="between mb">
              <h2 className="card-title">{modal === 'create' ? createLabel : 'Ubah Data'}</h2>
              <button type="button" className="btn btn-ghost" onClick={closeModal} aria-label="Tutup">
                <X size={16} />
              </button>
            </div>
            <form className="form" onSubmit={submit}>
              {fields.map(f => {
                const wajib = modal === 'edit'
                  ? (f.requiredOnEdit ?? f.required)
                  : (f.required || f.requiredOnCreate);
                return (
                <div key={f.name}>
                  <label className="label">
                    {f.label}
                    {wajib && <span style={{ color: '#b91c1c' }}> *</span>}
                  </label>
                  {f.type === 'multiselect' && f.options ? (
                    <>
                      <select
                        className="select multiselect"
                        multiple
                        value={Array.isArray(form[f.name]) ? form[f.name] : []}
                        onChange={e => {
                          const picked = Array.from(e.target.selectedOptions).map(o => o.value);
                          setForm({ ...form, [f.name]: picked });
                        }}
                      >
                        {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                      <small className="muted">Tekan Ctrl untuk memilih lebih dari satu. ({Array.isArray(form[f.name]) ? form[f.name].length : 0} dipilih)</small>
                    </>
                  ) : f.options ? (
                    <select
                      className="select"
                      value={form[f.name] ?? ''}
                      onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                    >
                      <option value="">-- pilih --</option>
                      {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  ) : f.type === 'textarea' ? (
                    <textarea
                      className="textarea"
                      rows={4}
                      value={form[f.name] ?? ''}
                      onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                    />
                  ) : (
                    <input
                      className="input"
                      type={f.type || 'text'}
                      value={form[f.name] ?? ''}
                      onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                    />
                  )}
                  {f.name === 'password' && modal === 'edit' && (
                    <small className="muted">Kosongkan bila tidak ingin mengganti password.</small>
                  )}
                </div>
                );
              })}
              {msg && !msg.ok && <small style={{ color: '#b91c1c' }}>{msg.text}</small>}
              <div className="actions">
                <button className="btn btn-primary" disabled={busy}>{busy ? 'Memproses...' : 'Simpan'}</button>
                <button type="button" className="btn btn-ghost" onClick={closeModal} disabled={busy}>Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirm && (
        <div className="modal-backdrop" onClick={() => setConfirm(null)}>
          <div className="card modal-card narrow" onClick={e => e.stopPropagation()}>
            <h2 className="card-title mb">Hapus Data</h2>
            <p className="muted">
              Yakin ingin menghapus <b>{val(confirm, idKey)}</b>? Tindakan ini tidak bisa dibatalkan.
            </p>
            <div className="actions mt">
              <button className="btn btn-danger" onClick={remove} disabled={busy}>
                {busy ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
              <button className="btn btn-ghost" onClick={() => setConfirm(null)} disabled={busy}>Batal</button>
            </div>
          </div>
        </div>
      )}

      <div className="card table-wrap">
        <table className="table">
          <thead>
            <tr>
              {columns.map(c => <th key={c.key}>{c.label}</th>)}
              {hasActions && <th className="col-aksi">Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {shown.map((row, i) => (
              <tr key={row._id || i}>
                {columns.map(c => <td key={c.key}>{val(row, c.key)}</td>)}
                {hasActions && (
                  <td className="col-aksi">
                    <div className="row-actions">
                      {canEdit && (
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(row)} title="Ubah">
                          <Pencil size={14} /> <span className="aksi-label">Ubah</span>
                        </button>
                      )}
                      {canDelete && (
                        <button className="btn btn-danger btn-sm" onClick={() => setConfirm(row)} title="Hapus">
                          <Trash2 size={14} /> <span className="aksi-label">Hapus</span>
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div className="empty">Memuat data...</div>}
        {!loading && !shown.length && (
          <div className="empty">{term ? 'Tidak ada data yang cocok dengan pencarian.' : 'Belum ada data.'}</div>
        )}
      </div>
    </>
  );
}
