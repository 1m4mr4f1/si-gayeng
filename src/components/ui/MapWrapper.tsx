'use client'

import dynamic from 'next/dynamic';

// 1. Import Peta di sini dengan SSR: false
const Map = dynamic(() => import('@/components/ui/Map'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-200 animate-pulse rounded-xl flex items-center justify-center text-gray-500">Memuat Peta...</div>
});

// 2. Definisi Tipe Data (Copy dari Map.tsx agar aman)
interface MitraData {
  id: number;
  namaUsaha: string;
  kategori: string | null;
  latitude: number | null;
  longitude: number | null;
  deskripsi: string | null;
}

// 3. Component Wrapper
export default function MapWrapper({ data }: { data: MitraData[] }) {
  return <Map data={data} />;
}