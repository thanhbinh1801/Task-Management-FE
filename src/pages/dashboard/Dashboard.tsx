import { ChevronRight, ChevronLeft } from "lucide-react";
import { useSidebar } from "@/hooks/useSidebar.ts";
import Sidebar from "@/components/sidebar/sidebar.tsx";
import WorkspaceList from "@/components/workspaces/WorkspaceList.tsx";

function Dashboard() {

  const { isOpen, toggleSidebar } = useSidebar();



  return (
    <div className="min-h-screen flex relative">
      {/* Sidebar */}

      <div
        className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 p-4 flex flex-col transition-all duration-300 ${
          isOpen ? "w-64" : "w-0 p-0 overflow-hidden border-none"
        }`}
      >
        <Sidebar></Sidebar>

        {/* Chevron Toggle Button */}
        <button
          onClick={toggleSidebar}
          style={{ top: "50%", transform: "translateY(-50%)" }}
          className={` absolute right-0 w-4 h-full bg-white border border-gray-200 shadow-md cursor-pointer flex items-center justify-center transition-all duration-300 `}
        >
          {isOpen ? (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* Main Content Area */}
      <div
        className={`space-y-4 flex-1 transition-all duration-300 ${
          isOpen ? "ml-64" : "ml-10"
        }`}
      >
        <div className="flex justify-between items-center mb-8 border border-black-200 px-2 py-3 ">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <WorkspaceList></WorkspaceList>
      </div>
    </div>
  );
}

export default Dashboard;
