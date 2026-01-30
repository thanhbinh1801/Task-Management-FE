import { apiClient } from "./api";

export const boardApi = {
  createList(data: { boardId: string; nameList: string }) {
    return apiClient.post(
      `/list`,
      { name: data.nameList, boardId: data.boardId }
    );
  },
  updateList(data: {
    boardId: string,
    listId: string,
    nameList?: string,
    position: number
  }) {
    return apiClient.put(`/list/${data.listId}/`,
      { name: data.nameList, position: data.position, boardId: data.boardId });
  },

  createCard(data: {
    listId: string;
    boardId: string;
    nameCard: string
  }) {
    return apiClient.post(
      `/list/${data.listId}/card`,
      { boardId: data.boardId, name: data.nameCard }
    );
  },
  updateCard(data: {
    boardId: string,
    listId: string,
    cardId: string,
    nameCard: string,
    position: number,
    listIdTarget: string
  }) {
    return apiClient.put(`list/${data.listId}/card/${data.cardId}/`,
      { name: data.nameCard, position: data.position, listIdTarget: data.listIdTarget, boardId: data.boardId });
  }
}