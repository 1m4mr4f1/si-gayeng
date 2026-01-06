'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/actions/authAction"; 

export default function MitraSidebar() {
  const pathname = usePathname();

  // Helper function untuk cek link aktif
  const isActive = (path: string) => pathname === path
    ? "bg-green-50 text-green-700 font-bold border-r-4 border-green-600" 
    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900";

  // Helper untuk sub-menu (agar tetap aktif meski masuk ke detail)
  const isSubActive = (path: string) => pathname.startsWith(path)
    ? "bg-green-50 text-green-700 font-bold border-r-4 border-green-600" 
    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900";

  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full z-10 shadow-sm">
      
      {/* Header */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <span className="text-xl font-bold text-green-700">Mitra UMKM</span>
      </div>

      {/* Menu Navigasi */}
      <nav className="flex-1 py-6 space-y-1 overflow-y-auto">
        
        <Link href="/dashboard/mitra" className={`flex items-center gap-3 px-6 py-3 transition-all ${isActive('/dashboard/mitra')}`}>
          <span>🏠</span>
          <span className="text-sm">Beranda</span>
        </Link>

        <Link href="/dashboard/mitra/profil" className={`flex items-center gap-3 px-6 py-3 transition-all ${isActive('/dashboard/mitra/profil')}`}>
          <span>🏪</span>
          <span className="text-sm">Profil Toko</span>
        </Link>

       

        <Link href="/dashboard/mitra/produk" className={`flex items-center gap-3 px-6 py-3 transition-all ${isSubActive('/dashboard/mitra/produk')}`}>
          <span>📦</span>
          <span className="text-sm">Kelola Produk</span>
        </Link>

      </nav>

      {/* Footer Logout */}
      <div className="p-4 border-t border-gray-100">
        <form action={logoutAction}>
          <button type="submit" className="flex w-full items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium">
            <span>Keluar Sesi</span>
          </button>
        </form>
      </div>
    </aside>
  );
}