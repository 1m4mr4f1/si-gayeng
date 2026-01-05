'use client'

import dynamic from "next/dynamic";
import { Map } from "lucide-react";

// Pindahkan logika dynamic import ke sini
const MapAdmin = dynamic(() => import("./MapAdmin"), { 
  ssr: false, 
  loading: () => (
    <div className="h-[400px] w-full bg-slate-100 animate-pulse rounded-xl flex flex-col items-center justify-center text-slate-400 gap-2">
      <Map size={32} />
      <span>Memuat Peta Sebaran...</span>
    </div>
  )
});

export default function MapWrapper({ dataMitra }: { dataMitra: any[] }) {
  return <MapAdmin dataMitra={dataMitra} />;
}