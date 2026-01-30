import { useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import BoardHeader from "@/components/board/BoardHeader";
import { useBoardStore } from "@/store/useBoardStore";

export default function BoardLayout() {
  const { workspaceId, boardId } = useParams<{
    workspaceId: string;
    boardId: string;
  }>();

  const currentBoard = useBoardStore((state) => state.currentBoard);
  const isLoading = useBoardStore((state) => state.isLoading);
  const fetchBoardById = useBoardStore((state) => state.fetchBoardById);
  const setCurrentBoard = useBoardStore((state) => state.setCurrentBoard);

  useEffect(() => {
    if (!workspaceId || !boardId) return;
    fetchBoardById(workspaceId, boardId);
  }, [workspaceId, boardId, fetchBoardById]);

  if (isLoading) return <div>Loading board...</div>;
  if (!currentBoard) return <div>Board not found</div>;

  return (
    <div className="h-screen flex flex-col">
      <BoardHeader />
      <div className="flex-1 overflow-auto">
        <Outlet context={{ board: currentBoard, setBoard: setCurrentBoard, workspaceId, boardId }} />
      </div>
    </div>
  );
}
