'use server'

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile } from "fs/promises"; // Modul untuk tulis file
import path from "path";

// ==========================================
// 1. UPDATE PROFIL MITRA
// ==========================================
export async function updateProfilAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'mitra') return;

  const namaUsaha = formData.get("namaUsaha") as string;
  const deskripsi = formData.get("deskripsi") as string;
  const kategori = formData.get("kategori") as string;
  const noHp = formData.get("noHp") as string;
  const alamat = formData.get("alamat") as string;
  
  // Konversi Koordinat
  const latStr = formData.get("latitude") as string;
  const lngStr = formData.get("longitude") as string;
  const lat = latStr ? parseFloat(latStr) : null;
  const lng = lngStr ? parseFloat(lngStr) : null;

  await prisma.mitra.update({
    where: { id: session.id as number },
    data: {
      namaUsaha,
      deskripsi,
      kategori,
      noHp,
      alamat,
      latitude: lat,
      longitude: lng,
    }
  });

  revalidatePath('/dashboard/mitra/profil');
  // Redirect untuk refresh data session jika perlu, atau sekedar UX
  redirect('/dashboard/mitra/profil'); 
}

// ==========================================
// 2. KELOLA PRODUK
// ==========================================
export async function createProductAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'mitra') return;

  const namaProduk = formData.get("namaProduk") as string;
  const harga = formData.get("harga") as string;
  const deskripsi = formData.get("deskripsi") as string;

  // Catatan: Saat ini foto produk masih dummy. 
  // Jika ingin upload foto produk juga, logikanya sama dengan sertifikasi di bawah.
  await prisma.produk.create({
    data: {
      namaProduk,
      harga: parseFloat(harga),
      deskripsi,
      mitraId: session.id as number,
      fotoProduk: "https://placehold.co/400?text=Produk" 
    }
  });

  revalidatePath('/dashboard/mitra/produk');
}

export async function deleteProductAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'mitra') return;

  const produkId = parseInt(formData.get("id") as string);

  // Security Check
  const produk = await prisma.produk.findUnique({ where: { id: produkId } });
  if (produk?.mitraId !== session.id) return;

  await prisma.produk.delete({ where: { id: produkId } });

  revalidatePath('/dashboard/mitra/produk');
}

// ==========================================
// 3. KELOLA SERTIFIKASI (FIX UPLOAD FILE 📂)
// ==========================================

export async function ajukanSertifikasiAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'mitra') return { error: "Sesi habis" };

  const jenis = formData.get("jenis") as string;
  const file = formData.get("dokumen") as File; // Ambil file binary

  // A. Validasi Input
  if (!jenis) return { error: "Pilih jenis sertifikasi!" };
  if (!file || file.size === 0) return { error: "Wajib upload dokumen!" };

  // B. Validasi File (Max 2MB, PDF/Gambar Only)
  if (file.size > 2 * 1024 * 1024) {
    return { error: "Ukuran file terlalu besar (Maks 2MB)" };
  }
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  if (!allowedTypes.includes(file.type)) {
    return { error: "Format file harus PDF, JPG, atau PNG" };
  }

  // C. Proses Simpan File ke Folder 'public/uploads'
  const safeName = file.name.replace(/\s+/g, '_'); // Hapus spasi pada nama file
  const filename = `${Date.now()}_${safeName}`; // Tambah timestamp biar unik
  
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Pastikan folder public/uploads sudah dibuat manual sebelumnya!
    await writeFile(
      path.join(process.cwd(), "public/uploads", filename),
      buffer
    );
  } catch (err) {
    console.error("Gagal save file:", err);
    return { error: "Gagal menyimpan file ke server." };
  }

  // Path yang disimpan di database (URL Publik)
  const fileUrl = `/uploads/${filename}`;

  // D. Simpan Data ke Database
  try {
    // Cek duplikasi pengajuan
    const existing = await prisma.sertifikasi.findFirst({
      where: { mitraId: session.id as number, jenis: jenis }
    });

    if (existing) {
      return { error: `Anda sudah pernah mengajukan ${jenis}.` };
    }

    await prisma.sertifikasi.create({
      data: {
        mitraId: session.id as number,
        jenis: jenis,
        status: "PENDING",
        dokumenMitra: fileUrl, // <--- Simpan path URL, bukan filenya
        nomorSertifikat: null,
        catatan: null
      }
    });

    // Refresh halaman legalitas (sesuai struktur baru)
    revalidatePath('/dashboard/mitra/legalitas');
    return { success: "Berhasil diajukan! Menunggu verifikasi admin." };

  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Terjadi kesalahan sistem database." };
  }
}

export async function batalkanSertifikasiAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'mitra') return;

  const sertifikasiId = parseInt(formData.get("id") as string);

  // Security Check
  const sertifikasi = await prisma.sertifikasi.findUnique({ where: { id: sertifikasiId } });
  if (sertifikasi?.mitraId !== session.id) return;

  // Hapus Data
  await prisma.sertifikasi.delete({ where: { id: sertifikasiId } });

  // Refresh halaman legalitas
  revalidatePath('/dashboard/mitra/legalitas');
}