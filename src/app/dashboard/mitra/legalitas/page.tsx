import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import LegalitasSection from "@/components/mitra/LegalitasSection";

export default async function LegalitasPage() {
  // 1. Cek Sesi
  const session = await getSession();
  if (!session || session.role !== 'mitra') {
    redirect('/LoginMitra');
  }

  // 2. Ambil Data Mitra KHUSUS untuk sertifikasi
  // Kita include sertifikasi di sini
  const mitra = await prisma.mitra.findUnique({
    where: { id: session.id as number },
    include: {
      sertifikasi: true 
    }
  });

  if (!mitra) redirect('/');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Legalitas & Izin Usaha</h2>
        <p className="text-slate-500 text-sm">
          Upload dan kelola dokumen sertifikasi (Halal, BPOM, PIRT) untuk ditampilkan di produk.
        </p>
      </div>

      {/* Tampilkan Komponen Legalitas */}
      {/* Kita bungkus dengan div agar margin-top di dalam komponen (mt-8) tidak terlalu jauh */}
      <div className="-mt-8"> 
        <LegalitasSection dataSertifikasi={mitra.sertifikasi} />
      </div>
    </div>
  );
}