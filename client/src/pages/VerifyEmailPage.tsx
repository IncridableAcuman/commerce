import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2, ArrowLeft, MailCheck } from "lucide-react";
import axiosInstance from "../api/axios.instance";

type Status = "loading" | "success" | "error" | "idle";

const VerifyEmailPage = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("error");
      return;
    }
    const verify = async () => {
      setStatus("loading");
      try {
        await axiosInstance.get(`/auth/verify-email?token=${token}`);
        setStatus("success");
        setTimeout(() => navigate("/auth"), 4000);
      } catch (error) {
        console.log(error);
        setStatus("error");
      }
    };
    verify();
  }, [token, navigate]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Top accent */}
        <div className="h-1 w-full bg-linear-to-r from-teal-400 via-blue-400 to-purple-400" />

        <div className="p-8">
          {/* IDLE */}
          {status === "idle" && (
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <div className="w-14 h-14 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                <MailCheck size={24} className="text-gray-400" />
              </div>
              <p className="text-base font-medium text-gray-900">Email tasdiqlash</p>
              <p className="text-sm text-gray-400">Token tekshirilmoqda...</p>
            </div>
          )}

          {/* LOADING */}
          {status === "loading" && (
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                <Loader2 size={24} className="text-blue-400 animate-spin" />
              </div>
              <p className="text-base font-medium text-gray-900">Tasdiqlanmoqda...</p>
              <p className="text-sm text-gray-400">Email manzilingiz tekshirilmoqda, biroz kuting</p>
            </div>
          )}

          {/* SUCCESS */}
          {status === "success" && (
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                <CheckCircle2 size={26} className="text-green-500" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-medium text-gray-900">Email tasdiqlandi!</p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Hisobingiz muvaffaqiyatli faollashtirildi.
                </p>
              </div>

              {/* Auto redirect bar */}
              <div className="w-full mt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-gray-400">Sign in sahifasiga yo'naltirilmoqda</span>
                  <span className="text-xs text-gray-400">4s</span>
                </div>
                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-400 rounded-full animate-[shrink_4s_linear_forwards]" />
                </div>
              </div>

              <Link
                to="/auth"
                className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors mt-1"
              >
                <ArrowLeft size={13} />
                Hozir kirish
              </Link>
            </div>
          )}

          {/* ERROR */}
          {status === "error" && (
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <div className="w-14 h-14 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
                <XCircle size={26} className="text-red-400" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-medium text-gray-900">Tasdiqlab bo'lmadi</p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {!token
                    ? "Token topilmadi. Havola noto'g'ri yoki muddati o'tgan."
                    : "Emailni tasdiqlashda xatolik yuz berdi. Havola eskirgan bo'lishi mumkin."}
                </p>
              </div>

              <div className="w-full pt-2 border-t border-gray-100 space-y-2">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-all duration-150"
                >
                  Qayta urinish
                </button>
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <ArrowLeft size={13} />
                  Back to sign in
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Animate shrink keyframe */}
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default VerifyEmailPage;