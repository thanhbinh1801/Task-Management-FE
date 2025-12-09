import { useBoard } from "@/hooks/useBoard";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Loader } from "lucide-react";

export default function Board() {
  const { workspaceId, boardId } = useParams();
  const { board, loading, error, fetchBoardById } = useBoard();

  useEffect(() => {
    if (workspaceId && boardId) {
      fetchBoardById(workspaceId, boardId);
    }
  }, [workspaceId, boardId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }
  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  if (!board) {
    return <div className="p-6">Board not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{board[0]?.nameBoard}</h1>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {board[0]?.lists?.map((list) => (
          <div
            key={list.id}
            className="bg-gray-100 rounded-lg p-4 min-w-[300px] max-w-[300px]"
          >
            <h3 className="font-semibold mb-3">{list.nameList}</h3>
            <div className="space-y-2">
              {list.cards.map((card) => (
                <div
                  key={card.id}
                  className="bg-white p-3 rounded shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <p className="text-sm">{card.nameCard}</p>
                  {card.isComplete && (
                    <span className="text-xs text-green-600 mt-1 inline-block">
                      ✓ Completed
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
