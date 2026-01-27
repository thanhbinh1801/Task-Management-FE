import React from "react";
<<<<<<< HEAD
import {
  ItemGroup,
  ItemHeader,
  ItemContent,
  ItemTitle,
  Item,
  ItemDescription,
  ItemSeparator,
} from "../../components/ui/item.tsx";
import { useWorkspace } from "@/hooks/useWorkspace.ts";
import type { Workspace } from "@/hooks/useWorkspace.ts";
=======
import { useWorkspaceStore } from "@/store/useWorkSpaceStore";
import type { Workspace } from "@/store/useWorkSpaceStore";
>>>>>>> 92dd1e2 (dung store de luu cac state chung thay cho dung cac hook rieng le, sua ít giao dien sidebar)
import { Loader } from "lucide-react";
import { CreateWorkspaceDialog } from "@/components/workspaces/createWorkspace.tsx";
import { CreateBoardDialog } from "../board/createBoard.tsx";
import { useBoardStore } from "@/store/useBoardStore";
import { Link } from "react-router-dom";

export default function WorkspaceList() {
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const isLoading = useWorkspaceStore((state) => state.isLoading);
  const error = useWorkspaceStore((state) => state.error);
  const createWorkspace = useWorkspaceStore((state) => state.createWorkspace);
  const createBoard = useBoardStore((state) => state.createBoard);

  async function handleCreateBoard(data: {
    nameBoard: string;
    workspaceId: string;
  }) {
    await createBoard(data);
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  if (!workspaces || workspaces.length === 0) {
    return (
      <div className="px-4">
        <h2 className="text-2xl font-bold mb-6">
          Bạn chưa có không gian làm việc
        </h2>
        <p className="text-gray-600 mb-6">
          Tạo workspace đầu tiên của bạn để bắt đầu quản lý công việc
        </p>
        <CreateWorkspaceDialog createWorkspace={createWorkspace} variant="hero" />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center pl-4 mb-6">
        <h2 className="text-2xl font-bold">Các không gian làm việc của bạn</h2>
        <CreateWorkspaceDialog createWorkspace={createWorkspace} />
      </div>
      
      <div className="space-y-8 pl-4">
        {workspaces.map((ws: Workspace) => (
          <div key={ws.id} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">
                  {ws.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">{ws.name}</h3>
                <p className="text-sm text-gray-500">
                  Visibility: {ws.visibility ?? "—"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {ws.boards?.map((b) => (
                <Link
                  key={b.id}
                  to={`/workspace/${ws.id}/board/${b.id}`}
                  className="block"
                >
                  <div className="h-20 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center p-3">
                    <span className="text-white font-semibold text-center text-sm line-clamp-2">
                      {b.name}
                    </span>
                  </div>
                </Link>
              ))}

              <CreateBoardDialog
                createBoard={handleCreateBoard}
                workspaces={workspaces}
                defaultWorkspaceId={ws.id}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
