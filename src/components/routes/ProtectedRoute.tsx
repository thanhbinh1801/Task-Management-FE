import { Navigate } from "react-router-dom"
import { type ReactNode } from "react"

export default function ProtectedRoute({children}: {children: ReactNode}) {
  const isLoggedIn = localStorage.getItem("access-token");
  if(isLoggedIn) {
    return children
  }
  else {
    
    return <Navigate to={"/login"} replace ></Navigate> 
  }
}