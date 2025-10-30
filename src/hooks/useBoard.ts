import { useState } from "react";
import { api } from "@/lib/api.ts";

export type Board = {
    id: string;
    title: string; 
  };

export const useBoard = () => {
  const [boardsByWs, setBoardsByWs] = useState<Board[]>([]);
  const [openedId, setOpenedId] = useState<string | null>(null);

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

  return { boardsByWs, openedId, handleViewBoards };
}