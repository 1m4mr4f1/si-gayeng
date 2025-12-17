import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prima"; // PERBAIKAN TYPO: prima -> prisma
import { createProductAction, deleteProductAction } from "@/actions/mitraAction";
import { Plus, Trash2, PackageOpen } from "lucide-react";

export default async function ProdukPage() {
  const session = await getSession();
  
  // Ambil produk milik mitra yang login
  const produkList = await prisma.produk.findMany({
    where: { mitraId: session?.id as number },
    orderBy: { createdAt: 'desc' }
  });

  // Class CSS Standar untuk Input agar Jelas & Kontras
  const inputClass = "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-slate-900 placeholder:text-slate-400 shadow-sm";

  return (
    // Tambahkan relative z-0 agar aman dari tumpukan elemen lain
    <div className="space-y-6 relative z-0">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-200 pb-6">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Daftar Produk</h2>
            <p className="text-slate-500 text-sm">Kelola menu atau barang dagangan Anda.</p>
        </div>
      </div>

      {/* FORM TAMBAH PRODUK */}
      <div className="bg-green-50 border border-green-100 p-4 rounded-xl shadow-sm">
        <h3 className="text-sm font-bold text-green-800 mb-3 flex items-center gap-2">
            <Plus size={16}/> Tambah Produk Baru
        </h3>
        
        <form action={createProductAction} className="flex flex-col md:flex-row gap-3 items-end">
            <div className="w-full md:w-1/3">
                <input 
                    name="namaProduk" 
                    placeholder="Nama Produk (Misal: Nasi Goreng)" 
                    required 
                    className={inputClass} // Pakai class yang sudah diperbaiki
                />
            </div>
            <div className="w-full md:w-1/4">
                <input 
                    name="harga" 
                    type="number" 
                    placeholder="Harga (Rp)" 
                    required 
                    className={inputClass} 
                />
            </div>
            <div className="w-full md:w-1/3">
                <input 
                    name="deskripsi" 
                    placeholder="Deskripsi Singkat..." 
                    className={inputClass} 
                />
            </div>
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap shadow-md h-[38px]">
                + Tambah
            </button>
        </form>
      </div>

      {/* TABEL PRODUK */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative z-0">
        {produkList.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
                <PackageOpen size={48} className="mx-auto mb-3 opacity-50"/>
                <p>Belum ada produk. Silakan tambah produk di atas.</p>
            </div>
        ) : (
            <div className="overflow-x-auto"> {/* Scroll horizontal jika layar kecil */}
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 whitespace-nowrap">Nama Produk</th>
                            <th className="px-6 py-4 whitespace-nowrap">Harga</th>
                            <th className="px-6 py-4 whitespace-nowrap">Deskripsi</th>
                            <th className="px-6 py-4 text-right whitespace-nowrap">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {produkList.map((item) => (
                            <tr key={item.id} className="hover:bg-green-50/50 transition-colors">
                                <td className="px-6 py-4 font-semibold text-slate-800">{item.namaProduk}</td>
                                <td className="px-6 py-4 text-green-700 font-bold">
                                    Rp {Number(item.harga).toLocaleString('id-ID')}
                                </td>
                                <td className="px-6 py-4 text-slate-600 truncate max-w-xs">{item.deskripsi || '-'}</td>
                                <td className="px-6 py-4 text-right">
                                    <form action={deleteProductAction}>
                                        <input type="hidden" name="id" value={item.id} />
                                        <button type="submit" className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Hapus Produk">
                                            <Trash2 size={18} />
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>

    </div>
  );
}