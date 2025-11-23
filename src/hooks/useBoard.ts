import { apiClient } from "@/lib/api.ts";
import { useState } from "react";

export type Board = {
  id: string;
  nameBoard: string; 
  lists: List[],
};

export type List = {
  id: string;
  nameList:string;
  position: number;
  cards: Card[]
}

export type Card = {
  id: string;
  nameCard: string;
  isComplete: boolean
}

export const useBoard = () => {
  const [board, setBoard] = useState<Board>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null >(null);

  async function fetchBoardById(workspaceId: string, boardId: string) {
    try{
      setLoading(true);
      const res = await apiClient.get(`/workspace/${workspaceId}/board/${boardId}`);
      console.log("Response of board: ", res.data.data);
      setBoard(res.data.data);
      setError(null);
    } catch(err) {
      console.log("Err: ", err);
      setError("Failed to load board by id");
    } finally {
      setLoading(false);
    }
  }

  async function createBoard ({workspaceId, nameBoard}: {workspaceId: string; nameBoard: string}) {
    try {
      const res = await apiClient.post(`/workspace/${workspaceId}/board`, { nameBoard });
      console.log("Board created:", res.data);
      return res.data;
    } catch(err) {
      console.error("Error creating board:", err);
      setError("Failed to creating board.");
    }
  }

  return { board,loading, error, createBoard, fetchBoardById };
}