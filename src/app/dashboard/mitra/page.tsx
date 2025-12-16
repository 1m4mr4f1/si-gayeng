import { logoutAction } from "@/actions/authAction";

export default function MitraDashboard() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-green-800">Ini Dashboard Mitra UMKM</h1>
      <p className="mt-2 text-gray-600">Kelola toko dan produk Anda di sini.</p>
      
      <form action={logoutAction} className="mt-8">
        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
          Logout
        </button>
      </form>
    </div>
  );
}