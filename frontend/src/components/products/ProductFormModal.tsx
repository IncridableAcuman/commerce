import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Loader2, Check } from "lucide-react";
import type { Product, ProductRequest, ProductCategory } from "../../interfaces/product.interface";
import { useProductStore } from "../../stores/productStore";
import { toast } from "react-toastify";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
  categories: ProductCategory[];
}

export const ProductFormModal = ({
  isOpen,
  onClose,
  productToEdit = null,
  categories,
}: ProductFormModalProps) => {
  const { createProduct, updateProduct, uploadProductImage } = useProductStore();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [price, setPrice] = useState<string>("");
  const [stock, setStock] = useState<string>("15");
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState("");
  const [imageTab, setImageTab] = useState<"url" | "upload">("url");

  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setTitle(productToEdit.title);
      setContent(productToEdit.content);
      setPrice(productToEdit.price.toString());
      setStock(productToEdit.stock ? productToEdit.stock.toString() : "15");
      setCategoryId(productToEdit.categoryId);
      setImageUrl(productToEdit.imageUrl || "");
    } else {
      setTitle("");
      setContent("");
      setPrice("");
      setStock("15");
      setCategoryId(categories.length > 0 ? categories[0].id : undefined);
      setImageUrl("");
    }
  }, [productToEdit, categories, isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await uploadProductImage(file);
      setImageUrl(res.imageUrl);
      toast.success("Rasm muvaffaqiyatli yuklandi!");
    } catch (err: any) {
      console.error(err);
      toast.error("Rasmni yuklashda xatolik yuz berdi");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.warning("Iltimos, mahsulot sarlavhasini kiriting");
      return;
    }
    if (!content.trim()) {
      toast.warning("Iltimos, mahsulot tavsifini kiriting");
      return;
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      toast.warning("Iltimos, to'g'ri narx kiriting");
      return;
    }

    const payload: ProductRequest = {
      title: title.trim(),
      content: content.trim(),
      price: numPrice,
      imageUrl: imageUrl.trim() || undefined,
      stock: parseInt(stock) || 10,
      categoryId: categoryId || undefined,
    };

    setSubmitting(true);
    try {
      if (productToEdit) {
        await updateProduct(productToEdit.id, payload);
        toast.success("Mahsulot muvaffaqiyatli yangilandi!");
      } else {
        await createProduct(payload);
        toast.success("Yangi mahsulot muvaffaqiyatli yaratildi!");
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || "Xatolik yuz berdi";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl shadow-black/60 overflow-hidden z-10 my-8"
        >
          {/* Sarlavha paneli */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white">
              {productToEdit ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Forma */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Sarlavha */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Mahsulot nomi *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masalan: Apple MacBook Pro 16"
                required
                className="w-full bg-slate-800/80 border border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-colors"
              />
            </div>

            {/* Kategoriya va Narx */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Kategoriya
                </label>
                <select
                  value={categoryId || ""}
                  onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full bg-slate-800/80 border border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-colors cursor-pointer"
                >
                  <option value="">Kategoriyasiz</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-slate-900 text-white">
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Narxi ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Masalan: 1299.99"
                  required
                  className="w-full bg-slate-800/80 border border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Ombordagi soni */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Ombordagi soni (dona)
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="Masalan: 20"
                className="w-full bg-slate-800/80 border border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-colors"
              />
            </div>

            {/* Rasm kiritish (URL yoki Fayl yuklash) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Mahsulot rasmi
                </label>
                <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg text-xs">
                  <button
                    type="button"
                    onClick={() => setImageTab("url")}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      imageTab === "url" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageTab("upload")}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      imageTab === "upload" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Fayl yuklash
                  </button>
                </div>
              </div>

              {imageTab === "url" ? (
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-800/80 border border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-colors"
                />
              ) : (
                <div className="relative border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-4 text-center transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center space-y-1.5 text-slate-400">
                    {uploadingImage ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                        <span className="text-xs">Rasm serverga yuklanmoqda...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-slate-400" />
                        <span className="text-xs font-medium text-slate-300">Rasmni bu yerga tashlang yoki tanlang</span>
                        <span className="text-[11px] text-slate-500">PNG, JPG, WEBP (maks 5MB)</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Rasmning jonli oldindan ko'rinishi */}
              {imageUrl && (
                <div className="flex items-center gap-3 p-2 bg-slate-800/60 rounded-xl border border-slate-800">
                  <img
                    src={imageUrl}
                    alt="Oldindan ko'rish"
                    className="w-12 h-12 rounded-lg object-cover bg-slate-900 border border-slate-700"
                  />
                  <span className="text-xs text-slate-300 truncate flex-1">{imageUrl}</span>
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="text-slate-400 hover:text-rose-400 transition-colors p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Tavsif */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Batafsil tavsif *
              </label>
              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Mahsulotning xususiyatlari, materiali va qo'shimcha ma'lumotlari..."
                required
                className="w-full bg-slate-800/80 border border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-colors resize-none"
              />
            </div>

            {/* Tugmalar */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Bekor qilish
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saqlanmoqda...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{productToEdit ? "Yangilash" : "Qo'shish"}</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
