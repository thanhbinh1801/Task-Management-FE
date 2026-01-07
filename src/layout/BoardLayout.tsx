import { useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import BoardHeader from "@/components/board/BoardHeader";
import { useBoard } from "@/hooks/useBoard";

export default function BoardLayout() {
  const { workspaceId, boardId } = useParams<{
    workspaceId: string;
    boardId: string;
  }>();

  const { board, setBoard, fetchBoardById, loading } = useBoard();

  useEffect(() => {
    if (!workspaceId || !boardId) return;
    fetchBoardById(workspaceId, boardId);
  }, [workspaceId, boardId]);

  if (loading) return <div>Loading board...</div>;
  if (!board) return <div>Board not found</div>;

  return (
    <div className="h-screen flex flex-col">
      <BoardHeader board={board} />
      <div className="flex-1 overflow-auto">
        <Outlet context={{ board, setBoard, workspaceId, boardId }} />
      </div>
    </div>
  );
}
