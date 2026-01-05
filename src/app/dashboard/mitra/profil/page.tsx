import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import EditProfilForm from "@/app/dashboard/EditProfilForm";

export default async function ProfilPage() {
  const session = await getSession();
  
  if (!session || session.role !== 'mitra') {
    redirect('/LoginMitra');
  }

  // Ambil Data Mitra saja (TIDAK PERLU include sertifikasi disini lagi)
  const mitra = await prisma.mitra.findUnique({
    where: { id: session.id as number }
  });

  if (!mitra) redirect('/');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Edit Profil & Lokasi</h2>
        <p className="text-slate-500 text-sm">
          Perbarui informasi dasar toko, alamat, dan titik lokasi peta Anda.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1">
        <EditProfilForm mitra={mitra} />
      </div>
    </div>
  );
}