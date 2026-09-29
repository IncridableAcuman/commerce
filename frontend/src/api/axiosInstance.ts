import axios, { type AxiosInstance, AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

export const api: AxiosInstance = axios.create({
    withCredentials: true,
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1",
    timeout: 10000,
});

// Request Interceptor: Auth yo'nalishlariga eskirgan tokenni biriktirmaslik
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const isAuthRoute = config.url?.includes('/auth/');
        const token = localStorage.getItem("accessToken");

        if (token && !isAuthRoute) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

// Response Interceptor: 401/403 bo'lganda avto-refresh qilish
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        if ((error.response?.status === 401 || error.response?.status === 403) && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;

            // Refresh so'rovining o'zi muvaffaqiyatsiz bo'lsa siklni to'xtatamiz
            if (originalRequest.url?.includes('/auth/refresh')) {
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
                window.location.href = "/auth";
                return Promise.reject(refreshErr);
            }
        }
        return Promise.reject(error);
    }
);

export default api;