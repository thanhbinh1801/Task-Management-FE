import { useState } from "react";
import { Plus, X } from "lucide-react";

interface AddListButtonProps {
  onAddList: (name: string) => Promise<void>;
}

export default function AddListButton({ onAddList }: AddListButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [listName, setListName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listName.trim()) return;

    setIsLoading(true);
    try {
      await onAddList(listName);
      setListName("");
      setIsAdding(false);
    } catch (error) {
      console.error("Error creating list:", error);
      alert("Không thể tạo list. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setListName("");
    setIsAdding(false);
  };

  if (isAdding) {
    return (
      <div
        style={{
          width: 250,
          padding: 8,
          background: "#eee",
          borderRadius: 8,
        }}
      >
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            placeholder="Enter list name..."
            autoFocus
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "2px solid #0079bf",
              borderRadius: 4,
              fontSize: 14,
              marginBottom: 8,
              outline: "none",
            }}
          />
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              type="submit"
              disabled={isLoading || !listName.trim()}
              style={{
                padding: "6px 12px",
                background: "#0079bf",
                color: "white",
                border: "none",
                borderRadius: 4,
                fontSize: 14,
                fontWeight: 500,
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading || !listName.trim() ? 0.6 : 1,
              }}
            >
              {isLoading ? "Adding..." : "Add list"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 4,
                display: "flex",
                alignItems: "center",
              }}
            >
              <X size={24} color="#333" />
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsAdding(true)}
      style={{
        width: 200,
        padding: 12,
        background: "#eee",
        border: "none",
        borderRadius: 8,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 14,
        fontWeight: 500,
        color: "#172b4d",
      }}
    >
      <Plus size={18} />
      Add another list
    </button>
  );
}
