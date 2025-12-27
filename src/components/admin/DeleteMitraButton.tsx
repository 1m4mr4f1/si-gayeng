'use client'

import { deleteMitraAction } from "@/actions/adminAction";
import { Trash2 } from "lucide-react";

export default function DeleteMitraButton({ id }: { id: number }) {
  return (
    <form 
      action={deleteMitraAction} 
      onSubmit={(e) => { 
        // Interaksi Browser (Confirm) hanya jalan di Client Component
        if(!confirm('PERINGATAN: Menghapus Mitra akan menghapus semua produknya juga. Yakin hapus permanen?')) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button 
        type="submit" 
        className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded transition-colors" 
        title="Hapus Permanen"
      >
        <Trash2 size={18} />
      </button>
    </form>
  );
}