import { Route, Routes } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import { ToastContainer } from "react-toastify"
import Layout from "./layout/Layout"

const App = () => {
  return (
    <>
    <ToastContainer/>
    <Routes>
      <Route path="/" element={<Layout/>}>
      <Route index element={<Dashboard/>} />
      </Route>
      <Route path="/login" element={<Login/>} />
    </Routes>
    </>
  )
}

export default App