'use server'

import { prisma } from "@/lib/prima"; // PERBAIKAN: Pastikan ejaan 'prisma' benar
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SECRET_KEY = new TextEncoder().encode(process.env.AUTH_SECRET);

// --- HELPER: MEMBUAT SESSION ---
async function createSession(payload: any) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h') // Sesi berlaku 2 jam
    .sign(SECRET_KEY);

  const cookieStore = await cookies();

  // 1. Simpan Token Terenkripsi (Hanya Server yang bisa baca)
  cookieStore.set('session_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });

  // 2. Simpan Role (Bisa dibaca untuk logika redirect di middleware)
  cookieStore.set('user_role', payload.role, {
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

  try {
    const admin = await prisma.admin.findUnique({
      where: { username }
    });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return { error: "Login Gagal! Cek Username atau Password." };
    }

    await createSession({ id: admin.id, role: 'admin', name: admin.nama });
  
  } catch (error) {
    return { error: "Terjadi kesalahan server." };
  }

  redirect("/dashboard/admin");
}

// --- LOGIKA LOGIN MITRA ---
export async function loginMitraAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "Email dan Password wajib diisi!" };

  try {
    const mitra = await prisma.mitra.findUnique({
      where: { email }
    });

    if (!mitra || !(await bcrypt.compare(password, mitra.password))) {
      return { error: "Login Gagal! Email tidak ditemukan atau Password salah." };
    }

    await createSession({ id: mitra.id, role: 'mitra', name: mitra.namaUsaha });

  } catch (error) {
    return { error: "Terjadi kesalahan server." };
  }

  redirect("/dashboard/mitra");
}

// --- LOGIKA LOGOUT ---
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('session_token');
  cookieStore.delete('user_role');
  redirect("/");
}

// --- LOGIKA REGISTER MITRA (BARU) ---
export async function registerMitraAction(formData: FormData) {
  const namaUsaha = formData.get("namaUsaha") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const noHp = formData.get("noHp") as string;

  // 1. Validasi Input
  if (!namaUsaha || !email || !password || !noHp) {
    return { error: "Semua kolom wajib diisi!" };
  }

  try {
    // 2. Cek apakah email sudah terdaftar
    const existingUser = await prisma.mitra.findUnique({
      where: { email }
    });

    if (existingUser) {
      return { error: "Email sudah terdaftar. Silakan login." };
    }

    // 3. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Simpan ke Database
    await prisma.mitra.create({
      data: {
        namaUsaha,
        email,
        password: hashedPassword,
        noHp,
        // Default Values saat mendaftar:
        statusVerifikasi: false, // Perlu dicek admin dulu
        statusBuka: false,
        latitude: null,          // User set sendiri nanti di dashboard
        longitude: null,
      }
    });

  } catch (error) {
    console.error("Register Error:", error);
    return { error: "Gagal mendaftar, terjadi kesalahan sistem." };
  }

  // 5. Redirect ke halaman Login dengan parameter sukses
  redirect("/LoginMitra?registrasi=sukses");
}