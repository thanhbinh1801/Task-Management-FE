import { useBoard } from "@/hooks/useBoard";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

export default function BoardItem() {
  const { workspaceId, boardId } = useParams<{
    workspaceId: string;
    boardId: string;
  }>();
  const { board, fetchBoardById } = useBoard();
  useEffect(() => {
    fetchBoardById(workspaceId!, boardId!);
    console.log("Lists in BoardItem:", board);
  }, [workspaceId, boardId]);

  return (
    <div className="space-y-6">
      {!board ? (
        <div>Không có board nào.</div>
      ) : (
        <div key={board.id} className="border rounded p-4 shadow">
          <h2 className="text-xl font-bold mb-2">Board: {board.name}</h2>
          {!board.lists || board.lists.length === 0 ? (
            <div className="ml-4">Không có list nào.</div>
          ) : (
            board.lists.map((list) => (
              <div key={list.id} className="ml-4 mb-4">
                <h3 className="text-lg font-semibold">List: {list.name}</h3>
                {!list.cards || list.cards.length === 0 ? (
                  <div className="ml-4">Không có card nào.</div>
                ) : (
                  <ul className="ml-4 list-disc">
                    {list.cards.map((card) => (
                      <li key={card.id} className="py-1">
                        Card: {card.name}{" "}
                        {card.isComplete ? "(Hoàn thành)" : ""}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
