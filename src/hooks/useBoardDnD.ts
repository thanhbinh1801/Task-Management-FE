import { arrayMove } from "@dnd-kit/sortable";
import { boardApi } from "../lib/board.api.ts";
import { calculateNewPosition } from "../lib/position.util.ts";
import type { Board } from "../components/type/type.ts";

export function useBoardDnD(
  board: Board | null,
  setBoard: React.Dispatch<React.SetStateAction<Board | null>>,
  workspaceId?: string,
  boardId?: string
) {
  
  if (!board) {
    return { handleDragEnd: () => {} };
  }
  
  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    // ===== KÉO LIST =====
    if (activeType === "LIST" && overType === "LIST") {
      if (active.id === over.id) return; // Cùng vị trí

      setBoard(prevBoard => {
        if (!prevBoard || !prevBoard.lists) return prevBoard;
        
        // Sort theo position trước
        const sortedLists = [...prevBoard.lists].sort((a, b) => a.position - b.position);
        
        const oldIndex = sortedLists.findIndex(l => l && l.id === active.id);
        const newIndex = sortedLists.findIndex(l => l && l.id === over.id);
        
        if (oldIndex === -1 || newIndex === -1) return prevBoard;
        
        // Sắp xếp lại mảng
        const newLists = arrayMove(sortedLists, oldIndex, newIndex);
        
        // Tính position mới cho item vừa di chuyển
        const prevList = newLists[newIndex - 1];
        const nextList = newLists[newIndex + 1];
        
        const newPosition = calculateNewPosition(
          prevList?.position,
          nextList?.position
        );
        
        // Tạo object mới với position mới (KHÔNG mutate)
        newLists[newIndex] = {
          ...newLists[newIndex],
          position: newPosition,
        };
        
        // Gọi API update
        if (workspaceId && boardId) {
          boardApi.updateList({
            workspaceId,
            boardId,
            listId: newLists[newIndex].id,
            position: newPosition,
          }).catch(err => {
            console.error('Failed to update list position:', err);
          });
        }
        
        return { ...prevBoard, lists: newLists };
      });
    }

    // ===== KÉO CARD =====
    if (activeType === "CARD") {
      const fromListId = active.data.current.listId;
      const toListId = over.data.current.listId;
      
      if (fromListId === toListId && active.id === over.id) return;

      setBoard(prevBoard => {
        if (!prevBoard || !prevBoard.lists) return prevBoard;
        
        const newLists = structuredClone(prevBoard.lists);
        
        const fromList = newLists.find(l => l && l.id === fromListId);
        const toList = newLists.find(l => l && l.id === toListId);
        
        if (!fromList || !toList || !fromList.cards || !toList.cards) return prevBoard;
        
        // Sort cards theo position
        fromList.cards.sort((a, b) => a.position - b.position);
        toList.cards.sort((a, b) => a.position - b.position);
        
        const fromIndex = fromList.cards.findIndex(c => c.id === active.id);
        const toIndex = toList.cards.findIndex(c => c.id === over.id);
        
        // Di chuyển card
        const [movedCard] = fromList.cards.splice(fromIndex, 1);
        toList.cards.splice(toIndex, 0, movedCard);
        
        // Tính position mới
        const prevCard = toList.cards[toIndex - 1];
        const nextCard = toList.cards[toIndex + 1];
        
        const newPosition = calculateNewPosition(
          prevCard?.position,
          nextCard?.position
        );
        
        // Tạo object mới với position mới (KHÔNG mutate)
        toList.cards[toIndex] = {
          ...movedCard,
          position: newPosition,
        };
        
        // Sort lại cards theo position sau khi update
        toList.cards.sort((a, b) => a.position - b.position);
        
        // Gọi API
        if (workspaceId && boardId) {
          console.log('Calling updateCard API:', { workspaceId, boardId, fromListId, toListId, cardId: movedCard.id, position: newPosition });
          boardApi.updateCard({
            workspaceId,
            boardId,
            listId: fromListId,
            cardId: movedCard.id,
            nameCard: movedCard.name,
            position: newPosition,
            listIdTarget: toListId,
          }).catch(err => {
            console.error('Failed to update card position:', err);
          });
        } else {
          console.warn('Cannot call API: workspaceId or boardId is missing', { workspaceId, boardId });
        }
        
        return { ...prevBoard, lists: newLists };
      });
    }
  }

  return { handleDragEnd };
}