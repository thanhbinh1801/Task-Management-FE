import { useEffect, useState } from "react";
import React from "react";
import { Button } from "../components/ui/button.tsx";
import { ItemGroup, ItemHeader, ItemContent, ItemTitle, Item, ItemDescription, ItemSeparator } from "../components/ui/item.tsx";
import UserDropdown from "./UserDropdown.tsx";
import { api } from "@/lib/api.ts";
import { useWorkspace } from "@/hooks/useWorkspace.ts";
import type { Workspace } from "@/hooks/useWorkspace.ts";
import { useBoard } from "@/hooks/useBoard.ts";
import { Loader, ChevronRight, ChevronLeft } from "lucide-react";
import { useSidebar } from "@/hooks/useSidebar.ts";

function Dashboard() {
  const [user, setUser] = useState<{ name?: string; email?: string }>({});
  const { workspaces, loading, error, setError } = useWorkspace();
  const { boardsByWs, openedId, handleViewBoards } = useBoard();
  const { isOpen, toggleSidebar } = useSidebar();

  useEffect(() => {
    async function fetchUser() {
      try{
        const res = await api.get("/auth/me");
        setUser(res.data.data);
      } catch{
        setError("Failed to load user.");
      }
    }
    fetchUser();
    }, []);

  if( loading ) {
    return(
     <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }

  if( error ) {
    return <div className="p-6"> Error loading workspaces: {error} </div>;
  }

  return (
    <div className="min-h-screen flex relative">
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 p-4 flex flex-col transition-all duration-300 ${isOpen ? 'w-64' : 'w-0 p-0 overflow-hidden border-none'}`}>
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold">T</span>
            </div>
            <h2 className="text-xl font-bold">TaskManagement</h2>
          </div>
          
          <div className="space-y-1 mb-6">
            <div className="text-sm font-medium text-gray-500 px-3 py-1">Navigation</div>
            <div className="px-3 py-2 rounded hover:bg-gray-100 cursor-pointer font-medium">
              Dashboard
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-sm font-medium text-gray-500 px-3 py-1">Workspaces</div>
            {workspaces.map((ws: Workspace) => (
              <div key={ws.id} className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded cursor-pointer">
                {ws.name}
              </div>
            ))}
          </div>
        </div>

        {/* Chevron Toggle Button */}
        <button
          onClick={toggleSidebar}
          style={{ top: '50%', transform: 'translateY(-50%)' }}
          className={` absolute right-0 w-4 h-full bg-white border border-gray-200 rounded-r-lg shadow-md cursor-pointer flex items-center justify-center transition-all duration-300 `}
        >
          {isOpen ? (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>



      {/* Main Content Area */}
      <div className={`space-y-4 flex-1 transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-10'}`}>
        <div className="flex justify-between items-center mb-8 border border-black-200 px-2 py-3 ">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <UserDropdown user={user} />
        </div>

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
    </div>

  );
}

export default Dashboard;