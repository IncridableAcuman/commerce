import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar";

const Home = () => {
  const navigate = useNavigate();


  useEffect(()=>{
    const token = localStorage.getItem("accessToken");
    if(!token){
      navigate("/auth")
    }
  },[navigate])

  return (
    <div>
      <Navbar/>
    </div>
  )
}

export default Home