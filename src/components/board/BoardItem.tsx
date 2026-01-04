import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

import { useBoard } from "@/hooks/useBoard";
import { useBoardDnD } from "@/hooks/useBoardDnD";
import ListComponent from "../list/list";

export default function BoardItem() {
  const { workspaceId, boardId } = useParams<{
    workspaceId: string;
    boardId: string;
  }>();

  const { board, setBoard, fetchBoardById } = useBoard();
  const { handleDragEnd } = useBoardDnD(board, setBoard, workspaceId, boardId);

  // Sort lists theo position (trái -> phải)
  const sortedLists = useMemo(
    () =>
      board?.lists
        ? [...board.lists].sort((a, b) => a.position - b.position)
        : [],
    [board?.lists]
  );

  useEffect(() => {
    if (!workspaceId || !boardId) return;
    fetchBoardById(workspaceId, boardId);
  }, [workspaceId, boardId]);

  if (!board) return <div>Loading...</div>;

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext
        items={sortedLists.map((l) => l.id)}
        strategy={horizontalListSortingStrategy}
      >
        <div style={{ display: "flex", gap: 12 }}>
          {sortedLists.map((list) => (
            <ListComponent key={list.id} list={list} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
