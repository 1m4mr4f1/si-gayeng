'use server'

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// KITA PERTAHANKAN LOGIKA INI AGAR STABIL
const SECRET_ENV = process.env.AUTH_SECRET || "rahasia_default_debug_123456";
const SECRET_KEY = new TextEncoder().encode(SECRET_ENV);

// --- HELPER: MEMBUAT SESSION ---
async function createSession(payload: any) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(SECRET_KEY);

  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === 'production';

  cookieStore.set('session_token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
  });

  cookieStore.set('user_role', payload.role, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
  });
}

// --- LOGIKA LOGIN ADMIN ---
export async function loginAdminAction(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) return { error: "Username dan password wajib diisi." };

  try {
    const admin = await prisma.admin.findUnique({ where: { username } });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return { error: "Username atau password salah." };
    }

    await createSession({ id: admin.id, role: 'admin', name: admin.nama });

  } catch (error) {
    console.error("Login Error:", error); // Log error asli tetap penting jika crash
    return { error: "Terjadi kesalahan pada server." };
  }

  redirect("/dashboard/admin");
}

// --- LOGIKA LOGIN MITRA ---
export async function loginMitraAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "Email dan password wajib diisi." };

  try {
    const mitra = await prisma.mitra.findUnique({ where: { email } });

    if (!mitra || !(await bcrypt.compare(password, mitra.password))) {
      return { error: "Email atau password salah." };
    }

    await createSession({ id: mitra.id, role: 'mitra', name: mitra.namaUsaha });

  } catch (error) {
    console.error("Login Error:", error);
    return { error: "Terjadi kesalahan pada server." };
  }

  redirect("/dashboard/mitra");
}

// --- LOGIKA REGISTER MITRA ---
export async function registerMitraAction(formData: FormData) {
  const namaUsaha = formData.get("namaUsaha") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const noHp = formData.get("noHp") as string;

  if (!namaUsaha || !email || !password || !noHp) {
    return { error: "Semua kolom wajib diisi." };
  }

  try {
    const existingUser = await prisma.mitra.findUnique({ where: { email } });
    if (existingUser) return { error: "Email sudah terdaftar." };

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.mitra.create({
      data: {
        namaUsaha,
        email,
        password: hashedPassword,
        noHp,
        statusVerifikasi: false,
        statusBuka: false,
      }
    });

  } catch (error) {
    return { error: "Gagal mendaftar, silakan coba lagi." };
  }

  redirect("/LoginMitra?registrasi=sukses");
}

// --- LOGIKA LOGOUT ---
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('session_token');
  cookieStore.delete('user_role');
  redirect("/");
}