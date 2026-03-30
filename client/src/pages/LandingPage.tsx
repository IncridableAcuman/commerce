import { useState, useEffect } from "react";

const NAV_LINKS = ["Katalog", "Yangiliklar", "Aksiyalar", "Brендлар", "Blog"];

const HERO_SLIDES = [
  {
    tag: "Yangi kolleksiya",
    title: "Bahor\nMavsum\n2025",
    sub: "Eng zamonaviy uslublar — eng qulay narxlarda",
    cta: "Ko'rish",
    bg: "from-[#0a0a0a] via-[#1a0a00] to-[#0a0a0a]",
    accent: "#FF5E14",
    img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700&q=80",
  },
  {
    tag: "Premium Brand",
    title: "Stil\nHar\nDoim",
    sub: "Dunyoning eng yaxshi brendlari bir joyda",
    cta: "Kashf etish",
    bg: "from-[#050510] via-[#0a0520] to-[#050510]",
    accent: "#7C5CFC",
    img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=700&q=80",
  },
];

const CATEGORIES = [
  { name: "Erkaklar", count: "1,240+", emoji: "👔", color: "#FF5E14" },
  { name: "Ayollar", count: "2,180+", emoji: "👗", color: "#FC5CA3" },
  { name: "Bolalar", count: "840+", emoji: "🧸", color: "#5CE8FC" },
  { name: "Sport", count: "620+", emoji: "⚽", color: "#5CFC7A" },
  { name: "Elektronika", count: "390+", emoji: "💻", color: "#FCC25C" },
  { name: "Uy-joy", count: "510+", emoji: "🏠", color: "#FC7A5C" },
];

const PRODUCTS: {
  id: number;
  name: string;
  brand: string;
  price: string;
  oldPrice?: string;
  badge?: string;
  img: string;
  rating: number;
  reviews: number;
}[] = [
  {
    id: 1,
    name: "Air Max Pulse",
    brand: "Nike",
    price: "1,290,000",
    oldPrice: "1,590,000",
    badge: "−18%",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
    rating: 4.8,
    reviews: 234,
  },
  {
    id: 2,
    name: "Slim Fit Ko'ylak",
    brand: "Zara",
    price: "389,000",
    img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80",
    rating: 4.6,
    reviews: 89,
  },
  {
    id: 3,
    name: "Leather Jacket",
    brand: "H&M",
    price: "890,000",
    oldPrice: "1,100,000",
    badge: "Hit",
    img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80",
    rating: 4.9,
    reviews: 412,
  },
  {
    id: 4,
    name: "Denim Jeans",
    brand: "Levi's",
    price: "650,000",
    img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80",
    rating: 4.7,
    reviews: 167,
  },
];

const STATS = [
  { value: "2M+", label: "Foydalanuvchi" },
  { value: "50K+", label: "Mahsulot" },
  { value: "500+", label: "Brend" },
  { value: "4.9★", label: "O'rtacha baho" },
];

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <svg key={s} className="w-3 h-3" viewBox="0 0 12 12">
        <polygon
          points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5"
          fill={s <= Math.round(rating) ? "#FF5E14" : "#333"}
        />
      </svg>
    ))}
  </div>
);

export default function LandingPage() {
  const [slide, setSlide] = useState(0);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount] = useState(3);

  useEffect(() => {
    const t = setInterval(() => setSlide((p) => (p + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const current = HERO_SLIDES[slide];

  const toggleWish = (id: number) =>
    setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <div
      className="min-h-screen text-white overflow-x-hidden"
      style={{
        background: "#080808",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
        .display-font { font-family: 'Syne', sans-serif; }
        .clip-diagonal { clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%); }
        .hover-lift { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .hover-lift:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
        .slide-enter { animation: slideIn 0.6s cubic-bezier(0.25,0.46,0.45,0.94) forwards; }
        @keyframes slideIn { from { opacity:0; transform:translateX(30px); } to { opacity:1; transform:translateX(0); } }
        .fade-up { animation: fadeUp 0.7s ease forwards; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .glow-btn:hover { box-shadow: 0 0 30px rgba(255,94,20,0.5); }
        .marquee-track { display:flex; animation: marquee 20s linear infinite; }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .line-clamp-2 { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
      `}</style>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4"
        style={{ background: "rgba(8,8,8,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="display-font text-2xl font-bold tracking-tight">
          <span style={{ color: "#FF5E14" }}>NOVA</span>SHOP
        </div>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a key={link} href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors tracking-wide">
              {link}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="hidden md:flex items-center gap-2 bg-white/5 hover:bg-white/10 transition px-4 py-2 rounded-full text-sm text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            Qidirish...
          </button>

          <button className="relative p-2">
            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>

          <button className="relative p-2">
            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center" style={{ background: "#FF5E14" }}>{cartCount}</span>
          </button>

          <button className="hidden md:block px-5 py-2 rounded-full text-sm font-semibold transition glow-btn" style={{ background: "#FF5E14" }}>
            Kirish
          </button>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col pt-20 px-6 gap-6"
          style={{ background: "rgba(8,8,8,0.97)", backdropFilter: "blur(30px)" }}>
          {NAV_LINKS.map((l) => (
            <a key={l} href="#" className="display-font text-3xl font-bold text-gray-200 hover:text-white" onClick={() => setMenuOpen(false)}>
              {l}
            </a>
          ))}
          <button className="mt-4 px-6 py-3 rounded-full font-semibold text-lg w-fit" style={{ background: "#FF5E14" }}>
            Kirish
          </button>
        </div>
      )}

      {/* HERO */}
      <section className={`relative min-h-screen flex items-center bg-linear-to-br ${current.bg} clip-diagonal pt-20 overflow-hidden`}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,94,20,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(124,92,252,0.2) 0%, transparent 50%)" }} />
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 41px)" }} />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 slide-enter" key={slide}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 tracking-widest uppercase"
              style={{ background: `${current.accent}22`, border: `1px solid ${current.accent}44`, color: current.accent }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: current.accent }} />
              {current.tag}
            </div>
            <h1 className="display-font text-7xl md:text-9xl font-black leading-none tracking-tighter mb-6 whitespace-pre-line">
              {current.title.split("\n").map((line, i) => (
                <span key={i} className="block">
                  {i === 1 ? <span style={{ color: current.accent }}>{line}</span> : line}
                </span>
              ))}
            </h1>
            <p className="text-gray-400 text-lg max-w-md mb-8 leading-relaxed">{current.sub}</p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 rounded-full font-semibold text-base transition-all glow-btn"
                style={{ background: current.accent }}>
                {current.cta} →
              </button>
              <button className="px-8 py-4 rounded-full font-semibold text-base text-gray-300 hover:text-white transition"
                style={{ border: "1px solid rgba(255,255,255,0.15)" }}>
                Batafsil
              </button>
            </div>
          </div>

          <div className="flex-1 flex justify-center items-center relative">
            <div className="relative w-72 h-80 md:w-96 md:h-125">
              <div className="absolute inset-0 rounded-3xl opacity-40 blur-xl"
                style={{ background: `radial-gradient(circle, ${current.accent}66 0%, transparent 70%)` }} />
              <img src={current.img} alt="Hero" className="relative z-10 w-full h-full object-cover rounded-3xl"
                style={{ boxShadow: `0 40px 80px rgba(0,0,0,0.6)` }} />
              <div className="absolute -bottom-4 -left-4 z-20 px-4 py-3 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div className="text-xs text-gray-400">Bugunga chegirma</div>
                <div className="display-font text-xl font-bold" style={{ color: current.accent }}>−30%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              className="rounded-full transition-all"
              style={{ width: i === slide ? "32px" : "8px", height: "8px", background: i === slide ? current.accent : "rgba(255,255,255,0.2)" }} />
          ))}
        </div>
      </section>

      {/* STATS MARQUEE */}
      <div className="py-4 overflow-hidden" style={{ background: "#FF5E14" }}>
        <div className="marquee-track gap-16">
          {[...STATS, ...STATS, ...STATS, ...STATS].map((s, i) => (
            <div key={i} className="flex items-center gap-3 whitespace-nowrap px-6">
              <span className="display-font text-2xl font-black text-black">{s.value}</span>
              <span className="text-sm font-medium text-black/70">{s.label}</span>
              <span className="text-black/40 text-xl">◆</span>
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs tracking-widest text-gray-500 uppercase mb-2">Assortiment</p>
            <h2 className="display-font text-4xl md:text-5xl font-black">Kategoriyalar</h2>
          </div>
          <a href="#" className="text-sm text-gray-400 hover:text-white transition">Barchasi →</a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <button key={cat.name}
              className="group relative p-6 rounded-2xl flex flex-col items-center gap-3 hover-lift text-center"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="text-4xl group-hover:scale-110 transition-transform">{cat.emoji}</div>
              <div>
                <div className="font-semibold text-sm">{cat.name}</div>
                <div className="text-xs mt-0.5" style={{ color: cat.color }}>{cat.count}</div>
              </div>
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `${cat.color}08`, border: `1px solid ${cat.color}33` }} />
            </button>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs tracking-widest text-gray-500 uppercase mb-2">Tanlangan</p>
            <h2 className="display-font text-4xl md:text-5xl font-black">Trend Mahsulotlar</h2>
          </div>
          <div className="hidden md:flex gap-2">
            {["Barchasi", "Erkaklar", "Ayollar", "Sport"].map((tab, i) => (
              <button key={tab}
                className="px-4 py-2 rounded-full text-sm font-medium transition"
                style={i === 0 ? { background: "#FF5E14", color: "#fff" } : { background: "rgba(255,255,255,0.05)", color: "#888" }}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {PRODUCTS.map((p) => (
            <div key={p.id} className="group relative hover-lift rounded-2xl overflow-hidden"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="relative overflow-hidden aspect-3/4">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {p.badge && (
                  <span className="absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-bold text-white"
                    style={{ background: p.badge.startsWith("−") ? "#FF5E14" : "#7C5CFC" }}>
                    {p.badge}
                  </span>
                )}
                <button onClick={() => toggleWish(p.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all"
                  style={{ background: wishlist.includes(p.id) ? "#FF5E14" : "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)" }}>
                  <svg className="w-4 h-4" fill={wishlist.includes(p.id) ? "white" : "none"} stroke="white" viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
                <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                  <button className="w-full py-2.5 rounded-xl text-sm font-semibold transition"
                    style={{ background: "#FF5E14" }}>
                    Savatga qo'shish
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="text-xs text-gray-500 mb-1">{p.brand}</div>
                <div className="font-semibold text-sm line-clamp-2 mb-2">{p.name}</div>
                <div className="flex items-center gap-2 mb-2">
                  <Stars rating={p.rating} />
                  <span className="text-xs text-gray-500">({p.reviews})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base">{p.price} so'm</span>
                  {p.oldPrice && <span className="text-xs text-gray-500 line-through">{p.oldPrice}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROMO BANNER */}
      <section className="py-8 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8"
          style={{ background: "linear-gradient(135deg, #FF5E14 0%, #ff2d55 100%)" }}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 80% 50%, white 0%, transparent 60%)" }} />
          <div className="relative z-10">
            <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-2">Maxsus taklif</p>
            <h2 className="display-font text-4xl md:text-6xl font-black text-white leading-tight">
              Birinchi buyurtmada<br /><span className="underline decoration-wavy decoration-white/40">20% chegirma!</span>
            </h2>
          </div>
          <div className="relative z-10 flex flex-col items-center md:items-end gap-4">
            <div className="text-white/80 text-sm text-center md:text-right max-w-xs">
              Ro'yxatdan o'ting va birinchi xaridingizda chegirma oling
            </div>
            <button className="px-8 py-4 rounded-full font-bold text-base bg-white hover:bg-gray-100 transition"
              style={{ color: "#FF5E14" }}>
              Hoziroq boshlash →
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: "🚚", title: "Tez yetkazib berish", sub: "24 soat ichida" },
            { icon: "↩️", title: "Qaytarish kafolati", sub: "30 kun ichida" },
            { icon: "🔒", title: "Xavfsiz to'lov", sub: "SSL himoyasi" },
            { icon: "💬", title: "24/7 Qo'llab-quvvatlash", sub: "Doim yordamga tayyormiz" },
          ].map((f) => (
            <div key={f.title} className="p-6 rounded-2xl text-center"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="text-3xl mb-3">{f.icon}</div>
              <div className="font-semibold text-sm mb-1">{f.title}</div>
              <div className="text-xs text-gray-500">{f.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t px-6 md:px-12 py-12" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="display-font text-2xl font-bold">
            <span style={{ color: "#FF5E14" }}>NOVA</span>SHOP
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            {["Maxfiylik", "Shartlar", "Aloqa", "FAQ"].map((l) => (
              <a key={l} href="#" className="hover:text-white transition">{l}</a>
            ))}
          </div>
          <div className="text-sm text-gray-600">© 2025 NovaShop. Barcha huquqlar himoyalangan.</div>
        </div>
      </footer>
    </div>
  );
}