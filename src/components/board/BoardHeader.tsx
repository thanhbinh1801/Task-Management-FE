import type { Board } from "@/components/type/type";

interface BoardHeaderProps {
  board: Board;
}

export default function BoardHeader({ board }: BoardHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-blue-500 backdrop-blur-sm px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left: Board Title */}
        <div className="flex items-center gap-2">
          <h1 className="text-white font-semibold text-lg">
            {board?.name || "Task"}
          </h1>
        </div>

        {/* Right: Members + Share */}
        <div className="flex items-center gap-3">
          {board?.members && board.members.length > 0 && (
            <div className="flex -space-x-2">
              {board.members.slice(0, 4).map((member, index) => (
                <div
                  key={member.userId}
                  className="relative"
                  style={{ zIndex: board.members.length - index }}
                >
                  {member.avatarUrl ? (
                    <img
                      src={member.avatarUrl}
                      alt={member.userName}
                      className="w-8 h-8 rounded-full border-2 border-white object-cover"
                      title={member.userName}
                    />
                  ) : (
                    <div
                      className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold"
                      title={member.userName}
                    >
                      {member.userName?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <button className="px-4 py-1.5 bg-black/70 hover:bg-black/80 text-white rounded-md transition-colors">
            Share
          </button>
        </div>
      </div>
    </header>
  );
}
