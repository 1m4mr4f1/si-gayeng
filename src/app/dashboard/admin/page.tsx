import { logoutAction } from "@/actions/authAction";

export default function AdminDashboard() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-gray-800">Ini Dashboard Admin (Walikota)</h1>
      <p className="mt-2 text-gray-600">Selamat datang di sistem Si-Gayeng.</p>
      
      <form action={logoutAction} className="mt-8">
        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
          Logout
        </button>
      </form>
    </div>
  );
}