import { motion } from "framer-motion";
import { 
  Layers, 
  Smartphone, 
  Shirt, 
  Watch, 
  Home as HomeIcon, 
  Dumbbell, 
  Sparkles 
} from "lucide-react";
import type { ProductCategory } from "../../interfaces/product.interface";

interface CategoryBarProps {
  categories: ProductCategory[];
  selectedCategory: number | null;
  onSelectCategory: (categoryId: number | null) => void;
  loading?: boolean;
}

const getCategoryIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes("elektron")) return Smartphone;
  if (lower.includes("kiyim")) return Shirt;
  if (lower.includes("akses")) return Watch;
  if (lower.includes("uy")) return HomeIcon;
  if (lower.includes("sport")) return Dumbbell;
  return Sparkles;
};

export const CategoryBar = ({
  categories,
  selectedCategory,
  onSelectCategory,
  loading = false,
}: CategoryBarProps) => {
  return (
    <div className="py-6 border-b border-slate-200 dark:border-slate-800/80 transition-colors" id="categories-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-wide">Kategoriyalar</h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {categories.length} ta mavjud yo'nalish
          </span>
        </div>

        {/* Kategoriyalar gorizontal ro'yxati */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
          {/* Barcha mahsulotlar tugmasi */}
          <button
            onClick={() => onSelectCategory(null)}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === null
                ? "text-white shadow-md shadow-indigo-500/20"
                : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs"
            }`}
          >
            {selectedCategory === null && (
              <motion.span
                layoutId="activeCategoryPill"
                className="absolute inset-0 bg-linear-to-r from-indigo-600 to-purple-600 rounded-xl -z-10"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <Sparkles className="w-4 h-4" />
            <span>Barchasi</span>
          </button>

          {/* Dinamik kategoriyalar */}
          {categories.map((cat) => {
            const Icon = getCategoryIcon(cat.name);
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? "text-white shadow-md shadow-indigo-500/20"
                    : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-xs"
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 bg-linear-to-r from-indigo-600 to-purple-600 rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className="w-4 h-4" />
                <span>{cat.name}</span>
                {cat.productCount > 0 && (
                  <span
                    className={`ml-1 text-[11px] px-1.5 py-0.5 rounded-full font-semibold ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {cat.productCount}
                  </span>
                )}
              </button>
            );
          })}

          {loading && categories.length === 0 && (
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-28 h-10 bg-slate-200 dark:bg-slate-800/60 rounded-xl animate-pulse" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
