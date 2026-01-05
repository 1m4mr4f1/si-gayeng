import MitraSidebar from "@/components/mitra/MitraSidebar"; // <-- Pakai yang benar
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function MitraLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  
  // Proteksi: Hanya Mitra
  if (!session || session.role !== 'mitra') {
    redirect('/dashboard/admin'); // Lempar ke admin jika salah kamar
  }

  return (
    <div className="min-h-screen bg-green-50 flex flex-row">
      <MitraSidebar /> {/* <-- Sekarang pakai Mitra Sidebar */}
      <main className="flex-1 md:ml-64 p-8">
        {children}
      </main>
    </div>
  );
}