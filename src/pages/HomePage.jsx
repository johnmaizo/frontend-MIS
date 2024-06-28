import { Link } from "react-router-dom"

const HomePage = () => {
  return (
    <main className=" h-screen grid place-content-center bg-purple-400 text-4xl font-semibold text-center">
        <div>
            <h1 className=" text-black">Welcome to Benedicto College!</h1>
            <Link to={"/auth/signin"} className=" text-blue-600 hover:underline">Click here to log-in!</Link>
        </div>
    </main>
  )
}

export default HomePage