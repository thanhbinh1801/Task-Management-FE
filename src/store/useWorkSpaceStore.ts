import { create } from 'zustand';
import { devtools} from 'zustand/middleware';
import { apiClient } from '@/lib/api';

export interface Workspace {
    id: string;
    name: string;
    visibility?: string | null;
    boards?: Board[];
}

interface Board {
    id: string;
    name: string;
}

interface WorkSpaceState {
    workspaces: Workspace[];
    currentWorkspace: Workspace | null;
    isLoading: boolean;
    error: string | null;

    fetchWorkspaces: () => Promise<void>;
    createWorkspace: (name: string, visibility?: string) => Promise<any>;
    setCurrentWorkspace: (workspace: Workspace) => void;
    updateWorkSpace: (id: string, name: string, visibility?: string) => Promise<void>;
    deleteWorkSpace: (id: string) => Promise<void>;
    clearError: () => void;
    clearWorkspaces: () => void;
}

export const useWorkspaceStore = create<WorkSpaceState>()(
    devtools(
        (set, get) => ({
            workspaces: [],
            currentWorkspace: null,
            isLoading: false,
            error: null,

            fetchWorkspaces: async () => {
                set({ isLoading: true, error: null });
                try { 
                    const res = await apiClient.get('/workspace');
                    set({
                        workspaces: res.data.data || [],
                        isLoading: false,
                        error: null
                    });
                } catch (err: any) {
                    set({
                        isLoading: false,
                        error: err.response?.status === 404 ? null : 'Failed to load workspaces'
                    });
                }
            },

            createWorkspace: async (name, visibility) => {
                set({ isLoading: true, error: null });
                try { 
                    const payload = {
                        name: name,
                        visibility: visibility?.toUpperCase() || 'PRIVATE',
                    };

                    const res = await apiClient.post('/workspace', payload);

                    await get().fetchWorkspaces();
                    set({isLoading: false});
                    return res.data;
                }
                catch (err: any) {
                    set({
                        isLoading: false,
                        error: 'Failed to create workspace',
                    });
                    throw err;
                }
            },

            updateWorkSpace: async (id, name, visibility) => {
                try {
                    const payload = {
                        name: name,
                        visibility: visibility?.toUpperCase() || 'PRIVATE',
                    };
                    await apiClient.put(`/workspace/${id}`, payload);
                    await get().fetchWorkspaces();
                } catch (err: any) {
                    set({
                        error: 'Failed to update workspace',
                    });
                    throw err;
                }
            },

            deleteWorkSpace: async (id: string) => {
                try {
                    await apiClient.delete(`/workspace/${id}`);
                    await get().fetchWorkspaces();
                } catch (err: any) {
                    set({
                        error: 'Failed to delete workspace',
                    });
                    throw err;
                }
            },

            setCurrentWorkspace: (workspace) => {
                set({ currentWorkspace: workspace });
            },

            clearError: () => { set({ error: null }); },
            clearWorkspaces: () => {
                set({
                    workspaces: [],
                    currentWorkspace: null,
                    isLoading: false,
                    error: null,
                });
            },
        }),
        { name: 'workspace-store' }
    )
)