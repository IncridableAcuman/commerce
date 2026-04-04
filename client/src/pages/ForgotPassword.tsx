import {  Mail } from "lucide-react";

const ForgotPassword = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-md p-6">
        <h1 className="text-2xl font-semibold py-4">Forgot Password</h1>
        <form className="space-y-6">
          
          <div className="flex items-center gap-2 border  p-2 rounded-md">
            <Mail/>
            <input type="email" placeholder="example@gmail.com" className="outline-none w-full" />
          </div>
          <button type="submit" className="w-full bg-black text-white p-3 rounded-md cursor-pointer hover:bg-gray-800
           transition dur3">Send to email</button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
