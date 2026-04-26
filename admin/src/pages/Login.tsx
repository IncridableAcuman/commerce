import { useEffect } from "react";
import { Lock, Mail, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import type z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import LoginSchema from "../schema/login.schema";
import { UseAdminContext } from "../context/AdminProvider";

type LoginForm = z.infer<typeof LoginSchema>;

const Login = () => {
  const navigate = useNavigate();
const { onSubmit,showPassword,setShowPassword,loading } = UseAdminContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });


    useEffect(()=>{
      const token = localStorage.getItem("accessToken");
      if(token){
        navigate("/login")
      }
    },[navigate])

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Top accent */}
        <div className="h-1 w-full bg-linear-to-r from-teal-400 via-blue-400 to-purple-400" />

        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="w-11 h-11 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center mb-5">
              <Lock size={18} className="text-gray-500" />
            </div>
            <h1 className="text-xl font-medium text-gray-900">Sign in</h1>
            <p className="text-sm text-gray-400 mt-1">Hisobingizga kiring</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
                Email
              </label>
              <div
                className={`flex items-center gap-2 border rounded-lg px-3 transition-all duration-200 ${
                  errors.email
                    ? "border-red-400 ring-2 ring-red-100"
                    : "border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100"
                }`}
              >
                <Mail size={15} className="text-gray-400 shrink-0" />
                <input
                  type="email"
                  {...register("email")}
                  placeholder="example@gmail.com"
                  className="flex-1 py-2.5 text-sm outline-none bg-transparent text-gray-900 placeholder:text-gray-300"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Parol
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div
                className={`flex items-center gap-2 border rounded-lg px-3 transition-all duration-200 ${
                  errors.password
                    ? "border-red-400 ring-2 ring-red-100"
                    : "border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100"
                }`}
              >
                <Lock size={15} className="text-gray-400 shrink-0" />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="flex-1 py-2.5 text-sm outline-none bg-transparent text-gray-900 placeholder:text-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p:any) => !p)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gray-900 text-white py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-700 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <ArrowRight size={15} />
              )}
              {loading ? "Kirish..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;