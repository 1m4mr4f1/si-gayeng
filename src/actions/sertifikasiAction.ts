'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
// Hapus redirect jika tidak dipakai, atau gunakan jika perlu
// import { redirect } from "next/navigation"; 

// --- 1. MITRA: AJUKAN SERTIFIKASI ---
// Kita ubah return type-nya agar kompatibel dengan <form action>
export async function ajukanSertifikasi(formData: FormData) {
  const mitraId = Number(formData.get("mitraId"));
  const jenis = formData.get("jenis") as string;
  const dokumenMitra = "persyaratan_mitra_" + Date.now() + ".jpg"; 

  if (!mitraId || !jenis) {
    console.error("Data tidak lengkap");
    return; // Return void (kosong) agar form tidak error
  }

  try {
    await prisma.sertifikasi.create({
      data: {
        mitraId,
        jenis,
        status: "PENDING",
        dokumenMitra
      }
    });
    
    revalidatePath("/dashboard/mitra/sertifikasi");
    // Opsional: return { success: true }; tapi form standar Next.js tidak butuh ini
  } catch (error) {
    console.error("Gagal ajukan:", error);
    // Jangan return object error ke <form action>, cukup log saja
  }
}

// --- 2. ADMIN: VALIDASI ---
export async function updateStatusSertifikasi(formData: FormData) {
  const id = Number(formData.get("id"));
  const status = formData.get("status") as string;
  const catatan = formData.get("catatan") as string;
  
  const sertifikatResmi = status === "SELESAI" ? "sertifikat_resmi_" + id + ".pdf" : null;

  try {
    await prisma.sertifikasi.update({
      where: { id },
      data: {
        status,
        catatan,
        sertifikatResmi: sertifikatResmi || undefined
      }
    });

    revalidatePath("/dashboard/admin/sertifikasi");
  } catch (error) {
    console.error("Gagal update:", error);
  }
}