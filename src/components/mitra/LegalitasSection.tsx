'use client'

import { ajukanSertifikasiAction, batalkanSertifikasiAction } from "@/actions/mitraAction";
import { useState, useRef } from "react";

// Definisikan tipe data sesuai Prisma
type Sertifikasi = {
  id: number;
  jenis: string;
  status: string;
  nomorSertifikat: string | null;
  catatan: string | null;
  dokumenMitra: string | null; // Dokumen upload mitra
  sertifikatResmi: string | null; // Dokumen PDF balasan admin
};

export default function LegalitasSection({ dataSertifikasi }: { dataSertifikasi: Sertifikasi[] }) {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Helper warna badge status
  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-700 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  // Submit Handler
  async function handleAjukan(formData: FormData) {
    setLoading(true);
    setAlert(null);

    try {
      const res: any = await ajukanSertifikasiAction(formData);
      if (res?.error) {
        setAlert({ type: 'error', message: res.error });
      } else if (res?.success) {
        setAlert({ type: 'success', message: res.success });
        formRef.current?.reset();
      }
    } catch (error) {
      setAlert({ type: 'error', message: "Terjadi kesalahan sistem." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          🎖️ Legalitas & Sertifikasi
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Kelola sertifikat Halal, BPOM, atau PIRT usaha Anda.
        </p>
      </div>

      {/* --- LIST SERTIFIKASI --- */}
      <div className="space-y-4 mb-8">
        {dataSertifikasi.length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed text-gray-400 text-sm">
            Belum ada pengajuan sertifikasi.
          </div>
        )}

        {dataSertifikasi.map((item) => (
          <div key={item.id} className={`p-4 rounded-lg border flex flex-col md:flex-row justify-between gap-4 ${getBadgeColor(item.status)}`}>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-800">{item.jenis}</span>
                <span className="text-[10px] px-2 py-0.5 bg-white/60 rounded uppercase font-bold tracking-wider">
                  {item.status}
                </span>
              </div>
              
              {/* Detail Status */}
              <div className="text-sm">
                {item.status === 'APPROVED' ? (
                  <>
                    <div className="mb-2">
                      <span className="font-semibold">No. Reg:</span> 
                      <code className="bg-white/50 px-2 py-0.5 rounded ml-1 font-mono text-green-900 font-bold">
                        {item.nomorSertifikat}
                      </code>
                    </div>
                    {/* TOMBOL DOWNLOAD PDF */}
                    {item.sertifikatResmi && (
                      <a href={item.sertifikatResmi} target="_blank" download className="inline-flex items-center gap-2 bg-green-700 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-green-800 transition-colors shadow-sm">
                        📥 Download E-Sertifikat
                      </a>
                    )}
                  </>
                ) : item.status === 'REJECTED' ? (
                  <p className="italic text-red-800">"Catatan Admin: {item.catatan}"</p>
                ) : (
                  <p className="text-yellow-800 text-xs">Menunggu verifikasi admin...</p>
                )}

                {/* Link File Uploadan Mitra */}
                {item.dokumenMitra && (
                  <div className="mt-2">
                    <a href={item.dokumenMitra} target="_blank" className="text-xs underline text-slate-500 hover:text-blue-600">
                      📄 Lihat Dokumen Anda
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Tombol Hapus/Batal */}
            {item.status !== 'APPROVED' && (
              <form action={batalkanSertifikasiAction} className="md:self-center">
                <input type="hidden" name="id" value={item.id} />
                <button type="submit" className="text-xs text-red-600 underline hover:text-red-800 transition-colors">
                  {item.status === 'REJECTED' ? "Hapus & Ajukan Ulang" : "Batalkan"}
                </button>
              </form>
            )}
          </div>
        ))}
      </div>

      <hr className="my-6 border-gray-100"/>

      {/* --- FORM PENGAJUAN BARU --- */}
      <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wide">
          + Ajukan Baru
        </h3>

        {alert && (
          <div className={`mb-4 p-3 text-sm rounded border ${alert.type === 'success' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
            {alert.message}
          </div>
        )}
        
        <form ref={formRef} action={handleAjukan} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Jenis Izin</label>
            <select name="jenis" className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-green-500 outline-none bg-white">
              <option value="HALAL">Sertifikat Halal</option>
              <option value="BPOM">Izin BPOM</option>
              <option value="PIRT">PIRT (Dinkes)</option>
            </select>
          </div>

          <div className="md:col-span-6">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Upload Bukti (PDF/JPG Max 2MB)</label>
            <input 
              type="file" 
              name="dokumen" 
              accept=".pdf,.jpg,.jpeg,.png"
              required
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200 cursor-pointer border border-gray-300 rounded-lg bg-white"
            />
          </div>

          <div className="md:col-span-2">
            <button type="submit" disabled={loading} className="w-full bg-green-600 text-white p-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50">
              {loading ? "..." : "Kirim"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}