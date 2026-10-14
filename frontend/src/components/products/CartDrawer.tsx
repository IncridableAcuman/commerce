import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Minus, 
  Plus, 
  ArrowRight, 
  ShieldCheck,
  PackageCheck
} from "lucide-react";
import { useCartStore } from "../../stores/cartStore";
import { toast } from "react-toastify";

export const CartDrawer = () => {
  const { 
    items, 
    isCartOpen, 
    closeCart, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    getSubtotal, 
    getTotalItems 
  } = useCartStore();

  const subtotal = getSubtotal();
  const totalCount = getTotalItems();

  const formattedSubtotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(subtotal);

  const handleCheckout = () => {
    toast.success("Buyurtmangiz qabul qilindi! Tez orada operatorlarimiz bog'lanishadi.", {
      icon: <PackageCheck className="w-5 h-5 text-emerald-400" />,
      autoClose: 4000,
    });
    clearCart();
    closeCart();
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Orqa qoraytma (Backdrop) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            {/* O'ng panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Savat</h3>
                    <p className="text-xs text-slate-400">{totalCount} ta mahsulot</p>
                  </div>
                </div>

                <button
                  onClick={closeCart}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Savat ichidagi mahsulotlar ro'yxati */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                    <div className="w-20 h-20 rounded-3xl bg-slate-800/60 border border-slate-800 flex items-center justify-center text-slate-500">
                      <ShoppingBag className="w-10 h-10" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-semibold text-white">Savatingiz hozircha bo'sh</h4>
                      <p className="text-xs text-slate-400 max-w-xs">
                        Bizning katalogimizdan o'zingizga yoqqan mahsulotlarni tanlang va savatga qo'shing.
                      </p>
                    </div>
                    <button
                      onClick={closeCart}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                    >
                      Xarid qilishni boshlash
                    </button>
                  </div>
                ) : (
                  items.map(({ product, quantity }) => {
                    const itemTotal = new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(product.price * quantity);

                    return (
                      <motion.div
                        layout
                        key={product.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex gap-4 p-3 bg-slate-850/60 border border-slate-800/80 rounded-2xl hover:border-slate-700 transition-colors"
                      >
                        {/* Kichik rasm */}
                        <div className="w-20 h-20 rounded-xl bg-slate-950 overflow-hidden shrink-0 border border-slate-800">
                          <img
                            src={product.imageUrl || "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=400&q=80"}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Ma'lumotlar */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h5 className="text-xs sm:text-sm font-semibold text-white line-clamp-1">
                                {product.title}
                              </h5>
                              <button
                                onClick={() => removeItem(product.id)}
                                className="text-slate-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                                title="O'chirish"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <span className="text-[11px] text-slate-400">
                              {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(product.price)} / dona
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            {/* Stepper */}
                            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
                              <button
                                onClick={() => updateQuantity(product.id, quantity - 1)}
                                className="w-6 h-6 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-7 text-center text-xs font-bold text-white">
                                {quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(product.id, quantity + 1)}
                                disabled={quantity >= (product.stock || 99)}
                                className="w-6 h-6 flex items-center justify-center text-slate-300 hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Umumiy narx */}
                            <span className="text-sm font-bold text-indigo-400">
                              {itemTotal}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {/* Footer va Checkout */}
              {items.length > 0 && (
                <div className="p-6 border-t border-slate-800 bg-slate-900/95 space-y-4">
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Mahsulotlar qiymati</span>
                      <span className="text-white font-medium">{formattedSubtotal}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Yetkazib berish</span>
                      <span className="text-emerald-400 font-medium">Bepul (0.00$)</span>
                    </div>
                    <div className="border-t border-slate-800 pt-2 flex justify-between text-sm sm:text-base font-bold text-white">
                      <span>Jami to'lov:</span>
                      <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400 font-extrabold text-lg">
                        {formattedSubtotal}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={handleCheckout}
                      className="w-full py-3.5 rounded-xl bg-linear-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <span>Buyurtmani rasmiylashtirish</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={clearCart}
                      className="w-full py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      Savatni tozalash
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Xavfsiz va kafolatlangan to'lov tizimi</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
