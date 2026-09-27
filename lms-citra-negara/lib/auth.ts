import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export type Role = "admin" | "guru" | "siswa" | "kurikulum" | "kepsek";
export type Session = { id: string; name: string; email: string; role: Role; classId?: string };
const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-change-me");

export async function hashPassword(password: string) { return bcrypt.hash(password, 10); }
export async function comparePassword(password: string, hash: string) { return bcrypt.compare(password, hash); }

export async function createSession(user: { _id: unknown; name: string; email: string; role: Role; classId?: unknown }) {
  const token = await new SignJWT({ id: String(user._id), name: user.name, email: user.email, role: user.role, classId: user.classId ? String(user.classId) : undefined })
    .setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(secret);
  const store = await cookies();
  store.set("lms_session", token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 7, path: "/" });
}

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get("lms_session")?.value;
  if (!token) return null;
  try { const { payload } = await jwtVerify(token, secret); return payload as unknown as Session; }
  catch { return null; }
}

export async function requireRole(roles: Role[]) {
  const session = await getSession();
  if (!session || !roles.includes(session.role)) throw new Error("UNAUTHORIZED");
  return session;
}

export async function currentUser() {
  const session = await getSession();
  if (!session) return null;
  await connectDB();
  return User.findById(session.id).lean();
}
