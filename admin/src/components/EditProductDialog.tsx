import { X } from "lucide-react";
import type IProduct from "../schema/product.schema";

const EditProductDialog = ({
  loading,
  closeEdit,
  form,
  setForm,
  handleEditSubmit,
  setImageFile,
}: {
  loading: boolean,
  closeEdit:()=>void,
  form: Partial<IProduct>,
  setForm:(product:Partial<IProduct>)=>void,
  handleEditSubmit:()=>void,
  setImageFile:(imageFile:File | null) => void
}) => {
  return (
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
            <label className="block text-xs text-gray-500 mb-1">Tavsif</label>
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
            <label className="block text-xs text-gray-500 mb-1">Narx ($)</label>
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
            <label className="block text-xs text-gray-500 mb-1">O'lcham</label>
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
            <label className="block text-xs text-gray-500 mb-1">Status</label>
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
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
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
  );
};

export default EditProductDialog;
