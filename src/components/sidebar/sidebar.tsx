import { useWorkspace } from "@/hooks/useWorkspace";
import type { Workspace } from "@/hooks/useWorkspace";

export default function Sidebar() {
  const { workspaces } = useWorkspace();
  
  return (
    <div>
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
          <span className="text-white font-bold">T</span>
        </div>
        <h2 className="text-xl font-bold">TaskManagement</h2>
      </div>

      <div className="space-y-1 mb-6">
        <div className="text-sm font-medium text-gray-500 px-3 py-1">
          Navigation
        </div>
        <div className="px-3 py-2 rounded hover:bg-gray-100 cursor-pointer font-medium">
          Dashboard
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-sm font-medium text-gray-500 px-3 py-1">
          Workspaces
        </div>
        {workspaces.map((ws: Workspace) => (
          <div
            key={ws.id}
            className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded cursor-pointer"
          >
            {ws.name}
          </div>
        ))}
      </div>
    </div>
  );
}
