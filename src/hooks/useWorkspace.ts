import { apiClient } from "@/lib/api.ts";
import { useState, useEffect } from "react";

export type Workspace = {
  id: string;
  name: string;
  visibility?: string | null;
  boards?: Board[];
};

export type Board = {
  id: string;
  title: string;
};

export const useWorkspace = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  async function fetchWorkspaces() {
    try{
      setLoading(true);
      const res = await apiClient.get("/workspace");
      console.log("res workspace: ", res.data.data);
      setTimeout( () => {
        setWorkspaces(res.data.data);
        setError(null);
        setLoading(false);
      }, 300);
    }
    catch(err){
      console.log("Err: ", err);
      setError("Failed to load workspaces.");
      setLoading(false); 
    }
  }

  async function createWorkspace({name, visibility}: {name: string; visibility?: string}) {
    try{
      const payload = {
        name,
        visibility: visibility?.toUpperCase() || "PRIVATE"
      };
      const res = await apiClient.post("/workspace", payload);
      console.log("Workspace created:", res.data.data);
      await fetchWorkspaces();
      return res.data;
    }
    catch(err) {
      console.error("Err creating workspace: ", err);
      throw err;
    }
  }

  useEffect( () => {
    fetchWorkspaces();
  }, []);

  return { workspaces, loading, error, setError, createWorkspace, fetchWorkspaces};
}