'use client'

import { loginAdminAction } from "@/actions/authAction";
import { useState } from "react";

export default function LoginAdmin() {
  const [error, setError] = useState<string | null>(null);

  async function clientAction(formData: FormData) {
    const res = await loginAdminAction(formData);
    if (res?.error) setError(res.error);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <form action={clientAction} className="p-8 bg-white rounded-xl shadow-lg w-96 border border-slate-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-900">Admin Pemkot</h2>
          <p className="text-sm text-slate-500 mt-2">Masuk ke Dashboard Si-Gayeng</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 mb-6 text-sm rounded-lg border border-red-200 text-center">
            {error}
          </div>
        )}

        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
          <input 
            name="username" 
            type="text" 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400" 
            placeholder="Masukkan username" 
            required 
          />
        </div>
        
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
          <input 
            name="password" 
            type="password" 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400" 
            placeholder="••••••" 
            required 
          />
        </div>

        <button type="submit" className="w-full bg-blue-700 text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition-colors shadow-md hover:shadow-lg">
          Masuk Dashboard
        </button>
      </form>
    </div>
  );
}