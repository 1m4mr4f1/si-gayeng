import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* KOLOM KIRI: Teks & Tombol */}
        <div className="space-y-6 z-10">
          {/* Sub-headline kecil */}
          <p className="text-sm md:text-base font-semibold text-gray-500 uppercase tracking-wide">
            Jelajahi Potensi Lokal Semarang
          </p>

          {/* Headline Besar */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
            Temukan <span className="text-green-600">UMKM Terbaik</span> di Sekitar Anda.
          </h1>

          {/* Deskripsi */}
          <p className="text-gray-600 text-lg md:text-xl max-w-lg leading-relaxed">
            Dukung ekonomi lokal dengan berbelanja di gerai UMKM terverifikasi. 
            Dari kuliner lezat hingga kerajinan tangan otentik, semua ada di Si-Gayeng.
          </p>

          {/* Tombol Action */}
          <div className="flex flex-wrap gap-4 pt-4">
            <Link 
              href="/market" 
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded shadow-lg hover:shadow-green-500/30 transition-all transform hover:-translate-y-1"
            >
              Cari di Peta
            </Link>
            
            <Link 
              href="/LoginMitra" 
              className="bg-transparent border-2 border-gray-300 hover:border-green-500 text-gray-600 hover:text-green-600 font-bold py-3 px-8 rounded transition-all"
            >
              Daftar Jadi Mitra
            </Link>
          </div>
        </div>

        {/* KOLOM KANAN: Gambar */}
        <div className="relative h-[400px] md:h-[500px] w-full">
            {/* Background Blob/Shape untuk estetika */}
            <div className="absolute top-0 right-0 w-full h-full bg-green-100 rounded-full blur-3xl opacity-50 -z-10 transform translate-x-10 -translate-y-10"></div>
            
            {/* Ganti src ini dengan gambar asli nanti. 
                Gunakan class object-cover agar rapi seperti contoh */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                {/* Placeholder Image menggunakan Lorem Picsum sementara */}
                <img 
                    src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000&auto=format&fit=crop" 
                    alt="UMKM Semarang Activity" 
                    className="object-cover w-full h-full"
                />
            </div>
        </div>

      </div>
    </section>
  );
}