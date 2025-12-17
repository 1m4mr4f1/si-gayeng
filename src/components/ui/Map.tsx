'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useState, useMemo } from 'react';
import Fuse from 'fuse.js'; // Import Fuse.js

// INTERFACE DATA
interface MitraData {
  id: number;
  namaUsaha: string;
  kategori: string | null;
  latitude: number | null;
  longitude: number | null;
  deskripsi: string | null;
}

interface MapProps {
  data: MitraData[];
}

// KONFIGURASI ICON & WARNA (Tetap sama)
const CATEGORY_STYLES: Record<string, { color: string; label: string; hex: string }> = {
  Kuliner:    { color: 'red',    label: 'Kuliner',    hex: '#cb2b3e' },
  Fashion:    { color: 'blue',   label: 'Fashion',    hex: '#2a81cb' },
  Kafe:       { color: 'orange', label: 'Kafe',       hex: '#cb8427' },
  Kriya:      { color: 'green',  label: 'Kriya',      hex: '#2aad27' },
  Elektronik: { color: 'grey',   label: 'Elektronik', hex: '#7b7b7b' },
  Kesehatan:  { color: 'violet', label: 'Kesehatan',  hex: '#9c2bcB' },
  Pertanian:  { color: 'gold',   label: 'Pertanian',  hex: '#ffd326' },
  Pendidikan: { color: 'black',  label: 'Pendidikan', hex: '#3d3d3d' },
  Jasa:       { color: 'yellow', label: 'Jasa',       hex: '#cac428' },
  Retail:     { color: 'grey',   label: 'Retail',     hex: '#7b7b7b' },
};
const DEFAULT_STYLE = { color: 'blue', label: 'Lainnya', hex: '#2a81cb' };

const getCategoryIcon = (kategori: string | null) => {
  const cat = kategori || 'Lainnya';
  const style = CATEGORY_STYLES[cat] || DEFAULT_STYLE;
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${style.color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

export default function Map({ data = [] }: MapProps) {
  const center: [number, number] = [-6.9932, 110.4203];
  
  // 1. STATE UNTUK PENCARIAN
  const [query, setQuery] = useState("");

  // 2. LOGIKA FUSE.JS (FUZZY SEARCH)
  // Kita pakai useMemo agar tidak menghitung ulang terus menerus
  const filteredData = useMemo(() => {
    // Jika search kosong, tampilkan semua data (safe guard array)
    const safeData = Array.isArray(data) ? data : [];
    if (!query) return safeData;

    // Konfigurasi Fuse
    const fuse = new Fuse(safeData, {
      keys: ['namaUsaha', 'kategori', 'deskripsi'], // Kolom yang dicari
      threshold: 0.3, // Sensitivitas Typo (0.0 = Persis, 1.0 = Ngawur). 0.3-0.4 paling pas.
      includeScore: true
    });

    // Lakukan pencarian
    const results = fuse.search(query);
    
    // Ambil item aslinya dari hasil pencarian
    return results.map(result => result.item);
  }, [query, data]);

  return (
    <div className="relative w-full h-full group">
      
      {/* 3. INPUT SEARCH FLOATING (UI) */}
      <div className="absolute top-4 right-4 z-[1000] w-64 md:w-80">
        <div className="relative">
            <input 
                type="text" 
                placeholder="Cari UMKM (Contoh: 'Rsmbut' / 'Kopi')..." 
                className="w-full pl-10 pr-4 py-3 rounded-lg shadow-lg border-2 border-transparent focus:border-green-500 outline-none text-sm text-gray-700 bg-white/95 backdrop-blur transition-all"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            {/* Icon Search */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            
            {/* Indikator Hasil */}
            {query && (
                <div className="absolute right-3 top-3.5 text-xs font-bold text-green-600 bg-green-100 px-2 rounded-full">
                    {filteredData.length}
                </div>
            )}
        </div>
      </div>

      <MapContainer center={center} zoom={12} scrollWheelZoom={false} className="h-full w-full rounded-xl z-0 outline-none">
        <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* 4. RENDER DATA HASIL FILTER */}
        {filteredData.map((mitra) => {
            if (!mitra.latitude || !mitra.longitude) return null;
            const kategori = mitra.kategori || 'Lainnya';
            const style = CATEGORY_STYLES[kategori] || DEFAULT_STYLE;

            return (
              <Marker 
                key={mitra.id} 
                position={[mitra.latitude, mitra.longitude]} 
                icon={getCategoryIcon(mitra.kategori)}
              >
                <Popup>
                  <div className="p-1 min-w-[150px]">
                    <span 
                      className="inline-block px-2 py-1 text-[10px] font-bold rounded mb-1 text-white"
                      style={{ backgroundColor: style.hex }}
                    >
                      {kategori}
                    </span>
                    <h3 className="font-bold text-sm text-gray-900">{mitra.namaUsaha}</h3>
                    <p className="text-xs text-gray-600 mt-1 leading-snug">{mitra.deskripsi}</p>
                  </div>
                </Popup>
              </Marker>
            );
        })}
      </MapContainer>
      
       {/* LEGEND (Sama seperti sebelumnya) */}
       <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-xl z-[1000] border border-gray-200 max-h-[300px] overflow-y-auto hidden md:block transition-opacity opacity-50 group-hover:opacity-100">
        <h4 className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide border-b pb-1">Kategori</h4>
        <div className="space-y-2">
          {Object.entries(CATEGORY_STYLES).map(([key, style]) => (
            <div key={key} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: style.hex }}></span>
              <span className="text-[11px] font-medium text-gray-600">{style.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}