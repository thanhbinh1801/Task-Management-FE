import { Outlet } from "react-router-dom";

export default function AppLayout () {
  return (
    <div>
      <div className="h-[300px]"> App Layout </div>
      <Outlet />
    </div>
  )
}