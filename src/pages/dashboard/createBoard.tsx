import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
import type { Workspace } from "@/hooks/useWorkspace";

interface CreateBoardDialogProps {
  createBoard: (data: {
    nameBoard: string;
    workspaceId: string;
  }) => Promise<void>;
  workspaces: Workspace[];
  defaultWorkspaceId: string;
}

export function CreateBoardDialog({
  createBoard,
  workspaces,
  defaultWorkspaceId,
}: CreateBoardDialogProps) {
  const [nameBoard, setNameBoard] = useState("");
  const [workspaceId, setWorkspaceId] = useState(defaultWorkspaceId || "");
  const [error, setError] = useState("");
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (defaultWorkspaceId) {
      setWorkspaceId(defaultWorkspaceId);
    }
  }, [defaultWorkspaceId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!workspaceId) {
      setError("Please select a workspace");
      return;
    }

    try {
      console.log(
        "Creating board - Title:",
        nameBoard,
        "WorkspaceId:",
        workspaceId
      );
      await createBoard({ nameBoard, workspaceId });
      setNameBoard("");
      setWorkspaceId(defaultWorkspaceId);
      closeRef.current?.click();
      closeRef.current?.click();
    } catch (err) {
      console.error("Error creating board:", err);
      setError("Failed to create board. Please try again.");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" type="button" className="text-sm">
          Create Board
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[380px] p-5">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="mb-4">
            <DialogTitle className="text-lg">Create Board</DialogTitle>
            <DialogDescription className="text-sm">
              Create a new board.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm mb-3">
              {error}
            </div>
          )}

          <div className="space-y-3 mb-4">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-medium">
                Board Name
              </label>
              <Input
                id="name"
                value={nameBoard}
                onChange={(e) => setNameBoard(e.target.value)}
                placeholder="Enter board name"
                className="h-9 text-sm"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="workspaceId" className="text-xs font-medium">
                Workspace
              </label>
              <select
                id="workspaceId"
                value={workspaceId}
                onChange={(e) => setWorkspaceId(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {workspaces.map((ws) => (
                  <option key={ws.id} value={ws.id}>
                    {ws.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <DialogClose asChild ref={closeRef}>
              <Button type="button" variant="outline" className="h-9 text-sm">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="h-9 text-sm">
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
