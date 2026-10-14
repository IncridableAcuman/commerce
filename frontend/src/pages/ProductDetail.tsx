import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Star, 
  ShoppingBag, 
  Heart, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Minus, 
  Plus, 
  Share2, 
  Check, 
  CheckCircle2, 
  AlertTriangle 
} from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CartDrawer } from "../components/products/CartDrawer";
import { useProductStore } from "../stores/productStore";
import { useCartStore } from "../stores/cartStore";
import { useWishlistStore } from "../stores/wishlistStore";
import type { Product } from "../interfaces/product.interface";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById, products, fetchProducts } = useProductStore();
  const { addItem, openCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      const data = await getProductById(Number(id));
      setProduct(data);
      setLoading(false);
    };
    load();
    window.scrollTo(0, 0);
  }, [id, getProductById]);

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full animate-pulse space-y-8">
          <div className="w-32 h-6 bg-slate-800 rounded-md" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="aspect-square bg-slate-800/60 rounded-3xl" />
            <div className="space-y-4">
              <div className="w-48 h-8 bg-slate-800 rounded-md" />
              <div className="w-full h-12 bg-slate-800 rounded-md" />
              <div className="w-32 h-10 bg-slate-800 rounded-md" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">Mahsulot topilmadi</h2>
          <p className="text-slate-400">Ushbu mahsulot mavjud emas yoki o'chirilgan bo'lishi mumkin.</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors cursor-pointer"
          >
            Bosh sahifaga qaytish
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const isFavorite = isInWishlist(product.id);
  const maxStock = product.stock || 1;
  const relatedProducts = products
    .filter((p) => p.id !== product.id && (!product.categoryId || p.categoryId === product.categoryId))
    .slice(0, 4);

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.price);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
    toast.success(`${product.title} (${quantity} dona) savatga qo'shildi!`);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    openCart();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.info("Havola buferga nusxalandi!");
    setTimeout(() => setCopied(false), 2000);
  };

  const placeholderImage = "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Orqaga navigatsiya va Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 mb-8">
          <Link to="/" className="hover:text-indigo-400 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            <span>Bosh sahifa</span>
          </Link>
          <span>/</span>
          {product.categoryName && (
            <>
              <span className="text-slate-400">{product.categoryName}</span>
              <span>/</span>
            </>
          )}
          <span className="text-white font-medium truncate max-w-xs">{product.title}</span>
        </div>

        {/* Asosiy 2 ustunli blok */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          
          {/* Chap ustun: Rasm va kafolatlar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="w-full aspect-square bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative flex items-center justify-center"
            >
              <img
                src={product.imageUrl || placeholderImage}
                alt={product.title}
                className="w-full h-full object-cover object-center"
              />
              {product.categoryName && (
                <span className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700 text-xs font-semibold text-indigo-300">
                  {product.categoryName}
                </span>
              )}
            </motion.div>

            {/* Xizmat va kafolatlar */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col items-center text-center space-y-1.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h5 className="text-xs font-bold text-white">1 Yillik Kafolat</h5>
                <p className="text-[10px] text-slate-400">To'liq xizmat ko'rsatish</p>
              </div>

              <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col items-center text-center space-y-1.5">
                <Truck className="w-5 h-5 text-indigo-400" />
                <h5 className="text-xs font-bold text-white">Tezkor Kuryer</h5>
                <p className="text-[10px] text-slate-400">24-48 soat ichida</p>
              </div>

              <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col items-center text-center space-y-1.5">
                <RotateCcw className="w-5 h-5 text-purple-400" />
                <h5 className="text-xs font-bold text-white">14 Kun Qaytarish</h5>
                <p className="text-[10px] text-slate-400">Muammosiz almashtirish</p>
              </div>
            </div>
          </div>

          {/* O'ng ustun: Mahsulot tafsilotlari va harakatlar */}
          <div className="flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              
              {/* Reyting va Zaxira */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="font-bold">{product.rating ? product.rating.toFixed(1) : "5.0"}</span>
                  <span className="text-slate-400 text-xs">/ 5.0 (Mijozlar bahosi)</span>
                </div>

                {product.stock > 0 ? (
                  <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Omborda: {product.stock} ta mavjud</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-xl text-xs font-semibold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Hozirda sotuvda tugagan</span>
                  </div>
                )}
              </div>

              {/* Sarlavha */}
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
                {product.title}
              </h1>

              {/* Narx */}
              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-baseline gap-4">
                <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400">
                  {formattedPrice}
                </span>
                <span className="text-xs text-slate-400">Yetkazib berish xarajati ichiga olingan</span>
              </div>

              {/* Tavsif bloki */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Mahsulot tavsifi
                </h3>
                <div className="p-5 bg-slate-900/40 border border-slate-800/80 rounded-2xl text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {product.content}
                </div>
              </div>

            </div>

            {/* Pastki harakat tugmalari bloki */}
            <div className="space-y-4 pt-6 border-t border-slate-800">
              <div className="flex items-center gap-4">
                
                {/* Stepper */}
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1.5">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-base text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
                    disabled={quantity >= maxStock}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Wishlist & Share */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                      isFavorite
                        ? "bg-rose-500/20 border-rose-500/40 text-rose-400"
                        : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
                    }`}
                    title="Sevimlilarga qo'shish"
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? "fill-rose-400" : ""}`} />
                  </button>

                  <button
                    onClick={handleShare}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Havolani ulashish"
                  >
                    {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
                  </button>
                </div>

              </div>

              {/* Asosiy sotib olish tugmalari */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className={`py-4 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isAdded
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                      : product.stock <= 0
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Savatga qo'shildi!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>Savatga qo'shish</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="py-4 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-purple-500/20 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-40"
                >
                  Hozir xarid qilish
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* O'xshash mahsulotlar */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-10 border-t border-slate-800">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">
              O'xshash mahsulotlar
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => navigate(`/products/${rel.id}`)}
                  className="group bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-2xl overflow-hidden p-3 transition-all cursor-pointer"
                >
                  <div className="aspect-4/3 rounded-xl overflow-hidden bg-slate-950 mb-3">
                    <img
                      src={rel.imageUrl || placeholderImage}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                    {rel.title}
                  </h4>
                  <p className="text-xs font-semibold text-indigo-400 mt-1">
                    {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(rel.price)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
