import { useBoardStore } from "@/store/useBoardStore";
import { Star, Users } from "lucide-react";

export default function BoardHeader() {
  const currentBoard = useBoardStore((state) => state.currentBoard);

  if (!currentBoard) return null;

  return (
    <header className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left: Board Title & Info */}
        <div className="flex items-center gap-3">
          <h1 className="text-white font-bold text-lg px-3 py-1 hover:bg-white/10 rounded transition-colors cursor-pointer">
            {currentBoard.name || "Board"}
          </h1>
        </div>

        {/* Right: Members + Share */}
        <div className="flex items-center gap-3">
          {currentBoard.members && currentBoard.members.length > 0 && (
            <div className="flex -space-x-2">
              {currentBoard.members.slice(0, 4).map((member, index) => (
                <div
                  key={member.userId}
                  className="relative hover:z-50 transition-transform hover:scale-110"
                  style={{ zIndex: currentBoard.members.length - index }}
                >
                  {member.avatarUrl ? (
                    <img
                      src={member.avatarUrl}
                      alt={member.userName}
                      className="w-8 h-8 rounded-full border-2 border-white object-cover cursor-pointer"
                      title={member.userName}
                    />
                  ) : (
                    <div
                      className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-semibold cursor-pointer"
                      title={member.userName}
                    >
                      {member.userName?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          <button className="flex items-center gap-2 px-4 py-1.5 bg-white/90 hover:bg-white text-gray-700 font-medium rounded transition-colors">
            <Users className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>
    </header>
  );
}
