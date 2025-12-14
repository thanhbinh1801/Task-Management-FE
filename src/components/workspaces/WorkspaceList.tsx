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
import { Loader, Plus } from "lucide-react";
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
      <h2 className="text-2xl font-bold pl-4 mb-6"> Your workspaces</h2>
      <CreateWorkspaceDialog createWorkspace={createWorkspace} />
      <ItemGroup className="divide-y pl-4">
        {workspaces.map((ws: Workspace) => (
          <React.Fragment key={ws.id}>
            <Item className="pb-6">
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

              {/* Board Grid */}
              <div className="mt-6 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {/* Existing Boards */}
                  {ws.boards?.map((b) => (
                    <Link
                      key={b.id}
                      to={`/workspace/${ws.id}/board/${b.id}`}
                      className="block"
                    >
                      <div className="h-32 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center p-4">
                        <span className="text-white font-semibold text-center text-lg">
                          {b.name}
                        </span>
                      </div>
                    </Link>
                  ))}

                  <div className="h-32 ">
                    <CreateBoardDialog
                      createBoard={handleCreateBoard}
                      workspaces={workspaces}
                      defaultWorkspaceId={ws.id}
                    />
                  </div>
                </div>
              </div>
            </Item>
            <ItemSeparator />
          </React.Fragment>
        ))}
      </ItemGroup>
    </>
  );
}
