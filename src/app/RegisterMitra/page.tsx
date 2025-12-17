'use client'

import { registerMitraAction } from "@/actions/authAction";
import Link from "next/link";
import { Store, User, Mail, Lock, Phone, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function RegisterMitraPage() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Handler Submit
  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setErrorMsg("");
    
    const result = await registerMitraAction(formData);
    
    if (result?.error) {
      setErrorMsg(result.error);
      setLoading(false);
    }
  };

  // Style Input Konsisten
  const inputClass = "w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none bg-white text-slate-900 placeholder:text-slate-400 shadow-sm transition-all";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Store className="text-green-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Daftar Mitra Baru</h1>
          <p className="text-slate-500 text-sm mt-2">Mulai digitalkan UMKM Anda bersama Si-Gayeng.</p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-200 text-center font-medium">
                {errorMsg}
            </div>
        )}

        {/* Form */}
        <form action={handleSubmit} className="space-y-5">
          
          {/* Nama Usaha */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 ml-1">Nama Usaha</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input 
                name="namaUsaha" 
                type="text" 
                required 
                placeholder="Contoh: Warung Makan Bu Siti"
                className={inputClass}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 ml-1">Email Aktif</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input 
                name="email" 
                type="email" 
                required 
                placeholder="email@contoh.com"
                className={inputClass}
              />
            </div>
          </div>

          {/* No HP */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 ml-1">Nomor WhatsApp</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input 
                name="noHp" 
                type="tel" 
                required 
                placeholder="0812xxxx"
                className={inputClass}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input 
                name="password" 
                type="password" 
                required 
                placeholder="******"
                className={inputClass}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg mt-6 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? "Memproses..." : (
                <>
                    Daftar Sekarang <ArrowRight size={18} />
                </>
            )}
          </button>

        </form>

        {/* Footer Link */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
            Sudah punya akun?{" "}
            <Link href="/LoginMitra" className="text-green-600 font-bold hover:underline hover:text-green-700 transition-colors">
                Masuk disini
            </Link>
            </p>
        </div>

      </div>
    </div>
  );
}