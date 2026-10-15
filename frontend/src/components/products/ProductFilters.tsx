import { useState, useEffect } from "react";
import { 
  Search, 
  X, 
  ArrowUpDown, 
  Plus, 
  FilterX, 
  SlidersHorizontal, 
  Check, 
  ChevronDown 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  sortDir: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortDir: 'asc' | 'desc') => void;
  minPrice: number | null;
  maxPrice: number | null;
  onPriceChange: (min: number | null, max: number | null) => void;
  inStock: boolean | null;
  onInStockChange: (inStock: boolean | null) => void;
  totalElements: number;
  onOpenAddModal: () => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  canManage?: boolean;
}

export const ProductFilters = ({
  searchQuery,
  onSearchChange,
  sortBy,
  sortDir,
  onSortChange,
  minPrice,
  maxPrice,
  onPriceChange,
  inStock,
  onInStockChange,
  totalElements,
  onOpenAddModal,
  onResetFilters,
  hasActiveFilters,
  canManage = false,
}: ProductFiltersProps) => {

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [localMin, setLocalMin] = useState<string>(minPrice !== null && minPrice !== undefined ? String(minPrice) : "");
  const [localMax, setLocalMax] = useState<string>(maxPrice !== null && maxPrice !== undefined ? String(maxPrice) : "");
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchQuery) {
        onSearchChange(localSearch);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange, searchQuery]);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    setLocalMin(minPrice !== null && minPrice !== undefined ? String(minPrice) : "");
    setLocalMax(maxPrice !== null && maxPrice !== undefined ? String(maxPrice) : "");
  }, [minPrice, maxPrice]);

  const handleSortSelect = (value: string) => {
    const [field, dir] = value.split(":");
    onSortChange(field, dir as 'asc' | 'desc');
  };

  const handleApplyPrice = (e: React.FormEvent) => {
    e.preventDefault();
    const min = localMin.trim() !== "" ? Number(localMin) : null;
    const max = localMax.trim() !== "" ? Number(localMax) : null;
    onPriceChange(min, max);
  };

  const handleQuickPriceRange = (min: number | null, max: number | null) => {
    setLocalMin(min !== null ? String(min) : "");
    setLocalMax(max !== null ? String(max) : "");
    onPriceChange(min, max);
  };

  const currentSortValue = `${sortBy}:${sortDir}`;

  return (
    <div className="py-4 sm:py-6" id="products-catalog">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Yuqori qator: Qidiruv, Filter Toggle, Saralash va Tugmalar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          
          {/* Chap qism: Qidiruv maydoni (to'liq responsive) */}
          <div className="relative flex-1 w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Nomi yoki tavsifi bo'yicha qidirish..."
              className="w-full bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all shadow-xs"
            />
            {localSearch && (
              <button
                onClick={() => {
                  setLocalSearch("");
                  onSearchChange("");
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                title="Tozalash"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* O'ng qism: Saralash, Filter Toggle, Natijalar soni va Mahsulot qo'shish */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            
            {/* Filtrlar panelini ochish/yopish tugmasi */}
            <button
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
              className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer shadow-xs ${
                isFilterPanelOpen || hasActiveFilters
                  ? "bg-indigo-600/15 border-indigo-500/40 text-indigo-600 dark:text-indigo-400"
                  : "bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filtrlar</span>
              {(minPrice !== null || maxPrice !== null || inStock !== null) && (
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              )}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isFilterPanelOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Saralash Dropdown */}
            <div className="relative flex items-center">
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 shadow-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="hidden sm:inline text-slate-500 dark:text-slate-400">Saralash:</span>
                <select
                  value={currentSortValue}
                  onChange={(e) => handleSortSelect(e.target.value)}
                  className="bg-transparent text-slate-900 dark:text-white font-medium outline-none cursor-pointer pr-1 text-xs sm:text-sm"
                >
                  <option value="createdAt:desc" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Eng yangilar</option>
                  <option value="price:asc" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Narx: Arzondan qimmatga</option>
                  <option value="price:desc" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Narx: Qimmatdan arzonga</option>
                  <option value="rating:desc" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Reyting bo'yicha</option>
                </select>
              </div>
            </div>

            {/* Mahsulotlar soni indikatori */}
            <div className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
              <span className="text-slate-900 dark:text-white font-bold">{totalElements}</span> ta
            </div>

            {/* Filtrlarni tozalash (agar faol filtrlar bo'lsa) */}
            {hasActiveFilters && (
              <button
                onClick={() => {
                  setLocalSearch("");
                  setLocalMin("");
                  setLocalMax("");
                  onResetFilters();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-colors cursor-pointer"
                title="Barcha filtrlarni tozalash"
              >
                <FilterX className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tozalash</span>
              </button>
            )}

            {/* Yangi mahsulot qo'shish tugmasi (faqat ADMIN yoki MANAGER uchun) */}
            {canManage && (
              <button
                onClick={onOpenAddModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Yangi mahsulot</span>
              </button>
            )}
          </div>
        </div>

        {/* Kengaytirilgan Filtrlar Paneli (Collapsible & Responsive) */}
        <AnimatePresence>
          {isFilterPanelOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  
                  {/* 1. Narx oralig'i (Min - Max) */}
                  <div className="md:col-span-6 lg:col-span-5 space-y-2">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                      Narx oralig'i ($):
                    </span>
                    <form onSubmit={handleApplyPrice} className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">$</span>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={localMin}
                          onChange={(e) => setLocalMin(e.target.value)}
                          placeholder="Min"
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-7 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 outline-none focus:border-indigo-500"
                        />
                      </div>
                      <span className="text-slate-400 dark:text-slate-600 text-xs">—</span>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">$</span>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={localMax}
                          onChange={(e) => setLocalMax(e.target.value)}
                          placeholder="Max"
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-7 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 outline-none focus:border-indigo-500"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Qo'llash
                      </button>
                    </form>
                  </div>

                  {/* 2. Tezkor narx kategoriyalari */}
                  <div className="md:col-span-6 lg:col-span-4 space-y-2">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                      Tezkor narxlar:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: "< $50", min: null, max: 50 },
                        { label: "$50 - $150", min: 50, max: 150 },
                        { label: "$150 - $500", min: 150, max: 500 },
                        { label: "$500+", min: 500, max: null },
                      ].map((range, idx) => {
                        const isSelected = minPrice === range.min && maxPrice === range.max;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleQuickPriceRange(range.min, range.max)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
                              isSelected
                                ? "bg-indigo-600 text-white border-indigo-500"
                                : "bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-800 shadow-xs"
                            }`}
                          >
                            {range.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. Omborda mavjudligi (Stock Status) */}
                  <div className="md:col-span-12 lg:col-span-3 flex items-center justify-start lg:justify-end gap-3 pt-2 lg:pt-0">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <div
                        onClick={() => onInStockChange(inStock === true ? null : true)}
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer ${
                          inStock === true
                            ? "bg-indigo-600 border-indigo-500 text-white"
                            : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                        }`}
                      >
                        {inStock === true && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Faqat omborda mavjudlari
                      </span>
                    </label>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
