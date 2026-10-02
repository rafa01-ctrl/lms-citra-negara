import { connectDB } from '@/lib/db';
import Class from '@/models/Class';
import { requireRole } from '@/lib/auth';
import { fail, ok } from '@/lib/api';

const EDITABLE = ['name', 'level', 'major', 'academicYear', 'homeroomTeacherId'] as const;

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  try {
    await requireRole(['admin']);
    const { id } = await params;
    const b = await req.json();
    await connectDB();

    const update: Record<string, unknown> = {};
    for (const k of EDITABLE) if (b[k] !== undefined) update[k] = b[k] === '' ? null : b[k];
    if (!Object.keys(update).length) return fail('Tidak ada data yang diperbarui');

    const doc = await Class.findByIdAndUpdate(id, update, { new: true }).populate('homeroomTeacherId', 'name');
    if (!doc) return fail('Kelas tidak ditemukan', 404);
    return ok(doc);
  } catch {
    return fail('Gagal memperbarui kelas', 500);
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    await requireRole(['admin']);
    const { id } = await params;
    await connectDB();
    const doc = await Class.findByIdAndDelete(id);
    if (!doc) return fail('Kelas tidak ditemukan', 404);
    return ok({ deleted: id });
  } catch {
    return fail('Gagal menghapus kelas', 500);
  }
}
