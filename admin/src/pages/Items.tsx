import { useEffect, useRef } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { UseProduct } from "../context/ProductProvider";
import EditProductDialog from "../components/EditProductDialog";

const Items = () => {
  const {
    handleDelete,
    form,
    setForm,
    products,
    openMenuId,
    setOpenMenuId,
    setImageFile,
    editProduct,
    closeEdit,
    openEdit,
    handleEditSubmit,
    loading,
  } = UseProduct();

  const menuRef = useRef<HTMLDivElement>(null);

  // Tashqariga bosilganda dropdown yopilsin
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setOpenMenuId]);


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
                <img
                  src={`http://localhost:8080${product?.image}`}
                  alt="image"
                  className="w-12 h-12 rounded-md"
                />
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
                        openMenuId === product.id ? null : product.id,
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
        <EditProductDialog
        loading={loading}
        form={form}
        setForm={setForm}
        handleEditSubmit={handleEditSubmit}
        setImageFile={setImageFile}
        closeEdit={closeEdit}
        />
      )}
    </div>
  );
};

export default Items;
