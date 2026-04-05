import { Route, Routes } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import { ToastContainer } from "react-toastify"

const App = () => {
  return (
    <>
    <ToastContainer/>
    <Routes>
      <Route path="/" element={<Dashboard/>} />
      <Route path="/auth" element={<Login/>} />
    </Routes>
    </>
  )
}

export default App