import { useState, useEffect } from "react";
import { useProductStore } from "../../stores/productStore";
import type { Product } from "../../interfaces/product.interface";
import { ProductFormModal } from "../products/ProductFormModal";
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  RefreshCw,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

export const ProductManagement = () => {
  const {
    products,
    categories,
    selectedCategory,
    searchQuery,
    totalElements,
    currentPage,
    totalPages,
    loading,

    fetchProducts,
    fetchCategories,
    setSelectedCategory,
    setSearchQuery,
    setPage,
    deleteProduct,
  } = useProductStore();

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [fetchCategories, fetchProducts]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchQuery) {
        setSearchQuery(localSearch);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [localSearch, searchQuery, setSearchQuery]);

  const handleEdit = (p: Product) => {
    setProductToEdit(p);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setProductToEdit(null);
    setIsFormOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteProduct(deleteId);
      toast.success("Mahsulot muvaffaqiyatli o'chirildi");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "O'chirishda xatolik yuz berdi";
      toast.error(msg);
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Ma'lumot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-400" />
            Mahsulotlar katalogi boshqaruvi
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Yangi mahsulot yaratish, mavjudlarini tahrirlash, o'chirish va ombor zaxirasini boshqarish (ADMIN va MANAGER)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchProducts()}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Yangilash</span>
          </button>

          <button
            onClick={handleAddNew}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi mahsulot qo'shish</span>
          </button>
        </div>
      </div>

      {/* 2. Filtrlash va qidiruv */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Mahsulot nomi yoki tavsifi..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Kategoriya filtri */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-xs w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory === null ? "" : selectedCategory}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedCategory(val === "" ? null : Number(val));
              }}
              className="bg-transparent text-slate-200 outline-none cursor-pointer text-xs"
            >
              <option value="" className="bg-slate-900 text-slate-200">
                Barcha kategoriyalar
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-slate-900 text-slate-200">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="px-3 py-2 rounded-xl bg-slate-800/40 border border-slate-800 text-xs text-slate-400 whitespace-nowrap">
            Jami: <span className="text-white font-bold">{totalElements}</span> ta
          </div>
        </div>
      </div>

      {/* 3. Jadval */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        {loading && products.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs">Mahsulotlar yuklanmoqda...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center space-y-3 text-slate-400">
            <Package className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-medium text-white">Hech qanday mahsulot topilmadi</p>
            <p className="text-xs text-slate-500">Qidiruv yoki kategoriya filtrini o'zgartirib ko'ring</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Mahsulot</th>
                  <th className="py-4 px-6">Kategoriya</th>
                  <th className="py-4 px-6">Narx</th>
                  <th className="py-4 px-6">Zaxira (Stock)</th>
                  <th className="py-4 px-6">Reyting</th>
                  <th className="py-4 px-6 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {products.map((p) => {
                  const placeholder = "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=400&q=80";

                  return (
                    <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                      {/* Mahsulot (Rasm + Nom + Tavsif) */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.imageUrl || placeholder}
                            alt={p.title}
                            className="w-12 h-12 rounded-xl object-cover bg-slate-950 shrink-0 border border-slate-800"
                          />
                          <div className="min-w-0 max-w-xs">
                            <p className="font-bold text-white text-sm truncate">{p.title}</p>
                            <p className="text-[11px] text-slate-400 line-clamp-1">{p.content}</p>
                          </div>
                        </div>
                      </td>

                      {/* Kategoriya */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[11px] font-medium">
                          {p.categoryName || "Umumiy"}
                        </span>
                      </td>

                      {/* Narx */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="font-extrabold text-white text-sm">
                          ${p.price.toFixed(2)}
                        </span>
                      </td>

                      {/* Zaxira */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        {p.stock === 0 ? (
                          <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold">
                            Tugagan (0)
                          </span>
                        ) : p.stock <= 5 ? (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold flex items-center gap-1 w-fit">
                            <AlertTriangle className="w-3 h-3" />
                            {p.stock} ta qoldi
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                            {p.stock} ta mavjud
                          </span>
                        )}
                      </td>

                      {/* Reyting */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-amber-400 font-semibold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{p.rating ? p.rating.toFixed(1) : "5.0"}</span>
                        </div>
                      </td>

                      {/* Amallar */}
                      <td className="py-4 px-6 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(p)}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
                            title="Tahrirlash"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(p.id)}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
                            title="O'chirish"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>
              Sahifa {currentPage + 1} / {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage >= totalPages - 1}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. ProductFormModal (Yaratish & Tahrirlash) */}
      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setProductToEdit(null);
        }}
        productToEdit={productToEdit}
        categories={categories}
      />

      {/* 5. O'chirishni tasdiqlash modali */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteId(null)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-center space-y-4 z-10"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">Mahsulotni o'chirish</h4>
                <p className="text-xs text-slate-400">
                  Ushbu mahsulotni o'chirishga ishonchingiz komilmi? Bu amalni ortga qaytarib bo'lmaydi.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-500/20 transition-colors cursor-pointer"
                >
                  O'chirish
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
