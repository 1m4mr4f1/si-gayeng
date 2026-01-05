import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function generateCertificatePDF(
  namaMitra: string,
  jenisSertifikasi: string,
  nomorSertifikat: string
) {
  // 1. Buat Dokumen PDF Baru
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]); // Ukuran Landscape (Lebar, Tinggi)
  const { width, height } = page.getSize();

  // 2. Load Font Standar
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // 3. Desain Frame / Border (Warna Hijau Tua)
  page.drawRectangle({
    x: 20, y: 20,
    width: width - 40, height: height - 40,
    borderWidth: 5,
    borderColor: rgb(0, 0.5, 0), // Hijau
    color: rgb(1, 1, 1), // Putih (Isi)
  });

  // 4. Header: "SERTIFIKAT KELAYAKAN"
  page.drawText('SERTIFIKAT KELAYAKAN', {
    x: width / 2 - 130, // Posisi X (tengah manual)
    y: height - 80,     // Posisi Y (dari bawah ke atas)
    size: 24,
    font: fontBold,
    color: rgb(0, 0.5, 0),
  });

  // 5. Sub-Header: Jenis (HALAL / BPOM)
  page.drawText(`VERIFIKASI: ${jenisSertifikasi.toUpperCase()}`, {
    x: width / 2 - 80,
    y: height - 110,
    size: 14,
    font: fontRegular,
    color: rgb(0.3, 0.3, 0.3),
  });

  // 6. Teks "Diberikan Kepada:"
  page.drawText('Diberikan Kepada Mitra:', {
    x: width / 2 - 70,
    y: height - 160,
    size: 12,
    font: fontRegular,
  });

  // 7. NAMA MITRA (Besar)
  const textWidth = fontBold.widthOfTextAtSize(namaMitra, 30);
  page.drawText(namaMitra, {
    x: (width - textWidth) / 2, // Center align
    y: height - 200,
    size: 30,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  // 8. Nomor Sertifikat
  page.drawText(`Nomor Registrasi: ${nomorSertifikat}`, {
    x: width / 2 - 100,
    y: height - 250,
    size: 14,
    font: fontRegular,
    color: rgb(0.8, 0.2, 0.2), // Merah Bata
  });

  // 9. Tanggal & Tanda Tangan
  const dateStr = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
  page.drawText(`Diterbitkan: ${dateStr}`, {
    x: width - 200,
    y: 60,
    size: 10,
    font: fontRegular,
  });
  
  page.drawText('Admin Si-Gayeng', {
    x: width - 190,
    y: 40,
    size: 10,
    font: fontBold,
    color: rgb(0, 0.5, 0),
  });

  // ==========================================
  // SIMPAN FILE KE FOLDER PUBLIC
  // ==========================================
  const pdfBytes = await pdfDoc.save();
  const filename = `Sertifikat_${Date.now()}.pdf`;
  
  // Pastikan folder ada
  const uploadDir = path.join(process.cwd(), "public/sertifikat");
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (e) {}

  await writeFile(path.join(uploadDir, filename), pdfBytes);

  // Return URL Publik untuk disimpan di Database
  return `/sertifikat/${filename}`;
}