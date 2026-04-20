import { useEffect, useState } from "react";
import { Lock, Mail, UserRound, Eye, EyeOff, ArrowRight, Loader2, MailCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import z from "zod";
import { registerSchema } from "../schema/auth.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import axiosInstance from "../api/axios.instance";

type RegisterForm = z.infer<typeof registerSchema>;

interface FieldConfig {
  name: keyof RegisterForm;
  placeholder: string;
  type: string;
  icon: React.ReactNode;
}

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) navigate("/");
  }, [navigate]);

  const onSubmit = async (values: RegisterForm) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post("/auth/register", values);
      toast.success(data);
      setSentEmail(values.email);
      setSent(true);
    } catch (error) {
      console.log(error);
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const fields: FieldConfig[] = [
    { name: "firstname", placeholder: "Firstname", type: "text", icon: <UserRound size={15} className="text-gray-400 shrink-0" /> },
    { name: "lastname", placeholder: "Lastname", type: "text", icon: <UserRound size={15} className="text-gray-400 shrink-0" /> },
    { name: "username", placeholder: "Username", type: "text", icon: <UserRound size={15} className="text-gray-400 shrink-0" /> },
    { name: "email", placeholder: "example@gmail.com", type: "email", icon: <Mail size={15} className="text-gray-400 shrink-0" /> },
  ];

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Top accent */}
        <div className="h-1 w-full bg-linear-to-r from-teal-400 via-blue-400 to-purple-400" />

        <div className="p-8">
          {!sent ? (
            <>
              {/* Header */}
              <div className="mb-7">
                <div className="w-11 h-11 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center mb-5">
                  <UserRound size={18} className="text-gray-500" />
                </div>
                <h1 className="text-xl font-medium text-gray-900">Create account</h1>
                <p className="text-sm text-gray-400 mt-1">Yangi hisob yarating</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
                {fields.map(({ name, placeholder, type, icon }) => (
                  <div key={name} className="space-y-1.5">
                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {placeholder}
                    </label>
                    <div className={`flex items-center gap-2 border rounded-lg px-3 transition-all duration-200 ${
                      errors[name]
                        ? "border-red-400 ring-2 ring-red-100"
                        : "border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100"
                    }`}>
                      {icon}
                      <input
                        {...register(name)}
                        type={type}
                        placeholder={placeholder}
                        className="flex-1 py-2.5 text-sm outline-none bg-transparent text-gray-900 placeholder:text-gray-300"
                      />
                    </div>
                    {errors[name] && (
                      <p className="text-xs text-red-400">{errors[name]?.message}</p>
                    )}
                  </div>
                ))}

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Parol
                  </label>
                  <div className={`flex items-center gap-2 border rounded-lg px-3 transition-all duration-200 ${
                    errors.password
                      ? "border-red-400 ring-2 ring-red-100"
                      : "border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100"
                  }`}>
                    <Lock size={15} className="text-gray-400 shrink-0" />
                    <input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="flex-1 py-2.5 text-sm outline-none bg-transparent text-gray-900 placeholder:text-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-400">{errors.password.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-1 bg-gray-900 text-white py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-700 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 size={15} className="animate-spin" /> : <ArrowRight size={15} />}
                  {loading ? "Ro'yxatdan o'tilmoqda..." : "Sign up"}
                </button>
              </form>

              <p className="text-sm text-gray-400 text-center mt-6">
                Hisobingiz bormi?{" "}
                <Link to="/auth" className="text-gray-900 font-medium hover:underline underline-offset-2">
                  Sign in
                </Link>
              </p>
            </>
          ) : (
            /* ── Email sent state ── */
            <div className="flex flex-col items-center text-center gap-5 py-4">
              {/* Icon */}
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <MailCheck size={28} className="text-blue-400" />
                </div>
                {/* pulse ring */}
                <span className="absolute inset-0 rounded-full border border-blue-200 animate-ping opacity-30" />
              </div>

              {/* Text */}
              <div className="space-y-2">
                <h2 className="text-base font-medium text-gray-900">
                  Emailingizni tasdiqlang
                </h2>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Tasdiqlash havolasi{" "}
                  <span className="font-medium text-gray-700">{sentEmail}</span>{" "}
                  manziliga yuborildi.
                </p>
              </div>

              {/* Steps */}
              <div className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-3 text-left">
                {[
                  { step: "1", text: "Emailingizni oching" },
                  { step: "2", text: "Tasdiqlash xatini toping" },
                  { step: "3", text: "Havolani bosib hisobni faollashtiring" },
                ].map(({ step, text }) => (
                  <div key={step} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-500 text-xs font-medium flex items-center justify-center shrink-0">
                      {step}
                    </span>
                    <span className="text-sm text-gray-500">{text}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-300">
                Xat kelmasa, spam papkasini tekshiring
              </p>

              <Link
                to="/auth"
                className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
              >
                <ArrowRight size={13} />
                Sign in sahifasiga o'tish
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;