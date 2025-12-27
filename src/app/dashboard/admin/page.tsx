import { logoutAction } from "@/actions/authAction";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users, Map, Store, AlertCircle, ArrowRight, LogOut } from "lucide-react";

export default async function AdminDashboard() {
  // 1. Ambil Statistik Real-time dari Database
  const totalMitra = await prisma.mitra.count();
  const mitraPending = await prisma.mitra.count({
    where: { statusVerifikasi: false }
  });
  const mitraVerified = await prisma.mitra.count({
    where: { statusVerifikasi: true }
  });

  return (
    <div className="space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Dashboard Walikota</h1>
            <p className="text-slate-500 mt-1">Selamat datang, Administrator. Berikut adalah ringkasan sistem Si-Gayeng.</p>
        </div>
        <form action={logoutAction}>
            <button className="flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
                <LogOut size={18} /> Logout
            </button>
        </form>
      </div>

      {/* STATISTIK CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Total Mitra */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500">Total Mitra Terdaftar</p>
                <h3 className="text-3xl font-bold text-slate-800 mt-1">{totalMitra}</h3>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                <Store size={28} />
            </div>
        </div>

        {/* Card 2: Menunggu Verifikasi (Penting!) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500">Perlu Verifikasi</p>
                <h3 className="text-3xl font-bold text-orange-600 mt-1">{mitraPending}</h3>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg text-orange-600 animate-pulse">
                <AlertCircle size={28} />
            </div>
        </div>

        {/* Card 3: Mitra Aktif */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500">Mitra Terverifikasi</p>
                <h3 className="text-3xl font-bold text-green-600 mt-1">{mitraVerified}</h3>
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-green-600">
                <Users size={28} />
            </div>
        </div>
      </div>

      {/* MENU NAVIGATION (Quick Access) */}
      <div>
        <h3 className="text-lg font-bold text-slate-700 mb-4">Menu Cepat</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* CARD KELOLA MITRA (YANG ANDA MINTA) */}
            <Link href="/dashboard/admin/mitra" className="group bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-green-500 hover:shadow-md transition-all flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-4 rounded-full text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                        <Users size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-lg">Kelola Data Mitra</h4>
                        <p className="text-sm text-slate-500">Verifikasi pendaftaran & hapus mitra.</p>
                    </div>
                </div>
                <ArrowRight className="text-slate-300 group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
            </Link>

            {/* Link ke Peta Publik */}
            <Link href="/#peta-umkm" className="group bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-4 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Map size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-lg">Lihat Peta Sebaran</h4>
                        <p className="text-sm text-slate-500">Pantau tampilan peta di halaman depan.</p>
                    </div>
                </div>
                <ArrowRight className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </Link>

        </div>
      </div>

    </div>
  );
}