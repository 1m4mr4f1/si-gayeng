import Link from "next/link";
import { Utensils, Shirt, Hammer, ShoppingBag, ArrowRight } from "lucide-react";

const categories = [
  {
    id: 1,
    title: "Kuliner",
    icon: <Utensils className="w-8 h-8 text-green-600" />,
    desc: "Makanan & Minuman khas Semarang",
    link: "/kategori?type=kuliner"
  },
  {
    id: 2,
    title: "Fashion",
    icon: <Shirt className="w-8 h-8 text-blue-600" />,
    desc: "Batik, Pakaian & Aksesoris",
    link: "/kategori?type=fashion"
  },
  {
    id: 3,
    title: "Kerajinan",
    icon: <Hammer className="w-8 h-8 text-amber-600" />,
    desc: "Souvenir & Kerajinan Tangan",
    link: "/kategori?type=kerajinan"
  },
  {
    id: 4,
    title: "Jasa & Lainnya",
    icon: <ShoppingBag className="w-8 h-8 text-purple-600" />,
    desc: "Jasa Fotografi, Desain, dll",
    link: "/kategori?type=jasa"
  },
];

export default function Categories() {
  return (
    <section id="kategori" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Kategori Pilihan</h2>
            <p className="text-gray-500 mt-2">Temukan apa yang kamu butuhkan berdasarkan kategori.</p>
          </div>
          <Link href="/kategori" className="hidden md:flex items-center text-green-600 font-semibold hover:underline">
            Lihat Semua <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              href={cat.link}
              className="group bg-slate-50 border border-slate-100 p-6 rounded-2xl hover:shadow-lg hover:border-green-200 transition-all duration-300"
            >
              <div className="bg-white w-14 h-14 rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">
                {cat.title}
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                {cat.desc}
              </p>
            </Link>
          ))}
        </div>
        
        {/* Mobile View Link */}
        <div className="mt-8 text-center md:hidden">
            <Link href="/kategori" className="text-green-600 font-semibold text-sm">
                Lihat Semua Kategori &rarr;
            </Link>
        </div>
      </div>
    </section>
  );
}