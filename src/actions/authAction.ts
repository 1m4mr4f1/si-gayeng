'use server'

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// --- 1. KONFIGURASI KEAMANAN (WAJIB SAMA DENGAN MIDDLEWARE) ---
const SECRET_ENV = process.env.AUTH_SECRET || "rahasia_default_debug_123456";
const SECRET_KEY = new TextEncoder().encode(SECRET_ENV);
const COOKIE_NAME = 'session_token';

// Cek lingkungan: Jika development (localhost), secure dimatikan agar cookie mau disimpan
const isProduction = process.env.NODE_ENV === 'production';

interface SessionPayload {
  id: number;
  role: 'admin' | 'mitra';
  nama: string;
}

// --- 2. HELPER: MEMBUAT SESSION ---
async function createSession(payload: SessionPayload) {
  // A. Buat Token JWT
  const token = await new SignJWT({ 
    id: payload.id, 
    role: payload.role, 
    nama: payload.nama 
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(SECRET_KEY);

  // B. Simpan ke Cookie
  const cookieStore = await cookies();
  
  // Simpan Token Utama
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 2 * 60 * 60,  // 2 Jam
  });

  // Simpan Role (Opsional, helper client-side)
  cookieStore.set('user_role', payload.role, {
    httpOnly: false,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 2 * 60 * 60,
  });
  
  console.log(`[AUTH] Session dibuat untuk: ${payload.nama} (${payload.role})`);
}

// --- 3. LOGIN ADMIN ---
export async function loginAdminAction(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) return { error: "Username dan password wajib diisi." };

  try {
    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return { error: "Username atau password salah." };
    }
    
    await createSession({ id: admin.id, role: 'admin', nama: admin.nama });
    
    // ✅ Tunggu sebentar agar cookie sempat di-set
    await new Promise(resolve => setTimeout(resolve, 100));
    
  } catch (error) {
    console.error("Login Admin Error:", error);
    return { error: "Terjadi kesalahan server." };
  }
  
  redirect("/dashboard/admin");
}

// --- 4. LOGIN MITRA ---
export async function loginMitraAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "Email dan password wajib diisi." };

  try {
    const mitra = await prisma.mitra.findUnique({ where: { email } });
    if (!mitra || !(await bcrypt.compare(password, mitra.password))) {
      return { error: "Email atau password salah." };
    }

    await createSession({ id: mitra.id, role: 'mitra', nama: mitra.namaUsaha });
    
    // ✅ PENTING: Tunggu sebentar agar cookie sempat di-set
    await new Promise(resolve => setTimeout(resolve, 100));
    
  } catch (error) {
    console.error("Login Mitra Error:", error);
    return { error: "Terjadi kesalahan server." };
  }

  redirect("/dashboard/mitra");
}

// --- 5. REGISTER MITRA ---
export async function registerMitraAction(formData: FormData) {
  const namaUsaha = formData.get("namaUsaha") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const noHp = formData.get("noHp") as string;

  if (!namaUsaha || !email || !password || !noHp) return { error: "Semua kolom wajib diisi." };

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
    console.error("Register Error:", error);
    return { error: "Gagal mendaftar." };
  }

  redirect("/LoginMitra?registrasi=sukses");
}

// --- 6. LOGOUT ---
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  cookieStore.delete('user_role');
  redirect("/");
}