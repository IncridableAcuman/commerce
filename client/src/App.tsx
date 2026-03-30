import { Route, Routes } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import Home from "./pages/Home"
import Auth from "./pages/Auth"

const App = () => {
  return (
    <>
    <Routes>
      <Route path="/landing" element={<LandingPage/>} />
      <Route path="/" element={<Home/>} />
      <Route path="/auth" element={<Auth/>} />
    </Routes>
    </>
  )
}

export default App