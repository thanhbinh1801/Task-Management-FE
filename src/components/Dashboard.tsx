import { useEffect, useState } from "react";
import React from "react";
import { Button } from "./ui/button";
import { ItemGroup, ItemHeader, ItemContent, ItemTitle, ItemActions, Item, ItemDescription, ItemSeparator } from "./ui/item";
import UserDropdown from "./UserDropdown.tsx";
import { api } from "@/lib/api.ts";

function Dashboard() {
  type Workspace = {
    id: string;
    name: string;
    visibility?: string | null;
  };
  
  type Board = {
    id: string;
    title: string; 
  };

  const [workspaces, setWorkspace] = useState<Workspace[]>([]);
  const [boardsByWs, setBoardsByWs] = useState<Board[]>([]);
  const [openedId, setOpenedId] = useState<string | null>(null);
  const [user, setUser] = useState<{ name?: string; email?: string }>({});

  useEffect(() => {
    async function fetchUser() {
      try{
        const res = await api.get("/auth/me");
        setUser(res.data.data);
        console.log("User info dashboard: ", res.data.data);
      } catch(err){
        console.log("Err fetch user: ", err);
      }
    }
    fetchUser();
    }, []);

  useEffect( () => {
    async function fetchWorkspaces() {
      try{
        const res = await api.get("/workspace");
        console.log("res workspace: ", res.data.data);
        setWorkspace(res.data.data);
      }
      catch(err){
        console.log("Err: ", err);
      }
    }
    fetchWorkspaces();
  }, []);

  async function handleViewBoards(wsId: string) {
    if (openedId === wsId) {
      setOpenedId(null);
      return;
    } 
    const boards = await api.get(`/workspace/${wsId}/board`);
    console.log("Boards: ", boards.data.data);
    setBoardsByWs(boards.data.data);
    setOpenedId(wsId);

  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <UserDropdown user={user} />
      </div>

      <h2 className="text-2xl font-bold">Workspaces</h2>
      <ItemGroup className="divide-y">
        {workspaces.map((ws: Workspace) => (
          <React.Fragment key={ws.id}>
            <Item className="justify-between">
              <ItemContent>
                <ItemHeader>
                  <ItemTitle>{ws.name}</ItemTitle>
                  <ItemActions>
                    <Button onClick={() => handleViewBoards(ws.id)}>{openedId === ws.id ? "Hide" : "View"}</Button>
                  </ItemActions>
                </ItemHeader>

                <ItemDescription>
                  <span className="mr-4">
                    <span className="">Visibility:</span>{" "}
                    {ws.visibility ?? "—"}
                  </span>
                </ItemDescription>
              </ItemContent>
              {openedId === ws.id && (
                <>
                  <div className="mt-3 w-full pl-6 space-y-2"> 
                    <span className="text-sm font-medium">Boards:</span>
                    {boardsByWs.map((b) => (  
                      <div
                        key={b.id}
                        className="flex justify-between items-center border rounded-md p-2 hover:bg-muted/50"
                      >
                        <span className="text-sm font-medium">{b.title}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Item>
            <ItemSeparator />
          </React.Fragment>
        ))}
      </ItemGroup>
    </div>
  );
}

export default Dashboard;