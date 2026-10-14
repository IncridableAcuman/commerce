import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { HeroSection } from "../components/products/HeroSection";
import { CategoryBar } from "../components/products/CategoryBar";
import { ProductFilters } from "../components/products/ProductFilters";
import { ProductCard } from "../components/products/ProductCard";
import { ProductSkeletonGrid } from "../components/products/ProductSkeleton";
import { ProductDetailModal } from "../components/products/ProductDetailModal";
import { ProductFormModal } from "../components/products/ProductFormModal";
import { CartDrawer } from "../components/products/CartDrawer";
import { useProductStore } from "../stores/productStore";
import { useAuthStore } from "../stores/authStore";
import type { Product } from "../interfaces/product.interface";
import { 
  PackageOpen, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle
} from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const Home = () => {
  const {
    products,
    categories,
    selectedCategory,
    searchQuery,
    sortBy,
    sortDir,
    totalElements,
    currentPage,
    totalPages,
    loading,
    categoriesLoading,
    fetchProducts,
    fetchCategories,
    setSelectedCategory,
    setSearchQuery,
    setSortBy,
    setPage,
    deleteProduct,
  } = useProductStore();

  const { isAuthenticated } = useAuthStore();

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const catalogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [fetchCategories, fetchProducts]);

  const handleExploreClick = () => {
    catalogRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSearchQuery("");
  };

  const handleEditProduct = (product: Product) => {
    setProductToEdit(product);
    setIsAddModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteProduct(deleteId);
      toast.success("Mahsulot muvaffaqiyatli o'chirildi");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "O'chirishda xatolik yuz berdi");
    } finally {
      setDeleteId(null);
    }
  };

  const hasActiveFilters = Boolean(selectedCategory !== null || searchQuery.trim() !== "");

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* 1. Yuqori Navigatsiya */}
      <Navbar />

      {/* 2. Savat paneli (Slide-over Cart Drawer) */}
      <CartDrawer />

      {/* 3. Hero Promo Banner */}
      <HeroSection onExploreClick={handleExploreClick} />

      {/* 4. Kategoriyalar Bar */}
      <CategoryBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        loading={categoriesLoading}
      />

      {/* 5. Mahsulotlar filtri va qidiruv */}
      <div ref={catalogRef}>
        <ProductFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          sortDir={sortDir}
          onSortChange={setSortBy}
          totalElements={totalElements}
          onOpenAddModal={() => {
            setProductToEdit(null);
            setIsAddModalOpen(true);
          }}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {/* 6. Asosiy Mahsulotlar Katalogi */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {loading ? (
          <ProductSkeletonGrid count={8} />
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 px-4 bg-slate-900/40 border border-slate-800/80 rounded-3xl space-y-4 max-w-lg mx-auto"
          >
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
              <PackageOpen className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-white">Hech qanday mahsulot topilmadi</h3>
              <p className="text-xs text-slate-400">
                Qidiruv so'rovingizga yoki tanlangan filtrga mos mahsulot mavjud emas.
              </p>
            </div>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
              >
                Filtrlarni tozalash
              </button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Mahsulotlar to'ri (Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                  onEdit={(p) => handleEditProduct(p)}
                  onDelete={(id) => setDeleteId(id)}
                  canManage={isAuthenticated}
                />
              ))}
            </div>

            {/* Sahifalash (Pagination) */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8 border-t border-slate-800/80">
                <button
                  onClick={() => setPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title="Oldingi sahifa"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1.5 text-xs font-medium">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`w-9 h-9 rounded-xl transition-all cursor-pointer ${
                        currentPage === i
                          ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-md shadow-indigo-500/20"
                          : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage >= totalPages - 1}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title="Keyingi sahifa"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* 7. Tezkor ko'rish modali (Quick View Modal) */}
      <ProductDetailModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* 8. Mahsulot yaratish / tahrirlash modali */}
      <ProductFormModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setProductToEdit(null);
        }}
        productToEdit={productToEdit}
        categories={categories}
      />

      {/* 9. O'chirishni tasdiqlash modali */}
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

      {/* 10. Footer */}
      <Footer />
    </div>
  );
};

export default Home;