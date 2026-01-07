import { useOutletContext } from "react-router-dom";
import { DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

import { useBoardDnD } from "@/hooks/useBoardDnD";
import ListComponent from "../list/list";
import AddListButton from "../list/AddListButton";
import { boardApi } from "@/lib/board.api";
import type { Board } from "@/components/type/type";

interface BoardOutletContext {
  board: Board;
  setBoard: (board: Board) => void;
  workspaceId: string;
  boardId: string;
}

export default function BoardItem() {
  const { board, setBoard, workspaceId, boardId } =
    useOutletContext<BoardOutletContext>();
  const { handleDragEnd } = useBoardDnD(board, setBoard, workspaceId, boardId);

  const handleAddList = async (nameList: string) => {
    try {
      const response = await boardApi.createList({
        workspaceId,
        boardId,
        nameList,
      });

      // Cập nhật board với list mới
      if (response.data?.data) {
        const newList = response.data.data;
        setBoard({
          ...board,
          lists: [...board.lists, newList],
        });
      }
    } catch (error) {
      console.error("Error creating list:", error);
      throw error;
    }
  };

  return (
    <div className="p-4">
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex gap-3 items-start">
          <SortableContext
            items={board.lists.map((l) => l.id)}
            strategy={horizontalListSortingStrategy}
          >
            {board.lists.map((list) => (
              <ListComponent key={list.id} list={list} />
            ))}
          </SortableContext>
          <AddListButton onAddList={handleAddList} />
        </div>
      </DndContext>
    </div>
  );
}
