import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { hashPassword, requireRole } from '@/lib/auth';
import { fail, ok } from '@/lib/api';

/** Field yang boleh diubah admin. Password ditangani terpisah. */
const EDITABLE = ['name', 'email', 'role', 'classId', 'nis', 'nip', 'phone'] as const;

type Ctx = { params: Promise<{ id: string }> };

/** Perbarui user. Password hanya di-rehash bila yang baru dikirim. */
export async function PATCH(req: Request, { params }: Ctx) {
  try {
    const me = await requireRole(['admin']);
    const { id } = await params;
    const b = await req.json();
    await connectDB();

    const update: Record<string, unknown> = {};
    for (const k of EDITABLE) if (b[k] !== undefined) update[k] = b[k] === '' ? null : b[k];
    if (update.email) update.email = String(update.email).toLowerCase();

    // Cegah email bentrok dengan user lain.
    if (update.email) {
      const bentrok = await User.findOne({ email: update.email, _id: { $ne: id } });
      if (bentrok) return fail('Email sudah dipakai user lain', 409);
    }

    // Password hanya diubah bila diisi; form edit boleh mengosongkannya.
    if (b.password) {
      if (String(b.password).length < 6) return fail('Password minimal 6 karakter');
      update.password = await hashPassword(b.password);
    }

    if (!Object.keys(update).length) return fail('Tidak ada data yang diperbarui');

    // Cegah admin mengunci dirinya sendiri di luar sistem.
    if (id === me.id && update.role && update.role !== 'admin') {
      return fail('Tidak bisa menurunkan role akun Anda sendiri');
    }

    const user = await User.findByIdAndUpdate(id, update, { new: true }).select('-password');
    if (!user) return fail('User tidak ditemukan', 404);
    return ok(user);
  } catch (e) {
    console.error(e);
    return fail('Gagal memperbarui user', 500);
  }
}

/** Hapus user. Dilindungi agar admin tidak bisa menghapus akunnya sendiri. */
export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    const me = await requireRole(['admin']);
    const { id } = await params;
    if (id === me.id) return fail('Tidak bisa menghapus akun Anda sendiri');
    await connectDB();
    const user = await User.findByIdAndDelete(id);
    if (!user) return fail('User tidak ditemukan', 404);
    return ok({ deleted: id });
  } catch (e) {
    console.error(e);
    return fail('Gagal menghapus user', 500);
  }
}
