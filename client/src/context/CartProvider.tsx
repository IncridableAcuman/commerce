import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type ICart from "../interface/cart.interface";
import type CartContextType from "../interface/cartContext.interface";
import { toast } from "react-toastify";
import axiosInstance from "../api/axios.instance";

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<ICart | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const handleDeleteItem = async (id: number) => {
    try {
      const { data } = await axiosInstance.delete(`/cart?productId=${id}`);
      toast.success("Successfully deleted");
      setCart(data);
    } catch (error) {
      console.log(error);
      toast.error("Mahsulotni o'chirishda xatolik");
    }
  };

  useEffect(() => {
    const fetChCart = async () => {
      try {
        const { data } = await axiosInstance.get("/cart");
        setCart(data);
      } catch (error) {
        console.log(error);
        toast.error("Xatolik yuz berdi");
      }
    };
    fetChCart();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <CartContext.Provider value={{ cart, setCart, handleDeleteItem, openMenuId,setOpenMenuId,menuRef}}>
        {children}
      </CartContext.Provider>
    </>
  );
};

export const UseCartContext = () => {
  const context = useContext(CartContext);
  if (!context)
    throw new Error("Cart context must be used within Cart provider");
  return context;
};
