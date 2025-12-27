import { prisma } from "@/lib/prisma";
import { verifyMitraAction, unverifyMitraAction } from "@/actions/adminAction";
import { CheckCircle, Search } from "lucide-react";
import DeleteMitraButton from "@/components/admin/DeleteMitraButton"; // Pastikan path import benar
import SearchInput from "@/components/admin/SearchInput";

// 1. Definisikan Tipe Props (Next.js 15 mengharuskan Promise)
interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function KelolaMitraPage(props: PageProps) {
  // 2. AWAIT searchParams sebelum digunakan
  const searchParams = await props.searchParams;
  
  // 3. Ambil query dengan aman (casting ke string)
  const query = typeof searchParams.query === 'string' ? searchParams.query : "";

  // Query Database dengan Filter
  const mitraList = await prisma.mitra.findMany({
    where: {
      OR: [
        { namaUsaha: { contains: query } },
        { email: { contains: query } }
      ]
    },
    orderBy: { createdAt: 'desc' },
    include: {
        _count: { select: { produk: true } }
    }
  });

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-end">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Kelola Mitra UMKM</h2>
            <p className="text-slate-500 text-sm">Verifikasi pendaftaran mitra baru agar muncul di peta.</p>
        </div>
        
        {/* Search Input Component */}
        <div className="bg-white rounded-lg shadow-sm">
            <SearchInput />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                    <th className="px-6 py-4">Nama Usaha / Email</th>
                    <th className="px-6 py-4">Kontak (WA)</th>
                    <th className="px-6 py-4">Produk</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {mitraList.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                            <div className="font-bold text-slate-900">{m.namaUsaha}</div>
                            <div className="text-xs text-slate-500">{m.email}</div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-mono">{m.noHp}</td>
                        <td className="px-6 py-4">
                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">
                                {m._count.produk} Item
                            </span>
                        </td>
                        <td className="px-6 py-4">
                            {m.statusVerifikasi ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                    <CheckCircle size={12} /> Verified
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 animate-pulse">
                                    Pending Review
                                </span>
                            )}
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex justify-center gap-2">
                                {m.statusVerifikasi ? (
                                    <form action={unverifyMitraAction}>
                                        <input type="hidden" name="id" value={m.id} />
                                        <button type="submit" className="bg-slate-100 hover:bg-yellow-100 text-slate-600 hover:text-yellow-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 transition-all" title="Batalkan Verifikasi">
                                            Suspend
                                        </button>
                                    </form>
                                ) : (
                                    <form action={verifyMitraAction}>
                                        <input type="hidden" name="id" value={m.id} />
                                        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1">
                                            <CheckCircle size={14}/> Setujui
                                        </button>
                                    </form>
                                )}

                                <DeleteMitraButton id={m.id} />
                            </div>
                        </td>
                    </tr>
                ))}
                
                {mitraList.length === 0 && (
                    <tr>
                        <td colSpan={5} className="p-12 text-center text-slate-400 italic bg-slate-50/50">
                            {query ? `Tidak ditemukan mitra dengan kata kunci "${query}"` : "Belum ada mitra yang mendaftar."}
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
}