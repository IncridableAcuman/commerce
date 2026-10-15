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
  ShoppingBasket,
  LogIn,
  Package,
  Truck,
  ShieldCheck,
  BarChart3
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useCartStore } from '../stores/cartStore';
import { useWishlistStore } from '../stores/wishlistStore';
import { useProductStore } from '../stores/productStore';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getTotalItems, toggleCart } = useCartStore();
  const { wishlist } = useWishlistStore();
  const { 
    categories, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery 
  } = useProductStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [navSearch, setNavSearch] = useState(searchQuery);

  const totalCartCount = getTotalItems();
  const totalWishlistCount = wishlist.length;

  const categoryRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNavSearch(searchQuery);
  }, [searchQuery]);

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(navSearch);
    navigate("/");
  };

  const handleCategoryClick = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setIsCategoryDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 font-sans transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* 1. Logo va Brend */}
        <div className="flex items-center gap-3 sm:gap-8">
          <Link to="/" onClick={() => setSelectedCategory(null)} className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-linear-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-extrabold tracking-wide text-slate-900 dark:text-white">
              Shop<span className="text-indigo-600 dark:text-indigo-400">Luxe</span>
            </span>
          </Link>

          {/* Desktop Kategoriyalar Dropdown menyusi */}
          <div className="hidden lg:relative lg:block" ref={categoryRef}>
            <button
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 px-4 py-2.5 rounded-xl transition-all cursor-pointer"
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
                  className="absolute top-full mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/40 overflow-hidden py-2 z-50"
                >
                  <button
                    onClick={() => handleCategoryClick(null)}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                      selectedCategory === null 
                        ? "text-indigo-600 dark:text-indigo-400 font-bold bg-slate-100 dark:bg-slate-800/80" 
                        : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80"
                    }`}
                  >
                    Barcha kategoriyalar
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.id)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                        selectedCategory === cat.id 
                          ? "text-indigo-600 dark:text-indigo-400 font-bold bg-slate-100 dark:bg-slate-800/80" 
                          : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 2. Qidiruv qatori (Search Bar) */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              placeholder="Mahsulotlarni qidirish..."
              className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 pl-11 pr-4 py-2.5 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </form>

        {/* 3. O'ng qism: Sevimlilar, Savat, Mavzu va Foydalanuvchi */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Admin / Manager Dashboard tugmasi */}
          {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
            <Link
              to="/admin"
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 border border-indigo-500/20 text-xs font-semibold transition-all cursor-pointer"
              title="Boshqaruv paneli"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
          )}

          {/* Buyurtmani kuzatish (Track) */}
          <Link
            to="/track"
            className="hidden sm:flex relative p-2.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-xl transition-all cursor-pointer"
            title="Buyurtmani kuzatish"
          >
            <Truck className="w-5 h-5" />
          </Link>

          {/* Sevimlilar (Wishlist) */}
          <Link
            to="/"
            className="relative p-2.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-xl transition-all cursor-pointer"
            title="Sevimlilar"
          >
            <Heart className="w-5 h-5" />
            {totalWishlistCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center rounded-full animate-scale">
                {totalWishlistCount}
              </span>
            )}
          </Link>

          {/* Savat (Cart) */}
          <button
            onClick={toggleCart}
            className="relative p-2.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-xl transition-all cursor-pointer"
            title="Savat"
          >
            <ShoppingBasket className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-indigo-600 dark:bg-indigo-500 text-[10px] font-bold text-white flex items-center justify-center rounded-full animate-bounce">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Mavzu almashtirgich (Theme Mode) */}
          <ThemeToggle />

          {/* Foydalanuvchi profili yoki Kirish tugmasi */}
          {isAuthenticated ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pl-2 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl hover:border-indigo-500/50 transition-all cursor-pointer"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullName || "User"}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                    {user?.fullName ? user.fullName[0].toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                )}
                <span className="hidden sm:inline text-xs font-medium text-slate-700 dark:text-slate-300 max-w-[100px] truncate">
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
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/40 overflow-hidden py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Xush kelibsiz,</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.fullName || user?.username || "Foydalanuvchi"}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                    </div>

                    <div className="px-4 py-1 text-xs text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider">
                      Rol: {user?.role || "USER"}
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                    <Link
                      to="/profile"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                    >
                      <User className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                      <span>Mening profilim</span>
                    </Link>

                    <Link
                      to="/my-orders"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                    >
                      <Package className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                      <span>Buyurtmalarim</span>
                    </Link>

                    {/* Agar foydalanuvchi ADMIN yoki MANAGER bo'lsa */}
                    {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
                      <>
                        <Link
                          to="/admin"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="w-full flex items-center justify-between px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <BarChart3 className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                            <span>Boshqaruv paneli</span>
                          </div>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                            user?.role === "ADMIN"
                              ? "bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/20"
                              : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
                          }`}>
                            {user?.role}
                          </span>
                        </Link>

                        {user?.role === "ADMIN" && (
                          <Link
                            to="/admin?tab=roles"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="w-full flex items-center justify-between px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <ShieldCheck className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                              <span>Rollar boshqaruvi</span>
                            </div>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/20">
                              ADMIN
                            </span>
                          </Link>
                        )}
                      </>
                    )}

                    <Link
                      to="/track"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                    >
                      <Truck className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                      <span>Buyurtmani kuzatish</span>
                    </Link>

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                    <button 
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Chiqish</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-medium transition-all shadow-md shadow-indigo-500/20"
            >
              <LogIn className="w-4 h-4" />
              <span>Kirish</span>
            </Link>
          )}

          {/* Mobil menyu tugmasi */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-xl transition-all"
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
            className="lg:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 py-5 space-y-4"
          >
            {/* Mobil qidiruv */}
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                placeholder="Mahsulotlarni qidirish..."
                className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 pl-11 pr-4 py-2.5 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-indigo-500"
              />
            </form>

            {/* Mobil kategoriyalar ro'yxati */}
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2 pb-1">Kategoriyalar</p>
              <button
                onClick={() => handleCategoryClick(null)}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                  selectedCategory === null 
                    ? "text-indigo-600 dark:text-indigo-400 font-bold bg-slate-100 dark:bg-slate-900" 
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
              >
                Barchasi
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                    selectedCategory === cat.id 
                      ? "text-indigo-600 dark:text-indigo-400 font-bold bg-slate-100 dark:bg-slate-900" 
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Mobil foydalanuvchi holati */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="px-3 py-1">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Tizimga kirgan:</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.fullName || user?.username}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                    <span>Mening profilim</span>
                  </Link>
                  <Link
                    to="/my-orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors"
                  >
                    <Package className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                    <span>Mening buyurtmalarim</span>
                  </Link>
                  {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
                    <>
                      <Link
                        to="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                          <span>Boshqaruv paneli</span>
                        </div>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                          user?.role === "ADMIN"
                            ? "bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/20"
                            : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
                        }`}>
                          {user?.role}
                        </span>
                      </Link>

                      {user?.role === "ADMIN" && (
                        <Link
                          to="/admin?tab=roles"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-between px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                            <span>Rollar boshqaruvi</span>
                          </div>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/20">
                            ADMIN
                          </span>
                        </Link>
                      )}
                    </>
                  )}

                  <Link
                    to="/track"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors"
                  >
                    <Truck className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    <span>Buyurtmani kuzatish</span>
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Chiqish</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Kirish / Ro'yxatdan o'tish</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;