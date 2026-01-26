// stores/useUIStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface UIState {

  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  
  createWorkspaceModalOpen: boolean;
  createBoardModalOpen: boolean;
  setCreateWorkspaceModalOpen: (open: boolean) => void;
  setCreateBoardModalOpen: (open: boolean) => void;
  
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        sidebarOpen: true,
        createWorkspaceModalOpen: false,
        createBoardModalOpen: false,
        theme: 'light',
        
        toggleSidebar: () => set((state) => ({ 
          sidebarOpen: !state.sidebarOpen 
        })),
        
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        
        setCreateWorkspaceModalOpen: (open) => set({ 
          createWorkspaceModalOpen: open 
        }),
        
        setCreateBoardModalOpen: (open) => set({ 
          createBoardModalOpen: open 
        }),
        
        setTheme: (theme) => set({ theme }),
      }),
      {
        name: 'ui-storage',
        partialize: (state) => ({ 
          sidebarOpen: state.sidebarOpen,
          theme: state.theme
        })
      }
    )
  )
);