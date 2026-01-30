import BoardHeader from "@/components/board/BoardHeader";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useBoardStore } from "@/store/useBoardStore";
import { useEffect } from "react";

export default function BoardLayout() {
  const navigate = useNavigate();
  const { workspaceId, boardId } = useParams<{ workspaceId: string; boardId: string }>();
  const fetchBoardById = useBoardStore((state) => state.fetchBoardById);

  useEffect(() => {
    if (workspaceId && boardId) {
      fetchBoardById(workspaceId, boardId);
    }
  }, [workspaceId, boardId, fetchBoardById]);

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-2 flex items-center gap-2">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:bg-gray-100 rounded px-2 py-1 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="font-semibold text-gray-900">TaskManagement</span>
          </button>
        </div>
      </div>

      {/* Board Header */}
      <BoardHeader />
      
      {/* Board Content */}
      <div className="flex-1 overflow-hidden bg-white">
        <Outlet />
      </div>
    </div>
  )
}