import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Auth from "./pages/Auth"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import { ToastContainer } from "react-toastify"
import Register from "./pages/Register"
import VerifyEmailPage from "./pages/VerifyEmailPage"

const App = () => {
  return (
    <>
    <ToastContainer/>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/auth" element={<Auth/>} />
      <Route path="/forgot-password" element={<ForgotPassword/>} />
      <Route path="/reset-password" element={<ResetPassword/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/verify-email" element={<VerifyEmailPage/>} />
    </Routes>
    </>
  )
}

export default App