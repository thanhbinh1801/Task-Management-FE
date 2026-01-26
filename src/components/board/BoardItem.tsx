import { useBoardStore } from "@/store/useBoardStore";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { Plus } from "lucide-react";

export default function BoardItem() {
  const { workspaceId, boardId } = useParams<{
    workspaceId: string;
    boardId: string;
  }>();
  const currentBoard = useBoardStore((state) => state.currentBoard);
  const fetchBoardById = useBoardStore((state) => state.fetchBoardById);

  useEffect(() => {
    if (workspaceId && boardId) {
      fetchBoardById(workspaceId, boardId);
    }
  }, [workspaceId, boardId, fetchBoardById]);

  if (!currentBoard) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading board...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-4 bg-blue-600">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-white">{currentBoard.nameBoard}</h1>
        </div>
      </div>

      <div className="px-6 pb-6 overflow-x-auto">
        <div className="flex gap-4 items-start">
          {currentBoard.lists && currentBoard.lists.length > 0 ? (
            currentBoard.lists.map((list) => (
              <div
                key={list.id}
                className="bg-gray-100 rounded-xl p-3 w-[120px] h-[200px] flex-shrink-0"
              >
                {/* List Header */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">{list.nameList}</h3>
                </div>

                <div className="space-y-2">
                  {list.cards && list.cards.length > 0 ? (
                    list.cards.map((card) => (
                      <div
                        key={card.id}
                        className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <p className="text-sm text-gray-800">{card.nameCard}</p>
                        {card.isComplete && (
                          <span className="inline-block mt-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                            Completed
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500 text-center py-2">
                      No cards yet
                    </div>
                  )}
                </div>

                <button className="w-full mt-2 px-3 py-2 text-left text-gray-600 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2">
                  <Plus size={16} />
                  <span className="text-sm">Add a card</span>
                </button>
              </div>
            ))
          ) : (
            <div className="text-gray-500">No lists yet</div>
          )}

<button className="bg-gray-100 hover:bg-gray-200 rounded-xl p-3 w-80 flex-shrink-0 transition-colors flex items-center gap-2 text-gray-700">
            <Plus size={18} />
            <span className="font-medium">Add another list</span>
          </button>
        </div>
      </div>
    </div>
  );
}
