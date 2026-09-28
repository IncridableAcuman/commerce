import { Eye, Lock, Mail, UserRound } from "lucide-react";
import { useState } from "react";

const Auth = () => {
  const [isAuth, setIsAuth] = useState(true);
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center">
      <div className="bg-gray-50 p-6 w-full max-w-lg border border-gray-100 rounded-lg shadow-2xl">
        <h1 className="text-2xl font-semibold py-4 text-center">Sign Up</h1>
        <form className="space-y-2">
          {!isAuth && (
            <>
              <div className="flex items-center gap-2 border border-blue-300 p-3 rounded-full">
                <UserRound />
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  placeholder="Full name"
                  className="outline-none w-full"
                />
              </div>
              <div className="flex items-center gap-2 border border-blue-300 p-3 rounded-full">
                <UserRound />
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Username"
                  className="outline-none w-full"
                />
              </div>
            </>
          )}
          <div className="flex items-center gap-2 border border-blue-300 p-3 rounded-full">
            <Mail />
            <input
              type="email"
              name="email"
              id="email"
              placeholder="example@gmail.com"
              className="outline-none w-full"
            />
          </div>
          <div className="flex items-center gap-2 border border-blue-300 p-3 rounded-full">
            <Lock />
            <input
              type="password"
              name="password"
              id="password"
              placeholder="********"
              className="outline-none w-full"
            />
            <Eye />
          </div>
          <button
            className="bg-blue-500 text-white p-3 
          rounded-full flex items-center justify-center 
          w-full cursor-pointer hover:bg-blue-300 
          transition duration-400"
          >
            Register
          </button>
        </form>
        <div className="py-4">
          {!isAuth ? (
            <p className="text-sm">
              Already have an account{" "}
              <span 
              onClick={()=> setIsAuth(true)}
              className="text-blue-500 cursor-pointer hover:underline">
                Sign In
              </span>
            </p>
          ) : (
            <p className="text-sm">
              Don't have an account?{" "}
              <span 
              onClick={()=>setIsAuth(false)}
              className="text-blue-500 cursor-pointer hover:underline">
                Sign Up
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
