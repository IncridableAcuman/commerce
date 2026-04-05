import { Lock, Mail, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import z from "zod";
import { registerSchema } from "../schema/auth.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import axiosInstance from "../api/axios.instance";

const Register = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    try {
      const { data } = await axiosInstance.post("/auth/register", values);
      localStorage.setItem("accessToken", data.accessToken);
      toast.success("Successfully");
      navigate("/");
    } catch (error) {
      console.log(error);
      localStorage.removeItem("accessToken");
      toast.error("Registration failed");
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-md p-6">
        <h1 className="text-2xl font-semibold py-4">Sign Up Now</h1>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 border p-2 rounded-md">
              <UserRound />
              <input
                {...register("firstname")}
                type="text"
                placeholder="Firstname"
                className="outline-none w-full"
              />
            </div>
            {errors.firstname && (
              <span className="text-xs text-red-500">
                {errors.firstname.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 border  p-2 rounded-md">
              <UserRound />
              <input
                {...register("lastname")}
                type="text"
                placeholder="Lastname"
                className="outline-none w-full"
              />
            </div>
            {errors.lastname && (
              <span className="text-xs text-red-500">
                {errors.lastname.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 border  p-2 rounded-md">
              <UserRound />
              <input
                {...register("username")}
                type="text"
                placeholder="Username"
                className="outline-none w-full"
              />
            </div>
            {errors.username && (
              <span className="text-xs text-red-500">
                {errors.username.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 border  p-2 rounded-md">
              <Mail />
              <input
                {...register("email")}
                type="email"
                placeholder="example@gmail.com"
                className="outline-none w-full"
              />
            </div>
            {errors.email && (
              <span className="text-xs text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 border p-2 rounded-md">
              <Lock />
              <input
                {...register("password")}
                type="password"
                placeholder="********"
                className="outline-none w-full"
              />
            </div>
            {errors.password && (
              <span className="text-xs text-red-500">
                {errors.password.message}
              </span>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white p-3 rounded-md cursor-pointer hover:bg-gray-800
           transition dur3"
          >
            Sign Up Now
          </button>
        </form>
        <div className="pt-4">
          <p>
            Already have an account?{" "}
            <Link
              to={"/auth"}
              className="font-bold cursor-pointer hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
