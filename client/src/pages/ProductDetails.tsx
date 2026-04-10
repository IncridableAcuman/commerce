import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../api/axios.instance";
import type IProduct from "../interface/product.interface";
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Share2,
  Tag,
  Ruler,
  CheckCircle2,
  Clock,
  XCircle,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Plus,
  Minus,
} from "lucide-react";

const statusConfig: Record<string, { icon: JSX.Element; label: string; color: string; bg: string }> = {
  available: {
    icon: <CheckCircle2 size={14} />,
    label: "Mavjud",
    color: "text-emerald-600",
    bg: "bg-emerald-50 border-emerald-200",
  },
  out_of_stock: {
    icon: <XCircle size={14} />,
    label: "Tugagan",
    color: "text-red-500",
    bg: "bg-red-50 border-red-200",
  },
  coming_soon: {
    icon: <Clock size={14} />,
    label: "Tez kunda",
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
  },
};

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<IProduct>();
  const [loading, setLoading] = useState(true);
  const [wished, setWished] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"description" | "delivery" | "reviews">("description");
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(`/product/${params?.id}`);
        setProduct(data);
        setSelectedSize(data.size ?? "");
      } catch (error) {
        console.log(error);
        toast.error("Mahsulotni olishda xatolik yuz berdi");
        setProduct(MOCK);
        setSelectedSize(MOCK.size);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params?.id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.warning("Iltimos, o'lcham tanlang");
      return;
    }
    setInCart(true);
    toast.success(`${quantity} ta mahsulot savatga qo'shildi!`);
  };

  const status = statusConfig[product?.status ?? ""] ?? statusConfig["available"];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f7fb]">
        <div className="max-w-5xl mx-auto px-4 py-6 animate-pulse">
          <div className="h-8 w-24 bg-gray-200 rounded-lg mb-6" />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-200 rounded-3xl h-96" />
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/3" />
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-10 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Orqaga</span>
          </button>
          <span className="text-sm font-semibold text-gray-800 truncate max-w-xs">
            {product?.title}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Havola nusxalandi!");
              }}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all"
            >
              <Share2 size={16} />
            </button>
            <button
              onClick={() => setWished((p) => !p)}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
            >
              <Heart size={16} className={wished ? "fill-red-500 text-red-500" : ""} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-2 gap-8 items-start">

          {/* LEFT — Image */}
          <div className="space-y-3">
            <div className="relative rounded-3xl overflow-hidden bg-white shadow-sm aspect-square">
              {product?.image ? (
                <>
                  {!imgLoaded && (
                    <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                  )}
                  <img
                    src={`http://localhost:8080${product.image}`}
                    alt={product.title}
                    onLoad={() => setImgLoaded(true)}
                    className={`w-full h-full object-cover transition-opacity duration-500 ${
                      imgLoaded ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-teal-50 to-blue-50">
                  <Tag size={64} className="text-teal-200" />
                </div>
              )}
              {/* Status badge */}
              <div
                className={`absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${status.color} ${status.bg}`}
              >
                {status.icon}
                {status.label}
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: <Truck size={14} />, text: "Tez yetkazish" },
                { icon: <ShieldCheck size={14} />, text: "Kafolat" },
                { icon: <RotateCcw size={14} />, text: "14 kun qaytarish" },
              ].map((b) => (
                <div
                  key={b.text}
                  className="bg-white rounded-xl p-2.5 flex flex-col items-center gap-1 text-center shadow-sm"
                >
                  <span className="text-teal-500">{b.icon}</span>
                  <span className="text-[10px] text-gray-500 font-medium leading-tight">
                    {b.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Info */}
          <div className="space-y-5">
            {/* Category + rating */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold bg-blue-50 text-blue-500 px-3 py-1 rounded-full flex items-center gap-1">
                <Tag size={11} />
                {product?.category}
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={13}
                    className={s <= 4 ? "fill-amber-400 text-amber-400" : "text-gray-200"}
                  />
                ))}
                <span className="text-xs text-gray-400 ml-1">(24 ta sharh)</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              {product?.title}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-gray-900">
                {product?.price?.toLocaleString()}
              </span>
              <span className="text-base text-gray-400 font-medium">so'm</span>
            </div>

            {/* Size selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                  <Ruler size={14} className="text-gray-400" />
                  O'lcham tanlang
                </p>
                {selectedSize && (
                  <span className="text-xs text-teal-600 font-medium">
                    Tanlangan: {selectedSize}
                  </span>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`w-11 h-11 rounded-xl text-sm font-semibold border-2 transition-all duration-150 ${
                      selectedSize === s
                        ? "border-gray-900 bg-gray-900 text-white scale-105 shadow"
                        : "border-gray-200 bg-white text-gray-500 hover:border-gray-400"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Miqdor</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-xl border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-400 transition-all active:scale-95"
                >
                  <Minus size={15} />
                </button>
                <span className="text-lg font-bold text-gray-900 w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 rounded-xl border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-400 transition-all active:scale-95"
                >
                  <Plus size={15} />
                </button>
                <span className="text-sm text-gray-400 ml-1">
                  Jami:{" "}
                  <strong className="text-gray-700">
                    {((product?.price ?? 0) * quantity).toLocaleString()} so'm
                  </strong>
                </span>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={handleAddToCart}
                disabled={product?.status === "out_of_stock"}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 active:scale-95 ${
                  inCart
                    ? "bg-teal-500 text-white shadow-lg shadow-teal-200"
                    : product?.status === "out_of_stock"
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-900 text-white hover:bg-teal-600 shadow-lg shadow-gray-200"
                }`}
              >
                <ShoppingCart size={16} />
                {inCart ? "Savatga qo'shildi ✓" : "Savatga qo'shish"}
              </button>
              <button
                onClick={() => setWished((p) => !p)}
                className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all active:scale-95 ${
                  wished
                    ? "border-red-300 bg-red-50 text-red-500"
                    : "border-gray-200 bg-white text-gray-400 hover:border-red-200 hover:text-red-400"
                }`}
              >
                <Heart size={18} className={wished ? "fill-red-500" : ""} />
              </button>
            </div>

            {/* Tabs */}
            <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm">
              <div className="flex border-b border-gray-100">
                {(["description", "delivery", "reviews"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 text-xs font-semibold transition-colors ${
                      activeTab === tab
                        ? "text-gray-900 border-b-2 border-gray-900 bg-gray-50"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {tab === "description" ? "Tavsif" : tab === "delivery" ? "Yetkazish" : "Sharhlar"}
                  </button>
                ))}
              </div>
              <div className="p-4 text-sm text-gray-600 min-h-20">
                {activeTab === "description" && (
                  <p className="leading-relaxed">{product?.description || "Tavsif mavjud emas."}</p>
                )}
                {activeTab === "delivery" && (
                  <ul className="space-y-2">
                    {[
                      "📦 Standart yetkazish: 2–4 ish kuni",
                      "⚡ Tezkor yetkazish: 1 ish kuni (+15,000 so'm)",
                      "🚚 50,000 so'mdan yuqori buyurtmalarga bepul yetkazish",
                      "📍 Toshkent shahri ichida yetkazish mavjud",
                    ].map((item) => (
                      <li key={item} className="text-xs text-gray-500">{item}</li>
                    ))}
                  </ul>
                )}
                {activeTab === "reviews" && (
                  <div className="space-y-3">
                    {[
                      { name: "Aziz K.", rating: 5, text: "Juda yaxshi mahsulot, tavsiya qilaman!" },
                      { name: "Nilufar M.", rating: 4, text: "Sifati zo'r, yetkazish tez bo'ldi." },
                    ].map((r) => (
                      <div key={r.name} className="pb-3 border-b border-gray-50 last:border-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-gray-700">{r.name}</span>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} size={10} className={s <= r.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">{r.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

// Mock data (API ishlamasa ko'rish uchun)
const MOCK: IProduct = {
  id: 1,
  title: "Klassik Ko'ylak",
  description:
    "Yuqori sifatli paxta materialidan tayyorlangan, yoz faslida kiyishga qulay bo'lgan klassik uslubdagi ko'ylak. Nafis va zamonaviy dizayni bilan har qanday tadbirga mos keladi.",
  price: 89000,
  category: "Kiyim",
  size: "M",
  image: "",
  status: "available",
};