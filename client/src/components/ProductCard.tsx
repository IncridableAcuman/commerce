import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import type IProduct from "../interface/product.interface";

const BASE_URL = "http://localhost:8080";

const ProductCard = ({ product }: { product: IProduct }) => {
  const navigate = useNavigate();
  return (
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col">
    <div className="relative aspect-square overflow-hidden bg-gray-50">
      <img
        src={`${BASE_URL}${product.image}`}
        alt={product.title}
        onClick={()=> navigate(`/details/${product.id}`)}
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
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
}
export default ProductCard;