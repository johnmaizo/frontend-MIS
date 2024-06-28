import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../components/context/AuthContext"

const SessionExpired = () => {
  const navigate = useNavigate()
  const { logout } = useContext(AuthContext)

  const handleLogout = () => {
    logout(true);
    navigate("/");
  };

  return (
    <div className=" h-screen w-screen fixed grid place-content-center z-[10010] bg-black/50 backdrop-blur-sm">
        <div className=" p-5 bg-white">
            <h2 className=" text-2xl font-semibold ">Session Expired</h2>
            <p>Your session has expired. Please log in again.</p>
            <button onClick={handleLogout} className=" text-blue-600 hover:underline">Log In</button>
        </div>
    </div>
  )
}

export default SessionExpired