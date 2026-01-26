import { create } from "zustand";
import { devtools, persist } from "zustand/middleware"; 
import { apiClient } from "@/lib/api";
import { useWorkspaceStore } from "./useWorkSpaceStore";
import { useBoardStore } from "./useBoardStore";

interface User {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    setUser: (user: User) => void;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    fetchMe: () => Promise<void>;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set) => ({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,

                setUser: (user) => set({
                    user,
                    isAuthenticated: true,
                    error: null,
                }),

                login: async(email: string, password: string) => {
                    set({ isLoading: true, error: null });
                    try {
                        const res = await apiClient.post("/auth/login", { email, password });
                        localStorage.setItem("access-token", res.data.accessToken);

                        const meRes = await apiClient.get("/auth/me");

                        set({
                            user: meRes.data.data,
                            isAuthenticated: true,
                            isLoading: false,
                            error: null
                        });
                    } catch (err: any) {
                        set({
                            isLoading: false,
                            error: err.response?.data?.message
                        });

                        throw err;
                    }
                },

                logout: () => {
                    localStorage.removeItem('access-token');
                    set({
                        user: null,
                        isAuthenticated: false,
                        error: null,
                    });

                    useWorkspaceStore.getState().clearWorkspaces();
                    useBoardStore.getState().clearBoards();
                },

                fetchMe: async () => {
                    set({ isLoading: true });
                    try {
                        const res = await apiClient.get('/auth/me');
                        set({ 
                            user: res.data.data,
                            isAuthenticated: true,
                            isLoading: false,
                            error: null
                        });
                    } catch (err) {
                        set({ 
                            isLoading: false,
                            error: 'Failed to fetch user info'
                        });
                    }
                },
                
                clearError: () => set({ error: null }),
            }),
            {
                name: 'auth-storage',
                partialize: (state) => ({ 
                    user: state.user,
                    isAuthenticated: state.isAuthenticated
                })
            }
        )
    )
)