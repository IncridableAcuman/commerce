import { MoreVertical } from "lucide-react"
import Navbar from "../components/Navbar"
import { useEffect, useState } from "react"
import { toast } from "react-toastify";
import axiosInstance from "../api/axios.instance";
import type ICart from "../interface/cart.interface";

const Cart = () => {
    const [cart,setCart]=useState<ICart>();

    useEffect(()=>{
        const fetChCart = async () => {
            try {
              const {data} = await axiosInstance.get("/cart");
              setCart(data);  
            } catch (error) {
                console.log(error);
                toast.error("Xatolik yuz berdi")
            }
        }
        fetChCart();
    },[]);

    console.log(cart);

  return (
    <div className="w-full min-h-screen">
        <Navbar/>
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
                <tbody className="hover:bg-gray-50">
                    <tr>
                        <td className="p-3">1</td>
                        <td className="p-3">Image</td>
                        <td className="p-3">Musaffo Surat</td>
                        <td className="p-3">20$</td>
                        <td className="p-3">X</td>
                        <td className="p-3">Men</td>
                        <td className="p-3">Active</td>
                        <td className="p-3">5</td>
                        <td className="p-3">
                            <MoreVertical size={15} />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default Cart