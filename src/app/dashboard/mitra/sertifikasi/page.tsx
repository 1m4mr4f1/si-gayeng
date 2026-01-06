import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import Link from "next/link";

export default async function PageSertifikasiMitra() {
  const session = await getSession();
  if (!session) return <div className="p-6">Silakan Login.</div>;

  const dataSertifikasi = await prisma.sertifikasi.findMany({
    where: { mitraId: Number(session.id) }
  });

  return (
    <div className="p-8">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white mb-8 shadow-xl">
        <h1 className="text-2xl font-bold mb-2">Status Sertifikasi</h1>
        <p className="opacity-70 text-sm">Anda memiliki {dataSertifikasi.length} pengajuan yang tercatat di sistem.</p>
      </div>

      <div className="grid gap-4">
        {dataSertifikasi.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-2xl">
            <p className="text-gray-400">Belum ada sertifikasi yang diajukan.</p>
            <Link href="/dashboard/mitra/legalitas" className="text-blue-600 font-bold mt-2 block">Ajukan Sekarang &rarr;</Link>
          </div>
        ) : (
          dataSertifikasi.map((s) => (
            <div key={s.id} className="bg-white border p-5 rounded-xl flex justify-between items-center shadow-sm">
              <div>
                <h3 className="font-bold text-gray-800">{s.jenis} INDONESIA</h3>
                <p className="text-xs text-gray-500 font-mono">{s.nomorSertifikat || "Nomor belum terbit"}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-[10px] font-black px-3 py-1 rounded-full ${
                  s.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {s.status}
                </span>
                <Link href="/dashboard/mitra/legalitas" className="text-xs text-blue-600 font-bold border-b border-blue-600">Detail</Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}