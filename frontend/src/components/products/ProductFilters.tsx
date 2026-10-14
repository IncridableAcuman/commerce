import { useState, useEffect } from "react";
import { Search, X, ArrowUpDown, Plus, FilterX } from "lucide-react";

interface ProductFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  sortDir: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortDir: 'asc' | 'desc') => void;
  totalElements: number;
  onOpenAddModal: () => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const ProductFilters = ({
  searchQuery,
  onSearchChange,
  sortBy,
  sortDir,
  onSortChange,
  totalElements,
  onOpenAddModal,
  onResetFilters,
  hasActiveFilters,
}: ProductFiltersProps) => {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchQuery) {
        onSearchChange(localSearch);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange, searchQuery]);

  const handleSortSelect = (value: string) => {
    const [field, dir] = value.split(":");
    onSortChange(field, dir as 'asc' | 'desc');
  };

  const currentSortValue = `${sortBy}:${sortDir}`;

  return (
    <div className="py-6" id="products-catalog">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Chap qism: Qidiruv maydoni */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Mahsulot nomi yoki tavsifi bo'yicha qidirish..."
              className="w-full bg-slate-900/80 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-9 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all shadow-inner"
            />
            {localSearch && (
              <button
                onClick={() => {
                  setLocalSearch("");
                  onSearchChange("");
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* O'ng qism: Saralash, Natijalar soni va Mahsulot qo'shish */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Filtrlarni tozalash */}
            {hasActiveFilters && (
              <button
                onClick={() => {
                  setLocalSearch("");
                  onResetFilters();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-colors cursor-pointer"
              >
                <FilterX className="w-3.5 h-3.5" />
                <span>Tozalash</span>
              </button>
            )}

            {/* Saralash Dropdown */}
            <div className="relative flex items-center">
              <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-300">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="hidden sm:inline text-slate-400">Saralash:</span>
                <select
                  value={currentSortValue}
                  onChange={(e) => handleSortSelect(e.target.value)}
                  className="bg-transparent text-white font-medium outline-none cursor-pointer pr-1"
                >
                  <option value="createdAt:desc" className="bg-slate-900 text-white">Eng yangilar</option>
                  <option value="price:asc" className="bg-slate-900 text-white">Narx: Arzondan qimmatga</option>
                  <option value="price:desc" className="bg-slate-900 text-white">Narx: Qimmatdan arzonga</option>
                  <option value="rating:desc" className="bg-slate-900 text-white">Reyting bo'yicha</option>
                </select>
              </div>
            </div>

            {/* Mahsulotlar soni indikatori */}
            <div className="px-3 py-2 rounded-xl bg-slate-800/40 border border-slate-800 text-xs font-medium text-slate-400">
              <span className="text-white font-bold">{totalElements}</span> ta mahsulot
            </div>

            {/* Yangi mahsulot qo'shish tugmasi */}
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi mahsulot</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
