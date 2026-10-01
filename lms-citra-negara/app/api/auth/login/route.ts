import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { comparePassword, createSession } from '@/lib/auth';
import User from '@/models/User';
import type { Role } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password wajib diisi' }, { status: 400 });
    }

    // Cari user berdasarkan email (case-insensitive, sama seperti saat seed)
    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: 'Email tidak terdaftar' }, { status: 401 });
    }

    // Password disimpan sebagai hash bcrypt oleh hashPassword()
    const valid = await comparePassword(password, String(user.password));
    if (!valid) {
      return NextResponse.json({ error: 'Password salah' }, { status: 401 });
    }

    // Pasang cookie session lms_session supaya requireRole() bisa dipakai
    await createSession({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role as Role,
      classId: user.classId,
    });

    return NextResponse.json({
      message: 'Login berhasil',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan';
    console.error('Login gagal:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}