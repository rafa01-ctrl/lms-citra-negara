import { connectDB } from '@/lib/db';
import Announcement from '@/models/Announcement';
import { requireRole } from '@/lib/auth';
import { fail, ok } from '@/lib/api';

const EDITABLE = ['title', 'content', 'targetRoles', 'classIds'] as const;
const ROLES = ['admin', 'guru', 'kurikulum', 'kepsek', 'siswa'];

type Ctx = { params: Promise<{ id: string }> };

/** Hanya penulis asli atau admin yang boleh mengubah/menghapus. */
async function mustBeOwnerOrAdmin(id: string) {
  const s = await requireRole(['admin', 'guru', 'kurikulum', 'kepsek']);
  await connectDB();
  const doc = await Announcement.findById(id);
  if (!doc) return { error: fail('Pengumuman tidak ditemukan', 404) as any };
  if (s.role !== 'admin' && String(doc.authorId) !== s.id) {
    return { error: fail('Hanya penulis atau admin yang dapat mengubah pengumuman ini', 403) as any };
  }
  return { doc };
}

export async function PATCH(req: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    const b = await req.json();
    const res = await mustBeOwnerOrAdmin(id);
    if (res.error) return res.error;
    const doc = res.doc!;

    const update: Record<string, unknown> = {};
    for (const k of EDITABLE) if (b[k] !== undefined) update[k] = b[k] === '' ? null : b[k];

    // targetRoles disimpan sebagai array role; form mengirim teks dipisah koma.
    if (update.targetRoles !== undefined) {
      const list = (Array.isArray(b.targetRoles)
        ? b.targetRoles.map(String)
        : String(b.targetRoles ?? '').split(','))
        .map((s: string) => s.trim())
        .filter((s: string) => ROLES.includes(s));
      update.targetRoles = list;
    }

    if (!Object.keys(update).length) return fail('Tidak ada data yang diperbarui');

    Object.assign(doc, update);
    await doc.save();
    return ok(await doc.populate('authorId', 'name'));
  } catch {
    return fail('Gagal memperbarui pengumuman', 500);
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    const res = await mustBeOwnerOrAdmin(id);
    if (res.error) return res.error;
    await res.doc!.deleteOne();
    return ok({ deleted: id });
  } catch {
    return fail('Gagal menghapus pengumuman', 500);
  }
}
