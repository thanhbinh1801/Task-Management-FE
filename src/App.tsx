import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

export function App() {
  const hasToken  = !! localStorage.getItem("access-token");
  const [view, setView] = useState<"login" | "register" | "dashboard">( hasToken ? "dashboard" : "login");

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