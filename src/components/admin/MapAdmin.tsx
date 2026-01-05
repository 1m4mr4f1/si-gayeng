'use client'

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Wajib import CSS ini agar peta tidak berantakan
import L from "leaflet";
import { useEffect } from "react";

// --- CONFIG ICON WARNA-WARNI (Sesuai Charter: Merah, Biru, Kuning) ---
const createIcon = (color: string) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const iconMerah = createIcon("red");    // Kuliner
const iconBiru = createIcon("blue");    // Jasa
const iconKuning = createIcon("gold");  // Fashion
const iconHijau = createIcon("green");  // Default

export default function MapAdmin({ dataMitra }: { dataMitra: any[] }) {
  
  // Fix bug visual icon bawaan Leaflet di Next.js
  useEffect(() => {
    // Cleanup function jika diperlukan
  }, []);

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg border relative z-0">
      <MapContainer 
        center={[-6.9932, 110.4203]} // Titik Tengah Semarang
        zoom={12} 
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        {/* Layer Peta Gratis (OpenStreetMap) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Loop Data Mitra jadi Pin */}
        {dataMitra.map((mitra) => {
          if (!mitra.latitude || !mitra.longitude) return null;

          // Logika Warna Pin Berdasarkan Kategori
          let iconPakai = iconHijau;
          const kat = mitra.kategori?.toLowerCase() || "";
          
          if (kat.includes("kuliner")) iconPakai = iconMerah;
          else if (kat.includes("jasa")) iconPakai = iconBiru;
          else if (kat.includes("fashion")) iconPakai = iconKuning;

          return (
            <Marker 
              key={mitra.id} 
              position={[mitra.latitude, mitra.longitude]} 
              icon={iconPakai}
            >
              <Popup>
                <div className="text-center min-w-[150px]">
                  <b className="text-sm block text-gray-800">{mitra.namaUsaha}</b>
                  <span className="text-[10px] uppercase font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded border my-1 inline-block">
                    {mitra.kategori}
                  </span>
                  <p className="text-xs text-gray-600 truncate mt-1">
                    {mitra.alamat || "Semarang, Jawa Tengah"}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      {/* Legenda Peta (Pojok Kanan Atas) */}
      <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-md z-[1000] text-xs border border-gray-200">
        <h4 className="font-bold mb-2 text-gray-700">Legenda Kategori</h4>
        <div className="flex items-center gap-2 mb-1"><span className="w-3 h-3 bg-red-500 rounded-full"></span> Kuliner</div>
        <div className="flex items-center gap-2 mb-1"><span className="w-3 h-3 bg-blue-500 rounded-full"></span> Jasa</div>
        <div className="flex items-center gap-2 mb-1"><span className="w-3 h-3 bg-yellow-500 rounded-full"></span> Fashion</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 bg-green-500 rounded-full"></span> Lainnya</div>
      </div>
    </div>
  );
}