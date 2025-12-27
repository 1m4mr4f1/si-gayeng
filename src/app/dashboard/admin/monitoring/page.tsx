import { prisma } from "@/lib/prisma";
import DensityMap from "@/components/admin/DensityMap";
import { TrendingUp, Map, AlertTriangle } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function MonitoringPage() {
  const mitraList = await prisma.mitra.findMany({
    where: {
        statusVerifikasi: true,
        latitude: { not: null },
        longitude: { not: null }
    },
    select: {
        id: true,
        namaUsaha: true,
        kategori: true,
        latitude: true,
        longitude: true,
        alamat: true
    }
  });

  // Hitung Statistik
  const total = mitraList.length;
  const kuliner = mitraList.filter(m => m.kategori === 'Kuliner').length;
  const fashion = mitraList.filter(m => m.kategori === 'Fashion').length;
  
  // Logika Dominasi (Bahasa Indonesia)
  let dominasi = "Seimbang";
  if (kuliner > (total * 0.6)) dominasi = "Zona Kuliner (Sangat Padat)";
  if (fashion > (total * 0.6)) dominasi = "Sentra Fashion";

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-bold text-slate-900">Pemantauan Wilayah (Tampilan Eksekutif)</h1>
        <p className="text-slate-500">Analisis sebaran ekonomi dan kepadatan UMKM Kota Semarang secara Real-time.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Total Data */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-slate-400 text-sm font-medium">Total UMKM Terpetakan</p>
                    <h3 className="text-4xl font-bold mt-2">{total} <span className="text-lg font-normal text-slate-400">unit</span></h3>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                    <Map className="text-white" size={24} />
                </div>
            </div>
            <div className="mt-4 text-xs text-slate-400">
                Data GPS Tervalidasi
            </div>
        </div>

        {/* Card 2: Dominasi */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-slate-500 text-sm font-medium">Dominasi Ekonomi</p>
                    <h3 className="text-2xl font-bold mt-2 text-slate-800">{dominasi}</h3>
                </div>
                <div className="bg-green-100 p-3 rounded-lg text-green-600">
                    <TrendingUp size={24} />
                </div>
            </div>
            <div className="mt-4 flex gap-3 text-xs">
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded font-bold">Kuliner: {kuliner}</span>
                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-bold">Fashion: {fashion}</span>
            </div>
        </div>

        {/* Card 3: Rekomendasi */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-slate-500 text-sm font-medium">Rekomendasi Tindakan</p>
                    <h3 className="text-xl font-bold mt-2 text-slate-800">
                        {total < 50 ? "Perluas Sosialisasi Digital" : "Fokus Pemerataan Bantuan"}
                    </h3>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg text-orange-600">
                    <AlertTriangle size={24} />
                </div>
            </div>
            <div className="mt-4 text-xs text-slate-500">
                Wawasan AI berbasis volume data
            </div>
        </div>

      </div>

      {/* DENSITY MAP */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4">Peta Zona Ekonomi (Simulasi Heatmap)</h3>
        <DensityMap data={mitraList} />
        <div className="mt-4 p-4 bg-slate-50 rounded-lg text-sm text-slate-600">
            <strong>Cara Membaca:</strong> Area dengan warna <strong>gelap/menumpuk</strong> menandakan "Zona Merah" (Aktivitas Ekonomi Tinggi). 
            Area dengan lingkaran <strong>pudar/terpisah</strong> menandakan "Zona Hijau" (Potensi pengembangan/Butuh Stimulus).
        </div>
      </div>

    </div>
  );
}