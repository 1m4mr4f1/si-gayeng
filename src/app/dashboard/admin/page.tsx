import { logoutAction } from "@/actions/authAction";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users, Map, Store, FileText, ArrowRight, LogOut } from "lucide-react";
import MapWrapper from "@/components/admin/MapWrapper"; 

export default async function AdminDashboard() {
  // 1. AMBIL DATA DATABASE
  const totalMitra = await prisma.mitra.count();
  const mitraPending = await prisma.mitra.count({ where: { statusVerifikasi: false } });
  const sertifikasiPending = await prisma.sertifikasi.count({ where: { status: "PENDING" } });

  // Data Peta
  const mapData = await prisma.mitra.findMany({
    select: {
      id: true,
      namaUsaha: true,
      latitude: true,
      longitude: true,
      kategori: true,
      alamat: true
    },
    where: {
        latitude: { not: null },
        longitude: { not: null }
    }
  });

  return (
    <div className="space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Dashboard Walikota</h1>
            <p className="text-slate-500 mt-1">Sistem Informasi Gerakan Aktivitas Ekonomi & Niaga Gumregah</p>
        </div>
        <form action={logoutAction}>
            <button className="flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
                <LogOut size={18} /> Logout
            </button>
        </form>
      </div>

      {/* STATISTIK CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Card 1: Total Mitra */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500">Total UMKM</p>
                    <h3 className="text-3xl font-bold text-slate-800 mt-1">{totalMitra}</h3>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                    <Store size={24} />
                </div>
            </div>
        </div>

        {/* Card 2: Menunggu Verifikasi */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500">Verifikasi Akun</p>
                    <h3 className="text-3xl font-bold text-orange-600 mt-1">{mitraPending}</h3>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg text-orange-600">
                    <Users size={24} />
                </div>
            </div>
        </div>

        {/* Card 3: Sertifikasi Pending */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500">Validasi Sertifikasi</p>
                    <h3 className="text-3xl font-bold text-purple-600 mt-1">{sertifikasiPending}</h3>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg text-purple-600">
                    <FileText size={24} />
                </div>
            </div>
        </div>

        {/* Card 4: Peta Terpantau */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500">Titik Peta</p>
                    <h3 className="text-3xl font-bold text-green-600 mt-1">{mapData.length}</h3>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-green-600">
                    <Map size={24} />
                </div>
            </div>
        </div>
      </div>

      {/* --- MENU NAVIGATION (DIPINDAH KE ATAS) --- */}
      <div>
        <h3 className="text-lg font-bold text-slate-700 mb-4">Akses Cepat</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/dashboard/admin/mitra" className="group bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-4 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Users size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-base">Kelola Mitra</h4>
                        <p className="text-xs text-slate-500">Validasi pendaftaran.</p>
                    </div>
                </div>
            </Link>

            <Link href="/dashboard/admin/sertifikasi" className="group bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-purple-500 hover:shadow-md transition-all flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-purple-100 p-4 rounded-full text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-base">Validasi Sertifikasi</h4>
                        <p className="text-xs text-slate-500">Cek Halal & BPOM.</p>
                    </div>
                </div>
            </Link>

            <Link href="/" target="_blank" className="group bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-green-500 hover:shadow-md transition-all flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-4 rounded-full text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                        <Store size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-base">Halaman Publik</h4>
                        <p className="text-xs text-slate-500">Lihat tampilan warga.</p>
                    </div>
                </div>
                <ArrowRight className="text-slate-300 group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
            </Link>
        </div>
      </div>

      {/* --- BAGIAN PETA GIS (SEKARANG DI BAWAH) --- */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    📍 Peta Sebaran UMKM
                </h2>
                <p className="text-sm text-slate-500">Visualisasi zonasi ekonomi berdasarkan kategori usaha (Merah: Kuliner, Biru: Jasa, Kuning: Fashion).</p>
            </div>
            
            <Link href="/dashboard/admin/mitra" className="text-sm font-bold text-blue-600 hover:underline">
                Lihat Data Lengkap &rarr;
            </Link>
        </div>
        
        {/* Panggil Wrapper Peta */}
        <MapWrapper dataMitra={mapData} />
      </div>

    </div>
  );
}