import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer"; // Import Footer
import Hero from "@/components/sections/Hero";
import Categories from "@/components/sections/Categories"; // Import Categories
import MapPreview from "@/components/sections/MapPreview";
import Events from "@/components/sections/Events"; // Import Events

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* 1. Navbar (Sticky) */}
      <Navbar />

      {/* 2. Hero Section (Header) */}
      <Hero />
      
      {/* 3. Kategori (Fitur Baru) */}
      <Categories />

      {/* 4. Peta UMKM (Data dari DB) */}
      <MapPreview />

      {/* 5. Event & Berita (Fitur Baru) */}
      <Events />

      {/* 6. Footer (Kontak & Info) */}
      <Footer />
    </main>
  );
}