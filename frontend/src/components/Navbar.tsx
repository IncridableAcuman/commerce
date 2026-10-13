import { useState, useRef, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Heart, 
  User, 
  ChevronDown, 
  Menu, 
  X, 
  LogOut, 
  Settings, 
  Package, 
  ShoppingBasket,
  LogIn 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Dropdown tashqarisiga bosilganda yopish uchun refs
  const categoryRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = [
    { name: "Elektronika", href: "/category/electronics" },
    { name: "Kiyim-kechak", href: "/category/clothing" },
    { name: "Aksessuarlar", href: "/category/accessories" },
    { name: "Uy uchun jihozlar", href: "/category/home" },
    { name: "Sport va Ochiq havo", href: "/category/sports" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* 1. Logo va Brend */}
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-wide text-white">
              Shop<span className="text-indigo-400">Luxe</span>
            </span>
          </a>

          {/* Desktop Kategoriyalar Dropdown menyusi */}
          <div className="hidden lg:relative lg:block" ref={categoryRef}>
            <button
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800/60 border border-slate-700/60 px-4 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              <span>Kategoriyalar</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCategoryDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {isCategoryDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl shadow-black/40 overflow-hidden py-2 z-50"
                >
                  {categories.map((cat, index) => (
                    <a
                      key={index}
                      href={cat.href}
                      className="block px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                    >
                      {cat.name}
                    </a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 2. Qidiruv qatori (Search Bar) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Mahsulotlarni qidirish..."
              className="w-full bg-slate-800/50 border border-slate-700/60 pl-11 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </div>

        {/* 3. O'ng qism: Sevimlilar, Savat va Foydalanuvchi */}
        <div className="flex items-center gap-3">
          {/* Sevimlilar (Wishlist) */}
          <a
            href="/wishlist"
            className="relative p-2.5 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition-all"
            title="Sevimlilar"
          >
            <Heart className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-pink-500 text-[10px] font-bold text-white flex items-center justify-center rounded-full">
              2
            </span>
          </a>

          {/* Savat (Cart) */}
          <a
            href="/cart"
            className="relative p-2.5 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition-all"
            title="Savat"
          >
            <ShoppingBasket className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-indigo-500 text-[10px] font-bold text-white flex items-center justify-center rounded-full">
              4
            </span>
          </a>

          {/* Foydalanuvchi profili yoki Kirish tugmasi */}
          {isAuthenticated ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pl-2 bg-slate-800/60 border border-slate-700/60 rounded-xl hover:border-indigo-500/50 transition-all cursor-pointer"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullName || "User"}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                    {user?.fullName ? user.fullName[0].toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                )}
                <span className="hidden sm:inline text-xs font-medium text-slate-300 max-w-[100px] truncate">
                  {user?.fullName || user?.username || "Profil"}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isProfileDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isProfileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl shadow-black/40 overflow-hidden py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b border-slate-800 mb-1">
                      <p className="text-xs text-slate-400">Xush kelibsiz,</p>
                      <p className="text-sm font-semibold text-white truncate">{user?.fullName || user?.username || "Foydalanuvchi"}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                    </div>

                    <a href="/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors">
                      <User className="w-4 h-4 text-indigo-400" />
                      <span>Profil</span>
                    </a>
                    <a href="/orders" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors">
                      <Package className="w-4 h-4 text-sky-400" />
                      <span>Buyurtmalarim</span>
                    </a>
                    <a href="/settings" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors">
                      <Settings className="w-4 h-4 text-purple-400" />
                      <span>Sozlamalar</span>
                    </a>

                    <div className="border-t border-slate-800 my-1" />

                    <button 
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Chiqish</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <a
              href="/auth"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-medium transition-all shadow-md shadow-indigo-500/20"
            >
              <LogIn className="w-4 h-4" />
              <span>Kirish</span>
            </a>
          )}

          {/* Mobil menyu tugmasi */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2.5 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition-all"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobil menyu va qidiruv */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 py-5 space-y-4"
          >
            {/* Mobil qidiruv */}
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Mahsulotlarni qidirish..."
                className="w-full bg-slate-900 border border-slate-800 pl-11 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500"
              />
            </div>

            {/* Mobil kategoriyalar ro'yxati */}
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 pb-1">Kategoriyalar</p>
              {categories.map((cat, index) => (
                <a
                  key={index}
                  href={cat.href}
                  className="block px-3 py-2 text-sm text-slate-300 hover:bg-slate-900 rounded-lg transition-colors"
                >
                  {cat.name}
                </a>
              ))}
            </div>

            {/* Mobil foydalanuvchi holati */}
            <div className="pt-3 border-t border-slate-800">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="px-3 py-1">
                    <p className="text-xs text-slate-400">Tizimga kirgan:</p>
                    <p className="text-sm font-semibold text-white">{user?.fullName || user?.username}</p>
                    <p className="text-xs text-slate-400">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Chiqish</span>
                  </button>
                </div>
              ) : (
                <a
                  href="/auth"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Kirish / Ro'yxatdan o'tish</span>
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;