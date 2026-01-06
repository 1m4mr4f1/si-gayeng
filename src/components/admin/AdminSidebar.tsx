'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, LayoutDashboard, LogOut, Map, FileCheck } from "lucide-react";
import { logoutAction } from "@/actions/authAction";

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { 
      name: 'Dashboard', 
      url: '/dashboard/admin', 
      icon: LayoutDashboard,
      exact: true // Hanya aktif jika URL persis /dashboard/admin
    },
    { 
      name: 'Regional Monitoring', 
      url: '/dashboard/admin/monitoring', 
      icon: Map 
    },
    { 
      name: 'Manage MSMEs (Mitra)', 
      url: '/dashboard/admin/mitra', 
      icon: Users 
    },
    
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col fixed h-full z-20 shadow-xl">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold tracking-tighter text-white">
          ADMIN<span className="text-green-500">PANEL</span>
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          // Logika Penanda: Apakah URL browser mengandung URL menu ini?
          const isActive = item.exact 
            ? pathname === item.url 
            : pathname.startsWith(item.url);

          return (
            <Link 
              key={item.url}
              href={item.url} 
              className={`
                flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-r-lg transition-all duration-200 border-l-4
                ${isActive 
                  ? 'bg-slate-800 border-green-500 text-green-400 shadow-[inset_10px_0_20px_-10px_rgba(74,222,128,0.1)]' // AKTIF: Hijau + Background Terang
                  : 'border-transparent text-slate-400 hover:bg-slate-800 hover:text-white' // TIDAK AKTIF
                }
              `}
            >
              <item.icon size={20} className={isActive ? "text-green-500" : ""} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <form action={logoutAction}>
          <button className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-400 hover:bg-slate-800 rounded-lg transition-colors">
              <LogOut size={20} /> Logout
          </button>
        </form>
      </div>
    </aside>
  );
}