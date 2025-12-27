'use client'

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Import komponen Leaflet secara dinamis
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const CircleMarker = dynamic(() => import('react-leaflet').then(m => m.CircleMarker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false });

interface MitraData {
  id: number;
  namaUsaha: string;
  kategori: string;
  latitude: number | null;
  longitude: number | null;
}

export default function DensityMap({ data }: { data: MitraData[] }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="h-[500px] w-full bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-slate-400">Loading Density Map...</div>;

  const getColor = (kategori: string) => {
    switch (kategori) {
      case 'Kuliner': return '#ef4444';
      case 'Fashion': return '#eab308';
      case 'Jasa': return '#3b82f6';
      default: return '#10b981';
    }
  };

  return (
    <div className="relative group">
      {/* Container Peta */}
      <div className="h-[600px] w-full rounded-xl overflow-hidden border-2 border-slate-200 z-0 relative isolate">
        <MapContainer 
          center={[-6.9932, 110.4203]} 
          zoom={12} 
          scrollWheelZoom={true} 
          className="h-full w-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          {data.map((mitra) => {
            if (!mitra.latitude || !mitra.longitude) return null;
            
            return (
              <CircleMarker
                key={mitra.id}
                center={[mitra.latitude, mitra.longitude]}
                radius={20}
                pathOptions={{
                  fillColor: getColor(mitra.kategori),
                  fillOpacity: 0.3, 
                  color: 'transparent',
                }}
              >
                <Popup>
                  <div className="text-center">
                    <strong className="block text-sm">{mitra.namaUsaha}</strong>
                    <span className="text-xs text-slate-500">{mitra.kategori}</span>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      {/* LEGENDA / KETERANGAN */}
      {/* Perbaikan: z-index 1000, background solid putih, shadow lebih kuat */}
      <div className="absolute top-4 right-4 z-[1000] bg-white p-4 rounded-lg shadow-xl border border-slate-300 text-xs min-w-[200px]">
        <h4 className="font-bold mb-3 text-slate-900 border-b border-slate-200 pb-2">Analisis Kepadatan</h4>
        
        <div className="space-y-3">
            {/* Kategori Warna */}
            <div className="flex items-center gap-2">
                {/* Tambah border agar warna pudar tetap terlihat batasnya */}
                <span className="w-4 h-4 rounded-full bg-red-500 opacity-50 border border-red-600"></span>
                <span className="text-slate-700 font-medium">Kuliner</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-yellow-500 opacity-50 border border-yellow-600"></span>
                <span className="text-slate-700 font-medium">Fashion</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-500 opacity-50 border border-blue-600"></span>
                <span className="text-slate-700 font-medium">Jasa/Lainnya</span>
            </div>

            <hr className="border-slate-200"/>

            {/* Indikator Kepadatan */}
            <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                    <span className="w-4 h-4 rounded-full bg-red-600 border border-white"></span>
                    <span className="w-4 h-4 rounded-full bg-red-600 border border-white"></span>
                    <span className="w-4 h-4 rounded-full bg-red-600 border border-white"></span>
                </div>
                <span className="font-bold text-slate-900">Gelap = ZONA PADAT</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-red-500 opacity-20 border border-red-300"></span>
                <span className="text-slate-600 font-medium">Pudar = BUTUH PENGEMBANGAN</span>
            </div>
        </div>
      </div>
    </div>
  );
}