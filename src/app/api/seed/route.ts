import { prisma } from "@/lib/prima";
import { umkmData } from "@/data/dummyUmkm"; // Pastikan file ini ada sesuai langkah sebelumnya
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // --- 1. SEED ADMIN ---
    const hashedAdminPass = await bcrypt.hash("admin123", 10);
    
    await prisma.admin.upsert({
      where: { username: "adminsemarang" },
      update: {}, // Jika sudah ada, tidak ada yang diubah
      create: {
        username: "adminsemarang",
        password: hashedAdminPass,
        nama: "Admin Pemkot",
      },
    });

    // --- 2. SEED MITRA (LOOPING DATA DUMMY UNTUK PETA) ---
    const hashedMitraPass = await bcrypt.hash("123456", 10); // Password default semua mitra
    
    let count = 0;
    
    // Kita loop data dummy yang banyak itu agar masuk ke database
    for (const data of umkmData) {
      // Buat email unik palsu berdasarkan ID
      const emailDummy = `mitra${data.id}@sigayeng.com`;
      
      await prisma.mitra.upsert({
        where: { email: emailDummy },
        update: {
            // Jika data sudah ada, update lokasi & infonya saja
            latitude: data.lat,
            longitude: data.lng,
            kategori: data.kategori,
            namaUsaha: data.nama,
            deskripsi: data.deskripsi
        },
        create: {
            email: emailDummy,
            password: hashedMitraPass,
            
            // Mapping Data Dummy ke Schema Database (Bahasa Indonesia)
            namaUsaha: data.nama,
            deskripsi: data.deskripsi,
            kategori: data.kategori,
            
            // Koordinat Peta
            latitude: data.lat,
            longitude: data.lng,
            
            // Data Default
            statusVerifikasi: true, // Wajib TRUE agar muncul di peta
            statusBuka: true,
            noHp: "08123456789",
            alamat: "Semarang, Jawa Tengah"
        }
      });
      count++;
    }

    return NextResponse.json({ 
      message: `SEEDING SUKSES! Admin & ${count} Mitra berhasil disimpan ke database.`,
      info: "Silakan coba login Mitra dengan email: mitra1@sigayeng.com / pass: 123456" 
    });

  } catch (error) {
    console.error("Error seeding:", error);
    return NextResponse.json({ error: "Gagal seeding: " + error }, { status: 500 });
  }
}