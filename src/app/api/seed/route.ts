import { prisma } from "@/lib/prima";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  // 1. Buat Admin
  const hashedAdminPass = await bcrypt.hash("admin123", 10);
  await prisma.admin.create({
    data: {
      username: "adminsemarang",
      password: hashedAdminPass,
      nama: "Admin Pemkot",
    },
  });

  // 2. Buat Mitra
  const hashedMitraPass = await bcrypt.hash("mitra123", 10);
  await prisma.mitra.create({
    data: {
      email: "warung@contoh.com",
      password: hashedMitraPass,
      namaUsaha: "Warung Makan Enak",
    },
  });

  return NextResponse.json({ message: "Data Admin & Mitra berhasil dibuat!" });
}