import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CardComponent from "../card/card.tsx";

export default function ListComponent({ list }: any) {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({
      id: list.id,
      data: {
        type: "LIST",
      },
    });
    const sortedCards = [...list.cards].sort((a: any, b: any) => a.position - b.position);

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        width: 250,
        padding: 8,
        background: "#eee",
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <h3>{list.name}</h3>

      <SortableContext
        items={sortedCards.map((c: any) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        {sortedCards.map(card => (
          <CardComponent 
            key={card.id} 
            card={card} 
            listId={list.id}
          />
        ))}
      </SortableContext>
    </div>
  );
}
