import { getMapData } from '@/actions/mapAction';
import MapWrapper from '@/components/ui/MapWrapper'; 

export default async function MapPreview() {
  
  // 1. Ambil data REAL dari Database (Server Side)
  const mapData = await getMapData();

  return (
    <section id="peta-umkm" className=" py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Sebaran UMKM Kota Semarang
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Menampilkan <strong>{mapData.length}</strong> Mitra UMKM yang tersebar di seluruh kota.
          </p>
        </div>

        {/* Map Container */}
        <div className="w-full h-[500px] bg-slate-100 rounded-2xl shadow-xl border-4 border-white overflow-hidden relative">
            
            {/* 2. Panggil Wrapper, bukan Map langsung */}
            <MapWrapper data={mapData} />
            
            {/* Overlay Info */}
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg z-[400] hidden md:block max-w-xs">
                <p className="text-sm font-semibold text-gray-800">💡 Info Real-time:</p>
                <p className="text-xs text-gray-600 mt-1">Data diambil langsung dari database Si-Gayeng.</p>
            </div>
        </div>

      </div>
    </section>
  );
}