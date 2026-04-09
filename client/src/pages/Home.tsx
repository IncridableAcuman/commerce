import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import type IProduct from "../interface/product.interface";
import { toast } from "react-toastify";
import axiosInstance from "../api/axios.instance";

const BASE_URL = "http://localhost:8080";

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    available: "bg-green-100 text-green-700",
    sold: "bg-red-100 text-red-700",
    reserved: "bg-yellow-100 text-yellow-700",
  };
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
        styles[status.toLowerCase()] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
};

const ProductCard = ({ product }: { product: IProduct }) => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col">
    <div className="relative aspect-square overflow-hidden bg-gray-50">
      <img
        src={`${BASE_URL}${product.image}`}
        alt={product.title}
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute top-2 right-2">
        <StatusBadge status={product.status} />
      </div>
    </div>

    <div className="p-4 flex flex-col gap-2 flex-1">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
          {product.title}
        </h3>
        <span className="text-sm font-bold text-indigo-600 whitespace-nowrap">
          ${product.price.toLocaleString()}
        </span>
      </div>

      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
        {product.description}
      </p>

      <div className="mt-auto pt-2 flex items-center gap-2 flex-wrap">
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
          {product.category}
        </span>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
          Size: {product.size}
        </span>
      </div>
    </div>
  </div>
);

const ProductSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
    <div className="aspect-square bg-gray-200" />
    <div className="p-4 flex flex-col gap-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-full" />
      <div className="h-3 bg-gray-200 rounded w-2/3" />
    </div>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/auth");
      return;
    }

    const fetchProducts = async () => {
      try {
        const { data } = await axiosInstance.get("/product/list");
        setProducts(data);
      } catch {
        toast.error("Mahsulotlarni olishda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mahsulotlar</h1>
          {!loading && (
            <p className="text-sm text-gray-500 mt-1">
              {products.length} ta mahsulot topildi
            </p>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <svg
              className="w-12 h-12 mb-4 opacity-40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4"
              />
            </svg>
            <p className="text-sm">Mahsulotlar topilmadi</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;