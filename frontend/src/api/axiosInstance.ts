import axios, { type AxiosInstance, AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

export const api: AxiosInstance = axios.create({
    withCredentials: true,
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1",
    timeout: 10000,
});

// Request Interceptor: Logging va JWT token qo'shish
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const publicAuthRoutes = [
            '/auth/login',
            '/auth/register',
            '/auth/verify-email',
            '/auth/resend-otp',
            '/auth/forgot-password',
            '/auth/reset-password',
            '/auth/refresh',
            '/auth/google'
        ];
        const isPublicAuthRoute = publicAuthRoutes.some(route => config.url?.endsWith(route));
        const token = localStorage.getItem("accessToken");

        if (token && !isPublicAuthRoute) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        if (import.meta.env.DEV) {
            console.debug(`[API REQ] ${config.method?.toUpperCase()} ${config.url}`, config.params || "");
        }
        return config;
    },
    (error: AxiosError) => {
        console.error('[API REQ ERROR]', error);
        return Promise.reject(error);
    }
);

// Response Interceptor: 401/403 bo'lganda avto-refresh qilish va xatoliklarni chiroyli loglash
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

        const errorData = error.response?.data as any;
        if (errorData) {
            console.warn(`[API ERROR ${error.response?.status}] ${error.config?.url}:`, {
                message: errorData.message,
                validationErrors: errorData.validationErrors,
                path: errorData.path
            });
        }

        if ((error.response?.status === 401 || error.response?.status === 403) && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;

            // Refresh so'rovining o'zi muvaffaqiyatsiz bo'lsa siklni to'xtatamiz
            if (originalRequest.url?.includes('/auth/refresh') || originalRequest.url?.includes('/auth/login')) {
                localStorage.removeItem("accessToken");
                return Promise.reject(error);
            }

            try {
                const { data } = await api.get("/auth/refresh", { withCredentials: true });
                localStorage.setItem("accessToken", data.accessToken);
                
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                }
                return api(originalRequest);
            } catch (refreshErr) {
                localStorage.removeItem("accessToken");
                // Agar ochiq sahifada bo'lmasa, auth sahifasiga yo'naltirish
                if (!window.location.pathname.startsWith('/auth') && window.location.pathname !== '/') {
                    window.location.href = "/auth";
                }
                return Promise.reject(refreshErr);
            }
        }
        return Promise.reject(error);
    }
);

export default api;