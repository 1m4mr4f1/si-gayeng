import { prisma } from "@/lib/prisma";
import { umkmData } from "@/data/dummyUmkm"; 
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // --- 1. SEED ADMIN ---
    const hashedAdminPass = await bcrypt.hash("admin123", 10);
    
    await prisma.admin.upsert({
      where: { username: "adminsemarang" },
      // PERBAIKAN: Paksa update password jika admin sudah ada
      update: {
        password: hashedAdminPass, 
      }, 
      create: {
        username: "adminsemarang",
        password: hashedAdminPass,
        nama: "Admin Pemkot",
      },
    });

    // --- 2. SEED MITRA (LOOPING DATA DUMMY) ---
    const hashedMitraPass = await bcrypt.hash("123456", 10); 
    
    let count = 0;
    
    for (const data of umkmData) {
      const emailDummy = `mitra${data.id}@sigayeng.com`;
      
      await prisma.mitra.upsert({
        where: { email: emailDummy },
        // PERBAIKAN: Paksa update password & lokasi jika mitra sudah ada
        update: {
            password: hashedMitraPass, // Reset password jadi 123456
            latitude: data.lat,
            longitude: data.lng,
            kategori: data.kategori,
            namaUsaha: data.nama,
            deskripsi: data.deskripsi
        },
        create: {
            email: emailDummy,
            password: hashedMitraPass,
            namaUsaha: data.nama,
            deskripsi: data.deskripsi,
            kategori: data.kategori,
            latitude: data.lat,
            longitude: data.lng,
            statusVerifikasi: true, 
            statusBuka: true,
            noHp: "08123456789",
            alamat: "Semarang, Jawa Tengah"
        }
      });
      count++;
    }

    return NextResponse.json({ 
      message: `SEEDING SUKSES! Password Admin di-reset jadi 'admin123' & ${count} Mitra di-reset jadi '123456'.`,
      info: "Silakan login sekarang!" 
    });

  } catch (error) {
    console.error("Error seeding:", error);
    return NextResponse.json({ error: "Gagal seeding: " + error }, { status: 500 });
  }
}