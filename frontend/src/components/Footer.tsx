import { 
  ShoppingBag, 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  ShieldCheck,
  Truck,
  Headphones,
  CreditCard
} from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-sans border-t border-slate-200 dark:border-slate-800/80 pt-16 pb-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Yuqori qism: Afzalliklar banneri */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-slate-900 dark:text-white font-semibold text-sm">Tezkor yetkazish</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">O'zbekiston bo'ylab 1-3 kunda</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-slate-900 dark:text-white font-semibold text-sm">Xavfsiz to'lov</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">100% himoyalangan tranzaksiyalar</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-slate-900 dark:text-white font-semibold text-sm">24/7 Qo'llab-quvvatlash</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Har doim aloqadamiz</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-slate-900 dark:text-white font-semibold text-sm">Qulay qaytarish</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">10 kun ichida oson almashtirish</p>
            </div>
          </div>
        </div>

        {/* 2. Asosiy qism: Ma'lumotlar va havolalar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-slate-200 dark:border-slate-800/80">
          
          {/* Brend va Aloqa */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-wide text-slate-900 dark:text-white">
                Shop<span className="text-indigo-600 dark:text-indigo-400">Luxe</span>
              </span>
            </Link>
            
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed pr-6">
              ShopLuxe — eng so'nggi va sifatli mahsulotlarni qulay narxlarda taqdim etuvchi zamonaviy e-commerce platformasi. Ishonchingiz biz uchun muhim.
            </p>

            <div className="space-y-3 pt-1 text-sm">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Toshkent shahri, Yunusobod tumani</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <Phone className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>+998 (90) 123-45-67</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>support@shopluxe.uz</span>
              </div>
            </div>
          </div>

          {/* Tezkor havolalar */}
          <div className="space-y-4">
            <h3 className="text-slate-900 dark:text-white font-semibold text-sm tracking-wider uppercase">Sahifalar</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors">Bosh sahifa</Link></li>
              <li><Link to="/" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors">Barcha mahsulotlar</Link></li>
              <li><Link to="/track" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors">Buyurtmani kuzatish</Link></li>
              <li><Link to="/my-orders" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors">Mening buyurtmalarim</Link></li>
              <li><Link to="/profile" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors">Mening profilim</Link></li>
            </ul>
          </div>

          {/* Kategoriyalar */}
          <div className="space-y-4">
            <h3 className="text-slate-900 dark:text-white font-semibold text-sm tracking-wider uppercase">Xizmatlar</h3>
            <ul className="space-y-2.5 text-sm">
              <li><span className="text-slate-600 dark:text-slate-400">Elektronika</span></li>
              <li><span className="text-slate-600 dark:text-slate-400">Kiyim-kechak</span></li>
              <li><span className="text-slate-600 dark:text-slate-400">Aksessuarlar</span></li>
              <li><span className="text-slate-600 dark:text-slate-400">Uy uchun jihozlar</span></li>
              <li><span className="text-slate-600 dark:text-slate-400">Sport jihozlari</span></li>
            </ul>
          </div>

          {/* Yangiliklarga obuna bo'lish */}
          <div className="space-y-4">
            <h3 className="text-slate-900 dark:text-white font-semibold text-sm tracking-wider uppercase">Yangiliklarga obuna</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              Chegirmalar va yangi mahsulotlardan birinchi bo'lib xabardor bo'ling.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2.5">
              <input
                type="email"
                placeholder="Email manzilingiz"
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-indigo-500 transition-all"
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer text-sm shadow-lg shadow-indigo-600/20"
              >
                <span>Obuna bo'lish</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

        {/* 3. Pastki qism: Mualliflik huquqi va ijtimoiy tarmoqlar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© 2026 ShopLuxe. Barcha huquqlar himoyalangan.</p>

          {/* Ijtimoiy tarmoqlar */}
          <div className="flex items-center gap-3">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:border-indigo-500 transition-all">
              <FaFacebook className="w-4 h-4" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:border-indigo-500 transition-all">
              <FaInstagram className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:border-indigo-500 transition-all">
              <FaTwitter className="w-4 h-4" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:border-indigo-500 transition-all">
              <FaYoutube className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;