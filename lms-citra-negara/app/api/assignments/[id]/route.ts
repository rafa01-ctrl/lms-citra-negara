import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Assignment from '@/models/Assignment';
import { requireRole } from '@/lib/auth';

type Ctx = { params: Promise<{ id: string }> };

const EDITABLE = ['title', 'description', 'dueDate', 'subjectId', 'classIds', 'attachmentUrl'] as const;

/** Guru hanya boleh mengubah atau menghapus tugas miliknya sendiri. */
export async function PATCH(req: Request, { params }: Ctx) {
  const s = await requireRole(['guru']);
  const { id } = await params;
  await connectDB();

  const doc = await Assignment.findById(id);
  if (!doc) return NextResponse.json({ error: 'Tugas tidak ditemukan' }, { status: 404 });
  if (String(doc.teacherId) !== s.id) {
    return NextResponse.json({ error: 'Anda hanya bisa mengubah tugas milik sendiri' }, { status: 403 });
  }

  const b = await req.json();
  for (const k of EDITABLE) {
    if (b[k] === undefined) continue;
    (doc as any)[k] = b[k] === '' ? (k === 'classIds' ? [] : null) : b[k];
  }
  await doc.save();
  return NextResponse.json(await doc.populate('teacherId', 'name'));
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const s = await requireRole(['guru']);
  const { id } = await params;
  await connectDB();

  const doc = await Assignment.findById(id);
  if (!doc) return NextResponse.json({ error: 'Tugas tidak ditemukan' }, { status: 404 });
  if (String(doc.teacherId) !== s.id) {
    return NextResponse.json({ error: 'Anda hanya bisa menghapus tugas milik sendiri' }, { status: 403 });
  }
  await doc.deleteOne();
  return NextResponse.json({ deleted: id });
}
