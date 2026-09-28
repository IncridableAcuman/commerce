import { Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Auth from '../pages/Auth';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import { ToastContainer } from 'react-toastify';
import NotFound from '../pages/NotFound';
const AppRoute = () => {
  return (
    <>
    <ToastContainer/>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/auth' element={<Auth/>} />
      <Route path='/forgot-password' element={<ForgotPassword/>} />
      <Route path='/reset-password' element={<ResetPassword/>} />
      <Route path='*' element={<NotFound/>} />
    </Routes>
    </>
  )
}

export default AppRoute