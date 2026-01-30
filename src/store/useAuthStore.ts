import { create } from "zustand";
import { devtools, persist } from "zustand/middleware"; 
import { apiClient } from "@/lib/api";
import { useWorkspaceStore } from "./useWorkSpaceStore";
import { useBoardStore } from "./useBoardStore";

interface User {
    id: string;
    email: string;
    name?: string;
    avatarUrl?: string;
    bio?: string;
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
    updateAvatar: (file: File) => Promise<void>;
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
                        const res = await apiClient.post<{ accessToken: string }>("/auth/login", { email, password });
                        localStorage.setItem("access-token", res.data.accessToken);

                        const meRes = await apiClient.get<{ data: User }>("/auth/me");

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
                        const res = await apiClient.get<{ data: User }>('/auth/me');
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

                updateAvatar: async (file: File) => {
                    const currentUser = useAuthStore.getState().user;
                    if (!currentUser?.id) {
                        throw new Error('User not found');
                    }

                    set({ isLoading: true, error: null });
                    try {
                        const formData = new FormData();
                        formData.append('avatar', file);

                        const avatarResponse = await apiClient.put<{ data: User }>(`/user/${currentUser.id}/avatar`, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        });

                        // Update user with avatar data from response
                        const updatedUser = avatarResponse.data.data;
                        console.log('Updated user with avatar:', updatedUser);
                        
                        set({ 
                            user: updatedUser,
                            isLoading: false,
                            error: null
                        });
                    } catch (err) {
                        set({ 
                            isLoading: false,
                            error: 'Failed to upload avatar'
                        });
                        throw err;
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