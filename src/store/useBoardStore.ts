// stores/useBoardStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { apiClient } from '@/lib/api';
import { boardApi } from '@/lib/board.api';
import { useWorkspaceStore } from './useWorkSpaceStore';
import type { Board } from '@/components/type/type';

interface BoardState {
  // State
  boards: { [workspaceId: string]: Board[] }; // Cache boards by workspace
  currentBoard: Board | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchBoardById: (workspaceId: string, boardId: string, options?: { silent?: boolean }) => Promise<void>;
  createBoard: (data: {
    workspaceId: string;
    nameBoard: string
  }) => Promise<any>;
  updateBoard: (workspaceId: string, boardId: string, data: any) => Promise<void>;
  deleteBoard: (workspaceId: string, boardId: string) => Promise<void>;

  // List actions
  createList: (workspaceId: string, boardId: string, data: { name: string }) => Promise<void>;
  updateList: (workspaceId: string, boardId: string, listId: string, data: { name?: string, position: number }) => Promise<void>;
  deleteList: (listId: string) => Promise<void>;

  // Card actions
  createCard: (boardId: string, listId: string, data: { name: string, position: number }) => Promise<void>;
  updateCard: (workspaceId: string, boardId: string, listId: string, cardId: string, data: { name?: string, position: number, listIdTarget?: string }) => Promise<void>;
  deleteCard: (cardId: string) => Promise<void>;

  clearBoards: () => void;
  clearError: () => void;
  setCurrentBoard: (updater: Board | null | ((prev: Board | null) => Board | null)) => void;
}

export const useBoardStore = create<BoardState>()(
  devtools(
    (set, get) => ({
      // Initial state
      boards: {},
      currentBoard: null,
      isLoading: false,
      error: null,

      // Actions
      fetchBoardById: async (workspaceId, boardId, options) => {
        if (!options?.silent) {
          set({ isLoading: true, error: null });
        }
        try {
          const res = await apiClient.get<{ data: Board | Board[] }>(
            `/workspace/${workspaceId}/board/${boardId}`
          );

          console.log("Fetch Board Response:", res.data);
          const boardData = res.data.data;
          const currentBoard = Array.isArray(boardData) ? boardData[0] : boardData;

          set({
            currentBoard: currentBoard,
            isLoading: false,
            error: null
          });
        } catch (err: any) {
          set({
            isLoading: false,
            error: 'Failed to load board'
          });
        }
      },

      createBoard: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const res = await apiClient.post(
            `/workspace/${data.workspaceId}/board`,
            { nameBoard: data.nameBoard }
          );

          await useWorkspaceStore.getState().fetchWorkspaces();

          set({ isLoading: false });
          return res.data;
        } catch (err) {
          set({
            isLoading: false,
            error: 'Failed to create board'
          });
          throw err;
        }
      },

      updateBoard: async (workspaceId, boardId, data) => {
        try {
          await apiClient.put(
            `/workspace/${workspaceId}/board/${boardId}`,
            data
          );

          const current = get().currentBoard;
          if (current?.id === boardId) {
            await get().fetchBoardById(workspaceId, boardId);
          }
        } catch (err) {
          set({ error: 'Failed to update board' });
          throw err;
        }
      },

      // deleteBoard: async (workspaceId, boardId) => {
      //   try {
      //     await apiClient.delete(
      //       `/workspace/${workspaceId}/board/${boardId}`
      //     );

      //     // Update workspace store
      //     await useWorkspaceStore.getState().fetchWorkspaces();

      //     // Clear current board nếu đang xem
      //     const current = get().currentBoard;
      //     if (current?.id === boardId) {
      //       set({ currentBoard: null });
      //     }
      //   } catch (err) {
      //     set({ error: 'Failed to delete board' });
      //     throw err;
      //   }
      // },

      createList: async (workspaceId, boardId, data) => {
        try {
          await boardApi.createList({ boardId, nameList: data.name });
          await get().fetchBoardById(
            workspaceId,
            boardId,
            { silent: true }
          );
        } catch (err) {
          set({ error: 'Failed to create list' });
          throw err;
        }
      },

      updateList: async (workspaceId, boardId, listId, data) => {
        try {
          await boardApi.updateList({ boardId, listId, nameList: data.name, position: data.position });
          await get().fetchBoardById(
            workspaceId,
            boardId,
            { silent: true }
          );
        } catch (err) {
          set({ error: 'Failed to update list' });
          throw err;
        }
      },

      //   deleteList: async (listId) => {
      //   },


      createCard: async (boardId: string, listId: string, data: { name: string, position: number }) => {
        try {
          await boardApi.createCard({
            listId,
            boardId,
            nameCard: data.name
          });
          const { currentBoard } = get();
          if (currentBoard?.id && currentBoard?.workspaceId) {
            await get().fetchBoardById(currentBoard.workspaceId, currentBoard.id, { silent: true });
          }
        } catch (err) {
          set({ error: 'Failed to create card' });
          throw err;
        }
      },

      updateCard: async (workspaceId, boardId, listId, cardId, data) => {
        try {
          await boardApi.updateCard({
            boardId,
            listId,
            cardId,
            nameCard: data.name!,
            position: data.position,
            listIdTarget: data.listIdTarget || listId
          });
          await get().fetchBoardById(
            workspaceId,
            boardId,
            { silent: true }
          );
        } catch (err) {
          set({ error: 'Failed to update card' });
          throw err;
        }
      },

      //   deleteCard: async (cardId) => {
      //   },

      clearBoards: () => set({
        boards: {},
        currentBoard: null,
        error: null
      }),

      clearError: () => set({ error: null }),

      setCurrentBoard: (updater) => set((state) => ({
        currentBoard: typeof updater === 'function' ? updater(state.currentBoard) : updater
      })),
    }),
    { name: 'board-store' }
  )
);