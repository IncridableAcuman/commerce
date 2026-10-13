import React from "react";
import { useAuthStore } from "../stores/authStore";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export const UseAuth = () => {
  const store = useAuthStore();
  return {
    user: store.user,
    setUser: store.setUser,
    loading: store.isLoading,
    setLoading: () => {},
    userRegister: store.register,
    login: store.login,
    logout: store.logout,
    forgotPassword: store.forgotPassword,
    resetPassword: store.resetPassword,
    resendOtpCode: store.resendOtp,
    verifyEmail: store.verifyEmail,
  };
};

