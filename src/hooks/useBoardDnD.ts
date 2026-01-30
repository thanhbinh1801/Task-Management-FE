import { arrayMove } from "@dnd-kit/sortable";
import { calculateNewPosition } from "../utils/position.util.ts";
import type { Board } from "../components/type/type.ts";

interface DraggableBoardActions {
    updateList: (workspaceId: string, boardId: string, listId: string, data: { name?: string, position: number }) => Promise<void>;
    updateCard: (workspaceId: string, boardId: string, listId: string, cardId: string, data: { name?: string, position: number, listIdTarget?: string }) => Promise<void>;
}

export function useBoardDnD(
    board: Board | null,
    setBoard: React.Dispatch<React.SetStateAction<Board | null>>,
    workspaceId: string | undefined,
    boardId: string | undefined,
    actions: DraggableBoardActions
) {

    if (!board) {
        return { handleDragEnd: () => { } };
    }

    function handleDragEnd(event: any) {
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
                    actions.updateList(
                        workspaceId,
                        boardId,
                        newLists[newIndex].id,
                        {
                            name: newLists[newIndex].name,
                            position: newPosition,
                        }
                    ).catch(err => {
                        console.error('Failed to update list position:', err);
                    });
                }

                return { ...prevBoard, lists: newLists };
            });
        }

        // ===== KÉO CARD =====     
        if (activeType === "CARD") {
            const fromListId = active.data.current.listId;

            // Xác định toListId: nếu over là CARD thì lấy từ data, nếu là LIST thì lấy over.id
            const toListId = overType === "CARD" ? over.data.current.listId : over.id;

            if (fromListId === toListId && active.id === over.id) return;

            setBoard(prevBoard => {
                if (!prevBoard || !prevBoard.lists) return prevBoard;

                // Clone hiệu quả hơn structuredClone
                const newLists = prevBoard.lists.map(list => ({
                    ...list,
                    cards: list.cards ? [...list.cards] : []
                }));

                const fromList = newLists.find(l => l && l.id === fromListId);
                const toList = newLists.find(l => l && l.id === toListId);

                if (!fromList || !toList || !fromList.cards || !toList.cards) return prevBoard;

                // Sort both lists by position to ensure indices are correct
                fromList.cards.sort((a, b) => a.position - b.position);
                if (fromListId !== toListId) {
                    toList.cards.sort((a, b) => a.position - b.position);
                }

                const fromIndex = fromList.cards.findIndex(c => c.id === active.id);
                if (fromIndex === -1) return prevBoard;

                // ===== CÙNG LIST =====
                if (fromListId === toListId) {
                    // Nếu over là Card thì lấy index của card đó
                    // Nếu over là List thì drop về cuối? (thường ít xảy ra khi sortable, trừ khi list rỗng nhưng đây là same list)
                    let toIndex = overType === "CARD"
                        ? toList.cards.findIndex(c => c.id === over.id)
                        : toList.cards.length - 1;

                    if (toIndex === -1) toIndex = toList.cards.length - 1;

                    if (fromIndex === toIndex) return prevBoard;

                    // Dùng arrayMove cho an toàn khi mảng đang đầy đủ
                    const newCards = arrayMove(fromList.cards, fromIndex, toIndex);
                    fromList.cards = newCards;

                    // Tính position mới
                    const prevCard = newCards[toIndex - 1];
                    const nextCard = newCards[toIndex + 1];
                    const newPosition = calculateNewPosition(prevCard?.position, nextCard?.position);

                    // Update moved card
                    newCards[toIndex] = { ...newCards[toIndex], position: newPosition };

                    // API call
                    if (workspaceId && boardId) {
                        actions.updateCard(
                            workspaceId,
                            boardId,
                            fromListId,
                            active.id,
                            {
                                name: newCards[toIndex].name,
                                position: newPosition,
                                listIdTarget: fromListId,
                            }
                        ).catch(console.error);
                    }
                }
                // ===== KHÁC LIST =====
                else {
                    const toIndex = overType === "CARD"
                        ? toList.cards.findIndex(c => c.id === over.id)
                        : toList.cards.length;

                    // Remove from source
                    const [movedCard] = fromList.cards.splice(fromIndex, 1);

                    // Add to target
                    let insertIndex = toIndex;
                    if (insertIndex < 0) insertIndex = 0; // Safety
                    if (insertIndex > toList.cards.length) insertIndex = toList.cards.length;

                    toList.cards.splice(insertIndex, 0, movedCard);

                    // Calc position
                    const prevCard = toList.cards[insertIndex - 1];
                    const nextCard = toList.cards[insertIndex + 1];
                    const newPosition = calculateNewPosition(prevCard?.position, nextCard?.position);

                    // Update data
                    toList.cards[insertIndex] = {
                        ...movedCard,
                        position: newPosition,
                    };

                    // API call
                    if (workspaceId && boardId) {
                        actions.updateCard(
                            workspaceId,
                            boardId,
                            fromListId,
                            movedCard.id,
                            {
                                name: movedCard.name,
                                position: newPosition,
                                listIdTarget: toListId,
                            }
                        ).catch(console.error);
                    }
                }

                return { ...prevBoard, lists: newLists };
            });
        }
    }

    return { handleDragEnd };
}