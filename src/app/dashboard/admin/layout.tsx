import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, LayoutDashboard, LogOut } from "lucide-react";
import { logoutAction } from "@/actions/authAction";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Cek Keamanan: Wajib Login & Role Admin
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    redirect('/LoginAdmin');
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-row">
      
      {/* SIDEBAR ADMIN */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-tighter text-white">
            ADMIN<span className="text-green-500">PANEL</span>
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard/admin" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link href="/dashboard/admin/mitra" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            <Users size={20} />
            Kelola Mitra
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <form action={logoutAction}>
            <button className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-400 hover:bg-slate-800 rounded-lg transition-colors">
                <LogOut size={20} /> Logout
            </button>
          </form>
        </div>
      </aside>

      {/* CONTENT AREA */}
      <main className="flex-1 md:ml-64 p-8">
        {children}
      </main>
    </div>
  );
}