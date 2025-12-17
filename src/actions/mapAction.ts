'use server'

import { prisma } from "@/lib/prima";

export async function getMapData() {
  try {
    const dataMitra = await prisma.mitra.findMany({
      where: {
        statusVerifikasi: true, // Hanya yang sudah diverifikasi
        latitude: { not: null },
        longitude: { not: null }
      },
      select: {
        id: true,
        namaUsaha: true,  // Bahasa Indonesia
        kategori: true,
        latitude: true,
        longitude: true,
        deskripsi: true,  // Bahasa Indonesia
      }
    });
    return dataMitra;
  } catch (error) {
    console.error("Gagal ambil data peta:", error);
    return [];
  }
}