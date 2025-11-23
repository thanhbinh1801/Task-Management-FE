import { Navigate } from "react-router-dom"

export default function ProtectedRoute({children}) {
  const isLoggedIn = localStorage.getItem("access-token");
  if(isLoggedIn) {
    return children
  }
  else {
    
    return <Navigate to={"/login"} replace ></Navigate> 
  }
}