import { connectDB } from '@/lib/db';
import Subject from '@/models/Subject';
import { requireRole } from '@/lib/auth';
import { fail, ok } from '@/lib/api';

const EDITABLE = ['name', 'code', 'description', 'teacherIds', 'classIds'] as const;

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

    const doc = await Subject.findByIdAndUpdate(id, update, { new: true })
      .populate('teacherIds', 'name').populate('classIds', 'name');
    if (!doc) return fail('Mata pelajaran tidak ditemukan', 404);
    return ok(doc);
  } catch {
    return fail('Gagal memperbarui mata pelajaran', 500);
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    await requireRole(['admin']);
    const { id } = await params;
    await connectDB();
    const doc = await Subject.findByIdAndDelete(id);
    if (!doc) return fail('Mata pelajaran tidak ditemukan', 404);
    return ok({ deleted: id });
  } catch {
    return fail('Gagal menghapus mata pelajaran', 500);
  }
}
