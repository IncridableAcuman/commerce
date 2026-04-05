import { Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import type z from "zod";
import { loginSchema  } from "../schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import axiosInstance from "../api/axios.instance";

const Auth = () => {
  const navigate = useNavigate();

  const {register,handleSubmit,formState: {errors}} = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const onSubmit = async (values:z.infer<typeof loginSchema>) => {
    try {
      const {data} = await axiosInstance.post("/auth/login",values);
      localStorage.setItem("accessToken",data.accessToken);
      toast.success("Successfully");
      navigate("/");
    } catch (error) {
      console.log(error);
      localStorage.removeItem("accessToken");
      toast.error("Authentication failed")
    }
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-md p-6">
        <h1 className="text-2xl font-semibold py-4">Sign In Now</h1>
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
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 border p-2 rounded-md">
            <Lock />
            <input
              {...register("password")}
              type="password"
              placeholder="********"
              className="outline-none w-full"
            />
          </div>
          {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white p-3 rounded-md cursor-pointer hover:bg-gray-800
           transition duration-300"
          >
            Sign In Now
          </button>
        </form>
        <div className="pt-4">
              <p>Don't have an account? <Link to={'/register'} className="hover:underline font-bold">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
