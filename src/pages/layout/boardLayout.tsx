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
    <div>
      <div className="h-[300px]" onClick={() => { navigate("/") }}> Trello </div>
      <BoardHeader />
      <Outlet />
    </div>
  )
}