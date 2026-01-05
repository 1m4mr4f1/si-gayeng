'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { generateCertificatePDF } from "@/lib/certificateGenerator"; // Import generator tadi

// ==========================================
// 1. VERIFIKASI AKUN MITRA
// ==========================================
export async function verifyMitraAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return { error: "Akses ditolak!" };
  
  const mitraId = parseInt(formData.get("id") as string);
  
  try {
    await prisma.mitra.update({
      where: { id: mitraId },
      data: { statusVerifikasi: true }
    });

    revalidatePath("/dashboard/admin/mitra");
    revalidatePath("/dashboard/mitra");
    return { success: "Mitra berhasil diverifikasi" };
  } catch (error) {
    return { error: "Gagal memverifikasi mitra" };
  }
}

// ==========================================
// 2. SUSPEND / BATALKAN VERIFIKASI
// ==========================================
export async function unverifyMitraAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return { error: "Akses ditolak!" };

  const mitraId = parseInt(formData.get("id") as string);
  
  try {
    await prisma.mitra.update({
      where: { id: mitraId },
      data: { statusVerifikasi: false }
    });

    revalidatePath("/dashboard/admin/mitra");
    return { success: "Verifikasi mitra dibatalkan" };
  } catch (error) {
    return { error: "Gagal update status" };
  }
}

// ==========================================
// 3. HAPUS MITRA (PERMANEN)
// ==========================================
export async function deleteMitraAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return { error: "Akses ditolak!" };

  const mitraId = parseInt(formData.get("id") as string);
  
  try {
    // Hapus Produk & Sertifikasi terkait dulu
    await prisma.produk.deleteMany({ where: { mitraId } });
    await prisma.sertifikasi.deleteMany({ where: { mitraId } });
    
    // Hapus Akun
    await prisma.mitra.delete({ where: { id: mitraId } });

    revalidatePath("/dashboard/admin/mitra");
    return { success: "Data mitra dihapus permanen" };
  } catch (error) {
    return { error: "Gagal menghapus mitra" };
  }
}

// ==========================================
// 4. VERIFIKASI SERTIFIKASI (HALAL/BPOM) 🎖️
// ==========================================
export async function verifikasiSertifikasiAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return { error: "Akses ditolak!" };

  const id = parseInt(formData.get("id") as string);
  const action = formData.get("action") as string; // "APPROVE" atau "REJECT"
  const nomorSertifikat = formData.get("nomorSertifikat") as string;
  const catatan = formData.get("catatan") as string;

  try {
    // Ambil data detail untuk generate PDF
    const dataSertifikasi = await prisma.sertifikasi.findUnique({
      where: { id },
      include: { mitra: true }
    });

    if (!dataSertifikasi) return { error: "Data pengajuan tidak ditemukan" };

    if (action === "APPROVE") {
      if (!nomorSertifikat) return { error: "Nomor Sertifikat wajib diisi!" };

      // A. Generate PDF Otomatis
      const pdfUrl = await generateCertificatePDF(
        dataSertifikasi.mitra.namaUsaha,
        dataSertifikasi.jenis,
        nomorSertifikat
      );

      // B. Update Database
      await prisma.sertifikasi.update({
        where: { id },
        data: {
          status: "APPROVED",
          nomorSertifikat: nomorSertifikat,
          catatan: null,
          sertifikatResmi: pdfUrl // Simpan link PDF
        }
      });
    } 
    else if (action === "REJECT") {
      if (!catatan) return { error: "Alasan penolakan wajib diisi!" };

      await prisma.sertifikasi.update({
        where: { id },
        data: {
          status: "REJECTED",
          catatan: catatan,
          nomorSertifikat: null,
          sertifikatResmi: null
        }
      });
    }

    // --- REVALIDASI PATH (PENTING) ---
    // Agar perubahan langsung terlihat di Mitra dan Admin
    revalidatePath("/dashboard/admin/sertifikasi");
    revalidatePath("/dashboard/mitra/legalitas");
    
    return { success: `Status berhasil diubah menjadi ${action}` };

  } catch (error) {
    console.error("Verifikasi Error:", error);
    return { error: "Gagal memproses data sertifikasi" };
  }
}