import { useBoardStore } from "@/store/useBoardStore";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Loader } from "lucide-react";

export default function Board() {
  const { workspaceId, boardId } = useParams();
  const currentBoard = useBoardStore((state) => state.currentBoard);
  const isLoading = useBoardStore((state) => state.isLoading);
  const error = useBoardStore((state) => state.error);
  const fetchBoardById = useBoardStore((state) => state.fetchBoardById);

  useEffect(() => {
    if (workspaceId && boardId) {
      fetchBoardById(workspaceId, boardId);
    }
  }, [workspaceId, boardId, fetchBoardById]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }
  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  if (!currentBoard) {
    return <div className="p-6">Board not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{currentBoard.name}</h1>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {currentBoard.lists?.map((list) => (
          <div
            key={list.id}
            className="bg-gray-100 rounded-lg p-4 min-w-[300px] max-w-[300px]"
          >
            <h3 className="font-semibold mb-3">{list.name}</h3>
            <div className="space-y-2">
              {list.cards.map((card) => (
                <div
                  key={card.id}
                  className="bg-white p-3 rounded shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <p className="text-sm">{card.name}</p>
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
