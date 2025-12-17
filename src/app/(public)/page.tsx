import Navbar from "@/components/layouts/Navbar";
import Hero from "@/components/sections/Hero";
import MapPreview from "@/components/sections/MapPreview";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. Panggil Navbar */}
      <Navbar />

      {/* 2. Panggil Hero Section */}
      <Hero />

      <MapPreview />

      {/* Nanti di sini kita tambah fitur lain: 
          - <Features />
          - <MapPreview />
          - <Footer /> 
      */}
    </main>
  );
}