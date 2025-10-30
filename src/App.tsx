import { useEffect, useState } from "react";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
// import { api } from "./lib/api";

export function App() {
  const [view, setView] = useState<"login" | "register" | "dashboard">("login");

  // useEffect(() => {

  //   async function fetchUser() {
  //     const res = await api.get("/auth/me");
  //     console.log("Fetch user on App.tsx: ", res.data);
  //     if(res.status === 200){
  //       setView("dashboard");    
  //     } else {
  //       setView("login");
  //     }
  //   }
  //   fetchUser();
  // }, []);

  const goToLogin = () => {
    setView("login");
  }

  const goToRegister = () => {
    setView("register");
  }

  const goToDashboard = () => {
    setView("dashboard");
  }

  return (
    <div>
      { view === "dashboard" && <Dashboard/>}
      { view === "login" && <Login goRegister={goToRegister} goDashboard={goToDashboard}/>}
      { view === "register" && <Register goLogin={goToLogin} />}
    </div>
  )
}