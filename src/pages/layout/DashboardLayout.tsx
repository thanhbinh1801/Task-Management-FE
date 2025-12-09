import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div>
      <div className="h-[300px]"> Header Dashboard </div>
      <Outlet />
    </div>
  )
}