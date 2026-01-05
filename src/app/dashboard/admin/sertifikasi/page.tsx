import { prisma } from "@/lib/prisma";
import { updateStatusSertifikasi } from "@/actions/sertifikasiAction";

export default async function PageSertifikasiAdmin() {
  // Ambil semua data sertifikasi + Data Mitra pemiliknya
  const listPengajuan = await prisma.sertifikasi.findMany({
    include: { 
      mitra: true // Relasi ke tabel Mitra
    },
    orderBy: { 
      updatedAt: 'desc' // Yang baru diupdate/diajukan paling atas
    }
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">Validasi Sertifikasi</h1>
           <p className="text-sm text-gray-500">Kelola pengajuan Halal & BPOM dari Mitra UMKM</p>
        </div>
        <button className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
           🖨️ Cetak Laporan Rekap
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b text-gray-600 text-xs uppercase tracking-wider">
            <tr>
              <th className="p-4">Tanggal</th>
              <th className="p-4">Mitra UMKM</th>
              <th className="p-4">Jenis Pengajuan</th>
              <th className="p-4">Dokumen Mitra</th>
              <th className="p-4">Status Saat Ini</th>
              <th className="p-4 w-1/4">Aksi Validasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {listPengajuan.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Belum ada pengajuan masuk.</td></tr>
            )}
            
            {listPengajuan.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition">
                <td className="p-4 text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString("id-ID")}
                </td>
                <td className="p-4">
                    <div className="font-bold text-gray-900">{item.mitra.namaUsaha}</div>
                    <div className="text-xs text-gray-500">{item.mitra.email}</div>
                </td>
                <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold border ${item.jenis === 'HALAL' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                        {item.jenis}
                    </span>
                </td>
                <td className="p-4">
                    {/* Link Pura-pura ke file */}
                    <a href="#" className="flex items-center gap-2 text-blue-600 hover:underline font-medium">
                       📄 {item.dokumenMitra?.substring(0, 15)}...
                    </a>
                </td>
                <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold 
                        ${item.status === 'SELESAI' ? 'bg-green-100 text-green-700' : 
                          item.status === 'DITOLAK' ? 'bg-red-100 text-red-700' : 
                          item.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100'}`}>
                        {item.status}
                    </span>
                </td>
                <td className="p-4">
                    {item.status === 'SELESAI' ? (
                        <div className="text-xs text-green-700 flex flex-col gap-1">
                            <span>✅ Selesai divalidasi</span>
                            <span className="text-gray-400">Cert: {item.sertifikatResmi}</span>
                        </div>
                    ) : (
                        <form action={updateStatusSertifikasi} className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex flex-col gap-2">
                            <input type="hidden" name="id" value={item.id} />
                            
                            <select name="status" className="w-full text-xs p-1.5 border rounded bg-white" defaultValue={item.status}>
                                <option value="PENDING">Pending</option>
                                <option value="PROSES">Sedang Proses</option>
                                <option value="SELESAI">✅ SETUJUI (Terbitkan Sertifikat)</option>
                                <option value="DITOLAK">❌ TOLAK</option>
                            </select>

                            <input 
                                type="text" 
                                name="catatan" 
                                placeholder="Tulis No. Sertifikat / Alasan tolak..." 
                                className="w-full text-xs p-1.5 border rounded"
                                defaultValue={item.catatan || ""}
                            />
                            
                            <button type="submit" className="w-full bg-gray-900 hover:bg-black text-white text-xs py-1.5 rounded font-medium transition">
                                Simpan Keputusan
                            </button>
                        </form>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}