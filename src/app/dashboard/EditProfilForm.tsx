'use client'

import { useState, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { updateProfilAction } from '@/actions/mitraAction';
import { Save, MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // Import L untuk akses L.icon

// Import Peta Client-Side Only
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });

// --- PERBAIKAN: DEFINISI ICON MANUAL ---
// Kita ambil gambar marker langsung dari CDN agar pasti muncul
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Helper Component untuk Handle Drag
function DraggableMarker({ pos, setPos }: { pos: [number, number], setPos: (p: [number, number]) => void }) {
  const markerRef = useRef<any>(null);
  const eventHandlers = useMemo(() => ({
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        const { lat, lng } = marker.getLatLng();
        setPos([lat, lng]);
      }
    },
  }), [setPos]);

  // Tambahkan prop icon={markerIcon} di sini
  return <Marker draggable={true} eventHandlers={eventHandlers} position={pos} ref={markerRef} icon={markerIcon} />;
}

export default function EditProfilForm({ mitra }: { mitra: any }) {
  // Default ke Semarang jika null
  const defaultPos: [number, number] = [mitra.latitude || -6.9932, mitra.longitude || 110.4203];
  
  // Pastikan position valid (tidak null/NaN) saat inisialisasi state
  const [position, setPosition] = useState<[number, number]>(() => {
     if (mitra.latitude && mitra.longitude) {
         return [parseFloat(mitra.latitude), parseFloat(mitra.longitude)];
     }
     return [-6.9932, 110.4203];
  });

  const inputClass = "w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white text-slate-900 placeholder:text-slate-400";

  return (
    <form action={updateProfilAction} className="space-y-8 pb-10">
      
      {/* 1. BAGIAN TEXT INPUT */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <div className="md:col-span-2">
            <h3 className="font-bold text-lg mb-4 text-slate-700">Informasi Toko</h3>
        </div>

        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Nama Usaha</label>
            <input type="text" name="namaUsaha" defaultValue={mitra.namaUsaha} required className={inputClass} />
        </div>

        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Kategori</label>
            <select name="kategori" defaultValue={mitra.kategori || "Kuliner"} className={inputClass}>
                <option value="Kuliner">Kuliner</option>
                <option value="Fashion">Fashion</option>
                <option value="Kriya">Kriya</option>
                <option value="Jasa">Jasa</option>
                <option value="Elektronik">Elektronik</option>
            </select>
        </div>

        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Nomor WhatsApp / HP</label>
            <input type="text" name="noHp" defaultValue={mitra.noHp || ""} className={inputClass} />
        </div>

        <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-600">Alamat Lengkap</label>
            <textarea name="alamat" rows={2} defaultValue={mitra.alamat || ""} className={inputClass}></textarea>
        </div>

        <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-600">Deskripsi Singkat</label>
            <textarea name="deskripsi" rows={3} defaultValue={mitra.deskripsi || ""} className={inputClass}></textarea>
        </div>
      </div>

      {/* 2. BAGIAN PETA (LOCATION PICKER) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative z-0">
        <h3 className="font-bold text-lg mb-2 text-slate-700 flex items-center gap-2">
            <MapPin size={20} className="text-green-600"/> Lokasi Peta
        </h3>
        <p className="text-sm text-slate-500 mb-4">Geser Pin biru ke lokasi toko Anda yang sebenarnya.</p>
        
        <input type="hidden" name="latitude" value={position[0]} />
        <input type="hidden" name="longitude" value={position[1]} />

        <div className="h-[400px] w-full rounded-lg overflow-hidden border-2 border-slate-200 relative isolate z-0">
            <MapContainer center={defaultPos} zoom={15} scrollWheelZoom={false} className="h-full w-full z-0">
                <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <DraggableMarker pos={position} setPos={setPosition} />
            </MapContainer>
        </div>
        <p className="text-xs text-slate-400 mt-2">Koordinat: {position[0]}, {position[1]}</p>
      </div>

      <div className="flex justify-end sticky bottom-4 z-20">
        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all ring-2 ring-white">
            <Save size={20} /> Simpan Perubahan
        </button>
      </div>

    </form>
  );
}