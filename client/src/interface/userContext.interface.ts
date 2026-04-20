import type { ForgotForm, LoginForm, RegisterForm } from "../schema/authForm";
import type IUser from "./user.interface";



export default interface UserContextType {
    user: IUser | null;
    loading: boolean;
    sent: boolean;
    sentEmail: string;
    setUser: (user: IUser | null) => void;
    setLoading: (loading: boolean) => void;
    loginSubmit: (values: LoginForm) => void;
    registerSubmit: (values: RegisterForm) => void;
    forgotPasswordSubmit: (value: ForgotForm) => void;

}