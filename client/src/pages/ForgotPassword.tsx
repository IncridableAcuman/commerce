import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import type z from "zod";
import { forgotPasswordSchema } from "../schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import axiosInstance from "../api/axios.instance";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
      const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (value: z.infer<typeof forgotPasswordSchema>) => {
    try {
      const { data } = await axiosInstance.post("/auth/forgot-password", value);
      toast.success(data);
    } catch (error) {
      console.log(error);
      toast.error("Message not sent");
    }
  };


  useEffect(()=>{
    const token = localStorage.getItem("accessToken");
    if(token){
      navigate("/auth")
    }
  },[navigate])

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-md p-6">
        <h1 className="text-2xl font-semibold py-4">Forgot Password</h1>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 border  p-2 rounded-md">
              <Mail />
              <input
                type="email"
                {...register("email")}
                placeholder="example@gmail.com"
                className="outline-none w-full"
              />
            </div>
            {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white p-3 rounded-md cursor-pointer hover:bg-gray-800
           transition dur3"
          >
            Send to email
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
