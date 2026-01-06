import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";

export default function Events() {
  return (
    <section id="event" className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Event & Berita UMKM</h2>
          <p className="text-gray-500 mt-2">Jangan lewatkan kegiatan seru komunitas UMKM Semarang.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
            <div className="h-48 bg-gray-200 relative">
               {/* Ganti src dengan gambar event asli */}
               <img src="https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&q=80&w=1000" alt="Event 1" className="w-full h-full object-cover" />
               <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  COMING SOON
               </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Bazar UMKM Simpang Lima</h3>
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> 12 Agt 2024</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> Simpang Lima</span>
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                Temukan ratusan produk lokal terbaik dan nikmati kuliner khas Semarang di satu tempat.
              </p>
              <Link href="/event/1" className="text-green-600 font-semibold text-sm hover:underline">
                Lihat Detail &rarr;
              </Link>
            </div>
          </div>

          {/* Card 2 */}
           <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
            <div className="h-48 bg-gray-200 relative">
               <img src="https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&q=80&w=1000" alt="Event 2" className="w-full h-full object-cover" />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Workshop Digital Marketing</h3>
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> 20 Agt 2024</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> Online Zoom</span>
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                Pelatihan gratis untuk para pelaku UMKM agar bisa berjualan online dengan efektif.
              </p>
              <Link href="/event/2" className="text-green-600 font-semibold text-sm hover:underline">
                Lihat Detail &rarr;
              </Link>
            </div>
          </div>

          {/* Card 3 - Call to Action */}
          <div className="bg-green-600 rounded-xl overflow-hidden shadow-md p-8 flex flex-col justify-center items-center text-center">
             <h3 className="text-2xl font-bold text-white mb-4">Punya Event Seru?</h3>
             <p className="text-green-100 mb-6 text-sm">
                Promosikan event komunitas atau grand opening usahamu di sini.
             </p>
             <Link href="/kontak" className="bg-white text-green-700 px-6 py-2 rounded-lg font-bold text-sm hover:bg-green-50 transition">
                Hubungi Kami
             </Link>
          </div>

        </div>
      </div>
    </section>
  );
}