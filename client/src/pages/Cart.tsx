import { MoreVertical, Pencil, Trash } from "lucide-react";
import Navbar from "../components/Navbar";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../api/axios.instance";
import type ICart from "../interface/cart.interface";

const Cart = () => {
  const [cart, setCart] = useState<ICart>();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);


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

  useEffect(()=>{
    const handleClickOutside = (e:MouseEvent) => {
      if(menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null)
      };
    }
    document.addEventListener('mousedown',handleClickOutside);
    return ()=> document.removeEventListener('mousedown',handleClickOutside);
  },[]);

  const handleDeleteItem = async (id:number) => {
    try {
      const {data} = await axiosInstance.delete(`/cart?productId=${id}`);
      toast.success("Successfully deleted");
      setCart(data);
    } catch (error) {
      console.log(error);
      toast.error('Mahsulotni o\'chirishda xatolik');
    }
  }


  return (
    <div className="w-full min-h-screen">
      <Navbar />
      <div className="p-4">
        <table className="w-full text-sm border border-gray-300 rounded-xl">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">ID</th>
              <th className="text-left p-3">Image</th>
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3">Price</th>
              <th className="text-left p-3">Size</th>
              <th className="text-left p-3">Category</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Quantity</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cart?.cartItemDtoList.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-3">{item.product.id}</td>
                <td className="p-3">
                  <img
                    src={`http://localhost:8080${item?.product.image}`}
                    alt={item.product.title}
                    className="w-8 h-8 rounded-md"
                  />
                </td>
                <td className="p-3">{item?.product.title}</td>
                <td className="p-3">{item?.product.price}$</td>
                <td className="p-3">{item?.product.size}</td>
                <td className="p-3">{item?.product.category}</td>
                <td className="p-3">{item?.product.status}</td>
                <td className="p-3">{item.quantity}</td>
                <td className="p-3 relative">
                  <div ref={openMenuId === item.product.id ? menuRef : null}>
                    <button
                      onClick={() =>
                        setOpenMenuId(
                          openMenuId === item.product.id
                            ? null
                            : item.product.id,
                        )
                      }
                    >
                      <MoreVertical size={15} />
                    </button>
                    {openMenuId === item.product.id && (
                      <div className="absolute z-10 mt-1 w-36 bg-white border border-gray-200 shadow rounded-lg">
                        <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-300">
                          <Pencil size={14} />
                          Edit
                        </button>
                        <button 
                        onClick={()=>handleDeleteItem(item.product.id)}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-700 hover:bg-gray-100 transition duration-300">
                          <Trash size={14} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Cart;
