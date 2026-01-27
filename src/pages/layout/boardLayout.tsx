import { Outlet } from "react-router-dom";

export default function BoardLayout() {
  return (
    <div>
      <div className="h-[300px]"> Header Board </div>
      <Outlet />
    </div>
  )
}