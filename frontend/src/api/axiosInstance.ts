import axios, {
  type AxiosInstance,
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

let rawBaseURL = import.meta.env.VITE_API_URL || "https://commerce-backend-eafn.onrender.com";
if (rawBaseURL && !rawBaseURL.endsWith("/api/v1") && !rawBaseURL.endsWith("/api/v1/")) {
  rawBaseURL = rawBaseURL.replace(/\/+$/, "") + "/api/v1";
}
export const baseURL = rawBaseURL.replace(/\/+$/, "");

export const api: AxiosInstance = axios.create({
  withCredentials: true,
  baseURL,
  timeout: 10000,
});

// Parallel 401 refresh so'rovlarini to'g'ri boshqarish uchun navbat (Queue / Mutex)
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// Ochiq auth yo'llari (bularga token yuborish shart emas va 401 bo'lsa refresh qilinmaydi)
const publicAuthRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/verify-email",
  "/auth/resend-otp",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/refresh",
  "/auth/google",
];

const isAuthRoute = (url?: string): boolean => {
  if (!url) return false;
  return publicAuthRoutes.some((route) => url.includes(route));
};

// Request Interceptor: Logging va JWT token qo'shish
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");

    if (token && !isAuthRoute(config.url)) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (import.meta.env.DEV) {
      console.debug(`[API REQ] ${config.method?.toUpperCase()} ${config.url}`, config.params || "");
    }
    return config;
  },
  (error: AxiosError) => {
    console.error("[API REQ ERROR]", error);
    return Promise.reject(error);
  }
);

// Response Interceptor: Faqat 401 Unauthorized bo'lganda avto-refresh qilish (Queue bilan)
api.interceptors.response.use(
  (response: AxiosResponse) => {
    if (import.meta.env.DEV) {
      console.debug(`[API RES] ${response.status} ${response.config.url}`);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const status = error.response?.status;
    const errorData = error.response?.data as any;

    if (errorData && import.meta.env.DEV) {
      console.warn(`[API ERROR ${status}] ${originalRequest?.url}:`, {
        message: errorData.message,
        validationErrors: errorData.validationErrors,
        path: errorData.path,
      });
    }

    // Faqat 401 Unauthorized da refresh qilish kerak (403 Forbidden huquq yetarli emasligini bildiradi)
    if (status === 401 && originalRequest && !originalRequest._retry) {
      // Agar so'rov auth endpointlarining o'ziga bo'lsa, qayta urinmaymiz
      if (isAuthRoute(originalRequest.url)) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Agar boshqa so'rov allaqachon refresh qilayotgan bo'lsa, navbatda kutamiz
        return new Promise<AxiosResponse>((resolve, reject) => {
          failedQueue.push({
            resolve: (newToken: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
              }
              resolve(api(originalRequest));
            },
            reject: (err: unknown) => {
              reject(err);
            },
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Alohida toza axios so'rovi orqali tokenni yangilash
        const response = await axios.get<{ accessToken: string }>(`${baseURL}/auth/refresh`, {
          withCredentials: true,
        });

        const newAccessToken = response.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        // Global hodisa orqali Zustand store va boshqa joylarni sinxronizatsiya qilish
        window.dispatchEvent(
          new CustomEvent("auth:token-refreshed", { detail: { token: newAccessToken } })
        );

        processQueue(null, newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.removeItem("accessToken");

        window.dispatchEvent(new CustomEvent("auth:session-expired"));

        // Agar foydalanuvchi himoyalangan sahifada bo'lsa, login sahifasiga yo'naltirish
        const publicPaths = ["/", "/auth", "/forgot-password", "/reset-password", "/verify-email", "/track"];
        const currentPath = window.location.pathname;
        const isPublicPath = publicPaths.some(p => currentPath === p || currentPath.startsWith("/products/"));

        if (!isPublicPath) {
          window.location.href = `/auth?redirect=${encodeURIComponent(currentPath)}`;
        }

        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
