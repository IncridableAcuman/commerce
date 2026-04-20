import { useState, useEffect } from "react";
import { Mail, ArrowRight, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import type z from "zod";
import { forgotPasswordSchema } from "../schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import axiosInstance from "../api/axios.instance";
import { useNavigate, Link } from "react-router-dom";

type ForgotForm = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) navigate("/");
  }, [navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (value: ForgotForm) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post("/auth/forgot-password", value);
      toast.success(data);
      setSentEmail(value.email);
      setSent(true);
    } catch (error) {
      console.log(error);
      toast.error("Message not sent");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Top accent */}
        <div className="h-1 w-full bg-linear-to-r from-teal-400 via-blue-400 to-purple-400" />

        <div className="p-8">
          {!sent ? (
            <>
              {/* Header */}
              <div className="mb-7">
                <div className="w-11 h-11 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center mb-5">
                  <Mail size={18} className="text-gray-500" />
                </div>
                <h1 className="text-xl font-medium text-gray-900">Forgot password</h1>
                <p className="text-sm text-gray-400 mt-1">
                  Email manzilingizni kiriting, havola yuboramiz
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-900 text-white py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-700 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <ArrowRight size={15} />
                  )}
                  {loading ? "Yuborilmoqda..." : "Send to email"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <ArrowLeft size={13} />
                  Back to sign in
                </Link>
              </div>
            </>
          ) : (
            /* Success state */
            <div className="flex flex-col items-center text-center py-4 gap-4">
              <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                <CheckCircle2 size={26} className="text-green-500" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-medium text-gray-900">Xat yuborildi!</p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  <span className="text-gray-700 font-medium">{sentEmail}</span> manziliga
                  parolni tiklash havolasi yuborildi.
                </p>
              </div>
              <p className="text-xs text-gray-300 mt-1">
                Xat kelmasa, spam papkasini tekshiring
              </p>
              <Link
                to="/auth"
                className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors mt-2"
              >
                <ArrowLeft size={13} />
                Back to sign in
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;