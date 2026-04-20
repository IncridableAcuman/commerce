import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UseProductContext } from "../context/ProductProvider";

const ProductDetails = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const { addToCart,fetchProduct,product } = UseProductContext();

  useEffect(() => {
    fetchProduct(id);
  }, [fetchProduct, id]);

  if (!product) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-2xl shadow p-6 grid md:grid-cols-2 gap-6">
        {/* Image */}
        <div className="w-full h-100 flex items-center justify-center bg-gray-50 rounded-xl">
          <img
            src={`http://localhost:8080${product.image}`}
            alt={product.title}
            className="h-full object-contain"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-3">{product.title}</h1>

            <p className="text-gray-500 mb-4">{product.description}</p>

            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">Category:</span>{" "}
                {product.category}
              </p>
              <p>
                <span className="font-semibold">Size:</span> {product.size}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    product.status === "ACTIVE"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {product.status}
                </span>
              </p>
            </div>
          </div>

          {/* Price + Button */}
          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4">${product.price}</h2>
            <div className="flex items-center justify-center gap-3 mb-4">
              <button
                className="bg-gray-200 px-2 py-1 border border-gray-300 rounded-md shadow cursor-pointer"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
              <button className="text-lg">{quantity}</button>
              <button
                className="bg-gray-200 px-2 py-1 border border-gray-300 rounded-md shadow cursor-pointer"
                onClick={() => {
                  if (quantity > 0) {
                    setQuantity(quantity - 1);
                  }
                }}
              >
                -
              </button>
            </div>
            <button
              onClick={()=>addToCart(id,quantity)}
              className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
