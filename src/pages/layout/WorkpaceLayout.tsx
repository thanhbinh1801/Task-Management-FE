import { Outlet } from "react-router-dom";

export default function WorkspaceLayout() {
  return (
    <div>
      <div className="h-[300px]"> Header Workspace </div>
      <Outlet />
    </div>
  )
}