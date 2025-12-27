import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import EditProfilForm from "@/app/dashboard/EditProfilForm";

export default async function ProfilPage() {
  const session = await getSession();
  const mitra = await prisma.mitra.findUnique({
    where: { id: session?.id as number }
  });

  if (!mitra) redirect('/');

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Edit Profil & Lokasi</h2>
      <EditProfilForm mitra={mitra} />
    </div>
  );
}