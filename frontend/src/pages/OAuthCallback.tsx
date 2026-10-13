import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { Loader2 } from "lucide-react";

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setToken, fetchCurrentUser } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (token) {
      setToken(token);
      fetchCurrentUser().finally(() => {
        navigate("/", { replace: true });
      });
    } else if (error) {
      navigate("/auth?error=" + encodeURIComponent(error), { replace: true });
    } else {
      navigate("/auth", { replace: true });
    }
  }, [searchParams, navigate, setToken, fetchCurrentUser]);

  return (
    <div className="w-screen h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
      <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
      <h2 className="text-xl font-semibold">Tizimga kirilmoqda...</h2>
      <p className="text-sm text-slate-400 mt-2">Iltimos, kuting...</p>
    </div>
  );
};

export default OAuthCallback;
