import { api } from "@/lib/api.ts";
import { useState, useEffect } from "react";

export type Workspace = {
    id: string;
    name: string;
    visibility?: string | null;
  };

export const useWorkspace = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  async function fetchWorkspaces() {
    try{
      setLoading(true);
      const res = await api.get("/workspace");
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
  
  // function refreshWorkspaces() {
  //   setTimeout( () => {
  //     setLoading(true);
  //     setError(null);
  //     fetchWorkspaces();
  //   }, 1000);
  // }


  useEffect( () => {
    fetchWorkspaces();
  }, []);

  return { workspaces, loading, error, setError };
}