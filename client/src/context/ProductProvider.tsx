import React, { createContext, useContext, useEffect, useState } from "react";
import type ProductContextType from "../interface/productContext.interface";
import type IProduct from "../interface/product.interface";
import axiosInstance from "../api/axios.instance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProductContext = createContext<ProductContextType | null>(null);

export const ProductProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [product,setProduct]=useState<IProduct | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const addToCart = async (id: string | undefined, quantity: number) => {
    try {
      await axiosInstance.post(`/cart?productId=${id}&&quantity=${quantity}`);
      toast.success("Successfully added");
    } catch (error) {
      console.log(error);
      toast.error("Qo'shishda xatolik");
    }
  };

  useEffect(() => {
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

    const fetchProduct = async (id:string | undefined) => {
      try {
        const { data } = await axiosInstance.get(`/product/${id}`);
        setProduct(data);
      } catch (error) {
        console.error(error);
      }
    };


  return (
    <>
      <ProductContext.Provider
        value={{ products, setProducts, loading,product,setProduct, setLoading, addToCart,fetchProduct }}
      >
        {children}
      </ProductContext.Provider>
    </>
  );
};

export const UseProductContext = () => {
  const context = useContext(ProductContext);
  if (!context)
    throw new Error("Product context must be used within Product Provider");
  return context;
};
