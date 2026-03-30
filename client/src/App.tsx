import { Route, Routes } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import Home from "./pages/Home"

const App = () => {
  return (
    <>
    <Routes>
      <Route path="/landing" element={<LandingPage/>} />
      <Route path="/" element={<Home/>} />
    </Routes>
    </>
  )
}

export default App