import { useState } from "react";
import { Plus, X } from "lucide-react";

interface AddCardButtonProps {
  onAddCard: (name: string) => Promise<void>;
}

export default function AddCardButton({ onAddCard }: AddCardButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [cardName, setCardName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardName.trim()) return;

    setIsLoading(true);
    try {
      await onAddCard(cardName);
      setCardName("");
      setIsAdding(false);
    } catch (error) {
      console.error("Error creating card:", error);
      alert("Không thể tạo card. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setCardName("");
    setIsAdding(false);
  };

  if (isAdding) {
    return (
      <div className="mt-2 bg-white rounded-lg shadow-lg p-2">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="Enter a title or paste a link"
            autoFocus
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
          />
          <div className="flex items-center gap-2 mt-2">
            <button
              type="submit"
              disabled={isLoading || !cardName.trim()}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "Adding..." : "Add card"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsAdding(true)}
      className="w-full flex items-center gap-2 px-2 py-1.5 mt-1 text-gray-600 hover:bg-gray-200 rounded text-sm transition-colors"
    >
      <Plus size={16} />
      Add a card
    </button>
  );
}
