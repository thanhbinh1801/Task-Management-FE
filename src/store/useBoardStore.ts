// stores/useBoardStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { apiClient } from '@/lib/api';
import { useWorkspaceStore } from './useWorkSpaceStore';

export interface BoardDetail {
  id: string;
  nameBoard: string;
  workspaceId: string;
  lists: List[];
}

interface List {
  id: string;
  nameList: string;
  position: number;
  cards: Card[];
}

interface Card {
  id: string;
  nameCard: string;
  isComplete: boolean;
}

interface BoardState {
  // State
  boards: { [workspaceId: string]: any[] }; // Cache boards by workspace
  currentBoard: BoardDetail | null;
  isLoading: boolean;
  error: string | null;
  
    // Actions
  fetchBoardById: (workspaceId: string, boardId: string) => Promise<void>;
  createBoard: (data: { 
    workspaceId: string; 
    nameBoard: string 
  }) => Promise<any>;
  updateBoard: (workspaceId: string, boardId: string, data: any) => Promise<void>;
  deleteBoard: (workspaceId: string, boardId: string) => Promise<void>;
  
//   // List actions
//   createList: (boardId: string, data: any) => Promise<void>;
//   updateList: (listId: string, data: any) => Promise<void>;
//   deleteList: (listId: string) => Promise<void>;
  
//   // Card actions
//   createCard: (listId: string, data: any) => Promise<void>;
//   updateCard: (cardId: string, data: any) => Promise<void>;
//   deleteCard: (cardId: string) => Promise<void>;
  
  clearBoards: () => void;
  clearError: () => void;
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
      fetchBoardById: async (workspaceId, boardId) => {
        set({ isLoading: true, error: null });
        try {
          const res = await apiClient.get(
            `/workspace/${workspaceId}/board/${boardId}`
          );
          
          set({ 
            currentBoard: res.data.data[0], // API trả về array
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
      
      deleteBoard: async (workspaceId, boardId) => {
        try {
          await apiClient.delete(
            `/workspace/${workspaceId}/board/${boardId}`
          );
          
          // Update workspace store
          await useWorkspaceStore.getState().fetchWorkspaces();
          
          // Clear current board nếu đang xem
          const current = get().currentBoard;
          if (current?.id === boardId) {
            set({ currentBoard: null });
          }
        } catch (err) {
          set({ error: 'Failed to delete board' });
          throw err;
        }
      },
      
    //   createList: async (boardId, data) => {
    //   },
      
    //   updateList: async (listId, data) => {
    //   },
      
    //   deleteList: async (listId) => {
    //   },
      

    //   createCard: async (listId, data) => {
    //   },
      
    //   updateCard: async (cardId, data) => {
    //   },
      
    //   deleteCard: async (cardId) => {
    //   },
      
      clearBoards: () => set({ 
        boards: {},
        currentBoard: null,
        error: null
      }),
      
      clearError: () => set({ error: null }),
    }),
    { name: 'board-store' }
  )
);