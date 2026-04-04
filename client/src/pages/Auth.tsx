import { Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import type z from "zod";
import { loginSchema, type loginSchema } from "../schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";

const Auth = () => {

  const loginForm = useForm<z.input<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-md p-6">
        <h1 className="text-2xl font-semibold py-4">Sign In Now</h1>
        <form className="space-y-6">
          <div className="flex items-center gap-2 border  p-2 rounded-md">
            <Mail />
            <input
              type="email"
              placeholder="example@gmail.com"
              className="outline-none w-full"
            />
          </div>
          <div className="flex items-center gap-2 border p-2 rounded-md">
            <Lock />
            <input
              type="password"
              placeholder="********"
              className="outline-none w-full"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white p-3 rounded-md cursor-pointer hover:bg-gray-800
           transition dur3"
          >
            Sign In Now
          </button>
        </form>
        <div className="pt-4">
              <p>Don't have an account? <Link to={'/register'} className="hover: underline font-bold">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
