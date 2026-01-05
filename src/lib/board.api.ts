import { apiClient } from "./api";

export const boardApi = {
  updateList ( data: { 
    workspaceId: string, 
    boardId: string, 
    listId: string, 
    nameList?: string, 
    position: number } ) {
    return apiClient.put(`workspace/${data.workspaceId}/board/${data.boardId}/list/${data.listId}/`, 
      { nameList: data.nameList, position: data.position });
  },
  updateCard ( data: { 
    workspaceId: string, 
    boardId: string, 
    listId: string, 
    cardId: string, 
    nameCard: string, 
    position: number, 
    listIdTarget: string } ) {
    return apiClient.put(`workspace/${data.workspaceId}/board/${data.boardId}/list/${data.listId}/card/${data.cardId}/`,
       { nameCard: data.nameCard, position: data.position, listIdTarget: data.listIdTarget });
  }
}