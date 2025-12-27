import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MapPin, Package, Star } from "lucide-react";

export default async function DashboardMitraPage() {
  const session = await getSession();
  
  // Ambil data detail Mitra dari Database berdasarkan ID Session
  // (Include produk untuk dihitung jumlahnya)
  const mitra = await prisma.mitra.findUnique({
    where: { id: session?.id as number },
    include: {
        _count: {
            select: { produk: true }
        }
    }
  });

  if (!mitra) return <div>Data tidak ditemukan</div>;

  return (
    <div className="space-y-8">
      
      {/* Header Sapaan */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Halo, {mitra.namaUsaha}! 👋</h2>
        <p className="text-slate-500">Selamat datang kembali di panel pengelolaan UMKM Anda.</p>
      </div>

      {/* Kartu Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Kartu 1: Status */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Status Verifikasi</p>
                {mitra.statusVerifikasi ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Terverifikasi ✅
                    </span>
                ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Menunggu Review ⏳
                    </span>
                )}
            </div>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Star size={24} />
            </div>
        </div>

        {/* Kartu 2: Jumlah Produk */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Total Produk</p>
                <h3 className="text-2xl font-bold text-slate-900">{mitra._count.produk} <span className="text-sm font-normal text-slate-400">item</span></h3>
            </div>
            <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                <Package size={24} />
            </div>
        </div>

        {/* Kartu 3: Lokasi */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Koordinat Peta</p>
                <div className="text-sm font-mono text-slate-700 mt-1">
                    {mitra.latitude ? `${mitra.latitude.toFixed(4)}, ${mitra.longitude?.toFixed(4)}` : 'Belum diatur'}
                </div>
            </div>
            <div className="p-2 bg-green-50 rounded-lg text-green-600">
                <MapPin size={24} />
            </div>
        </div>

      </div>

      {/* Info Tambahan */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
        <h3 className="font-bold text-blue-800 mb-2">💡 Tips Hari Ini</h3>
        <p className="text-blue-700 text-sm">
            Pastikan titik lokasi peta Anda sudah akurat agar pelanggan mudah menemukan toko Anda. 
            Anda bisa mengubahnya di menu <strong>Profil & Lokasi</strong>.
        </p>
      </div>

    </div>
  );
}