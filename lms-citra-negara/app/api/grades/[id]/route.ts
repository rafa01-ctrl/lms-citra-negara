import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Grade from '@/models/Grade';
import { requireRole } from '@/lib/auth';

type Ctx = { params: Promise<{ id: string }> };

/**
 * Nilai dihitung ulang setiap kali komponen diubah.
 * Bobot tetap: tugas 30%, quiz 30%, ujian 40%.
 */
function hitung(v: { assignment: number; quiz: number; exam: number }) {
  return Math.round(v.assignment * 0.3 + v.quiz * 0.3 + v.exam * 0.4);
}

/** Guru hanya boleh mengubah nilai yang ia buat sendiri. */
export async function PATCH(req: Request, { params }: Ctx) {
  const s = await requireRole(['guru']);
  const { id } = await params;
  await connectDB();

  const doc = await Grade.findById(id);
  if (!doc) return NextResponse.json({ error: 'Data nilai tidak ditemukan' }, { status: 404 });
  if (String(doc.teacherId) !== s.id) {
    return NextResponse.json({ error: 'Anda hanya bisa mengubah nilai milik sendiri' }, { status: 403 });
  }

  const b = await req.json();
  for (const k of ['assignment', 'quiz', 'exam'] as const) {
    if (b[k] === undefined) continue;
    const n = Number(b[k]);
    if (Number.isNaN(n) || n < 0 || n > 100) {
      return NextResponse.json({ error: 'Nilai harus antara 0 sampai 100' }, { status: 400 });
    }
    (doc as any)[k] = n;
  }
  doc.final = hitung({ assignment: doc.assignment, quiz: doc.quiz, exam: doc.exam });
  await doc.save();
  return NextResponse.json(await doc.populate('studentId', 'name nis').populate('subjectId', 'name'));
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const s = await requireRole(['guru']);
  const { id } = await params;
  await connectDB();

  const doc = await Grade.findById(id);
  if (!doc) return NextResponse.json({ error: 'Data nilai tidak ditemukan' }, { status: 404 });
  if (String(doc.teacherId) !== s.id) {
    return NextResponse.json({ error: 'Anda hanya bisa menghapus nilai milik sendiri' }, { status: 403 });
  }
  await doc.deleteOne();
  return NextResponse.json({ deleted: id });
}
