import React, { createContext, useContext, useEffect, useState } from "react";
import type ProductContextInterface from "../interface/productContext.interface";
import type ProductInterface from "../interface/productInterface";
import { toast } from "react-toastify";
import adminAxiosInstance from "../api/axiosInstance";

const ProductContext = createContext<ProductContextInterface | null>(null);

export const ProductProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [product, setProduct] = useState<ProductInterface | null>(null);
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [editProduct, setEditProduct] = useState<ProductInterface | null>(null);
  const [form, setForm] = useState<Partial<ProductInterface>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);

  const closeEdit = () => {
    setEditProduct(null);
    setForm({});
    setImageFile(null);
  };

    // Edit modal ochish
  const openEdit = (product: ProductInterface) => {
    setEditProduct(product);
    setForm({ ...product });
    setImageFile(null);
    setOpenMenuId(null);
  };
  

  const handleDelete = async (id: number) => {
    setOpenMenuId(null);
    if (!confirm("Mahsulotni o'chirishni tasdiqlaysizmi?")) return;
    try {
      await adminAxiosInstance.delete(`/product/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Mahsulot o'chirildi");
    } catch (error) {
      console.log(error);
      toast.error("O'chirishda xatolik yuz berdi");
    }
  };

  // Edit submit
  const handleEditSubmit = async () => {
    if (!editProduct) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title ?? "");
      formData.append("description", form.description ?? "");
      formData.append("price", String(form.price ?? 0));
      formData.append("category", form.category ?? "");
      formData.append("size", form.size ?? "");
      formData.append("status", form.status ?? "");
      if (imageFile) formData.append("image", imageFile);

      const { data } = await adminAxiosInstance.patch(
        `/product/${editProduct.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      setProducts((prev) =>
        prev.map((p) => (p.id === editProduct.id ? data : p)),
      );
      toast.success("Mahsulot yangilandi");
      closeEdit();
    } catch (error) {
      console.log(error);
      toast.error("Yangilashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getProductList = async () => {
      try {
        const { data } = await adminAxiosInstance.get("/product/list");
        setProducts(data);
      } catch (error) {
        console.log(error);
        toast.error("Mahsulotlarni olishda xatolik yuz berdi");
      }
    };
    getProductList();
  }, []);

  return (
    <>
      <ProductContext.Provider
        value={{
          product,
          setProduct,
          products,
          setProducts,
          handleDelete,
          openMenuId,
          setOpenMenuId,
          loading,
          setLoading,
          form,
          setForm,
          imageFile,
          setImageFile,
          handleEditSubmit,
          editProduct,
          setEditProduct,
          closeEdit,
          openEdit
        }}
      >
        {children}
      </ProductContext.Provider>
    </>
  );
};

export const UseProduct = () => {
  const context = useContext(ProductContext);
  if (!context)
    throw new Error("Product context must be used within Product provider");
  return context;
};
