import React, { createContext, useContext, useEffect, useState } from "react";
import type UserContextType from "../interface/userContext.interface";
import type IUser from "../interface/user.interface";
import axiosInstance from "../api/axios.instance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import type { ForgotForm, LoginForm, RegisterForm } from "../schema/authForm";

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axiosInstance.get("/user/me");
        setUser(data);
      } catch (error) {
        console.log(error);
        toast.error("Foydalanuvchini olishda xatolik yuz berdi");
      }
    };
    fetchUser();
  }, []);

  const loginSubmit = async (values: LoginForm) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post("/auth/login", values);
      localStorage.setItem("accessToken", data.accessToken);
      toast.success("Successfully logged in");
      navigate("/");
    } catch (error) {
      console.log(error);
      localStorage.removeItem("accessToken");
      toast.error("Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const registerSubmit = async (values: RegisterForm) => {
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

    const forgotPasswordSubmit = async (value: ForgotForm) => {
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
    <>
      <UserContext.Provider
        value={{ user, loading,sent,sentEmail, setUser, setLoading, loginSubmit, registerSubmit,forgotPasswordSubmit }}
      >
        {children}
      </UserContext.Provider>
    </>
  );
};

export const UseUserContext = () => {
  const context = useContext(UserContext);
  if (!context)
    throw new Error("Use user context must be used within a User provider");
  return context;
};
