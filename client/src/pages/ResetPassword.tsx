import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
      const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCp, setShowCp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const getStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { level: 1, label: "Juda zaif", color: "bg-red-400" };
    if (score === 2) return { level: 2, label: "Zaif", color: "bg-amber-400" };
    if (score === 3) return { level: 3, label: "Yaxshi", color: "bg-lime-500" };
    return { level: 4, label: "Kuchli", color: "bg-teal-500" };
  };

  const strength = getStrength(password);
  const isMatch = confirmPassword.length > 0 && password === confirmPassword;
  const isMismatch = confirmPassword.length > 0 && password !== confirmPassword;
  const isValid = password.length >= 6 && isMatch && strength.level >= 2;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    // await axiosInstance.put("/auth/reset-password", { token, password });
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1800);
  };

    useEffect(()=>{
      const token = localStorage.getItem("accessToken");
      if(token){
        navigate("/auth")
      }
    },[navigate])

  if (success) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto">
            <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <p className="text-lg font-medium">Parol muvaffaqiyatli yangilandi!</p>
          <p className="text-sm text-gray-500">Endi yangi parolingiz bilan kirishingiz mumkin.</p>
          <button onClick={() => setSuccess(false)} className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 mx-auto">
            ← Qayta urinish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 relative overflow-hidden">
        {/* top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-0.75 bg-linear-to-r from-teal-400 via-blue-400 to-purple-400 rounded-t-xl" />

        <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center mb-5">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path strokeLinecap="round" d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <h1 className="text-xl font-medium mb-1">Reset password</h1>
        <p className="text-sm text-gray-400 mb-6">Yangi xavfsiz parol kiriting</p>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Yangi parol</label>
            <div className={`flex items-center border rounded-lg px-3 transition-all ${
              password.length > 0 && strength.level >= 2 ? "border-green-400 ring-2 ring-green-100" :
              password.length > 0 ? "border-red-400 ring-2 ring-red-100" : "border-gray-200"
            }`}>
              <svg className="w-4 h-4 text-gray-400 mr-2 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path strokeLinecap="round" d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="flex-1 py-2.5 text-sm outline-none bg-transparent"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="text-gray-400 hover:text-gray-600 ml-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  {showPw
                    ? <><path strokeLinecap="round" d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path strokeLinecap="round" d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                    : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                  }
                </svg>
              </button>
            </div>
            {/* Strength bars */}
            {password.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`h-0.75 flex-1 rounded-full transition-all duration-300 ${
                      i <= strength.level ? strength.color : "bg-gray-200"
                    }`} />
                  ))}
                </div>
                <p className="text-xs text-gray-400">{strength.label}</p>
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Parolni tasdiqlang</label>
            <div className={`flex items-center border rounded-lg px-3 transition-all ${
              isMatch ? "border-green-400 ring-2 ring-green-100" :
              isMismatch ? "border-red-400 ring-2 ring-red-100" : "border-gray-200"
            }`}>
              <svg className="w-4 h-4 text-gray-400 mr-2 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <input
                type={showCp ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="flex-1 py-2.5 text-sm outline-none bg-transparent"
              />
              <button type="button" onClick={() => setShowCp(!showCp)} className="text-gray-400 hover:text-gray-600 ml-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  {showCp
                    ? <><path strokeLinecap="round" d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path strokeLinecap="round" d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                    : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                  }
                </svg>
              </button>
            </div>
            {isMatch && <p className="text-xs text-green-500 mt-1">Parollar mos keladi</p>}
            {isMismatch && <p className="text-xs text-red-400 mt-1">Parollar mos kelmayapti</p>}
          </div>

          <button
            type="submit"
            disabled={!isValid || loading}
            className="w-full bg-black text-white py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition disabled:opacity-40 disabled:cursor-not-allowed mt-2"
          >
            {loading && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            )}
            {loading ? "Yangilanmoqda..." : "Parolni yangilash"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;