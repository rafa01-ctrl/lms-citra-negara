"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users, School, LibraryBig, BookOpen, ClipboardList, FileText,
  Megaphone, BarChart3, AlertCircle, GraduationCap,
  ArrowRight,
} from 'lucide-react';

type Role = 'admin' | 'guru' | 'siswa' | 'kurikulum' | 'kepsek';

type Stats = {
  ringkasan: {
    totalUsers: number; totalSiswa: number; totalGuru: number;
    totalKelas: number; totalMapel: number; totalMateri: number;
    totalTugas: number; totalQuiz: number; totalPengumuman: number;
    totalSubmission: number; totalGrade: number;
  };
  usersByRole: { _id: string; jumlah: number }[];
  kelasAgg: { _id: { level?: string; major?: string }; jumlah: number }[];
  avgGradeBySubject: { nama: string; kode: string; rataRata: number; jumlah: number }[];
  submissionTrend: { _id: string; jumlah: number }[];
  tugasBelumDikumpulkan: number;
  userTerbaru: any[];
  pengumumanTerbaru: any[];
};

const ROLE_META: Record<string, { label: string; badge: string }> = {
  admin: { label: 'Administrator', badge: 'badge' },
  guru: { label: 'Guru', badge: 'badge-green' },
  siswa: { label: 'Siswa', badge: 'badge-orange' },
  kurikulum: { label: 'Kurikulum', badge: 'badge' },
  kepsek: { label: 'Kepala Sekolah', badge: 'badge' },
};

function Stat({ icon: Icon, title, value, sub, tone = 'blue' }: {
  icon: any; title: string; value: number | string; sub?: string; tone?: string;
}) {
  return (
    <div className="card stat-card">
      <div className="flex-between">
        <div className="flex">
          <span className={`stat-icon tone-${tone}`}><Icon size={19} /></span>
          <span className="muted stat-label">{title}</span>
        </div>
      </div>
      <div className="stat">{value}</div>
      {sub && <div className="muted" style={{ fontSize: 12 }}>{sub}</div>}
    </div>
  );
}

/** Bar chart horizontal sederhana tanpa library eksternal. */
function BarChart({ data, unit = '' }: {
  data: { label: string; value: number }[]; unit?: string;
}) {
  const max = Math.max(...data.map(d => d.value), 1);
  if (!data.length) return <div className="muted center-pad">Belum ada data.</div>;
  return (
    <div className="bar-list">
      {data.map(d => (
        <div key={d.label} className="bar-row">
          <div className="bar-label" title={d.label}>{d.label}</div>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${(d.value / max) * 100}%` }} />
          </div>
          <div className="bar-value">{d.value}{unit}</div>
        </div>
      ))}
    </div>
  );
}

/** Sparkline tren submission pakai SVG. */
function TrendChart({ data }: { data: { label: string; value: number }[] }) {
  if (data.length < 2) return <div className="muted center-pad">Butuh minimal 2 hari data.</div>;
  const w = 100, h = 34;
  const max = Math.max(...data.map(d => d.value), 1);
  const step = w / (data.length - 1);
  const pts = data.map((d, i) => `${i * step},${h - (d.value / max) * (h - 4) - 2}`);
  return (
    <div className="trend-wrap">
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="trend-svg">
        <polyline points={pts.join(' ')} fill="none" stroke="var(--blue)" strokeWidth="1.2"
          strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        {data.map((d, i) => (
          <circle key={d.label} cx={i * step} cy={h - (d.value / max) * (h - 4) - 2} r="1.1"
            fill="var(--blue)" vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      <div className="trend-axis">
        <span>{data[0].label}</span>
        <span className="muted">Total {data.reduce((a, b) => a + b.value, 0)} pengumpulan</span>
        <span>{data[data.length - 1].label}</span>
      </div>
    </div>
  );
}

export default function AdminDashboard({ session }: { session: { name: string; role: Role } }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(async r => {
        if (!r.ok) throw new Error((await r.json()).error || 'Gagal memuat statistik');
        return r.json();
      })
      .then(setStats)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="card center-pad">Memuat statistik...</div>;
  if (error) return <div className="alert alert-red">{error}</div>;

  const r = stats?.ringkasan;
  const roleBars = (stats?.usersByRole ?? []).map(d => ({ label: ROLE_META[d._id]?.label ?? d._id, value: d.jumlah }));
  const kelasBars = (stats?.kelasAgg ?? []).map(d => ({
    label: [d._id.level, d._id.major].filter(Boolean).join(' ') || 'Tanpa level',
    value: d.jumlah,
  }));
  const trend = (stats?.submissionTrend ?? []).map(d => ({ label: d._id, value: d.jumlah }));

  return (
    <>
      <div className="between mb">
        <div>
          <h1 className="page-title">Dashboard Administrator</h1>
          <p className="muted">Selamat datang, {session.name}. Berikut ringkasan sistem secara keseluruhan.</p>
        </div>
      </div>

      <div className="grid grid-4 mb">
        <Stat icon={Users} title="Total User" value={r!.totalUsers} sub={`${r!.totalSiswa} siswa · ${r!.totalGuru} guru`} />
        <Stat icon={School} title="Kelas Aktif" value={r!.totalKelas} sub="Rombel terdaftar" tone="green" />
        <Stat icon={LibraryBig} title="Mata Pelajaran" value={r!.totalMapel} sub="Mata pelajaran aktif" tone="orange" />
        <Stat icon={BookOpen} title="Materi" value={r!.totalMateri} sub="Materi pembelajaran" />
      </div>

      <div className="grid grid-4 mb">
        <Stat icon={ClipboardList} title="Tugas & Proyek" value={r!.totalTugas} sub="Tugas aktif" tone="green" />
        <Stat icon={FileText} title="Quiz & Ujian" value={r!.totalQuiz} sub="Soal siap" tone="orange" />
        <Stat icon={Megaphone} title="Pengumuman" value={r!.totalPengumuman} sub="Info ke pengguna" />
        <Stat icon={BarChart3} title="Data Nilai" value={r!.totalGrade} sub="Nilai tersimpan" tone="green" />
      </div>

      <div className="grid grid-2 mb">
        <div className="card">
          <div className="between mb">
            <h2 className="card-title">Sebaran User per Role</h2>
            <span className="badge">{r!.totalUsers} total</span>
          </div>
          <BarChart data={roleBars} />
        </div>

        <div className="card">
          <div className="between mb">
            <h2 className="card-title">Kelas per Tingkat/Jurusan</h2>
            <span className="badge">{r!.totalKelas} kelas</span>
          </div>
          <BarChart data={kelasBars} />
        </div>
      </div>

      <div className="grid grid-2 mb">
        <div className="card">
          <div className="between mb">
            <h2 className="card-title">Tren Pengumpulan Tugas (7 hari)</h2>
            <span className="badge">{r!.totalSubmission} total</span>
          </div>
          <TrendChart data={trend} />
        </div>

        <div className="card">
          <div className="between mb">
            <h2 className="card-title">Rata-rata Nilai per Mata Pelajaran</h2>
            <span className="badge badge-green">Nilai final</span>
          </div>
          {stats!.avgGradeBySubject.length ? (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr><th>Mata Pelajaran</th><th>Rata-rata</th><th>Jumlah</th><th>Performa</th></tr>
                </thead>
                <tbody>
                  {stats!.avgGradeBySubject.map(g => (
                    <tr key={g.nama + g.kode}>
                      <td><b>{g.nama}</b><div className="muted" style={{ fontSize: 12 }}>{g.kode}</div></td>
                      <td>
                        <span className={`badge ${g.rataRata >= 75 ? 'badge-green' : g.rataRata >= 60 ? 'badge-orange' : 'badge-red'}`}>
                          {g.rataRata}
                        </span>
                      </td>
                      <td>{g.jumlah}</td>
                      <td>
                        <div className="bar-track slim"><div className="bar-fill" style={{ width: `${Math.min(100, g.rataRata)}%` }} /></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <div className="muted center-pad">Belum ada nilai yang masuk.</div>}
        </div>
      </div>

      <div className="grid grid-2 mb">
        <div className="card">
          <div className="between mb">
            <h2 className="card-title">Tugas Belum Ada Pengumpulan</h2>
            <span className="badge badge-red">{stats!.tugasBelumDikumpulkan} tugas</span>
          </div>
          <div className="alert alert-orange">
            <AlertCircle size={17} />
            <span>
              {stats!.tugasBelumDikumpulkan === 0
                ? 'Semua tugas sudah memiliki pengumpulan.'
                : `Ada ${stats!.tugasBelumDikumpulkan} tugas yang belum ada pengumpulan dari siswa.`}
            </span>
          </div>
          <div className="quick-links">
            <Link href="/admin/pengumuman" className="btn btn-ghost"><Megaphone size={16} /> Beri pengumuman</Link>
            <Link href="/admin/siswa" className="btn btn-ghost"><Users size={16} /> Kelola siswa</Link>
          </div>
        </div>

        <div className="card">
          <div className="between mb">
            <h2 className="card-title">Aksi Cepat</h2>
          </div>
          <div className="quick-links">
            <Link href="/admin/siswa" className="btn btn-primary"><GraduationCap size={16} /> Tambah Siswa</Link>
            <Link href="/admin/guru" className="btn btn-primary"><Users size={16} /> Tambah Guru</Link>
            <Link href="/admin/kelas" className="btn btn-primary"><School size={16} /> Tambah Kelas</Link>
            <Link href="/admin/pelajaran" className="btn btn-primary"><LibraryBig size={16} /> Tambah Mata Pelajaran</Link>
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="between mb">
            <h2 className="card-title">User Terbaru</h2>
            <Link href="/admin/siswa" className="btn btn-ghost btn-sm">Lihat semua <ArrowRight size={14} /></Link>
          </div>
          {stats!.userTerbaru.length ? (
            <table className="table">
              <thead><tr><th>Nama</th><th>Role</th><th>Kelas</th></tr></thead>
              <tbody>
                {stats!.userTerbaru.map(u => (
                  <tr key={u._id}>
                    <td><b>{u.name}</b><div className="muted" style={{ fontSize: 12 }}>{u.email}</div></td>
                    <td><span className={`badge ${ROLE_META[u.role]?.badge ?? 'badge'}`}>{ROLE_META[u.role]?.label ?? u.role}</span></td>
                    <td>{u.classId?.name ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <div className="muted center-pad">Belum ada user.</div>}
        </div>

        <div className="card">
          <div className="between mb">
            <h2 className="card-title">Pengumuman Terbaru</h2>
            <Link href="/admin/pengumuman" className="btn btn-ghost btn-sm">Lihat semua <ArrowRight size={14} /></Link>
          </div>
          {stats!.pengumumanTerbaru.length ? (
            <table className="table">
              <thead><tr><th>Judul</th><th>Dari</th></tr></thead>
              <tbody>
                {stats!.pengumumanTerbaru.map(p => (
                  <tr key={p._id}>
                    <td><b>{p.title}</b><div className="muted" style={{ fontSize: 12 }}>{p.body?.slice(0, 60) ?? ''}</div></td>
                    <td>{p.authorId?.name ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <div className="muted center-pad">Belum ada pengumuman.</div>}
        </div>
      </div>
    </>
  );
}
