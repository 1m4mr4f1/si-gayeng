'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth"; // Pastikan auth helper Anda bisa cek role admin

// --- VERIFIKASI MITRA ---
export async function verifyMitraAction(formData: FormData) {
  // Cek Admin (Opsional: Tambahkan security check session disini)
  
  const mitraId = parseInt(formData.get("id") as string);
  
  await prisma.mitra.update({
    where: { id: mitraId },
    data: { statusVerifikasi: true }
  });

  revalidatePath("/dashboard/admin/mitra");
}

// --- BATALKAN VERIFIKASI (SUSPEND) ---
export async function unverifyMitraAction(formData: FormData) {
  const mitraId = parseInt(formData.get("id") as string);
  
  await prisma.mitra.update({
    where: { id: mitraId },
    data: { statusVerifikasi: false }
  });

  revalidatePath("/dashboard/admin/mitra");
}

// --- HAPUS MITRA ---
export async function deleteMitraAction(formData: FormData) {
  const mitraId = parseInt(formData.get("id") as string);
  
  // Hapus produknya dulu (Cascade manual jika di schema tidak cascade delete)
  await prisma.produk.deleteMany({ where: { mitraId } });
  
  await prisma.mitra.delete({
    where: { id: mitraId }
  });

  revalidatePath("/dashboard/admin/mitra");
}