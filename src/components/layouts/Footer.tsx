import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer id="kontak" className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        
        {/* Kolom 1: Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-tr-lg rounded-bl-lg flex items-center justify-center">
               <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-white">Si-Gayeng</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Platform digital untuk memajukan UMKM Kota Semarang. Temukan produk lokal terbaik dan dukung ekonomi daerah.
          </p>
        </div>

        {/* Kolom 2: Navigasi */}
        <div>
            <h4 className="text-white font-bold mb-6">Navigasi</h4>
            <ul className="space-y-3 text-sm">
                <li><Link href="/" className="hover:text-green-500 transition">Beranda</Link></li>
                <li><Link href="/kategori" className="hover:text-green-500 transition">Kategori UMKM</Link></li>
                <li><Link href="/#peta-umkm" className="hover:text-green-500 transition">Peta Lokasi</Link></li>
                <li><Link href="/event" className="hover:text-green-500 transition">Event</Link></li>
            </ul>
        </div>

        {/* Kolom 3: Layanan */}
        <div>
            <h4 className="text-white font-bold mb-6">Layanan</h4>
            <ul className="space-y-3 text-sm">
                <li><Link href="/RegisterMitra" className="hover:text-green-500 transition">Daftar Jadi Mitra</Link></li>
                <li><Link href="/login" className="hover:text-green-500 transition">Login Mitra</Link></li>
                <li><Link href="/faq" className="hover:text-green-500 transition">Bantuan / FAQ</Link></li>
                <li><Link href="/kebijakan" className="hover:text-green-500 transition">Kebijakan Privasi</Link></li>
            </ul>
        </div>

        {/* Kolom 4: Kontak */}
        <div>
            <h4 className="text-white font-bold mb-6">Hubungi Kami</h4>
            <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-green-500 shrink-0" />
                    <span>Jl. Pemuda No. 148, Sekayu, Semarang Tengah, Kota Semarang.</span>
                </li>
                <li className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-green-500 shrink-0" />
                    <span>(024) 351-3366</span>
                </li>
                <li className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-green-500 shrink-0" />
                    <span>info@sigayeng.semarangkota.go.id</span>
                </li>
            </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Si-Gayeng UMKM Semarang. All rights reserved.</p>
      </div>
    </footer>
  );
}