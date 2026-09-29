import React, { createContext, useContext, useState } from "react";
import type { IUser } from "../interfaces/user.interface";
import type {
  ForgotPasswordData,
  LoginData,
  RegisterData,
  ResendOtpCodeData,
  ResetPasswordData,
  VerifyEmailData,
} from "../schemas/auth.schema";
import { toast } from "react-toastify";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  userRegister: (data: RegisterData) => void;
  login: (data: LoginData) => void;
  forgotPassword: (data: ForgotPasswordData) => void;
  resetPassword: (data: ResetPasswordData) => void;
  resendOtpCode: (data: ResendOtpCodeData) => void;
  verifyEmail: (data: VerifyEmailData) => void;
  logout: () => void;
};
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const userRegister = async (data: RegisterData) => {
    try {
      setLoading(true);
      await api.post("/auth/register", data);
      toast.success("Check your email");
    } catch (error) {
      console.log(error);
      toast.error("registration failed");
    } finally {
      setLoading(false);
    }
  };
  const login = async (loginData: LoginData) => {
    try {
      setLoading(true);
      const { data } = await api.post("/auth/login", loginData);
      localStorage.setItem("accessToken", data.accessToken);
      toast.success("success");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("authentication failed");
    } finally {
      setLoading(false);
    }
  };
  const logout = async () => {
    try {
      setLoading(true);
      await api.post("/auth/logout");
      localStorage.removeItem("accessToken");
      toast.success("Logged out");
      navigate("/auth");
    } catch (error) {
      console.log(error);
      toast.error("Logged out failed");
    } finally {
      setLoading(false);
    }
  };
  const forgotPassword = async (data: ForgotPasswordData) => {
    try {
      setLoading(true);
      await api.post("/auth/forgot-password", data);
      toast.success("success");
    } catch (error) {
      console.log(error);
      toast.error("failed");
    } finally {
      setLoading(false);
    }
  };
  const resetPassword = async (data: ResetPasswordData) => {
    try {
      setLoading(true);
      await api.put("/auth/reset-password", data);
      toast.success("Password updated");
      navigate("/suth");
    } catch (error) {
      console.log(error);
      toast.error("Password updating failed");
    } finally {
      setLoading(false);
    }
  };

  const resendOtpCode = async (resenOtpCodedData: ResendOtpCodeData) => {
    try {
      setLoading(true);
      const { data } = await api.post("/resend-otp", resenOtpCodedData);
      toast.success(data);
    } catch (error) {
      console.log(error);
      toast.error("Resend otp code failed");
    } finally {
      setLoading(false);
    }
  };
  const verifyEmail = async (verifyEmailData: VerifyEmailData) => {
    try {
      setLoading(true);
      const { data } = await api.post("/verify-email", verifyEmailData);
      localStorage.setItem("accessToken", data.accessToken);
      toast.success("Email verified");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Email verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        userRegister,
        login,
        logout,
        forgotPassword,
        resetPassword,
        resendOtpCode,
        verifyEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const UseAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error();
  }
  return context;
};
