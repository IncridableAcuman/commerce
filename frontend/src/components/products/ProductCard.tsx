import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Heart, 
  ShoppingBag, 
  Eye, 
  Star, 
  Check, 
  Edit, 
  Trash2,
  AlertTriangle
} from "lucide-react";
import type { Product } from "../../interfaces/product.interface";
import { useCartStore } from "../../stores/cartStore";
import { useWishlistStore } from "../../stores/wishlistStore";

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: number) => void;
  canManage?: boolean;
}

export const ProductCard = ({
  product,
  onQuickView,
  onEdit,
  onDelete,
  canManage = false,
}: ProductCardProps) => {
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const [isAdded, setIsAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isFavorite = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.price);

  const placeholderImage = "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80";

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      onClick={() => onQuickView(product)}
      className="group relative bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl overflow-hidden shadow-lg shadow-black/20 hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col h-full cursor-pointer"
    >
      {/* 1. Rasm qismi va Floating tugmalar */}
      <div className="relative w-full aspect-4/3 bg-slate-950 overflow-hidden">
        <img
          src={imgError || !product.imageUrl ? placeholderImage : product.imageUrl}
          alt={product.title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        
        {/* Gradient shadow for contrast */}
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-black/20 opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Kategoriya burchak yorlig'i */}
        {product.categoryName && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-[11px] font-semibold text-indigo-300 tracking-wide uppercase">
            {product.categoryName}
          </div>
        )}

        {/* O'ng yuqori qismdagi tezkor harakatlar */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          {/* Wishlist tugmasi */}
          <button
            onClick={handleToggleFavorite}
            aria-label="Sevimlilarga qo'shish"
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-200 cursor-pointer ${
              isFavorite
                ? "bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/30 scale-105"
                : "bg-slate-900/70 hover:bg-slate-900 text-slate-300 hover:text-white border-slate-700/60"
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-white" : ""}`} />
          </button>

          {/* Quick View tugmasi */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            aria-label="Tezkor ko'rish"
            className="w-8 h-8 rounded-full bg-slate-900/70 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-700/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-md cursor-pointer"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Boshqaruv tugmalari (Tahrirlash / O'chirish) */}
        {canManage && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(product);
                }}
                className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-indigo-600 text-slate-300 hover:text-white border border-slate-700 text-xs transition-colors cursor-pointer"
                title="Tahrirlash"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(product.id);
                }}
                className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-rose-600 text-slate-300 hover:text-white border border-slate-700 text-xs transition-colors cursor-pointer"
                title="O'chirish"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* 2. Mahsulot matnli tavsifi */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Reyting va Zaxira holati */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-amber-400 font-medium">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{product.rating ? product.rating.toFixed(1) : "5.0"}</span>
            </div>

            {product.stock > 5 ? (
              <div className="flex items-center gap-1 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-medium">Omborda mavjud</span>
              </div>
            ) : product.stock > 0 ? (
              <div className="flex items-center gap-1 text-amber-400">
                <AlertTriangle className="w-3 h-3" />
                <span className="text-[11px] font-medium">{product.stock} ta qoldi</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-rose-400">
                <span className="text-[11px] font-medium">Tugagan</span>
              </div>
            )}
          </div>

          {/* Sarlavha */}
          <h3 className="font-bold text-slate-100 group-hover:text-indigo-400 transition-colors text-sm sm:text-base line-clamp-1 leading-snug">
            {product.title}
          </h3>

          {/* Qisqa tavsif */}
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {product.content}
          </p>
        </div>

        {/* 3. Narx va Savatga qo'shish */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div>
            <span className="text-xs text-slate-500 block">Narxi:</span>
            <span className="text-base sm:text-lg font-extrabold text-white tracking-tight">
              {formattedPrice}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`relative flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              isAdded
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/25"
                : product.stock <= 0
                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                : "bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-500/20 active:scale-95"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Qo'shildi</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Savatga</span>
              </>
            )}
          </button>
        </div>

      </div>
    </motion.div>
  );
};
