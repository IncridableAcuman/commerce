import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  ShoppingBag, 
  Heart, 
  Star, 
  ShieldCheck, 
  Truck, 
  Minus, 
  Plus, 
  Share2, 
  Check,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import type { Product } from "../../interfaces/product.interface";
import { useCartStore } from "../../stores/cartStore";
import { useWishlistStore } from "../../stores/wishlistStore";
import { toast } from "react-toastify";

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductDetailModal = ({
  product,
  isOpen,
  onClose,
}: ProductDetailModalProps) => {
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !product) return null;

  const isFavorite = isInWishlist(product.id);
  const maxStock = product.stock || 1;

  const handleAddToCart = () => {
    addItem(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
    toast.success(`${product.title} (${quantity} dona) savatga qo'shildi!`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + `/products/${product.id}`);
    setCopied(true);
    toast.info("Havola buferga nusxalandi!");
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.price);

  const placeholderImage = "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Orqa fon qoraytmasi */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal korpusi */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl shadow-black/60 overflow-hidden z-10 my-8"
        >
          {/* Yopish tugmasi */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 p-6 sm:p-8">
            
            {/* Chap tomon: Rasm galereyasi */}
            <div className="space-y-4">
              <div className="w-full aspect-square bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center relative">
                <img
                  src={product.imageUrl || placeholderImage}
                  alt={product.title}
                  className="w-full h-full object-cover object-center"
                />
                {product.categoryName && (
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700 text-xs font-semibold text-indigo-300">
                    {product.categoryName}
                  </span>
                )}
              </div>

              {/* Qo'shimcha kafolat va yetkazish belgilari */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 text-xs text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>1 yillik rasmiy kafolat</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 text-xs text-slate-300">
                  <Truck className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Tezkor yetkazib berish</span>
                </div>
              </div>
            </div>

            {/* O'ng tomon: Ma'lumotlar va sotib olish */}
            <div className="flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                
                {/* Reyting va Zaxira */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="font-semibold">{product.rating ? product.rating.toFixed(1) : "5.0"}</span>
                    <span className="text-slate-400">(48+ sharhlar)</span>
                  </div>

                  {product.stock > 0 ? (
                    <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Omborda: {product.stock} ta</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-lg font-medium">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Hozirda sotuvda yo'q</span>
                    </div>
                  )}
                </div>

                {/* Sarlavha */}
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  {product.title}
                </h2>

                {/* Narx */}
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400">
                    {formattedPrice}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    (Barcha soliqlar kiritilgan)
                  </span>
                </div>

                {/* Batafsil tavsif */}
                <div className="pt-2 border-t border-slate-800">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Tavsif
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto pr-2">
                    {product.content}
                  </p>
                </div>

              </div>

              {/* Harakatlar (Quantity, Add to Cart, Wishlist, Share) */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-4">
                  {/* Soni tanlash (Stepper) */}
                  <div className="flex items-center bg-slate-800/80 border border-slate-700/80 rounded-xl p-1">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
                      disabled={quantity >= maxStock}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Wishlist va Share tugmalari */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleWishlist(product)}
                      className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                        isFavorite
                          ? "bg-rose-500/20 border-rose-500/40 text-rose-400"
                          : "bg-slate-800/80 border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-700"
                      }`}
                      title={isFavorite ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"}
                    >
                      <Heart className={`w-5 h-5 ${isFavorite ? "fill-rose-400" : ""}`} />
                    </button>

                    <button
                      onClick={handleShare}
                      className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                      title="Havolani ulashish"
                    >
                      {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Savatga qo'shish tugmasi */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer ${
                    isAdded
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                      : product.stock <= 0
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                      : "bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 active:scale-[0.98]"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Savatga muvaffaqiyatli qo'shildi!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>Savatga qo'shish - {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(product.price * quantity)}</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
