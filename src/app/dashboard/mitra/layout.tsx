import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Store, User, Package, LogOut, MapPin } from "lucide-react";
import { logoutAction } from "@/actions/authAction";

export default async function MitraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Cek Keamanan: Apakah user login & role-nya mitra?
  const session = await getSession();
  if (!session || session.role !== 'mitra') {
    redirect('/LoginMitra');
  }

  // Menu Sidebar
  const menus = [
    { name: "Dashboard", href: "/dashboard/mitra", icon: Store },
    { name: "Profil & Lokasi", href: "/dashboard/mitra/profil", icon: MapPin },
    { name: "Produk Saya", href: "/dashboard/mitra/produk", icon: Package },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-row">
      
      {/* --- SIDEBAR KIRI --- */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-2xl font-bold text-green-600 tracking-tighter">
            Si-Gayeng<span className="text-slate-400 text-xs font-normal ml-1">Mitra</span>
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menus.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 rounded-lg hover:bg-green-50 hover:text-green-700 transition-colors"
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
            {/* Tombol Logout */}
            <form action={logoutAction}>
                <button type="submit" className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                    <LogOut size={20} />
                    Keluar
                </button>
            </form>
        </div>
      </aside>

      {/* --- KONTEN KANAN --- */}
      <main className="flex-1 md:ml-64 p-6 md:p-10">
        {/* Header Mobile (Opsional, agar tidak kosong di HP) */}
        <div className="md:hidden mb-6 flex justify-between items-center">
            <h1 className="font-bold text-green-600">Si-Gayeng Mitra</h1>
            <span className="text-xs bg-slate-200 px-2 py-1 rounded">Menu ada di Desktop</span>
        </div>

        {/* Render Halaman Disini */}
        {children}
      </main>

    </div>
  );
}