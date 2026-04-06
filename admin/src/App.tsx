import { Route, Routes } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import { ToastContainer } from "react-toastify"
import Layout from "./layout/Layout"
import AddItems from "./pages/AddItems"
import Items from "./pages/Items"
import Orders from "./pages/Orders"

const App = () => {
  return (
    <>
    <ToastContainer/>
    <Routes>
      <Route path="/" element={<Layout/>}>
      <Route index element={<Dashboard/>} />
      <Route path="add" element={<AddItems/>} />
      <Route path="items" element={<Items/>} />
      <Route path="orders" element={<Orders/>} />
      </Route>
      <Route path="/login" element={<Login/>} />
    </Routes>
    </>
  )
}

export default App