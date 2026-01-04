import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function CardComponent({ card, listId }: any) {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({
      id: card.id,
      data: {
        type: "CARD",
        listId: listId,
      },
    });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        padding: 8,
        marginBottom: 8,
        background: "white",
        borderRadius: 4,
        cursor: "grab",
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className="bg-white rounded-lg p-2 shadow cursor-grab"
    >
      {card.name}
    </div>
  );
}
