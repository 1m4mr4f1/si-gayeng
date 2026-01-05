import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { ajukanSertifikasi } from "@/actions/sertifikasiAction";

export default async function PageSertifikasiMitra() {
  const session = await getSession();
  if (!session) return <div className="p-6">Akses Ditolak: Silakan Login.</div>;

  // Ambil data sertifikasi milik user yang sedang login
  const dataSertifikasi = await prisma.sertifikasi.findMany({
    where: { mitraId: Number(session.id) }
  });

  // Pisahkan data berdasarkan jenisnya
  const halal = dataSertifikasi.find((s) => s.jenis === "HALAL");
  const bpom = dataSertifikasi.find((s) => s.jenis === "BPOM");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Sertifikasi Usaha</h1>
      <p className="text-gray-600 mb-8">Kelola legalitas usaha Anda (Halal & BPOM) agar lebih terpercaya.</p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* --- KARTU 1: HALAL --- */}
        <CardSertifikasi 
          judul="Sertifikasi Halal" 
          data={halal} 
          jenis="HALAL" 
          mitraId={session.id} 
        />

        {/* --- KARTU 2: BPOM --- */}
        <CardSertifikasi 
          judul="Izin Edar BPOM" 
          data={bpom} 
          jenis="BPOM" 
          mitraId={session.id} 
        />
      </div>
    </div>
  );
}

// --- KOMPONEN KARTU (LOGIKA TAMPILAN) ---
function CardSertifikasi({ judul, data, jenis, mitraId }: any) {
  
  // 1. JIKA SUDAH SELESAI (PUNYA SERTIFIKAT)
  if (data?.status === "SELESAI") {
    return (
      <div className="border border-green-500 bg-green-50 p-6 rounded-xl shadow-sm text-center">
        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">✅</span>
        </div>
        <h3 className="text-xl font-bold text-green-800 mb-2">Terverifikasi {judul}</h3>
        <p className="text-sm text-gray-600 mb-6">Usaha Anda telah memenuhi standar dan memiliki sertifikat resmi.</p>
        
        {/* Visualisasi Sertifikat */}
        <div className="bg-white border-4 border-double border-gray-300 p-6 mx-auto mb-4 shadow-sm max-w-xs">
            <p className="font-serif text-xl text-center font-bold text-gray-800 tracking-wider mb-2">SERTIFIKAT</p>
            <p className="text-center text-xs text-gray-500 uppercase font-bold">{jenis} INDONESIA</p>
            <div className="border-b-2 border-gray-200 my-2"></div>
            <p className="text-center text-[10px] text-gray-400">No. Dokumen: {data.sertifikatResmi}</p>
        </div>
        
        <button className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-full text-sm font-medium transition">
           Download PDF
        </button>
      </div>
    );
  }

  // 2. JIKA SEDANG DIPROSES / DITOLAK
  if (data) {
    const isDitolak = data.status === "DITOLAK";
    return (
      <div className={`border p-6 rounded-xl shadow-sm ${isDitolak ? 'bg-red-50 border-red-300' : 'bg-yellow-50 border-yellow-300'}`}>
        <h3 className={`text-lg font-bold mb-2 ${isDitolak ? 'text-red-800' : 'text-yellow-800'}`}>
           {isDitolak ? '❌ Pengajuan Ditolak' : '⏳ Sedang Diproses'}
        </h3>
        
        <div className="flex items-center justify-between bg-white/50 p-3 rounded mb-4">
           <span className="text-xs text-gray-500 uppercase font-bold">Status</span>
           <span className={`px-2 py-1 rounded text-xs font-bold ${isDitolak ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}`}>
             {data.status}
           </span>
        </div>

        <p className="text-sm text-gray-600 mb-2">
           {isDitolak ? 'Silakan perbaiki dokumen sesuai catatan admin.' : 'Mohon tunggu validasi dari Dinas terkait.'}
        </p>

        {/* Tampilkan Catatan Admin jika ada */}
        {data.catatan && (
            <div className="mt-4 bg-white p-4 rounded border border-gray-200 text-sm">
                <p className="font-bold text-xs text-gray-500 mb-1">PESAN DARI ADMIN:</p>
                <p className="text-gray-800 italic">"{data.catatan}"</p>
            </div>
        )}

        {/* Jika ditolak, boleh ajukan lagi (Opsional, tombol reset logika bisa ditambahkan nanti) */}
      </div>
    );
  }

  // 3. JIKA BELUM PERNAH MENGAJUKAN (FORMULIR)
  return (
    <div className="border border-gray-200 p-6 rounded-xl shadow-sm bg-white hover:shadow-md transition">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800">{judul}</h3>
        <p className="text-sm text-gray-500">Upload dokumen persyaratan untuk mengajukan sertifikasi.</p>
      </div>
      
      <form action={ajukanSertifikasi} className="space-y-4">
        <input type="hidden" name="mitraId" value={mitraId} />
        <input type="hidden" name="jenis" value={jenis} />
        
        <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Upload Dokumen (KTP/NIB/Foto)</label>
            <input type="file" required className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            <p className="text-[10px] text-gray-400 mt-2">*Format: JPG/PDF, Maks 2MB</p>
        </div>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg shadow-blue-200 shadow-lg transition">
            Ajukan Sekarang
        </button>
      </form>
    </div>
  );
}