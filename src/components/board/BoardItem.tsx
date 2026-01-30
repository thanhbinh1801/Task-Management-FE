import { useBoardStore } from "@/store/useBoardStore";
import { useParams } from "react-router-dom";

import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  defaultDropAnimationSideEffects,
  closestCorners,
  type DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { useBoardDnD } from "@/hooks/useBoardDnD";
import { useState } from "react";
import ListComponent from "../list/list";
import { createPortal } from "react-dom";
import CardComponent from "../card/card";

import AddListButton from "../list/AddListButton";


export default function BoardItem() {
  const { workspaceId, boardId } = useParams<{
    workspaceId: string;
    boardId: string;
  }>();


  const currentBoard = useBoardStore((state) => state.currentBoard);
  const setCurrentBoard = useBoardStore((state) => state.setCurrentBoard);
  const updateList = useBoardStore((state) => state.updateList);
  const updateCard = useBoardStore((state) => state.updateCard);

  const { handleDragEnd } = useBoardDnD(
    currentBoard,
    setCurrentBoard,
    workspaceId,
    boardId,
    { updateList, updateCard }
  );

  // State for drag overlay
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<"LIST" | "CARD" | null>(null);
  const [activeItem, setActiveItem] = useState<any>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    setActiveType(active.data.current?.type);

    // Find the item being dragged
    if (active.data.current?.type === "LIST") {
      setActiveItem(currentBoard?.lists?.find(l => l.id === active.id));
    } else if (active.data.current?.type === "CARD") {
      const list = currentBoard?.lists?.find(l => l.cards?.some(c => c.id === active.id));
      const card = list?.cards?.find(c => c.id === active.id);
      setActiveItem(card);
    }
  };

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  const createList = useBoardStore((state) => state.createList);
  const isLoading = useBoardStore((state) => state.isLoading);
  const error = useBoardStore((state) => state.error);

  const handleAddList = async (name: string) => {
    if (boardId && workspaceId) {
      await createList(workspaceId, boardId, { name });
    }
  };



  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[calc(100vh-100px)]">
        <div className="text-gray-500">Loading board...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full min-h-[calc(100vh-100px)]">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!currentBoard) {
    return (
      <div className="flex items-center justify-center h-full min-h-[calc(100vh-100px)]">
        <div className="text-gray-500">Board not found</div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={(event) => {
        handleDragEnd(event);
        setActiveId(null);
        setActiveType(null);
        setActiveItem(null);
      }}
    >
      <div className="min-h-screen bg-gray-50">
        <div className="min-h-screen bg-gray-50 pt-4">
          <div className="px-6 pb-6 overflow-x-auto">
            <div className="flex gap-4 items-start">
              <SortableContext
                items={currentBoard.lists?.map((list) => list.id) || []}
                strategy={horizontalListSortingStrategy}
              >
                {currentBoard.lists?.map((list) => (
                  <ListComponent
                    key={list.id}
                    list={list}
                    board={currentBoard}
                    setBoard={setCurrentBoard}
                    workspaceId={workspaceId!}
                    boardId={boardId!}
                  />
                ))}
              </SortableContext>

              <div className="w-[272px] flex-shrink-0">
                <AddListButton
                  onAddList={handleAddList}
                  isBoardEmpty={!currentBoard.lists || currentBoard.lists.length === 0}
                />
              </div>
            </div>
          </div>
        </div>
        {createPortal(
          <DragOverlay dropAnimation={dropAnimation}>
            {activeId && activeType === "LIST" && activeItem && (
              <ListComponent
                list={activeItem}
                board={currentBoard}
                setBoard={setCurrentBoard}
                workspaceId={workspaceId!}
                boardId={boardId!}
              />
            )}
            {activeId && activeType === "CARD" && activeItem && (
              <CardComponent card={activeItem} listId={activeItem.listId || ""} />
            )}
          </DragOverlay>,
          document.body
        )}
      </div>
    </DndContext>
  );
}
