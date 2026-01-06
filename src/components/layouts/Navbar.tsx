import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-white py-4 px-6 md:px-12 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* 1. LOGO (Kiri) */}
        <div className="flex items-center gap-2">
          {/* Ikon Sederhana */}
          <div className="w-8 h-8 bg-green-500 rounded-tr-lg rounded-bl-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-800 leading-none">Si-Gayeng</span>
            <span className="text-[10px] text-gray-500 tracking-wider">UMKM SEMARANG</span>
          </div>
        </div>
{/* 2. MENU LINKS (Tengah) - Hidden di Mobile */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-green-600 font-semibold text-sm">
            Beranda
          </Link>
          
          {/* Gunakan /#id agar scroll ke section terkait */}
          <Link href="/#peta-umkm" className="text-gray-600 hover:text-green-600 font-medium text-sm transition">
            Peta UMKM
          </Link>
          
          <Link href="/#kategori" className="text-gray-600 hover:text-green-600 font-medium text-sm transition">
            Kategori
          </Link>
          
          <Link href="/#event" className="text-gray-600 hover:text-green-600 font-medium text-sm transition">
            Event
          </Link>
          
          <Link href="/#kontak" className="text-gray-600 hover:text-green-600 font-medium text-sm transition">
            Kontak
          </Link>
        </div>

        {/* 3. BUTTON ACTION (Kanan) */}
        <div className="hidden md:block">
          <Link 
            href="/RegisterMitra" 
            className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-6 py-2.5 rounded-md transition-all shadow-md hover:shadow-lg"
          >
            Gabung Mitra
          </Link>
        </div>

        {/* Mobile Menu Button (Placeholder) */}
        <button className="md:hidden text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
    </nav>
  );
}