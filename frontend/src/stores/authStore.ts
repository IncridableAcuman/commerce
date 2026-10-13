import { create } from "zustand";
import type { IUser } from "../interfaces/user.interface";
import type {
  ForgotPasswordData,
  LoginData,
  RegisterData,
  ResendOtpCodeData,
  ResetPasswordData,
  VerifyEmailData,
} from "../schemas/auth.schema";
import api from "../api/axiosInstance";
import { toast } from "react-toastify";

interface AuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  login: (data: LoginData) => Promise<boolean>;
  register: (data: RegisterData) => Promise<{ success: boolean; email?: string }>;
  verifyEmail: (data: VerifyEmailData) => Promise<boolean>;
  resendOtp: (data: ResendOtpCodeData) => Promise<boolean>;
  forgotPassword: (data: ForgotPasswordData) => Promise<boolean>;
  resetPassword: (data: ResetPasswordData) => Promise<boolean>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<IUser | null>;
  setToken: (token: string | null) => void;
  setUser: (user: IUser | null) => void;
  initAuth: () => Promise<void>;
  loginWithGoogleToken: (googleToken: string) => Promise<boolean>;
  redirectToGoogleOAuth: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem("accessToken") || null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
  isLoading: false,
  isInitialized: false,
  error: null,

  setToken: (token: string | null) => {
    if (token) {
      localStorage.setItem("accessToken", token);
      set({ token, isAuthenticated: true });
    } else {
      localStorage.removeItem("accessToken");
      set({ token: null, isAuthenticated: false, user: null });
    }
  },

  setUser: (user: IUser | null) => {
    set({ user, isAuthenticated: !!user });
  },

  clearError: () => set({ error: null }),

  login: async (data: LoginData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/auth/login", data);
      const { accessToken, user } = response.data;

      get().setToken(accessToken);
      if (user) {
        set({ user, isAuthenticated: true });
      } else {
        await get().fetchCurrentUser();
      }

      toast.success("Tizimga muvaffaqiyatli kirdingiz!");
      return true;
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Tizimga kirishda xatolik yuz berdi";
      set({ error: errorMsg });
      toast.error(errorMsg);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/auth/register", data);
      const msg = response.data || "Ro'yxatdan o'tdingiz. Pochtani tekshiring!";
      toast.success(msg);
      return { success: true, email: data.email };
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Ro'yxatdan o'tishda xatolik yuz berdi";
      set({ error: errorMsg });
      toast.error(errorMsg);
      return { success: false };
    } finally {
      set({ isLoading: false });
    }
  },

  verifyEmail: async (data: VerifyEmailData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/auth/verify-email", data);
      const { accessToken, user } = response.data;

      get().setToken(accessToken);
      if (user) {
        set({ user, isAuthenticated: true });
      } else {
        await get().fetchCurrentUser();
      }

      toast.success("Email muvaffaqiyatli tasdiqlandi!");
      return true;
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Emailni tasdiqlashda xatolik yuz berdi";
      set({ error: errorMsg });
      toast.error(errorMsg);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  resendOtp: async (data: ResendOtpCodeData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/auth/resend-otp", data);
      const msg = response.data || "Yangi tasdiqlash kodi yuborildi!";
      toast.success(msg);
      return true;
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Kodni qayta yuborishda xatolik yuz berdi";
      set({ error: errorMsg });
      toast.error(errorMsg);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  forgotPassword: async (data: ForgotPasswordData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/auth/forgot-password", data);
      toast.success(response.data || "Parolni tiklash havolasi yuborildi!");
      return true;
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "So'rovni bajarishda xatolik yuz berdi";
      set({ error: errorMsg });
      toast.error(errorMsg);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  resetPassword: async (data: ResetPasswordData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put("/auth/reset-password", data);
      toast.success(response.data || "Parol muvaffaqiyatli yangilandi!");
      return true;
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Parolni yangilashda xatolik yuz berdi";
      set({ error: errorMsg });
      toast.error(errorMsg);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore network errors on logout
    } finally {
      get().setToken(null);
      set({ user: null, isAuthenticated: false, isLoading: false });
      toast.success("Tizimdan chiqildi");
    }
  },

  fetchCurrentUser: async () => {
    try {
      const response = await api.get("/auth/me");
      const user = response.data;
      set({ user, isAuthenticated: true });
      return user;
    } catch {
      return null;
    }
  },

  initAuth: async () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const user = await get().fetchCurrentUser();
        if (!user) {
          // Token muddati o'tgan bo'lishi mumkin, refresh qilib ko'ramiz
          try {
            const refreshRes = await api.get("/auth/refresh");
            if (refreshRes.data?.accessToken) {
              get().setToken(refreshRes.data.accessToken);
              await get().fetchCurrentUser();
            } else {
              get().setToken(null);
            }
          } catch {
            get().setToken(null);
          }
        }
      } catch {
        get().setToken(null);
      }
    } else {
      // Refresh token cookie borligini tekshirib ko'ramiz
      try {
        const refreshRes = await api.get("/auth/refresh");
        if (refreshRes.data?.accessToken) {
          get().setToken(refreshRes.data.accessToken);
          if (refreshRes.data?.user) {
            set({ user: refreshRes.data.user, isAuthenticated: true });
          } else {
            await get().fetchCurrentUser();
          }
        }
      } catch {
        // No valid session, that's fine
      }
    }
    set({ isInitialized: true });
  },

  loginWithGoogleToken: async (googleToken: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/auth/google", { token: googleToken });
      const { accessToken, user } = response.data;
      get().setToken(accessToken);
      if (user) {
        set({ user, isAuthenticated: true });
      } else {
        await get().fetchCurrentUser();
      }
      toast.success("Google orqali muvaffaqiyatli kirdingiz!");
      return true;
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Google orqali kirishda xatolik yuz berdi";
      set({ error: errorMsg });
      toast.error(errorMsg);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  redirectToGoogleOAuth: () => {
    // Spring Security OAuth2 login redirect url:
    // Backend context-path /api/v1 bo'lgani uchun:
    const backendBaseUrl =
      import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";
    // Redirect to OAuth2 authorization endpoint
    window.location.href = `${backendBaseUrl}/oauth2/authorization/google`;
  },
}));
