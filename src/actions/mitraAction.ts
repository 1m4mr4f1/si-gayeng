'use server'

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// --- 1. UPDATE PROFIL MITRA ---
export async function updateProfilAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'mitra') return;

  const namaUsaha = formData.get("namaUsaha") as string;
  const deskripsi = formData.get("deskripsi") as string;
  const kategori = formData.get("kategori") as string;
  const noHp = formData.get("noHp") as string;
  const alamat = formData.get("alamat") as string;
  
  // Ambil koordinat (dikonversi ke Float)
  const lat = parseFloat(formData.get("latitude") as string);
  const lng = parseFloat(formData.get("longitude") as string);

  await prisma.mitra.update({
    where: { id: session.id as number },
    data: {
      namaUsaha,
      deskripsi,
      kategori,
      noHp,
      alamat,
      latitude: lat || null,
      longitude: lng || null,
      // Status verifikasi di-reset jika ganti info sensitif (opsional, di sini kita biarkan saja)
    }
  });

  revalidatePath('/dashboard/mitra/profil');
  revalidatePath('/dashboard/mitra'); 
  redirect('/dashboard/mitra/profil'); // Refresh halaman
}

// --- 2. TAMBAH PRODUK ---
export async function createProductAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'mitra') return;

  const namaProduk = formData.get("namaProduk") as string;
  const harga = formData.get("harga") as string;
  const deskripsi = formData.get("deskripsi") as string;

  await prisma.produk.create({
    data: {
      namaProduk,
      harga: parseFloat(harga),
      deskripsi,
      mitraId: session.id as number,
      fotoProduk: "https://placehold.co/400" // Dummy dulu karena belum ada upload file
    }
  });

  revalidatePath('/dashboard/mitra/produk');
}

// --- 3. HAPUS PRODUK ---
export async function deleteProductAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'mitra') return;

  const produkId = parseInt(formData.get("id") as string);

  // Pastikan produk milik mitra yang login (Security Check)
  const produk = await prisma.produk.findUnique({ where: { id: produkId } });
  if (produk?.mitraId !== session.id) return;

  await prisma.produk.delete({ where: { id: produkId } });

  revalidatePath('/dashboard/mitra/produk');
}