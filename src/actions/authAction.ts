'use server'

import { findAdminByUsername, findMitraByEmail } from "@/services/authService";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SECRET_KEY = new TextEncoder().encode(process.env.AUTH_SECRET);

// Fungsi Helper membuat Cookie Session
async function createSession(payload: any) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(SECRET_KEY);

  // PERBAIKAN DI SINI: Tambahkan (await cookies())
  const cookieStore = await cookies();
  
  cookieStore.set('session_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });
}

// --- LOGIKA LOGIN ADMIN ---
export async function loginAdminAction(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) return { error: "Username dan Password wajib diisi!" };

  const admin = await findAdminByUsername(username);

  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    return { error: "Login Gagal! Cek Username/Password." };
  }

  await createSession({ id: admin.id, role: 'admin', name: admin.nama });
  redirect("/dashboard/admin");
}

// --- LOGIKA LOGIN MITRA ---
export async function loginMitraAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "Email dan Password wajib diisi!" };

  const mitra = await findMitraByEmail(email);

  if (!mitra || !(await bcrypt.compare(password, mitra.password))) {
    return { error: "Login Gagal! Cek Email/Password." };
  }

  await createSession({ id: mitra.id, role: 'mitra', name: mitra.namaUsaha });
  redirect("/dashboard/mitra");
}

// --- LOGIKA LOGOUT ---
export async function logoutAction() {
  // PERBAIKAN DI SINI: Tambahkan await juga
  (await cookies()).delete('session_token');
  redirect("/");
}