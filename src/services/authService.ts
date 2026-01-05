import { prisma } from "@/lib/prisma";

// Cari Admin berdasarkan Username
export async function findAdminByUsername(username: string) {
  return await prisma.admin.findUnique({
    where: { username },
  });
}

// Cari Mitra berdasarkan Email
export async function findMitraByEmail(email: string) {
  return await prisma.mitra.findUnique({
    where: { email },
  });
}