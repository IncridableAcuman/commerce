import axios, { AxiosError, type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";

const adminAxiosInstance: AxiosInstance = axios.create({
    withCredentials: true,
    baseURL: "http://localhost:8080/api/v1"
});

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig{
    _retry:boolean;
}

adminAxiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("accessToken")
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

adminAxiosInstance.interceptors.response.use(
    (response:AxiosResponse)=> response,
    async (error:AxiosError)=>{
        const originalRequest = error.config as CustomAxiosRequestConfig;

        if(error.response?.status === 401 && !originalRequest._retry){
            originalRequest._retry=true;
            try {
                const {data} = await adminAxiosInstance.get("/auth/refresh");
                localStorage.setItem("accessToken",data.accessToken);
                originalRequest.headers.Authorization=`Bearer ${data.accessToken}`;
                return adminAxiosInstance(originalRequest);
            } catch (error) {
                console.log(error);
                localStorage.removeItem("accessToken");
                window.location.href="/login"
            }
        }
    }
);

export default adminAxiosInstance;