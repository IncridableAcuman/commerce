import { useEffect, useState, useRef } from "react";
import type IProduct from "../schema/product.schema";
import { toast } from "react-toastify";
import adminAxiosInstance from "../api/axiosInstance";
import { MoreVertical, Pencil, Trash2, X } from "lucide-react";

const Items = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [editProduct, setEditProduct] = useState<IProduct | null>(null);
  const [form, setForm] = useState<Partial<IProduct>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Tashqariga bosilganda dropdown yopilsin
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Edit modal ochish
  const openEdit = (product: IProduct) => {
    setEditProduct(product);
    setForm({ ...product });
    setImageFile(null);
    setOpenMenuId(null);
  };

  // Edit modal yopish
  const closeEdit = () => {
    setEditProduct(null);
    setForm({});
    setImageFile(null);
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
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setProducts((prev) =>
        prev.map((p) => (p.id === editProduct.id ? data : p))
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

  // Delete
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

  return (
    <div>
      {/* ===== TABLE ===== */}
      <table className="w-full text-sm border border-gray-200 rounded-xl">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-3">ID</th>
            <th className="text-left p-3">Image</th>
            <th className="text-left p-3">Title</th>
            <th className="text-left p-3">Description</th>
            <th className="text-left p-3">Price</th>
            <th className="text-left p-3">Category</th>
            <th className="text-left p-3">Size</th>
            <th className="text-left p-3">Status</th>
            <th className="text-left p-3">Actions</th>
          </tr>
        </thead>
        <tbody className="border-t border-t-gray-300">
          {products.map((product, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="p-3">{product.id}</td>
              <td className="p-3">
                <img src={`http://localhost:8080${product?.image}`} alt="image" className="w-12 h-12 rounded-md" />
              </td>
              <td className="p-3">{product.title}</td>
              <td className="p-3">{product.description.slice(0, 10)}...</td>
              <td className="p-3">{product.price}$</td>
              <td className="p-3">{product.category}</td>
              <td className="p-3">{product.size}</td>
              <td className="p-3">{product.status}</td>

              {/* Actions */}
              <td className="p-3 relative">
                <div ref={openMenuId === product.id ? menuRef : null}>
                  <button
                    onClick={() =>
                      setOpenMenuId(
                        openMenuId === product.id ? null : product.id
                      )
                    }
                    className="p-1 rounded hover:bg-gray-200"
                  >
                    <MoreVertical size={15} />
                  </button>

                  {openMenuId === product.id && (
                    <div className="absolute right-0 z-10 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-md">
                      <button
                        onClick={() => openEdit(product)}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Pencil size={14} />
                        Tahrirlash
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                        O'chirish
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ===== EDIT DIALOG ===== */}
      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-800">
                Mahsulotni tahrirlash
              </h2>
              <button
                onClick={closeEdit}
                className="p-1 rounded hover:bg-gray-100 text-gray-500"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs text-gray-500 mb-1">Nomi</label>
                <input
                  type="text"
                  value={form.title ?? ""}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs text-gray-500 mb-1">
                  Tavsif
                </label>
                <textarea
                  rows={3}
                  value={form.description ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Narx ($)
                </label>
                <input
                  type="number"
                  value={form.price ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, price: Number(e.target.value) })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Kategoriya
                </label>
                <input
                  type="text"
                  value={form.category ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value as any })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  O'lcham
                </label>
                <input
                  type="text"
                  value={form.size ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, size: e.target.value as any })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Status
                </label>
                <input
                  type="text"
                  value={form.status ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value as any })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs text-gray-500 mb-1">
                  Rasm (yangilash uchun tanlang)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setImageFile(e.target.files?.[0] ?? null)
                  }
                  className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={closeEdit}
                className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleEditSubmit}
                disabled={loading}
                className="px-5 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? "Saqlanmoqda..." : "Saqlash"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Items;