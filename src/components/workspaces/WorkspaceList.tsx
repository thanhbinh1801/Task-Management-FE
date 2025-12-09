import React from "react";
import {
  ItemGroup,
  ItemHeader,
  ItemContent,
  ItemTitle,
  Item,
  ItemDescription,
  ItemSeparator,
} from "../../components/ui/item.tsx";
import { useWorkspace } from "@/hooks/useWorkspace.ts";
import type { Workspace } from "@/hooks/useWorkspace.ts";
import { Loader } from "lucide-react";
import { CreateWorkspaceDialog } from "@/components/workspaces/createWorkspace.tsx";
import { CreateBoardDialog } from "../board/createBoard.tsx";
import { useBoard } from "@/hooks/useBoard.ts";
import { Link } from "react-router-dom";

export default function WorkspaceList() {
  const {
    workspaces,
    loading,
    error,
    setError,
    createWorkspace,
    fetchWorkspaces,
  } = useWorkspace();
  const { createBoard } = useBoard();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }

  if (error) {
    return <div className="p-6"> Error loading workspaces: {error} </div>;
  }

  async function handleCreateBoard(data: {
    nameBoard: string;
    workspaceId: string;
  }) {
    await createBoard(data);
    await fetchWorkspaces();
  }

  return (
    <>
      <h2 className="text-2xl font-bold pl-4">Workspaces</h2>
      <ItemGroup className="divide-y pl-4">
        {workspaces.map((ws: Workspace) => (
          <React.Fragment key={ws.id}>
            <Item className="justify-between">
              <ItemContent>
                <ItemHeader>
                  <ItemTitle>{ws.name}</ItemTitle>
                </ItemHeader>

                <ItemDescription>
                  <span className="mr-4">
                    <span className="">Visibility:</span> {ws.visibility ?? "—"}
                  </span>
                </ItemDescription>
              </ItemContent>

              <div className="mt-3 w-full pl-6 space-y-2">
                <span className="text-sm font-medium">Boards:</span>
                {ws.boards?.map((b) => (
                  <Link
                    key={b.id}
                    to={`/workspace/${ws.id}/board/${b.id}`}
                    className="flex justify-between items-center border rounded-md p-2 hover:bg-muted/50"
                  >
                    <span className="text-sm font-medium">{b.name}</span>
                  </Link>
                ))}
              </div>
              <CreateBoardDialog
                createBoard={handleCreateBoard}
                workspaces={workspaces}
                defaultWorkspaceId={ws.id}
              />
            </Item>
            <ItemSeparator />
          </React.Fragment>
        ))}
      </ItemGroup>

      <CreateWorkspaceDialog createWorkspace={createWorkspace} />
    </>
  );
}
