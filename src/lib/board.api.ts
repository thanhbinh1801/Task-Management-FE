import { apiClient } from "./api";

export const boardApi = {
  createList(data: { workspaceId: string; boardId: string; nameList: string }) {
    return apiClient.post(
      `workspace/${data.workspaceId}/board/${data.boardId}/list`,
      { nameList: data.nameList }
    );
  },
  createCard(data: { 
    workspaceId: string; 
    boardId: string; 
    listId: string; 
    nameCard: string 
  }) {
    return apiClient.post(
      `workspace/${data.workspaceId}/board/${data.boardId}/list/${data.listId}/card`,
      { nameCard: data.nameCard }
    );
  },
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