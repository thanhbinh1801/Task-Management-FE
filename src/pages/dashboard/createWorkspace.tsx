import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useState, useRef } from "react";

interface CreateWorkspaceDialogProps {
  createWorkspace: (data: {name: string; visibility?: string}) => Promise<void>;
}

export function CreateWorkspaceDialog({ createWorkspace }: CreateWorkspaceDialogProps) {
  const [name, setName] = useState("");
  const [visibility, setVisibility] = useState("");
  const [error, setError] = useState("");
  const closeRef = useRef<HTMLButtonElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    
    try {
      await createWorkspace({ name, visibility });
      setName("");
      setVisibility("");
      closeRef.current?.click();
    } catch (err) {
      console.error("Error creating workspace:", err);
      setError("Failed to create workspace. Please try again.");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" type="button" className="text-sm">
          Create Workspace
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-[380px] p-5">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="mb-4">
            <DialogTitle className="text-lg">Create Workspace</DialogTitle>
            <DialogDescription className="text-sm">
              Create a new workspace.
            </DialogDescription>
          </DialogHeader>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm mb-3">
              {error}
            </div>
          )}
          
          <div className="space-y-3 mb-4">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-medium">Name</label>
              <Input 
                id="name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Workspace name"
                className="h-9 text-sm"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="visibility" className="text-xs font-medium">Visibility</label>
              <select
                id="visibility"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="PRIVATE">Private</option>
                <option value="PUBLIC">Public</option>
              </select>
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <DialogClose asChild ref={closeRef}>
              <Button type="button" variant="outline" className="h-9 text-sm">Cancel</Button>
            </DialogClose>
            <Button type="submit" className="h-9 text-sm">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
