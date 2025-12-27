'use client';

import { Search } from 'lucide-react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function SearchInput() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Handle pencarian
  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }

    // Update URL tanpa refresh halaman penuh
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
      <input
        type="text"
        placeholder="Cari nama usaha atau email..."
        className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-64 transition-all"
        onChange={(e) => {
            // Debounce manual sederhana (Tanpa library tambahan)
            // Menggunakan setTimeout agar tidak spam database setiap ketik
            setTimeout(() => {
                handleSearch(e.target.value);
            }, 500);
        }}
        defaultValue={searchParams.get('query')?.toString()}
      />
    </div>
  );
}