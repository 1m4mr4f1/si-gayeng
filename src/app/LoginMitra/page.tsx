'use client'

import { loginMitraAction } from "@/actions/authAction";
import { useState } from "react";

export default function LoginMitra() {
  const [error, setError] = useState<string | null>(null);

  async function clientAction(formData: FormData) {
    const res = await loginMitraAction(formData);
    if (res?.error) setError(res.error);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-green-50">
      <form action={clientAction} className="p-8 bg-white rounded-xl shadow-lg w-96 border border-green-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-green-800">Mitra UMKM</h2>
          <p className="text-sm text-green-600 mt-2">Kelola Usaha Anda di Si-Gayeng</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 mb-6 text-sm rounded-lg border border-red-200 text-center">
            {error}
          </div>
        )}

        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email Mitra</label>
          <input 
            name="email" 
            type="email" 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all placeholder:text-gray-400" 
            placeholder="nama@email.com" 
            required 
          />
        </div>
        
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
          <input 
            name="password" 
            type="password" 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all placeholder:text-gray-400" 
            placeholder="••••••" 
            required 
          />
        </div>

        <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg">
          Masuk Sebagai Mitra
        </button>
      </form>
    </div>
  );
}