"use client";
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, ArrowLeft, ShieldCheck, GraduationCap, Users, BookOpen, Landmark, Building2 } from 'lucide-react';

type Role = 'admin' | 'guru' | 'kurikulum' | 'kepsek' | 'siswa';

/** Akun demo per role. Dipakai untuk mengisi form otomatis + tombol login cepat. */
const ROLES: {
  key: Role;
  label: string;
  email: string;
  password: string;
  icon: any;
  warna: string;
  desc: string;
}[] = [
    { key: 'admin', label: 'Administrator', email: 'admin@citra.sch.id', password: 'admin123', icon: ShieldCheck, warna: '#1d4ed8', desc: 'Kelola siswa, guru, kelas, dan mata pelajaran.' },
    { key: 'guru', label: 'Guru', email: 'guru@citra.sch.id', password: 'guru123', icon: GraduationCap, warna: '#047857', desc: 'Kelola materi, tugas, quiz, dan nilai.' },
    { key: 'kurikulum', label: 'Kurikulum', email: 'kurikulum@citra.sch.id', password: 'kurikulum123', icon: BookOpen, warna: '#b45309', desc: 'Data guru, mapel, dan monitoring nilai.' },
    { key: 'kepsek', label: 'Kepala Sekolah', email: 'kepsek@citra.sch.id', password: 'kepsek123', icon: Landmark, warna: '#7c3aed', desc: 'Guru, kelas, laporan, dan monitoring nilai.' },
    { key: 'siswa', label: 'Siswa', email: 'siswa@citra.sch.id', password: 'siswa123', icon: Users, warna: '#be123c', desc: 'Materi, tugas, quiz, dan nilai pribadi.' },
  ];

export default function Login() {
  const [step, setStep] = useState<'pilih' | 'login'>('pilih');
  const [role, setRole] = useState<Role>('guru');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const aktif = ROLES.find(r => r.key === role)!;

  function pilihRole(r: (typeof ROLES)[number]) {
    setRole(r.key);
    setEmail(r.email);
    setPassword(r.password);
    setError('');
    setStep('login');
  }

  async function submit(e: FormEvent, pwd?: string) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pwd ?? password }),
    });
    const d = await res.json();
    if (!res.ok) {
      setError(d.error || 'Login gagal');
      setLoading(false);
      return;
    }
    router.push('/');
    router.refresh();
  }

  return (
    <div className="login-page">
      <div className={step === 'pilih' ? 'role-gate' : 'login-card'}>
        {step === 'pilih' ? (
          <>
            <div className="login-logo" style={{ margin: '0 auto 18px' }}>CN</div>
            <h1 style={{ marginBottom: 4, textAlign: 'center' }}>LMS SMK Citra Negara</h1>
            <p className="muted" style={{ textAlign: 'center', marginBottom: 26 }}>
              Pilih role untuk masuk. Akun dan password akan terisi otomatis.
            </p>

            <div className="role-grid">
              {ROLES.map(r => {
                const Icon = r.icon;
                return (
                  <button
                    key={r.key}
                    type="button"
                    className="role-card"
                    onClick={() => pilihRole(r)}
                  >
                    <span className="role-icon" style={{ background: `${r.warna}15`, color: r.warna }}>
                      <Icon size={22} />
                    </span>
                    <span className="role-nama">{r.label}</span>
                    <span className="role-desc">{r.desc}</span>
                    <span className="role-email">{r.email}</span>
                  </button>
                );
              })}
            </div>

            <div className="card mt" style={{ background: '#f8fafc' }}>
              <b style={{ fontSize: 13 }}>Tentang role</b>
              <div style={{ fontSize: 12, marginTop: 8, lineHeight: 1.8, color: 'var(--muted)' }}>
                Setiap role punya menu dan hak akses berbeda. Admin mengelola seluruh data,
                Guru membuat materi/tugas/quiz dan memberi nilai, sedangkan Siswa hanya
                melihat materinya sendiri.
              </div>
            </div>
          </>
        ) : (
          <>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              style={{ marginBottom: 14 }}
              onClick={() => { setStep('pilih'); setError(''); }}
            >
              <ArrowLeft size={14} /> Ganti role
            </button>

            <div className="login-logo" style={{ background: aktif.warna, display: 'inline-grid' }}>
              {(() => { const I = aktif.icon; return <I size={24} />; })()}
            </div>
            <h1 style={{ marginBottom: 4 }}>Login sebagai {aktif.label}</h1>
            <p className="muted">{aktif.desc}</p>

            {error && <div className="alert mb">{error}</div>}

            <form className="form" onSubmit={submit}>
              <div>
                <label className="label">Email</label>
                <input
                  className="input"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="nama@sekolah.id"
                />
              </div>
              <div>
                <label className="label">Password</label>
                <input
                  type="password"
                  className="input"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              <button className="btn btn-primary" disabled={loading}>
                <LogIn size={17} /> {loading ? 'Memproses...' : 'Masuk'}
              </button>
            </form>

            <div className="card mt" style={{ background: '#f8fafc' }}>
              <b style={{ fontSize: 13 }}>Akun demo</b>
              <div style={{ fontSize: 12, marginTop: 8, lineHeight: 1.8 }}>
                <div>{aktif.email} / {aktif.password}</div>
                <div className="muted" style={{ marginTop: 4 }}>
                  Ingin pindah role tanpa logout? Tekan &quot;Ganti role&quot; di atas.
                </div>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ marginTop: 12 }}
                disabled={loading}
                onClick={e => submit(e as any, aktif.password)}
              >
                <Building2 size={14} /> Login cepat sebagai {aktif.label}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
