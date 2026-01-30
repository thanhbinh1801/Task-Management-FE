import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CardComponent from "../card/card.tsx";
import AddCardButton from "../card/AddCardButton";
import { boardApi } from "@/lib/board.api";
import type { List, Board } from "@/components/type/type.ts";




interface ListComponentProps {
  list: List;
  board: Board;
  setBoard: (board: Board) => void;
  workspaceId: string;
  boardId: string;
}

export default function ListComponent({ list, board, setBoard, workspaceId: _workspaceId, boardId }: ListComponentProps) {

  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({
      id: list.id,
      data: {
        type: "LIST",
      },
    });

  const sortedCards = [...list.cards].sort(
    (a: any, b: any) => a.position - b.position
  );

  const handleAddCard = async (nameCard: string) => {
    try {
      const response = await boardApi.createCard({
        boardId,
        listId: list.id,
        nameCard,
      });

      // Cập nhật board với card mới
      if ((response.data as any)?.data) {
        const newCard = (response.data as any).data;
        const updatedLists = board.lists.map((l) =>
          l.id === list.id ? { ...l, cards: [...l.cards, newCard] } : l
        );
        setBoard({ ...board, lists: updatedLists });
      }
    } catch (error) {
      console.error("Error creating card:", error);
      throw error;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        width: 200,
        padding: 8,
        background: "#eee",
        borderRadius: 8,
        transform: CSS.Transform.toString(transform),
        transition,
        alignSelf: "flex-start",
      }}
    >
      <h3
        {...attributes}
        {...listeners}
        style={{
          margin: "0 0 8px 0",
          fontSize: 14,
          fontWeight: 600,
          cursor: "grab",
        }}
      >
        {list.name}
      </h3>

      <div>
        <SortableContext
          items={sortedCards.map((c: any) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {sortedCards.map((card) => (
            <CardComponent key={card.id} card={card} listId={list.id} />
          ))}
        </SortableContext>

        <AddCardButton onAddCard={handleAddCard} />
      </div>
    </div>
  );
}
