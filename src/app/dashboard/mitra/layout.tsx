import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function MitraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Cek Login
  const session = await getSession();
  
  // ✅ PERBAIKAN: Cek apakah user sudah login
  if (!session) {
    console.log('[Mitra Layout] No session, redirect to LoginMitra');
    redirect('/LoginMitra');
  }
  
  // ✅ PERBAIKAN: Cek apakah role adalah MITRA (bukan admin!)
  if (session.role !== 'mitra') {
    console.log(`[Mitra Layout] Wrong role: ${session.role}, redirect to admin dashboard`);
    redirect('/dashboard/admin');
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-row">
      {/* Sidebar - Mungkin perlu ganti ke MitraSidebar kalau ada */}
      <AdminSidebar />

      {/* Konten Utama */}
      <main className="flex-1 md:ml-64 p-8">
        {children}
      </main>
    </div>
  );
}